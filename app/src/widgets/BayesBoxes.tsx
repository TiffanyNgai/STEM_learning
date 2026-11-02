import { useState } from 'react';
import { Btn, C, Controls, Slider, Stage } from './_kit';

/**
 * Bayes' rule with natural frequencies: 1000 people as dots, coloured by disease status and
 * test result, plus a bar comparing true vs false positives → P(disease | positive test).
 * props: { prevalence?: number (default 0.01), sensitivity?: number (P(+|D), default 0.9),
 *          specificity?: number (P(−|no D), default 0.95), sliders?: boolean (default true),
 *          labels?: { condition?: string } (default 'disease') }
 */
const COLS = 40, ROWS = 25, N = COLS * ROWS;

export default function BayesBoxes({ prevalence = 0.01, sensitivity = 0.9, specificity = 0.95, sliders = true, labels = {} }: {
  prevalence?: number; sensitivity?: number; specificity?: number; sliders?: boolean; labels?: { condition?: string };
}) {
  const [prev, setPrev] = useState(prevalence);
  const [sens, setSens] = useState(sensitivity);
  const [spec, setSpec] = useState(specificity);
  const [onlyPos, setOnlyPos] = useState(false);
  const cond = labels.condition ?? 'disease';
  // exact probabilities
  const pTP = prev * sens, pFN = prev * (1 - sens), pFP = (1 - prev) * (1 - spec);
  const post = pTP + pFP > 0 ? pTP / (pTP + pFP) : 0;
  // rounded natural frequencies for the dot picture
  const nD = Math.round(prev * N);
  const nTP = Math.round(nD * sens);
  const nFP = Math.round((N - nD) * (1 - spec));
  const kind = (i: number) => (i < nTP ? 'TP' : i < nD ? 'FN' : i < nD + nFP ? 'FP' : 'TN');
  const fill: Record<string, string> = { TP: C[4], FN: C[4], FP: C[2], TN: 'var(--muted)' };
  const op: Record<string, number> = { TP: 1, FN: 0.35, FP: 1, TN: 0.18 };
  // dots fill column by column so the diseased group forms a block on the left
  const dot = (i: number) => ({ x: 14 + Math.floor(i / ROWS) * 7.4, y: 10 + (i % ROWS) * 6.2 });
  const pos = nTP + nFP;
  const barW = 292;
  const tpW = pTP + pFP > 0 ? barW * post : 0;

  return (
    <div>
      <Stage w={320} h={236} label={`Bayes: of 1000 people, ${nTP} true positives and ${nFP} false positives`}>
        {Array.from({ length: N }, (_, i) => {
          const k = kind(i); const { x, y } = dot(i);
          const show = !onlyPos || k === 'TP' || k === 'FP';
          return <circle key={i} cx={x} cy={y} r={2.4} fill={fill[k]} opacity={show ? op[k] : 0.05} />;
        })}
        <g fontSize="9">
          <circle cx={16} cy={170} r={3} fill={C[4]} /><text x={22} y={173} fill="var(--fg)">{cond}, test + ({nTP})</text>
          <circle cx={16} cy={182} r={3} fill={C[4]} opacity={0.35} /><text x={22} y={185} fill="var(--fg)">{cond}, test − ({nD - nTP})</text>
          <circle cx={168} cy={170} r={3} fill={C[2]} /><text x={174} y={173} fill="var(--fg)">no {cond}, test + ({nFP})</text>
          <circle cx={168} cy={182} r={3} fill="var(--muted)" opacity={0.4} /><text x={174} y={185} fill="var(--fg)">no {cond}, test − ({N - nD - nFP})</text>
        </g>
        <text x={14} y={202} fontSize="9" fill="var(--muted)">All {pos} positive tests:</text>
        <rect x={14} y={206} width={barW} height={12} fill={C[2]} rx={2} />
        <rect x={14} y={206} width={tpW} height={12} fill={C[4]} rx={2} />
        <text x={14} y={231} fontSize="10" fill="var(--fg)" fontWeight="bold">
          P({cond} | +) = {(pTP).toPrecision(3)} / ({(pTP).toPrecision(3)} + {(pFP).toPrecision(3)}) = {(post * 100).toFixed(1)}%
        </text>
      </Stage>
      <Controls>
        {sliders && <>
          <Slider label="prevalence" min={0.001} max={0.5} step={0.001} value={prev} onChange={setPrev} format={(v) => (v * 100).toFixed(1) + '%'} />
          <Slider label="sensitivity" min={0.5} max={1} step={0.01} value={sens} onChange={setSens} format={(v) => (v * 100).toFixed(0) + '%'} />
          <Slider label="specificity" min={0.5} max={1} step={0.005} value={spec} onChange={setSpec} format={(v) => (v * 100).toFixed(1) + '%'} />
        </>}
        <Btn active={onlyPos} onClick={() => setOnlyPos(!onlyPos)}>Only positives</Btn>
      </Controls>
      <p className="w-muted" style={{ fontSize: '0.8em', margin: '4px 0 0' }}>
        Missed cases (false negatives): {(pFN * 1000).toFixed(1)} per 1000. Dots are rounded counts; the % uses exact probabilities.
      </p>
    </div>
  );
}
