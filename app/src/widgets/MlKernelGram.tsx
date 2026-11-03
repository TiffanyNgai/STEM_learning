import { useMemo, useState } from 'react';
import { Btn, Controls, Slider, Stage, pathOf, scale } from './_kit';

/**
 * What a kernel "looks like". Left: the function x ↦ k(x, x') for two anchor points x' = 0 and x' = 1.
 * (periodic: exp(−2 sin²(π(x−x′)/2)/ℓ²), period 2.) Right: the Gram matrix Kᵢⱼ = k(xᵢ, xⱼ) for n evenly spaced points in [-2, 2] (blue > 0, red < 0, intensity ∝ |K|),
 * and below it the eigenvalues of K (computed by Jacobi rotations). A valid (Mercer, positive semidefinite)
 * kernel never produces a negative eigenvalue; the sigmoid "kernel" tanh(x x' − 1) does.
 * props: {
 *   kernel?: 'rbf'|'poly'|'linear'|'periodic'|'sigmoid'   (default 'rbf')
 *   lengthScale?: number   ℓ for rbf / periodic (default 0.7)
 *   degree?: number        d for poly (1 + x x')^d (default 2)
 *   n?: number             number of points, 3–13 (default 9; odd n includes x = 0)
 *   controls?: boolean     show kernel buttons (default true)
 * }
 */
type Kn = 'rbf' | 'poly' | 'linear' | 'periodic' | 'sigmoid';
function eig(A0: number[][]): number[] {
  const n = A0.length; const A = A0.map((r) => [...r]);
  for (let sweep = 0; sweep < 60; sweep++) {
    let off = 0; for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) off += A[i][j] ** 2;
    if (off < 1e-20) break;
    for (let p = 0; p < n; p++) for (let q = p + 1; q < n; q++) {
      if (Math.abs(A[p][q]) < 1e-15) continue;
      const th = (A[q][q] - A[p][p]) / (2 * A[p][q]); const t = Math.sign(th || 1) / (Math.abs(th) + Math.sqrt(th * th + 1));
      const c = 1 / Math.sqrt(t * t + 1), s = t * c;
      for (let k = 0; k < n; k++) { const a = A[k][p], b = A[k][q]; A[k][p] = c * a - s * b; A[k][q] = s * a + c * b; }
      for (let k = 0; k < n; k++) { const a = A[p][k], b = A[q][k]; A[p][k] = c * a - s * b; A[q][k] = s * a + c * b; }
    }
  }
  return A.map((r, i) => r[i]).sort((a, b) => b - a);
}

export default function MlKernelGram({ kernel = 'rbf', lengthScale = 0.7, degree = 2, n = 9, controls = true }: {
  kernel?: Kn; lengthScale?: number; degree?: number; n?: number; controls?: boolean;
}) {
  const [ker, setKer] = useState<Kn>(kernel);
  const [ell, setEll] = useState(lengthScale);
  const [deg, setDeg] = useState(degree);
  const m = Math.max(3, Math.min(13, Math.round(n)));
  const k = (a: number, b: number) => {
    if (ker === 'poly') return (1 + a * b) ** deg;
    if (ker === 'linear') return a * b;
    if (ker === 'periodic') return Math.exp((-2 * Math.sin((Math.PI * (a - b)) / 2) ** 2) / (ell * ell));
    if (ker === 'sigmoid') return Math.tanh(a * b - 1);
    return Math.exp(-((a - b) ** 2) / (2 * ell * ell));
  };
  const X = Array.from({ length: m }, (_, i) => -2 + (4 * i) / (m - 1));
  const K = X.map((a) => X.map((b) => k(a, b)));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const ev = useMemo(() => eig(K), [ker, ell, deg, m]);
  const kmax = Math.max(...K.flat().map(Math.abs), 1e-9);
  const neg = ev[ev.length - 1] < -1e-9 * Math.max(1, Math.abs(ev[0]));

  const XG = Array.from({ length: 161 }, (_, i) => -2 + i / 40);
  const curves = [0, 1].map((xp) => XG.map((x) => k(x, xp)));
  const lo = Math.min(0, ...curves.flat()), hi = Math.max(1, ...curves.flat());
  const sx = scale([-2, 2], [8, 150]); const sy = scale([lo, hi], [180, 20]);
  const cell = 104 / m; const gx = 200, gy = 8;
  const emax = Math.max(...ev.map(Math.abs), 1e-9); const bw = 104 / m; const base = 160;

  return (
    <div>
      <Stage label="Kernel function and Gram matrix with its eigenvalues">
        <text x={8} y={12} fontSize="8.5" fill="var(--fg)">k(x, x′) for x′ = 0 (blue), x′ = 1 (green)</text>
        <rect x={8} y={20} width={142} height={160} fill="var(--surface)" stroke="var(--grid)" />
        <line x1={8} x2={150} y1={sy(0)} y2={sy(0)} stroke="var(--grid)" />
        <path d={pathOf(XG.map((x, i) => [sx(x), sy(curves[0][i])] as [number, number]))} fill="none" stroke="var(--c2)" strokeWidth={1.8} />
        <path d={pathOf(XG.map((x, i) => [sx(x), sy(curves[1][i])] as [number, number]))} fill="none" stroke="var(--c1)" strokeWidth={1.8} />
        {X.map((x) => <line key={x} x1={sx(x)} x2={sx(x)} y1={178} y2={182} stroke="var(--fg)" />)}
        <text x={8} y={192} fontSize="8" fill="var(--muted)">x from −2 to 2 · ticks = data points</text>
        <text x={gx - 30} y={gy + 8} fontSize="8" fill="var(--fg)">K =</text>
        {K.map((row, i) => row.map((v, j) => <rect key={i + '-' + j} x={gx + j * cell} y={gy + i * cell} width={cell + 0.2} height={cell + 0.2} fill={v >= 0 ? 'var(--c2)' : 'var(--c5)'} opacity={0.08 + 0.92 * Math.abs(v) / kmax} />))}
        <rect x={gx} y={gy} width={104} height={104} fill="none" stroke="var(--fg)" strokeWidth={0.6} />
        <line x1={gx} x2={gx + 104} y1={base} y2={base} stroke="var(--fg)" strokeWidth={0.6} />
        {ev.map((e, i) => <rect key={i} x={gx + i * bw + 1} y={e >= 0 ? base - (38 * e) / emax : base} width={bw - 2} height={Math.max(0.5, (38 * Math.abs(e)) / emax)} fill={e >= 0 ? 'var(--c6)' : 'var(--c5)'} />)}
        <text x={gx - 30} y={base - 26} fontSize="8" fill="var(--fg)">eig</text>
        <text x={gx + 52} y={194} fontSize="9" textAnchor="middle" fill={neg ? 'var(--c5)' : 'var(--c1)'}>
          λ_min = {ev[ev.length - 1].toPrecision(2)} {neg ? '✗ not PSD' : '✓ PSD'}
        </text>
      </Stage>
      <Controls>
        {controls && (['rbf', 'poly', 'linear', 'periodic', 'sigmoid'] as Kn[]).map((q) => <Btn key={q} active={ker === q} onClick={() => setKer(q)}>{{ rbf: 'RBF', poly: 'polynomial', linear: 'linear', periodic: 'periodic', sigmoid: 'tanh (sigmoid)' }[q]}</Btn>)}
        {(ker === 'rbf' || ker === 'periodic') && <Slider label="length-scale ℓ" min={0.1} max={2} step={0.05} value={ell} onChange={setEll} />}
        {ker === 'poly' && <Slider label="degree d" min={1} max={5} step={1} value={deg} onChange={setDeg} />}
      </Controls>
    </div>
  );
}
