import type { LessonContent } from '../../types';

// Classical momentum vs Nesterov: where the gradient is evaluated.
const arrow = (x1: number, y1: number, x2: number, y2: number, col: string, delay: number, dash = '') =>
  `<g opacity="0"><line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${col}" stroke-width="2" marker-end="url(#ah)" ${dash ? `stroke-dasharray="${dash}"` : ''}/><animate attributeName="opacity" values="0;0;1;1" keyTimes="0;${delay};${delay + 0.06};1" dur="8s" repeatCount="indefinite"/></g>`;
const NAG_SVG = `<svg viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg">
<defs><marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="var(--fg)"/></marker></defs>
<text x="80" y="16" font-size="11" text-anchor="middle" fill="var(--fg)">Heavy ball (Polyak)</text>
<text x="240" y="16" font-size="11" text-anchor="middle" fill="var(--fg)">Nesterov</text>
<line x1="160" y1="25" x2="160" y2="170" stroke="var(--grid)" stroke-width="1"/>
<circle cx="25" cy="110" r="4" fill="var(--fg)"/><text x="18" y="128" font-size="10" fill="var(--fg)">θ</text>
${arrow(25, 110, 95, 75, 'var(--c2)', 0.05)}
${arrow(25, 110, 50, 145, 'var(--c5)', 0.2)}
${arrow(25, 110, 120, 110, 'var(--c1)', 0.4, '4 3')}
<text x="62" y="80" font-size="9" fill="var(--c2)">βv</text><text x="40" y="160" font-size="9" fill="var(--c5)">−η∇L(θ)</text>
<circle cx="185" cy="110" r="4" fill="var(--fg)"/><text x="178" y="128" font-size="10" fill="var(--fg)">θ</text>
${arrow(185, 110, 255, 75, 'var(--c2)', 0.05)}
<circle cx="255" cy="75" r="3" fill="var(--c2)"/><text x="262" y="70" font-size="9" fill="var(--c2)">look-ahead θ+βv</text>
${arrow(255, 75, 265, 115, 'var(--c5)', 0.2)}
${arrow(185, 110, 265, 115, 'var(--c1)', 0.4, '4 3')}
<text x="208" y="80" font-size="9" fill="var(--c2)">βv</text><text x="268" y="105" font-size="9" fill="var(--c5)">−η∇L(θ+βv)</text>
<text x="160" y="176" font-size="9" text-anchor="middle" fill="var(--c1)">green dashed = actual step; Nesterov corrects using the gradient where it is about to land</text>
</svg>`;

export default {
  cards: [
    {
      kind: 'explain',
      title: 'A ball, not a hiker',
      body: String.raw`In a narrow valley [gradient descent](@ml/gradient-descent) zig-zags: the gradient points mostly *across* the valley, and only a little *along* it. Each step fights the last one.

A heavy ball rolling down the same valley behaves better. Its inertia averages out the side-to-side pushes, while the small but consistent push along the valley floor keeps building speed.

**Momentum methods** give the iterate a velocity. Press Play below: same learning rate, plain GD (red) vs momentum (green) on $L=\tfrac12x^2+5y^2$ (curvatures 1 and 10).`,
      widget: { type: 'GradientDescent2D', props: { optimizers: ['gd', 'momentum'], compare: true, lr: 0.02, beta: 0.9 } },
    },
    {
      kind: 'explain',
      title: 'The heavy-ball update',
      body: String.raw`**Polyak's heavy-ball method** (1964) keeps a velocity $\mathbf v$:
$$\mathbf v_{k+1}=\beta\,\mathbf v_k-\eta\nabla L(\boldsymbol\theta_k),\qquad\boldsymbol\theta_{k+1}=\boldsymbol\theta_k+\mathbf v_{k+1}.$$
$\beta\in[0,1)$ is the **momentum coefficient** (friction is $1-\beta$); $\beta=0$ gives back plain GD. Unrolling, the step is an exponentially weighted sum of past gradients:
$$\mathbf v_{k+1}=-\eta\big(\nabla L_k+\beta\nabla L_{k-1}+\beta^2\nabla L_{k-2}+\dots\big).$$
Deep-learning libraries often write $\mathbf v\leftarrow\beta\mathbf v+\nabla L$, $\boldsymbol\theta\leftarrow\boldsymbol\theta-\eta\mathbf v$. With a constant $\eta$ this is the same algorithm with $\mathbf v$ rescaled by $-\eta$.`,
    },
    {
      kind: 'numeric',
      prompt: String.raw`On a long straight slope the gradient is a constant $g$. With $\mathbf v\leftarrow\beta\mathbf v-\eta g$ and $\beta=0.9$, the velocity approaches a terminal value $-c\,\eta g$. What is $c$?`,
      answer: 10,
      why: String.raw`At the fixed point $v=\beta v-\eta g$, so $v=-\eta g/(1-\beta)=-10\,\eta g$. Momentum multiplies the effective step along consistent directions by $1/(1-\beta)$: 10 for $\beta=0.9$, 100 for $\beta=0.99$.`,
    },
    {
      kind: 'explain',
      title: 'Why it helps: two effects',
      body: String.raw`1. **Acceleration along consistent directions.** Gradients that keep pointing the same way add up, giving up to a $1/(1-\beta)$ larger effective step in the flat direction.
2. **Damping of oscillations.** Along a steep direction the gradient flips sign each step, so consecutive terms in the weighted sum cancel.

On a quadratic, each eigen-direction with curvature $\lambda$ is a damped linear recurrence. Polyak showed that the tuned choice
$$\eta=\frac{4}{(\sqrt L+\sqrt\mu)^2},\qquad\beta=\Big(\frac{\sqrt\kappa-1}{\sqrt\kappa+1}\Big)^2$$
shrinks the error by roughly $\frac{\sqrt\kappa-1}{\sqrt\kappa+1}$ per step, versus $\frac{\kappa-1}{\kappa+1}$ for the best fixed-step GD ($\kappa=L/\mu$, see [convexity](@ml/convexity)).`,
    },
    {
      kind: 'widget',
      title: 'From κ to √κ',
      body: String.raw`Steps needed to shrink the error by $10^6$ on a quadratic, using the rate factors above, plotted against $\log_{10}\kappa$ (both axes logarithmic).

At $\kappa=10^4$, GD needs about 69 000 steps; heavy ball about 690. The gap widens as $\kappa$ grows: $\kappa$ versus $\sqrt\kappa$.`,
      widget: {
        type: 'FunctionPlot',
        props: {
          fns: ['log10(13.8155/(-log((10^x-1)/(10^x+1))))', 'log10(13.8155/(-log((10^(x/2)-1)/(10^(x/2)+1))))'],
          x: [0, 6], y: [0, 7],
          labels: ['GD', 'heavy ball (tuned)'], xLabel: 'log₁₀ κ', yLabel: 'log₁₀ steps',
        },
      },
    },
    {
      kind: 'numeric',
      prompt: String.raw`For a quadratic with condition number $\kappa=100$, what is the tuned heavy-ball per-step error factor $(\sqrt\kappa-1)/(\sqrt\kappa+1)$? (3 decimal places)`,
      answer: 0.818,
      tolerance: 0.002,
      why: String.raw`$\sqrt{100}=10$, so the factor is $9/11\approx0.818$. Best fixed-step GD gives $99/101\approx0.980$. To gain a factor $10^6$, GD needs about 690 steps and heavy ball about 69: a $\sqrt\kappa=10$ speed-up.`,
    },
    {
      kind: 'widget',
      title: 'Nesterov: look before you leap',
      body: String.raw`**Nesterov's accelerated gradient (NAG)** evaluates the gradient at the point momentum is about to carry you to (in the form popularized by Sutskever et al. 2013):
$$\mathbf v_{k+1}=\beta\mathbf v_k-\eta\nabla L(\boldsymbol\theta_k+\beta\mathbf v_k),\qquad\boldsymbol\theta_{k+1}=\boldsymbol\theta_k+\mathbf v_{k+1}.$$
If the momentum would overshoot, the look-ahead gradient already points back, so NAG brakes earlier.`,
      widget: { type: 'SvgDiagram', props: { svg: NAG_SVG }, caption: 'Same velocity, different place to measure the slope.' },
    },
    {
      kind: 'explain',
      title: 'What is actually guaranteed',
      body: String.raw`Be precise about which method has which guarantee (first-order methods, exact gradients):
- **Nesterov (1983)**, $L$-smooth convex: $f(\boldsymbol\theta_k)-f^*=O\!\big(L\|\boldsymbol\theta_0-\boldsymbol\theta^*\|^2/k^2\big)$, versus $O(1/k)$ for GD. For $\mu$-strongly convex, with suitable $\beta$, the error shrinks like $(1-1/\sqrt\kappa)^k$.
- These rates are **optimal**: Nesterov's lower bounds show that no method using only gradient information (in this standard model) can do better in the worst case, up to constants.
- **Heavy ball**: the $\sqrt\kappa$ rate is proven for quadratics (and locally near a well-behaved minimum). For general smooth strongly convex functions it is *not* guaranteed: Lessard, Recht & Packard (2016) found a function where heavy ball with Polyak's tuning fails to converge.
- With **stochastic** gradients, momentum does not remove the noise floor from [SGD](@ml/sgd-minibatch). Its acceleration mainly helps while the error is dominated by curvature, not noise.`,
    },
    {
      kind: 'truefalse',
      prompt: String.raw`Polyak's heavy-ball method with the quadratic-optimal $(\eta,\beta)$ is guaranteed to converge at rate $\approx(\sqrt\kappa-1)/(\sqrt\kappa+1)$ on every smooth, strongly convex function.`,
      answer: false,
      why: String.raw`That rate is proven for quadratics. Lessard, Recht & Packard (2016) gave a smooth strongly convex counterexample where the tuned heavy ball cycles instead of converging. Nesterov's method is the one with a global accelerated guarantee for this class.`,
    },
    {
      kind: 'mcq',
      prompt: 'What is the only difference between Nesterov momentum and classical (heavy-ball) momentum in the forms above?',
      choices: [
        'Nesterov uses a larger momentum coefficient β',
        'Nesterov evaluates the gradient at the look-ahead point θ + βv instead of at θ',
        'Nesterov divides the gradient by its running RMS',
        'Nesterov resets the velocity to zero every epoch',
      ],
      answer: 1,
      why: String.raw`The updates are identical except for where $\nabla L$ is computed. Dividing by a running RMS describes [adaptive methods](@ml/adaptive-optimizers) such as RMSProp/Adam, and $\beta$ can be the same for both.`,
    },
    {
      kind: 'order',
      prompt: 'Order one step of Nesterov momentum.',
      steps: [
        'Form the look-ahead point θ̃ = θ + βv',
        'Compute the gradient ∇L(θ̃) at the look-ahead point',
        'Update the velocity: v ← βv − η∇L(θ̃)',
        'Move: θ ← θ + v',
      ],
      why: 'The gradient must be measured where momentum is about to carry you, so the look-ahead point comes first. The new velocity uses that gradient, and the position update uses the new velocity.',
    },
    {
      kind: 'match',
      prompt: 'Match each method to its worst-case convergence on L-smooth problems (exact gradients).',
      pairs: [
        ['GD, smooth convex', '$O(1/k)$'],
        ['Nesterov, smooth convex', '$O(1/k^2)$'],
        ['GD, strongly convex', 'about κ steps per factor of e'],
        ['Nesterov, strongly convex', 'about √κ steps per factor of e'],
      ],
      why: String.raw`Acceleration improves $1/k$ to $1/k^2$ in the merely convex case, and $\kappa$ to $\sqrt\kappa$ in the strongly convex case. Both accelerated rates match the first-order lower bounds up to constants.`,
    },
    {
      kind: 'fill',
      prompt: String.raw`Momentum's velocity is an exponentially weighted ___ of past gradients. Along a direction where the gradient keeps its sign, the effective step grows by $1/(1-\beta)$; along a direction where it alternates sign, the terms ___. In deep learning the default coefficient is often $\beta=$ ___.`,
      bank: ['sum', 'product', 'cancel', 'explode', '0.9', '0.1', '1.5'],
      answer: ['sum', 'cancel', '0.9'],
      why: String.raw`Unrolling gives $\mathbf v=-\eta\sum_j\beta^j\nabla L_{k-j}$, a weighted sum. Alternating signs cancel, which damps the zig-zag. $\beta=0.9$ (with values up to 0.99) is the usual SGD-momentum default; $\beta\ge1$ would never forget old gradients: with no damping the velocity does not settle, and $\beta>1$ makes it grow without bound.`,
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- Heavy ball: $\mathbf v\leftarrow\beta\mathbf v-\eta\nabla L(\boldsymbol\theta)$, $\boldsymbol\theta\leftarrow\boldsymbol\theta+\mathbf v$. It accelerates consistent directions by up to $1/(1-\beta)$ and damps oscillating ones.
- On quadratics, tuned heavy ball needs $\sim\sqrt\kappa$ steps per digit instead of $\sim\kappa$.
- Nesterov evaluates the gradient at the look-ahead point $\boldsymbol\theta+\beta\mathbf v$. It has *global* accelerated guarantees: $O(1/k^2)$ (smooth convex) and $(1-1/\sqrt\kappa)^k$ (strongly convex), which are optimal for first-order methods.
- Heavy ball's acceleration is not guaranteed beyond quadratics. With noisy gradients momentum does not eliminate the SGD noise floor.`,
    },
  ],
  references: [
    { authors: 'B. T. Polyak', title: 'Some methods of speeding up the convergence of iteration methods', year: 1964, venue: 'USSR Computational Mathematics and Mathematical Physics 4(5), 1–17' },
    { authors: 'Y. Nesterov', title: 'A method for solving the convex programming problem with convergence rate O(1/k²)', year: 1983, venue: 'Soviet Mathematics Doklady 27, 372–376' },
    { authors: 'Y. Nesterov', title: 'Introductory Lectures on Convex Optimization: A Basic Course', year: 2004, venue: 'Kluwer Academic Publishers', detail: '§2.1 (lower bounds), §2.2 (optimal methods)' },
    { authors: 'I. Sutskever, J. Martens, G. Dahl & G. Hinton', title: 'On the importance of initialization and momentum in deep learning', year: 2013, venue: 'ICML' },
    { authors: 'L. Lessard, B. Recht & A. Packard', title: 'Analysis and Design of Optimization Algorithms via Integral Quadratic Constraints', year: 2016, venue: 'SIAM Journal on Optimization 26(1), 57–95' },
  ],
} satisfies LessonContent;
