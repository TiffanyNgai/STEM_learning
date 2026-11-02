import type { LessonContent } from '../../types';

export default {
  cards: [
    {
      kind: 'explain',
      title: 'A hiker in the fog',
      body: String.raw`Training a model means finding parameters $\boldsymbol\theta$ that make a **loss** $L(\boldsymbol\theta)$ (average error on the training data) small. Usually there is no formula for the minimum.

Picture a hiker on a foggy mountain who wants to reach the valley floor. She can't see far, but she can feel the slope under her feet. Strategy: **take a step downhill, re-check the slope, repeat.** That is gradient descent.

Below, the shaded bands are contour lines of a loss surface (darker = lower). Press **Play**; tap anywhere to move the starting point.`,
      widget: { type: 'GradientDescent2D', props: { optimizers: ['gd'], lr: 0.08 } },
    },
    {
      kind: 'explain',
      title: 'The gradient points uphill',
      body: String.raw`For $L(\theta_1,\dots,\theta_p)$ the **gradient** collects all partial derivatives:

$$\nabla L(\boldsymbol\theta)=\Big(\tfrac{\partial L}{\partial\theta_1},\dots,\tfrac{\partial L}{\partial\theta_p}\Big).$$

It points in the direction of **steepest increase**, its length is the slope in that direction, and it is perpendicular to the contour lines. So $-\nabla L$ is steepest *descent*.

**Example.** $L(x,y)=x^2+3y^2$. Then $\nabla L=(2x,\,6y)$; at $(1,1)$ it is $(2,6)$ — mostly in $y$, because the bowl is steeper in $y$.`,
    },
    {
      kind: 'numeric',
      prompt: String.raw`For $L(x,y)=x^2+3y^2$, what is $\partial L/\partial y$ at the point $(x,y)=(2,-1)$?`,
      answer: -6,
      why: String.raw`$\partial L/\partial y=6y=6\cdot(-1)=-6$. The negative sign says $L$ *decreases* as $y$ increases there, so descent moves $y$ upward toward 0.`,
    },
    {
      kind: 'explain',
      title: 'The update rule',
      body: String.raw`**Gradient descent (GD):**

$$\boldsymbol\theta_{k+1}=\boldsymbol\theta_k-\eta\,\nabla L(\boldsymbol\theta_k).$$

$\eta>0$ is the **learning rate** (step size); $k$ counts iterations.

**Worked 1D example.** $L(\theta)=\theta^2$, so $\nabla L=2\theta$ and
$$\theta_{k+1}=\theta_k-2\eta\theta_k=(1-2\eta)\,\theta_k\;\Rightarrow\;\theta_k=(1-2\eta)^k\theta_0.$$
- $0<\eta<\tfrac12$: shrinks monotonically to 0.
- $\tfrac12<\eta<1$: factor is negative → **oscillates** but still converges.
- $\eta>1$: $|1-2\eta|>1$ → **diverges**.`,
      widget: {
        type: 'FunctionPlot',
        props: { fns: ['(1-2*eta)^floor(x)*4'], x: [0, 15], y: [-6, 6], params: [{ name: 'eta', min: 0.05, max: 1.1, value: 0.2, label: 'η' }], xLabel: 'step k', yLabel: 'θ_k' },
        caption: String.raw`$\theta_k=(1-2\eta)^k\theta_0$ with $\theta_0=4$. Try $\eta=0.2,\ 0.5,\ 0.8,\ 1.05$.`,
      },
    },
    {
      kind: 'numeric',
      prompt: String.raw`$L(\theta)=\theta^2$, start at $\theta_0=4$ with learning rate $\eta=0.25$. What is $\theta_1$?`,
      answer: 2,
      why: String.raw`$\nabla L(4)=8$, so $\theta_1=4-0.25\cdot8=2$. Equivalently the factor $1-2\eta=0.5$ halves $\theta$ each step.`,
    },
    {
      kind: 'explain',
      title: 'Curvature sets the speed limit',
      body: String.raw`Near a minimum, any smooth loss looks like a quadratic bowl $L\approx\tfrac12\boldsymbol\theta^\top H\boldsymbol\theta$, where $H$ is the **Hessian** (matrix of second derivatives). Along each eigenvector of $H$ with eigenvalue (curvature) $\lambda$, GD multiplies the error by $(1-\eta\lambda)$.

**Stability:** GD converges iff $0<\eta<2/\lambda_{\max}$. The steepest direction dictates the largest safe step.

The surface below is $L=\tfrac12x^2+5y^2$: curvatures $\lambda=1$ (in $x$) and $\lambda=10$ (in $y$). Try $\eta=0.05$ (smooth), $0.15$ (zig-zag in $y$) and $0.21$ (explodes).`,
      widget: { type: 'GradientDescent2D', props: { optimizers: ['gd'], lr: 0.15, f: '0.5*x^2 + 5*y^2' } },
    },
    {
      kind: 'mcq',
      prompt: String.raw`For $L(x,y)=\tfrac12x^2+5y^2$, what is the largest learning rate for which plain GD still converges (from almost any start)?`,
      choices: ['$\\eta<2$', '$\\eta<1$', '$\\eta<0.2$', '$\\eta<0.1$'],
      answer: 2,
      why: String.raw`The curvatures are 1 and 10, so we need $\eta<2/\lambda_{\max}=2/10=0.2$. $\eta<2$ is the limit for the *flat* direction only; the steep $y$-direction blows up first. Between 0.1 and 0.2 it still converges, but oscillates.`,
    },
    {
      kind: 'explain',
      title: 'Ill-conditioning: the narrow valley',
      body: String.raw`The **condition number** $\kappa=\lambda_{\max}/\lambda_{\min}$ measures how stretched the bowl is. The safe step is limited by $\lambda_{\max}$, but progress along the flat direction is only $\eta\lambda_{\min}<2/\kappa$ per step.

Even with the best fixed step $\eta=2/(\lambda_{\max}+\lambda_{\min})$, the error shrinks by a factor $\frac{\kappa-1}{\kappa+1}$ per step, so roughly **$\kappa$ iterations** are needed per digit of accuracy. In the example $\kappa=10$; real networks can have $\kappa$ in the millions.

**Fixes:** standardize input features, normalization layers, momentum, adaptive (per-coordinate) step sizes, preconditioning.`,
    },
    {
      kind: 'truefalse',
      prompt: 'Rescaling input features so they have similar ranges (e.g. standardizing to mean 0, variance 1) typically speeds up gradient descent for linear regression.',
      answer: true,
      why: String.raw`For least squares the Hessian is $X^\top X/n$; wildly different feature scales make its eigenvalues very unequal (large $\kappa$). Standardizing makes the bowl rounder, so a single learning rate suits every direction.`,
    },
    {
      kind: 'widget',
      title: 'Preview: momentum and Adam',
      body: String.raw`Two famous upgrades race plain GD here (same $\eta$):
- **Momentum** accumulates a velocity $\mathbf v\leftarrow\beta\mathbf v+\nabla L$, $\boldsymbol\theta\leftarrow\boldsymbol\theta-\eta\mathbf v$: zig-zags cancel, consistent directions accelerate. ([details](@ml/momentum-methods))
- **Adam** divides each coordinate's step by a running RMS of its gradients, so steep and flat directions move at similar speeds. ([details](@ml/adaptive-optimizers))

Press Play, then try the bent "banana" valley by tapping a new start.`,
      widget: { type: 'GradientDescent2D', props: { compare: true, lr: 0.03, f: '(1-x)^2 + 4*(y-0.3*x^2)^2', range: [-3, 3, -1.5, 3], start: [-2.5, 2.5] } },
    },
    {
      kind: 'explain',
      title: 'Stochastic gradients',
      body: String.raw`In ML the loss is an average over $n$ training examples: $L(\boldsymbol\theta)=\frac1n\sum_{i=1}^n\ell_i(\boldsymbol\theta)$. Computing the full gradient costs a pass over **all** data — prohibitive when $n$ is in the billions.

**Stochastic gradient descent (SGD)** uses a random **mini-batch** $B$ of, say, 256 examples:
$$\mathbf g=\frac1{|B|}\sum_{i\in B}\nabla\ell_i(\boldsymbol\theta),\qquad\mathbb E[\mathbf g]=\nabla L(\boldsymbol\theta).$$
The estimate is **unbiased** but noisy; the noise variance shrinks like $1/|B|$. Decaying $\eta$ over time averages the noise out. See [SGD](@ml/sgd-minibatch).`,
    },
    {
      kind: 'order',
      prompt: 'Order one iteration of the standard deep-learning training loop.',
      steps: [
        'Sample a random mini-batch of training examples',
        'Forward pass: compute predictions and the mini-batch loss',
        'Backward pass: compute the gradient of the loss w.r.t. every parameter',
        'Update: θ ← θ − η · gradient',
      ],
      why: 'The gradient can only be computed after the loss (backprop runs backwards through the computation the forward pass recorded), and the update needs the gradient. Then the loop repeats with a fresh mini-batch.',
    },
    {
      kind: 'match',
      prompt: 'Match the training symptom to its most likely cause.',
      pairs: [
        ['Loss shoots up to NaN within a few steps', 'Learning rate far too large'],
        ['Loss falls smoothly but painfully slowly', 'Learning rate too small'],
        ['Parameters zig-zag across a narrow valley', 'Ill-conditioning (large κ)'],
        ['Loss is flat for a long time, then suddenly drops', 'Plateau / saddle region with tiny gradients'],
      ],
      why: String.raw`Exceeding $2/\lambda_{\max}$ causes exponential blow-up; tiny $\eta$ gives slow monotone progress; a large condition number produces oscillation in steep directions; near saddle points $\|\nabla L\|\approx0$ so progress stalls until the iterate escapes.`,
    },
    {
      kind: 'fill',
      prompt: String.raw`GD on a quadratic converges iff $\eta<2/\lambda_{\max}$, where $\lambda_{\max}$ is the largest eigenvalue of the ___. The ratio $\lambda_{\max}/\lambda_{\min}$ is the ___ number, and the number of iterations needed grows roughly ___ in it.`,
      bank: ['Hessian', 'condition', 'linearly', 'gradient', 'logarithmically', 'learning', 'Jacobian'],
      answer: ['Hessian', 'condition', 'linearly'],
      why: String.raw`Curvature lives in the Hessian (second derivatives), not the gradient. The convergence factor $(\kappa-1)/(\kappa+1)\approx1-2/\kappa$ means $O(\kappa)$ steps per digit of accuracy (momentum improves this to $O(\sqrt\kappa)$).`,
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- GD: $\boldsymbol\theta\leftarrow\boldsymbol\theta-\eta\nabla L(\boldsymbol\theta)$; $-\nabla L$ is the steepest-descent direction.
- On a quadratic with curvatures $\lambda_i$, each direction shrinks by $(1-\eta\lambda_i)$ per step: stable iff $\eta<2/\lambda_{\max}$.
- Ill-conditioning ($\kappa\gg1$) forces small steps and slow progress along flat directions.
- SGD replaces the full gradient with an unbiased mini-batch estimate — the workhorse of deep learning.
- Gradients of deep nets are computed efficiently by [backpropagation](@ml/backpropagation).`,
    },
  ],
  references: [
    { authors: 'S. Boyd & L. Vandenberghe', title: 'Convex Optimization', year: 2004, venue: 'Cambridge University Press', detail: 'Ch. 9.3', url: 'https://web.stanford.edu/~boyd/cvxbook/' },
    { authors: 'I. Goodfellow, Y. Bengio & A. Courville', title: 'Deep Learning', year: 2016, venue: 'MIT Press', detail: 'Ch. 4.3, 8.1–8.3', url: 'https://www.deeplearningbook.org' },
    { authors: 'S. J. D. Prince', title: 'Understanding Deep Learning', year: 2023, venue: 'MIT Press', detail: 'Ch. 6', url: 'https://udlbook.github.io/udlbook/' },
    { authors: 'G. Goh', title: 'Why Momentum Really Works', year: 2017, venue: 'Distill', url: 'https://distill.pub/2017/momentum/' },
  ],
} satisfies LessonContent;
