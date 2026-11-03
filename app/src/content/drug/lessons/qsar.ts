import type { LessonContent } from '../../types';

// Applicability domain: training compounds in a 2D descriptor space, one query inside and one far outside.
const train: [number, number][] = [
  [92, 88], [110, 72], [126, 96], [104, 110], [140, 80], [150, 108], [120, 126], [96, 132],
  [136, 140], [160, 92], [170, 124], [84, 108], [150, 66], [128, 112], [114, 92], [158, 140],
];
const adSvg = `<svg viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg">
<text x="10" y="14" font-size="10" font-weight="700" fill="var(--fg)">Applicability domain in descriptor space</text>
<line x1="30" y1="182" x2="310" y2="182" stroke="var(--muted)"/><line x1="30" y1="182" x2="30" y2="24" stroke="var(--muted)"/>
<text x="300" y="195" font-size="9" fill="var(--muted)" text-anchor="end">descriptor 1 (e.g. logP)</text>
<text x="34" y="32" font-size="9" fill="var(--muted)">descriptor 2 (e.g. TPSA)</text>
<ellipse cx="127" cy="105" rx="70" ry="54" fill="var(--c2)" fill-opacity="0.12" stroke="var(--c2)" stroke-dasharray="5 3"/>
<text x="127" y="172" font-size="9" fill="var(--c2)" text-anchor="middle">domain of the training set</text>
${train.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="4" fill="var(--c2)"/>`).join('')}
<circle cx="132" cy="100" r="5.5" fill="var(--c4)" stroke="var(--fg)"/>
<text x="140" y="96" font-size="9" fill="var(--fg)">query A: trust</text>
<circle cx="270" cy="50" r="5.5" fill="var(--c5)" stroke="var(--fg)">
<animate attributeName="r" values="5.5;8;5.5" dur="1.6s" repeatCount="indefinite"/></circle>
<text x="262" y="72" font-size="9" fill="var(--c5)" text-anchor="middle">query B: extrapolation</text>
<text x="262" y="83" font-size="9" fill="var(--c5)" text-anchor="middle">— flag, do not trust</text>
</svg>`;

export default {
  cards: [
    {
      kind: 'explain',
      title: 'Turning structure into a number',
      body: String.raw`A medicinal chemist has made 30 analogues of a hit and measured each one's potency. Which compound should be made next?

**QSAR** (quantitative structure–activity relationship) answers with a model:

$$\text{activity} \approx f(\text{descriptors of the molecule})$$

**Descriptors** are numbers that summarise a structure, such as logP or polar surface area ([molecular descriptors](@drug/molecular-descriptors)). The model $f$ is fitted to compounds already tested, then used to *predict* compounds not yet made. This saves synthesis effort, which is the expensive step.`,
    },
    {
      kind: 'recall',
      title: 'Linear regression (from Statistics)',
      points: [
        'A linear model predicts $y \\approx b_0 + b_1x_1 + \\dots + b_px_p$.',
        'Least squares picks the coefficients that minimise the sum of squared residuals $\\sum_i (y_i - \\hat y_i)^2$.',
        '$R^2 = 1 - SS_{res}/SS_{tot}$ is the fraction of the variance in $y$ that the fit explains, *on the data used to fit it*.',
        'More parameters never lower the training $R^2$, which is why training fit alone is misleading.',
      ],
      link: 'stats/linear-regression',
    },
    {
      kind: 'explain',
      title: 'Hansch analysis (1964)',
      body: String.raw`Hansch and Fujita proposed that a substituent X changes biological activity through a few physical effects that add up:

$$\log\frac{1}{C} = a\,\pi + b\,\sigma + c$$

- $C$: the molar concentration giving a fixed biological effect (e.g. 50 % inhibition). Using $\log(1/C)$ means **bigger = more potent**.
- $\pi = \log P_X - \log P_H$: the substituent's **hydrophobicity**, its contribution to the octanol–water partition coefficient $\log P$.
- $\sigma$: the **Hammett constant**, the substituent's electron-withdrawing ($\sigma>0$) or donating ($\sigma<0$) power.
- $a, b, c$: fitted by least squares over a series of analogues.

Steric terms (e.g. Taft $E_s$) can be added. A squared term, $-a'(\log P)^2$, captures the common finding that potency peaks at an *optimal* lipophilicity.`,
    },
    {
      kind: 'numeric',
      prompt: String.raw`A (hypothetical) Hansch equation for a benzene series is $\log(1/C) = 0.90\,\pi + 1.20\,\sigma + 4.00$. For a *para*-chloro analogue, $\pi = 0.71$ and $\sigma_p = 0.23$. What is the predicted $\log(1/C)$?`,
      answer: 4.915,
      tolerance: 0.02,
      why: String.raw`$0.90\times0.71 + 1.20\times0.23 + 4.00 = 0.639 + 0.276 + 4.00 \approx 4.92$. Chlorine is both hydrophobic ($\pi>0$) and electron-withdrawing ($\sigma>0$), so with both coefficients positive it raises predicted potency by almost one log unit over H ($\pi=\sigma=0$, giving 4.00).`,
    },
    {
      kind: 'widget',
      title: 'Small data, flexible models',
      body: 'Think of x as the substituent constant π (rescaled) and y as log(1/C). The data come from a straight line plus assay noise. Degree k = 1 is a one-descriptor Hansch model. Raise k and watch the training MSE fall while the curve starts chasing the noise.',
      widget: {
        type: 'MlLeastSquaresFit',
        props: { model: 'poly', k: 1, kMax: 9, truth: 'line', n: 10, noise: 0.25, seed: 4, showTruth: true },
        caption: 'Classic QSAR sets have tens of compounds. With 10 points, a degree-9 polynomial fits the training data perfectly and predicts new compounds badly. A good training fit says little about predictive power.',
      },
    },
    {
      kind: 'mcq',
      prompt: String.raw`Using the same hypothetical equation $\log(1/C) = 0.90\,\pi + 1.20\,\sigma + 4.00$, which *para* substituent is predicted to be **most** potent? (H: $\pi=0,\ \sigma=0$; CH₃: $\pi=0.56,\ \sigma=-0.17$; Cl: $\pi=0.71,\ \sigma=0.23$; OCH₃: $\pi=-0.02,\ \sigma=-0.27$.)`,
      choices: ['H', 'CH₃', 'Cl', 'OCH₃'],
      answer: 2,
      why: String.raw`Predictions: H 4.00, CH₃ $0.504-0.204+4 = 4.30$, Cl 4.92, OCH₃ $-0.018-0.324+4 \approx 3.66$. Methyl is hydrophobic too, but it is electron-*donating* ($\sigma<0$), which this equation penalises, so Cl wins.`,
    },
    {
      kind: 'explain',
      title: 'From Hansch to machine learning',
      body: String.raw`Modern QSAR keeps the same idea but scales it up (Cherkasov et al. 2014):

- **Inputs**: hundreds of computed descriptors or a fingerprint with thousands of bits, instead of two hand-picked constants.
- **Models**: partial least squares, [random forests](@ml/random-forests), support vector machines, gradient boosting and graph neural networks.
- **Outputs**: a continuous value (regression, e.g. pIC50) or a class (classification, e.g. active/inactive, hERG blocker/non-blocker).

More flexible models need **more data** and **stricter validation**. With many descriptors and few compounds, some descriptor will correlate with activity purely by chance.`,
    },
    {
      kind: 'explain',
      title: 'Validation: q² and the external test set',
      body: String.raw`A model is useful only if it predicts compounds it has **not** seen.

- **Cross-validation** ([k-fold CV](@ml/cross-validation)): leave out part of the data, refit, and predict the left-out compounds. Summing the squared errors of these held-out predictions gives **PRESS**, and
$$q^2 = 1 - \frac{\text{PRESS}}{SS_{tot}}.$$
- **External test set**: compounds set aside *before* any modelling, never used for descriptor selection or tuning.
- **Y-randomisation**: shuffle the activities and refit. If the shuffled models score nearly as well, the original fit was chance.

Golbraikh and Tropsha (2002) warned that a high leave-one-out $q^2$ alone does not prove predictive power (see also Tropsha 2010).`,
    },
    {
      kind: 'numeric',
      prompt: String.raw`In 5-fold cross-validation of a QSAR model, the held-out predictions give PRESS $= 2.0$ (log units²). The total sum of squares of the activities about their mean is $SS_{tot} = 10.0$. What is $q^2$?`,
      answer: 0.8,
      tolerance: 0.005,
      why: String.raw`$q^2 = 1 - 2.0/10.0 = 0.80$. It has the same form as $R^2$, but the residuals come from predictions on compounds that were left out of each fit, so it estimates predictive rather than descriptive performance.`,
    },
    {
      kind: 'widget',
      title: 'A best-practice QSAR workflow',
      widget: {
        type: 'StepReveal',
        props: {
          steps: [
            '**Curate the data.** Standardise structures (salts, charges, tautomers), remove duplicates, and keep one assay type and one endpoint (do not mix $K_i$ with IC50 from different assays).',
            '**Split off an external test set** before you look at descriptors or models.',
            '**Compute descriptors** and select features using the training set only.',
            '**Fit and tune** the model with cross-validation on the training set.',
            '**Check against chance** with y-randomisation.',
            '**Test once** on the external set and report its statistics.',
            '**Define the applicability domain** and attach it to every prediction.',
          ],
          notes: [
            'Garbage in, garbage out: errors in structures and activities cap the accuracy any model can reach.',
            'Splitting randomly within one congeneric series gives optimistic results; time- or scaffold-based splits are more realistic.',
            'Selecting descriptors on all the data and then cross-validating leaks test information into training.',
            '',
            '',
            'If you go back and tune after looking at the test set, it is no longer external.',
            'This follows the OECD principles for QSAR validation, which require a defined applicability domain.',
          ],
        },
      },
    },
    {
      kind: 'order',
      prompt: 'Put the steps of a sound QSAR study in order.',
      steps: [
        'Curate structures and activity data',
        'Set aside an external test set',
        'Compute and select descriptors on the training set',
        'Fit and tune the model by cross-validation',
        'Evaluate once on the external test set',
        'Predict new compounds inside the applicability domain',
      ],
      why: 'The external set must be split off before any descriptor selection or tuning, otherwise information leaks from it into the model. Prediction comes last and only for compounds that resemble the training set.',
    },
    {
      kind: 'explain',
      title: 'The applicability domain',
      body: String.raw`A QSAR model **interpolates**. It is reliable only for molecules that resemble its training set, which is its **applicability domain (AD)**. Common checks:

- **Similarity**: Tanimoto similarity of the query to its nearest training compounds.
- **Descriptor ranges**: is each descriptor inside the range seen in training?
- **Leverage** for linear models: $h = \mathbf{x}^\top(X^\top X)^{-1}\mathbf{x}$ measures how far a query lies from the centre of the training data. Values above $h^* = 3(p+1)/n$ ($p$ descriptors, $n$ training compounds) are usually flagged.

Predictions outside the AD are **extrapolations** and should be labelled as such.`,
      widget: { type: 'SvgDiagram', props: { svg: adSvg }, caption: 'A query inside the cloud of training compounds is an interpolation. A query far away gets a number from the model, but nothing supports it.' },
    },
    {
      kind: 'multi',
      prompt: 'Which practices make a QSAR model’s reported performance **more trustworthy**?',
      choices: [
        'Scoring the model on an external test set that was never used for descriptor selection or tuning',
        'Y-randomisation showing that shuffled-activity models perform much worse',
        'Reporting only the training-set $R^2$ because it uses all the data',
        'Selecting the 10 best descriptors on the whole data set, then cross-validating',
        'Flagging predictions for compounds outside the applicability domain',
      ],
      answers: [0, 1, 4],
      why: 'An untouched external set, a y-randomisation check and an applicability domain all guard against over-optimism. Training $R^2$ measures fit, not prediction. Choosing descriptors on all compounds before cross-validating leaks the held-out activities into the model and inflates $q^2$.',
    },
    {
      kind: 'truefalse',
      prompt: String.raw`A QSAR model with training $R^2 = 0.95$ will predict the potency of a new chemical series accurately.`,
      answer: false,
      why: String.raw`Training $R^2$ can be pushed up by adding parameters (try degree 9 in the widget). And a new chemical series probably lies outside the applicability domain, so the prediction is an extrapolation. Only external validation on similar compounds supports a claim of predictive accuracy.`,
    },
    {
      kind: 'match',
      prompt: 'Match each QSAR term to its meaning.',
      pairs: [
        ['π (Hansch)', 'Substituent contribution to log P (hydrophobicity)'],
        ['σ (Hammett)', 'Substituent electron-withdrawing or donating power'],
        ['q²', 'R²-like statistic computed on cross-validated predictions'],
        ['Y-randomisation', 'Refitting on shuffled activities to test for chance correlation'],
        ['Applicability domain', 'Region of chemical space where predictions can be trusted'],
      ],
      why: 'π and σ are the classic Hansch descriptors. q² and y-randomisation are validation tools. The applicability domain limits where the model may be used.',
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- **QSAR** fits activity $\approx f(\text{descriptors})$ on tested compounds to predict untested ones.
- **Hansch analysis** (1964): $\log(1/C) = a\pi + b\sigma + c$, a linear regression on physical substituent constants. Modern QSAR uses many descriptors and ML models.
- Training fit is not predictivity. Use **cross-validation ($q^2$)**, an **untouched external test set** and **y-randomisation**.
- Every model has an **applicability domain**. Predictions far from the training data are extrapolations.`,
    },
  ],
  references: [
    { authors: 'Hansch, C., Fujita, T.', title: 'ρ-σ-π Analysis. A method for the correlation of biological activity and chemical structure', year: 1964, venue: 'J. Am. Chem. Soc. 86, 1616–1626' },
    { authors: 'Cherkasov, A., Muratov, E. N., Fourches, D., et al.', title: 'QSAR modeling: where have you been? Where are you going to?', year: 2014, venue: 'J. Med. Chem. 57, 4977–5010' },
    { authors: 'Golbraikh, A., Tropsha, A.', title: 'Beware of q²!', year: 2002, venue: 'J. Mol. Graph. Model. 20, 269–276' },
    { authors: 'Tropsha, A.', title: 'Best practices for QSAR model development, validation, and exploitation', year: 2010, venue: 'Mol. Inform. 29, 476–488' },
    { authors: 'Leach, A. R., Gillet, V. J.', title: 'An Introduction to Chemoinformatics', year: 2007, venue: 'Revised ed., Springer' },
  ],
} satisfies LessonContent;
