import { useState } from 'react';
import { Btn, C, Controls, Slider, Stage } from './_kit';

/**
 * Self-attention on a short sentence. Each row i of the heatmap is one query token; each column j a key
 * token. Cell shade = attention weight a_ij = softmax_j(logit_ij). Tap a row (or a query button) to pick
 * the query; the right panel lists that query's weights over all keys, and the footer shows the entropy
 * as an "effective number of keys attended" e^H.
 * The base scores s_ij play the role of the *scaled* scores q_i·k_j/√d_k. The raw dot product is modelled
 * as s_ij·√d_k (dot products of d_k-dim vectors with unit-variance entries have std ≈ √d_k), so turning
 * "÷√d_k" off multiplies every logit by √d_k and the softmax saturates towards one-hot.
 * Causal mask: logits with j > i are set to −∞ (weight 0), as in a decoder.
 * props: {
 *   tokens?: string[]      3–9 tokens (default ['the','cat','sat','because','it','was','tired'])
 *   scores?: number[][]    n×n base scores s_ij (default: hand-made pattern for the default sentence;
 *                          other token lists default to a simple "attend to self and neighbours" pattern)
 *   query?: number         initially selected query index (default 4)
 *   causal?: boolean       start with the causal mask on (default false)
 *   showCausal?: boolean   show the causal toggle (default true)
 *   showScaling?: boolean  show the d_k slider and the ÷√d_k toggle (default true)
 *   dk?: number            initial key dimension d_k (default 64)
 * }
 */
const DEF_TOKENS = ['the', 'cat', 'sat', 'because', 'it', 'was', 'tired'];
const DEF_SCORES = [
  [1.0, 1.2, 0.2, -0.5, 0.0, -0.3, 0.0],
  [0.8, 1.5, 0.9, -0.2, 0.6, 0.0, 0.4],
  [0.0, 1.8, 1.0, 0.2, 0.3, 0.1, 0.0],
  [-0.5, 0.3, 1.4, 0.8, 0.6, 0.2, 0.9],
  [0.0, 2.2, 0.3, 0.1, 0.8, 0.2, 0.6],
  [-0.4, 0.5, 0.2, 0.0, 1.6, 0.7, 1.0],
  [-0.3, 1.4, 0.1, 0.3, 1.7, 0.9, 0.8],
];

export default function MlAttentionHeatmap({ tokens = DEF_TOKENS, scores, query = 4, causal = false, showCausal = true, showScaling = true, dk = 64 }: {
  tokens?: string[]; scores?: number[][]; query?: number; causal?: boolean; showCausal?: boolean; showScaling?: boolean; dk?: number;
}) {
  const toks = tokens.slice(0, 9);
  const n = Math.max(1, toks.length);
  const base = scores ?? (tokens === DEF_TOKENS ? DEF_SCORES : toks.map((_, i) => toks.map((__, j) => 1.2 - 0.6 * Math.abs(i - j))));
  const [q, setQ] = useState(Math.min(Math.max(0, query), n - 1));
  const [mask, setMask] = useState(causal);
  const [scaled, setScaled] = useState(true);
  const [d, setD] = useState(dk);
  const mult = scaled ? 1 : Math.sqrt(d);
  const W = toks.map((_, i) => {
    const lg = toks.map((__, j) => (mask && j > i ? -Infinity : (base[i]?.[j] ?? 0) * mult));
    const m = Math.max(...lg);
    const e = lg.map((v) => (v === -Infinity ? 0 : Math.exp(v - m)));
    const s = e.reduce((a, b) => a + b, 0);
    return e.map((v) => v / s);
  });
  const row = W[q];
  const H = -row.reduce((a, p) => a + (p > 0 ? p * Math.log(p) : 0), 0);

  const cs = Math.min(20, 150 / n), gx = 50, gy = 40;
  const bx = gx + cs * n + 50, bw = 312 - bx - 26;
  return (
    <div>
      <Stage w={320} h={gy + cs * n + 30} label="Attention weights heatmap">
        <text x={gx} y={10} fontSize="8" fill="var(--muted)">keys j →</text>
        <text x={4} y={gy - 4} fontSize="8" fill="var(--muted)">query i ↓</text>
        {toks.map((t, j) => (
          <text key={'c' + j} x={0} y={0} fontSize="8" fill={j === q ? 'var(--fg)' : 'var(--muted)'}
            transform={`translate(${gx + cs * (j + 0.6)},${gy - 3}) rotate(-55)`}>{t}</text>
        ))}
        {toks.map((t, i) => (
          <g key={'r' + i} onClick={() => setQ(i)} style={{ cursor: 'pointer' }}>
            <rect x={0} y={gy + cs * i} width={gx + cs * n} height={cs} fill="transparent" />
            <text x={gx - 4} y={gy + cs * (i + 0.5) + 3} fontSize="9" textAnchor="end" fill={i === q ? 'var(--fg)' : 'var(--muted)'} fontWeight={i === q ? 700 : 400}>{t}</text>
            {W[i].map((p, j) => {
              const masked = mask && j > i;
              return (
                <g key={j}>
                  <rect x={gx + cs * j + 0.5} y={gy + cs * i + 0.5} width={cs - 1} height={cs - 1} fill={masked ? 'var(--grid)' : C[1]} opacity={masked ? 0.5 : 0.06 + 0.94 * p} />
                  {masked && <text x={gx + cs * (j + 0.5)} y={gy + cs * (i + 0.5) + 3} fontSize="8" textAnchor="middle" fill="var(--muted)">×</text>}
                </g>
              );
            })}
          </g>
        ))}
        <rect x={gx} y={gy + cs * q} width={cs * n} height={cs} fill="none" stroke={C[2]} strokeWidth={2} />
        <text x={314} y={12} fontSize="8.5" textAnchor="end" fill="var(--fg)">weights of “{toks[q]}”</text>
        <text x={314} y={24} fontSize="7.5" textAnchor="end" fill="var(--muted)">(sum to 1)</text>
        {row.map((p, j) => {
          const y = gy + cs * j;
          return (
            <g key={'b' + j}>
              <text x={bx - 4} y={y + cs * 0.5 + 3} fontSize="8.5" textAnchor="end" fill="var(--muted)">{toks[j]}</text>
              <rect x={bx} y={y + 2} width={Math.max(0.5, p * bw)} height={cs - 4} fill={C[2]} opacity={mask && j > q ? 0.2 : 0.9} />
              <text x={bx + p * bw + 2} y={y + cs * 0.5 + 3} fontSize="8" fill="var(--fg)">{p < 0.005 ? '0' : p.toFixed(2)}</text>
            </g>
          );
        })}
        <text x={4} y={gy + cs * n + 14} fontSize="8.5" fill="var(--fg)">
          {scaled ? 'logits = q·k/√d_k' : `logits = q·k (×√d_k = ×${Math.sqrt(d).toFixed(1)} vs scaled)`}
        </text>
        <text x={4} y={gy + cs * n + 26} fontSize="8.5" fill="var(--muted)">
          entropy H = {H.toFixed(2)} nats · effective keys e^H ≈ {Math.exp(H).toFixed(1)} of {mask ? q + 1 : n}
        </text>
      </Stage>
      <Controls>
        {toks.map((t, i) => <Btn key={i} active={i === q} onClick={() => setQ(i)}>{t}</Btn>)}
        {showCausal && <Btn active={mask} onClick={() => setMask(!mask)}>causal mask</Btn>}
        {showScaling && <Btn active={scaled} onClick={() => setScaled(!scaled)}>÷√d_k</Btn>}
        {showScaling && <Slider label="d_k" min={1} max={256} step={1} value={d} onChange={(v) => setD(Math.round(v))} format={(v) => String(Math.round(v))} />}
      </Controls>
    </div>
  );
}
