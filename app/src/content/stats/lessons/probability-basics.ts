import type { LessonContent } from '../../types';
import { diceGrid, dieVenn } from '../svg';

export default {
  cards: [
    {
      kind: 'explain',
      title: 'Chance, with rules',
      body: String.raw`A forecast says "70% chance of rain". A coin is "50/50". What do these numbers *mean*?

One reading: **long-run frequency** — flip a fair coin many times and the fraction of heads settles near 0.5. Another: **degree of belief** — how strongly the evidence supports "rain tomorrow".

Either way, probabilities follow the *same small set of rules*. Learn the rules once and you can compute with chance. Watch the fraction of heads wobble, then settle:`,
      widget: { type: 'CoinFlipLLN', props: { paths: 1, showBand: false, allowP: false, maxFlips: 1000 }, caption: 'Early on the running fraction swings wildly; with more flips it hugs 0.5.' },
    },
    {
      kind: 'explain',
      title: 'Sample spaces and events',
      body: String.raw`An **experiment** is anything with an uncertain outcome (roll a die, survey a voter).

- The **sample space** $\Omega$ (omega) is the set of *all* possible outcomes. For one die: $\Omega = \{1,2,3,4,5,6\}$.
- An **event** is any collection (subset) of outcomes — a yes/no question about the result. "Even" is the event $A=\{2,4,6\}$; "at least 4" is $B=\{4,5,6\}$.

An event **happens** if the actual outcome lands inside it. Pictures help: draw $\Omega$ as a box and events as regions.`,
      widget: { type: 'SvgDiagram', props: { svg: dieVenn(false) }, caption: 'Each number is one outcome. The roll 4 lies in both A and B.' },
    },
    {
      kind: 'mcq',
      prompt: 'You flip a coin twice and record the sequence (e.g. "HT"). How many outcomes are in the sample space $\\Omega$?',
      choices: ['2', '3', '4', '8'],
      answer: 2,
      why: 'Ω = {HH, HT, TH, TT}. A common slip is answering 3 by lumping HT and TH together as "one of each" — but they are different sequences, and keeping them separate makes all four equally likely.',
    },
    {
      kind: 'explain',
      title: 'The three axioms',
      body: String.raw`Think of probability as **one kilogram of sand spread over $\Omega$**. The probability of an event is how much sand sits on it. That picture gives the three rules (Kolmogorov's axioms):

1. $P(A) \ge 0$ for every event $A$ — no negative sand.
2. $P(\Omega) = 1$ — all the sand is somewhere in $\Omega$.
3. If $A$ and $B$ are **disjoint** (no outcome in common), $P(A \cup B) = P(A) + P(B)$ — sand on separate piles adds up. (The same holds for any countable list of disjoint events.)

Here $A \cup B$ ("A union B") means "A **or** B (or both)".`,
    },
    {
      kind: 'explain',
      title: 'Two rules you will use constantly',
      body: String.raw`From the axioms follow:

- **Complement:** $P(A^c) = 1 - P(A)$, where $A^c$ ("not A") is everything outside $A$.
- **Inclusion–exclusion:** $P(A \cup B) = P(A) + P(B) - P(A \cap B)$, where $A \cap B$ ("A and B") is the overlap. We subtract it because adding $P(A)+P(B)$ counts the overlap twice.

**Worked example** (fair die, $A$ = even, $B=\{4,5,6\}$): $A\cap B=\{4,6\}$, so
$$P(A\cup B) = \tfrac36 + \tfrac36 - \tfrac26 = \tfrac46.$$
Check by counting: $A\cup B=\{2,4,5,6\}$ — four outcomes. ✓`,
      widget: { type: 'SvgDiagram', props: { svg: dieVenn(true) }, caption: 'The pulsing overlap is counted once in P(A) and again in P(B) — so subtract it once.' },
    },
    {
      kind: 'numeric',
      prompt: 'Roll a fair die twice. What is the probability of getting **at least one six**? (Give a decimal.)',
      answer: 11 / 36,
      tolerance: 0.002,
      why: 'Use the complement: "no six" means both rolls avoid 6, probability (5/6)·(5/6) = 25/36. So P(at least one six) = 1 − 25/36 = 11/36 ≈ 0.306. Adding 1/6 + 1/6 = 1/3 is the classic mistake: it double-counts the outcome (6, 6).',
    },
    {
      kind: 'truefalse',
      prompt: 'If $P(A) = 0.6$ and $P(B) = 0.5$, then $A$ and $B$ could be disjoint.',
      answer: false,
      why: 'If they were disjoint, P(A ∪ B) = 0.6 + 0.5 = 1.1, exceeding P(Ω) = 1. So they must overlap — in fact P(A ∩ B) ≥ 0.1.',
    },
    {
      kind: 'explain',
      title: 'Counting equally likely outcomes',
      body: String.raw`When every outcome is **equally likely** (fair die, well-shuffled deck), probability is just counting:
$$P(A) = \frac{\text{number of outcomes in }A}{\text{number of outcomes in }\Omega}.$$

Roll two dice. There are $6\times 6 = 36$ equally likely ordered pairs. The sum is 7 for $(1,6),(2,5),\dots,(6,1)$ — six pairs — so $P(\text{sum}=7)=6/36=1/6$.

> Caution: the 11 possible *sums* (2 to 12) are **not** equally likely. Always count in a space where the outcomes really are equally likely.`,
      widget: { type: 'SvgDiagram', props: { svg: diceGrid(7) }, caption: 'Each cell is one equally likely outcome (first die, second die). Highlighted: sum = 7.' },
    },
    {
      kind: 'mcq',
      prompt: 'Two fair dice are rolled. What is $P(\\text{sum} = 2)$?',
      choices: ['$1/11$', '$1/36$', '$2/36$', '$1/12$'],
      answer: 1,
      why: 'Only the pair (1, 1) gives a sum of 2: one cell out of 36. The answer 1/11 comes from wrongly treating the eleven possible sums as equally likely.',
    },
    {
      kind: 'match',
      prompt: 'Match each piece of notation to its meaning.',
      pairs: [
        ['$A \\cup B$', 'A or B (or both)'],
        ['$A \\cap B$', 'A and B'],
        ['$A^c$', 'not A'],
        ['$\\varnothing$', 'the impossible event (no outcomes)'],
        ['$\\Omega$', 'the certain event (all outcomes)'],
      ],
      why: '∪ (union) collects outcomes in either event; ∩ (intersection) keeps only the shared ones; the complement is everything else in Ω. P(∅) = 0 and P(Ω) = 1.',
    },
    {
      kind: 'multi',
      prompt: 'A sample space has three outcomes $\\{a, b, c\\}$. Which lists $(P(a), P(b), P(c))$ are valid probability assignments?',
      choices: ['$(0.2,\\ 0.3,\\ 0.5)$', '$(0.5,\\ 0.5,\\ 0.5)$', '$(0,\\ 0,\\ 1)$', '$(0.6,\\ 0.6,\\ -0.2)$', '$(1/3,\\ 1/3,\\ 1/3)$'],
      answers: [0, 2, 4],
      why: 'A valid assignment needs every value ≥ 0 and a total of exactly 1. (0.5, 0.5, 0.5) sums to 1.5; (0.6, 0.6, −0.2) sums to 1 but has a negative probability. Zero probabilities are allowed.',
    },
    {
      kind: 'explain',
      title: 'The complement trick: shared birthdays',
      body: String.raw`"At least one" questions are usually easiest via the complement. How likely is it that **some** pair among $n$ people shares a birthday (365 equally likely days, ignoring leap years)?

Complement: *all different*. Person 2 must avoid 1 day, person 3 must avoid 2 days, …:
$$P(\text{all different}) = \frac{364}{365}\cdot\frac{363}{365}\cdots\frac{365-n+1}{365}.$$
So $P(\text{shared}) = 1 - $ that product. Surprisingly, it passes 50% at just $n=23$. The curve below uses the close approximation $1-e^{-n(n-1)/730}$.`,
      widget: {
        type: 'FunctionPlot',
        props: { fns: ['1-exp(-x*(x-1)/730)', '0.5'], x: [0, 70], y: [0, 1], xLabel: 'people n', yLabel: 'P(shared)', labels: ['P(some shared birthday)', '50%'] },
        caption: 'Many pairs (23·22/2 = 253 of them!) give many chances for a match.',
      },
    },
    {
      kind: 'fill',
      prompt: 'Complete the rules: $P(A^c) = $ ___ $- P(A)$, and for **disjoint** events $P(A\\cup B) = P(A)$ ___ $P(B)$.',
      bank: ['1', '0', '+', '×', '−'],
      answer: ['1', '+'],
      why: 'A and its complement split Ω, so their probabilities add to 1. Disjoint events have no overlap to subtract, so their probabilities simply add (multiplication is for independent events, which you will meet next lesson).',
    },
    {
      kind: 'numeric',
      prompt: 'Three people meet. What is the probability that at least two share a birthday (365 equally likely days)? Give a decimal to 4 places.',
      answer: 1 - (364 / 365) * (363 / 365),
      tolerance: 0.0002,
      why: 'P(all different) = (364/365)(363/365) ≈ 0.99180, so P(shared) ≈ 1 − 0.99180 = 0.0082. Small for three people — the probability grows quickly because the number of pairs grows like n².',
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- The **sample space** $\Omega$ lists all outcomes; an **event** is a subset of it.
- Axioms: $P(A)\ge 0$, $P(\Omega)=1$, and probabilities of **disjoint** events add.
- **Complement:** $P(A^c)=1-P(A)$ — the go-to tool for "at least one" questions.
- **Inclusion–exclusion:** $P(A\cup B)=P(A)+P(B)-P(A\cap B)$.
- With **equally likely** outcomes, probability = favourable count ÷ total count — but check the outcomes really are equally likely.

Next: how probabilities change when you learn something — [conditional probability & Bayes](@stats/conditional-probability-bayes).`,
    },
  ],
  references: [
    { authors: 'J. K. Blitzstein, J. Hwang', title: 'Introduction to Probability', year: 2019, venue: '2nd ed., CRC Press', detail: 'Ch. 1 (Probability and counting)' },
    { authors: 'B. Illowsky, S. Dean et al.', title: 'Introductory Statistics', year: 2013, venue: 'OpenStax', detail: 'Ch. 3 (Probability topics)', url: 'https://openstax.org/details/books/introductory-statistics' },
    { authors: 'L. Wasserman', title: 'All of Statistics', year: 2004, venue: 'Springer', detail: 'Ch. 1' },
  ],
} satisfies LessonContent;
