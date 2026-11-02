/** Helper (not a widget): seeded 2D toy datasets shared by the ML generative-model widgets. */
import { rng } from './_kit';

export type ToyName = 'moons' | 'spiral' | 'ring' | 'gmm' | 'smile';

/** Returns n points roughly inside [-2.2, 2.2]^2. */
export function toyData(name: ToyName = 'moons', n = 160, seed = 3): [number, number][] {
  const r = rng(seed); const out: [number, number][] = [];
  for (let i = 0; i < n; i++) {
    let x = 0, y = 0;
    if (name === 'moons') {
      const a = Math.PI * r.u();
      if (i % 2) { x = Math.cos(a) - 0.5; y = Math.sin(a) - 0.25; } else { x = 0.5 - Math.cos(a); y = 0.25 - Math.sin(a); }
      x = x * 1.3 + 0.06 * r.normal(); y = y * 1.3 + 0.06 * r.normal();
    } else if (name === 'spiral') {
      const t = Math.sqrt(r.u()) * 3 * Math.PI + 0.6; const s = i % 2 ? 1 : -1;
      x = s * t * Math.cos(t) / 5 + 0.05 * r.normal(); y = s * t * Math.sin(t) / 5 + 0.05 * r.normal();
    } else if (name === 'ring') {
      const k = i % 8; const a = (2 * Math.PI * k) / 8;
      x = 1.6 * Math.cos(a) + 0.12 * r.normal(); y = 1.6 * Math.sin(a) + 0.12 * r.normal();
    } else if (name === 'gmm') {
      const cs = [[-1.2, -0.8], [1.3, 1.0], [0.9, -1.2]]; const c = cs[i % 3];
      x = c[0] + 0.3 * r.normal(); y = c[1] + 0.3 * r.normal();
    } else {
      const k = i % 4;
      if (k === 0) { x = -0.8 + 0.1 * r.normal(); y = 0.9 + 0.1 * r.normal(); }
      else if (k === 1) { x = 0.8 + 0.1 * r.normal(); y = 0.9 + 0.1 * r.normal(); }
      else { const a = Math.PI * (1.15 + 0.7 * r.u()); x = 1.4 * Math.cos(a); y = 1.4 * Math.sin(a) + 0.3; x += 0.05 * r.normal(); y += 0.05 * r.normal(); }
    }
    out.push([x, y]);
  }
  return out;
}

/**
 * Posterior mean E[x1 | x] when x = a*x1 + s*eps, eps~N(0,I), x1 ~ empirical data.
 * This is the exact optimal denoiser for the empirical distribution (softmax-weighted average of data).
 */
export function posteriorMean(data: [number, number][], x: number, y: number, a: number, s: number): [number, number] {
  let m = -Infinity; const lw: number[] = new Array(data.length);
  const inv = 1 / (2 * Math.max(s * s, 1e-8));
  for (let i = 0; i < data.length; i++) {
    const dx = x - a * data[i][0], dy = y - a * data[i][1];
    lw[i] = -(dx * dx + dy * dy) * inv; if (lw[i] > m) m = lw[i];
  }
  let Z = 0, mx = 0, my = 0;
  for (let i = 0; i < data.length; i++) { const w = Math.exp(lw[i] - m); Z += w; mx += w * data[i][0]; my += w * data[i][1]; }
  return [mx / Z, my / Z];
}
