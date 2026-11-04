import { useId, useRef, useState, type PointerEvent as PE } from 'react';
import { Controls, PlayPause, Slider, Stage, prefersReducedMotion, useFrame } from './_kit';

/**
 * Tangent plane to the unit sphere at a draggable point p (orthographic 2D projection, fixed view).
 * Drag on the sphere to move p. Shows the tangent plane T_pS² (blue patch), the coordinate basis
 * vectors ∂/∂λ (orange, points east, length cos φ) and ∂/∂φ (purple, points north, length 1) of the
 * latitude–longitude chart, the normal direction p (dashed), and a velocity vector v (red) with heading
 * ψ (slider) together with the great circle through p in direction v — the curve whose velocity at p is v.
 * With Play, a dot runs along that great circle carrying its own velocity arrow, which always lies in the
 * tangent plane of the point it is at. Readouts: φ, λ, components v = a ∂/∂λ + b ∂/∂φ, and v·p = 0.
 * props: { lat?: number (deg, default 35), lon?: number (deg, default 25), heading?: number (deg from north
 *          towards east, default 60), animate?: boolean (default true), showBasis?: boolean (default true),
 *          showCurve?: boolean (default true), caption?: string (title over the readouts, default 'T_pS²') }
 */
type V = [number, number, number];
const CX = 205, CY = 106, S = 84, EL = (22 * Math.PI) / 180, AZ = 0;
const d: V = [Math.cos(EL) * Math.cos(AZ), Math.cos(EL) * Math.sin(AZ), Math.sin(EL)];
const rt: V = [-Math.sin(AZ), Math.cos(AZ), 0];
const up: V = [-Math.sin(EL) * Math.cos(AZ), -Math.sin(EL) * Math.sin(AZ), Math.cos(EL)];
const dot = (a: V, b: V) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const add = (a: V, b: V, k = 1): V => [a[0] + k * b[0], a[1] + k * b[1], a[2] + k * b[2]];
const mul = (a: V, k: number): V => [a[0] * k, a[1] * k, a[2] * k];
const proj = (p: V): [number, number, number] => [CX + S * dot(p, rt), CY - S * dot(p, up), dot(p, d)];
const sph = (la: number, lo: number): V => [Math.cos(la) * Math.cos(lo), Math.cos(la) * Math.sin(lo), Math.sin(la)];

/** Split a sampled 3D curve into front / back screen polylines. */
function curve(pts: V[]): { front: string[]; back: string[] } {
  const front: string[] = [], back: string[] = [];
  let cur: string[] = [], side = 0;
  const flush = () => { if (cur.length > 1) (side > 0 ? front : back).push(cur.join(' ')); };
  for (const p of pts) {
    const [x, y, z] = proj(p); const s = z >= 0 ? 1 : -1;
    if (s !== side) { flush(); cur = cur.length ? [cur[cur.length - 1]] : []; side = s; }
    cur.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }
  flush();
  return { front, back };
}

const GRID = (() => {
  const lines: V[][] = [];
  for (let la = -60; la <= 60; la += 30) lines.push(Array.from({ length: 73 }, (_, i) => sph((la * Math.PI) / 180, (i * 5 * Math.PI) / 180)));
  for (let lo = 0; lo < 180; lo += 30) lines.push(Array.from({ length: 73 }, (_, i) => sph((i * 5 * Math.PI) / 180, (lo * Math.PI) / 180)));
  return lines.map(curve);
})();

export default function MathTangentPlane({ lat = 35, lon = 25, heading = 60, animate = true, showBasis = true, showCurve = true, caption = 'T_pS²' }: {
  lat?: number; lon?: number; heading?: number; animate?: boolean; showBasis?: boolean; showCurve?: boolean; caption?: string;
}) {
  const id = useId().replace(/:/g, '');
  const [phi, setPhi] = useState((lat * Math.PI) / 180);
  const [lam, setLam] = useState((lon * Math.PI) / 180);
  const [psi, setPsi] = useState(heading);
  const [run, setRun] = useState(animate && !prefersReducedMotion());
  const [t, setT] = useState(0.9);
  const drag = useRef(false);
  useFrame((dt) => setT((x) => (x + dt * 0.6) % (2 * Math.PI)), run && showCurve);

  const p = sph(phi, lam);
  const E: V = [-Math.sin(lam), Math.cos(lam), 0];
  const N: V = [-Math.sin(phi) * Math.cos(lam), -Math.sin(phi) * Math.sin(lam), Math.cos(phi)];
  const ps = (psi * Math.PI) / 180;
  const v = add(mul(N, Math.cos(ps)), E, Math.sin(ps));
  const a = Math.sin(ps) / Math.cos(phi), b = Math.cos(ps);
  const gc = curve(Array.from({ length: 121 }, (_, i) => { const s = (i / 120) * 2 * Math.PI; return add(mul(p, Math.cos(s)), v, Math.sin(s)); }));
  const q = add(mul(p, Math.cos(t)), v, Math.sin(t));
  const qv = add(mul(p, -Math.sin(t)), v, Math.cos(t));

  const toSphere = (e: PE) => {
    const svg = (e.currentTarget as SVGElement).ownerSVGElement ?? (e.currentTarget as SVGSVGElement);
    const pt = (svg as SVGSVGElement).createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY;
    const r = pt.matrixTransform((svg as SVGSVGElement).getScreenCTM()!.inverse());
    let X = (r.x - CX) / S, Y = -(r.y - CY) / S;
    const n = Math.hypot(X, Y); if (n > 0.97) { X *= 0.97 / n; Y *= 0.97 / n; }
    const P = add(add(mul(rt, X), up, Y), d, Math.sqrt(Math.max(0, 1 - X * X - Y * Y)));
    const la = Math.max(-1.45, Math.min(1.45, Math.asin(Math.max(-1, Math.min(1, P[2])))));
    setPhi(la); setLam(Math.atan2(P[1], P[0]));
  };
  const down = (e: PE) => { drag.current = true; (e.target as Element).setPointerCapture?.(e.pointerId); toSphere(e); };
  const move = (e: PE) => { if (drag.current) toSphere(e); };
  const upH = () => { drag.current = false; };

  const [px, py, pz] = proj(p);
  const front = pz >= 0;
  const sc = 0.62;
  const corners = [[1, 1], [1, -1], [-1, -1], [-1, 1]].map(([i, j]) => proj(add(add(p, E, 0.5 * i), N, 0.5 * j)));
  const arrow = (from: V, vec: V, col: string, w = 2.2, dash?: string) => {
    const [x1, y1] = proj(from); const [x2, y2] = proj(add(from, vec));
    return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={`var(--${col})`} strokeWidth={w} strokeDasharray={dash} markerEnd={dash ? undefined : `url(#tp${id}${col})`} />;
  };
  const deg = (r: number) => Math.round((r * 180) / Math.PI);
  return (
    <div>
      <Stage w={320} h={212} label="Tangent plane to a sphere at a point, with basis vectors and a velocity vector">
        <defs>
          {['c2', 'c3', 'c4', 'c5'].map((c) => <marker key={c} id={`tp${id}${c}`} viewBox="0 0 6 6" refX="5" refY="3" markerWidth="4" markerHeight="4" orient="auto"><path d="M0,0L6,3L0,6z" fill={`var(--${c})`} /></marker>)}
        </defs>
        <g pointerEvents="none">
          {GRID.map((g, i) => g.back.map((s, k) => <polyline key={`b${i}-${k}`} points={s} fill="none" stroke="var(--grid)" strokeWidth={0.6} strokeDasharray="2 2" />))}
          {showCurve && gc.back.map((s, k) => <polyline key={'gb' + k} points={s} fill="none" stroke="var(--c5)" strokeWidth={1} opacity={0.35} strokeDasharray="3 2" />)}
        </g>
        <circle cx={CX} cy={CY} r={S} fill="var(--c6)" fillOpacity={0.08} stroke="var(--fg)" strokeWidth={1.3}
          style={{ touchAction: 'none', cursor: 'grab' }} onPointerDown={down} onPointerMove={move} onPointerUp={upH} onPointerCancel={upH} />
        <g pointerEvents="none">
          {GRID.map((g, i) => g.front.map((s, k) => <polyline key={`f${i}-${k}`} points={s} fill="none" stroke="var(--muted)" strokeWidth={0.6} opacity={0.6} />))}
          {showCurve && gc.front.map((s, k) => <polyline key={'gf' + k} points={s} fill="none" stroke="var(--c5)" strokeWidth={1.4} opacity={0.75} />)}
          <polygon points={corners.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ')} fill="var(--c2)" fillOpacity={front ? 0.2 : 0.07}
            stroke="var(--c2)" strokeOpacity={front ? 0.9 : 0.3} strokeWidth={1} />
          {arrow(p, mul(p, 0.32), 'muted', 1, '3 2')}
          {showBasis && arrow(p, mul(E, sc * Math.cos(phi)), 'c3')}
          {showBasis && arrow(p, mul(N, sc), 'c4')}
          {showCurve && arrow(p, mul(v, sc), 'c5', 2.6)}
          <circle cx={px} cy={py} r={4} fill="var(--fg)" />
          <text x={px - 8} y={py + 12} fontSize="10" fontWeight="bold">p</text>
          {showCurve && run && <g opacity={proj(q)[2] >= 0 ? 1 : 0.3}>
            <circle cx={proj(q)[0]} cy={proj(q)[1]} r={3.2} fill="var(--c1)" />
            {arrow(q, mul(qv, 0.45), 'c2', 1.6)}
          </g>}
        </g>
        <g fontSize="9.5" pointerEvents="none">
          <text x={4} y={14} fontWeight="bold" style={{ fill: 'var(--c2)' }}>{caption}</text>
          <text x={4} y={30}>φ (lat) = {deg(phi)}°</text>
          <text x={4} y={43}>λ (lon) = {deg(lam)}°</text>
          {showBasis && <text x={4} y={62} style={{ fill: 'var(--c3)' }}>∂/∂λ: east, |·| = {Math.cos(phi).toFixed(2)}</text>}
          {showBasis && <text x={4} y={75} style={{ fill: 'var(--c4)' }}>∂/∂φ: north, |·| = 1</text>}
          {showCurve && <text x={4} y={96} style={{ fill: 'var(--c5)' }}>v = a ∂/∂λ + b ∂/∂φ</text>}
          {showCurve && <text x={4} y={109} style={{ fill: 'var(--c5)' }}>a = {a.toFixed(2)}, b = {b.toFixed(2)}</text>}
          {showCurve && <text x={4} y={124}>v · p = {Math.abs(dot(v, p)) < 5e-3 ? '0.00' : dot(v, p).toFixed(2)}</text>}
          <text x={4} y={150} fontSize="8.5" style={{ fill: 'var(--muted)' }}>drag on the sphere</text>
          <text x={4} y={162} fontSize="8.5" style={{ fill: 'var(--muted)' }}>to move p</text>
          {!front && <text x={4} y={180} fontSize="8.5" style={{ fill: 'var(--c5)' }}>p is on the far side</text>}
        </g>
      </Stage>
      <Controls>
        {showCurve && <PlayPause running={run} set={setRun} />}
        {showCurve && <Slider label="heading ψ" min={-180} max={180} step={1} value={psi} onChange={setPsi} format={(x) => `${x}°`} />}
      </Controls>
    </div>
  );
}
