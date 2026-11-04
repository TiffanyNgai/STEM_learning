import type { LessonContent } from '../../types';

const pipelineSvg = `<svg viewBox="0 0 320 170" xmlns="http://www.w3.org/2000/svg">
<defs><marker id="mppa" markerWidth="7" markerHeight="7" refX="6" refY="3" orient="auto">
<path d="M0,0 L6,3 L0,6 z" fill="var(--muted)"/></marker></defs>
<g font-size="9" fill="var(--fg)" text-anchor="middle">
<rect x="6" y="40" width="58" height="34" rx="5" fill="var(--c2)" fill-opacity="0.22" stroke="var(--c2)"/>
<text x="35" y="54">molecule</text><text x="35" y="66" font-size="8" fill="var(--muted)">SMILES</text>
<rect x="88" y="40" width="58" height="34" rx="5" fill="var(--c3)" fill-opacity="0.22" stroke="var(--c3)"/>
<text x="117" y="54">features</text><text x="117" y="66" font-size="8" fill="var(--muted)">x ∈ R^d</text>
<rect x="170" y="40" width="58" height="34" rx="5" fill="var(--c4)" fill-opacity="0.22" stroke="var(--c4)"/>
<text x="199" y="54">model</text><text x="199" y="66" font-size="8" fill="var(--muted)">f(x)</text>
<rect x="252" y="40" width="62" height="34" rx="5" fill="var(--c1)" fill-opacity="0.22" stroke="var(--c1)"/>
<text x="283" y="54">property</text><text x="283" y="66" font-size="8" fill="var(--muted)">ŷ</text>
<rect x="88" y="110" width="140" height="30" rx="5" fill="var(--c5)" fill-opacity="0.18" stroke="var(--c5)"/>
<text x="158" y="124">measured labels y</text><text x="158" y="134" font-size="8" fill="var(--muted)">assay data — the expensive part</text>
</g>
<g stroke="var(--muted)" stroke-width="1.4" fill="none" marker-end="url(#mppa)">
<line x1="66" y1="57" x2="84" y2="57"/><line x1="148" y1="57" x2="166" y2="57"/><line x1="230" y1="57" x2="248" y2="57"/>
<line x1="158" y1="106" x2="158" y2="80"><animate attributeName="stroke-dasharray" values="0 40;40 0" dur="2.5s" repeatCount="indefinite"/></line>
</g>
<text x="176" y="96" font-size="8" fill="var(--c5)">training signal</text>
<text x="160" y="18" font-size="9" fill="var(--muted)" text-anchor="middle">supervised learning, with molecules as the inputs</text>
</svg>`;

export default {
  cards: [
    {
      kind: 'explain',
      title: 'The question every project asks',
      body: String.raw`You have 2 million purchasable compounds and money to test 2,000. Which 2,000?

**Molecular property prediction** answers that with a function: feed in a molecule, get out a number — predicted potency against your target, solubility, metabolic half-life, hERG liability. Train it on the compounds you have already measured; apply it to the ones you have not.

Every property in [ADME and tox](@drug/adme-tox) and every potency assay can be posed this way. The hard parts are not the algorithms — they are turning a molecule into numbers, and knowing when to believe the answer.`,
      widget: { type: 'SvgDiagram', props: { svg: pipelineSvg }, caption: 'The same four boxes appear in every lesson of this unit. What changes is how the *features* are made and how the *model* is fitted.' },
    },
    {
      kind: 'recall',
      title: 'Supervised learning in one card',
      points: [
        'You have pairs $(x_i, y_i)$: an input and a measured label.',
        'Fit $f$ by minimising a **loss** on the training pairs — squared error for regression, cross-entropy for classification.',
        'What matters is error on data the model has **never seen** (generalisation), not training error.',
        'Too flexible a model memorises noise (**overfitting**); too rigid a one misses real structure.',
      ],
      link: 'ml/ml-framing',
    },
    {
      kind: 'explain',
      title: 'Regression or classification?',
      body: String.raw`Most assay readouts are continuous, so **regression** is the default — but on the right scale.

Potency spans orders of magnitude, so never regress on IC50 in nanomolar. Use $\mathrm{pIC50} = -\log_{10}(\mathrm{IC50}\ \text{in M})$: a 32 nM compound has $\mathrm{pIC50} = -\log_{10}(3.2\times10^{-8}) = 7.5$. Now the label is a well-behaved number around 5–10, equal steps mean equal *fold* changes, and the assay's error is roughly constant across the range.

**Classification** ("active / inactive", "toxic / clean") is right when the data really are categorical — a screening hit list, a yes/no toxicology finding — but turning a continuous value into a class by thresholding throws away information and invents a hard boundary where none exists.`,
    },
    {
      kind: 'numeric',
      prompt: 'A compound has IC50 = 250 nM. What is its pIC50?',
      answer: 6.6,
      tolerance: 0.05,
      why: String.raw`$250\ \text{nM} = 2.5\times10^{-7}$ M, so $\mathrm{pIC50} = -\log_{10}(2.5\times10^{-7}) = 7 - \log_{10}(2.5) = 7 - 0.398 = 6.60$. Forgetting to convert nM to molar gives −2.4, a sign that the units were dropped.`,
      widget: { type: 'DrugDoseResponse', props: { pIC50: 6.6, showData: true }, caption: 'pIC50 = 6.6 is the midpoint of the curve on the log-concentration axis.' },
    },
    {
      kind: 'explain',
      title: 'The baseline to beat: fingerprints + trees',
      body: String.raw`The workhorse baseline of the field is embarrassingly simple:

1. Compute an **ECFP4** fingerprint (2048 bits) for each molecule, often with a handful of global descriptors (MW, logP, TPSA) stuck on the end.
2. Fit a **random forest** or **gradient-boosted trees** on those features.

That is it — a few lines of RDKit and scikit-learn. Trees handle binary features natively, need almost no tuning, cope with a few hundred training points, and cannot explode on an unusual input the way a deep network can. In a systematic comparison across many datasets, descriptor- and fingerprint-based models with XGBoost or random forests matched or beat graph neural networks on the majority of benchmarks (Jiang et al. 2021).

Any new method must be shown to beat *this*, on the same split.`,
    },
    {
      kind: 'recall',
      title: 'Fingerprints (earlier in this subject)',
      points: [
        'An **ECFP/Morgan** fingerprint hashes each atom\'s circular environment (radius 2 = ECFP4) into a bit vector.',
        'Folding to $m$ bits (typically 1024 or 2048) causes **collisions**: unrelated substructures can share a bit.',
        'Similar fingerprints usually mean similar properties — the **similarity principle**.',
        'Fingerprints are purely 2D: no conformation, no geometry.',
      ],
      link: 'drug/fingerprints-similarity',
    },
    {
      kind: 'widget',
      title: 'What the model actually sees',
      body: 'Switch to the "bits" view: this row of 0s and 1s, not the drawing, is the input vector. Tap an atom to see which bits its environments set.',
      widget: { type: 'MolGraphFingerprint', props: { molecule: 'ibuprofen', view: 'bits' }, caption: 'A random forest never sees a molecule. It sees "bit 37 is on, bit 112 is off, …" and splits on those.' },
    },
    {
      kind: 'recall',
      title: 'Random forests & boosting',
      points: [
        'A **decision tree** splits the feature space with a sequence of yes/no questions.',
        'A **random forest** averages many trees, each grown on a bootstrap sample with a random subset of features at each split — averaging kills the variance.',
        '**Gradient boosting** instead fits trees *sequentially*, each one to the previous ensemble\'s residuals.',
        'Both give feature importances, but importance over 2048 hashed bits is rarely interpretable.',
      ],
      link: 'ml/random-forests',
    },
    {
      kind: 'widget',
      title: 'Averaging versus sequential correction',
      body: 'Switch between bagging and boosting and move the rounds slider. Bagging (the random-forest idea) averages independent noisy fits; boosting walks towards the signal one small correction at a time, and eventually starts fitting noise.',
      widget: { type: 'MlTreeEnsemble1D', props: { mode: 'bagging', rounds: 1, depth: 6 }, caption: 'A 1D cartoon of the two ensembles. In a real QSAR model the x axis is 2048-dimensional.' },
    },
    {
      kind: 'mcq',
      prompt: 'Why is a random forest on ECFP bits such a hard baseline to beat on a 500-compound dataset?',
      choices: [
        'It is the only model that can use binary features',
        'With little data, a low-variance model on strong hand-made features usually wins over a flexible model that must learn its own features',
        'It is guaranteed to find the globally optimal function',
        'ECFP bits already contain the 3D binding pose',
      ],
      answer: 1,
      why: 'Deep models earn their keep by *learning* representations, which takes data. On a few hundred compounds, ECFP already encodes chemically sensible substructures, and averaging trees controls variance. Nothing guarantees optimality, other models handle binary inputs fine, and fingerprints contain no 3D geometry at all.',
    },
    {
      kind: 'explain',
      title: 'How good is good? Reading the metrics',
      body: String.raw`For regression on a log scale, report **RMSE** in log units and **$R^2$** (or Spearman $\rho$ if you only care about ranking).

The intuition that matters: an RMSE of **0.7 log units** means typical predictions are out by a factor of $10^{0.7} \approx 5$. For a potency model that is the difference between a 10 nM lead and a 50 nM one — still useful for triage, useless for fine optimisation.

Two anchors keep you honest:
- The **assay's own** reproducibility. Repeated public measurements of the same compound–target pair disagree: about 0.44 log units standard deviation for $K_i$ values (Kramer et al. 2012) and about 0.68 for mixed IC50 values (Kalliokoski et al. 2013). No model trained on such data can do much better than that floor.
- A **trivial predictor**: always predicting the training mean gives $R^2 = 0$. Many published models on small, narrow datasets are barely above it.`,
    },
    {
      kind: 'numeric',
      prompt: 'A solubility model reports RMSE = 0.6 log units. By roughly what factor is a typical prediction wrong?',
      answer: 4,
      tolerance: 0.3,
      unit: '×',
      why: String.raw`An error of 0.6 on a $\log_{10}$ scale is a factor of $10^{0.6} \approx 3.98$. Reporting "RMSE 0.6" sounds small until you convert it: the model may predict 10 µM for a compound that is really 40 µM.`,
    },
    {
      kind: 'multi',
      prompt: 'Which of these are sensible choices when setting up a property-prediction task?',
      choices: [
        'Regressing on pIC50 rather than IC50 in nanomolar',
        'Checking the model against an always-predict-the-mean baseline',
        'Merging IC50 values measured in three different assay formats into one label column without flagging the source',
        'Quoting RMSE in log units and converting it into a fold-error for the reader',
      ],
      answers: [0, 1, 3],
      why: 'A log scale tames the dynamic range, baselines and fold-errors keep claims honest. Silently merging assay formats injects a systematic offset the model will happily fit as if it were chemistry — the hallmark of a dataset that looks big but is not.',
    },
    {
      kind: 'explain',
      title: 'Where the data come from — and what is wrong with it',
      body: String.raw`Public potency data mostly comes from **ChEMBL** (bioactivities curated from the medicinal-chemistry literature) and **PubChem** (mostly HTS screens); ADMET data is scattered and smaller. Three habits of this data shape everything downstream:

- **It is not a random sample of chemistry.** Chemists made analogues of what already worked, so datasets are clumps of near-identical compounds around a few scaffolds.
- **Actives are over-reported.** Nobody publishes the 400 inactive analogues, so "inactive" often means "untested".
- **Labels are noisy and heterogeneous** — different assay formats, cell lines, incubation times.

This is why [assay artefacts](@drug/assay-artefacts) and curation matter more than the choice of algorithm, and why the splitting lesson later in this unit exists at all.`,
    },
    {
      kind: 'truefalse',
      prompt: 'A model that reaches $R^2 = 0.9$ on a randomly held-out 20% of a congeneric series has been shown to generalise to new chemotypes.',
      answer: false,
      why: 'In a congeneric series every held-out compound has near-twins in training, so random-split $R^2$ mostly measures interpolation within one scaffold. Generalisation to new chemotypes must be tested with a scaffold or time split — the subject of a later lesson in this unit.',
    },
    {
      kind: 'order',
      prompt: 'Put a sound property-prediction workflow into order.',
      steps: [
        'Curate the data: standardise structures, resolve duplicates, keep one assay format, record units',
        'Choose the label and its scale (e.g. pIC50) and decide regression vs classification',
        'Split the data in a way that matches how the model will be used',
        'Featurise the training molecules (fingerprints and/or descriptors) and fit the baseline model',
        'Evaluate on the held-out set against a trivial baseline, in interpretable units',
        'Predict for new compounds, flagging those outside the applicability domain',
      ],
      why: 'Curation comes first because every later step inherits its errors, and the split must be fixed *before* any model fitting so that no test information leaks into feature or hyperparameter choices.',
    },
    {
      kind: 'fill',
      prompt: 'Converting a potency to pIC50 uses a ___ transform; a random forest reduces ___ by averaging many trees fitted on bootstrap samples.',
      bank: ['logarithmic', 'variance', 'linear', 'bias', 'exponential'],
      answer: ['logarithmic', 'variance'],
      why: 'pIC50 = −log10(IC50 in M). Bagging leaves each tree\'s bias roughly unchanged but averages away much of its variance — which is why individual trees in a forest are grown deep.',
    },
    {
      kind: 'match',
      prompt: 'Match each quantity to what it tells you.',
      pairs: [
        ['RMSE = 0.7 log units', 'Typical prediction off by about 5-fold'],
        ['$R^2 = 0$', 'No better than always predicting the training mean'],
        ['Spearman ρ', 'How well the ranking of compounds is preserved'],
        ['Assay standard deviation ≈ 0.5–0.7 log units', 'A floor on achievable model error'],
      ],
      why: 'Fold-error, a trivial baseline, rank quality and the noise floor are four different questions; a single headline number answers none of them on its own.',
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- Property prediction = supervised learning with molecules as inputs: **featurise → fit → predict**.
- Use a **log scale** for potency and concentration labels ($\mathrm{pIC50} = -\log_{10}\mathrm{IC50}$).
- The baseline to beat is **ECFP4 + random forest / gradient boosting**; on small datasets it often still wins.
- Report error in units you can interpret: RMSE 0.7 log units ≈ 5-fold typical error. Compare against a trivial baseline and the assay's own noise (≈ 0.4–0.7 log units for public potency data).
- The data, not the algorithm, is usually the limiting factor: clumped, biased towards actives and noisily labelled.`,
    },
  ],
  references: [
    { authors: 'Jiang, D., Wu, Z., Hsieh, C.-Y., et al.', title: 'Could graph neural networks learn better molecular representation for drug discovery? A comparison study of descriptor-based and graph-based models', year: 2021, venue: 'J. Cheminform. 13, 12' },
    { authors: 'Kramer, C., Kalliokoski, T., Gedeck, P., Vulpetti, A.', title: 'The experimental uncertainty of heterogeneous public Ki data', year: 2012, venue: 'J. Med. Chem. 55, 5165–5173' },
    { authors: 'Kalliokoski, T., Kramer, C., Vulpetti, A., Gedeck, P.', title: 'Comparability of mixed IC50 data – a statistical analysis', year: 2013, venue: 'PLoS ONE 8, e61007' },
    { authors: 'Cherkasov, A., Muratov, E. N., Fourches, D., et al.', title: 'QSAR modeling: where have you been? Where are you going to?', year: 2014, venue: 'J. Med. Chem. 57, 4977–5010' },
    { authors: 'Vamathevan, J., Clark, D., Czodrowski, P., et al.', title: 'Applications of machine learning in drug discovery and development', year: 2019, venue: 'Nat. Rev. Drug Discov. 18, 463–477' },
  ],
} satisfies LessonContent;
