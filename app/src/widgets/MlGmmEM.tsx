import { useMemo, useState } from 'react';
import { Btn, C, Controls, PlayPause, Stage, pathOf, rng, scale, useFrame } from './_kit';

/**
 * EM for a 2D Gaussian mixture. "Step" alternates the E-step (each point's colour becomes a blend of
 * the component colours, weighted by its responsibilities r_ik) and the M-step (weights π_k, means μ_k
 * and full covariances Σ_k are re-estimated from the responsibility-weighted points). Ellipses are the
 * 1σ and 2σ contours of each component. The plot at bottom right tracks the log-likelihood
 * Σᵢ log Σ_k π_k N(xᵢ | μ_k, Σ_k) after every M-step; EM never decreases it. "New init" restarts from
 * different random means (initial covariances 0.5·I, equal weights), which can reach a different local maximum.
 * props: {
 *   K?: number         components, 2 or 3 (default 3)
 *   seed?: number      initialization seed (default 1)
 *   dataset?: 'mixed'|'blobs'   'mixed' has elongated, overlapping clusters (default 'mixed')
 * }
 */
type V = [number, number];
type Comp = { pi: number; mu: V; S: [number, number, number] }; // S = [sxx, sxy, syy]
function makeData(ds: string): V[] {
  const r = rng(21); const out: V[] = [];
  const specs: [number, number, number, number, number, number][] = ds === 'blobs'
    ? [[-1.1, 0.9, 0.3, 0, 0.3, 40], [1.1, 0.9, 0.3, 0, 0.3, 40], [0, -1.0, 0.3, 0, 0.3, 40]]
    : [[-0.6, 0.2, 0.9, 0.62, 0.25, 60], [1.2, 1.2, 0.3, 0, 0.3, 35], [1.0, -1.2, 0.45, -0.2, 0.2, 35]];
  for (const [mx, my, a, b, c, m] of specs) for (let i = 0; i < m; i++) {
    const z1 = r.normal(), z2 = r.normal(); // x = μ + L z with L lower-triangular-ish shape [[a,0],[b,c]]
    out.push([Math.max(-2.4, Math.min(2.4, mx + a * z1)), Math.max(-2.4, Math.min(2.4, my + b * z1 + c * z2))]);
  }
  return out;
}
const pdf = (x: V, c: Comp) => {
  const [a, b, d] = c.S; const det = a * d - b * b; const dx = x[0] - c.mu[0], dy = x[1] - c.mu[1];
  const q = (d * dx * dx - 2 * b * dx * dy + a * dy * dy) / det;
  return Math.exp(-0.5 * q) / (2 * Math.PI * Math.sqrt(det));
};
const loglik = (pts: V[], cs: Comp[]) => pts.reduce((s, p) => s + Math.log(cs.reduce((t, c) => t + c.pi * pdf(p, c), 0) + 1e-300), 0);
function initComps(pts: V[], K: number, seed: number): Comp[] {
  const r = rng(seed * 104729 + 7); const idx = new Set<number>();
  while (idx.size < K) idx.add(Math.floor(r.u() * pts.length));
  return [...idx].map((i) => ({ pi: 1 / K, mu: [pts[i][0], pts[i][1]], S: [0.5, 0, 0.5] }));
}
const ell = (c: Comp) => {
  const [a, b, d] = c.S; const tr = a + d, disc = Math.sqrt(Math.max(0, ((a - d) / 2) ** 2 + b * b));
  return { l1: tr / 2 + disc, l2: Math.max(1e-9, tr / 2 - disc), th: 0.5 * Math.atan2(2 * b, a - d) };
};

export default function MlGmmEM({ K: K0 = 3, seed = 1, dataset = 'mixed' }: { K?: number; seed?: number; dataset?: 'mixed' | 'blobs' }) {
  const K = K0 === 2 ? 2 : 3;
  const pts = useMemo(() => makeData(dataset), [dataset]);
  const [sd, setSd] = useState(seed);
  const [cs, setCs] = useState<Comp[]>(() => initComps(pts, K, seed));
  const [resp, setResp] = useState<number[][] | null>(null);
  const [phase, setPhase] = useState<'E' | 'M'>('E');
  const [ll, setLl] = useState<number[]>(() => [loglik(pts, initComps(pts, K, seed))]);
  const [running, setRunning] = useState(false);
  const [acc, setAcc] = useState(0);
  const done = ll.length > 2 && Math.abs(ll[ll.length - 1] - ll[ll.length - 2]) < 1e-3;

  const restart = (s: number) => { const c = initComps(pts, K, s); setCs(c); setResp(null); setPhase('E'); setLl([loglik(pts, c)]); setRunning(false); };
  const step = () => {
    if (phase === 'E') {
      setResp(pts.map((p) => { const w = cs.map((c) => c.pi * pdf(p, c)); const z = w.reduce((s, v) => s + v, 0) || 1; return w.map((v) => v / z); }));
      setPhase('M');
    } else if (resp) {
      const nc: Comp[] = cs.map((_, k) => {
        const Nk = resp.reduce((s, r) => s + r[k], 0) + 1e-9;
        const mu: V = [resp.reduce((s, r, i) => s + r[k] * pts[i][0], 0) / Nk, resp.reduce((s, r, i) => s + r[k] * pts[i][1], 0) / Nk];
        let a = 0, b = 0, d = 0;
        resp.forEach((r, i) => { const dx = pts[i][0] - mu[0], dy = pts[i][1] - mu[1]; a += r[k] * dx * dx; b += r[k] * dx * dy; d += r[k] * dy * dy; });
        const reg = 1e-3; // keeps Σ_k invertible (guards against the collapse singularity)
        return { pi: Nk / pts.length, mu, S: [a / Nk + reg, b / Nk, d / Nk + reg] };
      });
      setCs(nc); setPhase('E'); setLl((h) => [...h, loglik(pts, nc)].slice(-60));
    }
  };
  useFrame((dt) => {
    if (done) { setRunning(false); return; }
    const t = acc + dt; if (t > 0.35) { setAcc(0); step(); } else setAcc(t);
  }, running);

  const colour = (r: number[]) => {
    const pc = (v: number) => (100 * v).toFixed(0) + '%';
    if (K === 2) return `color-mix(in srgb, ${C[1]} ${pc(r[0])}, ${C[2]})`;
    const s01 = r[0] + r[1];
    const inner = `color-mix(in srgb, ${C[1]} ${pc(s01 > 1e-9 ? r[0] / s01 : 0.5)}, ${C[2]})`;
    return `color-mix(in srgb, ${C[3]} ${pc(r[2])}, ${inner})`;
  };
  const compCol = [C[1], C[2], C[3]];
  const L = 4, T = 5, S = 190, R = 2.5; const sx = scale([-R, R], [L, L + S]); const sy = scale([-R, R], [T + S, T]); const px = S / (2 * R);
  const lo = Math.min(...ll), hi = Math.max(...ll); const bx = scale([0, Math.max(5, ll.length - 1)], [210, 314]); const by = scale([lo, hi + 1e-9], [188, 120]);
  return (
    <div>
      <Stage w={320} h={200} label="Expectation-maximization for a Gaussian mixture">
        <clipPath id="mlgmm-clip"><rect x={L} y={T} width={S} height={S} /></clipPath>
        <rect x={L} y={T} width={S} height={S} fill="none" stroke="var(--fg)" strokeWidth={0.6} />
        <g clipPath="url(#mlgmm-clip)">
          {pts.map((p, i) => <circle key={i} cx={sx(p[0])} cy={sy(p[1])} r={2.6} fill={resp ? colour(resp[i]) : 'var(--muted)'} stroke="var(--fg)" strokeWidth={0.3} />)}
          {cs.map((c, k) => {
            const e = ell(c);
            return <g key={k} transform={`translate(${sx(c.mu[0])},${sy(c.mu[1])}) rotate(${(-e.th * 180) / Math.PI})`}>
              {[1, 2].map((m) => <ellipse key={m} rx={m * Math.sqrt(e.l1) * px} ry={m * Math.sqrt(e.l2) * px} fill="none" stroke={compCol[k]} strokeWidth={m === 1 ? 1.8 : 1} strokeDasharray={m === 2 ? '3 2' : undefined} />)}
              <circle r={3.2} fill={compCol[k]} stroke="var(--fg)" strokeWidth={1} />
            </g>;
          })}
        </g>
        <g fontSize="8.5" fill="var(--fg)">
          <text x={206} y={16}>K = {K} · init seed {sd}</text>
          <text x={206} y={30} fill={done ? 'var(--c1)' : 'var(--fg)'}>{done ? 'converged ✓' : `next: ${phase === 'E' ? 'E-step (responsibilities)' : 'M-step (refit)'}`}</text>
          <text x={206} y={44}>log-lik = {ll[ll.length - 1].toFixed(2)}</text>
          {cs.map((c, k) => <text key={k} x={206} y={60 + k * 12} fill={compCol[k]}>π{k + 1} = {c.pi.toFixed(2)}  μ = ({c.mu[0].toFixed(1)}, {c.mu[1].toFixed(1)})</text>)}
          <text x={210} y={114} fill="var(--muted)" fontSize="8">log-likelihood per M-step</text>
          <line x1={210} x2={314} y1={188} y2={188} stroke="var(--fg)" strokeWidth={0.5} />
          <line x1={210} x2={210} y1={118} y2={188} stroke="var(--fg)" strokeWidth={0.5} />
          <path d={pathOf(ll.map((v, i) => [bx(i), by(v)]))} fill="none" stroke="var(--c1)" strokeWidth={1.4} />
          {ll.map((v, i) => <circle key={i} cx={bx(i)} cy={by(v)} r={1.5} fill="var(--c1)" />)}
        </g>
      </Stage>
      <Controls>
        <Btn onClick={step}>Step</Btn>
        <PlayPause running={running} set={(v) => setRunning(v && !done)} />
        <Btn onClick={() => { const s = sd + 1; setSd(s); restart(s); }}>New init</Btn>
      </Controls>
    </div>
  );
}
