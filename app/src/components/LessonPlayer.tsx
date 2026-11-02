import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { Card } from '../content/types';
import { EXERCISE_KINDS } from '../content/types';
import { Rich } from '../lib/Rich';
import { buzz, sfx } from '../lib/sfx';
import { MAX_HEARTS, useProgress } from '../store/progress';
import { ExerciseCard, type Exercise } from './exercises';
import { TeachCard } from './TeachCards';

export interface QueueItem { card: Card; key?: string; retry?: boolean }
export interface LessonResult { accuracy: number; exercises: number; correctFirstTry: number; seconds: number }

const PRAISE = ['Nicely done!', 'Correct!', 'Great!', 'Excellent!', 'You got it!', 'Brilliant!'];

export function LessonPlayer({ items, onExit, onFinish }: { items: QueueItem[]; onExit: () => void; onFinish: (r: LessonResult) => void }) {
  const [queue, setQueue] = useState(items);
  const [idx, setIdx] = useState(0);
  const [phase, setPhase] = useState<'answer' | 'correct' | 'wrong'>('answer');
  const [ready, setReady] = useState(false);
  const checkRef = useRef<(() => boolean) | null>(null);
  const stats = useRef({ correctFirstTry: 0, start: Date.now() });
  const { hearts, settings, loseHeart, reviewItem } = useProgress();
  const [outOfHearts, setOutOfHearts] = useState(false);
  const [praise, setPraise] = useState(PRAISE[0]);

  const item = queue[idx];
  const isExercise = EXERCISE_KINDS.includes(item.card.kind);
  const exerciseTotal = items.filter((q) => EXERCISE_KINDS.includes(q.card.kind)).length;
  const progress = idx / queue.length;

  const onReady = useCallback((fn: (() => boolean) | null) => { checkRef.current = fn; setReady(!!fn); }, []);

  const next = () => {
    if (idx + 1 >= queue.length) {
      const seconds = Math.round((Date.now() - stats.current.start) / 1000);
      onFinish({ accuracy: exerciseTotal ? stats.current.correctFirstTry / exerciseTotal : 1, exercises: exerciseTotal, correctFirstTry: stats.current.correctFirstTry, seconds });
      return;
    }
    setIdx(idx + 1); setPhase('answer'); setReady(false); checkRef.current = null;
  };

  const check = () => {
    if (!checkRef.current) return;
    const ok = checkRef.current();
    if (item.key && !item.retry) reviewItem(item.key, ok);
    if (ok) {
      if (!item.retry) stats.current.correctFirstTry++;
      setPraise(PRAISE[Math.floor(Math.random() * PRAISE.length)]);
      setPhase('correct'); if (settings.sound) sfx.correct(); buzz(15);
    } else {
      setPhase('wrong'); if (settings.sound) sfx.wrong(); buzz([30, 40, 30]);
      if (settings.heartsEnabled) {
        loseHeart();
        if (hearts - 1 <= 0) { setOutOfHearts(true); return; }
      }
      if (!item.retry) setQueue((q) => [...q, { ...item, retry: true }]);
    }
  };

  const primary = () => (isExercise && phase === 'answer' ? check() : next());
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Enter' && (phase !== 'answer' || !isExercise || ready)) { e.preventDefault(); primary(); } };
    window.addEventListener('keydown', h); return () => window.removeEventListener('keydown', h);
  });

  if (outOfHearts) {
    return (
      <div className="results">
        <div className="big">💔</div>
        <h2>Out of hearts</h2>
        <p className="muted">Hearts refill one every 30 minutes. You can also turn hearts off in Profile → Settings if you prefer to learn without them.</p>
        <button className="btn" onClick={onExit}>Back to path</button>
      </div>
    );
  }

  return (
    <div className="lesson">
      <div className="lesson-top">
        <button className="icon-btn" onClick={onExit} aria-label="Quit lesson">✕</button>
        <div className="bar"><i style={{ width: `${Math.max(3, progress * 100)}%` }} /></div>
        {settings.heartsEnabled && <span className="stat heart">❤️ {Math.min(hearts, MAX_HEARTS)}</span>}
      </div>
      <div className="lesson-body">
        <AnimatePresence mode="wait">
          <motion.div key={idx} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.22 }}>
            {item.retry && <div className="card-kind" style={{ color: 'var(--orange)' }}>↻ Previous mistake</div>}
            {isExercise
              ? <ExerciseCard key={idx} card={item.card as Exercise} locked={phase !== 'answer'} onReady={onReady} seed={idx * 7919 + 13} />
              : <TeachCard card={item.card as any} />}
          </motion.div>
        </AnimatePresence>
      </div>
      <div className={'lesson-foot ' + (phase === 'correct' ? 'correct' : phase === 'wrong' ? 'wrong' : '')}>
        {phase !== 'answer' && isExercise && (
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
            <div className="feedback-title">{phase === 'correct' ? `✅ ${praise}` : '❌ Not quite'}</div>
            <div className="feedback-why"><Rich text={(item.card as Exercise).why} /></div>
          </motion.div>
        )}
        <button className={'btn' + (phase === 'wrong' ? ' danger' : '')} disabled={isExercise && phase === 'answer' && !ready} onClick={primary}>
          {isExercise && phase === 'answer' ? 'Check' : 'Continue'}
        </button>
      </div>
    </div>
  );
}
