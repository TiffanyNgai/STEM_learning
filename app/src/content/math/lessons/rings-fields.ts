import type { LessonContent } from '../../types';

export default {
  cards: [
    {
      kind: 'explain',
      title: 'Two operations at once',
      body: String.raw`The integers have both $+$ and $\times$, and the two interact through $a(b + c) = ab + ac$. A group only captures one operation. A **ring** $R$ has two:

1. $(R, +)$ is an abelian group, with identity $0$;
2. multiplication is associative and has an identity $1$;
3. the **distributive laws** hold: $a(b+c) = ab + ac$ and $(a+b)c = ac + bc$.

If also $ab = ba$ always, the ring is **commutative**. Examples: $\mathbb{Z}$; $\mathbb{Z}_n$ (remainders mod $n$); polynomials $\mathbb{R}[x]$; and the $2\times2$ real matrices, which form a non-commutative ring.`,
    },
    {
      kind: 'explain',
      title: 'Units, zero divisors and fields',
      body: String.raw`In a ring, division is not guaranteed.

- A **unit** is an element with a multiplicative inverse. In $\mathbb{Z}$ the only units are $\pm 1$.
- A **zero divisor** is an $a \ne 0$ with $ab = 0$ for some $b \ne 0$. In $\mathbb{Z}_6$ we have $2 \cdot 3 = 0$.
- A **field** is a commutative ring with $1 \ne 0$ in which **every non-zero element is a unit**. Examples: $\mathbb{Q}$, $\mathbb{R}$, $\mathbb{C}$. In a field you can add, subtract, multiply, and divide by anything non-zero, which is all of high-school algebra.

A field has no zero divisors: if $ab = 0$ and $a \ne 0$, multiply by $a^{-1}$ to get $b = 0$.`,
    },
    {
      kind: 'widget',
      title: 'Hunting for inverses',
      body: String.raw`This is the multiplication table of $\mathbb{Z}_6$. A non-zero row contains a $1$ (green ring) exactly when that element has an inverse. Rows 2, 3 and 4 have none, and they contain red-ringed zeros: zero divisors. Switch to $\mathbb{Z}_7$: every non-zero row now contains exactly one 1, and no zero appears outside row 0 and column 0. So $\mathbb{Z}_7$ is a field. Try $\mathbb{Z}_4$ and $\mathbb{Z}_5$ as well.`,
      widget: { type: 'MathFiniteFieldTable', props: { ring: 'Z6', op: '×', choices: ['Z4', 'Z5', 'Z6', 'Z7'] } },
    },
    {
      kind: 'mcq',
      prompt: 'Which of these is a field?',
      choices: [String.raw`$\mathbb{Z}_7$`, String.raw`$\mathbb{Z}_8$`, String.raw`$\mathbb{Z}$`, String.raw`The $2\times 2$ real matrices`],
      answer: 0,
      why: String.raw`7 is prime, so every non-zero remainder is invertible. $\mathbb{Z}_8$ has $2\cdot 4 = 0$. In $\mathbb{Z}$, the element $2$ has no inverse. The matrices are not commutative, and non-zero singular matrices have no inverse.`,
    },
    {
      kind: 'explain',
      title: 'When is ℤₙ a field?',
      body: String.raw`**Theorem.** $\mathbb{Z}_n$ is a field $\iff$ $n$ is prime.

- If $n = ab$ with $1 < a, b < n$, then $a\cdot b = 0$ in $\mathbb{Z}_n$, so $a$ is a zero divisor and cannot be a unit.
- If $n = p$ is prime and $p \nmid a$, then $\gcd(a, p) = 1$. The extended Euclidean algorithm (Bézout) gives integers $u, v$ with $ua + vp = 1$. Reading this mod $p$ gives $ua \equiv 1$, so $u$ is the inverse of $a$.

We write $\mathbb{F}_p$ for $\mathbb{Z}_p$ viewed as a field. Example in $\mathbb{F}_7$: $3 \cdot 5 = 15 = 2\cdot 7 + 1$, so $3^{-1} = 5$.`,
    },
    {
      kind: 'numeric',
      prompt: String.raw`In $\mathbb{F}_{11}$, what is the inverse of $4$? (Give the remainder between 0 and 10.)`,
      answer: 3,
      why: String.raw`$4\cdot 3 = 12 = 11 + 1 \equiv 1 \pmod{11}$. You can also try the multiples $4, 8, 12 \equiv 1$. The answer is never $1/4$: in $\mathbb{F}_{11}$ "one quarter" is the remainder 3.`,
    },
    {
      kind: 'explain',
      title: 'Ideals and quotient rings',
      body: String.raw`For rings, the role of [normal subgroups](@math/normal-subgroups-quotients) is played by **ideals**. An ideal $I \subseteq R$ is an additive subgroup that absorbs multiplication: $r \in R,\ a \in I \Rightarrow ra \in I$ (and $ar \in I$). Kernels of ring homomorphisms are ideals, and $R/I$ is again a ring, with operations on cosets $a + I$.

- $n\mathbb{Z}$ is an ideal of $\mathbb{Z}$, and $\mathbb{Z}/n\mathbb{Z} = \mathbb{Z}_n$.
- $\mathbb{R}[x]/(x^2 + 1) \cong \mathbb{C}$. Here $(x^2+1)$ is the ideal of all multiples of $x^2+1$. In the quotient $x^2 + 1 = 0$, so the class of $x$ behaves exactly like $i$.

For a commutative ring, $R/I$ is a field exactly when $I$ is **maximal** (no ideal lies strictly between $I$ and $R$). For a polynomial ring over a field, $(f)$ is maximal exactly when $f$ is irreducible.`,
    },
    {
      kind: 'explain',
      title: 'A field with 4 elements',
      body: String.raw`$\mathbb{Z}_4$ is not a field ($2 \cdot 2 = 0$), but a 4-element field still exists. Take $\mathbb{F}_2 = \{0, 1\}$ and the polynomial $x^2 + x + 1$. It has no root in $\mathbb{F}_2$ (it equals $1$ at both $0$ and $1$), so it is irreducible. Define
$$GF(4) = \mathbb{F}_2[x]/(x^2+x+1) = \{0,\ 1,\ \alpha,\ \alpha+1\},$$
where $\alpha$ is the class of $x$, so that $\alpha^2 = \alpha + 1$ (remember $-1 = +1$ in characteristic 2). Then
$$\alpha(\alpha+1) = \alpha^2 + \alpha = (\alpha+1) + \alpha = 1,$$
so $\alpha$ and $\alpha+1$ are inverses of each other.`,
    },
    {
      kind: 'widget',
      title: 'GF(4) versus ℤ/4',
      body: String.raw`Compare the two 4-element rings. Under $+$, $GF(4)$ has $a + a = 0$ for every $a$, so its additive group is $\mathbb{Z}_2\times\mathbb{Z}_2$, not $\mathbb{Z}_4$. Under $\times$, every non-zero row has a 1. The three non-zero elements form a cyclic group $\{1, \alpha, \alpha^2 = \alpha+1\}$ of order 3. Tap cells to check the products.`,
      widget: { type: 'MathFiniteFieldTable', props: { ring: 'GF4', op: '×', choices: ['Z4', 'GF4'] } },
    },
    {
      kind: 'fill',
      prompt: String.raw`In $GF(4)$, $\alpha^2 = $ ___, $\alpha \cdot (\alpha + 1) = $ ___ and $\alpha + \alpha = $ ___.`,
      bank: [String.raw`$\alpha + 1$`, String.raw`$1$`, String.raw`$0$`, String.raw`$\alpha$`],
      answer: [String.raw`$\alpha + 1$`, String.raw`$1$`, String.raw`$0$`],
      why: String.raw`$\alpha$ is a root of $x^2 + x + 1$, so $\alpha^2 = -\alpha - 1 = \alpha + 1$ since $-1 = 1$ here. Then $\alpha(\alpha+1) = \alpha^2 + \alpha = 2\alpha + 1 = 1$. And $\alpha + \alpha = 2\alpha = 0$, because $1 + 1 = 0$ in characteristic 2.`,
    },
    {
      kind: 'truefalse',
      prompt: String.raw`$\mathbb{Z}_4$ is a field with four elements.`,
      answer: false,
      why: String.raw`$2 \cdot 2 = 4 \equiv 0$, so $2$ is a zero divisor and has no inverse. The field with four elements is $GF(4) = \mathbb{F}_2[x]/(x^2+x+1)$, which is a different ring of the same size.`,
    },
    {
      kind: 'explain',
      title: 'Finite fields are everywhere',
      body: String.raw`**Theorem (Galois, Moore).** A finite field has $p^n$ elements for some prime $p$ and some $n \ge 1$. For every such $p^n$ there is exactly one, up to isomorphism. It is written $\mathbb{F}_{p^n}$ or $GF(p^n)$ and built as $\mathbb{F}_p[x]/(f)$ for an irreducible $f$ of degree $n$. Its non-zero elements always form a cyclic group under $\times$.

Uses:
- **Error-correcting codes:** Reed–Solomon codes over $GF(256)$ protect QR codes, CDs and deep-space links.
- **Cryptography:** the AES cipher works byte-wise in $GF(2^8)$, and elliptic-curve cryptography works over large finite fields.

Fields are also where polynomials live. Asking which equations over $\mathbb{Q}$ can be solved leads to [Galois theory](@math/galois-intro).`,
    },
    {
      kind: 'multi',
      prompt: 'Which numbers are the size of some finite field?',
      choices: ['2', '4', '6', '9', '10', '27'],
      answers: [0, 1, 3, 5],
      why: String.raw`Sizes must be prime powers: $2$, $4 = 2^2$, $9 = 3^2$ and $27 = 3^3$ all work. $6 = 2\cdot 3$ and $10 = 2\cdot 5$ have two different prime factors, so there is no field of that size. (The rings $\mathbb{Z}_6$ and $\mathbb{Z}_{10}$ exist but are not fields.)`,
    },
    {
      kind: 'match',
      prompt: 'Match each ring to the property that best describes it.',
      pairs: [
        [String.raw`$\mathbb{Z}$`, 'No zero divisors, but most elements have no inverse'],
        [String.raw`$\mathbb{Z}_6$`, 'Has zero divisors'],
        [String.raw`$\mathbb{Q}$`, 'Field of characteristic 0'],
        [String.raw`$2\times 2$ real matrices`, 'Non-commutative'],
        [String.raw`$GF(4)$`, 'Field of characteristic 2'],
      ],
      why: String.raw`$\mathbb{Z}$ is an *integral domain* (commutative, no zero divisors) but not a field. $2\cdot 3 = 0$ in $\mathbb{Z}_6$. The **characteristic** is the smallest $m > 0$ with $1 + \dots + 1$ ($m$ times) $= 0$, or $0$ if there is none: $\mathbb{Q}$ has characteristic 0, and $GF(4)$ has $1+1 = 0$. Matrix multiplication does not commute.`,
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- A **ring** has $+$ (an abelian group) and $\times$ (associative, with $1$), linked by distributivity.
- **Field** = commutative ring where every non-zero element is invertible. Fields have no zero divisors.
- $\mathbb{Z}_n$ is a field $\iff n$ is prime. Inverses come from Bézout / the Euclidean algorithm.
- **Ideals** are the ring version of normal subgroups. $R/I$ is a field $\iff I$ is maximal, e.g. $\mathbb{R}[x]/(x^2+1) \cong \mathbb{C}$.
- Finite fields have $p^n$ elements and are unique for each size. $GF(4) = \mathbb{F}_2[\alpha]$ with $\alpha^2 = \alpha + 1$, and it is not $\mathbb{Z}_4$.`,
    },
  ],
  references: [
    { authors: 'D. S. Dummit, R. M. Foote', title: 'Abstract Algebra', year: 2004, venue: '3rd ed., Wiley', detail: 'Ch. 7 (rings, ideals, quotient rings), §14.3 (finite fields)' },
    { authors: 'M. Artin', title: 'Algebra', year: 2011, venue: '2nd ed., Pearson', detail: 'Ch. 11 (rings), Ch. 15 (fields; finite fields)' },
    { authors: 'J. B. Fraleigh', title: 'A First Course in Abstract Algebra', year: 2003, venue: '7th ed., Addison-Wesley', detail: 'Rings and fields; integral domains; finite fields' },
    { authors: 'R. Lidl, H. Niederreiter', title: 'Introduction to Finite Fields and Their Applications', year: 1994, venue: 'Revised ed., Cambridge University Press' },
  ],
} satisfies LessonContent;
