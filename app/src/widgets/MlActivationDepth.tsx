import { useEffect, useMemo, useState } from 'react';
import { Btn, C, Controls, Slider, Stage, pathOf, prefersReducedMotion, rng, scale, useFrame } from './_kit';

/**
 * Activation and gradient statistics through a deep, randomly initialized MLP (no training).
 * A batch of B inputs x ~ N(0, I) passes through L square layers z_l = W_l h_{l-1}, h_l = φ(z_l), with
 * W_l entries ~ N(0, g²/n) (biases 0). Then a random gradient ∂L/∂h_L ~ N(0, I) is backpropagated.
 * Top: log₁₀ RMS of the activations h_l (forward, blue) and of the backward signal δ_l = ∂L/∂z_l (red)
 * for every layer. Bottom: histograms of h at the first, middle and last layer.
 * Optional "LayerNorm" re-standardizes each sample's z_l (mean 0, variance 1 over its n units) before φ.
 * Presets: Xavier/Glorot (g = 1, i.e. Var w = 1/n for square layers) and He/Kaiming (g = √2).
 * props: {
 *   activation?: 'tanh'|'relu'|'sigmoid'|'linear' (default 'tanh')
 *   gain?: number       initial g (default 1)
 *   depth?: number      number of layers L (default 20, 2–50)
 *   width?: number      units per layer n (default 64)
 *   batch?: number      batch size B (default 32)
 *   norm?: boolean      start with LayerNorm on (default false)
 *   showNorm?: boolean  show the LayerNorm toggle (default false)
 *   seed?: number       (default 1)
 * }
 */
type Act = 'tanh' | 'relu' | 'sigmoid' | 'linear';
const F: Record<Act, [(z: number) => number, (z: number) => number]> = {
  tanh: [Math.tanh, (z) => 1 - Math.tanh(z) ** 2],
  relu: [(z) => (z > 0 ? z : 0), (z) => (z > 0 ? 1 : 0)],
  sigmoid: [(z) => 1 / (1 + Math.exp(-z)), (z) => { const s = 1 / (1 + Math.exp(-z)); return s * (1 - s); }],
  linear: [(z) => z, () => 1],
};
const rms = (a: Float64Array) => { let s = 0; for (const v of a) s += v * v; return Math.sqrt(s / a.length); };

export function simulate(act: Act, g: number, L: number, n: number, B: number, seed: number, norm: boolean) {
  const r = rng(seed); const [f, df] = F[act]; const sd = g / Math.sqrt(n);
  const Ws = Array.from({ length: L }, () => Float64Array.from({ length: n * n }, () => r.normal() * sd));
  let h = Float64Array.from({ length: B * n }, () => r.normal());
  const Z: Float64Array[] = [], Zh: Float64Array[] = [], S: Float64Array[] = [], H: Float64Array[] = [];
  for (let l = 0; l < L; l++) {
    const W = Ws[l], z = new Float64Array(B * n);
    for (let b = 0; b < B; b++) for (let j = 0; j < n; j++) { let s = 0; for (let k = 0; k < n; k++) s += W[j * n + k] * h[b * n + k]; z[b * n + j] = s; }
    const sig = new Float64Array(B); let zin = z;
    if (norm) {
      zin = new Float64Array(B * n);
      for (let b = 0; b < B; b++) {
        let m = 0, v = 0; for (let j = 0; j < n; j++) m += z[b * n + j]; m /= n;
        for (let j = 0; j < n; j++) v += (z[b * n + j] - m) ** 2; sig[b] = Math.sqrt(v / n + 1e-5);
        for (let j = 0; j < n; j++) zin[b * n + j] = (z[b * n + j] - m) / sig[b];
      }
    }
    Z.push(z); Zh.push(zin); S.push(sig); h = zin.map(f); H.push(h);
  }
  const fwd = H.map(rms), bwd = new Array<number>(L);
  let gh = Float64Array.from({ length: B * n }, () => r.normal());
  for (let l = L - 1; l >= 0; l--) {
    const zin = Zh[l]; let gz = gh.map((v, i) => v * df(zin[i]));
    if (norm) { // backprop through x̂ = (z − mean)/σ, per sample
      const out = new Float64Array(B * n);
      for (let b = 0; b < B; b++) {
        let m1 = 0, m2 = 0; for (let j = 0; j < n; j++) { m1 += gz[b * n + j]; m2 += gz[b * n + j] * zin[b * n + j]; } m1 /= n; m2 /= n;
        for (let j = 0; j < n; j++) out[b * n + j] = (gz[b * n + j] - m1 - zin[b * n + j] * m2) / S[l][b];
      }
      gz = out;
    }
    bwd[l] = rms(gz);
    const W = Ws[l], prev = new Float64Array(B * n);
    for (let b = 0; b < B; b++) for (let k = 0; k < n; k++) { let s = 0; for (let j = 0; j < n; j++) s += W[j * n + k] * gz[b * n + j]; prev[b * n + k] = s; }
    gh = prev;
  }
  return { fwd, bwd, H };
}

export default function MlActivationDepth({ activation = 'tanh', gain = 1, depth = 20, width = 64, batch = 32, norm: norm0 = false, showNorm = false, seed: seed0 = 1 }: {
  activation?: Act; gain?: number; depth?: number; width?: number; batch?: number; norm?: boolean; showNorm?: boolean; seed?: number;
}) {
  const [act, setAct] = useState<Act>(activation);
  const [g, setG] = useState(gain);
  const [L, setL] = useState(Math.max(2, Math.min(50, Math.round(depth))));
  const [norm, setNorm] = useState(norm0);
  const [seed, setSeed] = useState(seed0);
  const n = Math.max(8, Math.min(128, Math.round(width))), B = Math.max(4, Math.min(64, Math.round(batch)));
  const sim = useMemo(() => simulate(act, g, L, n, B, seed, norm), [act, g, L, n, B, seed, norm]);
  // Animate the curves growing layer by layer whenever a setting changes.
  const [shown, setShown] = useState(L);
  const [anim, setAnim] = useState(false);
  useEffect(() => { if (prefersReducedMotion()) { setShown(L); return; } setShown(0); setAnim(true); }, [sim]);
  useFrame((dt) => setShown((s) => Math.min(L, s + dt * 30)), anim);
  useEffect(() => { if (anim && shown >= L) setAnim(false); }, [anim, shown, L]);

  const box: [number, number, number, number] = [32, 14, 312, 138];
  const sx = scale([1, L], [box[0], box[2]]); const sy = scale([-6, 3], [box[3], box[1]]);
  const ly = (v: number) => sy(Math.max(-6, Math.min(3, Math.log10(Math.max(v, 1e-12)))));
  const k = Math.floor(shown);
  const line = (vals: number[]) => pathOf(vals.slice(0, k).map((v, i) => [sx(i + 1), ly(v)]));
  const layersH = [0, Math.floor((L - 1) / 2), L - 1];
  const hist = (a: Float64Array, x0: number) => {
    let lo: number, hi: number;
    if (act === 'tanh') { lo = -1; hi = 1; } else if (act === 'sigmoid') { lo = 0; hi = 1; } else { const s = rms(a) || 1e-12; lo = act === 'relu' ? 0 : -3.5 * s; hi = 3.5 * s; }
    const nb = 21, cnt = new Array(nb).fill(0);
    for (const v of a) { const i = Math.floor(((v - lo) / (hi - lo)) * nb); cnt[Math.max(0, Math.min(nb - 1, i))]++; }
    const mx = Math.max(...cnt), w = 88 / nb;
    return cnt.map((c, i) => <rect key={i} x={x0 + i * w} y={238 - (c / mx) * 52} width={w - 0.4} height={(c / mx) * 52} fill={C[1]} opacity={0.75} />);
  };
  const fmt = (v: number) => (v === 0 ? '0' : v.toExponential(1));
  return (
    <div>
      <Stage w={320} h={262} label="Activation and gradient scale through the layers of a deep network">
        {[-6, -4, -2, 0, 2].map((e) => <g key={e}>
          <line x1={box[0]} x2={box[2]} y1={sy(e)} y2={sy(e)} stroke="var(--grid)" strokeWidth={0.5} />
          <text x={box[0] - 3} y={sy(e) + 3} fontSize="7" textAnchor="end" fill="var(--muted)">1e{e}</text>
        </g>)}
        <line x1={box[0]} x2={box[2]} y1={sy(0)} y2={sy(0)} stroke="var(--fg)" strokeWidth={0.6} strokeDasharray="2 2" />
        <line x1={box[0]} x2={box[0]} y1={box[1]} y2={box[3]} stroke="var(--fg)" strokeWidth={0.8} />
        <line x1={box[0]} x2={box[2]} y1={box[3]} y2={box[3]} stroke="var(--fg)" strokeWidth={0.8} />
        <text x={box[0]} y={box[3] + 9} fontSize="7" fill="var(--muted)">layer 1</text>
        <text x={box[2]} y={box[3] + 9} fontSize="7" textAnchor="end" fill="var(--muted)">layer {L}</text>
        <path d={line(sim.fwd)} fill="none" stroke={C[1]} strokeWidth={1.8} />
        <path d={line(sim.bwd)} fill="none" stroke={C[4]} strokeWidth={1.8} />
        <text x={box[0] + 4} y={box[1] - 4} fontSize="8"><tspan fill={C[1]}>— RMS of activations h</tspan><tspan fill={C[4]}>   — RMS of gradient ∂L/∂z</tspan></text>
        <text x={box[2]} y={box[3] + 18} fontSize="8" textAnchor="end" fill="var(--fg)">
          last layer h: {fmt(sim.fwd[L - 1])} · layer-1 gradient: {fmt(sim.bwd[0])}
        </text>
        {layersH.map((l, i) => <g key={i}>
          {hist(sim.H[l], 14 + i * 102)}
          <line x1={14 + i * 102} x2={102 + i * 102} y1={238} y2={238} stroke="var(--fg)" strokeWidth={0.6} />
          <text x={58 + i * 102} y={250} fontSize="8" textAnchor="middle" fill="var(--fg)">h at layer {l + 1}</text>
          <text x={58 + i * 102} y={259} fontSize="7" textAnchor="middle" fill="var(--muted)">RMS {fmt(sim.fwd[l])}</text>
        </g>)}
      </Stage>
      <Controls>
        {(['tanh', 'relu', 'sigmoid', 'linear'] as Act[]).map((a) => <Btn key={a} active={a === act} onClick={() => setAct(a)}>{a === 'relu' ? 'ReLU' : a}</Btn>)}
        <Btn active={Math.abs(g - 1) < 1e-6} onClick={() => setG(1)}>Xavier g=1</Btn>
        <Btn active={Math.abs(g - Math.SQRT2) < 1e-6} onClick={() => setG(Math.SQRT2)}>He g=√2</Btn>
        <Slider label="init gain g (std = g/√n)" min={0.3} max={3} step={0.01} value={g} onChange={setG} format={(v) => v.toFixed(2)} />
        <Slider label="depth L" min={2} max={50} step={1} value={L} onChange={(v) => setL(Math.round(v))} format={(v) => String(Math.round(v))} />
        {showNorm && <Btn active={norm} onClick={() => setNorm(!norm)}>LayerNorm {norm ? 'on' : 'off'}</Btn>}
        <Btn onClick={() => setSeed((s) => s + 1)}>↺ New weights</Btn>
      </Controls>
    </div>
  );
}
