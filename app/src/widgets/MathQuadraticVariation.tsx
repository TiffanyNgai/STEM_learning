import { useMemo, useState } from 'react';
import { Btn, Controls, Slider, Stage, pathOf, rng, scale } from './_kit';

/**
 * One Brownian path W on [0, 1] (simulated on 4096 steps), sampled on a grid of N = 2^k intervals.
 * Refining the grid uses the SAME path, so you watch sums converge.
 * mode 'qv' (default): running sums Σ(ΔW)² (→ t, the quadratic variation; dashed line y = t)
 *   and Σ|ΔW| (total variation, which grows like √N without bound).
 * mode 'integral': Riemann sums for ∫₀ᵗ W dW evaluated at the LEFT point (Itô; → (W_t² − t)/2, dashed)
 *   and with the endpoint AVERAGE (Stratonovich; equals W_t²/2 exactly, dotted).
 * props: { mode?: 'qv' | 'integral', logN?: number (initial k, default 4), seed?: number }
 */
const FINE = 4096;

export default function MathQuadraticVariation({ mode = 'qv', logN: k0 = 4, seed: s0 = 5 }: { mode?: 'qv' | 'integral'; logN?: number; seed?: number }) {
  const [k, setK] = useState(k0);
  const [seed, setSeed] = useState(s0);
  const W = useMemo(() => {
    const R = rng(seed * 104729); const w = [0];
    for (let i = 0; i < FINE; i++) w.push(w[i] + Math.sqrt(1 / FINE) * R.normal());
    return w;
  }, [seed]);
  const N = 2 ** k, stride = FINE / N;
  const g = Array.from({ length: N + 1 }, (_, i) => W[i * stride]);
  const tb: [number, number, number, number] = [30, 8, 312, 80];
  const bb: [number, number, number, number] = [30, 100, 312, 182];
  const st = (b: number[]) => scale([0, 1], [b[0], b[2]]);
  const wmax = Math.max(1, ...W.map(Math.abs));
  const sw = scale([-wmax, wmax], [tb[3], tb[1]]);
  const sxT = st(tb), sxB = st(bb);
  let a: number[] = [0], b: number[] = [0], refA: [number, number][] = [], refB: [number, number][] = [];
  for (let i = 0; i < N; i++) {
    const d = g[i + 1] - g[i];
    if (mode === 'qv') { a.push(a[i] + d * d); b.push(b[i] + Math.abs(d)); }
    else { a.push(a[i] + g[i] * d); b.push(b[i] + 0.5 * (g[i] + g[i + 1]) * d); }
  }
  for (let i = 0; i <= 256; i++) {
    const t = i / 256, w = W[i * 16];
    refA.push([t, mode === 'qv' ? t : (w * w - t) / 2]); refB.push([t, mode === 'qv' ? NaN : (w * w) / 2]);
  }
  refB = refB.filter((p) => Number.isFinite(p[1]));
  const lo = mode === 'qv' ? 0 : Math.min(-0.6, ...refA.map((p) => p[1]), ...a);
  const hi = mode === 'qv' ? 2 : Math.max(0.6, ...refB.map((p) => p[1]), ...b);
  const sy = scale([lo, hi], [bb[3], bb[1]]);
  const cl = (v: number) => Math.max(bb[1] - 4, Math.min(bb[3], sy(v)));
  const ts = (arr: number[]) => pathOf(arr.map((v, i) => [sxB(i / N), cl(v)]));
  const fin = (arr: number[]) => arr[arr.length - 1];
  return (
    <div>
      <Stage w={320} h={210} label="Brownian path and Riemann sums on a refining grid">
        <rect x={tb[0]} y={tb[1]} width={tb[2] - tb[0]} height={tb[3] - tb[1]} fill="none" stroke="var(--grid)" />
        <line x1={tb[0]} x2={tb[2]} y1={sw(0)} y2={sw(0)} stroke="var(--muted)" strokeWidth={0.5} />
        <path d={pathOf(W.filter((_, i) => i % 4 === 0).map((v, i) => [sxT((i * 4) / FINE), sw(v)]))} stroke="var(--muted)" strokeWidth={0.6} fill="none" />
        <path d={pathOf(g.map((v, i) => [sxT(i / N), sw(v)]))} stroke="var(--fg)" strokeWidth={1.2} fill="none" />
        {N <= 64 && g.map((v, i) => <circle key={i} cx={sxT(i / N)} cy={sw(v)} r={1.8} fill="var(--fg)" />)}
        <text x={tb[0] + 3} y={tb[1] + 9} fontSize="8.5">W(t), grid of N = {N} steps</text>
        <rect x={bb[0]} y={bb[1]} width={bb[2] - bb[0]} height={bb[3] - bb[1]} fill="none" stroke="var(--grid)" />
        {lo < 0 && <line x1={bb[0]} x2={bb[2]} y1={sy(0)} y2={sy(0)} stroke="var(--muted)" strokeWidth={0.5} />}
        {[lo, hi].map((v) => <text key={v} x={bb[0] - 3} y={sy(v) + 3} fontSize="8" textAnchor="end">{v.toFixed(1)}</text>)}
        <path d={pathOf(refA.map(([t, v]) => [sxB(t), cl(v)]))} stroke="var(--c2)" strokeDasharray="4 3" strokeWidth={1.2} fill="none" />
        {refB.length > 0 && <path d={pathOf(refB.map(([t, v]) => [sxB(t), cl(v)]))} stroke="var(--c3)" strokeDasharray="1 2" strokeWidth={1.4} fill="none" />}
        <path d={ts(a)} stroke="var(--c2)" strokeWidth={1.6} fill="none" />
        <path d={ts(b)} stroke="var(--c3)" strokeWidth={1.6} fill="none" />
        {mode === 'qv' ? <>
          <text x={30} y={196} fontSize="8.5" style={{ fill: 'var(--c2)' }}>Σ(ΔW)² = {fin(a).toFixed(3)} (dashed: t, ends at 1)</text>
          <text x={30} y={207} fontSize="8.5" style={{ fill: 'var(--c3)' }}>Σ|ΔW| = {fin(b).toFixed(2)} (grows ≈ √(2N/π) = {Math.sqrt((2 * N) / Math.PI).toFixed(1)})</text>
        </> : <>
          <text x={30} y={196} fontSize="8.5" style={{ fill: 'var(--c2)' }}>left-point Σ W ΔW = {fin(a).toFixed(3)} → (W₁² − 1)/2 = {((g[N] ** 2 - 1) / 2).toFixed(3)}</text>
          <text x={30} y={207} fontSize="8.5" style={{ fill: 'var(--c3)' }}>average-point sum = {fin(b).toFixed(3)} = W₁²/2 = {(g[N] ** 2 / 2).toFixed(3)}</text>
        </>}
      </Stage>
      <Controls>
        <Slider label="N = 2^k" min={1} max={12} step={1} value={k} onChange={setK} format={(v) => String(2 ** v)} />
        <Btn onClick={() => setSeed((s) => s + 1)}>New path</Btn>
      </Controls>
    </div>
  );
}
