import { NavLink } from 'react-router-dom';
import { MAX_HEARTS, liveStreak, useProgress } from '../store/progress';
import type { ReactNode } from 'react';

export function TopBar({ title, left }: { title?: ReactNode; left?: ReactNode }) {
  const s = useProgress();
  const streak = liveStreak(s);
  return (
    <header className="topbar">
      {left}
      <div className="title">{title}</div>
      <span className={'stat fire' + (streak ? '' : ' dim')} title="Day streak">🔥 {streak}</span>
      <span className="stat gem" title="Total XP">⚡ {s.xp}</span>
      {s.settings.heartsEnabled && <span className="stat heart" title="Hearts">❤️ {Math.min(s.hearts, MAX_HEARTS)}</span>}
    </header>
  );
}

export function TabBar() {
  const tabs = [
    { to: '/', ic: '🏠', label: 'Learn' },
    { to: '/practice', ic: '🏋️', label: 'Practice' },
    { to: '/references', ic: '📚', label: 'Sources' },
    { to: '/profile', ic: '👤', label: 'Profile' },
  ];
  return (
    <div className="tabbar">
      <nav>
        {tabs.map((t) => (
          <NavLink key={t.to} to={t.to} end={t.to === '/'} className={({ isActive }) => (isActive ? 'active' : '')}>
            <span className="ic">{t.ic}</span>{t.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

export function Sheet({ onClose, children }: { onClose: () => void; children: ReactNode }) {
  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="sheet" onClick={(e) => e.stopPropagation()} role="dialog">{children}</div>
    </div>
  );
}
