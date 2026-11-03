import { useMemo, useState } from 'react';
import { Btn, Controls, PlayPause, Slider, Stage, pathOf, rng, scale, useFrame } from './_kit';

/**
 * PCA on a centred 2D point cloud. Choose a candidate unit direction u (angle slider or Sweep):
 * each point is projected orthogonally onto the line through the mean (dots on the line, thin
 * residual segments). Right panel: the projected variance uᵀSu as a function of the angle (curve)
 * with the current angle marked, plus the mean squared residual tr S − uᵀSu. The maximum of the
 * curve is the first principal component (eigenvector of the sample covariance S with the largest
 * eigenvalue λ₁); "Show PCs" draws both eigenvectors scaled by 2√λ.
 * props: {
 *   n?: number        number of points (default 70)
 *   tilt?: number     orientation of the generating ellipse, degrees (default 30)
 *   s1?: number       std. dev. along the long generating axis (default 1)
 *   s2?: number       std. dev. along the short generating axis (default 0.35)
 *   angle?: number    initial candidate direction, degrees in [0, 180) (default 100)
 *   showPCs?: boolean draw principal axes initially (default false)
 *   seed?: number     (default 2)
 * Nothing animates until Play (Sweep) is pressed.
 * }
 */
type V = [number, number];
export default function MlPCA({ n = 70, tilt = 30, s1 = 1, s2 = 0.35, angle = 100, showPCs = false, seed = 2 }: {
  n?: number; tilt?: number; s1?: number; s2?: number; angle?: number; showPCs?: boolean; seed?: number;
}) {
  const [ang, setAng] = useState(angle);
  const [pcs, setPcs] = useState(showPCs);
  const [running, setRunning] = useState(false);
  const { pts, S, l1, l2, th1 } = useMemo(() => {
    const r = rng(seed); const a = (tilt * Math.PI) / 180; const raw: V[] = [];
    for (let i = 0; i < n; i++) {
      const u = s1 * r.normal(), v = s2 * r.normal();
      raw.push([Math.cos(a) * u - Math.sin(a) * v, Math.sin(a) * u + Math.cos(a) * v]);
    }
    const mx = raw.reduce((s, p) => s + p[0], 0) / n, my = raw.reduce((s, p) => s + p[1], 0) / n;
    const pts = raw.map(([x, y]) => [x - mx, y - my] as V);
    const sxx = pts.reduce((s, p) => s + p[0] * p[0], 0) / n, syy = pts.reduce((s, p) => s + p[1] * p[1], 0) / n;
    const sxy = pts.reduce((s, p) => s + p[0] * p[1], 0) / n;
    const tr = sxx + syy, det = sxx * syy - sxy * sxy, disc = Math.sqrt(Math.max(0, tr * tr / 4 - det));
    const th1 = 0.5 * Math.atan2(2 * sxy, sxx - syy);
    return { pts, S: [sxx, sxy, syy], l1: tr / 2 + disc, l2: tr / 2 - disc, th1 };
  }, [n, tilt, s1, s2, seed]);
  useFrame((dt) => setAng((a) => (a + dt * 25) % 180), running);

  const ph = (ang * Math.PI) / 180; const u: V = [Math.cos(ph), Math.sin(ph)];
  const varOf = (t: number) => S[0] * Math.cos(t) ** 2 + 2 * S[1] * Math.cos(t) * Math.sin(t) + S[2] * Math.sin(t) ** 2;
  const pv = varOf(ph); const tot = S[0] + S[2];
  const pc1deg = (((th1 * 180) / Math.PI) % 180 + 180) % 180;

  const L = 4, T = 5, Sz = 190, R = 2.5; const sx = scale([-R, R], [L, L + Sz]); const sy = scale([-R, R], [T + Sz, T]);
  const bx = scale([0, 180], [206, 314]); const by = scale([0, l1 * 1.1], [120, 30]);
  const curve: V[] = Array.from({ length: 91 }, (_, i) => [bx(i * 2), by(varOf((i * 2 * Math.PI) / 180))]);
  const ax = (th: number, len: number) => [sx(-len * Math.cos(th)), sy(-len * Math.sin(th)), sx(len * Math.cos(th)), sy(len * Math.sin(th))];
  const [x1, y1, x2, y2] = ax(ph, 3.6);
  return (
    <div>
      <Stage w={320} h={200} label="Principal component analysis: projecting points onto a direction">
        <clipPath id="mlpca-clip"><rect x={L} y={T} width={Sz} height={Sz} /></clipPath>
        <rect x={L} y={T} width={Sz} height={Sz} fill="none" stroke="var(--fg)" strokeWidth={0.6} />
        <g clipPath="url(#mlpca-clip)">
          <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--c3)" strokeWidth={1.6} />
          {pts.map((p, i) => {
            const z = p[0] * u[0] + p[1] * u[1];
            return <g key={i}>
              <line x1={sx(p[0])} y1={sy(p[1])} x2={sx(z * u[0])} y2={sy(z * u[1])} stroke="var(--muted)" strokeWidth={0.5} />
              <circle cx={sx(z * u[0])} cy={sy(z * u[1])} r={1.6} fill="var(--c3)" />
              <circle cx={sx(p[0])} cy={sy(p[1])} r={2.4} fill="var(--c2)" stroke="var(--fg)" strokeWidth={0.3} />
            </g>;
          })}
          {pcs && [[th1, l1, 'PC1'], [th1 + Math.PI / 2, l2, 'PC2']].map(([t, l, nm]) => {
            const len = 2 * Math.sqrt(l as number);
            return <g key={nm as string}>
              <line x1={sx(0)} y1={sy(0)} x2={sx(len * Math.cos(t as number))} y2={sy(len * Math.sin(t as number))} stroke="var(--c4)" strokeWidth={2.4} />
              <text x={sx(len * Math.cos(t as number)) + 3} y={sy(len * Math.sin(t as number)) - 3} fontSize="9" fill="var(--c4)">{nm}</text>
            </g>;
          })}
        </g>
        <g fontSize="8" fill="var(--muted)">
          <line x1={206} x2={314} y1={120} y2={120} stroke="var(--fg)" strokeWidth={0.6} />
          <line x1={206} x2={206} y1={28} y2={120} stroke="var(--fg)" strokeWidth={0.6} />
          <path d={pathOf(curve)} fill="none" stroke="var(--c3)" strokeWidth={1.4} />
          <circle cx={bx(ang)} cy={by(pv)} r={3.2} fill="var(--c3)" stroke="var(--fg)" strokeWidth={0.6} />
          {pcs && <line x1={bx(pc1deg)} x2={bx(pc1deg)} y1={30} y2={120} stroke="var(--c4)" strokeDasharray="2 2" />}
          <text x={206} y={22} fill="var(--fg)" fontSize="8.5">projected variance vs angle</text>
          <text x={206} y={130}>0°</text><text x={314} y={130} textAnchor="end">180°</text>
        </g>
        <g fontSize="8.5" fill="var(--fg)">
          <text x={206} y={146}>angle {ang.toFixed(0)}° · uᵀSu = {pv.toFixed(3)}</text>
          <text x={206} y={158}>residual MSE = {(tot - pv).toFixed(3)}</text>
          <text x={206} y={170} fill="var(--muted)">total variance = {tot.toFixed(3)}</text>
          {pcs && <text x={206} y={182} fill="var(--c4)">λ₁ = {l1.toFixed(3)}, λ₂ = {l2.toFixed(3)}</text>}
          {pcs && <text x={206} y={194} fill="var(--c4)">PC1 explains {((100 * l1) / tot).toFixed(1)}%</text>}
        </g>
      </Stage>
      <Controls>
        <Slider label="angle" min={0} max={179} step={1} value={Math.round(ang)} onChange={(v) => { setRunning(false); setAng(v); }} format={(v) => v.toFixed(0) + '°'} />
        <PlayPause running={running} set={setRunning} />
        <Btn onClick={() => { setRunning(false); setAng(pc1deg); }}>Snap to PC1</Btn>
        <Btn active={pcs} onClick={() => setPcs(!pcs)}>Show PCs</Btn>
      </Controls>
    </div>
  );
}
