import { useState } from 'react';
import { Axes, Btn, Controls, Slider, Stage, pathOf, scale } from './_kit';

type Wave = 'square' | 'sawtooth' | 'triangle';
/**
 * Partial Fourier sums S_N(x) of a 2π-periodic wave, drawn over two periods with the target wave in grey.
 *   square:   f = sign(sin x)            = (4/π) Σ_{n odd} sin(nx)/n           (jumps of size 2)
 *   sawtooth: f = x on (−π, π)           = Σ 2(−1)^{n+1} sin(nx)/n             (jumps of size 2π at ±π)
 *   triangle: f = |x| on [−π, π]         = π/2 − (4/π) Σ_{n odd} cos(nx)/n²     (continuous: no Gibbs)
 * Readout: the peak of S_N next to a jump and its overshoot as a % of the jump size (tends to ≈ 8.95%:
 * the Gibbs phenomenon), or the largest error for the continuous triangle wave.
 * props: { wave?: Wave (default 'square'), n?: highest harmonic N (1–80, default 5),
 *          showTerm?: boolean (default false; also draws the last harmonic added), switchable?: boolean (default true) }
 */
export default function MathFourierPartialSums({ wave = 'square', n = 5, showTerm = false, switchable = true }: {
  wave?: Wave; n?: number; showTerm?: boolean; switchable?: boolean;
}) {
  const [w, setW] = useState<Wave>(wave);
  const [N, setN] = useState(Math.max(1, Math.min(80, Math.round(n))));
  const [term, setTerm] = useState(showTerm);
  const P = Math.PI;
  const coef = (k: number): number => {
    if (w === 'square') return k % 2 ? 4 / (P * k) : 0;
    if (w === 'sawtooth') return (2 * (k % 2 ? 1 : -1)) / k;
    return k % 2 ? -4 / (P * k * k) : 0;
  };
  const basis = (k: number, x: number) => (w === 'triangle' ? Math.cos(k * x) : Math.sin(k * x));
  const S = (x: number) => {
    let s = w === 'triangle' ? P / 2 : 0;
    for (let k = 1; k <= N; k++) { const c = coef(k); if (c) s += c * basis(k, x); }
    return s;
  };
  const wrap = (x: number) => ((((x + P) % (2 * P)) + 2 * P) % (2 * P)) - P; // into [−π, π)
  const target = (x: number) => {
    if (w === 'square') { const s = Math.sin(x); return Math.abs(s) < 1e-9 ? 0 : Math.sign(s); }
    if (w === 'sawtooth') return wrap(x);
    return Math.abs(wrap(x));
  };
  const xr: [number, number] = [-2 * P, 2 * P];
  const yr: [number, number] = w === 'square' ? [-1.5, 1.5] : w === 'sawtooth' ? [-4.3, 4.3] : [-0.6, 3.8];
  const box: [number, number, number, number] = [26, 8, 314, 170];
  const sx = scale(xr, [box[0], box[2]]), sy = scale(yr, [box[3], box[1]]);
  const M = 640;
  const xs = Array.from({ length: M + 1 }, (_, i) => xr[0] + ((xr[1] - xr[0]) * i) / M);
  const sumPath = pathOf(xs.map((x) => [sx(x), sy(S(x))]));
  // target drawn piecewise so the jumps stay vertical gaps
  const segs: [number, number][][] = [[]];
  xs.forEach((x, i) => {
    const v = target(x);
    if (i > 0 && Math.abs(v - target(xs[i - 1])) > 1) segs.push([]);
    segs[segs.length - 1].push([sx(x), sy(v)]);
  });
  let termPath = '';
  if (term && coef(N)) termPath = pathOf(xs.map((x) => [sx(x), sy(coef(N) * basis(N, x))]));
  // readout
  let readout = '';
  if (w === 'triangle') {
    let err = 0; for (let i = 0; i <= 400; i++) { const x = -P + (2 * P * i) / 400; err = Math.max(err, Math.abs(S(x) - Math.abs(x))); }
    readout = `max error = ${err.toFixed(3)}  (no jump, so no overshoot)`;
  } else {
    const span = Math.min(P, (4 * P) / N);
    let peak = -Infinity;
    for (let i = 1; i <= 500; i++) {
      const d = (span * i) / 500;
      peak = Math.max(peak, w === 'square' ? S(d) : S(P - d));
    }
    const lim = w === 'square' ? 1 : P, jump = w === 'square' ? 2 : 2 * P;
    readout = `peak = ${peak.toFixed(3)} vs ${w === 'square' ? '1' : 'π ≈ 3.142'} · overshoot = ${((100 * (peak - lim)) / jump).toFixed(2)}% of jump`;
  }
  const names: Wave[] = ['square', 'sawtooth', 'triangle'];
  return (
    <div>
      <Stage w={320} h={200} label="Partial Fourier sums">
        <Axes x={xr} y={yr} box={box} grid={false} />
        {segs.filter((s) => s.length > 1).map((s, i) => <path key={i} d={pathOf(s)} fill="none" stroke="var(--muted)" strokeWidth={1.4} strokeDasharray="4 3" />)}
        {termPath && <path d={termPath} fill="none" stroke="var(--c3)" strokeWidth={1.1} opacity={0.85} />}
        <path d={sumPath} fill="none" stroke="var(--c2)" strokeWidth={1.9} />
        <text x={6} y={184} fontSize="9" fill="var(--fg)">S_N with N = {N}{term && coef(N) ? '  (orange: newest term)' : ''}</text>
        <text x={6} y={196} fontSize="9" fill="var(--c5)">{readout}</text>
      </Stage>
      <Controls>
        <Slider label="harmonics N" value={N} min={1} max={80} step={1} onChange={setN} format={(v) => String(v)} />
        {switchable && names.map((nm) => <Btn key={nm} active={w === nm} onClick={() => setW(nm)}>{nm}</Btn>)}
        <Btn active={term} onClick={() => setTerm(!term)}>newest term</Btn>
      </Controls>
    </div>
  );
}
