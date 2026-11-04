import { useMemo, useRef, useState } from 'react';
import { Btn, Controls, PlayPause, Slider, Stage, pathOf, prefersReducedMotion, rng, scale, useFrame } from './_kit';
import { posteriorMean, toyData, type ToyName } from './_mlToyData';

/**
 * The DDIM η-dial on a 2-D toy dataset. One generalized update, two knobs:
 *   x_s = √ᾱ_s·x̂₀ + √(1−ᾱ_s−σ²)·ε̂ + σ·z,   ε̂ = (x_t − √ᾱ_t·x̂₀)/√(1−ᾱ_t),
 *   σ = η·√((1−ᾱ_s)/(1−ᾱ_t))·√(1−ᾱ_t/ᾱ_s)   →  η=0 deterministic DDIM, η=1 exactly DDPM.
 * x̂₀ is the EXACT optimal denoiser E[x₀|x_t] for the 240 toy training points (no network), so the
 * only things changing are η and the number of steps. The starting noise is fixed until you press
 * "↺ New noise", so η=0 reruns land on exactly the same points.
 * Schedule: ᾱ(t) = cos²(πt/2) on a uniform grid of `steps` times.
 * props: {
 *   dataset?: 'moons'|'spiral'|'ring'|'gmm'|'smile'  (default 'spiral')
 *   eta?: number        initial η in [0,1] (default 0)
 *   steps?: number      initial number of sampler steps (default 20)
 *   particles?: number  (default 160)
 *   trails?: number     how many trajectories to draw (default 6)
 * }
 */
const abar = (t: number) => Math.cos((Math.PI / 2) * Math.min(1, Math.max(0, t))) ** 2;

export default function MlDdimEta({ dataset = 'spiral', eta: eta0 = 0, steps: steps0 = 20, particles = 160, trails = 6 }: {
  dataset?: ToyName; eta?: number; steps?: number; particles?: number; trails?: number;
}) {
  const data = useMemo(() => toyData(dataset, 240, 3), [dataset]);
  const [eta, setEta] = useState(eta0);
  const [steps, setSteps] = useState(steps0);
  const [seed, setSeed] = useState(4);
  const [k, setK] = useState(0);
  const [running, setRunning] = useState(false);
  const R = 3;
  const box: [number, number, number, number] = [54, 6, 266, 194];
  const sx = scale([-R, R], [box[0], box[2]]);
  const sy = scale([-R, R], [box[3], box[1]]);

  /** Full trajectory of every particle: traj[k][i] = position after k updates. */
  const traj = useMemo(() => {
    const r = rng(seed);
    const rz = rng(seed * 977 + 13);
    let xs = Array.from({ length: particles }, () => [r.normal(), r.normal()] as [number, number]);
    const out: [number, number][][] = [xs.map((p) => [p[0], p[1]] as [number, number])];
    for (let j = steps; j > 0; j--) {
      const at = abar(j / steps), as = abar((j - 1) / steps);
      const a = Math.sqrt(at), sg = Math.sqrt(1 - at);
      const sig = eta * Math.sqrt((1 - as) / Math.max(1e-9, 1 - at)) * Math.sqrt(Math.max(0, 1 - at / Math.max(as, 1e-9)));
      const dir = Math.sqrt(Math.max(0, 1 - as - sig * sig));
      xs = xs.map(([x, y]) => {
        const [hx, hy] = posteriorMean(data, x, y, a, Math.max(sg, 1e-6));
        const ex = (x - a * hx) / Math.max(sg, 1e-6), ey = (y - a * hy) / Math.max(sg, 1e-6);
        return [Math.sqrt(as) * hx + dir * ex + sig * rz.normal(), Math.sqrt(as) * hy + dir * ey + sig * rz.normal()];
      });
      out.push(xs.map((p) => [p[0], p[1]] as [number, number]));
    }
    return out;
  }, [data, particles, steps, eta, seed]);

  const acc = useRef(0);
  useFrame((dt) => {
    acc.current += dt;
    const per = 2.5 / steps;
    while (acc.current > per) { acc.current -= per; setK((v) => { if (v >= steps) { setRunning(false); return steps; } return v + 1; }); }
  }, running);

  const now = traj[Math.min(k, traj.length - 1)];
  const nTrails = Math.min(trails, particles);

  return (
    <div>
      <Stage label="DDIM sampling with an adjustable noise level eta">
        <rect x={box[0]} y={box[1]} width={box[2] - box[0]} height={box[3] - box[1]} fill="none" stroke="var(--grid)" />
        {data.map(([x, y], i) => <circle key={'d' + i} cx={sx(x)} cy={sy(y)} r={1.3} fill="var(--muted)" opacity={0.3} />)}
        {Array.from({ length: nTrails }, (_, i) => (
          <path key={'tr' + i} fill="none" stroke="var(--c3)" strokeWidth={0.8} opacity={0.75}
            d={pathOf(traj.slice(0, k + 1).map((st) => [sx(st[i][0]), sy(st[i][1])]))} />
        ))}
        {now.map(([x, y], i) => Math.abs(x) < R && Math.abs(y) < R && (
          <circle key={i} cx={sx(x)} cy={sy(y)} r={i < nTrails ? 2.3 : 1.7} fill={i < nTrails ? 'var(--c3)' : 'var(--c4)'} opacity={0.85} />
        ))}
        <g fontSize="9" fill="var(--fg)">
          <text x={3} y={14}>η = {eta.toFixed(2)}</text>
          <text x={3} y={28}>{eta < 0.005 ? 'DDIM (ODE)' : eta > 0.995 ? 'DDPM' : 'in between'}</text>
          <text x={3} y={44}>step {k}/{steps}</text>
          <text x={3} y={58} fill="var(--muted)">NFE = {steps}</text>
          <text x={3} y={76} fill="var(--muted)">ᾱ = {abar(1 - k / steps).toFixed(3)}</text>
          <text x={270} y={14} fontSize="8" fill="var(--muted)">data</text>
        </g>
      </Stage>
      <Controls>
        <Slider label="η" min={0} max={1} step={0.05} value={eta} onChange={(v) => { setEta(v); setK(0); setRunning(false); }} />
        <Slider label="steps" min={4} max={50} step={1} value={steps} onChange={(v) => { setSteps(Math.round(v)); setK(0); setRunning(false); }} format={(v) => String(Math.round(v))} />
        <Btn onClick={() => { setSeed((s) => s + 1); setK(0); setRunning(!prefersReducedMotion()); }}>↺ New noise</Btn>
        <Btn onClick={() => { setK(steps); setRunning(false); }}>Finish</Btn>
        <PlayPause running={running} set={(r) => { if (r && k >= steps) setK(0); setRunning(r); }} />
      </Controls>
    </div>
  );
}
