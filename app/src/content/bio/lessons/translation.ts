import type { LessonContent } from '../../types';

export default {
  cards: [
    {
      kind: 'explain',
      title: 'Changing languages',
      body: String.raw`mRNA is written in a 4-letter alphabet (A, U, G, C). Proteins are written in a 20-letter alphabet — the 20 **amino acids**. **Translation** converts one into the other, and it happens on the **ribosome**.

How many nucleotide letters are needed per amino acid? With 2 letters there are only $4^2 = 16$ combinations — too few for 20 amino acids. With 3 letters there are $4^3 = 64$. So the code is read in **triplets** called **codons**.`,
    },
    {
      kind: 'explain',
      title: 'The genetic code',
      body: String.raw`Of the 64 codons:

- **61** specify amino acids;
- **3** (UAA, UAG, UGA) are **stop codons** — they mean "end of protein";
- **AUG** codes for methionine *and* is the usual **start codon**, setting where reading begins.

Properties:
- **Redundant (degenerate):** most amino acids have several codons, often differing only in the 3rd letter (e.g. GCU, GCC, GCA, GCG = alanine).
- **Unambiguous:** each codon means only one thing.
- **Nearly universal:** the same in bacteria, plants and people (with small variations, e.g. in mitochondria).
- **Non-overlapping**, read in a fixed **reading frame** from the start codon.`,
    },
    {
      kind: 'widget',
      title: 'The codon wheel',
      body: 'Read from the centre outward: 1st base, 2nd base, 3rd base, then the amino acid on the rim. Find AUG, then the three stop codons. Notice how often the 3rd base doesn’t matter.',
      widget: { type: 'CodonWheel', props: { codon: 'AUG' } },
    },
    {
      kind: 'mcq',
      prompt: 'Using the codon wheel, which amino acid does the codon **UGG** specify?',
      choices: ['Cysteine (Cys)', 'Tryptophan (Trp)', 'Stop', 'Glycine (Gly)'],
      answer: 1,
      why: 'Inner U → middle G → outer G gives Trp. UGG is the only codon for tryptophan. The neighbours UGU/UGC are Cys and UGA is a stop codon — easy to misread by one wedge.',
    },
    {
      kind: 'numeric',
      prompt: 'An mRNA’s coding region, from the start codon to the stop codon inclusive, is 900 nucleotides long. How many amino acids are in the protein?',
      answer: 299,
      tolerance: 0,
      unit: 'amino acids',
      why: '900 ÷ 3 = 300 codons, but the last is a stop codon, which adds no amino acid: 299. (Answering 300 forgets that stop codons are not translated into anything.)',
    },
    {
      kind: 'explain',
      title: 'tRNA: the adapter',
      body: String.raw`Nucleotides and amino acids can’t recognise each other directly. The link is **transfer RNA (tRNA)**, a ~76-nucleotide RNA folded into an L shape:

- one end has an **anticodon**, three bases that pair with a codon (antiparallel), e.g. anticodon 3′-UAC-5′ pairs with codon 5′-AUG-3′;
- the other end (3′ end, ending CCA) carries the matching **amino acid**.

The real "translators" are the **aminoacyl-tRNA synthetases** — about 20 enzymes, one per amino acid, that attach the right amino acid to the right tRNAs, using ATP. If they make a mistake, the wrong amino acid gets inserted. Thanks to **wobble** pairing at the codon’s 3rd position, one tRNA can read several codons.`,
    },
    {
      kind: 'fill',
      prompt: 'The codon 5′-GCA-3′ pairs with the tRNA anticodon 3′-___-5′, and that tRNA carries ___.',
      bank: ['CGU', 'GCA', 'CGT', 'alanine', 'arginine', 'cysteine'],
      answer: ['CGU', 'alanine'],
      why: 'Pair G–C, C–G, A–U to get 3′-CGU-5′ (RNA uses U, so CGT is wrong). GCA (like all GCx codons) means alanine.',
    },
    {
      kind: 'explain',
      title: 'The ribosome',
      body: String.raw`The ribosome is a huge machine of **rRNA + ~50–80 proteins**, made of a **small subunit** (which binds the mRNA and checks codon–anticodon pairing) and a **large subunit** (which joins amino acids). It has three tRNA sites:

- **A site** (aminoacyl) — where a new amino-acid-carrying tRNA arrives;
- **P site** (peptidyl) — holds the tRNA carrying the growing chain;
- **E site** (exit) — where empty tRNAs leave.

Remarkably, the peptide bond is catalysed by **rRNA**, not protein: the ribosome is a **ribozyme** — a clue that early life may have run on RNA.`,
    },
    {
      kind: 'widget',
      title: 'Watch a ribosome translate',
      body: 'Each step: a tRNA with the matching anticodon delivers an amino acid, a peptide bond adds it to the chain, and the ribosome shifts one codon (3 nucleotides) along. Watch what happens at the stop codon.',
      widget: { type: 'TranscriptionTranslation', props: { dna: 'ATGGCCTGGAAACATGGATAG', phase: 'translation' } },
    },
    {
      kind: 'order',
      prompt: 'Put one **elongation cycle** of translation in order.',
      steps: [
        'A charged tRNA enters the A site and its anticodon pairs with the codon',
        'The ribosome joins the growing chain (on the P-site tRNA) to the new amino acid with a peptide bond',
        'The ribosome moves one codon along the mRNA (translocation)',
        'The now-empty tRNA leaves from the E site',
      ],
      why: 'Decode (A site), form the bond (chain transfers to the A-site tRNA), translocate (that tRNA moves to P, the empty one to E), then the empty tRNA exits and the A site is free for the next codon.',
    },
    {
      kind: 'explain',
      title: 'Start, stop and reading frames',
      body: String.raw`**Initiation:** the small subunit, with the initiator tRNA (carrying Met), binds the mRNA and finds the start **AUG** (in eukaryotes by scanning from the 5′ cap; in bacteria guided by the Shine–Dalgarno sequence). The large subunit then joins.

**Termination:** when a stop codon reaches the A site, no tRNA matches; a protein **release factor** binds instead, and the chain is released.

The **reading frame** matters: the same letters split differently mean something else. Deleting or inserting one nucleotide causes a **frameshift**, garbling every codon downstream. Many ribosomes can translate one mRNA at once (a **polysome**).`,
    },
    {
      kind: 'widget',
      title: 'A frameshift, step by step',
      widget: {
        type: 'StepReveal',
        props: {
          steps: [
            'Normal mRNA: `AUG GCC UGG AAA CAU GGA UAG` → Met–Ala–Trp–Lys–His–Gly–stop.',
            'Delete the 5th nucleotide (the first C of GCC): `AUG GCU GGA AAC AUG GAU AG…`',
            'Read in triplets from AUG again: Met–Ala–Gly–Asn–Met–Asp–… — every codon after the deletion has changed.',
            'The original stop codon is now out of frame, so the ribosome runs on until it meets a stop in the new frame — the protein is usually useless.',
            'Deleting **three** nucleotides instead removes one amino acid but keeps the frame — often much less harmful.',
          ],
        },
      },
    },
    {
      kind: 'multi',
      prompt: 'A single nucleotide is deleted near the start of a gene’s coding sequence. What is likely?',
      choices: [
        'Every codon after the deletion is read in a different frame',
        'Only one amino acid changes',
        'A premature stop codon may appear in the new frame',
        'The protein is usually non-functional',
        'The start codon moves to a new position upstream',
      ],
      answers: [0, 2, 3],
      why: 'A 1-nt deletion is a frameshift: all downstream codons change, a stop codon often turns up early, and the protein is usually broken. A single amino-acid change describes a point substitution; the start codon is unaffected by a downstream deletion.',
    },
    {
      kind: 'match',
      prompt: 'Match each translation component to its role.',
      pairs: [
        ['Aminoacyl-tRNA synthetase', 'Attaches the correct amino acid to a tRNA'],
        ['Anticodon', 'Three tRNA bases that pair with a codon'],
        ['A site', 'Where the incoming charged tRNA binds'],
        ['Release factor', 'Recognises a stop codon and frees the chain'],
        ['Large-subunit rRNA', 'Catalyses peptide-bond formation'],
      ],
      why: 'Synthetases do the actual "translating" by charging tRNAs; anticodons read codons; the A site accepts incoming tRNAs; release factors respond to stop codons; and peptide bonds are made by rRNA — the ribosome is a ribozyme.',
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- The genetic code uses **codons** of 3 nucleotides: 64 codons → 20 amino acids + 3 stops; **AUG** = start (Met).
- The code is redundant, unambiguous, non-overlapping and nearly universal.
- **tRNAs** carry amino acids and pair with codons via **anticodons**; **aminoacyl-tRNA synthetases** load them correctly.
- The **ribosome** (A, P, E sites) joins amino acids; its **rRNA** catalyses the peptide bond.
- Stop codons recruit release factors; inserting or deleting non-multiples of 3 nucleotides causes **frameshifts**.

Next: how chains fold into working proteins — [Protein structure](@bio/protein-structure).`,
    },
  ],
  references: [
    { authors: 'Clark, M. A., Douglas, M., Choi, J.', title: 'Biology 2e', year: 2018, venue: 'OpenStax', detail: 'Ch. 15.1 “The Genetic Code”, 15.5 “Ribosomes and Protein Synthesis”', url: 'https://openstax.org/details/books/biology-2e' },
    { authors: 'Alberts, B., et al.', title: 'Molecular Biology of the Cell', year: 2022, venue: '7th ed., W. W. Norton', detail: 'Ch. 6' },
    { authors: 'Nirenberg, M. W., Matthaei, J. H.', title: 'The dependence of cell-free protein synthesis in E. coli upon naturally occurring or synthetic polyribonucleotides', year: 1961, venue: 'PNAS 47, 1588–1602' },
    { authors: 'Nissen, P., Hansen, J., Ban, N., Moore, P. B., Steitz, T. A.', title: 'The structural basis of ribosome activity in peptide bond synthesis', year: 2000, venue: 'Science 289, 920–930' },
  ],
} satisfies LessonContent;
