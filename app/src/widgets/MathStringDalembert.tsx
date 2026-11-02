import { useState } from 'react';
import { Btn, Controls, PlayPause, Slider, Stage, pathOf, prefersReducedMotion, scale, useFrame } from './_kit';

type Mode = 'line' | 'fixed';
type Shape = 'bump' | 'pluck';
/**
 * Wave equation u_tt = c² u_xx for a string released from rest with shape φ, solved by d'Alembert:
 *   u(x, t) = ½[φ(x − ct) + φ(x + ct)].
 * The string is solid; its two half-height travelling copies ½φ(x − ct) (right-moving) and ½φ(x + ct)
 * (left-moving) are dashed.
 *   mode 'line':  an infinitely long string (view −L…L). The shape splits in two and the halves leave at speed c.
 *                 Dotted lines mark the "signal front" ±(a + ct), a = half-width of the initial disturbance.
 *   mode 'fixed': ends x = 0 and x = L held fixed. φ is extended as an odd, 2L-periodic function, so pulses
 *                 reflect upside down and the whole motion repeats with period 2L/c.
 * props: { mode?: Mode (default 'line'), shape?: Shape (default 'bump'), c?: wave speed (default 1),
 *          length?: L (default 10), showParts?: boolean (default true) }
 */
export default function MathStringDalembert({ mode = 'line', shape = 'bump', c = 1, length = 10, showParts = true }: {
  mode?: Mode; shape?: Shape; c?: number; length?: number; showParts?: boolean;
}) {
  const Lg = length;
  const [sh, setSh] = useState<Shape>(shape);
  const [speed, setSpeed] = useState(c);
  const [parts, setParts] = useState(showParts);
  const [t, setT] = useState(0);
  const [running, setRunning] = useState(!prefersReducedMotion());
  const fixed = mode === 'fixed';
  const a = fixed ? Lg * 0.12 : Lg * 0.15; // half-width of the initial disturbance (line mode / bump)
  const x0 = fixed ? Lg * 0.3 : 0;
  const phi = (x: number): number => {
    if (sh === 'bump') { const z = (x - x0) / a; return Math.abs(z) >= 1 ? 0 : Math.pow(Math.cos((Math.PI / 2) * z), 2); }
    if (fixed) return x <= 0 || x >= Lg ? 0 : x < x0 ? x / x0 : (Lg - x) / (Lg - x0);
    return Math.max(0, 1 - Math.abs(x - x0) / a);
  };
  const ext = (x: number) => {
    if (!fixed) return phi(x);
    const y = ((x % (2 * Lg)) + 2 * Lg) % (2 * Lg);
    return y <= Lg ? phi(y) : -phi(2 * Lg - y);
  };
  const period = (2 * Lg) / speed;
  const tEnd = (Lg + a) / speed; // line mode: both halves have left the view
  useFrame((dt) => setT((v) => {
    const nv = v + dt;
    if (fixed) return nv % period;
    return nv > tEnd + 0.6 ? 0 : nv;
  }), running);
  const xr: [number, number] = fixed ? [0, Lg] : [-Lg, Lg];
  const sx = scale(xr, [12, 308]), sy = scale([-1.15, 1.15], [178, 18]);
  const xs = Array.from({ length: 401 }, (_, i) => xr[0] + ((xr[1] - xr[0]) * i) / 400);
  const right = (x: number) => 0.5 * ext(x - speed * t), left = (x: number) => 0.5 * ext(x + speed * t);
  const path = (g: (x: number) => number) => pathOf(xs.map((x) => [sx(x), sy(g(x))]));
  const front = a + speed * t;
  return (
    <div>
      <Stage w={320} h={200} label="d'Alembert solution of the wave equation">
        <line x1={sx(xr[0])} x2={sx(xr[1])} y1={sy(0)} y2={sy(0)} stroke="var(--grid)" />
        {fixed && [0, Lg].map((x) => <rect key={x} x={sx(x) - 4} y={sy(0) - 14} width={4} height={28} fill="var(--muted)" transform={x ? `translate(4,0)` : undefined} />)}
        {!fixed && front < Lg && [-front, front].map((x) => <line key={x} x1={sx(x)} x2={sx(x)} y1={20} y2={176} stroke="var(--c3)" strokeDasharray="2 3" />)}
        {parts && <path d={path(right)} fill="none" stroke="var(--c1)" strokeWidth={1.3} strokeDasharray="5 3" />}
        {parts && <path d={path(left)} fill="none" stroke="var(--c4)" strokeWidth={1.3} strokeDasharray="5 3" />}
        <path d={path((x) => right(x) + left(x))} fill="none" stroke="var(--c2)" strokeWidth={2.4} />
        <text x={12} y={12} fontSize="9" fill="var(--fg)">t = {t.toFixed(2)}{fixed ? `   period 2L/c = ${period.toFixed(2)}` : ''}</text>
        {parts && <text x={308} y={12} fontSize="9" textAnchor="end"><tspan fill="var(--c1)">½φ(x−ct) →</tspan>  <tspan fill="var(--c4)">← ½φ(x+ct)</tspan></text>}
        {!fixed && front < Lg && <text x={sx(front) + 2} y={194} fontSize="8" fill="var(--c3)">front ±(a+ct)</text>}
      </Stage>
      <Controls>
        <PlayPause running={running} set={setRunning} />
        <Btn onClick={() => setT(0)}>Reset</Btn>
        <Slider label="speed c" value={speed} min={0.5} max={3} step={0.1} onChange={(v) => { setSpeed(v); setT(0); }} />
        <Btn active={sh === 'bump'} onClick={() => { setSh('bump'); setT(0); }}>bump</Btn>
        <Btn active={sh === 'pluck'} onClick={() => { setSh('pluck'); setT(0); }}>pluck</Btn>
        <Btn active={parts} onClick={() => setParts(!parts)}>halves</Btn>
      </Controls>
    </div>
  );
}
