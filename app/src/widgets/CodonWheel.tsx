import { useState } from 'react';
import { Btn, Controls, Stage } from './_kit';

/**
 * The genetic-code wheel. Read an mRNA codon from the centre outwards: 1st base (inner ring), 2nd base, 3rd base,
 * then the amino acid on the rim. Tap the rim or use the base buttons to look up a codon.
 * props: { codon?: string (e.g. 'AUG', pre-selected), showButtons?: boolean (default true) }
 */
const B = 'UCAG';
const AA1 = 'FFLLSSSSYY**CC*WLLLLPPPPHHQQRRRRIIIMTTTTNNKKSSRRVVVVAAAADDEEGGGG';
const NAME: Record<string, [string, string]> = {
  A: ['Ala', 'Alanine'], R: ['Arg', 'Arginine'], N: ['Asn', 'Asparagine'], D: ['Asp', 'Aspartate'], C: ['Cys', 'Cysteine'],
  Q: ['Gln', 'Glutamine'], E: ['Glu', 'Glutamate'], G: ['Gly', 'Glycine'], H: ['His', 'Histidine'], I: ['Ile', 'Isoleucine'],
  L: ['Leu', 'Leucine'], K: ['Lys', 'Lysine'], M: ['Met', 'Methionine'], F: ['Phe', 'Phenylalanine'], P: ['Pro', 'Proline'],
  S: ['Ser', 'Serine'], T: ['Thr', 'Threonine'], W: ['Trp', 'Tryptophan'], Y: ['Tyr', 'Tyrosine'], V: ['Val', 'Valine'], '*': ['Stop', 'Stop (no amino acid)'],
};
const CX = 112, CY = 116, RING = [0, 26, 52, 80, 108];
const BASE_COL: Record<string, string> = { U: 'var(--c5)', C: 'var(--c2)', A: 'var(--c1)', G: 'var(--c3)' };
const pol = (r: number, deg: number): [number, number] => [CX + r * Math.sin((deg * Math.PI) / 180), CY - r * Math.cos((deg * Math.PI) / 180)];
function wedge(r0: number, r1: number, a0: number, a1: number) {
  const [x0, y0] = pol(r1, a0), [x1, y1] = pol(r1, a1), [x2, y2] = pol(r0, a1), [x3, y3] = pol(r0, a0);
  const big = a1 - a0 > 180 ? 1 : 0;
  if (r0 === 0) return `M${CX},${CY} L${x0},${y0} A${r1},${r1} 0 ${big} 1 ${x1},${y1} Z`;
  return `M${x0},${y0} A${r1},${r1} 0 ${big} 1 ${x1},${y1} L${x2},${y2} A${r0},${r0} 0 ${big} 0 ${x3},${y3} Z`;
}
function radialText(r: number, a: number, s: string, size: number, fill: string, weight = 400) {
  const [x, y] = pol(r, a); const flip = a > 180;
  return <text x={x} y={y} fontSize={size} fill={fill} fontWeight={weight} textAnchor="middle" dominantBaseline="central"
    transform={`rotate(${flip ? a + 90 : a - 90} ${x} ${y})`}>{s}</text>;
}

export default function CodonWheel({ codon = '', showButtons = true }: { codon?: string; showButtons?: boolean }) {
  const [sel, setSel] = useState(codon.toUpperCase().replace(/T/g, 'U').slice(0, 3));
  const idx = (k: number) => B.indexOf(sel[k]);
  const pick = (pos: number, b: string) => setSel((s) => { const a = s.split(''); if (pos > a.length) return s; a[pos] = b; return a.join(''); });
  const full = sel.length === 3 && [0, 1, 2].every((k) => idx(k) >= 0);
  const aa = full ? AA1[16 * idx(0) + 4 * idx(1) + idx(2)] : '';
  const on = (level: number, i: number) => {
    // is wedge i of ring level (0: 4 wedges, 1: 16, 2: 64) on the selected path?
    if (sel.length <= level) return false;
    const want = level === 0 ? idx(0) : level === 1 ? 4 * idx(0) + idx(1) : 16 * idx(0) + 4 * idx(1) + idx(2);
    return i === want;
  };
  // aa groups on the rim
  const groups: { aa: string; a: number; b: number }[] = [];
  for (let i = 0; i < 64; i++) {
    const g = groups[groups.length - 1];
    if (g && g.aa === AA1[i] && Math.floor(i / 4) === Math.floor(g.a / 4)) g.b = i; else groups.push({ aa: AA1[i], a: i, b: i });
  }
  const step = 360 / 64;
  return (
    <div>
      <Stage w={320} h={232} label="Genetic code wheel">
        {[4, 16, 64].map((count, level) => Array.from({ length: count }, (_, i) => {
          const span = 360 / count; const b = B[i % 4]; const active = on(level, i);
          return (
            <g key={`${level}-${i}`} onClick={() => setSel(level === 0 ? B[i] : level === 1 ? B[i >> 2] + B[i % 4] : B[i >> 4] + B[(i >> 2) % 4] + B[i % 4])} style={{ cursor: 'pointer' }}>
              <path d={wedge(RING[level], RING[level + 1], i * span, (i + 1) * span)} fill={BASE_COL[b]} fillOpacity={active ? 0.75 : sel ? 0.12 : 0.25} stroke="var(--surface)" strokeWidth={0.8} />
              {level < 2 ? (() => { const [x, y] = pol((RING[level] + RING[level + 1]) / 2 + (level ? 0 : 3), (i + 0.5) * span); return <text x={x} y={y + 3.5} fontSize={level ? 10 : 12} fontWeight={700} textAnchor="middle" fill="var(--fg)">{b}</text>; })()
                : radialText(66, (i + 0.5) * span, b, 7.5, 'var(--fg)', active ? 700 : 400)}
            </g>
          );
        }))}
        {groups.map((g, i) => {
          const a0 = g.a * step, a1 = (g.b + 1) * step; const hit = full && g.a <= 16 * idx(0) + 4 * idx(1) + idx(2) && 16 * idx(0) + 4 * idx(1) + idx(2) <= g.b;
          return (
            <g key={'g' + i} onClick={() => { const k = g.a; setSel(B[k >> 4] + B[(k >> 2) % 4] + B[k % 4]); }} style={{ cursor: 'pointer' }}>
              <path d={wedge(RING[3] + 1, RING[4], a0, a1)} fill={g.aa === '*' ? 'var(--c5)' : g.aa === 'M' ? 'var(--c1)' : 'var(--c4)'} fillOpacity={hit ? 0.7 : i % 2 ? 0.1 : 0.2} stroke="var(--surface)" strokeWidth={0.8} />
              {radialText(94, (a0 + a1) / 2, NAME[g.aa][0], 8, 'var(--fg)', hit ? 700 : 400)}
            </g>
          );
        })}
        <g fontSize={10} fill="var(--fg)">
          <text x={232} y={30} fill="var(--muted)" fontSize={9}>codon (5′→3′)</text>
          <text x={232} y={56} fontSize={24} fontWeight={700} fontFamily="monospace">
            {[0, 1, 2].map((k) => <tspan key={k} fill={sel[k] ? BASE_COL[sel[k]] : 'var(--grid)'}>{sel[k] ?? '_'}</tspan>)}
          </text>
          <text x={232} y={84} fill="var(--muted)" fontSize={9}>amino acid</text>
          <text x={232} y={100} fontWeight={700} fontSize={11}>{full ? NAME[aa][1].split(' (')[0] : '…'}</text>
          <text x={232} y={114} fontSize={9} fill="var(--muted)">{full ? (aa === '*' ? 'ends translation' : `${NAME[aa][0]} · ${aa}`) : 'pick 3 bases'}</text>
          {full && aa === 'M' && <text x={232} y={128} fontSize={9} fill="var(--c1)">START codon too</text>}
          <text x={232} y={170} fontSize={8.5} fill="var(--muted)">inner ring = 1st base</text>
          <text x={232} y={182} fontSize={8.5} fill="var(--muted)">middle = 2nd base</text>
          <text x={232} y={194} fontSize={8.5} fill="var(--muted)">outer = 3rd base</text>
          <text x={232} y={206} fontSize={8.5} fill="var(--muted)">rim = amino acid</text>
        </g>
      </Stage>
      {showButtons && (
        <Controls>
          {[0, 1, 2].map((pos) => (
            <span key={pos} style={{ display: 'inline-flex', gap: 4, alignItems: 'center' }}>
              <span className="w-muted">{pos + 1}{['st', 'nd', 'rd'][pos]}:</span>
              {B.split('').map((b) => <Btn key={b} active={sel[pos] === b} onClick={() => pick(pos, b)}>{b}</Btn>)}
            </span>
          ))}
          <Btn onClick={() => setSel('')}>Clear</Btn>
        </Controls>
      )}
    </div>
  );
}
