import type { LessonContent } from '../../types';

const ladderSvg = `<svg viewBox="0 0 320 190" xmlns="http://www.w3.org/2000/svg">
<g font-size="9">
<text x="160" y="12" text-anchor="middle" fill="var(--muted)">rough cost for one drug-sized molecule (log scale, illustrative)</text>
${[
    ['Force field (MM)', 'ms', 20, 'var(--c1)', 'no electrons; fitted parameters'],
    ['ML potential (ANI, MACE)', 'ms', 28, 'var(--c6)', 'near-DFT inside its training domain'],
    ['Semi-empirical (GFN2-xTB)', 's', 70, 'var(--c2)', 'approximate QM; good for screening'],
    ['DFT (+ dispersion)', 'min–h', 160, 'var(--c4)', 'workhorse; ~kcal/mol for conformers'],
    ['CCSD(T) / DLPNO-CCSD(T)', 'h–days', 270, 'var(--c5)', '"gold standard" references'],
  ].map(([t, u, w, c, note], i) => {
    const y = 26 + i * 32;
    return `<rect x="10" y="${y}" width="0" height="14" rx="4" fill="${c}" fill-opacity="0.75"><animate attributeName="width" from="0" to="${w}" begin="${i * 0.3}s" dur="0.8s" fill="freeze"/></rect>
<text x="14" y="${y + 10}" fill="var(--fg)" font-weight="700">${t}</text>
<text x="310" y="${y + 10}" text-anchor="end" fill="var(--muted)">${u}</text>
<text x="14" y="${y + 24}" fill="var(--muted)">${note}</text>`;
  }).join('\n')}
</g></svg>`;

export default {
  cards: [
    {
      kind: 'explain',
      title: 'Where the force field gets its numbers',
      body: String.raw`Force fields, docking and FEP all rest on parameters: torsion barriers, partial charges and, implicitly, the protonation state and tautomer you chose for the ligand. Where do those come from, and what do you do when a new chemotype has none?

**Quantum chemistry** is the reference. Drug designers use it to fit torsions and charges, rank conformers, decide which tautomer or protonation state is present, estimate pKa, and compare the reactivity of covalent warheads. Increasingly they also use it to train **ML potentials** that reproduce QM at a fraction of the cost.`,
    },
    {
      kind: 'recall',
      title: 'Hartree–Fock and basis sets (from Chemistry)',
      points: [
        'Hartree–Fock treats each electron in the average field of the others, solved self-consistently (SCF).',
        'It misses **electron correlation**, including dispersion, which matters for stacking and conformer energies.',
        'Post-HF (MP2, CCSD(T)) and DFT add correlation at higher cost or with approximate functionals.',
        'Orbitals are expanded in a **basis set** (e.g. 6-31G*, def2-TZVP); larger basis sets are more accurate and slower.',
      ],
      link: 'chem/hartree-fock',
    },
    {
      kind: 'widget',
      title: 'The cost–accuracy ladder',
      body: String.raw`Each rung is roughly orders of magnitude costlier than the one below. Practical workflows go up the ladder in stages: screen thousands of conformers with a cheap method, then re-rank the best few with DFT (see [DFT](@chem/dft-intro) and [basis sets](@chem/basis-sets)). CCSD(T) scales as $N^7$ and is kept for small benchmark systems.`,
      widget: { type: 'SvgDiagram', props: { svg: ladderSvg }, caption: 'Times are order-of-magnitude guides only; they depend heavily on molecule size, basis set and hardware.' },
    },
    {
      kind: 'explain',
      title: 'Conformer energies and strain',
      body: String.raw`A ligand rarely binds in its global-minimum conformation. The **strain energy** (energy of the bound conformer minus the global minimum) is a cost paid on binding. Typical values are a few kcal/mol at most for good binders.

Force fields can get conformer energy orders wrong, especially around unusual torsions, intramolecular H-bonds and stacking. Dispersion-corrected DFT (e.g. B3LYP-D3 or ωB97X-D with a triple-ζ basis) typically ranks conformers to within roughly 0.5–1 kcal/mol of CCSD(T). Populations then follow from Boltzmann statistics:

$$\frac{p_2}{p_1} = e^{-\Delta E/RT}$$`,
    },
    {
      kind: 'numeric',
      prompt: String.raw`A ligand has two conformers. The bioactive one lies 1.0 kcal/mol above the global minimum. Assuming these are the only two conformers, what percentage of molecules adopt the bioactive conformer at 298 K ($RT = 0.593$ kcal/mol)?`,
      answer: 15.6,
      tolerance: 0.5,
      unit: '%',
      why: String.raw`Ratio $= e^{-1.0/0.593} = 0.185$, so the fraction is $0.185/(1 + 0.185) = 15.6\,\%$. A common slip is to report 18.5 %, which is the ratio, not the fraction.`,
    },
    {
      kind: 'widget',
      title: 'Fit a torsion to a QM scan',
      body: String.raw`Force-field torsions use a Fourier series $E(\phi) = \sum_n \tfrac{V_n}{2}[1 + \cos(n\phi - \gamma_n)]$. Parameterisers compute a QM energy at every 10–15° of the dihedral (relaxing everything else) and fit the $V_n$. Try to match the dashed "QM" curve with the three sliders.`,
      widget: {
        type: 'FunctionPlot',
        props: {
          fns: [
            'V1/2*(1+cos(x*PI/180)) + V2/2*(1-cos(2*x*PI/180)) + V3/2*(1+cos(3*x*PI/180))',
            '1.0/2*(1+cos(x*PI/180)) + 2.4/2*(1-cos(2*x*PI/180)) + 0.4/2*(1+cos(3*x*PI/180))',
          ],
          labels: ['your MM fit', '"QM" target'],
          params: [
            { name: 'V1', min: 0, max: 3, value: 0.5, label: 'V1' },
            { name: 'V2', min: 0, max: 4, value: 1, label: 'V2' },
            { name: 'V3', min: 0, max: 2, value: 1, label: 'V3' },
          ],
          x: [-180, 180], y: [0, 4], xLabel: 'dihedral φ (degrees)', yLabel: 'E (kcal/mol)',
        },
        caption: 'Target: V1 = 1.0, V2 = 2.4, V3 = 0.4. The V2 term (with γ = 180°) favours planarity, like a conjugated aryl–amide bond. Force fields such as OPLS3 were extended with QM fits for very many drug-like torsions (Harder et al. 2016).',
      },
    },
    {
      kind: 'explain',
      title: 'Charges from the electrostatic potential',
      body: String.raw`Partial charges in force fields aren't measurable quantities; they are chosen to reproduce something that is. **RESP** (Bayly et al. 1993) fits atom-centred charges to the QM **electrostatic potential** on a grid of points around the molecule (classically at HF/6-31G*), with restraints that keep buried atoms' charges sensible. **AM1-BCC** reproduces RESP-like charges much faster: semi-empirical AM1 charges plus bond-charge corrections. Charges strongly affect hydrogen bonding, desolvation and therefore FEP results.`,
    },
    {
      kind: 'explain',
      title: 'Tautomers, protonation and pKa',
      body: String.raw`The molecule you draw may not be the one that binds. 2-Hydroxypyridine is slightly favoured in the gas phase, but in water its tautomer 2-pyridone dominates. Amines, carboxylic acids and heterocycles may be charged or neutral at pH 7.4. A wrong state ruins docking and FEP alike.

QM handles this with a thermodynamic cycle: gas-phase DFT energies plus implicit-solvent (e.g. SMD) solvation free energies. For a deprotonation free energy $\Delta G_{aq}$,

$$\text{p}K_a = \frac{\Delta G_{aq}}{2.303\,RT} = \frac{\Delta G_{aq}}{1.364\text{ kcal/mol}} \text{ at 298 K}.$$

So a 1.36 kcal/mol error is one full pKa unit. Absolute pKa from first principles is hard, and relative schemes or empirical corrections work better.`,
    },
    {
      kind: 'mcq',
      prompt: 'A DFT + implicit-solvent calculation overestimates a deprotonation free energy by 2.7 kcal/mol. Roughly how large is the resulting pKa error at 298 K?',
      choices: ['About 2 pKa units', 'About 0.5 pKa units', 'About 1 pKa unit', 'About 4 pKa units'],
      answer: 0,
      why: String.raw`$2.7/1.364 \approx 2.0$ units. Errors of a few kcal/mol in solvation free energies of ions are common, which is why direct pKa prediction from QM is difficult. A 2-unit error moves the charged fraction at pH 7.4 by a factor of up to 100.`,
    },
    {
      kind: 'explain',
      title: 'Warhead reactivity, semi-empirics and ML potentials',
      body: String.raw`For **covalent warheads**, DFT reaction energies and barriers for a model thiol (e.g. methanethiolate) adding to an acrylamide can be used to compare intrinsic reactivity across a series. Too reactive means off-target labelling, too inert means no inhibition. For a series of *N*-arylacrylamides, Cee et al. (2015) found DFT-computed activation parameters tracked measured glutathione (GSH) reaction rates; how far such correlations transfer between warhead classes is still debated. Within the protein, use [QM/MM](@drug/qm-mm).

For thousands of molecules or conformers, cheaper rungs help. **GFN2-xTB** (Bannwarth, Ehlert & Grimme 2019) is a fast semi-empirical tight-binding method for geometries and conformer search. **ML potentials** such as ANI-1 (Smith, Isayev & Roitberg 2017), trained on millions of DFT energies, reach near-DFT accuracy for H, C, N, O molecules at force-field-like speed. They are reliable only inside their training domain.`,
    },
    {
      kind: 'match',
      prompt: 'Match each task to the most appropriate method.',
      pairs: [
        ['Fitting a new torsion parameter', 'DFT constrained dihedral scan'],
        ['Pre-screening 10,000 conformers', 'GFN2-xTB or an ML potential'],
        ['Partial charges for a force field', 'RESP fit to the QM electrostatic potential'],
        ['Benchmark energies for a small model system', 'CCSD(T)'],
      ],
      why: 'Use the cheapest method that is accurate enough for the task. Bulk screening uses fast methods, parameter fitting uses DFT, and CCSD(T) is kept for small reference calculations that check the cheaper methods.',
    },
    {
      kind: 'multi',
      prompt: 'Which questions in a drug project are commonly addressed with quantum-chemical calculations?',
      choices: [
        'Which tautomer of a heterocycle predominates in water',
        'Relative energies of ligand conformers (strain)',
        'Torsion parameters for a novel chemotype',
        'Oral bioavailability in humans',
        'Intrinsic reactivity of covalent warheads',
      ],
      answers: [0, 1, 2, 4],
      why: 'Tautomers, conformer energies, torsions and reactivity are electronic-structure questions. Oral bioavailability depends on absorption, metabolism and transport in a whole organism, and QM alone cannot predict it.',
    },
    {
      kind: 'truefalse',
      prompt: 'Plain B3LYP without a dispersion correction is a reliable choice for the energy of π-stacked conformers.',
      answer: false,
      why: 'Standard B3LYP does not capture London dispersion, which drives stacking and folded conformers. Adding an empirical correction such as -D3 (or using a functional designed for dispersion) is essential for conformer and non-covalent energies.',
    },
    {
      kind: 'fill',
      prompt: 'The bound conformer usually lies above the global minimum; this ___ energy is paid on binding. Force-field charges are often fitted to the QM ___ potential.',
      bank: ['strain', 'electrostatic', 'activation', 'ionisation', 'chemical'],
      answer: ['strain', 'electrostatic'],
      why: 'Strain energy is the conformational cost of adopting the bioactive geometry. RESP-type charges reproduce the QM electrostatic potential around the molecule, which is what the protein actually "feels".',
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- QM supplies the **reference data** behind force fields: torsion scans, RESP/AM1-BCC charges, conformer energies.
- **Dispersion-corrected DFT** is the workhorse; CCSD(T) is for benchmarks; GFN2-xTB and **ML potentials** handle bulk work.
- Conformer populations: $p_2/p_1 = e^{-\Delta E/RT}$; ligand strain is a binding cost.
- Tautomers and protonation states matter; $\text{p}K_a = \Delta G/1.364$ kcal/mol, so small errors become whole pKa units.
- DFT can rank **warhead** reactivity, and QM/MM puts it in the protein.`,
    },
  ],
  references: [
    { authors: 'Cramer, C. J.', title: 'Essentials of Computational Chemistry: Theories and Models', year: 2004, venue: '2nd ed., Wiley' },
    { authors: 'Bayly, C. I., Cieplak, P., Cornell, W. D., Kollman, P. A.', title: 'A well-behaved electrostatic potential based method using charge restraints for deriving atomic charges: the RESP model', year: 1993, venue: 'J. Phys. Chem. 97, 10269–10280' },
    { authors: 'Harder, E., Damm, W., Maple, J., et al.', title: 'OPLS3: a force field providing broad coverage of drug-like small molecules and proteins', year: 2016, venue: 'J. Chem. Theory Comput. 12, 281–296' },
    { authors: 'Bannwarth, C., Ehlert, S., Grimme, S.', title: 'GFN2-xTB — an accurate and broadly parametrized self-consistent tight-binding quantum chemical method with multipole electrostatics and density-dependent dispersion contributions', year: 2019, venue: 'J. Chem. Theory Comput. 15, 1652–1671' },
    { authors: 'Smith, J. S., Isayev, O., Roitberg, A. E.', title: 'ANI-1: an extensible neural network potential with DFT accuracy at force field computational cost', year: 2017, venue: 'Chem. Sci. 8, 3192–3203' },
    { authors: 'Cee, V. J., Volak, L. P., Chen, Y., Bartberger, M. D., et al.', title: 'Systematic study of the glutathione (GSH) reactivity of N-arylacrylamides: 1. Effects of aryl substitution', year: 2015, venue: 'J. Med. Chem. 58, 9171–9178' },
  ],
} satisfies LessonContent;
