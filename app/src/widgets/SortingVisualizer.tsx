import { useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Btn, C, Controls, PlayPause, Slider, Stage, rng, useFrame } from './_kit';

/**
 * Animated bar-chart sorting with step / play and live counters.
 * props: { algorithm?: 'bubble'|'insertion'|'selection'|'merge'|'quick'|'heap' (default 'insertion'),
 *          algorithms?: same[] (buttons shown; default all six; [] hides picker),
 *          n?: number of bars (default 12, 4–32), values?: number[] (overrides n/seed),
 *          seed?: number, input?: 'random'|'sorted'|'reversed'|'nearly' (default 'random'),
 *          speed?: steps per second (default 4) }
 * Colours: orange = being compared, red = just moved, purple = pivot, shaded band = active subarray, green = in final place.
 */
type Algo = 'bubble' | 'insertion' | 'selection' | 'merge' | 'quick' | 'heap';
interface Frame { a: number[]; cmp: number[]; mark: number[]; done: number[]; piv: number; range: [number, number] | null; c: number; s: number; note: string }
const NAMES: Record<Algo, string> = { bubble: 'Bubble', insertion: 'Insertion', selection: 'Selection', merge: 'Merge', quick: 'Quick', heap: 'Heap' };

function trace(algo: Algo, input: number[]): Frame[] {
  const a = input.slice(); const n = a.length; const F: Frame[] = [];
  let c = 0; let s = 0; let piv = -1; let range: [number, number] | null = null; const done = new Set<number>();
  const push = (cmp: number[], mark: number[], note: string) =>
    F.push({ a: a.slice(), cmp, mark, done: [...done], piv, range, c, s, note });
  const less = (i: number, j: number) => { c++; push([i, j], [], `compare ${a[i]} vs ${a[j]}`); return a[i] < a[j]; };
  const swap = (i: number, j: number) => { if (i === j) return; [a[i], a[j]] = [a[j], a[i]]; s++; push([], [i, j], `swap → ${a[i]}, ${a[j]}`); };
  push([], [], 'start');
  if (algo === 'bubble') {
    for (let i = 0; i < n - 1; i++) {
      let swapped = false;
      for (let j = 0; j < n - 1 - i; j++) if (less(j + 1, j)) { swap(j, j + 1); swapped = true; }
      done.add(n - 1 - i);
      if (!swapped) break;
    }
  } else if (algo === 'insertion') {
    for (let i = 1; i < n; i++) { range = [0, i]; for (let j = i; j > 0 && less(j, j - 1); j--) swap(j, j - 1); }
  } else if (algo === 'selection') {
    for (let i = 0; i < n - 1; i++) {
      let m = i; piv = m;
      for (let j = i + 1; j < n; j++) if (less(j, m)) { m = j; piv = m; }
      piv = -1; swap(i, m); done.add(i);
    }
  } else if (algo === 'merge') {
    const sort = (lo: number, hi: number) => {
      if (lo >= hi) return;
      const mid = (lo + hi) >> 1; sort(lo, mid); sort(mid + 1, hi);
      range = [lo, hi]; const aux = a.slice(lo, hi + 1); let i = lo; let j = mid + 1;
      push([], [], `merge [${lo}..${mid}] with [${mid + 1}..${hi}]`);
      for (let k = lo; k <= hi; k++) {
        let take: number;
        if (i > mid) take = aux[j++ - lo];
        else if (j > hi) take = aux[i++ - lo];
        else { c++; take = aux[j - lo] < aux[i - lo] ? aux[j++ - lo] : aux[i++ - lo]; }
        a[k] = take; s++; push([], [k], `write ${take} at position ${k}`);
      }
      range = null;
    };
    sort(0, n - 1);
  } else if (algo === 'quick') {
    const sort = (lo: number, hi: number) => {
      if (lo > hi) return;
      if (lo === hi) { done.add(lo); return; }
      range = [lo, hi]; piv = hi; push([], [], `pivot ${a[hi]}`);
      let i = lo;
      for (let j = lo; j < hi; j++) if (less(j, hi)) { swap(i, j); i++; }
      swap(i, hi); piv = -1; done.add(i); range = null; push([], [], `${a[i]} is in its final place`);
      sort(lo, i - 1); sort(i + 1, hi);
    };
    sort(0, n - 1);
  } else {
    const sift = (k: number, m: number) => {
      while (2 * k + 1 < m) {
        let j = 2 * k + 1;
        if (j + 1 < m && less(j, j + 1)) j++;
        if (!less(k, j)) break;
        swap(k, j); k = j;
      }
    };
    range = [0, n - 1];
    for (let k = (n >> 1) - 1; k >= 0; k--) sift(k, n);
    push([], [], 'max-heap built');
    for (let m = n - 1; m > 0; m--) { swap(0, m); done.add(m); range = [0, m - 1]; sift(0, m); }
  }
  for (let i = 0; i < n; i++) done.add(i);
  piv = -1; range = null; push([], [], 'sorted ✓');
  return F;
}

function makeInput(n: number, seed: number, kind: string) {
  const r = rng(seed);
  const base = Array.from({ length: n }, (_, i) => Math.round(((i + 1) * 95) / n) + 4);
  if (kind === 'sorted') return base;
  if (kind === 'reversed') return base.reverse();
  if (kind === 'nearly') { for (let k = 0; k < Math.max(1, n >> 3); k++) { const i = Math.floor(r.u() * (n - 1)); [base[i], base[i + 1]] = [base[i + 1], base[i]]; } return base; }
  for (let i = n - 1; i > 0; i--) { const j = Math.floor(r.u() * (i + 1)); [base[i], base[j]] = [base[j], base[i]]; }
  return base;
}

export default function SortingVisualizer({ algorithm = 'insertion', algorithms, n = 12, values, seed = 7, input = 'random', speed = 4 }: {
  algorithm?: Algo; algorithms?: Algo[]; n?: number; values?: number[]; seed?: number; input?: 'random' | 'sorted' | 'reversed' | 'nearly'; speed?: number;
}) {
  const [algo, setAlgo] = useState<Algo>(algorithm);
  const [sd, setSd] = useState(seed);
  const [kind, setKind] = useState<string>(input);
  const [k, setK] = useState(0);
  const [running, setRunning] = useState(false);
  const [sp, setSp] = useState(speed);
  const acc = useRef(0);
  const N = Math.max(4, Math.min(32, n));
  const data = useMemo(() => (values && sd === seed && kind === input ? values : makeInput(N, sd, kind)), [values, N, sd, kind, seed, input]);
  const frames = useMemo(() => trace(algo, data), [algo, data]);
  const f = frames[Math.min(k, frames.length - 1)];
  useFrame((dt) => {
    acc.current += dt * sp;
    if (acc.current >= 1) {
      const jump = Math.floor(acc.current); acc.current -= jump;
      const nv = Math.min(frames.length - 1, k + jump);
      setK(nv); if (nv === frames.length - 1) setRunning(false);
    }
  }, running);
  const reset = (fn: () => void) => { fn(); setK(0); setRunning(false); };
  const max = Math.max(...data);
  const L = 8; const W = 304; const bw = W / f.a.length; const H = 150; const top = 14;
  // stable ids so bars slide when swapped: track original identity by value+occurrence
  const ids = useMemo(() => { const seen: Record<number, number> = {}; return f.a.map((v) => `${v}-${(seen[v] = (seen[v] ?? 0) + 1)}`); }, [f]);
  const doneSet = new Set(f.done);
  const list = algorithms ?? (['bubble', 'insertion', 'selection', 'merge', 'quick', 'heap'] as Algo[]);
  return (
    <div>
      <Stage h={190} label={`${NAMES[algo]} sort animation`}>
        {f.range && <rect x={L + f.range[0] * bw} y={top - 4} width={(f.range[1] - f.range[0] + 1) * bw} height={H + 6} fill="var(--grid)" opacity={0.5} rx={3} />}
        {f.a.map((v, i) => {
          const h = (v / max) * H;
          const col = f.mark.includes(i) ? C[4] : f.cmp.includes(i) ? C[2] : i === f.piv ? C[3] : doneSet.has(i) ? C[0] : C[1];
          return (
            <motion.g key={ids[i]} initial={false} animate={{ x: L + i * bw }} transition={{ duration: Math.min(0.25, 0.8 / sp) }}>
              <rect x={1} y={top + H - h} width={Math.max(1, bw - 2)} height={h} rx={2} fill={col} />
              {bw > 14 && <text x={bw / 2} y={top + H + 10} fontSize="8" textAnchor="middle" fill="var(--muted)">{v}</text>}
            </motion.g>
          );
        })}
        <text x={L} y={9} fontSize="9" fill="var(--fg)">{NAMES[algo]} sort — {f.note}</text>
        <text x={L} y={186} fontSize="9" fill="var(--fg)">comparisons: {f.c}</text>
        <text x={L + 110} y={186} fontSize="9" fill="var(--fg)">{algo === 'merge' ? 'writes' : 'swaps'}: {f.s}</text>
        <text x={L + W} y={186} fontSize="9" textAnchor="end" fill="var(--muted)">step {k}/{frames.length - 1}</text>
      </Stage>
      <Controls>
        {list.length > 1 && list.map((a) => <Btn key={a} active={a === algo} onClick={() => reset(() => setAlgo(a))}>{NAMES[a]}</Btn>)}
      </Controls>
      <Controls>
        <Btn onClick={() => { setRunning(false); setK((v) => Math.max(0, v - 1)); }}>◀</Btn>
        <PlayPause running={running} set={(r) => { if (r && k >= frames.length - 1) setK(0); setRunning(r); }} />
        <Btn onClick={() => { setRunning(false); setK((v) => Math.min(frames.length - 1, v + 1)); }}>▶</Btn>
        <Btn onClick={() => reset(() => { setKind('random'); setSd((x) => x + 1); })}>🔀 Shuffle</Btn>
        <Btn active={kind === 'reversed'} onClick={() => reset(() => setKind('reversed'))}>Reversed</Btn>
        <Btn active={kind === 'nearly'} onClick={() => reset(() => setKind('nearly'))}>Nearly sorted</Btn>
        <Slider label="speed" min={1} max={30} step={1} value={sp} onChange={setSp} format={(v) => `${v}/s`} />
      </Controls>
    </div>
  );
}
