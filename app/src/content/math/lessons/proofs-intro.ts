import type { LessonContent } from '../../types';

// n² + n + 41 for n = 0..40: prime for n ≤ 39, then 40² + 40 + 41 = 1681 = 41².
const isPrime = (m: number) => { if (m < 2) return false; for (let d = 2; d * d <= m; d++) if (m % d === 0) return false; return true; };
const eulerSvg = `<svg viewBox="0 0 320 150" xmlns="http://www.w3.org/2000/svg" font-family="inherit">
  <text x="160" y="14" text-anchor="middle" font-size="11" fill="var(--fg)">Is n² + n + 41 prime?   n = 0, 1, …, 40</text>
  ${Array.from({ length: 41 }, (_, n) => {
    const x = 9 + (n % 14) * 22, y = 26 + Math.floor(n / 14) * 26; const p = isPrime(n * n + n + 41);
    const col = p ? 'var(--c1)' : 'var(--c5)';
    return `<g><rect x="${x}" y="${y}" width="19" height="20" rx="4" fill="${col}" fill-opacity="0">` +
      `<animate attributeName="fill-opacity" values="0;0;0.85;0.85" keyTimes="0;${(n / 41 * 0.8).toFixed(3)};${(n / 41 * 0.8 + 0.02).toFixed(3)};1" dur="8s" repeatCount="indefinite"/></rect>` +
      `<rect x="${x}" y="${y}" width="19" height="20" rx="4" fill="none" stroke="${col}"/>` +
      `<text x="${x + 9.5}" y="${y + 14}" text-anchor="middle" font-size="9" fill="var(--fg)">${n}</text></g>`;
  }).join('')}
  <g font-size="10">
    <rect x="9" y="112" width="10" height="10" rx="2" fill="var(--c1)"/><text x="23" y="121" fill="var(--fg)">prime (n = 0 … 39: forty in a row!)</text>
    <rect x="9" y="128" width="10" height="10" rx="2" fill="var(--c5)"/><text x="23" y="137" fill="var(--fg)">n = 40: 1600 + 40 + 41 = 1681 = 41 × 41</text>
  </g>
</svg>`;

export default {
  cards: [
    {
      kind: 'explain',
      title: 'Forty examples are not a proof',
      body: String.raw`Plug $n = 0, 1, 2, \dots$ into $n^2 + n + 41$ (a polynomial noticed by Euler): you get $41, 43, 47, 53, 61, \dots$ — all prime. The pattern holds for **forty** consecutive values. Surely it is always prime?

It is not. Watch the boxes fill in. No amount of checking examples can establish a statement about *infinitely many* numbers; one failure can destroy it. A **proof** is what lets mathematicians say "always" with total certainty.`,
      widget: { type: 'SvgDiagram', props: { svg: eulerSvg } },
    },
    {
      kind: 'numeric',
      prompt: String.raw`Compute $n^2 + n + 41$ at $n = 40$.`,
      answer: 1681,
      why: String.raw`$1600 + 40 + 41 = 1681 = 41^2$. You can see it without arithmetic: $40^2 + 40 + 41 = 40(40+1) + 41 = 40\cdot 41 + 41 = 41\cdot 41$. So the pattern breaks — it was never a theorem.`,
    },
    {
      kind: 'explain',
      title: 'What a proof is',
      body: String.raw`A **proof** is a finite chain of statements, each of which is an assumption, a **definition**, an axiom, an already-proved theorem, or follows from earlier lines by a rule of logic — ending with the claim.

Definitions are the raw material, so they must be exact. For integers:

- $n$ is **even** if $n = 2k$ for some integer $k$.
- $n$ is **odd** if $n = 2k + 1$ for some integer $k$.
- $a$ **divides** $b$, written $a \mid b$, if $b = ak$ for some integer $k$. (So $3 \mid 12$ since $12 = 3\cdot 4$.)

Every integer is exactly one of even or odd (division by 2 leaves remainder 0 or 1).`,
    },
    {
      kind: 'truefalse',
      prompt: String.raw`By the definition above, $0$ is an even number.`,
      answer: true,
      why: String.raw`$0 = 2 \cdot 0$, and $0$ is an integer, so $0$ fits "$n = 2k$ for some integer $k$" exactly. Intuition ("even numbers are 2, 4, 6…") is not the judge — the definition is.`,
    },
    {
      kind: 'explain',
      title: 'The direct-proof template',
      body: String.raw`Most theorems have the shape "for all $x$, if $P(x)$ then $Q(x)$". A **direct proof**:

1. **Let $x$ be arbitrary** — fix one, but assume nothing about it beyond the hypotheses. Whatever you prove then holds for every $x$.
2. **Assume $P(x)$** and unpack it with definitions.
3. Manipulate (algebra, known facts) until you reach the definition of $Q(x)$.
4. **Conclude $Q(x)$.** Mark the end with ∎.

Work "backwards" on scrap paper (what does $Q$ need?) and "forwards" from $P$ until the two meet. The written proof then goes forwards only.`,
    },
    {
      kind: 'widget',
      title: 'A first proof',
      body: String.raw`**Theorem.** For every integer $n$, if $n$ is odd then $n^2$ is odd.`,
      widget: {
        type: 'StepReveal',
        props: {
          steps: [
            String.raw`Let $n$ be an arbitrary integer and suppose $n$ is odd.`,
            String.raw`By definition of odd, $n = 2k + 1$ for some integer $k$.`,
            String.raw`Then $n^2 = (2k+1)^2 = 4k^2 + 4k + 1 = 2(2k^2 + 2k) + 1$.`,
            String.raw`Since $m = 2k^2 + 2k$ is an integer, $n^2 = 2m + 1$ is odd by definition. ∎`,
          ],
          notes: [
            '"Arbitrary" = we use no special property of n, so the argument covers all odd n.',
            'Unpack the hypothesis with the definition.',
            'Algebra aimed at the target shape "2·(integer) + 1".',
            'Repack: the conclusion matches the definition word for word.',
          ],
        },
      },
    },
    {
      kind: 'order',
      prompt: String.raw`Put the proof in order. **Theorem:** for all integers $a, b, c$, if $a \mid b$ and $b \mid c$ then $a \mid c$.`,
      steps: [
        String.raw`Let $a, b, c$ be integers with $a \mid b$ and $b \mid c$.`,
        String.raw`By definition, $b = ak$ and $c = bl$ for some integers $k, l$.`,
        String.raw`Substitute: $c = (ak)l = a(kl)$.`,
        String.raw`Since $kl$ is an integer, $a \mid c$ by definition. ∎`,
      ],
      why: 'Same template: fix arbitrary objects, unpack each hypothesis with the definition (using different letters k and l, since the two multipliers need not be equal), combine, and repack into the definition of the conclusion.',
    },
    {
      kind: 'explain',
      title: 'Existence, counterexamples and cases',
      body: String.raw`- To prove **"there exists"** an $x$ with $P(x)$, it is enough to exhibit one and check it: "there is an even prime" — take $2$.
- To **disprove** "for all $x$, $P(x)$", one **counterexample** suffices — like $n = 40$ above. (By the logic lesson: $\neg\forall x\,P(x) \equiv \exists x\,\neg P(x)$.)
- **Proof by cases**: split into exhaustive cases and prove each one.`,
      widget: {
        type: 'StepReveal',
        props: {
          steps: [
            String.raw`**Claim:** for every integer $n$, $n^2 + n$ is even. Let $n$ be an integer. Every integer is even or odd.`,
            String.raw`**Case 1:** $n = 2k$. Then $n^2 + n = 4k^2 + 2k = 2(2k^2 + k)$, which is even.`,
            String.raw`**Case 2:** $n = 2k+1$. Then $n^2 + n = (4k^2 + 4k + 1) + (2k + 1) = 2(2k^2 + 3k + 1)$, even.`,
            String.raw`The cases cover all integers, so the claim holds. ∎ (Slicker: $n^2 + n = n(n+1)$, and one of two consecutive integers is even.)`,
          ],
        },
      },
    },
    {
      kind: 'multi',
      prompt: 'Which of these can be settled by exhibiting a **single** well-chosen example?',
      choices: [
        'Proving "there is an even prime number".',
        'Disproving "every prime number is odd".',
        'Proving "every prime greater than 2 is odd".',
        String.raw`Disproving "there is an integer $n$ with $n^2 = 2$".`,
        'Proving "some integer is divisible by both 7 and 11".',
      ],
      answers: [0, 1, 4],
      why: String.raw`An example proves a "there exists" ($2$; $77$) and disproves a "for all" (the counterexample $2$). Proving a "for all" needs a general argument, and disproving a "there exists" means showing *no* $n$ works — again a statement about all $n$.`,
    },
    {
      kind: 'mcq',
      prompt: String.raw`Find the flaw. "**Claim:** the sum of two odd integers is even. **Proof:** Let $m = 2k + 1$ and $n = 2k + 1$. Then $m + n = 4k + 2 = 2(2k+1)$, which is even. ∎"`,
      choices: [
        'Nothing — the proof is correct.',
        String.raw`Using the same $k$ for both forces $m = n$, so it only proves the claim when the two numbers are equal.`,
        String.raw`$4k + 2$ is not even.`,
        'A proof about all odd integers must check several examples first.',
      ],
      answer: 1,
      why: String.raw`Each hypothesis brings its own unknown: $m = 2k+1$, $n = 2l+1$. Then $m + n = 2(k + l + 1)$ — even, and now for *all* pairs. Reusing a letter silently adds the assumption $m = n$. (The claim is true; the proof was incomplete.)`,
    },
    {
      kind: 'match',
      prompt: 'Match each goal to the standard opening move of its proof.',
      pairs: [
        [String.raw`$\forall x,\ P(x)$`, String.raw`"Let $x$ be arbitrary…" then prove $P(x)$`],
        [String.raw`$\exists x,\ P(x)$`, String.raw`Exhibit a specific $x$ and verify $P(x)$`],
        [String.raw`$P \Rightarrow Q$`, String.raw`"Assume $P$…" then derive $Q$`],
        [String.raw`$P \Leftrightarrow Q$`, String.raw`Prove $P \Rightarrow Q$ and $Q \Rightarrow P$ separately`],
      ],
      why: 'The logical form of the goal dictates the skeleton of the proof (Velleman builds his whole book on this idea). Read the theorem, identify its outermost connective or quantifier, and the first line of the proof writes itself.',
    },
    {
      kind: 'fill',
      prompt: String.raw`An integer $n$ is odd if $n =$ ___ for some integer $k$. To prove a "for all" statement, begin with "Let $n$ be ___".`,
      bank: [String.raw`$2k+1$`, String.raw`$2k$`, String.raw`$k+1$`, 'arbitrary', 'equal to 1', 'large'],
      answer: [String.raw`$2k+1$`, 'arbitrary'],
      why: String.raw`Odd means "twice an integer, plus one". Fixing an *arbitrary* $n$ (not $n = 1$, not "large") is what lets the conclusion transfer to every $n$.`,
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- Examples can **suggest** a theorem or **refute** a "for all", but cannot prove a "for all".
- A proof is a chain of justified steps from hypotheses and **definitions** to the conclusion.
- Direct proof of $P \Rightarrow Q$: let objects be arbitrary, assume $P$, unpack definitions, reach $Q$.
- Use **fresh letters** for each unknown; split into **cases** when it helps.
- Write in full sentences and say what you assume — a proof is meant to convince a reader.

Next: proving things indirectly — [contradiction & contrapositive](@math/contradiction-contrapositive).`,
    },
  ],
  references: [
    { authors: 'D. J. Velleman', title: 'How to Prove It: A Structured Approach', year: 2019, venue: '3rd ed., Cambridge University Press', detail: 'Ch. 3 (Proofs)' },
    { authors: 'R. Hammack', title: 'Book of Proof', year: 2018, venue: '3rd ed., self-published (free online)', detail: 'Ch. 4 (Direct proof), Ch. 9 (Disproof)', url: 'https://richardhammack.github.io/BookOfProof/' },
    { authors: 'G. Pólya', title: 'How to Solve It', year: 1945, venue: 'Princeton University Press' },
  ],
} satisfies LessonContent;
