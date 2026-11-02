import { useRef, useState, type PointerEvent } from 'react';
import { Btn, C, Controls, PlayPause, Slider, Stage, pathOf, useFrame } from './_kit';

/**
 * Planar two-link (RR) robot arm: forward kinematics, inverse kinematics and the Jacobian.
 * props: { mode?: 'fk' | 'ik' | 'jacobian' (default 'fk'),
 *          l1?: link-1 length (default 1), l2?: link-2 length (default 0.7),
 *          q1?: joint-1 angle in degrees from the x-axis (default 30), q2?: joint-2 angle relative to link 1 (default 60),
 *          target?: [x, y] initial IK target (default [1.1, 0.7]),
 *          showWorkspace?: boolean shade the reachable annulus (default true),
 *          lengthSliders?: boolean show l1/l2 sliders (default false),
 *          showEllipse?: boolean velocity-manipulability ellipse in 'jacobian' mode (default true) }
 * 'fk': sliders set q1, q2; Play sweeps the joints and traces the hand path.
 * 'ik': drag (or tap) to place the target; both solutions are drawn (solid = chosen, dashed = the other).
 * 'jacobian': columns of J drawn as velocity arrows at the hand; det J readout; the arm turns red near a singularity.
 */
export default function RobArm2Link({ mode = 'fk', l1: l10 = 1, l2: l20 = 0.7, q1 = 30, q2 = 60, target = [1.1, 0.7],
  showWorkspace = true, lengthSliders = false, showEllipse = true }: {
  mode?: 'fk' | 'ik' | 'jacobian'; l1?: number; l2?: number; q1?: number; q2?: number; target?: [number, number];
  showWorkspace?: boolean; lengthSliders?: boolean; showEllipse?: boolean;
}) {
  const [L, setL] = useState({ l1: l10, l2: l20 });
  const [q, setQ] = useState({ q1, q2 });
  const [tgt, setTgt] = useState<[number, number]>(target);
  const [sol, setSol] = useState<0 | 1>(0);
  const [running, setRunning] = useState(false);
  const trace = useRef<[number, number][]>([]);
  const base = useRef({ q1, q2 });
  const { l1, l2 } = L;
  const W = 320, H = 250, ox = 160, oy = 130;
  const S = 105 / Math.max(0.5, l1 + l2); // px per metre
  const X = (x: number) => ox + x * S; const Y = (y: number) => oy - y * S;
  const rad = (d: number) => (d * Math.PI) / 180; const deg = (r: number) => (r * 180) / Math.PI;
  const fk = (a: number, b: number) => {
    const e: [number, number] = [l1 * Math.cos(a), l1 * Math.sin(a)];
    return { e, h: [e[0] + l2 * Math.cos(a + b), e[1] + l2 * Math.sin(a + b)] as [number, number] };
  };

  useFrame((_, t) => {
    const a = base.current.q1 + 50 * Math.sin(0.7 * t); const b = base.current.q2 + 55 * Math.sin(1.1 * t + 0.5);
    setQ({ q1: a, q2: b });
    trace.current.push(fk(rad(a), rad(b)).h);
    if (trace.current.length > 400) trace.current.shift();
  }, running && mode !== 'ik');

  // --- IK ---
  const r2 = tgt[0] ** 2 + tgt[1] ** 2;
  const c2 = (r2 - l1 * l1 - l2 * l2) / (2 * l1 * l2);
  const reachable = Math.abs(c2) <= 1 + 1e-9;
  const ikSols: [number, number][] = [];
  if (reachable) {
    for (const sgn of [1, -1]) {
      const b = sgn * Math.acos(Math.max(-1, Math.min(1, c2)));
      const a = Math.atan2(tgt[1], tgt[0]) - Math.atan2(l2 * Math.sin(b), l1 + l2 * Math.cos(b));
      ikSols.push([a, b]);
    }
  }
  const elbowSide = (a: number) => { // is the elbow above or below the base→target line (in world y)?
    const e = [l1 * Math.cos(a), l1 * Math.sin(a)]; const cr = (tgt[0] * e[1] - tgt[1] * e[0]) * (tgt[0] < 0 ? -1 : 1);
    return Math.abs(cr) < 1e-6 ? 'on the line' : cr > 0 ? 'elbow-up' : 'elbow-down';
  };
  // joint angles actually drawn
  let A: number, B: number;
  if (mode === 'ik') {
    if (reachable) [A, B] = ikSols[sol];
    else { A = Math.atan2(tgt[1], tgt[0]); B = r2 > (l1 + l2) ** 2 ? 0 : Math.PI; }
  } else { A = rad(q.q1); B = rad(q.q2); }
  const { h: hand } = fk(A, B);
  const An = Math.atan2(Math.sin(A), Math.cos(A)); // for the θ₁ arc

  // --- Jacobian ---
  const s1 = Math.sin(A), c1 = Math.cos(A), s12 = Math.sin(A + B), c12 = Math.cos(A + B);
  const J = [[-l1 * s1 - l2 * s12, -l2 * s12], [l1 * c1 + l2 * c12, l2 * c12]];
  const det = l1 * l2 * Math.sin(B);
  const singular = Math.abs(Math.sin(B)) < 0.06;
  const a11 = J[0][0] ** 2 + J[0][1] ** 2, a22 = J[1][0] ** 2 + J[1][1] ** 2, a12 = J[0][0] * J[1][0] + J[0][1] * J[1][1];
  const mid = (a11 + a22) / 2, rr = Math.sqrt(((a11 - a22) / 2) ** 2 + a12 ** 2);
  const sig1 = Math.sqrt(Math.max(0, mid + rr)), sig2 = Math.sqrt(Math.max(0, mid - rr));
  const ang = 0.5 * Math.atan2(2 * a12, a11 - a22);
  const vs = 0.55; // arrow scale: metres per (rad/s)

  const onPointer = (ev: PointerEvent<SVGSVGElement>) => {
    if (mode !== 'ik' || (ev.type === 'pointermove' && ev.buttons === 0)) return;
    const svg = ev.currentTarget; const pt = svg.createSVGPoint(); pt.x = ev.clientX; pt.y = ev.clientY;
    const p = pt.matrixTransform(svg.getScreenCTM()!.inverse());
    setTgt([(p.x - ox) / S, (oy - p.y) / S]);
  };

  const arm = (a: number, b: number, color: string, dashed = false, key = '') => {
    const { e, h } = fk(a, b);
    return (
      <g key={key} opacity={dashed ? 0.45 : 1}>
        <path d={pathOf([[X(0), Y(0)], [X(e[0]), Y(e[1])], [X(h[0]), Y(h[1])]])} fill="none" stroke={color}
          strokeWidth={dashed ? 3 : 7} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={dashed ? '5 4' : undefined} />
        {!dashed && <circle cx={X(e[0])} cy={Y(e[1])} r={4.5} fill="var(--surface, #fff)" stroke="var(--fg)" strokeWidth={1.5} />}
        {!dashed && <circle cx={X(h[0])} cy={Y(h[1])} r={3.5} fill="var(--fg)" />}
      </g>
    );
  };
  const arrow = (from: [number, number], v: number[], color: string, label: string) => {
    const x2 = X(from[0] + vs * v[0]), y2 = Y(from[1] + vs * v[1]);
    const dx = x2 - X(from[0]), dy = y2 - Y(from[1]); const n = Math.hypot(dx, dy) || 1;
    const ux = dx / n, uy = dy / n;
    return (
      <g key={label}>
        <line x1={X(from[0])} y1={Y(from[1])} x2={x2} y2={y2} stroke={color} strokeWidth={2} />
        {n > 4 && <path d={`M${x2},${y2} L${x2 - 6 * ux - 3 * uy},${y2 - 6 * uy + 3 * ux} L${x2 - 6 * ux + 3 * uy},${y2 - 6 * uy - 3 * ux}Z`} fill={color} />}
        <text x={x2 + 4 * ux + 2} y={y2 + 4 * uy + 3} fontSize="9" fill={color}>{label}</text>
      </g>
    );
  };
  const armColor = mode === 'jacobian' && singular ? C[4] : C[1];
  const f2 = (v: number) => (Math.abs(v) < 0.005 ? '0.00' : v.toFixed(2));

  return (
    <div>
      <Stage w={W} h={H} label="Two-link planar robot arm">
          <svg x={0} y={0} width={W} height={H} viewBox={`0 0 ${W} ${H}`} onPointerDown={onPointer} onPointerMove={onPointer}
            style={{ touchAction: mode === 'ik' ? 'none' : 'auto', cursor: mode === 'ik' ? 'crosshair' : 'default' }}>
            <rect x={0} y={0} width={W} height={H} fill="transparent" />
            {showWorkspace && (
              <path fillRule="evenodd" fill={C[0]} opacity={0.12}
                d={`M${ox - (l1 + l2) * S},${oy} a${(l1 + l2) * S},${(l1 + l2) * S} 0 1,0 ${2 * (l1 + l2) * S},0 a${(l1 + l2) * S},${(l1 + l2) * S} 0 1,0 ${-2 * (l1 + l2) * S},0Z
                    M${ox - Math.abs(l1 - l2) * S},${oy} a${Math.abs(l1 - l2) * S},${Math.abs(l1 - l2) * S} 0 1,0 ${2 * Math.abs(l1 - l2) * S},0 a${Math.abs(l1 - l2) * S},${Math.abs(l1 - l2) * S} 0 1,0 ${-2 * Math.abs(l1 - l2) * S},0Z`} />
            )}
            <line x1={10} x2={W - 10} y1={oy} y2={oy} stroke="var(--grid)" />
            <line x1={ox} x2={ox} y1={10} y2={H - 10} stroke="var(--grid)" />
            <text x={W - 12} y={oy - 4} fontSize="9" textAnchor="end" fill="var(--muted)">x</text>
            <text x={ox + 4} y={18} fontSize="9" fill="var(--muted)">y</text>
            {trace.current.length > 1 && mode !== 'ik' && <path d={pathOf(trace.current.map(([x, y]) => [X(x), Y(y)]))} fill="none" stroke={C[2]} strokeWidth={1.2} opacity={0.7} />}
            {/* joint-angle arcs */}
            {mode !== 'ik' && <path d={`M${X(0.28)},${Y(0)} A${0.28 * S},${0.28 * S} 0 0,${An > 0 ? 0 : 1} ${X(0.28 * Math.cos(A))},${Y(0.28 * Math.sin(A))}`} fill="none" stroke={C[0]} strokeWidth={1.5} />}
            {mode === 'ik' && reachable && arm(ikSols[1 - sol][0], ikSols[1 - sol][1], C[3], true, 'ghost')}
            {arm(A, B, armColor, false, 'main')}
            <rect x={ox - 12} y={oy} width={24} height={8} fill="var(--muted)" />
            <circle cx={ox} cy={oy} r={5} fill="var(--surface, #fff)" stroke="var(--fg)" strokeWidth={1.5} />
            {mode === 'jacobian' && showEllipse && !Number.isNaN(ang) && (
              <ellipse cx={X(hand[0])} cy={Y(hand[1])} rx={Math.max(0.5, sig1 * vs * S)} ry={Math.max(0.5, sig2 * vs * S)}
                transform={`rotate(${-deg(ang)} ${X(hand[0])} ${Y(hand[1])})`} fill={C[3]} opacity={0.18} stroke={C[3]} />
            )}
            {mode === 'jacobian' && [arrow(hand, [J[0][0], J[1][0]], C[0], 'J₁'), arrow(hand, [J[0][1], J[1][1]], C[2], 'J₂')]}
            {mode === 'ik' && (
              <g>
                <circle cx={X(tgt[0])} cy={Y(tgt[1])} r={9} fill="none" stroke={reachable ? C[0] : C[4]} strokeWidth={2} />
                <line x1={X(tgt[0]) - 13} x2={X(tgt[0]) + 13} y1={Y(tgt[1])} y2={Y(tgt[1])} stroke={reachable ? C[0] : C[4]} />
                <line y1={Y(tgt[1]) - 13} y2={Y(tgt[1]) + 13} x1={X(tgt[0])} x2={X(tgt[0])} stroke={reachable ? C[0] : C[4]} />
              </g>
            )}
          </svg>
        <g fontSize="9" fill="var(--fg)">
          {mode !== 'ik' && <text x={6} y={14}>θ₁ = {deg(A).toFixed(0)}°, θ₂ = {deg(B).toFixed(0)}°</text>}
          {mode !== 'jacobian' && <text x={6} y={H - 8}>hand (x, y) = ({f2(hand[0])}, {f2(hand[1])}) m</text>}
          {mode === 'ik' && (reachable
            ? <text x={6} y={14}>solution {sol + 1}: θ₁ = {deg(A).toFixed(1)}°, θ₂ = {deg(B).toFixed(1)}° ({elbowSide(A)})</text>
            : <text x={6} y={14} fill={C[4]}>target unreachable: |p| must lie in [{Math.abs(l1 - l2).toFixed(2)}, {(l1 + l2).toFixed(2)}]</text>)}
          {mode === 'ik' && reachable && Math.abs(Math.abs(c2) - 1) < 0.004 && <text x={6} y={26} fill={C[4]}>on the workspace boundary: the two solutions merge</text>}
          {mode === 'jacobian' && (
            <>
              <text x={6} y={H - 20}>J = [{f2(J[0][0])}  {f2(J[0][1])} ; {f2(J[1][0])}  {f2(J[1][1])}]</text>
              <text x={6} y={H - 8} fill={singular ? C[4] : 'var(--fg)'}>det J = l₁l₂ sin θ₂ = {f2(det)}{singular ? '  ← SINGULAR' : ''}</text>
            </>
          )}
        </g>
      </Stage>
      <Controls>
        {mode !== 'ik' && <Slider label="θ₁" min={-180} max={180} step={1} value={Math.round(q.q1)} onChange={(v) => { setRunning(false); setQ((s) => ({ ...s, q1: v })); }} format={(v) => v + '°'} />}
        {mode !== 'ik' && <Slider label="θ₂" min={-180} max={180} step={1} value={Math.round(q.q2)} onChange={(v) => { setRunning(false); setQ((s) => ({ ...s, q2: v })); }} format={(v) => v + '°'} />}
        {lengthSliders && <Slider label="l₁" min={0.3} max={1.5} step={0.05} value={l1} onChange={(v) => setL((s) => ({ ...s, l1: v }))} />}
        {lengthSliders && <Slider label="l₂" min={0.3} max={1.5} step={0.05} value={l2} onChange={(v) => setL((s) => ({ ...s, l2: v }))} />}
        {mode === 'fk' && <PlayPause running={running} set={(r) => { if (r) { base.current = { ...q }; trace.current = []; } setRunning(r); }} />}
        {mode === 'fk' && <Btn onClick={() => { trace.current = []; setRunning(false); setQ({ q1, q2 }); }}>↺ Reset</Btn>}
        {mode === 'ik' && <Btn active={sol === 0} onClick={() => setSol(0)}>Solution 1 (θ₂ ≥ 0)</Btn>}
        {mode === 'ik' && <Btn active={sol === 1} onClick={() => setSol(1)}>Solution 2 (θ₂ ≤ 0)</Btn>}
        {mode === 'jacobian' && <Btn onClick={() => setQ((s) => ({ ...s, q2: 0 }))}>Stretch out (θ₂ = 0)</Btn>}
      </Controls>
      {mode === 'ik' && <p className="w-muted">Drag or tap anywhere to move the target ⊕.</p>}
    </div>
  );
}
