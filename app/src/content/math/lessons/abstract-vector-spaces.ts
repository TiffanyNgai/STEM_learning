import type { LessonContent } from '../../types';

export default {
  cards: [
    {
      kind: 'explain',
      title: 'Arrows are not the point',
      body: String.raw`Polynomials can be added and multiplied by numbers: $(1 + x^2) + 2(x - x^2) = 1 + 2x - x^2$. So can functions, sound signals, $2\times2$ matrices, and quantum states. And in each case the same rules hold as for arrows.

Mathematicians abstract this: a **vector** is *anything* you can add and scale, provided the familiar rules hold. Everything we proved about spans, bases, dimension and linear maps then applies **for free** — to functions as much as to arrows. This is the bridge to Fourier analysis, quantum mechanics and functional analysis.`,
    },
    {
      kind: 'explain',
      title: 'The definition',
      body: String.raw`A **vector space** over the real numbers is a set $V$ with an addition $\mathbf{u} + \mathbf{v}$ and a scalar multiplication $c\,\mathbf{v}$ (both landing back in $V$) such that, for all vectors $\mathbf{u}, \mathbf{v}, \mathbf{w}$ and numbers $a, b$:

- $\mathbf{u} + \mathbf{v} = \mathbf{v} + \mathbf{u}$ and $(\mathbf{u} + \mathbf{v}) + \mathbf{w} = \mathbf{u} + (\mathbf{v} + \mathbf{w})$;
- there is a **zero vector** with $\mathbf{v} + \mathbf{0} = \mathbf{v}$, and each $\mathbf{v}$ has a **negative** $-\mathbf{v}$ with $\mathbf{v} + (-\mathbf{v}) = \mathbf{0}$;
- $1\mathbf{v} = \mathbf{v}$ and $a(b\mathbf{v}) = (ab)\mathbf{v}$;
- $a(\mathbf{u} + \mathbf{v}) = a\mathbf{u} + a\mathbf{v}$ and $(a + b)\mathbf{v} = a\mathbf{v} + b\mathbf{v}$.

Replace "real numbers" by complex numbers and you get a complex vector space — the setting of quantum mechanics.`,
    },
    {
      kind: 'explain',
      title: 'A zoo of vector spaces',
      body: String.raw`- $\mathbb{R}^n$, the original.
- $\mathcal{P}_n$: polynomials of degree at most $n$, e.g. $3 - x + 4x^2 \in \mathcal{P}_2$.
- $C[a, b]$: continuous functions on an interval; the zero vector is the function that is $0$ everywhere.
- $m\times n$ matrices, added entry by entry.
- All solutions of $y'' + y = 0$: if $y_1, y_2$ solve it, so does $c_1y_1 + c_2y_2$ (**superposition**).

**Non-examples:** polynomials of degree *exactly* 2 ($x^2 + (-x^2) = 0$ does not have degree 2, so addition leaves the set; the zero polynomial is missing too); vectors in the first quadrant (no negatives).`,
    },
    {
      kind: 'multi',
      prompt: 'Which are vector spaces under the usual addition and scaling?',
      choices: [
        String.raw`Polynomials of degree $\le 3$`,
        String.raw`Functions $f$ on $[0,1]$ with $f(0) = 0$`,
        String.raw`Functions $f$ on $[0,1]$ with $f(0) = 1$`,
        String.raw`All $2\times 2$ real matrices`,
        String.raw`The integers $\mathbb{Z}$, with real scalars`,
      ],
      answers: [0, 1, 3],
      why: String.raw`If $f(0) = g(0) = 0$ then $(f + g)(0) = 0$ and $(cf)(0) = 0$ ✓. But if $f(0) = g(0) = 1$, then $(f + g)(0) = 2$, and the zero function is missing. $\mathbb{Z}$ fails scaling: $0.5\cdot 1$ is not an integer.`,
    },
    {
      kind: 'explain',
      title: 'Subspaces: the quick test',
      body: String.raw`A **subspace** is a subset $W$ of a vector space that is a vector space in its own right. You only need to check three things:

1. $\mathbf{0} \in W$;
2. closed under addition: $\mathbf{u}, \mathbf{v} \in W \Rightarrow \mathbf{u} + \mathbf{v} \in W$;
3. closed under scaling: $\mathbf{v} \in W \Rightarrow c\mathbf{v} \in W$.

The other rules are inherited. Typical subspaces: lines and planes through the origin, the kernel and image of a linear map, and solution sets of **homogeneous** linear equations ($\dots = 0$) — including linear ODEs.`,
    },
    {
      kind: 'truefalse',
      prompt: String.raw`The set of all solutions of $y'' + y = 1$ is a subspace of the space of functions.`,
      answer: false,
      why: String.raw`The zero function is not a solution ($0 + 0 \ne 1$), and the sum of two solutions solves $y'' + y = 2$. Only the **homogeneous** equation $y'' + y = 0$ has a subspace of solutions; the inhomogeneous one is a shifted copy of it (one particular solution plus the subspace).`,
    },
    {
      kind: 'explain',
      title: 'Bases of function spaces',
      body: String.raw`Span, independence, basis and dimension work exactly as before.

- $\mathcal{P}_2$ has basis $\{1, x, x^2\}$, so $\dim\mathcal{P}_2 = 3$. The polynomial $3 - 2x + 5x^2$ has coordinates $(3, -2, 5)$.
- Other bases exist, e.g. $\{1,\ x - 1,\ (x - 1)^2\}$ — the coordinates are then Taylor coefficients at $x = 1$.
- The solutions of $y'' + y = 0$ have basis $\{\cos x, \sin x\}$: dimension 2.
- Some spaces have **no finite basis**: all polynomials, or $C[0,1]$. They are **infinite-dimensional**, and handling them carefully is what [Hilbert spaces](@math/hilbert-spaces) are for.

Once a basis is fixed, an $n$-dimensional space *behaves exactly like* $\mathbb{R}^n$ (it is **isomorphic** to it): just work with coordinate lists.`,
    },
    {
      kind: 'widget',
      title: 'A polynomial is a vector of coefficients',
      body: String.raw`The sliders are the coordinates $(a, b, c)$ of $p(x) = a + bx + cx^2$ in the basis $\{1, x, x^2\}$. Moving one slider adds more of one basis "direction". Every quadratic you can draw is reachable — the three basis functions span $\mathcal{P}_2$.`,
      widget: {
        type: 'FunctionPlot',
        props: {
          fns: ['a + b*x + c*x^2'],
          x: [-3, 3],
          y: [-6, 6],
          params: [
            { name: 'a', min: -3, max: 3, value: 1 },
            { name: 'b', min: -3, max: 3, value: -1 },
            { name: 'c', min: -2, max: 2, value: 0.5 },
          ],
          labels: ['p(x) = a + bx + cx²'],
        },
      },
    },
    {
      kind: 'numeric',
      prompt: String.raw`Write $p(x) = 2 + 3x + x^2$ in the basis $\{1,\ x + 1,\ (x + 1)^2\}$: $p = c_0 + c_1(x + 1) + c_2(x + 1)^2$. What is $c_1$?`,
      answer: 1,
      why: String.raw`Expand: $c_2(x^2 + 2x + 1) + c_1(x + 1) + c_0$. Matching $x^2$: $c_2 = 1$. Matching $x$: $c_1 + 2c_2 = 3$, so $c_1 = 1$. Constant: $c_0 + c_1 + c_2 = 2$, so $c_0 = 0$. Check: $(x + 1) + (x + 1)^2 = x^2 + 3x + 2$ ✓. Answering 3 just copies the old coordinate — but coordinates change with the basis.`,
    },
    {
      kind: 'explain',
      title: 'Calculus is linear algebra',
      body: String.raw`**Differentiation** $D(p) = p'$ is a linear map: $(f + g)' = f' + g'$ and $(cf)' = cf'$. On $\mathcal{P}_3$ with basis $\{1, x, x^2, x^3\}$:
$$D(1) = 0,\quad D(x) = 1,\quad D(x^2) = 2x,\quad D(x^3) = 3x^2,$$
so (columns = images of the basis)
$$D = \begin{pmatrix}0&1&0&0\\0&0&2&0\\0&0&0&3\\0&0&0&0\end{pmatrix}.$$
Its kernel is the constants (dimension 1) and its image is $\mathcal{P}_2$ (dimension 3): $1 + 3 = 4$, as rank–nullity demands. Integration is linear too — so linear differential equations are linear algebra in a function space.`,
    },
    {
      kind: 'mcq',
      prompt: String.raw`Which matrix represents differentiation on $\mathcal{P}_2$ in the basis $\{1, x, x^2\}$?`,
      choices: [
        String.raw`$\begin{pmatrix}0&0&0\\1&0&0\\0&2&0\end{pmatrix}$`,
        String.raw`$\begin{pmatrix}0&1&0\\0&0&2\\0&0&0\end{pmatrix}$`,
        String.raw`$\begin{pmatrix}0&1&0\\0&0&1\\0&0&0\end{pmatrix}$`,
        String.raw`$\begin{pmatrix}1&0&0\\0&2&0\\0&0&0\end{pmatrix}$`,
      ],
      answer: 1,
      why: String.raw`The columns are the coordinates of $D(1) = 0$, $D(x) = 1 \to (1,0,0)$ and $D(x^2) = 2x \to (0,2,0)$. The matrix with $1, 2$ below the diagonal is the transpose (images written as rows); the one with $1, 1$ above the diagonal forgets the factor 2 from the power rule.`,
    },
    {
      kind: 'explain',
      title: 'Inner products on functions → Fourier',
      body: String.raw`Define $\langle f, g\rangle = \int_{-\pi}^{\pi} f(x)\,g(x)\,dx$ — the [inner product](@math/inner-products-orthogonality) for functions. Then $\sin x, \sin 2x, \sin 3x, \dots$ are mutually **orthogonal**: $\int_{-\pi}^{\pi}\sin(mx)\sin(nx)\,dx = 0$ for $m \ne n$, and $= \pi$ for $m = n$.

So expanding an odd function as $f = \sum b_n\sin(nx)$ is just finding coordinates in an orthogonal basis — each one a projection:
$$b_n = \frac{\langle f, \sin nx\rangle}{\langle\sin nx, \sin nx\rangle} = \frac{1}{\pi}\int_{-\pi}^{\pi} f(x)\sin(nx)\,dx.$$
That is a [Fourier series](@math/fourier-series).`,
    },
    {
      kind: 'widget',
      title: 'Mixing orthogonal "directions"',
      body: String.raw`Here $f = a\sin x + b\sin 2x + c\sin 3x$. Each slider is a coordinate along one orthogonal basis function. With infinitely many such sliders you can build (almost) any reasonable **odd** function on $[-\pi, \pi]$; adding the cosines $1, \cos x, \cos 2x, \dots$ covers the rest.`,
      widget: {
        type: 'FunctionPlot',
        props: {
          fns: ['a*sin(x) + b*sin(2*x) + c*sin(3*x)'],
          x: [-3.1416, 3.1416],
          y: [-3, 3],
          params: [
            { name: 'a', min: -2, max: 2, value: 1 },
            { name: 'b', min: -2, max: 2, value: -0.5 },
            { name: 'c', min: -2, max: 2, value: 0.33 },
          ],
          labels: ['a sin x + b sin 2x + c sin 3x'],
        },
      },
    },
    {
      kind: 'numeric',
      prompt: String.raw`Compute the squared length $\langle \sin 3x, \sin 3x\rangle = \int_{-\pi}^{\pi}\sin^2(3x)\,dx$ (to 2 decimal places).`,
      answer: 3.1416,
      tolerance: 0.01,
      why: String.raw`Use $\sin^2\theta = \tfrac12(1 - \cos 2\theta)$: $\int_{-\pi}^{\pi}\tfrac12(1 - \cos 6x)\,dx = \tfrac12\cdot 2\pi - 0 = \pi \approx 3.14$. The cosine integrates to zero over whole periods. Answering 0 confuses a function's length with its orthogonality to *other* sines.`,
    },
    {
      kind: 'match',
      prompt: 'Match each space to its dimension.',
      pairs: [
        [String.raw`$\mathbb{R}^5$`, '5'],
        [String.raw`$\mathcal{P}_3$ (degree ≤ 3)`, '4'],
        [String.raw`$2\times3$ real matrices`, '6'],
        [String.raw`Solutions of $y'' + y = 0$`, '2'],
        ['All polynomials', 'Infinite'],
      ],
      why: String.raw`$\mathcal{P}_3$ has basis $1, x, x^2, x^3$ — four vectors, not three. A $2\times3$ matrix has 6 independent entries. A second-order linear ODE has a 2-dimensional solution space ($\cos x, \sin x$). No finite list of polynomials can reach every degree.`,
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- A vector space is any set where addition and scaling obey the usual rules: $\mathbb{R}^n$, polynomials, functions, matrices, ODE solutions.
- Subspace test: contains $\mathbf{0}$, closed under $+$ and scaling. Homogeneous linear equations give subspaces.
- Bases and dimension carry over; every $n$-dimensional space is isomorphic to $\mathbb{R}^n$. Some spaces are infinite-dimensional.
- Differentiation and integration are linear maps; differentiation on polynomials is a matrix.
- With $\langle f, g\rangle = \int fg$, sines are orthogonal and Fourier coefficients are projections.

Next: [Fourier series](@math/fourier-series) and, in infinite dimensions, [Hilbert spaces](@math/hilbert-spaces).`,
    },
  ],
  references: [
    { authors: 'S. Axler', title: 'Linear Algebra Done Right', year: 2024, venue: '4th ed., Springer (open access)', detail: 'Ch. 1 (vector spaces, subspaces), Ch. 2 (finite-dimensional spaces), Ch. 3 (linear maps, incl. differentiation on polynomials)', url: 'https://linear.axler.net/' },
    { authors: 'G. Strang', title: 'Introduction to Linear Algebra', year: 2016, venue: '5th ed., Wellesley-Cambridge Press', detail: 'Ch. 3 (vector spaces and subspaces), Ch. 8 (linear transformations)' },
    { authors: 'P. R. Halmos', title: 'Finite-Dimensional Vector Spaces', year: 1958, venue: '2nd ed., Van Nostrand (reprinted Springer UTM, 1974)' },
    { authors: '3Blue1Brown (G. Sanderson)', title: 'Abstract vector spaces (Essence of Linear Algebra series)', year: 2016, url: 'https://www.3blue1brown.com/topics/linear-algebra' },
  ],
} satisfies LessonContent;
