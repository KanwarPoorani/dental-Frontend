import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { getJson } from '../api';
import { SAMPLE_ARTICLES } from '../data';

export default function Article() {
  const { slug } = useParams();
  const [a, setA] = useState(() => SAMPLE_ARTICLES.find((article) => article.slug === slug) || null);
  const [usingSample, setUsingSample] = useState(Boolean(a));
  const [err, setErr] = useState('');
  useEffect(() => {
    const sample = SAMPLE_ARTICLES.find((article) => article.slug === slug) || null;
    setA(sample);
    setUsingSample(Boolean(sample));
    setErr('');
    getJson(`/articles/${slug}`)
      .then((article) => {
        setA(article);
        setUsingSample(false);
      })
      .catch((error) => {
        if (sample) {
          setA(sample);
          setUsingSample(true);
          return;
        }
        setErr(error.message);
      });
  }, [slug]);
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 md:py-14">
      <Link to="/#advice" className="btn inline-flex border border-teal-600 text-teal-700">
        <ArrowLeft size={18} />
        Back to the clinic site
      </Link>
      {err && <p className="mt-6">{err}</p>}
      {a && <article className="modern-card mt-6 rounded-3xl border border-teal-100 bg-white p-6 shadow-sm sm:p-10">
        {usingSample && <p role="status" className="mb-3 text-sm text-ink/70">Showing a sample article.</p>}
        <h1 className="font-display text-3xl font-bold tracking-tight text-teal-900 sm:text-4xl">{a.title}</h1>
        {a.body.split(/\n\n+/).map((p, i) => <p key={i} className="mt-5 text-base leading-8 text-ink/80 sm:text-lg">{p}</p>)}</article>}
    </main>
  );
}
