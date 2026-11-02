import type { LessonContent } from '../../types';

export default {
  cards: [
    {
      kind: 'explain',
      title: 'What makes a map linear?',
      body: String.raw`A function $T$ from vectors to vectors (a **map**) is **linear** if it respects the two vector operations:

$$T(\mathbf{u} + \mathbf{v}) = T(\mathbf{u}) + T(\mathbf{v}),\qquad T(c\,\mathbf{v}) = c\,T(\mathbf{v}).$$

In pictures: grid lines stay straight, parallel and evenly spaced, and the origin stays put (take $c = 0$: $T(\mathbf{0}) = \mathbf{0}$).

Linear: rotations about the origin, stretches, shears, reflections, projections onto a line. **Not** linear: shifting everything by $(1, 0)$ (it moves the origin), or squaring entries ($T(2\mathbf{v}) = 4T(\mathbf{v})$, not $2T(\mathbf{v})$).`,
    },
    {
      kind: 'mcq',
      prompt: String.raw`Which map $T:\mathbb{R}^2\to\mathbb{R}^2$ is linear?`,
      choices: [
        String.raw`$T(x, y) = (x + 1,\ y)$`,
        String.raw`$T(x, y) = (2x - y,\ 3y)$`,
        String.raw`$T(x, y) = (xy,\ y)$`,
        String.raw`$T(x, y) = (x^2,\ y)$`,
      ],
      answer: 1,
      why: String.raw`Each output of $(2x - y, 3y)$ is a fixed combination of $x$ and $y$, so it is $A\mathbf{x}$ with $A = \begin{pmatrix}2&-1\\0&3\end{pmatrix}$. The shift sends $\mathbf{0}$ to $(1,0)$; $xy$ and $x^2$ fail scaling, since doubling the input quadruples them.`,
    },
    {
      kind: 'explain',
      title: 'Span: everything you can reach',
      body: String.raw`The **span** of vectors $\mathbf{v}_1, \dots, \mathbf{v}_k$ is the set of *all* their linear combinations $c_1\mathbf{v}_1 + \dots + c_k\mathbf{v}_k$.

In the plane:
- the span of one nonzero vector is a **line through the origin**;
- the span of two non-parallel vectors is the **whole plane**;
- the span of $(1,2)$ and $(2,4)$ is still only a line, because $(2,4) = 2\,(1,2)$ adds no new direction.

Spans always contain $\mathbf{0}$ (choose all $c_i = 0$) and are closed under adding and scaling — they are **subspaces**.`,
    },
    {
      kind: 'explain',
      title: 'Linear independence: no passengers',
      body: String.raw`Vectors are **linearly independent** if none of them is a combination of the others — each one adds a genuinely new direction. Precisely:

$$c_1\mathbf{v}_1 + \dots + c_k\mathbf{v}_k = \mathbf{0}\quad\Longrightarrow\quad c_1 = \dots = c_k = 0.$$

If some non-zero choice of $c$'s gives $\mathbf{0}$, they are **dependent**. Example: $2\,(1,2) - 1\,(2,4) = (0,0)$, so $(1,2), (2,4)$ are dependent. But $(1,0), (1,1)$ are independent: $c_1(1,0) + c_2(1,1) = (c_1 + c_2,\ c_2) = (0,0)$ forces $c_2 = 0$ and then $c_1 = 0$.`,
    },
    {
      kind: 'truefalse',
      prompt: String.raw`It is possible to find three linearly independent vectors in $\mathbb{R}^2$.`,
      answer: false,
      why: String.raw`Any two independent vectors in the plane already span all of $\mathbb{R}^2$, so a third is automatically a combination of them. In $\mathbb{R}^n$ you can have at most $n$ independent vectors.`,
    },
    {
      kind: 'explain',
      title: 'Bases and coordinates',
      body: String.raw`A **basis** of a space is a list of vectors that is independent *and* spans it. Then every vector can be written as a combination of the basis in **exactly one** way; the weights are its **coordinates**.

The standard basis of $\mathbb{R}^2$ is $\mathbf{e}_1 = (1,0), \mathbf{e}_2 = (0,1)$. But $\mathbf{b}_1 = (1,1), \mathbf{b}_2 = (1,-1)$ is a basis too, and in it
$$(3, 1) = 2\,\mathbf{b}_1 + 1\,\mathbf{b}_2,$$
so $(3,1)$ has coordinates $(2, 1)$ there. Every basis of a given space has the same number of vectors: the **dimension** ($\dim\mathbb{R}^n = n$).`,
    },
    {
      kind: 'numeric',
      prompt: String.raw`Write $(5, 1) = c_1(1, 1) + c_2(1, -1)$. What is $c_1$?`,
      answer: 3,
      why: String.raw`Matching entries: $c_1 + c_2 = 5$ and $c_1 - c_2 = 1$. Adding gives $2c_1 = 6$, so $c_1 = 3$ and $c_2 = 2$. Check: $3(1,1) + 2(1,-1) = (5, 1)$ ✓.`,
    },
    {
      kind: 'explain',
      title: 'A matrix = where the basis goes',
      body: String.raw`Here is the central fact. Every vector is $\mathbf{x} = x\,\mathbf{e}_1 + y\,\mathbf{e}_2$, so by linearity
$$T(\mathbf{x}) = x\,T(\mathbf{e}_1) + y\,T(\mathbf{e}_2).$$
Once you know where the basis vectors land, you know $T$ **everywhere**. Write those images as the columns of a matrix:
$$A = \Big(\,T(\mathbf{e}_1)\ \Big|\ T(\mathbf{e}_2)\,\Big),\qquad T(\mathbf{x}) = A\mathbf{x}.$$

Example: rotation by $90^\circ$ anticlockwise sends $\mathbf{e}_1 \mapsto (0,1)$ and $\mathbf{e}_2 \mapsto (-1,0)$, so $A = \begin{pmatrix}0&-1\\1&0\end{pmatrix}$. Every linear map between $\mathbb{R}^n$'s is a matrix, and every matrix is a linear map.`,
    },
    {
      kind: 'widget',
      title: 'Read the matrix off the picture',
      body: String.raw`This is the $90^\circ$ rotation. Follow the orange (î) and purple (ĵ) arrows: their tips are the columns $(0,1)$ and $(-1,0)$. Now press **Shear** or **Stretch**, or drag the entries, and predict where î and ĵ will land before you press play.`,
      widget: { type: 'MathGridTransform', props: { a: 0, b: -1, c: 1, d: 0, showDet: false } },
    },
    {
      kind: 'mcq',
      prompt: String.raw`What is the matrix of reflection across the line $y = x$?`,
      choices: [
        String.raw`$\begin{pmatrix}1&0\\0&-1\end{pmatrix}$`,
        String.raw`$\begin{pmatrix}-1&0\\0&-1\end{pmatrix}$`,
        String.raw`$\begin{pmatrix}0&1\\1&0\end{pmatrix}$`,
        String.raw`$\begin{pmatrix}0&-1\\1&0\end{pmatrix}$`,
      ],
      answer: 2,
      why: String.raw`Mirroring in $y = x$ swaps the coordinates: $\mathbf{e}_1 = (1,0) \mapsto (0,1)$ and $\mathbf{e}_2 \mapsto (1,0)$. These are the columns. $\begin{pmatrix}1&0\\0&-1\end{pmatrix}$ reflects across the $x$-axis, $-I$ rotates by $180^\circ$, and $\begin{pmatrix}0&-1\\1&0\end{pmatrix}$ rotates by $90^\circ$.`,
    },
    {
      kind: 'explain',
      title: 'Kernel, image and rank',
      body: String.raw`Two subspaces describe what a matrix $A$ (with $n$ columns) does:

- the **image** (column space): all outputs $A\mathbf{x}$ — the span of the columns. Its dimension is the **rank**;
- the **kernel** (null space): all inputs with $A\mathbf{x} = \mathbf{0}$ — what gets crushed.

**Rank–nullity theorem:** $\dim(\text{kernel}) + \text{rank} = n$. Dimensions you lose are exactly the dimensions you crush.

Example: $A = \begin{pmatrix}1&2\\2&4\end{pmatrix}$. Both columns lie on the line through $(1,2)$, so rank $= 1$. The kernel is the line through $(2,-1)$ (check: $1\cdot2 + 2\cdot(-1) = 0$ and $2\cdot2 + 4\cdot(-1) = 0$). And $1 + 1 = 2$ ✓. A map is one-to-one ([injective](@math/sets-functions)) exactly when its kernel is just $\{\mathbf{0}\}$.`,
    },
    {
      kind: 'widget',
      title: 'Crushing a dimension',
      body: String.raw`This is $\begin{pmatrix}1&2\\2&4\end{pmatrix}$. Press play: the whole grid collapses onto the line through $(1,2)$ — that line is the image. The points on the line through $(2,-1)$ all land on the origin — that line is the kernel. Notice the shaded square flattening to zero area.`,
      widget: { type: 'MathGridTransform', props: { a: 1, b: 2, c: 2, d: 4, range: 4, presets: false } },
    },
    {
      kind: 'numeric',
      prompt: String.raw`A $3\times 5$ matrix has rank $3$. What is the dimension of its kernel?`,
      answer: 2,
      why: String.raw`The matrix maps $\mathbb{R}^5 \to \mathbb{R}^3$; it has $n = 5$ columns. Rank–nullity: $\dim\ker = 5 - 3 = 2$. A common mistake is to subtract from the number of *rows* (3), which gives 0.`,
    },
    {
      kind: 'match',
      prompt: 'Match each term to its meaning.',
      pairs: [
        ['Span', 'All linear combinations of the given vectors'],
        ['Linearly independent', 'Only the all-zero combination gives the zero vector'],
        ['Basis', 'An independent list that spans the space'],
        ['Kernel', String.raw`All $\mathbf{x}$ with $A\mathbf{x} = \mathbf{0}$`],
        ['Rank', 'Dimension of the column space (image)'],
      ],
      why: 'Span is about reach, independence is about having no redundancy, and a basis has both. Kernel and image are the "crushed" inputs and the reachable outputs; rank measures the image.',
    },
    {
      kind: 'order',
      prompt: String.raw`Order the steps to find the matrix of a linear map $T:\mathbb{R}^n\to\mathbb{R}^m$.`,
      steps: [
        String.raw`Take the standard basis vectors $\mathbf{e}_1, \dots, \mathbf{e}_n$.`,
        String.raw`Compute each image $T(\mathbf{e}_j)$.`,
        String.raw`Write $T(\mathbf{e}_j)$ as column $j$ of an $m\times n$ matrix $A$.`,
        String.raw`For any $\mathbf{x}$, compute $T(\mathbf{x}) = A\mathbf{x}$.`,
      ],
      why: String.raw`Linearity means the images of the basis determine everything, so you compute those first, store them as columns, and only then can you multiply. The matrix has $m$ rows because each image lives in $\mathbb{R}^m$.`,
    },
    {
      kind: 'fill',
      prompt: String.raw`The columns of a matrix are the images of the ___ vectors. The dimension of the image is called the ___, and it plus the dimension of the ___ equals the number of columns.`,
      bank: ['basis', 'eigen', 'rank', 'trace', 'kernel', 'determinant'],
      answer: ['basis', 'rank', 'kernel'],
      why: String.raw`Column $j$ is $A\mathbf{e}_j$. Rank–nullity says rank $+ \dim\ker = n$. Trace and determinant are single numbers, not dimensions.`,
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- Linear means $T(\mathbf{u}+\mathbf{v}) = T\mathbf{u} + T\mathbf{v}$ and $T(c\mathbf{v}) = cT\mathbf{v}$: straight, evenly spaced grids, fixed origin.
- Span = everything reachable; independent = no redundancy; basis = both; dimension = size of any basis.
- A linear map is pinned down by where the basis goes; those images are the columns of its matrix.
- Kernel (crushed inputs) and image (reachable outputs) satisfy rank–nullity: $\dim\ker + \text{rank} = n$.

Next: a single number that measures how much a map squashes — the [determinant](@math/determinants).`,
    },
  ],
  references: [
    { authors: 'S. Axler', title: 'Linear Algebra Done Right', year: 2024, venue: '4th ed., Springer (open access)', detail: 'Ch. 2 (span, linear independence, bases, dimension), Ch. 3A–3C (linear maps, null spaces and ranges, matrices)', url: 'https://linear.axler.net/' },
    { authors: 'G. Strang', title: 'Introduction to Linear Algebra', year: 2016, venue: '5th ed., Wellesley-Cambridge Press', detail: 'Ch. 3 (vector spaces and subspaces), Ch. 8 (linear transformations)' },
    { authors: 'G. Strang', title: '18.06 Linear Algebra (Spring 2010), MIT OpenCourseWare', year: 2010, detail: 'Lecture 9 (independence, basis and dimension), Lecture 30 (linear transformations and their matrices)', url: 'https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/' },
    { authors: '3Blue1Brown (G. Sanderson)', title: 'Linear transformations and matrices (Essence of Linear Algebra, Ch. 3)', year: 2016, url: 'https://www.3blue1brown.com/topics/linear-algebra' },
  ],
} satisfies LessonContent;
