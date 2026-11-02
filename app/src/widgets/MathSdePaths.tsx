import { useMemo, useState } from 'react';
import { Btn, Controls, PlayPause, Slider, Stage, pathOf, prefersReducedMotion, rng, scale, useClock } from './_kit';

/**
 * Euler–Maruyama simulation X_{n+1} = X_n + μ(X_n)Δt + σ(X_n)·√Δt·Z_n (Z_n standard normal) of
 *   'bm'  : dX = σ dW                  (scaled Brownian motion)
 *   'ou'  : dX = −θX dt + σ dW         (Ornstein–Uhlenbeck, mean-reverting to 0)
 *   'gbm' : dX = μX dt + σX dW         (geometric Brownian motion)
 * on [0, T] = [0, 1]. Paths are drawn progressively; on the right, a histogram of X_T over 600 simulated
 * paths with the exact density of X_T overlaid (normal for bm/ou, log-normal for gbm).
 * props: { mode?: 'bm' | 'ou' | 'gbm' (default 'bm'), sigma?: number, theta?: number (ou, default 3),
 *          mu?: number (gbm, default 0.5), x0?: number (default 0 for bm, 2 for ou, 1 for gbm),
 *          steps?: number (time steps, default 200), shown?: number (paths drawn, default 12) }
 */
export default function MathSdePaths({ mode = 'bm', sigma: s0, theta: th0 = 3, mu: mu0 = 0.5, x0, steps = 200, shown = 12 }: {
  mode?: 'bm' | 'ou' | 'gbm'; sigma?: number; theta?: number; mu?: number; x0?: number; steps?: number; shown?: number;
}) {
  const X0 = x0 ?? (mode === 'ou' ? 2 : mode === 'gbm' ? 1 : 0);
  const [sigma, setSigma] = useState(s0 ?? (mode === 'gbm' ? 0.4 : 1));
  const [par, setPar] = useState(mode === 'gbm' ? mu0 : th0);
  const [seed, setSeed] = useState(1);
  const [running, setRunning] = useState(!prefersReducedMotion());
  const [t, setT] = useClock(running);
  const T = 1, dt = T / steps;
  const drift = (x: number) => (mode === 'ou' ? -par * x : mode === 'gbm' ? par * x : 0);
  const diff = (x: number) => (mode === 'gbm' ? sigma * x : sigma);
  const sim = useMemo(() => {
    const R = rng(seed * 7919);
    const paths: number[][] = []; const finals: number[] = [];
    for (let p = 0; p < 600; p++) {
      let x = X0; const keep = p < shown; const path = keep ? [x] : [];
      for (let i = 0; i < steps; i++) { x = x + drift(x) * dt + diff(x) * Math.sqrt(dt) * R.normal(); if (keep) path.push(x); }
      if (keep) paths.push(path); finals.push(x);
    }
    return { paths, finals };
  }, [seed, sigma, par, mode, steps, X0]);

  // exact law of X_T
  let mean: number, vr: number, dens: (y: number) => number;
  if (mode === 'gbm') {
    const m = Math.log(X0) + (par - sigma * sigma / 2) * T, s = sigma * Math.sqrt(T);
    mean = X0 * Math.exp(par * T); vr = X0 * X0 * Math.exp(2 * par * T) * (Math.exp(sigma * sigma * T) - 1);
    dens = (y) => (y <= 0 ? 0 : Math.exp(-((Math.log(y) - m) ** 2) / (2 * s * s)) / (y * s * Math.sqrt(2 * Math.PI)));
  } else {
    mean = mode === 'ou' ? X0 * Math.exp(-par * T) : X0;
    vr = mode === 'ou' ? (sigma * sigma * (1 - Math.exp(-2 * par * T))) / (2 * par) : sigma * sigma * T;
    dens = (y) => Math.exp(-((y - mean) ** 2) / (2 * vr)) / Math.sqrt(2 * Math.PI * vr);
  }
  const yr: [number, number] = mode === 'gbm' ? [0, 4] : [-3.5, 3.5];
  const box: [number, number, number, number] = [24, 8, 230, 176];
  const sx = scale([0, T], [box[0], box[2]]); const sy = scale(yr, [box[3], box[1]]);
  const cl = (v: number) => Math.max(box[1], Math.min(box[3], sy(v)));
  const shownSteps = running || t > 0 ? Math.min(steps, Math.floor((t / 3) * steps)) : steps;
  const done = shownSteps >= steps;
  if (done && running && t > 4.5) { setT(0); setSeed((v) => v + 1); }

  const nb = 28, bw = (yr[1] - yr[0]) / nb; const counts = new Array(nb).fill(0);
  for (const v of sim.finals) { const k = Math.floor((v - yr[0]) / bw); if (k >= 0 && k < nb) counts[k]++; }
  const hx0 = 236, hx1 = 312; const peak = Math.max(...counts.map((c) => c / (sim.finals.length * bw)), dens(mean), 0.1);
  const hs = (d: number) => hx0 + ((hx1 - hx0) * d) / peak;
  const densPts: [number, number][] = []; for (let i = 0; i <= 80; i++) { const y = yr[0] + ((yr[1] - yr[0]) * i) / 80; densPts.push([hs(dens(y)), sy(y)]); }
  const sMean = sim.finals.reduce((a, b) => a + b, 0) / sim.finals.length;
  const sVar = sim.finals.reduce((a, b) => a + (b - sMean) ** 2, 0) / (sim.finals.length - 1);
  const title = mode === 'bm' ? 'dX = σ dW' : mode === 'ou' ? 'dX = −θX dt + σ dW' : 'dX = μX dt + σX dW';
  return (
    <div>
      <Stage w={320} h={200} label={`Euler–Maruyama paths of ${title}`}>
        <rect x={box[0]} y={box[1]} width={box[2] - box[0]} height={box[3] - box[1]} fill="none" stroke="var(--grid)" />
        <line x1={box[0]} x2={box[2]} y1={cl(0)} y2={cl(0)} stroke="var(--muted)" strokeWidth={0.6} />
        {[yr[0], (yr[0] + yr[1]) / 2, yr[1]].map((v) => <text key={v} x={box[0] - 3} y={sy(v) + 3} fontSize="8" textAnchor="end">{+v.toFixed(1)}</text>)}
        <text x={box[2]} y={box[3] + 9} fontSize="8" textAnchor="end">t = 1</text>
        <text x={box[0] + 3} y={box[1] + 9} fontSize="8.5">{title}</text>
        {sim.paths.map((p, i) => <path key={i} d={pathOf(p.slice(0, shownSteps + 1).map((v, k) => [sx(k * dt), cl(v)]))}
          stroke={`var(--c${(i % 6) + 1})`} strokeWidth={1} fill="none" opacity={0.85} />)}
        {done && counts.map((c, k) => <rect key={k} x={hx0} y={sy(yr[0] + (k + 1) * bw)} width={hs(c / (sim.finals.length * bw)) - hx0} height={Math.abs(sy(0) - sy(bw)) - 0.5} fill="var(--c2)" opacity={0.45} />)}
        {done && <path d={pathOf(densPts)} stroke="var(--c5)" strokeWidth={1.5} fill="none" />}
        <text x={hx0} y={box[3] + 9} fontSize="8">X₁ histogram</text>
        <text x={24} y={196} fontSize="8.5">600 paths: mean {sMean.toFixed(2)} (exact {mean.toFixed(2)}), var {sVar.toFixed(2)} (exact {vr.toFixed(2)})</text>
      </Stage>
      <Controls>
        <PlayPause running={running} set={setRunning} />
        <Btn onClick={() => { setSeed((v) => v + 1); setT(0); }}>New noise</Btn>
        <Slider label="σ" min={0.1} max={mode === 'gbm' ? 1 : 2} step={0.05} value={sigma} onChange={setSigma} />
        {mode !== 'bm' && <Slider label={mode === 'ou' ? 'θ' : 'μ'} min={mode === 'ou' ? 0.2 : -1} max={mode === 'ou' ? 8 : 1.5} step={0.1} value={par} onChange={setPar} />}
      </Controls>
    </div>
  );
}
