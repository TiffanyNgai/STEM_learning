import type { LessonContent } from '../../types';

export default {
  cards: [
    {
      kind: 'explain',
      title: 'Adding geometry: the dot product',
      body: String.raw`So far vectors could be added and scaled, but we had no notion of **length** or **angle**. The **dot product** supplies both:

$$\mathbf{a}\cdot\mathbf{b} = a_1b_1 + a_2b_2 + \dots + a_nb_n.$$

Length (or **norm**) is $\|\mathbf{a}\| = \sqrt{\mathbf{a}\cdot\mathbf{a}}$ — Pythagoras in $n$ dimensions. Example: $\|(3, 4)\| = \sqrt{9 + 16} = 5$.

Distances follow: the distance between points $\mathbf{a}$ and $\mathbf{b}$ is $\|\mathbf{a} - \mathbf{b}\|$.`,
    },
    {
      kind: 'explain',
      title: 'Angles from dot products',
      body: String.raw`Geometrically,
$$\mathbf{a}\cdot\mathbf{b} = \|\mathbf{a}\|\,\|\mathbf{b}\|\cos\theta,$$
where $\theta$ is the angle between the arrows. So the **sign** of the dot product tells you a lot:

- $> 0$: angle under $90^\circ$ (pointing roughly the same way);
- $= 0$: exactly $90^\circ$ — **orthogonal** (perpendicular);
- $< 0$: angle over $90^\circ$.

Since $|\cos\theta| \le 1$, we get the **Cauchy–Schwarz inequality** $|\mathbf{a}\cdot\mathbf{b}| \le \|\mathbf{a}\|\,\|\mathbf{b}\|$. Example: $(1,0)\cdot(1,1) = 1$, lengths $1$ and $\sqrt2$, so $\cos\theta = 1/\sqrt2$ and $\theta = 45^\circ$. (Data scientists call $\cos\theta$ "cosine similarity".)`,
    },
    {
      kind: 'widget',
      title: 'Dot product and shadow',
      body: String.raw`Rotate $\mathbf{b}$ (orange) around $\mathbf{a}$ (blue). The dot product shrinks to $0$ at $90^\circ$ and turns negative beyond. The green arrow is the **projection** of $\mathbf{b}$ onto the line of $\mathbf{a}$ — the "shadow" $\mathbf{b}$ casts with light shining perpendicular to $\mathbf{a}$ — and the dashed red leftover is always at right angles to $\mathbf{a}$.`,
      widget: { type: 'MathProjection', props: { a: [3, 15], b: [2.5, 70] } },
    },
    {
      kind: 'numeric',
      prompt: String.raw`Find the angle (in degrees) between $\mathbf{a} = (1, 0, 1)$ and $\mathbf{b} = (0, 1, 1)$.`,
      answer: 60,
      tolerance: 0.5,
      unit: '°',
      why: String.raw`$\mathbf{a}\cdot\mathbf{b} = 0 + 0 + 1 = 1$ and $\|\mathbf{a}\| = \|\mathbf{b}\| = \sqrt2$. So $\cos\theta = 1/2$ and $\theta = 60^\circ$. Forgetting to divide by the lengths would give $\cos\theta = 1$, i.e. $0^\circ$, which is clearly wrong for different directions.`,
    },
    {
      kind: 'explain',
      title: 'Projection onto a line',
      body: String.raw`The point on the line through $\mathbf{a}$ closest to $\mathbf{b}$ is the **projection**
$$\operatorname{proj}_{\mathbf{a}}\mathbf{b} = \frac{\mathbf{a}\cdot\mathbf{b}}{\mathbf{a}\cdot\mathbf{a}}\;\mathbf{a}.$$
The leftover $\mathbf{b} - \operatorname{proj}_{\mathbf{a}}\mathbf{b}$ is orthogonal to $\mathbf{a}$ — that is precisely why it is the shortest gap.

Example: $\mathbf{a} = (1,1)$, $\mathbf{b} = (3,1)$. Then $\mathbf{a}\cdot\mathbf{b} = 4$, $\mathbf{a}\cdot\mathbf{a} = 2$, so the projection is $2\,(1,1) = (2,2)$. Leftover: $(1,-1)$, and indeed $(1,-1)\cdot(1,1) = 0$ ✓.`,
    },
    {
      kind: 'mcq',
      prompt: String.raw`Project $\mathbf{b} = (5, 0)$ onto the line through $\mathbf{a} = (3, 4)$.`,
      choices: [String.raw`$(3, 4)$`, String.raw`$(1.8, 2.4)$`, String.raw`$(3, 0)$`, String.raw`$(0.6, 0.8)$`],
      answer: 1,
      why: String.raw`$\mathbf{a}\cdot\mathbf{b} = 15$ and $\mathbf{a}\cdot\mathbf{a} = 25$, so the projection is $\tfrac{15}{25}(3,4) = 0.6\,(3,4) = (1.8, 2.4)$. $(0.6, 0.8)$ is just the unit vector along $\mathbf{a}$; $(3,0)$ is the projection the other way round (of $\mathbf{a}$ onto the $x$-axis).`,
    },
    {
      kind: 'explain',
      title: 'Inner products in general',
      body: String.raw`The dot product is one example of an **inner product** $\langle\mathbf{u}, \mathbf{v}\rangle$: any rule taking two vectors to a real number that is

1. **symmetric**: $\langle\mathbf{u}, \mathbf{v}\rangle = \langle\mathbf{v}, \mathbf{u}\rangle$;
2. **linear** in each slot: $\langle a\mathbf{u} + b\mathbf{w}, \mathbf{v}\rangle = a\langle\mathbf{u}, \mathbf{v}\rangle + b\langle\mathbf{w}, \mathbf{v}\rangle$;
3. **positive**: $\langle\mathbf{v}, \mathbf{v}\rangle > 0$ whenever $\mathbf{v} \ne \mathbf{0}$.

Every inner product brings its own lengths, angles, projections and Cauchy–Schwarz. A key example on functions: $\langle f, g\rangle = \int_a^b f(x)g(x)\,dx$. (For complex vectors, as in quantum mechanics, symmetry becomes $\langle\mathbf{u},\mathbf{v}\rangle = \overline{\langle\mathbf{v},\mathbf{u}\rangle}$.)`,
    },
    {
      kind: 'explain',
      title: 'Orthonormal bases make life easy',
      body: String.raw`A basis $\mathbf{q}_1, \dots, \mathbf{q}_n$ is **orthonormal** if the vectors are mutually orthogonal and each has length 1: $\mathbf{q}_i\cdot\mathbf{q}_j = 0$ for $i \ne j$ and $\mathbf{q}_i\cdot\mathbf{q}_i = 1$.

Then coordinates need no equation solving — they are just dot products: $\mathbf{v} = \sum_i (\mathbf{q}_i\cdot\mathbf{v})\,\mathbf{q}_i$.

Put the $\mathbf{q}_i$ as columns of a matrix $Q$. Then $Q^\top Q = I$, so $Q^{-1} = Q^\top$. Such **orthogonal matrices** are the rotations, reflections and their combinations: they preserve lengths and angles. Example: $\mathbf{q}_1 = \tfrac{1}{\sqrt2}(1,1)$, $\mathbf{q}_2 = \tfrac{1}{\sqrt2}(1,-1)$; for $\mathbf{v} = (3,1)$ the coordinates are $4/\sqrt2 = 2\sqrt2$ and $2/\sqrt2 = \sqrt2$.`,
    },
    {
      kind: 'truefalse',
      prompt: String.raw`If $Q$ is an orthogonal matrix ($Q^\top Q = I$), then $\|Q\mathbf{x}\| = \|\mathbf{x}\|$ for every vector $\mathbf{x}$.`,
      answer: true,
      why: String.raw`$\|Q\mathbf{x}\|^2 = (Q\mathbf{x})^\top(Q\mathbf{x}) = \mathbf{x}^\top Q^\top Q\,\mathbf{x} = \mathbf{x}^\top\mathbf{x} = \|\mathbf{x}\|^2$. This is why multiplying by orthogonal matrices does not amplify rounding errors in computations.`,
    },
    {
      kind: 'explain',
      title: 'Gram–Schmidt: straightening a basis',
      body: String.raw`Given independent vectors $\mathbf{v}_1, \mathbf{v}_2, \dots$, the **Gram–Schmidt process** builds an orthonormal basis of the same span:

1. Normalise the first: $\mathbf{q}_1 = \mathbf{v}_1/\|\mathbf{v}_1\|$.
2. From each next vector, subtract its projections onto all earlier $\mathbf{q}$'s: $\mathbf{w}_k = \mathbf{v}_k - \sum_{j<k}(\mathbf{q}_j\cdot\mathbf{v}_k)\,\mathbf{q}_j$.
3. Normalise: $\mathbf{q}_k = \mathbf{w}_k/\|\mathbf{w}_k\|$.

In matrix language this factors $A = QR$, with $Q$ having orthonormal columns and $R$ upper triangular — a workhorse of numerical computing.`,
    },
    {
      kind: 'widget',
      title: 'Gram–Schmidt on two vectors',
      widget: {
        type: 'StepReveal',
        props: {
          steps: [
            String.raw`Start with $\mathbf{v}_1 = (3, 4)$ and $\mathbf{v}_2 = (1, 0)$. They are independent but not orthogonal ($\mathbf{v}_1\cdot\mathbf{v}_2 = 3$).`,
            String.raw`$\mathbf{q}_1 = \mathbf{v}_1/\|\mathbf{v}_1\| = (3,4)/5 = (0.6,\ 0.8)$.`,
            String.raw`Remove the $\mathbf{q}_1$-part of $\mathbf{v}_2$: $\mathbf{q}_1\cdot\mathbf{v}_2 = 0.6$, so $\mathbf{w}_2 = (1,0) - 0.6\,(0.6, 0.8) = (0.64,\ -0.48)$.`,
            String.raw`$\|\mathbf{w}_2\| = \sqrt{0.4096 + 0.2304} = 0.8$, so $\mathbf{q}_2 = (0.8,\ -0.6)$.`,
            String.raw`Check: $\mathbf{q}_1\cdot\mathbf{q}_2 = 0.48 - 0.48 = 0$ ✓, and both have length 1 ✓.`,
          ],
        },
      },
    },
    {
      kind: 'numeric',
      prompt: String.raw`Gram–Schmidt with $\mathbf{v}_1 = (1, 1, 0)$ and $\mathbf{v}_2 = (1, 0, 1)$: the un-normalised second vector is $\mathbf{w}_2 = \mathbf{v}_2 - \frac{\mathbf{v}_1\cdot\mathbf{v}_2}{\mathbf{v}_1\cdot\mathbf{v}_1}\mathbf{v}_1 = (0.5,\ ?,\ 1)$. Find the missing middle entry.`,
      answer: -0.5,
      why: String.raw`$\mathbf{v}_1\cdot\mathbf{v}_2 = 1$ and $\mathbf{v}_1\cdot\mathbf{v}_1 = 2$, so $\mathbf{w}_2 = (1,0,1) - \tfrac12(1,1,0) = (0.5, -0.5, 1)$. Check orthogonality: $(0.5, -0.5, 1)\cdot(1,1,0) = 0$ ✓.`,
    },
    {
      kind: 'explain',
      title: 'Payoff: least squares',
      body: String.raw`Often $A\mathbf{x} = \mathbf{b}$ has **no** solution — say, fitting a straight line through 50 noisy data points. Best compromise: choose $\hat{\mathbf{x}}$ so that $A\hat{\mathbf{x}}$ is the projection of $\mathbf{b}$ onto the column space of $A$. Then the error $\mathbf{b} - A\hat{\mathbf{x}}$ is orthogonal to every column, i.e. $A^\top(\mathbf{b} - A\hat{\mathbf{x}}) = \mathbf{0}$:
$$A^\top A\,\hat{\mathbf{x}} = A^\top\mathbf{b}\qquad\text{(the normal equations).}$$
This minimises the sum of squared errors $\|\mathbf{b} - A\mathbf{x}\|^2$ and is exactly [linear regression](@stats/linear-regression).`,
    },
    {
      kind: 'match',
      prompt: 'Match each concept to its formula.',
      pairs: [
        [String.raw`Length of $\mathbf{v}$`, String.raw`$\sqrt{\mathbf{v}\cdot\mathbf{v}}$`],
        [String.raw`$\cos\theta$ between $\mathbf{a}, \mathbf{b}$`, String.raw`$\dfrac{\mathbf{a}\cdot\mathbf{b}}{\|\mathbf{a}\|\|\mathbf{b}\|}$`],
        [String.raw`Projection of $\mathbf{b}$ onto $\mathbf{a}$`, String.raw`$\dfrac{\mathbf{a}\cdot\mathbf{b}}{\mathbf{a}\cdot\mathbf{a}}\,\mathbf{a}$`],
        ['Orthogonal matrix', String.raw`$Q^\top Q = I$`],
        ['Least-squares solution', String.raw`$A^\top A\hat{\mathbf{x}} = A^\top\mathbf{b}$`],
      ],
      why: 'All five come from the dot product: length is a vector dotted with itself, angle is a normalised dot product, projection removes everything orthogonal, orthogonal matrices keep dot products, and least squares makes the error orthogonal to the column space.',
    },
    {
      kind: 'multi',
      prompt: 'Which pairs are orthogonal?',
      choices: [
        String.raw`$(1, 2)$ and $(2, -1)$`,
        String.raw`$(1, 1, 1)$ and $(1, -2, 1)$`,
        String.raw`$(3, 4)$ and $(4, 3)$`,
        String.raw`$f(x) = 1$ and $g(x) = x$ on $[-1, 1]$, with $\langle f, g\rangle = \int_{-1}^{1} f g\,dx$`,
        String.raw`$\sin x$ and $\sin x$ on $[0, \pi]$, same kind of integral`,
      ],
      answers: [0, 1, 3],
      why: String.raw`$2 - 2 = 0$ ✓; $1 - 2 + 1 = 0$ ✓; $12 + 12 = 24 \ne 0$ ✗; $\int_{-1}^1 x\,dx = 0$ ✓ (odd function). A nonzero vector is never orthogonal to itself: $\int_0^\pi \sin^2 x\,dx = \pi/2 > 0$.`,
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- Dot product $\mathbf{a}\cdot\mathbf{b} = \sum a_ib_i = \|\mathbf{a}\|\|\mathbf{b}\|\cos\theta$; zero means orthogonal.
- Projection onto $\mathbf{a}$: $\frac{\mathbf{a}\cdot\mathbf{b}}{\mathbf{a}\cdot\mathbf{a}}\mathbf{a}$; the leftover is perpendicular and as short as possible.
- An inner product is any symmetric, bilinear, positive pairing — e.g. $\int fg$ for functions.
- Orthonormal bases: coordinates are dot products; orthogonal matrices satisfy $Q^{-1} = Q^\top$ and preserve lengths.
- Gram–Schmidt orthonormalises ($A = QR$); least squares solves $A^\top A\hat{\mathbf{x}} = A^\top\mathbf{b}$.

Next: symmetric matrices have orthogonal eigenvectors — the [spectral theorem and SVD](@math/diagonalization-svd).`,
    },
  ],
  references: [
    { authors: 'G. Strang', title: 'Introduction to Linear Algebra', year: 2016, venue: '5th ed., Wellesley-Cambridge Press', detail: 'Sec. 1.2 (lengths and dot products), Ch. 4 (orthogonality, projections, least squares, Gram–Schmidt)' },
    { authors: 'S. Axler', title: 'Linear Algebra Done Right', year: 2024, venue: '4th ed., Springer (open access)', detail: 'Ch. 6 (inner product spaces, orthonormal bases, Gram–Schmidt, orthogonal complements and minimisation)', url: 'https://linear.axler.net/' },
    { authors: 'L. N. Trefethen, D. Bau III', title: 'Numerical Linear Algebra', year: 1997, venue: 'SIAM', detail: 'Lectures 2 (orthogonal vectors and matrices), 6–8 (projectors, QR factorisation, Gram–Schmidt), 11 (least squares)' },
    { authors: 'G. Strang', title: '18.06 Linear Algebra (Spring 2010), MIT OpenCourseWare', year: 2010, detail: 'Lecture 15 (projections onto subspaces), Lecture 16 (projection matrices and least squares), Lecture 17 (orthogonal matrices and Gram–Schmidt)', url: 'https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/' },
  ],
} satisfies LessonContent;
