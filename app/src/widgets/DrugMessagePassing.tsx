/**
 * Message passing on a small molecular graph, one step at a time.
 * Every atom starts with a one-hot feature vector h⁰ = [is C, is N, is O], drawn as a stacked bar under the atom.
 * One step (all atoms in parallel): each atom sums the vectors of its bonded neighbours (the message m) and
 * updates h ← normalise(h + m) (entries rescaled to sum to 1, a toy stand-in for a learned update network).
 * Messages are animated as dots travelling along every bond in both directions. Tap an atom: the atoms within
 * t bonds (its receptive field after t steps) are ringed, and its vector is shown below. The readout row shows
 * the mean of all atom vectors, a permutation-invariant summary of the whole molecule.
 * props: { molecule?: 'paracetamol'|'aspirin'|'ibuprofen' (default 'paracetamol'), steps?: number (initial t, 0–4, default 0),
 *          selected?: number (initially tapped atom index, default 3) }
 */
import { useMemo, useState } from 'react';
import { Stage, Controls, Btn, useFrame, prefersReducedMotion } from './_kit';
import { DRUG_MOLS, fitBox, topoDist, ELC } from './_drugMols';

const ELS = ['C', 'N', 'O'];
const TMAX = 4;

function run(key: string, T: number) {
  const m = DRUG_MOLS[key];
  const nb: number[][] = m.atoms.map(() => []);
  m.bonds.forEach(([a, b]) => { nb[a].push(b); nb[b].push(a); });
  let h: number[][] = m.atoms.map(([el]) => ELS.map((e) => (e === el ? 1 : 0)));
  const hist = [h];
  for (let t = 0; t < T; t++) {
    h = h.map((hv, v) => {
      const s = hv.map((x, k) => x + nb[v].reduce((acc, u) => acc + h[u][k], 0));
      const z = s.reduce((a, b) => a + b, 0);
      return s.map((x) => x / z);
    });
    hist.push(h);
  }
  return hist;
}

function Stack({ x, y, w, hgt, v }: { x: number; y: number; w: number; hgt: number; v: number[] }) {
  let acc = 0;
  return (
    <g>
      {v.map((f, k) => { const r = <rect key={k} x={x + acc * w} y={y} width={Math.max(0, f * w)} height={hgt} fill={ELC[ELS[k]]} opacity={0.85} />; acc += f; return r; })}
      <rect x={x} y={y} width={w} height={hgt} fill="none" stroke="var(--muted)" strokeWidth={0.4} />
    </g>
  );
}

export default function DrugMessagePassing({ molecule = 'paracetamol', steps = 0, selected = 3 }: {
  molecule?: string; steps?: number; selected?: number;
}) {
  const [key, setKey] = useState(DRUG_MOLS[molecule] ? molecule : 'paracetamol');
  const [t, setT] = useState(Math.max(0, Math.min(TMAX, Math.round(steps))));
  const [sel, setSel] = useState(Math.max(0, selected));
  const [anim, setAnim] = useState(-1); // progress 0..1 of message animation, -1 = idle
  const m = DRUG_MOLS[key];
  const hist = useMemo(() => run(key, TMAX), [key]);
  const D = useMemo(() => topoDist(m), [m]);
  const s = Math.min(sel, m.atoms.length - 1);
  const { px, py } = fitBox(m, [0, 20, 320, 150], 30);

  useFrame((dt) => {
    if (anim < 0) return;
    const n = anim + dt / 0.9;
    if (n >= 1) { setAnim(-1); setT(Math.min(TMAX, t + 1)); } else setAnim(n);
  }, anim >= 0);

  const step = () => {
    if (t >= TMAX || anim >= 0) return;
    if (prefersReducedMotion()) setT(t + 1); else setAnim(0);
  };
  const h = hist[t];
  const field = m.atoms.map((_, i) => D[s][i] <= t);
  const nField = field.filter(Boolean).length;
  const mean = ELS.map((_, k) => h.reduce((a, v) => a + v[k], 0) / h.length);
  const pct = (v: number[]) => v.map((x, k) => `${ELS[k]} ${(100 * x).toFixed(0)}%`).join(' · ');

  return (
    <div>
      <Stage w={320} h={232} label={`Message passing on ${m.name}, step ${t}`}>
        <text x={6} y={12} fontSize="9" fill="var(--fg)" fontWeight="bold">step t = {t}</text>
        <text x={314} y={12} fontSize="8.5" fill="var(--muted)" textAnchor="end">
          atom {s} ({m.atoms[s][0]}) sees {nField} of {m.atoms.length} atoms (≤ {t} bonds)
        </text>
        {m.bonds.map(([a, b, o], i) => {
          const [x1, y1, x2, y2] = [px(m.atoms[a][1]), py(m.atoms[a][2]), px(m.atoms[b][1]), py(m.atoms[b][2])];
          const dx = y2 - y1, dy = x1 - x2, L = Math.hypot(dx, dy) || 1;
          return (
            <g key={i} stroke="var(--muted)" strokeWidth={1.3}>
              <line x1={x1} y1={y1} x2={x2} y2={y2} />
              {o === 2 && <line x1={x1 + (2.6 * dx) / L} y1={y1 + (2.6 * dy) / L} x2={x2 + (2.6 * dx) / L} y2={y2 + (2.6 * dy) / L} />}
            </g>
          );
        })}
        {anim >= 0 && m.bonds.flatMap(([a, b], i) => [[a, b], [b, a]].map(([u, v], j) => {
          const f = 0.15 + 0.7 * anim;
          const x = px(m.atoms[u][1]) + f * (px(m.atoms[v][1]) - px(m.atoms[u][1]));
          const y = py(m.atoms[u][2]) + f * (py(m.atoms[v][2]) - py(m.atoms[u][2]));
          return <circle key={`${i}-${j}`} cx={x} cy={y} r={2.4} fill="var(--c3)" />;
        }))}
        {m.atoms.map(([el, x, y], i) => (
          <g key={i} onClick={() => setSel(i)} style={{ cursor: 'pointer' }}>
            {field[i] && <circle cx={px(x)} cy={py(y)} r={10.5} fill="var(--c3)" opacity={i === s ? 0.45 : 0.2} />}
            <circle cx={px(x)} cy={py(y)} r={7} fill="var(--surface)" stroke={i === s ? 'var(--c3)' : 'var(--muted)'} strokeWidth={i === s ? 2 : 0.6} />
            <text x={px(x)} y={py(y) + 3} fontSize="8.5" textAnchor="middle" fill={ELC[el]} fontWeight="bold">{el}</text>
            <Stack x={px(x) - 9} y={py(y) + 9} w={18} hgt={3.5} v={h[i]} />
          </g>
        ))}
        <g fontSize="8.5" fill="var(--fg)">
          <text x={6} y={176}>atom {s} vector h:</text>
          <Stack x={96} y={169} w={120} hgt={8} v={h[s]} />
          <text x={6} y={188} fill="var(--muted)">{pct(h[s])}</text>
          <text x={6} y={206}>readout (mean of all h):</text>
          <Stack x={122} y={199} w={120} hgt={8} v={mean} />
          <text x={6} y={218} fill="var(--muted)">{pct(mean)} · same for any atom numbering</text>
        </g>
        <g fontSize="8">
          {ELS.map((e, k) => (
            <g key={e}><rect x={252 + k * 22} y={170} width={7} height={7} fill={ELC[e]} opacity={0.85} /><text x={261 + k * 22} y={177} fill="var(--muted)">{e}</text></g>
          ))}
        </g>
      </Stage>
      <Controls>
        <Btn onClick={step}>{t >= TMAX ? 'max steps' : 'Pass messages ▶'}</Btn>
        <Btn onClick={() => { setT(0); setAnim(-1); }}>Reset</Btn>
        {Object.keys(DRUG_MOLS).map((k) => (
          <Btn key={k} active={k === key} onClick={() => { setKey(k); setT(0); setAnim(-1); setSel(Math.min(sel, DRUG_MOLS[k].atoms.length - 1)); }}>{DRUG_MOLS[k].name}</Btn>
        ))}
      </Controls>
    </div>
  );
}
