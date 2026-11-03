import { useMemo, useState } from 'react';
import { Btn, C, Controls, PlayPause, Stage, prefersReducedMotion, useFrame } from './_kit';

/**
 * ViT patchification. A 32×32 toy RGB-style image is cut into non-overlapping P×P patches, which fly out
 * in raster order into a sequence of tokens, preceded by a learnable [CLS] token; each token is labelled with
 * its position index. Printed: N = (H/P)·(W/P) patches, patch vector length P²·C, and the N² size of the
 * attention matrix, plus the matching numbers for a real 224×224×3 image.
 * props: {
 *   patch?: number  4, 8 or 16 (default 8)
 *   autoplay?: boolean (default true unless reduced motion)
 * }
 */
const H = 32;
function pixel(i: number, j: number): [number, number] {
  // returns [colour index, intensity]: sky, sun, hill, house
  const sun = (i - 7) ** 2 + (j - 24) ** 2 < 20;
  if (sun) return [2, 0.9];
  if (i > 18 && j > 5 && j < 15 && i < 30) return [4, (i + j) % 4 === 0 ? 0.5 : 0.8];
  if (i > 13 && i <= 18 && Math.abs(j - 10) <= i - 13) return [3, 0.85];
  if (i > 24 - 4 * Math.sin(j / 6)) return [0, 0.75];
  return [1, 0.25 + 0.02 * i];
}

export default function MlPatchify({ patch = 8, autoplay }: { patch?: number; autoplay?: boolean }) {
  const [P, setP] = useState([4, 8, 16].includes(patch) ? patch : 8);
  const [run, setRun] = useState(autoplay ?? !prefersReducedMotion());
  const [t, setT] = useState(run ? 0 : 1);
  useFrame((dt) => setT((v) => (v >= 1.6 ? 0 : v + dt * 0.4)), run);
  const g = H / P, N = g * g;
  const pix = useMemo(() => Array.from({ length: H * H }, (_, k) => pixel(Math.floor(k / H), k % H)), []);
  const ps = 3.6, ix = 6, iy = 18; // image pixel size and origin
  const perRow = Math.min(N + 1, P === 4 ? 13 : 17);
  const tokW = Math.min(17, (310 - ix) / perRow), tokGap = tokW + 1.2;
  const ty0 = iy + H * ps + 18;
  const e = Math.max(0, Math.min(1, t)), ease = e * e * (3 - 2 * e);
  const tokPos = (n: number): [number, number] => [ix + (n % perRow) * tokGap, ty0 + Math.floor(n / perRow) * (tokW + 12)];
  const rows = Math.ceil((N + 1) / perRow);
  const h = ty0 + rows * (tokW + 12) + 34;
  const sc = tokW / (P * ps); // scale of a patch when it becomes a token
  return (
    <div>
      <Stage w={320} h={h} label="An image cut into patches that become a sequence of tokens for a vision transformer">
        <text x={ix} y={12} fontSize="9" fill="var(--fg)">image 32×32, patch P = {P} → {g}×{g} grid</text>
        <text x={ix + H * ps + 10} y={34} fontSize="8.5" fill="var(--fg)">N = (32/{P})² = {N} patches</text>
        <text x={ix + H * ps + 10} y={48} fontSize="8.5" fill="var(--fg)">each patch → vector of</text>
        <text x={ix + H * ps + 10} y={60} fontSize="8.5" fill="var(--fg)">P²·C = {P}²·3 = {P * P * 3} numbers</text>
        <text x={ix + H * ps + 10} y={74} fontSize="8.5" fill="var(--fg)">attention matrix: ({N}+1)² = {(N + 1) ** 2}</text>
        <text x={ix + H * ps + 10} y={94} fontSize="7.5" fill="var(--muted)">real ViT-B/16 on 224×224×3:</text>
        <text x={ix + H * ps + 10} y={105} fontSize="7.5" fill="var(--muted)">14×14 = 196 patches of 768 numbers</text>
        {Array.from({ length: N }, (_, n) => {
          const pr = Math.floor(n / g), pc = n % g;
          const [tx, ty] = tokPos(n + 1);
          const sx = ix + pc * P * ps, sy = iy + pr * P * ps;
          const k = Math.max(0, Math.min(1, ease * 1.15 - (n / N) * 0.15));
          const X = sx + (tx - sx) * k, Y = sy + (ty - sy) * k, S = 1 + (sc - 1) * k;
          return <g key={n} transform={`translate(${X},${Y}) scale(${S})`}>
            {Array.from({ length: P * P }, (_, q) => {
              const i = pr * P + Math.floor(q / P), j = pc * P + (q % P), [ci, a] = pix[i * H + j];
              return <rect key={q} x={(q % P) * ps} y={Math.floor(q / P) * ps} width={ps + 0.05} height={ps + 0.05} fill={C[ci]} fillOpacity={a} />;
            })}
            <rect x={0} y={0} width={P * ps} height={P * ps} fill="none" stroke="var(--fg)" strokeWidth={0.6 / S} />
            {k > 0.95 && <text x={P * ps / 2} y={P * ps + 9 / S} fontSize={7 / S} textAnchor="middle" fill="var(--muted)">{n + 1}</text>}
          </g>;
        })}
        {e > 0.95 && (() => {
          const [cx, cy] = tokPos(0);
          return <g><rect x={cx} y={cy} width={tokW} height={tokW} fill={C[3]} fillOpacity={0.5} stroke="var(--fg)" strokeWidth={0.6} />
            <text x={cx + tokW / 2} y={cy + tokW / 2 + 3} fontSize="6" textAnchor="middle" fill="var(--fg)">CLS</text>
            <text x={cx + tokW / 2} y={cy + tokW + 9} fontSize="7" textAnchor="middle" fill="var(--muted)">0</text></g>;
        })()}
        <text x={ix} y={h - 18} fontSize="8" fill="var(--fg)">sequence: [CLS], patch 1 … patch {N} (raster order). Each patch is</text>
        <text x={ix} y={h - 7} fontSize="8" fill="var(--fg)">flattened, linearly projected to D dims, plus a position embedding.</text>
      </Stage>
      <Controls>
        <PlayPause running={run} set={setRun} />
        {[4, 8, 16].map((v) => <Btn key={v} active={v === P} onClick={() => { setP(v); setT(run ? 0 : 1); }}>P = {v}</Btn>)}
        <Btn onClick={() => { setT(0); setRun(true); }}>↺ Replay</Btn>
      </Controls>
    </div>
  );
}
