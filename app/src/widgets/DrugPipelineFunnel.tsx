import { useMemo, useState } from 'react';
import { Btn, C, Controls, PlayPause, Stage, prefersReducedMotion, rng, useFrame } from './_kit';

interface FunnelStage { name: string; n: number; years: number; cost: number; note?: string }
/**
 * Animated drug-discovery attrition funnel: compounds stream down through the stages and drop out.
 * Tap a stage to see its details. Dot counts are log-scaled (1 dot ≠ 1 compound).
 * props: { stages?: {name, n (compounds/candidates entering), years (typical duration), cost ($M, rough out-of-pocket per stage per approval), note?}[],
 *          animate?: boolean (default true) }
 * Defaults are rough, commonly quoted figures (PhRMA; Paul et al. 2010). Costs sum to DiMasi et al. 2016's
 * ~$1.4B out-of-pocket per approval (~$2.6B once the cost of capital is included).
 */
const DEFAULT: FunnelStage[] = [
  { name: 'Discovery (hit → lead → candidate)', n: 10000, years: 4.5, cost: 330, note: 'compounds made & tested' },
  { name: 'Preclinical', n: 250, years: 1.5, cost: 100, note: 'animal safety, formulation, manufacturing' },
  { name: 'Phase I', n: 10, years: 1.5, cost: 150, note: 'safety & PK in ~20–100 people' },
  { name: 'Phase II', n: 6, years: 2.5, cost: 300, note: 'efficacy & dose in ~100–500 patients' },
  { name: 'Phase III', n: 2, years: 3, cost: 480, note: 'confirmatory, ~1,000–5,000 patients' },
  { name: 'Regulatory review', n: 1.2, years: 1, cost: 35, note: 'FDA / EMA review' },
];

export default function DrugPipelineFunnel({ stages = DEFAULT, animate = true }: { stages?: FunnelStage[]; animate?: boolean }) {
  const [running, setRunning] = useState(animate && !prefersReducedMotion());
  const [t, setT] = useState(0);
  const [sel, setSel] = useState<number | null>(null);
  const K = stages.length;
  const totalYears = stages.reduce((a, s) => a + s.years, 0);
  const n0 = stages[0].n;
  const dotsAt = (n: number) => Math.max(1, Math.round(1 + 39 * Math.log(Math.max(n, 1)) / Math.log(n0)));
  // each dot gets the stage index at which it drops out (K = survives to approval)
  const dots = useMemo(() => {
    const r = rng(7);
    const counts = stages.map((s) => dotsAt(s.n));
    const out: { die: number; jx: number; delay: number }[] = [];
    for (let i = 0; i < counts[0]; i++) {
      let die = K;
      for (let k = 1; k < K; k++) if (i >= counts[k]) { die = k - 1; break; }
      if (die === K && i > 0) die = K - 1; // only one approval
      out.push({ die, jx: r.u() * 2 - 1, delay: r.u() * 0.15 });
    }
    return out;
  }, [stages]);
  const cycle = 9; // seconds per animation loop
  useFrame((dt) => setT((v) => (v + dt) % (cycle + 2)), running);

  const top = 12, rowH = 26, W = 320;
  const cx = 150;
  const halfW = (n: number) => 14 + 100 * Math.log10(Math.max(n, 1)) / Math.log10(n0);
  const p = Math.min(1, t / cycle); // progress through pipeline
  const yearsDone = p * totalYears;
  let acc = 0; let cur = 0;
  for (let k = 0; k < K; k++) { if (yearsDone >= acc) cur = k; acc += stages[k].years; }
  const stageStart = (k: number) => stages.slice(0, k).reduce((a, s) => a + s.years, 0) / totalYears;
  const costSoFar = stages.reduce((a, s, k) => a + s.cost * Math.max(0, Math.min(1, (p - stageStart(k)) / (s.years / totalYears))), 0);
  const H = top + rowH * K + 34;
  const info = sel !== null ? stages[sel] : null;

  return (
    <div>
      <Stage w={W} h={H} label="Drug discovery attrition funnel">
        {stages.map((s, k) => {
          const y = top + k * rowH;
          const w = halfW(s.n);
          const active = k === cur && p < 1;
          return (
            <g key={k} onClick={() => setSel(k)} style={{ cursor: 'pointer' }}>
              <rect x={cx - w} y={y} width={2 * w} height={rowH - 4} rx={6}
                fill={C[k % 6]} opacity={sel === k ? 0.55 : active ? 0.4 : 0.2} stroke={sel === k ? 'var(--fg)' : 'none'} strokeWidth={1} />
              <text x={cx} y={y + 15} textAnchor="middle" fontSize="9" fontWeight={700} fill="var(--fg)">
                {s.name.split(' (')[0]}
              </text>
              <text x={cx + 118} y={y + 10} fontSize="8.5" fill="var(--fg)" fontWeight={700}>
                {s.n >= 10 ? s.n.toLocaleString() : s.n.toFixed(s.n % 1 ? 1 : 0)}
              </text>
              <text x={cx + 118} y={y + 19} fontSize="7.5" fill="var(--muted)">{s.years} yr</text>
            </g>
          );
        })}
        <text x={cx} y={top + K * rowH + 8} textAnchor="middle" fontSize="10" fontWeight={800} fill="var(--c1)">
          {p >= 1 ? '✓ 1 approved drug' : '…'}
        </text>
        {dots.map((d, i) => {
          // dot's own progress, lagging a little for a stream effect
          const q = Math.max(0, Math.min(1, (p - d.delay) / (1 - d.delay)));
          const stageF = q * K; // continuous stage coordinate
          const k = Math.min(K - 1, Math.floor(stageF));
          const dead = d.die < K && stageF > d.die + 0.85;
          const sk = Math.min(stageF, d.die + 0.85);
          const yy = top + sk * rowH + 8;
          const kk = Math.min(K - 1, Math.floor(sk));
          const w = halfW(stages[kk].n) - 6;
          const fall = dead ? (stageF - d.die - 0.85) * 60 : 0;
          if (q <= 0) return null;
          const x = cx + d.jx * w + (dead ? Math.sign(d.jx || 1) * fall : 0);
          return (
            <circle key={i} cx={x} cy={yy + fall * 0.3} r={i === 0 && q >= 1 ? 4 : 2.2}
              fill={dead ? 'var(--c5)' : i === 0 && k === K - 1 && q >= 1 ? 'var(--c1)' : 'var(--fg)'}
              opacity={dead ? Math.max(0, 1 - fall / 40) : 0.85} />
          );
        })}
        <text x={6} y={H - 14} fontSize="9" fill="var(--fg)" fontWeight={700}>
          ⏱ {yearsDone.toFixed(1)} yr
        </text>
        <text x={6} y={H - 3} fontSize="9" fill="var(--fg)" fontWeight={700}>
          💵 ~${(costSoFar / 1000).toFixed(2)} B spent (out-of-pocket)
        </text>
        <text x={W - 4} y={H - 3} fontSize="7.5" textAnchor="end" fill="var(--muted)">dots log-scaled</text>
      </Stage>
      <div className="w-muted" style={{ minHeight: 34 }}>
        {info ? <span><b>{info.name}</b> — {info.n.toLocaleString()} entering · ~{info.years} yr · ~${info.cost}M{info.note ? ` · ${info.note}` : ''}</span>
          : 'Tap a stage for details. Red dots are candidates that fail.'}
      </div>
      <Controls>
        <PlayPause running={running} set={setRunning} />
        <Btn onClick={() => setT(0)}>↺ Restart</Btn>
      </Controls>
    </div>
  );
}
