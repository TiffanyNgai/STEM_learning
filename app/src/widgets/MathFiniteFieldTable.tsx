import { useState } from 'react';
import { Btn, C, Controls, Stage } from './_kit';

/**
 * Addition / multiplication tables of ℤ/n (n = 2…7) and of the 4-element field GF(4) = ℤ₂[α]/(α²+α+1).
 * Cells are coloured by value. In the × table, 0-cells off the zero row/column are flagged as zero divisors
 * (red ring), and each 1 is ringed in green: a non-zero row with a 1 has an inverse. A verdict line says
 * whether the ring is a field. Tap a cell to see the computation.
 * props: { ring?: 'Z2' | 'Z3' | 'Z4' | 'Z5' | 'Z6' | 'Z7' | 'GF4' (default 'Z5'), op?: '+' | '×' (default '×'),
 *          choices?: string[] (which ring buttons to show, default all) }
 */
type R = { size: number; names: string[]; add: (a: number, b: number) => number; mul: (a: number, b: number) => number };
// GF(4): element = b1·α + b0, encoded 2·b1 + b0. Addition is XOR; α² = α + 1.
const gf4mul = (a: number, b: number) => {
  let r = 0; // carry-less product, then reduce α² → α + 1
  for (let i = 0; i < 2; i++) if ((b >> i) & 1) r ^= a << i;
  if (r & 4) r ^= 0b111;
  return r;
};
const ringOf = (id: string): R => {
  if (id === 'GF4') return { size: 4, names: ['0', '1', 'α', 'α+1'], add: (a, b) => a ^ b, mul: gf4mul };
  const n = Math.max(2, Math.min(7, parseInt(id.slice(1)) || 5));
  return { size: n, names: Array.from({ length: n }, (_, i) => String(i)), add: (a, b) => (a + b) % n, mul: (a, b) => (a * b) % n };
};
const ALL = ['Z2', 'Z3', 'Z4', 'Z5', 'Z6', 'Z7', 'GF4'];
const label = (id: string) => (id === 'GF4' ? 'GF(4)' : 'ℤ/' + id.slice(1));

export default function MathFiniteFieldTable({ ring = 'Z5', op = '×', choices = ALL }: { ring?: string; op?: '+' | '×'; choices?: string[] }) {
  const [id, setId] = useState(ALL.includes(ring) ? ring : 'Z5');
  const [o, setO] = useState<'+' | '×'>(op === '+' ? '+' : '×');
  const [sel, setSel] = useState<[number, number] | null>(null);
  const Rg = ringOf(id); const n = Rg.size; const f = o === '+' ? Rg.add : Rg.mul;
  const cell = Math.min(30, 200 / (n + 1)); const x0 = 12, y0 = 8;
  const nonUnits = o === '×' ? Array.from({ length: n - 1 }, (_, i) => i + 1).filter((a) => !Array.from({ length: n }, (_, b) => Rg.mul(a, b)).includes(1)) : [];
  const isField = Array.from({ length: n - 1 }, (_, i) => i + 1).every((a) => Array.from({ length: n }, (_, b) => Rg.mul(a, b)).includes(1));
  const tx = x0 + (n + 1) * cell + 12;
  const H = Math.max(y0 + (n + 1) * cell + 8, 150);
  const fs = id === 'GF4' ? 9 : 11;

  return (
    <div>
      <Stage w={320} h={H} label={`${o} table of ${label(id)}`}>
        <text x={x0 + cell / 2} y={y0 + cell * 0.68} fontSize="13" textAnchor="middle" fill="var(--c4)" fontWeight="bold">{o}</text>
        {Rg.names.map((nm, i) => (
          <g key={'h' + i} fontSize={fs} textAnchor="middle" fill="var(--muted)" fontWeight="bold">
            <text x={x0 + (i + 1.5) * cell} y={y0 + cell * 0.68}>{nm}</text>
            <text x={x0 + cell / 2} y={y0 + (i + 1) * cell + cell * 0.68}>{nm}</text>
          </g>
        ))}
        {Rg.names.map((_, a) => Rg.names.map((_, b) => {
          const v = f(a, b); const x = x0 + (b + 1) * cell, y = y0 + (a + 1) * cell;
          const zd = o === '×' && v === 0 && a !== 0 && b !== 0; const one = o === '×' && v === 1;
          const on = sel && sel[0] === a && sel[1] === b;
          return (
            <g key={a + '-' + b} onClick={() => setSel(on ? null : [a, b])} style={{ cursor: 'pointer' }}>
              <rect x={x} y={y} width={cell} height={cell} fill={C[v % 6]} fillOpacity={v === 0 ? 0.08 : 0.4} stroke={on ? 'var(--fg)' : 'var(--grid)'} strokeWidth={on ? 2 : 0.5} />
              {(zd || one) && <circle cx={x + cell / 2} cy={y + cell / 2} r={cell * 0.38} fill="none" stroke={zd ? 'var(--c5)' : 'var(--c1)'} strokeWidth={2} />}
              <text x={x + cell / 2} y={y + cell * 0.66} fontSize={fs} textAnchor="middle" fill="var(--fg)">{Rg.names[v]}</text>
            </g>
          );
        }))}
        <g fontSize="10" fill="var(--fg)">
          <text x={tx} y={18} fontWeight="bold">{label(id)}</text>
          <text x={tx} y={30} fontSize="9" fill="var(--muted)">{o === '+' ? 'addition' : 'multiplication'}</text>
          {sel && <text x={tx} y={46}>{Rg.names[sel[0]]} {o} {Rg.names[sel[1]]} = {Rg.names[f(sel[0], sel[1])]}</text>}
          {sel && id === 'GF4' && o === '×' && <text x={tx} y={58} fontSize="8" fill="var(--muted)">(α² = α+1, 1+1 = 0)</text>}
          {sel && id !== 'GF4' && <text x={tx} y={58} fontSize="8" fill="var(--muted)">({o === '+' ? sel[0] + sel[1] : sel[0] * sel[1]} mod {n})</text>}
          {o === '×' && <text x={tx} y={82} fontSize="9" fill="var(--c1)">○ 1 ⇒ inverse</text>}
          {o === '×' && <text x={tx} y={97} fontSize="9" fill="var(--c5)">○ zero divisor</text>}
          {o === '×' && nonUnits.length > 0 && <text x={tx} y={114} fontSize="9">no inverse: {nonUnits.map((a) => Rg.names[a]).join(', ')}</text>}
          {o === '+' && <text x={tx} y={82} fontSize="9" fill="var(--muted)">rows are shuffles:</text>}
          {o === '+' && <text x={tx} y={96} fontSize="9" fill="var(--muted)">(R, +) is a group</text>}
          <text x={tx} y={136} fontWeight="bold" fill={isField ? 'var(--c1)' : 'var(--c5)'}>{isField ? 'a FIELD' : 'NOT a field'}</text>
        </g>
      </Stage>
      <Controls>
        {choices.filter((c) => ALL.includes(c)).map((c) => <Btn key={c} active={c === id} onClick={() => { setId(c); setSel(null); }}>{label(c)}</Btn>)}
        <Btn active={o === '+'} onClick={() => setO('+')}>+</Btn>
        <Btn active={o === '×'} onClick={() => setO('×')}>×</Btn>
      </Controls>
    </div>
  );
}
