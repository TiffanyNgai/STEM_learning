import { useEffect, useMemo, useState } from 'react';
import { Btn, Controls, PlayPause, Slider, Stage, pathOf, prefersReducedMotion, scale, useFrame } from './_kit';

type Init = 'box' | 'triangle' | 'twoSteps' | 'noisy';
/**
 * Heat equation u_t = D u_xx on a rod 0 ≤ x ≤ π whose ends are held at u = 0.
 * The initial profile f is expanded in sine modes, f = Σ b_n sin(nx), and each mode decays on its own:
 *   u(x, t) = Σ b_n e^{−D n² t} sin(nx).
 * Top: current profile (blue), initial profile (dashed), and the rod coloured by temperature.
 * Bottom: bars |b_n| e^{−D n² t} for n = 1…12 (green = positive b_n, red = negative) — high modes die first.
 * props: { initial?: 'box' | 'triangle' | 'twoSteps' | 'noisy' (default 'box'), modes?: number of modes summed (default 80),
 *          D?: diffusivity (default 1), speed?: simulated time per real second (default 0.12),
 *          tMax?: time at which the animation stops (default 2.5), switchable?: boolean (default true) }
 */
export default function MathHeatModes({ initial = 'box', modes = 80, D = 1, speed = 0.12, tMax = 2.5, switchable = true }: {
  initial?: Init; modes?: number; D?: number; speed?: number; tMax?: number; switchable?: boolean;
}) {
  const P = Math.PI;
  const [init, setInit] = useState<Init>(initial);
  const [t, setT] = useState(0);
  const [running, setRunning] = useState(!prefersReducedMotion());
  useFrame((dt) => setT((v) => Math.min(tMax, v + dt * speed)), running);
  useEffect(() => { if (t >= tMax) setRunning(false); }, [t, tMax]);
  const f = useMemo(() => {
    const inside = (x: number, a: number, b: number) => (x >= a * P && x <= b * P ? 1 : 0);
    if (init === 'box') return (x: number) => inside(x, 0.35, 0.65);
    if (init === 'triangle') return (x: number) => 1 - Math.abs(x - P / 2) / (P / 2);
    if (init === 'twoSteps') return (x: number) => inside(x, 0.15, 0.35) - 0.6 * inside(x, 0.6, 0.85);
    return (x: number) => Math.sin(x) + 0.35 * Math.sin(7 * x) + 0.25 * Math.sin(15 * x);
  }, [init]);
  const b = useMemo(() => {
    const K = Math.max(1, Math.round(modes)), Q = 2000, h = P / Q;
    return Array.from({ length: K }, (_, i) => {
      let s = 0; for (let j = 0; j < Q; j++) { const x = (j + 0.5) * h; s += f(x) * Math.sin((i + 1) * x); }
      return (2 / P) * s * h;
    });
  }, [f, modes]);
  const u = (x: number) => b.reduce((s, bn, i) => s + bn * Math.exp(-D * (i + 1) ** 2 * t) * Math.sin((i + 1) * x), 0);
  const xs = Array.from({ length: 181 }, (_, i) => (P * i) / 180);
  const f0 = xs.map(f);
  const yr: [number, number] = [Math.min(0, ...f0) - 0.15, Math.max(0, ...f0) + 0.15];
  const L = 18, R = 312;
  const sx = scale([0, P], [L, R]), sy = scale(yr, [118, 10]);
  const cur = xs.map((x) => u(x));
  const span = Math.max(Math.abs(yr[0]), Math.abs(yr[1]));
  const bars = b.slice(0, 12);
  const bmax = Math.max(1e-9, ...bars.map(Math.abs));
  const bw = (R - L) / 12;
  const names: Init[] = ['box', 'triangle', 'twoSteps', 'noisy'];
  return (
    <div>
      <Stage w={320} h={226} label="Heat equation as decaying Fourier modes">
        <line x1={L} x2={R} y1={sy(0)} y2={sy(0)} stroke="var(--grid)" />
        <path d={pathOf(xs.map((x, i) => [sx(x), sy(f0[i])]))} fill="none" stroke="var(--muted)" strokeDasharray="4 3" strokeWidth={1.2} />
        <path d={pathOf(xs.map((x, i) => [sx(x), sy(cur[i])]))} fill="none" stroke="var(--c2)" strokeWidth={2.2} />
        {xs.slice(0, -1).map((x, i) => (
          <rect key={i} x={sx(x)} y={124} width={sx(xs[i + 1]) - sx(x) + 0.3} height={9}
            fill={cur[i] >= 0 ? 'var(--c5)' : 'var(--c2)'} fillOpacity={Math.min(1, Math.abs(cur[i]) / span)} />
        ))}
        <rect x={L} y={124} width={R - L} height={9} fill="none" stroke="var(--fg)" strokeWidth={0.6} />
        <text x={L} y={8} fontSize="9" fill="var(--fg)">t = {t.toFixed(3)}   u = 0 at both ends</text>
        {bars.map((bn, i) => {
          const hNow = (Math.abs(bn) * Math.exp(-D * (i + 1) ** 2 * t)) / bmax * 62;
          const h0 = (Math.abs(bn) / bmax) * 62;
          const x = L + i * bw + 3;
          return (
            <g key={i}>
              <rect x={x} y={208 - h0} width={bw - 6} height={h0} fill="none" stroke="var(--grid)" />
              <rect x={x} y={208 - hNow} width={bw - 6} height={hNow} fill={bn >= 0 ? 'var(--c1)' : 'var(--c5)'} />
              <text x={x + (bw - 6) / 2} y={218} fontSize="8" textAnchor="middle" fill="var(--muted)">{i + 1}</text>
            </g>
          );
        })}
        <text x={R} y={141} fontSize="8" textAnchor="end" fill="var(--muted)">mode n: |bₙ| e^(−D n² t)</text>
      </Stage>
      <Controls>
        <PlayPause running={running} set={(r) => { if (r && t >= tMax) setT(0); setRunning(r); }} />
        <Btn onClick={() => setT(0)}>Reset</Btn>
        <Slider label="time t" value={t} min={0} max={tMax} step={0.001} onChange={(v) => { setRunning(false); setT(v); }} format={(v) => v.toFixed(3)} />
        {switchable && names.map((nm) => <Btn key={nm} active={init === nm} onClick={() => { setInit(nm); setT(0); }}>{nm}</Btn>)}
      </Controls>
    </div>
  );
}
