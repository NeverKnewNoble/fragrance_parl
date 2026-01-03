'use client';

import { useState } from 'react';
import { Mail, ArrowRight, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { resetPassword } from '@/lib/auth';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  //!! Handle form submit with Supabase password reset
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await resetPassword(email);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email. Please try again.');
      setIsLoading(false);
    }
  };



  
  //!! Return the forgot password page
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-linear-to-br from-black via-black to-[#111111] px-4 py-8 text-white">
      {/* Soft gold glow background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-24 h-80 w-80 rounded-full bg-[#D4AF37]/15 blur-3xl" />
        <div className="absolute -bottom-40 right-0 h-96 w-96 rounded-full bg-[#D4AF37]/10 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),transparent_55%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.04),transparent)]" />
      </div>

      {/* Main content layout */}
      <main className="relative z-10 flex w-full max-w-5xl flex-col items-center justify-center gap-10 md:flex-row md:items-stretch">
        {/* Left: Hero / Story side */}
        <section className="relative hidden w-full max-w-md flex-1 flex-col justify-between rounded-3xl border border-white/10 bg-white/5 px-6 py-7 backdrop-blur-2xl shadow-[0_30px_80px_rgba(0,0,0,0.6)] md:flex">
          {/* Gradient overlay */}
          <div className="pointer-events-none absolute inset-0 rounded-3xl bg-linear-to-br from-white/8 via-transparent to-[#D4AF37]/8" />

          <div className="relative space-y-4">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-white/70">
              <span className="flex h-1.5 w-6 items-center justify-between">
                <span className="h-1 w-1 rounded-full bg-[#D4AF37]" />
                <span className="h-1 w-1 rounded-full bg-white/40" />
                <span className="h-1 w-1 rounded-full bg-white/20" />
              </span>
              Secure recovery
            </p>

            <h1 className="text-3xl font-semibold tracking-tight text-white md:text-3xl">
              Reset your password
              <span className="bg-linear-to-r from-[#D4AF37] via-[#f5e3a1] to-[#D4AF37] bg-clip-text text-transparent">
                {' '}
                securely.
              </span>
            </h1>

            <p className="text-sm text-white/70">
              Enter your email address and we&apos;ll send you a link to reset
              your password. Check your inbox for instructions.
            </p>
          </div>

          {/* Minimalist reassurance section */}
          <div className="relative mt-6 grid grid-cols-3 gap-3 text-xs text-white/70">
            <div className="rounded-2xl border border-white/10 bg-black/40 px-3 py-3">
              <p className="text-[11px] uppercase tracking-[0.16em] text-white/40">
                Secure
              </p>
              <p className="mt-1 text-sm font-semibold text-white">Encrypted</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/40 px-3 py-3">
              <p className="text-[11px] uppercase tracking-[0.16em] text-white/40">
                Fast
              </p>
              <p className="mt-1 text-sm font-semibold text-white">
                Instant email
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/40 px-3 py-3">
              <p className="text-[11px] uppercase tracking-[0.16em] text-white/40">
                Safe
              </p>
              <p className="mt-1 text-sm font-semibold text-[#D4AF37]">
                Verified
              </p>
            </div>
          </div>

          <p className="relative mt-5 text-[11px] text-white/50">
            Remember your password?{' '}
            <Link
              href="/login"
              className="text-[#D4AF37] underline decoration-[#D4AF37]/30 decoration-dotted underline-offset-4 hover:text-[#f1dd9c] hover:decoration-[#D4AF37] transition-colors"
            >
              Back to login
            </Link>
            .
          </p>
        </section>

        {/* Right: Forgot Password card */}
        <section className="relative w-full max-w-md flex-1">
          {/* Glassmorphism card */}
          <div className="group relative overflow-hidden rounded-3xl border border-white/12 bg-white/7 px-7 py-8 backdrop-blur-2xl shadow-[0_28px_80px_rgba(0,0,0,0.85)] transition-transform duration-300 hover:-translate-y-1">
            {/* Subtle top border highlight */}
            <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-linear-to-r from-transparent via-white/40 to-transparent" />

            {/* Card heading */}
            <div className="mb-6 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#D4AF37]">
                Password Recovery
              </p>
              <h2 className="text-2xl font-semibold tracking-tight text-white">
                Forgot your{' '}
                <span className="bg-linear-to-r from-[#D4AF37] via-[#f1dd9c] to-[#D4AF37] bg-clip-text text-transparent">
                  password?
                </span>
              </h2>
              <p className="text-xs text-white/60">
                No worries! Enter your email and we&apos;ll send you reset
                instructions.
              </p>
            </div>

            {/* Error message */}
            {error && (
              <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            {/* Success message */}
            {success ? (
              <div className="space-y-5">
                <div className="rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-400">
                  <p className="font-semibold mb-1">Check your email!</p>
                  <p className="text-xs text-green-300/80">
                    We&apos;ve sent password reset instructions to{' '}
                    <span className="font-medium">{email}</span>. Please check
                    your inbox and follow the link to reset your password.
                  </p>
                </div>
                <Link
                  href="/login"
                  className="group/button relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-linear-to-r from-[#D4AF37] via-[#f3de9e] to-[#D4AF37] px-4 py-3 text-sm font-semibold text-black shadow-[0_22px_60px_rgba(212,175,55,0.45)] transition-transform duration-200 hover:-translate-y-px active:translate-y-0"
                >
                  <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover/button:-translate-x-0.5" />
                  Back to Login
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email field */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="email"
                    className="flex items-center justify-between text-xs font-medium text-white/70"
                  >
                    <span>Email address</span>
                    <span className="text-[11px] text-white/35">
                      We&apos;ll send reset link here
                    </span>
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex w-10 items-center justify-center">
                      <Mail className="h-4 w-4 text-white/40 transition-colors duration-200 group-focus-within:text-[#D4AF37]" />
                    </div>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="you@example.com"
                      className="w-full rounded-2xl border border-white/15 bg-black/40 px-10 py-3 text-sm text-white outline-none ring-0 transition-all duration-200 placeholder:text-white/30 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/35"
                    />
                  </div>
                </div>

                {/* Primary submit button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="group/button relative mt-2 flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-linear-to-r from-[#D4AF37] via-[#f3de9e] to-[#D4AF37] px-4 py-3 text-sm font-semibold text-black shadow-[0_22px_60px_rgba(212,175,55,0.45)] transition-transform duration-200 hover:-translate-y-px active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <span className="absolute inset-0 opacity-0 transition-opacity duration-200 group-hover/button:opacity-20 group-hover/button:bg-[radial-gradient(circle_at_top,#ffffff,transparent_60%)]" />
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="inline-flex h-4 w-4 animate-spin rounded-full border-2 border-black/30 border-t-black" />
                      Sending reset link...
                    </span>
                  ) : (
                    <>
                      Send Reset Link
                      <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover/button:translate-x-0.5" />
                    </>
                  )}
                </button>

                {/* Footer copy */}
                <div className="pt-4 text-center text-[11px] text-white/55">
                  <span>Remember your password? </span>
                  <Link
                    href="/login"
                    className="font-semibold text-[#D4AF37] underline-offset-4 transition-colors hover:text-[#f3de9e] hover:underline"
                  >
                    Sign in
                  </Link>
                </div>
              </form>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

