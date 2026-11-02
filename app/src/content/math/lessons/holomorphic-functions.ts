import type { LessonContent } from '../../types';

export default {
  cards: [
    {
      kind: 'explain',
      title: 'Derivatives from every direction',
      body: String.raw`Copy the real definition of the derivative, but let the step $h$ be a small **complex** number:
$$f'(z_0) = \lim_{h \to 0}\frac{f(z_0 + h) - f(z_0)}{h}.$$
The limit must be the same however $h$ approaches $0$: from the right, from above, along a spiral. That is far more demanding than on the real line, where $h$ can only come from two sides.

$f$ is **holomorphic** (also called **analytic**) on an open set $U$ if $f'(z)$ exists at every point of $U$. A function holomorphic on the whole plane is **entire**.`,
    },
    {
      kind: 'recall',
      title: 'From real analysis',
      points: [
        String.raw`$f'(x_0) = \lim_{h\to0}\frac{f(x_0 + h) - f(x_0)}{h}$ means: for each $\varepsilon > 0$ there is a $\delta > 0$ with the quotient within $\varepsilon$ of $f'(x_0)$ whenever $0 < |h| < \delta$.`,
        'Differentiable implies continuous.',
        'Sum, product, quotient and chain rules follow from the definition alone.',
        String.raw`The complex definition is the same, with $|h|$ now the modulus. So all these rules carry over: $(z^n)' = nz^{n-1}$, and polynomials and rational functions are holomorphic wherever defined.`,
      ],
      link: 'math/derivative-rigorous',
    },
    {
      kind: 'explain',
      title: 'A function that fails: conjugation',
      body: String.raw`$f(z) = z^2$ is fine: $\frac{(z + h)^2 - z^2}{h} = 2z + h \to 2z$, whatever the direction.

Now try $f(z) = \bar z$, the reflection in the real axis. The quotient is
$$\frac{\overline{z + h} - \bar z}{h} = \frac{\bar h}{h}.$$
For real $h$ this is $1$. For purely imaginary $h = it$ it is $\frac{-it}{it} = -1$. The two directions disagree, so the limit does not exist anywhere.

Reflection is smooth as a map of $\mathbb R^2$, yet it is **not** complex differentiable. Complex differentiability is a strong extra condition.`,
    },
    {
      kind: 'mcq',
      prompt: String.raw`For $f(z) = |z|^2 = z\bar z$, what is the difference quotient $\frac{f(h) - f(0)}{h}$ at $z_0 = 0$?`,
      choices: [String.raw`$\bar h$, which tends to $0$`, String.raw`$h$, which tends to $0$`, String.raw`$\bar h / h$, which has no limit`, String.raw`$2\bar h$, which tends to $0$`],
      answer: 0,
      why: String.raw`$\frac{|h|^2}{h} = \frac{h\bar h}{h} = \bar h \to 0$. So $|z|^2$ *is* complex differentiable at $0$, with derivative $0$. At any $z_0 \ne 0$ the quotient is $\bar z_0 + z_0\bar h/h + \bar h$, and $\bar h/h$ has no limit. So $|z|^2$ is differentiable only at the single point $0$ and is holomorphic nowhere.`,
    },
    {
      kind: 'widget',
      title: 'The Cauchy–Riemann equations',
      body: String.raw`Write $f = u + iv$. Compare the two simplest directions of approach.`,
      widget: {
        type: 'StepReveal',
        props: {
          steps: [
            String.raw`**Real direction** $h = t \to 0$: $\dfrac{f(z_0 + t) - f(z_0)}{t} \to u_x + i\,v_x$ (partial derivatives in $x$).`,
            String.raw`**Imaginary direction** $h = it$: $\dfrac{f(z_0 + it) - f(z_0)}{it} \to \dfrac{u_y + i\,v_y}{i} = v_y - i\,u_y$.`,
            String.raw`If $f'(z_0)$ exists, both must equal it. Match real and imaginary parts:`,
            String.raw`$$u_x = v_y,\qquad u_y = -v_x.$$ These are the **Cauchy–Riemann equations**, and $f' = u_x + i v_x$.`,
            String.raw`**Converse.** If $u, v$ have *continuous* partial derivatives satisfying Cauchy–Riemann on an open set, then $f$ is holomorphic there.`,
          ],
          notes: [
            '',
            String.raw`Dividing by $i$ is multiplying by $-i$.`,
            '',
            String.raw`Check $z^2$: $u = x^2 - y^2$, $v = 2xy$; $u_x = 2x = v_y$, $u_y = -2y = -v_x$ ✓.`,
            String.raw`For $\bar z$: $u = x$, $v = -y$, so $u_x = 1 \ne -1 = v_y$ ✗.`,
          ],
        },
      },
    },
    {
      kind: 'truefalse',
      prompt: String.raw`$f(x + iy) = x^2 + i\,y^2$ satisfies the Cauchy–Riemann equations on the line $y = x$, so it is holomorphic on that line.`,
      answer: false,
      why: String.raw`Here $u_x = 2x$, $v_y = 2y$, $u_y = v_x = 0$, so Cauchy–Riemann holds exactly on $y = x$, and $f$ is complex differentiable at those points. But *holomorphic* needs differentiability on an **open** set, and a line contains no open disc. So $f$ is holomorphic nowhere.`,
    },
    {
      kind: 'explain',
      title: 'The amplitwist: what f′ means',
      body: String.raw`Near $z_0$, a differentiable $f$ is approximately
$$f(z_0 + h) \approx f(z_0) + f'(z_0)\,h.$$
Multiplying by the complex number $f'(z_0) = Re^{i\varphi}$ **rotates by $\varphi$ and scales by $R$** ([recall](@math/complex-numbers)). So under a holomorphic map, every tiny shape near $z_0$ is turned by the same angle and stretched by the same factor. Needham calls this the **amplitwist**.

Compare a general smooth map of $\mathbb R^2$. Its local linear part is any $2\times2$ matrix, which can shear or squash. Cauchy–Riemann says this matrix has the form $\begin{pmatrix}u_x & -v_x\\ v_x & u_x\end{pmatrix}$, a rotation times a scaling.`,
    },
    {
      kind: 'widget',
      title: 'Local rotate-and-scale, live',
      body: String.raw`The red and purple arrows are the images of a tiny step east and a tiny step north from the marked point. For $e^z$ they stay perpendicular throughout, and the readout gives the common stretch $|F'|$ and turn $\arg F'$. Switch to **shear**, a smooth but non-holomorphic map: the angle changes, and the readout reports that the two directions are stretched by different amounts.`,
      widget: { type: 'MathConformalGrid', props: { fn: 'exp' } },
    },
    {
      kind: 'mcq',
      prompt: String.raw`At a point where $f'(z_0) = 2i$, what does $f$ do to a tiny square centred at $z_0$, roughly?`,
      choices: [
        String.raw`Rotates it $90^\circ$ anticlockwise and doubles its side length`,
        String.raw`Doubles its side length without turning it`,
        String.raw`Squashes it into a rectangle twice as tall as wide`,
        String.raw`Rotates it $180^\circ$ and doubles its side length`,
      ],
      answer: 0,
      why: String.raw`$2i = 2e^{i\pi/2}$: modulus $2$, argument $90^\circ$. A holomorphic map acts locally as a single rotate-and-scale, so it can never turn a square into a non-square rectangle. That would need different stretches in different directions.`,
    },
    {
      kind: 'numeric',
      prompt: String.raw`$f(z) = z^3$. By what factor does $f$ locally stretch lengths at $z_0 = 1 + i$? (That is, find $|f'(z_0)|$.)`,
      answer: 6,
      why: String.raw`$f'(z) = 3z^2$, so $|f'(1 + i)| = 3|1 + i|^2 = 3\cdot 2 = 6$. (Areas are stretched by $|f'|^2 = 36$.)`,
    },
    {
      kind: 'explain',
      title: 'Why holomorphic is so rigid',
      body: String.raw`One derivative in the complex sense buys a remarkable amount (proved in the next lessons with Cauchy’s integral formula):

- **Infinitely differentiable**: $f'$ is holomorphic again, and so are $f''$, $f'''$, ….
- **Power series**: near each point, $f(z) = \sum_n c_n(z - z_0)^n$, converging on the largest disc that fits in the domain.
- **Harmonic parts**: differentiate Cauchy–Riemann once more to get $u_{xx} + u_{yy} = 0$, and the same for $v$. Both are harmonic, which links complex analysis to [Laplace’s equation](@math/laplace-equation).
- **Identity theorem**: on a connected domain, if two holomorphic functions agree on a small disc, they agree everywhere.

None of this holds for real-differentiable functions.`,
    },
    {
      kind: 'multi',
      prompt: String.raw`Which functions are **entire** (holomorphic on all of $\mathbb C$)?`,
      choices: [String.raw`$e^z$`, String.raw`$z^3 - 2z + 7$`, String.raw`$\sin z$`, String.raw`$|z|^2$`, String.raw`$\bar z$`, String.raw`$1/z$`],
      answers: [0, 1, 2],
      why: String.raw`Polynomials, $e^z$ and $\sin z = (e^{iz} - e^{-iz})/2i$ are differentiable everywhere. $|z|^2$ is differentiable only at $0$, $\bar z$ nowhere, and $1/z$ is holomorphic on $\mathbb C\setminus\{0\}$ but not at $0$.`,
    },
    {
      kind: 'match',
      prompt: 'Match each term with its meaning.',
      pairs: [
        ['Cauchy–Riemann equations', String.raw`$u_x = v_y,\ u_y = -v_x$`],
        ['Harmonic function', String.raw`$u_{xx} + u_{yy} = 0$`],
        ['Entire function', String.raw`Holomorphic on all of $\mathbb C$`],
        ['Amplitwist', String.raw`Local rotation by $\arg f'$ and scaling by $|f'|$`],
      ],
      why: String.raw`Cauchy–Riemann is the condition for complex differentiability. Differentiating it again shows $u$ and $v$ are harmonic. The amplitwist is the geometric meaning of $f'(z_0)$ as a single complex multiplier.`,
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- $f'(z_0) = \lim_{h\to0}\frac{f(z_0 + h) - f(z_0)}{h}$ with complex $h$; the limit must not depend on direction.
- Holomorphic = complex differentiable on an open set. $\bar z$ and $|z|^2$ are smooth but not holomorphic.
- Cauchy–Riemann: $u_x = v_y$, $u_y = -v_x$ (with continuous partials, this is also sufficient).
- Geometrically, $f'(z_0)$ is an **amplitwist**: tiny shapes turn by $\arg f'$ and scale by $|f'|$.
- Holomorphic functions are infinitely differentiable, given by power series, and have harmonic real and imaginary parts.

Next: integrating round loops — [Cauchy’s theorem](@math/contour-integrals). Or the geometry of angle preservation — [conformal maps](@math/conformal-maps).`,
    },
  ],
  references: [
    { authors: 'E. M. Stein, R. Shakarchi', title: 'Complex Analysis (Princeton Lectures in Analysis II)', year: 2003, venue: 'Princeton University Press', detail: 'Ch. 1 §2 (holomorphic functions, Cauchy–Riemann equations, power series)' },
    { authors: 'T. Needham', title: 'Visual Complex Analysis', year: 1997, venue: 'Oxford University Press', detail: 'Ch. 4 (differentiation: the amplitwist concept)' },
    { authors: 'L. V. Ahlfors', title: 'Complex Analysis', year: 1979, venue: '3rd ed., McGraw-Hill', detail: 'Ch. 2 §1 (analytic functions, Cauchy–Riemann equations)' },
    { authors: 'J. W. Brown, R. V. Churchill', title: 'Complex Variables and Applications', year: 2014, venue: '9th ed., McGraw-Hill', detail: 'Ch. 2 (derivatives, Cauchy–Riemann equations, analytic and harmonic functions)' },
  ],
} satisfies LessonContent;
