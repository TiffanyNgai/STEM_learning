import { useMemo, useState } from 'react';
import { Btn, Controls } from './_kit';

/**
 * Interactive truth table for propositional formulas.
 * Every row assigns T/F to the variables; each column evaluates a formula. Tap a row to highlight it.
 * In quiz mode the formula cells start as "?" and are revealed by tapping them (or "Reveal all").
 * Columns that agree on every row are reported as logically equivalent (≡).
 * Formula syntax: variable names (letters), T / F constants, parentheses,
 *   not: ! ~ ¬   and: & ∧   or: | ∨   implies: -> →   iff: <-> ↔
 *   precedence: not > and > or > implies (right-assoc.) > iff.
 * props: {
 *   vars?: string[]                         (default ['P', 'Q'])
 *   columns?: { label?: string; expr: string }[]  (default [{ expr: 'P -> Q' }])
 *   quiz?: boolean                          (default false: hide formula cells until tapped)
 * }
 */
type Node = { k: 'v'; n: string } | { k: 'c'; v: boolean } | { k: 'not'; a: Node } | { k: 'and' | 'or' | 'imp' | 'iff'; a: Node; b: Node };

function tokenize(s: string): string[] {
  const out: string[] = []; let i = 0;
  while (i < s.length) {
    const c = s[i];
    if (/\s/.test(c)) { i++; continue; }
    if (s.startsWith('<->', i)) { out.push('iff'); i += 3; continue; }
    if (s.startsWith('->', i)) { out.push('imp'); i += 2; continue; }
    if (c === '↔') { out.push('iff'); i++; continue; }
    if (c === '→') { out.push('imp'); i++; continue; }
    if ('!~¬'.includes(c)) { out.push('not'); i++; continue; }
    if ('&∧'.includes(c)) { out.push('and'); i++; continue; }
    if ('|∨'.includes(c)) { out.push('or'); i++; continue; }
    if (c === '(' || c === ')') { out.push(c); i++; continue; }
    const m = /^[A-Za-z_][A-Za-z0-9_]*/.exec(s.slice(i));
    if (m) { out.push('$' + m[0]); i += m[0].length; continue; }
    throw new Error('bad char ' + c);
  }
  return out;
}

function parse(src: string): Node {
  const t = tokenize(src); let p = 0;
  const peek = () => t[p];
  const bin = (k: 'and' | 'or' | 'iff', next: () => Node) => () => { let a = next(); while (peek() === k) { p++; a = { k, a, b: next() }; } return a; };
  const atom = (): Node => {
    const x = t[p++];
    if (x === 'not') return { k: 'not', a: atom() };
    if (x === '(') { const e = iff(); if (t[p++] !== ')') throw new Error('missing )'); return e; }
    if (x === '$T') return { k: 'c', v: true };
    if (x === '$F') return { k: 'c', v: false };
    if (x && x[0] === '$') return { k: 'v', n: x.slice(1) };
    throw new Error('unexpected ' + x);
  };
  const and = bin('and', atom);
  const or = bin('or', and);
  const imp = (): Node => { const a = or(); if (peek() === 'imp') { p++; return { k: 'imp', a, b: imp() }; } return a; };
  const iff = bin('iff', imp);
  const e = iff();
  if (p !== t.length) throw new Error('trailing input');
  return e;
}

function evalNode(n: Node, env: Record<string, boolean>): boolean {
  switch (n.k) {
    case 'v': return !!env[n.n];
    case 'c': return n.v;
    case 'not': return !evalNode(n.a, env);
    case 'and': return evalNode(n.a, env) && evalNode(n.b, env);
    case 'or': return evalNode(n.a, env) || evalNode(n.b, env);
    case 'imp': return !evalNode(n.a, env) || evalNode(n.b, env);
    case 'iff': return evalNode(n.a, env) === evalNode(n.b, env);
  }
}

const pretty = (s: string) => s.replace(/<->/g, '↔').replace(/->/g, '→').replace(/[!~]/g, '¬').replace(/&/g, '∧').replace(/\|/g, '∨');

export default function MathTruthTable({ vars = ['P', 'Q'], columns = [{ expr: 'P -> Q' }], quiz = false }: {
  vars?: string[]; columns?: { label?: string; expr: string }[]; quiz?: boolean;
}) {
  const vs = vars.slice(0, 4);
  const cols = useMemo(() => columns.map((c) => {
    try { return { label: c.label ?? pretty(c.expr), f: parse(c.expr) }; } catch { return { label: (c.label ?? c.expr) + ' (?)', f: null }; }
  }), [columns]);
  const rows = useMemo(() => Array.from({ length: 1 << vs.length }, (_, r) => {
    const env: Record<string, boolean> = {};
    vs.forEach((v, i) => { env[v] = !((r >> (vs.length - 1 - i)) & 1); }); // TT..T first, FF..F last
    return { env, vals: cols.map((c) => (c.f ? evalNode(c.f, env) : false)) };
  }), [vs.join(','), cols]);
  const [shown, setShown] = useState<Set<string>>(new Set());
  const [sel, setSel] = useState<number | null>(null);
  const isShown = (r: number, c: number) => !quiz || shown.has(r + ':' + c);
  const reveal = (r: number, c: number) => setShown((s) => new Set(s).add(r + ':' + c));
  const allShown = !quiz || shown.size >= rows.length * cols.length;

  const equiv: string[] = [];
  if (allShown) for (let a = 0; a < cols.length; a++) for (let b = a + 1; b < cols.length; b++)
    if (rows.every((r) => r.vals[a] === r.vals[b])) equiv.push(`${cols[a].label} ≡ ${cols[b].label}`);

  const cell = (v: boolean, visible: boolean, isVar: boolean) => ({
    padding: '5px 6px', textAlign: 'center' as const, fontWeight: 800, borderBottom: '1px solid var(--border)',
    color: !visible ? 'var(--muted)' : v ? 'var(--c1)' : 'var(--c5)',
    background: isVar ? 'transparent' : visible ? (v ? 'color-mix(in srgb, var(--c1) 14%, transparent)' : 'color-mix(in srgb, var(--c5) 12%, transparent)') : 'var(--surface-2)',
    cursor: visible ? 'default' : 'pointer',
  });
  return (
    <div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: 14, fontVariantNumeric: 'tabular-nums' }}>
          <thead>
            <tr>
              {vs.map((v) => <th key={v} style={{ padding: '5px 6px', borderBottom: '2px solid var(--fg)' }}>{v}</th>)}
              {cols.map((c, i) => <th key={i} style={{ padding: '5px 6px', borderBottom: '2px solid var(--fg)', borderLeft: i === 0 ? '2px solid var(--fg)' : undefined, color: 'var(--c2)', whiteSpace: 'nowrap' }}>{c.label}</th>)}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, ri) => (
              <tr key={ri} onClick={() => setSel(sel === ri ? null : ri)}
                style={{ outline: sel === ri ? '2px solid var(--c4)' : undefined, outlineOffset: -2 }}>
                {vs.map((v) => <td key={v} style={cell(r.env[v], true, true)}>{r.env[v] ? 'T' : 'F'}</td>)}
                {r.vals.map((val, ci) => {
                  const vis = isShown(ri, ci);
                  return (
                    <td key={ci} style={{ ...cell(val, vis, false), borderLeft: ci === 0 ? '2px solid var(--fg)' : undefined }}
                      onClick={(e) => { if (!vis) { e.stopPropagation(); reveal(ri, ci); } }}>
                      {vis ? (val ? 'T' : 'F') : '?'}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Controls>
        {quiz && <Btn onClick={() => setShown(new Set(rows.flatMap((_, r) => cols.map((_, c) => r + ':' + c))))}>Reveal all</Btn>}
        {quiz && <Btn onClick={() => setShown(new Set())}>Hide</Btn>}
        <span className="w-muted">
          {quiz && !allShown ? 'Tap a ? to check your prediction.' : equiv.length ? 'Equivalent: ' + equiv.join(';  ') : 'Tap a row to highlight it.'}
        </span>
      </Controls>
    </div>
  );
}
