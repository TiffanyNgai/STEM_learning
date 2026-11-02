import { useId, useMemo, useRef, useState } from 'react';
import { Btn, C, Controls, PlayPause, Slider, Stage, pathOf, rng, scale, useFrame } from './_kit';

/**
 * Mini-batch SGD vs full-batch GD on a real least-squares problem: fit y ≈ w·x + b to n noisy points.
 * Top: contours of the training loss L(w,b) = (1/2n)Σ(w x_i + b − y_i)² over the (w,b) plane, the exact
 * minimizer (★), the full-batch GD path (dashed, grey) and the SGD path (coloured). Tap to move the start.
 * Bottom: log₁₀ of the excess loss L − L* vs step for both.
 * Each SGD step draws a fresh mini-batch of B indices uniformly with replacement.
 * props: {
 *   n?: number        number of data points (default 200, 20–1000)
 *   batch?: number    initial batch size B (default 4)
 *   lr?: number       initial learning rate η (default 0.15)
 *   decay?: boolean   start with the decaying schedule η_k = η/(1 + k/50) (default false)
 *   showGD?: boolean  also run full-batch GD for comparison (default true)
 *   start?: [w,b]     start point (default [-1, 1.8])
 *   seed?: number     data seed (default 3)
 * }
 */
export default function MlSGDNoise({ n = 200, batch = 4, lr: lr0 = 0.15, decay: decay0 = false, showGD = true, start = [-1, 1.8], seed = 3 }: {
  n?: number; batch?: number; lr?: number; decay?: boolean; showGD?: boolean; start?: [number, number]; seed?: number;
}) {
  const N = Math.max(20, Math.min(1000, Math.round(n)));
  const data = useMemo(() => {
    const r = rng(seed * 7919 + 11);
    const xs = Array.from({ length: N }, () => 0.5 + r.normal());
    const ys = xs.map((x) => 1.5 * x - 0.5 + 0.8 * r.normal());
    let sx = 0, sy = 0, sxx = 0, sxy = 0;
    xs.forEach((x, i) => { sx += x; sy += ys[i]; sxx += x * x; sxy += x * ys[i]; });
    const w = (N * sxy - sx * sy) / (N * sxx - sx * sx); const b = (sy - w * sx) / N;
    return { xs, ys, w, b };
  }, [N, seed]);
  const loss = (w: number, b: number) => { let s = 0; for (let i = 0; i < N; i++) { const e = w * data.xs[i] + b - data.ys[i]; s += e * e; } return s / (2 * N); };
  const Lstar = useMemo(() => loss(data.w, data.b), [data]);
  const R: [number, number, number, number] = [-1.5, 3.5, -2.5, 2.5];
  const box: [number, number, number, number] = [8, 6, 312, 180];
  const px = scale([R[0], R[1]], [box[0], box[2]]); const py = scale([R[2], R[3]], [box[3], box[1]]);
  const clip = 'sgdn' + useId().replace(/:/g, '');

  const cells = useMemo(() => {
    const nx = 40, ny = 28, vals: number[] = []; let hi = 0;
    for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
      const v = loss(R[0] + (R[1] - R[0]) * (i + 0.5) / nx, R[2] + (R[3] - R[2]) * (j + 0.5) / ny) - Lstar; vals.push(v); hi = Math.max(hi, v);
    }
    return vals.map((v, k) => ({ i: k % nx, j: Math.floor(k / nx), b: Math.floor(Math.log(1 + v) / Math.log(1 + hi) * 10) / 10, nx, ny }));
  }, [data]);

  const [B, setB] = useState(Math.max(1, Math.min(N, Math.round(batch))));
  const [lr, setLr] = useState(lr0);
  const [decay, setDecay] = useState(decay0);
  const [st, setSt] = useState<[number, number]>(start);
  const [running, setRunning] = useState(false);
  const [, force] = useState(0);
  type Run = { p: [number, number]; path: [number, number][]; hist: number[] };
  const fresh = (p: [number, number]): Run => ({ p: [...p], path: [[...p]], hist: [loss(p[0], p[1]) - Lstar] });
  const sgd = useRef<Run>(fresh(st)); const gd = useRef<Run>(fresh(st));
  const k = useRef(0); const r = useRef(rng(seed + 99));
  const reset = (p = st) => { sgd.current = fresh(p); gd.current = fresh(p); k.current = 0; force((v) => v + 1); };

  const stepRun = (run: Run, idx: number[] | null, eta: number) => {
    let gw = 0, gb = 0; const ids = idx ?? data.xs.map((_, i) => i);
    for (const i of ids) { const e = run.p[0] * data.xs[i] + run.p[1] - data.ys[i]; gw += e * data.xs[i]; gb += e; }
    run.p[0] -= eta * gw / ids.length; run.p[1] -= eta * gb / ids.length;
    if (!run.p.every((v) => Number.isFinite(v) && Math.abs(v) < 1e3)) run.p = [NaN, NaN];
    run.path.push([...run.p]); if (run.path.length > 300) run.path.shift();
    run.hist.push(loss(run.p[0], run.p[1]) - Lstar); if (run.hist.length > 300) run.hist.shift();
  };
  const acc = useRef(0);
  useFrame((dt) => {
    acc.current += dt;
    while (acc.current > 0.06) {
      acc.current -= 0.06;
      if (k.current >= 2000) { setRunning(false); break; }
      const eta = decay ? lr / (1 + k.current / 50) : lr;
      stepRun(sgd.current, Array.from({ length: B }, () => Math.floor(r.current.u() * N)), eta);
      if (showGD) stepRun(gd.current, null, eta);
      k.current++;
    }
    force((v) => v + 1);
  }, running);

  const clampPt = ([a, b]: [number, number]): [number, number] => [Math.max(box[0] - 10, Math.min(box[2] + 10, px(a))), Math.max(box[1] - 10, Math.min(box[3] + 10, py(b)))];
  const bot: [number, number, number, number] = [30, 196, 312, 252];
  const hx = scale([0, 300], [bot[0], bot[2]]); const hy = scale([-5, 1], [bot[3], bot[1]]);
  const lg = (v: number) => hy(Math.max(-5, Math.min(1, Math.log10(Math.max(v, 1e-9)))));
  const histPath = (h: number[]) => pathOf(h.filter(Number.isFinite).map((v, i) => [hx(i), lg(v)]));
  const s = sgd.current; const dead = !Number.isFinite(s.p[0]);
  const eta = decay ? lr / (1 + k.current / 50) : lr;

  return (
    <div>
      <Stage w={320} h={262} label="Mini-batch SGD versus full-batch gradient descent on a least-squares loss">
        <defs><clipPath id={clip}><rect x={box[0]} y={box[1]} width={box[2] - box[0]} height={box[3] - box[1]} /></clipPath></defs>
        <g clipPath={`url(#${clip})`}>
          {cells.map((c, i) => <rect key={i} x={box[0] + (box[2] - box[0]) * c.i / c.nx} y={box[3] - (box[3] - box[1]) * (c.j + 1) / c.ny}
            width={(box[2] - box[0]) / c.nx + 0.3} height={(box[3] - box[1]) / c.ny + 0.3} fill="var(--c2)" opacity={0.08 + 0.5 * (1 - c.b)} />)}
          <rect x={box[0]} y={box[1]} width={box[2] - box[0]} height={box[3] - box[1]} fill="transparent" onPointerDown={(e) => {
            const svg = (e.target as SVGElement).ownerSVGElement!; const pt = svg.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY;
            const q = pt.matrixTransform(svg.getScreenCTM()!.inverse());
            const p: [number, number] = [R[0] + (q.x - box[0]) / (box[2] - box[0]) * (R[1] - R[0]), R[3] - (q.y - box[1]) / (box[3] - box[1]) * (R[3] - R[2])];
            setSt(p); reset(p);
          }} />
          <g pointerEvents="none">
            {showGD && <polyline points={gd.current.path.filter((p) => Number.isFinite(p[0])).map((p) => clampPt(p).join(',')).join(' ')} fill="none" stroke="var(--muted)" strokeWidth={1.4} strokeDasharray="3 2" />}
            <polyline points={s.path.filter((p) => Number.isFinite(p[0])).map((p) => clampPt(p).join(',')).join(' ')} fill="none" stroke={C[2]} strokeWidth={1.1} />
            {!dead && <circle cx={clampPt(s.p)[0]} cy={clampPt(s.p)[1]} r={4.5} fill={C[2]} stroke="var(--surface)" strokeWidth={1} />}
            <text x={px(data.w)} y={py(data.b) + 4} fontSize="12" textAnchor="middle" fill="var(--fg)">★</text>
          </g>
        </g>
        <text x={box[0] + 4} y={box[1] + 10} fontSize="9" fill="var(--fg)">slope w →, intercept b ↑</text>
        <text x={box[2] - 4} y={box[3] - 4} fontSize="9" textAnchor="end" fill="var(--fg)">
          {dead ? 'SGD diverged!' : `step ${k.current} · epoch ${(k.current * B / N).toFixed(1)} · η ${eta.toPrecision(2)}`}
        </text>
        <line x1={bot[0]} x2={bot[2]} y1={bot[3]} y2={bot[3]} stroke="var(--fg)" strokeWidth={0.8} />
        <line x1={bot[0]} x2={bot[0]} y1={bot[1]} y2={bot[3]} stroke="var(--fg)" strokeWidth={0.8} />
        {[-4, -2, 0].map((e) => <text key={e} x={bot[0] - 3} y={hy(e) + 3} fontSize="7" textAnchor="end" fill="var(--muted)">1e{e}</text>)}
        {showGD && <path d={histPath(gd.current.hist)} fill="none" stroke="var(--muted)" strokeWidth={1.2} strokeDasharray="3 2" />}
        <path d={histPath(s.hist)} fill="none" stroke={C[2]} strokeWidth={1.2} />
        <text x={bot[0] + 3} y={bot[1] - 3} fontSize="8" fill="var(--fg)">L − L* (log scale), last 300 steps</text>
        <text x={bot[2]} y={bot[1] - 3} fontSize="8" textAnchor="end"><tspan fill={C[2]}>— SGD</tspan>{showGD && <tspan fill="var(--muted)">  - - full GD</tspan>}</text>
      </Stage>
      <Controls>
        <Slider label="batch size B" min={1} max={Math.min(N, 128)} step={1} value={B} onChange={(v) => setB(Math.round(v))} format={(v) => String(Math.round(v))} />
        <Slider label="learning rate η" min={0.01} max={1} step={0.01} value={lr} onChange={setLr} format={(v) => v.toFixed(2)} />
        <Btn active={!decay} onClick={() => setDecay(false)}>constant η</Btn>
        <Btn active={decay} onClick={() => setDecay(true)}>η/(1+k/50)</Btn>
        <PlayPause running={running} set={setRunning} />
        <Btn onClick={() => reset()}>↺ Reset</Btn>
      </Controls>
    </div>
  );
}
