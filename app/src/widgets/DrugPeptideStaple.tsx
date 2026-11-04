import { useState } from 'react';
import { Btn, C, Controls, Slider, Stage, pathOf } from './_kit';

/**
 * Three ways to rescue a 12-residue peptide, and what each buys you.
 *  - 'linear'  : a floppy chain. Little helix, chewed up by proteases, many free backbone NH donors.
 *  - 'stapled' : an all-hydrocarbon cross-link between positions i and i+4 (one helical turn), made by
 *                ring-closing metathesis of two α-methyl, α-alkenyl residues (Schafmeister et al. 2000).
 *                Pre-organising the helix raises helicity and protease resistance.
 *  - 'cyclic'  : head-to-tail macrocycle — no free termini for exopeptidases, and a conformation that
 *                can bury its own polar groups.
 * The N-methyl slider caps backbone NH groups, the trick cyclosporin A uses: each N-methylation removes
 * one hydrogen-bond donor, the property that correlates best with passive membrane permeability in
 * macrocycles. Bars show helicity, serum half-life, donor count and a permeability score.
 * The numbers are illustrative trends for teaching, NOT measurements of any particular peptide.
 * props: { form?: 'linear'|'stapled'|'cyclic' (default 'linear'), nMethyl?: number (0–5, default 0) }
 */
const NRES = 12;

function layout(form: string): [number, number][] {
  const p: [number, number][] = [];
  if (form === 'cyclic') {
    for (let k = 0; k < NRES; k++) {
      const a = (2 * Math.PI * k) / NRES - Math.PI / 2;
      p.push([160 + 44 * Math.cos(a), 72 + 40 * Math.sin(a)]);
    }
  } else if (form === 'stapled') {
    for (let k = 0; k < NRES; k++) p.push([44 + k * 21, 72 + 17 * Math.sin((k * 2 * Math.PI) / 3.6)]);
  } else {
    for (let k = 0; k < NRES; k++) p.push([44 + k * 21, 72 + 26 * Math.sin(k * 1.9) * Math.cos(k * 0.7)]);
  }
  return p;
}

export default function DrugPeptideStaple({ form = 'linear', nMethyl = 0 }: { form?: 'linear' | 'stapled' | 'cyclic'; nMethyl?: number }) {
  const [f, setF] = useState(form);
  const [nm, setNm] = useState(Math.max(0, Math.min(5, nMethyl)));

  const pts = layout(f);
  const helicity = f === 'stapled' ? 85 : f === 'cyclic' ? 45 : 14;
  const halfLife = f === 'stapled' ? 180 : f === 'cyclic' ? 600 : 10;
  const donors = Math.max(0, (f === 'cyclic' ? 11 : 12) - nm);
  const perm = -7.3 + 0.26 * nm + (f === 'cyclic' ? 0.9 : f === 'stapled' ? 0.45 : 0);

  const bars: [string, number, number, string][] = [
    ['helicity', helicity, 100, `${helicity}%`],
    ['serum t½', Math.log10(halfLife) / Math.log10(600), 1, `${halfLife} min`],
    ['H-bond donors', donors, 12, `${donors}`],
    ['permeability', (perm + 7.5) / 1.8, 1, `log Papp ≈ ${perm.toFixed(1)}`],
  ];

  return (
    <div>
      <Stage w={320} h={236} label={`${f} peptide with ${nm} N-methyl groups`}>
        <path d={pathOf(f === 'cyclic' ? [...pts, pts[0]] : pts)} fill="none" stroke="var(--muted)" strokeWidth={2} strokeLinejoin="round" />
        {f === 'stapled' && (
          <g>
            <path d={`M${pts[3][0]},${pts[3][1] - 8} C${pts[3][0] + 10},${pts[3][1] - 34} ${pts[7][0] - 10},${pts[7][1] - 34} ${pts[7][0]},${pts[7][1] - 8}`}
              fill="none" stroke={C[2]} strokeWidth={3} />
            <text x={(pts[3][0] + pts[7][0]) / 2} y={pts[3][1] - 38} fontSize="7.5" textAnchor="middle" fill={C[2]}>
              i → i+4 hydrocarbon staple
            </text>
          </g>
        )}
        {pts.map((q, i) => (
          <g key={i}>
            <circle cx={q[0]} cy={q[1]} r={5} fill={i < nm ? C[3] : C[1]} fillOpacity={0.75} stroke="var(--surface)" />
            {i < nm && <text x={q[0]} y={q[1] + 2.5} fontSize="6" textAnchor="middle" fill="var(--fg)">Me</text>}
          </g>
        ))}
        <text x={160} y={18} fontSize="8" textAnchor="middle" fill="var(--fg)" fontWeight="700">
          {f === 'linear' ? 'linear peptide' : f === 'stapled' ? 'stapled α-helix' : 'head-to-tail macrocycle'}
        </text>
        {bars.map(([name, v, vmax, label], k) => (
          <g key={name}>
            <text x={6} y={144 + k * 20} fontSize="7.5" fill="var(--muted)">{name}</text>
            <rect x={76} y={136 + k * 20} width={150} height={9} rx={4} fill="var(--grid)" />
            <rect x={76} y={136 + k * 20} width={Math.max(2, 150 * Math.max(0, Math.min(1, v / vmax)))} height={9} rx={4}
              fill={name === 'H-bond donors' ? C[4] : C[0]} opacity={0.85} />
            <text x={232} y={144 + k * 20} fontSize="7.5" fill="var(--fg)">{label}</text>
          </g>
        ))}
        <text x={6} y={228} fontSize="7" fill="var(--muted)">
          Illustrative trends. Fewer donors and a rigid, pre-organised shape ⇒ better passive permeability.
        </text>
      </Stage>
      <Controls>
        <Btn active={f === 'linear'} onClick={() => setF('linear')}>linear</Btn>
        <Btn active={f === 'stapled'} onClick={() => setF('stapled')}>stapled</Btn>
        <Btn active={f === 'cyclic'} onClick={() => setF('cyclic')}>cyclic</Btn>
        <Slider label="N-methyls" min={0} max={5} step={1} value={nm} onChange={setNm} format={(x) => `${x}`} />
      </Controls>
    </div>
  );
}
