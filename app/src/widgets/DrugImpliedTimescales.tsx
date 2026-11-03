import { useMemo, useState } from 'react';
import { Btn, C, Controls, Stage, pathOf, rng, scale } from './_kit';

/**
 * Build Markov state models from one long simulated trajectory and plot the slowest implied timescale
 * t₂(τ) = −τ / ln λ₂(τ) against the lag time τ. The "simulation" is overdamped Langevin dynamics on a
 * symmetric 1D double well F(x) = h (x² − 1)² (k_BT = 1, D = 1). Three state definitions are compared:
 *   • many fine states (bins along x)       → t₂ plateaus quickly at the true relaxation time
 *   • 2 states split at the barrier (x = 0)  → plateaus, but only at longer lags
 *   • 2 states split in the wrong place      → badly underestimates t₂, converges very slowly
 * The dashed line is the relaxation time from the mean first-passage time between the minima.
 * A strip above shows a stretch of the trajectory. Nothing runs on mount (1.5 M steps take ~0.4 s in Node,
 * ~2 s on a phone): "Compute" runs the simulation and "New trajectory" draws another one.
 * props: { barrier?: number (h, default 4), fineStates?: number (default 30), badSplit?: number (x of the wrong
 *          boundary, default 0.6), steps?: number (Langevin steps, default 1500000) }
 */
const DT = 0.002, SAVE = 10, LAGS = [1, 2, 4, 8, 15, 25, 40, 60, 90, 130, 180, 250];

function t2(traj: Int16Array, n: number, lag: number) {
  const Cm = new Float64Array(n * n);
  for (let t = 0; t + lag < traj.length; t++) { const a = traj[t], b = traj[t + lag]; Cm[a * n + b] += 1; Cm[b * n + a] += 1; } // symmetrised (reversible) counts
  const rs = new Float64Array(n); let tot = 0;
  for (let i = 0; i < n; i++) { for (let j = 0; j < n; j++) rs[i] += Cm[i * n + j]; tot += rs[i]; }
  const pi = Array.from(rs, (r) => r / tot);
  const T = Array.from(Cm, (c, k) => (rs[Math.floor(k / n)] > 0 ? c / rs[Math.floor(k / n)] : 0));
  // power iteration for λ₂ in the π-weighted inner product, removing the stationary component
  let v = Array.from({ length: n }, (_, i) => Math.sin(1 + i * 1.7) + (i / n - 0.5));
  const w = new Float64Array(n);
  let lam = 0, prev = NaN;
  for (let it = 0; it < 400; it++) {
    let m = 0; for (let i = 0; i < n; i++) m += pi[i] * v[i];
    let num = 0, den = 0, nn = 0;
    for (let i = 0; i < n; i++) {
      let s = 0; for (let j = 0; j < n; j++) s += T[i * n + j] * (v[j] - m);
      w[i] = s; num += pi[i] * (v[i] - m) * s; den += pi[i] * (v[i] - m) ** 2; nn += pi[i] * s * s;
    }
    lam = num / den;
    const nrm = Math.sqrt(nn) || 1;
    v = Array.from(w, (x) => x / nrm);
    if (Math.abs(lam - prev) < 1e-12) break;
    prev = lam;
  }
  return lam > 0 && lam < 1 ? (-lag * DT * SAVE) / Math.log(lam) : NaN;
}

export default function DrugImpliedTimescales({ barrier = 4, fineStates = 30, badSplit = 0.6, steps = 1500000 }: {
  barrier?: number; fineStates?: number; badSplit?: number; steps?: number;
}) {
  const [seed, setSeed] = useState(3);
  const [sim, setSim] = useState<{ xs: Float32Array; curves: number[][]; key: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const key = `${barrier}|${fineStates}|${badSplit}|${steps}`;
  // reference: symmetric well, relaxation time = MFPT(−1 → +1) / 2, MFPT = ∫_{-1}^{1} dy e^{F(y)} ∫_{-∞}^{y} e^{−F(z)} dz
  const ref = useMemo(() => {
    const Fp = (z: number) => barrier * (z * z - 1) ** 2; const h = 0.002;
    let inner = 0; for (let z = -3; z < -1; z += h) inner += Math.exp(-Fp(z)) * h;
    let mfpt = 0; for (let y = -1; y < 1; y += h) { inner += Math.exp(-Fp(y)) * h; mfpt += Math.exp(Fp(y)) * inner * h; }
    return mfpt / 2;
  }, [barrier]);
  // The long trajectory is too slow to run on mount on a phone, so it runs only when asked.
  const compute = () => {
    setBusy(true);
    setTimeout(() => {
      const R = rng(seed); let x = -1; const xs = new Float32Array(Math.floor(steps / SAVE));
      for (let s = 0, k = 0; s < steps; s++) {
        x += -4 * barrier * x * (x * x - 1) * DT + Math.sqrt(2 * DT) * R.normal();
        if (s % SAVE === 0 && k < xs.length) xs[k++] = x;
      }
      const fine = Int16Array.from(xs, (v) => Math.max(0, Math.min(fineStates - 1, Math.floor(((v + 1.6) / 3.2) * fineStates))));
      const two = Int16Array.from(xs, (v) => (v < 0 ? 0 : 1));
      const bad = Int16Array.from(xs, (v) => (v < badSplit ? 0 : 1));
      const curves = [fine, two, bad].map((tr, i) => LAGS.map((l) => t2(tr, i === 0 ? fineStates : 2, l)));
      setSim({ xs, curves, key }); setSeed((v) => v + 1); setBusy(false);
    }, 30);
  };
  const res = sim && sim.key === key ? { ...sim, ref } : { xs: new Float32Array(0), curves: [] as number[][], ref };

  const lagT = LAGS.map((l) => l * DT * SAVE);
  const ymax = res.ref * 1.5;
  const sx = scale([0, lagT[lagT.length - 1]], [34, 312]); const sy = scale([0, ymax], [214, 74]);
  const names = [`${fineStates} fine states`, '2 states, split at barrier', `2 states, split at x = ${badSplit}`];
  const cols = [C[0], C[1], C[4]];
  const win = res.xs.subarray(0, 6000);
  const ty = scale([-1.8, 1.8], [58, 6]);
  return (
    <div>
      <Stage w={320} h={232} label="Implied timescales versus lag time">
        <rect x={34} y={4} width={278} height={56} fill="none" stroke="var(--grid)" />
        <path d={pathOf(Array.from(win).filter((_, i) => i % 10 === 0).map((v, i) => [34 + (i * 278) / 600, ty(v)]))} fill="none" stroke="var(--c2)" strokeWidth={0.8} />
        <text x={30} y={ty(1) + 3} fontSize="8" textAnchor="end" fill="var(--muted)">+1</text>
        <text x={30} y={ty(-1) + 3} fontSize="8" textAnchor="end" fill="var(--muted)">−1</text>
        <line x1={34} x2={312} y1={ty(badSplit)} y2={ty(badSplit)} stroke="var(--c5)" strokeDasharray="3 3" strokeWidth={0.8} />
        <line x1={34} x2={312} y1={214} y2={214} stroke="var(--fg)" strokeWidth={0.8} />
        <line x1={34} x2={34} y1={74} y2={214} stroke="var(--fg)" strokeWidth={0.8} />
        {[0, 0.5, 1].map((f) => <text key={f} x={31} y={sy(f * ymax) + 3} fontSize="8" textAnchor="end" fill="var(--muted)">{(f * ymax).toFixed(1)}</text>)}
        {[0, 1, 2, 3, 4, 5].filter((v) => v <= lagT[lagT.length - 1]).map((v) => <text key={v} x={sx(v)} y={223} fontSize="8" textAnchor="middle" fill="var(--muted)">{v}</text>)}
        <text x={312} y={231} fontSize="8.5" textAnchor="end" fill="var(--fg)">lag time τ →</text>
        <text x={38} y={70} fontSize="8.5" fill="var(--fg)">implied timescale t₂</text>
        <line x1={34} x2={312} y1={sy(res.ref)} y2={sy(res.ref)} stroke="var(--fg)" strokeDasharray="5 3" strokeWidth={1} />
        <line x1={34} x2={312} y1={sy(0)} y2={sy(0)} stroke="none" />
        <path d={`M34,214 L${sx(lagT[lagT.length - 1])},${sy(lagT[lagT.length - 1])}`} stroke="var(--grid)" strokeWidth={1} />
        {res.curves.map((cv, i) => (
          <g key={i}>
            <path d={pathOf(cv.map((v, j) => [sx(lagT[j]), sy(Math.min(ymax, v))] as [number, number]).filter(([, b]) => Number.isFinite(b)))} fill="none" stroke={cols[i]} strokeWidth={1.8} />
            {cv.map((v, j) => Number.isFinite(v) && <circle key={j} cx={sx(lagT[j])} cy={sy(Math.min(ymax, v))} r={2.2} fill={cols[i]} />)}
            <text x={308} y={84 + 10 * i} fontSize="8.5" textAnchor="end" fill={cols[i]}>{names[i]}</text>
          </g>
        ))}
        {!res.curves.length && <text x={173} y={150} fontSize="9" textAnchor="middle" fill="var(--muted)">{busy ? 'Simulating…' : `Press Compute to run ${(steps / 1e6).toLocaleString()} million Langevin steps`}</text>}
        <text x={308} y={sy(res.ref) - 3} fontSize="8" textAnchor="end" fill="var(--fg)">true relaxation time ≈ {res.ref.toFixed(2)}</text>
      </Stage>
      <Controls>
        <Btn onClick={compute}>{busy ? 'Computing…' : res.curves.length ? '🎲 New trajectory' : '▶ Compute'}</Btn>
        <span className="w-muted">grey diagonal: t₂ = τ (timescales below it can't be resolved)</span>
      </Controls>
    </div>
  );
}
