'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store';
import { authApi } from '@/lib/api';

import { GolumIcon } from '@/components/Logo';
import { createBrowserSupabaseClient } from '@/lib/supabase';

type AuthMethod = 'password' | 'magic-link';

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#080816]"><div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div></div>}>
      <LoginContent />
    </Suspense>
  );
}

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/dashboard';
  const login = useAuthStore((state) => state.login);
  const [authMethod, setAuthMethod] = useState<AuthMethod>('password');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setError('');
    setGoogleLoading(true);
    try {
      const supabase = createBrowserSupabaseClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/verify`,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message || 'Google sign-in failed');
      setGoogleLoading(false);
    }
  };

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response: any = await authApi.login({ email, password });
      login({
        user: response.data.user,
        tenant: response.data.tenant,
        token: response.data.token,
        apiKey: response.data.apiKey,
      });
      router.push(redirectTo);
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authApi.sendMagicLink(email);
      setMagicLinkSent(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send magic link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#080816]">
      {/* Left — Nature image panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src="/hero-bg.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080816]/90 via-transparent to-[#080816]/30" />

        {/* Branding overlay */}
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <Link href="/" className="flex items-center gap-2.5 text-xl font-semibold text-white">
            <GolumIcon size={28} />
            Golum
          </Link>

          <div className="mb-16">
            <h2 className="text-4xl font-bold text-white leading-[1.15] mb-4">
              AI support that<br />never sleeps.
            </h2>
            <p className="text-white/50 text-base leading-relaxed max-w-sm">
              Join hundreds of businesses using Golum to answer every customer question, instantly.
            </p>

            {/* Glass stats */}
            <div className="flex gap-3 mt-8">
              <div className="px-4 py-3 rounded-2xl bg-white/[0.06] backdrop-blur-2xl border border-white/[0.1]">
                <p className="text-lg font-bold text-white">99%</p>
                <p className="text-[11px] text-white/40 mt-0.5">Accuracy</p>
              </div>
              <div className="px-4 py-3 rounded-2xl bg-white/[0.06] backdrop-blur-2xl border border-white/[0.1]">
                <p className="text-lg font-bold text-white">24/7</p>
                <p className="text-[11px] text-white/40 mt-0.5">Available</p>
              </div>
              <div className="px-4 py-3 rounded-2xl bg-white/[0.06] backdrop-blur-2xl border border-white/[0.1]">
                <p className="text-lg font-bold text-white">&lt;2s</p>
                <p className="text-[11px] text-white/40 mt-0.5">Response</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right — Auth form */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Mobile header */}
        <header className="lg:hidden flex items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2 text-lg font-semibold text-white">
            <GolumIcon size={24} />
            Golum
          </Link>
        </header>

        <main className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-sm animate-fade-in">
            {/* Header Text */}
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-white mb-2">
                Welcome back
              </h1>
              <p className="text-sm text-white/40">
                Sign in to continue to your dashboard
              </p>
            </div>

            {/* Glass card */}
            <div className="rounded-3xl bg-white/[0.03] backdrop-blur-2xl border border-white/[0.08] p-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_8px_32px_rgba(0,0,0,0.12)]">
              {/* Google OAuth Button */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={googleLoading}
                className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl bg-white/[0.04] border border-white/[0.1] text-white font-medium transition-all hover:bg-white/[0.08] hover:border-white/[0.15] disabled:opacity-50 disabled:cursor-not-allowed"
                suppressHydrationWarning
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                {googleLoading ? 'Redirecting...' : 'Continue with Google'}
              </button>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/[0.08]" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-3 bg-[#0b0b1e] text-white/25 text-xs">or</span>
                </div>
              </div>

              {/* Auth Method Tabs */}
              <div className="flex gap-1 p-1 rounded-xl bg-white/[0.04] border border-white/[0.06] mb-6" suppressHydrationWarning>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMethod('password');
                    setError('');
                    setMagicLinkSent(false);
                  }}
                  className={`flex-1 py-2 px-4 text-sm font-medium rounded-lg transition-all ${
                    authMethod === 'password'
                      ? 'bg-white/[0.08] text-white shadow-sm'
                      : 'text-white/40 hover:text-white/60'
                  }`}
                  suppressHydrationWarning
                >
                  Password
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMethod('magic-link');
                    setError('');
                  }}
                  className={`flex-1 py-2 px-4 text-sm font-medium rounded-lg transition-all ${
                    authMethod === 'magic-link'
                      ? 'bg-white/[0.08] text-white shadow-sm'
                      : 'text-white/40 hover:text-white/60'
                  }`}
                  suppressHydrationWarning
                >
                  Magic Link
                </button>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm">
                  {error}
                </div>
              )}

              {/* Password Login Form */}
              {authMethod === 'password' && (
                <form onSubmit={handlePasswordLogin} className="space-y-4" suppressHydrationWarning>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-white/50 mb-1.5">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white/[0.04] border border-white/[0.1] rounded-xl text-white placeholder-white/20 transition-all focus:border-purple-500/50 focus:bg-white/[0.06] focus:shadow-[0_0_0_2px_rgba(124,58,237,0.15)]"
                      placeholder="you@example.com"
                      suppressHydrationWarning
                    />
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-white/50 mb-1.5">
                      Password
                    </label>
                    <input
                      id="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white/[0.04] border border-white/[0.1] rounded-xl text-white placeholder-white/20 transition-all focus:border-purple-500/50 focus:bg-white/[0.06] focus:shadow-[0_0_0_2px_rgba(124,58,237,0.15)]"
                      placeholder="••••••••"
                      suppressHydrationWarning
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 px-4 bg-purple-600 hover:bg-purple-500 text-white font-medium rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_30px_rgba(124,58,237,0.3)]"
                    suppressHydrationWarning
                  >
                    {loading ? 'Signing in...' : 'Sign in'}
                  </button>
                </form>
              )}

              {/* Magic Link Form */}
              {authMethod === 'magic-link' && !magicLinkSent && (
                <form onSubmit={handleMagicLink} className="space-y-4" suppressHydrationWarning>
                  <div>
                    <label htmlFor="magic-email" className="block text-sm font-medium text-white/50 mb-1.5">
                      Email
                    </label>
                    <input
                      id="magic-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white/[0.04] border border-white/[0.1] rounded-xl text-white placeholder-white/20 transition-all focus:border-purple-500/50 focus:bg-white/[0.06] focus:shadow-[0_0_0_2px_rgba(124,58,237,0.15)]"
                      placeholder="you@example.com"
                      suppressHydrationWarning
                    />
                  </div>

                  <p className="text-sm text-white/25">
                    We&apos;ll send you a magic link to sign in without a password.
                  </p>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 px-4 bg-purple-600 hover:bg-purple-500 text-white font-medium rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_30px_rgba(124,58,237,0.3)]"
                    suppressHydrationWarning
                  >
                    {loading ? 'Sending...' : 'Send Magic Link'}
                  </button>
                </form>
              )}

              {/* Magic Link Sent Success */}
              {authMethod === 'magic-link' && magicLinkSent && (
                <div className="text-center py-4">
                  <div className="mx-auto w-12 h-12 bg-green-500/10 border border-green-500/20 rounded-2xl flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-white mb-2">Check your email</h3>
                  <p className="text-sm text-white/40 mb-4">
                    We&apos;ve sent a magic link to <strong className="text-white/70">{email}</strong>
                  </p>
                  <button
                    type="button"
                    onClick={() => setMagicLinkSent(false)}
                    className="text-sm text-purple-400 hover:text-purple-300"
                  >
                    Send again
                  </button>
                </div>
              )}

              <p className="text-center text-sm text-white/30 mt-6">
                Don&apos;t have an account?{' '}
                <Link href="/register" className="text-purple-400 hover:text-purple-300 font-medium">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
