import { useRef, useState } from 'react';
import { Btn, C, Controls, Stage, useFrame } from './_kit';

/**
 * Symmetries of a regular n-gon (dihedral group D_n, or cyclic C_n if reflections are off).
 * Press r (rotate 2π/n anticlockwise) or s (flip across the fixed vertical axis); each press
 * is applied AFTER what has already been done, so the running element is (press) ∘ (current).
 * Shows the current element as r^k or r^k s, the word of presses, the vertex permutation and
 * (optionally) the Cayley table with every cell equal to the current element highlighted.
 * props: { n?: number (3–8, default 3), reflect?: boolean (default true), showTable?: boolean (default true) }
 */
type El = [number, number]; // (k, f) means r^k s^f : first s^f, then r^k
const mod = (a: number, n: number) => ((a % n) + n) % n;
const sup = (k: number) => (k === 1 ? '' : String(k).split('').map((d) => '⁰¹²³⁴⁵⁶⁷⁸⁹'[+d]).join(''));
const nameOf = ([k, f]: El) => (k === 0 ? (f ? 's' : 'e') : 'r' + sup(k) + (f ? 's' : ''));
const compose = (n: number, [k1, f1]: El, [k2, f2]: El): El => [mod(k1 + (f1 ? -k2 : k2), n), f1 ^ f2];
/** 2×2 matrix of r^k s^f with s = reflection across the vertical axis. */
const mat = (n: number, [k, f]: El) => {
  const a = (2 * Math.PI * k) / n, c = Math.cos(a), s = Math.sin(a);
  return f ? [-c, -s, -s, c] : [c, -s, s, c];
};

export default function SymmetryRotator({ n = 3, reflect = true, showTable = true }: { n?: number; reflect?: boolean; showTable?: boolean }) {
  n = Math.max(3, Math.min(8, Math.round(n)));
  const [el, setEl] = useState<El>([0, 0]);
  const [word, setWord] = useState<string[]>([]);
  // animation: from matrix M0 to M1 over 0.45 s
  const anim = useRef({ from: mat(n, [0, 0]), to: mat(n, [0, 0]), p: 1, turn: 0 });
  const [, force] = useState(0);
  useFrame((dt) => { const a = anim.current; a.p = Math.min(1, a.p + dt / 0.45); force((v) => v + 1); }, anim.current.p < 1);

  const apply = (g: El, label: string) => {
    const next = compose(n, g, el);
    anim.current = { from: mat(n, el), to: mat(n, next), p: 0, turn: g[1] ? 0 : (2 * Math.PI * g[0]) / n };
    setEl(next); setWord((w) => [...w, label].slice(-8));
  };
  const reset = () => { anim.current = { from: mat(n, [0, 0]), to: mat(n, [0, 0]), p: 1, turn: 0 }; setEl([0, 0]); setWord([]); };

  // current drawing matrix: rotations interpolate by angle, flips by linear blend (looks like a 3D flip)
  const a = anim.current; const e = a.p < 1 ? 1 - Math.pow(1 - a.p, 3) : 1;
  let M = a.to;
  if (e < 1) {
    if (a.turn) {
      const th = a.turn * e, c = Math.cos(th), s = Math.sin(th), F = a.from;
      M = [c * F[0] - s * F[2], c * F[1] - s * F[3], s * F[0] + c * F[2], s * F[1] + c * F[3]];
    } else M = a.from.map((v, i) => v + (a.to[i] - v) * e);
  }
  const cx = showTable ? 82 : 160, cy = 100, R = 58;
  const base = Array.from({ length: n }, (_, i) => [Math.cos(Math.PI / 2 + (2 * Math.PI * i) / n), Math.sin(Math.PI / 2 + (2 * Math.PI * i) / n)]);
  const P = base.map(([x, y]) => [cx + R * (M[0] * x + M[1] * y), cy - R * (M[2] * x + M[3] * y)]);
  // permutation: vertex i ends at position k + (f ? -i : i)
  const perm = base.map((_, i) => mod(el[0] + (el[1] ? -i : i), n));
  const elems: El[] = [...Array.from({ length: n }, (_, k) => [k, 0] as El), ...(reflect ? Array.from({ length: n }, (_, k) => [k, 1] as El) : [])];
  const N = elems.length; const cell = Math.min(15, 170 / (N + 1));
  const tx = 316 - (N + 1) * cell, ty = 22;

  return (
    <div>
      <Stage w={320} h={200} label={`Symmetries of a regular ${n}-gon`}>
        {base.map(([x, y], i) => <circle key={'slot' + i} cx={cx + R * x} cy={cy - R * y} r={9} fill="none" stroke="var(--grid)" strokeDasharray="2 2" />)}
        {reflect && <line x1={cx} x2={cx} y1={cy - R - 18} y2={cy + R + 14} stroke="var(--c5)" strokeDasharray="4 3" strokeWidth={0.8} />}
        {reflect && <text x={cx + 3} y={cy + R + 14} fontSize="8" fill="var(--c5)">s-axis</text>}
        <polygon points={P.map((p) => p.join(',')).join(' ')} fill="var(--c2)" fillOpacity={0.18} stroke="var(--c2)" strokeWidth={2} />
        <line x1={cx} y1={cy} x2={P[0][0]} y2={P[0][1]} stroke="var(--c3)" strokeWidth={1.5} />
        {P.map(([x, y], i) => (
          <g key={i}><circle cx={x} cy={y} r={8} fill={C[i % 6]} /><text x={x} y={y + 3} fontSize="9" textAnchor="middle" fill="var(--surface)" fontWeight="bold">{i + 1}</text></g>
        ))}
        <text x={8} y={14} fontSize="11" fill="var(--fg)">g = <tspan fontWeight="bold" fill="var(--c4)">{nameOf(el)}</tspan></text>
        <text x={8} y={196} fontSize="8" fill="var(--muted)">vertex i → slot: {perm.map((p, i) => `${i + 1}→${p + 1}`).join(' ')}</text>
        {showTable && (
          <g fontSize={Math.min(8, cell * 0.55)} textAnchor="middle">
            <text x={tx + ((N + 1) * cell) / 2} y={ty - 8} fill="var(--muted)" fontSize="8">row ∘ column (column first)</text>
            {elems.map((g, i) => (
              <g key={'h' + i}>
                <text x={tx + (i + 1.5) * cell} y={ty + cell * 0.7} fill="var(--muted)">{nameOf(g)}</text>
                <text x={tx + cell / 2} y={ty + (i + 1) * cell + cell * 0.7} fill="var(--muted)">{nameOf(g)}</text>
              </g>
            ))}
            {elems.map((a, i) => elems.map((b, j) => {
              const v = compose(n, a, b); const hit = v[0] === el[0] && v[1] === el[1];
              return (
                <g key={i + '-' + j}>
                  <rect x={tx + (j + 1) * cell} y={ty + (i + 1) * cell} width={cell} height={cell} fill={hit ? 'var(--c4)' : v[1] ? 'var(--c5)' : 'var(--c2)'} fillOpacity={hit ? 0.75 : 0.12} stroke="var(--grid)" strokeWidth={0.4} />
                  <text x={tx + (j + 1.5) * cell} y={ty + (i + 1) * cell + cell * 0.68} fill="var(--fg)">{nameOf(v)}</text>
                </g>
              );
            }))}
          </g>
        )}
      </Stage>
      <Controls>
        <Btn onClick={() => apply([1, 0], 'r')}>⟲ r (rotate)</Btn>
        {reflect && <Btn onClick={() => apply([0, 1], 's')}>⇋ s (flip)</Btn>}
        <Btn onClick={reset}>Reset</Btn>
        <span className="w-muted">presses: {word.length ? word.join(' → ') : '—'}</span>
      </Controls>
    </div>
  );
}
