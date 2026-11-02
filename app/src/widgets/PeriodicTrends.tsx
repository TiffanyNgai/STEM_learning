import { useState } from 'react';
import { Btn, Controls, Stage } from './_kit';

/**
 * Mini periodic table (H–Kr, periods 1–4) as a heat-map of an atomic property. Tap a cell for its value.
 * props: { property?: 'radius'|'ie'|'en' (default 'radius'), properties?: same[] (toggle buttons; default all three),
 *          highlight?: string[] (element symbols to outline), showArrows?: boolean (default true) }
 * Data: covalent radius (pm, Cordero et al. 2008; low-spin values for Mn/Fe/Co), first ionization energy (kJ/mol, NIST),
 * Pauling electronegativity (none listed for He, Ne, Ar).
 */
type Prop = 'radius' | 'ie' | 'en';
const SYM = ['H', 'He', 'Li', 'Be', 'B', 'C', 'N', 'O', 'F', 'Ne', 'Na', 'Mg', 'Al', 'Si', 'P', 'S', 'Cl', 'Ar', 'K', 'Ca', 'Sc', 'Ti', 'V', 'Cr', 'Mn', 'Fe', 'Co', 'Ni', 'Cu', 'Zn', 'Ga', 'Ge', 'As', 'Se', 'Br', 'Kr'];
const DATA: Record<Prop, (number | null)[]> = {
  radius: [31, 28, 128, 96, 84, 76, 71, 66, 57, 58, 166, 141, 121, 111, 107, 105, 102, 106, 203, 176, 170, 160, 153, 139, 139, 132, 126, 124, 132, 122, 122, 120, 119, 120, 120, 116],
  ie: [1312, 2372, 520, 900, 801, 1086, 1402, 1314, 1681, 2081, 496, 738, 578, 787, 1012, 1000, 1251, 1521, 419, 590, 633, 659, 651, 653, 717, 762, 760, 737, 745, 906, 579, 762, 947, 941, 1140, 1351],
  en: [2.2, null, 0.98, 1.57, 2.04, 2.55, 3.04, 3.44, 3.98, null, 0.93, 1.31, 1.61, 1.9, 2.19, 2.58, 3.16, null, 0.82, 1.0, 1.36, 1.54, 1.63, 1.66, 1.55, 1.83, 1.88, 1.91, 1.9, 1.65, 1.81, 2.01, 2.18, 2.55, 2.96, 3.0],
};
const INFO: Record<Prop, { name: string; unit: string; up: string; right: string }> = {
  radius: { name: 'Atomic (covalent) radius', unit: 'pm', up: 'grows down a group', right: 'shrinks across a period' },
  ie: { name: 'First ionization energy', unit: 'kJ/mol', up: 'falls down a group', right: 'rises across a period' },
  en: { name: 'Electronegativity (Pauling)', unit: '', up: 'falls down a group', right: 'rises across a period' },
};
/** [period, group] for Z = 1..36 */
function pos(z: number): [number, number] {
  if (z === 1) return [1, 1]; if (z === 2) return [1, 18];
  if (z <= 10) return [2, z <= 4 ? z - 2 : z + 8];
  if (z <= 18) return [3, z <= 12 ? z - 10 : z];
  return [4, z - 18];
}

export default function PeriodicTrends({ property = 'radius', properties = ['radius', 'ie', 'en'], highlight = [], showArrows = true }: {
  property?: Prop; properties?: Prop[]; highlight?: string[]; showArrows?: boolean;
}) {
  const [p, setP] = useState<Prop>(DATA[property] ? property : 'radius');
  const [sel, setSel] = useState<number | null>(null);
  const vals = DATA[p]; const nums = vals.filter((v): v is number => v !== null);
  const lo = Math.min(...nums), hi = Math.max(...nums);
  const cw = 17, ch = 22, x0 = 7, y0 = 22;
  const info = INFO[p];
  return (
    <div>
      <Stage w={320} h={200} label={`Periodic table heat map: ${info.name}`}>
        <text x={x0} y={14} fontSize="10" fontWeight="bold" fill="var(--fg)">{info.name}</text>
        {SYM.map((s, i) => {
          const [per, grp] = pos(i + 1); const v = vals[i];
          const x = x0 + (grp - 1) * cw, y = y0 + (per - 1) * ch;
          const f = v === null ? 0 : 0.12 + 0.88 * ((v - lo) / (hi - lo));
          const hl = highlight.includes(s) || sel === i;
          return (
            <g key={s} onClick={() => setSel(i)} style={{ cursor: 'pointer' }}>
              <rect x={x + 0.5} y={y + 0.5} width={cw - 1} height={ch - 1} rx={2} fill={v === null ? 'var(--grid)' : 'var(--c2)'}
                fillOpacity={v === null ? 0.5 : f} stroke={hl ? 'var(--c3)' : 'var(--grid)'} strokeWidth={hl ? 2 : 0.5} />
              <text x={x + cw / 2} y={y + 14} fontSize="9" textAnchor="middle" fill="var(--fg)" fontWeight={f > 0.6 ? 'bold' : undefined}>{s}</text>
            </g>
          );
        })}
        {/* legend */}
        <defs><linearGradient id="pt-grad"><stop offset="0" stopColor="var(--c2)" stopOpacity={0.12} /><stop offset="1" stopColor="var(--c2)" stopOpacity={1} /></linearGradient></defs>
        <rect x={60} y={y0 + 2} width={140} height={10} fill="url(#pt-grad)" stroke="var(--grid)" />
        <text x={58} y={y0 + 11} fontSize="9" textAnchor="end" fill="var(--muted)">{lo}</text>
        <text x={203} y={y0 + 11} fontSize="9" fill="var(--muted)">{hi} {info.unit}</text>
        {showArrows && (
          <g fontSize="9" fill="var(--fg)">
            <defs><marker id="pt-arr" viewBox="0 0 6 6" refX="5" refY="3" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0L6,3L0,6z" fill="var(--c4)" /></marker></defs>
            <line x1={x0 + 20} x2={x0 + 290} y1={124} y2={124} stroke="var(--c4)" strokeWidth={1.5} markerEnd="url(#pt-arr)" />
            <text x={x0 + 20} y={136}>across a period (left → right): {info.right}</text>
            <text x={x0 + 20} y={148}>down a group (top → bottom): {info.up}</text>
          </g>
        )}
        <text x={x0} y={172} fontSize="11" fill="var(--fg)">
          {sel === null ? 'Tap an element to read its value.' : `${SYM[sel]} (Z = ${sel + 1}): ${vals[sel] === null ? 'no Pauling value (noble gas)' : `${vals[sel]} ${info.unit}`}`}
        </text>
        {sel !== null && vals[sel] !== null && (
          <rect x={x0} y={180} width={((vals[sel]! - lo) / (hi - lo)) * 300 + 2} height={8} rx={3} fill="var(--c2)" />
        )}
      </Stage>
      <Controls>
        {properties.filter((q) => DATA[q]).map((q) => (
          <Btn key={q} active={q === p} onClick={() => setP(q)}>{q === 'radius' ? 'Radius' : q === 'ie' ? 'Ionization E' : 'Electronegativity'}</Btn>
        ))}
      </Controls>
    </div>
  );
}
