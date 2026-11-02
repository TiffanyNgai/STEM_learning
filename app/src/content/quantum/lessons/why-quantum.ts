import type { LessonContent } from '../../types';
import { FEYNMAN3, GRIFFITHS, OPENSTAX_UP3, TONOMURA } from '../refs';

export default {
  cards: [
    {
      kind: 'explain',
      title: 'Your intuition was built for baseballs',
      body: String.raw`Everything you have seen with your own eyes — thrown balls, flowing water — obeys **classical physics**: objects have definite positions and speeds, and energy can take any value.

Around 1900 that picture broke. Classical physics predicted that an electron orbiting a nucleus should radiate away its energy and spiral inwards in about $10^{-11}$ s, so atoms should not exist.

The fix, **quantum mechanics**, is the rulebook for atoms and electrons. It explains why chemical bonds form, why molecules have colours, and how a drug sticks to a protein. It is also the rulebook of a **quantum computer**.`,
    },
    {
      kind: 'explain',
      title: 'Clue 1: light comes in lumps',
      body: String.raw`Shine light on a clean metal and electrons fly out: the **photoelectric effect**. Classical wave theory said brighter light (more energy) should always eject faster electrons, whatever its colour.

Experiments said otherwise: below a threshold **frequency** $f$ (colour), *no* electrons come out, however bright the light. Einstein (1905) explained it: light arrives in packets called **photons**, each carrying energy
$$E = hf,$$
where $h = 6.626\times10^{-34}$ J·s is **Planck's constant**. One photon kicks one electron, which must pay an exit fee $W$ (the **work function**). So the fastest electrons have kinetic energy $K_{\max} = hf - W$; brightness only changes *how many* photons arrive.`,
    },
    {
      kind: 'widget',
      title: 'Photoelectric effect: energy vs colour',
      body: String.raw`Kinetic energy of the fastest ejected electrons (in eV) against light frequency (in $10^{14}$ Hz). Slide the work function $W$: the line keeps the same slope $h$ but the threshold moves.`,
      widget: {
        type: 'FunctionPlot',
        props: {
          fns: ['max(0, 0.4136*x - W)'], x: [0, 20], y: [0, 5],
          params: [{ name: 'W', min: 1.5, max: 5.5, value: 2.3, label: 'W (eV)' }],
          xLabel: 'f (10¹⁴ Hz)', yLabel: 'K_max (eV)', labels: ['K_max = hf − W'],
        },
        caption: String.raw`In these units $h = 4.136\times10^{-15}$ eV·s $= 0.4136$ eV per $10^{14}$ Hz. Sodium has $W \approx 2.3$ eV.`,
      },
    },
    {
      kind: 'mcq',
      prompt: String.raw`Very bright red light (photon energy 1.9 eV) shines on sodium ($W \approx 2.3$ eV). What happens?`,
      choices: ['Many slow electrons are ejected', 'A few fast electrons are ejected', 'No electrons are ejected', 'Electrons are ejected after a delay while energy builds up'],
      answer: 2,
      why: String.raw`Each photon acts alone: 1.9 eV < 2.3 eV, so no single photon can free an electron. Brightness only adds more photons that are each too weak — the classical "wait and accumulate" picture is what experiment ruled out.`,
    },
    {
      kind: 'numeric',
      prompt: String.raw`Violet light with photon energy 3.1 eV hits sodium ($W = 2.28$ eV). What is $K_{\max}$ of the ejected electrons, in eV?`,
      answer: 0.82, tolerance: 0.02, unit: 'eV',
      why: String.raw`$K_{\max} = hf - W = 3.1 - 2.28 = 0.82$ eV. The photon pays the exit fee and the rest becomes kinetic energy.`,
    },
    {
      kind: 'explain',
      title: 'Clue 2: particles interfere',
      body: String.raw`Send water waves at a wall with two slits: behind it, the waves overlap and make **interference fringes** — stripes where crests add up and stripes where a crest meets a trough and cancels.

Fire tiny bullets instead and you get two bumps, one behind each slit. Particles do not interfere… or so we thought.

Now fire **electrons**, so slowly that only one is in the apparatus at a time. Each electron lands as a single dot, like a particle. But after thousands of dots, the fringes of a wave appear.`,
    },
    {
      kind: 'widget',
      title: 'One electron at a time',
      body: 'Watch single dots land. The histogram on the right fills in the classic fringe pattern; the purple curve is the quantum prediction.',
      widget: { type: 'DoubleSlit', props: { detector: false, rate: 30 }, caption: 'Real version: Tonomura et al. (1989) recorded exactly this build-up with single electrons.' },
    },
    {
      kind: 'truefalse',
      prompt: 'Each electron splits into two halves, one half going through each slit.',
      answer: false,
      why: 'Detectors always find a whole electron, never half. What "goes through both slits" is the electron’s *amplitude* (a number we will define next), not pieces of the particle.',
    },
    {
      kind: 'explain',
      title: 'Clue 3: looking changes the result',
      body: String.raw`Now add a detector that records *which slit* each electron went through. The fringes vanish and you get the two-bump particle pattern.

Precisely: interference disappears whenever *any* physical record of the path exists — even one nobody reads. It is about information being stored in the environment, not about a human "observing". Toggle the detector below.`,
      widget: { type: 'DoubleSlit', props: { detector: true, rate: 30 } },
    },
    {
      kind: 'mcq',
      prompt: 'Why do the fringes disappear when a which-path detector is switched on?',
      choices: ['The detector pushes the electrons off course with a strong force', 'The two paths are now distinguishable, so their amplitudes no longer add', 'Electrons stop behaving like waves when they are cold', 'The detector absorbs half of the electrons'],
      answer: 1,
      why: 'Interference needs *indistinguishable* alternatives. Once the path is recorded, the two possibilities lead to different final states, so we add probabilities instead of amplitudes and the cancellations disappear. A gentle detector still destroys the fringes, so "a big kick" is not the explanation.',
    },
    {
      kind: 'explain',
      title: 'The new rulebook (preview)',
      body: String.raw`All three clues fit one set of rules, which this course builds step by step:

1. Each possible outcome gets an **amplitude**: a complex number, not a probability.
2. For indistinguishable ways of reaching the same outcome, **amplitudes add**.
3. The probability is the squared size of the total amplitude: $P = |a|^2$.

Dark fringes are places where two amplitudes are equal and opposite: $|a + (-a)|^2 = 0$. A quantum computer is a machine for choreographing these cancellations.`,
    },
    {
      kind: 'match',
      prompt: 'Match each observation to what it taught us.',
      pairs: [
        ['Photoelectric threshold', 'Light energy comes in packets $E = hf$'],
        ['Single-electron fringes', 'Amplitudes for different paths add and can cancel'],
        ['Which-path detector', 'Recording information destroys interference'],
        ['Stable atoms with sharp spectral lines', 'Bound electrons only have discrete energy levels'],
      ],
      why: 'Each experiment exposed one rule of quantum mechanics; together they force the amplitude rulebook. Sharp spectral lines are photons emitted when electrons jump between discrete levels.',
    },
    {
      kind: 'fill',
      prompt: 'A photon’s energy is E = ___ × f. It can eject an electron only if E exceeds the metal’s ___.',
      bank: ['h', 'c', 'work function', 'intensity', 'mass'],
      answer: ['h', 'work function'],
      why: 'Planck’s constant h sets the size of one energy packet; the work function is the minimum energy needed to free an electron. Intensity changes the number of photons, not the energy of each.',
    },
    {
      kind: 'multi',
      prompt: 'Which of these are quantum effects that matter for drug discovery?',
      choices: ['Formation of chemical bonds between atoms', 'Protons tunnelling through energy barriers in enzymes', 'The colours of dyes and chromophores', 'A tablet falling in a parabola when dropped'],
      answers: [0, 1, 2],
      why: 'Bonding, tunnelling and electronic absorption (colour) are all governed by quantum mechanics. A falling tablet is a large object, where quantum effects average out and classical mechanics is excellent.',
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- Light comes in photons of energy $E = hf$; one photon frees at most one electron.
- Single particles build up interference fringes, so they are described by **amplitudes** that add.
- Probability $= |\text{amplitude}|^2$; a which-path record kills interference.
- These rules underlie chemistry — and quantum computing. Next: the simplest quantum system, the **qubit**.`,
    },
  ],
  references: [
    { ...OPENSTAX_UP3, detail: 'Ch. 6.2 (photoelectric effect), Ch. 6.5–6.6 (matter waves, wave–particle duality)' },
    { ...FEYNMAN3, detail: 'Ch. 1 "Quantum Behavior"' },
    { ...GRIFFITHS, detail: 'Ch. 1' },
    TONOMURA,
  ],
} satisfies LessonContent;
