import type { LessonContent } from '../../types';

export default {
  cards: [
    {
      kind: 'explain',
      title: 'Telling the machine what you care about',
      body: String.raw`A delivery app predicts arrival times. Model A is off by 10 minutes on two orders. Model B is exact on one order and 20 minutes off on the other. Which is better?

It depends on what you care about. If one very late order loses a customer, B is worse. If every minute costs the same, they tie.

The **loss function** $\ell(\hat y,y)$ is how you write that preference down. The optimizer will minimize exactly what you write, so the choice of loss changes what the model learns. This lesson covers the standard losses, what each one is minimized by, and the probability model each one implies.`,
    },
    {
      kind: 'explain',
      title: 'Regression losses',
      body: String.raw`Write the **residual** as $r=y-\hat y$.
- **Squared:** $\ell=r^2$ (often written $\tfrac12r^2$ so the derivative is just $r$). Large errors count a lot: an error of 20 costs 4× an error of 10.
- **Absolute:** $\ell=|r|$. Every unit of error costs the same, so a single outlier has much less pull.
- **Huber** (with threshold $\delta$): $\tfrac12r^2$ for $|r|\le\delta$ and $\delta(|r|-\tfrac12\delta)$ beyond. It is quadratic near zero and linear in the tails, so it is smooth *and* robust.

In the delivery example, squared loss scores A at $10^2+10^2=200$ and B at $0+20^2=400$. Absolute loss scores both at 20.`,
      widget: {
        type: 'FunctionPlot',
        props: {
          fns: ['0.5*x^2', 'abs(x)', '0.5*min(abs(x),d)^2 + d*max(abs(x)-d,0)'],
          x: [-4, 4], y: [0, 5],
          params: [{ name: 'd', min: 0.2, max: 3, value: 1, label: 'Huber δ' }],
          labels: ['½r² (squared)', '|r| (absolute)', 'Huber'],
          xLabel: 'residual r', yLabel: 'loss',
        },
        caption: 'Slide δ: small δ makes Huber nearly absolute loss, and large δ makes it nearly squared loss.',
      },
    },
    {
      kind: 'explain',
      title: 'Mean or median? The loss decides',
      body: String.raw`Take the simplest model of all: one constant prediction $c$ for every example. Which $c$ minimizes the average loss?

- **Squared loss** → the **mean**. Setting $\frac{d}{dc}\frac1n\sum(y_i-c)^2=-\frac2n\sum(y_i-c)=0$ gives $c=\bar y$.
- **Absolute loss** → the **median**. Moving $c$ right lowers the loss for points above $c$ and raises it for points below. The two balance when half the points lie on each side.

Below, the data are $1,2,3,4$ plus one point at $o$. Drag the outlier $o$. The squared-loss minimum (mean) follows it, and the absolute-loss minimum (median) stays at 3.

The same holds conditionally: squared loss targets $\mathbb E[y\mid x]$, and absolute loss targets the conditional median.`,
      widget: {
        type: 'FunctionPlot',
        props: {
          fns: ['((x-1)^2+(x-2)^2+(x-3)^2+(x-4)^2+(x-o)^2)/5', '(abs(x-1)+abs(x-2)+abs(x-3)+abs(x-4)+abs(x-o))/5'],
          x: [0, 12], y: [0, 16],
          params: [{ name: 'o', min: 4, max: 12, value: 10, label: 'outlier o' }],
          labels: ['mean squared loss', 'mean absolute loss'],
          xLabel: 'constant prediction c', yLabel: 'avg loss',
        },
      },
    },
    {
      kind: 'mcq',
      prompt: String.raw`Data: $1, 2, 3, 4, 100$. Which constant prediction minimizes the **average squared** loss?`,
      choices: ['3', '22', '2.5', '100'],
      answer: 1,
      why: String.raw`Squared loss is minimized by the mean, $(1+2+3+4+100)/5=110/5=22$. Absolute loss would choose the median, 3. One outlier pulls the squared-loss answer far from most of the data, which is why robust losses exist.`,
    },
    {
      kind: 'recall',
      title: 'Maximum likelihood',
      points: [
        String.raw`The **likelihood** $L(\theta)=p(\text{data}\mid\theta)$ is the probability of the observed data, seen as a function of the parameter.`,
        String.raw`For i.i.d. data it factorizes: $L(\theta)=\prod_i p(y_i\mid\theta)$, so the **log-likelihood** is a sum $\sum_i\log p(y_i\mid\theta)$.`,
        String.raw`The **MLE** maximizes it. Equivalently, it minimizes the **negative log-likelihood** (NLL) $-\sum_i\log p(y_i\mid\theta)$.`,
      ],
      link: 'stats/maximum-likelihood',
    },
    {
      kind: 'explain',
      title: 'Every loss hides a noise model',
      body: String.raw`Assume $y=f(x)+\varepsilon$ with **Gaussian** noise $\varepsilon\sim\mathcal N(0,\sigma^2)$. The negative log-density of one example is
$$-\log p(y\mid x)=\frac{(y-f(x))^2}{2\sigma^2}+\tfrac12\log(2\pi\sigma^2).$$
The second term does not depend on $f$. So **maximizing the likelihood = minimizing squared error**.

With **Laplace** noise, $p(\varepsilon)\propto e^{-|\varepsilon|/b}$, the same steps give **absolute** loss. Laplace has heavier tails, so outliers are less surprising under it and get less weight.

Choosing a loss amounts to choosing what you believe about the noise. The full story is in [the probabilistic view](@ml/probabilistic-view).`,
    },
    {
      kind: 'explain',
      title: 'Classification: margins and surrogates',
      body: String.raw`For binary labels $y\in\{-1,+1\}$, let the model output a real **score** $s=f(x)$ and predict $\operatorname{sign}(s)$. The **margin** $m=y\,s$ is positive when the prediction is correct, and larger means more confidently correct.

- **0–1 loss** $\mathbb 1[m\le0]$ counts mistakes. Its gradient is zero almost everywhere, so gradient descent gets no signal from it.
- So we minimize a **convex surrogate** that upper-bounds it:
  - **logistic** $\log_2(1+e^{-m})$ (written in bits so it equals 1 at $m=0$; with the natural log it is the log-loss of [logistic regression](@ml/logistic-regression-ml));
  - **hinge** $\max(0,1-m)$, used by [SVMs](@ml/svms);
  - **exponential** $e^{-m}$, used by AdaBoost.`,
      widget: {
        type: 'FunctionPlot',
        props: {
          fns: ['(x<=0)*1', 'log2(1+exp(-x))', 'max(0,1-x)', 'exp(-x)'],
          x: [-2.5, 3], y: [0, 4],
          labels: ['0–1', 'logistic (bits)', 'hinge', 'exponential'],
          xLabel: 'margin m = y·s', yLabel: 'loss',
        },
        caption: 'Every surrogate is ≥ the 0–1 loss, keeps penalizing correct but low-confidence predictions (0 < m < 1), and keeps growing as mistakes get worse (m < 0).',
      },
    },
    {
      kind: 'numeric',
      prompt: String.raw`True label $y=-1$, model score $s=0.4$. What is the **hinge loss** $\max(0,1-ys)$?`,
      answer: 1.4,
      tolerance: 0.001,
      why: String.raw`The margin is $m=ys=(-1)(0.4)=-0.4$, so the hinge loss is $\max(0,1-(-0.4))=1.4$. The prediction is wrong (sign of $s$ is $+$), so the loss exceeds 1. Forgetting the sign of $y$ would give $0.6$.`,
    },
    {
      kind: 'explain',
      title: 'Cross-entropy: scoring probabilities',
      body: String.raw`Many classifiers output a probability $\hat p_k$ for each class $k$. The **cross-entropy** (log) loss is
$$\ell=-\log\hat p_{y},$$
the negative log of the probability given to the **true** class. It is the NLL of a categorical distribution. For two classes it is $-[y\log\hat p+(1-y)\log(1-\hat p)]$ with $y\in\{0,1\}$. With $\hat p=\sigma(s)$ (the sigmoid of the score) it equals the logistic loss $\log(1+e^{-ys})$ from the previous card, once the label is rewritten as $y\in\{-1,+1\}$.

- $\hat p_y=0.9$: loss $0.105$. $\ \hat p_y=0.5$: $0.693$. $\ \hat p_y=0.01$: $4.61$.
- As $\hat p_y\to0$ the loss goes to $\infty$, so confident mistakes are punished very hard.

The name comes from information theory: averaged over data it is the [cross-entropy](@stats/entropy-kl) between the true labels and the model.`,
    },
    {
      kind: 'numeric',
      prompt: String.raw`A 4-class model assigns probability $0.25$ to the true class. What is its cross-entropy loss $-\ln\hat p_y$? (natural log, 3 decimals)`,
      answer: 1.386,
      tolerance: 0.005,
      why: String.raw`$-\ln 0.25=\ln 4\approx1.386$. This is exactly the loss of a model that guesses uniformly over 4 classes, which makes it a handy baseline: a trained 4-class model should average well below $\ln 4$.`,
    },
    {
      kind: 'truefalse',
      prompt: 'Cross-entropy loss is bounded: even a confidently wrong prediction costs at most about 1.',
      answer: false,
      why: String.raw`$-\log\hat p_y$ is unbounded. At $\hat p_y=10^{-6}$ it is about 13.8, and it goes to $\infty$ as $\hat p_y\to0$. This strong penalty pushes models toward honest probabilities. It also means a few mislabelled examples can dominate training. Bounded losses (like 0–1) don't have this problem but are hard to optimize.`,
    },
    {
      kind: 'match',
      prompt: 'Match each loss to the noise model or idea behind it.',
      pairs: [
        ['Squared error', 'Gaussian noise; predicts the conditional mean'],
        ['Absolute error', 'Laplace noise; predicts the conditional median'],
        ['Cross-entropy', 'Bernoulli / categorical likelihood; predicts class probabilities'],
        ['Hinge', 'Max-margin classification; no probabilistic model behind it'],
      ],
      why: 'The first three are negative log-likelihoods of familiar distributions. Hinge loss is not the NLL of any (normalized) model. Its minimizer recovers the correct class (the sign of P(y=1|x) − ½) but not the probability itself.',
    },
    {
      kind: 'explain',
      title: 'Choosing a loss: what to check',
      body: String.raw`- **Convex** in the model's output (squared, absolute, Huber, logistic, hinge, exponential)? With a linear model, the whole training problem is then [convex](@ml/convexity), so it has no bad local minima.
- **Differentiable**? Squared, Huber and logistic are smooth. Absolute and hinge have a kink, which subgradients handle.
- **Robust**? Absolute and Huber grow linearly, so outliers matter less. Squared and exponential losses are sensitive to them.
- **Proper**? Log loss and squared error on probabilities (the Brier score) are **proper scoring rules**: their expected value is minimized by reporting the *true* probability. Hinge loss is not, so SVM scores are not probabilities.`,
    },
    {
      kind: 'multi',
      prompt: String.raw`Which of these are **convex** functions of the margin $m$?`,
      choices: [
        String.raw`0–1 loss $\mathbb 1[m\le0]$`,
        String.raw`Hinge $\max(0,1-m)$`,
        String.raw`Logistic $\log(1+e^{-m})$`,
        String.raw`Squared $(1-m)^2$`,
        String.raw`Ramp $\min\big(1,\max(0,1-m)\big)$`,
      ],
      answers: [1, 2, 3],
      why: String.raw`Hinge is a maximum of linear functions, logistic has positive second derivative, and $(1-m)^2$ is a parabola, so all three are convex. The 0–1 step and the ramp (a hinge capped at 1) are flat on one side and rising on the other. A chord between points on each side lies *below* the curve, so they are not convex.`,
    },
    {
      kind: 'fill',
      prompt: 'Squared loss corresponds to ___ noise and its best constant prediction is the ___. Absolute loss corresponds to ___ noise and its best constant prediction is the ___.',
      bank: ['Gaussian', 'mean', 'Laplace', 'median', 'mode', 'uniform', 'Bernoulli'],
      answer: ['Gaussian', 'mean', 'Laplace', 'median'],
      why: String.raw`The Gaussian log-density is $-r^2/(2\sigma^2)$ up to a constant, and the Laplace log-density is $-|r|/b$. Minimizing $\sum(y_i-c)^2$ gives the mean, and minimizing $\sum|y_i-c|$ gives the median. The mode would come from a 0–1-style loss.`,
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- The loss defines "good". Squared loss punishes big errors hard. Absolute and Huber are robust to outliers.
- Squared → mean ($\mathbb E[y\mid x]$). Absolute → median.
- Most losses are **negative log-likelihoods**: Gaussian → squared, Laplace → absolute, Bernoulli / categorical → cross-entropy.
- Classification uses **convex surrogates** of the 0–1 loss, written in terms of the margin $m=ys$: logistic, hinge, exponential.
- Cross-entropy $-\log\hat p_y$ is unbounded and **proper**, so it rewards honest probabilities.`,
    },
  ],
  references: [
    { authors: 'K. P. Murphy', title: 'Probabilistic Machine Learning: An Introduction', year: 2022, venue: 'MIT Press', detail: 'Ch. 4–5', url: 'https://probml.github.io/pml-book/book1.html' },
    { authors: 'T. Hastie, R. Tibshirani & J. Friedman', title: 'The Elements of Statistical Learning', year: 2009, venue: '2nd ed., Springer', detail: 'Sec. 10.6 (loss functions and robustness)', url: 'https://hastie.su.domains/ElemStatLearn/' },
    { authors: 'P. J. Huber', title: 'Robust Estimation of a Location Parameter', year: 1964, venue: 'Annals of Mathematical Statistics 35(1), 73–101' },
    { authors: 'P. L. Bartlett, M. I. Jordan & J. D. McAuliffe', title: 'Convexity, Classification, and Risk Bounds', year: 2006, venue: 'Journal of the American Statistical Association 101(473), 138–156' },
    { authors: 'T. Gneiting & A. E. Raftery', title: 'Strictly Proper Scoring Rules, Prediction, and Estimation', year: 2007, venue: 'Journal of the American Statistical Association 102(477), 359–378' },
  ],
} satisfies LessonContent;
