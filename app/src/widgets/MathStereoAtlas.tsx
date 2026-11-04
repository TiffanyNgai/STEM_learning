import { useRef, useState, type PointerEvent as PE } from 'react';
import { Btn, Controls, PlayPause, Stage, prefersReducedMotion, useFrame } from './_kit';

/**
 * Two-chart atlas on the unit circle by stereographic projection. Drag the point P around the circle
 * (or press Play). The orange line from the north pole N through P hits the horizontal axis at the
 * chart coordinate u = x/(1−y); the purple line from the south pole S gives v = x/(1+y).
 * N has no u-coordinate and S has no v-coordinate, so each chart misses exactly one point, and together
 * they cover the circle. Right panel: the transition map v = 1/u (defined for u ≠ 0) with the current
 * point marked, plus readouts of u, v and u·v.
 * props: { theta?: number (initial angle of P in degrees, default 50), animate?: boolean (default false),
 *          showTransition?: boolean (right-hand panel, default true) }
 */
const CX = 92, CY = 100, R = 52; // circle on the left; the chart line is the horizontal diameter line y = 0
const LX0 = 4, LX1 = 184; // chart line drawn across this pixel range
const QX = [206, 314], QY = [24, 164], QR = 3.2; // transition plot box and its range [-QR, QR]

export default function MathStereoAtlas({ theta = 50, animate = false, showTransition = true }: {
  theta?: number; animate?: boolean; showTransition?: boolean;
}) {
  const [th, setTh] = useState((theta * Math.PI) / 180);
  const [run, setRun] = useState(animate && !prefersReducedMotion());
  const drag = useRef(false);
  useFrame((dt) => setTh((a) => (a + dt * 0.5) % (2 * Math.PI)), run);

  const x = Math.cos(th), y = Math.sin(th);
  const nearN = 1 - y < 1e-3, nearS = 1 + y < 1e-3;
  const u = nearN ? NaN : x / (1 - y);
  const v = nearS ? NaN : x / (1 + y);
  const px = CX + R * x, py = CY - R * y;
  const clipX = (t: number) => Math.max(LX0 - 40, Math.min(LX1 + 40, CX + R * t));

  const toAngle = (e: PE) => {
    const svg = (e.currentTarget as SVGElement).ownerSVGElement ?? (e.currentTarget as SVGSVGElement);
    const p = (svg as SVGSVGElement).createSVGPoint(); p.x = e.clientX; p.y = e.clientY;
    const q = p.matrixTransform((svg as SVGSVGElement).getScreenCTM()!.inverse());
    return Math.atan2(-(q.y - CY), q.x - CX);
  };
  const down = (e: PE) => { drag.current = true; setRun(false); (e.target as Element).setPointerCapture?.(e.pointerId); setTh(toAngle(e)); };
  const move = (e: PE) => { if (drag.current) setTh(toAngle(e)); };
  const up = () => { drag.current = false; };

  // transition plot helpers
  const qx = (s: number) => QX[0] + ((s + QR) / (2 * QR)) * (QX[1] - QX[0]);
  const qy = (s: number) => QY[1] - ((s + QR) / (2 * QR)) * (QY[1] - QY[0]);
  const branch = (sgn: number) => {
    const pts: string[] = [];
    for (let i = 0; i <= 60; i++) { const uu = sgn * (1 / QR + (i / 60) * (QR - 1 / QR)); pts.push(`${qx(uu).toFixed(1)},${qy(1 / uu).toFixed(1)}`); }
    return pts.join(' ');
  };
  const f = (s: number) => (Number.isFinite(s) ? (Math.abs(s) > 99 ? s.toExponential(1) : s.toFixed(2)) : '—');
  const inPlot = Number.isFinite(u) && Number.isFinite(v) && Math.abs(u) <= QR && Math.abs(v) <= QR;

  return (
    <div>
      <Stage w={320} h={200} label="Stereographic charts on a circle and their transition map">
        <rect x={0} y={0} width={190} height={200} fill="transparent" style={{ touchAction: 'none', cursor: 'grab' }}
          onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} />
        <g pointerEvents="none">
          <line x1={LX0} x2={LX1} y1={CY} y2={CY} stroke="var(--fg)" strokeWidth={1} />
          {[-1, 1].map((k) => <g key={k}><line x1={CX + R * k} x2={CX + R * k} y1={CY - 3} y2={CY + 3} stroke="var(--muted)" />
            <text x={CX + R * k} y={CY + 13} fontSize="8" textAnchor="middle" style={{ fill: 'var(--muted)' }}>{k}</text></g>)}
          <text x={LX1} y={CY - 4} fontSize="8" textAnchor="end" style={{ fill: 'var(--muted)' }}>chart line</text>
          <circle cx={CX} cy={CY} r={R} fill="var(--c6)" fillOpacity={0.06} stroke="var(--fg)" strokeWidth={1.6} />
          {!nearN && <line x1={CX} y1={CY - R} x2={clipX(u)} y2={CY} stroke="var(--c3)" strokeWidth={1.3} />}
          {!nearS && <line x1={CX} y1={CY + R} x2={clipX(v)} y2={CY} stroke="var(--c4)" strokeWidth={1.3} />}
          {!nearN && Math.abs(u) < 3.3 && <circle cx={CX + R * u} cy={CY} r={3.6} fill="var(--c3)" />}
          {!nearS && Math.abs(v) < 3.3 && <circle cx={CX + R * v} cy={CY} r={3.6} fill="var(--c4)" />}
          <circle cx={CX} cy={CY - R} r={3.4} fill="var(--c3)" />
          <circle cx={CX} cy={CY + R} r={3.4} fill="var(--c4)" />
          <text x={CX + 6} y={CY - R - 4} fontSize="10" fontWeight="bold" style={{ fill: 'var(--c3)' }}>N</text>
          <text x={CX + 6} y={CY + R + 12} fontSize="10" fontWeight="bold" style={{ fill: 'var(--c4)' }}>S</text>
          <circle cx={px} cy={py} r={6} fill="var(--c5)" stroke="var(--surface)" strokeWidth={1.5} />
          <text x={px + (x >= 0 ? 8 : -8)} y={py - 6} fontSize="10" fontWeight="bold" textAnchor={x >= 0 ? 'start' : 'end'} style={{ fill: 'var(--c5)' }}>P</text>
          <text x={4} y={14} fontSize="10" style={{ fill: 'var(--c3)' }}>u = x/(1−y) = {f(u)}</text>
          <text x={4} y={27} fontSize="10" style={{ fill: 'var(--c4)' }}>v = x/(1+y) = {f(v)}</text>
          <text x={4} y={190} fontSize="9" style={{ fill: 'var(--muted)' }}>
            {nearN ? 'P = N: outside the u-chart' : nearS ? 'P = S: outside the v-chart' : `P = (${x.toFixed(2)}, ${y.toFixed(2)}) — drag me`}
          </text>
        </g>
        {showTransition && <g pointerEvents="none">
          <rect x={QX[0]} y={QY[0]} width={QX[1] - QX[0]} height={QY[1] - QY[0]} fill="none" stroke="var(--grid)" />
          <line x1={QX[0]} x2={QX[1]} y1={qy(0)} y2={qy(0)} stroke="var(--grid)" />
          <line y1={QY[0]} y2={QY[1]} x1={qx(0)} x2={qx(0)} stroke="var(--grid)" />
          <polyline points={branch(1)} fill="none" stroke="var(--c2)" strokeWidth={1.6} />
          <polyline points={branch(-1)} fill="none" stroke="var(--c2)" strokeWidth={1.6} />
          {inPlot && <circle cx={qx(u)} cy={qy(v)} r={4} fill="var(--c5)" />}
          <text x={QX[1]} y={qy(0) - 3} fontSize="8" textAnchor="end" style={{ fill: 'var(--c3)' }}>u</text>
          <text x={qx(0) + 3} y={QY[0] + 9} fontSize="8" style={{ fill: 'var(--c4)' }}>v</text>
          <text x={(QX[0] + QX[1]) / 2} y={15} fontSize="10" fontWeight="bold" textAnchor="middle" style={{ fill: 'var(--c2)' }}>transition v = 1/u</text>
          <text x={(QX[0] + QX[1]) / 2} y={178} fontSize="9.5" textAnchor="middle">u · v = {Number.isFinite(u * v) ? (u * v).toFixed(3) : '—'}</text>
          <text x={(QX[0] + QX[1]) / 2} y={191} fontSize="8.5" textAnchor="middle" style={{ fill: 'var(--muted)' }}>overlap: P ≠ N, S</text>
        </g>}
      </Stage>
      <Controls>
        <PlayPause running={run} set={setRun} />
        <Btn onClick={() => { setRun(false); setTh(Math.PI / 2); }}>P = N</Btn>
        <Btn onClick={() => { setRun(false); setTh(-Math.PI / 2); }}>P = S</Btn>
        <Btn onClick={() => { setRun(false); setTh(Math.atan2(4, 3)); }}>P = (3/5, 4/5)</Btn>
      </Controls>
    </div>
  );
}
