'use client';

const testimonials = [
  {
    quote:
      'It arrived wrapped like a gift from another era. I opened it in the dark and remembered why I started wearing perfume.',
    name: 'Ama K.',
    location: 'Accra',
    note: 'Eau de Parfum · 50ml',
  },
  {
    quote:
      'Bro this perfume is fire. Three compliments before lunch. Worth every cedi.',
    name: 'Kwame D.',
    location: 'KNUST',
    note: 'Travel · 30ml',
  },
  {
    quote:
      'The amber dries down to something my mother used to wear. It feels like a memory I never had.',
    name: 'Efua M.',
    location: 'Tema',
    note: 'Extrait · 75ml',
  },
  {
    quote:
      'Delivered to my door before noon. Lasted till dawn. Already drafting my next order.',
    name: 'Kofi B.',
    location: 'East Legon',
    note: 'Eau de Parfum · 100ml',
  },
];

/**
 *  Testimonials — "From the Counter"
 *  Rejecting the chat-bubble grid. Each quote is set as a pulled-quote
 *  card with display italic, attributed beneath. Asymmetric stagger.
 */
export function Testimonials() {
  return (
    <section className="relative w-full bg-ink py-24 sm:py-32 grain">
      {/* Top hairline */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-1/2 bg-gold/25" />

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 sm:px-10 lg:px-14">
        <div className="flex items-end justify-between gap-8 mb-16 sm:mb-24">
          <div>
            <p className="label-spec text-gold mb-6">
              <span className="tick bg-gold/60" />
              Chapter&nbsp;IV&nbsp;·&nbsp;Letters&nbsp;Received
            </p>
            <h2 className="font-display text-vellum leading-[0.95] tracking-tight">
              <span className="block text-[clamp(2.5rem,7vw,6rem)]">From the</span>
              <span className="block font-display-italic text-[clamp(2.5rem,7vw,6rem)] text-gold -mt-1">
                counter.
              </span>
            </h2>
          </div>
        </div>

        {/* Quote spread — staggered */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-20 lg:gap-y-28">
          {testimonials.map((t, i) => (
            <figure
              key={i}
              className={`relative ${i % 2 === 1 ? 'md:translate-y-20' : ''}`}
            >
              {/* Decorative serif quote mark */}
              <span
                aria-hidden
                className="absolute -top-12 -left-2 font-display-italic text-gold/60 text-[6rem] leading-none select-none"
              >
                "
              </span>

              <blockquote className="relative pl-6 pr-2">
                <p className="font-display-italic text-vellum text-[clamp(1.25rem,2.5vw,2rem)] leading-[1.3]">
                  {t.quote}
                </p>
              </blockquote>

              <figcaption className="mt-8 pl-6 flex items-baseline gap-4">
                <span className="h-px w-10 bg-gold" />
                <div>
                  <p className="font-mono-spec text-xs text-gold">
                    {t.name}
                  </p>
                  <p className="label-spec text-shadow mt-1">
                    {t.location}&nbsp;·&nbsp;{t.note}
                  </p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
