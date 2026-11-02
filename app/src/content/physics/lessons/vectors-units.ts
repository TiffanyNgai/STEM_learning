import type { LessonContent } from '../../types';

const r = String.raw;

export default {
  cards: [
    {
      kind: 'explain',
      title: 'A spacecraft lost to units',
      body: r`In 1999 NASA's *Mars Climate Orbiter* flew too deep into the Martian atmosphere and was lost. The cause: one team's software reported thruster impulses in **pound-force seconds**, while the navigation software expected **newton seconds** — a factor of about 4.45.

A number in physics is meaningless without its **unit**. "The distance is 5" could be 5 millimetres or 5 light-years. Physicists always carry units through a calculation, and the units themselves become a powerful error check.`,
    },
    {
      kind: 'explain',
      title: 'The SI system',
      body: r`Science uses the **SI** (International System of Units). Everything is built from seven *base units*; the three you need for mechanics are:

- **metre** (m) — length
- **kilogram** (kg) — mass
- **second** (s) — time

(The others are the ampere, kelvin, mole and candela.) Every other unit is a combination, called a *derived unit*. Speed is metres per second, m/s. Force is the **newton**: $1\ \text{N} = 1\ \text{kg·m/s}^2$.

Prefixes scale units by powers of ten: 1 km = $10^3$ m, 1 mm = $10^{-3}$ m.`,
    },
    {
      kind: 'match',
      prompt: 'Match each SI prefix to its power of ten.',
      pairs: [
        ['mega (M)', '$10^{6}$'],
        ['kilo (k)', '$10^{3}$'],
        ['milli (m)', '$10^{-3}$'],
        ['micro (μ)', '$10^{-6}$'],
        ['nano (n)', '$10^{-9}$'],
      ],
      why: 'Each step of these common prefixes is a factor of 1000. Watch out: lowercase "m" as a prefix means milli, while "M" means mega — a factor of $10^9$ apart.',
    },
    {
      kind: 'explain',
      title: 'Converting units: multiply by one',
      body: r`Because $1\ \text{km} = 1000\ \text{m}$, the fraction $\frac{1000\ \text{m}}{1\ \text{km}}$ equals exactly **1**. Multiplying by 1 never changes a quantity — only how it is written. Units cancel like algebra symbols.

**Example:** a car at 72 km/h, in m/s:
$$72\ \frac{\text{km}}{\text{h}}\times\frac{1000\ \text{m}}{1\ \text{km}}\times\frac{1\ \text{h}}{3600\ \text{s}} = 20\ \frac{\text{m}}{\text{s}}$$

The km cancels with km, the h with h, leaving m/s. Handy shortcut: divide km/h by 3.6 to get m/s.`,
    },
    {
      kind: 'numeric',
      prompt: 'A highway speed limit is 90 km/h. What is it in metres per second?',
      answer: 25,
      tolerance: 0.1,
      unit: 'm/s',
      why: r`$90 \times \frac{1000}{3600} = 90/3.6 = 25$ m/s. A common slip is multiplying by 3.6 instead of dividing. Sanity check: an hour holds 3600 s but a kilometre only 1000 m, so the number of m/s must be smaller than the number of km/h.`,
    },
    {
      kind: 'widget',
      title: 'Dimensional analysis',
      body: r`Every valid equation must have the **same units on both sides** — you can't add metres to seconds. Write $[x]$ for "the units of $x$". This check catches most algebra mistakes, and can even *predict* formulas. Step through how it predicts a pendulum's period.`,
      widget: {
        type: 'StepReveal',
        props: {
          steps: [
            r`A pendulum's period $T$ (time for one swing, in s) could depend on the string length $L$ (m), the mass $m$ (kg) and gravity's strength $g$ (m/s²).`,
            r`Guess $T \propto L^a\, m^b\, g^c$. Units: $\text{s} = \text{m}^a\,\text{kg}^b\,(\text{m}\,\text{s}^{-2})^c = \text{m}^{a+c}\,\text{kg}^b\,\text{s}^{-2c}$.`,
            r`Match powers. kg: $b = 0$ — the period cannot depend on mass! s: $-2c = 1$ so $c = -\tfrac12$. m: $a + c = 0$ so $a = \tfrac12$.`,
            r`Therefore $T \propto \sqrt{L/g}$. The full theory gives $T = 2\pi\sqrt{L/g}$ — units alone found everything except the $2\pi$.`,
          ],
          notes: ['', '', 'Exponents of each base unit must match separately.', 'Dimensional analysis cannot find pure numbers like 2π.'],
        },
      },
    },
    {
      kind: 'mcq',
      prompt: r`Let $x$ be a distance (m), $v$ a speed (m/s), $a$ an acceleration (m/s²) and $t$ a time (s). Which equation is **dimensionally consistent**?`,
      choices: [r`$x = v t^2$`, r`$x = v t + a t^2$`, r`$x = v/t$`, r`$x = a t$`],
      answer: 1,
      why: r`$[vt] = \frac{\text{m}}{\text{s}}\cdot\text{s} = \text{m}$ and $[at^2] = \frac{\text{m}}{\text{s}^2}\cdot\text{s}^2 = \text{m}$, so every term is in metres. The others give m·s, m/s² and m/s — not lengths. (Consistency is necessary but not sufficient: the correct formula has a ½ in front of $at^2$.)`,
    },
    {
      kind: 'explain',
      title: 'Scalars and vectors',
      body: r`"Walk 3 km" doesn't tell you where you'll end up — you also need a **direction**.

- A **scalar** is just a number with a unit: mass, time, temperature, speed.
- A **vector** has a size *and* a direction: displacement, velocity, force.

We draw a vector as an arrow: its length is the **magnitude** and it points in the direction. In print vectors are bold or arrowed, $\vec{A}$, and the magnitude is $|\vec{A}|$ or just $A$.`,
    },
    {
      kind: 'widget',
      title: 'Components: a vector as two numbers',
      body: r`Any arrow in a plane can be built from a horizontal piece and a vertical piece — its **components**. If $\vec A$ has length $A$ and makes angle $\theta$ with the $x$-axis:
$$A_x = A\cos\theta,\qquad A_y = A\sin\theta$$
and back again: $A = \sqrt{A_x^2 + A_y^2}$ (Pythagoras). Drag the sliders; try $\theta = 90°$ and $\theta = 150°$ — components can be zero or negative.`,
      widget: { type: 'VectorComponents', props: { mode: 'components', a: [4, 35], unit: ' m' } },
    },
    {
      kind: 'numeric',
      prompt: r`A displacement of 10 m points $30°$ above the $+x$ axis. What is its $x$-component $A_x$?`,
      answer: 8.66,
      tolerance: 0.02,
      unit: 'm',
      why: r`$A_x = 10\cos 30° = 10 \times 0.866 = 8.66$ m. Using sine instead gives 5 m — that's the $y$-component. Rule: cosine goes with the side *adjacent* to the angle, and here the angle is measured from the $x$-axis.`,
    },
    {
      kind: 'widget',
      title: 'Adding vectors',
      body: r`To add vectors, place them **tip-to-tail**: draw $\vec B$ starting where $\vec A$ ends. The sum $\vec A + \vec B$ runs from the start of $\vec A$ to the tip of $\vec B$.

In components it's even easier — add each component separately:
$$(\vec A + \vec B)_x = A_x + B_x,\qquad (\vec A + \vec B)_y = A_y + B_y$$
Try making $\vec A$ and $\vec B$ point in opposite directions.`,
      widget: { type: 'VectorComponents', props: { mode: 'add', a: [4, 20], b: [3, 110] } },
    },
    {
      kind: 'truefalse',
      prompt: r`For any two vectors, $|\vec A + \vec B| = |\vec A| + |\vec B|$.`,
      answer: false,
      why: r`Only when the vectors point the **same way**. In general $|\vec A + \vec B| \le |\vec A| + |\vec B|$ (the triangle inequality). Opposite vectors of equal size add to zero.`,
    },
    {
      kind: 'multi',
      prompt: 'Which of these quantities are **vectors**?',
      choices: ['Velocity', 'Mass', 'Force', 'Temperature', 'Displacement', 'Speed'],
      answers: [0, 2, 4],
      why: 'Velocity, force and displacement need a direction to be fully specified. Mass, temperature and speed are scalars — speed is the *magnitude* of velocity, with the direction thrown away.',
    },
    {
      kind: 'numeric',
      prompt: 'You walk 3 km east, then 4 km north. How far are you (in a straight line) from where you started?',
      answer: 5,
      tolerance: 0.01,
      unit: 'km',
      why: r`The displacement has components $(3, 4)$ km, so its magnitude is $\sqrt{3^2 + 4^2} = 5$ km. The *distance walked* is 7 km — but displacement only cares about start and end points.`,
    },
    {
      kind: 'order',
      prompt: 'Put the steps for adding several vectors in order.',
      steps: [
        'Choose x and y axes',
        'Resolve each vector into components using cos and sin',
        'Add all the x-components, then all the y-components',
        'Find the magnitude of the sum with Pythagoras',
        'Find its direction with the inverse tangent (checking the quadrant)',
      ],
      why: r`Components turn hard geometry into simple addition. The last step needs care: $\tan^{-1}(R_y/R_x)$ alone can't tell $(1,1)$ from $(-1,-1)$, so check signs of the components.`,
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: r`- Every physical quantity = number × **unit**. SI base units for mechanics: m, kg, s.
- Convert units by multiplying by fractions equal to 1; check equations by comparing units on both sides.
- **Scalars** have size only; **vectors** have size and direction.
- Components: $A_x = A\cos\theta$, $A_y = A\sin\theta$, $A = \sqrt{A_x^2 + A_y^2}$.
- Add vectors tip-to-tail, or simply add their components.

Next: using vectors to describe [motion](@physics/motion-1d).`,
    },
  ],
  references: [
    { authors: 'Ling, S. J., Sanny, J., Moebs, W. et al.', title: 'University Physics, Volume 1', year: 2016, venue: 'OpenStax', detail: 'Ch. 1 (Units and Measurement), Ch. 2 (Vectors)', url: 'https://openstax.org/details/books/university-physics-volume-1' },
    { authors: 'Halliday, D., Resnick, R., Walker, J.', title: 'Fundamentals of Physics', year: 2013, venue: '10th ed., Wiley', detail: 'Ch. 1, 3' },
    { authors: 'Mars Climate Orbiter Mishap Investigation Board', title: 'Phase I Report', year: 1999, venue: 'NASA' },
  ],
} satisfies LessonContent;
