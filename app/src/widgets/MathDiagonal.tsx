import { useRef, useState } from 'react';
import { Btn, Controls, Stage, prefersReducedMotion, rng, useFrame } from './_kit';

/**
 * Cantor's diagonal argument. A (supposedly complete) list s₁, s₂, … of infinite 0/1 sequences is shown.
 * Step through the diagonal: at row k we read digit k of sₖ and write the OPPOSITE digit into the new
 * sequence d. Then d differs from every sₖ in position k, so d is missing from the list.
 * "New list" draws another random list; "Auto" plays the steps (off for reduced-motion users).
 * props: { rows?: number (4–8, default 6), seed?: number (default 7) }
 */
const make = (n: number, seed: number) => { const r = rng(seed); return Array.from({ length: n }, () => Array.from({ length: n + 2 }, () => (r.u() < 0.5 ? 0 : 1))); };

export default function MathDiagonal({ rows = 6, seed = 7 }: { rows?: number; seed?: number }) {
  const n = Math.max(4, Math.min(8, Math.round(rows)));
  const [sd, setSd] = useState(seed);
  const [k, setK] = useState(0); // number of diagonal digits processed
  const [auto, setAuto] = useState(false);
  const acc = useRef(0);
  const S = make(n, sd);
  useFrame((dt) => {
    acc.current += dt;
    if (acc.current < 0.9) return;
    acc.current = 0;
    if (k >= n) setAuto(false); else setK(k + 1);
  }, auto);

  const cw = 22, rh = 20, x0 = 46, y0 = 22, m = n + 2;
  const yD = y0 + n * rh + 18;
  const H = yD + 40;
  const d = S.map((row, i) => 1 - row[i]);
  const done = k >= n;
  const cur = k > 0 && !done ? k - 1 : -1;

  return (
    <div>
      <Stage w={320} h={H} label="Cantor's diagonal argument">
        {Array.from({ length: m }, (_, j) => <text key={'h' + j} x={x0 + j * cw + cw / 2} y={y0 - 8} fontSize="9" textAnchor="middle" fill="var(--muted)">{j + 1}</text>)}
        {S.map((row, i) => (
          <g key={i}>
            <text x={x0 - 8} y={y0 + i * rh + 14} fontSize="11" textAnchor="end" fill="var(--fg)">s<tspan fontSize="8" dy="3">{i + 1}</tspan></text>
            {row.map((b, j) => {
              const diag = i === j; const lit = diag && i < k;
              return (
                <g key={j}>
                  <rect x={x0 + j * cw + 1} y={y0 + i * rh + 1} width={cw - 2} height={rh - 2} rx={3}
                    fill={lit ? 'var(--c3)' : diag ? 'var(--c3)' : 'var(--surface-2)'} fillOpacity={lit ? 0.9 : diag ? 0.2 : 1}
                    stroke={i === cur && diag ? 'var(--fg)' : 'none'} strokeWidth={1.5} />
                  <text x={x0 + j * cw + cw / 2} y={y0 + i * rh + 14} fontSize="11" textAnchor="middle" fill={lit ? 'var(--surface)' : 'var(--fg)'} fontWeight={diag ? 'bold' : 'normal'}>{b}</text>
                </g>
              );
            })}
            <text x={x0 + m * cw + 4} y={y0 + i * rh + 14} fontSize="11" fill="var(--muted)">…</text>
          </g>
        ))}
        <text x={x0 + n * cw / 2} y={y0 + n * rh + 10} fontSize="11" textAnchor="middle" fill="var(--muted)">⋮</text>
        <text x={x0 - 8} y={yD + 14} fontSize="11" textAnchor="end" fill="var(--c4)" fontWeight="bold">d</text>
        {d.map((b, j) => (
          <g key={'d' + j}>
            <rect x={x0 + j * cw + 1} y={yD + 1} width={cw - 2} height={rh - 2} rx={3} fill="var(--c4)" fillOpacity={j < k ? 0.85 : 0.08} stroke="var(--c4)" strokeWidth={0.8} />
            {j < k && <text x={x0 + j * cw + cw / 2} y={yD + 14} fontSize="11" textAnchor="middle" fill="var(--surface)" fontWeight="bold">{b}</text>}
          </g>
        ))}
        <text x={x0 + n * cw + 4} y={yD + 14} fontSize="11" fill="var(--muted)">…</text>
        <text x={8} y={H - 6} fontSize="10" fill="var(--fg)">
          {k === 0 ? 'Press Step: flip the diagonal digits to build d.'
            : done ? `d ≠ sₖ for every k (they differ at digit k). d is not listed!`
              : `digit ${k} of s${k} is ${S[k - 1][k - 1]}, so d gets ${d[k - 1]}: d ≠ s${k}.`}
        </text>
      </Stage>
      <Controls>
        <Btn onClick={() => setK((x) => Math.min(n, x + 1))}>Step</Btn>
        {!prefersReducedMotion() && <Btn active={auto} onClick={() => { if (k >= n) setK(0); setAuto(!auto); }}>{auto ? 'Pause' : 'Auto'}</Btn>}
        <Btn onClick={() => { setK(0); setAuto(false); }}>Reset</Btn>
        <Btn onClick={() => { setSd((s) => s + 1); setK(0); setAuto(false); }}>New list</Btn>
      </Controls>
    </div>
  );
}
