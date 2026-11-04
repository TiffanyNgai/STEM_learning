import { useMemo, useState } from 'react';
import { Btn, C, Controls, Slider, Stage, pathOf, rng, scale } from './_kit';

/**
 * Two-objective optimisation over a toy compound series: potency (pIC50, higher better) against
 * aqueous solubility (log S, higher better), which trade off because potency is often bought with
 * lipophilicity. Open rings = dominated compounds; filled dots joined by the staircase = the Pareto
 * front (no other compound is better on both axes). The slider sets the weight w in the geometric-mean
 * desirability D = d_pot^w · d_sol^(1−w), with linear desirability ramps d_pot = (pIC50 − 5)/3 and
 * d_sol = (log S + 6)/3, both clipped to [0, 1]. The ★ is the compound with the highest D: sliding w
 * walks it along the front, and no dominated compound ever wins. "Cut-offs" instead applies hard
 * filters (pIC50 ≥ 7 and log S ≥ −5) and shows how many compounds survive.
 * props: { n?: number (default 60), weight?: number (0–1, default 0.5), cutoffs?: boolean (default false),
 *          seed?: number (default 11) }
 */
export default function DrugParetoFront({ n = 60, weight = 0.5, cutoffs = false, seed = 11 }: {
  n?: number; weight?: number; cutoffs?: boolean; seed?: number;
}) {
  const [w, setW] = useState(Math.max(0, Math.min(1, weight)));
  const [cut, setCut] = useState(cutoffs);
  const N = Math.max(15, Math.min(150, Math.round(n)));

  const pts = useMemo(() => {
    const g = rng(seed);
    return Array.from({ length: N }, (_, i) => {
      const p = 4.6 + 4.7 * g.u();
      const s = -2.3 - 0.52 * (p - 4.6) + 0.75 * g.normal();
      return { i, p, s: Math.max(-7.4, Math.min(-1.8, s)) };
    });
  }, [N, seed]);

  const front = useMemo(() => {
    const sorted = [...pts].sort((a, b) => b.p - a.p);
    const out: typeof pts = []; let best = -Infinity;
    for (const q of sorted) if (q.s > best) { out.push(q); best = q.s; }
    return out;
  }, [pts]);
  const onFront = new Set(front.map((q) => q.i));

  const dPot = (p: number) => Math.max(0, Math.min(1, (p - 5) / 3));
  const dSol = (s: number) => Math.max(0, Math.min(1, (s + 6) / 3));
  const D = (q: { p: number; s: number }) => Math.pow(dPot(q.p), w) * Math.pow(dSol(q.s), 1 - w);
  const win = pts.reduce((a, b) => (D(b) > D(a) ? b : a), pts[0]);
  const survivors = pts.filter((q) => q.p >= 7 && q.s >= -5);

  const L = 34, R = 232, T = 14, B = 132;
  const sx = scale([4.4, 9.6], [L, R]);
  const sy = scale([-7.6, -1.6], [B, T]);
  const stair: [number, number][] = [];
  [...front].sort((a, b) => a.p - b.p).forEach((q, k, arr) => {
    if (k === 0) stair.push([sx(q.p), sy(-7.6)]);
    stair.push([sx(q.p), sy(q.s)]);
    if (k < arr.length - 1) stair.push([sx(arr[k + 1].p), sy(q.s)]);
  });

  return (
    <div>
      <Stage w={320} h={226} label={`Pareto front; at weight ${w.toFixed(2)} the best compound has pIC50 ${win.p.toFixed(1)}`}>
        {cut && <rect x={sx(7)} y={T} width={R - sx(7)} height={sy(-5) - T} fill={C[0]} opacity={0.12} />}
        {cut && <line x1={sx(7)} x2={sx(7)} y1={T} y2={B} stroke={C[0]} strokeWidth={1} strokeDasharray="3 2" />}
        {cut && <line x1={L} x2={R} y1={sy(-5)} y2={sy(-5)} stroke={C[0]} strokeWidth={1} strokeDasharray="3 2" />}
        <line x1={L} x2={R} y1={B} y2={B} stroke="var(--fg)" strokeWidth={0.8} />
        <line x1={L} x2={L} y1={T} y2={B} stroke="var(--fg)" strokeWidth={0.8} />
        {[5, 6, 7, 8, 9].map((v) => <text key={v} x={sx(v)} y={B + 9} fontSize="7" textAnchor="middle" fill="var(--muted)">{v}</text>)}
        {[-7, -6, -5, -4, -3, -2].map((v) => <text key={v} x={L - 3} y={sy(v) + 2.5} fontSize="7" textAnchor="end" fill="var(--muted)">{v}</text>)}
        <text x={R} y={B + 19} fontSize="7.5" textAnchor="end" fill="var(--fg)">potency pIC50 →</text>
        <text x={L - 2} y={T - 4} fontSize="7.5" fill="var(--fg)">log S ↑</text>
        <path d={pathOf(stair)} fill="none" stroke={C[1]} strokeWidth={1.2} strokeDasharray="4 2" opacity={0.8} />
        {pts.map((q) => (
          <circle key={q.i} cx={sx(q.p)} cy={sy(q.s)} r={onFront.has(q.i) ? 3.4 : 2.6}
            fill={onFront.has(q.i) ? C[1] : 'none'} stroke={onFront.has(q.i) ? C[1] : 'var(--muted)'} strokeWidth={1} />
        ))}
        <text x={sx(win.p)} y={sy(win.s) + 4.5} fontSize="14" textAnchor="middle" fill={C[2]}>★</text>
        <g fontSize="8">
          <text x={2} y={B + 34} fill="var(--fg)" fontWeight="bold">
            ★ pIC50 {win.p.toFixed(1)} · log S {win.s.toFixed(1)} · D = {D(win).toFixed(2)}
          </text>
          <text x={2} y={B + 46} fill="var(--muted)" fontSize="7.5">
            d_pot {dPot(win.p).toFixed(2)} (weight {w.toFixed(2)}) · d_sol {dSol(win.s).toFixed(2)} (weight {(1 - w).toFixed(2)})
          </text>
          <text x={2} y={B + 60} fill={C[1]}>{front.length} of {N} compounds are on the Pareto front</text>
          <text x={2} y={B + 74} fill={cut ? C[0] : 'var(--muted)'} fontSize="7.5">
            {cut ? `Hard cut-offs pIC50 ≥ 7 and log S ≥ −5 keep ${survivors.length} of ${N}.`
              : 'Slide the weight: the ★ walks along the front and never leaves it.'}
          </text>
          <text x={2} y={B + 86} fill="var(--muted)" fontSize="7.5">
            {w > 0.8 ? 'Potency-only: you pick an insoluble compound.'
              : w < 0.2 ? 'Solubility-only: you pick a weak binder.'
                : 'A balanced weight buys a compromise — which may suit neither purpose.'}
          </text>
        </g>
      </Stage>
      <Controls>
        <Slider label="weight w on potency" min={0} max={1} step={0.01} value={w} onChange={setW} />
        <Btn active={cut} onClick={() => setCut(!cut)}>cut-offs</Btn>
        <Btn onClick={() => { setW(Math.max(0, Math.min(1, weight))); setCut(cutoffs); }}>Reset</Btn>
      </Controls>
    </div>
  );
}
