import { useMemo, useState } from 'react';
import { Axes, C, Controls, PlayPause, Slider, Stage, compileExpr, pathOf, scale, useFrame } from './_kit';

interface Param { name: string; min: number; max: number; value: number; label?: string }
/**
 * An object moving along a line, with linked position x(t), velocity v(t), acceleration a(t) graphs.
 * v and a are computed numerically from x(t), so any expression works.
 * props: { x?: string  position (m) as a function of t and params (default "-4 + v0*t + 0.5*a*t^2" with sliders v0, a),
 *          tMax?: number (s, default 6), params?: Param[] (sliders, e.g. initial velocity),
 *          show?: ('x'|'v'|'a')[] which graphs to draw (default all three),
 *          xRange?, vRange?, aRange?: [min,max] (auto if omitted), autoplay?: boolean (default true) }
 */
export default function MotionGraphs({ x: expr = '-4 + v0*t + 0.5*a*t^2', tMax = 6, show = ['x', 'v', 'a'],
  params = [{ name: 'v0', min: -3, max: 3, value: 2, label: 'v₀ (m/s)' }, { name: 'a', min: -2, max: 2, value: -0.5, label: 'a (m/s²)' }],
  xRange, vRange, aRange, autoplay = true }: {
  x?: string; tMax?: number; params?: Param[]; show?: ('x' | 'v' | 'a')[];
  xRange?: [number, number]; vRange?: [number, number]; aRange?: [number, number]; autoplay?: boolean;
}) {
  const [vals, setVals] = useState<Record<string, number>>(() => Object.fromEntries(params.map((p) => [p.name, p.value])));
  const names = params.map((p) => p.name);
  const f = useMemo(() => compileExpr(expr, ['t', ...names]), [expr, names.join()]);
  const pv = names.map((n) => vals[n]);
  const X = (t: number) => f(t, ...pv);
  const h = 1e-3;
  const V = (t: number) => (X(t + h) - X(t - h)) / (2 * h);
  const A = (t: number) => (X(t + h) - 2 * X(t) + X(t - h)) / (h * h);
  const fns = { x: X, v: V, a: A };
  const [t, setT] = useState(0);
  const [running, setRunning] = useState(autoplay);
  useFrame((dt) => setT((v) => (v + dt > tMax + 0.8 ? 0 : v + dt)), running);
  const tc = Math.min(t, tMax);
  const samples = (g: (t: number) => number) => Array.from({ length: 121 }, (_, i) => g((tMax * i) / 120));
  const auto = (g: (t: number) => number, given?: [number, number]): [number, number] => {
    if (given) return given;
    const s = samples(g).map((v) => (Math.abs(v) < 1e-6 ? 0 : v));
    let lo = Math.min(0, ...s); let hi = Math.max(0, ...s);
    if (hi - lo < 1) { lo -= 0.5; hi += 0.5; }
    const pad = 0.12 * (hi - lo);
    return [+(lo - pad).toFixed(2), +(hi + pad).toFixed(2)];
  };
  const ranges = { x: auto(X, xRange), v: auto(V, vRange), a: auto(A, aRange) };
  const units = { x: 'x (m)', v: 'v (m/s)', a: 'a (m/s²)' };
  // track
  const xr = ranges.x;
  const tx = scale(xr, [30, 300]);
  const pos = X(tc); const vel = V(tc);
  const panelH = 62; const top = 44;
  const H = top + show.length * (panelH + 8) + 6;
  return (
    <div>
      <Stage h={H} label="Moving object with position, velocity and acceleration graphs">
        <defs><marker id="mg-arr" viewBox="0 0 6 6" refX="5" refY="3" markerWidth="4" markerHeight="4" orient="auto"><path d="M0,0L6,3L0,6z" fill={C[1]} /></marker></defs>
        <line x1={30} x2={300} y1={26} y2={26} stroke="var(--muted)" strokeWidth={1} />
        {xr[0] <= 0 && xr[1] >= 0 && <line x1={tx(0)} x2={tx(0)} y1={22} y2={30} stroke="var(--fg)" />}
        {xr[0] <= 0 && xr[1] >= 0 && <text x={tx(0)} y={39} fontSize="8" textAnchor="middle" fill="var(--muted)">0</text>}
        <circle cx={tx(Math.max(xr[0], Math.min(xr[1], pos)))} cy={20} r={6} fill={C[0]} />
        {Math.abs(vel) > 0.05 && (
          <line x1={tx(pos)} y1={9} x2={tx(pos) + Math.max(-60, Math.min(60, vel * 12))} y2={9} stroke={C[1]} strokeWidth={2} markerEnd="url(#mg-arr)" />
        )}
        <text x={4} y={10} fontSize="8" fill="var(--muted)">t = {tc.toFixed(1)} s</text>
        {show.map((k, i) => {
          const y0 = top + i * (panelH + 8);
          const box: [number, number, number, number] = [30, y0, 300, y0 + panelH];
          const sx = scale([0, tMax], [box[0], box[2]]); const sy = scale(ranges[k], [box[3], box[1]]);
          const g = fns[k];
          const pts: [number, number][] = samples(g).map((v, j) => [sx((tMax * j) / 120), sy(v)]);
          const now = g(tc);
          return (
            <g key={k}>
              <Axes x={[0, tMax]} y={ranges[k]} box={box} yLabel={units[k]} xLabel={i === show.length - 1 ? 't (s)' : undefined} grid={false} />
              <path d={pathOf(pts)} fill="none" stroke={C[['x', 'v', 'a'].indexOf(k)]} strokeWidth={1.8} opacity={0.9} />
              <line x1={sx(tc)} x2={sx(tc)} y1={box[1]} y2={box[3]} stroke="var(--muted)" strokeDasharray="2 2" />
              <circle cx={sx(tc)} cy={sy(now)} r={3} fill={C[['x', 'v', 'a'].indexOf(k)]} />
              <text x={box[2]} y={box[1] + 7} fontSize="8" textAnchor="end" fill="var(--fg)">{now.toFixed(2)}</text>
            </g>
          );
        })}
      </Stage>
      <Controls>
        {params.map((p) => (
          <Slider key={p.name} label={p.label ?? p.name} min={p.min} max={p.max} value={vals[p.name]}
            onChange={(v) => setVals((s) => ({ ...s, [p.name]: v }))} />
        ))}
        <Slider label="t (s)" min={0} max={tMax} step={0.01} value={tc} onChange={(v) => { setRunning(false); setT(v); }} />
        <PlayPause running={running} set={setRunning} />
      </Controls>
    </div>
  );
}
