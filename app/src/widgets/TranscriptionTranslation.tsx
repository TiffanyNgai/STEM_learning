import { useState } from 'react';
import { Btn, Controls, PlayPause, Stage, prefersReducedMotion, useFrame } from './_kit';

/**
 * Step-through animation of gene expression, one codon per step:
 *   transcription — RNA polymerase reads the template strand and builds mRNA (top panel);
 *   translation — a ribosome reads the mRNA codon by codon; tRNAs deliver amino acids; the chain grows; stop → release.
 * props: { dna?: string (coding strand, 5'→3', should start with ATG; default 'ATGTTCGGAAAGTGGTAA'),
 *          phase?: 'both' | 'transcription' | 'translation' (default 'both'), autoplay?: boolean (default false) }
 */
const B = 'UCAG';
const AA1 = 'FFLLSSSSYY**CC*WLLLLPPPPHHQQRRRRIIIMTTTTNNKKSSRRVVVVAAAADDEEGGGG';
const AA3: Record<string, string> = { A: 'Ala', R: 'Arg', N: 'Asn', D: 'Asp', C: 'Cys', Q: 'Gln', E: 'Glu', G: 'Gly', H: 'His', I: 'Ile', L: 'Leu', K: 'Lys', M: 'Met', F: 'Phe', P: 'Pro', S: 'Ser', T: 'Thr', W: 'Trp', Y: 'Tyr', V: 'Val', '*': 'Stop' };
const aaOf = (c: string) => AA3[AA1[16 * B.indexOf(c[0]) + 4 * B.indexOf(c[1]) + B.indexOf(c[2])]] ?? '?';
const DNA_PAIR: Record<string, string> = { A: 'T', T: 'A', G: 'C', C: 'G' };
const RNA_PAIR: Record<string, string> = { A: 'U', U: 'A', G: 'C', C: 'G' };

export default function TranscriptionTranslation({ dna = 'ATGTTCGGAAAGTGGTAA', phase = 'both', autoplay = false }: {
  dna?: string; phase?: 'both' | 'transcription' | 'translation'; autoplay?: boolean;
}) {
  const seq = dna.toUpperCase().replace(/[^ACGT]/g, '');
  const len = seq.length - (seq.length % 3);
  const n = len / 3;
  const mrna = seq.slice(0, len).replace(/T/g, 'U');
  const codons = Array.from({ length: n }, (_, i) => mrna.slice(3 * i, 3 * i + 3));
  const stopRaw = codons.findIndex((c) => aaOf(c) === 'Stop');
  const stop = stopRaw < 0 ? n : stopRaw;
  const first = phase === 'translation' ? n + 1 : 0;
  const last = phase === 'transcription' ? n : n + 1 + stop;
  const [s, setS] = useState(first);
  const [running, setRunning] = useState(autoplay && !prefersReducedMotion());
  const [acc, setAcc] = useState(0);
  useFrame((dt) => {
    const a = acc + dt;
    if (a > 1.3) { setAcc(0); setS((v) => (v >= last ? first : v + 1)); } else setAcc(a);
  }, running);

  const dx = Math.min(15, 250 / Math.max(1, len));
  const cx = (i: number) => 15 + i * dx + dx / 2;
  const tx = Math.min(s, n); // codons transcribed
  const t = s - (n + 1); // translation step (-1 → not started)
  const Psite = Math.max(0, Math.min(t, stop - 1));
  const chain = t >= 0 ? codons.slice(0, Math.min(t, stop - 1) + 1) : [];
  const released = t >= stop;

  let msg: string;
  if (s === 0) msg = 'RNA polymerase binds the gene’s promoter and unwinds the DNA. It will read the template strand 3′→5′ and build mRNA 5′→3′.';
  else if (s <= n) msg = `Transcribed codon ${s}: template ${codons[s - 1].split('').map((c) => DNA_PAIR[c === 'U' ? 'T' : c]).join('')} → mRNA ${codons[s - 1]}. The mRNA matches the coding strand, with U in place of T.`;
  else if (t === 0) msg = `The ribosome assembles on the start codon AUG. The initiator tRNA (anticodon UAC) brings methionine into the P site.`;
  else if (!released) msg = `A tRNA with anticodon ${codons[t].split('').map((c) => RNA_PAIR[c]).join('')} pairs with codon ${codons[t]} and brings ${aaOf(codons[t])}. A peptide bond joins it to the chain, and the ribosome moves one codon along.`;
  else msg = stopRaw < 0 ? 'The ribosome runs off the end of the mRNA (no stop codon in frame).' : `Stop codon ${codons[stop]} enters the A site. No tRNA matches it: a release factor binds and the finished chain (${chain.length} amino acids) is released to fold.`;

  const ribX = cx(3 * Psite) - dx / 2 - 3;
  return (
    <div>
      <Stage w={320} h={phase === 'transcription' ? 96 : 205} label="Transcription and translation">
        <g opacity={phase === 'translation' ? 0.3 : 1}>
          <text x={6} y={14} fontSize={9} fill="var(--muted)">DNA → mRNA (transcription)</text>
          <g transform={`translate(${cx(Math.min(3 * tx, len - 1)) - 1} 0)`}>
            <rect x={-14} y={22} width={30} height={68} rx={14} fill="var(--c4)" fillOpacity={s <= n ? 0.28 : 0} />
          </g>
          {seq.slice(0, len).split('').map((c, i) => (
            <g key={i} fontSize={Math.min(10, dx)} textAnchor="middle" fontFamily="monospace">
              <text x={cx(i)} y={36} fill="var(--fg)">{c}</text>
              <line x1={cx(i)} x2={cx(i)} y1={39} y2={43} stroke="var(--grid)" />
              <text x={cx(i)} y={52} fill="var(--muted)">{DNA_PAIR[c]}</text>
              {i < 3 * tx && <text x={cx(i)} y={78} fill="var(--c1)" fontWeight={700}>{mrna[i]}</text>}
            </g>
          ))}
          <text x={314} y={36} fontSize={8} textAnchor="end" fill="var(--muted)">coding 3′</text>
          <text x={314} y={52} fontSize={8} textAnchor="end" fill="var(--muted)">template 5′</text>
          {tx > 0 && <text x={314} y={78} fontSize={8} textAnchor="end" fill="var(--c1)">mRNA</text>}
        </g>
        {phase !== 'transcription' && <line x1={4} x2={316} y1={96} y2={96} stroke="var(--grid)" strokeDasharray="3 3" />}
        {phase !== 'transcription' && <g opacity={t >= 0 ? 1 : 0.25}>
          <text x={6} y={108} fontSize={9} fill="var(--muted)">mRNA → protein (translation)</text>
          {t >= 0 && !released && (
            <g transform={`translate(${ribX} 0)`}>
              <rect x={0} y={124} width={6 * dx + 6} height={74} rx={16} fill="var(--c2)" fillOpacity={0.18} stroke="var(--c2)" />
              <text x={1.5 * dx + 3} y={198} fontSize={7} textAnchor="middle" fill="var(--c2)">P</text>
              <text x={4.5 * dx + 3} y={198} fontSize={7} textAnchor="middle" fill="var(--c2)">A</text>
            </g>
          )}
          {t >= 0 && mrna.split('').map((c, i) => (
            <text key={i} x={cx(i)} y={188} fontSize={Math.min(10, dx)} textAnchor="middle" fontFamily="monospace"
              fill={Math.floor(i / 3) % 2 ? 'var(--c1)' : 'var(--c6)'} fontWeight={700}>{c}</text>
          ))}
          {t >= 0 && !released && (
            <g>
              <rect x={cx(3 * Psite) - dx / 2} y={160} width={3 * dx} height={16} rx={3} fill="var(--c3)" fillOpacity={0.3} />
              {codons[Psite].split('').map((c, j) => <text key={j} x={cx(3 * Psite + j)} y={172} fontSize={Math.min(9, dx)} textAnchor="middle" fill="var(--c3)" fontFamily="monospace">{RNA_PAIR[c]}</text>)}
              <line x1={cx(3 * Psite + 1)} x2={cx(3 * Psite + 1)} y1={160} y2={147} stroke="var(--c3)" strokeWidth={2} />
            </g>
          )}
          {chain.map((c, i) => {
            const k = chain.length - 1 - i; const sp = Math.min(19, (cx(3 * Psite + 1) - 12) / Math.max(1, chain.length - 1));
            const x = released ? 20 + i * 19 : cx(3 * Psite + 1) - k * sp; const y = released ? 130 : 138 - (k > 0 ? 8 : 0);
            return (
              <g key={i} style={{ transition: 'all .5s' }}>
                {i > 0 && <line x1={x} x2={released ? x - 19 : x - sp} y1={y} y2={released ? 130 : 130} stroke="var(--fg)" strokeWidth={1.5} />}
                <circle cx={x} cy={y} r={9} fill="var(--c4)" fillOpacity={0.85} />
                <text x={x} y={y + 3} fontSize={7.5} textAnchor="middle" fill="var(--surface)" fontWeight={700}>{aaOf(c)}</text>
              </g>
            );
          })}
        </g>}
      </Stage>
      <div className="w-muted" style={{ minHeight: '3.6em', padding: '2px 6px', fontSize: '0.9em' }}>{msg}</div>
      <Controls>
        <Btn onClick={() => { setRunning(false); setS(first); }}>⏮</Btn>
        <Btn onClick={() => { setRunning(false); setS((v) => Math.max(first, v - 1)); }}>◀ Back</Btn>
        <PlayPause running={running} set={setRunning} />
        <Btn onClick={() => { setRunning(false); setS((v) => Math.min(last, v + 1)); }}>Next ▶</Btn>
        <span className="w-muted">{s - first + 1}/{last - first + 1}</span>
      </Controls>
    </div>
  );
}
