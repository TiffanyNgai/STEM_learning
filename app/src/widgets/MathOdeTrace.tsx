import { useMemo, useState } from 'react';
import { Axes, Btn, Controls, PlayPause, Slider, Stage, compileExpr, pathOf, prefersReducedMotion, scale, useClock } from './_kit';

interface Param { name: string; min: number; max: number; value: number; label?: string }
/**
 * Time series of a 2D autonomous ODE x' = dx(x, y), y' = dy(x, y), solved with RK4 (step 0.01)
 * from one or more starting points; draws x(t) for each start, revealed progressively.
 * Complements PhasePortrait (which hides the clock): here you see amplitude, period and transients.
 * props: { dx?: string (default "y"), dy?: string (default "-x"), params?: Param[],
 *          starts?: [number, number][] (default [[0.1, 0]]), tMax?: number (default 30),
 *          yRange?: [number, number] (default [-3, 3]), yLabel?: string (default "x") }
 */
export default function MathOdeTrace({ dx = 'y', dy = '-x', params = [], starts = [[0.1, 0]], tMax = 30, yRange = [-3, 3], yLabel = 'x' }: {
  dx?: string; dy?: string; params?: Param[]; starts?: [number, number][]; tMax?: number; yRange?: [number, number]; yLabel?: string;
}) {
  const [vals, setVals] = useState<Record<string, number>>(() => Object.fromEntries(params.map((p) => [p.name, p.value])));
  const names = params.map((p) => p.name);
  const fx = useMemo(() => compileExpr(dx, ['x', 'y', ...names]), [dx, names.join()]);
  const fy = useMemo(() => compileExpr(dy, ['x', 'y', ...names]), [dy, names.join()]);
  const [running, setRunning] = useState(!prefersReducedMotion());
  const [t, setT] = useClock(running, tMax / 8);
  const pv = names.map((n) => vals[n]);
  const curves = useMemo(() => starts.map(([x0, y0]) => {
    const h = 0.01, n = Math.round(tMax / h); let x = x0, y = y0; const out: [number, number][] = [[0, x]];
    const F = (a: number, b: number): [number, number] => [fx(a, b, ...pv), fy(a, b, ...pv)];
    for (let i = 1; i <= n; i++) {
      const k1 = F(x, y), k2 = F(x + h / 2 * k1[0], y + h / 2 * k1[1]), k3 = F(x + h / 2 * k2[0], y + h / 2 * k2[1]), k4 = F(x + h * k3[0], y + h * k3[1]);
      x += h / 6 * (k1[0] + 2 * k2[0] + 2 * k3[0] + k4[0]); y += h / 6 * (k1[1] + 2 * k2[1] + 2 * k3[1] + k4[1]);
      if (!Number.isFinite(x) || Math.abs(x) > 1e6) break;
      if (i % 5 === 0) out.push([i * h, x]);
    }
    return out;
  }), [fx, fy, pv.join(), JSON.stringify(starts), tMax]);
  const shown = running || t > 0 ? Math.min(t, tMax) : tMax;
  if (running && t > tMax * 1.15) setT(0);
  const box: [number, number, number, number] = [28, 10, 312, 180];
  const sx = scale([0, tMax], [box[0], box[2]]); const sy = scale(yRange, [box[3], box[1]]);
  const cl = (v: number) => Math.max(box[1] - 2, Math.min(box[3] + 2, sy(v)));
  return (
    <div>
      <Stage label={`Time series x(t) of x' = ${dx}, y' = ${dy}`}>
        <clipPath id="mot-clip"><rect x={box[0]} y={box[1] - 2} width={box[2] - box[0]} height={box[3] - box[1] + 4} /></clipPath>
        <Axes x={[0, tMax]} y={yRange} box={box} grid={false} xLabel="t" yLabel={yLabel} />
        <g clipPath="url(#mot-clip)">
          {curves.map((c, i) => <path key={i} d={pathOf(c.filter(([s]) => s <= shown).map(([s, v]) => [sx(s), cl(v)]))} stroke={`var(--c${(i % 6) + 2 > 6 ? 1 : (i % 6) + 2})`} strokeWidth={1.6} fill="none" />)}
        </g>
        {starts.length > 1 && starts.map(([a, b], i) => <text key={i} x={box[2] - 3} y={box[1] + 10 + i * 10} fontSize="8.5" textAnchor="end" style={{ fill: `var(--c${(i % 6) + 2 > 6 ? 1 : (i % 6) + 2})` }}>start ({a}, {b})</text>)}
      </Stage>
      <Controls>
        {params.map((p) => <Slider key={p.name} label={p.label ?? p.name} min={p.min} max={p.max} value={vals[p.name]} onChange={(v) => setVals((s) => ({ ...s, [p.name]: v }))} />)}
        <PlayPause running={running} set={setRunning} />
        <Btn onClick={() => setT(0)}>Replay</Btn>
      </Controls>
    </div>
  );
}
