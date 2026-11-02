import type { LessonContent } from '../../types';

export default {
  cards: [
    {
      kind: 'widget',
      title: 'Tangents as limits of secants',
      body: String.raw`The slope of the chord (secant) of $f$ from $a$ to $a + h$ is the **difference quotient** $\dfrac{f(a + h) - f(a)}{h}$. The **derivative** is its limit:

$$f'(a) = \lim_{h \to 0} \frac{f(a + h) - f(a)}{h},$$

a [functional limit](@math/continuity-epsilon-delta) in the ε–δ sense (with $h \ne 0$). If it exists, $f$ is **differentiable** at $a$. Below, $f(x) = x^2$, $a = 1$: the secant has slope $\frac{(1+h)^2 - 1}{h} = 2 + h$. Slide $h$ to $0$.`,
      widget: {
        type: 'FunctionPlot',
        props: {
          fns: ['x^2', '1 + (2+h)*(x-1)'], x: [-1, 3], y: [-1, 6],
          params: [{ name: 'h', min: -1, max: 1.5, value: 1 }], labels: ['f(x) = x²', 'secant, slope 2 + h'],
        },
      },
    },
    {
      kind: 'order',
      prompt: String.raw`Arrange the computation of $f'(a)$ for $f(x) = x^2$ from the definition.`,
      steps: [
        String.raw`Write the difference quotient $\dfrac{(a+h)^2 - a^2}{h}$ for $h \ne 0$.`,
        String.raw`Expand the numerator: $\dfrac{2ah + h^2}{h}$.`,
        String.raw`Cancel $h$ (allowed since $h \ne 0$): the quotient equals $2a + h$.`,
        String.raw`Let $h \to 0$: $f'(a) = 2a$.`,
      ],
      why: String.raw`The cancellation is legal only because the limit never evaluates at $h = 0$ — that is why limits use $0 < |h| < \delta$. Plugging $h = 0$ into the original quotient gives the meaningless $0/0$.`,
    },
    {
      kind: 'explain',
      title: 'Differentiable ⇒ continuous, not conversely',
      body: String.raw`If $f'(a)$ exists, then $f$ is continuous at $a$:

$$f(a+h) - f(a) = \frac{f(a+h) - f(a)}{h}\cdot h \;\longrightarrow\; f'(a)\cdot 0 = 0.$$

The converse fails. $f(x) = |x|$ is continuous at $0$, but its difference quotient $|h|/h$ is $+1$ for $h > 0$ and $-1$ for $h < 0$, so no limit: a **corner**. Worse, Weierstrass (1872) built a function continuous **everywhere** and differentiable **nowhere** — a curve that is all corners.`,
    },
    {
      kind: 'truefalse',
      prompt: String.raw`If $f$ is continuous at $a$, then $f$ is differentiable at $a$.`,
      answer: false,
      why: String.raw`$|x|$ is continuous at $0$ but not differentiable there (left and right slopes $-1$ and $+1$ disagree). Only the reverse implication holds: differentiable ⇒ continuous.`,
    },
    {
      kind: 'explain',
      title: 'Flat tops: Fermat and Rolle',
      body: String.raw`**Interior extremum theorem** (Fermat). If $f$ has a maximum or minimum at an **interior** point $c$ of an interval and $f'(c)$ exists, then $f'(c) = 0$.

*Why:* at a max, $\frac{f(c+h) - f(c)}{h} \le 0$ for $h > 0$ and $\ge 0$ for $h < 0$; the limit must be both $\le 0$ and $\ge 0$.

**Rolle's theorem.** If $f$ is continuous on $[a, b]$, differentiable on $(a, b)$, and $f(a) = f(b)$, then $f'(c) = 0$ for some $c \in (a, b)$.

*Why:* by the extreme value theorem $f$ has a max and a min on $[a, b]$. If both occur at the endpoints, $f$ is constant and any $c$ works; otherwise one is interior and Fermat applies.`,
    },
    {
      kind: 'fill',
      prompt: String.raw`Rolle: if $f$ is continuous on the ___ interval $[a,b]$, differentiable on the ___ interval $(a,b)$, and $f(a) = f(b)$, then $f'(c) =$ ___ for some $c \in (a, b)$.`,
      bank: ['closed', 'open', '0', '1', 'f(a)'],
      answer: ['closed', 'open', '0'],
      why: String.raw`Continuity on the **closed** interval feeds the extreme value theorem; differentiability is needed only **inside**, where Fermat is applied. Functions like $\sqrt{1 - x^2}$ on $[-1, 1]$, with infinite slope at the ends, still qualify.`,
    },
    {
      kind: 'widget',
      title: 'The mean value theorem',
      body: String.raw`**MVT.** If $f$ is continuous on $[a, b]$ and differentiable on $(a, b)$, then for some $c \in (a, b)$:

$$f'(c) = \frac{f(b) - f(a)}{b - a}.$$

Somewhere the instantaneous slope equals the average slope. (If you drove 120 km in one hour, at some instant the speedometer read exactly 120 km/h.) Here $f(x) = x^3$ on $[0, 2]$: the secant has slope $\frac{8 - 0}{2} = 4$. Slide $c$ until the tangent is parallel to it.`,
      widget: {
        type: 'FunctionPlot',
        props: {
          fns: ['x^3', '4*x', 'c^3 + 3*c^2*(x-c)'], x: [-0.5, 2.5], y: [-1, 10],
          params: [{ name: 'c', min: 0, max: 2, value: 0.5 }], labels: ['f(x) = x³', 'secant, slope 4', 'tangent at c'],
        },
      },
    },
    {
      kind: 'numeric',
      prompt: String.raw`For $f(x) = x^3$ on $[0, 2]$, find the $c \in (0, 2)$ promised by the MVT (3 decimals).`,
      answer: 1.155,
      tolerance: 0.002,
      why: String.raw`Solve $f'(c) = 3c^2 = 4$, so $c = 2/\sqrt3 \approx 1.1547$. (The negative root $-1.1547$ lies outside $(0, 2)$.)`,
    },
    {
      kind: 'widget',
      title: 'Proof: tilt Rolle',
      body: String.raw`The MVT is Rolle's theorem viewed at an angle: subtract the secant line.`,
      widget: {
        type: 'StepReveal',
        props: {
          steps: [
            String.raw`Let $m = \dfrac{f(b) - f(a)}{b - a}$ and $g(x) = f(x) - \big(f(a) + m(x - a)\big)$.`,
            String.raw`$g$ is continuous on $[a, b]$ and differentiable on $(a, b)$, being $f$ minus a line.`,
            String.raw`$g(a) = 0$ and $g(b) = f(b) - f(a) - m(b - a) = 0$.`,
            String.raw`By Rolle, $g'(c) = 0$ for some $c \in (a, b)$.`,
            String.raw`But $g'(c) = f'(c) - m$, so $f'(c) = m$. ∎`,
          ],
          notes: ['g measures the vertical gap between the graph and the secant.', '', 'The gap is zero at both ends.', '', ''],
        },
      },
    },
    {
      kind: 'mcq',
      prompt: String.raw`$f$ is continuous on $[a, b]$ and $f'(x) = 0$ for every $x \in (a, b)$. What follows?`,
      choices: [String.raw`$f$ is constant on $[a, b]$.`, String.raw`$f(x) = 0$ on $[a, b]$.`, String.raw`$f$ is linear but not necessarily constant.`, 'Nothing: f could still jump.'],
      answer: 0,
      why: String.raw`For any $x \in (a, b]$, the MVT on $[a, x]$ gives $f(x) - f(a) = f'(c)(x - a) = 0$. So $f \equiv f(a)$ — constant, not necessarily zero. This "obvious" fact genuinely needs the MVT (and hence completeness). Similarly, $f' > 0$ on an interval makes $f$ strictly increasing.`,
    },
    {
      kind: 'multi',
      prompt: String.raw`On $[-1, 1]$, which functions satisfy **all** hypotheses of the MVT?`,
      choices: [String.raw`$x^2$`, String.raw`$|x|$`, String.raw`$\sqrt[3]{x}$`, String.raw`$x^3$`, String.raw`$\sqrt{1 - x^2}$`],
      answers: [0, 3, 4],
      why: String.raw`Need continuity on $[-1,1]$ and differentiability on $(-1,1)$. $|x|$ has a corner at $0$; $\sqrt[3]{x}$ has a vertical tangent at $0$ (difference quotient $h^{-2/3} \to \infty$). $\sqrt{1 - x^2}$ is fine: its infinite slopes occur only at the endpoints $\pm1$, which are excluded from the open interval.`,
    },
    {
      kind: 'widget',
      title: "Taylor's theorem",
      body: String.raw`The MVT says $f(x) = f(a) + f'(c)(x - a)$. Push further. **Taylor's theorem** (Lagrange form): if $f$ has $n + 1$ derivatives on an interval containing $a$ and $x$, then

$$f(x) = \sum_{k=0}^{n} \frac{f^{(k)}(a)}{k!}(x - a)^k + \frac{f^{(n+1)}(c)}{(n+1)!}(x - a)^{n+1}$$

for some $c$ between $a$ and $x$. The sum is the **Taylor polynomial** $P_n$; the last term is the exact **remainder**. Below: $\sin x$ and its Taylor polynomials of degree 1, 3, 5 at $0$ — each hugs the curve for longer.`,
      widget: {
        type: 'FunctionPlot',
        props: {
          fns: ['sin(x)', 'x', 'x - x^3/6', 'x - x^3/6 + x^5/120'], x: [-6, 6], y: [-2, 2],
          labels: ['sin x', 'P₁', 'P₃', 'P₅'],
        },
      },
    },
    {
      kind: 'numeric',
      prompt: String.raw`The degree-3 Taylor polynomial of $e^x$ at $0$ is $P_3(x) = 1 + x + \frac{x^2}{2} + \frac{x^3}{6}$. Compute $P_3(1)$ (3 decimals).`,
      answer: 2.667,
      tolerance: 0.001,
      why: String.raw`$1 + 1 + 0.5 + 0.1\overline{6} = 8/3 \approx 2.667$. The true value $e \approx 2.718$; the next card bounds this error.`,
    },
    {
      kind: 'mcq',
      prompt: String.raw`What does Taylor's theorem guarantee about the error $|e - P_3(1)|$? (All derivatives of $e^x$ are $e^x$.)`,
      choices: [
        String.raw`It equals $e^c/24$ for some $c \in (0, 1)$, so it is less than $3/24 = 0.125$.`,
        String.raw`It is less than $0.01$.`,
        String.raw`It equals exactly $1/24$.`,
        String.raw`It cannot be bounded without already knowing $e$.`,
      ],
      answer: 0,
      why: String.raw`The remainder is $\frac{e^c}{4!}\cdot 1^4$ with $0 < c < 1$, and $e^c < e < 3$. The actual error is about $0.0516$ — inside the bound, but not below $0.01$. It is not $1/24 \approx 0.042$, since $c > 0$ makes $e^c > 1$. Only the crude fact $e < 3$ is needed, not the value of $e$.`,
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- $f'(a) = \lim_{h\to0} \frac{f(a+h) - f(a)}{h}$, an ε–δ limit. Differentiable ⇒ continuous, not conversely ($|x|$).
- **Fermat:** interior extremum ⇒ $f'(c) = 0$. **Rolle:** equal endpoint values ⇒ a flat tangent.
- **MVT:** $f'(c) = \frac{f(b) - f(a)}{b - a}$; proved by tilting Rolle. Consequences: $f' = 0$ ⇒ constant; $f' > 0$ ⇒ increasing.
- **Taylor:** $f = P_n + \frac{f^{(n+1)}(c)}{(n+1)!}(x-a)^{n+1}$ — an exact error formula you can bound.
- The chain of dependencies: completeness → extreme value theorem → Rolle → MVT → Taylor.

Next: [the Riemann integral](@math/riemann-integral).`,
    },
  ],
  references: [
    { authors: 'S. Abbott', title: 'Understanding Analysis', year: 2015, venue: '2nd ed., Springer (Undergraduate Texts in Mathematics)', detail: 'Ch. 5 (The derivative: §5.2 derivatives and the IVT, §5.3 the mean value theorems)' },
    { authors: 'M. Spivak', title: 'Calculus', year: 2008, venue: '4th ed., Publish or Perish', detail: 'Ch. 9 (The derivative), Ch. 11 (Significance of the derivative), Ch. 20 (Approximation by polynomial functions)' },
    { authors: 'W. Rudin', title: 'Principles of Mathematical Analysis', year: 1976, venue: '3rd ed., McGraw-Hill', detail: "Ch. 5 (Differentiation: mean value theorems, Taylor's theorem)" },
    { authors: 'T. Tao', title: 'Analysis I', year: 2016, venue: '3rd ed., Hindustan Book Agency / Springer', detail: 'Ch. 10 (Differentiation of functions)' },
  ],
} satisfies LessonContent;
