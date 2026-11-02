import type { LessonContent } from '../../types';

// Lifting 1D data with phi(x) = (x, x^2): points rise onto a parabola and become separable by the line x^2 = 1.
const XS = [-2, -1.6, -1.25, -0.7, -0.3, 0.2, 0.6, 0.9, 1.3, 1.8];
const px = (x: number) => 160 + 62 * x;
const py = (x: number) => 172 - 30 * x * x;
const PARABOLA = Array.from({ length: 45 }, (_, i) => { const x = -2.2 + (4.4 * i) / 44; return `${i ? 'L' : 'M'}${px(x).toFixed(1)},${py(x).toFixed(1)}`; }).join('');
const anim = (attr: string, from: number, to: number) =>
  `<animate attributeName="${attr}" values="${from};${from};${to};${to};${from}" keyTimes="0;0.15;0.5;0.92;1" dur="8s" repeatCount="indefinite"/>`;
const LIFT_SVG = `<svg viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg">
<line x1="12" y1="172" x2="308" y2="172" stroke="var(--fg)" stroke-width="1"/>
<text x="306" y="186" font-size="10" text-anchor="end" fill="var(--fg)">x</text>
<text x="${px(-1)}" y="186" font-size="9" text-anchor="middle" fill="var(--muted)">−1</text>
<text x="${px(1)}" y="186" font-size="9" text-anchor="middle" fill="var(--muted)">1</text>
<text x="${px(0)}" y="186" font-size="9" text-anchor="middle" fill="var(--muted)">0</text>
<path d="${PARABOLA}" fill="none" stroke="var(--muted)" stroke-width="1" stroke-dasharray="3 3" opacity="0">${'<animate attributeName="opacity" values="0;0;0.8;0.8;0" keyTimes="0;0.15;0.5;0.92;1" dur="8s" repeatCount="indefinite"/>'}</path>
<line x1="12" y1="${py(1)}" x2="308" y2="${py(1)}" stroke="var(--c1)" stroke-width="2" opacity="0"><animate attributeName="opacity" values="0;0;0;1;1;0" keyTimes="0;0.15;0.5;0.6;0.92;1" dur="8s" repeatCount="indefinite"/></line>
<text x="14" y="${py(1) - 5}" font-size="10" fill="var(--c1)" opacity="0">x² = 1: a straight line now separates<animate attributeName="opacity" values="0;0;0;1;1;0" keyTimes="0;0.15;0.5;0.6;0.92;1" dur="8s" repeatCount="indefinite"/></text>
${XS.map((x) => `<circle cx="${px(x)}" cy="172" r="4.5" fill="${Math.abs(x) > 1 ? 'var(--c3)' : 'var(--c2)'}" stroke="var(--fg)" stroke-width="0.6">${anim('cy', 172, py(x))}</circle>`).join('')}
<text x="12" y="14" font-size="10" fill="var(--fg)">orange: |x| &gt; 1 · blue: |x| &lt; 1</text>
<text x="12" y="28" font-size="10" fill="var(--muted)">lift each point to φ(x) = (x, x²)</text>
</svg>`;

export default {
  cards: [
    {
      kind: 'explain',
      title: 'Straight lines can’t bend',
      body: String.raw`The data below follow a smooth U-shaped curve (dashed), but our [linear regression](@ml/linear-regression-ml) model $\hat y=w_0+w_1x$ can only draw a straight line. Large residuals remain however we choose $w_0,w_1$. The model is too simple: it **underfits**.

Do we need a whole new learning algorithm to fit curves? No. The fix keeps everything we know about least squares: we change the **inputs**, not the algorithm.`,
      widget: { type: 'MlLeastSquaresFit', props: { truth: 'quad', model: 'poly', k: 1, n: 14, noise: 0.15, showTruth: true, controls: false } },
    },
    {
      kind: 'explain',
      title: 'Feature maps',
      body: String.raw`Choose fixed functions $\phi_0,\dots,\phi_{p-1}$ (**basis functions**) and collect them into a **feature map** $\boldsymbol\phi(x)=(\phi_0(x),\dots,\phi_{p-1}(x))$. The model is
$$\hat y=\mathbf w^\top\boldsymbol\phi(x)=\sum_{j}w_j\,\phi_j(x).$$

It is **nonlinear in the input** $x$ but **linear in the parameters** $\mathbf w$. So least squares works unchanged: replace the design matrix $X$ by $\Phi$ with entries $\Phi_{ij}=\phi_j(x_i)$, and
$$\mathbf w^*=(\Phi^\top\Phi)^{-1}\Phi^\top\mathbf y.$$

**Example.** Polynomial features $\boldsymbol\phi(x)=(1,x,x^2)$ give a parabola $\hat y=w_0+w_1x+w_2x^2$, fitted by solving a $3\times3$ linear system.`,
    },
    {
      kind: 'mcq',
      prompt: String.raw`Which model is **not** linear in its parameters (so cannot be fitted by the closed-form least-squares formula)?`,
      choices: [
        String.raw`$\hat y=w_0+w_1x+w_2x^2$`,
        String.raw`$\hat y=w_1\sin x+w_2\cos x$`,
        String.raw`$\hat y=w_1e^{-(x-1)^2}+w_2e^{-(x+1)^2}$`,
        String.raw`$\hat y=w_1e^{-w_2x}$`,
      ],
      answer: 3,
      why: String.raw`In the first three, each parameter multiplies a fixed function of $x$, however curved that function is. In $w_1e^{-w_2x}$ the parameter $w_2$ sits **inside** the exponential, so $\hat y$ is not linear in $w_2$ and needs iterative optimization.`,
    },
    {
      kind: 'widget',
      title: 'Polynomial features: from under- to overfitting',
      body: String.raw`Slide the degree $k$ (the model has $k+1$ weights). At $k=1$ the fit underfits; around $k=3$–$5$ it follows the wave; at $k\ge 10$ it threads through nearly every noisy point and **wiggles wildly** between and beyond them. That is overfitting.

The training MSE keeps falling as $k$ grows, yet the curve gets *worse* at predicting new points. Training error alone can't choose $k$; see [the bias–variance trade-off](@ml/generalization-bias-variance). Press **show w·φ** to see the individual weighted monomials $w_jx^j$ that add up to the fit; at high degree they are huge and cancel each other.`,
      widget: { type: 'MlLeastSquaresFit', props: { truth: 'sin', model: 'poly', k: 3, kMax: 12, showTruth: true } },
    },
    {
      kind: 'truefalse',
      prompt: String.raw`On a fixed training set, raising the polynomial degree from $k$ to $k+1$ (and refitting by exact least squares) can never increase the training MSE.`,
      answer: true,
      why: String.raw`Every degree-$k$ polynomial is also a degree-$(k+1)$ polynomial with $w_{k+1}=0$, so the bigger model's best training fit is at least as good. The model classes are **nested**. Test error, by contrast, can rise.`,
    },
    {
      kind: 'widget',
      title: 'Local bumps: Gaussian RBFs',
      body: String.raw`Polynomials are **global**: changing one weight moves the curve everywhere, and $x^k$ explodes outside the data. **Radial basis functions** (RBFs) are local bumps centred at points $c_j$:
$$\phi_j(x)=\exp\!\Big(-\frac{(x-c_j)^2}{2s^2}\Big),$$
plus a constant $\phi_0=1$. Each weight sets the height of one bump; the width $s$ controls smoothness. Toggle **show w·φ** to see the bumps that sum to the blue fit, and change the number of centres.

Other common choices: piecewise-polynomial **splines**, **Fourier features** $\sin(\omega x),\cos(\omega x)$ (including random ones, Rahimi & Recht 2007), and sigmoids $\sigma(ax+c)$.`,
      widget: { type: 'MlLeastSquaresFit', props: { truth: 'sin', model: 'rbf', k: 6, kMax: 12, showBases: true } },
    },
    {
      kind: 'numeric',
      prompt: String.raw`A Gaussian RBF has centre $c=1$ and width $s=1$. What is $\phi(x)$ at $x=2$? (3 decimals)`,
      answer: 0.607,
      tolerance: 0.002,
      why: String.raw`$\phi(2)=\exp(-(2-1)^2/(2\cdot1^2))=e^{-1/2}\approx0.607$. Forgetting the factor 2 in the denominator gives $e^{-1}\approx0.368$.`,
    },
    {
      kind: 'widget',
      title: 'Feature maps make classes separable',
      body: String.raw`Basis functions help classification too. Here the label depends on whether $|x|>1$: orange on both outer sides, blue in the middle. **No single threshold on $x$** separates them.

Lift each point to $\boldsymbol\phi(x)=(x,x^2)$. In the new 2D feature space the outer points sit high on the parabola and the inner points low, and the **straight line** $x^2=1$ separates them perfectly. A linear classifier on $\boldsymbol\phi(x)$ is a nonlinear classifier on $x$.`,
      widget: { type: 'SvgDiagram', props: { svg: LIFT_SVG }, caption: 'The same linear machinery, applied in a lifted feature space.' },
    },
    {
      kind: 'mcq',
      prompt: String.raw`Using features $\boldsymbol\phi(x)=(x,x^2)$, which linear rule "predict orange if $\mathbf a^\top\boldsymbol\phi(x)+b>0$" labels exactly the points with $|x|>1$ as orange?`,
      choices: [
        String.raw`$\mathbf a=(1,0),\ b=-1$`,
        String.raw`$\mathbf a=(0,1),\ b=-1$`,
        String.raw`$\mathbf a=(1,1),\ b=0$`,
        String.raw`$\mathbf a=(0,-1),\ b=1$`,
      ],
      answer: 1,
      why: String.raw`$(0,1)\cdot(x,x^2)-1=x^2-1>0\iff|x|>1$. $\mathbf a=(1,0),\ b=-1$ gives $x>1$ (it misses $x<-1$); $\mathbf a=(0,-1),\ b=1$ is the exact opposite rule ($|x|<1$).`,
    },
    {
      kind: 'explain',
      title: 'The catch: feature explosion',
      body: String.raw`With $d$ inputs, a full polynomial of degree $\le k$ has $\binom{d+k}{k}$ monomials (constant included). For $d=10$, $k=3$ that is $286$; for $d=100$, $k=3$ it is $176{,}851$. A grid of $m$ RBF centres per input dimension needs $m^d$ bumps. Hand-designed bases suffer from the **curse of dimensionality**.

Three escapes, each a later lesson:
- the [kernel trick](@ml/kernel-trick) computes inner products $\boldsymbol\phi(\mathbf x)^\top\boldsymbol\phi(\mathbf x')$ without listing the features;
- [regularization](@ml/regularization) keeps many weights small;
- [neural networks](@ml/neural-networks-intro) **learn** the basis functions: the last hidden layer is $\boldsymbol\phi(\mathbf x)$, and the output layer is a linear model on top.`,
    },
    {
      kind: 'numeric',
      prompt: String.raw`How many features (including the constant 1) does a full polynomial of degree $\le2$ in $d=3$ inputs $x_1,x_2,x_3$ have?`,
      answer: 10,
      why: String.raw`$\binom{3+2}{2}=10$: the constant; $x_1,x_2,x_3$; the squares $x_1^2,x_2^2,x_3^2$; and the cross terms $x_1x_2,x_1x_3,x_2x_3$. Forgetting the cross terms gives 7.`,
    },
    {
      kind: 'widget',
      title: 'Taming wiggles with a penalty',
      body: String.raw`Many basis functions do not have to overfit if large weights are discouraged. **Ridge regression** minimizes $\lVert\Phi\mathbf w-\mathbf y\rVert^2+\lambda\lVert\mathbf w\rVert^2$, giving
$$\mathbf w^*=(\Phi^\top\Phi+\lambda I)^{-1}\Phi^\top\mathbf y.$$
(The widget leaves the constant's weight unpenalized.) Start at degree 11 with $\lambda=0$, then raise $\log_{10}\lambda$: the wild oscillations flatten into a smooth curve. Too much $\lambda$ underfits again. More in [regularization](@ml/regularization).`,
      widget: { type: 'MlLeastSquaresFit', props: { truth: 'sin', model: 'poly', k: 11, kMax: 12, showLambda: true, showTruth: true } },
    },
    {
      kind: 'match',
      prompt: 'Match each family of basis functions to its defining property.',
      pairs: [
        [String.raw`Polynomials $x^j$`, 'Global: every weight affects the whole curve, and it blows up at the edges'],
        [String.raw`Gaussian RBFs`, 'Local bumps: each weight mainly affects inputs near its centre'],
        [String.raw`Fourier features $\sin\omega x,\cos\omega x$`, 'Periodic oscillations at chosen frequencies'],
        ['Hidden units of a neural network', 'Adapted to the data during training'],
      ],
      why: String.raw`The shape of each $\phi_j$ decides how the model generalizes: monomials are global and grow without bound, Gaussians decay away from $c_j$, sinusoids repeat, and a neural network's features are themselves trained instead of fixed in advance.`,
    },
    {
      kind: 'fill',
      prompt: String.raw`The model $\hat y=\mathbf w^\top\boldsymbol\phi(x)$ is ___ in the parameters $\mathbf w$, so least squares still has a ___-form solution $\mathbf w^*=(\Phi^\top\Phi)^{-1}\Phi^\top\mathbf y$, where $\Phi$ is the ___ matrix.`,
      bank: ['linear', 'closed', 'design', 'nonlinear', 'iterative', 'Hessian', 'kernel'],
      answer: ['linear', 'closed', 'design'],
      why: String.raw`Nonlinearity in $x$ is hidden inside the fixed features; in $\mathbf w$ the model is linear, so the normal equations apply with $\Phi$ (the design matrix of features) in place of $X$.`,
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- Basis functions: $\hat y=\mathbf w^\top\boldsymbol\phi(x)$, nonlinear in $x$, linear in $\mathbf w$, so least squares and its closed form still apply with $\Phi$.
- Polynomials are global; Gaussian RBFs are local bumps of width $s$.
- More basis functions never raise training error; past a point they overfit. Ridge ($\lambda\lVert\mathbf w\rVert^2$) controls the wiggles.
- Lifting inputs with $\boldsymbol\phi$ can make classes linearly separable.
- Hand-crafted bases explode with input dimension; kernels and neural networks (learned $\boldsymbol\phi$) are the modern answers.`,
    },
  ],
  references: [
    { authors: 'C. M. Bishop', title: 'Pattern Recognition and Machine Learning', year: 2006, venue: 'Springer', detail: 'Ch. 1.1 (polynomial curve fitting), Ch. 3.1 (linear basis function models)' },
    { authors: 'T. Hastie, R. Tibshirani & J. Friedman', title: 'The Elements of Statistical Learning', year: 2009, venue: '2nd ed., Springer', detail: 'Ch. 5 (basis expansions and regularization)', url: 'https://hastie.su.domains/ElemStatLearn/' },
    { authors: 'K. P. Murphy', title: 'Probabilistic Machine Learning: An Introduction', year: 2022, venue: 'MIT Press', detail: 'Ch. 11', url: 'https://probml.github.io/pml-book/book1.html' },
    { authors: 'A. Rahimi & B. Recht', title: 'Random Features for Large-Scale Kernel Machines', year: 2007, venue: 'Advances in Neural Information Processing Systems 20', detail: 'pp. 1177–1184' },
  ],
} satisfies LessonContent;
