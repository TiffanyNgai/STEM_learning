import type { LessonContent } from '../../types';

export default {
  cards: [
    {
      kind: 'explain',
      title: 'Can a transformer read an image?',
      body: String.raw`Transformers process a **sequence of tokens**, and their self-attention compares every token with every other one: cost grows like $N^2$ for $N$ tokens.

Treating each pixel as a token is hopeless: a $224\times224$ image has $N=50{,}176$ pixels, so one attention matrix would have $N^2\approx2.5\times10^9$ entries per head per layer.

Dosovitskiy et al.'s **Vision Transformer (ViT)** uses a blunt fix: cut the image into $16\times16$ **patches** and treat each patch as a word. *An image is worth 16×16 words* — just $14\times14=196$ tokens.`,
    },
    {
      kind: 'recall',
      title: 'Transformers (recap)',
      points: [
        String.raw`Self-attention: each token forms query, key and value vectors; outputs are softmax$(QK^\top/\sqrt{d})\,V$ — weighted averages over all tokens.`,
        String.raw`Cost is $O(N^2)$ in the number of tokens $N$.`,
        'Without position information, self-attention is permutation-equivariant: it does not know token order.',
        'A transformer block = (LayerNorm → multi-head attention → residual) then (LayerNorm → MLP → residual).',
      ],
      link: 'ml/attention-transformers',
    },
    {
      kind: 'explain',
      title: 'From image to token sequence',
      body: String.raw`For an image of size $H\times W$ with $C$ channels and patch size $P$:

1. Split into $N=HW/P^2$ non-overlapping $P\times P$ patches.
2. Flatten each into a vector of length $P^2C$ and multiply by a learned matrix $E$ to get a $D$-dimensional **patch embedding**. (This equals a [convolution](@ml/cnns) with kernel size $P$ and stride $P$.)
3. Prepend a learnable **[class] token**.
4. Add learnable **position embeddings** (ViT uses simple 1D ones, indexed in raster order).
5. Run a standard transformer encoder. A small head on the final [class] token outputs the class.

Everything after step 2 is the *unchanged* NLP transformer.`,
    },
    {
      kind: 'widget',
      title: 'Patchify',
      body: 'Watch the image break into patches that line up as a sequence. Change the patch size: smaller patches mean finer detail per token but many more tokens — and the attention matrix grows with the *square* of that count.',
      widget: { type: 'MlPatchify', props: { patch: 8 }, caption: 'Position indices are the only thing telling the transformer where each patch came from.' },
    },
    {
      kind: 'numeric',
      prompt: String.raw`A ViT with patch size $16$ is fine-tuned on $384\times384$ images. How many patch tokens (not counting the [class] token) does each image produce?`,
      answer: 576,
      why: String.raw`$384/16=24$ patches per side, so $24\times24=576$. Compared with 196 at $224\times224$, the sequence is about 2.9× longer and attention about 8.6× more expensive.`,
    },
    {
      kind: 'numeric',
      prompt: String.raw`ViT-H/14 uses $14\times14$ patches of an RGB image. How long is each flattened patch vector before the linear projection?`,
      answer: 588,
      why: String.raw`$P^2C=14\cdot14\cdot3=588$. The projection $E$ then maps these 588 numbers to the model width $D$ (1280 for ViT-Huge).`,
    },
    {
      kind: 'explain',
      title: 'The model family',
      body: String.raw`ViT reuses BERT-style sizes; the suffix is the patch size:

- **ViT-B/16** (Base): 12 layers, width $D=768$, 12 heads, ≈86M parameters.
- **ViT-L/16** (Large): 24 layers, $D=1024$, 16 heads, ≈307M.
- **ViT-H/14** (Huge): 32 layers, $D=1280$, 16 heads, ≈632M.

The parameter count does not depend on image size (only the position-embedding table does); the *compute* does, through $N$. Halving $P$ quadruples $N$, so the $N\times N$ attention matrix (and the work spent on it) grows about $16\times$, while the per-token MLP cost grows $4\times$.`,
    },
    {
      kind: 'mcq',
      prompt: 'You switch a ViT from 16×16 to 8×8 patches at the same image resolution. Roughly how does the size of each self-attention matrix change?',
      choices: [
        'It grows about 16×.',
        'It grows about 4×.',
        'It grows about 2×.',
        'It stays the same, because the model width D is unchanged.',
      ],
      answer: 0,
      why: String.raw`Halving $P$ doubles the patches per side, so $N$ grows $4\times$ and the $N\times N$ attention matrix grows $4^2=16\times$. "4×" is the growth of the token count itself (and of the per-token MLP work), not of attention.`,
    },
    {
      kind: 'explain',
      title: 'Inductive bias: what ViT does not assume',
      body: String.raw`A CNN hard-wires **locality**, **weight sharing** across positions and (for stride 1) **translation equivariance** — see [CNNs](@ml/cnns).

A ViT assumes far less. Only the patch embedding and the per-token MLP are local. Self-attention is **global** from the first layer, and position enters only through *learned* embeddings, so 2D neighbourhood structure must be learned from data. The network is not translation-equivariant: shifting the image by a few pixels changes which pixels fall in which patch.

The ViT paper found that learned position embeddings do end up encoding rows and columns, and that some heads attend across the whole image even in the lowest layers.`,
    },
    {
      kind: 'widget',
      title: 'Bias vs scale',
      body: String.raw`Dosovitskiy et al. found that trained on ImageNet-1k alone (1.3M images), ViTs underperformed comparably sized ResNets; with ImageNet-21k (14M images) they were comparable; pre-trained on JFT-300M (about 300M images) they came out ahead. A strong prior helps when data is scarce; with enough data, a weaker prior stops being a handicap.`,
      widget: {
        type: 'FunctionPlot',
        props: { fns: ['62+20/(1+exp(-1.6*(x-5.8)))', '50+38/(1+exp(-1.3*(x-6.6)))'], x: [5, 8.5], y: [45, 92], labels: ['CNN (strong prior)', 'ViT (weak prior)'], xLabel: 'log₁₀ pre-training images', yLabel: 'accuracy' },
        caption: '**Schematic only**: the qualitative crossover reported in the ViT paper, not its actual numbers.',
      },
    },
    {
      kind: 'truefalse',
      prompt: 'Like a stride-1 CNN, a ViT is translation-equivariant by construction.',
      answer: false,
      why: String.raw`Patches are cut on a fixed grid and positions are added through learned embeddings, so shifting the image changes patch contents and their position codes in ways the architecture does not mirror. Any robustness to translation has to be learned (or encouraged by augmentation).`,
    },
    {
      kind: 'explain',
      title: 'Making ViTs practical',
      body: String.raw`- **Higher resolution at fine-tuning:** keep $P$, so $N$ grows; the pre-trained position embeddings are **2D-interpolated** to the new grid — one of the few places ViT uses the image's 2D layout by hand.
- **Less data:** DeiT (Touvron et al.) trained competitive ViTs on ImageNet-1k alone with strong augmentation, regularization and distillation from a CNN teacher.
- **Hierarchy for dense prediction:** Swin Transformers compute attention inside local windows (shifted between layers) and merge patches between stages, recreating a CNN-like pyramid with cost linear in image size — useful for the [dense prediction](@ml/unet-dense-prediction) tasks where plain ViT's single coarse grid is awkward.
- Conversely, [ConvNeXt](@ml/cnn-architectures) showed convnets can match these models with a modern recipe.`,
    },
    {
      kind: 'multi',
      prompt: 'In the original ViT, which components explicitly use the 2D layout of the image?',
      choices: [
        'Cutting the image into a grid of P×P patches',
        '2D interpolation of the position embeddings when fine-tuning at a new resolution',
        'The self-attention weights between tokens',
        'The [class] token',
      ],
      answers: [0, 1],
      why: 'The ViT paper names exactly these two as the points where 2D structure is injected by hand. Attention compares all tokens regardless of where they sit, and the [class] token has no position in the image; whatever 2D structure they show is learned.',
    },
    {
      kind: 'match',
      prompt: 'Match each ViT component to its role.',
      pairs: [
        ['Patch embedding', 'Linear map of each flattened P×P×C patch to a D-dimensional token'],
        ['Position embedding', 'Learned vector added to each token to say where its patch came from'],
        ['[class] token', 'Extra learned token whose final state feeds the classification head'],
        ['"/16" in ViT-B/16', 'Patch side length in pixels'],
      ],
      why: 'Patch embeddings turn pixels into tokens; position embeddings restore order information that attention alone ignores; the [class] token aggregates information from all patches for the label; the suffix of the model name gives the patch size.',
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- ViT = split the image into $P\times P$ patches, linearly embed them, add a [class] token and learned position embeddings, run a standard transformer.
- Tokens: $N=HW/P^2$ (196 for $224^2$ at $P=16$); attention cost $\propto N^2$.
- Patch embedding is a convolution with kernel = stride = $P$.
- ViT has a much weaker inductive bias than a CNN (no built-in locality or translation equivariance); it needs large data, or strong augmentation/distillation, to win.
- Hierarchical variants (Swin) and modern convnets (ConvNeXt) blur the boundary between the two families.`,
    },
  ],
  references: [
    { authors: 'A. Dosovitskiy, L. Beyer, A. Kolesnikov, D. Weissenborn, X. Zhai, T. Unterthiner, M. Dehghani, M. Minderer, G. Heigold, S. Gelly, J. Uszkoreit & N. Houlsby', title: 'An Image is Worth 16x16 Words: Transformers for Image Recognition at Scale', year: 2021, venue: 'ICLR', url: 'https://arxiv.org/abs/2010.11929' },
    { authors: 'A. Vaswani et al.', title: 'Attention Is All You Need', year: 2017, venue: 'NeurIPS', url: 'https://arxiv.org/abs/1706.03762' },
    { authors: 'H. Touvron, M. Cord, M. Douze, F. Massa, A. Sablayrolles & H. Jégou', title: 'Training data-efficient image transformers & distillation through attention', year: 2021, venue: 'ICML', url: 'https://arxiv.org/abs/2012.12877' },
    { authors: 'Z. Liu, Y. Lin, Y. Cao, H. Hu, Y. Wei, Z. Zhang, S. Lin & B. Guo', title: 'Swin Transformer: Hierarchical Vision Transformer using Shifted Windows', year: 2021, venue: 'ICCV', url: 'https://arxiv.org/abs/2103.14030' },
    { authors: 'S. J. D. Prince', title: 'Understanding Deep Learning', year: 2023, venue: 'MIT Press', detail: 'Ch. 12', url: 'https://udlbook.github.io/udlbook/' },
  ],
} satisfies LessonContent;
