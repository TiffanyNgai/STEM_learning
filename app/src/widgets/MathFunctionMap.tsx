import { useState } from 'react';
import { Btn, Controls, Stage } from './_kit';

/**
 * Arrow diagram of a function f: A → B between two small finite sets.
 * Tap an element of A to move its arrow to the next element of B. Live badges say whether f is
 * injective (one-to-one), surjective (onto) and bijective, and name the witness when it fails.
 * When f is bijective, "Show inverse" reverses every arrow (f⁻¹: B → A).
 * props: {
 *   domain?: string[]    (labels of A, 1–6, default ['1','2','3'])
 *   codomain?: string[]  (labels of B, 1–6, default ['a','b','c'])
 *   map?: number[]       (index into codomain for each domain element, default [0,0,1])
 *   editable?: boolean   (default true)
 * }
 */
export default function MathFunctionMap({ domain = ['1', '2', '3'], codomain = ['a', 'b', 'c'], map = [0, 0, 1], editable = true }: {
  domain?: string[]; codomain?: string[]; map?: number[]; editable?: boolean;
}) {
  const A = domain.slice(0, 6), B = codomain.slice(0, 6);
  const [f, setF] = useState<number[]>(A.map((_, i) => Math.max(0, Math.min(B.length - 1, map[i] ?? 0))));
  const [inv, setInv] = useState(false);
  const sp = Math.max(A.length, B.length) > 4 ? 22 : 26;
  const yA = (i: number) => 92 + (i - (A.length - 1) / 2) * sp;
  const yB = (j: number) => 92 + (j - (B.length - 1) / 2) * sp;
  const xA = 70, xB = 250;

  const pre = B.map((_, j) => f.map((v, i) => (v === j ? i : -1)).filter((i) => i >= 0));
  const clash = pre.findIndex((p) => p.length > 1);
  const miss = pre.findIndex((p) => p.length === 0);
  const inj = clash < 0, sur = miss < 0, bij = inj && sur;
  const showInv = inv && bij;

  const badge = (ok: boolean, label: string, x: number) => (
    <g>
      <rect x={x} y={176} width={96} height={18} rx={9} fill={ok ? 'var(--c1)' : 'var(--c5)'} fillOpacity={0.18} stroke={ok ? 'var(--c1)' : 'var(--c5)'} />
      <text x={x + 48} y={189} fontSize="10" textAnchor="middle" fill="var(--fg)" fontWeight="bold">{ok ? '✓' : '✗'} {label}</text>
    </g>
  );
  const note = !inj ? `not injective: ${A[pre[clash][0]]} and ${A[pre[clash][1]]} both ↦ ${B[clash]}`
    : !sur ? `not surjective: nothing maps to ${B[miss]}` : showInv ? 'f⁻¹ undoes f: every arrow reversed' : 'bijective: a perfect pairing';

  return (
    <div>
      <Stage w={320} h={200} label="Arrow diagram of a function">
        <defs>
          <marker id="mfm-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill={showInv ? 'var(--c4)' : 'var(--c2)'} />
          </marker>
        </defs>
        <ellipse cx={xA} cy={92} rx={36} ry={Math.min(70, Math.max(30, A.length * 13))} fill="var(--c2)" fillOpacity={0.07} stroke="var(--muted)" />
        <ellipse cx={xB} cy={92} rx={36} ry={Math.min(70, Math.max(30, B.length * 13))} fill="var(--c3)" fillOpacity={0.07} stroke="var(--muted)" />
        <text x={xA} y={14} fontSize="11" textAnchor="middle" fill="var(--fg)">{showInv ? 'B = codomain of f⁻¹' : 'A (domain)'}</text>
        <text x={xB} y={14} fontSize="11" textAnchor="middle" fill="var(--fg)">{showInv ? 'A' : 'B (codomain)'}</text>
        <text x={160} y={14} fontSize="11" textAnchor="middle" fill={showInv ? 'var(--c4)' : 'var(--c2)'} fontWeight="bold">{showInv ? 'f⁻¹ ←' : 'f →'}</text>
        {f.map((j, i) => {
          const x1 = xA + 10, y1 = yA(i), x2 = xB - 10, y2 = yB(j);
          return <path key={i + '-' + j} d={`M${x1},${y1} C${x1 + 60},${y1} ${x2 - 60},${y2} ${x2},${y2}`} fill="none"
            stroke={showInv ? 'var(--c4)' : 'var(--c2)'} strokeWidth={1.6}
            markerEnd={showInv ? undefined : 'url(#mfm-arrow)'} markerStart={showInv ? 'url(#mfm-arrow)' : undefined} />;
        })}
        {A.map((a, i) => (
          <g key={'a' + i} onClick={() => editable && !showInv && setF((g) => g.map((v, k) => (k === i ? (v + 1) % B.length : v)))} style={{ cursor: editable ? 'pointer' : 'default' }}>
            <circle cx={xA} cy={yA(i)} r={10} fill="var(--c2)" />
            <text x={xA} y={yA(i) + 4} fontSize="11" textAnchor="middle" fill="var(--surface)" fontWeight="bold">{a}</text>
          </g>
        ))}
        {B.map((b, j) => (
          <g key={'b' + j}>
            <circle cx={xB} cy={yB(j)} r={10} fill={pre[j].length ? 'var(--c3)' : 'var(--surface)'} stroke="var(--c3)" strokeWidth={1.5} />
            <text x={xB} y={yB(j) + 4} fontSize="11" textAnchor="middle" fill={pre[j].length ? 'var(--surface)' : 'var(--fg)'} fontWeight="bold">{b}</text>
          </g>
        ))}
        {badge(inj, 'injective', 6)}{badge(sur, 'surjective', 112)}{badge(bij, 'bijective', 218)}
        <text x={160} y={170} fontSize="10" textAnchor="middle" fill="var(--muted)">{note}</text>
      </Stage>
      <Controls>
        {editable && <span className="w-muted">Tap a dot in A to re-aim its arrow.</span>}
        <Btn active={showInv} onClick={() => setInv(!inv)}>{bij ? (inv ? 'Hide inverse' : 'Show inverse') : 'Inverse (needs bijection)'}</Btn>
      </Controls>
    </div>
  );
}
