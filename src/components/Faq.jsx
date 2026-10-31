import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getJson } from '../api';
import { SAMPLE_ARTICLES, SAMPLE_FAQS } from '../data';

export default function Faq() {
  const [faqs, setFaqs] = useState(SAMPLE_FAQS);
  const [articles, setArticles] = useState(SAMPLE_ARTICLES);
  const [usingSample, setUsingSample] = useState(true);
  const [usingSampleArticles, setUsingSampleArticles] = useState(true);
  useEffect(() => {
    getJson('/faqs')
      .then((items) => {
        if (Array.isArray(items) && items.length) {
          setFaqs(items);
          setUsingSample(false);
          return;
        }
        setUsingSample(true);
      })
      .catch(() => setUsingSample(true));
    getJson('/articles')
      .then((items) => {
        if (Array.isArray(items) && items.length) {
          setArticles(items);
          setUsingSampleArticles(false);
          return;
        }
        setUsingSampleArticles(true);
      })
      .catch(() => setUsingSampleArticles(true));
  }, []);
  return (
    <section id="advice" className="mx-auto grid max-w-6xl scroll-mt-16 gap-12 px-4 py-16 md:grid-cols-2">
      <div>
        <p className="section-kicker mb-2">Helpful information</p>
        <h2 className="section-title">Common questions</h2>
        {usingSample && <p role="status" className="mt-2 text-sm text-ink/70">Showing sample questions.</p>}
        <div className="modern-card mt-6 divide-y divide-teal-100 rounded-2xl border border-teal-100 bg-white">
          {faqs.map((f) => (
            <details key={f._id} className="group p-4 transition-colors open:bg-teal-50/60">
              <summary className="cursor-pointer font-bold marker:text-teal-600">{f.question}</summary>
              <p className="mt-2 text-ink/80">{f.answer}</p>
            </details>
          ))}
        </div>
      </div>
      <div>
        <p className="section-kicker mb-2">From the clinic</p>
        <h2 className="section-title">Oral-health advice</h2>
        {usingSampleArticles && <p role="status" className="mt-2 text-sm text-ink/70">Showing a sample article.</p>}
        <ul className="mt-6 space-y-4">
          {articles.map((a) => (
            <li key={a._id}><Link to={`/articles/${a.slug}`} className="modern-card block rounded-2xl border border-teal-100 bg-white p-4">
              <b>{a.title}</b><span className="block text-sm text-ink/70">{a.excerpt}</span></Link></li>
          ))}
        </ul>
      </div>
    </section>
  );
}
