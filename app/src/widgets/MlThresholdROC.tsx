import { useRef, useState } from 'react';
import { Btn, C, Controls, PlayPause, Slider, Stage, pathOf, scale, useFrame } from './_kit';

/**
 * Binary classifier scores and the decision threshold. Negatives' scores ~ N(0, 1), positives' ~ N(d, 1).
 * Top: both score densities; everything right of the threshold is predicted positive
 * (green = true positives, red = false positives). Bottom-left: the ROC curve with the current
 * operating point and AUC = Φ(d/√2). Bottom-right: expected confusion matrix per 1000 cases
 * and accuracy / precision / recall / FPR / F1. Play sweeps the threshold back and forth.
 * props: { separation?: number (d, default 1.5, 0–4), threshold?: number (default 0.75),
 *          prevalence?: number (fraction positive, default 0.5), showPrevalence?: boolean (prevalence slider, default false),
 *          showSeparation?: boolean (separation slider, default true) }
 */
function Phi(z: number) {
  // Abramowitz & Stegun 7.1.26 erf approximation (|error| < 1.5e-7)
  const x = Math.abs(z) / Math.SQRT2; const t = 1 / (1 + 0.3275911 * x);
  const y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x);
  return z >= 0 ? 0.5 * (1 + y) : 0.5 * (1 - y);
}
const pdf = (x: number, m: number) => Math.exp(-0.5 * (x - m) ** 2) / Math.sqrt(2 * Math.PI);

export default function MlThresholdROC({ separation = 1.5, threshold = 0.75, prevalence = 0.5, showPrevalence = false, showSeparation = true }: {
  separation?: number; threshold?: number; prevalence?: number; showPrevalence?: boolean; showSeparation?: boolean;
}) {
  const [d, setD] = useState(Math.max(0, Math.min(4, separation)));
  const [t, setT] = useState(threshold);
  const [pi, setPi] = useState(Math.max(0.01, Math.min(0.99, prevalence)));
  const [running, setRunning] = useState(false);
  const dir = useRef(1);
  useFrame((dt) => {
    setT((v) => {
      let nv = v + dir.current * dt * 1.6;
      if (nv > 5) { nv = 5; dir.current = -1; } else if (nv < -3) { nv = -3; dir.current = 1; }
      return nv;
    });
  }, running);

  const tpr = 1 - Phi(t - d), fpr = 1 - Phi(t);
  const TP = 1000 * pi * tpr, FN = 1000 * pi * (1 - tpr), FP = 1000 * (1 - pi) * fpr, TN = 1000 * (1 - pi) * (1 - fpr);
  const prec = TP + FP > 1e-9 ? TP / (TP + FP) : NaN;
  const acc = (TP + TN) / 1000;
  const f1 = 2 * TP / (2 * TP + FP + FN);
  const auc = Phi(d / Math.SQRT2);

  // top panel: score densities
  const L = 14, R = 308, T = 16, B = 92;
  const sx = scale([-3.5, 6.5], [L, R]); const sy = scale([0, 0.45], [B, T]);
  const area = (m: number, a: number, b: number) => {
    const lo = Math.max(-3.5, a), hi = Math.min(6.5, b); if (hi <= lo) return '';
    const pts: [number, number][] = [[sx(lo), B]];
    for (let i = 0; i <= 80; i++) { const x = lo + ((hi - lo) * i) / 80; pts.push([sx(x), sy(pdf(x, m))]); }
    pts.push([sx(hi), B]); return pathOf(pts) + 'Z';
  };
  const line = (m: number) => pathOf(Array.from({ length: 161 }, (_, i) => { const x = -3.5 + (10 * i) / 160; return [sx(x), sy(pdf(x, m))] as [number, number]; }));
  const tx = sx(Math.max(-3.5, Math.min(6.5, t)));
  // ROC panel
  const rL = 34, rT = 112, rS = 104;
  const rx = scale([0, 1], [rL, rL + rS]); const ry = scale([0, 1], [rT + rS, rT]);
  const roc = pathOf(Array.from({ length: 121 }, (_, i) => { const th = 8 - (16 * i) / 120; return [rx(1 - Phi(th)), ry(1 - Phi(th - d))] as [number, number]; }));
  const f = (v: number) => (Number.isFinite(v) ? v.toFixed(2) : '—');
  const cell = (x: number, y: number, v: number, lab: string, col: string) => (
    <g>
      <rect x={x} y={y} width={60} height={30} fill={col} opacity={0.18} stroke={col} strokeWidth={0.8} rx={2} />
      <text x={x + 30} y={y + 13} fontSize="10" textAnchor="middle" fill="var(--fg)" fontWeight="bold">{Math.round(v)}</text>
      <text x={x + 30} y={y + 25} fontSize="7.5" textAnchor="middle" fill="var(--muted)">{lab}</text>
    </g>
  );
  const cx = 192, cy = 120;

  return (
    <div>
      <Stage w={320} h={262} label={`Threshold ${t.toFixed(2)}: TPR ${tpr.toFixed(2)}, FPR ${fpr.toFixed(2)}, AUC ${auc.toFixed(2)}`}>
        <text x={L} y={10} fontSize="9" fill="var(--muted)">Classifier score distributions</text>
        <path d={area(0, -10, t)} fill="var(--muted)" opacity={0.15} />
        <path d={area(0, t, 10)} fill={C[4]} opacity={0.45} />
        <path d={area(d, -10, t)} fill={C[0]} opacity={0.12} />
        <path d={area(d, t, 10)} fill={C[0]} opacity={0.45} />
        <path d={line(0)} fill="none" stroke={C[4]} strokeWidth={1.5} />
        <path d={line(d)} fill="none" stroke={C[0]} strokeWidth={1.5} />
        <line x1={L} x2={R} y1={B} y2={B} stroke="var(--fg)" strokeWidth={0.8} />
        <text x={sx(0)} y={B + 9} fontSize="8" textAnchor="middle" fill={C[4]}>negatives</text>
        <text x={sx(d)} y={B + 17} fontSize="8" textAnchor="middle" fill={C[0]}>positives</text>
        <line x1={tx} x2={tx} y1={T - 4} y2={B} stroke="var(--fg)" strokeWidth={1.6} />
        <text x={tx + 3} y={T + 2} fontSize="8" fill="var(--fg)">predict + →</text>
        {/* ROC */}
        <rect x={rL} y={rT} width={rS} height={rS} fill="none" stroke="var(--fg)" strokeWidth={0.8} />
        <line x1={rx(0)} y1={ry(0)} x2={rx(1)} y2={ry(1)} stroke="var(--muted)" strokeDasharray="3 3" strokeWidth={0.8} />
        <path d={roc} fill="none" stroke={C[1]} strokeWidth={2} />
        <circle cx={rx(fpr)} cy={ry(tpr)} r={4} fill={C[2]} stroke="var(--surface)" strokeWidth={1} />
        <text x={rL + rS / 2} y={rT + rS + 10} fontSize="8" textAnchor="middle" fill="var(--muted)">FPR</text>
        <text x={rL - 4} y={rT + rS / 2} fontSize="8" textAnchor="end" fill="var(--muted)">TPR</text>
        <text x={rL - 4} y={rT + 6} fontSize="7" textAnchor="end" fill="var(--muted)">1</text>
        <text x={rL + rS} y={rT + rS + 10} fontSize="7" textAnchor="end" fill="var(--muted)">1</text>
        <text x={rL + rS - 3} y={rT + rS - 5} fontSize="9" textAnchor="end" fill={C[1]} fontWeight="bold">AUC {auc.toFixed(3)}</text>
        {/* confusion matrix */}
        <text x={cx + 30} y={cy - 2} fontSize="8" textAnchor="middle" fill="var(--muted)">pred +</text>
        <text x={cx + 92} y={cy - 2} fontSize="8" textAnchor="middle" fill="var(--muted)">pred −</text>
        <text x={cx - 3} y={cy + 18} fontSize="8" textAnchor="end" fill="var(--muted)">actual +</text>
        <text x={cx - 3} y={cy + 50} fontSize="8" textAnchor="end" fill="var(--muted)">actual −</text>
        {cell(cx, cy + 2, TP, 'TP', C[0])}
        {cell(cx + 62, cy + 2, FN, 'FN', 'var(--muted)')}
        {cell(cx, cy + 34, FP, 'FP', C[4])}
        {cell(cx + 62, cy + 34, TN, 'TN', 'var(--muted)')}
        <g fontSize="8.5" fill="var(--fg)">
          <text x={150} y={cy + 80}>acc {f(acc)} · precision {f(prec)}</text>
          <text x={150} y={cy + 92}>recall (TPR) {f(tpr)} · FPR {f(fpr)}</text>
          <text x={150} y={cy + 104}>F1 {f(f1)} · {Math.round(pi * 1000)} positives / 1000</text>
        </g>
        <text x={L} y={258} fontSize="8" fill="var(--muted)">Score gap d = {d.toFixed(2)}; threshold = {t.toFixed(2)}</text>
      </Stage>
      <Controls>
        <Slider label="threshold" min={-3} max={5} step={0.05} value={t} onChange={(v) => { setRunning(false); setT(v); }} />
        {showSeparation && <Slider label="score gap d" min={0} max={4} step={0.05} value={d} onChange={setD} />}
        {showPrevalence && <Slider label="prevalence" min={0.01} max={0.99} step={0.01} value={pi} onChange={setPi} format={(v) => (v * 100).toFixed(0) + '%'} />}
        <PlayPause running={running} set={setRunning} />
        <Btn onClick={() => { setRunning(false); setT(threshold); setD(Math.max(0, Math.min(4, separation))); setPi(Math.max(0.01, Math.min(0.99, prevalence))); }}>Reset</Btn>
      </Controls>
    </div>
  );
}
