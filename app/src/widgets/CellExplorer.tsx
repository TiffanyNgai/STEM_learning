import { useState, type ReactNode } from 'react';
import { Btn, Controls, Stage } from './_kit';

/**
 * Tappable cartoon of a eukaryotic cell. Tap an organelle (or its chip) to highlight it and read what it does.
 * props: { kind?: 'animal' | 'plant' (default 'animal'), toggle?: boolean (show animal/plant switch, default true),
 *          highlight?: string (organelle id selected at start: nucleus, nucleolus, rer, ser, golgi, mito, lyso,
 *          ribosome, membrane, cytoplasm, centrosome, vesicle, wall, vacuole, chloroplast) }
 */
type Kind = 'animal' | 'plant';
interface Org { id: string; name: string; desc: string; in: Kind[]; lx: Record<Kind, [number, number]>; draw: (k: Kind) => ReactNode }

const zig = (x: number, y: number, w: number) => `M${x - w},${y} l${w / 4},-4 l${w / 4},8 l${w / 4},-8 l${w / 4},8 l${w / 4},-8 l${w / 4},8 l${w / 4},-8 l${w / 4},4`;
const mito = (x: number, y: number, rot: number, key: string) => (
  <g key={key} transform={`rotate(${rot} ${x} ${y})`}>
    <ellipse cx={x} cy={y} rx={17} ry={8} fill="var(--c3)" fillOpacity={0.35} stroke="var(--c3)" strokeWidth={1.5} />
    <path d={zig(x, y, 13)} fill="none" stroke="var(--c3)" strokeWidth={1} />
  </g>
);
const chloro = (x: number, y: number, rot: number, key: string) => (
  <g key={key} transform={`rotate(${rot} ${x} ${y})`}>
    <ellipse cx={x} cy={y} rx={17} ry={9} fill="var(--c1)" fillOpacity={0.35} stroke="var(--c1)" strokeWidth={1.5} />
    {[-9, -3, 3, 9].map((d) => <rect key={d} x={x + d - 2} y={y - 4} width={4} height={8} rx={1} fill="var(--c1)" />)}
  </g>
);
const P = (k: Kind, a: [number, number], p: [number, number]) => (k === 'animal' ? a : p);

const ORGS: Org[] = [
  { id: 'cytoplasm', name: 'Cytoplasm (cytosol)', in: ['animal', 'plant'], lx: { animal: [40, 112], plant: [30, 112] },
    desc: 'Everything inside the membrane except the nucleus. The watery cytosol is packed with proteins (~20–30% by mass) and is where many reactions, including glycolysis and most protein synthesis, happen.',
    draw: () => null },
  { id: 'membrane', name: 'Plasma membrane', in: ['animal', 'plant'], lx: { animal: [160, 7], plant: [160, 26] },
    desc: 'A ~5 nm thick phospholipid bilayer with embedded proteins. It is selectively permeable: it decides what enters and leaves the cell.',
    draw: (k) => k === 'animal'
      ? <ellipse cx={160} cy={110} rx={150} ry={98} fill="none" stroke="var(--c2)" strokeWidth={3} />
      : <rect x={17} y={17} width={286} height={186} rx={8} fill="none" stroke="var(--c2)" strokeWidth={2} /> },
  { id: 'wall', name: 'Cell wall', in: ['plant'], lx: { animal: [0, 0], plant: [160, 14] },
    desc: 'A rigid layer outside the membrane, made mainly of cellulose in plants. It resists the internal water pressure (turgor) that keeps plants upright. Animal cells have none.',
    draw: () => <rect x={8} y={8} width={304} height={204} rx={12} fill="none" stroke="var(--c1)" strokeWidth={6} strokeOpacity={0.7} /> },
  { id: 'nucleus', name: 'Nucleus', in: ['animal', 'plant'], lx: { animal: [150, 63], plant: [66, 35] },
    desc: 'Holds the cell’s DNA (its genome), wrapped in a double membrane — the nuclear envelope — perforated by nuclear pores. Genes are transcribed into RNA here.',
    draw: (k) => { const [x, y, r] = k === 'animal' ? [150, 105, 36] : [66, 66, 26];
      return <g><circle cx={x} cy={y} r={r} fill="var(--c4)" fillOpacity={0.2} stroke="var(--c4)" strokeWidth={2.5} strokeDasharray="10 2" /></g>; } },
  { id: 'nucleolus', name: 'Nucleolus', in: ['animal', 'plant'], lx: { animal: [158, 123], plant: [70, 84] },
    desc: 'A dense region inside the nucleus (not membrane-bound) where ribosomal RNA is made and ribosome subunits are assembled.',
    draw: (k) => { const [x, y] = P(k, [158, 100], [70, 62]); return <circle cx={x} cy={y} r={k === 'animal' ? 11 : 8} fill="var(--c4)" fillOpacity={0.7} />; } },
  { id: 'rer', name: 'Rough ER', in: ['animal', 'plant'], lx: { animal: [92, 52], plant: [118, 40] },
    desc: 'Endoplasmic reticulum studded with ribosomes. Proteins destined for membranes, secretion or lysosomes are made here and threaded into its interior to fold.',
    draw: (k) => { const pts = k === 'animal' ? [[104, 60], [96, 54], [88, 48]] : [[100, 46], [106, 40], [112, 34]];
      return <g>{pts.map(([x, y], i) => { const d = k === 'animal' ? `M${x + 6},${y + 6} Q${x - 24},${y + 50} ${x + 8},${y + 96}` : `M${x - 30},${y + 64} Q${x + 14},${y + 30} ${x - 18},${y - 8}`;
        return <g key={i}><path d={d} fill="none" stroke="var(--c6)" strokeWidth={3} />
          <path d={d} fill="none" stroke="var(--fg)" strokeWidth={2.5} strokeDasharray="1 5" strokeLinecap="round" /></g>; })}</g>; } },
  { id: 'ser', name: 'Smooth ER', in: ['animal', 'plant'], lx: { animal: [70, 160], plant: [154, 180] },
    desc: 'ER without ribosomes: makes lipids (including membrane phospholipids and steroids), detoxifies drugs in liver cells and stores Ca²⁺ ions.',
    draw: (k) => { const [x, y] = P(k, [70, 172], [150, 190]); return <path d={`M${x - 20},${y} q8,-10 16,0 t16,0 t16,0`} fill="none" stroke="var(--c6)" strokeWidth={3} />; } },
  { id: 'golgi', name: 'Golgi apparatus', in: ['animal', 'plant'], lx: { animal: [232, 68], plant: [40, 128] },
    desc: 'A stack of flattened membrane sacs that receives proteins from the ER, modifies them (e.g. adds sugar chains), sorts them and ships them off in vesicles — the cell’s post office.',
    draw: (k) => { const [x, y] = P(k, [230, 90], [40, 108]);
      return <g>{[0, 6, 12, 18].map((d) => <path key={d} d={`M${x - 22 + d / 3},${y + d} Q${x},${y + d + 9} ${x + 22 - d / 3},${y + d}`} fill="none" stroke="var(--c5)" strokeWidth={3.5} strokeLinecap="round" />)}</g>; } },
  { id: 'vesicle', name: 'Vesicles', in: ['animal', 'plant'], lx: { animal: [272, 130], plant: [20, 146] },
    desc: 'Small membrane bubbles that carry cargo between compartments and to the cell surface, where they can fuse and release contents outside (exocytosis).',
    draw: (k) => <g>{(k === 'animal' ? [[260, 118], [270, 100], [250, 136]] : [[66, 130], [58, 140]]).map(([x, y], i) => <circle key={i} cx={x} cy={y} r={4} fill="var(--c5)" fillOpacity={0.3} stroke="var(--c5)" strokeWidth={1.2} />)}</g> },
  { id: 'mito', name: 'Mitochondria', in: ['animal', 'plant'], lx: { animal: [70, 132], plant: [180, 36] },
    desc: 'Double-membraned organelles that make most of the cell’s ATP by aerobic respiration. The folded inner membrane (cristae) holds the electron transport chain. They carry their own small genome.',
    draw: (k) => <g>{(k === 'animal' ? [[70, 150, -20], [240, 155, 25], [115, 38, 10]] : [[180, 26, 0], [92, 190, 0]]).map(([x, y, r], i) => mito(x, y, r, 'm' + i))}</g> },
  { id: 'chloroplast', name: 'Chloroplasts', in: ['plant'], lx: { animal: [0, 0], plant: [262, 30] },
    desc: 'Where photosynthesis happens. Inside, stacks of thylakoid membranes (grana) hold chlorophyll that captures light energy to build sugar from CO₂ and water. Like mitochondria, they have their own DNA.',
    draw: () => <g>{[[44, 160, 20], [262, 26, 0], [292, 120, 90], [250, 192, 0], [200, 192, 0]].map(([x, y, r], i) => chloro(x, y, r, 'c' + i))}</g> },
  { id: 'vacuole', name: 'Central vacuole', in: ['plant'], lx: { animal: [0, 0], plant: [202, 112] },
    desc: 'A huge water-filled sac that can fill most of a plant cell’s volume. It stores ions, sugars and pigments, and its water pressure pushes the cell against its wall (turgor).',
    draw: () => <rect x={124} y={44} width={156} height={130} rx={30} fill="var(--c2)" fillOpacity={0.15} stroke="var(--c2)" strokeWidth={1.5} /> },
  { id: 'lyso', name: 'Lysosomes', in: ['animal'], lx: { animal: [205, 188], plant: [0, 0] },
    desc: 'Acidic bags of digestive enzymes that break down worn-out organelles, engulfed bacteria and macromolecules for recycling. (Plants use their vacuole for much of this.)',
    draw: () => <g>{[[200, 170], [48, 90]].map(([x, y], i) => <g key={i}><circle cx={x} cy={y} r={8} fill="var(--c5)" fillOpacity={0.5} stroke="var(--c5)" />{[-3, 2].map((d) => <circle key={d} cx={x + d} cy={y + d / 2} r={1.6} fill="var(--fg)" />)}</g>)}</g> },
  { id: 'centrosome', name: 'Centrosome', in: ['animal'], lx: { animal: [200, 40], plant: [0, 0] },
    desc: 'The main microtubule-organising centre, with a pair of centrioles at right angles. It nucleates the cytoskeleton and, during division, the spindle. Most plant cells lack centrioles.',
    draw: () => <g><rect x={194} y={50} width={14} height={5} rx={1.5} fill="var(--c4)" /><rect x={210} y={45} width={5} height={14} rx={1.5} fill="var(--c4)" /></g> },
  { id: 'ribosome', name: 'Ribosomes', in: ['animal', 'plant'], lx: { animal: [262, 74], plant: [98, 142] },
    desc: 'Molecular machines (RNA + protein, ~25 nm) that build proteins by reading mRNA. Free ribosomes make cytosolic proteins; ER-bound ones make proteins for export or membranes. Not membrane-bound.',
    draw: (k) => <g>{(k === 'animal' ? [[250, 70], [262, 64], [270, 80], [205, 135], [215, 143], [110, 175], [120, 182], [280, 140]] : [[90, 120], [100, 128], [108, 150], [30, 60], [36, 186]]).map(([x, y], i) => <circle key={i} cx={x} cy={y} r={2} fill="var(--fg)" />)}</g> },
];

export default function CellExplorer({ kind = 'animal', toggle = true, highlight = '' }: { kind?: Kind; toggle?: boolean; highlight?: string }) {
  const [k, setK] = useState<Kind>(kind);
  const [sel, setSel] = useState(highlight);
  const orgs = ORGS.filter((o) => o.in.includes(k));
  const cur = orgs.find((o) => o.id === sel);
  return (
    <div>
      <Stage w={320} h={220} label={`Diagram of ${k} cell`}>
        <g onClick={() => setSel('cytoplasm')} style={{ cursor: 'pointer' }}>
          {k === 'animal' ? <ellipse cx={160} cy={110} rx={150} ry={98} fill="var(--surface)" />
            : <rect x={17} y={17} width={286} height={186} rx={8} fill="var(--surface)" />}
        </g>
        {orgs.map((o) => (
          <g key={o.id} onClick={(e) => { e.stopPropagation(); setSel(o.id === sel ? '' : o.id); }}
            style={{ cursor: 'pointer', transition: 'opacity .25s' }} opacity={!sel || sel === o.id ? 1 : 0.25}>
            {o.draw(k)}
          </g>
        ))}
        {cur && (
          <g pointerEvents="none">
            <rect x={Math.min(250, Math.max(4, cur.lx[k][0] - 44))} y={cur.lx[k][1] - 9} width={88} height={13} rx={6} fill="var(--fg)" opacity={0.85} />
            <text x={Math.min(294, Math.max(48, cur.lx[k][0]))} y={cur.lx[k][1]} textAnchor="middle" fontSize={9} fontWeight={700} fill="var(--surface)">{cur.name.split(' (')[0]}</text>
          </g>
        )}
      </Stage>
      <div className="w-muted" style={{ minHeight: '4.5em', padding: '4px 6px', fontSize: '0.9em' }}>
        {cur ? <><b style={{ color: 'var(--fg)' }}>{cur.name}.</b> {cur.desc}</> : `Tap any part of the ${k} cell (or a button below) to learn what it does.`}
      </div>
      <Controls>
        {toggle && <Btn onClick={() => { setK(k === 'animal' ? 'plant' : 'animal'); setSel(''); }}>{k === 'animal' ? '🌿 Show plant cell' : '🐾 Show animal cell'}</Btn>}
        {orgs.map((o) => <Btn key={o.id} active={sel === o.id} onClick={() => setSel(o.id === sel ? '' : o.id)}>{o.name.split(' (')[0]}</Btn>)}
      </Controls>
    </div>
  );
}
