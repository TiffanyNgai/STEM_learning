import type { Reference } from '../content/types';

export function RefItem({ r }: { r: Reference }) {
  const text = <><strong>{r.title}</strong>{' — '}{r.authors}{r.venue ? `, ${r.venue}` : ''}{r.year ? ` (${r.year})` : ''}{r.detail ? `. ${r.detail}` : ''}</>;
  return <li>{r.url ? <a href={r.url} target="_blank" rel="noreferrer" style={{ color: 'inherit' }}>{text} ↗</a> : text}</li>;
}

export function RefList({ refs }: { refs: Reference[] }) {
  return <ol className="ref-list">{refs.map((r, i) => <RefItem key={i} r={r} />)}</ol>;
}
