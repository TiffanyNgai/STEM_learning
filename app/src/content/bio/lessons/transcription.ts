import type { LessonContent } from '../../types';

// "Christmas tree": many RNA polymerases transcribing one gene at once, transcripts lengthening along the gene.
const treeSvg = `<svg viewBox="0 0 320 170" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
<line x1="20" y1="130" x2="300" y2="130" stroke="var(--c4)" stroke-width="3"/>
<text x="20" y="148" font-size="9" fill="var(--c4)">promoter</text><text x="300" y="148" font-size="9" text-anchor="end" fill="var(--c4)">end of gene</text>
${[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
    const x = 40 + i * 32; const len = 10 + i * 13;
    return `<circle cx="${x}" cy="130" r="5" fill="var(--c2)"/><path d="M${x},125 q${-6},${-len / 2} ${-2},${-len}" fill="none" stroke="var(--c1)" stroke-width="2"/>`;
  }).join('')}
<g>
<circle cy="130" r="5" fill="var(--c2)"><animate attributeName="cx" values="30;300" dur="6s" repeatCount="indefinite"/></circle>
</g>
<text x="160" y="16" text-anchor="middle" font-size="10" font-weight="700" fill="var(--fg)">One gene, many polymerases at once</text>
<text x="160" y="164" text-anchor="middle" font-size="8.5" fill="var(--muted)">blue dots: RNA polymerases · green: growing RNA (longer further along)</text>
</svg>`;

export default {
  cards: [
    {
      kind: 'explain',
      title: 'Making a working copy',
      body: String.raw`To use a gene, the cell does not send the DNA itself to the ribosome. It makes a disposable **RNA copy** of just that gene — like photocopying one recipe instead of lending out the whole cookbook. This copying is **transcription**, carried out by the enzyme **RNA polymerase**.

Why copy? The DNA stays protected, and the cell can make **many** copies of a gene it needs a lot of (and few of one it needs rarely) — an easy way to control how much protein is made.`,
    },
    {
      kind: 'explain',
      title: 'Template strand vs coding strand',
      body: String.raw`RNA polymerase unwinds a short stretch of the double helix (a "bubble" of ~14 bp) and reads **one** strand, the **template strand**, building RNA by base pairing: template A → RNA **U**, T → A, G → C, C → G.

Like DNA polymerase, it adds nucleotides only to the **3′ end**, so RNA grows **5′→3′** while the template is read **3′→5′**.

Result: the RNA has the **same sequence as the other strand** (the **coding strand**), except with **U in place of T**.

**Example.** Coding 5′-ATGGCT-3′ / template 3′-TACCGA-5′ → mRNA 5′-AUGGCU-3′.`,
    },
    {
      kind: 'widget',
      title: 'Watch RNA polymerase work',
      body: 'Step through codon by codon. Compare each new mRNA letter with the template strand (grey) and the coding strand (black).',
      widget: { type: 'TranscriptionTranslation', props: { dna: 'ATGGCTAGCAAAGGTTGA', phase: 'transcription' } },
    },
    {
      kind: 'fill',
      prompt: 'A template strand reads 3′-TACGGA-5′. The mRNA made from it is 5′-___-3′, and the coding strand is 5′-___-3′.',
      bank: ['AUGCCU', 'ATGCCT', 'UACGGA', 'TACGGA', 'AUGCCT'],
      answer: ['AUGCCU', 'ATGCCT'],
      why: 'Pair each template base: T→A, A→U, C→G, G→C, G→C, A→U gives 5′-AUGCCU-3′. The coding strand has the same sequence with T instead of U. UACGGA just copies the template letters (with U) — a common mistake.',
    },
    {
      kind: 'explain',
      title: 'Three stages',
      body: String.raw`1. **Initiation.** Polymerase binds a **promoter**, a DNA sequence just upstream of the gene that marks "start here, this direction". In bacteria a **σ (sigma) factor** recognises promoter boxes at about −10 (TATAAT) and −35 bp from the start. In eukaryotes, **general transcription factors** bind elements such as the **TATA box** (~25–30 bp upstream) and recruit the polymerase.
2. **Elongation.** The polymerase moves along at roughly 20–80 nucleotides per second, unwinding DNA ahead and re-winding it behind; the RNA peels away.
3. **Termination.** In bacteria, a terminator sequence makes the RNA fold into a **hairpin** followed by a run of U’s, which knocks the polymerase off (or the protein **Rho** pulls it off). In eukaryotes, the RNA is cut after a **poly-A signal** (AAUAAA) and the polymerase soon falls off.`,
    },
    {
      kind: 'widget',
      title: 'Transcription in bacteria, step by step',
      widget: {
        type: 'StepReveal',
        props: {
          steps: [
            '**Binding:** RNA polymerase + σ factor scan DNA and lock onto the −35 and −10 promoter boxes.',
            '**Opening:** the DNA is melted open around the start site (+1), exposing the template strand.',
            '**Starting:** the first nucleotides are joined — no primer needed. After ~10 nt, σ is released.',
            '**Elongation:** the polymerase moves along, the bubble travelling with it; RNA grows 5′→3′.',
            '**Termination:** a GC-rich hairpin forms in the new RNA, followed by U’s; the weak A–U pairs let go and the RNA is released.',
          ],
          notes: ['', 'Promoter strength (how closely it matches the ideal sequence) sets how often a gene starts.', '', '', 'The A–U base pair is the weakest, which is why a U-run helps the RNA detach.'],
        },
      },
    },
    {
      kind: 'order',
      prompt: 'Put the events of transcription in order.',
      steps: [
        'RNA polymerase binds the promoter',
        'The DNA unwinds near the start site',
        'Nucleotides complementary to the template are joined 5′→3′',
        'Polymerase reaches a terminator sequence',
        'The RNA transcript is released',
      ],
      why: 'Initiation (bind, open), elongation (polymerise), termination (reach terminator, release). The polymerase must find the promoter before it can open the DNA.',
    },
    {
      kind: 'mcq',
      prompt: 'In bacteria, what does the **σ (sigma) factor** do?',
      choices: [
        'It joins nucleotides into RNA',
        'It helps RNA polymerase recognise and bind promoters',
        'It removes introns from the RNA',
        'It terminates transcription at the hairpin',
      ],
      answer: 1,
      why: 'σ is a detachable subunit that recognises promoter sequences, telling the core polymerase where genes begin. The core enzyme does the polymerising; bacteria have no introns to splice; termination uses hairpins or Rho.',
    },
    {
      kind: 'explain',
      title: 'Fast, sloppy and in parallel',
      body: String.raw`RNA polymerase differs from DNA polymerase in useful ways:

- It needs **no primer** — it can start a chain from scratch.
- It makes about **1 error per 10⁴–10⁵** nucleotides, versus about 1 per 10⁹ or better for DNA replication after proofreading and repair. That is acceptable: a faulty RNA is temporary and only one of many copies.
- **Many polymerases can transcribe one gene at once**, one behind another. Electron micrographs (Miller spreads) show "Christmas trees" of transcripts getting longer along the gene.`,
      widget: { type: 'SvgDiagram', props: { svg: treeSvg } },
    },
    {
      kind: 'truefalse',
      prompt: 'Like DNA polymerase, RNA polymerase needs a short primer before it can start making a chain.',
      answer: false,
      why: 'RNA polymerase can begin a new chain de novo. In fact, it is a special RNA polymerase (primase) that makes the RNA primers DNA polymerase needs during replication.',
    },
    {
      kind: 'numeric',
      prompt: 'A gene is 2,400 nucleotides long and RNA polymerase moves at 40 nucleotides per second. How many **seconds** does it take to transcribe it once?',
      answer: 60,
      tolerance: 0.5,
      unit: 's',
      why: '2,400 ÷ 40 = 60 s. (Some human genes span over 2 million bp including introns; at this speed one transcript takes more than 13 hours!)',
    },
    {
      kind: 'explain',
      title: 'Eukaryotes: three polymerases and many helpers',
      body: String.raw`Bacteria use one RNA polymerase for everything. Eukaryotes have three nuclear ones:

- **RNA polymerase I** — most ribosomal RNA (rRNA), in the nucleolus;
- **RNA polymerase II** — all **mRNAs** (and many small regulatory RNAs);
- **RNA polymerase III** — tRNAs, 5S rRNA and other small RNAs.

Pol II cannot find promoters by itself; it needs **general transcription factors** (TFIID binds the TATA box, and so on) plus activator proteins bound at distant **enhancers** — see [eukaryotic transcription control](@bio/eukaryotic-transcription-control). Its product, **pre-mRNA**, must be processed before export ([RNA processing](@bio/rna-processing)).`,
    },
    {
      kind: 'match',
      prompt: 'Match each eukaryotic RNA polymerase or element to its job.',
      pairs: [
        ['RNA polymerase I', 'Makes most ribosomal RNA'],
        ['RNA polymerase II', 'Makes messenger RNA'],
        ['RNA polymerase III', 'Makes transfer RNA'],
        ['TATA box', 'Promoter element bound by TFIID'],
      ],
      why: 'Pol I → rRNA, Pol II → mRNA, Pol III → tRNA and other small RNAs (a handy memory aid: "1-2-3 = r-m-t"). The TATA box is a core promoter element recognised by TFIID, part of the general transcription machinery.',
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- **Transcription** = RNA polymerase copying one gene into RNA.
- The **template strand** is read 3′→5′; RNA grows 5′→3′ and matches the **coding strand** (U for T).
- Stages: **initiation** at a promoter (σ factor in bacteria; general transcription factors + TATA box in eukaryotes), **elongation**, **termination** (hairpin/Rho; poly-A signal in eukaryotes).
- No primer needed; more error-prone than replication; many polymerases can work on one gene.
- Eukaryotes: Pol I (rRNA), **Pol II (mRNA)**, Pol III (tRNA).`,
    },
  ],
  references: [
    { authors: 'Clark, M. A., Douglas, M., Choi, J.', title: 'Biology 2e', year: 2018, venue: 'OpenStax', detail: 'Ch. 15.2 “Prokaryotic Transcription”, 15.3 “Eukaryotic Transcription”', url: 'https://openstax.org/details/books/biology-2e' },
    { authors: 'Alberts, B., et al.', title: 'Molecular Biology of the Cell', year: 2022, venue: '7th ed., W. W. Norton', detail: 'Ch. 6 “How Cells Read the Genome: From DNA to Protein”' },
    { authors: 'Miller, O. L., Jr., Hamkalo, B. A., Thomas, C. A., Jr.', title: 'Visualization of bacterial genes in action', year: 1970, venue: 'Science 169, 392–395' },
    { authors: 'Cramer, P.', title: 'Organization and regulation of gene transcription', year: 2019, venue: 'Nature 573, 45–54' },
  ],
} satisfies LessonContent;
