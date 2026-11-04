import type { LessonContent } from '../../types';

const trianglesSvg = String.raw`<svg viewBox="0 0 320 170" xmlns="http://www.w3.org/2000/svg" font-size="10" font-family="inherit">
  <text x="160" y="13" text-anchor="middle" fill="var(--fg)" font-weight="bold">the same triangle on three surfaces</text>

  <circle cx="56" cy="78" r="36" fill="var(--c2)" opacity="0.12"/>
  <path d="M56,42 C74,48 84,64 84,78 C70,92 44,92 30,78 C30,62 40,48 56,42Z" fill="none" stroke="var(--c2)" stroke-width="2"/>
  <text x="56" y="128" text-anchor="middle" fill="var(--c2)" font-weight="bold">K &gt; 0</text>
  <text x="56" y="141" text-anchor="middle" fill="var(--fg)">angles &gt; 180°</text>
  <text x="56" y="153" text-anchor="middle" fill="var(--muted)">sphere</text>

  <polygon points="160,44 188,100 132,100" fill="var(--c1)" opacity="0.12"/>
  <polygon points="160,44 188,100 132,100" fill="none" stroke="var(--c1)" stroke-width="2"/>
  <text x="160" y="128" text-anchor="middle" fill="var(--c1)" font-weight="bold">K = 0</text>
  <text x="160" y="141" text-anchor="middle" fill="var(--fg)">angles = 180°</text>
  <text x="160" y="153" text-anchor="middle" fill="var(--muted)">plane, cylinder, cone</text>

  <path d="M264,44 C254,66 252,86 288,100 C268,80 252,74 240,100 C244,74 254,58 264,44Z" fill="var(--c5)" opacity="0.12" stroke="var(--c5)" stroke-width="2"/>
  <text x="264" y="128" text-anchor="middle" fill="var(--c5)" font-weight="bold">K &lt; 0</text>
  <text x="264" y="141" text-anchor="middle" fill="var(--fg)">angles &lt; 180°</text>
  <text x="264" y="153" text-anchor="middle" fill="var(--muted)">saddle</text>

  <circle r="3" fill="var(--c3)">
    <animateMotion dur="6s" repeatCount="indefinite" path="M56,42 C74,48 84,64 84,78 C70,92 44,92 30,78 C30,62 40,48 56,42Z"/>
  </circle>
  <circle r="3" fill="var(--c3)">
    <animateMotion dur="6s" repeatCount="indefinite" path="M160,44 L188,100 L132,100 Z"/>
  </circle>
</svg>`;

export default {
  cards: [
    {
      kind: 'explain',
      title: 'Can an ant tell it is on a sphere?',
      body: String.raw`An ant confined to a surface cannot step off it to look. It has only a tape measure. Can it decide whether its world is flat?

Yes. It draws a circle of radius $r$ around itself and measures the circumference. On a flat plane it gets $2\pi r$. On a sphere it gets *less*; on a saddle, *more*. It can draw a triangle out of straightest-possible paths and add up the angles: more than $180^\circ$ on a sphere, less on a saddle.

**Curvature** is the number that quantifies this, and the astonishing fact — Gauss's *Theorema Egregium* — is that for a surface in space, this intrinsic, tape-measure quantity equals a quantity defined by how the surface bends in the surrounding space. Bending without stretching cannot change it.`,
      widget: { type: 'SvgDiagram', props: { svg: trianglesSvg } },
    },
    {
      kind: 'explain',
      title: 'Principal curvatures, and K',
      body: String.raw`Take a surface $S\subset\mathbb{R}^3$ and a point $p$ with unit normal $N$. Slice $S$ with planes containing $N$: each slice is a curve, with a signed curvature. Over all directions these **normal curvatures** reach a maximum $k_1$ and a minimum $k_2$ — the **principal curvatures**, attained in two perpendicular directions. Define

$$K = k_1 k_2 \quad\text{(Gauss curvature)},\qquad H = \tfrac{1}{2}(k_1+k_2)\quad\text{(mean curvature)}.$$

- Sphere of radius $R$: every slice curves the same way, $k_1 = k_2 = 1/R$, so $K = 1/R^2 > 0$. Bigger spheres are flatter.
- Cylinder of radius $R$: one direction curves ($k_1 = 1/R$), the other is a straight line ($k_2 = 0$), so $K = 0$.
- Saddle: the two directions curve *opposite* ways, so $k_1 > 0 > k_2$ and $K < 0$.

$H$ depends on how the surface sits in space — a plane bent into a cylinder changes $H$ from 0 to $1/(2R)$. $K$, remarkably, does not.`,
    },
    {
      kind: 'numeric',
      prompt: String.raw`What is the Gauss curvature of a circular cylinder of radius 3?`,
      answer: 0,
      why: String.raw`$k_1 = 1/3$ around the cylinder and $k_2 = 0$ along it, so $K = k_1k_2 = 0$. That is why a sheet of paper rolls into a cylinder without creasing or stretching: the cylinder is intrinsically flat, as the paper was. The *mean* curvature $H = 1/6$ is not zero — but $H$ is not intrinsic.`,
    },
    {
      kind: 'explain',
      title: 'Theorema Egregium',
      body: String.raw`> **Theorema Egregium** (Gauss, 1827). *If a curved surface is developed upon any other surface whatever, the measure of curvature in each point remains unchanged.* In modern terms: the Gauss curvature $K$ is determined by the first fundamental form alone, so any local isometry preserves it.

"Egregium" means *remarkable*, and Gauss meant it. $K$ was defined using the normal direction, which an ant cannot see — yet it can be computed from the metric $g_{ij}$ and its first and second derivatives, which the ant can measure with a tape.

Two concrete consequences:

- **Paper.** A flat sheet has $K=0$, so any surface you bend it into without stretching must have $K=0$ everywhere: cylinders and cones, never a piece of sphere. Conversely a pizza slice held flat flops; curl it ($k_1 \neq 0$ sideways) and, since $K$ must stay 0, the other direction is forced to stay straight. That is the pizza-fold trick, and it is a theorem.
- **Maps.** A sphere of radius $R$ has $K = 1/R^2 \neq 0$ and a flat map has $K=0$, so **no map of any region of the Earth can preserve all distances**. Every projection must distort something. Mercator keeps angles right (conformal) and ruins areas — Greenland looks the size of Africa, though it is about 14 times smaller. Equal-area projections keep areas and ruin shapes. This is not a failure of cartographers; it is Gauss's theorem.`,
    },
    {
      kind: 'mcq',
      prompt: String.raw`Which statement follows from the Theorema Egregium?`,
      choices: [
        'A sphere cannot be flattened onto a plane without distorting distances',
        'A cylinder cannot be unrolled onto a plane without distorting distances',
        'Any two surfaces with the same mean curvature are isometric',
        'Gauss curvature can only be measured from outside the surface',
      ],
      answer: 0,
      why: String.raw`Isometries preserve $K$; the sphere has $K = 1/R^2 \neq 0$ and the plane has $K = 0$, so no isometry exists — hence distorted maps. A cylinder *can* be unrolled, precisely because its $K$ is already 0. The mean curvature is the quantity that is *not* intrinsic, and the whole point of the theorem is that $K$ is measurable from inside.`,
    },
    {
      kind: 'truefalse',
      prompt: String.raw`There is a map projection that preserves both angles and areas over a region of the globe.`,
      answer: false,
      why: String.raw`A map preserving both angles and areas at every point preserves lengths too, i.e. is an isometry, which Theorema Egregium forbids between $K = 1/R^2$ and $K = 0$. You can have conformal (Mercator, stereographic) or equal-area (Lambert, Gall–Peters), never both.`,
    },
    {
      kind: 'explain',
      title: 'Curvature is holonomy',
      body: String.raw`Here is the cleanest intrinsic meaning of $K$. Parallel transport a tangent vector around a small closed loop. On a flat surface it comes back exactly as it left. On a curved one it comes back **rotated**, by an angle called the **holonomy**, and

$$\text{holonomy angle} \;=\; \iint_{\text{enclosed region}} K\,dA .$$

So curvature is "rotation per unit area". On the unit sphere, where $K \equiv 1$, the holonomy of a loop is simply the **area** it encloses, in steradians. This also explains the angle excess: a geodesic triangle's angle sum exceeds $\pi$ by exactly the same integral.

The same idea in higher dimensions produces the **Riemann curvature tensor**
$$R(X,Y)Z = \nabla_X\nabla_YZ - \nabla_Y\nabla_XZ - \nabla_{[X,Y]}Z,$$
which measures the failure of second covariant derivatives to commute — infinitesimal holonomy around the loop spanned by $X$ and $Y$. For a surface it carries exactly one independent number, which is $K$.`,
    },
    {
      kind: 'widget',
      title: 'Carry a vector around and watch it turn',
      body: String.raw`Two loops on the unit sphere. The **triangle** has vertices at the north pole and two points on the equator $\alpha$ apart: its angles are $\alpha, 90^\circ, 90^\circ$, its excess over $180^\circ$ is $\alpha$, and the vector comes back rotated by $\alpha$. The **latitude circle** at colatitude $\theta_0$ encloses a cap of area $2\pi(1-\cos\theta_0)$, and that is the turn. At $\theta_0 = 90^\circ$ the loop is the equator — a geodesic, area $2\pi$, so the turn is a full $360^\circ$, i.e. no net rotation at all.`,
      widget: { type: 'MathHolonomy', props: { loop: 'triangle', alpha: 90 } },
    },
    {
      kind: 'numeric',
      prompt: String.raw`On the unit sphere, parallel transport a vector once around the circle of colatitude $\theta_0 = 60^\circ$. The holonomy angle is $2\pi(1-\cos\theta_0)$ radians. What is it in **degrees**?`,
      answer: 180,
      tolerance: 0.5,
      why: String.raw`$2\pi(1-\cos 60^\circ) = 2\pi(1 - 1/2) = \pi$ radians $= 180^\circ$. Equivalently, the spherical cap above $60^\circ$ has area $\pi$ out of the sphere's $4\pi$, and with $K\equiv1$ the holonomy *is* that area. The vector comes back exactly reversed.`,
    },
    {
      kind: 'explain',
      title: 'Gauss–Bonnet',
      body: String.raw`The local statement and the global statement of the same theorem:

> **Local (geodesic triangle).** If $T$ is a triangle whose sides are geodesics, with interior angles $\alpha,\beta,\gamma$, then
> $$\alpha+\beta+\gamma-\pi = \iint_T K\,dA .$$

> **Global (Gauss–Bonnet).** For a compact oriented surface $M$ with piecewise-smooth boundary,
> $$\iint_M K\,dA \;+\; \oint_{\partial M} k_g\,ds \;+\; \sum_i \varepsilon_i \;=\; 2\pi\,\chi(M),$$
> where $k_g$ is the geodesic curvature of the boundary, the $\varepsilon_i$ are the exterior angles at corners, and $\chi(M)$ is the [Euler characteristic](@math/euler-characteristic-homology).

For a closed surface with no boundary this reads $\iint_M K\,dA = 2\pi\chi(M)$ — and that is extraordinary. The left side is geometry, sensitive to every dent and bulge; the right side is topology, counting only holes. Dent a sphere and curvature moves around, but its total stays $4\pi$.`,
    },
    {
      kind: 'numeric',
      prompt: String.raw`What is $\iint_M K\,dA$ over the whole surface of a doughnut (a torus, $\chi = 0$)?`,
      answer: 0,
      why: String.raw`Gauss–Bonnet gives $2\pi\chi(T^2) = 0$. The outer part of a doughnut has $K > 0$ and the inner part (near the hole) has $K < 0$, and the two cancel *exactly*, no matter how the doughnut is shaped. For comparison, a sphere of any radius gives $2\pi\chi(S^2) = 4\pi$: check it as $\iint (1/R^2)\,dA = (1/R^2)(4\pi R^2) = 4\pi$.`,
    },
    {
      kind: 'mcq',
      prompt: String.raw`A geodesic triangle on the unit sphere has angles $90^\circ, 90^\circ, 90^\circ$. What is its area?`,
      choices: [
        String.raw`$\pi/2$`,
        String.raw`$\pi$`,
        String.raw`$2\pi$`,
        String.raw`$4\pi$`,
      ],
      answer: 0,
      why: String.raw`With $K\equiv1$, area $=$ angle excess $= (\pi/2 + \pi/2 + \pi/2) - \pi = \pi/2$. Sanity check: eight such triangles tile the sphere, and $8\times\pi/2 = 4\pi$, the sphere's total area ✓. Picking $4\pi$ is the whole sphere, not one octant.`,
    },
    {
      kind: 'explain',
      title: 'Upwards: Ricci, Einstein, and data',
      body: String.raw`In dimension $n$ the Riemann tensor $R^{i}_{\ jkl}$ has many components, and three progressively coarser summaries of it are used constantly:

- the **sectional curvature** $K(\sigma)$ of a 2-plane $\sigma \subset T_pM$: the Gauss curvature of the surface swept out by geodesics leaving $p$ in directions from $\sigma$. This recovers the surface case exactly, and it still knows everything the Riemann tensor does.
- the **Ricci tensor** $\mathrm{Ric}(v,v)$: for a unit vector $v$, the *sum* of the $n-1$ sectional curvatures $K(v,e_i)$ over an orthonormal basis of the plane-directions through $v$ — so $n-1$ times their average. It controls how the *volume* of a small ball deviates from the Euclidean value.
- the **scalar curvature** $R$: one number per point, the trace of $\mathrm{Ric}$, i.e. the sum of $\mathrm{Ric}(e_i,e_i)$ over an orthonormal basis. On a surface it is simply $2K$.

General relativity is built on these: Einstein's field equations
$$R_{\mu\nu} - \tfrac12 R\,g_{\mu\nu} + \Lambda g_{\mu\nu} = \frac{8\pi G}{c^4}T_{\mu\nu}$$
— in which $R_{\mu\nu}$ is the Ricci tensor in index notation, $R$ the scalar curvature, $\Lambda$ the cosmological constant and $T_{\mu\nu}$ the stress–energy tensor — say that the curvature of spacetime is set by its energy and momentum, with gravity a geodesic effect rather than a force. (Spacetime carries a *Lorentzian* metric, not positive definite, but the machinery of connections, geodesics and curvature is the same one you now know — see [special relativity](@physics/special-relativity-intro).) Curvature also shows up far from physics: curvature bounds control how data concentrates on manifolds, and Ricci-flow-style arguments underlie modern geometric analysis.`,
    },
    {
      kind: 'multi',
      prompt: 'Which statements are true?',
      choices: [
        String.raw`Gauss curvature is preserved by local isometries, mean curvature is not.`,
        String.raw`A surface with $K = 0$ everywhere is locally isometric to the plane.`,
        String.raw`On a closed surface, $\iint K\,dA$ depends only on the topology.`,
        String.raw`If a surface has $K > 0$ everywhere it must be a sphere of some radius.`,
      ],
      answers: [0, 1, 2],
      why: String.raw`Theorema Egregium gives the first; the second is its converse direction (a flat metric can be straightened into Cartesian coordinates locally); Gauss–Bonnet gives the third. The last is false: an egg-shaped ellipsoid has $K>0$ everywhere, yet its curvature varies from point to point, so it is not isometric to any round sphere.`,
    },
    {
      kind: 'match',
      prompt: 'Match each surface to its Gauss curvature.',
      pairs: [
        ['Unit sphere', 'K = 1 everywhere'],
        ['Sphere of radius 2', 'K = 1/4 everywhere'],
        ['Cylinder or cone', 'K = 0 away from the cone tip'],
        ['Saddle (hyperbolic paraboloid) at its centre', 'K < 0'],
        ['Torus, outer rim versus inner rim', 'K > 0 outside, K < 0 near the hole'],
      ],
      why: String.raw`A sphere of radius $R$ has $K = 1/R^2$, so bigger means flatter. Cylinders and cones are rolled-up planes and so are intrinsically flat. A saddle bends opposite ways in perpendicular directions, giving $k_1k_2 < 0$; a torus does both, and by Gauss–Bonnet its positive and negative parts cancel.`,
    },
    {
      kind: 'fill',
      prompt: String.raw`The product of the principal curvatures is the ___ curvature. Gauss's ___ says it is unchanged by bending without stretching. Summed over a closed surface it equals $2\pi$ times the ___ characteristic.`,
      bank: ['Gauss', 'Theorema Egregium', 'Euler', 'mean', 'Stokes’ theorem', 'Betti'],
      answer: ['Gauss', 'Theorema Egregium', 'Euler'],
      why: String.raw`$K = k_1k_2$ is the Gauss curvature (the *mean* curvature is the average $\tfrac12(k_1+k_2)$, and it is not intrinsic). Theorema Egregium is the invariance statement; Gauss–Bonnet supplies $2\pi\chi$, with $\chi$ the Euler characteristic. Betti numbers count holes dimension by dimension; $\chi$ is their alternating sum.`,
    },
    {
      kind: 'order',
      prompt: String.raw`Order the reasoning that forbids a perfect flat map of the Earth.`,
      steps: [
        String.raw`A local isometry preserves the first fundamental form.`,
        String.raw`By Theorema Egregium, $K$ is computed from the first fundamental form alone, so an isometry preserves $K$.`,
        String.raw`A sphere of radius $R$ has $K = 1/R^2$; a flat map has $K = 0$.`,
        String.raw`Since $1/R^2\neq 0$, no isometry exists: every map projection distorts lengths somewhere.`,
      ],
      why: String.raw`The argument is a chain: isometries preserve the metric, the theorem upgrades that to preserving $K$, the two surfaces have different $K$, so no such map can exist. The theorem is doing the real work — without it, preserving the metric would say nothing about a quantity defined by the normal direction.`,
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- **Gauss curvature** $K = k_1k_2$: positive on a sphere ($1/R^2$), zero on a cylinder or cone, negative on a saddle. **Mean** curvature $H$ is extrinsic; $K$ is not.
- **Theorema Egregium** (Gauss, 1827): $K$ is determined by the metric alone, so bending without stretching cannot change it. Hence no distortion-free map of the Earth, and the pizza-fold trick.
- **Curvature is holonomy:** transport around a loop rotates a vector by $\iint K\,dA$. On the unit sphere, holonomy $=$ enclosed area.
- **Gauss–Bonnet:** $\iint_M K\,dA + \oint_{\partial M}k_g\,ds + \sum\varepsilon_i = 2\pi\chi(M)$ — total curvature is topology. Geodesic triangles have angle excess $\iint_T K\,dA$.
- In higher dimensions the Riemann tensor, with its **sectional**, **Ricci** and **scalar** curvature summaries, runs general relativity.

That completes the unit: charts → tangent spaces → fields and flows → forms and Stokes → metrics and geodesics → curvature. A natural next step is where manifolds and symmetry meet: [Lie groups](@math/lie-groups-intro).`,
    },
  ],
  references: [
    { authors: 'C. F. Gauss', title: 'Disquisitiones generales circa superficies curvas', year: 1827, venue: 'Commentationes Societatis Regiae Scientiarum Gottingensis Recentiores 6 (1828), 99–146', detail: 'Art. 12: the Theorema Egregium' },
    { authors: 'M. P. do Carmo', title: 'Differential Geometry of Curves and Surfaces', year: 2016, venue: '2nd ed., Dover', detail: '§3-2 to §3-3 (Gauss map, principal and Gauss curvature), §4-3 (Theorema Egregium), §4-5 (the Gauss–Bonnet theorem and its applications)' },
    { authors: 'T. Needham', title: 'Visual Differential Geometry and Forms: A Mathematical Drama in Five Acts', year: 2021, venue: 'Princeton University Press', detail: 'Act III (curvature, holonomy and Gauss–Bonnet), Act IV (parallel transport)' },
    { authors: 'J. M. Lee', title: 'Introduction to Riemannian Manifolds', year: 2018, venue: '2nd ed., Springer GTM 176', detail: 'Ch. 7 (the Riemann curvature tensor; sectional, Ricci and scalar curvature), Ch. 8 (Riemannian submanifolds and the Gauss equation), Ch. 9 (the Gauss–Bonnet theorem)' },
  ],
} satisfies LessonContent;
