import { Link } from 'react-router-dom';
import type { Card } from '../content/types';
import { findLesson } from '../content/registry';
import { Rich } from '../lib/Rich';
import { WidgetHost } from './WidgetHost';

type Teach = Extract<Card, { kind: 'explain' | 'widget' | 'recall' }>;

export function TeachCard({ card }: { card: Teach }) {
  if (card.kind === 'recall') {
    const loc = findLesson(card.link);
    return (
      <div className="recall">
        <div className="card-kind">🔁 Quick recall{loc ? ` · ${loc.subject.name}` : ''}</div>
        {card.title && <div className="card-title" style={{ fontSize: 18 }}>{card.title}</div>}
        <ul>{card.points.map((p, i) => <li key={i}><Rich text={p} /></li>)}</ul>
        {loc && <Link className="lesson-link" to={`/lesson/${card.link}?peek=1`}>Review “{loc.lesson.title}” ↗</Link>}
      </div>
    );
  }
  return (
    <div>
      {card.title && <div className="card-title">{card.title}</div>}
      {card.body && <Rich text={card.body} />}
      {card.widget && <WidgetHost spec={card.widget} />}
    </div>
  );
}
