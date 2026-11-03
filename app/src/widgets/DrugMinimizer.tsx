import { useMemo, useRef, useState } from 'react';
import { Btn, C, Controls, PlayPause, Stage, compileExpr, prefersReducedMotion, scale, useFrame } from './_kit';

/**
 * Energy minimisers on a 2D potential-energy surface (shaded bands; darker = lower energy).
 * Each method uses an accurate line search along its search direction:
 *   steepest descent (d = −g), conjugate gradient (Fletcher–Reeves, d = −g + β d_prev),
 *   L-BFGS (two-loop recursion, memory 5). Tap the surface to move the start point.
 * props: {
 *   surface?: 'valley' | 'twoMinima'   built-in surfaces (default 'valley': a narrow, tilted quadratic valley)
 *   f?: string                         custom E(x,y) in JS-Math syntax (overrides surface)
 *   range?: [x0,x1,y0,y1]              plot range (default depends on surface)
 *   start?: [x,y]                      start point (default depends on surface)
 *   methods?: ('sd'|'cg'|'lbfgs')[]    methods to run side by side (default all three)
 *   autoRun?: boolean                  start animating immediately (default false)
 * }
 */
type M = 'sd' | 'cg' | 'lbfgs';
const NAME: Record<M, string> = { sd: 'Steepest descent', cg: 'Conjugate gradient', lbfgs: 'L-BFGS' };
const COL: Record<M, string> = { sd: C[4], cg: C[1], lbfgs: C[3] };
const SURF = {
  valley: { f: '0.1*(x+y)^2 + 2*(x-y)^2', range: [-3, 3, -2, 2] as [number, number, number, number], start: [-2.6, -0.4] as [number, number] },
  twoMinima: { f: '1.5*(x^2-1)^2 + 0.3*x + (y-0.4*x)^2', range: [-2, 2, -1.6, 1.6] as [number, number, number, number], start: [0.25, 1.3] as [number, number] },
};
type V2 = [number, number];
type Run = { p: V2; g: V2; d: V2; k: number; path: V2[]; done: boolean; s: V2[]; y: V2[] };

export default function DrugMinimizer({ surface = 'valley', f, range, start, methods = ['sd', 'cg', 'lbfgs'], autoRun = false }: {
  surface?: 'valley' | 'twoMinima'; f?: string; range?: [number, number, number, number]; start?: V2; methods?: M[]; autoRun?: boolean;
}) {
  const S = SURF[surface] ?? SURF.valley;
  const expr = f ?? S.f; const [x0, x1, y0, y1] = range ?? S.range;
  const E = useMemo(() => compileExpr(expr, ['x', 'y']), [expr]);
  const box: [number, number, number, number] = [8, 6, 312, 194];
  const sx = scale([x0, x1], [box[0], box[2]]); const sy = scale([y0, y1], [box[3], box[1]]);
  const [st, setSt] = useState<V2>(start ?? S.start);
  const [running, setRunning] = useState(autoRun && !prefersReducedMotion());
  const [, force] = useState(0);

  const grad = (p: V2): V2 => {
    const h = 1e-5;
    return [(E(p[0] + h, p[1]) - E(p[0] - h, p[1])) / (2 * h), (E(p[0], p[1] + h) - E(p[0], p[1] - h)) / (2 * h)];
  };
  const dot = (a: V2, b: V2) => a[0] * b[0] + a[1] * b[1];
  const fresh = (p: V2): Run => { const g = grad(p); return { p: [...p], g, d: [-g[0], -g[1]], k: 0, path: [[...p]], done: false, s: [], y: [] }; };
  const runs = useRef<Record<string, Run>>({});
  const reset = (p = st) => { runs.current = Object.fromEntries(methods.map((m) => [m, fresh(p)])); force((v) => v + 1); };
  if (!Object.keys(runs.current).length) runs.current = Object.fromEntries(methods.map((m) => [m, fresh(st)]));

  // 1D minimisation of E(p + a d) for a ≥ 0: bracket, then golden-section search.
  const lineSearch = (p: V2, d: V2) => {
    const phi = (a: number) => E(p[0] + a * d[0], p[1] + a * d[1]);
    let a = 0, b = 1e-3 / Math.max(1e-9, Math.hypot(...d)), fb = phi(b);
    while (fb < phi(a) && b < 1e3) { a = b; b *= 2; fb = phi(b); }
    let lo = Math.max(0, a / 2), hi = b; const r = (Math.sqrt(5) - 1) / 2;
    for (let i = 0; i < 60; i++) {
      const c = hi - r * (hi - lo), e = lo + r * (hi - lo);
      if (phi(c) < phi(e)) hi = e; else lo = c;
    }
    return (lo + hi) / 2;
  };
  const step = (m: M, r: Run) => {
    if (r.done) return;
    let d = r.d;
    if (m === 'lbfgs' && r.k > 0) { // two-loop recursion
      let q: V2 = [...r.g]; const al: number[] = [];
      for (let i = r.s.length - 1; i >= 0; i--) { const rho = 1 / dot(r.y[i], r.s[i]); al[i] = rho * dot(r.s[i], q); q = [q[0] - al[i] * r.y[i][0], q[1] - al[i] * r.y[i][1]]; }
      const last = r.s.length - 1; const gam = last >= 0 ? dot(r.s[last], r.y[last]) / dot(r.y[last], r.y[last]) : 1;
      let z: V2 = [gam * q[0], gam * q[1]];
      for (let i = 0; i < r.s.length; i++) { const rho = 1 / dot(r.y[i], r.s[i]); const be = rho * dot(r.y[i], z); z = [z[0] + (al[i] - be) * r.s[i][0], z[1] + (al[i] - be) * r.s[i][1]]; }
      d = [-z[0], -z[1]];
      if (dot(d, r.g) >= 0) d = [-r.g[0], -r.g[1]];
    }
    const a = lineSearch(r.p, d);
    const np: V2 = [r.p[0] + a * d[0], r.p[1] + a * d[1]]; const ng = grad(np);
    if (m === 'cg') {
      const beta = dot(ng, ng) / Math.max(1e-300, dot(r.g, r.g));
      r.d = [-ng[0] + beta * d[0], -ng[1] + beta * d[1]];
      if (dot(r.d, ng) >= 0) r.d = [-ng[0], -ng[1]];
    } else if (m === 'sd') r.d = [-ng[0], -ng[1]];
    else {
      const s: V2 = [np[0] - r.p[0], np[1] - r.p[1]], y: V2 = [ng[0] - r.g[0], ng[1] - r.g[1]];
      if (dot(s, y) > 1e-14) { r.s.push(s); r.y.push(y); if (r.s.length > 5) { r.s.shift(); r.y.shift(); } }
    }
    r.p = np; r.g = ng; r.k++; r.path.push([...np]);
    if (Math.hypot(...ng) < 1e-4 || r.k >= 60 || !np.every(Number.isFinite)) r.done = true;
  };

  const cells = useMemo(() => {
    const nx = 48, ny = 30, vals: number[] = []; let lo = Infinity, hi = -Infinity;
    for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
      const v = E(x0 + (x1 - x0) * (i + 0.5) / nx, y0 + (y1 - y0) * (j + 0.5) / ny); vals.push(v);
      if (Number.isFinite(v)) { lo = Math.min(lo, v); hi = Math.max(hi, v); }
    }
    return vals.map((v, k) => {
      const i = k % nx, j = Math.floor(k / nx);
      const b = Math.floor((Math.log(1 + v - lo) / Math.log(1 + hi - lo)) * 12) / 12;
      return { x: sx(x0 + (x1 - x0) * i / nx), y: sy(y0 + (y1 - y0) * (j + 1) / ny), w: (box[2] - box[0]) / nx + 0.3, h: (box[3] - box[1]) / ny + 0.3, b };
    });
  }, [E, x0, x1, y0, y1]);

  const acc = useRef(0);
  useFrame((dt) => {
    acc.current += dt;
    if (acc.current > 0.45) { acc.current = 0; methods.forEach((m) => step(m, runs.current[m])); force((v) => v + 1); }
    if (methods.every((m) => runs.current[m].done)) setRunning(false);
  }, running);

  const clamp = ([a, b]: V2): V2 => [Math.max(box[0], Math.min(box[2], sx(a))), Math.max(box[1], Math.min(box[3], sy(b)))];
  return (
    <div>
      <Stage label="Energy minimisers on a 2D surface">
        <clipPath id="dmin-clip"><rect x={box[0]} y={box[1]} width={box[2] - box[0]} height={box[3] - box[1]} /></clipPath>
        <g clipPath="url(#dmin-clip)">
          {cells.map((c, i) => <rect key={i} x={c.x} y={c.y} width={c.w} height={c.h} fill="var(--c2)" opacity={0.06 + 0.55 * (1 - c.b)} />)}
          <rect x={box[0]} y={box[1]} width={box[2] - box[0]} height={box[3] - box[1]} fill="transparent"
            onPointerDown={(e) => {
              const svg = (e.target as SVGElement).ownerSVGElement!; const pt = svg.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY;
              const q = pt.matrixTransform(svg.getScreenCTM()!.inverse());
              const p: V2 = [x0 + (q.x - box[0]) / (box[2] - box[0]) * (x1 - x0), y1 - (q.y - box[1]) / (box[3] - box[1]) * (y1 - y0)];
              setSt(p); reset(p);
            }} />
          {methods.map((m) => {
            const pts = runs.current[m].path.map(clamp); const [hx, hy] = pts[pts.length - 1];
            return (
              <g key={m} pointerEvents="none">
                <polyline points={pts.map((p) => p.join(',')).join(' ')} fill="none" stroke={COL[m]} strokeWidth={1.6} />
                {pts.map(([a, b], i) => <circle key={i} cx={a} cy={b} r={1.6} fill={COL[m]} />)}
                <circle cx={hx} cy={hy} r={4} fill={COL[m]} stroke="var(--surface)" strokeWidth={1} />
              </g>
            );
          })}
        </g>
        {methods.map((m, k) => {
          const r = runs.current[m];
          return <text key={m} x={box[0] + 4} y={box[1] + 11 + 11 * k} fontSize="9" fontWeight={700} fill={COL[m]}>
            {NAME[m]}: {r.k} steps · E = {E(r.p[0], r.p[1]).toFixed(3)}{r.done && Math.hypot(...r.g) < 1e-4 ? ' ✓' : ''}
          </text>;
        })}
      </Stage>
      <Controls>
        <PlayPause running={running} set={setRunning} />
        <Btn onClick={() => { methods.forEach((m) => step(m, runs.current[m])); force((v) => v + 1); }}>Step</Btn>
        <Btn onClick={() => reset()}>↺ Reset</Btn>
        <span className="w-muted">Tap the surface to choose a start</span>
      </Controls>
    </div>
  );
}
