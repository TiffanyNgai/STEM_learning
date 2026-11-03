import type { LessonContent } from '../../types';

const mlmSvg = `<svg viewBox="0 0 320 130" xmlns="http://www.w3.org/2000/svg">
<g font-family="monospace" font-size="12" font-weight="700" text-anchor="middle">
${'MKTAYIAKQRQISFVK'.split('').map((c, i) => {
  const masked = i === 4 || i === 9 || i === 13;
  const x = 18 + i * 18.5;
  return masked
    ? `<rect x="${x - 8}" y="22" width="16" height="20" rx="3" fill="var(--c4)" fill-opacity="0.3" stroke="var(--c4)"/><text x="${x}" y="37" fill="var(--c4)">?<animate attributeName="opacity" values="1;1;0;0;1" keyTimes="0;0.45;0.5;0.95;1" dur="4s" repeatCount="indefinite"/></text><text x="${x}" y="37" fill="var(--c1)" opacity="0">${c}<animate attributeName="opacity" values="0;0;1;1;0" keyTimes="0;0.45;0.5;0.95;1" dur="4s" repeatCount="indefinite"/></text>`
    : `<text x="${x}" y="37" fill="var(--fg)">${c}</text>`;
}).join('')}
</g>
<g font-size="9" text-anchor="middle">
<rect x="40" y="58" width="240" height="26" rx="6" fill="var(--c2)" fill-opacity="0.18" stroke="var(--c2)"/>
<text x="160" y="75" fill="var(--fg)">transformer encoder (every residue attends to every other)</text>
<text x="160" y="104" fill="var(--muted)">loss = −log p(true residue | unmasked context), at masked positions only</text>
<text x="160" y="120" fill="var(--muted)">~15 % of positions are masked in each training sequence</text>
</g></svg>`;

export default {
  cards: [
    {
      kind: 'explain',
      title: 'Can a model learn proteins just by reading them?',
      body: String.raw`AlphaFold2 needs an MSA for every query, built by a database search that can take longer than the prediction itself, and it struggles when a protein has few relatives.

**Protein language models (PLMs)** take a different route. Like large text models, they are trained on huge numbers of sequences with no structures and no labels, just the task of predicting hidden letters. Whatever they need to succeed at that task, including which residues interact in 3D, ends up stored in their weights. At prediction time a PLM reads a **single sequence**.`,
    },
    {
      kind: 'recall',
      title: 'Transformers (from ML)',
      points: [
        'Input tokens are embedded as vectors; self-attention mixes information between all positions.',
        'Attention weights form an $N \\times N$ map of which positions each position uses.',
        'Stacking many blocks gives deep contextual embeddings, one vector per token.',
        'Encoder models (like BERT) read the whole sequence at once, in both directions.',
      ],
      link: 'ml/attention-transformers',
    },
    {
      kind: 'explain',
      title: 'Masked language modelling',
      body: String.raw`The training game is a fill-in-the-blanks puzzle, as in BERT (Devlin et al. 2019). Take a sequence, hide about 15 % of its residues, and train a transformer to predict each hidden residue from the rest. The loss is the cross-entropy, $-\log p(\text{true residue} \mid \text{context})$, averaged over masked positions.

Why does this teach structure? If position 40 is masked and position 112 is a lysine, a model that "knows" 40 and 112 form a salt bridge will predict glutamate or aspartate. Getting such guesses right across millions of protein families rewards the model for learning the same coevolution signal that [DCA](@drug/protein-structure-prediction) extracts from one MSA.`,
      widget: { type: 'SvgDiagram', props: { svg: mlmSvg }, caption: 'Masked positions (purple) are predicted from the unmasked context; the true residues appear when revealed.' },
    },
    {
      kind: 'widget',
      title: 'One masked position',
      body: 'Suppose the model outputs these scores (logits) for a masked position whose true residue is E. Adjust the logits to see the probabilities and the loss change.',
      widget: {
        type: 'MlSoftmaxBars',
        props: { logits: [2.5, 1.8, 0.2, -1, -2], labels: ['E', 'D', 'Q', 'K', 'W'], target: 0, showTemperature: false },
        caption: 'Illustrative numbers. Chemically similar residues (E, D, Q) share probability; a confident wrong guess gives a large loss $-\\log p_E$.',
      },
    },
    {
      kind: 'explain',
      title: 'Perplexity: how surprised is the model?',
      body: String.raw`Language-model quality is often reported as **perplexity**: the exponential of the average cross-entropy (in natural-log units),
$$\text{PPL} = \exp\Big(\tfrac{1}{M}\sum_{m=1}^{M} -\ln p(x_m \mid \text{context})\Big).$$
It is roughly "the number of residues the model is still choosing between". Guessing uniformly over the 20 amino acids gives a perplexity of 20; a perfect model gives 1. Lin et al. (2023) found that as ESM-2 models grew, perplexity fell and the accuracy of structures predicted from their representations rose with it.`,
    },
    {
      kind: 'numeric',
      prompt: String.raw`A protein language model's average cross-entropy on masked residues is 1.5 nats. What is its perplexity? (Two decimal places.)`,
      answer: 4.48,
      tolerance: 0.02,
      why: String.raw`PPL $= e^{1.5} \approx 4.48$. The model is about as uncertain as choosing among 4–5 residues, much better than the 20 of uniform guessing. Using $\log_{10}$ or $2^{1.5}$ instead of $e^{1.5}$ is the common slip; nats go with the natural exponential.`,
    },
    {
      kind: 'explain',
      title: 'ESM-2: scaling up',
      body: String.raw`**ESM-2** (Meta AI; Lin et al. 2023) is a family of transformer encoders from 8 million to 15 billion parameters, trained by masked language modelling on UniProt sequences: roughly 65 million **UniRef50** clusters (sequences grouped at 50 % identity), with training examples drawn from the UniRef90 members of each cluster so that common families do not swamp rare ones.

Rao et al. (2021) had shown with earlier ESM models that residue–residue **contacts can be read off the attention maps** with a simple logistic regression: some attention heads effectively attend from a residue to its 3D neighbours. Nobody told the model about structure; it emerged from predicting sequences. In ESM-2 this contact information becomes more accurate with model size.`,
      widget: { type: 'DrugContactMap', props: { cutoff: 8 }, caption: 'A contact map like this is what PLM attention heads implicitly learn: residue pairs within ~8 Å, including long-range ones far apart in sequence.' },
    },
    {
      kind: 'explain',
      title: 'ESMFold: structure from one sequence',
      body: String.raw`**ESMFold** feeds ESM-2 (3 billion parameter) embeddings into a folding trunk and an AlphaFold2-style structure module. There is **no MSA search**, so it is up to about 60 times faster than AlphaFold2 on short sequences. On average it is less accurate than AlphaFold2 with a full MSA, and its accuracy tracks the language model's perplexity on that protein: sequences the model "understands" fold well.

Speed made a new scale possible. The **ESM Metagenomic Atlas** contains over 600 million predicted structures of proteins from environmental DNA, more than a third of them with high confidence.`,
    },
    {
      kind: 'mcq',
      prompt: 'What is the main practical advantage of ESMFold over AlphaFold2?',
      choices: [
        'It needs no multiple sequence alignment, so it is much faster per protein',
        'It is more accurate on every protein',
        'It predicts protein–ligand complexes',
        'It was trained on experimental structures only, with no sequence data',
      ],
      answer: 0,
      why: 'Skipping the MSA search and processing a single sequence makes ESMFold fast enough to fold hundreds of millions of proteins. It is on average somewhat less accurate than AlphaFold2 with an MSA, and it models single protein chains, not ligands.',
    },
    {
      kind: 'explain',
      title: 'Beyond structure: variant effects and embeddings',
      body: String.raw`A PLM assigns a probability to every residue at every position, which gives a **zero-shot** score for a mutation (no training on mutation data). Mask the position and compare the mutant with the wild type:
$$s = \ln p(\text{mutant}) - \ln p(\text{wild type}).$$
Strongly negative scores mean the substitution looks "un-natural" to the model and is often damaging. Meier et al. (2021, ESM-1v) showed that such scores correlate with deep mutational scanning experiments.

PLM **embeddings** are also used as input features for downstream models (stability, solubility, binding), and newer generative models such as ESM3 design sequences directly.`,
    },
    {
      kind: 'numeric',
      prompt: String.raw`At a masked position the model gives the wild-type residue probability 0.60 and a mutant residue probability 0.03. What is the score $s = \ln p(\text{mut}) - \ln p(\text{wt})$? (Two decimal places.)`,
      answer: -3.0,
      tolerance: 0.02,
      why: String.raw`$s = \ln(0.03/0.60) = \ln(0.05) \approx -3.00$. The mutant is 20 times less likely than the wild type in the model's eyes, a hint that it may be deleterious. Forgetting the sign (writing +3) flips the interpretation.`,
    },
    {
      kind: 'truefalse',
      prompt: 'Like AlphaFold2, a protein language model such as ESM-2 needs a multiple sequence alignment of the query protein at prediction time.',
      answer: false,
      why: 'Evolutionary information was absorbed into the weights during training on millions of sequences. At prediction time the model reads only the single query sequence, which is the source of its speed.',
    },
    {
      kind: 'match',
      prompt: 'Match each name to what it is.',
      pairs: [
        ['ESM-2', 'Transformer encoder trained by masked language modelling'],
        ['ESMFold', 'Single-sequence structure predictor built on ESM-2 embeddings'],
        ['ESM-1v', 'Zero-shot predictor of mutation effects'],
        ['ESM Metagenomic Atlas', 'Hundreds of millions of predicted structures of environmental proteins'],
      ],
      why: 'ESM-2 is the language model; ESMFold adds a folding head; ESM-1v uses likelihood ratios for variants; the Atlas is the dataset produced by running ESMFold at scale.',
    },
    {
      kind: 'fill',
      prompt: 'In masked language modelling about ___ % of residues are hidden and the model predicts them from the ___ residues. Contacts can then be read from its ___ maps.',
      bank: ['15', '50', 'unmasked', 'masked', 'attention', 'electron-density'],
      answer: ['15', 'unmasked', 'attention'],
      why: 'Predicting hidden residues from the visible ones forces the model to learn which positions depend on each other; Rao et al. (2021) showed that those dependencies appear in attention maps as contacts.',
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- PLMs learn from **sequences alone** by **masked language modelling** (~15 % masked, cross-entropy loss).
- **Perplexity** = $\exp$(mean cross-entropy); 20 = uniform guessing, 1 = perfect. Lower perplexity goes with better structure prediction.
- **Contacts emerge in attention maps**; **ESMFold** turns ESM-2 embeddings into 3D structure **without an MSA**, fast but on average less accurate than AlphaFold2.
- Likelihood ratios give **zero-shot variant-effect** scores; embeddings feed downstream models and [protein design](@drug/protein-design).`,
    },
  ],
  references: [
    { authors: 'Lin, Z., Akin, H., Rao, R., et al.', title: 'Evolutionary-scale prediction of atomic-level protein structure with a language model', year: 2023, venue: 'Science 379, 1123–1130' },
    { authors: 'Rives, A., Meier, J., Sercu, T., et al.', title: 'Biological structure and function emerge from scaling unsupervised learning to 250 million protein sequences', year: 2021, venue: 'Proc. Natl. Acad. Sci. USA 118, e2016239118' },
    { authors: 'Rao, R., Meier, J., Sercu, T., Ovchinnikov, S., Rives, A.', title: 'Transformer protein language models are unsupervised structure learners', year: 2021, venue: 'International Conference on Learning Representations (ICLR)' },
    { authors: 'Meier, J., Rao, R., Verkuil, R., et al.', title: 'Language models enable zero-shot prediction of the effects of mutations on protein function', year: 2021, venue: 'Advances in Neural Information Processing Systems 34 (NeurIPS)' },
    { authors: 'Devlin, J., Chang, M.-W., Lee, K., Toutanova, K.', title: 'BERT: Pre-training of deep bidirectional transformers for language understanding', year: 2019, venue: 'Proc. NAACL-HLT 2019' },
  ],
} satisfies LessonContent;
