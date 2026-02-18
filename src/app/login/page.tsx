'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store';
import { authApi } from '@/lib/api';
import { ThemeToggle } from '@/components/ThemeProvider';

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
        <Link href="/" className="font-display text-xl font-semibold text-[var(--text-primary)]">
          Golum
        </Link>
        <ThemeToggle />
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md animate-fade-in">
          {/* Header Text */}
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl font-semibold text-[var(--text-primary)] mb-2">
              Welcome back
            </h1>
            <p className="text-[var(--text-secondary)]">
              Sign in to continue to your dashboard
            </p>
          </div>

          {/* Card */}
          <div className="card p-8">
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
