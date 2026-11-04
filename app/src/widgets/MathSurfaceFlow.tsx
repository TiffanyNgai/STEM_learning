import { useRef, useState } from 'react';
import { Btn, Controls, PlayPause, Slider, Stage, prefersReducedMotion, rng, useFrame } from './_kit';

/**
 * Flow of a tangent vector field on a sphere or a torus (orthographic 2D projection). Particles with short
 * trails follow the integral curves; zeros of the field are circled in red. A readout gives the number of
 * zeros and the sum of their indices, which always equals the Euler characteristic χ (Poincaré–Hopf):
 * χ(S²) = 2, so every field on the sphere has a zero (hairy ball theorem); χ(T²) = 0, and the torus carries
 * a nowhere-zero field.
 * Fields: 'sphere-rotation' (spin about the axis: two centres), 'sphere-gradient' (flow up the height
 * function z: source at S, sink at N), 'sphere-dipole' (the constant field of the plane carried over by
 * stereographic projection: a single zero of index 2 at N), 'torus-winding' (dφ/dt = 1, dθ/dt = slope: no
 * zeros; irrational slopes give dense orbits), 'torus-gradient' (uphill flow of the height function x on a
 * torus: max, min and two saddles).
 * props: { field?: string (default 'sphere-rotation'), fields?: string[] (buttons shown, default all five),
 *          slope?: number (winding slope, default 1.618), particles?: number (default 140), animate?: boolean (default true) }
 */
type V = [number, number, number];
type F = 'sphere-rotation' | 'sphere-gradient' | 'sphere-dipole' | 'torus-winding' | 'torus-gradient';
const ALL: F[] = ['sphere-rotation', 'sphere-gradient', 'sphere-dipole', 'torus-winding', 'torus-gradient'];
const LABEL: Record<F, string> = { 'sphere-rotation': 'S²: spin', 'sphere-gradient': 'S²: uphill', 'sphere-dipole': 'S²: one zero', 'torus-winding': 'T²: winding', 'torus-gradient': 'T²: uphill' };
const RR = 1, rr = 0.42; // torus radii
const CX = 160, CY = 100;
const dot = (a: V, b: V) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const isSphere = (f: F) => f.startsWith('sphere');
const viewOf = (f: F) => {
  const el = isSphere(f) ? 0.38 : 0.62, az = 0.35;
  const d: V = [Math.cos(el) * Math.cos(az), Math.cos(el) * Math.sin(az), Math.sin(el)];
  const rt: V = [-Math.sin(az), Math.cos(az), 0];
  const up: V = [-Math.sin(el) * Math.cos(az), -Math.sin(el) * Math.sin(az), Math.cos(el)];
  return { d, rt, up, S: isSphere(f) ? 80 : 96 };
};
const torusPt = (ph: number, th: number): V => [(RR + rr * Math.cos(th)) * Math.cos(ph), (RR + rr * Math.cos(th)) * Math.sin(ph), rr * Math.sin(th)];
const torusN = (ph: number, th: number): V => [Math.cos(th) * Math.cos(ph), Math.cos(th) * Math.sin(ph), Math.sin(th)];

/** Ambient velocity of a sphere field at unit vector p. */
function sphereField(f: F, p: V): V {
  const [x, y, z] = p;
  if (f === 'sphere-rotation') return [-y, x, 0];
  if (f === 'sphere-gradient') return [-x * z, -y * z, 1 - z * z];
  // dipole: push the field ∂/∂u1 of the plane to the sphere by inverse stereographic projection from N
  if (1 - z < 1e-6) return [0, 0, 0];
  const u1 = x / (1 - z), u2 = y / (1 - z), D = 1 + u1 * u1 + u2 * u2;
  return [2 / D - (4 * u1 * u1) / (D * D), (-4 * u1 * u2) / (D * D), (4 * u1) / (D * D)];
}
/** (dφ/dt, dθ/dt) of a torus field. */
function torusField(f: F, ph: number, th: number, slope: number): [number, number] {
  if (f === 'torus-winding') return [1, slope];
  return [-Math.sin(ph) / (RR + rr * Math.cos(th)), (-Math.sin(th) * Math.cos(ph)) / rr];
}
const ZEROS: Record<F, { pts: V[]; idx: string; chi: number }> = {
  'sphere-rotation': { pts: [[0, 0, 1], [0, 0, -1]], idx: '+1 +1', chi: 2 },
  'sphere-gradient': { pts: [[0, 0, 1], [0, 0, -1]], idx: '+1 +1', chi: 2 },
  'sphere-dipole': { pts: [[0, 0, 1]], idx: '+2', chi: 2 },
  'torus-winding': { pts: [], idx: '', chi: 0 },
  'torus-gradient': { pts: [torusPt(0, 0), torusPt(Math.PI, 0), torusPt(0, Math.PI), torusPt(Math.PI, Math.PI)], idx: '+1 +1 −1 −1', chi: 0 },
};
interface P { a: number; b: number; c: number; age: number; life: number; trail: V[] }

export default function MathSurfaceFlow({ field = 'sphere-rotation', fields, slope = 1.618, particles = 140, animate = true }: {
  field?: F; fields?: F[]; slope?: number; particles?: number; animate?: boolean;
}) {
  const [f, setF] = useState<F>(ALL.includes(field) ? field : 'sphere-rotation');
  const [k, setK] = useState(slope);
  const [run, setRun] = useState(animate && !prefersReducedMotion());
  const [, setTick] = useState(0);
  const R = useRef(rng(7));
  const spawn = (fl: F): P => {
    const u = R.current.u;
    if (isSphere(fl)) { const z = 2 * u() - 1, l = 2 * Math.PI * u(), s = Math.sqrt(1 - z * z); return { a: s * Math.cos(l), b: s * Math.sin(l), c: z, age: 0, life: 3 + 4 * u(), trail: [] }; }
    return { a: 2 * Math.PI * u(), b: 2 * Math.PI * u(), c: 0, age: 0, life: 3 + 4 * u(), trail: [] };
  };
  const parts = useRef<P[]>([]);
  const fieldRef = useRef<F | null>(null);
  if (fieldRef.current !== f || parts.current.length !== particles) {
    fieldRef.current = f;
    parts.current = Array.from({ length: particles }, () => { const p = spawn(f); p.age = p.life * R.current.u(); return p; });
  }
  const pos = (p: P): V => (isSphere(f) ? [p.a, p.b, p.c] : torusPt(p.a, p.b));
  const step = (dt: number) => {
    const h = dt * (f === 'sphere-dipole' ? 0.35 : 0.6);
    for (let i = 0; i < parts.current.length; i++) {
      let p = parts.current[i];
      p.age += dt;
      if (p.age > p.life) { p = parts.current[i] = spawn(f); }
      if (isSphere(f)) {
        const x: V = [p.a, p.b, p.c];
        const v1 = sphereField(f, x);
        const m: V = [x[0] + 0.5 * h * v1[0], x[1] + 0.5 * h * v1[1], x[2] + 0.5 * h * v1[2]];
        const v2 = sphereField(f, m);
        const y: V = [x[0] + h * v2[0], x[1] + h * v2[1], x[2] + h * v2[2]];
        const n = Math.hypot(...y); p.a = y[0] / n; p.b = y[1] / n; p.c = y[2] / n;
      } else {
        const [d1, d2] = torusField(f, p.a, p.b, k);
        const [e1, e2] = torusField(f, p.a + 0.5 * h * d1, p.b + 0.5 * h * d2, k);
        p.a = (p.a + h * e1) % (2 * Math.PI); p.b = (p.b + h * e2) % (2 * Math.PI);
      }
      p.trail.push(pos(p)); if (p.trail.length > 9) p.trail.shift();
    }
    setTick((t) => t + 1);
  };
  useFrame((dt) => step(dt), run);

  const { d, rt, up, S } = viewOf(f);
  const pr = (q: V): [number, number] => [CX + S * dot(q, rt), CY - S * dot(q, up)];
  const facing = (q: V, a?: number, b?: number) => (isSphere(f) ? dot(q, d) >= 0 : dot(torusN(a!, b!), d) >= 0);
  // wireframe
  const wire: { pts: string; front: boolean }[] = [];
  const addLine = (samples: [V, boolean][]) => {
    let cur: string[] = [], side: boolean | null = null;
    for (const [q, fr] of samples) {
      const s = pr(q).map((x) => x.toFixed(1)).join(',');
      if (side !== null && fr !== side) { wire.push({ pts: [...cur, s].join(' '), front: side }); cur = [s]; } else cur.push(s);
      side = fr;
    }
    if (cur.length > 1) wire.push({ pts: cur.join(' '), front: !!side });
  };
  if (isSphere(f)) {
    for (let la = -60; la <= 60; la += 30) addLine(Array.from({ length: 61 }, (_, i) => { const l = (i / 60) * 2 * Math.PI, a = (la * Math.PI) / 180; const q: V = [Math.cos(a) * Math.cos(l), Math.cos(a) * Math.sin(l), Math.sin(a)]; return [q, facing(q)]; }));
    for (let lo = 0; lo < 180; lo += 30) addLine(Array.from({ length: 61 }, (_, i) => { const a = (i / 60) * 2 * Math.PI, l = (lo * Math.PI) / 180; const q: V = [Math.cos(a) * Math.cos(l), Math.cos(a) * Math.sin(l), Math.sin(a)]; return [q, facing(q)]; }));
  } else {
    for (let j = 0; j < 8; j++) { const th = (j / 8) * 2 * Math.PI; addLine(Array.from({ length: 73 }, (_, i) => { const ph = (i / 72) * 2 * Math.PI; return [torusPt(ph, th), facing([0, 0, 0], ph, th)]; })); }
    for (let j = 0; j < 16; j++) { const ph = (j / 16) * 2 * Math.PI; addLine(Array.from({ length: 41 }, (_, i) => { const th = (i / 40) * 2 * Math.PI; return [torusPt(ph, th), facing([0, 0, 0], ph, th)]; })); }
  }
  const z = ZEROS[f];
  const opts = fields ?? ALL;
  return (
    <div>
      <Stage w={320} h={212} label={`Flow of a vector field on the ${isSphere(f) ? 'sphere' : 'torus'}`}>
        {isSphere(f) && <circle cx={CX} cy={CY} r={S} fill="var(--c6)" fillOpacity={0.07} stroke="var(--fg)" strokeWidth={1.2} />}
        {wire.map((w, i) => <polyline key={i} points={w.pts} fill="none" stroke={w.front ? 'var(--muted)' : 'var(--grid)'} strokeWidth={w.front ? 0.7 : 0.5} opacity={w.front ? 0.7 : 0.6} strokeDasharray={w.front ? undefined : '2 2'} />)}
        {parts.current.map((p, i) => {
          if (p.trail.length < 2) return null;
          const last = p.trail[p.trail.length - 1];
          const fr = isSphere(f) ? facing(last) : facing(last, p.a, p.b);
          const fade = Math.min(1, p.age / 0.6, (p.life - p.age) / 0.6);
          return <polyline key={i} points={p.trail.map((q) => pr(q).map((x) => x.toFixed(1)).join(',')).join(' ')} fill="none"
            stroke={fr ? 'var(--c2)' : 'var(--c2)'} strokeWidth={fr ? 1.8 : 1} opacity={(fr ? 0.95 : 0.25) * Math.max(0, fade)} strokeLinecap="round" />;
        })}
        {z.pts.map((q, i) => { const [x, y] = pr(q); return <circle key={i} cx={x} cy={y} r={6} fill="none" stroke="var(--c5)" strokeWidth={2} opacity={dot(q, d) >= -0.2 ? 1 : 0.4} />; })}
        <text x={4} y={14} fontSize="10.5" fontWeight="bold">{isSphere(f) ? 'sphere S²' : 'torus T²'}</text>
        <text x={4} y={196} fontSize="9.5" style={{ fill: 'var(--c5)' }}>zeros: {z.pts.length}{z.idx ? `  (indices ${z.idx})` : ''}</text>
        <text x={4} y={208} fontSize="9.5">index sum = {z.chi} = χ({isSphere(f) ? 'S²' : 'T²'})</text>
        {f === 'sphere-dipole' && <text x={316} y={14} fontSize="8.5" textAnchor="end" style={{ fill: 'var(--muted)' }}>flow lines are circles through N</text>}
      </Stage>
      <Controls>
        <PlayPause running={run} set={setRun} />
        {opts.map((o) => <Btn key={o} active={o === f} onClick={() => setF(o)}>{LABEL[o]}</Btn>)}
        {f === 'torus-winding' && <Slider label="slope" min={0} max={3} step={0.001} value={k} onChange={setK} />}
      </Controls>
    </div>
  );
}
