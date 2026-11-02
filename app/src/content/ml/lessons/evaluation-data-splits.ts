import type { LessonContent } from '../../types';

// Train / validation / test split and who is allowed to look at what.
const SPLIT_SVG = `<svg viewBox="0 0 320 150" xmlns="http://www.w3.org/2000/svg">
<defs><marker id="eds-a" viewBox="0 0 6 6" refX="5" refY="3" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0L6,3L0,6z" fill="var(--fg)"/></marker></defs>
<text x="10" y="14" font-size="10" fill="var(--muted)">Full labelled dataset (shuffled, or split by time / group)</text>
<rect x="10" y="22" width="180" height="28" fill="var(--c2)" opacity="0.35" stroke="var(--c2)"/>
<rect x="190" y="22" width="60" height="28" fill="var(--c3)" opacity="0.35" stroke="var(--c3)"/>
<rect x="250" y="22" width="60" height="28" fill="var(--c5)" opacity="0.35" stroke="var(--c5)"/>
<text x="100" y="40" font-size="11" text-anchor="middle" fill="var(--fg)">train 60%</text>
<text x="220" y="40" font-size="11" text-anchor="middle" fill="var(--fg)">val 20%</text>
<text x="280" y="40" font-size="11" text-anchor="middle" fill="var(--fg)">test 20%</text>
<text x="100" y="72" font-size="9.5" text-anchor="middle" fill="var(--c2)">fit parameters θ</text>
<text x="100" y="84" font-size="9.5" text-anchor="middle" fill="var(--muted)">(used every step)</text>
<text x="220" y="72" font-size="9.5" text-anchor="middle" fill="var(--c3)">tune &amp;</text>
<text x="220" y="84" font-size="9.5" text-anchor="middle" fill="var(--c3)">select</text>
<text x="280" y="72" font-size="9.5" text-anchor="middle" fill="var(--c5)">final</text>
<text x="280" y="84" font-size="9.5" text-anchor="middle" fill="var(--c5)">score</text>
<rect x="252" y="24" width="56" height="24" fill="none" stroke="var(--c5)" stroke-width="2" stroke-dasharray="4 3"><animate attributeName="stroke-dashoffset" values="0;14" dur="1.2s" repeatCount="indefinite"/></rect>
<path d="M40,118 L290,118" stroke="var(--fg)" stroke-width="1" marker-end="url(#eds-a)"/>
<text x="40" y="112" font-size="9" fill="var(--muted)">development time</text>
<circle cx="60" cy="118" r="5" fill="var(--c2)"><animate attributeName="cx" values="50;180;50" dur="5s" repeatCount="indefinite"/></circle>
<circle cx="200" cy="118" r="5" fill="var(--c3)"><animate attributeName="cx" values="190;250;190" dur="5s" repeatCount="indefinite"/></circle>
<circle cx="285" cy="118" r="6" fill="var(--c5)"><animate attributeName="opacity" values="0;0;1;0" keyTimes="0;0.8;0.9;1" dur="5s" repeatCount="indefinite"/></circle>
<text x="285" y="140" font-size="9" text-anchor="middle" fill="var(--c5)">open once</text>
<text x="115" y="140" font-size="9" text-anchor="middle" fill="var(--muted)">train ↔ validate, many rounds</text>
</svg>`;

export default {
  cards: [
    {
      kind: 'explain',
      title: 'Don’t grade your own homework',
      body: String.raw`Imagine a model that detects pneumonia on chest X-rays with 99% accuracy in the lab, then does far worse at a new hospital. What went wrong? Often the evaluation, not the model: the same patients appeared in training and testing, or the model picked up a scanner label instead of the disease.

From [ERM](@ml/empirical-risk-minimization) we know training error is **optimistic**. An honest estimate of performance on new data needs data the model and its developers **never used to make decisions**. This lesson covers how to split data, how evaluation gets contaminated, and which numbers to report.`,
    },
    {
      kind: 'explain',
      title: 'Three splits, three jobs',
      body: String.raw`- **Training set**: the optimizer fits the parameters $\theta$ here.
- **Validation set** (or "dev set"): compare models and tune **hyperparameters**. These are settings fixed before training: polynomial degree, learning rate, network width, when to stop.
- **Test set**: one final, unbiased estimate of performance, computed **once**, after all choices are made.

Typical splits are 60/20/20 or 80/10/10. With little data, [cross-validation](@ml/cross-validation) rotates the validation role across folds. Split **before** looking at the data. Rows must be independent across splits: keep each patient, user or time period in a single split.`,
      widget: { type: 'SvgDiagram', props: { svg: SPLIT_SVG } },
    },
    {
      kind: 'widget',
      title: 'Choosing complexity on held-out data',
      body: String.raw`Ten training points (blue) and held-out **validation** points (orange) from the same distribution. For each polynomial degree, the bottom panel shows training and validation error.

Pick the degree with the **lowest validation error**. Notice that training error alone would always pick the largest degree. Press **New data**. The best degree moves around a bit, so a single small validation set is itself noisy.`,
      widget: { type: 'MlPolyFit', props: { n: 10, degree: 3, maxDegree: 9, heldOutLabel: 'validation', seed: 10 } },
    },
    {
      kind: 'mcq',
      prompt: 'You must choose the polynomial degree (a hyperparameter). Which data should drive that choice?',
      choices: [
        'The training set: pick the degree with the lowest training error',
        'The test set: pick the degree with the best test score',
        'The validation set',
        'All the data pooled together, so the estimate is as precise as possible',
      ],
      answer: 2,
      why: 'Training error always favours the most complex model. Choosing with the test set makes the test score optimistic, because it was used to select. Pooling everything leaves no honest evaluation. Validation data exist for exactly this job.',
    },
    {
      kind: 'explain',
      title: 'Peeking at the test set',
      body: String.raw`Every decision made by looking at a dataset **adapts** to its noise. Choose the best of many models by test score, and that score is the maximum of many noisy numbers. It is biased upward (the "winner's curse").

**Example.** Take 100 classifiers that each guess at random, and a balanced test set of 100 examples. Each one's accuracy is roughly $50\%\pm5\%$ (binomial standard deviation $\sqrt{100\cdot0.5\cdot0.5}=5$ correct answers). The best of the 100 typically scores **about 62–63%**, though none of them has learned anything.

Public benchmarks reused by thousands of papers face the same risk, which is why fresh test sets matter. For the statistics of selecting among many comparisons, see [multiple testing](@stats/multiple-testing).`,
    },
    {
      kind: 'truefalse',
      prompt: 'If you try many hyperparameter settings and keep the one with the highest **test** accuracy, that accuracy is an unbiased estimate of how the model will perform on new data.',
      answer: false,
      why: 'The test set was used to select, so the reported number is the maximum of many noisy estimates and is biased upward. Select on validation data. Report the test score of the single final choice.',
    },
    {
      kind: 'explain',
      title: 'Leakage: when the test set isn’t really unseen',
      body: String.raw`**Data leakage** means information from outside the training data (often from the test set or from the label itself) gets into training. Common forms:
- **Preprocessing on all data**: computing normalization means, imputation values or feature selection on the full dataset before splitting. Fit these on the training split only, then apply them to the others.
- **Duplicates or groups across splits**: near-identical images, or several scans of one patient in both train and test. Use **group splits**.
- **Time travel**: randomly shuffling a time series lets the model train on the future. Use **temporal splits** (train on the past, test on the later period).
- **Target leakage**: a feature that is only known *after* the outcome, e.g. "antibiotics prescribed" when predicting infection.`,
    },
    {
      kind: 'multi',
      prompt: 'Which of these cause leakage?',
      choices: [
        'Standardizing every feature using the mean and SD of the full dataset, then splitting into train and test',
        'Randomly shuffling daily sales data before splitting, then evaluating next-month forecasts',
        'Several X-rays of the same patient landing in both the training and test sets',
        'Choosing the learning rate by comparing validation-set loss',
        'Fitting the standardization on the training set only and applying it unchanged to the test set',
      ],
      answers: [0, 1, 2],
      why: 'The first three let test-set information into training: global statistics, future days, and patient-specific features the model can memorise. Tuning on validation data is the intended workflow. Fitting preprocessing on training data only is the correct fix for the first item.',
    },
    {
      kind: 'explain',
      title: 'The confusion matrix and its metrics',
      body: String.raw`For a binary classifier, count the four outcomes on the test set: **TP** (true positive), **FP** (false positive), **FN** (false negative), **TN** (true negative).
- **Accuracy** $=\frac{TP+TN}{\text{all}}$
- **Precision** $=\frac{TP}{TP+FP}$: of the cases flagged positive, how many really are.
- **Recall** (sensitivity, TPR) $=\frac{TP}{TP+FN}$: of the real positives, how many were caught.
- **False-positive rate** (FPR) $=\frac{FP}{FP+TN}$. **F1** $=\frac{2\,PR}{P+R}$, the harmonic mean of precision and recall.

**Accuracy paradox.** If 1% of transactions are fraud, the model "never fraud" scores 99% accuracy and 0% recall. With imbalanced classes, always report precision and recall (or similar metrics), not accuracy alone.`,
    },
    {
      kind: 'numeric',
      prompt: String.raw`A screening model on 1000 cases gives $TP=40$, $FP=10$, $FN=20$, $TN=930$. What is its **F1 score**? (3 decimals)`,
      answer: 0.727,
      tolerance: 0.003,
      why: String.raw`Precision $=40/50=0.8$ and recall $=40/60\approx0.667$, so $F1=\frac{2\cdot0.8\cdot0.667}{0.8+0.667}\approx0.727$. Shortcut: $F1=\frac{2TP}{2TP+FP+FN}=80/110$. Accuracy is $970/1000=97\%$, which looks far rosier.`,
    },
    {
      kind: 'match',
      prompt: 'Match each metric to the question it answers.',
      pairs: [
        ['Precision', 'When the model says "positive", how often is it right?'],
        ['Recall (TPR)', 'What fraction of actual positives does the model catch?'],
        ['False-positive rate', 'What fraction of actual negatives get wrongly flagged?'],
        ['Accuracy', 'What fraction of all predictions are correct?'],
      ],
      why: 'Precision conditions on the prediction (TP / predicted positives). Recall and FPR condition on the true class (TP / actual positives, FP / actual negatives). Accuracy pools everything, which hides failures on a rare class.',
    },
    {
      kind: 'widget',
      title: 'Thresholds and the ROC curve',
      body: String.raw`Most classifiers output a **score**, and you choose a **threshold** above which to say "positive". Raising it gives fewer false positives and more misses. The **ROC curve** plots TPR against FPR for every threshold. Its area, **AUC**, equals the probability that a random positive is scored above a random negative (0.5 = random ranking, 1 = perfect).

Drag the threshold (or press Play) and watch the orange point move along the curve. Then shrink the score gap $d$. When the two classes overlap more, the curve sags toward the diagonal.`,
      widget: { type: 'MlThresholdROC', props: { separation: 1.5, threshold: 0.75, showPrevalence: true } },
    },
    {
      kind: 'mcq',
      prompt: 'A fraud model has ROC-AUC = 0.80. Which statement is correct?',
      choices: [
        'The model is 80% accurate at its default threshold',
        'When the model flags a transaction, it is fraud 80% of the time',
        'The model catches 80% of fraud cases',
        'A randomly chosen fraud case gets a higher score than a randomly chosen legitimate case 80% of the time',
      ],
      answer: 3,
      why: 'AUC is a ranking measure that summarizes all thresholds at once (ties count as half). Accuracy, precision and recall each refer to one specific threshold, and precision also depends on how common fraud is. Try the prevalence slider: precision changes but the ROC curve does not.',
    },
    {
      kind: 'order',
      prompt: 'Put an honest model-development workflow in order.',
      steps: [
        'Split the data (by group or time if needed) and lock the test set away',
        'Fit preprocessing and candidate models on the training set',
        'Compare candidates and tune hyperparameters on the validation set',
        'Retrain the chosen configuration (optionally on train + validation)',
        'Evaluate once on the test set and report that number',
      ],
      why: 'The split comes first so nothing downstream can see the test data. Preprocessing is fit only on training data to avoid leakage, and validation drives selection. The test set is used exactly once, at the end. If you then go back and change the model, that test set is no longer unbiased.',
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- **Train** fits parameters, **validation** selects models and hyperparameters, **test** gives one final unbiased estimate.
- Any choice made by looking at a dataset biases that dataset's score. Use the test set once.
- **Leakage** (global preprocessing, duplicates or groups across splits, shuffled time series, features known only after the outcome) inflates scores. Split by group or time when needed.
- Accuracy can mislead with imbalanced classes. Use precision, recall, F1, and threshold-free ROC-AUC. Precision depends on prevalence, but ROC does not.
- Next steps: [cross-validation](@ml/cross-validation) and [calibration](@ml/calibration-uncertainty).`,
    },
  ],
  references: [
    { authors: 'T. Hastie, R. Tibshirani & J. Friedman', title: 'The Elements of Statistical Learning', year: 2009, venue: '2nd ed., Springer', detail: 'Ch. 7 (esp. 7.2, 7.10)', url: 'https://hastie.su.domains/ElemStatLearn/' },
    { authors: 'T. Fawcett', title: 'An introduction to ROC analysis', year: 2006, venue: 'Pattern Recognition Letters 27(8), 861–874' },
    { authors: 'J. A. Hanley & B. J. McNeil', title: 'The meaning and use of the area under a receiver operating characteristic (ROC) curve', year: 1982, venue: 'Radiology 143(1), 29–36' },
    { authors: 'S. Kaufman, S. Rosset, C. Perlich & O. Stitelman', title: 'Leakage in data mining: Formulation, detection, and avoidance', year: 2012, venue: 'ACM Transactions on Knowledge Discovery from Data 6(4)' },
    { authors: 'T. Saito & M. Rehmsmeier', title: 'The precision-recall plot is more informative than the ROC plot when evaluating binary classifiers on imbalanced datasets', year: 2015, venue: 'PLoS ONE 10(3), e0118432' },
  ],
} satisfies LessonContent;
