import { useMemo, useState } from 'react';
import { Btn, C, Controls, Slider, Stage, pathOf, rng, scale } from './_kit';

/**
 * Umbrella sampling + WHAM on a 1D double-well free energy F(s) = h (s² − 1)² + a·s (k_BT = 1).
 * Each window i adds a harmonic restraint w_i(s) = ½ k (s − s_i)²; N samples are drawn from each biased
 * Boltzmann distribution ∝ exp(−F − w_i) (exactly, by inverse-CDF on a grid — standing in for a short MD run).
 * Bottom panel: the per-window histograms (watch their overlap). Top panel: the true F (line) and the
 * WHAM reconstruction (dots), which is only reliable where neighbouring histograms overlap.
 * props: { barrier?: number (h, default 8), asym?: number (a, default 0.8), windows?: number (default 8),
 *          k?: number (spring constant in k_BT per unit², default 40), samples?: number (per window, default 400) }
 */
const NB = 80, LO = -1.8, HI = 1.8, BW = (HI - LO) / NB;
const bc = (b: number) => LO + (b + 0.5) * BW;

export default function DrugUmbrellaWindows({ barrier = 8, asym = 0.8, windows = 8, k: k0 = 40, samples = 400 }: {
  barrier?: number; asym?: number; windows?: number; k?: number; samples?: number;
}) {
  const [nw, setNw] = useState(windows);
  const [k, setK] = useState(k0);
  const [seed, setSeed] = useState(1);
  const F = (s: number) => barrier * (s * s - 1) ** 2 + asym * s;

  const { hists, Fw } = useMemo(() => {
    const R = rng(seed);
    const centres = Array.from({ length: nw }, (_, i) => (nw === 1 ? 0 : -1.5 + (3 * i) / (nw - 1)));
    const bias = centres.map((c) => Array.from({ length: NB }, (_, b) => 0.5 * k * (bc(b) - c) ** 2));
    const hists = bias.map((wb) => {
      const p = wb.map((w, b) => Math.exp(-(F(bc(b)) + w)));
      const cdf: number[] = []; let acc = 0; p.forEach((v) => { acc += v; cdf.push(acc); });
      const h = new Array(NB).fill(0);
      for (let n = 0; n < samples; n++) {
        const u = R.u() * acc; let b = 0; while (b < NB - 1 && cdf[b] < u) b++;
        h[b]++;
      }
      return h as number[];
    });
    // WHAM self-consistent iteration
    const f = new Array(nw).fill(0); let P = new Array(NB).fill(0);
    for (let it = 0; it < 2000; it++) {
      P = Array.from({ length: NB }, (_, b) => {
        const num = hists.reduce((s, h) => s + h[b], 0);
        const den = bias.reduce((s, wb, i) => s + samples * Math.exp(f[i] - wb[b]), 0);
        return num > 0 && den > 0 && Number.isFinite(den) ? num / den : 0;
      });
      let delta = 0;
      for (let i = 0; i < nw; i++) {
        const z = P.reduce((s, p, b) => s + p * Math.exp(-bias[i][b]), 0);
        const nf = z > 0 ? -Math.log(z) : f[i];
        delta = Math.max(delta, Math.abs(nf - f[i])); f[i] = nf;
      }
      const f0 = f[0]; for (let i = 0; i < nw; i++) f[i] -= f0;
      if (delta < 1e-7) break;
    }
    const Fw = P.map((p) => (p > 0 ? -Math.log(p) : NaN));
    const ok = Fw.filter((v) => Number.isFinite(v));
    const mn = Math.min(...ok);
    const Ftrue = Array.from({ length: NB }, (_, b) => F(bc(b)));
    const tmin = Math.min(...Ftrue);
    return { hists, Fw: Fw.map((v) => v - mn + tmin) };
  }, [nw, k, seed, samples, barrier, asym]);

  const sx = scale([LO, HI], [24, 314]);
  const sy = scale([-asym - 1.5, barrier + 3], [110, 10]);
  const hmax = Math.max(...hists.flat());
  const hy = scale([0, hmax], [214, 128]);
  const xs = Array.from({ length: 181 }, (_, i) => LO + ((HI - LO) * i) / 180);
  return (
    <div>
      <Stage w={320} h={226} label="Umbrella sampling windows and WHAM reconstruction">
        <text x={26} y={10} fontSize="8.5" fontWeight={700} fill="var(--fg)">free energy (k_BT): true — · WHAM ●</text>
        <path d={pathOf(xs.map((x) => [sx(x), Math.max(4, sy(F(x)))]))} fill="none" stroke="var(--fg)" strokeWidth={1.8} />
        {Fw.map((v, b) => Number.isFinite(v) && sy(v) > 4 && <circle key={b} cx={sx(bc(b))} cy={sy(v)} r={2} fill="var(--c5)" />)}
        <line x1={24} x2={314} y1={214} y2={214} stroke="var(--fg)" strokeWidth={0.8} />
        {hists.map((h, i) => (
          <path key={i} d={pathOf(h.map((v, b) => [sx(bc(b)), hy(v)]))} fill="none" stroke={C[i % 6]} strokeWidth={1.3} />
        ))}
        <text x={26} y={124} fontSize="8.5" fill="var(--muted)">histogram from each window ({samples} samples each)</text>
        <text x={169} y={224} fontSize="8.5" textAnchor="middle" fill="var(--muted)">collective variable s →</text>
      </Stage>
      <Controls>
        <Slider label="windows" min={2} max={16} step={1} value={nw} onChange={setNw} format={(v) => String(v)} />
        <Slider label="spring k" min={5} max={400} step={5} value={k} onChange={setK} format={(v) => String(v)} />
        <Btn onClick={() => setSeed((s) => s + 1)}>🎲 Resample</Btn>
      </Controls>
    </div>
  );
}
