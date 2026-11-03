import { useMemo, useRef, useState } from 'react';
import { Btn, Controls, PlayPause, Slider, Stage, pathOf, prefersReducedMotion, rng, scale, useFrame } from './_kit';

/**
 * Exponential averaging in the Zwanzig (FEP) equation, ΔF = −kT ln ⟨exp(−ΔU/kT)⟩_A, in units of kT.
 * Energy differences ΔU = U_B − U_A sampled in state A are drawn from a Gaussian N(μ, σ²), for which the
 * exact answer is ΔF = μ − σ²/2. Top panel: the sampled distribution p(ΔU) (blue) and the distribution of
 * the samples that actually dominate the average, p(ΔU)·e^(−ΔU), which is centred at μ − σ² (orange); sampled
 * values appear as ticks. Bottom panel: the running FEP estimate (green) vs number of samples N (log axis),
 * the exact ΔF (dashed) and the naive mean ⟨ΔU⟩ = μ (grey). With small σ it converges in a few samples;
 * with large σ the estimate stays biased high until rare low-ΔU samples turn up.
 * props: { mu?: number (μ in kT, default 3), sigma?: number (σ in kT, default 1.5),
 *          nMax?: number (default 2000), seed?: number (default 1), autoRun?: boolean (default true) }
 */
export default function DrugZwanzigAverage({ mu = 3, sigma = 1.5, nMax = 2000, seed = 1, autoRun = true }: {
  mu?: number; sigma?: number; nMax?: number; seed?: number; autoRun?: boolean;
}) {
  const [sg, setSg] = useState(sigma);
  const [sd, setSd] = useState(seed);
  const reduced = prefersReducedMotion();
  const [running, setRunning] = useState(autoRun && !reduced);
  const [n, setN] = useState(reduced || !autoRun ? nMax : 1);

  // All samples are pre-drawn for the current (σ, seed); the animation reveals them one batch at a time.
  const samples = useMemo(() => {
    const R = rng(sd * 7919 + 13);
    return Array.from({ length: nMax }, () => mu + sg * R.normal());
  }, [mu, sg, sd, nMax]);
  // Running estimates via a numerically stable log-sum-exp.
  const est = useMemo(() => {
    const out: number[] = []; let m = Infinity; let s = 0;
    samples.forEach((u, i) => {
      if (u < m) { s = s * Math.exp(u - m) + 1; m = u; } else s += Math.exp(-(u - m));
      out.push(m - Math.log(s / (i + 1)));
    });
    return out;
  }, [samples]);

  const acc = useRef(0);
  useFrame((dt) => {
    acc.current += dt;
    if (acc.current < 0.05) return;
    acc.current = 0;
    setN((v) => {
      const next = Math.min(nMax, Math.ceil(v * 1.06) + 1);
      if (next >= nMax) setRunning(false);
      return next;
    });
  }, running);

  const exact = mu - (sg * sg) / 2;
  const shown = samples.slice(0, n);
  // ---- top panel: distributions ----
  const ux: [number, number] = [mu - 4.5 * Math.max(sg, 0.8) - 1, mu + 3.5 * Math.max(sg, 0.8)];
  const sx = scale(ux, [24, 312]);
  const gauss = (u: number, m: number) => Math.exp(-((u - m) ** 2) / (2 * sg * sg));
  const sy = scale([0, 1], [92, 20]);
  const us = Array.from({ length: 201 }, (_, i) => ux[0] + ((ux[1] - ux[0]) * i) / 200);
  // ---- bottom panel: running estimate ----
  const lx = scale([0, Math.log10(nMax)], [34, 312]);
  const yr: [number, number] = [Math.min(exact, mu) - 1.5, mu + 1.5];
  const ly = scale(yr, [206, 118]);
  const clampY = (v: number) => Math.max(114, Math.min(210, ly(v)));
  const cur = est[n - 1];
  const reset = () => { setN(1); setRunning(true); };

  return (
    <div>
      <Stage w={320} h={232} label="Exponential averaging in the Zwanzig equation">
        <text x={24} y={12} fontSize="8.5" fill="var(--c2)" fontWeight={700}>p(ΔU) sampled in A</text>
        <text x={312} y={12} fontSize="8.5" fill="var(--c3)" fontWeight={700} textAnchor="end">p(ΔU)·e^(−ΔU): what the average needs</text>
        <path d={pathOf(us.map((u) => [sx(u), sy(gauss(u, mu))]))} fill="none" stroke="var(--c2)" strokeWidth={1.8} />
        <path d={pathOf(us.map((u) => [sx(u), sy(gauss(u, mu - sg * sg))]))} fill="none" stroke="var(--c3)" strokeWidth={1.8} strokeDasharray="5 3" />
        <line x1={24} x2={312} y1={92} y2={92} stroke="var(--fg)" strokeWidth={0.8} />
        {shown.slice(-400).map((u, i) => (
          <line key={i} x1={sx(u)} x2={sx(u)} y1={93} y2={100} stroke="var(--c2)" strokeOpacity={0.35} />
        ))}
        <text x={168} y={110} fontSize="8.5" fill="var(--muted)" textAnchor="middle">ΔU = U_B − U_A (kT) →</text>
        {/* bottom */}
        <line x1={34} x2={312} y1={ly(exact)} y2={ly(exact)} stroke="var(--fg)" strokeDasharray="4 3" />
        <line x1={34} x2={312} y1={ly(mu)} y2={ly(mu)} stroke="var(--muted)" strokeDasharray="1 3" />
        <text x={310} y={ly(exact) - 3} fontSize="8" fill="var(--fg)" textAnchor="end">exact ΔF = {exact.toFixed(2)}</text>
        <text x={310} y={ly(mu) - 3} fontSize="8" fill="var(--muted)" textAnchor="end">⟨ΔU⟩ = {mu.toFixed(1)}</text>
        <path d={pathOf(est.slice(0, n).map((v, i) => [lx(Math.log10(i + 1)), clampY(v)]))} fill="none" stroke="var(--c1)" strokeWidth={2} />
        <line x1={34} x2={34} y1={114} y2={210} stroke="var(--fg)" strokeWidth={0.8} />
        <line x1={34} x2={312} y1={210} y2={210} stroke="var(--fg)" strokeWidth={0.8} />
        {[1, 10, 100, 1000, 10000].filter((v) => v <= nMax).map((v) => (
          <text key={v} x={lx(Math.log10(v))} y={219} fontSize="8" fill="var(--muted)" textAnchor="middle">{v}</text>
        ))}
        <text x={168} y={229} fontSize="8.5" fill="var(--muted)" textAnchor="middle">samples N (log scale)</text>
        <text x={4} y={162} fontSize="8.5" fill="var(--muted)" transform="rotate(-90 8 162)" textAnchor="middle">ΔF estimate</text>
      </Stage>
      <Controls>
        <PlayPause running={running} set={setRunning} />
        <Btn onClick={() => { setSd((v) => v + 1); reset(); }}>🎲 New samples</Btn>
        <Slider label="spread σ (kT)" min={0.3} max={3} step={0.1} value={sg} onChange={(v) => { setSg(v); reset(); }} />
      </Controls>
      <p className="w-muted" style={{ margin: '4px 0 0', fontSize: 13 }}>
        N = {n}: estimate {cur.toFixed(2)} kT, error {(cur - exact >= 0 ? '+' : '') + (cur - exact).toFixed(2)} kT
      </p>
    </div>
  );
}
