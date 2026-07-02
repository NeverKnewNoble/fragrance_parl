'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { signIn, resendConfirmationEmail } from '@/lib/auth';

export default function LoginPage() {
  const router = useRouter();
  //!! Local state for form fields and UI interactions
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEmailNotConfirmed, setIsEmailNotConfirmed] = useState(false);
  const [isResendingEmail, setIsResendingEmail] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [isInvalidCredentials, setIsInvalidCredentials] = useState(false);

  //!! Handle form submit with Supabase authentication
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setIsEmailNotConfirmed(false);
    setResendSuccess(false);
    setIsInvalidCredentials(false);

    try {
      await signIn(email, password);
      // Redirect to home page on success
      router.push('/');
      router.refresh();
    } catch (err: any) {
      //?? Handle specific error cases
      const errorMessage = err.message || err.error_description || 'Failed to sign in. Please check your credentials.';
      
      //?? Check if error is email not confirmed (must check this first)
      if (
        err.message?.includes('Email not confirmed') ||
        err.message?.includes('email_not_confirmed') ||
        err.message?.toLowerCase().includes('email not confirmed') ||
        err.code === 'email_not_confirmed'
      ) {
        setIsEmailNotConfirmed(true);
        setError('Please confirm your email address before signing in. Check your inbox for the confirmation email.');
      } 
      //?? Check for invalid credentials (only if not email confirmation error)
      else if (
        err.message?.includes('Invalid login credentials') ||
        err.message?.includes('invalid_credentials') ||
        err.code === 'invalid_credentials' ||
        err.message?.includes('User not found') ||
        err.message?.includes('Invalid password')
      ) {
        setIsInvalidCredentials(true);
        setError('Invalid email or password. Please check your credentials and try again.');
      }
      //?? Generic error
      else {
        setError(errorMessage);
      }
      setIsLoading(false);
    }
  };

  //!! Handle resend confirmation email
  const handleResendConfirmation = async () => {
    if (!email) {
      setError('Please enter your email address first.');
      return;
    }

    setIsResendingEmail(true);
    setError(null);
    setResendSuccess(false);

    try {
      await resendConfirmationEmail(email);
      setResendSuccess(true);
      setIsEmailNotConfirmed(false);
    } catch (err: any) {
      setError(err.message || 'Failed to resend confirmation email. Please try again.');
    } finally {
      setIsResendingEmail(false);
    }
  };

  //!! Handle Google sign in
  // const handleGoogleSignIn = async () => {
  //   setIsLoading(true);
  //   setError(null);

  //   try {
  //     await signInWithGoogle();
  //   } catch (err: any) {
  //     setError(err.message || 'Failed to sign in with Google.');
  //     setIsLoading(false);
  //   }
  // };


  

  //!! Return the login page
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
          {/* Gradient overlay and subtle card tilt */}
          <div className="pointer-events-none absolute inset-0 rounded-3xl bg-linear-to-br from-white/8 via-transparent to-[#D4AF37]/8" />

          <div className="relative space-y-4">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-white/70">
              <span className="flex h-1.5 w-6 items-center justify-between">
                <span className="h-1 w-1 rounded-full bg-[#D4AF37]" />
                <span className="h-1 w-1 rounded-full bg-white/40" />
                <span className="h-1 w-1 rounded-full bg-white/20" />
              </span>
              Luxury in every note
            </p>

            <h1 className="text-3xl font-semibold tracking-tight text-white md:text-3xl">
              Modern fragrances,
              <span className="bg-linear-to-r from-[#D4AF37] via-[#f5e3a1] to-[#D4AF37] bg-clip-text text-transparent">
                {' '}
                timeless presence.
              </span>
            </h1>

            <p className="text-sm text-white/70">
              Craft a personal library of scents, track your favourites and
              discover curated blends designed for every moment of your day.
            </p>
          </div>

          {/* Minimalist stats / reassurance section */}
          <div className="relative mt-6 grid grid-cols-3 gap-3 text-xs text-white/70">
            <div className="rounded-2xl border border-white/10 bg-black/40 px-3 py-3">
              <p className="text-[11px] uppercase tracking-[0.16em] text-white/40">
                Members
              </p>
              <p className="mt-1 text-sm font-semibold text-white">12k+</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/40 px-3 py-3">
              <p className="text-[11px] uppercase tracking-[0.16em] text-white/40">
                Blends
              </p>
              <p className="mt-1 text-sm font-semibold text-white">300+</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/40 px-3 py-3">
              <p className="text-[11px] uppercase tracking-[0.16em] text-white/40">
                Rating
              </p>
              <p className="mt-1 text-sm font-semibold text-[#D4AF37]">
                4.9
              </p>
            </div>
          </div>

          <p className="relative mt-5 text-[11px] text-white/50">
            By continuing you agree to our{' '}
            <button className="underline decoration-white/30 decoration-dotted underline-offset-4 hover:text-white hover:decoration-[#D4AF37] transition-colors">
              Terms
            </button>{' '}
            and{' '}
            <button className="underline decoration-white/30 decoration-dotted underline-offset-4 hover:text-white hover:decoration-[#D4AF37] transition-colors">
              Privacy Policy
            </button>
            .
          </p>
        </section>

        {/* Right: Login card */}
        <section className="relative w-full max-w-md flex-1">
          {/* Glassmorphism card */}
          <div className="group relative overflow-hidden rounded-3xl border border-white/12 bg-white/7 px-7 py-8 backdrop-blur-2xl shadow-[0_28px_80px_rgba(0,0,0,0.85)] transition-transform duration-300 hover:-translate-y-1">
            {/* Subtle top border highlight */}
            <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-linear-to-r from-transparent via-white/40 to-transparent" />

            {/* Card heading */}
            <div className="mb-6 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#D4AF37]">
                Login
              </p>
              <h2 className="text-2xl font-semibold tracking-tight text-white">
                Welcome back to{' '}
                <span className="bg-linear-to-r from-[#D4AF37] via-[#f1dd9c] to-[#D4AF37] bg-clip-text text-transparent">
                  Fragrance Parl
                </span>
              </h2>
              <p className="text-xs text-white/60">
                Enter your details to access your personalised recommendations
                and saved collections.
              </p>
            </div>

            {/* Error message */}
            {error && (
              <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                <p>{error}</p>
                {isEmailNotConfirmed && (
                  <button
                    type="button"
                    onClick={handleResendConfirmation}
                    disabled={isResendingEmail}
                    className="mt-2 block w-full rounded-lg border border-red-500/50 bg-red-500/20 px-3 py-2 text-xs font-semibold transition-colors hover:bg-red-500/30 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isResendingEmail ? 'Sending...' : 'Resend Confirmation Email'}
                  </button>
                )}
                {isInvalidCredentials && (
                  <div className="mt-3 space-y-2">
                    <p className="text-xs text-red-300/80">
                      Having trouble signing in? You can reset your password using the link below.
                    </p>
                    <Link
                      href="/forgot-password"
                      className="block w-full rounded-lg border border-red-500/50 bg-red-500/20 px-3 py-2 text-center text-xs font-semibold transition-colors hover:bg-red-500/30"
                    >
                      Reset Password
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Success message for resend */}
            {resendSuccess && (
              <div className="mb-4 rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-400">
                Confirmation email sent! Please check your inbox and click the confirmation link.
              </div>
            )}

            {/* Auth form */}
            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              {/* Email field */}
              <div className="space-y-1.5">
                <label
                  htmlFor="email"
                  className="flex items-center justify-between text-xs font-medium text-white/70"
                >
                  <span>Email address</span>
                  <span className="text-[11px] text-white/35">
                    Use the email linked to your account
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

              {/* Password field */}
              <div className="space-y-1.5">
                <label
                  htmlFor="password"
                  className="flex items-center justify-between text-xs font-medium text-white/70"
                >
                  <span>Password</span>
                  <Link
                    href="/forgot-password"
                    className="text-[11px] text-[#D4AF37] transition-colors hover:text-[#f1dd9c]"
                  >
                    Forgot?
                  </Link>
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
                    placeholder="Enter your password"
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

              {/* Remember + subtle hint */}
              <div className="flex items-center justify-between pt-1 text-xs">
                <label className="inline-flex cursor-pointer items-center gap-2 text-white/70">
                  <input
                    type="checkbox"
                    className="h-3.5 w-3.5 rounded border border-white/30 bg-black/60 text-[#D4AF37] accent-[#D4AF37]"
                    defaultChecked
                  />
                  <span>Remember this device</span>
                </label>
                <span className="text-[11px] text-white/40">
                  Securely encrypted with modern standards
                </span>
              </div>

              {/* Primary sign-in button */}
              <button
                type="submit"
                disabled={isLoading}
                className="group/button relative mt-2 flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-linear-to-r from-[#D4AF37] via-[#f3de9e] to-[#D4AF37] px-4 py-3 text-sm font-semibold text-black shadow-[0_22px_60px_rgba(212,175,55,0.45)] transition-transform duration-200 hover:-translate-y-px active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70"
              >
                <span className="absolute inset-0 opacity-0 transition-opacity duration-200 group-hover/button:opacity-20 group-hover/button:bg-[radial-gradient(circle_at_top,#ffffff,transparent_60%)]" />
                {isLoading ? (
                  <span className="flex items-center gap-2">
                <span className="inline-flex h-4 w-4 animate-spin rounded-full border-2 border-black/30 border-t-black" />
                    Signing you in...
                  </span>
                ) : (
                  <>
                    Continue
                    <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover/button:translate-x-0.5" />
                  </>
                )}
              </button>

              {/* Subtle divider */}
              <div className="relative py-3 text-center text-[11px] text-white/40">
                <div className="absolute inset-x-0 top-1/2 h-px bg-linear-to-r from-transparent via-white/15 to-transparent" />
                <span className="relative bg-black/60 px-3">
                  Or continue with
                </span>
              </div>

              {/* Social auth button */}
              <div className="text-xs">
                <button
                  type="button"
                  // onClick={handleGoogleSignIn}
                  disabled={true}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl border border-white/15 bg-black/50 px-3 py-2.5 text-white/80 transition-all duration-200 hover:border-[#D4AF37]/50 hover:text-[#f7e7b0] hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Google, coming soon!!
                </button>
              </div>

              {/* Footer copy */}
              <div className="pt-4 text-center text-[11px] text-white/55">
                <span>Don&apos;t have an account? </span>
                <Link
                  href="/signup"
                  className="font-semibold text-[#D4AF37] underline-offset-4 transition-colors hover:text-[#f3de9e] hover:underline"
                >
                  Create one 
                </Link>
              </div>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}
