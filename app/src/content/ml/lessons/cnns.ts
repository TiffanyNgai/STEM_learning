import type { LessonContent } from '../../types';

// Equivariance vs invariance: a shifted input gives a shifted feature map; global pooling then forgets the position.
const EQUI_SVG = (() => {
  const row = (x0: number, y: number, on: number[], col: string, lab: string) =>
    Array.from({ length: 8 }, (_, i) => `<rect x="${x0 + i * 12}" y="${y}" width="11" height="11" fill="${on.includes(i) ? col : 'var(--surface)'}" stroke="var(--muted)" stroke-width="0.5"/>`).join('') +
    `<text x="${x0 - 4}" y="${y + 9}" font-size="8" text-anchor="end" fill="var(--muted)">${lab}</text>`;
  const arrow = (x1: number, y1: number, x2: number, y2: number, t: string) =>
    `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="var(--fg)" stroke-width="0.8" marker-end="url(#ah)"/><text x="${(x1 + x2) / 2 + 4}" y="${(y1 + y2) / 2 + 3}" font-size="8" fill="var(--fg)">${t}</text>`;
  const slide = `<animateTransform attributeName="transform" type="translate" values="0 0;0 0;24 0;24 0;0 0" keyTimes="0;0.2;0.45;0.8;1" dur="6s" repeatCount="indefinite"/>`;
  return `<svg viewBox="0 0 320 190" xmlns="http://www.w3.org/2000/svg">
<defs><marker id="ah" viewBox="0 0 6 6" refX="5" refY="3" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L6,3 L0,6 z" fill="var(--fg)"/></marker></defs>
<text x="160" y="12" font-size="9" text-anchor="middle" fill="var(--fg)">the pattern slides right by 2 pixels…</text>
<g transform="translate(0 0)">${row(60, 22, [], 'var(--c3)', 'input x')}<g>${slide}<rect x="84" y="22" width="11" height="11" fill="var(--c3)"/><rect x="96" y="22" width="11" height="11" fill="var(--c3)"/></g></g>
${arrow(108, 37, 108, 66, 'conv, stride 1')}
<g>${row(60, 70, [], 'var(--c2)', 'feature map')}<g>${slide}<rect x="72" y="70" width="11" height="11" fill="var(--c2)" opacity="0.5"/><rect x="84" y="70" width="11" height="11" fill="var(--c2)"/><rect x="96" y="70" width="11" height="11" fill="var(--c2)"/><rect x="108" y="70" width="11" height="11" fill="var(--c2)" opacity="0.5"/></g></g>
<text x="170" y="80" font-size="8" fill="var(--c2)">→ shifts too: EQUIVARIANT</text>
${arrow(108, 85, 108, 114, 'global max / average pool')}
<rect x="96" y="118" width="24" height="14" fill="var(--c1)" opacity="0.8"/><text x="108" y="128" font-size="8" text-anchor="middle" fill="var(--fg)">same</text>
<text x="170" y="128" font-size="8" fill="var(--c1)">→ unchanged: INVARIANT</text>
<text x="160" y="156" font-size="8" text-anchor="middle" fill="var(--muted)">Exact only for stride 1 away from the borders (or with circular padding).</text>
<text x="160" y="170" font-size="8" text-anchor="middle" fill="var(--muted)">With stride s, only shifts by multiples of s are passed through cleanly.</text>
</svg>`;
})();

export default {
  cards: [
    {
      kind: 'explain',
      title: 'Why not a plain MLP on pixels?',
      body: String.raw`A $224\times224$ colour photo has $224\cdot224\cdot3=150{,}528$ numbers. A single fully connected layer from it to just 1000 hidden units needs about $1.5\times10^8$ weights — before learning anything useful.

Images have two pieces of structure that an [MLP](@ml/neural-networks-intro) ignores:

- **Locality:** a pixel is mostly related to its neighbours (edges, textures, parts).
- **Stationarity:** a cat's ear looks the same wherever it appears, so a detector useful in one place is useful everywhere.

A **convolutional neural network (CNN)** builds both in: each unit looks at a small neighbourhood, and the *same* small set of weights is reused at every position (**weight sharing**).`,
    },
    {
      kind: 'explain',
      title: 'The convolution operation',
      body: String.raw`A **kernel** (or filter) $K$ is a small grid of weights, e.g. $3\times3$. Slide it over the image $X$; at each position multiply overlapping entries and add:

$$Y[i,j]=\sum_{a=0}^{2}\sum_{b=0}^{2}K[a,b]\;X[i+a,\,j+b]\;(+\,\text{bias}).$$

The output $Y$ is a **feature map**: it is large wherever the image locally *looks like* the kernel.

1D example: $X=(1,2,3,4,5)$, $K=(1,0,-1)$ gives $Y=(1-3,\,2-4,\,3-5)=(-2,-2,-2)$ — a (negated) slope detector.

Strictly, this is **cross-correlation**; true mathematical convolution flips the kernel first. Since $K$ is learned, the flip makes no difference, and deep-learning libraries compute the unflipped version. The maths of real convolution, and why the Fourier transform turns it into multiplication, lives in [the Fourier transform](@math/fourier-transform).`,
    },
    {
      kind: 'widget',
      title: 'Slide a kernel yourself',
      body: String.raw`The orange box is the kernel's current footprint; the matching output cell is outlined on the right. Try the presets: **blur** averages ($\tfrac19$ of the sum), **vertical edge** (a Sobel filter) responds to left–right brightness changes and is $0$ on flat regions, **Laplacian** responds to blobs and corners. Then tap kernel cells to invent your own filter.`,
      widget: { type: 'MlConvKernel', props: { image: 'square', kernel: 'sobel' }, caption: 'Blue = positive response, red = negative. A CNN *learns* its kernels by [backpropagation](@ml/backpropagation) instead of hand-designing them.' },
    },
    {
      kind: 'numeric',
      prompt: String.raw`Apply the vertical-edge kernel $K=\begin{pmatrix}-1&0&1\\-2&0&2\\-1&0&1\end{pmatrix}$ to the $3\times3$ patch $\begin{pmatrix}0&1&1\\0&1&1\\0&1&1\end{pmatrix}$ (multiply entrywise and sum). What is the output value?`,
      answer: 4,
      why: String.raw`Only the outer columns matter (the middle column of $K$ is 0). Left column: $(-1-2-1)\cdot0=0$. Right column: $(1+2+1)\cdot1=4$. Total $4$: a dark-to-bright edge. On a uniform patch the two columns cancel and the output is $0$.`,
    },
    {
      kind: 'explain',
      title: 'Padding, stride and output size',
      body: String.raw`An $n\times n$ input, $k\times k$ kernel, **padding** $p$ (rings of zeros added around the border) and **stride** $s$ (step between kernel positions) give an output of side

$$m=\left\lfloor\frac{n+2p-k}{s}\right\rfloor+1.$$

- "Valid" ($p=0$, $s=1$): shrinks by $k-1$. LeNet's $32\times32$ input with $5\times5$ kernels gives $28\times28$.
- "Same" ($p=(k-1)/2$, $s=1$): size preserved — $3\times3$ with $p=1$.
- Stride 2 roughly halves each side: cheap **downsampling**.

Change $p$ and $s$ in the widget above and watch the formula update. Dumoulin & Visin's guide works through every case, including transposed convolutions.`,
    },
    {
      kind: 'numeric',
      prompt: String.raw`ResNet's first layer applies a $7\times7$ convolution with stride $2$ and padding $3$ to a $224\times224$ image. What is the side length of the output?`,
      answer: 112,
      why: String.raw`$m=\lfloor(224+6-7)/2\rfloor+1=\lfloor223/2\rfloor+1=111+1=112$. Forgetting the floor, or forgetting the $+1$, are the usual slips.`,
    },
    {
      kind: 'explain',
      title: 'Channels: many kernels, many inputs',
      body: String.raw`Real inputs have $C_{\text{in}}$ **channels** (3 for RGB; later layers have dozens to thousands). Each kernel then spans *all* input channels: shape $C_{\text{in}}\times k\times k$, summed over channels. A layer learns $C_{\text{out}}$ such kernels, giving $C_{\text{out}}$ output feature maps.

$$\#\text{params}=k^2\,C_{\text{in}}\,C_{\text{out}}+C_{\text{out}}\ \text{(biases)}.$$

Crucially this does **not** depend on the image size: the same weights are reused at every position. A **$1\times1$ convolution** ($k=1$) mixes channels at each pixel without looking at neighbours — a per-pixel linear layer, used to change channel counts cheaply.`,
    },
    {
      kind: 'numeric',
      prompt: String.raw`How many learnable parameters (weights + biases) does a $3\times3$ convolution from 64 to 128 channels have?`,
      answer: 73856,
      why: String.raw`$3\cdot3\cdot64\cdot128=73{,}728$ weights plus $128$ biases $=73{,}856$. A common error is to forget that each kernel spans all 64 input channels.`,
    },
    {
      kind: 'explain',
      title: 'Equivariance vs invariance, precisely',
      body: String.raw`Let $T_u$ shift an image by $u$ pixels: $(T_uX)[i]=X[i-u]$.

- A map $f$ is **translation-equivariant** if $f(T_uX)=T_u f(X)$: shift in, shift out.
- A map $g$ is **translation-invariant** if $g(T_uX)=g(X)$: shift in, *same* out.

A stride-1 convolution is exactly equivariant on an infinite grid (or with circular padding); with zero padding it holds except near the border. Pointwise nonlinearities like ReLU keep equivariance.

**Stride breaks it:** with stride $s$, $f(T_{su}X)=T_uf(X)$ only for shifts that are multiples of $s$; a 1-pixel shift can change the output non-trivially (aliasing). So whole CNNs are only *approximately* shift-robust — small shifts can measurably change their predictions (Azulay & Weiss).`,
      widget: { type: 'SvgDiagram', props: { svg: EQUI_SVG }, caption: 'Convolution is equivariant; pooling over all positions makes the result invariant.' },
    },
    {
      kind: 'widget',
      title: 'Test it: shift the input',
      body: 'Pick the **edge** image and the **vertical edge** kernel. With stride 1, press **shift →**: the response moves one cell per pixel of shift. Now set stride 2 and compare shifts 0, 1 and 2. A 2-pixel shift moves the output by exactly one cell; a 1-pixel shift has no faithful counterpart — the response jumps a whole cell (or, for the **dot** image with **blur**, changes its values).',
      widget: { type: 'MlConvKernel', props: { image: 'edge', kernel: 'sobel', stride: 1, autoplay: false } },
    },
    {
      kind: 'truefalse',
      prompt: 'A convolution with stride 2 is equivariant to shifting the input by one pixel: the output is simply shifted by half a pixel.',
      answer: false,
      why: String.raw`Outputs exist only on a grid of step 2, so there is no "half-pixel shift". A stride-$s$ convolution commutes only with shifts that are multiples of $s$ ($f(T_{2}X)=T_1f(X)$); a 1-pixel shift samples the response at different places and can change it.`,
    },
    {
      kind: 'explain',
      title: 'Pooling',
      body: String.raw`A **pooling** layer summarizes each small window, typically $2\times2$ with stride 2: **max pooling** keeps the largest value, **average pooling** the mean. It halves the resolution and has no parameters.

Pooling gives **approximate local invariance**: if a feature moves by a pixel but stays inside the same window, a max pool's output is unchanged. It is not exact — a move across a window boundary changes it.

**Global average pooling** averages each channel over all positions, turning a $C\times h\times w$ map into a $C$-vector. Applied to an exactly equivariant map, it is exactly invariant (up to border effects). Modern classifiers end with it, followed by one linear layer.`,
    },
    {
      kind: 'fill',
      prompt: 'A stride-1 convolution is translation ___: shifting the input shifts the feature map. Max pooling over small windows makes the output ___ invariant to small shifts, while pooling over all positions (global pooling) of a stride-1 feature map gives ___ invariance, apart from border effects.',
      bank: ['equivariant', 'invariant', 'approximately', 'exactly', 'never', 'exact'],
      answer: ['equivariant', 'approximately', 'exact'],
      why: String.raw`Convolution commutes with shifts (equivariance), it does not ignore them. Local max pooling only absorbs shifts that stay within a window, so its invariance is approximate. Summing or maxing over *every* position discards location entirely, giving exact invariance when the feature map is exactly equivariant.`,
    },
    {
      kind: 'widget',
      title: 'Receptive fields grow with depth',
      body: String.raw`The **receptive field** of a unit is the set of input pixels that can affect it. Each extra $k$-wide layer adds $k-1$ input steps, times the product of all earlier strides:

$$r_L=1+\sum_{l=1}^{L}(k_l-1)\prod_{i<l}s_i.$$

Stacking stride-1 $3\times3$ layers grows $r$ only linearly ($3,5,7,\dots$); stride 2 (or pooling) makes it grow exponentially. **Dilated** convolutions (gaps of $d$ between kernel taps) also grow it exponentially without losing resolution.`,
      widget: { type: 'MlReceptiveField', props: { layers: 3, kernel: 3, mode: 'plain', width: 48 }, caption: 'Switch to stride 2 and add layers: the cone at the input widens fast.' },
    },
    {
      kind: 'numeric',
      prompt: String.raw`Three $3\times3$ convolution layers, each with stride $2$. What is the receptive field (side length, in input pixels) of one unit in the third layer?`,
      answer: 15,
      why: String.raw`$r=1+(3-1)\cdot1+(3-1)\cdot2+(3-1)\cdot4=1+2+4+8=15$. With stride 1 it would be only $1+2+2+2=7$: strides multiply the reach of every later layer.`,
    },
    {
      kind: 'mcq',
      prompt: 'Compared with a fully connected layer on the same image, what does weight sharing in a convolutional layer primarily buy?',
      choices: [
        'A parameter count independent of image size, plus translation equivariance, because one small kernel is reused at every position.',
        'Exact invariance of the layer output to any translation of the input.',
        'The ability to represent functions an MLP cannot represent at any width.',
        'Faster training only because convolutions avoid backpropagation.',
      ],
      answer: 0,
      why: String.raw`Reusing one kernel everywhere means the parameter count is $k^2C_{\text{in}}C_{\text{out}}$ no matter the image size, and the layer commutes with shifts. A conv layer is equivariant, not invariant. A wide enough MLP can in principle represent the same functions — the gain is a strong, correct prior and far fewer parameters. CNNs are trained by ordinary backpropagation.`,
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- A conv layer slides $C_{\text{out}}$ kernels of shape $C_{\text{in}}\times k\times k$ over the input; params $=k^2C_{\text{in}}C_{\text{out}}+C_{\text{out}}$, independent of image size.
- Output side: $m=\lfloor(n+2p-k)/s\rfloor+1$.
- Stride-1 convolution is translation-**equivariant** (exactly, away from borders); stride $s$ keeps equivariance only for shifts that are multiples of $s$.
- Local pooling gives **approximate** invariance; global pooling of an equivariant map gives invariance.
- Receptive fields: $r_L=1+\sum_l(k_l-1)\prod_{i<l}s_i$ — linear growth with stride 1, exponential with striding, pooling or dilation.`,
    },
  ],
  references: [
    { authors: 'I. Goodfellow, Y. Bengio & A. Courville', title: 'Deep Learning', year: 2016, venue: 'MIT Press', detail: 'Ch. 9 (Convolutional Networks)', url: 'https://www.deeplearningbook.org' },
    { authors: 'V. Dumoulin & F. Visin', title: 'A guide to convolution arithmetic for deep learning', year: 2016, venue: 'arXiv:1603.07285', url: 'https://arxiv.org/abs/1603.07285' },
    { authors: 'Y. LeCun, L. Bottou, Y. Bengio & P. Haffner', title: 'Gradient-Based Learning Applied to Document Recognition', year: 1998, venue: 'Proceedings of the IEEE 86(11), 2278–2324' },
    { authors: 'A. Azulay & Y. Weiss', title: 'Why do deep convolutional networks generalize so poorly to small image transformations?', year: 2019, venue: 'JMLR 20(184), 1–25', url: 'https://arxiv.org/abs/1805.12177' },
    { authors: 'S. J. D. Prince', title: 'Understanding Deep Learning', year: 2023, venue: 'MIT Press', detail: 'Ch. 10', url: 'https://udlbook.github.io/udlbook/' },
  ],
} satisfies LessonContent;
