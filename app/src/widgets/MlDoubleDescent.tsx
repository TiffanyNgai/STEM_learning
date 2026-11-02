import { useMemo, useState } from 'react';
import { Btn, C, Controls, Slider, Stage, pathOf, rng, scale } from './_kit';

/**
 * Model-wise double descent in linear regression (the "weak features" model).
 * Inputs x ∈ R^D have i.i.d. N(0,1) coordinates; y = xᵀβ + noise (sd σ), with ‖β‖ = 1 spread evenly
 * over all D coordinates. The model uses only the first p features and is fitted to n training points by
 * least squares; when p > n the fit interpolates and the MINIMUM-NORM solution is used (λ = 0), or ridge with λ.
 * Test MSE is computed exactly for each fitted ŵ:  σ² + ‖ŵ − β_{1..p}‖² + ‖β_{p+1..D}‖², averaged over training sets.
 * Plot: test MSE (log scale) and training MSE vs p, with the interpolation threshold p = n marked.
 * props: { n?: number (training points, default 30), D?: number (total features, default 100),
 *          noise?: number (σ, default 0.5), lambda?: number (initial ridge λ, default 0),
 *          showLambda?: boolean (λ slider, default true), trials?: number (training sets averaged, default 12), seed?: number (default 7) }
 */
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
/** Ridge / min-norm least-squares fits on the first p columns of X for every p = 1..D (incremental Gram matrices). */
function fitAll(X: number[][], y: number[], D: number, lam: number): number[][] {
  const n = X.length; const eps = lam + 1e-9; const out: number[][] = [];
  const G = Array.from({ length: D }, (_, i) => Array.from({ length: D }, (_, j) => { let s = 0; for (let r = 0; r < n; r++) s += X[r][i] * X[r][j]; return s; }));
  const Xy = Array.from({ length: D }, (_, i) => { let s = 0; for (let r = 0; r < n; r++) s += X[r][i] * y[r]; return s; });
  const K = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let p = 1; p <= D; p++) {
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) K[i][j] += X[i][p - 1] * X[j][p - 1];
    if (p <= n) {
      out.push(solve(Array.from({ length: p }, (_, i) => Array.from({ length: p }, (_, j) => G[i][j] + (i === j ? eps : 0))), Xy.slice(0, p)));
    } else {
      const a = solve(K.map((row, i) => row.map((v, j) => v + (i === j ? eps : 0))), y);
      out.push(Array.from({ length: p }, (_, c) => { let s = 0; for (let r = 0; r < n; r++) s += X[r][c] * a[r]; return s; }));
    }
  }
  return out;
}

export default function MlDoubleDescent({ n = 30, D = 100, noise = 0.5, lambda = 0, showLambda = true, trials = 12, seed = 7 }: {
  n?: number; D?: number; noise?: number; lambda?: number; showLambda?: boolean; trials?: number; seed?: number;
}) {
  const DD = Math.max(20, Math.min(160, Math.round(D)));
  const [nn, setN] = useState(Math.max(5, Math.min(DD - 10, Math.round(n))));
  const [sig, setSig] = useState(noise);
  const [logLam, setLogLam] = useState(lambda > 0 ? Math.max(-3, Math.min(2, Math.log10(lambda))) : -4);
  const [sd, setSd] = useState(seed);
  const lam = logLam <= -4 ? 0 : 10 ** logLam;
  const T = Math.max(4, Math.min(40, Math.round(trials)));
  const beta = 1 / Math.sqrt(DD);

  const ps = useMemo(() => Array.from({ length: DD }, (_, i) => i + 1), [DD]);
  const curve = useMemo(() => {
    const sets = Array.from({ length: T }, (_, t) => {
      const r = rng(1000 + 31 * sd + t);
      const X = Array.from({ length: nn }, () => Array.from({ length: DD }, () => r.normal()));
      const y = X.map((row) => row.reduce((s, v) => s + v * beta, 0) + sig * r.normal());
      return { X, y };
    });
    const acc = ps.map(() => [0, 0]);
    for (const { X, y } of sets) {
      fitAll(X, y, DD, lam).forEach((w, k) => {
        const p = k + 1;
        let risk = sig * sig + (DD - p) * beta * beta;
        for (let j = 0; j < p; j++) risk += (w[j] - beta) ** 2;
        acc[k][1] += risk / T;
        acc[k][0] += X.reduce((s, row, i) => { let q = 0; for (let j = 0; j < p; j++) q += row[j] * w[j]; return s + (q - y[i]) ** 2; }, 0) / nn / T;
      });
    }
    return acc;
  }, [ps, nn, sig, lam, sd, T, DD, beta]);

  const box: [number, number, number, number] = [30, 14, 312, 176];
  const sx = scale([1, DD], [box[0], box[2]]);
  const lo = -2, hi = 2;
  const sy = (v: number) => scale([lo, hi], [box[3], box[1]])(Math.max(lo, Math.min(hi, Math.log10(Math.max(v, 1e-6)))));
  const best = curve.reduce((b, c, i) => (c[1] < curve[b][1] ? i : b), 0);

  return (
    <div>
      <Stage w={320} h={200} label="Test and training error versus number of features, showing double descent">
        <rect x={box[0]} y={box[1]} width={box[2] - box[0]} height={box[3] - box[1]} fill="var(--surface)" stroke="var(--grid)" />
        {[-2, -1, 0, 1, 2].map((e) => <g key={e}><line x1={box[0]} x2={box[2]} y1={sy(10 ** e)} y2={sy(10 ** e)} stroke="var(--grid)" strokeWidth={0.5} /><text x={box[0] - 3} y={sy(10 ** e) + 3} fontSize="7" textAnchor="end" fill="var(--muted)">{e === 0 ? '1' : `1e${e}`}</text></g>)}
        {[1, Math.round(DD / 4), Math.round(DD / 2), Math.round((3 * DD) / 4), DD].map((v) => <text key={v} x={sx(v)} y={box[3] + 10} fontSize="7" textAnchor="middle" fill="var(--muted)">{v}</text>)}
        <line x1={sx(nn)} x2={sx(nn)} y1={box[1]} y2={box[3]} stroke="var(--fg)" strokeDasharray="3 3" strokeWidth={0.8} />
        <text x={sx(nn) + 3} y={box[1] + 9} fontSize="8" fill="var(--fg)">p = n = {nn} (interpolation threshold)</text>
        <line x1={box[0]} x2={box[2]} y1={sy(sig * sig)} y2={sy(sig * sig)} stroke="var(--muted)" strokeDasharray="2 2" />
        <path d={pathOf(curve.map((c, i) => [sx(ps[i]), sy(c[0])]))} fill="none" stroke={C[1]} strokeWidth={1.6} />
        <path d={pathOf(curve.map((c, i) => [sx(ps[i]), sy(c[1])]))} fill="none" stroke={C[4]} strokeWidth={2.2} />
        <circle cx={sx(ps[best])} cy={sy(curve[best][1])} r={3} fill={C[4]} />
        <text x={box[2] - 3} y={box[3] - 6} fontSize="8" textAnchor="end"><tspan fill={C[1]}>● train MSE</tspan><tspan fill={C[4]}>  ● test MSE</tspan><tspan fill="var(--muted)">  - - σ²</tspan></text>
        <text x={box[0]} y={196} fontSize="8" fill="var(--fg)">p = number of features used · best test MSE {curve[best][1].toFixed(2)} at p = {ps[best]}{lam > 0 ? ` · λ = ${lam.toPrecision(2)}` : ' · λ = 0 (min-norm)'}</text>
      </Stage>
      <Controls>
        <Slider label="n (train)" min={10} max={Math.min(80, DD - 10)} step={1} value={nn} onChange={(v) => setN(Math.round(v))} format={(v) => String(v)} />
        <Slider label="noise σ" min={0} max={1.5} step={0.05} value={sig} onChange={setSig} />
        {showLambda && <Slider label="ridge λ" min={-4} max={2} step={0.25} value={logLam} onChange={setLogLam} format={(v) => (v <= -4 ? '0' : (10 ** v).toPrecision(2))} />}
        <Btn onClick={() => setSd(sd + 1)}>New draws</Btn>
      </Controls>
    </div>
  );
}
