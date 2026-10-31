import { useState } from 'react';
import { adminApi } from '../api';
import Stars from '../components/Stars';

const STATUSES = ['Pending', 'Confirmed', 'Completed', 'Cancelled'];
const DEFAULT_FILTERS = { status: '', branch: '', date: '' };
const tone = {
  Pending: 'bg-[#dfe5bd] text-[#3a4a25]',
  Confirmed: 'bg-[#c7efe2] text-[#0d4d43]',
  Completed: 'bg-[#d9dfe4] text-[#2b4857]',
  Cancelled: 'bg-[#f0d5cc] text-[#6b2d2c]',
};

const selectArrow = (isDark) => ({
  backgroundImage: `linear-gradient(45deg, transparent 50%, ${isDark ? 'rgba(214,239,236,0.95)' : '#355452'} 50%), linear-gradient(135deg, ${isDark ? 'rgba(214,239,236,0.95)' : '#355452'} 50%, transparent 50%)`,
  backgroundPosition: 'calc(100% - 18px) calc(50% - 2px), calc(100% - 12px) calc(50% - 2px)',
  backgroundSize: '6px 6px, 6px 6px',
  backgroundRepeat: 'no-repeat',
  colorScheme: isDark ? 'dark' : 'light',
});

export default function Admin({ isDark }) {
  const [key, setKey] = useState('');
  const [rows, setRows] = useState(null);
  const [pendingAppointmentCount, setPendingAppointmentCount] = useState(0);
  const [messages, setMessages] = useState([]);
  const [pendingReviews, setPendingReviews] = useState([]);
  const [section, setSection] = useState('appointments');
  const [f, setF] = useState(DEFAULT_FILTERS);
  const [err, setErr] = useState('');

  const load = async (filter = f) => {
    try {
      const q = new URLSearchParams(Object.entries(filter).filter(([, v]) => v));
      const [appointments, contactMessages, appointmentCounts, reviews] = await Promise.all([
        adminApi(key, `/appointments?${q}`),
        adminApi(key, '/contact/admin'),
        adminApi(key, '/appointments/counts'),
        adminApi(key, '/reviews/admin'),
      ]);
      setRows(appointments);
      setMessages(contactMessages);
      setPendingAppointmentCount(appointmentCounts.pending);
      setPendingReviews(reviews);
      setErr('');
    } catch (e) {
      setRows(null);
      setErr(e.message);
    }
  };

  const markMessageRead = async (id) => {
    try {
      const updated = await adminApi(key, `/contact/admin/${id}/read`, { method: 'PATCH' });
      setMessages((current) => current.map((message) => (message._id === id ? updated : message)));
    } catch (e) {
      setErr(e.message);
    }
  };

  const refreshMessages = async () => {
    try {
      setMessages(await adminApi(key, '/contact/admin'));
      setErr('');
    } catch (e) {
      setErr(e.message);
    }
  };

  const approveReview = async (id) => {
    try {
      await adminApi(key, `/reviews/${id}/approve`, { method: 'PATCH' });
      setPendingReviews((current) => current.filter((review) => review._id !== id));
      setErr('');
    } catch (e) {
      setErr(e.message);
    }
  };

  const refreshReviews = async () => {
    try {
      setPendingReviews(await adminApi(key, '/reviews/admin'));
      setErr('');
    } catch (e) {
      setErr(e.message);
    }
  };

  const setStatus = async (id, status) => {
    try {
      const u = await adminApi(key, `/appointments/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) });
      setRows(rows.map((r) => (r._id === id ? u : r)));
      const previous = rows.find((r) => r._id === id);
      if (previous && previous.status !== u.status) {
        setPendingAppointmentCount((count) => count + (u.status === 'Pending' ? 1 : 0) - (previous.status === 'Pending' ? 1 : 0));
      }
    } catch (e) {
      setErr(e.message);
    }
  };

  const change = (k) => (e) => {
    const n = { ...f, [k]: e.target.value };
    setF(n);
    load(n);
  };
  const refresh = () => {
    setF(DEFAULT_FILTERS);
    load(DEFAULT_FILTERS);
  };
  const dashboardTheme = isDark
    ? {
        main: 'bg-[#052f33] text-[#d8f3ef]',
        headerBorder: 'border-[#2f6d6c]',
        brand: 'text-[#ecf9f7]',
        subtitle: 'text-[#bfe5df]',
        title: 'text-[#ebf9f7]',
        filter: 'border-[#3b7875] bg-[#0b4c4a] text-[#eafaf8]',
        refresh: 'border-[#62d8ca] text-[#dffbf6] shadow-[0_0_0_1px_rgba(98,216,202,0.3)] hover:bg-[#0d5d5d]',
        error: 'text-red-300',
        table: 'border-[#2b6a69] bg-[#0a4648]',
        tableHead: 'bg-[#0b5658] text-[#ebfaf8]',
        row: 'border-[#2d6968] text-[#ebfaf8]',
        cell: 'text-[#ebfaf8]',
        date: 'text-[#f0fdfb]',
        patient: 'text-[#f4fffd]',
        contact: 'text-[#d3f4ef]',
        notes: 'text-[#d7ece9]',
        empty: 'text-[#cfecec]',
      }
    : {
        main: 'bg-paper text-ink',
        headerBorder: 'border-teal-100',
        brand: 'text-teal-900',
        subtitle: 'text-teal-700',
        title: 'text-teal-900',
        filter: 'border-teal-100 bg-white text-ink',
        refresh: 'border-teal-600 text-teal-700 hover:bg-teal-50',
        error: 'text-red-700',
        table: 'border-teal-100 bg-white',
        tableHead: 'bg-teal-50 text-ink',
        row: 'border-teal-100 text-ink',
        cell: 'text-ink',
        date: 'text-ink',
        patient: 'text-ink',
        contact: 'text-teal-700',
        notes: 'text-ink/60',
        empty: 'text-ink/60',
      };

  if (!rows) return (
    <main className="admin-dashboard mx-auto max-w-sm px-4 py-10 md:py-14">
      <header className="mb-8 flex items-center gap-4">
        <img src="/dental-clinic-logo.png" alt="Dr. Munesh Kumar & Associates Dental Care logo" className="h-16 w-16 shrink-0 rounded-full object-contain" />
        <div>
          <p className="font-display text-lg font-bold leading-tight text-teal-900">Dr. Munesh Kumar</p>
          <p className="text-sm font-medium text-teal-700">& Associates Dental Care</p>
        </div>
      </header>
      <section className="modern-card rounded-2xl border border-teal-100 bg-white p-6 shadow-sm">
        <h1 className="font-display text-2xl font-bold text-teal-900">Staff sign-in</h1>
        <form onSubmit={(e) => { e.preventDefault(); load(); }} className="mt-4 space-y-3">
          <input type="password" className="field" placeholder="Admin key" value={key} onChange={(e) => setKey(e.target.value)} />
          <button className="btn w-full bg-teal-600 text-white">Open dashboard</button>
          {err && <p role="alert" className="text-red-700">{err}</p>}
        </form>
      </section>
    </main>
  );

  return (
    <main className={`admin-dashboard min-h-screen px-4 py-6 md:px-6 md:py-8 ${dashboardTheme.main}`}>
      <div className="mx-auto max-w-[1400px]">
        <header className={`mb-8 flex items-center border-b pb-5 ${dashboardTheme.headerBorder}`}>
          <div className="flex items-center gap-4">
            <img src="/dental-clinic-logo.png" alt="Dr. Munesh Kumar & Associates Dental Care logo" className="h-12 w-12 shrink-0 rounded-full object-contain" />
            <div>
              <p className={`font-display text-[29px] font-bold leading-none tracking-[-0.04em] ${dashboardTheme.brand}`}>Dr. Munesh Kumar</p>
              <p className={`text-[15px] font-medium ${dashboardTheme.subtitle}`}>& Associates Dental Care</p>
            </div>
          </div>
        </header>

        <h1 className={`mb-6 mt-5 font-display text-3xl font-bold leading-tight tracking-[-0.04em] sm:text-4xl ${dashboardTheme.title}`}>
          {section === 'appointments' ? 'Appointment requests' : section === 'messages' ? 'Notifications' : 'Review approvals'}
        </h1>

        <div className="mb-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => { setSection('appointments'); setErr(''); }}
            className={`admin-tab rounded-full border px-5 py-2.5 font-semibold transition ${section === 'appointments' ? dashboardTheme.refresh : dashboardTheme.filter}`}
          >
            Appointments
            {pendingAppointmentCount > 0 && (
              <span className="ml-2 rounded-full bg-[#e7a323] px-2 py-0.5 text-sm text-white">
                {pendingAppointmentCount}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => { setSection('messages'); setErr(''); }}
            className={`admin-tab rounded-full border px-5 py-2.5 font-semibold transition ${section === 'messages' ? dashboardTheme.refresh : dashboardTheme.filter}`}
          >
            Notifications
            {messages.some((message) => !message.isRead) && (
              <span className="ml-2 rounded-full bg-[#e7a323] px-2 py-0.5 text-sm text-white">
                {messages.filter((message) => !message.isRead).length}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => { setSection('reviews'); setErr(''); }}
            className={`admin-tab rounded-full border px-5 py-2.5 font-semibold transition ${section === 'reviews' ? dashboardTheme.refresh : dashboardTheme.filter}`}
          >
            Reviews
            {pendingReviews.length > 0 && (
              <span className="ml-2 rounded-full bg-[#e7a323] px-2 py-0.5 text-sm text-white">
                {pendingReviews.length}
              </span>
            )}
          </button>
        </div>

        {section === 'messages' ? (
          <>
            <h2 className={`mb-4 font-display text-2xl font-bold ${dashboardTheme.title}`}>Contact messages</h2>
            <button
              type="button"
              onClick={refreshMessages}
              className={`mb-4 inline-flex items-center justify-center rounded-full border bg-transparent px-5 py-2 font-semibold transition ${dashboardTheme.refresh}`}
            >
              Refresh messages
            </button>
            {err && <p role="alert" className={`mb-4 ${dashboardTheme.error}`}>{err}</p>}
            <div className="space-y-4">
              {messages.map((message) => (
                <article key={message._id} className={`modern-card rounded-2xl border p-5 ${dashboardTheme.table} ${message.isRead ? 'opacity-75' : ''}`}>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className={`font-bold ${dashboardTheme.patient}`}>{message.name}</p>
                      <p className={`mt-1 text-sm ${dashboardTheme.contact}`}>
                        {message.phone && <a className="underline" href={`tel:${message.phone}`}>{message.phone}</a>}
                        {message.phone && message.email && ' · '}
                        {message.email && <a className="underline" href={`mailto:${message.email}`}>{message.email}</a>}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <time className={`text-sm ${dashboardTheme.notes}`} dateTime={message.createdAt}>
                        {new Date(message.createdAt).toLocaleString()}
                      </time>
                      {!message.isRead && (
                        <button
                          type="button"
                          onClick={() => markMessageRead(message._id)}
                          className={`rounded-full border px-3 py-1 text-sm font-semibold ${dashboardTheme.refresh}`}
                        >
                          Mark read
                        </button>
                      )}
                    </div>
                  </div>
                  <p className={`mt-4 whitespace-pre-wrap break-words ${dashboardTheme.cell}`}>{message.message}</p>
                </article>
              ))}
              {!messages.length && (
                <p className={`rounded-2xl border p-6 text-center ${dashboardTheme.table} ${dashboardTheme.empty}`}>
                  No contact messages yet.
                </p>
              )}
            </div>
          </>
        ) : section === 'reviews' ? (
          <>
            <h2 className={`mb-4 font-display text-2xl font-bold ${dashboardTheme.title}`}>Reviews awaiting approval</h2>
            <button
              type="button"
              onClick={refreshReviews}
              className={`mb-4 inline-flex items-center justify-center rounded-full border bg-transparent px-5 py-2 font-semibold transition ${dashboardTheme.refresh}`}
            >
              Refresh reviews
            </button>
            {err && <p role="alert" className={`mb-4 ${dashboardTheme.error}`}>{err}</p>}
            <div className="space-y-4">
              {pendingReviews.map((review) => (
                <article key={review._id} className={`modern-card rounded-2xl border p-5 ${dashboardTheme.table}`}>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className={`font-bold ${dashboardTheme.patient}`}>{review.patientName} · {review.branch}</p>
                      <div className="mt-2"><Stars n={review.rating} size={16} /></div>
                    </div>
                    <div className="flex items-center gap-3">
                      <time className={`text-sm ${dashboardTheme.notes}`} dateTime={review.date}>
                        {new Date(review.date).toLocaleString()}
                      </time>
                      <button
                        type="button"
                        onClick={() => approveReview(review._id)}
                        className={`rounded-full border px-4 py-2 text-sm font-semibold ${dashboardTheme.refresh}`}
                      >
                        Approve
                      </button>
                    </div>
                  </div>
                  <p className={`mt-4 whitespace-pre-wrap break-words ${dashboardTheme.cell}`}>{review.comment}</p>
                </article>
              ))}
              {!pendingReviews.length && (
                <p className={`rounded-2xl border p-6 text-center ${dashboardTheme.table} ${dashboardTheme.empty}`}>
                  No reviews are waiting for approval.
                </p>
              )}
            </div>
          </>
        ) : (
        <>
        <div className="mb-6 flex flex-wrap items-center gap-4">
          <div className="relative">
            <select
              className={`field !w-[220px] appearance-none border px-5 py-4 pr-11 text-[18px] font-medium ${dashboardTheme.filter}`}
              value={f.status}
              onChange={change('status')}
              style={selectArrow(isDark)}
            >
              <option value="">All statuses</option>
              {STATUSES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>

          <div className="relative">
            <select
              className={`field !w-[220px] appearance-none border px-5 py-4 pr-11 text-[18px] font-medium ${dashboardTheme.filter}`}
              value={f.branch}
              onChange={change('branch')}
              style={selectArrow(isDark)}
            >
              <option value="">Both branches</option>
              <option>Qasimabad</option>
              <option>Mithi</option>
            </select>
          </div>

          <div className="relative">
            <input
              type="date"
              className={`field !w-[200px] border ${dashboardTheme.filter}`}
              value={f.date}
              onChange={change('date')}
              style={{ colorScheme: isDark ? 'dark' : 'light' }}
            />
          </div>

          <button
            type="button"
            onClick={refresh}
            className={`inline-flex items-center justify-center rounded-full border bg-transparent px-6 py-3 text-[20px] font-medium transition ${dashboardTheme.refresh}`}
          >
            Refresh
          </button>
        </div>

        {err && <p role="alert" className={`mb-4 ${dashboardTheme.error}`}>{err}</p>}

        <div className={`overflow-x-auto rounded-[14px] border shadow-[0_10px_30px_rgba(0,0,0,0.16)] ${dashboardTheme.table}`}>
          <table className="w-full min-w-[900px] table-fixed border-collapse text-left text-sm">
            <colgroup>
              <col className="w-[15%]" />
              <col className="w-[12%]" />
              <col className="w-[38%]" />
              <col className="w-[19%]" />
              <col className="w-[16%]" />
            </colgroup>
            <thead className={dashboardTheme.tableHead}>
              <tr>
                {['When', 'Branch', 'Patient', 'Service', 'Status'].map((h) => (
                  <th key={h} className="px-3 py-3 text-left text-sm font-semibold tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r._id} className={`border-t align-top ${dashboardTheme.row}`}>
                  <td className={`px-3 py-3 align-top font-medium leading-snug ${dashboardTheme.date}`}>
                    {r.date}
                    <br />
                    {r.time}
                  </td>
                  <td className={`px-3 py-3 align-top break-words ${dashboardTheme.cell}`}>{r.branch}</td>
                  <td className={`px-3 py-3 align-top break-words ${dashboardTheme.cell}`}>
                    <span className={`block font-bold ${dashboardTheme.patient}`}>{r.name}</span>
                    <a className={`${dashboardTheme.contact} underline`} href={`tel:${r.phone}`}>{r.phone}</a>
                    {r.email && <><br /><span>{r.email}</span></>}
                    {r.notes && <p className={`mt-2 break-words text-xs leading-relaxed ${dashboardTheme.notes}`}>{r.notes}</p>}
                  </td>
                  <td className={`px-3 py-3 align-top break-words ${dashboardTheme.cell}`}>
                    <div className="leading-snug">{r.service}</div>
                  </td>
                  <td className="px-3 py-3 align-top text-right">
                    <select
                      aria-label="Status"
                      value={r.status}
                      onChange={(e) => setStatus(r._id, e.target.value)}
                      className={`ml-auto mt-1 min-w-[120px] appearance-none rounded-full px-3 py-2 pr-7 text-sm font-semibold ${tone[r.status]}`}
                      style={selectArrow(isDark)}
                    >
                      {STATUSES.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
              {!rows.length && (
                <tr>
                  <td colSpan={5} className={`p-6 text-center ${dashboardTheme.empty}`}>No appointments match these filters.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        </>
        )}
      </div>
    </main>
  );
}
