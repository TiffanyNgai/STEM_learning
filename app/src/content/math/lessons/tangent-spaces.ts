import type { LessonContent } from '../../types';

export default {
  cards: [
    {
      kind: 'explain',
      title: 'You cannot add two cities',
      body: String.raw`On a flat plane, vectors and points are easy to confuse: the arrow from the origin to $(3,4)$ *is* the point $(3,4)$. On a sphere that breaks down. What is "Paris plus Tokyo"? Nothing. There is no origin and no addition.

But **velocities** still make sense. A plane flying over Paris has a definite speed and direction at that instant, and two velocities at the *same* point can be added. So each point $p$ of a manifold $M$ carries its own private vector space of velocities, the **tangent space** $T_pM$. Velocities at different points live in different spaces and cannot be added — comparing them is the whole story of curvature, later on.`,
    },
    {
      kind: 'explain',
      title: 'Tangent vectors as velocities of curves',
      body: String.raw`Let $\gamma : (-\varepsilon, \varepsilon) \to M$ be a smooth curve with $\gamma(0) = p$. Its velocity at $0$ is a tangent vector at $p$, and every tangent vector arises this way. Two curves give the *same* tangent vector when, in some chart $\varphi$, the ordinary derivatives agree: $(\varphi\circ\gamma_1)'(0) = (\varphi\circ\gamma_2)'(0)$. The chain rule guarantees that this does not depend on the chart.

For a surface sitting in $\mathbb{R}^3$, like the unit sphere, this matches the picture you expect: the velocity of any curve through $p$ on the sphere is perpendicular to $p$, and $T_pS^2$ is the plane through the origin of all vectors $v$ with $v \cdot p = 0$. It is a plane *of vectors*, drawn at $p$ for convenience.`,
    },
    {
      kind: 'widget',
      title: 'The tangent plane, point by point',
      body: String.raw`Drag $p$ around the sphere. The blue patch is $T_pS^2$; the red arrow is a velocity $v$ you can aim with the heading slider. Press play and a dot runs along the curve whose velocity at $p$ is $v$ (a great circle) — its own velocity arrow always lies in the tangent plane of wherever it currently is. Watch the readout: $v \cdot p = 0$, always.`,
      widget: { type: 'MathTangentPlane', props: { lat: 35, lon: 25, heading: 60 } },
    },
    {
      kind: 'truefalse',
      prompt: String.raw`For $p$ on the unit sphere, the point $p$ itself belongs to the tangent space $T_pS^2$.`,
      answer: false,
      why: String.raw`$T_pS^2 = \{v : v\cdot p = 0\}$, and $p \cdot p = 1 \neq 0$, so $p$ is not in it — $p$ is the *normal* direction, not a tangent one. The tangent space is a plane through the **origin** in the space of vectors; we only draw it touching the sphere at $p$ as a visual aid.`,
    },
    {
      kind: 'explain',
      title: 'The coordinate basis',
      body: String.raw`Take a chart with coordinates $(x^1, \dots, x^n)$ near $p$. Holding all coordinates but the $i$-th fixed and letting $x^i$ run gives a curve through $p$; its velocity is written
$$\frac{\partial}{\partial x^i}\bigg|_p .$$
These $n$ vectors form a **basis** of $T_pM$, so $\dim T_pM = n = \dim M$, and every tangent vector is
$$v = \sum_{i=1}^n v^i \,\frac{\partial}{\partial x^i}\bigg|_p .$$
On the sphere with latitude $\varphi$ and longitude $\lambda$, $\partial/\partial\lambda$ points east and $\partial/\partial\varphi$ points north. They are a basis at every point except the poles, where this particular chart breaks down; and since $S^2$ is compact, *no* single chart can cover it, so some such breakdown is unavoidable.`,
    },
    {
      kind: 'numeric',
      prompt: String.raw`What is the dimension of the tangent space to the torus $T^2$ at any of its points?`,
      answer: 2,
      why: String.raw`The tangent space always has the same dimension as the manifold, and the torus is a surface: $\dim T_pT^2 = 2$. Its being drawn inside three-dimensional space is irrelevant — tangency is intrinsic.`,
    },
    {
      kind: 'explain',
      title: 'The algebraic definition: a derivation',
      body: String.raw`"Velocity of a curve" is intuitive but awkward to work with. Here is the definition that textbooks use, and it says the same thing.

A **tangent vector at $p$** is a linear map $v$ from smooth functions near $p$ to $\mathbb{R}$ satisfying the **Leibniz rule**
$$v(fg) = f(p)\,v(g) + g(p)\,v(f).$$
In other words, a tangent vector *is* a directional derivative. The curve $\gamma$ gives the map $f \mapsto (f\circ\gamma)'(0)$, and one proves that every derivation comes from a curve, and that $\partial/\partial x^1|_p, \dots, \partial/\partial x^n|_p$ is a basis of the space of them. This is why the notation $\partial/\partial x^i$ is used for basis *vectors*: they really are operators that differentiate.`,
    },
    {
      kind: 'numeric',
      prompt: String.raw`In $\mathbb{R}^2$ let $v = 2\,\partial/\partial x + 3\,\partial/\partial y$ at the point $(1,1)$, and let $f(x,y) = x^2 y$. Compute $v(f)$.`,
      answer: 7,
      why: String.raw`$v(f) = 2 f_x + 3 f_y$ evaluated at $(1,1)$. Here $f_x = 2xy = 2$ and $f_y = x^2 = 1$, so $v(f) = 2(2) + 3(1) = 7$. A tangent vector eats a function and returns the rate of change of that function in its direction.`,
    },
    {
      kind: 'recall',
      title: 'From linear algebra',
      points: [
        'A basis is an independent spanning list; every vector has unique coordinates in it.',
        'A linear map is determined by where it sends the basis vectors.',
        'Writing those images as columns gives the matrix of the map.',
        'Rank–nullity: dim(kernel) + rank = number of columns.',
      ],
      link: 'math/linear-maps',
    },
    {
      kind: 'explain',
      title: 'The differential: derivative of a smooth map',
      body: String.raw`Let $F : M \to N$ be smooth and $p \in M$. The **differential** (or pushforward)
$$dF_p : T_pM \longrightarrow T_{F(p)}N$$
sends the velocity of a curve $\gamma$ to the velocity of the image curve $F\circ\gamma$. It is a **linear map** — the best linear approximation of $F$ at $p$, now stated without ever subtracting two points.

In charts, $dF_p$ is exactly the **Jacobian matrix** $\left(\partial F^i/\partial x^j\right)$ evaluated at $p$. The chain rule becomes beautifully clean:
$$d(G\circ F)_p = dG_{F(p)} \circ dF_p .$$
Derivative of a composite = composite of derivatives.`,
    },
    {
      kind: 'widget',
      title: 'A differential is just a linear map',
      body: String.raw`Whatever the manifolds, $dF_p$ acts on the tangent space as a matrix. Here is such a matrix at work: it stretches, shears, maybe flips orientation (negative determinant) or crushes a direction flat (zero determinant — then $F$ is *not* a local diffeomorphism at $p$). Play with the entries and watch the unit square's image.`,
      widget: { type: 'MathGridTransform', props: { a: 1, b: 0.6, c: -0.4, d: 1.2 } },
    },
    {
      kind: 'numeric',
      prompt: String.raw`Let $F(x,y) = (x^2 y,\ x + y)$. The Jacobian at $(2,1)$ is $\begin{pmatrix}2xy & x^2\\ 1 & 1\end{pmatrix} = \begin{pmatrix}4 & 4\\ 1 & 1\end{pmatrix}$. What is $\det dF_{(2,1)}$?`,
      answer: 0,
      why: String.raw`$\det = 4\cdot 1 - 4\cdot 1 = 0$. The differential crushes a direction, so $F$ is not invertible near $(2,1)$: by the inverse function theorem, $F$ is a local diffeomorphism exactly where $\det dF_p \neq 0$.`,
    },
    {
      kind: 'mcq',
      prompt: String.raw`$F : M \to N$ is smooth, $\dim M = 3$, $\dim N = 5$. What can you say about $dF_p$?`,
      choices: [
        String.raw`It is a linear map $\mathbb{R}^3 \to \mathbb{R}^5$, so its rank is at most 3`,
        String.raw`It is a $3\times 5$ matrix of rank exactly 3`,
        String.raw`It is invertible whenever $F$ is injective`,
        String.raw`It depends on the choice of chart, so it has no well-defined rank`,
      ],
      answer: 0,
      why: String.raw`$dF_p : T_pM \to T_{F(p)}N$ is linear between spaces of dimensions 3 and 5, so in coordinates it is a $5\times 3$ matrix (5 rows, 3 columns) and its rank is at most $\min(3,5) = 3$ — it can be less. It can never be invertible when the dimensions differ, and although the matrix changes with the chart, the rank does not: changing chart multiplies by invertible Jacobians.`,
    },
    {
      kind: 'explain',
      title: 'The tangent bundle',
      body: String.raw`Collect all the tangent spaces into one object:
$$TM = \bigsqcup_{p\in M} T_pM = \{(p, v) : p \in M,\ v \in T_pM\}.$$
This is itself a smooth manifold of dimension $2n$: a chart of $M$ with coordinates $x^i$ gives a chart of $TM$ with coordinates $(x^1,\dots,x^n, v^1,\dots,v^n)$. Physicists know it as the space of positions-and-velocities, the home of the Lagrangian.

$TM$ is the first example of a **vector bundle**: a vector space attached smoothly to each point. A smooth choice of one vector at each point — a **section** — is a [vector field](@math/vector-fields-flows), which is the next lesson. For the circle, $TS^1 = S^1\times\mathbb{R}$ is a cylinder; for the sphere, $TS^2$ is *not* $S^2 \times \mathbb{R}^2$, a twistedness with real consequences.`,
    },
    {
      kind: 'match',
      prompt: 'Match each object to what it is.',
      pairs: [
        [String.raw`$T_pM$`, String.raw`A vector space of dimension $\dim M$, attached to one point`],
        [String.raw`$\partial/\partial x^i|_p$`, 'A basis vector of that space, coming from a coordinate curve'],
        [String.raw`$dF_p$`, 'A linear map between two tangent spaces'],
        [String.raw`$TM$`, String.raw`A manifold of dimension $2\dim M$ holding all tangent vectors at once`],
        ['A derivation at p', 'A linear operator on functions obeying the Leibniz rule'],
      ],
      why: String.raw`Keep the levels straight: a tangent *vector* lives at one point, a tangent *space* is all of them at that point, the tangent *bundle* is all of those over all points, and a *differential* moves tangent vectors from one manifold to another.`,
    },
    {
      kind: 'order',
      prompt: String.raw`You want the differential of $F : M\to N$ at $p$, as a matrix. Order the steps.`,
      steps: [
        String.raw`Choose a chart $\varphi$ around $p$ and a chart $\psi$ around $F(p)$.`,
        String.raw`Write the coordinate representation $\widehat F = \psi\circ F\circ\varphi^{-1}$.`,
        String.raw`Differentiate: form the Jacobian matrix $(\partial \widehat F^i/\partial x^j)$.`,
        String.raw`Evaluate it at $\varphi(p)$; this matrix is $dF_p$ in the bases $\partial/\partial x^j$ and $\partial/\partial y^i$.`,
      ],
      why: String.raw`A manifold has no coordinates until you pick charts, so that comes first; only then is there a Euclidean map to differentiate. The resulting matrix depends on the charts, but the linear map it represents does not.`,
    },
    {
      kind: 'fill',
      prompt: String.raw`A tangent vector can be defined as the ___ of a curve, or as a linear operator on functions obeying the ___ rule. The derivative of a smooth map between manifolds is the ___, a linear map between tangent spaces.`,
      bank: ['velocity', 'Leibniz', 'differential', 'length', 'cocycle', 'integral'],
      answer: ['velocity', 'Leibniz', 'differential'],
      why: String.raw`The two definitions — kinematic (velocity of a curve) and algebraic (derivation satisfying $v(fg) = f(p)v(g)+g(p)v(f)$) — give the same vector space, and the differential is the chart-free version of the Jacobian. Length needs a metric, which we have not introduced yet.`,
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- Points on a manifold cannot be added, but **velocities at a single point** can: $T_pM$ is a vector space of dimension $n = \dim M$.
- Equivalent definitions: equivalence classes of curves through $p$, or derivations (linear maps on functions obeying Leibniz).
- A chart gives the **coordinate basis** $\partial/\partial x^1|_p,\dots,\partial/\partial x^n|_p$.
- The **differential** $dF_p : T_pM \to T_{F(p)}N$ is the chart-free derivative; in coordinates it is the Jacobian, and the chain rule is composition of linear maps.
- All the tangent spaces together form the **tangent bundle** $TM$, a $2n$-dimensional manifold.

Next: choose one tangent vector at every point and let it push you around → [vector fields and flows](@math/vector-fields-flows).`,
    },
  ],
  references: [
    { authors: 'L. W. Tu', title: 'An Introduction to Manifolds', year: 2011, venue: '2nd ed., Springer Universitext', detail: '§2 (tangent vectors in ℝⁿ as derivations), §8 (the tangent space), §12 (the tangent bundle)' },
    { authors: 'J. M. Lee', title: 'Introduction to Smooth Manifolds', year: 2013, venue: '2nd ed., Springer GTM 218', detail: 'Ch. 3 (tangent vectors, differentials, the tangent bundle), Ch. 4 (rank, immersions and submersions)' },
    { authors: 'M. P. do Carmo', title: 'Differential Geometry of Curves and Surfaces', year: 2016, venue: '2nd ed., Dover', detail: '§2-4 (the tangent plane; the differential of a map between surfaces)' },
    { authors: 'T. Needham', title: 'Visual Differential Geometry and Forms: A Mathematical Drama in Five Acts', year: 2021, venue: 'Princeton University Press', detail: 'Act I–II (tangent vectors and the metric)' },
  ],
} satisfies LessonContent;
