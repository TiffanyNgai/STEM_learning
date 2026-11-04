import type { LessonContent } from '../../types';

// The two-stage latent diffusion pipeline of Rombach et al. (2022).
const LDM_SVG = `<svg viewBox="0 0 320 150" xmlns="http://www.w3.org/2000/svg">
<defs><marker id="ldm-a" viewBox="0 0 6 6" refX="5" refY="3" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0L6,3L0,6z" fill="var(--fg)"/></marker></defs>
<rect x="4" y="18" width="84" height="78" rx="4" fill="none" stroke="var(--grid)" stroke-dasharray="3 2"/>
<text x="46" y="14" font-size="8" text-anchor="middle" fill="var(--muted)">pixel space</text>
<rect x="232" y="18" width="84" height="78" rx="4" fill="none" stroke="var(--grid)" stroke-dasharray="3 2"/>
<text x="274" y="14" font-size="8" text-anchor="middle" fill="var(--muted)">pixel space</text>
<rect x="8" y="40" width="34" height="34" fill="var(--c2)" opacity="0.3" stroke="var(--c2)"/>
<text x="25" y="86" font-size="8.5" text-anchor="middle" fill="var(--fg)">x  512²×3</text>
<line x1="44" y1="57" x2="54" y2="57" stroke="var(--fg)" marker-end="url(#ldm-a)"/>
<polygon points="56,42 74,50 74,64 56,72" fill="var(--c1)" opacity="0.35" stroke="var(--c1)"/>
<text x="65" y="60" font-size="9" text-anchor="middle" fill="var(--fg)">E</text>
<line x1="76" y1="57" x2="88" y2="57" stroke="var(--fg)" marker-end="url(#ldm-a)"/>
<rect x="90" y="48" width="18" height="18" fill="var(--c4)" opacity="0.45" stroke="var(--c4)"/>
<text x="99" y="86" font-size="8.5" text-anchor="middle" fill="var(--fg)">z  64²×4</text>
<rect x="112" y="24" width="106" height="66" rx="3" fill="var(--surface)" stroke="var(--c4)"/>
<text x="165" y="36" font-size="8.5" text-anchor="middle" fill="var(--c4)">latent diffusion</text>
<text x="165" y="48" font-size="8" text-anchor="middle" fill="var(--muted)">forward noising  →</text>
<text x="165" y="72" font-size="8" text-anchor="middle" fill="var(--muted)">←  ε_θ (U-Net), T steps</text>
<circle cx="130" cy="60" r="3.5" fill="var(--c3)"><animate attributeName="cx" values="124;206;124" dur="5s" repeatCount="indefinite"/></circle>
<line x1="220" y1="57" x2="232" y2="57" stroke="var(--fg)" marker-end="url(#ldm-a)"/>
<polygon points="236,50 254,42 254,72 236,64" fill="var(--c1)" opacity="0.35" stroke="var(--c1)"/>
<text x="245" y="60" font-size="9" text-anchor="middle" fill="var(--fg)">D</text>
<line x1="256" y1="57" x2="266" y2="57" stroke="var(--fg)" marker-end="url(#ldm-a)"/>
<rect x="268" y="40" width="34" height="34" fill="var(--c2)" opacity="0.3" stroke="var(--c2)"/>
<text x="285" y="86" font-size="8.5" text-anchor="middle" fill="var(--fg)">x̂  512²×3</text>
<rect x="112" y="116" width="106" height="20" rx="3" fill="var(--c6)" opacity="0.25" stroke="var(--c6)"/>
<text x="165" y="130" font-size="8.5" text-anchor="middle" fill="var(--fg)">τ_θ(y): frozen text encoder</text>
<line x1="165" y1="116" x2="165" y2="92" stroke="var(--c6)" marker-end="url(#ldm-a)"/>
<text x="171" y="106" font-size="8" fill="var(--c6)">cross-attention: K, V</text>
<text x="4" y="148" font-size="8" fill="var(--muted)">E and D are trained once and frozen; only ε_θ (and τ_θ, if not frozen) is trained for generation</text>
</svg>`;

export default {
  cards: [
    {
      kind: 'explain',
      title: 'Most pixels are not worth a diffusion step',
      body: String.raw`A 512×512 RGB image is 786,432 numbers. Running 50–1000 U-Net evaluations on a tensor that size is why early pixel-space diffusion models cost hundreds of GPU-days to train and seconds per image to sample.

But think about what those bits encode. Almost all of them describe texture and high-frequency detail that no viewer would miss — the *perceptually irrelevant* part of the signal. A likelihood-based model spends most of its capacity and compute there.

**Rombach et al. (2022)** split the problem in two:
1. **Perceptual compression** — an autoencoder that throws away imperceptible detail, once and for all;
2. **Semantic generation** — a diffusion model trained entirely in that small latent space.

The result, released as Stable Diffusion, made text-to-image diffusion runnable on a single consumer GPU.`,
    },
    {
      kind: 'recall',
      title: 'Recall: autoencoders and VAEs',
      points: [
        String.raw`An **encoder** $E$ maps $\mathbf x$ to a compact code $\mathbf z$; a **decoder** $D$ maps it back, trained so $D(E(\mathbf x))\approx\mathbf x$.`,
        String.raw`A **VAE** adds a prior: the encoder outputs a distribution $q(\mathbf z\mid\mathbf x)$ and a KL term $D_{\mathrm{KL}}(q\|\mathcal N(0,I))$ pulls the code space toward a standard normal.`,
        String.raw`A strong KL term buys a tidy, samplable latent space but costs reconstruction detail — the classic reason plain VAE samples look blurry.`,
      ],
      link: 'ml/vaes',
    },
    {
      kind: 'explain',
      title: 'The compression stage',
      body: String.raw`The encoder maps $\mathbf x\in\mathbb R^{H\times W\times3}$ to $\mathbf z\in\mathbb R^{h\times w\times c}$ with $h=H/f$, $w=W/f$ for a **downsampling factor** $f$. Rombach et al. tried $f\in\{1,2,4,8,16,32\}$ and found $f=4$ and $f=8$ to be the sweet spot: smaller $f$ leaves the diffusion model doing perceptual work, larger $f$ destroys information the decoder cannot recover. Stable Diffusion uses $f=8$, $c=4$.

Crucially it is **not** trained as a plain VAE. The objective combines
- a pixel reconstruction loss ($L_1$/$L_2$),
- a **perceptual** loss (LPIPS: distance between deep features, not pixels),
- a **patch-based adversarial** loss (a PatchGAN discriminator), which is what keeps textures crisp rather than blurry,
- and only a *weak* regularizer: either a small KL penalty toward $\mathcal N(0,I)$ (**KL-reg**) or a vector-quantization layer (**VQ-reg**).

The regularizer is deliberately feeble — it just stops the latents from drifting to arbitrary scale. (In Stable Diffusion the latents are additionally multiplied by a constant ≈0.18 so their standard deviation is about 1, which is what the diffusion noise schedule assumes.)`,
    },
    {
      kind: 'numeric',
      prompt: String.raw`Stable Diffusion encodes a $512\times512\times3$ image into a $64\times64\times4$ latent. By what factor does the number of values drop?`,
      answer: 48,
      tolerance: 0.1,
      why: String.raw`$512\cdot512\cdot3=786{,}432$ and $64\cdot64\cdot4=16{,}384$, so the ratio is exactly 48. The *compute* saving is larger still for the attention layers: the number of spatial tokens falls from $512^2$ to $64^2$, a factor of 64, and self-attention cost scales with the square of that.`,
    },
    {
      kind: 'widget',
      title: 'The whole pipeline',
      body: String.raw`Encode once, diffuse in the small space, decode once. $E$ and $D$ are trained first and then **frozen**, so a single autoencoder is reused across many generative models and many tasks (text-to-image, inpainting, super-resolution, video).`,
      widget: { type: 'SvgDiagram', props: { svg: LDM_SVG }, caption: String.raw`Training the diffusion model never touches pixels: the loss $\mathbb E\|\boldsymbol\varepsilon-\boldsymbol\varepsilon_\theta(\mathbf z_t,t,\tau_\theta(y))\|^2$ lives entirely in latent space.` },
    },
    {
      kind: 'mcq',
      prompt: 'Why does the latent-diffusion autoencoder use only a very weak KL penalty instead of a proper VAE-strength one?',
      choices: [
        'Because the KL term is intractable for convolutional encoders.',
        'Because the latent only has to be well-scaled, not directly samplable: the diffusion model learns whatever distribution the latents have, so strong regularization would only cost reconstruction detail.',
        'Because the decoder is adversarial and KL penalties destabilize GAN training.',
        'Because the latents are discrete, so a KL to a Gaussian is undefined.',
      ],
      answer: 1,
      why: String.raw`In a VAE you sample $\mathbf z\sim\mathcal N(0,I)$ at generation time, so the aggregate posterior must match the prior — hence a strong KL and blurry reconstructions. Here the *diffusion model* learns the latent distribution, so the autoencoder is free to prioritize fidelity; the penalty exists only to keep the latent variance in a sane range. (VQ-reg uses discrete codes, but the KL-reg variant is continuous.)`,
    },
    {
      kind: 'explain',
      title: 'The diffusion model itself is unchanged',
      body: String.raw`Everything from the previous lessons carries over with $\mathbf x$ replaced by $\mathbf z$:
$$\mathcal L_{\text{LDM}}=\mathbb E_{E(\mathbf x),\,\boldsymbol\varepsilon,\,t}\Big[\big\|\boldsymbol\varepsilon-\boldsymbol\varepsilon_\theta(\mathbf z_t,t,c)\big\|^2\Big],\qquad\mathbf z_t=\sqrt{\bar\alpha_t}\,\mathbf z_0+\sqrt{1-\bar\alpha_t}\,\boldsymbol\varepsilon .$$
Same schedule, same [DDIM sampler](@ml/ddim-sampling), same [classifier-free guidance](@ml/diffusion-guidance). Only the tensor is smaller — and because the latent is a spatially structured grid (not a flat vector), a convolutional [U-Net](@ml/unet-dense-prediction) with its inductive bias still fits perfectly.

One new failure mode: whatever the decoder cannot represent, the generator cannot produce. Fine text, faces at small scale and high-frequency grids are limited by $D$, not by $\boldsymbol\varepsilon_\theta$ — which is why later systems invested in better autoencoders (SDXL retrained the same $f=8$, $c=4$ one; Stable Diffusion 3 widened the latent to $c=16$).`,
    },
    {
      kind: 'explain',
      title: 'Conditioning by cross-attention',
      body: String.raw`How does a prompt get in? Encode it with a domain-specific encoder $\tau_\theta(y)$ into a sequence of $M$ token vectors (Stable Diffusion uses a **frozen** CLIP ViT-L/14 text encoder, $M=77$). Then insert **cross-attention** layers into the U-Net: with $\varphi_i(\mathbf z_t)$ the flattened spatial features of layer $i$,
$$Q=W_Q^{(i)}\varphi_i(\mathbf z_t),\quad K=W_K^{(i)}\tau_\theta(y),\quad V=W_V^{(i)}\tau_\theta(y),\qquad \operatorname{Attn}=\operatorname{softmax}\!\Big(\frac{QK^\top}{\sqrt d}\Big)V.$$
Read the shapes: **queries come from the image, keys and values from the prompt**. Each spatial position asks "which words concern me?" and pulls in their content. The softmax runs over the $M$ text tokens, so every position holds a distribution over words; the cost is linear in the number of text tokens, not quadratic.

The same mechanism accepts any sequence-encoded condition: class labels, layouts, bounding boxes, another image.`,
    },
    {
      kind: 'widget',
      title: 'Where does a word act?',
      body: String.raw`Pick a token and see which image positions attend to it. Maps like these (read off a real model's cross-attention layers) are the handle used by training-free editing methods: swap a word and transplant its attention map, and only the corresponding region changes.`,
      widget: { type: 'MlCrossAttentionMap', props: { token: 2 } , caption: 'Schematic: the scores here are hand-made so the mechanism is legible. A trained model learns them, and the maps are usually much noisier.' },
    },
    {
      kind: 'fill',
      prompt: String.raw`In latent diffusion's cross-attention, the ___ come from the image features and the ___ come from the prompt tokens, and the softmax is taken over the ___ .`,
      bank: ['queries', 'keys and values', 'gradients', 'prompt tokens', 'image positions', 'noise levels'],
      answer: ['queries', 'keys and values', 'prompt tokens'],
      why: String.raw`Self-attention would take $Q,K,V$ all from the image; cross-attention takes $K$ and $V$ from the conditioning sequence, so each spatial query receives a weighted sum of word vectors. Normalizing over the text tokens is what makes the per-position weights a distribution over words.`,
    },
    {
      kind: 'truefalse',
      prompt: 'A latent diffusion model needs its autoencoder and its denoiser to be trained jointly, end to end.',
      answer: false,
      why: String.raw`The two stages are trained separately: first the autoencoder (reconstruction + perceptual + adversarial losses), then the diffusion model on frozen latents. That is the point of the design — one autoencoder is amortized over many downstream generative models, and the diffusion training never has to backpropagate through a decoder.`,
    },
    {
      kind: 'order',
      prompt: 'Order the steps of generating an image from a prompt with a latent diffusion model.',
      steps: [
        String.raw`Encode the prompt: $\mathbf c=\tau_\theta(y)$ (and the null embedding for guidance)`,
        String.raw`Sample a latent $\mathbf z_T\sim\mathcal N(0,I)$ of shape $64\times64\times4$`,
        String.raw`Run the sampler: at each step evaluate $\boldsymbol\varepsilon_\theta(\mathbf z_t,t,\mathbf c)$ and $\boldsymbol\varepsilon_\theta(\mathbf z_t,t,\varnothing)$, combine with guidance weight, update $\mathbf z$`,
        String.raw`Decode once: $\hat{\mathbf x}=D(\mathbf z_0)$`,
      ],
      why: String.raw`The decoder runs a single time, at the very end — this is where the saving comes from. Guidance doubles the cost of each *latent* step, which is still far cheaper than one pixel-space step.`,
    },
    {
      kind: 'explain',
      title: 'Backbones: U-Net or transformer',
      body: String.raw`The original LDM denoiser is a U-Net: residual blocks, downsampling to coarse resolutions, self-attention at the low-resolution levels and a cross-attention block beside each of them, then upsampling with skip connections. Stable Diffusion v1's U-Net has roughly 860M parameters beside a 123M frozen text encoder.

**DiT** (Peebles & Xie, 2023) asked whether the convolutional U-Net is needed at all: cut the latent into patches, treat them as tokens, and run a plain transformer. Conditioning on $t$ and the class enters through **adaptive layer norm** (adaLN-Zero: the scale and shift of each LayerNorm are regressed from the conditioning, with the residual branch initialized to zero). Their finding — sample quality improves smoothly with the transformer's Gflops — is why the next generation (Stable Diffusion 3, PixArt, Sora-style video models) is transformer-based, usually combined with [flow matching](@ml/flow-matching) rather than DDPM noise prediction.`,
    },
    {
      kind: 'match',
      prompt: 'Match each component of a latent diffusion system to its job.',
      pairs: [
        [String.raw`$E$ / $D$`, 'Perceptual compression: trained once, then frozen'],
        ['LPIPS + patch discriminator', 'Keep decoded textures sharp instead of blurry'],
        [String.raw`$\tau_\theta$`, 'Turn the prompt into a sequence of key/value vectors'],
        ['Cross-attention layers in the denoiser', 'Let each spatial position read from the prompt'],
        [String.raw`$\boldsymbol\varepsilon_\theta$`, 'Learn the distribution of latents by denoising'],
      ],
      why: 'Each piece solves one subproblem: the autoencoder handles perception, the text encoder handles language, cross-attention is the bridge between them, and the denoiser is the only generative model in the system.',
    },
    {
      kind: 'multi',
      prompt: 'Which are real advantages of diffusing in latent space? (Select all that apply.)',
      choices: [
        'Training and sampling compute per step drop by a large factor.',
        'Attention over spatial positions becomes affordable, since there are far fewer of them.',
        'The same frozen autoencoder can be reused for inpainting, super-resolution and video models.',
        'The decoder removes any limit on the detail the system can generate.',
      ],
      answers: [0, 1, 2],
      why: String.raw`Fewer values per step means cheaper steps, and quadratic-cost self-attention benefits most. Reuse of the frozen autoencoder is a major practical win. But the decoder is a hard ceiling: detail it cannot reconstruct — small text, fine regular patterns — cannot be generated either, no matter how good the denoiser is.`,
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- Split generation in two: an autoencoder for **perceptual** compression, a diffusion model for **semantic** structure.
- The autoencoder is trained with reconstruction + LPIPS + patch-adversarial losses and only a weak KL or VQ regularizer — fidelity first, because the diffusion model will learn whatever latent distribution results.
- Stable Diffusion: $f=8$, $c=4$, so $512^2\times3\to64^2\times4$, 48× fewer values and 64× fewer attention tokens.
- Conditioning enters by **cross-attention**: queries from image positions, keys and values from $\tau_\theta(y)$.
- Backbones evolved U-Net → transformer (DiT, adaLN-Zero), but the two-stage recipe is unchanged.`,
    },
  ],
  references: [
    { authors: 'R. Rombach, A. Blattmann, D. Lorenz, P. Esser & B. Ommer', title: 'High-Resolution Image Synthesis with Latent Diffusion Models', year: 2022, venue: 'CVPR', url: 'https://arxiv.org/abs/2112.10752' },
    { authors: 'P. Esser, R. Rombach & B. Ommer', title: 'Taming Transformers for High-Resolution Image Synthesis', year: 2021, venue: 'CVPR', url: 'https://arxiv.org/abs/2012.09841' },
    { authors: 'W. Peebles & S. Xie', title: 'Scalable Diffusion Models with Transformers', year: 2023, venue: 'ICCV', url: 'https://arxiv.org/abs/2212.09748' },
    { authors: 'R. Zhang, P. Isola, A. A. Efros, E. Shechtman & O. Wang', title: 'The Unreasonable Effectiveness of Deep Features as a Perceptual Metric (LPIPS)', year: 2018, venue: 'CVPR', url: 'https://arxiv.org/abs/1801.03924' },
    { authors: 'D. Podell, Z. English, K. Lacey, A. Blattmann, T. Dockhorn, J. Müller, J. Penna & R. Rombach', title: 'SDXL: Improving Latent Diffusion Models for High-Resolution Image Synthesis', year: 2024, venue: 'ICLR', url: 'https://arxiv.org/abs/2307.01952' },
  ],
} satisfies LessonContent;
