import type { LessonContent } from '../../types';

const twoRoutesSvg = `<svg viewBox="0 0 320 170" xmlns="http://www.w3.org/2000/svg">
<rect x="112" y="6" width="96" height="22" rx="6" fill="var(--c4)" fill-opacity="0.22" stroke="var(--c4)"/>
<text x="160" y="21" font-size="10" text-anchor="middle" fill="var(--fg)" font-weight="700">10M compounds</text>
<path d="M140,28 L70,50" stroke="var(--fg)" stroke-width="1"/>
<path d="M180,28 L250,50" stroke="var(--fg)" stroke-width="1"/>
<rect x="8" y="50" width="124" height="60" rx="8" fill="var(--c2)" fill-opacity="0.18" stroke="var(--c2)"/>
<text x="70" y="64" font-size="10" text-anchor="middle" fill="var(--fg)" font-weight="700">Ligand-based</text>
<text x="70" y="78" font-size="8.5" text-anchor="middle" fill="var(--muted)">needs: known actives</text>
<text x="70" y="90" font-size="8.5" text-anchor="middle" fill="var(--muted)">similarity, pharmacophore,</text>
<text x="70" y="101" font-size="8.5" text-anchor="middle" fill="var(--muted)">QSAR / ML model</text>
<rect x="188" y="50" width="124" height="60" rx="8" fill="var(--c3)" fill-opacity="0.18" stroke="var(--c3)"/>
<text x="250" y="64" font-size="10" text-anchor="middle" fill="var(--fg)" font-weight="700">Structure-based</text>
<text x="250" y="78" font-size="8.5" text-anchor="middle" fill="var(--muted)">needs: a 3D pocket</text>
<text x="250" y="90" font-size="8.5" text-anchor="middle" fill="var(--muted)">docking + scoring,</text>
<text x="250" y="101" font-size="8.5" text-anchor="middle" fill="var(--muted)">shape/field matching</text>
<path d="M70,110 L150,128" stroke="var(--fg)" stroke-width="1"/>
<path d="M250,110 L170,128" stroke="var(--fg)" stroke-width="1"/>
<rect x="96" y="128" width="128" height="22" rx="6" fill="var(--c1)" fill-opacity="0.25" stroke="var(--c1)"/>
<text x="160" y="143" font-size="10" text-anchor="middle" fill="var(--fg)" font-weight="700">one ranked list</text>
<text x="160" y="164" font-size="8.5" text-anchor="middle" fill="var(--muted)">buy / make the top few hundred and assay them</text>
</svg>`;

const decoySvg = `<svg viewBox="0 0 320 128" xmlns="http://www.w3.org/2000/svg">
<text x="8" y="12" font-size="9" fill="var(--muted)">a DUD-E-style decoy for one active</text>
<circle cx="70" cy="56" r="26" fill="var(--c1)" fill-opacity="0.3" stroke="var(--c1)" stroke-width="2"/>
<text x="70" y="59" font-size="10" text-anchor="middle" fill="var(--fg)" font-weight="700">active</text>
<circle cx="230" cy="56" r="26" fill="var(--c5)" fill-opacity="0.25" stroke="var(--c5)" stroke-width="2"/>
<text x="230" y="59" font-size="10" text-anchor="middle" fill="var(--fg)" font-weight="700">decoy</text>
<path d="M98,48 L202,48" stroke="var(--c2)" stroke-width="1.5"/>
<text x="150" y="43" font-size="8.5" text-anchor="middle" fill="var(--c2)">same MW, logP, charge, HBD/HBA</text>
<path d="M98,66 L202,66" stroke="var(--c3)" stroke-width="1.5" stroke-dasharray="4 3"/>
<text x="150" y="80" font-size="8.5" text-anchor="middle" fill="var(--c3)">different 2D topology (low Tanimoto)</text>
<text x="160" y="106" font-size="8.5" text-anchor="middle" fill="var(--muted)">50 decoys per active, so a target with 200 actives</text>
<text x="160" y="118" font-size="8.5" text-anchor="middle" fill="var(--muted)">gets 10,000 presumed-inactive decoys</text>
</svg>`;

export default {
  cards: [
    {
      kind: 'explain',
      title: 'Sorting the haystack',
      body: String.raw`You can buy about 10 million compounds off the shelf, and your assay can test maybe a few hundred. **Virtual screening (VS)** is the computational step in between: score every molecule in a library, **rank** them, and send only the top of the list to the lab.

The key idea is modest but powerful. Virtual screening does not try to predict which molecules bind — it only tries to make the top of the list **richer in actives** than a random sample would be. A screen that triples your hit rate has already paid for itself, even though most of its top-ranked compounds are still wrong.`,
    },
    {
      kind: 'explain',
      title: 'Two routes to a ranked list',
      body: String.raw`- **Ligand-based VS** starts from molecules you already know are active. Rank the library by 2D similarity to them (Tanimoto on fingerprints), by fit to a [pharmacophore](@drug/pharmacophores), by 3D shape overlap, or by a trained [QSAR/ML model](@drug/qsar). No protein structure needed.
- **Structure-based VS** starts from a 3D structure of the target pocket and ranks by a [docking](@drug/docking) score.

They fail differently: ligand-based methods stay close to chemistry you already know, structure-based methods can propose genuinely new scaffolds but depend on the structure and on a crude scoring function. Running both and taking the consensus is common.`,
      widget: { type: 'SvgDiagram', props: { svg: twoRoutesSvg }, caption: 'Both routes end in the same thing: an ordered list. Everything in this lesson is about measuring how good that order is.' },
    },
    {
      kind: 'recall',
      title: 'Fingerprints and similarity (earlier lesson)',
      points: [
        'A fingerprint turns a molecule into a fixed-length bit vector of substructure features (e.g. ECFP4).',
        'Tanimoto similarity $T = c/(a+b-c)$ compares the bits set in two fingerprints.',
        'The similarity principle: similar structures *tend* to have similar activity — a tendency, not a law.',
        'Activity cliffs are the counterexamples: $T > 0.9$ yet a 100-fold potency difference.',
      ],
      link: 'drug/fingerprints-similarity',
    },
    {
      kind: 'mcq',
      prompt: 'Your target is a newly described kinase. There is no experimental structure and no published inhibitor, but a close homologue has a solved structure. Which approach is available to you?',
      choices: [
        'Structure-based screening against a homology model of the pocket',
        'Ligand-based similarity screening using the target’s known actives',
        'A QSAR model trained on measured potencies for this target',
        'Neither — virtual screening needs both a structure and known actives',
      ],
      answer: 0,
      why: 'With no known actives, every ligand-based route (similarity, pharmacophore, QSAR) has nothing to learn from. A homology model of the pocket lets you dock, accepting that model errors degrade the ranking. Virtual screening needs *one* of the two inputs, not both.',
    },
    {
      kind: 'explain',
      title: 'The enrichment curve',
      body: String.raw`To measure a ranking you need a test set where the answers are known: a set of **actives** and a much larger set of **inactives** (or presumed-inactive **decoys**). Score them all, sort, then walk down the list and plot

- $x$ = fraction of the database screened so far,
- $y$ = fraction of all the actives recovered so far.

This **enrichment** (or accumulation) curve starts at $(0,0)$ and ends at $(1,1)$. A useless method follows the diagonal $y = x$: screening 10 % of the list finds 10 % of the actives. A good method bulges towards the top-left corner.`,
    },
    {
      kind: 'widget',
      title: 'Play with a screen',
      body: 'Drag "model quality" from 0 (random) upwards and watch the curve peel away from the diagonal. Then move the cutoff and read off the enrichment factor. The shaded strip above the plot shows where in the ranked list the actives are concentrated.',
      widget: {
        type: 'DrugEnrichmentCurve',
        props: { quality: 1.6, cutoff: 0.01, nTotal: 100000, nActives: 500 },
        caption: 'A library of 100,000 compounds containing 500 actives (0.5 %). Switch to **log x** to zoom into the first 1 % of the list — the only part a real campaign ever buys.',
      },
    },
    {
      kind: 'explain',
      title: 'Enrichment factor',
      body: String.raw`The headline number is the **enrichment factor** at a cutoff $f$ (usually 1 %, written $EF_{1\%}$): how many times richer in actives the top $f$ of the list is than the whole database.

$$EF_f = \frac{n_{\text{actives in top } f}/N_{\text{top } f}}{n_{\text{actives total}}/N_{\text{total}}}$$

**Worked example.** 100,000 compounds, 500 of them active (0.5 %). The top 1 % is 1,000 compounds, and it contains 75 actives. Hit rate at the top: $75/1000 = 7.5\%$. Overall: $0.5\%$. So $EF_{1\%} = 7.5/0.5 = 15$.

Note the ceiling: you cannot do better than putting all 500 actives in the top 1,000, giving $500/1000 = 50\%$ and $EF_{1\%} = 100 = 1/f$. Enrichment factors from different papers are only comparable at the same cutoff and similar active fractions.`,
    },
    {
      kind: 'numeric',
      prompt: 'A screen of 50,000 compounds containing 250 actives is ranked by docking score. The top 500 compounds contain 40 actives. What is $EF_{1\\%}$?',
      answer: 16,
      tolerance: 0.1,
      why: 'Top hit rate = 40/500 = 8 %. Background = 250/50,000 = 0.5 %. EF = 8/0.5 = 16. Equivalently, you recovered 40/250 = 16 % of the actives in 1 % of the list, and 16 % ÷ 1 % = 16.',
    },
    {
      kind: 'explain',
      title: 'ROC and AUC',
      body: String.raw`The enrichment curve is close kin to the **ROC curve**: plot the fraction of actives recovered (true-positive rate) against the fraction of *inactives* wrongly ranked above the cutoff (false-positive rate). When actives are a tiny minority — as they always are in screening — the two curves nearly coincide.

The **AUC** (area under the ROC curve) has a lovely interpretation: it is the probability that a randomly chosen active is ranked above a randomly chosen inactive. AUC $= 0.5$ is random, $1.0$ is perfect, and below $0.5$ means your ranking is worse than coin-flipping.`,
    },
    {
      kind: 'widget',
      title: 'Where the curve comes from',
      body: 'Actives and inactives get overlapping score distributions. Sweeping the decision threshold traces out the ROC curve; the gap between the two distributions is exactly what "model quality" means.',
      widget: {
        type: 'MlThresholdROC',
        props: { separation: 1.6, threshold: 1.5, prevalence: 0.05, showPrevalence: true },
        caption: 'Push *prevalence* down towards 1 %: AUC does not move at all, but the confusion matrix fills with false positives. AUC is blind to how rare the actives are.',
      },
    },
    {
      kind: 'numeric',
      prompt: 'A tiny ranked list of 10 compounds has actives at positions 1, 2 and 6. Counting pairs, what is the AUC? (There are $3 \\times 7 = 21$ active–inactive pairs; AUC is the fraction ranked correctly.)',
      answer: 0.857,
      tolerance: 0.005,
      why: 'The actives at ranks 1 and 2 beat all 7 inactives (7 + 7 = 14 correct pairs). The active at rank 6 has 3 inactives above it and 4 below, adding 4. Total 18/21 = 0.857.',
    },
    {
      kind: 'explain',
      title: 'Why AUC is not enough: early recognition',
      body: String.raw`AUC rewards the whole ranking equally — in fact it counts active–inactive pairs, so an active gains AUC in proportion to how many *inactives* it overtakes. But nobody buys the middle of the list. Moving an active from rank 900,000 to rank 500,000 does nothing for your campaign, yet it overtakes 400,000 inactives and so improves AUC thousands of times more than moving an active from rank 100 to rank 50 — the move you actually care about.

This is the **early recognition problem**. Two methods can have the same AUC while one puts five actives in the top 100 and the other puts none. Enrichment factors fix this by looking only at the top, but they throw away everything below the cutoff and jump about when only a handful of actives sit near it.`,
    },
    {
      kind: 'explain',
      title: 'BEDROC',
      body: String.raw`Truchon and Bayly (2007) proposed a compromise. Give the active at relative rank $x_i$ (a number in $[0,1]$) an exponentially decaying weight $e^{-\alpha x_i}$ and sum: that is the **robust initial enhancement (RIE)**. Rescaling RIE onto $[0,1]$ gives **BEDROC** (Boltzmann-Enhanced Discrimination of ROC).

$\alpha$ sets how steep the discount is: the common choice $\alpha = 20$ puts roughly 80 % of the total weight in the top 8 % of the list. BEDROC has its own catch — its value depends on $\alpha$ and on the fraction of actives in the set, so it, too, is only comparable between benchmarks built the same way. Report several metrics, not one.`,
    },
    {
      kind: 'match',
      prompt: 'Match each metric to what it measures.',
      pairs: [
        ['AUC', 'Probability a random active outranks a random inactive — whole list, no emphasis on the top'],
        ['$EF_{1\\%}$', 'How many times richer in actives the top 1 % is than the database'],
        ['BEDROC ($\\alpha=20$)', 'A continuous ranking score with exponentially decaying weight down the list'],
        ['Hit rate', 'Fraction of the compounds actually bought and assayed that turned out to be active'],
      ],
      why: 'The first three are retrospective metrics computed on a benchmark with known answers; the hit rate is the prospective number that decides whether the campaign worked. A screen with excellent AUC and a 0 % hit rate has still failed.',
    },
    {
      kind: 'explain',
      title: 'Decoys: the awkward denominator',
      body: String.raw`To compute any of these you need inactives — and almost nobody has measured thousands of true inactives for their target. So benchmarks use **decoys**: molecules *presumed* inactive because nothing suggests otherwise.

**DUD-E** (Mysinger et al. 2012) is the standard set: 102 targets, roughly 22,900 actives, and 50 decoys per active. Each decoy is chosen to match its active on physical properties (molecular weight, logP, net charge, rotatable bonds, H-bond donors and acceptors) while being **topologically dissimilar** — a different 2D structure. The property matching is deliberate: without it, a method could "win" by simply preferring heavy, greasy molecules.`,
      widget: { type: 'SvgDiagram', props: { svg: decoySvg }, caption: 'Property-matched but topologically different: that is the DUD-E recipe, and also the source of its biases.' },
    },
    {
      kind: 'multi',
      prompt: 'Which of these are genuine problems with decoy-based benchmarks?',
      choices: [
        'Decoys are only *assumed* inactive; some are real actives, which counts as a false positive',
        'Making decoys topologically unlike the actives means a 2D similarity method scores artificially well',
        'The actives for a target often come from a few optimisation series, so they resemble each other more than real hits would (analogue bias)',
        'Using 50 decoys per active makes the benchmark too small to give stable metrics',
      ],
      answers: [0, 1, 2],
      why: 'Unlabelled-as-inactive, artificial dissimilarity and analogue bias are all documented. Wallach and Heifets (2018) showed that ligand-based models on such sets can partly be measuring the bias rather than binding. Set size is not the issue — 50 decoys per active makes the sets large, and the trouble is their composition.',
    },
    {
      kind: 'truefalse',
      prompt: 'A method that achieves AUC 0.95 on DUD-E can be expected to achieve a comparable hit rate on a new target in the lab.',
      answer: false,
      why: 'Retrospective benchmark performance is a weak predictor of prospective success: the benchmark decoys are not real inactives, the actives are biased towards known chemistry, and the method may have been tuned on the same set. Only a prospective screen with assayed compounds tells you the real hit rate — see [validating docking](@drug/docking-validation).',
    },
    {
      kind: 'order',
      prompt: 'Order the steps of a retrospective virtual-screening validation.',
      steps: [
        'Assemble known actives for the target, clustered so near-duplicates do not dominate',
        'Generate or collect property-matched decoys',
        'Prepare all molecules consistently (protonation, tautomers, 3D conformers)',
        'Score and rank the combined set with the method under test',
        'Compute AUC, $EF_{1\\%}$ and BEDROC, and compare with a simple baseline',
        'Only then run a prospective screen and assay the top-ranked compounds',
      ],
      why: 'Clustering the actives first prevents one over-represented series from setting the score. Preparing actives and decoys identically matters because inconsistent preparation alone can create enrichment. The baseline comparison is what tells you whether the fancy method beat plain fingerprint similarity.',
    },
    {
      kind: 'fill',
      prompt: 'A screen that is blind to where in the list the actives fall is measured by ___; a screen judged only on its top 1 % is measured by the ___ ; the compromise that weights ranks exponentially is ___.',
      bank: ['AUC', 'enrichment factor', 'BEDROC', 'Tanimoto', 'hit rate'],
      answer: ['AUC', 'enrichment factor', 'BEDROC'],
      why: 'These three answer the same question at different resolutions: whole list, a single cutoff, and a smooth decay between them. Tanimoto is a similarity measure, not a ranking metric, and the hit rate is prospective.',
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- Virtual screening **enriches**, it does not predict. Judge it by the composition of the top of the list.
- **Ligand-based** VS needs known actives; **structure-based** VS needs a pocket. They fail in different ways.
- The **enrichment curve** plots actives recovered against database screened; the diagonal is random.
- $EF_f = (\text{hit rate in top } f)/(\text{overall active fraction})$, capped at $1/f$. Always quote the cutoff.
- **AUC** is the probability an active outranks an inactive, but it ignores **early recognition**; **BEDROC** (Truchon & Bayly 2007) weights the top exponentially.
- **Decoys** (DUD-E) make the metrics computable but carry biases; good benchmark numbers do not guarantee lab hits.
- Next: the same machinery at [billion-compound scale](@drug/ultra-large-libraries).`,
    },
  ],
  references: [
    { authors: 'Truchon, J.-F., Bayly, C. I.', title: 'Evaluating virtual screening methods: good and bad metrics for the "early recognition" problem', year: 2007, venue: 'J. Chem. Inf. Model. 47, 488–508' },
    { authors: 'Mysinger, M. M., Carchia, M., Irwin, J. J., Shoichet, B. K.', title: 'Directory of Useful Decoys, Enhanced (DUD-E): better ligands and decoys for better benchmarking', year: 2012, venue: 'J. Med. Chem. 55, 6582–6594' },
    { authors: 'Wallach, I., Heifets, A.', title: 'Most ligand-based classification benchmarks reward memorization rather than generalization', year: 2018, venue: 'J. Chem. Inf. Model. 58, 916–932' },
    { authors: 'Lyu, J., Wang, S., Balius, T. E., et al.', title: 'Ultra-large library docking for discovering new chemotypes', year: 2019, venue: 'Nature 566, 224–229' },
    { authors: 'Leach, A. R., Gillet, V. J.', title: 'An Introduction to Chemoinformatics', year: 2007, venue: 'Revised ed., Springer', detail: 'Ch. 7–8' },
  ],
} satisfies LessonContent;
