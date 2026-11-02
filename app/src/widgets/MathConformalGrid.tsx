import { useRef, useState } from 'react';
import { Btn, Controls, PlayPause, Slider, Stage, prefersReducedMotion, scale, useFrame } from './_kit';

/**
 * A square grid (vertical lines blue, horizontal lines orange) carried by a complex map f. The morph
 * slider shows F_s(z) = (1 − s)·z + s·f(z), which is itself holomorphic when f is, so angles stay right
 * angles wherever F_s′ = (1 − s) + s·f′ ≠ 0 (true at each preset's marked point; F_s′ can vanish elsewhere
 * at intermediate s, e.g. at z = 1, s = ½ for 1/z). One grid crossing z₀ is marked: its two tangent directions are tracked numerically
 * and the angle between them is shown, together with the local "amplitwist" (stretch |F′| and turn arg F′).
 * The 'shear' preset is NOT holomorphic: its angles visibly change. For z² the "critical point" button moves
 * the marker to z₀ = 0, where f′ = 0 and the angle doubles.
 * props: { fn?: 'z2' | 'exp' | 'inv' | 'mobius' | 'shear' (default 'z2'), presets?: boolean (default true),
 *          animate?: boolean (default true), marker?: [x, y] (overrides the preset's marked point) }
 */
type Cx = [number, number];
const mul = (a: Cx, b: Cx): Cx => [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]];
const div = (a: Cx, b: Cx): Cx => { const d = b[0] * b[0] + b[1] * b[1]; return [(a[0] * b[0] + a[1] * b[1]) / d, (a[1] * b[0] - a[0] * b[1]) / d]; };
type Preset = { label: string; f: (z: Cx) => Cx; dom: [number, number, number, number]; n: number; view: [number, number, number]; z0: Cx };
const PRESETS: Record<string, Preset> = {
  z2: { label: 'z²', f: (z) => mul(z, z), dom: [0, 1.6, 0, 1.6], n: 8, view: [0, 1.3, 2.7], z0: [1, 0.6] },
  exp: { label: 'eᶻ', f: (z) => { const r = Math.exp(z[0]); return [r * Math.cos(z[1]), r * Math.sin(z[1])]; }, dom: [-1, 1, -2.6, 2.6], n: 10, view: [0.2, 0, 3], z0: [0.25, 0.8] },
  inv: { label: '1/z', f: (z) => div([1, 0], z), dom: [0.3, 2, -1.2, 1.2], n: 8, view: [1.2, 0, 2.3], z0: [1, 0.45] },
  mobius: { label: '(z−i)/(z+i)', f: (z) => div([z[0], z[1] - 1], [z[0], z[1] + 1]), dom: [-2, 2, 0, 2.4], n: 8, view: [0, 0.5, 2.3], z0: [0.5, 1] },
  shear: { label: 'shear (not holomorphic)', f: (z) => [z[0] + 0.9 * z[1], z[1]], dom: [-1.5, 1.5, -1.5, 1.5], n: 8, view: [0, 0, 2.6], z0: [0.375, 0.375] },
};

export default function MathConformalGrid({ fn = 'z2', presets = true, animate = true, marker }: {
  fn?: string; presets?: boolean; animate?: boolean; marker?: [number, number];
}) {
  const [key, setKey] = useState(PRESETS[fn] ? fn : 'z2');
  const [crit, setCrit] = useState(false);
  const [s, setS] = useState(animate && !prefersReducedMotion() ? 0 : 1);
  const [running, setRunning] = useState(animate && !prefersReducedMotion());
  const phase = useRef(0);
  useFrame((dt) => { phase.current = (phase.current + dt / 5) % 1; setS(Math.min(1, Math.max(0, 0.5 - 0.62 * Math.cos(2 * Math.PI * phase.current)))); }, running);
  const P = PRESETS[key];
  const F = (z: Cx): Cx => { const w = P.f(z); return [(1 - s) * z[0] + s * w[0], (1 - s) * z[1] + s * w[1]]; };
  const [cx, cy, hw] = P.view;
  const box: [number, number, number, number] = [4, 4, 206, 206];
  const sx = scale([cx - hw, cx + hw], [box[0], box[2]]);
  const sy = scale([cy - hw, cy + hw], [box[3], box[1]]);
  const far = (w: Cx) => !Number.isFinite(w[0]) || !Number.isFinite(w[1]) || Math.abs(w[0] - cx) > 6 * hw || Math.abs(w[1] - cy) > 6 * hw;
  const curve = (g: (t: number) => Cx, m = 72) => {
    let d = ''; let pen = false;
    for (let i = 0; i <= m; i++) {
      const w = F(g(i / m));
      if (far(w)) { pen = false; continue; }
      d += `${pen ? 'L' : 'M'}${sx(w[0]).toFixed(1)},${sy(w[1]).toFixed(1)}`; pen = true;
    }
    return d;
  };
  const [x0, x1, y0, y1] = P.dom;
  const lines = [];
  for (let k = 0; k <= P.n; k++) {
    const x = x0 + ((x1 - x0) * k) / P.n, y = y0 + ((y1 - y0) * k) / P.n;
    lines.push(<path key={'v' + k} d={curve((t) => [x, y0 + (y1 - y0) * t])} stroke="var(--c2)" strokeWidth={0.9} fill="none" />);
    lines.push(<path key={'h' + k} d={curve((t) => [x0 + (x1 - x0) * t, y])} stroke="var(--c3)" strokeWidth={0.9} fill="none" />);
  }
  const z0: Cx = marker ?? (crit && key === 'z2' ? [0, 0] : P.z0);
  const dx = (x1 - x0) / P.n, dy = (y1 - y0) / P.n;
  const cell = (key === 'z2' && crit) ? '' : curve((t) => {
    const q = t * 4, e = Math.floor(Math.min(q, 3.999)), u = q - e;
    return ([[z0[0] + dx * u, z0[1]], [z0[0] + dx, z0[1] + dy * u], [z0[0] + dx * (1 - u), z0[1] + dy], [z0[0], z0[1] + dy * (1 - u)]] as Cx[])[e];
  }, 80);
  const h = 1e-4;
  const W0 = F(z0), A = F([z0[0] + h, z0[1]]), B = F([z0[0], z0[1] + h]);
  const a: Cx = [A[0] - W0[0], A[1] - W0[1]], b: Cx = [B[0] - W0[0], B[1] - W0[1]];
  const ang = (Math.acos(Math.max(-1, Math.min(1, (a[0] * b[0] + a[1] * b[1]) / (Math.hypot(...a) * Math.hypot(...b))))) * 180) / Math.PI;
  const dF = div(a, [h, 0]);
  const dFy = div(b, [0, h]);
  const holo = Math.hypot(dF[0] - dFy[0], dF[1] - dFy[1]) < 1e-3 * (1 + Math.hypot(...dF));
  const arrow = (v: Cx, col: string) => {
    const L = Math.hypot(...v) || 1; const ux = v[0] / L, uy = v[1] / L;
    const X = sx(W0[0]), Y = sy(W0[1]);
    return <line x1={X} y1={Y} x2={X + 22 * ux} y2={Y - 22 * uy} stroke={col} strokeWidth={2.4} strokeLinecap="round" />;
  };
  return (
    <div>
      <Stage w={320} h={210} label={`A square grid mapped by f(z) = ${P.label}`}>
        <defs><clipPath id={`cg-${key}`}><rect x={box[0]} y={box[1]} width={box[2] - box[0]} height={box[3] - box[1]} /></clipPath></defs>
        <rect x={box[0]} y={box[1]} width={box[2] - box[0]} height={box[3] - box[1]} fill="none" stroke="var(--grid)" />
        <g clipPath={`url(#cg-${key})`}>
          {cx - hw < 0 && cx + hw > 0 && <line x1={sx(0)} x2={sx(0)} y1={box[1]} y2={box[3]} stroke="var(--grid)" strokeWidth={0.8} />}
          {cy - hw < 0 && cy + hw > 0 && <line y1={sy(0)} y2={sy(0)} x1={box[0]} x2={box[2]} stroke="var(--grid)" strokeWidth={0.8} />}
          {cell && <path d={cell + 'Z'} fill="var(--c1)" fillOpacity={0.35} stroke="none" />}
          {lines}
          {arrow(a, 'var(--c5)')}{arrow(b, 'var(--c4)')}
          <circle cx={sx(W0[0])} cy={sy(W0[1])} r={3} fill="var(--fg)" />
        </g>
        <g fontSize="9">
          <text x={214} y={16} fontSize="11" fontWeight="bold">f(z) = {P.label.replace(' (not holomorphic)', '')}</text>
          {key === 'shear' && <text x={214} y={28} style={{ fill: 'var(--c5)' }}>not holomorphic</text>}
          <text x={214} y={46} style={{ fill: 'var(--muted)' }}>morph s = {s.toFixed(2)}</text>
          <text x={214} y={64}>marked z₀ = {z0[0]}{z0[1] < 0 ? ' − ' : ' + '}{Math.abs(z0[1])}i</text>
          <text x={214} y={80} style={{ fill: 'var(--c5)' }}>— image of →</text>
          <text x={214} y={92} style={{ fill: 'var(--c4)' }}>— image of ↑</text>
          <text x={214} y={112} fontSize="11" fontWeight="bold" style={{ fill: Math.abs(ang - 90) < 0.5 ? 'var(--c1)' : 'var(--c5)' }}>angle = {ang.toFixed(1)}°</text>
          {holo ? <>
            <text x={214} y={132}>stretch |F′| = {Math.hypot(...dF).toFixed(2)}</text>
            <text x={214} y={146}>turn arg F′ = {Math.hypot(...dF) < 1e-3 ? '—' : `${Math.round((Math.atan2(dF[1], dF[0]) * 180) / Math.PI)}°`}</text>
          </> : <>
            <text x={214} y={132} style={{ fill: 'var(--c5)' }}>→ and ↑ stretch</text>
            <text x={214} y={146} style={{ fill: 'var(--c5)' }}>differently</text>
          </>}
          {key === 'z2' && crit && <text x={214} y={166} style={{ fill: 'var(--c5)' }}>f′(0) = 0: angle doubled</text>}
          <text x={214} y={200} fontSize="8" style={{ fill: 'var(--muted)' }}>shaded: one grid cell</text>
        </g>
      </Stage>
      <Controls>
        <Slider label="morph" min={0} max={1} value={s} onChange={(v) => { setRunning(false); setS(v); }} />
        <PlayPause running={running} set={setRunning} />
        {presets && Object.entries(PRESETS).map(([k, p]) => <Btn key={k} active={k === key} onClick={() => { setKey(k); setCrit(false); }}>{p.label}</Btn>)}
        {key === 'z2' && !marker && <Btn active={crit} onClick={() => setCrit(!crit)}>critical point z₀ = 0</Btn>}
      </Controls>
    </div>
  );
}
