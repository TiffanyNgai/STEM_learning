import type { LessonContent } from '../../types';

const dataSvg = `<svg viewBox="0 0 320 150" xmlns="http://www.w3.org/2000/svg">
<text x="160" y="13" font-size="9" fill="var(--muted)" text-anchor="middle">the asymmetry that motivates pretraining</text>
<rect x="24" y="26" width="120" height="96" rx="5" fill="var(--c2)" fill-opacity="0.2" stroke="var(--c2)"/>
<text x="84" y="46" font-size="9.5" fill="var(--fg)" text-anchor="middle">molecules</text>
<text x="84" y="68" font-size="15" font-weight="700" fill="var(--c2)" text-anchor="middle">10⁸–10⁹</text>
<text x="84" y="86" font-size="8" fill="var(--muted)" text-anchor="middle">PubChem, ZINC,</text>
<text x="84" y="97" font-size="8" fill="var(--muted)" text-anchor="middle">enumerated libraries</text>
<text x="84" y="113" font-size="8" fill="var(--muted)" text-anchor="middle">free, no labels</text>
<rect x="176" y="26" width="120" height="96" rx="5" fill="var(--c5)" fill-opacity="0.2" stroke="var(--c5)"/>
<text x="236" y="46" font-size="9.5" fill="var(--fg)" text-anchor="middle">labels for your assay</text>
<text x="236" y="68" font-size="15" font-weight="700" fill="var(--c5)" text-anchor="middle">10²–10⁴</text>
<text x="236" y="86" font-size="8" fill="var(--muted)" text-anchor="middle">measured in your lab,</text>
<text x="236" y="97" font-size="8" fill="var(--muted)" text-anchor="middle">weeks per batch</text>
<text x="236" y="113" font-size="8" fill="var(--muted)" text-anchor="middle">expensive, noisy</text>
<text x="160" y="140" font-size="8.5" fill="var(--muted)" text-anchor="middle">Pretraining asks: can the free pile teach us something about the expensive one?</text>
</svg>`;

export default {
  cards: [
    {
      kind: 'explain',
      title: 'Millions of molecules, hundreds of labels',
      body: String.raw`Every project in this unit has run into the same wall: labels are scarce. A good in-house ADMET dataset is a few thousand compounds; a potency series is a few hundred.

Meanwhile, catalogues of molecular *structures* are effectively free. PubChem holds over 100 million compounds; enumerated make-on-demand libraries run into the billions.

**Self-supervised pretraining** tries to convert the free pile into an advantage: learn a general-purpose molecular representation from unlabelled structures, then **fine-tune** it on your small labelled set. It is the recipe that transformed language and vision. Chemistry has been a harder customer.`,
      widget: { type: 'SvgDiagram', props: { svg: dataSvg }, caption: 'The ratio is roughly a million to one — but only if the unlabelled molecules actually carry information about your property.' },
    },
    {
      kind: 'recall',
      title: 'Self-supervised learning (from ML)',
      points: [
        'Make a **pretext task** whose labels come free from the data itself — predict a hidden part from the rest.',
        '**Masked modelling**: hide tokens or features and reconstruct them.',
        '**Contrastive learning**: two augmented views of the same item should embed close together; different items far apart.',
        'The pretrained encoder is then **fine-tuned** (or frozen and used as a feature extractor) on the small labelled task.',
      ],
      link: 'ml/self-supervised-learning',
    },
    {
      kind: 'explain',
      title: 'Chemical language models',
      body: String.raw`A SMILES string is text, so the entire language-model toolkit applies directly.

**Tokenisation** must respect chemistry: \`Cl\` is one atom, not a carbon followed by an L, and bracketed atoms like \`[nH+]\` are single tokens. Standard SMILES tokenisers use a regular expression that keeps two-letter elements, bracket expressions and ring-closure digits intact.

**ChemBERTa** (Chithrananda et al. 2020) took RoBERTa, a masked-language-model transformer, and trained it on 10 million PubChem SMILES: hide 15% of the tokens, predict them from the rest. **ChemBERTa-2** scaled to 77 million molecules and added a multi-task regression pretext task, predicting 200 computed properties alongside the masked tokens.

One chemistry-specific trick: the same molecule has many valid SMILES depending on where you start the walk. Training on **randomised SMILES** is a natural data augmentation and teaches the model that these strings are the same molecule.`,
    },
    {
      kind: 'recall',
      title: 'Transformers (from ML)',
      points: [
        'Self-attention lets every token attend to every other, so there is no fixed window.',
        'Pretraining objectives: masked-token prediction (BERT-style) or next-token prediction (GPT-style).',
        'Positional encodings are needed because attention itself is order-blind.',
        'Fine-tuning adapts the pretrained weights with a small task head and a low learning rate.',
      ],
      link: 'ml/attention-transformers',
    },
    {
      kind: 'numeric',
      prompt: 'A SMILES string is tokenised into 48 tokens and 15% are masked for the pretraining objective. How many tokens does the model have to predict?',
      answer: 7,
      tolerance: 0.5,
      why: '0.15 × 48 = 7.2, so about 7 tokens are masked. The point of the exercise is the ratio: each molecule supplies only a handful of training signals, which is why tens of millions of molecules are needed.',
    },
    {
      kind: 'widget',
      title: 'The masked-SMILES game',
      widget: {
        type: 'StepReveal',
        props: {
          steps: [
            'Take a molecule from the unlabelled pile: aspirin, `CC(=O)OC1=CC=CC=C1C(=O)O`.',
            'Tokenise with a chemistry-aware regex: `C` `C` `(` `=` `O` `)` `O` `C` `1` `=` `C` … — two-letter elements and bracket atoms stay whole.',
            'Mask about 15% of tokens at random: `CC(=O)O[MASK]1=CC=C[MASK]=C1C(=O)O`.',
            'The model must predict the hidden tokens from context. Getting them right requires learning valence, ring closures and what an ester looks like.',
            'Repeat over tens of millions of molecules. No human ever labelled anything.',
            'Now **fine-tune**: replace the token-prediction head with a regression head and train on your 800 measured solubilities.',
          ],
          notes: ['', 'Writing `Cl` as `C` + `l` would teach the model that chlorine is a carbon.', 'Predicting a ring-closure digit forces the model to track an open ring across the whole string.', '', 'This is the cheap part: compute, not experiments.', 'The pretrained weights act as a prior; only a small labelled set is needed to specialise them.'],
        },
      },
    },
    {
      kind: 'mcq',
      prompt: 'Why train a chemical language model on *randomised* SMILES for the same molecule?',
      choices: [
        'It makes the strings shorter and training faster',
        'It is an augmentation that teaches invariance to the arbitrary atom ordering of SMILES',
        'It guarantees every generated string is a valid molecule',
        'It removes the need for a tokeniser',
      ],
      answer: 1,
      why: 'One molecule has many equally valid SMILES; showing several of them teaches the model that they denote the same object, exactly as random crops teach an image model invariance to framing. Validity by construction is what SELFIES provides, which is a different idea.',
    },
    {
      kind: 'explain',
      title: 'Pretraining on graphs and on 3D structures',
      body: String.raw`Strings are not the only substrate.

- **Graph pretraining.** Hu et al. (ICLR 2020) laid out the standard pretext tasks: mask an atom's or bond's attributes and predict them, or predict whether a subgraph belongs in a given context. Crucially they found that **node-level pretraining alone, or graph-level alone, can make things worse** — "negative transfer" — and that combining both was what helped.
- **Contrastive graph learning.** **MolCLR** (Wang et al., Nat. Mach. Intell. 2022) builds two augmented views of each of 10 million molecules by atom masking, bond deletion and subgraph removal, then trains a GNN so that views of the same molecule embed together.
- **3D pretraining.** **Uni-Mol** (Zhou et al., ICLR 2023) pretrains a transformer that takes atoms *and* coordinates, on roughly 209 million conformations of 19 million molecules plus about 3 million protein pockets, with masked-atom prediction and 3D **coordinate denoising**. Denoising has a neat interpretation: learning to undo added noise on coordinates is learning an approximate force field (Zaidi et al. 2023).`,
    },
    {
      kind: 'match',
      prompt: 'Match each pretrained model to what it was trained on.',
      pairs: [
        ['ChemBERTa-2', 'Masked tokens in tens of millions of SMILES strings'],
        ['MolCLR', 'Contrasting two augmented graph views of the same molecule'],
        ['Uni-Mol', 'Masked atoms and denoised 3D coordinates of conformers and pockets'],
        ['Hu et al. GNN pretraining', 'Attribute masking plus context prediction, node *and* graph level'],
      ],
      why: 'The substrate (string, graph, 3D) determines which pretext tasks are even possible — you cannot denoise coordinates you do not have.',
    },
    {
      kind: 'explain',
      title: 'What scale has, and has not, bought',
      body: String.raw`In language, scaling pretraining produced capabilities nobody built in. In molecular property prediction the returns have been far more modest, and the field has been unusually candid about it.

- Careful re-evaluations found that pretrained GNNs often give only small gains over well-tuned non-pretrained baselines, and that the gains shrink or vanish once the comparison uses the same features, the same hyperparameter budget and a harder split (Sun et al., NeurIPS 2022).
- Fingerprints with gradient boosting remain competitive on many benchmark tasks — a sentence that would be absurd in computer vision.

Why is chemistry different?
1. **The bottleneck is the labels, not the representation.** If your assay data has 0.5 log units of noise and covers two scaffolds, no encoder can rescue it.
2. **Unlabelled structures carry no information about your target.** Masked SMILES teaches valence rules, which a fingerprint already encodes exactly.
3. **The benchmarks are small and fragile**, so differences of a few percent are within run-to-run noise.

Where pretraining does earn its place: very low-data tasks, transfer between related assays, 3D models where denoising teaches real physics, and as a representation for generative models.`,
    },
    {
      kind: 'multi',
      prompt: 'Which are fair reasons that pretraining has helped chemistry less than it helped language?',
      choices: [
        'Labelled chemistry datasets are small and noisy, so the label side limits performance',
        'Hand-made fingerprints already encode much of what masked-token tasks teach',
        'Molecular benchmarks are small enough that differences can be run-to-run noise',
        'Transformers cannot be applied to molecules at all',
      ],
      answers: [0, 1, 2],
      why: 'The first three are the standard diagnosis. Transformers are applied to molecules constantly — in chemical language models, reaction prediction and 3D encoders — so the problem is not applicability.',
    },
    {
      kind: 'truefalse',
      prompt: 'If a pretrained model beats a random forest on a benchmark by 2% AUC on one split, that settles the comparison.',
      answer: false,
      why: 'A single split of a few thousand compounds has sampling noise of several percent, and the result depends on how each model was tuned. Repeated splits with matched tuning budgets, and a scaffold or time split, are the minimum for a credible claim.',
    },
    {
      kind: 'widget',
      title: 'What an embedding space looks like',
      body: 'A pretrained encoder maps each molecule to a vector. To see them you must project to 2D — and the projection itself shapes the story.',
      widget: { type: 'DrugChemSpaceMap', props: { method: 'tsne', perplexity: 8 }, caption: 'Clusters in a t-SNE of learned embeddings usually recover *scaffold* families. That looks impressive, but a fingerprint gives much the same picture — recovering chemotypes is not the same as predicting your assay.' },
    },
    {
      kind: 'fill',
      prompt: 'Self-supervised learning invents a ___ task whose labels come from the data itself; the resulting encoder is then ___ on the small labelled dataset. Hu et al. warned that pretraining can cause ___ transfer and make results worse.',
      bank: ['pretext', 'fine-tuned', 'negative', 'supervised', 'positive'],
      answer: ['pretext', 'fine-tuned', 'negative'],
      why: 'Pretext task → pretrained encoder → fine-tuning is the standard pipeline; negative transfer is the documented failure in which the pretrained representation is worse for the downstream task than training from scratch.',
    },
    {
      kind: 'order',
      prompt: 'Order an honest evaluation of "does this foundation model help my project?"',
      steps: [
        'Fix a split that matches deployment (scaffold or time), before touching any model',
        'Tune a fingerprint + gradient-boosting baseline with the same compute budget you will give the big model',
        'Fine-tune the pretrained model on the same training folds',
        'Compare on repeated splits and report the spread, not just the best run',
        'Decide whether any gain is worth the extra complexity, inference cost and dependency',
      ],
      why: 'The split must be fixed first or the comparison leaks; the baseline must get equal tuning or the comparison is rigged; and repeats are what distinguish a real gain from noise.',
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- Pretraining exploits the gap between abundant **unlabelled structures** and scarce **labels**.
- **Chemical language models** (ChemBERTa/-2) mask tokens in SMILES; chemistry-aware tokenisation and randomised SMILES matter.
- **Graph** pretraining masks atoms/bonds or contrasts augmented views (**MolCLR**); **3D** pretraining denoises coordinates (**Uni-Mol**), which approximates learning a force field.
- Hu et al. documented **negative transfer**: the wrong pretext task can hurt.
- Gains over tuned fingerprint baselines are usually small and sometimes vanish under fair comparison — the labels, not the representation, are the bottleneck.
- Pretraining pays off most in very low-data regimes, in 3D/physics tasks, and as a backbone for generative models.`,
    },
  ],
  references: [
    { authors: 'Chithrananda, S., Grand, G., Ramsundar, B.', title: 'ChemBERTa: large-scale self-supervised pretraining for molecular property prediction', year: 2020, venue: 'arXiv:2010.09885 (NeurIPS 2020 ML4Molecules workshop)' },
    { authors: 'Hu, W., Liu, B., Gomes, J., et al.', title: 'Strategies for pre-training graph neural networks', year: 2020, venue: 'Proc. ICLR 2020' },
    { authors: 'Wang, Y., Wang, J., Cao, Z., Barati Farimani, A.', title: 'Molecular contrastive learning of representations via graph neural networks', year: 2022, venue: 'Nat. Mach. Intell. 4, 279–287' },
    { authors: 'Zhou, G., Gao, Z., Ding, Q., et al.', title: 'Uni-Mol: a universal 3D molecular representation learning framework', year: 2023, venue: 'Proc. ICLR 2023' },
    { authors: 'Sun, R., Dai, H., Yu, A. W.', title: 'Does GNN pretraining help molecular representation?', year: 2022, venue: 'Proc. NeurIPS 35' },
  ],
} satisfies LessonContent;
