import { useState } from 'react';
import { Axes, C, Controls, PlayPause, Slider, Stage, compileExpr, pathOf, scale, useFrame } from './_kit';

interface Param { name: string; min: number; max: number; value: number; label?: string }
/**
 * Plot one or more curves y = f(x, params..., t).
 * props: { fns: string[]  (e.g. ["sin(k*x - w*t)"]), x?: [a,b], y?: [a,b], params?: Param[],
 *          animate?: boolean (advances t), labels?: string[], xLabel?, yLabel? }
 */
export default function FunctionPlot({ fns = ['sin(x)'], x = [-6, 6], y = [-2, 2], params = [], animate = false, labels = [], xLabel = 'x', yLabel = 'y' }: {
  fns?: string[]; x?: [number, number]; y?: [number, number]; params?: Param[]; animate?: boolean; labels?: string[]; xLabel?: string; yLabel?: string;
}) {
  const [vals, setVals] = useState<Record<string, number>>(() => Object.fromEntries(params.map((p) => [p.name, p.value])));
  const [t, setT] = useState(0);
  const [running, setRunning] = useState(animate);
  useFrame((dt) => setT((v) => v + dt), running);
  const names = params.map((p) => p.name);
  const box: [number, number, number, number] = [28, 10, 312, 180];
  const sx = scale(x, [box[0], box[2]]); const sy = scale(y, [box[3], box[1]]);
  const curves = fns.map((src) => {
    const f = compileExpr(src, ['x', ...names, 't']);
    const pts: [number, number][][] = [[]];
    for (let i = 0; i <= 240; i++) {
      const xv = x[0] + ((x[1] - x[0]) * i) / 240;
      const yv = f(xv, ...names.map((n) => vals[n]), t);
      if (Number.isNaN(yv) || yv < y[0] - 10 * (y[1] - y[0]) || yv > y[1] + 10 * (y[1] - y[0])) { pts.push([]); continue; }
      pts[pts.length - 1].push([sx(xv), Math.max(-50, Math.min(250, sy(yv)))]);
    }
    return pts.filter((p) => p.length > 1).map(pathOf).join('');
  });
  return (
    <div>
      <Stage label={`Plot of ${fns.join(', ')}`}>
        <clipPath id="fp-clip"><rect x={box[0]} y={box[1]} width={box[2] - box[0]} height={box[3] - box[1]} /></clipPath>
        <Axes x={x} y={y} box={box} xLabel={xLabel} yLabel={yLabel} />
        <g clipPath="url(#fp-clip)">
          {curves.map((d, i) => <path key={i} d={d} fill="none" stroke={C[i % 6]} strokeWidth={2} />)}
        </g>
        {labels.map((l, i) => <text key={i} x={box[2] - 4} y={box[1] + 10 + i * 10} textAnchor="end" fontSize="9" fill={C[i % 6]}>{l}</text>)}
      </Stage>
      {(params.length > 0 || animate) && (
        <Controls>
          {params.map((p) => (
            <Slider key={p.name} label={p.label ?? p.name} min={p.min} max={p.max} value={vals[p.name]}
              onChange={(v) => setVals((s) => ({ ...s, [p.name]: v }))} />
          ))}
          {animate && <PlayPause running={running} set={setRunning} />}
        </Controls>
      )}
    </div>
  );
}
