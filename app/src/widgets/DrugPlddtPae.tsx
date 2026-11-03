import { useMemo, useState } from 'react';
import { Btn, Controls, PlayPause, Slider, Stage, prefersReducedMotion, useFrame } from './_kit';

/**
 * Reading AlphaFold-style confidence on a toy 2-domain protein (100 residues): domain A (1–40), a flexible
 * linker (41–50), domain B (51–85) and a disordered C-terminal tail (86–100) that wriggles when animated.
 * View "pLDDT": the 2D cartoon trace coloured by per-residue pLDDT in four bands (≥90 very high, 70–90
 * confident, 50–70 low, <50 very low). A slider hides residues below a pLDDT cut-off.
 * View "PAE": the predicted aligned error matrix (row i = residue aligned on, column j = residue scored, in Å);
 * dark = low expected error. Toggle "rigid domains" to switch between a protein whose two domains have an
 * uncertain relative placement (high off-diagonal PAE) and one whose interface is confidently predicted.
 * Tap the PAE matrix to read a value. All numbers are illustrative, not from a real prediction.
 * props: { view?: 'plddt' | 'pae' (default 'plddt'), rigid?: boolean (default false), hideBelow?: number (default 0), animate?: boolean (default true) }
 */
const N = 100;
const dom = (i: number) => (i < 40 ? 'A' : i < 50 ? 'link' : i < 85 ? 'B' : 'tail');
const PLDDT = Array.from({ length: N }, (_, i) => {
  const d = dom(i);
  const wob = 3 * Math.sin(i * 1.7);
  if (d === 'A') return Math.min(97, (i < 3 ? 78 : 92) + wob);
  if (d === 'B') return Math.min(97, (i > 81 ? 80 : 91) + wob);
  if (d === 'link') return 58 + 6 * Math.sin(i);
  return Math.max(22, 45 - (i - 85) * 1.4 + wob);
});
const band = (p: number) => (p >= 90 ? 'var(--c2)' : p >= 70 ? 'var(--c6)' : p >= 50 ? 'var(--c3)' : 'var(--c5)');

function basePos(): [number, number][] {
  const P: [number, number][] = [];
  const helixBlock = (cx: number, n: number, len: number) => {
    const per = Math.ceil(n / 4);
    for (let k = 0; k < n; k++) {
      const h = Math.floor(k / per), u = (k % per) / (per - 1 || 1);
      const y = 40 + (h % 2 ? 1 - u : u) * len;
      P.push([cx - 27 + h * 18 + 3 * Math.sin(k * 1.9), y]);
    }
  };
  helixBlock(70, 40, 80);
  const a = P[P.length - 1];
  for (let k = 1; k <= 10; k++) P.push([a[0] + k * 6.5, a[1] + 14 * Math.sin((k / 11) * Math.PI)]);
  helixBlock(190, 35, 80);
  return P;
}
const BASE = basePos();

export default function DrugPlddtPae({ view = 'plddt', rigid = false, hideBelow = 0, animate = true }: { view?: 'plddt' | 'pae'; rigid?: boolean; hideBelow?: number; animate?: boolean }) {
  const [v, setV] = useState(view);
  const [rig, setRig] = useState(rigid);
  const [cut, setCut] = useState(hideBelow);
  const [sel, setSel] = useState<[number, number] | null>(null);
  const [running, setRunning] = useState(animate && !prefersReducedMotion());
  const [t, setT] = useState(0);
  useFrame((dt) => setT((x) => x + dt), running);
  const pos = useMemo(() => {
    const P = BASE.slice();
    let [x, y] = P[P.length - 1];
    for (let k = 0; k < 15; k++) {
      const ang = -0.6 + 0.9 * Math.sin(t * 1.3 + k * 0.8) + 0.25 * k;
      x += 7 * Math.cos(ang); y += 7 * Math.sin(ang);
      P.push([x, y]);
    }
    return P;
  }, [t]);
  const pae = useMemo(() => Array.from({ length: N }, (_, i) => Array.from({ length: N }, (_, j) => {
    const a = dom(i), b = dom(j);
    if (i === j) return 0.5;
    if (a === 'tail' || b === 'tail') return 26 + 3 * Math.sin(i + j);
    if (a === 'link' || b === 'link') return 15 + 3 * Math.sin(i * j);
    if (a === b) return 1.5 + Math.min(4, Math.abs(i - j) / 10);
    return rig ? 4 + Math.abs(Math.sin(i + j)) : 21 + 3 * Math.sin(i - j);
  })), [rig]);
  const B = 5, nb = N / B, cs = 150 / nb, M0 = 85, T0 = 12;
  const shownN = PLDDT.filter((p) => p >= cut).length;
  return (
    <div>
      <Stage w={320} h={200} label={v === 'plddt' ? 'Predicted structure coloured by pLDDT' : 'Predicted aligned error matrix'}>
        {v === 'plddt' ? (
          <g>
            {pos.slice(1).map((p, i) => (PLDDT[i] >= cut && PLDDT[i + 1] >= cut ? (
              <line key={i} x1={pos[i][0]} y1={pos[i][1]} x2={p[0]} y2={p[1]} stroke={band(Math.min(PLDDT[i], PLDDT[i + 1]))} strokeWidth={3} strokeLinecap="round" />
            ) : null))}
            <text x={70} y={136} textAnchor="middle" fontSize="9" fill="var(--fg)">domain A</text>
            <text x={190} y={136} textAnchor="middle" fontSize="9" fill="var(--fg)">domain B</text>
            {[['≥90', 'var(--c2)'], ['70–90', 'var(--c6)'], ['50–70', 'var(--c3)'], ['<50', 'var(--c5)']].map(([l, c], k) => (
              <g key={l}><rect x={10 + k * 62} y={176} width={12} height={8} fill={c} /><text x={26 + k * 62} y={183} fontSize="8.5" fill="var(--fg)">{l}</text></g>
            ))}
            <text x={10} y={196} fontSize="8.5" fill="var(--muted)">pLDDT bands · showing {shownN}/{N} residues</text>
          </g>
        ) : (
          <g>
            {Array.from({ length: nb }, (_, I) => Array.from({ length: nb }, (_, J) => (
              <rect key={I * nb + J} x={M0 + J * cs} y={T0 + I * cs} width={cs + 0.2} height={cs + 0.2} fill="var(--c1)"
                opacity={Math.max(0.04, 1 - pae[I * B + 2][J * B + 2] / 30)} />
            )))}
            {sel && <rect x={M0 + Math.floor(sel[1] / B) * cs} y={T0 + Math.floor(sel[0] / B) * cs} width={cs} height={cs} fill="none" stroke="var(--c5)" strokeWidth={1.5} />}
            <rect x={M0} y={T0} width={150} height={150} fill="transparent" stroke="var(--grid)" style={{ cursor: 'pointer' }}
              onClick={(e) => {
                const r = (e.currentTarget as SVGRectElement).getBoundingClientRect();
                const j = Math.floor(((e.clientX - r.left) / r.width) * N), i = Math.floor(((e.clientY - r.top) / r.height) * N);
                if (i >= 0 && j >= 0 && i < N && j < N) setSel([i, j]);
              }} />
            {[0, 40, 50, 85].map((k) => <g key={k}>
              <text x={M0 - 3} y={T0 + k * 1.5 + 6} textAnchor="end" fontSize="7.5" fill="var(--muted)">{k + 1}</text>
              <line x1={M0} x2={M0 + 150} y1={T0 + k * 1.5} y2={T0 + k * 1.5} stroke="var(--fg)" strokeWidth={0.3} opacity={0.5} /></g>)}
            <text x={M0 - 3} y={T0 + 160} textAnchor="end" fontSize="7.5" fill="var(--muted)">aligned on i ↓</text>
            <text x={M0 + 150} y={T0 + 160} textAnchor="end" fontSize="7.5" fill="var(--muted)">scored residue j →</text>
            <text x={160} y={194} textAnchor="middle" fontSize="8.5" fill="var(--fg)">
              {sel ? `PAE(${sel[0] + 1}, ${sel[1] + 1}) ≈ ${pae[sel[0]][sel[1]].toFixed(1)} Å` : 'dark = low expected error (Å) · tap a cell'}
            </text>
          </g>
        )}
      </Stage>
      <Controls>
        <Btn active={v === 'plddt'} onClick={() => setV('plddt')}>pLDDT</Btn>
        <Btn active={v === 'pae'} onClick={() => setV('pae')}>PAE</Btn>
        {v === 'plddt' ? <>
          <Slider label="Hide pLDDT <" value={cut} min={0} max={95} step={5} onChange={setCut} format={(x) => String(Math.round(x))} />
          <PlayPause running={running} set={setRunning} />
        </> : <Btn active={rig} onClick={() => setRig(!rig)}>{rig ? 'Rigid domains ✓' : 'Rigid domains'}</Btn>}
      </Controls>
    </div>
  );
}
