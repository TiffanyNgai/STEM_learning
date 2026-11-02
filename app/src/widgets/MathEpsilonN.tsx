import { useId, useState } from 'react';
import { Axes, Controls, Slider, Stage, compileExpr, scale } from './_kit';

/**
 * The ε–N game for a sequence aₙ → L. Shrink the ε-band around the candidate limit L and watch the
 * smallest working N respond: from N on, every term must sit strictly inside (L − ε, L + ε).
 * The widget searches terms up to n = 5000; if terms keep escaping it reports "no N found".
 * Dots inside the band are green, outside red; terms before N are faded.
 * props: { expr?: string (a_n in the variable n, default '1 + (-1)^n/n'), limit?: number (candidate L, default 1),
 *          eps?: number (initial ε, default 0.3), nMax?: number (terms drawn, 10–80, default 40),
 *          y?: [number, number] (vertical range, default auto), moveL?: boolean (show an L slider, default false) }
 */
export default function MathEpsilonN({ expr = '1 + (-1)^n/n', limit = 1, eps = 0.3, nMax = 40, y, moveL = false }: {
  expr?: string; limit?: number; eps?: number; nMax?: number; y?: [number, number]; moveL?: boolean;
}) {
  const uid = useId().replace(/:/g, '');
  const M = Math.max(10, Math.min(80, Math.round(nMax)));
  const [e, setE] = useState(eps);
  const [L, setL] = useState(limit);
  const f = compileExpr(expr, ['n']);
  const H = 5000;
  const vals: number[] = [];
  for (let n = 1; n <= H; n++) vals.push(f(n));
  let last = 0; // last index n with |a_n − L| ≥ ε
  for (let n = 1; n <= H; n++) { const v = vals[n - 1]; if (!(Math.abs(v - L) < e)) last = n; }
  const found = last < H * 0.8;
  const N = last + 1;
  const shown = vals.slice(0, M);
  const lo = Math.min(...shown.filter(Number.isFinite), L - e), hi = Math.max(...shown.filter(Number.isFinite), L + e);
  const yr: [number, number] = y ?? [lo - 0.1 * (hi - lo + 0.1), hi + 0.1 * (hi - lo + 0.1)];
  const box: [number, number, number, number] = [30, 12, 312, 168];
  const sx = scale([0, M + 1], [box[0], box[2]]), sy = scale(yr, [box[3], box[1]]);
  const clip = (v: number) => Math.max(box[1], Math.min(box[3], v));
  const msg = !found
    ? `ε = ${e.toFixed(3)}: terms still leave the band near n = ${H} — no N found (checked to n = ${H}).`
    : N > M ? `ε = ${e.toFixed(3)}: N = ${N} (beyond the plot) — still finite!`
      : `ε = ${e.toFixed(3)}: from N = ${N} on, every term is inside the band.`;
  return (
    <div>
      <Stage w={320} h={200} label="Epsilon band around a sequence">
        <defs><clipPath id={'en' + uid}><rect x={box[0]} y={box[1]} width={box[2] - box[0]} height={box[3] - box[1]} /></clipPath></defs>
        <Axes x={[0, M + 1]} y={yr} box={box} xLabel="n" yLabel="aₙ" grid={false} />
        <g clipPath={`url(#en${uid})`}>
          <rect x={box[0]} width={box[2] - box[0]} y={clip(sy(L + e))} height={Math.max(0, clip(sy(L - e)) - clip(sy(L + e)))} fill="var(--c2)" fillOpacity={0.15} />
          <line x1={box[0]} x2={box[2]} y1={sy(L + e)} y2={sy(L + e)} stroke="var(--c2)" strokeDasharray="4 3" strokeWidth={1} />
          <line x1={box[0]} x2={box[2]} y1={sy(L - e)} y2={sy(L - e)} stroke="var(--c2)" strokeDasharray="4 3" strokeWidth={1} />
          <line x1={box[0]} x2={box[2]} y1={sy(L)} y2={sy(L)} stroke="var(--c2)" strokeWidth={1.3} />
          {found && N <= M && <>
            <rect x={sx(N - 0.5)} width={box[2] - sx(N - 0.5)} y={box[1]} height={box[3] - box[1]} fill="var(--c1)" fillOpacity={0.08} />
            <line x1={sx(N - 0.5)} x2={sx(N - 0.5)} y1={box[1]} y2={box[3]} stroke="var(--c1)" strokeWidth={1.5} />
            <text x={sx(N - 0.5) + 3} y={box[1] + 10} fontSize="10" style={{ fill: 'var(--c1)' }} fontWeight="bold">N = {N}</text>
          </>}
          {shown.map((v, i) => {
            const n = i + 1; const inside = Math.abs(v - L) < e;
            return Number.isFinite(v) && <circle key={n} cx={sx(n)} cy={sy(v)} r={2.6}
              fill={inside ? 'var(--c1)' : 'var(--c5)'} opacity={found && n >= N ? 1 : 0.55} />;
          })}
        </g>
        <text x={box[2]} y={sy(L) - 3} fontSize="9" textAnchor="end" style={{ fill: 'var(--c2)' }}>L = {+L.toFixed(3)}</text>
        <text x={6} y={194} fontSize="9.5">{msg}</text>
      </Stage>
      <Controls>
        <Slider label="ε" value={e} min={0.005} max={1} step={0.005} onChange={setE} format={(v) => v.toFixed(3)} />
        {moveL && <Slider label="L" value={L} min={yr[0]} max={yr[1]} step={0.01} onChange={setL} />}
      </Controls>
    </div>
  );
}
