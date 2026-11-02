import { useState } from 'react';
import { Axes, Btn, C, Controls, Slider, Stage, pathOf, scale } from './_kit';

type Mode = 'agonists' | 'competitive' | 'noncompetitive' | 'partial';
/**
 * Log dose–response curves (Hill/Emax model) for pharmacodynamics.
 * props (all optional):
 *  mode?: 'agonists' | 'competitive' | 'noncompetitive' | 'partial'  (initial view)
 *  modes?: Mode[]  (which view buttons to show; default all four)
 *  hill?: number (Hill slope n, default 1)
 * Views:
 *  agonists — drug A (reference full agonist) vs drug B with sliders for B's EC50 (potency) and Emax (efficacy).
 *  competitive — agonist alone + agonist with a competitive antagonist: EC50' = EC50·(1 + [B]/K_B)  (parallel right shift, same Emax).
 *  noncompetitive — irreversible / allosteric antagonist: Emax' = Emax/(1 + [B]/K_B) (Emax falls, EC50 ~unchanged).
 *  partial — full agonist curve in the presence of a fixed concentration of a partial agonist (intrinsic activity slider):
 *            the partial agonist raises the baseline yet antagonises the full agonist at high occupancy.
 * x axis: log10 [drug] (EC50 of reference agonist = 0 → 1 unit); y axis: % of maximal response.
 */
export default function DoseResponseMed({ mode = 'agonists', modes = ['agonists', 'competitive', 'noncompetitive', 'partial'], hill = 1 }: {
  mode?: Mode; modes?: Mode[]; hill?: number;
}) {
  const [m, setM] = useState<Mode>(mode);
  const [logEC50B, setLogEC50B] = useState(1);
  const [emaxB, setEmaxB] = useState(100);
  const [logAnt, setLogAnt] = useState(1); // log10([B]/K_B)
  const [ia, setIa] = useState(0.4);
  const box: [number, number, number, number] = [30, 12, 312, 178];
  const X: [number, number] = [-3, 4];
  const sx = scale(X, [box[0], box[2]]);
  const sy = scale([0, 110], [box[3], box[1]]);
  const E = (logD: number, logEC: number, emax: number) => emax / (1 + Math.pow(10, hill * (logEC - logD)));
  const curve = (f: (l: number) => number) => {
    const pts: [number, number][] = [];
    for (let i = 0; i <= 200; i++) { const l = X[0] + ((X[1] - X[0]) * i) / 200; pts.push([sx(l), sy(f(l))]); }
    return pathOf(pts);
  };
  const ratio = Math.pow(10, logAnt);
  const curves: { d: string; label: string; ec?: number; emax?: number }[] = [];
  curves.push({ d: curve((l) => E(l, 0, 100)), label: m === 'agonists' ? 'Drug A (full agonist)' : 'agonist alone', ec: 0, emax: 100 });
  if (m === 'agonists') curves.push({ d: curve((l) => E(l, logEC50B, emaxB)), label: `Drug B`, ec: logEC50B, emax: emaxB });
  if (m === 'competitive') curves.push({ d: curve((l) => E(l, Math.log10(1 + ratio), 100)), label: '+ competitive antagonist', ec: Math.log10(1 + ratio), emax: 100 });
  if (m === 'noncompetitive') curves.push({ d: curve((l) => E(l, 0, 100 / (1 + ratio))), label: '+ noncompetitive antagonist', ec: 0, emax: 100 / (1 + ratio) });
  if (m === 'partial') {
    // operational-style occupancy model: partial agonist P at fixed occupancy-equivalent conc (=K_P, 50% occupancy alone)
    const pConc = 3; // [P]/K_P
    curves.push({
      d: curve((l) => { const a = Math.pow(10, l); const occA = a / (1 + a + pConc); const occP = pConc / (1 + a + pConc); return 100 * occA + 100 * ia * occP; }),
      label: `+ partial agonist (IA ${ia.toFixed(2)})`,
    });
    curves.push({ d: curve((l) => E(l, 0, 100 * ia)), label: 'partial agonist alone (its own curve)' });
  }
  return (
    <div>
      <Stage w={320} h={200} label="Log dose-response curves">
        <line x1={box[0]} x2={box[2]} y1={sy(50)} y2={sy(50)} stroke="var(--grid)" strokeDasharray="3 3" />
        <Axes x={X} y={[0, 110]} box={box} xLabel="log [drug]" yLabel="% max response" grid={false} />
        {curves.map((c, i) => (
          <g key={i}>
            <path d={c.d} fill="none" stroke={C[i]} strokeWidth={2} strokeDasharray={m === 'partial' && i === 2 ? '4 3' : undefined} />
            {c.ec !== undefined && c.emax !== undefined && c.ec >= X[0] && c.ec <= X[1] && (
              <g>
                <line x1={sx(c.ec)} x2={sx(c.ec)} y1={sy(c.emax / 2)} y2={box[3]} stroke={C[i]} strokeDasharray="2 2" />
                <circle cx={sx(c.ec)} cy={sy(c.emax / 2)} r={2.5} fill={C[i]} />
              </g>
            )}
            <text x={box[0] + 4} y={box[1] + 9 + i * 10} fontSize="8" fill={C[i]}>{c.label}</text>
          </g>
        ))}
        {m === 'agonists' && <text x={box[2]} y={box[3] - 4} textAnchor="end" fontSize="8" fill="var(--muted)">dots = EC50 (half of that drug's own Emax)</text>}
        {m === 'competitive' && <text x={box[2]} y={box[3] - 4} textAnchor="end" fontSize="8" fill="var(--muted)">dose ratio = {(1 + ratio).toFixed(1)}×</text>}
      </Stage>
      <Controls>
        {modes.length > 1 && modes.map((md) => <Btn key={md} active={m === md} onClick={() => setM(md)}>{md === 'agonists' ? 'Potency vs efficacy' : md === 'competitive' ? 'Competitive' : md === 'noncompetitive' ? 'Noncompetitive' : 'Partial agonist'}</Btn>)}
        {m === 'agonists' && <Slider label="B: log EC50 (potency)" min={-2} max={3} step={0.1} value={logEC50B} onChange={setLogEC50B} />}
        {m === 'agonists' && <Slider label="B: Emax % (efficacy)" min={10} max={100} step={5} value={emaxB} onChange={setEmaxB} format={(v) => v.toFixed(0)} />}
        {(m === 'competitive' || m === 'noncompetitive') && <Slider label="antagonist log([B]/K_B)" min={-1} max={2.5} step={0.1} value={logAnt} onChange={setLogAnt} />}
        {m === 'partial' && <Slider label="intrinsic activity" min={0} max={1} step={0.05} value={ia} onChange={setIa} />}
      </Controls>
    </div>
  );
}
