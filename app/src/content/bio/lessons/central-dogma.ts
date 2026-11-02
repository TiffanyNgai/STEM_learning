import type { LessonContent } from '../../types';

const dogmaSvg = String.raw`<svg viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
<defs><marker id="cdA" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--fg)"/></marker>
<marker id="cdB" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--c5)"/></marker></defs>
<rect x="14" y="88" width="70" height="34" rx="8" fill="var(--c4)" fill-opacity="0.25" stroke="var(--c4)" stroke-width="2"/>
<rect x="126" y="88" width="70" height="34" rx="8" fill="var(--c1)" fill-opacity="0.25" stroke="var(--c1)" stroke-width="2"/>
<rect x="238" y="88" width="72" height="34" rx="8" fill="var(--c3)" fill-opacity="0.25" stroke="var(--c3)" stroke-width="2"/>
<g font-size="12" font-weight="700" text-anchor="middle" fill="var(--fg)"><text x="49" y="110">DNA</text><text x="161" y="110">RNA</text><text x="274" y="110">Protein</text></g>
<path id="cdT" d="M86,100 H124" stroke="var(--fg)" stroke-width="2" marker-end="url(#cdA)"/>
<path d="M198,100 H236" stroke="var(--fg)" stroke-width="2" marker-end="url(#cdA)"/>
<path d="M30,88 C10,50 88,50 68,86" fill="none" stroke="var(--fg)" stroke-width="2" marker-end="url(#cdA)"/>
<path d="M124,114 H88" stroke="var(--c5)" stroke-width="2" stroke-dasharray="4 3" marker-end="url(#cdB)"/>
<path d="M142,122 C122,166 200,166 180,124" fill="none" stroke="var(--c5)" stroke-width="2" stroke-dasharray="4 3" marker-end="url(#cdB)"/>
<g font-size="9" text-anchor="middle" fill="var(--fg)">
<text x="49" y="44" font-weight="700">replication</text>
<text x="105" y="84" font-weight="700">transcription</text>
<text x="217" y="84" font-weight="700">translation</text>
<text x="96" y="134" fill="var(--c5)">reverse</text><text x="96" y="144" fill="var(--c5)">transcription</text>
<text x="161" y="178" fill="var(--c5)">RNA replication (some viruses)</text>
<text x="274" y="146" fill="var(--c5)">✗ no route back</text><text x="274" y="157" fill="var(--c5)">from protein</text>
</g>
<circle r="4" fill="var(--c1)"><animateMotion dur="1.6s" repeatCount="indefinite" path="M86,100 H124"/></circle>
<circle r="4" fill="var(--c3)"><animateMotion dur="1.6s" begin="0.8s" repeatCount="indefinite" path="M198,100 H236"/></circle>
<text x="160" y="20" text-anchor="middle" font-size="10" font-weight="700" fill="var(--fg)">Flow of genetic information</text>
<text x="160" y="196" text-anchor="middle" font-size="8.5" fill="var(--muted)">solid: in all cells · dashed: special cases (viruses, some enzymes)</text>
</svg>`;

export default {
  cards: [
    {
      kind: 'explain',
      title: 'The cookbook in the library',
      body: String.raw`Imagine a precious **cookbook** that may never leave the library. To cook a dish, you photocopy one recipe, carry the copy to the kitchen, and a cook follows it to make the dish.

In a cell:
- the cookbook is **DNA** (kept safe, in eukaryotes inside the nucleus);
- the photocopy is **messenger RNA (mRNA)**;
- the cook is the **ribosome**;
- the dish is a **protein**.

Making the photocopy is **transcription**; cooking from it is **translation**. Each recipe is a **gene**.`,
    },
    {
      kind: 'explain',
      title: 'The central dogma',
      body: String.raw`Francis Crick (1958) called this flow the **central dogma of molecular biology**:

$$\text{DNA} \xrightarrow{\text{transcription}} \text{RNA} \xrightarrow{\text{translation}} \text{protein}$$

plus **replication** (DNA → DNA) to pass genomes on.

**Precise statement:** once sequence information has passed into protein, it cannot get out again — the amino-acid sequence of a protein is never used to specify a nucleic-acid sequence.

A **gene** is a stretch of DNA whose sequence encodes a functional product — usually a protein, but sometimes an RNA that works by itself.`,
    },
    {
      kind: 'widget',
      title: 'The map of information flow',
      widget: { type: 'SvgDiagram', props: { svg: dogmaSvg } },
    },
    {
      kind: 'mcq',
      prompt: 'Which process uses a DNA sequence as a template to build an RNA molecule?',
      choices: ['Replication', 'Transcription', 'Translation', 'Reverse transcription'],
      answer: 1,
      why: 'Transcription = DNA → RNA (same “language” of nucleotides, just copied). Translation converts RNA into protein (a different language: amino acids). Reverse transcription goes the other way, RNA → DNA.',
    },
    {
      kind: 'explain',
      title: 'RNA: DNA’s versatile cousin',
      body: String.raw`RNA (**ribonucleic acid**) is also a chain of nucleotides, with three differences:

1. Its sugar is **ribose** (has an extra –OH on the 2′ carbon) — making RNA chemically less stable, fine for a temporary copy.
2. It uses **uracil (U)** instead of thymine (T); U pairs with A.
3. It is usually **single-stranded**, so it can fold into complex 3-D shapes.

Main types: **mRNA** carries a gene’s message; **tRNA** (transfer RNA) brings amino acids to the ribosome; **rRNA** (ribosomal RNA) forms the core of the ribosome and catalyses bond formation. Many other small RNAs regulate genes.`,
    },
    {
      kind: 'match',
      prompt: 'Match each molecule to its role.',
      pairs: [
        ['DNA', 'Long-term store of genetic information'],
        ['mRNA', 'Temporary copy of a gene carried to the ribosome'],
        ['tRNA', 'Adapter that brings a specific amino acid'],
        ['rRNA', 'Structural and catalytic core of the ribosome'],
        ['Protein', 'Folded chain of amino acids that does most cellular work'],
      ],
      why: 'DNA is the archive, mRNA the message, tRNA the adapter that links codons to amino acids, rRNA the ribosome’s workbench and catalyst, and proteins are the enzymes, motors, channels and structures that do the work.',
    },
    {
      kind: 'explain',
      title: 'Where it happens',
      body: String.raw`**Eukaryotes:** transcription happens in the **nucleus**. The RNA is processed (capped, spliced, given a tail — see [RNA processing](@bio/rna-processing)) and exported through nuclear pores. Translation happens in the **cytoplasm**.

**Prokaryotes:** no nucleus, so ribosomes jump onto the mRNA **while it is still being transcribed** — transcription and translation are *coupled*, which makes bacteria very fast at switching genes on.

Step through the whole process below — first RNA polymerase copies the gene, then a ribosome reads the copy.`,
    },
    {
      kind: 'widget',
      title: 'From gene to protein',
      body: 'Press **Next** (or Play). Top: transcription of a short gene. Bottom: translation of the resulting mRNA, three letters (one **codon**) at a time.',
      widget: { type: 'TranscriptionTranslation', props: { dna: 'ATGTTCGGAAAGTGGTAA', phase: 'both' } },
    },
    {
      kind: 'truefalse',
      prompt: 'Every gene codes for a protein.',
      answer: false,
      why: 'Some genes make RNAs that are the final product — rRNAs, tRNAs and many regulatory RNAs (e.g. microRNAs). In humans, only about 1–2% of the genome codes for protein.',
    },
    {
      kind: 'explain',
      title: 'Exceptions that prove the rule',
      body: String.raw`- **Reverse transcription (RNA → DNA):** retroviruses such as **HIV** carry an enzyme, *reverse transcriptase*, that copies their RNA genome into DNA, which then inserts into the host genome. Our own genomes contain many such copied sequences.
- **RNA replication (RNA → RNA):** many viruses (influenza, SARS-CoV-2) copy RNA directly.
- **Prions** pass on a misfolded *shape*, not a sequence.

None of these breaks Crick’s precise rule: nothing copies **protein sequence back into nucleic acid**.`,
    },
    {
      kind: 'multi',
      prompt: 'Which information transfers have actually been observed in nature?',
      choices: ['DNA → RNA', 'RNA → DNA', 'RNA → RNA', 'Protein → DNA', 'RNA → protein'],
      answers: [0, 1, 2, 4],
      why: 'Transcription, reverse transcription (retroviruses), RNA replication (RNA viruses) and translation all occur. Protein → nucleic acid (reading an amino-acid sequence back into DNA) has never been observed — that is the core of the dogma.',
    },
    {
      kind: 'explain',
      title: 'Same book, different recipes',
      body: String.raw`Almost every cell in your body carries the **same genome**. Yet a neuron and a liver cell look and act completely differently. Why?

Because each cell type **expresses** (transcribes and translates) a different subset of its ~20,000 protein-coding genes. A liver cell makes huge amounts of albumin and detox enzymes; a neuron makes ion channels and neurotransmitter machinery.

Deciding which genes are on, and how strongly, is **gene regulation** — see [Gene regulation](@bio/gene-regulation).`,
    },
    {
      kind: 'order',
      prompt: 'Order the steps from gene to working protein in a **eukaryotic** cell.',
      steps: [
        'RNA polymerase transcribes the gene into pre-mRNA in the nucleus',
        'The pre-mRNA is processed (capped, spliced, tailed)',
        'The mature mRNA is exported through a nuclear pore',
        'A ribosome in the cytoplasm translates the mRNA',
        'The polypeptide folds into its working 3-D shape',
      ],
      why: 'Transcription and processing happen in the nucleus; only mature mRNA is exported. Translation happens in the cytoplasm, and the chain must fold to function (see protein structure).',
    },
    {
      kind: 'fill',
      prompt: 'DNA is copied into RNA by ___, and RNA is decoded into protein by ___ on ribosomes. RNA uses the base ___ instead of thymine.',
      bank: ['transcription', 'translation', 'replication', 'uracil', 'adenine', 'mutation'],
      answer: ['transcription', 'translation', 'uracil'],
      why: 'Transcription keeps the nucleotide language (DNA → RNA); translation changes language (nucleotides → amino acids). Uracil replaces thymine in RNA and pairs with adenine.',
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- **Central dogma:** DNA → RNA → protein (+ DNA replication). Sequence information never flows from protein back to nucleic acid.
- **Transcription** copies a gene into RNA; **translation** decodes mRNA into a protein at the ribosome.
- RNA has ribose, uracil and is usually single-stranded; mRNA, tRNA and rRNA each play a role.
- Eukaryotes separate transcription (nucleus) from translation (cytoplasm); bacteria couple them.
- Exceptions (reverse transcription, RNA replication) come mainly from viruses.
- Cells differ because they **express** different genes from the same genome.`,
    },
  ],
  references: [
    { authors: 'Crick, F.', title: 'Central dogma of molecular biology', year: 1970, venue: 'Nature 227, 561–563' },
    { authors: 'Crick, F. H. C.', title: 'On protein synthesis', year: 1958, venue: 'Symposia of the Society for Experimental Biology 12, 138–163' },
    { authors: 'Clark, M. A., Douglas, M., Choi, J.', title: 'Biology 2e', year: 2018, venue: 'OpenStax', detail: 'Ch. 15 “Genes and Proteins”', url: 'https://openstax.org/details/books/biology-2e' },
    { authors: 'Alberts, B., et al.', title: 'Molecular Biology of the Cell', year: 2022, venue: '7th ed., W. W. Norton', detail: 'Ch. 6 “How Cells Read the Genome”' },
  ],
} satisfies LessonContent;
