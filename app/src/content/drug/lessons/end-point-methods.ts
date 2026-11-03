import type { LessonContent } from '../../types';

// Waterfall of MM-PBSA components (kcal/mol): big opposing terms, small net result.
const terms: [string, number, string][] = [
  ['ΔE_vdW', -45, 'var(--c2)'], ['ΔE_elec', -20, 'var(--c2)'], ['ΔG_polar', 32, 'var(--c5)'],
  ['ΔG_nonpolar', -5, 'var(--c2)'], ['−TΔS', 18, 'var(--c5)'],
];
function waterfallSvg() {
  const y0 = 22, sc = 1.9; // px per kcal/mol; value 0 at y0
  let run = 0; const bars: string[] = [];
  terms.forEach(([name, v, c], i) => {
    const x = 18 + i * 52; const a = run, b = run + v; run = b;
    const top = y0 + Math.max(0, -Math.max(a, b)) * sc; const h = Math.abs(v) * sc;
    bars.push(`<rect x="${x}" y="${top}" width="40" height="0" fill="${c}" fill-opacity="0.7"><animate attributeName="height" from="0" to="${h}" begin="${i * 0.4}s" dur="0.5s" fill="freeze"/></rect>
<text x="${x + 20}" y="${y0 + 158}" font-size="8.5" fill="var(--fg)" text-anchor="middle">${name}</text>
<text x="${x + 20}" y="${y0 + 170}" font-size="8.5" fill="var(--muted)" text-anchor="middle">${v > 0 ? '+' : ''}${v}</text>`);
  });
  const xt = 18 + 5 * 52;
  return `<svg viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg">
<line x1="12" y1="${y0}" x2="314" y2="${y0}" stroke="var(--fg)"/>
<text x="14" y="14" font-size="8.5" fill="var(--muted)">0 kcal/mol (bars go down = favourable)</text>
${bars.join('\n')}
<rect x="${xt}" y="${y0}" width="40" height="0" fill="var(--c1)"><animate attributeName="height" from="0" to="${20 * sc}" begin="2.1s" dur="0.5s" fill="freeze"/></rect>
<text x="${xt + 20}" y="${y0 + 158}" font-size="8.5" fill="var(--fg)" text-anchor="middle" font-weight="700">ΔG_bind</text>
<text x="${xt + 20}" y="${y0 + 170}" font-size="8.5" fill="var(--c1)" text-anchor="middle" font-weight="700">−20</text>
</svg>`;
}

export default {
  cards: [
    {
      kind: 'explain',
      title: 'Only simulate the end points',
      body: String.raw`[Alchemical FEP](@drug/free-energy-methods) simulates many unphysical intermediate states and works best for close analogues. **End-point methods** take a shortcut: simulate only the physical end states (mostly the bound complex), and estimate the free energy of each state with a cheap formula.

The most widely used are **MM-PBSA** and **MM-GBSA** (Kollman et al. 2000): molecular mechanics energies plus a continuum (implicit) solvent model. They are cheaper than FEP, can compare unrelated ligands, and are popular for rescoring docking poses. But their accuracy is limited and depends strongly on the target.`,
    },
    {
      kind: 'recall',
      title: 'Implicit solvation (earlier lesson)',
      points: [
        'Implicit solvent treats water as a continuous dielectric medium (ε ≈ 80) instead of explicit molecules.',
        String.raw`**Poisson–Boltzmann (PB)** solves for the electrostatic potential numerically; **Generalized Born (GB)** is a fast analytic approximation.`,
        String.raw`Nonpolar solvation (cavity formation, dispersion) is often modelled as $\gamma\cdot\text{SASA} + b$.`,
        'Implicit models miss specific, structured water molecules such as bridging waters.',
      ],
      link: 'drug/solvation-models',
    },
    {
      kind: 'explain',
      title: 'The MM-PBSA recipe',
      body: String.raw`For each species X (complex PL, protein P, ligand L), average over MD snapshots:

$$G_X = \langle E_{MM}\rangle + \langle G_{polar}\rangle + \langle G_{nonpolar}\rangle - TS$$

- $E_{MM}$: force-field energy (bonded + van der Waals + Coulomb) in vacuum.
- $G_{polar}$: electrostatic solvation from PB (MM-PBSA) or GB (MM-GBSA).
- $G_{nonpolar} = \gamma\,\text{SASA} + b$.
- $-TS$: solute entropy, usually from normal-mode analysis, and often omitted.

Then $\Delta G_{bind} = G_{PL} - G_P - G_L$.`,
    },
    {
      kind: 'widget',
      title: 'A difference of big numbers',
      body: 'A typical decomposition: favourable van der Waals and Coulomb terms are largely cancelled by the cost of stripping water from polar groups (ΔG_polar) and by the entropy loss.',
      widget: { type: 'SvgDiagram', props: { svg: waterfallSvg() }, caption: 'Illustrative numbers. Net −20 kcal/mol is already well outside the usual drug range (≈ −8 to −13 kcal/mol): absolute MM-PBSA values are usually overestimated.' },
    },
    {
      kind: 'numeric',
      prompt: String.raw`An MM-GBSA calculation gives $\Delta E_{vdW} = -38$, $\Delta E_{elec} = -52$, $\Delta G_{GB} = +60$, $\Delta G_{nonpolar} = -4$ and $-T\Delta S = +15$ kcal/mol. What is $\Delta G_{bind}$?`,
      answer: -19,
      tolerance: 0.1,
      unit: 'kcal/mol',
      why: String.raw`$-38 - 52 + 60 - 4 + 15 = -19$ kcal/mol. Note how the large Coulomb gain (−52) is more than cancelled by the desolvation penalty (+60). Electrostatics often adds little to net binding.`,
    },
    {
      kind: 'explain',
      title: 'One trajectory or three?',
      body: String.raw`**Single-trajectory** approach (the usual one): simulate only the complex, and get P and L by deleting the partner from each snapshot. The internal (bonded) energies of P and L then cancel exactly, which removes a lot of noise. The price is that it ignores **reorganisation**: any strain or conformational change on binding is invisible.

**Three-trajectory** approach: simulate PL, P and L separately. It captures reorganisation in principle, but subtracting three noisy averages of thousands of kcal/mol gives much larger statistical errors (Genheden & Ryde 2015).`,
    },
    {
      kind: 'mcq',
      prompt: 'In single-trajectory MM-PBSA, which contribution cancels exactly between complex and separated partners?',
      choices: [
        'Bonded (bond, angle, torsion) energies of protein and ligand',
        'Polar solvation energy',
        'Protein–ligand van der Waals energy',
        'Nonpolar SASA term',
      ],
      answer: 0,
      why: 'The protein and ligand coordinates are identical in the complex and in the "separated" species, so their internal energies are the same and cancel. Interaction and solvation terms do not cancel, because they depend on whether the partner is present.',
    },
    {
      kind: 'explain',
      title: 'Known limitations',
      body: String.raw`Genheden & Ryde (2015) review the pitfalls:
- **Implicit water** misses bridging waters and specific hydration.
- **Entropy**: normal-mode estimates are expensive and noisy, and omitting them is common but unprincipled.
- **Parameter sensitivity**: results depend on the solute dielectric constant $\varepsilon_{in}$ (values of 1–4 are used), atomic radii, GB variant and the SASA coefficients.
- **Absolute values** are usually far too negative. Rankings are more useful than absolute numbers.
- **Performance varies by target**: sometimes good ranking, sometimes no better than docking.
- Large cancellations amplify small errors.`,
    },
    {
      kind: 'widget',
      title: 'How the dielectric choice shifts the answer',
      body: String.raw`A crude model of the electrostatic part: the Coulomb term scales as $1/\varepsilon_{in}$, and the polar solvation term roughly as $(1/\varepsilon_{in} - 1/\varepsilon_{out})$. Move the sliders. A tunable "physical constant" that changes the result this much is a warning sign.`,
      widget: {
        type: 'FunctionPlot',
        props: {
          fns: ['Ec/x + Gp*(1/x - 1/80)/(1 - 1/80)'],
          params: [
            { name: 'Ec', min: -100, max: 0, value: -60, label: 'Coulomb at ε=1' },
            { name: 'Gp', min: 0, max: 100, value: 55, label: 'polar solv. at ε=1' },
          ],
          x: [1, 8], y: [-20, 20], xLabel: 'solute dielectric ε_in', yLabel: 'net electrostatics (kcal/mol)',
        },
        caption: 'Toy scaling, not a real PB calculation. Every term shrinks as ε_in grows, so the electrostatic contribution, and the ranking it drives, depends on an adjustable parameter.',
      },
    },
    {
      kind: 'match',
      prompt: 'Match each MM-PBSA term to its physical meaning.',
      pairs: [
        ['ΔE_vdW', 'Packing and dispersion contacts between protein and ligand'],
        ['ΔG_polar (PB/GB)', 'Electrostatic cost of removing water from charged and polar groups'],
        ['γ·ΔSASA', 'Cavity and hydrophobic effect from buried surface'],
        ['−TΔS (normal modes)', 'Loss of translational, rotational and vibrational freedom'],
      ],
      why: 'The vacuum MM terms describe direct interactions, the PB/GB and SASA terms describe solvent, and the entropy term describes lost motion. The polar desolvation term is usually positive and is the largest opposing term.',
    },
    {
      kind: 'truefalse',
      prompt: 'MM-GBSA binding energies typically agree with experimental ΔG values in absolute terms to within about 1 kcal/mol.',
      answer: false,
      why: 'Absolute MM-GBSA values are usually much too negative, often by many kcal/mol, partly because of missing or poorly estimated entropy. The method is used for relative ranking, and even that is target-dependent.',
    },
    {
      kind: 'multi',
      prompt: 'Which statements about MM-PBSA/GBSA are correct?',
      choices: [
        'Results depend on the chosen solute dielectric constant',
        'Bridging water molecules are naturally included by the continuum model',
        'They can compare structurally unrelated ligands',
        'They are often used to rescore docking poses',
        'They are always more accurate than alchemical FEP',
      ],
      answers: [0, 2, 3],
      why: 'Continuum solvent cannot represent specific bridging waters. MM-PBSA is cheaper and more general than FEP but usually less accurate. Its practical niches are rescoring docked poses and ranking diverse compounds roughly.',
    },
    {
      kind: 'fill',
      prompt: 'MM-PBSA averages energies over ___ taken from an MD trajectory and treats water as a ___.',
      bank: ['snapshots', 'continuum', 'λ-windows', 'lattice', 'crystal'],
      answer: ['snapshots', 'continuum'],
      why: 'End-point methods use only physical snapshots (no λ-windows, which belong to alchemical methods) and replace explicit water with a dielectric continuum (PB or GB).',
    },
    {
      kind: 'order',
      prompt: 'Order the steps of a single-trajectory MM-GBSA calculation.',
      steps: [
        'Run explicit-solvent MD of the protein–ligand complex',
        'Extract evenly spaced snapshots and strip water and ions',
        'For each snapshot compute E_MM, G_GB and SASA terms for complex, protein and ligand',
        'Average ΔG over snapshots (optionally add a normal-mode entropy)',
      ],
      why: 'Sampling happens with explicit water, but the energy evaluation replaces it with the continuum model. Averaging over many snapshots reduces noise, and entropy is an optional, expensive extra.',
    },
    {
      kind: 'explain',
      title: 'Another end-point method: LIE',
      body: String.raw`**Linear interaction energy** (Åqvist, Medina & Samuelsson 1994) simulates the ligand in the protein and free in water, and scales the *changes* in its interaction energy with its surroundings:

$$\Delta G_{bind} \approx \alpha\,\Delta\langle V_{vdW}\rangle + \beta\,\Delta\langle V_{elec}\rangle + \gamma$$

Linear-response theory suggests $\beta \approx 1/2$. The coefficients $\alpha$ and $\gamma$ are fitted to experimental data, so LIE sits between physics and empirical scoring. Like MM-PBSA, it trades rigour for speed.`,
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- End-point methods simulate only physical states: $\Delta G = G_{PL} - G_P - G_L$, with $G = E_{MM} + G_{polar} + G_{nonpolar} - TS$.
- PB or GB handles polar solvation; $\gamma\,$SASA handles nonpolar solvation; entropy is costly and often skipped.
- **Single-trajectory** gives low noise but no reorganisation; **three-trajectory** is noisier.
- Pitfalls: missing waters, dielectric sensitivity, poor entropy, absolute values far too negative, target-dependent success.
- Use for rescoring and rough ranking. For close analogues where accuracy matters, use FEP. **LIE** is an empirically scaled alternative.`,
    },
  ],
  references: [
    { authors: 'Kollman, P. A., Massova, I., Reyes, C., et al.', title: 'Calculating structures and free energies of complex molecules: combining molecular mechanics and continuum models', year: 2000, venue: 'Acc. Chem. Res. 33, 889–897' },
    { authors: 'Genheden, S., Ryde, U.', title: 'The MM/PBSA and MM/GBSA methods to estimate ligand-binding affinities', year: 2015, venue: 'Expert Opin. Drug Discov. 10, 449–461' },
    { authors: 'Åqvist, J., Medina, C., Samuelsson, J.-E.', title: 'A new method for predicting binding affinity in computer-aided drug design', year: 1994, venue: 'Protein Eng. 7, 385–391' },
  ],
} satisfies LessonContent;
