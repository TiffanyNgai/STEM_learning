import { useMemo, useState } from 'react';
import { Axes, Controls, Slider, Stage, compileExpr, pathOf, scale } from './_kit';

/**
 * Compare one-step ODE solvers.
 * mode 'order' (default): solve y' = f(x, y), y(0) = y0 on [0, T] with Euler, Heun (RK2) and RK4.
 *   Left: the three numerical solutions vs the exact one for the chosen step h = T/N.
 *   Right: log–log plot of the global error at x = T against h (N = 1, 2, 4, …, 1024); slopes
 *   1, 2, 4 reveal each method's order. The chosen h is ringed.
 * mode 'stiff': y' = −λy, y(0) = 1 on [0, 1] with explicit Euler, implicit (backward) Euler and the exact
 *   e^{−λx}. Explicit Euler multiplies by (1 − hλ) each step and blows up once hλ > 2.
 * props: { mode?: 'order' | 'stiff', f?: string (default "y"), exact?: string (in x, default "exp(x)"),
 *          y0?: number (1), T?: number (1), logN?: number (initial log₂ N, default 2), lambda?: number (stiff, default 30) }
 */
type Step = (f: (x: number, y: number) => number, x: number, y: number, h: number) => number;
const euler: Step = (f, x, y, h) => y + h * f(x, y);
const heun: Step = (f, x, y, h) => { const k1 = f(x, y), k2 = f(x + h, y + h * k1); return y + (h / 2) * (k1 + k2); };
const rk4: Step = (f, x, y, h) => {
  const k1 = f(x, y), k2 = f(x + h / 2, y + (h / 2) * k1), k3 = f(x + h / 2, y + (h / 2) * k2), k4 = f(x + h, y + h * k3);
  return y + (h / 6) * (k1 + 2 * k2 + 2 * k3 + k4);
};
const METHODS: [string, Step, string][] = [['Euler', euler, 'var(--c3)'], ['Heun', heun, 'var(--c4)'], ['RK4', rk4, 'var(--c2)']];
const run = (st: Step, f: (x: number, y: number) => number, y0: number, T: number, N: number) => {
  const pts: [number, number][] = [[0, y0]]; let y = y0;
  for (let i = 0; i < N; i++) { y = st(f, (i * T) / N, y, T / N); pts.push([((i + 1) * T) / N, y]); }
  return pts;
};

export default function MathOdeSolvers({ mode = 'order', f = 'y', exact = 'exp(x)', y0 = 1, T = 1, logN: ln0 = 2, lambda: lam0 = 30 }: {
  mode?: 'order' | 'stiff'; f?: string; exact?: string; y0?: number; T?: number; logN?: number; lambda?: number;
}) {
  const F = useMemo(() => compileExpr(f, ['x', 'y']), [f]);
  const E = useMemo(() => compileExpr(exact, ['x']), [exact]);
  const [logN, setLogN] = useState(ln0);
  const [lam, setLam] = useState(lam0);
  const [h, setH] = useState(0.06);
  const exT = E(T);
  const all = useMemo(() => METHODS.map(([, st]) => Array.from({ length: 11 }, (_, k) => {
    const pts = run(st, F, y0, T, 2 ** k); return Math.max(1e-15, Math.abs(pts[pts.length - 1][1] - exT));
  })), [F, y0, T, exT]);
  if (mode === 'stiff') {
    const fs = (_x: number, y: number) => -lam * y;
    const N = Math.max(1, Math.round(1 / h)), hh = 1 / N;
    const ex = run(euler, fs, 1, 1, N);
    const im: [number, number][] = [[0, 1]]; for (let i = 0; i < N; i++) im.push([(i + 1) * hh, im[i][1] / (1 + hh * lam)]);
    const box: [number, number, number, number] = [28, 10, 312, 170];
    const sx = scale([0, 1], [box[0], box[2]]); const sy = scale([-1.5, 1.5], [box[3], box[1]]);
    const cl = (v: number) => Math.max(-40, Math.min(240, sy(v)));
    const exPts: [number, number][] = []; for (let i = 0; i <= 200; i++) exPts.push([sx(i / 200), sy(Math.exp(-lam * i / 200))]);
    const hl = hh * lam;
    return (
      <div>
        <Stage w={320} h={196} label="Explicit vs implicit Euler on a stiff equation">
          <clipPath id="ods-clip"><rect x={box[0]} y={box[1]} width={box[2] - box[0]} height={box[3] - box[1]} /></clipPath>
          <Axes x={[0, 1]} y={[-1.5, 1.5]} box={box} grid={false} xLabel="x" yLabel="y" />
          <g clipPath="url(#ods-clip)">
            <path d={pathOf(exPts)} stroke="var(--c1)" strokeWidth={2} fill="none" />
            <path d={pathOf(ex.map(([a, b]) => [sx(a), cl(b)]))} stroke="var(--c5)" strokeWidth={1.5} fill="none" />
            {ex.map(([a, b], i) => <circle key={'e' + i} cx={sx(a)} cy={cl(b)} r={2} fill="var(--c5)" />)}
            <path d={pathOf(im.map(([a, b]) => [sx(a), sy(b)]))} stroke="var(--c2)" strokeWidth={1.5} fill="none" />
            {im.map(([a, b], i) => <circle key={'i' + i} cx={sx(a)} cy={sy(b)} r={2} fill="var(--c2)" />)}
          </g>
          <text x={30} y={184} fontSize="8.5"><tspan style={{ fill: 'var(--c1)' }}>— exact</tspan>  <tspan style={{ fill: 'var(--c5)' }}>● explicit ×(1−hλ)</tspan>  <tspan style={{ fill: 'var(--c2)' }}>● implicit ×1/(1+hλ)</tspan></text>
          <text x={30} y={194} fontSize="8.5">hλ = {hl.toFixed(2)} → explicit factor {(1 - hl).toFixed(2)} {Math.abs(1 - hl) > 1 ? '(|·| > 1: blows up!)' : '(stable)'}</text>
        </Stage>
        <Controls>
          <Slider label="step h" min={0.01} max={0.2} step={0.005} value={h} onChange={setH} format={(v) => (1 / Math.max(1, Math.round(1 / v))).toFixed(3)} />
          <Slider label="λ" min={1} max={60} step={1} value={lam} onChange={setLam} />
        </Controls>
      </div>
    );
  }
  const N = 2 ** logN;
  const lb: [number, number, number, number] = [24, 10, 150, 170];
  const sols = METHODS.map(([, st]) => run(st, F, y0, T, N));
  const ys = sols.flat().map((p) => p[1]).concat([y0, exT]).filter(Number.isFinite);
  const yr: [number, number] = [Math.min(...ys), Math.max(...ys)];
  const pad = (yr[1] - yr[0]) * 0.1 || 1;
  const sxL = scale([0, T], [lb[0], lb[2]]); const syL = scale([yr[0] - pad, yr[1] + pad], [lb[3], lb[1]]);
  const exPts: [number, number][] = []; for (let i = 0; i <= 100; i++) exPts.push([sxL((T * i) / 100), syL(E((T * i) / 100))]);
  const rb: [number, number, number, number] = [182, 10, 312, 170];
  const sh = scale([-3, 0], [rb[0], rb[2]]); const se = scale([-15, 0], [rb[3], rb[1]]);
  const lh = (k: number) => Math.log10(T / 2 ** k);
  return (
    <div>
      <Stage w={320} h={200} label="Euler, Heun and RK4: solutions and error versus step size">
        <rect x={lb[0]} y={lb[1]} width={lb[2] - lb[0]} height={lb[3] - lb[1]} fill="none" stroke="var(--grid)" />
        <path d={pathOf(exPts)} stroke="var(--c1)" strokeWidth={2} fill="none" />
        {sols.map((pts, m) => <g key={m}>
          <path d={pathOf(pts.map(([a, b]) => [sxL(a), syL(b)]))} stroke={METHODS[m][2]} strokeWidth={1.3} fill="none" />
          {N <= 16 && pts.map(([a, b], i) => <circle key={i} cx={sxL(a)} cy={syL(b)} r={1.8} fill={METHODS[m][2]} />)}
        </g>)}
        <text x={lb[0] + 3} y={lb[1] + 9} fontSize="8">h = {(T / N).toPrecision(3)} (N = {N})</text>
        <rect x={rb[0]} y={rb[1]} width={rb[2] - rb[0]} height={rb[3] - rb[1]} fill="none" stroke="var(--grid)" />
        {[0, -5, -10, -15].map((v) => <text key={v} x={rb[0] - 2} y={se(v) + 3} fontSize="7.5" textAnchor="end">1e{v}</text>)}
        {[-3, -2, -1, 0].map((v) => <text key={v} x={sh(v)} y={rb[3] + 9} fontSize="7.5" textAnchor="middle">1e{v}</text>)}
        <text x={rb[2]} y={rb[3] + 18} fontSize="8" textAnchor="end">step h (log)</text>
        <text x={rb[0] + 3} y={rb[1] + 9} fontSize="8">error at x = {T}</text>
        {all.map((errs, m) => <g key={m}>
          <path d={pathOf(errs.map((e, k) => [sh(lh(k)), se(Math.log10(e))]))} stroke={METHODS[m][2]} strokeWidth={1.5} fill="none" />
          <circle cx={sh(lh(logN))} cy={se(Math.log10(errs[logN]))} r={3.5} fill="none" stroke={METHODS[m][2]} strokeWidth={1.5} />
        </g>)}
        <text x={24} y={188} fontSize="8.5">
          <tspan style={{ fill: 'var(--c1)' }}>— exact  </tspan>
          {METHODS.map(([name, , col], m) => <tspan key={m} style={{ fill: col }}>{name} err {all[m][logN].toExponential(1)}  </tspan>)}
        </text>
      </Stage>
      <Controls>
        <Slider label="N = 2^k steps" min={0} max={10} step={1} value={logN} onChange={setLogN} format={(v) => String(2 ** v)} />
      </Controls>
    </div>
  );
}
