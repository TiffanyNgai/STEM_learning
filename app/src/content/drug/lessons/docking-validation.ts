import type { LessonContent } from '../../types';

const dockingModesSvg = `<svg viewBox="0 0 320 150" xmlns="http://www.w3.org/2000/svg">
<g font-size="9" text-anchor="middle">
${[
    ['Redocking', 'own crystal structure', 'var(--c1)', 'easiest'],
    ['Cross-docking', 'structure from another ligand', 'var(--c3)', 'harder'],
    ['Apo / predicted', 'no ligand bound', 'var(--c5)', 'hardest'],
  ].map(([t, s, c, d], i) => {
    const x = 10 + i * 104;
    return `<rect x="${x}" y="30" width="96" height="74" rx="10" fill="${c}" fill-opacity="0.15" stroke="${c}"/>
<text x="${x + 48}" y="48" fill="var(--fg)" font-weight="700">${t}</text>
<text x="${x + 48}" y="62" fill="var(--muted)">${s}</text>
<path d="M${x + 22},92 q26,${-14 - i * 6} 52,0" fill="none" stroke="var(--fg)" stroke-width="2"/>
<circle cx="${x + 48}" cy="${84 - i * 3}" r="6" fill="${c}"><animate attributeName="cy" values="${84 - i * 3};${80 - i * 5};${84 - i * 3}" dur="${2 + i}s" repeatCount="indefinite"/></circle>
<text x="${x + 48}" y="120" fill="${c}" font-weight="700">${d}</text>`;
  }).join('\n')}
<text x="160" y="16" fill="var(--muted)">pocket shape remembers its own ligand → success rate falls left to right</text>
<path d="M30,136 L290,136" stroke="var(--muted)" marker-end="url(#ah)"/>
<defs><marker id="ah" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 z" fill="var(--muted)"/></marker></defs>
<text x="160" y="148" fill="var(--muted)">closer to real prospective use</text>
</g></svg>`;

export default {
  cards: [
    {
      kind: 'explain',
      title: 'Trust, but verify',
      body: String.raw`A docking program will always return a pose and a score, even when both are nonsense. Before using docking on a project, we have to ask two separate questions:

1. **Pose accuracy**: does it put known ligands where crystallography shows they bind?
2. **Screening power**: does it rank real actives above inactive molecules?

This lesson covers the standard tests for each: redocking and cross-docking RMSD, physical-validity checks (PoseBusters), enrichment on decoy sets such as DUD-E, the CASF benchmark and, finally, prospective testing.`,
    },
    {
      kind: 'recall',
      title: 'Virtual screening metrics',
      points: [
        'A virtual screen ranks a library; we hope actives collect near the top of the list.',
        'An **enrichment curve** plots the fraction of actives found against the fraction of the list screened.',
        String.raw`The **enrichment factor** $EF_{x\%}$ is the hit rate in the top $x\%$ divided by the hit rate of the whole library.`,
        'ROC AUC summarises the whole ranking; early-recognition metrics (EF1%, BEDROC) focus on the top.',
      ],
      link: 'drug/virtual-screening',
    },
    {
      kind: 'explain',
      title: 'Pose accuracy: RMSD',
      body: String.raw`To compare a docked pose with the crystal pose, we take the **root-mean-square deviation** over the $N$ ligand heavy atoms:

$$\text{RMSD} = \sqrt{\frac{1}{N}\sum_{i=1}^{N}\lvert\mathbf r_i^{dock} - \mathbf r_i^{xtal}\rvert^2}$$

The protein frames are already aligned, so the ligand is **not** re-superimposed: a pose that is the right shape in the wrong place must score badly. Symmetry matters: flipping a symmetric phenyl ring should not count as an error, so good tools match symmetry-equivalent atoms. By convention a top-ranked pose with **RMSD < 2 Å** counts as a success.`,
    },
    {
      kind: 'numeric',
      prompt: 'A 4-heavy-atom fragment is docked. The atoms deviate from the crystal positions by 1, 1, 2 and 2 Å. What is the RMSD?',
      answer: 1.58,
      tolerance: 0.02,
      unit: 'Å',
      why: String.raw`$\sqrt{(1+1+4+4)/4} = \sqrt{2.5} = 1.58$ Å. The mean deviation is 1.5 Å, but squaring before averaging gives more weight to the larger errors. So the RMSD is always at least the mean absolute deviation.`,
    },
    {
      kind: 'widget',
      title: 'Redock a toy ligand',
      body: 'Run the search a few times with different seeds. Most runs find the pose with donor next to acceptor, but some get stuck in the flipped pose. That is a redocking failure: it scores worse, but a short search may never escape it.',
      widget: { type: 'DockingPoseSearch', props: { seed: 3 }, caption: 'In the flipped pose the end atoms swap places, so the RMSD is large even though the ligand occupies the same region: it fails the 2 Å criterion.' },
    },
    {
      kind: 'explain',
      title: 'Redocking flatters; cross-docking is realistic',
      body: String.raw`**Redocking** puts a ligand back into the crystal structure it came from. The side chains are already arranged to fit that exact ligand, so this is the easiest possible test. Good programs commonly succeed in roughly 70–80 % of such cases.

In a real project you dock *new* molecules into a structure solved with a *different* ligand. **Cross-docking** tests exactly this, and success rates fall noticeably, because of induced fit, moved loops and changed water networks. Docking into an apo or predicted structure is harder again.`,
      widget: { type: 'SvgDiagram', props: { svg: dockingModesSvg }, caption: 'Three ways to test pose prediction, ordered by realism.' },
    },
    {
      kind: 'mcq',
      prompt: 'Why is redocking success usually an over-optimistic estimate of real docking performance?',
      choices: [
        'The protein conformation was shaped by that very ligand, so the pocket already fits it',
        'Redocking uses a more accurate scoring function',
        'The RMSD cut-off is looser in redocking',
        'Redocking ligands are always smaller',
      ],
      answer: 0,
      why: 'In redocking the pocket "remembers" its ligand through induced fit. The scoring function and the 2 Å cut-off are the same as in cross-docking. Only the protein structure changes, and that is enough to lower success rates.',
    },
    {
      kind: 'explain',
      title: 'Is the pose even physical? PoseBusters',
      body: String.raw`An RMSD below 2 Å does not guarantee a sensible molecule. **PoseBusters** (Buttenschoen, Morris & Deane 2024) adds a battery of checks:
- **Chemistry**: the molecule can be read, with stereochemistry and connectivity preserved.
- **Geometry**: bond lengths and angles in range, aromatic rings flat, no internal clashes, a conformer energy that is not absurdly high.
- **Intermolecular**: no clashes with protein atoms, cofactors or waters.

Applied to recently released complexes, it showed that many deep-learning docking methods produced poses that were often physically invalid and generalised poorly to unseen proteins. Classical programs such as Vina and GOLD did better on the combined criterion "RMSD ≤ 2 Å **and** PB-valid".`,
    },
    {
      kind: 'multi',
      prompt: 'Which are checks that PoseBusters applies to a predicted pose?',
      choices: [
        'Aromatic rings are planar',
        'Bond lengths and angles fall in normal ranges',
        'The ligand does not clash with the protein',
        'The predicted affinity matches experiment within 1 kcal/mol',
        'Stereochemistry matches the input molecule',
      ],
      answers: [0, 1, 2, 4],
      why: 'PoseBusters checks physical and chemical plausibility: geometry, stereochemistry and clashes. It makes no claim about affinity. A pose can be close to the crystal pose and still fail, for example because of a twisted aromatic ring.',
    },
    {
      kind: 'explain',
      title: 'Screening power: actives vs decoys',
      body: String.raw`To test screening, hide known actives among **decoys** (presumed inactives) and see where the actives rank. **DUD-E** (Mysinger et al. 2012) provides 102 targets, 22,886 actives and 50 decoys per active. The decoys match the actives in molecular weight, logP, charge and H-bond counts but are topologically different, so they cannot be told apart by size or polarity alone.

Metrics: $EF_{1\%}$ and BEDROC reward **early recognition** (Truchon & Bayly 2007), which matters because only the top few hundred compounds will be bought. Caveat: decoys built this way contain hidden biases, and ML models can learn to separate actives from decoys **without looking at the protein**.`,
    },
    {
      kind: 'widget',
      title: 'Enrichment in practice',
      body: 'Move the model quality and the cut-off. With the log x-axis you can see the first 0.1–1 % of the ranked list, which is where a real campaign picks compounds.',
      widget: { type: 'DrugEnrichmentCurve', props: { quality: 1.6, cutoff: 0.01, logX: true }, caption: 'The diagonal is random picking (EF = 1). The steep start of the curve is what early-recognition metrics measure.' },
    },
    {
      kind: 'numeric',
      prompt: 'A library of 100,000 compounds contains 500 actives. The top 1 % of the docking ranking (1,000 compounds) contains 60 actives. What is EF1%?',
      answer: 12,
      tolerance: 0.1,
      why: String.raw`Hit rate in the top 1 % = 60/1000 = 6 %. Library hit rate = 500/100,000 = 0.5 %. EF = 6/0.5 = 12. For comparison, the maximum possible EF1% here is 100: a perfect ranking puts all 500 actives in the top 1,000 (50 % ÷ 0.5 %).`,
    },
    {
      kind: 'explain',
      title: 'CASF and the prospective test',
      body: String.raw`The **CASF** benchmark (Su et al. 2019; 285 high-quality PDBbind complexes) scores functions on four "powers": **scoring** (correlation with affinity), **ranking** (order within one target), **docking** (find the native pose) and **screening** (find the true binder among decoy ligands).

All retrospective tests can leak information: structures used to tune a method may resemble test ones. The decisive test is **prospective**: dock, buy or synthesise the top picks, and measure them. Lyu et al. (2019) did this on 170 million molecules and confirmed new chemotypes for AmpC β-lactamase and the D4 dopamine receptor.`,
    },
    {
      kind: 'match',
      prompt: 'Match each metric to what it measures.',
      pairs: [
        ['Top-pose RMSD < 2 Å', 'Pose accuracy against a crystal structure'],
        ['PB-valid rate', 'Physical and chemical plausibility of poses'],
        ['EF1% / BEDROC', 'Early recognition of actives in a ranked list'],
        ['ROC AUC', 'Ranking quality over the whole list'],
        ['Pearson r on CASF', 'Scoring power: correlation with measured affinity'],
      ],
      why: 'Each metric checks a different property. A method can score well on RMSD and badly on enrichment, or the reverse, so validation reports several metrics together.',
    },
    {
      kind: 'order',
      prompt: 'Order a sensible validation plan before a docking campaign, from cheapest check to most decisive.',
      steps: [
        'Redock co-crystallised ligands and check RMSD',
        'Cross-dock known ligands into the chosen structure',
        'Check poses for physical validity (PoseBusters-style)',
        'Measure enrichment of known actives among decoys',
        'Test top-ranked new compounds experimentally',
      ],
      why: 'Each step is more realistic and more costly than the last. Redocking catches set-up errors, cross-docking and validity checks test pose realism, enrichment tests ranking, and only prospective experiments show the campaign works.',
    },
    {
      kind: 'truefalse',
      prompt: 'A docked pose with RMSD 1.5 Å from the crystal pose is guaranteed to be chemically and physically valid.',
      answer: false,
      why: 'RMSD measures the average atomic distance only. A pose can sit in the right place and still have distorted bonds, non-planar aromatic rings or clashes with the protein. PoseBusters was designed to catch exactly these cases.',
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- **Pose accuracy**: heavy-atom RMSD of the top pose, success if < 2 Å, symmetry-corrected and without re-superposition.
- **Redocking** is optimistic; **cross-docking** and apo/predicted structures are more realistic.
- **PoseBusters** adds validity checks; "≤ 2 Å and PB-valid" exposed many deep-learning docking failures.
- **Screening**: enrichment ($EF_{1\%}$, BEDROC, AUC) on decoy sets such as DUD-E, which have hidden biases.
- **CASF** separates scoring, ranking, docking and screening power. **Prospective** experiments are the final test.`,
    },
  ],
  references: [
    { authors: 'Buttenschoen, M., Morris, G. M., Deane, C. M.', title: 'PoseBusters: AI-based docking methods fail to generate physically valid poses or generalise to novel sequences', year: 2024, venue: 'Chem. Sci. 15, 3130–3139' },
    { authors: 'Mysinger, M. M., Carchia, M., Irwin, J. J., Shoichet, B. K.', title: 'Directory of useful decoys, enhanced (DUD-E): better ligands and decoys for better benchmarking', year: 2012, venue: 'J. Med. Chem. 55, 6582–6594' },
    { authors: 'Truchon, J.-F., Bayly, C. I.', title: 'Evaluating virtual screening methods: good and bad metrics for the "early recognition" problem', year: 2007, venue: 'J. Chem. Inf. Model. 47, 488–508' },
    { authors: 'Su, M., Yang, Q., Du, Y., Feng, G., Liu, Z., Li, Y., Wang, R.', title: 'Comparative assessment of scoring functions: the CASF-2016 update', year: 2019, venue: 'J. Chem. Inf. Model. 59, 895–913' },
    { authors: 'Lyu, J., Wang, S., Balius, T. E., et al.', title: 'Ultra-large library docking for discovering new chemotypes', year: 2019, venue: 'Nature 566, 224–229' },
  ],
} satisfies LessonContent;
