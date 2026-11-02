import { useId, useMemo, useState } from 'react';
import { Axes, Btn, C, Controls, Slider, Stage, pathOf, rng, scale } from './_kit';

/**
 * Polynomial curve fitting (Bishop's classic): noisy samples of y = sin(2πx) + noise on [0, 1]
 * (training x stratified: one uniform draw per equal-width strip; held-out x uniform),
 * fitted by least squares with a polynomial of degree d (optionally ridge-penalized, λ·Σ_{j≥1} w_j²).
 * Top: training points (blue), held-out points (orange, hollow), true curve (dashed), fitted curve (green).
 * Bottom: training vs held-out mean squared error for every degree 0…maxDegree (log scale), current degree marked.
 * props: { n?: number (training points, default 10, 3–30), noise?: number (noise sd, default 0.25),
 *          degree?: number (initial, default 3), maxDegree?: number (default 12, ≤ 15),
 *          ridge?: boolean (show λ slider, default false), lambda?: number (initial λ, default 0),
 *          heldOutLabel?: string (name for held-out data, default 'test'), showErrors?: boolean (default true),
 *          showTruth?: boolean (default true), seed?: number (default 1) }
 */
const truth = (x: number) => Math.sin(2 * Math.PI * x);

function solve(A: number[][], b: number[]): number[] {
  const n = b.length; const M = A.map((r, i) => [...r, b[i]]);
  for (let c = 0; c < n; c++) {
    let p = c;
    for (let r = c + 1; r < n; r++) if (Math.abs(M[r][c]) > Math.abs(M[p][c])) p = r;
    [M[c], M[p]] = [M[p], M[c]];
    const piv = M[c][c] || 1e-300;
    for (let r = c + 1; r < n; r++) { const f = M[r][c] / piv; for (let k = c; k <= n; k++) M[r][k] -= f * M[c][k]; }
  }
  const w = new Array(n).fill(0);
  for (let r = n - 1; r >= 0; r--) { let s = M[r][n]; for (let k = r + 1; k < n; k++) s -= M[r][k] * w[k]; w[r] = s / (M[r][r] || 1e-300); }
  return w;
}

/** Fit degree-d polynomial in u = 2x − 1 by (ridge) least squares. */
function fit(xs: number[], ys: number[], d: number, lam: number): (x: number) => number {
  const p = d + 1; const A = Array.from({ length: p }, () => new Array(p).fill(0)); const b = new Array(p).fill(0);
  xs.forEach((x, i) => {
    const u = 2 * x - 1; const phi = Array.from({ length: p }, (_, j) => u ** j);
    for (let j = 0; j < p; j++) { b[j] += phi[j] * ys[i]; for (let k = 0; k < p; k++) A[j][k] += phi[j] * phi[k]; }
  });
  for (let j = 0; j < p; j++) A[j][j] += (j > 0 ? lam : 0) + 1e-10;
  const w = solve(A, b);
  return (x: number) => { const u = 2 * x - 1; let s = 0; for (let j = p - 1; j >= 0; j--) s = s * u + w[j]; return s; };
}
const mse = (f: (x: number) => number, xs: number[], ys: number[]) => xs.reduce((s, x, i) => s + (f(x) - ys[i]) ** 2, 0) / xs.length;

export default function MlPolyFit({ n = 10, noise = 0.25, degree = 3, maxDegree = 12, ridge = false, lambda = 0, heldOutLabel = 'test', showErrors = true, showTruth = true, seed = 1 }: {
  n?: number; noise?: number; degree?: number; maxDegree?: number; ridge?: boolean; lambda?: number;
  heldOutLabel?: string; showErrors?: boolean; showTruth?: boolean; seed?: number;
}) {
  const N = Math.max(3, Math.min(30, Math.round(n)));
  const maxD = Math.max(1, Math.min(15, Math.round(maxDegree)));
  const [d, setD] = useState(Math.min(maxD, Math.max(0, Math.round(degree))));
  const [logLam, setLogLam] = useState(lambda > 0 ? Math.max(-6, Math.min(2, Math.log10(lambda))) : -7);
  const [s, setS] = useState(seed);
  const [showHeld, setShowHeld] = useState(true);
  const [showTrue, setShowTrue] = useState(showTruth);
  const clipId = 'mlpf' + useId().replace(/:/g, '');
  const lam = logLam <= -7 ? 0 : 10 ** logLam;

  const data = useMemo(() => {
    const r = rng(1000 + s * 7919);
    const tx = Array.from({ length: N }, (_, i) => (i + r.u()) / N); // one point per equal-width strip
    const ty = tx.map((x) => truth(x) + noise * r.normal());
    const hx = Array.from({ length: 60 }, () => r.u());
    const hy = hx.map((x) => truth(x) + noise * r.normal());
    return { tx, ty, hx, hy };
  }, [s, N, noise]);

  const errs = useMemo(() => Array.from({ length: maxD + 1 }, (_, k) => {
    const f = fit(data.tx, data.ty, k, lam);
    return [mse(f, data.tx, data.ty), mse(f, data.hx, data.hy)];
  }), [data, lam, maxD]);
  const f = useMemo(() => fit(data.tx, data.ty, d, lam), [data, d, lam]);

  const top: [number, number, number, number] = [28, 8, 312, 138];
  const sx = scale([0, 1], [top[0], top[2]]); const sy = scale([-1.8, 1.8], [top[3], top[1]]);
  const clampY = (v: number) => Math.max(top[1] - 4, Math.min(top[3] + 4, sy(v)));
  const curve = (g: (x: number) => number) => pathOf(Array.from({ length: 241 }, (_, i) => { const x = i / 240; return [sx(x), clampY(g(x))] as [number, number]; }));
  const bot: [number, number, number, number] = [28, 180, 312, 244];
  const bx = scale([0, maxD], [bot[0] + 6, bot[2] - 6]); const by = scale([-3, 1], [bot[3], bot[1]]);
  const ly = (v: number) => by(Math.max(-3, Math.min(1, Math.log10(Math.max(v, 1e-9)))));
  const [trE, heE] = errs[d];

  return (
    <div>
      <Stage w={320} h={showErrors ? 258 : 166} label={`Degree ${d} polynomial fit to ${N} noisy points`}>
        <defs><clipPath id={clipId}><rect x={top[0]} y={top[1]} width={top[2] - top[0]} height={top[3] - top[1]} /></clipPath></defs>
        <Axes x={[0, 1]} y={[-1.8, 1.8]} box={top} xLabel="x" yLabel="y" />
        <g clipPath={`url(#${clipId})`}>
          {showTrue && <path d={curve(truth)} fill="none" stroke="var(--muted)" strokeWidth={1.2} strokeDasharray="4 3" />}
          <path d={curve(f)} fill="none" stroke={C[0]} strokeWidth={2.2} />
          {showHeld && data.hx.map((x, i) => <circle key={'h' + i} cx={sx(x)} cy={sy(data.hy[i])} r={2} fill="none" stroke={C[2]} strokeWidth={1} opacity={0.8} />)}
          {data.tx.map((x, i) => <circle key={'t' + i} cx={sx(x)} cy={sy(data.ty[i])} r={3.2} fill={C[1]} stroke="var(--surface)" strokeWidth={0.8} />)}
        </g>
        <text x={top[0]} y={161} fontSize="9" fill="var(--fg)">
          degree {d}{ridge ? `, λ = ${lam === 0 ? '0' : lam.toPrecision(2)}` : ''}:
          <tspan fill={C[1]}> train MSE {trE.toFixed(3)}</tspan>
          <tspan fill={C[2]}> · {heldOutLabel} MSE {heE > 99 ? heE.toExponential(1) : heE.toFixed(3)}</tspan>
        </text>
        {showErrors && <g>
          <line x1={bot[0]} x2={bot[2]} y1={bot[3]} y2={bot[3]} stroke="var(--fg)" strokeWidth={0.8} />
          <line x1={bot[0]} x2={bot[0]} y1={bot[1]} y2={bot[3]} stroke="var(--fg)" strokeWidth={0.8} />
          {[-3, -2, -1, 0, 1].map((e) => <g key={e}>
            <line x1={bot[0]} x2={bot[2]} y1={by(e)} y2={by(e)} stroke="var(--grid)" strokeWidth={0.5} />
            <text x={bot[0] - 3} y={by(e) + 3} fontSize="7" textAnchor="end" fill="var(--muted)">{e === 0 ? '1' : `1e${e}`}</text>
          </g>)}
          {errs.map((_, k) => <text key={k} x={bx(k)} y={bot[3] + 9} fontSize="7" textAnchor="middle" fill="var(--muted)">{k}</text>)}
          <rect x={bx(d) - 5} y={bot[1]} width={10} height={bot[3] - bot[1]} fill="var(--fg)" opacity={0.08} />
          <path d={pathOf(errs.map((e, k) => [bx(k), ly(e[0])]))} fill="none" stroke={C[1]} strokeWidth={1.6} />
          <path d={pathOf(errs.map((e, k) => [bx(k), ly(e[1])]))} fill="none" stroke={C[2]} strokeWidth={1.6} />
          {errs.map((e, k) => <g key={'p' + k}><circle cx={bx(k)} cy={ly(e[0])} r={k === d ? 3 : 1.6} fill={C[1]} /><circle cx={bx(k)} cy={ly(e[1])} r={k === d ? 3 : 1.6} fill={C[2]} /></g>)}
          <text x={bot[0] + 3} y={bot[1] - 3} fontSize="8" fill="var(--fg)">MSE (log scale) vs degree</text>
          <text x={bot[2]} y={bot[1] - 3} fontSize="8" textAnchor="end"><tspan fill={C[1]}>● train</tspan><tspan fill={C[2]}>  ● {heldOutLabel}</tspan></text>
        </g>}
      </Stage>
      <Controls>
        <Slider label="degree" min={0} max={maxD} step={1} value={d} onChange={(v) => setD(Math.round(v))} format={(v) => String(v)} />
        {ridge && <Slider label="λ" min={-7} max={2} step={0.25} value={logLam} onChange={setLogLam} format={(v) => (v <= -7 ? '0' : (10 ** v).toPrecision(2))} />}
        <Btn onClick={() => setS(s + 1)}>New data</Btn>
        <Btn active={showHeld} onClick={() => setShowHeld(!showHeld)}>{heldOutLabel} points</Btn>
        <Btn active={showTrue} onClick={() => setShowTrue(!showTrue)}>True curve</Btn>
      </Controls>
    </div>
  );
}
