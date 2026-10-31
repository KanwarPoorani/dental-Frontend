import { useEffect, useState } from 'react';
import { getJson } from '../api';
import { formatTime, FEATURED_DENTISTS } from '../data';
const DAY = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const days = (d) => [...d].sort((a, b) => (a + 6) % 7 - (b + 6) % 7).map((x) => DAY[x]).join(', ');
const featuredProfile = FEATURED_DENTISTS[0];
const withFeaturedProfile = (dentists) => dentists.map((dentist) => (
  dentist.slug === 'munesh-kumar' || dentist.name === featuredProfile.name
    ? {
      ...dentist,
      photoUrl: dentist.photoUrl || featuredProfile.photoUrl,
      qualifications: dentist.qualifications?.length ? dentist.qualifications : featuredProfile.qualifications,
      specialties: dentist.specialties?.length ? dentist.specialties : featuredProfile.specialties,
      bio: featuredProfile.bio,
    }
    : dentist
));

export default function Dentists() {
  const [list, setList] = useState(FEATURED_DENTISTS);
  useEffect(() => {
    getJson('/dentists')
      .then((dentists) => {
        if (Array.isArray(dentists) && dentists.length) {
          setList(withFeaturedProfile(dentists));
        }
      })
      .catch((error) => console.error('Unable to load dentist profiles:', error));
  }, []);
  return (
    <section id="dentists" className="mx-auto max-w-6xl scroll-mt-16 px-4 py-16">
      <p className="section-kicker mb-2">Experienced, compassionate care</p>
      <h2 className="section-title">Meet your dentists</h2>
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {list.map((d) => (
          <article key={d._id} className="modern-card flex flex-col gap-5 rounded-2xl border border-teal-100 bg-white p-5 shadow-sm sm:flex-row">
            <div className="flex aspect-square w-full shrink-0 items-center justify-center overflow-hidden rounded-xl sm:h-56 sm:w-56">
              {d.photoUrl
                ? <img src={d.photoUrl} alt={d.name} loading="lazy" className="h-full w-full rounded-xl object-contain object-center" />
                : <div aria-hidden className="grid h-full w-full place-items-center bg-teal-100 font-display text-3xl font-bold text-teal-700">{d.name.split(' ').filter((w) => /^[A-Z]/.test(w) && !w.endsWith('.')).map((w) => w[0]).join('').slice(0, 2)}</div>}
            </div>
            <div className="min-w-0">
              <h3 className="font-display text-xl font-bold">{d.name}</h3>
              {d.qualifications?.length > 0 && <p className="mt-1 text-sm text-ink/70">{d.qualifications.join(' · ')}</p>}
              {d.specialties?.length > 0 && <p className="mt-1 text-sm font-medium text-teal-700">{d.specialties.join(', ')}</p>}
              {d.bio && <p className="mt-2 text-sm font-semibold text-teal-900">{d.bio}</p>}
              <ul className="mt-2 text-sm text-ink/70">{d.schedule.map((s, i) => <li key={i}><b>{s.branch}:</b> {days(s.days)}, {formatTime(s.start)}–{formatTime(s.end)}</li>)}</ul>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
