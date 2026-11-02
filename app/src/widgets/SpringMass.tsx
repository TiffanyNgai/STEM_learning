import { useRef, useState } from 'react';
import { Btn, C, Controls, PlayPause, Slider, Stage, pathOf, prefersReducedMotion, useFrame } from './_kit';

type Knob = 'k' | 'm' | 'b' | 'F0' | 'wd';
/**
 * Mass on a horizontal spring: m x'' = -k x - b x' + F0 cos(ω_d t).
 * Shows the animated spring, a scrolling x(t) trace, and kinetic / potential / total energy bars.
 * props: { k?: N/m (default 10), m?: kg (default 1), b?: damping kg/s (default 0), F0?: drive amplitude N (default 0),
 *          wd?: drive angular frequency rad/s (default 3), x0?: initial displacement m (default 1),
 *          controls?: Knob[] sliders shown (default ['k','m','b']), showEnergy?: boolean (default true) }
 */
export default function SpringMass({ k: k0 = 10, m: m0 = 1, b: b0 = 0, F0: F00 = 0, wd: wd0 = 3, x0 = 1,
  controls = ['k', 'm', 'b'], showEnergy = true }: {
  k?: number; m?: number; b?: number; F0?: number; wd?: number; x0?: number; controls?: Knob[]; showEnergy?: boolean;
}) {
  const [p, setP] = useState({ k: k0, m: m0, b: b0, F0: F00, wd: wd0 });
  const st = useRef({ x: x0, v: 0, t: 0, trace: [] as [number, number][], emax: 0 });
  const [running, setRunning] = useState(!prefersReducedMotion());
  const [, force] = useState(0);
  const acc = (x: number, v: number, t: number) => (-p.k * x - p.b * v + p.F0 * Math.cos(p.wd * t)) / p.m;
  useFrame((dt) => {
    const s = st.current; const n = 8; const h = dt / n;
    for (let i = 0; i < n; i++) { // RK4
      const { x, v, t } = s;
      const k1x = v, k1v = acc(x, v, t);
      const k2x = v + h / 2 * k1v, k2v = acc(x + h / 2 * k1x, v + h / 2 * k1v, t + h / 2);
      const k3x = v + h / 2 * k2v, k3v = acc(x + h / 2 * k2x, v + h / 2 * k2v, t + h / 2);
      const k4x = v + h * k3v, k4v = acc(x + h * k3x, v + h * k3v, t + h);
      s.x += h / 6 * (k1x + 2 * k2x + 2 * k3x + k4x); s.v += h / 6 * (k1v + 2 * k2v + 2 * k3v + k4v); s.t += h;
    }
    if (!Number.isFinite(s.x) || Math.abs(s.x) > 50) { s.x = x0; s.v = 0; }
    s.trace.push([s.t, s.x]);
    while (s.trace.length && s.trace[0][0] < s.t - 10) s.trace.shift();
    force((c) => c + 1);
  }, running);
  const s = st.current;
  const w0 = Math.sqrt(p.k / p.m);
  // spring drawing
  const scaleX = 40; // px per metre
  const eq = 165; const blockX = eq + Math.max(-3, Math.min(3, s.x)) * scaleX;
  const wall = 20; const coils = 12; const sp: [number, number][] = [[wall, 40], [wall + 8, 40]];
  const span = blockX - 16 - (wall + 16);
  for (let i = 0; i <= coils; i++) sp.push([wall + 8 + 4 + (span * i) / coils, 40 + (i === 0 || i === coils ? 0 : i % 2 ? -8 : 8)]);
  sp.push([blockX - 16, 40]);
  // trace
  const gx0 = 20, gx1 = showEnergy ? 236 : 310, gy0 = 82, gy1 = 182, gm = (gy0 + gy1) / 2;
  const ss = p.F0 / Math.max(0.05, Math.hypot(p.k - p.m * p.wd * p.wd, p.b * p.wd)); // steady-state amplitude
  const amp = Math.max(1.2, Math.abs(x0) * 1.2, Math.min(3, ss * 1.2));
  const ty = (x: number) => gm - (x / amp) * (gy1 - gy0) / 2;
  const tr: [number, number][] = s.trace.map(([t, x]) => [gx1 - ((s.t - t) / 10) * (gx1 - gx0), Math.max(gy0, Math.min(gy1, ty(x)))]);
  // energy
  const KE = 0.5 * p.m * s.v * s.v; const PE = 0.5 * p.k * s.x * s.x; const E = KE + PE;
  s.emax = Math.max(s.emax, E);
  const Eref = Math.max(0.5 * p.k * x0 * x0, s.emax, 0.01);
  const bar = (val: number, i: number, label: string) => {
    const hgt = Math.min(1, val / (Eref * 1.05)) * (gy1 - gy0);
    return (
      <g key={label}>
        <rect x={248 + i * 22} y={gy1 - hgt} width={16} height={hgt} fill={C[[1, 2, 3][i]]} />
        <text x={256 + i * 22} y={gy1 + 10} fontSize="8" textAnchor="middle" fill="var(--fg)">{label}</text>
      </g>
    );
  };
  const reset = () => { st.current = { x: x0, v: 0, t: 0, trace: [], emax: 0 }; force((c) => c + 1); };
  const set = (key: Knob) => (v: number) => setP((q) => ({ ...q, [key]: v }));
  const meta: Record<Knob, [string, number, number, number]> = {
    k: ['k (N/m)', 1, 40, 0.5], m: ['m (kg)', 0.2, 5, 0.1], b: ['damping b (kg/s)', 0, 10, 0.05],
    F0: ['drive F₀ (N)', 0, 10, 0.1], wd: ['drive ω_d (rad/s)', 0.2, 10, 0.05],
  };
  return (
    <div>
      <Stage h={200} label="Mass on a spring with energy bars">
        <rect x={wall - 8} y={18} width={8} height={44} fill="var(--grid)" />
        <line x1={10} x2={315} y1={62} y2={62} stroke="var(--muted)" />
        <line x1={eq} x2={eq} y1={14} y2={66} stroke="var(--muted)" strokeDasharray="2 2" />
        <text x={eq} y={11} fontSize="8" textAnchor="middle" fill="var(--muted)">x = 0</text>
        <path d={pathOf(sp)} fill="none" stroke="var(--fg)" strokeWidth={1.4} strokeLinejoin="round" />
        <rect x={blockX - 16} y={26} width={32} height={34} rx={4} fill={C[0]} />
        <text x={blockX} y={47} fontSize="9" textAnchor="middle" fill="var(--surface, #fff)">m</text>
        {p.F0 > 0 && <text x={blockX} y={22} fontSize="8" textAnchor="middle" fill={C[4]}>{'F = ' + (p.F0 * Math.cos(p.wd * s.t)).toFixed(1) + ' N'}</text>}
        <line x1={gx0} x2={gx1} y1={gm} y2={gm} stroke="var(--grid)" />
        <line x1={gx0} x2={gx0} y1={gy0} y2={gy1} stroke="var(--fg)" strokeWidth={0.8} />
        <text x={gx0 + 3} y={gy0 + 7} fontSize="8" fill="var(--fg)">x(t), last 10 s</text>
        <path d={pathOf(tr)} fill="none" stroke={C[0]} strokeWidth={1.6} />
        {showEnergy && [bar(KE, 0, 'KE'), bar(PE, 1, 'PE'), bar(E, 2, 'E')]}
        <text x={gx0} y={196} fontSize="8" fill="var(--muted)">
          ω₀ = √(k/m) = {w0.toFixed(2)} rad/s · T = {(2 * Math.PI / w0).toFixed(2)} s{p.b > 0 ? ` · Q ≈ ${(p.m * w0 / p.b).toFixed(1)}` : ''}
        </text>
      </Stage>
      <Controls>
        {controls.map((c) => <Slider key={c} label={meta[c][0]} min={meta[c][1]} max={meta[c][2]} step={meta[c][3]} value={p[c]} onChange={set(c)} />)}
        <PlayPause running={running} set={setRunning} />
        <Btn onClick={reset}>↺ Reset</Btn>
      </Controls>
    </div>
  );
}
