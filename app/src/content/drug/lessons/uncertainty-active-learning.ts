import type { LessonContent } from '../../types';

const loopSvg = `<svg viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg">
<text x="160" y="13" font-size="9" fill="var(--muted)" text-anchor="middle">the design–make–test loop, closed by a model</text>
<g font-size="9" fill="var(--fg)" text-anchor="middle">
<rect x="112" y="24" width="96" height="30" rx="5" fill="var(--c2)" fill-opacity="0.22" stroke="var(--c2)"/>
<text x="160" y="43">train model</text>
<rect x="222" y="74" width="92" height="30" rx="5" fill="var(--c3)" fill-opacity="0.22" stroke="var(--c3)"/>
<text x="268" y="93">score the pool</text>
<rect x="112" y="124" width="96" height="30" rx="5" fill="var(--c1)" fill-opacity="0.22" stroke="var(--c1)"/>
<text x="160" y="143">test a batch</text>
<rect x="6" y="74" width="92" height="30" rx="5" fill="var(--c4)" fill-opacity="0.22" stroke="var(--c4)"/>
<text x="52" y="88">pick next</text><text x="52" y="99" font-size="7.5" fill="var(--muted)">value + uncertainty</text>
</g>
<g fill="none" stroke="var(--muted)" stroke-width="1.5" stroke-dasharray="4 3">
<path d="M208,44 Q258,50 266,70"><animate attributeName="stroke-dashoffset" values="14;0" dur="1.2s" repeatCount="indefinite"/></path>
<path d="M254,104 Q210,136 212,139"><animate attributeName="stroke-dashoffset" values="14;0" dur="1.2s" repeatCount="indefinite"/></path>
<path d="M112,139 Q58,134 54,108"><animate attributeName="stroke-dashoffset" values="14;0" dur="1.2s" repeatCount="indefinite"/></path>
<path d="M62,74 Q100,46 110,42"><animate attributeName="stroke-dashoffset" values="14;0" dur="1.2s" repeatCount="indefinite"/></path>
</g>
<text x="160" y="92" font-size="8.5" fill="var(--muted)" text-anchor="middle">each turn costs</text>
<text x="160" y="103" font-size="8.5" fill="var(--muted)" text-anchor="middle">weeks and money</text>
</svg>`;

export default {
  cards: [
    {
      kind: 'explain',
      title: 'A number without an error bar is not a decision',
      body: String.raw`Your model predicts pIC50 = 7.4 for a compound you have never made. Should you spend three weeks of chemistry on it?

It depends on something the prediction alone does not tell you. If that 7.4 means "7.4 ± 0.3, and this compound sits inside the chemistry I was trained on", you order the synthesis. If it means "7.4 ± 1.5, and nothing like this was in my training set", you do not — or you make the cheapest possible version first.

Every use of a model in discovery is a decision under uncertainty: which compounds to buy, which to make, which to send to the expensive assay. So the model has to say how much it knows.`,
    },
    {
      kind: 'explain',
      title: 'Two kinds of not knowing',
      body: String.raw`**Aleatoric** uncertainty is noise in the measurement itself. Run the assay twice and you get two numbers; public potency data scatters by roughly half a log unit. More training data cannot remove it — it is a property of the experiment, and it sets a floor on any model's accuracy.

**Epistemic** uncertainty is the model's own ignorance: nobody ever measured anything like this compound, so the model is extrapolating. More data — specifically, data *near this compound* — does remove it.

The distinction is practical, not philosophical. Epistemic uncertainty is what [active learning](@drug/self-driving-labs) attacks: you choose compounds whose measurement would teach the model something. Spending your budget where the uncertainty is purely aleatoric teaches it nothing.`,
    },
    {
      kind: 'mcq',
      prompt: 'A model is very uncertain about a compound built on a scaffold absent from its training set. This is mostly…',
      choices: [
        'aleatoric uncertainty, from assay noise',
        'epistemic uncertainty, from lack of relevant data',
        'a calibration error',
        'label leakage',
      ],
      answer: 1,
      why: 'Absence of similar training data is ignorance the model could fix by being given examples of that scaffold — epistemic. Assay noise would show up even for compounds measured many times, and calibration is about whether stated uncertainties match observed errors, a separate question.',
    },
    {
      kind: 'recall',
      title: 'Calibration (from ML)',
      points: [
        'A model is **calibrated** when its stated confidence matches its observed accuracy.',
        'For classification: of the predictions made with 80% confidence, about 80% should be right.',
        'For regression: about 80% of true values should fall inside the stated 80% intervals.',
        'Modern neural networks are typically **over-confident**; post-hoc fixes such as temperature scaling adjust the confidence without changing the ranking.',
      ],
      link: 'ml/calibration-uncertainty',
    },
    {
      kind: 'widget',
      title: 'Confidence that does not match reality',
      body: 'Raise the over-confidence and watch the bars fall below the diagonal: the model claims 90% and delivers 70%. Temperature scaling pulls them back without changing a single decision boundary.',
      widget: { type: 'MlReliabilityDiagram', props: { overconfidence: 2.5, temperature: 1, showC: true }, caption: 'Shown here for a binary classifier (active / inactive). The regression analogue plots the fraction of true values inside each stated interval against the nominal level.' },
    },
    {
      kind: 'explain',
      title: 'Four ways to get an error bar',
      body: String.raw`- **Ensembles.** Train the same model several times with different initialisations (and/or data subsets) and use the spread of their predictions. For a random forest this is free: the trees are already an ensemble. Deep ensembles of five to ten models are the strongest simple baseline for deep nets (Lakshminarayanan et al. 2017), and the one most used in practice.
- **MC dropout.** Keep dropout switched on at prediction time and run the network many times; the variance across runs approximates a Bayesian posterior (Gal & Ghahramani 2016). Cheaper to train than an ensemble, usually a bit worse.
- **Direct variance prediction.** Give the network two outputs, a mean and a variance, and train with a Gaussian likelihood. It captures aleatoric noise well, epistemic ignorance poorly.
- **Distance to the training set.** The oldest cheminformatics answer: if the nearest training compound is Tanimoto 0.2 away, do not trust the prediction. Crude, free, and a surprisingly strong signal.

Hirschfeld et al. (JCIM 2020) benchmarked these on molecular property prediction and found no single winner — the best method depends on the dataset, and ensembles plus distance-based measures were consistently competitive.`,
    },
    {
      kind: 'widget',
      title: 'Uncertainty grows away from the data',
      body: 'Tap the plot to add an observation. The band is the model\'s 95% interval: narrow where compounds have been measured, wide where they have not.',
      widget: { type: 'MlGPPosterior', props: { kernel: 'rbf', lengthScale: 0.3, points: [], samples: 3 }, caption: 'A Gaussian process makes the idea visible: start from no data (pure prior), add points, and watch epistemic uncertainty shrink locally. A chemical space is 2048-dimensional instead of one, but the shape of the story is the same.' },
    },
    {
      kind: 'multi',
      prompt: 'Which signals plausibly indicate high epistemic uncertainty for a new compound?',
      choices: [
        'The five models in an ensemble disagree with each other',
        'Its nearest training neighbour is at Tanimoto 0.18',
        'Its scaffold does not appear anywhere in the training set',
        'The assay used to generate the training labels has a 0.5 log unit standard deviation',
      ],
      answers: [0, 1, 2],
      why: 'Ensemble disagreement, distance from training data and an unseen scaffold all say "this is outside what I have learned". Assay noise is aleatoric: it applies to every compound equally and cannot be reduced by collecting more of the same measurement.',
    },
    {
      kind: 'explain',
      title: 'Conformal prediction: a guarantee instead of a hope',
      body: String.raw`Ensemble spread is a heuristic — nothing says a spread of 0.3 means a 68% interval. **Conformal prediction** turns it into a guarantee, with almost no assumptions.

Split conformal regression, in four steps:
1. Fit your model on a training set.
2. Hold out a **calibration set** the model never saw. Compute its nonconformity scores, e.g. the absolute residuals $s_i = |y_i - \hat y_i|$ (often divided by a predicted uncertainty, so the intervals can vary in width).
3. Let $q$ be the $\lceil (n+1)(1-\alpha)\rceil / n$ quantile of those scores.
4. For a new compound, output the interval $\hat y \pm q$.

Then $P(y \in \text{interval}) \ge 1 - \alpha$ — **finite-sample, distribution-free**, for any underlying model. The one assumption is **exchangeability**: the new compound is drawn from the same distribution as the calibration compounds.

That assumption is exactly what a scaffold or time split violates. Conformal prediction on genuinely novel chemistry under-covers, and honest reports in drug discovery say so (Cortés-Ciriano & Bender 2019).`,
    },
    {
      kind: 'numeric',
      prompt: 'You build 90% conformal intervals and apply them to 250 new compounds drawn from the same distribution as your calibration set. About how many true values should fall outside their interval?',
      answer: 25,
      tolerance: 1,
      why: 'A 90% interval is wrong 10% of the time by construction: 0.10 × 250 = 25. If you observe 80 misses, the exchangeability assumption has broken — usually because the new compounds are from different chemistry.',
    },
    {
      kind: 'truefalse',
      prompt: 'The conformal coverage guarantee still holds when the model is applied to a brand-new chemical series.',
      answer: false,
      why: 'The guarantee requires the new compound to be exchangeable with the calibration compounds. A new series is drawn from different chemistry, so coverage degrades — often badly. Conformal prediction removes the need to trust the model, not the need to think about distribution shift.',
    },
    {
      kind: 'explain',
      title: 'Active learning: choosing what to measure',
      body: String.raw`Once a model knows what it does not know, it can ask for the right experiments. **Active learning** is a loop: train on what you have, score everything you could test, pick a batch, measure it, retrain.

The choice of batch is the whole game, and it is the exploration–exploitation trade-off in its original form:
- **Greedy (exploit).** Take the highest predicted values. Fast progress, then the model stops improving because you only ever sample where it was already confident.
- **Uncertainty sampling (explore).** Take the compounds the model is least sure about. Maximally informative, but many of them are informative *and* worthless.
- **Upper confidence bound.** Rank by $\hat y + \kappa\,\hat\sigma$, with $\kappa$ tuning the balance. Expected improvement and Thompson sampling are the other standard acquisition functions.
- **Batch diversity.** The top 96 compounds by any score are usually near-duplicates of each other. Cluster first, or penalise similarity to compounds already picked — otherwise a 96-well plate buys you one measurement's worth of information.`,
      widget: { type: 'SvgDiagram', props: { svg: loopSvg }, caption: 'The loop runs in a virtual screen (each turn is a docking batch) or in the lab (each turn is a synthesis round), and the same acquisition functions apply.' },
    },
    {
      kind: 'recall',
      title: 'Bayesian inference (from Statistics)',
      points: [
        'A **posterior** combines prior belief with the likelihood of the data observed.',
        'It is a *distribution* over predictions, not a point — which is where the error bar comes from.',
        'Observing data where you were uncertain shrinks the posterior there.',
        'Bayesian optimisation uses the posterior to choose the next experiment.',
      ],
      link: 'stats/bayesian-inference',
    },
    {
      kind: 'order',
      prompt: 'Order one round of a pool-based active learning campaign.',
      steps: [
        'Train the model (and its uncertainty estimate) on all compounds measured so far',
        'Predict value and uncertainty for every unmeasured compound in the pool',
        'Rank by an acquisition function such as $\\hat y + \\kappa\\hat\\sigma$',
        'Select a diverse batch from the top of that ranking, respecting plate size and budget',
        'Measure the batch experimentally',
        'Add the new measurements to the training set and repeat',
      ],
      why: 'Scoring the whole pool before selecting is what makes the choice global; diversity is applied at the batch step, after ranking, because otherwise the batch collapses onto one analogue series.',
    },
    {
      kind: 'explain',
      title: 'How much does it save?',
      body: String.raw`Graff, Shakhnovich and Coley (Chem. Sci. 2021) applied pool-based active learning to [ultra-large virtual screens](@drug/ultra-large-libraries), using a surrogate model of the docking score instead of docking everything. Iterating over batches, they recovered the large majority of the top-scoring compounds in libraries from 10⁴ to 10⁸ molecules while actually docking only a few percent of them — a one-to-two order of magnitude reduction in compute.

Two warnings before you believe the same numbers in the lab:
- **The surrogate inherits the oracle's flaws.** Active learning finds the top of the *docking score*, and docking scores correlate weakly with real affinity. A faster route to the wrong answer is still the wrong answer.
- **The training set becomes biased by design.** You deliberately measure where the model is uncertain or optimistic, so the accumulated data is not a random sample of chemical space, and the model's performance on it is not an unbiased estimate of its performance anywhere else.`,
    },
    {
      kind: 'match',
      prompt: 'Match each method to its core idea.',
      pairs: [
        ['Deep ensemble', 'Spread across independently trained models'],
        ['MC dropout', 'Keep dropout on at test time and sample'],
        ['Conformal prediction', 'Calibration-set residual quantile gives guaranteed coverage'],
        ['Upper confidence bound', 'Rank by predicted value plus a multiple of the uncertainty'],
      ],
      why: 'The first two estimate uncertainty, the third converts an estimate into a statement with a coverage guarantee, and the fourth is what you do with it when choosing experiments.',
    },
    {
      kind: 'fill',
      prompt: 'Picking only the top predicted compounds is pure ___; picking the most uncertain ones is pure ___. Noise in the assay itself is ___ uncertainty, which more data cannot remove.',
      bank: ['exploitation', 'exploration', 'aleatoric', 'epistemic', 'conformal'],
      answer: ['exploitation', 'exploration', 'aleatoric'],
      why: 'Acquisition functions such as UCB interpolate between the first two; keeping the aleatoric/epistemic distinction straight is what stops you spending a screening budget on compounds whose uncertainty no experiment can reduce.',
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- A prediction used for a decision needs an **error bar** and an **applicability domain**.
- **Aleatoric** = assay noise (irreducible); **epistemic** = model ignorance (reducible by data). Active learning targets the second.
- Practical estimators: **ensembles** (strongest simple baseline), **MC dropout**, direct variance prediction, and **distance to training data**. No method wins everywhere (Hirschfeld et al. 2020).
- **Conformal prediction** converts any uncertainty score into intervals with finite-sample coverage — provided new compounds are **exchangeable** with the calibration set, which new chemistry is not.
- **Active learning** loops train → score pool → acquire batch → measure. Balance exploitation and exploration (e.g. UCB) and force **batch diversity**.
- Savings of one to two orders of magnitude are real in virtual screening, but the surrogate inherits the oracle's biases and the accumulated data is deliberately non-random.`,
    },
  ],
  references: [
    { authors: 'Lakshminarayanan, B., Pritzel, A., Blundell, C.', title: 'Simple and scalable predictive uncertainty estimation using deep ensembles', year: 2017, venue: 'Proc. NeurIPS 30' },
    { authors: 'Gal, Y., Ghahramani, Z.', title: 'Dropout as a Bayesian approximation: representing model uncertainty in deep learning', year: 2016, venue: 'Proc. ICML (PMLR 48)' },
    { authors: 'Hirschfeld, L., Swanson, K., Yang, K., Barzilay, R., Coley, C. W.', title: 'Uncertainty quantification using neural networks for molecular property prediction', year: 2020, venue: 'J. Chem. Inf. Model. 60, 3770–3780' },
    { authors: 'Cortés-Ciriano, I., Bender, A.', title: 'Deep confidence: a computationally efficient framework for calculating reliable prediction errors for deep neural networks', year: 2019, venue: 'J. Chem. Inf. Model. 59, 1269–1281' },
    { authors: 'Graff, D. E., Shakhnovich, E. I., Coley, C. W.', title: 'Accelerating high-throughput virtual screening through molecular pool-based active learning', year: 2021, venue: 'Chem. Sci. 12, 7866–7881' },
  ],
} satisfies LessonContent;
