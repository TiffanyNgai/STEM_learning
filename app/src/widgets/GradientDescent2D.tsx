import { useMemo, useRef, useState } from 'react';
import { Btn, C, Controls, PlayPause, Slider, Stage, compileExpr, scale, useFrame } from './_kit';

/**
 * Optimizer racing on a 2D loss surface (filled contour bands). Tap the plot to move the start point.
 * props: {
 *   f?: string            loss L(x,y), JS-Math syntax, default "0.5*x^2 + 5*y^2" (ill-conditioned bowl)
 *   range?: [x0,x1,y0,y1] default [-4,4,-2.5,2.5]
 *   lr?: number           initial learning rate (default 0.08)
 *   lrMax?: number        slider max (default 0.25)
 *   start?: [x,y]         default [-3.5, 2]
 *   optimizers?: ('gd'|'momentum'|'adam')[]  which buttons to offer (default all three); first is selected
 *   beta?: number         momentum coefficient (default 0.9)
 *   compare?: boolean     run all listed optimizers at once, one colour each (default false)
 * Gradients are computed by central finite differences, so any smooth expression works.
 */
type Opt = 'gd' | 'momentum' | 'adam';
const NAMES: Record<Opt, string> = { gd: 'GD', momentum: 'Momentum', adam: 'Adam' };

export default function GradientDescent2D({ f = '0.5*x^2 + 5*y^2', range = [-4, 4, -2.5, 2.5], lr: lr0 = 0.08, lrMax = 0.25, start = [-3.5, 2], optimizers = ['gd', 'momentum', 'adam'], beta = 0.9, compare = false }: {
  f?: string; range?: [number, number, number, number]; lr?: number; lrMax?: number; start?: [number, number]; optimizers?: Opt[]; beta?: number; compare?: boolean;
}) {
  const L = useMemo(() => compileExpr(f, ['x', 'y']), [f]);
  const [x0, x1, y0, y1] = range;
  const box: [number, number, number, number] = [8, 6, 312, 194];
  const sx = scale([x0, x1], [box[0], box[2]]); const sy = scale([y0, y1], [box[3], box[1]]);
  const [lr, setLr] = useState(lr0);
  const [opt, setOpt] = useState<Opt>(optimizers[0] ?? 'gd');
  const [st, setSt] = useState<[number, number]>(start);
  const [running, setRunning] = useState(false);
  const [, force] = useState(0);
  const active: Opt[] = compare ? optimizers : [opt];
  type Run = { p: [number, number]; v: [number, number]; m: [number, number]; s: [number, number]; k: number; path: [number, number][]; dead: boolean };
  const fresh = (p: [number, number]): Run => ({ p: [...p], v: [0, 0], m: [0, 0], s: [0, 0], k: 0, path: [[...p]], dead: false });
  const runs = useRef<Record<string, Run>>({});
  const reset = (p = st) => { runs.current = Object.fromEntries(optimizers.map((o) => [o, fresh(p)])); force((v) => v + 1); };
  if (!Object.keys(runs.current).length) runs.current = Object.fromEntries(optimizers.map((o) => [o, fresh(st)]));

  // contour bands on a grid (log-spaced levels)
  const cells = useMemo(() => {
    const nx = 48, ny = 30, out: { x: number; y: number; w: number; h: number; b: number }[] = [];
    let lo = Infinity, hi = -Infinity; const vals: number[] = [];
    for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
      const v = L(x0 + (x1 - x0) * (i + 0.5) / nx, y0 + (y1 - y0) * (j + 0.5) / ny); vals.push(v);
      if (Number.isFinite(v)) { lo = Math.min(lo, v); hi = Math.max(hi, v); }
    }
    const t = (v: number) => Math.log(1 + v - lo) / Math.log(1 + hi - lo);
    for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
      const b = Math.floor(t(vals[j * nx + i]) * 10) / 10;
      out.push({ x: sx(x0 + (x1 - x0) * i / nx), y: sy(y0 + (y1 - y0) * (j + 1) / ny), w: (box[2] - box[0]) / nx + 0.3, h: (box[3] - box[1]) / ny + 0.3, b });
    }
    return out;
  }, [L, x0, x1, y0, y1]);

  const grad = (x: number, y: number): [number, number] => {
    const h = 1e-4 * Math.max(1, x1 - x0);
    return [(L(x + h, y) - L(x - h, y)) / (2 * h), (L(x, y + h) - L(x, y - h)) / (2 * h)];
  };
  const step = (o: Opt, r: Run) => {
    if (r.dead) return;
    const g = grad(r.p[0], r.p[1]); r.k++;
    for (let d = 0; d < 2; d++) {
      if (o === 'gd') r.p[d] -= lr * g[d];
      else if (o === 'momentum') { r.v[d] = beta * r.v[d] + g[d]; r.p[d] -= lr * r.v[d]; }
      else {
        r.m[d] = 0.9 * r.m[d] + 0.1 * g[d]; r.s[d] = 0.999 * r.s[d] + 0.001 * g[d] * g[d];
        const mh = r.m[d] / (1 - 0.9 ** r.k), sh = r.s[d] / (1 - 0.999 ** r.k);
        r.p[d] -= lr * mh / (Math.sqrt(sh) + 1e-8);
      }
    }
    if (!r.p.every(Number.isFinite) || Math.abs(r.p[0]) > 1e3 || Math.abs(r.p[1]) > 1e3) r.dead = true;
    r.path.push([...r.p]); if (r.path.length > 400) r.path.shift();
  };
  const acc = useRef(0);
  useFrame((dt) => {
    acc.current += dt;
    while (acc.current > 0.07) { acc.current -= 0.07; for (const o of active) step(o, runs.current[o]); }
    force((v) => v + 1);
  }, running);

  const clampPt = ([a, b]: [number, number]): [number, number] => [Math.max(box[0] - 20, Math.min(box[2] + 20, sx(a))), Math.max(box[1] - 20, Math.min(box[3] + 20, sy(b)))];
  const main = runs.current[active[0]];
  return (
    <div>
      <Stage label="Gradient descent on a loss surface">
        <clipPath id="gd2-clip"><rect x={box[0]} y={box[1]} width={box[2] - box[0]} height={box[3] - box[1]} /></clipPath>
        <g clipPath="url(#gd2-clip)">
          {cells.map((c, i) => <rect key={i} x={c.x} y={c.y} width={c.w} height={c.h} fill="var(--c2)" opacity={0.08 + 0.55 * (1 - c.b)} />)}
          <rect x={box[0]} y={box[1]} width={box[2] - box[0]} height={box[3] - box[1]} fill="transparent"
            onPointerDown={(e) => {
              const svg = (e.target as SVGElement).ownerSVGElement!; const pt = svg.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY;
              const q = pt.matrixTransform(svg.getScreenCTM()!.inverse());
              const p: [number, number] = [x0 + (q.x - box[0]) / (box[2] - box[0]) * (x1 - x0), y1 - (q.y - box[1]) / (box[3] - box[1]) * (y1 - y0)];
              setSt(p); reset(p);
            }} />
          {active.map((o, k) => {
            const r = runs.current[o]; const col = C[[4, 0, 3][optimizers.indexOf(o) % 3] ?? k];
            const pts = r.path.map(clampPt);
            const [hx, hy] = pts[pts.length - 1];
            return (
              <g key={o} pointerEvents="none">
                <polyline points={pts.map((p) => p.join(',')).join(' ')} fill="none" stroke={col} strokeWidth={1.4} />
                {pts.map(([a, b], i) => <circle key={i} cx={a} cy={b} r={1.2} fill={col} />)}
                <circle cx={hx} cy={hy} r={4.5} fill={col} stroke="var(--surface)" strokeWidth={1} />
                {compare && <text x={box[0] + 4} y={box[1] + 10 + 10 * k} fontSize="9" fill={col}>{NAMES[o]}{r.dead ? ' — diverged!' : ''}</text>}
              </g>
            );
          })}
        </g>
        <text x={box[2] - 4} y={box[3] - 4} fontSize="9" textAnchor="end" fill="var(--fg)">
          {main.dead ? 'diverged!' : `step ${main.k}   L = ${L(main.p[0], main.p[1]).toPrecision(3)}`}
        </text>
      </Stage>
      <Controls>
        <Slider label="learning rate η" min={0.001} max={lrMax} step={0.001} value={lr} onChange={setLr} format={(v) => v.toFixed(3)} />
        {!compare && optimizers.length > 1 && optimizers.map((o) => <Btn key={o} active={o === opt} onClick={() => { setOpt(o); reset(); }}>{NAMES[o]}</Btn>)}
        <PlayPause running={running} set={setRunning} />
        <Btn onClick={() => reset()}>↺ Reset</Btn>
      </Controls>
    </div>
  );
}
