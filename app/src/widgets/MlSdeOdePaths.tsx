import { useMemo, useState } from 'react';
import { Btn, Controls, PlayPause, Stage, pathOf, prefersReducedMotion, rng, scale, useFrame } from './_kit';

/**
 * Reverse-time sampling of a 1-D variance-preserving diffusion, two ways from the SAME terminal noise:
 *   • reverse SDE          dx = [−½β(t)x − β(t)·s(x,t)] dt̄ + √(β(t)) dw̄   (jagged, stochastic)
 *   • probability-flow ODE dx/dt = −½β(t)·[x + s(x,t)]                      (smooth, deterministic)
 * The toy data are a 3-component Gaussian mixture, so the score s(x,t) = ∇log p_t(x) is known exactly.
 * Schedule: ᾱ(t) = cos²(πt/2), so β(t) = −d/dt log ᾱ(t) = π·tan(πt/2). Time runs down the page.
 * props: {
 *   paths?: number             number of trajectories (default 14)
 *   steps?: number             Euler steps from t = 0.96 down to 0 (default 300)
 *   show?: 'sde'|'ode'|'both'  which family to draw (default 'both')
 *   seed?: number              noise seed (default 7)
 * }
 */
const MU = [-1.7, -0.1, 1.55];
const WT = [0.4, 0.25, 0.35];
const S0 = 0.16;
const T0 = 0.96;
const abar = (t: number) => Math.cos((Math.PI / 2) * t) ** 2;
const beta = (t: number) => Math.PI * Math.tan((Math.PI / 2) * Math.min(t, 0.97));

/** Exact score of p_t for x_t = √ᾱ·x_0 + √(1−ᾱ)·ε with x_0 a Gaussian mixture. */
function score(x: number, t: number): number {
  const ab = abar(t);
  const v = ab * S0 * S0 + (1 - ab);
  const a = Math.sqrt(ab);
  let tot = 0; const w: number[] = [];
  for (let k = 0; k < 3; k++) {
    const d = x - a * MU[k];
    const e = WT[k] * Math.exp(-(d * d) / (2 * v));
    w.push(e); tot += e;
  }
  let s = 0;
  for (let k = 0; k < 3; k++) s += (w[k] / (tot + 1e-300)) * (-(x - a * MU[k]) / v);
  return s;
}

export default function MlSdeOdePaths({ paths = 14, steps = 300, show: show0 = 'both', seed: seed0 = 7 }: {
  paths?: number; steps?: number; show?: 'sde' | 'ode' | 'both'; seed?: number;
}) {
  const [show, setShow] = useState(show0);
  const [seed, setSeed] = useState(seed0);
  const [prog, setProg] = useState(prefersReducedMotion() ? 1 : 0);
  const [running, setRunning] = useState(!prefersReducedMotion());
  const L = 34, T = 12, R = 302, B = 168;
  const sx = scale([-3, 3], [L, R]);
  const sy = scale([T0, 0], [T, B]);

  const { sde, ode } = useMemo(() => {
    const r = rng(seed);
    const dt = T0 / steps;
    const sde: [number, number][][] = []; const ode: [number, number][][] = [];
    for (let i = 0; i < paths; i++) {
      const x00 = r.normal();
      let xs = x00, xo = x00;
      const ps: [number, number][] = [[xs, T0]]; const po: [number, number][] = [[xo, T0]];
      for (let k = 0; k < steps; k++) {
        const t = T0 - k * dt;
        const bt = beta(t);
        xs = xs + dt * (0.5 * bt * xs + bt * score(xs, t)) + Math.sqrt(bt * dt) * r.normal();
        xo = xo + dt * (0.5 * bt * xo + 0.5 * bt * score(xo, t));
        xs = Math.max(-3.2, Math.min(3.2, xs)); xo = Math.max(-3.2, Math.min(3.2, xo));
        ps.push([xs, t - dt]); po.push([xo, t - dt]);
      }
      sde.push(ps); ode.push(po);
    }
    return { sde, ode };
  }, [paths, steps, seed]);

  useFrame((dt) => setProg((p) => { const n = p + dt * 0.35; if (n >= 1) { setRunning(false); return 1; } return n; }), running);

  const n = Math.max(2, Math.round(prog * steps) + 1);
  const draw = (tr: [number, number][][], colour: string) => tr.map((p, i) => (
    <path key={colour + i} d={pathOf(p.slice(0, n).map(([x, t]) => [sx(x), sy(t)]))} fill="none" stroke={colour} strokeWidth={0.9} opacity={0.8} />
  ));
  const dots = (tr: [number, number][][], colour: string) => tr.map((p, i) => {
    const [x, t] = p[n - 1];
    return <circle key={colour + 'd' + i} cx={sx(x)} cy={sy(t)} r={2} fill={colour} />;
  });

  return (
    <div>
      <Stage label="Reverse SDE versus probability-flow ODE">
        <rect x={L} y={T} width={R - L} height={B - T} fill="none" stroke="var(--grid)" />
        {MU.map((m, i) => <g key={'m' + i}>
          <line x1={sx(m)} x2={sx(m)} y1={B} y2={B + 5} stroke="var(--c1)" strokeWidth={1.6} />
          <circle cx={sx(m)} cy={B} r={2.4} fill="var(--c1)" opacity={0.8} />
        </g>)}
        {show !== 'ode' && draw(sde, 'var(--c2)')}
        {show !== 'sde' && draw(ode, 'var(--c4)')}
        {show !== 'ode' && dots(sde, 'var(--c2)')}
        {show !== 'sde' && dots(ode, 'var(--c4)')}
        <g fontSize="8.5" fill="var(--muted)">
          <text x={2} y={T + 8}>t = {T0}</text>
          <text x={2} y={B}>t = 0</text>
          <text x={4} y={(T + B) / 2} fill="var(--fg)">noise</text>
          <text x={4} y={(T + B) / 2 + 11} fill="var(--fg)">↓ data</text>
          <text x={R} y={B + 12} textAnchor="end">x</text>
          <text x={L} y={B + 12} fill="var(--c1)">data modes ▲</text>
          {show !== 'ode' && <text x={sx(0)} y={T + 8} textAnchor="middle" fill="var(--c2)">reverse SDE</text>}
          {show !== 'sde' && <text x={sx(0)} y={T + 18} textAnchor="middle" fill="var(--c4)">prob.-flow ODE</text>}
          <text x={R} y={T + 8} textAnchor="end">step {n - 1}/{steps}</text>
        </g>
      </Stage>
      <Controls>
        <Btn active={show === 'sde'} onClick={() => setShow('sde')}>SDE</Btn>
        <Btn active={show === 'ode'} onClick={() => setShow('ode')}>ODE</Btn>
        <Btn active={show === 'both'} onClick={() => setShow('both')}>Both</Btn>
        <Btn onClick={() => { setSeed((s) => s + 1); setProg(0); setRunning(true); }}>↺ New noise</Btn>
        <PlayPause running={running} set={(r) => { if (r && prog >= 1) setProg(0); setRunning(r); }} />
      </Controls>
    </div>
  );
}
