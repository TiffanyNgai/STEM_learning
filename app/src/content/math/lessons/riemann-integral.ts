import type { LessonContent } from '../../types';

// Dirichlet function on [0,1]: every piece of every partition contains rationals (value 1) and irrationals (value 0).
const dots = Array.from({ length: 70 }, (_, i) => {
  const x = 30 + ((i * 37) % 70) * 3.9;
  const top = i % 2 === 0;
  return `<circle cx="${x.toFixed(1)}" cy="${top ? 40 : 120}" r="1.8" fill="${top ? 'var(--c3)' : 'var(--c1)'}"/>`;
}).join('');
const dirichletSvg = `<svg viewBox="0 0 320 175" xmlns="http://www.w3.org/2000/svg" font-family="inherit">
  <line x1="26" y1="120" x2="306" y2="120" stroke="var(--fg)"/>
  <line x1="26" y1="20" x2="26" y2="124" stroke="var(--fg)"/>
  <text x="18" y="43" font-size="10" text-anchor="end" fill="var(--fg)">1</text>
  <text x="18" y="123" font-size="10" text-anchor="end" fill="var(--fg)">0</text>
  ${[0, 1, 2, 3].map((k) => `<rect x="${30 + k * 69}" y="40" width="69" height="80" fill="var(--c3)" fill-opacity="0.12" stroke="var(--c3)" stroke-width="0.8"/>`).join('')}
  ${dots}
  <text x="160" y="140" font-size="9" text-anchor="middle" fill="var(--fg)">orange: rational x (f = 1) · green: irrational x (f = 0)</text>
  <text x="160" y="155" font-size="10" text-anchor="middle" fill="var(--c3)">every piece: sup = 1, inf = 0 ⇒ U = 1, L = 0</text>
  <text x="160" y="170" font-size="10" text-anchor="middle" fill="var(--c5)">for every partition, so U − L never shrinks</text>
</svg>`;

export default {
  cards: [
    {
      kind: 'explain',
      title: 'Area, made precise',
      body: String.raw`What **is** the area under a curve? For rectangles we know; for curves we approximate by rectangles and take a limit. Riemann (1854) made this rigorous; the cleanest version uses Darboux's **upper and lower sums**.

Let $f$ be **bounded** on $[a, b]$. A **partition** $P$ is a finite list $a = x_0 < x_1 < \cdots < x_n = b$, cutting $[a, b]$ into pieces of width $\Delta x_k = x_k - x_{k-1}$. On each piece let

$$m_k = \inf_{[x_{k-1}, x_k]} f, \qquad M_k = \sup_{[x_{k-1}, x_k]} f,$$

the lowest and highest the function gets there ([inf and sup](@math/real-numbers-completeness)).`,
    },
    {
      kind: 'explain',
      title: 'Upper and lower sums',
      body: String.raw`$$L(f, P) = \sum_{k=1}^n m_k\,\Delta x_k, \qquad U(f, P) = \sum_{k=1}^n M_k\,\Delta x_k.$$

$L$ uses rectangles that fit **under** the graph, $U$ rectangles that poke **over** it, so $L(f, P) \le U(f, P)$. Adding points to a partition (a **refinement**) can only raise $L$ and lower $U$. Hence every lower sum is $\le$ every upper sum.

**Definition.** $f$ is **(Riemann) integrable** on $[a, b]$ if $\sup_P L(f, P) = \inf_P U(f, P)$; this common value is $\int_a^b f$. Equivalently (**Riemann's criterion**): for every $\varepsilon > 0$ there is a partition with $U(f, P) - L(f, P) < \varepsilon$.`,
    },
    {
      kind: 'widget',
      title: 'Squeeze the area',
      body: String.raw`$f(x) = x^2$ on $[0, 1]$ with $n$ equal pieces. Green = lower sum, orange = the extra in the upper sum. Raise $n$: both sums close in on $\int_0^1 x^2\,dx = \tfrac13$, and $U - L$ shrinks — here it equals exactly $1/n$.`,
      widget: { type: 'MathRiemannSums', props: { fn: 'x^2', a: 0, b: 1, n: 4, exact: 1 / 3 } },
    },
    {
      kind: 'numeric',
      prompt: String.raw`Let $f(x) = x$ on $[0, 1]$, with $4$ equal pieces. Compute the upper sum $U(f, P)$.`,
      answer: 0.625,
      why: String.raw`$f$ is increasing, so $M_k$ is the right-endpoint value: $\tfrac14\left(\tfrac14 + \tfrac24 + \tfrac34 + 1\right) = \tfrac14 \cdot \tfrac{10}{4} = 0.625$. The lower sum uses left endpoints: $\tfrac14(0 + \tfrac14 + \tfrac24 + \tfrac34) = 0.375$. The true area $0.5$ sits between.`,
    },
    {
      kind: 'explain',
      title: 'Monotone functions are integrable',
      body: String.raw`For an **increasing** $f$ on $[a, b]$ and $n$ equal pieces of width $h = (b - a)/n$, $M_k = f(x_k)$ and $m_k = f(x_{k-1})$. The difference **telescopes**:

$$U - L = h\sum_{k=1}^n \big(f(x_k) - f(x_{k-1})\big) = \frac{(b - a)\big(f(b) - f(a)\big)}{n}.$$

This tends to $0$, so Riemann's criterion holds: every monotone function is integrable — even one with infinitely many jumps. For $x^2$ on $[0, 1]$: $U - L = \frac{1 \cdot 1}{n} = \frac1n$, as the widget showed.`,
    },
    {
      kind: 'numeric',
      prompt: String.raw`For $f(x) = x^2$ on $[0, 1]$ with $n$ equal pieces, what is the smallest $n$ with $U - L < 0.01$?`,
      answer: 101,
      why: String.raw`$U - L = 1/n$ exactly, and $1/n < 0.01 \iff n > 100$. At $n = 100$ the gap is exactly $0.01$, not less.`,
    },
    {
      kind: 'explain',
      title: 'A function that cannot be integrated',
      body: String.raw`**Dirichlet's function:** $f(x) = 1$ if $x$ is rational, $0$ if irrational. Every interval, however small, contains both kinds of number ([density](@math/real-numbers-completeness)). So on **every** piece of **every** partition, $M_k = 1$ and $m_k = 0$:

$$U(f, P) = 1,\quad L(f, P) = 0 \quad\text{for all } P.$$

Upper and lower integrals disagree: $f$ is **not** Riemann integrable. (The more powerful Lebesgue integral handles it and gives $0$, since the rationals are "negligible".)`,
      widget: { type: 'SvgDiagram', props: { svg: dirichletSvg } },
    },
    {
      kind: 'truefalse',
      prompt: String.raw`Every bounded function on $[a, b]$ is Riemann integrable.`,
      answer: false,
      why: String.raw`Dirichlet's function is bounded (between $0$ and $1$) yet $U - L = 1$ for every partition. Boundedness is required for the definition to make sense, but it is not enough.`,
    },
    {
      kind: 'explain',
      title: 'Which functions are integrable?',
      body: String.raw`- **Continuous** functions on $[a, b]$. Key step: they are **uniformly** continuous ([Heine–Cantor](@math/continuity-epsilon-delta)), so for a fine enough partition $M_k - m_k < \varepsilon/(b - a)$ on every piece, giving $U - L < \varepsilon$.
- **Monotone** functions (previous card).
- Bounded functions with **finitely many** discontinuities.

The full answer is **Lebesgue's criterion**: a bounded $f$ is Riemann integrable iff its set of discontinuities has *measure zero* (can be covered by intervals of arbitrarily small total length). Thomae's function — $1/q$ at $x = p/q$ in lowest terms, $0$ at irrationals — is discontinuous at every rational yet integrable, with integral $0$.`,
    },
    {
      kind: 'multi',
      prompt: String.raw`Which functions are Riemann integrable on $[0, 1]$?`,
      choices: [
        String.raw`$x^2$`,
        String.raw`a step function: $0$ on $[0, \tfrac12)$, $1$ on $[\tfrac12, 1]$`,
        "Dirichlet's function (1 on rationals, 0 on irrationals)",
        String.raw`$1/x$ for $x > 0$, with $f(0) = 0$`,
        "Thomae's function (1/q at p/q, 0 at irrationals)",
      ],
      answers: [0, 1, 4],
      why: String.raw`$x^2$ is continuous; the step function has one discontinuity; Thomae's function is discontinuous only on the (measure-zero) rationals. Dirichlet's function is discontinuous everywhere. $1/x$ is **unbounded**, so upper sums are infinite — it is not Riemann integrable (only as an improper integral, which here diverges anyway).`,
    },
    {
      kind: 'widget',
      title: 'The fundamental theorem of calculus',
      body: String.raw`Let $f$ be integrable on $[a, b]$ and $F(x) = \int_a^x f$, the accumulated area.

- **FTC I.** $F$ is continuous, and if $f$ is continuous at $c$ then $F'(c) = f(c)$: the rate at which area grows equals the current height.
- **FTC II.** If $G' = f$ on $[a, b]$ (and $f$ is integrable), then $\int_a^b f = G(b) - G(a)$.

Below: $f(x) = x^2$ and its accumulated area $F(x) = x^3/3$. Move $b$: the tangent to $F$ at $b$ has slope exactly $f(b) = b^2$.`,
      widget: {
        type: 'FunctionPlot',
        props: {
          fns: ['x^2', 'x^3/3', 'b^3/3 + b^2*(x-b)'], x: [-0.2, 2.2], y: [-0.5, 3],
          params: [{ name: 'b', min: 0, max: 2, value: 1.2 }], labels: ['f(x) = x²', 'F(x) = ∫₀ˣ f', 'tangent to F, slope f(b)'],
        },
      },
    },
    {
      kind: 'widget',
      title: 'Proof of FTC II',
      body: String.raw`The mean value theorem does all the work, one piece at a time.`,
      widget: {
        type: 'StepReveal',
        props: {
          steps: [
            String.raw`Take any partition $P$: $a = x_0 < \cdots < x_n = b$.`,
            String.raw`Telescope: $G(b) - G(a) = \sum_{k=1}^n \big(G(x_k) - G(x_{k-1})\big)$.`,
            String.raw`By the [MVT](@math/derivative-rigorous), each term equals $G'(t_k)\,\Delta x_k = f(t_k)\,\Delta x_k$ for some $t_k$ in the $k$-th piece.`,
            String.raw`Since $m_k \le f(t_k) \le M_k$: $\ L(f, P) \le G(b) - G(a) \le U(f, P)$ for **every** $P$.`,
            String.raw`The only number between all lower and all upper sums is $\int_a^b f$ (as $f$ is integrable). So $\int_a^b f = G(b) - G(a)$. ∎`,
          ],
          notes: ['', '', 'This is why the MVT matters.', '', ''],
        },
      },
    },
    {
      kind: 'numeric',
      prompt: String.raw`Compute $\displaystyle\int_0^2 3x^2\,dx$.`,
      answer: 8,
      why: String.raw`$G(x) = x^3$ has $G' = 3x^2$, so by FTC II the integral is $G(2) - G(0) = 8 - 0 = 8$.`,
    },
    {
      kind: 'mcq',
      prompt: String.raw`Let $F(x) = \displaystyle\int_0^x \sin(t^2)\,dt$. What is $F'(x)$?`,
      choices: [String.raw`$\sin(x^2)$`, String.raw`$2x\cos(x^2)$`, String.raw`$\cos(x^2)$`, String.raw`$\sin(x^2) - \sin 0$`],
      answer: 0,
      why: String.raw`$t \mapsto \sin(t^2)$ is continuous, so FTC I gives $F'(x) = \sin(x^2)$ directly — no antiderivative formula needed (none exists in elementary functions). $2x\cos(x^2)$ is the derivative of $\sin(x^2)$, a different question.`,
    },
    {
      kind: 'match',
      prompt: 'Match each object to its meaning.',
      pairs: [
        ['L(f, P)', 'sum of (inf of f on each piece) × width'],
        ['U(f, P)', 'sum of (sup of f on each piece) × width'],
        ['Riemann’s criterion', 'some partition has U − L < ε, for every ε > 0'],
        ['F(x) = ∫ₐˣ f', 'accumulated area; F′ = f where f is continuous'],
      ],
      why: 'Lower and upper sums trap the area; the criterion says the trap can be made arbitrarily tight; the accumulation function links integrals back to derivatives.',
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- Lower/upper sums use inf/sup on each piece of a partition: $L(f, P) \le \int_a^b f \le U(f, P)$.
- Integrable ⇔ $\sup_P L = \inf_P U$ ⇔ for every $\varepsilon$ some $P$ has $U - L < \varepsilon$.
- Continuous and monotone functions are integrable; Dirichlet's function is not (Lebesgue: discontinuities must have measure zero).
- **FTC:** $\frac{d}{dx}\int_a^x f = f(x)$ for continuous $f$, and $\int_a^b G' = G(b) - G(a)$ (via the MVT).

Next: limits of whole functions — [uniform convergence](@math/uniform-convergence).`,
    },
  ],
  references: [
    { authors: 'S. Abbott', title: 'Understanding Analysis', year: 2015, venue: '2nd ed., Springer (Undergraduate Texts in Mathematics)', detail: 'Ch. 7 (The Riemann integral: definition, integrating functions with discontinuities, FTC, Lebesgue’s criterion)' },
    { authors: 'M. Spivak', title: 'Calculus', year: 2008, venue: '4th ed., Publish or Perish', detail: 'Ch. 13 (Integrals), Ch. 14 (The fundamental theorem of calculus)' },
    { authors: 'T. Tao', title: 'Analysis I', year: 2016, venue: '3rd ed., Hindustan Book Agency / Springer', detail: 'Ch. 11 (The Riemann integral)' },
    { authors: 'W. Rudin', title: 'Principles of Mathematical Analysis', year: 1976, venue: '3rd ed., McGraw-Hill', detail: 'Ch. 6 (The Riemann–Stieltjes integral)' },
  ],
} satisfies LessonContent;
