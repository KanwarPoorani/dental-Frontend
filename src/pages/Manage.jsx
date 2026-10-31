import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { manageGet, manageReschedule, manageCancel, getSlots } from '../api';
import { formatTime } from '../data';

export default function Manage() {
  const { token } = useParams();
  const [a, setA] = useState(null);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [slots, setSlots] = useState([]);
  const [msg, setMsg] = useState('');
  const run = async (fn, ok) => { try { setA(await fn()); setMsg(ok); } catch (e) { setMsg(e.message); } };
  useEffect(() => { manageGet(token).then(setA).catch((e) => setMsg(e.message)); }, [token]);
  useEffect(() => { if (a && date) { setTime(''); getSlots(a.branch, date).then((r) => setSlots(r.slots)); } }, [date]);

  return (
    <main className="mx-auto max-w-2xl px-4 py-10 md:py-14">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl font-bold tracking-tight text-teal-900">Your appointment</h1>
        <Link to="/track" className="btn border border-teal-600 text-teal-700">
          <ArrowLeft size={18} />
          Back
        </Link>
      </div>
      {msg && (
        <div className="mt-4 rounded-lg bg-teal-50 p-3">
          <p role="status">{msg}</p>
        </div>
      )}
      {a && (
        <div className="modern-card mt-6 space-y-4 rounded-2xl border border-teal-100 bg-white p-5 sm:p-6">
          <p><b>{a.service}</b> at {a.branch}<br />{a.date} at {a.time}<br />Status: <b>{a.status}</b></p>
          {a.canReschedule && (
            <>
              <label className="block">New date<input type="date" className="field mt-1" min={new Date().toISOString().slice(0, 10)} value={date} onChange={(e) => setDate(e.target.value)} /></label>
              <label className="block">New time<select className="field mt-1" value={time} onChange={(e) => setTime(e.target.value)} disabled={!date}>
                <option value="">{date && !slots.length ? 'No times left that day' : 'Choose a time'}</option>{slots.map((s) => <option key={s} value={s}>{formatTime(s)}</option>)}</select></label>
              <button disabled={!time} onClick={() => run(() => manageReschedule(token, { date, time }), 'Rescheduled. We will confirm the new time shortly.')} className="btn w-full bg-teal-600 text-white disabled:opacity-50">Reschedule</button>
            </>
          )}
          {a.status === 'Confirmed' && a.canReschedule && <p>After you choose a new available time, the clinic will confirm the updated appointment.</p>}
          {!a.canReschedule && a.status === 'Pending' && <p>Appointments can only be rescheduled more than 2 hours before the visit. Please call the clinic for help.</p>}
          {a.canCancel && <button onClick={() => window.confirm('Cancel this appointment?') && run(() => manageCancel(token), 'Your appointment is cancelled.')} className="btn w-full border border-red-700 text-red-700">Cancel appointment</button>}
          {!a.canReschedule && !a.canCancel && a.status !== 'Pending' && a.status !== 'Confirmed' && <p>This appointment can no longer be changed online. Please call the clinic.</p>}
        </div>
      )}
    </main>
  );
}
