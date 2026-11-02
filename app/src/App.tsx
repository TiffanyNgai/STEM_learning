import { useEffect } from 'react';
import { HashRouter, Route, Routes, useLocation } from 'react-router-dom';
import { TabBar } from './components/Chrome';
import { useProgress } from './store/progress';
import Home from './routes/Home';
import SubjectPage from './routes/SubjectPage';
import LessonPage from './routes/LessonPage';
import Practice from './routes/Practice';
import Profile from './routes/Profile';
import ReferencesPage from './routes/ReferencesPage';

function Shell() {
  const loc = useLocation();
  const inLesson = loc.pathname.startsWith('/lesson/');
  useEffect(() => { window.scrollTo(0, 0); }, [loc.pathname]);
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/subject/:id" element={<SubjectPage />} />
        <Route path="/lesson/:subject/:lesson" element={<LessonPage />} />
        <Route path="/practice" element={<Practice />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/references" element={<ReferencesPage />} />
      </Routes>
      {!inLesson && <TabBar />}
    </div>
  );
}

export default function App() {
  const theme = useProgress((s) => s.settings.theme);
  useEffect(() => {
    if (theme === 'system') document.documentElement.removeAttribute('data-theme');
    else document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);
  useEffect(() => { useProgress.getState().refillHearts(); }, []);
  return <HashRouter><Shell /></HashRouter>;
}
