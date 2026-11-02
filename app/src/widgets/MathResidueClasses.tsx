import { useState } from 'react';
import { C, Controls, Slider, Stage } from './_kit';

/**
 * Equivalence classes of "congruent mod n" on a window of integers.
 * Each integer is coloured by its class; the classes [0], [1], …, [n−1] are listed underneath,
 * showing that they are disjoint and cover everything (a partition). Tap an integer to highlight its
 * whole class. The slider changes n.
 * props: { n?: number (2–6, default 3), from?: number (first integer shown, default −6),
 *          count?: number (how many integers, 8–24, default 24), slider?: boolean (default true) }
 */
const mod = (a: number, n: number) => ((a % n) + n) % n;

export default function MathResidueClasses({ n = 3, from = -6, count = 24, slider = true }: {
  n?: number; from?: number; count?: number; slider?: boolean;
}) {
  const [m, setM] = useState(Math.max(2, Math.min(6, Math.round(n))));
  const [sel, setSel] = useState<number | null>(null);
  const N = Math.max(8, Math.min(24, Math.round(count)));
  const nums = Array.from({ length: N }, (_, i) => from + i);
  const cols = 8, cw = 38, ch = 26, x0 = 8, y0 = 8;
  const rowsUsed = Math.ceil(N / cols);
  const ly = y0 + rowsUsed * ch + 14;
  const H = ly + m * 15 + 6;
  const selClass = sel === null ? null : mod(sel, m);

  return (
    <div>
      <Stage w={320} h={H} label={`Integers partitioned into classes mod ${m}`}>
        {nums.map((k, i) => {
          const r = mod(k, m); const x = x0 + (i % cols) * cw, y = y0 + Math.floor(i / cols) * ch;
          const dim = selClass !== null && r !== selClass;
          return (
            <g key={k} onClick={() => setSel(sel === k ? null : k)} style={{ cursor: 'pointer' }} opacity={dim ? 0.25 : 1}>
              <rect x={x} y={y} width={cw - 4} height={ch - 4} rx={6} fill={C[r % 6]} fillOpacity={0.85}
                stroke={sel === k ? 'var(--fg)' : 'none'} strokeWidth={2} />
              <text x={x + (cw - 4) / 2} y={y + 16} fontSize="11" textAnchor="middle" fill="var(--surface)" fontWeight="bold">{k}</text>
            </g>
          );
        })}
        {Array.from({ length: m }, (_, r) => {
          const members = nums.filter((k) => mod(k, m) === r).slice(0, 8);
          return (
            <g key={r} opacity={selClass !== null && selClass !== r ? 0.35 : 1}>
              <circle cx={14} cy={ly + r * 15 - 4} r={5} fill={C[r % 6]} />
              <text x={24} y={ly + r * 15} fontSize="10" fill="var(--fg)">
                [{r}] = {'{'}…, {members.join(', ')}, …{'}'}
              </text>
            </g>
          );
        })}
      </Stage>
      <Controls>
        {slider && <Slider label="n" value={m} min={2} max={6} step={1} onChange={(v) => { setM(v); setSel(null); }} format={(v) => String(v)} />}
        <span className="w-muted">{sel === null ? 'Tap an integer to light up its class.' : `b ~ ${sel} ⇔ ${m} divides b − ${sel}; so [${sel}] = [${selClass}]`}</span>
      </Controls>
    </div>
  );
}
