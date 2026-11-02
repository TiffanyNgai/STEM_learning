import { useState } from 'react';
import { Axes, Btn, C, Controls, Slider, Stage, pathOf, scale } from './_kit';

type Mode = 'iv' | 'oral' | 'multiple';
/**
 * One-compartment pharmacokinetics: plasma concentration vs time.
 * props (all optional):
 *  mode?: 'iv' | 'oral' | 'multiple'   (initial mode; buttons let the learner switch)
 *  modes?: Mode[]                       (which mode buttons to show; default all three)
 *  dose?: number (mg, default 500)      tau?: number (dosing interval h, default 8)
 *  halfLife?: number (h, default 8)     vd?: number (L, default 50)
 *  ka?: number (absorption rate 1/h, default 1.5)   F?: number (bioavailability 0–1, default 1 for iv, 0.8 oral)
 *  window?: [min, max] therapeutic window in mg/L (default [6, 16]); null hides it
 *  tMax?: number (h shown, default 72)  yMax?: number (mg/L, default 30)
 *  showLoading?: boolean (offer a loading-dose toggle in multiple-dose mode, default true)
 * Model: k = ln2/t½; CL = k·Vd; IV bolus C = (D/V)e^{-kt}; oral uses Bateman equation;
 * repeated dosing is superposition (IV boluses, or oral doses if F < 1 is passed). Css,avg = F·D/(CL·τ) shown dashed. Loading dose = D/(1−e^{−kτ}).
 */
export default function PKCurve({ mode = 'multiple', modes = ['iv', 'oral', 'multiple'], dose = 500, tau = 8, halfLife = 8, vd = 50,
  ka = 1.5, F, window = [6, 16], tMax = 72, yMax = 30, showLoading = true }: {
  mode?: Mode; modes?: Mode[]; dose?: number; tau?: number; halfLife?: number; vd?: number; ka?: number; F?: number;
  window?: [number, number] | null; tMax?: number; yMax?: number; showLoading?: boolean;
}) {
  const [m, setM] = useState<Mode>(mode);
  const [D, setD] = useState(dose);
  const [T, setT] = useState(tau);
  const [h, setH] = useState(halfLife);
  const [V, setV] = useState(vd);
  const [load, setLoad] = useState(false);
  const k = Math.LN2 / h;
  const CL = k * V;
  const oralRoute = m === 'oral' || (m === 'multiple' && F !== undefined && F < 1);
  const bio = F ?? (m === 'oral' ? 0.8 : 1);
  const one = (t: number, d: number) => {
    if (t < 0) return 0;
    if (!oralRoute) return (d / V) * Math.exp(-k * t);
    const kk = Math.abs(ka - k) < 1e-6 ? ka * 1.0001 : ka;
    return ((bio * d * kk) / (V * (kk - k))) * (Math.exp(-k * t) - Math.exp(-kk * t));
  };
  const loadingDose = D / (1 - Math.exp(-k * T));
  const conc = (t: number) => {
    if (m !== 'multiple') return one(t, D);
    let s = 0;
    for (let n = 0; n * T <= t; n++) s += one(t - n * T, n === 0 && load ? loadingDose : D);
    return s;
  };
  const box: [number, number, number, number] = [30, 12, 312, 178];
  const sx = scale([0, tMax], [box[0], box[2]]);
  const sy = scale([0, yMax], [box[3], box[1]]);
  const pts: [number, number][] = [];
  const N = 480;
  for (let i = 0; i <= N; i++) {
    const t = (tMax * i) / N;
    // sample just after each dose so the IV jump is vertical
    pts.push([sx(t), Math.max(box[1] - 4, sy(conc(t)))]);
  }
  const cssAvg = (bio * D) / (CL * T);
  const lo = window ? Math.max(0, Math.min(yMax, window[0])) : 0;
  const hi = window ? Math.max(0, Math.min(yMax, window[1])) : 0;
  return (
    <div>
      <Stage w={320} h={200} label="Plasma concentration versus time">
        <clipPath id="pk-clip"><rect x={box[0]} y={box[1] - 4} width={box[2] - box[0]} height={box[3] - box[1] + 4} /></clipPath>
        {window && (
          <g>
            <rect x={box[0]} width={box[2] - box[0]} y={sy(hi)} height={sy(lo) - sy(hi)} fill="var(--c1)" opacity={0.13} />
            <text x={box[0] + 3} y={sy(hi) + 9} fontSize="8" fill="var(--c1)">therapeutic window</text>
            <text x={box[0] + 3} y={sy(hi) - 2} fontSize="7" fill="var(--c5)">toxic ↑</text>
            <text x={box[0] + 3} y={sy(lo) + 8} fontSize="7" fill="var(--muted)">subtherapeutic ↓</text>
          </g>
        )}
        <Axes x={[0, tMax]} y={[0, yMax]} box={box} xLabel="time (h)" yLabel="C (mg/L)" grid={false} />
        <g clipPath="url(#pk-clip)">
          {m === 'multiple' && <line x1={box[0]} x2={box[2]} y1={sy(cssAvg)} y2={sy(cssAvg)} stroke="var(--c4)" strokeDasharray="4 3" strokeWidth={1} />}
          <path d={pathOf(pts)} fill="none" stroke={C[1]} strokeWidth={2} />
          {m === 'multiple' && Array.from({ length: Math.floor(tMax / T) + 1 }, (_, n) => (
            <path key={n} d={`M${sx(n * T)},${box[3]}l-2.5,5h5z`} fill="var(--c3)" />
          ))}
        </g>
        {m === 'multiple' && <text x={box[2] - 2} y={Math.max(box[1] + 8, sy(cssAvg) - 3)} textAnchor="end" fontSize="8" fill="var(--c4)">Css,avg {cssAvg.toFixed(1)}</text>}
        <text x={box[2] - 2} y={box[1] + 8} textAnchor="end" fontSize="8" fill="var(--muted)">
          {m === 'multiple' ? `≈ steady state after ~4–5 t½ = ${(4.5 * h).toFixed(0)} h` : `CL = ${CL.toFixed(1)} L/h, k = ${k.toFixed(3)}/h`}
        </text>
      </Stage>
      <Controls>
        {modes.length > 1 && modes.map((md) => (
          <Btn key={md} active={m === md} onClick={() => setM(md)}>{md === 'iv' ? 'IV bolus' : md === 'oral' ? 'Oral' : 'Repeated'}</Btn>
        ))}
        {m === 'multiple' && showLoading && <Btn active={load} onClick={() => setLoad(!load)}>Loading dose {load ? `(${loadingDose.toFixed(0)} mg)` : ''}</Btn>}
        <Slider label="Dose (mg)" min={50} max={1500} step={10} value={D} onChange={setD} format={(v) => v.toFixed(0)} />
        {m === 'multiple' && <Slider label="τ interval (h)" min={2} max={24} step={1} value={T} onChange={setT} format={(v) => v.toFixed(0)} />}
        <Slider label="t½ (h)" min={1} max={30} step={0.5} value={h} onChange={setH} />
        <Slider label="Vd (L)" min={5} max={300} step={5} value={V} onChange={setV} format={(v) => v.toFixed(0)} />
      </Controls>
    </div>
  );
}
