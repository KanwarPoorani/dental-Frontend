const API_BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');

const call = async (url, opts) => {
  const res = await fetch(`${API_BASE_URL}${url}`, { headers: { 'Content-Type': 'application/json' }, ...opts });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || data.error || 'Request failed');
  return data;
};
export const bookAppointment = (body) => call('/api/appointments', { method: 'POST', body: JSON.stringify(body) });
export const sendContact = (body) => call('/api/contact', { method: 'POST', body: JSON.stringify(body) });
export const getReviews = () => call('/api/reviews');
export const getGoogleReviews = () => call('/api/google-reviews');
export const submitReview = (body) => call('/api/reviews', { method: 'POST', body: JSON.stringify(body) });
export const getJson = (p) => call(`/api${p}`);
export const lookupAppointment = (phone, email) => call(`/api/appointments/lookup?phone=${encodeURIComponent(phone)}&email=${encodeURIComponent(email)}`);
export const getSlots = (branch, date) => call(`/api/appointments/availability?branch=${branch}&date=${date}`);
export const adminApi = (key, p, opts = {}) => call(`/api${p}`, { ...opts, headers: { 'Content-Type': 'application/json', 'x-admin-key': key } });
export const manageGet = (t) => call(`/api/manage/${t}`);
export const manageReschedule = (t, body) => call(`/api/manage/${t}/reschedule`, { method: 'PATCH', body: JSON.stringify(body) });
export const manageCancel = (t) => call(`/api/manage/${t}/cancel`, { method: 'POST' });