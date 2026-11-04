import { useMemo, useState } from 'react';
import { Btn, C, Controls, Slider, Stage, pathOf, rng, scale } from './_kit';

/**
 * Vanishing / exploding gradients in a vanilla RNN, and the LSTM cell's additive path.
 * Vanilla RNN with n units: a_t = W h_{t−1} + u_t, h_t = φ(a_t), W entries ~ N(0, ρ²/n) (so the spectral
 * radius is ≈ ρ and E‖Wg‖² = ρ²‖g‖²), inputs u_t ~ N(0, 0.5²). A random unit gradient g = ∂L/∂h_T is sent
 * back through time: ∂L/∂h_{t−1} = Wᵀ(φ′(a_t) ⊙ ∂L/∂h_t). The plot shows log₁₀‖∂L/∂h_{T−k}‖ against the
 * number of steps back k (red), with the reference ρ^k dashed.
 * LSTM (green, optional): only the direct cell-state path ∂c_T/∂c_{T−k} = Π f_t (element-wise), with forget
 * gates f_t = σ(b_f + ξ), ξ ~ N(0, 1) per unit and step. Paths through h are ignored.
 * props: {
 *   rho?: number            spectral-radius scale ρ (default 0.9, slider 0.3–1.6)
 *   steps?: number          sequence length T (default 50, 10–100)
 *   activation?: 'tanh'|'linear' (default 'tanh')
 *   showLstm?: boolean      show the LSTM cell path (default false)
 *   forgetBias?: number     forget-gate bias b_f (default 3, slider −2–6)
 *   width?: number          n (default 32)
 *   seed?: number           (default 3)
 * }
 */
type Act = 'tanh' | 'linear';
const sig = (z: number) => 1 / (1 + Math.exp(-z));
const norm = (v: Float64Array) => { let s = 0; for (const x of v) s += x * x; return Math.sqrt(s); };

function bptt(act: Act, rho: number, T: number, n: number, seed: number, bf: number) {
  const r = rng(seed);
  const W = Float64Array.from({ length: n * n }, () => (r.normal() * rho) / Math.sqrt(n));
  const A: Float64Array[] = [];
  let h = new Float64Array(n);
  for (let t = 0; t < T; t++) {
    const a = new Float64Array(n);
    for (let j = 0; j < n; j++) { let s = 0.5 * r.normal(); for (let k = 0; k < n; k++) s += W[j * n + k] * h[k]; a[j] = s; }
    A.push(a); h = act === 'tanh' ? a.map(Math.tanh) : a;
  }
  let g = Float64Array.from({ length: n }, () => r.normal());
  const g0 = norm(g); g = g.map((v) => v / g0);
  let c = Float64Array.from(g);
  const rnn = [1], lstm = [1];
  for (let k = 1; k <= T; k++) {
    const a = A[T - k];
    const gz = g.map((v, j) => v * (act === 'tanh' ? 1 - Math.tanh(a[j]) ** 2 : 1));
    const prev = new Float64Array(n);
    for (let kk = 0; kk < n; kk++) { let s = 0; for (let j = 0; j < n; j++) s += W[j * n + kk] * gz[j]; prev[kk] = s; }
    g = prev; rnn.push(norm(g));
    c = c.map((v) => v * sig(bf + r.normal())); lstm.push(norm(c));
  }
  return { rnn, lstm };
}

export default function MlRnnGradNorm({ rho = 0.9, steps = 50, activation = 'tanh', showLstm = false, forgetBias = 3, width = 32, seed: seed0 = 3 }: {
  rho?: number; steps?: number; activation?: Act; showLstm?: boolean; forgetBias?: number; width?: number; seed?: number;
}) {
  const [p, setP] = useState(rho);
  const [T, setT] = useState(Math.max(10, Math.min(100, Math.round(steps))));
  const [act, setAct] = useState<Act>(activation);
  const [lstmOn, setLstm] = useState(showLstm);
  const [bf, setBf] = useState(forgetBias);
  const [seed, setSeed] = useState(seed0);
  const n = Math.max(4, Math.min(64, Math.round(width)));
  const { rnn, lstm } = useMemo(() => bptt(act, p, T, n, seed, bf), [act, p, T, n, seed, bf]);
  const lo = -10, hi = 6;
  const box: [number, number, number, number] = [34, 16, 312, 168];
  const sx = scale([0, T], [box[0], box[2]]);
  const sy = scale([lo, hi], [box[3], box[1]]);
  const ly = (v: number) => sy(Math.max(lo, Math.min(hi, Math.log10(Math.max(v, 1e-300)))));
  const line = (a: number[]) => pathOf(a.map((v, k) => [sx(k), ly(v)]));
  const ref = Array.from({ length: T + 1 }, (_, k) => p ** k);
  const fmt = (v: number) => (v >= 0.01 && v < 1000 ? v.toPrecision(2) : v.toExponential(1));
  const ticks = [-10, -8, -6, -4, -2, 0, 2, 4, 6];
  return (
    <div>
      <Stage w={320} h={200} label="Gradient norm versus number of time steps back">
        {ticks.map((e) => <g key={e}>
          <line x1={box[0]} x2={box[2]} y1={sy(e)} y2={sy(e)} stroke="var(--grid)" strokeWidth={0.5} />
          <text x={box[0] - 3} y={sy(e) + 3} fontSize="7" textAnchor="end" fill="var(--muted)">1e{e}</text>
        </g>)}
        <line x1={box[0]} x2={box[0]} y1={box[1]} y2={box[3]} stroke="var(--fg)" strokeWidth={0.8} />
        <line x1={box[0]} x2={box[2]} y1={box[3]} y2={box[3]} stroke="var(--fg)" strokeWidth={0.8} />
        <path d={line(ref)} fill="none" stroke="var(--muted)" strokeWidth={1} strokeDasharray="3 3" />
        <path d={line(rnn)} fill="none" stroke={C[4]} strokeWidth={2} />
        {lstmOn && <path d={line(lstm)} fill="none" stroke={C[0]} strokeWidth={2} />}
        <text x={box[0]} y={box[3] + 10} fontSize="7.5" fill="var(--muted)">k = 0 (loss at step T)</text>
        <text x={box[2]} y={box[3] + 10} fontSize="7.5" textAnchor="end" fill="var(--muted)">k = {T} steps back →</text>
        <text x={box[0] + 3} y={10} fontSize="8"><tspan fill={C[4]}>— RNN ‖∂L/∂h_(T−k)‖</tspan>{lstmOn && <tspan fill={C[0]}>  — LSTM cell path</tspan>}<tspan fill="var(--muted)">  - - ρ^k</tspan></text>
        <text x={box[0]} y={192} fontSize="8.5" fill="var(--fg)">after {T} steps: <tspan fill={C[4]}>RNN {fmt(rnn[T])}</tspan>
          {lstmOn && <tspan fill={C[0]}>   LSTM {fmt(lstm[T])}  (mean f ≈ {sig(bf).toFixed(2)})</tspan>}</text>
      </Stage>
      <Controls>
        <Slider label="ρ (scale of W)" min={0.3} max={1.6} step={0.01} value={p} onChange={setP} />
        <Btn active={act === 'tanh'} onClick={() => setAct('tanh')}>tanh</Btn>
        <Btn active={act === 'linear'} onClick={() => setAct('linear')}>linear</Btn>
        <Btn active={lstmOn} onClick={() => setLstm(!lstmOn)}>LSTM cell path</Btn>
        {lstmOn && <Slider label="forget bias b_f" min={-2} max={6} step={0.1} value={bf} onChange={setBf} />}
        <Slider label="steps T" min={10} max={100} step={1} value={T} onChange={(v) => setT(Math.round(v))} format={(v) => String(Math.round(v))} />
        <Btn onClick={() => setSeed((s) => s + 1)}>↺ New weights</Btn>
      </Controls>
    </div>
  );
}
