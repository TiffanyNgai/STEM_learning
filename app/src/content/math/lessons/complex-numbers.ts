import type { LessonContent } from '../../types';

export default {
  cards: [
    {
      kind: 'explain',
      title: 'A number whose square is −1',
      body: String.raw`No real number squares to $-1$. So invent one: call it $i$, with
$$i^2 = -1.$$
A **complex number** is $z = a + bi$ with $a, b$ real. $a$ is the **real part** $\operatorname{Re} z$ and $b$ is the **imaginary part** $\operatorname{Im} z$.

Picture $z$ as the point $(a, b)$ in a plane, the **complex plane**: real numbers lie on the horizontal axis and $i$ sits one unit straight up. Addition is ordinary vector addition: $(2 + i) + (1 + 3i) = 3 + 4i$.

Multiplication is where it gets interesting. It turns out to be a *rotation combined with a scaling*. That geometric fact is why complex numbers run through waves, AC circuits and quantum mechanics.`,
    },
    {
      kind: 'explain',
      title: 'Multiplying with algebra',
      body: String.raw`Multiply out brackets as usual and replace $i^2$ by $-1$:
$$(a + bi)(c + di) = (ac - bd) + (ad + bc)\,i.$$

Example: $(2 + i)(1 + 3i) = 2 + 6i + i + 3i^2 = 2 + 7i - 3 = -1 + 7i.$

The **conjugate** of $z = a + bi$ is $\bar z = a - bi$, its mirror image in the real axis. Then
$$z\bar z = a^2 + b^2 = |z|^2,$$
where $|z| = \sqrt{a^2 + b^2}$ is the **modulus**, the distance from $0$. This lets you divide: multiply top and bottom by the conjugate of the bottom,
$$\frac{1}{1 + i} = \frac{1 - i}{(1 + i)(1 - i)} = \frac{1 - i}{2}.$$`,
    },
    {
      kind: 'numeric',
      prompt: String.raw`What is the **real part** of $(3 + 2i)(1 - i)$?`,
      answer: 5,
      why: String.raw`$(3 + 2i)(1 - i) = 3 - 3i + 2i - 2i^2 = 3 - i + 2 = 5 - i$. The common slip is forgetting that $-2i^2 = +2$, which gives $3$ instead of $5$.`,
    },
    {
      kind: 'explain',
      title: 'Polar form: length and angle',
      body: String.raw`Any point of the plane can be described by its distance $r = |z|$ from $0$ and the angle $\theta$ it makes with the positive real axis. That angle is the **argument**, $\arg z$, measured anticlockwise in radians:
$$z = r(\cos\theta + i\sin\theta).$$

Examples: $i$ has $r = 1$, $\theta = \pi/2$. $-2$ has $r = 2$, $\theta = \pi$. $1 + i$ has $r = \sqrt2$, $\theta = \pi/4$.

The argument is only defined up to adding multiples of $2\pi$, because turning a full circle lands in the same place. ($0$ has no argument.)`,
    },
    {
      kind: 'widget',
      title: 'Multiplication = rotate and scale',
      body: String.raw`Multiply the two polar forms and use the angle-addition formulas for $\cos$ and $\sin$. You get the key rule:
$$|zw| = |z|\,|w|,\qquad \arg(zw) = \arg z + \arg w.$$
**Lengths multiply, angles add.** Drag $z$ and $w$. The green spiral carries $z$ to $zw$ by turning it through $\arg w$ and stretching it by $|w|$. The orange triangle $0, 1, w$ and the green triangle $0, z, zw$ are similar: multiplying by $w$ rotates and scales the whole plane, including the faint house.`,
      widget: { type: 'MathComplexMultiply', props: { z: [1.5, 0.5], w: [0.8, 0.9] } },
    },
    {
      kind: 'mcq',
      prompt: String.raw`Geometrically, what does multiplying a complex number by $i$ do?`,
      choices: [
        String.raw`Rotates it by $90^\circ$ anticlockwise about $0$`,
        String.raw`Reflects it in the real axis`,
        String.raw`Rotates it by $90^\circ$ clockwise about $0$`,
        String.raw`Moves it one unit upwards`,
      ],
      answer: 0,
      why: String.raw`$|i| = 1$ and $\arg i = \pi/2$, so multiplying by $i$ keeps lengths and adds $90^\circ$ to the angle: $1 \to i \to -1 \to -i \to 1$. Moving one unit up is *adding* $i$; reflecting in the real axis is conjugation.`,
    },
    {
      kind: 'explain',
      title: 'Euler’s formula',
      body: String.raw`Euler’s formula packs polar form into an exponential:
$$e^{i\theta} = \cos\theta + i\sin\theta.$$

Why believe it? Let $p(\theta) = e^{i\theta}$ be a moving point. Its velocity is $p' = i\,p$: the point itself turned by $90^\circ$. Velocity is always perpendicular to the position and has length $|p|$. Starting at $1$, the point therefore runs round the unit circle at unit speed, so after time $\theta$ it sits at angle $\theta$. That is $\cos\theta + i\sin\theta$. (The power series of $e^x$, $\cos$ and $\sin$ give a formal proof.)

So $z = re^{i\theta}$, and the rule "angles add" is just $e^{i\alpha}e^{i\beta} = e^{i(\alpha + \beta)}$. With $\theta = \pi$: $e^{i\pi} = -1$.`,
    },
    {
      kind: 'truefalse',
      prompt: String.raw`For all nonzero complex numbers $z, w$ with $z + w \ne 0$: $\arg(z + w) = \arg z + \arg w$.`,
      answer: false,
      why: String.raw`Angles add under **multiplication**, not addition. Counterexample: $z = w = 1$ gives $\arg(z + w) = \arg 2 = 0 = \arg z + \arg w$, which works by luck, but $z = 1$, $w = i$ gives $\arg(1 + i) = \pi/4$, while $\arg 1 + \arg i = \pi/2$.`,
    },
    {
      kind: 'widget',
      title: 'Powers and roots of unity',
      body: String.raw`Repeated multiplication repeats the rotation. This is **de Moivre’s formula**:
$$(re^{i\theta})^n = r^n e^{in\theta}.$$
Here $w = e^{i\pi/3}$, so the powers $w, w^2, \dots, w^6$ step round the unit circle in $60^\circ$ steps, and $w^6 = e^{2\pi i} = 1$. The $n$ solutions of $z^n = 1$ are the **$n$-th roots of unity** $e^{2\pi i k/n}$, $k = 0, \dots, n-1$. They form the corners of a regular $n$-gon. Drag $w$ off the circle and the dots spiral in or out.`,
      widget: { type: 'MathComplexMultiply', props: { z: [1, 0], w: [0.5, 0.866], powers: 6, animate: false } },
    },
    {
      kind: 'numeric',
      prompt: String.raw`Compute $(1 + i)^8$. (It is a real number.)`,
      answer: 16,
      why: String.raw`$1 + i = \sqrt2\,e^{i\pi/4}$, so $(1 + i)^8 = (\sqrt2)^8 e^{i\cdot 8\pi/4} = 16\,e^{2\pi i} = 16$. Expanding with the binomial theorem gives the same answer, with much more work.`,
    },
    {
      kind: 'match',
      prompt: 'Match each expression with its value.',
      pairs: [
        [String.raw`$i^2$`, String.raw`$-1$`],
        [String.raw`$i^3$`, String.raw`$-i$`],
        [String.raw`$e^{i\pi/2}$`, String.raw`$i$`],
        [String.raw`$|3 - 4i|$`, String.raw`$5$`],
      ],
      why: String.raw`$i^3 = i^2\cdot i = -i$. $e^{i\pi/2} = \cos(\pi/2) + i\sin(\pi/2) = i$. $|3 - 4i| = \sqrt{9 + 16} = 5$: the modulus ignores the sign of the imaginary part.`,
    },
    {
      kind: 'fill',
      prompt: String.raw`For $z = 1 + i$: $|z| =$ ___, $\arg z =$ ___ and $\bar z =$ ___.`,
      bank: ['√2', '2', 'π/4', 'π/2', '1 − i', '−1 + i'],
      answer: ['√2', 'π/4', '1 − i'],
      why: String.raw`$|1 + i| = \sqrt{1^2 + 1^2} = \sqrt2$ (not $2$, which is $|z|^2 = z\bar z$). The point $(1, 1)$ lies on the diagonal, at $45^\circ = \pi/4$. Conjugation flips the sign of the imaginary part.`,
    },
    {
      kind: 'explain',
      title: 'Where you will meet them',
      body: String.raw`- **Eigenvalues.** A real matrix that rotates has complex eigenvalues, e.g. $\pm i$ for a $90^\circ$ turn ([eigenvalues](@math/eigenvalues)).
- **Oscillations and waves.** Write $\cos\omega t = \operatorname{Re} e^{i\omega t}$. Differentiating then just multiplies by $i\omega$, which is how [Fourier series](@math/fourier-series) and [AC circuit](@physics/ac-circuits) phasors work.
- **Quantum mechanics.** States are built from complex *amplitudes*. Their phases $e^{i\theta}$ create interference ([qubits](@quantum/qubits), [complex amplitudes](@quantum/complex-amplitudes)).

The rest of this unit does *calculus* with complex numbers. It turns out far more rigid, and far more powerful, than real calculus.`,
    },
    {
      kind: 'multi',
      prompt: 'Which of these are equal to 1?',
      choices: [
        String.raw`$i^4$`,
        String.raw`$e^{2\pi i}$`,
        String.raw`$i\cdot(-i)$`,
        String.raw`$e^{i\pi}$`,
        String.raw`$(1 + i)(1 - i)$`,
      ],
      answers: [0, 1, 2],
      why: String.raw`$i^4 = (i^2)^2 = 1$; $e^{2\pi i}$ is a full turn; $i\cdot(-i) = -i^2 = 1$. But $e^{i\pi} = -1$ (half a turn), and $(1 + i)(1 - i) = |1 + i|^2 = 2$.`,
    },
    {
      kind: 'order',
      prompt: String.raw`Order the steps for computing a power such as $(1 - i)^{10}$ quickly.`,
      steps: [
        String.raw`Find the modulus $r$ and argument $\theta$ of the base.`,
        String.raw`Write the base as $re^{i\theta}$.`,
        String.raw`Apply de Moivre: raise $r$ to the power and multiply $\theta$ by it.`,
        String.raw`Reduce the angle modulo $2\pi$ and convert back to $a + bi$.`,
      ],
      why: String.raw`Polar form turns a power into one real power and one multiplication of angles. Here $r = \sqrt2$, $\theta = -\pi/4$, so $(1 - i)^{10} = 32\,e^{-10\pi i/4} = 32\,e^{-i\pi/2} = -32i$.`,
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- $z = a + bi$ is a point of the plane; $i^2 = -1$; $\bar z = a - bi$, $z\bar z = |z|^2$.
- Polar form: $z = re^{i\theta}$ with $r = |z|$ and $\theta = \arg z$ (defined up to multiples of $2\pi$).
- Multiplying by $w$ **rotates by $\arg w$ and scales by $|w|$**: lengths multiply, angles add.
- Euler: $e^{i\theta} = \cos\theta + i\sin\theta$; de Moivre: $(re^{i\theta})^n = r^ne^{in\theta}$.
- The $n$-th roots of unity $e^{2\pi i k/n}$ are the corners of a regular $n$-gon.

Next: [complex functions as maps of the plane](@math/complex-functions).`,
    },
  ],
  references: [
    { authors: 'T. Needham', title: 'Visual Complex Analysis', year: 1997, venue: 'Oxford University Press', detail: 'Ch. 1 (geometry and complex arithmetic; multiplication as rotation and scaling)' },
    { authors: 'E. M. Stein, R. Shakarchi', title: 'Complex Analysis (Princeton Lectures in Analysis II)', year: 2003, venue: 'Princeton University Press', detail: 'Ch. 1 §1 (basic properties of complex numbers)' },
    { authors: 'J. W. Brown, R. V. Churchill', title: 'Complex Variables and Applications', year: 2014, venue: '9th ed., McGraw-Hill', detail: 'Ch. 1 (complex numbers, exponential form, roots)' },
    { authors: 'L. V. Ahlfors', title: 'Complex Analysis', year: 1979, venue: '3rd ed., McGraw-Hill', detail: 'Ch. 1 (the algebra and geometric representation of complex numbers)' },
  ],
} satisfies LessonContent;
