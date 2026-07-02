'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

/**
 *  Hero — "Phantom Bloom"
 *  An editorial spread, not a banner. A massive italic serif phrase
 *  fills the page on the left. The fragrance image sits offset to the
 *  right, treated like a museum specimen plate. The typography is the
 *  hero, not the photo.
 *
 *  No parallax. No animated pulses. One slow rise on load, one slow
 *  marquee at the bottom listing the olfactory houses.
 */
export function Hero() {
  return (
    <section className="relative w-full min-h-screen overflow-hidden bg-ink amber-wash grain-coarse">
      {/* Subtle radial atmosphere — slow drift */}
      <div className="absolute -top-[15%] -left-[10%] h-[60vh] w-[60vw] rounded-full bg-gold/5 blur-[120px] mdn-glow pointer-events-none" />
      <div className="absolute -bottom-[20%] -right-[10%] h-[55vh] w-[55vw] rounded-full bg-ember/5 blur-[140px] mdn-glow pointer-events-none" style={{ animationDelay: '6s' }} />

      {/* Vertical edition stamp running up the right edge */}
      <div className="hidden lg:block absolute right-8 top-1/2 -translate-y-1/2 z-20">
        <p className="vertical-rl label-spec text-shadow tracking-[0.4em]">
          Edition&nbsp;Nº&nbsp;01&nbsp;—&nbsp;MMXXIV
        </p>
      </div>

      {/* Left margin reference label */}
      <div className="hidden lg:block absolute left-8 top-1/2 -translate-y-1/2 z-20">
        <p className="vertical-rl label-spec text-shadow tracking-[0.4em]">
          Maison&nbsp;de&nbsp;Parfum&nbsp;—&nbsp;Accra
        </p>
      </div>

      {/* Top eyebrow row — masthead style */}
      <div className="relative z-10 pt-32 sm:pt-36 px-6 sm:px-10 lg:px-20">
        <div className="mx-auto max-w-[1280px] flex items-center justify-between">
          <p className="label-spec text-gold mdn-fade">
            <span className="tick bg-gold/60" />
            Volume&nbsp;I&nbsp;·&nbsp;The&nbsp;Late&nbsp;Hours
          </p>
          <p className="hidden sm:block label-spec text-shadow mdn-fade delay-200">
            Composed&nbsp;in&nbsp;limited&nbsp;runs
          </p>
        </div>
      </div>

      {/* Editorial spread */}
      <div className="relative z-10 mx-auto max-w-[1280px] px-6 sm:px-10 lg:px-20 pt-12 sm:pt-16 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-end">
          {/* LEFT: massive serif phrase */}
          <div className="lg:col-span-7">
            <h1 className="font-display text-vellum leading-[0.92] tracking-[-0.02em]">
              <span className="block text-[clamp(3.5rem,9vw,9rem)] mdn-rise">
                Phantom
              </span>
              <span className="block text-[clamp(3.5rem,9vw,9rem)] italic text-gold mdn-rise delay-300 -mt-2 sm:-mt-4">
                Bloom
              </span>
            </h1>

            {/* Typeset paragraph — narrow column, justified-left, italic accent */}
            <div className="mt-10 max-w-md mdn-rise delay-500">
              <p className="text-bone text-[15px] leading-[1.7] tracking-[0.005em]">
                A house of fragrances composed for those who keep
                <span className="font-display-italic text-vellum"> late hours</span>.
                Sourced ingredients, considered concentrations,
                bottled in small editions.
              </p>
            </div>

            {/* Specimen specs — like the side of a perfume bottle */}
            <dl className="mt-12 grid grid-cols-3 gap-x-6 gap-y-6 max-w-md mdn-rise delay-700">
              <Spec term="Concentration" value="Eau de Parfum" />
              <Spec term="Volume" value="50 · 75 · 100ml" />
              <Spec term="Sillage" value="6—8 hours" />
            </dl>

            {/* CTAs — editorial, underlined */}
            <div className="mt-14 flex flex-wrap items-center gap-x-10 gap-y-5 mdn-fade delay-900">
              <Link
                href="/category"
                className="group inline-flex items-center gap-3 label-spec text-vellum hover:text-gold transition-colors duration-300"
              >
                <span className="relative">
                  Browse&nbsp;The&nbsp;Library
                  <span className="absolute -bottom-1 left-0 right-0 h-px bg-gold transition-transform duration-500 origin-left scale-x-100 group-hover:scale-x-110" />
                </span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-x-1.5" strokeWidth={1.5} />
              </Link>
              <Link
                href="#new-arrivals"
                className="label-spec text-bone hover:text-gold transition-colors duration-300"
              >
                Latest&nbsp;Editions
              </Link>
            </div>
          </div>

          {/* RIGHT: specimen image, treated as a plate */}
          <div className="lg:col-span-5 relative mdn-fade delay-500">
            <div className="relative aspect-[3/4] w-full max-w-md mx-auto lg:max-w-none">
              {/* Frame — thin gold corner brackets */}
              <CornerBracket position="tl" />
              <CornerBracket position="tr" />
              <CornerBracket position="bl" />
              <CornerBracket position="br" />

              <div className="absolute inset-3 sm:inset-5 overflow-hidden">
                <Image
                  src="/images/pink.jpg"
                  alt="Fragrance Parl signature edition"
                  fill
                  sizes="(max-width: 1024px) 90vw, 40vw"
                  priority
                  className="object-cover object-center grayscale-[15%] contrast-[1.05] sepia-[10%]"
                />
                {/* Soft inner shadow */}
                <div className="absolute inset-0 shadow-[inset_0_0_120px_rgba(10,9,8,0.6)] pointer-events-none" />
                {/* Bottom amber-tone wash */}
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink/70 via-ink/20 to-transparent pointer-events-none" />
              </div>

              {/* Caption underneath, like a plate caption */}
              <div className="absolute -bottom-10 left-3 right-3 sm:left-5 sm:right-5 flex items-center justify-between">
                <p className="font-display-italic text-vellum text-base">
                  Plate&nbsp;I.&nbsp;<span className="text-gold">Phantom Bloom</span>
                </p>
                <p className="label-spec text-shadow">100ml</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom marquee — slow drift of olfactory houses */}
      <div className="absolute bottom-0 left-0 right-0 z-10 border-t border-gold/15 bg-ink/50 backdrop-blur-md overflow-hidden">
        <div className="mdn-marquee py-5 label-spec text-shadow">
          {Array.from({ length: 2 }).map((_, k) => (
            <div key={k} className="flex shrink-0 items-center">
              {[
                'Bergamot · Calabria',
                'Iris · Florence',
                'Oud · Assam',
                'Amber · Madagascar',
                'Rose · Grasse',
                'Vetiver · Haïti',
                'Sandalwood · Mysore',
                'Jasmine · Sambac',
                'Cedar · Atlas',
                'Tobacco · Virginia',
              ].map((token) => (
                <span key={`${k}-${token}`} className="mx-9 inline-flex items-center gap-9">
                  <span>{token}</span>
                  <span className="h-1 w-1 rounded-full bg-gold/50" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────── */

function Spec({ term, value }: { term: string; value: string }) {
  return (
    <div className="border-l border-gold/30 pl-3">
      <dt className="label-spec text-shadow">{term}</dt>
      <dd className="mt-1.5 font-display-italic text-vellum text-base leading-tight">
        {value}
      </dd>
    </div>
  );
}

function CornerBracket({ position }: { position: 'tl' | 'tr' | 'bl' | 'br' }) {
  const map = {
    tl: 'top-0 left-0 border-t border-l',
    tr: 'top-0 right-0 border-t border-r',
    bl: 'bottom-0 left-0 border-b border-l',
    br: 'bottom-0 right-0 border-b border-r',
  };
  return (
    <span
      aria-hidden
      className={`absolute h-6 w-6 border-gold/60 ${map[position]}`}
    />
  );
}
