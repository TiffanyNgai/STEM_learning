import type { LessonContent } from '../../types';

const vennSvg = `<svg viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg" font-family="inherit">
  <text x="160" y="14" text-anchor="middle" font-size="11" font-weight="700" fill="var(--fg)">The druggable genome (Hopkins &amp; Groom 2002)</text>
  <rect x="8" y="24" width="304" height="168" rx="10" fill="none" stroke="var(--muted)" stroke-dasharray="4 3"/>
  <text x="16" y="38" font-size="9" fill="var(--muted)">human genome (their estimate: ~30,000 genes)</text>
  <circle cx="125" cy="115" r="62" fill="var(--c2)" fill-opacity="0.25" stroke="var(--c2)">
    <animate attributeName="cx" values="95;125" dur="2s" fill="freeze"/>
  </circle>
  <circle cx="195" cy="115" r="62" fill="var(--c3)" fill-opacity="0.25" stroke="var(--c3)">
    <animate attributeName="cx" values="225;195" dur="2s" fill="freeze"/>
  </circle>
  <text x="100" y="108" text-anchor="middle" font-size="9" font-weight="700" fill="var(--fg)">druggable</text>
  <text x="100" y="120" text-anchor="middle" font-size="9" fill="var(--fg)">~3,000 genes</text>
  <text x="100" y="132" text-anchor="middle" font-size="8" fill="var(--muted)">bind drug-like</text>
  <text x="100" y="142" text-anchor="middle" font-size="8" fill="var(--muted)">molecules</text>
  <text x="222" y="108" text-anchor="middle" font-size="9" font-weight="700" fill="var(--fg)">disease-</text>
  <text x="222" y="120" text-anchor="middle" font-size="9" font-weight="700" fill="var(--fg)">modifying</text>
  <text x="222" y="132" text-anchor="middle" font-size="9" fill="var(--fg)">~3,000 genes</text>
  <g opacity="0">
    <animate attributeName="opacity" values="0;1" begin="2s" dur="0.8s" fill="freeze"/>
    <text x="160" y="112" text-anchor="middle" font-size="9" font-weight="800" fill="var(--c1)">drug</text>
    <text x="160" y="123" text-anchor="middle" font-size="9" font-weight="800" fill="var(--c1)">targets</text>
    <text x="160" y="135" text-anchor="middle" font-size="9" font-weight="700" fill="var(--c1)">600–1,500</text>
  </g>
</svg>`;

const pocketSvg = `<svg viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg" font-family="inherit">
  <text x="80" y="14" text-anchor="middle" font-size="10" font-weight="700" fill="var(--fg)">Deep pocket (enzyme)</text>
  <text x="240" y="14" text-anchor="middle" font-size="10" font-weight="700" fill="var(--fg)">Flat PPI interface</text>
  <path d="M5,80 L50,80 Q55,140 80,140 Q105,140 110,80 L155,80 L155,170 L5,170 Z" fill="var(--c2)" fill-opacity="0.3" stroke="var(--c2)" stroke-width="1.5"/>
  <circle cx="80" cy="40" r="11" fill="var(--c1)">
    <animate attributeName="cy" values="34;126;126;34" keyTimes="0;0.4;0.85;1" dur="5s" repeatCount="indefinite"/>
  </circle>
  <text x="80" y="164" text-anchor="middle" font-size="8.5" fill="var(--fg)">ligand surrounded on 3 sides</text>
  <path d="M165,110 Q200,104 240,108 Q280,112 315,106 L315,170 L165,170 Z" fill="var(--c3)" fill-opacity="0.3" stroke="var(--c3)" stroke-width="1.5"/>
  <circle cx="240" cy="40" r="11" fill="var(--c1)">
    <animate attributeName="cy" values="34;96;96;34" keyTimes="0;0.4;0.85;1" dur="5s" repeatCount="indefinite"/>
    <animate attributeName="cx" values="240;240;252;228;240" keyTimes="0;0.4;0.6;0.75;1" dur="5s" repeatCount="indefinite"/>
  </circle>
  <rect x="190" y="52" width="100" height="30" rx="6" fill="var(--c4)" fill-opacity="0.15" stroke="var(--c4)" stroke-dasharray="3 2"/>
  <text x="240" y="64" text-anchor="middle" font-size="8" fill="var(--fg)">partner protein</text>
  <text x="240" y="75" text-anchor="middle" font-size="8" fill="var(--fg)">covers a large area</text>
  <text x="240" y="164" text-anchor="middle" font-size="8.5" fill="var(--fg)">few contacts, ligand slides off</text>
</svg>`;

export default {
  cards: [
    {
      kind: 'explain',
      title: 'The thirty-year "undruggable" target',
      body: String.raw`**RAS** genes (most often **KRAS**) are mutated in roughly a fifth of human cancers. For about 30 years KRAS was called *undruggable*. Its surface is smooth, and its natural ligands (GTP and GDP) bind with picomolar affinity, so competing with them seemed hopeless.

In 2013, Ostrem, Shokat and colleagues found a hidden pocket next to the mutated residue of **KRAS G12C** (glycine 12 changed to cysteine). A small molecule could bind there *and* form a covalent bond to that cysteine. That route led to **sotorasib**, approved in 2021.

So "druggability" is not a fixed property of a protein. It depends on our chemistry and on our cleverness.`,
    },
    {
      kind: 'explain',
      title: 'Ligandable, druggable, worth drugging',
      body: String.raw`Three different questions are often blurred together:

- **Ligandable**: can *any* molecule bind the protein tightly?
- **Druggable** (in the classic small-molecule sense): can a *drug-like* molecule (orally absorbable, roughly rule-of-five sized) bind it with useful potency *and* change its function?
- **Disease-relevant**: will changing this protein actually help patients?

Hopkins & Groom (2002) estimated that ~3,000 human genes belong to families known to bind drug-like molecules (the **druggable genome**) and ~3,000 genes are disease-modifying. Only the **overlap**, which they estimated at **600–1,500** genes, are attractive small-molecule targets.`,
      widget: { type: 'SvgDiagram', props: { svg: vennSvg }, caption: 'Hopkins & Groom used ~30,000 human genes in their 2002 estimate; the current count of protein-coding genes is ~20,000.' },
    },
    {
      kind: 'mcq',
      prompt: 'A protein binds a 2,000 Da cyclic peptide with 1 nM affinity, but no small molecule under 500 Da has ever bound it. In Hopkins & Groom’s sense, the protein is best described as…',
      choices: [
        'Druggable and validated',
        'Ligandable, but not (yet) druggable by classic small molecules',
        'Undruggable by any modality',
        'Disease-relevant',
      ],
      answer: 1,
      why: 'A potent ligand exists, so the protein is **ligandable**. Classic druggability requires a *drug-like* small molecule, which is missing here. Nothing in the prompt says whether the protein matters for disease. Other modalities (peptides, degraders, oligonucleotides) may still reach it.',
    },
    {
      kind: 'explain',
      title: 'What makes a pocket druggable?',
      body: String.raw`A small molecule binds through many weak contacts (see [binding affinity](@drug/binding-affinity)). To collect enough of them, it needs a site that is:

- **enclosed**: concave, so the ligand is surrounded rather than sitting on a surface;
- largely **hydrophobic**, with a few polar "anchors" for hydrogen bonds;
- big enough, but not huge: a few hundred cubic ångströms.

**Protein–protein interfaces** usually fail these tests. They bury about 1,500–3,000 Å² of flat surface, compared with roughly 300–1,000 Å² for a small molecule in a pocket (Wells & McClendon 2007). Binding there is still possible when affinity is concentrated in a few **hot-spot** residues. BCL-2 (venetoclax) is the classic success.`,
      widget: { type: 'SvgDiagram', props: { svg: pocketSvg }, caption: 'Same ligand, two surfaces: a concave pocket provides many contacts; a flat interface provides few.' },
    },
    {
      kind: 'truefalse',
      prompt: 'Protein–protein interfaces are usually easy small-molecule targets because they are large, so there is a lot of surface to bind.',
      answer: false,
      why: 'Size alone is not enough: interfaces are typically *flat* and spread their binding energy over a large area. A ~500 Da molecule can cover only a small part of that area, so it cannot easily outcompete a whole protein partner. Hot spots and induced pockets are the exceptions that make some PPIs druggable.',
    },
    {
      kind: 'explain',
      title: 'Predicting druggability computationally',
      body: String.raw`Given a 3D structure (from the PDB, or predicted, e.g. by [AlphaFold](@drug/alphafold)), algorithms can estimate druggability:

1. **Find pockets** geometrically. *fpocket* fills cavities with "alpha spheres" and clusters them.
2. **Score them** on volume, enclosure and hydrophobicity. Examples are SiteMap's Dscore and Cheng et al.'s (2007) model of the *maximal affinity* a pocket can support.
3. **Look for cryptic pockets**: sites that open only occasionally or when a ligand binds. The KRAS switch-II pocket is one, and [molecular dynamics](@drug/molecular-dynamics) can reveal such sites.

Experimentally, a high **fragment-screening hit rate** is a good sign of druggability (Hajduk, Huth & Fesik 2005).`,
    },
    {
      kind: 'match',
      prompt: 'Match the "undruggable" obstacle to a strategy that has worked around it.',
      pairs: [
        ['No deep pocket, but one reactive cysteine nearby', 'Covalent inhibitor (e.g. sotorasib, KRAS G12C)'],
        ['Binder exists but does not block function', 'Targeted degrader (PROTAC) that removes the protein'],
        ['Target is an extracellular protein with no pocket', 'Monoclonal antibody'],
        ['Protein has no binder at all, but its mRNA is known', 'siRNA or antisense oligonucleotide'],
      ],
      why: 'New chemistry changes what counts as druggable. A covalent bond makes up for a shallow pocket, degraders need only *binding*, antibodies grip large flat surfaces outside cells, and oligonucleotides bypass the protein entirely. See [new modalities](@drug/new-modalities).',
    },
    {
      kind: 'explain',
      title: 'Target validation: will hitting it help?',
      body: String.raw`A druggable target is worthless if modulating it does not change the disease. **Validation** builds that confidence by combining independent evidence:

- **Human genetics**: people who naturally carry loss-of-function variants are a "natural experiment". Drug targets with genetic support are about **2–2.6 times** more likely to succeed in the clinic (Nelson et al. 2015; Minikel et al. 2024).
- **Genetic perturbation** in cells and animals: knockouts, RNAi, and [CRISPR](@bio/crispr) screens such as the cancer Dependency Map.
- **Chemical probes**: selective tool compounds that show what *pharmacological* inhibition does. A common standard (Arrowsmith et al. 2015) is <100 nM potency, >30-fold selectivity within the family and cellular activity at ≤1 µM.
- **Biomarkers** that show the target is engaged in patients.`,
    },
    {
      kind: 'widget',
      title: 'Case study: PCSK9, from genetics to medicine',
      widget: {
        type: 'StepReveal',
        props: {
          steps: [
            'Families with very high LDL cholesterol carry **gain-of-function** mutations in the gene *PCSK9* (Abifadel et al. 2003).',
            'People with **loss-of-function** *PCSK9* variants have lower LDL. In one cohort, carriers of nonsense variants had ~28% lower LDL and ~88% lower coronary heart disease risk (Cohen et al. 2006).',
            'Mechanism: PCSK9 binds the LDL receptor and sends it for destruction, so less PCSK9 means more receptors clearing LDL from blood.',
            'PCSK9 acts **outside the cell** through a flat protein–protein interface, which suits an antibody better than a small molecule.',
            'Antibodies evolocumab and alirocumab were approved in 2015. The siRNA inclisiran followed, lowering PCSK9 production in the liver.',
          ],
          notes: [
            'Genetics identifies the target.',
            'A natural experiment predicts both efficacy and the safety of lifelong low levels.',
            'The biology explains *why* the drug works.',
            'Druggability decides the modality.',
            'Validation pays off: high confidence in the target, two modalities succeed.',
          ],
        },
      },
    },
    {
      kind: 'recall',
      title: 'CRISPR (from Biology)',
      points: [
        'Cas9 is guided by a ~20-nucleotide guide RNA to a matching DNA sequence and cuts it.',
        'Error-prone repair of the cut often disrupts the gene and gives a **knockout**.',
        'Pooled screens knock out thousands of genes in parallel. Sequencing the guides reveals which knockouts kill cells or rescue a phenotype.',
        'A genetic knockout is not the same as a drug: it removes the whole protein permanently, whereas a drug may inhibit one function, partially and reversibly.',
      ],
      link: 'bio/crispr',
    },
    {
      kind: 'numeric',
      prompt: 'Suppose 10% of programmes entering Phase I reach approval. If programmes with human genetic support have a relative success of 2.6× (Minikel et al. 2024), what percentage of genetically supported programmes would you expect to be approved?',
      answer: 26,
      tolerance: 0.5,
      unit: '%',
      why: String.raw`Relative success multiplies the baseline probability: $0.10\times2.6 = 0.26$, i.e. **26%**. That is a large effect, given that failed efficacy is the main reason drugs die in Phase II (see [cost & attrition](@drug/cost-attrition-productivity)).`,
    },
    {
      kind: 'mcq',
      prompt: 'Which compound is acceptable as a **chemical probe** for validating kinase X?',
      choices: [
        'IC₅₀ 5 µM against X, unselective',
        'IC₅₀ 20 nM against X, 3-fold selective over kinase Y, active in cells at 10 µM',
        'IC₅₀ 30 nM against X, >100-fold selective across the kinase family, on-target activity in cells at 300 nM',
        'A compound that kills cancer cells but whose target is unknown',
      ],
      answer: 2,
      why: 'Probe criteria (Arrowsmith et al. 2015) ask for potency below ~100 nM, >30-fold selectivity within the family and on-target cell activity at ≤1 µM. Only the 30 nM compound that is >100-fold selective and active in cells at 300 nM meets all three. A poorly selective "probe" can validate the wrong target, which is a common source of irreproducible biology.',
    },
    {
      kind: 'order',
      prompt: 'Put the KRAS story in chronological order.',
      steps: [
        'Mutant human *RAS* genes identified as cancer drivers (early 1980s)',
        'Decades of failed attempts; KRAS labelled "undruggable"',
        'Ostrem et al. discover covalent inhibitors binding the switch-II pocket of KRAS G12C (2013)',
        'Sotorasib approved for KRAS G12C lung cancer (2021)',
      ],
      why: 'It took roughly 40 years from finding the oncogene to having a drug. The breakthrough came from a new kind of pocket (cryptic, allosteric) plus a new kind of chemistry (covalent targeting of the mutant cysteine), not from screening harder against the GTP site.',
    },
    {
      kind: 'multi',
      prompt: 'Which pieces of evidence genuinely **raise** confidence that inhibiting protein X will treat disease D? (Select all that apply.)',
      choices: [
        'Humans with natural loss-of-function variants in X have lower risk of D',
        'A highly selective chemical probe for X reverses a D-relevant phenotype in patient-derived cells',
        'X is highly expressed in many tissues',
        'X has a deep, hydrophobic, well-defined pocket',
      ],
      answers: [0, 1],
      why: 'Genetic and selective pharmacological evidence link X to D. High expression says nothing about causality. A good pocket raises **druggability**, not **validity**. Validity and druggability are separate axes, and a target needs both.',
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- **Ligandable ≠ druggable ≠ disease-relevant.** Attractive targets lie in the overlap, estimated at 600–1,500 genes by Hopkins & Groom (2002).
- Druggable pockets are enclosed, mostly hydrophobic and moderately sized. Flat PPI interfaces are hard unless they have hot spots.
- Pocket-finding and scoring tools (fpocket, SiteMap, MD for cryptic pockets) estimate druggability from structure.
- The "undruggable" frontier keeps moving: covalent chemistry (KRAS G12C), allostery, degraders, antibodies, oligonucleotides.
- **Validation** combines human genetics (~2–2.6× higher success), CRISPR and other genetic perturbation, selective chemical probes and biomarkers.`,
    },
  ],
  references: [
    { authors: 'Hopkins, A. L., Groom, C. R.', title: 'The druggable genome', year: 2002, venue: 'Nat. Rev. Drug Discov. 1, 727–730' },
    { authors: 'Ostrem, J. M., Peters, U., Sos, M. L., Wells, J. A., Shokat, K. M.', title: 'K-Ras(G12C) inhibitors allosterically control GTP affinity and effector interactions', year: 2013, venue: 'Nature 503, 548–551' },
    { authors: 'Minikel, E. V., Painter, J. L., Dong, C. C., Nelson, M. R.', title: 'Refining the impact of genetic evidence on clinical success', year: 2024, venue: 'Nature 629, 624–629' },
    { authors: 'Cohen, J. C., Boerwinkle, E., Mosley, T. H., Hobbs, H. H.', title: 'Sequence variations in PCSK9, low LDL, and protection against coronary heart disease', year: 2006, venue: 'N. Engl. J. Med. 354, 1264–1272' },
    { authors: 'Arrowsmith, C. H., Audia, J. E., Austin, C., et al.', title: 'The promise and peril of chemical probes', year: 2015, venue: 'Nat. Chem. Biol. 11, 536–541' },
  ],
} satisfies LessonContent;
