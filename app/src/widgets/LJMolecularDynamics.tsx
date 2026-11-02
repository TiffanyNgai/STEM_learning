import { useRef, useState } from 'react';
import { Btn, Controls, PlayPause, Slider, Stage, pathOf, prefersReducedMotion, rng, useFrame } from './_kit';

/**
 * 2D Lennard-Jones fluid integrated with velocity Verlet in a periodic box (reduced units: σ = ε = m = k_B = 1),
 * with a live plot of kinetic, potential and total energy per particle. Without a thermostat (NVE) the total
 * energy should stay flat — raise the time step to watch it drift. With the Berendsen thermostat on (≈NVT),
 * the temperature relaxes to the target. Changing T in NVE mode rescales all velocities once ("heating").
 * props: { n?: number (default 30), temperature?: number (default 0.8), thermostat?: boolean (default false),
 *          dt?: number (default 0.005), density?: number (default 0.5), autoRun?: boolean (default true), showDt?: boolean (default true) }
 */
const RC = 2.5, UC = 4 * (RC ** -12 - RC ** -6);

export default function LJMolecularDynamics({ n = 30, temperature = 0.8, thermostat = false, dt: dt0 = 0.005, density = 0.5, autoRun = true, showDt = true }: {
  n?: number; temperature?: number; thermostat?: boolean; dt?: number; density?: number; autoRun?: boolean; showDt?: boolean;
}) {
  const L = Math.sqrt(n / density);
  const [running, setRunning] = useState(autoRun && !prefersReducedMotion());
  const [T0, setT0] = useState(temperature);
  const [thermo, setThermo] = useState(thermostat);
  const [dt, setDt] = useState(dt0);
  const [, force] = useState(0);

  const forces = (x: Float64Array, f: Float64Array) => {
    f.fill(0); let pe = 0;
    for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) {
      let dx = x[2 * i] - x[2 * j], dy = x[2 * i + 1] - x[2 * j + 1];
      dx -= L * Math.round(dx / L); dy -= L * Math.round(dy / L); // minimum image
      const r2 = dx * dx + dy * dy;
      if (r2 > RC * RC) continue;
      const ir6 = 1 / (r2 * r2 * r2);
      pe += 4 * (ir6 * ir6 - ir6) - UC;
      const fr = (24 * (2 * ir6 * ir6 - ir6)) / r2; // F·r / r²
      f[2 * i] += fr * dx; f[2 * i + 1] += fr * dy; f[2 * j] -= fr * dx; f[2 * j + 1] -= fr * dy;
    }
    return pe;
  };
  const init = (T: number) => {
    const r = rng(11); const side = Math.ceil(Math.sqrt(n)); const a = L / side;
    const x = new Float64Array(2 * n), v = new Float64Array(2 * n), f = new Float64Array(2 * n);
    for (let i = 0; i < n; i++) { x[2 * i] = (i % side + 0.5) * a + 0.05 * r.normal(); x[2 * i + 1] = (Math.floor(i / side) + 0.5) * a + 0.05 * r.normal(); }
    for (let k = 0; k < 2 * n; k++) v[k] = r.normal();
    let mx = 0, my = 0; for (let i = 0; i < n; i++) { mx += v[2 * i] / n; my += v[2 * i + 1] / n; }
    for (let i = 0; i < n; i++) { v[2 * i] -= mx; v[2 * i + 1] -= my; }
    rescale(v, T);
    const pe = forces(x, f);
    return { x, v, f, pe, hist: [] as [number, number, number][], time: 0 };
  };
  const kinetic = (v: Float64Array) => { let k = 0; for (let i = 0; i < v.length; i++) k += v[i] * v[i]; return 0.5 * k; };
  const tempOf = (v: Float64Array) => (2 * kinetic(v)) / (2 * n - 2); // 2D, minus 2 dof for fixed momentum
  function rescale(v: Float64Array, T: number) { const c = Math.sqrt(T / Math.max(1e-9, tempOf(v))); for (let k = 0; k < v.length; k++) v[k] *= c; }

  const s = useRef<ReturnType<typeof init> | null>(null);
  if (!s.current) s.current = init(T0);

  useFrame(() => {
    const st = s.current!; const { x, v, f } = st;
    for (let step = 0; step < 6; step++) {
      for (let k = 0; k < 2 * n; k++) { v[k] += 0.5 * dt * f[k]; x[k] += dt * v[k]; x[k] -= L * Math.floor(x[k] / L); }
      st.pe = forces(x, f);
      for (let k = 0; k < 2 * n; k++) v[k] += 0.5 * dt * f[k];
      if (thermo) { const lam = Math.sqrt(1 + (dt / 0.1) * (T0 / Math.max(1e-9, tempOf(v)) - 1)); for (let k = 0; k < 2 * n; k++) v[k] *= lam; }
      st.time += dt;
    }
    const ke = kinetic(v) / n, pe = st.pe / n;
    if (!Number.isFinite(ke + pe) || ke > 50) { s.current = init(T0); return; } // blew up: restart
    st.hist.push([ke, pe, ke + pe]); if (st.hist.length > 180) st.hist.shift();
    force((c) => c + 1);
  }, running);

  const st = s.current!;
  const sc = 150 / L;
  const H = st.hist;
  const all = H.flat();
  const lo = all.length ? Math.min(...all) : -2, hi = all.length ? Math.max(...all) : 2;
  const pad = 0.1 * (hi - lo || 1);
  const py = (e: number) => 150 - ((e - (lo - pad)) / (hi - lo + 2 * pad)) * 138;
  const series = [0, 1, 2].map((c) => pathOf(H.map((h, i) => [168 + (i * 146) / 179, py(h[c])])));
  const Tnow = tempOf(st.v);
  const drift = H.length > 2 ? H[H.length - 1][2] - H[0][2] : 0;
  const vmax = Math.sqrt(3 * Math.max(T0, 0.1));

  return (
    <div>
      <Stage w={320} h={176} label="Lennard-Jones molecular dynamics">
        <rect x={6} y={8} width={150} height={150} fill="none" stroke="var(--muted)" strokeDasharray="4 3" />
        {Array.from({ length: n }, (_, i) => {
          const sp = Math.hypot(st.v[2 * i], st.v[2 * i + 1]);
          return <circle key={i} cx={6 + st.x[2 * i] * sc} cy={8 + st.x[2 * i + 1] * sc} r={0.5 * sc}
            fill={sp > vmax ? 'var(--c5)' : sp > vmax / 2 ? 'var(--c3)' : 'var(--c2)'} opacity={0.85} />;
        })}
        <rect x={166} y={8} width={150} height={146} fill="none" stroke="var(--grid)" />
        {H.length > 1 && series.map((d, i) => <path key={i} d={d} fill="none" stroke={['var(--c1)', 'var(--c2)', 'var(--fg)'][i]} strokeWidth={i === 2 ? 2 : 1.5} />)}
        <text x={170} y={18} fontSize="8.5" fill="var(--c1)">kinetic</text>
        <text x={204} y={18} fontSize="8.5" fill="var(--c2)">potential</text>
        <text x={248} y={18} fontSize="8.5" fill="var(--fg)" fontWeight={700}>total (per atom)</text>
        <text x={6} y={171} fontSize="8.5" fill="var(--fg)">T = {Tnow.toFixed(2)} · t = {st.time.toFixed(1)} τ</text>
        <text x={316} y={171} textAnchor="end" fontSize="8.5" fill={Math.abs(drift) > 0.05 ? 'var(--c5)' : 'var(--muted)'}>
          ΔE_total over window: {drift >= 0 ? '+' : ''}{drift.toFixed(3)}
        </text>
      </Stage>
      <Controls>
        <PlayPause running={running} set={setRunning} />
        <Btn onClick={() => { s.current = init(T0); force((c) => c + 1); }}>↺ Reset</Btn>
        <Btn active={thermo} onClick={() => setThermo(!thermo)}>{thermo ? 'Thermostat ON (NVT)' : 'Thermostat OFF (NVE)'}</Btn>
      </Controls>
      <Controls>
        <Slider label="T target" min={0.1} max={3} step={0.05} value={T0}
          onChange={(v) => { setT0(v); if (!thermo) rescale(s.current!.v, v); }} />
        {showDt && <Slider label="Δt" min={0.001} max={0.02} step={0.001} value={dt} onChange={setDt} format={(v) => v.toFixed(3)} />}
      </Controls>
    </div>
  );
}
