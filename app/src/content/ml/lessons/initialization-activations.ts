import type { LessonContent } from '../../types';

// Numerical derivative of the tanh-approximation of GELU, for plotting.
const G = (s: string) => `0.5*(${s})*(1+tanh(0.7978845608*((${s})+0.044715*(${s})^3)))`;
const GELU_PRIME = `(${G('x+0.001')} - ${G('x-0.001')})/0.002`;

export default {
  cards: [
    {
      kind: 'explain',
      title: 'Same network, different random numbers',
      body: String.raw`Before training, every weight is set to a small random number. That sounds like a detail, but for deep networks it decides whether training works at all.

The widget builds a **20-layer** network with **sigmoid** activations, feeds a batch of random inputs forward, and sends a random gradient backward. Nothing is trained yet. Blue shows how big the activations are at each layer; red shows how big the gradient is.

Look at the red curve on the left: by layer 1 the gradient has shrunk by many orders of magnitude, so the early layers would barely learn. Now press **tanh**, then **ReLU**, and try the **He** button.`,
      widget: { type: 'MlActivationDepth', props: { activation: 'sigmoid', gain: 1, depth: 20 }, caption: 'Log scale: each grid line is a factor of 100. A flat curve near 1e0 is the goal.' },
    },
    {
      kind: 'recall',
      title: 'From backpropagation',
      points: [
        String.raw`The backward recursion is $\boldsymbol\delta^{(\ell)}=\big(W^{(\ell+1)\top}\boldsymbol\delta^{(\ell+1)}\big)\odot\varphi'(\mathbf z^{(\ell)})$.`,
        String.raw`So the gradient at layer 1 contains a **product** of $L$ factors, one per layer.`,
        String.raw`A product of many factors slightly below 1 **vanishes**; slightly above 1 it **explodes**.`,
        String.raw`$\sigma'(z)\le\tfrac14$, so sigmoid layers shrink gradients unless the weights compensate.`,
      ],
      link: 'ml/backpropagation',
    },
    {
      kind: 'widget',
      title: 'How variance moves through one layer',
      body: String.raw`To keep the signal size steady we need a rule for the weight variance. We work out how the variance of a pre-activation depends on the layer below.`,
      widget: {
        type: 'StepReveal',
        props: {
          steps: [
            String.raw`One unit of layer $\ell$ computes $z=\sum_{k=1}^{n_\text{in}} w_k h_k$, where $n_\text{in}$ (the **fan-in**) is the number of inputs and $h_k$ are the activations of the layer below. Take biases $=0$.`,
            String.raw`Assume the $w_k$ are independent of each other and of the $h_k$, with mean $0$ and variance $\operatorname{Var}(w)$.`,
            String.raw`Then each term has mean 0 and variance $\operatorname{Var}(w_kh_k)=\operatorname{Var}(w)\,\mathbb E[h_k^2]$.`,
            String.raw`Variances of independent terms add: $\;\operatorname{Var}(z)=n_\text{in}\operatorname{Var}(w)\,\mathbb E[h^2]$.`,
            String.raw`Over $L$ layers the factor $n_\text{in}\operatorname{Var}(w)\cdot\big(\mathbb E[h^2]/\operatorname{Var}(z)\big)$ gets **multiplied $L$ times**. Make it exactly 1 and the scale is preserved.`,
          ],
          notes: ['', 'true at initialization', 'mean-zero weights', '', 'the backward pass gives the same rule with fan-out in place of fan-in'],
        },
      },
    },
    {
      kind: 'numeric',
      prompt: String.raw`A **linear** network ($\varphi(z)=z$) has layers of width $n=100$ and weights with $\operatorname{Var}(w)=0.02$. By what factor does the variance of the activations grow over **10** layers?`,
      answer: 1024,
      tolerance: 1,
      why: String.raw`For a linear layer $\mathbb E[h^2]=\operatorname{Var}(z)$, so each layer multiplies the variance by $n\operatorname{Var}(w)=100\times0.02=2$. Ten layers give $2^{10}=1024$. A per-layer factor of only 2 already explodes; the standard deviation grows by $\sqrt{1024}=32$.`,
    },
    {
      kind: 'explain',
      title: 'Xavier (Glorot) initialization',
      body: String.raw`**Glorot and Bengio (2010)** asked for the variance to stay constant in **both** directions. For an activation that behaves like the identity near 0 (tanh, or linear):

- forward pass: $n_\text{in}\operatorname{Var}(w)=1$,
- backward pass: $n_\text{out}\operatorname{Var}(w)=1$ ($n_\text{out}$ = **fan-out**, the number of units in the layer).

Both cannot hold unless $n_\text{in}=n_\text{out}$, so they compromise:
$$\operatorname{Var}(w)=\frac{2}{n_\text{in}+n_\text{out}},\qquad w\sim U\!\left[-\sqrt{\tfrac{6}{n_\text{in}+n_\text{out}}},\ \sqrt{\tfrac{6}{n_\text{in}+n_\text{out}}}\right].$$

The same paper showed that with the older heuristic init, sigmoid networks pushed their top hidden layer into saturation early in training, which is one reason tanh and later ReLU replaced the sigmoid in hidden layers.`,
    },
    {
      kind: 'explain',
      title: 'He (Kaiming) initialization for ReLU',
      body: String.raw`ReLU outputs 0 for every negative input. If $z$ is symmetric around 0, half of it is cut off, so
$$\mathbb E[h^2]=\mathbb E[\max(0,z)^2]=\tfrac12\operatorname{Var}(z).$$

Each ReLU layer therefore **halves** the signal's second moment. **He et al. (2015)** fix this by doubling the weight variance:
$$\operatorname{Var}(w)=\frac{2}{n_\text{in}}\qquad(\text{std}=\sqrt{2/n_\text{in}}).$$

They report that a 30-layer ReLU network trained from scratch converged with this init but stalled with Xavier init.

In the widget, "gain" $g$ means $\text{std}=g/\sqrt n$: Xavier for a square layer is $g=1$, He is $g=\sqrt2$.`,
    },
    {
      kind: 'widget',
      title: 'Experiment: find the stable settings',
      body: String.raw`Try these and watch both curves and the histograms:

1. **ReLU, Xavier**: activations and gradients shrink by about $\sqrt2$ per layer.
2. **ReLU, He**: both curves stay flat.
3. **tanh, gain 0.5**: everything collapses to 0.
4. **tanh, gain 2.5**: the histograms pile up at $\pm1$ (**saturation**), and the gradient grows towards layer 1.
5. **linear, gain 1.2**: a small excess per layer compounds into an explosion.`,
      widget: { type: 'MlActivationDepth', props: { activation: 'relu', gain: 1, depth: 30 } },
    },
    {
      kind: 'numeric',
      prompt: String.raw`Using He initialization, what is the standard deviation of the weights of a layer with fan-in $n_\text{in}=512$?`,
      answer: 0.0625,
      tolerance: 0.0005,
      why: String.raw`$\operatorname{Var}(w)=2/512=1/256$, so $\text{std}=1/16=0.0625$. A common slip is to stop at the variance ($0.0039$) or to use Xavier's $1/\sqrt{512}\approx0.044$.`,
    },
    {
      kind: 'mcq',
      prompt: String.raw`A 20-layer ReLU MLP is initialized with $\operatorname{Var}(w)=1/n_\text{in}$ (Xavier for square layers). Roughly what happens to the RMS size of the activations from layer 1 to layer 20?`,
      choices: [
        'It stays about the same, because Xavier init preserves variance.',
        String.raw`It shrinks by about $2^{-19/2}\approx10^{-3}$, because each ReLU layer halves the second moment.`,
        String.raw`It grows by about $2^{19/2}\approx700$, because ReLU is unbounded above.`,
        'It becomes exactly zero after the first layer, because ReLU kills negative inputs.',
      ],
      answer: 1,
      why: String.raw`With $n_\text{in}\operatorname{Var}(w)=1$, each layer multiplies $\mathbb E[h^2]$ by $\tfrac12$, so the RMS falls by $1/\sqrt2$ per layer: over 19 steps that is $2^{-9.5}\approx1.4\times10^{-3}$. Xavier preserves variance only for activations that act like the identity near 0. ReLU is unbounded, but halving still wins. It zeroes only the negative half of the units, not all of them.`,
    },
    {
      kind: 'explain',
      title: 'Modern activations',
      body: String.raw`- **ReLU** $\max(0,z)$: derivative exactly 1 when active, so it does not saturate for $z>0$. Its risk is **dead units**: if a unit's input is negative for every example, its gradient is 0 and it never recovers.
- **Leaky ReLU** $\max(az,z)$ with small $a$ (e.g. 0.01): keeps a small gradient for $z<0$.
- **GELU** $z\,\Phi(z)$, where $\Phi$ is the standard normal CDF (Hendrycks & Gimpel 2016). It weights the input by the probability that a standard normal falls below it. It is smooth, dips slightly below 0 (minimum $\approx-0.17$ near $z\approx-0.75$), and is the default in BERT and GPT-style transformers. A common approximation is $\tfrac12z\big(1+\tanh[\sqrt{2/\pi}(z+0.044715z^3)]\big)$.
- **SiLU / Swish** $z\,\sigma(z)$: a close relative of GELU.

The plot shows **derivatives**, which are what multiply the gradient.`,
      widget: {
        type: 'FunctionPlot',
        props: { fns: ['exp(-x)/(1+exp(-x))^2', 'x>0?1:0', 'x>0?1:0.1', GELU_PRIME], x: [-4, 4], y: [-0.3, 1.3], labels: ["sigmoid′", "ReLU′", "leaky ReLU′ (a=0.1)", "GELU′"], xLabel: 'z', yLabel: "φ′(z)" },
        caption: 'GELU′ goes slightly above 1 and slightly below 0. It is smooth, unlike the ReLU step.',
      },
    },
    {
      kind: 'match',
      prompt: 'Match each activation to its key property.',
      pairs: [
        ['sigmoid', String.raw`derivative at most $\tfrac14$; saturates at both ends`],
        ['ReLU', String.raw`derivative exactly 1 when active; units can "die"`],
        ['leaky ReLU', String.raw`small nonzero slope for $z<0$`],
        ['GELU', String.raw`smooth $z\,\Phi(z)$; standard in transformers`],
      ],
      why: String.raw`$\sigma'=\sigma(1-\sigma)$ peaks at $\tfrac14$. ReLU's derivative is a 0/1 step, so a unit stuck in the negative region gets no gradient. The leaky slope fixes exactly that. GELU smooths the ReLU corner using the Gaussian CDF.`,
    },
    {
      kind: 'widget',
      title: 'Activation choice in a real training run',
      body: String.raw`This network has **2 hidden layers** and is learning the spiral. It already uses the right init for each activation (He for ReLU, Xavier for tanh). Train with **tanh**, press **Re-init**, then switch to **ReLU** and compare how fast it learns and how the boundary looks. ReLU boundaries are made of straight pieces; tanh boundaries are smooth.`,
      widget: { type: 'NeuralNetPlayground', props: { dataset: 'spiral', hidden: 8, layers: 2, activation: 'tanh', lr: 0.3 } },
    },
    {
      kind: 'truefalse',
      prompt: 'If every weight of an MLP starts at the same constant value (e.g. all 0.1), plain gradient descent keeps all units within each hidden layer identical forever.',
      answer: true,
      why: String.raw`Units with identical incoming **and** outgoing weights compute identical outputs and receive identical gradients, so every update keeps them equal. The layer then acts like a single unit. This is **symmetry**, and random init exists partly to break it. Setting all weights to 0 is even worse: in an MLP the backward signal $W^\top\boldsymbol\delta$ is then zero too.`,
    },
    {
      kind: 'multi',
      prompt: 'Which of these directly reduce vanishing gradients in a deep MLP? (Select all that apply.)',
      choices: [
        String.raw`Choosing $\operatorname{Var}(w)=2/n_\text{in}$ for a ReLU network`,
        'Replacing sigmoid hidden activations with ReLU',
        'Initializing every weight to exactly zero',
        'Using sigmoid in every hidden layer, since its outputs are bounded',
      ],
      answers: [0, 1],
      why: String.raw`He init makes the per-layer factor exactly 1 for ReLU, and ReLU's derivative is 1 where active instead of at most $\tfrac14$. All-zero weights make the backward signal $W^\top\boldsymbol\delta$ zero, which is the opposite of a fix. Sigmoid's bounded outputs do nothing about its small derivative.`,
    },
    {
      kind: 'fill',
      prompt: String.raw`To keep activation variance constant, choose $\operatorname{Var}(w)$ so that $n_\text{in}\operatorname{Var}(w)\cdot\mathbb E[h^2]/\operatorname{Var}(z)=1$. For tanh near 0 this gives ___ init, $\operatorname{Var}(w)\approx1/n_\text{in}$. For ReLU, which halves the second moment, it gives ___ init, $\operatorname{Var}(w)=$ ___.`,
      bank: ['Xavier', 'He', String.raw`$2/n_\text{in}$`, String.raw`$1/(2n_\text{in})$`, 'zero', String.raw`$n_\text{in}/2$`],
      answer: ['Xavier', 'He', String.raw`$2/n_\text{in}$`],
      why: String.raw`tanh is roughly the identity near 0, so $\mathbb E[h^2]\approx\operatorname{Var}(z)$ and $\operatorname{Var}(w)=1/n_\text{in}$ (Glorot's version averages fan-in and fan-out). ReLU halves the second moment, so the variance must be doubled to $2/n_\text{in}$, not halved.`,
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- In a deep net, forward activations and backward gradients are products of $L$ per-layer factors. Unless each factor is about 1, they vanish or explode.
- One layer: $\operatorname{Var}(z)=n_\text{in}\operatorname{Var}(w)\,\mathbb E[h^2]$.
- **Xavier/Glorot**: $\operatorname{Var}(w)=2/(n_\text{in}+n_\text{out})$, for tanh-like activations. **He/Kaiming**: $\operatorname{Var}(w)=2/n_\text{in}$, for ReLU.
- Saturating activations (sigmoid, tanh at large inputs) have small derivatives. ReLU, leaky ReLU and GELU keep gradients flowing.
- Initialization fixes the scale only at step 0. [Normalization layers](@ml/normalization-layers) and [residual connections](@ml/residual-connections) keep it under control during training.`,
    },
  ],
  references: [
    { authors: 'X. Glorot & Y. Bengio', title: 'Understanding the difficulty of training deep feedforward neural networks', year: 2010, venue: 'AISTATS (JMLR W&CP 9)', url: 'https://proceedings.mlr.press/v9/glorot10a.html' },
    { authors: 'K. He, X. Zhang, S. Ren & J. Sun', title: 'Delving Deep into Rectifiers: Surpassing Human-Level Performance on ImageNet Classification', year: 2015, venue: 'ICCV', url: 'https://arxiv.org/abs/1502.01852' },
    { authors: 'D. Hendrycks & K. Gimpel', title: 'Gaussian Error Linear Units (GELUs)', year: 2016, venue: 'arXiv:1606.08415', url: 'https://arxiv.org/abs/1606.08415' },
    { authors: 'S. J. D. Prince', title: 'Understanding Deep Learning', year: 2023, venue: 'MIT Press', detail: 'Ch. 7 (gradients and initialization)', url: 'https://udlbook.github.io/udlbook/' },
  ],
} satisfies LessonContent;
