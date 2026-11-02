import { useState } from 'react';
import { Btn, Controls, PlayPause, Slider, Stage, pathOf, prefersReducedMotion, scale, useClock } from './_kit';

/**
 * Animated left heart (LA, LV, aorta, mitral & aortic valves) synced to a Wiggers diagram
 * (aortic, LV, LA pressure + LV volume) or to the LV pressure–volume loop.
 * props (all optional): view?: 'wiggers' | 'pv' (initial view, default 'wiggers'),
 *   speed?: number (playback speed, default 0.35 = slow motion), showControls?: boolean (default true)
 * Idealised resting adult values: HR 75 (cycle 0.8 s), EDV 120 mL, ESV 50 mL, 120/80 mmHg.
 * Phase fractions: 0 mitral closes (S1) · 0.06 aortic opens · 0.38 aortic closes (S2) · 0.47 mitral opens.
 */
const clamp = (x: number) => Math.max(0, Math.min(1, x));
const ease = (x: number) => 0.5 - 0.5 * Math.cos(Math.PI * clamp(x));
const bump = (p: number, c: number, w: number) => Math.exp(-(((p - c) / w) ** 2));
const AO = 0.06, AC = 0.38, MO = 0.47;
function plv(p: number) {
  if (p < AO) return 6 + 74 * ease(p / AO);
  if (p < 0.2) return 80 + 42 * Math.sin((Math.PI / 2) * (p - AO) / 0.14);
  if (p < AC) return 122 - 22 * ease((p - 0.2) / 0.18);
  if (p < MO) return 100 - 96 * ease((p - AC) / (MO - AC));
  return 4 + 2 * ease((p - MO) / 0.38) + 5 * bump(p, 0.93, 0.03);
}
const decay = (q: number) => 60 + 39 * Math.exp(-(q - 0.41) / 0.973);
function pao(p: number) {
  if (p < AO) return decay(p + 1);
  if (p < AC) return plv(p) + 3 * ((p - AO) / (AC - AO)) ** 2;
  if (p < 0.39) return 103 - 7 * (p - AC) / 0.01;
  if (p < 0.41) return 96 + 3 * (p - 0.39) / 0.02;
  return decay(p);
}
function pla(p: number) {
  if (p < MO) return 5 + 9 * ease((p - AO) / 0.4) + 3 * bump(p, 0.03, 0.015);
  return 14 - 8 * ease((p - MO) / 0.09) - ease((p - 0.56) / 0.44) + 6 * bump(p, 0.92, 0.03);
}
function vol(p: number) {
  if (p < AO) return 120;
  if (p < AC) return 120 - 70 * Math.sin((Math.PI / 2) * (p - AO) / (AC - AO));
  if (p < MO) return 50;
  if (p < 0.62) return 50 + 50 * Math.sin((Math.PI / 2) * (p - MO) / 0.15);
  if (p < 0.88) return 100 + 5 * (p - 0.62) / 0.26;
  return 105 + 15 * ease((p - 0.88) / 0.1);
}
const PHASES: [number, string][] = [[0, 'Isovolumetric contraction'], [AO, 'Ejection'], [AC, 'Isovolumetric relaxation'], [MO, 'Rapid filling'], [0.62, 'Diastasis'], [0.88, 'Atrial systole (“kick”)']];

function Valve({ x, y, open, angle }: { x: number; y: number; open: boolean; angle: number }) {
  const a = open ? 70 : 0;
  const col = open ? 'var(--c1)' : 'var(--c5)';
  return (
    <g transform={`translate(${x},${y}) rotate(${angle})`} stroke={col} strokeWidth={2.5} strokeLinecap="round">
      <line x1={-10} y1={0} x2={-10 + 9 * Math.cos((a * Math.PI) / 180)} y2={9 * Math.sin((a * Math.PI) / 180)} />
      <line x1={10} y1={0} x2={10 - 9 * Math.cos((a * Math.PI) / 180)} y2={9 * Math.sin((a * Math.PI) / 180)} />
    </g>
  );
}

export default function HeartCycle({ view = 'wiggers', speed = 0.35, showControls = true }: { view?: 'wiggers' | 'pv'; speed?: number; showControls?: boolean }) {
  const [running, setRunning] = useState(!prefersReducedMotion());
  const [sp, setSp] = useState(speed);
  const [v, setV] = useState(view);
  const [t] = useClock(running, sp);
  const p = ((t * 75) / 60) % 1;
  const mitralOpen = p >= MO;
  const aorticOpen = p >= AO && p < AC;
  const phase = [...PHASES].reverse().find(([s]) => p >= s)![1];
  const V = vol(p);
  const k = (V - 50) / 70; // 0 (ESV) … 1 (EDV)
  const atrial = bump(p, 0.92, 0.035);
  // right panel
  const box: [number, number, number, number] = [138, 14, 314, 150];
  const xs = scale([0, 1], [box[0], box[2]]);
  const yp = scale([0, 130], [box[3], box[1]]);
  const yv = scale([40, 130], [205, 160]);
  const trace = (f: (q: number) => number, ys: (y: number) => number) =>
    pathOf(Array.from({ length: 201 }, (_, i) => [xs(i / 200), ys(f(i / 200))] as [number, number]));
  const pvx = scale([40, 130], [box[0] + 10, box[2]]);
  const pvy = scale([0, 130], [200, box[1]]);
  const sound = p < 0.03 ? 'S1 “lub”' : p >= AC && p < AC + 0.03 ? 'S2 “dub”' : '';
  return (
    <div>
      <Stage w={320} h={215} label="Cardiac cycle: heart and Wiggers diagram">
        {/* heart */}
        <path d="M78,112 C80,80 84,40 92,14" stroke="var(--c5)" strokeWidth={16} fill="none" opacity={0.25} />
        <text x={100} y={22} fontSize="9" fill="var(--fg)">Ao</text>
        <ellipse cx={38} cy={52} rx={26 - 4 * atrial} ry={19 - 3 * atrial} fill="var(--c2)" opacity={0.25} stroke="var(--c2)" />
        <text x={30} y={50} fontSize="10" fill="var(--fg)">LA</text>
        <ellipse cx={55} cy={150} rx={22 + 10 * k} ry={34 + 12 * k} fill="var(--c5)" opacity={0.25} stroke="var(--c5)" />
        <text x={47} y={156} fontSize="10" fill="var(--fg)">LV</text>
        <Valve x={44} y={88} open={mitralOpen} angle={10} />
        <Valve x={78} y={112} open={aorticOpen} angle={-60} />
        <text x={2} y={98} fontSize="8" fill={mitralOpen ? 'var(--c1)' : 'var(--c5)'}>mitral {mitralOpen ? 'open' : 'closed'}</text>
        <text x={84} y={128} fontSize="8" fill={aorticOpen ? 'var(--c1)' : 'var(--c5)'}>aortic</text>
        <text x={84} y={137} fontSize="8" fill={aorticOpen ? 'var(--c1)' : 'var(--c5)'}>{aorticOpen ? 'open' : 'closed'}</text>
        {mitralOpen && <path d="M44,78 l0,22" stroke="var(--c1)" strokeWidth={1.5} markerEnd="url(#hc-arr)" />}
        {aorticOpen && <path d="M72,118 l12,-24" stroke="var(--c1)" strokeWidth={1.5} markerEnd="url(#hc-arr)" />}
        <defs><marker id="hc-arr" viewBox="0 0 6 6" refX="3" refY="3" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0L6,3L0,6z" fill="var(--c1)" /></marker></defs>
        <text x={2} y={200} fontSize="9" fill="var(--fg)" fontWeight="bold">{phase}</text>
        <text x={2} y={211} fontSize="8" fill="var(--muted)">LV vol {V.toFixed(0)} mL · LVP {plv(p).toFixed(0)} mmHg {sound && '· ' + sound}</text>
        {v === 'wiggers' ? (
          <g>
            {[[0, AO], [AC, MO]].map(([a, b], i) => <rect key={i} x={xs(a)} width={xs(b) - xs(a)} y={box[1]} height={205 - box[1]} fill="var(--c4)" opacity={0.1} />)}
            <line x1={box[0]} x2={box[2]} y1={box[3]} y2={box[3]} stroke="var(--fg)" strokeWidth={0.6} />
            <path d={trace(pao, yp)} stroke="var(--c5)" fill="none" strokeWidth={1.6} />
            <path d={trace(plv, yp)} stroke="var(--c2)" fill="none" strokeWidth={1.6} />
            <path d={trace(pla, yp)} stroke="var(--c3)" fill="none" strokeWidth={1.4} />
            <path d={trace(vol, yv)} stroke="var(--c6)" fill="none" strokeWidth={1.6} />
            <text x={box[0] + 2} y={yp(122) - 2} fontSize="8" fill="var(--c5)">aortic</text>
            <text x={xs(0.17)} y={yp(126)} fontSize="8" fill="var(--c2)">LV</text>
            <text x={xs(0.55)} y={yp(14)} fontSize="8" fill="var(--c3)">LA (a c v)</text>
            <text x={box[0] + 2} y={yv(124)} fontSize="8" fill="var(--c6)">LV volume</text>
            <text x={box[0] - 2} y={yp(120) + 3} fontSize="7" textAnchor="end" fill="var(--muted)">120</text>
            <text x={box[0] - 2} y={yp(80) + 3} fontSize="7" textAnchor="end" fill="var(--muted)">80</text>
            <text x={box[0] - 2} y={yp(0)} fontSize="7" textAnchor="end" fill="var(--muted)">0</text>
            <text x={xs(0.015)} y={box[1] - 3} fontSize="8" fill="var(--fg)">S1</text>
            <text x={xs(AC)} y={box[1] - 3} fontSize="8" fill="var(--fg)">S2</text>
            <line x1={xs(p)} x2={xs(p)} y1={box[1]} y2={205} stroke="var(--fg)" strokeWidth={1} />
          </g>
        ) : (
          <g>
            <line x1={box[0] + 10} x2={box[2]} y1={200} y2={200} stroke="var(--fg)" strokeWidth={0.7} />
            <line x1={box[0] + 10} x2={box[0] + 10} y1={box[1]} y2={200} stroke="var(--fg)" strokeWidth={0.7} />
            <text x={box[2]} y={196} fontSize="8" textAnchor="end" fill="var(--fg)">LV volume (mL) →</text>
            <text x={box[0] + 13} y={box[1] + 8} fontSize="8" fill="var(--fg)">LV pressure ↑</text>
            <path d={pathOf(Array.from({ length: 301 }, (_, i) => [pvx(vol(i / 300)), pvy(plv(i / 300))] as [number, number]))} stroke="var(--c2)" fill="var(--c2)" fillOpacity={0.08} strokeWidth={1.6} />
            <circle cx={pvx(V)} cy={pvy(plv(p))} r={4} fill="var(--c5)" />
            <text x={pvx(120) + 3} y={pvy(30)} fontSize="7" fill="var(--muted)">EDV</text>
            <text x={pvx(50) - 18} y={pvy(110)} fontSize="7" fill="var(--muted)">ESV</text>
            <text x={pvx(85)} y={pvy(4) - 3} fontSize="7" textAnchor="middle" fill="var(--muted)">filling</text>
            <text x={pvx(85)} y={pvy(126)} fontSize="7" textAnchor="middle" fill="var(--muted)">ejection</text>
            <text x={pvx(85)} y={pvy(60)} fontSize="7" textAnchor="middle" fill="var(--muted)">area = stroke work</text>
          </g>
        )}
      </Stage>
      {showControls && (
        <Controls>
          <PlayPause running={running} set={setRunning} />
          <Btn active={v === 'wiggers'} onClick={() => setV('wiggers')}>Wiggers</Btn>
          <Btn active={v === 'pv'} onClick={() => setV('pv')}>P–V loop</Btn>
          <Slider label="speed" min={0.1} max={1} step={0.05} value={sp} onChange={setSp} />
        </Controls>
      )}
    </div>
  );
}
