import type { LessonContent } from '../../types';

export default {
  cards: [
    {
      kind: 'explain',
      title: 'When things interact',
      body: String.raw`Real systems have several quantities that push each other around: a spring's **position** and **velocity**, predators and prey, currents in a circuit.

Collect them into a vector $\mathbf{x}(t) = (x(t), y(t))$. A **linear system** says each rate of change is a fixed linear combination of the current values:

$$x' = a x + b y,\qquad y' = c x + d y \quad\Longleftrightarrow\quad \mathbf{x}' = A\mathbf{x},\ \ A = \begin{pmatrix} a & b\\ c & d\end{pmatrix}.$$

Example: a frictionless spring has $x' = y$ (velocity) and $y' = -x$ (force pulls back), so $A = \begin{pmatrix}0&1\\-1&0\end{pmatrix}$.`,
    },
    {
      kind: 'recall',
      title: 'Eigenvectors in one breath',
      points: [
        String.raw`A nonzero vector $\mathbf{v}$ is an **eigenvector** of $A$ if $A\mathbf{v} = \lambda\mathbf{v}$ for some number $\lambda$, its **eigenvalue**.`,
        String.raw`Geometrically: $A$ does not turn $\mathbf{v}$, it only stretches it by $\lambda$ (flipping it if $\lambda<0$).`,
        String.raw`Eigenvalues solve $\det(A - \lambda I) = 0$; for $2\times 2$: $\lambda^2 - (a+d)\lambda + (ad-bc) = 0$.`,
        String.raw`$a+d$ is the **trace** $\tau$, $ad-bc$ the **determinant** $\Delta$.`,
      ],
      link: 'math/eigenvalues',
    },
    {
      kind: 'widget',
      title: 'Directions that only stretch',
      body: String.raw`Watch $A = \begin{pmatrix}2&1\\1&2\end{pmatrix}$ morph the unit circle. Most arrows turn, but those along the dashed lines only stretch: $(1,1)$ by $\lambda=3$ and $(1,-1)$ by $\lambda=1$. Try other entries — when the eigenvalues become complex, *every* arrow turns.`,
      widget: { type: 'EigenStretch', props: { a: 2, b: 1, c: 1, d: 2 } },
    },
    {
      kind: 'explain',
      title: 'Straight-line solutions',
      body: String.raw`Key idea: if $A\mathbf{v} = \lambda\mathbf{v}$, then

$$\mathbf{x}(t) = e^{\lambda t}\,\mathbf{v}$$

solves $\mathbf{x}' = A\mathbf{x}$. Check: $\mathbf{x}' = \lambda e^{\lambda t}\mathbf{v}$ and $A\mathbf{x} = e^{\lambda t}A\mathbf{v} = \lambda e^{\lambda t}\mathbf{v}$. ✓ The point slides along the line through $\mathbf{v}$, growing if $\lambda>0$ and shrinking if $\lambda<0$.

Because the system is linear, sums of solutions are solutions (**superposition**). With two independent eigenvectors:

$$\mathbf{x}(t) = c_1 e^{\lambda_1 t}\mathbf{v}_1 + c_2 e^{\lambda_2 t}\mathbf{v}_2,$$

and the constants $c_1, c_2$ are fixed by the starting point $\mathbf{x}(0)$.`,
    },
    {
      kind: 'mcq',
      prompt: String.raw`Solve $x' = -x,\ y' = 2y$ with $\mathbf{x}(0) = (1, 1)$.`,
      choices: [
        String.raw`$\mathbf{x}(t) = (e^{-t},\ e^{2t})$`,
        String.raw`$\mathbf{x}(t) = (e^{2t},\ e^{-t})$`,
        String.raw`$\mathbf{x}(t) = e^{t}(1, 1)$`,
        String.raw`$\mathbf{x}(t) = (1-t,\ 1+2t)$`,
      ],
      answer: 0,
      why: String.raw`The matrix is diagonal, so the equations decouple: each is a one-variable $y'=ky$. The eigenvectors are the axes with eigenvalues $-1$ and $2$. $(1-t, 1+2t)$ is only the first Euler-like approximation, not the solution.`,
    },
    {
      kind: 'widget',
      title: 'A saddle',
      body: String.raw`$A = \begin{pmatrix}1&1\\4&1\end{pmatrix}$ has eigenvalues $3$ (eigenvector $(1,2)$) and $-1$ (eigenvector $(1,-2)$). Trajectories rush *in* along the $(1,-2)$ line and *out* along the $(1,2)$ line, curving like hyperbolas in between. Tap to drop a particle and see which way it goes.`,
      widget: { type: 'PhasePortrait', props: { dx: 'x + y', dy: '4*x + y', range: 3 } },
    },
    {
      kind: 'numeric',
      prompt: String.raw`Find the **larger** eigenvalue of $A = \begin{pmatrix}1&1\\4&1\end{pmatrix}$. (Hint: $\tau = 2$, $\Delta = 1\cdot1 - 1\cdot 4$.)`,
      answer: 3,
      why: String.raw`$\Delta = -3$, so $\lambda^2 - 2\lambda - 3 = (\lambda-3)(\lambda+1) = 0$, giving $3$ and $-1$. A negative determinant always means one positive and one negative eigenvalue — the signature of a saddle.`,
    },
    {
      kind: 'explain',
      title: 'Complex eigenvalues mean rotation',
      body: String.raw`For the spring, $\lambda^2 + 1 = 0$, so $\lambda = \pm i$ — [complex numbers](@math/complex-numbers). Don't panic: Euler's formula $e^{(\alpha + i\beta)t} = e^{\alpha t}(\cos\beta t + i\sin\beta t)$ turns them into real oscillations.

For eigenvalues $\lambda = \alpha \pm i\beta$ (with $\beta \ne 0$), every real solution is a combination of $e^{\alpha t}\cos\beta t$ and $e^{\alpha t}\sin\beta t$:

- $\beta$ sets the **rotation speed** (angular frequency),
- $\alpha$ sets **growth** ($\alpha>0$, spiral out), **decay** ($\alpha<0$, spiral in) or neither ($\alpha=0$, closed loops).

The spring has $\alpha=0$, $\beta=1$: $x(t) = \cos t$, $y(t) = -\sin t$ traces a circle forever.`,
    },
    {
      kind: 'widget',
      title: 'Spirals and centres',
      body: String.raw`Here $x' = a x + y,\ y' = -x + a y$, with eigenvalues $a \pm i$. Slide $a$ below zero (spiral in), to zero (circles) and above zero (spiral out).`,
      widget: { type: 'PhasePortrait', props: { dx: 'a*x + y', dy: '-x + a*y', range: 3, params: [{ name: 'a', min: -0.6, max: 0.6, value: -0.2 }] } },
    },
    {
      kind: 'truefalse',
      prompt: String.raw`For $x' = y,\ y' = -x$, every trajectory spirals into the origin.`,
      answer: false,
      why: String.raw`The eigenvalues are $\pm i$: real part $\alpha = 0$, so there is no decay. Trajectories are closed circles ($x^2+y^2$ stays constant — check that its derivative $2xx'+2yy' = 2xy - 2yx = 0$). Spiralling in needs friction, i.e. $\alpha<0$.`,
    },
    {
      kind: 'explain',
      title: 'One formula for all: the matrix exponential',
      body: String.raw`For one variable, $y'=ky$ gives $y = e^{kt}y_0$. Remarkably, the same holds for systems:

$$\mathbf{x}(t) = e^{At}\,\mathbf{x}(0),\qquad e^{At} = I + At + \frac{(At)^2}{2!} + \frac{(At)^3}{3!} + \cdots$$

The series always converges. If $A$ is diagonal with entries $\lambda_1,\lambda_2$, then $e^{At}$ is diagonal with entries $e^{\lambda_1 t}, e^{\lambda_2 t}$ — exactly the eigenvector solution. This object reappears as the bridge between Lie algebras and Lie groups ([matrix exponential](@math/matrix-exponential)).`,
    },
    {
      kind: 'multi',
      prompt: String.raw`A $2\times 2$ system $\mathbf{x}' = A\mathbf{x}$ has real eigenvalues $-1$ and $-4$. Which statements are true?`,
      choices: [
        String.raw`Every solution tends to $(0,0)$ as $t\to\infty$.`,
        String.raw`The origin is an equilibrium.`,
        'Solutions spiral around the origin.',
        'There are straight-line solutions along two different directions.',
        'Some solutions grow without bound.',
      ],
      answers: [0, 1, 3],
      why: String.raw`Each term $c_ie^{\lambda_i t}\mathbf{v}_i$ decays because both eigenvalues are negative, and $A\mathbf{0}=\mathbf{0}$ always. Real distinct eigenvalues give two eigenvector lines and no rotation (spirals need complex eigenvalues). This is a **stable node**.`,
    },
    {
      kind: 'order',
      prompt: String.raw`Order the steps to solve $\mathbf{x}' = A\mathbf{x}$, $\mathbf{x}(0)=\mathbf{x}_0$ (real distinct eigenvalues).`,
      steps: [
        String.raw`Solve $\det(A-\lambda I)=0$ for $\lambda_1, \lambda_2$.`,
        String.raw`Find eigenvectors $\mathbf{v}_1, \mathbf{v}_2$ from $(A-\lambda_i I)\mathbf{v}=\mathbf{0}$.`,
        String.raw`Write $\mathbf{x}(t) = c_1e^{\lambda_1 t}\mathbf{v}_1 + c_2e^{\lambda_2 t}\mathbf{v}_2$.`,
        String.raw`Set $t=0$ and solve $c_1\mathbf{v}_1 + c_2\mathbf{v}_2 = \mathbf{x}_0$ for $c_1, c_2$.`,
      ],
      why: 'Eigenvalues come first because you need each λ to find its eigenvector; only then can you assemble the general solution and fit the constants to the starting point.',
    },
    {
      kind: 'fill',
      prompt: String.raw`If $A\mathbf{v} = \lambda\mathbf{v}$ then $\mathbf{x}(t) = $ ___ $\mathbf{v}$ solves $\mathbf{x}'=A\mathbf{x}$. Complex eigenvalues $\alpha \pm i\beta$ produce ___, which grow when $\alpha$ is ___.`,
      bank: [String.raw`$e^{\lambda t}$`, String.raw`$\lambda t$`, 'rotation/spirals', 'straight lines', 'positive', 'negative'],
      answer: [String.raw`$e^{\lambda t}$`, 'rotation/spirals', 'positive'],
      why: String.raw`$e^{\lambda t}\mathbf{v}$ has derivative $\lambda e^{\lambda t}\mathbf{v} = A(e^{\lambda t}\mathbf{v})$. The imaginary part $\beta$ makes things rotate and the real part $\alpha$ is an exponential growth rate, so $\alpha>0$ means outward spirals.`,
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- A linear system is $\mathbf{x}' = A\mathbf{x}$; the origin is always an equilibrium.
- Each real eigenpair $(\lambda,\mathbf{v})$ gives a straight-line solution $e^{\lambda t}\mathbf{v}$; superposition builds the rest.
- Opposite-sign real eigenvalues → **saddle**; same-sign → **node**; complex $\alpha\pm i\beta$ → **spiral** (or **centre** if $\alpha=0$).
- In general $\mathbf{x}(t) = e^{At}\mathbf{x}(0)$.

Next: a field guide to all these pictures — [phase portraits](@math/phase-portraits).`,
    },
  ],
  references: [
    { authors: 'S. H. Strogatz', title: 'Nonlinear Dynamics and Chaos', year: 2015, venue: '2nd ed., Westview Press / CRC', detail: 'Ch. 5 (linear systems)' },
    { authors: 'M. W. Hirsch, S. Smale, R. L. Devaney', title: 'Differential Equations, Dynamical Systems, and an Introduction to Chaos', year: 2013, venue: '3rd ed., Academic Press', detail: 'Ch. 2–3, 6' },
    { authors: '3Blue1Brown (G. Sanderson)', title: 'Eigenvectors and eigenvalues (Essence of Linear Algebra series)', year: 2016, url: 'https://www.3blue1brown.com/topics/linear-algebra' },
  ],
} satisfies LessonContent;
