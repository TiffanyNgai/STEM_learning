import type { LessonContent } from '../../types';

const totterSvg = `<svg viewBox="0 0 320 150" xmlns="http://www.w3.org/2000/svg">
<g font-size="9" fill="var(--fg)" text-anchor="middle">
<text x="80" y="14" fill="var(--muted)">undirected: messages can walk back</text>
<text x="240" y="14" fill="var(--muted)">directed bonds: no u-turns</text>
</g>
<g stroke="var(--muted)" stroke-width="1.4">
<line x1="30" y1="80" x2="80" y2="80"/><line x1="80" y1="80" x2="130" y2="80"/>
<line x1="190" y1="80" x2="240" y2="80"/><line x1="240" y1="80" x2="290" y2="80"/>
</g>
<g fill="var(--surface)" stroke="var(--fg)" stroke-width="1">
<circle cx="30" cy="80" r="11"/><circle cx="80" cy="80" r="11"/><circle cx="130" cy="80" r="11"/>
<circle cx="190" cy="80" r="11"/><circle cx="240" cy="80" r="11"/><circle cx="290" cy="80" r="11"/>
</g>
<g font-size="9" fill="var(--fg)" text-anchor="middle">
<text x="30" y="83">A</text><text x="80" y="83">B</text><text x="130" y="83">C</text>
<text x="190" y="83">A</text><text x="240" y="83">B</text><text x="290" y="83">C</text>
</g>
<path d="M30,62 Q55,40 80,62" fill="none" stroke="var(--c5)" stroke-width="1.6"/>
<path d="M80,62 Q55,40 30,62" fill="none" stroke="var(--c5)" stroke-width="1.6" stroke-dasharray="3 2"/>
<circle cx="55" cy="47" r="3.2" fill="var(--c5)">
<animateMotion dur="2.2s" repeatCount="indefinite" path="M-25,15 Q0,-7 25,15 Q0,-7 -25,15"/></circle>
<text x="55" y="34" font-size="8.5" fill="var(--c5)" text-anchor="middle">A→B→A</text>
<path d="M190,62 Q215,40 240,62" fill="none" stroke="var(--c1)" stroke-width="1.6"/>
<path d="M240,62 Q265,40 290,62" fill="none" stroke="var(--c1)" stroke-width="1.6"/>
<circle cx="215" cy="47" r="3.2" fill="var(--c1)">
<animateMotion dur="2.2s" repeatCount="indefinite" path="M-25,15 Q0,-7 25,15 L75,15"/></circle>
<text x="240" y="34" font-size="8.5" fill="var(--c1)" text-anchor="middle">A→B→C</text>
<text x="160" y="118" font-size="8.5" fill="var(--muted)" text-anchor="middle">A message arriving at B along A→B is not sent back to A.</text>
<text x="160" y="132" font-size="8.5" fill="var(--muted)" text-anchor="middle">That is the D-MPNN fix: state lives on directed bonds, not atoms.</text>
</svg>`;

export default {
  cards: [
    {
      kind: 'explain',
      title: 'Why hand-made features eventually run out',
      body: String.raw`An ECFP bit answers a fixed question: "is this exact circular environment present?" It was designed before anyone knew what your assay measures, and its hashing is fixed once and for all.

A **message-passing neural network** (MPNN) throws that away and *learns* the features. It keeps the molecular graph — atoms as nodes, bonds as edges — and learns, by gradient descent on your labels, what each atom should tell its neighbours.

The payoff is task-specific representations. The price is data: you are now fitting thousands of parameters instead of splitting on pre-made bits.`,
    },
    {
      kind: 'recall',
      title: 'Graph neural networks (from ML)',
      points: [
        'A GNN updates each node\'s vector from its own vector and its neighbours\' — the same learned function everywhere.',
        '**Permutation equivariance**: relabel the nodes and the outputs are relabelled identically; a graph-level **readout** (sum/mean/max) makes the output permutation *invariant*.',
        'Stacking $T$ layers gives each node a **receptive field** of $T$ hops.',
        'Too many layers and all nodes converge to the same vector — **over-smoothing**.',
      ],
      link: 'ml/gnns',
    },
    {
      kind: 'explain',
      title: 'The MPNN framework',
      body: String.raw`Gilmer et al. (ICML 2017) showed that a whole family of chemistry graph models are the same algorithm with different blanks filled in. Each atom $v$ carries a hidden vector $h_v^t$. For $T$ rounds:

$$m_v^{t+1} = \sum_{w \in N(v)} M_t\!\left(h_v^{t}, h_w^{t}, e_{vw}\right), \qquad h_v^{t+1} = U_t\!\left(h_v^{t}, m_v^{t+1}\right)$$

- $N(v)$ = atoms bonded to $v$; $e_{vw}$ = features of the bond between them.
- $M_t$ is the **message function**, $U_t$ the **update function** — both small neural networks, shared across all atoms.
- Finally a **readout** $\hat y = R(\{h_v^{T}\})$ pools all atom vectors into one molecule-level prediction.

Message, update, readout. Every model in this lesson is a choice of those three.`,
    },
    {
      kind: 'widget',
      title: 'Watch one molecule think',
      body: 'Each atom starts as a one-hot element vector (the coloured bar beneath it). Press **Pass messages** to run one round: every atom sums its neighbours\' vectors and updates. Tap an atom to ring everything it can "see" after t rounds.',
      widget: {
        type: 'DrugMessagePassing',
        props: { molecule: 'paracetamol', steps: 0, selected: 3 },
        caption: 'The update here is a fixed "add the neighbours, renormalise" — in a real MPNN it is a learned network. Note two things: after $t$ rounds an atom\'s vector depends on exactly the atoms within $t$ bonds, and by $t = 4$ the vectors are all drifting towards each other (over-smoothing).',
      },
    },
    {
      kind: 'mcq',
      prompt: 'After 3 rounds of message passing, an atom\'s hidden vector can depend on…',
      choices: [
        'only its bonded neighbours',
        'every atom within 3 bonds of it',
        'every atom in the molecule, always',
        'the 3 nearest atoms in 3D space',
      ],
      answer: 1,
      why: 'Information travels one bond per round, so after $T$ rounds the receptive field is the $T$-hop neighbourhood. It reaches the whole molecule only if the molecule is small enough that every atom is within 3 bonds; and a plain MPNN uses the bond graph, not 3D distances.',
    },
    {
      kind: 'explain',
      title: 'Readout: turning atoms into a molecule',
      body: String.raw`The readout must give the same answer however the atoms happen to be numbered, so it has to be a **permutation-invariant** function of the set of atom vectors. Sum and mean both qualify.

The choice matters chemically. A **sum** grows with molecular size, which suits extensive properties like atomisation energy; a **mean** does not, which suits intensive ones like logP. Gilmer et al. used a learned, attention-like **set2set** readout and found it beat plain summation on quantum targets.

A common practical trick: concatenate the pooled learned vector with a few hundred fixed RDKit descriptors before the final layers, so the network does not have to rediscover molecular weight.`,
    },
    {
      kind: 'truefalse',
      prompt: 'Replacing the sum over neighbours with a list of neighbour vectors in a fixed order would keep the model permutation-invariant.',
      answer: false,
      why: 'A list imposes an order, so renumbering the atoms would change the input and hence the prediction — the same molecule could get two different answers. Invariance is exactly why aggregation uses order-free operations like sum, mean or max.',
    },
    {
      kind: 'explain',
      title: 'Chemprop: directed message passing',
      body: String.raw`Yang et al. (JCIM 2019) pointed out a flaw in atom-centred message passing: the message atom B sends to A includes what A told B one round earlier. Information **totters** back and forth, so an atom's vector double-counts its own history.

Their **D-MPNN** (directed MPNN, shipped as **Chemprop**) puts the hidden state on **directed bonds** instead of atoms. The state $h_{vw}$ of the bond $v\to w$ is updated from all incoming bond states at $v$ *except* the reverse bond $w\to v$:

$$h_{vw}^{t+1} = \tau\!\left(h_{vw}^{0} + W\!\!\sum_{u \in N(v)\setminus w} h_{uv}^{t}\right)$$

No u-turns. Atom vectors are reconstructed at the end by summing the incoming bond states, then pooled as usual.`,
      widget: { type: 'SvgDiagram', props: { svg: totterSvg }, caption: 'Tottering (left) versus directed messages (right). The paper also showed that adding global RDKit descriptors to the learned representation improved results on most datasets.' },
    },
    {
      kind: 'match',
      prompt: 'Match each piece of the MPNN framework to its job.',
      pairs: [
        ['Message function $M_t$', 'Builds what a neighbour sends, using the bond features'],
        ['Update function $U_t$', 'Combines an atom\'s own state with the messages it received'],
        ['Readout $R$', 'Pools all atom vectors into one molecule-level prediction'],
        ['Number of rounds $T$', 'Sets how many bonds away information can travel'],
      ],
      why: 'Gilmer et al.\'s contribution was showing that many published chemistry GNNs differ only in how these four blanks are filled.',
    },
    {
      kind: 'explain',
      title: 'Does it beat the baseline?',
      body: String.raw`Honestly: sometimes.

- Gilmer et al. trained MPNNs on **QM9** (about 134,000 small molecules with DFT-computed properties) and reached chemical accuracy on 11 of the 13 targets. With 130k noise-free labels from a deterministic simulator, learned representations win easily.
- Yang et al. benchmarked the D-MPNN across a wide range of public and proprietary datasets and found it matched or beat fingerprint baselines **when the dataset was large enough** — and reported that careful baselines are much stronger than earlier papers had suggested.
- On small, noisy medicinal-chemistry sets of a few hundred compounds, fingerprints plus a random forest frequently still win (Jiang et al. 2021).

Rule of thumb: thousands of consistent labels favour the MPNN; hundreds of noisy ones favour the baseline.`,
    },
    {
      kind: 'numeric',
      prompt: String.raw`A molecule has 20 heavy atoms and 21 bonds. How many directed bond states does a D-MPNN maintain for it?`,
      answer: 42,
      why: 'Every bond is used in both directions, so the number of directed edges is twice the number of bonds: $2 \\times 21 = 42$. The atom count is a red herring — in a D-MPNN the hidden states live on directed bonds, not atoms.',
    },
    {
      kind: 'explain',
      title: 'Halicin: the loudest success story',
      body: String.raw`Stokes et al. (Cell 2020) trained a Chemprop-style D-MPNN on about 2,300 molecules screened for growth inhibition of *E. coli*, then used it to rank the Drug Repurposing Hub (~6,100 molecules) and later a subset of ZINC15 (about 10⁸ compounds).

The top-ranked repurposing candidate was **SU3327**, a molecule developed as a c-Jun N-terminal kinase inhibitor and structurally unlike known antibiotics. Renamed **halicin**, it killed a broad range of resistant bacteria *in vitro*, cleared an *Acinetobacter baumannii* wound infection in mice, and acts by dissipating the pH gradient across the bacterial membrane rather than by any classical antibiotic mechanism.

What made it work: a **phenotypic** screen (whole-cell growth, no target needed), a consistent in-house assay, and a prediction that only had to be good enough to put a surprising molecule near the top of a list that humans then tested.`,
    },
    {
      kind: 'multi',
      prompt: 'Which features of the halicin project made deep learning a reasonable choice?',
      choices: [
        'Labels came from one consistent in-house assay rather than pooled literature values',
        'The task was to *rank* a huge library so humans could test the top few',
        'The model was expected to be right about every compound it scored',
        'A whole-cell phenotypic readout meant no target structure or mechanism was needed',
      ],
      answers: [0, 1, 3],
      why: 'Consistent labels, a ranking objective with cheap human verification, and a target-free readout all suit a data-driven model. No ranking model is right about every compound — the project succeeded precisely because only the top of the list was acted on.',
    },
    {
      kind: 'fill',
      prompt: 'In the MPNN framework, the ___ function builds what a neighbour sends and the ___ function pools atom vectors into one molecule-level vector; Chemprop avoids tottering by putting hidden states on directed ___.',
      bank: ['message', 'readout', 'bonds', 'update', 'atoms', 'rings'],
      answer: ['message', 'readout', 'bonds'],
      why: 'Message → update → readout is the three-step skeleton; the D-MPNN\'s distinguishing choice is to carry state on directed bonds so that a message is never sent straight back where it came from.',
    },
    {
      kind: 'order',
      prompt: 'Order one forward pass of a Chemprop-style model.',
      steps: [
        'Build the molecular graph and compute atom and bond feature vectors',
        'Initialise a hidden state for each directed bond from its atom and bond features',
        'Repeat T times: update each directed bond state from the incoming bond states, excluding the reverse bond',
        'Sum the incoming bond states at each atom to get atom vectors',
        'Pool the atom vectors (and optionally concatenate global descriptors) into a molecule vector',
        'Pass the molecule vector through a feed-forward network to get the prediction',
      ],
      why: 'Directed bond states are the whole point, so they are initialised and updated first; atom vectors are reconstructed only at the end, just before pooling and the final network.',
    },
    {
      kind: 'widget',
      title: 'Over-smoothing, in one widget',
      body: 'Switch to aspirin and press **Pass messages** four times, watching the bars. Early rounds sharpen the differences between atoms; late rounds blur them together.',
      widget: { type: 'DrugMessagePassing', props: { molecule: 'aspirin', steps: 2, selected: 9 }, caption: 'This is why practical MPNNs use only about 3–6 rounds: deeper is not better once every atom\'s vector looks like every other\'s.' },
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- An MPNN **learns** molecular features instead of using fixed fingerprint bits.
- The framework (Gilmer et al. 2017) is three learned pieces: **message** $M_t$, **update** $U_t$, **readout** $R$, run for $T$ rounds.
- After $T$ rounds an atom sees exactly its $T$-hop neighbourhood; too many rounds cause **over-smoothing**.
- The readout must be permutation-invariant (sum/mean/attention); sum suits extensive properties, mean intensive ones.
- **Chemprop**'s D-MPNN (Yang et al. 2019) carries state on **directed bonds** to stop messages tottering back, and concatenates global descriptors.
- MPNNs beat fingerprint baselines when data is plentiful and consistent (QM9, the halicin screen); on a few hundred noisy points, the baseline often still wins.`,
    },
  ],
  references: [
    { authors: 'Gilmer, J., Schoenholz, S. S., Riley, P. F., Vinyals, O., Dahl, G. E.', title: 'Neural message passing for quantum chemistry', year: 2017, venue: 'Proc. ICML (PMLR 70, 1263–1272)' },
    { authors: 'Yang, K., Swanson, K., Jin, W., et al.', title: 'Analyzing learned molecular representations for property prediction', year: 2019, venue: 'J. Chem. Inf. Model. 59, 3370–3388' },
    { authors: 'Stokes, J. M., Yang, K., Swanson, K., et al.', title: 'A deep learning approach to antibiotic discovery', year: 2020, venue: 'Cell 180, 688–702' },
    { authors: 'Duvenaud, D., Maclaurin, D., Aguilera-Iparraguirre, J., et al.', title: 'Convolutional networks on graphs for learning molecular fingerprints', year: 2015, venue: 'Proc. NeurIPS 28' },
    { authors: 'Jiang, D., Wu, Z., Hsieh, C.-Y., et al.', title: 'Could graph neural networks learn better molecular representation for drug discovery? A comparison study of descriptor-based and graph-based models', year: 2021, venue: 'J. Cheminform. 13, 12' },
  ],
} satisfies LessonContent;
