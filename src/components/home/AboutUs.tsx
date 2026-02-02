'use client';

import { Clock, MapPin, Phone, Mail, Truck } from 'lucide-react';

export function AboutUs() {
  return (
    <section className="relative w-full bg-white py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/5 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#D4AF37] mb-4">
            <span className="flex h-1.5 w-7 items-center justify-between">
              <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
              <span className="h-1 w-1 rounded-full bg-[#D4AF37]/60" />
              <span className="h-1 w-1 rounded-full bg-[#D4AF37]/30" />
            </span>
            About Us
          </span>
          <h2 className="text-3xl font-bold leading-tight tracking-tight text-black sm:text-4xl md:text-5xl">
            Your Fragrance{' '}
            <span className="bg-linear-to-r from-[#D4AF37] via-[#f5e3a1] to-[#D4AF37] bg-clip-text text-transparent">
              Destination
            </span>
          </h2>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Order Anytime Card */}
          <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-gray-100 hover:shadow-[0_8px_32px_rgba(0,0,0,0.1)] transition-shadow duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#D4AF37]/10">
                <Clock className="h-7 w-7 text-[#D4AF37]" />
              </div>
              <h3 className="text-xl font-bold text-black">Order Anytime</h3>
            </div>
            <p className="text-3xl font-extrabold text-[#D4AF37] mb-2">24/7</p>
            <p className="text-gray-600">
              Place your orders any day, any time. We&apos;re always ready to serve you!
            </p>
          </div>

          {/* Delivery Days Card */}
          <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-gray-100 hover:shadow-[0_8px_32px_rgba(0,0,0,0.1)] transition-shadow duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#D4AF37]/10">
                <Truck className="h-7 w-7 text-[#D4AF37]" />
              </div>
              <h3 className="text-xl font-bold text-black">Delivery Days</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="font-semibold text-gray-900">Monday</span>
                <span className="text-gray-600">9AM – 6PM</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="font-semibold text-gray-900">Thursday</span>
                <span className="text-gray-600">9AM – 8PM</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="font-semibold text-gray-900">Saturday</span>
                <span className="text-gray-600">9AM – 6PM</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="font-semibold text-gray-900">Sunday</span>
                <span className="text-red-500 font-medium">Closed</span>
              </div>
            </div>
          </div>

          {/* Location & Contact Card */}
          <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-gray-100 hover:shadow-[0_8px_32px_rgba(0,0,0,0.1)] transition-shadow duration-300 md:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#D4AF37]/10">
                <MapPin className="h-7 w-7 text-[#D4AF37]" />
              </div>
              <h3 className="text-xl font-bold text-black">Find Us</h3>
            </div>

            <div className="space-y-4">
              {/* Locations */}
              <div className="rounded-xl bg-[#D4AF37]/5 p-4 border border-[#D4AF37]/20">
                <p className="font-semibold text-gray-900 mb-1">Our Locations</p>
                <p className="text-gray-600">UPSA Campus & KNUST Campus</p>
                <p className="text-sm text-[#D4AF37] font-medium mt-2">
                  Free delivery to these locations!
                </p>
              </div>

              {/* Contact Info */}
              <div className="space-y-3">
                <a
                  href="tel:+233550798770"
                  className="flex items-center gap-3 text-gray-600 hover:text-[#D4AF37] transition-colors"
                >
                  <Phone className="h-5 w-5" />
                  <span>+233 550 798 770</span>
                </a>
                <a
                  href="mailto:urfragranceparl@gmail.com"
                  className="flex items-center gap-3 text-gray-600 hover:text-[#D4AF37] transition-colors"
                >
                  <Mail className="h-5 w-5" />
                  <span>urfragranceparl@gmail.com</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <a
            href="/category"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-[#D4AF37] via-[#f3de9e] to-[#D4AF37] px-8 py-4 text-sm font-semibold text-black shadow-[0_22px_60px_rgba(212,175,55,0.35)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_28px_70px_rgba(212,175,55,0.45)]"
          >
            Order Now
          </a>
        </div>
      </div>
    </section>
  );
}
