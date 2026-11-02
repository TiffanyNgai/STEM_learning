/**
 * Shared building blocks for teaching widgets. Every widget file in this folder
 * (except files starting with "_") is auto-registered by its file name.
 *
 * Colours: use CSS variables so widgets work in light & dark mode:
 *   var(--fg) text/axes, var(--muted) secondary, var(--grid) gridlines, var(--surface) panel,
 *   var(--c1)…var(--c6) series colours (green, blue, orange, purple, red, teal).
 */
import { useEffect, useRef, useState, type ReactNode } from 'react';

export const C = ['var(--c1)', 'var(--c2)', 'var(--c3)', 'var(--c4)', 'var(--c5)', 'var(--c6)'];

/** Calls cb(dtSeconds, tSeconds) every animation frame while running. */
export function useFrame(cb: (dt: number, t: number) => void, running = true) {
  const ref = useRef(cb);
  ref.current = cb;
  useEffect(() => {
    if (!running) return;
    let raf = 0;
    let last = performance.now();
    let t = 0;
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      t += dt;
      ref.current(dt, t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [running]);
}

/** Re-render driver: returns elapsed seconds, advancing while running. */
export function useClock(running = true, speed = 1): [number, (t: number) => void] {
  const [t, setT] = useState(0);
  useFrame((dt) => setT((x) => x + dt * speed), running);
  return [t, setT];
}

/** Respect reduced-motion users: widgets should start paused when this is true. */
export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

/** Responsive SVG. Draw in viewBox units (default 320×200). */
export function Stage({ w = 320, h = 200, children, label }: { w?: number; h?: number; children: ReactNode; label?: string }) {
  return (
    <svg className="w-stage" viewBox={`0 0 ${w} ${h}`} role="img" aria-label={label} preserveAspectRatio="xMidYMid meet">
      {children}
    </svg>
  );
}

/** Linear map helper: scale([d0,d1],[r0,r1])(x). */
export const scale = (d: [number, number], r: [number, number]) => (x: number) =>
  r[0] + ((x - d[0]) / (d[1] - d[0])) * (r[1] - r[0]);

/** Axes with optional grid for a plot occupying the given pixel box. */
export function Axes({ x, y, box, xLabel, yLabel, grid = true }: {
  x: [number, number]; y: [number, number]; box: [number, number, number, number];
  xLabel?: string; yLabel?: string; grid?: boolean;
}) {
  const [L, T, R, B] = box;
  const sx = scale(x, [L, R]);
  const sy = scale(y, [B, T]);
  const ticks = (a: number, b: number) => {
    const span = b - a; const step = Math.pow(10, Math.floor(Math.log10(span / 4)));
    const m = span / step > 20 ? 5 : span / step > 8 ? 2 : 1;
    const s = step * m; const out: number[] = [];
    for (let v = Math.ceil(a / s) * s; v <= b + 1e-9; v += s) out.push(+v.toFixed(10));
    return out;
  };
  const x0 = Math.min(Math.max(0, x[0]), x[1]);
  const y0 = Math.min(Math.max(0, y[0]), y[1]);
  return (
    <g fontSize="8" fill="var(--muted)">
      {grid && ticks(...x).map((v) => <line key={'gx' + v} x1={sx(v)} x2={sx(v)} y1={T} y2={B} stroke="var(--grid)" strokeWidth={0.5} />)}
      {grid && ticks(...y).map((v) => <line key={'gy' + v} y1={sy(v)} y2={sy(v)} x1={L} x2={R} stroke="var(--grid)" strokeWidth={0.5} />)}
      <line x1={L} x2={R} y1={sy(y0)} y2={sy(y0)} stroke="var(--fg)" strokeWidth={0.8} />
      <line y1={T} y2={B} x1={sx(x0)} x2={sx(x0)} stroke="var(--fg)" strokeWidth={0.8} />
      {ticks(...x).map((v) => <text key={'tx' + v} x={sx(v)} y={B + 9} textAnchor="middle">{+v.toPrecision(3)}</text>)}
      {ticks(...y).map((v) => <text key={'ty' + v} x={L - 3} y={sy(v) + 3} textAnchor="end">{+v.toPrecision(3)}</text>)}
      {xLabel && <text x={R} y={B - 3} textAnchor="end" fill="var(--fg)">{xLabel}</text>}
      {yLabel && <text x={L + 3} y={T + 7} fill="var(--fg)">{yLabel}</text>}
    </g>
  );
}

/** Polyline path from points. */
export const pathOf = (pts: [number, number][]) =>
  pts.map(([a, b], i) => `${i ? 'L' : 'M'}${a.toFixed(2)},${b.toFixed(2)}`).join('');

export function Controls({ children }: { children: ReactNode }) {
  return <div className="w-controls">{children}</div>;
}

export function Slider({ label, value, min, max, step = 0.01, onChange, format }: {
  label: ReactNode; value: number; min: number; max: number; step?: number;
  onChange: (v: number) => void; format?: (v: number) => string;
}) {
  return (
    <label className="w-slider">
      <span>{label}</span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(+e.target.value)} />
      <output>{format ? format(value) : +value.toFixed(2)}</output>
    </label>
  );
}

export function Btn({ children, onClick, active }: { children: ReactNode; onClick: () => void; active?: boolean }) {
  return <button type="button" className={'w-btn' + (active ? ' active' : '')} onClick={onClick}>{children}</button>;
}

export function PlayPause({ running, set }: { running: boolean; set: (r: boolean) => void }) {
  return <Btn onClick={() => set(!running)}>{running ? '⏸ Pause' : '▶ Play'}</Btn>;
}

/** Compile a math expression string like "sin(a*x) + x^2" into a function of the given variables. */
/** Math syntax -> JS. Convention: -x^2 = -(x^2); JS rejects `-x**2`, so a unary minus becomes (-1)*. */
export function exprToJs(expr: string): string {
  return expr.replace(/(^|[(,+\-*/]\s*)-/g, '$1(-1)*').replace(/\^/g, '**');
}

export function compileExpr(expr: string, vars: string[]): (...args: number[]) => number {
  const js = exprToJs(expr);
  let f: (...a: number[]) => number;
  try {
    // eslint-disable-next-line no-new-func
    f = new Function(...vars, `with (Math) { return (${js}); }`) as (...a: number[]) => number;
  } catch (e) {
    console.error(`compileExpr: cannot parse "${expr}"`, e);
    return () => NaN;
  }
  return (...a) => { try { const v = f(...a); return Number.isFinite(v) ? v : NaN; } catch { return NaN; } };
}

/** Seeded PRNG (mulberry32) + gaussian, so animations are reproducible. */
export function rng(seed = 1) {
  let a = seed >>> 0;
  const u = () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const normal = () => Math.sqrt(-2 * Math.log(u() + 1e-12)) * Math.cos(2 * Math.PI * u());
  return { u, normal };
}
