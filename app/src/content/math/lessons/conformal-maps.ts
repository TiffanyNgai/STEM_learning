import type { LessonContent } from '../../types';

// Uniform flow past a cylinder: streamlines Im(z + 1/z) = c outside |z| = 1.
const streamPaths = (() => {
  const out: string[] = [];
  const sx = (x: number) => 160 + 48 * x, sy = (y: number) => 95 - 48 * y;
  for (const c of [-1.6, -1.1, -0.7, -0.35, -0.08, 0.08, 0.35, 0.7, 1.1, 1.6]) {
    // solve y − y/(x²+y²) = c for y on each x, by bisection on the correct side
    let d = '';
    let pen = false;
    for (let i = 0; i <= 120; i++) {
      const x = -3.2 + (6.4 * i) / 120;
      let lo = c > 0 ? 0 : -4, hi = c > 0 ? 4 : 0;
      const g = (y: number) => y - y / (x * x + y * y) - c;
      // streamline lies where |z| > 1; pick the root farther from the axis
      if (c > 0) lo = Math.max(lo, Math.sqrt(Math.max(0, 1 - x * x)) + 1e-6); else hi = Math.min(hi, -Math.sqrt(Math.max(0, 1 - x * x)) - 1e-6);
      if (g(lo) * g(hi) > 0) { pen = false; continue; }
      for (let k = 0; k < 50; k++) { const m = (lo + hi) / 2; if (g(lo) * g(m) <= 0) hi = m; else lo = m; }
      const y = (lo + hi) / 2;
      d += `${pen ? 'L' : 'M'}${sx(x).toFixed(1)},${sy(y).toFixed(1)}`; pen = true;
    }
    out.push(d);
  }
  return out;
})();
const flowSvg = `<svg viewBox="0 0 320 190" xmlns="http://www.w3.org/2000/svg" font-family="inherit">
  ${streamPaths.map((d) => `<path d="${d}" fill="none" stroke="var(--c2)" stroke-width="1.2" stroke-dasharray="6 6"><animate attributeName="stroke-dashoffset" from="12" to="0" dur="1s" repeatCount="indefinite"/></path>`).join('')}
  <circle cx="160" cy="95" r="48" fill="var(--c3)" fill-opacity="0.25" stroke="var(--c3)" stroke-width="1.5"/>
  <text x="160" y="99" font-size="10" text-anchor="middle" fill="var(--fg)">|z| = 1</text>
  <text x="8" y="184" font-size="10" fill="var(--muted)">streamlines Im(z + 1/z) = const</text>
</svg>`;

export default {
  cards: [
    {
      kind: 'explain',
      title: 'Maps that preserve angles',
      body: String.raw`A map is **conformal** at a point if it preserves the angle between any two curves crossing there, both its size and its sense (anticlockwise stays anticlockwise).

From [holomorphic functions](@math/holomorphic-functions): if $f'(z_0) \ne 0$, then near $z_0$ the map $f$ acts as multiplication by $f'(z_0)$, a rotation plus a uniform scaling. Every direction is turned by the same angle $\arg f'(z_0)$, so the angles between directions are unchanged. Hence

> **holomorphic with $f' \ne 0$ ⇒ conformal.**

Conversely, a smooth map of a plane region that preserves angles and orientation is holomorphic with $f' \ne 0$. Tiny squares map to tiny squares, but big shapes can bend a lot.`,
    },
    {
      kind: 'widget',
      title: 'Grids bend, right angles survive',
      body: String.raw`Under $e^z$, vertical lines become circles and horizontal lines become rays. Circles and rays cross at right angles, as the readout confirms. Try $1/z$ and the Möbius map too. Then try **shear**, which is not holomorphic, and watch the angle drift away from $90^\circ$. For $z^2$, press **critical point**: at $z_0 = 0$, $f'(0) = 0$ and the right angle between the axes opens to $180^\circ$.`,
      widget: { type: 'MathConformalGrid', props: { fn: 'exp' } },
    },
    {
      kind: 'mcq',
      prompt: String.raw`$f(z) = z^2$ at $z_0 = 0$. Two curves leave $0$ at an angle $\alpha$. At what angle do their images leave $0$?`,
      choices: [String.raw`$2\alpha$`, String.raw`$\alpha$`, String.raw`$\alpha/2$`, String.raw`$\alpha^2$`],
      answer: 0,
      why: String.raw`$z^2$ doubles arguments: a ray at angle $\theta$ goes to the ray at angle $2\theta$, so angles between rays double. This is the failure of conformality at a critical point, where $f'(z_0) = 0$. Near a zero of $f'$ of order $k - 1$, $f$ behaves like $z^k$ and angles are multiplied by $k$.`,
    },
    {
      kind: 'explain',
      title: 'Möbius transformations',
      body: String.raw`The most important conformal maps are the **Möbius** (fractional linear) transformations
$$T(z) = \frac{az + b}{cz + d},\qquad ad - bc \ne 0.$$
Facts:

- Each is built from **translations**, **rotation-and-scalings** $z \mapsto kz$ and the **inversion** $z \mapsto 1/z$.
- They send **circles and lines to circles and lines**. A line counts as a circle through $\infty$.
- With the point $\infty$ added (the Riemann sphere), each is a bijection. Its inverse is again Möbius, and so is the composition of two.
- A Möbius map is fixed by where it sends **three** points.`,
    },
    {
      kind: 'widget',
      title: 'The Cayley map: half-plane to disc',
      body: String.raw`$C(z) = \dfrac{z - i}{z + i}$ measures the distance to $i$ relative to the distance to $-i$. For $z$ in the upper half-plane it is closer to $i$, so $|C(z)| < 1$. The real axis (equal distances) goes to the unit circle, and $C(i) = 0$. Watch the grid of the upper half-plane fold into the unit disc. Horizontal lines become circles and vertical lines become arcs, still crossing at right angles.`,
      widget: { type: 'MathConformalGrid', props: { fn: 'mobius' } },
    },
    {
      kind: 'numeric',
      prompt: String.raw`For the Cayley map $C(z) = \dfrac{z - i}{z + i}$, compute $|C(2i)|$.`,
      answer: 1 / 3,
      tolerance: 0.001,
      why: String.raw`$C(2i) = \frac{2i - i}{2i + i} = \frac{i}{3i} = \frac13$. Points higher above the real axis land closer to the centre of the disc; $C(i) = 0$.`,
    },
    {
      kind: 'truefalse',
      prompt: 'Every Möbius transformation sends every circle in the plane to a circle.',
      answer: false,
      why: String.raw`A circle passing through the pole $z = -d/c$ (where $T = \infty$) is sent to a **line**. Example: $1/z$ sends the circle $|z - 1| = 1$, which passes through $0$, to the vertical line $\operatorname{Re} w = \tfrac12$. The precise statement is "circles-or-lines go to circles-or-lines".`,
    },
    {
      kind: 'order',
      prompt: String.raw`For $c \ne 0$, $T(z) = \frac{az + b}{cz + d} = \frac{a}{c} + \frac{bc - ad}{c^2}\cdot\frac{1}{z + d/c}$. Order the simple maps that build $T$.`,
      steps: [
        String.raw`Translate: $z \mapsto z + d/c$.`,
        String.raw`Invert: $z \mapsto 1/z$.`,
        String.raw`Rotate and scale: $z \mapsto \frac{bc - ad}{c^2}\,z$.`,
        String.raw`Translate: $z \mapsto z + a/c$.`,
      ],
      why: String.raw`Read the formula from the inside out. Each step sends circles-or-lines to circles-or-lines (inversion is the only non-obvious one), so their composition $T$ does too. The factor $bc - ad \ne 0$ ensures the scaling step is not a collapse.`,
    },
    {
      kind: 'explain',
      title: 'The Riemann mapping theorem',
      body: String.raw`How flexible are conformal maps? Astonishingly so:

> **Riemann mapping theorem.** Every simply connected open set $U \subsetneq \mathbb C$ can be mapped **one-to-one and conformally onto the unit disc**.

Simply connected means no holes. So a square, a star or the inside of a fractal-looking curve are all conformally the same as a disc. Riemann stated the theorem in 1851. His argument had a gap, and the first fully rigorous proofs came around 1900.

The practical upshot: solve a problem once on the disc, then transport it to any such shape with a conformal map.`,
    },
    {
      kind: 'explain',
      title: 'Application: ideal fluid flow',
      body: String.raw`For a steady, incompressible, irrotational 2D flow, the velocity potential $\varphi$ and stream function $\psi$ are harmonic and satisfy Cauchy–Riemann. So $\Phi = \varphi + i\psi$ is holomorphic: the **complex potential**. Fluid moves along the curves $\psi = \text{const}$.

The key point is that a holomorphic function of a holomorphic function is holomorphic. So conformal maps carry solutions of [Laplace’s equation](@math/laplace-equation) to solutions.

- $\Phi = Uz$: uniform flow to the right.
- $\Phi = U\left(z + \frac{1}{z}\right)$: uniform flow round a cylinder $|z| = 1$. The circle itself is a streamline, since $\operatorname{Im}(z + 1/z) = 0$ there.
- The **Joukowski map** $z + 1/z$ sends the unit circle to a flat segment, and circles through $\pm1$ shifted off the origin to airfoil-like shapes, the classical way to model flow past a wing.`,
      widget: { type: 'SvgDiagram', props: { svg: flowSvg } },
    },
    {
      kind: 'multi',
      prompt: 'Which maps are conformal at the given point?',
      choices: [
        String.raw`$e^z$ at $z_0 = 0$`,
        String.raw`$z^2$ at $z_0 = 0$`,
        String.raw`$z^2$ at $z_0 = 1$`,
        String.raw`$\bar z$ at $z_0 = 0$`,
        String.raw`$1/z$ at $z_0 = 1$`,
      ],
      answers: [0, 2, 4],
      why: String.raw`Conformal needs holomorphic with $f' \ne 0$. $(e^z)' = e^z \ne 0$; $(z^2)' = 2z$ is $2 \ne 0$ at $1$ but $0$ at $0$; $(1/z)' = -1/z^2 = -1$ at $1$. Conjugation keeps the size of angles but reverses their sense (it is a reflection), so it is not conformal in the orientation-preserving sense used here.`,
    },
    {
      kind: 'match',
      prompt: 'Match each map with what it does.',
      pairs: [
        [String.raw`$z^2$`, 'First quadrant → upper half-plane'],
        [String.raw`$e^z$`, String.raw`Strip $0 < \operatorname{Im} z < \pi$ → upper half-plane`],
        [String.raw`$\dfrac{z - i}{z + i}$`, 'Upper half-plane → unit disc'],
        [String.raw`$1/z$`, 'Swaps the inside and outside of the unit circle'],
      ],
      why: String.raw`$z^2$ doubles angles $0$–$\pi/2$ to $0$–$\pi$. $e^{x + iy}$ has angle $y \in (0, \pi)$ and any positive modulus. The Cayley map compares distances to $\pm i$. $|1/z| = 1/|z|$ inverts in the unit circle. Chaining such maps is how conformal maps are designed in practice.`,
    },
    {
      kind: 'fill',
      prompt: String.raw`A Möbius map $\frac{az + b}{cz + d}$ needs $ad - bc \ne$ ___. It is determined by the images of ___ points, and it sends circles-or-lines to ___.`,
      bank: ['0', '1', 'three', 'two', 'circles-or-lines', 'ellipses'],
      answer: ['0', 'three', 'circles-or-lines'],
      why: String.raw`If $ad - bc = 0$ the map is constant (or undefined). Four complex parameters, up to a common factor, leave three degrees of freedom, fixed by three points. Möbius maps never produce ellipses from circles.`,
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- Holomorphic with $f' \ne 0$ ⇔ conformal (angle- and orientation-preserving). At critical points ($f' = 0$) angles are multiplied.
- Möbius maps $\frac{az + b}{cz + d}$ ($ad - bc \ne 0$): composed of translations, rotation-scalings and inversion. They send circles-or-lines to circles-or-lines and are fixed by three points.
- Cayley map $\frac{z - i}{z + i}$: upper half-plane → unit disc.
- Riemann mapping theorem: every simply connected proper open subset of $\mathbb C$ is conformally a disc.
- Conformal maps carry harmonic functions to harmonic functions. That makes them a tool for 2D flow, electrostatics and heat.`,
    },
  ],
  references: [
    { authors: 'T. Needham', title: 'Visual Complex Analysis', year: 1997, venue: 'Oxford University Press', detail: 'Ch. 3 (Möbius transformations and inversion), Ch. 4 (conformal maps), Ch. 12 (flows and harmonic functions)' },
    { authors: 'E. M. Stein, R. Shakarchi', title: 'Complex Analysis (Princeton Lectures in Analysis II)', year: 2003, venue: 'Princeton University Press', detail: 'Ch. 8 (conformal mappings; Riemann mapping theorem)' },
    { authors: 'L. V. Ahlfors', title: 'Complex Analysis', year: 1979, venue: '3rd ed., McGraw-Hill', detail: 'Ch. 3 (analytic functions as mappings; linear transformations)' },
    { authors: 'J. W. Brown, R. V. Churchill', title: 'Complex Variables and Applications', year: 2014, venue: '9th ed., McGraw-Hill', detail: 'Ch. 8–10 (mapping by elementary functions, conformal mapping, applications to flow)' },
  ],
} satisfies LessonContent;
