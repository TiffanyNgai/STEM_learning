import type { LessonContent } from '../../types';

// VP (linear β, β_min = 0.1, β_max = 20): σ(t) = √(1 − exp(−∫₀ᵗβ)) with ∫₀ᵗβ = 0.1t + 9.95t².
const VP_LOG = 'log(sqrt(1-exp(-(0.1*x+9.95*x^2))))/log(10)';
// VE (geometric, σ_min = 0.01 → σ_max = 50): log10 σ(t) = −2 + t·log10(5000).
const VE_LOG = '-2+3.69897*x';

export default {
  cards: [
    {
      kind: 'explain',
      title: 'Let the step count go to infinity',
      body: String.raw`[DDPM](@ml/diffusion-models) uses $T=1000$ discrete steps. Nothing is special about 1000 — with $T=2000$ and half-sized $\beta_t$ you get almost the same model. Push this to the limit and the index $t$ becomes a **continuous time** $t\in[0,1]$, the chain becomes a **stochastic differential equation**, and everything (DDPM, score matching with many noise levels, deterministic samplers) turns into one picture.

**Song et al. (2021)** wrote that picture down. Two objects do all the work:
- a **forward SDE** that turns data into noise, chosen by hand;
- its **time reversal**, which needs only one unknown: the score $\nabla_{\mathbf x}\log p_t(\mathbf x)$.`,
      widget: { type: 'DiffusionDenoise', props: { dataset: 'moons', mode: 'forward', showScore: true, t: 0.5 } },
    },
    {
      kind: 'recall',
      title: 'Recall: stochastic differential equations',
      points: [
        String.raw`An SDE $d\mathbf x=\mathbf f(\mathbf x,t)\,dt+g(t)\,d\mathbf w$ says: over $dt$, move deterministically by $\mathbf f\,dt$ (**drift**) and add Gaussian noise of standard deviation $g\sqrt{dt}$ (**diffusion**).`,
        String.raw`$\mathbf w$ is Brownian motion: independent increments, $\mathbf w_{t+\Delta}-\mathbf w_t\sim\mathcal N(0,\Delta I)$. Its paths are continuous but nowhere differentiable — hence the jagged trajectories.`,
        String.raw`**Euler–Maruyama** simulates it: $\mathbf x\leftarrow\mathbf x+\mathbf f\,\Delta t+g\sqrt{\Delta t}\,\mathbf z$, $\mathbf z\sim\mathcal N(0,I)$.`,
        String.raw`The density $p_t$ of $\mathbf x_t$ obeys the **Fokker–Planck** equation $\partial_tp_t=-\nabla\!\cdot\!(\mathbf f p_t)+\tfrac12g^2\Delta p_t$ — a drift term plus a [heat-equation](@math/pde-heat-equation) term.`,
      ],
      link: 'math/sde-intro',
    },
    {
      kind: 'explain',
      title: 'DDPM in the limit: the VP SDE',
      body: String.raw`Write $\beta_t=\beta(t)\,\Delta t$ with $\Delta t=1/T$ and $t=i/T$. The DDPM step $\mathbf x_i=\sqrt{1-\beta_i}\,\mathbf x_{i-1}+\sqrt{\beta_i}\,\boldsymbol\varepsilon$ becomes, to first order in $\Delta t$,
$$\mathbf x_{t+\Delta t}\approx\Big(1-\tfrac12\beta(t)\Delta t\Big)\mathbf x_t+\sqrt{\beta(t)\Delta t}\,\boldsymbol\varepsilon\ \Longrightarrow\ \boxed{d\mathbf x=-\tfrac12\beta(t)\,\mathbf x\,dt+\sqrt{\beta(t)}\,d\mathbf w}$$
using $\sqrt{1-u}\approx1-u/2$. This is the **variance-preserving (VP) SDE**. Its marginals are exactly the DDPM ones in continuous time:
$$\mathbf x_t=\sqrt{\bar\alpha(t)}\,\mathbf x_0+\sqrt{1-\bar\alpha(t)}\,\boldsymbol\varepsilon,\qquad\bar\alpha(t)=\exp\Big(-\!\int_0^t\!\beta(s)\,ds\Big).$$
If $\operatorname{Var}\mathbf x_0=I$ then $\operatorname{Var}\mathbf x_t=I$ for all $t$ — the variance is *preserved*, which is where the name comes from.`,
    },
    {
      kind: 'explain',
      title: 'The other classic: the VE SDE',
      body: String.raw`The noise-conditional score networks of [score matching](@ml/score-matching) never shrink the signal; they just pile on noise, $\tilde{\mathbf x}=\mathbf x_0+\sigma\boldsymbol\varepsilon$. Its continuous limit has **no drift at all**:
$$d\mathbf x=\sqrt{\frac{d\big[\sigma^2(t)\big]}{dt}}\,d\mathbf w,\qquad \mathbf x_t=\mathbf x_0+\sigma(t)\boldsymbol\varepsilon .$$
This is the **variance-exploding (VE) SDE**: $\sigma$ grows geometrically from $\sigma_{\min}=0.01$ to $\sigma_{\max}=50$ (the CIFAR-10 setting of Song et al.), so $\operatorname{Var}\mathbf x_t$ blows up and $p_1$ is a huge, almost data-independent Gaussian. Song et al. also define a **sub-VP** SDE whose variance is always below the VP one and which gave the best likelihoods.

Below: the noise level $\sigma_t$ of both, on a $\log_{10}$ scale. Same job, very different scaling — which is why VP and VE models need different preconditioning.`,
      widget: {
        type: 'FunctionPlot',
        props: {
          fns: [VP_LOG, VE_LOG],
          x: [0, 1], y: [-2.3, 1.9],
          labels: ['VP: log10 of sqrt(1-abar)', 'VE: log10 sigma'],
          xLabel: 't', yLabel: 'log10 noise level',
        },
        caption: String.raw`VP noise saturates at $1$ (it also shrinks the signal); VE noise runs up to $50$ with the signal left untouched.`,
      },
    },
    {
      kind: 'numeric',
      prompt: String.raw`The VP SDE with the standard linear schedule $\beta(t)=\beta_{\min}+t(\beta_{\max}-\beta_{\min})$, $\beta_{\min}=0.1$, $\beta_{\max}=20$. Compute $\int_0^1\beta(t)\,dt$.`,
      answer: 10.05,
      tolerance: 0.01,
      why: String.raw`The integral of a linear function is its average times the length: $\tfrac12(0.1+20)\cdot1=10.05$. Hence $\bar\alpha(1)=e^{-10.05}\approx4.3\times10^{-5}$ and the surviving signal coefficient is $\sqrt{\bar\alpha(1)}=e^{-5.025}\approx0.0066$ — small enough that $p_1$ is practically $\mathcal N(0,I)$, but not exactly: that mismatch is the $L_T$ term of the ELBO.`,
    },
    {
      kind: 'explain',
      title: 'Running time backwards',
      body: String.raw`Here is the remarkable fact, due to **Anderson (1982)**: the time reversal of a diffusion is again a diffusion. If $d\mathbf x=\mathbf f\,dt+g\,d\mathbf w$, then running from $t=1$ down to $0$,
$$\boxed{d\mathbf x=\big[\mathbf f(\mathbf x,t)-g(t)^2\nabla_{\mathbf x}\log p_t(\mathbf x)\big]dt+g(t)\,d\bar{\mathbf w}}$$
where $dt$ is a negative time increment and $\bar{\mathbf w}$ is a Brownian motion running backwards.

Read it: *the reverse drift is the forward drift, corrected by the score*. For the VP SDE,
$$d\mathbf x=\big[-\tfrac12\beta(t)\mathbf x-\beta(t)\,\nabla\log p_t(\mathbf x)\big]dt+\sqrt{\beta(t)}\,d\bar{\mathbf w}.$$
Everything on the right is known once we have a score model $\mathbf s_\theta(\mathbf x,t)\approx\nabla\log p_t(\mathbf x)$ — and Euler–Maruyama on this reverse SDE *is* the DDPM sampler.`,
    },
    {
      kind: 'widget',
      title: 'Where the score comes from: rewrite Fokker–Planck',
      body: String.raw`The score is not an extra assumption — it is already hiding inside the diffusion term. Watch the heat term turn into a drift.`,
      widget: {
        type: 'StepReveal',
        props: {
          steps: [
            String.raw`Forward Fokker–Planck: $\partial_tp_t=-\nabla\cdot(\mathbf fp_t)+\tfrac12g^2\Delta p_t$.`,
            String.raw`Use $\nabla p_t=p_t\nabla\log p_t$, so $\tfrac12g^2\Delta p_t=\nabla\cdot\big(\tfrac12g^2p_t\nabla\log p_t\big)$.`,
            String.raw`Substitute: $\partial_tp_t=-\nabla\cdot\Big[\big(\underbrace{\mathbf f-\tfrac12g^2\nabla\log p_t}_{\textstyle \tilde{\mathbf v}_t}\big)p_t\Big]$ — a **continuity equation** with no diffusion term.`,
            String.raw`A continuity equation $\partial_tp+\nabla\cdot(p\tilde{\mathbf v})=0$ is exactly what the deterministic ODE $\dot{\mathbf x}=\tilde{\mathbf v}_t(\mathbf x)$ produces. So that ODE has the **same marginals $p_t$** as the SDE.`,
            String.raw`More generally $\tfrac12g^2\Delta p_t$ can be split between a drift part and a leftover diffusion of size $\lambda g^2$ for any $\lambda\in[0,1]$: $\lambda=0$ gives the ODE, $\lambda=1$ Anderson's reverse SDE. All share the marginals.`,
          ],
          notes: ['', 'This identity is the whole trick.', '', 'Compare the continuity equation of [flow matching](@ml/flow-matching).', ''],
        },
      },
    },
    {
      kind: 'explain',
      title: 'The probability-flow ODE',
      body: String.raw`Taking $\lambda=0$ gives the **probability-flow (PF) ODE**:
$$\frac{d\mathbf x}{dt}=\mathbf f(\mathbf x,t)-\tfrac12g(t)^2\nabla\log p_t(\mathbf x),\qquad\text{VP: }\ \frac{d\mathbf x}{dt}=-\tfrac12\beta(t)\big[\mathbf x+\nabla\log p_t(\mathbf x)\big].$$
It is a **continuous normalizing flow** with the same $p_t$ at every time, and it buys you four things:
1. **Deterministic sampling** — one noise vector, one image; you can use any ODE solver, including high-order ones with far fewer steps ([fast samplers](@ml/ddim-sampling)).
2. **Exact likelihoods** via the instantaneous change of variables, $\frac{d}{dt}\log p_t(\mathbf x_t)=-\nabla\!\cdot\!\tilde{\mathbf v}_t$, with the divergence estimated by Hutchinson's trick. Song et al. reported 2.99 bits/dim on CIFAR-10 this way.
3. **A usable latent space**: the map noise $\to$ data is invertible, so you can encode a real image and interpolate or edit.
4. The bridge to [flow matching](@ml/flow-matching), which learns the velocity $\tilde{\mathbf v}_t$ directly instead of the score.`,
    },
    {
      kind: 'widget',
      title: 'Same marginals, different paths',
      body: String.raw`A 1-D mixture of three Gaussians, reverse-sampled from the *same* terminal noise two ways. The **reverse SDE** (blue) keeps injecting noise, so its paths are jagged and a path can still change its mind about which mode to join. The **PF ODE** (purple) is smooth and deterministic — one starting value, one destination, no crossings. Press **↺ New noise** a few times: the endpoints of both pile up on the same three modes, in similar proportions, because the two processes share $p_t$ at every $t$ (the leftover differences are discretization error, which the two solvers make differently).`,
      widget: { type: 'MlSdeOdePaths', props: { show: 'both', paths: 14 } },
    },
    {
      kind: 'mcq',
      prompt: 'In what sense are the reverse SDE and the probability-flow ODE "the same model"?',
      choices: [
        'They produce identical individual trajectories, just computed differently.',
        'They have the same marginal distribution p_t at every time t, although individual trajectories differ.',
        'They have the same trajectories but different marginals.',
        'They agree only at t = 0 and t = 1.',
      ],
      answer: 1,
      why: String.raw`Both correspond to the same Fokker–Planck/continuity equation for $p_t$, so every time slice matches in distribution. The path-wise behaviour is completely different: the ODE is deterministic and its trajectories cannot cross, the SDE's are random. A given noise vector therefore maps to different samples under the two.`,
    },
    {
      kind: 'truefalse',
      prompt: String.raw`Under the VE SDE, the marginal at time $t$ is $\mathcal N(\mathbf x_0,\sigma^2(t)I)$ given $\mathbf x_0$ — the clean signal is never attenuated.`,
      answer: true,
      why: String.raw`VE has zero drift, so $\mathbf x_t=\mathbf x_0+\sigma(t)\boldsymbol\varepsilon$ exactly. Only the noise grows, which is why $\sigma_{\max}$ must be comparable to the diameter of the data (50 for CIFAR-10 pixels in $[-1,1]$) before $p_1$ forgets the data. VP instead shrinks the signal toward zero, so a fixed $\mathcal N(0,I)$ prior works.`,
    },
    {
      kind: 'explain',
      title: 'One training objective for all of it',
      body: String.raw`Train a single network on all times with weighted denoising score matching:
$$\mathcal L(\theta)=\mathbb E_{t\sim\mathcal U[0,1]}\ \lambda(t)\ \mathbb E_{\mathbf x_0}\mathbb E_{\mathbf x_t\mid\mathbf x_0}\Big\|\mathbf s_\theta(\mathbf x_t,t)-\nabla_{\mathbf x_t}\log p_{0t}(\mathbf x_t\mid\mathbf x_0)\Big\|^2,$$
and the inner target is known in closed form, $-\boldsymbol\varepsilon/\sigma_t$, because $p_{0t}$ is Gaussian for both SDEs.

The weight $\lambda(t)$ is a design choice: $\lambda=g(t)^2$ makes $\mathcal L$ an upper bound on the negative log-likelihood (the continuous ELBO), while $\lambda=\sigma_t^2$ reproduces DDPM's $\mathcal L_{\text{simple}}$ — better-looking samples, no longer a bound. Same network, different emphasis across noise levels.

**Predictor–corrector sampling.** Because we know the score at every $t$, we can interleave an SDE/ODE step (*predictor*) with a few [Langevin](@ml/score-matching) steps at the current noise level (*corrector*) that push samples back onto $p_t$. This fixes discretization drift and was part of the first score-based model to beat GANs on CIFAR-10 (FID 2.20).`,
    },
    {
      kind: 'fill',
      prompt: String.raw`The reverse-time SDE subtracts ___ times the score from the forward drift, while the probability-flow ODE subtracts ___ times the score. The ODE is obtained by rewriting the ___ term of the Fokker–Planck equation as a drift.`,
      bank: ['g(t)²', '½g(t)²', '2g(t)²', 'diffusion', 'drift', 'boundary'],
      answer: ['g(t)²', '½g(t)²', 'diffusion'],
      why: String.raw`Anderson's reversal keeps the noise, so it needs the full $g^2\nabla\log p_t$ correction; removing the noise entirely means only half of it is needed. The identity $\tfrac12g^2\Delta p=\nabla\cdot(\tfrac12g^2p\nabla\log p)$ converts the diffusion (second-derivative) term into transport.`,
    },
    {
      kind: 'match',
      prompt: 'Match each continuous-time object to what it corresponds to in the discrete world.',
      pairs: [
        [String.raw`VP SDE $d\mathbf x=-\tfrac12\beta\mathbf x\,dt+\sqrt\beta\,d\mathbf w$`, 'The DDPM forward chain'],
        [String.raw`VE SDE $d\mathbf x=\sqrt{d[\sigma^2]/dt}\,d\mathbf w$`, 'The ladder of noise levels in NCSN / annealed Langevin'],
        [String.raw`Euler–Maruyama on the reverse SDE`, 'The ancestral DDPM sampler'],
        [String.raw`Euler steps on the probability-flow ODE`, 'Deterministic DDIM-style sampling'],
      ],
      why: String.raw`The SDE framework is not a new model but a change of language: each discrete algorithm is a particular discretization of one of these two SDEs or of their reversals. That is exactly why one trained network can be sampled in many ways.`,
    },
    {
      kind: 'explain',
      title: 'Noise level as the clock (EDM)',
      body: String.raw`**Karras et al. (2022)** pointed out that $t$ itself is arbitrary — what the network really sees is a noise level $\sigma$. Choosing $\sigma(t)=t$ with zero drift turns the PF ODE into
$$\frac{d\mathbf x}{d\sigma}=\frac{\mathbf x-D(\mathbf x;\sigma)}{\sigma},$$
where $D(\mathbf x;\sigma)=\mathbb E[\mathbf x_0\mid\mathbf x]$ is the denoiser (recall $\nabla\log p_\sigma(\mathbf x)=(D(\mathbf x;\sigma)-\mathbf x)/\sigma^2$ by Tweedie). With the network *preconditioned* — inputs scaled to unit variance, outputs mixed as $D=c_{\text{skip}}\mathbf x+c_{\text{out}}F_\theta(c_{\text{in}}\mathbf x,c_{\text{noise}})$ — plus a well-chosen $\sigma$ grid and Heun's second-order solver, EDM reached FID below 2 on CIFAR-10 with 35 network evaluations. Separating *schedule*, *preconditioning*, *loss weighting* and *solver* is the practical legacy of the SDE view.`,
    },
    {
      kind: 'order',
      prompt: 'Order the stages of building and using a score-SDE generative model.',
      steps: [
        String.raw`Pick a forward SDE (VP, sub-VP or VE) and hence the perturbation kernel $p_{0t}(\mathbf x_t\mid\mathbf x_0)$`,
        String.raw`Train $\mathbf s_\theta(\mathbf x,t)$ by weighted denoising score matching over $t\in[0,1]$`,
        String.raw`Draw $\mathbf x_1$ from the prior ($\mathcal N(0,I)$ for VP, $\mathcal N(0,\sigma_{\max}^2I)$ for VE)`,
        String.raw`Integrate the reverse SDE or the probability-flow ODE from $t=1$ to $t\approx0$, substituting $\mathbf s_\theta$ for $\nabla\log p_t$`,
        String.raw`Optionally add corrector (Langevin) steps, then output $\mathbf x_0$`,
      ],
      why: String.raw`The forward SDE is a modelling choice that fixes the training targets; training needs no simulation because $p_{0t}$ is Gaussian; only at sampling time do you choose between stochastic and deterministic integration — with the same weights.`,
    },
    {
      kind: 'multi',
      prompt: 'Which are genuine consequences of the continuous-time formulation? (Select all that apply.)',
      choices: [
        'One trained network can be sampled with many different solvers and step counts.',
        'Exact log-likelihood computation becomes possible through the probability-flow ODE.',
        'The number of network evaluations needed to sample drops automatically to one.',
        'DDPM and score matching with multiple noise levels are revealed as two discretizations of the same idea.',
      ],
      answers: [0, 1, 3],
      why: String.raw`Training targets depend only on the perturbation kernel, so the sampler is decoupled from the weights — that is what allows ODE solvers and likelihood evaluation. Cheap sampling still takes work: better solvers, distillation or [consistency models](@ml/consistency-models) are needed to reach one step.`,
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- Forward noising is an SDE: **VP** $d\mathbf x=-\tfrac12\beta\mathbf x\,dt+\sqrt\beta\,d\mathbf w$ (DDPM) or **VE** $d\mathbf x=\sqrt{d[\sigma^2]/dt}\,d\mathbf w$ (NCSN).
- **Anderson:** reverse $d\mathbf x=[\mathbf f-g^2\nabla\log p_t]dt+g\,d\bar{\mathbf w}$ — only the score is unknown.
- Rewriting the diffusion term of Fokker–Planck as transport gives the **probability-flow ODE** $\dot{\mathbf x}=\mathbf f-\tfrac12g^2\nabla\log p_t$: same marginals, deterministic paths, exact likelihoods.
- One weighted denoising-score-matching loss trains everything; $\lambda=g^2$ gives a likelihood bound, $\lambda=\sigma_t^2$ gives DDPM's simple loss.
- Thinking in noise levels (EDM) separates schedule, preconditioning, weighting and solver — the setup for [fast samplers](@ml/ddim-sampling).`,
    },
  ],
  references: [
    { authors: 'Y. Song, J. Sohl-Dickstein, D. P. Kingma, A. Kumar, S. Ermon & B. Poole', title: 'Score-Based Generative Modeling through Stochastic Differential Equations', year: 2021, venue: 'ICLR', url: 'https://arxiv.org/abs/2011.13456' },
    { authors: 'B. D. O. Anderson', title: 'Reverse-time diffusion equation models', year: 1982, venue: 'Stochastic Processes and their Applications 12(3), 313–326' },
    { authors: 'T. Karras, M. Aittala, T. Aila & S. Laine', title: 'Elucidating the Design Space of Diffusion-Based Generative Models', year: 2022, venue: 'NeurIPS', url: 'https://arxiv.org/abs/2206.00364' },
    { authors: 'Y. Song, C. Durkan, I. Murray & S. Ermon', title: 'Maximum Likelihood Training of Score-Based Diffusion Models', year: 2021, venue: 'NeurIPS', url: 'https://arxiv.org/abs/2101.09258' },
    { authors: 'S. Särkkä & A. Solin', title: 'Applied Stochastic Differential Equations', year: 2019, venue: 'Cambridge University Press', detail: 'Ch. 5 (Fokker–Planck)' },
  ],
} satisfies LessonContent;
