import type { LessonContent } from '../../types';

export default {
  cards: [
    {
      kind: 'explain',
      title: 'One thousand network calls per picture',
      body: String.raw`Training a diffusion model is cheap per example — one noise level, one forward pass. **Sampling** is the opposite: the DDPM chain takes $T=1000$ sequential steps, each a full U-Net evaluation. On the hardware of 2020 that meant tens of seconds for one 256×256 image, and the steps cannot be parallelized because each needs the previous one.

The number that matters is **NFE** (number of function evaluations). This lesson is about getting from 1000 NFE to 10–50 **without retraining anything**. The key is the lesson of the [score SDE](@ml/score-sde): the weights define a score field; the sampler is a separate choice.`,
      widget: { type: 'DiffusionDenoise', props: { dataset: 'spiral', mode: 'reverse', sampler: 'ddim', steps: 20 }, caption: 'The same toy denoiser as in DDPM, run with only 20 deterministic steps.' },
    },
    {
      kind: 'explain',
      title: 'The loss never asked for a Markov chain',
      body: String.raw`Look again at DDPM's training objective:
$$\mathcal L_{\text{simple}}=\mathbb E\big\|\boldsymbol\varepsilon-\boldsymbol\varepsilon_\theta\big(\sqrt{\bar\alpha_t}\mathbf x_0+\sqrt{1-\bar\alpha_t}\boldsymbol\varepsilon,\,t\big)\big\|^2 .$$
It only ever uses the **marginals** $q(\mathbf x_t\mid\mathbf x_0)=\mathcal N(\sqrt{\bar\alpha_t}\mathbf x_0,(1-\bar\alpha_t)I)$. The Markov chain $\mathbf x_0\to\mathbf x_1\to\dots$ was one *story* about where those marginals came from; the loss cannot tell the difference.

**Song, Meng & Ermon (2021)** exploited this: invent a different, **non-Markovian** forward process with the *same* marginals, derive *its* reverse, and reuse the already-trained $\boldsymbol\varepsilon_\theta$. That family contains DDPM at one end and a deterministic sampler — **DDIM** — at the other.`,
    },
    {
      kind: 'widget',
      title: 'The non-Markovian family',
      body: String.raw`Define, for a free parameter $\sigma_t\ge0$,
$$q_\sigma(\mathbf x_{t-1}\mid\mathbf x_t,\mathbf x_0)=\mathcal N\Big(\sqrt{\bar\alpha_{t-1}}\,\mathbf x_0+\sqrt{1-\bar\alpha_{t-1}-\sigma_t^2}\cdot\frac{\mathbf x_t-\sqrt{\bar\alpha_t}\mathbf x_0}{\sqrt{1-\bar\alpha_t}},\ \sigma_t^2I\Big).$$
Each step is allowed to peek at $\mathbf x_0$, so the process is not a Markov chain in $\mathbf x_t$ alone. Check that the marginals survive:`,
      widget: {
        type: 'StepReveal',
        props: {
          steps: [
            String.raw`Assume $\mathbf x_t=\sqrt{\bar\alpha_t}\mathbf x_0+\sqrt{1-\bar\alpha_t}\,\boldsymbol\varepsilon$ with $\boldsymbol\varepsilon\sim\mathcal N(0,I)$ — true at $t=T$ by construction.`,
            String.raw`Then $(\mathbf x_t-\sqrt{\bar\alpha_t}\mathbf x_0)/\sqrt{1-\bar\alpha_t}=\boldsymbol\varepsilon$, so the mean above is $\sqrt{\bar\alpha_{t-1}}\mathbf x_0+\sqrt{1-\bar\alpha_{t-1}-\sigma_t^2}\,\boldsymbol\varepsilon$.`,
            String.raw`Add the step's own noise: $\mathbf x_{t-1}=\sqrt{\bar\alpha_{t-1}}\mathbf x_0+\sqrt{1-\bar\alpha_{t-1}-\sigma_t^2}\,\boldsymbol\varepsilon+\sigma_t\mathbf z$, with $\mathbf z\perp\boldsymbol\varepsilon$.`,
            String.raw`Independent Gaussians add variances: $(1-\bar\alpha_{t-1}-\sigma_t^2)+\sigma_t^2=1-\bar\alpha_{t-1}$.`,
            String.raw`So $\mathbf x_{t-1}=\sqrt{\bar\alpha_{t-1}}\mathbf x_0+\sqrt{1-\bar\alpha_{t-1}}\,\boldsymbol\varepsilon'$ — the DDPM marginal, for **every** choice of $\sigma_t$. Induction does the rest.`,
          ],
          notes: ['', '', '', 'The two noise sources were engineered to total the right variance.', 'One trained network, a whole family of samplers.'],
        },
      },
    },
    {
      kind: 'explain',
      title: 'The sampler: predict, then re-noise',
      body: String.raw`At sampling time $\mathbf x_0$ is unknown, so substitute the network's estimate $\hat{\mathbf x}_0=\big(\mathbf x_t-\sqrt{1-\bar\alpha_t}\,\boldsymbol\varepsilon_\theta(\mathbf x_t,t)\big)/\sqrt{\bar\alpha_t}$ and the predicted noise $\boldsymbol\varepsilon_\theta$ for $\boldsymbol\varepsilon$:
$$\boxed{\mathbf x_{t-1}=\underbrace{\sqrt{\bar\alpha_{t-1}}\,\hat{\mathbf x}_0}_{\text{predicted clean image}}+\underbrace{\sqrt{1-\bar\alpha_{t-1}-\sigma_t^2}\,\boldsymbol\varepsilon_\theta(\mathbf x_t,t)}_{\text{direction pointing to }\mathbf x_t}+\underbrace{\sigma_t\mathbf z}_{\text{fresh noise}}}$$
Three readable pieces: guess the clean image, step back toward the current noise level, optionally re-randomize. Note that $\hat{\mathbf x}_0$ early in sampling is a blurry average of the data — it sharpens as $t$ falls.`,
    },
    {
      kind: 'numeric',
      prompt: String.raw`A 1-D example with $\bar\alpha_t=0.64$, $\bar\alpha_{t-1}=0.81$, $\sigma_t=0$ (pure DDIM). The current sample is $x_t=1.0$ and the network predicts $\varepsilon_\theta=0.5$. What is $x_{t-1}$?`,
      answer: 1.0054,
      tolerance: 0.003,
      why: String.raw`First $\hat x_0=(1.0-\sqrt{0.36}\cdot0.5)/\sqrt{0.64}=(1-0.3)/0.8=0.875$. Then $x_{t-1}=0.9\cdot0.875+\sqrt{1-0.81}\cdot0.5=0.7875+0.4359\cdot0.5=1.0054$. The value barely moves, yet the *implied* clean image $\hat x_0$ is unchanged — a DDIM step mostly reduces the noise level, it does not wander.`,
    },
    {
      kind: 'explain',
      title: 'The η dial: from DDPM to a pure ODE',
      body: String.raw`Parameterize the free variance by one number $\eta\ge0$:
$$\sigma_t(\eta)=\eta\,\sqrt{\frac{1-\bar\alpha_{t-1}}{1-\bar\alpha_t}}\sqrt{1-\frac{\bar\alpha_t}{\bar\alpha_{t-1}}}\;=\;\eta\sqrt{\tilde\beta_t}.$$
- $\eta=1$: $\sigma_t^2$ equals the posterior variance $\tilde\beta_t$ and the update reduces **exactly** to the DDPM ancestral sampler.
- $\eta=0$: no noise is injected after $\mathbf x_T$. The map $\mathbf x_T\mapsto\mathbf x_0$ becomes a **deterministic function** — this is DDIM ("implicit" because the model is still defined implicitly by its sampler, not by an explicit density).
- $0<\eta<1$: a smooth interpolation, sometimes the sweet spot for mid-range step counts.`,
    },
    {
      kind: 'widget',
      title: 'Turn the dial yourself',
      body: String.raw`The same exact toy denoiser as in [DDPM](@ml/diffusion-models), with $\eta$ and the step count under your control. Three things to try:
- At $\eta=0$ the orange trails are smooth curves and each starting point has exactly one destination. Slide $\eta$ up to 1 — the *same* starting noise now follows jagged paths and lands somewhere else.
- Drop the steps to 6: the deterministic sampler still lands sensibly, while $\eta=1$ leaves samples stranded off the data — injected noise needs many steps to be removed again.
- Press **↺ New noise** to redraw from a fresh batch of $\mathbf x_T$ and check that the picture is not a fluke.`,
      widget: { type: 'MlDdimEta', props: { dataset: 'spiral', eta: 0, steps: 20 } },
    },
    {
      kind: 'mcq',
      prompt: String.raw`Why can DDIM re-use a network trained with the ordinary DDPM objective, with no fine-tuning?`,
      choices: [
        'Because DDIM re-derives the weights from the DDPM weights by a closed-form transformation.',
        'Because the DDPM objective depends on the forward process only through the marginals q(x_t | x_0), which the non-Markovian family keeps unchanged.',
        'Because DDIM uses a different network that is distilled from the DDPM one.',
        'Because the deterministic sampler ignores the noise level, so any network works.',
      ],
      answer: 1,
      why: String.raw`The training loss only ever samples $\mathbf x_t=\sqrt{\bar\alpha_t}\mathbf x_0+\sqrt{1-\bar\alpha_t}\boldsymbol\varepsilon$ and regresses $\boldsymbol\varepsilon$; the joint law of the chain never enters. Every member of the $\sigma_t$-family shares those marginals, so each one's reverse is served by the same $\boldsymbol\varepsilon_\theta$. No weights are transformed and nothing is distilled.`,
    },
    {
      kind: 'explain',
      title: 'Skipping timesteps',
      body: String.raw`The update uses only $\bar\alpha_t$ and $\bar\alpha_{t-1}$ — it never refers to a *neighbouring* index. So run it on any increasing subsequence $\tau_1<\dots<\tau_S$ of $\{1,\dots,T\}$, e.g. 50 of the 1000 trained timesteps:
$$\mathbf x_{\tau_{i-1}}=\sqrt{\bar\alpha_{\tau_{i-1}}}\hat{\mathbf x}_0+\sqrt{1-\bar\alpha_{\tau_{i-1}}-\sigma^2}\,\boldsymbol\varepsilon_\theta(\mathbf x_{\tau_i},\tau_i)+\sigma\mathbf z.$$
With $S=50$ the deterministic sampler produces images close to the 1000-step ones (Song et al. report a 10–50× speedup at comparable FID); the stochastic $\eta=1$ sampler degrades much faster as $S$ shrinks. **Nichol & Dhariwal (2021)** showed the stochastic sampler does far better in few steps if the model *learns* its reverse variance $\Sigma_\theta$ rather than fixing it.`,
    },
    {
      kind: 'truefalse',
      prompt: String.raw`With $\eta=0$, running the sampler twice from the same $\mathbf x_T$ but with different step counts (say 20 and 100) gives two images with recognisably the same content.`,
      answer: true,
      why: String.raw`Both runs approximate the *same* ODE trajectory, just with different discretizations, so they converge to nearly the same endpoint — coarse runs differ mainly in fine detail. This is why DDIM's $\mathbf x_T$ behaves like a meaningful latent code: high-level content is fixed by $\mathbf x_T$, not by the solver. With $\eta=1$ each run injects fresh noise and the images differ.`,
    },
    {
      kind: 'explain',
      title: 'DDIM is Euler on the probability-flow ODE',
      body: String.raw`Change variables to $\bar{\mathbf x}=\mathbf x/\sqrt{\bar\alpha}$ and $\sigma=\sqrt{1-\bar\alpha}/\sqrt{\bar\alpha}$ (the noise-to-signal ratio). The $\eta=0$ update rearranges into
$$\bar{\mathbf x}_{t-1}-\bar{\mathbf x}_t=(\sigma_{t-1}-\sigma_t)\,\boldsymbol\varepsilon_\theta(\mathbf x_t,t)\quad\Longleftrightarrow\quad d\bar{\mathbf x}=\boldsymbol\varepsilon_\theta\,d\sigma .$$
That is a plain **Euler step** on an ODE — and that ODE is the [probability-flow ODE](@ml/score-sde) of the VP SDE in disguise, since $\boldsymbol\varepsilon_\theta=-\sqrt{1-\bar\alpha_t}\,\mathbf s_\theta$.

Two consequences. First, DDIM's error is first-order in the step size, so a better integrator should do better at the same NFE. Second, running the same Euler steps **forwards** maps an image to a latent — see inversion below.`,
    },
    {
      kind: 'order',
      prompt: 'Order the operations inside one DDIM step at time τᵢ.',
      steps: [
        String.raw`Evaluate $\boldsymbol\varepsilon_\theta(\mathbf x_{\tau_i},\tau_i)$`,
        String.raw`Form the clean-image estimate $\hat{\mathbf x}_0=(\mathbf x_{\tau_i}-\sqrt{1-\bar\alpha_{\tau_i}}\,\boldsymbol\varepsilon_\theta)/\sqrt{\bar\alpha_{\tau_i}}$`,
        String.raw`Rescale it to the next noise level: $\sqrt{\bar\alpha_{\tau_{i-1}}}\,\hat{\mathbf x}_0$`,
        String.raw`Add the direction term $\sqrt{1-\bar\alpha_{\tau_{i-1}}-\sigma^2}\,\boldsymbol\varepsilon_\theta$ (and $\sigma\mathbf z$ if $\eta>0$)`,
      ],
      why: String.raw`Every step is "denoise completely, then re-noise to the next level". Only one network call is made per step, which is why NFE equals the number of steps for DDIM — unlike Heun-type solvers, which use two.`,
    },
    {
      kind: 'explain',
      title: 'Solvers that beat Euler',
      body: String.raw`Once sampling is "solve an ODE", numerical analysis takes over.
- **Heun / EDM (Karras et al. 2022).** A second-order corrector step: evaluate the denoiser at the Euler-predicted point and average the two slopes. Two NFE per step, but the error drops from $O(h)$ to $O(h^2)$ — FID below 2 on CIFAR-10 at 35 NFE. They also choose the $\sigma$ grid by a power law ($\rho=7$, concentrating steps at low noise) and offer optional **stochastic churn**: re-inject a little noise to correct accumulated error.
- **DPM-Solver (Lu et al. 2022).** The VP ODE is *semi-linear*: the $\mathbf x$-dependent part is linear and can be integrated **exactly** with an exponential integrator, leaving only the $\boldsymbol\varepsilon_\theta$ term to approximate (in the log-SNR variable). High-quality samples in around 10–20 NFE.
- **Distillation.** When ~10 NFE is still too many, train a *student* to take bigger jumps: progressive distillation (Salimans & Ho 2022) repeatedly halves the step count; [consistency models](@ml/consistency-models) go to one step. This does change the weights.`,
    },
    {
      kind: 'match',
      prompt: 'Match each sampling idea to what it actually changes.',
      pairs: [
        ['DDIM (η = 0)', 'Removes injected noise; makes sampling a deterministic ODE solve'],
        ['Strided timestep subsequence τ', 'Takes fewer, larger steps with the same trained network'],
        ["Heun's method (EDM)", 'Second-order accuracy at the cost of two network calls per step'],
        ['Progressive distillation', 'Retrains the weights so one student step replaces two teacher steps'],
      ],
      why: 'The first three are purely sampler-side and need no retraining; distillation is the only one that touches the weights, which is also why it can go below the accuracy limits of a solver.',
    },
    {
      kind: 'fill',
      prompt: String.raw`Setting $\eta=$ ___ recovers the DDPM ancestral sampler, while $\eta=$ ___ makes the sampler deterministic. Halving the number of Euler steps roughly ___ the discretization error of DDIM.`,
      bank: ['0', '1', '2', 'doubles', 'halves', 'squares'],
      answer: ['1', '0', 'doubles'],
      why: String.raw`$\eta=1$ gives $\sigma_t^2=\tilde\beta_t$, exactly the DDPM posterior variance; $\eta=0$ injects nothing. DDIM is a first-order (Euler) method, so the local error is $O(h^2)$ and the accumulated error $O(h)$: twice the step size, roughly twice the error — the motivation for second-order solvers.`,
    },
    {
      kind: 'explain',
      title: 'Inversion: finding the latent of a real image',
      body: String.raw`Because the $\eta=0$ update is an ODE discretization, you can run it **backwards in time**: starting from a real image $\mathbf x_0$, repeatedly apply
$$\mathbf x_{t+1}=\sqrt{\bar\alpha_{t+1}}\,\hat{\mathbf x}_0+\sqrt{1-\bar\alpha_{t+1}}\,\boldsymbol\varepsilon_\theta(\mathbf x_t,t)$$
to obtain the noise $\mathbf x_T$ that the sampler would turn back into that image. **DDIM inversion** underlies most training-free editing: invert, change the prompt or an attention map, re-sample.

Two caveats. The step uses $\boldsymbol\varepsilon_\theta(\mathbf x_t,t)$ where the exact ODE wants $\boldsymbol\varepsilon_\theta(\mathbf x_{t+1},t+1)$, so inversion error accumulates; and with strong [classifier-free guidance](@ml/diffusion-guidance) the forward and reverse trajectories diverge badly, which is why editing methods add extra correction (e.g. optimizing the null-text embedding).`,
    },
    {
      kind: 'multi',
      prompt: 'Which statements about fast diffusion sampling are correct? (Select all that apply.)',
      choices: [
        'Deterministic samplers make the initial noise behave like a latent code you can interpolate in.',
        'Reducing NFE from 1000 to 50 requires retraining the network on fewer timesteps.',
        'A second-order solver can lower error at fixed NFE, since accuracy per step matters as well as step count.',
        'Stochastic samplers can outperform deterministic ones at large NFE, because injected noise corrects accumulated error.',
      ],
      answers: [0, 2, 3],
      why: String.raw`Determinism is what makes $\mathbf x_T$ a code worth interpolating. Nothing is retrained to shorten the schedule — the subsequence trick needs only $\bar\alpha$ values. Heun doubles the cost per step but more than repays it. And Karras et al. found a little stochasticity helps when the step budget is generous, since each noise injection lets the model re-denoise and discard drift.`,
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- DDPM's loss constrains only the marginals, so a whole family of samplers shares one trained $\boldsymbol\varepsilon_\theta$.
- The family: $\mathbf x_{t-1}=\sqrt{\bar\alpha_{t-1}}\hat{\mathbf x}_0+\sqrt{1-\bar\alpha_{t-1}-\sigma_t^2}\,\boldsymbol\varepsilon_\theta+\sigma_t\mathbf z$, with $\sigma_t=\eta\sqrt{\tilde\beta_t}$.
- $\eta=1$ is DDPM; $\eta=0$ is DDIM — deterministic, few-step friendly, and an Euler discretization of the probability-flow ODE.
- Steps can be strided (50 of 1000) with no retraining; better solvers (Heun/EDM, DPM-Solver) reach 10–35 NFE, distillation goes lower.
- Determinism gives a latent code: DDIM inversion maps an image back to noise for editing.`,
    },
  ],
  references: [
    { authors: 'J. Song, C. Meng & S. Ermon', title: 'Denoising Diffusion Implicit Models', year: 2021, venue: 'ICLR', url: 'https://arxiv.org/abs/2010.02502' },
    { authors: 'A. Nichol & P. Dhariwal', title: 'Improved Denoising Diffusion Probabilistic Models', year: 2021, venue: 'ICML', url: 'https://arxiv.org/abs/2102.09672' },
    { authors: 'T. Karras, M. Aittala, T. Aila & S. Laine', title: 'Elucidating the Design Space of Diffusion-Based Generative Models', year: 2022, venue: 'NeurIPS', url: 'https://arxiv.org/abs/2206.00364' },
    { authors: 'C. Lu, Y. Zhou, F. Bao, J. Chen, C. Li & J. Zhu', title: 'DPM-Solver: A Fast ODE Solver for Diffusion Probabilistic Model Sampling in Around 10 Steps', year: 2022, venue: 'NeurIPS', url: 'https://arxiv.org/abs/2206.00927' },
    { authors: 'T. Salimans & J. Ho', title: 'Progressive Distillation for Fast Sampling of Diffusion Models', year: 2022, venue: 'ICLR', url: 'https://arxiv.org/abs/2202.00512' },
  ],
} satisfies LessonContent;
