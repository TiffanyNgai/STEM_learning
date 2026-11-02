import type { LessonContent } from '../../types';

// L1 vs L2 geometry: elliptical RSS contours centred at the OLS solution W0 grow until they first touch the
// constraint region (|w1|+|w2| <= 1 or w1^2+w2^2 <= 1). The contact point is found numerically.
const W0: [number, number] = [1.3, 2.0];
const TH = -0.5; // ellipse orientation (radians, maths convention)
const AX = 1.0, BX = 0.45; // relative semi-axes
const lvl = ([x, y]: [number, number]) => {
  const dx = x - W0[0], dy = y - W0[1];
  const u = Math.cos(TH) * dx + Math.sin(TH) * dy, v = -Math.sin(TH) * dx + Math.cos(TH) * dy;
  return (u * u) / (AX * AX) + (v * v) / (BX * BX);
};
function contact(l1: boolean): { L: number; p: [number, number] } {
  let best = { L: Infinity, p: [0, 0] as [number, number] };
  for (let i = 0; i < 4000; i++) {
    const t = (2 * Math.PI * i) / 4000; const x = Math.cos(t), y = Math.sin(t);
    const k = l1 ? Math.abs(x) + Math.abs(y) : 1; const p: [number, number] = [x / k, y / k];
    const L = lvl(p); if (L < best.L) best = { L, p };
  }
  return best;
}
const U = 38; // pixels per unit
function panel(cx: number, l1: boolean, title: string) {
  const { L, p } = contact(l1);
  const X = (w: number) => cx + U * w, Y = (w: number) => 112 - U * w;
  const rot = (-TH * 180) / Math.PI;
  const ell = (f: number, i: number) => `<ellipse cx="${X(W0[0])}" cy="${Y(W0[1])}" rx="${(U * AX * Math.sqrt(L * f)).toFixed(1)}" ry="${(U * BX * Math.sqrt(L * f)).toFixed(1)}" transform="rotate(${rot.toFixed(1)} ${X(W0[0])} ${Y(W0[1])})" fill="none" stroke="var(--c5)" stroke-width="${f === 1 ? 1.6 : 0.9}" opacity="0"><animate attributeName="opacity" values="0;0;1;1;0" keyTimes="0;${(0.1 + 0.15 * i).toFixed(2)};${(0.2 + 0.15 * i).toFixed(2)};0.92;1" dur="7s" repeatCount="indefinite"/></ellipse>`;
  const region = l1
    ? `<polygon points="${X(1)},${Y(0)} ${X(0)},${Y(1)} ${X(-1)},${Y(0)} ${X(0)},${Y(-1)}" fill="var(--c2)" fill-opacity="0.25" stroke="var(--c2)" stroke-width="1.4"/>`
    : `<circle cx="${X(0)}" cy="${Y(0)}" r="${U}" fill="var(--c2)" fill-opacity="0.25" stroke="var(--c2)" stroke-width="1.4"/>`;
  return `<g clip-path="url(#reg-clip-${l1 ? 1 : 2})">
<line x1="${cx - 70}" y1="${Y(0)}" x2="${cx + 75}" y2="${Y(0)}" stroke="var(--muted)" stroke-width="0.8"/>
<line x1="${X(0)}" y1="190" x2="${X(0)}" y2="20" stroke="var(--muted)" stroke-width="0.8"/>
${region}
${[0.0625, 0.25, 0.56, 1].map(ell).join('')}
<circle cx="${X(W0[0])}" cy="${Y(W0[1])}" r="3" fill="var(--fg)"/>
<circle cx="${X(p[0])}" cy="${Y(p[1])}" r="4" fill="var(--c1)" stroke="var(--fg)" stroke-width="0.6" opacity="0"><animate attributeName="opacity" values="0;0;1;1;0" keyTimes="0;0.65;0.72;0.92;1" dur="7s" repeatCount="indefinite"/></circle>
</g>
<text x="${cx - 68}" y="14" font-size="9" fill="var(--fg)">${title}</text>
<text x="${X(W0[0]) + 5}" y="${Y(W0[1]) + 3}" font-size="9" fill="var(--fg)">OLS</text>
<text x="${cx - 68}" y="200" font-size="9" fill="var(--c1)">solution (${p[0].toFixed(2)}, ${p[1].toFixed(2)})${l1 ? ': w₁ = 0' : ''}</text>
<text x="${cx + 62}" y="${Y(0) - 3}" font-size="9" fill="var(--muted)">w₁</text>
<text x="${X(0) + 3}" y="30" font-size="9" fill="var(--muted)">w₂</text>`;
}
const GEO_SVG = `<svg viewBox="0 0 320 206" xmlns="http://www.w3.org/2000/svg">
<defs><clipPath id="reg-clip-1"><rect x="2" y="18" width="154" height="172"/></clipPath><clipPath id="reg-clip-2"><rect x="164" y="18" width="154" height="172"/></clipPath></defs>
${panel(72, true, 'L1 (lasso): |w₁|+|w₂| ≤ t')}
${panel(234, false, 'L2 (ridge): w₁²+w₂² ≤ t²')}
</svg>`;

export default {
  cards: [
    {
      kind: 'explain',
      title: 'Huge weights, wild curves',
      body: String.raw`An 11th-degree polynomial fitted to 12 noisy points threads through every point and swings wildly between them. Tap **show w·φ**: the individual terms $w_jx^j$ are enormous and nearly cancel. Overfitting shows up as **large, finely balanced weights**.

**Regularization** changes the training objective to prefer simpler fits:
$$\min_{\mathbf w}\ \underbrace{\textstyle\sum_i\big(y_i-\mathbf w^\top\boldsymbol\phi(x_i)\big)^2}_{\text{fit the data}}+\lambda\,\underbrace{\Omega(\mathbf w)}_{\text{penalty}}.$$
The hyperparameter $\lambda\ge0$ sets the exchange rate between fit and simplicity. It trades a little bias for a large reduction in [variance](@ml/generalization-bias-variance).`,
      widget: { type: 'MlLeastSquaresFit', props: { truth: 'sin', model: 'poly', k: 11, kMax: 12, n: 12, showTruth: true, controls: false } },
    },
    {
      kind: 'explain',
      title: 'Ridge regression (L2)',
      body: String.raw`**Ridge** uses $\Omega(\mathbf w)=\lVert\mathbf w\rVert_2^2=\sum_jw_j^2$. Setting the gradient to zero gives a closed form:
$$\mathbf w_\lambda=(X^\top X+\lambda I)^{-1}X^\top\mathbf y.$$
Hoerl & Kennard (1970) introduced it for **ill-conditioned** problems: when features are nearly collinear, $X^\top X$ is close to singular and least-squares weights blow up. Adding $\lambda I$ raises every eigenvalue by $\lambda$, so the matrix is always invertible for $\lambda>0$.

Two practical rules:
- do **not** penalize the intercept (otherwise shifting $y$ changes the fit);
- **standardize** features first, because the penalty treats all $w_j$ alike and so depends on their units.`,
    },
    {
      kind: 'widget',
      title: 'λ moves you along the bias–variance curve',
      body: String.raw`Same set-up as the bias–variance lesson: 40 training sets, each fitted with a **degree-10** polynomial, now with a ridge penalty. Keep the degree at 10 and slide $\lambda$ up from 0.

- $\lambda=0$: low bias, huge variance (the faint fits flail).
- Moderate $\lambda$ (roughly $10^{-3}$–$10^{-1}$ here): variance collapses while bias barely moves, and test MSE drops sharply.
- Large $\lambda$: all weights are squeezed towards 0, the fits flatten, and bias dominates.

Notice that $\lambda$ acts as a continuous complexity knob, unlike the integer degree.`,
      widget: { type: 'MlBiasVariance', props: { k: 10, kMax: 10, n: 15, noise: 0.3, sets: 40, ridge: true } },
    },
    {
      kind: 'mcq',
      prompt: String.raw`In ridge regression with an unpenalized intercept, what does the fitted model approach as $\lambda\to\infty$?`,
      choices: [
        'The ordinary least-squares fit',
        String.raw`A constant prediction equal to the mean of the training $y$ values`,
        'The zero function, whatever the data',
        'An interpolating curve through every point',
      ],
      answer: 1,
      why: String.raw`An infinite penalty forces every penalized weight to 0, leaving only the intercept, whose best value is $\bar y$. Predicting exactly 0 would happen only if the intercept were penalized too. $\lambda\to0$ (not $\infty$) recovers OLS.`,
    },
    {
      kind: 'explain',
      title: 'The lasso (L1)',
      body: String.raw`The **lasso** (Tibshirani, 1996) uses $\Omega(\mathbf w)=\lVert\mathbf w\rVert_1=\sum_j|w_j|$:
$$\min_{\mathbf w}\ \tfrac12\lVert\mathbf y-X\mathbf w\rVert^2+\lambda\lVert\mathbf w\rVert_1.$$
The kink of $|w|$ at 0 means that for large enough $\lambda$ many weights become **exactly zero**. The lasso performs **feature selection** and estimation in one convex problem.

There is no closed form in general; it is solved by coordinate descent or by the LARS path algorithm. With **orthonormal** features ($X^\top X=I$) each weight is a simple function of its least-squares value $\hat w_j$:
- ridge (objective $\lVert\mathbf y-X\mathbf w\rVert^2+\lambda\lVert\mathbf w\rVert^2$): $\ \hat w_j/(1+\lambda)$, proportional shrinkage;
- lasso: $\ \operatorname{sign}(\hat w_j)\,\max(|\hat w_j|-\lambda,0)$, **soft thresholding**.`,
    },
    {
      kind: 'widget',
      title: 'Shrink vs threshold',
      body: String.raw`The horizontal axis is the least-squares weight $\hat w_j$; the curves show the regularized weight in the orthonormal case. Green: no penalty. Blue: ridge, $\hat w/(1+\lambda)$, never exactly zero. Orange: lasso, which sets everything in $[-\lambda,\lambda]$ to **exactly 0** and shifts the rest towards 0 by $\lambda$. Move $\lambda$.`,
      widget: {
        type: 'FunctionPlot',
        props: {
          fns: ['x', 'x/(1+l)', 'sign(x)*max(abs(x)-l,0)'],
          x: [-3, 3], y: [-3, 3],
          params: [{ name: 'l', min: 0, max: 2, value: 1, label: 'λ' }],
          labels: ['least squares', 'ridge', 'lasso'],
          xLabel: 'ŵ (OLS)', yLabel: 'regularized w',
        },
      },
    },
    {
      kind: 'numeric',
      prompt: String.raw`Orthonormal features, $\lambda=1$. A coefficient has least-squares value $\hat w=2.5$. What is its **lasso** estimate (using the $\tfrac12$-RSS objective above)?`,
      answer: 1.5,
      tolerance: 0.001,
      why: String.raw`Soft thresholding: $\operatorname{sign}(2.5)\max(2.5-1,0)=1.5$. The ridge estimate would be $2.5/(1+1)=1.25$. A coefficient with $|\hat w|\le1$ would be set to exactly 0 by the lasso but not by ridge.`,
    },
    {
      kind: 'widget',
      title: 'Why corners give zeros',
      body: String.raw`Equivalently, minimize the squared error subject to a **budget** $\Omega(\mathbf w)\le t$. The red ellipses are contours of the training error around the least-squares solution (black dot). They grow until they first touch the blue constraint region; the green dot is the regularized solution.

The L1 ball is a diamond with **corners on the axes**, so the first contact is often at a corner, where some $w_j=0$. The L2 ball is round, so the contact point is generically off the axes and every weight stays nonzero, only smaller.`,
      widget: { type: 'SvgDiagram', props: { svg: GEO_SVG }, caption: 'Same data, same budget size: the lasso lands on w₁ = 0; ridge keeps both weights.' },
    },
    {
      kind: 'truefalse',
      prompt: String.raw`Ridge regression with $\lambda>0$ typically sets several coefficients exactly to zero, which is why it is used for feature selection.`,
      answer: false,
      why: String.raw`Ridge shrinks proportionally (e.g. $\hat w/(1+\lambda)$ in the orthonormal case), so a coefficient is zero only if its least-squares value already was. Exact zeros come from the **L1** penalty's corner at 0.`,
    },
    {
      kind: 'explain',
      title: 'Penalties are priors',
      body: String.raw`In the [probabilistic view](@ml/probabilistic-view), a penalty is a negative log-prior. Take Gaussian noise $y_i\sim\mathcal N(\mathbf w^\top\mathbf x_i,\sigma^2)$ and maximize the posterior (**MAP**):
- prior $w_j\sim\mathcal N(0,\tau^2)$: $-\log p(\mathbf w\mid\mathcal D)=\frac1{2\sigma^2}\lVert\mathbf y-X\mathbf w\rVert^2+\frac1{2\tau^2}\lVert\mathbf w\rVert^2+\text{const}$, which is **ridge** with $\lambda=\sigma^2/\tau^2$;
- prior $w_j\sim\text{Laplace}(0,b)$, density $\propto e^{-|w_j|/b}$: this is the **lasso**.

A strong prior belief that weights are small (small $\tau^2$) means a large $\lambda$. Note that MAP gives a single point estimate. A full Bayesian treatment would average over the posterior instead (see [Bayesian inference](@stats/bayesian-inference)).`,
    },
    {
      kind: 'numeric',
      prompt: String.raw`Noise variance $\sigma^2=0.25$ and a Gaussian prior $w_j\sim\mathcal N(0,0.05)$. What ridge penalty $\lambda$ (for the objective $\lVert\mathbf y-X\mathbf w\rVert^2+\lambda\lVert\mathbf w\rVert^2$) does the MAP estimate correspond to?`,
      answer: 5,
      tolerance: 0.001,
      why: String.raw`Multiply the negative log-posterior by $2\sigma^2$: $\lVert\mathbf y-X\mathbf w\rVert^2+(\sigma^2/\tau^2)\lVert\mathbf w\rVert^2$, so $\lambda=0.25/0.05=5$. Inverting the ratio ($\tau^2/\sigma^2=0.2$) is the common slip.`,
    },
    {
      kind: 'explain',
      title: 'Weight decay & early stopping',
      body: String.raw`In neural networks, the L2 penalty is called **weight decay**: the gradient step $\mathbf w\leftarrow\mathbf w-\eta(\nabla L+\lambda\mathbf w)$ multiplies the weights by $(1-\eta\lambda)$ every step. With adaptive optimizers like Adam the two are *not* equivalent, which is why **AdamW** decays the weights separately from the gradient update (Loshchilov & Hutter, 2019).

**Early stopping** (halt training when validation error stops improving) is also a regularizer. For least squares, [gradient descent](@ml/gradient-descent) started at $\mathbf w=0$ fits directions with large curvature first. Stopping after $t$ steps of size $\eta$ behaves roughly like ridge with $\lambda\approx1/(\eta t)$, so more steps means less regularization.

Other common regularizers: **elastic net** ($\alpha\lVert\mathbf w\rVert_1+(1-\alpha)\lVert\mathbf w\rVert_2^2$), dropout and data augmentation ([deep-learning practice](@ml/deep-learning-practice)).`,
    },
    {
      kind: 'match',
      prompt: 'Match each regularizer to its characteristic effect.',
      pairs: [
        [String.raw`L2 / ridge $\lambda\lVert\mathbf w\rVert_2^2$`, 'Shrinks all weights smoothly; handles collinear features'],
        [String.raw`L1 / lasso $\lambda\lVert\mathbf w\rVert_1$`, 'Sets many weights exactly to zero (sparse model)'],
        ['Elastic net', 'Sparse, but tends to keep groups of correlated features together'],
        ['Early stopping', 'Limits how far the optimizer moves from its starting point'],
      ],
      why: String.raw`Ridge's round penalty shrinks proportionally; the lasso's corners give exact zeros; the elastic net mixes both, and its L2 part stops the lasso from arbitrarily picking one of several correlated features (Zou & Hastie, 2005). Early stopping regularizes through the optimization path rather than the objective.`,
    },
    {
      kind: 'order',
      prompt: 'Put the steps for fitting a lasso model properly in order.',
      steps: [
        'Split off a test set and leave it untouched',
        'Standardize features using means and standard deviations from the training data only',
        'Fit the lasso along a decreasing grid of λ values (the regularization path)',
        'Choose λ by cross-validation on the training data',
        'Refit at the chosen λ on all training data, then evaluate once on the test set',
      ],
      why: String.raw`Standardization statistics must come from training data alone, or test information leaks in. $\lambda$ is a hyperparameter, so it is chosen by [cross-validation](@ml/cross-validation), never by test error. The test set is used once at the end.`,
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- Regularization adds $\lambda\,\Omega(\mathbf w)$ to the loss, trading a little bias for less variance.
- Ridge (L2): $\mathbf w_\lambda=(X^\top X+\lambda I)^{-1}X^\top\mathbf y$; it shrinks proportionally and fixes ill-conditioning (Hoerl & Kennard, 1970).
- Lasso (L1): soft thresholding gives exact zeros, so it selects features (Tibshirani, 1996). Geometrically, the diamond has corners on the axes.
- MAP view: a Gaussian prior gives ridge with $\lambda=\sigma^2/\tau^2$; a Laplace prior gives the lasso.
- Weight decay and early stopping are the deep-learning versions; choose $\lambda$ by cross-validation and standardize features first.`,
    },
  ],
  references: [
    { authors: 'T. Hastie, R. Tibshirani & J. Friedman', title: 'The Elements of Statistical Learning', year: 2009, venue: '2nd ed., Springer', detail: 'Sec. 3.4 (shrinkage methods: ridge, lasso; Table 3.4, Fig. 3.11)', url: 'https://hastie.su.domains/ElemStatLearn/' },
    { authors: 'A. E. Hoerl & R. W. Kennard', title: 'Ridge Regression: Biased Estimation for Nonorthogonal Problems', year: 1970, venue: 'Technometrics 12(1), 55–67' },
    { authors: 'R. Tibshirani', title: 'Regression Shrinkage and Selection via the Lasso', year: 1996, venue: 'Journal of the Royal Statistical Society, Series B 58(1), 267–288' },
    { authors: 'I. Goodfellow, Y. Bengio & A. Courville', title: 'Deep Learning', year: 2016, venue: 'MIT Press', detail: 'Ch. 7 (parameter norm penalties; early stopping as a regularizer)', url: 'https://www.deeplearningbook.org/' },
    { authors: 'I. Loshchilov & F. Hutter', title: 'Decoupled Weight Decay Regularization', year: 2019, venue: 'ICLR' },
  ],
} satisfies LessonContent;
