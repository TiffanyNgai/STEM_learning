import type { LessonContent } from '../../types';

// ALiBi: a per-head linear penalty −m(i−j) added to the scores of a causal attention matrix.
const N = 7;
const ALIBI_SVG = (() => {
  const cell = 17, x0 = 54, y0 = 30;
  let g = '';
  for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) {
    if (j > i) { g += `<rect x="${x0 + j * cell}" y="${y0 + i * cell}" width="${cell - 1}" height="${cell - 1}" fill="var(--grid)" opacity="0.4"/>`; continue; }
    const b = -(i - j);
    g += `<rect x="${x0 + j * cell}" y="${y0 + i * cell}" width="${cell - 1}" height="${cell - 1}" fill="var(--c5)" opacity="${(0.07 + 0.13 * (i - j)).toFixed(2)}"/>` +
      `<text x="${x0 + j * cell + (cell - 1) / 2}" y="${y0 + i * cell + 12}" font-size="8" text-anchor="middle" fill="var(--fg)">${b}</text>`;
  }
  return `<svg viewBox="0 0 320 190" xmlns="http://www.w3.org/2000/svg">
<text x="8" y="14" font-size="9.5" fill="var(--fg)" font-weight="bold">ALiBi bias added to the scores: −m·(i − j)</text>
<text x="8" y="26" font-size="8" fill="var(--muted)">(shown for m = 1; grey = masked future)</text>
${g}
<text x="${x0 - 4}" y="${y0 + 12}" font-size="8" text-anchor="end" fill="var(--muted)">i = 0</text>
<text x="${x0 - 4}" y="${y0 + (N - 1) * cell + 12}" font-size="8" text-anchor="end" fill="var(--muted)">i = ${N - 1}</text>
<text x="${x0}" y="${y0 + N * cell + 11}" font-size="8" fill="var(--muted)">key j = 0 … ${N - 1} →</text>
<text x="${x0 + N * cell + 8}" y="${y0 + 44}" font-size="8.5" fill="var(--fg)">the further back</text>
<text x="${x0 + N * cell + 8}" y="${y0 + 56}" font-size="8.5" fill="var(--fg)">the key, the bigger</text>
<text x="${x0 + N * cell + 8}" y="${y0 + 68}" font-size="8.5" fill="var(--fg)">the penalty</text>
<text x="8" y="178" font-size="8.5" fill="var(--muted)">head slopes m: 1/2, 1/4, 1/8, … — some heads look far, others stay local</text>
</svg>`;
})();

export default {
  cards: [
    {
      kind: 'recall',
      title: 'Attention has no sense of order',
      points: [
        String.raw`Self-attention computes $\operatorname{softmax}(QK^\top/\sqrt{d_k})V$ with the same weights at every position.`,
        'It is **permutation-equivariant**: shuffle the tokens and the outputs are shuffled the same way.',
        String.raw`So "the cat sat" and "sat cat the" are indistinguishable to the layer itself.`,
        'Order must therefore be injected into the vectors or into the attention scores.',
      ],
      link: 'ml/attention-transformers',
    },
    {
      kind: 'explain',
      title: 'Four ways to tell a transformer where it is',
      body: String.raw`All the schemes in use fall into a few families:

- **Learned absolute**: keep a lookup table $\mathbf p_1,\dots,\mathbf p_{L}$ and add $\mathbf p_i$ to the token embedding. Simple, used by BERT and GPT-2. It cannot handle a position beyond $L$, because no vector was ever learned for it.
- **Sinusoidal absolute**: the fixed formula of Vaswani et al. (2017) — no parameters, defined for every integer.
- **Relative**: bias the attention score by a function of the offset $i-j$ (Shaw et al. 2018; the T5 bucket scheme; **ALiBi**).
- **Rotary (RoPE)**: rotate the query and key vectors by an angle proportional to their position, so the score depends only on the offset.

Notice the shift of target. Absolute schemes modify the **embeddings**; relative and rotary schemes act on the **attention scores**, which is where position actually matters.`,
    },
    {
      kind: 'explain',
      title: 'Sinusoidal encodings',
      body: String.raw`For position $p$ and dimension pair $i$, define a frequency $\omega_i=10000^{-2i/d}$ and set
$$PE(p,2i)=\sin(p\,\omega_i),\qquad PE(p,2i+1)=\cos(p\,\omega_i),$$
then **add** $PE(p,\cdot)$ to the token embedding at position $p$. Each pair of dimensions is a clock hand; the pairs run from fast ($\omega_0=1$, wavelength $2\pi$) to very slow ($\omega\to10^{-4}$, wavelength $2\pi\times10^4\approx62{,}800$). Reading all the hands at once identifies the position, in the same way that reading seconds, minutes and hours identifies a time.

Two properties make this a good choice. First, it is defined for every $p$, so nothing structurally breaks on a longer input. Second, shifting by a fixed $k$ is a **rotation** of each pair by $k\omega_i$ — a *linear* map that does not depend on $p$:
$$\begin{pmatrix}\sin((p+k)\omega_i)\\\cos((p+k)\omega_i)\end{pmatrix}=\begin{pmatrix}\cos k\omega_i&\sin k\omega_i\\-\sin k\omega_i&\cos k\omega_i\end{pmatrix}\begin{pmatrix}\sin(p\omega_i)\\\cos(p\omega_i)\end{pmatrix}.$$
A linear layer can therefore learn to attend "three tokens back" with a single weight matrix. The paper found learned embeddings worked about equally well, and chose sinusoids in the hope of extrapolating to longer sequences.`,
    },
    {
      kind: 'widget',
      title: 'The sinusoid heatmap',
      body: String.raw`Rows are dimensions (fast clocks on top, slow ones at the bottom), columns are positions. Blue is positive, red negative.

- Top rows flicker; bottom rows barely change across the whole window. Together the column is a unique fingerprint for each position.
- Drag **position p** and **offset k**: the black box is $p$, the orange box is $p+k$.
- The curve below plots $PE(p)\cdot PE(p+k)/(d/2)=\frac{2}{d}\sum_i\cos(k\omega_i)$. It is highest at $k=0$ and decays with $|k|$, and it is **the same for every $p$** — a built-in notion of "nearby".`,
      widget: { type: 'MlPositionalEncoding', props: { mode: 'sinusoidal', dModel: 32, positions: 48 } },
    },
    {
      kind: 'numeric',
      prompt: String.raw`With $d=512$ and $\omega_i=10000^{-2i/d}$, consider the dimension pair $i=128$. Its frequency is $\omega=10^{-2}$. What is the wavelength $2\pi/\omega$ in positions? Round to the nearest integer.`,
      answer: 628,
      tolerance: 1,
      why: String.raw`$-2i/d=-256/512=-0.5$, so $\omega=10000^{-0.5}=1/100$. The wavelength is $2\pi/0.01\approx628$ positions. Pairs near $i=0$ repeat every $2\pi\approx6$ positions (good for local detail), the slowest pairs every ~62,800 (good for coarse location).`,
    },
    {
      kind: 'mcq',
      prompt: 'Why does the sinusoidal scheme use a whole geometric range of frequencies rather than one?',
      choices: [
        'A single frequency repeats, so distant positions would get identical encodings; a spread of wavelengths resolves both fine and coarse position, like the hands of a clock.',
        'Multiple frequencies make the encoding orthogonal to the token embeddings.',
        'High frequencies are needed to keep the encoding norm equal to 1.',
        'Because the softmax requires inputs of several different scales.',
      ],
      answer: 0,
      why: String.raw`With one frequency $\omega$, positions $p$ and $p+2\pi/\omega$ are encoded identically — the code is ambiguous. The geometric spread from $2\pi$ to $2\pi\times10^4$ makes the combined pattern unique over any realistic length. The frequency spread has nothing to do with being orthogonal to the token embeddings — the encoding is simply **added** to them — and its norm is $\sqrt{d/2}$ whatever the frequencies, not 1.`,
    },
    {
      kind: 'explain',
      title: 'Rotary position embeddings (RoPE)',
      body: String.raw`Su et al. (2021/2024) asked for an encoding where the attention score depends *only* on the relative offset, with no extra terms to learn. Split $\mathbf q$ and $\mathbf k$ into $d/2$ two-dimensional pairs and **rotate** pair $i$ by an angle proportional to the position, using the same frequencies $\theta_i=10000^{-2i/d}$:
$$\tilde{\mathbf q}_m=R_{m\Theta}\,\mathbf q,\qquad \tilde{\mathbf k}_n=R_{n\Theta}\,\mathbf k,$$
where $R$ applies the planar rotation by $m\theta_i$ to pair $i$. Because rotations compose and preserve inner products,
$$\langle R_{m\Theta}\mathbf q,\;R_{n\Theta}\mathbf k\rangle=\langle \mathbf q,\;R_{(n-m)\Theta}\mathbf k\rangle.$$
The score depends on $n-m$ **exactly**, never on the absolute positions. Other features: it is applied to $\mathbf q$ and $\mathbf k$ inside each attention head (not added to the embeddings, and never to $\mathbf v$), it adds **no parameters**, and it preserves vector norms. Scores also decay on average as the offset grows, which matches the intuition that nearby tokens matter more.

RoPE is the default in LLaMA, PaLM, GPT-NeoX, Qwen and most recent open models.`,
    },
    {
      kind: 'widget',
      title: 'RoPE: only the angle between them matters',
      body: String.raw`Three dimension pairs are shown as clocks. Blue is the query at position $m$, orange the key at position $n$; each hand turns at its pair's own rate $\theta_i$ — the first clock spins fast, the last barely moves.

1. Move **m** and **n** separately: the score changes with $n-m$.
2. Press **shift both +5** (or **Play**): both hands advance together, every clock keeps its *relative* angle, and the score does not change at all.
3. The curve at the bottom is the score as a function of $n-m$ alone.`,
      widget: { type: 'MlPositionalEncoding', props: { mode: 'rope', dModel: 32 } },
    },
    {
      kind: 'truefalse',
      prompt: 'With RoPE, moving a query and the key it attends to by the same number of positions leaves their attention score unchanged.',
      answer: true,
      why: String.raw`$\langle R_{m\Theta}\mathbf q,R_{n\Theta}\mathbf k\rangle=\langle\mathbf q,R_{(n-m)\Theta}\mathbf k\rangle$ depends only on $n-m$, so shifting both by $s$ leaves it fixed. This is **exact**, not approximate — it follows from $R_a^\top R_b=R_{b-a}$ and is the whole point of the construction.`,
    },
    {
      kind: 'match',
      prompt: 'Match each scheme to where it acts.',
      pairs: [
        ['Learned absolute embeddings', 'A table of vectors added to the token embeddings at the input'],
        ['Sinusoidal encodings', 'Fixed sin/cos vectors added to the token embeddings at the input'],
        ['RoPE', 'Rotates the query and key vectors inside every attention head'],
        ['ALiBi', 'Adds a fixed penalty to the attention scores, before the softmax'],
      ],
      why: String.raw`The two absolute schemes modify the input vectors and differ only in learned versus fixed. RoPE modifies $\mathbf q$ and $\mathbf k$ (leaving $\mathbf v$ alone) at every layer. ALiBi touches neither the embeddings nor the vectors: it is a bias on the score matrix.`,
    },
    {
      kind: 'explain',
      title: 'ALiBi: a linear penalty on distance',
      body: String.raw`Press, Smith & Lewis (2022) took the simplest option. Add **no** positional information to the embeddings at all; instead subtract a penalty proportional to the distance from each attention score before the softmax:
$$\text{score}_{ij}=\frac{\mathbf q_i\cdot\mathbf k_j}{\sqrt{d_k}}-m\,(i-j),$$
with a fixed, **head-specific** slope $m$ — a geometric sequence, e.g. $1/2,1/4,\dots,1/256$ for 8 heads. Small-slope heads can still see far; large-slope heads are forced to be local. Nothing is learned.

Their point was **length extrapolation**. A sinusoidal or learned model trained on 1024 tokens degrades badly when evaluated on longer inputs; ALiBi keeps its perplexity because a linear recency penalty means the same thing at any length. The paper's title says it: *train short, test long*.

RoPE also extrapolates poorly on its own, which is why "context extension" techniques exist: **position interpolation** rescales positions $m\mapsto m\cdot L/L'$ to squeeze a longer input into the trained range, and NTK-style scaling stretches the low frequencies instead. Both are now routine when a model's context window is extended after pretraining.`,
      widget: { type: 'SvgDiagram', props: { svg: ALIBI_SVG } },
    },
    {
      kind: 'numeric',
      prompt: String.raw`An ALiBi head has slope $m=1/4$. A query at position 40 looks at a key at position 8. How much is subtracted from that attention score?`,
      answer: 8,
      why: String.raw`The penalty is $m(i-j)=\tfrac14\times(40-8)=\tfrac14\times32=8$. That is a large number next to unit-variance logits, so this head effectively ignores keys 32 steps back. A head with $m=1/256$ would subtract only $0.125$ and could attend there freely — which is why the slopes are spread geometrically.`,
    },
    {
      kind: 'multi',
      prompt: 'Which statements about positional schemes are correct? (Select all that apply.)',
      choices: [
        'Learned absolute embeddings cannot be applied at a position beyond the longest sequence seen in training.',
        'RoPE adds trainable parameters proportional to the maximum context length.',
        'ALiBi injects position purely through a bias on the attention scores, leaving the embeddings untouched.',
        'Sinusoidal encodings make the shift from p to p+k a linear map that is the same for all p.',
      ],
      answers: [0, 2, 3],
      why: String.raw`A learned table has no row for an unseen position. ALiBi's bias $-m(i-j)$ is all it uses, and the sinusoidal shift is the rotation by $k\omega_i$ in each pair, independent of $p$. RoPE is **parameter-free**: the rotation angles come from the fixed $\theta_i=10000^{-2i/d}$, so nothing scales with the context length.`,
    },
    {
      kind: 'fill',
      prompt: String.raw`Sinusoidal encodings are ___ to the token embeddings once, at the input. RoPE instead ___ the query and key vectors inside every attention head, making the score a function of the ___ position only. ALiBi adds a penalty proportional to the ___ between the two tokens.`,
      bank: ['added', 'multiplied', 'rotates', 'normalizes', 'relative', 'absolute', 'distance', 'similarity'],
      answer: ['added', 'rotates', 'relative', 'distance'],
      why: String.raw`Sinusoids are summed with the embeddings. RoPE applies a norm-preserving rotation to $\mathbf q$ and $\mathbf k$ in 2-D pairs, so $\langle\tilde{\mathbf q}_m,\tilde{\mathbf k}_n\rangle$ depends on $n-m$. ALiBi's $-m(i-j)$ is linear in the positional distance, not in any similarity.`,
    },
    {
      kind: 'order',
      prompt: 'Order the steps of applying RoPE in one attention head.',
      steps: [
        String.raw`Project the token at position $m$ to $\mathbf q$ and $\mathbf k$ with $W^Q$ and $W^K$`,
        String.raw`Split each vector into $d/2$ two-dimensional pairs`,
        String.raw`Rotate pair $i$ by the angle $m\theta_i$, with $\theta_i=10000^{-2i/d}$`,
        'Take dot products between the rotated queries and the rotated keys',
        String.raw`Scale by $1/\sqrt{d_k}$, apply the causal mask, softmax, and multiply by the (unrotated) values`,
      ],
      why: 'RoPE acts after the projections and before the scores, on queries and keys only. Values are never rotated: the positional information lives entirely in which tokens get attended to, not in what they deliver.',
    },
    {
      kind: 'mcq',
      prompt: 'A model trained with learned absolute embeddings for 2048 positions is given a 4096-token input. What is the immediate problem?',
      choices: [
        'The attention scores become negative.',
        'There is no embedding vector for positions 2049 and beyond, so the model has nothing to add there.',
        'The softmax can no longer normalize over so many keys.',
        'The causal mask stops being lower-triangular.',
      ],
      answer: 1,
      why: String.raw`The table has 2048 rows; position 2049 was never allocated or trained. Softmax normalizes over any number of keys, and masking is defined by index comparison, so neither breaks. Schemes defined by a formula (sinusoidal, RoPE, ALiBi) at least *run* at any length — though only ALiBi was shown to keep its quality there without adaptation.`,
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- Self-attention is permutation-equivariant, so position must be supplied explicitly.
- **Sinusoidal**: $PE(p,2i)=\sin(p\omega_i)$, $PE(p,2i+1)=\cos(p\omega_i)$ with $\omega_i=10000^{-2i/d}$ — parameter-free, defined at every $p$, and a shift by $k$ is a $p$-independent rotation.
- **Learned absolute** is simplest and works well inside the trained range, but has no vector beyond it.
- **RoPE** rotates $\mathbf q$ and $\mathbf k$ by $m\Theta$ per head, so $\langle\tilde{\mathbf q}_m,\tilde{\mathbf k}_n\rangle$ depends exactly on $n-m$: relative, parameter-free, norm-preserving. It is today's default.
- **ALiBi** subtracts $m(i-j)$ from the scores with geometric per-head slopes, and extrapolates to sequences far longer than those it trained on.
- Context extension of a RoPE model uses position interpolation or NTK-style frequency scaling rather than retraining from scratch.`,
    },
  ],
  references: [
    { authors: 'A. Vaswani, N. Shazeer, N. Parmar, J. Uszkoreit, L. Jones, A. N. Gomez, Ł. Kaiser & I. Polosukhin', title: 'Attention Is All You Need', year: 2017, venue: 'NeurIPS', detail: 'Sec. 3.5 (positional encoding)', url: 'https://arxiv.org/abs/1706.03762' },
    { authors: 'J. Su, Y. Lu, S. Pan, A. Murtadha, B. Wen & Y. Liu', title: 'RoFormer: Enhanced Transformer with Rotary Position Embedding', year: 2024, venue: 'Neurocomputing 568, 127063 (arXiv 2021)', url: 'https://arxiv.org/abs/2104.09864' },
    { authors: 'O. Press, N. A. Smith & M. Lewis', title: 'Train Short, Test Long: Attention with Linear Biases Enables Input Length Extrapolation', year: 2022, venue: 'ICLR', url: 'https://arxiv.org/abs/2108.12409' },
    { authors: 'P. Shaw, J. Uszkoreit & A. Vaswani', title: 'Self-Attention with Relative Position Representations', year: 2018, venue: 'NAACL-HLT', url: 'https://arxiv.org/abs/1803.02155' },
    { authors: 'S. Chen, S. Wong, L. Chen & Y. Tian', title: 'Extending Context Window of Large Language Models via Positional Interpolation', year: 2023, venue: 'arXiv:2306.15595', url: 'https://arxiv.org/abs/2306.15595' },
  ],
} satisfies LessonContent;
