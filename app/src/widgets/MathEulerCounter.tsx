import { useMemo, useState } from 'react';
import { Btn, Controls, PlayPause, Stage, prefersReducedMotion, useFrame } from './_kit';

/**
 * V − E + F counter on a rotating polyhedron or a triangulated/gridded torus. Buttons modify the cell
 * structure: "split an edge" (V+1, E+1), "cut a face" with a diagonal (E+1, F+1), "cone a face" from a new
 * centre point (V+1, E+k, F+k−1). The counts change but V − E + F never does: it is the Euler
 * characteristic χ, a topological invariant (2 for the sphere-like solids, 0 for the torus).
 * props: { shape?: 'tetra' | 'cube' | 'octa' | 'dodeca' | 'icosa' | 'prism' | 'torus' (default 'cube'),
 *          choices?: string[] (shapes offered as buttons, default all), animate?: boolean (default true) }
 */
type V3 = [number, number, number];
type Mesh = { v: V3[]; f: number[][] };
type Shape = 'tetra' | 'cube' | 'octa' | 'dodeca' | 'icosa' | 'prism' | 'torus';
const LABEL: Record<Shape, string> = { tetra: 'tetrahedron', cube: 'cube', octa: 'octahedron', dodeca: 'dodecahedron', icosa: 'icosahedron', prism: 'prism', torus: 'torus' };
const sub = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const len = (a: V3) => Math.hypot(...a);
const cen = (ps: V3[]): V3 => ps.reduce<V3>((s, p) => [s[0] + p[0] / ps.length, s[1] + p[1] / ps.length, s[2] + p[2] / ps.length], [0, 0, 0]);
/** All triples of vertices at mutual distance d (faces of a deltahedron). */
const triFaces = (v: V3[], d: number) => {
  const f: number[][] = [];
  for (let i = 0; i < v.length; i++) for (let j = i + 1; j < v.length; j++) for (let k = j + 1; k < v.length; k++)
    if ([[i, j], [j, k], [i, k]].every(([a, b]) => Math.abs(len(sub(v[a], v[b])) - d) < 1e-6)) f.push([i, j, k]);
  return f;
};
function build(s: Shape): Mesh {
  const g = (1 + Math.sqrt(5)) / 2;
  if (s === 'tetra') { const v: V3[] = [[1, 1, 1], [1, -1, -1], [-1, 1, -1], [-1, -1, 1]]; return { v, f: triFaces(v, Math.sqrt(8)) }; }
  if (s === 'octa') { const v: V3[] = [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]]; return { v, f: triFaces(v, Math.SQRT2) }; }
  if (s === 'cube') {
    const v: V3[] = [[-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1], [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]];
    return { v, f: [[0, 1, 2, 3], [4, 5, 6, 7], [0, 1, 5, 4], [1, 2, 6, 5], [2, 3, 7, 6], [3, 0, 4, 7]] };
  }
  if (s === 'prism') {
    const v: V3[] = [0, 1, 2].flatMap((i) => [[Math.cos(2 * Math.PI * i / 3), Math.sin(2 * Math.PI * i / 3), -0.8], [Math.cos(2 * Math.PI * i / 3), Math.sin(2 * Math.PI * i / 3), 0.8]] as V3[]);
    return { v, f: [[0, 2, 4], [1, 3, 5], [0, 2, 3, 1], [2, 4, 5, 3], [4, 0, 1, 5]] };
  }
  const iv: V3[] = [];
  for (const a of [-1, 1]) for (const b of [-g, g]) iv.push([0, a, b], [a, b, 0], [b, 0, a]);
  const icosa = { v: iv.map((p) => p.map((c) => c * 0.62) as V3), f: triFaces(iv, 2).map((x) => x) };
  if (s === 'icosa') return icosa;
  if (s === 'dodeca') { // dual: vertices = face centres, faces = the 5 faces round each icosahedron vertex, sorted by angle
    const v = icosa.f.map((f) => { const c = cen(f.map((i) => iv[i])); const r = len(c); return c.map((x) => (x / r) * 1.1) as V3; });
    const f = iv.map((p, vi) => {
      const ids = icosa.f.map((ff, i) => [ff, i] as const).filter(([ff]) => ff.includes(vi)).map(([, i]) => i);
      const n = p.map((x) => x / len(p)) as V3; const ref: V3 = Math.abs(n[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0];
      const e1 = sub(ref, n.map((x) => x * (ref[0] * n[0] + ref[1] * n[1] + ref[2] * n[2])) as V3);
      const e2: V3 = [n[1] * e1[2] - n[2] * e1[1], n[2] * e1[0] - n[0] * e1[2], n[0] * e1[1] - n[1] * e1[0]];
      const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
      return ids.sort((a, b) => Math.atan2(dot(v[a], e2), dot(v[a], e1)) - Math.atan2(dot(v[b], e2), dot(v[b], e1)));
    });
    return { v, f };
  }
  // torus: 8 × 4 grid of quadrilaterals
  const m = 8, n = 4, v: V3[] = [], f: number[][] = [];
  for (let i = 0; i < m; i++) for (let j = 0; j < n; j++) { const a = 2 * Math.PI * i / m, b = 2 * Math.PI * j / n + Math.PI / 4; v.push([(1.15 + 0.5 * Math.cos(b)) * Math.cos(a), (1.15 + 0.5 * Math.cos(b)) * Math.sin(a), 0.5 * Math.sin(b)]); }
  const id = (i: number, j: number) => ((i + m) % m) * n + ((j + n) % n);
  for (let i = 0; i < m; i++) for (let j = 0; j < n; j++) f.push([id(i, j), id(i + 1, j), id(i + 1, j + 1), id(i, j + 1)]);
  return { v, f };
}
const edgesOf = (f: number[][]) => {
  const e = new Map<string, [number, number]>();
  f.forEach((c) => c.forEach((a, i) => { const b = c[(i + 1) % c.length]; e.set(a < b ? `${a}-${b}` : `${b}-${a}`, [a, b]); }));
  return [...e.values()];
};

export default function MathEulerCounter({ shape = 'cube', choices, animate = true }: { shape?: Shape; choices?: Shape[]; animate?: boolean }) {
  const [sh, setSh] = useState<Shape>(shape);
  const [mesh, setMesh] = useState<Mesh>(() => build(shape));
  const [rot, setRot] = useState(0.5);
  const [run, setRun] = useState(animate && !prefersReducedMotion());
  const [msg, setMsg] = useState('');
  const [seed, setSeed] = useState(1);
  useFrame((dt) => setRot((r) => r + dt * 0.4), run);
  const E = useMemo(() => edgesOf(mesh.f), [mesh]);
  const V = mesh.v.length, F = mesh.f.length;
  const pick = (k: number) => { setSeed((x) => x + 1); return (seed * 7919 + 13) % k; };
  const splitEdge = () => {
    const [a, b] = E[pick(E.length)]; const nv = mesh.v.length;
    const v = [...mesh.v, cen([mesh.v[a], mesh.v[b]])];
    const f = mesh.f.map((c) => { const out: number[] = []; c.forEach((x, i) => { out.push(x); const y = c[(i + 1) % c.length]; if ((x === a && y === b) || (x === b && y === a)) out.push(nv); }); return out; });
    setMesh({ v, f }); setMsg('split an edge: V+1, E+1');
  };
  const cutFace = () => {
    // A diagonal must join two non-adjacent corners AND must not already be an edge somewhere else,
    // otherwise E would not actually go up by 1 and χ would appear to change.
    const key = (a: number, b: number) => (a < b ? `${a}-${b}` : `${b}-${a}`);
    const have = new Set(E.map(([a, b]) => key(a, b)));
    const cand: [number, number, number][] = [];
    mesh.f.forEach((c, i) => {
      for (let p = 0; p < c.length; p++) for (let q = p + 2; q <= c.length - 2 + (p > 0 ? 1 : 0) && q < c.length; q++)
        if (!have.has(key(c[p], c[q]))) cand.push([i, p, q]);
    });
    if (!cand.length) { setMsg(mesh.f.every((c) => c.length < 4) ? 'all faces are triangles: try “cone a face”' : 'no new diagonal left: try “cone a face”'); return; }
    const [i, p, q] = cand[pick(cand.length)];
    const c = mesh.f[i]; const r = [...c.slice(p), ...c.slice(0, p)]; const h = q - p;
    const f = mesh.f.filter((_, j) => j !== i).concat([r.slice(0, h + 1), [...r.slice(h), r[0]]]);
    setMesh({ v: mesh.v, f }); setMsg('cut a face with a diagonal: E+1, F+1');
  };
  const cone = () => {
    const i = pick(mesh.f.length); const c = mesh.f[i]; const nv = mesh.v.length;
    const v = [...mesh.v, cen(c.map((x) => mesh.v[x]))];
    const f = mesh.f.filter((_, j) => j !== i).concat(c.map((x, k) => [x, c[(k + 1) % c.length], nv]));
    setMesh({ v, f }); setMsg(`cone a ${c.length}-gon: V+1, E+${c.length}, F+${c.length - 1}`);
  };
  const choose = (s: Shape) => { setSh(s); setMesh(build(s)); setMsg(''); };
  // projection
  const cr = Math.cos(rot), sr = Math.sin(rot), ct = Math.cos(1.0), st = Math.sin(1.0);
  const proj = mesh.v.map(([x, y, z]) => { const x1 = cr * x - sr * y, y1 = sr * x + cr * y; return [x1, ct * z - st * y1, -(st * z + ct * y1)] as V3; }); // 3rd coordinate = depth towards the viewer
  const cx = 100, cy = 100, sc = sh === 'torus' ? 50 : 52;
  const P = (i: number) => `${(cx + sc * proj[i][0]).toFixed(1)},${(cy - sc * proj[i][1]).toFixed(1)}`;
  const order = mesh.f.map((c, i) => [i, cen(c.map((x) => proj[x]))[2]] as const).sort((a, b) => a[1] - b[1]);
  const opts = choices ?? (['tetra', 'cube', 'octa', 'dodeca', 'icosa', 'prism', 'torus'] as Shape[]);
  return (
    <div>
      <Stage w={320} h={200} label={`${LABEL[sh]} with V − E + F = ${V - E.length + F}`}>
        {order.map(([i, d]) => <polygon key={i} points={mesh.f[i].map(P).join(' ')} fill="var(--c2)" fillOpacity={0.1 + 0.12 * (d > 0 ? 1 : 0)}
          stroke="var(--c2)" strokeOpacity={d > 0 ? 0.95 : 0.35} strokeWidth={d > 0 ? 1.3 : 0.8} strokeLinejoin="round" />)}
        {proj.map((p, i) => <circle key={i} cx={cx + sc * p[0]} cy={cy - sc * p[1]} r={p[2] > 0 ? 2.4 : 1.6} fill="var(--c3)" opacity={p[2] > 0 ? 1 : 0.45} />)}
        <g fontSize="12" fill="var(--fg)">
          <text x={205} y={26} fontWeight="bold" fontSize="11">{LABEL[sh]}</text>
          <text x={205} y={52} style={{ fill: 'var(--c3)' }}>V = {V}</text>
          <text x={205} y={72} style={{ fill: 'var(--c2)' }}>E = {E.length}</text>
          <text x={205} y={92}>F = {F}</text>
          <line x1={205} x2={305} y1={100} y2={100} stroke="var(--muted)" />
          <text x={205} y={120} fontWeight="bold" style={{ fill: 'var(--c1)' }}>V − E + F = {V - E.length + F}</text>
          <text x={205} y={146} fontSize="9" style={{ fill: 'var(--muted)' }}>{msg.length > 26 ? msg.split(': ')[0] + ':' : msg}</text>
          <text x={205} y={158} fontSize="9" style={{ fill: 'var(--muted)' }}>{msg.length > 26 ? msg.split(': ')[1] : ''}</text>
        </g>
      </Stage>
      <Controls>
        <PlayPause running={run} set={setRun} />
        {opts.map((o) => <Btn key={o} active={sh === o} onClick={() => choose(o)}>{LABEL[o]}</Btn>)}
        <Btn onClick={splitEdge}>split an edge</Btn>
        <Btn onClick={cutFace}>cut a face</Btn>
        <Btn onClick={cone}>cone a face</Btn>
        <Btn onClick={() => choose(sh)}>reset</Btn>
      </Controls>
    </div>
  );
}
