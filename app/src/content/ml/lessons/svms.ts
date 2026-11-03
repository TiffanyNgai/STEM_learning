import type { LessonContent } from '../../types';

export default {
  cards: [
    {
      kind: 'explain',
      title: 'Which line is best?',
      body: String.raw`When two classes can be separated by a straight line, infinitely many lines do it. [Logistic regression](@ml/logistic-regression-ml) picks one by likelihood. A **support vector machine** (SVM) picks the line with the widest empty corridor, the **margin**, between the classes.

Intuition: a line that only just squeezes past the points is fragile; a small wobble in a new point flips its label. The widest street tolerates the most noise. Below, the solid line is the SVM boundary and the dashed lines are the edges of the street. **Drag a point**: the boundary only moves when you push a ringed point (a **support vector**) or cross into the street.`,
      widget: { type: 'MlSVMMargin', props: { dataset: 'separable', kernel: 'linear', C: 1000, controls: false } },
    },
    {
      kind: 'explain',
      title: 'Margin as an optimization problem',
      body: String.raw`Labels are $y_i\in\{-1,+1\}$ and the classifier is $\operatorname{sign}f(\mathbf x)$ with $f(\mathbf x)=\mathbf w^\top\mathbf x+b$. The distance from a point to the line $f=0$ is $|f(\mathbf x)|/\lVert\mathbf w\rVert$.

Scaling $(\mathbf w,b)$ does not move the line, so fix the scale by requiring $y_if(\mathbf x_i)\ge1$, with equality for the closest points. Then the street edges are $f=\pm1$ and the street's full width is $2/\lVert\mathbf w\rVert$. Maximizing it is the **hard-margin SVM**:
$$\min_{\mathbf w,b}\ \tfrac12\lVert\mathbf w\rVert^2\quad\text{s.t.}\quad y_i(\mathbf w^\top\mathbf x_i+b)\ge1\ \ \forall i.$$
A convex quadratic objective with linear constraints: a [convex](@ml/convexity) quadratic program with a unique optimal $\mathbf w$.`,
    },
    {
      kind: 'numeric',
      prompt: String.raw`An SVM has $\mathbf w=(3,4)$ and $b=-2$. What is the width $2/\lVert\mathbf w\rVert$ of its margin (the full street between $f=-1$ and $f=+1$)?`,
      answer: 0.4,
      tolerance: 0.001,
      why: String.raw`$\lVert\mathbf w\rVert=\sqrt{9+16}=5$, so the width is $2/5=0.4$. The bias $b$ shifts the street but does not change its width. Answering $0.2$ gives only the distance from the centre line to one edge.`,
    },
    {
      kind: 'explain',
      title: 'Soft margins and the hinge loss',
      body: String.raw`Real data overlap, so the hard constraints have no solution. Give each point a **slack** $\xi_i\ge0$ that lets it violate the margin, and charge for it:
$$\min_{\mathbf w,b,\boldsymbol\xi}\ \tfrac12\lVert\mathbf w\rVert^2+C\sum_i\xi_i\quad\text{s.t.}\quad y_if(\mathbf x_i)\ge1-\xi_i,\ \ \xi_i\ge0.$$
At the optimum $\xi_i=\max(0,1-y_if(\mathbf x_i))$, the **hinge loss**. So the soft-margin SVM is
$$\min_{\mathbf w,b}\ \sum_i\max\big(0,1-y_if(\mathbf x_i)\big)+\tfrac1{2C}\lVert\mathbf w\rVert^2:$$
hinge loss plus L2 regularization. The plot shows losses against the **margin** $m=yf(\mathbf x)$: hinge (curve 1) is exactly zero once $m\ge1$, unlike the logistic loss (curve 2); both are convex upper bounds on the 0–1 error (curve 3).`,
      widget: {
        type: 'FunctionPlot',
        props: { fns: ['max(0,1-x)', 'log(1+exp(-x))/log(2)', 'x<0 ? 1 : 0'], x: [-2, 3], y: [-0.2, 3], labels: ['hinge', 'logistic (base 2)', '0–1'], xLabel: 'm = y f(x)', yLabel: 'loss' },
      },
    },
    {
      kind: 'numeric',
      prompt: String.raw`A point has label $y=+1$ and the SVM gives $f(\mathbf x)=-0.5$. What is its hinge loss $\max(0,1-yf(\mathbf x))$?`,
      answer: 1.5,
      tolerance: 0.001,
      why: String.raw`$yf=-0.5$, so the loss is $1-(-0.5)=1.5$. The point is misclassified (cost beyond 1) and also short of the margin. A correctly classified point with $yf=0.5$ would still pay $0.5$, because it sits inside the street.`,
    },
    {
      kind: 'widget',
      title: 'The dual: only inner products appear',
      body: String.raw`Lagrange multipliers $\alpha_i\ge0$ for the margin constraints turn the problem into its **dual**.`,
      widget: {
        type: 'StepReveal',
        props: {
          steps: [
            String.raw`Lagrangian: $\tfrac12\lVert\mathbf w\rVert^2+C\sum\xi_i-\sum\alpha_i[y_i(\mathbf w^\top\mathbf x_i+b)-1+\xi_i]-\sum\mu_i\xi_i$.`,
            String.raw`Set derivatives to zero: $\mathbf w=\sum_i\alpha_iy_i\mathbf x_i$, $\ \sum_i\alpha_iy_i=0$, $\ \alpha_i=C-\mu_i\Rightarrow0\le\alpha_i\le C$.`,
            String.raw`Substitute back: $\max_{\boldsymbol\alpha}\ \sum_i\alpha_i-\tfrac12\sum_{i,j}\alpha_i\alpha_jy_iy_j\,\mathbf x_i^\top\mathbf x_j$ subject to $0\le\alpha_i\le C$, $\sum_i\alpha_iy_i=0$.`,
            String.raw`Data enter only as $\mathbf x_i^\top\mathbf x_j$, so replace them by $k(\mathbf x_i,\mathbf x_j)$: $\ f(\mathbf x)=\sum_i\alpha_iy_i\,k(\mathbf x_i,\mathbf x)+b$.`,
            String.raw`Complementary slackness (KKT): $\alpha_i=0$ if $y_if(\mathbf x_i)>1$; $\ y_if(\mathbf x_i)=1$ if $0<\alpha_i<C$; $\ \alpha_i=C$ if $y_if(\mathbf x_i)<1$.`,
          ],
          notes: ['', 'the weight vector is a combination of data points', 'a concave QP in n variables', 'the kernel trick', 'only points on or inside the margin have αᵢ > 0: the support vectors'],
        },
      },
    },
    {
      kind: 'widget',
      title: 'C trades margin width against violations',
      body: String.raw`Overlapping classes. Slide $\log_{10}C$:
- **Small $C$**: violations are cheap, so the street is wide and many points sit in it. Many support vectors, a smooth, heavily regularized boundary.
- **Large $C$**: violations are expensive, so the street narrows to classify more training points correctly. Fewer support vectors, higher variance.

Rings mark support vectors: dashed rings lie exactly on the street edge ($0<\alpha_i<C$), bold rings are inside it or misclassified ($\alpha_i=C$). Points off the street have $\alpha_i=0$ and do not affect the solution at all.`,
      widget: { type: 'MlSVMMargin', props: { dataset: 'overlap', kernel: 'linear', C: 1, controls: false } },
    },
    {
      kind: 'multi',
      prompt: String.raw`In a trained soft-margin SVM, which statements are true? Select all that apply.`,
      choices: [
        String.raw`The weight vector is $\mathbf w=\sum_i\alpha_iy_i\mathbf x_i$, a combination of support vectors only`,
        String.raw`A point with $0<\alpha_i<C$ lies exactly on the margin, $y_if(\mathbf x_i)=1$`,
        String.raw`Every misclassified training point has $\alpha_i=C$`,
        String.raw`A correctly classified point outside the street can have $\alpha_i=C$`,
      ],
      answers: [0, 1, 2],
      why: String.raw`Points with $\alpha_i=0$ drop out of $\mathbf w=\sum\alpha_iy_i\mathbf x_i$. KKT pins free multipliers to the margin, and any point with $y_if<1$ (including all misclassified ones, $y_if<0$) has $\alpha_i=C$. A point strictly outside the street has $y_if>1$, which forces $\alpha_i=0$, not $C$.`,
    },
    {
      kind: 'truefalse',
      prompt: String.raw`Slightly moving a training point that lies strictly outside the margin (and stays outside it) leaves the SVM solution unchanged.`,
      answer: true,
      why: String.raw`Such a point has $\alpha_i=0$ and an inactive constraint, so the old $(\mathbf w,b)$ still satisfies all optimality (KKT) conditions. This **sparsity** is what distinguishes SVMs from logistic regression, where every point pulls on the boundary.`,
    },
    {
      kind: 'widget',
      title: 'Kernel SVMs: curved boundaries',
      body: String.raw`With the Gaussian kernel $k(\mathbf x,\mathbf z)=\exp(-\gamma\lVert\mathbf x-\mathbf z\rVert^2)$ (here $\gamma=1/2\ell^2$), the decision function $f(\mathbf x)=\sum_i\alpha_iy_ik(\mathbf x_i,\mathbf x)+b$ is a sum of bumps centred on the support vectors. The ring-shaped classes below need a curved boundary.

Raise $\gamma$ (narrow bumps): the boundary hugs individual points and can wrap islands around them, which is overfitting. Lower $\gamma$: the boundary gets smoother and eventually nearly linear. Switch to **linear** to see it fail. In practice choose $C$ and $\gamma$ together by [cross-validation](@ml/cross-validation).`,
      widget: { type: 'MlSVMMargin', props: { dataset: 'circle', kernel: 'rbf', C: 10, gamma: 1 } },
    },
    {
      kind: 'mcq',
      prompt: String.raw`An RBF-kernel SVM reaches 100% training accuracy but poor test accuracy, and almost every training point is a support vector. Which change is most likely to help?`,
      choices: [
        String.raw`Decrease $\gamma$ (wider kernel) and/or decrease $C$`,
        String.raw`Increase $\gamma$ further`,
        String.raw`Increase $C$ to penalize violations more`,
        'Remove the bias term b',
      ],
      answer: 0,
      why: String.raw`Overfitting comes from bumps so narrow that each point gets its own island, and from a high penalty on violations. A wider kernel (smaller $\gamma$) and a smaller $C$ both regularize. Larger $\gamma$ or $C$ moves further toward memorization; the bias term is irrelevant here.`,
    },
    {
      kind: 'match',
      prompt: 'Match each setting to its typical effect.',
      pairs: [
        [String.raw`Large $C$`, 'Narrow street, few margin violations, risk of overfitting'],
        [String.raw`Small $C$`, 'Wide street, many support vectors, smoother boundary'],
        [String.raw`Large $\gamma$ (RBF)`, 'Very local bumps: boundary wraps around single points'],
        [String.raw`Small $\gamma$ (RBF)`, 'Very broad bumps: boundary approaches a linear one'],
      ],
      why: String.raw`$C$ is the price of slack (inverse regularization strength); $\gamma=1/2\ell^2$ sets the reach of each support vector's influence. Both control model complexity and are tuned jointly.`,
    },
    {
      kind: 'fill',
      prompt: String.raw`A soft-margin SVM minimizes the ___ loss plus an L2 penalty on $\mathbf w$. Its solution depends only on the ___ vectors, and its dual uses the data only through ___ products, so any kernel can be plugged in.`,
      bank: ['hinge', 'support', 'inner', 'squared', 'eigen', 'outer', 'logistic'],
      answer: ['hinge', 'support', 'inner'],
      why: String.raw`Hinge loss $\max(0,1-yf)$ plus $\tfrac1{2C}\lVert\mathbf w\rVert^2$ is the soft-margin SVM. Points with $\alpha_i>0$ are the support vectors, and the dual objective involves only $\mathbf x_i^\top\mathbf x_j$, which becomes $k(\mathbf x_i,\mathbf x_j)$.`,
    },
    {
      kind: 'explain',
      title: 'History and practice',
      body: String.raw`Boser, Guyon and Vapnik (1992) combined the maximum-margin hyperplane with kernels; Cortes and Vapnik (1995) added slack variables for the soft margin and named them **support-vector networks**. Through the 2000s kernel SVMs were the state of the art on many benchmarks, including handwritten digits.

Practical notes:
- **Standardize features**: margins and RBF distances depend on scale.
- Training solves a QP in $n$ variables. Specialized solvers such as SMO (Platt 1998, used by the widget above in a simple form) update two $\alpha$'s at a time; cost still grows roughly between $n^2$ and $n^3$, so kernel SVMs struggle beyond a few hundred thousand points.
- SVMs output scores, not probabilities. Platt scaling fits a sigmoid to $f$ afterwards (see [calibration](@ml/calibration-uncertainty)).
- Multiclass problems use one-vs-rest or one-vs-one ensembles of binary SVMs.`,
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- An SVM chooses the separating hyperplane with the widest margin $2/\lVert\mathbf w\rVert$: minimize $\tfrac12\lVert\mathbf w\rVert^2$ subject to $y_if(\mathbf x_i)\ge1$.
- Soft margin = hinge loss + L2 penalty; $C$ sets the trade-off.
- The dual has $0\le\alpha_i\le C$; only **support vectors** ($\alpha_i>0$) matter, and data enter only through inner products, so kernels give nonlinear boundaries.
- RBF SVMs need $C$ and $\gamma$ tuned together; standardize inputs first.
- The same dual-plus-kernel idea reappears in [Gaussian processes](@ml/gaussian-processes) and [RKHS](@ml/rkhs) theory.`,
    },
  ],
  references: [
    { authors: 'C. Cortes & V. Vapnik', title: 'Support-vector networks', year: 1995, venue: 'Machine Learning 20(3), 273–297' },
    { authors: 'B. E. Boser, I. M. Guyon & V. N. Vapnik', title: 'A training algorithm for optimal margin classifiers', year: 1992, venue: 'Proceedings of the 5th Annual Workshop on Computational Learning Theory (COLT), 144–152' },
    { authors: 'B. Schölkopf & A. J. Smola', title: 'Learning with Kernels', year: 2002, venue: 'MIT Press', detail: 'Ch. 7 (pattern recognition: SVM formulation, soft margin), Ch. 10 (implementation)' },
    { authors: 'C. M. Bishop', title: 'Pattern Recognition and Machine Learning', year: 2006, venue: 'Springer', detail: 'Ch. 7.1 (maximum margin classifiers)' },
    { authors: 'J. C. Platt', title: 'Sequential Minimal Optimization: A Fast Algorithm for Training Support Vector Machines', year: 1998, venue: 'Microsoft Research Technical Report MSR-TR-98-14' },
  ],
} satisfies LessonContent;
