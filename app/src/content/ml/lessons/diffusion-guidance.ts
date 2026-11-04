import type { LessonContent } from '../../types';

// Classifier-free guidance as vector arithmetic in ε-space.
const CFG_SVG = `<svg viewBox="0 0 320 190" xmlns="http://www.w3.org/2000/svg">
<defs>
<marker id="cfg-a" viewBox="0 0 6 6" refX="5" refY="3" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0L6,3L0,6z" fill="var(--c2)"/></marker>
<marker id="cfg-b" viewBox="0 0 6 6" refX="5" refY="3" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0L6,3L0,6z" fill="var(--muted)"/></marker>
<marker id="cfg-c" viewBox="0 0 6 6" refX="5" refY="3" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0L6,3L0,6z" fill="var(--c1)"/></marker>
<marker id="cfg-d" viewBox="0 0 6 6" refX="5" refY="3" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0L6,3L0,6z" fill="var(--c3)"/></marker>
</defs>
<circle cx="52" cy="158" r="2.5" fill="var(--fg)"/>
<text x="30" y="172" font-size="9" fill="var(--muted)">origin of ε-space</text>
<line x1="52" y1="158" x2="148" y2="122" stroke="var(--muted)" stroke-width="1.6" marker-end="url(#cfg-b)"/>
<text x="92" y="150" font-size="9.5" fill="var(--muted)">ε_∅ (no prompt)</text>
<line x1="52" y1="158" x2="186" y2="86" stroke="var(--c2)" stroke-width="1.8" marker-end="url(#cfg-a)"/>
<text x="118" y="104" font-size="9.5" fill="var(--c2)">ε_c (with prompt)</text>
<line x1="148" y1="122" x2="182" y2="90" stroke="var(--c1)" stroke-width="1.4" stroke-dasharray="3 2" marker-end="url(#cfg-c)"/>
<text x="150" y="80" font-size="9" fill="var(--c1)">ε_c − ε_∅</text>
<text x="150" y="90" font-size="8.5" fill="var(--c1)">"what the prompt adds"</text>
<line x1="186" y1="86" x2="243" y2="32" stroke="var(--c3)" stroke-width="1.8" stroke-dasharray="4 2" marker-end="url(#cfg-d)"/>
<circle cx="215" cy="59" r="4" fill="var(--c3)">
  <animate attributeName="cx" values="186;243;186" dur="6s" repeatCount="indefinite"/>
  <animate attributeName="cy" values="86;32;86" dur="6s" repeatCount="indefinite"/>
</circle>
<text x="112" y="28" font-size="9.5" fill="var(--c3)">ε̃ = ε_c + w(ε_c − ε_∅)</text>
<text x="112" y="39" font-size="8.5" fill="var(--c3)">w grows →</text>
<text x="8" y="14" font-size="9" fill="var(--fg)">one sampling step, in noise-prediction space</text>
<text x="8" y="184" font-size="8.5" fill="var(--muted)">w = 0 keeps ε_c; large w extrapolates far past it — accurate only while the model stays linear-ish</text>
</svg>`;

export default {
  cards: [
    {
      kind: 'explain',
      title: 'Asking for something specific',
      body: String.raw`An unconditional diffusion model trained on photographs will happily hand you *a* photograph. What you usually want is "a corgi wearing sunglasses". That requires **conditioning** on a label, a class, a text prompt, a depth map.

Plain conditioning is easy: feed the condition $c$ to the network and train $\boldsymbol\varepsilon_\theta(\mathbf x_t,t,c)$ on the same loss. It works — but samples are often only loosely faithful to $c$, and metrics like FID improve less than you would hope. **Guidance** is the fix, and it is the single reason text-to-image diffusion looks the way it does. It is also a dial: turn it up and images get sharper and more on-prompt, but the model shows you fewer and fewer different pictures.`,
    },
    {
      kind: 'explain',
      title: 'Classifier guidance',
      body: String.raw`**Dhariwal & Nichol (2021)** started from Bayes' rule applied to the *scores* of the noisy marginals:
$$\nabla_{\mathbf x}\log p_t(\mathbf x\mid c)=\nabla_{\mathbf x}\log p_t(\mathbf x)+\nabla_{\mathbf x}\log p_t(c\mid\mathbf x).$$
The first term is an ordinary unconditional diffusion model. The second is the gradient of a **classifier that must work on noisy inputs**, so they trained one, $p_\phi(c\mid\mathbf x_t,t)$, on the same noised data.

Then they added a knob $s$ in front of the classifier term. In $\boldsymbol\varepsilon$-space (using $\mathbf s_\theta=-\boldsymbol\varepsilon_\theta/\sqrt{1-\bar\alpha_t}$):
$$\hat{\boldsymbol\varepsilon}=\boldsymbol\varepsilon_\theta(\mathbf x_t,t)-s\sqrt{1-\bar\alpha_t}\;\nabla_{\mathbf x}\log p_\phi(c\mid\mathbf x_t).$$
With $s=1$ this samples $p(\mathbf x\mid c)$; with $s>1$ it samples the **tilted** density
$$\tilde p(\mathbf x\mid c)\ \propto\ p(\mathbf x\mid c)\,p(c\mid\mathbf x)^{\,s-1},$$
which concentrates on points the classifier is *confident* about. That is what "guidance" means, in one line.`,
    },
    {
      kind: 'widget',
      title: 'What tilting actually does',
      body: String.raw`A one-dimensional cartoon. Class A (dashed blue) has a large mode near $-1.7$ and a smaller one near $0.35$ — but the second one sits where class B also lives, so the implicit classifier $p(A\mid x)$ is only about $0.44$ there. Raise $w$ and watch:
- the ambiguous mode is **deleted**, not merely shrunk — $0.44^w$ collapses fast;
- the surviving mass shifts to where $p(A\mid x)\approx1$;
- the diversity bar (the standard deviation of the guided density, relative to $w=0$) falls off a cliff.

Nothing about class A became more likely. Guidance re-weights by *class-typicality*, and typical is a narrower target than likely.`,
      widget: { type: 'MlGuidanceDial', props: { w: 0, showClassifier: true, wMax: 8 } },
    },
    {
      kind: 'mcq',
      prompt: String.raw`Classifier guidance with scale $s>1$ draws samples from which distribution?`,
      choices: [
        String.raw`The conditional $p(\mathbf x\mid c)$ itself.`,
        String.raw`A tilted density $\propto p(\mathbf x\mid c)\,p(c\mid\mathbf x)^{s-1}$, sharpened toward regions the classifier is sure about.`,
        String.raw`The unconditional $p(\mathbf x)$ restricted to a subset.`,
        String.raw`The classifier posterior $p(c\mid\mathbf x)$.`,
      ],
      answer: 1,
      why: String.raw`Adding $s\nabla\log p(c\mid\mathbf x)$ to the unconditional score is the score of $p(\mathbf x)p(c\mid\mathbf x)^s\propto p(\mathbf x\mid c)p(c\mid\mathbf x)^{s-1}$. Only $s=1$ gives the true conditional; the extra exponent is deliberate over-weighting of class evidence, and it is what trades diversity for fidelity.`,
    },
    {
      kind: 'explain',
      title: 'Classifier-free guidance',
      body: String.raw`A separate noisy classifier is a nuisance: an extra model, extra training, and its gradients can be adversarially exploitable rather than semantically meaningful. **Ho & Salimans (2022)** removed it with the same Bayes identity read backwards:
$$\nabla\log p_t(c\mid\mathbf x)=\nabla\log p_t(\mathbf x\mid c)-\nabla\log p_t(\mathbf x),$$
so an *implicit* classifier is already available as the difference between a conditional and an unconditional model. Train **one** network to be both, by randomly replacing $c$ with a null token $\varnothing$ during training (dropout probability $p_{\text{uncond}}\approx0.1$–$0.2$). At sampling time, combine:
$$\boxed{\tilde{\boldsymbol\varepsilon}_\theta(\mathbf x_t,c)=(1+w)\,\boldsymbol\varepsilon_\theta(\mathbf x_t,c)-w\,\boldsymbol\varepsilon_\theta(\mathbf x_t,\varnothing)=\boldsymbol\varepsilon_\theta(\mathbf x_t,\varnothing)+(1+w)\big[\boldsymbol\varepsilon_\theta(\mathbf x_t,c)-\boldsymbol\varepsilon_\theta(\mathbf x_t,\varnothing)\big]}$$
$w=0$ is ordinary conditional sampling; $w>0$ extrapolates away from the unconditional prediction. **Mind the convention:** most code exposes a "guidance scale" $s=1+w$, so Stable Diffusion's default 7.5 means $w=6.5$.`,
    },
    {
      kind: 'widget',
      title: 'Guidance as vector arithmetic',
      body: String.raw`Each sampling step predicts the noise twice — once with the prompt, once with $\varnothing$ — and then walks past the conditional prediction along their difference.`,
      widget: { type: 'SvgDiagram', props: { svg: CFG_SVG }, caption: String.raw`Equivalent forms: $(1+w)\boldsymbol\varepsilon_c-w\boldsymbol\varepsilon_\varnothing$ and $\boldsymbol\varepsilon_\varnothing+(1+w)(\boldsymbol\varepsilon_c-\boldsymbol\varepsilon_\varnothing)$. The coefficients always sum to 1 — an extrapolation, not a blend.` },
    },
    {
      kind: 'numeric',
      prompt: String.raw`At one sampling step a single coordinate has $\varepsilon_\theta(\mathbf x_t,c)=0.40$ and $\varepsilon_\theta(\mathbf x_t,\varnothing)=0.10$. With guidance weight $w=2.5$, what is the guided prediction $\tilde\varepsilon$?`,
      answer: 1.15,
      tolerance: 0.005,
      why: String.raw`$\tilde\varepsilon=(1+w)\varepsilon_c-w\varepsilon_\varnothing=3.5(0.40)-2.5(0.10)=1.40-0.25=1.15$. Note it lies far outside the interval $[0.10,0.40]$: guidance extrapolates. Predicted noise magnitudes grow with $w$, which is exactly why heavily guided samples come out over-saturated and need clipping tricks.`,
    },
    {
      kind: 'widget',
      title: 'Why the implicit classifier works',
      widget: {
        type: 'StepReveal',
        props: {
          steps: [
            String.raw`Target the tilt: $\tilde p_t(\mathbf x\mid c)\propto p_t(\mathbf x\mid c)\,p_t(c\mid\mathbf x)^w$.`,
            String.raw`Take $\nabla\log$: $\ \nabla\log\tilde p_t=\nabla\log p_t(\mathbf x\mid c)+w\,\nabla\log p_t(c\mid\mathbf x)$.`,
            String.raw`Bayes: $\log p_t(c\mid\mathbf x)=\log p_t(\mathbf x\mid c)-\log p_t(\mathbf x)+\log p(c)$, and $\log p(c)$ has no $\mathbf x$-gradient.`,
            String.raw`Substitute: $\nabla\log\tilde p_t=(1+w)\nabla\log p_t(\mathbf x\mid c)-w\,\nabla\log p_t(\mathbf x)$.`,
            String.raw`Convert scores to noise with $\boldsymbol\varepsilon=-\sqrt{1-\bar\alpha_t}\,\nabla\log p_t$ — the same factor for both terms, so it passes straight through: $\tilde{\boldsymbol\varepsilon}=(1+w)\boldsymbol\varepsilon_c-w\boldsymbol\varepsilon_\varnothing$.`,
          ],
          notes: ['', '', 'This is the step that makes the classifier disappear.', '', 'No extra model, one shared network, two forward passes.'],
        },
      },
    },
    {
      kind: 'fill',
      prompt: String.raw`Classifier-free guidance forms $\tilde{\boldsymbol\varepsilon}=$ ___ $\cdot\,\boldsymbol\varepsilon_\theta(\mathbf x_t,c)\ +$ ___ $\cdot\,\boldsymbol\varepsilon_\theta(\mathbf x_t,\varnothing)$, and the unconditional branch is obtained by training with the condition replaced by a ___ token.`,
      bank: ['(1+w)', '(1−w)', '−w', '+w', 'null', 'random'],
      answer: ['(1+w)', '−w', 'null'],
      why: String.raw`The coefficients sum to one, so the combination is an extrapolation along $\boldsymbol\varepsilon_c-\boldsymbol\varepsilon_\varnothing$ rather than an interpolation. The same weights serve both branches; the unconditional one is trained by dropping $c$ (replacing it with a learned null embedding) on roughly 10–20% of examples.`,
    },
    {
      kind: 'order',
      prompt: 'Order what happens in one classifier-free-guided sampling step.',
      steps: [
        String.raw`Evaluate $\boldsymbol\varepsilon_\theta(\mathbf x_t,t,c)$ with the prompt embedding`,
        String.raw`Evaluate $\boldsymbol\varepsilon_\theta(\mathbf x_t,t,\varnothing)$ with the null embedding (usually in the same batch)`,
        String.raw`Combine: $\tilde{\boldsymbol\varepsilon}=(1+w)\boldsymbol\varepsilon_c-w\boldsymbol\varepsilon_\varnothing$`,
        String.raw`Feed $\tilde{\boldsymbol\varepsilon}$ to the DDPM/DDIM update to get $\mathbf x_{t-1}$`,
      ],
      why: String.raw`The sampler itself is untouched — guidance only substitutes a different noise prediction. The price is two network evaluations per step, so a 50-step guided sample costs 100 NFE; batching the two branches keeps it to one kernel launch.`,
    },
    {
      kind: 'explain',
      title: 'The quality–diversity dial',
      body: String.raw`What raising $w$ does, consistently across papers and modalities:
- **Up:** prompt adherence, Inception Score, *precision* (samples look like real class members), perceived sharpness.
- **Down:** *recall* and variety — whole modes disappear, as in the widget above. At high $w$ a prompt may return near-identical images.
- **FID** is U-shaped: it improves up to a moderate $w$ (because fidelity rises) and then worsens (because diversity collapses). The best FID and the best-looking images are at different $w$; Dhariwal & Nichol discuss exactly this trade-off for classifier guidance.
- **Artifacts:** predicted noise grows with $w$, pushing $\hat{\mathbf x}_0$ outside the valid pixel range. Imagen's **dynamic thresholding** (Saharia et al. 2022) clips $\hat{\mathbf x}_0$ to a per-step percentile and rescales, which makes very high guidance weights usable.

Typical settings: $s=1+w$ around 1.5–4 for class-conditional ImageNet (the lower end for best FID, the higher end for best-looking samples), 7–8 for Stable Diffusion text-to-image.`,
    },
    {
      kind: 'truefalse',
      prompt: String.raw`With $w>0$, classifier-free guidance produces exact samples from the conditional distribution $p(\mathbf x\mid c)$ learned by the model.`,
      answer: false,
      why: String.raw`Even in the ideal case it targets the tilted density $\propto p(\mathbf x\mid c)p(c\mid\mathbf x)^w$, which is deliberately *not* $p(\mathbf x\mid c)$ — that is the point. There is a further subtlety: applying the tilt at every noise level does not correspond to any single consistent diffusion process, so guided sampling only approximately reaches even the tilted target. Only $w=0$ samples the model's own conditional.`,
    },
    {
      kind: 'multi',
      prompt: 'Which are true of classifier-free guidance compared with classifier guidance? (Select all that apply.)',
      choices: [
        'It needs no separate classifier trained on noisy inputs.',
        'It costs roughly two network evaluations per sampling step.',
        'It removes the diversity cost of guidance.',
        'It works with conditioning that no classifier could easily provide, such as free-form text.',
      ],
      answers: [0, 1, 3],
      why: String.raw`Dropping the condition during training turns one network into both branches, which is the practical win, and it extends to text or image conditioning where "training a classifier" would be awkward. The cost is the extra forward pass. The diversity loss is intrinsic to tilting by $p(c\mid\mathbf x)^w$ and is the same for both methods.`,
    },
    {
      kind: 'explain',
      title: 'Variations on the same trick',
      body: String.raw`Once you see guidance as "add a gradient that prefers something", the generalizations write themselves.
- **Negative prompts.** Replace $\varnothing$ by the embedding of text you want to avoid: $\tilde{\boldsymbol\varepsilon}=(1+w)\boldsymbol\varepsilon_c-w\boldsymbol\varepsilon_{\text{neg}}$ pushes *away* from "blurry, extra fingers".
- **Any differentiable critic.** Classifier guidance works with a CLIP score, an aesthetic predictor, a segmentation loss, a physics constraint — anything you can differentiate with respect to $\mathbf x_t$ (noisy inputs remain the hard part).
- **Scheduling $w$.** Guidance is most damaging at very high and very low noise levels; applying it only on a middle interval of $t$ recovers diversity at little cost to fidelity.
- **Caveat for editing.** Large $w$ makes the probability-flow trajectory much less reversible, which is why [DDIM inversion](@ml/ddim-sampling) needs correction when guidance is strong.`,
    },
    {
      kind: 'match',
      prompt: 'Match each ingredient to its role.',
      pairs: [
        [String.raw`$p_\phi(c\mid\mathbf x_t,t)$`, 'Classifier trained on noisy inputs, whose gradient steers sampling'],
        [String.raw`Null token $\varnothing$`, 'Stands in for the condition so one network also models p(x)'],
        [String.raw`$(1+w)\boldsymbol\varepsilon_c-w\boldsymbol\varepsilon_\varnothing$`, 'The guided noise prediction fed to the sampler'],
        ['Dynamic thresholding', 'Keeps the predicted clean image in range at high guidance weights'],
      ],
      why: 'The first belongs to classifier guidance, the next two to classifier-free guidance, and the last is a practical patch for the saturation artifacts that strong guidance of either kind produces.',
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- Conditioning alone is weak; **guidance** amplifies it by tilting toward $p(c\mid\mathbf x)^w$.
- Classifier guidance: $\hat{\boldsymbol\varepsilon}=\boldsymbol\varepsilon_\theta-s\sqrt{1-\bar\alpha_t}\nabla_{\mathbf x}\log p_\phi(c\mid\mathbf x_t)$ — needs a noisy-input classifier.
- Classifier-free guidance: train with the condition randomly dropped, then $\tilde{\boldsymbol\varepsilon}=(1+w)\boldsymbol\varepsilon_c-w\boldsymbol\varepsilon_\varnothing$ — no classifier, two forward passes.
- The dial trades diversity for fidelity: modes with ambiguous class evidence are deleted; FID is U-shaped in $w$.
- Watch conventions ($s=1+w$), watch saturation at large $w$, and reuse the idea with negative prompts or any differentiable critic.`,
    },
  ],
  references: [
    { authors: 'P. Dhariwal & A. Nichol', title: 'Diffusion Models Beat GANs on Image Synthesis', year: 2021, venue: 'NeurIPS', url: 'https://arxiv.org/abs/2105.05233' },
    { authors: 'J. Ho & T. Salimans', title: 'Classifier-Free Diffusion Guidance', year: 2022, venue: 'arXiv:2207.12598 (NeurIPS 2021 Workshop on Deep Generative Models and Downstream Applications)', url: 'https://arxiv.org/abs/2207.12598' },
    { authors: 'C. Saharia et al.', title: 'Photorealistic Text-to-Image Diffusion Models with Deep Language Understanding (Imagen)', year: 2022, venue: 'NeurIPS', url: 'https://arxiv.org/abs/2205.11487' },
    { authors: 'A. Nichol, P. Dhariwal, A. Ramesh et al.', title: 'GLIDE: Towards Photorealistic Image Generation and Editing with Text-Guided Diffusion Models', year: 2022, venue: 'ICML', url: 'https://arxiv.org/abs/2112.10741' },
  ],
} satisfies LessonContent;
