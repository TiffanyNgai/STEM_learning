import type { LessonContent } from '../../types';

export default {
  cards: [
    {
      kind: 'explain',
      title: 'Find the right point of view',
      body: String.raw`A diagonal matrix such as $\begin{pmatrix}5&0\\0&2\end{pmatrix}$ is as simple as matrices get: it stretches the $x$-axis by 5 and the $y$-axis by 2, independently. Its powers are trivial: $\begin{pmatrix}5^k&0\\0&2^k\end{pmatrix}$.

Most matrices are not diagonal *in the standard basis*. The big idea of this lesson: **choose a better basis** and almost any matrix becomes diagonal — and with the singular value decomposition, *every* matrix becomes "rotate, stretch along axes, rotate".`,
    },
    {
      kind: 'explain',
      title: 'Diagonalisation: A = PDP⁻¹',
      body: String.raw`Suppose $A$ ($n\times n$) has $n$ independent eigenvectors $\mathbf{v}_1, \dots, \mathbf{v}_n$ with eigenvalues $\lambda_1, \dots, \lambda_n$. Put the eigenvectors as columns of $P$ and the eigenvalues on the diagonal of $D$. Then $AP = PD$, so
$$A = P\,D\,P^{-1}.$$
Read it right to left: $P^{-1}$ converts to eigen-coordinates, $D$ stretches each eigen-axis, $P$ converts back.

Example: $A = \begin{pmatrix}4&1\\2&3\end{pmatrix}$ has $\lambda = 5, 2$ with eigenvectors $(1,1), (1,-2)$, so $P = \begin{pmatrix}1&1\\1&-2\end{pmatrix}$, $D = \begin{pmatrix}5&0\\0&2\end{pmatrix}$. Check: $AP = \begin{pmatrix}5&2\\5&-4\end{pmatrix} = PD$ ✓.`,
    },
    {
      kind: 'explain',
      title: 'Powers become easy — when it works',
      body: String.raw`The middle factors cancel in products: $A^2 = PDP^{-1}PDP^{-1} = PD^2P^{-1}$, and in general
$$A^k = P\,D^k\,P^{-1},\qquad e^{At} = P\,e^{Dt}\,P^{-1}.$$
This is how [linear ODE systems](@math/ode-linear-systems) and Markov chains are solved.

Diagonalisation **needs $n$ independent eigenvectors**. Distinct eigenvalues guarantee this. It fails for defective matrices such as the shear $\begin{pmatrix}1&1\\0&1\end{pmatrix}$ (only one eigen-direction). Rotations can be diagonalised only with complex numbers.`,
    },
    {
      kind: 'numeric',
      prompt: String.raw`$A = PDP^{-1}$ with $D = \begin{pmatrix}2&0\\0&-1\end{pmatrix}$. What is the trace of $A^4$?`,
      answer: 17,
      why: String.raw`$A^4 = PD^4P^{-1}$ has eigenvalues $2^4 = 16$ and $(-1)^4 = 1$, and the trace is the sum of eigenvalues: $17$. The trace of $A$ itself is $1$, but $1^4 = 1$ is not the answer — you must raise each eigenvalue to the 4th power before adding.`,
    },
    {
      kind: 'explain',
      title: 'The spectral theorem',
      body: String.raw`Symmetric matrices ($A^\top = A$) are especially well behaved. The **spectral theorem** says that a real symmetric matrix

- has only **real** eigenvalues, and
- has an **orthonormal** basis of eigenvectors,

so $A = Q\,\Lambda\,Q^\top$ with $Q$ orthogonal ($Q^{-1} = Q^\top$) and $\Lambda$ (capital lambda) diagonal. Geometrically: $A$ stretches space along **perpendicular** axes.

Example: $\begin{pmatrix}2&1\\1&2\end{pmatrix}$ has $\lambda = 3, 1$ with eigenvectors $\tfrac{1}{\sqrt2}(1,1)$ and $\tfrac{1}{\sqrt2}(1,-1)$ — at right angles. Covariance matrices, Hessians, and quantum observables (Hermitian, the complex version) all enjoy this; it generalises to [operators](@math/operators-spectral).`,
    },
    {
      kind: 'widget',
      title: 'Symmetric = perpendicular stretch axes',
      body: String.raw`With $b = c$ the two dashed eigen-lines are always perpendicular. Now make the matrix non-symmetric (e.g. $c = 0$): the eigen-directions tilt towards each other and may even disappear.`,
      widget: { type: 'EigenStretch', props: { a: 2, b: 1, c: 1, d: 2 } },
    },
    {
      kind: 'truefalse',
      prompt: String.raw`Every real symmetric matrix can be written as $Q\Lambda Q^\top$ with $Q$ orthogonal and $\Lambda$ real diagonal — even if it has repeated eigenvalues.`,
      answer: true,
      why: String.raw`That is the spectral theorem, with no exceptions for symmetric matrices. Repeated eigenvalues are fine: e.g. $I = I\,I\,I^\top$, and any orthonormal basis of eigenvectors works. Defectiveness, as for the shear, can only happen for non-symmetric matrices.`,
    },
    {
      kind: 'explain',
      title: 'SVD: every matrix is rotate–stretch–rotate',
      body: String.raw`What about non-symmetric, or even non-square, matrices? The **singular value decomposition** works for **every** $m\times n$ matrix:
$$A = U\,\Sigma\,V^\top.$$

- $V$ ($n\times n$) and $U$ ($m\times m$) are orthogonal: rotations (possibly with a reflection).
- $\Sigma$ is diagonal with the **singular values** $\sigma_1 \ge \sigma_2 \ge \dots \ge 0$.

Picture: $A$ maps the unit circle (sphere) to an **ellipse** (ellipsoid). The $\sigma_i$ are its semi-axis lengths, the columns $\mathbf{u}_i$ of $U$ point along those axes, and the columns $\mathbf{v}_i$ of $V$ are the inputs that land there: $A\mathbf{v}_i = \sigma_i\mathbf{u}_i$.`,
    },
    {
      kind: 'widget',
      title: 'Watch the three steps',
      body: String.raw`The shear $\begin{pmatrix}1&1\\0&1\end{pmatrix}$, which has *no* eigenvector basis, still has an SVD. Press play: $V^\top$ turns the orange and purple vectors $\mathbf{v}_1, \mathbf{v}_2$ onto the axes, $\Sigma$ stretches by $\sigma_1 \approx 1.618$ and $\sigma_2 \approx 0.618$ (the golden ratio and its reciprocal), and $U$ turns the ellipse into place. Try a matrix with negative determinant to see the extra flip.`,
      widget: { type: 'MathSVD', props: { a: 1, b: 1, c: 0, d: 1 } },
    },
    {
      kind: 'explain',
      title: 'Computing the SVD',
      body: String.raw`The trick: $A^\top A$ is symmetric with non-negative eigenvalues, because $A^\top A = V\Sigma^\top\Sigma V^\top$.

1. The eigenvalues of $A^\top A$ are $\sigma_i^2$; its orthonormal eigenvectors are the $\mathbf{v}_i$.
2. Then $\mathbf{u}_i = A\mathbf{v}_i/\sigma_i$ for each $\sigma_i > 0$.

Example: $A = \begin{pmatrix}3&0\\4&5\end{pmatrix}$. Then $A^\top A = \begin{pmatrix}25&20\\20&25\end{pmatrix}$ with eigenvalues $45$ and $5$, so $\sigma_1 = \sqrt{45} \approx 6.71$ and $\sigma_2 = \sqrt5 \approx 2.24$. Check: $\sigma_1\sigma_2 = \sqrt{225} = 15 = |\det A|$ ✓. (In practice software uses more stable algorithms that avoid forming $A^\top A$.)`,
    },
    {
      kind: 'numeric',
      prompt: String.raw`What is the **largest** singular value of $A = \begin{pmatrix}2&0\\0&-3\end{pmatrix}$?`,
      answer: 3,
      why: String.raw`$A^\top A = \begin{pmatrix}4&0\\0&9\end{pmatrix}$, so the singular values are $\sqrt9 = 3$ and $\sqrt4 = 2$. Singular values are never negative: the sign of $-3$ is absorbed into a reflection in $U$. Answering $2$ (the larger eigenvalue) confuses eigenvalues with singular values.`,
    },
    {
      kind: 'explain',
      title: 'Keeping only what matters',
      body: String.raw`The SVD writes $A$ as a sum of rank-one pieces, ordered by importance:
$$A = \sigma_1\mathbf{u}_1\mathbf{v}_1^\top + \sigma_2\mathbf{u}_2\mathbf{v}_2^\top + \cdots + \sigma_r\mathbf{u}_r\mathbf{v}_r^\top,$$
where $r$ = rank = number of nonzero $\sigma$'s. Keeping only the first $k$ terms gives the **best** rank-$k$ approximation of $A$ (in the least-squares sense) — the **Eckart–Young theorem** (1936).

Uses: compressing images, denoising data, principal component analysis, recommender systems, and low-rank fine-tuning of neural networks. An $m\times n$ image stored as $k$ terms needs only $k(m + n + 1)$ numbers.`,
    },
    {
      kind: 'mcq',
      prompt: String.raw`A greyscale image is a $100\times 80$ matrix. How many numbers are needed to store its rank-10 SVD approximation (10 values $\sigma_i$, plus their $\mathbf{u}_i$ and $\mathbf{v}_i$)?`,
      choices: ['8000', '1800', '1810', '18 000'],
      answer: 2,
      why: String.raw`Each term needs $\sigma_i$ (1 number), $\mathbf{u}_i$ (100) and $\mathbf{v}_i$ (80): $181$ numbers. Ten terms: $1810$, versus $8000$ for the full image. Forgetting the $\sigma$'s gives 1800.`,
    },
    {
      kind: 'match',
      prompt: 'Match each factorisation to when it exists.',
      pairs: [
        [String.raw`$A = PDP^{-1}$`, String.raw`$A$ has $n$ independent eigenvectors`],
        [String.raw`$A = Q\Lambda Q^\top$`, String.raw`$A$ is real symmetric`],
        [String.raw`$A = U\Sigma V^\top$`, 'Always (any m×n matrix)'],
        [String.raw`$A = QR$`, String.raw`$A$ has independent columns (Gram–Schmidt)`],
      ],
      why: String.raw`Diagonalisation needs an eigenvector basis; the orthogonal version needs symmetry; the SVD has no conditions at all. QR comes from [Gram–Schmidt](@math/inner-products-orthogonality) on the columns.`,
    },
    {
      kind: 'multi',
      prompt: String.raw`For a real square matrix $A$ with SVD $U\Sigma V^\top$, which statements are always true?`,
      choices: [
        'All singular values are ≥ 0.',
        String.raw`$|\det A| = \sigma_1\sigma_2\cdots\sigma_n$.`,
        'The singular values equal the absolute values of the eigenvalues.',
        'The number of nonzero singular values equals the rank of A.',
        String.raw`$U = V$.`,
      ],
      answers: [0, 1, 3],
      why: String.raw`$\det A = \det U\det\Sigma\det V^\top = \pm\prod\sigma_i$, and nonzero $\sigma$'s count the independent directions. Singular values match $|\lambda|$ only for special (normal, e.g. symmetric) matrices: the shear has eigenvalues $1, 1$ but singular values $1.618, 0.618$. $U = V$ only in special cases such as symmetric positive semidefinite $A$.`,
    },
    {
      kind: 'fill',
      prompt: String.raw`To find the singular values of $A$, compute the eigenvalues of ___ and take their ___.`,
      bank: [String.raw`$A^\top A$`, String.raw`$A + A^\top$`, 'square roots', 'squares', 'reciprocals'],
      answer: [String.raw`$A^\top A$`, 'square roots'],
      why: String.raw`$A^\top A = V\Sigma^2V^\top$, so its eigenvalues are $\sigma_i^2$, and $\sigma_i$ is the square root. $A + A^\top$ is symmetric too, but its eigenvalues are unrelated to the singular values.`,
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- With $n$ independent eigenvectors: $A = PDP^{-1}$, so $A^k = PD^kP^{-1}$.
- Spectral theorem: symmetric $A = Q\Lambda Q^\top$ — real eigenvalues, perpendicular eigenvectors.
- SVD: **every** matrix is $U\Sigma V^\top$ — rotate, stretch by $\sigma_1 \ge \sigma_2 \ge \dots \ge 0$, rotate. Unit sphere → ellipsoid.
- $\sigma_i^2$ = eigenvalues of $A^\top A$; rank = number of nonzero $\sigma_i$.
- Truncating the SVD gives the best low-rank approximation (Eckart–Young).`,
    },
  ],
  references: [
    { authors: 'G. Strang', title: 'Introduction to Linear Algebra', year: 2016, venue: '5th ed., Wellesley-Cambridge Press', detail: 'Ch. 6 (diagonalising a matrix, symmetric matrices), Ch. 7 (the singular value decomposition)' },
    { authors: 'L. N. Trefethen, D. Bau III', title: 'Numerical Linear Algebra', year: 1997, venue: 'SIAM', detail: 'Lectures 4–5 (the SVD and its geometry, low-rank approximation)' },
    { authors: 'S. Axler', title: 'Linear Algebra Done Right', year: 2024, venue: '4th ed., Springer (open access)', detail: 'Ch. 5D (diagonalisable operators), Ch. 7 (spectral theorem, singular value decomposition)', url: 'https://linear.axler.net/' },
    { authors: 'G. Strang', title: '18.06 Linear Algebra (Spring 2010), MIT OpenCourseWare', year: 2010, detail: 'Lecture 22 (diagonalization and powers of A), Lecture 25 (symmetric matrices), Lecture 29 (singular value decomposition)', url: 'https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/' },
    { authors: 'C. Eckart, G. Young', title: 'The approximation of one matrix by another of lower rank', year: 1936, venue: 'Psychometrika 1(3), 211–218' },
  ],
} satisfies LessonContent;
