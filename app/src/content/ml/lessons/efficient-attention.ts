import type { LessonContent } from '../../types';

// Three sparsity patterns over an n×n attention matrix: sliding window, window+global, random+window+global.
const PAT = (() => {
  const n = 12, c = 9.5, pad = 14;
  const panel = (x0: number, label: string, keep: (i: number, j: number) => boolean, sub: string) => {
    let g = `<text x="${x0 + (n * c) / 2}" y="22" font-size="9" text-anchor="middle" fill="var(--fg)" font-weight="bold">${label}</text>`;
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
      const on = keep(i, j);
      g += `<rect x="${x0 + j * c}" y="${30 + i * c}" width="${c - 0.8}" height="${c - 0.8}" fill="${on ? 'var(--c2)' : 'var(--grid)'}" opacity="${on ? 0.85 : 0.35}"/>`;
    }
    const cnt = (() => { let k = 0; for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) if (keep(i, j)) k++; return k; })();
    g += `<text x="${x0 + (n * c) / 2}" y="${30 + n * c + 11}" font-size="8" text-anchor="middle" fill="var(--muted)">${cnt}/${n * n} cells</text>`;
    g += `<text x="${x0 + (n * c) / 2}" y="${30 + n * c + 22}" font-size="8" text-anchor="middle" fill="var(--c3)">${sub}</text>`;
    return g;
  };
  const rand = [[2, 9], [4, 1], [6, 11], [9, 3], [11, 6], [1, 7], [7, 2], [10, 0]];
  return `<svg viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg">
<text x="4" y="11" font-size="8" fill="var(--muted)">blue = a score that is actually computed (rows: queries, columns: keys)</text>
${panel(pad, 'window', (i, j) => Math.abs(i - j) <= 1, 'O(n·w)')}
${panel(pad + 103, '+ global', (i, j) => Math.abs(i - j) <= 1 || i === 0 || j === 0, 'O(n·w + n·g)')}
${panel(pad + 206, '+ random', (i, j) => Math.abs(i - j) <= 1 || i === 0 || j === 0 || rand.some(([a, b]) => a === i && b === j), 'BigBird: O(n)')}
</svg>`;
})();

// FlashAttention: the n×n matrix never exists; blocks of Q, K, V are loaded into fast SRAM one tile at a time.
const FLASH_SVG = `<svg viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg">
<rect x="8" y="22" width="120" height="140" rx="6" fill="none" stroke="var(--muted)" stroke-dasharray="4 3"/>
<text x="68" y="36" font-size="9" text-anchor="middle" fill="var(--muted)">HBM (big, slow)</text>
<text x="68" y="47" font-size="7.5" text-anchor="middle" fill="var(--muted)">~1.5 TB/s, GBs</text>
<rect x="20" y="56" width="28" height="90" rx="3" fill="var(--c2)" fill-opacity="0.2" stroke="var(--c2)"/><text x="34" y="105" font-size="9" text-anchor="middle" fill="var(--fg)">Q</text>
<rect x="54" y="56" width="28" height="90" rx="3" fill="var(--c3)" fill-opacity="0.2" stroke="var(--c3)"/><text x="68" y="105" font-size="9" text-anchor="middle" fill="var(--fg)">K</text>
<rect x="88" y="56" width="28" height="90" rx="3" fill="var(--c4)" fill-opacity="0.2" stroke="var(--c4)"/><text x="102" y="105" font-size="9" text-anchor="middle" fill="var(--fg)">V</text>
<rect x="196" y="22" width="116" height="140" rx="6" fill="none" stroke="var(--c1)" stroke-width="1.4"/>
<text x="254" y="36" font-size="9" text-anchor="middle" fill="var(--c1)">SRAM (small, fast)</text>
<text x="254" y="47" font-size="7.5" text-anchor="middle" fill="var(--muted)">~19 TB/s, ~20 MB</text>
<rect x="210" y="58" width="24" height="34" rx="3" fill="var(--c2)" fill-opacity="0.35" stroke="var(--c2)"/><text x="222" y="79" font-size="8" text-anchor="middle" fill="var(--fg)">Qᵢ</text>
<rect x="240" y="58" width="24" height="34" rx="3" fill="var(--c3)" fill-opacity="0.35" stroke="var(--c3)"/><text x="252" y="79" font-size="8" text-anchor="middle" fill="var(--fg)">Kⱼ</text>
<rect x="270" y="58" width="24" height="34" rx="3" fill="var(--c4)" fill-opacity="0.35" stroke="var(--c4)"/><text x="282" y="79" font-size="8" text-anchor="middle" fill="var(--fg)">Vⱼ</text>
<rect x="222" y="104" width="62" height="24" rx="3" fill="var(--c5)" fill-opacity="0.3" stroke="var(--c5)"/><text x="253" y="120" font-size="8" text-anchor="middle" fill="var(--fg)">one tile only</text>
<text x="254" y="144" font-size="8" text-anchor="middle" fill="var(--fg)">running max + sum</text>
<text x="254" y="155" font-size="8" text-anchor="middle" fill="var(--muted)">rescale the output so far</text>
<path d="M132,88 L190,88" stroke="var(--c1)" stroke-width="1.6" marker-end="url(#flA)"/>
<defs><marker id="flA" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0L10,5L0,10z" fill="var(--c1)"/></marker></defs>
<text x="161" y="82" font-size="8" text-anchor="middle" fill="var(--c1)">tiles</text>
<circle r="3.5" fill="var(--c1)"><animateMotion path="M132,88 L188,88" dur="1.6s" repeatCount="indefinite"/></circle>
<text x="160" y="176" font-size="8.5" text-anchor="middle" fill="var(--muted)">the full n×n score matrix is never written to memory — same answer, fewer trips</text>
</svg>`;

export default {
  cards: [
    {
      kind: 'recall',
      title: 'Where the cost comes from',
      points: [
        String.raw`Self-attention builds an $n\times n$ score matrix: $\operatorname{softmax}(QK^\top/\sqrt{d_k})V$.`,
        String.raw`Time $O(n^2d)$ and memory $O(n^2)$ per head per layer, against $O(nd^2)$ for a recurrent layer.`,
        String.raw`The reward is a path length of 1 between any two positions, and full parallelism over positions.`,
        String.raw`See [big-O notation](@cs/big-o) for why the exponent, not the constant, decides what is feasible.`,
      ],
      link: 'ml/attention-transformers',
    },
    {
      kind: 'explain',
      title: 'Quadratic hurts sooner than you think',
      body: String.raw`Doubling the context quadruples the attention work. With $n=1{,}024$ a head holds about a million scores; with $n=32{,}768$ it holds **a billion**. At 2 bytes each (fp16) that is 2 GB — for one head, in one layer, for one sequence in the batch.

So the $n^2$ term is usually a *memory* problem before it is a compute problem. The responses split into two camps, and it matters which one you are looking at:

- **Exact, but cheaper to run**: compute the same mathematical function with fewer memory trips — **FlashAttention**.
- **Approximate**: change the function so that fewer scores exist at all — sparse, low-rank or linear attention, or replace attention with a recurrence (**state-space models**).

Only the second camp changes what the model can represent.`,
      widget: {
        type: 'BigOChart',
        props: { curves: ['n', 'nlogn', 'n2'], nMax: 4096, n: 1024, log: true, maxSlider: 131072 },
        caption: 'Slide n up to a realistic context length and watch the gap between O(n) and O(n²) open up.',
      },
    },
    {
      kind: 'numeric',
      prompt: String.raw`A model has a context of $n=8192$. How many entries does the attention score matrix of a **single head** contain? Give the answer in millions (to the nearest million).`,
      answer: 67,
      tolerance: 1,
      why: String.raw`$8192^2=67{,}108{,}864\approx67$ million. With 32 heads and 32 layers, naively storing all of them in fp16 would need over 100 GB — which is why no real implementation keeps the full matrix around.`,
    },
    {
      kind: 'explain',
      title: 'FlashAttention: same maths, fewer memory trips',
      body: String.raw`Dao, Fu, Ermon, Rudra & Ré (2022) made the key observation that attention on a GPU is **memory-bound**, not compute-bound. A standard implementation writes the $n\times n$ scores to high-bandwidth memory (HBM), reads them back to apply the softmax, writes them again, and reads them once more to multiply by $V$. The arithmetic is cheap; the traffic is not.

FlashAttention is **IO-aware**. It splits $Q$, $K$ and $V$ into blocks that fit in the GPU's small, very fast on-chip SRAM, and for each pair of blocks computes the partial scores, updates a running softmax, and accumulates the output — never materializing the full matrix. For the backward pass it **recomputes** the needed scores from $Q,K,V$ instead of storing them, trading a little arithmetic for a lot of memory.

The result is **exact** attention (bit-for-bit the same function, up to floating point) with memory linear in $n$ and HBM accesses reduced from $\Theta(n^2)$ to $O(n^2d^2/M)$, where $M$ is the SRAM size. The paper reported about 3× faster GPT-2 training and 2.4× on Long Range Arena; FlashAttention-2 (2023) roughly doubled that again. It is now the default kernel almost everywhere.`,
      widget: { type: 'SvgDiagram', props: { svg: FLASH_SVG } },
    },
    {
      kind: 'widget',
      title: 'The trick that makes tiling possible',
      body: String.raw`A softmax looks like it needs all its inputs before it can produce any output — it has to divide by the total. The **online softmax** removes that obstacle: keep a running maximum and a running sum, and rescale what you have so far whenever the maximum changes.`,
      widget: {
        type: 'StepReveal',
        props: {
          steps: [
            String.raw`Goal: $\operatorname{out}=\sum_j \dfrac{e^{s_j-m}}{\ell}\mathbf v_j$ with $m=\max_j s_j$ and $\ell=\sum_j e^{s_j-m}$, seeing the $s_j$ in blocks.`,
            String.raw`After the blocks seen so far, store three things: $m$ (running max), $\ell$ (running sum) and $\mathbf o$ (running weighted sum of values).`,
            String.raw`A new block arrives with max $m'$ and local sum $\ell'$. The new overall max is $m^{\text{new}}=\max(m,m')$.`,
            String.raw`Rescale the old statistics to the new max: $\ell\leftarrow e^{m-m^{\text{new}}}\ell+e^{m'-m^{\text{new}}}\ell'$, and likewise $\mathbf o\leftarrow e^{m-m^{\text{new}}}\mathbf o+e^{m'-m^{\text{new}}}\mathbf o'$.`,
            String.raw`At the end divide once: $\operatorname{out}=\mathbf o/\ell$. Exactly the usual softmax, computed in one pass with $O(d)$ extra state per query.`,
          ],
          notes: ['subtracting the max keeps exponentials finite', 'this is the whole state of a query', '', 'the correction factor is just a power of e', 'no n×n matrix was ever stored'],
        },
      },
    },
    {
      kind: 'mcq',
      prompt: 'How does FlashAttention differ from sparse or linear attention?',
      choices: [
        'It computes exactly the same attention function, only with a memory-efficient GPU kernel; the others change the function being computed.',
        'It approximates the softmax with a low-rank factorization.',
        'It drops attention scores below a threshold.',
        'It reduces the asymptotic FLOP count of attention from O(n²d) to O(nd).',
      ],
      answer: 0,
      why: String.raw`FlashAttention is an **exact** algorithm: tiling plus an online softmax plus recomputation in the backward pass. Its arithmetic is still $\Theta(n^2d)$ — what falls is the memory traffic and the $O(n^2)$ storage. Approximating or sparsifying the softmax is what the other families do.`,
    },
    {
      kind: 'explain',
      title: 'Sparse attention: do not look everywhere',
      body: String.raw`If most attention weight is local anyway, compute only some of the scores. Child et al. (2019) introduced strided and fixed sparse patterns, giving $O(n\sqrt n)$. **Longformer** (Beltagy et al. 2020) uses a sliding window of width $w$ plus a few **global** tokens that everyone can see and that see everyone, for $O(n(w+g))$. **BigBird** (Zaheer et al. 2020) adds a handful of **random** connections per query and proves that window + global + random keeps the model a universal approximator of sequence functions and Turing complete, while costing $O(n)$.

The design tension is clear in the pictures: a pure window has a path length of $O(n/w)$ between distant tokens, so information needs several layers to cross the sequence. Global and random links are shortcuts that restore a short path at almost no cost.

Sliding-window attention is alive and well in production models (Mistral, Gemma and others interleave local and full layers).`,
      widget: { type: 'SvgDiagram', props: { svg: PAT }, caption: 'Each panel is the same 12×12 score matrix; only the blue cells are computed.' },
    },
    {
      kind: 'explain',
      title: 'Linear attention: reorder the matrix products',
      body: String.raw`The quadratic term comes from computing $(QK^\top)V$ — an $n\times n$ object in the middle. Matrix multiplication is associative, so $Q(K^\top V)$ gives the same answer with a $d\times d$ object in the middle, costing $O(nd^2)$.

The catch: the softmax sits between $QK^\top$ and $V$, and you cannot reassociate across it. Katharopoulos et al. (2020) therefore replace $\exp(\mathbf q\cdot\mathbf k)$ with a **kernel feature map** $\phi(\mathbf q)^\top\phi(\mathbf k)$ (they use $\phi(x)=\operatorname{elu}(x)+1$ to keep weights positive):
$$\operatorname{out}_i=\frac{\phi(\mathbf q_i)^\top\sum_j\phi(\mathbf k_j)\mathbf v_j^\top}{\phi(\mathbf q_i)^\top\sum_j\phi(\mathbf k_j)}.$$
Both sums are shared by all queries, so the layer is **linear in $n$**. In the causal case the sums become running totals, which makes the model a recurrent network with a $d\times d$ matrix-valued state — hence their title, *Transformers are RNNs*. Inference then costs $O(1)$ per token instead of growing with the context.

**Performers** (Choromanski et al. 2021) choose $\phi$ as random features that estimate the softmax kernel without bias. In practice these methods lose accuracy on tasks needing sharp, precise retrieval: a softmax can concentrate on one token, a low-rank kernel struggles to.`,
    },
    {
      kind: 'numeric',
      prompt: String.raw`Compare $n^2d$ (softmax attention) with $nd^2$ (linear attention) for $d=64$. At what sequence length $n$ do the two costs become equal?`,
      answer: 64,
      why: String.raw`Set $n^2d=nd^2$, giving $n=d=64$. Below that, quadratic attention is actually *cheaper*; the advantage of linear attention only grows for $n\gg d$. With real head dimensions in the tens and contexts in the thousands, that condition is comfortably met — but the constants and the accuracy loss are what decide in practice.`,
    },
    {
      kind: 'match',
      prompt: 'Match each method to the idea it rests on.',
      pairs: [
        ['FlashAttention', 'Tile the computation into SRAM and use an online softmax — exact, IO-aware'],
        ['Longformer / BigBird', 'Compute only a chosen subset of the scores: window, global and random'],
        ['Linear attention / Performer', 'Replace exp(q·k) with a feature map so the products can be reassociated'],
        ['Mamba (selective SSM)', 'Drop attention for an input-dependent recurrence computed with a parallel scan'],
      ],
      why: 'Only FlashAttention leaves the function unchanged. Sparsity removes entries, kernel methods remove the softmax, and state-space models replace the mixing mechanism entirely.',
    },
    {
      kind: 'explain',
      title: 'State-space models: a recurrence you can train in parallel',
      body: String.raw`A different line of attack goes back to classical control. A linear **state-space model** maps a signal $u(t)$ to $y(t)$ through a hidden state:
$$\mathbf x'(t)=A\mathbf x(t)+B\,u(t),\qquad y(t)=C\mathbf x(t)+D\,u(t).$$
Discretized, this is a linear recurrence $\mathbf x_k=\bar A\mathbf x_{k-1}+\bar B u_k$. Because it is **linear and time-invariant**, unrolling it gives a convolution, $y=\bar K * u$, whose kernel can be built once with an FFT — so training is parallel over the whole sequence while inference is a cheap step-by-step recurrence. The trouble was memory: a random $A$ forgets fast. **S4** (Gu, Goel & Ré, 2022) fixed this with HiPPO-derived structured $A$ matrices that provably keep a compressed history, and set records on the Long Range Arena.

**Mamba** (Gu & Dao, 2023) made $B$, $C$ and the step size $\Delta$ **functions of the input**, so the model can choose what to remember — the content-based behaviour that linear time-invariant systems cannot have. That breaks the convolution view, so the authors wrote a hardware-aware **parallel scan** kernel instead. Mamba is linear in sequence length, has no KV cache, and reports around 5× the inference throughput of a comparable transformer.

Today the common verdict is that attention is better at precise recall and in-context lookup, SSMs are better at cheap long-range mixing, and the strongest long-context models are **hybrids** that interleave the two.`,
    },
    {
      kind: 'truefalse',
      prompt: 'A linear time-invariant state-space layer can be computed either as a recurrence or as a convolution, giving the same output.',
      answer: true,
      why: String.raw`Unrolling $\mathbf x_k=\bar A\mathbf x_{k-1}+\bar B u_k$ gives $y_k=\sum_{j}C\bar A^{j}\bar B\,u_{k-j}$, a convolution with kernel $\bar K_j=C\bar A^j\bar B$. The two views are the same function: convolution (via FFT) for parallel training, recurrence for $O(1)$-per-token generation. Mamba's *input-dependent* parameters break time-invariance and so forfeit the convolution view, which is why it needs a parallel scan.`,
    },
    {
      kind: 'explain',
      title: 'The other quadratic: the KV cache',
      body: String.raw`When a transformer generates text, it stores the keys and values of every past token so it does not recompute them — the **KV cache**. Its size is
$$2\times n_{\text{layers}}\times n_{\text{heads}}\times d_{\text{head}}\times n_{\text{tokens}}\times \text{bytes}.$$
This is linear in the context, but the constant is brutal, and at long contexts the cache dominates GPU memory and makes generation **memory-bandwidth bound**: every token read requires sweeping the whole cache.

Two cheap architectural fixes are now standard. **Multi-query attention** (Shazeer 2019) shares a single key/value head across all query heads, cutting the cache by the number of heads. **Grouped-query attention** (Ainslie et al. 2023) is the compromise — say 8 key/value heads for 64 query heads — and keeps nearly all the quality. This is an inference-time concern, separate from the training-time $n^2$, and in deployed systems it is often the binding constraint.`,
    },
    {
      kind: 'multi',
      prompt: 'Which statements are correct? (Select all that apply.)',
      choices: [
        'FlashAttention reduces memory from O(n²) to O(n) while returning the same result as standard attention.',
        'A sliding-window-only pattern makes distant tokens reachable within a single layer.',
        'Linear attention lets autoregressive generation run at constant cost per token, independent of how much context has been seen.',
        'Grouped-query attention shrinks the KV cache by sharing key/value heads among query heads.',
      ],
      answers: [0, 2, 3],
      why: String.raw`FlashAttention is exact with linear memory; linear attention keeps a fixed-size running state, so each new token costs the same; GQA shares key/value projections. A window of width $w$ only reaches $w/2$ positions per layer, so tokens $n$ apart need about $2n/w$ **layers** — which is exactly why Longformer and BigBird add global and random links.`,
    },
    {
      kind: 'order',
      prompt: 'Order the steps FlashAttention takes for one block of queries.',
      steps: [
        'Load the query block into on-chip SRAM and initialize its running max, running sum and output accumulator',
        'Load the next block of keys and values into SRAM',
        'Compute the scores for just this tile and its local softmax statistics',
        'Rescale the accumulated output and sum to the new running maximum, then add this tile’s contribution',
        'After the last tile, divide the accumulator by the running sum and write the finished output back to HBM',
      ],
      why: 'The query block stays resident while key/value tiles stream past it. Only the three running statistics persist between tiles, so nothing of size n×n is ever written out — and a single division at the end completes the softmax.',
    },
    {
      kind: 'fill',
      prompt: String.raw`Attention costs $O(n^2d)$ in time and ___ in memory if implemented naively. FlashAttention keeps the result ___ while cutting memory traffic by tiling and an online softmax. Linear attention changes the function by replacing the ___ with a feature map, so the matrix products can be reassociated. Mamba makes its state-space parameters ___ , which costs it the convolution view but buys content-based selection.`,
      bank: ['$O(n^2)$', '$O(n)$', 'exact', 'approximate', 'softmax', 'residual connection', 'input-dependent', 'fixed'],
      answer: ['$O(n^2)$', 'exact', 'softmax', 'input-dependent'],
      why: String.raw`Storing the score matrix is $O(n^2)$; FlashAttention removes that storage without changing the answer. Reassociating $(QK^\top)V$ into $Q(K^\top V)$ is blocked precisely by the softmax, so linear attention replaces it. Mamba's selectivity comes from making $B$, $C$ and $\Delta$ depend on the input, which breaks time-invariance.`,
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- Attention is $O(n^2d)$ time and $O(n^2)$ memory; on GPUs the memory traffic usually bites first.
- **FlashAttention** is exact: tiling into SRAM, an online softmax, and recomputation in the backward pass give linear memory and large wall-clock speedups.
- **Sparse** attention computes a subset of scores. Window + global + random (BigBird) is $O(n)$ and still a universal approximator; a bare window needs many layers to span the sequence.
- **Linear attention** swaps $\exp(\mathbf q\cdot\mathbf k)$ for $\phi(\mathbf q)^\top\phi(\mathbf k)$, reassociates to $Q(K^\top V)$, and becomes an RNN with a $d\times d$ state — cheap, but weaker at sharp retrieval.
- **State-space models** (S4, Mamba) replace attention with a structured recurrence: convolution or scan for parallel training, $O(1)$ per token at inference. Hybrids with attention currently work best.
- At inference the binding constraint is often the **KV cache**; multi-query and grouped-query attention shrink it.`,
    },
  ],
  references: [
    { authors: 'T. Dao, D. Y. Fu, S. Ermon, A. Rudra & C. Ré', title: 'FlashAttention: Fast and Memory-Efficient Exact Attention with IO-Awareness', year: 2022, venue: 'NeurIPS', url: 'https://arxiv.org/abs/2205.14135' },
    { authors: 'A. Katharopoulos, A. Vyas, N. Pappas & F. Fleuret', title: 'Transformers are RNNs: Fast Autoregressive Transformers with Linear Attention', year: 2020, venue: 'ICML', url: 'https://arxiv.org/abs/2006.16236' },
    { authors: 'M. Zaheer et al.', title: 'Big Bird: Transformers for Longer Sequences', year: 2020, venue: 'NeurIPS', url: 'https://arxiv.org/abs/2007.14062' },
    { authors: 'A. Gu, K. Goel & C. Ré', title: 'Efficiently Modeling Long Sequences with Structured State Spaces', year: 2022, venue: 'ICLR', url: 'https://arxiv.org/abs/2111.00396' },
    { authors: 'A. Gu & T. Dao', title: 'Mamba: Linear-Time Sequence Modeling with Selective State Spaces', year: 2023, venue: 'arXiv:2312.00752', url: 'https://arxiv.org/abs/2312.00752' },
  ],
} satisfies LessonContent;
