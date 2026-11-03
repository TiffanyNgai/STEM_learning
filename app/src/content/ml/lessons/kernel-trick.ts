import type { LessonContent } from '../../types';

// Concentric classes in 2D (left) move to the features (z1, z2) = (x1², x2²) (right), where the line z1 + z2 = 0.8 separates them.
const PTS: [number, number, number][] = Array.from({ length: 18 }, (_, i) => {
  const inner = i % 2 === 0; const a = (2 * Math.PI * i) / 18 + (inner ? 0.3 : 0);
  const r = inner ? 0.35 + 0.2 * ((i * 7) % 5) / 4 : 1.1 + 0.25 * ((i * 3) % 5) / 4;
  return [r * Math.cos(a), r * Math.sin(a), inner ? 1 : 0];
});
const lx = (x: number) => 80 + 48 * x;
const ly = (y: number) => 100 - 48 * y;
const rx = (z: number) => 186 + 62 * z;
const ry = (z: number) => 176 - 62 * z;
const mv = (attr: string, from: number, to: number) =>
  `<animate attributeName="${attr}" values="${from.toFixed(1)};${from.toFixed(1)};${to.toFixed(1)};${to.toFixed(1)};${from.toFixed(1)}" keyTimes="0;0.15;0.5;0.9;1" dur="8s" repeatCount="indefinite"/>`;
const LIFT_SVG = `<svg viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg">
<text x="80" y="14" font-size="10" text-anchor="middle" fill="var(--fg)">inputs (x₁, x₂)</text>
<text x="250" y="14" font-size="10" text-anchor="middle" fill="var(--fg)">features (x₁², x₂²)</text>
<line x1="12" y1="100" x2="148" y2="100" stroke="var(--grid)"/><line x1="80" y1="30" x2="80" y2="170" stroke="var(--grid)"/>
<line x1="186" y1="176" x2="312" y2="176" stroke="var(--fg)" stroke-width="0.8"/><line x1="186" y1="176" x2="186" y2="40" stroke="var(--fg)" stroke-width="0.8"/>
<line x1="${rx(0.8)}" y1="${ry(0)}" x2="${rx(0)}" y2="${ry(0.8)}" stroke="var(--c1)" stroke-width="2" opacity="0"><animate attributeName="opacity" values="0;0;0;1;1;0" keyTimes="0;0.15;0.5;0.6;0.9;1" dur="8s" repeatCount="indefinite"/></line>
<text x="${rx(0.62)}" y="${ry(0.55)}" font-size="9" fill="var(--c1)" opacity="0">z₁ + z₂ = 0.8<animate attributeName="opacity" values="0;0;0;1;1;0" keyTimes="0;0.15;0.5;0.6;0.9;1" dur="8s" repeatCount="indefinite"/></text>
${PTS.map(([x, y, c]) => `<circle cx="${lx(x).toFixed(1)}" cy="${ly(y).toFixed(1)}" r="4" fill="${c ? 'var(--c2)' : 'var(--c3)'}" stroke="var(--fg)" stroke-width="0.6">${mv('cx', lx(x), rx(x * x))}${mv('cy', ly(y), ry(y * y))}</circle>`).join('')}
<text x="12" y="192" font-size="9" fill="var(--muted)">blue: inside a circle · orange: outside. No line separates them on the left.</text>
</svg>`;

export default {
  cards: [
    {
      kind: 'explain',
      title: 'Lifting without the lifting',
      body: String.raw`In [basis functions](@ml/basis-functions) we fitted linear models to features $\boldsymbol\phi(\mathbf x)$. Below, blue points sit inside a circle and orange points outside. No straight line separates them in the plane, but after the map $\mathbf x\mapsto(x_1^2,x_2^2)$ the straight line $z_1+z_2=0.8$ does.

The catch: rich feature maps are huge. All monomials of degree $\le3$ in 100 inputs number $176{,}851$. This lesson shows that many algorithms never need the features themselves, only **inner products** $\boldsymbol\phi(\mathbf x)^\top\boldsymbol\phi(\mathbf z)$, and those can often be computed cheaply in the original space. That shortcut is the **kernel trick**.`,
      widget: { type: 'SvgDiagram', props: { svg: LIFT_SVG }, caption: String.raw`Each point moves to $(x_1^2,x_2^2)$. The circle $x_1^2+x_2^2=0.8$ becomes a straight line.` },
    },
    {
      kind: 'explain',
      title: 'A kernel is an inner product',
      body: String.raw`A **kernel** is a function $k(\mathbf x,\mathbf z)$ that equals an inner product of features:
$$k(\mathbf x,\mathbf z)=\boldsymbol\phi(\mathbf x)^\top\boldsymbol\phi(\mathbf z).$$
It measures **similarity**: large when $\mathbf x$ and $\mathbf z$ map to features pointing the same way.

**Worked example.** For $\mathbf x\in\mathbb R^2$ take $k(\mathbf x,\mathbf z)=(\mathbf x^\top\mathbf z)^2$. Expanding,
$$(x_1z_1+x_2z_2)^2=x_1^2z_1^2+2x_1x_2z_1z_2+x_2^2z_2^2=\boldsymbol\phi(\mathbf x)^\top\boldsymbol\phi(\mathbf z)$$
with $\boldsymbol\phi(\mathbf x)=(x_1^2,\sqrt2\,x_1x_2,x_2^2)$. Check with $\mathbf x=(1,2)$, $\mathbf z=(3,1)$: $\mathbf x^\top\mathbf z=5$, so $k=25$; and $\boldsymbol\phi(\mathbf x)^\top\boldsymbol\phi(\mathbf z)=1\cdot9+2\sqrt2\cdot3\sqrt2+4\cdot1=9+12+4=25$. One dot product and a square replace building three features.`,
    },
    {
      kind: 'numeric',
      prompt: String.raw`The inhomogeneous polynomial kernel is $k(\mathbf x,\mathbf z)=(1+\mathbf x^\top\mathbf z)^2$. Compute $k(\mathbf x,\mathbf z)$ for $\mathbf x=(2,1)$ and $\mathbf z=(1,3)$.`,
      answer: 36,
      why: String.raw`$\mathbf x^\top\mathbf z=2\cdot1+1\cdot3=5$, so $k=(1+5)^2=36$. Forgetting the $1$ gives $25$. This kernel's implicit features are all monomials of degree $\le2$ (with $\sqrt2$ weights), six of them for two inputs.`,
    },
    {
      kind: 'explain',
      title: 'Ridge regression only needs inner products',
      body: String.raw`Take [ridge regression](@ml/regularization) on features: minimize $\lVert\Phi\mathbf w-\mathbf y\rVert^2+\lambda\lVert\mathbf w\rVert^2$, where row $i$ of the $n\times p$ matrix $\Phi$ is $\boldsymbol\phi(\mathbf x_i)^\top$. The solution can be rewritten so that $\Phi$ appears only through the $n\times n$ **Gram matrix**
$$K=\Phi\Phi^\top,\qquad K_{ij}=\boldsymbol\phi(\mathbf x_i)^\top\boldsymbol\phi(\mathbf x_j)=k(\mathbf x_i,\mathbf x_j).$$
The derivation is on the next card. The result, **kernel ridge regression**:
$$\mathbf a=(K+\lambda I)^{-1}\mathbf y,\qquad f(\mathbf x)=\sum_{i=1}^n a_i\,k(\mathbf x_i,\mathbf x).$$
Features never appear. We solve an $n\times n$ system instead of a $p\times p$ one, which wins when $p$ is huge or infinite.`,
    },
    {
      kind: 'widget',
      title: 'From weights to dual coefficients',
      widget: {
        type: 'StepReveal',
        props: {
          steps: [
            String.raw`Primal solution: $\mathbf w^*=(\Phi^\top\Phi+\lambda I_p)^{-1}\Phi^\top\mathbf y$.`,
            String.raw`Push-through identity: $(\Phi^\top\Phi+\lambda I_p)^{-1}\Phi^\top=\Phi^\top(\Phi\Phi^\top+\lambda I_n)^{-1}$. (Multiply both sides on the left by $\Phi^\top\Phi+\lambda I_p$ and on the right by $\Phi\Phi^\top+\lambda I_n$: both give $\Phi^\top\Phi\Phi^\top+\lambda\Phi^\top$.)`,
            String.raw`So $\mathbf w^*=\Phi^\top\mathbf a$ with $\mathbf a=(K+\lambda I_n)^{-1}\mathbf y$: the weight vector is a combination of the training feature vectors.`,
            String.raw`Predict: $f(\mathbf x)=\boldsymbol\phi(\mathbf x)^\top\mathbf w^*=\sum_i a_i\,\boldsymbol\phi(\mathbf x)^\top\boldsymbol\phi(\mathbf x_i)=\sum_i a_i\,k(\mathbf x_i,\mathbf x)$.`,
          ],
          notes: ['$p\\times p$ inverse', 'valid for any $\\lambda>0$', '$n$ dual coefficients', 'only kernel evaluations'],
        },
      },
    },
    {
      kind: 'mcq',
      prompt: String.raw`With $n=1{,}000$ training points and a kernel whose feature space is infinite-dimensional, what does kernel ridge regression actually solve?`,
      choices: [
        String.raw`A $1000\times1000$ linear system $(K+\lambda I)\mathbf a=\mathbf y$`,
        String.raw`An infinite system for the weights $\mathbf w$`,
        String.raw`A $p\times p$ system where $p$ is truncated to a large finite number`,
        'Nothing in closed form: it must use gradient descent',
      ],
      answer: 0,
      why: String.raw`The dual form needs only the $n\times n$ Gram matrix, so the cost is set by $n$, not by the feature dimension. The weights $\mathbf w=\Phi^\top\mathbf a$ are never formed; truncating features or iterating is unnecessary.`,
    },
    {
      kind: 'explain',
      title: 'The Gaussian kernel: infinitely many features',
      body: String.raw`The most used kernel is the **Gaussian** (RBF) kernel with length-scale $\ell$:
$$k(\mathbf x,\mathbf z)=\exp\!\Big(-\frac{\lVert\mathbf x-\mathbf z\rVert^2}{2\ell^2}\Big).$$
Write it as $e^{-\lVert\mathbf x\rVert^2/2\ell^2}\,e^{\mathbf x^\top\mathbf z/\ell^2}\,e^{-\lVert\mathbf z\rVert^2/2\ell^2}$ and expand the middle factor as a power series: it contains monomials of **every** degree, so its feature space is infinite-dimensional. Yet one evaluation costs $O(d)$.

Another view: put Gaussian bumps of width $s$ densely along the line, one weight each, with the same ridge penalty on every weight. In the limit the inner product of two such feature vectors is (up to a constant) a Gaussian kernel with $\ell=\sqrt2\,s$. The kernel is the limit of the RBF basis models you already know.`,
      widget: { type: 'MlLeastSquaresFit', props: { truth: 'sin', model: 'rbf', k: 12, kMax: 12, lambda: 0.01, showLambda: true, showBases: true }, caption: 'Many Gaussian bumps plus a ridge penalty: the finite version of a Gaussian-kernel model.' },
    },
    {
      kind: 'widget',
      title: 'What makes a valid kernel?',
      body: String.raw`Not every similarity function is an inner product. For points $\mathbf x_1,\dots,\mathbf x_n$ the Gram matrix $K$ of a true kernel is **positive semidefinite** (PSD): $\mathbf c^\top K\mathbf c=\lVert\sum_ic_i\boldsymbol\phi(\mathbf x_i)\rVert^2\ge0$ for every $\mathbf c$, so all its eigenvalues are $\ge0$.

The converse also holds: if $k$ is symmetric and **every** finite Gram matrix is PSD, then some feature map with $k=\boldsymbol\phi^\top\boldsymbol\phi$ exists (Mercer's theorem for continuous kernels; Moore–Aronszajn in general). Such $k$ are **Mercer** or positive-definite kernels.

Try each kernel below and read the eigenvalues. The "sigmoid" $\tanh(xz-1)$, inspired by neural networks, fails: at $x=0$ its diagonal entry is $\tanh(-1)<0$.`,
      widget: { type: 'MlKernelGram', props: { kernel: 'rbf' } },
    },
    {
      kind: 'truefalse',
      prompt: String.raw`$k(x,z)=\tanh(xz-1)$ on real numbers is a valid (positive semidefinite) kernel.`,
      answer: false,
      why: String.raw`A PSD matrix has non-negative diagonal entries, because $K_{ii}=\mathbf e_i^\top K\mathbf e_i\ge0$. Here $k(0,0)=\tanh(-1)\approx-0.76<0$, so the Gram matrix of any point set containing $0$ is not PSD and no feature map can produce it.`,
    },
    {
      kind: 'explain',
      title: 'Building new kernels from old',
      body: String.raw`You rarely prove PSD from scratch. If $k_1,k_2$ are kernels, so are:
- $k_1+k_2$ (concatenate the feature vectors) and $c\,k_1$ for $c>0$;
- $k_1k_2$ (features are all products of pairs of features);
- $g(\mathbf x)\,k_1(\mathbf x,\mathbf z)\,g(\mathbf z)$ for any function $g$;
- $\exp(k_1)$ (a power series with positive coefficients of products);
- $k_1(\boldsymbol\psi(\mathbf x),\boldsymbol\psi(\mathbf z))$ for any map $\boldsymbol\psi$.

**Example.** $\mathbf x^\top\mathbf z/\ell^2$ is a kernel, so $\exp(\mathbf x^\top\mathbf z/\ell^2)$ is too. Multiplying by $g(\mathbf x)g(\mathbf z)$ with $g(\mathbf x)=e^{-\lVert\mathbf x\rVert^2/2\ell^2}$ gives exactly the Gaussian kernel. Kernels also exist for strings, graphs and molecules, which have no natural vector form at all.`,
    },
    {
      kind: 'multi',
      prompt: String.raw`$k_1$ and $k_2$ are valid kernels. Which of these are **guaranteed** to be valid kernels? Select all that apply.`,
      choices: [String.raw`$k_1+k_2$`, String.raw`$k_1\,k_2$`, String.raw`$k_1-k_2$`, String.raw`$3\,k_1$`, String.raw`$\exp(k_1)$`, String.raw`$-k_1$`],
      answers: [0, 1, 3, 4],
      why: String.raw`Sums, products, positive multiples and $\exp$ preserve positive semidefiniteness. A difference can have negative eigenvalues (take $k_2=2k_1$), and $-k_1$ has a negative diagonal wherever $k_1(\mathbf x,\mathbf x)>0$.`,
    },
    {
      kind: 'order',
      prompt: 'Put the steps of kernel ridge regression in order.',
      steps: [
        String.raw`Choose a kernel $k$ (and its hyperparameters, e.g. $\ell$) and a penalty $\lambda$`,
        String.raw`Compute the Gram matrix $K_{ij}=k(\mathbf x_i,\mathbf x_j)$ on the training inputs`,
        String.raw`Solve $(K+\lambda I)\mathbf a=\mathbf y$ for the dual coefficients`,
        String.raw`Predict at a new input with $f(\mathbf x)=\sum_i a_i\,k(\mathbf x_i,\mathbf x)$`,
      ],
      why: String.raw`Everything is expressed through kernel evaluations: first on training pairs (to get $\mathbf a$), then between each training point and the query point. Hyperparameters must be fixed before $K$ can be computed.`,
    },
    {
      kind: 'match',
      prompt: 'Match each kernel to its feature space.',
      pairs: [
        [String.raw`$\mathbf x^\top\mathbf z$`, String.raw`The inputs themselves: $\boldsymbol\phi(\mathbf x)=\mathbf x$`],
        [String.raw`$(\mathbf x^\top\mathbf z)^2$`, 'All degree-2 monomials (cross terms weighted by √2)'],
        [String.raw`$(1+\mathbf x^\top\mathbf z)^k$`, String.raw`All monomials of degree $\le k$, with constant`],
        [String.raw`$\exp(-\lVert\mathbf x-\mathbf z\rVert^2/2\ell^2)$`, 'Infinite-dimensional: monomials of every degree'],
      ],
      why: String.raw`Expanding each kernel shows its features: the linear kernel is plain dot product; squaring gives pairwise products; adding $1$ before raising to the power brings in all lower degrees; the Gaussian's power series never ends.`,
    },
    {
      kind: 'fill',
      prompt: String.raw`The kernel trick replaces every inner product $\boldsymbol\phi(\mathbf x)^\top\boldsymbol\phi(\mathbf z)$ with ___ $k(\mathbf x,\mathbf z)$. A function $k$ is a valid kernel exactly when every Gram matrix it produces is symmetric and positive ___. The cost then scales with the number of ___ rather than the number of features.`,
      bank: ['a kernel evaluation', 'semidefinite', 'training points', 'a gradient', 'definite only on the diagonal', 'features', 'layers'],
      answer: ['a kernel evaluation', 'semidefinite', 'training points'],
      why: String.raw`Algorithms written in terms of inner products only ever touch $k$. Positive semidefiniteness of all Gram matrices is the Mercer condition. The dual system is $n\times n$, so cost is governed by the number of training points $n$ (typically $O(n^3)$ to solve, $O(n^2)$ memory).`,
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- A kernel is an inner product in feature space: $k(\mathbf x,\mathbf z)=\boldsymbol\phi(\mathbf x)^\top\boldsymbol\phi(\mathbf z)$, computed without forming $\boldsymbol\phi$.
- Any algorithm that uses data only through inner products can be **kernelized**: ridge regression becomes $\mathbf a=(K+\lambda I)^{-1}\mathbf y$, $f(\mathbf x)=\sum_ia_ik(\mathbf x_i,\mathbf x)$.
- Valid (Mercer) kernels are exactly those whose Gram matrices are always PSD. Sums, products and $\exp$ of kernels are kernels.
- The Gaussian kernel has an infinite-dimensional feature space yet costs $O(d)$ per evaluation.
- The price: $n\times n$ matrices. Next: [support vector machines](@ml/svms), [Gaussian processes](@ml/gaussian-processes) and the theory of [RKHS](@ml/rkhs).`,
    },
  ],
  references: [
    { authors: 'B. Schölkopf & A. J. Smola', title: 'Learning with Kernels: Support Vector Machines, Regularization, Optimization, and Beyond', year: 2002, venue: 'MIT Press', detail: 'Ch. 1–2 (kernels, positive definite kernels)' },
    { authors: 'C. M. Bishop', title: 'Pattern Recognition and Machine Learning', year: 2006, venue: 'Springer', detail: 'Ch. 6.1 (dual representations), 6.2 (constructing kernels)' },
    { authors: 'B. E. Boser, I. M. Guyon & V. N. Vapnik', title: 'A training algorithm for optimal margin classifiers', year: 1992, venue: 'Proceedings of the 5th Annual Workshop on Computational Learning Theory (COLT), 144–152' },
    { authors: 'J. Mercer', title: 'Functions of positive and negative type, and their connection with the theory of integral equations', year: 1909, venue: 'Philosophical Transactions of the Royal Society A 209, 415–446' },
  ],
} satisfies LessonContent;
