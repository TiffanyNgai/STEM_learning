import type { LessonContent } from '../../types';

// Dropout: each frame a different random subset of hidden units (and their edges) is switched off.
const LAYERS = [3, 5, 5, 2];
const X = [40, 125, 210, 290];
const pos = (l: number, j: number): [number, number] => [X[l], 90 + (j - (LAYERS[l] - 1) / 2) * 30];
// 4 frames; 1 = kept, 0 = dropped (about half of hidden units dropped per frame).
const MASKS: Record<string, string> = {
  '1-0': '1;0;1;1', '1-1': '0;1;1;0', '1-2': '1;1;0;1', '1-3': '1;0;0;1', '1-4': '0;1;1;0',
  '2-0': '0;1;1;0', '2-1': '1;1;0;1', '2-2': '1;0;1;0', '2-3': '0;1;0;1', '2-4': '1;0;1;1',
};
const anim = (key?: string) => (key ? `<animate attributeName="opacity" values="${MASKS[key].split(';').map((v) => (v === '1' ? '1' : '0.08')).join(';')}" keyTimes="0;0.25;0.5;0.75" dur="4s" calcMode="discrete" repeatCount="indefinite"/>` : '');
const hid = (l: number, j: number) => (l === 1 || l === 2 ? `${l}-${j}` : undefined);
let edges = '';
for (let l = 0; l < 3; l++) for (let a = 0; a < LAYERS[l]; a++) for (let b = 0; b < LAYERS[l + 1]; b++) {
  const [x1, y1] = pos(l, a), [x2, y2] = pos(l + 1, b);
  edges += `<g>${anim(hid(l, a))}<g>${anim(hid(l + 1, b))}<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="var(--muted)" stroke-width="1"/></g></g>`;
}
let nodes = '';
LAYERS.forEach((n, l) => { for (let j = 0; j < n; j++) { const [x, y] = pos(l, j); nodes += `<g>${anim(hid(l, j))}<circle cx="${x}" cy="${y}" r="9" fill="var(--surface)" stroke="${l === 1 || l === 2 ? 'var(--c2)' : 'var(--fg)'}" stroke-width="1.6"/></g>`; } });
const DROPOUT_SVG = `<svg viewBox="0 0 320 190" xmlns="http://www.w3.org/2000/svg">${edges}${nodes}
<text x="40" y="172" font-size="9" text-anchor="middle" fill="var(--muted)">input</text>
<text x="167" y="172" font-size="9" text-anchor="middle" fill="var(--c2)">hidden (dropout p = 0.5)</text>
<text x="290" y="172" font-size="9" text-anchor="middle" fill="var(--muted)">output</text>
<text x="160" y="186" font-size="9" text-anchor="middle" fill="var(--fg)">every mini-batch trains a different thinned sub-network</text>
</svg>`;

export default {
  cards: [
    {
      kind: 'explain',
      title: 'Neural nets fail silently',
      body: String.raw`A bug in ordinary code usually crashes. A bug in a training pipeline usually does not: the loss still goes down, just not as far as it should. Typical silent bugs are labels shuffled differently from inputs, augmentation that flips a label's meaning, forgetting to switch to evaluation mode, or a learning rate off by 10×.

In his widely read blog post *A Recipe for Training Neural Networks* (2019), **Andrej Karpathy** argues that the defence is a slow, paranoid, step-by-step process. You build complexity only after the simpler version verifiably works. This lesson covers that process and the main tools it relies on: dropout, augmentation, and mixed precision.`,
    },
    {
      kind: 'widget',
      title: "Karpathy's recipe",
      widget: {
        type: 'StepReveal',
        props: {
          steps: [
            '**Become one with the data.** Look at many examples by hand. Check duplicates, label noise, class balance and the range of values.',
            '**Set up the end-to-end skeleton and dumb baselines.** Fix the random seed, check the loss at initialization, and compare with an input-independent baseline (e.g. inputs set to zero).',
            '**Overfit.** First get a model large enough to drive the *training* loss very low, starting by overfitting a single small batch.',
            '**Regularize.** Then trade some training fit for validation performance: more data, augmentation, dropout, weight decay, early stopping.',
            '**Tune.** Search hyperparameters, random search rather than grid search.',
            '**Squeeze out the juice.** Ensembles, and simply training longer.',
          ],
          notes: ['', 'a bug found here is cheap', 'if you cannot overfit, something is broken', 'see the regularization lesson', '', ''],
        },
      },
    },
    {
      kind: 'order',
      prompt: "Put the stages of Karpathy's recipe in order.",
      steps: [
        'Inspect the data thoroughly',
        'Build the training/evaluation skeleton with simple baselines',
        'Get a model that overfits the training set',
        'Add regularization to improve validation performance',
        'Tune hyperparameters',
        'Squeeze out the last gains (ensembles, longer training)',
      ],
      why: 'Each stage assumes the previous one works. You cannot judge regularization until you know the model can fit the data at all, and you cannot trust any model until the pipeline and baselines are verified.',
    },
    {
      kind: 'explain',
      title: 'Cheap sanity checks',
      body: String.raw`- **Loss at initialization.** With $C$ classes and a well-initialized softmax output, the predictions are close to uniform, so the cross-entropy is about $-\ln(1/C)=\ln C$. A very different starting loss means the output layer or the loss is wrong.
- **Overfit one batch.** Train on a handful of examples. A working model reaches near-zero loss. If it cannot, there is a bug.
- **Input-independent baseline.** Set all inputs to zero. The real model must do clearly better, otherwise it is not using the input.
- **Visualize what enters the network**, right before the forward pass, after all preprocessing.
- **Start with a safe optimizer.** Karpathy suggests Adam with learning rate $3\times10^{-4}$ in early experiments.`,
    },
    {
      kind: 'numeric',
      prompt: String.raw`A 10-class classifier with softmax and cross-entropy (natural log) predicts uniform probabilities at initialization. What should the initial loss be? Give 3 decimals.`,
      answer: 2.303,
      tolerance: 0.005,
      why: String.raw`Each example gets probability $1/10$ on its true class, so the loss is $-\ln(0.1)=\ln10\approx2.303$. With base-2 logs it would be $3.32$ bits. A starting loss far above this means the initial logits are too large (overconfident).`,
    },
    {
      kind: 'widget',
      title: 'Reading loss curves',
      body: String.raw`Plot **training** and **validation** loss against epochs. The slider controls how much the model overfits.

- Both curves high and flat means **underfitting**: use a bigger model, train longer, or check for bugs.
- Training keeps falling while validation turns up means **overfitting**: regularize, add data, or stop early (at the validation minimum).
- Spikes or NaN usually mean the learning rate is too high, or there is numerical overflow.`,
      widget: {
        type: 'FunctionPlot',
        props: {
          fns: ['0.15 + 2*exp(-x/4)', '0.45 + 2*exp(-x/4) + k*0.004*max(0, x-6)^2'],
          x: [0, 30], y: [0, 2.5],
          params: [{ name: 'k', min: 0, max: 1, value: 0.6, label: 'overfitting' }],
          labels: ['training loss', 'validation loss'], xLabel: 'epoch', yLabel: 'loss',
        },
        caption: 'An illustrative shape, not real data. The best checkpoint is at the validation minimum, not the last epoch.',
      },
    },
    {
      kind: 'match',
      prompt: 'Match each symptom to its most likely cause.',
      pairs: [
        ['Loss becomes NaN after a few hundred steps', 'learning rate too high or numerical overflow'],
        [String.raw`Training loss stuck near $\ln C$ from the start`, 'the model is not learning at all: a bug, or a learning rate far too low'],
        ['Training loss low, validation loss rising', 'overfitting'],
        ['Training and validation loss both high and close together', 'underfitting'],
      ],
      why: String.raw`Divergence shows up as exploding values. A loss pinned at the chance level $\ln C$ means predictions never moved from uniform. A growing train/validation gap is the signature of overfitting. Two high, close curves mean the model cannot even fit the training data.`,
    },
    {
      kind: 'widget',
      title: 'Dropout',
      body: String.raw`**Dropout** (Srivastava et al. 2014) randomly switches off units during training. Each hidden unit is independently set to 0 with probability $p$, and a fresh random mask is drawn for every example in every step.

The network cannot rely on any one unit or on fragile **co-adaptations** between units, so it learns redundant, robust features. A second view: training is an implicit ensemble of exponentially many "thinned" sub-networks that share weights. At test time all units are used, which approximates averaging that ensemble.`,
      widget: { type: 'SvgDiagram', props: { svg: DROPOUT_SVG }, caption: 'Faded units are dropped for this mini-batch; a new random mask is drawn every step.' },
    },
    {
      kind: 'explain',
      title: 'Getting the scale right: inverted dropout',
      body: String.raw`If units are dropped with probability $p$ in training, a unit's expected input at test time (nothing dropped) would be larger by a factor $1/(1-p)$. Two equivalent fixes:

- **Original paper**: train normally, then at test time multiply the outgoing weights by the **retain** probability $1-p$. (The paper writes $p$ for the *retain* probability. Watch the convention.)
- **Inverted dropout** (what libraries do): during training, divide the kept activations by $1-p$; at test time do nothing.
$$\tilde h=\frac{m\,h}{1-p},\quad m\sim\text{Bernoulli}(1-p),\qquad\mathbb E[\tilde h]=h.$$

Dropout must be **off** at test time. Frameworks switch it automatically in evaluation mode. Typical rates: $p=0.5$ for large fully connected layers, and $0.1$ is common in transformers.`,
    },
    {
      kind: 'numeric',
      prompt: String.raw`With inverted dropout at drop probability $p=0.25$, a hidden unit that outputs $3$ and is **kept** is passed on as what value during training?`,
      answer: 4,
      tolerance: 0.001,
      why: String.raw`Kept units are divided by the keep probability $1-p=0.75$: $3/0.75=4$. Then $\mathbb E[\tilde h]=0.75\times4+0.25\times0=3$, which matches the test-time value. Multiplying by $0.75$ instead (giving $2.25$) applies the scaling the wrong way round.`,
    },
    {
      kind: 'explain',
      title: 'Data augmentation and other regularizers',
      body: String.raw`**Data augmentation** creates new training examples by transforming existing ones in ways that should not change the label: random crops, flips, small rotations, colour jitter, or noise for audio. It encodes prior knowledge about **invariances**. For images it is often the single most effective regularizer. An augmentation must actually preserve the label: flipping a "6" vertically turns it into a "9".

Other standard tools, covered in [regularization](@ml/regularization), are weight decay (L2), early stopping, and simply more data. **Gradient clipping** rescales the gradient when its norm exceeds a threshold. It guards against exploding gradients, especially in recurrent nets and large transformers.`,
    },
    {
      kind: 'explain',
      title: 'Mixed-precision training',
      body: String.raw`Modern accelerators are much faster with 16-bit numbers. **FP16** (half precision) has 5 exponent bits and 10 fraction bits. Its largest value is $65504$, its smallest normal value is $2^{-14}\approx6\times10^{-5}$, and anything below about $6\times10^{-8}$ (the smallest subnormal) rounds to **zero**. Many gradient values are that small.

**Mixed-precision training** (Micikevicius et al. 2018) has three parts:
1. Keep an FP32 **master copy** of the weights. Compute forward and backward passes in FP16.
2. **Loss scaling**: multiply the loss by a large factor $S$ (e.g. $2^{10}$) before backprop, so small gradients do not underflow. Divide the gradients by $S$ before the update. Dynamic schemes lower $S$ whenever an overflow (inf/NaN) appears.
3. Accumulate sums such as dot products in FP32.

**bfloat16** keeps FP32's 8 exponent bits (same range) with only 7 fraction bits, so it usually needs no loss scaling.`,
    },
    {
      kind: 'mcq',
      prompt: 'Why does FP16 mixed-precision training multiply the loss by a large scale factor before backpropagation?',
      choices: [
        'To make the optimizer take bigger steps.',
        'So that small gradient values are shifted into FP16’s representable range instead of underflowing to zero; they are divided back before the update.',
        'Because FP16 cannot represent numbers larger than 1.',
        'To act as a regularizer similar to dropout.',
      ],
      answer: 1,
      why: String.raw`Backprop is linear in the loss, so scaling the loss scales every gradient by $S$, lifting tiny values above FP16's underflow threshold. Unscaling before the update leaves the step size unchanged. FP16 easily represents numbers above 1 (up to 65504). Loss scaling is a numerical device, not a regularizer.`,
    },
    {
      kind: 'truefalse',
      prompt: 'In standard use, dropout stays active at test time so that predictions match the training conditions.',
      answer: false,
      why: String.raw`Standard dropout is turned off at evaluation, and the scaling (inverted dropout during training, or weight scaling at test) keeps expected activations consistent. Leaving it on makes predictions random. That is done deliberately only in special methods such as Monte Carlo dropout for uncertainty estimates.`,
    },
    {
      kind: 'multi',
      prompt: 'Which are good early sanity checks when setting up a new training pipeline? (Select all that apply.)',
      choices: [
        String.raw`Check that the loss at initialization is close to $\ln C$ for a $C$-class problem`,
        'Verify the model can drive the loss near zero on a single small batch',
        'Compare against a baseline that ignores the input',
        'Add heavy dropout and augmentation before anything else, so that overfitting never occurs',
      ],
      answers: [0, 1, 2],
      why: String.raw`The first three each catch a different class of bug cheaply. Regularizing first is backwards: until you have shown the model *can* overfit, you cannot tell whether poor results come from too much regularization or from a bug.`,
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- Training bugs are usually silent. Build up slowly: data → skeleton and baselines → overfit → regularize → tune → squeeze.
- Sanity checks: initial loss $\approx\ln C$, overfit one batch, beat an input-independent baseline, look at the actual inputs.
- Read train and validation curves together to tell underfitting, overfitting and divergence apart.
- **Dropout** zeros units with probability $p$ in training. Inverted dropout divides survivors by $1-p$, and dropout is off at test time.
- **Mixed precision**: FP16 compute, FP32 master weights, loss scaling against underflow. bfloat16 has FP32's range.`,
    },
  ],
  references: [
    { authors: 'A. Karpathy', title: 'A Recipe for Training Neural Networks', year: 2019, venue: 'Blog post', url: 'https://karpathy.github.io/2019/04/25/recipe/' },
    { authors: 'N. Srivastava, G. Hinton, A. Krizhevsky, I. Sutskever & R. Salakhutdinov', title: 'Dropout: A Simple Way to Prevent Neural Networks from Overfitting', year: 2014, venue: 'JMLR 15, 1929–1958', url: 'https://jmlr.org/papers/v15/srivastava14a.html' },
    { authors: 'P. Micikevicius et al.', title: 'Mixed Precision Training', year: 2018, venue: 'ICLR', url: 'https://arxiv.org/abs/1710.03740' },
    { authors: 'I. Goodfellow, Y. Bengio & A. Courville', title: 'Deep Learning', year: 2016, venue: 'MIT Press', detail: 'Ch. 7 (regularization), Ch. 11 (practical methodology)', url: 'https://www.deeplearningbook.org' },
  ],
} satisfies LessonContent;
