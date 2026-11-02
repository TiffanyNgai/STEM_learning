import type { LessonContent } from '../../types';

const primes = [2, 3, 5, 7, 11, 13];
const euclidSvg = `<svg viewBox="0 0 320 190" xmlns="http://www.w3.org/2000/svg" font-family="inherit">
  <text x="160" y="16" text-anchor="middle" font-size="11" fill="var(--fg)">Suppose the only primes were 2, 3, 5, 7, 11, 13.</text>
  <text x="160" y="38" text-anchor="middle" font-size="12" fill="var(--c2)" font-weight="bold">N = 2·3·5·7·11·13 + 1 = 30031</text>
  ${primes.map((p, i) => {
    const x = 30 + i * 45; const b = (0.4 + i * 0.35).toFixed(2);
    return `<g><rect x="${x - 19}" y="54" width="38" height="44" rx="6" fill="var(--surface-2)" stroke="var(--muted)"/>` +
      `<text x="${x}" y="70" text-anchor="middle" font-size="10" fill="var(--fg)">N ÷ ${p}</text>` +
      `<text x="${x}" y="88" text-anchor="middle" font-size="10" fill="var(--c5)" opacity="0">rem 1<animate attributeName="opacity" values="0;0;1;1" keyTimes="0;${(+b / 7).toFixed(3)};${(+b / 7 + 0.02).toFixed(3)};1" dur="7s" repeatCount="indefinite"/></text></g>`;
  }).join('')}
  <text x="160" y="120" text-anchor="middle" font-size="10" fill="var(--fg)">No listed prime divides N — it always leaves remainder 1.</text>
  <g opacity="0"><animate attributeName="opacity" values="0;0;1;1" keyTimes="0;0.45;0.5;1" dur="7s" repeatCount="indefinite"/>
    <rect x="40" y="132" width="240" height="46" rx="10" fill="var(--c1)" fill-opacity="0.15" stroke="var(--c1)"/>
    <text x="160" y="151" text-anchor="middle" font-size="11" fill="var(--fg)">But N has a prime factor: 30031 = 59 × 509.</text>
    <text x="160" y="168" text-anchor="middle" font-size="10" fill="var(--fg)">59 is a prime missing from the list. Contradiction!</text>
  </g>
</svg>`;

export default {
  cards: [
    {
      kind: 'explain',
      title: 'When the front door is locked',
      body: String.raw`Some theorems resist a direct attack. Try "if $n^2$ is even, then $n$ is even" directly: $n^2 = 2k$, so $n = \sqrt{2k}$… and you are stuck — square roots tell you nothing about parity.

Two indirect methods come to the rescue:

- **Contrapositive**: prove $\neg Q \Rightarrow \neg P$ instead of $P \Rightarrow Q$. It is logically equivalent (we checked with a truth table in [the logic lesson](@math/logic-statements)).
- **Contradiction**: assume the statement is false and derive something impossible.

Both are ancient: Euclid used contradiction more than 2,300 years ago.`,
    },
    {
      kind: 'widget',
      title: 'Proof by contrapositive',
      body: String.raw`**Theorem.** For every integer $n$, if $n^2$ is even then $n$ is even.`,
      widget: {
        type: 'StepReveal',
        props: {
          steps: [
            String.raw`The contrapositive is: if $n$ is **not** even, then $n^2$ is **not** even — i.e. if $n$ is odd then $n^2$ is odd.`,
            String.raw`So suppose $n$ is odd: $n = 2k + 1$ for some integer $k$.`,
            String.raw`Then $n^2 = 4k^2 + 4k + 1 = 2(2k^2 + 2k) + 1$ is odd.`,
            String.raw`We proved $\neg Q \Rightarrow \neg P$, which is equivalent to $P \Rightarrow Q$. ∎`,
          ],
          notes: [
            'Every integer is even or odd, so "not even" = "odd".',
            'Now the hypothesis is easy to unpack — that is the whole trick.',
            'This is exactly the "first proof" from the previous lesson, reused.',
            '',
          ],
        },
      },
    },
    {
      kind: 'mcq',
      prompt: String.raw`What is the **contrapositive** of: "if $ab$ is even, then $a$ is even or $b$ is even"?`,
      choices: [
        String.raw`If $a$ is even or $b$ is even, then $ab$ is even.`,
        String.raw`If $a$ is odd and $b$ is odd, then $ab$ is odd.`,
        String.raw`If $a$ is odd or $b$ is odd, then $ab$ is odd.`,
        String.raw`If $ab$ is odd, then $a$ is odd and $b$ is odd.`,
      ],
      answer: 1,
      why: String.raw`Contrapositive: $\neg Q \Rightarrow \neg P$. Here $\neg Q = \neg(a \text{ even} \vee b \text{ even}) = a \text{ odd} \wedge b \text{ odd}$ (De Morgan!), and $\neg P$ = "$ab$ is odd". "If $a$ is even or $b$ is even, then $ab$ is even" is the converse; "if $ab$ is odd, then $a$ and $b$ are odd" is the inverse ($\neg P \Rightarrow \neg Q$), equivalent to the converse.`,
    },
    {
      kind: 'explain',
      title: 'Proof by contradiction',
      body: String.raw`To prove a statement $S$:

1. **Assume** $\neg S$ (say so explicitly: "Suppose, for contradiction, that…").
2. Reason correctly until you reach a **contradiction** — some $R$ and $\neg R$ both true, e.g. "$p$ is even and $p$ is odd".
3. Since correct reasoning from a true assumption never yields a falsehood, $\neg S$ must be false. So $S$ is true.

Why does this work? Because $\neg S \Rightarrow (R \wedge \neg R)$ can only be true if $\neg S$ is false (an implication with a false conclusion is true only when its hypothesis is false). It is especially handy for "there is no…" and "…is irrational" statements, whose negations hand you something concrete to work with.`,
    },
    {
      kind: 'widget',
      title: '√2 is irrational',
      body: String.raw`A number is **rational** if it equals $a/b$ for integers $a, b$ with $b \ne 0$; otherwise it is **irrational**. The discovery that the diagonal of a unit square is irrational (incommensurable with its side), traditionally credited to the Pythagoreans, is one of the oldest proofs we have.`,
      widget: {
        type: 'StepReveal',
        props: {
          steps: [
            String.raw`Suppose, for contradiction, that $\sqrt2$ is rational: $\sqrt2 = a/b$ with integers $a, b$, $b \ne 0$, and the fraction in **lowest terms** (no common factor $> 1$).`,
            String.raw`Square: $2 = a^2/b^2$, so $a^2 = 2b^2$. Hence $a^2$ is even.`,
            String.raw`By the contrapositive theorem we just proved, $a$ is even: $a = 2c$.`,
            String.raw`Then $4c^2 = 2b^2$, so $b^2 = 2c^2$ is even, hence $b$ is even too.`,
            String.raw`Now $a$ and $b$ share the factor 2 — contradicting "lowest terms". So $\sqrt2$ is irrational. ∎`,
          ],
          notes: [
            'Any fraction can be reduced by dividing top and bottom by their gcd.',
            '',
            'Earlier theorems become tools.',
            'Same argument, applied to b.',
            'R = "a/b is in lowest terms" and ¬R have both been derived.',
          ],
        },
      },
    },
    {
      kind: 'mcq',
      prompt: String.raw`In the proof that $\sqrt2$ is irrational, why are we allowed to assume $a/b$ is in lowest terms?`,
      choices: [
        'Because we are free to assume anything in a proof by contradiction.',
        String.raw`Because every rational number can be written in lowest terms (divide $a$ and $b$ by their greatest common divisor).`,
        String.raw`Because $a$ and $b$ are both odd.`,
        String.raw`Because $\sqrt2 < 2$.`,
      ],
      answer: 1,
      why: String.raw`The only extra assumption allowed is $\neg S$ itself. "Lowest terms" is not an extra assumption: if $\sqrt2$ is rational at all, it has a lowest-terms form, so we lose nothing by choosing it. Assuming arbitrary extra things would make the contradiction meaningless.`,
    },
    {
      kind: 'widget',
      title: 'Euclid: there are infinitely many primes',
      body: String.raw`**Theorem (Euclid, *Elements* IX.20).** There are infinitely many primes. Suppose, for contradiction, there are only finitely many: $p_1, \dots, p_k$. Let $N = p_1 p_2 \cdots p_k + 1$. Dividing $N$ by any $p_i$ leaves remainder $1$, so no $p_i$ divides $N$. But $N > 1$ has *some* prime factor — a prime not on the list. Contradiction.`,
      widget: { type: 'SvgDiagram', props: { svg: euclidSvg } },
    },
    {
      kind: 'numeric',
      prompt: String.raw`$N = 2\cdot3\cdot5\cdot7\cdot11\cdot13 + 1 = 30031$. What is the remainder when $N$ is divided by $13$?`,
      answer: 1,
      why: String.raw`$2\cdot3\cdot5\cdot7\cdot11\cdot13$ is a multiple of $13$, so adding $1$ leaves remainder $1$. That is the heart of Euclid's argument: no prime on the list divides $N$.`,
    },
    {
      kind: 'truefalse',
      prompt: String.raw`Euclid's argument shows that $p_1 p_2 \cdots p_k + 1$ is always a prime number.`,
      answer: false,
      why: String.raw`It only shows that $N$'s prime factors are missing from the list. $N$ itself need not be prime: $30031 = 59 \times 509$. A common misreading of the proof — and a reason to state precisely what each step gives you.`,
    },
    {
      kind: 'order',
      prompt: 'Put the steps of Euclid’s proof in order.',
      steps: [
        String.raw`Suppose, for contradiction, that $p_1, \dots, p_k$ are all the primes.`,
        String.raw`Form $N = p_1 p_2 \cdots p_k + 1$.`,
        String.raw`Each $p_i$ leaves remainder $1$ when dividing $N$, so no $p_i$ divides $N$.`,
        String.raw`$N > 1$, so it has a prime factor $q$, and $q$ is not any of the $p_i$.`,
        String.raw`This contradicts the assumption that the list was complete; so there are infinitely many primes. ∎`,
      ],
      why: 'Assume the negation, build a clever object (N), extract a property (no listed prime divides it), collide with a known fact (every integer > 1 has a prime factor), and conclude.',
    },
    {
      kind: 'match',
      prompt: String.raw`Match each method for proving $P \Rightarrow Q$ with what you actually do.`,
      pairs: [
        ['Direct proof', String.raw`Assume $P$; deduce $Q$.`],
        ['Contrapositive', String.raw`Assume $\neg Q$; deduce $\neg P$.`],
        ['Contradiction', String.raw`Assume $P$ and $\neg Q$; deduce something impossible.`],
        [String.raw`Converse (**not** a proof of $P \Rightarrow Q$)`, String.raw`Assume $Q$; deduce $P$.`],
      ],
      why: String.raw`For an implication, $\neg(P \Rightarrow Q) \equiv P \wedge \neg Q$, so a contradiction proof assumes both $P$ and $\neg Q$. Proving the converse $Q \Rightarrow P$ says nothing about $P \Rightarrow Q$ — a frequent error.`,
    },
    {
      kind: 'multi',
      prompt: String.raw`Which are valid ways to prove "for all integers $n$, if $n^2$ is even then $n$ is even"?`,
      choices: [
        String.raw`Show: if $n$ is odd, then $n^2$ is odd.`,
        String.raw`Assume $n^2$ is even and $n$ is odd, and derive a contradiction.`,
        String.raw`Show: if $n$ is even, then $n^2$ is even.`,
        String.raw`Check every $n$ from $1$ to $1000$.`,
        String.raw`Show: if $n^2$ is odd, then $n$ is odd.`,
      ],
      answers: [0, 1],
      why: String.raw`(1) is the contrapositive; (2) is contradiction ($P \wedge \neg Q$). (3) is the converse. (5) is the contrapositive of the converse, so equivalent to (3) — also the wrong direction. (4) is evidence, not proof.`,
    },
    {
      kind: 'fill',
      prompt: String.raw`**$\log_2 3$ is irrational.** Suppose $\log_2 3 = a/b$ with positive integers $a, b$. Then $2^{a/b} = 3$, so $2^a = 3^b$. But $2^a$ is ___ and $3^b$ is ___ — a contradiction.`,
      bank: ['even', 'odd', 'prime', 'negative'],
      answer: ['even', 'odd'],
      why: String.raw`Since $a \ge 1$, $2^a$ is even; $3^b$ is a product of odd numbers, hence odd. An integer can't be both. ($a, b > 0$ is fine because $\log_2 3 > 0$.) Parity is a favourite source of contradictions.`,
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- **Contrapositive**: prove $\neg Q \Rightarrow \neg P$; it is equivalent to $P \Rightarrow Q$. Use it when $\neg Q$ is easier to unpack than $P$.
- **Contradiction**: assume $\neg S$, derive $R \wedge \neg R$, conclude $S$. Great for "irrational", "infinitely many", "no such…".
- Never prove the **converse** by mistake.
- Classics: $\sqrt2 \notin \mathbb{Q}$; infinitely many primes (Euclid); $\log_2 3 \notin \mathbb{Q}$.

Next: a method for statements about *every* natural number — [induction](@math/induction).`,
    },
  ],
  references: [
    { authors: 'R. Hammack', title: 'Book of Proof', year: 2018, venue: '3rd ed., self-published (free online)', detail: 'Ch. 5 (Contrapositive proof), Ch. 6 (Proof by contradiction)', url: 'https://richardhammack.github.io/BookOfProof/' },
    { authors: 'D. J. Velleman', title: 'How to Prove It: A Structured Approach', year: 2019, venue: '3rd ed., Cambridge University Press', detail: 'Ch. 3 (Proofs)' },
    { authors: 'Euclid (trans. T. L. Heath)', title: 'The Thirteen Books of Euclid’s Elements', year: 1908, venue: 'Cambridge University Press', detail: 'Book IX, Proposition 20' },
    { authors: 'M. Aigner, G. M. Ziegler', title: 'Proofs from THE BOOK', year: 2018, venue: '6th ed., Springer', detail: 'Ch. 1 (Six proofs of the infinity of primes)' },
  ],
} satisfies LessonContent;
