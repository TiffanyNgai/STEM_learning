import type { LessonContent } from '../../types';

export default {
  cards: [
    {
      kind: 'explain',
      title: 'One learning rate cannot fit all',
      body: String.raw`[Momentum](@ml/momentum-methods) still uses one $\eta$ for every parameter. But parameters live on very different scales. The weight on a rare word feature might see a non-zero gradient once in 10 000 examples, while a bias term sees one every step. Curvatures can differ by orders of magnitude.

**Adaptive optimizers** give each coordinate its own step size, computed from the history of *that coordinate's* gradients. Large past gradients mean a smaller step; small ones mean a larger step.

Below: GD and Adam with the same $\eta$ on $L=\tfrac12x^2+5y^2$. Adam heads more directly toward the minimum because it normalizes each coordinate's step.`,
      widget: { type: 'GradientDescent2D', props: { optimizers: ['gd', 'adam'], compare: true, lr: 0.05 } },
    },
    {
      kind: 'explain',
      title: 'AdaGrad: divide by the history',
      body: String.raw`**AdaGrad** (Duchi, Hazan & Singer 2011) accumulates squared gradients per coordinate $j$ ($g_{t,j}$ is the gradient at step $t$):
$$G_{t,j}=\sum_{s=1}^{t}g_{s,j}^2,\qquad\theta_{t+1,j}=\theta_{t,j}-\frac{\eta}{\sqrt{G_{t,j}}+\epsilon}\,g_{t,j}.$$
$\epsilon$ (e.g. $10^{-8}$) prevents division by zero.

- Rarely-updated (sparse) features keep a small $G$, so they get **large** steps when they do appear. That makes AdaGrad strong for sparse convex problems such as linear models on text.
- $G$ only grows, so steps **shrink forever**. That is good for convex online learning: AdaGrad has $O(\sqrt T)$ regret, so the average regret goes to zero. For long non-convex training runs it often stalls too early.`,
    },
    {
      kind: 'numeric',
      prompt: String.raw`AdaGrad with $\eta=0.1$ and $\epsilon\approx0$. One coordinate sees gradient $3$ at step 1 and gradient $4$ at step 2. What is the size of its update at step 2?`,
      answer: 0.08,
      tolerance: 0.001,
      why: String.raw`$G_2=3^2+4^2=25$, $\sqrt{G_2}=5$, so the step is $0.1\cdot4/5=0.08$. Note that the history of squared gradients (including step 1) sets the scale, not just the current gradient.`,
    },
    {
      kind: 'explain',
      title: 'RMSProp: forget the distant past',
      body: String.raw`**RMSProp** (Tieleman & Hinton 2012, introduced in a Coursera lecture rather than a paper) replaces AdaGrad's sum with an **exponential moving average** (EMA):
$$v_{t,j}=\rho\,v_{t-1,j}+(1-\rho)\,g_{t,j}^2,\qquad\theta_{t+1,j}=\theta_{t,j}-\frac{\eta}{\sqrt{v_{t,j}}+\epsilon}\,g_{t,j},$$
typically with $\rho=0.9$. $\sqrt{v}$ is a running **root-mean-square** of recent gradients, so the step no longer decays to zero, and it adapts when the landscape changes.

Rough intuition: dividing by the RMS gradient makes each coordinate's step about $\eta$ in size, whatever the gradient's units. It is a cheap *diagonal* rescaling (preconditioning) of the problem.`,
    },
    {
      kind: 'widget',
      title: 'Adam, step by step',
      body: String.raw`**Adam** (Kingma & Ba 2015) = momentum on the gradient + RMSProp on its square + bias correction. All operations are per coordinate.`,
      widget: {
        type: 'StepReveal',
        props: {
          steps: [
            String.raw`Gradient: $\mathbf g_t=\nabla L(\boldsymbol\theta_{t-1})$ (usually a mini-batch estimate). Initialize $\mathbf m_0=\mathbf v_0=\mathbf 0$.`,
            String.raw`First moment (momentum): $\mathbf m_t=\beta_1\mathbf m_{t-1}+(1-\beta_1)\mathbf g_t$.`,
            String.raw`Second moment (uncentred variance): $\mathbf v_t=\beta_2\mathbf v_{t-1}+(1-\beta_2)\mathbf g_t^2$.`,
            String.raw`Bias correction: $\hat{\mathbf m}_t=\mathbf m_t/(1-\beta_1^t)$, $\hat{\mathbf v}_t=\mathbf v_t/(1-\beta_2^t)$.`,
            String.raw`Update: $\boldsymbol\theta_t=\boldsymbol\theta_{t-1}-\eta\,\hat{\mathbf m}_t/(\sqrt{\hat{\mathbf v}_t}+\epsilon)$.`,
          ],
          notes: ['', 'β₁ = 0.9 by default', 'β₂ = 0.999 by default', 'undoes the pull toward the zero initialization', 'paper defaults: η = 0.001, ε = 10⁻⁸'],
        },
      },
    },
    {
      kind: 'widget',
      title: 'Why bias correction?',
      body: String.raw`Because $\mathbf m_0=\mathbf v_0=\mathbf 0$, the EMAs start biased toward zero. For a constant gradient $g$: $m_t=(1-\beta_1^t)g$ and $v_t=(1-\beta_2^t)g^2$. Without correction the step is
$$\frac{m_t}{\sqrt{v_t}}=\frac{1-\beta_1^t}{\sqrt{1-\beta_2^t}}\,\mathrm{sign}(g).$$
Since $\beta_2$ is closer to 1, $v_t$ is *more* underestimated than $m_t$, so the early steps come out **too large**. With the defaults this is about 6.5× too large around step 12. The corrected ratio is exactly 1 (the flat line).`,
      widget: {
        type: 'FunctionPlot',
        props: {
          fns: ['(1-b1^x)/sqrt(1-b2^x)', '1'],
          x: [0, 500], y: [0, 8],
          params: [{ name: 'b1', min: 0.5, max: 0.99, value: 0.9, label: 'β₁' }, { name: 'b2', min: 0.9, max: 0.9999, value: 0.999, label: 'β₂' }],
          labels: ['uncorrected step / η', 'bias-corrected'], xLabel: 'step t', yLabel: 'step size / η',
        },
      },
    },
    {
      kind: 'numeric',
      prompt: String.raw`Adam with $\eta=0.001$, $\beta_1=0.9$, $\beta_2=0.999$, $\epsilon\approx0$. At step $t=1$ a coordinate has gradient $g_1=250$. How large is its first update $|\theta_1-\theta_0|$?`,
      answer: 0.001,
      tolerance: 0.00001,
      why: String.raw`$m_1=0.1\cdot250$, $\hat m_1=m_1/0.1=250$; $v_1=0.001\cdot250^2$, $\hat v_1=250^2$. The step is $\eta\cdot250/250=\eta=0.001$. Adam's first step is $\eta\,\mathrm{sign}(g)$ whatever the gradient's size, so $\eta$ directly sets the step size in parameter units.`,
    },
    {
      kind: 'truefalse',
      prompt: String.raw`If you multiply the loss by a constant $c>0$, Adam's updates are (ignoring $\epsilon$) unchanged.`,
      answer: true,
      why: String.raw`All gradients scale by $c$, so $\hat{\mathbf m}$ scales by $c$ and $\sqrt{\hat{\mathbf v}}$ by $c$; the ratio is unchanged. Plain SGD's step would scale by $c$. This invariance is one reason Adam's default $\eta$ transfers across problems.`,
    },
    {
      kind: 'explain',
      title: 'Convergence: what is (and is not) known',
      body: String.raw`Kingma & Ba gave a regret bound for online convex problems, but **Reddi, Kale & Kumar (2018) showed that its proof was flawed** and built a simple convex counterexample. On $x\in[-1,1]$, the gradient is a large $C$ on one step in three and $-1$ on the other two. The average gradient is positive, so the best point is $x=-1$. Yet for suitable $(\beta_1,\beta_2)$, Adam drifts to $x=+1$. The cause: the rare large gradient is quickly forgotten by the EMA $v_t$, so the effective step size can *increase*, which AdaGrad never allows.

Precisely:
- **AdaGrad**: $O(\sqrt T)$ regret for online convex problems (Duchi et al.).
- **AMSGrad** (Reddi et al.'s fix, using $\hat v_t=\max(\hat v_{t-1},v_t)$): an $O(\sqrt T)$ regret bound in the same setting.
- **Adam with fixed $\beta_1,\beta_2$**: no general convergence guarantee, even for convex problems. Positive results need extra conditions (e.g. on how $\beta_2$, $\eta$ are chosen), and for non-convex losses they promise at most stationary points.

In practice Adam (and AdamW) remain the default for transformers.`,
    },
    {
      kind: 'mcq',
      prompt: String.raw`What did Reddi, Kale & Kumar (2018) show about Adam?`,
      choices: [
        'Adam always converges faster than SGD on convex problems',
        'There exist simple convex problems on which Adam (for some valid hyperparameters) fails to converge to the optimum, showing that the original convergence proof was flawed',
        'Adam is equivalent to SGD with momentum when β₂ = 0',
        'Bias correction is unnecessary when β₂ = 0.999',
      ],
      answer: 1,
      why: String.raw`Their counterexample is a one-dimensional online convex problem where Adam converges to the worst point. They traced the failure to the EMA of squared gradients allowing the effective step to grow, and proposed AMSGrad. They did *not* claim Adam fails in typical deep-learning practice.`,
    },
    {
      kind: 'explain',
      title: 'AdamW: decouple the weight decay',
      body: String.raw`**L2 regularization** adds $\frac\lambda2\|\boldsymbol\theta\|^2$ to the loss, i.e. $\lambda\boldsymbol\theta$ to the gradient. For plain SGD this is the same as **weight decay** (shrinking weights by a constant factor each step), after rescaling $\lambda$ by the learning rate.

Under Adam they differ. The $\lambda\boldsymbol\theta$ term is divided by $\sqrt{\hat{\mathbf v}}$, so weights with large gradient history are regularized *less*. Loshchilov & Hutter (2019) proposed **decoupled weight decay**, applied outside the adaptive normalization:
$$\boldsymbol\theta_t=\boldsymbol\theta_{t-1}-\eta_t\Big(\alpha\,\frac{\hat{\mathbf m}_t}{\sqrt{\hat{\mathbf v}_t}+\epsilon}+\lambda\,\boldsymbol\theta_{t-1}\Big),$$
where $\eta_t$ is the [schedule multiplier](@ml/learning-rate-schedules). This **AdamW** generalized better in their experiments and made $\lambda$ and the learning rate easier to tune separately. It is now the standard optimizer for large transformers.`,
    },
    {
      kind: 'truefalse',
      prompt: String.raw`For plain SGD (no momentum, no adaptivity), adding an L2 penalty $\frac\lambda2\|\boldsymbol\theta\|^2$ to the loss is equivalent to weight decay with a suitably rescaled coefficient.`,
      answer: true,
      why: String.raw`SGD on the penalized loss gives $\boldsymbol\theta\leftarrow\boldsymbol\theta-\eta(\nabla L+\lambda\boldsymbol\theta)=(1-\eta\lambda)\boldsymbol\theta-\eta\nabla L$, which is multiplicative decay by $(1-\eta\lambda)$. The equivalence breaks for adaptive methods, which is why AdamW exists.`,
    },
    {
      kind: 'match',
      prompt: 'Match each optimizer to its defining idea.',
      pairs: [
        ['AdaGrad', 'Divide by the root of the sum of all past squared gradients'],
        ['RMSProp', 'Divide by the root of an EMA of squared gradients'],
        ['Adam', 'EMA of gradients over root-EMA of squared gradients, with bias correction'],
        ['AMSGrad', 'Use the running maximum of the second-moment estimate'],
        ['AdamW', 'Apply weight decay directly to the weights, not through the gradient'],
      ],
      why: String.raw`AdaGrad's sum only grows; RMSProp's EMA forgets; Adam adds momentum and bias correction; AMSGrad keeps the denominator non-decreasing (fixing Reddi et al.'s counterexample); AdamW decouples regularization from the adaptive scaling.`,
    },
    {
      kind: 'fill',
      prompt: String.raw`Adam's default hyperparameters are $\beta_1=$ ___, $\beta_2=$ ___ and $\eta=$ ___.`,
      bank: ['0.9', '0.999', '0.001', '0.99', '0.1', '1e-8'],
      answer: ['0.9', '0.999', '0.001'],
      why: String.raw`These are the defaults suggested by Kingma & Ba (with $\epsilon=10^{-8}$). $\beta_1$ averages gradients over ~10 steps; $\beta_2$ averages squared gradients over ~1000 steps. Large-model training often lowers $\beta_2$ (e.g. 0.95) for stability.`,
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- Adaptive methods rescale each coordinate by a running RMS of its gradients: a cheap diagonal preconditioner.
- AdaGrad: sum of squares, so steps shrink forever. It is strong for sparse convex problems and has an $O(\sqrt T)$ regret guarantee.
- RMSProp: EMA instead of sum. Adam: EMA momentum + RMSProp + bias correction; the first step is $\eta\,\mathrm{sign}(g)$, and updates are invariant to rescaling the loss.
- Adam with fixed $\beta$'s has **no general convergence guarantee**, even for convex problems (Reddi et al. 2018). AMSGrad restores one; Adam still works well in practice.
- AdamW decouples weight decay from adaptive scaling; L2 ≠ weight decay for adaptive optimizers.`,
    },
  ],
  references: [
    { authors: 'J. Duchi, E. Hazan & Y. Singer', title: 'Adaptive Subgradient Methods for Online Learning and Stochastic Optimization', year: 2011, venue: 'JMLR 12, 2121–2159' },
    { authors: 'D. P. Kingma & J. Ba', title: 'Adam: A Method for Stochastic Optimization', year: 2015, venue: 'ICLR', url: 'https://arxiv.org/abs/1412.6980' },
    { authors: 'S. J. Reddi, S. Kale & S. Kumar', title: 'On the Convergence of Adam and Beyond', year: 2018, venue: 'ICLR', url: 'https://openreview.net/forum?id=ryQu7f-RZ' },
    { authors: 'I. Loshchilov & F. Hutter', title: 'Decoupled Weight Decay Regularization', year: 2019, venue: 'ICLR', url: 'https://arxiv.org/abs/1711.05101' },
    { authors: 'I. Goodfellow, Y. Bengio & A. Courville', title: 'Deep Learning', year: 2016, venue: 'MIT Press', detail: '§8.5 (algorithms with adaptive learning rates)', url: 'https://www.deeplearningbook.org' },
  ],
} satisfies LessonContent;
