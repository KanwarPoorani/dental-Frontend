import { useState } from 'react';
import { Link } from 'react-router-dom';
import { lookupAppointment } from '../api';

const STATUS_TONE = {
  Pending: 'bg-amber-100 text-amber-900',
  Confirmed: 'bg-teal-100 text-teal-900',
  Completed: 'bg-slate-200 text-slate-800',
  Cancelled: 'bg-red-100 text-red-800',
};

const LOCAL_MESSAGES = [
  'Your smile journey is in good hands!',
  'A healthy smile starts with your next visit.',
  'Thanks for checking in. We are here to help!',
  'Keep smiling — your dental care matters.',
];

export default function Track() {
  const [form, setForm] = useState({ phone: '', email: '' });
  const [appt, setAppt] = useState(null);
  const [err, setErr] = useState('');
  const [localMessage, setLocalMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErr('');
    setLocalMessage('');
    try {
      const data = await lookupAppointment(form.phone, form.email);
      setAppt(data);
    } catch (error) {
      setAppt(null);
      setErr(error.message);
      if (import.meta.env.DEV) {
        const index = Math.floor(Math.random() * LOCAL_MESSAGES.length);
        setLocalMessage(LOCAL_MESSAGES[index]);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 md:py-14">
      <div className="mb-8 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-700">Track booking</p>
          <h1 className="font-display text-3xl font-bold tracking-tight text-teal-900 sm:text-4xl">Appointment dashboard</h1>
        </div>
        <Link to="/" className="btn border border-teal-600 text-teal-700">Back home</Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
        <form onSubmit={submit} className="modern-card rounded-2xl border border-teal-100 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="font-display text-2xl font-bold text-teal-900">Check your appointment</h2>
          <p className="mt-2 text-sm text-ink/70">
            Tracking here requires the phone and email used when booking. If you booked without email, open the secure appointment link from your booking confirmation or SMS/WhatsApp message.
          </p>
          <div className="mt-5 space-y-4">
            <label className="block">
              Phone
              <input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="field mt-1" placeholder="+92 3XX XXXXXXX" />
            </label>
            <label className="block">
              Email
              <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="field mt-1" placeholder="you@example.com" />
            </label>
            <button disabled={loading} className="btn w-full bg-teal-600 text-white hover:bg-teal-700 disabled:opacity-60">
              {loading ? 'Checking…' : 'Track appointment'}
            </button>
          </div>
          {err && <p role="alert" className="mt-4 rounded-lg bg-red-50 p-3 text-red-700">{err}</p>}
        </form>

        <div className="modern-card rounded-2xl border border-teal-100 bg-white p-5 shadow-sm sm:p-6">
          {!appt && localMessage ? (
            <div className="flex h-full min-h-64 flex-col items-center justify-center gap-3 text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-700">Local preview message</p>
              <p className="font-display text-2xl font-bold text-teal-900">{localMessage}</p>
            </div>
          ) : !appt ? (
            <div className="flex h-full min-h-64 items-center justify-center text-center text-ink/60">
              Enter your booking contact details, or use the secure link sent with your booking confirmation.
            </div>
          ) : (
            <div className="space-y-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-teal-700">Status</p>
                  <h2 className="font-display text-3xl font-bold text-teal-900">{appt.name}</h2>
                </div>
                <span className={`rounded-full px-3 py-1 text-sm font-bold ${STATUS_TONE[appt.status] || 'bg-slate-100 text-slate-700'}`}>
                  {appt.status}
                </span>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl bg-teal-50 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-teal-700">Service</p>
                  <p className="mt-2 font-bold">{appt.service}</p>
                </div>
                <div className="rounded-xl bg-teal-50 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-teal-700">Branch</p>
                  <p className="mt-2 font-bold">{appt.branch}</p>
                </div>
                <div className="rounded-xl bg-teal-50 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-teal-700">Date</p>
                  <p className="mt-2 font-bold">{appt.date}</p>
                </div>
                <div className="rounded-xl bg-teal-50 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-teal-700">Time</p>
                  <p className="mt-2 font-bold">{appt.time}</p>
                </div>
              </div>

              <div className="rounded-xl border border-teal-100 bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-teal-700">Contact</p>
                <p className="mt-2"><b>Phone:</b> {appt.phone}</p>
                {appt.email && <p><b>Email:</b> {appt.email}</p>}
                {appt.notes && <p className="mt-2 text-ink/70">Notes: {appt.notes}</p>}
              </div>

              <div className="flex flex-wrap gap-3">
                <Link to={`/manage/${appt.token}`} className="btn bg-teal-600 text-white">Manage appointment</Link>
                <Link to="/" className="btn border border-teal-600 text-teal-700">Back to clinic</Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
