import { SERVICES } from '../data';

export default function Services() {
  return (
    <section id="services" className="services-section scroll-mt-16 bg-teal-900 py-16 text-white">
      <div className="mx-auto max-w-6xl px-4">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-teal-100">Personalized treatment</p>
        <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Our Services</h2>
        <p className="mt-2 max-w-2xl leading-relaxed text-teal-100">Explore our treatments and find the right care for your smile.</p>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service) => (
            <article key={service.name} className="service-card service-card-hover modern-card overflow-hidden rounded-2xl bg-white text-ink shadow-lg shadow-black/10">
              <img
                className="service-image aspect-[4/3] w-full object-cover"
                src={service.image}
                alt={service.name}
                loading="lazy"
              />
              <div className="p-5">
                <h3 className="font-display text-xl font-bold text-teal-900">{service.name}</h3>
                <p className="mt-2 font-semibold text-teal-700">{service.headline}</p>
                <p className="mt-2 text-sm leading-relaxed text-ink/70">{service.description}</p>
                <p className="mt-4 border-t border-teal-100 pt-3 text-sm font-bold text-teal-900">
                  <span className="text-xs font-semibold uppercase tracking-wide text-ink/60">Price </span>
                  {service.price}
                </p>
              </div>
            </article>
          ))}
        </div>
        <p className="mt-6 text-sm text-teal-100/80">Prices may vary depending on your treatment needs. Your dentist will confirm the final cost after examination.</p>
      </div>
    </section>
  );
}
