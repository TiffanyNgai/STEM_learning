import { useMemo, useState } from 'react';
import { Btn, Controls, PlayPause, Slider, Stage, pathOf, scale, useFrame, prefersReducedMotion } from './_kit';

/**
 * A REAL (tiny) Hartree–Fock self-consistent-field calculation on the helium atom,
 * animated as the SCF loop: guess density P → build Fock matrix F(P) → solve FC = SCε → new P → repeat.
 * Basis: n even-tempered s-type Gaussians (exponents optimised for He). Energies in hartree.
 * props: { nBasis?: 1|2|3|4|6 (default 3), mixing?: number in (0,1] (default 0.5; P ← (1−λ)P_old + λP_new),
 *          showBasisPicker?: boolean (default true), showMixing?: boolean (default true), iterations?: number (default 14) }
 */
const BASES: Record<number, number[]> = {
  1: [0.768], 2: [0.546, 4.3], 3: [0.407, 2.28, 12.8], 4: [0.319, 1.47, 6.78, 31.2], 6: [0.238, 0.86, 3.1, 11.2, 40.5, 146],
};
const HF_LIMIT = -2.86168; const EXACT = -2.90372;
type M = number[][];

function jacobi(A: M) {
  const n = A.length; const a = A.map((r) => r.slice()); const V: M = a.map((_, i) => a.map((_, j) => (i === j ? 1 : 0)));
  for (let sweep = 0; sweep < 60; sweep++) {
    let off = 0; for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) off += a[i][j] ** 2;
    if (off < 1e-22) break;
    for (let p = 0; p < n; p++) for (let q = p + 1; q < n; q++) {
      if (Math.abs(a[p][q]) < 1e-300) continue;
      const th = (a[q][q] - a[p][p]) / (2 * a[p][q]);
      const t = Math.sign(th || 1) / (Math.abs(th) + Math.sqrt(th * th + 1)); const c = 1 / Math.sqrt(t * t + 1), s = t * c;
      for (let k = 0; k < n; k++) { const x = a[k][p], y = a[k][q]; a[k][p] = c * x - s * y; a[k][q] = s * x + c * y; }
      for (let k = 0; k < n; k++) { const x = a[p][k], y = a[q][k]; a[p][k] = c * x - s * y; a[q][k] = s * x + c * y; }
      for (let k = 0; k < n; k++) { const x = V[k][p], y = V[k][q]; V[k][p] = c * x - s * y; V[k][q] = s * x + c * y; }
    }
  }
  return { w: a.map((r, i) => r[i]), V };
}

/** Run closed-shell HF for He; returns energy at each iteration and orbital energy. */
function heliumSCF(al: number[], mix: number, iters: number) {
  const n = al.length, Z = 2, PI = Math.PI; const N = al.map((a) => (2 * a / PI) ** 0.75);
  const S: M = [], H: M = [];
  for (let i = 0; i < n; i++) { S[i] = []; H[i] = []; for (let j = 0; j < n; j++) {
    const p = al[i] + al[j]; const s = N[i] * N[j] * (PI / p) ** 1.5;
    S[i][j] = s; H[i][j] = (3 * al[i] * al[j] / p) * s - Z * N[i] * N[j] * 2 * PI / p;
  } }
  const eri = (i: number, j: number, k: number, l: number) => {
    const p = al[i] + al[j], q = al[k] + al[l]; return N[i] * N[j] * N[k] * N[l] * 2 * PI ** 2.5 / (p * q * Math.sqrt(p + q));
  };
  const { w, V } = jacobi(S);
  const X = S.map((_, i) => S.map((_, j) => { let s = 0; for (let k = 0; k < n; k++) s += V[i][k] * V[j][k] / Math.sqrt(w[k]); return s; }));
  const mm = (A: M, B: M) => A.map((_, i) => B[0].map((_, j) => A[i].reduce((s, _x, k) => s + A[i][k] * B[k][j], 0)));
  const solve = (F: M) => {
    const r = jacobi(mm(mm(X, F), X)); let m = 0; for (let k = 1; k < n; k++) if (r.w[k] < r.w[m]) m = k;
    const cp = r.V.map((row) => row[m]); return { e: r.w[m], c: X.map((row) => row.reduce((s, x, k) => s + x * cp[k], 0)) };
  };
  const dens = (c: number[]) => c.map((a) => c.map((b) => 2 * a * b));
  const fock = (P: M) => H.map((_, i) => H.map((_x, j) => { let f = H[i][j];
    for (let k = 0; k < n; k++) for (let l = 0; l < n; l++) f += P[k][l] * (eri(i, j, k, l) - 0.5 * eri(i, k, j, l)); return f; }));
  let P = dens(solve(H).c); const E: number[] = []; const eps: number[] = [];
  for (let it = 0; it < iters; it++) {
    const F = fock(P); let e = 0; for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) e += 0.5 * P[i][j] * (H[i][j] + F[i][j]);
    E.push(e); const sol = solve(F); eps.push(sol.e); const Pn = dens(sol.c);
    P = P.map((r, i) => r.map((x, j) => (1 - mix) * x + mix * Pn[i][j]));
  }
  return { E, eps };
}

const STEPS = ['Guess density P', 'Build Fock F(P)', 'Solve FC = SCε', 'New P; converged?'];

export default function SCFLoop({ nBasis = 3, mixing = 0.5, showBasisPicker = true, showMixing = true, iterations = 14 }: {
  nBasis?: number; mixing?: number; showBasisPicker?: boolean; showMixing?: boolean; iterations?: number;
}) {
  const [nb, setNb] = useState(BASES[nBasis] ? nBasis : 3);
  const [mix, setMix] = useState(mixing);
  const [phase, setPhase] = useState(0); // continuous: iteration*4 + step
  const [running, setRunning] = useState(!prefersReducedMotion());
  const { E, eps } = useMemo(() => heliumSCF(BASES[nb], mix, iterations), [nb, mix, iterations]);
  const total = iterations * 4;
  useFrame((dt) => setPhase((p) => (p + dt * 2.2 >= total ? total - 0.001 : p + dt * 2.2)), running && phase < total - 0.01);
  const it = Math.floor(phase / 4); const step = Math.floor(phase % 4);
  const shown = E.slice(0, it + 1);
  const dE = it > 0 ? Math.abs(E[it] - E[it - 1]) : NaN;
  // cycle diagram: four stacked boxes with a return arrow
  const nodes = STEPS.map((s, i) => ({ s, x: 82, y: 20 + i * 38 }));
  const tokY = 20 + (phase % 4) * 38;
  // energy plot
  const box: [number, number, number, number] = [178, 22, 314, 178];
  const yr: [number, number] = [-2.93, -2.27];
  const sx = scale([0, iterations - 1], [box[0], box[2]]); const sy = scale(yr, [box[3], box[1]]);
  const reset = () => { setPhase(0); setRunning(true); };
  return (
    <div>
      <Stage w={320} h={200} label="Hartree–Fock self-consistent field loop for helium">
        <defs><marker id="scf-arr" viewBox="0 0 6 6" refX="5" refY="3" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0L6,3L0,6z" fill="var(--muted)" /></marker></defs>
        {nodes.slice(0, 3).map((n, i) => (
          <line key={i} x1={n.x} x2={n.x} y1={n.y + 11} y2={n.y + 26} stroke="var(--muted)" markerEnd="url(#scf-arr)" />
        ))}
        <path d="M18,134 H8 V20 H16" fill="none" stroke="var(--muted)" strokeDasharray="3 2" markerEnd="url(#scf-arr)" />
        <text x={4} y={80} fontSize="8" fill="var(--muted)" transform="rotate(-90 10 80)">repeat</text>
        {nodes.map((n, i) => (
          <g key={i}>
            <rect x={n.x - 62} y={n.y - 11} width={124} height={22} rx={6} fill={i === step ? 'var(--c2)' : 'var(--surface)'} stroke="var(--c2)" strokeWidth={1} />
            <text x={n.x} y={n.y + 3.5} fontSize="9.5" textAnchor="middle" fill={i === step ? 'var(--surface)' : 'var(--fg)'}>{n.s}</text>
          </g>
        ))}
        <circle cx={150} cy={tokY} r={4} fill="var(--c3)" />
        <text x={82} y={176} fontSize="10" textAnchor="middle" fill="var(--fg)">iteration <tspan fill="var(--c2)" fontWeight="bold">{it}</tspan></text>
        <text x={4} y={196} fontSize="9" fill="var(--muted)">He atom · {nb} Gaussian{nb > 1 ? 's' : ''} · λ = {mix.toFixed(2)}</text>
        {/* plot */}
        <line x1={box[0]} x2={box[0]} y1={box[1]} y2={box[3]} stroke="var(--fg)" strokeWidth={0.8} />
        <line x1={box[0]} x2={box[2]} y1={box[3]} y2={box[3]} stroke="var(--fg)" strokeWidth={0.8} />
        {[-2.3, -2.5, -2.7, -2.9].map((v) => (
          <text key={v} x={box[0] - 2} y={sy(v) + 3} fontSize="8" textAnchor="end" fill="var(--muted)">{v.toFixed(1)}</text>
        ))}
        <line x1={box[0]} x2={box[2]} y1={sy(HF_LIMIT)} y2={sy(HF_LIMIT)} stroke="var(--c4)" strokeDasharray="3 2" />
        <text x={box[2]} y={sy(HF_LIMIT) - 2} fontSize="8" textAnchor="end" fill="var(--c4)">HF limit −2.862</text>
        <line x1={box[0]} x2={box[2]} y1={sy(EXACT)} y2={sy(EXACT)} stroke="var(--c5)" strokeDasharray="3 2" />
        <text x={box[2]} y={sy(EXACT) + 9} fontSize="8" textAnchor="end" fill="var(--c5)">exact −2.904</text>
        <path d={pathOf(shown.map((e, i) => [sx(i), sy(e)]))} fill="none" stroke="var(--c1)" strokeWidth={1.5} />
        {shown.map((e, i) => <circle key={i} cx={sx(i)} cy={sy(e)} r={2.4} fill="var(--c1)" />)}
        <text x={box[0] + 4} y={14} fontSize="9" fill="var(--fg)">E = {E[it].toFixed(5)} Eₕ</text>
        <text x={box[0] + 4} y={box[3] + 12} fontSize="8" fill="var(--muted)">
          {it > 0 ? `|ΔE| = ${dE.toExponential(1)}` : 'iteration →'}  ε₁ₛ = {eps[it].toFixed(3)}
        </text>
      </Stage>
      <Controls>
        <PlayPause running={running} set={setRunning} />
        <Btn onClick={reset}>↺ Restart</Btn>
        {showBasisPicker && [1, 2, 3, 4, 6].map((k) => (
          <Btn key={k} active={k === nb} onClick={() => { setNb(k); reset(); }}>{k}G</Btn>
        ))}
        {showMixing && <Slider label="mixing λ" min={0.1} max={1} step={0.05} value={mix} onChange={(v) => { setMix(v); reset(); }} />}
      </Controls>
    </div>
  );
}
