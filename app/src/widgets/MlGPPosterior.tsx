import { useMemo, useRef, useState, type PointerEvent } from 'react';
import { Btn, C, Controls, PlayPause, Slider, Stage, pathOf, prefersReducedMotion, rng, scale, useFrame } from './_kit';

/**
 * Gaussian-process regression in 1D (exact, via Cholesky). Tap the plot to add an observation; drag a point
 * to move it. Shows the posterior mean, a mean ± 2σ band, and sample functions drawn from the posterior
 * (or the prior when there is no data). The samples can be animated: z(t) = z₁cos t + z₂sin t keeps every frame
 * an exact draw. Also reports the log marginal likelihood log p(y | X).
 * props: {
 *   kernel?: 'rbf'|'matern12'|'periodic'|'linear'  covariance function (default 'rbf'); 'linear' is σ_f²(1 + x x')
 *   lengthScale?: number   ℓ (default 0.3); x lives in [-1, 1], y in [-2.6, 2.6]
 *   signal?: number        σ_f, prior standard deviation of f (default 1)
 *   noise?: number         σ_n, observation-noise standard deviation (default 0.1)
 *   points?: [number, number][]  initial observations (default four points; [] shows the prior)
 *   samples?: number       number of sample functions, 0–5 (default 3)
 *   showBand?: boolean     draw mean ± 2σ (default true)
 *   showBases?: boolean    draw each α_i k(x_i, ·), whose sum is the mean (representer theorem) (default false)
 *   showNoise?: boolean    show the σ_n slider (default true)
 *   controls?: boolean     show kernel buttons (default true)
 *   meanLabel?: string     legend name for the mean curve (default 'posterior mean')
 * }
 */
type K = 'rbf' | 'matern12' | 'periodic' | 'linear';
const G = 81;
const XS = Array.from({ length: G }, (_, i) => -1 + (2 * i) / (G - 1));

function chol(A: number[][]): number[][] {
  const n = A.length; const L = A.map(() => new Array(n).fill(0));
  for (let i = 0; i < n; i++) for (let j = 0; j <= i; j++) {
    let s = A[i][j]; for (let k = 0; k < j; k++) s -= L[i][k] * L[j][k];
    L[i][j] = i === j ? Math.sqrt(Math.max(s, 1e-12)) : s / L[j][j];
  }
  return L;
}
const fwd = (L: number[][], b: number[]) => { const x = [...b]; for (let i = 0; i < x.length; i++) { for (let k = 0; k < i; k++) x[i] -= L[i][k] * x[k]; x[i] /= L[i][i]; } return x; };
const bwd = (L: number[][], b: number[]) => { const x = [...b]; for (let i = x.length - 1; i >= 0; i--) { for (let k = i + 1; k < x.length; k++) x[i] -= L[k][i] * x[k]; x[i] /= L[i][i]; } return x; };

export default function MlGPPosterior({ kernel = 'rbf', lengthScale = 0.3, signal = 1, noise = 0.1, points, samples = 3, showBand = true, showBases = false, showNoise = true, controls = true, meanLabel = 'posterior mean' }: {
  kernel?: K; lengthScale?: number; signal?: number; noise?: number; points?: [number, number][]; samples?: number;
  showBand?: boolean; showBases?: boolean; showNoise?: boolean; controls?: boolean; meanLabel?: string;
}) {
  const [pts, setPts] = useState<[number, number][]>(points ?? [[-0.7, -0.6], [-0.2, 0.5], [0.3, 0.9], [0.65, -0.3]]);
  const [ker, setKer] = useState<K>(kernel);
  const [ell, setEll] = useState(lengthScale);
  const [sf, setSf] = useState(signal);
  const [sn, setSn] = useState(noise);
  const [bases, setBases] = useState(showBases);
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState(0);
  const drag = useRef<number | null>(null);
  useFrame((dt) => setPhase((p) => p + dt * 0.8), running && !prefersReducedMotion());

  const k = (a: number, b: number) => {
    const r = a - b;
    if (ker === 'matern12') return sf * sf * Math.exp(-Math.abs(r) / ell);
    if (ker === 'periodic') return sf * sf * Math.exp((-2 * Math.sin(Math.PI * r) ** 2) / (ell * ell));
    if (ker === 'linear') return sf * sf * (1 + a * b);
    return sf * sf * Math.exp(-(r * r) / (2 * ell * ell));
  };
  const ns = Math.max(0, Math.min(5, samples));
  const Z = useMemo(() => { const r = rng(11); return Array.from({ length: 2 * ns }, () => XS.map(() => r.normal())); }, [ns]);

  const post = useMemo(() => {
    const n = pts.length; const X = pts.map((p) => p[0]); const y = pts.map((p) => p[1]);
    const Ks = XS.map((x) => X.map((xi) => k(x, xi)));
    let mean = XS.map(() => 0); let cov = XS.map((a) => XS.map((b) => k(a, b)));
    let alpha: number[] = []; let lml = NaN;
    if (n) {
      const L = chol(X.map((a, i) => X.map((b, j) => k(a, b) + (i === j ? sn * sn + 1e-9 : 0))));
      alpha = bwd(L, fwd(L, y));
      mean = Ks.map((row) => row.reduce((s, v, i) => s + v * alpha[i], 0));
      const V = Ks.map((row) => fwd(L, row));
      cov = cov.map((row, a) => row.map((c, b) => c - V[a].reduce((s, v, i) => s + v * V[b][i], 0)));
      lml = -0.5 * y.reduce((s, v, i) => s + v * alpha[i], 0) - L.reduce((s, r, i) => s + Math.log(r[i]), 0) - (n / 2) * Math.log(2 * Math.PI);
    }
    const Lc = chol(cov.map((row, i) => row.map((c, j) => c + (i === j ? 1e-6 * sf * sf : 0))));
    return { mean, sd: cov.map((r, i) => Math.sqrt(Math.max(r[i], 0))), Lc, alpha, Ks, lml };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pts, ker, ell, sf, sn]);

  const box: [number, number, number, number] = [6, 6, 314, 180];
  const sx = scale([-1, 1], [box[0], box[2]]); const sy = scale([-2.6, 2.6], [box[3], box[1]]);
  const cy = (v: number) => Math.max(-20, Math.min(220, sy(v)));
  const line = (v: number[]) => pathOf(XS.map((x, i) => [sx(x), cy(v[i])] as [number, number]));
  const band = showBand ? pathOf([...XS.map((x, i) => [sx(x), cy(post.mean[i] + 2 * post.sd[i])] as [number, number]), ...XS.map((x, i) => [sx(x), cy(post.mean[i] - 2 * post.sd[i])] as [number, number]).reverse()]) + 'Z' : '';
  const sampleCurves = Array.from({ length: ns }, (_, s) => {
    const z = Z[2 * s].map((a, i) => a * Math.cos(phase) + Z[2 * s + 1][i] * Math.sin(phase));
    return post.mean.map((m, i) => m + post.Lc[i].reduce((acc, l, j) => (j <= i ? acc + l * z[j] : acc), 0));
  });

  const toData = (e: PointerEvent<SVGRectElement>): [number, number] | null => {
    const svg = e.currentTarget.ownerSVGElement; const m = svg?.getScreenCTM(); if (!svg || !m) return null;
    const p = svg.createSVGPoint(); p.x = e.clientX; p.y = e.clientY; const q = p.matrixTransform(m.inverse());
    return [Math.max(-1, Math.min(1, -1 + (2 * (q.x - box[0])) / (box[2] - box[0]))), Math.max(-2.5, Math.min(2.5, 2.6 - (5.2 * (q.y - box[1])) / (box[3] - box[1])))];
  };
  const down = (e: PointerEvent<SVGRectElement>) => {
    const d = toData(e); if (!d) return;
    e.currentTarget.setPointerCapture?.(e.pointerId);
    const near = pts.findIndex(([x, y]) => Math.hypot(sx(x) - sx(d[0]), sy(y) - sy(d[1])) < 10);
    if (near >= 0) drag.current = near;
    else if (pts.length < 14) { drag.current = pts.length; setPts([...pts, d]); }
  };
  const move = (e: PointerEvent<SVGRectElement>) => {
    if (drag.current === null) return; const d = toData(e); if (!d) return;
    const i = drag.current; setPts((v) => v.map((p, j) => (j === i ? d : p)));
  };
  const up = () => { drag.current = null; };

  return (
    <div>
      <Stage label="Gaussian process posterior with draggable observations">
        <rect x={box[0]} y={box[1]} width={box[2] - box[0]} height={box[3] - box[1]} fill="var(--surface)" stroke="var(--grid)" onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} style={{ cursor: 'crosshair', touchAction: 'none' }} />
        <clipPath id="mlgp-clip"><rect x={box[0]} y={box[1]} width={box[2] - box[0]} height={box[3] - box[1]} /></clipPath>
        <g clipPath="url(#mlgp-clip)" pointerEvents="none">
          <line x1={box[0]} x2={box[2]} y1={sy(0)} y2={sy(0)} stroke="var(--grid)" />
          {showBand && <path d={band} fill="var(--c2)" opacity={0.18} />}
          {sampleCurves.map((v, s) => <path key={s} d={line(v)} fill="none" stroke={C[[3, 0, 5, 4, 2][s]]} strokeWidth={1} opacity={0.8} />)}
          {bases && pts.map(([xi], i) => <path key={'b' + i} d={line(XS.map((x) => post.alpha[i] * k(x, xi)))} fill="none" stroke={C[(i % 5) + 1]} strokeWidth={1} strokeDasharray="3 2" />)}
          <path d={line(post.mean)} fill="none" stroke="var(--c2)" strokeWidth={2.2} />
        </g>
        {pts.map(([x, y], i) => <circle key={i} cx={sx(x)} cy={sy(y)} r={4} fill="var(--fg)" stroke="var(--surface)" strokeWidth={1} pointerEvents="none" />)}
        <text x={box[0]} y={192} fontSize="8.5" fill="var(--fg)">
          <tspan fill="var(--c2)">━ {meanLabel}</tspan>{showBand ? '  ▒ ±2σ' : ''}{ns ? '  ∼ samples' : ''}{pts.length ? `  · log p(y|X) = ${post.lml.toFixed(1)}` : '  · prior (no data)'}
        </text>
        <text x={box[2]} y={199} fontSize="7.5" textAnchor="end" fill="var(--muted)">tap to add · drag to move</text>
      </Stage>
      <Controls>
        {controls && (['rbf', 'matern12', 'periodic', 'linear'] as K[]).map((q) => <Btn key={q} active={ker === q} onClick={() => setKer(q)}>{{ rbf: 'RBF', matern12: 'Matérn-½', periodic: 'periodic', linear: 'linear' }[q]}</Btn>)}
        {ker !== 'linear' && <Slider label="length-scale ℓ" min={0.05} max={1.5} step={0.01} value={ell} onChange={setEll} />}
        <Slider label="signal σ_f" min={0.2} max={2} step={0.05} value={sf} onChange={setSf} />
        {showNoise && <Slider label="noise σ_n" min={0.01} max={1} step={0.01} value={sn} onChange={setSn} />}
        {ns > 0 && <PlayPause running={running} set={setRunning} />}
        {pts.length > 0 && showBases && <Btn active={bases} onClick={() => setBases(!bases)}>show αᵢk(xᵢ,·)</Btn>}
        <Btn onClick={() => setPts([])}>Clear</Btn>
      </Controls>
    </div>
  );
}
