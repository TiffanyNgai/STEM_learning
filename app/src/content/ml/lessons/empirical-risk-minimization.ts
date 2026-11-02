import type { LessonContent } from '../../types';

export default {
  cards: [
    {
      kind: 'explain',
      title: 'The exam you never see',
      body: String.raw`Two students prepare from the same 20 practice questions. One memorises the 20 answers. The other learns the method behind them. Both score 100% on the practice set. Only the real exam, with new questions, shows the difference.

A learning algorithm is in the same position. It sees a finite **training set**, but it is judged on **new data** that it never sees during training. This lesson makes that precise. We define the score we want (the **true risk**), the score we can compute (the **empirical risk**), and explain why minimizing the second does not always minimize the first.`,
    },
    {
      kind: 'recall',
      title: 'Expectation in one minute',
      points: [
        String.raw`The **expectation** of $g(Z)$ is its probability-weighted average: $\mathbb E[g(Z)]=\sum_z g(z)\,p(z)$, or $\int g(z)\,p(z)\,dz$ for continuous $Z$.`,
        String.raw`**Linearity:** $\mathbb E[aX+bY]=a\,\mathbb E[X]+b\,\mathbb E[Y]$, always.`,
        String.raw`The **sample mean** of i.i.d. draws has the same expectation as one draw, and its variance shrinks like $1/n$.`,
        String.raw`**Law of large numbers:** the sample mean converges to $\mathbb E[g(Z)]$ as $n\to\infty$.`,
      ],
      link: 'stats/expectation-variance',
    },
    {
      kind: 'explain',
      title: 'True risk vs empirical risk',
      body: String.raw`Data pairs $(x,y)$ come from an unknown distribution $p(x,y)$. For a predictor $f$ and a loss $\ell$:

**True risk** (expected loss on a fresh example):
$$R(f)=\mathbb E_{(x,y)\sim p}\big[\ell(f(x),y)\big].$$

**Empirical risk** (average loss on the $n$ training examples):
$$\hat R_n(f)=\frac1n\sum_{i=1}^n\ell(f(x_i),y_i).$$

We can't compute $R$ because $p$ is unknown, but we can compute $\hat R_n$. For any **fixed** $f$ chosen before seeing the data, $\hat R_n(f)$ is a sample mean. So $\mathbb E[\hat R_n(f)]=R(f)$ (it is unbiased), and $\hat R_n(f)\to R(f)$ as $n$ grows.`,
    },
    {
      kind: 'numeric',
      prompt: String.raw`A classifier is scored with the **0–1 loss** ($\ell=1$ for a mistake, 0 otherwise). It makes 3 mistakes on 20 training examples. What is its empirical risk $\hat R_{20}$?`,
      answer: 0.15,
      tolerance: 0.001,
      why: String.raw`$\hat R_{20}=\frac1{20}(3\cdot1+17\cdot0)=0.15$. Under the 0–1 loss the empirical risk is just the training error rate. Its true risk (the error rate on new data) is unknown and is usually higher.`,
    },
    {
      kind: 'explain',
      title: 'Empirical risk minimization (ERM)',
      body: String.raw`First fix a **hypothesis class** $\mathcal H$: the set of predictors we are willing to consider. Examples: all straight lines, all polynomials of degree $\le d$, all networks with one given architecture.

**ERM** picks the member of $\mathcal H$ with the smallest training loss:
$$\hat f=\arg\min_{f\in\mathcal H}\hat R_n(f).$$

Least-squares regression, logistic regression and neural-network training are all ERM, differing only in $\mathcal H$ and $\ell$.

The choice of $\mathcal H$ matters a lot. If it is too small, nothing in it fits. If it is too large, something in it fits the training points *perfectly*, noise and all.`,
    },
    {
      kind: 'widget',
      title: 'ERM over richer and richer classes',
      body: String.raw`Ten noisy samples of a smooth curve (dashed). ERM over polynomials of degree $\le d$ uses squared loss. Blue dots are training data and hollow orange dots are fresh **test** data from the same distribution.

Slide the degree from 0 to 9 and watch the bottom panel. **Training** error keeps falling, but **test** error falls and then shoots up. Press **New data** a few times. The high-degree fits change wildly from sample to sample.`,
      widget: { type: 'MlPolyFit', props: { n: 10, degree: 1, maxDegree: 9 } },
    },
    {
      kind: 'mcq',
      prompt: String.raw`With 10 training points (all at distinct $x$), what happens to the **training** error of ERM as the polynomial degree goes from 0 up to 9?`,
      choices: [
        'It first falls and then rises, just like the test error',
        'It never increases, and at degree 9 it reaches zero (up to rounding)',
        'It stays roughly constant because the noise level is fixed',
        'It rises, because higher-degree polynomials are harder to fit',
      ],
      answer: 1,
      why: String.raw`The classes are **nested**: every degree-$d$ polynomial is also a degree-$(d{+}1)$ polynomial with a zero top coefficient. So the minimum training loss can't go up. A degree-9 polynomial has 10 coefficients and can pass through 10 points exactly. The U-shape belongs to the *test* error.`,
    },
    {
      kind: 'explain',
      title: 'Why the winner looks too good',
      body: String.raw`For a fixed $f$, training loss is an unbiased estimate of true risk. For the ERM **winner** $\hat f$ it is not: $\hat f$ was chosen *because* it happened to do well on these particular $n$ points, including their noise.

The derivation below shows that, on average, ERM's training loss is **at most** the best achievable risk in $\mathcal H$, and its true risk is **at least** that. The expected difference $\mathbb E[R(\hat f)-\hat R_n(\hat f)]\ge0$ is called the **generalization gap**. It tends to be larger when $\mathcal H$ is richer and when $n$ is smaller.`,
    },
    {
      kind: 'widget',
      title: 'ERM is optimistic on average',
      widget: {
        type: 'StepReveal',
        props: {
          steps: [
            String.raw`Let $f^\star=\arg\min_{f\in\mathcal H}R(f)$ be the best predictor in the class. It is fixed and does not depend on the sample.`,
            String.raw`$\hat f$ minimizes training loss, so on **every** sample: $\hat R_n(\hat f)\le\hat R_n(f^\star)$.`,
            String.raw`Take expectations over the random sample: $\mathbb E[\hat R_n(\hat f)]\le\mathbb E[\hat R_n(f^\star)]=R(f^\star)$, using unbiasedness for the fixed $f^\star$.`,
            String.raw`$f^\star$ has the lowest true risk in $\mathcal H$, so $R(f^\star)\le R(\hat f)$ for every sample. Hence $R(f^\star)\le\mathbb E[R(\hat f)]$.`,
            String.raw`Combine the two: $\ \mathbb E[\hat R_n(\hat f)]\ \le\ R(f^\star)\ \le\ \mathbb E[R(\hat f)]$. On average, training loss underestimates the true risk of what ERM returns.`,
          ],
          notes: ['', 'This is just the definition of argmin.', 'This is where "fixed in advance" matters.', '', 'Held-out data are needed for an honest estimate.'],
        },
      },
    },
    {
      kind: 'truefalse',
      prompt: String.raw`For a predictor chosen **before** looking at the training data, the training loss $\hat R_n(f)$ is an unbiased estimate of its true risk $R(f)$.`,
      answer: true,
      why: String.raw`If $f$ does not depend on the sample, $\hat R_n(f)$ is an average of $n$ i.i.d. copies of $\ell(f(x),y)$, so its expectation is $R(f)$. The bias appears only when $f$ is *selected using* the same data, as ERM does.`,
    },
    {
      kind: 'explain',
      title: 'Two sources of error',
      body: String.raw`Let $R^\ast$ be the lowest risk any function could achieve (the **Bayes risk**; it is above zero whenever labels are noisy). The excess risk of ERM splits into two parts:
$$R(\hat f)-R^\ast=\underbrace{R(\hat f)-R(f^\star)}_{\text{estimation error}}+\underbrace{R(f^\star)-R^\ast}_{\text{approximation error}}.$$

- **Approximation error** comes from $\mathcal H$ being too limited. It shrinks as $\mathcal H$ grows.
- **Estimation error** comes from finite $n$: we pick $\hat f$ instead of $f^\star$. It usually grows with $\mathcal H$ and shrinks with $n$.

This trade-off is closely related to the [bias–variance trade-off](@ml/generalization-bias-variance). Its precise form is the subject of [PAC learning](@ml/pac-learning-vc).`,
    },
    {
      kind: 'match',
      prompt: 'Match each term to its meaning.',
      pairs: [
        [String.raw`True risk $R(f)$`, 'Expected loss on a fresh example from the data distribution'],
        [String.raw`Empirical risk $\hat R_n(f)$`, 'Average loss over the training examples'],
        [String.raw`Hypothesis class $\mathcal H$`, 'The set of predictors the learner may choose from'],
        ['Approximation error', 'Excess risk of the best predictor in the class over the best possible predictor'],
        ['Estimation error', 'Excess risk caused by choosing from finite data instead of knowing the distribution'],
      ],
      why: String.raw`True risk is an expectation under $p$, and empirical risk is its sample average. $\mathcal H$ is the search space. The two error terms split the excess risk: one because $\mathcal H$ may not contain a good enough function, the other because $n$ is finite.`,
    },
    {
      kind: 'explain',
      title: 'A first guarantee: finite classes',
      body: String.raw`Suppose $\mathcal H$ has finitely many members and the loss lies in $[0,1]$. Hoeffding's inequality bounds how far one sample mean strays from its expectation. A **union bound** over all $|\mathcal H|$ members then gives this: with probability at least $1-\delta$,
$$\big|\hat R_n(f)-R(f)\big|\le\varepsilon=\sqrt{\frac{\ln(2|\mathcal H|/\delta)}{2n}}\quad\text{for every }f\in\mathcal H\text{ simultaneously}.$$

The guarantee holds for every $f$ at once, so it also covers the data-chosen $\hat f$. Note how it scales: the class size enters only through $\ln|\mathcal H|$, and $\varepsilon$ shrinks like $1/\sqrt n$. Infinite classes need a capacity measure such as the [VC dimension](@ml/pac-learning-vc).`,
    },
    {
      kind: 'numeric',
      prompt: String.raw`Use the bound above with $|\mathcal H|=1000$, $\delta=0.05$ and $n=5000$. Compute $\varepsilon$ to 3 decimals. (Hint: $\ln(40000)\approx10.60$.)`,
      answer: 0.0326,
      tolerance: 0.0015,
      why: String.raw`$2|\mathcal H|/\delta=2000/0.05=40000$, and $\ln 40000\approx10.60$. Then $\varepsilon=\sqrt{10.60/10000}=\sqrt{0.00106}\approx0.033$. So with 95% confidence every training error rate in the class is within about 3.3 percentage points of its true value.`,
    },
    {
      kind: 'multi',
      prompt: 'With everything else fixed, which changes make a large generalization gap (overfitting) **more** likely?',
      choices: [
        'Using a much richer hypothesis class',
        'Training on fewer examples',
        'Collecting more training data from the same distribution',
        'Restricting the hypothesis class to simpler functions',
        'Adding a penalty on model complexity to the training objective',
      ],
      answers: [0, 1],
      why: String.raw`The gap grows with the capacity of $\mathcal H$ and shrinks with $n$, as in $\sqrt{\ln|\mathcal H|/n}$. More data, simpler classes and complexity penalties ([regularization](@ml/regularization)) all *reduce* it.`,
    },
    {
      kind: 'fill',
      prompt: 'ERM returns the predictor with the smallest ___ risk in the ___ class. The expected difference between its true risk and its training loss is the ___ gap.',
      bank: ['empirical', 'hypothesis', 'generalization', 'true', 'Bayes', 'approximation'],
      answer: ['empirical', 'hypothesis', 'generalization'],
      why: 'ERM can only see training (empirical) risk, and it searches a fixed hypothesis class. The gap between true and training risk measures how well the result generalizes. Bayes risk is the best achievable over *all* functions, not what ERM minimizes.',
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- **True risk** $R(f)=\mathbb E[\ell(f(x),y)]$ is the target. **Empirical risk** $\hat R_n(f)$ is its training-set average.
- **ERM**: $\hat f=\arg\min_{f\in\mathcal H}\hat R_n(f)$. Almost all supervised learning has this form.
- For a fixed $f$, $\hat R_n$ is unbiased. For the ERM winner it is optimistic: $\mathbb E[\hat R_n(\hat f)]\le R(f^\star)\le\mathbb E[R(\hat f)]$.
- Excess risk = approximation error (class too small) + estimation error (data too few). Richer classes trade one for the other.
- For finite classes, $|\hat R_n-R|\lesssim\sqrt{\ln|\mathcal H|/n}$ uniformly. Estimate true risk with held-out data ([next](@ml/evaluation-data-splits)).`,
    },
  ],
  references: [
    { authors: 'S. Shalev-Shwartz & S. Ben-David', title: 'Understanding Machine Learning: From Theory to Algorithms', year: 2014, venue: 'Cambridge University Press', detail: 'Ch. 2–5' },
    { authors: 'M. Mohri, A. Rostamizadeh & A. Talwalkar', title: 'Foundations of Machine Learning', year: 2018, venue: '2nd ed., MIT Press', detail: 'Ch. 2' },
    { authors: 'V. N. Vapnik', title: 'Principles of Risk Minimization for Learning Theory', year: 1991, venue: 'Advances in Neural Information Processing Systems 4 (NIPS 1991), 831–838', url: 'https://papers.nips.cc/paper/1991/hash/ff4d5fbbafdf976cfdc032e3bde78de5-Abstract.html' },
    { authors: 'C. M. Bishop', title: 'Pattern Recognition and Machine Learning', year: 2006, venue: 'Springer', detail: 'Ch. 1.1 (polynomial curve fitting)' },
  ],
} satisfies LessonContent;
