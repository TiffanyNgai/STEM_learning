import { useRef, useState } from 'react';
import { Btn, Controls, PlayPause, Slider, Stage, pathOf, prefersReducedMotion, scale, useFrame } from './_kit';

/**
 * Lorenz system x' = σ(y − x), y' = x(ρ − z) − y, z' = xy − βz, integrated with RK4 (dt = 0.005).
 * Two trajectories start a distance ε apart (blue and orange), drawn in the (x, z) plane.
 * The lower strip plots log₁₀ of their separation against time, with a dashed reference line of
 * slope λ/ln 10 for the largest Lyapunov exponent λ ≈ 0.906 (classic parameters).
 * props: { sigma?: number (10), rho?: number (28), beta?: number (8/3),
 *          logEps?: number (log₁₀ of the initial separation, default −6), speed?: number (time units per second, default 1.5) }
 */
type V3 = [number, number, number];
const LAMBDA = 0.906;

export default function MathLorenz({ sigma = 10, rho: rho0 = 28, beta = 8 / 3, logEps: le0 = -6, speed = 1.5 }: {
  sigma?: number; rho?: number; beta?: number; logEps?: number; speed?: number;
}) {
  const [rho, setRho] = useState(rho0);
  const [logEps, setLogEps] = useState(le0);
  const [running, setRunning] = useState(!prefersReducedMotion());
  const f = (p: V3): V3 => [sigma * (p[1] - p[0]), p[0] * (rho - p[2]) - p[1], p[0] * p[1] - beta * p[2]];
  const rk4 = (p: V3, h: number): V3 => {
    const add = (a: V3, b: V3, s: number): V3 => [a[0] + s * b[0], a[1] + s * b[1], a[2] + s * b[2]];
    const k1 = f(p), k2 = f(add(p, k1, h / 2)), k3 = f(add(p, k2, h / 2)), k4 = f(add(p, k3, h));
    return [0, 1, 2].map((i) => p[i] + (h / 6) * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i])) as V3;
  };
  const init = (le = logEps) => {
    const a: V3 = [1, 1, 20], b: V3 = [1 + Math.pow(10, le), 1, 20];
    return { a, b, t: 0, ta: [a] as V3[], tb: [b] as V3[], logd: [[0, le]] as [number, number][], t0: le };
  };
  const S = useRef(init());
  const [, force] = useState(0);
  const reset = () => { S.current = init(); force((v) => v + 1); };

  useFrame((dt) => {
    const s = S.current;
    if (s.t > 40) return;
    const steps = Math.max(1, Math.round((dt * speed) / 0.005));
    for (let i = 0; i < steps; i++) {
      s.a = rk4(s.a, 0.005); s.b = rk4(s.b, 0.005); s.t += 0.005;
      if (i % 2 === 0) {
        s.ta.push(s.a); s.tb.push(s.b);
        if (s.ta.length > 900) { s.ta.shift(); s.tb.shift(); }
      }
    }
    const d = Math.hypot(s.a[0] - s.b[0], s.a[1] - s.b[1], s.a[2] - s.b[2]);
    s.logd.push([s.t, Math.log10(Math.max(d, 1e-12))]);
    force((v) => v + 1);
  }, running);

  const s = S.current;
  const box: [number, number, number, number] = [10, 6, 310, 150];
  const sx = scale([-25, 25], [box[0] + 50, box[2] - 50]); const sz = scale([0, 55], [box[3], box[1]]);
  const proj = (p: V3[]) => pathOf(p.map((q) => [sx(q[0]), sz(q[2])]));
  const lb: [number, number, number, number] = [36, 168, 310, 232];
  const st = scale([0, 40], [lb[0], lb[2]]); const sl = scale([-10, 2], [lb[3], lb[1]]);
  const clampL = (v: number) => Math.max(-10, Math.min(2, v));
  const last = s.logd[s.logd.length - 1][1];
  return (
    <div>
      <Stage w={320} h={244} label="Lorenz attractor with two nearby trajectories">
        <path d={proj(s.tb)} stroke="var(--c3)" strokeWidth={1} fill="none" opacity={0.8} />
        <path d={proj(s.ta)} stroke="var(--c2)" strokeWidth={1} fill="none" opacity={0.8} />
        <circle cx={sx(s.b[0])} cy={sz(s.b[2])} r={3.2} fill="var(--c3)" />
        <circle cx={sx(s.a[0])} cy={sz(s.a[2])} r={3.2} fill="var(--c2)" />
        <text x={14} y={16} fontSize="9">x–z view · t = {s.t.toFixed(1)}</text>
        <text x={306} y={16} fontSize="9" textAnchor="end">ρ = {rho.toFixed(1)}</text>
        <rect x={lb[0]} y={lb[1]} width={lb[2] - lb[0]} height={lb[3] - lb[1]} fill="none" stroke="var(--grid)" />
        {[-10, -6, -2, 2].map((v) => <text key={v} x={lb[0] - 3} y={sl(v) + 3} fontSize="8" textAnchor="end">{v}</text>)}
        <text x={lb[0] + 3} y={lb[1] + 9} fontSize="8.5">log₁₀ separation (now {last.toFixed(1)})</text>
        <text x={lb[2]} y={lb[3] + 9} fontSize="8" textAnchor="end">t → 40</text>
        <line x1={st(0)} y1={sl(s.t0)} x2={st(Math.min(40, (2 - s.t0) * Math.LN10 / LAMBDA))} y2={sl(Math.min(2, s.t0 + 40 * LAMBDA / Math.LN10))}
          stroke="var(--muted)" strokeDasharray="3 3" />
        <path d={pathOf(s.logd.map(([t, v]) => [st(t), sl(clampL(v))]))} stroke="var(--c5)" strokeWidth={1.4} fill="none" />
      </Stage>
      <Controls>
        <PlayPause running={running} set={setRunning} />
        <Btn onClick={reset}>Restart</Btn>
        <Slider label="log₁₀ ε" min={-10} max={-1} step={1} value={logEps} onChange={(v) => { setLogEps(v); S.current = init(v); }} />
        <Slider label="ρ" min={10} max={40} step={0.5} value={rho} onChange={(v) => { setRho(v); S.current = init(); }} />
      </Controls>
    </div>
  );
}
