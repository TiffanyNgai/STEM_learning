import { useMemo, useState } from 'react';
import { Btn, Controls, Slider, Stage, pathOf, scale } from './_kit';

/**
 * What a guidance scale really does, in 1-D. Two classes live on the line; class A has a big mode and a
 * small mode, and the small one sits where class B also has mass, so the implicit classifier p(A|x) is
 * unsure there. Guidance samples from the tilted density
 *     q_w(x) ∝ p(x|A)·p(A|x)^w ∝ p(x|A)^{1+w}·p(x)^{−w},
 * which is exactly what classifier guidance (an explicit p(A|x)) and classifier-free guidance
 * (the ε-combination (1+w)ε_A − w·ε_∅) target. Everything is computed on a 481-point grid and
 * renormalised, so the printed standard deviation is the real diversity of q_w.
 * props: {
 *   w?: number          initial guidance scale w ≥ 0 (default 0)
 *   showClassifier?: boolean  start with the p(A|x) curve on (default false)
 *   wMax?: number       slider maximum (default 8)
 * }
 */
const N = 481, XL = -4, XR = 4;
const nrm = (x: number, m: number, s: number) => Math.exp(-((x - m) ** 2) / (2 * s * s)) / (s * Math.sqrt(2 * Math.PI));
const pA = (x: number) => 0.68 * nrm(x, -1.7, 0.42) + 0.32 * nrm(x, 0.35, 0.34);
const pB = (x: number) => 0.55 * nrm(x, 0.55, 0.40) + 0.45 * nrm(x, 2.1, 0.45);

export default function MlGuidanceDial({ w: w0 = 0, showClassifier = false, wMax = 8 }: {
  w?: number; showClassifier?: boolean; wMax?: number;
}) {
  const [w, setW] = useState(w0);
  const [clf, setClf] = useState(showClassifier);
  const L = 36, T = 10, R = 306, B = 158;
  const sx = scale([XL, XR], [L, R]);

  const { grid, base, cls, guided, std, std0, peak } = useMemo(() => {
    const grid: number[] = [], base: number[] = [], cls: number[] = [], all: number[] = [];
    for (let i = 0; i < N; i++) {
      const x = XL + ((XR - XL) * i) / (N - 1);
      const a = pA(x), m = 0.5 * a + 0.5 * pB(x);
      grid.push(x); base.push(a); all.push(m); cls.push(a / (2 * m));
    }
    const dx = (XR - XL) / (N - 1);
    const tilt = (ww: number) => {
      const u = grid.map((_, i) => Math.exp((1 + ww) * Math.log(base[i] + 1e-300) - ww * Math.log(all[i] + 1e-300)));
      const z = u.reduce((s, v) => s + v, 0) * dx;
      return u.map((v) => v / z);
    };
    const sd = (q: number[]) => {
      const m = q.reduce((s, v, i) => s + v * grid[i], 0) * dx;
      return Math.sqrt(q.reduce((s, v, i) => s + v * (grid[i] - m) ** 2, 0) * dx);
    };
    const guided = tilt(w);
    return { grid, base, cls, guided, std: sd(guided), std0: sd(tilt(0)), peak: Math.max(...guided, ...base) };
  }, [w]);

  const sy = scale([0, Math.max(peak, 0.6) * 1.08], [B, T]);
  const line = (ys: number[]) => pathOf(grid.map((x, i) => [sx(x), sy(ys[i])]));
  const ratio = std / std0;

  return (
    <div>
      <Stage label="Guidance sharpens a conditional density and shrinks its diversity">
        <line x1={L} x2={R} y1={B} y2={B} stroke="var(--fg)" strokeWidth={0.8} />
        {[-3, -2, -1, 0, 1, 2, 3].map((v) => <text key={v} x={sx(v)} y={B + 10} fontSize="8" textAnchor="middle" fill="var(--muted)">{v}</text>)}
        <path d={line(base)} fill="none" stroke="var(--c2)" strokeWidth={1.4} strokeDasharray="3 2" />
        <path d={line(guided)} fill="none" stroke="var(--c3)" strokeWidth={2} />
        {clf && <path d={pathOf(grid.map((x, i) => [sx(x), sy(cls[i] * Math.max(peak, 0.6) * 0.95)]))} fill="none" stroke="var(--c6)" strokeWidth={1} />}
        <g fontSize="8.5">
          <text x={L} y={T + 6} fill="var(--c2)">p(x | A), unguided</text>
          <text x={L} y={T + 17} fill="var(--c3)">q_w(x) ∝ p(x|A)^(1+w) p(x)^(−w)</text>
          {clf && <text x={L} y={T + 28} fill="var(--c6)">p(A | x) (scaled to fit)</text>}
          <text x={R} y={T + 6} textAnchor="end" fill="var(--fg)">w = {w.toFixed(2)}</text>
          <text x={R} y={T + 17} textAnchor="end" fill="var(--muted)">std = {std.toFixed(3)}</text>
        </g>
        <g>
          <text x={L} y={B + 26} fontSize="8.5" fill="var(--fg)">diversity vs w = 0</text>
          <rect x={L} y={B + 30} width={R - L} height={8} fill="none" stroke="var(--grid)" />
          <rect x={L} y={B + 30} width={(R - L) * Math.min(1, ratio)} height={8} fill="var(--c3)" opacity={0.6} />
          <text x={R} y={B + 37} fontSize="8.5" textAnchor="end" fill="var(--muted)">{(100 * ratio).toFixed(0)}%</text>
        </g>
      </Stage>
      <Controls>
        <Slider label="guidance w" min={0} max={wMax} step={0.25} value={w} onChange={setW} />
        <Btn active={clf} onClick={() => setClf(!clf)}>Show p(A|x)</Btn>
        <Btn onClick={() => setW(0)}>w = 0</Btn>
        <Btn onClick={() => setW(3)}>w = 3</Btn>
      </Controls>
    </div>
  );
}
