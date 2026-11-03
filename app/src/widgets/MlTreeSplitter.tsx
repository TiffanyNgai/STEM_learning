import { useMemo, useState, type ReactElement } from 'react';
import { Btn, Controls, Slider, Stage, pathOf, rng, scale } from './_kit';

/**
 * Classification trees on 2D data in [0, 1]² (two classes, ● blue and ■ orange).
 * Three modes:
 *  - 'manual': choose a feature and a threshold for one split; the right panel plots the weighted child
 *    impurity against the threshold (dashed line = parent impurity) and marks the best threshold.
 *  - 'grow':   greedy CART (best impurity decrease at every node) grown to a maximum depth; regions are
 *    shaded by their majority class and every split line is drawn.
 *  - 'forest': a random forest of B trees, each grown on a bootstrap sample choosing the split feature at random
 *    (m = 1 of 2) at every node; shading shows the fraction of trees voting ●.
 * props: {
 *   mode?: 'manual'|'grow'|'forest'   (default 'grow')
 *   dataset?: 'blobs'|'xor'|'circle'|'diagonal'   (default 'blobs')
 *   criterion?: 'gini'|'entropy'   impurity measure (default 'gini'; entropy in bits)
 *   depth?: number                 maximum depth (default 2 in grow, 8 in forest)
 *   maxDepth?: number              depth slider maximum (default 8)
 *   trees?: number                 forest size B (default 10, slider up to 60)
 *   controls?: boolean             show dataset & criterion buttons (default true)
 * }
 */
type Pt = [number, number, number];
type Node = { leaf: true; p: number } | { leaf: false; f: number; t: number; l: Node; r: Node };
const imp = (crit: string, a: number, n: number) => {
  if (!n) return 0; const p = a / n;
  if (crit === 'entropy') return p <= 0 || p >= 1 ? 0 : -(p * Math.log2(p) + (1 - p) * Math.log2(1 - p));
  return 2 * p * (1 - p);
};
function makeData(ds: string): Pt[] {
  const r = rng(ds.length * 7 + 1); const out: Pt[] = [];
  for (let i = 0; i < 80; i++) {
    let x = r.u(), y = r.u(), c = 0;
    if (ds === 'blobs') { c = i % 2; const m = c ? 0.68 : 0.32; x = m + 0.15 * r.normal(); y = m + 0.15 * r.normal(); }
    else if (ds === 'xor') c = +((x > 0.5) !== (y > 0.5));
    else if (ds === 'circle') c = +((x - 0.5) ** 2 + (y - 0.5) ** 2 < 0.085);
    else c = +(y > x);
    if (ds !== 'blobs' && r.u() < 0.05) c = 1 - c;
    out.push([Math.min(0.99, Math.max(0.01, x)), Math.min(0.99, Math.max(0.01, y)), c]);
  }
  return out;
}
/** Best threshold on feature f for the points idx: returns [weighted child impurity, threshold]. */
function bestOn(D: Pt[], idx: number[], f: number, crit: string): [number, number] {
  const s = [...idx].sort((a, b) => D[a][f] - D[b][f]); const n = s.length; const tot = s.reduce((q, i) => q + D[i][2], 0);
  let best: [number, number] = [Infinity, NaN]; let a = 0;
  for (let k = 1; k < n; k++) {
    a += D[s[k - 1]][2];
    if (D[s[k]][f] === D[s[k - 1]][f]) continue;
    const v = (k * imp(crit, a, k) + (n - k) * imp(crit, tot - a, n - k)) / n;
    if (v < best[0] - 1e-12) best = [v, (D[s[k]][f] + D[s[k - 1]][f]) / 2];
  }
  return best;
}
function grow(D: Pt[], idx: number[], depth: number, crit: string, pick?: () => number): Node {
  const a = idx.reduce((q, i) => q + D[i][2], 0); const p = idx.length ? a / idx.length : 0.5;
  if (depth <= 0 || a === 0 || a === idx.length) return { leaf: true, p };
  const fs = pick ? [pick()] : [0, 1];
  let best: [number, number, number] = [Infinity, NaN, 0];
  for (const f of fs) { const [v, t] = bestOn(D, idx, f, crit); if (v < best[0]) best = [v, t, f]; }
  if (!Number.isFinite(best[0])) return { leaf: true, p };
  const [, t, f] = best;
  return { leaf: false, f, t, l: grow(D, idx.filter((i) => D[i][f] <= t), depth - 1, crit, pick), r: grow(D, idx.filter((i) => D[i][f] > t), depth - 1, crit, pick) };
}
const predict = (n: Node, x: number, y: number): number => (n.leaf ? n.p : predict((n.f ? y : x) <= n.t ? n.l : n.r, x, y));
const leaves = (n: Node): number => (n.leaf ? 1 : leaves(n.l) + leaves(n.r));

export default function MlTreeSplitter({ mode = 'grow', dataset = 'blobs', criterion = 'gini', depth, maxDepth = 8, trees = 10, controls = true }: {
  mode?: 'manual' | 'grow' | 'forest'; dataset?: 'blobs' | 'xor' | 'circle' | 'diagonal'; criterion?: 'gini' | 'entropy';
  depth?: number; maxDepth?: number; trees?: number; controls?: boolean;
}) {
  const [ds, setDs] = useState(dataset);
  const [crit, setCrit] = useState(criterion);
  const [dep, setDep] = useState(depth ?? (mode === 'forest' ? 8 : 2));
  const [B, setB] = useState(trees);
  const [feat, setFeat] = useState(0);
  const [thr, setThr] = useState(0.35);
  const D = useMemo(() => makeData(ds), [ds]);
  const all = D.map((_, i) => i);

  const model = useMemo(() => {
    if (mode === 'grow') { const t = grow(D, all, dep, crit); return { pred: (x: number, y: number) => predict(t, x, y), tree: t }; }
    if (mode === 'forest') {
      const r = rng(17); const ts: Node[] = [];
      for (let b = 0; b < B; b++) { const boot = D.map(() => Math.floor(r.u() * D.length)); ts.push(grow(D, boot, dep, crit, () => (r.u() < 0.5 ? 0 : 1))); }
      return { pred: (x: number, y: number) => ts.reduce((s, t) => s + +(predict(t, x, y) > 0.5), 0) / ts.length, tree: null };
    }
    return null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [D, mode, dep, crit, B]);

  const L = 4, T = 4, S = 180; const sx = scale([0, 1], [L, L + S]); const sy = scale([0, 1], [T + S, T]);
  const N = 45; const cells = [];
  if (model) for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) {
    const p = model.pred((i + 0.5) / N, (j + 0.5) / N);
    cells.push(<rect key={i + '-' + j} x={sx(i / N)} y={sy((j + 1) / N)} width={S / N + 0.3} height={S / N + 0.3} fill={p > 0.5 ? 'var(--c2)' : 'var(--c3)'} opacity={mode === 'forest' ? 0.08 + 0.5 * Math.abs(p - 0.5) : 0.25} />);
  }
  const lines: ReactElement[] = [];
  const drawSplits = (n: Node, x0: number, x1: number, y0: number, y1: number) => {
    if (n.leaf) return;
    lines.push(n.f === 0 ? <line key={lines.length} x1={sx(n.t)} x2={sx(n.t)} y1={sy(y0)} y2={sy(y1)} stroke="var(--fg)" strokeWidth={1.2} />
      : <line key={lines.length} y1={sy(n.t)} y2={sy(n.t)} x1={sx(x0)} x2={sx(x1)} stroke="var(--fg)" strokeWidth={1.2} />);
    if (n.f === 0) { drawSplits(n.l, x0, n.t, y0, y1); drawSplits(n.r, n.t, x1, y0, y1); } else { drawSplits(n.l, x0, x1, y0, n.t); drawSplits(n.r, x0, x1, n.t, y1); }
  };
  if (model?.tree) drawSplits(model.tree, 0, 1, 0, 1);
  const acc = model ? D.filter(([x, y, c]) => +(model.pred(x, y) > 0.5) === c).length / D.length : 0;

  // manual-split panel
  const tot = D.reduce((q, p) => q + p[2], 0); const parent = imp(crit, tot, D.length);
  const child = (t: number) => {
    const l = D.filter((p) => p[feat] <= t); const a = l.reduce((q, p) => q + p[2], 0);
    return { v: (l.length * imp(crit, a, l.length) + (D.length - l.length) * imp(crit, tot - a, D.length - l.length)) / D.length, nl: l.length, al: a };
  };
  const cur = child(thr); const [bv, bt] = bestOn(D, all, feat, crit);
  const PL = 206, PR = 314, PT = 20, PB = 120; const px = scale([0, 1], [PL, PR]); const yMax = crit === 'entropy' ? 1 : 0.5; const py = scale([0, yMax], [PB, PT]);
  const curve = pathOf(Array.from({ length: 101 }, (_, i) => [px(i / 100), py(child(i / 100).v)] as [number, number]));

  return (
    <div>
      <Stage label="Decision tree partitions of the plane">
        {cells}
        {lines}
        {mode === 'manual' && (feat === 0 ? <line x1={sx(thr)} x2={sx(thr)} y1={T} y2={T + S} stroke="var(--c4)" strokeWidth={2} /> : <line y1={sy(thr)} y2={sy(thr)} x1={L} x2={L + S} stroke="var(--c4)" strokeWidth={2} />)}
        <rect x={L} y={T} width={S} height={S} fill="none" stroke="var(--fg)" strokeWidth={0.6} />
        {D.map(([x, y, c], i) => (c ? <circle key={i} cx={sx(x)} cy={sy(y)} r={2.6} fill="var(--c2)" stroke="var(--fg)" strokeWidth={0.4} />
          : <rect key={i} x={sx(x) - 2.4} y={sy(y) - 2.4} width={4.8} height={4.8} fill="var(--c3)" stroke="var(--fg)" strokeWidth={0.4} />))}
        <text x={L + 2} y={196} fontSize="8" fill="var(--muted)">x₁ →   (x₂ ↑)</text>
        {mode === 'manual' ? <g fontSize="8" fill="var(--fg)">
          <text x={PL} y={12}>{crit === 'gini' ? 'Gini' : 'entropy (bits)'} of children vs threshold</text>
          <line x1={PL} x2={PR} y1={PB} y2={PB} stroke="var(--fg)" strokeWidth={0.6} />
          <line x1={PL} x2={PL} y1={PT} y2={PB} stroke="var(--fg)" strokeWidth={0.6} />
          <line x1={PL} x2={PR} y1={py(parent)} y2={py(parent)} stroke="var(--muted)" strokeDasharray="3 2" />
          <path d={curve} fill="none" stroke="var(--c4)" strokeWidth={1.6} />
          {Number.isFinite(bv) && <circle cx={px(bt)} cy={py(bv)} r={3} fill="var(--c1)" />}
          <circle cx={px(thr)} cy={py(cur.v)} r={3} fill="var(--c4)" />
          <text x={PL} y={PB + 9} fill="var(--muted)">0</text><text x={PR} y={PB + 9} textAnchor="end" fill="var(--muted)">1</text>
          <text x={PL} y={142}>left: {cur.nl} pts ({cur.al} ●) · right: {D.length - cur.nl} ({tot - cur.al} ●)</text>
          <text x={PL} y={156}>parent {parent.toFixed(3)} → children {cur.v.toFixed(3)}</text>
          <text x={PL} y={170} fill="var(--c4)">decrease Δ = {(parent - cur.v).toFixed(3)}</text>
          <text x={PL} y={184} fill="var(--c1)">best on x{feat ? '₂' : '₁'}: t = {bt.toFixed(2)}, Δ = {(parent - bv).toFixed(3)}</text>
        </g> : <g fontSize="9" fill="var(--fg)">
          <text x={196} y={20}>{mode === 'grow' ? 'greedy CART tree' : `random forest, B = ${B}`}</text>
          <text x={196} y={36}>max depth {dep} · {crit}</text>
          {model?.tree && <text x={196} y={52}>leaves: {leaves(model.tree)}</text>}
          <text x={196} y={68}>training accuracy {(acc * 100).toFixed(0)}%</text>
          {mode === 'forest' && <text x={196} y={88} fontSize="8" fill="var(--muted)">shade strength = vote margin</text>}
        </g>}
      </Stage>
      <Controls>
        {controls && <>
          {(['blobs', 'xor', 'circle', 'diagonal'] as const).map((q) => <Btn key={q} active={ds === q} onClick={() => setDs(q)}>{q}</Btn>)}
          <Btn active={crit === 'gini'} onClick={() => setCrit('gini')}>Gini</Btn>
          <Btn active={crit === 'entropy'} onClick={() => setCrit('entropy')}>entropy</Btn>
        </>}
        {mode === 'manual' ? <>
          <Btn active={feat === 0} onClick={() => setFeat(0)}>split x₁</Btn>
          <Btn active={feat === 1} onClick={() => setFeat(1)}>split x₂</Btn>
          <Slider label="threshold t" min={0} max={1} step={0.01} value={thr} onChange={setThr} />
        </> : <Slider label="max depth" min={mode === 'forest' ? 1 : 0} max={maxDepth} step={1} value={dep} onChange={setDep} />}
        {mode === 'forest' && <Slider label="trees B" min={1} max={60} step={1} value={B} onChange={setB} />}
      </Controls>
    </div>
  );
}
