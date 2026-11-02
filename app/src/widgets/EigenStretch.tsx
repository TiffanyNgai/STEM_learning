import { useRef, useState } from 'react';
import { C, Controls, PlayPause, Slider, Stage, prefersReducedMotion, scale, useFrame } from './_kit';

/**
 * A 2×2 matrix A = [[a, b], [c, d]] acting on the plane. A ring of unit vectors is morphed
 * smoothly from x to A·x (morph slider 0→1, or Play to loop). Real eigenvector directions are
 * drawn as dashed lines: vectors lying on them only stretch (by λ), every other vector also turns.
 * props: { a?, b?, c?, d? (matrix entries, default [[2,1],[1,2]]), range?: number (default 3.5),
 *          editable?: boolean (show entry sliders, default true), vectors?: number (default 16) }
 */
export default function EigenStretch({ a: a0 = 2, b: b0 = 1, c: c0 = 1, d: d0 = 2, range = 3.5, editable = true, vectors = 16 }: {
  a?: number; b?: number; c?: number; d?: number; range?: number; editable?: boolean; vectors?: number;
}) {
  const [m, setM] = useState({ a: a0, b: b0, c: c0, d: d0 });
  const [s, setS] = useState(0);
  const [running, setRunning] = useState(!prefersReducedMotion());
  const phase = useRef(0);
  useFrame((dt) => { phase.current = (phase.current + dt / 4) % 1; setS(0.5 - 0.5 * Math.cos(2 * Math.PI * phase.current)); }, running);
  const { a, b, c, d } = m;
  // M_s = (1-s) I + s A
  const A = [1 - s + s * a, s * b, s * c, 1 - s + s * d];
  const box: [number, number, number, number] = [70, 6, 250, 186];
  const sx = scale([-range, range], [box[0], box[2]]); const sy = scale([-range, range], [box[3], box[1]]);
  const tr = a + d, det = a * d - b * c, disc = tr * tr - 4 * det;
  const eig: { l: number; v: [number, number] }[] = [];
  if (disc >= -1e-12) {
    const r = Math.sqrt(Math.max(0, disc));
    for (const l of disc > 1e-9 ? [(tr + r) / 2, (tr - r) / 2] : [tr / 2]) {
      let v: [number, number] = Math.abs(b) > 1e-9 ? [b, l - a] : Math.abs(c) > 1e-9 ? [l - d, c] : (Math.abs(l - a) < 1e-9 ? [1, 0] : [0, 1]);
      const n = Math.hypot(...v); v = [v[0] / n, v[1] / n];
      eig.push({ l, v });
      if (Math.abs(b) < 1e-9 && Math.abs(c) < 1e-9 && Math.abs(a - d) < 1e-9) { eig.push({ l, v: [0, 1] }); break; }
    }
  }
  const ring = Array.from({ length: 120 }, (_, i) => { const t = (2 * Math.PI * i) / 120; const x = Math.cos(t), y = Math.sin(t); return `${sx(A[0] * x + A[1] * y)},${sy(A[2] * x + A[3] * y)}`; }).join(' ');
  const arrows = [];
  for (let i = 0; i < vectors; i++) {
    const t = (2 * Math.PI * i) / vectors; const x = Math.cos(t), y = Math.sin(t);
    const X = A[0] * x + A[1] * y, Y = A[2] * x + A[3] * y;
    const onEig = eig.some(({ v }) => Math.abs(v[0] * y - v[1] * x) < 1e-6);
    arrows.push(<line key={i} x1={sx(0)} y1={sy(0)} x2={sx(X)} y2={sy(Y)} stroke={onEig ? 'var(--c3)' : C[(i % 2) + 1]} strokeWidth={onEig ? 2.4 : 1} opacity={onEig ? 1 : 0.55} markerEnd="url(#es-arr)" />);
  }
  // also draw the exact eigenvectors (they may not be among the ring samples)
  const eigArrows = eig.map(({ v }, i) => {
    const X = A[0] * v[0] + A[1] * v[1], Y = A[2] * v[0] + A[3] * v[1];
    return <line key={'e' + i} x1={sx(0)} y1={sy(0)} x2={sx(X)} y2={sy(Y)} stroke="var(--c3)" strokeWidth={2.6} markerEnd="url(#es-arr)" />;
  });
  const f = (v: number) => (+v.toFixed(2)).toString();
  return (
    <div>
      <Stage w={320} h={192} label="Matrix acting on unit vectors with eigenvectors highlighted">
        <defs><marker id="es-arr" viewBox="0 0 6 6" refX="5" refY="3" markerWidth="4" markerHeight="4" orient="auto"><path d="M0,0L6,3L0,6z" fill="var(--fg)" /></marker></defs>
        <rect x={box[0]} y={box[1]} width={box[2] - box[0]} height={box[3] - box[1]} fill="none" stroke="var(--grid)" />
        <line x1={box[0]} x2={box[2]} y1={sy(0)} y2={sy(0)} stroke="var(--grid)" />
        <line y1={box[1]} y2={box[3]} x1={sx(0)} x2={sx(0)} stroke="var(--grid)" />
        <circle cx={sx(0)} cy={sy(0)} r={sx(1) - sx(0)} fill="none" stroke="var(--muted)" strokeDasharray="2 3" />
        {eig.map(({ v }, i) => <line key={'l' + i} x1={sx(-v[0] * range * 2)} y1={sy(-v[1] * range * 2)} x2={sx(v[0] * range * 2)} y2={sy(v[1] * range * 2)} stroke="var(--c3)" strokeDasharray="5 4" strokeWidth={0.9} />)}
        <clipPath id="es-clip"><rect x={0} y={0} width={320} height={192} /></clipPath>
        <g clipPath="url(#es-clip)"><polygon points={ring} fill="var(--c2)" fillOpacity={0.12} stroke="var(--c2)" strokeWidth={1.4} />
        {arrows}{eigArrows}</g>
        <g fontSize="9" fill="var(--fg)">
          <text x={4} y={16}>A =</text>
          <text x={22} y={10}>[{f(a)}  {f(b)}]</text>
          <text x={22} y={22}>[{f(c)}  {f(d)}]</text>
          <text x={4} y={44} fill="var(--muted)">morph {s.toFixed(2)}</text>
          <text x={254} y={16} fill="var(--c3)">eigenvalues</text>
          {eig.length ? eig.map(({ l }, i) => <text key={i} x={254} y={28 + i * 11} fill="var(--c3)">λ{i + 1} = {f(l)}</text>)
            : <text x={254} y={28} fill="var(--c5)">complex:</text>}
          {!eig.length && <text x={254} y={39} fill="var(--c5)">{f(tr / 2)} ± {f(Math.sqrt(-disc) / 2)}i</text>}
          {!eig.length && <text x={254} y={52} fill="var(--muted)" fontSize="8">every vector turns</text>}
          <text x={254} y={176} fill="var(--muted)" fontSize="8">det = {f(det)}</text>
          <text x={254} y={186} fill="var(--muted)" fontSize="8">trace = {f(tr)}</text>
        </g>
      </Stage>
      <Controls>
        <Slider label="morph" min={0} max={1} value={s} onChange={(v) => { setRunning(false); setS(v); phase.current = Math.acos(1 - 2 * v) / (2 * Math.PI); }} />
        <PlayPause running={running} set={setRunning} />
        {editable && (['a', 'b', 'c', 'd'] as const).map((k) => (
          <Slider key={k} label={k} min={-3} max={3} step={0.1} value={m[k]} onChange={(v) => setM((o) => ({ ...o, [k]: v }))} />
        ))}
      </Controls>
    </div>
  );
}
