import { useState } from 'react';
import { BRANCHES, telUrl } from '../data';
import { sendContact } from '../api';

const isValidPhone = (value) => {
  const phone = value.trim();
  const digits = phone.replace(/\D/g, '');
  return Boolean(phone) && /^\+?[0-9][0-9\s()-]*[0-9]$/.test(phone) && digits.length >= 9 && digits.length <= 15;
};

export default function Footer() {
  const [f, setF] = useState({ name: '', phone: '', message: '' });
  const [msg, setMsg] = useState('');
  const submit = async (e) => {
    e.preventDefault();
    try { await sendContact(f); setMsg('Thanks, we will get back to you.'); setF({ name: '', phone: '', message: '' }); }
    catch (err) { setMsg(err.message); }
  };
  return (
    <footer className="bg-ink py-12 text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 md:grid-cols-3">
        <div>
          <h3 className="font-display text-xl font-bold">Dr. Munesh Kumar &amp; Associates Dental Care Center</h3>
          <p className="mt-5 text-sm font-semibold text-teal-100">Follow us</p>
          <div className="mt-2 flex gap-3">
            <a
              href="https://www.facebook.com/DR.MK.Associates.DIFSC"
              target="_blank"
              rel="noreferrer"
              aria-label="Visit our Facebook page (opens in a new tab)"
              className="group inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#1877f2] text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#0c63d4] hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-100"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
                <path d="M13.5 21v-8.2h2.8l.4-3.2h-3.2v-2c0-.9.3-1.6 1.6-1.6h1.7V3.1c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.3H7.3v3.2h2.8V21h3.4Z" />
              </svg>
            </a>
            <a
              href="https://www.instagram.com/dr_mk.associates.dentalcare/?hl=en"
              target="_blank"
              rel="noreferrer"
              aria-label="Visit our Instagram profile (opens in a new tab)"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-[#833ab4] via-[#e1306c] to-[#f77737] text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-100"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current" strokeWidth="1.8" aria-hidden="true">
                <rect x="3.2" y="3.2" width="17.6" height="17.6" rx="5.2" />
                <circle cx="12" cy="12" r="4.1" />
                <circle cx="17.7" cy="6.5" r="1" className="fill-current stroke-none" />
              </svg>
            </a>
          </div>
        </div>
        <div className="space-y-3 text-sm">
          {BRANCHES.map((b) => (
            <p key={b.id}><b>{b.id}:</b> {b.address}<br /><a className="text-teal-100 underline" href={telUrl(b)}>{b.phone}</a></p>
          ))}
        </div>
        <form onSubmit={submit} className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-5 text-ink">
          <p className="font-display text-xl font-bold text-white">Send us a message</p>
          <input required placeholder="Name" className="field" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
          <input
            required
            type="tel"
            autoComplete="tel"
            placeholder="Phone (e.g. +92 348 3233370)"
            className="field"
            value={f.phone}
            onChange={(e) => {
              const phone = e.target.value;
              e.target.setCustomValidity(isValidPhone(phone) ? '' : 'Enter a valid phone number with 9 to 15 digits.');
              setF({ ...f, phone });
            }}
          />
          <textarea required placeholder="Your question" rows={3} className="field" value={f.message} onChange={(e) => setF({ ...f, message: e.target.value })} />
          <button className="btn w-full bg-gold text-ink">Send message</button>
          {msg && <p role="status" className="text-sm text-teal-100">{msg}</p>}
        </form>
      </div>
      <div className="mx-auto mt-10 max-w-6xl border-t border-white/20 px-4 pt-5 text-center text-sm text-teal-100">
        © {new Date().getFullYear()} Dr. Munesh Kumar &amp; Associates Dental Care Center. All rights reserved.
      </div>
    </footer>
  );
}