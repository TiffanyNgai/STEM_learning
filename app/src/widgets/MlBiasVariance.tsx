import { useId, useMemo, useState } from 'react';
import { Btn, C, Controls, Slider, Stage, pathOf, rng, scale } from './_kit';

/**
 * Bias–variance decomposition by simulation. Many independent training sets (n noisy samples of
 * f(x) = sin(πx) on [-1, 1], one x per equal-width strip) are each fitted by (ridge) least squares with a
 * polynomial of degree k. Top: every fitted curve (faint), their average (bold), the truth (dashed).
 * Bottom: squared bias, variance, noise σ² and their sum (= expected test MSE, exact for squared loss),
 * averaged over x, for every degree 0…kMax; the current degree is highlighted.
 * props: { k?: number (initial degree, default 3), kMax?: number (default 10, ≤ 12), n?: number (points per set, default 15),
 *          noise?: number (σ, default 0.3), sets?: number (number of training sets, default 40),
 *          ridge?: boolean (show λ slider, default false), lambda?: number (initial λ, default 0), seed?: number (default 5) }
 */
const truth = (x: number) => Math.sin(Math.PI * x);

function solve(A: number[][], b: number[]): number[] {
  const n = b.length; const M = A.map((r, i) => [...r, b[i]]);
  for (let c = 0; c < n; c++) {
    let p = c; for (let r = c + 1; r < n; r++) if (Math.abs(M[r][c]) > Math.abs(M[p][c])) p = r;
    [M[c], M[p]] = [M[p], M[c]]; const piv = M[c][c] || 1e-300;
    for (let r = c + 1; r < n; r++) { const f = M[r][c] / piv; for (let k = c; k <= n; k++) M[r][k] -= f * M[c][k]; }
  }
  const w = new Array(n).fill(0);
  for (let r = n - 1; r >= 0; r--) { let s = M[r][n]; for (let k = r + 1; k < n; k++) s -= M[r][k] * w[k]; w[r] = s / (M[r][r] || 1e-300); }
  return w;
}
function fit(xs: number[], ys: number[], d: number, lam: number) {
  const p = d + 1; const A = Array.from({ length: p }, () => new Array(p).fill(0)); const b = new Array(p).fill(0);
  xs.forEach((x, i) => { const phi = Array.from({ length: p }, (_, j) => x ** j); for (let j = 0; j < p; j++) { b[j] += phi[j] * ys[i]; for (let k = 0; k < p; k++) A[j][k] += phi[j] * phi[k]; } });
  for (let j = 0; j < p; j++) A[j][j] += (j > 0 ? lam : 0) + 1e-10;
  const w = solve(A, b);
  return (x: number) => { let s = 0; for (let j = p - 1; j >= 0; j--) s = s * x + w[j]; return s; };
}
const GRID = Array.from({ length: 81 }, (_, i) => -1 + i / 40);

export default function MlBiasVariance({ k = 3, kMax = 10, n = 15, noise = 0.3, sets = 40, ridge = false, lambda = 0, seed = 5 }: {
  k?: number; kMax?: number; n?: number; noise?: number; sets?: number; ridge?: boolean; lambda?: number; seed?: number;
}) {
  const maxD = Math.max(1, Math.min(12, Math.round(kMax)));
  const N = Math.max(4, Math.min(40, Math.round(n)));
  const S = Math.max(5, Math.min(100, Math.round(sets)));
  const [d, setD] = useState(Math.max(0, Math.min(maxD, Math.round(k))));
  const [logLam, setLogLam] = useState(lambda > 0 ? Math.max(-6, Math.min(2, Math.log10(lambda))) : -7);
  const [sd, setSd] = useState(seed);
  const [showAll, setShowAll] = useState(true);
  const clip = 'mlbv' + useId().replace(/:/g, '');
  const lam = logLam <= -7 ? 0 : 10 ** logLam;

  const data = useMemo(() => {
    const r = rng(500 + sd * 7919);
    return Array.from({ length: S }, () => {
      const xs = Array.from({ length: N }, (_, i) => -1 + (2 * (i + r.u())) / N);
      return { xs, ys: xs.map((x) => truth(x) + noise * r.normal()) };
    });
  }, [sd, S, N, noise]);

  // For every degree: predictions on GRID for every set, then bias², variance (averaged over x).
  const stats = useMemo(() => Array.from({ length: maxD + 1 }, (_, deg) => {
    const preds = data.map(({ xs, ys }) => { const f = fit(xs, ys, deg, lam); return GRID.map(f); });
    let b2 = 0, v = 0; const mean = GRID.map((_, g) => preds.reduce((s, p) => s + p[g], 0) / S);
    GRID.forEach((x, g) => { b2 += (mean[g] - truth(x)) ** 2; v += preds.reduce((s, p) => s + (p[g] - mean[g]) ** 2, 0) / S; });
    return { b2: b2 / GRID.length, v: v / GRID.length, preds, mean };
  }), [data, lam, maxD, S]);

  const cur = stats[d]; const s2 = noise * noise;
  const top: [number, number, number, number] = [6, 6, 314, 128];
  const sx = scale([-1, 1], [top[0], top[2]]); const sy = scale([-2, 2], [top[3], top[1]]);
  const cy = (v: number) => Math.max(top[1] - 5, Math.min(top[3] + 5, sy(v)));
  const line = (ys: number[]) => pathOf(GRID.map((x, g) => [sx(x), cy(ys[g])] as [number, number]));

  const bot: [number, number, number, number] = [30, 166, 312, 236];
  const bx = scale([0, maxD], [bot[0] + 6, bot[2] - 6]);
  const yMax = 0.8; const by = (v: number) => scale([0, yMax], [bot[3], bot[1]])(Math.min(yMax, v));
  const series: [string, string, (i: number) => number][] = [
    ['bias²', C[2], (i) => stats[i].b2], ['variance', C[3], (i) => stats[i].v], ['σ²', 'var(--muted)', () => s2],
    ['test MSE', C[4], (i) => stats[i].b2 + stats[i].v + s2],
  ];

  return (
    <div>
      <Stage w={320} h={250} label={`Bias and variance of degree-${d} polynomial fits over ${S} training sets`}>
        <defs><clipPath id={clip}><rect x={top[0]} y={top[1]} width={top[2] - top[0]} height={top[3] - top[1]} /></clipPath></defs>
        <rect x={top[0]} y={top[1]} width={top[2] - top[0]} height={top[3] - top[1]} fill="var(--surface)" stroke="var(--grid)" />
        <g clipPath={`url(#${clip})`}>
          {showAll && cur.preds.map((p, i) => <path key={i} d={line(p)} fill="none" stroke={C[1]} strokeWidth={0.8} opacity={0.22} />)}
          <path d={line(GRID.map(truth))} fill="none" stroke="var(--fg)" strokeWidth={1.3} strokeDasharray="4 3" />
          <path d={line(cur.mean)} fill="none" stroke={C[2]} strokeWidth={2.4} />
        </g>
        <text x={top[0] + 4} y={top[1] + 11} fontSize="9" fill="var(--fg)">degree {d}{ridge ? `, λ=${lam === 0 ? '0' : lam.toPrecision(2)}` : ''}: <tspan fill={C[1]}>{S} fits</tspan> · <tspan fill={C[2]}>average fit</tspan> · dashed = truth</text>
        <text x={top[0]} y={146} fontSize="9" fill="var(--fg)">
          <tspan fill={C[2]}>bias² {cur.b2.toFixed(3)}</tspan> + <tspan fill={C[3]}>var {cur.v.toFixed(3)}</tspan> + σ² {s2.toFixed(3)} = <tspan fill={C[4]}>{(cur.b2 + cur.v + s2).toFixed(3)}</tspan>
        </text>
        <line x1={bot[0]} x2={bot[2]} y1={bot[3]} y2={bot[3]} stroke="var(--fg)" strokeWidth={0.8} />
        <line x1={bot[0]} x2={bot[0]} y1={bot[1]} y2={bot[3]} stroke="var(--fg)" strokeWidth={0.8} />
        {[0, 0.2, 0.4, 0.6, 0.8].map((v) => <g key={v}><line x1={bot[0]} x2={bot[2]} y1={by(v)} y2={by(v)} stroke="var(--grid)" strokeWidth={0.5} /><text x={bot[0] - 3} y={by(v) + 3} fontSize="7" textAnchor="end" fill="var(--muted)">{v}</text></g>)}
        {stats.map((_, i) => <text key={i} x={bx(i)} y={bot[3] + 9} fontSize="7" textAnchor="middle" fill="var(--muted)">{i}</text>)}
        <rect x={bx(d) - 5} y={bot[1]} width={10} height={bot[3] - bot[1]} fill="var(--fg)" opacity={0.08} />
        {series.map(([name, col, g], si) => <g key={name}>
          <path d={pathOf(stats.map((_, i) => [bx(i), by(g(i))]))} fill="none" stroke={col} strokeWidth={si === 3 ? 2 : 1.4} strokeDasharray={si === 2 ? '3 2' : undefined} />
          <text x={bot[0] + 4 + si * 62} y={bot[1] - 4} fontSize="8" fill={col}>● {name}</text>
        </g>)}
      </Stage>
      <Controls>
        <Slider label="degree" min={0} max={maxD} step={1} value={d} onChange={(v) => setD(Math.round(v))} format={(v) => String(v)} />
        {ridge && <Slider label="λ" min={-7} max={2} step={0.25} value={logLam} onChange={setLogLam} format={(v) => (v <= -7 ? '0' : (10 ** v).toPrecision(2))} />}
        <Btn active={showAll} onClick={() => setShowAll(!showAll)}>all fits</Btn>
        <Btn onClick={() => setSd(sd + 1)}>New draws</Btn>
      </Controls>
    </div>
  );
}
