import type { LessonContent } from '../../types';

export default {
  cards: [
    {
      kind: 'explain',
      title: 'Why mathematicians are fussy about words',
      body: String.raw`Everyday language is full of wiggle room. "You can have cake or ice cream" usually means *not both*; "everybody loves somebody" could mean one lucky person or a different person for each of us. In mathematics such ambiguity is fatal, so we use a small, exact vocabulary.

The basic unit is a **statement** (or *proposition*): a sentence that is definitely either **true (T)** or **false (F)**.

- "$7$ is prime" — a true statement.
- "$2 + 2 = 5$" — a false statement (still a statement!).
- "Close the door" or "$x > 3$" — *not* statements: a command has no truth value, and "$x > 3$" depends on what $x$ is.`,
    },
    {
      kind: 'explain',
      title: 'Connectives: not, and, or',
      body: String.raw`Statements are glued together by **connectives**. With $P$, $Q$ standing for statements:

- **not** $P$, written $\neg P$: true exactly when $P$ is false.
- $P$ **and** $Q$, written $P \wedge Q$: true only when *both* are true.
- $P$ **or** $Q$, written $P \vee Q$: true when *at least one* is true. Mathematical "or" is **inclusive** — "both" counts.

A **truth table** lists every combination of truth values (2 variables → $2^2 = 4$ rows) and the value of the compound statement in each. The table below is live: tap a row to highlight it.`,
      widget: {
        type: 'MathTruthTable',
        props: { vars: ['P', 'Q'], columns: [{ expr: '!P' }, { expr: 'P & Q' }, { expr: 'P | Q' }] },
        caption: 'Green T = true, red F = false. "P ∨ Q" is false in only one row.',
      },
    },
    {
      kind: 'mcq',
      prompt: 'Which of these is a statement (has a definite truth value)?',
      choices: [
        String.raw`"$x^2 = 4$"`,
        String.raw`"Every even number greater than 2 is a sum of two primes."`,
        '"Is 91 prime?"',
        '"Let n be an integer."',
      ],
      answer: 1,
      why: String.raw`Goldbach's conjecture is either true or false — we just don't know which yet. A statement needs a truth value, not a known one. "$x^2 = 4$" depends on $x$ (it is an *open sentence*), a question has no truth value, and "Let $n$ be…" is an instruction.`,
    },
    {
      kind: 'explain',
      title: 'Implication: "if P, then Q"',
      body: String.raw`$P \Rightarrow Q$ ("if $P$ then $Q$", "$P$ implies $Q$") is the most important connective in mathematics. Think of it as a **promise**: "If you score 90%, I'll buy you lunch."

- You score 90% and get lunch: promise kept (T).
- You score 90% and no lunch: promise **broken** (F).
- You don't score 90%: whatever happens, the promise wasn't broken (T).

So $P \Rightarrow Q$ is false **only** when $P$ is true and $Q$ is false. When $P$ is false the implication is called **vacuously true**. Predict each row below, then tap the ? to check.`,
      widget: {
        type: 'MathTruthTable',
        props: { vars: ['P', 'Q'], columns: [{ expr: 'P -> Q' }], quiz: true },
      },
    },
    {
      kind: 'truefalse',
      prompt: String.raw`The statement "If $2 + 2 = 5$, then the Moon is made of cheese" is true.`,
      answer: true,
      why: String.raw`The hypothesis $2+2=5$ is false, so the implication is vacuously true — the "promise" can never be broken. Implication says nothing about cause and effect; it only rules out "T ⇒ F".`,
    },
    {
      kind: 'explain',
      title: 'Converse, contrapositive, iff',
      body: String.raw`From $P \Rightarrow Q$ we can build:

- the **converse** $Q \Rightarrow P$,
- the **contrapositive** $\neg Q \Rightarrow \neg P$.

The contrapositive always has the **same truth value** as the original (they are *logically equivalent*, written $\equiv$). The converse does **not**: "if $n = 2$ then $n$ is even" is true, its converse "if $n$ is even then $n = 2$" is false.

Also $P \Rightarrow Q \;\equiv\; \neg P \vee Q$. And $P \Leftrightarrow Q$ ("$P$ **if and only if** $Q$", "iff") means both $P \Rightarrow Q$ and $Q \Rightarrow P$. Compare the columns:`,
      widget: {
        type: 'MathTruthTable',
        props: { vars: ['P', 'Q'], columns: [{ expr: 'P -> Q' }, { expr: 'Q -> P', label: 'Q → P (converse)' }, { expr: '!Q -> !P', label: '¬Q → ¬P (contrapos.)' }, { expr: '!P | Q' }] },
        caption: 'The widget reports which columns agree on every row.',
      },
    },
    {
      kind: 'match',
      prompt: String.raw`Translate each English phrase into symbols.`,
      pairs: [
        [String.raw`"$P$ only if $Q$"`, String.raw`$P \Rightarrow Q$`],
        [String.raw`"$P$ if $Q$"`, String.raw`$Q \Rightarrow P$`],
        [String.raw`"$P$ if and only if $Q$"`, String.raw`$P \Leftrightarrow Q$`],
        [String.raw`"Neither $P$ nor $Q$"`, String.raw`$\neg P \wedge \neg Q$`],
      ],
      why: String.raw`"$P$ only if $Q$": $P$ can't happen without $Q$, so $P \Rightarrow Q$ — the classic trap is reading it backwards. "$P$ if $Q$" puts the condition on $Q$: $Q \Rightarrow P$. "If and only if" is both directions at once. "Neither…nor" is $\neg(P \vee Q)$, which (De Morgan, next card) equals $\neg P \wedge \neg Q$.`,
    },
    {
      kind: 'explain',
      title: 'Negating: De Morgan’s laws',
      body: String.raw`To negate "and" or "or", flip the connective and negate each part (**De Morgan's laws**):

$$\neg(P \wedge Q) \equiv \neg P \vee \neg Q, \qquad \neg(P \vee Q) \equiv \neg P \wedge \neg Q.$$

"It is not the case that I am tall and rich" = "I am not tall *or* not rich."

Negating an implication: $P \Rightarrow Q$ fails exactly when $P$ holds and $Q$ doesn't, so
$$\neg(P \Rightarrow Q) \equiv P \wedge \neg Q.$$
The negation of an "if…then" is **not** another "if…then".`,
      widget: {
        type: 'MathTruthTable',
        props: { vars: ['P', 'Q'], columns: [{ expr: '!(P & Q)' }, { expr: '!P | !Q' }, { expr: '!(P -> Q)' }, { expr: 'P & !Q' }] },
      },
    },
    {
      kind: 'mcq',
      prompt: String.raw`What is the negation of "If it rains, then the ground is wet"?`,
      choices: [
        'If it rains, then the ground is not wet.',
        'If it does not rain, then the ground is not wet.',
        'It rains and the ground is not wet.',
        'It does not rain or the ground is wet.',
      ],
      answer: 2,
      why: String.raw`$\neg(P \Rightarrow Q) \equiv P \wedge \neg Q$: the only way the promise fails is rain *and* a dry ground. The first two options are other implications (both can be true together with the original), and the last is equivalent to the original statement, not its negation.`,
    },
    {
      kind: 'explain',
      title: 'Quantifiers: for all, there exists',
      body: String.raw`An open sentence like $P(x)$: "$x^2 \ge 0$" becomes a statement once we **quantify** $x$ over a **domain** (the set $x$ ranges over):

- $\forall x \in \mathbb{R},\ P(x)$ — "**for all** real $x$, $P(x)$". True here.
- $\exists x \in \mathbb{R},\ x^2 = 2$ — "**there exists** a real $x$ with $x^2 = 2$". True ($x = \sqrt2$). Over the rationals $\mathbb{Q}$ it would be false: the domain matters.

**Order matters.** Over the integers,
$\forall x\ \exists y:\ y > x$ (every integer has a bigger one) is **true**, but
$\exists y\ \forall x:\ y > x$ (one integer beats all of them, itself included) is **false**. In the first, $y$ may depend on $x$; in the second, one $y$ must work for every $x$.`,
    },
    {
      kind: 'widget',
      title: 'Negating quantified statements',
      body: String.raw`Rule: a $\neg$ moving past a quantifier **flips** it.
$$\neg\,\forall x\, P(x) \equiv \exists x\, \neg P(x), \qquad \neg\,\exists x\, P(x) \equiv \forall x\, \neg P(x).$$
"Not every swan is white" = "some swan is not white." Step through a real example from analysis: what it means for a sequence $a_n$ **not** to converge to $L$.`,
      widget: {
        type: 'StepReveal',
        props: {
          steps: [
            String.raw`"$a_n \to L$" means: $\forall \varepsilon > 0\ \exists N\ \forall n \ge N:\ |a_n - L| < \varepsilon$.`,
            String.raw`Negate the whole thing: $\neg\big(\forall \varepsilon > 0\ \exists N\ \forall n \ge N:\ |a_n - L| < \varepsilon\big)$.`,
            String.raw`Push $\neg$ past $\forall\varepsilon$: $\exists \varepsilon > 0\ \neg\big(\exists N\ \forall n \ge N:\ \dots\big)$.`,
            String.raw`Past $\exists N$: $\exists \varepsilon > 0\ \forall N\ \neg\big(\forall n \ge N:\ \dots\big)$.`,
            String.raw`Past $\forall n$, and negate the inequality: $\exists \varepsilon > 0\ \forall N\ \exists n \ge N:\ |a_n - L| \ge \varepsilon$.`,
          ],
          notes: [
            'ε is a tolerance, N a starting index. (Full story in the sequences lesson.)',
            '',
            'Restricted quantifiers flip the same way: the "ε > 0" stays.',
            '',
            'In words: some tolerance is violated infinitely often, however far out you go.',
          ],
        },
      },
    },
    {
      kind: 'fill',
      prompt: String.raw`The negation of $\forall x\ \exists y\ P(x,y)$ is ___ $x$ ___ $y$ $\neg P(x,y)$.`,
      bank: [String.raw`$\exists$`, String.raw`$\forall$`, String.raw`$\neg$`],
      answer: [String.raw`$\exists$`, String.raw`$\forall$`],
      why: String.raw`Each quantifier the negation passes flips: $\neg\forall x\,\exists y\,P \equiv \exists x\,\neg\exists y\,P \equiv \exists x\,\forall y\,\neg P$. Only the innermost sentence gets the $\neg$.`,
    },
    {
      kind: 'multi',
      prompt: String.raw`Which statements are **true**, with every variable ranging over the real numbers $\mathbb{R}$?`,
      choices: [
        String.raw`$\forall x\ \exists y:\ y > x$`,
        String.raw`$\exists y\ \forall x:\ y > x$`,
        String.raw`$\forall x\ \exists y:\ xy = 1$`,
        String.raw`$\exists x\ \forall y:\ xy = 0$`,
        String.raw`$\forall x\ \exists y:\ y^2 = x$`,
      ],
      answers: [0, 3],
      why: String.raw`(1) Take $y = x + 1$. (2) No single real beats every real (try $x = y$). (3) Fails at $x = 0$: no $y$ has $0\cdot y = 1$. (4) True with $x = 0$. (5) Fails for $x = -1$: no real square is negative. A single counterexample kills a "for all".`,
    },
    {
      kind: 'order',
      prompt: String.raw`Negate "$f$ is bounded": $\exists M\ \forall x:\ |f(x)| \le M$. Put the steps in order.`,
      steps: [
        String.raw`$\neg\big(\exists M\ \forall x:\ |f(x)| \le M\big)$`,
        String.raw`$\forall M\ \neg\big(\forall x:\ |f(x)| \le M\big)$`,
        String.raw`$\forall M\ \exists x\ \neg\big(|f(x)| \le M\big)$`,
        String.raw`$\forall M\ \exists x:\ |f(x)| > M$`,
      ],
      why: String.raw`The $\neg$ travels inward one quantifier at a time, flipping $\exists \to \forall$ and $\forall \to \exists$, and finally turns $\le$ into $>$. In words: "whatever bound $M$ you propose, some $x$ beats it" — that is what *unbounded* means.`,
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- A **statement** is true or false. Connectives: $\neg$, $\wedge$, $\vee$ (inclusive), $\Rightarrow$, $\Leftrightarrow$.
- $P \Rightarrow Q$ is false only when $P$ is T and $Q$ is F; it is vacuously true when $P$ is false.
- Contrapositive $\neg Q \Rightarrow \neg P$ is **equivalent** to $P \Rightarrow Q$; the converse is not.
- De Morgan: $\neg(P\wedge Q) \equiv \neg P \vee \neg Q$; and $\neg(P \Rightarrow Q) \equiv P \wedge \neg Q$.
- $\neg\forall \equiv \exists\neg$ and $\neg\exists \equiv \forall\neg$. Quantifier **order** matters.

Next: using this language to build arguments — [what is a proof?](@math/proofs-intro)`,
    },
  ],
  references: [
    { authors: 'D. J. Velleman', title: 'How to Prove It: A Structured Approach', year: 2019, venue: '3rd ed., Cambridge University Press', detail: 'Ch. 1 (sentential logic), Ch. 2 (quantificational logic)' },
    { authors: 'R. Hammack', title: 'Book of Proof', year: 2018, venue: '3rd ed., self-published (free online)', detail: 'Ch. 2 (Logic)', url: 'https://richardhammack.github.io/BookOfProof/' },
    { authors: 'H. B. Enderton', title: 'A Mathematical Introduction to Logic', year: 2001, venue: '2nd ed., Academic Press', detail: 'Ch. 1 (sentential logic)' },
  ],
} satisfies LessonContent;
