import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const SLIDES = [
  {
    src: '/braces-treatment-carousel.png',
    alt: 'Braces treatment progress from initial alignment through to a finished smile',
    title: 'A smile transformation',
    description: 'Explore the stages of orthodontic treatment.',
  },
  {
    src: '/clinic-hours-carousel.png',
    alt: 'Clinic information for Dr. Munesh Kumar and Associates',
    title: 'Care close to home',
    description: 'Find clinic details for Hyderabad and Mithi.',
  },
  {
    src: '/dental-services-carousel.png',
    alt: 'Dental services offered by Dr. Munesh Kumar and Associates',
    title: 'Complete dental care',
    description: 'Explore treatments and book a visit with our clinic.',
  },
];

export default function Hero() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return undefined;
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % SLIDES.length);
    }, 6000);
    return () => window.clearInterval(timer);
  }, [paused]);

  const changeSlide = (direction) => {
    setActiveSlide((current) => (current + direction + SLIDES.length) % SLIDES.length);
  };

  return (
    <section className="hero-section bg-gradient-to-b from-teal-50 via-paper to-teal-100">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-12 md:grid-cols-2 md:gap-12 md:py-16">
        {/* The single orchestrated page-load moment: headline + CTAs rise in together */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <p className="section-kicker mb-4">Confident care, brighter smiles</p>
          <h1 className="font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-teal-900 md:text-6xl">Implants, facial surgery and smile care in Hyderabad and Mithi.</h1>
          <p className="mt-5 max-w-prose text-lg leading-relaxed text-slate-600">Led by Dr. Munesh Kumar and associates. Choose the branch closest to you and book online in under a minute.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#book" className="rounded-xl bg-teal-600 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-teal-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700">Book appointment</a>
            <a href="#locations" className="hero-secondary-cta rounded-xl border-2 border-teal-700 px-6 py-3 font-semibold text-teal-900 transition hover:bg-teal-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700">Our locations</a>
          </div>
        </motion.div>
        <div className="grid gap-4">
          <div
            className="modern-card overflow-hidden rounded-3xl border border-teal-100 bg-white p-3 shadow-lg shadow-teal-900/10"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocusCapture={() => setPaused(true)}
            onBlurCapture={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false);
            }}
            aria-roledescription="carousel"
            aria-label="Clinic highlights"
          >
            <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-2xl bg-teal-50 sm:aspect-[3/2] md:aspect-[4/3]">
              <img
                src={SLIDES[activeSlide].src}
                alt=""
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 h-full w-full scale-110 object-cover opacity-30 blur-2xl"
              />
              <motion.img
                key={activeSlide}
                src={SLIDES[activeSlide].src}
                alt={SLIDES[activeSlide].alt}
                className="relative z-10 h-full w-full object-contain drop-shadow-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.35 }}
              />
              <button
                type="button"
                aria-label="Previous slide"
                onClick={() => changeSlide(-1)}
                className="absolute left-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-teal-900 shadow hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-700"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                type="button"
                aria-label="Next slide"
                onClick={() => changeSlide(1)}
                className="absolute right-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-teal-900 shadow hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-700"
              >
                <ChevronRight size={24} />
              </button>
            </div>
            <div className="flex items-center justify-between gap-4 px-2 pb-1 pt-3">
              <div aria-live="polite" aria-atomic="true">
                <p className="font-display font-bold text-teal-900">{SLIDES[activeSlide].title}</p>
                <p className="text-sm text-slate-600">{SLIDES[activeSlide].description}</p>
              </div>
              <div className="flex shrink-0 items-center gap-2" aria-label="Choose carousel slide">
                {SLIDES.map((slide, index) => (
                  <button
                    key={slide.src}
                    type="button"
                    aria-label={`Show slide ${index + 1}: ${slide.title}`}
                    aria-current={activeSlide === index ? 'true' : undefined}
                    onClick={() => setActiveSlide(index)}
                    className={`h-2.5 rounded-full transition-all ${activeSlide === index ? 'w-7 bg-teal-700' : 'w-2.5 bg-teal-200 hover:bg-teal-400'}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
