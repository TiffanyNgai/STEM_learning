import { useMemo, useRef, useState } from 'react';
import { Btn, C, Controls, PlayPause, Slider, Stage, pathOf, prefersReducedMotion, rng, scale, useFrame } from './_kit';

/**
 * Central Limit Theorem sampler. Top: the population's distribution, with the current
 * sample of n values dropped onto it (dots) and its mean (tick). Bottom: histogram of
 * all sample means collected so far, with the normal curve N(mu, sigma^2/n) the CLT predicts.
 * props: { population?: 'uniform'|'exponential'|'bimodal'|'dice' (default 'exponential'),
 *          n?: number (sample size, default 5), maxN?: number (slider max, default 50),
 *          showNormal?: boolean (overlay CLT curve, default true), choosePopulation?: boolean (default true) }
 */
type Pop = 'uniform' | 'exponential' | 'bimodal' | 'dice';
interface PopDef { label: string; lo: number; hi: number; mu: number; sd: number; draw: (r: ReturnType<typeof rng>) => number; pdf: (x: number) => number; discrete?: boolean }
const npdf = (x: number, m: number, s: number) => Math.exp(-0.5 * ((x - m) / s) ** 2) / (s * Math.sqrt(2 * Math.PI));
const POPS: Record<Pop, PopDef> = {
  uniform: { label: 'Uniform', lo: 0, hi: 10, mu: 5, sd: 10 / Math.sqrt(12), draw: (r) => 10 * r.u(), pdf: (x) => (x >= 0 && x <= 10 ? 0.1 : 0) },
  exponential: { label: 'Skewed', lo: 0, hi: 10, mu: 2, sd: 2, draw: (r) => -2 * Math.log(1 - r.u()), pdf: (x) => (x < 0 ? 0 : Math.exp(-x / 2) / 2) },
  bimodal: {
    label: 'Two humps', lo: 0, hi: 10, mu: 5, sd: Math.sqrt(0.64 + 9),
    draw: (r) => (r.u() < 0.5 ? 2 : 8) + 0.8 * r.normal(), pdf: (x) => 0.5 * npdf(x, 2, 0.8) + 0.5 * npdf(x, 8, 0.8),
  },
  dice: { label: 'Die', lo: 0.5, hi: 6.5, mu: 3.5, sd: Math.sqrt(35 / 12), draw: (r) => 1 + Math.floor(6 * r.u()), pdf: (x) => (Math.abs(x - Math.round(x)) < 0.25 && x > 0.5 && x < 6.5 ? 1 / 6 : 0), discrete: true },
};
const BINS = 40;

export default function CLTSampler({ population = 'exponential', n: n0 = 5, maxN = 50, showNormal = true, choosePopulation = true }: {
  population?: Pop; n?: number; maxN?: number; showNormal?: boolean; choosePopulation?: boolean;
}) {
  const [pop, setPop] = useState<Pop>(POPS[population] ? population : 'exponential');
  const [n, setN] = useState(n0);
  const [running, setRunning] = useState(!prefersReducedMotion());
  const [fast, setFast] = useState(false);
  const [overlay, setOverlay] = useState(showNormal);
  const r = useRef(rng(11));
  const st = useRef({ counts: [] as number[], total: 0, sample: [] as number[], mean: NaN, acc: 0 });
  const [, force] = useState(0);
  const P = POPS[pop];
  // histogram binning; for the die, one bin per attainable mean value k/n so bars don't alias
  const H = P.discrete ? { lo: 1 - 0.5 / n, bw: 1 / n, nb: 5 * n + 1 } : { lo: P.lo, bw: (P.hi - P.lo) / BINS, nb: BINS };
  const reset = () => { st.current = { counts: [], total: 0, sample: [], mean: NaN, acc: 0 }; force((v) => v + 1); };
  const drawOne = () => {
    const s = Array.from({ length: n }, () => P.draw(r.current));
    const m = s.reduce((a, b) => a + b, 0) / n;
    const b = Math.floor((m - H.lo) / H.bw + 1e-9);
    if (b >= 0 && b < H.nb) st.current.counts[b] = (st.current.counts[b] ?? 0) + 1;
    st.current.total++; st.current.sample = s; st.current.mean = m;
  };
  useFrame((dt) => {
    const S = st.current;
    S.acc += dt;
    if (fast) { for (let k = 0; k < 25; k++) drawOne(); force((v) => v + 1); }
    else if (S.acc > 0.25) { S.acc = 0; drawOne(); force((v) => v + 1); }
  }, running);

  const sx = scale([P.lo, P.hi], [20, 310]);
  // population panel (y 18..72)
  const popPath = useMemo(() => {
    const ymax = Math.max(...Array.from({ length: 200 }, (_, i) => P.pdf(P.lo + ((P.hi - P.lo) * i) / 199))) * 1.15;
    const sy = scale([0, ymax], [72, 18]);
    if (P.discrete) return [1, 2, 3, 4, 5, 6].map((k) => `M${sx(k - 0.3)},72L${sx(k - 0.3)},${sy(1 / 6)}L${sx(k + 0.3)},${sy(1 / 6)}L${sx(k + 0.3)},72Z`).join('');
    const pts: [number, number][] = [[sx(P.lo), 72]];
    for (let i = 0; i <= 200; i++) { const x = P.lo + ((P.hi - P.lo) * i) / 200; pts.push([sx(x), sy(P.pdf(x))]); }
    pts.push([sx(P.hi), 72]);
    return pathOf(pts) + 'Z';
  }, [pop]);
  // histogram panel (y 100..215)
  const S = st.current;
  const bw = H.bw;
  const se = P.sd / Math.sqrt(n);
  const peak = S.total * bw * npdf(P.mu, P.mu, se);
  const hmax = Math.max(1, ...S.counts.filter((c) => c > 0), overlay ? peak : 0) * 1.1;
  const hy = scale([0, hmax], [215, 100]);
  const curve: [number, number][] = [];
  for (let i = 0; i <= 240; i++) { const x = P.lo + ((P.hi - P.lo) * i) / 240; curve.push([sx(x), hy(S.total * bw * npdf(x, P.mu, se))]); }
  const meanX = Number.isFinite(S.mean) ? sx(S.mean) : -10;

  return (
    <div>
      <Stage w={320} h={232} label="Central limit theorem: sample means from a population">
        <text x={20} y={11} fontSize="9" fill="var(--muted)">Population ({P.label}) — mean μ = {+P.mu.toFixed(2)}, sd σ = {P.sd.toFixed(2)}</text>
        <path d={popPath} fill={C[1]} opacity={0.25} stroke={C[1]} strokeWidth={1} />
        <line x1={20} x2={310} y1={72} y2={72} stroke="var(--fg)" strokeWidth={0.8} />
        {S.sample.slice(0, 60).map((v, i) => (
          <circle key={i} cx={sx(v)} cy={66 - (i % 6) * 4} r={2} fill={C[2]} opacity={0.9} />
        ))}
        <line x1={meanX} x2={meanX} y1={14} y2={80} stroke={C[4]} strokeWidth={2} />
        <path d={`M${meanX},80 l-4,6 h8z`} fill={C[4]} />
        <text x={20} y={95} fontSize="9" fill="var(--muted)">Means of {S.total} samples, each of size n = {n}</text>
        {S.counts.map((c, i) => (
          <rect key={i} x={sx(H.lo + i * bw) + 0.2} width={Math.max(0.3, sx(P.lo + bw) - sx(P.lo) - 0.4)} y={hy(c)} height={215 - hy(c)} fill={C[4]} opacity={0.75} />
        ))}
        {overlay && S.total > 0 && <path d={pathOf(curve)} fill="none" stroke={C[0]} strokeWidth={2} />}
        <line x1={20} x2={310} y1={215} y2={215} stroke="var(--fg)" strokeWidth={0.8} />
        {[0, 0.25, 0.5, 0.75, 1].map((f) => { const v = P.lo + f * (P.hi - P.lo); return <text key={f} x={sx(v)} y={226} fontSize="8" textAnchor="middle" fill="var(--muted)">{+v.toFixed(1)}</text>; })}
        {overlay && <text x={310} y={108} fontSize="9" textAnchor="end" fill={C[0]}>CLT: N(μ, σ²/n), sd = {se.toFixed(2)}</text>}
      </Stage>
      <Controls>
        {choosePopulation && (Object.keys(POPS) as Pop[]).map((k) => <Btn key={k} active={k === pop} onClick={() => { setPop(k); reset(); }}>{POPS[k].label}</Btn>)}
        <Slider label="n" min={1} max={maxN} step={1} value={n} onChange={(v) => { setN(v); reset(); }} format={(v) => String(v)} />
        <PlayPause running={running} set={setRunning} />
        <Btn active={fast} onClick={() => setFast(!fast)}>⏩ Fast</Btn>
        <Btn active={overlay} onClick={() => setOverlay(!overlay)}>Normal curve</Btn>
        <Btn onClick={reset}>Reset</Btn>
      </Controls>
    </div>
  );
}
