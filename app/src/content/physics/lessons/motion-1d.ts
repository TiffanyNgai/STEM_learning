import type { LessonContent } from '../../types';

const r = String.raw;

export default {
  cards: [
    {
      kind: 'explain',
      title: 'Where is it, and when?',
      body: r`To describe motion along a straight road, pick an **origin** (a zero point) and a **positive direction**. An object's **position** $x$ is then a single signed number: $x = +3$ m means 3 m on the positive side, $x = -2$ m means 2 m on the other side.

Motion is just position changing with **time** $t$, written $x(t)$ ("$x$ as a function of $t$").

The change in position is the **displacement** $\Delta x = x_\text{final} - x_\text{initial}$ (the Greek $\Delta$, "delta", means "change in"). Displacement can be negative; **distance travelled** never is.`,
    },
    {
      kind: 'mcq',
      prompt: 'You walk 5 m forward along a corridor, then 3 m back. What are your displacement and the distance you travelled?',
      choices: ['Displacement 8 m, distance 8 m', 'Displacement 2 m, distance 8 m', 'Displacement 2 m, distance 2 m', 'Displacement −2 m, distance 8 m'],
      answer: 1,
      why: 'Displacement only compares start and end: you finish 2 m ahead of where you began, so +2 m. Distance adds up every step: 5 + 3 = 8 m.',
    },
    {
      kind: 'explain',
      title: 'Velocity',
      body: r`**Average velocity** is displacement divided by the time taken:
$$\bar v = \frac{\Delta x}{\Delta t}\quad(\text{units m/s})$$
The bar over $v$ means "average". Its sign tells you the direction. **Speed** is how fast regardless of direction (always $\ge 0$).

**Example:** a cyclist goes from $x = 100$ m at $t = 10$ s to $x = 40$ m at $t = 25$ s. Then $\bar v = \frac{40 - 100}{25 - 10} = \frac{-60}{15} = -4$ m/s: 4 m/s in the negative direction.

On a graph of $x$ against $t$, $\Delta x / \Delta t$ is the **slope** ("rise over run").`,
    },
    {
      kind: 'widget',
      title: 'Constant velocity: a straight x–t line',
      body: r`The dot moves along the track above; the graphs below show its position and velocity as time runs. Change $v_0$. A steeper $x$–$t$ line means a larger velocity; a downward slope means negative velocity.`,
      widget: {
        type: 'MotionGraphs',
        props: { x: '-4 + v0*t', tMax: 6, show: ['x', 'v'], params: [{ name: 'v0', min: -1.5, max: 1.5, value: 1, label: 'v₀ (m/s)' }], xRange: [-12, 12], vRange: [-2, 2] },
      },
    },
    {
      kind: 'widget',
      title: 'Instantaneous velocity = slope of the tangent',
      body: r`Real objects speed up and slow down, so we want the velocity at **one instant**. Take the average velocity over a tiny interval $\Delta t$ and shrink it towards zero. The "secant" line through two points on the curve turns into the **tangent** line touching it at one point:
$$v = \lim_{\Delta t \to 0}\frac{\Delta x}{\Delta t} = \frac{dx}{dt}$$
This is the *derivative* from calculus. Drag $\Delta t$ (here $h$) towards 0 and watch the green curve's secant (blue) settle onto the tangent at $t = 1$ s.`,
      widget: {
        type: 'FunctionPlot',
        props: {
          fns: ['x^2/4', '0.25 + (2+h)/4*(x-1)'],
          x: [0, 4], y: [-0.5, 4],
          params: [{ name: 'h', min: 0.01, max: 2.5, value: 2, label: 'Δt = h (s)' }],
          labels: ['x(t) = t²/4', 'secant over [1, 1+h]'],
          xLabel: 't (s)', yLabel: 'x (m)',
        },
        caption: r`As $h \to 0$ the slope $(2+h)/4 \to 0.5$ m/s: the instantaneous velocity at $t = 1$ s.`,
      },
    },
    {
      kind: 'numeric',
      prompt: r`A runner is at $x = 2$ m at $t = 1$ s and at $x = 14$ m at $t = 4$ s. What is her average velocity?`,
      answer: 4,
      tolerance: 0.01,
      unit: 'm/s',
      why: r`$\bar v = \frac{14 - 2}{4 - 1} = \frac{12}{3} = 4$ m/s. Dividing 14 m by 4 s (= 3.5) would ignore where and when she started — velocity uses *changes* in position and time.`,
    },
    {
      kind: 'explain',
      title: 'Acceleration',
      body: r`**Acceleration** is how fast velocity changes:
$$a = \frac{\Delta v}{\Delta t}\ \ (\text{average}),\qquad a = \frac{dv}{dt}\ \ (\text{instantaneous})$$
Units: (m/s)/s = **m/s²**. An acceleration of 3 m/s² means the velocity grows by 3 m/s every second.

Careful with signs: an object **speeds up** when $a$ and $v$ have the *same* sign and **slows down** when they have *opposite* signs. A car reversing faster and faster has $v < 0$ and $a < 0$ — negative acceleration, yet speeding up.`,
    },
    {
      kind: 'widget',
      title: 'Linked graphs',
      body: r`Now with acceleration. Notice three things:
- the **slope** of $x(t)$ at each instant equals the value of $v(t)$;
- the **slope** of $v(t)$ equals $a(t)$;
- where $v = 0$ the object turns around, and $x(t)$ has a peak or valley.

Try $v_0 = 2$, $a = -1$.`,
      widget: { type: 'MotionGraphs', props: {} },
    },
    {
      kind: 'truefalse',
      prompt: 'Negative acceleration always means an object is slowing down.',
      answer: false,
      why: 'Slowing down means acceleration points *opposite* to velocity. If the velocity is also negative, a negative acceleration makes the object go faster in the negative direction.',
    },
    {
      kind: 'explain',
      title: 'Going backwards: area under the curve',
      body: r`Slopes take you *down* the chain $x \to v \to a$. To go *up*, use **areas**. If velocity is constant, displacement is $v\,\Delta t$ — the area of a rectangle under the $v$–$t$ graph. This holds in general:

> Displacement = signed area under the $v$–$t$ graph. Change in velocity = signed area under the $a$–$t$ graph.

Area below the axis counts as negative (moving backwards). In calculus language: $\Delta x = \int v\,dt$.`,
    },
    {
      kind: 'match',
      prompt: 'Match each graph feature to what it tells you.',
      pairs: [
        ['Slope of the x–t graph', 'Velocity'],
        ['Slope of the v–t graph', 'Acceleration'],
        ['Area under the v–t graph', 'Displacement'],
        ['Area under the a–t graph', 'Change in velocity'],
      ],
      why: 'Slopes are rates of change (derivatives); areas accumulate (integrals). The two operations undo each other.',
    },
    {
      kind: 'mcq',
      prompt: 'A ball is thrown straight up. At the very top of its flight, which is true? (Take up as positive.)',
      choices: ['v = 0 and a = 0', 'v = 0 and a < 0', 'v > 0 and a = 0', 'v < 0 and a > 0'],
      answer: 1,
      why: 'At the top the ball is momentarily at rest (v = 0), but gravity is still pulling it down, so its velocity is still changing: a = −9.8 m/s². If a were zero there, the ball would stay hovering forever.',
    },
    {
      kind: 'multi',
      prompt: 'Which objects have **zero acceleration**?',
      choices: ['A car at a steady 100 km/h on a straight road', 'A ball at the top of its flight', 'A car rounding a bend at a steady 50 km/h', 'A parked car'],
      answers: [0, 3],
      why: 'Zero acceleration means the velocity — speed **and** direction — is not changing. The ball at the top is still accelerating downward. The car on the bend keeps its speed but its direction changes, so it accelerates (towards the centre of the bend — see circular motion later).',
    },
    {
      kind: 'fill',
      prompt: 'The ___ of an x–t graph gives the velocity; the ___ under a v–t graph gives the displacement.',
      bank: ['slope', 'area', 'intercept', 'height'],
      answer: ['slope', 'area'],
      why: 'Slope = rate of change (rise over run); area = accumulation (velocity × time = distance). The height of an x–t graph is the position itself, not the velocity.',
    },
    {
      kind: 'numeric',
      prompt: 'A car accelerates steadily from rest to 27 m/s (about 100 km/h) in 9.0 s. What is its acceleration?',
      answer: 3,
      tolerance: 0.01,
      unit: 'm/s²',
      why: r`$a = \frac{\Delta v}{\Delta t} = \frac{27 - 0}{9.0} = 3.0$ m/s². Its velocity grows by 3 m/s each second.`,
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: r`- Position $x$ needs an origin and a positive direction; displacement $\Delta x$ is signed, distance is not.
- Velocity $v = dx/dt$ is the slope of $x(t)$; acceleration $a = dv/dt$ is the slope of $v(t)$.
- Speeding up: $a$ and $v$ same sign. Slowing down: opposite signs.
- Areas go the other way: displacement = area under $v(t)$.

Next: what happens when the acceleration is [constant](@physics/constant-acceleration).`,
    },
  ],
  references: [
    { authors: 'Ling, S. J., Sanny, J., Moebs, W. et al.', title: 'University Physics, Volume 1', year: 2016, venue: 'OpenStax', detail: 'Ch. 3 (Motion Along a Straight Line)', url: 'https://openstax.org/details/books/university-physics-volume-1' },
    { authors: 'Feynman, R. P., Leighton, R. B., Sands, M.', title: 'The Feynman Lectures on Physics, Vol. I', year: 1963, venue: 'Addison-Wesley; free online edition', detail: 'Ch. 8 (Motion)', url: 'https://www.feynmanlectures.caltech.edu/I_08.html' },
    { authors: 'Halliday, D., Resnick, R., Walker, J.', title: 'Fundamentals of Physics', year: 2013, venue: '10th ed., Wiley', detail: 'Ch. 2' },
  ],
} satisfies LessonContent;
