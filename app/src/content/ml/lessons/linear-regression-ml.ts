import type { LessonContent } from '../../types';

// Geometry of least squares: y is projected orthogonally onto the plane col(X) = {Xw}.
// A candidate prediction Xw wanders over the plane; the grey "error" line is shortest at the foot of the perpendicular.
const PROJ_SVG = `<svg viewBox="0 0 320 190" xmlns="http://www.w3.org/2000/svg">
<polygon points="30,150 210,172 292,112 112,90" fill="var(--c2)" opacity="0.15" stroke="var(--c2)" stroke-width="1"/>
<text x="36" y="168" font-size="10" fill="var(--c2)">column space of X: every possible Xw</text>
<line x1="90" y1="140" x2="200" y2="30" stroke="var(--fg)" stroke-width="2"/>
<circle cx="200" cy="30" r="3" fill="var(--fg)"/>
<text x="206" y="30" font-size="11" fill="var(--fg)">y (targets)</text>
<line x1="90" y1="140" x2="200" y2="125" stroke="var(--c2)" stroke-width="2"/>
<circle cx="200" cy="125" r="3" fill="var(--c2)"/>
<text x="150" y="146" font-size="10" fill="var(--c2)">ŷ = Xw*</text>
<line x1="200" y1="30" x2="200" y2="125" stroke="var(--c5)" stroke-width="1.6" stroke-dasharray="4 3"/>
<polyline points="200,115 210,116 210,126" fill="none" stroke="var(--c5)" stroke-width="1"/>
<text x="206" y="80" font-size="10" fill="var(--c5)">r = y − ŷ ⟂ plane</text>
<text x="80" y="136" font-size="10" fill="var(--muted)">0</text>
<line x1="200" y1="30" x2="150" y2="150" stroke="var(--muted)" stroke-width="1">
  <animate attributeName="x2" values="150;252;170;200;200" keyTimes="0;0.3;0.6;0.8;1" dur="7s" repeatCount="indefinite"/>
  <animate attributeName="y2" values="150;137;112;125;125" keyTimes="0;0.3;0.6;0.8;1" dur="7s" repeatCount="indefinite"/>
</line>
<circle cx="150" cy="150" r="3.5" fill="var(--c3)">
  <animate attributeName="cx" values="150;252;170;200;200" keyTimes="0;0.3;0.6;0.8;1" dur="7s" repeatCount="indefinite"/>
  <animate attributeName="cy" values="150;137;112;125;125" keyTimes="0;0.3;0.6;0.8;1" dur="7s" repeatCount="indefinite"/>
</circle>
<text x="4" y="14" font-size="10" fill="var(--c3)">orange: a candidate Xw; grey: its error y − Xw</text>
</svg>`;

export default {
  cards: [
    {
      kind: 'explain',
      title: 'Learning a line',
      body: String.raw`Every supervised learner has the same four parts ([the ML framing](@ml/ml-framing)): **data**, a **model**, a **loss** and an **optimizer**. Linear regression is the simplest complete example, and a building block of every neural network.

- **Data:** pairs $(\mathbf x_i, y_i)$, $i=1,\dots,n$, with input vector $\mathbf x_i\in\mathbb R^d$ and real target $y_i$.
- **Model:** $\hat y=\mathbf w^\top\mathbf x+b$ (weights $\mathbf w$, bias $b$).
- **Loss:** mean squared error (MSE) $\frac1n\sum_i(\hat y_i-y_i)^2$.

The plot fits a line by least squares; red segments are the **residuals** $y_i-\hat y_i$. Tap to add a point, e.g. a far outlier, and watch the line swing: squaring makes big errors dominate.`,
      widget: { type: 'MlLeastSquaresFit', props: { truth: 'line', k: 1, n: 10, noise: 0.25, controls: false } },
    },
    {
      kind: 'recall',
      title: 'From statistics: simple linear regression',
      points: [
        String.raw`The least-squares line minimizes the sum of squared vertical residuals $\sum_i(y_i-\hat y_i)^2$.`,
        String.raw`With one input: slope $=\dfrac{\sum_i(x_i-\bar x)(y_i-\bar y)}{\sum_i(x_i-\bar x)^2}$, intercept $=\bar y-\text{slope}\cdot\bar x$.`,
        'The slope is the predicted change in y per unit change in x.',
        String.raw`$R^2$ is the fraction of the variance of $y$ explained by the fit.`,
      ],
      link: 'stats/linear-regression',
    },
    {
      kind: 'explain',
      title: 'Matrix form',
      body: String.raw`Stack the inputs as rows of the **design matrix** $X\in\mathbb R^{n\times d}$, and the targets in $\mathbf y\in\mathbb R^n$. Trick: add a constant feature 1 to every $\mathbf x_i$, so the bias becomes just another weight. Then all predictions at once are
$$\hat{\mathbf y}=X\mathbf w,$$
and the training loss is
$$L(\mathbf w)=\frac1n\lVert X\mathbf w-\mathbf y\rVert^2=\frac1n\sum_{i=1}^n(\mathbf x_i^\top\mathbf w-y_i)^2.$$

**Example.** Data $x=(0,1,2)$, $y=(1,2,4)$. With the constant column,
$$X=\begin{pmatrix}1&0\\1&1\\1&2\end{pmatrix},\quad \mathbf w=\begin{pmatrix}b\\w\end{pmatrix}.$$`,
    },
    {
      kind: 'numeric',
      prompt: String.raw`Same data, $x=(0,1,2)$, $y=(1,2,4)$. Take the line $\hat y=x+1$ (so $b=1$, $w=1$). What is the training MSE $\frac1n\sum_i(\hat y_i-y_i)^2$? (3 decimals)`,
      answer: 0.333,
      tolerance: 0.005,
      why: String.raw`Predictions are $(1,2,3)$, residuals $(0,0,1)$, so the squared errors sum to 1 and the mean over $n=3$ points is $1/3\approx0.333$. A common slip is to report the sum (1) instead of the mean.`,
    },
    {
      kind: 'widget',
      title: 'The normal equations',
      body: String.raw`$L(\mathbf w)$ is a quadratic bowl in $\mathbf w$, so its minimum is where the gradient vanishes.`,
      widget: {
        type: 'StepReveal',
        props: {
          steps: [
            String.raw`Expand: $L(\mathbf w)=\frac1n\left(\mathbf w^\top X^\top X\mathbf w-2\mathbf w^\top X^\top\mathbf y+\mathbf y^\top\mathbf y\right)$.`,
            String.raw`Differentiate: $\nabla L(\mathbf w)=\frac2n\,X^\top(X\mathbf w-\mathbf y)$.`,
            String.raw`Set it to zero: $\;X^\top X\,\mathbf w^*=X^\top\mathbf y$. These are the **normal equations**: $d$ linear equations in $d$ unknowns.`,
            String.raw`If $X^\top X$ is invertible (the columns of $X$ are linearly independent): $\;\mathbf w^*=(X^\top X)^{-1}X^\top\mathbf y$.`,
            String.raw`Example: $X^\top X=\begin{pmatrix}3&3\\3&5\end{pmatrix}$, $X^\top\mathbf y=\begin{pmatrix}7\\10\end{pmatrix}$. Solving gives $b^*=5/6\approx0.833$ and a slope of $1.5$.`,
          ],
          notes: ['', 'uses ∇(wᵀAw) = 2Aw for symmetric A', 'gradient = 0 at the minimum of a convex bowl', 'in practice solve with QR or Cholesky, never by forming an explicit inverse', 'matches the slope formula from statistics'],
        },
      },
    },
    {
      kind: 'numeric',
      prompt: String.raw`New data: $x=(0,1,2)$, $y=(0,1,5)$, model $\hat y=b+wx$. Solve the normal equations. What is the slope $w^*$?`,
      answer: 2.5,
      tolerance: 0.01,
      why: String.raw`$X^\top X=\begin{pmatrix}3&3\\3&5\end{pmatrix}$ and $X^\top\mathbf y=(0+1+5,\;0+1+10)=(6,11)$. So $3b+3w=6$ and $3b+5w=11$; subtracting gives $2w=5$, $w^*=2.5$ (and $b^*=-0.5$). Check: slope $=\sum(x-\bar x)(y-\bar y)/\sum(x-\bar x)^2=5/2$.`,
    },
    {
      kind: 'widget',
      title: 'Geometry: least squares is a projection',
      body: String.raw`Think of $\mathbf y$ as one point in $\mathbb R^n$ (one axis per training example). As $\mathbf w$ varies, the predictions $X\mathbf w$ sweep out a flat subspace, the **column space** of $X$. Least squares picks the point $\hat{\mathbf y}$ in that subspace **closest** to $\mathbf y$, which is the foot of the perpendicular.

So the residual $\mathbf r=\mathbf y-\hat{\mathbf y}$ is orthogonal to every column of $X$: $X^\top\mathbf r=\mathbf 0$. That is exactly the normal equations. The matrix $H=X(X^\top X)^{-1}X^\top$ that maps $\mathbf y\mapsto\hat{\mathbf y}$ is the orthogonal **projection** ("hat") matrix.`,
      widget: { type: 'SvgDiagram', props: { svg: PROJ_SVG }, caption: 'The error line is shortest when it meets the plane at a right angle.' },
    },
    {
      kind: 'truefalse',
      prompt: String.raw`For a least-squares fit whose model includes a bias (a constant column of ones in $X$), the training residuals always sum to exactly zero.`,
      answer: true,
      why: String.raw`The residual is orthogonal to every column of $X$, including the all-ones column $\mathbf 1$: $\mathbf 1^\top\mathbf r=\sum_i r_i=0$. Without a bias term this need not hold.`,
    },
    {
      kind: 'explain',
      title: 'The gradient view',
      body: String.raw`Solving the normal equations costs about $O(nd^2+d^3)$, which is fine for $d$ in the thousands but not for millions of features or streaming data. Instead use [gradient descent](@ml/gradient-descent) with
$$\nabla L(\mathbf w)=\tfrac2n X^\top(X\mathbf w-\mathbf y)=\tfrac2n\textstyle\sum_i(\hat y_i-y_i)\,\mathbf x_i,$$
i.e. **(prediction − target) × input**, summed over examples. Each step costs $O(nd)$.

The Hessian $\tfrac2nX^\top X$ is constant, so the loss is a convex quadratic bowl with one global minimum (unique if $X^\top X$ is invertible). Below is the MSE for the data $x=(0,1,2)$, $y=(1,2,4)$: horizontal axis $w$, vertical axis $b$. The valley is tilted and stretched because $x$ is not centred, so $w$ and $b$ are coupled.`,
      widget: { type: 'GradientDescent2D', props: { f: '((y-1)^2 + (x+y-2)^2 + (2*x+y-4)^2)/3', range: [-1, 3.5, -1.5, 3], start: [-0.5, 2.6], lr: 0.15, lrMax: 0.45, optimizers: ['gd', 'momentum'] } },
    },
    {
      kind: 'mcq',
      prompt: String.raw`For $L(\mathbf w)=\frac1n\lVert X\mathbf w-\mathbf y\rVert^2$, which is $\nabla L(\mathbf w)$?`,
      choices: [
        String.raw`$\frac2n X^\top(X\mathbf w-\mathbf y)$`,
        String.raw`$\frac2n X(X\mathbf w-\mathbf y)$`,
        String.raw`$\frac2n (X\mathbf w-\mathbf y)^\top X^\top X$`,
        String.raw`$\frac2n X^\top X\mathbf w$`,
      ],
      answer: 0,
      why: String.raw`The gradient must be a $d$-vector like $\mathbf w$; $X^\top$ ($d\times n$) times the residual vector ($n$) gives that. $X(X\mathbf w-\mathbf y)$ doesn't even have compatible shapes, and $\frac2nX^\top X\mathbf w$ forgets the $-X^\top\mathbf y$ term.`,
    },
    {
      kind: 'explain',
      title: 'When the solution is not unique',
      body: String.raw`If some column of $X$ is a linear combination of the others (**collinearity**), or there are more parameters than examples ($d>n$), then $X^\top X$ is singular. The bowl then has a flat valley floor: infinitely many $\mathbf w$ give the same minimal loss.

Two standard fixes:
- the **pseudo-inverse** $X^+\mathbf y$ picks the minimum-norm solution (gradient descent started from $\mathbf 0$ converges to it too);
- **ridge regression** solves $(X^\top X+\lambda I)\mathbf w=X^\top\mathbf y$, which is always invertible for $\lambda>0$ (see [regularization](@ml/regularization)).

Why squares at all? Least squares is the maximum-likelihood fit if $y=\mathbf w^\top\mathbf x+\varepsilon$ with Gaussian noise $\varepsilon$; see [the probabilistic view](@ml/probabilistic-view).`,
    },
    {
      kind: 'multi',
      prompt: String.raw`Which situations make $X^\top X$ singular (so least squares has no unique solution)? Select all that apply.`,
      choices: [
        'Two features are the same measurement in different units (e.g. metres and feet)',
        'There are more parameters (columns of X) than training examples',
        'Every feature has been standardized to mean 0 and variance 1',
        'One feature is the sum of two other features',
      ],
      answers: [0, 1, 3],
      why: String.raw`Proportional columns, a column that is a sum of others, and $d>n$ all make the columns of $X$ linearly dependent. ($X^\top X$ has rank at most $n$, so $d>n$ forces singularity.) Standardizing only rescales and shifts each column; it improves conditioning and cannot by itself create a dependency.`,
    },
    {
      kind: 'match',
      prompt: 'Match each object to its role in least squares.',
      pairs: [
        [String.raw`$X$`, 'Design matrix: one row per example, one column per feature'],
        [String.raw`$X^\top X\mathbf w=X^\top\mathbf y$`, 'Normal equations: the gradient is zero'],
        [String.raw`$X(X^\top X)^{-1}X^\top$`, 'Hat matrix: projects y onto the column space'],
        [String.raw`$\mathbf y-X\mathbf w^*$`, 'Residual vector: orthogonal to every column of X'],
      ],
      why: String.raw`The design matrix holds the data; setting $\nabla L=0$ gives the normal equations; their solution plugged into $X\mathbf w$ is $H\mathbf y$, a projection; and what is left over, the residual, is perpendicular to the subspace.`,
    },
    {
      kind: 'fill',
      prompt: String.raw`The least-squares prediction $\hat{\mathbf y}$ is the orthogonal ___ of $\mathbf y$ onto the column ___ of $X$, so the residual is ___ to every column of $X$.`,
      bank: ['projection', 'space', 'orthogonal', 'rotation', 'parallel', 'gradient', 'rank'],
      answer: ['projection', 'space', 'orthogonal'],
      why: String.raw`$\hat{\mathbf y}$ is the closest point of the subspace $\{X\mathbf w\}$ to $\mathbf y$, and closest-point means the error is perpendicular: $X^\top(\mathbf y-\hat{\mathbf y})=\mathbf 0$. "Parallel" is the classic wrong guess.`,
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- Linear regression = linear model $\hat{\mathbf y}=X\mathbf w$ + MSE loss; fold the bias in with a column of ones.
- Normal equations $X^\top X\mathbf w^*=X^\top\mathbf y$; unique iff the columns of $X$ are linearly independent.
- Geometry: $\hat{\mathbf y}$ is the orthogonal projection of $\mathbf y$ onto the column space; residuals are orthogonal to every feature.
- Gradient $\tfrac2nX^\top(X\mathbf w-\mathbf y)$ = (prediction − target) × input; the loss is a convex quadratic, and the conditioning of $X^\top X$ sets GD's speed.
- Next: make the model bend with [basis functions](@ml/basis-functions).`,
    },
  ],
  references: [
    { authors: 'T. Hastie, R. Tibshirani & J. Friedman', title: 'The Elements of Statistical Learning', year: 2009, venue: '2nd ed., Springer', detail: 'Ch. 3.2', url: 'https://hastie.su.domains/ElemStatLearn/' },
    { authors: 'C. M. Bishop', title: 'Pattern Recognition and Machine Learning', year: 2006, venue: 'Springer', detail: 'Ch. 3.1 (incl. 3.1.2 geometry of least squares)' },
    { authors: 'K. P. Murphy', title: 'Probabilistic Machine Learning: An Introduction', year: 2022, venue: 'MIT Press', detail: 'Ch. 11', url: 'https://probml.github.io/pml-book/book1.html' },
    { authors: 'G. Strang', title: 'Introduction to Linear Algebra', year: 2016, venue: '5th ed., Wellesley-Cambridge Press', detail: 'Ch. 4 (projections and least squares)' },
  ],
} satisfies LessonContent;
