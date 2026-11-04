import type { LessonContent } from '../../types';

const noiseSvg = `<svg viewBox="0 0 320 196" xmlns="http://www.w3.org/2000/svg">
<g font-size="8">
<text x="160" y="12" text-anchor="middle" fill="var(--fg)" font-weight="700">the same compound, five objectives, five different error bars</text>
<line x1="118" y1="22" x2="118" y2="156" stroke="var(--muted)" stroke-dasharray="2 3"/>
<text x="118" y="170" text-anchor="middle" fill="var(--muted)">measured value</text>

<text x="4" y="42" fill="var(--fg)">potency (1 assay)</text>
<line x1="106" y1="38" x2="130" y2="38" stroke="var(--c2)" stroke-width="2"/>
<line x1="106" y1="34" x2="106" y2="42" stroke="var(--c2)" stroke-width="2"/>
<line x1="130" y1="34" x2="130" y2="42" stroke="var(--c2)" stroke-width="2"/>
<circle cx="118" cy="38" r="3.4" fill="var(--c2)"/>
<text x="140" y="42" fill="var(--muted)">±0.2 log</text>

<text x="4" y="68" fill="var(--fg)">potency (pooled)</text>
<line x1="76" y1="64" x2="160" y2="64" stroke="var(--c3)" stroke-width="2"/>
<line x1="76" y1="60" x2="76" y2="68" stroke="var(--c3)" stroke-width="2"/>
<line x1="160" y1="60" x2="160" y2="68" stroke="var(--c3)" stroke-width="2"/>
<circle cx="118" cy="64" r="3.4" fill="var(--c3)"/>
<text x="170" y="68" fill="var(--muted)">±0.7 log</text>

<text x="4" y="94" fill="var(--fg)">solubility (kinetic)</text>
<line x1="62" y1="90" x2="174" y2="90" stroke="var(--c4)" stroke-width="2"/>
<line x1="62" y1="86" x2="62" y2="94" stroke="var(--c4)" stroke-width="2"/>
<line x1="174" y1="86" x2="174" y2="94" stroke="var(--c4)" stroke-width="2"/>
<circle cx="118" cy="90" r="3.4" fill="var(--c4)"/>
<text x="184" y="94" fill="var(--muted)">rank order only</text>

<text x="4" y="120" fill="var(--fg)">rodent bioavailability</text>
<line x1="48" y1="116" x2="188" y2="116" stroke="var(--c5)" stroke-width="2"/>
<line x1="48" y1="112" x2="48" y2="120" stroke="var(--c5)" stroke-width="2"/>
<line x1="188" y1="112" x2="188" y2="120" stroke="var(--c5)" stroke-width="2"/>
<circle cx="118" cy="116" r="3.4" fill="var(--c5)"/>
<text x="198" y="120" fill="var(--muted)">n = 3 animals</text>

<text x="4" y="146" fill="var(--fg)">synthesizability score</text>
<circle cx="118" cy="142" r="3.4" fill="var(--c1)"/>
<text x="128" y="146" fill="var(--muted)">no error bar — and no experiment either</text>

<text x="160" y="186" text-anchor="middle" fill="var(--fg)" font-weight="700">a weighted sum treats all five as if they were the top one</text>
</g></svg>`;

export default {
  cards: [
    {
      kind: 'explain',
      title: 'The compound that won every round',
      body: String.raw`Every medicinal chemistry programme has a story like this. A series is optimised hard for potency. Each round the IC50 drops — 300 nM, 40 nM, 6 nM, 0.8 nM — and each round the molecule gains a ring, a chlorine, a greasy substituent. Then the compound goes into a rat and is gone from the blood in twenty minutes, or precipitates out of the dosing vehicle, or kills a hERG assay.

Nothing went wrong with the optimisation. It did exactly what it was told. The problem is that **potency was the only thing it was told**.

This lesson is about the alternative: optimising several objectives at once, honestly. It is the single most important practical topic in this unit, because every generative model you have met so far needs a score, and the score is where real drug discovery lives or dies.`,
    },
    {
      kind: 'recall',
      title: 'What else a molecule has to be',
      points: [
        '**Soluble** enough to dissolve at the dose, and **permeable** enough to cross a gut wall.',
        '**Metabolically stable** enough to survive first pass through the liver.',
        '**Selective** — not hitting the related target whose inhibition causes the side effect.',
        '**Safe** — no hERG block, no genotoxicity, no reactive metabolite.',
        '**Makeable**, in reasonable yield, by someone who has other things to do.',
      ],
      link: 'drug/adme-tox',
    },
    {
      kind: 'explain',
      title: 'Why potency-only optimisation fails in one specific way',
      body: String.raw`The failure is not random. Potency is almost always easiest to buy with **lipophilicity**: add greasy surface, bury more of it against the protein, gain binding energy. But the same greasy surface lowers solubility, raises metabolic turnover, raises promiscuity and raises hERG liability. Optimise potency alone and you walk straight down that gradient. Hann called the result **molecular obesity** (Hann 2011).

The standard counter-measure is **lipophilic ligand efficiency**, or LipE (also written LLE):

$$\mathrm{LipE} = \mathrm{pIC_{50}} - \log P$$

where $\mathrm{pIC_{50}} = -\log_{10}(\mathrm{IC_{50}}/\mathrm{M})$. It asks: *how much potency did you get that you did not simply buy with grease?* Leeson and Springthorpe (2007) showed that marketed oral drugs cluster at much higher LipE than typical medicinal-chemistry output, and that lipophilicity had been drifting upward across the industry for decades.

A LipE above about 5 is a healthy lead series. A series whose potency climbs while LipE stays flat is not improving — it is inflating.`,
    },
    {
      kind: 'numeric',
      prompt: String.raw`A compound has $\mathrm{IC_{50}} = 5$ nM and a calculated $\log P$ of 4.8. What is its LipE?`,
      answer: 3.5,
      tolerance: 0.06,
      why: String.raw`$\mathrm{IC_{50}} = 5\times10^{-9}$ M, so $\mathrm{pIC_{50}} = -\log_{10}(5\times10^{-9}) = 8.30$, and $\mathrm{LipE} = 8.30 - 4.8 = 3.5$. Single-digit nanomolar sounds excellent, but a LipE of 3.5 says most of that potency was bought with lipophilicity. A 50 nM compound with $\log P$ 2.0 has LipE 5.3 and is usually the better starting point.`,
    },
    {
      kind: 'explain',
      title: 'Dominance: comparing without weights',
      body: String.raw`Before inventing a formula to combine objectives, notice that some comparisons need no formula at all.

Compound $A$ **dominates** compound $B$ if $A$ is at least as good as $B$ on *every* objective and strictly better on *at least one*. If that holds, no argument about priorities can rescue $B$: whatever you care about, $A$ gives you more of it.

The compounds that nothing dominates form the **Pareto front** (Pareto set). Everything else can be deleted without a value judgement. What the front cannot tell you is which point *on* it to pick — that genuinely requires a decision about trade-offs, and it is a decision for the project team, not for the algorithm.

The useful discipline here: **separate the objective comparison, which is mathematics, from the trade-off choice, which is a judgement call.** Most bad scoring functions blur the two.`,
    },
    {
      kind: 'widget',
      title: 'Find the front',
      body: String.raw`Sixty compounds, two objectives: potency (higher is better) and aqueous solubility (higher is better). They trade off because potency was bought with lipophilicity. Open rings are dominated — some other compound beats them on both axes. The filled staircase is the Pareto front.`,
      widget: {
        type: 'DrugParetoFront',
        props: { n: 60, weight: 0.5 },
        caption: 'Slide the weight $w$ and watch the ★ walk along the front. Two things to notice: the star never lands on a dominated compound, and no single weight reaches every point of the front.',
      },
    },
    {
      kind: 'mcq',
      prompt: 'Compound X has pIC50 7.8 and log S −4.1. Compound Y has pIC50 7.8 and log S −5.3. Which statement is correct?',
      choices: [
        'X dominates Y',
        'Y dominates X',
        'Neither dominates the other; both are on the Pareto front',
        'Dominance cannot be assessed without weights for the two objectives',
      ],
      answer: 0,
      why: 'X equals Y on potency and is better on solubility (−4.1 is a higher log S than −5.3), which is exactly the definition of dominance: at least as good everywhere, strictly better somewhere. Dominance needs no weights at all — that is its whole appeal. Y could only survive if it were better on some third objective not shown.',
    },
    {
      kind: 'explain',
      title: 'Scalarisation, and what it cannot see',
      body: String.raw`The usual move is **scalarisation**: collapse the objectives $f_1,\dots,f_k$ into one number and optimise that. The simplest version is a weighted sum,

$$S(x) = \sum_{i=1}^{k} w_i f_i(x), \qquad w_i \ge 0 .$$

This is attractive — any single-objective optimiser now works — and it has two real defects.

**1. The weights are a hidden decision.** Writing $w_{\text{potency}} = 0.5$ feels technical, but it is a statement about how much solubility one log unit of potency is worth. Nobody knows that number. It usually gets set by whoever ran the script.

**2. A weighted sum cannot reach the non-convex parts of a front.** This is a theorem, not a tuning problem (Das and Dennis 1997). Maximising a linear combination is geometrically the same as sliding a straight line until it last touches the feasible set — so it can only ever touch points on the *convex hull* of the front. Any point sitting in a dent of the front is unreachable for **every** choice of weights. Those dents are often exactly the balanced compromise compounds you wanted.`,
    },
    {
      kind: 'truefalse',
      prompt: 'By sweeping the weights of a weighted-sum score finely enough, you can reach every point on the Pareto front.',
      answer: false,
      why: 'Only points on the convex hull of the front are reachable. A linear score is a straight line slid across the feasible region, so it can never stop inside a concave dent of the front, no matter how the weights are chosen. Non-dominated sorting (as in NSGA-II) or a non-linear desirability score is needed to find those points.',
    },
    {
      kind: 'explain',
      title: 'Desirability functions',
      body: String.raw`The pharmaceutical standard is older than machine learning. Harrington (1965) and Derringer and Suich (1980) proposed mapping each raw property onto a **desirability** $d_i \in [0,1]$ — 0 is unacceptable, 1 is as good as it needs to be — and combining the $d_i$ with a **geometric** mean:

$$D = \left(\prod_{i=1}^{k} d_i^{\,w_i}\right)^{1/\sum_i w_i}.$$

Two properties make this better than a weighted sum of raw values.

- **Each property is put on a common, bounded scale by a curve a scientist chose.** A ramp from "useless" to "good enough" encodes the real shape of the requirement — solubility above a threshold stops helping, and a flat top says so.
- **A single zero zeroes the product.** A compound that is unacceptable on one axis cannot be rescued by excellence elsewhere. An arithmetic mean happily allows that trade, which is why arithmetic means produce impossible candidates.

Pfizer's **CNS MPO** score (Wager et al. 2010) is the best-known real example: six physicochemical properties, each mapped onto a 0–1 desirability, summed to a 0–6 score. Compounds scoring above 4 were markedly more likely to clear the CNS-specific hurdles.`,
    },
    {
      kind: 'numeric',
      prompt: 'A compound has desirabilities 0.9 (potency), 0.8 (solubility), 0.5 (metabolic stability) and 0.4 (synthesizability), with equal weights. What is the geometric-mean desirability D, to two decimal places?',
      answer: 0.62,
      tolerance: 0.02,
      why: 'The product is 0.9 × 0.8 × 0.5 × 0.4 = 0.144, and the fourth root of 0.144 is 0.616. The arithmetic mean would be 0.65 — higher, because it lets the strong potency pay for the weak synthesizability. The gap between the two means is small here and becomes infinite the moment any desirability hits zero.',
    },
    {
      kind: 'widget',
      title: 'Soft scores versus hard cut-offs',
      body: String.raw`The alternative to a composite score is a set of filters: potency above a threshold **and** solubility above a threshold. Switch to "cut-offs" and see how many of the sixty compounds survive.

Hard filters have one great virtue — they are honest about a genuine requirement — and one serious vice: a compound that misses a cut-off by one standard deviation of the assay is deleted as firmly as one that misses by a factor of a thousand. With four or five filters in series, a well-balanced compound that is marginal on each is very likely to be thrown away.`,
      widget: {
        type: 'DrugParetoFront',
        props: { n: 60, cutoffs: true },
        caption: 'Filters are a step function applied to a noisy measurement. Desirability ramps are the smooth version of the same intent, and they degrade gracefully when the measurement is wrong.',
      },
    },
    {
      kind: 'explain',
      title: 'The part the formulas leave out: the objectives are not equally knowable',
      body: String.raw`Here is the practical reality that textbook multi-objective optimisation ignores. Your objectives are measured by completely different processes, with error bars spanning more than an order of magnitude — and the score treats them all as exact numbers.

- **Potency within one assay, run with replicates on one day**, is the best case: around 0.2 log units (Kalliokoski's in-house reference series gave standard deviations of 0.17 and 0.22).
- **Potency pooled from the literature or from a public database is far worse.** Kramer et al. (2012) analysed heterogeneous public $K_i$ data and found disagreements between independent measurements of the same pair of around half a log unit; Kalliokoski et al. (2013) found a standard deviation near 0.7 log units for mixed IC50 data in ChEMBL. A "two-fold improvement" is invisible against that.
- **In-vivo endpoints** come from a handful of animals and carry both biological and technical variance.
- **Predicted properties** — a QSAR logD, a synthesizability score — have no experimental error at all. Their error is **model bias**, which does not average out over repeated evaluation and is systematically worse far from the training data.

Two consequences follow, and both bite hard:

1. **Selection concentrates on the noisiest objective.** If you rank thousands of compounds on a composite score, the top of the ranking is enriched in compounds that got *lucky* on whichever component has the largest variance. This is the winner's curse, and re-measuring the apparent winners usually shows regression toward the mean.
2. **An optimiser will exploit a model's error, not its signal.** Point a generative model at a predicted property and it will find the region where the prediction is wrongly optimistic, because that region scores best. The fix is uncertainty: penalise predictions the model is unsure about, or use the lower confidence bound rather than the mean.`,
      widget: {
        type: 'SvgDiagram',
        props: { svg: noiseSvg },
        caption: 'Five objectives with five very different error bars. A plain weighted sum has no way to express that the third line is worth less evidence than the first.',
      },
    },
    {
      kind: 'multi',
      prompt: 'Which practices make multi-parameter optimisation more trustworthy? (Select all.)',
      choices: [
        'Propagating each property’s uncertainty into the composite score and reporting a distribution rather than a single number',
        'Using a geometric rather than an arithmetic mean of desirabilities',
        'Re-measuring the top-ranked compounds before acting on the ranking',
        'Adding more objectives to the score until every known risk is represented',
        'Penalising predicted properties by the model’s own uncertainty, for example scoring on a lower confidence bound',
      ],
      answers: [0, 1, 2, 4],
      why: 'Uncertainty propagation, a mean that cannot be rescued by one strong axis, confirmation of apparent winners and a risk-adjusted use of model predictions all address a specific failure. Piling on objectives does the opposite: with many weakly informative terms every compound scores mediocre, the score stops discriminating, and the noisiest term still drives the ranking.',
    },
    {
      kind: 'match',
      prompt: 'Match each objective to the honest description of how well it is known.',
      pairs: [
        ['Potency, one assay, replicates, one day', 'The tightest number you will get — roughly 0.2 log units'],
        ['IC50 values pooled across labs and papers', 'Standard deviation near 0.7 log units (Kalliokoski 2013)'],
        ['Oral bioavailability in rodents', 'A handful of animals, large between-animal variation'],
        ['A predicted synthesizability score', 'No experimental error at all — only model bias'],
        ['Kinetic solubility in a screening format', 'A rank order inside a narrow assay window, not a thermodynamic value'],
      ],
      why: 'The point of the exercise is that these five live on the same line of a scoring function as if they were the same kind of number. Knowing which of your objectives is the noisy one tells you where your ranking is most likely to be an artefact.',
    },
    {
      kind: 'order',
      prompt: 'Order the steps of a defensible multi-parameter scoring workflow.',
      steps: [
        'Write down the objectives and, for each, the value that is genuinely good enough',
        'Choose a desirability curve per objective from those requirements',
        'Attach an uncertainty to every property, measured or predicted',
        'Combine the desirabilities into a score and rank the candidates',
        'Check the ranking against the Pareto front to see which candidates are dominated',
        'Re-measure the top candidates before committing synthesis effort',
      ],
      why: 'Requirements come before curves, and curves before any combination — writing the score first is how arbitrary weights get frozen into a project. The Pareto check catches candidates that a particular weighting happened to flatter, and re-measurement is the only defence against the winner’s curse.',
    },
    {
      kind: 'fill',
      prompt: 'A compound is ___ when another is at least as good on every objective and strictly better on one; the survivors form the ___ front. Collapsing several objectives into one number with weights is called ___ , and a weighted sum can never reach points in a ___ region of that front.',
      bank: ['dominated', 'Pareto', 'scalarisation', 'non-convex', 'desirable', 'hypervolume'],
      answer: ['dominated', 'Pareto', 'scalarisation', 'non-convex'],
      why: 'Dominance and the Pareto front need no weights; scalarisation introduces them, and with a linear score the price is the unreachable concave dents of the front. Hypervolume is a way of scoring how good a whole front is, not a property of one compound.',
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- Optimising potency alone reliably produces **larger, greasier molecules** with poor solubility, fast clearance and off-target liabilities. **LipE** $= \mathrm{pIC_{50}} - \log P$ asks how much potency was *not* bought with lipophilicity.
- $A$ **dominates** $B$ if it is at least as good everywhere and better somewhere. The non-dominated set is the **Pareto front**; deleting dominated compounds requires no value judgement, choosing a point on the front does.
- **Scalarisation** turns the problem back into single-objective optimisation, at the price of hidden weights — and a weighted sum provably cannot reach **non-convex** parts of the front.
- **Desirability functions** map each property onto $[0,1]$ with a curve chosen from real requirements and combine them by a **geometric** mean, so one unacceptable property cannot be bought off. CNS MPO (Wager 2010) is the canonical pharmaceutical example.
- The objectives are **not equally knowable**: a same-day assay is worth ~0.2 log units, pooled public IC50 data ~0.7 (Kalliokoski 2013), and a predicted score carries model bias rather than measurement noise.
- Therefore: **ranking on a composite score concentrates on the noisiest component**, and any optimiser pointed at a model will exploit the model's errors. Propagate uncertainty, score on a lower confidence bound, and re-measure your winners.`,
    },
  ],
  references: [
    { authors: 'Segall, M. D.', title: 'Multi-parameter optimization: identifying high quality compounds with a balance of properties', year: 2012, venue: 'Curr. Pharm. Des. 18, 1292–1310' },
    { authors: 'Wager, T. T., Hou, X., Verhoest, P. R., Villalobos, A.', title: 'Moving beyond rules: the development of a central nervous system multiparameter optimization (CNS MPO) approach to enable alignment of druglike properties', year: 2010, venue: 'ACS Chem. Neurosci. 1, 435–449' },
    { authors: 'Leeson, P. D., Springthorpe, B.', title: 'The influence of drug-like concepts on decision-making in medicinal chemistry', year: 2007, venue: 'Nat. Rev. Drug Discov. 6, 881–890' },
    { authors: 'Kalliokoski, T., Kramer, C., Vulpetti, A., Gedeck, P.', title: 'Comparability of mixed IC50 data – a statistical analysis', year: 2013, venue: 'PLoS ONE 8, e61007' },
    { authors: 'Das, I., Dennis, J. E.', title: 'A closer look at drawbacks of minimizing weighted sums of objectives for Pareto set generation in multicriteria optimization problems', year: 1997, venue: 'Struct. Optim. 14, 63–69' },
  ],
} satisfies LessonContent;
