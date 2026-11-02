import { useId, useState } from 'react';
import { Axes, Controls, Slider, Stage, compileExpr, pathOf, scale } from './_kit';

/**
 * Pointwise vs uniform convergence of fₙ → f. Draws the limit f with an ε-tube around it and the current fₙ.
 * Parts of fₙ that stick out of the tube are red. Uniform convergence means: for n large, ALL of fₙ fits in
 * the tube. The readout shows sup|fₙ − f| (sampled). A probe x₀ shows pointwise convergence: the N needed
 * at that single point (searched to n = 20000), which may blow up as x₀ moves.
 * props: { fn?: string (fₙ(x) in x and n, default 'x^n'), limit?: string (f(x), default 'x < 1 ? 0 : 1'),
 *          x?: [number, number] (default [0, 1]), y?: [number, number] (default [-0.15, 1.2]), n?: number (default 3),
 *          nMax?: number (default 60), eps?: number (default 0.2), x0?: number (probe, default 0.8) }
 */
export default function MathUniformConv({ fn = 'x^n', limit = 'x < 1 ? 0 : 1', x = [0, 1], y = [-0.15, 1.2], n = 3, nMax = 60, eps = 0.2, x0 = 0.8 }: {
  fn?: string; limit?: string; x?: [number, number]; y?: [number, number]; n?: number; nMax?: number; eps?: number; x0?: number;
}) {
  const uid = useId().replace(/:/g, '');
  const fN = compileExpr(fn, ['x', 'n']); const f = compileExpr(limit, ['x']);
  const [k, setK] = useState(n); const [e, setE] = useState(eps); const [p, setP] = useState(x0);
  const box: [number, number, number, number] = [30, 10, 312, 150];
  const sx = scale(x, [box[0], box[2]]), sy = scale(y, [box[3], box[1]]);
  const S = 1200;
  const xs = Array.from({ length: S + 1 }, (_, i) => x[0] + ((x[1] - x[0]) * i) / S);
  let sup = 0, at = x[0];
  const runs: { pts: [number, number][]; bad: boolean }[] = [];
  xs.forEach((xv) => {
    const v = fN(xv, k), g = f(xv); if (!Number.isFinite(v) || !Number.isFinite(g)) return;
    const gap = Math.abs(v - g); if (gap > sup) { sup = gap; at = xv; }
    const bad = gap >= e; const last = runs[runs.length - 1];
    if (!last || last.bad !== bad) runs.push({ pts: last ? [last.pts[last.pts.length - 1]] : [], bad });
    runs[runs.length - 1].pts.push([sx(xv), sy(v)]);
  });
  // tube around f, drawn as thin vertical slices (copes with jumps in f)
  const tube = xs.filter((_, i) => i % 4 === 0).map((xv) => { const g = f(xv); return [sx(xv), sy(g + e), sy(g - e)]; });
  const limPts: [number, number][][] = [[]];
  xs.forEach((xv, i) => {
    const g = f(xv); if (i > 0 && Math.abs(g - f(xs[i - 1])) > (y[1] - y[0]) * 0.2) limPts.push([]);
    limPts[limPts.length - 1].push([sx(xv), sy(g)]);
  });
  // pointwise N at the probe
  let Np = 0; const g0 = f(p);
  for (let m = 1; m <= 20000; m++) if (!(Math.abs(fN(p, m) - g0) < e)) Np = m;
  const Ntxt = Np >= 19000 ? `> 20000` : String(Np + 1);
  const uniform = sup < e;
  return (
    <div>
      <Stage w={320} h={200} label="Pointwise versus uniform convergence">
        <defs><clipPath id={'uc' + uid}><rect x={box[0]} y={box[1]} width={box[2] - box[0]} height={box[3] - box[1]} /></clipPath></defs>
        <Axes x={x} y={y} box={box} grid={false} />
        <g clipPath={`url(#uc${uid})`}>
          {tube.map(([X, t, b], i) => <rect key={i} x={X - 0.5} y={t} width={1.3} height={Math.max(0, b - t)} fill="var(--c2)" fillOpacity={0.16} />)}
          {limPts.map((ps, i) => ps.length > 1 && <path key={i} d={pathOf(ps)} fill="none" stroke="var(--c2)" strokeWidth={1.6} strokeDasharray="5 3" />)}
          {runs.map((r, i) => r.pts.length > 1 && <path key={i} d={pathOf(r.pts)} fill="none" stroke={r.bad ? 'var(--c5)' : 'var(--c1)'} strokeWidth={2.4} />)}
          <line x1={sx(at)} x2={sx(at)} y1={sy(fN(at, k))} y2={sy(f(at))} stroke="var(--c4)" strokeWidth={1.5} />
          <line x1={sx(p)} x2={sx(p)} y1={box[1]} y2={box[3]} stroke="var(--c3)" strokeWidth={1} strokeDasharray="2 2" />
          <circle cx={sx(p)} cy={sy(fN(p, k))} r={3} fill="var(--c3)" />
        </g>
        <text x={6} y={172} fontSize="9.5">
          <tspan style={{ fill: 'var(--c4)' }}>sup |fₙ − f| ≈ {sup.toFixed(3)}</tspan>
          <tspan style={{ fill: uniform ? 'var(--c1)' : 'var(--c5)' }}>{uniform ? '  < ε: all of fₙ in the tube ✓' : '  ≥ ε: fₙ escapes the tube ✗'}</tspan>
        </text>
        <text x={6} y={188} fontSize="9.5" style={{ fill: 'var(--c3)' }}>at x₀ = {p.toFixed(3)} alone, terms stay within ε from n = {Ntxt}</text>
      </Stage>
      <Controls>
        <Slider label="n" value={k} min={1} max={nMax} step={1} onChange={setK} format={(v) => String(v)} />
        <Slider label="ε" value={e} min={0.02} max={0.6} step={0.01} onChange={setE} />
        <Slider label="probe x₀" value={p} min={x[0]} max={x[1]} step={0.001} onChange={setP} format={(v) => v.toFixed(3)} />
      </Controls>
    </div>
  );
}
