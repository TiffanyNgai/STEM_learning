/**
 * Random vs scaffold vs time split: why the test score depends on how you split.
 * Synthetic data: 6 chemical series (colours = scaffolds), each a cluster of 8–20 compounds in a 2D descriptor
 * space. Activity y = 1.5·(x − 0.5) [a global trend a model can learn] + a series-specific offset [unpredictable
 * from other series] + a small within-series slope + assay noise (sd 0.3). Series are "discovered" over time
 * from left to right, so later series drift into new territory.
 * The model is k-nearest-neighbour regression (k = 3, Euclidean distance in the 2D space), refitted for each split:
 *  - random:   25 % of compounds chosen at random → test compounds have close relatives (same series) in training.
 *  - scaffold: whole series held out (added in random order until ≥ 20 % of compounds) → no relatives in training.
 *  - time:     the latest 20 % of compounds (by synthesis date) → new series and late members of old ones.
 * Scatter: training = filled dots, test = rings, each test ring linked to its nearest training compound.
 * Bars: test RMSE averaged over 30 random datasets (tap a bar or button to select a split); dashed line = assay noise
 * (the best achievable RMSE). Readout: RMSE, R² and mean distance from a test compound to its nearest training
 * compound (NN dist) for the dataset shown. R² is shown only per dataset: with one held-out series it can be very negative.
 * props: { split?: 'random'|'scaffold'|'time' (default 'random'), seed?: number (default 4), k?: number (default 3) }
 */
import { useMemo, useState } from 'react';
import { Stage, Controls, Btn, C, rng } from './_kit';

type Split = 'random' | 'scaffold' | 'time';
interface Pt { x: number; y: number; s: number; act: number; time: number }

function makeData(seed: number): Pt[] {
  const r = rng(seed);
  const centres: [number, number][] = [];
  while (centres.length < 6) {
    const c: [number, number] = [0.12 + 0.76 * r.u(), 0.14 + 0.72 * r.u()];
    if (centres.every(([a, b]) => Math.hypot(a - c[0], b - c[1]) > 0.24)) centres.push(c);
  }
  centres.sort((a, b) => a[0] - b[0]); // series discovered left → right
  const pts: Pt[] = [];
  centres.forEach(([cx, cy], s) => {
    const off = 1.0 * r.normal(), slope = 0.6 * r.normal(), n = 8 + Math.floor(13 * r.u());
    for (let i = 0; i < n; i++) {
      const x = cx + 0.055 * r.normal(), y = cy + 0.055 * r.normal();
      pts.push({ x, y, s, time: s * 0.6 + i * 0.06 + 0.3 * r.u(),
        act: 1.5 * (x - 0.5) + off + (slope * (y - cy)) / 0.055 * 0.3 + 0.3 * r.normal() });
    }
  });
  return pts;
}

function shuffle<T>(a: T[], u: () => number): T[] {
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(u() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

function splitIdx(pts: Pt[], split: Split, seed: number): boolean[] {
  const r = rng(seed * 7 + 1);
  const n = pts.length;
  if (split === 'random') {
    const idx = shuffle(pts.map((_, i) => i), r.u).map((i, k) => [i, k] as const);
    const test = new Array(n).fill(false);
    idx.forEach(([i, k]) => { if (k < Math.round(0.25 * n)) test[i] = true; });
    return test;
  }
  if (split === 'time') {
    const order = pts.map((p, i) => [p.time, i] as const).sort((a, b) => a[0] - b[0]);
    const test = new Array(n).fill(false);
    order.slice(Math.round(0.8 * n)).forEach(([, i]) => { test[i] = true; });
    return test;
  }
  const series = shuffle([0, 1, 2, 3, 4, 5], r.u);
  const held = new Set<number>(); let cnt = 0;
  for (const s of series) { if (cnt >= 0.2 * n) break; held.add(s); cnt += pts.filter((p) => p.s === s).length; }
  return pts.map((p) => held.has(p.s));
}

function evaluate(pts: Pt[], test: boolean[], k: number) {
  const tr = pts.filter((_, i) => !test[i]), te = pts.filter((_, i) => test[i]);
  const near: [Pt, Pt][] = [];
  let sse = 0, dsum = 0;
  const preds = te.map((p) => {
    const d = tr.map((q) => [Math.hypot(p.x - q.x, p.y - q.y), q] as const).sort((a, b) => a[0] - b[0]);
    near.push([p, d[0][1]]); dsum += d[0][0];
    const kk = d.slice(0, k);
    return kk.reduce((a, [, q]) => a + q.act, 0) / kk.length;
  });
  const mu = te.reduce((a, p) => a + p.act, 0) / te.length;
  te.forEach((p, i) => { sse += (p.act - preds[i]) ** 2; });
  const sst = te.reduce((a, p) => a + (p.act - mu) ** 2, 0);
  return { r2: 1 - sse / sst, rmse: Math.sqrt(sse / te.length), dist: dsum / te.length, near };
}

const SPLITS: Split[] = ['random', 'scaffold', 'time'];

export default function DrugSplitGap({ split = 'random', seed = 4, k = 3 }: { split?: Split; seed?: number; k?: number }) {
  const [sp, setSp] = useState<Split>(SPLITS.includes(split) ? split : 'random');
  const [sd, setSd] = useState(seed);
  const kk = Math.max(1, Math.round(k));
  const pts = useMemo(() => makeData(sd), [sd]);
  const test = useMemo(() => splitIdx(pts, sp, sd), [pts, sp, sd]);
  const cur = useMemo(() => evaluate(pts, test, kk), [pts, test, kk]);
  const avg = useMemo(() => SPLITS.map((s) => {
    let e2 = 0;
    for (let j = 0; j < 30; j++) { const p = makeData(100 + j); e2 += evaluate(p, splitIdx(p, s, 100 + j), kk).rmse; }
    return e2 / 30;
  }), [kk]);

  const X = (v: number) => 8 + v * 168, Y = (v: number) => 196 - v * 168;
  const bx = 196, bw = 34, by0 = 150, bScale = 60; // RMSE 1 → 60 px
  const yE = (v: number) => by0 - Math.min(2, v) * bScale;
  return (
    <div>
      <Stage w={320} h={214} label={`${sp} split: test RMSE ${cur.rmse.toFixed(2)}`}>
        <rect x={8} y={28} width={168} height={168} fill="none" stroke="var(--grid)" />
        <text x={10} y={22} fontSize="8.5" fill="var(--muted)">descriptor space (colour = series)</text>
        {cur.near.map(([p, q], i) => <line key={'n' + i} x1={X(p.x)} y1={Y(p.y)} x2={X(q.x)} y2={Y(q.y)} stroke="var(--muted)" strokeWidth={0.6} strokeDasharray="2 1.5" />)}
        {pts.map((p, i) => test[i]
          ? <circle key={i} cx={X(p.x)} cy={Y(p.y)} r={3.6} fill="none" stroke={C[p.s]} strokeWidth={1.6} />
          : <circle key={i} cx={X(p.x)} cy={Y(p.y)} r={2.4} fill={C[p.s]} opacity={0.75} />)}
        <text x={316} y={12} fontSize="8.5" fill="var(--muted)" textAnchor="end">test RMSE, mean of 30</text>
        <text x={316} y={22} fontSize="7.5" fill="var(--c5)" textAnchor="end">red dashes = assay noise (0.3)</text>
        <line x1={bx - 4} x2={316} y1={by0} y2={by0} stroke="var(--fg)" strokeWidth={0.8} />
        {[0.5, 1, 1.5].map((v) => <g key={v}><line x1={bx - 4} x2={316} y1={yE(v)} y2={yE(v)} stroke="var(--grid)" strokeWidth={0.5} /><text x={bx - 6} y={yE(v) + 3} fontSize="7" fill="var(--muted)" textAnchor="end">{v}</text></g>)}
        <text x={bx - 6} y={by0 + 3} fontSize="7" fill="var(--muted)" textAnchor="end">0</text>
        {SPLITS.map((s, i) => {
          const v = avg[i], x = bx + 4 + i * (bw + 6), top = yE(v);
          return (
            <g key={s} onClick={() => setSp(s)} style={{ cursor: 'pointer' }}>
              <rect x={x} y={top} width={bw} height={by0 - top} fill={s === sp ? 'var(--c3)' : 'var(--c2)'} opacity={s === sp ? 0.9 : 0.45} />
              <text x={x + bw / 2} y={top - 3} fontSize="8" textAnchor="middle" fill="var(--fg)">{v.toFixed(2)}</text>
              <text x={x + bw / 2} y={by0 + 10} fontSize="8" textAnchor="middle" fill={s === sp ? 'var(--c3)' : 'var(--muted)'}>{s}</text>
            </g>
          );
        })}
        <line x1={bx - 4} x2={316} y1={yE(0.3)} y2={yE(0.3)} stroke="var(--c5)" strokeWidth={0.9} strokeDasharray="3 2" />
        <g fontSize="8.5" fill="var(--fg)">
          <text x={bx - 4} y={by0 + 28}>this dataset ({sp}):</text>
          <text x={bx - 4} y={by0 + 40}>RMSE {cur.rmse.toFixed(2)} · R² {cur.r2.toFixed(2)}</text>
          <text x={bx - 4} y={by0 + 52} fill="var(--muted)">test→train NN dist {cur.dist.toFixed(2)}</text>
        </g>
      </Stage>
      <Controls>
        {SPLITS.map((s) => <Btn key={s} active={s === sp} onClick={() => setSp(s)}>{s}</Btn>)}
        <Btn onClick={() => setSd(sd + 1)}>New dataset</Btn>
      </Controls>
    </div>
  );
}
