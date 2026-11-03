/**
 * Shared toy molecule data for the Drug* descriptor / substructure widgets (not a widget: "_" files are not registered).
 * Coordinates are 2D layout units (bond length 1). Bonds are [a, b, order] in Kekulé form; hydrogens are implicit.
 * tpsa: Ertl (2000) polar-atom contributions in Å² (O= 17.07, [OH] 20.23, -O- 9.23, [NH] 12.03).
 * logP: RDKit Crippen (Wildman & Crippen 1999) values; logPexp: approximate measured octanol/water logP.
 */
export interface ToyMol {
  name: string; smiles: string;
  atoms: [el: string, x: number, y: number][];
  bonds: [number, number, number][];
  tpsa: Record<number, [number, string]>;
  logP: number; logPexp: number;
}

export const DRUG_MOLS: Record<string, ToyMol> = {
  aspirin: {
    name: 'Aspirin', smiles: 'CC(=O)OC1=CC=CC=C1C(=O)O',
    atoms: [['C', -3.464, 1], ['C', -2.598, 0.5], ['O', -2.598, -0.5], ['O', -1.732, 1], ['C', -0.866, 0.5], ['C', -0.866, -0.5],
      ['C', 0, -1], ['C', 0.866, -0.5], ['C', 0.866, 0.5], ['C', 0, 1], ['C', 0, 2], ['O', -0.866, 2.5], ['O', 0.866, 2.5]],
    bonds: [[0, 1, 1], [1, 2, 2], [1, 3, 1], [3, 4, 1], [4, 5, 2], [5, 6, 1], [6, 7, 2], [7, 8, 1], [8, 9, 2], [9, 4, 1], [9, 10, 1], [10, 11, 2], [10, 12, 1]],
    tpsa: { 2: [17.07, 'carbonyl O (O=)'], 3: [9.23, 'ester O (–O–)'], 11: [17.07, 'carbonyl O (O=)'], 12: [20.23, 'hydroxyl O (OH)'] },
    logP: 1.31, logPexp: 1.2,
  },
  ibuprofen: {
    name: 'Ibuprofen', smiles: 'CC(C)CC1=CC=C(C=C1)C(C)C(=O)O',
    atoms: [['C', -3.598, 0.5], ['C', -2.732, 0], ['C', -2.732, -1], ['C', -1.866, 0.5], ['C', -1, 0], ['C', -0.5, 0.866], ['C', 0.5, 0.866],
      ['C', 1, 0], ['C', 0.5, -0.866], ['C', -0.5, -0.866], ['C', 1.866, 0.5], ['C', 1.866, 1.5], ['C', 2.732, 0], ['O', 3.598, 0.5], ['O', 2.732, -1]],
    bonds: [[0, 1, 1], [1, 2, 1], [1, 3, 1], [3, 4, 1], [4, 5, 2], [5, 6, 1], [6, 7, 2], [7, 8, 1], [8, 9, 2], [9, 4, 1], [7, 10, 1], [10, 11, 1], [10, 12, 1], [12, 13, 2], [12, 14, 1]],
    tpsa: { 13: [17.07, 'carbonyl O (O=)'], 14: [20.23, 'hydroxyl O (OH)'] },
    logP: 3.07, logPexp: 4.0,
  },
  paracetamol: {
    name: 'Paracetamol', smiles: 'CC(=O)NC1=CC=C(O)C=C1',
    atoms: [['C', -3.598, 0.5], ['C', -2.732, 0], ['O', -2.732, -1], ['N', -1.866, 0.5], ['C', -1, 0], ['C', -0.5, 0.866], ['C', 0.5, 0.866],
      ['C', 1, 0], ['O', 2, 0], ['C', 0.5, -0.866], ['C', -0.5, -0.866]],
    bonds: [[0, 1, 1], [1, 2, 2], [1, 3, 1], [3, 4, 1], [4, 5, 2], [5, 6, 1], [6, 7, 2], [7, 8, 1], [7, 9, 1], [9, 10, 2], [10, 4, 1]],
    tpsa: { 2: [17.07, 'carbonyl O (O=)'], 3: [12.03, 'amide N (NH)'], 8: [20.23, 'hydroxyl O (OH)'] },
    logP: 1.35, logPexp: 0.5,
  },
};

const VAL: Record<string, number> = { C: 4, N: 3, O: 2 };
const MASS: Record<string, number> = { C: 12.011, H: 1.008, N: 14.007, O: 15.999 };

/** Implicit H count per atom (valence minus bond orders). */
export const hCounts = (m: ToyMol) => m.atoms.map(([el], i) =>
  VAL[el] - m.bonds.reduce((s, [a, b, o]) => s + (a === i || b === i ? o : 0), 0));

/** Shortest-path (bond-count) distance matrix by BFS. */
export function topoDist(m: ToyMol): number[][] {
  const n = m.atoms.length;
  const nb: number[][] = m.atoms.map(() => []);
  m.bonds.forEach(([a, b]) => { nb[a].push(b); nb[b].push(a); });
  return m.atoms.map((_, s) => {
    const d = new Array(n).fill(-1); d[s] = 0; const q = [s];
    while (q.length) { const u = q.shift()!; for (const v of nb[u]) if (d[v] < 0) { d[v] = d[u] + 1; q.push(v); } }
    return d;
  });
}

/** Simple 2D descriptors computed from the graph. */
export function descriptors(m: ToyMol) {
  const H = hCounts(m);
  const count = (el: string) => m.atoms.filter((a) => a[0] === el).length;
  const nH = H.reduce((s, h) => s + h, 0);
  const mw = m.atoms.reduce((s, [el]) => s + MASS[el], 0) + nH * MASS.H;
  const formula = ['C', 'H', 'N', 'O'].map((el) => { const k = el === 'H' ? nH : count(el); return k ? el + (k > 1 ? k : '') : ''; }).join('');
  const hbd = m.atoms.filter(([el], i) => (el === 'N' || el === 'O') && H[i] > 0).length;
  const hba = count('N') + count('O');
  const tpsa = Object.values(m.tpsa).reduce((s, [v]) => s + v, 0);
  const D = topoDist(m);
  let wiener = 0;
  D.forEach((row, i) => row.forEach((d, j) => { if (j > i) wiener += d; }));
  return { mw, formula, hbd, hba, tpsa, wiener, heavy: m.atoms.length, logP: m.logP, logPexp: m.logPexp };
}

/** Fit atom coordinates into a pixel box; returns px, py mappers. */
export function fitBox(m: ToyMol, box: [number, number, number, number], maxK = 34) {
  const xs = m.atoms.map((a) => a[1]); const ys = m.atoms.map((a) => a[2]);
  const [x0, x1, y0, y1] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
  const k = Math.min((box[2] - box[0] - 24) / (x1 - x0), (box[3] - box[1] - 24) / (y1 - y0), maxK);
  return {
    px: (x: number) => (box[0] + box[2]) / 2 + (x - (x0 + x1) / 2) * k,
    py: (y: number) => (box[1] + box[3]) / 2 - (y - (y0 + y1) / 2) * k,
  };
}

export const ELC: Record<string, string> = { C: 'var(--fg)', N: 'var(--c2)', O: 'var(--c5)' };
