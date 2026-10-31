import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BRANCHES, formatTime, SERVICES } from '../data';
import { bookAppointment, getSlots } from '../api';

const today = () => new Date().toISOString().slice(0, 10);
const empty = { name: '', phone: '', email: '', service: '', date: '', time: '', notes: '' };

export default function Booking({ branch, setBranch }) {
  const [form, setForm] = useState(empty);
  const [slots, setSlots] = useState(null);
  const [state, setState] = useState({ status: 'idle', msg: '', token: '' });
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  // Re-check availability whenever branch or date changes
  useEffect(() => {
    if (!form.date) return;
    getSlots(branch, form.date).then((r) => setSlots(r.slots)).catch(() => setSlots([]));
    setForm((f) => ({ ...f, time: '' }));
  }, [branch, form.date]);

  const submit = async (e) => {
    e.preventDefault();
    setState({ status: 'loading', msg: '' });
    try {
      const result = await bookAppointment({ ...form, branch });
      setState({ status: 'done', msg: '', token: result.token });
      setForm(empty);
    } catch (err) { setState({ status: 'error', msg: err.message }); }
  };

  return (
    <section id="book" className="mx-auto max-w-3xl scroll-mt-16 px-4 py-16">
      <p className="section-kicker mb-2">Your next step to a healthier smile</p>
      <h2 className="section-title">Book an appointment</h2>
      <p className="section-description mt-2">We will call you to confirm your slot.</p>
      <AnimatePresence mode="wait">
        {state.status === 'done' ? (
          <motion.div key="ok" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mt-8 rounded-2xl bg-teal-50 p-8 text-center" role="status">
            <CheckCircle2 className="mx-auto text-teal-600" size={48} />
            <h3 className="mt-3 font-display text-2xl font-bold">Request received</h3>
            <p className="mt-1">We will contact you to confirm. You can use this secure link to check, reschedule, or cancel your appointment. We will also send it by SMS or WhatsApp when those services are configured.</p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <Link to={`/manage/${state.token}`} className="btn bg-teal-600 text-white">View appointment</Link>
              <button className="btn border border-teal-600 text-teal-700" onClick={() => setState({ status: 'idle', msg: '' })}>Book another visit</button>
            </div>
          </motion.div>
        ) : (
          <motion.form key="form" onSubmit={submit} className="modern-card mt-8 grid gap-4 rounded-2xl border border-teal-100 bg-white p-5 sm:p-6 md:grid-cols-2">
            <label className="md:col-span-2">Branch
              <div className="mt-1 grid grid-cols-2 gap-3">
                {BRANCHES.map((b) => (
                  <button type="button" key={b.id} onClick={() => setBranch(b.id)} aria-pressed={branch === b.id}
                    className={`rounded-lg border-2 px-3 py-2.5 font-bold ${branch === b.id ? 'border-teal-600 bg-teal-50 text-teal-900' : 'border-teal-100'}`}>{b.id} ({b.city})</button>
                ))}
              </div>
            </label>
            <label>Full name<input required className="field mt-1" value={form.name} onChange={set('name')} autoComplete="name" /></label>
            <label>Phone<input required type="tel" className="field mt-1" value={form.phone} onChange={set('phone')} placeholder="+92 3XX XXXXXXX" autoComplete="tel" /></label>
            <label>Email (optional)<input type="email" className="field mt-1" value={form.email} onChange={set('email')} autoComplete="email" /></label>
            <label>Service<select required className="field mt-1" value={form.service} onChange={set('service')}>
              <option value="">Choose a service</option>
              {SERVICES.map(({ name }) => <option key={name} value={name}>{name}</option>)}
            </select></label>
            <label>Date<input required type="date" min={today()} className="field mt-1" value={form.date} onChange={set('date')} /></label>
            <label>Time<select required className="field mt-1" value={form.time} onChange={set('time')} disabled={!form.date}>
              <option value="">{!form.date ? 'Pick a date first' : slots?.length === 0 ? 'No times left that day' : 'Choose a time'}</option>
              {(slots || []).map((s) => <option key={s} value={s}>{formatTime(s)}</option>)}
            </select></label>
            <label className="md:col-span-2">Notes (optional)<textarea className="field mt-1" rows={3} maxLength={500} value={form.notes} onChange={set('notes')} /></label>
            {state.status === 'error' && <p role="alert" className="md:col-span-2 text-red-700">{state.msg}</p>}
            <button disabled={state.status === 'loading'} className="btn bg-teal-600 text-white hover:bg-teal-700 disabled:opacity-60 md:col-span-2">
              {state.status === 'loading' ? 'Sending…' : `Request appointment in ${branch}`}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </section>
  );
}
