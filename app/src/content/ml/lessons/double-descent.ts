import type { LessonContent } from '../../types';

export default {
  cards: [
    {
      kind: 'explain',
      title: 'A puzzle',
      body: String.raw`Classical advice from the [bias–variance trade-off](@ml/generalization-bias-variance): grow the model until validation error bottoms out, and **never** fit the training data perfectly, because that is fitting the noise.

Modern deep learning ignores this. Networks with far more parameters than training examples are trained to (near) **zero training error** and still generalize well. Zhang et al. (2017) showed the same networks can even fit **random labels** perfectly, so they clearly *could* overfit badly. Classical capacity bounds (see [PAC & VC](@ml/pac-learning-vc)) cannot explain this.

This lesson resolves the puzzle: past the point where a model can interpolate, test error can **fall again**.`,
    },
    {
      kind: 'explain',
      title: 'When there are more parameters than data',
      body: String.raw`Fit $\hat y=\mathbf w^\top\boldsymbol\phi(x)$ with $p$ features to $n$ points.
- $p<n$: least squares has a unique solution, and usually nonzero training error.
- $p=n$: generically exactly one solution, which **interpolates** (passes through every point). This is the **interpolation threshold**.
- $p>n$: infinitely many interpolating $\mathbf w$. Which one do we get?

The natural choice is the **minimum-norm** interpolant
$$\hat{\mathbf w}=\arg\min\{\lVert\mathbf w\rVert_2:\Phi\mathbf w=\mathbf y\}=\Phi^\top(\Phi\Phi^\top)^{-1}\mathbf y,$$
which is also the limit of ridge as $\lambda\to0^+$. Remarkably, **[gradient descent](@ml/gradient-descent) started from $\mathbf w=0$ finds exactly this solution** for least squares. Its updates are combinations of the rows of $\Phi$, so it never adds components that the data cannot see.`,
    },
    {
      kind: 'widget',
      title: 'Watch the fit go wild, then calm down',
      body: String.raw`12 noisy points, model = constant + $k$ Gaussian bumps, so $p=k+1$ parameters. Beyond $p=n$ the widget returns (essentially) the minimum-norm fit. Slide $k$ slowly:

- $k\approx4$–$6$: a sensible smooth fit (classical sweet spot).
- $k=11$ ($p=12=n$): the single interpolating solution is wild, with huge weights.
- $k=20$–$40$: still interpolating every point, but **smooth again**. Spread across many bumps, the minimum-norm solution needs no giant weights.

(Here the bump width also shrinks as $k$ grows, so this is a demonstration, not a controlled experiment. The next widget is controlled.)`,
      widget: { type: 'MlLeastSquaresFit', props: { truth: 'sin', model: 'rbf', k: 5, kMax: 40, n: 12, noise: 0.2, showTruth: true } },
    },
    {
      kind: 'explain',
      title: 'Double descent',
      body: String.raw`Belkin, Hsu, Ma & Mandal (2019, PNAS) named the pattern **double descent**. Plot test error against model capacity:
1. the classical **U-shape** below the interpolation threshold;
2. a **peak** at the threshold, where the model can just barely fit the data;
3. a **second descent** in the over-parameterized regime, sometimes ending *below* the classical minimum.

They observed it with random Fourier features, fully connected networks and tree ensembles. Hidden in the same picture: training error is (near) zero throughout the second descent, so **interpolation is not, by itself, overfitting** in the harmful sense.`,
    },
    {
      kind: 'widget',
      title: 'A controlled experiment',
      body: String.raw`Linear regression with $D=100$ Gaussian features, of which the model uses the first $p$ (the others act as unexplained signal). There are $n=30$ training points; test MSE (red) is computed exactly and averaged over training sets. Training MSE (blue) hits 0 at $p=n$.

- Note the **peak at $p=n$** and the second descent, which here ends **lower** than anything with $p<n$.
- Set noise $\sigma=0$: the peak **survives**. The $D-p$ features the model ignores act like noise too, since the model cannot explain their contribution to $y$, and interpolating it is just as harmful.
- Raise ridge $\lambda$ to about $30$: the curve becomes almost flat and the peak disappears. Suitably tuned regularization can remove double descent in this setting (Nakkiran et al., 2021).
- Change $n$: the peak follows $p=n$.`,
      widget: { type: 'MlDoubleDescent', props: { n: 30, D: 100, noise: 0.5 } },
    },
    {
      kind: 'mcq',
      prompt: String.raw`In min-norm least squares with $n$ training points and $p$ features, where is the test error typically **worst**?`,
      choices: [String.raw`$p=1$`, String.raw`$p\approx n/2$`, String.raw`$p\approx n$`, String.raw`$p\gg n$`],
      answer: 2,
      why: String.raw`At $p\approx n$ the model must interpolate using the **only** solution available, and $\Phi$ has singular values close to 0, so noise is amplified enormously. For $p\gg n$ there is room to choose a small-norm interpolant.`,
    },
    {
      kind: 'explain',
      title: 'Why the peak? Noise amplification',
      body: String.raw`Write $\Phi$'s singular values as $s_1\ge\dots\ge s_{\min(n,p)}$. The min-norm solution $\hat{\mathbf w}=\Phi^+\mathbf y$ divides each component of $\mathbf y$ by a singular value, so noise is amplified by up to $1/s_{\min}$. For random features, $s_{\min}\to0$ exactly when $p\approx n$ (a square random matrix is nearly singular). Move away from the threshold on either side and $s_{\min}$ grows again.

For isotropic Gaussian features and a well-specified linear model, the **variance** term has an exact large-$n$ limit, with $\gamma=p/n$ (Hastie, Montanari, Rosset & Tibshirani, 2022):
$$\text{Var}\to\begin{cases}\sigma^2\dfrac{\gamma}{1-\gamma}, & \gamma<1,\\[2mm] \sigma^2\dfrac{1}{\gamma-1}, & \gamma>1.\end{cases}$$
Both blow up at $\gamma=1$. Beyond it, variance **decreases** as $p$ grows, while bias increases slowly.`,
    },
    {
      kind: 'numeric',
      prompt: String.raw`Using the formula above with noise variance $\sigma^2=0.25$: what is the limiting variance at $\gamma=p/n=0.9$?`,
      answer: 2.25,
      tolerance: 0.001,
      why: String.raw`$0.25\times0.9/(1-0.9)=0.25\times9=2.25$. That is nine times the noise variance, just from fitting noise near the threshold. At $\gamma=2$ it would be $0.25/(2-1)=0.25$.`,
    },
    {
      kind: 'truefalse',
      prompt: 'Double descent shows that the bias–variance decomposition of squared error is wrong.',
      answer: false,
      why: String.raw`The decomposition $\sigma^2+\text{bias}^2+\text{variance}$ is an **identity** and still holds. What fails is the folk assumption that variance keeps rising with parameter count. Past the interpolation threshold, the variance of the min-norm solution *falls*.`,
    },
    {
      kind: 'explain',
      title: 'Deep double descent',
      body: String.raw`Nakkiran et al. (2020) found double descent throughout deep learning (ResNets and CNNs on CIFAR, transformers on translation):
- **Model-wise:** test error vs network width peaks where the net can just fit the training set.
- **Epoch-wise:** with a fixed large model, test error can fall, rise, then fall again as training continues.
- **Sample-wise:** near the threshold, **more data can hurt**, because it moves the threshold to bigger models.

They unify these with an **effective model complexity**: the largest number of samples on which the training procedure reaches about zero training error. The peaks are most pronounced with **label noise**, and are often hidden by standard regularization, data augmentation and early stopping.`,
    },
    {
      kind: 'multi',
      prompt: 'Which statements are supported by the double-descent literature?',
      choices: [
        'Test error can peak where the model is just able to interpolate the training set',
        'Adding training data can sometimes increase test error for a fixed model size',
        'Label noise tends to make the peak more pronounced',
        'Over-parameterized interpolating models always generalize better than small ones',
        'Training longer can make test error rise and then fall again',
      ],
      answers: [0, 1, 2, 4],
      why: String.raw`Model-wise, sample-wise and epoch-wise double descent, and the role of label noise, are all reported by Nakkiran et al. (2020). "Always" is too strong: whether the second descent beats the classical minimum depends on the data, features and noise.`,
    },
    {
      kind: 'explain',
      title: 'Implicit regularization',
      body: String.raw`With many interpolating solutions, **the training algorithm chooses**. That choice acts as a hidden regularizer:
- gradient descent from 0 on least squares → the **minimum-$\ell_2$-norm** interpolant;
- gradient descent on logistic loss with separable data → the direction of the **max-margin** classifier (Soudry et al., 2018), even with no penalty;
- for deep nets, SGD noise, step size, initialization scale and architecture all shape which interpolant is found. This is an active research area.

**Benign overfitting** (Bartlett, Long, Lugosi & Tsigler, 2020) characterizes when interpolating noisy data costs almost nothing in linear regression. It needs many low-variance directions in the features that can absorb the noise harmlessly.`,
    },
    {
      kind: 'match',
      prompt: 'Match each concept to its description.',
      pairs: [
        ['Interpolation threshold', String.raw`Smallest capacity at which training error reaches 0 (here $p=n$)`],
        ['Minimum-norm interpolant', 'The interpolating solution that gradient descent from zero finds for least squares'],
        ['Epoch-wise double descent', 'Test error falls, rises, then falls again over training time'],
        ['Benign overfitting', 'Fitting noisy labels exactly while still predicting well'],
      ],
      why: String.raw`These four ideas tie together: past the **threshold**, the algorithm's **implicit bias** (e.g. min-norm) selects among interpolants, which can make overfitting **benign**. Training time is another capacity axis, which gives **epoch-wise** curves.`,
    },
    {
      kind: 'fill',
      prompt: String.raw`For $p>n$, the minimum-norm interpolant is $\hat{\mathbf w}=$ ___ , and it equals the limit of ___ regression as $\lambda\to0^+$.`,
      bank: [String.raw`$\Phi^\top(\Phi\Phi^\top)^{-1}\mathbf y$`, String.raw`$(\Phi^\top\Phi)^{-1}\Phi^\top\mathbf y$`, 'ridge', 'lasso', 'logistic'],
      answer: [String.raw`$\Phi^\top(\Phi\Phi^\top)^{-1}\mathbf y$`, 'ridge'],
      why: String.raw`For $p>n$ the $p\times p$ matrix $\Phi^\top\Phi$ is singular, so the usual normal-equations formula does not exist. The $n\times n$ matrix $\Phi\Phi^\top$ is (generically) invertible. Ridge's $\Phi^\top(\Phi\Phi^\top+\lambda I)^{-1}\mathbf y$ tends to it as $\lambda\to0^+$.`,
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- Test error vs capacity can show a classical U, a **peak at the interpolation threshold**, then a **second descent** (Belkin et al., 2019).
- The peak comes from noise amplification by near-zero singular values; it grows with label noise (and with unexplained signal) and is tamed by tuned ridge.
- Beyond the threshold, the optimizer's **implicit bias** (min-norm, max-margin) picks a well-behaved interpolant.
- Deep nets show model-, epoch- and sample-wise double descent (Nakkiran et al., 2020).
- The bias–variance identity still holds; "more parameters ⇒ more variance" does not.`,
    },
  ],
  references: [
    { authors: 'M. Belkin, D. Hsu, S. Ma & S. Mandal', title: 'Reconciling modern machine-learning practice and the classical bias–variance trade-off', year: 2019, venue: 'PNAS 116(32), 15849–15854' },
    { authors: 'P. Nakkiran, G. Kaplun, Y. Bansal, T. Yang, B. Barak & I. Sutskever', title: 'Deep Double Descent: Where Bigger Models and More Data Hurt', year: 2020, venue: 'ICLR (also J. Stat. Mech. 2021)' },
    { authors: 'T. Hastie, A. Montanari, S. Rosset & R. J. Tibshirani', title: 'Surprises in High-Dimensional Ridgeless Least Squares Interpolation', year: 2022, venue: 'Annals of Statistics 50(2), 949–986' },
    { authors: 'P. Nakkiran, P. Venkat, S. Kakade & T. Ma', title: 'Optimal Regularization Can Mitigate Double Descent', year: 2021, venue: 'ICLR' },
    { authors: 'C. Zhang, S. Bengio, M. Hardt, B. Recht & O. Vinyals', title: 'Understanding Deep Learning Requires Rethinking Generalization', year: 2017, venue: 'ICLR' },
  ],
} satisfies LessonContent;
