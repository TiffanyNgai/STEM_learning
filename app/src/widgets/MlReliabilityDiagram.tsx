import { useMemo, useState } from 'react';
import { Btn, C, Controls, Slider, Stage, rng, scale } from './_kit';

/**
 * Calibration of a binary classifier and temperature scaling.
 * Simulation: each example has a true log-odds z ~ N(0, spread²); its label is 1 with probability σ(z).
 * The model outputs logit c·z (c > 1 = over-confident, c < 1 = under-confident); temperature scaling
 * divides the logit by T, so the predicted probability is σ(c·z / T). T = c gives perfect calibration.
 * Left: reliability diagram for the top-label confidence max(p̂, 1 − p̂), 10 bins over [0.5, 1]
 * (bars = accuracy per bin, red gap = confidence − accuracy). Right/below: ECE, NLL, Brier score, accuracy.
 * Accuracy never changes with T (dividing by T > 0 does not change which side of 0 the logit is on).
 * props: { overconfidence?: number (c, default 2.5), temperature?: number (initial T, default 1),
 *          spread?: number (sd of z, default 1.5), n?: number (examples, default 4000),
 *          showC?: boolean (slider for c, default false), seed?: number (default 11) }
 */
const sig = (u: number) => 1 / (1 + Math.exp(-u));

export default function MlReliabilityDiagram({ overconfidence = 2.5, temperature = 1, spread = 1.5, n = 4000, showC = false, seed = 11 }: {
  overconfidence?: number; temperature?: number; spread?: number; n?: number; showC?: boolean; seed?: number;
}) {
  const [c, setC] = useState(overconfidence);
  const [T, setT] = useState(temperature);
  const N = Math.max(200, Math.min(20000, Math.round(n)));
  const data = useMemo(() => {
    const r = rng(seed); const z: number[] = [], y: number[] = [];
    for (let i = 0; i < N; i++) { const zi = spread * r.normal(); z.push(zi); y.push(r.u() < sig(zi) ? 1 : 0); }
    return { z, y };
  }, [N, spread, seed]);

  const evalT = (temp: number) => {
    const bins = Array.from({ length: 10 }, () => ({ n: 0, conf: 0, acc: 0 }));
    let nll = 0, brier = 0, correct = 0;
    data.z.forEach((zi, i) => {
      const p = Math.min(1 - 1e-12, Math.max(1e-12, sig((c * zi) / temp))); const yi = data.y[i];
      nll -= yi ? Math.log(p) : Math.log(1 - p); brier += (p - yi) ** 2;
      const pred = p >= 0.5 ? 1 : 0; const conf = Math.max(p, 1 - p); const ok = pred === yi ? 1 : 0; correct += ok;
      const b = bins[Math.min(9, Math.floor((conf - 0.5) * 20))]; b.n++; b.conf += conf; b.acc += ok;
    });
    const ece = bins.reduce((s, b) => s + (b.n ? Math.abs(b.acc - b.conf) / N : 0), 0);
    return { bins, nll: nll / N, brier: brier / N, acc: correct / N, ece };
  };
  const m = useMemo(() => evalT(T), [data, c, T]); // eslint-disable-line react-hooks/exhaustive-deps
  const fitT = () => {
    let best = 1, bestN = Infinity;
    for (let lt = -1; lt <= 1.3; lt += 0.01) { const t = 10 ** lt; const v = evalT(t).nll; if (v < bestN) { bestN = v; best = t; } }
    setT(+best.toFixed(2));
  };

  const box: [number, number, number, number] = [30, 10, 190, 170];
  const sx = scale([0.5, 1], [box[0], box[2]]); const sy = scale([0.5, 1], [box[3], box[1]]);
  const syc = (v: number) => sy(Math.max(0.5, v));

  return (
    <div>
      <Stage w={320} h={200} label="Reliability diagram with temperature scaling">
        <rect x={box[0]} y={box[1]} width={box[2] - box[0]} height={box[3] - box[1]} fill="var(--surface)" stroke="var(--grid)" />
        {[0.5, 0.6, 0.7, 0.8, 0.9, 1].map((v) => <g key={v}>
          <text x={sx(v)} y={box[3] + 9} fontSize="7" textAnchor="middle" fill="var(--muted)">{v}</text>
          <text x={box[0] - 3} y={sy(v) + 3} fontSize="7" textAnchor="end" fill="var(--muted)">{v}</text>
        </g>)}
        {m.bins.map((b, i) => {
          if (!b.n) return null;
          const x0 = sx(0.5 + i * 0.05) + 1, w = sx(0.55) - sx(0.5) - 2;
          const acc = b.acc / b.n, conf = b.conf / b.n;
          return <g key={i}>
            <rect x={x0} y={syc(acc)} width={w} height={box[3] - syc(acc)} fill={C[1]} opacity={0.75} />
            <rect x={x0} y={Math.min(syc(acc), syc(conf))} width={w} height={Math.abs(syc(acc) - syc(conf))} fill={C[4]} opacity={0.45} />
          </g>;
        })}
        <line x1={sx(0.5)} y1={sy(0.5)} x2={sx(1)} y2={sy(1)} stroke="var(--fg)" strokeDasharray="4 3" />
        <text x={(box[0] + box[2]) / 2} y={194} fontSize="8" textAnchor="middle" fill="var(--fg)">confidence (top-label probability)</text>
        <text x={box[0] + 4} y={box[1] + 10} fontSize="8" fill="var(--fg)">accuracy per bin</text>
        <text x={box[0] + 4} y={box[1] + 20} fontSize="7" fill="var(--muted)">dashed = perfect calibration</text>
        <g fontSize="9" fill="var(--fg)">
          <text x={202} y={24}>logit scale c = {c.toFixed(2)}</text>
          <text x={202} y={38}>temperature T = {T.toFixed(2)}</text>
          <text x={202} y={62} fill={C[4]}>ECE {(100 * m.ece).toFixed(1)}%</text>
          <text x={202} y={76}>NLL {m.nll.toFixed(3)}</text>
          <text x={202} y={90}>Brier {m.brier.toFixed(3)}</text>
          <text x={202} y={104} fill={C[1]}>accuracy {(100 * m.acc).toFixed(1)}%</text>
          <text x={202} y={128} fontSize="8" fill="var(--muted)">{c / T > 1.05 ? 'over-confident' : c / T < 0.95 ? 'under-confident' : 'well calibrated'}</text>
          <text x={202} y={140} fontSize="8" fill="var(--muted)">(effective scale c/T = {(c / T).toFixed(2)})</text>
          <text x={202} y={160} fontSize="8"><tspan fill={C[1]}>■ accuracy</tspan> <tspan fill={C[4]}>■ gap</tspan></text>
        </g>
      </Stage>
      <Controls>
        <Slider label="temperature T" min={0.25} max={5} step={0.05} value={T} onChange={setT} />
        {showC && <Slider label="logit scale c" min={0.3} max={4} step={0.05} value={c} onChange={setC} />}
        <Btn onClick={fitT}>Fit T (min NLL)</Btn>
        <Btn onClick={() => setT(1)}>T = 1</Btn>
      </Controls>
    </div>
  );
}
