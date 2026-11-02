import type { LessonContent } from '../../types';

// GLM pipeline: x -> linear predictor -> inverse link -> distribution, with a token flowing through, and three example rows.
const box = (x: number, label: string, sub: string, col: string) =>
  `<rect x="${x}" y="22" width="70" height="40" rx="6" fill="var(--surface)" stroke="${col}" stroke-width="1.5"/>` +
  `<text x="${x + 35}" y="39" font-size="10" text-anchor="middle" fill="var(--fg)">${label}</text>` +
  `<text x="${x + 35}" y="54" font-size="8.5" text-anchor="middle" fill="var(--muted)">${sub}</text>`;
const arrow = (x: number) => `<line x1="${x}" y1="42" x2="${x + 9}" y2="42" stroke="var(--fg)" stroke-width="1.2"/><polygon points="${x + 9},39 ${x + 12},42 ${x + 9},45" fill="var(--fg)"/>`;
const row = (y: number, a: string, b: string, c: string, col: string) =>
  `<text x="8" y="${y}" font-size="9.5" fill="${col}">${a}</text><text x="92" y="${y}" font-size="9.5" fill="var(--fg)">${b}</text><text x="208" y="${y}" font-size="9.5" fill="var(--fg)">${c}</text>`;
const GLM_SVG = `<svg viewBox="0 0 320 175" xmlns="http://www.w3.org/2000/svg">
${box(4, 'x', 'input / features', 'var(--muted)')}${arrow(76)}
${box(90, 'η = wᵀx + b', 'linear predictor', 'var(--c2)')}${arrow(162)}
${box(176, 'μ = g⁻¹(η)', 'inverse link', 'var(--c4)')}${arrow(248)}
${box(262, 'y ~ p(y|μ)', 'exp. family', 'var(--c3)')}
<circle cx="39" cy="42" r="4" fill="var(--c5)"><animate attributeName="cx" values="39;125;211;297;297" keyTimes="0;0.25;0.5;0.75;1" dur="5s" repeatCount="indefinite"/></circle>
<line x1="6" y1="80" x2="314" y2="80" stroke="var(--grid)"/>
<text x="8" y="96" font-size="9" fill="var(--muted)">target y</text><text x="92" y="96" font-size="9" fill="var(--muted)">mean μ = g⁻¹(η)</text><text x="208" y="96" font-size="9" fill="var(--muted)">loss = −log p(y|μ)</text>
${row(116, 'real (Gaussian)', 'μ = η (identity)', 'squared error', 'var(--c2)')}
${row(136, '0/1 (Bernoulli)', 'μ = σ(η) (logit link)', 'binary cross-entropy', 'var(--c1)')}
${row(156, 'count (Poisson)', 'μ = e^η (log link)', 'μ − y log μ', 'var(--c3)')}
<text x="10" y="172" font-size="8.5" fill="var(--muted)">K classes: μ = softmax(η), loss = categorical cross-entropy</text>
</svg>`;

export default {
  cards: [
    {
      kind: 'explain',
      title: 'One recipe, many models',
      body: String.raw`Look back at the three models of this unit. Each one
1. computes a linear score $\eta=\mathbf w^\top\mathbf x+b$,
2. maps it to the **mean** of the target, $\mu=g^{-1}(\eta)$,
3. assumes a distribution for $y$ with that mean, and uses its negative log-likelihood as the loss.

Least squares, [logistic](@ml/logistic-regression-ml) and [softmax](@ml/softmax-classification) regression are all **generalized linear models (GLMs)** (Nelder & Wedderburn, 1972). The same recipe handles counts (Poisson), rates and positive skewed quantities (e.g. Gamma); the table shows the most common cases.`,
      widget: { type: 'SvgDiagram', props: { svg: GLM_SVG }, caption: 'A GLM = linear predictor + link function + exponential-family distribution.' },
    },
    {
      kind: 'recall',
      title: 'From statistics: the GLM framework',
      points: [
        'Random component: y follows an exponential-family distribution (normal, Bernoulli, Poisson, …).',
        String.raw`Systematic component: a linear predictor $\eta=\mathbf w^\top\mathbf x+b$.`,
        String.raw`Link function $g$ connects them: $g(\mu)=\eta$, where $\mu=\mathbb E[y\mid\mathbf x]$.`,
        'Coefficients are fitted by maximum likelihood, classically by iteratively reweighted least squares (IRLS).',
      ],
      link: 'stats/glm-framework',
    },
    {
      kind: 'explain',
      title: 'The exponential family',
      body: String.raw`Many distributions share one form (shown for a scalar $y$, with any scale parameter set to 1):
$$p(y\mid\theta)=h(y)\,\exp\big(\theta\,y-A(\theta)\big).$$
$\theta$ is the **natural parameter** and $A(\theta)$, the **log-partition function**, makes it normalize. Its derivatives give the moments:
$$A'(\theta)=\mathbb E[y]=\mu,\qquad A''(\theta)=\operatorname{Var}[y]\ge0.$$

**Examples.**
- Bernoulli: $\theta=\log\frac{\mu}{1-\mu}$, $A(\theta)=\log(1+e^\theta)$, so $A'(\theta)=\sigma(\theta)$.
- Poisson: $\theta=\log\lambda$, $A(\theta)=e^\theta$, so mean $=$ variance $=\lambda$.
- Gaussian with variance 1: $\theta=\mu$, $A(\theta)=\theta^2/2$.`,
    },
    {
      kind: 'numeric',
      prompt: String.raw`For the Poisson, $A(\theta)=e^\theta$. At $\theta=\ln 3$, what is the variance $A''(\theta)$?`,
      answer: 3,
      tolerance: 0.001,
      why: String.raw`$A''(\theta)=e^\theta=e^{\ln3}=3$. The mean $A'(\theta)$ is also 3: a Poisson's variance equals its mean, which is why real count data that are more variable ("overdispersed") break the Poisson model.`,
    },
    {
      kind: 'match',
      prompt: 'Match each target distribution to its canonical inverse link μ = g⁻¹(η).',
      pairs: [
        ['Gaussian (real-valued y)', String.raw`$\mu=\eta$ (identity)`],
        ['Bernoulli (0/1 y)', String.raw`$\mu=\sigma(\eta)=1/(1+e^{-\eta})$`],
        ['Poisson (counts)', String.raw`$\mu=e^{\eta}$`],
        ['Categorical (K classes)', String.raw`$\boldsymbol\mu=\operatorname{softmax}(\boldsymbol\eta)$`],
      ],
      why: String.raw`The **canonical** link sets $\theta=\eta$, so $\mu=A'(\eta)$: $A'=\theta$ for the Gaussian, $\sigma(\theta)$ for the Bernoulli, $e^\theta$ for the Poisson, and the softmax for the categorical. Each inverse link maps $\mathbb R$ into the valid range of the mean.`,
    },
    {
      kind: 'widget',
      title: 'Why the canonical link is so convenient',
      body: String.raw`Choose the **canonical link**: set the natural parameter equal to the linear predictor, $\theta=\eta=\mathbf w^\top\mathbf x+b$.`,
      widget: {
        type: 'StepReveal',
        props: {
          steps: [
            String.raw`Per-example loss: $\;\ell=-\log p(y\mid\eta)=A(\eta)-\eta\,y-\log h(y)$.`,
            String.raw`Derivative in $\eta$: $\;\dfrac{\partial\ell}{\partial\eta}=A'(\eta)-y=\mu-y$.`,
            String.raw`Chain rule: $\;\nabla_{\mathbf w}\ell=(\mu-y)\,\mathbf x$. **Prediction minus target, times input**, for every GLM with a canonical link.`,
            String.raw`Second derivative: $\;\nabla^2_{\mathbf w}\ell=A''(\eta)\,\mathbf x\mathbf x^\top=\operatorname{Var}[y]\,\mathbf x\mathbf x^\top\succeq0$, so the loss is **convex**.`,
          ],
          notes: ['the log h(y) term does not depend on w', 'A′ = mean', 'Gaussian: (ŷ − y)x; Bernoulli: (p − y)x; softmax: (p − y)xᵀ', 'a variance is never negative, so no bad local minima'],
        },
      },
    },
    {
      kind: 'mcq',
      prompt: String.raw`For a GLM with canonical link and mean $\mu=g^{-1}(\mathbf w^\top\mathbf x+b)$, what is the gradient of the per-example negative log-likelihood with respect to $\mathbf w$?`,
      choices: [
        String.raw`$(\mu-y)\,\mathbf x$`,
        String.raw`$(\mu-y)\,A''(\eta)\,\mathbf x$`,
        String.raw`$(y-\mu)\,\mathbf x$`,
        String.raw`$\log(\mu/y)\,\mathbf x$`,
      ],
      answer: 0,
      why: String.raw`With $\theta=\eta$, $\partial\ell/\partial\eta=A'(\eta)-y=\mu-y$, and the chain rule multiplies by $\mathbf x$. An extra factor $A''(\eta)$ is what **squared error** through the inverse link would give, and a **non-canonical** link adds a factor $(g^{-1})'(\eta)/\operatorname{Var}[y]$; $(y-\mu)\mathbf x$ is the gradient of the log-likelihood, i.e. the ascent direction.`,
    },
    {
      kind: 'explain',
      title: 'Example: Poisson regression for counts',
      body: String.raw`Counts (clicks per day, mutations per gene, photons per pixel) are non-negative integers. A **Poisson regression** uses the log link:
$$\mu=e^{\mathbf w^\top\mathbf x+b}>0,\qquad\ell=\mu-y\log\mu\ (+\log y!).$$
Effects are **multiplicative**: raising $x_j$ by 1 multiplies the expected count by $e^{w_j}$. The plot compares the three inverse links: identity (any real), sigmoid (into $(0,1)$) and exponential (into $(0,\infty)$). Each maps the linear predictor into the range where the mean must live.`,
      widget: {
        type: 'FunctionPlot',
        props: { fns: ['x', '1/(1+exp(-x))', 'exp(x)'], x: [-3, 3], y: [-1.5, 4], labels: ['identity (Gaussian)', 'sigmoid (Bernoulli)', 'exp (Poisson)'], xLabel: 'η', yLabel: 'μ' },
      },
    },
    {
      kind: 'numeric',
      prompt: String.raw`In a Poisson regression, $w_j=0.4$. By what factor does the expected count change when $x_j$ increases by 1 (other inputs fixed)? (2 decimals)`,
      answer: 1.49,
      tolerance: 0.01,
      why: String.raw`$\mu\propto e^{w_jx_j}$, so the ratio is $e^{0.4}\approx1.49$: about 49% more counts. Adding $0.4$ to the count would be the identity-link (linear-regression) reading, which is wrong here.`,
    },
    {
      kind: 'truefalse',
      prompt: 'In Poisson regression with the log link, the predicted mean count is positive for every choice of weights and inputs.',
      answer: true,
      why: String.raw`$\mu=e^\eta>0$ for every real $\eta$. Ordinary linear regression on counts can predict negative counts, one reason to prefer the GLM.`,
    },
    {
      kind: 'explain',
      title: 'Fitting GLMs, and GLMs inside neural nets',
      body: String.raw`Apart from the Gaussian case there is no closed form, but the loss is convex (canonical link), so:
- [gradient descent](@ml/gradient-descent) or SGD with gradient $\frac1n\sum_i(\mu_i-y_i)\mathbf x_i$ works;
- **Newton's method** uses the Hessian $\tfrac1n X^\top SX$ (same $1/n$ scaling as the gradient) with $S=\operatorname{diag}(A''(\eta_i))$. Each Newton step is a weighted least-squares problem, hence the classical name **IRLS**, iteratively reweighted least squares. See [second-order methods](@ml/second-order-methods).

**Deep-learning view.** A network's final layer and loss form a GLM on the learned features $\boldsymbol\phi(\mathbf x)$ of the last hidden layer: a linear output with MSE for regression, sigmoid + binary cross-entropy, softmax + cross-entropy, or exp + Poisson loss for counts. Picking an output head means picking an exponential family.`,
    },
    {
      kind: 'multi',
      prompt: 'Which of these are generalized linear models (as usually defined, in the original inputs x)? Select all that apply.',
      choices: [
        'Least-squares linear regression',
        'Logistic regression',
        'Softmax (multinomial logistic) regression',
        'A two-layer neural network with a ReLU hidden layer',
        'Poisson regression with a log link',
      ],
      answers: [0, 1, 2, 4],
      why: String.raw`A GLM's mean depends on $\mathbf x$ only through **one** linear predictor $\mathbf w^\top\mathbf x+b$ (one per class for softmax). A ReLU hidden layer makes the predictor a nonlinear function of $\mathbf x$, so the network is not a GLM in $\mathbf x$. Its output layer, though, is a GLM on the hidden features.`,
    },
    {
      kind: 'fill',
      prompt: String.raw`In a GLM the mean is $\mu=g^{-1}(\eta)$, where $g$ is the ___ function and $\eta=\mathbf w^\top\mathbf x+b$ is the linear ___. The target follows an ___-family distribution.`,
      bank: ['link', 'predictor', 'exponential', 'kernel', 'residual', 'activation', 'uniform'],
      answer: ['link', 'predictor', 'exponential'],
      why: String.raw`Link, linear predictor and exponential family are the three ingredients. In neural-net language $g^{-1}$ plays the role of the output **activation**, but in GLM terminology $g$ itself is called the link.`,
    },
    {
      kind: 'order',
      prompt: 'Order one gradient step for a canonical-link GLM on a single example (x, y).',
      steps: [
        String.raw`Compute the linear predictor $\eta=\mathbf w^\top\mathbf x+b$`,
        String.raw`Apply the inverse link to get the mean $\mu=g^{-1}(\eta)$`,
        String.raw`Evaluate the loss $-\log p(y\mid\mu)$`,
        String.raw`Update $\mathbf w\leftarrow\mathbf w-\eta_{\text{lr}}\,(\mu-y)\,\mathbf x$`,
      ],
      why: String.raw`It is a forward pass (linear score → mean → loss) followed by the update with the gradient $(\mu-y)\mathbf x$. (The learning rate is written $\eta_{\text{lr}}$ to avoid clashing with the linear predictor $\eta$.)`,
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- GLM = linear predictor $\eta=\mathbf w^\top\mathbf x+b$ + link $g(\mu)=\eta$ + exponential-family distribution for $y$.
- Exponential family $h(y)e^{\theta y-A(\theta)}$: $A'$ gives the mean, $A''$ the variance.
- Canonical links: identity (Gaussian), logit (Bernoulli), log (Poisson), softmax (categorical).
- With a canonical link: gradient $(\mu-y)\mathbf x$, convex loss, Newton = IRLS.
- The standard output heads + losses in deep learning (linear + MSE, sigmoid, softmax, Poisson) are GLMs on learned features.`,
    },
  ],
  references: [
    { authors: 'J. A. Nelder & R. W. M. Wedderburn', title: 'Generalized Linear Models', year: 1972, venue: 'Journal of the Royal Statistical Society, Series A 135(3), 370–384' },
    { authors: 'P. McCullagh & J. A. Nelder', title: 'Generalized Linear Models', year: 1989, venue: '2nd ed., Chapman & Hall' },
    { authors: 'K. P. Murphy', title: 'Probabilistic Machine Learning: An Introduction', year: 2022, venue: 'MIT Press', detail: 'Ch. 12 (generalized linear models)', url: 'https://probml.github.io/pml-book/book1.html' },
    { authors: 'C. M. Bishop', title: 'Pattern Recognition and Machine Learning', year: 2006, venue: 'Springer', detail: 'Ch. 2.4 (exponential family), 4.3.6 (canonical link functions)' },
  ],
} satisfies LessonContent;
