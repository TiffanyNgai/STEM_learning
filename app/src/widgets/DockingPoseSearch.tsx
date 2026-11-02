import { useMemo, useRef, useState } from 'react';
import { Btn, Controls, PlayPause, Slider, Stage, pathOf, rng, useFrame } from './_kit';

/**
 * Toy 2D docking: a rigid 5-atom ligand is searched over (x, y, θ) inside a pocket by Monte Carlo
 * simulated annealing with restarts, scored by a Vina-like empirical function (steric gauss + repulsion
 * + hydrophobic + H-bond terms). Faded = current pose, solid = best pose so far. Pause to move the ligand
 * yourself with sliders and watch the score respond.
 * Atom types: H hydrophobic (orange), D H-bond donor (blue), A H-bond acceptor (red), C neutral (grey).
 * props: { seed?: number, autoRun?: boolean (default false), stepsPerFrame?: number (default 3), showTerms?: boolean (default true) }
 */
type T = 'H' | 'D' | 'A' | 'C';
interface P { x: number; y: number; th: number }
const RR = 12, RL = 8, CX = 160, CY = 104, ARC = 52;
const RES_T: T[] = ['C', 'C', 'A', 'C', 'H', 'H', 'H', 'H', 'C', 'C', 'D', 'C', 'C'];
const RES = RES_T.map((t, i) => { const a = ((-30 + 20 * i) * Math.PI) / 180; return { x: CX + ARC * Math.cos(a), y: CY + ARC * Math.sin(a), t }; });
const LIG: { dx: number; dy: number; t: T }[] = [
  { dx: -30, dy: -6, t: 'A' }, { dx: -14, dy: -2, t: 'C' }, { dx: 0, dy: 20, t: 'H' }, { dx: 14, dy: -2, t: 'C' }, { dx: 30, dy: -6, t: 'D' }];
const LBONDS = [[0, 1], [1, 2], [2, 3], [3, 4]];
const COL: Record<T, string> = { H: 'var(--c3)', D: 'var(--c2)', A: 'var(--c5)', C: 'var(--muted)' };
const place = (p: P) => LIG.map((a) => ({ t: a.t, x: p.x + a.dx * Math.cos(p.th) - a.dy * Math.sin(p.th), y: p.y + a.dx * Math.sin(p.th) + a.dy * Math.cos(p.th) }));

function score(p: P) {
  let steric = 0, rep = 0, hyd = 0, hb = 0, clash = 0;
  for (const l of place(p)) for (const r of RES) {
    const d = Math.hypot(l.x - r.x, l.y - r.y) - (RL + RR); // surface distance (px)
    if (d > 20) continue;
    steric += Math.exp(-((d / 6) ** 2));
    if (d < 0) rep += d * d;
    if (l.t === 'H' && r.t === 'H') hyd += d < 3 ? 1 : d < 10 ? (10 - d) / 7 : 0;
    const pair = (l.t === 'D' && r.t === 'A') || (l.t === 'A' && r.t === 'D');
    if (pair) hb += d < 1 ? 1 : d < 8 ? (8 - d) / 7 : 0;
    if ((l.t === 'D' && r.t === 'D') || (l.t === 'A' && r.t === 'A')) clash += d < 6 ? 1 : 0;
  }
  const terms = { steric: -0.3 * steric, repulsion: 0.06 * rep, hydrophobic: -0.7 * hyd, hbond: -2 * hb, mismatch: 1.2 * clash };
  return { total: terms.steric + terms.repulsion + terms.hydrophobic + terms.hbond + terms.mismatch, terms };
}
const START: P = { x: 160, y: 22, th: 0.6 };
const clampP = (p: P): P => ({ x: Math.min(300, Math.max(20, p.x)), y: Math.min(165, Math.max(14, p.y)), th: ((p.th % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI) });

export default function DockingPoseSearch({ seed = 2, autoRun = false, stepsPerFrame = 3, showTerms = true }: {
  seed?: number; autoRun?: boolean; stepsPerFrame?: number; showTerms?: boolean;
}) {
  const [running, setRunning] = useState(autoRun);
  const [, force] = useState(0);
  const st = useRef({ cur: START, curS: score(START).total, best: START, bestS: score(START).total, step: 0, sinceRestart: 0, hist: [] as [number, number][] });
  const r = useMemo(() => rng(seed), [seed]);
  const reset = () => { const s0 = score(START).total; st.current = { cur: START, curS: s0, best: START, bestS: s0, step: 0, sinceRestart: 0, hist: [] }; force((v) => v + 1); };

  useFrame(() => {
    const s = st.current;
    for (let k = 0; k < stepsPerFrame; k++) {
      if (s.sinceRestart > 260) { // random restart
        s.cur = clampP({ x: 60 + 200 * r.u(), y: 20 + 130 * r.u(), th: 2 * Math.PI * r.u() }); s.curS = score(s.cur).total; s.sinceRestart = 0;
      }
      const T = 2.5 * Math.exp(-s.sinceRestart / 70) + 0.05; // annealing schedule
      const prop = clampP({ x: s.cur.x + 6 * r.normal(), y: s.cur.y + 6 * r.normal(), th: s.cur.th + 0.25 * r.normal() });
      const ps = score(prop).total;
      if (ps < s.curS || r.u() < Math.exp(-(ps - s.curS) / T)) { s.cur = prop; s.curS = ps; }
      if (s.curS < s.bestS) { s.best = s.cur; s.bestS = s.curS; }
      s.step++; s.sinceRestart++;
      if (s.step % 4 === 0) { s.hist.push([s.curS, s.bestS]); if (s.hist.length > 140) s.hist.shift(); }
    }
    force((v) => v + 1);
  }, running);

  const s = st.current;
  const bestTerms = score(s.best).terms;
  const setPose = (patch: Partial<P>) => { const p = clampP({ ...s.cur, ...patch }); s.cur = p; s.curS = score(p).total; if (s.curS < s.bestS) { s.best = p; s.bestS = s.curS; } force((v) => v + 1); };
  const drawLig = (p: P, op: number, key: string) => {
    const at = place(p);
    return (
      <g key={key} opacity={op}>
        {LBONDS.map(([a, b], i) => <line key={i} x1={at[a].x} y1={at[a].y} x2={at[b].x} y2={at[b].y} stroke="var(--fg)" strokeWidth={2} />)}
        {at.map((a, i) => <circle key={i} cx={a.x} cy={a.y} r={RL} fill={COL[a.t]} stroke="var(--fg)" strokeWidth={0.8} />)}
        {at.map((a, i) => <text key={'t' + i} x={a.x} y={a.y + 3} textAnchor="middle" fontSize="8" fontWeight={800} fill="var(--surface, #fff)">{a.t}</text>)}
      </g>
    );
  };
  const bestAt = place(s.best);
  const hbLines = bestAt.flatMap((l, i) => RES.filter((q) => ((l.t === 'D' && q.t === 'A') || (l.t === 'A' && q.t === 'D')) && Math.hypot(l.x - q.x, l.y - q.y) < RL + RR + 6)
    .map((q, j) => <line key={`${i}-${j}`} x1={l.x} y1={l.y} x2={q.x} y2={q.y} stroke="var(--c1)" strokeWidth={2} strokeDasharray="3 2" />));
  const hy = (v: number) => 236 - Math.max(0, Math.min(1, (v + 8) / 12)) * 34;

  return (
    <div>
      <Stage w={320} h={244} label="Toy docking pose search">
        {RES.map((q, i) => <circle key={i} cx={q.x} cy={q.y} r={RR} fill={COL[q.t]} opacity={q.t === 'C' ? 0.35 : 0.75} />)}
        {RES.map((q, i) => q.t !== 'C' && <text key={'r' + i} x={q.x} y={q.y + 3} textAnchor="middle" fontSize="8" fontWeight={800} fill="var(--surface, #fff)">{q.t}</text>)}
        <text x={CX} y={CY + ARC + 24} textAnchor="middle" fontSize="8" fill="var(--muted)">protein pocket</text>
        {drawLig(s.cur, 0.3, 'cur')}
        {drawLig(s.best, 1, 'best')}
        {hbLines}
        <text x={6} y={12} fontSize="9" fontWeight={800} fill="var(--fg)">best score {s.bestS.toFixed(2)}</text>
        <text x={6} y={23} fontSize="8.5" fill="var(--muted)">current {s.curS.toFixed(2)} · step {s.step}</text>
        {showTerms && (['steric', 'repulsion', 'hydrophobic', 'hbond', 'mismatch'] as const).map((k, i) => (
          <text key={k} x={314} y={12 + i * 10} fontSize="8" textAnchor="end" fill="var(--muted)">{k} {bestTerms[k].toFixed(2)}</text>
        ))}
        <rect x={6} y={200} width={308} height={38} fill="none" stroke="var(--grid)" />
        {s.hist.length > 1 && <path d={pathOf(s.hist.map(([c], i) => [8 + i * 2.2, hy(c)]))} fill="none" stroke="var(--c2)" strokeWidth={1} opacity={0.6} />}
        {s.hist.length > 1 && <path d={pathOf(s.hist.map(([, b], i) => [8 + i * 2.2, hy(b)]))} fill="none" stroke="var(--c1)" strokeWidth={2} />}
        <text x={310} y={209} textAnchor="end" fontSize="7.5" fill="var(--muted)">score vs step (lower = better)</text>
      </Stage>
      <Controls>
        <PlayPause running={running} set={setRunning} />
        <Btn onClick={reset}>↺ Reset</Btn>
      </Controls>
      {!running && (
        <Controls>
          <Slider label="x" min={20} max={300} step={1} value={s.cur.x} onChange={(v) => setPose({ x: v })} />
          <Slider label="y" min={14} max={165} step={1} value={s.cur.y} onChange={(v) => setPose({ y: v })} />
          <Slider label="θ" min={0} max={6.28} step={0.01} value={s.cur.th} onChange={(v) => setPose({ th: v })} format={(v) => `${Math.round((v * 180) / Math.PI)}°`} />
        </Controls>
      )}
    </div>
  );
}
