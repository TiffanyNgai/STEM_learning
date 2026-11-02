import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { LessonRef } from '../content/types';

export const MAX_HEARTS = 5;
const HEART_REFILL_MS = 30 * 60 * 1000;

export interface LessonRecord { crowns: number; best: number; lastAt: number }
export interface SrsItem { ease: number; interval: number; due: number; reps: number }

export interface Settings {
  dailyGoal: number;
  reminderHour: number;
  pushEnabled: boolean;
  heartsEnabled: boolean;
  sound: boolean;
  theme: 'system' | 'light' | 'dark';
}

interface State {
  xp: number;
  streak: number;
  bestStreak: number;
  lastActiveDay: string | null;
  freezes: number;
  xpByDay: Record<string, number>;
  hearts: number;
  heartsUpdatedAt: number;
  lessons: Record<string, LessonRecord>;
  srs: Record<string, SrsItem>;
  settings: Settings;
  seenInstallTip: boolean;
}

interface Actions {
  completeLesson: (ref: LessonRef, accuracy: number, xp: number) => void;
  addPracticeXp: (xp: number) => void;
  loseHeart: () => void;
  gainHeart: () => void;
  refillHearts: () => void;
  reviewItem: (key: string, correct: boolean) => void;
  updateSettings: (s: Partial<Settings>) => void;
  setSeenInstallTip: () => void;
  importState: (json: string) => boolean;
  reset: () => void;
}

export const dayKey = (d = new Date()) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const dayDiff = (a: string, b: string) => Math.round((new Date(b).getTime() - new Date(a).getTime()) / 86400000);

const initial: State = {
  xp: 0, streak: 0, bestStreak: 0, lastActiveDay: null, freezes: 1, xpByDay: {},
  hearts: MAX_HEARTS, heartsUpdatedAt: Date.now(), lessons: {}, srs: {},
  settings: { dailyGoal: 30, reminderHour: 19, pushEnabled: false, heartsEnabled: true, sound: true, theme: 'system' },
  seenInstallTip: false,
};

/** Streak bookkeeping when the learner earns XP today. */
function touchStreak(s: State): Partial<State> {
  const today = dayKey();
  if (s.lastActiveDay === today) return {};
  let { streak, freezes } = s;
  const gap = s.lastActiveDay ? dayDiff(s.lastActiveDay, today) : Infinity;
  if (gap === 1) streak += 1;
  else if (gap === 2 && freezes > 0) { freezes -= 1; streak += 1; }
  else streak = 1;
  // earn a freeze every 7-day milestone (max 2)
  if (streak % 7 === 0) freezes = Math.min(2, freezes + 1);
  return { streak, freezes, lastActiveDay: today, bestStreak: Math.max(s.bestStreak, streak) };
}

const addXp = (s: State, xp: number): Partial<State> => {
  const today = dayKey();
  return { ...touchStreak(s), xp: s.xp + xp, xpByDay: { ...s.xpByDay, [today]: (s.xpByDay[today] ?? 0) + xp } };
};

export const useProgress = create<State & Actions>()(
  persist(
    (set, get) => ({
      ...initial,
      completeLesson: (ref, accuracy, xp) => set((s) => {
        const prev = s.lessons[ref];
        const rec: LessonRecord = { crowns: Math.min(5, (prev?.crowns ?? 0) + 1), best: Math.max(prev?.best ?? 0, accuracy), lastAt: Date.now() };
        return { ...addXp(s, xp), lessons: { ...s.lessons, [ref]: rec } };
      }),
      addPracticeXp: (xp) => set((s) => addXp(s, xp)),
      loseHeart: () => set((s) => s.settings.heartsEnabled ? { hearts: Math.max(0, s.hearts - 1), heartsUpdatedAt: s.hearts === MAX_HEARTS ? Date.now() : s.heartsUpdatedAt } : {}),
      gainHeart: () => set((s) => ({ hearts: Math.min(MAX_HEARTS, s.hearts + 1) })),
      refillHearts: () => {
        const s = get();
        if (s.hearts >= MAX_HEARTS) return;
        const n = Math.floor((Date.now() - s.heartsUpdatedAt) / HEART_REFILL_MS);
        if (n > 0) set({ hearts: Math.min(MAX_HEARTS, s.hearts + n), heartsUpdatedAt: s.heartsUpdatedAt + n * HEART_REFILL_MS });
      },
      reviewItem: (key, correct) => set((s) => {
        // SM-2-lite
        const it = s.srs[key] ?? { ease: 2.5, interval: 0, due: 0, reps: 0 };
        let { ease, interval, reps } = it;
        if (correct) {
          reps += 1;
          interval = reps === 1 ? 1 : reps === 2 ? 3 : Math.round(interval * ease);
          ease = Math.min(3, ease + 0.05);
        } else {
          reps = 0; interval = 0; ease = Math.max(1.3, ease - 0.2);
        }
        const due = Date.now() + (interval === 0 ? 10 * 60 * 1000 : interval * 86400000);
        return { srs: { ...s.srs, [key]: { ease, interval, due, reps } } };
      }),
      updateSettings: (p) => set((s) => ({ settings: { ...s.settings, ...p } })),
      setSeenInstallTip: () => set({ seenInstallTip: true }),
      importState: (json) => {
        try {
          const data = JSON.parse(json);
          const st = data.state ?? data;
          if (typeof st.xp !== 'number' || typeof st.lessons !== 'object') return false;
          set({ ...initial, ...st, settings: { ...initial.settings, ...st.settings } });
          return true;
        } catch { return false; }
      },
      reset: () => set({ ...initial, heartsUpdatedAt: Date.now() }),
    }),
    {
      name: 'lumen-progress',
      version: 1,
      storage: createJSONStorage(() => {
        try { localStorage.setItem('__t', '1'); localStorage.removeItem('__t'); return localStorage; }
        catch { const m = new Map<string, string>(); return { getItem: (k) => m.get(k) ?? null, setItem: (k, v) => void m.set(k, v), removeItem: (k) => void m.delete(k) }; }
      }),
    },
  ),
);

export const todayXp = (s: State) => s.xpByDay[dayKey()] ?? 0;
/** Streak shown to the user: 0 if they've missed more than allowed. */
export const liveStreak = (s: State) => {
  if (!s.lastActiveDay) return 0;
  const gap = dayDiff(s.lastActiveDay, dayKey());
  return gap <= 1 || (gap === 2 && s.freezes > 0) ? s.streak : 0;
};
