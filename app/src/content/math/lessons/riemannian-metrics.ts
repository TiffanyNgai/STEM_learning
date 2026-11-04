import type { LessonContent } from '../../types';

export default {
  cards: [
    {
      kind: 'explain',
      title: 'Nothing has a length yet',
      body: String.raw`So far a manifold has charts, tangent vectors and forms — but no notion of how *long* a tangent vector is, or what angle two of them make. A diffeomorphism can stretch a sphere into an egg without changing anything we have defined.

Add one piece of structure and all of geometry appears: at every point, an **inner product** on the tangent space. That is a **Riemannian metric**, and with it come lengths of curves, angles, areas, distances, straightest paths and curvature.`,
    },
    {
      kind: 'recall',
      title: 'From inner products',
      points: [
        'An inner product ⟨u,v⟩ is symmetric, bilinear and positive definite (⟨v,v⟩ > 0 for v ≠ 0).',
        'It gives length |v| = √⟨v,v⟩ and angle cos θ = ⟨u,v⟩/(|u||v|).',
        'In a basis it is a symmetric positive-definite matrix: ⟨u,v⟩ = uᵀGv.',
        'Orthogonal means ⟨u,v⟩ = 0; Gram–Schmidt turns any basis into an orthonormal one.',
      ],
      link: 'math/inner-products-orthogonality',
    },
    {
      kind: 'explain',
      title: 'The metric tensor',
      body: String.raw`A **Riemannian metric** $g$ on $M$ gives each $T_pM$ an inner product $g_p(u,v)$, varying smoothly with $p$. In a chart it is a symmetric positive-definite matrix of functions
$$g_{ij}(x) = g\!\left(\frac{\partial}{\partial x^i}, \frac{\partial}{\partial x^j}\right),\qquad g(u,v) = \sum_{i,j} g_{ij}u^iv^j,$$
usually written as the **line element**
$$ds^2 = \sum_{i,j} g_{ij}\,dx^i dx^j .$$
Flat plane in Cartesian coordinates: $ds^2 = dx^2 + dy^2$, so $g_{ij} = \delta_{ij}$. The same plane in polar coordinates: $ds^2 = dr^2 + r^2 d\theta^2$ — the components change with the chart even though the geometry does not. Unit sphere with latitude $\varphi$ and longitude $\lambda$:
$$ds^2 = d\varphi^2 + \cos^2\!\varphi\,\, d\lambda^2 .$$
The $\cos^2\varphi$ is the whole content of "lines of longitude crowd together near the poles". (Surface geometers call $g$ the **first fundamental form** and write $E\,du^2 + 2F\,du\,dv + G\,dv^2$.)`,
    },
    {
      kind: 'widget',
      title: 'Why the metric has a cos φ in it',
      body: String.raw`Drag $p$ north and south. The east-pointing coordinate vector $\partial/\partial\lambda$ shrinks: its length is $\cos\varphi$, zero at the poles, while $\partial/\partial\varphi$ always has length 1. Degrees of longitude are worth less and less the further north you are. That single fact is $g_{\lambda\lambda} = \cos^2\varphi$.`,
      widget: { type: 'MathTangentPlane', props: { lat: 55, lon: 20, showCurve: false, animate: false, caption: 'g on S²' } },
    },
    {
      kind: 'numeric',
      prompt: String.raw`On the unit sphere, the circle of latitude $\varphi$ has length $2\pi\cos\varphi$. What is the length of the circle at $60^\circ$N? (to 3 decimal places)`,
      answer: 3.14159,
      tolerance: 0.01,
      why: String.raw`$2\pi\cos 60^\circ = 2\pi(1/2) = \pi \approx 3.142$, exactly half the equator's $2\pi$. The length comes from the metric: the curve is $\lambda\mapsto(\varphi,\lambda)$ with speed $\sqrt{g_{\lambda\lambda}} = \cos\varphi$, integrated over $\lambda\in[0,2\pi]$.`,
    },
    {
      kind: 'explain',
      title: 'Lengths, areas and distance',
      body: String.raw`Once vectors have lengths, curves do too. For a smooth curve $\gamma:[a,b]\to M$,
$$L(\gamma) = \int_a^b \sqrt{g_{\gamma(t)}(\gamma'(t), \gamma'(t))}\,\,dt ,$$
which is chart-independent. The **Riemannian distance** is
$$d(p,q) = \inf\{L(\gamma) : \gamma \text{ a curve from } p \text{ to } q\},$$
and it makes $M$ a [metric space](@math/metric-spaces) whose topology is the original one. The metric also supplies an area/volume element, $dA = \sqrt{\det g}\,\,dx^1\cdots dx^n$ — on the sphere, $\cos\varphi\,d\varphi\,d\lambda$.

A diffeomorphism $F:(M,g)\to(N,h)$ is an **isometry** if it preserves the metric: $h(dF(u), dF(v)) = g(u,v)$. Isometries preserve lengths, angles, areas and distances. Rolling a flat sheet of paper into a cylinder is a local isometry; flattening an orange peel is not, and the next lesson explains why that failure is unavoidable.`,
    },
    {
      kind: 'mcq',
      prompt: String.raw`The upper half-plane $\{y>0\}$ with $ds^2 = (dx^2+dy^2)/y^2$ is the hyperbolic plane. Compare two paths from $(0,1)$ to $(10,1)$: the straight segment at height $y = 1$, and a path that climbs vertically to $y = 10$, crosses horizontally, then descends. Which is shorter *in this metric*?`,
      choices: [
        'The straight segment, because straight lines are always shortest',
        'The detour over the top, because length is divided by y, so moving high up is cheap',
        'They have exactly the same length by symmetry',
        'Neither: the metric is not positive definite, so lengths are undefined',
      ],
      answer: 1,
      why: String.raw`The integrand is $\sqrt{dx^2+dy^2}/y$, so the straight segment costs $\int_0^{10} dx/1 = 10$, while the detour costs $\ln 10 + 10/10 + \ln 10 \approx 5.6$ — climbing is paid for once, and then horizontal travel at $y=10$ is ten times cheaper. (Make the two points close together instead and the climb stops paying for itself.) This is why hyperbolic geodesics are semicircles meeting the boundary at right angles. "Straight in the picture" has no meaning until a metric says so, and $1/y^2 > 0$ makes this metric perfectly positive definite.`,
    },
    {
      kind: 'explain',
      title: 'Geodesics: as straight as possible',
      body: String.raw`Which curves are "straight" on a curved space? Two answers, and they agree.

**Shortest.** Locally length-minimising: short enough pieces of a geodesic are the shortest route between their endpoints.

**No turning.** Zero acceleration *as measured inside $M$*: the velocity never changes, except for the unavoidable amount needed to stay on the manifold. In coordinates this is the **geodesic equation**
$$\ddot x^k + \sum_{i,j}\Gamma^k_{ij}\,\dot x^i\dot x^j = 0 ,$$
where the **Christoffel symbols** are built from the metric alone:
$$\Gamma^k_{ij} = \tfrac12\sum_{l} g^{kl}\left(\partial_i g_{jl} + \partial_j g_{il} - \partial_l g_{ij}\right).$$
Flat plane in Cartesian coordinates: all $\Gamma = 0$, so $\ddot x = 0$ and geodesics are straight lines at constant speed. On the sphere the geodesics are the **great circles** — the equator and all its rotations.`,
    },
    {
      kind: 'widget',
      title: 'A geodesic triangle on the sphere',
      body: String.raw`The three sides here are great-circle arcs — sphere-straight lines. Two of them are meridians meeting the equator at $90^\circ$, so this triangle's angles are $\alpha, 90^\circ, 90^\circ$ and sum to more than $180^\circ$. Push the $\alpha$ slider up to $90^\circ$ and you get a triangle with three right angles. Ignore the transported arrow for now; it is the subject of the next lesson.`,
      widget: { type: 'MathHolonomy', props: { loop: 'triangle', alpha: 60, loops: ['triangle'], animate: false } },
    },
    {
      kind: 'truefalse',
      prompt: String.raw`A geodesic between two points is always the shortest path between them.`,
      answer: false,
      why: String.raw`Geodesics are only *locally* shortest. The long way round a great circle from London to New York is still a geodesic but is far from shortest; past the antipode a sphere geodesic stops minimising altogether. Globally, the Hopf–Rinow theorem guarantees that on a complete connected Riemannian manifold *some* geodesic realises the distance — not that every geodesic does.`,
    },
    {
      kind: 'widget',
      title: 'Where the geodesic equation comes from',
      body: String.raw`Why those Christoffel symbols? Here is the route, with the sphere as the worked example.`,
      widget: {
        type: 'StepReveal',
        props: {
          steps: [
            String.raw`Minimise length, or equivalently the energy $E(\gamma) = \tfrac12\int g_{ij}\dot x^i\dot x^j\,dt$ (same minimisers, with constant speed thrown in free).`,
            String.raw`Apply the Euler–Lagrange equations $\frac{d}{dt}\frac{\partial L}{\partial \dot x^k} = \frac{\partial L}{\partial x^k}$ with $L = \tfrac12 g_{ij}\dot x^i\dot x^j$.`,
            String.raw`Rearranging gives $\ddot x^k + \Gamma^k_{ij}\dot x^i\dot x^j = 0$ with $\Gamma^k_{ij} = \tfrac12 g^{kl}(\partial_i g_{jl} + \partial_j g_{il} - \partial_l g_{ij})$.`,
            String.raw`Sphere, $ds^2 = d\varphi^2 + \cos^2\!\varphi\,d\lambda^2$: the only non-zero symbols are $\Gamma^{\varphi}_{\lambda\lambda} = \sin\varphi\cos\varphi$ and $\Gamma^{\lambda}_{\varphi\lambda} = \Gamma^{\lambda}_{\lambda\varphi} = -\tan\varphi$.`,
            String.raw`The equations become $\ddot\varphi + \sin\varphi\cos\varphi\,\dot\lambda^2 = 0$ and $\ddot\lambda - 2\tan\varphi\,\dot\varphi\dot\lambda = 0$.`,
            String.raw`The equator $\varphi \equiv 0,\ \lambda = t$ solves both ($\sin 0 = 0$, $\tan 0 = 0$): it is a geodesic. A latitude circle $\varphi \equiv \varphi_0 \neq 0$ does **not**: the first equation leaves $\sin\varphi_0\cos\varphi_0\,\dot\lambda^2 \neq 0$.`,
          ],
          notes: [
            'Energy is easier to differentiate than a square root.',
            'This is the same variational machinery as Lagrangian mechanics.',
            'Only the metric and its first derivatives appear — the equation is intrinsic.',
            'Everything here comes from differentiating cos²φ.',
            'A second-order ODE system: a point plus a velocity determines the geodesic.',
            'So flying "due west along 60°N" is not the straightest route — airlines fly great circles instead.',
          ],
        },
      },
    },
    {
      kind: 'mcq',
      prompt: String.raw`Why is the circle of latitude $60^\circ$N not a geodesic of the sphere, while the equator is?`,
      choices: [
        'Because it is shorter than the equator',
        'Because it is not a closed curve',
        String.raw`Because a traveller on it must keep steering towards the pole: its acceleration has a non-zero component inside the surface`,
        'Because the metric is singular there',
      ],
      answer: 2,
      why: String.raw`Flying "due west" at $60^\circ$N requires constant left turn as measured on the surface — the term $\sin\varphi\cos\varphi\,\dot\lambda^2$ in the geodesic equation is exactly that steering. Only on the equator (and on great circles generally) does the turn vanish. Being shorter is irrelevant: geodesics are about not turning, and the metric is perfectly regular at $60^\circ$.`,
    },
    {
      kind: 'explain',
      title: 'Parallel transport and the Levi-Civita connection',
      body: String.raw`To differentiate a vector field on a curved space you must compare vectors in *different* tangent spaces, and nothing so far lets you. A **connection** $\nabla$ supplies the missing rule: $\nabla_XY$ is the derivative of $Y$ along $X$. A vector field along a curve with $\nabla_{\gamma'}V = 0$ is **parallel transported**: carried along as unchanged as the space allows.

> **Fundamental theorem of Riemannian geometry.** On any Riemannian manifold there is exactly one connection that is *compatible with the metric* (transport preserves lengths and angles) and *torsion-free* ($\nabla_XY - \nabla_YX = [X,Y]$). It is the **Levi-Civita connection**, and its coefficients in a chart are precisely the Christoffel symbols $\Gamma^k_{ij}$.

A geodesic is then a curve that parallel-transports its own velocity: $\nabla_{\gamma'}\gamma' = 0$. And the **exponential map** $\exp_p(v) = \gamma_v(1)$ — follow the geodesic from $p$ with initial velocity $v$ for one unit of time — gives a chart around $p$ in which the geometry looks as flat as possible to first order.`,
    },
    {
      kind: 'match',
      prompt: 'Match each item to its role.',
      pairs: [
        [String.raw`$g_{ij}$`, 'Inner product on each tangent space, in coordinates'],
        [String.raw`$\Gamma^k_{ij}$`, 'How the coordinate frame itself turns; built from derivatives of g'],
        ['Geodesic', 'Curve with zero intrinsic acceleration; locally shortest'],
        ['Isometry', 'Diffeomorphism preserving the metric, hence all lengths and angles'],
        [String.raw`$\exp_p(v)$`, 'Point reached by following the geodesic from p with velocity v for time 1'],
      ],
      why: String.raw`The metric is the data; the Christoffel symbols are derived from it and encode how to differentiate; geodesics are the curves that obey that derivative rule; isometries are the maps that preserve everything; the exponential map turns tangent vectors into points.`,
    },
    {
      kind: 'fill',
      prompt: String.raw`A Riemannian metric is a smoothly varying ___ product on tangent spaces. The length of a curve is the ___ of the speed. Curves with zero intrinsic acceleration are ___.`,
      bank: ['inner', 'integral', 'geodesics', 'wedge', 'derivative', 'isometries'],
      answer: ['inner', 'integral', 'geodesics'],
      why: String.raw`Length is $\int|\gamma'|\,dt$ — an integral, not a derivative. Isometries are maps that preserve the metric, not curves. The wedge product belongs to differential forms, which need no metric at all.`,
    },
    {
      kind: 'order',
      prompt: String.raw`Order the steps to find the geodesics of a surface from its metric.`,
      steps: [
        String.raw`Write the metric in a chart: $g_{ij}(x)$.`,
        String.raw`Invert it to get $g^{kl}$ and compute the Christoffel symbols $\Gamma^k_{ij}$.`,
        String.raw`Write the geodesic equations $\ddot x^k + \Gamma^k_{ij}\dot x^i\dot x^j = 0$.`,
        String.raw`Solve them with an initial point and initial velocity.`,
      ],
      why: String.raw`Everything flows from the metric: the Christoffel symbols are built from its first derivatives, they define the ODE, and a point plus a velocity picks out one solution — which is why there is exactly one geodesic in each direction from each point.`,
    },
    {
      kind: 'multi',
      prompt: 'Which statements are true of a Riemannian manifold?',
      choices: [
        'The metric components gᵢⱼ depend on the chart, but lengths of curves do not.',
        'Parallel transport along the Levi-Civita connection preserves the length of the transported vector.',
        'Christoffel symbols are the components of a tensor, so if they vanish in one chart they vanish in all.',
        'A geodesic is determined by one point and one initial velocity.',
      ],
      answers: [0, 1, 3],
      why: String.raw`Lengths, angles and distances are chart-independent even though $g_{ij}$ is not; metric compatibility is exactly the statement that transport preserves lengths; and the geodesic equation is a second-order ODE, so a point and a velocity fix the solution. Christoffel symbols are *not* a tensor: in the plane they vanish in Cartesian coordinates and not in polar ones.`,
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- A **Riemannian metric** is a smooth inner product on every tangent space, written $ds^2 = g_{ij}\,dx^i dx^j$. The sphere's is $d\varphi^2 + \cos^2\!\varphi\,d\lambda^2$.
- It gives curve length $\int\sqrt{g(\gamma',\gamma')}\,dt$, distance, angle, area, and the notion of **isometry**.
- **Geodesics** are locally shortest and have zero intrinsic acceleration: $\ddot x^k + \Gamma^k_{ij}\dot x^i\dot x^j = 0$, with $\Gamma$ built from the metric alone. Great circles on the sphere; latitude circles are not geodesics.
- The **Levi-Civita connection** is the unique metric-compatible, torsion-free way to differentiate vector fields; it defines **parallel transport**.

Next: transport a vector all the way around a loop and it comes back rotated. How much? → [curvature](@math/curvature).`,
    },
  ],
  references: [
    { authors: 'M. P. do Carmo', title: 'Differential Geometry of Curves and Surfaces', year: 2016, venue: '2nd ed., Dover', detail: '§2-5 (the first fundamental form), §4-2 (isometries, conformal maps), §4-4 (parallel transport and geodesics)' },
    { authors: 'J. M. Lee', title: 'Introduction to Smooth Manifolds', year: 2013, venue: '2nd ed., Springer GTM 218', detail: 'Ch. 13 (Riemannian metrics, lengths and distances)' },
    { authors: 'J. M. Lee', title: 'Introduction to Riemannian Manifolds', year: 2018, venue: '2nd ed., Springer GTM 176', detail: 'Ch. 2 (Riemannian metrics), Ch. 4–5 (connections, the Levi-Civita connection), Ch. 6 (geodesics, the exponential map, Hopf–Rinow)' },
    { authors: 'T. Needham', title: 'Visual Differential Geometry and Forms: A Mathematical Drama in Five Acts', year: 2021, venue: 'Princeton University Press', detail: 'Act II (the metric) and Act IV (parallel transport, geodesics)' },
  ],
} satisfies LessonContent;
