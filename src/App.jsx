import { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Moon, Sun } from 'lucide-react';
import Home from './pages/Home';
import Admin from './pages/Admin';
import Manage from './pages/Manage';
import Track from './pages/Track';
import Article from './pages/Article';
export default function App() {
  const { pathname } = useLocation();
  const [theme, setTheme] = useState(() => (
    localStorage.getItem('dental-care-theme') === 'dark' ? 'dark' : 'light'
  ));
  const isDark = theme === 'dark';

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('dental-care-theme', theme);
  }, [theme]);

  return (
    <>
      {pathname !== '/' && (
        <button
          type="button"
          aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
          aria-pressed={isDark}
          onClick={() => setTheme(isDark ? 'light' : 'dark')}
          className="theme-toggle fixed right-4 top-3 z-50 inline-flex items-center gap-2 rounded-full border border-teal-100 bg-white px-3 py-2 text-sm font-bold text-teal-900 shadow-md transition hover:-translate-y-0.5 hover:bg-teal-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
        >
          {isDark ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
          <span className="hidden lg:inline">{isDark ? 'Light mode' : 'Dark mode'}</span>
        </button>
      )}
      <Routes>
        <Route path="/" element={<Home isDark={isDark} onToggleTheme={() => setTheme(isDark ? 'light' : 'dark')} />} />
        <Route path="/admin" element={<Admin isDark={isDark} />} />
        <Route path="/track" element={<Track />} />
        <Route path="/manage/:token" element={<Manage />} />
        <Route path="/articles/:slug" element={<Article />} />
      </Routes>
    </>
  );
}
