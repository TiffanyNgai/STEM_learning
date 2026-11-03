import { useState } from 'react';
import { Btn, Controls, Stage } from './_kit';
import { DRUG_MOLS, ELC, fitBox, hCounts } from './_drugMols';

/**
 * Substructure search, as RDKit's mol.GetSubstructMatches(Chem.MolFromSmarts(...)) would report it.
 * Pick a SMARTS query and a molecule: every match is highlighted (one colour per match) and the
 * tuple of matched atom indices is printed. The matches are precomputed for these three molecules.
 * Note the benzene query c1ccccc1 matches even though the SMILES is written in Kekulé form: sanitisation
 * perceives aromaticity first.
 * props: { molecule?: 'aspirin'|'ibuprofen'|'paracetamol' (default 'aspirin'), query?: number (index into the query list, default 0) }
 */
const QUERIES: { name: string; smarts: string; hits: Record<string, number[][]> }[] = [
  { name: 'Carboxylic acid', smarts: 'C(=O)[OH]', hits: { aspirin: [[10, 11, 12]], ibuprofen: [[12, 13, 14]], paracetamol: [] } },
  { name: 'Ester', smarts: 'C(=O)O[#6]', hits: { aspirin: [[1, 2, 3, 4]], ibuprofen: [], paracetamol: [] } },
  { name: 'Amide', smarts: 'C(=O)N', hits: { aspirin: [], ibuprofen: [], paracetamol: [[1, 2, 3]] } },
  { name: 'Phenol', smarts: 'c[OH]', hits: { aspirin: [], ibuprofen: [], paracetamol: [[7, 8]] } },
  { name: 'Benzene ring', smarts: 'c1ccccc1', hits: { aspirin: [[4, 5, 6, 7, 8, 9]], ibuprofen: [[4, 5, 6, 7, 8, 9]], paracetamol: [[4, 5, 6, 7, 9, 10]] } },
  { name: 'Any C=O', smarts: '[CX3]=O', hits: { aspirin: [[1, 2], [10, 11]], ibuprofen: [[12, 13]], paracetamol: [[1, 2]] } },
];
const HL = ['var(--c3)', 'var(--c4)'];

export default function DrugSubstructureMatch({ molecule = 'aspirin', query = 0 }: { molecule?: string; query?: number }) {
  const [key, setKey] = useState(DRUG_MOLS[molecule] ? molecule : 'aspirin');
  const [q, setQ] = useState(Math.max(0, Math.min(QUERIES.length - 1, Math.round(query))));
  const m = DRUG_MOLS[key];
  const H = hCounts(m);
  const hits = QUERIES[q].hits[key];
  const colourOf = (i: number) => { const k = hits.findIndex((h) => h.includes(i)); return k < 0 ? null : HL[k % HL.length]; };
  const { px, py } = fitBox(m, [6, 26, 314, 156], 32);
  const res = '(' + hits.map((h) => '(' + h.join(', ') + ')').join(', ') + (hits.length === 1 ? ',' : '') + ')';
  return (
    <div>
      <Stage w={320} h={186} label={`Substructure search for ${QUERIES[q].name} in ${m.name}`}>
        <text x={160} y={14} textAnchor="middle" fontSize="10" fontFamily="ui-monospace, monospace" fill="var(--fg)">
          query = Chem.MolFromSmarts('{QUERIES[q].smarts}')
        </text>
        {m.bonds.map(([a, b, o], i) => {
          const [ax, ay, bx, by] = [px(m.atoms[a][1]), py(m.atoms[a][2]), px(m.atoms[b][1]), py(m.atoms[b][2])];
          const ca = colourOf(a), cb = colourOf(b);
          const hl = ca && ca === cb && hits.some((h) => h.includes(a) && h.includes(b));
          const dx = by - ay, dy = ax - bx, L = Math.hypot(dx, dy) || 1, off = o === 2 ? 2.2 : 0;
          return (
            <g key={i}>
              {hl && <line x1={ax} y1={ay} x2={bx} y2={by} stroke={ca!} strokeWidth={9} strokeLinecap="round" opacity={0.45} />}
              <g stroke="var(--fg)" strokeWidth={1.4}>
                <line x1={ax + (dx / L) * off} y1={ay + (dy / L) * off} x2={bx + (dx / L) * off} y2={by + (dy / L) * off} />
                {off > 0 && <line x1={ax - (dx / L) * off} y1={ay - (dy / L) * off} x2={bx - (dx / L) * off} y2={by - (dy / L) * off} />}
              </g>
            </g>
          );
        })}
        {m.atoms.map(([el, x, y], i) => {
          const c = colourOf(i);
          const lab = el === 'C' ? '' : el + (H[i] ? 'H' : '');
          return (
            <g key={i}>
              {c && <circle cx={px(x)} cy={py(y)} r={8} fill={c} opacity={0.55} />}
              {lab && !c && <circle cx={px(x)} cy={py(y)} r={7.5} fill="var(--surface, transparent)" />}
              {lab && <text x={px(x)} y={py(y) + 3.5} textAnchor="middle" fontSize={10} fontWeight={700} fill={ELC[el]}>{lab}</text>}
              <text x={px(x) + 6} y={py(y) + 11} fontSize={7} fill="var(--muted)">{i}</text>
            </g>
          );
        })}
        <text x={160} y={180} textAnchor="middle" fontSize="9" fontFamily="ui-monospace, monospace" fill={hits.length ? 'var(--fg)' : 'var(--muted)'}>
          GetSubstructMatches → {res}
        </text>
      </Stage>
      <Controls>
        {Object.keys(DRUG_MOLS).map((k) => <Btn key={k} active={k === key} onClick={() => setKey(k)}>{DRUG_MOLS[k].name}</Btn>)}
      </Controls>
      <Controls>
        {QUERIES.map((qq, i) => <Btn key={qq.name} active={i === q} onClick={() => setQ(i)}>{qq.name}</Btn>)}
      </Controls>
    </div>
  );
}
