import { useMemo, useState, type PointerEvent } from 'react';
import { Btn, C, Controls, Slider, Stage, pathOf, rng, scale } from './_kit';

/**
 * Least-squares fit of a model that is linear in its parameters, y ≈ Σ_j w_j φ_j(x), to noisy 1D data.
 * Solves the (optionally ridge-regularized) normal equations (ΦᵀΦ + λI) w = Φᵀy exactly.
 * Tap the plot to add a data point.
 * props: {
 *   model?: 'poly'|'rbf'   feature map: polynomial 1,x,…,x^k or constant + k Gaussian bumps (default 'poly')
 *   k?: number             degree (poly) or number of Gaussian centres (rbf) (default 1 = straight line for poly)
 *   kMax?: number          slider maximum for k (default 12)
 *   rbfWidth?: number      Gaussian width s in φ(x)=exp(-(x-c)²/(2s²)); default = spacing of the centres
 *   lambda?: number        ridge penalty λ (default 0); the bias weight is never penalized
 *   showLambda?: boolean   show a log-scale λ slider (default false)
 *   truth?: 'sin'|'line'|'quad'  function that generated the data (default 'sin')
 *   n?: number             number of data points (default 12)
 *   noise?: number         noise standard deviation (default 0.2)
 *   seed?: number          random seed for the data (default 3)
 *   showResiduals?: boolean  draw vertical residual segments (default true)
 *   showBases?: boolean    draw each weighted basis function w_j φ_j(x) faintly (default false)
 *   showTruth?: boolean    draw the true generating function dashed (default false)
 *   controls?: boolean     show model buttons and the k slider (default true)
 * x lives in [-1, 1], y in [-1.8, 1.8].
 */
type Model = 'poly' | 'rbf';
const TRUTH: Record<string, (x: number) => number> = {
  sin: (x) => Math.sin(Math.PI * x),
  line: (x) => 0.8 * x + 0.2,
  quad: (x) => 1.6 * x * x - 0.8,
};

function solve(A: number[][], b: number[]): number[] {
  const n = b.length; const M = A.map((r, i) => [...r, b[i]]);
  for (let c = 0; c < n; c++) {
    let p = c; for (let r = c + 1; r < n; r++) if (Math.abs(M[r][c]) > Math.abs(M[p][c])) p = r;
    [M[c], M[p]] = [M[p], M[c]];
    if (Math.abs(M[c][c]) < 1e-14) M[c][c] = 1e-14;
    for (let r = c + 1; r < n; r++) { const f = M[r][c] / M[c][c]; for (let k = c; k <= n; k++) M[r][k] -= f * M[c][k]; }
  }
  const w = new Array(n).fill(0);
  for (let r = n - 1; r >= 0; r--) { let s = M[r][n]; for (let k = r + 1; k < n; k++) s -= M[r][k] * w[k]; w[r] = s / M[r][r]; }
  return w;
}

export default function MlLeastSquaresFit({ model = 'poly', k = 1, kMax = 12, rbfWidth, lambda = 0, showLambda = false, truth = 'sin', n = 12, noise = 0.2, seed = 3, showResiduals = true, showBases = false, showTruth = false, controls = true }: {
  model?: Model; k?: number; kMax?: number; rbfWidth?: number; lambda?: number; showLambda?: boolean; truth?: 'sin' | 'line' | 'quad'; n?: number; noise?: number; seed?: number;
  showResiduals?: boolean; showBases?: boolean; showTruth?: boolean; controls?: boolean;
}) {
  const f = TRUTH[truth] ?? TRUTH.sin;
  const base = useMemo(() => {
    const r = rng(seed); const pts: [number, number][] = [];
    for (let i = 0; i < n; i++) { const x = -0.95 + (1.9 * (i + 0.15 + 0.7 * r.u())) / n; pts.push([x, f(x) + noise * r.normal()]); }
    return pts;
  }, [seed, n, noise, f]);
  const [extra, setExtra] = useState<[number, number][]>([]);
  const [mdl, setMdl] = useState<Model>(model);
  const [deg, setDeg] = useState(k);
  const [logLam, setLogLam] = useState(lambda > 0 ? Math.log10(lambda) : -8);
  const [bases, setBases] = useState(showBases);
  const data = [...base, ...extra];
  const lam = logLam <= -8 ? 0 : 10 ** logLam;

  const feats = useMemo(() => {
    if (mdl === 'poly') return Array.from({ length: deg + 1 }, (_, j) => (x: number) => x ** j);
    const m = Math.max(1, deg); const s = rbfWidth ?? (m > 1 ? 2 / (m - 1) : 1);
    const cs = Array.from({ length: m }, (_, j) => (m > 1 ? -1 + (2 * j) / (m - 1) : 0));
    return [() => 1, ...cs.map((c) => (x: number) => Math.exp(-((x - c) ** 2) / (2 * s * s)))];
  }, [mdl, deg, rbfWidth]);

  const p = feats.length;
  const A = Array.from({ length: p }, (_, i) => Array.from({ length: p }, (_, j) => data.reduce((s, [x]) => s + feats[i](x) * feats[j](x), 0) + (i === j ? (i > 0 ? lam : 0) + 1e-10 : 0)));
  const bv = Array.from({ length: p }, (_, i) => data.reduce((s, [x, y]) => s + feats[i](x) * y, 0));
  const w = solve(A, bv);
  const pred = (x: number) => feats.reduce((s, g, j) => s + w[j] * g(x), 0);
  const mse = data.reduce((s, [x, y]) => s + (pred(x) - y) ** 2, 0) / data.length;

  const box: [number, number, number, number] = [6, 6, 314, 184];
  const sx = scale([-1, 1], [box[0], box[2]]); const sy = scale([-1.8, 1.8], [box[3], box[1]]);
  const clampY = (v: number) => Math.max(-20, Math.min(220, sy(v)));
  const curve = (g: (x: number) => number) => pathOf(Array.from({ length: 161 }, (_, i) => { const x = -1 + i / 80; return [sx(x), clampY(g(x))] as [number, number]; }));
  const onTap = (e: PointerEvent<SVGRectElement>) => {
    const svg = e.currentTarget.ownerSVGElement; const m = svg?.getScreenCTM(); if (!svg || !m) return;
    const pt = svg.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY; const q = pt.matrixTransform(m.inverse());
    const x = -1 + (2 * (q.x - box[0])) / (box[2] - box[0]); const y = 1.8 - (3.6 * (q.y - box[1])) / (box[3] - box[1]);
    if (Math.abs(x) <= 1 && Math.abs(y) <= 1.8) setExtra((v) => [...v, [x, y]]);
  };

  return (
    <div>
      <Stage label="Least-squares fit of a linear-in-parameters model">
        <rect x={box[0]} y={box[1]} width={box[2] - box[0]} height={box[3] - box[1]} fill="var(--surface)" stroke="var(--grid)" onPointerDown={onTap} style={{ cursor: 'crosshair' }} />
        <clipPath id="mlls-clip"><rect x={box[0]} y={box[1]} width={box[2] - box[0]} height={box[3] - box[1]} /></clipPath>
        <line x1={box[0]} x2={box[2]} y1={sy(0)} y2={sy(0)} stroke="var(--grid)" pointerEvents="none" />
        <g clipPath="url(#mlls-clip)" pointerEvents="none">
          {bases && feats.map((g, j) => <path key={j} d={curve((x) => w[j] * g(x))} fill="none" stroke={C[(j % 5) + 1]} strokeWidth={1} opacity={0.45} />)}
          {showTruth && <path d={curve(f)} fill="none" stroke="var(--muted)" strokeWidth={1.2} strokeDasharray="4 3" />}
          {showResiduals && data.map(([x, y], i) => <line key={'r' + i} x1={sx(x)} x2={sx(x)} y1={sy(y)} y2={clampY(pred(x))} stroke="var(--c5)" strokeWidth={1.2} />)}
          <path d={curve(pred)} fill="none" stroke="var(--c2)" strokeWidth={2.2} />
        </g>
        {data.map(([x, y], i) => <circle key={i} cx={sx(x)} cy={sy(y)} r={3} fill={i >= base.length ? 'var(--c3)' : 'var(--fg)'} pointerEvents="none" />)}
        <text x={box[0] + 4} y={196} fontSize="9" fill="var(--fg)">{p} parameters · training MSE {mse.toFixed(3)}{lam > 0 ? ` · λ=${lam.toPrecision(2)}` : ''}</text>
        <text x={box[2] - 4} y={196} fontSize="8" textAnchor="end" fill="var(--muted)">tap to add a point</text>
      </Stage>
      <Controls>
        {controls && <>
          <Btn active={mdl === 'poly'} onClick={() => setMdl('poly')}>polynomial</Btn>
          <Btn active={mdl === 'rbf'} onClick={() => setMdl('rbf')}>Gaussian RBF</Btn>
          <Slider label={mdl === 'poly' ? 'degree k' : 'centres k'} min={mdl === 'poly' ? 0 : 1} max={kMax} step={1} value={deg} onChange={setDeg} />
        </>}
        {showLambda && <Slider label="log₁₀ λ" min={-8} max={1} step={0.25} value={logLam} onChange={setLogLam} format={(v) => (v <= -8 ? 'λ=0' : v.toFixed(2))} />}
        <Btn active={bases} onClick={() => setBases(!bases)}>show w·φ</Btn>
        {extra.length > 0 && <Btn onClick={() => setExtra([])}>Reset points</Btn>}
      </Controls>
    </div>
  );
}
