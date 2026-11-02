import type { LessonContent } from '../../types';

// Two fragment strategies side by side: growing a fragment, and linking two fragments in adjacent sub-pockets.
const fragSvg = `<svg viewBox="0 0 320 190" xmlns="http://www.w3.org/2000/svg">
<text x="80" y="14" text-anchor="middle" font-size="10" font-weight="700" fill="var(--fg)">Growing</text>
<text x="240" y="14" text-anchor="middle" font-size="10" font-weight="700" fill="var(--fg)">Linking</text>
<line x1="160" y1="8" x2="160" y2="186" stroke="var(--grid)"/>
<path d="M10,40 H40 V90 H120 V40 H150 V140 H10 Z" fill="var(--muted)" fill-opacity="0.18" stroke="var(--muted)"/>
<path d="M170,40 H195 V90 H230 V60 H250 V90 H285 V40 H310 V140 H170 Z" fill="var(--muted)" fill-opacity="0.18" stroke="var(--muted)"/>
<circle cx="55" cy="78" r="10" fill="var(--c2)"/>
<g opacity="0"><animate attributeName="opacity" values="0;0;1;1;0" keyTimes="0;0.25;0.35;0.9;1" dur="6s" repeatCount="indefinite"/>
<line x1="65" y1="78" x2="80" y2="78" stroke="var(--fg)" stroke-width="2"/><circle cx="86" cy="78" r="7" fill="var(--c3)"/></g>
<g opacity="0"><animate attributeName="opacity" values="0;0;1;1;0" keyTimes="0;0.5;0.6;0.9;1" dur="6s" repeatCount="indefinite"/>
<line x1="93" y1="78" x2="102" y2="70" stroke="var(--fg)" stroke-width="2"/><circle cx="107" cy="66" r="7" fill="var(--c3)"/></g>
<text x="80" y="160" text-anchor="middle" font-size="9" fill="var(--fg)">add atoms that make new contacts,</text>
<text x="80" y="172" text-anchor="middle" font-size="9" fill="var(--fg)">keeping ligand efficiency high</text>
<circle cx="210" cy="78" r="10" fill="var(--c2)"/>
<circle cx="270" cy="78" r="10" fill="var(--c6)"/>
<g opacity="0"><animate attributeName="opacity" values="0;0;1;1;0" keyTimes="0;0.4;0.5;0.9;1" dur="6s" repeatCount="indefinite"/>
<path d="M220,78 Q240,100 260,78" fill="none" stroke="var(--c1)" stroke-width="3"/></g>
<text x="240" y="160" text-anchor="middle" font-size="9" fill="var(--fg)">join two weak binders with a linker:</text>
<text x="240" y="172" text-anchor="middle" font-size="9" fill="var(--fg)">binding energies (roughly) add</text>
</svg>`;

// DEL selection: pooled DNA-tagged compounds, binders stay on immobilised target, the rest are washed away.
const tags = Array.from({ length: 9 }, (_, i) => i);
const delSvg = `<svg viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg">
<rect x="10" y="150" width="190" height="14" rx="4" fill="var(--c2)" fill-opacity="0.35"/>
<text x="105" y="160" text-anchor="middle" font-size="9" fill="var(--fg)">immobilised target protein</text>
${tags.map((i) => {
  const x = 22 + i * 20;
  const binder = i === 2 || i === 6;
  const col = binder ? 'var(--c1)' : 'var(--c3)';
  const anim = binder
    ? `<animateTransform attributeName="transform" type="translate" values="0,0; 0,62; 0,62; 0,62" keyTimes="0;0.3;0.6;1" dur="6s" repeatCount="indefinite"/>`
    : `<animateTransform attributeName="transform" type="translate" values="0,0; 0,40; 0,40; 140,-30" keyTimes="0;0.3;0.45;0.7" dur="6s" repeatCount="indefinite"/>
<animate attributeName="opacity" values="1;1;1;0;0" keyTimes="0;0.45;0.6;0.7;1" dur="6s" repeatCount="indefinite"/>`;
  return `<g>${anim}<circle cx="${x}" cy="80" r="6" fill="${col}"/><path d="M${x},74 q4,-8 0,-16 q-4,-8 0,-16" fill="none" stroke="var(--muted)" stroke-width="2"/></g>`;
}).join('\n')}
<text x="105" y="16" text-anchor="middle" font-size="9" fill="var(--muted)">compound (circle) + DNA barcode (wavy tail)</text>
<text x="105" y="185" text-anchor="middle" font-size="9" fill="var(--fg)">wash → binders stay → PCR + sequence tags</text>
<g font-size="8.5" fill="var(--fg)">
<text x="215" y="56">sequencing counts</text>
${[['#2', 48, 'var(--c1)'], ['#6', 40, 'var(--c1)'], ['#4', 4, 'var(--c3)'], ['#8', 3, 'var(--c3)'], ['#1', 2, 'var(--c3)']].map(([lab, h, col], j) => {
  const y = 66 + j * 16;
  return `<text x="215" y="${y + 9}">${lab}</text><rect x="232" y="${y}" width="0" height="10" fill="${col}"><animate attributeName="width" values="0;0;${Number(h) * 1.6};${Number(h) * 1.6}" keyTimes="0;0.7;0.85;1" dur="6s" repeatCount="indefinite"/></rect>`;
}).join('\n')}
</g>
</svg>`;

export default {
  cards: [
    {
      kind: 'explain',
      title: 'Three answers to the HTS hangover',
      body: String.raw`The [combichem/HTS era](@drug/combichem-hts-genomics) showed that brute force alone does not make drugs. Three ideas, each rising in the 2000s–2010s, tackled different weaknesses:
- **Fragments**: screen *fewer, smaller* molecules, and grow the best binders efficiently.
- **DNA-encoded libraries (DELs)**: screen *vastly more* molecules, all at once in one tube.
- **Phenotypic screening**: stop assuming you know the right target; screen for the effect in cells or organisms.

They sound contradictory, but each fixes a different flaw: molecule quality, cost per compound tested, and target validity.`,
    },
    {
      kind: 'explain',
      title: 'Why start small?',
      body: String.raw`Hann, Leach and Harper (2001) argued that the more complex a molecule, the *less* likely it is to match a binding site perfectly — every extra group is another chance to clash. Small molecules match more often, though weakly.

Small molecules also cover their chemical space far better: there are about $10^9$ possible molecules of up to 13 heavy (non-hydrogen) atoms (GDB-13), but perhaps $10^{60}$ drug-sized ones. A library of ~1,000–2,000 fragments therefore samples its space vastly more thoroughly than $10^6$ HTS compounds sample theirs.

Fragments typically obey the **rule of three** (Congreve et al. 2003): molecular weight < 300 Da, cLogP ≤ 3, ≤ 3 H-bond donors and ≤ 3 acceptors.`,
    },
    {
      kind: 'explain',
      title: 'Ligand efficiency: affinity per atom',
      body: String.raw`A fragment with dissociation constant $K_d = 100$ µM looks hopeless next to a 10 nM HTS hit — unless you ask how much binding each atom buys. **Ligand efficiency** (Hopkins et al. 2004) is

$$\mathrm{LE} = \frac{-\Delta G}{N_{\text{heavy}}} \approx \frac{1.37\,\mathrm{p}K_d}{N_{\text{heavy}}}\ \ \text{kcal mol}^{-1}\text{ per heavy atom},$$

where $\mathrm{p}K_d = -\log_{10} K_d$ and 1.37 kcal/mol is $RT\ln 10$ at 298 K. A good lead has LE ≳ 0.3. In the plot, each line is constant LE: to reach pKd 8 at LE 0.3 a molecule needs ~36 heavy atoms, while starting from an efficient fragment leaves room to grow.`,
      widget: {
        type: 'FunctionPlot',
        props: {
          fns: ['LE*x/1.37', '0.3*x/1.37'],
          x: [0, 45], y: [0, 12],
          params: [{ name: 'LE', min: 0.15, max: 0.6, value: 0.45, label: 'ligand efficiency' }],
          labels: ['your LE', 'LE = 0.3 (typical target)'],
          xLabel: 'heavy atoms', yLabel: 'pKd',
        },
        caption: 'Growing along a high-LE line reaches nanomolar potency with fewer atoms — and smaller molecules tend to have better ADME properties.',
      },
    },
    {
      kind: 'numeric',
      prompt: String.raw`A fragment with 12 heavy atoms binds with $K_d = 100$ µM. Using $\mathrm{LE} \approx 1.37\,\mathrm{p}K_d / N_{\text{heavy}}$, what is its ligand efficiency (kcal/mol per heavy atom)?`,
      answer: 0.46,
      tolerance: 0.02,
      why: String.raw`$K_d = 10^{-4}$ M, so pKd = 4 and LE = $1.37 \times 4 / 12 \approx 0.46$ — higher than a typical 10 nM, 36-atom HTS hit ($1.37 \times 8/36 \approx 0.30$). Weak in absolute terms, excellent per atom.`,
    },
    {
      kind: 'explain',
      title: 'Finding and evolving fragments',
      body: String.raw`Fragments bind too weakly (µM–mM) for ordinary assays, so they are detected by sensitive [biophysics](@drug/biophysical-methods): NMR, X-ray crystallography, surface plasmon resonance, thermal shift. Then they are **grown**, **linked** or **merged**.

The founding paper, **SAR by NMR** (Shuker, Hajduk, Meadows & Fesik, Science 1996), found two fragments binding neighbouring sites of the protein FKBP with $K_d \approx 2$ µM and $\approx 100$ µM, and linked them into a 19 nM ligand. If binding free energies simply added, $K_{d,\text{linked}} \approx K_{d1} K_{d2} / (1\ \text{M})$ = 0.2 nM; Jencks (1981) explained why linking can even do better (rigid-body entropy is paid only once), but in practice imperfect linkers usually lose some of the ideal gain.`,
      widget: { type: 'SvgDiagram', props: { svg: fragSvg }, caption: 'Growing (left) and linking (right). Merging — combining overlapping fragments into one — is the third strategy.' },
    },
    {
      kind: 'mcq',
      prompt: String.raw`Two fragments each bind with $K_d = 1$ mM in adjacent sub-pockets. If their binding free energies added perfectly when linked (no strain, no extra entropy bonus), what would the linked compound's $K_d$ be?`,
      choices: ['2 mM', '0.5 mM', '1 µM', '1 nM'],
      answer: 2,
      why: String.raw`Free energies add, so equilibrium constants *multiply*: $K_d \approx 10^{-3} \times 10^{-3} / 1\,\text{M} = 10^{-6}$ M = 1 µM. Adding or averaging the $K_d$ values (2 mM, 0.5 mM) is the common mistake; 1 nM would need much more binding energy.`,
    },
    {
      kind: 'explain',
      title: 'Fragment drugs reach patients',
      body: String.raw`- **Vemurafenib** (approved 2011) for melanoma with the **BRAF V600E** mutation came from Plexxikon's scaffold-based approach: small, weakly binding compounds were screened against many kinases with co-crystallography, a 7-azaindole scaffold binding the kinase hinge was chosen, and it was grown into a selective inhibitor (Tsai et al. 2008). It is generally counted as the first approved fragment-derived drug.
- **Venetoclax** (2016), a BCL-2 inhibitor for leukaemia, descends from Abbott's SAR-by-NMR work on the related protein BCL-X$_\mathrm{L}$ — a protein–protein interaction once considered undruggable.

Erlanson and colleagues' reviews (2004, 2016) track the growing list of fragment-derived clinical compounds.`,
    },
    {
      kind: 'widget',
      title: 'DNA-encoded libraries: a barcode on every molecule',
      body: String.raw`**Brenner and Lerner** (1992) proposed "encoded combinatorial chemistry": record each compound's synthesis history in an attached DNA sequence, so that a binder can be identified by PCR and sequencing. Modern DELs build libraries by split-and-pool, ligating a DNA "codon" after each chemistry cycle; three cycles of 1,000 building blocks give $10^9$ compounds in one tube. GSK's Clark et al. (2009) showed libraries of up to ~800 million members finding kinase inhibitors.`,
      widget: { type: 'SvgDiagram', props: { svg: delSvg }, caption: 'Selection replaces one-by-one assays: binders are enriched, their barcodes counted. Here barcodes #2 and #6 are strongly enriched.' },
    },
    {
      kind: 'order',
      prompt: 'Order the steps of a DNA-encoded library screen.',
      steps: [
        'Build the library by split-and-pool, ligating a DNA tag after each chemistry cycle',
        'Incubate the pooled library with the immobilised target protein',
        'Wash away non-binders',
        'Amplify the remaining DNA tags by PCR and sequence them',
        'Rank compounds by enrichment of their barcodes',
        'Resynthesise top compounds without DNA and test them in assays',
      ],
      why: 'The DNA is only a label: the final, essential step is to make the compound *off-DNA* and confirm it binds and acts, because the tag and linker can alter binding.',
    },
    {
      kind: 'truefalse',
      prompt: 'A DEL compound whose barcode is strongly enriched after selection is guaranteed to inhibit the target’s function.',
      answer: false,
      why: 'Selection detects *binding* (to some site, possibly a non-functional one, possibly helped by the DNA tag), not functional inhibition. Truncated synthesis products and sequencing noise add false positives. Off-DNA resynthesis and functional assays are required.',
    },
    {
      kind: 'explain',
      title: 'The phenotypic revival',
      body: String.raw`A **phenotypic screen** measures an effect in cells, tissues or organisms (bacteria die, a cell stops making a protein, a zebrafish's heart beats normally) *without* presupposing the molecular target. Swinney and Anthony (2011) analysed new drugs approved by the FDA in 1999–2008. Of the **75 first-in-class** drugs (new mechanisms), 50 were small molecules; of these, **28 came from phenotypic screening and 17 from target-based approaches**. For follower drugs (new molecules for known mechanisms), target-based discovery dominated.

The message: when the biology is poorly understood, letting the cell choose the target finds genuinely new mechanisms.`,
    },
    {
      kind: 'explain',
      title: 'Examples and the price: target deconvolution',
      body: String.raw`- **Bedaquiline** (TB, approved 2012) came from a whole-cell mycobacterial screen; its target, ATP synthase, was identified from resistant mutants (Andries et al. 2005).
- **Lenalidomide** was optimised from thalidomide in cell assays; the shared target, **cereblon**, was found only in 2010 — and turned out to explain a whole new modality, [molecular glue degraders](@drug/new-modalities).
- **Risdiplam** (2020) for spinal muscular atrophy came from a screen for compounds that correct *SMN2* splicing.

The price is **target deconvolution** — affinity pull-downs, resistance mutations, [CRISPR screens](@drug/cell-models-crispr-screens) — and an assay that truly reflects human disease. A cell model that misses the disease biology just finds the wrong drugs faster.`,
    },
    {
      kind: 'multi',
      prompt: 'Which statements about phenotypic screening are correct?',
      choices: [
        'It can discover drugs acting through previously unknown mechanisms',
        'Hits must already get into cells and act in a biological context',
        'It makes structure-based optimisation straightforward from day one',
        'It usually requires later work to identify the molecular target',
        'Its value depends critically on how well the assay models the disease',
        'Swinney & Anthony found it was the main source of follower drugs',
      ],
      answers: [0, 1, 3, 4],
      why: 'Without a known target there is no structure to design against at first — that is the trade-off. Swinney & Anthony found phenotypic screening led for *first-in-class* small molecules, while target-based approaches dominated *followers*.',
    },
    {
      kind: 'match',
      prompt: 'Match each approach to an example.',
      pairs: [
        ['SAR by NMR (fragment linking)', 'Nanomolar FKBP ligand from two weak fragments (1996)'],
        ['Scaffold/fragment-based kinase screening', 'Vemurafenib for BRAF V600E melanoma (2011)'],
        ['DNA-encoded library selection', 'Hundreds of millions of tagged compounds screened in one tube'],
        ['Whole-cell phenotypic screen', 'Bedaquiline, whose ATP-synthase target was found afterwards'],
        ['Target deconvolution long after approval', 'Thalidomide analogues and cereblon (2010)'],
      ],
      why: 'Fragments trade library size for efficiency; DELs trade per-compound assay data for sheer numbers; phenotypic screens trade mechanistic clarity for biological relevance.',
    },
    {
      kind: 'fill',
      prompt: 'Fragment hits bind weakly, often in the ___ range, but have high ___, so they leave room to grow into potent, drug-like leads.',
      bank: ['µM–mM', 'pM', 'ligand efficiency', 'molecular weight', 'lipophilicity'],
      answer: ['µM–mM', 'ligand efficiency'],
      why: 'Fragments are ~10–20 heavy atoms with Kd typically 10 µM–10 mM. Their affinity per atom is high, which is why careful growth can reach nM potency while staying small.',
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- **Fragments**: small (rule of three), weak but efficient binders found by biophysics; grown, linked or merged. SAR by NMR (1996) → vemurafenib (2011), venetoclax (2016). Track **ligand efficiency** $\approx 1.37\,\mathrm{p}K_d/N_{\text{heavy}}$.
- Linking multiplies $K_d$ values (free energies add), at best.
- **DELs**: Brenner & Lerner's 1992 concept; split-and-pool with DNA barcodes, selection by binding, decoding by sequencing — confirm off-DNA.
- **Phenotypic screening**: led to more first-in-class small molecules than target-based screening in 1999–2008 (28 vs 17; Swinney & Anthony 2011), at the cost of target deconvolution.`,
    },
  ],
  references: [
    { authors: 'Shuker, S. B., Hajduk, P. J., Meadows, R. P., Fesik, S. W.', title: 'Discovering high-affinity ligands for proteins: SAR by NMR', year: 1996, venue: 'Science 274, 1531–1534' },
    { authors: 'Erlanson, D. A., Fesik, S. W., Hubbard, R. E., Jahnke, W., Jhoti, H.', title: 'Twenty years on: the impact of fragments on drug discovery', year: 2016, venue: 'Nat. Rev. Drug Discov. 15, 605–619' },
    { authors: 'Brenner, S., Lerner, R. A.', title: 'Encoded combinatorial chemistry', year: 1992, venue: 'Proc. Natl Acad. Sci. USA 89, 5381–5383' },
    { authors: 'Clark, M. A., Acharya, R. A., Arico-Muendel, C. C., et al.', title: 'Design, synthesis and selection of DNA-encoded small-molecule libraries', year: 2009, venue: 'Nat. Chem. Biol. 5, 647–654' },
    { authors: 'Swinney, D. C., Anthony, J.', title: 'How were new medicines discovered?', year: 2011, venue: 'Nat. Rev. Drug Discov. 10, 507–519' },
  ],
} satisfies LessonContent;
