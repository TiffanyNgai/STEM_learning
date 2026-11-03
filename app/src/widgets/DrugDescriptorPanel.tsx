import { useState } from 'react';
import { Btn, Controls, Stage } from './_kit';
import { DRUG_MOLS, ELC, descriptors, fitBox, hCounts, topoDist } from './_drugMols';

/**
 * Molecular descriptors computed from a molecular graph. Polar atoms are shaded with a disc whose area is
 * proportional to their Ertl TPSA contribution; tap any atom to see its implicit H count, its TPSA contribution
 * and its row of the topological distance matrix (bond counts to every other atom, which sum into the Wiener index).
 * Below: MW, Crippen logP (with an approximate measured value), TPSA, HBD, HBA and the Wiener index, with bars
 * against Lipinski / Veber cut-offs.
 * props: { molecule?: 'aspirin'|'ibuprofen'|'paracetamol' (default 'aspirin'), showDistances?: boolean (default true) }
 */
export default function DrugDescriptorPanel({ molecule = 'aspirin', showDistances = true }: { molecule?: string; showDistances?: boolean }) {
  const [key, setKey] = useState(DRUG_MOLS[molecule] ? molecule : 'aspirin');
  const [sel, setSel] = useState<number | null>(null);
  const m = DRUG_MOLS[key];
  const d = descriptors(m);
  const H = hCounts(m);
  const D = topoDist(m);
  const { px, py } = fitBox(m, [6, 6, 314, 132], 32);
  const bars: [string, number, number, string][] = [
    ['MW', d.mw, 500, d.mw.toFixed(1) + ' Da'],
    ['logP (Crippen)', d.logP, 5, `${d.logP.toFixed(2)} (exp. ≈ ${d.logPexp})`],
    ['TPSA', d.tpsa, 140, d.tpsa.toFixed(2) + ' Å²'],
    ['H-bond donors', d.hbd, 5, String(d.hbd)],
    ['H-bond acceptors', d.hba, 10, String(d.hba)],
  ];
  const info = sel === null ? 'Tap an atom'
    : `atom ${sel}: ${m.atoms[sel][0]}${H[sel] ? 'H' + (H[sel] > 1 ? H[sel] : '') : ''}` +
      (m.tpsa[sel] ? ` · ${m.tpsa[sel][1]}: +${m.tpsa[sel][0]} Å²` : ' · no TPSA contribution') +
      (showDistances ? ` · distances sum to ${D[sel].reduce((s, x) => s + x, 0)}` : '');
  return (
    <div>
      <Stage w={320} h={150} label={`${m.name} with polar surface contributions`}>
        {Object.entries(m.tpsa).map(([i, [v]]) => {
          const [, x, y] = m.atoms[+i];
          return <circle key={'p' + i} cx={px(x)} cy={py(y)} r={Math.sqrt(v) * 2.6} fill="var(--c2)" opacity={0.22} />;
        })}
        {m.bonds.map(([a, b, o], i) => {
          const [ax, ay, bx, by] = [px(m.atoms[a][1]), py(m.atoms[a][2]), px(m.atoms[b][1]), py(m.atoms[b][2])];
          const dx = by - ay, dy = ax - bx, L = Math.hypot(dx, dy) || 1, off = o === 2 ? 2.2 : 0;
          return (
            <g key={i} stroke="var(--fg)" strokeWidth={1.4}>
              <line x1={ax + (dx / L) * off} y1={ay + (dy / L) * off} x2={bx + (dx / L) * off} y2={by + (dy / L) * off} />
              {off > 0 && <line x1={ax - (dx / L) * off} y1={ay - (dy / L) * off} x2={bx - (dx / L) * off} y2={by - (dy / L) * off} />}
            </g>
          );
        })}
        {m.atoms.map(([el, x, y], i) => {
          const isSel = sel === i;
          const lab = el === 'C' ? '' : el + (H[i] ? 'H' : '');
          return (
            <g key={i} onClick={() => setSel(isSel ? null : i)} style={{ cursor: 'pointer' }}>
              <circle cx={px(x)} cy={py(y)} r={11} fill="transparent" />
              {(lab || isSel) && <circle cx={px(x)} cy={py(y)} r={7.5} fill={isSel ? 'var(--c3)' : 'var(--surface, transparent)'} />}
              {lab && <text x={px(x)} y={py(y) + 3.5} textAnchor="middle" fontSize={10} fontWeight={700} fill={isSel ? 'var(--fg)' : ELC[el]}>{lab}</text>}
              {showDistances && sel !== null && !isSel && (
                <text x={px(x) + 7} y={py(y) - 6} fontSize={8} fill="var(--c3)" fontWeight={700}>{D[sel][i]}</text>
              )}
            </g>
          );
        })}
        <text x={160} y={146} textAnchor="middle" fontSize="8.5" fill="var(--muted)">{info}</text>
      </Stage>
      <div className="w-muted" style={{ fontSize: '0.82em' }}>
        {m.name} · {d.formula} · {d.heavy} heavy atoms · Wiener index {d.wiener}
        {bars.map(([lab, v, lim, txt]) => (
          <div key={lab} style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 3 }}>
            <span style={{ width: '7.5em', flexShrink: 0 }}>{lab}</span>
            <span style={{ flex: 1, height: 8, background: 'var(--grid)', borderRadius: 4, position: 'relative', overflow: 'hidden' }}>
              <span style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${Math.min(100, (Math.max(0, v) / lim) * 100)}%`, background: v > lim ? 'var(--c5)' : 'var(--c1)', borderRadius: 4 }} />
            </span>
            <span style={{ width: '9.5em', flexShrink: 0, textAlign: 'right', color: 'var(--fg)' }}>{txt}</span>
          </div>
        ))}
        <div style={{ marginTop: 3 }}>Bar ends: MW 500, logP 5, HBD 5, HBA 10 (Lipinski); TPSA 140 Å² (Veber).</div>
      </div>
      <Controls>
        {Object.keys(DRUG_MOLS).map((k) => <Btn key={k} active={k === key} onClick={() => { setKey(k); setSel(null); }}>{DRUG_MOLS[k].name}</Btn>)}
      </Controls>
    </div>
  );
}
