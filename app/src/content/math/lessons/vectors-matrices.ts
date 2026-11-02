import type { LessonContent } from '../../types';

export default {
  cards: [
    {
      kind: 'explain',
      title: 'Lists of numbers that mean something',
      body: String.raw`A **vector** is an ordered list of numbers. The list $\mathbf{v} = (3, 2)$ can be drawn as an **arrow** from the origin to the point 3 right, 2 up. Lists with $n$ entries live in $\mathbb{R}^n$ ("R-n", the set of all real $n$-tuples).

Vectors are everywhere, often with no arrow in sight:

- a position or velocity in space ([physical vectors](@physics/vectors-units)),
- a pixel's colour $(r, g, b)$,
- one row of a spreadsheet: (age, height, income),
- a word in a language model: a list of a few thousand numbers.

Linear algebra is the toolkit for all of them at once.`,
    },
    {
      kind: 'explain',
      title: 'Two operations: add and scale',
      body: String.raw`You may do exactly two things to vectors.

- **Add** entry by entry: $(1, 2) + (3, -1) = (4, 1)$. As arrows: put the second arrow's tail on the first arrow's tip (**tip-to-tail**).
- **Scale** by a number $c$ (a **scalar**): $2\,(3, 2) = (6, 4)$. The arrow gets twice as long; a negative $c$ also reverses it.

Combining both gives a **linear combination** $c_1\mathbf{v}_1 + c_2\mathbf{v}_2$. For example, every vector in the plane is a combination of $\mathbf{e}_1 = (1,0)$ and $\mathbf{e}_2 = (0,1)$: $(3,2) = 3\mathbf{e}_1 + 2\mathbf{e}_2$.`,
    },
    {
      kind: 'widget',
      title: 'Tip-to-tail',
      body: String.raw`Change the lengths and angles of $\mathbf{a}$ and $\mathbf{b}$. The sum $\mathbf{a}+\mathbf{b}$ is the diagonal of the parallelogram they span, and its components are just the sums of their components.`,
      widget: { type: 'VectorComponents', props: { mode: 'add', a: [3, 20], b: [2.5, 100] } },
    },
    {
      kind: 'numeric',
      prompt: String.raw`Let $\mathbf{u} = (3, 1)$ and $\mathbf{v} = (1, 4)$. What is the **second** entry of $2\mathbf{u} - \mathbf{v}$?`,
      answer: -2,
      why: String.raw`$2\mathbf{u} = (6, 2)$, then subtract $\mathbf{v}$ entry by entry: $(6-1,\ 2-4) = (5, -2)$. The usual slip is forgetting to double the second entry of $\mathbf{u}$, giving $1 - 4 = -3$.`,
    },
    {
      kind: 'explain',
      title: 'A matrix times a vector',
      body: String.raw`A **matrix** is a rectangular grid of numbers; an $m\times n$ matrix has $m$ rows and $n$ columns. Multiplying a matrix by a vector has a beautiful reading: **$A\mathbf{x}$ is a combination of the columns of $A$, with weights taken from $\mathbf{x}$.**

$$\begin{pmatrix}2&1\\1&3\end{pmatrix}\begin{pmatrix}1\\2\end{pmatrix} = 1\begin{pmatrix}2\\1\end{pmatrix} + 2\begin{pmatrix}1\\3\end{pmatrix} = \begin{pmatrix}4\\7\end{pmatrix}.$$

The same answer row by row: each output entry is a row of $A$ "dotted" with $\mathbf{x}$: $2\cdot1 + 1\cdot2 = 4$ and $1\cdot1 + 3\cdot2 = 7$. The column picture explains *meaning*; the row picture is quicker by hand.`,
    },
    {
      kind: 'mcq',
      prompt: String.raw`Compute $\begin{pmatrix}1&2\\0&-1\end{pmatrix}\begin{pmatrix}3\\1\end{pmatrix}$.`,
      choices: [String.raw`$(5, 1)$`, String.raw`$(3, -1)$`, String.raw`$(5, -1)$`, String.raw`$(4, -1)$`],
      answer: 2,
      why: String.raw`Column view: $3\,(1,0) + 1\,(2,-1) = (5, -1)$. Row view: $1\cdot3 + 2\cdot1 = 5$ and $0\cdot3 + (-1)\cdot1 = -1$. $(5,1)$ drops the minus sign; $(3,-1)$ forgets the $2\cdot 1$ term.`,
    },
    {
      kind: 'widget',
      title: 'A matrix moves the whole plane',
      body: String.raw`Think of $A$ as a machine that sends every point $\mathbf{x}$ to $A\mathbf{x}$. Watch the grid deform. The orange arrow is where $\mathbf{e}_1$ (written î) lands, the purple one where $\mathbf{e}_2$ (ĵ) lands — and they are exactly the **columns** of $A$, because $A\mathbf{e}_1$ picks out column 1. Try the presets: grid lines stay straight, parallel and evenly spaced, and the origin never moves.`,
      widget: { type: 'MathGridTransform', props: { a: 1, b: 1, c: 0, d: 1, showDet: false } },
    },
    {
      kind: 'explain',
      title: 'Multiplying matrices = doing one map after another',
      body: String.raw`If $B$ moves the plane and then $A$ moves it again, the combined machine is the product $AB$: $(AB)\mathbf{x} = A(B\mathbf{x})$. Note the order: **$AB$ means "first $B$, then $A$"**, like $f(g(x))$.

Entry rule: $(AB)_{ij}$ = (row $i$ of $A$) · (column $j$ of $B$). Shapes must match: $(m\times n)(n\times p)$ gives $m\times p$.

Order matters. With a shear $A = \begin{pmatrix}1&1\\0&1\end{pmatrix}$ and a quarter-turn $B = \begin{pmatrix}0&-1\\1&0\end{pmatrix}$:
$$AB = \begin{pmatrix}1&-1\\1&0\end{pmatrix},\qquad BA = \begin{pmatrix}0&-1\\1&1\end{pmatrix}.$$`,
    },
    {
      kind: 'truefalse',
      prompt: String.raw`For any two $2\times 2$ matrices, $AB = BA$.`,
      answer: false,
      why: String.raw`Matrix multiplication composes maps, and "shear then rotate" differs from "rotate then shear" — the example above gives different products. Some pairs do commute (e.g. any matrix with $I$, or two diagonal matrices), but not in general.`,
    },
    {
      kind: 'numeric',
      prompt: String.raw`Let $A = \begin{pmatrix}1&2\\3&4\end{pmatrix}$, $B = \begin{pmatrix}5&6\\7&8\end{pmatrix}$. Find the entry in row 2, column 1 of $AB$.`,
      answer: 43,
      why: String.raw`Row 2 of $A$ is $(3, 4)$; column 1 of $B$ is $(5, 7)$. Their dot product is $3\cdot5 + 4\cdot7 = 15 + 28 = 43$. A common slip is multiplying entry by entry ($3\cdot 7 = 21$); matrix products always pair a whole row with a whole column.`,
    },
    {
      kind: 'explain',
      title: 'Identity, inverse, transpose',
      body: String.raw`- The **identity** $I$ (1s on the diagonal, 0s elsewhere) does nothing: $I\mathbf{x} = \mathbf{x}$.
- The **inverse** $A^{-1}$ undoes $A$: $A^{-1}A = AA^{-1} = I$. For $2\times2$,
$$\begin{pmatrix}a&b\\c&d\end{pmatrix}^{-1} = \frac{1}{ad-bc}\begin{pmatrix}d&-b\\-c&a\end{pmatrix},$$
which exists only when $ad - bc \neq 0$ — the [determinant](@math/determinants). A matrix that squashes the plane flat cannot be undone.
- The **transpose** $A^\top$ swaps rows and columns: $(A^\top)_{ij} = A_{ji}$. A useful rule: $(AB)^\top = B^\top A^\top$, and likewise $(AB)^{-1} = B^{-1}A^{-1}$ (undo the last step first, like taking off socks after shoes).`,
    },
    {
      kind: 'explain',
      title: 'Linear systems: Ax = b',
      body: String.raw`The equations $x + 2y = 5$ and $3x - y = 1$ are one matrix equation:
$$\begin{pmatrix}1&2\\3&-1\end{pmatrix}\begin{pmatrix}x\\y\end{pmatrix} = \begin{pmatrix}5\\1\end{pmatrix}.$$

- **Row picture**: each equation is a line; the solution is where they cross.
- **Column picture**: find weights $x, y$ so that $x\,(1,3) + y\,(2,-1) = (5,1)$.

Both give $(x, y) = (1, 2)$: check $1 + 4 = 5$ and $3 - 2 = 1$. Solving $A\mathbf{x} = \mathbf{b}$ systematically (Gaussian elimination) is among the most-run algorithms in scientific computing.`,
    },
    {
      kind: 'match',
      prompt: 'Match each product to the shape of the result.',
      pairs: [
        [String.raw`$(2\times3)(3\times4)$`, String.raw`$2\times4$`],
        [String.raw`$(1\times3)(3\times1)$`, String.raw`$1\times1$ (a single number)`],
        [String.raw`$(3\times1)(1\times3)$`, String.raw`$3\times3$`],
        [String.raw`$(2\times2)(2\times1)$`, String.raw`$2\times1$ (a vector)`],
      ],
      why: String.raw`The inner sizes must agree and cancel; the outer sizes survive: $(m\times n)(n\times p) = m\times p$. A row times a column is one number (a dot product), while a column times a row is a full matrix (an "outer product").`,
    },
    {
      kind: 'multi',
      prompt: String.raw`$A$ is $2\times3$, $B$ is $3\times2$ and $C$ is $2\times2$. Which products are defined?`,
      choices: [String.raw`$AB$`, String.raw`$BA$`, String.raw`$AC$`, String.raw`$CA$`],
      answers: [0, 1, 3],
      why: String.raw`$AB$: $(2\times3)(3\times2)$ ✓ gives $2\times2$. $BA$: $(3\times2)(2\times3)$ ✓ gives $3\times3$. $CA$: $(2\times2)(2\times3)$ ✓. $AC$ fails: $A$ has 3 columns but $C$ has only 2 rows.`,
    },
    {
      kind: 'fill',
      prompt: String.raw`$A\mathbf{x}$ is a linear combination of the ___ of $A$. The product $AB$ applied to a vector means: apply ___ first.`,
      bank: ['columns', 'rows', String.raw`$B$`, String.raw`$A$`],
      answer: ['columns', String.raw`$B$`],
      why: String.raw`The weights in $\mathbf{x}$ multiply the columns of $A$. And $(AB)\mathbf{x} = A(B\mathbf{x})$: $B$ acts on $\mathbf{x}$ first, just as $g$ acts first in $f(g(x))$.`,
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- A vector in $\mathbb{R}^n$ is a list of $n$ numbers; you can add vectors and scale them.
- $A\mathbf{x}$ = combination of the columns of $A$ with weights $\mathbf{x}$; row-by-row it is a set of dot products.
- A matrix is a machine moving space; its columns are where $\mathbf{e}_1, \mathbf{e}_2, \dots$ land.
- $AB$ = "first $B$, then $A$"; generally $AB \neq BA$.
- $I$ does nothing, $A^{-1}$ undoes $A$ (if possible), $A^\top$ swaps rows and columns.

Next: what makes a map "linear", and why a matrix is just a record of [where the basis goes](@math/linear-maps).`,
    },
  ],
  references: [
    { authors: 'G. Strang', title: 'Introduction to Linear Algebra', year: 2016, venue: '5th ed., Wellesley-Cambridge Press', detail: 'Ch. 1 (vectors, dot products, matrices) and Ch. 2 (linear equations, matrix operations, inverses)' },
    { authors: 'G. Strang', title: '18.06 Linear Algebra (Spring 2010), MIT OpenCourseWare', year: 2010, detail: 'Lecture 1 (geometry of linear equations), Lecture 3 (multiplication and inverse matrices)', url: 'https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/' },
    { authors: '3Blue1Brown (G. Sanderson)', title: 'Essence of Linear Algebra (video series)', year: 2016, detail: 'Ch. 1–4: vectors, linear combinations, linear transformations, matrix multiplication as composition', url: 'https://www.3blue1brown.com/topics/linear-algebra' },
  ],
} satisfies LessonContent;
