import { useEffect, useMemo, useRef, useState } from 'react';
import type { Card } from '../../content/types';
import { Rich, inline } from '../../lib/Rich';
import { WidgetHost } from '../WidgetHost';

export type Exercise = Exclude<Card, { kind: 'explain' | 'widget' | 'recall' }>;
/** Each exercise reports: can it be checked yet, and a check() returning correctness. */
export interface ExProps<T extends Exercise> { card: T; locked: boolean; onReady: (check: (() => boolean) | null) => void; seed: number }

function shuffle<T>(arr: T[], seed: number): T[] {
  const a = arr.slice(); let s = seed || 1;
  for (let i = a.length - 1; i > 0; i--) { s = (s * 16807) % 2147483647; const j = s % (i + 1); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}
const LETTERS = 'ABCDEFGH';

/** Indices are always the author's original choice indices; `order` only changes where each is shown. */
function Choices({ choices, order, selected, toggle, locked, correct }: { choices: string[]; order?: number[]; selected: number[]; toggle: (i: number) => void; locked: boolean; correct: number[] }) {
  return (
    <div className="choices">
      {(order ?? choices.map((_, i) => i)).map((i, pos) => {
        const cls = ['choice'];
        if (selected.includes(i)) cls.push('selected');
        if (locked && correct.includes(i)) cls.push('right');
        else if (locked && selected.includes(i)) cls.push('bad');
        return (
          <button key={i} className={cls.join(' ')} disabled={locked} onClick={() => toggle(i)}>
            <span className="key">{LETTERS[pos]}</span><Rich text={choices[i]} />
          </button>
        );
      })}
    </div>
  );
}

// Shuffled so the right answer's position carries no information.
const useChoiceOrder = (n: number, seed: number) => useMemo(() => shuffle([...Array(n).keys()], seed + 7), [n, seed]);

function Mcq({ card, locked, onReady, seed }: ExProps<Extract<Exercise, { kind: 'mcq' }>>) {
  const [sel, setSel] = useState<number | null>(null);
  const order = useChoiceOrder(card.choices.length, seed);
  return <Choices choices={card.choices} order={order} selected={sel === null ? [] : [sel]} locked={locked} correct={[card.answer]}
    toggle={(i) => { setSel(i); onReady(() => i === card.answer); }} />;
}

function Multi({ card, locked, onReady, seed }: ExProps<Extract<Exercise, { kind: 'multi' }>>) {
  const [sel, setSel] = useState<number[]>([]);
  const order = useChoiceOrder(card.choices.length, seed);
  return (
    <>
      <div className="muted" style={{ fontSize: 14, marginBottom: 8 }}>Select all that apply.</div>
      <Choices choices={card.choices} order={order} selected={sel} locked={locked} correct={card.answers}
        toggle={(i) => {
          const next = sel.includes(i) ? sel.filter((x) => x !== i) : [...sel, i];
          setSel(next);
          onReady(next.length ? () => next.length === card.answers.length && next.every((x) => card.answers.includes(x)) : null);
        }} />
    </>
  );
}

function TrueFalse({ card, locked, onReady }: ExProps<Extract<Exercise, { kind: 'truefalse' }>>) {
  const [sel, setSel] = useState<number | null>(null);
  return <Choices choices={['True', 'False']} selected={sel === null ? [] : [sel]} locked={locked} correct={[card.answer ? 0 : 1]}
    toggle={(i) => { setSel(i); onReady(() => (i === 0) === card.answer); }} />;
}

function Fill({ card, locked, onReady, seed }: ExProps<Extract<Exercise, { kind: 'fill' }>>) {
  const bank = useMemo(() => shuffle(card.bank.map((w, i) => ({ w, i })), seed), [card, seed]);
  const n = card.answer.length;
  const [slots, setSlots] = useState<(number | null)[]>(Array(n).fill(null));
  const update = (next: (number | null)[]) => {
    setSlots(next);
    onReady(next.every((x) => x !== null) ? () => next.every((bi, k) => card.bank[bi!] === card.answer[k]) : null);
  };
  const parts = card.prompt.split('___');
  return (
    <>
      <div className="prompt" style={{ lineHeight: 2 }}>
        {parts.map((p, k) => (
          <span key={k}>{inline(p, 'f' + k)}{k < n && (
            <span className="blank" onClick={() => !locked && slots[k] !== null && update(slots.map((x, j) => (j === k ? null : x)))}>
              {slots[k] !== null ? card.bank[slots[k]!] : ' '}
            </span>
          )}</span>
        ))}
      </div>
      {locked && <div className="muted" style={{ fontSize: 14 }}>Answer: {card.answer.join(' · ')}</div>}
      <div className="chip-bank">
        {bank.map(({ w, i }) => (
          <button key={i} className={'chip' + (slots.includes(i) ? ' used' : '')} disabled={locked}
            onClick={() => { const k = slots.indexOf(null); if (k >= 0) update(slots.map((x, j) => (j === k ? i : x))); }}>
            {inline(w, 'c' + i)}
          </button>
        ))}
      </div>
    </>
  );
}

function Order({ card, locked, onReady, seed }: ExProps<Extract<Exercise, { kind: 'order' }>>) {
  const [items, setItems] = useState(() => {
    let s = shuffle(card.steps.map((_, i) => i), seed);
    if (s.every((v, i) => v === i)) s = [...s.slice(1), s[0]];
    return s;
  });
  const listRef = useRef<HTMLDivElement>(null);
  const [drag, setDrag] = useState<{ pos: number; startY: number; dy: number } | null>(null);

  const apply = (next: number[]) => { setItems(next); onReady(() => next.every((v, k) => v === k)); };
  const reorder = (from: number, to: number) => {
    const next = items.slice();
    next.splice(to, 0, ...next.splice(from, 1));
    apply(next);
  };
  const move = (i: number, d: number) => {
    const j = i + d; if (j < 0 || j >= items.length) return;
    reorder(i, j);
    // keep the keyboard focus on the row that moved
    requestAnimationFrame(() => (listRef.current?.children[j] as HTMLElement | undefined)?.focus());
  };

  const onDown = (e: React.PointerEvent, pos: number) => {
    if (locked) return;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    setDrag({ pos, startY: e.clientY, dy: 0 });
  };
  const onMove = (e: React.PointerEvent) => {
    if (!drag || !listRef.current) return;
    const rows = Array.from(listRef.current.children) as HTMLElement[];
    const self = rows[drag.pos].getBoundingClientRect();
    const dy = e.clientY - drag.startY;
    const centre = self.top + self.height / 2 + dy;
    // Swap as soon as the dragged row's centre enters a neighbour, then re-baseline.
    const target = rows.findIndex((r, i) => {
      if (i === drag.pos) return false;
      const b = r.getBoundingClientRect();
      return centre >= b.top && centre <= b.bottom;
    });
    if (target >= 0) { reorder(drag.pos, target); setDrag({ pos: target, startY: e.clientY, dy: 0 }); }
    else setDrag({ ...drag, dy });
  };
  const onUp = () => setDrag(null);

  // enable check immediately (current order is an answer)
  useEffect(() => onReady(() => items.every((v, k) => v === k)), []); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div>
      <div className="muted" style={{ fontSize: 14, marginBottom: 8 }}>
        {locked ? 'Put the steps in the correct order.' : 'Drag the steps into the correct order (or focus one and use ↑ ↓).'}
      </div>
      <div ref={listRef}>
        {items.map((v, i) => (
          <div
            key={v}
            className={'order-item' + (!locked ? ' draggable' : '') + (drag?.pos === i ? ' dragging' : '')}
            style={{
              ...(locked ? { borderColor: v === i ? 'var(--green)' : 'var(--red)' } : null),
              ...(drag?.pos === i ? { transform: `translateY(${drag.dy}px)` } : null),
            }}
            tabIndex={locked ? -1 : 0}
            role={locked ? undefined : 'button'}
            aria-label={locked ? undefined : `Step in position ${i + 1} of ${items.length}. Use arrow keys to move.`}
            onPointerDown={(e) => onDown(e, i)}
            onPointerMove={onMove}
            onPointerUp={onUp}
            onPointerCancel={onUp}
            onKeyDown={(e) => {
              if (locked) return;
              if (e.key === 'ArrowUp') { e.preventDefault(); move(i, -1); }
              if (e.key === 'ArrowDown') { e.preventDefault(); move(i, 1); }
            }}
          >
            <strong style={{ color: 'var(--muted)' }}>{i + 1}</strong>
            <Rich text={card.steps[v]} />
            {!locked && <span className="grip" aria-hidden="true">⠿</span>}
          </div>
        ))}
      </div>
      {locked && <div className="muted" style={{ fontSize: 14 }}>Correct order: {card.steps.map((_, i) => i + 1).join(' → ')} as listed in the explanation below.</div>}
    </div>
  );
}

function Match({ card, locked, onReady, seed }: ExProps<Extract<Exercise, { kind: 'match' }>>) {
  const rights = useMemo(() => shuffle(card.pairs.map((_, i) => i), seed + 3), [card, seed]);
  const [pairs, setPairs] = useState<Record<number, number>>({});
  const [left, setLeft] = useState<number | null>(null);
  const colors = ['var(--c2)', 'var(--c3)', 'var(--c4)', 'var(--c6)', 'var(--c1)', 'var(--c5)'];
  const pairIdx = (l: number) => Object.keys(pairs).map(Number).indexOf(l);
  const pick = (r: number) => {
    if (left === null) return;
    const next = { ...pairs };
    for (const k of Object.keys(next)) if (next[+k] === r) delete next[+k];
    next[left] = r; setPairs(next); setLeft(null);
    onReady(Object.keys(next).length === card.pairs.length ? () => Object.entries(next).every(([l, rr]) => +l === rr) : null);
  };
  const style = (l: number | undefined) => (l !== undefined && l >= 0 && pairs[l] !== undefined ? { borderColor: colors[pairIdx(l) % 6] } : undefined);
  return (
    <>
      <div className="muted" style={{ fontSize: 14, marginBottom: 8 }}>Tap an item on the left, then its match on the right.</div>
      <div className="match-grid">
        <div className="choices">
          {card.pairs.map(([l], i) => (
            <button key={i} className={'choice' + (left === i ? ' selected' : '') + (locked ? (pairs[i] === i ? ' right' : ' bad') : '')} disabled={locked}
              style={left === i ? undefined : style(i)} onClick={() => setLeft(i)}><Rich text={l} /></button>
          ))}
        </div>
        <div className="choices">
          {rights.map((r) => {
            const owner = Object.entries(pairs).find(([, v]) => v === r)?.[0];
            return (
              <button key={r} className="choice" disabled={locked} style={style(owner === undefined ? undefined : +owner)} onClick={() => pick(r)}>
                <Rich text={card.pairs[r][1]} />
              </button>
            );
          })}
        </div>
      </div>
      {locked && <ul className="muted" style={{ fontSize: 14 }}>{card.pairs.map(([l, r], i) => <li key={i}>{inline(l, 'ml' + i)} → {inline(r, 'mr' + i)}</li>)}</ul>}
    </>
  );
}

function Numeric({ card, locked, onReady }: ExProps<Extract<Exercise, { kind: 'numeric' }>>) {
  const [v, setV] = useState('');
  const tol = card.tolerance ?? 1e-6 * Math.max(1, Math.abs(card.answer));
  return (
    <>
      <div className="row">
        <input className="numeric-input" inputMode="decimal" value={v} disabled={locked} placeholder="Your answer"
          onChange={(e) => {
            setV(e.target.value);
            const x = parseFloat(e.target.value.replace(/,/g, '').replace(/[−–]/g, '-'));
            onReady(Number.isFinite(x) ? () => Math.abs(x - card.answer) <= tol : null);
          }} />
        {card.unit && <span className="muted" style={{ fontWeight: 700 }}>{inline(card.unit, 'u')}</span>}
      </div>
      {locked && <div className="muted" style={{ marginTop: 8 }}>Answer: {+card.answer.toPrecision(6)}{card.unit ? ' ' : ''}{card.unit && inline(card.unit, 'u2')}</div>}
    </>
  );
}

const LABEL: Record<Exercise['kind'], string> = {
  mcq: 'Choose the answer', multi: 'Select all', truefalse: 'True or false?', fill: 'Fill in the blanks',
  order: 'Put in order', match: 'Match the pairs', numeric: 'Calculate',
};

export function ExerciseCard(props: ExProps<Exercise>) {
  const { card } = props;
  const body = (() => {
    switch (card.kind) {
      case 'mcq': return <Mcq {...(props as any)} />;
      case 'multi': return <Multi {...(props as any)} />;
      case 'truefalse': return <TrueFalse {...(props as any)} />;
      case 'fill': return <Fill {...(props as any)} />;
      case 'order': return <Order {...(props as any)} />;
      case 'match': return <Match {...(props as any)} />;
      case 'numeric': return <Numeric {...(props as any)} />;
    }
  })();
  return (
    <div>
      <div className="card-kind">{LABEL[card.kind]}</div>
      {card.kind !== 'fill' && <div className="prompt"><Rich text={card.prompt} /></div>}
      {card.widget && <WidgetHost spec={card.widget} />}
      {body}
    </div>
  );
}
