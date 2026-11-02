import { useMemo, useState } from 'react';
import { Btn, C, Controls, PlayPause, Slider, Stage, prefersReducedMotion, useFrame } from './_kit';

/**
 * Split-and-pool (split-mix) combinatorial synthesis, one-bead-one-compound.
 * Each cycle: the pool of resin beads is SPLIT into b vessels, each vessel couples one building block
 * (a coloured square appended to every bead's chain), then all beads are POOLED and mixed.
 * After n cycles every one of the b^n possible sequences exists on its own bead, using only b·n couplings.
 * Sliders change b (2–4) and n (1–3) for the animation; a readout also shows an industrial-scale example.
 * props: { blocks?: number (b, default 3), cycles?: number (n, default 3), animate?: boolean (default true) }
 */
const PHASE = 2.6; // seconds per cycle: 0–1 split, 1–1.6 couple, 1.6–2.6 pool
const ease = (u: number) => (u <= 0 ? 0 : u >= 1 ? 1 : u * u * (3 - 2 * u));

export default function DrugSplitPool({ blocks = 3, cycles = 3, animate = true }: { blocks?: number; cycles?: number; animate?: boolean }) {
  const [b, setB] = useState(Math.max(2, Math.min(4, Math.round(blocks))));
  const [n, setN] = useState(Math.max(1, Math.min(3, Math.round(cycles))));
  const total = n * PHASE + 1.2;
  const still = !animate || prefersReducedMotion();
  const [running, setRunning] = useState(!still);
  const [t, setT] = useState(still ? total : 0);
  useFrame((dt) => setT((v) => (v + dt > total + 1.5 ? 0 : v + dt)), running);

  const W = 320, H = 214;
  const count = Math.pow(b, n);
  const cell = 8 + n * 5 + 4; // bead + chain + gap
  const vesselW = (W - 8) / b;
  const poolCols = Math.min(count, Math.floor((W - 16) / cell));
  const vesCols = Math.max(1, Math.floor((vesselW - 8) / cell));

  // digit k (block index added in cycle k) of bead i
  const digit = (i: number, k: number) => Math.floor(i / Math.pow(b, k)) % b;
  // rank of each bead inside its vessel at cycle k
  const ranks = useMemo(() => {
    const out: number[][] = [];
    for (let k = 0; k < n; k++) {
      const seen = new Array(b).fill(0);
      out.push(Array.from({ length: count }, (_, i) => seen[digit(i, k)]++));
    }
    return out;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [b, n, count]);

  const poolXY = (i: number): [number, number] => [10 + (i % poolCols) * cell, 150 + Math.floor(i / poolCols) * 9];
  const vesXY = (i: number, k: number): [number, number] => {
    const v = digit(i, k), r = ranks[k][i];
    return [4 + v * vesselW + 6 + (r % vesCols) * cell, 36 + Math.floor(r / vesCols) * 9];
  };

  const k = Math.min(n, Math.floor(t / PHASE));
  const u = t - k * PHASE;
  const phase = k >= n ? 'done' : u < 1 ? 'split' : u < 1.6 ? 'couple' : 'pool';
  const label = k >= n ? `Done: ${count} different compounds, one per bead` : `Cycle ${k + 1}: ${phase === 'split' ? 'split into ' + b + ' vessels' : phase === 'couple' ? 'couple one block per vessel' : 'pool & mix'}`;
  const reset = (nb: number, nn: number) => { setB(nb); setN(nn); setT(still ? nn * PHASE + 1.2 : 0); };

  return (
    <div>
      <Stage w={W} h={H} label="Split-and-pool combinatorial synthesis">
        <text x={W / 2} y={12} textAnchor="middle" fontSize="10" fontWeight={700} fill="var(--fg)">{label}</text>
        {Array.from({ length: b }, (_, v) => (
          <g key={v}>
            <rect x={4 + v * vesselW + 2} y={22} width={vesselW - 4} height={110} rx={8} fill={C[v]} fillOpacity={0.08} stroke={C[v]} strokeOpacity={0.6} />
            <text x={4 + v * vesselW + vesselW / 2} y={128} textAnchor="middle" fontSize="9" fill="var(--muted)">block {String.fromCharCode(65 + v)}</text>
          </g>
        ))}
        <rect x={4} y={140} width={W - 8} height={H - 144} rx={8} fill="none" stroke="var(--muted)" strokeDasharray="3 3" />
        {Array.from({ length: count }, (_, i) => {
          let p: [number, number];
          if (k >= n) p = poolXY(i);
          else {
            const a = poolXY(i), v = vesXY(i, k);
            const s = u < 1 ? ease(u) : u < 1.6 ? 1 : 1 - ease(u - 1.6);
            p = [a[0] + (v[0] - a[0]) * s, a[1] + (v[1] - a[1]) * s];
          }
          const shown = k >= n ? n : k;
          const fresh = k < n && u >= 1 ? Math.min(1, (u - 1) / 0.6) : 0;
          return (
            <g key={i} transform={`translate(${p[0].toFixed(1)},${p[1].toFixed(1)})`}>
              <circle cx={3} cy={3} r={3} fill="var(--muted)" />
              {Array.from({ length: shown }, (_, j) => (
                <rect key={j} x={7 + j * 5} y={0.5} width={4.5} height={5} fill={C[digit(i, j)]} />
              ))}
              {fresh > 0 && <rect x={7 + k * 5} y={0.5} width={4.5} height={5} fill={C[digit(i, k)]} opacity={fresh} />}
            </g>
          );
        })}
        <text x={W - 8} y={H - 6} textAnchor="end" fontSize="8" fill="var(--muted)">pool (each bead = one compound)</text>
      </Stage>
      <div className="w-muted">
        {b} blocks × {n} cycle{n > 1 ? 's' : ''}: <b>{count.toLocaleString()}</b> compounds from only <b>{b * n}</b> coupling reactions
        (one-by-one synthesis would need {(count * n).toLocaleString()}). Real scale: 3 cycles × 1,000 blocks = 10⁹ compounds from 3,000 couplings.
      </div>
      <Controls>
        <Slider label="blocks b" value={b} min={2} max={4} step={1} onChange={(v) => reset(v, n)} format={(v) => String(v)} />
        <Slider label="cycles n" value={n} min={1} max={3} step={1} onChange={(v) => reset(b, v)} format={(v) => String(v)} />
        <PlayPause running={running} set={setRunning} />
        <Btn onClick={() => setT(0)}>↺ Restart</Btn>
      </Controls>
    </div>
  );
}
