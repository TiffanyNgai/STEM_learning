import { useRef, useState } from 'react';
import { Btn, C, Controls, PlayPause, Slider, Stage, pathOf, prefersReducedMotion, rng, scale, useFrame } from './_kit';

/**
 * Law of large numbers: running proportion of heads (or running mean) vs number of flips,
 * on a log-scaled x axis so the wild early phase and the calm late phase are both visible.
 * props: { p?: number (P(heads), default 0.5), maxFlips?: number (default 2000),
 *          paths?: number (independent runs drawn, 1–6, default 3),
 *          showBand?: boolean (draw p ± 2·sqrt(p(1−p)/n), default true), allowP?: boolean (slider for p, default true) }
 */
export default function CoinFlipLLN({ p: p0 = 0.5, maxFlips = 2000, paths = 3, showBand = true, allowP = true }: {
  p?: number; maxFlips?: number; paths?: number; showBand?: boolean; allowP?: boolean;
}) {
  const K = Math.max(1, Math.min(6, Math.round(paths)));
  const [p, setP] = useState(p0);
  const [running, setRunning] = useState(!prefersReducedMotion());
  const [band, setBand] = useState(showBand);
  const seed = useRef(1);
  const mk = () => Array.from({ length: K }, (_, k) => ({ r: rng(seed.current * 97 + k * 13), heads: 0, pts: [] as [number, number][] }));
  const runs = useRef(mk());
  const nRef = useRef(0);
  const [, force] = useState(0);
  const reset = () => { seed.current++; runs.current = mk(); nRef.current = 0; force((v) => v + 1); };

  useFrame((dt) => {
    if (nRef.current >= maxFlips) return;
    // flips per frame grow with n so the log axis fills at a steady visual pace
    const step = Math.max(1, Math.round(nRef.current * dt * 0.9));
    for (let s = 0; s < step && nRef.current < maxFlips; s++) {
      nRef.current++;
      const n = nRef.current;
      for (const run of runs.current) {
        if (run.r.u() < p) run.heads++;
        // store every point early, then thin out (enough for a smooth curve)
        if (n < 60 || n % Math.ceil(n / 60) === 0 || n === maxFlips) run.pts.push([n, run.heads / n]);
      }
    }
    force((v) => v + 1);
  }, running && nRef.current < maxFlips);

  const box = [30, 12, 310, 170] as const;
  const lx = scale([0, Math.log10(maxFlips)], [box[0], box[2]]);
  const sx = (n: number) => lx(Math.log10(n));
  const sy = scale([0, 1], [box[3], box[1]]);
  const n = nRef.current;
  const bandPts = (sgn: number) => {
    const out: [number, number][] = [];
    for (let i = 0; i <= 80; i++) {
      const m = Math.pow(10, (Math.log10(maxFlips) * i) / 80);
      const v = p + sgn * 2 * Math.sqrt((p * (1 - p)) / m);
      out.push([sx(m), sy(Math.max(0, Math.min(1, v)))]);
    }
    return out;
  };
  const ticks = [1, 10, 100, 1000, 10000, 100000].filter((t) => t <= maxFlips);
  const last = runs.current[0].pts[runs.current[0].pts.length - 1];

  return (
    <div>
      <Stage w={320} h={190} label="Running proportion of heads converging to p">
        {[0, 0.25, 0.5, 0.75, 1].map((v) => (
          <g key={v}>
            <line x1={box[0]} x2={box[2]} y1={sy(v)} y2={sy(v)} stroke="var(--grid)" strokeWidth={0.5} />
            <text x={box[0] - 3} y={sy(v) + 3} fontSize="8" textAnchor="end" fill="var(--muted)">{v}</text>
          </g>
        ))}
        {ticks.map((t) => (
          <g key={t}>
            <line x1={sx(t)} x2={sx(t)} y1={box[1]} y2={box[3]} stroke="var(--grid)" strokeWidth={0.5} />
            <text x={sx(t)} y={box[3] + 10} fontSize="8" textAnchor="middle" fill="var(--muted)">{t}</text>
          </g>
        ))}
        <text x={box[2]} y={box[3] - 3} fontSize="8" textAnchor="end" fill="var(--fg)">flips n (log scale)</text>
        {band && <path d={pathOf([...bandPts(1), ...bandPts(-1).reverse()]) + 'Z'} fill={C[0]} opacity={0.15} />}
        <line x1={box[0]} x2={box[2]} y1={sy(p)} y2={sy(p)} stroke={C[0]} strokeWidth={1.2} strokeDasharray="4 3" />
        <text x={box[0] + 3} y={sy(p) - 3} fontSize="9" fill={C[0]}>p = {p.toFixed(2)}</text>
        {runs.current.map((run, k) => run.pts.length > 1 && (
          <path key={k} d={pathOf(run.pts.map(([a, b]) => [sx(a), sy(b)]))} fill="none" stroke={C[[1, 4, 3, 2, 5, 0][k]]} strokeWidth={1.5} />
        ))}
        <text x={box[2]} y={box[1] + 8} fontSize="9" textAnchor="end" fill="var(--fg)">
          n = {n}{last ? `, run 1: ${(last[1] * 100).toFixed(1)}% heads` : ''}
        </text>
      </Stage>
      <Controls>
        {allowP && <Slider label="p" min={0.05} max={0.95} step={0.05} value={p} onChange={(v) => { setP(v); reset(); }} />}
        <PlayPause running={running} set={setRunning} />
        <Btn active={band} onClick={() => setBand(!band)}>±2 SE band</Btn>
        <Btn onClick={reset}>New flips</Btn>
      </Controls>
    </div>
  );
}
