import { useState } from 'react';
import { Axes, Btn, Controls, Slider, Stage, compileExpr, scale } from './_kit';

interface Series { label: string; term: string; target?: number; note?: string }
/**
 * Partial sums of an infinite series Σ aₙ. Small bars show the terms aₙ; dots show the partial sums
 * S_N = a₁ + … + a_N. A dashed line marks the known sum (if any). Switch between preset series to compare
 * e.g. the divergent harmonic series with Σ 1/n² or the alternating harmonic series.
 * props: { series?: { label: string, term: string (in n), target?: number, note?: string }[]
 *          (default: harmonic, 1/n², alternating harmonic, geometric 1/2ⁿ), nMax?: number (10–200, default 60), start?: number (initial preset index) }
 */
const DEFAULT: Series[] = [
  { label: 'Σ 1/n', term: '1/n', note: 'harmonic: grows like ln N — diverges' },
  { label: 'Σ 1/n²', term: '1/n^2', target: Math.PI ** 2 / 6, note: 'sum = π²/6 ≈ 1.6449' },
  { label: 'Σ (−1)ⁿ⁺¹/n', term: '(-1)^(n+1)/n', target: Math.LN2, note: 'alternating harmonic: sum = ln 2 ≈ 0.6931' },
  { label: 'Σ 1/2ⁿ', term: '1/2^n', target: 1, note: 'geometric, ratio ½: sum = 1' },
];

export default function MathPartialSums({ series = DEFAULT, nMax = 60, start = 0 }: { series?: Series[]; nMax?: number; start?: number }) {
  const M = Math.max(10, Math.min(200, Math.round(nMax)));
  const [idx, setIdx] = useState(Math.max(0, Math.min(series.length - 1, start)));
  const [N, setN] = useState(Math.min(10, M));
  const s = series[idx];
  const f = compileExpr(s.term, ['n']);
  const terms = Array.from({ length: M }, (_, i) => f(i + 1));
  const sums: number[] = []; terms.reduce((acc, t) => { const v = acc + t; sums.push(v); return v; }, 0);
  const all = [...sums, ...terms, 0, ...(s.target !== undefined ? [s.target] : [])].filter(Number.isFinite);
  const lo = Math.min(...all), hi = Math.max(...all);
  const yr: [number, number] = [lo - 0.08 * (hi - lo), hi + 0.08 * (hi - lo)];
  const box: [number, number, number, number] = [30, 10, 312, 160];
  const sx = scale([0, M + 1], [box[0], box[2]]), sy = scale(yr, [box[3], box[1]]);
  const bw = Math.max(0.8, ((box[2] - box[0]) / (M + 1)) * 0.5);
  const SN = sums[N - 1];
  return (
    <div>
      <Stage w={320} h={200} label="Partial sums of a series">
        <Axes x={[0, M + 1]} y={yr} box={box} xLabel="N" grid={false} />
        {s.target !== undefined && <>
          <line x1={box[0]} x2={box[2]} y1={sy(s.target)} y2={sy(s.target)} stroke="var(--c2)" strokeDasharray="5 3" />
          <text x={box[2] - 2} y={sy(s.target) - 3} fontSize="9" textAnchor="end" style={{ fill: 'var(--c2)' }}>sum</text>
        </>}
        {terms.slice(0, N).map((t, i) => Number.isFinite(t) && (
          <rect key={'t' + i} x={sx(i + 1) - bw / 2} width={bw} y={Math.min(sy(t), sy(0))} height={Math.abs(sy(t) - sy(0))} fill="var(--c4)" fillOpacity={0.6} />
        ))}
        {sums.slice(0, N).map((v, i) => Number.isFinite(v) && <circle key={'s' + i} cx={sx(i + 1)} cy={sy(v)} r={i === N - 1 ? 3.6 : 2.2} fill="var(--c3)" />)}
        <text x={6} y={176} fontSize="9.5">
          <tspan style={{ fill: 'var(--c3)' }} fontWeight="bold">S_{N} = {SN.toFixed(5)}</tspan>
          <tspan style={{ fill: 'var(--c4)' }}>{'   '}a_{N} = {terms[N - 1].toPrecision(3)}</tspan>
          {s.target !== undefined && <tspan style={{ fill: 'var(--c2)' }}>{'   '}gap = {Math.abs(s.target - SN).toPrecision(3)}</tspan>}
        </text>
        <text x={6} y={191} fontSize="9" style={{ fill: 'var(--muted)' }}>{s.label}: {s.note ?? ''}</text>
      </Stage>
      <Controls>
        {series.map((q, i) => <Btn key={i} active={i === idx} onClick={() => setIdx(i)}>{q.label}</Btn>)}
        <Slider label="N terms" value={N} min={1} max={M} step={1} onChange={setN} format={(v) => String(v)} />
      </Controls>
    </div>
  );
}
