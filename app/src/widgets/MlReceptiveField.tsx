import { useMemo, useState } from 'react';
import { Btn, C, Controls, Slider, Stage } from './_kit';

/**
 * Receptive-field growth in a 1D stack of convolutions ("same" padding, so units sit above their centre input).
 * Tap a unit in the top layer: every unit that can influence it is highlighted, down to the input row.
 * Printed: r_L = 1 + Σ_l (k_l − 1)·d_l·Π_{i<l} s_i  (kernel k, dilation d, stride s per layer).
 * Modes: 'plain' (stride 1), 'stride' (stride 2 in every layer), 'dilated' (stride 1, dilation 1, 2, 4, …).
 * props: {
 *   layers?: number  1–5 (default 3)
 *   kernel?: number  3 or 5 (default 3)
 *   mode?: 'plain'|'stride'|'dilated' (default 'plain')
 *   width?: number   number of input positions, 16–64 (default 40)
 * }
 */
type Mode = 'plain' | 'stride' | 'dilated';

export default function MlReceptiveField({ layers = 3, kernel = 3, mode = 'plain', width = 40 }: {
  layers?: number; kernel?: number; mode?: Mode; width?: number;
}) {
  const W = Math.max(16, Math.min(64, Math.round(width)));
  const [L, setL] = useState(Math.max(1, Math.min(5, Math.round(layers))));
  const [k, setK] = useState(kernel === 5 ? 5 : 3);
  const [md, setMd] = useState<Mode>(mode);
  const [pick, setPick] = useState<number | null>(null);
  const s = md === 'stride' ? 2 : 1;
  const dil = (l: number) => (md === 'dilated' ? 2 ** l : 1); // l = 0 for first conv layer
  // positions[l] = input-coordinate of each unit in layer l (l = 0 is the input)
  const pos = useMemo(() => {
    const out: number[][] = [Array.from({ length: W }, (_, i) => i)];
    for (let l = 1; l <= L; l++) out.push(out[l - 1].filter((_, j) => j % s === 0));
    return out;
  }, [W, L, s]);
  const top = pos[L];
  const sel = pick !== null && pick < top.length ? pick : Math.floor(top.length / 2);
  const lit = useMemo(() => {
    const sets: Set<number>[] = Array.from({ length: L + 1 }, () => new Set<number>());
    sets[L].add(sel);
    for (let l = L; l >= 1; l--) {
      const d = dil(l - 1), h = (k - 1) / 2;
      for (const j of sets[l]) for (let a = -h; a <= h; a++) {
        const q = j * s + a * d;
        if (q >= 0 && q < pos[l - 1].length) sets[l - 1].add(q);
      }
    }
    return sets;
  }, [sel, L, k, md, pos]);
  let rf = 1, jump = 1;
  const terms: string[] = [];
  for (let l = 0; l < L; l++) { const add = (k - 1) * dil(l) * jump; terms.push(String(add)); rf += add; jump *= s; }
  const x0 = 12, x1 = 308, dx = (x1 - x0) / (W - 1), rowH = Math.min(34, 150 / L), yIn = 30 + L * rowH;
  const X = (p: number) => x0 + p * dx;
  const Y = (l: number) => yIn - l * rowH;
  return (
    <div>
      <Stage w={320} h={yIn + 44} label="Receptive field of one output unit growing through stacked convolution layers">
        {pos.map((row, l) => l === 0 ? null : row.map((p, j) => lit[l].has(j) ? (() => {
          const d = dil(l - 1), h = (k - 1) / 2, lines = [];
          for (let a = -h; a <= h; a++) {
            const q = j * s + a * d;
            if (q >= 0 && q < pos[l - 1].length) lines.push(<line key={a} x1={X(p)} y1={Y(l)} x2={X(pos[l - 1][q])} y2={Y(l - 1)} stroke={C[1]} strokeWidth={0.7} opacity={0.6} />);
          }
          return <g key={l + '-' + j}>{lines}</g>;
        })() : null))}
        {pos.map((row, l) => row.map((p, j) => {
          const on = lit[l].has(j), isTop = l === L;
          return <circle key={'c' + l + '-' + j} cx={X(p)} cy={Y(l)} r={isTop ? 3.6 : 2.6}
            fill={on ? (l === 0 ? C[2] : C[1]) : 'var(--surface)'} stroke={on ? 'none' : 'var(--muted)'} strokeWidth={0.6}
            onClick={isTop ? () => setPick(j) : undefined} style={isTop ? { cursor: 'pointer' } : undefined} />;
        }))}
        {pos.map((_, l) => <text key={'t' + l} x={2} y={Y(l) - 5} fontSize="7.5" fill="var(--muted)">
          {l === 0 ? 'input' : `layer ${l}${md === 'dilated' ? ` (d=${dil(l - 1)})` : md === 'stride' ? ' (s=2)' : ''}`}</text>)}
        <text x={160} y={14} fontSize="8.5" textAnchor="middle" fill="var(--fg)">tap a top-layer unit · {lit[0].size} input positions reach it</text>
        <text x={160} y={yIn + 20} fontSize="9" textAnchor="middle" fill="var(--fg)">
          receptive field r = 1 + {terms.join(' + ')} = <tspan fill={C[2]} fontWeight="bold">{rf}</tspan>
        </text>
        {rf > lit[0].size && <text x={160} y={yIn + 33} fontSize="7.5" textAnchor="middle" fill="var(--muted)">(clipped by the image border here)</text>}
      </Stage>
      <Controls>
        <Slider label="layers L" min={1} max={5} step={1} value={L} onChange={(v) => { setL(v); setPick(null); }} format={(v) => String(v)} />
        <Btn active={k === 3} onClick={() => setK(3)}>3-wide kernel</Btn>
        <Btn active={k === 5} onClick={() => setK(5)}>5-wide kernel</Btn>
        <Btn active={md === 'plain'} onClick={() => { setMd('plain'); setPick(null); }}>stride 1</Btn>
        <Btn active={md === 'stride'} onClick={() => { setMd('stride'); setPick(null); }}>stride 2</Btn>
        <Btn active={md === 'dilated'} onClick={() => { setMd('dilated'); setPick(null); }}>dilated</Btn>
      </Controls>
    </div>
  );
}
