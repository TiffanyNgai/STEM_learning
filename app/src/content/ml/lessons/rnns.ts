import type { LessonContent } from '../../types';

// Unrolled RNN: the same cell (same W) applied at every time step. Blue dot = forward state, red dot = BPTT gradient.
const cell = (x: number, t: string) =>
  `<rect x="${x - 22}" y="72" width="44" height="30" rx="6" fill="var(--surface)" stroke="var(--fg)" stroke-width="1.2"/><text x="${x}" y="91" font-size="11" text-anchor="middle" fill="var(--fg)">${t}</text>`;
const arr = (x1: number, y1: number, x2: number, y2: number) =>
  `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="var(--muted)" stroke-width="1.2" marker-end="url(#rnA)"/>`;
const io = (x: number) =>
  `${arr(x, 140, x, 104)}<text x="${x}" y="152" font-size="10" text-anchor="middle" fill="var(--c2)">x${'₁₂₃₄'[(x - 70) / 70]}</text>${arr(x, 70, x, 38)}<text x="${x}" y="30" font-size="10" text-anchor="middle" fill="var(--c1)">ŷ${'₁₂₃₄'[(x - 70) / 70]}</text>`;
const UNROLL_SVG = `<svg viewBox="0 0 320 190" xmlns="http://www.w3.org/2000/svg">
<defs><marker id="rnA" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0L10,5L0,10z" fill="var(--muted)"/></marker></defs>
<text x="16" y="91" font-size="10" text-anchor="middle" fill="var(--fg)">h₀</text>
${arr(24, 87, 46, 87)}${cell(70, 'RNN')}${arr(94, 87, 116, 87)}${cell(140, 'RNN')}${arr(164, 87, 186, 87)}${cell(210, 'RNN')}${arr(234, 87, 256, 87)}${cell(280, 'RNN')}
${io(70)}${io(140)}${io(210)}${io(280)}
<text x="105" y="81" font-size="8" text-anchor="middle" fill="var(--muted)">h₁</text><text x="175" y="81" font-size="8" text-anchor="middle" fill="var(--muted)">h₂</text><text x="245" y="81" font-size="8" text-anchor="middle" fill="var(--muted)">h₃</text>
<circle r="4" fill="var(--c2)"><animateMotion path="M16,87 L300,87" dur="4s" repeatCount="indefinite"/></circle>
<circle r="4" fill="var(--c5)"><animateMotion path="M300,95 L16,95" dur="4s" begin="2s" repeatCount="indefinite"/><animate attributeName="opacity" values="1;0.7;0.3;0.1" dur="4s" begin="2s" repeatCount="indefinite"/></circle>
<text x="160" y="172" font-size="9" text-anchor="middle" fill="var(--fg)">every box is the SAME cell with the SAME weights</text>
<text x="160" y="185" font-size="8.5" text-anchor="middle" fill="var(--muted)">blue: state flows forward · red: gradient flows back (and fades)</text>
</svg>`;

export default {
  cards: [
    {
      kind: 'explain',
      title: 'Data that comes in order',
      body: String.raw`Text, speech, stock prices and DNA are **sequences**: the order matters and the length varies. "Dog bites man" and "man bites dog" use the same words but mean different things.

A plain [neural network](@ml/neural-networks-intro) takes a fixed-size input. We could pad every sentence to 100 words and feed it in, but then the network learns "word 7" and "word 8" with separate weights. It could not reuse what it learned about a phrase at one position elsewhere.

A **recurrent neural network** (RNN) reads the sequence one element at a time and carries a running summary, the **hidden state**, from step to step. Elman (1990) used this to discover word classes and sentence structure from raw sequences.`,
    },
    {
      kind: 'widget',
      title: 'One cell, unrolled in time',
      body: String.raw`At each step $t$ the RNN combines the new input $\mathbf x_t$ with the previous state $\mathbf h_{t-1}$:
$$\mathbf h_t=\tanh\!\big(W_{hh}\mathbf h_{t-1}+W_{xh}\mathbf x_t+\mathbf b\big),\qquad \hat{\mathbf y}_t=W_{hy}\mathbf h_t+\mathbf c.$$
$W_{hh}$ (state → state), $W_{xh}$ (input → state) and $W_{hy}$ (state → output) are learned. Usually $\mathbf h_0=\mathbf 0$. Drawing one copy of the cell per time step is called **unrolling**: it turns the loop into an ordinary deep network, as deep as the sequence is long.`,
      widget: { type: 'SvgDiagram', props: { svg: UNROLL_SVG }, caption: 'Weight sharing across time is what lets one RNN handle sequences of any length.' },
    },
    {
      kind: 'mcq',
      prompt: 'You train an RNN on sentences of 10 words, then run it on a sentence of 40 words. What happens to the number of parameters?',
      choices: [
        'It stays the same: every time step reuses the same weight matrices.',
        'It grows 4×, because there are 4× as many time steps.',
        'It must be retrained, because the input size changed.',
        'It grows by one hidden state per extra word.',
      ],
      answer: 0,
      why: String.raw`The same $W_{hh}$, $W_{xh}$, $W_{hy}$ are applied at every step, so the parameter count does not depend on length. The hidden **states** $\mathbf h_t$ are activations, not parameters: there are more of them for longer inputs, but nothing new is learned.`,
    },
    {
      kind: 'numeric',
      prompt: String.raw`A scalar RNN has $h_t=\tanh(w\,h_{t-1}+u\,x_t)$ with $w=0.5$, $u=1$, $h_0=0$. The inputs are $x_1=1$, $x_2=0$. Compute $h_2$ to 3 decimals.`,
      answer: 0.363,
      tolerance: 0.002,
      why: String.raw`$h_1=\tanh(0+1)=0.762$. Then $h_2=\tanh(0.5\times0.762+0)=\tanh(0.381)=0.363$. The input at step 1 is still "remembered" at step 2, but it has shrunk: the state is a fading memory.`,
    },
    {
      kind: 'explain',
      title: 'Shapes of sequence tasks',
      body: String.raw`The same cell can be wired for different tasks:

- **Many-to-one**: read the whole sequence and use only $\mathbf h_T$, e.g. the sentiment of a review.
- **Many-to-many (aligned)**: one output per input, e.g. a part-of-speech tag for every word, or predicting the **next** character at every step (a language model).
- **Sequence-to-sequence**: an *encoder* RNN reads the input into a state, and a *decoder* RNN generates an output of a different length, e.g. translation.

For a language model the output $\hat{\mathbf y}_t$ goes through a [softmax](@ml/softmax-classification) over the vocabulary, and the loss is the sum of cross-entropies over all steps, $L=\sum_t L_t$.`,
    },
    {
      kind: 'match',
      prompt: 'Match each task to the RNN wiring that fits it.',
      pairs: [
        ['Classify a movie review as positive or negative', 'Many-to-one: use only the last hidden state'],
        ['Tag every word with its part of speech', 'Many-to-many: one output per input step'],
        ['Translate English to French', 'Sequence-to-sequence: encoder then decoder'],
        ['Predict the next character at every position', 'Many-to-many with the target shifted by one step'],
      ],
      why: 'Sentiment needs one label for the whole sequence. Tagging needs one label per word, aligned. Translation has different input and output lengths, hence encoder–decoder. Language modelling is aligned, with the target at step t being the input at step t+1.',
    },
    {
      kind: 'explain',
      title: 'Backpropagation through time',
      body: String.raw`To train, unroll the network over the whole sequence and run ordinary [backpropagation](@ml/backpropagation) on the unrolled graph. This is **backpropagation through time** (BPTT).

Two features are specific to RNNs:

1. **Shared weights collect gradients from every step.** $W_{hh}$ is used $T$ times, so (fan-out rule) its gradient is a **sum** over time: $\dfrac{\partial L}{\partial W_{hh}}=\sum_{t}\dfrac{\partial L}{\partial \mathbf a_t}\,\mathbf h_{t-1}^\top$, where $\mathbf a_t$ is the pre-activation at step $t$.
2. **Memory grows with $T$.** All states must be stored. For long streams one uses **truncated BPTT**: backpropagate only $k$ steps (say 50) into the past, carrying the state forward but cutting the gradient.`,
    },
    {
      kind: 'widget',
      title: 'Where the trouble comes from',
      widget: {
        type: 'StepReveal',
        props: {
          steps: [
            String.raw`Write $\mathbf a_t=W_{hh}\mathbf h_{t-1}+W_{xh}\mathbf x_t+\mathbf b$ and $\mathbf h_t=\tanh(\mathbf a_t)$.`,
            String.raw`One step back: $\dfrac{\partial\mathbf h_t}{\partial\mathbf h_{t-1}}=D_t\,W_{hh}$, with $D_t=\operatorname{diag}\big(\tanh'(\mathbf a_t)\big)$, entries in $(0,1]$.`,
            String.raw`Many steps back, by the chain rule: $\dfrac{\partial\mathbf h_T}{\partial\mathbf h_t}=\prod_{k=t+1}^{T}D_k\,W_{hh}$, a product of $T-t$ matrices.`,
            String.raw`Take norms: $\Big\|\dfrac{\partial\mathbf h_T}{\partial\mathbf h_t}\Big\|\le\big(\|W_{hh}\|\big)^{T-t}$, because each $\|D_k\|\le1$.`,
            String.raw`If the largest singular value of $W_{hh}$ is below 1, this bound shrinks **exponentially** in the distance $T-t$: the gradient vanishes. If $W_{hh}$ is large, the product can instead grow exponentially: it explodes.`,
          ],
          notes: ['', 'Jacobian of one step', 'the same W at every step', 'submultiplicativity of norms', 'Bengio et al. 1994; Pascanu et al. 2013'],
        },
      },
    },
    {
      kind: 'widget',
      title: 'Watch the gradient fade',
      body: String.raw`A 32-unit RNN with random $W_{hh}$ scaled by $\rho$ (roughly its largest eigenvalue size). The red curve is the size of $\partial L/\partial\mathbf h_{T-k}$ for a loss at the last step, against how far back $k$ we go. The dashed line is $\rho^k$.

1. With **tanh** and $\rho=0.9$, the gradient from 50 steps back is around $10^{-9}$ of its starting size.
2. Switch to **linear** and push $\rho$ above 1 (say 1.2): now the gradient **explodes**.
3. Back on **tanh**, try $\rho=1.3$: the gradient still shrinks, because saturated units have $\tanh'\approx0$. The dashed $\rho^k$ is only a rough guide.`,
      widget: { type: 'MlRnnGradNorm', props: { rho: 0.9, steps: 50, activation: 'tanh' } },
    },
    {
      kind: 'numeric',
      prompt: String.raw`In a **linear** scalar RNN $h_t=0.9\,h_{t-1}+x_t$, by what factor is $\partial h_{50}/\partial h_0$ smaller than 1? Give $0.9^{50}$ to 2 significant figures.`,
      answer: 0.0052,
      tolerance: 0.0002,
      why: String.raw`Each step multiplies by $\partial h_t/\partial h_{t-1}=0.9$, so after 50 steps the factor is $0.9^{50}\approx0.0052$. A modest-looking 10% shrink per step becomes a 200-fold loss over 50 steps. This is why vanilla RNNs struggle to learn dependencies more than a few tens of steps long.`,
    },
    {
      kind: 'explain',
      title: 'Exploding is easy to fix; vanishing is not',
      body: String.raw`**Exploding gradients** show up as sudden loss spikes or NaNs. The standard fix is **gradient clipping** (Pascanu et al. 2013): if $\|\mathbf g\|>c$, rescale $\mathbf g\leftarrow c\,\mathbf g/\|\mathbf g\|$. The direction is kept and only the step size is capped.

**Vanishing gradients** are worse because nothing visibly breaks. The network simply never learns that an event 100 steps ago matters. Bengio, Simard & Frasconi (1994) showed this is fundamental: to store information robustly over time, a simple RNN's dynamics must be contracting, which is exactly what makes long-range gradients vanish.

The fix that worked was a change of architecture: **gated** cells with an additive memory path, the [LSTM and GRU](@ml/lstm-gru).`,
    },
    {
      kind: 'truefalse',
      prompt: 'Gradient clipping solves the vanishing-gradient problem in RNNs.',
      answer: false,
      why: String.raw`Clipping only **shrinks** gradients whose norm exceeds a threshold, so it tames explosions. A vanishing gradient is already tiny; clipping leaves it untouched. Vanishing needs an architectural change such as LSTM/GRU gating.`,
    },
    {
      kind: 'fill',
      prompt: String.raw`In BPTT the gradient for the shared matrix $W_{hh}$ is a ___ of contributions from every time step. Going back $k$ steps multiplies the gradient by $k$ Jacobians $D\,W_{hh}$, so it can vanish or explode ___ in $k$. To save memory, ___ BPTT backpropagates only a fixed number of steps.`,
      bank: ['sum', 'product', 'exponentially', 'linearly', 'truncated', 'clipped', 'reversed'],
      answer: ['sum', 'exponentially', 'truncated'],
      why: String.raw`A weight used at many steps receives the **sum** of the gradients from each use. Repeated multiplication by similar matrices gives a factor like $\rho^k$, which is exponential in $k$. Truncated BPTT cuts the backward pass after a window; clipping is a different trick that caps the gradient norm.`,
    },
    {
      kind: 'order',
      prompt: 'Order the steps of one training update of an RNN language model with BPTT.',
      steps: [
        String.raw`Set $\mathbf h_0$ and run the cell forward over the sequence, storing every $\mathbf h_t$`,
        String.raw`At each step, compare the softmax output with the next token and sum the losses $L=\sum_t L_t$`,
        'Backpropagate from the last step to the first, through the hidden-state chain',
        String.raw`Add up the gradient contributions to $W_{hh}$, $W_{xh}$, $W_{hy}$ from all steps`,
        'Clip the gradient norm if it exceeds the threshold, then take the optimizer step',
      ],
      why: 'The forward pass must finish (storing states) before the backward pass can run in reverse time order. Shared weights collect a sum over time steps. Clipping acts on the finished gradient, just before the update.',
    },
    {
      kind: 'multi',
      prompt: 'Which statements about vanilla RNNs are true? (Select all that apply.)',
      choices: [
        'The hidden state is a fixed-size summary of everything read so far.',
        'Unrolled over T steps, an RNN is a T-layer-deep network with tied weights.',
        'The steps of the forward pass can all be computed in parallel.',
        String.raw`If the largest singular value of $W_{hh}$ is below 1 and the activation is tanh, gradients from far-back steps shrink exponentially.`,
      ],
      answers: [0, 1, 3],
      why: String.raw`The state $\mathbf h_t$ has the same size whatever the length, and unrolling gives a deep net with shared weights. The bound $\|W_{hh}\|^{T-t}$ forces vanishing in that case. But step $t$ needs $\mathbf h_{t-1}$, so the forward pass is **sequential**: this is the bottleneck that [transformers](@ml/attention-transformers) remove.`,
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- An RNN applies one cell repeatedly: $\mathbf h_t=\tanh(W_{hh}\mathbf h_{t-1}+W_{xh}\mathbf x_t+\mathbf b)$. Weights are shared across time, so any length works.
- Training = backprop on the unrolled graph (BPTT). Shared weights sum their gradients over time; truncated BPTT limits memory.
- $\partial\mathbf h_T/\partial\mathbf h_t$ is a product of $T-t$ Jacobians, so gradients vanish or explode exponentially with distance.
- Clipping fixes explosions. Vanishing needs gated architectures (LSTM/GRU).
- RNNs process tokens one after another, which limits parallel training on modern hardware.`,
    },
  ],
  references: [
    { authors: 'J. L. Elman', title: 'Finding Structure in Time', year: 1990, venue: 'Cognitive Science 14(2), 179–211' },
    { authors: 'Y. Bengio, P. Simard & P. Frasconi', title: 'Learning Long-Term Dependencies with Gradient Descent is Difficult', year: 1994, venue: 'IEEE Transactions on Neural Networks 5(2), 157–166' },
    { authors: 'R. Pascanu, T. Mikolov & Y. Bengio', title: 'On the Difficulty of Training Recurrent Neural Networks', year: 2013, venue: 'ICML', url: 'https://arxiv.org/abs/1211.5063' },
    { authors: 'I. Goodfellow, Y. Bengio & A. Courville', title: 'Deep Learning', year: 2016, venue: 'MIT Press', detail: 'Ch. 10 (sequence modeling: recurrent and recursive nets)', url: 'https://www.deeplearningbook.org' },
  ],
} satisfies LessonContent;
