import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { getReviews, submitReview } from '../api';
import Stars from './Stars';

export default function Reviews() {
  const [list, setList] = useState([]);
  const [activeReview, setActiveReview] = useState(0);
  const [isReviewExpanded, setIsReviewExpanded] = useState(false);
  const [form, setForm] = useState({ patientName: '', rating: '5', comment: '', branch: '' });
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getReviews()
      .then(setList)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setNotice('');
    try {
      const result = await submitReview({ ...form, rating: Number(form.rating) });
      setNotice(result.message);
      setForm({ patientName: '', rating: '5', comment: '', branch: '' });
    } catch (e) {
      setError(e.message);
    }
  };

  const reviewItems = list.map((review) => ({
    id: review._id,
    name: review.patientName,
    branch: review.branch,
    rating: review.rating,
    comment: review.comment,
    date: review.date,
  }));
  const currentReview = reviewItems.length ? reviewItems[activeReview % reviewItems.length] : null;
  const changeReview = (direction) => {
    setActiveReview((index) => (index + direction + reviewItems.length) % reviewItems.length);
    setIsReviewExpanded(false);
  };

  return (
    <section id="reviews" className="scroll-mt-16 bg-teal-50 py-12 md:py-14">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mx-auto max-w-3xl text-center">
          <p className="section-kicker">Kind words from our patients</p>
          <h2 className="section-title mt-2">Real experiences. Real smiles.</h2>
          <p className="section-description mt-2 text-sm sm:text-base">Read reviews shared by patients on our website.</p>
        </div>
        {currentReview && (
          <div className="mx-auto mt-7 max-w-2xl">
            <article className="review-card modern-card rounded-2xl border border-teal-100 bg-white px-5 py-6 text-center shadow-sm sm:px-8">
              <div className="flex justify-center"><Stars n={currentReview.rating} size={18} /></div>
              <blockquote className={`review-quote mt-4 text-base leading-relaxed sm:text-lg ${isReviewExpanded ? '' : 'review-quote-collapsed'}`}>
                “{currentReview.comment}”
              </blockquote>
              {currentReview.comment.length > 240 && (
                <button
                  type="button"
                  aria-expanded={isReviewExpanded}
                  onClick={() => setIsReviewExpanded((expanded) => !expanded)}
                  className="mt-2 text-sm font-semibold text-teal-700 underline underline-offset-2"
                >
                  {isReviewExpanded ? 'Show less' : 'Read full review'}
                </button>
              )}
              <p className="mt-4 font-bold text-teal-900">{currentReview.name}</p>
              <p className="mt-1 text-xs text-ink/70 sm:text-sm">
                {currentReview.branch} · Website review
                {currentReview.date && <> · {new Date(currentReview.date).toLocaleDateString()}</>}
              </p>
            </article>
            {reviewItems.length > 1 && (
              <div className="mt-3 flex items-center justify-center gap-4">
                <button
                  type="button"
                  aria-label="Previous review"
                  onClick={() => changeReview(-1)}
                  className="rounded-full border border-teal-600 p-2 text-teal-800 transition hover:bg-teal-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
                >
                  <ChevronLeft size={20} />
                </button>
                <span className="text-sm text-ink/70" aria-live="polite">
                  {activeReview % reviewItems.length + 1} / {reviewItems.length}
                </span>
                <button
                  type="button"
                  aria-label="Next review"
                  onClick={() => changeReview(1)}
                  className="rounded-full border border-teal-600 p-2 text-teal-800 transition hover:bg-teal-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </div>
        )}
        {loading && <p className="mt-8 text-center text-ink/70">Loading reviews…</p>}
        {!loading && error && <p role="alert" className="mt-8 text-center text-sm text-red-700">{error}</p>}
        {!loading && !currentReview && !error && (
          <p className="mt-8 text-center text-ink/70">No reviews have been published yet. Be the first to share your experience.</p>
        )}
        <div className="modern-card mx-auto mt-10 max-w-2xl rounded-2xl border border-teal-100 bg-white p-5 md:p-6">
          <h3 className="font-display text-2xl font-bold text-teal-900">Share your experience</h3>
          <form onSubmit={submit} className="mt-5 grid gap-4 md:grid-cols-2">
            <label className="text-sm font-medium text-ink">
              Your name
              <input
                required
                maxLength={80}
                className="field mt-1"
                value={form.patientName}
                onChange={(e) => setForm({ ...form, patientName: e.target.value })}
              />
            </label>
            <label className="text-sm font-medium text-ink">
              Clinic branch
              <select
                required
                className="field mt-1"
                value={form.branch}
                onChange={(e) => setForm({ ...form, branch: e.target.value })}
              >
                <option value="">Choose a branch</option>
                <option value="Qasimabad">Qasimabad</option>
                <option value="Mithi">Mithi</option>
              </select>
            </label>
            <fieldset className="text-sm font-medium text-ink">
              <legend>Rating</legend>
              <div className="mt-1 flex items-center gap-1" role="group" aria-label="Choose a rating">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    aria-label={`${rating} ${rating === 1 ? 'star' : 'stars'}`}
                    aria-pressed={Number(form.rating) === rating}
                    onClick={() => setForm({ ...form, rating: String(rating) })}
                    className="rounded p-1 transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
                  >
                    <Star
                      size={26}
                      className={rating <= Number(form.rating) ? 'fill-gold text-gold' : 'text-teal-200'}
                    />
                  </button>
                ))}
                <span className="ml-2 text-sm text-ink/70">{form.rating} of 5</span>
              </div>
            </fieldset>
            <label className="text-sm font-medium text-ink md:col-span-2">
              Your review
              <textarea
                required
                maxLength={600}
                rows={4}
                className="field mt-1"
                value={form.comment}
                onChange={(e) => setForm({ ...form, comment: e.target.value })}
              />
            </label>
            {error && <p role="alert" className="text-sm text-red-700 md:col-span-2">{error}</p>}
            {notice && <p role="status" className="text-sm text-teal-800 md:col-span-2">{notice}</p>}
            <button className="btn bg-teal-600 text-white hover:bg-teal-700 md:col-span-2">Submit review</button>
          </form>
        </div>
      </div>
    </section>
  );
}