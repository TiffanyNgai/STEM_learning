import { useRef, useState } from 'react';
import { Btn, Controls, PlayPause, Stage, compileExpr, prefersReducedMotion, scale, useFrame } from './_kit';

/**
 * Nested intervals by bisection. Start with [a, b] where f changes sign (f(a) < 0 < f(b) or vice versa).
 * Each "Halve" keeps the half on which f still changes sign, so the intervals are nested and their length
 * (b − a)/2ᵏ shrinks to 0. Completeness says exactly one real number lies in all of them — for f = x² − 2 that
 * number is √2, which is not rational. The top line is the whole [a, b]; the bottom line zooms on the current interval.
 * props: { fn?: string (default 'x^2 - 2'), a?: number (default 1), b?: number (default 2), name?: string (label of the
 *          point being trapped, default '√2'), maxSteps?: number (default 30) }
 */
export default function MathNestedIntervals({ fn = 'x^2 - 2', a = 1, b = 2, name = '√2', maxSteps = 30 }: {
  fn?: string; a?: number; b?: number; name?: string; maxSteps?: number;
}) {
  const f = compileExpr(fn, ['x']);
  const [hist, setHist] = useState<[number, number][]>([[a, b]]);
  const [run, setRun] = useState(false);
  const acc = useRef(0);
  const k = hist.length - 1;
  const [lo, hi] = hist[k];
  const halve = () => setHist((h) => {
    if (h.length > maxSteps) return h;
    const [l, r] = h[h.length - 1]; const m = (l + r) / 2; const fm = f(m);
    const next: [number, number] = fm === 0 ? [m, m] : Math.sign(fm) === Math.sign(f(l)) ? [m, r] : [l, m];
    return [...h, next];
  });
  useFrame((dt) => {
    acc.current += dt; if (acc.current < 0.6) return; acc.current = 0;
    if (k >= maxSteps) setRun(false); else halve();
  }, run);
  const top = scale([a, b], [20, 300]);
  const zpad = (hi - lo) * 0.25 || 1e-12;
  const zoom = scale([lo - zpad, hi + zpad], [20, 300]);
  const digits = Math.min(15, Math.max(3, Math.ceil(-Math.log10(hi - lo || 1e-15)) + 1));
  const show = hist.slice(Math.max(0, k - 4));
  return (
    <div>
      <Stage w={320} h={210} label="Nested intervals by bisection">
        <text x={20} y={14} fontSize="9" style={{ fill: 'var(--muted)' }}>whole interval [{a}, {b}]</text>
        <line x1={20} x2={300} y1={30} y2={30} stroke="var(--fg)" />
        {hist.map(([l, r], i) => <rect key={i} x={top(l)} width={Math.max(0.8, top(r) - top(l))} y={24} height={12}
          fill="var(--c2)" fillOpacity={0.12 + 0.6 * (i === k ? 1 : 0)} />)}
        <text x={20} y={46} fontSize="8" textAnchor="middle">{a}</text>
        <text x={300} y={46} fontSize="8" textAnchor="middle">{b}</text>
        <text x={20} y={66} fontSize="9" style={{ fill: 'var(--muted)' }}>zoomed on step {k}</text>
        <line x1={20} x2={300} y1={84} y2={84} stroke="var(--fg)" />
        <rect x={zoom(lo)} width={Math.max(1, zoom(hi) - zoom(lo))} y={76} height={16} fill="var(--c2)" fillOpacity={0.5} stroke="var(--c2)" />
        <text x={zoom(lo)} y={104} fontSize="8.5" textAnchor="middle" style={{ fill: 'var(--c5)' }}>{lo.toFixed(digits)}</text>
        <text x={zoom(hi)} y={116} fontSize="8.5" textAnchor="middle" style={{ fill: 'var(--c1)' }}>{hi.toFixed(digits)}</text>
        {show.map(([l, r], i) => {
          const j = k - show.length + 1 + i;
          return <text key={j} x={20} y={136 + i * 12} fontSize="9" style={{ fill: j === k ? 'var(--fg)' : 'var(--muted)' }}>
            I{j} = [{l.toFixed(Math.min(12, j + 2))}, {r.toFixed(Math.min(12, j + 2))}]   length {((b - a) / 2 ** j).toPrecision(3)}
          </text>;
        })}
        <text x={20} y={204} fontSize="9" style={{ fill: 'var(--c3)' }}>{name} is trapped in every interval</text>
      </Stage>
      <Controls>
        <Btn onClick={halve}>Halve</Btn>
        {!prefersReducedMotion() && <PlayPause running={run} set={setRun} />}
        <Btn onClick={() => { setRun(false); setHist([[a, b]]); }}>Reset</Btn>
      </Controls>
    </div>
  );
}
