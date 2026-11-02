import { useRef, useState } from 'react';
import { Btn, C, Controls, Slider, Stage, pathOf, rng, useFrame } from './_kit';

/**
 * Bloch sphere for one qubit, drawn as a 2.5D projected sphere.
 * Gates animate as true rotations of the Bloch vector (X = π about x, H = π about (x+z)/√2, S = π/2 about z …).
 * props: {
 *   theta?: number (deg, polar angle from |0⟩, default 0), phi?: number (deg, azimuth, default 0),
 *   gates?: string[] (buttons from X,Y,Z,H,S,T,Sdg,Tdg; default ['X','Y','Z','H','S','T']),
 *   rotations?: boolean (show Rx/Ry/Rz buttons + angle slider, default false),
 *   sliders?: boolean (θ, φ sliders that set the state directly, default false),
 *   measure?: boolean (show a "Measure" button that collapses to |0⟩ or |1⟩, default false),
 *   probs?: boolean (show amplitudes + P(0), P(1), default true), seed?: number
 * }
 */
type V = [number, number, number];
const AX: Record<string, [V, number]> = {
  X: [[1, 0, 0], Math.PI], Y: [[0, 1, 0], Math.PI], Z: [[0, 0, 1], Math.PI],
  H: [[Math.SQRT1_2, 0, Math.SQRT1_2], Math.PI], S: [[0, 0, 1], Math.PI / 2], T: [[0, 0, 1], Math.PI / 4],
  Sdg: [[0, 0, 1], -Math.PI / 2], Tdg: [[0, 0, 1], -Math.PI / 4],
};
/** Rodrigues rotation of v about unit axis n by angle a. */
function rot(v: V, n: V, a: number): V {
  const c = Math.cos(a), s = Math.sin(a), d = n[0] * v[0] + n[1] * v[1] + n[2] * v[2];
  const cr: V = [n[1] * v[2] - n[2] * v[1], n[2] * v[0] - n[0] * v[2], n[0] * v[1] - n[1] * v[0]];
  return [0, 1, 2].map((i) => v[i] * c + cr[i] * s + n[i] * d * (1 - c)) as V;
}
const fromAngles = (th: number, ph: number): V => [Math.sin(th) * Math.cos(ph), Math.sin(th) * Math.sin(ph), Math.cos(th)];
const CX = 110, CY = 105, R = 80, G = 0.6, E = 0.3;
/** Project a 3D point to [svgX, svgY, depth]. x points toward the viewer (down-left), y right, z up. */
function proj([x, y, z]: V): [number, number, number] {
  const sx = y * Math.cos(G) - x * Math.sin(G);
  const depth = x * Math.cos(G) + y * Math.sin(G);
  const up = z * Math.cos(E) - depth * Math.sin(E);
  return [CX + R * sx, CY - R * up, depth * Math.cos(E) + z * Math.sin(E)];
}
const fmt = (v: number) => (Math.abs(v) < 0.005 ? '0' : v.toFixed(2));

export default function BlochSphere({ theta = 0, phi = 0, gates = ['X', 'Y', 'Z', 'H', 'S', 'T'], rotations = false, sliders = false, measure = false, probs = true, seed = 7 }: {
  theta?: number; phi?: number; gates?: string[]; rotations?: boolean; sliders?: boolean; measure?: boolean; probs?: boolean; seed?: number;
}) {
  const start = fromAngles((theta * Math.PI) / 180, (phi * Math.PI) / 180);
  const [v, setV] = useState<V>(start);
  const [busy, setBusy] = useState(false);
  const anim = useRef<{ from: V; n: V; a: number; s: number } | null>(null);
  const [trail, setTrail] = useState<V[]>([]);
  const [angle, setAngle] = useState(90);
  const [last, setLast] = useState<string>('');
  const r = useRef(rng(seed));
  useFrame((dt) => {
    const an = anim.current;
    if (!an) return;
    an.s = Math.min(1, an.s + dt / 0.9);
    const nv = rot(an.from, an.n, an.a * an.s);
    setV(nv); setTrail((tr) => [...tr.slice(-80), nv]);
    if (an.s >= 1) { anim.current = null; setBusy(false); }
  }, busy);
  const apply = (n: V, a: number, name: string) => { if (anim.current) return; setTrail([v]); setLast(name); anim.current = { from: v, n, a, s: 0 }; setBusy(true); };
  const th = Math.acos(Math.max(-1, Math.min(1, v[2])));
  const ph = Math.atan2(v[1], v[0]);
  const p0 = (1 + v[2]) / 2;
  const a0 = Math.cos(th / 2), b = Math.sin(th / 2);
  const circle = (f: (u: number) => V) => {
    const front: [number, number][][] = [], back: [number, number][][] = [];
    let side = 0;
    for (let i = 0; i <= 72; i++) {
      const [x, y, d] = proj(f((i / 72) * 2 * Math.PI));
      const now = d >= 0 ? 1 : -1, arr = now > 0 ? front : back;
      if (now !== side) { arr.push([]); side = now; }
      arr[arr.length - 1].push([x, y]);
    }
    return { f: front.filter((p) => p.length > 1).map(pathOf).join(''), b: back.filter((p) => p.length > 1).map(pathOf).join('') };
  };
  const eq = circle((u) => [Math.cos(u), Math.sin(u), 0]);
  const mer = circle((u) => [Math.sin(u), 0, Math.cos(u)]);
  const tip = proj(v);
  const labels: [V, string][] = [[[0, 0, 1.18], '|0⟩'], [[0, 0, -1.2], '|1⟩'], [[1.3, 0, 0], '|+⟩ x'], [[0, 1.25, 0], '|+i⟩ y'], [[-1.2, 0, 0], '|−⟩'], [[0, -1.2, 0], '|−i⟩']];
  return (
    <div>
      <Stage w={320} h={210} label="Bloch sphere showing the qubit state as an arrow">
        <circle cx={CX} cy={CY} r={R} fill="var(--surface)" stroke="var(--fg)" strokeWidth={1} opacity={0.9} />
        {[eq, mer].map((c, i) => (
          <g key={i} fill="none" stroke="var(--muted)" strokeWidth={0.8}>
            <path d={c.b} strokeDasharray="3 3" opacity={0.6} /><path d={c.f} />
          </g>
        ))}
        {([[1, 0, 0], [0, 1, 0], [0, 0, 1]] as V[]).map((ax, i) => {
          const p = proj(ax), m = proj([-ax[0], -ax[1], -ax[2]]);
          return <line key={i} x1={m[0]} y1={m[1]} x2={p[0]} y2={p[1]} stroke="var(--grid)" strokeWidth={0.8} />;
        })}
        {labels.map(([p, t]) => { const q = proj(p); return <text key={t} x={q[0]} y={q[1] + 3} fontSize="9" textAnchor="middle" fill="var(--muted)">{t}</text>; })}
        {trail.length > 1 && <path d={pathOf(trail.map((p) => proj(p).slice(0, 2) as [number, number]))} fill="none" stroke={C[2]} strokeWidth={1.5} strokeDasharray="2 2" />}
        <line x1={CX} y1={CY} x2={tip[0]} y2={tip[1]} stroke={C[3]} strokeWidth={2.5} />
        <circle cx={tip[0]} cy={tip[1]} r={tip[2] >= 0 ? 5 : 4} fill={C[3]} opacity={tip[2] >= 0 ? 1 : 0.55} />
        {probs && (
          <g fontSize="9" fill="var(--fg)">
            <text x={205} y={22}>α = {fmt(a0)}</text>
            <text x={205} y={34}>β = {fmt(b)}{b > 0.005 && Math.abs(ph) > 0.005 ? `·e^(i·${fmt(ph / Math.PI)}π)` : ''}</text>
            <text x={205} y={50} fill="var(--muted)">θ = {Math.round((th * 180) / Math.PI)}°, φ = {b < 0.005 ? 0 : Math.round((ph * 180) / Math.PI)}°</text>
            {[p0, 1 - p0].map((p, i) => (
              <g key={i} transform={`translate(205 ${66 + i * 22})`}>
                <text y={10}>P({i})</text>
                <rect x={26} y={2} width={64} height={10} fill="var(--grid)" rx={2} />
                <rect x={26} y={2} width={64 * p} height={10} fill={C[i]} rx={2} />
                <text x={94} y={10} fontSize="8">{p.toFixed(2)}</text>
              </g>
            ))}
            {last && <text x={232} y={130} fill="var(--muted)">last: {last}</text>}
          </g>
        )}
      </Stage>
      <Controls>
        {gates.filter((g) => AX[g]).map((g) => <Btn key={g} onClick={() => apply(AX[g][0], AX[g][1], g)}>{g.replace('dg', '†')}</Btn>)}
        {rotations && (['x', 'y', 'z'] as const).map((a, i) => (
          <Btn key={a} onClick={() => apply([i === 0 ? 1 : 0, i === 1 ? 1 : 0, i === 2 ? 1 : 0], (angle * Math.PI) / 180, `R${a}(${angle}°)`)}>R{a}</Btn>
        ))}
        {measure && <Btn onClick={() => { if (anim.current) return; const out = r.current.u() < p0 ? 0 : 1; setTrail([]); setV([0, 0, out ? -1 : 1]); setLast(`measured → ${out}`); }}>Measure</Btn>}
        <Btn onClick={() => { anim.current = null; setBusy(false); setV(start); setTrail([]); setLast(''); }}>Reset</Btn>
        {rotations && <Slider label="angle" min={-180} max={180} step={15} value={angle} onChange={setAngle} format={(x) => `${x}°`} />}
        {sliders && <Slider label="θ" min={0} max={180} step={1} value={Math.round((th * 180) / Math.PI)} onChange={(t) => { setTrail([]); setV(fromAngles((t * Math.PI) / 180, b < 0.005 ? 0 : ph)); }} format={(x) => `${x}°`} />}
        {sliders && <Slider label="φ" min={-180} max={180} step={1} value={b < 0.005 ? 0 : Math.round((ph * 180) / Math.PI)} onChange={(p) => { setTrail([]); setV(fromAngles(Math.max(th, 1e-3), (p * Math.PI) / 180)); }} format={(x) => `${x}°`} />}
      </Controls>
    </div>
  );
}
