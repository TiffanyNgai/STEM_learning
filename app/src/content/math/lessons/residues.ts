import type { LessonContent } from '../../types';

// Semicircular contour used to compute ∫ dx/(1+x²): the segment [−R, R] plus the upper arc, enclosing the pole at i.
const semicircleSvg = `<svg viewBox="0 0 320 170" xmlns="http://www.w3.org/2000/svg" font-family="inherit">
  <line x1="20" y1="140" x2="300" y2="140" stroke="var(--muted)" stroke-width="1"/>
  <line x1="160" y1="20" x2="160" y2="160" stroke="var(--muted)" stroke-width="1"/>
  <path d="M60,140 L260,140 A100,100 0 0 0 60,140 Z" fill="var(--c2)" fill-opacity="0.08" stroke="var(--c2)" stroke-width="2.2"/>
  <path d="M150,136 l10,4 l-10,4z" fill="var(--c2)"/>
  <path d="M-5,-4 L5,0 L-5,4z" fill="var(--c2)" transform="translate(230.7,69.3) rotate(-135)"/>
  <g stroke="var(--c5)" stroke-width="2.2"><path d="M155,95 l10,10 M155,105 l10,-10"/></g>
  <text x="170" y="98" font-size="11" fill="var(--c5)">i  (residue 1/2i)</text>
  <text x="168" y="164" font-size="10" fill="var(--muted)">(pole −i: below, outside)</text>
  <text x="52" y="156" font-size="10" fill="var(--fg)">−R</text>
  <text x="252" y="156" font-size="10" fill="var(--fg)">R</text>
  <text x="236" y="52" font-size="10" fill="var(--c2)">arc C_R</text>
  <circle r="4" fill="var(--c2)">
    <animateMotion dur="6s" repeatCount="indefinite" path="M60,140 L260,140 A100,100 0 0 0 60,140"/>
  </circle>
</svg>`;

export default {
  cards: [
    {
      kind: 'explain',
      title: 'Only one coefficient survives',
      body: String.raw`Near an isolated singular point $a$, a holomorphic function can be expanded in a **Laurent series**, a power series that may include negative powers:
$$f(z) = \sum_{n=-\infty}^{\infty} c_n (z - a)^n = \dots + \frac{c_{-2}}{(z - a)^2} + \frac{c_{-1}}{z - a} + c_0 + c_1(z - a) + \dots$$
If finitely many negative powers appear and the lowest is $(z - a)^{-m}$, then $a$ is a **pole of order $m$**.

Integrate term by term round a small circle about $a$. From [the last lesson](@math/contour-integrals), every power gives $0$ except $n = -1$, which gives $2\pi i$. So
$$\oint f\,dz = 2\pi i\,c_{-1}.$$
The number $c_{-1}$ is the **residue** $\operatorname{Res}(f, a)$: what is "left over" after integration.`,
    },
    {
      kind: 'explain',
      title: 'The residue theorem',
      body: String.raw`Let $f$ be holomorphic on a hole-free region except at isolated points $a_1, \dots, a_k$, and let $\gamma$ be a closed loop avoiding them. Deform $\gamma$ into small circles round each $a_j$, counted with their [winding numbers](@math/contour-integrals). Then
$$\oint_\gamma f\,dz = 2\pi i\sum_j n(\gamma, a_j)\,\operatorname{Res}(f, a_j).$$
For a simple anticlockwise loop this reads: **$2\pi i$ times the sum of the residues inside.** Poles outside contribute nothing.

A hard integral becomes a little algebra at a few points.`,
    },
    {
      kind: 'widget',
      title: 'Two poles, one loop',
      body: String.raw`$f(z) = \frac{1}{z + 0.9} - \frac{2}{z - 1}$ has residue $1$ at $-0.9$ and $-2$ at $1$. Watch $\frac{1}{2\pi i}\oint f\,dz$ build up. Then drag the loop (+) or the poles (×) so that it encloses one pole, both, or neither, and compare the result with $\sum c\cdot n$.`,
      widget: { type: 'MathWindingContour', props: { poles: [[-0.9, 0, 1], [1, 0, -2]], center: [0, 0.2], radius: 1.6 } },
    },
    {
      kind: 'explain',
      title: 'Computing residues',
      body: String.raw`You rarely need the whole Laurent series.

- **Simple pole** (order 1): $\operatorname{Res}(f, a) = \lim_{z\to a}(z - a)f(z)$.
- **Quotient** $f = g/h$ with $h(a) = 0$, $h'(a) \ne 0$ and $g(a) \ne 0$: a simple pole with $\operatorname{Res} = \dfrac{g(a)}{h'(a)}$.
- **Pole of order $m$**: $\operatorname{Res} = \dfrac{1}{(m-1)!}\lim_{z\to a}\dfrac{d^{m-1}}{dz^{m-1}}\big[(z - a)^m f(z)\big]$.

Example: $\frac{1}{z^2 + 1}$ has simple poles at $\pm i$. With $g = 1$ and $h' = 2z$, the residue at $i$ is $\frac{1}{2i} = -\frac{i}{2}$.`,
    },
    {
      kind: 'mcq',
      prompt: String.raw`What is the residue of $\dfrac{e^z}{z^3}$ at $z = 0$?`,
      choices: [String.raw`$\tfrac12$`, String.raw`$1$`, String.raw`$0$`, String.raw`$\tfrac16$`],
      answer: 0,
      why: String.raw`$\frac{e^z}{z^3} = \frac{1}{z^3}\left(1 + z + \frac{z^2}{2} + \frac{z^3}{6} + \dots\right) = \frac{1}{z^3} + \frac{1}{z^2} + \frac{1/2}{z} + \frac16 + \dots$ The coefficient of $1/z$ is $\frac12$. The value $\frac16$ is the constant term, not the residue.`,
    },
    {
      kind: 'match',
      prompt: String.raw`Match each function with its residue at $z = 0$.`,
      pairs: [
        [String.raw`$\dfrac{3}{z}$`, String.raw`$3$`],
        [String.raw`$\dfrac{1}{z^2}$`, String.raw`$0$`],
        [String.raw`$\dfrac{e^z}{z^2}$`, String.raw`$1$`],
        [String.raw`$\dfrac{1}{z(z - 1)}$`, String.raw`$-1$`],
      ],
      why: String.raw`$1/z^2$ is a pole of order 2 with no $1/z$ term, so its residue is $0$. $e^z/z^2 = 1/z^2 + 1/z + \dots$ has residue $1$. For $\frac{1}{z(z-1)}$ the pole at $0$ is simple: $\lim_{z\to0} z\cdot\frac{1}{z(z-1)} = -1$.`,
    },
    {
      kind: 'widget',
      title: 'A real integral via a semicircle',
      body: String.raw`Goal: $\displaystyle I = \int_{-\infty}^{\infty}\frac{dx}{1 + x^2}$. Close the real segment $[-R, R]$ with the upper semicircle $C_R$.`,
      widget: {
        type: 'StepReveal',
        props: {
          steps: [
            String.raw`Let $f(z) = \frac{1}{1 + z^2} = \frac{1}{(z - i)(z + i)}$. For $R > 1$ the closed contour (segment plus arc) encloses only the pole $z = i$.`,
            String.raw`Residue at $i$: $\lim_{z\to i}(z - i)f(z) = \frac{1}{2i}$. By the residue theorem, segment + arc $= 2\pi i\cdot\frac{1}{2i} = \pi$.`,
            String.raw`On the arc $|z| = R$: $|1 + z^2| \ge R^2 - 1$, and the arc has length $\pi R$. So $\left|\int_{C_R} f\,dz\right| \le \frac{\pi R}{R^2 - 1} \to 0$ as $R\to\infty$.`,
            String.raw`Hence $\displaystyle\int_{-\infty}^{\infty}\frac{dx}{1 + x^2} = \pi$. (Check: $[\arctan x]_{-\infty}^{\infty} = \pi$ ✓.)`,
          ],
        },
      },
    },
    {
      kind: 'widget',
      title: 'The contour',
      body: String.raw`The dot traces the closed contour: along the real axis, then back over the arc. Only the pole at $i$ is inside; $-i$ is below the axis.`,
      widget: { type: 'SvgDiagram', props: { svg: semicircleSvg } },
    },
    {
      kind: 'numeric',
      prompt: String.raw`Use the same method to compute $\displaystyle\int_{-\infty}^{\infty}\frac{dx}{x^2 + 4}$. Give a decimal.`,
      answer: Math.PI / 2,
      tolerance: 0.001,
      why: String.raw`The poles are at $\pm 2i$. Inside the upper semicircle is $2i$, with residue $\frac{1}{2\cdot 2i} = \frac{1}{4i}$. So $I = 2\pi i\cdot\frac{1}{4i} = \frac{\pi}{2} \approx 1.571$. Check: $\left[\tfrac12\arctan\tfrac x2\right]_{-\infty}^{\infty} = \tfrac{\pi}{2}$.`,
    },
    {
      kind: 'explain',
      title: 'More tricks from the same idea',
      body: String.raw`- **Fourier-type integrals.** For $\int_{-\infty}^\infty \frac{\cos x}{1 + x^2}dx$, integrate $\frac{e^{iz}}{1 + z^2}$ instead and take the real part. In the upper half-plane $|e^{iz}| = e^{-\operatorname{Im} z} \le 1$, so the arc still vanishes. Residue at $i$: $\frac{e^{-1}}{2i}$, giving $\frac{\pi}{e}$. These integrals are the bread and butter of the [Fourier transform](@math/fourier-transform).
- **Trigonometric integrals** $\int_0^{2\pi} R(\cos\theta, \sin\theta)\,d\theta$: substitute $z = e^{i\theta}$ to get an integral round the unit circle.
- **Argument principle.** $\frac{1}{2\pi i}\oint \frac{f'}{f}dz = Z - P$, the number of zeros minus poles inside, counted with order. In a [domain colouring](@math/complex-functions) this is the net number of times the colours cycle along the loop.`,
    },
    {
      kind: 'multi',
      prompt: String.raw`Let $f(z) = \dfrac{1}{z(z - 2)}$ and let $\gamma$ be the circle $|z| = 1$, once anticlockwise. Which statements are true?`,
      choices: [
        String.raw`$\operatorname{Res}(f, 0) = -\tfrac12$`,
        String.raw`The pole at $z = 2$ lies outside $\gamma$`,
        String.raw`$\oint_\gamma f\,dz = -\pi i$`,
        String.raw`$\oint_\gamma f\,dz = 0$ because the two residues sum to zero`,
      ],
      answers: [0, 1, 2],
      why: String.raw`$\operatorname{Res}(f, 0) = \lim_{z\to0}\frac{1}{z - 2} = -\frac12$ and $\operatorname{Res}(f, 2) = \frac12$. The residues do sum to $0$, but only poles **inside** $\gamma$ count, so $\oint = 2\pi i\cdot(-\tfrac12) = -\pi i$. A big circle enclosing both poles would give $0$.`,
    },
    {
      kind: 'truefalse',
      prompt: 'A function can have a pole whose residue is zero.',
      answer: true,
      why: String.raw`$1/z^2$ has a pole of order 2 at $0$, but its Laurent series has no $1/z$ term, so the residue is $0$ and $\oint dz/z^2 = 0$. Being a pole and having nonzero residue are different things.`,
    },
    {
      kind: 'order',
      prompt: String.raw`Order the steps for computing $\int_{-\infty}^\infty f(x)\,dx$ by residues, for a rational $f$ that decays fast enough.`,
      steps: [
        String.raw`Extend $f$ to complex $z$ and find its poles.`,
        'Close the real segment [−R, R] with a large semicircle in the upper half-plane.',
        'Compute the residues at the poles inside (upper half-plane).',
        String.raw`Apply the residue theorem: segment + arc $= 2\pi i\sum$ residues.`,
        String.raw`Show the arc integral tends to $0$ as $R\to\infty$, leaving the real integral.`,
      ],
      why: String.raw`You need the poles before choosing which ones the contour encloses. Bounding the arc is what turns a statement about a closed contour into one about the real line. For rational $f$ this works when the denominator’s degree exceeds the numerator’s by at least 2.`,
    },
    {
      kind: 'fill',
      prompt: String.raw`Residue theorem: for a simple anticlockwise loop, $\oint f\,dz =$ ___ times the sum of the residues of the poles ___ the loop. The residue at a simple pole $a$ is $\lim_{z\to a}$ ___.`,
      bank: ['2πi', '1/(2πi)', 'inside', 'outside', '(z − a) f(z)', 'f(z)/(z − a)'],
      answer: ['2πi', 'inside', '(z − a) f(z)'],
      why: String.raw`Only enclosed singularities contribute, each giving $2\pi i\cdot c_{-1}$. Multiplying by $(z - a)$ cancels the simple pole and leaves $c_{-1}$ as $z \to a$.`,
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- Laurent series near an isolated singularity; the **residue** is the coefficient $c_{-1}$ of $(z - a)^{-1}$.
- Residue theorem: $\oint_\gamma f\,dz = 2\pi i\sum_j n(\gamma, a_j)\operatorname{Res}(f, a_j)$. Only enclosed poles count.
- Simple pole: $\operatorname{Res} = \lim (z - a)f(z) = g(a)/h'(a)$ for $f = g/h$.
- Real integrals: close with a semicircle, show the arc vanishes, and sum the residues in the upper half-plane. For example, $\int\frac{dx}{1+x^2} = \pi$ and $\int\frac{\cos x}{1 + x^2}dx = \pi/e$.
- The argument principle counts zeros minus poles with $\oint f'/f$.`,
    },
  ],
  references: [
    { authors: 'E. M. Stein, R. Shakarchi', title: 'Complex Analysis (Princeton Lectures in Analysis II)', year: 2003, venue: 'Princeton University Press', detail: 'Ch. 3 §1–2 (zeros, poles, the residue formula and examples), §4 (argument principle)' },
    { authors: 'L. V. Ahlfors', title: 'Complex Analysis', year: 1979, venue: '3rd ed., McGraw-Hill', detail: 'Ch. 4 §5 (the calculus of residues; evaluation of definite integrals)' },
    { authors: 'J. W. Brown, R. V. Churchill', title: 'Complex Variables and Applications', year: 2014, venue: '9th ed., McGraw-Hill', detail: 'Ch. 5 (Laurent series), Ch. 6–7 (residues and poles; applications to improper integrals)' },
    { authors: 'T. Needham', title: 'Visual Complex Analysis', year: 1997, venue: 'Oxford University Press', detail: 'Ch. 9 (Cauchy’s formula, Laurent series and residues)' },
  ],
} satisfies LessonContent;
