import type { LessonContent } from '../../types';

// LSTM cell: the cell state c runs straight across the top, touched only by ⊙f and +i⊙g.
const gate = (x: number, y: number, t: string, col: string) =>
  `<rect x="${x - 17}" y="${y - 11}" width="34" height="22" rx="5" fill="var(--surface)" stroke="${col}" stroke-width="1.4"/><text x="${x}" y="${y + 4}" font-size="10" text-anchor="middle" fill="${col}">${t}</text>`;
const op = (x: number, y: number, t: string) =>
  `<circle cx="${x}" cy="${y}" r="9" fill="var(--surface)" stroke="var(--fg)" stroke-width="1.2"/><text x="${x}" y="${y + 4}" font-size="11" text-anchor="middle" fill="var(--fg)">${t}</text>`;
const ln = (x1: number, y1: number, x2: number, y2: number, col = 'var(--muted)', w = 1.2) =>
  `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${col}" stroke-width="${w}" marker-end="url(#lgA)"/>`;
const LSTM_SVG = `<svg viewBox="0 0 320 210" xmlns="http://www.w3.org/2000/svg">
<defs><marker id="lgA" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0L10,5L0,10z" fill="var(--muted)"/></marker></defs>
<rect x="34" y="14" width="252" height="150" rx="8" fill="none" stroke="var(--grid)" stroke-dasharray="4 3"/>
<text x="40" y="26" font-size="9" fill="var(--muted)">one LSTM cell, step t</text>
<text x="10" y="48" font-size="11" fill="var(--c1)">c₍t−1₎</text>
<line x1="34" y1="44" x2="91" y2="44" stroke="var(--c1)" stroke-width="2.4"/>
${op(100, 44, '⊙')}
<line x1="109" y1="44" x2="151" y2="44" stroke="var(--c1)" stroke-width="2.4"/>
${op(160, 44, '+')}
<line x1="169" y1="44" x2="286" y2="44" stroke="var(--c1)" stroke-width="2.4"/>
<text x="296" y="48" font-size="11" fill="var(--c1)">c₍t₎</text>
<text x="160" y="32" font-size="8.5" text-anchor="middle" fill="var(--c1)">the memory highway: no weight matrix on this line</text>
${gate(100, 110, 'σ  f', 'var(--c5)')}${gate(160, 110, 'σ  i', 'var(--c2)')}${gate(215, 110, 'tanh g', 'var(--c3)')}${gate(265, 110, 'σ  o', 'var(--c4)')}
${ln(100, 99, 100, 55)}${ln(160, 99, 160, 55)}
<line x1="215" y1="99" x2="215" y2="78" stroke="var(--c3)" stroke-width="1.2"/><line x1="215" y1="78" x2="178" y2="78" stroke="var(--c3)" stroke-width="1.2"/>${ln(178, 78, 169, 50, 'var(--c3)')}
<text x="196" y="74" font-size="8" text-anchor="middle" fill="var(--c3)">i⊙g</text>
${op(265, 68, '⊙')}
<line x1="265" y1="99" x2="265" y2="77" stroke="var(--c4)" stroke-width="1.2"/>
<line x1="240" y1="44" x2="240" y2="68" stroke="var(--c1)" stroke-width="1.2"/><line x1="240" y1="68" x2="256" y2="68" stroke="var(--c1)" stroke-width="1.2"/>
<text x="238" y="62" font-size="8" text-anchor="end" fill="var(--c1)">tanh</text>
${ln(274, 68, 300, 68)}<text x="305" y="72" font-size="10" fill="var(--fg)">h₍t₎</text>
<line x1="34" y1="150" x2="286" y2="150" stroke="var(--muted)" stroke-width="1.2"/>
${ln(100, 150, 100, 122)}${ln(160, 150, 160, 122)}${ln(215, 150, 215, 122)}${ln(265, 150, 265, 122)}
<text x="10" y="154" font-size="10" fill="var(--fg)">h₍t−1₎</text><text x="60" y="164" font-size="9" fill="var(--c2)">x₍t₎</text>
<line x1="60" y1="158" x2="60" y2="150" stroke="var(--muted)" stroke-width="1.2"/>
<circle r="4" fill="var(--c1)"><animateMotion path="M34,44 L286,44" dur="4s" repeatCount="indefinite"/></circle>
<text x="160" y="182" font-size="8.5" text-anchor="middle" fill="var(--fg)">c₍t₎ = f ⊙ c₍t−1₎ + i ⊙ g       h₍t₎ = o ⊙ tanh(c₍t₎)</text>
<text x="160" y="198" font-size="8" text-anchor="middle" fill="var(--muted)">each gate reads the same [h₍t−1₎, x₍t₎] through its own weights</text>
</svg>`;

export default {
  cards: [
    {
      kind: 'recall',
      title: 'Why vanilla RNNs forget',
      points: [
        String.raw`An RNN carries a state: $\mathbf h_t=\tanh(W_{hh}\mathbf h_{t-1}+W_{xh}\mathbf x_t+\mathbf b)$.`,
        String.raw`Backprop through time multiplies $T-t$ Jacobians $D_k W_{hh}$, so $\partial\mathbf h_T/\partial\mathbf h_t$ shrinks or grows **exponentially** with distance.`,
        'Clipping fixes exploding gradients; vanishing gradients need a different architecture.',
        'Every step overwrites the state through a weight matrix and a squashing nonlinearity.',
      ],
      link: 'ml/rnns',
    },
    {
      kind: 'explain',
      title: 'Add, do not overwrite',
      body: String.raw`Hochreiter & Schmidhuber (1997) traced the problem to the *multiplicative* update. Their fix: give the cell a memory slot whose default behaviour is to **stay the same**, and change it by **addition**:
$$c_t=c_{t-1}+(\text{something new}).$$
Along such a path $\partial c_t/\partial c_{t-1}=1$, so the gradient is carried back unchanged no matter how far. They called this the **constant error carousel**.

Pure addition would accumulate forever, so the cell learns small sigmoid-valued **gates** in $(0,1)$ that decide how much to let through. The result is the **Long Short-Term Memory** cell: memory that is long-lasting but still short-term in the sense of being state, not weights.`,
    },
    {
      kind: 'widget',
      title: 'Inside the LSTM cell',
      body: String.raw`Each step the cell holds two vectors: the **cell state** $\mathbf c_t$ (the memory) and the **hidden state** $\mathbf h_t$ (what the rest of the network sees). Writing $[\mathbf h_{t-1},\mathbf x_t]$ for the concatenated input, with $\sigma$ the logistic sigmoid and $\odot$ the element-wise product:
$$\mathbf f_t=\sigma(W_f[\mathbf h_{t-1},\mathbf x_t]+\mathbf b_f),\quad \mathbf i_t=\sigma(W_i[\cdot]+\mathbf b_i),\quad \mathbf o_t=\sigma(W_o[\cdot]+\mathbf b_o),$$
$$\mathbf g_t=\tanh(W_g[\cdot]+\mathbf b_g),\qquad \mathbf c_t=\mathbf f_t\odot\mathbf c_{t-1}+\mathbf i_t\odot\mathbf g_t,\qquad \mathbf h_t=\mathbf o_t\odot\tanh(\mathbf c_t).$$
**forget** $\mathbf f$ = how much of the old memory to keep; **input** $\mathbf i$ = how much of the candidate $\mathbf g$ to write; **output** $\mathbf o$ = how much of the memory to expose. Every gate is per-unit, so different units can keep different things for different lengths of time.`,
      widget: { type: 'SvgDiagram', props: { svg: LSTM_SVG }, caption: 'The green line is the whole point: the memory crosses the cell without passing through any weight matrix.' },
    },
    {
      kind: 'match',
      prompt: 'Match each LSTM gate to its job, reading a long book one sentence at a time.',
      pairs: [
        [String.raw`forget gate $\mathbf f_t$`, 'Chapter ended — erase the slot holding the old location'],
        [String.raw`input gate $\mathbf i_t$`, 'A new character was introduced — write her name into memory'],
        [String.raw`candidate $\mathbf g_t$`, 'What the new content *would* be if written (a tanh vector in (−1,1))'],
        [String.raw`output gate $\mathbf o_t$`, 'The next word must agree in gender — expose that part of memory now'],
      ],
      why: String.raw`$\mathbf f$ and $\mathbf i$ control the *memory*: what to erase and what to add. $\mathbf g$ is only the proposed content, not a gate. $\mathbf o$ controls *reading*: a fact can sit in $\mathbf c_t$ for many steps while $\mathbf o$ keeps it hidden, then be released when it is needed.`,
    },
    {
      kind: 'explain',
      title: 'The gradient along the memory path',
      body: String.raw`Differentiate the memory update, holding the gates fixed:
$$\frac{\partial \mathbf c_t}{\partial \mathbf c_{t-1}}=\operatorname{diag}(\mathbf f_t).$$
Going $k$ steps back multiplies **element-wise** by the forget gates, $\prod_{j}f_j$, with no weight matrix and no saturating derivative in the way. If a unit keeps $f\approx0.99$, then over 100 steps $0.99^{100}\approx0.37$ — the signal survives. The same unit with a vanilla RNN factor of $0.9$ would give $0.9^{100}\approx2.7\times10^{-5}$.

Two caveats. First, this is only the *direct* path; gradients also flow through the gates themselves, which does involve weights. Second, if the network learns $f\approx0$ the memory is deliberately erased, and the gradient stops — which is the correct behaviour, not a bug.

A practical trick (Jozefowicz et al. 2015): initialize $\mathbf b_f$ to +1 or +2 so gates start near 1 and the cell begins life remembering.`,
    },
    {
      kind: 'widget',
      title: 'Forget gates versus a weight matrix',
      body: String.raw`Red: the backward signal in a 32-unit vanilla RNN. Green: the LSTM's direct cell-state path $\prod_j\mathbf f_j$, with forget gates $\sigma(b_f+\xi)$ drawn per unit and step.

1. Press **LSTM cell path** with $b_f=3$ (mean $f\approx0.95$): after 50 steps the LSTM path is still around $10^{-2}$, while the RNN is near $10^{-9}$.
2. Drag $b_f$ to 5 ($f\approx0.993$): the green curve barely falls at all.
3. Drag $b_f$ to 0 ($f\approx0.5$): gating alone does not help — the cell must *learn* to keep its gates open.`,
      widget: { type: 'MlRnnGradNorm', props: { rho: 0.9, steps: 50, activation: 'tanh', showLstm: true, forgetBias: 3 } },
    },
    {
      kind: 'truefalse',
      prompt: 'The LSTM cell state can only change by addition and element-wise scaling — no weight matrix is applied to it on its way from step t−1 to step t.',
      answer: true,
      why: String.raw`$\mathbf c_t=\mathbf f_t\odot\mathbf c_{t-1}+\mathbf i_t\odot\mathbf g_t$. The weight matrices act on $[\mathbf h_{t-1},\mathbf x_t]$ to produce the gates and the candidate, never on $\mathbf c_{t-1}$ itself. That is exactly what makes $\partial\mathbf c_t/\partial\mathbf c_{t-1}$ a diagonal matrix of gate values.`,
    },
    {
      kind: 'numeric',
      prompt: String.raw`An LSTM unit holds its forget gate at $f=0.98$ and writes nothing new. By what factor has the stored value (and the gradient along the cell path) shrunk after 100 steps? Give $0.98^{100}$ to 3 decimals.`,
      answer: 0.133,
      tolerance: 0.002,
      why: String.raw`$0.98^{100}=e^{100\ln 0.98}=e^{-2.02}\approx0.133$. Even a 2% leak per step costs a factor of about 7.5 over 100 steps — but that is survivable, unlike the $10^{-5}$ of a vanilla RNN with factor $0.9$. Gates very close to 1 are what buy genuinely long memory.`,
    },
    {
      kind: 'explain',
      title: 'A short history (and the forget gate)',
      body: String.raw`The 1997 paper introduced the constant error carousel with **input and output gates only** — the cell state was never reset. Gers, Schmidhuber & Cummins (2000) added the **forget gate**, which turned out to be essential on continual streams; the "LSTM" everyone uses today is that version. Gers et al. (2000) also added *peephole* connections, letting the gates see $\mathbf c_{t-1}$; these are optional and often dropped.

Greff et al. (2017) compared eight variants on speech, handwriting and music and found that the forget gate and the output activation $\tanh(\mathbf c_t)$ matter most, while peepholes and several other extras can be removed with no real loss. LSTMs went on to power Google's production neural machine translation (Wu et al. 2016) before transformers took over.`,
    },
    {
      kind: 'explain',
      title: 'The GRU: the same idea with two gates',
      body: String.raw`Cho et al. (2014) introduced the **gated recurrent unit** while building an RNN encoder–decoder for machine translation. It keeps the additive memory but drops the separate cell state and merges forget with input:
$$\mathbf z_t=\sigma(W_z[\mathbf h_{t-1},\mathbf x_t]),\qquad \mathbf r_t=\sigma(W_r[\mathbf h_{t-1},\mathbf x_t]),$$
$$\tilde{\mathbf h}_t=\tanh\big(W[\,\mathbf r_t\odot\mathbf h_{t-1},\ \mathbf x_t\,]\big),\qquad \mathbf h_t=\mathbf z_t\odot\mathbf h_{t-1}+(1-\mathbf z_t)\odot\tilde{\mathbf h}_t.$$
The **update gate** $\mathbf z$ interpolates between keeping the old state and taking the new candidate — one dial instead of two. The **reset gate** $\mathbf r$ decides how much of the past the candidate may look at; with $\mathbf r\approx0$ the unit behaves as if the sequence started here.

> Conventions differ: many libraries write $\mathbf h_t=(1-\mathbf z)\odot\mathbf h_{t-1}+\mathbf z\odot\tilde{\mathbf h}$, which just flips the meaning of $\mathbf z$. Always check which one a codebase uses.

A GRU has 3 weight blocks where an LSTM has 4, so about **3/4** of the parameters and compute. Greff et al. (2017) and Chung et al. (2014) found the two perform comparably on most tasks; the GRU is often preferred when data or compute is tight.`,
    },
    {
      kind: 'numeric',
      prompt: String.raw`An LSTM layer has hidden size $n=200$ and input size $d=300$. Each of its four blocks has a weight matrix of shape $n\times(n+d)$ plus a bias of size $n$. How many parameters in total?`,
      answer: 400800,
      why: String.raw`One block: $200\times500+200=100{,}200$. Four blocks: $4\times100{,}200=400{,}800$. A GRU of the same sizes uses three blocks, $300{,}600$ — exactly 3/4 as many. This is the usual reason to reach for a GRU first.`,
    },
    {
      kind: 'mcq',
      prompt: 'What is the main structural difference between a GRU and an LSTM?',
      choices: [
        'A GRU has no additive path, so its gradients vanish like a vanilla RNN.',
        'A GRU keeps a single state vector and uses one update gate to trade off keeping versus writing, instead of a separate cell state with independent forget and input gates.',
        'A GRU replaces all sigmoids with ReLUs.',
        'A GRU processes the sequence backwards as well as forwards.',
      ],
      answer: 1,
      why: String.raw`The GRU still has the additive form $\mathbf h_t=\mathbf z\odot\mathbf h_{t-1}+(1-\mathbf z)\odot\tilde{\mathbf h}$, which is what preserves gradients; it simply ties "how much to forget" to "how much to write" and exposes the whole state. Its gates are sigmoids, and running a sequence in both directions is a **bidirectional** RNN — an orthogonal choice that applies to either cell.`,
    },
    {
      kind: 'fill',
      prompt: String.raw`In an LSTM, $\mathbf c_t=\mathbf f_t\odot\mathbf c_{t-1}+\mathbf i_t\odot\mathbf g_t$, so the direct gradient path multiplies by the ___ gate at each step. Setting its bias to a positive value makes the cell start out ___ information. A GRU merges the forget and input gates into one ___ gate.`,
      bank: ['forget', 'output', 'reset', 'keeping', 'discarding', 'update'],
      answer: ['forget', 'keeping', 'update'],
      why: String.raw`$\partial\mathbf c_t/\partial\mathbf c_{t-1}=\operatorname{diag}(\mathbf f_t)$, so the forget gate controls the memory path. A positive $\mathbf b_f$ pushes $\sigma(\cdot)$ towards 1, i.e. keep. In the GRU the single update gate $\mathbf z$ does both jobs; its reset gate instead controls how much past the candidate sees.`,
    },
    {
      kind: 'multi',
      prompt: 'Which of these are genuine limitations of LSTMs and GRUs? (Select all that apply.)',
      choices: [
        'Each step must wait for the previous one, so training cannot be parallelized along the sequence.',
        'All information about the past must be squeezed into one fixed-size state vector.',
        'They cannot represent dependencies longer than about 10 steps.',
        'Reaching a token 500 steps back still requires passing through 500 sequential updates.',
      ],
      answers: [0, 1, 3],
      why: String.raw`Sequential dependence and a fixed-size bottleneck are real, and distance still costs $O(\text{distance})$ steps. But gated cells routinely learn dependencies of hundreds of steps — LSTMs ran production machine translation. [Attention](@ml/attention-transformers) attacks all three: it connects any two positions in one step and runs them in parallel.`,
    },
    {
      kind: 'order',
      prompt: 'Order the computations inside one LSTM step.',
      steps: [
        String.raw`Concatenate the previous hidden state $\mathbf h_{t-1}$ with the input $\mathbf x_t$`,
        String.raw`Compute the three gates $\mathbf f_t,\mathbf i_t,\mathbf o_t$ with sigmoids and the candidate $\mathbf g_t$ with a tanh`,
        String.raw`Scale the old memory: $\mathbf f_t\odot\mathbf c_{t-1}$`,
        String.raw`Add the gated candidate to get the new memory $\mathbf c_t=\mathbf f_t\odot\mathbf c_{t-1}+\mathbf i_t\odot\mathbf g_t$`,
        String.raw`Read out $\mathbf h_t=\mathbf o_t\odot\tanh(\mathbf c_t)$ and pass it on`,
      ],
      why: 'The gates are all functions of the same concatenated input, so they are computed together (in practice as one matrix multiply). Erasing then writing produces the new cell state, and only then can the output gate read it.',
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- The gradient problem comes from *multiplicative* state updates. Gated cells make the default update **additive**.
- LSTM: $\mathbf c_t=\mathbf f_t\odot\mathbf c_{t-1}+\mathbf i_t\odot\mathbf g_t$, $\mathbf h_t=\mathbf o_t\odot\tanh(\mathbf c_t)$. The cell state meets no weight matrix, so $\partial\mathbf c_t/\partial\mathbf c_{t-1}=\operatorname{diag}(\mathbf f_t)$.
- Gates are learned, per-unit and input-dependent: each unit chooses its own timescale. Initialize $\mathbf b_f>0$ to start out remembering.
- The forget gate came in 2000, not 1997; peepholes are optional.
- GRU: one state, update gate $\mathbf z$ plus reset gate $\mathbf r$, ~3/4 of an LSTM's parameters, comparable accuracy.
- Both remain **sequential** and funnel the past through a fixed-size state — the two limits attention removes.`,
    },
  ],
  references: [
    { authors: 'S. Hochreiter & J. Schmidhuber', title: 'Long Short-Term Memory', year: 1997, venue: 'Neural Computation 9(8), 1735–1780' },
    { authors: 'F. A. Gers, J. Schmidhuber & F. Cummins', title: 'Learning to Forget: Continual Prediction with LSTM', year: 2000, venue: 'Neural Computation 12(10), 2451–2471' },
    { authors: 'K. Cho, B. van Merriënboer, C. Gulcehre, D. Bahdanau, F. Bougares, H. Schwenk & Y. Bengio', title: 'Learning Phrase Representations using RNN Encoder–Decoder for Statistical Machine Translation', year: 2014, venue: 'EMNLP', url: 'https://arxiv.org/abs/1406.1078' },
    { authors: 'K. Greff, R. K. Srivastava, J. Koutník, B. R. Steunebrink & J. Schmidhuber', title: 'LSTM: A Search Space Odyssey', year: 2017, venue: 'IEEE Transactions on Neural Networks and Learning Systems 28(10)', url: 'https://arxiv.org/abs/1503.04069' },
    { authors: 'R. Jozefowicz, W. Zaremba & I. Sutskever', title: 'An Empirical Exploration of Recurrent Network Architectures', year: 2015, venue: 'ICML' },
  ],
} satisfies LessonContent;
