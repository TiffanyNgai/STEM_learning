import type { LessonContent } from '../../types';

const r = String.raw;

const trapezoid = `<svg viewBox="0 0 320 190" width="100%" xmlns="http://www.w3.org/2000/svg" font-size="10" fill="var(--fg)">
  <polygon points="50,150 250,150 250,110 50,110" fill="var(--c2)" opacity="0.35"/>
  <polygon points="50,110 250,110 250,40" fill="var(--c3)" opacity="0.4"/>
  <line x1="50" y1="160" x2="50" y2="15" stroke="var(--fg)"/>
  <line x1="40" y1="150" x2="295" y2="150" stroke="var(--fg)"/>
  <line x1="50" y1="110" x2="250" y2="40" stroke="var(--c1)" stroke-width="2.5"/>
  <line x1="250" y1="150" x2="250" y2="40" stroke="var(--muted)" stroke-dasharray="3 2"/>
  <text x="290" y="165" text-anchor="end">t</text>
  <text x="55" y="22">v</text>
  <text x="44" y="114" text-anchor="end">v₀</text>
  <text x="256" y="44">v = v₀ + at</text>
  <text x="250" y="163" text-anchor="middle">t</text>
  <text x="150" y="135" text-anchor="middle">rectangle: v₀ t</text>
  <text x="200" y="100" text-anchor="middle">triangle: ½ (at) t</text>
  <text x="262" y="80" fill="var(--c3)">↕ at</text>
</svg>`;

export default {
  cards: [
    {
      kind: 'explain',
      title: 'The most useful special case',
      body: r`Drop a stone and it speeds up by about **9.8 m/s every second** — the same amount each second. A car pulling away from traffic lights, a train braking, a sprinter's start: all have roughly **constant acceleration**.

Galileo discovered this in the early 1600s by rolling balls down ramps (slowing the motion down so he could time it). When $a$ is constant, everything about the motion follows from four short equations. They solve a huge fraction of introductory problems.`,
    },
    {
      kind: 'explain',
      title: 'Velocity grows linearly',
      body: r`Let $v_0$ ("v-nought") be the velocity at time $t = 0$. If the acceleration $a$ is constant, the velocity changes by $a$ every second, so after time $t$:
$$v = v_0 + a t$$
On a $v$–$t$ graph this is a **straight line** with intercept $v_0$ and slope $a$.

**Example:** a train moving at 30 m/s brakes at $a = -2$ m/s². After 10 s: $v = 30 + (-2)(10) = 10$ m/s. It stops when $0 = 30 - 2t$, i.e. at $t = 15$ s.`,
    },
    {
      kind: 'widget',
      title: 'Position from the area under v–t',
      body: r`Displacement is the area under the $v$–$t$ graph. Under a straight line that area is a **rectangle** (height $v_0$, width $t$) plus a **triangle** (height $at$, width $t$):
$$\Delta x = v_0 t + \tfrac12 a t^2$$
So the position is $x = x_0 + v_0 t + \tfrac12 a t^2$, where $x_0$ is the starting position. The $t^2$ term is why a falling object covers more distance in each successive second.`,
      widget: { type: 'SvgDiagram', props: { svg: trapezoid } },
    },
    {
      kind: 'numeric',
      prompt: 'A car moving at 10 m/s accelerates at 2.0 m/s² for 5.0 s. What is its final velocity?',
      answer: 20,
      tolerance: 0.01,
      unit: 'm/s',
      why: r`$v = v_0 + at = 10 + 2.0 \times 5.0 = 20$ m/s.`,
    },
    {
      kind: 'numeric',
      prompt: 'Same car (10 m/s, accelerating at 2.0 m/s² for 5.0 s). How far does it travel in those 5.0 s?',
      answer: 75,
      tolerance: 0.1,
      unit: 'm',
      why: r`$\Delta x = v_0 t + \tfrac12 a t^2 = 10(5) + \tfrac12(2)(25) = 50 + 25 = 75$ m. Check with the average velocity: it goes from 10 to 20 m/s, averaging 15 m/s, and $15 \times 5 = 75$ m.`,
    },
    {
      kind: 'widget',
      title: 'Two more equations',
      body: 'Eliminating variables between the first two equations gives two shortcuts. Step through the algebra.',
      widget: {
        type: 'StepReveal',
        props: {
          steps: [
            r`Start: $v = v_0 + at$ (1) and $\Delta x = v_0 t + \tfrac12 a t^2$ (2).`,
            r`Because velocity rises linearly, the average velocity is the midpoint $\tfrac12(v_0 + v)$. Hence $\Delta x = \tfrac12 (v_0 + v)\, t$ (3) — no $a$ needed.`,
            r`From (1), $t = (v - v_0)/a$. Put this into (3): $\Delta x = \tfrac12 (v + v_0)\cdot\frac{v - v_0}{a} = \frac{v^2 - v_0^2}{2a}$.`,
            r`Rearranged: $v^2 = v_0^2 + 2a\,\Delta x$ (4) — relates speeds and distance **without time**.`,
          ],
          notes: ['', 'Only true for constant acceleration!', 'Difference of squares: (v+v₀)(v−v₀) = v² − v₀².', 'Great for braking distances.'],
        },
      },
    },
    {
      kind: 'match',
      prompt: 'Each constant-acceleration equation leaves out one quantity. Match equation to the quantity it does **not** contain.',
      pairs: [
        [r`$v = v_0 + at$`, r`displacement $\Delta x$`],
        [r`$\Delta x = v_0 t + \tfrac12 a t^2$`, r`final velocity $v$`],
        [r`$v^2 = v_0^2 + 2a\Delta x$`, r`time $t$`],
        [r`$\Delta x = \tfrac12 (v_0 + v) t$`, r`acceleration $a$`],
      ],
      why: 'Problem-solving trick: identify the one quantity you neither know nor are asked for, and pick the equation that leaves it out.',
    },
    {
      kind: 'explain',
      title: 'Free fall',
      body: r`Near Earth's surface, ignoring air resistance, every object falls with the same acceleration
$$g \approx 9.8\ \text{m/s}^2$$
directed **downward**, whatever its mass — a hammer and a feather dropped on the Moon (no air) by Apollo 15 astronaut David Scott landed together.

If we take "up" as positive, then $a = -g$. The value of $g$ varies slightly (about 9.78 at the equator to 9.83 at the poles) and is smaller on other worlds: about 1.6 m/s² on the Moon.`,
    },
    {
      kind: 'widget',
      title: 'Throw a ball straight up',
      body: r`Here $x$ is the ball's **height** with up positive: $x = v_0 t - \tfrac12 g t^2$. Velocity falls by 9.8 m/s each second, passing through zero at the top; the acceleration graph is flat at $-9.8$ m/s² the whole time — going up, at the top and coming down.`,
      widget: {
        type: 'MotionGraphs',
        props: { x: 'v0*t - 4.9*t^2', tMax: 3.2, params: [{ name: 'v0', min: 0, max: 16, value: 14, label: 'launch speed (m/s)' }], xRange: [-6, 14], vRange: [-18, 18], aRange: [-12, 2] },
      },
    },
    {
      kind: 'numeric',
      prompt: 'A stone is dropped from rest off a bridge and hits the water 3.0 s later. How high is the bridge? (Use g = 9.8 m/s², ignore air resistance.)',
      answer: 44.1,
      tolerance: 0.3,
      unit: 'm',
      why: r`Starting from rest, $\Delta x = \tfrac12 g t^2 = \tfrac12 (9.8)(3.0)^2 = 44.1$ m. Forgetting to square the time gives 14.7 m — a sign you've confused distance with velocity.`,
    },
    {
      kind: 'numeric',
      prompt: 'A ball is thrown straight up at 14.7 m/s. How high does it rise? (g = 9.8 m/s²)',
      answer: 11.0,
      tolerance: 0.1,
      unit: 'm',
      why: r`At the top $v = 0$. Use the time-free equation: $0 = v_0^2 - 2g\,\Delta x$, so $\Delta x = \frac{v_0^2}{2g} = \frac{14.7^2}{19.6} \approx 11.0$ m.`,
    },
    {
      kind: 'mcq',
      prompt: 'A car braking with constant deceleration stops in 20 m from 50 km/h. From 100 km/h, with the same deceleration, its stopping distance is…',
      choices: ['20 m', '40 m', '80 m', '160 m'],
      answer: 2,
      why: r`From $v^2 = v_0^2 + 2a\Delta x$ with final $v = 0$: $\Delta x = v_0^2 / (2|a|)$, which grows with the **square** of speed. Double the speed → four times the distance: 80 m. This is why speed limits matter so much.`,
    },
    {
      kind: 'truefalse',
      prompt: 'In a vacuum, a heavy bowling ball falls faster than a light tennis ball.',
      answer: false,
      why: 'Without air both have the same acceleration g. A heavier object feels a bigger gravitational force but also has more inertia, and the two effects cancel exactly (a key clue that led to general relativity). In air, drag affects light objects more.',
    },
    {
      kind: 'order',
      prompt: 'Order the steps for solving a constant-acceleration problem.',
      steps: [
        'Sketch the situation and choose a positive direction',
        'List the known quantities (with signs) and the unknown you want',
        'Pick the equation that leaves out the irrelevant quantity',
        'Solve algebraically, then substitute numbers with units',
        'Sanity-check the sign, size and units of the answer',
      ],
      why: 'Choosing directions first prevents sign errors (e.g. g is −9.8 m/s² if up is positive). Solving symbolically before plugging in numbers makes mistakes easier to spot.',
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: r`For constant acceleration $a$, starting from $x_0$ with velocity $v_0$:
$$v = v_0 + at\qquad x = x_0 + v_0 t + \tfrac12 a t^2\qquad v^2 = v_0^2 + 2a\Delta x$$
- They come from the slope and area of a straight-line $v$–$t$ graph.
- Free fall: $a = g \approx 9.8$ m/s² downward, independent of mass (no air).
- Stopping distance grows as speed squared.

Next: combine two of these motions at once — [projectile motion](@physics/projectile-motion).`,
    },
  ],
  references: [
    { authors: 'Ling, S. J., Sanny, J., Moebs, W. et al.', title: 'University Physics, Volume 1', year: 2016, venue: 'OpenStax', detail: 'Ch. 3.4–3.6 (Motion with Constant Acceleration, Free Fall)', url: 'https://openstax.org/details/books/university-physics-volume-1' },
    { authors: 'Halliday, D., Resnick, R., Walker, J.', title: 'Fundamentals of Physics', year: 2013, venue: '10th ed., Wiley', detail: 'Ch. 2.4–2.6' },
    { authors: 'Galilei, G.', title: 'Dialogues Concerning Two New Sciences', year: 1638, venue: 'Third Day (naturally accelerated motion)' },
  ],
} satisfies LessonContent;
