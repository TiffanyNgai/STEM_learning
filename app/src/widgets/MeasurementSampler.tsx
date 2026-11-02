import { useRef, useState } from 'react';
import { Btn, C, Controls, Slider, Stage, rng } from './_kit';

/**
 * Repeated measurement of identically prepared quantum states. Each press prepares a fresh copy and measures it;
 * the histogram of observed frequencies converges to the Born-rule probabilities (dashed lines).
 * props: {
 *   probs?: number[] Born probabilities (normalised automatically; default from theta),
 *   labels?: string[] outcome labels (default '0','1',…),
 *   theta?: number (deg) qubit state cos(θ/2)|0⟩ + sin(θ/2)|1⟩ used when probs is absent (default 90),
 *   adjustable?: boolean (θ slider, default true when probs absent), seed?: number
 * }
 */
export default function MeasurementSampler({ probs, labels, theta = 90, adjustable, seed = 5 }: {
  probs?: number[]; labels?: string[]; theta?: number; adjustable?: boolean; seed?: number;
}) {
  const [th, setTh] = useState(theta);
  const fromTheta = !probs || probs.length === 0;
  const raw = fromTheta ? [Math.cos((th * Math.PI) / 360) ** 2, Math.sin((th * Math.PI) / 360) ** 2] : probs!;
  const tot = raw.reduce((a, b) => a + Math.max(0, b), 0) || 1;
  const p = raw.map((x) => Math.max(0, x) / tot);
  const K = p.length;
  const lab = labels && labels.length === K ? labels : p.map((_, i) => String(i));
  const [counts, setCounts] = useState<number[]>(() => new Array(K).fill(0));
  const [last, setLast] = useState<number | null>(null);
  const r = useRef(rng(seed));
  const cs = counts.length === K ? counts : new Array(K).fill(0);
  const N = cs.reduce((a, b) => a + b, 0);
  const measure = (m: number) => {
    const c = [...cs]; let o = 0;
    for (let k = 0; k < m; k++) { let u = r.current.u(); o = 0; while (o < K - 1 && u > p[o]) { u -= p[o]; o++; } c[o]++; }
    setCounts(c); setLast(o);
  };
  const reset = () => { setCounts(new Array(K).fill(0)); setLast(null); };
  const L = 40, T = 30, B = 165, W = 260, bw = Math.min(60, (W / K) * 0.6);
  const y = (f: number) => B - f * (B - T);
  const show = adjustable ?? fromTheta;
  return (
    <div>
      <Stage w={320} h={200} label="Histogram of repeated measurement outcomes versus Born probabilities">
        {[0, 0.25, 0.5, 0.75, 1].map((f) => (
          <g key={f}><line x1={L} x2={L + W} y1={y(f)} y2={y(f)} stroke="var(--grid)" strokeWidth={0.5} />
            <text x={L - 4} y={y(f) + 3} fontSize="8" textAnchor="end" fill="var(--muted)">{f}</text></g>
        ))}
        <line x1={L} x2={L + W} y1={B} y2={B} stroke="var(--fg)" />
        {p.map((pi, i) => {
          const cx = L + (W / K) * (i + 0.5), f = N ? cs[i] / N : 0;
          return (
            <g key={i}>
              <rect x={cx - bw / 2} y={y(f)} width={bw} height={B - y(f)} fill={C[i % 6]} opacity={last === i ? 1 : 0.75} rx={2} />
              <line x1={cx - bw / 2 - 6} x2={cx + bw / 2 + 6} y1={y(pi)} y2={y(pi)} stroke="var(--fg)" strokeDasharray="4 3" strokeWidth={1.4} />
              <text x={cx} y={B + 11} fontSize="9" textAnchor="middle" fill="var(--fg)">{lab[i]}</text>
              <text x={cx} y={B + 22} fontSize="8" textAnchor="middle" fill="var(--muted)">{cs[i]} ({(f * 100).toFixed(0)}%) · P={pi.toFixed(2)}</text>
            </g>
          );
        })}
        <text x={L} y={14} fontSize="9" fill="var(--fg)">N = {N} measurements</text>
        {last !== null && <text x={L + W} y={14} fontSize="10" textAnchor="end" fill={C[last % 6]}>last outcome: {lab[last]}</text>}
        <text x={L + W} y={26} fontSize="8" textAnchor="end" fill="var(--muted)">dashed = Born probability</text>
      </Stage>
      <Controls>
        <Btn onClick={() => measure(1)}>Measure ×1</Btn>
        <Btn onClick={() => measure(10)}>×10</Btn>
        <Btn onClick={() => measure(100)}>×100</Btn>
        <Btn onClick={() => measure(1000)}>×1000</Btn>
        <Btn onClick={reset}>Reset</Btn>
        {show && fromTheta && <Slider label="θ" min={0} max={180} step={1} value={th} onChange={(v) => { setTh(v); reset(); }} format={(v) => `${v}°`} />}
      </Controls>
    </div>
  );
}
