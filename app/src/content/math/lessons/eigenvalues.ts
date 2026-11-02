import type { LessonContent } from '../../types';

export default {
  cards: [
    {
      kind: 'explain',
      title: 'Directions that survive',
      body: String.raw`Apply a matrix $A$ to a vector and it usually points somewhere new. But a few special directions come out pointing the **same way** (or exactly backwards), only stretched. These are **eigenvectors** (German *eigen*, "own"):

$$A\mathbf{v} = \lambda\,\mathbf{v},\qquad \mathbf{v} \ne \mathbf{0}.$$

The stretch factor $\lambda$ (lambda) is the **eigenvalue**. $\lambda = 2$ doubles $\mathbf{v}$; $\lambda = -1$ flips it; $\lambda = 0$ crushes it.

Eigen-things describe a matrix's "natural modes": vibration patterns of a bridge, the long-run state of a Markov chain, the stability of [differential equations](@math/ode-linear-systems), and the energy levels of quantum systems.`,
    },
    {
      kind: 'widget',
      title: 'Find the directions that only stretch',
      body: String.raw`$A = \begin{pmatrix}2&1\\1&2\end{pmatrix}$ morphs the unit circle into an ellipse. Most arrows turn. Arrows along the dashed lines only stretch: $(1,1)$ by $\lambda = 3$, $(1,-1)$ by $\lambda = 1$. Drag the entries and watch the special directions move.`,
      widget: { type: 'EigenStretch', props: { a: 2, b: 1, c: 1, d: 2 } },
    },
    {
      kind: 'explain',
      title: 'How to find eigenvalues',
      body: String.raw`Rewrite $A\mathbf{v} = \lambda\mathbf{v}$ as
$$(A - \lambda I)\,\mathbf{v} = \mathbf{0}.$$
We need a **nonzero** $\mathbf{v}$ in the kernel of $A - \lambda I$. From [determinants](@math/determinants): that happens exactly when $A - \lambda I$ squashes space, i.e.
$$\det(A - \lambda I) = 0.$$
This is the **characteristic equation**. For $A = \begin{pmatrix}a&b\\c&d\end{pmatrix}$ it is
$$\lambda^2 - (a + d)\,\lambda + (ad - bc) = 0,$$
a quadratic whose coefficients are the **trace** $a + d$ and the **determinant** $ad - bc$. An $n\times n$ matrix gives a degree-$n$ polynomial, so at most $n$ eigenvalues.`,
    },
    {
      kind: 'numeric',
      prompt: String.raw`Find the **larger** eigenvalue of $A = \begin{pmatrix}4&1\\2&3\end{pmatrix}$.`,
      answer: 5,
      why: String.raw`Trace $= 7$, determinant $= 12 - 2 = 10$. So $\lambda^2 - 7\lambda + 10 = (\lambda - 5)(\lambda - 2) = 0$, giving $\lambda = 5$ and $2$. The diagonal entries 4 and 3 are *not* the eigenvalues unless the matrix is triangular.`,
    },
    {
      kind: 'explain',
      title: 'Then find the eigenvectors',
      body: String.raw`For each eigenvalue, solve $(A - \lambda I)\mathbf{v} = \mathbf{0}$.

With $A = \begin{pmatrix}4&1\\2&3\end{pmatrix}$:

- $\lambda = 5$: $A - 5I = \begin{pmatrix}-1&1\\2&-2\end{pmatrix}$. The first row says $-v_1 + v_2 = 0$, so $\mathbf{v} = (1, 1)$. Check: $A(1,1) = (5, 5)$ ✓.
- $\lambda = 2$: $A - 2I = \begin{pmatrix}2&1\\2&1\end{pmatrix}$, so $2v_1 + v_2 = 0$ and $\mathbf{v} = (1, -2)$. Check: $A(1,-2) = (2, -4) = 2\,(1,-2)$ ✓.

Any nonzero multiple of an eigenvector is also one, so we really find eigen-*directions* (lines through the origin).`,
    },
    {
      kind: 'mcq',
      prompt: String.raw`Which vector is an eigenvector of $A = \begin{pmatrix}1&2\\2&1\end{pmatrix}$?`,
      choices: [String.raw`$(1, 0)$`, String.raw`$(1, 2)$`, String.raw`$(1, -1)$`, String.raw`$(2, 1)$`],
      answer: 2,
      why: String.raw`$A(1,-1) = (1 - 2,\ 2 - 1) = (-1, 1) = -1\cdot(1,-1)$, an eigenvector with $\lambda = -1$. The others turn: $A(1,0) = (1,2)$, $A(1,2) = (5,4)$, $A(2,1) = (4,5)$ — none is a multiple of the input.`,
    },
    {
      kind: 'explain',
      title: 'Trace and determinant check',
      body: String.raw`Two free sanity checks, true for every square matrix (counting repeated and complex eigenvalues):

$$\lambda_1 + \lambda_2 + \dots + \lambda_n = \operatorname{trace} A,\qquad \lambda_1\lambda_2\cdots\lambda_n = \det A.$$

For $\begin{pmatrix}4&1\\2&3\end{pmatrix}$: $5 + 2 = 7 = 4 + 3$ ✓ and $5\cdot 2 = 10 = \det A$ ✓.

So $\det A = 0$ exactly when $0$ is an eigenvalue — some direction is crushed. And for a **triangular** matrix the eigenvalues are simply the diagonal entries.`,
    },
    {
      kind: 'explain',
      title: 'When eigenvectors go missing',
      body: String.raw`Not every real matrix has real eigen-directions.

- **Rotation** by $90^\circ$, $\begin{pmatrix}0&-1\\1&0\end{pmatrix}$: every vector turns. The characteristic equation $\lambda^2 + 1 = 0$ has only the [complex](@math/complex-numbers) roots $\lambda = \pm i$. Complex eigenvalues signal rotation.
- **Shear** $\begin{pmatrix}1&1\\0&1\end{pmatrix}$: $(\lambda - 1)^2 = 0$, a repeated eigenvalue $1$, yet only **one** eigen-direction, the $x$-axis. Such a matrix is called **defective**.

The widget shows the shear. Then set $a = d = 0$, $b = -1$, $c = 1$ to see the rotation: the eigenvalue panel switches to complex.`,
      widget: { type: 'EigenStretch', props: { a: 1, b: 1, c: 0, d: 1 } },
    },
    {
      kind: 'truefalse',
      prompt: String.raw`Every real $2\times 2$ matrix has at least one real eigenvector.`,
      answer: false,
      why: String.raw`A rotation by $90^\circ$ turns every nonzero vector, and its eigenvalues $\pm i$ are not real. (Over the complex numbers, every square matrix does have at least one eigenvalue, because every polynomial has a complex root.)`,
    },
    {
      kind: 'explain',
      title: 'Why we care: powers',
      body: String.raw`If $A\mathbf{v} = \lambda\mathbf{v}$, then applying $A$ again and again just multiplies by $\lambda$ each time: $A^k\mathbf{v} = \lambda^k\mathbf{v}$.

If $\mathbf{x} = c_1\mathbf{v}_1 + c_2\mathbf{v}_2$ in an eigenvector basis, then
$$A^k\mathbf{x} = c_1\lambda_1^k\mathbf{v}_1 + c_2\lambda_2^k\mathbf{v}_2,$$
and the eigenvalue with the largest $|\lambda|$ eventually dominates.

Example: Fibonacci numbers obey $(F_{k+1}, F_k) = A\,(F_k, F_{k-1})$ with $A = \begin{pmatrix}1&1\\1&0\end{pmatrix}$. Its eigenvalues solve $\lambda^2 - \lambda - 1 = 0$: $\lambda = (1 \pm \sqrt5)/2 \approx 1.618,\ -0.618$. So $F_k$ grows like $1.618^k$ — the golden ratio.`,
    },
    {
      kind: 'numeric',
      prompt: String.raw`$A\mathbf{v} = 0.5\,\mathbf{v}$. Then $A^3\mathbf{v} = c\,\mathbf{v}$. What is $c$?`,
      answer: 0.125,
      why: String.raw`Each application multiplies by $0.5$: $c = 0.5^3 = 0.125$. Not $1.5$ ($3\times 0.5$) — powers of $A$ give powers of $\lambda$, not multiples.`,
    },
    {
      kind: 'multi',
      prompt: String.raw`A $2\times2$ matrix $A$ has eigenvalues $3$ and $-3$. Which statements are true?`,
      choices: [
        String.raw`$\det A = -9$`,
        String.raw`$\operatorname{trace} A = 0$`,
        String.raw`$A$ is not invertible`,
        String.raw`$A^2$ has eigenvalue $9$`,
        'Every nonzero vector is an eigenvector of A',
      ],
      answers: [0, 1, 3],
      why: String.raw`Product $3\cdot(-3) = -9$ and sum $0$. Since $0$ is not an eigenvalue, $A$ *is* invertible. Each eigenvector of $A$ is one for $A^2$ with $\lambda^2 = 9$. Only multiples of $I$ make every vector an eigenvector, and $A$ has two different eigenvalues.`,
    },
    {
      kind: 'order',
      prompt: String.raw`Order the steps to find all eigenpairs of a matrix $A$.`,
      steps: [
        String.raw`Form $A - \lambda I$ (subtract $\lambda$ from the diagonal).`,
        String.raw`Solve $\det(A - \lambda I) = 0$ for the eigenvalues $\lambda$.`,
        String.raw`For each $\lambda$, solve $(A - \lambda I)\mathbf{v} = \mathbf{0}$ for a nonzero $\mathbf{v}$.`,
        String.raw`Check $A\mathbf{v} = \lambda\mathbf{v}$ (and trace/determinant sums).`,
      ],
      why: 'You need each eigenvalue before you can find its eigenvector, because the matrix whose kernel you compute depends on λ. Checking at the end catches arithmetic slips.',
    },
    {
      kind: 'fill',
      prompt: String.raw`$\lambda$ is an eigenvalue of $A$ exactly when $A - \lambda I$ is ___, i.e. $\det(A - \lambda I) =$ ___. The eigenvalues add up to the ___ of $A$.`,
      bank: ['singular', 'invertible', '0', '1', 'trace', 'determinant'],
      answer: ['singular', '0', 'trace'],
      why: String.raw`A nonzero solution of $(A - \lambda I)\mathbf{v} = \mathbf{0}$ exists only if $A - \lambda I$ crushes a direction, i.e. is singular with determinant 0. The eigenvalues *multiply* to the determinant but *add* to the trace.`,
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- Eigenvector: $A\mathbf{v} = \lambda\mathbf{v}$, $\mathbf{v} \ne \mathbf{0}$ — a direction $A$ only stretches (by $\lambda$).
- Eigenvalues solve $\det(A - \lambda I) = 0$; for $2\times2$: $\lambda^2 - (\text{trace})\lambda + \det = 0$.
- Sum of eigenvalues = trace; product = determinant.
- Complex eigenvalues mean rotation; a repeated eigenvalue may have too few eigenvectors (defective).
- $A^k\mathbf{v} = \lambda^k\mathbf{v}$: eigenvalues control long-run behaviour.

Next: use a whole basis of eigenvectors to make a matrix diagonal — [diagonalisation and the SVD](@math/diagonalization-svd).`,
    },
  ],
  references: [
    { authors: 'G. Strang', title: 'Introduction to Linear Algebra', year: 2016, venue: '5th ed., Wellesley-Cambridge Press', detail: 'Ch. 6 (eigenvalues and eigenvectors)' },
    { authors: 'G. Strang', title: '18.06 Linear Algebra (Spring 2010), MIT OpenCourseWare', year: 2010, detail: 'Lecture 21 (eigenvalues and eigenvectors), Lecture 22 (diagonalization and powers of A)', url: 'https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/' },
    { authors: 'S. Axler', title: 'Linear Algebra Done Right', year: 2024, venue: '4th ed., Springer (open access)', detail: 'Ch. 5 (eigenvalues and eigenvectors; determinant-free approach)', url: 'https://linear.axler.net/' },
    { authors: '3Blue1Brown (G. Sanderson)', title: 'Eigenvectors and eigenvalues (Essence of Linear Algebra series)', year: 2016, url: 'https://www.3blue1brown.com/topics/linear-algebra' },
  ],
} satisfies LessonContent;
