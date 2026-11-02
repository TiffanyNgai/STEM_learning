import type { LessonContent } from '../../types';

export default {
  cards: [
    {
      kind: 'explain',
      title: 'Integrating along a path',
      body: String.raw`In the complex plane we integrate along a **curve** $\gamma$, called a *contour*. Chop $\gamma$ into small steps $\Delta z_k$, multiply each by the value of $f$ there, and add:
$$\int_\gamma f(z)\,dz \approx \sum_k f(z_k)\,\Delta z_k.$$
Each $\Delta z_k$ is a small complex number, an arrow along the path. If $\gamma$ is described by $z = \gamma(t)$ for $a \le t \le b$, then $dz = \gamma'(t)\,dt$ and
$$\int_\gamma f\,dz = \int_a^b f(\gamma(t))\,\gamma'(t)\,dt,$$
an ordinary integral of a complex-valued function. $\oint$ marks a **closed** loop, by default traversed anticlockwise.`,
    },
    {
      kind: 'widget',
      title: 'The most important integral',
      body: String.raw`Integrate $z^n$ (integer $n$) once round the unit circle.`,
      widget: {
        type: 'StepReveal',
        props: {
          steps: [
            String.raw`Parametrise: $\gamma(t) = e^{it}$, $0 \le t \le 2\pi$, so $dz = ie^{it}\,dt$.`,
            String.raw`$\displaystyle\oint z^n\,dz = \int_0^{2\pi} e^{int}\,ie^{it}\,dt = i\int_0^{2\pi} e^{i(n+1)t}\,dt.$`,
            String.raw`If $n + 1 \ne 0$, the integrand goes round its circle $|n + 1|$ whole times and averages to $0$: the integral is $\left[\frac{e^{i(n+1)t}}{n+1}\right]_0^{2\pi} = 0$.`,
            String.raw`If $n = -1$, the integrand is $1$, and the integral is $i\cdot 2\pi$.`,
            String.raw`$$\oint_{|z|=1} z^n\,dz = \begin{cases} 2\pi i & n = -1,\\ 0 & \text{otherwise.}\end{cases}$$ Almost everything in this unit grows from this one fact.`,
          ],
        },
      },
    },
    {
      kind: 'numeric',
      prompt: String.raw`Compute $\dfrac{1}{2\pi i}\displaystyle\oint_{|z| = 5}\frac{dz}{z}$ (once anticlockwise round the circle of radius 5).`,
      answer: 1,
      why: String.raw`With $z = 5e^{it}$, $dz/z = i\,dt$, so the integral is $2\pi i$ and the answer is $1$, whatever the radius. The radius cancels: $\oint dz/z$ only measures how much the angle of $z$ turns.`,
    },
    {
      kind: 'explain',
      title: 'Winding numbers',
      body: String.raw`Why does $\oint dz/z$ count turns? Along the path, $\frac{dz}{z} = d(\log z) = d(\ln|z|) + i\,d(\arg z)$. Round a closed loop, $\ln|z|$ returns to its starting value, but $\arg z$ may have increased by $2\pi$ per anticlockwise turn.

So for any closed loop $\gamma$ not passing through $a$, the **winding number**
$$n(\gamma, a) = \frac{1}{2\pi i}\oint_\gamma \frac{dz}{z - a}$$
is an integer: the net number of anticlockwise turns $\gamma$ makes round $a$. Clockwise turns count as negative. Points outside the loop get $0$.`,
    },
    {
      kind: 'widget',
      title: 'Watch the integral count turns',
      body: String.raw`The point runs round the loop and the running value of $\oint dz/(z - a)$ is shown. Drag the pole × or the loop’s centre +. With $a$ inside, the total is $2\pi i$, so the bold readout ends at $1$. Drag $a$ outside and the arrow from $a$ swings back and forth but never turns all the way round: the total is $0$. Try two laps, clockwise, and the wobbly loop.`,
      widget: { type: 'MathWindingContour', props: { poles: [[0, 0, 1]], center: [0.3, 0.2], radius: 1.3 } },
    },
    {
      kind: 'mcq',
      prompt: String.raw`A closed loop goes **twice clockwise** round the point $a$. What is $\frac{1}{2\pi i}\oint \frac{dz}{z - a}$?`,
      choices: [String.raw`$-2$`, String.raw`$2$`, String.raw`$0$`, String.raw`$-4\pi i$`],
      answer: 0,
      why: String.raw`Each clockwise turn decreases $\arg(z - a)$ by $2\pi$, contributing $-2\pi i$ to the integral. Two turns give $-4\pi i$, and dividing by $2\pi i$ gives the winding number $-2$. The value $-4\pi i$ is the integral before dividing.`,
    },
    {
      kind: 'explain',
      title: 'Cauchy’s theorem',
      body: String.raw`**Cauchy’s theorem.** If $f$ is holomorphic on a region with no holes (*simply connected*) and $\gamma$ is a closed loop inside it, then
$$\oint_\gamma f(z)\,dz = 0.$$

Why, roughly: write $f\,dz = (u + iv)(dx + i\,dy)$ and apply Green’s theorem to the region $D$ inside $\gamma$:
$$\oint_\gamma f\,dz = \iint_D \big[(-v_x - u_y) + i(u_x - v_y)\big]\,dx\,dy.$$
Both brackets vanish by Cauchy–Riemann. (Goursat proved it without assuming $f'$ continuous, which Green needs.)

Consequence: integrals between two points do not depend on the path, and $f$ has an antiderivative.`,
    },
    {
      kind: 'truefalse',
      prompt: String.raw`$\oint_{|z|=1} \frac{dz}{z} = 2\pi i \ne 0$ contradicts Cauchy’s theorem.`,
      answer: false,
      why: String.raw`Cauchy’s theorem needs $f$ holomorphic on a hole-free region containing the loop *and its inside*. $1/z$ is undefined at $0$, which lies inside the unit circle. The puncture is exactly what the integral detects.`,
    },
    {
      kind: 'explain',
      title: 'Deforming the loop',
      body: String.raw`A useful reformulation: **you may deform a loop freely, as long as it never crosses a point where $f$ fails to be holomorphic.** The integral does not change.

So $\oint dz/(z - a)$ is the same for a tiny circle round $a$ and for any wiggly loop going once round $a$. Only the *topology* matters: which singular points are encircled, and how many times. This is the same idea as loops up to deformation in the [fundamental group](@math/fundamental-group).

Careful: a singularity inside does not force a nonzero answer. $\oint dz/(z - a)^2 = 0$ for every loop avoiding $a$, because $-1/(z - a)$ is an antiderivative. Only the power $-1$ survives.`,
      widget: { type: 'MathWindingContour', props: { poles: [[0, 0, 1]], power: 2, center: [0.2, 0.1], radius: 1.2, shape: 'blob' } },
    },
    {
      kind: 'explain',
      title: 'Cauchy’s integral formula',
      body: String.raw`Let $f$ be holomorphic on and inside a loop $\gamma$ going once anticlockwise round $a$. Then
$$f(a) = \frac{1}{2\pi i}\oint_\gamma \frac{f(z)}{z - a}\,dz.$$
Shrink $\gamma$ to a tiny circle round $a$. There $f(z) \approx f(a)$, and $\oint \frac{dz}{z - a} = 2\pi i$.

The values of $f$ on the boundary therefore **determine** it inside. Differentiating under the integral sign gives
$$f^{(n)}(a) = \frac{n!}{2\pi i}\oint_\gamma \frac{f(z)}{(z - a)^{n+1}}\,dz,$$
so $f$ is infinitely differentiable. One more consequence is **Liouville’s theorem**: a bounded entire function is constant.`,
    },
    {
      kind: 'numeric',
      prompt: String.raw`Compute $\dfrac{1}{2\pi i}\displaystyle\oint_{|z|=2}\frac{e^z}{z - 1}\,dz$ to 3 decimal places.`,
      answer: 2.71828,
      tolerance: 0.001,
      why: String.raw`$e^z$ is entire and $a = 1$ lies inside $|z| = 2$, so by Cauchy’s formula the value is $e^1 \approx 2.718$. The integral itself is $2\pi i e$.`,
    },
    {
      kind: 'multi',
      prompt: String.raw`Which integrals round the unit circle $|z| = 1$ (once, anticlockwise) are **zero**?`,
      choices: [String.raw`$\oint z^2\,dz$`, String.raw`$\oint e^z\,dz$`, String.raw`$\oint \frac{dz}{z - 3}$`, String.raw`$\oint \frac{dz}{z}$`, String.raw`$\oint \frac{\cos z}{z}\,dz$`],
      answers: [0, 1, 2],
      why: String.raw`$z^2$ and $e^z$ are entire, and $1/(z - 3)$ is holomorphic on the closed unit disc because its pole is outside. So Cauchy gives $0$ for all three. $\oint dz/z = 2\pi i$, and by Cauchy’s formula $\oint \frac{\cos z}{z}dz = 2\pi i\cos 0 = 2\pi i$.`,
    },
    {
      kind: 'order',
      prompt: String.raw`Order the steps to evaluate $\oint_\gamma \frac{g(z)}{z - a}\,dz$ with Cauchy’s formula.`,
      steps: [
        String.raw`Locate where the integrand fails to be holomorphic (here, $z = a$).`,
        String.raw`Check that $g$ is holomorphic on and inside $\gamma$.`,
        String.raw`Find the winding number $n(\gamma, a)$ (1 for a simple anticlockwise loop round $a$).`,
        String.raw`Answer: $2\pi i\,n(\gamma, a)\,g(a)$.`,
      ],
      why: String.raw`Cauchy’s formula needs $g$ holomorphic inside, and the winding number tells you how many times to count the point. If $a$ is outside the loop, the winding number is $0$ and so is the integral.`,
    },
    {
      kind: 'fill',
      prompt: String.raw`Cauchy’s integral formula: $f(a) =$ ___ $\oint_\gamma$ ___ $dz$, valid when $f$ is ___ on and inside $\gamma$.`,
      bank: ['1/(2πi)', '2πi', 'f(z)/(z − a)', 'f(z)(z − a)', 'holomorphic', 'continuous'],
      answer: ['1/(2πi)', 'f(z)/(z − a)', 'holomorphic'],
      why: String.raw`The $2\pi i$ from $\oint dz/(z - a)$ has to be divided out. Continuity is not enough: Cauchy’s theorem relies on complex differentiability.`,
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- $\int_\gamma f\,dz = \int_a^b f(\gamma(t))\gamma'(t)\,dt$.
- $\oint_{|z|=1} z^n dz = 2\pi i$ if $n = -1$, else $0$.
- Winding number: $n(\gamma, a) = \frac{1}{2\pi i}\oint\frac{dz}{z - a}$, an integer counting turns.
- **Cauchy’s theorem:** holomorphic on a hole-free region ⇒ $\oint f\,dz = 0$. Loops can be deformed without changing the integral, as long as they never cross a singularity.
- **Cauchy’s formula:** $f(a) = \frac{1}{2\pi i}\oint \frac{f(z)}{z - a}dz$. Boundary values fix everything inside, and $f$ is infinitely differentiable.

Next: [residues](@math/residues), the payoff for hard real integrals.`,
    },
  ],
  references: [
    { authors: 'E. M. Stein, R. Shakarchi', title: 'Complex Analysis (Princeton Lectures in Analysis II)', year: 2003, venue: 'Princeton University Press', detail: 'Ch. 1 §3 (integration along curves); Ch. 2 (Goursat’s theorem, Cauchy’s theorem in a disc, Cauchy integral formulas, Liouville)' },
    { authors: 'T. Needham', title: 'Visual Complex Analysis', year: 1997, venue: 'Oxford University Press', detail: 'Ch. 7 (winding numbers), Ch. 8 (Cauchy’s theorem), Ch. 9 (Cauchy’s formula)' },
    { authors: 'L. V. Ahlfors', title: 'Complex Analysis', year: 1979, venue: '3rd ed., McGraw-Hill', detail: 'Ch. 4 (complex integration)' },
    { authors: 'J. W. Brown, R. V. Churchill', title: 'Complex Variables and Applications', year: 2014, venue: '9th ed., McGraw-Hill', detail: 'Ch. 4 (integrals)' },
  ],
} satisfies LessonContent;
