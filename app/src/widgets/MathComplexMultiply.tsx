import { useRef, useState, type PointerEvent as PE } from 'react';
import { Btn, Controls, PlayPause, Slider, Stage, prefersReducedMotion, scale, useFrame } from './_kit';

/**
 * Complex multiplication as "rotate and scale" (Needham's picture). Drag the points z (blue) and
 * w (orange) on the plane. The morph carries z along the spiral z·w^s (s from 0 to 1): it turns
 * by s·arg w and stretches by |w|^s, landing on zw (green). The triangle 0, 1, w (orange) and the
 * triangle 0, z, zw (green) are similar: multiplying by w rotates and scales the whole plane.
 * A faint "house" shape on the unit square is carried along too. Optional: the powers w, w², …, wⁿ.
 * props: { z?: [re, im] (default [1.5, 0.5]), w?: [re, im] (default [0.8, 0.9]),
 *          range?: number (half-width of view, default 2.6), powers?: number (show w¹…wⁿ, 0 = off, default 0),
 *          animate?: boolean (default true), draggable?: boolean (default true) }
 */
type P = [number, number];
const mul = (a: P, b: P): P => [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]];
const abs = (a: P) => Math.hypot(a[0], a[1]);
const arg = (a: P) => Math.atan2(a[1], a[0]);
const deg = (r: number) => `${Math.round((r * 180) / Math.PI)}°`;
const fmt = (a: P) => `${a[0].toFixed(2)} ${a[1] < 0 ? '−' : '+'} ${Math.abs(a[1]).toFixed(2)}i`;

export default function MathComplexMultiply({ z: z0 = [1.5, 0.5], w: w0 = [0.8, 0.9], range = 2.6, powers = 0, animate = true, draggable = true }: {
  z?: P; w?: P; range?: number; powers?: number; animate?: boolean; draggable?: boolean;
}) {
  const [z, setZ] = useState<P>(z0);
  const [w, setW] = useState<P>(w0);
  const [s, setS] = useState(animate && !prefersReducedMotion() ? 0 : 1);
  const [running, setRunning] = useState(animate && !prefersReducedMotion());
  const [showPow, setShowPow] = useState(powers > 0);
  const drag = useRef<null | 'z' | 'w'>(null);
  const phase = useRef(0);
  useFrame((dt) => { phase.current = (phase.current + dt / 4.5) % 1; setS(Math.min(1, Math.max(0, 0.5 - 0.62 * Math.cos(2 * Math.PI * phase.current)))); }, running);

  const box: [number, number, number, number] = [4, 4, 206, 206];
  const sx = scale([-range, range], [box[0], box[2]]);
  const sy = scale([-range, range], [box[3], box[1]]);
  const pt = (a: P) => `${sx(a[0]).toFixed(1)},${sy(a[1]).toFixed(1)}`;
  const r = abs(w), th = arg(w);
  const ws = (t: number): P => [Math.pow(r, t) * Math.cos(t * th), Math.pow(r, t) * Math.sin(t * th)];
  const zs = mul(z, ws(s));
  const zw = mul(z, w);
  const spiral: string[] = [];
  for (let i = 0; i <= 40; i++) spiral.push(pt(mul(z, ws((i / 40) * s))));
  const house: P[] = [[0, 0], [1, 0], [1, 0.7], [0.5, 1.05], [0, 0.7]];
  const houseNow = house.map((h) => pt(mul(h, ws(s)))).join(' ');
  const n = Math.max(1, Math.min(12, powers || 6));
  const pows: P[] = [];
  let acc: P = [1, 0];
  for (let k = 1; k <= n; k++) { acc = mul(acc, w); pows.push(acc); }

  const toPlane = (e: PE): P => {
    const svg = (e.currentTarget as SVGElement).ownerSVGElement ?? (e.currentTarget as SVGSVGElement);
    const p = (svg as SVGSVGElement).createSVGPoint(); p.x = e.clientX; p.y = e.clientY;
    const q = p.matrixTransform((svg as SVGSVGElement).getScreenCTM()!.inverse());
    const X = -range + ((q.x - box[0]) / (box[2] - box[0])) * 2 * range;
    const Y = range - ((q.y - box[1]) / (box[3] - box[1])) * 2 * range;
    return [Math.max(-range, Math.min(range, +X.toFixed(2))), Math.max(-range, Math.min(range, +Y.toFixed(2)))];
  };
  const down = (e: PE) => {
    if (!draggable) return;
    const q = toPlane(e);
    const dz = Math.hypot(q[0] - z[0], q[1] - z[1]), dw = Math.hypot(q[0] - w[0], q[1] - w[1]);
    drag.current = dz < dw ? 'z' : 'w';
    (e.target as Element).setPointerCapture?.(e.pointerId);
    (drag.current === 'z' ? setZ : setW)(q);
  };
  const move = (e: PE) => { if (drag.current) (drag.current === 'z' ? setZ : setW)(toPlane(e)); };
  const up = () => { drag.current = null; };
  const ticks = [];
  for (let k = Math.ceil(-range); k <= Math.floor(range); k++) {
    ticks.push(<line key={'x' + k} x1={sx(k)} x2={sx(k)} y1={box[1]} y2={box[3]} stroke="var(--grid)" strokeWidth={0.5} />);
    ticks.push(<line key={'y' + k} y1={sy(k)} y2={sy(k)} x1={box[0]} x2={box[2]} stroke="var(--grid)" strokeWidth={0.5} />);
  }
  return (
    <div>
      <Stage w={320} h={210} label="Multiplying complex numbers rotates and scales the plane">
        <rect x={box[0]} y={box[1]} width={box[2] - box[0]} height={box[3] - box[1]} fill="transparent" stroke="var(--grid)"
          onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} style={{ cursor: draggable ? 'crosshair' : 'default' }} />
        <g pointerEvents="none">
          {ticks}
          <line x1={box[0]} x2={box[2]} y1={sy(0)} y2={sy(0)} stroke="var(--fg)" strokeWidth={0.7} />
          <line y1={box[1]} y2={box[3]} x1={sx(0)} x2={sx(0)} stroke="var(--fg)" strokeWidth={0.7} />
          <circle cx={sx(0)} cy={sy(0)} r={sx(1) - sx(0)} fill="none" stroke="var(--muted)" strokeDasharray="2 3" strokeWidth={0.6} />
          <polygon points={houseNow} fill="var(--c4)" fillOpacity={0.12} stroke="var(--c4)" strokeOpacity={0.5} strokeWidth={0.8} />
          <polygon points={`${pt([0, 0])} ${pt([1, 0])} ${pt(w)}`} fill="var(--c3)" fillOpacity={0.18} stroke="var(--c3)" strokeWidth={1} />
          <polygon points={`${pt([0, 0])} ${pt(z)} ${pt(zw)}`} fill="var(--c1)" fillOpacity={0.14} stroke="var(--c1)" strokeWidth={1} strokeDasharray="3 2" />
          {showPow && <polyline points={[[1, 0] as P, ...pows].map(pt).join(' ')} fill="none" stroke="var(--c6)" strokeWidth={1} />}
          {showPow && pows.map((p, k) => <g key={k}><circle cx={sx(p[0])} cy={sy(p[1])} r={2.4} fill="var(--c6)" />
            <text x={sx(p[0]) + 3} y={sy(p[1]) - 3} fontSize="8" style={{ fill: 'var(--c6)' }}>{k + 1}</text></g>)}
          <polyline points={spiral.join(' ')} fill="none" stroke="var(--c1)" strokeWidth={1.6} />
          <circle cx={sx(1)} cy={sy(0)} r={2.5} fill="var(--fg)" />
          <text x={sx(1) + 3} y={sy(0) + 10} fontSize="9">1</text>
          <circle cx={sx(z[0])} cy={sy(z[1])} r={5} fill="var(--c2)" />
          <text x={sx(z[0]) + 6} y={sy(z[1]) - 5} fontSize="10" fontWeight="bold" style={{ fill: 'var(--c2)' }}>z</text>
          <circle cx={sx(w[0])} cy={sy(w[1])} r={5} fill="var(--c3)" />
          <text x={sx(w[0]) + 6} y={sy(w[1]) - 5} fontSize="10" fontWeight="bold" style={{ fill: 'var(--c3)' }}>w</text>
          <circle cx={sx(zw[0])} cy={sy(zw[1])} r={3.5} fill="none" stroke="var(--c1)" strokeWidth={1.2} />
          <text x={sx(zw[0]) + 6} y={sy(zw[1]) + 11} fontSize="10" fontWeight="bold" style={{ fill: 'var(--c1)' }}>zw</text>
          <circle cx={sx(zs[0])} cy={sy(zs[1])} r={4} fill="var(--c1)" />
        </g>
        <g fontSize="9">
          <text x={214} y={16} style={{ fill: 'var(--c2)' }}>z = {fmt(z)}</text>
          <text x={214} y={28} style={{ fill: 'var(--muted)' }}>|z| {abs(z).toFixed(2)}, arg {deg(arg(z))}</text>
          <text x={214} y={46} style={{ fill: 'var(--c3)' }}>w = {fmt(w)}</text>
          <text x={214} y={58} style={{ fill: 'var(--muted)' }}>|w| {r.toFixed(2)}, arg {deg(th)}</text>
          <text x={214} y={78} style={{ fill: 'var(--c1)' }}>zw = {fmt(zw)}</text>
          <text x={214} y={90} style={{ fill: 'var(--muted)' }}>|zw| {abs(zw).toFixed(2)}</text>
          <text x={214} y={102} style={{ fill: 'var(--muted)' }}>arg {deg(arg(zw))}</text>
          <text x={214} y={124}>lengths multiply:</text>
          <text x={214} y={136} style={{ fill: 'var(--muted)' }}>{abs(z).toFixed(2)} × {r.toFixed(2)} = {(abs(z) * r).toFixed(2)}</text>
          <text x={214} y={152}>angles add:</text>
          <text x={214} y={164} style={{ fill: 'var(--muted)' }}>{deg(arg(z))} + {deg(th)} = {deg(arg(z) + th)}</text>
          <text x={214} y={186} style={{ fill: 'var(--muted)' }}>morph s = {s.toFixed(2)}</text>
          <text x={214} y={200} fontSize="8" style={{ fill: 'var(--muted)' }}>drag z or w</text>
        </g>
      </Stage>
      <Controls>
        <Slider label="morph" min={0} max={1} value={s} onChange={(v) => { setRunning(false); setS(v); }} />
        <PlayPause running={running} set={setRunning} />
        <Btn active={showPow} onClick={() => setShowPow(!showPow)}>powers of w</Btn>
        <Btn onClick={() => setW([0, 1])}>w = i</Btn>
        <Btn onClick={() => setW([-1, 0])}>w = −1</Btn>
        <Btn onClick={() => { setZ(z0); setW(w0); }}>Reset</Btn>
      </Controls>
    </div>
  );
}
