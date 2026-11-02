import { useRef, useState } from 'react';
import { Btn, Controls, Stage, prefersReducedMotion, useFrame } from './_kit';

/**
 * Listing an infinite grid as a single sequence (Cantor's zig-zag).
 * The grid of pairs (m, n) with m, n ≥ 1 is walked one anti-diagonal (m + n = constant) at a time,
 * so every pair gets a finite position number. In "rationals" mode cell (p, q) shows the fraction p/q
 * and repeats such as 2/4 = 1/2 are skipped, giving a list of all positive rationals.
 * props: { size?: number (grid size shown, 4–7, default 6), mode?: 'pairs' | 'rationals' (default 'pairs') }
 */
const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);

export default function MathZigzag({ size = 6, mode = 'pairs' }: { size?: number; mode?: 'pairs' | 'rationals' }) {
  const N = Math.max(4, Math.min(7, Math.round(size)));
  const rat = mode === 'rationals';
  // order of visits, diagonals s = 2 .. N+1 (only full diagonals that fit in the grid)
  const walk: { p: number; q: number; skip: boolean }[] = [];
  for (let s = 2; s <= N + 1; s++) for (let p = 1; p < s; p++) { const q = s - p; walk.push({ p, q, skip: rat && gcd(p, q) > 1 }); }
  const [k, setK] = useState(prefersReducedMotion() ? walk.length : 0); // number of cells visited
  const [run, setRun] = useState(false);
  const acc = useRef(0);
  useFrame((dt) => {
    acc.current += dt;
    if (acc.current < 0.45) return;
    acc.current = 0;
    if (k >= walk.length) setRun(false); else setK(k + 1);
  }, run);

  const cw = Math.min(42, 260 / N), ch = Math.min(26, 150 / N), x0 = 44, y0 = 26;
  const cx = (q: number) => x0 + (q - 1) * cw + cw / 2, cy = (p: number) => y0 + (p - 1) * ch + ch / 2;
  const pos = new Map<string, number>(); let c = 0;
  walk.slice(0, k).forEach((w) => { if (!w.skip) pos.set(w.p + ',' + w.q, ++c); });
  const path = walk.slice(0, k).map((w, i) => `${i ? 'L' : 'M'}${cx(w.q)},${cy(w.p)}`).join(' ');
  const last = k > 0 ? walk[k - 1] : null;
  const H = y0 + N * ch + 26;

  return (
    <div>
      <Stage w={320} h={H} label="Zig-zag enumeration of a grid">
        <text x={x0 + (N * cw) / 2} y={10} fontSize="9" textAnchor="middle" fill="var(--muted)">{rat ? 'denominator q →' : 'n →'}</text>
        <text x={8} y={y0 + (N * ch) / 2} fontSize="9" fill="var(--muted)" transform={`rotate(-90 8 ${y0 + (N * ch) / 2})`} textAnchor="middle">{rat ? 'numerator p →' : 'm →'}</text>
        {Array.from({ length: N }, (_, i) => (
          <g key={'lab' + i} fontSize="9" fill="var(--muted)">
            <text x={cx(i + 1)} y={y0 - 4} textAnchor="middle">{i + 1}</text>
            <text x={x0 - 6} y={cy(i + 1) + 3} textAnchor="end">{i + 1}</text>
          </g>
        ))}
        <path d={path} fill="none" stroke="var(--c3)" strokeWidth={1.5} strokeOpacity={0.7} />
        {Array.from({ length: N }, (_, pi) => Array.from({ length: N }, (_, qi) => {
          const p = pi + 1, q = qi + 1; const key = p + ',' + q; const n = pos.get(key);
          const skip = rat && gcd(p, q) > 1; const reachable = p + q <= N + 1;
          return (
            <g key={key} opacity={reachable ? 1 : 0.35}>
              <rect x={cx(q) - cw / 2 + 1.5} y={cy(p) - ch / 2 + 1.5} width={cw - 3} height={ch - 3} rx={4}
                fill={n ? 'var(--c2)' : 'var(--surface-2)'} fillOpacity={n ? 0.85 : 1} />
              <text x={cx(q)} y={cy(p) + 3.5} fontSize={rat ? 10 : 8.5} textAnchor="middle"
                fill={n ? 'var(--surface)' : skip ? 'var(--muted)' : 'var(--fg)'} textDecoration={skip ? 'line-through' : undefined}>
                {rat ? `${p}/${q}` : `(${p},${q})`}
              </text>
              {n && <text x={cx(q) + cw / 2 - 3} y={cy(p) - ch / 2 + 9} fontSize="7" textAnchor="end" fill="var(--surface)" fontWeight="bold">{n}</text>}
            </g>
          );
        }))}
        {last && <circle cx={cx(last.q)} cy={cy(last.p)} r={Math.min(cw, ch) / 2 - 1} fill="none" stroke="var(--c3)" strokeWidth={2} />}
        <text x={8} y={H - 8} fontSize="10" fill="var(--fg)">
          {!last ? 'Press Play: walk the diagonals one by one.'
            : last.skip ? `${last.p}/${last.q} = ${last.p / gcd(last.p, last.q)}/${last.q / gcd(last.p, last.q)} already listed: skip.`
              : `${rat ? last.p + '/' + last.q : '(' + last.p + ',' + last.q + ')'} gets number ${pos.get(last.p + ',' + last.q)}.`}
        </text>
      </Stage>
      <Controls>
        <Btn active={run} onClick={() => { if (k >= walk.length) setK(0); setRun(!run); }}>{run ? 'Pause' : 'Play'}</Btn>
        <Btn onClick={() => setK((x) => Math.min(walk.length, x + 1))}>Step</Btn>
        <Btn onClick={() => { setK(0); setRun(false); }}>Reset</Btn>
      </Controls>
    </div>
  );
}
