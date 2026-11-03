import { useMemo, useState } from 'react';
import { Btn, Controls, PlayPause, Slider, Stage, pathOf, prefersReducedMotion, rng, scale, useFrame } from './_kit';

/**
 * Tree ensembles for 1D regression on noisy samples of y = sin(πx), x ∈ [-1, 1].
 *  - 'bagging':  B regression trees, each fitted (least squares, to a maximum depth) on its own bootstrap sample.
 *    Faint lines = individual trees (first 12), bold = their average, dashed = truth.
 *  - 'boosting': least-squares gradient boosting. F₀ = mean(y); each round fits a depth-d tree hₘ to the
 *    current residuals rᵢ = yᵢ − Fₘ₋₁(xᵢ) (the negative gradient of ½(y − F)²) and sets Fₘ = Fₘ₋₁ + ν hₘ.
 *    The lower panel shows the residuals that round m fitted and the tree hₘ.
 * Both report training MSE and test MSE (on 200 fresh noisy points from the same distribution).
 * props: {
 *   mode?: 'bagging'|'boosting'   (default 'boosting')
 *   rounds?: number               initial B (bagging) or M (boosting) (default 1)
 *   maxRounds?: number            slider maximum (default 100 boosting, 50 bagging)
 *   depth?: number                tree depth (default 1 = stumps for boosting, 6 for bagging)
 *   lr?: number                   boosting learning rate ν (default 0.3)
 *   n?: number                    training points (default 40)
 *   noise?: number                noise sd (default 0.3)
 *   seed?: number                 (default 2)
 * }
 */
type T = { leaf: true; v: number } | { leaf: false; t: number; l: T; r: T };
const f0 = (x: number) => Math.sin(Math.PI * x);
/** Least-squares regression tree on (xs, ys) sorted by x. */
function fit(xs: number[], ys: number[], depth: number): T {
  const n = ys.length; const mean = ys.reduce((a, b) => a + b, 0) / Math.max(n, 1);
  if (depth <= 0 || n < 2) return { leaf: true, v: mean };
  const S = ys.reduce((a, b) => a + b, 0); let sl = 0; let best = -Infinity; let k0 = -1;
  for (let k = 1; k < n; k++) {
    sl += ys[k - 1];
    if (xs[k] === xs[k - 1]) continue;
    const g = (sl * sl) / k + ((S - sl) * (S - sl)) / (n - k); // maximizing this minimizes the SSE of the two children
    if (g > best) { best = g; k0 = k; }
  }
  if (k0 < 0) return { leaf: true, v: mean };
  return { leaf: false, t: (xs[k0] + xs[k0 - 1]) / 2, l: fit(xs.slice(0, k0), ys.slice(0, k0), depth - 1), r: fit(xs.slice(k0), ys.slice(k0), depth - 1) };
}
const ev = (t: T, x: number): number => (t.leaf ? t.v : ev(x <= t.t ? t.l : t.r, x));

export default function MlTreeEnsemble1D({ mode = 'boosting', rounds = 1, maxRounds, depth, lr = 0.3, n = 40, noise = 0.3, seed = 2 }: {
  mode?: 'bagging' | 'boosting'; rounds?: number; maxRounds?: number; depth?: number; lr?: number; n?: number; noise?: number; seed?: number;
}) {
  const boost = mode === 'boosting';
  const mx = maxRounds ?? (boost ? 100 : 50);
  const [M, setM] = useState(rounds);
  const [d, setD] = useState(depth ?? (boost ? 1 : 6));
  const [nu, setNu] = useState(lr);
  const [running, setRunning] = useState(false);
  const [acc, setAcc] = useState(0);
  useFrame((dt) => {
    const a = acc + dt * (boost ? 8 : 4);
    if (a >= 1) { setAcc(0); setM((m) => { if (m >= mx) { setRunning(false); return m; } return m + 1; }); } else setAcc(a);
  }, running && !prefersReducedMotion());

  const { xs, ys, tx, ty } = useMemo(() => {
    const r = rng(seed); const xs = Array.from({ length: n }, () => -1 + 2 * r.u()).sort((a, b) => a - b);
    const ys = xs.map((x) => f0(x) + noise * r.normal());
    const tx = Array.from({ length: 200 }, () => -1 + 2 * r.u()); const ty = tx.map((x) => f0(x) + noise * r.normal());
    return { xs, ys, tx, ty };
  }, [n, noise, seed]);

  const ens = useMemo(() => {
    const r = rng(seed + 100);
    if (!boost) {
      const trees: T[] = [];
      for (let b = 0; b < mx; b++) {
        const idx = xs.map(() => Math.floor(r.u() * xs.length)).sort((a, c) => a - c);
        trees.push(fit(idx.map((i) => xs[i]), idx.map((i) => ys[i]), d));
      }
      return { trees, F0: 0, res: [] as number[][] };
    }
    const F0 = ys.reduce((a, b) => a + b, 0) / ys.length; let F = xs.map(() => F0); const trees: T[] = []; const res: number[][] = [];
    for (let m = 0; m < mx; m++) {
      const rr = ys.map((y, i) => y - F[i]); res.push(rr);
      const h = fit(xs, rr, d); trees.push(h); F = F.map((v, i) => v + nu * ev(h, xs[i]));
    }
    return { trees, F0, res };
  }, [xs, ys, boost, d, nu, mx, seed]);

  const Mc = Math.max(boost ? 0 : 1, Math.min(M, mx));
  const pred = (x: number) => boost ? ens.trees.slice(0, Mc).reduce((s, h) => s + nu * ev(h, x), ens.F0)
    : ens.trees.slice(0, Mc).reduce((s, h) => s + ev(h, x), 0) / Mc;
  const mse = (X: number[], Y: number[]) => X.reduce((s, x, i) => s + (pred(x) - Y[i]) ** 2, 0) / X.length;

  const lower = boost && Mc > 0;
  const top: [number, number, number, number] = [6, 6, 314, lower ? 120 : 170];
  const sx = scale([-1, 1], [top[0], top[2]]); const sy = scale([-1.9, 1.9], [top[3], top[1]]);
  const XG = Array.from({ length: 241 }, (_, i) => -1 + i / 120);
  const curve = (g: (x: number) => number, yy = sy) => pathOf(XG.map((x) => [sx(x), yy(g(x))] as [number, number]));
  const by = scale([-1.5, 1.5], [184, 128]);

  return (
    <div>
      <Stage label={boost ? 'Gradient boosting with regression trees' : 'Bagging regression trees'}>
        <rect x={top[0]} y={top[1]} width={top[2] - top[0]} height={top[3] - top[1]} fill="var(--surface)" stroke="var(--grid)" />
        <path d={curve(f0)} fill="none" stroke="var(--muted)" strokeDasharray="4 3" strokeWidth={1.2} />
        {!boost && ens.trees.slice(0, Math.min(Mc, 12)).map((h, i) => <path key={i} d={curve((x) => ev(h, x))} fill="none" stroke="var(--c3)" strokeWidth={0.8} opacity={0.45} />)}
        {xs.map((x, i) => <circle key={i} cx={sx(x)} cy={sy(ys[i])} r={2.4} fill="var(--fg)" />)}
        <path d={curve(pred)} fill="none" stroke="var(--c2)" strokeWidth={2.2} />
        {lower && <g>
          <rect x={6} y={128} width={308} height={56} fill="var(--surface)" stroke="var(--grid)" />
          <line x1={6} x2={314} y1={by(0)} y2={by(0)} stroke="var(--grid)" />
          {xs.map((x, i) => <circle key={i} cx={sx(x)} cy={by(ens.res[Mc - 1][i])} r={2} fill="var(--c5)" />)}
          <path d={curve((x) => ev(ens.trees[Mc - 1], x), by)} fill="none" stroke="var(--c4)" strokeWidth={1.8} />
          <text x={10} y={137} fontSize="8" fill="var(--muted)">round {Mc}: residuals y − F{'ₘ₋₁'} (dots) and the tree h{'ₘ'} fitted to them</text>
        </g>}
        <text x={6} y={196} fontSize="8.5" fill="var(--fg)">
          {boost ? `M = ${Mc} trees · ν = ${nu.toFixed(2)}` : `B = ${Mc} trees`} · depth {d} · train MSE {mse(xs, ys).toFixed(3)} · test MSE {mse(tx, ty).toFixed(3)}
        </text>
      </Stage>
      <Controls>
        <Slider label={boost ? 'rounds M' : 'trees B'} min={boost ? 0 : 1} max={mx} step={1} value={Mc} onChange={setM} />
        <Btn onClick={() => setM(Math.min(mx, Mc + 1))}>+1</Btn>
        <PlayPause running={running} set={(v) => { if (v && Mc >= mx) setM(boost ? 0 : 1); setRunning(v); }} />
        <Slider label="tree depth" min={1} max={8} step={1} value={d} onChange={setD} />
        {boost && <Slider label="learning rate ν" min={0.05} max={1} step={0.05} value={nu} onChange={setNu} />}
      </Controls>
    </div>
  );
}
