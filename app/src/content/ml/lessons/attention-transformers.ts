import type { LessonContent } from '../../types';

// One transformer block, post-LN (left) vs pre-LN (right). Green line = the residual stream.
const bx = (x: number, y: number, w: number, t: string, col: string, fs = 8.5) =>
  `<rect x="${x - w / 2}" y="${y - 9}" width="${w}" height="18" rx="4" fill="var(--surface)" stroke="${col}" stroke-width="1.3"/><text x="${x}" y="${y + 3.5}" font-size="${fs}" text-anchor="middle" fill="${col}">${t}</text>`;
const plus = (x: number, y: number) =>
  `<circle cx="${x}" cy="${y}" r="8" fill="var(--surface)" stroke="var(--c1)" stroke-width="1.3"/><text x="${x}" y="${y + 4}" font-size="11" text-anchor="middle" fill="var(--c1)">+</text>`;
const vline = (x: number, y1: number, y2: number, col = 'var(--muted)', w = 1.2) =>
  `<line x1="${x}" y1="${y1}" x2="${x}" y2="${y2}" stroke="${col}" stroke-width="${w}"/>`;
const skip = (x: number, y1: number, y2: number, d: number) =>
  `<path d="M${x},${y1} C${x - d},${y1} ${x - d},${y2} ${x},${y2}" fill="none" stroke="var(--c1)" stroke-width="1.6"/>`;
const column = (cx: number, title: string, pre: boolean) => {
  const o = pre ? 0 : 1; // post-LN puts the LN after the add
  const a1 = o ? 127 : 95, a2 = o ? 53 : 24; // y of the two residual additions
  return `
<text x="${cx}" y="14" font-size="9.5" text-anchor="middle" fill="var(--fg)" font-weight="bold">${title}</text>
${vline(cx, 170, 150, 'var(--c1)', 2)}<text x="${cx}" y="183" font-size="8.5" text-anchor="middle" fill="var(--fg)">x (residual stream)</text>
${skip(cx, 164, a1, 36)}
${bx(cx, 142, 96, o ? 'Multi-head attn' : 'LayerNorm', o ? 'var(--c2)' : 'var(--c3)')}
${vline(cx, 133, 121)}
${bx(cx, 112, 96, o ? 'LayerNorm' : 'Multi-head attn', o ? 'var(--c3)' : 'var(--c2)')}
${o ? plus(cx, 127) : ''}
${pre ? plus(cx, 95) : ''}
${vline(cx, 103, 87, 'var(--c1)', 2)}
${skip(cx, 86, a2, 36)}
${bx(cx, 68, 96, o ? 'Feed-forward' : 'LayerNorm', o ? 'var(--c4)' : 'var(--c3)')}
${vline(cx, 59, 47)}
${bx(cx, 38, 96, o ? 'LayerNorm' : 'Feed-forward', o ? 'var(--c3)' : 'var(--c4)')}
${o ? plus(cx, 53) : ''}
${pre ? plus(cx, 24) : ''}
${vline(cx, 29, 20, 'var(--c1)', 2)}`;
};
const BLOCK_SVG = `<svg viewBox="0 0 320 196" xmlns="http://www.w3.org/2000/svg">
${column(80, 'post-LN (2017)', false)}
${column(240, 'pre-LN (modern)', true)}
<line x1="160" y1="20" x2="160" y2="190" stroke="var(--grid)" stroke-dasharray="3 3"/>
<text x="80" y="194" font-size="7.5" text-anchor="middle" fill="var(--muted)">LN(x + Sublayer(x))</text>
<text x="240" y="194" font-size="7.5" text-anchor="middle" fill="var(--muted)">x + Sublayer(LN(x))</text>
</svg>`;

// Q·Kᵀ → scale → mask → softmax → ·V, as a chain of matrix shapes.
const mat = (x: number, y: number, w: number, h: number, t: string, col: string) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="2" fill="${col}" fill-opacity="0.18" stroke="${col}" stroke-width="1.2"/><text x="${x + w / 2}" y="${y + h / 2 + 3.5}" font-size="9" text-anchor="middle" fill="var(--fg)">${t}</text>`;
const SDPA_SVG = `<svg viewBox="0 0 320 150" xmlns="http://www.w3.org/2000/svg">
${mat(10, 30, 26, 52, 'Q', 'var(--c2)')}<text x="23" y="94" font-size="7.5" text-anchor="middle" fill="var(--muted)">n×d_k</text>
<text x="42" y="60" font-size="11" fill="var(--fg)">×</text>
${mat(52, 44, 52, 24, 'Kᵀ', 'var(--c3)')}<text x="78" y="80" font-size="7.5" text-anchor="middle" fill="var(--muted)">d_k×n</text>
<text x="110" y="60" font-size="11" fill="var(--fg)">=</text>
${mat(124, 30, 52, 52, 'scores', 'var(--c5)')}<text x="150" y="94" font-size="7.5" text-anchor="middle" fill="var(--muted)">n×n</text>
<text x="186" y="52" font-size="8.5" fill="var(--fg)">÷√d_k, mask,</text><text x="186" y="64" font-size="8.5" fill="var(--fg)">softmax per row</text>
<path d="M178,70 C196,76 196,84 186,92" fill="none" stroke="var(--muted)" stroke-width="1.1" marker-end="url(#sdA)"/>
<defs><marker id="sdA" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0L10,5L0,10z" fill="var(--muted)"/></marker></defs>
${mat(124, 96, 52, 44, 'A', 'var(--c1)')}<text x="150" y="148" font-size="7.5" text-anchor="middle" fill="var(--muted)">n×n, rows sum to 1</text>
<text x="110" y="120" font-size="11" fill="var(--fg)">×</text>
${mat(76, 96, 26, 44, 'V', 'var(--c4)')}<text x="89" y="148" font-size="7.5" text-anchor="middle" fill="var(--muted)">n×d_v</text>
<text x="62" y="120" font-size="11" fill="var(--fg)">=</text>
${mat(14, 96, 40, 44, 'out', 'var(--c6)')}<text x="34" y="148" font-size="7.5" text-anchor="middle" fill="var(--muted)">n×d_v</text>
<text x="196" y="112" font-size="8" fill="var(--muted)">the n×n matrix is the</text><text x="196" y="123" font-size="8" fill="var(--muted)">whole cost story:</text><text x="196" y="134" font-size="8" fill="var(--muted)">O(n²d) time and O(n²) memory</text>
</svg>`;

export default {
  cards: [
    {
      kind: 'explain',
      title: 'One vector for a whole sentence',
      body: String.raw`In 2014 the best translators were encoder–decoder [RNNs](@ml/rnns): one network read the source sentence into a single fixed-size vector, another wrote the translation out of it. Performance collapsed on long sentences — everything had to pass through that one vector.

Bahdanau, Cho & Bengio (2015) removed the bottleneck. Instead of one summary, keep **every** encoder state $\mathbf h_1,\dots,\mathbf h_n$, and let the decoder, at each output step, compute a weighted average of them with weights it chooses:
$$\mathbf c_i=\sum_{j=1}^n \alpha_{ij}\,\mathbf h_j,\qquad \sum_j\alpha_{ij}=1.$$
They called $\alpha_{ij}$ an **alignment**: plotting it showed the model lining French words up with their English sources, with no supervision. This is **attention**.

Vaswani et al. (2017) then asked: if attention solves the problem, do we need the RNN at all? Their answer was *Attention Is All You Need* — the **transformer**.`,
    },
    {
      kind: 'explain',
      title: 'Queries, keys and values',
      body: String.raw`Think of a soft dictionary. A normal lookup takes a key and returns one value. Attention takes a **query** $\mathbf q$, compares it with every **key** $\mathbf k_j$, turns the similarities into weights that sum to 1, and returns the correspondingly weighted mixture of **values** $\mathbf v_j$:
$$\text{score}_j=\mathbf q\cdot\mathbf k_j,\qquad \alpha_j=\operatorname{softmax}_j(\text{score}),\qquad \text{out}=\sum_j\alpha_j\mathbf v_j.$$
Nothing is retrieved exactly; everything is retrieved a little. Because [softmax](@ml/softmax-classification) is differentiable, the model can *learn* what to look for.

In **self-attention** all three come from the same sequence. Each token's embedding $\mathbf x_i$ is projected three ways:
$$\mathbf q_i=W^Q\mathbf x_i,\qquad \mathbf k_i=W^K\mathbf x_i,\qquad \mathbf v_i=W^V\mathbf x_i.$$
Loosely: the query is "what am I looking for", the key is "what I can offer", the value is "what I will pass on if chosen". The three projections are learned, so a token can advertise something quite different from what it delivers.`,
    },
    {
      kind: 'widget',
      title: 'Pick a query, see where it looks',
      body: String.raw`Each row is one query token, each column a key. Shade = attention weight; every row sums to 1. Tap a row (or a button) to select the query and read its weights on the right.

Select **it**: most of its weight sits on *cat* — a learned coreference link that no fixed window could give you. Select **tired**: it spreads over *it* and *cat*.

Now press **÷√d_k** to turn the scaling *off*. The logits get multiplied by $\sqrt{d_k}=8$ and the softmax collapses onto a single key — the effective number of keys attended, $e^{H}$, drops towards 1. The next card explains why that is bad.`,
      widget: { type: 'MlAttentionHeatmap', props: { query: 4, dk: 64 } },
    },
    {
      kind: 'mcq',
      prompt: 'In self-attention, what does it mean that each row of the attention matrix sums to 1?',
      choices: [
        'Each token distributes a fixed budget of attention over all tokens, producing a weighted average of their values.',
        'Each token is attended to exactly once by the whole sequence.',
        'The value vectors are normalized to unit length.',
        'The attention matrix is a rotation, so it preserves the norm of the input.',
      ],
      answer: 0,
      why: String.raw`A row is $\operatorname{softmax}$ over keys for one query, so its entries are non-negative and sum to 1: the output is a convex combination of the value vectors. **Columns** need not sum to 1 — a popular token like *cat* can receive a lot of attention from many queries, and that is exactly what the heatmap shows.`,
    },
    {
      kind: 'explain',
      title: 'Why divide by √d_k',
      body: String.raw`Attention uses the **scaled** dot product:
$$\operatorname{Attention}(Q,K,V)=\operatorname{softmax}\!\Big(\frac{QK^\top}{\sqrt{d_k}}\Big)V.$$
Here is the reason, from the paper's own footnote. Suppose the entries of $\mathbf q$ and $\mathbf k$ are independent with mean 0 and variance 1. Then
$$\mathbf q\cdot\mathbf k=\sum_{i=1}^{d_k}q_ik_i\quad\text{has mean }0\text{ and variance }d_k,$$
so its typical size is $\sqrt{d_k}$ — for $d_k=64$, about $\pm8$. Feed logits of that size into a softmax and it saturates: one weight near 1, the rest near 0.

Saturation is bad twice over. The output stops being a useful mixture, and the **gradient dies**: for a softmax, $\partial p_i/\partial z_j=p_i(\delta_{ij}-p_j)$, which is $\approx0$ when every $p$ is near 0 or 1. Dividing by $\sqrt{d_k}$ restores unit-variance logits at any head size, so the same initialization works for $d_k=16$ or $d_k=128$.`,
      widget: {
        type: 'MlSoftmaxBars',
        props: { logits: [2, 1, 0], labels: ['cat', 'sat', 'the'], temperature: 1, target: 0 },
        caption: String.raw`Treat the temperature as the scaling: $T=1$ is "divided by $\sqrt{d_k}$". Dropping $T$ towards 0.1 is what *removing* the scale does to the weights — one bar takes everything.`,
      },
    },
    {
      kind: 'numeric',
      prompt: String.raw`Query and key vectors have $d_k=64$ entries, each independent with mean 0 and variance 1. What is the standard deviation of the raw dot product $\mathbf q\cdot\mathbf k$?`,
      answer: 8,
      tolerance: 0.01,
      why: String.raw`Variance adds over independent terms: $\operatorname{Var}(\sum_i q_ik_i)=\sum_i\operatorname{Var}(q_ik_i)=d_k\cdot1=64$, so the standard deviation is $\sqrt{64}=8$. Dividing by $\sqrt{d_k}=8$ brings it back to 1 — which is exactly where a softmax is well behaved.`,
    },
    {
      kind: 'numeric',
      prompt: String.raw`A query has raw dot products $[8,4,0]$ with three keys, and $d_k=16$. After scaling by $1/\sqrt{d_k}$ and taking the softmax, what weight does the first key get? Give 3 decimals.`,
      answer: 0.665,
      tolerance: 0.003,
      why: String.raw`Scaling divides by 4: $[2,1,0]$. Then $e^2=7.389$, $e^1=2.718$, $e^0=1$, summing to $11.107$, so the weight is $7.389/11.107=0.665$. **Without** the scaling, $\operatorname{softmax}([8,4,0])$ gives $0.982$ — nearly a hard argmax, with almost no gradient.`,
    },
    {
      kind: 'widget',
      title: 'Self-attention in matrix form',
      body: String.raw`Stack the $n$ token vectors as rows of $X\in\mathbb R^{n\times d}$. Then $Q=XW^Q$, $K=XW^K$, $V=XW^V$, and the whole layer is four matrix products:
$$\operatorname{Attention}(Q,K,V)=\operatorname{softmax}\!\Big(\frac{QK^\top}{\sqrt{d_k}}+M\Big)V,$$
with the softmax taken over each row and $M$ an optional mask. There is no loop over positions: every token is processed at once, which is why transformers use GPUs so much better than RNNs.

The cost is the $n\times n$ score matrix: $O(n^2d)$ time and $O(n^2)$ memory, against $O(nd^2)$ for an RNN. The payoff is that **any two positions are one step apart**, so a gradient between tokens 1 and 1000 travels along a path of length 1 rather than 1000.`,
      widget: { type: 'SvgDiagram', props: { svg: SDPA_SVG } },
    },
    {
      kind: 'match',
      prompt: 'Match each quantity in scaled dot-product attention to its shape, for n tokens, key size d_k and value size d_v.',
      pairs: [
        ['Q', String.raw`$n\times d_k$`],
        [String.raw`$QK^\top$`, String.raw`$n\times n$`],
        ['V', String.raw`$n\times d_v$`],
        ['the layer output', String.raw`$n\times d_v$`],
      ],
      why: String.raw`Queries and keys must share a dimension so they can be dotted, giving one score per (query, key) pair: an $n\times n$ matrix. Multiplying those weights by $V$ averages value vectors, so the output has one $d_v$-vector per token — the same shape as $V$.`,
    },
    {
      kind: 'explain',
      title: 'Multi-head attention',
      body: String.raw`One attention map has to serve every purpose at once: syntax, coreference, topic. Instead, run $h$ attentions in parallel, each in its own subspace:
$$\text{head}_i=\operatorname{Attention}(XW_i^Q,\,XW_i^K,\,XW_i^V),\qquad \operatorname{MHA}(X)=\big[\text{head}_1,\dots,\text{head}_h\big]W^O.$$
Each head uses $d_k=d_v=d_{\text{model}}/h$, so the concatenation is back to $d_{\text{model}}$ and the **total cost is about that of one full-size head**. The base transformer of Vaswani et al. (2017) uses $d_{\text{model}}=512$ with $h=8$ heads of width 64.

Different heads learn visibly different jobs — attending to the previous token, to the matching bracket, to the subject of the verb. Be careful with the folklore, though: head roles are far from clean, and many heads can be pruned after training with little loss (Michel et al. 2019).

**Cross-attention** uses the same machinery with queries from one sequence and keys/values from another: that is how a decoder reads the encoder, and how an image model conditions on text.`,
    },
    {
      kind: 'numeric',
      prompt: String.raw`A transformer has $d_{\text{model}}=512$ and $h=8$ heads. What is the width $d_k$ of each head?`,
      answer: 64,
      why: String.raw`$d_k=d_{\text{model}}/h=512/8=64$. Splitting the width this way keeps the cost of 8 heads roughly equal to one head of width 512, because the work in each head scales with its width. The head count is a way to spend the *same* compute on several different attention patterns.`,
    },
    {
      kind: 'explain',
      title: 'Causal masking: no peeking',
      body: String.raw`A language model predicts token $t+1$ from tokens $1..t$. But self-attention, left alone, lets every position see every other — including the future, which would make next-token prediction trivial and useless.

The fix is a **causal** (or autoregressive) **mask**: before the softmax, set every score with $j>i$ to $-\infty$,
$$M_{ij}=\begin{cases}0,& j\le i\\ -\infty,& j>i\end{cases}$$
so $e^{-\infty}=0$ and those weights vanish exactly. The remaining weights still renormalize to 1 over the allowed keys. Position 1 can attend only to itself; position $n$ to everything.

This is why a decoder can be trained on a whole sequence **in parallel**: every position predicts its own next token under the mask, giving $n$ training signals from one forward pass. Encoders (BERT-style) use no causal mask; they do use a *padding* mask so that nothing attends to filler tokens.`,
      widget: {
        type: 'MlAttentionHeatmap',
        props: { query: 4, causal: true, showScaling: false },
        caption: 'Grey ×: positions masked out. Rows still sum to 1 over what is left, and row 1 has no choice but itself.',
      },
    },
    {
      kind: 'truefalse',
      prompt: 'With a causal mask, the attention weights of the first token are spread over all tokens in the sequence.',
      answer: false,
      why: String.raw`Under the mask the first query may only attend to position 1, so after renormalizing its weight on itself is exactly 1. Its output is just its own value vector. Information only ever flows from earlier positions to later ones.`,
    },
    {
      kind: 'explain',
      title: 'The transformer block',
      body: String.raw`Attention mixes information **across** tokens, but it is linear in $V$ and has no per-token nonlinearity to speak of. So each block pairs it with a **position-wise feed-forward network** applied to every token separately with the same weights:
$$\operatorname{FFN}(\mathbf x)=W_2\,\varphi(W_1\mathbf x+\mathbf b_1)+\mathbf b_2,$$
with an inner width $d_{\text{ff}}=4d_{\text{model}}$ (2048 for the base model) and $\varphi$ a ReLU in 2017, usually GELU or SwiGLU today. Because of the 4× expansion, the FFN holds **about two thirds of a block's parameters**: $2d\,d_{\text{ff}}=2.1$M against $4d^2=1.05$M for attention at $d=512$.

Each of the two sublayers is wrapped in a [residual connection](@ml/residual-connections) and a [LayerNorm](@ml/normalization-layers). Stack $N$ identical blocks (6 in the base model, dozens to over a hundred today) and you have a transformer. The residual stream is the backbone: every sublayer *reads* from it and *adds* its contribution back.`,
      widget: { type: 'SvgDiagram', props: { svg: BLOCK_SVG }, caption: 'Green = the residual stream. The only difference between the two designs is where LayerNorm sits.' },
    },
    {
      kind: 'explain',
      title: 'Post-LN versus pre-LN',
      body: String.raw`The 2017 paper used **post-LN**: $\mathbf x\mapsto\operatorname{LN}(\mathbf x+\operatorname{Sublayer}(\mathbf x))$. Notice that the normalization sits *on* the residual stream, so the clean identity path is broken at every block.

Xiong et al. (2020) analysed this. At initialization, post-LN transformers have large gradients near the output layer — bounded by $O(d\sqrt{\ln d})$, with no shrinkage as the model gets deeper — so a large early learning rate blows training up. That is why the original recipe needs a **learning-rate warm-up** of thousands of steps, and why deep post-LN models are finicky.

**Pre-LN** puts the normalization inside the branch: $\mathbf x\mapsto\mathbf x+\operatorname{Sublayer}(\operatorname{LN}(\mathbf x))$. Now the residual path is an unbroken identity, and the same bound gains a $1/\sqrt{L}$ factor for an $L$-layer model instead of staying large, so the model trains **without warm-up** and at larger learning rates. The cost is a mild loss of final quality in some settings; a final LayerNorm is added after the last block because the stream is otherwise unnormalized. Essentially all large modern models (GPT-style, LLaMA-style, usually with RMSNorm) are pre-LN.`,
    },
    {
      kind: 'mcq',
      prompt: 'What is the practical consequence of moving LayerNorm from after the residual addition (post-LN) to inside the branch (pre-LN)?',
      choices: [
        'The residual path becomes an unnormalized identity, gradients at initialization stay bounded with depth, and learning-rate warm-up is no longer needed.',
        'The model needs fewer parameters, since LayerNorm is applied to a smaller tensor.',
        'Attention becomes causal, so the model can be used for generation.',
        'The block stops needing a feed-forward sublayer.',
      ],
      answer: 0,
      why: String.raw`Pre-LN keeps $\mathbf x+F(\operatorname{LN}(\mathbf x))$, so the identity path is unbroken and the gradient at initialization stays well behaved as depth grows — Xiong et al. (2020) showed warm-up can then be dropped. LayerNorm's parameter count ($2d$) is identical either way; masking and the FFN are unrelated choices.`,
    },
    {
      kind: 'order',
      prompt: 'Order the computations inside one pre-LN transformer block, for an input X.',
      steps: [
        'Normalize a copy of the residual stream: LN(X)',
        'Project it to queries, keys and values with W^Q, W^K, W^V (per head)',
        'Form the scores QKᵀ/√d_k, add the mask, take a row-wise softmax, and multiply by V',
        'Concatenate the heads, project with W^O, and add the result back to the residual stream',
        'Normalize again, pass through the position-wise feed-forward network, and add that back too',
      ],
      why: 'Pre-LN normalizes before each sublayer, never on the stream itself. Attention always runs score → mask → softmax → weighted sum of values; the output projection and the residual addition close the first sublayer before the feed-forward one begins.',
    },
    {
      kind: 'fill',
      prompt: String.raw`Scaled dot-product attention divides the scores by ___ so that logits keep unit variance and the ___ does not saturate. A causal mask sets the scores of future positions to ___ before that step. Attention mixes information across tokens; the ___ then transforms each token on its own.`,
      bank: ['√d_k', 'd_k', 'softmax', 'LayerNorm', '−∞', 'zero', 'feed-forward network', 'residual connection'],
      answer: ['√d_k', 'softmax', '−∞', 'feed-forward network'],
      why: String.raw`Dot products of $d_k$-dimensional vectors have standard deviation $\sqrt{d_k}$, so that is the right divisor (dividing by $d_k$ would over-shrink them). Masking with $0$ would leave those keys fully available, since $e^0=1$; $-\infty$ maps to a weight of exactly 0. The position-wise FFN is the only per-token nonlinear transform in the block.`,
    },
    {
      kind: 'multi',
      prompt: 'Which of these are genuine advantages of self-attention over a recurrent layer? (Select all that apply.)',
      choices: [
        'All positions are computed in parallel, instead of one step after another.',
        'The path between any two tokens has length 1, so long-range gradients do not have to survive many steps.',
        'The cost grows more slowly with sequence length.',
        'Each token can draw directly on content anywhere in the sequence, chosen by learned similarity.',
      ],
      answers: [0, 1, 3],
      why: String.raw`Parallelism, constant path length and content-based access are the real wins. Cost is the **trade-off**, not an advantage: self-attention is $O(n^2d)$ in the sequence length against $O(nd^2)$ for a recurrent layer, so it is *more* expensive once $n$ exceeds $d$. That single fact drives the whole [efficient-attention](@ml/efficient-attention) literature.`,
    },
    {
      kind: 'explain',
      title: 'What the 2017 paper actually reported',
      body: String.raw`Worth knowing, because the numbers are small by today's standards. The base model had 6 encoder and 6 decoder blocks, $d_{\text{model}}=512$, $h=8$, $d_{\text{ff}}=2048$, dropout 0.1 and label smoothing 0.1, and was trained for 100k steps — about 12 hours on 8 NVIDIA P100 GPUs. The big model ($d_{\text{model}}=1024$, $h=16$, $d_{\text{ff}}=4096$) trained for 3.5 days and reached **28.4 BLEU** on WMT 2014 English→German and **41.8 BLEU** on English→French, beating the previous best (including ensembles) at a fraction of the training cost.

Two things the architecture does *not* give you for free: it has **no notion of order** (permute the tokens and self-attention permutes the output identically), which is why [positional encodings](@ml/positional-encodings) are added; and its $O(n^2)$ cost sets a hard practical limit on context length.`,
    },
    {
      kind: 'truefalse',
      prompt: 'Without positional information, a self-attention layer treats the input as a set: shuffling the tokens shuffles the outputs the same way, with no other change.',
      answer: true,
      why: String.raw`Every operation — the projections, the dot products, the softmax over keys, the weighted sum — is applied identically to all positions, so self-attention is **permutation-equivariant**. "the cat sat" and "sat cat the" would give the same multiset of outputs. Order has to be injected, by adding or rotating position information into the vectors.`,
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- Attention began as a fix for the encoder–decoder bottleneck (Bahdanau et al. 2015): output a *weighted average* of all encoder states, with learned weights.
- The unit of computation is query–key–value: $\operatorname{Attention}(Q,K,V)=\operatorname{softmax}(QK^\top/\sqrt{d_k})V$, with $Q,K,V$ all learned projections of the same sequence in self-attention.
- The $\sqrt{d_k}$ exists because a $d_k$-dimensional dot product of unit-variance vectors has standard deviation $\sqrt{d_k}$; unscaled logits saturate the softmax and kill its gradient.
- **Multi-head**: $h$ attentions of width $d_{\text{model}}/h$ in parallel, concatenated and projected — several patterns for the price of one.
- **Causal mask** ($-\infty$ above the diagonal) makes a decoder autoregressive while keeping training parallel over positions.
- A block = multi-head attention + position-wise FFN ($d_{\text{ff}}=4d$, ~2/3 of the parameters), each wrapped in a residual connection and LayerNorm.
- **Pre-LN** ($\mathbf x+F(\operatorname{LN}\mathbf x)$) keeps the identity path intact, bounds gradients with depth and removes the need for warm-up; **post-LN** was the 2017 original.
- Costs $O(n^2d)$ with a path length of 1 between any two tokens, and is permutation-equivariant until positions are added.`,
    },
  ],
  references: [
    { authors: 'A. Vaswani, N. Shazeer, N. Parmar, J. Uszkoreit, L. Jones, A. N. Gomez, Ł. Kaiser & I. Polosukhin', title: 'Attention Is All You Need', year: 2017, venue: 'NeurIPS', url: 'https://arxiv.org/abs/1706.03762' },
    { authors: 'D. Bahdanau, K. Cho & Y. Bengio', title: 'Neural Machine Translation by Jointly Learning to Align and Translate', year: 2015, venue: 'ICLR', url: 'https://arxiv.org/abs/1409.0473' },
    { authors: 'R. Xiong, Y. Yang, D. He, K. Zheng, S. Zheng, C. Xing, H. Zhang, Y. Lan, L. Wang & T.-Y. Liu', title: 'On Layer Normalization in the Transformer Architecture', year: 2020, venue: 'ICML', url: 'https://arxiv.org/abs/2002.04745' },
    { authors: 'P. Michel, O. Levy & G. Neubig', title: 'Are Sixteen Heads Really Better than One?', year: 2019, venue: 'NeurIPS', url: 'https://arxiv.org/abs/1905.10650' },
    { authors: 'S. J. D. Prince', title: 'Understanding Deep Learning', year: 2023, venue: 'MIT Press', detail: 'Ch. 12 (transformers)', url: 'https://udlbook.github.io/udlbook/' },
  ],
} satisfies LessonContent;
