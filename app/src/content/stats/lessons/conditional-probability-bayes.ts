import type { LessonContent } from '../../types';
import { conditionalZoom, testTree } from '../svg';

export default {
  cards: [
    {
      kind: 'mcq',
      prompt: String.raw`A disease affects **1%** of people. A test catches **90%** of sick people, and wrongly flags **5%** of healthy people. You test positive. Roughly how likely is it that you have the disease?`,
      choices: ['About 90%', 'About 50%', 'About 15%', 'About 5%'],
      answer: 2,
      why: 'Only about 15%. Most people guess 90%, confusing "P(positive | sick)" with "P(sick | positive)". Because healthy people vastly outnumber sick ones, the 5% false alarms among the 99% healthy swamp the true positives. This lesson shows exactly how to compute it.',
    },
    {
      kind: 'explain',
      title: 'Conditioning = zooming in',
      body: String.raw`**Conditional probability** answers: *given that $B$ happened, how likely is $A$?* Learning "$B$ happened" rules out every outcome outside $B$, so $B$ becomes the new universe:
$$P(A\mid B) = \frac{P(A\cap B)}{P(B)}\qquad (P(B)>0).$$
Read $P(A\mid B)$ as "probability of A **given** B". Dividing by $P(B)$ rescales so the new universe has total probability 1.

**Example (fair die):** $P(6 \mid \text{even}) = \dfrac{P(\{6\})}{P(\{2,4,6\})} = \dfrac{1/6}{1/2} = \dfrac13.$`,
      widget: { type: 'SvgDiagram', props: { svg: conditionalZoom() }, caption: 'Everything outside B fades: only the part of A inside B still counts.' },
    },
    {
      kind: 'numeric',
      prompt: 'Two fair dice show a **sum of 8**. What is the probability that the **first** die shows 3?',
      answer: 0.2,
      tolerance: 0.001,
      why: 'Zoom in on sum = 8: (2,6), (3,5), (4,4), (5,3), (6,2) — five equally likely outcomes, one of which has first die 3. So 1/5 = 0.2, not the unconditional 1/6.',
    },
    {
      kind: 'explain',
      title: 'Multiplication rule & trees',
      body: String.raw`Rearranging the definition gives the **multiplication rule**:
$$P(A\cap B) = P(B)\,P(A\mid B).$$
This is how probability trees work: multiply along a branch to get the chance of that whole path.

For the disease test, write $D$ = has disease and $+$ = tests positive. Then $P(D\cap +) = P(D)\,P(+\mid D) = 0.01\times 0.9 = 0.009$.

The tree's four leaves cover every possibility, so they add to 1.`,
      widget: { type: 'SvgDiagram', props: { svg: testTree(0.01, 0.9, 0.95) }, caption: 'Multiply along each path. The two "+" leaves (coloured) are all the ways to test positive.' },
    },
    {
      kind: 'explain',
      title: 'Law of total probability',
      body: String.raw`To get the overall chance of testing positive, add up **every path that ends in +**:
$$P(+) = P(+\mid D)P(D) + P(+\mid D^c)P(D^c).$$
In general, if events $B_1,\dots,B_k$ split $\Omega$ into non-overlapping pieces (a **partition**), then
$$P(A) = \sum_{i} P(A\mid B_i)\,P(B_i).$$
For our test: $P(+) = 0.9(0.01) + 0.05(0.99) = 0.009 + 0.0495 = 0.0585.$ About 6% of everyone tests positive — mostly healthy people.`,
    },
    {
      kind: 'widget',
      title: "Deriving Bayes' rule",
      widget: {
        type: 'StepReveal',
        props: {
          steps: [
            String.raw`Write the overlap two ways with the multiplication rule: $P(A\cap B) = P(A\mid B)P(B) = P(B\mid A)P(A)$.`,
            String.raw`Divide by $P(B)$: $\;P(A\mid B) = \dfrac{P(B\mid A)\,P(A)}{P(B)}$. This is **Bayes' rule**.`,
            String.raw`Expand the denominator with total probability: $P(B) = P(B\mid A)P(A) + P(B\mid A^c)P(A^c)$.`,
            String.raw`Disease test: $P(D\mid +) = \dfrac{0.9 \times 0.01}{0.0585} = \dfrac{0.009}{0.0585} \approx 0.154$.`,
          ],
          notes: [
            'Both orders describe the same event "A and B".',
            'It flips the direction of conditioning: from P(B|A) to P(A|B).',
            'Sum over all the ways B can happen.',
            'About 15% — the answer to the opening question.',
          ],
        },
      },
    },
    {
      kind: 'widget',
      title: 'See it with 1000 people',
      body: String.raw`Natural frequencies make Bayes intuitive. Of 1000 people, about 10 are sick (9 test +) and 990 are healthy (about 50 test +). Among ~59 positives, only 9 are truly sick. Drag the sliders: what happens when the disease is common, or the test more specific?`,
      widget: { type: 'BayesBoxes', props: { prevalence: 0.01, sensitivity: 0.9, specificity: 0.95 } },
    },
    {
      kind: 'mcq',
      prompt: 'Keep prevalence 1% and sensitivity 90%, but improve **specificity** from 95% to **99.5%**. About what is $P(D\\mid +)$ now?',
      choices: ['About 15%', 'About 65%', 'About 90%', 'About 99%'],
      answer: 1,
      why: 'False positives drop to 0.99 × 0.005 ≈ 0.005, so P(D|+) = 0.009 / (0.009 + 0.005) ≈ 0.645. When a condition is rare, specificity (fewer false alarms) matters far more than sensitivity.',
      widget: { type: 'BayesBoxes', props: { prevalence: 0.01, sensitivity: 0.9, specificity: 0.995, sliders: false } },
    },
    {
      kind: 'explain',
      title: 'Independence',
      body: String.raw`Events $A$ and $B$ are **independent** if learning one tells you nothing about the other:
$$P(A\mid B) = P(A)\quad\Longleftrightarrow\quad P(A\cap B) = P(A)\,P(B).$$
Two separate coin flips are independent: $P(\text{HH}) = \tfrac12\cdot\tfrac12 = \tfrac14$.

> Don't confuse **independent** with **disjoint**. Disjoint events (with positive probability) are strongly *dependent*: if one happens, the other certainly didn't.

Independence is an assumption about the world (or a design choice, like randomization) — check it, don't assume it.`,
    },
    {
      kind: 'truefalse',
      prompt: 'If $A$ and $B$ are disjoint and both have positive probability, then they are independent.',
      answer: false,
      why: 'Disjoint means P(A ∩ B) = 0, but independence would need P(A ∩ B) = P(A)P(B) > 0. Knowing A happened tells you B definitely did not — that is maximal dependence.',
    },
    {
      kind: 'match',
      prompt: 'In Bayes\' rule for the disease test, match each quantity to its name.',
      pairs: [
        ['$P(D)$', 'prior (prevalence)'],
        ['$P(+\\mid D)$', 'likelihood (sensitivity)'],
        ['$P(D\\mid +)$', 'posterior'],
        ['$P(+)$', 'evidence (overall positive rate)'],
      ],
      why: 'Bayes turns a prior P(D) into a posterior P(D|+) by weighing how likely the evidence is under each hypothesis (the likelihood), normalised by the overall chance of the evidence.',
    },
    {
      kind: 'fill',
      prompt: "Complete Bayes' rule:  P(A | B) = P( ___ | A) · P(A) / P( ___ )",
      bank: ['B', 'B', 'A', 'A ∩ B', 'Ω'],
      answer: ['B', 'B'],
      why: 'P(A|B) = P(B|A)P(A)/P(B). The conditioning flips (B given A on top), and we divide by the probability of what we observed, B.',
    },
    {
      kind: 'multi',
      prompt: 'Which statements are always true (for events with positive probability)?',
      choices: [
        '$P(A\\mid B) = P(B\\mid A)$',
        '$P(A\\mid B) + P(A^c\\mid B) = 1$',
        '$P(A\\mid B) + P(A\\mid B^c) = 1$',
        'If $A, B$ are independent then $P(A\\mid B) = P(A)$',
      ],
      answers: [1, 3],
      why: 'Given B, either A or not-A happens, so those add to 1. Swapping the conditioning, $P(A\\mid B) = P(B\\mid A)$, is the "prosecutor\'s fallacy". $P(A\\mid B) + P(A\\mid B^c) = 1$ mixes two different universes (B and not-B), so there is no reason they sum to 1.',
    },
    {
      kind: 'numeric',
      prompt: 'Machine A makes 60% of a factory\'s parts with a 2% defect rate; machine B makes 40% with a 5% defect rate. A randomly chosen part is defective. What is the probability it came from **B**?',
      answer: 0.625,
      tolerance: 0.002,
      why: 'P(def) = 0.6(0.02) + 0.4(0.05) = 0.012 + 0.020 = 0.032. Then P(B | def) = 0.020 / 0.032 = 0.625. B makes fewer parts but more of the defects.',
    },
    {
      kind: 'order',
      prompt: 'Put the steps of a Bayes calculation in order.',
      steps: [
        'Write down the prior probabilities of each hypothesis',
        'Write down the likelihood of the evidence under each hypothesis',
        'Multiply prior × likelihood for each hypothesis',
        'Add those products to get the probability of the evidence',
        'Divide each product by that total to get the posteriors',
      ],
      why: 'Prior × likelihood gives the joint probability of each path; their sum is P(evidence) (total probability); dividing normalises so the posteriors sum to 1.',
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- $P(A\mid B) = P(A\cap B)/P(B)$: conditioning shrinks the universe to $B$.
- Multiplication rule $P(A\cap B)=P(B)P(A\mid B)$; total probability sums over a partition.
- **Bayes' rule** reverses conditioning: $P(A\mid B) = P(B\mid A)P(A)/P(B)$.
- Base rates matter: a good test for a rare condition still gives mostly false positives.
- **Independent** ($P(A\cap B)=P(A)P(B)$) is not the same as **disjoint**.

Bayes' rule applied to unknown *parameters* becomes a whole approach to statistics: [Bayesian inference](@stats/bayesian-inference).`,
    },
  ],
  references: [
    { authors: 'J. K. Blitzstein, J. Hwang', title: 'Introduction to Probability', year: 2019, venue: '2nd ed., CRC Press', detail: 'Ch. 2 (Conditional probability)' },
    { authors: 'G. Gigerenzer, U. Hoffrage', title: 'How to improve Bayesian reasoning without instruction: frequency formats', year: 1995, venue: 'Psychological Review 102(4), 684–704' },
    { authors: 'B. Illowsky, S. Dean et al.', title: 'Introductory Statistics', year: 2013, venue: 'OpenStax', detail: 'Ch. 3.2–3.5', url: 'https://openstax.org/details/books/introductory-statistics' },
  ],
} satisfies LessonContent;
