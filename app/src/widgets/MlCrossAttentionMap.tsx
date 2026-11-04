import { useMemo, useState } from 'react';
import { Btn, Controls, Stage } from './_kit';

/**
 * Cross-attention between image positions and text tokens, as used in latent diffusion.
 * Queries come from the 8×8 grid of U-Net feature positions, keys/values from the prompt tokens, so each
 * position holds a distribution over tokens: a(p, ·) = softmax_tokens(q_p·k_token/√d). Pick a token to see
 * the column of that matrix — the familiar "where does the word *cube* act?" map.
 * The scores here are HAND-MADE (schematic) so the mechanism is visible; a trained model learns them.
 * props: {
 *   tokens?: string[]   prompt tokens shown as keys (default ['a','red','cube','on','blue','table'])
 *   token?: number      initially selected token index (default 2)
 *   temp?: number       logit scale before the softmax (default 2.6)
 *   showScene?: boolean start with the reference image shown (default true)
 * }
 */
const DEF = ['a', 'red', 'cube', 'on', 'blue', 'table'];
const G = 8;
const isCube = (i: number, j: number) => i >= 2 && i <= 4 && j >= 2 && j <= 4;
const isTable = (i: number) => i >= 5;

function affinity(tok: string, i: number, j: number): number {
  const t = tok.toLowerCase();
  if (t === 'red') return isCube(i, j) ? 2.2 : -0.3;
  if (t === 'cube') return isCube(i, j) ? 2.4 : -0.25;
  if (t === 'blue') return isTable(i) ? 2.0 : -0.3;
  if (t === 'table') return isTable(i) ? 2.2 : -0.2;
  if (t === 'on') return i === 5 ? 1.4 : 0.05;
  return 0.15;
}

export default function MlCrossAttentionMap({ tokens = DEF, token = 2, temp = 2.6, showScene = true }: {
  tokens?: string[]; token?: number; temp?: number; showScene?: boolean;
}) {
  const toks = tokens.slice(0, 8);
  const [sel, setSel] = useState(Math.min(token, toks.length - 1));
  const [scene, setScene] = useState(showScene);

  const A = useMemo(() => {
    const out: number[][][] = [];
    for (let i = 0; i < G; i++) {
      const row: number[][] = [];
      for (let j = 0; j < G; j++) {
        const l = toks.map((t) => temp * affinity(t, i, j));
        const m = Math.max(...l);
        const e = l.map((v) => Math.exp(v - m));
        const z = e.reduce((s, v) => s + v, 0);
        row.push(e.map((v) => v / z));
      }
      out.push(row);
    }
    return out;
  }, [toks, temp]);

  const cell = 14, x0 = 14, x1 = 176, y0 = 32;
  const sceneFill = (i: number, j: number) => (isCube(i, j) ? 'var(--c5)' : isTable(i) ? 'var(--c2)' : 'var(--surface)');
  const colMax = Math.max(...A.flat().map((p) => p[sel]));

  return (
    <div>
      <Stage w={320} h={176} label="Cross-attention from image positions to prompt tokens">
        <text x={x0} y={14} fontSize="9" fill="var(--fg)">{scene ? 'latent image (8×8 positions)' : 'positions'}</text>
        <text x={x1} y={14} fontSize="9" fill="var(--c3)">attention to “{toks[sel]}”</text>
        <text x={x0} y={25} fontSize="8" fill="var(--muted)">queries</text>
        <text x={x1} y={25} fontSize="8" fill="var(--muted)">one column of a(p, token)</text>
        {A.map((row, i) => row.map((p, j) => (
          <g key={i + '-' + j}>
            <rect x={x0 + j * cell} y={y0 + i * cell} width={cell} height={cell}
              fill={scene ? sceneFill(i, j) : 'var(--surface)'} opacity={scene ? 0.75 : 1} stroke="var(--grid)" strokeWidth={0.4} />
            <rect x={x1 + j * cell} y={y0 + i * cell} width={cell} height={cell}
              fill="var(--c3)" opacity={Math.max(0.03, p[sel] / colMax)} stroke="var(--grid)" strokeWidth={0.4} />
          </g>
        )))}
        <text x={x0} y={y0 + G * cell + 12} fontSize="8" fill="var(--muted)">each square’s weights over tokens sum to 1</text>
        <text x={x1} y={y0 + G * cell + 12} fontSize="8" fill="var(--muted)">max weight {colMax.toFixed(2)}</text>
      </Stage>
      <Controls>
        {toks.map((t, i) => <Btn key={t + i} active={i === sel} onClick={() => setSel(i)}>{t}</Btn>)}
        <Btn active={scene} onClick={() => setScene(!scene)}>Image</Btn>
      </Controls>
    </div>
  );
}
