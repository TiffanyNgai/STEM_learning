import type { LessonContent } from '../../types';

export default {
  cards: [
    {
      kind: 'explain',
      title: 'Destroy slowly, then learn to undo',
      body: String.raw`Drop ink into water: it spreads until the glass is uniformly grey. Running that film **backwards** would turn grey water into a crisp ink pattern.

A **diffusion model** does exactly this with data:
1. A fixed **forward process** adds a little Gaussian noise at each of $T$ steps until any data point becomes pure noise.
2. A neural network learns the **reverse process**, one small denoising step at a time.
3. To generate, start from fresh noise and run the learned reverse steps.

Drag $t$ (or press Play) to watch two-moons data dissolve into a Gaussian.`,
      widget: { type: 'DiffusionDenoise', props: { dataset: 'moons', mode: 'forward' }, caption: 'Bars on the right: signal coefficient √ᾱ_t vs noise level σ_t = √(1−ᾱ_t).' },
    },
    {
      kind: 'explain',
      title: 'The forward process',
      body: String.raw`Choose a **noise schedule** $\beta_1,\dots,\beta_T\in(0,1)$ (e.g. linear from $10^{-4}$ to $0.02$, $T=1000$). Each step shrinks the signal slightly and adds noise:

$$q(\mathbf x_t\mid\mathbf x_{t-1})=\mathcal N\big(\mathbf x_t;\ \sqrt{1-\beta_t}\,\mathbf x_{t-1},\ \beta_tI\big).$$

With $\alpha_t=1-\beta_t$ and $\bar\alpha_t=\prod_{s=1}^t\alpha_s$, we can jump to any step directly:

$$q(\mathbf x_t\mid\mathbf x_0)=\mathcal N\big(\sqrt{\bar\alpha_t}\,\mathbf x_0,\ (1-\bar\alpha_t)I\big)\iff\mathbf x_t=\sqrt{\bar\alpha_t}\,\mathbf x_0+\sqrt{1-\bar\alpha_t}\,\boldsymbol\varepsilon,\ \ \boldsymbol\varepsilon\sim\mathcal N(0,I).$$

"Variance preserving": if $\operatorname{Var}\mathbf x_0=I$, then $\operatorname{Var}\mathbf x_t=I$ for all $t$. As $\bar\alpha_T\to0$, $\mathbf x_T\approx\mathcal N(0,I)$ regardless of the data.`,
    },
    {
      kind: 'widget',
      title: 'Why the jump formula holds',
      widget: {
        type: 'StepReveal',
        props: {
          steps: [
            String.raw`Two steps: $\mathbf x_1=\sqrt{\alpha_1}\mathbf x_0+\sqrt{1-\alpha_1}\,\boldsymbol\varepsilon_1$, $\ \mathbf x_2=\sqrt{\alpha_2}\mathbf x_1+\sqrt{1-\alpha_2}\,\boldsymbol\varepsilon_2$.`,
            String.raw`Substitute: $\mathbf x_2=\sqrt{\alpha_1\alpha_2}\,\mathbf x_0+\underbrace{\sqrt{\alpha_2(1-\alpha_1)}\,\boldsymbol\varepsilon_1+\sqrt{1-\alpha_2}\,\boldsymbol\varepsilon_2}_{\text{sum of independent Gaussians}}$.`,
            String.raw`Variances of independent Gaussians add: $\alpha_2(1-\alpha_1)+(1-\alpha_2)=1-\alpha_1\alpha_2$.`,
            String.raw`So $\mathbf x_2=\sqrt{\bar\alpha_2}\,\mathbf x_0+\sqrt{1-\bar\alpha_2}\,\boldsymbol\varepsilon$ with one fresh $\boldsymbol\varepsilon\sim\mathcal N(0,I)$. Induction gives every $t$.`,
          ],
          notes: ['', '', '', 'This is what makes training cheap: no need to simulate t steps.'],
        },
      },
    },
    {
      kind: 'numeric',
      prompt: String.raw`At some step $\bar\alpha_t=0.36$. In $\mathbf x_t=\sqrt{\bar\alpha_t}\,\mathbf x_0+\sigma_t\boldsymbol\varepsilon$, what is the noise standard deviation $\sigma_t$?`,
      answer: 0.8,
      tolerance: 0.001,
      why: String.raw`$\sigma_t=\sqrt{1-\bar\alpha_t}=\sqrt{0.64}=0.8$, while the signal coefficient is $\sqrt{0.36}=0.6$. Note $0.6^2+0.8^2=1$ — that is the variance-preserving property. The signal-to-noise ratio is $\bar\alpha_t/(1-\bar\alpha_t)=0.5625$.`,
    },
    {
      kind: 'explain',
      title: 'The reverse process',
      body: String.raw`We learn Gaussian reverse steps
$$p_\theta(\mathbf x_{t-1}\mid\mathbf x_t)=\mathcal N\big(\boldsymbol\mu_\theta(\mathbf x_t,t),\ \sigma_t^2I\big),\qquad p(\mathbf x_T)=\mathcal N(0,I).$$
(Here $\sigma_t^2$ is a fixed reverse-step variance, e.g. $\beta_t$ or $\tilde\beta_t$ below — not the forward noise level $\sqrt{1-\bar\alpha_t}$.)

The true reverse $q(\mathbf x_{t-1}\mid\mathbf x_t)$ is intractable (it depends on the whole data distribution), and it is only approximately Gaussian when $\beta_t$ is small. But conditioning on the clean point makes it an exact Gaussian:
$$q(\mathbf x_{t-1}\mid\mathbf x_t,\mathbf x_0)=\mathcal N\big(\tilde{\boldsymbol\mu}_t,\ \tilde\beta_tI\big),\quad\tilde{\boldsymbol\mu}_t=\tfrac{\sqrt{\bar\alpha_{t-1}}\beta_t}{1-\bar\alpha_t}\mathbf x_0+\tfrac{\sqrt{\alpha_t}(1-\bar\alpha_{t-1})}{1-\bar\alpha_t}\mathbf x_t,\quad\tilde\beta_t=\tfrac{1-\bar\alpha_{t-1}}{1-\bar\alpha_t}\beta_t.$$

So the network only needs to guess $\mathbf x_0$ (or equivalently the noise) from $\mathbf x_t$.`,
    },
    {
      kind: 'truefalse',
      prompt: String.raw`The true reverse transition $q(\mathbf x_{t-1}\mid\mathbf x_t)$ is exactly Gaussian for any step size $\beta_t$.`,
      answer: false,
      why: String.raw`$q(\mathbf x_{t-1}\mid\mathbf x_t)\propto q(\mathbf x_t\mid\mathbf x_{t-1})\,q(\mathbf x_{t-1})$ and the marginal $q(\mathbf x_{t-1})$ can be multimodal. Only in the limit of small steps is it well approximated by a Gaussian — which is why diffusion uses many small steps. Conditioning on $\mathbf x_0$ does make it exactly Gaussian.`,
    },
    {
      kind: 'explain',
      title: 'Training objective: an ELBO',
      body: String.raw`A diffusion model is a **hierarchical VAE** whose encoder is the fixed forward process (see [VAEs](@ml/vaes)). The same evidence lower bound gives
$$-\log p_\theta(\mathbf x_0)\le\mathbb E_q\Big[\underbrace{D_{\mathrm{KL}}(q(\mathbf x_T|\mathbf x_0)\|p(\mathbf x_T))}_{L_T\ \approx\ 0}+\sum_{t>1}\underbrace{D_{\mathrm{KL}}\big(q(\mathbf x_{t-1}|\mathbf x_t,\mathbf x_0)\,\|\,p_\theta(\mathbf x_{t-1}|\mathbf x_t)\big)}_{L_{t-1}}\underbrace{-\log p_\theta(\mathbf x_0|\mathbf x_1)}_{L_0}\Big].$$

Every $L_{t-1}$ is a [KL between Gaussians](@stats/entropy-kl) with equal covariance, so it is a squared distance of means:
$$L_{t-1}=\frac{1}{2\sigma_t^2}\big\|\tilde{\boldsymbol\mu}_t(\mathbf x_t,\mathbf x_0)-\boldsymbol\mu_\theta(\mathbf x_t,t)\big\|^2+\text{const}.$$`,
    },
    {
      kind: 'explain',
      title: 'Predict the noise',
      body: String.raw`**Ho et al. (2020)** parameterize the mean through a noise predictor $\boldsymbol\varepsilon_\theta$:
$$\boldsymbol\mu_\theta(\mathbf x_t,t)=\frac1{\sqrt{\alpha_t}}\Big(\mathbf x_t-\frac{\beta_t}{\sqrt{1-\bar\alpha_t}}\,\boldsymbol\varepsilon_\theta(\mathbf x_t,t)\Big).$$
Then $L_{t-1}\propto\|\boldsymbol\varepsilon-\boldsymbol\varepsilon_\theta(\mathbf x_t,t)\|^2$ with a $t$-dependent weight. Dropping the weights gives the famous **simple loss**:
$$\boxed{\mathcal L_{\text{simple}}=\mathbb E_{t\sim\mathcal U\{1..T\},\,\mathbf x_0,\,\boldsymbol\varepsilon}\big\|\boldsymbol\varepsilon-\boldsymbol\varepsilon_\theta\big(\sqrt{\bar\alpha_t}\mathbf x_0+\sqrt{1-\bar\alpha_t}\boldsymbol\varepsilon,\ t\big)\big\|^2}$$
It is no longer the exact ELBO — it re-weights noise levels — but gives better samples. Training is just regression: noise an image, ask the network which noise you added.`,
    },
    {
      kind: 'order',
      prompt: 'Order one DDPM training step.',
      steps: [
        String.raw`Sample a clean example $\mathbf x_0$ from the dataset`,
        String.raw`Sample a timestep $t\sim\mathcal U\{1,\dots,T\}$ and noise $\boldsymbol\varepsilon\sim\mathcal N(0,I)$`,
        String.raw`Form $\mathbf x_t=\sqrt{\bar\alpha_t}\,\mathbf x_0+\sqrt{1-\bar\alpha_t}\,\boldsymbol\varepsilon$`,
        String.raw`Predict $\boldsymbol\varepsilon_\theta(\mathbf x_t,t)$ and compute $\|\boldsymbol\varepsilon-\boldsymbol\varepsilon_\theta\|^2$`,
        'Take a gradient step on θ',
      ],
      why: String.raw`Thanks to the closed-form $q(\mathbf x_t\mid\mathbf x_0)$, each training example needs just one network evaluation at one random noise level — no simulation of the chain.`,
    },
    {
      kind: 'explain',
      title: 'Noise prediction = score = denoising',
      body: String.raw`[Tweedie's formula](@ml/score-matching) for $\mathbf x_t=\sqrt{\bar\alpha_t}\mathbf x_0+\sqrt{1-\bar\alpha_t}\boldsymbol\varepsilon$ reads
$$\nabla\log p_t(\mathbf x_t)=-\frac{\mathbb E[\boldsymbol\varepsilon\mid\mathbf x_t]}{\sqrt{1-\bar\alpha_t}}.$$
The optimal $\boldsymbol\varepsilon_\theta$ is exactly $\mathbb E[\boldsymbol\varepsilon\mid\mathbf x_t]$, so
$$\mathbf s_\theta(\mathbf x_t,t)=-\frac{\boldsymbol\varepsilon_\theta(\mathbf x_t,t)}{\sqrt{1-\bar\alpha_t}},\qquad\hat{\mathbf x}_0=\frac{\mathbf x_t-\sqrt{1-\bar\alpha_t}\,\boldsymbol\varepsilon_\theta}{\sqrt{\bar\alpha_t}}.$$
Three equivalent parameterizations — predict the **noise**, the **score**, or the **clean data** — related by fixed affine maps. DDPM's $\mathcal L_{\text{simple}}$ is denoising score matching summed over noise levels.`,
    },
    {
      kind: 'fill',
      prompt: String.raw`For a trained DDPM, the score estimate is $\mathbf s_\theta(\mathbf x_t,t)=$ ___ $\cdot\,\boldsymbol\varepsilon_\theta(\mathbf x_t,t)$, and the clean-data estimate $\hat{\mathbf x}_0$ is obtained by subtracting the predicted noise and dividing by ___.`,
      bank: ['−1/√(1−ᾱ_t)', '+1/√(1−ᾱ_t)', '−√ᾱ_t', '√ᾱ_t', '1−ᾱ_t', 'β_t'],
      answer: ['−1/√(1−ᾱ_t)', '√ᾱ_t'],
      why: String.raw`The score points *against* the added noise (hence the minus) and is scaled by the inverse noise std. Solving $\mathbf x_t=\sqrt{\bar\alpha_t}\mathbf x_0+\sqrt{1-\bar\alpha_t}\boldsymbol\varepsilon$ for $\mathbf x_0$ divides by the signal coefficient $\sqrt{\bar\alpha_t}$.`,
    },
    {
      kind: 'widget',
      title: 'Sampling: run the chain backwards',
      body: String.raw`**DDPM sampler.** $\mathbf x_T\sim\mathcal N(0,I)$; for $t=T,\dots,1$:
$$\mathbf x_{t-1}=\frac1{\sqrt{\alpha_t}}\Big(\mathbf x_t-\frac{\beta_t}{\sqrt{1-\bar\alpha_t}}\boldsymbol\varepsilon_\theta(\mathbf x_t,t)\Big)+\sigma_t\mathbf z,\quad\mathbf z\sim\mathcal N(0,I)\ (\mathbf z=0\text{ at }t=1).$$
Press **Play** below. The widget uses the *exact* optimal denoiser for its 240 training points instead of a network — so every sample lands on a training point: **perfect memorization**. Real networks generalize precisely because they cannot fit this empirical optimum exactly. Try the deterministic **DDIM** sampler too ([fast samplers](@ml/ddim-sampling)).`,
      widget: { type: 'DiffusionDenoise', props: { dataset: 'spiral', mode: 'reverse', sampler: 'ddpm', steps: 60 } },
    },
    {
      kind: 'mcq',
      prompt: String.raw`What does the denoising network $\boldsymbol\varepsilon_\theta$ take as input?`,
      choices: [
        String.raw`Only the noisy sample $\mathbf x_t$`,
        String.raw`The noisy sample $\mathbf x_t$ and the timestep (noise level) $t$`,
        String.raw`The clean sample $\mathbf x_0$ and the noise $\boldsymbol\varepsilon$`,
        String.raw`The previous sample $\mathbf x_{t+1}$ and $\mathbf x_t$`,
      ],
      answer: 1,
      why: String.raw`One network serves all noise levels, so it must be told the level $t$ (usually via a sinusoidal embedding). It never sees $\mathbf x_0$ or $\boldsymbol\varepsilon$ — those are what it must infer. Without $t$ it would have to guess the noise level from $\mathbf x_t$ alone.`,
    },
    {
      kind: 'multi',
      prompt: 'Which statements about DDPM are true? (Select all that apply.)',
      choices: [
        'The forward process has no learnable parameters.',
        'Training requires simulating the forward chain step by step.',
        String.raw`$\mathcal L_{\text{simple}}$ is a re-weighted version of the ELBO terms.`,
        'Sampling with T = 1000 steps needs 1000 network evaluations.',
      ],
      answers: [0, 2, 3],
      why: String.raw`The forward schedule $\beta_t$ is fixed. The closed form $q(\mathbf x_t\mid\mathbf x_0)$ removes any need to simulate during training. $\mathcal L_{\text{simple}}$ drops the $t$-dependent weights of the true ELBO terms. Sampling is sequential: one network call per step — the motivation for DDIM, distillation and consistency models.`,
    },
    {
      kind: 'match',
      prompt: 'Match each quantity to its role.',
      pairs: [
        [String.raw`$\beta_t$`, 'Variance of noise added at forward step t'],
        [String.raw`$\bar\alpha_t$`, 'Fraction of signal variance remaining after t steps'],
        [String.raw`$\boldsymbol\varepsilon_\theta(\mathbf x_t,t)$`, 'Network estimate of the noise in x_t'],
        [String.raw`$\tilde{\boldsymbol\mu}_t(\mathbf x_t,\mathbf x_0)$`, 'Mean of the exact reverse step given the clean point'],
      ],
      why: String.raw`$\beta_t$ defines the schedule; $\bar\alpha_t=\prod(1-\beta_s)$ summarizes it; $\boldsymbol\varepsilon_\theta$ is the only learned object; $\tilde{\boldsymbol\mu}_t$ is the regression target implicit in each ELBO term.`,
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- Forward: $\mathbf x_t=\sqrt{\bar\alpha_t}\mathbf x_0+\sqrt{1-\bar\alpha_t}\boldsymbol\varepsilon$ — closed form, no parameters.
- Reverse: Gaussian steps whose mean is set by a noise predictor $\boldsymbol\varepsilon_\theta(\mathbf x_t,t)$.
- Loss: ELBO of a hierarchical VAE → simplified to $\mathbb E\|\boldsymbol\varepsilon-\boldsymbol\varepsilon_\theta(\mathbf x_t,t)\|^2$.
- Noise, score and clean-image predictions are equivalent: $\mathbf s_\theta=-\boldsymbol\varepsilon_\theta/\sqrt{1-\bar\alpha_t}$.
- Next: the continuous-time [score SDE](@ml/score-sde) view and its probability-flow ODE, which leads to [flow matching](@ml/flow-matching).`,
    },
  ],
  references: [
    { authors: 'J. Ho, A. Jain & P. Abbeel', title: 'Denoising Diffusion Probabilistic Models', year: 2020, venue: 'NeurIPS', url: 'https://arxiv.org/abs/2006.11239' },
    { authors: 'J. Sohl-Dickstein, E. Weiss, N. Maheswaranathan & S. Ganguli', title: 'Deep Unsupervised Learning using Nonequilibrium Thermodynamics', year: 2015, venue: 'ICML', url: 'https://arxiv.org/abs/1503.03585' },
    { authors: 'C. Luo', title: 'Understanding Diffusion Models: A Unified Perspective', year: 2022, venue: 'arXiv:2208.11970', url: 'https://arxiv.org/abs/2208.11970' },
    { authors: 'C. M. Bishop & H. Bishop', title: 'Deep Learning: Foundations and Concepts', year: 2024, venue: 'Springer', detail: 'Ch. 20' },
  ],
} satisfies LessonContent;
