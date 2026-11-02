import type { LessonContent } from '../../types';

// Cobweb diagram for the contraction T(x) = cos x on [0, 1]: iterates spiral into the fixed point 0.739…
const PX = (v: number) => 40 + v * 240, PY = (v: number) => 170 - v * 150;
const curve = Array.from({ length: 61 }, (_, i) => { const x = i / 60; return `${i ? 'L' : 'M'}${PX(x).toFixed(1)},${PY(Math.cos(x)).toFixed(1)}`; }).join('');
const cob: string[] = [];
let xv = 0.1;
cob.push(`M${PX(xv).toFixed(1)},${PY(0).toFixed(1)}`);
for (let i = 0; i < 9; i++) {
  const yv = Math.cos(xv);
  cob.push(`L${PX(xv).toFixed(1)},${PY(yv).toFixed(1)}`, `L${PX(yv).toFixed(1)},${PY(yv).toFixed(1)}`);
  xv = yv;
}
const cobwebSvg = `<svg viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg" font-family="inherit">
  <line x1="${PX(0)}" y1="${PY(0)}" x2="${PX(1)}" y2="${PY(0)}" stroke="var(--fg)"/>
  <line x1="${PX(0)}" y1="${PY(0)}" x2="${PX(0)}" y2="${PY(1)}" stroke="var(--fg)"/>
  <text x="${PX(1)}" y="${PY(0) + 14}" font-size="10" text-anchor="middle" fill="var(--fg)">1</text>
  <text x="${PX(0) - 6}" y="${PY(1) + 4}" font-size="10" text-anchor="end" fill="var(--fg)">1</text>
  <line x1="${PX(0)}" y1="${PY(0)}" x2="${PX(1)}" y2="${PY(1)}" stroke="var(--muted)" stroke-dasharray="4 3"/>
  <path d="${curve}" fill="none" stroke="var(--c2)" stroke-width="2"/>
  <path d="${cob.join('')}" fill="none" stroke="var(--c3)" stroke-width="1.4" stroke-dasharray="1400" stroke-dashoffset="1400">
    <animate attributeName="stroke-dashoffset" values="1400;0;0" keyTimes="0;0.75;1" dur="8s" repeatCount="indefinite"/>
  </path>
  <circle cx="${PX(0.739085).toFixed(1)}" cy="${PY(0.739085).toFixed(1)}" r="3.5" fill="var(--c5)"/>
  <text x="${PX(0.739085) + 6}" y="${PY(0.739085) - 8}" font-size="10" fill="var(--c5)">x* ≈ 0.739</text>
  <text x="${PX(1) - 2}" y="${PY(1) + 4}" font-size="10" text-anchor="end" fill="var(--muted)">y = x</text>
  <text x="${PX(0.15)}" y="${PY(Math.cos(0.15)) - 6}" font-size="10" fill="var(--c2)">y = cos x</text>
  <text x="160" y="194" font-size="10" text-anchor="middle" fill="var(--c3)">x₀ = 0.1, x₁ = cos x₀, x₂ = cos x₁, …</text>
</svg>`;

export default {
  cards: [
    {
      kind: 'explain',
      title: 'Analysis needs only a distance',
      body: String.raw`Look back at every definition in this unit: limits, continuity, Cauchy sequences, uniform convergence. Each one only ever used the **distance** $|x - y|$. Replace it with any reasonable notion of distance, and all of analysis transfers — to points in space, to functions, to strings of DNA.

**Definition.** A **metric space** is a set $X$ with a function $d : X \times X \to [0, \infty)$ such that for all $x, y, z \in X$:

1. $d(x, y) = 0 \iff x = y$;
2. $d(x, y) = d(y, x)$ (symmetry);
3. $d(x, z) \le d(x, y) + d(y, z)$ (**triangle inequality**: detours never help).`,
    },
    {
      kind: 'widget',
      title: 'Same plane, different distances',
      body: String.raw`On $\mathbb{R}^2$ there are many metrics. For $p \ge 1$, $d_p(x, y) = \big(|x_1 - y_1|^p + |x_2 - y_2|^p\big)^{1/p}$:

- $p = 1$: **taxicab** distance (orange route — only along the grid);
- $p = 2$: the usual **Euclidean** distance (blue straight line);
- $p = \infty$: the **max** metric $\max(|x_1 - y_1|, |x_2 - y_2|)$.

The **ball** $B(x, r) = \{y : d(x, y) < r\}$ changes shape: a diamond, a disc, a square. Move $q$ and compare its three distances from the origin.`,
      widget: { type: 'MathUnitBalls', props: { p: 2, r: 1, q: [0.6, 0.5] } },
    },
    {
      kind: 'numeric',
      prompt: String.raw`Compute the taxicab distance $d_1$ between $(1, 2)$ and $(4, -2)$.`,
      answer: 7,
      why: String.raw`$d_1 = |1 - 4| + |2 - (-2)| = 3 + 4 = 7$. For comparison, $d_2 = \sqrt{9 + 16} = 5$ and $d_\infty = \max(3, 4) = 4$. In the plane, always $d_\infty \le d_2 \le d_1$.`,
    },
    {
      kind: 'explain',
      title: 'Metrics on functions and data',
      body: String.raw`- **Sup metric** on $C[a, b]$, the continuous functions on $[a, b]$: $d_\infty(f, g) = \sup_{x} |f(x) - g(x)|$, the largest vertical gap between the graphs. Convergence in this metric is exactly [uniform convergence](@math/uniform-convergence).
- **$L^1$ metric** on $C[a, b]$: $d_1(f, g) = \int_a^b |f - g|$, the area between the graphs. Different metric, different notion of "close".
- **Hamming distance** on strings of equal length: the number of positions where they differ. $d(\texttt{GATTACA}, \texttt{GACTATA}) = 2$.
- **Discrete metric** on any set: $d(x, y) = 1$ if $x \ne y$, else $0$. Every point is "far" from every other.`,
    },
    {
      kind: 'truefalse',
      prompt: String.raw`$d(x, y) = (x - y)^2$ is a metric on $\mathbb{R}$.`,
      answer: false,
      why: String.raw`Properties 1 and 2 hold, but the triangle inequality fails: $d(0, 2) = 4$, while $d(0, 1) + d(1, 2) = 1 + 1 = 2$. Squaring rewards detours. (By contrast $\sqrt{|x - y|}$ **is** a metric.)`,
    },
    {
      kind: 'explain',
      title: 'Convergence, continuity, open sets',
      body: String.raw`Copy the old definitions, swapping $|x - y|$ for $d(x, y)$:

- $x_n \to x$ if $\forall \varepsilon > 0\ \exists N\ \forall n \ge N: d(x_n, x) < \varepsilon$ — i.e. the numbers $d(x_n, x) \to 0$.
- $f : (X, d) \to (Y, e)$ is continuous at $a$ if $\forall \varepsilon > 0\ \exists \delta > 0$: $d(x, a) < \delta \Rightarrow e(f(x), f(a)) < \varepsilon$.
- $U \subseteq X$ is **open** if around each of its points some ball fits inside $U$. A set is **closed** if its complement is open — equivalently, it contains the limits of all its convergent sequences.

Continuity can then be restated without $\varepsilon$ at all: preimages of open sets are open. That is the doorway to [topology](@math/topology-intro).`,
    },
    {
      kind: 'mcq',
      prompt: String.raw`In a metric space $(X, d)$, which is the definition of "$U$ is open"?`,
      choices: [
        String.raw`For every $x \in U$ there is $r > 0$ with $B(x, r) \subseteq U$.`,
        String.raw`There is $r > 0$ such that $B(x, r) \subseteq U$ for some $x$.`,
        String.raw`$U$ contains the limit of every convergent sequence in $U$.`,
        String.raw`$U$ is not closed.`,
      ],
      answer: 0,
      why: String.raw`Each point needs its own little ball inside $U$ ($r$ may depend on the point). Asking for just one ball around some point is far too weak; "contains the limits of its convergent sequences" defines **closed**; and "not closed" is wrong because sets can be both open and closed ($X$ itself, $\varnothing$) or neither ($[0, 1)$ in $\mathbb{R}$).`,
    },
    {
      kind: 'explain',
      title: 'Complete metric spaces',
      body: String.raw`A sequence is **Cauchy** if $d(x_m, x_n) < \varepsilon$ for all $m, n \ge N$ (one $N$ per $\varepsilon$). Every convergent sequence is Cauchy. A metric space is **complete** if, conversely, every Cauchy sequence converges **in the space**.

- $\mathbb{R}$ and $\mathbb{R}^n$ are complete — this is [completeness](@math/real-numbers-completeness) again.
- $\mathbb{Q}$ is not: decimals of $\sqrt2$ are Cauchy but have no rational limit. Nor is $(0, 1)$: $1/(n+1)$ is Cauchy, but its limit $0$ is missing.
- $C[a, b]$ with the sup metric **is** complete — a uniformly Cauchy sequence of continuous functions has a continuous uniform limit.
- $C[a, b]$ with the $L^1$ metric is **not**: continuous ramps can converge in area to a step function. Completing it gives $L^1$, the home of Lebesgue integration.`,
    },
    {
      kind: 'multi',
      prompt: 'Which metric spaces are complete?',
      choices: [
        String.raw`$\mathbb{R}$ with $|x - y|$`,
        String.raw`$\mathbb{Q}$ with $|x - y|$`,
        String.raw`$[0, 1]$ with $|x - y|$`,
        String.raw`$(0, 1)$ with $|x - y|$`,
        String.raw`$C[0, 1]$ with the sup metric`,
      ],
      answers: [0, 2, 4],
      why: String.raw`$[0, 1]$ is a closed subset of the complete space $\mathbb{R}$, so Cauchy sequences in it converge to points inside it. $\mathbb{Q}$ misses $\sqrt2$ and $(0, 1)$ misses the endpoint $0$ that $1/(n+1)$ heads to. $C[0,1]$ is complete because uniform limits of continuous functions are continuous.`,
    },
    {
      kind: 'widget',
      title: 'The contraction mapping theorem',
      body: String.raw`**Banach fixed-point theorem.** Let $(X, d)$ be a non-empty **complete** metric space and $T : X \to X$ a **contraction**: $d(Tx, Ty) \le k\,d(x, y)$ for some constant $k < 1$. Then $T$ has **exactly one** fixed point $x^* = Tx^*$, and from any start the iterates $x_{n+1} = Tx_n$ converge to it.

Below: $T(x) = \cos x$ maps $[0, 1]$ into itself and, by the MVT, $|\cos x - \cos y| \le \sin(1)\,|x - y|$ with $\sin 1 \approx 0.84 < 1$. The iterates spiral into $x^* \approx 0.739$. Applied to a space of functions, the same theorem proves that ODEs have unique solutions ([Picard–Lindelöf](@math/existence-uniqueness)).`,
      widget: { type: 'SvgDiagram', props: { svg: cobwebSvg } },
    },
    {
      kind: 'numeric',
      prompt: String.raw`$T(x) = \tfrac{x}{2} + 1$ is a contraction on $\mathbb{R}$ with $k = \tfrac12$. What is its unique fixed point?`,
      answer: 2,
      why: String.raw`Solve $x = x/2 + 1$: $x/2 = 1$, so $x^* = 2$. Iterating from $0$ gives $1, 1.5, 1.75, 1.875, \dots$ — the distance to $2$ halves each step, exactly the factor $k$.`,
    },
    {
      kind: 'order',
      prompt: 'Arrange the proof of the contraction mapping theorem.',
      steps: [
        String.raw`Pick any $x_0$ and set $x_{n+1} = Tx_n$. By induction, $d(x_{n+1}, x_n) \le k^n d(x_1, x_0)$.`,
        String.raw`For $m > n$, the triangle inequality and a geometric series give $d(x_m, x_n) \le \frac{k^n}{1 - k}\,d(x_1, x_0)$, so $(x_n)$ is Cauchy.`,
        String.raw`By completeness, $x_n \to x^*$ for some $x^* \in X$.`,
        String.raw`$T$ is continuous (contractions are), so $Tx^* = \lim Tx_n = \lim x_{n+1} = x^*$.`,
        String.raw`If also $Ty^* = y^*$, then $d(x^*, y^*) \le k\,d(x^*, y^*)$ with $k < 1$, forcing $d(x^*, y^*) = 0$: uniqueness. ∎`,
      ],
      why: String.raw`Iterate, show the steps shrink geometrically, deduce Cauchy, use completeness to get a limit, pass $T$ through the limit, then prove uniqueness. Without completeness the argument stalls at step 3: e.g. $T(x) = x/2$ on $(0, 1]$ is a contraction with no fixed point in that space.`,
    },
    {
      kind: 'explain',
      title: 'Compactness, briefly',
      body: String.raw`A metric space is (sequentially) **compact** if every sequence has a subsequence converging **in the space** — [Bolzano–Weierstrass](@math/sequences-limits) as a definition. Compact sets are where the "hard theorems" live: continuous real functions on a compact space attain a max and min, and are uniformly continuous.

In $\mathbb{R}^n$, **Heine–Borel** says compact ⇔ closed and bounded. That fails in infinite dimensions: in $C[0, 1]$ with the sup metric, the functions $x^n$ all lie in the closed ball of radius $1$, yet no subsequence converges uniformly (any uniform limit would be continuous, but the pointwise limit jumps). Spaces of functions are vast — one reason [Hilbert spaces](@math/hilbert-spaces) and functional analysis need new tools.`,
    },
    {
      kind: 'match',
      prompt: 'Match each space to its usual metric.',
      pairs: [
        [String.raw`$\mathbb{R}^n$ (Euclidean)`, String.raw`$\sqrt{\sum_i (x_i - y_i)^2}$`],
        [String.raw`$C[a, b]$ (sup metric)`, String.raw`$\sup_x |f(x) - g(x)|$`],
        ['DNA strings of equal length', 'number of positions where they differ (Hamming)'],
        ['any set (discrete metric)', '0 if x = y, otherwise 1'],
      ],
      why: 'Each satisfies the three axioms. The sup metric measures the worst-case gap between graphs; Hamming distance counts mismatches; the discrete metric makes every set of points spread out.',
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- A **metric** is a distance obeying positivity, symmetry and the triangle inequality. Limits, continuity and Cauchy sequences transfer verbatim.
- One set can carry many metrics ($d_1, d_2, d_\infty$ on $\mathbb{R}^2$; sup vs $L^1$ on functions), with differently shaped balls.
- **Complete** = every Cauchy sequence converges. $\mathbb{R}$ and $(C[a,b], d_\infty)$ are; $\mathbb{Q}$ and $(0, 1)$ are not.
- **Banach:** a contraction on a complete space has a unique fixed point, found by iteration — the engine behind existence theorems for ODEs.
- Compactness = sequences have convergent subsequences; in $\mathbb{R}^n$ that means closed and bounded, but not in function spaces.`,
    },
  ],
  references: [
    { authors: 'W. Rudin', title: 'Principles of Mathematical Analysis', year: 1976, venue: '3rd ed., McGraw-Hill', detail: 'Ch. 2 (Basic topology: metric spaces, compact sets); Ch. 3 (Cauchy sequences, completeness)' },
    { authors: 'S. Abbott', title: 'Understanding Analysis', year: 2015, venue: '2nd ed., Springer (Undergraduate Texts in Mathematics)', detail: 'Ch. 3 (Basic topology of ℝ); Ch. 8, §8.2 (Metric spaces and the Baire category theorem)' },
    { authors: 'T. Tao', title: 'Analysis II', year: 2016, venue: '3rd ed., Hindustan Book Agency / Springer', detail: 'Ch. 1 (Metric spaces); Ch. 2 (Continuous functions on metric spaces); Ch. 3 (Uniform convergence)' },
    { authors: 'R. G. Bartle, D. R. Sherbert', title: 'Introduction to Real Analysis', year: 2011, venue: '4th ed., Wiley', detail: 'Ch. 11 (A glimpse into topology), incl. metric spaces' },
  ],
} satisfies LessonContent;
