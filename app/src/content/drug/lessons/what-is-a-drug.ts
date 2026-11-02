import type { LessonContent } from '../../types';

const sizeSvg = `<svg viewBox="0 0 320 210" xmlns="http://www.w3.org/2000/svg" font-family="inherit">
  <text x="160" y="14" text-anchor="middle" font-size="11" font-weight="700" fill="var(--fg)">Drug modalities by molecular weight (log scale)</text>
  <line x1="20" y1="150" x2="300" y2="150" stroke="var(--fg)" stroke-width="1"/>
  <g font-size="9" fill="var(--muted)" text-anchor="middle">
    <line x1="20" y1="146" x2="20" y2="154" stroke="var(--fg)"/><text x="20" y="166">100 Da</text>
    <line x1="90" y1="146" x2="90" y2="154" stroke="var(--fg)"/><text x="90" y="166">1 kDa</text>
    <line x1="160" y1="146" x2="160" y2="154" stroke="var(--fg)"/><text x="160" y="166">10 kDa</text>
    <line x1="230" y1="146" x2="230" y2="154" stroke="var(--fg)"/><text x="230" y="166">100 kDa</text>
    <line x1="300" y1="146" x2="300" y2="154" stroke="var(--fg)"/><text x="300" y="166">1 MDa</text>
  </g>
  <circle cx="38" cy="135" r="4" fill="var(--c1)"><animate attributeName="r" values="4;5;4" dur="2s" repeatCount="indefinite"/></circle>
  <text x="38" y="122" text-anchor="middle" font-size="9" fill="var(--fg)">aspirin</text>
  <text x="38" y="112" text-anchor="middle" font-size="9" fill="var(--muted)">180 Da</text>
  <circle cx="90" cy="132" r="6" fill="var(--c6)"/>
  <text x="90" y="100" text-anchor="middle" font-size="9" fill="var(--fg)">PROTAC</text>
  <text x="90" y="110" text-anchor="middle" font-size="9" fill="var(--muted)">~0.7–1 kDa</text>
  <circle cx="133" cy="130" r="8" fill="var(--c3)"/>
  <text x="133" y="86" text-anchor="middle" font-size="9" fill="var(--fg)">peptide</text>
  <text x="133" y="96" text-anchor="middle" font-size="9" fill="var(--muted)">semaglutide</text>
  <text x="133" y="106" text-anchor="middle" font-size="9" fill="var(--muted)">~4 kDa</text>
  <circle cx="179" cy="128" r="10" fill="var(--c4)"/>
  <text x="182" y="80" text-anchor="middle" font-size="9" fill="var(--fg)">siRNA</text>
  <text x="182" y="90" text-anchor="middle" font-size="9" fill="var(--muted)">~13 kDa</text>
  <circle cx="232" cy="122" r="16" fill="var(--c2)"><animate attributeName="r" values="16;17;16" dur="2.4s" repeatCount="indefinite"/></circle>
  <text x="232" y="62" text-anchor="middle" font-size="9" fill="var(--fg)">antibody</text>
  <text x="232" y="72" text-anchor="middle" font-size="9" fill="var(--muted)">~150 kDa</text>
  <circle cx="290" cy="114" r="24" fill="var(--c5)" opacity="0.8"/>
  <text x="290" y="44" text-anchor="middle" font-size="9" fill="var(--fg)">AAV gene</text>
  <text x="290" y="54" text-anchor="middle" font-size="9" fill="var(--fg)">therapy ~4 MDa</text>
  <text x="160" y="188" text-anchor="middle" font-size="9" fill="var(--muted)">Each tick = 10× heavier. A CAR-T "drug" is a whole living cell —</text>
  <text x="160" y="200" text-anchor="middle" font-size="9" fill="var(--muted)">tens of millions of times heavier again, far off the right edge.</text>
</svg>`;

const protacSvg = `<svg viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg" font-family="inherit">
  <text x="160" y="14" text-anchor="middle" font-size="11" font-weight="700" fill="var(--fg)">PROTAC: bring the target to the bin</text>
  <rect x="20" y="60" width="80" height="60" rx="18" fill="var(--c2)" opacity="0.8"/>
  <text x="60" y="94" text-anchor="middle" font-size="10" font-weight="700" fill="var(--fg)">target</text>
  <rect x="220" y="60" width="80" height="60" rx="18" fill="var(--c4)" opacity="0.8"/>
  <text x="260" y="88" text-anchor="middle" font-size="10" font-weight="700" fill="var(--fg)">E3 ligase</text>
  <text x="260" y="101" text-anchor="middle" font-size="9" fill="var(--fg)">(e.g. cereblon)</text>
  <g>
    <circle cx="112" cy="90" r="9" fill="var(--c1)"/>
    <line x1="121" y1="90" x2="199" y2="90" stroke="var(--fg)" stroke-width="3" stroke-dasharray="5 3"/>
    <circle cx="208" cy="90" r="9" fill="var(--c3)"/>
    <text x="160" y="80" text-anchor="middle" font-size="9" fill="var(--muted)">linker</text>
  </g>
  <g fill="var(--c5)">
    <circle cx="60" cy="140" r="6"><animate attributeName="cy" values="200;140" dur="3s" repeatCount="indefinite"/><animate attributeName="opacity" values="0;1" dur="3s" repeatCount="indefinite"/></circle>
    <circle cx="74" cy="148" r="6"><animate attributeName="cy" values="210;148" dur="3s" begin="0.5s" repeatCount="indefinite"/><animate attributeName="opacity" values="0;1" dur="3s" begin="0.5s" repeatCount="indefinite"/></circle>
    <circle cx="46" cy="148" r="6"><animate attributeName="cy" values="210;148" dur="3s" begin="1s" repeatCount="indefinite"/><animate attributeName="opacity" values="0;1" dur="3s" begin="1s" repeatCount="indefinite"/></circle>
  </g>
  <text x="60" y="172" text-anchor="middle" font-size="9" fill="var(--c5)">ubiquitin tags</text>
  <text x="160" y="186" text-anchor="middle" font-size="9" fill="var(--muted)">Tagged target → proteasome destroys it → PROTAC is released and reused</text>
  <text x="112" y="116" text-anchor="middle" font-size="9" fill="var(--c1)">warhead</text>
  <text x="208" y="116" text-anchor="middle" font-size="9" fill="var(--c3)">E3 binder</text>
</svg>`;

export default {
  cards: [
    {
      kind: 'explain',
      title: 'A key for a biological lock',
      body: `A **drug** is any substance given to change the body's biology in order to prevent, diagnose or treat disease.

Almost every drug works by *physically touching* a specific biological molecule — usually a protein called its **target** — and changing what that molecule does. Think of a key (the drug) that fits one lock (the target): it can jam the lock, turn it, or even get the whole door removed.

Drugs come in wildly different sizes and materials — from a 21-atom aspirin to a living, engineered immune cell. These families are called **modalities**. This lesson is a tour of them.`,
    },
    {
      kind: 'recall',
      title: 'Proteins: the usual targets',
      points: [
        'Proteins are chains of amino acids that fold into specific 3D shapes.',
        'Shape determines function: enzymes, receptors, channels and transporters all rely on precise pockets and surfaces.',
        'A small molecule usually binds in a **pocket** — a cleft on the folded surface.',
        'Large flat protein–protein interfaces are hard for small molecules to grip.',
      ],
      link: 'bio/protein-structure',
    },
    {
      kind: 'explain',
      title: 'Small molecules',
      body: `**Small molecules** are organic compounds, typically under ~500–900 daltons (Da; 1 Da ≈ the mass of a hydrogen atom). Aspirin, ibuprofen, imatinib and most pills in a pharmacy belong here.

Why they dominate: they can be made cheaply by chemical synthesis, are often stable as tablets, can be absorbed from the gut (**orally bioavailable**) and can slip *inside* cells to reach intracellular targets.

Their weakness: they need a decent pocket to bind, and their small size makes selectivity hard — they may hit unintended "off-target" proteins.

Tap the atoms of aspirin below: each atom is also a character in its text code (SMILES), which we will use in later lessons.`,
      widget: { type: 'MolGraphFingerprint', props: { molecule: 'aspirin', view: 'structure' }, caption: 'Aspirin (acetylsalicylic acid), C₉H₈O₄, 180 Da — a classic small-molecule drug.' },
    },
    {
      kind: 'mcq',
      prompt: 'Which property is the *main* practical advantage of small molecules over antibodies?',
      choices: [
        'They bind every protein in the body',
        'They can often be taken as a pill and can enter cells',
        'They are always more selective',
        'They never cause side effects',
      ],
      answer: 1,
      why: 'Small size lets many small molecules survive the gut, cross membranes and reach intracellular targets. They are *not* automatically more selective — antibodies are usually more selective because they grip a large surface.',
    },
    {
      kind: 'explain',
      title: 'Biologics: antibodies and other proteins',
      body: `**Biologics** are drugs made by living cells, mostly proteins. The biggest class is **monoclonal antibodies** (mAbs): Y-shaped immune proteins of ~150 kDa whose two tips can be engineered to grip almost any surface with high selectivity. Köhler & Milstein's 1975 hybridoma method made identical ("monoclonal") antibodies producible at scale.

Trade-offs: exquisite selectivity and long half-lives (weeks), but they must be injected (they would be digested in the gut), are expensive to manufacture and generally cannot enter cells — so their targets are on cell surfaces or in the blood (e.g. adalimumab blocks the cytokine TNF-α).

The chart compares modality sizes on a log scale.`,
      widget: { type: 'SvgDiagram', props: { svg: sizeSvg }, caption: 'Modalities span over four orders of magnitude in mass — before even counting cell therapies.' },
    },
    {
      kind: 'truefalse',
      prompt: 'A typical therapeutic antibody can be taken orally and reach targets inside the cell nucleus.',
      answer: false,
      why: 'Antibodies are large proteins: stomach acid and proteases would digest them, and they cannot cross cell membranes. They are injected and act on extracellular or cell-surface targets.',
    },
    {
      kind: 'recall',
      title: 'DNA → RNA → protein',
      points: [
        'Genes in DNA are transcribed into messenger RNA (mRNA).',
        'mRNA is translated by ribosomes into protein.',
        'Intervening at the DNA or RNA level changes *how much* protein is made, instead of blocking the protein itself.',
      ],
      link: 'bio/central-dogma',
    },
    {
      kind: 'explain',
      title: 'Acting upstream: oligonucleotides, gene & cell therapy',
      body: `Instead of blocking a protein, you can stop it being made:

- **Oligonucleotides** — short synthetic nucleic acid strands. *Antisense oligos* (ASOs) and *siRNAs* pair with a specific mRNA by base complementarity and trigger its destruction or alter its splicing (e.g. nusinersen for spinal muscular atrophy). Design is "programmable": the sequence follows from the gene.
- **Gene therapy** — deliver a working gene copy, usually in a harmless viral shell such as AAV, or edit the genome (the first CRISPR therapy, exa-cel, was approved in 2023 for sickle-cell disease).
- **Cell therapy** — the drug is a living cell, e.g. **CAR-T**: a patient's own T cells engineered to recognise and kill cancer cells.`,
    },
    {
      kind: 'match',
      prompt: 'Match each modality to how it works.',
      pairs: [
        ['Small-molecule inhibitor', 'Binds a pocket on a protein and blocks its activity'],
        ['Monoclonal antibody', 'Grips an extracellular protein surface with high selectivity'],
        ['siRNA / antisense oligo', 'Base-pairs with an mRNA so less protein is made'],
        ['CAR-T cell', 'Engineered living immune cell that kills tumour cells'],
        ['AAV gene therapy', 'Delivers a functional gene copy into cells'],
      ],
      why: 'Modalities differ in *where* they intervene: at the protein (small molecules, antibodies), at the mRNA (oligonucleotides), at the gene (gene therapy), or by adding a whole new cellular function (cell therapy).',
    },
    {
      kind: 'explain',
      title: 'Hybrids & degraders: ADCs, PROTACs, molecular glues',
      body: `Newer modalities combine ideas:

- **Antibody–drug conjugates (ADCs)** — an antibody carries a very toxic small molecule attached by a linker; the antibody's selectivity delivers the poison only to cells displaying the target (e.g. trastuzumab deruxtecan for HER2-positive cancer).
- **PROTACs** (proteolysis-targeting chimeras) — two small-molecule binders joined by a linker. One end grabs the target, the other an **E3 ubiquitin ligase**; the cell then tags the target with ubiquitin and destroys it. Because the PROTAC is released afterwards, it acts *catalytically* and needs only to *bind*, not to inhibit.
- **Molecular glues** — single small molecules that stick an E3 ligase to a new target (thalidomide analogues like lenalidomide work this way via cereblon).`,
      widget: { type: 'SvgDiagram', props: { svg: protacSvg }, caption: 'A PROTAC forms a ternary complex (target · PROTAC · E3), leading to ubiquitination and proteasomal degradation.' },
    },
    {
      kind: 'multi',
      prompt: 'Which statements about PROTACs are correct? (Select all that apply.)',
      choices: [
        'They recruit an E3 ubiquitin ligase to the target protein',
        'They must block the target’s active site to work',
        'One PROTAC molecule can trigger degradation of many target molecules',
        'They are typically larger than classic oral small-molecule drugs',
      ],
      answers: [0, 2, 3],
      why: 'PROTACs only need to *bind* the target somewhere — not inhibit it — then the E3 ligase does the work, and the PROTAC is recycled (catalytic). With two binders plus a linker they are often 700–1,000 Da, beyond typical oral drug size, which makes absorption harder.',
    },
    {
      kind: 'fill',
      prompt: 'An ___ uses an antibody to deliver a toxic payload; a ___ links a target binder to an E3 ligase binder; an ___ silences a gene by pairing with its mRNA.',
      bank: ['ADC', 'PROTAC', 'siRNA', 'agonist', 'CAR-T', 'enzyme'],
      answer: ['ADC', 'PROTAC', 'siRNA'],
      why: 'ADC = antibody + linker + cytotoxic payload; PROTAC = bifunctional degrader; siRNA = short double-stranded RNA that guides mRNA cleavage. CAR-T is a cell therapy, and "agonist" describes a mechanism, not a modality.',
    },
    {
      kind: 'numeric',
      prompt: 'Roughly how many times heavier is a 150,000 Da antibody than a 180 Da aspirin molecule? (Round to the nearest whole number.)',
      answer: 833,
      tolerance: 10,
      unit: '×',
      why: '150,000 / 180 ≈ 833. That ~1000-fold size gap explains why the two modalities behave so differently: oral absorption, cell entry, half-life, manufacturing and how they recognise targets.',
    },
    {
      kind: 'mcq',
      prompt: 'Your target is an *intracellular* protein with no obvious binding pocket, and you just need less of it. Which modality is the most natural first choice?',
      choices: ['A monoclonal antibody', 'A classic small-molecule inhibitor', 'An siRNA or antisense oligonucleotide', 'An antibody–drug conjugate'],
      answer: 2,
      why: 'Oligonucleotides act at the mRNA level, so no pocket is needed — only the gene sequence. Antibodies and ADCs cannot enter cells, and a pocketless protein is hard for a classic inhibitor. (A degrader could also work if *any* binder exists.)',
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: `- A drug changes biology, usually by binding a target (most often a protein).
- **Small molecules**: cheap, oral, cell-permeable, but need a pocket and can hit off-targets.
- **Biologics/antibodies**: large, selective, long-lived, injected, extracellular targets.
- **Oligonucleotides, gene and cell therapies** act upstream on RNA, DNA, or add living cells.
- **ADCs, PROTACs and molecular glues** combine modalities; degraders remove proteins rather than inhibit them.
- Choosing a modality is the first strategic decision in a drug programme — and it dictates which computational tools apply.`,
    },
  ],
  references: [
    { authors: 'Patrick, G. L.', title: 'An Introduction to Medicinal Chemistry', year: 2017, venue: '6th ed., Oxford University Press', detail: 'Ch. 1–2' },
    { authors: 'Santos, R., Ursu, O., Gaulton, A., et al.', title: 'A comprehensive map of molecular drug targets', year: 2017, venue: 'Nat. Rev. Drug Discov. 16, 19–34' },
    { authors: 'Köhler, G., Milstein, C.', title: 'Continuous cultures of fused cells secreting antibody of predefined specificity', year: 1975, venue: 'Nature 256, 495–497' },
    { authors: 'Békés, M., Langley, D. R., Crews, C. M.', title: 'PROTAC targeted protein degraders: the past is prologue', year: 2022, venue: 'Nat. Rev. Drug Discov. 21, 181–200' },
    { authors: 'Beck, A., Goetsch, L., Dumontet, C., Corvaïa, N.', title: 'Strategies and challenges for the next generation of antibody–drug conjugates', year: 2017, venue: 'Nat. Rev. Drug Discov. 16, 315–337' },
  ],
} satisfies LessonContent;
