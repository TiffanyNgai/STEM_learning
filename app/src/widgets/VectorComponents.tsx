import { useId, useState } from 'react';
import { Btn, C, Controls, Slider, Stage } from './_kit';

/**
 * Vectors on a grid: split a vector into x/y components, or add two vectors tip-to-tail.
 * props: { mode?: 'components' | 'add' (default 'components'),
 *          a?: [magnitude, angleDeg] (default [4, 35]), b?: [magnitude, angleDeg] (default [3, 110]),
 *          unit?: string (label appended to magnitudes, default '') }
 * Sliders control magnitude and direction; readouts show components to 2 d.p.
 */
export default function VectorComponents({ mode: mode0 = 'components', a = [4, 35], b = [3, 110], unit = '' }: {
  mode?: 'components' | 'add'; a?: [number, number]; b?: [number, number]; unit?: string;
}) {
  const id = useId().replace(/:/g, '');
  const [mode, setMode] = useState(mode0);
  const [am, setAm] = useState(a[0]); const [aa, setAa] = useState(a[1]);
  const [bm, setBm] = useState(b[0]); const [ba, setBa] = useState(b[1]);
  const S = 18; const ox = 160; const oy = 110; // px per unit, origin
  const X = (x: number) => ox + x * S; const Y = (y: number) => oy - y * S;
  const rad = (d: number) => (d * Math.PI) / 180;
  const ax = am * Math.cos(rad(aa)); const ay = am * Math.sin(rad(aa));
  const bx = bm * Math.cos(rad(ba)); const by = bm * Math.sin(rad(ba));
  const rx = ax + bx; const ry = ay + by;
  const f = (v: number) => (Math.abs(v) < 0.005 ? '0.00' : v.toFixed(2));
  const grid = [];
  for (let i = -8; i <= 8; i++) grid.push(<line key={'v' + i} x1={X(i)} x2={X(i)} y1={4} y2={196} stroke="var(--grid)" strokeWidth={0.5} />);
  for (let j = -5; j <= 5; j++) grid.push(<line key={'h' + j} y1={Y(j)} y2={Y(j)} x1={4} x2={316} stroke="var(--grid)" strokeWidth={0.5} />);
  const arrow = (x1: number, y1: number, x2: number, y2: number, col: number, w = 2.2, dash?: string) => (
    <line x1={X(x1)} y1={Y(y1)} x2={X(x2)} y2={Y(y2)} stroke={C[col]} strokeWidth={w} strokeDasharray={dash}
      markerEnd={`url(#${id}-m${col})`} />
  );
  const R = Math.hypot(rx, ry); const Rang = (Math.atan2(ry, rx) * 180) / Math.PI;
  return (
    <div>
      <Stage h={200} label="Vector diagram">
        <defs>
          {[0, 1, 2, 3].map((c) => (
            <marker key={c} id={`${id}-m${c}`} viewBox="0 0 6 6" refX="5" refY="3" markerWidth="5" markerHeight="5" orient="auto">
              <path d="M0,0L6,3L0,6z" fill={C[c]} />
            </marker>
          ))}
        </defs>
        {grid}
        <line x1={4} x2={316} y1={oy} y2={oy} stroke="var(--fg)" strokeWidth={0.8} />
        <line y1={4} y2={196} x1={ox} x2={ox} stroke="var(--fg)" strokeWidth={0.8} />
        <text x={312} y={oy - 4} fontSize="9" fill="var(--fg)" textAnchor="end">x</text>
        <text x={ox + 4} y={12} fontSize="9" fill="var(--fg)">y</text>
        {mode === 'components' ? (
          <g>
            {arrow(0, 0, ax, 0, 1, 1.6, '4 2')}
            {arrow(ax, 0, ax, ay, 2, 1.6, '4 2')}
            {arrow(0, 0, ax, ay, 0)}
            <text x={X(ax / 2)} y={Y(0) + (ay >= 0 ? 11 : -5)} fontSize="9" fill={C[1]} textAnchor="middle">Aₓ = {f(ax)}</text>
            <text x={X(ax) + (ax >= 0 ? 4 : -4)} y={Y(ay / 2)} fontSize="9" fill={C[2]} textAnchor={ax >= 0 ? 'start' : 'end'}>A_y = {f(ay)}</text>
            <path d={`M${X(1.2)},${Y(0)} A${1.2 * S},${1.2 * S} 0 0 ${aa >= 0 ? 0 : 1} ${X(1.2 * Math.cos(rad(aa)))},${Y(1.2 * Math.sin(rad(aa)))}`}
              fill="none" stroke="var(--muted)" strokeWidth={0.8} />
            <text x={6} y={14} fontSize="9" fill={C[0]}>|A| = {am.toFixed(1)}{unit}, θ = {aa.toFixed(0)}°</text>
          </g>
        ) : (
          <g>
            {arrow(0, 0, ax, ay, 0)}
            {arrow(ax, ay, rx, ry, 1)}
            {arrow(0, 0, rx, ry, 3, 2.6)}
            <text x={X(ax / 2) - 6} y={Y(ay / 2) - 4} fontSize="9" fill={C[0]} textAnchor="end">A</text>
            <text x={X(ax + bx / 2) + 4} y={Y(ay + by / 2)} fontSize="9" fill={C[1]}>B</text>
            <text x={6} y={14} fontSize="9" fill={C[3]}>A + B = ({f(rx)}, {f(ry)})</text>
            <text x={6} y={26} fontSize="9" fill={C[3]}>|A + B| = {R.toFixed(2)}{unit} at {Rang.toFixed(0)}°</text>
          </g>
        )}
      </Stage>
      <Controls>
        <Slider label="|A|" min={0} max={6} step={0.1} value={am} onChange={setAm} />
        <Slider label="θ_A (°)" min={-180} max={180} step={1} value={aa} onChange={setAa} format={(v) => v.toFixed(0)} />
        {mode === 'add' && <Slider label="|B|" min={0} max={6} step={0.1} value={bm} onChange={setBm} />}
        {mode === 'add' && <Slider label="θ_B (°)" min={-180} max={180} step={1} value={ba} onChange={setBa} format={(v) => v.toFixed(0)} />}
        <Btn active={mode === 'components'} onClick={() => setMode('components')}>Components</Btn>
        <Btn active={mode === 'add'} onClick={() => setMode('add')}>Add A + B</Btn>
      </Controls>
    </div>
  );
}
