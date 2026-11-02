import { useRef, useState } from 'react';
import { Axes, Btn, Controls, PlayPause, Slider, Stage, pathOf, prefersReducedMotion, rng, scale, useFrame } from './_kit';

/**
 * Bifurcation diagram of a 1D normal form x' = f(x, r): fixed points x* plotted against the
 * parameter r (solid green = stable, dashed red = unstable). The vertical line at the current r
 * is that system's phase line: arrows show the flow direction and dots flow along it.
 * kinds: 'saddle-node' (x' = r + x²), 'transcritical' (x' = rx − x²),
 *        'pitchfork' (supercritical, x' = rx − x³), 'subcritical' (x' = rx + x³ − x⁵).
 * props: { kind?: string (default 'pitchfork'), r?: number (initial r, default −0.5),
 *          switchable?: boolean (show buttons to change kind, default false) }
 */
type Kind = 'saddle-node' | 'transcritical' | 'pitchfork' | 'subcritical';
const F: Record<Kind, (x: number, r: number) => number> = {
  'saddle-node': (x, r) => r + x * x,
  transcritical: (x, r) => r * x - x * x,
  pitchfork: (x, r) => r * x - x * x * x,
  subcritical: (x, r) => r * x + x ** 3 - x ** 5,
};
const LABEL: Record<Kind, string> = {
  'saddle-node': "x' = r + x²", transcritical: "x' = rx − x²", pitchfork: "x' = rx − x³", subcritical: "x' = rx + x³ − x⁵",
};
/** Fixed points of f(·, r) in [-2, 2], found by sign changes + bisection (plus exact zeros). */
function roots(f: (x: number) => number): number[] {
  const out: number[] = [];
  const N = 400; let a = -2.2, fa = f(a);
  for (let i = 1; i <= N; i++) {
    const b = -2.2 + (4.4 * i) / N, fb = f(b);
    if (fa === 0) out.push(a);
    else if (fa * fb < 0) {
      let lo = a, hi = b;
      for (let k = 0; k < 40; k++) { const m = (lo + hi) / 2; if (f(lo) * f(m) <= 0) hi = m; else lo = m; }
      out.push((lo + hi) / 2);
    }
    a = b; fa = fb;
  }
  return out;
}

export default function MathBifurcation({ kind: k0 = 'pitchfork', r: r0 = -0.5, switchable = false }: { kind?: string; r?: number; switchable?: boolean }) {
  const [kind, setKind] = useState<Kind>((k0 in F ? k0 : 'pitchfork') as Kind);
  const [r, setR] = useState(r0);
  const [running, setRunning] = useState(!prefersReducedMotion());
  const f = F[kind];
  const box: [number, number, number, number] = [30, 10, 310, 180];
  const sx = scale([-2, 2], [box[0], box[2]]); const sy = scale([-2, 2], [box[3], box[1]]);
  const dfdx = (x: number, rr: number) => (f(x + 1e-5, rr) - f(x - 1e-5, rr)) / 2e-5;

  // Branches: sample r, collect roots, colour each tiny segment by stability.
  const stable: string[] = [], unstable: string[] = [];
  const M = 160;
  let prev: number[] = [];
  for (let i = 0; i <= M; i++) {
    const rr = -2 + (4 * i) / M;
    const rs = roots((x) => f(x, rr)).filter((x) => Math.abs(x) <= 2.05);
    const rp = -2 + (4 * (i - 1)) / M;
    for (const x of rs) {
      const near = prev.length ? prev.reduce((b, p) => (Math.abs(p - x) < Math.abs(b - x) ? p : b)) : NaN;
      if (Number.isFinite(near) && Math.abs(near - x) < 0.25) {
        const seg = pathOf([[sx(rp), sy(near)], [sx(rr), sy(x)]]);
        (dfdx((x + near) / 2, (rr + rp) / 2) < 0 ? stable : unstable).push(seg);
      }
    }
    prev = rs;
  }

  const R = useRef(rng(3));
  const dots = useRef(Array.from({ length: 10 }, (_, i) => ({ x: -1.9 + (3.8 * i) / 9, age: 0 })));
  const [, force] = useState(0);
  useFrame((dt) => {
    for (const d of dots.current) {
      for (let s = 0; s < 4; s++) d.x += f(d.x, r) * dt / 4;
      d.age += dt;
      if (!Number.isFinite(d.x) || Math.abs(d.x) > 2.2 || d.age > 5) { d.x = (R.current.u() * 2 - 1) * 2; d.age = 0; }
    }
    force((v) => v + 1);
  }, running);

  const fps = roots((x) => f(x, r)).filter((x) => Math.abs(x) <= 2);
  const arrows = [];
  for (let j = 0; j < 9; j++) {
    const x = -1.8 + (3.6 * j) / 8; const v = f(x, r);
    if (Math.abs(v) < 0.02) continue;
    const y1 = sy(x), y2 = y1 - Math.sign(v) * 7;
    arrows.push(<line key={j} x1={sx(r) + 6} x2={sx(r) + 6} y1={y1} y2={y2} stroke="var(--fg)" strokeWidth={1} markerEnd="url(#bif-arr)" />);
  }
  return (
    <div>
      <Stage w={320} h={196} label={`Bifurcation diagram of ${LABEL[kind]}`}>
        <defs><marker id="bif-arr" viewBox="0 0 6 6" refX="5" refY="3" markerWidth="4" markerHeight="4" orient="auto"><path d="M0,0L6,3L0,6z" fill="var(--fg)" /></marker></defs>
        <Axes x={[-2, 2]} y={[-2, 2]} box={box} grid={false} xLabel="r" yLabel="x*" />
        <path d={stable.join('')} stroke="var(--c1)" strokeWidth={2.4} fill="none" />
        <path d={unstable.join('')} stroke="var(--c5)" strokeWidth={2} strokeDasharray="4 3" fill="none" />
        <line x1={sx(r)} x2={sx(r)} y1={box[1]} y2={box[3]} stroke="var(--c2)" strokeWidth={1.2} opacity={0.6} />
        {arrows}
        {dots.current.map((d, i) => <circle key={i} cx={sx(r)} cy={sy(Math.max(-2.1, Math.min(2.1, d.x)))} r={2.6} fill="var(--c2)" opacity={0.8} />)}
        {fps.map((x, i) => (
          <circle key={'f' + i} cx={sx(r)} cy={sy(x)} r={4} strokeWidth={1.6}
            style={{ fill: dfdx(x, r) < 0 ? 'var(--c1)' : 'var(--surface)', stroke: dfdx(x, r) < 0 ? 'var(--c1)' : 'var(--c5)' }} />
        ))}
        <text x={box[0] + 4} y={192} fontSize="9">{LABEL[kind]} · r = {r.toFixed(2)} · {fps.length} fixed point{fps.length === 1 ? '' : 's'}</text>
      </Stage>
      <Controls>
        <Slider label="r" min={-2} max={2} step={0.01} value={r} onChange={setR} />
        <PlayPause running={running} set={setRunning} />
        {switchable && (Object.keys(F) as Kind[]).map((k) => <Btn key={k} active={k === kind} onClick={() => setKind(k)}>{k}</Btn>)}
      </Controls>
    </div>
  );
}
