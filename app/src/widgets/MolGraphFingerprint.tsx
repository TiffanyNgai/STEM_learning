import { useMemo, useState } from 'react';
import { Btn, Controls, Stage } from './_kit';

/**
 * One molecule, three views: skeletal structure ↔ molecular graph ↔ ECFP-style (Morgan) fingerprint bits,
 * with the SMILES string underneath. Tap an atom to highlight its SMILES token; in "bits" view the bits
 * that atom's radius-0/1/2 environments set are highlighted, and Tanimoto similarity to the other presets is shown.
 * The fingerprint is a faithful *toy* ECFP4: Morgan iterations (radius 2) hashed and folded to 64 bits.
 * props: { molecule?: 'aspirin'|'caffeine'|'ibuprofen', view?: 'structure'|'graph'|'bits', radius?: 0|1|2 (default 2), nBits?: 64|128|256 (default 128; buttons let the learner change it and watch collisions inflate Tanimoto) }
 */
type Atom = [el: string, x: number, y: number, tokenIndex: number];
interface Mol { name: string; smiles: string; atoms: Atom[]; bonds: [number, number, number][] }
const MOLS: Record<string, Mol> = {
  aspirin: {
    name: 'Aspirin', smiles: 'CC(=O)OC1=CC=CC=C1C(=O)O',
    atoms: [['C', -3.464, 1, 0], ['C', -2.598, 0.5, 1], ['O', -2.598, -0.5, 4], ['O', -1.732, 1, 6], ['C', -0.866, 0.5, 7], ['C', -0.866, -0.5, 10],
      ['C', 0, -1, 11], ['C', 0.866, -0.5, 13], ['C', 0.866, 0.5, 14], ['C', 0, 1, 16], ['C', 0, 2, 18], ['O', -0.866, 2.5, 21], ['O', 0.866, 2.5, 23]],
    bonds: [[0, 1, 1], [1, 2, 2], [1, 3, 1], [3, 4, 1], [4, 5, 2], [5, 6, 1], [6, 7, 2], [7, 8, 1], [8, 9, 2], [9, 4, 1], [9, 10, 1], [10, 11, 2], [10, 12, 1]],
  },
  caffeine: {
    name: 'Caffeine', smiles: 'CN1C=NC2=C1C(=O)N(C(=O)N2C)C',
    atoms: [['C', 2.126, 1.76, 0], ['N', 1.817, 0.809, 1], ['C', 2.405, 0, 3], ['N', 1.817, -0.809, 5], ['C', 0.866, -0.5, 6], ['C', 0.866, 0.5, 9],
      ['C', 0, 1, 11], ['O', 0, 2, 14], ['N', -0.866, 0.5, 16], ['C', -0.866, -0.5, 18], ['O', -1.732, -1, 21], ['N', 0, -1, 23], ['C', 0, -2, 25], ['C', -1.732, 1, 27]],
    bonds: [[0, 1, 1], [1, 2, 1], [2, 3, 2], [3, 4, 1], [4, 5, 2], [5, 1, 1], [5, 6, 1], [6, 7, 2], [6, 8, 1], [8, 9, 1], [9, 10, 2], [9, 11, 1], [11, 4, 1], [11, 12, 1], [8, 13, 1]],
  },
  ibuprofen: {
    name: 'Ibuprofen', smiles: 'CC(C)CC1=CC=C(C=C1)C(C)C(=O)O',
    atoms: [['C', -3.598, 0.5, 0], ['C', -2.732, 0, 1], ['C', -2.732, -1, 3], ['C', -1.866, 0.5, 5], ['C', -1, 0, 6], ['C', -0.5, 0.866, 9], ['C', 0.5, 0.866, 10],
      ['C', 1, 0, 12], ['C', 0.5, -0.866, 14], ['C', -0.5, -0.866, 16], ['C', 1.866, 0.5, 19], ['C', 1.866, 1.5, 21], ['C', 2.732, 0, 23], ['O', 3.598, 0.5, 26], ['O', 2.732, -1, 28]],
    bonds: [[0, 1, 1], [1, 2, 1], [1, 3, 1], [3, 4, 1], [4, 5, 2], [5, 6, 1], [6, 7, 2], [7, 8, 1], [8, 9, 2], [9, 4, 1], [7, 10, 1], [10, 11, 1], [10, 12, 1], [12, 13, 2], [12, 14, 1]],
  },
};
const VAL: Record<string, number> = { C: 4, N: 3, O: 2 };
const Z: Record<string, number> = { C: 6, N: 7, O: 8 };
const ELC: Record<string, string> = { C: 'var(--fg)', N: 'var(--c2)', O: 'var(--c5)' };
const hash = (xs: number[]) => xs.reduce((h, x) => Math.imul(h ^ (x >>> 0), 16777619) >>> 0, 2166136261);

/** Morgan/ECFP: per-atom identifiers at radius 0..R; returns ids[atom][r] and environment atom sets. */
function morgan(m: Mol, R: number) {
  const n = m.atoms.length;
  const nb: [number, number][][] = m.atoms.map(() => []);
  m.bonds.forEach(([a, b, o]) => { nb[a].push([b, o]); nb[b].push([a, o]); });
  const connected = (s: number, t: number, skip: number) => { // is t reachable from s without bond `skip`?
    const seen = new Set([s]); const st = [s];
    while (st.length) { const u = st.pop()!; if (u === t) return true; for (const [v] of nb[u]) {
      const bi = m.bonds.findIndex(([a, b]) => (a === u && b === v) || (a === v && b === u));
      if (bi !== skip && !seen.has(v)) { seen.add(v); st.push(v); } } }
    return false;
  };
  const inRing = m.atoms.map(() => 0);
  m.bonds.forEach(([a, b], i) => { if (connected(a, b, i)) inRing[a] = inRing[b] = 1; });
  let cur = m.atoms.map(([el], i) => {
    const order = nb[i].reduce((s, [, o]) => s + o, 0);
    return hash([Z[el], nb[i].length, VAL[el] - order, inRing[i]]); // element, degree, H count, ring
  });
  const ids = cur.map((c) => [c]);
  let env = m.atoms.map((_, i) => new Set([i]));
  const envs = env.map((e) => [e]);
  for (let r = 1; r <= R; r++) {
    const next = cur.map((c, i) => hash([r, c, ...nb[i].map(([j, o]) => hash([o, cur[j]])).sort((a, b) => a - b)]));
    env = env.map((e, i) => { const s = new Set(e); nb[i].forEach(([j]) => env[j].forEach((k) => s.add(k))); return s; });
    next.forEach((v, i) => { ids[i].push(v); envs[i].push(env[i]); });
    cur = next;
  }
  return { ids, envs, n };
}
const bitsOf = (ids: number[][], nBits: number) => new Set(ids.flat().map((v) => v % nBits));
const tanimoto = (a: Set<number>, b: Set<number>) => { let c = 0; a.forEach((x) => b.has(x) && c++); return c / (a.size + b.size - c); };

export default function MolGraphFingerprint({ molecule = 'aspirin', view = 'structure', radius = 2, nBits: nBits0 = 128 }: {
  molecule?: string; view?: 'structure' | 'graph' | 'bits'; radius?: number; nBits?: number;
}) {
  const [key, setKey] = useState(MOLS[molecule] ? molecule : 'aspirin');
  const [mode, setMode] = useState(view);
  const [sel, setSel] = useState<number | null>(null);
  const [nBits, setNBits] = useState(nBits0);
  const m = MOLS[key];
  const fps = useMemo(() => Object.fromEntries(Object.entries(MOLS).map(([k, mm]) => [k, morgan(mm, radius)])), [radius]);
  const fp = fps[key];
  const bits = bitsOf(fp.ids, nBits);
  const selBits = sel !== null ? new Set(fp.ids[sel].map((v) => v % nBits)) : new Set<number>();
  const selEnv = sel !== null ? fp.envs[sel][radius] : new Set<number>();

  const bitsMode = mode === 'bits';
  const area = bitsMode ? [6, 8, 186, 150] : [10, 8, 310, 150];
  const xs = m.atoms.map((a) => a[1]); const ys = m.atoms.map((a) => a[2]);
  const [x0, x1, y0, y1] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
  const k = Math.min((area[2] - area[0] - 24) / (x1 - x0), (area[3] - area[1] - 24) / (y1 - y0), 34);
  const px = (x: number) => (area[0] + area[2]) / 2 + (x - (x0 + x1) / 2) * k;
  const py = (y: number) => (area[1] + area[3]) / 2 - (y - (y0 + y1) / 2) * k;
  const tok = sel !== null ? m.atoms[sel][3] : -1;
  const cw = Math.min(10, 300 / m.smiles.length);
  const sx0 = 160 - (cw * m.smiles.length) / 2;

  return (
    <div>
      <Stage w={320} h={196} label={`${m.name} as ${mode}`}>
        {m.bonds.map(([a, b, o], i) => {
          const [ax, ay, bx, by] = [px(m.atoms[a][1]), py(m.atoms[a][2]), px(m.atoms[b][1]), py(m.atoms[b][2])];
          const hl = sel !== null && selEnv.has(a) && selEnv.has(b) && (bitsMode || mode === 'graph');
          const dx = by - ay, dy = ax - bx, L = Math.hypot(dx, dy) || 1, off = o === 2 && mode !== 'graph' ? 2.2 : 0;
          return (
            <g key={i} stroke={hl ? 'var(--c3)' : 'var(--fg)'} strokeWidth={hl ? 3 : 1.4}>
              <line x1={ax + (dx / L) * off} y1={ay + (dy / L) * off} x2={bx + (dx / L) * off} y2={by + (dy / L) * off} />
              {off > 0 && <line x1={ax - (dx / L) * off} y1={ay - (dy / L) * off} x2={bx - (dx / L) * off} y2={by - (dy / L) * off} />}
              {mode === 'graph' && o === 2 && <text x={(ax + bx) / 2 + 3} y={(ay + by) / 2 - 2} fontSize="8" fill="var(--muted)" stroke="none">2</text>}
            </g>
          );
        })}
        {m.atoms.map(([el, x, y], i) => {
          const showLabel = mode !== 'structure' || el !== 'C';
          const isSel = sel === i; const inEnv = selEnv.has(i);
          const r = mode === 'graph' ? 8 : bitsMode ? 6 : 7;
          return (
            <g key={i} onClick={() => setSel(isSel ? null : i)} style={{ cursor: 'pointer' }}>
              <circle cx={px(x)} cy={py(y)} r={r + 3} fill="transparent" />
              {(showLabel || isSel) && <circle cx={px(x)} cy={py(y)} r={r}
                fill={isSel ? 'var(--c3)' : mode === 'graph' ? 'var(--surface-2, var(--surface))' : 'var(--surface, transparent)'}
                stroke={isSel || (inEnv && bitsMode) ? 'var(--c3)' : mode === 'graph' ? ELC[el] : 'none'} strokeWidth={1.5} />}
              {showLabel && <text x={px(x)} y={py(y) + 3.5} textAnchor="middle" fontSize={mode === 'graph' ? 9 : 10} fontWeight={700} fill={ELC[el]}>
                {mode === 'graph' ? `${el}${i}` : el}</text>}
            </g>
          );
        })}
        {bitsMode && Array.from({ length: nBits }, (_, b) => {
          const cols = nBits <= 64 ? 8 : 16, cell = 120 / cols; const gx = 196 + (b % cols) * cell, gy = 12 + Math.floor(b / cols) * cell;
          return <rect key={b} x={gx} y={gy} width={cell - 1.5} height={cell - 1.5} rx={1.5}
            fill={selBits.has(b) ? 'var(--c3)' : bits.has(b) ? 'var(--c2)' : 'var(--grid)'} opacity={bits.has(b) || selBits.has(b) ? 1 : 0.5} />;
        })}
        {bitsMode && <text x={256} y={140} textAnchor="middle" fontSize="8.5" fill="var(--muted)">{bits.size}/{nBits} bits on</text>}
        {m.smiles.split('').map((ch, i) => (
          <g key={i}>
            {i === tok && <rect x={sx0 + i * cw - 0.5} y={160} width={cw + 1} height={16} rx={3} fill="var(--c3)" opacity={0.35} />}
            <text x={sx0 + i * cw + cw / 2} y={172} textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize={Math.min(13, cw * 1.35)}
              fontWeight={i === tok ? 800 : 500} fill={ELC[ch] ?? 'var(--muted)'}>{ch}</text>
          </g>
        ))}
        <text x={160} y={190} textAnchor="middle" fontSize="8.5" fill="var(--muted)">
          {sel === null ? 'Tap an atom' : `atom ${sel} (${m.atoms[sel][0]}) ↔ SMILES character ${m.atoms[sel][3] + 1}`}
          {bitsMode && sel !== null ? ` · sets ${selBits.size} bit${selBits.size > 1 ? 's' : ''} (r = 0…${radius})` : ''}
        </text>
      </Stage>
      {bitsMode && (
        <div className="w-muted">
          Tanimoto({m.name}, ·): {Object.keys(MOLS).filter((o) => o !== key).map((o) =>
            `${MOLS[o].name} ${tanimoto(bits, bitsOf(fps[o].ids, nBits)).toFixed(2)}`).join(' · ')}
          <div>Bits: {[64, 128, 256].map((b) => <Btn key={b} active={b === nBits} onClick={() => setNBits(b)}>{b}</Btn>)}</div>
        </div>
      )}
      <Controls>
        {Object.keys(MOLS).map((k2) => <Btn key={k2} active={k2 === key} onClick={() => { setKey(k2); setSel(null); }}>{MOLS[k2].name}</Btn>)}
      </Controls>
      <Controls>
        {(['structure', 'graph', 'bits'] as const).map((v) => <Btn key={v} active={mode === v} onClick={() => setMode(v)}>{v === 'bits' ? 'Fingerprint' : v[0].toUpperCase() + v.slice(1)}</Btn>)}
      </Controls>
    </div>
  );
}
