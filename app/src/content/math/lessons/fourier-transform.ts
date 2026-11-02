import type { LessonContent } from '../../types';

export default {
  cards: [
    {
      kind: 'explain',
      title: 'From series to transform',
      body: String.raw`A [Fourier series](@math/fourier-series) breaks a *periodic* signal into the frequencies $n/L$ of a period-$L$ wave. A single drum hit or a light pulse does not repeat. You can think of it as periodic with period $L \to \infty$.

As $L$ grows the allowed frequencies $n/L$ crowd together, and in the limit every real frequency $\xi$ (xi, in cycles per unit of $x$) is allowed. The sum over $n$ becomes an integral over $\xi$.

The coefficient list becomes a function $\hat f(\xi)$, the **Fourier transform**: how much of the frequency $\xi$ the signal contains, and with what phase.`,
    },
    {
      kind: 'explain',
      title: 'Definition and inversion',
      body: String.raw`For a function $f$ on the real line with $\int|f| < \infty$:

$$\hat f(\xi) = \int_{-\infty}^{\infty} f(x)\,e^{-2\pi i x\xi}\,dx,\qquad f(x) = \int_{-\infty}^{\infty} \hat f(\xi)\,e^{2\pi i x\xi}\,d\xi.$$

The second formula, **Fourier inversion**, holds for nice $f$ (for example when $\hat f$ is also integrable). It rebuilds $f$ from waves $e^{2\pi i x\xi}$ weighted by $\hat f(\xi)$.

Example: the box $f = 1$ on $[-\tfrac12, \tfrac12]$ and $0$ elsewhere gives
$$\hat f(\xi) = \int_{-1/2}^{1/2} e^{-2\pi i x\xi}dx = \frac{\sin \pi\xi}{\pi\xi},$$
the **sinc** function. *Conventions vary*: physicists often use $\omega = 2\pi\xi$ and put $\frac{1}{2\pi}$ or $\frac{1}{\sqrt{2\pi}}$ in front. Always check which convention a book uses.`,
    },
    {
      kind: 'widget',
      title: 'Narrow in x, wide in ξ',
      body: String.raw`Blue: a box of width $a$ and height 1. Orange: its transform $\hat f(\xi) = \frac{\sin(\pi a\xi)}{\pi\xi}$ (the horizontal axis is $x$ for the box and $\xi$ for the transform). Shrink $a$: the box narrows while its transform **spreads out** and gets lower. Its first zeros sit at $\xi = \pm 1/a$, and its peak height is $a$, the area of the box.`,
      widget: {
        type: 'FunctionPlot',
        props: {
          fns: ['abs(x) < a/2 ? 1 : 0', 'abs(x) < 1e-9 ? a : sin(PI*a*x)/(PI*x)'],
          x: [-4, 4], y: [-0.6, 2.2],
          params: [{ name: 'a', min: 0.3, max: 2, value: 1, label: 'box width a' }],
          labels: ['box f(x)', 'transform f̂(ξ)'], xLabel: 'x or ξ', yLabel: '',
        },
      },
    },
    {
      kind: 'mcq',
      prompt: String.raw`$f = 1$ on $[-1, 1]$ and $0$ elsewhere. What is $\hat f(0)$?`,
      choices: [String.raw`$2$`, String.raw`$1$`, String.raw`$0$`, String.raw`$\pi$`],
      answer: 0,
      why: String.raw`Putting $\xi = 0$ makes $e^{-2\pi i x\cdot 0} = 1$, so $\hat f(0) = \int f\,dx$, the total area, which is $2$ for a box of width 2 and height 1. Answering $1$ confuses the height with the area.`,
    },
    {
      kind: 'explain',
      title: 'The rules of the game',
      body: String.raw`A few properties do most of the work (each follows from a change of variables or integration by parts):

- **Shift**: $f(x - a)$ has transform $e^{-2\pi i a\xi}\hat f(\xi)$. Moving a signal only changes phases, not the amount of each frequency.
- **Scaling**: $f(x/s)$ has transform $s\,\hat f(s\xi)$ for $s > 0$. Stretching in $x$ squeezes in $\xi$.
- **Derivative**: $f'$ has transform $2\pi i\xi\,\hat f(\xi)$. Differentiation becomes *multiplication*.
- **Gaussian**: $e^{-\pi x^2}$ is its own transform.
- **Plancherel**: $\int|f|^2dx = \int|\hat f|^2d\xi$, so energy is the same in both pictures (the continuous version of [Parseval](@math/fourier-series)).`,
    },
    {
      kind: 'widget',
      title: 'The uncertainty principle',
      body: String.raw`Blue: the Gaussian $f(x) = e^{-\pi(x/s)^2}$. Orange: its transform $s\,e^{-\pi(s\xi)^2}$, from the scaling rule. Make $s$ small (a sharp pulse) and the spectrum becomes broad; make $s$ large and the spectrum becomes a narrow spike. You cannot make both narrow. Quantitatively, Heisenberg's inequality says the product of the two spreads is at least $\frac{1}{4\pi}$ (for $\int|f|^2 = 1$), and Gaussians achieve equality. In [quantum mechanics](@quantum/schrodinger-equation) this is position–momentum uncertainty.`,
      widget: {
        type: 'FunctionPlot',
        props: {
          fns: ['exp(-PI*(x/s)^2)', 's*exp(-PI*(s*x)^2)'],
          x: [-3, 3], y: [-0.2, 2.6],
          params: [{ name: 's', min: 0.4, max: 2.5, value: 1, label: 'width s' }],
          labels: ['f(x)', 'f̂(ξ)'], xLabel: 'x or ξ', yLabel: '',
        },
      },
    },
    {
      kind: 'numeric',
      prompt: String.raw`Let $f(x) = e^{-\pi x^2/9}$. Using $\widehat{e^{-\pi x^2}} = e^{-\pi\xi^2}$ and the scaling rule, find $\hat f(0)$.`,
      answer: 3,
      why: String.raw`$e^{-\pi x^2/9} = e^{-\pi(x/3)^2}$, so $s = 3$ and $\hat f(\xi) = 3e^{-\pi(3\xi)^2}$, giving $\hat f(0) = 3$. Check: $\hat f(0) = \int f$, and widening a Gaussian of area 1 by a factor of 3 triples its area. Answering $1/3$ applies the scaling the wrong way round.`,
    },
    {
      kind: 'match',
      prompt: 'Match each operation on $f(x)$ with what happens to $\\hat f(\\xi)$.',
      pairs: [
        [String.raw`$f(x - a)$`, String.raw`$e^{-2\pi i a\xi}\hat f(\xi)$`],
        [String.raw`$f'(x)$`, String.raw`$2\pi i\xi\,\hat f(\xi)$`],
        [String.raw`$f(x/s)$, $s > 0$`, String.raw`$s\,\hat f(s\xi)$`],
        [String.raw`$(f * g)(x)$`, String.raw`$\hat f(\xi)\,\hat g(\xi)$`],
      ],
      why: String.raw`Shifts become phase factors, derivatives become multiplication by $2\pi i\xi$, stretching by $s$ squeezes the spectrum by $s$ and multiplies it by $s$, and convolution becomes a product (next card).`,
    },
    {
      kind: 'explain',
      title: 'Convolution becomes multiplication',
      body: String.raw`The **convolution** of $f$ and $g$ is a sliding weighted average:
$$(f * g)(x) = \int_{-\infty}^{\infty} f(y)\,g(x - y)\,dy.$$
Blurring a photo, smoothing data with a moving average, and the density of a sum of independent [random variables](@stats/random-variables) are all convolutions.

**Convolution theorem**: $\widehat{f * g} = \hat f\cdot\hat g$. A blur multiplies each frequency by $\hat g(\xi)$. A wide blur kernel has a narrow $\hat g$, which kills high frequencies, and high frequencies carry the fine detail.

This is why the FFT (fast Fourier transform, Cooley–Tukey 1965) makes long convolutions fast: transform, multiply, transform back, in $O(n\log n)$ operations instead of $O(n^2)$. See [FFT in data analysis](@physics/fft-signal-analysis).`,
    },
    {
      kind: 'widget',
      title: 'Why the convolution theorem holds',
      widget: {
        type: 'StepReveal',
        props: {
          steps: [
            String.raw`$\widehat{f*g}(\xi) = \displaystyle\int\!\!\int f(y)\,g(x - y)\,e^{-2\pi i x\xi}\,dy\,dx$`,
            String.raw`Split the exponential: $e^{-2\pi i x\xi} = e^{-2\pi i y\xi}\cdot e^{-2\pi i (x - y)\xi}$.`,
            String.raw`Substitute $z = x - y$ in the inner $x$-integral (for fixed $y$, $dx = dz$).`,
            String.raw`$= \displaystyle\int f(y)e^{-2\pi i y\xi}dy\cdot\int g(z)e^{-2\pi i z\xi}dz = \hat f(\xi)\,\hat g(\xi).$`,
          ],
          notes: [
            'Definition of the transform applied to the convolution.',
            'Exponentials turn sums of exponents into products; this is the whole trick.',
            'Swapping the order of integration is justified when f and g are integrable (Fubini).',
            'The double integral factors into two separate transforms.',
          ],
        },
      },
    },
    {
      kind: 'truefalse',
      prompt: String.raw`There is a nonzero function $f$ that is zero outside some bounded interval **and** whose transform $\hat f$ is also zero outside some bounded interval.`,
      answer: false,
      why: String.raw`If $f$ vanishes outside a bounded interval, $\hat f(\xi)$ extends to an analytic function of complex $\xi$, and such a function cannot vanish on a whole interval unless it is identically zero. So a signal cannot be both time-limited and band-limited. This is another form of the uncertainty principle, which the box and sinc above illustrate.`,
    },
    {
      kind: 'explain',
      title: 'Turning calculus into algebra',
      body: String.raw`Because $\frac{d}{dx}$ becomes multiplication by $2\pi i\xi$, linear differential equations with constant coefficients become **algebraic** equations.

Example: solve $u - u'' = f$ on the whole line (with $u \to 0$ at $\pm\infty$). Transform both sides:
$$\hat u + 4\pi^2\xi^2\,\hat u = \hat f \quad\Longrightarrow\quad \hat u(\xi) = \frac{\hat f(\xi)}{1 + 4\pi^2\xi^2}.$$
Now $\frac{1}{1 + 4\pi^2\xi^2}$ is the transform of $G(x) = \tfrac12 e^{-|x|}$, so by the convolution theorem
$$u = G * f,\qquad u(x) = \frac12\int e^{-|x - y|}f(y)\,dy.$$
$G$ is the response to a point source, a [Green's function](@math/greens-functions). The same trick solves the [heat equation](@math/pde-heat-equation) on the whole line.`,
    },
    {
      kind: 'order',
      prompt: String.raw`Order the steps for solving a constant-coefficient linear ODE $Lu = f$ on $\mathbb{R}$ with the Fourier transform.`,
      steps: [
        String.raw`Transform both sides, replacing each $\frac{d}{dx}$ by $2\pi i\xi$.`,
        String.raw`Solve the algebraic equation: $\hat u(\xi) = \hat f(\xi)/p(\xi)$, where $p$ is the symbol of $L$.`,
        String.raw`Recognise $1/p(\xi)$ as the transform of some kernel $G$.`,
        String.raw`Invert, using the convolution theorem: $u = G * f$.`,
      ],
      why: String.raw`The transform comes first, because it is what turns derivatives into multiplication. Then divide, identify the kernel and convert the product back into a convolution. Dividing by $p(\xi)$ needs $p \ne 0$ on the real line, which holds for $1 + 4\pi^2\xi^2$ but not, for example, for $4\pi^2\xi^2$ (the plain $-u''$, which vanishes at $\xi = 0$).`,
    },
    {
      kind: 'fill',
      prompt: String.raw`Squeezing a signal in $x$ makes its spectrum ___. Convolution in $x$ corresponds to ___ in $\xi$. $\hat f(0)$ equals the ___ of $f$.`,
      bank: ['wider', 'narrower', 'multiplication', 'addition', 'integral (area)', 'maximum'],
      answer: ['wider', 'multiplication', 'integral (area)'],
      why: String.raw`Scaling $f(x/s)$ gives $s\hat f(s\xi)$, so small $s$ (a squeezed signal) gives a spread-out spectrum. The convolution theorem is $\widehat{f*g} = \hat f\hat g$. At $\xi = 0$ the exponential equals 1, leaving $\int f$.`,
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- $\hat f(\xi) = \int f(x)e^{-2\pi i x\xi}dx$ measures how much of frequency $\xi$ is present; inversion rebuilds $f$.
- Shifts become phases, derivatives become multiplication by $2\pi i\xi$, and stretching in $x$ squeezes in $\xi$.
- **Uncertainty**: a signal and its spectrum cannot both be narrow. Gaussians are the best compromise.
- **Convolution theorem**: $\widehat{f*g} = \hat f\,\hat g$. Filters, blurs and Green's functions all rest on it.
- Constant-coefficient linear ODEs and PDEs on all of $\mathbb{R}$ become algebra in $\xi$.

Later this idea powers the [Fourier neural operator](@math/fourier-neural-operator), which learns $\hat G$ directly.`,
    },
  ],
  references: [
    { authors: 'E. M. Stein, R. Shakarchi', title: 'Fourier Analysis: An Introduction', year: 2003, venue: 'Princeton University Press (Princeton Lectures in Analysis I)', detail: 'Ch. 5 (The Fourier transform on ℝ)' },
    { authors: 'G. B. Folland', title: 'Fourier Analysis and Its Applications', year: 1992, venue: 'Wadsworth & Brooks/Cole (reprinted AMS, 2009)', detail: 'Ch. 7' },
    { authors: 'R. Haberman', title: 'Applied Partial Differential Equations with Fourier Series and Boundary Value Problems', year: 2013, venue: '5th ed., Pearson', detail: 'Ch. 10 (Fourier transform solutions of PDEs)' },
    { authors: 'J. W. Cooley, J. W. Tukey', title: 'An algorithm for the machine calculation of complex Fourier series', year: 1965, venue: 'Mathematics of Computation 19, 297–301' },
  ],
} satisfies LessonContent;
