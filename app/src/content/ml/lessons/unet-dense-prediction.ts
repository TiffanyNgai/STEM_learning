import type { LessonContent } from '../../types';

// U-Net schematic: contracting path (left), bottleneck, expanding path (right), skip connections across.
const UNET_SVG = (() => {
  const ch = [64, 128, 256, 512, 1024];
  const W = (l: number) => 8 + 3 * l, Hh = (l: number) => 28 - 4 * l, Y = (l: number) => 22 + l * 32;
  const xe = (l: number) => 18 + l * 26, xd = (l: number) => 302 - l * 26 - W(l);
  const parts: string[] = [];
  for (let l = 0; l < 5; l++) {
    const cx = l === 4 ? 160 - W(l) / 2 : xe(l);
    parts.push(`<rect x="${cx}" y="${Y(l)}" width="${W(l)}" height="${Hh(l)}" fill="var(--c2)" opacity="0.75"/>`);
    parts.push(`<text x="${cx + W(l) / 2}" y="${Y(l) - 3}" font-size="7.5" text-anchor="middle" fill="var(--fg)">${ch[l]}</text>`);
    if (l < 4) {
      parts.push(`<rect x="${xd(l)}" y="${Y(l)}" width="${W(l)}" height="${Hh(l)}" fill="var(--c1)" opacity="0.75"/>`);
      parts.push(`<rect x="${xd(l) - 5}" y="${Y(l)}" width="5" height="${Hh(l)}" fill="var(--c3)" opacity="0.8"/>`);
      const y = Y(l) + Hh(l) / 2;
      parts.push(`<line x1="${xe(l) + W(l) + 2}" y1="${y}" x2="${xd(l) - 7}" y2="${y}" stroke="var(--c3)" stroke-width="1.1" stroke-dasharray="4 3" marker-end="url(#ua)"><animate attributeName="stroke-dashoffset" from="14" to="0" dur="1.2s" repeatCount="indefinite"/></line>`);
      const nx = l === 3 ? 160 - W(4) / 2 : xe(l + 1);
      parts.push(`<line x1="${xe(l) + W(l) / 2}" y1="${Y(l) + Hh(l)}" x2="${nx + 3}" y2="${Y(l + 1) - 9}" stroke="var(--c5)" stroke-width="1" marker-end="url(#ua)"/>`);
      const px = l === 3 ? 160 + W(4) / 2 : xd(l + 1) + W(l + 1);
      parts.push(`<line x1="${px - 3}" y1="${Y(l + 1) - 9}" x2="${xd(l) + W(l) / 2}" y2="${Y(l) + Hh(l) + 1}" stroke="var(--c4)" stroke-width="1" marker-end="url(#ua)"/>`);
    }
  }
  return `<svg viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg">
<defs><marker id="ua" viewBox="0 0 6 6" refX="5" refY="3" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L6,3 L0,6 z" fill="var(--fg)"/></marker></defs>
<text x="4" y="11" font-size="8" fill="var(--c2)">contracting path ("what")</text>
<text x="316" y="11" font-size="8" text-anchor="end" fill="var(--c1)">expanding path ("where")</text>
${parts.join('\n')}
<circle r="3" fill="var(--c3)"><animateMotion dur="5s" repeatCount="indefinite" path="M22,36 L48,62 L74,94 L100,124 L160,156 L222,124 L250,94 L278,62 L298,36"/></circle>
<text x="160" y="186" font-size="8" text-anchor="middle" fill="var(--fg)"><tspan fill="var(--c5)">↘ 2×2 max pool</tspan>   <tspan fill="var(--c4)">↗ 2×2 up-conv</tspan>   <tspan fill="var(--c3)">⇢ copy &amp; concatenate</tspan></text>
<text x="160" y="197" font-size="7.5" text-anchor="middle" fill="var(--muted)">numbers = channels; box height ≈ spatial size; final 1×1 conv → per-pixel class scores</text>
</svg>`;
})();

export default {
  cards: [
    {
      kind: 'explain',
      title: 'One label per pixel',
      body: String.raw`A classifier answers *what is in the image* with one label. **Dense prediction** asks for an output at **every pixel**: a class per pixel (**semantic segmentation**: tumour / healthy, road / car / sky), a depth per pixel, a motion vector per pixel, or a clean pixel value (**denoising**).

That creates a tension. Recognizing an object needs a large [receptive field](@ml/cnns), which classifiers get by repeatedly downsampling — throwing away *where* things are. But a segmentation mask must be sharp at full resolution. Dense-prediction networks must deliver both **what** (context) and **where** (precise location).`,
    },
    {
      kind: 'explain',
      title: 'Fully convolutional networks',
      body: String.raw`Long, Shelhamer & Darrell observed that a fully connected layer applied to a fixed-size feature map is just a convolution whose kernel covers the whole map. Rewriting a classifier's fully connected layers as convolutions gives a **fully convolutional network (FCN)**: it accepts images of any size and outputs a *map* of class scores — one score vector per location — instead of one vector.

That map is coarse (1/32 of the input side for their VGG-based net), so FCN **upsamples** it with learnable *transposed convolutions* (initialized to bilinear interpolation) and adds predictions from earlier, finer layers via **skip connections** (FCN-32s → 16s → 8s get progressively sharper). Training uses cross-entropy summed over all pixels.`,
    },
    {
      kind: 'mcq',
      prompt: 'What does replacing a classifier\'s fully connected layers by equivalent convolutions achieve?',
      choices: [
        'The network accepts inputs of any size and outputs a spatial map of class scores instead of a single vector.',
        'It makes the network exactly invariant to translations.',
        'It reduces the receptive field so that predictions become sharper.',
        'It removes the need for any upsampling to reach full resolution.',
      ],
      answer: 0,
      why: String.raw`Convolutions slide, so a bigger input simply yields a bigger output map — one prediction per location. The map is still coarse, so upsampling (transposed convolutions, skips) is needed. Convolutions are equivariant, not invariant, and the receptive field is unchanged.`,
    },
    {
      kind: 'widget',
      title: 'Transposed convolution: upsampling with a kernel',
      body: String.raw`A **transposed convolution** (sometimes misleadingly called "deconvolution") runs a convolution's data flow in reverse: each *input* value stamps a scaled copy of the kernel into the output, the stamps are placed $s$ apart, and overlaps add. Output size:
$$m=(n-1)\,s-2p+k.$$`,
      widget: {
        type: 'StepReveal',
        props: {
          steps: [
            String.raw`Input $(1,\,2)$, kernel $(1,1,1)$, stride $s=2$, $p=0$. Output length $(2-1)\cdot2+3=5$.`,
            String.raw`Input value $1$ stamps $1\cdot(1,1,1)$ at positions 0–2: $\;(1,1,1,0,0)$.`,
            String.raw`Input value $2$ stamps $2\cdot(1,1,1)$ at positions 2–4 (shifted by $s=2$): $\;(0,0,2,2,2)$.`,
            String.raw`Add: $(1,1,3,2,2)$. Position 2 got two stamps — overlap is uneven because $k=3$ is not a multiple of $s=2$.`,
            String.raw`In 2D this uneven overlap produces **checkerboard artifacts**. Remedies: choose $k$ divisible by $s$ (e.g. $k=2,s=2$ as in U-Net, or $k=4,s=2$), or resize (nearest/bilinear) and then apply a normal convolution.`,
          ],
          notes: ['', 'scatter, not gather', '', 'overlaps add', ''],
        },
      },
    },
    {
      kind: 'numeric',
      prompt: String.raw`A transposed convolution with kernel $k=4$, stride $s=2$, padding $p=1$ is applied to a $16\times16$ feature map. What is the output side length?`,
      answer: 32,
      why: String.raw`$m=(16-1)\cdot2-2\cdot1+4=30-2+4=32$: exactly doubled. This $k=4,s=2,p=1$ setting is the standard "×2 upsample", the transpose of a $k=4,s=2,p=1$ convolution taking 32 → 16.`,
    },
    {
      kind: 'explain',
      title: 'U-Net: a symmetric encoder–decoder',
      body: String.raw`Ronneberger, Fischer & Brox designed U-Net for biomedical images, where annotated data is scarce.

- **Contracting path** (encoder): repeated blocks of two $3\times3$ convs + ReLU, then $2\times2$ max pooling; channels double each level, 64 → 1024.
- **Expanding path** (decoder): a $2\times2$ **up-convolution** halves the channels and doubles the resolution; the result is **concatenated** with the encoder feature map of the same level, then two $3\times3$ convs.
- A final $1\times1$ conv maps 64 channels to class scores per pixel.

The skips hand the decoder the encoder's high-resolution features, so boundaries come out sharp.`,
    },
    {
      kind: 'widget',
      title: 'The "U"',
      widget: { type: 'SvgDiagram', props: { svg: UNET_SVG }, caption: 'Down the left, context grows and resolution shrinks; up the right, resolution is restored, with fine detail copied straight across the skips.' },
    },
    {
      kind: 'fill',
      prompt: 'The contracting path gives each unit a large ___, so it knows *what* is there. Skip connections carry high-___ encoder features so the decoder knows *where* the boundaries are. U-Net ___ the skip features with the upsampled ones, whereas FCN ___ its skip predictions.',
      bank: ['receptive field', 'resolution', 'concatenates', 'adds', 'kernel', 'multiplies', 'stride'],
      answer: ['receptive field', 'resolution', 'concatenates', 'adds'],
      why: String.raw`Depth and pooling enlarge the receptive field (context); skips restore fine spatial detail. U-Net stacks the copied features as extra channels (concatenation) and lets convolutions combine them; FCN sums upsampled coarse score maps with scores from finer layers.`,
    },
    {
      kind: 'numeric',
      prompt: String.raw`The original U-Net uses **unpadded** ("valid") $3\times3$ convolutions. Its $572\times572$ input goes through two such convolutions and then $2\times2$ max pooling with stride 2. What is the side length after the pooling?`,
      answer: 284,
      why: String.raw`Each valid $3\times3$ conv removes 2: $572\to570\to568$. Pooling halves: $284$. Because of these border losses the full network maps $572\times572$ to a $388\times388$ output; large images are processed in overlapping tiles. Many modern U-Nets use padding instead, so output size equals input size.`,
    },
    {
      kind: 'explain',
      title: 'Losses and metrics for segmentation',
      body: String.raw`**Loss:** per-pixel cross-entropy, summed (or averaged) over pixels. Rare classes and thin structures get swamped by background, so weights are added: U-Net used a weight map that up-weights the narrow gaps between touching cells. Overlap-based losses such as soft **Dice** are also common.

**Metrics:** for a predicted mask $A$ and true mask $B$,
$$\text{IoU}=\frac{|A\cap B|}{|A\cup B|},\qquad \text{Dice}=\frac{2|A\cap B|}{|A|+|B|}.$$
Both are 1 for a perfect mask and 0 for no overlap; pixel accuracy is misleading when 95% of pixels are background.

U-Net was trained on just 30 annotated $512\times512$ electron-microscopy images, relying heavily on data augmentation with random elastic deformations.`,
    },
    {
      kind: 'numeric',
      prompt: String.raw`A predicted mask has 40 pixels, the true mask has 50 pixels, and 30 pixels are in both. What is the IoU?`,
      answer: 0.5,
      tolerance: 0.005,
      why: String.raw`$|A\cup B|=40+50-30=60$, so IoU $=30/60=0.5$. (Dice would be $2\cdot30/(40+50)\approx0.67$ — Dice is always at least as large as IoU.)`,
    },
    {
      kind: 'explain',
      title: 'U-Nets inside diffusion models',
      body: String.raw`A [diffusion model](@ml/diffusion-models) learns a denoiser $\boldsymbol\epsilon_\theta(\mathbf x_t,t)$ that predicts, *for every pixel*, the noise in a noisy image $\mathbf x_t$. That is a dense-prediction problem with output size = input size, and the U-Net shape fits it naturally: coarse levels capture global structure, skips preserve fine detail.

Ho, Jain & Abbeel's DDPM used a U-Net with residual blocks, group normalization, self-attention at the $16\times16$ level, and the time step $t$ fed in through a sinusoidal embedding added inside each residual block. Latent diffusion (Stable Diffusion) runs a similar U-Net on a compressed latent and injects text through cross-attention. Newer systems often replace the U-Net by a transformer on patches.`,
    },
    {
      kind: 'truefalse',
      prompt: 'An encoder–decoder with skip connections must produce an output smaller than its input.',
      answer: false,
      why: String.raw`The original U-Net's output ($388\times388$ from $572\times572$) is smaller only because it uses unpadded convolutions. With "same" padding the output matches the input exactly — which is what diffusion denoisers need, since they predict noise for every input pixel.`,
    },
    {
      kind: 'order',
      prompt: 'Order the steps of one U-Net decoder level, starting from the coarser feature map below it.',
      steps: [
        'Upsample the coarser feature map with a 2×2 up-convolution (halving its channels)',
        'Concatenate it with the encoder feature map from the same level (cropped if needed)',
        'Apply two 3×3 convolutions with ReLU',
        'Pass the result up to the next decoder level (or, at the top, to the 1×1 output conv)',
      ],
      why: 'Resolution must be restored before the encoder features can be concatenated (the spatial sizes must match); the convolutions then fuse coarse context with fine detail, and the result feeds the next level.',
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- Dense prediction outputs a value per pixel and needs both context (*what*) and resolution (*where*).
- FCN: convolutionalize the classifier, upsample the coarse score map, add skip predictions.
- Transposed convolution: each input stamps the kernel $s$ apart; $m=(n-1)s-2p+k$; uneven overlap causes checkerboards.
- U-Net: symmetric encoder–decoder; skips **concatenate** encoder features into the decoder.
- Train with weighted per-pixel cross-entropy or Dice; evaluate with IoU/Dice, not pixel accuracy.
- The same shape powers diffusion denoisers.`,
    },
  ],
  references: [
    { authors: 'J. Long, E. Shelhamer & T. Darrell', title: 'Fully Convolutional Networks for Semantic Segmentation', year: 2015, venue: 'CVPR', url: 'https://arxiv.org/abs/1411.4038' },
    { authors: 'O. Ronneberger, P. Fischer & T. Brox', title: 'U-Net: Convolutional Networks for Biomedical Image Segmentation', year: 2015, venue: 'MICCAI (LNCS 9351)', url: 'https://arxiv.org/abs/1505.04597' },
    { authors: 'V. Dumoulin & F. Visin', title: 'A guide to convolution arithmetic for deep learning', year: 2016, venue: 'arXiv:1603.07285', detail: 'Ch. 4 (transposed convolution arithmetic)', url: 'https://arxiv.org/abs/1603.07285' },
    { authors: 'J. Ho, A. Jain & P. Abbeel', title: 'Denoising Diffusion Probabilistic Models', year: 2020, venue: 'NeurIPS', url: 'https://arxiv.org/abs/2006.11239' },
    { authors: 'S. J. D. Prince', title: 'Understanding Deep Learning', year: 2023, venue: 'MIT Press', detail: '§10.4 (upsampling), §11.5.3 (U-Nets)', url: 'https://udlbook.github.io/udlbook/' },
  ],
} satisfies LessonContent;
