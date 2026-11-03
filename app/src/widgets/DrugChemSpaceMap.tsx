import { useMemo, useRef, useState } from 'react';
import { Btn, C, Controls, PlayPause, Stage, prefersReducedMotion, rng, useFrame } from './_kit';

/**
 * Projecting a high-dimensional "chemical space" to 2D: PCA vs t-SNE, computed live.
 * Synthetic data: 4 compound series (colours), each a cluster in a 16-D descriptor space, plus two
 * high-variance "nuisance" directions (e.g. size, flexibility) shared by all series. PCA (linear, keeps directions of greatest variance)
 * is dominated by those nuisance directions, so series overlap; t-SNE (non-linear, keeps local neighbourhoods)
 * pulls the series apart, but its cluster sizes and between-cluster distances carry little meaning, and
 * different random starts give different maps.
 * props: { method?: 'pca'|'tsne' (default 'tsne'), perplexity?: number (default 8), seed?: number (default 3) }
 */
const N_PER = 18, K = 4, DIM = 16;

function makeData(seed: number) {
  const r = rng(seed);
  const centres = Array.from({ length: K }, () => Array.from({ length: DIM }, (_, d) => (d < 2 ? 0 : r.normal() * 2.2)));
  const X: number[][] = []; const lab: number[] = [];
  for (let k = 0; k < K; k++) for (let i = 0; i < N_PER; i++) {
    X.push(centres[k].map((c, d) => c + (d === 0 ? r.normal() * 8 : d === 1 ? r.normal() * 6.8 : r.normal() * 0.5)));
    lab.push(k);
  }
  return { X, lab };
}

function pca(X: number[][]) {
  const n = X.length, mu = X[0].map((_, d) => X.reduce((s, x) => s + x[d], 0) / n);
  const Z = X.map((x) => x.map((v, d) => v - mu[d]));
  const comps: number[][] = [];
  for (let c = 0; c < 2; c++) {
    let v = Z[0].map((_, d) => Math.cos(d + c));
    for (let it = 0; it < 100; it++) {
      const w = Z[0].map(() => 0);
      Z.forEach((z) => { const p = z.reduce((s, zi, d) => s + zi * v[d], 0); z.forEach((zi, d) => { w[d] += p * zi; }); });
      comps.forEach((u) => { const p = w.reduce((s, wi, d) => s + wi * u[d], 0); u.forEach((ui, d) => { w[d] -= p * ui; }); });
      const L = Math.hypot(...w) || 1; v = w.map((x) => x / L);
    }
    comps.push(v);
  }
  return Z.map((z) => comps.map((u) => z.reduce((s, zi, d) => s + zi * u[d], 0)));
}

function affinities(X: number[][], perp: number) {
  const n = X.length;
  const D = X.map((a) => X.map((b) => a.reduce((s, v, d) => s + (v - b[d]) ** 2, 0)));
  const P = D.map(() => new Array(n).fill(0));
  for (let i = 0; i < n; i++) {
    let lo = 0, hi = Infinity, beta = 1;
    for (let it = 0; it < 60; it++) {
      let sum = 0, H = 0;
      for (let j = 0; j < n; j++) if (j !== i) { P[i][j] = Math.exp(-D[i][j] * beta); sum += P[i][j]; }
      for (let j = 0; j < n; j++) if (j !== i) { P[i][j] /= sum || 1; if (P[i][j] > 1e-12) H -= P[i][j] * Math.log(P[i][j]); }
      if (H > Math.log(perp)) { lo = beta; beta = hi === Infinity ? beta * 2 : (beta + hi) / 2; } else { hi = beta; beta = (beta + lo) / 2; }
    }
  }
  return P.map((row, i) => row.map((p, j) => (p + P[j][i]) / (2 * n)));
}

export default function DrugChemSpaceMap({ method = 'tsne', perplexity = 8, seed = 3 }: { method?: 'pca' | 'tsne'; perplexity?: number; seed?: number }) {
  const { X, lab } = useMemo(() => makeData(seed), [seed]);
  const P = useMemo(() => affinities(X, perplexity), [X, perplexity]);
  const pc = useMemo(() => pca(X), [X]);
  const [mode, setMode] = useState(method);
  const [run, setRun] = useState(1);
  const [running, setRunning] = useState(!prefersReducedMotion());
  const st = useRef<{ Y: number[][]; V: number[][]; it: number; run: number } | null>(null);
  const [, tick] = useState(0);
  const init = (s: number) => { const r = rng(s * 7919); const Y = X.map(() => [r.normal() * 1e-2, r.normal() * 1e-2]); return { Y, V: Y.map(() => [0, 0]), it: 0, run: s }; };
  if (!st.current || st.current.run !== run) st.current = init(run);
  const step = () => {
    const s = st.current!; const { Y, V } = s; const n = Y.length;
    const ex = s.it < 80 ? 4 : 1, mom = s.it < 80 ? 0.5 : 0.8;
    const W = Y.map((a) => Y.map((b) => 1 / (1 + (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2)));
    let Zs = 0; W.forEach((row, i) => row.forEach((w, j) => { if (i !== j) Zs += w; }));
    for (let i = 0; i < n; i++) {
      let gx = 0, gy = 0;
      for (let j = 0; j < n; j++) if (j !== i) { const f = 4 * (ex * P[i][j] - W[i][j] / Zs) * W[i][j]; gx += f * (Y[i][0] - Y[j][0]); gy += f * (Y[i][1] - Y[j][1]); }
      V[i][0] = mom * V[i][0] - 60 * gx; V[i][1] = mom * V[i][1] - 60 * gy;
    }
    Y.forEach((y, i) => { y[0] += V[i][0]; y[1] += V[i][1]; });
    s.it++;
  };
  if (prefersReducedMotion() && st.current.it === 0) for (let k = 0; k < 500; k++) step();
  useFrame(() => { if (mode !== 'tsne' || st.current!.it >= 500) return; for (let k = 0; k < 4; k++) step(); tick((v) => v + 1); }, running && mode === 'tsne');

  const Y = mode === 'pca' ? pc : st.current.Y;
  const xs = Y.map((p) => p[0]), ys = Y.map((p) => p[1]);
  const [x0, x1, y0, y1] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
  const sc = Math.min(296 / (x1 - x0 || 1), 160 / (y1 - y0 || 1));
  const px = (x: number) => 160 + (x - (x0 + x1) / 2) * sc, py = (y: number) => 96 - (y - (y0 + y1) / 2) * sc;
  return (
    <div>
      <Stage w={320} h={196} label={`Chemical space map by ${mode}`}>
        <rect x={2} y={8} width={316} height={176} rx={6} fill="none" stroke="var(--grid)" />
        {Y.map((p, i) => <circle key={i} cx={px(p[0])} cy={py(p[1])} r={3.6} fill={C[[1, 2, 3, 4][lab[i]]]} opacity={0.85} />)}
        <text x={8} y={20} fontSize="9" fill="var(--muted)">
          {mode === 'pca' ? 'PCA: PC1 (x) vs PC2 (y) — linear projection' : `t-SNE, perplexity ${perplexity} · iteration ${st.current.it}${st.current.it < 80 ? ' (early exaggeration)' : ''}`}
        </text>
        <text x={160} y={194} textAnchor="middle" fontSize="8.5" fill="var(--muted)">{K} series × {N_PER} molecules, {DIM} descriptors each (synthetic)</text>
      </Stage>
      <Controls>
        <Btn active={mode === 'pca'} onClick={() => setMode('pca')}>PCA</Btn>
        <Btn active={mode === 'tsne'} onClick={() => setMode('tsne')}>t-SNE</Btn>
        {mode === 'tsne' && <PlayPause running={running} set={setRunning} />}
        {mode === 'tsne' && <Btn onClick={() => { setRun((r) => r + 1); setRunning(true); }}>New random start</Btn>}
      </Controls>
    </div>
  );
}
