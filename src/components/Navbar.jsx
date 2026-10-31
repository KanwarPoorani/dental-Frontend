import { useState } from 'react';
import { Phone, Menu, X, Moon, Sun } from 'lucide-react';
import { BRANCHES, telUrl } from '../data';

const LINKS = [['Locations', '#locations'], ['Services', '#services'], ['Dentists', '#dentists'], ['Reviews', '#reviews'], ['Advice', '#advice'], ['Book', '#book'], ['Track', '/track']];
export default function Navbar({ branch, setBranch, isDark, onToggleTheme }) {
  const [open, setOpen] = useState(false);
  const current = BRANCHES.find((b) => b.id === branch);
  return (
    <header className="site-navbar sticky top-0 z-40 border-b border-teal-100 bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <a href="#" className="flex shrink-0 items-center gap-2 font-display text-sm font-bold leading-tight text-teal-900 sm:gap-3 sm:text-base lg:text-lg">
          <img src="/dental-clinic-logo.png" alt="Dr. Munesh Kumar & Associates Dental Implant and Facial Surgery Clinic" className="h-10 w-10 rounded-full object-contain sm:h-14 sm:w-14" />
          <span>Dr. Munesh Kumar<span className="block text-xs font-sans font-medium text-teal-700">& Associates Dental Care</span></span>
        </a>
        <nav className="hidden items-center gap-1 lg:flex">
          {LINKS.map(([t, h]) => <a key={h} href={h} className="rounded-full px-3 py-2 text-sm font-semibold transition-colors hover:bg-teal-50 hover:text-teal-700">{t}</a>)}
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          <select aria-label="Select branch" value={branch} onChange={(e) => setBranch(e.target.value)} className="field !w-auto !py-1.5 text-sm">
            {BRANCHES.map((b) => <option key={b.id} value={b.id}>{b.id} ({b.city})</option>)}
          </select>
          <a href={telUrl(current)} className="btn !px-4 !py-2 bg-teal-600 text-white hover:bg-teal-700"><Phone size={16} />Call</a>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
            aria-pressed={isDark}
            onClick={onToggleTheme}
            className="theme-toggle inline-flex items-center gap-2 rounded-full border border-teal-100 bg-white px-2.5 py-2 text-sm font-bold text-teal-900 shadow-sm transition hover:bg-teal-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 sm:px-3"
          >
            {isDark ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
            <span className="hidden sm:inline">{isDark ? 'Light' : 'Dark'}</span>
          </button>
          <button className="rounded-lg p-2 text-teal-900 hover:bg-teal-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 md:hidden" aria-label="Menu" aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
        </div>
      </div>
      {open && (
        <div className="space-y-2 border-t border-teal-100 bg-paper px-4 py-4 shadow-lg md:hidden">
          {LINKS.map(([t, h]) => <a key={h} href={h} onClick={() => setOpen(false)} className="block rounded-xl px-3 py-2.5 font-semibold transition-colors hover:bg-teal-50 hover:text-teal-700">{t}</a>)}
          <select aria-label="Select branch" value={branch} onChange={(e) => setBranch(e.target.value)} className="field">
            {BRANCHES.map((b) => <option key={b.id} value={b.id}>{b.id} ({b.city})</option>)}
          </select>
          <a href={telUrl(current)} className="btn w-full bg-teal-600 text-white"><Phone size={16} />Call {current.id}</a>
        </div>
      )}
    </header>
  );
}
