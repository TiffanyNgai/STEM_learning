import type { LessonContent } from '../../types';

export default {
  cards: [
    {
      kind: 'explain',
      title: 'What does "tends to" mean?',
      body: String.raw`A **sequence** is an infinite list $a_1, a_2, a_3, \dots$ — formally a function $n \mapsto a_n$ on $\mathbb{N}$. We say $a_n = 1/n$ "tends to $0$". But what does that mean?

- "The terms get **closer and closer** to $0$"? They also get closer and closer to $-1$. Useless.
- "The terms eventually **equal** $0$"? They never do.

The right idea: whatever **tolerance** you demand, the terms eventually stay within it — **forever**. Not "come close once", not "get closer", but "get close and stay close". Making this precise took mathematicians until the 1800s (Cauchy, Bolzano, Weierstrass).`,
    },
    {
      kind: 'explain',
      title: 'The ε–N definition',
      body: String.raw`**Definition.** $a_n$ **converges** to $L$, written $a_n \to L$ or $\lim a_n = L$, if

$$\forall \varepsilon > 0\ \ \exists N \in \mathbb{N}\ \ \forall n \ge N:\quad |a_n - L| < \varepsilon.$$

Read it as a game. A sceptic picks a tolerance $\varepsilon$ (as tiny as they like). You must reply with a starting index $N$ such that **every** term from $a_N$ on lies in the band $(L - \varepsilon,\ L + \varepsilon)$. If you can always reply, the limit is $L$.

The order of quantifiers matters: $N$ may **depend on** $\varepsilon$ (smaller $\varepsilon$ usually needs larger $N$). See [quantifiers](@math/logic-statements) for why swapping $\forall$ and $\exists$ changes the meaning.`,
    },
    {
      kind: 'widget',
      title: 'Play the ε–N game',
      body: String.raw`Here $a_n = 1 + (-1)^n/n$, which hops above and below $L = 1$. Shrink $\varepsilon$: the band narrows and the required $N$ (green line) moves right — but it **always exists**. That is convergence.`,
      widget: { type: 'MathEpsilonN', props: { expr: '1 + (-1)^n/n', limit: 1, eps: 0.3, nMax: 40 } },
    },
    {
      kind: 'numeric',
      prompt: String.raw`For $a_n = 1/n$ and $L = 0$, with $\varepsilon = 0.01$: what is the **smallest** $N$ such that $|a_n - 0| < 0.01$ for all $n \ge N$?`,
      answer: 101,
      why: String.raw`$1/n < 0.01 \iff n > 100$. So $n = 100$ fails ($1/100$ is not *strictly* less than $0.01$) and $N = 101$ is the smallest that works. Any larger $N$ also works — the definition only asks that **some** $N$ exist.`,
    },
    {
      kind: 'widget',
      title: 'A complete ε–N proof',
      body: String.raw`The standard recipe: **work backwards** on scrap paper to find how large $n$ must be, then write the proof forwards.`,
      widget: {
        type: 'StepReveal',
        props: {
          steps: [
            String.raw`**Claim.** $\dfrac{2n+1}{n+3} \to 2$.`,
            String.raw`Scrap work: $\left|\dfrac{2n+1}{n+3} - 2\right| = \left|\dfrac{2n + 1 - 2n - 6}{n+3}\right| = \dfrac{5}{n+3} < \dfrac{5}{n}$.`,
            String.raw`So it is enough to have $5/n < \varepsilon$, i.e. $n > 5/\varepsilon$.`,
            String.raw`**Proof.** Let $\varepsilon > 0$. By the Archimedean property choose $N \in \mathbb{N}$ with $N > 5/\varepsilon$.`,
            String.raw`For every $n \ge N$: $\left|\dfrac{2n+1}{n+3} - 2\right| = \dfrac{5}{n+3} < \dfrac5n \le \dfrac5N < \varepsilon$. ∎`,
          ],
          notes: ['', 'Simplify |aₙ − L| first.', 'Overestimating (5/(n+3) < 5/n) is allowed and keeps the algebra simple.', 'N depends on ε — exactly what the quantifiers permit.', ''],
        },
      },
    },
    {
      kind: 'order',
      prompt: String.raw`Arrange the proof that $1/\sqrt n \to 0$.`,
      steps: [
        String.raw`Let $\varepsilon > 0$ be arbitrary.`,
        String.raw`Choose $N \in \mathbb{N}$ with $N > 1/\varepsilon^2$ (Archimedean property).`,
        String.raw`Let $n \ge N$. Then $\sqrt n \ge \sqrt N > 1/\varepsilon$.`,
        String.raw`Hence $|1/\sqrt n - 0| = 1/\sqrt n < \varepsilon$.`,
        String.raw`Since $\varepsilon$ was arbitrary, $1/\sqrt n \to 0$. ∎`,
      ],
      why: String.raw`An ε–N proof always opens with "let $\varepsilon > 0$", then **chooses** $N$ in terms of $\varepsilon$, then checks an arbitrary $n \ge N$. The choice $N > 1/\varepsilon^2$ came from solving $1/\sqrt n < \varepsilon$ backwards.`,
    },
    {
      kind: 'widget',
      title: 'When no N works',
      body: String.raw`Negating the definition (flip each quantifier): $a_n \not\to L$ means

$$\exists \varepsilon > 0\ \ \forall N\ \ \exists n \ge N:\ |a_n - L| \ge \varepsilon.$$

Some tolerance is violated **infinitely often**. Below, $a_n = (-1)^n$. Drag the candidate limit $L$ anywhere: with $\varepsilon \le 1$ the terms keep escaping the band, so $(-1)^n$ has **no** limit. Such a sequence **diverges**.`,
      widget: { type: 'MathEpsilonN', props: { expr: '(-1)^n', limit: 0, eps: 0.5, nMax: 30, y: [-1.6, 1.6], moveL: true } },
    },
    {
      kind: 'mcq',
      prompt: String.raw`Which statement means "$a_n$ does **not** converge to $L$"?`,
      choices: [
        String.raw`$\exists \varepsilon > 0\ \forall N\ \exists n \ge N:\ |a_n - L| \ge \varepsilon$`,
        String.raw`$\forall \varepsilon > 0\ \forall N\ \exists n \ge N:\ |a_n - L| \ge \varepsilon$`,
        String.raw`$\exists \varepsilon > 0\ \exists N\ \forall n \ge N:\ |a_n - L| \ge \varepsilon$`,
        String.raw`$\forall \varepsilon > 0\ \exists N\ \forall n \ge N:\ |a_n - L| \ge \varepsilon$`,
      ],
      answer: 0,
      why: String.raw`Negation swaps every $\forall \leftrightarrow \exists$ and negates the inner inequality. The version ending in $\exists N\ \forall n \ge N$ is too strong (it says the terms *eventually all* stay far away). The versions starting with $\forall \varepsilon$ demand failure for **every** tolerance, which even the divergent $(-1)^n$ with $L = 0$ does not satisfy at $\varepsilon = 5$.`,
    },
    {
      kind: 'explain',
      title: 'Limit laws',
      body: String.raw`Once a few limits are known, theorems do the rest. If $a_n \to a$ and $b_n \to b$:

- **Uniqueness:** a sequence has at most one limit.
- **Boundedness:** every convergent sequence is bounded ($|a_n| \le M$ for all $n$).
- **Algebra:** $a_n + b_n \to a + b$, $\ a_n b_n \to ab$, $\ a_n / b_n \to a/b$ if $b \ne 0$.
- **Order:** if $a_n \le b_n$ for all $n$, then $a \le b$. (Strict $<$ is **not** preserved: $0 < 1/n$ but both sides' limits are $0$.)
- **Squeeze:** if $a_n \le c_n \le b_n$ and $a = b$, then $c_n \to a$. Example: $|\sin n / n| \le 1/n$, so $\sin n / n \to 0$.

Each is proved with an ε–N argument once, then used forever.`,
    },
    {
      kind: 'truefalse',
      prompt: 'Every bounded sequence converges.',
      answer: false,
      why: String.raw`$(-1)^n$ is bounded (by $1$) but diverges. The converse **is** true: convergent ⇒ bounded. To get convergence from boundedness you need more — e.g. monotonicity (next card).`,
    },
    {
      kind: 'widget',
      title: 'Monotone convergence',
      body: String.raw`**Monotone convergence theorem.** If $(a_n)$ is increasing and bounded above, then it converges — to $\sup\{a_n\}$.

*Proof.* Let $s = \sup\{a_n\}$, which exists by [completeness](@math/real-numbers-completeness). Given $\varepsilon > 0$, $s - \varepsilon$ is not an upper bound, so some $a_N > s - \varepsilon$. For $n \ge N$, monotonicity gives $s - \varepsilon < a_N \le a_n \le s$. ∎

Example: $a_n = (1 + 1/n)^n$ is increasing and bounded by $3$; its limit is one standard **definition** of $e \approx 2.71828$. Notice how slowly it creeps up.`,
      widget: { type: 'MathEpsilonN', props: { expr: '(1 + 1/n)^n', limit: 2.718281828, eps: 0.1, nMax: 40 } },
    },
    {
      kind: 'multi',
      prompt: 'Which sequences converge (to a real number)?',
      choices: [String.raw`$1/n$`, String.raw`$(-1)^n$`, String.raw`$\sin(n)/n$`, String.raw`$n/(n+1)$`, String.raw`$\sqrt n$`],
      answers: [0, 2, 3],
      why: String.raw`$1/n \to 0$; $|\sin n/n| \le 1/n$ so it is squeezed to $0$; $n/(n+1) = 1 - 1/(n+1) \to 1$. $(-1)^n$ oscillates between $\pm1$, and $\sqrt n$ is unbounded — and every convergent sequence is bounded.`,
    },
    {
      kind: 'explain',
      title: 'Bolzano–Weierstrass and Cauchy sequences',
      body: String.raw`Two more faces of completeness:

- **Bolzano–Weierstrass.** Every bounded sequence has a convergent **subsequence** ($a_{n_1}, a_{n_2}, \dots$ with $n_1 < n_2 < \cdots$). For $(-1)^n$: the even terms converge to $1$. Proof: repeatedly halve an interval containing infinitely many terms — nested intervals again.
- **Cauchy criterion.** Call $(a_n)$ **Cauchy** if its terms get close to **each other**: for every $\varepsilon > 0$ there is $N$ with $|a_m - a_n| < \varepsilon$ for all $m, n \ge N$. In $\mathbb{R}$, *Cauchy ⇔ convergent*.

The Cauchy criterion is powerful because it never mentions the limit $L$ — you can prove convergence without knowing the answer. In $\mathbb{Q}$ it fails: $1, 1.4, 1.41, 1.414, \dots$ is Cauchy, but its limit $\sqrt2$ is not rational.`,
    },
    {
      kind: 'fill',
      prompt: String.raw`$(a_n)$ is Cauchy if for ___ $\varepsilon > 0$ there ___ an $N$ such that $|a_m - a_n| < \varepsilon$ for all $m, n \ge N$.`,
      bank: ['every', 'some', 'exists', 'is no'],
      answer: ['every', 'exists'],
      why: String.raw`Same shape as convergence — "for every $\varepsilon$ there exists $N$" — but comparing terms with each other ($|a_m - a_n|$) instead of with a limit $L$. "For some $\varepsilon$" would be far too weak: every bounded sequence passes for a big enough $\varepsilon$.`,
    },
    {
      kind: 'match',
      prompt: 'Match each theorem to what it says.',
      pairs: [
        ['Monotone convergence', 'bounded + monotone ⇒ convergent'],
        ['Bolzano–Weierstrass', 'bounded ⇒ has a convergent subsequence'],
        ['Cauchy criterion', 'terms eventually close to each other ⇔ convergent'],
        ['Squeeze theorem', 'trapped between two sequences with the same limit ⇒ same limit'],
      ],
      why: 'In an ordered field, monotone convergence and Bolzano–Weierstrass are each equivalent to completeness, and so is the Cauchy criterion together with the Archimedean property. The squeeze theorem is a plain order property that holds in ℚ too.',
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- $a_n \to L$ ⇔ $\forall \varepsilon > 0\ \exists N\ \forall n \ge N: |a_n - L| < \varepsilon$ — get close **and stay** close. $N$ may depend on $\varepsilon$.
- Proof recipe: simplify $|a_n - L|$, overestimate, solve for $n$, then choose $N$ via the Archimedean property.
- Divergence: some $\varepsilon$ is violated infinitely often (e.g. $(-1)^n$).
- Limit laws (sum, product, quotient, squeeze) do routine work; convergent ⇒ bounded, not conversely.
- Completeness gives monotone convergence, Bolzano–Weierstrass and the Cauchy criterion.

Next: adding up infinitely many terms — [series](@math/series-convergence).`,
    },
  ],
  references: [
    { authors: 'S. Abbott', title: 'Understanding Analysis', year: 2015, venue: '2nd ed., Springer (Undergraduate Texts in Mathematics)', detail: 'Ch. 2, §2.2–2.6 (limits, limit theorems, monotone convergence, Bolzano–Weierstrass, Cauchy criterion)' },
    { authors: 'W. Rudin', title: 'Principles of Mathematical Analysis', year: 1976, venue: '3rd ed., McGraw-Hill', detail: 'Ch. 3 (Numerical sequences and series: convergent sequences, subsequences, Cauchy sequences)' },
    { authors: 'T. Tao', title: 'Analysis I', year: 2016, venue: '3rd ed., Hindustan Book Agency / Springer', detail: 'Ch. 6 (Limits of sequences)' },
    { authors: 'M. Spivak', title: 'Calculus', year: 2008, venue: '4th ed., Publish or Perish', detail: 'Ch. 22 (Infinite sequences)' },
  ],
} satisfies LessonContent;
