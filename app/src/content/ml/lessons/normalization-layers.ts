import type { LessonContent } from '../../types';

// Batch × feature grid: BatchNorm normalizes each column (over the batch), LayerNorm/RMSNorm each row (over features).
const R = 6, K = 8, S = 15;
const grid = (x0: number, y0: number) => {
  let out = '';
  for (let i = 0; i < R; i++) for (let j = 0; j < K; j++) {
    const v = ((i * 7 + j * 3) % 5) / 10 + 0.08;
    out += `<rect x="${x0 + j * S}" y="${y0 + i * S}" width="${S - 1}" height="${S - 1}" fill="var(--c2)" opacity="${v.toFixed(2)}"/>`;
  }
  return out;
};
const steps = (n: number, dx: number, dy: number) => Array.from({ length: n }, (_, k) => `${k * dx} ${k * dy}`).join(';');
const NORM_SVG = `<svg viewBox="0 0 320 190" xmlns="http://www.w3.org/2000/svg">
<text x="78" y="16" font-size="11" text-anchor="middle" fill="var(--fg)" font-weight="bold">BatchNorm</text>
<text x="242" y="16" font-size="11" text-anchor="middle" fill="var(--fg)" font-weight="bold">LayerNorm / RMSNorm</text>
${grid(18, 34)}${grid(182, 34)}
<rect x="17" y="33" width="${S + 1}" height="${R * S + 1}" fill="none" stroke="var(--c3)" stroke-width="2.5">
<animateTransform attributeName="transform" type="translate" values="${steps(K, S, 0)}" dur="6s" calcMode="discrete" repeatCount="indefinite"/></rect>
<rect x="181" y="33" width="${K * S + 1}" height="${S + 1}" fill="none" stroke="var(--c3)" stroke-width="2.5">
<animateTransform attributeName="transform" type="translate" values="${steps(R, 0, S)}" dur="4.5s" calcMode="discrete" repeatCount="indefinite"/></rect>
<text x="78" y="138" font-size="9" text-anchor="middle" fill="var(--muted)">features →</text>
<text x="10" y="80" font-size="9" text-anchor="middle" fill="var(--muted)" transform="rotate(-90 10 80)">examples in batch →</text>
<text x="242" y="138" font-size="9" text-anchor="middle" fill="var(--muted)">features →</text>
<text x="174" y="80" font-size="9" text-anchor="middle" fill="var(--muted)" transform="rotate(-90 174 80)">examples in batch →</text>
<text x="78" y="156" font-size="9" text-anchor="middle" fill="var(--c3)">statistics of one feature</text>
<text x="78" y="168" font-size="9" text-anchor="middle" fill="var(--c3)">across the batch</text>
<text x="242" y="156" font-size="9" text-anchor="middle" fill="var(--c3)">statistics of one example</text>
<text x="242" y="168" font-size="9" text-anchor="middle" fill="var(--c3)">across its features</text>
<text x="160" y="186" font-size="8.5" text-anchor="middle" fill="var(--muted)">orange box = the numbers that share one mean and variance</text>
</svg>`;

export default {
  cards: [
    {
      kind: 'explain',
      title: 'Initialization only fixes step 0',
      body: String.raw`[Good initialization](@ml/initialization-activations) sets each layer's signal to about unit scale **before** training. Once training starts the weights change, and the activations can drift too large or too small again.

A **normalization layer** re-standardizes the activations inside the network, at every step, for every input. Below is a 30-layer ReLU network with a bad init (Xavier gain 1), so the activations shrink towards zero. Press **LayerNorm** to standardize each layer's pre-activations. Then drag the gain: with normalization the forward signal no longer depends on it.`,
      widget: { type: 'MlActivationDepth', props: { activation: 'relu', gain: 1, depth: 30, showNorm: true }, caption: 'With LayerNorm on, every layer starts from mean 0 and variance 1, whatever the weight scale.' },
    },
    {
      kind: 'explain',
      title: 'Batch normalization',
      body: String.raw`**BatchNorm** (Ioffe & Szegedy 2015) treats each feature (unit) separately. For a mini-batch of $m$ values $x_1,\dots,x_m$ of that feature:
$$\mu_B=\frac1m\sum_i x_i,\qquad\sigma_B^2=\frac1m\sum_i(x_i-\mu_B)^2,$$
$$\hat x_i=\frac{x_i-\mu_B}{\sqrt{\sigma_B^2+\varepsilon}},\qquad y_i=\gamma\,\hat x_i+\beta.$$

- $\varepsilon$ is a tiny constant (e.g. $10^{-5}$) that avoids division by 0.
- $\gamma$ (scale) and $\beta$ (shift) are **learned**. With $\gamma=\sigma_B$ and $\beta=\mu_B$ the layer can undo the normalization, so it removes no expressive power.

The gradient flows through $\mu_B$ and $\sigma_B$ too, so backprop accounts for the normalization.`,
    },
    {
      kind: 'numeric',
      prompt: String.raw`One feature has values $2,4,6,8$ in a batch of 4. Ignoring $\varepsilon$, what is the BatchNorm output $\hat x$ for the value $8$ (before $\gamma,\beta$)? Give 3 decimals.`,
      answer: 1.342,
      tolerance: 0.005,
      why: String.raw`$\mu_B=5$. Squared deviations are $9,1,1,9$, so $\sigma_B^2=20/4=5$. Then $\hat x=(8-5)/\sqrt5\approx1.342$. BatchNorm divides by $m$, not $m-1$; using the sample variance $20/3$ would give $1.162$.`,
    },
    {
      kind: 'explain',
      title: 'Training mode vs inference mode',
      body: String.raw`At inference there may be only one example, so batch statistics are unavailable or meaningless. BatchNorm keeps **running averages** of $\mu_B$ and $\sigma^2_B$ during training and uses those fixed values at test time. The layer then becomes a fixed affine map.

The batch dependence has consequences:
- Each example's output depends on the **other examples** in its batch. This adds noise, which acts as a mild regularizer.
- With very **small batches** the statistics are noisy and BatchNorm degrades.
- Forgetting to switch to inference mode (calling model.eval() in PyTorch) is a classic bug.

In CNNs the statistics are shared across all spatial positions of a channel.`,
    },
    {
      kind: 'widget',
      title: 'Which numbers are normalized together?',
      body: String.raw`Think of a layer's activations as a table: one row per example in the batch, one column per feature. The two families differ only in the direction they normalize.`,
      widget: { type: 'SvgDiagram', props: { svg: NORM_SVG }, caption: 'BatchNorm: per column (needs a batch). LayerNorm/RMSNorm: per row (one example is enough).' },
    },
    {
      kind: 'explain',
      title: 'LayerNorm and RMSNorm',
      body: String.raw`**LayerNorm** (Ba, Kiros & Hinton 2016) uses the same formula, but takes the mean and variance over the $d$ **features of a single example**:
$$\mu=\frac1d\sum_{j=1}^d x_j,\quad\sigma^2=\frac1d\sum_j(x_j-\mu)^2,\quad y_j=\gamma_j\frac{x_j-\mu}{\sqrt{\sigma^2+\varepsilon}}+\beta_j.$$
It does not depend on the batch, so training and inference are identical. It works with batch size 1 and with sequences of varying length. That is why RNNs and **transformers** use it.

**RMSNorm** (Zhang & Sennrich 2019) drops the mean subtraction and the shift. It only rescales by the root mean square:
$$y_j=\gamma_j\frac{x_j}{\operatorname{RMS}(\mathbf x)},\qquad\operatorname{RMS}(\mathbf x)=\sqrt{\tfrac1d\textstyle\sum_j x_j^2+\varepsilon}.$$
It is slightly cheaper and in their experiments it worked about as well as LayerNorm. Many recent large language models (e.g. LLaMA) use it.`,
    },
    {
      kind: 'numeric',
      prompt: String.raw`Apply RMSNorm (with $\gamma=1$, $\varepsilon=0$) to the vector $\mathbf x=(3,4)$. What is the first output component? Give 3 decimals.`,
      answer: 0.849,
      tolerance: 0.003,
      why: String.raw`$\operatorname{RMS}=\sqrt{(9+16)/2}=\sqrt{12.5}\approx3.536$, so $y_1=3/3.536\approx0.849$. Dividing by the Euclidean norm $5$ (giving $0.6$) is a common slip: RMS averages the squares, it does not just sum them.`,
    },
    {
      kind: 'match',
      prompt: 'Match each normalization layer to what it computes its statistics over.',
      pairs: [
        ['BatchNorm', 'one feature, across the examples in the mini-batch'],
        ['LayerNorm', 'all features of one example (mean and variance)'],
        ['RMSNorm', 'all features of one example (root mean square only, no centering)'],
        ['GroupNorm', 'groups of channels within one example'],
      ],
      why: String.raw`Only BatchNorm mixes information across examples, which is why its behaviour differs between training and inference. LayerNorm and RMSNorm differ only in whether they subtract the mean. GroupNorm sits between LayerNorm and per-channel normalization and is used in CNNs with small batches.`,
    },
    {
      kind: 'explain',
      title: 'Why does it help? The story changed',
      body: String.raw`Ioffe & Szegedy motivated BatchNorm by **internal covariate shift**: as earlier layers update, the input distribution of later layers keeps changing, and normalizing should stabilize it. BatchNorm clearly works. It allows much higher learning rates and made very deep CNNs easy to train. **Whether this explanation is right has been questioned.**

**Santurkar et al. (2018)** added random noise *after* the BatchNorm layers, deliberately re-creating distribution shift. Those networks still trained about as well as standard BatchNorm networks. They also found BatchNorm does not necessarily reduce a measure of internal covariate shift. Their proposed explanation is that BatchNorm makes the **loss landscape smoother**: the loss and its gradients change more slowly (are more Lipschitz), so larger, more reliable steps are possible.

Another precise fact: the output of a normalized layer is **invariant to rescaling** its incoming weights. A layer cannot blow up the signal just because its weights grew.`,
    },
    {
      kind: 'truefalse',
      prompt: 'Santurkar et al. (2018) confirmed that BatchNorm works mainly by reducing internal covariate shift.',
      answer: false,
      why: String.raw`They found the opposite. Networks with noise injected after BatchNorm (deliberately adding distribution shift) still trained well. They argued that BatchNorm's main effect is a smoother optimization landscape. The internal-covariate-shift story is the *original* motivation, not an established mechanism.`,
    },
    {
      kind: 'mcq',
      prompt: 'Why do transformers use LayerNorm (or RMSNorm) rather than BatchNorm?',
      choices: [
        'LayerNorm has more learnable parameters, so it is more expressive.',
        'LayerNorm normalizes each token on its own, so it does not depend on batch size or sequence padding, and it behaves the same at training and inference.',
        'BatchNorm cannot be differentiated, so backprop fails through it.',
        'LayerNorm removes the need for residual connections.',
      ],
      answer: 1,
      why: String.raw`Per-example statistics avoid noisy batch estimates (language-model batches mix sequences of different lengths, and inference often has batch size 1) and remove the train/test discrepancy. Both layers have the same per-feature $\gamma,\beta$. BatchNorm is perfectly differentiable. Transformers use residual connections *and* normalization.`,
    },
    {
      kind: 'multi',
      prompt: 'Which statements about BatchNorm are true? (Select all that apply.)',
      choices: [
        'At inference it normally uses running averages of the mean and variance collected during training.',
        String.raw`The learned $\gamma$ and $\beta$ let the layer represent the identity map if that is optimal.`,
        "During training, one example's output depends on the other examples in its mini-batch.",
        'It works equally well at any batch size, including 1.',
      ],
      answers: [0, 1, 2],
      why: String.raw`Running averages replace batch statistics at test time. Setting $\gamma=\sqrt{\sigma^2_B+\varepsilon}$ and $\beta=\mu_B$ undoes the normalization. Batch statistics couple the examples. In a fully connected layer with batch size 1, the variance over the batch is 0 and every normalized value is 0. More generally, small batches give noisy statistics, so BatchNorm needs reasonably large batches.`,
    },
    {
      kind: 'order',
      prompt: 'Order the BatchNorm forward computation for one feature in training mode.',
      steps: [
        String.raw`Compute the batch mean $\mu_B$`,
        String.raw`Compute the batch variance $\sigma_B^2$ around that mean`,
        String.raw`Standardize: $\hat x_i=(x_i-\mu_B)/\sqrt{\sigma_B^2+\varepsilon}$`,
        String.raw`Scale and shift: $y_i=\gamma\hat x_i+\beta$`,
        'Update the running mean and variance for later use at inference',
      ],
      why: String.raw`The variance needs the mean, standardization needs both, and the learned affine map acts on the standardized values. The running statistics are a side record and do not affect the current training output.`,
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- Normalization layers standardize activations inside the network, at every step, then apply a learned scale $\gamma$ and shift $\beta$.
- **BatchNorm**: per feature, over the mini-batch. It needs running averages at inference and is sensitive to small batches.
- **LayerNorm**: per example, over features. **RMSNorm**: the same without centering. Both are batch-independent and standard in transformers.
- BatchNorm's original "internal covariate shift" explanation is disputed. Evidence (Santurkar et al. 2018) points to a smoother loss landscape and scale invariance, which allow larger learning rates.
- Next: [residual connections](@ml/residual-connections), the other ingredient that makes 100+ layer networks trainable.`,
    },
  ],
  references: [
    { authors: 'S. Ioffe & C. Szegedy', title: 'Batch Normalization: Accelerating Deep Network Training by Reducing Internal Covariate Shift', year: 2015, venue: 'ICML', url: 'https://arxiv.org/abs/1502.03167' },
    { authors: 'J. L. Ba, J. R. Kiros & G. E. Hinton', title: 'Layer Normalization', year: 2016, venue: 'arXiv:1607.06450', url: 'https://arxiv.org/abs/1607.06450' },
    { authors: 'S. Santurkar, D. Tsipras, A. Ilyas & A. Madry', title: 'How Does Batch Normalization Help Optimization?', year: 2018, venue: 'NeurIPS', url: 'https://arxiv.org/abs/1805.11604' },
    { authors: 'B. Zhang & R. Sennrich', title: 'Root Mean Square Layer Normalization', year: 2019, venue: 'NeurIPS', url: 'https://arxiv.org/abs/1910.07467' },
    { authors: 'S. J. D. Prince', title: 'Understanding Deep Learning', year: 2023, venue: 'MIT Press', detail: 'Ch. 11 (residual networks and batch normalization)', url: 'https://udlbook.github.io/udlbook/' },
  ],
} satisfies LessonContent;
