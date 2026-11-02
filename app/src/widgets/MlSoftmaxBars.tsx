import { useState } from 'react';
import { C, Controls, Slider, Stage } from './_kit';

/**
 * Softmax explorer: K logits (top, signed bars) are turned into probabilities p_i = exp(z_i/T) / Σ_j exp(z_j/T)
 * (bottom bars). Tap a class to mark it as the true label; the categorical cross-entropy −log p_true is shown.
 * props: {
 *   logits?: number[]        initial logits z_i, each in [-5, 5] (default [2, 1, 0.1]); 2–5 classes
 *   labels?: string[]        class names (default ['cat', 'dog', 'bird', …])
 *   temperature?: number     initial temperature T (default 1)
 *   showTemperature?: boolean  show the T slider (default true)
 *   editable?: boolean       show one slider per logit (default true)
 *   target?: number          index of the true class (default 0)
 *   showLoss?: boolean       show −log p_true (default true)
 * }
 */
export default function MlSoftmaxBars({ logits = [2, 1, 0.1], labels, temperature = 1, showTemperature = true, editable = true, target = 0, showLoss = true }: {
  logits?: number[]; labels?: string[]; temperature?: number; showTemperature?: boolean; editable?: boolean; target?: number; showLoss?: boolean;
}) {
  const K = Math.max(2, Math.min(5, logits.length));
  const names = labels ?? ['cat', 'dog', 'bird', 'fish', 'frog'];
  const [z, setZ] = useState(logits.slice(0, K));
  const [T, setT] = useState(temperature);
  const [tgt, setTgt] = useState(Math.min(target, K - 1));
  const m = Math.max(...z.map((v) => v / T));
  const e = z.map((v) => Math.exp(v / T - m));
  const S = e.reduce((a, b) => a + b, 0);
  const p = e.map((v) => v / S);
  const loss = -Math.log(Math.max(p[tgt], 1e-300));

  const L = 40, R = 312, colW = (R - L) / K, bw = Math.min(40, colW * 0.55);
  const zMid = 52, zH = 40;           // logit bars: ±5 maps to ±zH around zMid
  const pBase = 182, pH = 64;         // probability bars: 0..1 maps to pBase..pBase-pH
  return (
    <div>
      <Stage label="Softmax turns logits into probabilities">
        <text x={4} y={zMid - zH + 4} fontSize="9" fill="var(--fg)">logits z</text>
        <text x={4} y={zMid + 3} fontSize="8" fill="var(--muted)">0</text>
        <line x1={L - 4} x2={R} y1={zMid} y2={zMid} stroke="var(--fg)" strokeWidth={0.7} />
        <text x={4} y={pBase - pH + 4} fontSize="9" fill="var(--fg)">p</text>
        <text x={4} y={pBase + 3} fontSize="8" fill="var(--muted)">0</text>
        <text x={4} y={pBase - pH + 14} fontSize="8" fill="var(--muted)">1</text>
        <line x1={L - 4} x2={R} y1={pBase} y2={pBase} stroke="var(--fg)" strokeWidth={0.7} />
        <line x1={L - 4} x2={R} y1={pBase - pH} y2={pBase - pH} stroke="var(--grid)" strokeWidth={0.6} strokeDasharray="3 3" />
        <text x={L} y={zMid + zH + 12} fontSize="9" fill="var(--muted)">↓ softmax(z / T), T = {T.toFixed(2)}</text>
        {z.map((v, i) => {
          const cx = L + colW * (i + 0.5); const h = (Math.max(-5, Math.min(5, v)) / 5) * zH; const ph = p[i] * pH;
          return (
            <g key={i} onClick={() => setTgt(i)} style={{ cursor: 'pointer' }}>
              <rect x={cx - colW / 2} y={4} width={colW} height={192} fill="transparent" />
              <rect x={cx - bw / 2} y={h >= 0 ? zMid - h : zMid} width={bw} height={Math.abs(h)} fill={C[i]} opacity={0.55} />
              <text x={cx} y={h >= 0 ? zMid - h - 3 : zMid - h + 9} fontSize="9" textAnchor="middle" fill="var(--fg)">{v.toFixed(1)}</text>
              <rect x={cx - bw / 2} y={pBase - ph} width={bw} height={ph} fill={C[i]} stroke={i === tgt ? 'var(--fg)' : 'none'} strokeWidth={1.5} />
              <text x={cx} y={pBase - ph - 3} fontSize="9" textAnchor="middle" fill="var(--fg)">{p[i].toFixed(3)}</text>
              <text x={cx} y={pBase + 11} fontSize="9" textAnchor="middle" fill={i === tgt ? 'var(--fg)' : 'var(--muted)'} fontWeight={i === tgt ? 700 : 400}>{(i === tgt ? '✓ ' : '') + (names[i] ?? `class ${i + 1}`)}</text>
            </g>
          );
        })}
        {showLoss && <text x={R} y={zMid + zH + 12} fontSize="9" textAnchor="end" fill="var(--c5)">loss −log p(✓) = {loss.toFixed(3)}</text>}
      </Stage>
      <Controls>
        {editable && z.map((v, i) => <Slider key={i} label={`z (${names[i] ?? i + 1})`} min={-5} max={5} step={0.1} value={v} onChange={(nv) => setZ((old) => old.map((o, j) => (j === i ? nv : o)))} />)}
        {showTemperature && <Slider label="temperature T" min={0.1} max={5} step={0.05} value={T} onChange={setT} />}
      </Controls>
    </div>
  );
}
