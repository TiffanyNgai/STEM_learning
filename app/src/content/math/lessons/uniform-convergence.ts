import type { LessonContent } from '../../types';

export default {
  cards: [
    {
      kind: 'explain',
      title: 'A limit that breaks continuity',
      body: String.raw`Power series, Fourier series and numerical approximations all define a function as a **limit of functions** $f_1, f_2, f_3, \dots$ Does the limit inherit nice properties like continuity?

Take $f_n(x) = x^n$ on $[0, 1]$. For each fixed $x$:
- if $0 \le x < 1$, then $x^n \to 0$;
- if $x = 1$, then $1^n = 1 \to 1$.

So $f_n(x) \to f(x)$, where $f = 0$ on $[0, 1)$ and $f(1) = 1$. Every $f_n$ is a smooth polynomial, yet the limit **jumps**. Something about this kind of convergence is too weak.`,
    },
    {
      kind: 'explain',
      title: 'Pointwise convergence',
      body: String.raw`**Definition.** $f_n \to f$ **pointwise** on a set $A$ if for every $x \in A$ the number sequence $f_n(x) \to f(x)$:

$$\forall x \in A\ \ \forall \varepsilon > 0\ \ \exists N\ \ \forall n \ge N:\ |f_n(x) - f(x)| < \varepsilon.$$

Here $N$ may depend on **both** $\varepsilon$ and $x$. For $x^n$ at a point $x \in (0,1)$ we need $x^n < \varepsilon$, i.e. $n > \ln\varepsilon / \ln x$ — and that blows up as $x \to 1$. Points near $1$ converge ever more slowly; no single $N$ serves them all.`,
    },
    {
      kind: 'widget',
      title: 'Pointwise vs uniform: the ε-tube',
      body: String.raw`Dashed blue: the limit $f$, with an $\varepsilon$-tube around it. Green/red: the current $f_n(x) = x^n$, red where it leaves the tube. Raise $n$: the red part slides right but **never disappears** — near $x = 1$ the graph always climbs out. Move the probe $x_0$ towards $1$ and watch the pointwise $N$ explode.`,
      widget: { type: 'MathUniformConv', props: { fn: 'x^n', limit: 'x < 1 ? 0 : 1', x: [0, 1], n: 3, eps: 0.2, x0: 0.8 } },
    },
    {
      kind: 'numeric',
      prompt: String.raw`For $f_n(x) = x^n$ at the single point $x = 0.9$, with $\varepsilon = 0.1$: what is the smallest $N$ with $0.9^n < 0.1$ for all $n \ge N$?`,
      answer: 22,
      why: String.raw`$0.9^n < 0.1 \iff n > \ln 0.1/\ln 0.9 \approx 21.85$. Check: $0.9^{21} \approx 0.109$ (too big), $0.9^{22} \approx 0.098$. At $x = 0.99$ you would need $N = 230$; at $x = 0.999$, $N = 2302$.`,
    },
    {
      kind: 'explain',
      title: 'Uniform convergence',
      body: String.raw`**Definition.** $f_n \to f$ **uniformly** on $A$ if

$$\forall \varepsilon > 0\ \ \exists N\ \ \forall n \ge N\ \ \forall x \in A:\ |f_n(x) - f(x)| < \varepsilon.$$

The only change: "$\forall x$" moved **after** "$\exists N$", so one $N$ must work for every $x$ at once ([quantifier order](@math/logic-statements) matters!). Picture: from $N$ on, the **whole graph** of $f_n$ lies inside the $\varepsilon$-tube around $f$.

Equivalently, $\sup_{x \in A} |f_n(x) - f(x)| \to 0$. The supremum is the largest vertical gap between the graphs — the purple segment in the widget.`,
    },
    {
      kind: 'mcq',
      prompt: String.raw`Why is the convergence $x^n \to 0$ **not** uniform on $[0, 1)$?`,
      choices: [
        String.raw`For every $n$, $\sup_{x \in [0,1)} x^n = 1$, which does not tend to $0$.`,
        String.raw`Because $x^n$ does not converge at some $x \in [0, 1)$.`,
        String.raw`Because the limit function $0$ is discontinuous.`,
        String.raw`Because $x^n$ is not continuous on $[0, 1)$.`,
      ],
      answer: 0,
      why: String.raw`For fixed $n$, $x^n \to 1$ as $x \to 1^-$, so the gap $\sup |x^n - 0| = 1$ for every $n$. Pointwise convergence does hold at every point of $[0, 1)$, the limit $0$ is continuous there, and every $x^n$ is continuous — the failure is purely that no single $N$ fits all $x$.`,
    },
    {
      kind: 'truefalse',
      prompt: String.raw`$x^n \to 0$ uniformly on $[0, \tfrac12]$.`,
      answer: true,
      why: String.raw`On $[0, \tfrac12]$, $\sup |x^n| = (\tfrac12)^n \to 0$. Staying away from the trouble spot $x = 1$ restores uniformity — in fact $x^n \to 0$ uniformly on $[0, b]$ for every $b < 1$.`,
    },
    {
      kind: 'widget',
      title: 'Uniform limits keep continuity',
      body: String.raw`**Theorem.** If each $f_n$ is continuous at $c$ and $f_n \to f$ uniformly, then $f$ is continuous at $c$. The proof is the famous "$\varepsilon/3$ argument".`,
      widget: {
        type: 'StepReveal',
        props: {
          steps: [
            String.raw`Let $\varepsilon > 0$. By uniform convergence pick $N$ with $|f_N(x) - f(x)| < \varepsilon/3$ for **all** $x$.`,
            String.raw`$f_N$ is continuous at $c$: pick $\delta > 0$ with $|f_N(x) - f_N(c)| < \varepsilon/3$ whenever $|x - c| < \delta$.`,
            String.raw`For $|x - c| < \delta$, the triangle inequality gives $|f(x) - f(c)| \le |f(x) - f_N(x)| + |f_N(x) - f_N(c)| + |f_N(c) - f(c)|$.`,
            String.raw`Each term is $< \varepsilon/3$, so $|f(x) - f(c)| < \varepsilon$. ∎`,
          ],
          notes: [
            'Uniformity is used here: the same N works at x and at c.',
            'Continuity of one well-chosen function.',
            'Hop from f to f_N, move along f_N, hop back.',
            'With only pointwise convergence, N would depend on x and the argument collapses — as xⁿ shows.',
          ],
        },
      },
    },
    {
      kind: 'widget',
      title: 'A travelling bump',
      body: String.raw`Uniform convergence is **sufficient** for a continuous limit, not necessary. Here $f_n(x) = nx\,e^{-nx}$ on $[0, 3]$: at each fixed $x$ it tends to $0$ (exponential beats linear), and the limit $0$ is continuous. But every $f_n$ has a bump of the **same height** at $x = 1/n$ that slides into the wall. The sup-gap never shrinks.`,
      widget: { type: 'MathUniformConv', props: { fn: 'n*x*exp(-n*x)', limit: '0', x: [0, 3], y: [-0.1, 0.6], n: 3, nMax: 60, eps: 0.2, x0: 0.5 } },
    },
    {
      kind: 'numeric',
      prompt: String.raw`Compute $\sup_{x \ge 0}\, n x e^{-nx}$ (it is the same for every $n$). Give 3 decimals.`,
      answer: 0.368,
      tolerance: 0.002,
      why: String.raw`The derivative $n e^{-nx}(1 - nx)$ vanishes at $x = 1/n$, giving $n \cdot \tfrac1n \cdot e^{-1} = 1/e \approx 0.368$. Since this does not tend to $0$, the convergence to $0$ is not uniform.`,
    },
    {
      kind: 'explain',
      title: 'Integrals and derivatives',
      body: String.raw`**Integrals.** If $f_n \to f$ uniformly on $[a, b]$ (and the $f_n$ are integrable), then $\int_a^b f_n \to \int_a^b f$: the integrals differ by at most $(b - a)\sup|f_n - f|$. Without uniformity this fails: $g_n(x) = n^2 x e^{-nx} \to 0$ pointwise on $[0, 1]$, yet $\int_0^1 g_n = 1 - (n+1)e^{-n} \to 1 \ne 0$.

**Derivatives** are harder. $f_n(x) = \sin(nx)/\sqrt n \to 0$ uniformly (sup $= 1/\sqrt n$), but $f_n'(x) = \sqrt n \cos(nx)$, which at $x = 0$ equals $\sqrt n \to \infty$. The fix, on a bounded interval: if each $f_n$ is differentiable, $f_n' \to g$ **uniformly**, and $f_n(x_0)$ converges at one point, then $f_n \to f$ uniformly and $f' = g$.`,
    },
    {
      kind: 'explain',
      title: 'Series of functions: the M-test',
      body: String.raw`A series $\sum f_n$ converges uniformly if its partial sums do. The workhorse test:

**Weierstrass M-test.** If $|f_n(x)| \le M_n$ for all $x \in A$, and $\sum M_n$ [converges](@math/series-convergence), then $\sum f_n$ converges uniformly (and absolutely) on $A$.

**Example.** $\sum_{n\ge1} \frac{\sin(nx)}{n^2}$: take $M_n = 1/n^2$. So the sum converges uniformly on $\mathbb{R}$, and — each term being continuous — the sum is a **continuous** function. This is how one proves that [Fourier series](@math/fourier-series) and power series (inside their radius of convergence, on closed sub-intervals) define continuous functions.`,
    },
    {
      kind: 'multi',
      prompt: 'Which convergences are **uniform** on the given set?',
      choices: [
        String.raw`$x^n \to 0$ on $[0, \tfrac12]$`,
        String.raw`$x^n \to$ (its limit) on $[0, 1]$`,
        String.raw`$\sin(nx)/n \to 0$ on $\mathbb{R}$`,
        String.raw`$x/n \to 0$ on $\mathbb{R}$`,
        String.raw`$nxe^{-nx} \to 0$ on $[0, \infty)$`,
      ],
      answers: [0, 2],
      why: String.raw`Uniform ⇔ sup-gap $\to 0$. Sups: $(\tfrac12)^n \to 0$ ✓; $1$ for $x^n$ on $[0,1]$ ✗; $1/n \to 0$ ✓; $\sup_{\mathbb{R}} |x|/n = \infty$ ✗ (fine on bounded sets, though); $1/e$ for the bump ✗.`,
    },
    {
      kind: 'fill',
      prompt: String.raw`$f_n \to f$ uniformly on $A$ if for every $\varepsilon > 0$ there is $N$ with $|f_n(x) - f(x)| < \varepsilon$ for all $n \ge N$ and ___ $x \in A$. In merely pointwise convergence, $N$ may depend on ___ as well as on $\varepsilon$.`,
      bank: ['all', 'some', 'x', 'n', 'f'],
      answer: ['all', 'x'],
      why: String.raw`Uniform: one $N$ for **all** $x$ simultaneously. Pointwise: $N = N(\varepsilon, x)$ — and if $N(\varepsilon, x)$ is unbounded in $x$ (as for $x^n$ near $1$), the convergence is not uniform.`,
    },
    {
      kind: 'match',
      prompt: 'Match each phenomenon to an example.',
      pairs: [
        ['continuous functions, discontinuous pointwise limit', String.raw`$x^n$ on $[0, 1]$`],
        ['integrals do not converge to the integral of the limit', String.raw`$n^2 x e^{-nx}$ on $[0, 1]$`],
        ['uniform convergence, yet derivatives diverge', String.raw`$\sin(nx)/\sqrt n$`],
        ['continuous limit, but not uniform', String.raw`$nxe^{-nx}$ on $[0, \infty)$`],
      ],
      why: 'Each example breaks exactly one "swap of limits": limit with continuity, limit with integral, limit with derivative. The last shows that a continuous limit does not force uniformity.',
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- **Pointwise:** $N$ may depend on $x$. **Uniform:** one $N$ for all $x$ ⇔ $\sup_x |f_n - f| \to 0$ ⇔ eventually the whole graph sits in the $\varepsilon$-tube.
- Uniform limits of continuous functions are continuous ($\varepsilon/3$ argument); pointwise limits need not be ($x^n$).
- Uniform convergence lets you swap limit and integral; derivatives need uniform convergence **of the derivatives**.
- **M-test:** $|f_n| \le M_n$ with $\sum M_n < \infty$ ⇒ $\sum f_n$ converges uniformly.
- Uniform convergence is convergence in the **sup distance** — the first example of a [metric space](@math/metric-spaces) of functions.`,
    },
  ],
  references: [
    { authors: 'S. Abbott', title: 'Understanding Analysis', year: 2015, venue: '2nd ed., Springer (Undergraduate Texts in Mathematics)', detail: 'Ch. 6 (Sequences and series of functions: §6.2 uniform convergence, §6.3 differentiation, §6.4 series of functions)' },
    { authors: 'W. Rudin', title: 'Principles of Mathematical Analysis', year: 1976, venue: '3rd ed., McGraw-Hill', detail: 'Ch. 7 (Sequences and series of functions: uniform convergence and continuity, integration, differentiation)' },
    { authors: 'R. G. Bartle, D. R. Sherbert', title: 'Introduction to Real Analysis', year: 2011, venue: '4th ed., Wiley', detail: 'Ch. 8 (Sequences of functions: pointwise and uniform convergence, interchange of limits)' },
    { authors: 'M. Spivak', title: 'Calculus', year: 2008, venue: '4th ed., Publish or Perish', detail: 'Ch. 24 (Uniform convergence and power series)' },
  ],
} satisfies LessonContent;
