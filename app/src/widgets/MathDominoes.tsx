import { useState } from 'react';
import { Btn, Controls, Slider, Stage, prefersReducedMotion, useFrame } from './_kit';

/**
 * Induction as falling dominoes. Domino k stands for the statement P(k).
 * "Base case" = someone pushes domino 1. "Inductive step" = every domino k knocks over k+1.
 * Turn either off (or break the chain after domino b) and press Push to see which dominoes fall.
 * Reduced-motion users get the final state instantly.
 * props: { n?: number (dominoes shown, 4–14, default 10), base?: boolean (default true),
 *          step?: boolean (default true), breakAfter?: number (0 = no break; default 0), controls?: boolean (default true) }
 */
export default function MathDominoes({ n = 10, base = true, step = true, breakAfter = 0, controls = true }: {
  n?: number; base?: boolean; step?: boolean; breakAfter?: number; controls?: boolean;
}) {
  n = Math.max(4, Math.min(14, Math.round(n)));
  const [hasBase, setBase] = useState(base);
  const [hasStep, setStep] = useState(step);
  const [brk, setBrk] = useState(Math.max(0, Math.min(n - 1, Math.round(breakAfter))));
  const [t, setT] = useState(-1); // -1 = not pushed yet
  const running = t >= 0 && t < n * 0.3 + 1;
  useFrame((dt) => setT((x) => x + dt), running);

  // how many dominoes the chain reaches
  const reach = !hasBase ? 0 : !hasStep ? 1 : brk > 0 ? brk : n;
  const push = () => setT(prefersReducedMotion() ? 99 : 0);
  const reset = () => setT(-1);
  const change = (f: () => void) => { f(); reset(); };

  const W = 320, H = 170, gap = (W - 30) / n, dw = Math.min(9, gap * 0.35), dh = Math.min(70, gap * 2.6);
  const floor = 120;
  // fall angle of domino i (0-indexed): starts at time i*0.3, takes 0.35 s, tips to ~ (lean onto next)
  const maxAng = (i: number) => (i === n - 1 || i + 1 >= reach ? 82 : Math.min(82, (Math.asin(Math.min(1, (gap - dw) / dh)) * 180) / Math.PI));
  const angle = (i: number) => {
    if (t < 0 || i >= reach) return 0;
    const p = Math.max(0, Math.min(1, (t - i * 0.3) / 0.35));
    return maxAng(i) * p * p;
  };
  const msg = t < 0 ? 'Press Push.'
    : !hasBase ? 'No base case: nothing falls at all.'
      : !hasStep ? 'No inductive step: only P(1) falls.'
        : brk > 0 ? `Gap after P(${brk}): P(${brk + 1}) onward stay up.`
          : 'Base case + step: every P(n) falls.';

  return (
    <div>
      <Stage w={W} h={H} label="Dominoes illustrating induction">
        <line x1={6} x2={W - 6} y1={floor} y2={floor} stroke="var(--fg)" strokeWidth={1.2} />
        {hasBase && t < 0 && <text x={4} y={floor - dh - 6} fontSize="9" fill="var(--c3)">push →</text>}
        {Array.from({ length: n }, (_, i) => {
          const x = 20 + i * gap; const a = angle(i); const down = a > 0;
          const broken = hasStep && brk > 0 && i === brk - 1;
          return (
            <g key={i}>
              <g transform={`rotate(${a} ${x + dw} ${floor})`}>
                <rect x={x} y={floor - dh} width={dw} height={dh} rx={1.5}
                  fill={down ? 'var(--c1)' : 'var(--c2)'} fillOpacity={0.85} stroke="var(--fg)" strokeWidth={0.6} />
              </g>
              <text x={x + dw / 2} y={floor + 13} fontSize={n > 11 ? 7 : 8} textAnchor="middle" fill="var(--fg)">P({i + 1})</text>
              {broken && <text x={x + dw + (gap - dw) / 2} y={floor - dh - 4} fontSize="12" textAnchor="middle" fill="var(--c5)">✕</text>}
              {!hasStep && i < n - 1 && <text x={x + dw + (gap - dw) / 2} y={floor - dh - 4} fontSize="9" textAnchor="middle" fill="var(--c5)">✕</text>}
            </g>
          );
        })}
        <text x={W - 8} y={floor + 13} fontSize="10" textAnchor="end" fill="var(--muted)">…</text>
        <text x={8} y={H - 22} fontSize="10" fill="var(--fg)">{msg}</text>
        <text x={8} y={H - 8} fontSize="9" fill="var(--muted)">fallen: {Array.from({ length: n }, (_, i) => angle(i)).filter((a) => a > 1).length} of the {n} shown</text>
      </Stage>
      {controls && (
        <Controls>
          <Btn onClick={push}>Push</Btn>
          <Btn onClick={reset}>Reset</Btn>
          <Btn active={hasBase} onClick={() => change(() => setBase(!hasBase))}>Base case {hasBase ? '✓' : '✗'}</Btn>
          <Btn active={hasStep} onClick={() => change(() => setStep(!hasStep))}>Inductive step {hasStep ? '✓' : '✗'}</Btn>
          <Slider label="gap after" value={brk} min={0} max={n - 1} step={1} onChange={(v) => change(() => setBrk(v))} format={(v) => (v ? 'P(' + v + ')' : 'none')} />
        </Controls>
      )}
    </div>
  );
}
