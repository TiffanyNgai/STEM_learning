import { useState } from 'react';
import { Btn, C, Controls, Stage } from './_kit';

/**
 * Cayley table of a small group with rows and columns sorted into the left cosets gH of a chosen
 * subgroup H, and every cell coloured by the coset its product lands in. If H is normal, every
 * coset-by-coset block is a single colour and the small "quotient table" G/H appears underneath;
 * if not, blocks are mixed and the widget says the coset product is not well defined.
 * Buttons switch between the subgroups available for the chosen group.
 * props: { group?: 'Z' | 'D' (cyclic ℤₙ or dihedral Dₙ, default 'D'), n?: number (ℤₙ: 2–12, default 12;
 *          Dₙ: 3–6, default 3), sub?: number (index of the starting subgroup in the button list, default 0) }
 */
type G = { names: string[]; mul: (a: number, b: number) => number; subs: { label: string; els: number[] }[] };
const mod = (a: number, n: number) => ((a % n) + n) % n;
const sup = (k: number) => (k === 1 ? '' : String(k).split('').map((d) => '⁰¹²³⁴⁵⁶⁷⁸⁹'[+d]).join(''));

function cyclic(n: number): G {
  const subs = [] as G['subs'];
  for (let d = 1; d <= n; d++) if (n % d === 0 && d !== 1 && d !== n) subs.push({ label: `⟨${d}⟩`, els: Array.from({ length: n / d }, (_, i) => i * d) });
  if (!subs.length) subs.push({ label: '{0}', els: [0] });
  return { names: Array.from({ length: n }, (_, i) => String(i)), mul: (a, b) => (a + b) % n, subs };
}
// element index k (0..n-1) = r^k ; n+k = r^k s.  (r^a s^f)(r^b s^g) = r^(a ± b) s^(f+g)
function dihedral(n: number): G {
  const names = [...Array.from({ length: n }, (_, k) => (k ? 'r' + sup(k) : 'e')), ...Array.from({ length: n }, (_, k) => (k ? 'r' + sup(k) : '') + 's')];
  const mul = (x: number, y: number) => {
    const [a, f] = [x % n, x >= n ? 1 : 0], [b, g] = [y % n, y >= n ? 1 : 0];
    return mod(a + (f ? -b : b), n) + ((f ^ g) ? n : 0);
  };
  const subs: G['subs'] = [{ label: 'rotations ⟨r⟩', els: Array.from({ length: n }, (_, k) => k) }];
  if (n % 2 === 0) subs.push({ label: `{e, r${sup(n / 2)}}`, els: [0, n / 2] });
  subs.push({ label: '{e, s}', els: [0, n] });
  if (n % 2 === 0) subs.push({ label: `⟨r², s⟩`, els: [...Array.from({ length: n / 2 }, (_, k) => 2 * k), ...Array.from({ length: n / 2 }, (_, k) => n + 2 * k)] });
  return { names, mul, subs };
}

export default function MathCosetCayley({ group = 'D', n, sub = 0 }: { group?: 'Z' | 'D'; n?: number; sub?: number }) {
  const isZ = group === 'Z';
  const m = isZ ? Math.max(2, Math.min(12, Math.round(n ?? 12))) : Math.max(3, Math.min(6, Math.round(n ?? 3)));
  const G = isZ ? cyclic(m) : dihedral(m);
  const [si, setSi] = useState(Math.max(0, Math.min(G.subs.length - 1, Math.round(sub))));
  const H = G.subs[Math.min(si, G.subs.length - 1)].els;
  const N = G.names.length;
  // left cosets gH, in order of first appearance
  const cosetOf = new Array<number>(N).fill(-1); const order: number[] = []; const reps: number[] = [];
  for (let g = 0; g < N; g++) if (cosetOf[g] < 0) {
    reps.push(g); const c = reps.length - 1;
    for (const h of H) { const x = G.mul(g, h); cosetOf[x] = c; order.push(x); }
  }
  const k = reps.length;
  // block colours: well defined iff each block is uniform
  const blockVal: number[][] = Array.from({ length: k }, () => new Array(k).fill(-2));
  for (const a of order) for (const b of order) {
    const v = cosetOf[G.mul(a, b)], i = cosetOf[a], j = cosetOf[b];
    blockVal[i][j] = blockVal[i][j] === -2 ? v : blockVal[i][j] === v ? v : -1;
  }
  const normal = blockVal.every((r) => r.every((v) => v >= 0));
  const cell = Math.min(20, 280 / (N + 1)); const x0 = (320 - (N + 1) * cell) / 2, y0 = 6;
  const tableH = (N + 1) * cell;
  const qc = Math.min(26, 200 / (k + 1)); const qy = y0 + tableH + 26; const qx = (320 - (k + 1) * qc) / 2;
  const cosetName = (c: number) => (isZ ? `${G.names[reps[c]]}+H` : reps[c] === 0 ? 'H' : `${G.names[reps[c]]}H`);
  const H2 = normal ? qy + (k + 1) * qc + 6 : qy + 6;
  const fs = Math.min(9, cell * 0.5);

  return (
    <div>
      <Stage w={320} h={H2} label="Cayley table sorted and coloured by cosets">
        {order.map((g, i) => (
          <g key={'h' + i} fontSize={fs} textAnchor="middle" fill="var(--muted)">
            <text x={x0 + (i + 1.5) * cell} y={y0 + cell * 0.7}>{G.names[g]}</text>
            <text x={x0 + cell / 2} y={y0 + (i + 1) * cell + cell * 0.7}>{G.names[g]}</text>
          </g>
        ))}
        {order.map((a, i) => order.map((b, j) => {
          const v = G.mul(a, b); const c = cosetOf[v];
          return (
            <g key={i + '-' + j}>
              <rect x={x0 + (j + 1) * cell} y={y0 + (i + 1) * cell} width={cell} height={cell} fill={C[c % 6]} fillOpacity={0.55} stroke="var(--grid)" strokeWidth={0.4} />
              <text x={x0 + (j + 1.5) * cell} y={y0 + (i + 1) * cell + cell * 0.68} fontSize={fs} textAnchor="middle" fill="var(--fg)">{G.names[v]}</text>
            </g>
          );
        }))}
        {Array.from({ length: k + 1 }, (_, t) => (
          <g key={'b' + t} stroke="var(--fg)" strokeWidth={1.4}>
            <line x1={x0 + cell} x2={x0 + (N + 1) * cell} y1={y0 + cell + t * H.length * cell} y2={y0 + cell + t * H.length * cell} />
            <line y1={y0 + cell} y2={y0 + (N + 1) * cell} x1={x0 + cell + t * H.length * cell} x2={x0 + cell + t * H.length * cell} />
          </g>
        ))}
        <text x={160} y={y0 + tableH + 16} fontSize="10" textAnchor="middle" fill={normal ? 'var(--c1)' : 'var(--c5)'} fontWeight="bold">
          {normal ? `Every block is one colour: H is normal, G/H has ${k} elements` : 'Mixed blocks: H is NOT normal, coset product ill-defined'}
        </text>
        {normal && (
          <g fontSize="9" textAnchor="middle">
            {reps.map((_, i) => (
              <g key={'q' + i} fill="var(--muted)">
                <text x={qx + (i + 1.5) * qc} y={qy + qc * 0.65}>{cosetName(i)}</text>
                <text x={qx + qc / 2} y={qy + (i + 1) * qc + qc * 0.65}>{cosetName(i)}</text>
              </g>
            ))}
            {reps.map((_, i) => reps.map((_, j) => {
              const v = blockVal[i][j];
              return (
                <g key={'qc' + i + j}>
                  <rect x={qx + (j + 1) * qc} y={qy + (i + 1) * qc} width={qc} height={qc} fill={C[v % 6]} fillOpacity={0.55} stroke="var(--fg)" strokeWidth={0.6} />
                  <text x={qx + (j + 1.5) * qc} y={qy + (i + 1) * qc + qc * 0.65} fill="var(--fg)">{cosetName(v)}</text>
                </g>
              );
            }))}
          </g>
        )}
      </Stage>
      <Controls>
        <span className="w-muted">H =</span>
        {G.subs.map((s, i) => <Btn key={s.label} active={i === si} onClick={() => setSi(i)}>{s.label}</Btn>)}
      </Controls>
    </div>
  );
}
