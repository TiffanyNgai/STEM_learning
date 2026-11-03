import { useRef, useState } from 'react';
import { Btn, Controls, PlayPause, Slider, Stage, pathOf, prefersReducedMotion, rng, scale, useFrame } from './_kit';

/**
 * A walker doing overdamped Langevin dynamics (k_BT = 1, D = 1) on a 1D double-well free-energy
 * surface F(s) = h (s² − 1)² + a·s along a collective variable s. In "plain MD" mode it rattles in one well.
 * In metadynamics mode it drops a Gaussian hill of height w and width σ every few steps where it stands;
 * hills pile up into a bias V(s) that fills the wells until the walker diffuses freely, and −V(s) (dashed,
 * shifted) becomes an estimate of F(s). Well-tempered mode shrinks each new hill by exp(−V(s)/ΔT) and
 * estimates F = −(1 + T/ΔT)·V.
 * props: { barrier?: number (h, in k_BT, default 8), asym?: number (a, default 0.8), mode?: 'plain'|'metad'|'wt' (default 'metad'),
 *          height?: number (hill height w in k_BT, default 0.25), width?: number (σ, default 0.2), autoRun?: boolean (default true) }
 */
const NG = 161, LO = -2, HI = 2, DT = 0.002;
const gx = (i: number) => LO + ((HI - LO) * i) / (NG - 1);

export default function DrugMetadynamics({ barrier = 8, asym = 0.8, mode = 'metad', height = 0.25, width = 0.2, autoRun = true }: {
  barrier?: number; asym?: number; mode?: 'plain' | 'metad' | 'wt'; height?: number; width?: number; autoRun?: boolean;
}) {
  const [m, setM] = useState(mode);
  const [w, setW] = useState(height);
  const [running, setRunning] = useState(autoRun && !prefersReducedMotion());
  const [, force] = useState(0);
  const F = (s: number) => barrier * (s * s - 1) ** 2 + asym * s;
  const dF = (s: number) => 4 * barrier * s * (s * s - 1) + asym;
  const init = () => ({ s: -1, V: new Float64Array(NG), hills: 0, trace: [] as number[], step: 0, R: rng(7) });
  const st = useRef(init());
  const reset = () => { st.current = init(); force((v) => v + 1); };
  const dTwt = 4;

  const biasGrad = (V: Float64Array, s: number) => {
    const u = ((s - LO) / (HI - LO)) * (NG - 1); const i = Math.max(0, Math.min(NG - 2, Math.floor(u)));
    return (V[i + 1] - V[i]) / ((HI - LO) / (NG - 1));
  };
  const biasAt = (V: Float64Array, s: number) => {
    const u = Math.max(0, Math.min(NG - 1.001, ((s - LO) / (HI - LO)) * (NG - 1))); const i = Math.floor(u);
    return V[i] + (u - i) * (V[i + 1] - V[i]);
  };

  useFrame(() => {
    const S = st.current;
    for (let k = 0; k < 40; k++) {
      const g = dF(S.s) + (m === 'plain' ? 0 : biasGrad(S.V, S.s));
      S.s += -g * DT + Math.sqrt(2 * DT) * S.R.normal();
      S.s = Math.max(LO + 0.01, Math.min(HI - 0.01, S.s));
      S.step++;
      if (m !== 'plain' && S.step % 100 === 0) {
        const h = m === 'wt' ? w * Math.exp(-biasAt(S.V, S.s) / dTwt) : w;
        for (let i = 0; i < NG; i++) S.V[i] += h * Math.exp(-((gx(i) - S.s) ** 2) / (2 * width * width));
        S.hills++;
      }
      if (S.step % 20 === 0) { S.trace.push(S.s); if (S.trace.length > 240) S.trace.shift(); }
    }
    force((v) => v + 1);
  }, running);

  const S = st.current;
  const top = Math.max(barrier + 4, barrier + Math.abs(asym) + 2);
  const sx = scale([LO, HI], [24, 314]); const sy = scale([-asym - 2, top], [140, 8]);
  const clip = (y: number) => Math.max(4, Math.min(146, y));
  const xs = Array.from({ length: NG }, (_, i) => gx(i));
  const fac = m === 'wt' ? 1 + 1 / dTwt : 1;
  // estimate −fac·V, shifted so its minimum over the visited region matches min F
  const est = xs.map((x, i) => -fac * S.V[i]);
  const Fmin = Math.min(...xs.map(F));
  const inner = xs.map((x, i) => (Math.abs(x) < 1.4 ? est[i] : Infinity));
  const shift = Fmin - Math.min(...inner);
  const showEst = m !== 'plain' && S.hills > 0;
  const ty = scale([LO, HI], [228, 160]);

  return (
    <div>
      <Stage w={320} h={236} label="Metadynamics on a double-well free-energy surface">
        <text x={26} y={14} fontSize="8.5" fill="var(--fg)" fontWeight={700}>free energy (k_BT)</text>
        <line x1={24} x2={314} y1={140} y2={140} stroke="var(--grid)" />
        {showEst && <path d={pathOf(xs.map((x, i) => [sx(x), clip(sy(F(x) + S.V[i]))]))} fill="none" stroke="var(--c3)" strokeWidth={1.5} />}
        <path d={pathOf(xs.map((x) => [sx(x), clip(sy(F(x)))]))} fill="none" stroke="var(--fg)" strokeWidth={2} />
        {showEst && <path d={pathOf(xs.filter((x) => Math.abs(x) < 1.5).map((x) => [sx(x), clip(sy(est[xs.indexOf(x)] + shift))]))} fill="none" stroke="var(--c1)" strokeWidth={2} strokeDasharray="4 3" />}
        <circle cx={sx(S.s)} cy={clip(sy(F(S.s) + (m === 'plain' ? 0 : biasAt(S.V, S.s))))} r={5} fill="var(--c5)" stroke="var(--surface)" />
        <text x={312} y={14} fontSize="8.5" textAnchor="end" fill="var(--fg)">— F(s)</text>
        {showEst && <text x={312} y={24} fontSize="8.5" textAnchor="end" fill="var(--c3)">— F + bias V</text>}
        {showEst && <text x={312} y={34} fontSize="8.5" textAnchor="end" fill="var(--c1)">- - estimate of F from bias</text>}
        <text x={168} y={152} fontSize="8.5" textAnchor="middle" fill="var(--muted)">collective variable s →</text>
        <rect x={24} y={158} width={290} height={72} fill="none" stroke="var(--grid)" />
        <line x1={24} x2={314} y1={ty(0)} y2={ty(0)} stroke="var(--grid)" strokeDasharray="2 3" />
        <path d={pathOf(S.trace.map((v, i) => [24 + (i * 290) / 239, ty(v)]))} fill="none" stroke="var(--c2)" strokeWidth={1.2} />
        <text x={20} y={ty(1) + 3} fontSize="8" textAnchor="end" fill="var(--muted)">+1</text>
        <text x={20} y={ty(-1) + 3} fontSize="8" textAnchor="end" fill="var(--muted)">−1</text>
        <text x={28} y={168} fontSize="8.5" fill="var(--muted)">s(t) trace · {m === 'plain' ? 'no bias' : `${S.hills} hills deposited`}</text>
      </Stage>
      <Controls>
        <PlayPause running={running} set={setRunning} />
        <Btn onClick={reset}>↺ Reset</Btn>
        <Btn active={m === 'plain'} onClick={() => { setM('plain'); reset(); }}>Plain MD</Btn>
        <Btn active={m === 'metad'} onClick={() => { setM('metad'); reset(); }}>Metadynamics</Btn>
        <Btn active={m === 'wt'} onClick={() => { setM('wt'); reset(); }}>Well-tempered</Btn>
      </Controls>
      {m !== 'plain' && <Controls><Slider label="hill height w" min={0.05} max={1} step={0.05} value={w} onChange={setW} /></Controls>}
    </div>
  );
}
