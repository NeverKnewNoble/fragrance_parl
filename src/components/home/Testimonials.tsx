'use client';

import { MessageCircle } from 'lucide-react';

const testimonials = [
  {
    name: "Ama K.",
    message: "Just received my order!! The scent is amazing, thank you so much! Will definitely order again",
    time: "2:34 PM",
  },
  {
    name: "Kwame D.",
    message: "Bro this perfume is fire I've gotten so many compliments already. Best purchase ever",
    time: "11:20 AM",
  },
  {
    name: "Efua M.",
    message: "Got the package today, it smells sooo good! My roommate wants to order too now lol",
    time: "4:15 PM",
  },
  {
    name: "Kofi B.",
    message: "The delivery was fast and the fragrance lasts all day. You guys are the best!",
    time: "9:45 AM",
  },
  {
    name: "Abena S.",
    message: "Thank you! I bought this for my boyfriend and he loves it. Great quality",
    time: "6:30 PM",
  },
  {
    name: "Yaw T.",
    message: "Finally found affordable luxury perfumes on campus. This is a game changer fr",
    time: "1:12 PM",
  },
];

export function Testimonials() {
  return (
    <section className="relative w-full bg-white py-16 sm:py-20 lg:py-24 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/5 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#D4AF37] mb-4">
            <span className="flex h-1.5 w-7 items-center justify-between">
              <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
              <span className="h-1 w-1 rounded-full bg-[#D4AF37]/60" />
              <span className="h-1 w-1 rounded-full bg-[#D4AF37]/30" />
            </span>
            Testimonials
          </span>
          <h2 className="text-3xl font-bold leading-tight tracking-tight text-black sm:text-4xl md:text-5xl mb-4">
            What Our{' '}
            <span className="bg-linear-to-r from-[#D4AF37] via-[#f5e3a1] to-[#D4AF37] bg-clip-text text-transparent">
              Customers
            </span>{' '}
            Say
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Real messages from our happy customers
          </p>
        </div>

        {/* Messages Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="group relative"
            >
              {/* Message Bubble */}
              <div className="relative rounded-2xl rounded-tl-sm bg-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow duration-300">
                {/* Message Icon */}
                <div className="absolute -top-3 -left-2 flex h-8 w-8 items-center justify-center rounded-full bg-[#D4AF37] shadow-lg">
                  <MessageCircle className="h-4 w-4 text-white" />
                </div>

                {/* Sender Name */}
                <div className="mb-3 pt-1">
                  <span className="font-bold text-gray-900">{testimonial.name}</span>
                </div>

                {/* Message Content */}
                <p className="text-gray-700 text-sm leading-relaxed mb-3">
                  {testimonial.message}
                </p>

                {/* Time & Read Receipt */}
                <div className="flex items-center justify-end gap-2">
                  <span className="text-xs text-gray-400">{testimonial.time}</span>
                  {/* Double check mark */}
                  <svg className="h-4 w-4 text-[#D4AF37]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M2 12l5 5L18 6" />
                    <path d="M7 12l5 5L23 6" />
                  </svg>
                </div>

                {/* Bubble Tail */}
                <div className="absolute top-4 -left-2 w-0 h-0 border-t-8 border-t-transparent border-r-12 border-r-gray-100 border-b-8 border-b-transparent" />
              </div>
            </div>
          ))}
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-[#D4AF37]/5 rounded-full blur-2xl" />
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-[#D4AF37]/5 rounded-full blur-3xl" />
      </div>
    </section>
  );
}
