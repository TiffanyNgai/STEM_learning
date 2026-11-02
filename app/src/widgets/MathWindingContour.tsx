import { useRef, useState, type PointerEvent as PE } from 'react';
import { Btn, Controls, PlayPause, Slider, Stage, prefersReducedMotion, scale, useFrame } from './_kit';

/**
 * Contour integral of f(z) = Σ_k c_k / (z − a_k)^p around a closed loop γ, computed numerically as a
 * point runs round the loop. Each pole a_k (×) has an arrow to the moving point; the running value of
 * ∮ f dz and of (1/2πi)∮ f dz are shown. With p = 1 the final value is 2πi Σ c_k·n(γ, a_k), where the
 * winding number n(γ, a) counts how many times γ goes anticlockwise round a. With p ≥ 2 the integral is 0.
 * Drag a pole or the loop's centre (the + mark); change radius, shape, laps and direction.
 * props: { poles?: [x, y, c][] (pole positions and coefficients/residues c, default [[0, 0, 1]]),
 *          power?: number (p, default 1), center?: [x, y] (default [0.3, 0.2]), radius?: number (default 1.3),
 *          laps?: number (signed: −1 = clockwise, 2 = twice round; default 1), shape?: 'circle' | 'blob' (default 'circle'),
 *          range?: number (default 2.6), animate?: boolean (default true) }
 */
type Cx = [number, number];
const div = (a: Cx, b: Cx): Cx => { const d = b[0] * b[0] + b[1] * b[1]; return [(a[0] * b[0] + a[1] * b[1]) / d, (a[1] * b[0] - a[0] * b[1]) / d]; };
const mul = (a: Cx, b: Cx): Cx => [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]];
const cpow = (a: Cx, p: number): Cx => { let r: Cx = [1, 0]; for (let i = 0; i < p; i++) r = mul(r, a); return r; };
const fmt = (v: number) => (Math.abs(v) < 0.005 ? '0.00' : v.toFixed(2));
const cs = (a: Cx) => `${fmt(a[0])} ${a[1] < -0.005 ? '−' : '+'} ${fmt(Math.abs(a[1]))}i`;

export default function MathWindingContour({ poles: p0 = [[0, 0, 1]], power = 1, center = [0.3, 0.2], radius = 1.3, laps: l0 = 1, shape: sh0 = 'circle', range = 2.6, animate = true }: {
  poles?: [number, number, number][]; power?: number; center?: [number, number]; radius?: number; laps?: number; shape?: 'circle' | 'blob'; range?: number; animate?: boolean;
}) {
  const [poles, setPoles] = useState<[number, number, number][]>(p0.slice(0, 4));
  const [c, setC] = useState<Cx>(center);
  const [R, setR] = useState(radius);
  const [laps, setLaps] = useState(l0 || 1);
  const [shape, setShape] = useState(sh0);
  const [t, setT] = useState(animate && !prefersReducedMotion() ? 0 : 1);
  const [running, setRunning] = useState(animate && !prefersReducedMotion());
  const drag = useRef<number | null>(null);
  const hold = useRef(0);
  const p = Math.max(1, Math.round(power));
  useFrame((dt) => {
    setT((x) => {
      if (x >= 1) { hold.current += dt; if (hold.current > 1.6) { hold.current = 0; return 0; } return 1; }
      return Math.min(1, x + dt / (3.5 * Math.abs(laps)));
    });
  }, running);

  const box: [number, number, number, number] = [4, 4, 206, 206];
  const sx = scale([-range, range], [box[0], box[2]]);
  const sy = scale([-range, range], [box[3], box[1]]);
  const gam = (u: number): Cx => {
    const th = 2 * Math.PI * laps * u;
    const rr = shape === 'blob' ? R * (1 + 0.28 * Math.cos(3 * th) + 0.12 * Math.sin(2 * th)) : R;
    return [c[0] + rr * Math.cos(th), c[1] + rr * Math.sin(th)];
  };
  const f = (z: Cx): Cx => poles.reduce<Cx>((acc, [x, y, k]) => { const q = div([k, 0], cpow([z[0] - x, z[1] - y], p)); return [acc[0] + q[0], acc[1] + q[1]]; }, [0, 0]);
  const M = 600 * Math.abs(laps);
  // running integral by midpoint rule up to t
  let I: Cx = [0, 0];
  const steps = Math.round(M * t);
  for (let i = 0; i < steps; i++) {
    const za = gam(i / M), zb = gam((i + 1) / M), zm = gam((i + 0.5) / M);
    const v = mul(f(zm), [zb[0] - za[0], zb[1] - za[1]]);
    I = [I[0] + v[0], I[1] + v[1]];
  }
  const I2pi = div(I, [0, 2 * Math.PI]);
  // winding numbers (full loop)
  const wind = poles.map(([x, y]) => {
    let s = 0; let prev = Math.atan2(gam(0)[1] - y, gam(0)[0] - x);
    for (let i = 1; i <= M; i++) { const z = gam(i / M); const a = Math.atan2(z[1] - y, z[0] - x); let d = a - prev; if (d > Math.PI) d -= 2 * Math.PI; if (d < -Math.PI) d += 2 * Math.PI; s += d; prev = a; }
    return Math.round(s / (2 * Math.PI));
  });
  const predicted = p === 1 ? poles.reduce((acc, [, , k], i) => acc + k * wind[i], 0) : 0;
  const pts: string[] = [];
  for (let i = 0; i <= 240; i++) { const z = gam(i / 240); pts.push(`${sx(z[0]).toFixed(1)},${sy(z[1]).toFixed(1)}`); }
  const trail: string[] = [];
  for (let i = 0; i <= Math.round(240 * t); i++) { const z = gam(i / 240); trail.push(`${sx(z[0]).toFixed(1)},${sy(z[1]).toFixed(1)}`); }
  const zt = gam(t);
  const arrowAt = (u: number) => { const a = gam(u), b = gam(u + 0.004 / Math.abs(laps)); return Math.atan2(-(b[1] - a[1]), b[0] - a[0]) * 180 / Math.PI; };

  const toPlane = (e: PE): Cx => {
    const svg = (e.currentTarget as SVGElement).ownerSVGElement!;
    const q0 = svg.createSVGPoint(); q0.x = e.clientX; q0.y = e.clientY;
    const q = q0.matrixTransform(svg.getScreenCTM()!.inverse());
    return [+(-range + ((q.x - box[0]) / (box[2] - box[0])) * 2 * range).toFixed(2), +(range - ((q.y - box[1]) / (box[3] - box[1])) * 2 * range).toFixed(2)];
  };
  const place = (k: number, z: Cx) => {
    if (k < 0) setC(z); else setPoles((ps) => ps.map((pp, i) => (i === k ? [z[0], z[1], pp[2]] : pp)));
  };
  const down = (e: PE) => {
    const z = toPlane(e);
    let best = -1, bd = Math.hypot(z[0] - c[0], z[1] - c[1]);
    poles.forEach(([x, y], i) => { const d = Math.hypot(z[0] - x, z[1] - y); if (d < bd) { bd = d; best = i; } });
    drag.current = best; (e.target as Element).setPointerCapture?.(e.pointerId); place(best, z);
  };
  const move = (e: PE) => { if (drag.current !== null) place(drag.current, toPlane(e)); };
  const up = () => { drag.current = null; };
  const cols = ['var(--c5)', 'var(--c4)', 'var(--c6)', 'var(--c3)'];
  return (
    <div>
      <Stage w={320} h={210} label="A point running round a closed loop, accumulating a contour integral">
        <rect x={box[0]} y={box[1]} width={box[2] - box[0]} height={box[3] - box[1]} fill="transparent" stroke="var(--grid)"
          onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} style={{ cursor: 'crosshair' }} />
        <g pointerEvents="none">
          <line x1={box[0]} x2={box[2]} y1={sy(0)} y2={sy(0)} stroke="var(--grid)" />
          <line y1={box[1]} y2={box[3]} x1={sx(0)} x2={sx(0)} stroke="var(--grid)" />
          <polyline points={pts.join(' ')} fill="none" stroke="var(--muted)" strokeWidth={1} strokeDasharray="3 3" />
          <polyline points={trail.join(' ')} fill="none" stroke="var(--c2)" strokeWidth={2.2} />
          {[0.12, 0.45, 0.78].map((u) => { const z = gam(u / Math.abs(laps)); return <path key={u} d="M-4,-3L3,0L-4,3z" fill="var(--c2)" transform={`translate(${sx(z[0])},${sy(z[1])}) rotate(${arrowAt(u / Math.abs(laps))})`} />; })}
          <path d={`M${sx(c[0]) - 4},${sy(c[1])}h8M${sx(c[0])},${sy(c[1]) - 4}v8`} stroke="var(--muted)" strokeWidth={1.2} />
          {poles.map(([x, y], i) => <line key={'a' + i} x1={sx(x)} y1={sy(y)} x2={sx(zt[0])} y2={sy(zt[1])} stroke={cols[i]} strokeWidth={1} opacity={0.7} />)}
          {poles.map(([x, y, k], i) => <g key={'p' + i} stroke={cols[i]} strokeWidth={2.2}>
            <path d={`M${sx(x) - 4},${sy(y) - 4}l8,8M${sx(x) - 4},${sy(y) + 4}l8,-8`} />
            <text x={sx(x) + 6} y={sy(y) + 12} fontSize="9" stroke="none" style={{ fill: cols[i] }}>{poles.length > 1 || k !== 1 ? `c=${k}` : 'a'}</text>
          </g>)}
          <circle cx={sx(zt[0])} cy={sy(zt[1])} r={4.5} fill="var(--c2)" />
        </g>
        <g fontSize="9">
          <text x={214} y={14} fontWeight="bold">f(z) = {poles.length === 1 && poles[0][2] === 1 ? '' : 'Σ c/'}{poles.length === 1 && poles[0][2] === 1 ? '1/' : ''}(z−a){p > 1 ? `^${p}` : ''}</text>
          <text x={214} y={32} style={{ fill: 'var(--muted)' }}>∮ f dz so far:</text>
          <text x={214} y={44}>{cs(I)}</text>
          <text x={214} y={60} style={{ fill: 'var(--muted)' }}>÷ 2πi:</text>
          <text x={214} y={72} fontSize="11" fontWeight="bold" style={{ fill: 'var(--c2)' }}>{cs(I2pi)}</text>
          <text x={214} y={92} style={{ fill: 'var(--muted)' }}>winding numbers:</text>
          {poles.map((_, i) => <text key={i} x={214} y={104 + 11 * i} style={{ fill: cols[i] }}>n(γ, {poles.length > 1 ? `a${i + 1}` : 'a'}) = {wind[i]}</text>)}
          <text x={214} y={116 + 11 * poles.length} style={{ fill: 'var(--muted)' }}>{p === 1 ? 'predicted ÷2πi:' : 'p ≥ 2: predicted 0'}</text>
          {p === 1 && <text x={214} y={128 + 11 * poles.length}>Σ c·n = {+predicted.toFixed(3)}</text>}
          <text x={214} y={202} fontSize="8" style={{ fill: 'var(--muted)' }}>drag × or + to move</text>
        </g>
      </Stage>
      <Controls>
        <PlayPause running={running} set={setRunning} />
        <Slider label="progress" min={0} max={1} value={t} onChange={(v) => { setRunning(false); setT(v); }} />
        <Slider label="radius" min={0.3} max={2.4} step={0.05} value={R} onChange={setR} />
        <Btn active={laps === 1} onClick={() => { setLaps(1); setT(0); }}>1 lap ↺</Btn>
        <Btn active={laps === 2} onClick={() => { setLaps(2); setT(0); }}>2 laps ↺</Btn>
        <Btn active={laps === -1} onClick={() => { setLaps(-1); setT(0); }}>clockwise ↻</Btn>
        <Btn active={shape === 'blob'} onClick={() => setShape(shape === 'blob' ? 'circle' : 'blob')}>wobbly loop</Btn>
      </Controls>
    </div>
  );
}
