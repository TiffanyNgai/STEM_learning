import type { LessonContent } from '../../types';

export default {
  cards: [
    {
      kind: 'explain',
      title: 'Estimating a whole distribution',
      body: String.raw`You record the arrival times of 200 buses. Rather than one number (the mean), you want the **shape** of the distribution: is there one peak or two? How long is the tail?

**Density estimation** means building an estimate $\hat f$ of the unknown probability density $f$ from samples $x_1,\dots,x_n$. Uses include spotting multiple modes, flagging anomalies (points where $\hat f$ is tiny), and building generative models.

**Parametric** methods assume a form (a Gaussian, a [mixture](@ml/gmm-em)) and fit its parameters. **Nonparametric** methods, the topic here, let the data shape the estimate, with one smoothing knob.`,
    },
    {
      kind: 'explain',
      title: 'Histograms: the first density estimate',
      body: String.raw`Chop the line into bins of width $w$. In bin $B$,
$$\hat f(x)=\frac{\#\{x_i\in B\}}{n\,w}\qquad (x\in B).$$
Dividing by $n w$ makes the bars' total area equal 1, so $\hat f$ is a proper density.

Example: 12 of 60 points fall in a bin of width 0.5, so the height there is $12/(60\times0.5)=0.4$.

Drawbacks: the estimate is a jagged step function, it depends on where the bin edges start, and in many dimensions the number of bins explodes.`,
    },
    {
      kind: 'numeric',
      prompt: String.raw`A histogram of $n=200$ points uses bins of width $0.25$. A bin contains 30 points. What is the density estimate in that bin?`,
      answer: 0.6,
      tolerance: 0.001,
      why: String.raw`$\hat f=\dfrac{30}{200\times0.25}=\dfrac{30}{50}=0.6$. Reporting the raw fraction $30/200=0.15$ forgets to divide by the bin width, so the bars would not integrate to 1.`,
    },
    {
      kind: 'explain',
      title: 'Kernel density estimation: a bump on every point',
      body: String.raw`Instead of fixed bins, put a small smooth **bump** centred on every data point and add them up:
$$\hat f_h(x)=\frac1{n h}\sum_{i=1}^n K\!\Big(\frac{x-x_i}{h}\Big).$$
The **kernel** $K$ is itself a density, symmetric about 0, usually the standard Gaussian $K(u)=\frac1{\sqrt{2\pi}}e^{-u^2/2}$. The **bandwidth** $h>0$ sets the width of each bump. Each bump has area $1/n$, so $\hat f_h$ integrates to 1.

This is the **kernel density estimate** (KDE), also called the Parzen–Rosenblatt window method after Rosenblatt (1956) and Parzen (1962).`,
    },
    {
      kind: 'numeric',
      prompt: String.raw`Two data points, $0$ and $1$. Gaussian kernel, $h=1$. What is $\hat f_h(0)$? (3 decimals; $\phi(0)\approx0.3989$, $\phi(1)\approx0.2420$)`,
      answer: 0.3205,
      tolerance: 0.002,
      why: String.raw`$\hat f(0)=\frac1{2\cdot1}\big[\phi(0)+\phi(1)\big]=\frac12(0.3989+0.2420)\approx0.320$. Forgetting the $1/n$ factor gives $0.641$, which would make $\hat f$ integrate to 2.`,
    },
    {
      kind: 'widget',
      title: 'Turn the bandwidth knob',
      body: String.raw`Thirty points (rug ticks) from a two-peaked density (dashed). Thin blue curves are the individual bumps; orange is their sum, $\hat f_h$.

- Drag $h$ down to about 0.05: a spike on every point. The estimate depends wildly on this sample (**high variance**); press **New sample** to see it change.
- Drag $h$ up past 1.5: the two peaks merge into one blob (**high bias**).
- Press **Silverman h** for a rule-of-thumb choice and compare its ISE (integrated squared error) with the best you can find by hand. On this two-peaked density the rule oversmooths somewhat.`,
      widget: { type: 'MlKDE', props: { n: 30, h: 0.4, kernel: 'gaussian', seed: 3 } },
    },
    {
      kind: 'explain',
      title: 'Bandwidth is a bias–variance trade-off',
      body: String.raw`For a smooth $f$ and small $h$, standard asymptotics give
- **bias** $\approx\frac{h^2}{2}\sigma_K^2 f''(x)$: large $h$ flattens peaks and fills valleys;
- **variance** $\approx\dfrac{f(x)\int K^2}{n h}$: small $h$ means each bump relies on few points.

Here $\sigma_K^2$ is the kernel's variance. Balancing squared bias ($\propto h^4$) against variance ($\propto 1/(nh)$) gives the optimal $h\propto n^{-1/5}$, and the mean integrated squared error then shrinks like $n^{-4/5}$. That is slower than the $n^{-1}$ rate of a correctly specified parametric model: flexibility costs data.

The choice of kernel shape matters much less than the choice of $h$.`,
    },
    {
      kind: 'explain',
      title: "Silverman's rule of thumb",
      body: String.raw`If $f$ were Gaussian with standard deviation $\sigma$, the optimal Gaussian-kernel bandwidth would be $h=1.06\,\sigma\,n^{-1/5}$. Silverman (1986) recommends a version that is more robust to skew and multiple peaks:
$$h=0.9\,\min\!\Big(\hat\sigma,\ \frac{\text{IQR}}{1.34}\Big)\,n^{-1/5},$$
where $\hat\sigma$ is the sample standard deviation and IQR the interquartile range. (For a normal distribution, IQR $\approx1.34\,\sigma$.)

It is a quick default. For strongly multimodal data it can still oversmooth; data-driven alternatives include cross-validation on held-out likelihood.`,
    },
    {
      kind: 'numeric',
      prompt: String.raw`A sample of $n=32$ points has $\hat\sigma=2$ and IQR $=4$. What bandwidth does Silverman's rule give? (Hint: $32^{-1/5}=1/2$.)`,
      answer: 0.9,
      tolerance: 0.005,
      why: String.raw`$\text{IQR}/1.34\approx2.99$, so the minimum is $\hat\sigma=2$. Then $h=0.9\times2\times0.5=0.9$. Using the IQR term instead would give about $1.34$.`,
    },
    {
      kind: 'mcq',
      prompt: 'Your KDE of a dataset shows one smooth peak, but you suspect two close clusters. What is the most likely culprit?',
      choices: [
        'The bandwidth is too large, so the two peaks are smoothed together.',
        'The bandwidth is too small, so the peaks cancel.',
        'A Gaussian kernel cannot represent two peaks.',
        'KDE can only produce unimodal estimates.',
      ],
      answer: 0,
      why: String.raw`Large $h$ means wide bumps that fill in the valley between modes (bias). A small $h$ never merges peaks; it produces too many spurious ones. A sum of Gaussian bumps can have any number of peaks, so neither the kernel nor the method is the limitation.`,
    },
    {
      kind: 'explain',
      title: 'The curse of dimensionality',
      body: String.raw`In $d$ dimensions the KDE uses bumps in $\mathbb R^d$ and the best error rate becomes $n^{-4/(4+d)}$. For $d=1$ that is $n^{-0.8}$; for $d=10$ only $n^{-0.29}$. Halving the error in 10D needs about $2^{3.5}\approx11$ times more data.

The reason: **neighbourhoods stop being local**. To capture a fraction $p$ of data spread uniformly in the unit cube $[0,1]^d$, a sub-cube needs edge length $p^{1/d}$. For $p=10\%$ and $d=10$ that is $0.1^{0.1}\approx0.79$: the "local" box spans 79% of every axis.

So KDE is excellent in 1–3 dimensions and rarely used directly beyond about 5–6. High-dimensional density modelling uses structured models instead (mixtures, flows, diffusion models).`,
      widget: {
        type: 'FunctionPlot',
        props: {
          fns: ['p^(1/x)'],
          x: [1, 20], y: [0, 1],
          params: [{ name: 'p', min: 0.001, max: 0.5, value: 0.1, label: 'fraction p' }],
          labels: ['edge length needed'],
          xLabel: 'dimension d', yLabel: 'edge',
        },
        caption: 'Edge length of a sub-cube holding a fraction p of uniform data in [0,1]^d.',
      },
    },
    {
      kind: 'numeric',
      prompt: String.raw`Data are uniform in $[0,1]^{10}$. What edge length must a sub-cube have to contain 1% of the data? (3 decimals)`,
      answer: 0.631,
      tolerance: 0.002,
      why: String.raw`Volume fraction $=$ edge$^{10}=0.01$, so edge $=0.01^{1/10}=10^{-0.2}\approx0.631$. Even a 1% neighbourhood spans 63% of each axis. The naive answer $0.01$ treats the problem as one-dimensional.`,
    },
    {
      kind: 'widget',
      title: 'More data, smaller bandwidth',
      body: String.raw`Now raise $n$ toward 400 (bumps are hidden when $n>60$). Press **Silverman h** at a few sample sizes: the recommended $h$ shrinks slowly, like $n^{-1/5}$, and the ISE falls. Toggle **histogram** to compare a binned estimate (bin width $2h$), and try the **box** kernel to see how kernel shape changes smoothness but not the overall picture.`,
      widget: { type: 'MlKDE', props: { n: 200, h: 0.3, showKernels: true, showHist: true, seed: 8 } },
    },
    {
      kind: 'match',
      prompt: 'Match each symptom to its cause.',
      pairs: [
        ['Spiky estimate that changes a lot between samples', 'Bandwidth too small'],
        ['Real peaks merged into one blob', 'Bandwidth too large'],
        ['Estimate looks different when bin edges shift', 'Histogram bin placement'],
        ['Huge sample needed for decent accuracy in 10D', 'Curse of dimensionality'],
      ],
      why: 'Small h gives high variance and large h gives high bias. Histograms carry an extra arbitrary choice of bin origin that KDE removes. In high dimensions every neighbourhood is nearly empty, so nonparametric rates slow to n^(−4/(4+d)).',
    },
    {
      kind: 'truefalse',
      prompt: 'Changing from a Gaussian kernel to an Epanechnikov kernel, at a well-chosen bandwidth, usually changes the quality of a KDE much less than changing the bandwidth by a factor of 3.',
      answer: true,
      why: String.raw`Common kernels have nearly the same asymptotic efficiency (the Gaussian is about 95% as efficient as the optimal Epanechnikov kernel). The bandwidth controls the bias–variance balance and dominates the error.`,
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- A histogram estimates density as count$/(n\cdot\text{width})$; it is jagged and depends on bin placement.
- KDE: $\hat f_h(x)=\frac1{nh}\sum_iK\big((x-x_i)/h\big)$, one smooth bump of area $1/n$ per point.
- The **bandwidth** $h$ is the key choice: small $h$ → high variance, large $h$ → high bias. Optimal $h\propto n^{-1/5}$ in 1D.
- Silverman's rule $h=0.9\min(\hat\sigma,\text{IQR}/1.34)\,n^{-1/5}$ is a quick default.
- Kernel shape matters little. In high dimensions KDE suffers the **curse of dimensionality** (rate $n^{-4/(4+d)}$).`,
    },
  ],
  references: [
    { authors: 'B. W. Silverman', title: 'Density Estimation for Statistics and Data Analysis', year: 1986, venue: 'Chapman & Hall (Monographs on Statistics and Applied Probability 26)', detail: 'Ch. 2–3' },
    { authors: 'M. Rosenblatt', title: 'Remarks on Some Nonparametric Estimates of a Density Function', year: 1956, venue: 'The Annals of Mathematical Statistics 27(3), 832–837' },
    { authors: 'E. Parzen', title: 'On Estimation of a Probability Density Function and Mode', year: 1962, venue: 'The Annals of Mathematical Statistics 33(3), 1065–1076' },
    { authors: 'L. Wasserman', title: 'All of Nonparametric Statistics', year: 2006, venue: 'Springer', detail: 'Ch. 6' },
    { authors: 'T. Hastie, R. Tibshirani & J. Friedman', title: 'The Elements of Statistical Learning', year: 2009, venue: '2nd ed., Springer', detail: 'Sec. 2.5, 6.6', url: 'https://hastie.su.domains/ElemStatLearn/' },
  ],
} satisfies LessonContent;
