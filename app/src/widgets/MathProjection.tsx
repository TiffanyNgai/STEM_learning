import { useId, useState } from 'react';
import { Controls, Slider, Stage, scale } from './_kit';

/**
 * Dot product and orthogonal projection in the plane. Vector a (blue) and b (orange) are set by
 * angle/length sliders. Shows the projection p = (a·b / a·a) a of b onto the line of a (green),
 * the residual b − p (red, dashed) with a right-angle mark, and readouts of a·b, |a|, |b|, cos θ, θ.
 * When a·b = 0 the label "orthogonal" lights up and the projection collapses to 0.
 * props: { a?: [length, angleDeg] (default [3, 15]), b?: [length, angleDeg] (default [2.5, 70]),
 *          range?: number (default 3.5), showProjection?: boolean (default true) }
 */
export default function MathProjection({ a: a0 = [3, 15], b: b0 = [2.5, 70], range = 3.5, showProjection = true }: {
  a?: [number, number]; b?: [number, number]; range?: number; showProjection?: boolean;
}) {
  const id = useId().replace(/:/g, '');
  const [aAng, setAAng] = useState(a0[1]);
  const [bLen, setBLen] = useState(b0[0]);
  const [bAng, setBAng] = useState(b0[1]);
  const aLen = a0[0];
  const rad = Math.PI / 180;
  const A = [aLen * Math.cos(aAng * rad), aLen * Math.sin(aAng * rad)];
  const B = [bLen * Math.cos(bAng * rad), bLen * Math.sin(bAng * rad)];
  const dot = A[0] * B[0] + A[1] * B[1];
  const k = dot / (aLen * aLen);
  const P = [k * A[0], k * A[1]];
  const cos = bLen > 1e-9 ? dot / (aLen * bLen) : 0;
  const theta = Math.acos(Math.max(-1, Math.min(1, cos))) / rad;
  const orth = Math.abs(cos) < 0.02;
  const box: [number, number, number, number] = [118, 6, 312, 200];
  const sx = scale([-range, range], [box[0], box[2]]); const sy = scale([-range, range], [box[3], box[1]]);
  const mk = `pj-${id}`;
  const arrow = (from: number[], to: number[], col: string, w = 2.4, dash?: string) =>
    <line x1={sx(from[0])} y1={sy(from[1])} x2={sx(to[0])} y2={sy(to[1])} stroke={`var(--${col})`} strokeWidth={w} strokeDasharray={dash} markerEnd={dash ? undefined : `url(#${mk}${col})`} />;
  // right-angle mark at P (between direction of a and residual)
  const ua = [A[0] / aLen, A[1] / aLen];
  const r = B.map((v, i) => v - P[i]); const rl = Math.hypot(r[0], r[1]);
  const ur = rl > 1e-6 ? [r[0] / rl, r[1] / rl] : [0, 0];
  const e = 0.18;
  const sq = rl > 0.25 && Math.abs(k) > 0.05 ? [[P[0] - ua[0] * e * Math.sign(k), P[1] - ua[1] * e * Math.sign(k)], [P[0] - ua[0] * e * Math.sign(k) + ur[0] * e, P[1] - ua[1] * e * Math.sign(k) + ur[1] * e], [P[0] + ur[0] * e, P[1] + ur[1] * e]] : null;
  const f = (v: number) => (+v.toFixed(2)).toString();
  return (
    <div>
      <Stage w={320} h={206} label="Dot product and projection of one vector onto another">
        <defs>
          {['c1', 'c2', 'c3'].map((c) => <marker key={c} id={mk + c} viewBox="0 0 6 6" refX="5" refY="3" markerWidth="4" markerHeight="4" orient="auto"><path d="M0,0L6,3L0,6z" fill={`var(--${c})`} /></marker>)}
        </defs>
        <rect x={box[0]} y={box[1]} width={box[2] - box[0]} height={box[3] - box[1]} fill="none" stroke="var(--grid)" />
        <line x1={box[0]} x2={box[2]} y1={sy(0)} y2={sy(0)} stroke="var(--grid)" />
        <line y1={box[1]} y2={box[3]} x1={sx(0)} x2={sx(0)} stroke="var(--grid)" />
        <line x1={sx(-ua[0] * range * 2)} y1={sy(-ua[1] * range * 2)} x2={sx(ua[0] * range * 2)} y2={sy(ua[1] * range * 2)} stroke="var(--c2)" strokeWidth={0.6} strokeDasharray="3 3" />
        {arrow([0, 0], A, 'c2')}
        {arrow([0, 0], B, 'c3')}
        {showProjection && Math.abs(k) > 0.02 && arrow([0, 0], P, 'c1', 3.2)}
        {showProjection && arrow(P, B, 'c5', 1.4, '4 3')}
        {showProjection && sq && <polyline points={sq.map(([x, y]) => `${sx(x)},${sy(y)}`).join(' ')} fill="none" stroke="var(--fg)" strokeWidth={0.8} />}
        <g fontSize="10">
          <text x={4} y={16} style={{ fill: 'var(--c2)' }}>a = ({f(A[0])}, {f(A[1])})</text>
          <text x={4} y={30} style={{ fill: 'var(--c3)' }}>b = ({f(B[0])}, {f(B[1])})</text>
          <text x={4} y={52} fontWeight="bold">a·b = {f(dot)}</text>
          <text x={4} y={66} fontSize="9">|a| = {f(aLen)}, |b| = {f(bLen)}</text>
          <text x={4} y={80} fontSize="9">cos θ = {f(cos)}, θ = {Math.round(theta)}°</text>
          {showProjection && <text x={4} y={100} fontSize="9" style={{ fill: 'var(--c1)' }}>proj = {f(k)} · a</text>}
          {showProjection && <text x={4} y={113} fontSize="9" style={{ fill: 'var(--c5)' }}>b − proj ⟂ a</text>}
          {orth && <text x={4} y={134} fontWeight="bold" style={{ fill: 'var(--c1)' }}>orthogonal!</text>}
        </g>
      </Stage>
      <Controls>
        <Slider label="a angle" min={-180} max={180} step={1} value={aAng} onChange={setAAng} format={(v) => `${v}°`} />
        <Slider label="b angle" min={-180} max={180} step={1} value={bAng} onChange={setBAng} format={(v) => `${v}°`} />
        <Slider label="b length" min={0} max={3.4} step={0.1} value={bLen} onChange={setBLen} />
      </Controls>
    </div>
  );
}
