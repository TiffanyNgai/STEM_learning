import { useRef, useState } from 'react';
import { Btn, C, Controls, PlayPause, Stage, prefersReducedMotion, useFrame } from './_kit';

/**
 * A permutation σ of {1,…,n} drawn as a cycle diagram: points on a circle, an arrow i → σ(i),
 * each cycle in its own colour, with tokens that glide along the arrows (Play) to show σ acting.
 * Readouts: two-line notation, disjoint-cycle notation, number of cycles c (fixed points included),
 * sign = (−1)^(n−c), parity and order (lcm of cycle lengths).
 * Tap two points to multiply by the transposition swapping them (σ ← σ∘(a b)): the parity flips every time.
 * props: { n?: number (3–8, default 6), perm?: number[] (one-line notation, 1-based, e.g. [3,4,5,2,1,6];
 *          default identity), animate?: boolean (default true; off under reduced motion) }
 */
const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);

function cyclesOf(p: number[]) {
  const seen = new Array(p.length).fill(false); const out: number[][] = [];
  for (let i = 0; i < p.length; i++) if (!seen[i]) {
    const cyc: number[] = []; let j = i;
    while (!seen[j]) { seen[j] = true; cyc.push(j); j = p[j]; }
    out.push(cyc);
  }
  return out;
}

export default function MathPermutationCycles({ n, perm, animate = true }: { n?: number; perm?: number[]; animate?: boolean }) {
  const N = Math.max(3, Math.min(8, Math.round(n ?? perm?.length ?? 6)));
  const init = () => {
    const ok = perm && perm.length === N && [...perm].sort((a, b) => a - b).every((v, i) => v === i + 1);
    return ok ? perm!.map((v) => v - 1) : Array.from({ length: N }, (_, i) => i);
  };
  const [p, setP] = useState<number[]>(init);
  const [pick, setPick] = useState<number | null>(null);
  const [swaps, setSwaps] = useState(0);
  const [running, setRunning] = useState(animate && !prefersReducedMotion());
  const ph = useRef(0); const [, force] = useState(0);
  useFrame((dt) => { ph.current = (ph.current + dt / 2.2) % 1; force((v) => v + 1); }, running);

  const cyc = cyclesOf(p);
  const colour = new Array(N).fill(0); cyc.forEach((c, k) => c.forEach((i) => (colour[i] = k)));
  const c = cyc.length; const sign = (N - c) % 2 === 0 ? 1 : -1;
  const ord = cyc.reduce((acc, cy) => (acc * cy.length) / gcd(acc, cy.length), 1);
  const cx = 95, cy0 = 100, R = 70;
  const pos = (i: number): [number, number] => [cx + R * Math.sin((2 * Math.PI * i) / N), cy0 - R * Math.cos((2 * Math.PI * i) / N)];
  // movement fraction: hold, glide, hold
  const f = ph.current < 0.25 ? 0 : ph.current > 0.75 ? 1 : (ph.current - 0.25) / 0.5;
  const ease = f * f * (3 - 2 * f);
  const notation = cyc.filter((cy) => cy.length > 1).map((cy) => '(' + cy.map((i) => i + 1).join(' ') + ')').join('') || 'e';

  const tap = (i: number) => {
    if (pick === null) { setPick(i); return; }
    if (pick !== i) {
      const q = [...p]; [q[pick], q[i]] = [q[i], q[pick]]; // σ∘(a b): swap the images of a and b
      setP(q); setSwaps((s) => s + 1);
    }
    setPick(null);
  };

  return (
    <div>
      <Stage w={320} h={200} label="Cycle diagram of a permutation">
        <defs>
          <marker id="mpc-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill="var(--muted)" />
          </marker>
        </defs>
        {p.map((t, i) => {
          const [x1, y1] = pos(i), [x2, y2] = pos(t);
          if (t === i) return <circle key={'a' + i} cx={x1 + (x1 - cx) * 0.22} cy={y1 + (y1 - cy0) * 0.22} r={8} fill="none" stroke={C[colour[i] % 6]} strokeWidth={1.3} />;
          const mx = (x1 + x2) / 2 + (cx - (x1 + x2) / 2) * 0.25, my = (y1 + y2) / 2 + (cy0 - (y1 + y2) / 2) * 0.25;
          const d = Math.hypot(x2 - x1, y2 - y1); const sx = x2 - ((x2 - mx) / Math.hypot(x2 - mx, y2 - my)) * 11, sy = y2 - ((y2 - my) / Math.hypot(x2 - mx, y2 - my)) * 11;
          return d > 0 && <path key={'a' + i} d={`M${x1},${y1} Q${mx},${my} ${sx},${sy}`} fill="none" stroke={C[colour[i] % 6]} strokeWidth={1.6} markerEnd="url(#mpc-arrow)" />;
        })}
        {p.map((_, i) => {
          const [x, y] = pos(i);
          return (
            <g key={'p' + i} onClick={() => tap(i)} style={{ cursor: 'pointer' }}>
              <circle cx={x} cy={y} r={11} fill="var(--surface)" stroke={pick === i ? 'var(--c4)' : 'var(--fg)'} strokeWidth={pick === i ? 3 : 1.2} />
              <text x={x} y={y + 4} fontSize="11" textAnchor="middle" fill="var(--fg)" fontWeight="bold">{i + 1}</text>
            </g>
          );
        })}
        {running && p.map((t, i) => {
          const [x1, y1] = pos(i), [x2, y2] = pos(t);
          const mx = (x1 + x2) / 2 + (cx - (x1 + x2) / 2) * 0.25, my = (y1 + y2) / 2 + (cy0 - (y1 + y2) / 2) * 0.25;
          const u = ease, x = (1 - u) ** 2 * x1 + 2 * u * (1 - u) * mx + u * u * x2, y = (1 - u) ** 2 * y1 + 2 * u * (1 - u) * my + u * u * y2;
          return <circle key={'t' + i} cx={x} cy={y - 14} r={4.5} fill={C[colour[i] % 6]} />;
        })}
        <g fontSize="10" fill="var(--fg)">
          <text x={182} y={22} fill="var(--muted)">two-line:</text>
          <text x={182} y={36}>{p.map((_, i) => i + 1).join(' ')}</text>
          <text x={182} y={49}>{p.map((t) => t + 1).join(' ')}</text>
          <text x={182} y={70} fill="var(--muted)">cycles:</text>
          <text x={182} y={84} fontWeight="bold" fill="var(--c4)">{notation}</text>
          <text x={182} y={106}>n = {N}, cycles c = {c}</text>
          <text x={182} y={122}>sign = (−1)^(n−c) = {sign > 0 ? '+1' : '−1'}</text>
          <text x={182} y={138} fontWeight="bold" fill={sign > 0 ? 'var(--c1)' : 'var(--c5)'}>{sign > 0 ? 'EVEN' : 'ODD'} permutation</text>
          <text x={182} y={154}>order = lcm = {ord}</text>
          <text x={182} y={176} fill="var(--muted)" fontSize="9">swaps applied: {swaps}</text>
          <text x={182} y={190} fill="var(--muted)" fontSize="9">{pick === null ? 'tap two points to swap' : `swap ${pick + 1} with …?`}</text>
        </g>
      </Stage>
      <Controls>
        <PlayPause running={running} set={setRunning} />
        <Btn onClick={() => { setP(Array.from({ length: N }, (_, i) => i)); setSwaps(0); setPick(null); }}>Identity</Btn>
        <Btn onClick={() => { setP(init()); setSwaps(0); setPick(null); }}>Reset</Btn>
        <Btn onClick={() => {
          const q = Array.from({ length: N }, (_, i) => i);
          for (let i = N - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [q[i], q[j]] = [q[j], q[i]]; }
          setP(q); setSwaps(0); setPick(null);
        }}>Random</Btn>
      </Controls>
    </div>
  );
}
