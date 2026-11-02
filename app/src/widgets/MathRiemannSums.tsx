import { useState } from 'react';
import { Axes, Btn, Controls, Slider, Stage, compileExpr, pathOf, scale } from './_kit';

/**
 * Upper and lower Darboux sums for f on [a, b] with n equal subintervals.
 * Lower rectangles (height = inf of f on the piece) are filled green; upper rectangles (height = sup) are
 * outlined orange. The gap U − L is the orange area left over; increase n and watch it shrink to 0 for
 * an integrable f. inf/sup are estimated by sampling each piece (exact for monotone f).
 * props: { fn?: string (default 'x^2'), a?: number (default 0), b?: number (default 1), n?: number (1–100, default 4),
 *          y?: [number, number] (default auto), exact?: number (true integral, shown if given) }
 */
export default function MathRiemannSums({ fn = 'x^2', a = 0, b = 1, n = 4, y, exact }: {
  fn?: string; a?: number; b?: number; n?: number; y?: [number, number]; exact?: number;
}) {
  const f = compileExpr(fn, ['x']);
  const [k, setK] = useState(Math.max(1, Math.min(100, Math.round(n))));
  const [mode, setMode] = useState<'both' | 'lower' | 'upper'>('both');
  const pad = (b - a) * 0.06;
  const xr: [number, number] = [a - pad, b + pad];
  const curve: [number, number][] = [];
  for (let i = 0; i <= 300; i++) { const xv = xr[0] + ((xr[1] - xr[0]) * i) / 300; curve.push([xv, f(xv)]); }
  const fin = curve.map((p) => p[1]).filter(Number.isFinite);
  const yr: [number, number] = y ?? [Math.min(0, ...fin) - 0.05, Math.max(0, ...fin) * 1.08 + 0.05];
  const box: [number, number, number, number] = [30, 10, 312, 160];
  const sx = scale(xr, [box[0], box[2]]), sy = scale(yr, [box[3], box[1]]);
  const w = (b - a) / k;
  const pieces = Array.from({ length: k }, (_, i) => {
    const x0 = a + i * w; let lo = Infinity, hi = -Infinity;
    for (let j = 0; j <= 24; j++) { const v = f(x0 + (w * j) / 24); if (Number.isFinite(v)) { lo = Math.min(lo, v); hi = Math.max(hi, v); } }
    return { x0, lo, hi };
  });
  const U = pieces.reduce((s, p) => s + p.hi * w, 0), Lo = pieces.reduce((s, p) => s + p.lo * w, 0);
  const rect = (x0: number, h: number) => {
    const top = sy(Math.max(0, h)), bot = sy(Math.min(0, h));
    return { x: sx(x0), y: top, width: sx(x0 + w) - sx(x0), height: Math.max(0, bot - top) };
  };
  const fmt = (v: number) => v.toFixed(4);
  return (
    <div>
      <Stage w={320} h={200} label="Upper and lower Riemann sums">
        <Axes x={xr} y={yr} box={box} grid={false} />
        {mode !== 'lower' && pieces.map((p, i) => <rect key={'u' + i} {...rect(p.x0, p.hi)} fill="var(--c3)" fillOpacity={0.22} stroke="var(--c3)" strokeWidth={k > 40 ? 0.3 : 0.8} />)}
        {mode !== 'upper' && pieces.map((p, i) => <rect key={'l' + i} {...rect(p.x0, p.lo)} fill="var(--c1)" fillOpacity={0.55} stroke="var(--c1)" strokeWidth={k > 40 ? 0.2 : 0.6} />)}
        <path d={pathOf(curve.filter((p) => Number.isFinite(p[1])).map(([xv, v]) => [sx(xv), sy(v)]))} fill="none" stroke="var(--c2)" strokeWidth={2} />
        <text x={6} y={176} fontSize="9.5">
          <tspan style={{ fill: 'var(--c1)' }}>L = {fmt(Lo)}</tspan>{'   '}
          <tspan style={{ fill: 'var(--c3)' }}>U = {fmt(U)}</tspan>{'   '}
          <tspan fontWeight="bold">U − L = {fmt(U - Lo)}</tspan>
        </text>
        <text x={6} y={191} fontSize="9" style={{ fill: 'var(--muted)' }}>
          n = {k} pieces of width {+w.toPrecision(3)}{exact !== undefined ? `;  true integral = ${fmt(exact)}` : ''}
        </text>
      </Stage>
      <Controls>
        <Slider label="pieces n" value={k} min={1} max={100} step={1} onChange={setK} format={(v) => String(v)} />
        <Btn active={mode === 'both'} onClick={() => setMode('both')}>Both</Btn>
        <Btn active={mode === 'lower'} onClick={() => setMode('lower')}>Lower</Btn>
        <Btn active={mode === 'upper'} onClick={() => setMode('upper')}>Upper</Btn>
      </Controls>
    </div>
  );
}
