import type { LessonContent } from '../../types';

const nucleotideSvg = String.raw`<svg viewBox="0 0 320 190" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
<circle cx="40" cy="52" r="16" fill="var(--c3)" fill-opacity="0.35" stroke="var(--c3)" stroke-width="2"/>
<text x="40" y="56" text-anchor="middle" font-size="11" font-weight="700" fill="var(--fg)">P</text>
<text x="40" y="84" text-anchor="middle" font-size="9" fill="var(--c3)">phosphate</text>
<path d="M55,58 L72,74 L87,92" fill="none" stroke="var(--fg)" stroke-width="1.5"/>
<polygon points="110,76 133,93 124,119 96,119 87,93" fill="var(--c2)" fill-opacity="0.25" stroke="var(--c2)" stroke-width="2"/>
<g font-size="9" fill="var(--fg)">
<text x="110" y="72" text-anchor="middle">O</text>
<text x="138" y="90">1′</text><text x="128" y="132">2′</text><text x="86" y="132">3′</text><text x="76" y="98">4′</text><text x="64" y="72">5′</text>
<text x="132" y="148" fill="var(--muted)">2′: H only</text><text x="132" y="159" fill="var(--muted)">→ “deoxy”ribose</text>
<text x="66" y="162">3′-OH</text>
</g>
<line x1="96" y1="119" x2="84" y2="150" stroke="var(--fg)" stroke-width="1.5"/>
<text x="110" y="104" text-anchor="middle" font-size="9" fill="var(--c2)">sugar</text>
<line x1="133" y1="93" x2="160" y2="93" stroke="var(--fg)" stroke-width="1.5"/>
<rect x="160" y="78" width="66" height="30" rx="6" fill="var(--c1)" fill-opacity="0.3" stroke="var(--c1)" stroke-width="2"/>
<text x="193" y="97" text-anchor="middle" font-size="10" font-weight="700" fill="var(--fg)">base</text>
<g font-size="9" fill="var(--fg)">
<text x="236" y="30" font-weight="700">Purines (2 rings)</text>
<polygon points="246,40 256,46 256,58 246,64 236,58 236,46" fill="none" stroke="var(--c1)" stroke-width="1.5"/><polygon points="256,46 266,42 272,52 266,62 256,58" fill="none" stroke="var(--c1)" stroke-width="1.5"/>
<text x="278" y="56">A, G</text>
<text x="236" y="96" font-weight="700">Pyrimidines (1 ring)</text>
<polygon points="246,106 256,112 256,124 246,130 236,124 236,112" fill="none" stroke="var(--c1)" stroke-width="1.5"/>
<text x="266" y="122">C, T</text><text x="236" y="146" fill="var(--muted)">(RNA uses U</text><text x="236" y="157" fill="var(--muted)">instead of T)</text>
</g>
<text x="160" y="184" text-anchor="middle" font-size="9" fill="var(--muted)">nucleotide = phosphate + deoxyribose sugar + base</text>
</svg>`;

const pairs: [string, string][] = [['A', 'T'], ['G', 'C'], ['T', 'A'], ['C', 'G'], ['A', 'T']];
const purine = (b: string) => b === 'A' || b === 'G';
const rung = ([l, r]: [string, string], i: number) => {
  const y = 34 + i * 30; const wl = purine(l) ? 76 : 54; const wr = purine(r) ? 76 : 54; const hb = l === 'G' || l === 'C' ? 3 : 2;
  const dashes = Array.from({ length: hb }, (_, k) => `<line x1="${80 + wl + 2}" x2="${240 - wr - 2}" y1="${y + 6 + (k - (hb - 1) / 2) * 5}" y2="${y + 6 + (k - (hb - 1) / 2) * 5}" stroke="var(--fg)" stroke-dasharray="2 2"/>`).join('');
  return `<rect x="80" y="${y}" width="${wl}" height="12" rx="3" fill="var(${purine(l) ? '--c1' : '--c6'})" fill-opacity="0.6"/>` +
    `<text x="${86}" y="${y + 10}" font-size="10" font-weight="700" fill="var(--fg)">${l}</text>` +
    `<rect x="${240 - wr}" y="${y}" width="${wr}" height="12" rx="3" fill="var(${purine(r) ? '--c1' : '--c6'})" fill-opacity="0.6"/>` +
    `<text x="${226}" y="${y + 10}" font-size="10" font-weight="700" fill="var(--fg)">${r}</text>` + dashes +
    `<text x="${300}" y="${y + 10}" font-size="9" fill="var(--muted)">${hb} H</text>`;
};
const ladderSvg = `<svg viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
<line x1="76" y1="22" x2="76" y2="178" stroke="var(--c3)" stroke-width="5"/><line x1="244" y1="22" x2="244" y2="178" stroke="var(--c3)" stroke-width="5"/>
${pairs.map(rung).join('')}
<g font-size="10" font-weight="700" fill="var(--fg)"><text x="60" y="20">5′</text><text x="60" y="192">3′</text><text x="250" y="20">3′</text><text x="250" y="192">5′</text></g>
<path d="M40,40 v120" stroke="var(--c2)" stroke-width="2" marker-end="url(#ah)"/><path d="M280,160 v-120" stroke="var(--c2)" stroke-width="2" marker-end="url(#ah)"/>
<defs><marker id="ah" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--c2)"/></marker></defs>
<text x="10" y="104" font-size="8.5" fill="var(--c2)">5′→3′</text><text x="282" y="174" font-size="8.5" fill="var(--c2)">5′→3′</text>
<text x="160" y="196" text-anchor="middle" font-size="8.5" fill="var(--muted)">sugar–phosphate backbones (orange) run in opposite directions</text>
</svg>`;

export default {
  cards: [
    {
      kind: 'explain',
      title: 'Two metres in a speck',
      body: String.raw`Each of your cells holds about **2 metres** of DNA, packed into a nucleus only ~6 µm across — like stuffing about 20 km of fine thread into a tennis ball. And before every cell division, all of it must be copied almost perfectly.

In 1953 James Watson and Francis Crick, building on X-ray images by **Rosalind Franklin** and Maurice Wilkins, worked out DNA’s shape: the **double helix**. Its structure immediately suggested how DNA is copied. In this lesson you’ll see why.`,
    },
    {
      kind: 'explain',
      title: 'The building block: a nucleotide',
      body: String.raw`DNA (**deoxyribonucleic acid**) is a polymer — a long chain of repeating units called **nucleotides**. Each nucleotide has three parts:

1. a **phosphate** group (negatively charged);
2. a five-carbon sugar, **deoxyribose** (carbons numbered 1′ to 5′, read “one-prime” etc.);
3. one of four **bases**: **adenine (A)**, **guanine (G)**, **cytosine (C)**, **thymine (T)**.

A and G are **purines** (two fused rings); C and T are **pyrimidines** (one ring). The base is the “letter”; the sugar and phosphate are the “paper”.`,
    },
    {
      kind: 'widget',
      title: 'Anatomy of a nucleotide',
      widget: { type: 'SvgDiagram', props: { svg: nucleotideSvg }, caption: 'The 5′ carbon carries the phosphate; the 3′ carbon carries an –OH group. These two ends give each strand a direction.' },
    },
    {
      kind: 'explain',
      title: 'Strands have a direction',
      body: String.raw`Nucleotides link by **phosphodiester bonds**: the phosphate on one sugar’s **5′** carbon bonds to the **3′**-OH of the previous sugar. This makes a **sugar–phosphate backbone** with bases sticking out to the side.

Because of this linkage, a strand has two different ends: a **5′ end** (free phosphate) and a **3′ end** (free OH). By convention we always write sequences **5′→3′**, e.g. 5′-ATGCCA-3′. New nucleotides are always added to the 3′ end — remember that, it matters for [replication](@bio/dna-replication) and [transcription](@bio/transcription).`,
    },
    {
      kind: 'mcq',
      prompt: 'Along a single DNA strand, which part of the nucleotides **varies** and carries the genetic information?',
      choices: ['The phosphate', 'The deoxyribose sugar', 'The base', 'The phosphodiester bond'],
      answer: 2,
      why: 'Every nucleotide has the same phosphate and sugar, so the backbone is a monotonous repeat. Only the base (A, T, G or C) changes from one position to the next — the sequence of bases is the information.',
    },
    {
      kind: 'explain',
      title: 'Base pairing: the key to everything',
      body: String.raw`Two strands wind around each other, held together by [hydrogen bonds](@chem/intermolecular-forces) between bases:

- **A pairs with T** (2 hydrogen bonds)
- **G pairs with C** (3 hydrogen bonds)

Each pair is one purine + one pyrimidine, so every rung of the ladder has the same width. The two strands are **complementary** (each determines the other) and **antiparallel** (they run 5′→3′ in opposite directions).

**Chargaff’s rule** follows: in double-stranded DNA, %A = %T and %G = %C.

**Example.** 5′-ATGC-3′ pairs with 3′-TACG-5′, which written the standard way is 5′-GCAT-3′.`,
    },
    {
      kind: 'widget',
      title: 'The ladder, unrolled',
      body: 'Green = purines (bigger), teal = pyrimidines. Every rung is purine + pyrimidine, so the ladder is uniformly wide. G–C rungs have three hydrogen bonds, A–T rungs two.',
      widget: { type: 'SvgDiagram', props: { svg: ladderSvg } },
    },
    {
      kind: 'fill',
      prompt: 'The strand complementary to 5′-GATTC-3′ is 3′-___-5′. A always pairs with ___, and G with ___.',
      bank: ['CTAAG', 'GAATC', 'CTTAG', 'T', 'C', 'U', 'A'],
      answer: ['CTAAG', 'T', 'C'],
      why: 'Pair each base in turn: G→C, A→T, T→A, T→A, C→G, giving 3′-CTAAG-5′ (which is 5′-GAATC-3′ written the conventional way). U is RNA’s substitute for T, not part of DNA.',
    },
    {
      kind: 'numeric',
      prompt: 'A sample of double-stranded DNA is 30% adenine (A). What percentage is guanine (G)?',
      answer: 20,
      tolerance: 0.01,
      unit: '%',
      why: 'A = T, so A + T = 60%. The remaining 40% is G + C, and G = C, so G = 20%. A tempting wrong answer is 30% or 70% — remember the pairs split the total.',
    },
    {
      kind: 'explain',
      title: 'The double helix by numbers',
      body: String.raw`The ladder is twisted into a right-handed helix (**B-DNA**):

- width ≈ **2 nm**;
- rise ≈ **0.34 nm** per base pair; ≈ **10.5 bp** per turn;
- the backbones are unevenly spaced, leaving a **major groove** and a **minor groove**, where proteins can “read” the base sequence without unzipping it.

**Worked example.** A human genome (one set) has $\approx 3.1\times10^9$ bp. Length $= 3.1\times10^9 \times 0.34\text{ nm} \approx 1.05\times10^9$ nm $\approx 1$ m. Your cells carry two sets → about **2 m**.`,
    },
    {
      kind: 'widget',
      title: 'A rotating double helix (side view)',
      body: 'Two strands seen from the side as the helix spins. The strands are not opposite each other, so the gaps alternate wide (**major groove**) and narrow (**minor groove**).',
      widget: { type: 'FunctionPlot', props: { fns: ['sin(x - 2*t)', 'sin(x - 2*t + 2.3)'], x: [0, 12.6], y: [-1.8, 1.8], animate: true, xLabel: 'along the axis', yLabel: '', labels: ['strand 1', 'strand 2'] } },
    },
    {
      kind: 'numeric',
      prompt: String.raw`The *E. coli* chromosome is about 4.6 million base pairs long. Using 0.34 nm per base pair, how long is it when stretched out, in **millimetres**?`,
      answer: 1.56,
      tolerance: 0.05,
      unit: 'mm',
      why: String.raw`$4.6\times10^6 \times 0.34\text{ nm} = 1.56\times10^6$ nm $= 1.56$ mm — roughly 800 times the length of the 2 µm bacterium it lives in, so it must be tightly folded.`,
    },
    {
      kind: 'widget',
      title: 'How 2 m fits in a nucleus',
      widget: {
        type: 'StepReveal',
        props: {
          steps: [
            '**Double helix** — 2 nm wide.',
            '**Nucleosomes** — DNA wraps ~1.7 turns (147 bp) around a spool of 8 **histone** proteins: “beads on a string”, ~11 nm.',
            '**Chromatin fibre** — nucleosomes pack together and form loops anchored by proteins.',
            '**Chromosome** — during cell division, chromatin condenses into the visible X-shaped chromosomes; overall the DNA is now ~10,000-fold more compact than when stretched out.',
          ],
          notes: ['', 'Histones are positively charged, which helps them grip negatively charged DNA.', 'How tightly DNA is packed affects which genes can be read — see [chromatin & epigenetics](@bio/chromatin-epigenetics).', 'Humans have 46 chromosomes (23 pairs) in most cells.'],
        },
      },
    },
    {
      kind: 'match',
      prompt: 'Match each term to its meaning.',
      pairs: [
        ['Purine', 'Two-ring base: A or G'],
        ['Antiparallel', 'The two strands run in opposite 5′→3′ directions'],
        ['Complementary', 'Each strand’s sequence determines its partner’s'],
        ['Phosphodiester bond', 'Links the 3′ carbon of one sugar to the 5′ phosphate of the next'],
        ['Major groove', 'Wide gap in the helix where proteins read the bases'],
      ],
      why: 'These five words describe the whole structure: purine/pyrimidine sizes make rungs equal; strands are antiparallel and complementary; phosphodiester bonds build the backbone; grooves give proteins access to the base sequence.',
    },
    {
      kind: 'truefalse',
      prompt: 'The two strands of a DNA double helix run in the same 5′→3′ direction.',
      answer: false,
      why: 'They are antiparallel: one runs 5′→3′ top-to-bottom, its partner 3′→5′. This orientation is needed for the bases to pair properly, and it forces replication machinery to copy the two strands differently.',
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- DNA is a polymer of **nucleotides**: phosphate + deoxyribose + base (A, G purines; C, T pyrimidines).
- Strands have direction (**5′→3′**); the two strands are **antiparallel**.
- **A–T** (2 H-bonds), **G–C** (3 H-bonds): strands are **complementary**, so %A = %T and %G = %C.
- B-DNA: 2 nm wide, 0.34 nm/bp, ~10.5 bp/turn, major and minor grooves.
- Complementarity means each strand is a **template** for the other — the basis of copying (replication) and reading (transcription).`,
    },
  ],
  references: [
    { authors: 'Clark, M. A., Douglas, M., Choi, J.', title: 'Biology 2e', year: 2018, venue: 'OpenStax', detail: 'Ch. 14.2 “DNA Structure and Sequencing”', url: 'https://openstax.org/details/books/biology-2e' },
    { authors: 'Watson, J. D., Crick, F. H. C.', title: 'Molecular structure of nucleic acids: a structure for deoxyribose nucleic acid', year: 1953, venue: 'Nature 171, 737–738' },
    { authors: 'Franklin, R. E., Gosling, R. G.', title: 'Molecular configuration in sodium thymonucleate', year: 1953, venue: 'Nature 171, 740–741' },
    { authors: 'Alberts, B., et al.', title: 'Molecular Biology of the Cell', year: 2022, venue: '7th ed., W. W. Norton', detail: 'Ch. 4 “DNA, Chromosomes, and Genomes”' },
  ],
} satisfies LessonContent;
