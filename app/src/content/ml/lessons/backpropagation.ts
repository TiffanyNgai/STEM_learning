import type { LessonContent } from '../../types';

// Computational graph for L = (w·x + b − y)^2 with forward values (blue) and backward gradients (red, revealed right→left).
const node = (x: number, y: number, label: string) =>
  `<circle cx="${x}" cy="${y}" r="13" fill="var(--surface)" stroke="var(--fg)" stroke-width="1.2"/><text x="${x}" y="${y + 4}" font-size="12" text-anchor="middle" fill="var(--fg)">${label}</text>`;
const edge = (x1: number, y1: number, x2: number, y2: number) =>
  `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="var(--muted)" stroke-width="1.2"/>`;
const fwd = (x: number, y: number, t: string) => `<text x="${x}" y="${y}" font-size="10" text-anchor="middle" fill="var(--c2)">${t}</text>`;
const bwd = (x: number, y: number, t: string, k: number) =>
  `<text x="${x}" y="${y}" font-size="10" text-anchor="middle" fill="var(--c5)" opacity="0">${t}<animate attributeName="opacity" values="0;0;1;1;0" keyTimes="0;${(0.1 + 0.13 * k).toFixed(2)};${(0.15 + 0.13 * k).toFixed(2)};0.92;1" dur="9s" repeatCount="indefinite"/></text>`;
const GRAPH_SVG = `<svg viewBox="0 0 320 175" xmlns="http://www.w3.org/2000/svg">
${edge(25, 45, 90, 85)}${edge(25, 125, 90, 85)}${edge(90, 85, 160, 85)}${edge(160, 150, 160, 85)}${edge(160, 85, 230, 85)}${edge(230, 150, 230, 85)}${edge(230, 85, 290, 85)}
${node(25, 45, 'w')}${node(25, 125, 'x')}${node(90, 85, '×')}${node(160, 150, 'b')}${node(160, 85, '+')}${node(230, 150, 'y')}${node(230, 85, '−')}${node(290, 85, '²')}
${fwd(50, 52, '2')}${fwd(50, 115, '3')}${fwd(125, 79, 'u=6')}${fwd(150, 122, '1')}${fwd(195, 79, 'z=7')}${fwd(220, 122, '5')}${fwd(260, 79, 'r=2')}${fwd(290, 62, 'L=4')}
${bwd(290, 117, '∂L/∂L=1', 0)}${bwd(260, 100, '4', 1)}${bwd(195, 100, '4', 2)}${bwd(244, 122, '−4', 2)}${bwd(125, 100, '4', 3)}${bwd(174, 122, '4', 3)}${bwd(66, 72, '12', 4)}${bwd(66, 100, '8', 4)}
<text x="4" y="170" font-size="9" fill="var(--c2)">blue: forward values</text><text x="316" y="170" font-size="9" text-anchor="end" fill="var(--c5)">red: gradients ∂L/∂(edge)</text>
</svg>`;

export default {
  cards: [
    {
      kind: 'explain',
      title: 'A billion derivatives, cheaply',
      body: String.raw`[Gradient descent](@ml/gradient-descent) needs $\nabla L(\boldsymbol\theta)$ — one partial derivative per parameter. A modern network has $p\sim10^9$ parameters.

**Naive approach:** nudge each parameter and re-run the network (finite differences): $p$ forward passes per step. Hopeless.

**Backpropagation** computes *all* $p$ partial derivatives exactly, at a cost of only a small constant (≈2–3) times **one** forward pass. It is just the chain rule, applied in a clever order that reuses shared work — an instance of [dynamic programming](@cs/dynamic-programming).`,
    },
    {
      kind: 'widget',
      title: 'Forward values, backward gradients',
      body: String.raw`Break a computation into elementary operations — a **computational graph**. Here $L=(wx+b-y)^2$ with $w=2,x=3,b=1,y=5$.

**Forward pass** (blue): compute values left → right: $u=6$, $z=7$, $r=2$, $L=4$.

**Backward pass** (red): starting from $\partial L/\partial L=1$, move right → left, multiplying by each node's **local derivative**.`,
      widget: { type: 'SvgDiagram', props: { svg: GRAPH_SVG }, caption: 'Gradients appear from the output backwards — that order is the whole trick.' },
    },
    {
      kind: 'widget',
      title: 'The backward pass, step by step',
      widget: {
        type: 'StepReveal',
        props: {
          steps: [
            String.raw`Start at the output: $\dfrac{\partial L}{\partial L}=1$.`,
            String.raw`$L=r^2$, local derivative $2r=4$: $\;\dfrac{\partial L}{\partial r}=1\cdot4=4$.`,
            String.raw`$r=z-y$: local derivatives $+1$ (for $z$) and $-1$ (for $y$): $\;\dfrac{\partial L}{\partial z}=4,\ \dfrac{\partial L}{\partial y}=-4$.`,
            String.raw`$z=u+b$: addition passes the gradient through unchanged: $\;\dfrac{\partial L}{\partial u}=4,\ \dfrac{\partial L}{\partial b}=4$.`,
            String.raw`$u=wx$: local derivatives are $x$ and $w$ (the *other* input): $\;\dfrac{\partial L}{\partial w}=4\cdot x=12,\ \dfrac{\partial L}{\partial x}=4\cdot w=8$.`,
          ],
          notes: ['', 'upstream × local', '', 'an add gate "distributes"', 'a multiply gate "swaps" its inputs'],
        },
      },
    },
    {
      kind: 'numeric',
      prompt: String.raw`Same graph, but now $w=1,\ x=2,\ b=0,\ y=5$. Compute $\partial L/\partial w$ for $L=(wx+b-y)^2$.`,
      answer: -12,
      why: String.raw`Forward: $z=2$, $r=z-y=-3$. Backward: $\partial L/\partial r=2r=-6$, passes through $+$ and $-$ unchanged to $\partial L/\partial u=-6$, then multiply by $x=2$: $-12$. Negative means increasing $w$ lowers the loss (the prediction 2 is too small).`,
    },
    {
      kind: 'explain',
      title: 'Upstream × local',
      body: String.raw`Every node only needs to know its **own** local derivative. During the backward pass it receives the **upstream gradient** $\bar v=\partial L/\partial v$ for its output $v$ and sends $\bar v\cdot\partial v/\partial u$ to each input $u$.

If a value feeds **several** nodes (fan-out), its gradients **add up** — the multivariable chain rule:
$$\frac{\partial L}{\partial u}=\sum_{\text{children }v}\frac{\partial L}{\partial v}\frac{\partial v}{\partial u}.$$

Handy patterns: **add** copies the gradient to all inputs; **multiply** sends each input the upstream gradient times the *other* input; **max** routes it only to the winning input; **ReLU** passes it where the input was positive and blocks it elsewhere.`,
    },
    {
      kind: 'match',
      prompt: 'Match each operation to what it does in the backward pass.',
      pairs: [
        [String.raw`$v=a+b$`, 'Copies the upstream gradient to both inputs'],
        [String.raw`$v=a\cdot b$`, 'Sends a the upstream gradient × b, and b the upstream gradient × a'],
        [String.raw`$v=\max(a,b)$`, 'Routes the whole gradient to the larger input, zero to the other'],
        ['A value used by two later nodes', 'Receives the sum of the gradients from both uses'],
      ],
      why: String.raw`These follow from local derivatives: $\partial(a+b)/\partial a=1$; $\partial(ab)/\partial a=b$; $\partial\max(a,b)/\partial a=\mathbb 1[a>b]$; and fan-out sums by the multivariable chain rule.`,
    },
    {
      kind: 'explain',
      title: 'Backprop for an MLP, in matrix form',
      body: String.raw`Layer $\ell$ computes $\mathbf z^{(\ell)}=W^{(\ell)}\mathbf a^{(\ell-1)}+\mathbf b^{(\ell)}$, $\mathbf a^{(\ell)}=\varphi(\mathbf z^{(\ell)})$, with $\mathbf a^{(0)}=\mathbf x$. Define the **error signal** $\boldsymbol\delta^{(\ell)}=\partial L/\partial\mathbf z^{(\ell)}$. Then

$$\boldsymbol\delta^{(\ell)}=\big(W^{(\ell+1)\top}\boldsymbol\delta^{(\ell+1)}\big)\odot\varphi'(\mathbf z^{(\ell)}),$$
$$\frac{\partial L}{\partial W^{(\ell)}}=\boldsymbol\delta^{(\ell)}\,\mathbf a^{(\ell-1)\top},\qquad\frac{\partial L}{\partial\mathbf b^{(\ell)}}=\boldsymbol\delta^{(\ell)}.$$

($\odot$ = element-wise product.) For a sigmoid output with cross-entropy loss the start is beautifully simple: $\delta^{(\text{out})}=\hat y-y$ (prediction minus label).

Note the forward activations $\mathbf a^{(\ell-1)}$ are needed in the backward pass, so they must be **stored** — the main memory cost of training.`,
    },
    {
      kind: 'fill',
      prompt: String.raw`In backprop, the error signal moves backwards through a layer by multiplying by the ___ of the weight matrix and then element-wise by ___. The weight gradient is the outer product of $\boldsymbol\delta^{(\ell)}$ with the layer's ___.`,
      bank: ['transpose', 'inverse', "φ′(z)", 'φ(z)', 'input activations', 'output activations', 'biases'],
      answer: ['transpose', "φ′(z)", 'input activations'],
      why: String.raw`The forward map is $W\mathbf a$, whose Jacobian w.r.t. $\mathbf a$ is $W$, so vector–Jacobian products use $W^\top$ (not $W^{-1}$). The activation contributes its derivative $\varphi'$. Since $\partial z_j/\partial W_{jk}=a_k$, the weight gradient is $\boldsymbol\delta\,\mathbf a^{(\ell-1)\top}$, using the layer's *inputs*.`,
    },
    {
      kind: 'explain',
      title: 'Reverse mode vs forward mode',
      body: String.raw`The chain rule multiplies Jacobians $J_1J_2\cdots J_K$. Order matters for cost:

- **Forward mode** pushes a direction *forwards* (Jacobian–vector products). One pass gives derivatives of all outputs w.r.t. **one** input.
- **Reverse mode** (backprop) pulls a cotangent *backwards* (vector–Jacobian products). One pass gives derivatives of **one** output w.r.t. **all** inputs.

Training has one scalar loss and $p$ parameters, so reverse mode costs $O(1)$ passes instead of $O(p)$ — see [big-O](@cs/big-o). The price: memory for stored activations (mitigated by *gradient checkpointing*, which recomputes some of them). Frameworks like PyTorch and JAX implement this as **automatic differentiation**.`,
    },
    {
      kind: 'mcq',
      prompt: 'Why is reverse-mode differentiation (backprop) preferred over forward mode for training neural networks?',
      choices: [
        'Forward mode gives only approximate derivatives.',
        'Training has a single scalar output (the loss) and very many inputs (parameters); reverse mode gets all their gradients in one backward pass.',
        'Reverse mode needs less memory than forward mode.',
        'Forward mode cannot handle nonlinear activation functions.',
      ],
      answer: 1,
      why: String.raw`Both modes are exact. Forward mode would need one pass per parameter ($p$ passes), reverse mode one pass for the scalar loss. Reverse mode actually uses *more* memory, because it stores the forward activations.`,
    },
    {
      kind: 'widget',
      title: 'Backprop in action',
      body: String.raw`Every frame this network does: forward pass on all points → backprop of the cross-entropy loss → gradient step. Watch the weight thicknesses (right) change. Try XOR with 2–3 hidden units; re-initialize to see that different random starts find different solutions.`,
      widget: { type: 'NeuralNetPlayground', props: { dataset: 'xor', hidden: 3, lr: 0.8 } },
    },
    {
      kind: 'explain',
      title: 'Vanishing and exploding gradients',
      body: String.raw`Unrolling the recursion, the gradient at layer 1 contains a **product over all layers**: $\prod_\ell W^{(\ell)\top}\operatorname{diag}\varphi'(\mathbf z^{(\ell)})$.

The sigmoid's derivative is at most $\sigma'(0)=\tfrac14$, so through 10 sigmoid layers (with unit-scale weights) the signal can shrink by $(1/4)^{10}\approx10^{-6}$: early layers barely learn (**vanishing gradients**). If weights are large, the product can instead blow up (**exploding gradients**).

Remedies: ReLU-type activations ($\varphi'=1$ on the active side), careful [initialization](@ml/initialization-activations), [normalization layers](@ml/normalization-layers), [residual connections](@ml/residual-connections), and gradient clipping.`,
      widget: {
        type: 'FunctionPlot',
        props: { fns: ['exp(-x)/(1+exp(-x))^2', '1-tanh(x)^2', 'x>0?1:0'], x: [-5, 5], y: [-0.1, 1.2], labels: ["σ′(z)", "tanh′(z)", "ReLU′(z)"], xLabel: 'z' },
      },
    },
    {
      kind: 'numeric',
      prompt: String.raw`Ignoring weights, what is the largest possible factor by which a gradient can be multiplied when passing back through **5** sigmoid layers, i.e. $\big(\max_z\sigma'(z)\big)^5$? Give a decimal.`,
      answer: 0.0009765625,
      tolerance: 0.00002,
      why: String.raw`$\sigma'(z)=\sigma(z)(1-\sigma(z))$ peaks at $z=0$ with value $\tfrac14$. $(1/4)^5=1/1024\approx0.00098$ — even in the best case the signal shrinks a thousandfold.`,
    },
    {
      kind: 'truefalse',
      prompt: 'Backpropagation must store (or recompute) the activations from the forward pass.',
      answer: true,
      why: String.raw`Local derivatives depend on forward values — e.g. $\partial L/\partial W^{(\ell)}=\boldsymbol\delta^{(\ell)}\mathbf a^{(\ell-1)\top}$ and $\varphi'(\mathbf z^{(\ell)})$. That is why training uses far more memory than inference, and why gradient checkpointing trades compute for memory.`,
    },
    {
      kind: 'order',
      prompt: 'Order the steps of computing gradients with backprop for one mini-batch.',
      steps: [
        'Run the forward pass, storing every intermediate value',
        'Evaluate the scalar loss and seed its gradient with 1',
        'Visit nodes in reverse topological order, multiplying upstream gradients by local derivatives',
        'Sum gradient contributions wherever a value fanned out to several nodes',
        'Read off ∂L/∂θ for every parameter and hand it to the optimizer',
      ],
      why: 'A node can only send gradients to its inputs once it has received gradients from all of its consumers — hence reverse topological order, with fan-out contributions summed.',
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- Backprop = chain rule on a computational graph, evaluated output → input, reusing shared sub-products.
- Each node sends back *upstream gradient × local derivative*; fan-out gradients add.
- MLP recursion: $\boldsymbol\delta^{(\ell)}=(W^{(\ell+1)\top}\boldsymbol\delta^{(\ell+1)})\odot\varphi'(\mathbf z^{(\ell)})$, $\nabla_{W^{(\ell)}}L=\boldsymbol\delta^{(\ell)}\mathbf a^{(\ell-1)\top}$.
- Reverse mode costs a constant multiple of one forward pass for all parameters, at the price of storing activations.
- Products of many Jacobians cause vanishing/exploding gradients — motivating ReLU, good init, normalization and residuals.`,
    },
  ],
  references: [
    { authors: 'D. E. Rumelhart, G. E. Hinton & R. J. Williams', title: 'Learning representations by back-propagating errors', year: 1986, venue: 'Nature 323, 533–536' },
    { authors: 'A. G. Baydin, B. A. Pearlmutter, A. A. Radul & J. M. Siskind', title: 'Automatic Differentiation in Machine Learning: a Survey', year: 2018, venue: 'JMLR 18(153)', url: 'https://arxiv.org/abs/1502.05767' },
    { authors: 'S. J. D. Prince', title: 'Understanding Deep Learning', year: 2023, venue: 'MIT Press', detail: 'Ch. 7', url: 'https://udlbook.github.io/udlbook/' },
    { authors: 'I. Goodfellow, Y. Bengio & A. Courville', title: 'Deep Learning', year: 2016, venue: 'MIT Press', detail: 'Ch. 6.5', url: 'https://www.deeplearningbook.org' },
  ],
} satisfies LessonContent;
