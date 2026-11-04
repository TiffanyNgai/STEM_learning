import { useMemo, useState } from 'react';
import { Btn, C, Controls, Slider, Stage, pathOf, rng } from './_kit';

/**
 * Inverse folding: a fixed backbone goes in, an amino-acid distribution per position comes out.
 * The toy backbone is a 28-residue helix–loop–helix hairpin. Each position carries a burial value
 * (1 = fully buried core, 0 = fully solvent-exposed) and a secondary-structure label. A hand-written
 * scoring function turns those into logits over the 20 amino acids (buried ⇒ hydrophobic, exposed ⇒
 * polar/charged, loops ⇒ G/P/N/D, helices ⇒ good helix formers); softmax at temperature T gives the
 * probabilities the bars show. The "native" sequence is one sample drawn at T = 1.2 with a fixed seed,
 * so sequence recovery is naturally well below 100 % — exactly the situation ProteinMPNN is scored in.
 * Tap a residue to see its distribution. "decode order" shows a random autoregressive order, which is
 * how ProteinMPNN can condition on residues you choose to fix.
 * All numbers are illustrative; this is not a trained model.
 * props: { position?: number (0–27, default 9), temperature?: number (0.05–1.5, default 0.1),
 *          showOrder?: boolean (default false), seed?: number (default 2) }
 */
const AA = 'ACDEFGHIKLMNPQRSTVWY'.split('');
// hydrophobicity (0 polar … 1 greasy) and helix propensity (1 = neutral)
const HYD: Record<string, number> = { A: .62, C: .68, D: .05, E: .05, F: .95, G: .35, H: .32, I: 1, K: .05, L: .97, M: .84, N: .12, P: .28, Q: .1, R: .02, S: .2, T: .33, V: .9, W: .92, Y: .64 };
const HEL: Record<string, number> = { A: 1.42, C: .7, D: 1.01, E: 1.51, F: 1.13, G: .57, H: 1, I: 1.08, K: 1.16, L: 1.21, M: 1.45, N: .67, P: .57, Q: 1.11, R: .98, S: .77, T: .83, V: 1.06, W: 1.08, Y: .69 };
const LOOP: Record<string, number> = { G: 1.6, P: 1.3, N: .9, D: .9, S: .6, T: .4 };

const N = 28;
const BB: [number, number][] = (() => {
  const out: [number, number][] = [];
  for (let k = 0; k < 12; k++) out.push([70 + 6 * Math.sin(k * 2), 34 + k * 7.2]);
  for (let k = 1; k <= 4; k++) out.push([70 + (k / 5) * 60, 120 + 16 * Math.sin((Math.PI * k) / 5)]);
  for (let k = 0; k < 12; k++) out.push([130 + 6 * Math.sin(k * 2), 120 - k * 7.2]);
  return out;
})();
const SS = BB.map((_, i) => (i >= 12 && i < 16 ? 'L' : 'H'));
// core positions face the other helix; burial peaks on the i, i+3/i+4 face of each helix
const BUR = BB.map((_, i) => (SS[i] === 'L' ? 0.1 : 0.5 + 0.45 * Math.cos(i * 1.75)));

function logits(i: number): number[] {
  const bur = BUR[i];
  return AA.map((aa) => {
    let z = 7 * (bur - 0.5) * (HYD[aa] - 0.45);
    z += SS[i] === 'H' ? 1.8 * (HEL[aa] - 1) : (LOOP[aa] ?? 0);
    if (SS[i] === 'H' && (aa === 'P' || aa === 'G')) z -= 1.4;
    return z;
  });
}
const probs = (i: number, T: number) => {
  const z = logits(i).map((v) => v / Math.max(0.05, T));
  const mx = Math.max(...z);
  const e = z.map((v) => Math.exp(v - mx));
  const s = e.reduce((p, q) => p + q, 0);
  return e.map((v) => v / s);
};
const sampleAt = (i: number, T: number, u: number) => {
  const p = probs(i, T);
  let c = 0;
  for (let k = 0; k < p.length; k++) { c += p[k]; if (u <= c) return AA[k]; }
  return AA[AA.length - 1];
};
const NATIVE = (() => { const g = rng(17); return BB.map((_, i) => sampleAt(i, 1.2, g.u())); })();

export default function DrugMpnnDesign({ position = 9, temperature = 0.1, showOrder = false, seed = 2 }: {
  position?: number; temperature?: number; showOrder?: boolean; seed?: number;
}) {
  const [sel, setSel] = useState(Math.max(0, Math.min(N - 1, position)));
  const [T, setT] = useState(temperature);
  const [ord, setOrd] = useState(showOrder);
  const [sd, setSd] = useState(seed);

  const design = useMemo(() => { const g = rng(sd); return BB.map((_, i) => sampleAt(i, T, g.u())); }, [T, sd]);
  const order = useMemo(() => {
    const g = rng(sd + 100); const a = BB.map((_, i) => i);
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(g.u() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    const rank: number[] = []; a.forEach((v, k) => { rank[v] = k + 1; });
    return rank;
  }, [sd]);

  const rec = design.filter((x, i) => x === NATIVE[i]).length / N;
  const p = probs(sel, T);
  const ent = -p.reduce((s, q) => s + (q > 0 ? q * Math.log2(q) : 0), 0);
  const top = AA.map((aa, k) => [aa, p[k]] as [string, number]).sort((x, y) => y[1] - x[1]).slice(0, 7);

  return (
    <div>
      <Stage w={320} h={238} label={`Inverse folding at temperature ${T.toFixed(2)}, recovery ${(rec * 100).toFixed(0)}%`}>
        <path d={pathOf(BB)} fill="none" stroke="var(--muted)" strokeWidth={1.6} strokeLinejoin="round" />
        {BB.map((q, i) => (
          <g key={i} onClick={() => setSel(i)} style={{ cursor: 'pointer' }}>
            <circle cx={q[0]} cy={q[1]} r={i === sel ? 6 : 4.4}
              fill={SS[i] === 'L' ? 'var(--grid)' : C[1]} fillOpacity={SS[i] === 'L' ? 1 : 0.25 + 0.7 * BUR[i]}
              stroke={i === sel ? 'var(--fg)' : 'none'} strokeWidth={1.2} />
            <text x={q[0]} y={q[1] + 2.6} fontSize="6" textAnchor="middle" fill="var(--fg)">
              {ord ? order[i] : design[i]}
            </text>
          </g>
        ))}
        <g fontSize="7.5" fill="var(--muted)">
          <text x={70} y={24} textAnchor="middle">helix 1</text>
          <text x={130} y={24} textAnchor="middle">helix 2</text>
          <text x={100} y={152} textAnchor="middle">loop</text>
          <text x={176} y={34} fill="var(--fg)" fontWeight="700">residue {sel + 1}</text>
          <text x={176} y={45}>{SS[sel] === 'L' ? 'loop' : 'helix'} · burial {BUR[sel].toFixed(2)}</text>
        </g>
        {top.map(([aa, q], k) => (
          <g key={aa}>
            <rect x={176} y={54 + k * 13} width={Math.max(1, 108 * q)} height={9} rx={2}
              fill={aa === NATIVE[sel] ? C[0] : C[3]} opacity={0.85} />
            <text x={172} y={62 + k * 13} fontSize="8" textAnchor="end" fill="var(--fg)" fontFamily="ui-monospace, monospace">{aa}</text>
            <text x={288} y={62 + k * 13} fontSize="7" fill="var(--muted)">{(q * 100).toFixed(0)}%</text>
          </g>
        ))}
        <text x={176} y={158} fontSize="7" fill={C[0]}>green = the native amino acid here</text>
        <g fontSize="7.5">
          <text x={6} y={178} fill="var(--fg)" fontFamily="ui-monospace, monospace">design  {design.join('')}</text>
          <text x={6} y={190} fill="var(--muted)" fontFamily="ui-monospace, monospace">native  {NATIVE.join('')}</text>
          <text x={6} y={206} fill="var(--fg)">
            T = {T.toFixed(2)} · recovery {(rec * 100).toFixed(0)}% · entropy at residue {sel + 1}: {ent.toFixed(2)} bits
          </text>
          <text x={6} y={220} fill="var(--muted)">
            Low T: one confident sequence, highest recovery. High T: many different sequences per backbone.
          </text>
          <text x={6} y={232} fill="var(--muted)">
            Recovery is never 100 % — many sequences fold to the same backbone.
          </text>
        </g>
      </Stage>
      <Controls>
        <Slider label="temperature" min={0.05} max={1.5} step={0.05} value={T} onChange={setT} />
        <Btn onClick={() => setSd(sd + 1)}>resample</Btn>
        <Btn active={ord} onClick={() => setOrd(!ord)}>decode order</Btn>
      </Controls>
    </div>
  );
}
