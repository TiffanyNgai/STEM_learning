import { useState } from 'react';
import { Btn, Controls, PlayPause, Slider, Stage, prefersReducedMotion, useFrame } from './_kit';

/**
 * Gluing a square: edge-identification diagram with arrows (single arrows = edge a, double = edge b),
 * plus a "bug" walking in a straight line that leaves through one edge and re-enters through the edge it
 * is glued to. Its little flag (dot on its left) flips when it crosses an orientation-reversing gluing.
 * For the cylinder and torus the right panel animates the actual folding in 3D (wireframe); for the
 * Möbius strip, Klein bottle, sphere and RP² it shows the edge word and key facts.
 * props: { surface?: 'torus' | 'klein' | 'sphere' | 'rp2' | 'cylinder' | 'mobius' (default 'torus'),
 *          angle?: number (bug heading in degrees, default 27), choices?: string[] (surfaces offered as buttons,
 *          default all six), animate?: boolean (default true) }
 */
type S = 'torus' | 'klein' | 'sphere' | 'rp2' | 'cylinder' | 'mobius';
type V = [number, number];
const NAMES: Record<S, string> = { torus: 'torus', klein: 'Klein bottle', sphere: 'sphere', rp2: 'RP²', cylinder: 'cylinder', mobius: 'Möbius strip' };
const WORD: Record<S, string> = { torus: 'a b a⁻¹ b⁻¹', klein: 'a b a b⁻¹', sphere: 'a b b⁻¹ a⁻¹', rp2: 'a b a b', cylinder: 'x b y b⁻¹ (x, y free)', mobius: 'x b y b (x, y free)' };
const FACTS: Record<S, string[]> = {
  torus: ['orientable, closed', 'χ = 0'], klein: ['non-orientable, closed', 'χ = 0', 'no embedding in 3D'],
  sphere: ['orientable, closed', 'χ = 2'], rp2: ['non-orientable, closed', 'χ = 1', 'no embedding in 3D'],
  cylinder: ['orientable', 'two boundary circles'], mobius: ['non-orientable', 'one boundary circle'],
};
// Edge marks: [x1,y1,x2,y2 in unit square (arrow from 1 to 2), arrow count (0 = free boundary), colour]
const EDGES: Record<S, [number, number, number, number, number, string][]> = {
  torus: [[0, 0, 1, 0, 1, 'var(--c2)'], [0, 1, 1, 1, 1, 'var(--c2)'], [0, 0, 0, 1, 2, 'var(--c3)'], [1, 0, 1, 1, 2, 'var(--c3)']],
  klein: [[0, 0, 1, 0, 1, 'var(--c2)'], [1, 1, 0, 1, 1, 'var(--c2)'], [0, 0, 0, 1, 2, 'var(--c3)'], [1, 0, 1, 1, 2, 'var(--c3)']],
  sphere: [[0, 0, 1, 0, 1, 'var(--c2)'], [0, 0, 0, 1, 1, 'var(--c2)'], [0, 1, 1, 1, 2, 'var(--c3)'], [1, 0, 1, 1, 2, 'var(--c3)']],
  rp2: [[0, 0, 1, 0, 1, 'var(--c2)'], [1, 1, 0, 1, 1, 'var(--c2)'], [0, 1, 0, 0, 2, 'var(--c3)'], [1, 0, 1, 1, 2, 'var(--c3)']],
  cylinder: [[0, 0, 1, 0, 0, 'var(--muted)'], [0, 1, 1, 1, 0, 'var(--muted)'], [0, 0, 0, 1, 2, 'var(--c3)'], [1, 0, 1, 1, 2, 'var(--c3)']],
  mobius: [[0, 0, 1, 0, 0, 'var(--muted)'], [0, 1, 1, 1, 0, 'var(--muted)'], [0, 1, 0, 0, 2, 'var(--c3)'], [1, 0, 1, 1, 2, 'var(--c3)']],
};

/** Move across an edge according to the gluing. Returns new position, velocity, and whether handedness flipped. */
function wrap(s: S, p: V, v: V): [V, V, boolean] {
  let [x, y] = p; let [dx, dy] = v; let flip = false;
  for (let k = 0; k < 4; k++) {
    if (x > 1 || x < 0) {
      const out = x > 1;
      if (s === 'sphere') { [x, y, dx, dy] = out ? [y, 2 - x, dy, -dx] : [y, -x, dy, -dx]; continue; }
      x = out ? x - 1 : x + 1;
      if (s === 'rp2' || s === 'mobius') { y = 1 - y; dy = -dy; flip = !flip; }
    } else if (y > 1 || y < 0) {
      const out = y > 1;
      if (s === 'sphere') { [x, y, dx, dy] = out ? [2 - y, x, -dy, dx] : [-y, x, -dy, dx]; continue; }
      if (s === 'cylinder' || s === 'mobius') { y = out ? 2 - y : -y; dy = -dy; continue; } // bounce off the free boundary (a turn, not a mirror)
      y = out ? y - 1 : y + 1;
      if (s === 'klein' || s === 'rp2') { x = 1 - x; dx = -dx; flip = !flip; }
    } else break;
  }
  return [[x, y], [dx, dy], flip];
}

// 3D folding for cylinder / torus: roll the 2nd coordinate (stage a) then bend the 1st (stage b). Returns projected [x, y, depth].
function fold(u: number, v: number, a: number, b: number, torus: boolean, rot: number): [number, number, number] {
  const L = 2.4; // stretch the square horizontally (rubber!) so the torus is not degenerate
  const xx = (u - 0.5) * L; const s = v - 0.5; const k = 2 * Math.PI * a;
  let y = s, z = 0;
  if (k > 1e-4) { y = Math.sin(k * s) / k; z = (1 - Math.cos(k * s)) / k; }
  let X = xx, Y = y, Z = z;
  const K = torus ? (2 * Math.PI * b) / L : 0;
  if (K > 1e-4) { const c = (a > 0 ? 1 / (2 * Math.PI) : 0); const rho = 1 / K + (z - c); const ph = K * xx; X = rho * Math.sin(ph); Z = rho * Math.cos(ph) - 1 / K + c; Y = y; }
  // view: rotate about vertical axis by rot, tilt by 0.5 rad
  const cr = Math.cos(rot), sr = Math.sin(rot);
  const x1 = cr * X + sr * Z, z1 = -sr * X + cr * Z;
  const ct = Math.cos(0.55), st = Math.sin(0.55);
  return [x1, ct * Y - st * z1, st * Y + ct * z1];
}

export default function MathGluingSquare({ surface = 'torus', angle = 27, choices, animate = true }: {
  surface?: S; angle?: number; choices?: S[]; animate?: boolean;
}) {
  const [s, setS] = useState<S>(surface);
  const [ang, setAng] = useState(angle);
  const [run, setRun] = useState(animate && !prefersReducedMotion());
  const [bug, setBug] = useState<{ p: V; v: V; flip: boolean; trail: V[][] }>({ p: [0.3, 0.35], v: [Math.cos(angle * Math.PI / 180), Math.sin(angle * Math.PI / 180)], flip: false, trail: [[[0.3, 0.35]]] });
  const [g, setG] = useState(0); // gluing progress 0..2 (roll, then bend)
  const [rot, setRot] = useState(0.4);
  const reset = (sur: S, a: number) => { setS(sur); setAng(a); setG(0); setBug({ p: [0.3, 0.35], v: [Math.cos(a * Math.PI / 180), Math.sin(a * Math.PI / 180)], flip: false, trail: [[[0.3, 0.35]]] }); };
  useFrame((dt) => {
    setBug((b) => {
      const np: V = [b.p[0] + b.v[0] * dt * 0.28, b.p[1] + b.v[1] * dt * 0.28];
      const [q, w, f] = wrap(s, np, b.v);
      const jumped = Math.abs(q[0] - np[0]) + Math.abs(q[1] - np[1]) > 1e-9;
      let tr = b.trail.map((x) => x);
      if (jumped) tr.push([q]); else tr[tr.length - 1] = [...tr[tr.length - 1], q];
      const total = tr.reduce((n, x) => n + x.length, 0);
      if (total > 900) tr = [[q]];
      return { p: q, v: w, flip: f ? !b.flip : b.flip, trail: tr };
    });
    if (s === 'torus' || s === 'cylinder') { setG((x) => (x >= 2.6 ? 0 : x + dt * 0.35)); setRot((r) => r + dt * 0.25); }
  }, run);

  const X0 = 22, Y0 = 30, W = 130; // square on the left, y up
  const P = ([x, y]: V): V => [X0 + x * W, Y0 + (1 - y) * W];
  const arrowHead = (x: number, y: number, ux: number, uy: number, col: string, key: string) =>
    <path key={key} d={`M${x + 6 * ux},${y + 6 * uy}L${x - 5 * ux - 4 * uy},${y - 5 * uy + 4 * ux}L${x - 5 * ux + 4 * uy},${y - 5 * uy - 4 * ux}z`} fill={col} />;
  const [bx, by] = P(bug.p);
  const hd = Math.atan2(-bug.v[1], bug.v[0]);
  const side = bug.flip ? -1 : 1;
  const fold3d = s === 'torus' || s === 'cylinder';
  const a = Math.min(1, g), b = s === 'torus' ? Math.max(0, Math.min(1, g - 1)) : 0;
  const mesh: string[] = [];
  if (fold3d) {
    const cx = 245, cy = 102, sc = 46;
    const pr = (u: number, v: number) => { const [x, y] = fold(v, u, a, b, s === 'torus', rot); return `${(cx + sc * x).toFixed(1)},${(cy - sc * y).toFixed(1)}`; };
    for (let i = 0; i <= 12; i++) mesh.push(Array.from({ length: 25 }, (_, j) => pr(i / 12, j / 24)).join(' '));
    for (let j = 0; j <= 8; j++) mesh.push(Array.from({ length: 49 }, (_, i) => pr(i / 48, j / 8)).join(' '));
  }
  const opts = choices ?? (['torus', 'klein', 'sphere', 'rp2', 'cylinder', 'mobius'] as S[]);
  return (
    <div>
      <Stage w={320} h={200} label={`A square with edges glued to make a ${NAMES[s]}`}>
        <rect x={X0} y={Y0} width={W} height={W} fill="var(--c6)" fillOpacity={0.08} />
        {bug.trail.map((seg, i) => <polyline key={i} points={seg.map((q) => P(q).join(',')).join(' ')} fill="none" stroke="var(--c5)" strokeWidth={1.4} opacity={0.75} />)}
        {EDGES[s].map(([x1, y1, x2, y2, n, col], i) => {
          const [p1x, p1y] = P([x1, y1]); const [p2x, p2y] = P([x2, y2]);
          const ux = Math.sign(p2x - p1x), uy = Math.sign(p2y - p1y);
          const mx = (p1x + p2x) / 2, my = (p1y + p2y) / 2;
          return <g key={i}>
            <line x1={p1x} y1={p1y} x2={p2x} y2={p2y} stroke={col} strokeWidth={n ? 3 : 1.5} strokeDasharray={n ? undefined : '4 3'} />
            {n >= 1 && arrowHead(mx - (n === 2 ? 5 * ux : 0), my - (n === 2 ? 5 * uy : 0), ux, uy, col, 'a')}
            {n === 2 && arrowHead(mx + 5 * ux, my + 5 * uy, ux, uy, col, 'b')}
          </g>;
        })}
        <g transform={`translate(${bx},${by}) rotate(${(hd * 180) / Math.PI})`}>
          <path d="M7,0L-5,-4.5L-5,4.5z" fill="var(--c5)" />
          <circle cx={-1} cy={-7 * side} r={2.6} fill="var(--c1)" />
        </g>
        <text x={X0 + W / 2} y={18} textAnchor="middle" fontSize="11" fontWeight="bold" fill="var(--fg)">{NAMES[s]}</text>
        <text x={X0 + W / 2} y={Y0 + W + 18} textAnchor="middle" fontSize="10" fill="var(--muted)">edge word: {WORD[s]}</text>
        {bug.flip && <text x={X0 + W / 2} y={Y0 + W + 31} textAnchor="middle" fontSize="9.5" fill="var(--c1)">bug is now mirror-reversed!</text>}
        {fold3d ? <g>
          {mesh.map((pts, i) => <polyline key={i} points={pts} fill="none" stroke={i <= 12 ? 'var(--c3)' : 'var(--c2)'} strokeWidth={0.8} opacity={0.85} />)}
          <text x={245} y={190} textAnchor="middle" fontSize="9.5" fill="var(--muted)">{g < 1 ? 'roll: glue the double-arrow edges' : s === 'torus' ? 'bend: glue the single-arrow ends' : 'a cylinder'}</text>
        </g> : <g fontSize="10" fill="var(--fg)">
          {FACTS[s].map((f, i) => <text key={i} x={175} y={70 + 16 * i}>• {f}</text>)}
          <text x={175} y={150} fontSize="9" fill="var(--muted)">Match arrows: glue edges with</text>
          <text x={175} y={162} fontSize="9" fill="var(--muted)">the same colour so the arrows</text>
          <text x={175} y={174} fontSize="9" fill="var(--muted)">point the same way.</text>
        </g>}
      </Stage>
      <Controls>
        <PlayPause running={run} set={setRun} />
        {opts.map((o) => <Btn key={o} active={s === o} onClick={() => reset(o, ang)}>{NAMES[o]}</Btn>)}
        <Slider label="heading" min={0} max={180} step={1} value={ang} onChange={(v) => reset(s, v)} format={(v) => `${v}°`} />
      </Controls>
    </div>
  );
}
