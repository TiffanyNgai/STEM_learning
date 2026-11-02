import { useMemo, useState } from 'react';
import { Btn, Controls, PlayPause, Slider, Stage, rng, scale, useFrame } from './_kit';
import { posteriorMean, toyData, type ToyName } from './_mlToyData';

/**
 * Flow matching on a 2D toy problem: Gaussian noise x_0 → data x_1 along x_t = (1−t)x_0 + t·x_1.
 * 'conditional': each particle follows its own straight line to a randomly paired data point (paths cross).
 * 'marginal': particles follow the ODE dx/dt = u_t(x) = E[x_1 − x_0 | x_t = x] (computed exactly for the
 *   toy set) — the field flow matching learns. Its paths are curved and never cross.
 * props: { dataset?: 'moons'|'spiral'|'ring'|'gmm'|'smile' (default 'ring'), mode?: 'conditional'|'marginal'
 *          (initial, default 'conditional'), particles?: number (default 90), showField?: boolean (default false),
 *          showPaths?: boolean (default true) }
 */
export default function FlowMatchingPaths({ dataset = 'ring', mode: m0 = 'conditional', particles = 90, showField = false, showPaths = true }: {
  dataset?: ToyName; mode?: 'conditional' | 'marginal'; particles?: number; showField?: boolean; showPaths?: boolean;
}) {
  const data = useMemo(() => toyData(dataset, 200, 4), [dataset]);
  const R = 3; const box: [number, number, number, number] = [60, 4, 260, 196];
  const sx = scale([-R, R], [box[0], box[2]]); const sy = scale([-R, R], [box[3], box[1]]);
  const [mode, setMode] = useState(m0);
  const [field, setField] = useState(showField);
  const [t, setT] = useState(0);
  const [running, setRunning] = useState(true);
  const N = 60;
  const { x0, x1, traj } = useMemo(() => {
    const r = rng(9);
    const x0 = Array.from({ length: particles }, () => [r.normal(), r.normal()] as [number, number]);
    const x1 = Array.from({ length: particles }, () => data[Math.floor(r.u() * data.length)]);
    const traj = x0.map(([a, b]) => {
      const out: [number, number][] = [[a, b]]; let x = a, y = b;
      for (let k = 0; k < N; k++) {
        const tk = k / N, dt = 1 / N;
        const [mx, my] = posteriorMean(data, x, y, tk, 1 - tk);
        x += dt * (mx - x) / (1 - tk); y += dt * (my - y) / (1 - tk);
        out.push([x, y]);
      }
      return out;
    });
    return { x0, x1, traj };
  }, [data, particles]);
  useFrame((dt) => setT((v) => (v + dt / 4 > 1.25 ? 0 : v + dt / 4)), running);
  const tc = Math.min(1, t);
  const pos = (i: number): [number, number] => {
    if (mode === 'conditional') return [(1 - tc) * x0[i][0] + tc * x1[i][0], (1 - tc) * x0[i][1] + tc * x1[i][1]];
    const f = tc * N; const k = Math.min(N - 1, Math.floor(f)); const w = f - k; const T = traj[i];
    return [T[k][0] * (1 - w) + T[k + 1][0] * w, T[k][1] * (1 - w) + T[k + 1][1] * w];
  };
  const arrows = useMemo(() => {
    if (!field) return [];
    const out: number[][] = []; const tt = Math.min(tc, 0.97);
    for (let i = 0; i < 12; i++) for (let j = 0; j < 12; j++) {
      const x = -R + (2 * R * (i + 0.5)) / 12, y = -R + (2 * R * (j + 0.5)) / 12;
      const [mx, my] = posteriorMean(data, x, y, tt, 1 - tt);
      const vx = (mx - x) / (1 - tt), vy = (my - y) / (1 - tt); const m = Math.hypot(vx, vy) || 1; const L = Math.min(9, 3 * m);
      out.push([sx(x), sy(y), (vx / m) * L, (-vy / m) * L]);
    }
    return out;
  }, [field, tc, data]);
  const col = mode === 'conditional' ? 'var(--c2)' : 'var(--c4)';
  return (
    <div>
      <Stage label="Flow matching paths from noise to data">
        <defs><marker id="fm-arr" viewBox="0 0 6 6" refX="5" refY="3" markerWidth="4" markerHeight="4" orient="auto"><path d="M0,0L6,3L0,6z" fill="var(--c3)" /></marker></defs>
        <rect x={box[0]} y={box[1]} width={box[2] - box[0]} height={box[3] - box[1]} fill="none" stroke="var(--grid)" />
        {data.map(([x, y], i) => <circle key={'d' + i} cx={sx(x)} cy={sy(y)} r={1.3} fill="var(--c1)" opacity={0.35} />)}
        {showPaths && x0.map((_, i) => mode === 'conditional'
          ? <line key={'p' + i} x1={sx(x0[i][0])} y1={sy(x0[i][1])} x2={sx(x1[i][0])} y2={sy(x1[i][1])} stroke={col} strokeWidth={0.5} opacity={0.25} />
          : <polyline key={'p' + i} points={traj[i].map(([a, b]) => `${sx(a)},${sy(b)}`).join(' ')} fill="none" stroke={col} strokeWidth={0.5} opacity={0.3} />)}
        {arrows.map(([x, y, dx, dy], i) => <line key={'a' + i} x1={x} y1={y} x2={x + dx} y2={y + dy} stroke="var(--c3)" strokeWidth={0.9} markerEnd="url(#fm-arr)" />)}
        {x0.map((_, i) => { const [x, y] = pos(i); return <circle key={i} cx={sx(x)} cy={sy(y)} r={2} fill={col} />; })}
        <g fontSize="9" fill="var(--fg)">
          <text x={4} y={14}>{mode === 'conditional' ? 'conditional paths' : 'marginal flow'}</text>
          <text x={4} y={28}>t = {tc.toFixed(2)}</text>
          <text x={4} y={186} fill="var(--muted)">t=0: N(0,I)</text>
          <text x={4} y={196} fill="var(--c1)">t=1: data</text>
          <text x={266} y={14}>{mode === 'conditional' ? 'paths cross' : 'no crossings'}</text>
        </g>
      </Stage>
      <Controls>
        <Btn active={mode === 'conditional'} onClick={() => setMode('conditional')}>Conditional</Btn>
        <Btn active={mode === 'marginal'} onClick={() => setMode('marginal')}>Marginal</Btn>
        <Slider label="t" min={0} max={1} step={0.01} value={tc} onChange={(v) => { setRunning(false); setT(v); }} />
        <PlayPause running={running} set={setRunning} />
        <Btn active={field} onClick={() => setField(!field)}>Velocity field</Btn>
      </Controls>
    </div>
  );
}
