import type { LessonContent } from '../../types';

// SimCLR: two augmented views of one image -> encoder f -> projection g -> pull together, push others apart.
const SIMCLR_SVG = `<svg viewBox="0 0 320 170" xmlns="http://www.w3.org/2000/svg">
<defs><marker id="ssl-a" viewBox="0 0 6 6" refX="5" refY="3" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0L6,3L0,6z" fill="var(--fg)"/></marker></defs>
<rect x="8" y="66" width="34" height="34" rx="3" fill="var(--c1)" opacity="0.35" stroke="var(--c1)"/>
<text x="25" y="114" font-size="8.5" text-anchor="middle" fill="var(--fg)">image x</text>
<path d="M44,76 L66,46" stroke="var(--fg)" marker-end="url(#ssl-a)"/><path d="M44,90 L66,120" stroke="var(--fg)" marker-end="url(#ssl-a)"/>
<text x="38" y="60" font-size="8" fill="var(--muted)">crop, colour</text>
<rect x="68" y="28" width="28" height="28" rx="3" fill="var(--c1)" opacity="0.6" stroke="var(--c1)" transform="rotate(-8 82 42)"/>
<rect x="68" y="108" width="28" height="28" rx="3" fill="var(--c6)" opacity="0.45" stroke="var(--c6)"/>
<text x="82" y="22" font-size="8.5" text-anchor="middle" fill="var(--fg)">view 1</text>
<text x="82" y="148" font-size="8.5" text-anchor="middle" fill="var(--fg)">view 2</text>
<path d="M98,42 L118,42" stroke="var(--fg)" marker-end="url(#ssl-a)"/><path d="M98,122 L118,122" stroke="var(--fg)" marker-end="url(#ssl-a)"/>
<rect x="120" y="30" width="40" height="24" fill="var(--c2)" opacity="0.3" stroke="var(--c2)"/><text x="140" y="46" font-size="9" text-anchor="middle" fill="var(--fg)">f (enc)</text>
<rect x="120" y="110" width="40" height="24" fill="var(--c2)" opacity="0.3" stroke="var(--c2)"/><text x="140" y="126" font-size="9" text-anchor="middle" fill="var(--fg)">f (enc)</text>
<text x="140" y="86" font-size="8" text-anchor="middle" fill="var(--muted)">shared weights</text>
<path d="M162,42 L178,42" stroke="var(--fg)" marker-end="url(#ssl-a)"/><path d="M162,122 L178,122" stroke="var(--fg)" marker-end="url(#ssl-a)"/>
<text x="170" y="34" font-size="8" text-anchor="middle" fill="var(--c2)">h</text>
<rect x="180" y="32" width="26" height="20" fill="var(--c4)" opacity="0.3" stroke="var(--c4)"/><text x="193" y="46" font-size="9" text-anchor="middle" fill="var(--fg)">g</text>
<rect x="180" y="112" width="26" height="20" fill="var(--c4)" opacity="0.3" stroke="var(--c4)"/><text x="193" y="126" font-size="9" text-anchor="middle" fill="var(--fg)">g</text>
<circle cx="262" cy="82" r="40" fill="none" stroke="var(--grid)"/>
<text x="262" y="20" font-size="8.5" text-anchor="middle" fill="var(--fg)">unit sphere of z</text>
<circle cx="250" cy="60" r="4" fill="var(--c1)"><animate attributeName="cx" values="236;254;254;236" keyTimes="0;0.4;0.8;1" dur="5s" repeatCount="indefinite"/><animate attributeName="cy" values="52;64;64;52" keyTimes="0;0.4;0.8;1" dur="5s" repeatCount="indefinite"/></circle>
<circle cx="262" cy="70" r="4" fill="var(--c6)"><animate attributeName="cx" values="284;262;262;284" keyTimes="0;0.4;0.8;1" dur="5s" repeatCount="indefinite"/><animate attributeName="cy" values="104;70;70;104" keyTimes="0;0.4;0.8;1" dur="5s" repeatCount="indefinite"/></circle>
<circle cx="230" cy="100" r="3.5" fill="var(--c5)"><animate attributeName="cx" values="246;228;228;246" keyTimes="0;0.4;0.8;1" dur="5s" repeatCount="indefinite"/></circle>
<circle cx="296" cy="92" r="3.5" fill="var(--c5)"><animate attributeName="cx" values="280;298;298;280" keyTimes="0;0.4;0.8;1" dur="5s" repeatCount="indefinite"/></circle>
<path d="M208,42 L232,54" stroke="var(--c1)" stroke-dasharray="2 2"/><path d="M208,122 L250,100" stroke="var(--c6)" stroke-dasharray="2 2"/>
<text x="262" y="140" font-size="8.5" text-anchor="middle" fill="var(--c1)">positives pulled together</text>
<text x="262" y="152" font-size="8.5" text-anchor="middle" fill="var(--c5)">other images (negatives) pushed apart</text>
<text x="100" y="166" font-size="8" text-anchor="middle" fill="var(--muted)">keep h for downstream tasks; discard g</text>
</svg>`;

export default {
  cards: [
    {
      kind: 'explain',
      title: 'Labels are expensive, data are not',
      body: String.raw`ImageNet's roughly 1.3 million training images were labelled by hand. The web has billions of unlabelled images and trillions of words. Can a network learn useful **features** from raw data alone, then need only a few labels for the final task?

**Self-supervised learning (SSL)** does this by inventing a supervised task whose labels come **from the data itself**: hide part of the input and predict it, or recognize that two distorted copies show the same thing. The network trained on this **pretext task** produces a **representation** (a feature vector) that is then reused for real **downstream** tasks.

Large language models are self-supervised: next-token prediction needs no human labels.`,
    },
    {
      kind: 'recall',
      title: 'Neural networks',
      points: [
        String.raw`A network $f_\theta$ maps an input to an output through layers of linear maps and nonlinear activations.`,
        'Intermediate layers compute learned features (representations) of the input.',
        'Parameters are fitted by minimizing a loss with gradient-based optimization and backpropagation.',
      ],
      link: 'ml/neural-networks-intro',
    },
    {
      kind: 'explain',
      title: 'Pretext tasks',
      body: String.raw`Two big families:

- **Predictive / masked modelling**: hide part of the input and predict it. Examples: next-word prediction (GPT-style), filling in masked words (BERT), predicting the rotation applied to an image, colourizing a grey image, and masked image modelling (below).
- **Contrastive / joint-embedding**: make two different **views** of the same example (crops, colour changes) map to nearby vectors, while different examples map apart.

A pretext task is useful if solving it forces the network to capture what matters downstream: to predict a masked word you need grammar and meaning; to match two crops of a dog you need to recognize "dog" rather than pixel colours.`,
    },
    {
      kind: 'match',
      prompt: 'Match each pretext task with the label it gets "for free".',
      pairs: [
        ['Next-token prediction', 'The following word in the text'],
        ['Masked image modelling', 'The pixels of the hidden patches'],
        ['Rotation prediction', 'Which of 0°, 90°, 180°, 270° was applied'],
        ['Contrastive learning', 'Which other view comes from the same image'],
      ],
      why: 'In each case the "label" is computed from the raw input by a transformation the trainer chose, so no human annotation is needed. That is what makes the task self-supervised.',
    },
    {
      kind: 'explain',
      title: 'Contrastive learning and InfoNCE',
      body: String.raw`Take an **anchor** embedding $z$, one **positive** $z^+$ (another view of the same example) and $N-1$ **negatives** $z_1^-,\dots$ (other examples). Score pairs with a similarity, usually cosine similarity $\mathrm{sim}(a,b)=a^\top b/(\|a\|\|b\|)$, divided by a **temperature** $\tau$. The **InfoNCE** loss (Oord, Li & Vinyals, 2018) is
$$\mathcal L=-\log\frac{\exp(\mathrm{sim}(z,z^+)/\tau)}{\exp(\mathrm{sim}(z,z^+)/\tau)+\sum_{j}\exp(\mathrm{sim}(z,z_j^-)/\tau)} .$$
It is exactly the [softmax cross-entropy](@ml/softmax-classification) of an $N$-way classification problem: "which of these $N$ candidates is my positive?"`,
    },
    {
      kind: 'widget',
      title: 'InfoNCE is a classification loss',
      body: String.raw`The candidates' logits are similarities divided by $\tau$. The true class is the positive. Raise the positive's logit, or lower the negatives', and the loss $-\log p_{\text{pos}}$ falls. Lower temperature sharpens the softmax so that the **hardest** negatives (highest similarity) dominate the loss.`,
      widget: { type: 'MlSoftmaxBars', props: { logits: [2, 1.5, 0.5, -1], labels: ['positive', 'neg 1', 'neg 2', 'neg 3'], target: 0, temperature: 1 } },
    },
    {
      kind: 'numeric',
      prompt: String.raw`An anchor has similarity $s^+$ with its positive and similarity $0$ with each of $N-1=3$ negatives. With $\tau=1$ and $s^+=0$, what is the InfoNCE loss in nats? (3 decimals)`,
      answer: 1.386,
      tolerance: 0.002,
      why: String.raw`All four logits equal 0, so $p_{\text{pos}}=1/4$ and $\mathcal L=\log4\approx1.386$. This is the chance-level loss for $N$ candidates, $\log N$. A useful sanity check: a freshly initialized contrastive model should start near $\log N$.`,
    },
    {
      kind: 'explain',
      title: 'What InfoNCE measures',
      body: String.raw`Oord et al. showed that minimizing InfoNCE maximizes a lower bound on the **mutual information** between the two views:
$$I(\text{view}_1;\text{view}_2)\ \ge\ \log N-\mathcal L .$$
Since $\mathcal L\ge0$, the bound can never exceed $\log N$: more negatives allow a tighter bound, one reason large batches helped early contrastive methods.

Another reading (Wang & Isola, 2020): the loss encourages **alignment** (positives close) and **uniformity** (embeddings spread over the sphere). Without the negatives, the trivial solution "map every input to the same vector" would have perfect alignment: this is **representation collapse**.`,
      widget: {
        type: 'FunctionPlot',
        props: {
          fns: ['log(1+(N-1)*exp((s-x)/tau))'],
          x: [-1, 1], y: [0, 8],
          params: [
            { name: 'tau', min: 0.05, max: 1, value: 0.5, label: 'temperature τ' },
            { name: 'N', min: 2, max: 1024, value: 256, label: 'candidates N' },
            { name: 's', min: -1, max: 1, value: 0, label: 'negative sim' },
          ],
          labels: ['InfoNCE loss'],
          xLabel: 'positive cosine sim', yLabel: 'loss',
        },
        caption: 'Loss when all N−1 negatives share similarity s. It is log N when the positive is no more similar than the negatives (x = s).',
      },
    },
    {
      kind: 'numeric',
      prompt: String.raw`Using InfoNCE with $N=1024$ candidates, what is the largest mutual information (in nats) the bound $I\ge\log N-\mathcal L$ can certify? (3 decimals)`,
      answer: 6.931,
      tolerance: 0.002,
      why: String.raw`The loss cannot go below 0, so the bound is at most $\log 1024=10\log2\approx6.931$ nats (10 bits). If the true mutual information is larger, InfoNCE with this $N$ cannot reveal it. Using $\log_2$ gives 10, the same quantity in bits.`,
    },
    {
      kind: 'widget',
      title: 'SimCLR',
      body: String.raw`**SimCLR** (Chen, Kornblith, Norouzi & Hinton, 2020) is a minimal contrastive recipe. For a batch of $N$ images, make two random augmentations of each ($2N$ views). Each view goes through an encoder $f$ (a ResNet) giving $h$, then a small MLP **projection head** $g$ giving $z$. For each view, its partner is the positive and the other $2(N-1)$ views are negatives, in an InfoNCE loss with temperature (called NT-Xent).

Findings: the **composition** of augmentations matters a lot (random crop plus colour distortion was key); the projection head helps, and $h$ (before $g$) is the better representation; larger batches and longer training help.`,
      widget: { type: 'SvgDiagram', props: { svg: SIMCLR_SVG } },
    },
    {
      kind: 'numeric',
      prompt: 'In SimCLR with a batch of N = 256 images, how many negatives does each augmented view have?',
      answer: 510,
      tolerance: 0,
      why: String.raw`There are $2N=512$ views. Excluding the anchor itself and its one positive leaves $2N-2=510$ negatives. Answering 255 counts images rather than augmented views.`,
    },
    {
      kind: 'explain',
      title: 'Masked autoencoders',
      body: String.raw`**MAE** (He et al., 2022) brings BERT-style masking to images. Split an image into patches (e.g. $16\times16$ pixels), **mask a large random fraction, 75%**, and train to reconstruct the missing pixels:
- the **encoder** (a [vision transformer](@ml/vision-transformers)) sees **only the visible** patches, which makes training cheap;
- a lightweight **decoder** gets the encoded patches plus mask tokens and predicts the pixels;
- the loss is the mean squared error on the **masked** patches only.

The high mask ratio matters: images are very redundant, so masking a little lets the model fill gaps by interpolating neighbouring pixels, whereas masking most forces it to model the content. After pre-training the decoder is discarded.`,
    },
    {
      kind: 'numeric',
      prompt: String.raw`An MAE splits a $224\times224$ image into $16\times16$ patches and masks 75% of them. How many patches does the encoder process?`,
      answer: 49,
      tolerance: 0,
      why: String.raw`$224/16=14$, so there are $14^2=196$ patches. Keeping 25% leaves $49$ visible patches, which is all the encoder sees. Answering 147 gives the number of masked patches, which only the decoder handles.`,
    },
    {
      kind: 'multi',
      prompt: 'Which statements about self-supervised learning are correct?',
      choices: [
        'Its training labels are derived automatically from the inputs.',
        'Without negatives or another safeguard, a joint-embedding model can collapse to a constant output.',
        'In SimCLR, the projection-head output z is the representation used for downstream tasks.',
        'Representations are often evaluated by training a linear classifier on frozen features (a linear probe).',
        'Masked autoencoders need a human-labelled image for every training example.',
      ],
      answers: [0, 1, 3],
      why: String.raw`SSL labels come from the data. Collapse is the classic failure mode, prevented by negatives (SimCLR) or by other mechanisms such as stop-gradient and predictor networks in later methods. SimCLR found the encoder output $h$, before the head $g$, transfers better. Linear probes are a standard evaluation. MAE learns from unlabelled images.`,
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- **Self-supervised learning** creates labels from the data (masking, prediction, multiple views) to learn reusable representations.
- **Contrastive** methods pull two views of one example together and push other examples apart; **InfoNCE** is $N$-way softmax cross-entropy over candidates.
- InfoNCE lower-bounds mutual information, capped at $\log N$; negatives prevent **collapse**.
- **SimCLR**: strong augmentations, a projection head, NT-Xent loss; use the pre-head features downstream.
- **MAE**: mask 75% of patches, encode only visible ones, reconstruct pixels with a light decoder.`,
    },
  ],
  references: [
    { authors: 'T. Chen, S. Kornblith, M. Norouzi & G. Hinton', title: 'A Simple Framework for Contrastive Learning of Visual Representations', year: 2020, venue: 'ICML (PMLR 119)', url: 'https://arxiv.org/abs/2002.05709' },
    { authors: 'K. He, X. Chen, S. Xie, Y. Li, P. Dollár & R. Girshick', title: 'Masked Autoencoders Are Scalable Vision Learners', year: 2022, venue: 'CVPR', url: 'https://arxiv.org/abs/2111.06377' },
    { authors: 'A. van den Oord, Y. Li & O. Vinyals', title: 'Representation Learning with Contrastive Predictive Coding', year: 2018, venue: 'arXiv:1807.03748', url: 'https://arxiv.org/abs/1807.03748' },
    { authors: 'T. Wang & P. Isola', title: 'Understanding Contrastive Representation Learning through Alignment and Uniformity on the Hypersphere', year: 2020, venue: 'ICML (PMLR 119)' },
    { authors: 'S. J. D. Prince', title: 'Understanding Deep Learning', year: 2023, venue: 'MIT Press', url: 'https://udlbook.github.io/udlbook/' },
  ],
} satisfies LessonContent;
