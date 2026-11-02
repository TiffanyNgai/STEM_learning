import type { LessonContent } from '../../types';

export default {
  cards: [
    {
      kind: 'explain',
      title: 'Fourier’s outrageous claim',
      body: String.raw`In 1807 Joseph Fourier told the Paris Academy that the temperature profile in a solid could be written as a sum of sines and cosines — *any* profile, even one with corners and jumps. Lagrange objected; Fourier published anyway in *Théorie analytique de la chaleur* (1822).

He was essentially right. A function $f$ that repeats every $2\pi$ (**periodic**: $f(x + 2\pi) = f(x)$) can be built as

$$f(x) \sim \frac{a_0}{2} + \sum_{n=1}^{\infty}\big(a_n\cos nx + b_n\sin nx\big).$$

This is its **Fourier series**. The term with frequency $n$ is the $n$-th **harmonic**: the same idea as the [harmonics of a vibrating string](@physics/superposition-standing-waves). The symbol $\sim$ means "has this series"; *when* the series actually equals $f$ is the subtle part of the story.`,
    },
    {
      kind: 'recall',
      title: 'Functions as vectors',
      points: [
        String.raw`Functions can be added and scaled, so they form a [vector space](@math/abstract-vector-spaces).`,
        String.raw`The inner product $\langle f, g\rangle = \int_{-\pi}^{\pi} f(x)g(x)\,dx$ gives lengths and angles for functions.`,
        String.raw`$f$ and $g$ are **orthogonal** when $\langle f, g\rangle = 0$; e.g. $\int_{-\pi}^{\pi}\sin(mx)\sin(nx)\,dx = 0$ for $m \ne n$.`,
        String.raw`In an orthogonal basis $\{e_n\}$, the coefficient of $e_n$ is the projection $\langle f, e_n\rangle / \langle e_n, e_n\rangle$.`,
      ],
      link: 'math/inner-products-orthogonality',
    },
    {
      kind: 'explain',
      title: 'Coefficients are projections',
      body: String.raw`The functions $1, \cos x, \sin x, \cos 2x, \sin 2x, \dots$ are mutually orthogonal on $[-\pi, \pi]$, and each $\cos nx$ or $\sin nx$ ($n \ge 1$) has squared length $\pi$. So, exactly as for arrows, each coefficient is "how much $f$ points along that harmonic":

$$a_n = \frac{1}{\pi}\int_{-\pi}^{\pi} f(x)\cos nx\,dx,\qquad b_n = \frac{1}{\pi}\int_{-\pi}^{\pi} f(x)\sin nx\,dx.$$

The constant term is $a_0/2$, which is the **average value** of $f$ over a period (the $\tfrac12$ is there because $\langle 1, 1\rangle = 2\pi$, not $\pi$).

Truncating after $N$ harmonics gives the **partial sum** $S_N(x)$. It is the orthogonal projection of $f$ onto the span of the first harmonics, so it is the *best* approximation by such a trigonometric polynomial in the mean-square sense.`,
    },
    {
      kind: 'explain',
      title: 'Worked example: the square wave',
      body: String.raw`Let $f(x) = 1$ for $0 < x < \pi$ and $f(x) = -1$ for $-\pi < x < 0$, repeated with period $2\pi$.

- $f$ is **odd** ($f(-x) = -f(x)$) and $\cos nx$ is even, so $f\cos nx$ is odd and every $a_n = 0$.
- $f\sin nx$ is even, so $b_n = \frac{2}{\pi}\int_0^{\pi}\sin nx\,dx = \frac{2}{n\pi}\big(1 - \cos n\pi\big)$.
- $\cos n\pi = (-1)^n$, so $b_n = \frac{4}{n\pi}$ for odd $n$ and $0$ for even $n$.

$$f(x) = \frac{4}{\pi}\Big(\sin x + \frac{\sin 3x}{3} + \frac{\sin 5x}{5} + \cdots\Big).$$`,
    },
    {
      kind: 'widget',
      title: 'Building a square wave from sines',
      body: String.raw`Raise $N$ to add harmonics. Switch on "newest term" to see the correction each one adds. The blue sum hugs the grey square wave more closely, **except** right next to the jumps, where it overshoots by about 9% of the jump (read the percentage at the bottom). Try the sawtooth too, then the continuous triangle wave, where nothing overshoots.`,
      widget: { type: 'MathFourierPartialSums', props: { wave: 'square', n: 5 } },
    },
    {
      kind: 'mcq',
      prompt: String.raw`For the square wave above, what is the coefficient $b_3$ of $\sin 3x$?`,
      choices: [String.raw`$\dfrac{4}{3\pi} \approx 0.424$`, String.raw`$\dfrac{1}{3}$`, String.raw`$\dfrac{4}{\pi} \approx 1.273$`, String.raw`$0$`],
      answer: 0,
      why: String.raw`$b_n = \frac{2}{n\pi}(1 - (-1)^n)$, and for $n = 3$ this is $\frac{2}{3\pi}\cdot 2 = \frac{4}{3\pi}$. The answer $\tfrac13$ forgets the overall factor $\tfrac4\pi$; $0$ would be right for an even harmonic such as $b_2$.`,
    },
    {
      kind: 'explain',
      title: 'Symmetry saves work',
      body: String.raw`- **Odd** $f$ (like $x$, $x^3$, the square wave): all $a_n = 0$, a pure **sine series**.
- **Even** $f$ (like $|x|$, $x^2$, $\cos x$): all $b_n = 0$, a pure **cosine series**.

Example: the **sawtooth** $f(x) = x$ on $(-\pi, \pi)$ is odd. Integrating by parts, $\int_0^{\pi} x\sin nx\,dx = \frac{\pi(-1)^{n+1}}{n}$, so

$$x = 2\Big(\sin x - \frac{\sin 2x}{2} + \frac{\sin 3x}{3} - \cdots\Big),\qquad -\pi < x < \pi.$$

Its periodic extension jumps from $\pi$ to $-\pi$ at $x = \pm\pi$, so this series has jumps too.`,
    },
    {
      kind: 'multi',
      prompt: String.raw`On $(-\pi, \pi)$, which functions have a Fourier series containing **only sine terms**?`,
      choices: [String.raw`$x^3$`, String.raw`$|x|$`, String.raw`$x\cos x$`, String.raw`$\cos^2 x$`, 'the square wave'],
      answers: [0, 2, 4],
      why: String.raw`Only odd functions give pure sine series. $x^3$ is odd; $x\cos x$ is odd times even, which is odd; the square wave is odd. $|x|$ and $\cos^2 x$ are even, so they give pure cosine series (with a constant term).`,
    },
    {
      kind: 'explain',
      title: 'When does the series converge to f?',
      body: String.raw`Precise answers depend on how smooth $f$ is:

- **Dirichlet's theorem.** If $f$ is piecewise smooth, $S_N(x) \to f(x)$ wherever $f$ is continuous, and at a jump $S_N(x)$ tends to the **midpoint** $\tfrac12[f(x^-) + f(x^+)]$.
- **Mean square.** For any $f$ with $\int|f|^2 < \infty$, $\int_{-\pi}^{\pi}|f - S_N|^2\,dx \to 0$. This is the [Hilbert space](@math/hilbert-spaces) view.
- **Smoothness controls decay.** Jumps give coefficients of size about $1/n$ (square wave); a continuous $f$ with corners gives about $1/n^2$ (triangle wave $|x|$); every extra derivative speeds the decay up further.

So smooth functions need only a few harmonics, and jumps need many.`,
    },
    {
      kind: 'widget',
      title: 'The Gibbs phenomenon',
      body: String.raw`Pick the sawtooth and push $N$ to 80. The wiggles squeeze ever closer to the jump at $x = \pm\pi$, but the tallest one does **not** shrink: as $N \to \infty$ its overshoot tends to about **8.95% of the jump**, the same limit for every jump discontinuity. (The sawtooth creeps up to this limit slowly: about 8.3% at $N = 80$. The square wave is already near 9% for small $N$.) This was noticed by Henry Wilbraham (1848) and explained by J. Willard Gibbs (1899).

So convergence near a jump is *not uniform*: for every $N$ some points near the jump still have an error of at least about 9% of the jump. Away from the jump the error does go to zero.`,
      widget: { type: 'MathFourierPartialSums', props: { wave: 'sawtooth', n: 20 } },
    },
    {
      kind: 'truefalse',
      prompt: String.raw`The partial sums $S_N$ of the square wave converge to it **uniformly** on $[-\pi, \pi]$ (the largest error over the interval tends to 0).`,
      answer: false,
      why: String.raw`The largest error never shrinks. The Gibbs peak stays about $0.18$ above $1$ (9% of the jump size 2), and just beside the jump $S_N$ is still close to $0$ while $f = \pm1$. A quicker argument: a uniform limit of continuous functions is continuous, and the square wave is not.`,
    },
    {
      kind: 'numeric',
      prompt: String.raw`Put $x = \pi/2$ into the square-wave series $1 = \frac{4}{\pi}\big(\sin x + \frac{\sin 3x}{3} + \frac{\sin 5x}{5} + \cdots\big)$. What is $1 - \frac13 + \frac15 - \frac17 + \cdots$? (3 decimal places.)`,
      answer: 0.785,
      tolerance: 0.001,
      why: String.raw`At $x = \pi/2$ we have $\sin(n\pi/2) = 1, -1, 1, \dots$ for $n = 1, 3, 5, \dots$, and $f(\pi/2) = 1$ (a point of continuity). So $1 = \frac4\pi(1 - \frac13 + \frac15 - \cdots)$ and the sum is $\pi/4 \approx 0.785$. This is the Leibniz series.`,
    },
    {
      kind: 'explain',
      title: 'Complex form and Parseval',
      body: String.raw`Using Euler's formula $e^{inx} = \cos nx + i\sin nx$ ([complex numbers](@math/complex-numbers)), the series is neater:

$$f(x) \sim \sum_{n=-\infty}^{\infty} c_n e^{inx},\qquad c_n = \frac{1}{2\pi}\int_{-\pi}^{\pi} f(x)e^{-inx}\,dx.$$

**Parseval's identity** is Pythagoras in infinitely many dimensions. The squared length of $f$ equals the sum of the squares of its coordinates:

$$\frac{1}{2\pi}\int_{-\pi}^{\pi}|f(x)|^2\,dx = \sum_{n}|c_n|^2.$$

Example: for the sawtooth, $c_{\pm n}$ has $|c_{\pm n}| = 1/n$ for $n \ge 1$ and $c_0 = 0$. The left side is $\frac{1}{2\pi}\int_{-\pi}^{\pi}x^2\,dx = \frac{\pi^2}{3}$, so $2\sum_{n\ge1}\frac{1}{n^2} = \frac{\pi^2}{3}$, i.e. $\sum\frac{1}{n^2} = \frac{\pi^2}{6}$.`,
    },
    {
      kind: 'match',
      prompt: 'Match each feature of $f$ with what it means for the Fourier series.',
      pairs: [
        [String.raw`$a_0/2$`, 'the average value of $f$ over one period'],
        ['$f$ is even', 'only cosine terms (and a constant)'],
        ['$f$ has a jump at $x_0$', 'the series converges to the midpoint of the jump at $x_0$'],
        ['$f$ is continuous with corners', 'coefficients shrink roughly like $1/n^2$'],
      ],
      why: String.raw`$a_0/2 = \frac{1}{2\pi}\int f$ is literally the mean. Even functions are orthogonal to every sine. Dirichlet's theorem gives the midpoint at jumps. One fewer derivative of trouble (corners rather than jumps) buys one more power of $n$ in the decay: $1/n^2$ for $|x|$ compared with $1/n$ for the square wave.`,
    },
    {
      kind: 'order',
      prompt: 'Order the steps for finding the Fourier series of a $2\\pi$-periodic $f$.',
      steps: [
        'Check whether $f$ is even, odd or neither, to see which coefficients must vanish.',
        String.raw`Compute the average $a_0/2 = \frac{1}{2\pi}\int_{-\pi}^{\pi} f$.`,
        String.raw`Compute the remaining $a_n$ and $b_n$ by integrating $f$ against $\cos nx$ and $\sin nx$.`,
        'Assemble the series, and note that at any jump it gives the midpoint value.',
      ],
      why: 'Symmetry first, because it can remove half the integrals. Then the coefficients, then the series. The behaviour at jumps is read off at the end from Dirichlet’s theorem.',
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- A $2\pi$-periodic $f$ has Fourier series $\frac{a_0}{2} + \sum(a_n\cos nx + b_n\sin nx)$, or $\sum c_n e^{inx}$.
- The coefficients are **orthogonal projections** onto the harmonics: $a_n = \frac1\pi\int f\cos nx$, $b_n = \frac1\pi\int f\sin nx$.
- Odd gives a sine series and even gives a cosine series. Smoother $f$ means faster-decaying coefficients.
- At jumps the series gives the midpoint, and the partial sums overshoot by about 9% of the jump (**Gibbs**), so convergence there is not uniform.
- Parseval: the energy of $f$ equals the sum of $|c_n|^2$.

Next: non-periodic signals and the [Fourier transform](@math/fourier-transform), and Fourier's own use of these series, the [heat equation](@math/pde-heat-equation).`,
    },
  ],
  references: [
    { authors: 'E. M. Stein, R. Shakarchi', title: 'Fourier Analysis: An Introduction', year: 2003, venue: 'Princeton University Press (Princeton Lectures in Analysis I)', detail: 'Ch. 1–3' },
    { authors: 'W. A. Strauss', title: 'Partial Differential Equations: An Introduction', year: 2008, venue: '2nd ed., Wiley', detail: 'Ch. 5 (Fourier series, completeness, Gibbs phenomenon)' },
    { authors: 'G. B. Folland', title: 'Fourier Analysis and Its Applications', year: 1992, venue: 'Wadsworth & Brooks/Cole (reprinted AMS, 2009)', detail: 'Ch. 2' },
    { authors: 'J. Fourier', title: 'Théorie analytique de la chaleur', year: 1822, venue: 'Firmin Didot, Paris (English transl. A. Freeman, Cambridge University Press, 1878)' },
    { authors: 'J. W. Gibbs', title: 'Fourier’s series', year: 1899, venue: 'Nature 59, 606' },
  ],
} satisfies LessonContent;
