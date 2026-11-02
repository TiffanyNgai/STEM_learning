import { useMemo, useRef, useState } from 'react';
import { Btn, C, Controls, PlayPause, Stage, useFrame } from './_kit';

/**
 * Step through BFS, DFS or Dijkstra on a small graph, showing the queue / call stack / priority
 * queue, visited colouring, the tree of discovery edges and distance labels.
 * props: { algorithm?: 'bfs'|'dfs'|'dijkstra' (default 'bfs'), algorithms?: same[] (picker; [] hides),
 *          nodes?: [id, x, y][] (positions in a 320×170 box), edges?: [u, v, weight?][],
 *          start?: string (default first node), directed?: boolean, weighted?: boolean (show weights; default = algorithm is dijkstra) }
 * Colours: white = undiscovered, orange = in the frontier / on the stack, red = being processed, green = finished.
 */
type Algo = 'bfs' | 'dfs' | 'dijkstra';
type St = 'new' | 'frontier' | 'current' | 'done';
interface Frame { st: Record<string, St>; edge: [string, string] | null; tree: [string, string][]; dist: Record<string, number>; ds: string; order: string[]; note: string }

const DEF_NODES: [string, number, number][] = [['A', 30, 45], ['B', 115, 22], ['C', 105, 110], ['D', 195, 65], ['E', 200, 150], ['F', 290, 35], ['G', 290, 130]];
const DEF_EDGES: [string, string, number][] = [['A', 'B', 4], ['A', 'C', 2], ['B', 'C', 1], ['B', 'D', 5], ['C', 'D', 8], ['C', 'E', 10], ['D', 'E', 2], ['D', 'F', 6], ['E', 'G', 3], ['F', 'G', 1]];

function run(algo: Algo, ids: string[], edges: [string, string, number?][], s: string, directed: boolean): Frame[] {
  const adj: Record<string, [string, number][]> = Object.fromEntries(ids.map((i) => [i, []]));
  for (const [u, v, w = 1] of edges) { adj[u]?.push([v, w]); if (!directed) adj[v]?.push([u, w]); }
  for (const k of ids) adj[k].sort((a, b) => a[0].localeCompare(b[0]));
  const st: Record<string, St> = Object.fromEntries(ids.map((i) => [i, 'new']));
  const dist: Record<string, number> = Object.fromEntries(ids.map((i) => [i, Infinity]));
  const tree: [string, string][] = []; const order: string[] = []; const F: Frame[] = [];
  let ds = '';
  const push = (note: string, edge: [string, string] | null = null) =>
    F.push({ st: { ...st }, edge, tree: tree.slice(), dist: { ...dist }, ds, order: order.slice(), note });
  if (algo === 'bfs') {
    const q = [s]; st[s] = 'frontier'; dist[s] = 0; ds = `Queue: [${q}]`;
    push(`Enqueue start ${s}`);
    while (q.length) {
      const u = q.shift()!; st[u] = 'current'; order.push(u); ds = `Queue: [${q.join(', ')}]`;
      push(`Dequeue ${u} (front of queue)`);
      for (const [v] of adj[u]) {
        if (st[v] === 'new') {
          st[v] = 'frontier'; dist[v] = dist[u] + 1; tree.push([u, v]); q.push(v); ds = `Queue: [${q.join(', ')}]`;
          push(`${u}–${v}: ${v} is new → enqueue at back (distance ${dist[v]})`, [u, v]);
        } else push(`${u}–${v}: ${v} already discovered, skip`, [u, v]);
      }
      st[u] = 'done'; push(`${u} finished`);
    }
  } else if (algo === 'dfs') {
    const stack: string[] = [];
    const visit = (u: string) => {
      if (stack.length) st[stack[stack.length - 1]] = 'frontier';
      stack.push(u); st[u] = 'current'; order.push(u); dist[u] = stack.length - 1; ds = `Call stack: ${stack.join(' → ')}`;
      push(`Visit ${u}`);
      for (const [v] of adj[u]) {
        if (st[v] === 'new') { tree.push([u, v]); push(`${u}–${v}: ${v} is new → go deeper`, [u, v]); visit(v); st[u] = 'current'; ds = `Call stack: ${stack.join(' → ')}`; push(`Back at ${u}`); }
        else push(`${u}–${v}: ${v} already seen, skip`, [u, v]);
      }
      stack.pop(); st[u] = 'done'; ds = `Call stack: ${stack.join(' → ') || '(empty)'}`;
      push(`${u} finished — backtrack`);
    };
    visit(s);
  } else {
    const pq: [number, string][] = [[0, s]]; dist[s] = 0; st[s] = 'frontier';
    const show = () => { pq.sort((a, b) => a[0] - b[0] || a[1].localeCompare(b[1])); ds = `PQ: ${pq.map(([d, v]) => `(${v}:${d})`).join(' ') || '(empty)'}`; };
    show(); push(`dist[${s}] = 0, all others ∞`);
    while (pq.length) {
      show(); const [d, u] = pq.shift()!; show();
      if (st[u] === 'done') { push(`Pop (${u}:${d}) — stale entry, ${u} already final`); continue; }
      st[u] = 'current'; order.push(u); push(`Extract min: ${u} with dist ${d} — now final`);
      for (const [v, w] of adj[u]) {
        if (st[v] === 'done') continue;
        if (d + w < dist[v]) {
          const old = dist[v]; dist[v] = d + w; st[v] = 'frontier'; pq.push([d + w, v]);
          const i = tree.findIndex(([, b]) => b === v); if (i >= 0) tree.splice(i, 1); tree.push([u, v]); show();
          push(`Relax ${u}→${v}: ${d} + ${w} = ${d + w} < ${old === Infinity ? '∞' : old} → update`, [u, v]);
        } else push(`Relax ${u}→${v}: ${d} + ${w} = ${d + w} ≥ ${dist[v]}, no change`, [u, v]);
      }
      st[u] = 'done'; show(); push(`${u} done`);
    }
  }
  push(`Finished. Visit order: ${order.join(', ')}`);
  return F;
}

export default function GraphTraversal({ algorithm = 'bfs', algorithms, nodes = DEF_NODES, edges = DEF_EDGES, start, directed = false, weighted }: {
  algorithm?: Algo; algorithms?: Algo[]; nodes?: [string, number, number][]; edges?: [string, string, number?][]; start?: string; directed?: boolean; weighted?: boolean;
}) {
  const [algo, setAlgo] = useState<Algo>(algorithm);
  const [k, setK] = useState(0);
  const [running, setRunning] = useState(false);
  const acc = useRef(0);
  const ids = nodes.map((n) => n[0]);
  const s = start && ids.includes(start) ? start : ids[0];
  const frames = useMemo(() => run(algo, ids, edges, s, directed), [algo, nodes, edges, s, directed]); // eslint-disable-line react-hooks/exhaustive-deps
  const f = frames[Math.min(k, frames.length - 1)];
  useFrame((dt) => {
    acc.current += dt * 1.2;
    if (acc.current >= 1) { acc.current = 0; const nv = Math.min(frames.length - 1, k + 1); setK(nv); if (nv === frames.length - 1) setRunning(false); }
  }, running);
  const pos = Object.fromEntries(nodes.map(([id, x, y]) => [id, [x, y + 15]]));
  const showW = weighted ?? algo === 'dijkstra';
  const isTree = (u: string, v: string) => f.tree.some(([a, b]) => (a === u && b === v) || (!directed && a === v && b === u));
  const isCur = (u: string, v: string) => !!f.edge && ((f.edge[0] === u && f.edge[1] === v) || (!directed && f.edge[0] === v && f.edge[1] === u));
  const fill: Record<St, string> = { new: 'var(--surface)', frontier: C[2], current: C[4], done: C[0] };
  const list = algorithms ?? (['bfs', 'dfs', 'dijkstra'] as Algo[]);
  const R = 11;
  return (
    <div>
      <Stage h={200} label={`${algo.toUpperCase()} on a graph`}>
        <defs><marker id="gt-arrow" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0L10,5L0,10z" fill="var(--muted)" /></marker></defs>
        {edges.map(([u, v, w = 1]) => {
          const [x1, y1] = pos[u]; const [x2, y2] = pos[v]; const L = Math.hypot(x2 - x1, y2 - y1) || 1;
          const ux = (x2 - x1) / L; const uy = (y2 - y1) / L;
          const col = isCur(u, v) ? C[4] : isTree(u, v) ? C[0] : 'var(--muted)';
          return (
            <g key={`${u}-${v}`}>
              <line x1={x1 + ux * R} y1={y1 + uy * R} x2={x2 - ux * R} y2={y2 - uy * R} stroke={col} strokeWidth={isCur(u, v) ? 3 : isTree(u, v) ? 2.5 : 1} markerEnd={directed ? 'url(#gt-arrow)' : undefined} />
              {showW && <text x={(x1 + x2) / 2 - uy * 7} y={(y1 + y2) / 2 + ux * 7 + 3} fontSize="9" textAnchor="middle" fill="var(--fg)">{w}</text>}
            </g>
          );
        })}
        {nodes.map(([id]) => {
          const [x, y] = pos[id]; const stt = f.st[id]; const d = f.dist[id];
          return (
            <g key={id}>
              <circle cx={x} cy={y} r={R} fill={fill[stt]} stroke="var(--fg)" strokeWidth={id === s ? 2 : 1} style={{ transition: 'fill .3s' }} />
              <text x={x} y={y + 3.5} fontSize="10" fontWeight={700} textAnchor="middle" fill={stt === 'new' ? 'var(--fg)' : 'var(--surface)'}>{id}</text>
              {algo !== 'dfs' && <text x={x} y={y - R - 3} fontSize="8.5" textAnchor="middle" fill="var(--c2)">{d === Infinity ? '∞' : d}</text>}
            </g>
          );
        })}
        <text x={4} y={10} fontSize="9" fill="var(--fg)">{f.ds}</text>
      </Stage>
      <div className="w-muted" style={{ fontSize: '0.85em', minHeight: '2.6em' }}>
        <div><b>{f.note}</b></div>
        <div>Visited order: {f.order.join(' → ') || '—'}</div>
      </div>
      <Controls>
        {list.length > 1 && list.map((a) => <Btn key={a} active={a === algo} onClick={() => { setAlgo(a); setK(0); setRunning(false); }}>{a === 'dijkstra' ? 'Dijkstra' : a.toUpperCase()}</Btn>)}
      </Controls>
      <Controls>
        <Btn onClick={() => { setRunning(false); setK(0); }}>⏮</Btn>
        <Btn onClick={() => { setRunning(false); setK((v) => Math.max(0, v - 1)); }}>◀</Btn>
        <PlayPause running={running} set={(r) => { if (r && k >= frames.length - 1) setK(0); setRunning(r); }} />
        <Btn onClick={() => { setRunning(false); setK((v) => Math.min(frames.length - 1, v + 1)); }}>▶</Btn>
        <span className="w-muted">{k}/{frames.length - 1}</span>
      </Controls>
    </div>
  );
}
