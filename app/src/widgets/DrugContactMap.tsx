import { useMemo, useState } from 'react';
import { Btn, Controls, PlayPause, Slider, Stage, prefersReducedMotion, useFrame } from './_kit';

/**
 * A protein as a Cα trace and as a residue contact map. Toy 3D model (42 residues): helix 1, loop, helix 2
 * packed antiparallel against it, loop, and a two-stranded antiparallel β-hairpin. Left: the Cα trace,
 * slowly rotating (helix blue, strand orange, loop grey). Right: the contact map, a cell (i, j) is filled when
 * the Cα–Cα distance is below the cut-off. Helices give a thick band next to the diagonal (i, i+3 / i+4 contacts);
 * antiparallel packing gives stripes perpendicular to the diagonal. Tap a cell to highlight the residue pair.
 * props: { cutoff?: number (Å, default 8), rotate?: boolean (default true) }
 */
type V3 = [number, number, number];
const SS: ('H' | 'E' | 'L')[] = [];
function buildTrace(): V3[] {
  const P: V3[] = [];
  const push = (p: V3, s: 'H' | 'E' | 'L') => { P.push(p); SS.push(s); };
  const rad = (100 * Math.PI) / 180;
  for (let i = 0; i < 12; i++) push([-5 + 2.3 * Math.cos(rad * i), 2.3 * Math.sin(rad * i), 1.5 * i], 'H');
  const loop = (a: V3, b: V3, n: number) => { for (let k = 1; k <= n; k++) { const u = k / (n + 1); push([a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u + 2 * Math.sin(Math.PI * u), a[2] + (b[2] - a[2]) * u + 2.5 * Math.sin(Math.PI * u)], 'L'); } };
  const h2 = Array.from({ length: 12 }, (_, i): V3 => [5 + 2.3 * Math.cos(rad * i + 3), 2.3 * Math.sin(rad * i + 3), 16.5 - 1.5 * i]);
  loop(P[P.length - 1], h2[0], 2);
  h2.forEach((p) => push(p, 'H'));
  const s1 = Array.from({ length: 6 }, (_, i): V3 => [-2.4, 8 + (i % 2 ? 0.9 : -0.9), 1 + 3.3 * i]);
  const s2 = Array.from({ length: 6 }, (_, i): V3 => [2.4, 8 + (i % 2 ? -0.9 : 0.9), 1 + 3.3 * (5 - i)]);
  loop(P[P.length - 1], s1[0], 2);
  s1.forEach((p) => push(p, 'E'));
  loop(s1[5], s2[0], 2);
  s2.forEach((p) => push(p, 'E'));
  return P;
}
const TRACE = buildTrace();
const N = TRACE.length;
const dist = (a: V3, b: V3) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
const COL = { H: 'var(--c2)', E: 'var(--c3)', L: 'var(--muted)' };

export default function DrugContactMap({ cutoff = 8, rotate = true }: { cutoff?: number; rotate?: boolean }) {
  const [cut, setCut] = useState(cutoff);
  const [sel, setSel] = useState<[number, number] | null>(null);
  const [running, setRunning] = useState(rotate && !prefersReducedMotion());
  const [th, setTh] = useState(0.6);
  useFrame((dt) => setTh((v) => v + dt * 0.5), running);
  const D = useMemo(() => TRACE.map((a) => TRACE.map((b) => dist(a, b))), []);
  const nContacts = useMemo(() => { let c = 0; for (let i = 0; i < N; i++) for (let j = i + 3; j < N; j++) if (D[i][j] < cut) c++; return c; }, [D, cut]);
  const cx = Math.cos(th), sx = Math.sin(th);
  const proj = TRACE.map(([x, y, z]) => [74 + (x * cx - y * sx) * 4.2, 168 - z * 4.6 - 4] as [number, number]);
  const cell = 150 / N, M0 = 162, T0 = 14;
  const hl = (i: number) => sel !== null && (sel[0] === i || sel[1] === i);
  return (
    <div>
      <Stage w={320} h={196} label="Protein Cα trace and contact map">
        {proj.slice(1).map((p, i) => (
          <line key={i} x1={proj[i][0]} y1={proj[i][1]} x2={p[0]} y2={p[1]} stroke={COL[SS[i + 1]]} strokeWidth={2.2} strokeLinecap="round" />
        ))}
        {sel && <line x1={proj[sel[0]][0]} y1={proj[sel[0]][1]} x2={proj[sel[1]][0]} y2={proj[sel[1]][1]} stroke="var(--c5)" strokeWidth={1.2} strokeDasharray="3 2" />}
        {proj.map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r={hl(i) ? 4.5 : 2.2} fill={hl(i) ? 'var(--c5)' : COL[SS[i]]} />)}
        <text x={74} y={192} textAnchor="middle" fontSize="8.5" fill="var(--muted)">Cα trace (N = {N} residues)</text>
        <rect x={M0} y={T0} width={150} height={150} fill="none" stroke="var(--grid)" />
        {D.map((row, i) => row.map((d, j) => (d < cut ? (
          <rect key={i * N + j} x={M0 + j * cell} y={T0 + i * cell} width={cell} height={cell}
            fill={sel && sel[0] === i && sel[1] === j ? 'var(--c5)' : i === j ? 'var(--muted)' : 'var(--fg)'} opacity={i === j ? 0.4 : 0.8} />
        ) : null)))}
        {SS.map((s, i) => <rect key={'s' + i} x={M0 + i * cell} y={T0 - 5} width={cell} height={3} fill={COL[s]} />)}
        <rect x={M0} y={T0} width={150} height={150} fill="transparent" style={{ cursor: 'pointer' }}
          onClick={(e) => {
            const r = (e.currentTarget as SVGRectElement).getBoundingClientRect();
            const j = Math.floor(((e.clientX - r.left) / r.width) * N), i = Math.floor(((e.clientY - r.top) / r.height) * N);
            if (i >= 0 && j >= 0 && i < N && j < N && i !== j) setSel([i, j]);
          }} />
        <text x={M0 + 75} y={180} textAnchor="middle" fontSize="8.5" fill="var(--muted)">
          {sel ? `residues ${sel[0] + 1} & ${sel[1] + 1}: ${D[sel[0]][sel[1]].toFixed(1)} Å ${D[sel[0]][sel[1]] < cut ? '(contact)' : '(no contact)'}` : 'Tap a cell of the map'}
        </text>
        <text x={M0 + 75} y={192} textAnchor="middle" fontSize="8.5" fill="var(--muted)">{nContacts} contacts with |i − j| ≥ 3</text>
      </Stage>
      <Controls>
        <Slider label="Cut-off (Å)" value={cut} min={4} max={14} step={0.5} onChange={setCut} />
        <PlayPause running={running} set={setRunning} />
        <Btn onClick={() => setSel(null)}>Clear</Btn>
      </Controls>
    </div>
  );
}
