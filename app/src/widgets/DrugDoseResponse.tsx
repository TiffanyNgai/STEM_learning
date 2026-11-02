import { useMemo, useState } from 'react';
import { Axes, Btn, Controls, Slider, Stage, pathOf, rng, scale } from './_kit';

/**
 * Concentration–response (Hill / four-parameter logistic) curve on a log-concentration axis.
 *   inhibition: y = bottom + (top − bottom) / (1 + ([I]/IC50)^h)     activation: y = bottom + (top − bottom) / (1 + (EC50/[A])^h)
 * Sliders: pIC50 (= −log10 IC50 in M), Hill slope h. Optional noisy "plate" data points, a fixed reference
 * compound for comparison, and a Cheng–Prusoff panel converting IC50 to Ki for a competitive inhibitor.
 * props: { mode?: 'inhibition'|'activation', pIC50?: number (default 7), hill?: number (default 1), showData?: boolean,
 *          compare?: boolean (show reference compound, pIC50 = 6, h = 1), showKi?: boolean, top?: number (100), bottom?: number (0) }
 */
const fmtM = (log: number) => {
  const c = Math.pow(10, log);
  if (c >= 1e-6) return `${+(c * 1e6).toPrecision(3)} µM`;
  if (c >= 1e-9) return `${+(c * 1e9).toPrecision(3)} nM`;
  return `${+(c * 1e12).toPrecision(3)} pM`;
};

export default function DrugDoseResponse({ mode = 'inhibition', pIC50 = 7, hill = 1, showData = false, compare = false, showKi = false, top = 100, bottom = 0 }: {
  mode?: 'inhibition' | 'activation'; pIC50?: number; hill?: number; showData?: boolean; compare?: boolean; showKi?: boolean; top?: number; bottom?: number;
}) {
  const [p, setP] = useState(pIC50);
  const [h, setH] = useState(hill);
  const [sKm, setSKm] = useState(1);
  const [seed, setSeed] = useState(1);
  const inh = mode === 'inhibition';
  const f = (logc: number, pp: number, hh: number) => {
    const ratio = Math.pow(10, (logc + pp) * hh); // ([X]/X50)^h
    return inh ? bottom + (top - bottom) / (1 + ratio) : bottom + (top - bottom) / (1 + 1 / ratio);
  };
  const xr: [number, number] = [-11, -3];
  const box: [number, number, number, number] = [30, 10, 312, 160];
  const sx = scale(xr, [box[0], box[2]]); const sy = scale([-10, 115], [box[3], box[1]]);
  const curve = (pp: number, hh: number) => pathOf(Array.from({ length: 161 }, (_, i) => {
    const lx = xr[0] + ((xr[1] - xr[0]) * i) / 160; return [sx(lx), sy(f(lx, pp, hh))] as [number, number];
  }));
  const data = useMemo(() => {
    const r = rng(seed);
    const pts: [number, number][] = [];
    for (let lx = -10; lx <= -4; lx += 0.5) for (let rep = 0; rep < 2; rep++) pts.push([lx, f(lx, pIC50, hill) + 6 * r.normal()]);
    return pts;
  }, [seed, pIC50, hill, mode]);
  const half = (top + bottom) / 2;
  const x50 = -p;
  const ki = Math.log10(Math.pow(10, x50) / (1 + sKm));
  const lbl = inh ? 'IC50' : 'EC50';

  return (
    <div>
      <Stage w={320} h={184} label={`Dose–response curve, ${lbl} ${fmtM(x50)}`}>
        <Axes x={xr} y={[-10, 115]} box={box} grid xLabel="log₁₀[compound] (M)" yLabel={inh ? '% activity' : '% response'} />
        {showData && data.map(([lx, y], i) => <circle key={i} cx={sx(lx)} cy={sy(y)} r={2.2} fill="var(--muted)" />)}
        {compare && <path d={curve(6, 1)} fill="none" stroke="var(--c4)" strokeWidth={1.5} strokeDasharray="4 3" />}
        {compare && <text x={sx(-6) + 4} y={sy(inh ? 70 : 30)} fontSize="8.5" fill="var(--c4)">reference (1 µM)</text>}
        <line x1={box[0]} x2={sx(x50)} y1={sy(half)} y2={sy(half)} stroke="var(--c3)" strokeDasharray="3 3" />
        <line x1={sx(x50)} x2={sx(x50)} y1={sy(half)} y2={box[3]} stroke="var(--c3)" strokeDasharray="3 3" />
        <path d={curve(p, h)} fill="none" stroke="var(--c2)" strokeWidth={2.5} />
        <circle cx={sx(x50)} cy={sy(half)} r={3.5} fill="var(--c3)" />
        <text x={sx(x50) + 5} y={sy(half) - 5} fontSize="9" fontWeight={700} fill="var(--c3)">{lbl} = {fmtM(x50)}</text>
        {showKi && inh && <>
          <line x1={sx(ki)} x2={sx(ki)} y1={box[1] + 12} y2={box[3]} stroke="var(--c1)" strokeWidth={1.5} />
          <text x={sx(ki) - 3} y={box[1] + 10} textAnchor="end" fontSize="8.5" fontWeight={700} fill="var(--c1)">Ki = {fmtM(ki)}</text>
        </>}
        <text x={box[2]} y={box[3] + 20} textAnchor="end" fontSize="8" fill="var(--muted)">
          p{lbl} = {p.toFixed(1)} · Hill h = {h.toFixed(2)} · 10%→90% spans {(Math.log10(81) / h).toFixed(1)} log units
        </text>
      </Stage>
      <Controls>
        <Slider label={`p${lbl}`} min={4} max={10} step={0.1} value={p} onChange={setP} format={(v) => `${v.toFixed(1)} (${fmtM(-v)})`} />
        <Slider label="Hill h" min={0.3} max={4} step={0.05} value={h} onChange={setH} />
        {showKi && inh && <Slider label="[S]/Km" min={0} max={20} step={0.5} value={sKm} onChange={setSKm} format={(v) => `${v} → Ki = IC50/${(1 + v).toFixed(1)}`} />}
        {showData && <Btn onClick={() => setSeed((v) => v + 1)}>🎲 New replicate</Btn>}
      </Controls>
    </div>
  );
}
