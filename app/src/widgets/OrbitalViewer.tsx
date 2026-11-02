import { useMemo, useRef, useState } from 'react';
import { Btn, Controls, PlayPause, Stage, rng, useFrame, prefersReducedMotion } from './_kit';

/**
 * Hydrogen-atom orbital viewer: a slice through the nucleus (the xz-plane) filled with dots, each dot one
 * simulated "position measurement" drawn with probability ∝ |ψ|². Dot colour = sign (phase) of ψ.
 * Nodes (where ψ = 0) can be overlaid: radial nodes as circles, angular nodes as lines.
 * props: { orbital?: '1s'|'2s'|'2p'|'3s'|'3p'|'3dz2'|'3dxz' (default '1s'),
 *          options?: same[] (buttons shown; default all), showNodes?: boolean (default true), dots?: number (default 1800),
 *          weightR2?: boolean (default false; when on, dots ∝ r²|ψ|², i.e. the radial-probability view that makes outer shells visible) }
 */
type Orb = { label: string; R: number; psi: (x: number, z: number) => number; radial: number[]; angular: number[] };
// ψ in units of the Bohr radius a0 (unnormalised — only the shape matters here). angular: line angles from +z axis (deg).
const ORBS: Record<string, Orb> = {
  '1s': { label: '1s', R: 4.5, psi: (x, z) => Math.exp(-Math.hypot(x, z)), radial: [], angular: [] },
  '2s': { label: '2s', R: 13, psi: (x, z) => { const r = Math.hypot(x, z); return (2 - r) * Math.exp(-r / 2); }, radial: [2], angular: [] },
  '2p': { label: '2pz', R: 12, psi: (x, z) => z * Math.exp(-Math.hypot(x, z) / 2), radial: [], angular: [90] },
  '3s': { label: '3s', R: 24, psi: (x, z) => { const r = Math.hypot(x, z); return (27 - 18 * r + 2 * r * r) * Math.exp(-r / 3); }, radial: [1.902, 7.098], angular: [] },
  '3p': { label: '3pz', R: 24, psi: (x, z) => { const r = Math.hypot(x, z); return (6 - r) * z * Math.exp(-r / 3); }, radial: [6], angular: [90] },
  '3dz2': { label: '3dz²', R: 22, psi: (x, z) => { const r = Math.hypot(x, z); return (3 * z * z - r * r) * Math.exp(-r / 3); }, radial: [], angular: [54.74, 125.26] },
  '3dxz': { label: '3dxz', R: 22, psi: (x, z) => x * z * Math.exp(-Math.hypot(x, z) / 3), radial: [], angular: [0, 90] },
};
const ALL = Object.keys(ORBS);

export default function OrbitalViewer({ orbital = '1s', options = ALL, showNodes = true, dots = 1800, weightR2 = false }: {
  orbital?: string; options?: string[]; showNodes?: boolean; dots?: number; weightR2?: boolean;
}) {
  const [w2, setW2] = useState(weightR2);
  const [key, setKey] = useState(ORBS[orbital] ? orbital : '1s');
  const [nodes, setNodes] = useState(showNodes);
  const [running, setRunning] = useState(!prefersReducedMotion());
  const o = ORBS[key];
  const pts = useRef<{ x: number; z: number; s: number }[]>([]);
  const gen = useRef(rng(11));
  const [, force] = useState(0);
  const max = useMemo(() => {
    let m = 0;
    for (let i = 0; i <= 120; i++) for (let j = 0; j <= 120; j++) {
      const x = -o.R + (2 * o.R * i) / 120, z = -o.R + (2 * o.R * j) / 120;
      const v = o.psi(x, z) ** 2 * (w2 ? x * x + z * z : 1); if (v > m) m = v;
    }
    return m * 1.05;
  }, [o, w2]);
  const sample = (k: number) => {
    const g = gen.current; let made = 0, tries = 0;
    while (made < k && tries < k * 400) {
      tries++;
      const x = (g.u() * 2 - 1) * o.R, z = (g.u() * 2 - 1) * o.R; const p = o.psi(x, z);
      if (g.u() * max < p * p * (w2 ? x * x + z * z : 1)) { pts.current.push({ x, z, s: Math.sign(p) }); made++; }
    }
  };
  useFrame(() => {
    if (pts.current.length >= dots) return;
    sample(Math.max(8, Math.round(dots / 90))); force((v) => v + 1);
  }, running);
  const choose = (k: string) => { setKey(k); pts.current = []; gen.current = rng(11); if (!running) setRunning(true); };
  const fill = () => { sample(dots - pts.current.length); force((v) => v + 1); };

  const cx = 160, cy = 100, half = 92; const k = half / o.R;
  const pos: string[] = [], neg: string[] = [];
  for (const p of pts.current) (p.s >= 0 ? pos : neg).push(`M${(cx + p.x * k).toFixed(1)},${(cy - p.z * k).toFixed(1)}h1.3v1.3h-1.3z`);
  const scaleA0 = o.R > 15 ? 5 : o.R > 6 ? 2 : 1;
  return (
    <div>
      <Stage w={320} h={200} label={`Probability-density slice of the hydrogen ${o.label} orbital`}>
        <rect x={cx - half} y={cy - half} width={2 * half} height={2 * half} fill="none" stroke="var(--grid)" />
        <path d={pos.join('')} fill="var(--c2)" />
        <path d={neg.join('')} fill="var(--c5)" />
        {nodes && o.radial.map((r) => (
          <circle key={r} cx={cx} cy={cy} r={r * k} fill="none" stroke="var(--fg)" strokeWidth={1} strokeDasharray="3 2" />
        ))}
        {nodes && o.angular.map((deg) => {
          const a = (deg * Math.PI) / 180; const dx = Math.sin(a) * half, dz = Math.cos(a) * half;
          return <line key={deg} x1={cx - dx} y1={cy + dz} x2={cx + dx} y2={cy - dz} stroke="var(--fg)" strokeWidth={1} strokeDasharray="3 2" />;
        })}
        <circle cx={cx} cy={cy} r={2.2} fill="var(--c3)" />
        <text x={8} y={16} fontSize="14" fontWeight="bold" fill="var(--fg)">{o.label}</text>
        <text x={8} y={30} fontSize="9" fill="var(--muted)">{pts.current.length} samples</text>
        <text x={8} y={42} fontSize="9" fill="var(--muted)">{w2 ? 'dots ∝ r²|ψ|²' : 'dots ∝ |ψ|²'}</text>
        <text x={8} y={150} fontSize="9" fill="var(--c2)">■ ψ &gt; 0</text>
        <text x={8} y={162} fontSize="9" fill="var(--c5)">■ ψ &lt; 0</text>
        {nodes && <text x={8} y={174} fontSize="9" fill="var(--fg)">- - node (ψ = 0)</text>}
        <text x={cx + half + 4} y={cy - half + 8} fontSize="9" fill="var(--muted)">z ↑</text>
        <line x1={cx + half - scaleA0 * k} x2={cx + half} y1={cy + half + 5} y2={cy + half + 5} stroke="var(--fg)" strokeWidth={1.5} />
        <text x={cx + half + 3} y={cy + half + 8} fontSize="9" fill="var(--fg)">{scaleA0} a₀</text>
      </Stage>
      <Controls>
        {options.filter((x) => ORBS[x]).map((x) => <Btn key={x} active={x === key} onClick={() => choose(x)}>{ORBS[x].label}</Btn>)}
        <Btn active={w2} onClick={() => { setW2(!w2); pts.current = []; setRunning(true); }}>×r²</Btn>
        <Btn active={nodes} onClick={() => setNodes(!nodes)}>Nodes</Btn>
        <PlayPause running={running} set={setRunning} />
        <Btn onClick={fill}>Fill</Btn>
      </Controls>
    </div>
  );
}
