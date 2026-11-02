import { useMemo, useState } from 'react';
import { Btn, C, Controls, Slider, Stage, rng } from './_kit';

/**
 * Binary search on a sorted array, one probe at a time, with lo / mid / hi pointers,
 * the discarded part greyed out, and a comparison counter vs linear search.
 * props: { values?: number[] (sorted; default random sorted array), n?: number (default 15, max 24),
 *          seed?: number, target?: number (initial target; slider lets the learner change it) }
 */
interface Frame { lo: number; hi: number; mid: number; found: boolean; probes: number; note: string }

function frames(a: number[], t: number): Frame[] {
  const F: Frame[] = []; let lo = 0; let hi = a.length - 1; let probes = 0;
  F.push({ lo, hi, mid: -1, found: false, probes, note: `Search for ${t}: lo = 0, hi = ${hi}` });
  while (lo <= hi) {
    const mid = (lo + hi) >> 1; probes++;
    F.push({ lo, hi, mid, found: false, probes, note: `mid = ⌊(${lo}+${hi})/2⌋ = ${mid}; compare a[${mid}] = ${a[mid]} with ${t}` });
    if (a[mid] === t) { F.push({ lo, hi, mid, found: true, probes, note: `a[${mid}] = ${t} — found after ${probes} probe${probes > 1 ? 's' : ''}` }); return F; }
    if (a[mid] < t) { lo = mid + 1; F.push({ lo, hi, mid: -1, found: false, probes, note: `${a[mid]} < ${t} → target must be right of mid: lo = ${lo}` }); }
    else { hi = mid - 1; F.push({ lo, hi, mid: -1, found: false, probes, note: `${a[mid]} > ${t} → target must be left of mid: hi = ${hi}` }); }
  }
  F.push({ lo, hi, mid: -1, found: false, probes, note: `lo > hi: ${t} is not present (it would be inserted at index ${lo}) — ${probes} probes` });
  return F;
}

export default function BinarySearchViz({ values, n = 15, seed = 3, target }: { values?: number[]; n?: number; seed?: number; target?: number }) {
  const a = useMemo(() => {
    if (values?.length) return [...values].sort((x, y) => x - y);
    const r = rng(seed); let v = 1 + Math.floor(r.u() * 4); const out: number[] = [];
    for (let i = 0; i < Math.min(24, Math.max(3, n)); i++) { out.push(v); v += 1 + Math.floor(r.u() * 6); }
    return out;
  }, [values, n, seed]);
  const [t, setT] = useState(target ?? a[Math.floor(a.length * 0.7)]);
  const F = useMemo(() => frames(a, t), [a, t]);
  const [k, setK] = useState(0);
  const f = F[Math.min(k, F.length - 1)];
  const linear = (() => { const i = a.findIndex((x) => x >= t); return i < 0 ? a.length : a[i] === t ? i + 1 : a.length; })();
  const bw = Math.min(26, 300 / a.length); const L = (320 - bw * a.length) / 2; const y = 50;
  const ptr = (i: number, label: string, col: string, dy: number) => i >= 0 && i < a.length && (
    <g key={label}>
      <path d={`M${L + i * bw + bw / 2},${y + bw + 4 + dy}l-4,7h8z`} fill={col} />
      <text x={L + i * bw + bw / 2} y={y + bw + 20 + dy} fontSize="9" textAnchor="middle" fill={col} fontWeight={700}>{label}</text>
    </g>
  );
  return (
    <div>
      <Stage h={130} label="Binary search">
        <text x={160} y={16} fontSize="10" textAnchor="middle" fill="var(--fg)">target = {t}</text>
        {a.map((v, i) => {
          const out = i < f.lo || i > f.hi; const isMid = i === f.mid;
          return (
            <g key={i} opacity={out ? 0.25 : 1} style={{ transition: 'opacity .3s' }}>
              <rect x={L + i * bw + 1} y={y} width={bw - 2} height={bw} rx={3}
                fill={isMid ? (f.found ? C[0] : C[2]) : 'var(--surface)'} stroke="var(--fg)" strokeWidth={0.8} />
              <text x={L + i * bw + bw / 2} y={y + bw / 2 + 3.5} fontSize={bw > 18 ? 10 : 8} textAnchor="middle" fill={isMid ? 'var(--surface)' : 'var(--fg)'}>{v}</text>
              <text x={L + i * bw + bw / 2} y={y - 4} fontSize="7" textAnchor="middle" fill="var(--muted)">{i}</text>
            </g>
          );
        })}
        {f.lo <= f.hi && [ptr(f.lo, 'lo', C[1], 0), ptr(f.hi, 'hi', C[3], f.hi === f.lo ? 18 : 0)]}
        {ptr(f.mid, 'mid', C[2], 26)}
      </Stage>
      <div className="w-muted" style={{ fontSize: '0.85em', minHeight: '2.6em' }}>
        <div><b>{f.note}</b></div>
        <div>Binary search probes: {f.probes} · linear scan would need {linear} comparison{linear > 1 ? 's' : ''} · ⌈log₂({a.length}+1)⌉ = {Math.ceil(Math.log2(a.length + 1))} max</div>
      </div>
      <Controls>
        <Btn onClick={() => setK(0)}>⏮</Btn>
        <Btn onClick={() => setK((v) => Math.max(0, v - 1))}>◀</Btn>
        <Btn onClick={() => setK((v) => Math.min(F.length - 1, v + 1))}>Next ▶</Btn>
        <Slider label="target" min={a[0] - 1} max={a[a.length - 1] + 1} step={1} value={t} onChange={(v) => { setT(v); setK(0); }} format={(v) => String(v)} />
      </Controls>
    </div>
  );
}
