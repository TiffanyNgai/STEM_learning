import type { LessonContent } from '../../types';

export default {
  cards: [
    {
      kind: 'explain',
      title: 'Four dimensions, two tricks',
      body: String.raw`A complex function $w = f(z)$ takes a point $z = x + iy$ of one plane to a point $w$ of another. Its graph would need $2 + 2 = 4$ dimensions, so we cannot draw it directly. Two good substitutes:

1. **Maps:** draw a grid in the $z$-plane and watch how $f$ bends it (Needham’s approach).
2. **Domain colouring:** paint each $z$ with a colour that encodes the *value* $f(z)$ (Wegert’s phase portraits).

Algebraically, split the output into real and imaginary parts:
$$f(x + iy) = u(x, y) + i\,v(x, y),$$
two ordinary real functions of two variables.`,
    },
    {
      kind: 'explain',
      title: 'Example: squaring',
      body: String.raw`Take $f(z) = z^2$. Expanding $(x + iy)^2$:
$$u = x^2 - y^2,\qquad v = 2xy.$$
In polar form the picture is simpler. With $z = re^{i\theta}$,
$$z^2 = r^2e^{2i\theta}:$$
**square the distance, double the angle**. The first quadrant (angles $0$ to $\pi/2$) opens out to the whole upper half-plane (angles $0$ to $\pi$). Vertical and horizontal grid lines become two families of parabolas. In the widget, notice that they still cross at right angles. A later lesson explains why.`,
    },
    {
      kind: 'widget',
      title: 'Watch z² bend a grid',
      body: String.raw`The square $[0, 1.6]\times[0, 1.6]$ is carried to its image under $z^2$. The morph slider blends $z$ into $z^2$. The shaded cell shows a small square becoming a curved, but still nearly square, patch. Try $e^z$ and $1/z$ too.`,
      widget: { type: 'MathConformalGrid', props: { fn: 'z2' } },
    },
    {
      kind: 'numeric',
      prompt: String.raw`For $f(z) = z^2$, what is the real part $u$ at $z = 1 + 2i$?`,
      answer: -3,
      why: String.raw`$u = x^2 - y^2 = 1 - 4 = -3$. As a check, $(1 + 2i)^2 = 1 + 4i + 4i^2 = -3 + 4i$, so $v = 2xy = 4$. Forgetting that $i^2 = -1$ gives $+5$.`,
    },
    {
      kind: 'explain',
      title: 'The complex exponential',
      body: String.raw`Define $e^z$ for $z = x + iy$ by
$$e^{x + iy} = e^x(\cos y + i\sin y) = e^x e^{iy}.$$
So $\operatorname{Re} z$ sets the **distance** $e^x$ and $\operatorname{Im} z$ sets the **angle** $y$. Consequences:

- A vertical line $x = c$ wraps round the circle of radius $e^c$.
- A horizontal line $y = c$ goes to the ray from $0$ at angle $c$.
- $e^{z + 2\pi i} = e^z$: the exponential is **periodic** with period $2\pi i$.
- $e^z$ is never $0$, because $e^x > 0$.

The rule $e^{z + w} = e^ze^w$ still holds.`,
    },
    {
      kind: 'mcq',
      prompt: String.raw`Where does $w = e^z$ send the horizontal line $\operatorname{Im} z = \pi/2$?`,
      choices: [
        String.raw`The positive imaginary axis (without $0$)`,
        String.raw`The unit circle`,
        String.raw`The whole imaginary axis`,
        String.raw`The horizontal line $\operatorname{Im} w = \pi/2$`,
      ],
      answer: 0,
      why: String.raw`$e^{x + i\pi/2} = e^x\cdot i$. As $x$ runs over $\mathbb R$, $e^x$ takes every positive value, so we get exactly the points $ti$ with $t > 0$. The unit circle is the image of the *vertical* line $x = 0$. The negative imaginary axis needs angle $-\pi/2$.`,
    },
    {
      kind: 'explain',
      title: 'Domain colouring',
      body: String.raw`To colour the point $z$, compute $f(z)$ and use

- **hue** $= \arg f(z)$: red for positive real values, then yellow, green, cyan (negative real), blue and magenta going anticlockwise;
- **brightness** $= |f(z)|$: black where $f = 0$, white where $f$ blows up, mid-tone where $|f| = 1$.

The plot of $f(z) = z$ is the colour wheel itself. Its key property: walk anticlockwise round a **zero** of order $m$ (where $f \approx c(z - a)^m$) and the colours cycle through the rainbow **$m$ times**. Wegert calls these pictures *phase portraits*.`,
    },
    {
      kind: 'widget',
      title: 'Paint the plane with f',
      body: String.raw`This is $f(z) = z^3 - 1$. Find its three black zeros, the cube roots of unity, and check that each is surrounded by one full rainbow. Far away, $z^3$ dominates, so a big circle sees the colours three times. Tap to probe values. "Spin phase" makes the colours flow round zeros (anticlockwise) and poles (clockwise).`,
      widget: { type: 'MathDomainColoring', props: { fn: 'z3-1' } },
    },
    {
      kind: 'multi',
      prompt: String.raw`Which statements about the domain colouring of $f(z) = z^3 - 1$ are true?`,
      choices: [
        String.raw`There are three black points, at $1$, $e^{2\pi i/3}$ and $e^{4\pi i/3}$`,
        'Around each black point the colours cycle exactly once',
        String.raw`There is a white point (pole) at $0$`,
        'Along a large circle round the origin the colours cycle three times',
      ],
      answers: [0, 1, 3],
      why: String.raw`The zeros of $z^3 - 1$ are the three cube roots of unity. Each is simple (order 1), so each sees one rainbow. A polynomial has no poles: at $0$ the value is $f(0) = -1$, shown in cyan, not white. For large $|z|$, $f \approx z^3$, whose argument is $3\arg z$.`,
    },
    {
      kind: 'explain',
      title: 'Poles and the map 1/z',
      body: String.raw`For $f(z) = 1/z$:
$$\left|\tfrac1z\right| = \tfrac{1}{|z|},\qquad \arg\tfrac1z = -\arg z.$$
It turns the plane **inside out** across the unit circle and reflects angles. At $z = 0$ it blows up. This is a **pole**: $|f| \to \infty$, painted white.

Round a pole the colours cycle in the **opposite** direction to a zero, because the argument decreases as you go anticlockwise. Near a pole of order $m$, $f \approx c/(z - a)^m$, and the colours cycle $m$ times backwards.

So one picture shows every zero and pole of a function, with its order and type.`,
    },
    {
      kind: 'truefalse',
      prompt: String.raw`Walking anticlockwise round $0$, the colours of $1/z$ appear in the opposite order to those of $z$.`,
      answer: true,
      why: String.raw`$\arg(1/z) = -\arg z$, so as $\arg z$ increases, the hue of $1/z$ runs backwards: red, magenta, blue, … This reversed cycle is how you tell a pole from a zero in a phase portrait (besides white versus black).`,
    },
    {
      kind: 'match',
      prompt: 'Match each function with a feature of its domain colouring.',
      pairs: [
        [String.raw`$z^2$`, 'Colours cycle twice around a black point at 0'],
        [String.raw`$1/z$`, 'White point at 0, colours reversed'],
        [String.raw`$e^z$`, 'Pattern repeats every 2π vertically; no black points'],
        [String.raw`$z - 1$`, 'One simple black point at 1'],
      ],
      why: String.raw`$z^2$ has a double zero, so two rainbows. $1/z$ has a simple pole. $e^z$ has period $2\pi i$ and never vanishes. $z - 1$ is the colour wheel shifted to $1$.`,
    },
    {
      kind: 'explain',
      title: 'When functions have many values',
      body: String.raw`Since $e^z$ has period $2\pi i$, it cannot have a single-valued inverse. Solving $e^w = z$ gives
$$\log z = \ln|z| + i\arg z,$$
which is defined only up to adding $2\pi i k$, one value for each choice of $\arg z$. Similarly $\sqrt z$ has two values $\pm$.

To get an honest function, choose a **branch**: for example, insist $-\pi < \arg z \le \pi$. The price is a **branch cut** along the negative real axis, where the value jumps. In a domain colouring the cut shows as a line where colours change abruptly.`,
    },
    {
      kind: 'mcq',
      prompt: String.raw`Which set is exactly the set of solutions of $e^z = 1$?`,
      choices: [
        String.raw`$z = 2\pi i k$ for every integer $k$`,
        String.raw`Only $z = 0$`,
        String.raw`$z = i\pi k$ for every integer $k$`,
        String.raw`Every $z$ with $|z| = 1$`,
      ],
      answer: 0,
      why: String.raw`$e^{x + iy} = 1$ needs modulus $e^x = 1$, so $x = 0$, and angle $y$ a multiple of $2\pi$. So $z = 2\pi i k$. Odd multiples of $i\pi$ give $-1$, and $0$ is only one solution among infinitely many.`,
    },
    {
      kind: 'fill',
      prompt: String.raw`Writing $f = u + iv$ with $z = x + iy$: for $f(z) = z^2$, $u =$ ___ and $v =$ ___. For $f(z) = e^z$, $|f| =$ ___.`,
      bank: ['x² − y²', 'x² + y²', '2xy', 'xy', 'eˣ', 'eʸ'],
      answer: ['x² − y²', '2xy', 'eˣ'],
      why: String.raw`$(x + iy)^2 = x^2 + 2ixy - y^2$. And $|e^{x + iy}| = e^x|e^{iy}| = e^x$, because $|e^{iy}| = 1$. The imaginary part of $z$ only turns the output.`,
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- A complex function $f = u + iv$ maps a plane to a plane. Visualise it by **warping a grid** or by **domain colouring**.
- Domain colouring: hue $= \arg f$, brightness $= |f|$. Zeros are black, poles white. The colours wind $m$ times round a zero or pole of order $m$, in opposite directions for the two.
- $z^2$ squares distances and doubles angles. $1/z$ turns the plane inside out. $e^{x + iy} = e^xe^{iy}$ is $2\pi i$-periodic and never $0$.
- Inverses such as $\log$ and $\sqrt{\ }$ are many-valued and need branch cuts.

Next: what it means to *differentiate* such a map — [holomorphic functions](@math/holomorphic-functions).`,
    },
  ],
  references: [
    { authors: 'T. Needham', title: 'Visual Complex Analysis', year: 1997, venue: 'Oxford University Press', detail: 'Ch. 2 (complex functions as transformations)' },
    { authors: 'E. Wegert', title: 'Visual Complex Functions: An Introduction with Phase Portraits', year: 2012, venue: 'Birkhäuser' },
    { authors: 'E. Wegert, G. Semmler', title: 'Phase plots of complex functions: a journey in illustration', year: 2011, venue: 'Notices of the AMS 58(6), 768–780' },
    { authors: 'J. W. Brown, R. V. Churchill', title: 'Complex Variables and Applications', year: 2014, venue: '9th ed., McGraw-Hill', detail: 'Ch. 2–3 (functions, mappings, elementary functions, branches of log)' },
  ],
} satisfies LessonContent;
