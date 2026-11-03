import { useMemo, useState } from 'react';
import { Btn, C, Controls, PlayPause, Slider, Stage, prefersReducedMotion, rng, scale, useFrame } from './_kit';

/**
 * Lloyd's algorithm for k-means on 2D points, one half-step at a time.
 * "Step" alternates (1) ASSIGN: every point joins its nearest centroid (shaded Voronoi cells),
 * and (2) UPDATE: every centroid moves to the mean of its points. The objective
 * J = Σ‖xᵢ − μ_c(i)‖² (within-cluster sum of squares) is shown and never increases.
 * When an assign step changes nothing the run has converged; its final J is added to the
 * "runs" list so that restarts from different seeds expose different local optima.
 * props: {
 *   k?: number                 number of clusters, 2–6 (default 4)
 *   dataset?: 'blobs'|'uneven'|'moons'   (default 'blobs': 4 well-separated blobs)
 *   init?: 'random'|'kmeans++' initial seeding (default 'random': k distinct data points chosen uniformly)
 *   seed?: number              initial seed for the initialization (default 3)
 *   controls?: boolean         show the k slider and init buttons (default true)
 * }
 * Points live in [-2, 2]².
 */
type V = [number, number];
function makeData(ds: string): V[] {
  const r = rng(11); const out: V[] = [];
  if (ds === 'moons') {
    for (let i = 0; i < 90; i++) {
      const a = Math.PI * r.u(); const s = i % 2;
      const x = s ? Math.cos(a) - 0.5 : 0.5 - Math.cos(a); const y = s ? Math.sin(a) - 0.3 : 0.3 - Math.sin(a);
      out.push([1.3 * x + 0.07 * r.normal(), 1.3 * y + 0.07 * r.normal()]);
    }
    return out;
  }
  const cs: [number, number, number, number][] = ds === 'uneven'
    ? [[-1, 0.2, 0.55, 60], [1.2, 1.1, 0.18, 12], [1.2, -1.1, 0.18, 12]]
    : [[-1.1, 1.0, 0.28, 22], [1.1, 1.1, 0.28, 22], [-1.0, -1.1, 0.28, 22], [1.2, -0.9, 0.28, 22]];
  for (const [cx, cy, s, m] of cs) for (let i = 0; i < m; i++) out.push([cx + s * r.normal(), cy + s * r.normal()]);
  return out.map(([x, y]) => [Math.max(-1.95, Math.min(1.95, x)), Math.max(-1.95, Math.min(1.95, y))]);
}
const d2 = (a: V, b: V) => (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2;
function initCentroids(pts: V[], k: number, how: string, seed: number): V[] {
  const r = rng(seed * 7919 + 1); const cs: V[] = [];
  if (how === 'kmeans++') {
    cs.push(pts[Math.floor(r.u() * pts.length)]);
    while (cs.length < k) {
      const w = pts.map((p) => Math.min(...cs.map((c) => d2(p, c))));
      let t = r.u() * w.reduce((s, v) => s + v, 0); let i = 0;
      while (i < pts.length - 1 && t > w[i]) { t -= w[i]; i++; }
      cs.push(pts[i]);
    }
    return cs.map((c) => [c[0], c[1]]);
  }
  const idx = new Set<number>();
  while (idx.size < k) idx.add(Math.floor(r.u() * pts.length));
  return [...idx].map((i) => [pts[i][0], pts[i][1]]);
}
const nearest = (p: V, cs: V[]) => cs.reduce((b, c, j) => (d2(p, c) < d2(p, cs[b]) ? j : b), 0);

export default function MlKMeans({ k: k0 = 4, dataset = 'blobs', init = 'random', seed = 3, controls = true }: {
  k?: number; dataset?: 'blobs' | 'uneven' | 'moons'; init?: 'random' | 'kmeans++'; seed?: number; controls?: boolean;
}) {
  const pts = useMemo(() => makeData(dataset), [dataset]);
  const [k, setK] = useState(Math.max(2, Math.min(6, Math.round(k0))));
  const [how, setHow] = useState(init);
  const [sd, setSd] = useState(seed);
  const [cs, setCs] = useState<V[]>(() => initCentroids(pts, k, how, sd));
  const [prev, setPrev] = useState<V[]>(cs);
  const [anim, setAnim] = useState(1);
  const [asg, setAsg] = useState<number[] | null>(null);
  const [phase, setPhase] = useState<'assign' | 'update'>('assign');
  const [done, setDone] = useState(false);
  const [iter, setIter] = useState(0);
  const [runs, setRuns] = useState<number[]>([]);
  const [running, setRunning] = useState(false);
  const [acc, setAcc] = useState(0);

  const restart = (kk = k, hh = how, ss = sd) => {
    const c = initCentroids(pts, kk, hh, ss);
    setCs(c); setPrev(c); setAnim(1); setAsg(null); setPhase('assign'); setDone(false); setIter(0);
  };
  const J = asg ? pts.reduce((s, p, i) => s + d2(p, cs[asg[i]]), 0) : NaN;
  const step = () => {
    if (done) return;
    if (phase === 'assign') {
      const a = pts.map((p) => nearest(p, cs));
      if (asg && a.every((v, i) => v === asg[i])) {
        setDone(true); setRunning(false);
        setRuns((r) => [...r, pts.reduce((s, p, i) => s + d2(p, cs[a[i]]), 0)].slice(-6));
        return;
      }
      setAsg(a); setPhase('update');
    } else if (asg) {
      const nc = cs.map((c, j) => {
        const m = pts.filter((_, i) => asg[i] === j);
        return m.length ? [m.reduce((s, p) => s + p[0], 0) / m.length, m.reduce((s, p) => s + p[1], 0) / m.length] as V : c;
      });
      setPrev(cs); setCs(nc); setAnim(prefersReducedMotion() ? 1 : 0); setPhase('assign'); setIter((n) => n + 1);
    }
  };
  useFrame((dt) => {
    if (anim < 1) setAnim((a) => Math.min(1, a + dt * 2.5));
    if (running) { const t = acc + dt; if (t > 0.6) { setAcc(0); step(); } else setAcc(t); }
  }, running || anim < 1);

  const disp: V[] = cs.map((c, j) => [prev[j][0] + (c[0] - prev[j][0]) * anim, prev[j][1] + (c[1] - prev[j][1]) * anim]);
  const L = 4, T = 5, S = 190; const sx = scale([-2, 2], [L, L + S]); const sy = scale([-2, 2], [T + S, T]);
  const N = 30; const h = 4 / N; const cells = [];
  for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) {
    const c = nearest([-2 + (i + 0.5) * h, -2 + (j + 0.5) * h], disp);
    cells.push(<rect key={i + '-' + j} x={sx(-2 + i * h)} y={sy(-2 + (j + 1) * h)} width={S / N + 0.3} height={S / N + 0.3} fill={C[c % 6]} opacity={0.12} />);
  }
  return (
    <div>
      <Stage w={320} h={200} label="k-means clustering with Lloyd's algorithm">
        <g pointerEvents="none">{cells}</g>
        <rect x={L} y={T} width={S} height={S} fill="none" stroke="var(--fg)" strokeWidth={0.6} />
        {asg && pts.map((p, i) => <line key={'l' + i} x1={sx(p[0])} y1={sy(p[1])} x2={sx(disp[asg[i]][0])} y2={sy(disp[asg[i]][1])} stroke={C[asg[i] % 6]} strokeWidth={0.4} opacity={0.35} />)}
        {pts.map((p, i) => <circle key={i} cx={sx(p[0])} cy={sy(p[1])} r={2.6} fill={asg ? C[asg[i] % 6] : 'var(--muted)'} stroke="var(--fg)" strokeWidth={0.3} />)}
        {disp.map((c, j) => <g key={'c' + j} transform={`translate(${sx(c[0])},${sy(c[1])})`}>
          <rect x={-5} y={-5} width={10} height={10} transform="rotate(45)" fill={C[j % 6]} stroke="var(--fg)" strokeWidth={1.4} />
        </g>)}
        <g fontSize="9" fill="var(--fg)">
          <text x={202} y={18}>k = {k} · {how === 'kmeans++' ? 'k-means++' : 'random'} seed {sd}</text>
          <text x={202} y={34}>iteration {iter}</text>
          <text x={202} y={50} fill={done ? 'var(--c1)' : 'var(--fg)'}>{done ? 'converged ✓' : `next: ${phase === 'assign' ? 'ASSIGN points' : 'UPDATE centroids'}`}</text>
          <text x={202} y={68}>J = {Number.isNaN(J) ? '—' : J.toFixed(2)}</text>
          <text x={202} y={88} fill="var(--muted)" fontSize="8">final J of past runs:</text>
          {runs.map((v, i) => {
            const best = Math.min(...runs);
            return <text key={i} x={202} y={100 + i * 11} fontSize="8.5" fill={v <= best + 1e-6 ? 'var(--c1)' : 'var(--c5)'}>run {i + 1}: {v.toFixed(2)}{v <= best + 1e-6 ? ' (best)' : ''}</text>;
          })}
          <text x={202} y={180} fill="var(--muted)" fontSize="8">◆ centroid · shading =</text>
          <text x={202} y={190} fill="var(--muted)" fontSize="8">nearest-centroid region</text>
        </g>
      </Stage>
      <Controls>
        <Btn onClick={step}>Step</Btn>
        <PlayPause running={running} set={(v) => setRunning(v && !done)} />
        <Btn onClick={() => { const s = sd + 1; setSd(s); setRunning(false); restart(k, how, s); }}>New seed</Btn>
        {controls && <>
          <Btn active={how === 'random'} onClick={() => { setHow('random'); setRuns([]); restart(k, 'random', sd); }}>random init</Btn>
          <Btn active={how === 'kmeans++'} onClick={() => { setHow('kmeans++'); setRuns([]); restart(k, 'kmeans++', sd); }}>k-means++</Btn>
          <Slider label="k" min={2} max={6} step={1} value={k} onChange={(v) => { setK(v); setRuns([]); setRunning(false); restart(v, how, sd); }} />
        </>}
      </Controls>
    </div>
  );
}
