import type { LessonContent } from '../../types';

export default {
  cards: [
    {
      kind: 'explain',
      title: '"No jumps" — but what does that mean?',
      body: String.raw`School definition: a function is continuous if you can draw its graph **without lifting your pen**. That works for polynomials, but breaks down quickly:

- $f(x) = \sin(1/x)$ wiggles infinitely often near $0$ — can you "draw" it?
- $f(x) = x$ for rational $x$ and $0$ for irrational $x$ is impossible to draw, yet (we will see) it is continuous at exactly one point, $x = 0$.

We need a definition about **numbers**, not pens. The idea mirrors [limits of sequences](@math/sequences-limits): small changes in the input should produce small changes in the output — with "small" made exact by $\varepsilon$ and $\delta$.`,
    },
    {
      kind: 'explain',
      title: 'The ε–δ definition',
      body: String.raw`**Definition.** $f$ is **continuous at** $a$ if

$$\forall \varepsilon > 0\ \ \exists \delta > 0\ \ \forall x:\quad |x - a| < \delta \implies |f(x) - f(a)| < \varepsilon.$$

The game: a sceptic sets an output tolerance $\varepsilon$ (a horizontal band around $f(a)$). You must find an input window $\delta$ around $a$ so that **every** $x$ in the window is mapped into the band. $\delta$ may depend on $\varepsilon$ (and on $a$).

$f$ is **continuous** if it is continuous at every point of its domain. The related **limit** $\lim_{x\to a} f(x) = L$ uses the same sentence with $f(a)$ replaced by $L$ and $0 < |x - a| < \delta$ — the value at $a$ itself is ignored. So: continuous at $a$ ⇔ $\lim_{x\to a} f(x) = f(a)$.`,
    },
    {
      kind: 'widget',
      title: 'Play the ε–δ game',
      body: String.raw`$f(x) = x^2$ at $a = 1$. The blue band is $f(a) \pm \varepsilon$; the orange window is $a \pm \delta$. The graph inside the window turns green when it stays in the band, red where it escapes. Shrink $\varepsilon$ and press **Best δ**: a working $\delta$ always exists, it just gets smaller.`,
      widget: { type: 'MathEpsilonDelta', props: { fn: 'x^2', a: 1, x: [-0.5, 2.5], y: [-0.5, 4], eps: 0.5, delta: 0.4 } },
    },
    {
      kind: 'order',
      prompt: String.raw`Arrange the proof that $f(x) = 5x - 2$ is continuous at every $a$.`,
      steps: [
        String.raw`Let $a \in \mathbb{R}$ and $\varepsilon > 0$.`,
        String.raw`Set $\delta = \varepsilon / 5$.`,
        String.raw`Suppose $|x - a| < \delta$.`,
        String.raw`Then $|f(x) - f(a)| = |5x - 5a| = 5|x - a| < 5\delta = \varepsilon$.`,
        String.raw`So $f$ is continuous at $a$; since $a$ was arbitrary, $f$ is continuous. ∎`,
      ],
      why: String.raw`Fix the point and the tolerance first, then **choose** $\delta$ (found on scrap paper from $5|x-a| < \varepsilon$), then verify for an arbitrary $x$ in the window. Choosing $\delta$ before $\varepsilon$ is given would be meaningless — $\delta$ is a function of $\varepsilon$.`,
    },
    {
      kind: 'numeric',
      prompt: String.raw`For $f(x) = 3x + 1$ at any point $a$ and $\varepsilon = 0.06$, what is the **largest** $\delta$ that works?`,
      answer: 0.02,
      tolerance: 0.0001,
      why: String.raw`$|f(x) - f(a)| = 3|x - a|$. We need $3|x-a| < 0.06$ whenever $|x - a| < \delta$, which holds exactly when $\delta \le 0.06/3 = 0.02$. For a slope-$m$ line the best $\delta$ is $\varepsilon/|m|$.`,
    },
    {
      kind: 'widget',
      title: 'A non-linear proof',
      body: String.raw`For $x^2$ the best $\delta$ depends on $a$: the graph is steeper further out. The trick is to first restrict $\delta \le 1$.`,
      widget: {
        type: 'StepReveal',
        props: {
          steps: [
            String.raw`**Claim.** $f(x) = x^2$ is continuous at every $a$.`,
            String.raw`Factor: $|x^2 - a^2| = |x - a|\,|x + a|$. The first factor is what $\delta$ controls; we must tame $|x + a|$.`,
            String.raw`If $|x - a| < 1$, then $|x + a| = |(x - a) + 2a| \le |x - a| + 2|a| < 1 + 2|a|$.`,
            String.raw`Let $\varepsilon > 0$ and put $\delta = \min\!\left(1,\ \dfrac{\varepsilon}{1 + 2|a|}\right)$.`,
            String.raw`If $|x - a| < \delta$: $\ |x^2 - a^2| < \delta\,(1 + 2|a|) \le \varepsilon$. ∎`,
          ],
          notes: ['', '', 'Triangle inequality.', 'The min makes both requirements hold at once.', String.raw`$\delta$ depends on $a$ as well as $\varepsilon$ — this will matter for *uniform* continuity.`],
        },
      },
    },
    {
      kind: 'widget',
      title: 'When no δ works',
      body: String.raw`Negating (see [quantifiers](@math/logic-statements)): $f$ is **discontinuous** at $a$ if **some** $\varepsilon > 0$ defeats **every** $\delta > 0$ — every window, however thin, contains an $x$ with $|f(x) - f(a)| \ge \varepsilon$.

Here $f(x) = 0$ for $x < 0$ and $f(x) = 1$ for $x \ge 0$, at $a = 0$ (so $f(a) = 1$). With $\varepsilon = 0.3$, try any $\delta$: the left part of the window always lands at height $0$, outside the band.`,
      widget: { type: 'MathEpsilonDelta', props: { fn: 'x < 0 ? 0 : 1', a: 0, x: [-1, 1], y: [-0.5, 1.5], eps: 0.3, delta: 0.3 } },
    },
    {
      kind: 'mcq',
      prompt: String.raw`Which statement says "$f$ is **not** continuous at $a$"?`,
      choices: [
        String.raw`$\exists \varepsilon > 0\ \forall \delta > 0\ \exists x:\ |x - a| < \delta$ and $|f(x) - f(a)| \ge \varepsilon$`,
        String.raw`$\forall \varepsilon > 0\ \exists \delta > 0\ \exists x:\ |x - a| < \delta$ and $|f(x) - f(a)| \ge \varepsilon$`,
        String.raw`$\exists \varepsilon > 0\ \exists \delta > 0\ \forall x:\ |x - a| \ge \delta$ or $|f(x) - f(a)| < \varepsilon$`,
        String.raw`$\exists \delta > 0\ \forall \varepsilon > 0:\ |f(x) - f(a)| \ge \varepsilon$`,
      ],
      answer: 0,
      why: String.raw`Flip each quantifier and negate the implication: $\neg(P \Rightarrow Q)$ is $P \wedge \neg Q$. The version starting $\forall \varepsilon\ \exists \delta$ keeps the original quantifiers and so says almost nothing; the one ending with "or $|f(x) - f(a)| < \varepsilon$" negates only part of the sentence; the one starting $\exists \delta\ \forall \varepsilon$ has the quantifiers in the wrong order and leaves $x$ unquantified.`,
    },
    {
      kind: 'explain',
      title: 'The sequential criterion',
      body: String.raw`**Theorem.** $f$ is continuous at $a$ ⇔ for **every** sequence $x_n \to a$, we have $f(x_n) \to f(a)$.

This turns continuity questions into sequence questions, and is the easiest way to prove **dis**continuity: find one sequence $x_n \to a$ with $f(x_n) \not\to f(a)$.

**Example.** $f(x) = \sin(1/x)$ for $x \ne 0$, $f(0) = 0$. Take $x_n = \dfrac{1}{\pi/2 + 2\pi n} \to 0$. Then $f(x_n) = \sin(\pi/2 + 2\pi n) = 1$ for all $n$, which does not tend to $f(0) = 0$. So $f$ is discontinuous at $0$ — no value of $f(0)$ could fix it.`,
    },
    {
      kind: 'truefalse',
      prompt: String.raw`Let $f(x) = x\sin(1/x)$ for $x \ne 0$ and $f(0) = 0$. Then $f$ is continuous at $0$.`,
      answer: true,
      why: String.raw`$|f(x) - f(0)| = |x|\,|\sin(1/x)| \le |x|$, so $\delta = \varepsilon$ works. The factor $x$ squeezes the wild oscillation down to $0$ — unlike plain $\sin(1/x)$, which keeps hitting $\pm1$.`,
    },
    {
      kind: 'multi',
      prompt: String.raw`Which functions are continuous **at $0$**? (Each is defined as $0$ at $x = 0$ where needed.)`,
      choices: [
        String.raw`$|x|$`,
        String.raw`$\sin(1/x)$ for $x \ne 0$`,
        String.raw`$x\sin(1/x)$ for $x \ne 0$`,
        String.raw`$x$ if $x$ is rational, $0$ if $x$ is irrational`,
        String.raw`$\lfloor x \rfloor$ (greatest integer $\le x$)`,
      ],
      answers: [0, 2, 3],
      why: String.raw`For $|x|$, $x\sin(1/x)$ and the rational/irrational function, $|f(x) - f(0)| \le |x|$, so $\delta = \varepsilon$ works. That last function is discontinuous at every $a \ne 0$ (nearby irrationals give $0$, nearby rationals give about $a$) — continuous at exactly one point. $\sin(1/x)$ fails via the sequential criterion, and $\lfloor x \rfloor = -1$ just left of $0$ while $\lfloor 0 \rfloor = 0$.`,
    },
    {
      kind: 'widget',
      title: 'The intermediate value theorem',
      body: String.raw`**IVT.** If $f$ is continuous on $[a, b]$ and $y$ lies between $f(a)$ and $f(b)$, then $f(c) = y$ for some $c \in [a, b]$.

It needs [completeness](@math/real-numbers-completeness): on $\mathbb{Q}$, $x^2 - 2$ is negative at $1$ and positive at $2$ but never $0$. One proof is **bisection**: keep the half where $f$ changes sign; the nested intervals shrink to a point $c$, and continuity forces $f(c) = 0$. Try it on $f(x) = x^3 - x - 1$ on $[1, 2]$.`,
      widget: { type: 'MathNestedIntervals', props: { fn: 'x^3 - x - 1', a: 1, b: 2, name: 'a root c of x³ − x − 1 ≈ 1.3247' } },
    },
    {
      kind: 'numeric',
      prompt: String.raw`Bisection for $f(x) = x^3 - x - 1$ starts on $[1, 2]$ ($f(1) = -1 < 0 < 5 = f(2)$). After **two** halvings the interval is $[p, q]$. What is $p$?`,
      answer: 1.25,
      why: String.raw`$f(1.5) = 3.375 - 1.5 - 1 = 0.875 > 0$, so keep $[1, 1.5]$. $f(1.25) = 1.953125 - 1.25 - 1 = -0.296875 < 0$, so keep $[1.25, 1.5]$. Hence $p = 1.25$.`,
    },
    {
      kind: 'explain',
      title: 'Closed intervals: extreme values & uniform continuity',
      body: String.raw`Two more "hard theorems" for continuous $f$ on a **closed, bounded** interval $[a, b]$:

- **Extreme value theorem.** $f$ attains a maximum and a minimum. (Fails on $(0, 1)$: $f(x) = 1/x$ is unbounded; $f(x) = x$ has no max.)
- **Uniform continuity** (Heine–Cantor). One $\delta$ works for **all** points at once: $\forall \varepsilon\ \exists \delta\ \forall x, y:\ |x - y| < \delta \Rightarrow |f(x) - f(y)| < \varepsilon$.

Compare the $x^2$ proof, where $\delta$ depended on $a$. On $(0, 1)$, $1/x$ is continuous but **not** uniformly continuous: near $0$ it is so steep that no single $\delta$ serves everywhere. Uniform continuity is what makes continuous functions [integrable](@math/riemann-integral).`,
    },
    {
      kind: 'match',
      prompt: 'Match each theorem to its conclusion.',
      pairs: [
        ['Intermediate value theorem', 'every value between f(a) and f(b) is taken'],
        ['Extreme value theorem', 'f attains a maximum and a minimum on [a, b]'],
        ['Heine–Cantor theorem', 'continuous on [a, b] ⇒ uniformly continuous'],
        ['Sequential criterion', 'xₙ → a always gives f(xₙ) → f(a)'],
      ],
      why: 'The first three need a closed, bounded interval (and ultimately completeness); the sequential criterion is a reformulation of continuity at a single point.',
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- $f$ is continuous at $a$ ⇔ $\forall \varepsilon > 0\ \exists \delta > 0$: $|x - a| < \delta \Rightarrow |f(x) - f(a)| < \varepsilon$.
- To prove it: bound $|f(x) - f(a)|$ by (something) × $|x - a|$, then choose $\delta$; restrict $\delta \le 1$ to tame extra factors.
- To disprove it: one $\varepsilon$ that beats every $\delta$, or one sequence $x_n \to a$ with $f(x_n) \not\to f(a)$.
- On $[a, b]$: IVT, extreme values, and uniform continuity — all rely on completeness.

Next: [derivatives & the mean value theorem](@math/derivative-rigorous).`,
    },
  ],
  references: [
    { authors: 'S. Abbott', title: 'Understanding Analysis', year: 2015, venue: '2nd ed., Springer (Undergraduate Texts in Mathematics)', detail: 'Ch. 4, §4.2–4.5 (functional limits, continuity, continuous functions on compact sets, IVT)' },
    { authors: 'M. Spivak', title: 'Calculus', year: 2008, venue: '4th ed., Publish or Perish', detail: 'Ch. 5 (Limits), Ch. 6 (Continuous functions), Ch. 7 (Three hard theorems), Ch. 8 (Least upper bounds)' },
    { authors: 'R. G. Bartle, D. R. Sherbert', title: 'Introduction to Real Analysis', year: 2011, venue: '4th ed., Wiley', detail: 'Ch. 4 (Limits), Ch. 5 (Continuous functions, incl. uniform continuity)' },
    { authors: 'W. Rudin', title: 'Principles of Mathematical Analysis', year: 1976, venue: '3rd ed., McGraw-Hill', detail: 'Ch. 4 (Continuity)' },
  ],
} satisfies LessonContent;
