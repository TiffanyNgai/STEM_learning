import type { LessonContent } from '../../types';

const ringPts = (cx: number, cy: number, r: number, squash = 1) =>
  Array.from({ length: 6 }, (_, k) => [cx + r * Math.cos((k * Math.PI) / 3 + Math.PI / 6), cy + squash * r * Math.sin((k * Math.PI) / 3 + Math.PI / 6)]);
const ringPath = (p: number[][]) => 'M' + p.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' L') + ' Z';
const good = ringPts(85, 78, 18);
const bad = ringPts(235, 78, 18, 0.55).map(([x, y], k) => (k === 1 ? [x + 9, y + 10] : [x, y]));
const poseSvg = `<svg viewBox="0 0 320 170" xmlns="http://www.w3.org/2000/svg">
<g font-size="9" text-anchor="middle">
<path d="M20,30 C20,120 60,140 85,140 C110,140 150,120 150,30" fill="none" stroke="var(--c2)" stroke-width="9" opacity="0.35"/>
<path d="M170,30 C170,120 210,140 235,140 C260,140 300,120 300,30" fill="none" stroke="var(--c2)" stroke-width="9" opacity="0.35"/>
<path d="${ringPath(good)}" fill="var(--c1)" fill-opacity="0.15" stroke="var(--c1)" stroke-width="2"/>
<path d="${ringPath(bad)}" fill="var(--c5)" fill-opacity="0.15" stroke="var(--c5)" stroke-width="2"/>
<line x1="${bad[0][0]}" y1="${bad[0][1]}" x2="281" y2="${bad[0][1] + 6}" stroke="var(--c5)" stroke-width="2"/>
<circle cx="287" cy="${bad[0][1] + 8}" r="8" fill="none" stroke="var(--c5)" stroke-dasharray="2 2"><animate attributeName="r" values="7;10;7" dur="1.5s" repeatCount="indefinite"/></circle>
<text x="85" y="18" fill="var(--c1)" font-weight="700">RMSD 1.4 Å · valid</text>
<text x="235" y="18" fill="var(--c5)" font-weight="700">RMSD 1.2 Å · invalid</text>
<text x="235" y="118" fill="var(--c5)">distorted ring,</text><text x="235" y="129" fill="var(--c5)">clash with protein</text>
<text x="85" y="118" fill="var(--muted)">flat ring, no clashes</text>
<text x="160" y="162" fill="var(--muted)">A low RMSD alone does not make a pose chemically sensible.</text>
</g></svg>`;

export default {
  cards: [
    {
      kind: 'explain',
      title: 'A beautiful model is not a measurement',
      body: String.raw`Predicted structures look like crystal structures: same file format, every atom in place. That makes it tempting to use them exactly like experimental data. But a prediction is a **single, static, best guess** learned from the PDB, and it inherits the PDB's gaps and biases.

This lesson lists the main ways predictions mislead drug designers (conformational change, disorder, point mutations, apo vs holo pockets, physically invalid ligand poses, memorisation) and how to use them responsibly.`,
    },
    {
      kind: 'recall',
      title: 'Confidence scores (from AlphaFold2)',
      points: [
        '**pLDDT** (0–100, per residue): local confidence. ≥ 90 very high, 70–90 confident, 50–70 low, < 50 very low.',
        '**PAE** (Å, per residue pair): error in the position of residue j when aligned on residue i. Judges relative placement of domains and chains.',
        'In AlphaFold3 and co-folding models, interface scores such as **ipTM** rate complexes.',
        'Confidence is itself a prediction; it can be wrong, especially far from the training data.',
      ],
      link: 'drug/alphafold',
    },
    {
      kind: 'explain',
      title: 'One structure, many states',
      body: String.raw`Proteins move. Kinases switch between active and inactive conformations (for example "DFG-in" and "DFG-out"), GPCRs between active and inactive states, transporters between inward- and outward-facing states. Many drugs work by binding one specific state.

AlphaFold2 usually returns one dominant conformation, often whichever state is most common in the PDB for that family. Tricks such as subsampling or clustering the MSA (AF-Cluster; Wayment-Steele et al. 2024) can coax out alternative states, including for fold-switching proteins. But these give snapshots, not a thermodynamic ensemble with populations. For that you still need experiments or [molecular dynamics](@drug/molecular-dynamics).`,
    },
    {
      kind: 'explain',
      title: 'Disorder: low pLDDT is information',
      body: String.raw`Many proteins contain **intrinsically disordered regions (IDRs)**: segments with no single fixed structure, common in signalling and regulatory proteins. Prediction programs typically give them very low pLDDT (< 50) and draw them as extended "spaghetti" loops. Those coordinates are not a real conformation. They are a placeholder.

Low pLDDT turns out to be a good **disorder predictor**. The right reading is "this region is flexible or unknown", not "this loop sits here". Some IDRs fold only on binding a partner, and co-folding models sometimes **hallucinate** neat helices in regions that are disordered in reality.`,
    },
    {
      kind: 'widget',
      title: 'Filter by confidence',
      body: 'Drag the cut-off to hide residues below a pLDDT threshold, as you would before measuring a pocket or preparing a model for docking. Watch the disordered tail.',
      widget: {
        type: 'DrugPlddtPae',
        props: { view: 'plddt', hideBelow: 0 },
        caption: 'Illustrative values. At a cut-off of 70 the linker and the disordered tail disappear, leaving the two confidently predicted domains. Their relative orientation still has to be checked in the PAE view.',
      },
    },
    {
      kind: 'mcq',
      prompt: 'A 30-residue C-terminal segment of your target has pLDDT around 35 and appears as an extended loop. What is the best interpretation?',
      choices: [
        'It is probably disordered or uncertain, and its coordinates should not be trusted',
        'It is an extended loop that sits exactly as drawn',
        'It is a promising rigid binding pocket',
        'It is a modelling bug that disappears after energy minimisation',
      ],
      answer: 0,
      why: 'Very low pLDDT usually marks intrinsic disorder or a region the model cannot place. Minimisation would only tidy the local geometry of a meaningless conformation; it would not make the region trustworthy.',
    },
    {
      kind: 'explain',
      title: 'Point mutations: the model barely notices',
      body: String.raw`AlphaFold2 learned which sequence families adopt which folds. A single amino-acid substitution leaves the MSA almost unchanged, so the predicted structure is almost unchanged, even for mutations known to unfold the protein or disable it. Buel & Walters (2022) concluded that AlphaFold2 cannot be used to predict the structural impact of missense mutations, and predicted-structure metrics correlate poorly with measured stability changes.

For resistance mutations, variant interpretation or stability engineering, use dedicated tools: physics-based ΔΔG estimates, [free-energy methods](@drug/free-energy-methods), or language-model variant scores from [protein language models](@drug/protein-language-models), and ideally experiments.`,
    },
    {
      kind: 'truefalse',
      prompt: 'If AlphaFold2 predicts nearly the same structure for a wild-type protein and a point mutant, the mutation is unlikely to affect folding or stability.',
      answer: false,
      why: 'AlphaFold2 is largely insensitive to single substitutions because the evolutionary signal it relies on hardly changes. Even strongly destabilising mutations usually give a near-identical prediction, so similarity is not evidence of a harmless mutation.',
    },
    {
      kind: 'explain',
      title: 'Apo vs holo pockets',
      body: String.raw`An **apo** structure has no ligand; a **holo** structure has one bound. Binding often reshapes the pocket: side chains rotate, loops close over the ligand (**induced fit**), and some **cryptic pockets** only open when a ligand is present.

A predicted structure is neither: it has no ligand, but it has learned from many holo structures, so pockets can look partly holo-like. Side-chain placement in pockets is often imprecise, and retrospective docking into AlphaFold2 models usually enriches actives less well than docking into holo crystal structures. Yet prospective screens can still work: Lyu et al. (2024) docked large libraries against AlphaFold2 models of the σ2 and 5-HT2A receptors and found hit rates similar to those against experimental structures. Results vary by target.`,
    },
    {
      kind: 'explain',
      title: 'PoseBusters: is the pose even chemically possible?',
      body: String.raw`The usual pose-accuracy metric is ligand **RMSD** to the crystal pose, with < 2 Å counted as a success. Buttenschoen et al. (2024) added a second test: the **PoseBusters** checks for physical and chemical validity, including bond lengths and angles, planarity of aromatic rings, correct stereochemistry, no internal clashes, no clashes with the protein, and a reasonable internal energy.

Their finding: many deep-learning docking methods produced poses with low RMSD that **failed** these checks, and accuracy dropped on proteins dissimilar to their training data. Classical programs such as AutoDock Vina and GOLD produced mostly valid poses. Co-folding models have since improved but are judged by both criteria.`,
      widget: { type: 'SvgDiagram', props: { svg: poseSvg }, caption: 'A pose can be close to the crystal pose by RMSD and still be physically impossible, for example a puckered aromatic ring pushed into the protein.' },
    },
    {
      kind: 'multi',
      prompt: 'Which of these are among the PoseBusters validity checks?',
      choices: [
        'Bond lengths and angles within normal ranges',
        'Aromatic rings are planar',
        'No steric clash between ligand and protein',
        'Stereochemistry matches the input molecule',
        'The predicted binding affinity agrees with experiment',
      ],
      answers: [0, 1, 2, 3],
      why: 'PoseBusters tests whether a pose is physically and chemically sensible. It does not judge affinity; a valid pose can still be the wrong pose, which is why it is used together with RMSD.',
    },
    {
      kind: 'numeric',
      prompt: 'On a 428-complex benchmark, a method places 300 ligands within 2 Å RMSD, but 40 of those 300 fail the PoseBusters checks. What percentage of complexes are both accurate and physically valid? (One decimal place.)',
      answer: 60.7,
      tolerance: 0.1,
      unit: '%',
      why: String.raw`Valid successes $= 300 - 40 = 260$; $260/428 = 0.607$, so 60.7 %. Reporting the RMSD-only rate ($300/428 = 70.1\,\%$) overstates usefulness, which is exactly the gap PoseBusters was built to expose.`,
    },
    {
      kind: 'explain',
      title: 'Memorisation and generalisation',
      body: String.raw`Deep models are trained on the PDB, and many benchmark complexes have close relatives in the training set: the same protein, a similar pocket or a near-identical ligand. A model can then score well by **recalling** a pose rather than reasoning about the interactions.

Evidence: Škrinjar et al. (2025) split a benchmark of recent PDB complexes by similarity to the training set and found that co-folding accuracy (AlphaFold3, Chai-1, Boltz-1, Protenix) falls sharply for pockets and ligands unlike anything seen in training. Masters et al. (2025) ran adversarial tests: after mutating the binding-site residues of CDK2 so that ATP could no longer bind, the models still placed ATP in its familiar site, confidently. Always ask how similar your target and chemotype are to what the model has seen.`,
    },
    {
      kind: 'match',
      prompt: 'Match each limitation to a sensible response.',
      pairs: [
        ['Only one conformation predicted', 'Sample alternative states (MSA subsampling) or run MD'],
        ['Very low pLDDT region', 'Treat it as disordered; exclude it from pocket analysis'],
        ['Point mutation of interest', 'Use ΔΔG methods, PLM variant scores or experiments'],
        ['Co-folded ligand pose', 'Check physical validity and confidence, then test experimentally'],
      ],
      why: 'Each limitation has a specific blind spot: dynamics, disorder, sensitivity to small sequence changes, and physical plausibility. The responses fill each blind spot with a tool or check that covers it.',
    },
    {
      kind: 'order',
      prompt: 'Order a responsible workflow for using a predicted structure in a structure-based project.',
      steps: [
        'Check pLDDT and PAE around the pocket of interest',
        'Compare with any experimental structures of the target or close homologues',
        'Generate alternative models or states (seeds, MSA subsampling, MD)',
        'Dock or co-fold ligands and screen poses for physical validity',
        'Confirm key predictions experimentally',
      ],
      why: 'Confidence comes first because a low-confidence pocket makes everything downstream unreliable. Experimental anchors and alternative states guard against a single wrong conformation, validity checks remove impossible poses, and only experiments can confirm binding.',
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- A prediction is **one static best guess**; real proteins have multiple states and dynamics.
- **Low pLDDT ≈ disorder or uncertainty**: do not interpret those coordinates.
- Structure predictors are **insensitive to point mutations**; use ΔΔG or variant-effect tools.
- Pockets can differ from **holo** structures; docking into models works for some targets, not reliably.
- Judge ligand poses by **RMSD and PoseBusters validity**; beware **memorisation** of training-set complexes.
- Used with these checks, predictions are a powerful starting point. Next: [ML docking](@drug/diffdock-ml-docking).`,
    },
  ],
  references: [
    { authors: 'Buttenschoen, M., Morris, G. M., Deane, C. M.', title: 'PoseBusters: AI-based docking methods fail to generate physically valid poses or generalise to novel sequences', year: 2024, venue: 'Chem. Sci. 15, 3130–3139' },
    { authors: 'Buel, G. R., Walters, K. J.', title: 'Can AlphaFold2 predict the impact of missense mutations on structure?', year: 2022, venue: 'Nat. Struct. Mol. Biol. 29, 1–2' },
    { authors: 'Wayment-Steele, H. K., Ojoawo, A., Otten, R., et al.', title: 'Predicting multiple conformations via sequence clustering and AlphaFold2', year: 2024, venue: 'Nature 625, 832–839' },
    { authors: 'Lyu, J., Kapolka, N., Gumpper, R., et al.', title: 'AlphaFold2 structures guide prospective ligand discovery', year: 2024, venue: 'Science 384, eadn6354' },
    { authors: 'Masters, M. R., Mahmoud, A. H., Lill, M. A.', title: 'Investigating whether deep learning models for co-folding learn the physics of protein–ligand interactions', year: 2025, venue: 'Nat. Commun. 16, 8854' },
    { authors: 'Škrinjar, P., Eberhardt, J., Durairaj, J., Schwede, T.', title: 'Have protein–ligand co-folding methods moved beyond memorisation?', year: 2025, venue: 'bioRxiv preprint 2025.02.03.636309' },
  ],
} satisfies LessonContent;
