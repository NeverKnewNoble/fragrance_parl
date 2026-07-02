'use client';

import Link from 'next/link';
import { Instagram, Facebook, Twitter } from 'lucide-react';

/**
 *  Footer — "The Colophon"
 *  An editorial masthead. Big italic brand. Hairline-separated columns.
 *  Footer ends with a press-style stamp: ESTABLISHED MMXXIV — ACCRA.
 */
export function Footer() {
  return (
    <footer className="relative w-full bg-ink border-t border-gold/15 grain-coarse overflow-hidden">
      {/* Atmospheric wash */}
      <div className="absolute -bottom-32 -left-20 h-[40vh] w-[40vw] rounded-full bg-gold/5 blur-[140px] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 sm:px-10 lg:px-14 pt-24 pb-12">
        {/* Big serif brand stamped at top */}
        <div className="mb-16 sm:mb-24">
          <p className="label-spec text-gold mb-6">
            <span className="tick bg-gold/60" />
            Colophon
          </p>
          <h2 className="font-display text-vellum leading-[0.9] tracking-[-0.02em]">
            <span className="block text-[clamp(3rem,11vw,9rem)]">Fragrance</span>
            <span className="block font-display-italic text-[clamp(3rem,11vw,9rem)] text-gold -mt-2">
              Parl.
            </span>
          </h2>
        </div>

        {/* Columns */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-10 lg:gap-16">
          {/* The House */}
          <FooterColumn label="The House">
            <FooterLink href="/">Maison</FooterLink>
            <FooterLink href="/category">The Library</FooterLink>
            <FooterLink href="/my_orders">Dossier</FooterLink>
            <FooterLink href="/favorites">Favorites</FooterLink>
          </FooterColumn>

          {/* Account */}
          <FooterColumn label="Account">
            <FooterLink href="/my_profile">Profile</FooterLink>
            <FooterLink href="/cart">Bag</FooterLink>
            <FooterLink href="/login">Sign&nbsp;In</FooterLink>
            <FooterLink href="/signup">Register</FooterLink>
          </FooterColumn>

          {/* Care */}
          <FooterColumn label="Care">
            <a
              href="tel:+233550798770"
              className="font-mono-spec text-xs text-bone hover:text-gold transition-colors duration-300"
            >
              +233&nbsp;550&nbsp;798&nbsp;770
            </a>
            <a
              href="mailto:urfragranceparl@gmail.com"
              className="font-mono-spec text-xs text-bone hover:text-gold transition-colors duration-300 break-all"
            >
              urfragranceparl@gmail.com
            </a>
            <p className="label-spec text-shadow pt-1">
              Reply&nbsp;within&nbsp;24h
            </p>
          </FooterColumn>

          {/* Connect */}
          <FooterColumn label="Connect">
            <div className="flex items-center gap-3">
              <SocialLink href="https://instagram.com" label="Instagram">
                <Instagram className="h-4 w-4" strokeWidth={1.5} />
              </SocialLink>
              <SocialLink href="https://facebook.com" label="Facebook">
                <Facebook className="h-4 w-4" strokeWidth={1.5} />
              </SocialLink>
              <SocialLink href="https://twitter.com" label="Twitter">
                <Twitter className="h-4 w-4" strokeWidth={1.5} />
              </SocialLink>
            </div>
            <p className="label-spec text-shadow pt-3">
              UPSA&nbsp;·&nbsp;KNUST&nbsp;·&nbsp;Accra
            </p>
          </FooterColumn>
        </div>

        {/* Press stamp */}
        <div className="mt-20 pt-8 border-t border-gold/15">
          <div className="flex flex-col-reverse sm:flex-row items-start sm:items-center justify-between gap-6">
            <p className="font-mono-spec text-[10px] text-shadow tracking-[0.3em]">
              © {new Date().getFullYear()}&nbsp;·&nbsp;Fragrance&nbsp;Parl&nbsp;·&nbsp;Established&nbsp;MMXXIV&nbsp;·&nbsp;Accra
            </p>
            <div className="flex items-center gap-6">
              <Link
                href="/privacy"
                className="label-spec text-shadow hover:text-gold transition-colors duration-300"
              >
                Privacy
              </Link>
              <span className="text-shadow/30">·</span>
              <Link
                href="/terms"
                className="label-spec text-shadow hover:text-gold transition-colors duration-300"
              >
                Terms
              </Link>
              <span className="text-shadow/30">·</span>
              <a
                href="https://neverknewnoble.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="label-spec text-shadow hover:text-gold transition-colors duration-300"
              >
                Composed&nbsp;by&nbsp;Noble
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ─────────────────────────────────────────────────────────── */

function FooterColumn({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3">
      <p className="label-spec text-gold mb-3">{label}</p>
      {children}
    </div>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="font-display-italic text-base text-bone hover:text-gold transition-colors duration-300 w-fit"
    >
      {children}
    </Link>
  );
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex h-10 w-10 items-center justify-center border border-gold/25 text-bone hover:text-gold hover:border-gold/60 transition-colors duration-300"
    >
      {children}
    </a>
  );
}
