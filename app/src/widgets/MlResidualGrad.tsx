import { useMemo, useState } from 'react';
import { Btn, C, Controls, Slider, Stage, rng, scale } from './_kit';

/**
 * Plain vs residual deep stack at initialization: how large is the gradient at each layer?
 * Both networks use the same random block F_l(h) = W_l φ(h), W_l entries ~ N(0, g²/n), on the same
 * batch of B inputs x ~ N(0, I) (n units per layer):
 *   plain     h_l = F_l(h_{l−1})
 *   residual  h_l = h_{l−1} + α·F_l(h_{l−1})
 * A random linear loss L = Σ c·h_L (c ~ N(0, I)) is backpropagated. Bars show log₁₀ of the gradient
 * size at every layer: either the RMS of the signal ∂L/∂h_{l−1} entering block l, or the Frobenius
 * norm of the weight gradient ∂L/∂W_l. Text reports the ratio layer 1 / layer L for each net.
 * props: {
 *   activation?: 'tanh'|'relu'|'sigmoid' (default 'tanh')
 *   gain?: number   initial g (default 1)
 *   alpha?: number  initial residual branch scale α (default 1)
 *   depth?: number  number of blocks L (default 30, 4–60)
 *   width?: number  n (default 48)
 *   batch?: number  B (default 16)
 *   metric?: 'signal'|'weights' (default 'signal')
 *   seed?: number   (default 2)
 * }
 */
type Act = 'tanh' | 'relu' | 'sigmoid';
const F: Record<Act, [(z: number) => number, (z: number) => number]> = {
  tanh: [Math.tanh, (z) => 1 - Math.tanh(z) ** 2],
  relu: [(z) => (z > 0 ? z : 0), (z) => (z > 0 ? 1 : 0)],
  sigmoid: [(z) => 1 / (1 + Math.exp(-z)), (z) => { const s = 1 / (1 + Math.exp(-z)); return s * (1 - s); }],
};

export function residualStack(act: Act, g: number, alpha: number, L: number, n: number, B: number, seed: number, residual: boolean) {
  const r = rng(seed); const [f, df] = F[act]; const sd = g / Math.sqrt(n);
  const Ws = Array.from({ length: L }, () => Float64Array.from({ length: n * n }, () => r.normal() * sd));
  const x = Float64Array.from({ length: B * n }, () => r.normal());
  const c = Float64Array.from({ length: B * n }, () => r.normal());
  const hs: Float64Array[] = [x];
  for (let l = 0; l < L; l++) {
    const h = hs[l], a = h.map(f), W = Ws[l], out = new Float64Array(B * n);
    for (let b = 0; b < B; b++) for (let j = 0; j < n; j++) {
      let s = 0; for (let k = 0; k < n; k++) s += W[j * n + k] * a[b * n + k];
      out[b * n + j] = residual ? h[b * n + j] + alpha * s : s;
    }
    hs.push(out);
  }
  const sig = new Array<number>(L), wn = new Array<number>(L);
  let gh = c;
  for (let l = L - 1; l >= 0; l--) {
    const h = hs[l], a = h.map(f), W = Ws[l], s = residual ? alpha : 1;
    let fro = 0; // ∂L/∂W_l = s · Σ_b gh_b a_bᵀ
    for (let j = 0; j < n; j++) for (let k = 0; k < n; k++) { let v = 0; for (let b = 0; b < B; b++) v += gh[b * n + j] * a[b * n + k]; fro += (s * v) ** 2; }
    wn[l] = Math.sqrt(fro);
    const prev = new Float64Array(B * n);
    for (let b = 0; b < B; b++) for (let k = 0; k < n; k++) {
      let v = 0; for (let j = 0; j < n; j++) v += W[j * n + k] * gh[b * n + j];
      prev[b * n + k] = s * v * df(h[b * n + k]) + (residual ? gh[b * n + k] : 0);
    }
    gh = prev;
    let ss = 0; for (const v of gh) ss += v * v; sig[l] = Math.sqrt(ss / gh.length);
  }
  return { sig, wn };
}

export default function MlResidualGrad({ activation = 'tanh', gain = 1, alpha = 1, depth = 30, width = 48, batch = 16, metric = 'signal', seed: seed0 = 2 }: {
  activation?: Act; gain?: number; alpha?: number; depth?: number; width?: number; batch?: number; metric?: 'signal' | 'weights'; seed?: number;
}) {
  const [act, setAct] = useState<Act>(activation);
  const [g, setG] = useState(gain);
  const [al, setAl] = useState(alpha);
  const [L, setL] = useState(Math.max(4, Math.min(60, Math.round(depth))));
  const [m, setM] = useState(metric);
  const [seed, setSeed] = useState(seed0);
  const n = Math.max(8, Math.min(96, Math.round(width))), B = Math.max(4, Math.min(64, Math.round(batch)));
  const plain = useMemo(() => residualStack(act, g, al, L, n, B, seed, false), [act, g, L, n, B, seed]);
  const res = useMemo(() => residualStack(act, g, al, L, n, B, seed, true), [act, g, al, L, n, B, seed]);
  const P = m === 'signal' ? plain.sig : plain.wn, R = m === 'signal' ? res.sig : res.wn;
  const lg = (v: number) => Math.log10(Math.max(v, 1e-30));
  const all = [...P, ...R].map(lg).filter(Number.isFinite);
  const top = Math.min(12, Math.ceil(Math.max(...all, 1))), bot = Math.max(-12, Math.floor(Math.min(...all, -1)));
  const box: [number, number, number, number] = [34, 16, 312, 176];
  const bw = (box[2] - box[0]) / L;
  const sy = scale([bot, top], [box[3], box[1]]);
  const yv = (v: number) => sy(Math.max(bot, Math.min(top, lg(v))));
  const ticks: number[] = []; const step = Math.max(1, Math.ceil((top - bot) / 6));
  for (let e = bot; e <= top; e += step) ticks.push(e);
  const ratio = (a: number[]) => a[0] / a[a.length - 1];
  const fmt = (v: number) => (!Number.isFinite(v) ? '—' : v >= 0.01 && v < 1000 ? v.toPrecision(2) : v.toExponential(0));
  return (
    <div>
      <Stage w={320} h={212} label="Gradient size per layer in a plain versus a residual network">
        {ticks.map((e) => <g key={e}>
          <line x1={box[0]} x2={box[2]} y1={sy(e)} y2={sy(e)} stroke="var(--grid)" strokeWidth={0.5} />
          <text x={box[0] - 3} y={sy(e) + 3} fontSize="7" textAnchor="end" fill="var(--muted)">1e{e}</text>
        </g>)}
        {P.map((v, i) => <rect key={'p' + i} x={box[0] + i * bw + 0.3} y={Math.min(yv(v), sy(Math.max(bot, 0)))} width={bw / 2 - 0.3}
          height={Math.abs(yv(v) - sy(Math.max(bot, 0)))} fill={C[4]} opacity={0.85} />)}
        {R.map((v, i) => <rect key={'r' + i} x={box[0] + i * bw + bw / 2} y={Math.min(yv(v), sy(Math.max(bot, 0)))} width={bw / 2 - 0.3}
          height={Math.abs(yv(v) - sy(Math.max(bot, 0)))} fill={C[0]} opacity={0.85} />)}
        <line x1={box[0]} x2={box[2]} y1={sy(Math.max(bot, 0))} y2={sy(Math.max(bot, 0))} stroke="var(--fg)" strokeWidth={0.8} />
        <line x1={box[0]} x2={box[0]} y1={box[1]} y2={box[3]} stroke="var(--fg)" strokeWidth={0.8} />
        <text x={box[0]} y={box[3] + 9} fontSize="7" fill="var(--muted)">layer 1 (input side)</text>
        <text x={box[2]} y={box[3] + 9} fontSize="7" textAnchor="end" fill="var(--muted)">layer {L} (loss side)</text>
        <text x={box[0] + 2} y={box[1] - 5} fontSize="8"><tspan fill={C[4]}>■ plain</tspan><tspan fill={C[0]}>  ■ residual</tspan>
          <tspan fill="var(--fg)">  {m === 'signal' ? 'RMS of ∂L/∂h entering layer' : '‖∂L/∂W‖ of layer'}</tspan></text>
        <text x={box[0]} y={200} fontSize="8.5" fill="var(--fg)">layer 1 ÷ layer {L}:  <tspan fill={C[4]}>plain {fmt(ratio(P))}</tspan>   <tspan fill={C[0]}>residual {fmt(ratio(R))}</tspan></text>
      </Stage>
      <Controls>
        {(['tanh', 'relu', 'sigmoid'] as Act[]).map((a) => <Btn key={a} active={a === act} onClick={() => setAct(a)}>{a === 'relu' ? 'ReLU' : a}</Btn>)}
        <Btn active={m === 'signal'} onClick={() => setM('signal')}>∂L/∂h</Btn>
        <Btn active={m === 'weights'} onClick={() => setM('weights')}>∂L/∂W</Btn>
        <Slider label="init gain g" min={0.3} max={3} step={0.01} value={g} onChange={setG} format={(v) => v.toFixed(2)} />
        <Slider label="branch scale α" min={0} max={1.5} step={0.01} value={al} onChange={setAl} format={(v) => v.toFixed(2)} />
        <Btn onClick={() => setAl(1 / Math.sqrt(L))}>α = 1/√L</Btn>
        <Slider label="depth L" min={4} max={60} step={1} value={L} onChange={(v) => setL(Math.round(v))} format={(v) => String(Math.round(v))} />
        <Btn onClick={() => setSeed((s) => s + 1)}>↺ New weights</Btn>
      </Controls>
    </div>
  );
}
