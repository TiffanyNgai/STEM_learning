import { useMemo, useRef, useState } from 'react';
import { Axes, C, Controls, PlayPause, Slider, Stage, compileExpr, rng, scale, useFrame } from './_kit';

interface Param { name: string; min: number; max: number; value: number; label?: string }
/**
 * 2D autonomous ODE  x' = dx(x,y), y' = dy(x,y): arrow field + flowing particles.
 * props: { dx: string, dy: string, range?: number, params?: Param[], particles?: number }
 * Tap the plot to drop a particle and watch its trajectory.
 */
export default function PhasePortrait({ dx = 'y', dy = '-x', range = 3, params = [], particles = 60 }: {
  dx?: string; dy?: string; range?: number; params?: Param[]; particles?: number;
}) {
  const [vals, setVals] = useState<Record<string, number>>(() => Object.fromEntries(params.map((p) => [p.name, p.value])));
  const names = params.map((p) => p.name);
  const fx = useMemo(() => compileExpr(dx, ['x', 'y', ...names]), [dx, names.join()]);
  const fy = useMemo(() => compileExpr(dy, ['x', 'y', ...names]), [dy, names.join()]);
  const pv = names.map((n) => vals[n]);
  const box: [number, number, number, number] = [60, 10, 260, 190];
  const sx = scale([-range, range], [box[0], box[2]]); const sy = scale([-range, range], [box[3], box[1]]);
  const inv = (px: number, py: number) => [(px - box[0]) / (box[2] - box[0]) * 2 * range - range, -((py - box[1]) / (box[3] - box[1]) * 2 * range - range)];
  const r = useRef(rng(7));
  const spawn = () => ({ x: (r.current.u() * 2 - 1) * range, y: (r.current.u() * 2 - 1) * range, age: r.current.u() * 4, trail: [] as [number, number][] });
  const ps = useRef(Array.from({ length: particles }, spawn));
  const [running, setRunning] = useState(true);
  const [, force] = useState(0);
  useFrame((dt) => {
    for (const p of ps.current) {
      for (let k = 0; k < 4; k++) {
        const h = dt / 4; const vx = fx(p.x, p.y, ...pv); const vy = fy(p.x, p.y, ...pv);
        p.x += vx * h; p.y += vy * h;
      }
      p.age += dt;
      p.trail.push([p.x, p.y]); if (p.trail.length > 25) p.trail.shift();
      if (p.age > 6 || !Number.isFinite(p.x) || Math.abs(p.x) > range * 1.5 || Math.abs(p.y) > range * 1.5) Object.assign(p, spawn(), { age: 0 });
    }
    force((v) => v + 1);
  }, running);
  const arrows = [];
  const n = 11;
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
    const x = -range + (2 * range * (i + 0.5)) / n; const y = -range + (2 * range * (j + 0.5)) / n;
    const vx = fx(x, y, ...pv); const vy = fy(x, y, ...pv); const m = Math.hypot(vx, vy) || 1;
    const L = 6; const x1 = sx(x), y1 = sy(y), x2 = x1 + (vx / m) * L, y2 = y1 - (vy / m) * L;
    arrows.push(<line key={i + '-' + j} x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--muted)" strokeWidth={0.8} markerEnd="url(#pp-arr)" opacity={0.6} />);
  }
  return (
    <div>
      <Stage label="Phase portrait">
        <defs><marker id="pp-arr" viewBox="0 0 6 6" refX="5" refY="3" markerWidth="4" markerHeight="4" orient="auto"><path d="M0,0L6,3L0,6z" fill="var(--muted)" /></marker></defs>
        <rect x={box[0]} y={box[1]} width={box[2] - box[0]} height={box[3] - box[1]} fill="transparent"
          onPointerDown={(e) => {
            const svg = (e.target as SVGElement).ownerSVGElement!; const pt = svg.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY;
            const q = pt.matrixTransform(svg.getScreenCTM()!.inverse()); const [x, y] = inv(q.x, q.y);
            ps.current[0] = { x, y, age: -4, trail: [] }; ps.current.push(ps.current.shift()!);
          }} />
        <Axes x={[-range, range]} y={[-range, range]} box={box} grid={false} xLabel="x" yLabel="y" />
        {arrows}
        {ps.current.map((p, i) => (
          <polyline key={i} points={p.trail.map(([a, b]) => `${sx(a)},${sy(b)}`).join(' ')} fill="none" stroke={C[i % 3 === 0 ? 1 : 0]} strokeWidth={1.4} strokeLinecap="round" opacity={0.85} pointerEvents="none" />
        ))}
      </Stage>
      <Controls>
        {params.map((p) => <Slider key={p.name} label={p.label ?? p.name} min={p.min} max={p.max} value={vals[p.name]} onChange={(v) => setVals((s) => ({ ...s, [p.name]: v }))} />)}
        <PlayPause running={running} set={setRunning} />
      </Controls>
    </div>
  );
}
