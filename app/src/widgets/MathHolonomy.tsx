import { useMemo, useState } from 'react';
import { Btn, Controls, PlayPause, Slider, Stage, prefersReducedMotion, useFrame } from './_kit';

/**
 * Parallel transport on the unit sphere, and holonomy = enclosed area (Gauss–Bonnet).
 * Two loops:
 *  - 'triangle': the geodesic triangle with vertices N = north pole, A on the equator at longitude 0 and
 *    B on the equator at longitude α. Its three angles are α, 90°, 90°, so the angle excess is α — and the
 *    area of the triangle is also α (unit sphere). Carry a vector around N → A → B → N keeping it as
 *    parallel as the sphere allows: it comes back rotated by exactly α.
 *  - 'cap': transport around the circle of colatitude θ₀ (a latitude circle, not a geodesic unless θ₀ = 90°).
 *    The vector comes back rotated by 2π(1 − cos θ₀), which is the area of the cap it encloses.
 * The vector is integrated with the exact small-step parallel transport on the sphere, so the numbers on
 * screen are measured from the transport, not from the formula; the formula is printed next to them.
 * props: { loop?: 'triangle' | 'cap' (default 'triangle'), alpha?: number (deg, triangle longitude span,
 *          default 90), colat?: number (deg, cap colatitude, default 55), animate?: boolean (default true),
 *          loops?: ('triangle'|'cap')[] (buttons, default both) }
 */
type V = [number, number, number];
type L = 'triangle' | 'cap';
const CX = 196, CY = 104, S = 86, EL = 0.42, AZ = -0.5;
const D: V = [Math.cos(EL) * Math.cos(AZ), Math.cos(EL) * Math.sin(AZ), Math.sin(EL)];
const RT: V = [-Math.sin(AZ), Math.cos(AZ), 0];
const UP: V = [-Math.sin(EL) * Math.cos(AZ), -Math.sin(EL) * Math.sin(AZ), Math.cos(EL)];
const dot = (a: V, b: V) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a: V, b: V): V => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const nrm = (a: V): V => { const n = Math.hypot(...a) || 1; return [a[0] / n, a[1] / n, a[2] / n]; };
const pr = (q: V): [number, number] => [CX + S * dot(q, RT), CY - S * dot(q, UP)];
const geo = (p: V, q: V, t: number): V => nrm([p[0] + t * (q[0] - p[0]), p[1] + t * (q[1] - p[1]), p[2] + t * (q[2] - p[2])]);
/** Exact parallel transport of tangent vector v from p to a nearby q along the geodesic joining them. */
function pt(v: V, p: V, q: V): V {
  const c = 1 + dot(p, q); if (c < 1e-9) return v;
  const k = dot(v, q) / c;
  return nrm([v[0] - k * (p[0] + q[0]), v[1] - k * (p[1] + q[1]), v[2] - k * (p[2] + q[2])]);
}

export default function MathHolonomy({ loop = 'triangle', alpha = 90, colat = 55, animate = true, loops }: {
  loop?: L; alpha?: number; colat?: number; animate?: boolean; loops?: L[];
}) {
  const [lp, setLp] = useState<L>(loop);
  const [al, setAl] = useState(alpha);
  const [co, setCo] = useState(colat);
  const [run, setRun] = useState(animate && !prefersReducedMotion());
  const [s, setS] = useState(0);
  useFrame((dt) => setS((x) => (x + dt * 0.22) % 1.18), run);

  const { path, vecs, base, exact } = useMemo(() => {
    const N = 360;
    const a = (al * Math.PI) / 180, th = (co * Math.PI) / 180;
    const path: V[] = [];
    if (lp === 'triangle') {
      const P: V = [0, 0, 1], A: V = [1, 0, 0], B: V = [Math.cos(a), Math.sin(a), 0];
      const leg = (x: V, y: V) => { for (let i = 0; i < N / 3; i++) path.push(geo(x, y, i / (N / 3))); };
      leg(P, A); leg(A, B); leg(B, P);
      path.push(P);
    } else {
      for (let i = 0; i <= N; i++) { const t = (i / N) * 2 * Math.PI; path.push([Math.sin(th) * Math.cos(t), Math.sin(th) * Math.sin(t), Math.cos(th)]); }
    }
    const base = path[0];
    const start: V = lp === 'triangle' ? nrm(cross(cross(base, [1, 0, 0]), base)) : nrm(cross(cross(base, [0, 0, 1]), base));
    const vecs: V[] = [start];
    for (let i = 1; i < path.length; i++) vecs.push(pt(vecs[i - 1], path[i - 1], path[i]));
    const exact = lp === 'triangle' ? a : 2 * Math.PI * (1 - Math.cos(th));
    return { path, vecs, base, exact };
  }, [lp, al, co]);

  const n = path.length - 1;
  const i = Math.max(0, Math.min(n, Math.round(Math.min(1, s) * n)));
  const here = path[i], v = vecs[i], v0 = vecs[0], vf = vecs[n];
  const done = s >= 1;
  // measured turn, signed in the tangent plane at the base point, reported as a positive turn in [0,360)
  const cosA = Math.max(-1, Math.min(1, dot(v0, vf)));
  const sinA = dot(base, cross(v0, vf));
  let measured = Math.atan2(sinA, cosA); if (measured < 0) measured += 2 * Math.PI;
  const deg = (r: number) => ((r * 180) / Math.PI).toFixed(1);
  const seg = (from: number, to: number) => path.slice(from, to + 1).map((q) => pr(q).map((x) => x.toFixed(1)).join(',')).join(' ');
  const visible = (q: V) => dot(q, D) >= 0;
  const arrow = (p: V, w: V, col: string, len: number, width = 2.2) => {
    const [x1, y1] = pr(p); const [x2, y2] = pr([p[0] + len * w[0], p[1] + len * w[1], p[2] + len * w[2]]);
    const ang = Math.atan2(y2 - y1, x2 - x1);
    return <g><line x1={x1} y1={y1} x2={x2} y2={y2} stroke={`var(--${col})`} strokeWidth={width} />
      <path d={`M${x2},${y2}L${(x2 - 6 * Math.cos(ang - 0.4)).toFixed(1)},${(y2 - 6 * Math.sin(ang - 0.4)).toFixed(1)}L${(x2 - 6 * Math.cos(ang + 0.4)).toFixed(1)},${(y2 - 6 * Math.sin(ang + 0.4)).toFixed(1)}z`} fill={`var(--${col})`} /></g>;
  };
  const grid: string[] = [];
  for (let la = -60; la <= 60; la += 30) grid.push(Array.from({ length: 49 }, (_, j) => { const l = (j / 48) * 2 * Math.PI, b = (la * Math.PI) / 180; return pr([Math.cos(b) * Math.cos(l), Math.cos(b) * Math.sin(l), Math.sin(b)]).map((x) => x.toFixed(1)).join(','); }).join(' '));
  const opts = loops ?? (['triangle', 'cap'] as L[]);
  return (
    <div>
      <Stage w={320} h={216} label="Parallel transport of a vector around a loop on a sphere">
        <circle cx={CX} cy={CY} r={S} fill="var(--c6)" fillOpacity={0.07} stroke="var(--fg)" strokeWidth={1.2} />
        {grid.map((g, k) => <polyline key={k} points={g} fill="none" stroke="var(--grid)" strokeWidth={0.5} />)}
        <polyline points={seg(0, n)} fill="none" stroke="var(--muted)" strokeWidth={1} strokeDasharray="3 3" />
        <polyline points={seg(0, i)} fill="none" stroke="var(--c3)" strokeWidth={2.2} opacity={0.9} />
        {lp === 'triangle' && [path[0], path[Math.floor(n / 3)], path[Math.floor((2 * n) / 3)]].map((q, k) => {
          const [x, y] = pr(q);
          return <g key={k} opacity={visible(q) ? 1 : 0.35}><circle cx={x} cy={y} r={3} fill="var(--fg)" />
            <text x={x + 5} y={y - 4} fontSize="9.5" fontWeight="bold">{['N', 'A', 'B'][k]}</text></g>;
        })}
        <g opacity={visible(base) ? 1 : 0.4}>{arrow(base, v0, 'c4', 0.42, 1.6)}</g>
        {done && <g opacity={visible(base) ? 1 : 0.4}>{arrow(base, vf, 'c5', 0.42, 2.6)}</g>}
        <g opacity={visible(here) ? 1 : 0.35}>
          <circle cx={pr(here)[0]} cy={pr(here)[1]} r={3.4} fill="var(--c2)" />
          {arrow(here, v, 'c2', 0.42)}
        </g>
        <g fontSize="9.5">
          <text x={4} y={14} fontWeight="bold">{lp === 'triangle' ? 'geodesic triangle' : `latitude circle θ₀ = ${co}°`}</text>
          <text x={4} y={32} style={{ fill: 'var(--c4)' }}>start vector</text>
          <text x={4} y={45} style={{ fill: 'var(--c2)' }}>transported now</text>
          {done && <text x={4} y={58} style={{ fill: 'var(--c5)' }}>returned vector</text>}
          <text x={4} y={80} fontWeight="bold">measured turn</text>
          <text x={4} y={93}>{done ? `${deg(measured)}°` : '— (go round)'}</text>
          <text x={4} y={116} fontWeight="bold">enclosed area</text>
          <text x={4} y={129}>{deg(exact)}° = {exact.toFixed(3)} sr</text>
          <text x={4} y={150} fontSize="8.5" style={{ fill: 'var(--muted)' }}>{lp === 'triangle' ? 'area = α (excess over π)' : 'area = 2π(1 − cos θ₀)'}</text>
          <text x={4} y={168} fontSize="8.5" style={{ fill: 'var(--muted)' }}>holonomy = area,</text>
          <text x={4} y={179} fontSize="8.5" style={{ fill: 'var(--muted)' }}>counted mod 360°</text>
        </g>
      </Stage>
      <Controls>
        <PlayPause running={run} set={setRun} />
        {opts.map((o) => <Btn key={o} active={o === lp} onClick={() => { setLp(o); setS(0); }}>{o === 'triangle' ? 'triangle' : 'latitude circle'}</Btn>)}
        <Slider label="trip" min={0} max={1} step={0.005} value={Math.min(1, s)} onChange={(x) => { setRun(false); setS(x); }} format={(x) => `${Math.round(x * 100)}%`} />
        {lp === 'triangle'
          ? <Slider label="α" min={10} max={170} step={1} value={al} onChange={setAl} format={(x) => `${x}°`} />
          : <Slider label="θ₀" min={10} max={90} step={1} value={co} onChange={setCo} format={(x) => `${x}°`} />}
      </Controls>
    </div>
  );
}
