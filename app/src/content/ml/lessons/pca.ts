import type { LessonContent } from '../../types';

export default {
  cards: [
    {
      kind: 'explain',
      title: 'Fewer numbers, same story',
      body: String.raw`A photo of a face has tens of thousands of pixel values, but faces vary in far fewer ways: lighting, pose, expression, identity. Much of the data lies close to a **low-dimensional** subspace.

**Principal component analysis (PCA)** finds that subspace when it is flat (linear). It looks for a few directions that capture most of the variation and describes each data point by its coordinates along them.

Uses: compressing data, plotting high-dimensional data in 2D, removing noise, and preprocessing before another model. Pearson (1901) introduced it as fitting "lines and planes of closest fit"; Hotelling (1933) gave the variance-maximizing version and the name.`,
    },
    {
      kind: 'recall',
      title: 'Eigenvectors and the SVD',
      points: [
        String.raw`An **eigenvector** $v\neq0$ of a square matrix $A$ satisfies $Av=\lambda v$: $A$ only stretches it, by the **eigenvalue** $\lambda$.`,
        String.raw`A **symmetric** matrix has real eigenvalues and an orthonormal basis of eigenvectors: $A=Q\Lambda Q^\top$ (spectral theorem).`,
        String.raw`Every matrix has a **singular value decomposition** $X=U\Sigma V^\top$, with orthonormal columns in $U,V$ and singular values $\sigma_1\ge\sigma_2\ge\dots\ge0$.`,
        String.raw`$X^\top X=V\Sigma^2V^\top$: the right singular vectors of $X$ are eigenvectors of $X^\top X$, with eigenvalues $\sigma_i^2$.`,
      ],
      link: 'math/eigenvalues',
    },
    {
      kind: 'explain',
      title: 'Projecting onto a direction',
      body: String.raw`Start by **centring** the data: subtract the mean so the cloud sits at the origin. Pick a unit vector $u$ ($\|u\|=1$). Each point $x_i$ has a **score** $z_i=u^\top x_i$ along $u$, and its projection onto the line is $z_i u$.

The variance of the scores is
$$\frac1n\sum_i (u^\top x_i)^2 = u^\top S\,u,\qquad S=\frac1n\sum_i x_i x_i^\top,$$
where $S$ is the $d\times d$ **sample covariance matrix** of the centred data. (Some texts divide by $n-1$; the directions are the same.)

PCA chooses $u$ to make $u^\top S u$ as large as possible: the direction along which the data are most spread out.`,
    },
    {
      kind: 'widget',
      title: 'Find the direction of maximum variance',
      body: String.raw`Blue points are the centred data; the orange line is a candidate direction $u$, with each point's projection on it. The right panel plots the projected variance $u^\top S u$ against the angle.

Drag the angle or press **Play** to sweep. The variance peaks at one angle; **Snap to PC1** jumps there. Notice that the **residual MSE** (mean squared length of the grey segments) is smallest at exactly the same angle. **Show PCs** draws the two eigenvectors of $S$.`,
      widget: { type: 'MlPCA', props: { tilt: 30, s1: 1, s2: 0.35, angle: 100 } },
    },
    {
      kind: 'explain',
      title: 'The answer is an eigenvector',
      body: String.raw`Maximize $u^\top S u$ subject to $u^\top u=1$. With a Lagrange multiplier $\lambda$, setting the gradient of $u^\top S u-\lambda(u^\top u-1)$ to zero gives
$$S u=\lambda u .$$
So $u$ must be an eigenvector of $S$, and then $u^\top S u=\lambda$. The best choice is the eigenvector with the **largest** eigenvalue $\lambda_1$: the **first principal component (PC1)**.

The second PC maximizes variance among directions orthogonal to PC1, which gives the eigenvector for $\lambda_2$, and so on. Since $S$ is symmetric, these directions are orthogonal and the eigenvalues are the variances along them.`,
    },
    {
      kind: 'numeric',
      prompt: String.raw`Centred 2D data have covariance $S=\begin{pmatrix}3&1\\1&3\end{pmatrix}$. What fraction of the total variance does PC1 explain? (3 decimals)`,
      answer: 0.667,
      tolerance: 0.002,
      why: String.raw`The eigenvalues are $3\pm1$, i.e. $4$ (eigenvector $(1,1)/\sqrt2$) and $2$ (eigenvector $(1,-1)/\sqrt2$). Total variance is the trace, $3+3=6=4+2$. PC1 explains $4/6\approx0.667$. Reading off a diagonal entry, $3/6=0.5$, misses the correlation that PC1 exploits.`,
    },
    {
      kind: 'explain',
      title: 'Max variance = min reconstruction error',
      body: String.raw`Pythagoras splits each centred point into a part along $u$ and a residual perpendicular to it:
$$\|x_i\|^2=(u^\top x_i)^2+\|x_i-(u^\top x_i)u\|^2 .$$
Averaging over points: total variance $=\ u^\top S u\ +$ mean squared residual. The total $\operatorname{tr}S$ is fixed, so **maximizing projected variance is the same as minimizing reconstruction error**. That was Pearson's "closest fit" view, and you saw it in the widget.

Keeping the top $m$ components, the mean squared reconstruction error is $\lambda_{m+1}+\dots+\lambda_d$, the sum of the discarded eigenvalues.

Below is a rounder cloud: the variance curve is much flatter ($\lambda_1$ is less than twice $\lambda_2$), and PC1 explains only about two-thirds of the variance. When eigenvalues are nearly equal, the PC directions are poorly determined and can swing a lot with a new sample.`,
      widget: { type: 'MlPCA', props: { tilt: -20, s1: 1, s2: 0.8, angle: 60, showPCs: true, seed: 5 }, caption: 'Variance + residual = total, at every angle.' },
    },
    {
      kind: 'recall',
      title: 'SVD',
      points: [
        String.raw`$X=U\Sigma V^\top$: rotate ($V^\top$), stretch ($\Sigma$), rotate ($U$).`,
        String.raw`Columns of $V$ are orthonormal directions in input space; $\sigma_1\ge\sigma_2\ge\cdots$.`,
        String.raw`The best rank-$m$ approximation of $X$ (Eckart–Young) keeps the top $m$ singular values.`,
      ],
      link: 'math/diagonalization-svd',
    },
    {
      kind: 'explain',
      title: 'Computing PCA with the SVD',
      body: String.raw`Stack the centred points as rows of an $n\times d$ matrix $X$. Then $S=\frac1n X^\top X$. With the SVD $X=U\Sigma V^\top$:
- the **principal directions** are the columns of $V$;
- the **variances** are $\lambda_j=\sigma_j^2/n$;
- the **scores** (new coordinates) are $Z=XV=U\Sigma$; keep the first $m$ columns to reduce to $m$ dimensions.

Libraries use the SVD rather than forming $X^\top X$, because squaring the matrix loses numerical precision. For very large data, randomized or iterative methods compute just the top few components.`,
    },
    {
      kind: 'mcq',
      prompt: String.raw`A centred data matrix $X$ with $n=100$ rows has singular values $\sigma_1=20$ and $\sigma_2=10$. What is the variance along PC1 (using $S=\frac1nX^\top X$)?`,
      choices: ['4', '20', '0.2', '400'],
      answer: 0,
      why: String.raw`$\lambda_1=\sigma_1^2/n=400/100=4$. The answer 400 forgets to divide by $n$; 20 is the singular value itself, not a variance; 0.2 divides $\sigma_1$ (not its square) by $n$.`,
    },
    {
      kind: 'truefalse',
      prompt: 'PCA gives the same principal directions whether a length feature is recorded in metres or in centimetres.',
      answer: false,
      why: String.raw`Changing units multiplies that feature's variance by $100^2$, so PC1 swings toward it. PCA is not scale-invariant. When features have different units, standardize them first; that is PCA on the **correlation** matrix.`,
    },
    {
      kind: 'fill',
      prompt: String.raw`PCA first ___ the data. The principal directions are the ___ of the covariance matrix, ordered by decreasing ___. Keeping $m$ components, the reconstruction error equals the sum of the ___ eigenvalues.`,
      bank: ['centres', 'eigenvectors', 'eigenvalue', 'discarded', 'standardizes', 'columns', 'kept', 'determinant'],
      answer: ['centres', 'eigenvectors', 'eigenvalue', 'discarded'],
      why: String.raw`Centring makes $S=\frac1nX^\top X$ a covariance. Its eigenvectors are the PCs, sorted by eigenvalue (variance). The discarded eigenvalues measure the variance thrown away, i.e. the reconstruction error. Standardizing is optional and depends on units.`,
    },
    {
      kind: 'multi',
      prompt: 'Which are real limitations of PCA?',
      choices: [
        'It can only find linear (flat) subspaces.',
        'Directions of large variance are not necessarily the ones that matter for a downstream label.',
        'Results depend on the scaling of the features.',
        'It can only be computed for 2D data.',
        'The principal directions it returns are generally not orthogonal.',
      ],
      answers: [0, 1, 2],
      why: String.raw`PCA projects onto flat subspaces, so curved structure such as a rolled-up sheet needs [manifold learning](@ml/manifold-learning). It ignores labels: a small-variance direction can carry all the class information. It is scale-dependent. It works in any dimension, and the eigenvectors of a symmetric $S$ can always be chosen orthonormal.`,
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- PCA finds orthogonal directions of maximum variance in **centred** data: the eigenvectors of the covariance $S$, ordered by eigenvalue.
- Each eigenvalue is the variance along its PC. Explained-variance ratio: $\lambda_j/\sum_k\lambda_k$.
- **Max projected variance = min squared reconstruction error** (Pearson's closest-fit view).
- Compute it with the SVD of the centred data: directions $V$, variances $\sigma_j^2/n$, scores $U\Sigma$.
- PCA is linear, label-blind and scale-dependent: standardize features with different units.`,
    },
  ],
  references: [
    { authors: 'K. Pearson', title: 'On lines and planes of closest fit to systems of points in space', year: 1901, venue: 'The London, Edinburgh, and Dublin Philosophical Magazine and Journal of Science, Series 6, 2(11), 559–572' },
    { authors: 'H. Hotelling', title: 'Analysis of a complex of statistical variables into principal components', year: 1933, venue: 'Journal of Educational Psychology 24(6), 417–441' },
    { authors: 'C. M. Bishop', title: 'Pattern Recognition and Machine Learning', year: 2006, venue: 'Springer', detail: 'Sec. 12.1' },
    { authors: 'I. T. Jolliffe', title: 'Principal Component Analysis', year: 2002, venue: '2nd ed., Springer' },
  ],
} satisfies LessonContent;
