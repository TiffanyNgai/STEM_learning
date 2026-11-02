import type { LessonContent } from '../../types';

export default {
  cards: [
    {
      kind: 'explain',
      title: 'One number to summarise a matrix',
      body: String.raw`A square matrix moves space around. Some maps blow areas up, some shrink them, some flip space like a mirror, and some squash it completely flat.

The **determinant** $\det A$ captures all of this in a single number:

- $|\det A|$ = the factor by which $A$ multiplies **areas** (in 2D) or **volumes** (in 3D);
- the **sign** says whether orientation is kept ($+$) or flipped like a mirror ($-$);
- $\det A = 0$ means space is **squashed** into a lower dimension, so $A$ cannot be undone.`,
    },
    {
      kind: 'widget',
      title: 'Watch the unit square',
      body: String.raw`The shaded unit square (area 1) becomes a parallelogram spanned by the columns of $A$, and *every* region's area is multiplied by the same factor $|\det A|$. The shear keeps area 1. Try **Stretch** (area ×1), then make $a = 2, d = 2$ (area ×4). **Reflect** turns the square red and mirrors the F: orientation flipped, det $< 0$. **Flatten** gives det $= 0$.`,
      widget: { type: 'MathGridTransform', props: { a: 1, b: 1, c: 0, d: 1 } },
    },
    {
      kind: 'explain',
      title: 'The 2×2 formula',
      body: String.raw`$$\det\begin{pmatrix}a&b\\c&d\end{pmatrix} = ad - bc.$$

Why? The unit square lands on the parallelogram with sides $(a, c)$ and $(b, d)$ — the columns. If $b = c = 0$ it is an $a\times d$ rectangle, area $ad$. Tilting the sides cuts off triangles whose net effect is to subtract $bc$. The result is a **signed** area: positive when going from column 1 to column 2 is an anticlockwise turn, as for $\mathbf{e}_1 \to \mathbf{e}_2$.

Example: $\det\begin{pmatrix}3&1\\1&2\end{pmatrix} = 6 - 1 = 5$, so every shape's area is multiplied by 5.`,
    },
    {
      kind: 'numeric',
      prompt: String.raw`Compute $\det\begin{pmatrix}4&2\\3&5\end{pmatrix}$.`,
      answer: 14,
      why: String.raw`$ad - bc = 4\cdot5 - 2\cdot3 = 20 - 6 = 14$. A frequent error is adding the two products ($20 + 6 = 26$); the off-diagonal product is always *subtracted*.`,
    },
    {
      kind: 'explain',
      title: 'Negative determinants flip orientation',
      body: String.raw`A mirror reflection such as $\begin{pmatrix}-1&0\\0&1\end{pmatrix}$ keeps areas but turns clockwise into anticlockwise; its determinant is $-1$. In the widget, the letter F appears backwards.

Rotations never flip anything: the rotation by angle $\theta$ is $\begin{pmatrix}\cos\theta&-\sin\theta\\\sin\theta&\cos\theta\end{pmatrix}$ with determinant $\cos^2\theta + \sin^2\theta = 1$.

In 3D, the sign tells right-handed from left-handed — exactly the distinction between a molecule and its mirror image ([chirality](@chem/stereochemistry)).`,
    },
    {
      kind: 'truefalse',
      prompt: String.raw`A rotation of the plane by $37^\circ$ has determinant $1$.`,
      answer: true,
      why: String.raw`Rotations keep areas and orientation. Algebraically $\det = \cos^2 37^\circ + \sin^2 37^\circ = 1$ for this (and every) angle.`,
    },
    {
      kind: 'explain',
      title: 'det = 0 means squashed flat',
      body: String.raw`If $\det A = 0$, the unit square becomes a parallelogram of zero area — a segment or a point. So:

- the columns are **linearly dependent** (they lie on one line);
- some nonzero $\mathbf{x}$ has $A\mathbf{x} = \mathbf{0}$ (the kernel is bigger than $\{\mathbf{0}\}$);
- $A$ has **no inverse**: once points are merged, nothing can separate them again. Such $A$ is called **singular**.

For square matrices these are all equivalent. Example: $\begin{pmatrix}1&2\\2&4\end{pmatrix}$ has $\det = 4 - 4 = 0$; its second column is twice the first.`,
    },
    {
      kind: 'mcq',
      prompt: String.raw`For which $k$ is $\begin{pmatrix}k&2\\3&6\end{pmatrix}$ singular (not invertible)?`,
      choices: [String.raw`$k = 0$`, String.raw`$k = 2$`, String.raw`$k = 1$`, String.raw`$k = 6$`],
      answer: 2,
      why: String.raw`Singular means $\det = 6k - 6 = 0$, so $k = 1$. Then the first column $(1,3)$ is half of the second $(2,6)$. With $k=0$ the determinant is $-6 \ne 0$, so that matrix is invertible even though it contains a zero.`,
    },
    {
      kind: 'explain',
      title: 'Products multiply',
      body: String.raw`Doing $B$ then $A$ scales areas by $\det B$ and then by $\det A$, so
$$\det(AB) = \det A\cdot\det B.$$

Consequences:
- $\det(A^{-1}) = 1/\det A$ (since $\det I = 1$);
- $\det(A^k) = (\det A)^k$;
- $\det(cA) = c^n\det A$ for an $n\times n$ matrix (every one of the $n$ directions is scaled by $c$);
- $\det(A^\top) = \det A$.

But beware: $\det(A + B)$ is **not** $\det A + \det B$ in general.`,
    },
    {
      kind: 'numeric',
      prompt: String.raw`$A$ and $B$ are $2\times2$ with $\det A = 3$ and $\det B = -2$. Compute $\det(2AB)$.`,
      answer: -24,
      why: String.raw`$\det(2AB) = 2^2\det A\det B = 4\cdot3\cdot(-2) = -24$. The trap is writing $2\cdot3\cdot(-2) = -12$: multiplying a $2\times2$ matrix by 2 doubles *both* directions, so area goes up by $2^2 = 4$.`,
    },
    {
      kind: 'explain',
      title: '3×3: volume of a slanted box',
      body: String.raw`For a $3\times3$ matrix, $|\det A|$ is the volume of the slanted box (parallelepiped) spanned by the three columns. One way to compute it is **cofactor expansion** along the first row:
$$\det\begin{pmatrix}a&b&c\\d&e&f\\g&h&i\end{pmatrix} = a(ei - fh) - b(di - fg) + c(dh - eg).$$
Each bracket is the $2\times2$ determinant left after deleting that entry's row and column; the signs alternate $+,-,+$.

Shortcut: for a **triangular** matrix (zeros below the diagonal) the determinant is the product of the diagonal entries.`,
    },
    {
      kind: 'widget',
      title: 'Cofactor expansion, step by step',
      widget: {
        type: 'StepReveal',
        props: {
          steps: [
            String.raw`$$A = \begin{pmatrix}1&2&3\\0&1&4\\5&6&0\end{pmatrix}$$`,
            String.raw`Entry $1$: delete row 1, column 1 → $\det\begin{pmatrix}1&4\\6&0\end{pmatrix} = 0 - 24 = -24$.`,
            String.raw`Entry $2$: delete row 1, column 2 → $\det\begin{pmatrix}0&4\\5&0\end{pmatrix} = 0 - 20 = -20$.`,
            String.raw`Entry $3$: delete row 1, column 3 → $\det\begin{pmatrix}0&1\\5&6\end{pmatrix} = 0 - 5 = -5$.`,
            String.raw`Combine with signs $+,-,+$: $\det A = 1(-24) - 2(-20) + 3(-5) = -24 + 40 - 15 = 1.$`,
          ],
          notes: ['', 'sign +', 'sign −', 'sign +', String.raw`$\det A = 1$: $A$ preserves volume, and $A^{-1}$ has integer entries.`],
        },
      },
    },
    {
      kind: 'numeric',
      prompt: String.raw`Compute $\det\begin{pmatrix}2&7&-1\\0&-3&4\\0&0&0.5\end{pmatrix}$.`,
      answer: -3,
      why: String.raw`The matrix is upper triangular, so the determinant is the product of the diagonal: $2\cdot(-3)\cdot 0.5 = -3$. The entries above the diagonal ($7, -1, 4$) don't matter — they are shears, which don't change volume.`,
    },
    {
      kind: 'multi',
      prompt: String.raw`For a square matrix $A$, which statements are equivalent to $\det A = 0$?`,
      choices: [
        'The columns of A are linearly dependent.',
        'A has no inverse.',
        String.raw`$A\mathbf{x} = \mathbf{0}$ has a solution $\mathbf{x} \ne \mathbf{0}$.`,
        'A has at least one entry equal to 0.',
        'A is the zero matrix.',
      ],
      answers: [0, 1, 2],
      why: String.raw`Zero volume ⇔ dependent columns ⇔ nontrivial kernel ⇔ not invertible. A zero entry proves nothing ($I$ is full of zeros and has $\det = 1$), and many nonzero matrices, like $\begin{pmatrix}1&2\\2&4\end{pmatrix}$, have determinant 0.`,
    },
    {
      kind: 'match',
      prompt: 'Match each matrix to its determinant.',
      pairs: [
        [String.raw`$\begin{pmatrix}1&5\\0&1\end{pmatrix}$ (shear)`, String.raw`$1$`],
        [String.raw`$\begin{pmatrix}1&0\\0&-1\end{pmatrix}$ (reflection)`, String.raw`$-1$`],
        [String.raw`$\begin{pmatrix}2&0\\0&3\end{pmatrix}$`, String.raw`$6$`],
        [String.raw`$\begin{pmatrix}1&2\\2&4\end{pmatrix}$`, String.raw`$0$`],
        [String.raw`$\begin{pmatrix}3&0\\0&-1\end{pmatrix}$`, String.raw`$-3$`],
      ],
      why: String.raw`Use $ad - bc$. Shears slide layers without changing area; reflections flip sign; diagonal matrices multiply their diagonal; dependent columns give 0.`,
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- $|\det A|$ is the area/volume scaling factor; the sign records orientation (mirror flip if negative).
- $2\times2$: $\det = ad - bc$. $3\times3$: cofactor expansion; triangular: product of the diagonal.
- $\det A = 0$ ⇔ squashed flat ⇔ dependent columns ⇔ non-trivial kernel ⇔ no inverse.
- $\det(AB) = \det A\det B$, $\det(A^{-1}) = 1/\det A$, $\det(cA) = c^n\det A$.

Next: $\det(A - \lambda I) = 0$ finds the special directions a matrix only stretches — [eigenvalues](@math/eigenvalues).`,
    },
  ],
  references: [
    { authors: 'G. Strang', title: 'Introduction to Linear Algebra', year: 2016, venue: '5th ed., Wellesley-Cambridge Press', detail: 'Ch. 5 (determinants: properties, cofactors, volumes)' },
    { authors: 'G. Strang', title: '18.06 Linear Algebra (Spring 2010), MIT OpenCourseWare', year: 2010, detail: 'Lecture 18 (properties of determinants), Lecture 19 (determinant formulas and cofactors)', url: 'https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/' },
    { authors: 'S. Axler', title: 'Linear Algebra Done Right', year: 2024, venue: '4th ed., Springer (open access)', detail: 'Ch. 9 (multilinear algebra and determinants)', url: 'https://linear.axler.net/' },
    { authors: '3Blue1Brown (G. Sanderson)', title: 'The determinant (Essence of Linear Algebra, Ch. 6)', year: 2016, url: 'https://www.3blue1brown.com/topics/linear-algebra' },
  ],
} satisfies LessonContent;
