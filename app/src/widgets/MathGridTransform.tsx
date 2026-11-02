import { useId, useRef, useState } from 'react';
import { Btn, Controls, PlayPause, Slider, Stage, prefersReducedMotion, scale, useFrame } from './_kit';

/**
 * A 2×2 matrix A = [[a, b], [c, d]] acting on the whole plane. The square grid, the unit square
 * (shaded) and a small letter "F" are carried smoothly from x to A·x (morph slider, or Play to loop;
 * the morph is the straight-line path (1−s)I + sA). The basis arrows î, ĵ land on the COLUMNS of A.
 * Readouts: det A = signed area of the image of the unit square; the square turns red and the F
 * appears mirrored when det < 0 (orientation flipped); "squashed flat" when det = 0.
 * props: { a?, b?, c?, d? (default [[1,1],[0,1]], a shear), range?: number (default 3),
 *          editable?: boolean (entry sliders, default true), presets?: boolean (preset buttons, default true),
 *          showDet?: boolean (det readout, default true), animate?: boolean (default true) }
 */
type M = { a: number; b: number; c: number; d: number };
const PRESETS: [string, M][] = [
  ['Shear', { a: 1, b: 1, c: 0, d: 1 }],
  ['Rotate 90°', { a: 0, b: -1, c: 1, d: 0 }],
  ['Stretch', { a: 2, b: 0, c: 0, d: 0.5 }],
  ['Reflect', { a: -1, b: 0, c: 0, d: 1 }],
  ['Flatten', { a: 1, b: 2, c: 0.5, d: 1 }],
];

export default function MathGridTransform({ a: a0 = 1, b: b0 = 1, c: c0 = 0, d: d0 = 1, range = 3, editable = true, presets = true, showDet = true, animate = true }: {
  a?: number; b?: number; c?: number; d?: number; range?: number; editable?: boolean; presets?: boolean; showDet?: boolean; animate?: boolean;
}) {
  const id = useId().replace(/:/g, '');
  const [m, setM] = useState<M>({ a: a0, b: b0, c: c0, d: d0 });
  const [s, setS] = useState(animate && !prefersReducedMotion() ? 0 : 1);
  const [running, setRunning] = useState(animate && !prefersReducedMotion());
  const phase = useRef(0);
  useFrame((dt) => { phase.current = (phase.current + dt / 5) % 1; setS(Math.min(1, Math.max(0, 0.5 - 0.6 * Math.cos(2 * Math.PI * phase.current)))); }, running);
  const { a, b, c, d } = m;
  const A = [1 - s + s * a, s * b, s * c, 1 - s + s * d];
  const box: [number, number, number, number] = [118, 6, 312, 200];
  const sx = scale([-range, range], [box[0], box[2]]); const sy = scale([-range, range], [box[3], box[1]]);
  const P = (x: number, y: number) => `${sx(A[0] * x + A[1] * y).toFixed(1)},${sy(A[2] * x + A[3] * y).toFixed(1)}`;
  const N = Math.ceil(range * 2);
  const lines = [];
  for (let k = -N; k <= N; k++) {
    lines.push(<line key={'o' + k} x1={sx(k)} x2={sx(k)} y1={box[1]} y2={box[3]} stroke="var(--grid)" strokeWidth={0.5} />);
    lines.push(<line key={'p' + k} y1={sy(k)} y2={sy(k)} x1={box[0]} x2={box[2]} stroke="var(--grid)" strokeWidth={0.5} />);
  }
  const tl = [];
  for (let k = -N; k <= N; k++) {
    tl.push(<polyline key={'v' + k} points={`${P(k, -N)} ${P(k, N)}`} stroke="var(--c2)" strokeWidth={k === 0 ? 1.2 : 0.6} opacity={0.6} fill="none" />);
    tl.push(<polyline key={'h' + k} points={`${P(-N, k)} ${P(N, k)}`} stroke="var(--c2)" strokeWidth={k === 0 ? 1.2 : 0.6} opacity={0.6} fill="none" />);
  }
  const detS = A[0] * A[3] - A[1] * A[2];
  const det = a * d - b * c;
  const flat = Math.abs(detS) < 1e-3;
  const sq = `${P(0, 0)} ${P(1, 0)} ${P(1, 1)} ${P(0, 1)}`;
  // letter F inside the unit square
  const F = `${P(0.3, 0.15)} ${P(0.3, 0.85)} ${P(0.75, 0.85)}`;
  const F2 = `${P(0.3, 0.5)} ${P(0.62, 0.5)}`;
  const f = (v: number) => (+v.toFixed(2)).toString();
  const clip = `gt-clip-${id}`, arr = `gt-arr-${id}`;
  return (
    <div>
      <Stage w={320} h={206} label="A matrix transforming the grid and the unit square">
        <defs>
          <clipPath id={clip}><rect x={box[0]} y={box[1]} width={box[2] - box[0]} height={box[3] - box[1]} /></clipPath>
          {['c3', 'c4'].map((k) => <marker key={k} id={arr + k} viewBox="0 0 6 6" refX="5" refY="3" markerWidth="4" markerHeight="4" orient="auto"><path d="M0,0L6,3L0,6z" fill={`var(--${k})`} /></marker>)}
        </defs>
        <rect x={box[0]} y={box[1]} width={box[2] - box[0]} height={box[3] - box[1]} fill="none" stroke="var(--grid)" />
        <g clipPath={`url(#${clip})`}>
          {lines}{tl}
          <polygon points={sq} fill={detS < 0 ? 'var(--c5)' : 'var(--c1)'} fillOpacity={0.3} stroke={detS < 0 ? 'var(--c5)' : 'var(--c1)'} strokeWidth={1.2} />
          <polyline points={F} fill="none" stroke="var(--fg)" strokeWidth={2} strokeLinejoin="round" />
          <polyline points={F2} fill="none" stroke="var(--fg)" strokeWidth={2} />
          <line x1={sx(0)} y1={sy(0)} x2={sx(A[0])} y2={sy(A[2])} stroke="var(--c3)" strokeWidth={2.4} markerEnd={`url(#${arr}c3)`} />
          <line x1={sx(0)} y1={sy(0)} x2={sx(A[1])} y2={sy(A[3])} stroke="var(--c4)" strokeWidth={2.4} markerEnd={`url(#${arr}c4)`} />
        </g>
        <g fontSize="10">
          <text x={4} y={16}>A =</text>
          <text x={24} y={11}>[</text><text x={24} y={24}>[</text><text x={98} y={11}>]</text><text x={98} y={24}>]</text>
          <text x={50} y={11} textAnchor="end">{f(a)}</text><text x={88} y={11} textAnchor="end">{f(b)}</text>
          <text x={50} y={24} textAnchor="end">{f(c)}</text><text x={88} y={24} textAnchor="end">{f(d)}</text>
          <text x={4} y={44} style={{ fill: 'var(--c3)' }}>î → ({f(a)}, {f(c)})</text>
          <text x={4} y={57} style={{ fill: 'var(--c4)' }}>ĵ → ({f(b)}, {f(d)})</text>
          <text x={4} y={76} fontSize="9" style={{ fill: 'var(--muted)' }}>morph s = {s.toFixed(2)}</text>
          {showDet && <>
            <text x={4} y={100}>det A = {f(det)}</text>
            <text x={4} y={114} fontSize="9" style={{ fill: 'var(--muted)' }}>area now × {f(Math.abs(detS))}</text>
            {flat && <text x={4} y={132} fontSize="9" style={{ fill: 'var(--c5)' }}>squashed flat (det 0)</text>}
            {!flat && detS < 0 && <text x={4} y={132} fontSize="9" style={{ fill: 'var(--c5)' }}>orientation flipped</text>}
          </>}
        </g>
      </Stage>
      <Controls>
        <Slider label="morph" min={0} max={1} value={s} onChange={(v) => { setRunning(false); setS(v); }} />
        <PlayPause running={running} set={setRunning} />
        {presets && PRESETS.map(([name, p]) => <Btn key={name} onClick={() => setM(p)}>{name}</Btn>)}
        {editable && (['a', 'b', 'c', 'd'] as const).map((k) => (
          <Slider key={k} label={k} min={-3} max={3} step={0.1} value={m[k]} onChange={(v) => setM((o) => ({ ...o, [k]: v }))} />
        ))}
      </Controls>
    </div>
  );
}
