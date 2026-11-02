import type { LessonContent } from '../../types';

const r = String.raw;

// Strobe picture: one ball dropped, one launched horizontally, same height at the same instants.
const strobe = (() => {
  const ts = [0, 0.2, 0.4, 0.6, 0.8, 1];
  const y = (t: number) => 30 + 150 * t * t;
  const ghosts = ts.map((t) => `
    <line x1="34" x2="${60 + 200 * t}" y1="${y(t)}" y2="${y(t)}" stroke="var(--grid)" stroke-dasharray="2 3"/>
    <circle cx="34" cy="${y(t)}" r="4" fill="var(--c2)" opacity="0.35"/>
    <circle cx="${60 + 200 * t}" cy="${y(t)}" r="4" fill="var(--c3)" opacity="0.35"/>`).join('');
  const spline = 'keyTimes="0;0.75;1" calcMode="spline" keySplines="0.33 0 0.67 0.33;0 0 1 1"';
  return `<svg viewBox="0 0 320 200" width="100%" xmlns="http://www.w3.org/2000/svg" font-size="10" fill="var(--fg)">
  <rect x="10" y="34" width="18" height="150" fill="var(--grid)"/>
  <line x1="0" x2="320" y1="184" y2="184" stroke="var(--fg)"/>
  ${ghosts}
  <circle cx="34" cy="30" r="5" fill="var(--c2)">
    <animate attributeName="cy" values="30;180;180" ${spline} dur="2.4s" repeatCount="indefinite"/>
  </circle>
  <circle cx="60" cy="30" r="5" fill="var(--c3)">
    <animate attributeName="cy" values="30;180;180" ${spline} dur="2.4s" repeatCount="indefinite"/>
    <animate attributeName="cx" values="60;260;260" keyTimes="0;0.75;1" dur="2.4s" repeatCount="indefinite"/>
  </circle>
  <text x="40" y="20" fill="var(--c2)">dropped</text>
  <text x="200" y="20" fill="var(--c3)">launched sideways →</text>
  <text x="310" y="150" text-anchor="end" fill="var(--muted)">equal time steps:</text>
  <text x="310" y="162" text-anchor="end" fill="var(--muted)">same heights, even x-spacing</text>
</svg>`;
})();

export default {
  cards: [
    {
      kind: 'widget',
      title: 'A race you might get wrong',
      body: r`One ball is dropped from a ledge; at the same instant another is fired straight out sideways from the same height. Which lands first?

**They land together.** The faded dots show both balls at equal time intervals: at every instant they are at the same height. Moving sideways does nothing to how fast you fall.`,
      widget: { type: 'SvgDiagram', props: { svg: strobe } },
    },
    {
      kind: 'explain',
      title: 'Two independent motions',
      body: r`A **projectile** is anything thrown and then left to gravity (we ignore air resistance). The key insight: treat horizontal ($x$) and vertical ($y$) motion **separately**, linked only by the shared time $t$.

- Horizontal: no force, so $a_x = 0$ — constant velocity: $x = v_{0x}\,t$.
- Vertical: free fall, $a_y = -g$: $y = v_{0y}\,t - \tfrac12 g t^2$, and $v_y = v_{0y} - g t$.

Launched at speed $v_0$ and angle $\theta$ above the horizontal, the starting components are
$$v_{0x} = v_0\cos\theta,\qquad v_{0y} = v_0\sin\theta$$`,
    },
    {
      kind: 'truefalse',
      prompt: 'A bullet fired horizontally and a bullet dropped from the same height at the same moment hit level ground at the same time (no air resistance).',
      answer: true,
      why: 'The vertical motion of both starts with zero vertical velocity and has acceleration g, so their heights match at every moment. The fired bullet just travels much further horizontally during that time.',
    },
    {
      kind: 'widget',
      title: 'Watch the components',
      body: r`The green arrow is the velocity; blue and orange are its $x$ and $y$ components. The **horizontal component never changes**. The vertical component shrinks by 9.8 m/s each second, is zero at the peak, then grows downward. The path is a **parabola**.`,
      widget: { type: 'ProjectileSim', props: { speed: 20, angle: 55 } },
    },
    {
      kind: 'mcq',
      prompt: r`At the highest point of a projectile's path, its velocity is…`,
      choices: ['zero', r`horizontal, with magnitude $v_0\cos\theta$`, r`vertical, with magnitude $v_0\sin\theta$`, r`equal to $v_0$`],
      answer: 1,
      why: r`Only the vertical component vanishes at the top. The horizontal component $v_0\cos\theta$ is unchanged throughout the flight, so the projectile is moving horizontally at that speed. (It is zero only for a straight-up throw, $\theta = 90°$.)`,
    },
    {
      kind: 'widget',
      title: 'Flight time, height and range',
      body: 'For launch and landing at the same height, three formulas follow directly. Step through them.',
      widget: {
        type: 'StepReveal',
        props: {
          steps: [
            r`**Time of flight.** Land when $y = 0$: $v_0\sin\theta\,t - \tfrac12 g t^2 = 0$, so (besides $t = 0$) $T = \dfrac{2 v_0 \sin\theta}{g}$.`,
            r`**Peak height.** At the top $v_y = 0$; from $v_y^2 = v_{0y}^2 - 2g\,y$: $H = \dfrac{v_0^2\sin^2\theta}{2g}$.`,
            r`**Range.** Horizontal distance in time $T$: $R = v_0\cos\theta \cdot \dfrac{2 v_0\sin\theta}{g} = \dfrac{v_0^2 \cdot 2\sin\theta\cos\theta}{g}$.`,
            r`Using the identity $2\sin\theta\cos\theta = \sin 2\theta$: $\;R = \dfrac{v_0^2 \sin 2\theta}{g}$.`,
          ],
          notes: ['The ball takes as long to go up as to come down.', '', '', r`Largest when $\sin 2\theta = 1$, i.e. $\theta = 45°$.`],
        },
      },
    },
    {
      kind: 'numeric',
      prompt: r`A ball is kicked at 20 m/s at $30°$ above level ground. What is its range? (g = 9.8 m/s², no air.)`,
      answer: 35.3,
      tolerance: 0.3,
      unit: 'm',
      why: r`$R = \frac{v_0^2 \sin 2\theta}{g} = \frac{400 \times \sin 60°}{9.8} = \frac{400 \times 0.866}{9.8} \approx 35.3$ m. Using $\sin 30°$ instead of $\sin 60°$ (forgetting the 2θ) gives 20.4 m.`,
    },
    {
      kind: 'numeric',
      prompt: r`Same kick (20 m/s at $30°$). How long is the ball in the air?`,
      answer: 2.04,
      tolerance: 0.03,
      unit: 's',
      why: r`$T = \frac{2 v_0\sin\theta}{g} = \frac{2 \times 20 \times 0.5}{9.8} \approx 2.04$ s. Only the vertical component, $v_0\sin\theta = 10$ m/s, matters for the flight time.`,
    },
    {
      kind: 'widget',
      title: 'Complementary angles',
      body: r`Set an angle, press **Keep path**, then try other angles at the same speed. $45°$ gives the longest range. Angles that add to $90°$ (say $30°$ and $60°$) land at the **same spot** — because $\sin 2\theta = \sin(180° - 2\theta)$ — but the steeper one flies higher and longer.`,
      widget: { type: 'ProjectileSim', props: { speed: 22, angle: 30, showComponents: false } },
    },
    {
      kind: 'multi',
      prompt: 'At the same launch speed over level ground (no air), which pairs of launch angles give the **same range**?',
      choices: ['15° and 75°', '30° and 60°', '20° and 80°', '40° and 50°', '45° and 55°'],
      answers: [0, 1, 3],
      why: r`Range depends on $\sin 2\theta$, and $\sin 2\theta = \sin(180° - 2\theta)$, so $\theta$ and $90° - \theta$ give equal ranges. 20°+80° and 45°+55° don't add to 90°.`,
    },
    {
      kind: 'explain',
      title: 'Worked example: off a cliff',
      body: r`A ball rolls off a 20 m high cliff at 15 m/s horizontally. Where does it land?

1. Vertical first (initial $v_y = 0$): $20 = \tfrac12 (9.8) t^2 \Rightarrow t = \sqrt{40/9.8} \approx 2.02$ s.
2. Horizontal: $x = 15 \times 2.02 \approx 30.3$ m from the base of the cliff.

The vertical motion sets the **time**; the horizontal motion uses that time to give the **distance**. The range formula $R = v_0^2\sin2\theta/g$ does *not* apply here, because launch and landing heights differ.`,
    },
    {
      kind: 'numeric',
      prompt: 'A marble rolls off a 1.25 m high table at 2.0 m/s. How far from the foot of the table does it land? (g = 9.8 m/s²)',
      answer: 1.01,
      tolerance: 0.03,
      unit: 'm',
      why: r`Fall time: $t = \sqrt{2h/g} = \sqrt{2.5/9.8} \approx 0.505$ s. Horizontal distance: $2.0 \times 0.505 \approx 1.01$ m.`,
    },
    {
      kind: 'fill',
      prompt: 'Without air resistance, a projectile\'s horizontal velocity ___ during flight, while its vertical velocity changes by ___ every second.',
      bank: ['stays constant', 'decreases', '9.8 m/s', '9.8 m', 'increases'],
      answer: ['stays constant', '9.8 m/s'],
      why: 'No horizontal force → no horizontal acceleration. Vertical acceleration is 9.8 m/s², meaning the vertical velocity changes by 9.8 m/s (a velocity, not a distance) each second.',
    },
    {
      kind: 'match',
      prompt: r`Match each quantity (level ground, launch speed $v_0$, angle $\theta$) to its formula.`,
      pairs: [
        ['Horizontal velocity', r`$v_0\cos\theta$`],
        ['Time of flight', r`$2v_0\sin\theta/g$`],
        ['Maximum height', r`$v_0^2\sin^2\theta/2g$`],
        ['Range', r`$v_0^2\sin 2\theta/g$`],
      ],
      why: r`All four come from splitting into components: constant $v_x$, and free fall vertically with initial speed $v_0\sin\theta$.`,
    },
    {
      kind: 'mcq',
      prompt: 'In real air, how does drag change things for a fast golf or cannon ball?',
      choices: ['No change; drag only affects light objects', 'Range is shorter and the best angle is less than 45°', 'Range is longer and the best angle is more than 45°', 'The path becomes a perfect circle'],
      answer: 1,
      why: 'Drag steadily removes speed, shortening the range and making the descent steeper than the ascent (the path is no longer a symmetric parabola). Because the time aloft is costly, the optimum is usually below 45°. (Golf balls are a special case: backspin adds lift.)',
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: r`- Split projectile motion into **independent** horizontal (constant velocity) and vertical (free fall) parts sharing the same time.
- Initial components: $v_0\cos\theta$ and $v_0\sin\theta$.
- The path is a parabola. On level ground: $T = 2v_0\sin\theta/g$, $H = v_0^2\sin^2\theta/2g$, $R = v_0^2\sin2\theta/g$; max range at 45°.
- Vertical motion sets the time; horizontal motion turns time into distance.

Coming up: why things accelerate at all — [Newton's laws](@physics/newtons-laws).`,
    },
  ],
  references: [
    { authors: 'Ling, S. J., Sanny, J., Moebs, W. et al.', title: 'University Physics, Volume 1', year: 2016, venue: 'OpenStax', detail: 'Ch. 4.3 (Projectile Motion)', url: 'https://openstax.org/details/books/university-physics-volume-1' },
    { authors: 'Halliday, D., Resnick, R., Walker, J.', title: 'Fundamentals of Physics', year: 2013, venue: '10th ed., Wiley', detail: 'Ch. 4.4 (Projectile Motion)' },
    { authors: 'Taylor, J. R.', title: 'Classical Mechanics', year: 2005, venue: 'University Science Books', detail: 'Ch. 2 (projectiles and air resistance)' },
  ],
} satisfies LessonContent;
