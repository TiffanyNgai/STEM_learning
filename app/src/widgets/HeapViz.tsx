import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Btn, C, Controls, Stage, rng, useFrame } from './_kit';

/**
 * Binary heap shown simultaneously as a tree and as the array that stores it.
 * Insert (sift-up) and extract-min/max (sift-down) are animated swap by swap.
 * props: { initial?: number[] (default [3, 8, 5, 12, 9, 7, 10]), kind?: 'min'|'max' (default 'min'),
 *          seed?: number (for random inserted keys), maxSize?: number (≤ 15, default 15), speed?: steps/s (default 1.5) }
 */
interface Item { id: number; v: number }
interface Snap { arr: Item[]; hl: number[]; note: string; out?: Item }

const posOf = (i: number) => {
  const lvl = Math.floor(Math.log2(i + 1)); const p = i - (2 ** lvl - 1);
  return [((p + 0.5) * 320) / 2 ** lvl, 22 + lvl * 32];
};

export default function HeapViz({ initial = [3, 8, 5, 12, 9, 7, 10], kind = 'min', seed = 5, maxSize = 15, speed = 1.5 }: {
  initial?: number[]; kind?: 'min' | 'max'; seed?: number; maxSize?: number; speed?: number;
}) {
  const better = (a: Item, b: Item) => (kind === 'min' ? a.v < b.v : a.v > b.v);
  const word = kind === 'min' ? 'smaller' : 'larger';
  const cap = Math.min(15, maxSize);
  const nextId = useRef(100);
  const r = useRef(rng(seed));
  const build = () => {
    const arr: Item[] = [];
    initial.slice(0, cap).forEach((v, k) => {
      arr.push({ id: k, v }); let i = arr.length - 1;
      while (i > 0 && better(arr[i], arr[(i - 1) >> 1])) { const p = (i - 1) >> 1; [arr[i], arr[p]] = [arr[p], arr[i]]; i = p; }
    });
    return arr;
  };
  const [snap, setSnap] = useState<Snap>(() => ({ arr: build(), hl: [], note: `A ${kind}-heap: every parent is ${kind === 'min' ? '≤' : '≥'} its children.` }));
  const [queue, setQueue] = useState<Snap[]>([]);
  const acc = useRef(0);
  useFrame((dt) => {
    acc.current += dt * speed;
    if (acc.current >= 1) { acc.current = 0; setSnap(queue[0]); setQueue((q) => q.slice(1)); }
  }, queue.length > 0);
  const busy = queue.length > 0;

  const insert = () => {
    if (busy || snap.arr.length >= cap) return;
    const arr = snap.arr.slice(); const it = { id: nextId.current++, v: 1 + Math.floor(r.current.u() * 40) };
    arr.push(it); let i = arr.length - 1; const S: Snap[] = [];
    S.push({ arr: arr.slice(), hl: [i], note: `Insert ${it.v}: put it in the next free slot (index ${i}).` });
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (!better(arr[i], arr[p])) { S.push({ arr: arr.slice(), hl: [i, p], note: `${it.v} vs parent ${arr[p].v}: order OK — done.` }); break; }
      S.push({ arr: arr.slice(), hl: [i, p], note: `${it.v} is ${word} than parent ${arr[p].v} → swap (sift up).` });
      [arr[i], arr[p]] = [arr[p], arr[i]]; i = p;
      S.push({ arr: arr.slice(), hl: [i], note: i === 0 ? `${it.v} reached the root.` : `${it.v} moved up to index ${i}.` });
    }
    setQueue(S);
  };

  const extract = () => {
    if (busy || !snap.arr.length) return;
    const arr = snap.arr.slice(); const top = arr[0]; const S: Snap[] = [];
    S.push({ arr: arr.slice(), hl: [0], note: `The ${kind} is always at the root: ${top.v}. Remove it.` });
    const last = arr.pop()!;
    if (!arr.length) { S.push({ arr: [], hl: [], note: `Removed ${top.v}; heap is now empty.`, out: top }); setQueue(S); return; }
    arr[0] = last; let i = 0;
    S.push({ arr: arr.slice(), hl: [0], note: `Move the last leaf ${last.v} into the root's place.`, out: top });
    for (;;) {
      const l = 2 * i + 1; const rr = l + 1; if (l >= arr.length) { S.push({ arr: arr.slice(), hl: [i], note: `${last.v} is a leaf — done.`, out: top }); break; }
      const c = rr < arr.length && better(arr[rr], arr[l]) ? rr : l;
      if (!better(arr[c], arr[i])) { S.push({ arr: arr.slice(), hl: [i, c], note: `${last.v} vs ${word} child ${arr[c].v}: order OK — done.`, out: top }); break; }
      S.push({ arr: arr.slice(), hl: [i, c], note: `${word} child ${arr[c].v} beats ${last.v} → swap (sift down).`, out: top });
      [arr[i], arr[c]] = [arr[c], arr[i]]; i = c;
      S.push({ arr: arr.slice(), hl: [i], out: top, note: `${last.v} moved down to index ${i}.` });
    }
    setQueue(S);
  };

  const { arr, hl } = snap;
  const cw = 20; const ax = (320 - cw * cap) / 2; const ay = 160;
  return (
    <div>
      <Stage h={196} label={`Binary ${kind}-heap as tree and array`}>
        {arr.map((_, i) => {
          if (i === 0) return null; const [x1, y1] = posOf((i - 1) >> 1); const [x2, y2] = posOf(i);
          return <line key={'e' + i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--muted)" strokeWidth={1} />;
        })}
        {Array.from({ length: cap }, (_, i) => (
          <g key={'s' + i}>
            <rect x={ax + i * cw} y={ay} width={cw} height={cw} fill="none" stroke="var(--grid)" />
            <text x={ax + i * cw + cw / 2} y={ay + cw + 9} fontSize="7" textAnchor="middle" fill="var(--muted)">{i}</text>
          </g>
        ))}
        {arr.map((it, i) => {
          const [x, y] = posOf(i); const col = hl.includes(i) ? (hl[0] === i ? C[4] : C[2]) : i === 0 ? C[0] : C[1];
          return (
            <g key={it.id}>
              <motion.g initial={false} animate={{ x, y }} transition={{ duration: 0.4 }}>
                <circle r={11} fill={col} />
                <text y={3.5} fontSize="10" fontWeight={700} textAnchor="middle" fill="var(--surface)">{it.v}</text>
              </motion.g>
              <motion.g initial={false} animate={{ x: ax + i * cw, y: ay }} transition={{ duration: 0.4 }}>
                <rect width={cw} height={cw} fill={col} opacity={0.85} stroke="var(--fg)" strokeWidth={0.5} />
                <text x={cw / 2} y={cw / 2 + 3.5} fontSize="9" textAnchor="middle" fill="var(--surface)">{it.v}</text>
              </motion.g>
            </g>
          );
        })}
        {snap.out && <text x={4} y={12} fontSize="9" fill={C[0]}>removed: {snap.out.v}</text>}
        <text x={316} y={ay - 6} fontSize="8" textAnchor="end" fill="var(--muted)">array: children of i at 2i+1, 2i+2</text>
      </Stage>
      <div className="w-muted" style={{ fontSize: '0.85em', minHeight: '1.4em' }}><b>{snap.note}</b></div>
      <Controls>
        <Btn onClick={insert}>＋ Insert random</Btn>
        <Btn onClick={extract}>Extract-{kind}</Btn>
        <Btn onClick={() => { if (!busy) setSnap({ arr: build(), hl: [], note: 'Reset.' }); }}>Reset</Btn>
      </Controls>
    </div>
  );
}
