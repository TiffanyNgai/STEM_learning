import type { LessonContent } from '../../types';

// Score of an equal mixture of N((±1.5,0), 0.5·I):  ∇log p = Σ_i w_i(x)·(−(x−μ_i)/0.5)
const G1 = 'exp(-((x-1.5)^2+y^2))';
const G2 = 'exp(-((x+1.5)^2+y^2))';

export default {
  cards: [
    {
      kind: 'explain',
      title: 'Arrows that point toward the data',
      body: String.raw`Imagine a fog of probability over space, thick where data is likely. At every point, draw an arrow pointing in the direction where the fog thickens fastest. That arrow field is the **score**:

$$\mathbf s(\mathbf x)=\nabla_{\mathbf x}\log p(\mathbf x).$$

(Careful: the gradient is with respect to the **data** $\mathbf x$, not parameters.) Below is the score of a two-blob distribution — the particles flow along the arrows and pile up at the two modes.

**Score-based generative models** learn this field from samples and then use it to *generate* new data.`,
      widget: {
        type: 'PhasePortrait',
        props: { dx: `(-(x-1.5)*${G1} - (x+1.5)*${G2})/(0.5*(${G1}+${G2}))`, dy: '-y/0.5', range: 3, particles: 50 },
        caption: String.raw`Score field of $p=\tfrac12\mathcal N((1.5,0),\tfrac12I)+\tfrac12\mathcal N((-1.5,0),\tfrac12I)$. Tap to drop a particle.`,
      },
    },
    {
      kind: 'recall',
      title: 'Recall: Boltzmann distributions & energy-based models',
      points: [
        String.raw`An energy-based model sets $p_\theta(\mathbf x)=e^{-E_\theta(\mathbf x)}/Z_\theta$ — low energy = high probability.`,
        String.raw`The **partition function** $Z_\theta=\int e^{-E_\theta(\mathbf x)}d\mathbf x$ is an integral over all of data space — intractable in high dimension.`,
        String.raw`Maximum likelihood needs $\nabla_\theta\log Z_\theta$, which requires samples from the model (expensive MCMC).`,
      ],
      link: 'physics/boltzmann-distribution',
    },
    {
      kind: 'explain',
      title: 'Why the score dodges the partition function',
      body: String.raw`Take the log, then the $\mathbf x$-gradient:

$$\nabla_{\mathbf x}\log p_\theta(\mathbf x)=\nabla_{\mathbf x}\big(-E_\theta(\mathbf x)-\log Z_\theta\big)=-\nabla_{\mathbf x}E_\theta(\mathbf x).$$

$Z_\theta$ does not depend on $\mathbf x$, so it **vanishes**. The score only cares about *relative* probabilities — the shape of the landscape, not its total volume.

**Worked example.** For $\mathcal N(\mu,\sigma^2)$: $\log p=-\frac{(x-\mu)^2}{2\sigma^2}+\text{const}$, so $s(x)=-\dfrac{x-\mu}{\sigma^2}$. It points back toward the mean, more strongly the farther away you are and the narrower the distribution.`,
    },
    {
      kind: 'numeric',
      prompt: String.raw`What is the score $s(x)=\frac{d}{dx}\log p(x)$ of $\mathcal N(\mu=2,\sigma=0.5)$ at $x=3$?`,
      answer: -4,
      why: String.raw`$s(x)=-(x-\mu)/\sigma^2=-(3-2)/0.25=-4$. The sign is negative because the density increases toward the left (toward the mean). A common mistake is dividing by $\sigma$ instead of $\sigma^2$, giving $-2$.`,
    },
    {
      kind: 'explain',
      title: 'Sampling with the score: Langevin dynamics',
      body: String.raw`Knowing only $\mathbf s=\nabla\log p$, we can draw samples with **Langevin dynamics** (see [sampling](@ml/sampling-for-ml)):

$$\mathbf x_{k+1}=\mathbf x_k+\eta\,\mathbf s(\mathbf x_k)+\sqrt{2\eta}\,\mathbf z_k,\qquad\mathbf z_k\sim\mathcal N(0,I).$$

The drift climbs toward high density; the injected noise keeps particles spread out in proportion to the density. As $\eta\to0$ and $k\to\infty$ the iterates are distributed as $p$ (under mild conditions; for finite $\eta$ a Metropolis correction removes the bias).

It is gradient ascent on $\log p$ **plus exactly the right amount of noise** — the discretization of the SDE $d\mathbf x=\nabla\log p\,dt+\sqrt2\,d\mathbf W$, whose stationary distribution is $p$.`,
    },
    {
      kind: 'truefalse',
      prompt: String.raw`If you drop the noise term $\sqrt{2\eta}\,\mathbf z_k$ from Langevin dynamics, the iterates still produce samples from $p$.`,
      answer: false,
      why: String.raw`Without noise it is plain gradient ascent on $\log p$: every particle slides to a local mode (as in the first widget), producing collapsed "samples" with no spread. The noise is what makes the stationary distribution equal $p$.`,
    },
    {
      kind: 'explain',
      title: 'Score matching objectives',
      body: String.raw`We want a network $\mathbf s_\theta(\mathbf x)$ with $\mathbf s_\theta\approx\nabla\log p_{\text{data}}$. The natural (Fisher-divergence) loss
$$J(\theta)=\tfrac12\,\mathbb E_{p_{\text{data}}}\big\|\mathbf s_\theta(\mathbf x)-\nabla\log p_{\text{data}}(\mathbf x)\big\|^2$$
uses the unknown true score. **Hyvärinen (2005)** integrated by parts to remove it:
$$J(\theta)=\mathbb E_{p_{\text{data}}}\Big[\operatorname{tr}\big(\nabla_{\mathbf x}\mathbf s_\theta(\mathbf x)\big)+\tfrac12\|\mathbf s_\theta(\mathbf x)\|^2\Big]+\text{const}.$$
Valid, but the Jacobian trace costs $D$ backward passes for $D$-dimensional data (a 256×256 RGB image has $D\approx2\times10^5$). *Sliced* score matching uses random projections; *denoising* score matching (next) avoids it entirely.`,
    },
    {
      kind: 'explain',
      title: 'Denoising score matching',
      body: String.raw`**Vincent (2011):** corrupt each data point with Gaussian noise, $\tilde{\mathbf x}=\mathbf x+\sigma\boldsymbol\varepsilon$, and regress onto the score of the *corruption kernel*, which we know in closed form:

$$\mathcal L_{\text{DSM}}(\theta)=\mathbb E_{\mathbf x,\boldsymbol\varepsilon}\Big\|\mathbf s_\theta(\mathbf x+\sigma\boldsymbol\varepsilon)+\frac{\boldsymbol\varepsilon}{\sigma}\Big\|^2,$$

since $\nabla_{\tilde{\mathbf x}}\log\mathcal N(\tilde{\mathbf x};\mathbf x,\sigma^2I)=-(\tilde{\mathbf x}-\mathbf x)/\sigma^2=-\boldsymbol\varepsilon/\sigma$. Each individual target is noisy, but its **average** is the right answer. Step through why:`,
      widget: {
        type: 'StepReveal',
        props: {
          steps: [
            String.raw`Noisy marginal: $p_\sigma(\tilde{\mathbf x})=\int q(\tilde{\mathbf x}\mid\mathbf x)\,p(\mathbf x)\,d\mathbf x$ with $q=\mathcal N(\tilde{\mathbf x};\mathbf x,\sigma^2I)$.`,
            String.raw`Differentiate: $\nabla\log p_\sigma(\tilde{\mathbf x})=\dfrac{\int\nabla_{\tilde{\mathbf x}}q(\tilde{\mathbf x}\mid\mathbf x)\,p(\mathbf x)\,d\mathbf x}{p_\sigma(\tilde{\mathbf x})}=\int\nabla\log q(\tilde{\mathbf x}\mid\mathbf x)\,\underbrace{\frac{q(\tilde{\mathbf x}\mid\mathbf x)p(\mathbf x)}{p_\sigma(\tilde{\mathbf x})}}_{p(\mathbf x\mid\tilde{\mathbf x})}d\mathbf x.$`,
            String.raw`So the marginal score is a **posterior average** of conditional scores: $\nabla\log p_\sigma(\tilde{\mathbf x})=\mathbb E\big[\nabla\log q(\tilde{\mathbf x}\mid\mathbf x)\,\big|\,\tilde{\mathbf x}\big]$.`,
            String.raw`The minimizer of a squared loss $\mathbb E\|f(\tilde{\mathbf x})-T\|^2$ is $f^*(\tilde{\mathbf x})=\mathbb E[T\mid\tilde{\mathbf x}]$. With $T=\nabla\log q(\tilde{\mathbf x}\mid\mathbf x)$: $\;\mathbf s^*_\theta=\nabla\log p_\sigma$.`,
            String.raw`Hence DSM learns the score of the **noised** data distribution $p_\sigma$ — close to $p$ when $\sigma$ is small. (Equivalently, the DSM and explicit losses differ by a $\theta$-independent constant.)`,
          ],
        },
      },
    },
    {
      kind: 'fill',
      prompt: String.raw`In denoising score matching with $\tilde{\mathbf x}=\mathbf x+\sigma\boldsymbol\varepsilon$, the regression target for $\mathbf s_\theta(\tilde{\mathbf x})$ is ___, and the optimal network equals the score of the ___ distribution.`,
      bank: ['−ε/σ', 'ε/σ', '−ε·σ', 'noised data', 'clean data', 'Gaussian prior'],
      answer: ['−ε/σ', 'noised data'],
      why: String.raw`$\nabla_{\tilde{\mathbf x}}\log\mathcal N(\tilde{\mathbf x};\mathbf x,\sigma^2I)=-(\tilde{\mathbf x}-\mathbf x)/\sigma^2=-\boldsymbol\varepsilon/\sigma$: it points from the noisy point back toward the clean one. Averaging over which clean point produced $\tilde{\mathbf x}$ gives $\nabla\log p_\sigma$, the score of the *noised* distribution, not of $p$ itself.`,
    },
    {
      kind: 'explain',
      title: "Tweedie's formula: score = denoiser",
      body: String.raw`Step 3 above, written out for Gaussian noise, gives **Tweedie's formula** (Robbins 1956; Efron 2011):

$$\mathbb E[\mathbf x\mid\tilde{\mathbf x}]=\tilde{\mathbf x}+\sigma^2\,\nabla\log p_\sigma(\tilde{\mathbf x}).$$

The best possible denoiser (minimum mean-squared error) is "the noisy point plus $\sigma^2$ times the score". So **learning to denoise and learning the score are the same problem** — the key fact behind diffusion models.

**Check with Gaussians.** If $x\sim\mathcal N(0,1)$ then $\tilde x\sim\mathcal N(0,1+\sigma^2)$, score $-\tilde x/(1+\sigma^2)$, so
$$\mathbb E[x\mid\tilde x]=\tilde x-\frac{\sigma^2\tilde x}{1+\sigma^2}=\frac{\tilde x}{1+\sigma^2},$$
exactly the textbook Gaussian conditioning (shrink toward the prior mean).`,
    },
    {
      kind: 'numeric',
      prompt: String.raw`Data $x\sim\mathcal N(0,1)$, noise level $\sigma^2=1$, and you observe $\tilde x=2$. Using Tweedie's formula, what is the MMSE denoised estimate $\mathbb E[x\mid\tilde x]$?`,
      answer: 1,
      tolerance: 0.001,
      why: String.raw`$p_\sigma=\mathcal N(0,2)$, so the score at 2 is $-2/2=-1$, and $\mathbb E[x\mid\tilde x]=2+1\cdot(-1)=1$. Signal and noise have equal variance, so the estimate shrinks halfway back toward 0.`,
    },
    {
      kind: 'widget',
      title: 'One score field per noise level',
      body: String.raw`Orange arrows show the (exact) denoising direction $\sqrt{\bar\alpha_t}\,\mathbb E[\mathbf x_0\mid\mathbf x_t]-\mathbf x_t\propto$ score of the noised data ($\sqrt{\bar\alpha_t}$ = how much of the signal survives at time $t$). Drag $t$:
- **small noise:** arrows snap sharply onto the data, but far-away regions (where no data lives) get almost no training signal;
- **large noise:** the field is smooth and globally informative, but blurry.

**Song & Ermon (2019)** therefore learn a *noise-conditional* score $\mathbf s_\theta(\mathbf x,\sigma)$ for a ladder $\sigma_1>\sigma_2>\dots>\sigma_L$ and run **annealed Langevin**: start at large $\sigma$, gradually reduce it. Make this ladder continuous and you get [diffusion models](@ml/diffusion-models).`,
      widget: { type: 'DiffusionDenoise', props: { dataset: 'moons', mode: 'forward', showScore: true, t: 0.35 } },
    },
    {
      kind: 'mcq',
      prompt: 'Why do score-based models learn scores at many noise levels instead of only the clean data score?',
      choices: [
        'Because the clean data score does not exist for continuous distributions.',
        'Because in low-density regions the clean score is barely trained, and Langevin with one score mixes poorly between separated modes; noise fills space and connects modes.',
        'Because noise makes the partition function tractable.',
        'Because Langevin dynamics requires the step size to equal the noise level.',
      ],
      answer: 1,
      why: String.raw`Score matching only fits the score where data are; real data lie near low-dimensional manifolds, leaving most of space untrained. Large-noise scores are accurate everywhere and guide samples to the right region (and relative mode weights); small-noise scores refine details. The partition function is irrelevant to scores anyway.`,
    },
    {
      kind: 'multi',
      prompt: 'Which statements are correct? (Select all that apply.)',
      choices: [
        String.raw`$\nabla_{\mathbf x}\log p_\theta(\mathbf x)$ does not depend on the normalizing constant $Z_\theta$.`,
        String.raw`Hyvärinen score matching needs samples from the model.`,
        String.raw`Denoising score matching needs only data samples and Gaussian noise.`,
        String.raw`An optimal denoiser at noise level $\sigma$ determines the score of $p_\sigma$.`,
      ],
      answers: [0, 2, 3],
      why: String.raw`$Z_\theta$ is constant in $\mathbf x$. Hyvärinen's objective is an expectation over **data** only (that is its whole appeal — unlike maximum likelihood for EBMs), so the claim that it needs model samples is false. DSM needs only data plus noise, and Tweedie gives $\nabla\log p_\sigma=(\mathbb E[\mathbf x\mid\tilde{\mathbf x}]-\tilde{\mathbf x})/\sigma^2$.`,
    },
    {
      kind: 'match',
      prompt: 'Match each method to its key idea.',
      pairs: [
        ['Explicit score matching', 'Regress onto the true score (unknown in practice)'],
        ['Implicit (Hyvärinen) score matching', 'Integration by parts: trace of the score Jacobian'],
        ['Denoising score matching', 'Regress onto −ε/σ for noised samples'],
        ['Annealed Langevin dynamics', 'Sample by Langevin steps while lowering the noise level'],
      ],
      why: 'Explicit SM defines the goal; Hyvärinen and DSM are two tractable surrogates (with equal gradients up to constants or for the noised distribution); annealed Langevin is the sampler that uses the learned noise-conditional scores.',
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- Score $\mathbf s(\mathbf x)=\nabla_{\mathbf x}\log p(\mathbf x)$: a vector field pointing toward higher density; independent of normalization.
- Langevin dynamics $\mathbf x\leftarrow\mathbf x+\eta\,\mathbf s+\sqrt{2\eta}\,\mathbf z$ turns a score into a sampler.
- Denoising score matching: $\min_\theta\mathbb E\|\mathbf s_\theta(\mathbf x+\sigma\boldsymbol\varepsilon)+\boldsymbol\varepsilon/\sigma\|^2$ learns $\nabla\log p_\sigma$.
- Tweedie: $\mathbb E[\mathbf x\mid\tilde{\mathbf x}]=\tilde{\mathbf x}+\sigma^2\nabla\log p_\sigma(\tilde{\mathbf x})$ — denoising ≡ score estimation.
- Multiple noise levels make scores useful everywhere → the road to diffusion models.`,
    },
  ],
  references: [
    { authors: 'A. Hyvärinen', title: 'Estimation of Non-Normalized Statistical Models by Score Matching', year: 2005, venue: 'JMLR 6, 695–709' },
    { authors: 'P. Vincent', title: 'A Connection Between Score Matching and Denoising Autoencoders', year: 2011, venue: 'Neural Computation 23(7)' },
    { authors: 'Y. Song & S. Ermon', title: 'Generative Modeling by Estimating Gradients of the Data Distribution', year: 2019, venue: 'NeurIPS', url: 'https://arxiv.org/abs/1907.05600' },
    { authors: 'B. Efron', title: "Tweedie's Formula and Selection Bias", year: 2011, venue: 'JASA 106(496)' },
    { authors: 'K. P. Murphy', title: 'Probabilistic Machine Learning: Advanced Topics', year: 2023, venue: 'MIT Press', detail: 'Ch. 24–25', url: 'https://probml.github.io/pml-book/book2.html' },
  ],
} satisfies LessonContent;
