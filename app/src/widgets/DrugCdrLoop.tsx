import { useState } from 'react';
import { Btn, C, Controls, Slider, Stage, pathOf } from './_kit';

/**
 * The antigen-binding end of an antibody Fv, and why CDR-H3 is the hard one.
 * View 'fv': the VH (left) and VL (right) domains as two β-sandwich blocks, with their three
 * hypervariable loops each (H1, H2, H3 and L1, L2, L3) drawn on top. The H3 slider changes the
 * CDR-H3 length from 5 to 22 residues, which changes how far the loop protrudes; "conformation"
 * cycles three different backbone paths for the SAME length — the ambiguity a predictor must resolve.
 * The other five loops keep one of a small number of canonical shapes and barely move.
 * View 'error': an illustrative sketch of backbone RMSD against CDR-H3 length — the five canonical
 * loops stay near 1 Å while H3 degrades with length. The curve is a teaching cartoon, not measured
 * data, though the ordering (H3 much worse than the rest) is what benchmarks consistently report.
 * props: { h3Length?: number (5–22, default 12), view?: 'fv'|'error' (default 'fv'),
 *          conformation?: number (0–2, default 0), showAntigen?: boolean (default true) }
 */
const h3Rmsd = (L: number) => 1.1 + 0.145 * Math.max(0, L - 5);

function loopPath(x0: number, x1: number, h: number, bend: number): [number, number][] {
  const pts: [number, number][] = [];
  const n = 16;
  for (let k = 0; k <= n; k++) {
    const u = k / n;
    const x = x0 + u * (x1 - x0) + bend * 7 * Math.sin(2 * Math.PI * u);
    const y = 96 - h * Math.sin(Math.PI * u) - bend * 4 * Math.sin(3 * Math.PI * u);
    pts.push([x, y]);
  }
  return pts;
}

export default function DrugCdrLoop({ h3Length = 12, view = 'fv', conformation = 0, showAntigen = true }: {
  h3Length?: number; view?: 'fv' | 'error'; conformation?: number; showAntigen?: boolean;
}) {
  const [L, setL] = useState(Math.max(5, Math.min(22, h3Length)));
  const [v, setV] = useState(view);
  const [cf, setCf] = useState(conformation % 3);
  const [ag, setAg] = useState(showAntigen);

  const h3h = 10 + 2.1 * (L - 5);
  const bend = [0, 1, -1][cf];
  const others: [string, number, number, number][] = [
    ['H1', 56, 80, 16], ['H2', 92, 112, 13], ['L1', 206, 232, 17], ['L2', 244, 264, 12], ['L3', 170, 190, 14],
  ];

  if (v === 'error') {
    const xs = Array.from({ length: 18 }, (_, k) => 5 + k);
    const sx = (x: number) => 40 + ((x - 5) / 17) * 250;
    const sy = (r: number) => 150 - (r / 5) * 118;
    return (
      <div>
        <Stage w={320} h={200} label="Illustrative backbone RMSD against CDR-H3 length">
          <line x1={40} y1={150} x2={300} y2={150} stroke="var(--fg)" strokeWidth={0.8} />
          <line x1={40} y1={28} x2={40} y2={150} stroke="var(--fg)" strokeWidth={0.8} />
          {[0, 1, 2, 3, 4, 5].map((r) => (
            <g key={r}>
              <line x1={40} x2={300} y1={sy(r)} y2={sy(r)} stroke="var(--grid)" strokeWidth={0.5} />
              <text x={36} y={sy(r) + 3} fontSize="7" textAnchor="end" fill="var(--muted)">{r}</text>
            </g>
          ))}
          <path d={pathOf(xs.map((x) => [sx(x), sy(h3Rmsd(x))]))} fill="none" stroke={C[4]} strokeWidth={2} />
          <path d={pathOf(xs.map((x) => [sx(x), sy(0.85)]))} fill="none" stroke={C[1]} strokeWidth={2} />
          <path d={pathOf(xs.map((x) => [sx(x), sy(0.55)]))} fill="none" stroke={C[5]} strokeWidth={1.6} strokeDasharray="4 3" />
          <circle cx={sx(L)} cy={sy(h3Rmsd(L))} r={4} fill={C[4]} stroke="var(--surface)" />
          <g fontSize="7.5">
            <text x={296} y={sy(h3Rmsd(22)) - 6} textAnchor="end" fill={C[4]}>CDR-H3</text>
            <text x={296} y={sy(0.85) - 5} textAnchor="end" fill={C[1]}>other five CDRs</text>
            <text x={296} y={sy(0.55) - 4} textAnchor="end" fill={C[5]}>framework</text>
            <text x={170} y={166} textAnchor="middle" fill="var(--fg)">CDR-H3 length (residues)</text>
            <text x={44} y={24} fill="var(--fg)">backbone RMSD (Å)</text>
            <text x={6} y={182} fill="var(--fg)">H3 = {L} residues → ≈ {h3Rmsd(L).toFixed(1)} Å in this cartoon.</text>
            <text x={6} y={194} fill="var(--muted)">Illustrative trend only; the ranking, not the numbers, is the point.</text>
          </g>
        </Stage>
        <Controls>
          <Slider label="CDR-H3 length" min={5} max={22} step={1} value={L} onChange={setL} format={(x) => `${x} aa`} />
          <Btn active={false} onClick={() => setV('fv')}>Fv view</Btn>
        </Controls>
      </div>
    );
  }

  return (
    <div>
      <Stage w={320} h={212} label={`Antibody Fv with a ${L}-residue CDR-H3`}>
        {ag && (
          <g>
            <path d="M20,16 H300 V40 Q200,44 170,58 Q140,44 20,40 Z" fill="var(--muted)" fillOpacity={0.18} stroke="var(--muted)" />
            <text x={160} y={32} fontSize="8" textAnchor="middle" fill="var(--muted)">antigen (epitope surface)</text>
          </g>
        )}
        <rect x={40} y={96} width={110} height={92} rx={10} fill={C[1]} fillOpacity={0.18} stroke={C[1]} />
        <rect x={166} y={96} width={110} height={92} rx={10} fill={C[5]} fillOpacity={0.18} stroke={C[5]} />
        {[0, 1, 2, 3].map((k) => (
          <g key={k}>
            <line x1={52 + k * 26} y1={110} x2={52 + k * 26} y2={178} stroke={C[1]} strokeWidth={2.5} strokeOpacity={0.45} />
            <line x1={178 + k * 26} y1={110} x2={178 + k * 26} y2={178} stroke={C[5]} strokeWidth={2.5} strokeOpacity={0.45} />
          </g>
        ))}
        <text x={95} y={200} fontSize="9" textAnchor="middle" fill={C[1]} fontWeight="700">VH</text>
        <text x={221} y={200} fontSize="9" textAnchor="middle" fill={C[5]} fontWeight="700">VL</text>
        {others.map(([name, x0, x1, h]) => (
          <g key={name}>
            <path d={pathOf(loopPath(x0, x1, h, 0))} fill="none"
              stroke={name[0] === 'H' ? C[1] : C[5]} strokeWidth={2.2} strokeLinejoin="round" />
            <text x={(x0 + x1) / 2} y={92 - h - 4} fontSize="7" textAnchor="middle" fill="var(--muted)">{name}</text>
          </g>
        ))}
        <path d={pathOf(loopPath(132, 168, h3h, bend))} fill="none" stroke={C[2]} strokeWidth={3} strokeLinejoin="round" />
        <text x={150} y={96 - h3h - 6} fontSize="8" textAnchor="middle" fill={C[2]} fontWeight="700">H3</text>
        <g fontSize="7.5">
          <text x={6} y={168} fill="var(--fg)">CDR-H3: {L} residues, conformation {cf + 1} of 3</text>
          <text x={6} y={180} fill="var(--muted)">Five loops are near-canonical. H3 sets length, shape and most contacts.</text>
        </g>
      </Stage>
      <Controls>
        <Slider label="CDR-H3 length" min={5} max={22} step={1} value={L} onChange={setL} format={(x) => `${x} aa`} />
        <Btn onClick={() => setCf((cf + 1) % 3)}>conformation</Btn>
        <Btn active={ag} onClick={() => setAg(!ag)}>antigen</Btn>
        <Btn onClick={() => setV('error')}>prediction error</Btn>
      </Controls>
    </div>
  );
}
