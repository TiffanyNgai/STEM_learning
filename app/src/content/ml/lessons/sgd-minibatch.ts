import type { LessonContent } from '../../types';

export default {
  cards: [
    {
      kind: 'recall',
      title: 'From the gradient-descent lesson',
      points: [
        String.raw`GD update: $\boldsymbol\theta_{k+1}=\boldsymbol\theta_k-\eta\nabla L(\boldsymbol\theta_k)$; stable on a quadratic iff $\eta<2/\lambda_{\max}$.`,
        String.raw`The training loss is an average: $L(\boldsymbol\theta)=\frac1n\sum_{i=1}^n\ell_i(\boldsymbol\theta)$, so one exact gradient costs a full pass over the data.`,
        String.raw`SGD replaces it by a mini-batch average $\mathbf g=\frac1{|B|}\sum_{i\in B}\nabla\ell_i$, an **unbiased** estimate: $\mathbb E[\mathbf g]=\nabla L$.`,
      ],
      link: 'ml/gradient-descent',
    },
    {
      kind: 'explain',
      title: 'Why accept a noisy gradient?',
      body: String.raw`Suppose $n=10^6$ images. One full gradient costs $10^6$ per-example gradients. For the same cost, SGD with batch size $|B|=100$ takes **10 000 steps**.

Early in training every example "points the same way" roughly, so 100 examples give nearly as good a direction as a million. You get ~10 000 decent steps instead of one perfect one.

Vocabulary:
- **Mini-batch** $B$: the random subset used for one step.
- **Epoch**: one pass through the data, i.e. $n/|B|$ steps.
- In practice data are **shuffled** once per epoch and cut into consecutive batches (sampling without replacement).`,
    },
    {
      kind: 'numeric',
      prompt: String.raw`A dataset has $n=50\,000$ examples and you use batch size 100. How many SGD steps make one epoch?`,
      answer: 500,
      why: String.raw`An epoch visits every example once: $n/|B|=50\,000/100=500$ steps. Each step costs 1/500 of a full gradient.`,
    },
    {
      kind: 'widget',
      title: 'See the noise',
      body: String.raw`Fitting a line $y\approx wx+b$ to 200 points; the plane shows the loss over $(w,b)$ and ★ is the exact least-squares solution. The **orange** path is SGD, the dashed grey one full-batch GD using the same $\eta$.

Press Play. Then try:
- $B=1$ vs $B=64$: how wide is the jitter around ★?
- with $B=1$, compare **constant** $\eta$ with the decaying $\eta/(1+k/50)$.
- watch the bottom plot: SGD's error stops falling at a **noise floor**.`,
      widget: { type: 'MlSGDNoise', props: { batch: 2, lr: 0.3 } },
    },
    {
      kind: 'explain',
      title: 'Bigger batches, less noise',
      body: String.raw`Let one random example's gradient $\nabla\ell_i$ have covariance $\Sigma$ around the true gradient (the spread across examples). If the $|B|$ examples are drawn independently,
$$\mathrm{Cov}(\mathbf g)=\frac{\Sigma}{|B|}.$$
This is the familiar $1/n$ variance of a sample mean ([expectation & variance](@stats/expectation-variance)). Sampling *without* replacement from a finite set shrinks it a bit more, by the factor $\frac{n-|B|}{n-1}$.

So the noise *standard deviation* falls like $1/\sqrt{|B|}$: **4× the batch buys only 2× less noise**, at 4× the compute per step. That diminishing return is why moderate batches are common.`,
    },
    {
      kind: 'numeric',
      prompt: String.raw`With batch size 1, one coordinate of the stochastic gradient has standard deviation 8 around its mean. Assuming independent sampling, what is its standard deviation with batch size 64?`,
      answer: 1,
      why: String.raw`Variance scales as $1/|B|$, so standard deviation scales as $1/\sqrt{|B|}=1/8$: $8/8=1$. A common mistake is dividing by 64; that is the variance factor, not the standard deviation.`,
    },
    {
      kind: 'explain',
      title: 'The noise floor',
      body: String.raw`Take the 1-D quadratic $L=\frac\lambda2\theta^2$ with a noisy gradient $\lambda\theta+\xi$, where $\xi$ has mean 0 and variance $\sigma^2$. SGD gives $\theta_{k+1}=(1-\eta\lambda)\theta_k-\eta\xi_k$, so $V_k=\mathbb E[\theta_k^2]$ obeys $V_{k+1}=(1-\eta\lambda)^2V_k+\eta^2\sigma^2$. It settles at
$$V_\infty=\frac{\eta\,\sigma^2}{\lambda(2-\eta\lambda)}\approx\frac{\eta\sigma^2}{2\lambda}\quad(\eta\lambda\ll1).$$
With a **constant** step, SGD converges fast to a *neighbourhood* of the optimum whose size is proportional to $\eta$ and to the gradient noise. It never settles exactly. Smaller $\eta$ or a larger batch shrinks the floor, but a smaller $\eta$ also slows the approach.`,
      widget: {
        type: 'FunctionPlot',
        props: {
          fns: ['(1-eta)^(2*x)*9 + eta*4/B/(2-eta)*(1-(1-eta)^(2*x))', '(1-eta)^(2*x)*9'],
          x: [0, 60], y: [0, 5],
          params: [{ name: 'eta', min: 0.02, max: 1, value: 0.5, label: 'η' }, { name: 'B', min: 1, max: 64, value: 1, label: 'batch B' }],
          labels: ['SGD: E[θ²]', 'noise-free GD'], xLabel: 'step k', yLabel: 'E[θ_k²]',
        },
        caption: String.raw`$\lambda=1$, $\theta_0=3$, per-example noise variance 4 (so $\sigma^2=4/B$). The SGD curve flattens at $V_\infty$.`,
      },
    },
    {
      kind: 'numeric',
      prompt: String.raw`Using $V_\infty=\eta\sigma^2/(\lambda(2-\eta\lambda))$ with $\lambda=1$, $\sigma^2=1$ and $\eta=0.2$, what is the stationary mean-square error $V_\infty$? (3 decimal places)`,
      answer: 0.111,
      tolerance: 0.002,
      why: String.raw`$V_\infty=0.2\cdot1/(1\cdot(2-0.2))=0.2/1.8\approx0.111$. The small-step approximation $\eta\sigma^2/(2\lambda)=0.1$ is close but not exact.`,
    },
    {
      kind: 'explain',
      title: 'Robbins–Monro: decaying the step',
      body: String.raw`To reach the optimum *exactly* the step must shrink, but not too fast. Robbins & Monro (1951) introduced stochastic approximation with step sizes satisfying
$$\sum_{k}\eta_k=\infty\qquad\text{and}\qquad\sum_k\eta_k^2<\infty.$$
The first condition lets the iterates travel any distance; the second makes the accumulated noise $\sum\eta_k^2\sigma^2$ finite. $\eta_k=c/k$ satisfies both.

**What is actually guaranteed** (Bottou, Curtis & Nocedal 2018, §4), for an unbiased gradient with bounded variance:
- $L$-smooth, strongly convex, fixed $\eta$: **linear** convergence in expectation, but only to a noise ball of size $O(\eta)$.
- Same, with $\eta_k\propto1/k$ (suitably scaled): $\mathbb E[f(\boldsymbol\theta_k)]-f^*=O(1/k)$.
- Non-convex, smooth: the expected gradient norm goes to zero. That means a **stationary point**, not necessarily a minimum.`,
    },
    {
      kind: 'multi',
      prompt: String.raw`Which step-size sequences satisfy both Robbins–Monro conditions $\sum\eta_k=\infty$, $\sum\eta_k^2<\infty$? ($k=1,2,\dots$)`,
      choices: ['$\\eta_k=0.1$ (constant)', '$\\eta_k=1/k$', '$\\eta_k=1/\\sqrt k$', '$\\eta_k=1/k^2$', '$\\eta_k=5/(k+100)$'],
      answers: [1, 4],
      why: String.raw`$1/k$ and $5/(k+100)$ both have a divergent harmonic-type sum and a convergent sum of squares. A constant fails $\sum\eta^2<\infty$. $1/\sqrt k$ also fails it, since $\sum1/k=\infty$ (it is still used in practice, often with iterate averaging). $1/k^2$ fails the first condition: the total distance is finite, so it can stall short of the optimum.`,
    },
    {
      kind: 'truefalse',
      prompt: String.raw`For a smooth non-convex loss, standard SGD theory guarantees convergence (in expectation) to a global minimum.`,
      answer: false,
      why: String.raw`Without convexity the standard guarantee is that $\mathbb E\|\nabla L\|$ becomes small, i.e. a stationary point (could be a saddle or a local minimum). Global guarantees need extra structure. In deep learning, SGD works well empirically even though the theory is weaker.`,
    },
    {
      kind: 'explain',
      title: 'Batch size in practice',
      body: String.raw`- **Hardware:** GPUs process a batch in parallel, so up to some size a bigger batch costs about the same wall-clock time per step.
- **Diminishing returns:** beyond a "critical" size, doubling $|B|$ no longer halves the number of steps needed, because the error is dominated by curvature rather than noise.
- **Learning rate couples to $|B|$:** larger batches tolerate larger $\eta$ (see [learning-rate schedules](@ml/learning-rate-schedules) for the linear scaling rule).
- **Generalization:** Keskar et al. (2017) reported that very large batches can generalize worse and linked this to "sharper" minima. Later work showed much of the gap can be closed by retuning $\eta$ and schedules, so treat this as an empirical tendency, not a law.`,
    },
    {
      kind: 'order',
      prompt: 'Order one epoch of mini-batch SGD with shuffling.',
      steps: [
        'Randomly permute the n training examples',
        'Cut the permutation into consecutive batches of size |B|',
        'For the next batch, compute the average per-example gradient',
        'Update θ ← θ − η_k g and advance k',
        'Repeat until all n/|B| batches are used, then start a new epoch',
      ],
      why: 'Shuffling first means each epoch visits every example exactly once (sampling without replacement), in a different random order each time. The update needs the batch gradient, and the epoch ends when the batches are exhausted.',
    },
    {
      kind: 'match',
      prompt: 'Match the change to its main effect on SGD.',
      pairs: [
        ['Increase batch size 4×', 'Gradient noise std halves; cost per step 4×'],
        ['Halve a constant learning rate', 'Noise floor roughly halves, approach slows'],
        ['Use η_k ∝ 1/k', 'Converges to the optimum (strongly convex case), at rate O(1/k)'],
        ['Use full-batch gradients', 'No sampling noise, but one step per epoch'],
      ],
      why: String.raw`Noise std $\propto1/\sqrt{|B|}$; the stationary error $\approx\eta\sigma^2/(2\lambda)$ is proportional to $\eta$; Robbins–Monro steps like $1/k$ remove the floor; full batch is just GD.`,
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- SGD trades exact gradients for many cheap, unbiased, noisy ones: $\mathrm{Cov}(\mathbf g)=\Sigma/|B|$, so noise std $\propto1/\sqrt{|B|}$.
- Constant $\eta$: fast progress, then a noise floor $\propto\eta\cdot$(gradient variance).
- Robbins–Monro conditions $\sum\eta_k=\infty,\ \sum\eta_k^2<\infty$ (e.g. $\eta_k\propto1/k$) give true convergence; $O(1/k)$ for strongly convex losses.
- For non-convex losses the guarantee is only a stationary point.
- Batch size, learning rate and schedule are coupled; tune them together.`,
    },
  ],
  references: [
    { authors: 'H. Robbins & S. Monro', title: 'A Stochastic Approximation Method', year: 1951, venue: 'Annals of Mathematical Statistics 22(3), 400–407' },
    { authors: 'L. Bottou, F. E. Curtis & J. Nocedal', title: 'Optimization Methods for Large-Scale Machine Learning', year: 2018, venue: 'SIAM Review 60(2), 223–311', detail: '§3–4', url: 'https://arxiv.org/abs/1606.04838' },
    { authors: 'N. S. Keskar, D. Mudigere, J. Nocedal, M. Smelyanskiy & P. T. P. Tang', title: 'On Large-Batch Training for Deep Learning: Generalization Gap and Sharp Minima', year: 2017, venue: 'ICLR', url: 'https://arxiv.org/abs/1609.04836' },
    { authors: 'I. Goodfellow, Y. Bengio & A. Courville', title: 'Deep Learning', year: 2016, venue: 'MIT Press', detail: '§8.1.3, §8.3.1', url: 'https://www.deeplearningbook.org' },
  ],
} satisfies LessonContent;
