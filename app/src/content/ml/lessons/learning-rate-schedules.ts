import type { LessonContent } from '../../types';

export default {
  cards: [
    {
      kind: 'explain',
      title: 'The most important knob',
      body: String.raw`Bengio (2012) called the learning rate "often the single most important hyper-parameter". Practice adds a twist: the best $\eta$ **changes during training**.

- **Early:** the iterate is far from any minimum, so big steps make fast progress. Too big a step at the very start, though, can blow up.
- **Late:** we are near a good region, and [SGD's noise floor](@ml/sgd-minibatch) is proportional to $\eta$. Smaller steps let the iterate settle into the bottom of the valley.

A **learning-rate schedule** is a function $\eta_t$ of the step (or epoch) $t$. Typically it is a *peak* value $\eta_{\max}$ times a shape that rises briefly, then decays.`,
    },
    {
      kind: 'widget',
      title: 'A zoo of schedules',
      body: String.raw`Three common shapes over a 90-epoch run (normalized so the peak is 1):
- **Step decay:** ÷10 at fixed epochs (here 30, 60, 80, as in Goyal et al.'s ImageNet ResNet-50 recipe).
- **Cosine decay:** $\eta_t=\eta_{\min}+\tfrac12(\eta_{\max}-\eta_{\min})\big(1+\cos(\pi t/T)\big)$, smooth, with only $T$ (and the floor $\eta_{\min}$, often 0) to choose.
- **Linear warmup + cosine:** ramp from 0 over $W$ epochs, then cosine. Move the $W$ slider.`,
      widget: {
        type: 'FunctionPlot',
        props: {
          fns: ['0.1^((x>=30)+(x>=60)+(x>=80))', '0.5*(1+cos(PI*x/90))', 'min(x/W, 0.5*(1+cos(PI*max(x-W,0)/(90-W))))'],
          x: [0, 90], y: [0, 1.1],
          params: [{ name: 'W', min: 1, max: 30, value: 5, label: 'warmup W' }],
          labels: ['step', 'cosine', 'warmup + cosine'], xLabel: 'epoch', yLabel: 'η / η_max',
        },
      },
    },
    {
      kind: 'numeric',
      prompt: String.raw`Cosine schedule with $\eta_{\max}=0.1$, $\eta_{\min}=0$ over $T=100$ steps. What is $\eta_t$ at $t=75$? (4 decimal places)`,
      answer: 0.0146,
      tolerance: 0.0003,
      why: String.raw`$\eta_{75}=\tfrac12\cdot0.1\,(1+\cos(3\pi/4))=0.05\,(1-0.7071)=0.0146$. Compared with linear decay (which would give $0.025$ here), cosine stays above it in the first half, matches it at the midpoint ($0.05$), and sits below it in the second half, flattening out at the end.`,
    },
    {
      kind: 'explain',
      title: 'Why warm up?',
      body: String.raw`**Warmup** increases $\eta$ linearly from (near) 0 to $\eta_{\max}$ over the first few hundred to few thousand steps.

- **Large-batch SGD:** Goyal et al. (2017) trained ResNet-50 on ImageNet with batch size 8192 in one hour. They used the **linear scaling rule** (multiply $\eta$ by $k$ when the batch grows by $k$) plus a 5-epoch gradual warmup, because the scaled $\eta$ was unstable in the first epochs while the network changes rapidly.
- **Transformers with Adam:** the original Transformer used $\eta_t=d_{\text{model}}^{-1/2}\min(t^{-1/2},\,t\cdot t_w^{-3/2})$, i.e. linear warmup for $t_w=4000$ steps, then inverse-square-root decay (Vaswani et al. 2017). One explanation: at the start, Adam's second-moment estimate is based on few samples, so its adaptive step has high variance (Liu et al. 2020).

Roughly: warmup lets the optimizer reach a region where a large $\eta$ is safe before using it.`,
    },
    {
      kind: 'numeric',
      prompt: String.raw`Goyal et al.'s reference recipe uses $\eta=0.1$ for batch size 256. By the linear scaling rule, what $\eta$ should be used for batch size 8192?`,
      answer: 3.2,
      tolerance: 0.01,
      why: String.raw`$8192/256=32$, so $\eta=32\times0.1=3.2$, exactly what they used (with warmup). The rule works up to some batch size, beyond which gains flatten (see the [SGD lesson](@ml/sgd-minibatch)).`,
    },
    {
      kind: 'numeric',
      prompt: String.raw`Transformer schedule $\eta_t=d^{-1/2}\min(t^{-1/2},\,t\,t_w^{-3/2})$ with $d=512$, $t_w=4000$. What is the peak learning rate, reached at $t=4000$? Give it in units of $10^{-4}$.`,
      answer: 6.99,
      tolerance: 0.05,
      unit: '× 10⁻⁴',
      why: String.raw`At $t=t_w$ both branches equal $t_w^{-1/2}$: $\eta=512^{-1/2}\cdot4000^{-1/2}=0.04419\times0.01581\approx6.99\times10^{-4}$. After that it decays like $1/\sqrt t$, so it halves by step 16 000.`,
    },
    {
      kind: 'widget',
      title: 'Warm restarts (SGDR)',
      body: String.raw`Loshchilov & Hutter (2017) proposed **SGDR**: run cosine decay over a period $T_i$, then **restart** at $\eta_{\max}$ and decay again:
$$\eta_t=\eta_{\min}+\tfrac12(\eta_{\max}-\eta_{\min})\Big(1+\cos\frac{\pi T_{\text{cur}}}{T_i}\Big),$$
where $T_{\text{cur}}$ counts epochs since the last restart. They often grew the period after each restart ($T_{i+1}=T_{\text{mult}}T_i$, e.g. $T_{\text{mult}}=2$). Each low-$\eta$ phase ends with a good model you can snapshot, which gives an "anytime" schedule. Their single-period variant is the plain cosine decay now used almost everywhere.`,
      widget: {
        type: 'FunctionPlot',
        props: {
          fns: ['0.5*(1+cos(PI*(x%P)/P))'],
          x: [0, 100], y: [0, 1.1],
          params: [{ name: 'P', min: 5, max: 50, value: 20, label: 'period' }],
          labels: ['SGDR (fixed period)'], xLabel: 'epoch', yLabel: 'η / η_max',
        },
      },
    },
    {
      kind: 'mcq',
      prompt: 'Why does decaying the learning rate near the end of training usually lower the final loss for SGD?',
      choices: [
        'Because the gradient becomes larger near a minimum',
        "Because SGD's stationary error around a minimum is roughly proportional to η, so a smaller η shrinks the noise ball",
        'Because a smaller η increases the batch size',
        'Because decaying η makes the loss convex',
      ],
      answer: 1,
      why: String.raw`With constant $\eta$, SGD reaches a noise floor $\approx\eta\sigma^2/(2\lambda)$ on a quadratic. Lowering $\eta$ lowers that floor. It is the practical version of the Robbins–Monro idea of shrinking steps. Gradients actually get *smaller* near a minimum, and convexity is a property of the loss, not of the schedule.`,
    },
    {
      kind: 'truefalse',
      prompt: String.raw`In AdamW, the decoupled weight decay term is also multiplied by the schedule, so decaying the learning rate also weakens the weight decay.`,
      answer: true,
      why: String.raw`In Loshchilov & Hutter's AdamW (and common implementations), the step is $\eta_t(\cdots+\lambda\boldsymbol\theta)$: both the adaptive step and the decay are scaled by the schedule multiplier $\eta_t$. Changing the schedule therefore changes the effective regularization too.`,
    },
    {
      kind: 'order',
      prompt: 'Order the phases of a typical modern warmup-then-decay schedule.',
      steps: [
        'Start with η near 0',
        'Increase η linearly over the warmup steps',
        'Reach the peak η_max',
        'Decay (e.g. cosine) toward η_min',
        'Finish training at a small learning rate',
      ],
      why: 'Warmup comes first, to avoid early instability, then the peak, then the decay that reduces the SGD noise floor. Some recent large-model runs insert a long constant "stable" phase between the peak and a short final decay (warmup–stable–decay).',
    },
    {
      kind: 'match',
      prompt: 'Match each schedule to its description.',
      pairs: [
        ['Step decay', 'Multiply η by a fixed factor (e.g. 0.1) at chosen epochs'],
        ['Cosine', 'Half a cosine period from η_max down to η_min'],
        ['SGDR', 'Repeated cosine cycles with jumps back to η_max'],
        ['Inverse square root', 'η ∝ 1/√t after warmup (original Transformer)'],
      ],
      why: 'Step decay is piecewise constant; cosine is one smooth half-period; SGDR restarts that cosine; the Transformer used linear warmup followed by $t^{-1/2}$ decay.',
    },
    {
      kind: 'multi',
      prompt: 'Which statements about learning-rate schedules are correct? Select all.',
      choices: [
        'Warmup is commonly used when training transformers with Adam',
        'Under the linear scaling rule, doubling the batch size doubles the learning rate',
        'A schedule can only decrease the learning rate, never increase it',
        'The peak learning rate is usually tuned together with the schedule length',
      ],
      answers: [0, 1, 3],
      why: 'Warmup and SGDR restarts both *increase* η at times, so the third statement is false. The linear scaling rule scales η proportionally to the batch size. Peak η and total length interact: a longer run usually tolerates or needs different peaks.',
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- The best $\eta$ changes over training: large early for progress, small late to shrink SGD's noise floor.
- Common shapes: step decay, cosine, warmup + cosine, inverse-sqrt (Transformer), SGDR warm restarts.
- Warmup stabilizes the first steps of large-batch SGD (with the linear scaling rule) and of Adam on transformers.
- Cosine: $\eta_t=\eta_{\min}+\frac12(\eta_{\max}-\eta_{\min})(1+\cos(\pi t/T))$.
- Schedules interact with batch size, weight decay (AdamW multiplies it by $\eta_t$) and run length. Tune them together.`,
    },
  ],
  references: [
    { authors: 'I. Loshchilov & F. Hutter', title: 'SGDR: Stochastic Gradient Descent with Warm Restarts', year: 2017, venue: 'ICLR', url: 'https://arxiv.org/abs/1608.03983' },
    { authors: 'P. Goyal, P. Dollár, R. Girshick, P. Noordhuis, L. Wesolowski, A. Kyrola, A. Tulloch, Y. Jia & K. He', title: 'Accurate, Large Minibatch SGD: Training ImageNet in 1 Hour', year: 2017, venue: 'arXiv:1706.02677', url: 'https://arxiv.org/abs/1706.02677' },
    { authors: 'A. Vaswani, N. Shazeer, N. Parmar, J. Uszkoreit, L. Jones, A. N. Gomez, Ł. Kaiser & I. Polosukhin', title: 'Attention Is All You Need', year: 2017, venue: 'NeurIPS', detail: '§5.3 (optimizer and learning-rate schedule)' },
    { authors: 'Y. Bengio', title: 'Practical Recommendations for Gradient-Based Training of Deep Architectures', year: 2012, venue: 'Neural Networks: Tricks of the Trade, 2nd ed., Springer LNCS 7700', url: 'https://arxiv.org/abs/1206.5533' },
    { authors: 'L. Liu, H. Jiang, P. He, W. Chen, X. Liu, J. Gao & J. Han', title: 'On the Variance of the Adaptive Learning Rate and Beyond', year: 2020, venue: 'ICLR', url: 'https://arxiv.org/abs/1908.03265' },
  ],
} satisfies LessonContent;
