'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Eye, EyeOff, ArrowRight, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { updatePassword } from '@/lib/auth';
import { supabase } from '@/lib/supabase/client';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null);

  //!! Check if we have a valid session/token
  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setIsValidToken(!!session);
    };
    checkSession();
  }, []);

  //!! Handle form submit with Supabase password update
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setIsLoading(false);
      return;
    }

    // Validate password length
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      setIsLoading(false);
      return;
    }

    try {
      await updatePassword(password);
      setSuccess(true);
      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to update password. Please try again.');
      setIsLoading(false);
    }
  };

  //!! Validation checks for the reset password page
  if (isValidToken === null) {
    return (
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-linear-to-br from-black via-black to-[#111111] px-4 py-8 text-white">
        <div className="text-center">
          <div className="inline-flex h-8 w-8 animate-spin rounded-full border-4 border-[#D4AF37]/30 border-t-[#D4AF37]" />
          <p className="mt-4 text-sm text-white/60">Verifying reset link...</p>
        </div>
      </div>
    );
  }

  if (isValidToken === false) {
    return (
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-linear-to-br from-black via-black to-[#111111] px-4 py-8 text-white">
        <div className="relative z-10 w-full max-w-md">
          <div className="group relative overflow-hidden rounded-3xl border border-white/12 bg-white/7 px-7 py-8 backdrop-blur-2xl shadow-[0_28px_80px_rgba(0,0,0,0.85)]">
            <div className="text-center space-y-4">
              <div className="mx-auto h-16 w-16 rounded-full bg-red-500/20 flex items-center justify-center">
                <Lock className="h-8 w-8 text-red-400" />
              </div>
              <h2 className="text-2xl font-semibold tracking-tight text-white">
                Invalid or Expired Link
              </h2>
              <p className="text-sm text-white/60">
                This password reset link is invalid or has expired. Please request a new one.
              </p>
              <Link
                href="/forgot-password"
                className="inline-flex items-center gap-2 rounded-2xl bg-linear-to-r from-[#D4AF37] via-[#f3de9e] to-[#D4AF37] px-6 py-3 text-sm font-semibold text-black shadow-[0_22px_60px_rgba(212,175,55,0.45)] transition-transform duration-200 hover:-translate-y-px"
              >
                Request New Link
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }


  

  //!! Return the reset password page
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
              Secure update
            </p>

            <h1 className="text-3xl font-semibold tracking-tight text-white md:text-3xl">
              Create a new
              <span className="bg-linear-to-r from-[#D4AF37] via-[#f5e3a1] to-[#D4AF37] bg-clip-text text-transparent">
                {' '}
                password.
              </span>
            </h1>

            <p className="text-sm text-white/70">
              Choose a strong password that you haven&apos;t used before. Make
              sure it&apos;s at least 8 characters long.
            </p>
          </div>

          {/* Minimalist reassurance section */}
          <div className="relative mt-6 grid grid-cols-3 gap-3 text-xs text-white/70">
            <div className="rounded-2xl border border-white/10 bg-black/40 px-3 py-3">
              <p className="text-[11px] uppercase tracking-[0.16em] text-white/40">
                Strong
              </p>
              <p className="mt-1 text-sm font-semibold text-white">8+ chars</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/40 px-3 py-3">
              <p className="text-[11px] uppercase tracking-[0.16em] text-white/40">
                Secure
              </p>
              <p className="mt-1 text-sm font-semibold text-white">
                Encrypted
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

        {/* Right: Reset Password card */}
        <section className="relative w-full max-w-md flex-1">
          {/* Glassmorphism card */}
          <div className="group relative overflow-hidden rounded-3xl border border-white/12 bg-white/7 px-7 py-8 backdrop-blur-2xl shadow-[0_28px_80px_rgba(0,0,0,0.85)] transition-transform duration-300 hover:-translate-y-1">
            {/* Subtle top border highlight */}
            <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-linear-to-r from-transparent via-white/40 to-transparent" />

            {/* Card heading */}
            <div className="mb-6 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#D4AF37]">
                Reset Password
              </p>
              <h2 className="text-2xl font-semibold tracking-tight text-white">
                Set your new{' '}
                <span className="bg-linear-to-r from-[#D4AF37] via-[#f1dd9c] to-[#D4AF37] bg-clip-text text-transparent">
                  password
                </span>
              </h2>
              <p className="text-xs text-white/60">
                Enter your new password below. Make sure it&apos;s strong and
                secure.
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
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle className="h-5 w-5" />
                    <p className="font-semibold">Password updated successfully!</p>
                  </div>
                  <p className="text-xs text-green-300/80">
                    Your password has been changed. Redirecting to login...
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Password field */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="password"
                    className="flex items-center justify-between text-xs font-medium text-white/70"
                  >
                    <span>New Password</span>
                    <span className="text-[11px] text-white/35">
                      At least 8 characters
                    </span>
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex w-10 items-center justify-center">
                      <Lock className="h-4 w-4 text-white/40 transition-colors duration-200 group-focus-within:text-[#D4AF37]" />
                    </div>
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="Enter your new password"
                      className="w-full rounded-2xl border border-white/15 bg-black/40 px-10 py-3 pr-12 text-sm text-white outline-none ring-0 transition-all duration-200 placeholder:text-white/30 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/35"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-white/45 transition-colors duration-200 hover:text-[#D4AF37]"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm Password field */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="confirmPassword"
                    className="flex items-center justify-between text-xs font-medium text-white/70"
                  >
                    <span>Confirm Password</span>
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex w-10 items-center justify-center">
                      <Lock className="h-4 w-4 text-white/40 transition-colors duration-200 group-focus-within:text-[#D4AF37]" />
                    </div>
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      placeholder="Confirm your new password"
                      className="w-full rounded-2xl border border-white/15 bg-black/40 px-10 py-3 pr-12 text-sm text-white outline-none ring-0 transition-all duration-200 placeholder:text-white/30 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/35"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-white/45 transition-colors duration-200 hover:text-[#D4AF37]"
                      aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
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
                      Updating password...
                    </span>
                  ) : (
                    <>
                      Update Password
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

