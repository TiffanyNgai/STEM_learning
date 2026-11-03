import type { LessonContent } from '../../types';

// ILSVRC top-5 test error of competition entries (values as reported in the respective papers / challenge results).
const BARS: [string, string, number, string][] = [
  ['2012', 'runner-up (non-deep)', 26.2, 'var(--muted)'],
  ['2012', 'AlexNet', 15.3, 'var(--c3)'],
  ['2014', 'VGG', 7.3, 'var(--c2)'],
  ['2014', 'GoogLeNet', 6.7, 'var(--c4)'],
  ['2015', 'ResNet', 3.57, 'var(--c1)'],
];
const ERR_SVG = `<svg viewBox="0 0 320 190" xmlns="http://www.w3.org/2000/svg">
<text x="160" y="12" font-size="9" text-anchor="middle" fill="var(--fg)">ImageNet (ILSVRC) top-5 classification error, %</text>
<line x1="30" y1="160" x2="312" y2="160" stroke="var(--fg)" stroke-width="0.8"/>
${[0, 10, 20, 30].map((v) => `<line x1="30" x2="312" y1="${160 - v * 4.5}" y2="${160 - v * 4.5}" stroke="var(--grid)" stroke-width="0.5"/><text x="26" y="${163 - v * 4.5}" font-size="8" text-anchor="end" fill="var(--muted)">${v}</text>`).join('')}
${BARS.map(([yr, name, v, col], i) => {
  const x = 42 + i * 55, h = v * 4.5;
  return `<rect x="${x}" y="${160 - h}" width="40" height="${h}" fill="${col}" opacity="0.85"><animate attributeName="height" from="0" to="${h}" dur="${0.6 + i * 0.3}s" fill="freeze"/><animate attributeName="y" from="160" to="${160 - h}" dur="${0.6 + i * 0.3}s" fill="freeze"/></rect>
<text x="${x + 20}" y="${155 - h}" font-size="8.5" text-anchor="middle" fill="var(--fg)">${v}</text>
<text x="${x + 20}" y="171" font-size="8" text-anchor="middle" fill="var(--fg)">${name.split(' ')[0]}</text>
<text x="${x + 20}" y="182" font-size="7.5" text-anchor="middle" fill="var(--muted)">${yr}${name.includes('(') ? ' (no CNN)' : ''}</text>`;
}).join('\n')}
</svg>`;

export default {
  cards: [
    {
      kind: 'explain',
      title: 'Twenty-five years of CNN design',
      body: String.raw`The [convolution, pooling and channel](@ml/cnns) building blocks barely changed between 1998 and today. What changed is how they are **stacked**, how deep the stacks are, and the tricks that make deep stacks trainable.

The ImageNet challenge (ILSVRC: 1.2 million training images, 1000 classes) made progress measurable. "Top-5 error" counts an image as wrong only if the true label is not among the model's five best guesses.`,
      widget: { type: 'SvgDiagram', props: { svg: ERR_SVG }, caption: 'Competition entries (often ensembles). In 2014 GoogLeNet won classification; VGG came second but its simple design became the more widely copied one.' },
    },
    {
      kind: 'explain',
      title: 'LeNet-5 (1998): the template',
      body: String.raw`LeCun et al. read handwritten digits (cheques, postcodes) with a small CNN:

$32\times32$ input → **conv** $5\times5$, 6 maps ($28\times28$) → **subsample** ($14\times14$) → **conv** $5\times5$, 16 maps ($10\times10$) → **subsample** ($5\times5$) → fully connected 120 → 84 → 10 outputs.

About 60,000 trainable parameters, sigmoid-type activations, trained by gradient descent with backpropagation. The pattern — *alternate convolution and downsampling, shrinking space while growing channels, then a small classifier* — is still the skeleton of every CNN.`,
    },
    {
      kind: 'numeric',
      prompt: String.raw`A $32\times32$ image passes through a $5\times5$ valid convolution (stride 1, no padding), then $2\times2$ pooling with stride 2, then another $5\times5$ valid convolution. What is the side length of the resulting feature maps?`,
      answer: 10,
      why: String.raw`$32-5+1=28$; pooling halves to $14$; $14-5+1=10$. These are LeNet-5's $16$ maps of size $10\times10$ (layer C3). Valid convolutions shrink by $k-1$, not $k$.`,
    },
    {
      kind: 'explain',
      title: 'AlexNet (2012): scale + ReLU + GPUs',
      body: String.raw`Krizhevsky, Sutskever & Hinton trained a much bigger CNN on ImageNet: 5 convolutional layers (the first with $96$ kernels of size $11\times11$, stride 4) and 3 fully connected layers — about **60 million parameters** — split across **two GPUs**.

Key ingredients:
- **ReLU** activations $\max(0,z)$, which trained several times faster than tanh units.
- **Dropout** in the fully connected layers against overfitting.
- **Data augmentation**: random crops, flips and colour perturbations.

Its 15.3% top-5 error beat the runner-up's 26.2% by a wide margin and started the deep-learning era in vision.`,
    },
    {
      kind: 'match',
      prompt: 'Match each network to an idea it is best known for.',
      pairs: [
        ['LeNet-5', 'Conv/subsample/fully-connected template for digit recognition'],
        ['AlexNet', 'ReLU, dropout and GPU training at ImageNet scale'],
        ['VGG', 'Only stacked 3×3 convolutions, 16–19 weight layers'],
        ['ResNet', 'Identity shortcut connections enabling 100+ layers'],
        ['ConvNeXt', 'Modernized ResNet with transformer-era design choices'],
      ],
      why: 'Each architecture contributed one main lesson: the template (LeNet), that scale + ReLU + GPUs work (AlexNet), that depth with uniform small kernels works (VGG), how to train very deep nets (ResNet), and that convnets remain competitive when given a modern recipe (ConvNeXt).',
    },
    {
      kind: 'explain',
      title: 'VGG (ILSVRC 2014, ICLR 2015): small kernels, more depth',
      body: String.raw`Simonyan & Zisserman used **only $3\times3$ convolutions** (stride 1, padding 1) and $2\times2$ max pooling, going to 16–19 weight layers.

Why tiny kernels? Two stacked $3\times3$ layers have a $5\times5$ [receptive field](@ml/cnns); three have $7\times7$. With $C$ channels in and out, three $3\times3$ layers cost $3\cdot(3^2C^2)=27C^2$ weights, versus $49C^2$ for one $7\times7$ layer — and they insert three nonlinearities instead of one.

The cost: VGG-16 has about 138 million parameters (most in its fully connected layers) and is slow — about 15 billion multiply–adds per $224\times224$ image (VGG-19: about 20 billion).`,
    },
    {
      kind: 'numeric',
      prompt: String.raw`With $C$ input and $C$ output channels (no biases), how many times more weights does one $7\times7$ conv layer have than a stack of three $3\times3$ layers with the same receptive field? Give a decimal.`,
      answer: 1.815,
      tolerance: 0.01,
      why: String.raw`$49C^2/(27C^2)=49/27\approx1.81$: the single big kernel is about 81% more expensive, and it applies only one nonlinearity instead of three.`,
    },
    {
      kind: 'recall',
      title: 'Residual connections (recap)',
      points: [
        String.raw`A residual block outputs $\mathbf h+F(\mathbf h)$: the layers learn a *correction* $F$ to the identity.`,
        String.raw`The Jacobian becomes $I+\partial F/\partial\mathbf h$, so gradients have a direct identity path back to early layers.`,
        'Plain stacks get *harder to optimize* as they deepen (higher training error), not just more overfit.',
        String.raw`Stacked residual blocks resemble Euler steps $\mathbf h_{l+1}=\mathbf h_l+F(\mathbf h_l)$ of an ODE.`,
      ],
      link: 'ml/residual-connections',
    },
    {
      kind: 'explain',
      title: 'ResNet (2016): going 152 layers deep',
      body: String.raw`He et al. observed **degradation**: a 56-layer plain CNN on CIFAR-10 had *higher training error* than a 20-layer one (and a 34-layer plain net was worse than an 18-layer one on ImageNet). Overfitting cannot explain higher *training* error — it is an optimization problem.

Fix: wrap every 2–3 conv layers in an identity shortcut, $\mathbf y=F(\mathbf x)+\mathbf x$, with batch normalization after each convolution. Deeper ResNets use a **bottleneck** block: $1\times1$ conv shrinks channels (e.g. 256 → 64), $3\times3$ conv works at the narrow width, $1\times1$ conv expands back (64 → 256).

ResNet-152 has fewer multiply–adds than VGG-16/19. A ResNet ensemble reached 3.57% top-5 error, winning ILSVRC 2015.`,
    },
    {
      kind: 'widget',
      title: 'Plain vs residual stacks at initialization',
      body: 'Gradient size at each layer of a deep plain stack (red) and the same stack with identity shortcuts (green). Increase the depth: the plain stack\'s early-layer gradients shrink or blow up geometrically, while the residual stack stays within a modest range.',
      widget: { type: 'MlResidualGrad', props: { activation: 'relu', depth: 30 } },
    },
    {
      kind: 'mcq',
      prompt: 'What problem did He et al. mainly use residual connections to solve?',
      choices: [
        'Deeper plain networks reached higher *training* error than shallower ones — an optimization difficulty.',
        'Deeper networks overfit, so their test error was higher while training error was lower.',
        'Convolutions could not be computed on GPUs beyond about 20 layers.',
        'Pooling layers destroyed translation equivariance.',
      ],
      answer: 0,
      why: String.raw`The decisive evidence was *training* error rising with depth (the degradation problem), which overfitting cannot cause, since a deeper net could copy the shallow one and set extra layers to identity. Shortcuts make the identity the easy default, so extra depth no longer hurts optimization.`,
    },
    {
      kind: 'explain',
      title: 'The stage pattern: halve space, double channels',
      body: String.raw`ResNet and VGG are organized in **stages**. Within a stage, resolution and width are fixed; at the start of the next stage a stride-2 conv (or pooling) halves height and width and the channel count doubles (ResNet: 64 → 128 → 256 → 512 base widths). A **global average pool** and one linear layer finish.

Why double the channels? A $k\times k$ conv costs about $H\,W\,C_{\text{in}}\,C_{\text{out}}\,k^2$ multiply–adds. Halving $H$ and $W$ divides that by 4; doubling both $C_{\text{in}}$ and $C_{\text{out}}$ multiplies it by 4. So each layer costs roughly the same throughout the network, while features become coarser in space but richer in kind.`,
    },
    {
      kind: 'truefalse',
      prompt: String.raw`For a $3\times3$ convolution, going from a $56\times56\times64\to64$ layer to a $28\times28\times128\to128$ layer leaves the multiply–add count unchanged.`,
      answer: true,
      why: String.raw`$56\cdot56\cdot64\cdot64\cdot9=28\cdot28\cdot128\cdot128\cdot9$: the spatial factor drops by $4$ and the channel product rises by $4$. (The *parameter* count, $9\cdot C^2$, does grow by $4\times$.)`,
    },
    {
      kind: 'explain',
      title: 'ConvNeXt (2022): a ConvNet for the 2020s',
      body: String.raw`After [vision transformers](@ml/vision-transformers) overtook CNNs, Liu et al. asked how much was the architecture and how much the training recipe. Starting from ResNet-50 they applied, step by step:

- the transformer-era recipe (AdamW, long schedules, heavy augmentation);
- a **"patchify" stem**: a $4\times4$ conv with stride 4;
- **depthwise** convolutions (one $k\times k$ kernel per channel, $k^2C$ weights) with large $7\times7$ kernels;
- an **inverted bottleneck** (expand channels $4\times$ inside the block);
- GELU instead of ReLU, LayerNorm instead of BatchNorm, fewer normalization and activation layers.

The resulting pure CNN matched comparable Swin transformers on ImageNet and downstream tasks.`,
    },
    {
      kind: 'order',
      prompt: 'Put these architectures in order of publication.',
      steps: ['LeNet-5', 'AlexNet', 'VGG', 'ResNet', 'ConvNeXt'],
      why: 'LeNet-5 (Proc. IEEE 1998), AlexNet (NeurIPS 2012), VGG (ICLR 2015, arXiv 2014), ResNet (CVPR 2016, arXiv 2015), ConvNeXt (CVPR 2022).',
    },
    {
      kind: 'multi',
      prompt: 'Which of these are part of the ConvNeXt design?',
      choices: [
        'A 4×4, stride-4 "patchify" stem',
        '7×7 depthwise convolutions',
        'LayerNorm and GELU',
        'Global self-attention between all positions',
        '11×11 stride-4 first layer split across two GPUs',
      ],
      answers: [0, 1, 2],
      why: 'ConvNeXt borrows *design choices* from transformers (patchify stem, large kernels, inverted bottleneck, LayerNorm, GELU) but contains no attention at all — it is a pure convnet. The 11×11 stride-4 two-GPU first layer is AlexNet.',
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- LeNet-5 set the template: conv → downsample → … → small classifier.
- AlexNet showed scale, ReLU, dropout, augmentation and GPUs win on ImageNet.
- VGG: stacks of $3\times3$ kernels give large receptive fields with fewer weights ($27C^2$ vs $49C^2$) and more nonlinearity.
- ResNet: identity shortcuts cure the *optimization* problem of depth; bottleneck blocks keep 50–152 layers affordable.
- Stages halve resolution and double channels, keeping per-layer compute roughly constant.
- ConvNeXt: with a modern recipe and design tweaks, pure convnets match vision transformers.`,
    },
  ],
  references: [
    { authors: 'Y. LeCun, L. Bottou, Y. Bengio & P. Haffner', title: 'Gradient-Based Learning Applied to Document Recognition', year: 1998, venue: 'Proceedings of the IEEE 86(11), 2278–2324' },
    { authors: 'A. Krizhevsky, I. Sutskever & G. E. Hinton', title: 'ImageNet Classification with Deep Convolutional Neural Networks', year: 2012, venue: 'NeurIPS (NIPS 25)' },
    { authors: 'K. Simonyan & A. Zisserman', title: 'Very Deep Convolutional Networks for Large-Scale Image Recognition', year: 2015, venue: 'ICLR', url: 'https://arxiv.org/abs/1409.1556' },
    { authors: 'K. He, X. Zhang, S. Ren & J. Sun', title: 'Deep Residual Learning for Image Recognition', year: 2016, venue: 'CVPR', url: 'https://arxiv.org/abs/1512.03385' },
    { authors: 'Z. Liu, H. Mao, C.-Y. Wu, C. Feichtenhofer, T. Darrell & S. Xie', title: 'A ConvNet for the 2020s', year: 2022, venue: 'CVPR', url: 'https://arxiv.org/abs/2201.03545' },
  ],
} satisfies LessonContent;
