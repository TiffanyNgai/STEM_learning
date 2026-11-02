import { useMemo, useState } from 'react';
import { Axes, Controls, Slider, Stage, pathOf, scale } from './_kit';

/**
 * Logistic map x_{n+1} = r·x_n·(1 − x_n). Top: orbit (bifurcation) diagram — for each r, the
 * values the orbit keeps visiting after transients die out, showing the period-doubling cascade
 * into chaos. Bottom: the first iterates x_0…x_N at the selected r (two starts differing by δ,
 * to show sensitive dependence in the chaotic range).
 * props: { r?: number (default 3.2), rMin?: number (default 2.8), rMax?: number (default 4),
 *          x0?: number (default 0.2), delta?: number (second start offset, default 1e-4; 0 hides it),
 *          n?: number (iterates in the time series, default 40) }
 */
export default function MathLogisticMap({ r: r0 = 3.2, rMin = 2.8, rMax = 4, x0 = 0.2, delta = 1e-4, n = 40 }: {
  r?: number; rMin?: number; rMax?: number; x0?: number; delta?: number; n?: number;
}) {
  const [r, setR] = useState(r0);
  const top: [number, number, number, number] = [30, 8, 312, 118];
  const bot: [number, number, number, number] = [30, 140, 312, 220];
  const sr = scale([rMin, rMax], [top[0], top[2]]);
  const syT = scale([0, 1], [top[3], top[1]]);
  const orbit = useMemo(() => {
    const cols = 280, parts: string[] = [];
    for (let c = 0; c <= cols; c++) {
      const rr = rMin + ((rMax - rMin) * c) / cols;
      let x = 0.5;
      for (let i = 0; i < 400; i++) x = rr * x * (1 - x);
      const seen = new Set<number>();
      for (let i = 0; i < 120; i++) {
        x = rr * x * (1 - x);
        const py = Math.round(syT(x) * 2) / 2;
        if (!seen.has(py)) { seen.add(py); parts.push(`M${sr(rr).toFixed(1)},${py}h0.8`); }
      }
    }
    return parts.join('');
  }, [rMin, rMax]);

  const series = (start: number) => { const out = [start]; for (let i = 0; i < n; i++) out.push(r * out[i] * (1 - out[i])); return out; };
  const a = series(x0), b = delta ? series(x0 + delta) : [];
  const sn = scale([0, n], [bot[0], bot[2]]); const syB = scale([0, 1], [bot[3], bot[1]]);
  const regime = r < 3 ? 'one stable fixed point' : r < 1 + Math.sqrt(6) ? 'period 2' : r < 3.5441 ? 'period 4' : r < 3.5699 ? 'period 8, 16, …' : 'chaos (with periodic windows)';
  return (
    <div>
      <Stage w={320} h={238} label="Logistic map orbit diagram and time series">
        <Axes x={[rMin, rMax]} y={[0, 1]} box={top} grid={false} xLabel="r" yLabel="x" />
        <path d={orbit} stroke="var(--fg)" strokeWidth={0.6} opacity={0.75} fill="none" />
        <line x1={sr(r)} x2={sr(r)} y1={top[1]} y2={top[3]} stroke="var(--c3)" strokeWidth={1.4} />
        <Axes x={[0, n]} y={[0, 1]} box={bot} grid={false} xLabel="n" yLabel="xₙ" />
        {b.length > 0 && <path d={pathOf(b.map((v, i) => [sn(i), syB(v)]))} stroke="var(--c5)" strokeWidth={1.2} fill="none" opacity={0.8} />}
        <path d={pathOf(a.map((v, i) => [sn(i), syB(v)]))} stroke="var(--c2)" strokeWidth={1.4} fill="none" />
        {a.map((v, i) => <circle key={i} cx={sn(i)} cy={syB(v)} r={1.6} fill="var(--c2)" />)}
        <text x={30} y={134} fontSize="9">r = {r.toFixed(3)}: {regime}</text>
      </Stage>
      <Controls>
        <Slider label="r" min={rMin} max={rMax} step={0.001} value={r} onChange={setR} format={(v) => v.toFixed(3)} />
      </Controls>
    </div>
  );
}
