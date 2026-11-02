import type { LessonContent } from '../../types';

export default {
  cards: [
    {
      kind: 'explain',
      title: 'Predicting a distribution, not a number',
      body: String.raw`A weather app that says "12 mm of rain tomorrow" is less useful than one that says "70% chance of rain, most likely 5–15 mm". The second one tells you how **sure** it is.

The **probabilistic view** of ML makes every model a conditional distribution $p_\theta(y\mid x)$: given input $x$, how likely is each output $y$? Learning then becomes ordinary statistical inference about $\theta$.

This gives a single explanation for things that otherwise look like separate tricks. **Losses** turn out to be negative log-likelihoods. **Regularizers** turn out to be log-priors. And we get a way to talk about uncertainty.`,
    },
    {
      kind: 'recall',
      title: 'Maximum likelihood',
      points: [
        String.raw`Likelihood $L(\theta)=p(\mathcal D\mid\theta)$: the probability of the observed data $\mathcal D$, seen as a function of $\theta$.`,
        String.raw`For i.i.d. data, $\log L(\theta)=\sum_i\log p(y_i\mid\theta)$, a sum and therefore easy to differentiate.`,
        String.raw`The **MLE** $\hat\theta=\arg\max_\theta\log L(\theta)$. Example: 7 heads in 10 flips gives $\hat p=0.7$.`,
        'Under regularity conditions the MLE is consistent and asymptotically efficient.',
      ],
      link: 'stats/maximum-likelihood',
    },
    {
      kind: 'recall',
      title: 'Bayesian inference',
      points: [
        String.raw`**Bayes' rule** for parameters: $p(\theta\mid\mathcal D)=\dfrac{p(\mathcal D\mid\theta)\,p(\theta)}{p(\mathcal D)}$, i.e. posterior ∝ likelihood × prior.`,
        String.raw`The **prior** $p(\theta)$ encodes beliefs before the data. The **posterior** combines them with the evidence.`,
        String.raw`**MAP** (maximum a posteriori) estimate: the mode of the posterior, $\arg\max_\theta p(\theta\mid\mathcal D)$.`,
        'With a conjugate prior (e.g. Beta for a coin) the posterior has a closed form.',
      ],
      link: 'stats/bayesian-inference',
    },
    {
      kind: 'explain',
      title: 'MLE = minimizing a loss',
      body: String.raw`Model the labels as $y_i\sim p_\theta(y\mid x_i)$, independently. Maximizing the log-likelihood is the same as minimizing the average **negative log-likelihood**:
$$\hat\theta_{\text{MLE}}=\arg\min_\theta\ \frac1n\sum_{i=1}^n\underbrace{-\log p_\theta(y_i\mid x_i)}_{\text{loss }\ell}.$$

This is [ERM](@ml/empirical-risk-minimization) with the **log loss**. Pick the likelihood and the loss follows:
- Gaussian $p_\theta(y\mid x)$ → squared error;
- Bernoulli or categorical → [cross-entropy](@ml/loss-functions).

As $n\to\infty$ the average NLL tends to its expectation. So MLE aims at the model closest to the data distribution in [KL divergence](@stats/entropy-kl).`,
    },
    {
      kind: 'widget',
      title: 'Gaussian likelihood → least squares',
      widget: {
        type: 'StepReveal',
        props: {
          steps: [
            String.raw`**Model:** $y=f_\theta(x)+\varepsilon$ with $\varepsilon\sim\mathcal N(0,\sigma^2)$, so $p_\theta(y\mid x)=\frac1{\sqrt{2\pi\sigma^2}}\exp\!\Big(-\frac{(y-f_\theta(x))^2}{2\sigma^2}\Big)$.`,
            String.raw`**One example's NLL:** $-\log p_\theta(y_i\mid x_i)=\dfrac{(y_i-f_\theta(x_i))^2}{2\sigma^2}+\tfrac12\log(2\pi\sigma^2)$.`,
            String.raw`**Sum over i.i.d. data:** $\text{NLL}(\theta)=\dfrac1{2\sigma^2}\sum_i(y_i-f_\theta(x_i))^2+\tfrac n2\log(2\pi\sigma^2)$.`,
            String.raw`**Optimize over $\theta$:** the last term and the factor $1/2\sigma^2$ do not depend on $\theta$, so $\hat\theta_{\text{MLE}}=\arg\min_\theta\sum_i(y_i-f_\theta(x_i))^2$. That is least squares.`,
            String.raw`**Bonus, optimize over $\sigma^2$:** setting $\partial/\partial\sigma^2=0$ gives $\hat\sigma^2=\frac1n\sum_i(y_i-f_{\hat\theta}(x_i))^2$, the mean squared residual.`,
          ],
          notes: ['A choice of noise model.', 'Take −log of the density.', 'Logs turn products into sums.', 'Least squares is MLE under Gaussian noise.', 'The noise level is learned too.'],
        },
      },
    },
    {
      kind: 'numeric',
      prompt: String.raw`Under the model $y\sim\mathcal N(f(x),\sigma^2)$ with $\sigma=1$, by how much does the NLL of an example with residual $|y-f(x)|=3$ exceed that of an example with residual 1?`,
      answer: 4,
      tolerance: 0.001,
      why: String.raw`The NLL is $r^2/(2\sigma^2)+$ const, so the difference is $(9-1)/2=4$ nats. The constant $\frac12\log(2\pi\sigma^2)$ cancels. Note the quadratic growth: tripling the residual multiplies the $r$-dependent part by 9.`,
    },
    {
      kind: 'explain',
      title: 'MAP: priors become regularizers',
      body: String.raw`MAP adds a prior. Taking logs of posterior ∝ likelihood × prior and negating:
$$\hat\theta_{\text{MAP}}=\arg\min_\theta\Big[\underbrace{-\sum_i\log p_\theta(y_i\mid x_i)}_{\text{data fit}}\ \underbrace{-\,\log p(\theta)}_{\text{penalty}}\Big].$$

- **Gaussian prior** $\theta_j\sim\mathcal N(0,\tau^2)$: $-\log p(\theta)=\frac{1}{2\tau^2}\|\theta\|_2^2+$const, an **L2 penalty** (ridge, weight decay). With Gaussian noise, multiplying by $2\sigma^2$ gives
$$\sum_i(y_i-f_\theta(x_i))^2+\lambda\|\theta\|_2^2,\qquad \lambda=\sigma^2/\tau^2.$$
- **Laplace prior** $p(\theta_j)\propto e^{-|\theta_j|/b}$: an **L1 penalty** (lasso), which pushes many weights to exactly zero.

A tighter prior (small $\tau$) means a larger $\lambda$. More in [regularization](@ml/regularization).`,
    },
    {
      kind: 'widget',
      title: 'A prior tames the wiggles',
      body: String.raw`A degree-9 polynomial fit to 10 noisy points. With $\lambda=0$ (MLE, no prior) it threads every point and swings wildly in between. Raise $\lambda$, which is the same as narrowing the Gaussian prior on the coefficients. The curve smooths out and the test error drops.

Push $\lambda$ too high and the prior dominates: the fit flattens toward a constant and test error rises again. Too strong a prior **underfits**.`,
      widget: { type: 'MlPolyFit', props: { n: 10, degree: 9, maxDegree: 9, ridge: true, lambda: 0, seed: 6 } },
    },
    {
      kind: 'mcq',
      prompt: String.raw`For linear regression with Gaussian noise (variance $\sigma^2$) and a Gaussian prior $\mathcal N(0,\tau^2)$ on each weight, what happens to the ridge penalty strength $\lambda=\sigma^2/\tau^2$ if you make the prior **narrower** (smaller $\tau^2$)?`,
      choices: [
        String.raw`$\lambda$ decreases: weights are freer to grow`,
        String.raw`$\lambda$ increases: weights are pulled harder toward zero`,
        String.raw`$\lambda$ is unchanged; only the noise level matters`,
        String.raw`The penalty switches from L2 to L1`,
      ],
      answer: 1,
      why: String.raw`A narrower prior says "I'm confident the weights are near zero", and $\lambda=\sigma^2/\tau^2$ grows as $\tau^2$ shrinks. Noisier data (larger $\sigma^2$) also raise $\lambda$, since the data deserve less trust. Switching L2 to L1 would need a Laplace prior, not a narrower Gaussian.`,
    },
    {
      kind: 'explain',
      title: 'MLE vs MAP on a coin',
      body: String.raw`A coin lands heads 3 times in 3 flips. The MLE $\hat p=3/3=1$ declares tails **impossible**, which is overconfident after so little data.

With a $\text{Beta}(a,a)$ prior, the posterior after $k$ heads and $m$ tails is $\text{Beta}(k+a,\,m+a)$, with mode
$$\hat p_{\text{MAP}}=\frac{k+a-1}{k+m+2a-2}.$$
With $a=2$ and 3 heads: $\hat p_{\text{MAP}}=4/5=0.8$. The prior acts like one imaginary head and one imaginary tail added to the data ("pseudo-counts").

In the plot, the curves are scaled to peak at 1. Increase $k$ and $m$ together: the likelihood narrows, and the posterior moves away from the prior toward the data.`,
      widget: {
        type: 'FunctionPlot',
        props: {
          fns: [
            '(x/(k/(k+m)))^k*((1-x)/(m/(k+m)))^m',
            '(4*x*(1-x))^(a-1)',
            '(x/((k+a-1)/(k+m+2*a-2)))^(k+a-1)*((1-x)/(1-(k+a-1)/(k+m+2*a-2)))^(m+a-1)',
          ],
          x: [0, 1], y: [0, 1.1],
          params: [
            { name: 'k', min: 0, max: 30, value: 3, label: 'heads k' },
            { name: 'm', min: 0, max: 30, value: 0, label: 'tails m' },
            { name: 'a', min: 1, max: 10, value: 2, label: 'prior a' },
          ],
          labels: ['likelihood', 'prior Beta(a,a)', 'posterior'],
          xLabel: 'p (heads)', yLabel: 'scaled',
        },
        caption: 'a = 1 is a flat prior: then MAP = MLE.',
      },
    },
    {
      kind: 'numeric',
      prompt: String.raw`A coin gives 8 heads and 2 tails. With a $\text{Beta}(3,3)$ prior, what is the MAP estimate of $p$? (2 decimals)`,
      answer: 0.714,
      tolerance: 0.006,
      why: String.raw`$\hat p_{\text{MAP}}=\frac{k+a-1}{k+m+2a-2}=\frac{8+2}{10+4}=\frac{10}{14}\approx0.71$. The MLE is $0.8$. The prior adds 2 pseudo-heads and 2 pseudo-tails, which pull the estimate toward $0.5$.`,
    },
    {
      kind: 'explain',
      title: 'Beyond a single best θ',
      body: String.raw`MLE and MAP both return **one** parameter value. Full Bayesian prediction averages over all plausible values:
$$p(y\mid x,\mathcal D)=\int p(y\mid x,\theta)\,p(\theta\mid\mathcal D)\,d\theta.$$
This **posterior predictive** is wider where the data say little, which is useful for knowing when the model doesn't know. For big models the integral is approximated, e.g. with [MCMC](@stats/mcmc), variational methods or ensembles.

Two caveats about MAP:
- With a fixed prior and more and more i.i.d. data, the likelihood dominates and MAP approaches MLE.
- MAP is not invariant to reparameterization: the mode of a density changes if you rewrite $\theta$ as, say, $\log\theta$. The posterior itself transforms consistently.`,
    },
    {
      kind: 'truefalse',
      prompt: 'With a fixed prior, as the number of i.i.d. training examples grows, the MAP estimate typically approaches the maximum-likelihood estimate.',
      answer: true,
      why: String.raw`The log-likelihood is a sum of $n$ terms and grows with $n$, while $\log p(\theta)$ stays fixed. So the prior's influence shrinks like $1/n$. In the coin example, $(k+a-1)/(n+2a-2)\to k/n$. This holds under standard regularity conditions and for priors that put positive density near the true value.`,
    },
    {
      kind: 'match',
      prompt: 'Match each probabilistic modelling choice to its everyday ML counterpart.',
      pairs: [
        ['Gaussian likelihood', 'Squared-error loss'],
        ['Bernoulli likelihood', 'Binary cross-entropy (log loss)'],
        ['Laplace likelihood', 'Absolute-error loss'],
        ['Gaussian prior on weights', 'L2 penalty / weight decay'],
        ['Laplace prior on weights', 'L1 penalty (lasso)'],
      ],
      why: 'Each pair comes from taking −log of a density. Gaussian gives quadratic terms and Laplace gives absolute values. On the residual that is the data loss; on the weights it is the regularizer. Bernoulli gives −[y log p + (1−y) log(1−p)].',
    },
    {
      kind: 'order',
      prompt: 'Order the steps to derive a training objective from a probabilistic model.',
      steps: [
        String.raw`Choose a likelihood $p_\theta(y\mid x)$ (e.g. Gaussian around $f_\theta(x)$)`,
        'Write the log-likelihood of the dataset as a sum over i.i.d. examples',
        String.raw`For MAP, add the log-prior $\log p(\theta)$`,
        'Negate the result to get a loss, and drop terms that do not depend on θ',
        'Minimize it with gradient-based optimization',
      ],
      why: 'The model comes first. Independence turns the product into a sum, and the prior is added on the log scale. Negating gives something to minimize, and constants do not change where the minimum is. The optimizer runs only once the objective is fixed.',
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- Treat a model as $p_\theta(y\mid x)$. Then **MLE = ERM with loss $-\log p_\theta(y\mid x)$**.
- Gaussian noise → squared loss, Laplace → absolute loss, Bernoulli or categorical → cross-entropy.
- **MAP** adds $-\log p(\theta)$: a Gaussian prior gives L2 (ridge, $\lambda=\sigma^2/\tau^2$), and a Laplace prior gives L1 (lasso).
- Priors act as pseudo-data. Their effect fades as $n$ grows (MAP → MLE).
- Full Bayesian prediction averages over the posterior and so captures uncertainty that point estimates ignore.`,
    },
  ],
  references: [
    { authors: 'C. M. Bishop', title: 'Pattern Recognition and Machine Learning', year: 2006, venue: 'Springer', detail: 'Sec. 1.2.5–1.2.6, 3.3' },
    { authors: 'K. P. Murphy', title: 'Probabilistic Machine Learning: An Introduction', year: 2022, venue: 'MIT Press', detail: 'Ch. 4', url: 'https://probml.github.io/pml-book/book1.html' },
    { authors: 'D. J. C. MacKay', title: 'Information Theory, Inference, and Learning Algorithms', year: 2003, venue: 'Cambridge University Press', url: 'https://www.inference.org.uk/mackay/itila/' },
    { authors: 'A. E. Hoerl & R. W. Kennard', title: 'Ridge Regression: Biased Estimation for Nonorthogonal Problems', year: 1970, venue: 'Technometrics 12(1), 55–67' },
    { authors: 'R. Tibshirani', title: 'Regression Shrinkage and Selection via the Lasso', year: 1996, venue: 'Journal of the Royal Statistical Society, Series B 58(1), 267–288' },
  ],
} satisfies LessonContent;
