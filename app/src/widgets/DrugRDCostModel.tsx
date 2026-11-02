import { useState } from 'react';
import { Btn, C, Controls, Slider, Stage } from './_kit';

interface CostStage { name: string; p: number; cost: number; years: number }
/**
 * R&D cost-per-approval model in the style of Paul et al. (2010).
 * For each stage i: p = probability a project passes the stage, cost = USD M spent per project in that stage,
 * years = duration. Projects needed in stage i per approval: n_i = 1 / (p_i · p_{i+1} · … · p_last).
 * Out-of-pocket cost per approval = Σ n_i · cost_i. Capitalised cost compounds each stage's spend at the
 * cost of capital r from the stage midpoint to launch: Σ n_i · cost_i · (1 + r)^τ_i.
 * Tap a row to select a stage, then drag its sliders.
 * props: { stages?: {name, p, cost, years}[]  (default: Paul et al. 2010 baseline, ≈ USD 0.87 B out-of-pocket),
 *          rate?: number (cost of capital, default 0.11), focus?: number (initially selected stage, default 5 = Phase II),
 *          showCapital?: boolean (default true) }
 */
const DEFAULT: CostStage[] = [
  { name: 'Target → hit', p: 0.8, cost: 1, years: 1 },
  { name: 'Hit → lead', p: 0.75, cost: 2.5, years: 1.5 },
  { name: 'Lead optimisation', p: 0.85, cost: 10, years: 2 },
  { name: 'Preclinical', p: 0.69, cost: 5, years: 1 },
  { name: 'Phase I', p: 0.54, cost: 15, years: 1.5 },
  { name: 'Phase II', p: 0.34, cost: 40, years: 2.5 },
  { name: 'Phase III', p: 0.7, cost: 150, years: 2.5 },
  { name: 'Submission', p: 0.91, cost: 40, years: 1.5 },
];

const fmtB = (m: number) => (m >= 1000 ? `${(m / 1000).toFixed(2)} B` : `${m.toFixed(0)} M`);

export default function DrugRDCostModel({ stages = DEFAULT, rate = 0.11, focus = 5, showCapital = true }: {
  stages?: CostStage[]; rate?: number; focus?: number; showCapital?: boolean;
}) {
  const [st, setSt] = useState<CostStage[]>(stages);
  const [sel, setSel] = useState(Math.min(Math.max(0, focus), stages.length - 1));
  const [r, setR] = useState(rate);
  const K = st.length;
  // projects needed per approval, from the last stage backwards
  const n: number[] = new Array(K);
  let acc = 1;
  for (let i = K - 1; i >= 0; i--) { acc /= Math.max(st[i].p, 1e-3); n[i] = acc; }
  // years from the midpoint of stage i to launch
  const tau = st.map((s, i) => s.years / 2 + st.slice(i + 1).reduce((a, x) => a + x.years, 0));
  const spend = st.map((s, i) => n[i] * s.cost);
  const total = spend.reduce((a, b) => a + b, 0);
  const capital = spend.reduce((a, c, i) => a + c * Math.pow(1 + r, tau[i]), 0);
  const iP1 = st.findIndex((s) => /phase i$/i.test(s.name));
  const pClin = iP1 >= 0 ? st.slice(iP1).reduce((a, s) => a * s.p, 1) : NaN;
  const maxSpend = Math.max(...spend, 1);

  const top = 22, rowH = 19, W = 320, H = top + rowH * K + 6;
  const barX = 132, barW = 140;
  const upd = (k: keyof CostStage, v: number) => setSt((old) => old.map((s, i) => (i === sel ? { ...s, [k]: v } : s)));

  return (
    <div>
      <Stage w={W} h={H} label="Cost per approved drug by stage">
        <g fontSize="8" fill="var(--muted)">
          <text x={4} y={12}>stage (p pass)</text>
          <text x={128} y={12} textAnchor="end">projects</text>
          <text x={barX} y={12}>spend per approval (USD)</text>
        </g>
        {st.map((s, i) => {
          const y = top + i * rowH;
          const w = (barW * spend[i]) / maxSpend;
          const on = i === sel;
          return (
            <g key={i} onClick={() => setSel(i)} style={{ cursor: 'pointer' }}>
              <rect x={1} y={y - 1} width={W - 2} height={rowH - 2} rx={4} fill={on ? 'var(--grid)' : 'transparent'} opacity={on ? 0.6 : 1} />
              <text x={4} y={y + 11} fontSize="8.5" fill="var(--fg)" fontWeight={on ? 800 : 500}>
                {s.name} <tspan fill="var(--muted)">({Math.round(s.p * 100)}%)</tspan>
              </text>
              <text x={128} y={y + 11} fontSize="8.5" textAnchor="end" fill="var(--fg)">{n[i] >= 10 ? n[i].toFixed(0) : n[i].toFixed(1)}</text>
              <rect x={barX} y={y + 3} width={Math.max(1, w)} height={rowH - 8} rx={3} fill={C[i % 6]} opacity={0.8} />
              <text x={barX + w + 3} y={y + 11} fontSize="8" fill="var(--fg)">{fmtB(spend[i])}</text>
            </g>
          );
        })}
      </Stage>
      <div className="w-muted" style={{ fontSize: '0.9em' }}>
        <b>Out-of-pocket per approval: USD {fmtB(total)}</b>
        {showCapital && <> · <b>capitalised at {(r * 100).toFixed(1)}%: USD {fmtB(capital)}</b></>}
        {Number.isFinite(pClin) && <> · P(Phase I → approval) = {(pClin * 100).toFixed(1)}%</>}
      </div>
      <Controls>
        <Slider label={`${st[sel].name}: p`} value={st[sel].p} min={0.05} max={1} step={0.01} onChange={(v) => upd('p', v)} format={(v) => `${Math.round(v * 100)}%`} />
        <Slider label="cost/project" value={st[sel].cost} min={0.5} max={300} step={0.5} onChange={(v) => upd('cost', v)} format={(v) => `$${v}M`} />
        {showCapital && <Slider label="cost of capital" value={r} min={0} max={0.15} step={0.005} onChange={setR} format={(v) => `${(v * 100).toFixed(1)}%`} />}
        <Btn onClick={() => { setSt(stages); setR(rate); }}>↺ Reset</Btn>
      </Controls>
    </div>
  );
}
