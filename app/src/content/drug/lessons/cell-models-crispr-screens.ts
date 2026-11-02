import type { LessonContent } from '../../types';

/** Realism vs throughput ladder of experimental models. */
const ladderSvg = (() => {
  const rows = [
    ['Purified protein', 'biochemical assay', 'var(--c1)'],
    ['Cell line (2D)', 'immortal, cheap, scalable', 'var(--c2)'],
    ['Primary / iPSC-derived', 'real cell types, donor genetics', 'var(--c6)'],
    ['Organoid / 3D', 'self-organising tissue mini-structures', 'var(--c3)'],
    ['Animal model', 'whole-body PK, tox, physiology', 'var(--c4)'],
    ['Human', 'the only fully valid model', 'var(--c5)'],
  ];
  const items = rows.map(([a, b, c], i) => {
    const y = 26 + i * 27;
    return `<rect x="40" y="${y}" width="250" height="22" rx="6" fill="${c}" fill-opacity="0.2" stroke="${c}"/>
<text x="50" y="${y + 14}" font-weight="700" fill="var(--fg)">${a}</text>
<text x="282" y="${y + 14}" text-anchor="end" fill="var(--muted)">${b}</text>`;
  }).join('');
  return `<svg viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg"><g font-size="9">
<text x="160" y="14" font-size="10" font-weight="700" text-anchor="middle" fill="var(--fg)">Models: realism vs throughput</text>
<path d="M22 30 V186" stroke="var(--muted)" stroke-width="1.5"/><path d="M22 190 l-4 -8 h8 z" fill="var(--muted)"/>
<text x="14" y="110" text-anchor="middle" fill="var(--muted)" transform="rotate(-90 14 110)">more realistic · slower · costlier</text>
${items}
<circle cx="300" cy="37" r="5" fill="var(--c5)"><animate attributeName="cy" values="37;172;37" dur="6s" repeatCount="indefinite"/></circle>
</g></svg>`;
})();

/** Pooled screen read-out: guide abundance before vs after selection. */
const screenSvg = (() => {
  const guides = [
    { name: 'neutral', before: 60, after: 62, c: 'var(--muted)' },
    { name: 'neutral', before: 55, after: 50, c: 'var(--muted)' },
    { name: 'essential', before: 58, after: 8, c: 'var(--c5)' },
    { name: 'neutral', before: 62, after: 60, c: 'var(--muted)' },
    { name: 'resistance', before: 57, after: 130, c: 'var(--c3)' },
    { name: 'essential', before: 61, after: 12, c: 'var(--c5)' },
    { name: 'neutral', before: 54, after: 57, c: 'var(--muted)' },
  ];
  const base = 170;
  const bars = guides.map((g, i) => {
    const x = 36 + i * 40;
    return `<rect x="${x}" y="${base - g.before}" width="24" height="${g.before}" rx="3" fill="${g.c}" fill-opacity="0.75">
<animate attributeName="height" values="${g.before};${g.before};${g.after};${g.after};${g.before}" keyTimes="0;0.2;0.5;0.85;1" dur="6s" repeatCount="indefinite"/>
<animate attributeName="y" values="${base - g.before};${base - g.before};${base - g.after};${base - g.after};${base - g.before}" keyTimes="0;0.2;0.5;0.85;1" dur="6s" repeatCount="indefinite"/></rect>
<text x="${x + 12}" y="${base + 12}" text-anchor="middle" fill="var(--fg)">g${i + 1}</text>`;
  }).join('');
  return `<svg viewBox="0 0 320 210" xmlns="http://www.w3.org/2000/svg"><g font-size="9">
<text x="160" y="14" font-size="10" font-weight="700" text-anchor="middle" fill="var(--fg)">Guide read counts: before → after selection</text>
<line x1="28" y1="${base}" x2="310" y2="${base}" stroke="var(--muted)"/>
${bars}
<text x="40" y="198" fill="var(--c5)">■ depleted: gene needed to grow</text>
<text x="196" y="198" fill="var(--c3)">■ enriched: KO confers resistance</text>
</g></svg>`;
})();

export default {
  cards: [
    {
      kind: 'explain',
      title: 'Why put drugs on cells?',
      body: String.raw`A purified enzyme in a buffer is a clean but very simplified system. Real drugs must cross membranes, compete with cellular metabolites and act inside signalling networks. Real targets also have to *matter* for the disease. Cell models test both: is the compound active in a living system, and is the target worth hitting at all?

There is no single best model. Each step up in realism, from cell lines to organoids to animals, costs throughput, money and reproducibility. Choosing a model means choosing what you are willing to get wrong.`,
      widget: { type: 'SvgDiagram', props: { svg: ladderSvg }, caption: 'Most compounds are tested near the top of the ladder; only a few reach the bottom rungs.' },
    },
    {
      kind: 'explain',
      title: 'Immortalised cell lines',
      body: String.raw`**Cell lines** grow indefinitely in culture. Cancer-derived lines (HeLa, from Henrietta Lacks's cervical tumour, 1951) proliferate naturally. Others, such as HEK293, were transformed with viral genes. They are cheap and scalable and underpin most cell-based HTS. Panels of hundreds of cancer lines (e.g. the NCI-60) relate drug sensitivity to genotype.

Their weaknesses:
- They are abnormal: aneuploid, adapted to plastic and serum, and they drift genetically over passages.
- **Misidentification**: some widely used lines have turned out to be other cells, often HeLa contaminants. A register of misidentified lines is kept by ICLAC. Authenticate lines by **STR profiling**.
- Contamination, notably by *Mycoplasma*, alters biology without visible signs.`,
    },
    {
      kind: 'explain',
      title: 'Primary cells, iPSCs and organoids',
      body: String.raw`**Primary cells** come straight from tissue (e.g. human hepatocytes, blood immune cells). They are realistic but scarce, they vary between donors, and they die or change within days in culture.

**Induced pluripotent stem cells** (iPSCs; Takahashi & Yamanaka 2006) are adult cells reprogrammed by four transcription factors (Oct3/4, Sox2, Klf4, c-Myc) into a stem-like state. They can then be differentiated into neurons, cardiomyocytes or hepatocytes. Made from a patient, they carry that patient's genome and disease mutations. iPSC-derived cardiomyocytes are used to test cardiac safety.

**Organoids** are 3D structures grown from stem cells that self-organise into tissue-like architecture. Sato et al. (2009) grew crypt–villus "mini-guts" from single Lgr5⁺ intestinal stem cells. Tumour organoids from patients are banked for drug testing. They usually lack blood vessels, immune cells and the full tissue microenvironment.`,
    },
    {
      kind: 'mcq',
      prompt: 'You want to know whether a compound causes arrhythmia-like effects in heart muscle cells carrying a specific patient’s genetic variant. Which model fits best?',
      choices: [
        'iPSC-derived cardiomyocytes made from that patient',
        'HEK293 cells over-expressing one cardiac ion channel',
        'HeLa cells',
        'A purified ion-channel protein in an SPR assay',
      ],
      answer: 0,
      why: 'Patient iPSC-derived cardiomyocytes are human heart-like cells with the patient’s full genome, including the variant, and they beat and show action potentials. HEK cells with one channel are useful for screening a single liability like hERG but miss the integrated cardiac physiology; HeLa is irrelevant; a purified protein measures binding, not arrhythmia.',
    },
    {
      kind: 'recall',
      title: 'Recall: CRISPR–Cas9',
      points: [
        'Cas9 nuclease is guided by a single-guide RNA (sgRNA) whose ~20-nt spacer matches the target DNA next to a PAM (NGG for SpCas9).',
        'Cas9 makes a double-strand break; error-prone repair (NHEJ) leaves small insertions/deletions, often frameshifts → gene **knockout**.',
        'Catalytically dead Cas9 (dCas9) fused to a repressor or activator gives CRISPRi / CRISPRa: knock-down or switch-on without cutting.',
      ],
      link: 'bio/crispr',
    },
    {
      kind: 'explain',
      title: 'Pooled CRISPR knockout screens',
      body: String.raw`A **pooled screen** knocks out every gene in the genome, one per cell, in a single flask:

1. Clone a **library** of sgRNAs, typically 3–6 per gene. GeCKO (Shalem et al. 2014) had 64,751 guides covering 18,080 human genes.
2. Package it into lentivirus and infect Cas9-expressing cells at **low multiplicity of infection** (MOI ≈ 0.3), so most infected cells receive just one guide. The guide integrates into the genome and acts as a **barcode**.
3. Keep **coverage** high, commonly several hundred cells per guide, so that no guide is lost by chance.
4. Apply a selection: time (proliferation), a drug, or sorting by a reporter.
5. PCR-amplify the guide sequences and count them by next-generation sequencing. Compare to the starting population.`,
    },
    {
      kind: 'widget',
      title: 'Reading the screen',
      body: String.raw`After selection, each guide's **log₂ fold change** in read count tells you how its knockout affected cell fitness. Guides against essential genes **drop out** (negative selection). Under drug pressure, guides whose knockout confers **resistance** become enriched (positive selection). Guide-level counts are then combined into gene-level scores with methods such as MAGeCK (Li et al. 2014).`,
      widget: { type: 'SvgDiagram', props: { svg: screenSvg }, caption: 'Schematic: g3 and g6 target essential genes; g5 targets a gene whose loss lets cells survive the drug. Shalem et al. found NF2, CUL3, TADA1 and TADA2B knockouts enriched under vemurafenib in A375 melanoma cells.' },
    },
    {
      kind: 'numeric',
      prompt: 'A library has 70,000 guides. You want 500 transduced cells per guide, and at your virus dose only 25 % of cells are transduced. How many cells (in **millions**) must you infect?',
      answer: 140,
      tolerance: 1,
      unit: 'million cells',
      why: String.raw`Transduced cells needed $= 70\,000 \times 500 = 35$ million. With 25 % transduction you must start with $35/0.25 = 140$ million. Genome-wide screens are therefore large: they need many flasks of cells and deep sequencing.`,
    },
    {
      kind: 'explain',
      title: 'Why low MOI? A Poisson argument',
      body: String.raw`Viral integrations per cell follow roughly a **Poisson** distribution with mean $m$ (the MOI): $P(k) = e^{-m} m^k / k!$.

At $m = 0.3$: $P(0) = 0.741$, $P(1) = 0.222$, $P(\ge 2) = 0.037$. About 26 % of cells are infected, and of those about 86 % carry exactly one guide. Antibiotic selection (e.g. puromycin) then removes the uninfected cells.

At $m = 3$, by contrast, almost every cell would carry several guides. A phenotype could then no longer be traced to a single gene.`,
    },
    {
      kind: 'match',
      prompt: 'Match each screen design to the question it answers.',
      pairs: [
        ['Negative selection (dropout) over time', 'Which genes do these cells need to proliferate?'],
        ['Positive selection under a drug', 'Which knockouts let cells survive the drug?'],
        ['CRISPRi (dCas9–repressor)', 'What happens when expression is reduced but the gene is not cut?'],
        ['CRISPRa (dCas9–activator)', 'Which genes cause a phenotype when switched on?'],
        ['FACS-based screen', 'Which genes control the level of a fluorescent reporter?'],
      ],
      why: 'The selection defines the question. Dropout screens find dependencies (candidate targets, e.g. in the DepMap project), drug selections find resistance mechanisms or the drug’s pathway, CRISPRi/a give graded knock-down or gain-of-function, and sorting on a reporter connects genes to a specific readout.',
    },
    {
      kind: 'multi',
      prompt: 'Which are recognised pitfalls when interpreting CRISPR knockout screens? (Select all that apply.)',
      choices: [
        'Guides targeting amplified genomic regions can deplete because of multiple DNA cuts, even if the gene is not essential',
        'Too few cells per guide lets guides drift in or out by chance',
        'A knockout removes the whole protein, whereas a drug may block only one function of it',
        'Pooled screens can only be done in organoids',
        'A gene essential in every cell line may be a poor drug target because inhibiting it would be toxic',
      ],
      answers: [0, 1, 2, 4],
      why: 'Cutting amplified DNA causes a DNA-damage response and false dropout (reported in 2016 by Aguirre et al. and Munoz et al.). Low coverage adds noise. Knockout ≠ pharmacological inhibition, because of scaffolding functions and compensation. Pan-essential genes raise toxicity concerns. Pooled screens are routinely run in ordinary cell lines.',
    },
    {
      kind: 'truefalse',
      prompt: 'A gene whose guides drop out strongly in a cancer cell-line screen is, for that reason alone, a validated drug target.',
      answer: false,
      why: 'Dropout shows a genetic dependency in that line under culture conditions. Validation also needs selectivity (is it needed by normal cells?), relevance in vivo and in patients, and evidence that a drug-like molecule can mimic the knockout. See [Druggability & target validation](@drug/druggability). Synthetic-lethal pairs such as BRCA-mutant cells and PARP inhibition show the kind of context-specific dependency that is worth chasing.',
    },
    {
      kind: 'fill',
      prompt: 'Reprogrammed adult cells that can become any cell type are ___; self-organising 3D mini-tissues are ___; a cell line is authenticated by ___ profiling.',
      bank: ['iPSCs', 'organoids', 'STR', 'xenografts', 'spheroids', 'RNA-seq'],
      answer: ['iPSCs', 'organoids', 'STR'],
      why: 'Induced pluripotent stem cells come from adult cells reprogrammed with transcription factors. Organoids self-organise from stem cells into tissue-like structures; spheroids are simpler cell aggregates without that architecture. Short tandem repeat (STR) profiles give each human line a DNA fingerprint.',
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- Models trade **realism** for **throughput**: cell lines → primary/iPSC → organoids → animals → humans.
- Cell lines are scalable but abnormal and are sometimes misidentified; authenticate them (STR) and test for mycoplasma.
- **iPSCs** bring patient genetics; **organoids** bring 3D tissue architecture, though without vessels or immune cells.
- **Pooled CRISPR screens**: a guide library at low MOI with high coverage, then selection, then sequencing of guide barcodes, then log fold changes.
- Dropout reveals dependencies, enrichment under a drug reveals resistance. Neither alone validates a target.
- These screens produce some of the largest datasets used for computational target discovery: [Omics-driven target discovery](@drug/precision-medicine-omics).`,
    },
  ],
  references: [
    { authors: 'Shalem, O., Sanjana, N. E., Hartenian, E., et al.', title: 'Genome-scale CRISPR-Cas9 knockout screening in human cells', year: 2014, venue: 'Science 343, 84–87' },
    { authors: 'Wang, T., Wei, J. J., Sabatini, D. M., Lander, E. S.', title: 'Genetic screens in human cells using the CRISPR-Cas9 system', year: 2014, venue: 'Science 343, 80–84' },
    { authors: 'Li, W., Xu, H., Xiao, T., et al.', title: 'MAGeCK enables robust identification of essential genes from genome-scale CRISPR/Cas9 knockout screens', year: 2014, venue: 'Genome Biol. 15, 554' },
    { authors: 'Takahashi, K., Yamanaka, S.', title: 'Induction of pluripotent stem cells from mouse embryonic and adult fibroblast cultures by defined factors', year: 2006, venue: 'Cell 126, 663–676' },
    { authors: 'Sato, T., Vries, R. G., Snippert, H. J., et al.', title: 'Single Lgr5 stem cells build crypt–villus structures in vitro without a mesenchymal niche', year: 2009, venue: 'Nature 459, 262–265' },
  ],
} satisfies LessonContent;
