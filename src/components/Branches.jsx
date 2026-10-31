import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { getJson } from '../api';
import { MapPin, Phone, Navigation, Check } from 'lucide-react';
import { BRANCHES, formatTime, mapUrl, telUrl } from '../data';
import Stars from './Stars';

const DAY = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
export default function Branches({ branch, setBranch, googleReviews = { branches: [] } }) {
  const [hours, setHours] = useState({});
  useEffect(() => { getJson('/branches').then((l) => setHours(Object.fromEntries(l.map((b) => [b.code, [...b.hours].sort((x, y) => (x.day + 6) % 7 - (y.day + 6) % 7)])))).catch(() => { }); }, []);
  const sel = BRANCHES.find((x) => x.id === branch);
  return (
    <section id="locations" className="mx-auto max-w-6xl scroll-mt-16 px-4 py-16">
      <p className="section-kicker mb-2">Find us near you</p>
      <h2 className="section-title">Two clinics, one standard of care</h2>
      <p className="section-description mt-2">Select a branch to use it for booking and the quick call button.</p>
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {BRANCHES.map((b) => {
          const active = b.id === branch;
          return (
            <motion.article key={b.id} onClick={() => setBranch(b.id)}
              className={`modern-card cursor-pointer rounded-2xl border-2 bg-white p-6 ${active ? 'border-teal-600 shadow-lg' : 'border-teal-100'}`}>
              <div className="flex items-start justify-between gap-3">
                <div><h3 className="font-display text-xl font-bold">{b.id} <span className="font-sans text-base font-medium text-ink/60">({b.city})</span></h3>
                  <p className="text-sm text-teal-700">{b.name}</p></div>
                {active && <span className="flex items-center gap-1 rounded-full bg-teal-600 px-3 py-1 text-xs font-bold text-white"><Check size={12} />Selected</span>}
              </div>
              <p className="mt-4 flex gap-2"><MapPin size={18} className="mt-0.5 shrink-0 text-teal-600" />{b.address}</p>
              <p className="mt-2 flex gap-2"><Phone size={18} className="shrink-0 text-teal-600" />{b.phone}</p>
              {b.plus && <p className="mt-2 text-sm text-ink/60">Plus Code: {b.plus}</p>}
              {hours[b.id] && <ul className="mt-3 grid grid-cols-2 gap-x-4 text-sm text-ink/70">{hours[b.id].map((h) => <li key={h.day}>{DAY[h.day]}: {h.closed ? 'Closed' : `${formatTime(h.open)}–${formatTime(h.close)}`}</li>)}</ul>}
              {(() => {
                const googleBranch = googleReviews.branches?.find((item) => item.id === b.id);
                return googleBranch?.rating != null ? (
                  <a
                    href={googleBranch.googleMapsUri}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(event) => event.stopPropagation()}
                    className="mt-3 inline-flex items-center gap-2 text-sm underline"
                  >
                    <Stars n={Math.round(googleBranch.rating)} size={14} />
                    <b>{googleBranch.rating.toFixed(1)}</b> ({googleBranch.reviewCount ?? 0} Google reviews)
                  </a>
                ) : (
                  <a
                    href={b.googleUrl}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(event) => event.stopPropagation()}
                    className="mt-3 inline-block text-sm text-teal-700 underline"
                  >
                    Read Google reviews
                  </a>
                );
              })()}
              <div className="mt-5 flex flex-wrap gap-3" onClick={(e) => e.stopPropagation()}>
                <a href={telUrl(b)} className="btn !py-2 bg-teal-600 text-white hover:bg-teal-700"><Phone size={16} />Call</a>
                <a href={mapUrl(b)} target="_blank" rel="noreferrer" className="btn !py-2 border border-teal-600 text-teal-700 hover:bg-teal-50"><Navigation size={16} />Directions</a>
              </div>
            </motion.article>
          );
        })}
      </div>
      <iframe title={`Map of ${sel.id} clinic`} loading="lazy" className="mt-6 h-72 w-full rounded-2xl border-0" src={`https://www.google.com/maps?q=${encodeURIComponent(sel.lat && sel.lng ? `${sel.lat},${sel.lng}` : sel.plus || sel.address)}&output=embed`} />
    </section>
  );
}
