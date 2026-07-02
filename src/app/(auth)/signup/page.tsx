'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, Sparkles, ArrowRight, User } from 'lucide-react';
import Link from 'next/link';
import { signUp } from '@/lib/auth';

export default function SignupPage() {
  const router = useRouter();
  //!! Local state for form fields and UI interactions
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  //!! Handle form submit with Supabase authentication
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    //?? Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setIsLoading(false);
      return;
    }

    //?? Validate password length
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      setIsLoading(false);
      return;
    }

    try {
      const { user } = await signUp(email, password, name);
      
      if (user) {
        setSuccess(true);
        // Redirect to home page after successful signup
        // Using setTimeout to allow success message to display briefly
        setTimeout(() => {
          try {
            // Use window.location for more reliable redirect that avoids extension conflicts
            window.location.href = '/';
          } catch (redirectError) {
            // Fallback to router if window.location fails
            router.push('/');
            router.refresh();
          }
        }, 1500);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create account. Please try again.');
      setIsLoading(false);
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



  

  //!! Return the signup page - main page
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
              Start your journey
            </p>

            <h1 className="text-3xl font-semibold tracking-tight text-white md:text-3xl">
              Create a profile for your
              <span className="bg-linear-to-r from-[#D4AF37] via-[#f5e3a1] to-[#D4AF37] bg-clip-text text-transparent">
                {' '}
                signature scent.
              </span>
            </h1>

            <p className="text-sm text-white/70">
              Save favourites, build collections and unlock personalised
              recommendations curated just for you.
            </p>
          </div>

          {/* Minimalist reassurance section */}
          <div className="relative mt-6 grid grid-cols-3 gap-3 text-xs text-white/70">
            <div className="rounded-2xl border border-white/10 bg-black/40 px-3 py-3">
              <p className="text-[11px] uppercase tracking-[0.16em] text-white/40">
                Secure
              </p>
              <p className="mt-1 text-sm font-semibold text-white">2FA ready</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/40 px-3 py-3">
              <p className="text-[11px] uppercase tracking-[0.16em] text-white/40">
                Custom
              </p>
              <p className="mt-1 text-sm font-semibold text-white">
                Taste-based
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/40 px-3 py-3">
              <p className="text-[11px] uppercase tracking-[0.16em] text-white/40">
                Community
              </p>
              <p className="mt-1 text-sm font-semibold text-[#D4AF37]">
                Invite-only
              </p>
            </div>
          </div>

          <p className="relative mt-5 text-[11px] text-white/50">
            By creating an account you agree to our{' '}
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

        {/* Right: Signup card */}
        <section className="relative w-full max-w-md flex-1">
          {/* Glassmorphism card */}
          <div className="group relative overflow-hidden rounded-3xl border border-white/12 bg-white/7 px-7 py-8 backdrop-blur-2xl shadow-[0_28px_80px_rgba(0,0,0,0.85)] transition-transform duration-300 hover:-translate-y-1">
            {/* Subtle top border highlight */}
            <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-linear-to-r from-transparent via-white/40 to-transparent" />

            {/* Card heading */}
            <div className="mb-6 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#D4AF37]">
                Create account
              </p>
              <h2 className="text-2xl font-semibold tracking-tight text-white">
                Join{' '}
                <span className="bg-linear-to-r from-[#D4AF37] via-[#f1dd9c] to-[#D4AF37] bg-clip-text text-transparent">
                  Fragrance Parl
                </span>
              </h2>
              <p className="text-xs text-white/60">
                Set up your account to start saving blends, building rituals and
                receiving curated drops.
              </p>
            </div>

            {/* Error message */}
            {error && (
              <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            {/* Success message */}
            {success && (
              <div className="mb-4 rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-400">
                Account created successfully! Redirecting...
              </div>
            )}

            {/* Auth form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name field */}
              <div className="space-y-1.5">
                <label
                  htmlFor="name"
                  className="flex items-center justify-between text-xs font-medium text-white/70"
                >
                  <span>Full name</span>
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex w-10 items-center justify-center">
                    <User className="h-4 w-4 text-white/40 transition-colors duration-200 group-focus-within:text-[#D4AF37]" />
                  </div>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="How should we address you?"
                    className="w-full rounded-2xl border border-white/15 bg-black/40 px-10 py-3 text-sm text-white outline-none ring-0 transition-all duration-200 placeholder:text-white/30 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/35"
                  />
                </div>
              </div>

              {/* Email field */}
              <div className="space-y-1.5">
                <label
                  htmlFor="email"
                  className="flex items-center justify-between text-xs font-medium text-white/70"
                >
                  <span>Email address</span>
                  <span className="text-[11px] text-white/35">
                    You&apos;ll use this to sign in
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
                    placeholder="Create a strong password"
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
                  <span>Confirm password</span>
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
                    placeholder="Repeat your password"
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

              {/* Consent + newsletter */}
              <div className="flex flex-col gap-2 pt-1 text-xs">
                <label className="inline-flex cursor-pointer items-start gap-2 text-white/70">
                  <input
                    type="checkbox"
                    className="mt-[2px] h-3.5 w-3.5 rounded border border-white/30 bg-black/60 text-[#D4AF37] accent-[#D4AF37]"
                    required
                  />
                  <span>
                    I agree to receive important account emails from Fragrance
                    Parl.
                  </span>
                </label>
                <label className="inline-flex cursor-pointer items-start gap-2 text-white/60">
                  <input
                    type="checkbox"
                    className="mt-[2px] h-3.5 w-3.5 rounded border border-white/30 bg-black/60 text-[#D4AF37] accent-[#D4AF37]"
                  />
                  <span>
                    Send me occasional curated drops and seasonal fragrance
                    stories.
                  </span>
                </label>
              </div>

              {/* Primary sign-up button */}
              <button
                type="submit"
                disabled={isLoading}
                className="group/button relative mt-2 flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-linear-to-r from-[#D4AF37] via-[#f3de9e] to-[#D4AF37] px-4 py-3 text-sm font-semibold text-black shadow-[0_22px_60px_rgba(212,175,55,0.45)] transition-transform duration-200 hover:-translate-y-px active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70"
              >
                <span className="absolute inset-0 opacity-0 transition-opacity duration-200 group-hover/button:opacity-20 group-hover/button:bg-[radial-gradient(circle_at_top,#ffffff,transparent_60%)]" />
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="inline-flex h-4 w-4 animate-spin rounded-full border-2 border-black/30 border-t-black" />
                    Creating your account...
                  </span>
                ) : (
                  <>
                    Create account
                    <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover/button:translate-x-0.5" />
                  </>
                )}
              </button>

              {/* Footer copy */}
              <div className="pt-4 text-center text-[11px] text-white/55">
                <span>Already have an account? </span>
                <Link
                  href="/login"
                  className="font-semibold text-[#D4AF37] underline-offset-4 transition-colors hover:text-[#f3de9e] hover:underline"
                >
                  Login
                </Link>
              </div>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}

