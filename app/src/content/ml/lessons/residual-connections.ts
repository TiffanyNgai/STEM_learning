import type { LessonContent } from '../../types';

// Plain block (top) vs residual block (bottom). Red dots = gradient flowing backwards (right → left).
const box = (x: number, y: number, t: string) =>
  `<rect x="${x}" y="${y - 13}" width="64" height="26" rx="5" fill="var(--surface)" stroke="var(--fg)" stroke-width="1.2"/><text x="${x + 32}" y="${y + 4}" font-size="11" text-anchor="middle" fill="var(--fg)">${t}</text>`;
const dot = (path: string, fade: boolean, begin = '0s') =>
  `<circle r="4.5" fill="var(--c5)"><animateMotion path="${path}" dur="3s" begin="${begin}" repeatCount="indefinite"/>${fade ? `<animate attributeName="opacity" values="1;1;0.15;0.15" keyTimes="0;0.3;0.6;1" dur="3s" begin="${begin}" repeatCount="indefinite"/>` : ''}</circle>`;
const RES_SVG = `<svg viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg">
<defs><marker id="rcA" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0L10,5L0,10z" fill="var(--muted)"/></marker></defs>
<text x="8" y="16" font-size="10" fill="var(--fg)" font-weight="bold">plain: h → F(h)</text>
<line x1="44" y1="45" x2="118" y2="45" stroke="var(--muted)" stroke-width="1.3" marker-end="url(#rcA)"/>
<line x1="182" y1="45" x2="274" y2="45" stroke="var(--muted)" stroke-width="1.3" marker-end="url(#rcA)"/>
<circle cx="32" cy="45" r="12" fill="var(--surface)" stroke="var(--fg)"/><text x="32" y="49" font-size="10" text-anchor="middle" fill="var(--fg)">h</text>
${box(118, 45, 'F = W·φ')}
<circle cx="288" cy="45" r="12" fill="var(--surface)" stroke="var(--fg)"/><text x="288" y="49" font-size="10" text-anchor="middle" fill="var(--fg)">out</text>
${dot('M276,45 L44,45', true)}
<text x="8" y="96" font-size="10" fill="var(--fg)" font-weight="bold">residual: h → h + F(h)</text>
<path d="M44,150 C80,108 190,108 222,142" fill="none" stroke="var(--c1)" stroke-width="2" marker-end="url(#rcA)"/>
<text x="133" y="113" font-size="9" text-anchor="middle" fill="var(--c1)">identity shortcut</text>
<line x1="44" y1="155" x2="118" y2="155" stroke="var(--muted)" stroke-width="1.3" marker-end="url(#rcA)"/>
<line x1="182" y1="155" x2="218" y2="155" stroke="var(--muted)" stroke-width="1.3" marker-end="url(#rcA)"/>
<line x1="242" y1="155" x2="274" y2="155" stroke="var(--muted)" stroke-width="1.3" marker-end="url(#rcA)"/>
<circle cx="32" cy="155" r="12" fill="var(--surface)" stroke="var(--fg)"/><text x="32" y="159" font-size="10" text-anchor="middle" fill="var(--fg)">h</text>
${box(118, 155, 'F = W·φ')}
<circle cx="230" cy="155" r="11" fill="var(--surface)" stroke="var(--fg)"/><text x="230" y="160" font-size="14" text-anchor="middle" fill="var(--fg)">+</text>
<circle cx="288" cy="155" r="12" fill="var(--surface)" stroke="var(--fg)"/><text x="288" y="159" font-size="10" text-anchor="middle" fill="var(--fg)">out</text>
${dot('M276,155 L44,155', true)}${dot('M276,155 L232,150 C190,108 80,108 44,150', false)}
<text x="160" y="192" font-size="9" text-anchor="middle" fill="var(--c5)">red = gradient flowing back; through F it can shrink, along the shortcut it cannot</text>
</svg>`;

export default {
  cards: [
    {
      kind: 'explain',
      title: 'Deeper was worse, even on the training set',
      body: String.raw`By 2015, BatchNorm and He initialization let plain networks with 20–30 layers train. Going deeper still failed in a surprising way. **He et al. (2016)** found that a 56-layer plain CNN had **higher training error** than a 20-layer one on CIFAR-10. They called this the **degradation problem**.

It is not overfitting, because overfitting would show up as *low* training error. It is also puzzling, because the deeper net could copy the 20-layer net and set its extra 36 layers to the **identity** map. That would give at least the same training error. Gradient descent simply failed to find such a solution: a stack of nonlinear layers struggles to represent "do nothing".`,
    },
    {
      kind: 'mcq',
      prompt: 'A 56-layer plain network has higher *training* error than a 20-layer plain network. What is the best diagnosis?',
      choices: [
        'The 56-layer net is overfitting.',
        'An optimization problem: a solution at least as good exists (extra identity layers), but training does not find it.',
        'The 56-layer net has too few parameters.',
        'Deeper networks are strictly less expressive than shallower ones.',
      ],
      answer: 1,
      why: String.raw`Overfitting means low training error with high test error, but here the training error itself is worse. The deep net can represent everything the shallow one can (pad it with identity layers) and has more parameters, so it is not less expressive. The failure is in optimization.`,
    },
    {
      kind: 'widget',
      title: 'The residual block',
      body: String.raw`The fix is to make the identity the default. A **residual block** outputs its input **plus** a learned correction:
$$\mathbf h_{\ell+1}=\mathbf h_\ell+F_\ell(\mathbf h_\ell).$$
$F_\ell$ (the **residual branch**) is a small stack of layers, e.g. conv–BN–ReLU–conv–BN. To act as the identity, the block only has to learn $F_\ell=\mathbf 0$, which is easy: drive the last weights towards 0. The **shortcut** adds no parameters. When the shapes differ (more channels, smaller image), a learned projection such as a 1×1 convolution is used on the shortcut instead.`,
      widget: { type: 'SvgDiagram', props: { svg: RES_SVG } },
    },
    {
      kind: 'explain',
      title: 'Why gradients survive',
      body: String.raw`Differentiate one block: $\dfrac{\partial\mathbf h_{\ell+1}}{\partial\mathbf h_\ell}=I+J_\ell$, where $J_\ell=\partial F_\ell/\partial\mathbf h_\ell$ is the Jacobian of the branch. Across many blocks,
$$\frac{\partial\mathbf h_L}{\partial\mathbf h_\ell}=\prod_{k=\ell}^{L-1}(I+J_k)=I+\sum_k J_k+\sum_{k<k'}J_{k'}J_k+\dots$$
The leading $I$ is a **direct path** from the loss to every layer. Even if every $J_k$ is small, the gradient at layer $\ell$ is not wiped out. In a plain net the product is $\prod_k J_k$, which has no such term.

**Scalar picture**: if each branch has derivative $0.05$, ten residual blocks give $1.05^{10}\approx1.63$. Ten plain layers with derivative $0.5$ give $0.5^{10}\approx0.001$.`,
    },
    {
      kind: 'numeric',
      prompt: String.raw`A scalar plain network has 10 layers, each with local derivative $0.5$. By what factor is the gradient multiplied from the output back to the input? Give a decimal.`,
      answer: 0.0009765625,
      tolerance: 0.00002,
      why: String.raw`The chain rule multiplies the local derivatives: $0.5^{10}=1/1024\approx0.00098$. With residual blocks whose branches had derivative $-0.5$, each factor would be $1-0.5=0.5$ as well. The shortcut helps when the branch derivatives are small, giving factors near 1. It is not a cure for every case.`,
    },
    {
      kind: 'widget',
      title: 'Plain vs residual: gradient size per layer',
      body: String.raw`Both networks use the **same** random blocks $F_\ell(\mathbf h)=W_\ell\,\varphi(\mathbf h)$, with 30 of them. Red bars: plain stack. Green bars: residual stack. The bars show the gradient reaching each layer at initialization.

1. **sigmoid**: the plain gradient collapses by over 15 orders of magnitude, while the residual one stays near 1.
2. **ReLU**, gain 1: the plain net vanishes again. The residual net now **grows**, because every block adds variance.
3. Press **α = 1/√L** to shrink each branch. The residual gradients become flat.

Toggle **∂L/∂W** to see the weight gradients instead.`,
      widget: { type: 'MlResidualGrad', props: { activation: 'sigmoid', gain: 1, depth: 30 } },
    },
    {
      kind: 'explain',
      title: 'Residuals are not the whole story',
      body: String.raw`The widget shows a real subtlety. With unit-scale branches, $\operatorname{Var}(\mathbf h_{\ell+1})\approx\operatorname{Var}(\mathbf h_\ell)+\operatorname{Var}(F_\ell)$, so the signal **accumulates** over depth. Practical networks control this in several ways:

- **Normalization inside the branch.** ResNets put [BatchNorm](@ml/normalization-layers) in every branch. Most modern transformers use "pre-norm" blocks $\mathbf h+F(\operatorname{LN}(\mathbf h))$.
- **Small branches at the start.** A common trick is to zero-initialize the last normalization scale $\gamma$ in each branch, so every block begins as exactly the identity. Branches can also be scaled by something like $1/\sqrt L$.

With these, ResNets reached **152 layers** on ImageNet, and the original ResNet won the ILSVRC 2015 classification task. On CIFAR-10 even a **1202-layer** network trained, though it generalized slightly worse than a 110-layer one.`,
    },
    {
      kind: 'truefalse',
      prompt: 'An identity shortcut connection adds extra trainable parameters to a residual block.',
      answer: false,
      why: String.raw`The identity shortcut just adds $\mathbf h_\ell$ to the branch output: no weights and almost no compute. Parameters appear only when a **projection** shortcut (e.g. a 1×1 convolution) is needed to match shapes.`,
    },
    {
      kind: 'recall',
      title: 'From first-order ODEs',
      points: [
        String.raw`An ODE $\dfrac{d\mathbf h}{dt}=f(\mathbf h,t)$ says how a state changes continuously in time.`,
        String.raw`**Euler's method** steps forward: $\mathbf h(t+\Delta t)\approx\mathbf h(t)+\Delta t\,f(\mathbf h(t),t)$.`,
        String.raw`Smaller steps $\Delta t$ track the true solution more closely; the error per unit time is $O(\Delta t)$.`,
      ],
      link: 'math/ode-first-order',
    },
    {
      kind: 'explain',
      title: 'ResNets as discretized ODEs',
      body: String.raw`Compare a residual block with an Euler step:
$$\mathbf h_{\ell+1}=\mathbf h_\ell+F(\mathbf h_\ell,\theta_\ell)\qquad\text{vs}\qquad\mathbf h(t+\Delta t)=\mathbf h(t)+\Delta t\,f(\mathbf h(t),t).$$
They have the same form with $\Delta t=1$ and the layer index $\ell$ playing the role of time. A ResNet moves its input through feature space in many small steps, and **depth is time**.

Taking this literally gives **Neural ODEs** (Chen et al. 2018): define $d\mathbf h/dt=f_\theta(\mathbf h,t)$ with one network $f_\theta$ and let an adaptive ODE solver choose the steps. In the widget, each Euler step is one "residual block". Shrink the step to see many small blocks approach a continuous flow.`,
      widget: { type: 'SlopeFieldEuler', props: { f: 'cos(x) - 0.4*y', x: [0, 6], y: [-3, 3], x0: 0, y0: -2, h: 1 }, caption: 'Each step: new state = old state + step × (learned direction). That is a residual block.' },
    },
    {
      kind: 'match',
      prompt: 'Match each term to its meaning.',
      pairs: [
        ['degradation problem', 'deeper plain nets reach higher training error than shallower ones'],
        ['identity shortcut', String.raw`adds the block input $\mathbf h_\ell$ to the branch output`],
        ['projection shortcut', 'a learned map (e.g. 1×1 conv) used when the shapes change'],
        ['Neural ODE', 'the continuous-depth limit, with layers replaced by an ODE solver'],
      ],
      why: String.raw`Degradation is an optimization failure measured on the training set. The two shortcut types differ in whether they have parameters. A Neural ODE takes the "residual block = Euler step" analogy to its continuous limit.`,
    },
    {
      kind: 'fill',
      prompt: String.raw`A residual block computes $\mathbf h_{\ell+1}=$ ___. Its Jacobian is $I+J_\ell$, so the product over many blocks always contains the ___ term, a direct gradient path. The update has the same form as one step of ___ method for an ODE.`,
      bank: [String.raw`$\mathbf h_\ell+F(\mathbf h_\ell)$`, String.raw`$F(\mathbf h_\ell)$`, 'identity', 'zero', "Euler's", "Newton's"],
      answer: [String.raw`$\mathbf h_\ell+F(\mathbf h_\ell)$`, 'identity', "Euler's"],
      why: String.raw`The skip adds the input back, so the derivative is $I+J_\ell$. Expanding $\prod(I+J_k)$ always leaves an $I$. The form "state + step × direction" is forward Euler. Newton's method is a root-finding iteration, not an ODE integrator.`,
    },
    {
      kind: 'multi',
      prompt: 'Which statements about residual networks are true? (Select all that apply.)',
      choices: [
        'They make it easy for a block to represent the identity map by learning a branch output near zero.',
        'They give the gradient a path to early layers that does not pass through every branch Jacobian.',
        'With unit-scale branches and no normalization, the activation variance tends to grow with depth.',
        'They work by reducing the number of parameters compared with a plain net of the same depth.',
      ],
      answers: [0, 1, 2],
      why: String.raw`Learning $F\approx0$ is easy, and the $I$ in $\prod(I+J_k)$ is the direct path. Each block adds its branch's variance, so the signal accumulates. That is why branches are normalized or scaled down. Identity shortcuts add no parameters but remove none either: the branches are the same layers as in the plain net.`,
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- Plain deep nets suffer from **degradation**: higher training error with more depth, which is an optimization failure.
- A residual block computes $\mathbf h+F(\mathbf h)$. The identity becomes easy to represent, and the Jacobian $I+J$ gives gradients a direct path to every layer.
- Residuals still need control of scale: normalization inside branches, pre-norm, or zero/small-initialized branches.
- A residual block is an Euler step of an ODE. Neural ODEs take the continuous limit.
- ResNets (2016) enabled 100+ layer CNNs, and the same $\mathbf h+F(\mathbf h)$ pattern is in every transformer block.`,
    },
  ],
  references: [
    { authors: 'K. He, X. Zhang, S. Ren & J. Sun', title: 'Deep Residual Learning for Image Recognition', year: 2016, venue: 'CVPR', url: 'https://arxiv.org/abs/1512.03385' },
    { authors: 'R. T. Q. Chen, Y. Rubanova, J. Bettencourt & D. Duvenaud', title: 'Neural Ordinary Differential Equations', year: 2018, venue: 'NeurIPS', url: 'https://arxiv.org/abs/1806.07366' },
    { authors: 'S. J. D. Prince', title: 'Understanding Deep Learning', year: 2023, venue: 'MIT Press', detail: 'Ch. 11 (residual networks)', url: 'https://udlbook.github.io/udlbook/' },
  ],
} satisfies LessonContent;
