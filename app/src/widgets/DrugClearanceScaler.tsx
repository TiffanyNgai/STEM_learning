import { useState } from 'react';
import { Btn, C, Controls, Slider, Stage, pathOf, scale } from './_kit';

type Sys = 'microsomes' | 'hepatocytes';
/**
 * In-vitro → in-vivo extrapolation (IVIVE) of hepatic clearance with the well-stirred liver model.
 * Chain: in-vitro t½ → k = ln2/t½ → CLint,in vitro (per mg protein or per 10⁶ cells)
 *   → scaled CLint (mL/min/kg) via physiological scaling factors → CLint,u = CLint/fu,inc
 *   → CLh = Qh·fu·CLint,u / (Qh + fu·CLint,u),  E = CLh/Qh,  F_h = 1 − E.
 * The plot shows CLh against fu·CLint,u on a log axis: it saturates at hepatic blood flow Qh.
 * props (all optional):
 *  system?: 'microsomes' | 'hepatocytes' (default 'microsomes'; buttons switch)
 *  halfLife?: number (in-vitro t½, min, default 20)   fu?: number (fraction unbound in blood, default 0.1)
 *  fuInc?: number (fraction unbound in the incubation, default 1)   qh?: number (hepatic blood flow, mL/min/kg, default 20)
 *  protein?: number (microsomal protein, mg/mL, default 0.5)   cells?: number (hepatocytes, 10⁶ cells/mL, default 1)
 *  mppgl?: number (mg microsomal protein per g liver, default 45)   hpgl?: number (10⁶ hepatocytes per g liver, default 120)
 *  liverPerKg?: number (g liver per kg body weight, default 20)
 * Blood:plasma ratio is taken as 1 (so plasma fu ≈ blood fu).
 */
export default function DrugClearanceScaler({ system = 'microsomes', halfLife = 20, fu = 0.1, fuInc = 1, qh = 20,
  protein = 0.5, cells = 1, mppgl = 45, hpgl = 120, liverPerKg = 20 }: {
  system?: Sys; halfLife?: number; fu?: number; fuInc?: number; qh?: number; protein?: number; cells?: number;
  mppgl?: number; hpgl?: number; liverPerKg?: number;
}) {
  const [sys, setSys] = useState<Sys>(system);
  const [th, setTh] = useState(halfLife);
  const [f, setF] = useState(fu);
  const [fi, setFi] = useState(fuInc);
  const k = Math.LN2 / th; // 1/min
  const mic = sys === 'microsomes';
  const clVitro = (k * 1000) / (mic ? protein : cells); // µL/min per mg or per 10^6 cells
  const scaleF = (mic ? mppgl : hpgl) * liverPerKg; // mg (or 10^6 cells) per kg
  const clint = (clVitro * scaleF) / 1000; // mL/min/kg
  const x = (f * clint) / fi; // fu * CLint,u
  const clh = (qh * x) / (qh + x);
  const E = clh / qh;
  const box: [number, number, number, number] = [30, 14, 312, 150];
  const lx: [number, number] = [-1, 3];
  const sx = scale(lx, [box[0], box[2]]);
  const sy = scale([0, qh * 1.1], [box[3], box[1]]);
  const pts: [number, number][] = [];
  for (let i = 0; i <= 160; i++) {
    const l = lx[0] + ((lx[1] - lx[0]) * i) / 160; const v = Math.pow(10, l);
    pts.push([sx(l), sy((qh * v) / (qh + v))]);
  }
  const lxv = Math.min(lx[1], Math.max(lx[0], Math.log10(x)));
  const band = E < 0.3 ? 'low extraction' : E > 0.7 ? 'high extraction (flow-limited)' : 'intermediate extraction';
  const fmt = (v: number) => (v >= 100 ? v.toFixed(0) : v >= 10 ? v.toFixed(1) : v.toFixed(2));
  return (
    <div>
      <Stage w={320} h={222} label="Well-stirred liver model: hepatic clearance versus unbound intrinsic clearance">
        <line x1={box[0]} x2={box[2]} y1={sy(qh)} y2={sy(qh)} stroke="var(--c5)" strokeDasharray="4 3" />
        <text x={box[0] + 3} y={sy(qh) - 3} fontSize="8" fill="var(--c5)">Qh = {qh} mL/min/kg (blood-flow ceiling)</text>
        <line x1={box[0]} x2={box[2]} y1={box[3]} y2={box[3]} stroke="var(--fg)" strokeWidth={0.8} />
        <line x1={box[0]} x2={box[0]} y1={box[1]} y2={box[3]} stroke="var(--fg)" strokeWidth={0.8} />
        {[-1, 0, 1, 2, 3].map((l) => (
          <text key={l} x={sx(l)} y={box[3] + 9} fontSize="8" fill="var(--muted)" textAnchor="middle">{Math.pow(10, l)}</text>
        ))}
        {[0, 0.5, 1].map((r) => (
          <text key={r} x={box[0] - 3} y={sy(r * qh) + 3} fontSize="8" fill="var(--muted)" textAnchor="end">{+(r * qh).toFixed(1)}</text>
        ))}
        <text x={box[2]} y={box[3] + 19} fontSize="8" fill="var(--fg)" textAnchor="end">fu·CLint,u (mL/min/kg, log scale)</text>
        <text x={box[0] + 3} y={box[1] + 22} fontSize="8" fill="var(--fg)">CLh</text>
        <path d={pathOf(pts)} fill="none" stroke={C[1]} strokeWidth={2} />
        <line x1={sx(lxv)} x2={sx(lxv)} y1={box[3]} y2={sy(clh)} stroke="var(--c3)" strokeDasharray="2 2" />
        <circle cx={sx(lxv)} cy={sy(clh)} r={5} fill="var(--c3)" style={{ transition: 'cx .3s, cy .3s' }} />
        <text x={160} y={184} fontSize="8" fill="var(--fg)" textAnchor="middle">
          k = {k.toFixed(4)}/min → CLint,in vitro = {fmt(clVitro)} µL/min/{mic ? 'mg' : '10⁶ cells'}
        </text>
        <text x={160} y={197} fontSize="8" fill="var(--fg)" textAnchor="middle">
          × {scaleF} {mic ? 'mg' : '10⁶ cells'}/kg → scaled CLint = {fmt(clint)} mL/min/kg
        </text>
        <text x={160} y={211} fontSize="8.5" fill="var(--fg)" textAnchor="middle" fontWeight="bold">
          CLh = {fmt(clh)} mL/min/kg · E = {E.toFixed(2)} · F_h = {(1 - E).toFixed(2)}
        </text>
        <text x={box[2] - 2} y={box[3] - 6} fontSize="8" fill="var(--c3)" textAnchor="end">{band}</text>
      </Stage>
      <Controls>
        <Btn active={mic} onClick={() => setSys('microsomes')}>Microsomes ({protein} mg/mL)</Btn>
        <Btn active={!mic} onClick={() => setSys('hepatocytes')}>Hepatocytes ({cells}×10⁶/mL)</Btn>
        <Slider label="in-vitro t½ (min)" min={2} max={240} step={1} value={th} onChange={setTh} format={(v) => v.toFixed(0)} />
        <Slider label="fu (blood)" min={0.005} max={1} step={0.005} value={f} onChange={setF} format={(v) => v.toFixed(3)} />
        <Slider label="fu,inc" min={0.1} max={1} step={0.05} value={fi} onChange={setFi} />
      </Controls>
    </div>
  );
}
