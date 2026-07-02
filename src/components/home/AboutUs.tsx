'use client';

import { Phone, Mail } from 'lucide-react';

/**
 *  AboutUs — "The Bench"
 *  An editorial about-section. A pulled quote on the left,
 *  a typeset specimen card on the right showing hours, locations,
 *  and contact, in the manner of a museum docent label.
 */
export function AboutUs() {
  return (
    <section className="relative w-full bg-ink py-24 sm:py-32 grain">
      {/* Top hairline */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-1/2 bg-gold/25" />

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 sm:px-10 lg:px-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          {/* LEFT — pull quote */}
          <div className="lg:col-span-7">
            <p className="label-spec text-gold mb-10">
              <span className="tick bg-gold/60" />
              Chapter&nbsp;III&nbsp;·&nbsp;The&nbsp;House
            </p>

            <blockquote className="font-display text-vellum leading-[1.05] tracking-[-0.01em]">
              <span className="block text-[clamp(2rem,5.5vw,4.75rem)]">
                We don't sell{' '}
                <span className="font-display-italic text-gold">perfume.</span>
              </span>
              <span className="block text-[clamp(2rem,5.5vw,4.75rem)] mt-1">
                We compose nights you'll
              </span>
              <span className="block text-[clamp(2rem,5.5vw,4.75rem)] mt-1">
                remember by their{' '}
                <span className="font-display-italic text-gold">scent.</span>
              </span>
            </blockquote>

            <div className="mt-12 max-w-md">
              <p className="text-bone text-[15px] leading-[1.7]">
                Fragrance Parl is a small house operating from Accra, working
                with raw materials sourced personally from Grasse, Mysore, and
                the souks of the Levant. Every edition is bottled in limited
                runs, hand-numbered, and shipped within the week.
              </p>
            </div>
          </div>

          {/* RIGHT — specimen card with details */}
          <aside className="lg:col-span-5">
            <div className="relative border border-gold/25 bg-smoke/40 p-8 sm:p-10">
              <span className="absolute -top-3 left-8 bg-ink px-3 label-spec text-gold">
                Specimen&nbsp;·&nbsp;The&nbsp;Counter
              </span>

              {/* Hours table */}
              <p className="label-spec text-shadow mb-4">Hours</p>
              <table className="w-full mb-10">
                <tbody>
                  {[
                    ['Monday', '9—18'],
                    ['Tuesday', '— ', true],
                    ['Wednesday', '— ', true],
                    ['Thursday', '9—20'],
                    ['Friday', '— ', true],
                    ['Saturday', '9—18'],
                    ['Sunday', '— ', true],
                  ].map(([day, hours, closed]) => (
                    <tr
                      key={day as string}
                      className="border-b border-gold/10 last:border-0"
                    >
                      <td className="py-2.5 font-display-italic text-vellum text-base">
                        {day}
                      </td>
                      <td
                        className={`py-2.5 text-right font-mono-spec text-xs ${
                          closed ? 'text-shadow/60' : 'text-gold'
                        }`}
                      >
                        {closed ? 'Closed' : hours}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Locations */}
              <p className="label-spec text-shadow mb-4">Counters</p>
              <ul className="mb-10 space-y-3">
                <li className="flex items-baseline justify-between gap-4 border-b border-gold/10 pb-3">
                  <span className="font-display-italic text-vellum text-base">
                    UPSA Campus
                  </span>
                  <span className="font-mono-spec text-[10px] text-gold">
                    Free&nbsp;delivery
                  </span>
                </li>
                <li className="flex items-baseline justify-between gap-4">
                  <span className="font-display-italic text-vellum text-base">
                    KNUST Campus
                  </span>
                  <span className="font-mono-spec text-[10px] text-gold">
                    Free&nbsp;delivery
                  </span>
                </li>
              </ul>

              {/* Contact */}
              <p className="label-spec text-shadow mb-4">Correspondence</p>
              <div className="flex flex-col gap-3">
                <a
                  href="tel:+233550798770"
                  className="group flex items-center gap-3 text-bone hover:text-gold transition-colors duration-300"
                >
                  <Phone className="h-3.5 w-3.5" strokeWidth={1.5} />
                  <span className="font-mono-spec text-xs">
                    +233&nbsp;550&nbsp;798&nbsp;770
                  </span>
                </a>
                <a
                  href="mailto:urfragranceparl@gmail.com"
                  className="group flex items-center gap-3 text-bone hover:text-gold transition-colors duration-300"
                >
                  <Mail className="h-3.5 w-3.5" strokeWidth={1.5} />
                  <span className="font-mono-spec text-xs">
                    urfragranceparl@gmail.com
                  </span>
                </a>
              </div>
            </div>

            {/* Beneath the card — small footnote */}
            <p className="mt-6 label-spec text-shadow text-right">
              Composed&nbsp;weekly&nbsp;·&nbsp;Bottled&nbsp;by&nbsp;hand
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}
