import { useMemo, useState } from 'react';
import { Btn, Controls, Slider, Stage, rng } from './_kit';

/**
 * Coevolution → contacts, on a toy multiple sequence alignment (MSA). 10 columns, each with two possible
 * residues (a binary simplification of the 21-state Potts model used by real DCA). Planted couplings mimic
 * residues in 3D contact: 2↔5 (charge swap K–E ↔ E–K), 3↔6 (small/large compensation, weaker), 8↔9 and 9↔10.
 * The chain 8–9–10 creates an INDIRECT correlation between 8 and 10 that is not a contact.
 * Left: the first 16 sequences, letters coloured by state. Right: pair scores (upper triangle) and the true
 * contacts (lower triangle, rings). Mode "Correlation" = |Pearson r| (like mutual information, fooled by
 * transitivity); mode "Direct" = |partial correlation| from the inverse covariance matrix (the Gaussian /
 * mean-field idea behind DCA), which removes the indirect 8–10 signal. The 4 top-scoring pairs are outlined.
 * Tap a matrix cell to highlight those two columns.
 * props: { nSeq?: number (sequences used, default 300), mode?: 'corr' | 'direct' (default 'corr'), seed?: number }
 */
const L = 10;
const STATES = [['A', 'V'], ['K', 'E'], ['G', 'W'], ['S', 'T'], ['E', 'K'], ['F', 'G'], ['N', 'D'], ['I', 'L'], ['L', 'M'], ['Q', 'R']];
const TRUE: [number, number][] = [[1, 4], [2, 5], [7, 8], [8, 9]];
const isTrue = (i: number, j: number) => TRUE.some(([a, b]) => (a === i && b === j) || (a === j && b === i));

function makeMSA(n: number, seed: number) {
  const r = rng(seed);
  const flip = (b: number, p: number) => (r.u() < p ? b : 1 - b);
  const rows: number[][] = [];
  for (let s = 0; s < n; s++) {
    const x: number[] = Array.from({ length: L }, () => (r.u() < 0.5 ? 0 : 1));
    x[4] = flip(x[1], 0.95);
    x[5] = flip(x[2], 0.85);
    x[8] = flip(x[7], 0.95);
    x[9] = flip(x[8], 0.95);
    rows.push(x);
  }
  return rows;
}

function invert(A: number[][]): number[][] {
  const n = A.length;
  const M = A.map((row, i) => [...row, ...Array.from({ length: n }, (_, j) => (i === j ? 1 : 0))]);
  for (let c = 0; c < n; c++) {
    let p = c;
    for (let k = c + 1; k < n; k++) if (Math.abs(M[k][c]) > Math.abs(M[p][c])) p = k;
    [M[c], M[p]] = [M[p], M[c]];
    const d = M[c][c];
    for (let k = 0; k < 2 * n; k++) M[c][k] /= d;
    for (let k = 0; k < n; k++) if (k !== c) { const f = M[k][c]; for (let m = 0; m < 2 * n; m++) M[k][m] -= f * M[c][m]; }
  }
  return M.map((row) => row.slice(n));
}

export default function DrugCoevolutionMSA({ nSeq = 300, mode: mode0 = 'corr', seed = 7 }: { nSeq?: number; mode?: 'corr' | 'direct'; seed?: number }) {
  const [n, setN] = useState(nSeq);
  const [mode, setMode] = useState(mode0);
  const [sel, setSel] = useState<[number, number] | null>(null);
  const msa = useMemo(() => makeMSA(Math.max(10, Math.round(n)), seed), [n, seed]);
  const S = useMemo(() => {
    const N = msa.length;
    const mu = Array.from({ length: L }, (_, i) => msa.reduce((a, x) => a + x[i], 0) / N);
    const C = Array.from({ length: L }, (_, i) => Array.from({ length: L }, (_, j) =>
      msa.reduce((a, x) => a + (x[i] - mu[i]) * (x[j] - mu[j]), 0) / N + (i === j ? 0.02 : 0)));
    if (mode === 'corr') return C.map((row, i) => row.map((v, j) => (i === j ? 0 : Math.abs(v / Math.sqrt(C[i][i] * C[j][j])))));
    const P = invert(C);
    return P.map((row, i) => row.map((v, j) => (i === j ? 0 : Math.abs(v / Math.sqrt(P[i][i] * P[j][j])))));
  }, [msa, mode]);
  const pairs: [number, number, number][] = [];
  for (let i = 0; i < L; i++) for (let j = i + 1; j < L; j++) pairs.push([i, j, S[i][j]]);
  pairs.sort((a, b) => b[2] - a[2]);
  const top = pairs.slice(0, 4);
  const hits = top.filter(([i, j]) => isTrue(i, j)).length;
  const max = Math.max(1e-6, pairs[0][2]);
  const cw = 11, rh = 9.4, X0 = 10, Y0 = 26;
  const M0 = 160, T0 = 26, cs = 14.5;
  const on = (c: number) => sel !== null && (sel[0] === c || sel[1] === c);
  return (
    <div>
      <Stage w={320} h={210} label="Toy multiple sequence alignment and coevolution score matrix">
        <text x={X0} y={12} fontSize="8.5" fill="var(--muted)">MSA (first 16 of {msa.length} sequences)</text>
        {Array.from({ length: L }, (_, c) => (
          <g key={'c' + c}>
            {on(c) && <rect x={X0 + c * cw} y={Y0 - 9} width={cw} height={16 * rh + 10} fill="var(--c5)" opacity={0.18} />}
            <text x={X0 + c * cw + cw / 2} y={Y0 - 2} fontSize="7.5" textAnchor="middle" fill="var(--muted)">{c + 1}</text>
          </g>
        ))}
        {msa.slice(0, 16).map((x, s) => x.map((b, c) => (
          <text key={s * L + c} x={X0 + c * cw + cw / 2} y={Y0 + 8 + s * rh} fontSize="8" fontFamily="monospace" fontWeight="700"
            textAnchor="middle" fill={b ? 'var(--c3)' : 'var(--c2)'}>{STATES[c][b]}</text>
        )))}
        <text x={M0 + (L * cs) / 2} y={12} fontSize="8.5" textAnchor="middle" fill="var(--muted)">
          {mode === 'corr' ? 'correlation |r|' : 'direct coupling (partial corr.)'}
        </text>
        {Array.from({ length: L }, (_, i) => Array.from({ length: L }, (_, j) => {
          const x = M0 + j * cs, y = T0 + i * cs;
          if (i === j) return <rect key={i * L + j} x={x} y={y} width={cs} height={cs} fill="var(--grid)" />;
          if (j > i) {
            const isTop = top.some(([a, b]) => a === i && b === j);
            const isSel = sel && sel[0] === i && sel[1] === j;
            return (
              <g key={i * L + j}>
                <rect x={x} y={y} width={cs} height={cs} fill="var(--c4)" opacity={0.08 + 0.92 * (S[i][j] / max)} />
                {(isTop || isSel) && <rect x={x + 0.8} y={y + 0.8} width={cs - 1.6} height={cs - 1.6} fill="none"
                  stroke={isSel ? 'var(--c5)' : 'var(--fg)'} strokeWidth={1.4} />}
              </g>
            );
          }
          return (
            <g key={i * L + j}>
              <rect x={x} y={y} width={cs} height={cs} fill="none" stroke="var(--grid)" strokeWidth={0.4} />
              {isTrue(i, j) && <circle cx={x + cs / 2} cy={y + cs / 2} r={4.2} fill="none" stroke="var(--c1)" strokeWidth={1.8} />}
            </g>
          );
        }))}
        <rect x={M0} y={T0} width={L * cs} height={L * cs} fill="transparent" style={{ cursor: 'pointer' }}
          onClick={(e) => {
            const r = (e.currentTarget as SVGRectElement).getBoundingClientRect();
            const j = Math.floor(((e.clientX - r.left) / r.width) * L), i = Math.floor(((e.clientY - r.top) / r.height) * L);
            if (i >= 0 && j >= 0 && i < L && j < L && i !== j) setSel([Math.min(i, j), Math.max(i, j)]);
          }} />
        <text x={M0 + 2} y={T0 + L * cs + 11} fontSize="8" fill="var(--muted)">upper: scores · lower: true contacts ○</text>
        <text x={X0} y={196} fontSize="8.5" fill="var(--fg)">
          Top 4 pairs: {top.map(([i, j]) => `${i + 1}–${j + 1}`).join(', ')} → {hits}/4 true contacts
        </text>
        <text x={X0} y={207} fontSize="8.5" fill="var(--muted)">
          {sel ? `columns ${sel[0] + 1} & ${sel[1] + 1}: score ${S[sel[0]][sel[1]].toFixed(2)} ${isTrue(sel[0], sel[1]) ? '(real contact)' : '(not a contact)'}` : 'Tap a cell to inspect a column pair'}
        </text>
      </Stage>
      <Controls>
        <Btn active={mode === 'corr'} onClick={() => setMode('corr')}>Correlation</Btn>
        <Btn active={mode === 'direct'} onClick={() => setMode('direct')}>Direct (DCA-like)</Btn>
        <Slider label="Sequences" value={n} min={15} max={1000} step={5} onChange={setN} format={(v) => String(Math.round(v))} />
      </Controls>
    </div>
  );
}
