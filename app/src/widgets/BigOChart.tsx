import { useState } from 'react';
import { Axes, Btn, C, Controls, Slider, Stage, pathOf, scale } from './_kit';

/**
 * Growth-rate explorer: curves for common complexity classes, an n slider, and an
 * operation-count + running-time readout (at `opsPerSecond`).
 * props: { curves?: ('1'|'logn'|'sqrtn'|'n'|'nlogn'|'n2'|'n3'|'2n'|'nfact')[] (default 1, log n, n, n log n, n², 2ⁿ),
 *          nMax?: number (x-axis max, default 40), n?: number (initial slider, default 20),
 *          log?: boolean (start with log-scale y axis, default false), opsPerSecond?: number (default 1e9),
 *          maxSlider?: number (largest n on slider, default 1e6) }
 */
type Key = '1' | 'logn' | 'sqrtn' | 'n' | 'nlogn' | 'n2' | 'n3' | '2n' | 'nfact';
const lg = (n: number) => Math.log2(Math.max(1, n));
const lnFact = (n: number) => {
  if (n > 30) return n * Math.log(n) - n + 0.5 * Math.log(2 * Math.PI * n); // Stirling
  let s = 0; for (let i = 2; i <= n; i++) s += Math.log(i); return s;
};
// each curve gives log10(f(n)) so huge values never overflow
const DEF: Record<Key, { label: string; log10: (n: number) => number }> = {
  '1': { label: 'O(1)', log10: () => 0 },
  logn: { label: 'O(log n)', log10: (n) => Math.log10(Math.max(1, lg(n))) },
  sqrtn: { label: 'O(√n)', log10: (n) => 0.5 * Math.log10(n) },
  n: { label: 'O(n)', log10: (n) => Math.log10(n) },
  nlogn: { label: 'O(n log n)', log10: (n) => Math.log10(n * Math.max(1, lg(n))) },
  n2: { label: 'O(n²)', log10: (n) => 2 * Math.log10(n) },
  n3: { label: 'O(n³)', log10: (n) => 3 * Math.log10(n) },
  '2n': { label: 'O(2ⁿ)', log10: (n) => n * Math.log10(2) },
  nfact: { label: 'O(n!)', log10: (n) => lnFact(n) / Math.LN10 },
};

function fmtOps(l10: number) {
  if (l10 < 6) return Math.round(10 ** l10).toLocaleString();
  const e = Math.floor(l10); return `${(10 ** (l10 - e)).toFixed(1)}×10^${e}`;
}
function fmtTime(l10sec: number) {
  if (l10sec > 30) return `10^${Math.floor(l10sec - 7.5)} years`;
  const s = 10 ** l10sec;
  const units: [number, string][] = [[3.15e7 * 1.38e10, '× age of universe'], [3.15e7, 'years'], [86400, 'days'], [3600, 'h'], [60, 'min'], [1, 's'], [1e-3, 'ms'], [1e-6, 'µs'], [1e-9, 'ns']];
  for (const [u, name] of units) if (s >= u) return `${(s / u).toPrecision(3)} ${name}`;
  return '< 1 ns';
}

export default function BigOChart({ curves = ['1', 'logn', 'n', 'nlogn', 'n2', '2n'], nMax = 40, n = 20, log = false, opsPerSecond = 1e9, maxSlider = 1e6 }: {
  curves?: Key[]; nMax?: number; n?: number; log?: boolean; opsPerSecond?: number; maxSlider?: number;
}) {
  const [logY, setLogY] = useState(log);
  const [xMax, setXMax] = useState(nMax);
  // slider is logarithmic in n so it can reach a million
  const [sl, setSl] = useState(Math.log10(Math.max(1, n)));
  const nv = Math.max(1, Math.round(10 ** sl));
  const keys = curves.filter((k) => DEF[k]);
  const box: [number, number, number, number] = [30, 10, 312, 180];
  const yLin = Math.max(10, xMax * lg(xMax) * 1.2);
  const yLogMax = Math.max(3, Math.ceil(2 * Math.log10(xMax) + 1));
  const yr: [number, number] = logY ? [0, yLogMax] : [0, yLin];
  const sx = scale([1, xMax], [box[0], box[2]]); const sy = scale(yr, [box[3], box[1]]);
  const paths = keys.map((k) => {
    const pts: [number, number][] = [];
    for (let i = 0; i <= 200; i++) {
      const x = 1 + ((xMax - 1) * i) / 200; const l = DEF[k].log10(x);
      const y = logY ? l : 10 ** Math.min(l, 300);
      pts.push([sx(x), Math.max(box[1] - 5, sy(Math.min(y, yr[1] * 1.05)))]);
      if (y > yr[1]) break;
    }
    return pathOf(pts);
  });
  const xn = Math.min(nv, xMax);
  return (
    <div>
      <Stage label="Growth of common complexity classes">
        <clipPath id="bigo-clip"><rect x={box[0]} y={box[1] - 5} width={box[2] - box[0]} height={box[3] - box[1] + 5} /></clipPath>
        <Axes x={[1, xMax]} y={yr} box={box} xLabel="n" yLabel={logY ? 'log₁₀(steps)' : 'steps'} />
        <g clipPath="url(#bigo-clip)">
          {paths.map((d, i) => <path key={keys[i]} d={d} fill="none" stroke={C[i % 6]} strokeWidth={2} />)}
          {nv <= xMax && <line x1={sx(xn)} x2={sx(xn)} y1={box[1]} y2={box[3]} stroke="var(--fg)" strokeDasharray="3 3" strokeWidth={0.8} />}
        </g>
        {keys.map((k, i) => <text key={k} x={box[0] + 6} y={box[1] + 10 + i * 10} fontSize="9" fill={C[i % 6]}>{DEF[k].label}</text>)}
      </Stage>
      <Controls>
        <Slider label="n" min={0} max={Math.log10(maxSlider)} step={0.01} value={sl} onChange={setSl} format={() => nv.toLocaleString()} />
        <Btn active={logY} onClick={() => setLogY(!logY)}>log y</Btn>
        <Btn onClick={() => setXMax(xMax >= 1000 ? 10 : xMax * 4)}>x-range: {xMax}</Btn>
      </Controls>
      <table className="w-table" style={{ width: '100%', fontSize: '0.85em', borderCollapse: 'collapse' }}>
        <thead><tr><th style={{ textAlign: 'left' }}>class</th><th style={{ textAlign: 'right' }}>steps at n = {nv.toLocaleString()}</th><th style={{ textAlign: 'right' }}>time @ {opsPerSecond.toExponential(0)} ops/s</th></tr></thead>
        <tbody>
          {keys.map((k, i) => {
            const l = DEF[k].log10(nv);
            return (
              <tr key={k}>
                <td style={{ color: C[i % 6], fontWeight: 600 }}>{DEF[k].label}</td>
                <td style={{ textAlign: 'right' }}>{fmtOps(l)}</td>
                <td style={{ textAlign: 'right' }}>{fmtTime(l - Math.log10(opsPerSecond))}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
