'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store';
import { authApi } from '@/lib/api';
import { ThemeToggle } from '@/components/ThemeProvider';
import { GolumIcon } from '@/components/Logo';
import { createBrowserSupabaseClient } from '@/lib/supabase';

type AuthMethod = 'password' | 'magic-link';

export default function LoginPage() {
  const router = useRouter();
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
      router.push('/dashboard');
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
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold text-[var(--text-primary)]">
          <GolumIcon size={24} />
          Golum
        </Link>
        <ThemeToggle />
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm animate-fade-in">
          {/* Header Text */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-semibold text-[var(--text-primary)] mb-1">
              Welcome back
            </h1>
            <p className="text-sm text-[var(--text-secondary)]">
              Sign in to continue to your dashboard
            </p>
          </div>

          {/* Card */}
          <div className="card p-8">
            {/* Google OAuth Button */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={googleLoading}
              className="w-full flex items-center justify-center gap-3 py-2.5 px-4 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] font-medium transition-all hover:bg-[var(--bg-tertiary)] disabled:opacity-50 disabled:cursor-not-allowed"
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
                <div className="w-full border-t border-[var(--border-color)]" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-[var(--bg-secondary)] text-[var(--text-muted)]">or</span>
              </div>
            </div>

            {/* Auth Method Tabs */}
            <div className="flex gap-1 p-1 bg-[var(--bg-tertiary)] rounded-lg mb-6" suppressHydrationWarning>
              <button
                type="button"
                onClick={() => {
                  setAuthMethod('password');
                  setError('');
                  setMagicLinkSent(false);
                }}
                className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all ${
                  authMethod === 'password'
                    ? 'bg-[var(--bg-secondary)] text-[var(--text-primary)] shadow-sm'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
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
                className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all ${
                  authMethod === 'magic-link'
                    ? 'bg-[var(--bg-secondary)] text-[var(--text-primary)] shadow-sm'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
                suppressHydrationWarning
              >
                Magic Link
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Password Login Form */}
            {authMethod === 'password' && (
              <form onSubmit={handlePasswordLogin} className="space-y-4" suppressHydrationWarning>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] placeholder-[var(--text-muted)]"
                    placeholder="you@example.com"
                    suppressHydrationWarning
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] placeholder-[var(--text-muted)]"
                    placeholder="••••••••"
                    suppressHydrationWarning
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-primary-500/25"
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
                  <label htmlFor="magic-email" className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                    Email
                  </label>
                  <input
                    id="magic-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] placeholder-[var(--text-muted)]"
                    placeholder="you@example.com"
                    suppressHydrationWarning
                  />
                </div>

                <p className="text-sm text-[var(--text-muted)]">
                  We'll send you a magic link to sign in without a password.
                </p>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-primary-500/25"
                  suppressHydrationWarning
                >
                  {loading ? 'Sending...' : 'Send Magic Link'}
                </button>
              </form>
            )}

            {/* Magic Link Sent Success */}
            {authMethod === 'magic-link' && magicLinkSent && (
              <div className="text-center py-4">
                <div className="mx-auto w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-[var(--text-primary)] mb-2">Check your email</h3>
                <p className="text-sm text-[var(--text-secondary)] mb-4">
                  We've sent a magic link to <strong>{email}</strong>
                </p>
                <button
                  type="button"
                  onClick={() => setMagicLinkSent(false)}
                  className="text-sm text-primary-500 hover:text-primary-600"
                >
                  Send again
                </button>
              </div>
            )}

            <p className="text-center text-sm text-[var(--text-secondary)] mt-6">
              Don't have an account?{' '}
              <Link href="/register" className="text-primary-500 hover:text-primary-600 font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
