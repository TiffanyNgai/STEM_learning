import type { LessonContent } from '../../types';

export default {
  cards: [
    {
      kind: 'explain',
      title: 'Predictions that know what they don’t know',
      body: String.raw`A regression model that returns only a curve hides how much it is guessing. A **Gaussian process** (GP) returns a whole distribution over functions: a best guess (the **posterior mean**, blue) and an uncertainty band (mean $\pm2$ standard deviations, shaded).

Near the observations the band is tight; between and beyond them it widens. Thin lines are **sample functions**: plausible curves consistent with the data. **Tap** to add an observation and **drag** points to move them. Press Play to watch the samples wander while still respecting the data.`,
      widget: { type: 'MlGPPosterior', props: { kernel: 'rbf', lengthScale: 0.3, noise: 0.05, controls: false, showNoise: false } },
    },
    {
      kind: 'recall',
      title: 'From statistics: Gaussians',
      points: [
        String.raw`A normal variable $N(\mu,\sigma^2)$ lies within $\mu\pm2\sigma$ about 95% of the time.`,
        String.raw`A multivariate normal $N(\boldsymbol\mu,\Sigma)$ is fixed by a mean vector and a symmetric positive semidefinite covariance matrix $\Sigma$.`,
        'Every marginal of a multivariate normal (any subset of its coordinates) is again normal.',
        'Conditioning a multivariate normal on some coordinates gives a normal distribution for the rest.',
      ],
      link: 'stats/normal-distribution',
    },
    {
      kind: 'explain',
      title: 'A GP is an infinite Gaussian',
      body: String.raw`Think of a function $f$ as a very long vector, one entry $f(x)$ per input $x$. A **Gaussian process** is a distribution over functions such that **any finite set** of values $(f(x_1),\dots,f(x_n))$ is jointly Gaussian. We write $f\sim\mathcal{GP}(m,k)$ with
$$\mathbb E[f(x)]=m(x),\qquad\operatorname{Cov}\big(f(x),f(x')\big)=k(x,x').$$
Usually $m=0$. The **kernel is the covariance**: it says how strongly the function's values at two inputs move together. That is why it must be a valid [kernel](@ml/kernel-trick): every covariance matrix must be positive semidefinite.

**Example.** With the RBF kernel $k(x,x')=\sigma_f^2\exp(-(x-x')^2/2\ell^2)$, nearby inputs ($|x-x'|\ll\ell$) have nearly equal values, while inputs many length-scales apart are almost independent.`,
    },
    {
      kind: 'widget',
      title: 'Prior samples: the kernel sets the character',
      body: String.raw`With no data, these are draws from the **prior**: $f(x)$ on a grid of 81 points sampled from $N(\mathbf 0,K)$. Compare kernels:
- **RBF**: infinitely differentiable, very smooth.
- **Matérn-½** ($\sigma_f^2e^{-|x-x'|/\ell}$): continuous but rough and jagged, like Brownian motion pulled back to zero.
- **periodic**: repeats exactly with period 1.
- **linear** $\sigma_f^2(1+xx')$: straight lines with random intercept and slope.

Shrink $\ell$: the samples wiggle faster. Raise $\sigma_f$: they swing further from zero. Tap to add data and the prior becomes a posterior.`,
      widget: { type: 'MlGPPosterior', props: { points: [], kernel: 'rbf', lengthScale: 0.3, samples: 4 } },
    },
    {
      kind: 'numeric',
      prompt: String.raw`Under an RBF prior with $\sigma_f=1$ and length-scale $\ell$, what is the correlation between $f(x)$ and $f(x+2\ell)$? (3 decimals)`,
      answer: 0.135,
      tolerance: 0.002,
      why: String.raw`Correlation $=k(x,x+2\ell)/\sigma_f^2=\exp(-(2\ell)^2/(2\ell^2))=e^{-2}\approx0.135$. At one length-scale apart it is $e^{-1/2}\approx0.607$. Forgetting the factor 2 in the denominator gives $e^{-4}\approx0.018$.`,
    },
    {
      kind: 'explain',
      title: 'The posterior in closed form',
      body: String.raw`Observe noisy values $y_i=f(x_i)+\varepsilon_i$ with $\varepsilon_i\sim N(0,\sigma_n^2)$. Let $K$ be the $n\times n$ Gram matrix of the training inputs and $\mathbf k_*$ the vector of $k(x_i,x_*)$ for a test input $x_*$. Then $f(x_*)$ given the data is Gaussian with
$$\mu_*=\mathbf k_*^\top(K+\sigma_n^2I)^{-1}\mathbf y,$$
$$\sigma_*^2=k(x_*,x_*)-\mathbf k_*^\top(K+\sigma_n^2I)^{-1}\mathbf k_*.$$
The mean is a weighted combination of the observed $y_i$. The variance starts at the prior variance and is reduced by how well the training inputs "cover" $x_*$. Notice that $\mathbf y$ does **not** appear in $\sigma_*^2$.`,
    },
    {
      kind: 'widget',
      title: 'Where the formula comes from',
      widget: {
        type: 'StepReveal',
        props: {
          steps: [
            String.raw`Joint prior of the observations and the test value: $\begin{pmatrix}\mathbf y\\ f_*\end{pmatrix}\sim N\!\left(\mathbf 0,\begin{pmatrix}K+\sigma_n^2I & \mathbf k_*\\ \mathbf k_*^\top & k_{**}\end{pmatrix}\right)$.`,
            String.raw`Gaussian conditioning: if $\begin{pmatrix}\mathbf a\\ \mathbf b\end{pmatrix}\sim N\!\left(\mathbf 0,\begin{pmatrix}A & C\\ C^\top & B\end{pmatrix}\right)$ then $\mathbf b\mid\mathbf a\sim N\big(C^\top A^{-1}\mathbf a,\ B-C^\top A^{-1}C\big)$.`,
            String.raw`Plug in $A=K+\sigma_n^2I$, $C=\mathbf k_*$, $B=k_{**}$: $\ \mu_*=\mathbf k_*^\top(K+\sigma_n^2I)^{-1}\mathbf y$, $\ \sigma_*^2=k_{**}-\mathbf k_*^\top(K+\sigma_n^2I)^{-1}\mathbf k_*$.`,
            String.raw`In code: Cholesky $LL^\top=K+\sigma_n^2I$; $\ \boldsymbol\alpha=L^{-\top}L^{-1}\mathbf y$; $\ \mu_*=\mathbf k_*^\top\boldsymbol\alpha$; $\ \mathbf v=L^{-1}\mathbf k_*$, $\ \sigma_*^2=k_{**}-\mathbf v^\top\mathbf v$.`,
          ],
          notes: ['$k_{**}=k(x_*,x_*)$; noise adds only to the diagonal of the training block', 'the one fact we need about Gaussians', 'exact Bayesian inference, no approximation', 'Rasmussen & Williams, Algorithm 2.1: O(n³) once, then O(n) per mean and O(n²) per variance'],
        },
      },
    },
    {
      kind: 'numeric',
      prompt: String.raw`One observation $y_1=1$ at $x_1=0$. RBF kernel with $\sigma_f=1$, $\ell=1$; noise variance $\sigma_n^2=0.25$. What is the posterior mean $\mu_*$ at $x_*=1$? (3 decimals)`,
      answer: 0.485,
      tolerance: 0.002,
      why: String.raw`$k(0,1)=e^{-1/2}\approx0.6065$ and $K+\sigma_n^2=1+0.25=1.25$, so $\mu_*=0.6065\times1/1.25\approx0.485$. Ignoring the noise gives $0.607$; noise shrinks the mean toward the prior mean 0.`,
    },
    {
      kind: 'truefalse',
      prompt: String.raw`For fixed kernel hyperparameters, the GP posterior variance $\sigma_*^2$ at a test point depends on the observed values $\mathbf y$.`,
      answer: false,
      why: String.raw`$\sigma_*^2=k_{**}-\mathbf k_*^\top(K+\sigma_n^2I)^{-1}\mathbf k_*$ involves only the inputs. Dragging a point vertically in the widget moves the mean but not the band's width. (In practice $\mathbf y$ does influence the variance indirectly when hyperparameters are fitted to the data.)`,
    },
    {
      kind: 'widget',
      title: 'Choosing hyperparameters',
      body: String.raw`The length-scale $\ell$, signal $\sigma_f$ and noise $\sigma_n$ are usually fitted by maximizing the **log marginal likelihood** (shown under the plot):
$$\log p(\mathbf y\mid X)=-\tfrac12\mathbf y^\top K_y^{-1}\mathbf y-\tfrac12\log|K_y|-\tfrac n2\log2\pi,\quad K_y=K+\sigma_n^2I.$$
The first term rewards fitting the data; the second penalizes flexible models (a built-in **Occam's razor**). Try it: a tiny $\ell$ fits every point but the score drops; a huge $\ell$ cannot follow the data. Raise $\sigma_n$ and the mean stops passing through the points: it treats their scatter as noise.`,
      widget: { type: 'MlGPPosterior', props: { kernel: 'rbf', lengthScale: 0.3, noise: 0.1, points: [[-0.85, -0.4], [-0.55, 0.3], [-0.3, 0.8], [0.0, 0.55], [0.2, -0.2], [0.45, -0.7], [0.7, -0.1]] } },
    },
    {
      kind: 'multi',
      prompt: 'For GP regression with an RBF kernel and zero prior mean, which statements are true? Select all that apply.',
      choices: [
        String.raw`Decreasing $\ell$ makes sample functions wigglier`,
        String.raw`As $\sigma_n\to0$, the posterior mean passes through every observation (distinct inputs)`,
        String.raw`Far from all data, the mean returns to 0 and the variance to $\sigma_f^2$`,
        'Adding an observation can increase the posterior variance at some test point',
      ],
      answers: [0, 1, 2],
      why: String.raw`Small $\ell$ lets the function decorrelate quickly; with no noise the posterior is conditioned on exact values; far away $\mathbf k_*\approx\mathbf 0$ so the prior returns. With hyperparameters fixed, conditioning on more data can only reduce (or keep) the variance, since $\mathbf k_*^\top(K+\sigma_n^2I)^{-1}\mathbf k_*$ grows as points are added.`,
    },
    {
      kind: 'match',
      prompt: 'Match each kernel to the behaviour of its prior samples.',
      pairs: [
        ['RBF (squared exponential)', 'Infinitely differentiable, very smooth curves'],
        [String.raw`Matérn-½, $e^{-|x-x'|/\ell}$`, 'Continuous but nowhere differentiable, jagged'],
        ['Periodic', 'Patterns that repeat exactly'],
        [String.raw`Linear, $\sigma_f^2(1+xx')$`, 'Straight lines with random slope and intercept'],
      ],
      why: String.raw`Smoothness of samples follows the kernel's behaviour near $x=x'$: the RBF kernel is analytic, while $e^{-|r|/\ell}$ has a kink at $r=0$ (the Ornstein–Uhlenbeck process). A periodic kernel makes $f(x)$ and $f(x+\text{period})$ perfectly correlated. The linear kernel is Bayesian linear regression.`,
    },
    {
      kind: 'explain',
      title: 'Connections and cost',
      body: String.raw`- The posterior mean is exactly **kernel ridge regression** with $\lambda=\sigma_n^2$ (see [RKHS](@ml/rkhs)); the GP adds calibrated error bars.
- A linear kernel gives Bayesian linear regression; the GP view is its kernelized form.
- Neal (1996) showed that a one-hidden-layer neural network with suitably scaled random weights becomes a GP as its width goes to infinity.
- Geostatisticians call GP regression **kriging**. Today GPs drive **Bayesian optimization**: tuning expensive experiments by querying where the mean is high or the uncertainty large.
- Cost: the Cholesky factorization is $O(n^3)$ time and $O(n^2)$ memory, so exact GPs reach roughly $10^4$ points. Sparse approximations with $m\ll n$ inducing points cost $O(nm^2)$.
- Classification needs a non-Gaussian likelihood, so the posterior is no longer exact (Laplace, EP or variational approximations).`,
    },
    {
      kind: 'order',
      prompt: 'Order the steps of exact GP regression.',
      steps: [
        String.raw`Choose a kernel and its hyperparameters $\ell,\sigma_f,\sigma_n$`,
        String.raw`Form $K+\sigma_n^2I$ from the training inputs`,
        String.raw`Compute its Cholesky factor $L$`,
        String.raw`Solve for $\boldsymbol\alpha=(K+\sigma_n^2I)^{-1}\mathbf y$ by two triangular solves`,
        String.raw`For each test input, return $\mu_*=\mathbf k_*^\top\boldsymbol\alpha$ and $\sigma_*^2=k_{**}-\lVert L^{-1}\mathbf k_*\rVert^2$`,
      ],
      why: String.raw`The expensive $O(n^3)$ factorization happens once; triangular solves reuse it. Hyperparameters come first because they define $K$; if they are tuned by marginal likelihood, these steps are repeated inside the optimizer.`,
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- A GP is a distribution over functions whose values at any finite set of inputs are jointly Gaussian, with covariance given by a kernel.
- The kernel encodes assumptions: smoothness ($\ell$, kernel family), amplitude ($\sigma_f$), periodicity.
- Posterior: $\mu_*=\mathbf k_*^\top(K+\sigma_n^2I)^{-1}\mathbf y$, $\sigma_*^2=k_{**}-\mathbf k_*^\top(K+\sigma_n^2I)^{-1}\mathbf k_*$, from Gaussian conditioning.
- Hyperparameters are fitted by maximizing the marginal likelihood, which balances fit and complexity.
- Exact inference costs $O(n^3)$; the mean equals kernel ridge regression.`,
    },
  ],
  references: [
    { authors: 'C. E. Rasmussen & C. K. I. Williams', title: 'Gaussian Processes for Machine Learning', year: 2006, venue: 'MIT Press', detail: 'Ch. 2 (regression, Algorithm 2.1), Ch. 4 (covariance functions), Ch. 5 (model selection)', url: 'http://gaussianprocess.org/gpml/' },
    { authors: 'C. M. Bishop', title: 'Pattern Recognition and Machine Learning', year: 2006, venue: 'Springer', detail: 'Ch. 6.4 (Gaussian processes)' },
    { authors: 'K. P. Murphy', title: 'Probabilistic Machine Learning: Advanced Topics', year: 2023, venue: 'MIT Press', detail: 'Ch. 18 (Gaussian processes)', url: 'https://probml.github.io/pml-book/book2.html' },
    { authors: 'R. M. Neal', title: 'Bayesian Learning for Neural Networks', year: 1996, venue: 'Lecture Notes in Statistics 118, Springer', detail: 'Ch. 2 (priors for infinite networks)' },
  ],
} satisfies LessonContent;
