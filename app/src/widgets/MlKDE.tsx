import { useMemo, useState } from 'react';
import { Axes, Btn, Controls, Slider, Stage, pathOf, rng, scale } from './_kit';

/**
 * Kernel density estimation in 1D. A sample of n points (rug ticks) is drawn from a known two-bump
 * density f(x) = 0.6·N(−1, 0.5²) + 0.4·N(1.5, 0.8²) (dashed, "true"). The KDE
 * f̂(x) = (1/(nh)) Σ K((x − xᵢ)/h) (solid) is the sum of one scaled kernel bump per point (thin curves,
 * drawn for n ≤ 60). Slide the bandwidth h: small h → spiky, high variance; large h → oversmoothed, high bias.
 * "Silverman h" applies the rule of thumb h = 0.9·min(σ̂, IQR/1.34)·n^(−1/5).
 * The integrated squared error ISE = ∫(f̂ − f)² is shown. Optional histogram with bin width 2h.
 * props: {
 *   n?: number            sample size, 5–400 (default 30)
 *   h?: number            initial bandwidth (default 0.4)
 *   kernel?: 'gaussian'|'box'|'epanechnikov'  (default 'gaussian')
 *   showKernels?: boolean draw the individual bumps (default true)
 *   showTrue?: boolean    draw the true density (default true)
 *   showHist?: boolean    draw a histogram initially (default false)
 *   seed?: number         (default 3)
 *   controls?: boolean    show n slider and kernel buttons (default true)
 * }
 */
const SQ2PI = Math.sqrt(2 * Math.PI);
const kern = {
  gaussian: (u: number) => Math.exp(-0.5 * u * u) / SQ2PI,
  box: (u: number) => (Math.abs(u) <= 1 ? 0.5 : 0),
  epanechnikov: (u: number) => (Math.abs(u) <= 1 ? 0.75 * (1 - u * u) : 0),
};
type KName = keyof typeof kern;
const nrm = (x: number, m: number, s: number) => Math.exp(-0.5 * ((x - m) / s) ** 2) / (s * SQ2PI);
const truth = (x: number) => 0.6 * nrm(x, -1, 0.5) + 0.4 * nrm(x, 1.5, 0.8);

export default function MlKDE({ n: n0 = 30, h: h0 = 0.4, kernel = 'gaussian', showKernels = true, showTrue = true, showHist = false, seed = 3, controls = true }: {
  n?: number; h?: number; kernel?: KName; showKernels?: boolean; showTrue?: boolean; showHist?: boolean; seed?: number; controls?: boolean;
}) {
  const [n, setN] = useState(Math.max(5, Math.min(400, Math.round(n0))));
  const [h, setH] = useState(h0);
  const [kn, setKn] = useState<KName>(kernel);
  const [hist, setHist] = useState(showHist);
  const [sd, setSd] = useState(seed);
  const pool = useMemo(() => {
    const r = rng(sd); return Array.from({ length: 400 }, () => (r.u() < 0.6 ? -1 + 0.5 * r.normal() : 1.5 + 0.8 * r.normal()));
  }, [sd]);
  const xs = pool.slice(0, n);
  const K = kern[kn];
  const X: [number, number] = [-4, 5]; const Y: [number, number] = [0, 0.7];
  const box: [number, number, number, number] = [24, 8, 314, 168];
  const sx = scale(X, [box[0], box[2]]); const sy = scale(Y, [box[3], box[1]]);
  const grid = Array.from({ length: 241 }, (_, i) => X[0] + ((X[1] - X[0]) * i) / 240);
  const fh = (x: number) => xs.reduce((s, xi) => s + K((x - xi) / h), 0) / (n * h);
  const est = grid.map((x) => fh(x));
  const dx = (X[1] - X[0]) / 240;
  const ise = grid.reduce((s, x, i) => s + (est[i] - truth(x)) ** 2, 0) * dx;
  const clip = (v: number) => Math.min(v, Y[1] * 1.05);
  const silverman = () => {
    const m = xs.reduce((s, v) => s + v, 0) / n; const sdv = Math.sqrt(xs.reduce((s, v) => s + (v - m) ** 2, 0) / (n - 1));
    const so = [...xs].sort((a, b) => a - b); const q = (p: number) => so[Math.min(n - 1, Math.max(0, Math.round(p * (n - 1))))];
    const iqr = q(0.75) - q(0.25);
    return 0.9 * Math.min(sdv, iqr > 0 ? iqr / 1.34 : sdv) * Math.pow(n, -0.2);
  };
  const bars = [];
  if (hist) {
    const w = 2 * h; const start = Math.floor(X[0] / w) * w;
    for (let a = start; a < X[1]; a += w) {
      const c = xs.filter((v) => v >= a && v < a + w).length; if (!c) continue;
      const ht = clip(c / (n * w));
      bars.push(<rect key={a} x={sx(Math.max(a, X[0]))} y={sy(ht)} width={sx(Math.min(a + w, X[1])) - sx(Math.max(a, X[0]))} height={sy(0) - sy(ht)} fill="var(--c4)" opacity={0.22} stroke="var(--c4)" strokeWidth={0.4} />);
    }
  }
  return (
    <div>
      <Stage w={320} h={190} label="Kernel density estimate with adjustable bandwidth">
        <Axes x={X} y={Y} box={box} xLabel="x" yLabel="density" />
        {bars}
        {showKernels && n <= 60 && xs.map((xi, j) => <path key={j} d={pathOf(grid.filter((x) => Math.abs(x - xi) < 4 * h + 0.1).map((x) => [sx(x), sy(clip(K((x - xi) / h) / (n * h)))]))} fill="none" stroke="var(--c2)" strokeWidth={0.6} opacity={0.55} />)}
        {showTrue && <path d={pathOf(grid.map((x) => [sx(x), sy(truth(x))]))} fill="none" stroke="var(--fg)" strokeWidth={1.1} strokeDasharray="4 3" />}
        <path d={pathOf(grid.map((x, i) => [sx(x), sy(clip(est[i]))]))} fill="none" stroke="var(--c3)" strokeWidth={2} />
        {xs.map((xi, j) => <line key={'r' + j} x1={sx(xi)} x2={sx(xi)} y1={box[3]} y2={box[3] - 6} stroke="var(--c2)" strokeWidth={0.8} />)}
        <g fontSize="8.5">
          <text x={box[2] - 2} y={20} textAnchor="end" fill="var(--c3)">KDE f̂, h = {h.toFixed(2)}</text>
          {showTrue && <text x={box[2] - 2} y={31} textAnchor="end" fill="var(--fg)">true f (dashed)</text>}
          <text x={box[2] - 2} y={42} textAnchor="end" fill="var(--muted)">n = {n} · {kn}</text>
          {showTrue && <text x={box[2] - 2} y={53} textAnchor="end" fill="var(--muted)">ISE = {ise.toFixed(4)}</text>}
        </g>
      </Stage>
      <Controls>
        <Slider label="bandwidth h" min={0.03} max={2} step={0.01} value={h} onChange={setH} />
        {controls && <Slider label="n" min={5} max={400} step={5} value={n} onChange={setN} />}
        <Btn onClick={() => setH(+silverman().toFixed(2))}>Silverman h</Btn>
        <Btn active={hist} onClick={() => setHist(!hist)}>histogram</Btn>
        {controls && (['gaussian', 'box', 'epanechnikov'] as KName[]).map((k) => <Btn key={k} active={kn === k} onClick={() => setKn(k)}>{k}</Btn>)}
        <Btn onClick={() => setSd(sd + 1)}>New sample</Btn>
      </Controls>
    </div>
  );
}
