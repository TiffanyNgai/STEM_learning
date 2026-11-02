import { useState } from 'react';
import { Btn, Controls, PlayPause, Slider, Stage, useFrame } from './_kit';

/**
 * Fill electrons into orbital boxes one at a time, obeying the Aufbau principle (lowest energy first,
 * Madelung n+l order), Hund's rule (spread out with parallel spins before pairing) and the Pauli principle
 * (at most two per box, opposite spins). Shows the element, its configuration and which rule placed the last electron.
 * props: { z?: number (starting electron count, default 1), maxZ?: number (≤ 36, default 36), autoplay?: boolean (default false) }
 * Note: real Cr (Z=24) and Cu (Z=29) deviate from the simple rule; the widget flags this.
 */
const SYM = ['', 'H', 'He', 'Li', 'Be', 'B', 'C', 'N', 'O', 'F', 'Ne', 'Na', 'Mg', 'Al', 'Si', 'P', 'S', 'Cl', 'Ar', 'K', 'Ca', 'Sc', 'Ti', 'V', 'Cr', 'Mn', 'Fe', 'Co', 'Ni', 'Cu', 'Zn', 'Ga', 'Ge', 'As', 'Se', 'Br', 'Kr'];
const NAME = ['', 'hydrogen', 'helium', 'lithium', 'beryllium', 'boron', 'carbon', 'nitrogen', 'oxygen', 'fluorine', 'neon', 'sodium', 'magnesium', 'aluminium', 'silicon', 'phosphorus', 'sulfur', 'chlorine', 'argon', 'potassium', 'calcium', 'scandium', 'titanium', 'vanadium', 'chromium', 'manganese', 'iron', 'cobalt', 'nickel', 'copper', 'zinc', 'gallium', 'germanium', 'arsenic', 'selenium', 'bromine', 'krypton'];
const SUB: { n: number; l: number }[] = [
  { n: 1, l: 0 }, { n: 2, l: 0 }, { n: 2, l: 1 }, { n: 3, l: 0 }, { n: 3, l: 1 }, { n: 4, l: 0 }, { n: 3, l: 2 }, { n: 4, l: 1 },
];
const L = 'spdf';
const SUP: Record<string, string> = { 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' };
const sup = (k: number) => String(k).split('').map((d) => SUP[d]).join('');
const EXCEPT: Record<number, string> = { 24: 'Real Cr is [Ar] 3d⁵ 4s¹ — a half-filled d set is extra stable.', 29: 'Real Cu is [Ar] 3d¹⁰ 4s¹ — a full d set is extra stable.' };

/** Occupation per box (+1 up, +2 up+down) for each subshell, for N electrons. */
function fill(N: number) {
  let left = N;
  return SUB.map((s) => {
    const m = 2 * s.l + 1; const k = Math.min(left, 2 * m); left -= k;
    return Array.from({ length: m }, (_, i) => (i < k ? 1 : 0) + (i < k - m ? 1 : 0));
  });
}
function lastRule(N: number): string {
  if (N === 0) return '';
  const prev = fill(N - 1), now = fill(N);
  for (let s = 0; s < SUB.length; s++) for (let i = 0; i < now[s].length; i++) if (now[s][i] !== prev[s][i]) {
    if (now[s][i] === 2) return "Pauli: the box already has ↑, so this electron pairs with opposite spin ↓.";
    if (i > 0) return "Hund: an empty box of equal energy is free, so the electron goes there with parallel spin.";
    return `Aufbau: the lower orbitals are full, so the next-lowest subshell (${SUB[s].n}${L[SUB[s].l]}) starts filling.`;
  }
  return '';
}

export default function AufbauFiller({ z = 1, maxZ = 36, autoplay = false }: { z?: number; maxZ?: number; autoplay?: boolean }) {
  const top = Math.min(36, Math.max(1, maxZ));
  const [N, setN] = useState(Math.min(top, Math.max(0, z)));
  const [running, setRunning] = useState(autoplay);
  const [acc, setAcc] = useState(0);
  useFrame((dt) => {
    const a = acc + dt; if (a < 0.7) { setAcc(a); return; }
    setAcc(0); setN((n) => { if (n >= top) { setRunning(false); return n; } return n + 1; });
  }, running);
  const occ = fill(N); const prev = fill(Math.max(0, N - 1));
  const config = SUB.map((s, i) => ({ s, e: occ[i].reduce((a, b) => a + b, 0) })).filter((x) => x.e > 0)
    .map((x) => `${x.s.n}${L[x.s.l]}${sup(x.e)}`).join(' ');
  const bw = 16, gap = 2;
  const xOf = (l: number) => (l === 0 ? 172 : 204);
  return (
    <div>
      <Stage w={320} h={210} label={`Orbital filling diagram for ${N} electrons`}>
        <text x={6} y={14} fontSize="9" fill="var(--muted)">energy ↑</text>
        <line x1={10} x2={10} y1={198} y2={22} stroke="var(--muted)" strokeWidth={1} />
        <path d="M7,26 L10,19 L13,26" fill="none" stroke="var(--muted)" />
        {SUB.map((s, i) => {
          const y = 186 - i * 22; const m = 2 * s.l + 1; const x0 = xOf(s.l);
          return (
            <g key={i}>
              <text x={x0 - 6} y={y + 12} fontSize="10" textAnchor="end" fill="var(--fg)">{s.n}{L[s.l]}</text>
              {Array.from({ length: m }, (_, b) => {
                const bx = x0 + b * (bw + gap); const o = occ[i][b]; const isNew = N > 0 && o !== prev[i][b];
                return (
                  <g key={b}>
                    <rect x={bx} y={y} width={bw} height={16} fill="var(--surface)" stroke="var(--fg)" strokeWidth={0.8} />
                    {o >= 1 && <text x={bx + (o === 2 ? 5 : 8)} y={y + 12.5} fontSize="12" textAnchor="middle" fill={isNew && o === 1 ? 'var(--c3)' : 'var(--c2)'} fontWeight="bold">↑</text>}
                    {o === 2 && <text x={bx + 11} y={y + 12.5} fontSize="12" textAnchor="middle" fill={isNew ? 'var(--c3)' : 'var(--c5)'} fontWeight="bold">↓</text>}
                  </g>
                );
              })}
            </g>
          );
        })}
        <text x={20} y={40} fontSize="26" fontWeight="bold" fill="var(--c2)">{SYM[N] || '—'}</text>
        <text x={20} y={54} fontSize="9" fill="var(--fg)">{N > 0 ? `Z = ${N}, ${NAME[N]}` : 'no electrons'}</text>
        <foreignObject x={18} y={60} width={110} height={110}>
          <div style={{ fontSize: 9, lineHeight: 1.25, color: 'var(--muted)' }}>{lastRule(N)}{EXCEPT[N] ? ' ⚠ ' + EXCEPT[N] : ''}</div>
        </foreignObject>
        <text x={316} y={205} fontSize="10" textAnchor="end" fill="var(--fg)">{config}</text>
      </Stage>
      <Controls>
        <Btn onClick={() => setN((n) => Math.max(0, n - 1))}>− e⁻</Btn>
        <Btn onClick={() => setN((n) => Math.min(top, n + 1))}>+ e⁻</Btn>
        <PlayPause running={running} set={(r) => { if (r && N >= top) setN(0); setRunning(r); }} />
        <Slider label="Z" min={0} max={top} step={1} value={N} onChange={(v) => { setN(v); setRunning(false); }} format={(v) => String(v)} />
      </Controls>
    </div>
  );
}
