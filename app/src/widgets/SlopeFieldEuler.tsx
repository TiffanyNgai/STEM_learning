import { useMemo, useState } from 'react';
import { Axes, Btn, Controls, Slider, Stage, compileExpr, pathOf, scale } from './_kit';

/**
 * Slope field of a first-order ODE  dy/dx = f(x, y)  with an Euler-method stepper.
 * Tap the plot to choose the starting point (x0, y0); press "Step" to take one Euler step
 * y_{n+1} = y_n + h·f(x_n, y_n), or "Run" to go to the right edge. Optional exact solution
 * (an expression in x, x0, y0) is drawn for comparison, with the current error.
 * props: { f?: string (default "y"), exact?: string (e.g. "y0*exp(x-x0)"), x?: [a,b], y?: [a,b],
 *          x0?: number, y0?: number, h?: number (initial step size), showField?: boolean }
 */
export default function SlopeFieldEuler({ f = 'y', exact, x = [0, 3], y = [0, 10], x0 = 0, y0 = 1, h: h0 = 0.5, showField = true }: {
  f?: string; exact?: string; x?: [number, number]; y?: [number, number]; x0?: number; y0?: number; h?: number; showField?: boolean;
}) {
  const F = useMemo(() => compileExpr(f, ['x', 'y']), [f]);
  const Ex = useMemo(() => (exact ? compileExpr(exact, ['x', 'x0', 'y0']) : null), [exact]);
  const [start, setStart] = useState<[number, number]>([x0, y0]);
  const [h, setH] = useState(h0);
  const [n, setN] = useState(0);
  const box: [number, number, number, number] = [28, 10, 312, 172];
  const sx = scale(x, [box[0], box[2]]); const sy = scale(y, [box[3], box[1]]);
  const maxSteps = Math.max(1, Math.floor((x[1] - start[0]) / h + 1e-9));

  const pts: [number, number][] = [start];
  for (let i = 0; i < Math.min(n, maxSteps); i++) {
    const [xi, yi] = pts[i];
    pts.push([xi + h, yi + h * F(xi, yi)]);
  }
  const field = [];
  if (showField) {
    const nx = 17, ny = 11, dxp = (box[2] - box[0]) / nx, dyp = (box[3] - box[1]) / ny;
    const kx = (box[2] - box[0]) / (x[1] - x[0]), ky = (box[3] - box[1]) / (y[1] - y[0]);
    for (let i = 0; i < nx; i++) for (let j = 0; j < ny; j++) {
      const px = box[0] + (i + 0.5) * dxp, py = box[1] + (j + 0.5) * dyp;
      const xv = x[0] + ((px - box[0]) / (box[2] - box[0])) * (x[1] - x[0]);
      const yv = y[1] - ((py - box[1]) / (box[3] - box[1])) * (y[1] - y[0]);
      const s = F(xv, yv); if (!Number.isFinite(s)) continue;
      const vx = kx, vy = -s * ky, m = Math.hypot(vx, vy), L = 5.5;
      field.push(<line key={i + '-' + j} x1={px - (vx / m) * L} y1={py - (vy / m) * L} x2={px + (vx / m) * L} y2={py + (vy / m) * L} stroke="var(--muted)" strokeWidth={0.8} opacity={0.65} />);
    }
  }
  const clampY = (v: number) => Math.max(-40, Math.min(240, v));
  let exactPath = '';
  if (Ex) {
    const e: [number, number][] = [];
    for (let i = 0; i <= 200; i++) { const xv = start[0] + ((x[1] - start[0]) * i) / 200; const yv = Ex(xv, start[0], start[1]); if (Number.isFinite(yv)) e.push([sx(xv), clampY(sy(yv))]); }
    exactPath = pathOf(e);
  }
  const last = pts[pts.length - 1];
  const err = Ex ? Math.abs(last[1] - Ex(last[0], start[0], start[1])) : NaN;

  return (
    <div>
      <Stage w={320} h={196} label={`Slope field of dy/dx = ${f} with Euler steps`}>
        <clipPath id="sfe-clip"><rect x={box[0]} y={box[1]} width={box[2] - box[0]} height={box[3] - box[1]} /></clipPath>
        <rect x={box[0]} y={box[1]} width={box[2] - box[0]} height={box[3] - box[1]} fill="transparent"
          onPointerDown={(ev) => {
            const svg = (ev.target as SVGElement).ownerSVGElement!; const pt = svg.createSVGPoint(); pt.x = ev.clientX; pt.y = ev.clientY;
            const q = pt.matrixTransform(svg.getScreenCTM()!.inverse());
            const xv = x[0] + ((q.x - box[0]) / (box[2] - box[0])) * (x[1] - x[0]);
            const yv = y[1] - ((q.y - box[1]) / (box[3] - box[1])) * (y[1] - y[0]);
            setStart([+xv.toFixed(2), +yv.toFixed(2)]); setN(0);
          }} />
        <Axes x={x} y={y} box={box} grid={false} />
        <g pointerEvents="none" clipPath="url(#sfe-clip)">
          {field}
          {exactPath && <path d={exactPath} fill="none" stroke="var(--c1)" strokeWidth={2} />}
          <path d={pathOf(pts.map(([a, b]) => [sx(a), clampY(sy(b))]))} fill="none" stroke="var(--c3)" strokeWidth={1.8} />
          {pts.map(([a, b], i) => <circle key={i} cx={sx(a)} cy={clampY(sy(b))} r={2.6} fill="var(--c3)" />)}
        </g>
        <text x={box[0] + 4} y={192} fontSize="8.5" fill="var(--fg)">
          <tspan fill="var(--c3)">● Euler</tspan>{Ex && <tspan fill="var(--c1)">  — exact</tspan>}
          {'   '}step {Math.min(n, maxSteps)}: x={last[0].toFixed(2)}, y≈{last[1].toPrecision(4)}{Ex && Number.isFinite(err) ? `, error ${err.toPrecision(2)}` : ''}
        </text>
      </Stage>
      <Controls>
        <Slider label="step h" min={0.05} max={1} step={0.05} value={h} onChange={(v) => { setH(v); setN((k) => (k ? Math.floor((x[1] - start[0]) / v + 1e-9) : 0)); }} />
        <Btn onClick={() => setN((k) => Math.min(k + 1, maxSteps))}>Step ▶</Btn>
        <Btn onClick={() => setN(maxSteps)}>Run ⏩</Btn>
        <Btn onClick={() => setN(0)}>Reset</Btn>
      </Controls>
    </div>
  );
}
