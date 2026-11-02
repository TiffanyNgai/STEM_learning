import { useMemo, useState } from 'react';
import { Axes, Btn, C, Controls, PlayPause, Slider, Stage, pathOf, prefersReducedMotion, scale, useFrame } from './_kit';

type Knob = 'kp' | 'ki' | 'kd' | 'd';
/**
 * PID position control of a cart: m x'' = u − b x' + d(t), u = Kp e + Ki ∫e dt − Kd x'  (e = r − x).
 * (The D term acts on the measured velocity, which equals de/dt for a constant set-point and avoids a "derivative kick".)
 * Shows the cart driving to the set-point flag, the response x(t), optional control effort u(t),
 * and readouts: overshoot, 10–90 % rise time, 2 % settling time and final error.
 * props: { kp?: number (default 4), ki?: number (default 0), kd?: number (default 1),
 *          m?: kg (default 1), b?: viscous friction N·s/m (default 0.5), setpoint?: m (default 1),
 *          disturbance?: constant force N switched on at disturbanceTime (default 0), disturbanceTime?: s (default 5),
 *          uMax?: actuator limit N, 0 = unlimited (default 0), duration?: s (default 10),
 *          controls?: Knob[] sliders shown, from 'kp' | 'ki' | 'kd' | 'd' (default ['kp','ki','kd']),
 *          showEffort?: boolean plot u(t) too (default false) }
 */
export default function RobPID({ kp = 4, ki = 0, kd = 1, m = 1, b = 0.5, setpoint = 1, disturbance = 0, disturbanceTime = 5,
  uMax = 0, duration = 10, controls = ['kp', 'ki', 'kd'], showEffort = false }: {
  kp?: number; ki?: number; kd?: number; m?: number; b?: number; setpoint?: number; disturbance?: number;
  disturbanceTime?: number; uMax?: number; duration?: number; controls?: Knob[]; showEffort?: boolean;
}) {
  const [g, setG] = useState({ kp, ki, kd, d: disturbance });
  const [t, setT] = useState(prefersReducedMotion() ? duration : 0);
  const [running, setRunning] = useState(!prefersReducedMotion());
  useFrame((dt) => setT((x) => { const n = x + dt * (duration / 6); if (n >= duration) { setRunning(false); return duration; } return n; }), running);

  const sim = useMemo(() => {
    const h = 0.001; const n = Math.round(duration / h); const every = Math.max(1, Math.round(n / 400));
    let x = 0, v = 0, I = 0; const r = setpoint;
    const out: { t: number; x: number; u: number }[] = [];
    for (let i = 0; i <= n; i++) {
      const tt = i * h; const e = r - x;
      let u = g.kp * e + g.ki * I - g.kd * v;
      if (uMax > 0) u = Math.max(-uMax, Math.min(uMax, u));
      if (i % every === 0) out.push({ t: tt, x, u });
      const d = tt >= disturbanceTime ? g.d : 0;
      const a = (u - b * v + d) / m;
      v += a * h; x += v * h; I += e * h; // semi-implicit Euler
      if (!Number.isFinite(x) || Math.abs(x) > 1e3) { x = Math.sign(x) * 1e3 || 1e3; break; }
    }
    // metrics (step response before any disturbance)
    const r0 = setpoint; const pre = out.filter((s) => s.t < (g.d !== 0 ? disturbanceTime : duration + 1));
    const peak = Math.max(...pre.map((s) => s.x));
    const overshoot = Math.max(0, (peak - r0) / r0 * 100);
    const t10 = pre.find((s) => s.x >= 0.1 * r0)?.t; const t90 = pre.find((s) => s.x >= 0.9 * r0)?.t;
    let settle: number | undefined;
    for (let i = pre.length - 1; i >= 0; i--) if (Math.abs(pre[i].x - r0) > 0.02 * Math.abs(r0)) { settle = i < pre.length - 1 ? pre[i + 1].t : undefined; break; }
    if (settle === undefined && pre.length && Math.abs(pre[0].x - r0) <= 0.02 * Math.abs(r0)) settle = 0;
    const last = out[out.length - 1];
    return { out, overshoot, rise: t10 !== undefined && t90 !== undefined ? t90 - t10 : undefined, settle, ess: r0 - last.x };
  }, [g, m, b, setpoint, disturbanceTime, uMax, duration]);

  const W = 320, H = 230, box: [number, number, number, number] = [30, 66, 312, 214];
  const xs = sim.out.map((s) => s.x);
  const lo = Math.max(-1.5 * setpoint, Math.min(-0.1 * setpoint, ...xs)); const hi = Math.min(3 * setpoint, Math.max(1.5 * setpoint, ...xs));
  const sx = scale([0, duration], [box[0], box[2]]); const sy = scale([lo, hi], [box[3], box[1]]);
  const clipY = (y: number) => Math.max(box[1], Math.min(box[3], sy(y)));
  const shown = sim.out.filter((s) => s.t <= t);
  const now = shown[shown.length - 1] ?? sim.out[0];
  const umax = Math.max(1e-6, ...sim.out.map((s) => Math.abs(s.u)));
  const su = (u: number) => sy(0) - (u / umax) * (sy(0) - box[1]) * 0.9; // u = 0 drawn on the time axis
  // cart track
  const tx = scale([Math.min(0, lo), Math.max(hi, setpoint * 1.2)], [24, 300]);
  const cartX = Math.max(14, Math.min(306, tx(now.x)));
  const fmt = (v: number | undefined, unit: string) => (v === undefined ? '—' : v.toFixed(2) + unit);
  const set = (k: Knob) => (v: number) => { setG((s) => ({ ...s, [k]: v })); setT(0); setRunning(!prefersReducedMotion()); if (prefersReducedMotion()) setT(duration); };
  const meta: Record<Knob, [string, number, number, number]> = {
    kp: ['Kp', 0, 30, 0.1], ki: ['Ki', 0, 20, 0.1], kd: ['Kd', 0, 10, 0.05], d: ['load d (N)', -5, 5, 0.1],
  };
  const dOn = g.d !== 0 && now.t >= disturbanceTime;

  return (
    <div>
      <Stage w={W} h={H} label="PID control of a cart">
        {/* track, set-point flag, cart */}
        <line x1={10} x2={310} y1={40} y2={40} stroke="var(--muted)" />
        <line x1={tx(setpoint)} x2={tx(setpoint)} y1={12} y2={40} stroke={C[0]} strokeWidth={1.5} />
        <path d={`M${tx(setpoint)},12 l12,4 l-12,4Z`} fill={C[0]} />
        <line x1={tx(0)} x2={tx(0)} y1={36} y2={44} stroke="var(--muted)" />
        <rect x={cartX - 14} y={22} width={28} height={14} rx={3} fill={C[1]} />
        <circle cx={cartX - 8} cy={38} r={2.5} fill="var(--fg)" /><circle cx={cartX + 8} cy={38} r={2.5} fill="var(--fg)" />
        {Math.abs(now.u) > 1e-3 && <line x1={cartX} x2={cartX + Math.max(-40, Math.min(40, 30 * now.u / umax))} y1={29} y2={29} stroke={C[2]} strokeWidth={3} />}
        {dOn && <text x={cartX} y={18} fontSize="8" textAnchor="middle" fill={C[4]}>load {g.d > 0 ? '→' : '←'}</text>}
        <text x={6} y={56} fontSize="8.5" fill="var(--fg)">
          overshoot {sim.overshoot.toFixed(0)}% · rise {fmt(sim.rise, ' s')} · settle {fmt(sim.settle, ' s')} · final error {sim.ess.toFixed(3)}
        </text>
        <Axes x={[0, duration]} y={[lo, hi]} box={box} xLabel="t (s)" grid={false} />
        <line x1={box[0]} x2={box[2]} y1={sy(setpoint)} y2={sy(setpoint)} stroke={C[0]} strokeDasharray="4 3" />
        <line x1={box[0]} x2={box[2]} y1={sy(setpoint * 1.02)} y2={sy(setpoint * 1.02)} stroke={C[0]} strokeWidth={0.4} opacity={0.6} />
        <line x1={box[0]} x2={box[2]} y1={sy(setpoint * 0.98)} y2={sy(setpoint * 0.98)} stroke={C[0]} strokeWidth={0.4} opacity={0.6} />
        {g.d !== 0 && <line x1={sx(disturbanceTime)} x2={sx(disturbanceTime)} y1={box[1]} y2={box[3]} stroke={C[4]} strokeDasharray="2 3" />}
        {showEffort && <path d={pathOf(shown.map((s) => [sx(s.t), Math.max(box[1], Math.min(box[3], su(s.u)))]))} fill="none" stroke={C[2]} strokeWidth={1.2} opacity={0.8} />}
        <path d={pathOf(shown.map((s) => [sx(s.t), clipY(s.x)]))} fill="none" stroke={C[1]} strokeWidth={2} />
        <circle cx={sx(now.t)} cy={clipY(now.x)} r={3} fill={C[1]} />
        <text x={box[2]} y={box[1] - 2} fontSize="8" textAnchor="end" fill="var(--muted)">
          <tspan fill={C[1]}>x(t)</tspan>  <tspan fill={C[0]}>set-point ±2%</tspan>{showEffort && <tspan fill={C[2]}>  u(t) (scaled)</tspan>}
        </text>
      </Stage>
      <Controls>
        {controls.map((c) => <Slider key={c} label={meta[c][0]} min={meta[c][1]} max={meta[c][2]} step={meta[c][3]} value={g[c]} onChange={set(c)} />)}
        <PlayPause running={running} set={(r) => { if (r && t >= duration) setT(0); setRunning(r); }} />
        <Btn onClick={() => { setT(0); setRunning(true); }}>↺ Replay</Btn>
      </Controls>
    </div>
  );
}
