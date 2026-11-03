import { useMemo, useState } from 'react';
import { Btn, C, Controls, Slider, Stage, pathOf, scale } from './_kit';

/**
 * Enrichment (accumulation) curve for a virtual screen: fraction of the known actives recovered
 * (y) against the fraction of the ranked database screened (x), with the random baseline y = x.
 * Scores are modelled as Gaussians: decoys ~ N(0,1), actives ~ N(quality,1), so sliding the
 * "model quality" slider moves the curve from the diagonal (useless) towards the top-left corner.
 * A second slider sets the cutoff f; the readout gives the enrichment factor EF = y(f)/f together
 * with how many actives that means in a library of nTotal compounds containing nActives actives.
 * The strip above the plot shades the ranked list by local active density. The x axis can be
 * switched to log scale to see early recognition (the first 0.1–1 % of the list).
 * props: { quality?: number (0–4, default 1.6), cutoff?: number (fraction, default 0.01),
 *          nTotal?: number (default 100000), nActives?: number (default 500),
 *          logX?: boolean (default false) }
 */
function Phi(z: number) {
  // Abramowitz & Stegun 7.1.26 erf approximation (|error| < 1.5e-7)
  const x = Math.abs(z) / Math.SQRT2; const t = 1 / (1 + 0.3275911 * x);
  const y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x);
  return z >= 0 ? 0.5 * (1 + y) : 0.5 * (1 - y);
}

const XMIN = 1e-3;

export default function DrugEnrichmentCurve({ quality = 1.6, cutoff = 0.01, nTotal = 100000, nActives = 500, logX = false }: {
  quality?: number; cutoff?: number; nTotal?: number; nActives?: number; logX?: boolean;
}) {
  const [d, setD] = useState(Math.max(0, Math.min(4, quality)));
  const [lf, setLf] = useState(Math.log10(Math.max(XMIN, Math.min(0.5, cutoff))));
  const [log, setLog] = useState(logX);
  const f = Math.pow(10, lf);
  const pi = Math.max(1e-6, Math.min(0.5, nActives / nTotal));

  // curve: sweep the score threshold from high to low
  const pts = useMemo(() => {
    const out: [number, number][] = [];
    for (let i = 0; i <= 400; i++) {
      const t = 8 - (16 * i) / 400;
      const tpr = 1 - Phi(t - d), fpr = 1 - Phi(t);
      out.push([pi * tpr + (1 - pi) * fpr, tpr]);
    }
    out[0] = [0, 0]; out[out.length - 1] = [1, 1];
    return out;
  }, [d, pi]);

  const yAt = (x: number) => {
    for (let i = 1; i < pts.length; i++) {
      if (pts[i][0] >= x) {
        const [x0, y0] = pts[i - 1], [x1, y1] = pts[i];
        return x1 - x0 < 1e-12 ? y1 : y0 + ((y1 - y0) * (x - x0)) / (x1 - x0);
      }
    }
    return 1;
  };
  const yf = yAt(f);
  const ef = yf / f;
  const auc = pts.slice(1).reduce((s, p, i) => s + ((p[1] + pts[i][1]) / 2) * (p[0] - pts[i][0]), 0);
  const nTop = Math.max(1, Math.round(f * nTotal));
  const found = yf * nActives;
  const maxEF = Math.min(1 / f, 1 / pi);

  const L = 32, R = 306, T = 42, B = 158;
  const sx = log
    ? (x: number) => L + ((Math.log10(Math.max(XMIN, Math.min(1, x))) - Math.log10(XMIN)) / -Math.log10(XMIN)) * (R - L)
    : scale([0, 1], [L, R]);
  const sy = scale([0, 1], [B, T]);
  const curve = pathOf(pts.filter((p) => p[0] >= (log ? XMIN : 0)).map((p) => [sx(p[0]), sy(p[1])] as [number, number]));
  const base = pathOf((log ? [1e-3, 3e-3, 1e-2, 3e-2, 0.1, 0.3, 1] : [0, 1]).map((x) => [sx(x), sy(x)] as [number, number]));
  const xTicks: [number, string][] = log
    ? [[1e-3, '0.1%'], [1e-2, '1%'], [0.1, '10%'], [1, '100%']]
    : [[0, '0'], [0.25, '25%'], [0.5, '50%'], [0.75, '75%'], [1, '100%']];

  // density strip: local slope of the curve = how concentrated actives are there
  const strip = Array.from({ length: 64 }, (_, i) => {
    const a = log ? Math.pow(10, Math.log10(XMIN) * (1 - i / 64)) : i / 64;
    const b = log ? Math.pow(10, Math.log10(XMIN) * (1 - (i + 1) / 64)) : (i + 1) / 64;
    const slope = (yAt(b) - yAt(a)) / Math.max(1e-9, b - a);
    return [sx(a), sx(b), Math.min(1, slope / 12)] as [number, number, number];
  });

  return (
    <div>
      <Stage w={320} h={232} label={`Enrichment curve: EF at ${(f * 100).toFixed(2)}% is ${ef.toFixed(1)}`}>
        <text x={L} y={12} fontSize="9" fill="var(--muted)">ranked database, best score first →</text>
        {strip.map(([a, b, o], i) => (
          <rect key={i} x={a} y={16} width={Math.max(0.6, b - a)} height={10} fill={C[0]} opacity={0.08 + 0.9 * o} />
        ))}
        <rect x={L} y={16} width={R - L} height={10} fill="none" stroke="var(--muted)" strokeWidth={0.6} />
        {/* cutoff band */}
        <rect x={sx(log ? XMIN : 0)} y={T} width={Math.max(1, sx(f) - sx(log ? XMIN : 0))} height={B - T} fill={C[2]} opacity={0.14} />
        <line x1={sx(f)} x2={sx(f)} y1={16} y2={B} stroke={C[2]} strokeWidth={1.2} strokeDasharray="3 2" />
        {/* axes */}
        <line x1={L} x2={R} y1={B} y2={B} stroke="var(--fg)" strokeWidth={0.8} />
        <line x1={L} x2={L} y1={T} y2={B} stroke="var(--fg)" strokeWidth={0.8} />
        {[0, 0.5, 1].map((v) => (
          <g key={v}>
            <line x1={L} x2={R} y1={sy(v)} y2={sy(v)} stroke="var(--grid)" strokeWidth={0.5} />
            <text x={L - 3} y={sy(v) + 3} fontSize="7.5" textAnchor="end" fill="var(--muted)">{v * 100}%</text>
          </g>
        ))}
        {xTicks.map(([v, lab]) => <text key={lab} x={sx(v)} y={B + 9} fontSize="7.5" textAnchor="middle" fill="var(--muted)">{lab}</text>)}
        <path d={base} fill="none" stroke="var(--muted)" strokeWidth={1} strokeDasharray="4 3" />
        <path d={curve} fill="none" stroke={C[1]} strokeWidth={2} />
        <circle cx={sx(f)} cy={sy(yf)} r={4} fill={C[2]} stroke="var(--surface)" strokeWidth={1} />
        <text x={L + 4} y={T + 9} fontSize="8" fill={C[1]}>actives found</text>
        <text x={R} y={B - 4} fontSize="8" textAnchor="end" fill="var(--muted)">database screened</text>
        <text x={R} y={sy(0.08)} fontSize="7.5" textAnchor="end" fill="var(--muted)">random baseline</text>
        <g fontSize="8.5" fill="var(--fg)">
          <text x={L} y={B + 24}>top {(f * 100).toFixed(2)}% = {nTop.toLocaleString('en-US')} of {nTotal.toLocaleString('en-US')} compounds</text>
          <text x={L} y={B + 36}>contains {found.toFixed(1)} of {nActives} actives ({(100 * yf).toFixed(1)}% of them)</text>
          <text x={L} y={B + 48} fontWeight="bold" fill={C[2]}>EF = {(100 * yf).toFixed(1)}% ÷ {(f * 100).toFixed(2)}% = {ef.toFixed(1)}×</text>
          <text x={L} y={B + 60} fill="var(--muted)">max possible here {maxEF.toFixed(0)}× · curve AUC {auc.toFixed(3)}</text>
        </g>
      </Stage>
      <Controls>
        <Slider label="model quality" min={0} max={4} step={0.05} value={d} onChange={setD} />
        <Slider label="cutoff f" min={-3} max={-0.3} step={0.01} value={lf} onChange={setLf} format={(v) => (Math.pow(10, v) * 100).toFixed(2) + '%'} />
        <Btn active={!log} onClick={() => setLog(false)}>linear x</Btn>
        <Btn active={log} onClick={() => setLog(true)}>log x</Btn>
        <Btn onClick={() => { setD(Math.max(0, Math.min(4, quality))); setLf(Math.log10(Math.max(XMIN, Math.min(0.5, cutoff)))); setLog(logX); }}>Reset</Btn>
      </Controls>
    </div>
  );
}
