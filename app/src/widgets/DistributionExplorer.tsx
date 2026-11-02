import { useState } from 'react';
import { Btn, C, Controls, Slider, Stage, pathOf, scale } from './_kit';

/**
 * Explore a probability distribution: pdf/pmf or cdf, parameter sliders, and the shaded
 * probability P(a ≤ X ≤ b) between two draggable bounds. Mean (▲) and ±1 sd are marked.
 * props: { dist?: 'normal'|'exponential'|'uniform'|'binomial'|'poisson' (initial, default 'normal'),
 *          dists?: string[] (which buttons to offer; default [dist]), mode?: 'pdf'|'cdf' (default 'pdf'),
 *          a?: number, b?: number (initial bounds; default mean ± 1 sd), params?: Record<string, number> (initial values) }
 */
type Name = 'normal' | 'exponential' | 'uniform' | 'binomial' | 'poisson';
interface P { name: string; label: string; min: number; max: number; step: number; value: number }
interface Def {
  label: string; discrete?: boolean; params: P[];
  x: (v: Record<string, number>) => [number, number]; ymax?: number;
  f: (x: number, v: Record<string, number>) => number; mean: (v: Record<string, number>) => number; sd: (v: Record<string, number>) => number;
}
const lgamma = (z: number): number => { // Lanczos approximation, z > 0
  const g = [676.5203681218851, -1259.1392167224028, 771.32342877765313, -176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7];
  if (z < 0.5) return Math.log(Math.PI / Math.abs(Math.sin(Math.PI * z))) - lgamma(1 - z);
  z -= 1; let a = 0.99999999999980993; const t = z + 7.5;
  g.forEach((c, i) => { a += c / (z + i + 1); });
  return 0.5 * Math.log(2 * Math.PI) + (z + 0.5) * Math.log(t) - t + Math.log(a);
};
const DEFS: Record<Name, Def> = {
  normal: {
    label: 'Normal', params: [{ name: 'mu', label: 'μ', min: -3, max: 3, step: 0.1, value: 0 }, { name: 'sigma', label: 'σ', min: 0.5, max: 3, step: 0.05, value: 1 }],
    x: () => [-7, 7], ymax: 0.85, f: (x, v) => Math.exp(-0.5 * ((x - v.mu) / v.sigma) ** 2) / (v.sigma * Math.sqrt(2 * Math.PI)), mean: (v) => v.mu, sd: (v) => v.sigma,
  },
  exponential: {
    label: 'Exponential', params: [{ name: 'lambda', label: 'λ (rate)', min: 0.2, max: 2, step: 0.05, value: 1 }],
    x: () => [0, 8], ymax: 2.1, f: (x, v) => (x < 0 ? 0 : v.lambda * Math.exp(-v.lambda * x)), mean: (v) => 1 / v.lambda, sd: (v) => 1 / v.lambda,
  },
  uniform: {
    label: 'Uniform', params: [{ name: 'lo', label: 'low', min: -4, max: 2, step: 0.1, value: 0 }, { name: 'w', label: 'width', min: 0.5, max: 6, step: 0.1, value: 2 }],
    x: () => [-5, 9], ymax: 2.1, f: (x, v) => (x >= v.lo && x <= v.lo + v.w ? 1 / v.w : 0), mean: (v) => v.lo + v.w / 2, sd: (v) => v.w / Math.sqrt(12),
  },
  binomial: {
    label: 'Binomial', discrete: true, params: [{ name: 'n', label: 'n', min: 1, max: 40, step: 1, value: 10 }, { name: 'p', label: 'p', min: 0.01, max: 0.99, step: 0.01, value: 0.5 }],
    x: (v) => [-0.5, v.n + 0.5],
    f: (k, v) => (k < 0 || k > v.n ? 0 : Math.exp(lgamma(v.n + 1) - lgamma(k + 1) - lgamma(v.n - k + 1) + k * Math.log(v.p) + (v.n - k) * Math.log(1 - v.p))),
    mean: (v) => v.n * v.p, sd: (v) => Math.sqrt(v.n * v.p * (1 - v.p)),
  },
  poisson: {
    label: 'Poisson', discrete: true, params: [{ name: 'lambda', label: 'λ (mean)', min: 0.5, max: 20, step: 0.1, value: 3 }],
    x: () => [-0.5, 30.5], f: (k, v) => (k < 0 ? 0 : Math.exp(k * Math.log(v.lambda) - v.lambda - lgamma(k + 1))), mean: (v) => v.lambda, sd: (v) => Math.sqrt(v.lambda),
  },
};

export default function DistributionExplorer({ dist = 'normal', dists, mode = 'pdf', a, b, params = {} }: {
  dist?: Name; dists?: Name[]; mode?: 'pdf' | 'cdf'; a?: number; b?: number; params?: Record<string, number>;
}) {
  const init = (d: Name) => Object.fromEntries(DEFS[d].params.map((p) => [p.name, params[p.name] ?? p.value]));
  const start: Name = DEFS[dist] ? dist : 'normal';
  const [d, setD] = useState<Name>(start);
  const [v, setV] = useState<Record<string, number>>(() => init(start));
  const [m, setM] = useState(mode);
  const D = DEFS[d];
  const mu = D.mean(v), sd = D.sd(v);
  const rnd = (def: Def, x: number) => (def.discrete ? Math.max(0, Math.round(x)) : +x.toFixed(1));
  const [lo, setLo] = useState(a ?? rnd(D, mu - sd));
  const [hi, setHi] = useState(b ?? rnd(D, mu + sd));
  const choose = (k: Name) => { const nv = init(k); setD(k); setV(nv); const m2 = DEFS[k].mean(nv), s2 = DEFS[k].sd(nv); setLo(rnd(DEFS[k], m2 - s2)); setHi(rnd(DEFS[k], m2 + s2)); };

  const xr = D.x(v);
  const box = [30, 10, 312, 172] as const;
  const sx = scale(xr, [box[0], box[2]]);
  const A = Math.min(lo, hi), B = Math.max(lo, hi);
  // grid of pdf values and running cdf
  const G = 400; const xs: number[] = []; const ps: number[] = []; const cs: number[] = [];
  let prob = 0;
  if (D.discrete) {
    let acc = 0;
    for (let k = 0; k <= Math.floor(xr[1]); k++) { const pk = D.f(k, v); xs.push(k); ps.push(pk); acc += pk; cs.push(acc); if (k >= Math.ceil(A) && k <= Math.floor(B)) prob += pk; }
  } else {
    const lo0 = Math.min(xr[0], mu - 8 * sd); let acc = 0; let prev = D.f(lo0, v); const h0 = (xr[0] - lo0) / 200;
    for (let i = 1; i <= 200; i++) { const f = D.f(lo0 + i * h0, v); acc += 0.5 * (prev + f) * h0; prev = f; } // mass left of plot
    for (let i = 0; i <= G; i++) {
      const x = xr[0] + ((xr[1] - xr[0]) * i) / G; const f = D.f(x, v);
      if (i > 0) acc += 0.5 * (ps[i - 1] + f) * ((xr[1] - xr[0]) / G);
      xs.push(x); ps.push(f); cs.push(Math.min(1, acc));
    }
    const cdfAt = (x: number) => { const t = Math.max(0, Math.min(G, ((x - xr[0]) / (xr[1] - xr[0])) * G)); const i = Math.floor(t); return i >= G ? cs[G] : cs[i] + (cs[i + 1] - cs[i]) * (t - i); };
    prob = cdfAt(B) - cdfAt(A);
  }
  const yTop = m === 'cdf' ? 1.05 : D.ymax ?? Math.max(...ps) * 1.15;
  const sy = scale([0, yTop], [box[3], box[1]]);
  const ys = m === 'cdf' ? cs : ps;
  const inAB = (x: number) => x >= A - 1e-9 && x <= B + 1e-9;
  let shape: JSX.Element[] = [];
  if (D.discrete) {
    const w = Math.max(1, (sx(1) - sx(0)) * 0.7);
    shape = xs.map((k, i) => <rect key={k} x={sx(k) - w / 2} width={w} y={sy(ys[i])} height={Math.max(0, box[3] - sy(ys[i]))}
      fill={m === 'pdf' && inAB(k) ? C[2] : C[1]} opacity={m === 'pdf' && inAB(k) ? 0.95 : 0.55} />);
  } else {
    const line = pathOf(xs.map((x, i) => [sx(x), sy(ys[i])]));
    const area = xs.map((x, i) => [x, ps[i]] as [number, number]).filter(([x]) => inAB(x));
    shape = [<path key="l" d={line} fill="none" stroke={C[1]} strokeWidth={2} />];
    if (m === 'pdf' && area.length > 1) shape.unshift(<path key="a" d={pathOf([[sx(area[0][0]), box[3]], ...area.map(([x, y]) => [sx(x), sy(y)] as [number, number]), [sx(area[area.length - 1][0]), box[3]]]) + 'Z'} fill={C[2]} opacity={0.45} />);
  }
  const cdfVal = (x: number) => { let best = 0; xs.forEach((xx, i) => { if (xx <= x + 1e-9) best = cs[i]; }); return best; };
  const tstep = D.discrete ? Math.max(1, Math.ceil(xr[1] / 8)) : 0;
  const ticks = D.discrete ? Array.from({ length: Math.floor(xr[1] / tstep) + 1 }, (_, i) => i * tstep) : Array.from({ length: 8 }, (_, i) => xr[0] + ((xr[1] - xr[0]) * i) / 7);
  const smin = D.discrete ? 0 : xr[0], smax = D.discrete ? Math.floor(xr[1]) : xr[1];

  return (
    <div>
      <Stage w={320} h={196} label={`${D.label} distribution, P(${A} ≤ X ≤ ${B}) = ${prob.toFixed(3)}`}>
        <line x1={box[0]} x2={box[2]} y1={box[3]} y2={box[3]} stroke="var(--fg)" strokeWidth={0.8} />
        <line x1={box[0]} x2={box[0]} y1={box[1]} y2={box[3]} stroke="var(--fg)" strokeWidth={0.8} />
        {ticks.map((t) => <text key={t} x={sx(t)} y={box[3] + 9} fontSize="8" textAnchor="middle" fill="var(--muted)">{+t.toFixed(1)}</text>)}
        {[0, 0.5, 1].map((f) => { const yv = f * (m === 'cdf' ? 1 : yTop / 1.05); return <text key={f} x={box[0] - 3} y={sy(yv) + 3} fontSize="8" textAnchor="end" fill="var(--muted)">{+yv.toFixed(2)}</text>; })}
        {m === 'cdf' && <line x1={box[0]} x2={box[2]} y1={sy(1)} y2={sy(1)} stroke="var(--grid)" strokeDasharray="3 3" />}
        <g>{shape}</g>
        {[A, B].map((x, i) => <line key={i} x1={sx(x)} x2={sx(x)} y1={box[1]} y2={box[3]} stroke={C[2]} strokeWidth={1.2} strokeDasharray="3 2" />)}
        {m === 'cdf' && <g stroke={C[4]} strokeWidth={2.5}><line x1={sx(B) + 4} x2={sx(B) + 4} y1={sy(cdfVal(D.discrete ? Math.ceil(A) - 1 : A))} y2={sy(cdfVal(B))} /></g>}
        <path d={`M${sx(mu)},${box[3] + 1} l-4,7 h8z`} fill={C[4]} />
        <line x1={sx(mu - sd)} x2={sx(mu + sd)} y1={box[3] + 4} y2={box[3] + 4} stroke={C[4]} strokeWidth={1.5} opacity={0.7} />
        <text x={box[2]} y={box[1] + 8} fontSize="10" textAnchor="end" fill="var(--fg)" fontWeight="bold">P({+A.toFixed(1)} ≤ X ≤ {+B.toFixed(1)}) = {prob.toFixed(3)}</text>
        <text x={box[2]} y={box[1] + 20} fontSize="9" textAnchor="end" fill="var(--muted)">mean {mu.toFixed(2)}, sd {sd.toFixed(2)}</text>
        <text x={box[0] + 4} y={box[1] + 8} fontSize="9" fill="var(--fg)">{m === 'cdf' ? 'F(x) = P(X ≤ x)' : D.discrete ? 'P(X = k)' : 'density f(x)'}</text>
      </Stage>
      <Controls>
        {(dists ?? [start]).length > 1 && (dists ?? []).map((k) => <Btn key={k} active={k === d} onClick={() => choose(k)}>{DEFS[k].label}</Btn>)}
        <Btn active={m === 'pdf'} onClick={() => setM('pdf')}>{D.discrete ? 'pmf' : 'pdf'}</Btn>
        <Btn active={m === 'cdf'} onClick={() => setM('cdf')}>cdf</Btn>
        {D.params.map((p) => <Slider key={d + p.name} label={p.label} min={p.min} max={p.max} step={p.step} value={v[p.name]} onChange={(x) => setV((s) => ({ ...s, [p.name]: x }))} />)}
        <Slider label="a" min={smin} max={smax} step={D.discrete ? 1 : 0.1} value={lo} onChange={setLo} />
        <Slider label="b" min={smin} max={smax} step={D.discrete ? 1 : 0.1} value={hi} onChange={setHi} />
      </Controls>
    </div>
  );
}
