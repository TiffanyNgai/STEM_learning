import { useMemo, useState } from 'react';
import { Btn, C, Controls, Slider, Stage, pathOf, prefersReducedMotion, rng, useFrame } from './_kit';

/**
 * A protein backbone being denoised, RFdiffusion-style. The "clean" structure x_0 is a schematic
 * three-helix bundle of 84 Cα positions drawn in 2D; the noisy state is
 *     x_t = sqrt(ᾱ_t)·x_0 + sqrt(1 − ᾱ_t)·ε,   ᾱ_t = cos²(πt/2),
 * with ε a fixed Gaussian cloud, so t = 1 is pure noise and t = 0 is the design. Real RFdiffusion
 * diffuses residue *frames* (a translation and a rotation per residue, rotations on SO(3)) in 3D and
 * runs a fine-tuned RoseTTAFold as the denoiser; this is a 2D cartoon of what that looks like.
 * Modes:
 *  - 'unconditional': the whole chain is generated from noise.
 *  - 'motif': a 16-residue motif (orange) is held at its given coordinates at every step and the rest
 *    of the chain is built around it — motif scaffolding.
 *  - 'binder': a target protein (grey) with two hotspot residues (red) is fixed, and the chain is
 *    denoised against its surface — binder design.
 * Geometry and trajectories are illustrative, not the output of a trained model.
 * props: { mode?: 'unconditional'|'motif'|'binder' (default 'unconditional'), t?: number (0–1, default 1),
 *          animate?: boolean (default true), seed?: number (default 3) }
 */
const M0 = 32, M1 = 48;

const CLEAN: [number, number][] = (() => {
  const out: [number, number][] = [];
  const helix = (cx: number, y0: number, y1: number, n: number) => {
    for (let k = 0; k < n; k++) out.push([cx + 5 * Math.sin(k * 2.0), y0 + (k / (n - 1)) * (y1 - y0)]);
  };
  const arc = (a: [number, number], b: [number, number], n: number, dy: number) => {
    for (let k = 1; k <= n; k++) {
      const u = k / (n + 1);
      out.push([a[0] + u * (b[0] - a[0]), a[1] + u * (b[1] - a[1]) + dy * Math.sin(Math.PI * u)]);
    }
  };
  helix(80, 132, 48, 24);
  arc([80, 48], [140, 48], 6, -18);
  helix(140, 48, 132, 24);
  arc([140, 132], [200, 132], 6, 18);
  helix(200, 132, 48, 24);
  return out;
})();

const NOTE: Record<string, string> = {
  unconditional: 'Unconditional: every residue is generated from noise.',
  motif: 'Motif scaffolding: the orange motif never moves; the scaffold grows around it.',
  binder: 'Binder design: the grey target and its red hotspots are fixed inputs.',
};

export default function DrugBackboneDenoise({ mode = 'unconditional', t = 1, animate = true, seed = 3 }: {
  mode?: 'unconditional' | 'motif' | 'binder'; t?: number; animate?: boolean; seed?: number;
}) {
  const [m, setM] = useState(mode);
  const [tt, setTt] = useState(Math.max(0, Math.min(1, t)));
  const [sd, setSd] = useState(seed);
  const [run, setRun] = useState(animate && !prefersReducedMotion());
  useFrame((dt) => setTt((x) => (x - dt * 0.22 < 0 ? 1 : x - dt * 0.22)), run);

  const noise = useMemo(() => {
    const g = rng(sd);
    return CLEAN.map(() => [160 + 46 * g.normal(), 92 + 28 * g.normal()] as [number, number]);
  }, [sd]);

  const abar = Math.cos((Math.PI * tt) / 2) ** 2;
  const a = Math.sqrt(abar), b = Math.sqrt(1 - abar);
  const dx = m === 'binder' ? -46 : 0;

  const pos: [number, number][] = CLEAN.map((p, i) => {
    const base: [number, number] = [p[0] + dx, p[1]];
    if (m === 'motif' && i >= M0 && i < M1) return base;
    return [a * base[0] + b * noise[i][0], a * base[1] + b * noise[i][1]];
  });

  const seg = (i0: number, i1: number) => pathOf(pos.slice(i0, i1));
  const folded = tt < 0.18;

  return (
    <div>
      <Stage w={320} h={212} label={`Backbone denoising, ${m} mode, t = ${tt.toFixed(2)}`}>
        {m === 'binder' && (
          <g>
            <ellipse cx={258} cy={92} rx={48} ry={68} fill="var(--muted)" fillOpacity={0.18} stroke="var(--muted)" />
            <text x={258} y={168} fontSize="8" textAnchor="middle" fill="var(--muted)">target (fixed)</text>
            <circle cx={214} cy={74} r={4} fill={C[4]} />
            <circle cx={214} cy={106} r={4} fill={C[4]} />
            <text x={236} y={92} fontSize="7.5" textAnchor="middle" fill={C[4]}>hotspots</text>
          </g>
        )}
        <path d={seg(0, CLEAN.length)} fill="none" stroke={C[1]} strokeWidth={folded ? 2 : 1.1}
          strokeOpacity={0.5 + 0.4 * abar} strokeLinejoin="round" />
        {m === 'motif' && <path d={seg(M0, M1)} fill="none" stroke={C[2]} strokeWidth={3} strokeLinejoin="round" />}
        {pos.map((p, i) => {
          const isMotif = m === 'motif' && i >= M0 && i < M1;
          return <circle key={i} cx={p[0]} cy={p[1]} r={isMotif ? 2.6 : 1.9}
            fill={isMotif ? C[2] : C[1]} opacity={isMotif ? 1 : 0.45 + 0.5 * abar} />;
        })}
        <g fontSize="8">
          <text x={6} y={14} fill="var(--muted)">noise ← t → design</text>
          <rect x={6} y={18} width={140} height={6} rx={3} fill="var(--grid)" />
          <rect x={6 + 140 * (1 - tt)} y={18} width={4} height={6} rx={2} fill="var(--fg)" />
          <text x={314} y={14} textAnchor="end" fill="var(--fg)">
            t = {tt.toFixed(2)} · √ᾱ = {a.toFixed(2)}
          </text>
          <text x={6} y={186} fill="var(--fg)">{NOTE[m]}</text>
          <text x={6} y={200} fill={folded ? C[0] : 'var(--muted)'}>
            {folded ? '✓ a clean backbone — but it is still only a backbone: no sequence yet.'
              : 'Each step removes a little noise and nudges residues towards a protein-like shape.'}
          </text>
        </g>
      </Stage>
      <Controls>
        <Slider label="t" min={0} max={1} step={0.01} value={tt} onChange={(x) => { setRun(false); setTt(x); }} />
        <Btn onClick={() => setRun(!run)}>{run ? '⏸ Pause' : '▶ Denoise'}</Btn>
        <Btn active={m === 'unconditional'} onClick={() => setM('unconditional')}>free</Btn>
        <Btn active={m === 'motif'} onClick={() => setM('motif')}>motif</Btn>
        <Btn active={m === 'binder'} onClick={() => setM('binder')}>binder</Btn>
        <Btn onClick={() => { setSd(sd + 1); setTt(1); }}>new noise</Btn>
      </Controls>
    </div>
  );
}
