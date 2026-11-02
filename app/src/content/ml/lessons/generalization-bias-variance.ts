import type { LessonContent } from '../../types';

export default {
  cards: [
    {
      kind: 'explain',
      title: 'Fitting the data is not the goal',
      body: String.raw`A model is useful only if it predicts **new** data well. Below, polynomials of increasing degree are fitted to 10 noisy points (blue) from a sine curve. Slide the degree and watch the two error curves.

The **training** error (blue) only goes down. The **test** error on fresh points (orange) first falls, then shoots up once the curve starts chasing noise. Degree 0–1 **underfits**; degree 9 passes through every training point yet predicts terribly: it **overfits**.

This lesson explains *why* the test curve is U-shaped by splitting test error into three exact pieces.`,
      widget: { type: 'MlPolyFit', props: { n: 10, degree: 3, maxDegree: 9, noise: 0.25 } },
    },
    {
      kind: 'recall',
      title: 'Expectation & variance',
      points: [
        String.raw`$\mathbb E[X]$ is the long-run average of a random variable $X$; it is linear: $\mathbb E[aX+bY]=a\mathbb E[X]+b\mathbb E[Y]$.`,
        String.raw`$\operatorname{Var}(X)=\mathbb E\big[(X-\mathbb E X)^2\big]=\mathbb E[X^2]-(\mathbb E X)^2$.`,
        String.raw`If $X$ and $Y$ are independent, $\mathbb E[XY]=\mathbb E[X]\,\mathbb E[Y]$.`,
        String.raw`For any constant $c$: $\mathbb E[(X-c)^2]=(\mathbb E X-c)^2+\operatorname{Var}(X)$.`,
      ],
      link: 'stats/expectation-variance',
    },
    {
      kind: 'explain',
      title: 'The fitted model is a random variable',
      body: String.raw`Assume data come from $y=f(x)+\varepsilon$, where $f$ is the unknown true function and the noise $\varepsilon$ has mean $0$ and variance $\sigma^2$.

A training set $\mathcal D$ of $n$ points is **random**, so the model fitted to it, $\hat f_{\mathcal D}$, is random too: a different sample gives a different curve. Define the **average fit** $\bar f(x)=\mathbb E_{\mathcal D}[\hat f_{\mathcal D}(x)]$, the curve you would get by averaging over infinitely many training sets.

We ask: at a fixed input $x$, what is the **expected squared error** $\mathbb E\big[(y-\hat f_{\mathcal D}(x))^2\big]$ on a new $y$, averaging over both the training set and the new noise? This is the quantity [empirical risk minimization](@ml/empirical-risk-minimization) really cares about.`,
    },
    {
      kind: 'widget',
      title: 'Deriving the decomposition',
      body: 'Tap through the derivation. Only two facts are used: the new noise is independent of the training set, and the recall-card identity.',
      widget: {
        type: 'StepReveal',
        props: {
          steps: [
            String.raw`Write $\hat f=\hat f_{\mathcal D}(x)$ and $y=f(x)+\varepsilon$. Then $y-\hat f=\varepsilon+(f(x)-\hat f)$.`,
            String.raw`Square and take expectations: $\mathbb E[(y-\hat f)^2]=\mathbb E[\varepsilon^2]+2\,\mathbb E[\varepsilon\,(f(x)-\hat f)]+\mathbb E[(f(x)-\hat f)^2]$.`,
            String.raw`The new noise $\varepsilon$ is independent of $\mathcal D$ and has mean 0, so the middle term is $2\,\mathbb E[\varepsilon]\,\mathbb E[f(x)-\hat f]=0$. Also $\mathbb E[\varepsilon^2]=\sigma^2$.`,
            String.raw`Apply $\mathbb E[(X-c)^2]=(\mathbb EX-c)^2+\operatorname{Var}X$ with $X=\hat f$ and $c=f(x)$: $\ \mathbb E[(f(x)-\hat f)^2]=(\bar f(x)-f(x))^2+\operatorname{Var}(\hat f)$.`,
            String.raw`$$\mathbb E\big[(y-\hat f_{\mathcal D}(x))^2\big]=\underbrace{\sigma^2}_{\text{noise}}+\underbrace{\big(\bar f(x)-f(x)\big)^2}_{\text{bias}^2}+\underbrace{\mathbb E\big[(\hat f_{\mathcal D}(x)-\bar f(x))^2\big]}_{\text{variance}}$$`,
          ],
          notes: [
            'Split the error into noise plus model error.',
            'Expand the square.',
            'The cross term vanishes.',
            'Model error = squared bias + variance.',
            'An exact identity for squared loss. Average it over x to get the expected test MSE.',
          ],
        },
      },
    },
    {
      kind: 'numeric',
      prompt: String.raw`At some input $x$, a learning method has squared bias $0.04$ and variance $0.09$, and the noise variance is $\sigma^2=0.25$. What is the expected squared test error at $x$?`,
      answer: 0.38,
      tolerance: 0.001,
      why: String.raw`For squared loss the three terms simply add: $0.25+0.04+0.09=0.38$. A common slip is to add the **bias** ($0.2$) instead of the **squared** bias, giving $0.54$.`,
    },
    {
      kind: 'widget',
      title: 'See bias and variance directly',
      body: String.raw`Here 40 independent training sets (15 points each) are drawn from $\sin(\pi x)$ plus noise ($\sigma=0.3$), and each one is fitted by a degree-$k$ polynomial. Faint blue curves are the 40 fits; the bold orange curve is their **average** $\bar f$.

- Degree 0–1: the fits agree with each other (low **variance**) but their average misses the sine (high **bias**).
- Degree 3–5: the average hugs the truth and the spread is small, so this is the sweet spot.
- Degree 9–10: the average is still close to the truth (low bias) but individual fits flail (high variance).

The bottom panel adds the pieces up: the red total is the U-shaped test curve from the first card.`,
      widget: { type: 'MlBiasVariance', props: { k: 1, kMax: 10, n: 15, noise: 0.3, sets: 40 } },
    },
    {
      kind: 'mcq',
      prompt: String.raw`For polynomial least-squares fits on a fixed training-set size, what typically happens as the degree $k$ grows from 0 to 10?`,
      choices: [
        'Bias and variance both decrease',
        'Bias decreases, variance increases',
        'Bias increases, variance decreases',
        'Bias and variance both increase, and the noise term grows too',
      ],
      answer: 1,
      why: String.raw`A richer model can represent the truth better (lower bias) but is more sensitive to which noisy points it saw (higher variance). The noise $\sigma^2$ belongs to the data and does not depend on the model at all.`,
    },
    {
      kind: 'explain',
      title: 'Diagnosing under- and overfitting',
      body: String.raw`You never see bias and variance directly in practice: you have one training set. Compare **training** and **validation** error instead (see [data splits](@ml/evaluation-data-splits)):

- **Underfitting (high bias):** training error is high, and validation error is about as high. More data will not help much; use a richer model or better features.
- **Overfitting (high variance):** training error is low, but validation error is much higher. Use more data, [regularization](@ml/regularization), a simpler model, or averaging.

A **learning curve** plots both errors against training-set size $n$. Training error rises with $n$ (it is harder to fit more points), validation error falls, and the two meet near the noise floor plus the bias.`,
    },
    {
      kind: 'match',
      prompt: 'Match each observation to its most likely diagnosis or remedy.',
      pairs: [
        ['Train error 2%, validation error 25%', 'High variance: regularize or get more data'],
        ['Train error 24%, validation error 25%', 'High bias: use a more flexible model'],
        ['Both errors near the best achievable (noise) level', 'A good fit: stop tuning'],
        ['Validation error keeps falling as n grows, with a wide train–validation gap', 'More data is still paying off'],
      ],
      why: String.raw`A large **gap** between training and validation error signals variance; a high error **floor** with a small gap signals bias. Learning curves that are still converging say extra data will help.`,
    },
    {
      kind: 'truefalse',
      prompt: String.raw`With a flexible enough model and enough training data, the expected test error at $x$ can be pushed below the noise variance $\sigma^2$.`,
      answer: false,
      why: String.raw`$\sigma^2$ is the **irreducible error**: even the true $f$ makes squared error $\sigma^2$ on average, because the new $y$ contains fresh noise that no model can predict. Only bias and variance can be reduced.`,
    },
    {
      kind: 'explain',
      title: 'More data shrinks variance',
      body: String.raw`For ordinary least squares with $p$ features on a **fixed** set of $n$ inputs, the variance averaged over the training inputs is exactly
$$\frac1n\sum_{i=1}^n\operatorname{Var}\big(\hat f(x_i)\big)=\frac{\sigma^2\,p}{n}.$$
(The hat matrix $H$ that maps $\mathbf y$ to $\hat{\mathbf y}$ has trace $p$, and $\operatorname{Cov}(\hat{\mathbf y})=\sigma^2H$.)

So variance grows with the number of parameters and falls as $1/n$. Bias does not shrink with more data if the model class cannot represent $f$. That is why "how complex should my model be?" depends on how much data you have.`,
    },
    {
      kind: 'numeric',
      prompt: String.raw`OLS with $p=10$ features is fitted to $n=100$ points with noise variance $\sigma^2=0.25$. Using $\sigma^2p/n$, what is the average variance of the fitted values at the training inputs?`,
      answer: 0.025,
      tolerance: 0.0005,
      why: String.raw`$0.25\times10/100=0.025$. Doubling the data to $n=200$ would halve it to $0.0125$; doubling the features to $p=20$ would double it.`,
    },
    {
      kind: 'explain',
      title: 'Fine print',
      body: String.raw`- The decomposition is an **exact identity for squared loss**. For 0–1 classification loss there is no equally clean additive split; several competing definitions exist (e.g. Domingos, 2000).
- **Variance reduction by averaging:** averaging $B$ independent fits of variance $v$ gives variance $v/B$ with unchanged bias. Bagging and [random forests](@ml/random-forests) exploit this, but their fits are correlated, so the reduction is smaller.
- The **trade-off** (bias down, variance up as complexity grows) is a typical pattern, not a law. Very over-parameterized models can see test error fall again past the point where they interpolate the data: [double descent](@ml/double-descent). The identity still holds there; it is the variance that stops growing.`,
    },
    {
      kind: 'multi',
      prompt: 'Which of these mainly reduce **variance** (rather than bias)?',
      choices: [
        'Collecting more training data',
        'Averaging the predictions of models trained on bootstrap resamples (bagging)',
        'Adding an L2 penalty on the weights',
        'Switching from a linear model to a degree-5 polynomial',
        'Adding informative new features the model previously lacked',
      ],
      answers: [0, 1, 2],
      why: String.raw`More data and averaging both stabilize the fit; a penalty restricts how far weights can chase noise (at the cost of some bias). Making the model richer or adding informative features attacks **bias** and usually *raises* variance.`,
    },
    {
      kind: 'fill',
      prompt: String.raw`For squared loss, expected test error = ___ + squared ___ + ___. The first term is irreducible; the last one grows when the model is too ___.`,
      bank: ['noise', 'bias', 'variance', 'flexible', 'rigid', 'accuracy', 'margin'],
      answer: ['noise', 'bias', 'variance', 'flexible'],
      why: String.raw`$\mathbb E[(y-\hat f)^2]=\sigma^2+\text{bias}^2+\text{variance}$. Variance measures sensitivity to the particular training set, which is large for very flexible models; rigid models suffer from bias instead.`,
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- The fitted model $\hat f_{\mathcal D}$ is random because the training set is random.
- For squared loss, exactly: $\mathbb E[(y-\hat f(x))^2]=\sigma^2+(\bar f(x)-f(x))^2+\operatorname{Var}\hat f(x)$.
- Underfitting means high bias (both errors high); overfitting means high variance (big train–validation gap).
- Variance falls with more data (OLS: $\sigma^2p/n$), averaging and regularization; bias falls with richer models and better features.
- The U-shaped trade-off is typical but not universal. See [double descent](@ml/double-descent).`,
    },
  ],
  references: [
    { authors: 'T. Hastie, R. Tibshirani & J. Friedman', title: 'The Elements of Statistical Learning', year: 2009, venue: '2nd ed., Springer', detail: 'Sec. 2.9 and 7.2–7.3 (model complexity, bias–variance decomposition)', url: 'https://hastie.su.domains/ElemStatLearn/' },
    { authors: 'C. M. Bishop', title: 'Pattern Recognition and Machine Learning', year: 2006, venue: 'Springer', detail: 'Sec. 3.2 (the bias–variance decomposition)' },
    { authors: 'S. Geman, E. Bienenstock & R. Doursat', title: 'Neural Networks and the Bias/Variance Dilemma', year: 1992, venue: 'Neural Computation 4(1), 1–58' },
    { authors: 'M. Belkin, D. Hsu, S. Ma & S. Mandal', title: 'Reconciling modern machine-learning practice and the classical bias–variance trade-off', year: 2019, venue: 'PNAS 116(32), 15849–15854' },
  ],
} satisfies LessonContent;
