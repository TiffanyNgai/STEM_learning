import type { LessonContent } from '../../types';

export default {
  cards: [
    {
      kind: 'explain',
      title: 'Why does the kernel trick work?',
      body: String.raw`In [the kernel trick](@ml/kernel-trick), [SVMs](@ml/svms) and [Gaussian processes](@ml/gaussian-processes) the answer always took the same shape:
$$f(\mathbf x)=\sum_{i=1}^n\alpha_i\,k(\mathbf x_i,\mathbf x),$$
a weighted sum of kernel "bumps" centred on the training points. That is no coincidence. Each kernel defines its own space of functions, with its own notion of length, and in that space the best regularized fit **must** take this form.

The space is a **reproducing kernel Hilbert space** (RKHS). This lesson builds it and proves the **representer theorem**, which turns a search over infinitely many functions into a problem with $n$ unknowns.`,
    },
    {
      kind: 'recall',
      title: 'From mathematics: Hilbert spaces',
      points: [
        String.raw`A Hilbert space is a vector space with an inner product $\langle\cdot,\cdot\rangle$ that is complete in the norm $\lVert f\rVert=\sqrt{\langle f,f\rangle}$.`,
        'Its elements can be functions: think of a function as a vector with infinitely many coordinates.',
        String.raw`Every vector splits uniquely into a part inside a closed subspace and a part orthogonal to it, with $\lVert f\rVert^2=\lVert f_\parallel\rVert^2+\lVert f_\perp\rVert^2$ (Pythagoras).`,
        String.raw`Riesz: every continuous linear functional $L$ has the form $L(f)=\langle f,g\rangle$ for a unique $g$.`,
      ],
      link: 'math/hilbert-spaces',
    },
    {
      kind: 'explain',
      title: 'Building the space from the kernel',
      body: String.raw`Start with a positive semidefinite kernel $k$. For each point $\mathbf x$, the function $k(\mathbf x,\cdot)$ is one bump. Take all finite combinations $f=\sum_ia_i\,k(\mathbf x_i,\cdot)$ and define, for $g=\sum_jb_j\,k(\mathbf z_j,\cdot)$,
$$\langle f,g\rangle_{\mathcal H}=\sum_{i,j}a_ib_j\,k(\mathbf x_i,\mathbf z_j).$$
In particular $\lVert f\rVert^2_{\mathcal H}=\mathbf a^\top K\mathbf a\ge0$ because $K$ is PSD. Adding all limits of such sums (completion) gives the Hilbert space $\mathcal H_k$.

**Moore–Aronszajn theorem** (Aronszajn 1950): every positive semidefinite kernel has exactly one RKHS, and every RKHS has exactly one kernel.`,
    },
    {
      kind: 'explain',
      title: 'The reproducing property',
      body: String.raw`From the definition, taking $g=k(\mathbf x,\cdot)$:
$$\langle f,k(\mathbf x,\cdot)\rangle_{\mathcal H}=\sum_ia_ik(\mathbf x_i,\mathbf x)=f(\mathbf x).$$
**Evaluating $f$ at $\mathbf x$ is an inner product with the bump at $\mathbf x$.** In particular $\langle k(\mathbf x,\cdot),k(\mathbf z,\cdot)\rangle=k(\mathbf x,\mathbf z)$, so $\boldsymbol\phi(\mathbf x)=k(\mathbf x,\cdot)$ is a feature map for $k$ (the **canonical feature map**).

Consequence via Cauchy–Schwarz: $|f(\mathbf x)-f(\mathbf z)|\le\lVert f\rVert_{\mathcal H}\,\lVert k(\mathbf x,\cdot)-k(\mathbf z,\cdot)\rVert_{\mathcal H}$. A small RKHS norm forces $f$ to change slowly wherever the kernel says two points are similar. **The norm measures roughness**, which is why penalizing it regularizes.`,
    },
    {
      kind: 'numeric',
      prompt: String.raw`Gaussian kernel $k(x,z)=e^{-(x-z)^2/2}$ (so $\ell=1$). Let $f=2\,k(0,\cdot)-k(1,\cdot)$. Compute $\lVert f\rVert^2_{\mathcal H}$. (3 decimals)`,
      answer: 2.574,
      tolerance: 0.003,
      why: String.raw`$\lVert f\rVert^2=\mathbf a^\top K\mathbf a$ with $\mathbf a=(2,-1)$: $4k(0,0)-4k(0,1)+k(1,1)=4-4e^{-1/2}+1\approx5-2.426=2.574$. Using $-2k(0,1)$ instead of $-4k(0,1)$ (forgetting the cross term appears twice) gives $3.787$.`,
    },
    {
      kind: 'mcq',
      prompt: String.raw`Same kernel and $f=2\,k(0,\cdot)-k(1,\cdot)$. Using the reproducing property, what is $f(1)$?`,
      choices: [String.raw`$2e^{-1/2}-1\approx0.213$`, String.raw`$2e^{-1/2}\approx1.213$`, String.raw`$5-4e^{-1/2}\approx2.574$`, String.raw`$e^{-1/2}\approx0.607$`],
      answer: 0,
      why: String.raw`$f(1)=\langle f,k(1,\cdot)\rangle=2k(0,1)-k(1,1)=2e^{-1/2}-1\approx0.213$. Dropping the second term gives $1.213$; the value $2.574$ is the squared norm, not a function value.`,
    },
    {
      kind: 'explain',
      title: 'The representer theorem',
      body: String.raw`**Theorem** (Kimeldorf & Wahba 1971 for squared loss; general form by Schölkopf, Herbrich & Smola 2001). Let $L$ be any loss on the training predictions and $\Omega$ a strictly increasing function. Then every minimizer of
$$\min_{f\in\mathcal H_k}\ L\big(f(\mathbf x_1),\dots,f(\mathbf x_n)\big)+\Omega\big(\lVert f\rVert_{\mathcal H}\big)$$
can be written as $f^*=\sum_{i=1}^n\alpha_i\,k(\mathbf x_i,\cdot)$.

The loss can be squared error, hinge, logistic, anything. The proof is three lines of geometry (next card).`,
    },
    {
      kind: 'widget',
      title: 'Proof sketch',
      widget: {
        type: 'StepReveal',
        props: {
          steps: [
            String.raw`Let $S=\operatorname{span}\{k(\mathbf x_1,\cdot),\dots,k(\mathbf x_n,\cdot)\}$ and split any $f=f_\parallel+f_\perp$ with $f_\parallel\in S$, $f_\perp\perp S$.`,
            String.raw`At a training point: $f(\mathbf x_i)=\langle f,k(\mathbf x_i,\cdot)\rangle=\langle f_\parallel,k(\mathbf x_i,\cdot)\rangle+0=f_\parallel(\mathbf x_i)$. The loss ignores $f_\perp$.`,
            String.raw`Pythagoras: $\lVert f\rVert^2=\lVert f_\parallel\rVert^2+\lVert f_\perp\rVert^2\ge\lVert f_\parallel\rVert^2$, so $\Omega(\lVert f\rVert)>\Omega(\lVert f_\parallel\rVert)$ whenever $f_\perp\ne0$.`,
            String.raw`So any $f$ with $f_\perp\ne0$ is beaten by $f_\parallel$: every minimizer lies in $S$, i.e. $f^*=\sum_i\alpha_ik(\mathbf x_i,\cdot)$. $\ \blacksquare$`,
          ],
          notes: ['orthogonal decomposition', 'reproducing property', 'strictly increasing Ω', 'n coefficients instead of a function'],
        },
      },
    },
    {
      kind: 'truefalse',
      prompt: 'The representer theorem only holds when the loss is squared error.',
      answer: false,
      why: String.raw`The proof never used the form of the loss: only that it depends on $f$ through the training values $f(\mathbf x_i)$, plus a strictly increasing penalty on $\lVert f\rVert_{\mathcal H}$. Hinge loss (SVMs), logistic loss and squared error are all covered.`,
    },
    {
      kind: 'explain',
      title: 'Kernel ridge regression, derived',
      body: String.raw`Take squared loss and penalty $\lambda\lVert f\rVert^2_{\mathcal H}$. By the theorem $f=\sum_j\alpha_jk(\mathbf x_j,\cdot)$, so the training predictions are $K\boldsymbol\alpha$ and $\lVert f\rVert^2=\boldsymbol\alpha^\top K\boldsymbol\alpha$. The objective becomes
$$\lVert\mathbf y-K\boldsymbol\alpha\rVert^2+\lambda\,\boldsymbol\alpha^\top K\boldsymbol\alpha.$$
Setting the gradient to zero gives $K\big((K+\lambda I)\boldsymbol\alpha-\mathbf y\big)=\mathbf 0$, solved by
$$\boldsymbol\alpha=(K+\lambda I)^{-1}\mathbf y,$$
the formula from the kernel trick lesson, and the GP posterior mean with $\lambda=\sigma_n^2$. One problem, three viewpoints: feature-space ridge, RKHS regularization, Bayesian GP.`,
    },
    {
      kind: 'widget',
      title: 'See the representer theorem',
      body: String.raw`Kernel ridge regression with a Gaussian kernel. Each dashed curve is one term $\alpha_i\,k(x_i,\cdot)$, a bump centred on a data point and scaled by its coefficient; the blue fit is exactly their sum. Drag points and watch the bumps rescale.

The "noise" slider sets $\lambda=\sigma_n^2$: larger $\lambda$ shrinks every $\alpha_i$ and smooths the fit. Shrinking $\ell$ narrows the bumps, so the fit falls back toward 0 between points.`,
      widget: { type: 'MlGPPosterior', props: { kernel: 'rbf', lengthScale: 0.25, noise: 0.2, samples: 0, showBand: false, showBases: true, controls: false, meanLabel: 'kernel ridge fit' } },
    },
    {
      kind: 'numeric',
      prompt: String.raw`Kernel ridge regression with one data point $(x_1,y_1)=(0,2)$, Gaussian kernel $k(x,z)=e^{-(x-z)^2/2}$ and $\lambda=0.5$. What is the prediction $f(1)$? (3 decimals)`,
      answer: 0.809,
      tolerance: 0.002,
      why: String.raw`$\alpha_1=y_1/(k(0,0)+\lambda)=2/1.5\approx1.333$, and $f(1)=\alpha_1k(0,1)=1.333\times e^{-1/2}\approx0.809$. Forgetting $\lambda$ gives $2e^{-1/2}\approx1.213$.`,
    },
    {
      kind: 'multi',
      prompt: String.raw`Which training problems does the representer theorem (with RKHS $\mathcal H_k$) cover, so that the solution is $\sum_i\alpha_ik(\mathbf x_i,\cdot)$? Select all that apply.`,
      choices: [
        String.raw`Soft-margin SVM: hinge loss $+\ \tfrac1{2C}\lVert f\rVert^2_{\mathcal H}$`,
        String.raw`Kernel ridge regression: squared loss $+\ \lambda\lVert f\rVert^2_{\mathcal H}$`,
        String.raw`Kernel logistic regression: log-loss $+\ \lambda\lVert f\rVert^2_{\mathcal H}$`,
        'A deep neural network trained with weight decay on its weights',
      ],
      answers: [0, 1, 2],
      why: String.raw`Each of the kernel methods is "loss on training values plus an increasing function of the RKHS norm". A neural network's weight decay penalizes its parameters, not an RKHS norm of a fixed kernel, and its function class is not an RKHS, so the theorem does not apply. (For SVMs the unpenalized bias $b$ is handled by a small extension.)`,
    },
    {
      kind: 'match',
      prompt: 'Match each concept to its formula.',
      pairs: [
        ['Reproducing property', String.raw`$\langle f,k(\mathbf x,\cdot)\rangle_{\mathcal H}=f(\mathbf x)$`],
        ['Canonical feature map', String.raw`$\boldsymbol\phi(\mathbf x)=k(\mathbf x,\cdot)$`],
        [String.raw`Squared norm of $\sum_i\alpha_ik(\mathbf x_i,\cdot)$`, String.raw`$\boldsymbol\alpha^\top K\boldsymbol\alpha$`],
        ['Kernel ridge coefficients', String.raw`$(K+\lambda I)^{-1}\mathbf y$`],
      ],
      why: String.raw`The inner product on bumps is defined by $k$ itself, which yields the reproducing property, makes $k(\mathbf x,\cdot)$ a feature map, gives the quadratic-form norm, and, with the representer theorem, the closed-form ridge solution.`,
    },
    {
      kind: 'explain',
      title: 'What the norm penalizes',
      body: String.raw`For translation-invariant kernels $k(\mathbf x,\mathbf z)=\kappa(\mathbf x-\mathbf z)$ the RKHS norm has a Fourier form, up to a constant factor:
$$\lVert f\rVert^2_{\mathcal H}\propto\int\frac{|\hat f(\boldsymbol\omega)|^2}{\hat\kappa(\boldsymbol\omega)}\,d\boldsymbol\omega.$$
The Gaussian kernel's spectrum $\hat\kappa$ decays like $e^{-\ell^2\lVert\boldsymbol\omega\rVert^2/2}$, so high frequencies are penalized enormously: its RKHS contains only very smooth functions. The Matérn kernels' spectra decay polynomially, giving Sobolev spaces of functions with finitely many derivatives.

A subtlety: for an infinite-dimensional RKHS, sample paths of the GP with the same kernel lie outside $\mathcal H_k$ with probability one. The GP mean lives in the RKHS; the random draws are rougher (Kanagawa et al. 2018).`,
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- Every PSD kernel defines a unique Hilbert space of functions $\mathcal H_k$ built from bumps $k(\mathbf x,\cdot)$ (Moore–Aronszajn).
- Reproducing property: $f(\mathbf x)=\langle f,k(\mathbf x,\cdot)\rangle$; so $k(\mathbf x,\cdot)$ is a feature map and the norm controls smoothness.
- Representer theorem: loss on training values + increasing function of $\lVert f\rVert_{\mathcal H}$ ⇒ $f^*=\sum_i\alpha_ik(\mathbf x_i,\cdot)$.
- Kernel ridge regression: $\boldsymbol\alpha=(K+\lambda I)^{-1}\mathbf y$, identical to the GP posterior mean with $\lambda=\sigma_n^2$.
- SVMs, kernel ridge, kernel logistic regression and GP means all live in the same RKHS framework.`,
    },
  ],
  references: [
    { authors: 'N. Aronszajn', title: 'Theory of reproducing kernels', year: 1950, venue: 'Transactions of the American Mathematical Society 68(3), 337–404' },
    { authors: 'G. S. Kimeldorf & G. Wahba', title: 'Some results on Tchebycheffian spline functions', year: 1971, venue: 'Journal of Mathematical Analysis and Applications 33(1), 82–95' },
    { authors: 'B. Schölkopf, R. Herbrich & A. J. Smola', title: 'A generalized representer theorem', year: 2001, venue: 'Computational Learning Theory (COLT 2001), Lecture Notes in Computer Science 2111, Springer, 416–426' },
    { authors: 'B. Schölkopf & A. J. Smola', title: 'Learning with Kernels', year: 2002, venue: 'MIT Press', detail: 'Ch. 2.2 (RKHS), Ch. 4 (regularization, representer theorem)' },
    { authors: 'M. Kanagawa, P. Hennig, D. Sejdinovic & B. K. Sriperumbudur', title: 'Gaussian Processes and Kernel Methods: A Review on Connections and Equivalences', year: 2018, venue: 'arXiv:1807.02582', url: 'https://arxiv.org/abs/1807.02582' },
  ],
} satisfies LessonContent;
