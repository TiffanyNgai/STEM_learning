import type { LessonContent } from '../../types';

// A sparse MoE layer: a router sends each token to 2 of 5 experts; dashed experts stay idle for that token.
const expert = (x: number, y: number, t: string, on: boolean) =>
  `<rect x="${x - 26}" y="${y - 12}" width="52" height="24" rx="5" fill="var(--surface)" stroke="${on ? 'var(--c1)' : 'var(--muted)'}" stroke-width="${on ? 1.8 : 1}" stroke-dasharray="${on ? '' : '3 3'}"/><text x="${x}" y="${y + 4}" font-size="9" text-anchor="middle" fill="${on ? 'var(--c1)' : 'var(--muted)'}">${t}</text>`;
const MOE_SVG = (() => {
  const ys = [34, 68, 102, 136, 170];
  const on = [1, 3];
  let g = '';
  ys.forEach((y, i) => {
    g += expert(230, y, `expert ${i + 1}`, on.includes(i));
    if (on.includes(i)) {
      g += `<path d="M118,102 C160,102 170,${y} 202,${y}" fill="none" stroke="var(--c1)" stroke-width="1.5"/>`;
      g += `<path d="M258,${y} C282,${y} 286,140 290,120" fill="none" stroke="var(--c1)" stroke-width="1.2" opacity="0.7"/>`;
      g += `<text x="176" y="${y + (i === 1 ? -4 : 14)}" font-size="8" fill="var(--c1)">g=${i === 1 ? '0.7' : '0.3'}</text>`;
    } else {
      g += `<path d="M118,102 C160,102 170,${y} 202,${y}" fill="none" stroke="var(--grid)" stroke-width="1" stroke-dasharray="3 3"/>`;
    }
  });
  return `<svg viewBox="0 0 320 196" xmlns="http://www.w3.org/2000/svg">
<text x="8" y="12" font-size="9" fill="var(--muted)">one token enters · the router picks the top 2 of 5 experts</text>
<circle cx="24" cy="102" r="12" fill="var(--surface)" stroke="var(--c2)" stroke-width="1.4"/><text x="24" y="106" font-size="9" text-anchor="middle" fill="var(--c2)">x</text>
<line x1="36" y1="102" x2="60" y2="102" stroke="var(--muted)" stroke-width="1.2"/>
<rect x="60" y="88" width="58" height="28" rx="5" fill="var(--surface)" stroke="var(--c3)" stroke-width="1.4"/><text x="89" y="106" font-size="9" text-anchor="middle" fill="var(--c3)">router</text>
<text x="89" y="128" font-size="7.5" text-anchor="middle" fill="var(--muted)">softmax(W_g x)</text>
${g}
<circle cx="296" cy="102" r="12" fill="var(--surface)" stroke="var(--c1)" stroke-width="1.4"/><text x="296" y="106" font-size="9" text-anchor="middle" fill="var(--c1)">y</text>
<text x="160" y="190" font-size="8.5" text-anchor="middle" fill="var(--fg)">y = 0.7·E₂(x) + 0.3·E₄(x)   —  3 of 5 experts cost nothing for this token</text>
</svg>`;
})();

export default {
  cards: [
    {
      kind: 'explain',
      title: 'More parameters, same compute per token',
      body: String.raw`Scaling laws say bigger models are better, but in a dense network every parameter is multiplied for every token: double the parameters and you double the cost of each token, in training and at inference.

**Conditional computation** breaks that link. Keep a very large bank of parameters, but use only a small, *input-dependent* slice of it for each token. A **mixture of experts** (MoE) layer holds $N$ parallel sub-networks (the experts) and a small **router** that, for each token, picks $k\ll N$ of them.

The accounting is the point. With $N=64$ experts and $k=2$, the layer has 64× the parameters of a dense one, but each token touches only 2 — so the FLOPs per token roughly double, not multiply by 64. Capacity grows with $N$; compute grows with $k$.`,
    },
    {
      kind: 'widget',
      title: 'A sparse MoE layer',
      body: String.raw`The idea goes back to Jacobs, Jordan, Nowlan & Hinton (1991), who mixed local experts *densely* — every expert ran on every input. Shazeer et al. (2017) made it **sparse**, which is what makes it cheap:
$$\mathbf g=\operatorname{TopK}\big(\operatorname{softmax}(W_g\mathbf x)\big),\qquad \mathbf y=\sum_{i\in\text{top-}k} g_i\,E_i(\mathbf x).$$
$W_g$ is a single small matrix. Each expert $E_i$ is an ordinary feed-forward network — in a transformer, an MoE layer usually **replaces the FFN sublayer** (often in every other block), leaving attention dense. The gate values $g_i$ weight the chosen experts' outputs, and they are what gives the router a gradient: increasing $g_i$ for a helpful expert lowers the loss.

Shazeer et al. put up to **137 billion** parameters into MoE layers between LSTM layers and still beat dense baselines at *lower* computational cost.`,
      widget: { type: 'SvgDiagram', props: { svg: MOE_SVG } },
    },
    {
      kind: 'widget',
      title: 'The router is a softmax over experts',
      body: String.raw`The router scores every expert for this token and softmaxes. Only the top-$k$ scores survive; their gates are renormalized and everything else is skipped.

Drag the logits: when one expert dominates, top-1 and top-2 routing agree, and the second gate is nearly 0 — paying for a second expert buys little. When the scores are close, the token is genuinely ambiguous and a mixture helps. Lowering the temperature is what a *confident* router looks like; raising it is what an untrained one looks like at the start, before any specialization exists.`,
      widget: {
        type: 'MlSoftmaxBars',
        props: { logits: [2.4, 1.8, 0.2, -0.6], labels: ['E1', 'E2', 'E3', 'E4'], target: 0, showLoss: false },
        caption: 'Router probabilities for one token. In top-2 routing only the two tallest bars are computed at all.',
      },
    },
    {
      kind: 'numeric',
      prompt: String.raw`An MoE layer has 64 experts, each a feed-forward network with 2.1 million parameters, and routes each token to the top 2. How many parameters of this layer are **used** for one token, in millions? (Ignore the router.)`,
      answer: 4.2,
      tolerance: 0.05,
      why: String.raw`Only 2 experts run: $2\times2.1=4.2$ million, against $64\times2.1=134.4$ million stored. The layer holds 64× the parameters of a dense FFN while doing about 2× the work per token — 32× more parameters stored than used. Memory still has to hold all 134.4M, which is why MoE models are cheap in FLOPs but expensive in VRAM.`,
    },
    {
      kind: 'mcq',
      prompt: 'Why can a mixture-of-experts model have far more parameters than a dense model without a proportional increase in FLOPs per token?',
      choices: [
        'The experts share their weights, so the extra parameters are duplicates.',
        'Each token is routed to only k of the N experts, so the unselected experts are never evaluated for that token.',
        'Expert weights are stored at lower precision.',
        'The router removes the need for the attention sublayer.',
      ],
      answer: 1,
      why: String.raw`Sparsity in *which experts run*, decided per token, is the whole mechanism — the experts have independent weights (that is the point) and precision is a separate concern. Attention stays dense: MoE normally replaces only the feed-forward sublayer.`,
    },
    {
      kind: 'explain',
      title: 'The routing problem: everyone piles onto one expert',
      body: String.raw`Left alone, routing collapses. An expert that happens to start slightly better gets more tokens, trains faster, becomes better still, and attracts yet more — a self-reinforcing loop that ends with a handful of experts doing all the work and the rest untrained. Worse, the whole thing is **discrete**: a token either goes to an expert or it does not, so there is no gradient telling the router to spread out.

Shazeer et al. (2017) added two devices:

- **Noisy top-k gating**: add learned-scale Gaussian noise to the router logits before taking the top $k$, so the choice explores.
- An **auxiliary balancing loss** added to the training objective, penalizing uneven use of experts.

There is also a systems constraint. Experts live on different devices, and a device has fixed buffers, so each expert gets an **expert capacity** — roughly $(\text{tokens per batch}/N)\times$ a capacity factor (e.g. 1.25). Tokens beyond that are **dropped**: they skip the layer and pass through the residual connection unchanged. Over-capacity means wasted memory; under-capacity means dropped tokens.`,
    },
    {
      kind: 'explain',
      title: 'The Switch Transformer',
      body: String.raw`Fedus, Zoph & Shazeer (2022) simplified the recipe. Their claim, against the prevailing belief that $k\ge2$ was needed for the router to learn, was that **top-1 routing works** — one expert per token. That halves the routing compute and communication.

Their balancing loss, for $N$ experts and a batch $\mathcal B$, is
$$L_{\text{aux}}=\alpha\,N\sum_{i=1}^{N} f_i\,P_i,$$
where $f_i$ is the fraction of tokens actually dispatched to expert $i$ and $P_i$ is the mean router probability for expert $i$. The $f_i$ are not differentiable, but the $P_i$ are, so the gradient pushes probability away from overloaded experts. Under perfectly uniform routing $f_i=P_i=1/N$ and $L_{\text{aux}}=\alpha$ — its minimum. They use $\alpha=10^{-2}$: enough to balance, small enough not to fight the real loss.

Two more details that mattered: keep the **router in float32** even when everything else is bfloat16 (exponentials of close logits are fragile), and use a smaller initialization scale plus expert dropout when fine-tuning.

Results: about a **7× pretraining speedup** over T5-Base at matched FLOPs, and a scale-up to **1.6 trillion** parameters (Switch-C, 2048 experts). Modern open MoE models follow the same template — Mixtral 8×7B, for instance, has 8 experts with top-2 routing: about 47B parameters stored, roughly 13B active per token.`,
    },
    {
      kind: 'numeric',
      prompt: String.raw`A Switch layer has $N=4$ experts and $\alpha=0.01$. In one batch the dispatch fractions and the mean router probabilities are both $(0.7,\,0.1,\,0.1,\,0.1)$. Compute $L_{\text{aux}}=\alpha N\sum_i f_iP_i$. Give 4 decimals.`,
      answer: 0.0208,
      tolerance: 0.0002,
      why: String.raw`$\sum_i f_iP_i=0.49+0.01+0.01+0.01=0.52$, so $L_{\text{aux}}=0.01\times4\times0.52=0.0208$. Perfect balance would give $\sum_i f_iP_i=4\times(0.25)^2=0.25$ and $L_{\text{aux}}=0.01=\alpha$ exactly. The imbalance here costs about twice the minimum, and the gradient pushes router probability off the overloaded expert.`,
    },
    {
      kind: 'numeric',
      prompt: String.raw`A batch holds 4096 tokens and the layer has 16 experts, with a capacity factor of 1.25. How many tokens can a single expert accept before the rest are dropped?`,
      answer: 320,
      why: String.raw`Capacity $=(4096/16)\times1.25=256\times1.25=320$. The slack of 64 tokens above the perfectly balanced 256 absorbs mild imbalance. Raising the factor drops fewer tokens but wastes memory and compute on padding; lowering it does the reverse.`,
    },
    {
      kind: 'truefalse',
      prompt: 'The auxiliary load-balancing loss is needed because the top-k selection itself provides no gradient that would encourage spreading tokens across experts.',
      answer: true,
      why: String.raw`Top-$k$ is a discrete argmax-like operation: the loss gradient reaches the router only through the gate values $g_i$ of the experts that were *chosen*, so nothing pushes work towards an unused expert. The auxiliary term supplies that pressure through the differentiable probabilities $P_i$.`,
    },
    {
      kind: 'match',
      prompt: 'Match each MoE component to its role.',
      pairs: [
        ['Router (gating network)', 'Scores the experts for each token and selects the top k'],
        ['Auxiliary balancing loss', 'Penalizes uneven expert usage so no expert is starved'],
        ['Expert capacity factor', 'Sets how many tokens an expert may accept before the surplus is dropped'],
        ['Top-1 routing (Switch)', 'Sends each token to a single expert, halving routing compute'],
      ],
      why: 'The router makes the choice, the auxiliary loss shapes the distribution of choices, and the capacity factor is a hardware-driven cap on the consequences. Switch routing is the extreme k = 1 case.',
    },
    {
      kind: 'multi',
      prompt: 'Which are genuine costs or difficulties of sparse MoE models? (Select all that apply.)',
      choices: [
        'All expert parameters must be held in memory even though each token uses few of them.',
        'Routing tokens to experts on different devices adds all-to-all communication.',
        'Training can collapse onto a few experts unless balance is actively encouraged.',
        'The FLOPs per token grow in proportion to the total number of experts.',
      ],
      answers: [0, 1, 2],
      why: String.raw`Memory for all experts, cross-device communication, and routing collapse are the three real problems. FLOPs per token scale with $k$, the number of *selected* experts — that decoupling is the entire reason to build an MoE.`,
    },
    {
      kind: 'order',
      prompt: 'Order what happens to one token in a Switch-style MoE layer.',
      steps: [
        String.raw`The router computes logits $W_g\mathbf x$ and a softmax over the $N$ experts`,
        'The highest-scoring expert is selected, and the token is dispatched to the device holding it',
        'If that expert is already at capacity, the token is dropped and skips straight along the residual connection',
        String.raw`Otherwise the expert's feed-forward network runs and its output is scaled by the gate value $g$`,
        'The result is combined back into the residual stream, and the auxiliary balancing loss is accumulated for the batch',
      ],
      why: 'Routing decides before any expert compute happens, and the capacity check comes between dispatch and computation. The gate value multiplies the expert output, which is what lets the loss gradient reach the router.',
    },
    {
      kind: 'fill',
      prompt: String.raw`In a sparse MoE layer the total parameter count grows with the number of ___, while the FLOPs per token grow with ___. Without intervention routing ___ onto a few experts, so an auxiliary loss penalizing uneven use is added. The Switch Transformer showed that routing to ___ expert per token is enough.`,
      bank: ['experts', 'layers', 'k, the number selected', 'the batch size', 'collapses', 'converges', 'one', 'four'],
      answer: ['experts', 'k, the number selected', 'collapses', 'one'],
      why: String.raw`Capacity scales with $N$, compute with $k$ — that decoupling is the whole idea. Popular experts attract more tokens and improve faster, a rich-get-richer collapse that the balancing loss counteracts. Fedus et al. (2022) showed top-1 routing trains well, contradicting the earlier belief that $k\ge2$ was required.`,
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- MoE is **conditional computation**: many experts, few used per token. Parameters scale with $N$, FLOPs per token with $k$.
- A layer is $\mathbf y=\sum_{i\in\text{top-}k}g_i E_i(\mathbf x)$ with gates from $\operatorname{softmax}(W_g\mathbf x)$; in transformers it replaces the FFN sublayer, leaving attention dense.
- Dense mixtures date to Jacobs et al. (1991); Shazeer et al. (2017) made them sparse, with noisy top-$k$ gating and a balancing loss, at up to 137B parameters.
- Routing collapse is the central failure. The Switch Transformer's $L_{\text{aux}}=\alpha N\sum_i f_iP_i$ (with $\alpha=0.01$) is minimized at uniform usage.
- Expert **capacity** is a hardware cap; tokens over it are dropped and ride the residual connection.
- Switch showed top-1 routing works, gave ~7× the pretraining speed of T5-Base at matched FLOPs, and reached 1.6T parameters. MoE is now standard in large open models.
- The trade: cheap FLOPs, but all experts sit in memory and routing costs communication.`,
    },
  ],
  references: [
    { authors: 'N. Shazeer, A. Mirhoseini, K. Maziarz, A. Davis, Q. Le, G. Hinton & J. Dean', title: 'Outrageously Large Neural Networks: The Sparsely-Gated Mixture-of-Experts Layer', year: 2017, venue: 'ICLR', url: 'https://arxiv.org/abs/1701.06538' },
    { authors: 'W. Fedus, B. Zoph & N. Shazeer', title: 'Switch Transformers: Scaling to Trillion Parameter Models with Simple and Efficient Sparsity', year: 2022, venue: 'JMLR 23(120)', url: 'https://arxiv.org/abs/2101.03961' },
    { authors: 'R. A. Jacobs, M. I. Jordan, S. J. Nowlan & G. E. Hinton', title: 'Adaptive Mixtures of Local Experts', year: 1991, venue: 'Neural Computation 3(1), 79–87' },
    { authors: 'D. Lepikhin, H. Lee, Y. Xu, D. Chen, O. Firat, Y. Huang, M. Krikun, N. Shazeer & Z. Chen', title: 'GShard: Scaling Giant Models with Conditional Computation and Automatic Sharding', year: 2021, venue: 'ICLR', url: 'https://arxiv.org/abs/2006.16668' },
  ],
} satisfies LessonContent;
