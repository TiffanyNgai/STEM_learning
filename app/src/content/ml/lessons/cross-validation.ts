import type { LessonContent } from '../../types';

// Animated 5-fold cross-validation: each row is one round; the orange block is that round's validation fold.
const K = 5;
const ERR = ['0.21', '0.18', '0.25', '0.19', '0.22'];
const BX = 52, BW = 34, BH = 22, GAP = 4, Y0 = 28;
const DUR = 10; // seconds per cycle
const kt = (i: number) => (i / (K + 1)).toFixed(3);
const appear = (i: number) => `<animate attributeName="opacity" values="0;0;1;1" keyTimes="0;${kt(i)};${(+kt(i) + 0.01).toFixed(3)};1" dur="${DUR}s" repeatCount="indefinite"/>`;
const ROWS = Array.from({ length: K }, (_, r) => {
  const y = Y0 + r * (BH + GAP);
  const blocks = Array.from({ length: K }, (_, c) =>
    `<rect x="${BX + c * (BW + 2)}" y="${y}" width="${BW}" height="${BH}" rx="3" fill="${c === r ? 'var(--c3)' : 'var(--c2)'}" fill-opacity="${c === r ? 0.9 : 0.45}"/>`).join('');
  return `<g opacity="0">${appear(r)}
<text x="${BX - 6}" y="${y + 15}" font-size="9" text-anchor="end" fill="var(--fg)">round ${r + 1}</text>${blocks}
<text x="${BX + K * (BW + 2) + 6}" y="${y + 15}" font-size="9" fill="var(--c3)">e${r + 1} = ${ERR[r]}</text></g>`;
}).join('\n');
const MEAN = (ERR.reduce((s, e) => s + +e, 0) / K).toFixed(3);
const KFOLD_SVG = `<svg viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg">
<text x="8" y="14" font-size="10" fill="var(--fg)">5-fold CV: every point is used for validation exactly once</text>
${ROWS}
<g opacity="0">${appear(K)}<text x="${BX}" y="${Y0 + K * (BH + GAP) + 18}" font-size="10" fill="var(--fg)">CV estimate = mean(e1…e5) = ${MEAN}</text></g>
<rect x="${BX}" y="184" width="12" height="9" fill="var(--c2)" fill-opacity="0.45"/><text x="${BX + 16}" y="192" font-size="9" fill="var(--muted)">train on these</text>
<rect x="${BX + 100}" y="184" width="12" height="9" fill="var(--c3)" fill-opacity="0.9"/><text x="${BX + 116}" y="192" font-size="9" fill="var(--muted)">validate on this</text>
</svg>`;

export default {
  cards: [
    {
      kind: 'explain',
      title: 'One split is not enough',
      body: String.raw`To choose a model or hyperparameter (polynomial degree, ridge $\lambda$, tree depth) we need an estimate of its **test error**, and the training error is useless for that (see [data splits](@ml/evaluation-data-splits)). The simplest fix is a single **validation set**. But:

- with little data, holding out 20–30% leaves less to train on;
- the estimate depends heavily on *which* points landed in validation, so it is noisy.

**Cross-validation (CV)** makes every point do double duty: each is used for validation once and for training the rest of the time.`,
    },
    {
      kind: 'widget',
      title: 'k-fold cross-validation',
      body: String.raw`Shuffle the data and cut it into $k$ equal **folds**. For each round $j=1,\dots,k$: train on the other $k-1$ folds, then compute the error $e_j$ on fold $j$. The CV estimate is the average
$$\mathrm{CV}=\frac1k\sum_{j=1}^k e_j.$$
With $n$ points and $k$ folds, each model is trained on $n(k-1)/k$ points. To compare $H$ hyperparameter settings you repeat this for each one, which costs $H\times k$ fits, then refit the winner on all the data.`,
      widget: { type: 'SvgDiagram', props: { svg: KFOLD_SVG }, caption: 'Errors are illustrative.' },
    },
    {
      kind: 'numeric',
      prompt: String.raw`You compare 20 values of $\lambda$ with 5-fold CV on $n=1000$ points. How many model fits does the search need, **not** counting the final refit of the winner?`,
      answer: 100,
      why: String.raw`$20$ settings $\times$ $5$ folds $=100$ fits, each on $800$ points. Counting the final refit on all $1000$ points makes it 101.`,
    },
    {
      kind: 'explain',
      title: 'How many folds?',
      body: String.raw`The choice of $k$ is itself a bias–variance trade-off **for the error estimate**:

- **Small $k$** (e.g. 2): each model sees only half the data, so it is worse than the final model, and CV is **pessimistically biased**.
- **$k=n$, leave-one-out (LOOCV):** nearly unbiased, since each model sees $n-1$ points. But the $n$ training sets are almost identical, so the errors are highly correlated and the estimate can have **high variance**. It also costs $n$ fits.
- **$k=5$ or $10$** is the usual compromise (ESL Sec. 7.10; Kohavi, 1995).

A subtle point: CV estimates the expected error of the *procedure* over training sets of that size, not the error of the one model you finally ship (Bates, Hastie & Tibshirani). Its standard error is useful too: the **one-standard-error rule** picks the simplest model whose CV error is within one SE of the best.`,
    },
    {
      kind: 'widget',
      title: 'Selecting the degree with held-out error',
      body: String.raw`Here the orange curve is the error on held-out **validation** points. Its minimum picks the degree. Press **New data** a few times: the curve, and sometimes the chosen degree, changes. That instability is why we average over folds (or repeat CV with different shuffles) rather than trusting one split.`,
      widget: { type: 'MlPolyFit', props: { n: 15, degree: 3, maxDegree: 12, noise: 0.25, heldOutLabel: 'validation', seed: 4 } },
    },
    {
      kind: 'explain',
      title: 'Searching hyperparameter space',
      body: String.raw`- **Grid search:** try every combination on a grid. Cost grows exponentially with the number of hyperparameters.
- **Random search:** sample combinations at random. Bergstra & Bengio (2012) showed it is usually more efficient, because typically only a few hyperparameters matter. With 9 trials, a $3\times3$ grid tries just 3 distinct values of the important one, while random search tries 9.
- **Bayesian optimization / successive halving:** model the score surface or kill bad runs early. These are useful when each fit is expensive.

Search over **log scales** for scale-like quantities such as $\lambda$ or the learning rate ($10^{-4},10^{-3},\dots$).`,
    },
    {
      kind: 'mcq',
      prompt: 'Why does random search often beat grid search with the same budget?',
      choices: [
        'Random numbers are less biased than evenly spaced ones',
        'When only a few hyperparameters matter, random search tries many more distinct values of each important one',
        'Random search is guaranteed to find the global optimum',
        'Grid search cannot be combined with cross-validation',
      ],
      answer: 1,
      why: String.raw`A grid with $m$ values per axis spends $m^d$ trials but only explores $m$ values of any single hyperparameter. Random trials project onto *distinct* values on every axis. Neither method has an optimality guarantee.`,
    },
    {
      kind: 'explain',
      title: 'A free lunch for linear smoothers',
      body: String.raw`For least squares (and ridge with a fixed $\lambda$), the predictions are $\hat{\mathbf y}=H\mathbf y$ for a **hat matrix** $H$. Then LOOCV needs only **one** fit:
$$\mathrm{CV}_{\text{LOO}}=\frac1n\sum_{i=1}^n\left(\frac{y_i-\hat y_i}{1-H_{ii}}\right)^2.$$
The leave-one-out residual is the ordinary residual inflated by $1/(1-H_{ii})$. The **leverage** $H_{ii}$ is large for unusual inputs, whose own $y_i$ pulls the fit towards itself. Replacing every $H_{ii}$ by the average $\operatorname{tr}(H)/n$ gives **generalized cross-validation** (GCV).`,
    },
    {
      kind: 'numeric',
      prompt: String.raw`In an OLS fit, a point has residual $y_i-\hat y_i=0.3$ and leverage $H_{ii}=0.4$. What is its leave-one-out residual?`,
      answer: 0.5,
      tolerance: 0.001,
      why: String.raw`$0.3/(1-0.4)=0.5$. Dividing by $H_{ii}$ instead of $1-H_{ii}$ gives 0.75. High-leverage points have LOO residuals much larger than their training residuals.`,
    },
    {
      kind: 'explain',
      title: 'The wrong way to cross-validate',
      body: String.raw`ESL (Sec. 7.10.2) gives a classic warning. Take $n=50$ samples with **random** class labels and 5000 predictors that are pure noise. Step 1: pick the 100 predictors most correlated with the labels, *using all 50 samples*. Step 2: cross-validate a classifier on those 100. CV reports a tiny error, but the true error is 50%.

The screening in step 1 already saw the validation labels. **Every** data-dependent step (feature selection, scaling, imputation, oversampling, PCA) must be redone **inside** each training fold.

Data structure also matters: put all records of one patient in the same fold (**grouped CV**), and for time series always validate on the *future* (**forward-chaining** splits).`,
    },
    {
      kind: 'multi',
      prompt: 'Which of these procedures leak validation information into training?',
      choices: [
        'Standardizing features with the mean and SD of the full dataset before running CV',
        'Several images of the same patient falling into both training and validation folds',
        'Random k-fold CV on daily stock data to evaluate a next-day forecaster',
        'Fitting the scaler on the training folds only and applying it to the validation fold',
        'Selecting the 20 most label-correlated genes on all samples, then running CV',
      ],
      answers: [0, 1, 2, 4],
      why: String.raw`Full-data scaling (mild) and full-data feature selection (severe) both use validation points; shared patients let the model recognise individuals instead of disease; random folds let a forecaster train on days after the ones it is tested on. Fitting the scaler inside each fold is the correct pipeline.`,
    },
    {
      kind: 'explain',
      title: 'Nested cross-validation',
      body: String.raw`If you tune hyperparameters by CV and then **report the best CV score**, that number is optimistic: you picked the maximum of many noisy estimates (Cawley & Talbot, 2010; Varma & Simon, 2006). The selection itself overfits the validation folds.

**Nested CV** separates the two jobs:
- **Inner loop** (within each outer training set): k-fold CV to choose hyperparameters.
- **Outer loop:** evaluate the *whole tuning procedure* on an outer fold that the inner loop never saw.

The outer average estimates how well "tune by CV, then fit" will do on new data. With plenty of data, a single untouched **test set** does the same job.`,
    },
    {
      kind: 'truefalse',
      prompt: 'After trying 200 hyperparameter settings, the lowest 5-fold CV error among them is an unbiased estimate of the chosen model’s test error.',
      answer: false,
      why: String.raw`Each CV score is noisy, and the minimum of 200 noisy estimates is biased downward, so you partly selected for lucky folds. Use nested CV or a fresh test set to report performance.`,
    },
    {
      kind: 'order',
      prompt: 'Order the steps of nested cross-validation for one outer fold.',
      steps: [
        'Hold out outer fold j',
        'Split the remaining data into inner folds',
        'For each hyperparameter setting, compute its inner-CV error',
        'Refit the best setting on all non-held-out data',
        'Score that model on outer fold j, then repeat for the next outer fold',
      ],
      why: String.raw`The outer fold must be set aside **before** any tuning, so the score in the last step reflects the full procedure, including the selection. Averaging the outer scores gives the performance estimate.`,
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- k-fold CV: train on $k-1$ folds, validate on the remaining fold, rotate, average. $k=5$ or $10$ is a good default.
- Small $k$ is pessimistic; LOOCV is nearly unbiased but noisy and expensive (except for linear smoothers: $(y_i-\hat y_i)/(1-H_{ii})$).
- Prefer random search over grids; search scale-like hyperparameters on a log scale.
- Every data-dependent preprocessing step belongs **inside** the folds; respect groups and time order.
- The best CV score after tuning is optimistic. Report nested-CV or test-set error.`,
    },
  ],
  references: [
    { authors: 'T. Hastie, R. Tibshirani & J. Friedman', title: 'The Elements of Statistical Learning', year: 2009, venue: '2nd ed., Springer', detail: 'Sec. 7.10 (cross-validation, incl. 7.10.2 “The wrong and right way to do cross-validation”)', url: 'https://hastie.su.domains/ElemStatLearn/' },
    { authors: 'M. Stone', title: 'Cross-Validatory Choice and Assessment of Statistical Predictions', year: 1974, venue: 'Journal of the Royal Statistical Society, Series B 36(2), 111–147' },
    { authors: 'J. Bergstra & Y. Bengio', title: 'Random Search for Hyper-Parameter Optimization', year: 2012, venue: 'Journal of Machine Learning Research 13, 281–305' },
    { authors: 'G. C. Cawley & N. L. C. Talbot', title: 'On Over-fitting in Model Selection and Subsequent Selection Bias in Performance Evaluation', year: 2010, venue: 'Journal of Machine Learning Research 11, 2079–2107' },
    { authors: 'S. Bates, T. Hastie & R. Tibshirani', title: 'Cross-validation: what does it estimate and how well does it do it?', year: 2024, venue: 'Journal of the American Statistical Association 119(546), 1434–1445' },
  ],
} satisfies LessonContent;
