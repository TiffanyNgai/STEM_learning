import type { LessonContent } from '../../types';

export default {
  cards: [
    {
      kind: 'explain',
      title: 'From hard to soft clusters',
      body: String.raw`[k-means](@ml/k-means) puts every point in exactly one cluster, even a point sitting right between two clusters. It also draws only straight boundaries and prefers round clusters of similar size.

A **Gaussian mixture model (GMM)** fixes all three. It is a **probabilistic** model of how the data were generated, so each point gets a **probability** of belonging to each cluster, and each cluster can have its own shape, orientation and size.

Fitting it needs a new tool, the **EM algorithm**, which turns out to be a soft version of Lloyd's algorithm.`,
    },
    {
      kind: 'recall',
      title: 'Maximum likelihood',
      points: [
        String.raw`The likelihood $L(\theta)=p(\mathcal D\mid\theta)$ is the probability of the observed data as a function of the parameters $\theta$.`,
        String.raw`For i.i.d. data, $\log L(\theta)=\sum_i\log p(x_i\mid\theta)$.`,
        String.raw`The MLE maximizes $\log L$. For one Gaussian it is the sample mean and the sample covariance (dividing by $n$).`,
      ],
      link: 'stats/maximum-likelihood',
    },
    {
      kind: 'explain',
      title: 'The mixture model',
      body: String.raw`Imagine generating each point in two stages:
1. Roll a $K$-sided die with probabilities $\pi_1,\dots,\pi_K$ (the **mixing weights**, summing to 1) to pick a component $z_i$.
2. Draw $x_i$ from that component's Gaussian, $\mathcal N(\mu_{z_i},\Sigma_{z_i})$, with its own mean $\mu_k$ and covariance $\Sigma_k$.

We see $x_i$ but not $z_i$: $z$ is a **latent** (hidden) variable. Summing over the possibilities gives the density
$$p(x)=\sum_{k=1}^K \pi_k\,\mathcal N(x\mid\mu_k,\Sigma_k).$$
With enough components, such mixtures can approximate a very wide range of smooth densities.`,
    },
    {
      kind: 'explain',
      title: 'Responsibilities: who generated this point?',
      body: String.raw`Given parameters, Bayes' rule tells us how likely it is that component $k$ produced point $x_i$:
$$r_{ik}=p(z_i=k\mid x_i)=\frac{\pi_k\,\mathcal N(x_i\mid\mu_k,\Sigma_k)}{\sum_{j}\pi_j\,\mathcal N(x_i\mid\mu_j,\Sigma_j)} .$$
These **responsibilities** are non-negative and sum to 1 over $k$ for each point: a soft cluster assignment.

1D example: two components with equal weights and variance 1, means $0$ and $2$. The point $x=1$ is equally far from both, so $r=0.5$ each. The point $x=0$ has $r_{i1}=\dfrac{e^{0}}{e^{0}+e^{-2}}\approx0.88$.`,
    },
    {
      kind: 'numeric',
      prompt: String.raw`Same two 1D components (variance 1, means 0 and 2), but now $\pi_1=0.25$, $\pi_2=0.75$. What is the responsibility of component 1 for the point $x=1$?`,
      answer: 0.25,
      tolerance: 0.001,
      why: String.raw`At $x=1$ both Gaussian densities are equal, so they cancel: $r_{1}=\frac{0.25\,\phi}{0.25\,\phi+0.75\,\phi}=0.25$. When the likelihoods tie, the prior weights decide. Answering 0.5 ignores the mixing weights.`,
    },
    {
      kind: 'explain',
      title: 'Why not just maximize the likelihood?',
      body: String.raw`The log-likelihood is
$$\ell(\theta)=\sum_{i=1}^n\log\sum_{k=1}^K\pi_k\,\mathcal N(x_i\mid\mu_k,\Sigma_k).$$
The **log of a sum** does not split apart, so setting derivatives to zero gives no closed-form answer. But if we *knew* each $z_i$, the problem would be easy: fit one Gaussian per group and set $\pi_k$ to the fraction of points in group $k$.

**EM** (expectation–maximization; Dempster, Laird & Rubin, 1977) exploits this. It alternates between guessing the hidden $z$ softly and solving the easy problem with those guesses.`,
    },
    {
      kind: 'widget',
      title: 'The two steps of EM',
      widget: {
        type: 'StepReveal',
        props: {
          steps: [
            String.raw`**Initialize** $\pi_k,\mu_k,\Sigma_k$ (e.g. means at random data points or from k-means).`,
            String.raw`**E-step:** compute responsibilities $r_{ik}$ with the current parameters (Bayes' rule).`,
            String.raw`**M-step:** with $N_k=\sum_i r_{ik}$ (the "effective number" of points in component $k$): $\ \pi_k=\dfrac{N_k}{n},\quad \mu_k=\dfrac1{N_k}\sum_i r_{ik}x_i,\quad \Sigma_k=\dfrac1{N_k}\sum_i r_{ik}(x_i-\mu_k)(x_i-\mu_k)^\top.$`,
            String.raw`**Check:** compute $\ell(\theta)$; stop when it barely changes, otherwise go back to the E-step.`,
          ],
          notes: ['A starting guess.', 'Soft labels.', 'Weighted MLE: each point counts r_ik times.', 'ℓ never decreases.'],
        },
      },
    },
    {
      kind: 'numeric',
      prompt: String.raw`1D points $0, 2, 4$ have responsibilities for component 1 of $1,\ 0.5,\ 0$. What is the M-step update of $\mu_1$? (3 decimals)`,
      answer: 0.667,
      tolerance: 0.002,
      why: String.raw`$N_1=1+0.5+0=1.5$ and $\sum_i r_{i1}x_i=0+1+0=1$, so $\mu_1=1/1.5\approx0.667$. Dividing by $n=3$ instead of $N_1$ gives $0.333$, which is wrong: the weighted mean divides by the total weight.`,
    },
    {
      kind: 'widget',
      title: 'Watch EM fit a mixture',
      body: String.raw`Points are grey until the first E-step. After it, each point's colour **blends** the component colours by its responsibilities: points between clusters look mixed. Ellipses show the $1\sigma$ and $2\sigma$ contours of each Gaussian.

Press **Step** or **Play**. The log-likelihood plot only ever goes up. Then try **New init** many times: occasionally (on this data, roughly one start in thirty) EM settles at a lower plateau, a different **local maximum**, e.g. one wide component covering two clusters.`,
      widget: { type: 'MlGmmEM', props: { K: 3, seed: 1, dataset: 'mixed' } },
    },
    {
      kind: 'explain',
      title: 'Why EM never goes downhill',
      body: String.raw`For any distribution $q(z)$ over the hidden labels, one can show
$$\log p(x\mid\theta)=\underbrace{\mathbb E_{q}\Big[\log\frac{p(x,z\mid\theta)}{q(z)}\Big]}_{\mathcal L(q,\theta)\ \text{(lower bound, ELBO)}}+\ \mathrm{KL}\big(q\,\|\,p(z\mid x,\theta)\big).$$
Since [KL divergence](@stats/entropy-kl) is $\ge0$, $\mathcal L$ is a lower bound on the log-likelihood.
- **E-step:** set $q$ to the posterior $p(z\mid x,\theta)$, i.e. the responsibilities. The KL becomes 0 and the bound touches $\log p$.
- **M-step:** maximize $\mathcal L$ over $\theta$ with $q$ fixed.

So EM is coordinate ascent on $\mathcal L$, and the log-likelihood never decreases. The same bound reappears in [latent variable models](@ml/latent-variable-models) and VAEs.`,
    },
    {
      kind: 'order',
      prompt: 'Order one EM iteration and its check.',
      steps: [
        'Start from the current parameters θ',
        String.raw`E-step: set $q(z_i)=p(z_i\mid x_i,\theta)$, so the bound is tight`,
        String.raw`M-step: maximize the lower bound $\mathcal L(q,\theta)$ over θ`,
        'Recompute the log-likelihood and test for convergence',
      ],
      why: 'The E-step needs the current parameters to compute the posterior over hidden labels; the M-step then improves the parameters using those fixed soft labels. Only afterwards is the new log-likelihood evaluated, and it cannot be lower than before.',
    },
    {
      kind: 'explain',
      title: 'Pitfalls and the link to k-means',
      body: String.raw`- **Local maxima:** like k-means, EM depends on initialization. Use restarts or initialize from k-means.
- **Singularities:** if a component's mean sits on one data point and its covariance shrinks to zero, its density there goes to infinity, so $\ell\to\infty$. This is a degenerate solution, not a good fit. Fix it with a small ridge on $\Sigma_k$ (as the widget does), a prior (MAP-EM), or by restarting collapsed components.
- **Choosing $K$:** $\ell$ always grows with $K$. Compare models with a penalized criterion such as BIC, or with held-out likelihood.
- **k-means as a limit:** with all covariances fixed to $\sigma^2 I$, equal weights, and $\sigma\to0$, responsibilities become 0 or 1 for the nearest mean, and EM becomes Lloyd's algorithm.`,
    },
    {
      kind: 'multi',
      prompt: 'Which statements about EM for Gaussian mixtures are true?',
      choices: [
        'Each iteration cannot decrease the log-likelihood.',
        'It is guaranteed to reach the global maximum of the likelihood.',
        'Responsibilities for one point sum to 1 across components.',
        'Letting a covariance shrink onto a single point can make the likelihood unbounded.',
        'Adding more components can only lower the maximized training log-likelihood.',
      ],
      answers: [0, 2, 3],
      why: String.raw`EM is coordinate ascent on a bound that is tight after each E-step, so $\ell$ is non-decreasing, but only a local maximum (or saddle) is guaranteed. Responsibilities are a posterior over components and sum to 1. Collapsing components give unbounded likelihood. More components never lower the best training likelihood; they can only raise it, which is why $K$ needs a penalty.`,
    },
    {
      kind: 'match',
      prompt: 'Match each k-means idea with its GMM/EM counterpart.',
      pairs: [
        ['Assign to nearest centroid', 'E-step: responsibilities'],
        ['Centroid = mean of members', 'M-step: responsibility-weighted mean'],
        ['Within-cluster sum of squares J', 'Negative log-likelihood'],
        ['Round clusters only', 'Full covariance Σ_k per component'],
      ],
      why: 'EM for GMMs generalizes Lloyd: hard assignments become probabilities, plain means become weighted means, the squared-error objective becomes a likelihood, and each cluster gains its own covariance (shape and orientation).',
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- A GMM models $p(x)=\sum_k\pi_k\mathcal N(x\mid\mu_k,\Sigma_k)$ with a hidden component label $z$.
- **Responsibilities** $r_{ik}=p(z_i=k\mid x_i)$ are soft cluster assignments from Bayes' rule.
- **EM** alternates E (compute $r_{ik}$) and M (weighted MLE: $\pi_k=N_k/n$, weighted means and covariances).
- EM is coordinate ascent on the ELBO, so the log-likelihood never decreases; it reaches a **local** optimum.
- Watch for collapsing components, choose $K$ with a penalty (e.g. BIC), and remember k-means is the hard, small-variance limit.`,
    },
  ],
  references: [
    { authors: 'A. P. Dempster, N. M. Laird & D. B. Rubin', title: 'Maximum Likelihood from Incomplete Data via the EM Algorithm', year: 1977, venue: 'Journal of the Royal Statistical Society, Series B 39(1), 1–38' },
    { authors: 'C. M. Bishop', title: 'Pattern Recognition and Machine Learning', year: 2006, venue: 'Springer', detail: 'Ch. 9 (Sec. 9.2–9.4)' },
    { authors: 'K. P. Murphy', title: 'Probabilistic Machine Learning: An Introduction', year: 2022, venue: 'MIT Press', detail: 'Sec. 8.7, 21.4', url: 'https://probml.github.io/pml-book/book1.html' },
    { authors: 'G. J. McLachlan & T. Krishnan', title: 'The EM Algorithm and Extensions', year: 2008, venue: '2nd ed., Wiley' },
  ],
} satisfies LessonContent;
