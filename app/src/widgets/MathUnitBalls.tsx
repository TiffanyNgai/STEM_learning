import { useState } from 'react';
import { Btn, Controls, Slider, Stage, pathOf, scale } from './_kit';

/**
 * Balls in different metrics on the plane. The ball B(0, r) = { x : d(0, x) < r } for the p-metric
 * d_p(x, y) = (|x₁−y₁|ᵖ + |x₂−y₂|ᵖ)^(1/p) is a diamond for p = 1 (taxicab), a disc for p = 2 (Euclidean)
 * and a square for p = ∞ (max metric). Move the point q to compare its three distances from the origin and
 * see which balls contain it. The taxicab route (orange) and the straight route (blue) are drawn.
 * props: { p?: number (initial p, 1–10, or 0 meaning ∞; default 2), r?: number (radius, default 1),
 *          q?: [number, number] (default [0.6, 0.5]), showAll?: boolean (draw the 1, 2, ∞ balls faintly; default true) }
 */
const norm = (x: number, y: number, p: number) =>
  p === 0 ? Math.max(Math.abs(x), Math.abs(y)) : (Math.abs(x) ** p + Math.abs(y) ** p) ** (1 / p);

export default function MathUnitBalls({ p = 2, r = 1, q = [0.6, 0.5], showAll = true }: {
  p?: number; r?: number; q?: [number, number]; showAll?: boolean;
}) {
  const [P, setP] = useState(p);
  const [R, setR] = useState(r);
  const [qx, setQx] = useState(q[0]); const [qy, setQy] = useState(q[1]);
  const lim = 1.6;
  const sx = scale([-lim, lim], [70, 250]), sy = scale([-lim, lim], [190, 10]);
  const ball = (pp: number, rad: number) => {
    const pts: [number, number][] = [];
    for (let i = 0; i <= 240; i++) {
      const th = (2 * Math.PI * i) / 240; const c = Math.cos(th), s = Math.sin(th);
      const k = rad / norm(c, s, pp); pts.push([sx(k * c), sy(k * s)]);
    }
    return pathOf(pts) + 'Z';
  };
  const d1 = norm(qx, qy, 1), d2 = norm(qx, qy, 2), dI = norm(qx, qy, 0), dp = norm(qx, qy, P);
  const pl = P === 0 ? '∞' : P.toFixed(1);
  return (
    <div>
      <Stage w={320} h={200} label="Unit balls for different metrics">
        <line x1={sx(-lim)} x2={sx(lim)} y1={sy(0)} y2={sy(0)} stroke="var(--grid)" />
        <line x1={sx(0)} x2={sx(0)} y1={sy(-lim)} y2={sy(lim)} stroke="var(--grid)" />
        {showAll && [1, 2, 0].map((pp) => <path key={pp} d={ball(pp, R)} fill="none" stroke="var(--muted)" strokeWidth={0.7} strokeDasharray="3 3" />)}
        <path d={ball(P, R)} fill="var(--c2)" fillOpacity={0.18} stroke="var(--c2)" strokeWidth={2} />
        <path d={`M${sx(0)},${sy(0)}L${sx(qx)},${sy(0)}L${sx(qx)},${sy(qy)}`} fill="none" stroke="var(--c3)" strokeWidth={1.6} />
        <line x1={sx(0)} y1={sy(0)} x2={sx(qx)} y2={sy(qy)} stroke="var(--c2)" strokeWidth={1.6} />
        <circle cx={sx(qx)} cy={sy(qy)} r={4} fill={dp < R ? 'var(--c1)' : 'var(--c5)'} />
        <text x={sx(qx) + 6} y={sy(qy) - 4} fontSize="10" fontWeight="bold">q</text>
        <text x={4} y={14} fontSize="9.5" style={{ fill: 'var(--c2)' }} fontWeight="bold">p = {pl}</text>
        <text x={4} y={30} fontSize="9" style={{ fill: 'var(--c3)' }}>d₁ = {d1.toFixed(3)}</text>
        <text x={4} y={44} fontSize="9" style={{ fill: 'var(--c2)' }}>d₂ = {d2.toFixed(3)}</text>
        <text x={4} y={58} fontSize="9">d∞ = {dI.toFixed(3)}</text>
        <text x={4} y={190} fontSize="9" style={{ fill: dp < R ? 'var(--c1)' : 'var(--c5)' }}>{dp < R ? 'q inside' : 'q outside'} B(0, {R.toFixed(2)})</text>
        <text x={316} y={190} fontSize="8" textAnchor="end" style={{ fill: 'var(--muted)' }}>dashed: p = 1, 2, ∞</text>
      </Stage>
      <Controls>
        <Btn active={P === 1} onClick={() => setP(1)}>p = 1</Btn>
        <Btn active={P === 2} onClick={() => setP(2)}>p = 2</Btn>
        <Btn active={P === 0} onClick={() => setP(0)}>p = ∞</Btn>
        <Slider label="p" value={P === 0 ? 10 : P} min={1} max={10} step={0.1} onChange={setP} format={() => pl} />
        <Slider label="radius r" value={R} min={0.2} max={1.5} step={0.01} onChange={setR} />
        <Slider label="q x" value={qx} min={-1.5} max={1.5} step={0.01} onChange={setQx} />
        <Slider label="q y" value={qy} min={-1.5} max={1.5} step={0.01} onChange={setQy} />
      </Controls>
    </div>
  );
}
