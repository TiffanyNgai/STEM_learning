import type { LessonContent } from '../../types';

export default {
  cards: [
    {
      kind: 'explain',
      title: 'One straight line is not enough',
      body: String.raw`[Logistic regression](@ml/logistic-regression-ml) classifies points by drawing a single straight line (in 2D) and squashing the distance from it into a probability.

Press **Play** below: the model has **zero hidden neurons**, so it *is* logistic regression. No straight line can separate the blue disc from the orange ring around it — the accuracy gets stuck.

A **neural network** fixes this by stacking many such simple units so that their *combination* can bend the boundary. Try raising the hidden width afterwards.`,
      widget: { type: 'NeuralNetPlayground', props: { dataset: 'circle', hidden: 0, lr: 0.5 }, caption: 'Hidden width 0 = logistic regression. Raise it to 3–4 and press Play again.' },
    },
    {
      kind: 'explain',
      title: 'A single neuron',
      body: String.raw`A **neuron** takes inputs $x_1,\dots,x_d$, forms a weighted sum plus a bias, then applies a nonlinear **activation function** $\varphi$:

$$z = w_1x_1+\dots+w_dx_d + b = \mathbf w^\top\mathbf x + b,\qquad a=\varphi(z).$$

- $\mathbf w$ (weights) sets the *direction* and *steepness* of the response,
- $b$ (bias) *shifts* it,
- $a$ is the neuron's output, its **activation**.

With $\varphi=\sigma$ (the sigmoid $\sigma(z)=1/(1+e^{-z})$) this is exactly logistic regression. In 1D the output is $\tfrac12$ where $wx+b=0$, i.e. at $x=-b/w$. Drag the sliders.`,
      widget: {
        type: 'FunctionPlot',
        props: { fns: ['1/(1+exp(-(w*x+b)))'], x: [-6, 6], y: [-0.2, 1.2], params: [{ name: 'w', min: -4, max: 4, value: 1.5 }, { name: 'b', min: -6, max: 6, value: 0 }], xLabel: 'x', yLabel: 'σ(wx+b)' },
        caption: 'Bigger |w| → sharper step; changing b slides the step to x = −b/w; negative w flips it.',
      },
    },
    {
      kind: 'numeric',
      prompt: String.raw`A 1D sigmoid neuron has $w=2$, $b=-3$. At what input $x$ is its output exactly $0.5$?`,
      answer: 1.5,
      tolerance: 0.01,
      why: String.raw`$\sigma(z)=0.5$ exactly when $z=0$, so $2x-3=0\Rightarrow x=1.5$. In general the threshold sits at $-b/w$, not at $b$ or $w$ alone.`,
    },
    {
      kind: 'explain',
      title: 'Layers of neurons',
      body: String.raw`Put $m$ neurons side by side and they form a **layer**. Stacking their weight vectors as rows of a matrix $W\in\mathbb R^{m\times d}$:

$$\mathbf h=\varphi(W^{(1)}\mathbf x+\mathbf b^{(1)}),\qquad \hat y=\sigma(\mathbf w^{(2)\top}\mathbf h+b^{(2)}).$$

$\varphi$ is applied entry-by-entry. The middle vector $\mathbf h$ is a **hidden layer** (we never observe it in the data). This is a **multilayer perceptron (MLP)**; "deep" just means many hidden layers.

**Counting parameters.** A layer mapping $d\to m$ has $m\cdot d$ weights and $m$ biases. A $3\to5\to1$ network has $(15+5)+(5+1)=26$ parameters.`,
    },
    {
      kind: 'numeric',
      prompt: String.raw`How many trainable parameters (weights + biases) does a fully connected $2\to4\to1$ network have?`,
      answer: 17,
      why: String.raw`Layer 1: $4\times2=8$ weights $+4$ biases $=12$. Layer 2: $1\times4=4$ weights $+1$ bias $=5$. Total $17$. A common slip is forgetting the biases (giving 12).`,
    },
    {
      kind: 'explain',
      title: 'Why the nonlinearity is essential',
      body: String.raw`Remove $\varphi$ and the network collapses:

$$W^{(2)}(W^{(1)}\mathbf x+\mathbf b^{(1)})+\mathbf b^{(2)}=\underbrace{W^{(2)}W^{(1)}}_{W}\mathbf x+\underbrace{W^{(2)}\mathbf b^{(1)}+\mathbf b^{(2)}}_{\mathbf b}.$$

A composition of affine maps is still **affine** (linear + shift). So a 100-layer network without activations can draw only one straight boundary — no better than logistic regression. The nonlinearity is what lets each layer *bend* the space before the next one cuts it.`,
    },
    {
      kind: 'truefalse',
      prompt: String.raw`A 10-layer network whose activations are all the identity, $\varphi(z)=z$, followed by a sigmoid output, can solve XOR.`,
      answer: false,
      why: String.raw`All 10 linear layers multiply into a single affine map, so the model is just logistic regression, whose decision boundary is one straight line — and XOR's classes cannot be split by one line. Depth only helps when there are nonlinearities between layers.`,
    },
    {
      kind: 'explain',
      title: 'Common activation functions',
      body: String.raw`- **Sigmoid** $\sigma(z)=\frac1{1+e^{-z}}\in(0,1)$ — historic; saturates (flat) for large $|z|$.
- **tanh** $(z)\in(-1,1)$ — zero-centred sigmoid: $\tanh z=2\sigma(2z)-1$.
- **ReLU** $\max(0,z)$ — cheap, does not saturate for $z>0$; the default since ~2012.
- **GELU** $z\,\Phi(z)$ ($\Phi$ = standard normal CDF) — a smooth ReLU used in transformers.

Flat regions matter because, as we will see in [backpropagation](@ml/backpropagation), learning signals are multiplied by $\varphi'(z)$; where $\varphi'\approx0$, learning stalls.`,
      widget: {
        type: 'FunctionPlot',
        props: { fns: ['1/(1+exp(-x))', 'tanh(x)', 'max(0,x)', '0.5*x*(1+tanh(0.7978845608*(x+0.044715*x^3)))'], x: [-4, 4], y: [-1.5, 3], labels: ['sigmoid', 'tanh', 'ReLU', 'GELU'], xLabel: 'z', yLabel: 'φ(z)' },
      },
    },
    {
      kind: 'match',
      prompt: 'Match each activation to its defining property.',
      pairs: [
        ['sigmoid', String.raw`output in $(0,1)$; interpretable as a probability`],
        ['tanh', String.raw`output in $(-1,1)$; zero-centred`],
        ['ReLU', String.raw`exactly zero for $z<0$, identity for $z>0$`],
        ['GELU', String.raw`smooth $z\,\Phi(z)$; standard in transformers`],
      ],
      why: String.raw`Sigmoid and tanh are both S-shaped but differ in range ($\tanh z = 2\sigma(2z)-1$). ReLU is piecewise linear; GELU is a smooth, slightly non-monotone version of it.`,
    },
    {
      kind: 'widget',
      title: 'Watch hidden units carve the plane',
      body: String.raw`Each hidden tanh unit contributes one soft straight "cut" of the plane (its own little logistic regression). The output neuron then **combines** these cuts — with 3–4 units it can enclose the disc. Try **xor** (needs ≥2 units), then **spiral** (needs many units or 2 layers and patience). The right panel shows the weights: green positive, red negative, thickness = magnitude.`,
      widget: { type: 'NeuralNetPlayground', props: { dataset: 'circle', hidden: 4 } },
    },
    {
      kind: 'explain',
      title: 'Universal approximation',
      body: String.raw`**Intuition.** With ReLUs you can build a "bump": $\mathrm{hat}(x)=\mathrm{ReLU}(x+1)-2\,\mathrm{ReLU}(x)+\mathrm{ReLU}(x-1)$. Shift, scale and add many bumps and you can trace any continuous curve — like approximating a skyline with Lego.

**Theorem** (Cybenko 1989; Hornik 1991; Leshno et al. 1993). For any continuous $f$ on a closed bounded set $K\subset\mathbb R^d$ and any $\varepsilon>0$, there is a one-hidden-layer network $g$ with a continuous **non-polynomial** activation such that $\max_{x\in K}|f(x)-g(x)|<\varepsilon$.

**Caveats.** It is an *existence* result: the width needed can grow exponentially with $d$, and it says nothing about whether gradient descent will *find* those weights, or whether they generalize.`,
      widget: {
        type: 'FunctionPlot',
        props: { fns: ['a*(max(0,x+1)-2*max(0,x)+max(0,x-1)) + c*(max(0,x-1)-2*max(0,x-2)+max(0,x-3))'], x: [-3, 5], y: [-1.5, 2.5], params: [{ name: 'a', min: -2, max: 2, value: 1, label: 'bump 1 height' }, { name: 'c', min: -2, max: 2, value: 0.5, label: 'bump 2 height' }] },
        caption: 'Two "hat" bumps, each built from 3 ReLU units. More bumps → any continuous shape.',
      },
    },
    {
      kind: 'multi',
      prompt: 'Which statements does the universal approximation theorem actually guarantee? (Select all that apply.)',
      choices: [
        'A wide enough one-hidden-layer network can approximate any continuous function on a bounded region to any accuracy.',
        'Gradient descent will find the approximating weights.',
        'The required number of hidden units is small (polynomial in the input dimension).',
        'The activation must not be a polynomial.',
      ],
      answers: [0, 3],
      why: String.raw`UAT is purely about *existence* of weights for non-polynomial activations (a polynomial activation keeps the network a polynomial of bounded degree, which cannot approximate everything). It promises nothing about optimization or about the width being reasonable — in the worst case it is exponential in $d$.`,
    },
    {
      kind: 'order',
      prompt: String.raw`Put the steps of a forward pass through a $d\to m\to1$ classifier in order.`,
      steps: [
        String.raw`Receive the input vector $\mathbf x$`,
        String.raw`Compute pre-activations $\mathbf z=W^{(1)}\mathbf x+\mathbf b^{(1)}$`,
        String.raw`Apply the activation element-wise: $\mathbf h=\varphi(\mathbf z)$`,
        String.raw`Compute the output logit $w^{(2)\top}\mathbf h+b^{(2)}$`,
        String.raw`Squash with a sigmoid to get $\hat y=p(y=1\mid\mathbf x)$`,
      ],
      why: 'Every layer is "affine map, then nonlinearity". The final sigmoid turns the last affine output (the logit) into a probability, exactly as in logistic regression.',
    },
    {
      kind: 'fill',
      prompt: String.raw`Each layer of an MLP applies an ___ map followed by an element-wise ___. Without the latter, a classifier built this way can only draw ___ decision boundaries (straight lines or flat planes), however many layers it has.`,
      bank: ['affine', 'nonlinearity', 'linear', 'softmax', 'convolution', 'quadratic'],
      answer: ['affine', 'nonlinearity', 'linear'],
      why: String.raw`$W\mathbf x+\mathbf b$ is affine; the activation $\varphi$ is the nonlinearity. Compositions of affine maps are affine, so without $\varphi$ the whole network is one affine map and its decision boundaries are linear (hyperplanes).`,
    },
    {
      kind: 'mcq',
      prompt: 'Why do practitioners use deep (many-layer) networks if one hidden layer is already a universal approximator?',
      choices: [
        'Because one hidden layer can only represent linear functions.',
        'Because some functions need exponentially many units in a shallow net but only polynomially many in a deep one, and depth reuses features hierarchically.',
        'Because deeper networks always have fewer parameters.',
        'Because the theorem only holds for sigmoid activations.',
      ],
      answer: 1,
      why: String.raw`Depth-separation results (e.g. Telgarsky 2016: a sawtooth with $2^k$ teeth needs $O(k)$ layers of ReLUs but exponentially many units if shallow) show depth buys efficiency. One hidden layer is nonlinear (so A is wrong), and depth does not guarantee fewer parameters.`,
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- A neuron computes $\varphi(\mathbf w^\top\mathbf x+b)$; a sigmoid neuron *is* logistic regression.
- An MLP alternates affine maps and nonlinearities: $\mathbf h^{(\ell)}=\varphi(W^{(\ell)}\mathbf h^{(\ell-1)}+\mathbf b^{(\ell)})$.
- Without nonlinearities, depth is useless — everything collapses to one affine map.
- Universal approximation: one wide hidden layer can approximate any continuous function on a compact set — an existence statement only.
- Next: how to *find* good weights — [gradient descent](@ml/gradient-descent) and [backpropagation](@ml/backpropagation).`,
    },
  ],
  references: [
    { authors: 'S. J. D. Prince', title: 'Understanding Deep Learning', year: 2023, venue: 'MIT Press', detail: 'Ch. 3–4', url: 'https://udlbook.github.io/udlbook/' },
    { authors: 'C. M. Bishop & H. Bishop', title: 'Deep Learning: Foundations and Concepts', year: 2024, venue: 'Springer', detail: 'Ch. 6' },
    { authors: 'G. Cybenko', title: 'Approximation by superpositions of a sigmoidal function', year: 1989, venue: 'Mathematics of Control, Signals and Systems 2, 303–314' },
    { authors: 'M. Telgarsky', title: 'Benefits of depth in neural networks', year: 2016, venue: 'COLT' },
  ],
} satisfies LessonContent;
