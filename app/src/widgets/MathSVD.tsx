import { useId, useRef, useState } from 'react';
import { Controls, PlayPause, Slider, Stage, prefersReducedMotion, scale, useFrame } from './_kit';

/**
 * SVD of a 2×2 matrix as rotate → stretch → rotate: A = U Σ Vᵀ.
 * The unit circle and the two right singular vectors v₁, v₂ (orange, purple) are carried through
 * three stages (stage slider 0→3, or Play): 1) Vᵀ rotates v₁, v₂ onto the axes; 2) Σ stretches
 * the axes by σ₁ ≥ σ₂ ≥ 0 (if det A < 0 the second axis is also flipped, shown as a stretch by −σ₂,
 * so both outer factors can be drawn as rotations); 3) U rotates the ellipse into place.
 * The final ellipse is A·(unit circle): semi-axes σ₁u₁ and σ₂u₂.
 * props: { a?, b?, c?, d? (default [[1,1],[0,1]], a shear: σ = 1.618, 0.618),
 *          range?: number (default 3), editable?: boolean (entry sliders, default true), animate?: boolean (default true) }
 */
function svd2(a: number, b: number, c: number, d: number) {
  const p = a * a + c * c, q = a * b + c * d, r = b * b + d * d; // AᵀA
  const tv = 0.5 * Math.atan2(2 * q, p - r);
  const v1 = [Math.cos(tv), Math.sin(tv)], v2 = [-Math.sin(tv), Math.cos(tv)];
  const Av1 = [a * v1[0] + b * v1[1], c * v1[0] + d * v1[1]], Av2 = [a * v2[0] + b * v2[1], c * v2[0] + d * v2[1]];
  const s1 = Math.hypot(Av1[0], Av1[1]), s2 = Math.hypot(Av2[0], Av2[1]);
  const u1 = s1 > 1e-9 ? [Av1[0] / s1, Av1[1] / s1] : [1, 0];
  const tu = Math.atan2(u1[1], u1[0]);
  const sign = a * d - b * c < 0 ? -1 : 1; // U = R(tu)·diag(1, sign)
  return { tv, tu, s1, s2, sign };
}

export default function MathSVD({ a: a0 = 1, b: b0 = 1, c: c0 = 0, d: d0 = 1, range = 3, editable = true, animate = true }: {
  a?: number; b?: number; c?: number; d?: number; range?: number; editable?: boolean; animate?: boolean;
}) {
  const id = useId().replace(/:/g, '');
  const [m, setM] = useState({ a: a0, b: b0, c: c0, d: d0 });
  const [p, setP] = useState(animate && !prefersReducedMotion() ? 0 : 3);
  const [running, setRunning] = useState(animate && !prefersReducedMotion());
  const clock = useRef(0);
  useFrame((dt) => { clock.current = (clock.current + dt) % 8; setP(Math.min(3, Math.max(0, (clock.current - 0.8) * 0.6))); }, running);
  const { a, b, c, d } = m;
  const { tv, tu, s1, s2, sign } = svd2(a, b, c, d);
  // composite map at stage p
  const t1 = Math.min(1, p), t2 = Math.min(1, Math.max(0, p - 1)), t3 = Math.max(0, p - 2);
  const rot = (th: number) => [Math.cos(th), -Math.sin(th), Math.sin(th), Math.cos(th)];
  const mul = (X: number[], Y: number[]) => [X[0] * Y[0] + X[1] * Y[2], X[0] * Y[1] + X[1] * Y[3], X[2] * Y[0] + X[3] * Y[2], X[2] * Y[1] + X[3] * Y[3]];
  const S = [1 + (s1 - 1) * t2, 0, 0, 1 + (sign * s2 - 1) * t2];
  const T = mul(rot(tu * t3), mul(S, rot(-tv * t1)));
  const box: [number, number, number, number] = [118, 6, 312, 200];
  const sx = scale([-range, range], [box[0], box[2]]); const sy = scale([-range, range], [box[3], box[1]]);
  const ap = (x: number, y: number): [number, number] => [T[0] * x + T[1] * y, T[2] * x + T[3] * y];
  const ring = Array.from({ length: 96 }, (_, i) => { const th = (2 * Math.PI * i) / 96; const [X, Y] = ap(Math.cos(th), Math.sin(th)); return `${sx(X).toFixed(1)},${sy(Y).toFixed(1)}`; }).join(' ');
  const v1 = ap(Math.cos(tv), Math.sin(tv)), v2 = ap(-Math.sin(tv), Math.cos(tv));
  const marker = `svd-${id}`;
  const stage = p < 0.01 ? 'start: unit circle' : p <= 1 ? '1. rotate by Vᵀ' : p <= 2 ? '2. stretch by Σ' : '3. rotate by U';
  const f = (v: number) => (+v.toFixed(2)).toString();
  const deg = (r: number) => `${Math.round((r * 180) / Math.PI)}°`;
  const arrow = (to: [number, number], col: string) => <line x1={sx(0)} y1={sy(0)} x2={sx(to[0])} y2={sy(to[1])} stroke={`var(--${col})`} strokeWidth={2.4} markerEnd={`url(#${marker}${col})`} />;
  return (
    <div>
      <Stage w={320} h={206} label="Singular value decomposition: rotate, stretch, rotate">
        <defs>
          <clipPath id={marker + 'clip'}><rect x={box[0]} y={box[1]} width={box[2] - box[0]} height={box[3] - box[1]} /></clipPath>
          {['c3', 'c4'].map((k) => <marker key={k} id={marker + k} viewBox="0 0 6 6" refX="5" refY="3" markerWidth="4" markerHeight="4" orient="auto"><path d="M0,0L6,3L0,6z" fill={`var(--${k})`} /></marker>)}
        </defs>
        <rect x={box[0]} y={box[1]} width={box[2] - box[0]} height={box[3] - box[1]} fill="none" stroke="var(--grid)" />
        <line x1={box[0]} x2={box[2]} y1={sy(0)} y2={sy(0)} stroke="var(--grid)" />
        <line y1={box[1]} y2={box[3]} x1={sx(0)} x2={sx(0)} stroke="var(--grid)" />
        <circle cx={sx(0)} cy={sy(0)} r={sx(1) - sx(0)} fill="none" stroke="var(--muted)" strokeDasharray="2 3" />
        <g clipPath={`url(#${marker}clip)`}>
          <polygon points={ring} fill="var(--c2)" fillOpacity={0.15} stroke="var(--c2)" strokeWidth={1.5} />
          {arrow(v1, 'c3')}{arrow(v2, 'c4')}
        </g>
        <g fontSize="10">
          <text x={4} y={16}>A =</text>
          <text x={24} y={11}>[</text><text x={24} y={24}>[</text><text x={98} y={11}>]</text><text x={98} y={24}>]</text>
          <text x={50} y={11} textAnchor="end">{f(a)}</text><text x={88} y={11} textAnchor="end">{f(b)}</text>
          <text x={50} y={24} textAnchor="end">{f(c)}</text><text x={88} y={24} textAnchor="end">{f(d)}</text>
          <text x={4} y={46} fontWeight="bold" style={{ fill: 'var(--c2)' }}>{stage}</text>
          <text x={4} y={68} style={{ fill: 'var(--c3)' }}>σ₁ = {f(s1)}</text>
          <text x={4} y={81} style={{ fill: 'var(--c4)' }}>σ₂ = {f(s2)}</text>
          <text x={4} y={100} fontSize="9" style={{ fill: 'var(--muted)' }}>Vᵀ: turn by {deg(-tv)}</text>
          <text x={4} y={112} fontSize="9" style={{ fill: 'var(--muted)' }}>U: turn by {deg(tu)}{sign < 0 ? ' + flip' : ''}</text>
          <text x={4} y={130} fontSize="9" style={{ fill: 'var(--muted)' }}>|det A| = σ₁σ₂ = {f(s1 * s2)}</text>
        </g>
      </Stage>
      <Controls>
        <Slider label="stage" min={0} max={3} value={p} onChange={(v) => { setRunning(false); setP(v); }} />
        <PlayPause running={running} set={setRunning} />
        {editable && (['a', 'b', 'c', 'd'] as const).map((k) => (
          <Slider key={k} label={k} min={-3} max={3} step={0.1} value={m[k]} onChange={(v) => setM((o) => ({ ...o, [k]: v }))} />
        ))}
      </Controls>
    </div>
  );
}
