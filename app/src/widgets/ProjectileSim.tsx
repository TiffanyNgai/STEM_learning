import { useId, useState } from 'react';
import { Btn, C, Controls, PlayPause, Slider, Stage, prefersReducedMotion, useFrame } from './_kit';

/**
 * Projectile launched over flat ground (no air resistance): animated trajectory with
 * velocity vector and its x / y components, plus range, peak height and flight time.
 * props: { speed?: m/s (default 20), angle?: degrees (default 45), height?: launch height m (default 0),
 *          g?: m/s² (default 9.8), maxSpeed?: sets the fixed world scale (default 30),
 *          showComponents?: boolean (default true), controls?: ('speed'|'angle'|'height'|'g')[] (default speed, angle) }
 * "Keep" freezes the current path as a ghost so two launches can be compared.
 */
export default function ProjectileSim({ speed = 20, angle = 45, height = 0, g: g0 = 9.8, maxSpeed = 30, showComponents = true,
  controls = ['speed', 'angle'] }: {
  speed?: number; angle?: number; height?: number; g?: number; maxSpeed?: number; showComponents?: boolean;
  controls?: ('speed' | 'angle' | 'height' | 'g')[];
}) {
  const id = useId().replace(/:/g, '');
  const [v0, setV0] = useState(speed); const [th, setTh] = useState(angle);
  const [h0, setH0] = useState(height); const [g, setG] = useState(g0);
  const [t, setT] = useState(0);
  const [running, setRunning] = useState(!prefersReducedMotion());
  const [ghost, setGhost] = useState<string | null>(null);
  const r = (th * Math.PI) / 180;
  const vx = v0 * Math.cos(r); const vy0 = v0 * Math.sin(r);
  const T = (vy0 + Math.sqrt(vy0 * vy0 + 2 * g * h0)) / g; // time to hit y = 0
  const range = vx * T; const peak = h0 + Math.max(0, vy0) ** 2 / (2 * g);
  useFrame((dt) => setT((v) => (v > T + 0.8 ? 0 : v + dt)), running);
  const tc = Math.min(t, T);
  // fixed world scale so changes are comparable
  const gRef = g0; // fixed: lowering g lets paths run off-screen rather than rescaling
  const wx = Math.max(maxSpeed * maxSpeed / gRef, 10) * 1.05 + (controls.includes('height') || height > 0 ? 25 : 0);
  const wy = maxSpeed * maxSpeed / (2 * gRef) * 1.1 + Math.max(h0, height, controls.includes('height') ? 30 : 0);
  const L = 14, B = 182, W = 300, Hh = 150;
  const s = Math.min(W / wx, Hh / wy);
  const px = (x: number) => L + x * s; const py = (y: number) => B - y * s;
  const pts: string[] = [];
  for (let i = 0; i <= 80; i++) { const ti = (T * i) / 80; pts.push(`${px(vx * ti).toFixed(1)},${py(h0 + vy0 * ti - 0.5 * g * ti * ti).toFixed(1)}`); }
  const path = 'M' + pts.join('L');
  const bx = vx * tc; const by = h0 + vy0 * tc - 0.5 * g * tc * tc; const vy = vy0 - g * tc;
  const k = 1.4; // px per (m/s)
  const arrow = (x2: number, y2: number, col: number, w = 2) => (
    <line x1={px(bx)} y1={py(by)} x2={px(bx) + x2 * k} y2={py(by) - y2 * k} stroke={C[col]} strokeWidth={w} markerEnd={`url(#${id}-${col})`} />
  );
  return (
    <div>
      <Stage h={200} label="Projectile trajectory">
        <defs>
          {[0, 1, 2].map((c) => (
            <marker key={c} id={`${id}-${c}`} viewBox="0 0 6 6" refX="5" refY="3" markerWidth="4" markerHeight="4" orient="auto"><path d="M0,0L6,3L0,6z" fill={C[c]} /></marker>
          ))}
        </defs>
        <line x1={4} x2={316} y1={B} y2={B} stroke="var(--fg)" strokeWidth={1} />
        {h0 > 0 && <rect x={L - 8} y={py(h0)} width={8} height={h0 * s} fill="var(--grid)" />}
        {ghost && <path d={ghost} fill="none" stroke="var(--muted)" strokeWidth={1} strokeDasharray="2 3" />}
        <path d={path} fill="none" stroke={C[3]} strokeWidth={1.2} strokeDasharray="4 3" />
        <path d={`M${px(0)},${py(peak)}h${px(range) - px(0)}`} stroke="var(--grid)" strokeWidth={0.6} />
        {showComponents && arrow(vx, 0, 1, 1.6)}
        {showComponents && arrow(0, vy, 2, 1.6)}
        {arrow(vx, vy, 0, 2.2)}
        <circle cx={px(bx)} cy={py(by)} r={4.5} fill="var(--fg)" />
        <text x={316} y={12} fontSize="9" textAnchor="end" fill="var(--fg)">range {range.toFixed(1)} m · peak {peak.toFixed(1)} m · {T.toFixed(2)} s</text>
        <text x={316} y={24} fontSize="9" textAnchor="end" fill="var(--muted)">t = {tc.toFixed(2)} s</text>
        {showComponents && <text x={316} y={36} fontSize="9" textAnchor="end" fill={C[1]}>vₓ = {vx.toFixed(1)} m/s (constant)</text>}
        {showComponents && <text x={316} y={48} fontSize="9" textAnchor="end" fill={C[2]}>v_y = {vy.toFixed(1)} m/s</text>}
      </Stage>
      <Controls>
        {controls.includes('speed') && <Slider label="speed (m/s)" min={1} max={maxSpeed} step={0.5} value={v0} onChange={setV0} />}
        {controls.includes('angle') && <Slider label="angle (°)" min={0} max={90} step={1} value={th} onChange={setTh} format={(v) => v.toFixed(0)} />}
        {controls.includes('height') && <Slider label="height (m)" min={0} max={30} step={0.5} value={h0} onChange={setH0} />}
        {controls.includes('g') && <Slider label="g (m/s²)" min={1.6} max={25} step={0.1} value={g} onChange={setG} />}
        <PlayPause running={running} set={setRunning} />
        <Btn onClick={() => setT(0)}>↺ Relaunch</Btn>
        <Btn onClick={() => setGhost(path)}>Keep path</Btn>
      </Controls>
    </div>
  );
}
