import type { LessonContent } from '../../types';

const cliffSvg = `<svg viewBox="0 0 320 160" xmlns="http://www.w3.org/2000/svg">
<text x="160" y="13" font-size="9" fill="var(--muted)" text-anchor="middle">an activity cliff: one methyl group, 100-fold potency</text>
<g stroke="var(--muted)" stroke-width="1.5" fill="none">
<path d="M34,86 L64,68 L94,86 L94,112 L64,130 L34,112 Z"/>
<path d="M190,86 L220,68 L250,86 L250,112 L220,130 L190,112 Z"/>
<line x1="94" y1="86" x2="118" y2="72"/>
<line x1="250" y1="86" x2="274" y2="72"/>
<line x1="274" y1="72" x2="296" y2="84"/>
</g>
<circle cx="296" cy="84" r="4" fill="var(--c3)">
<animate attributeName="r" values="4;6;4" dur="2s" repeatCount="indefinite"/></circle>
<text x="300" y="72" font-size="8.5" fill="var(--c3)">+CH₃</text>
<g font-size="9.5" text-anchor="middle">
<text x="64" y="150" fill="var(--c5)">pIC50 = 5.0</text>
<text x="220" y="150" fill="var(--c1)">pIC50 = 7.0</text>
</g>
<text x="160" y="104" font-size="9" fill="var(--muted)" text-anchor="middle">Tanimoto 0.95</text>
<text x="160" y="118" font-size="8" fill="var(--muted)" text-anchor="middle">any similarity-based model</text>
<text x="160" y="128" font-size="8" fill="var(--muted)" text-anchor="middle">predicts these two the same</text>
</svg>`;

export default {
  cards: [
    {
      kind: 'explain',
      title: 'The number that decides everything',
      body: String.raw`"Our model achieves $R^2 = 0.91$." On what data? Held out how?

That single choice — how the compounds were divided into training and test — usually moves the headline number more than the choice of model does. Get it wrong and you will ship a model that looked excellent in the notebook and is useless on the next batch of compounds your chemists make.

This lesson is about measuring honestly: the standard benchmarks, the three splits you will meet, the ways information leaks across them, and the chemistry that defeats all of it.`,
    },
    {
      kind: 'recall',
      title: 'Train / validation / test (from ML)',
      points: [
        'The **test set** is touched once, at the end. Anything you tune on it stops being a test.',
        'The **validation set** (or inner cross-validation fold) is for hyperparameters and model choice.',
        '**k-fold cross-validation** reuses data by rotating which fold is held out.',
        'Estimates from a single small split are noisy: report the spread over repeats.',
      ],
      link: 'ml/cross-validation',
    },
    {
      kind: 'explain',
      title: 'The standard benchmarks',
      body: String.raw`**MoleculeNet** (Wu et al., Chem. Sci. 2018) collected 17 datasets — over 700,000 compounds — into one suite spanning four levels: quantum mechanics (QM7/8/9), physical chemistry (ESOL solubility, FreeSolv hydration free energies, lipophilicity), biophysics (HIV, BACE, PCBA, MUV) and physiology (BBBP, Tox21, ToxCast, SIDER, ClinTox). It shipped with the DeepChem library, specified metrics and splits, and became the default yardstick for a decade of papers.

**Therapeutics Data Commons** (Huang et al., NeurIPS 2021) is the modern successor: dozens of curated datasets organised in three tiers (single-instance prediction such as ADMET, multi-instance problems such as drug–target interaction, and generation), with fixed splits, leaderboards and a requirement to report across several random seeds.

Benchmarks are indispensable and dangerous in the same way: they make results comparable, and they make it tempting to optimise for the benchmark.`,
    },
    {
      kind: 'multi',
      prompt: 'Which are genuine limitations of the MoleculeNet suite as used in practice?',
      choices: [
        'Several of its datasets contain only a few hundred to a few thousand molecules, so differences between models are within noise',
        'Some label sets contain known errors and ambiguous definitions',
        'Hundreds of papers have now tuned against the same splits, so reported gains are partly selection',
        'It contains no classification tasks',
      ],
      answers: [0, 1, 2],
      why: 'Small size, label quality and collective overfitting by the community are the three standard criticisms. MoleculeNet is full of classification tasks — Tox21, HIV, BACE and BBBP among them.',
    },
    {
      kind: 'explain',
      title: 'Three ways to split',
      body: String.raw`- **Random split.** Shuffle, take 20% out. Fine if future compounds will be drawn from the same distribution — which, in medicinal chemistry, they never are.
- **Scaffold split.** Group compounds by their Bemis–Murcko scaffold (the ring systems plus the linkers joining them, with side chains stripped) and keep whole scaffold groups together. Now the test compounds have no close analogues in training, which is the situation when you move to a new chemotype.
- **Time split.** Train on everything measured before a date, test on everything after. Sheridan (JCIM 2013) compared splits on large in-house Merck datasets and found that time-split cross-validation gave estimates much closer to true prospective performance than random splits, which were consistently too optimistic.

The three are a ladder of pessimism. Which one is "right" depends entirely on how the model will be used.`,
    },
    {
      kind: 'widget',
      title: 'Watch the score collapse',
      body: 'Six chemical series (colours) in a descriptor space; the model is nearest-neighbour regression. Switch between the splits and watch the dashed lines — each test compound joined to its nearest training compound — stretch.',
      widget: {
        type: 'DrugSplitGap',
        props: { split: 'random', seed: 4 },
        caption: 'Under a **random** split every test compound has a near-twin in training, so prediction is near-interpolation. Under a **scaffold** split whole series are held out and the model must extrapolate to chemistry it has never seen; the error roughly triples. The **time** split sits in between, because later compounds include both new series and more members of old ones.',
      },
    },
    {
      kind: 'mcq',
      prompt: 'You want to estimate how well a model will do on the compounds your chemists will synthesise next quarter. Which split is the best proxy?',
      choices: [
        'Random split, because it uses the data most efficiently',
        'Time split, because it mimics predicting the future from the past',
        'Leave-one-out cross-validation, because it has the lowest bias',
        'No split is needed if the training error is low',
      ],
      answer: 1,
      why: 'Next quarter\'s compounds will be made after today and will drift into new chemistry, exactly what a time split simulates — the finding of Sheridan 2013. Random and leave-one-out splits both leave near-twins in training and are optimistic; training error is meaningless here.',
    },
    {
      kind: 'numeric',
      prompt: 'A dataset of 1,500 compounds contains 1,200 distinct Bemis–Murcko scaffolds. On average, how many compounds share a scaffold?',
      answer: 1.25,
      tolerance: 0.02,
      why: '1500 ÷ 1200 = 1.25. With scaffolds that singleton-heavy, a scaffold split is barely different from a random one — the split only bites when the data is clumped into big analogue series, which is exactly when it is most needed.',
    },
    {
      kind: 'explain',
      title: 'Leakage: how the test set gets into training',
      body: String.raw`**Leakage** is any way information from the test set reaches the model. It is the single most common reason a published model does not reproduce.

Chemistry-specific routes:
- **Duplicate structures** under different names, salts, tautomers or charge states. Standardise and deduplicate *before* splitting, not after.
- **Near-duplicates**: an analogue pair differing by one methyl is effectively the same measurement, split across train and test.
- **Stereoisomers and mixtures** of the same compound landing on opposite sides.

Generic routes, just as deadly:
- Scaling, imputing or **selecting features using the whole dataset** before splitting.
- Tuning hyperparameters, architectures or early stopping on the test set — the slowest, most respectable form of cheating.
- Reusing a public test set that your pretrained model already saw during pretraining.`,
    },
    {
      kind: 'truefalse',
      prompt: 'A scaffold split guarantees that no test compound is highly similar to any training compound.',
      answer: false,
      why: 'Bemis–Murcko scaffolds are a crude equivalence class: replacing one ring, or opening it, produces a *different* scaffold but a molecule that can still be 0.8 Tanimoto to its parent. Always check the actual nearest-neighbour similarity distribution between test and training sets rather than trusting the label "scaffold split".',
    },
    {
      kind: 'explain',
      title: 'Benchmarks that reward memorisation',
      body: String.raw`Wallach and Heifets (JCIM 2018) showed something sharper than ordinary leakage. In widely used ligand-based classification benchmarks, actives are clustered among themselves and separated from decoys, so a model can score well simply by recognising which cluster a molecule belongs to — no structure–activity relationship required.

They quantified this with the **AVE bias** (asymmetric validation embedding): compare, for the test actives, how close they are to training actives versus training decoys, and likewise for test decoys. If each test class is systematically nearer its own training class, the benchmark is biased, and they showed that measured performance tracks that bias rather than the model. They also gave a procedure for removing biased compounds until the bias is near zero — at which point many reported accuracies collapse.

The lesson generalises: *a benchmark on which nearest-neighbour lookup does well is not testing generalisation.*`,
    },
    {
      kind: 'match',
      prompt: 'Match each concept to its description.',
      pairs: [
        ['Scaffold split', 'Whole Bemis–Murcko scaffold groups held out together'],
        ['Time split', 'Train on compounds measured before a cut-off date'],
        ['AVE bias', 'Test items sit closer to their own training class than to the other'],
        ['Applicability domain', 'The region of chemical space where predictions can be trusted'],
      ],
      why: 'The first two are design choices you make; AVE bias is a property of a dataset you should measure; the applicability domain is a property of a fitted model that you should report alongside every prediction.',
    },
    {
      kind: 'explain',
      title: 'Activity cliffs: the failure mode no split fixes',
      body: String.raw`An **activity cliff** is a pair of very similar molecules with very different activity — the methyl group that buys 100-fold potency, the fluorine that kills it. They are not noise; they are where the medicinal chemistry happens.

Every model built on the similarity principle is structurally unable to predict them: if two molecules have nearly identical fingerprints, the model must give nearly identical predictions. Van Tilborg et al. (JCIM 2022) assembled a cliff-focused benchmark (MoleculeACE) across 30 targets and found that performance on cliff compounds was substantially worse than overall performance, and that descriptor-based models such as SVMs and gradient boosting were often *better* on cliffs than the deep models that beat them on average.

So report two numbers: error overall, and error on the cliff pairs. A project is optimising within a series, which is to say it lives on the cliffs.`,
      widget: { type: 'SvgDiagram', props: { svg: cliffSvg }, caption: 'Two compounds 0.95 Tanimoto apart and 100-fold apart in potency. Averaged over a benchmark, a handful of cliffs barely dent the RMSE — which is why the headline metric hides them.' },
    },
    {
      kind: 'widget',
      title: 'Try a different dataset',
      body: 'Press **New dataset** a few times with each split selected. Note how variable the scaffold-split score is: when a single held-out series happens to be unusual, the error jumps.',
      widget: { type: 'DrugSplitGap', props: { split: 'scaffold', seed: 7 }, caption: 'This variability is why benchmark leaderboards require several seeds, and why a single-split comparison between two models is close to meaningless.' },
    },
    {
      kind: 'order',
      prompt: 'Order a leakage-safe evaluation protocol.',
      steps: [
        'Standardise structures: strip salts, normalise tautomers and charges, resolve stereochemistry',
        'Deduplicate, merging or discarding repeated measurements of the same compound',
        'Choose the split (scaffold or time) that matches how the model will be used, and fix it',
        'Fit scalers, feature selection and hyperparameters using only the training folds',
        'Evaluate once on the held-out set, over several seeds, reporting the spread',
        'Report performance separately on activity-cliff pairs and flag test compounds outside the applicability domain',
      ],
      why: 'Standardising and deduplicating must precede splitting, or duplicates straddle the boundary; every fitted quantity, scalers included, must see training data only; and the final report should separate the easy interpolation cases from the hard ones.',
    },
    {
      kind: 'fill',
      prompt: 'Holding out whole Bemis–Murcko groups is a ___ split; training on everything before a date is a ___ split. A pair of near-identical molecules with very different potency is an activity ___.',
      bank: ['scaffold', 'time', 'cliff', 'random', 'cluster'],
      answer: ['scaffold', 'time', 'cliff'],
      why: 'These three terms describe most of what goes wrong in molecular ML evaluation: optimistic splitting, ignoring the arrow of time, and the chemistry that similarity-based models cannot represent.',
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- The **split** usually matters more than the model. Random splits flatter; scaffold and time splits are closer to reality.
- **Sheridan 2013**: time-split cross-validation best predicts prospective performance.
- **MoleculeNet** and **TDC** give comparable benchmarks, with the caveats of small datasets, label noise and community overfitting.
- **Leakage** comes from duplicates, near-analogues, whole-dataset preprocessing and tuning on the test set. Standardise and deduplicate before splitting.
- **Wallach & Heifets 2018**: benchmarks with AVE bias reward memorising clusters; measure the bias before trusting the score.
- **Activity cliffs** break the similarity principle; report cliff performance separately, and state an **applicability domain** with every prediction.`,
    },
  ],
  references: [
    { authors: 'Wu, Z., Ramsundar, B., Feinberg, E. N., et al.', title: 'MoleculeNet: a benchmark for molecular machine learning', year: 2018, venue: 'Chem. Sci. 9, 513–530' },
    { authors: 'Huang, K., Fu, T., Gao, W., et al.', title: 'Therapeutics Data Commons: machine learning datasets and tasks for drug discovery and development', year: 2021, venue: 'Proc. NeurIPS Datasets and Benchmarks Track' },
    { authors: 'Sheridan, R. P.', title: 'Time-split cross-validation as a method for estimating the goodness of prospective prediction', year: 2013, venue: 'J. Chem. Inf. Model. 53, 783–790' },
    { authors: 'Wallach, I., Heifets, A.', title: 'Most ligand-based classification benchmarks reward memorization rather than generalization', year: 2018, venue: 'J. Chem. Inf. Model. 58, 916–932' },
    { authors: 'van Tilborg, D., Alenicheva, A., Grisoni, F.', title: 'Exposing the limitations of molecular machine learning with activity cliffs', year: 2022, venue: 'J. Chem. Inf. Model. 62, 5938–5951' },
  ],
} satisfies LessonContent;
