import { useMemo, useRef, useState, type PointerEvent } from 'react';
import { Btn, Controls, Slider, Stage, rng, scale } from './_kit';

/**
 * Soft-margin support vector machine on 2D points, solved exactly (dual, SMO with maximal-violating-pair
 * selection). Shows the decision boundary f(x) = 0 (solid), the margin f(x) = ±1 (dashed), support vectors
 * (ringed; filled ring = at the bound αᵢ = C), and the shaded sign of f. Drag points; tap empty space to add a
 * point of the selected class.
 * props: {
 *   dataset?: 'separable'|'overlap'|'circle'   (default 'separable')
 *   kernel?: 'linear'|'rbf'   (default 'linear'); rbf is k(x,x') = exp(-γ‖x−x'‖²)
 *   C?: number                box constraint / slack penalty (default 10)
 *   gamma?: number            RBF γ (default 1)
 *   controls?: boolean        show kernel buttons (default true)
 * }
 * Points live in [-2, 2]².
 */
type P = [number, number, number];
function makeData(ds: string): P[] {
  const r = rng(4); const out: P[] = [];
  if (ds === 'circle') {
    for (let i = 0; i < 26; i++) {
      const inner = i % 2 === 0; const a = 2 * Math.PI * r.u(); const rad = inner ? 0.7 * Math.sqrt(r.u()) : 1.3 + 0.4 * r.u();
      out.push([rad * Math.cos(a), rad * Math.sin(a), inner ? 1 : -1]);
    }
    return out;
  }
  const sd = ds === 'overlap' ? 0.75 : 0.42;
  for (let i = 0; i < 20; i++) { const c = i % 2 ? 1 : -1; out.push([0.8 * c + sd * r.normal(), 0.55 * c + sd * r.normal(), c]); }
  return out.map(([x, y, c]) => [Math.max(-1.9, Math.min(1.9, x)), Math.max(-1.9, Math.min(1.9, y)), c]);
}

function svm(pts: P[], C: number, k: (a: P, b: P) => number) {
  const n = pts.length; const y = pts.map((p) => p[2]);
  const K = pts.map((a) => pts.map((b) => k(a, b)));
  const al = new Array(n).fill(0); const G = new Array(n).fill(-1);
  const up = (t: number) => (y[t] > 0 ? al[t] < C : al[t] > 0);
  const low = (t: number) => (y[t] < 0 ? al[t] < C : al[t] > 0);
  let m = 0, M = 0;
  for (let it = 0; it < 20000; it++) {
    let i = -1, j = -1; m = -Infinity; M = Infinity;
    for (let t = 0; t < n; t++) {
      const v = -y[t] * G[t];
      if (up(t) && v > m) { m = v; i = t; }
      if (low(t) && v < M) { M = v; j = t; }
    }
    if (i < 0 || j < 0 || m - M < 1e-5) break;
    const eta = Math.max(K[i][i] + K[j][j] - 2 * K[i][j], 1e-12);
    let s = (m - M) / eta;
    s = Math.min(s, y[i] > 0 ? C - al[i] : al[i], y[j] > 0 ? al[j] : C - al[j]);
    al[i] += y[i] * s; al[j] -= y[j] * s;
    for (let t = 0; t < n; t++) G[t] += y[t] * s * (K[t][i] - K[t][j]);
  }
  const free = al.map((a, t) => (a > 1e-7 && a < C - 1e-7 ? -y[t] * G[t] : NaN)).filter((v) => !Number.isNaN(v));
  const b = free.length ? free.reduce((s, v) => s + v, 0) / free.length : (m + M) / 2;
  return { al, b };
}

export default function MlSVMMargin({ dataset = 'separable', kernel = 'linear', C = 10, gamma = 1, controls = true }: {
  dataset?: 'separable' | 'overlap' | 'circle'; kernel?: 'linear' | 'rbf'; C?: number; gamma?: number; controls?: boolean;
}) {
  const [pts, setPts] = useState<P[]>(() => makeData(dataset));
  const [ker, setKer] = useState(kernel);
  const [logC, setLogC] = useState(Math.log10(C));
  const [gam, setGam] = useState(gamma);
  const [cls, setCls] = useState(1);
  const drag = useRef<number | null>(null);
  const Cv = 10 ** logC;
  const k = (a: P, b: P) => (ker === 'linear' ? a[0] * b[0] + a[1] * b[1] : Math.exp(-gam * ((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2)));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const { al, b } = useMemo(() => svm(pts, Cv, k), [pts, Cv, ker, gam]);
  const f = (x: number, y: number) => pts.reduce((s, p, i) => (al[i] > 1e-7 ? s + al[i] * p[2] * k(p, [x, y, 0]) : s), b);
  const w = pts.reduce((s, p, i) => [s[0] + al[i] * p[2] * p[0], s[1] + al[i] * p[2] * p[1]], [0, 0]);
  const nSV = al.filter((a) => a > 1e-7).length;
  const errs = pts.filter((p) => p[2] * f(p[0], p[1]) <= 0).length;

  const L = 4, T = 4, S = 180; const sx = scale([-2, 2], [L, L + S]); const sy = scale([-2, 2], [T + S, T]);
  const N = 36; const h = 4 / N;
  const grid = useMemo(() => Array.from({ length: N + 1 }, (_, i) => Array.from({ length: N + 1 }, (_, j) => f(-2 + i * h, -2 + j * h))),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [al, b, pts]);
  const contour = (lev: number) => {
    let d = '';
    for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) {
      const c = [[i, j], [i + 1, j], [i + 1, j + 1], [i, j + 1]].map(([a, bb]) => [a, bb, grid[a][bb] - lev]);
      const q: [number, number][] = [];
      for (let e = 0; e < 4; e++) {
        const [a1, b1, v1] = c[e]; const [a2, b2, v2] = c[(e + 1) % 4];
        if ((v1 > 0) !== (v2 > 0)) { const t = v1 / (v1 - v2); q.push([sx(-2 + (a1 + t * (a2 - a1)) * h), sy(-2 + (b1 + t * (b2 - b1)) * h)]); }
      }
      for (let e = 0; e + 1 < q.length; e += 2) d += `M${q[e][0].toFixed(1)},${q[e][1].toFixed(1)}L${q[e + 1][0].toFixed(1)},${q[e + 1][1].toFixed(1)}`;
    }
    return d;
  };
  const cells = [];
  for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) {
    const v = grid[i][j] + grid[i + 1][j + 1];
    cells.push(<rect key={i + '-' + j} x={sx(-2 + i * h)} y={sy(-2 + (j + 1) * h)} width={S / N + 0.3} height={S / N + 0.3} fill={v > 0 ? 'var(--c2)' : 'var(--c3)'} opacity={0.16} />);
  }

  const toData = (e: PointerEvent<SVGRectElement>): [number, number] | null => {
    const svg = e.currentTarget.ownerSVGElement; const mm = svg?.getScreenCTM(); if (!svg || !mm) return null;
    const p = svg.createSVGPoint(); p.x = e.clientX; p.y = e.clientY; const q = p.matrixTransform(mm.inverse());
    return [Math.max(-1.95, Math.min(1.95, -2 + (4 * (q.x - L)) / S)), Math.max(-1.95, Math.min(1.95, 2 - (4 * (q.y - T)) / S))];
  };
  const down = (e: PointerEvent<SVGRectElement>) => {
    const d = toData(e); if (!d) return; e.currentTarget.setPointerCapture?.(e.pointerId);
    const near = pts.findIndex(([x, y]) => Math.hypot(sx(x) - sx(d[0]), sy(y) - sy(d[1])) < 9);
    if (near >= 0) drag.current = near; else if (pts.length < 40) { drag.current = pts.length; setPts([...pts, [d[0], d[1], cls]]); }
  };
  const move = (e: PointerEvent<SVGRectElement>) => {
    if (drag.current === null) return; const d = toData(e); if (!d) return; const i = drag.current;
    setPts((v) => v.map((p, j) => (j === i ? [d[0], d[1], p[2]] : p)));
  };
  const up = () => { drag.current = null; };
  const nw = Math.hypot(w[0], w[1]);

  return (
    <div>
      <Stage label="Support vector machine margin and support vectors">
        <clipPath id="mlsvm-clip"><rect x={L} y={T} width={S} height={S} /></clipPath>
        <g clipPath="url(#mlsvm-clip)" pointerEvents="none">
          {cells}
          <path d={contour(1)} stroke="var(--c2)" strokeWidth={1} strokeDasharray="4 3" fill="none" />
          <path d={contour(-1)} stroke="var(--c3)" strokeWidth={1} strokeDasharray="4 3" fill="none" />
          <path d={contour(0)} stroke="var(--fg)" strokeWidth={1.8} fill="none" />
        </g>
        <rect x={L} y={T} width={S} height={S} fill="transparent" stroke="var(--fg)" strokeWidth={0.6} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} style={{ cursor: 'crosshair', touchAction: 'none' }} />
        {pts.map(([x, y, c], i) => <g key={i} pointerEvents="none">
          {al[i] > 1e-7 && <circle cx={sx(x)} cy={sy(y)} r={6.5} fill="none" stroke="var(--fg)" strokeWidth={al[i] >= Cv - 1e-7 ? 2.2 : 1} strokeDasharray={al[i] >= Cv - 1e-7 ? undefined : '2 1.5'} />}
          {c > 0 ? <circle cx={sx(x)} cy={sy(y)} r={3.4} fill="var(--c2)" stroke="var(--fg)" strokeWidth={0.6} /> : <rect x={sx(x) - 3.2} y={sy(y) - 3.2} width={6.4} height={6.4} fill="var(--c3)" stroke="var(--fg)" strokeWidth={0.6} />}
        </g>)}
        <g fontSize="9" fill="var(--fg)">
          <text x={192} y={18}>{ker === 'linear' ? 'linear kernel' : `RBF, γ = ${gam.toFixed(2)}`}</text>
          <text x={192} y={34}>C = {Cv < 1 ? Cv.toPrecision(2) : Cv.toFixed(Cv < 10 ? 1 : 0)}</text>
          <text x={192} y={50}>support vectors: {nSV}</text>
          <text x={192} y={66}>training errors: {errs}</text>
          {ker === 'linear' && nw > 1e-9 && <text x={192} y={82}>margin width 2/‖w‖ = {(2 / nw).toFixed(2)}</text>}
          <text x={192} y={106} fill="var(--muted)" fontSize="8">━ f(x) = 0  ┅ f(x) = ±1</text>
          <text x={192} y={120} fill="var(--muted)" fontSize="8">◯ dashed ring: 0 &lt; αᵢ &lt; C</text>
          <text x={192} y={134} fill="var(--muted)" fontSize="8">◯ bold ring: αᵢ = C</text>
          <text x={192} y={152} fill="var(--muted)" fontSize="8">drag points · tap to add</text>
        </g>
      </Stage>
      <Controls>
        {controls && <>
          <Btn active={ker === 'linear'} onClick={() => setKer('linear')}>linear</Btn>
          <Btn active={ker === 'rbf'} onClick={() => setKer('rbf')}>RBF</Btn>
        </>}
        <Slider label="log₁₀ C" min={-2} max={3} step={0.1} value={logC} onChange={setLogC} />
        {ker === 'rbf' && <Slider label="γ" min={0.1} max={10} step={0.1} value={gam} onChange={setGam} />}
        <Btn active={cls === 1} onClick={() => setCls(1)}>add ●</Btn>
        <Btn active={cls === -1} onClick={() => setCls(-1)}>add ■</Btn>
        <Btn onClick={() => setPts(makeData(dataset))}>Reset</Btn>
      </Controls>
    </div>
  );
}
