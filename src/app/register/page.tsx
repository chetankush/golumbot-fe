'use client';

import { useState } from 'react';
import Link from 'next/link';
import { authApi } from '@/lib/api';
import { ThemeToggle } from '@/components/ThemeProvider';
import { GolumIcon } from '@/components/Logo';
import { createBrowserSupabaseClient } from '@/lib/supabase';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    companyName: '',
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authApi.register(formData);
      // Registration successful — show "check your email" screen
      setRegistered(true);
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

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
              Create your account
            </h1>
            <p className="text-sm text-[var(--text-secondary)]">
              Start building AI assistants in minutes
            </p>
          </div>

          {/* Card */}
          <div className="card p-8">
            {/* Email Verification Success Screen */}
            {registered ? (
              <div className="text-center py-4">
                <div className="mx-auto w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-[var(--text-primary)] mb-2">Check your email</h3>
                <p className="text-sm text-[var(--text-secondary)] mb-4">
                  We've sent a verification link to <strong>{formData.email}</strong>. Click the link to verify your account and sign in.
                </p>
                <p className="text-xs text-[var(--text-muted)] mb-4">
                  Didn't receive it? Check your spam folder.
                </p>
                <Link
                  href="/login"
                  className="text-sm text-primary-500 hover:text-primary-600 font-medium"
                >
                  Back to login
                </Link>
              </div>
            ) : (
              <>
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

                {error && (
                  <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4" suppressHydrationWarning>
                  <div>
                    <label htmlFor="companyName" className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                      Company / Project Name
                    </label>
                    <input
                      id="companyName"
                      type="text"
                      required
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      className="w-full px-4 py-2.5 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] placeholder-[var(--text-muted)]"
                      placeholder="Acme Inc"
                      suppressHydrationWarning
                    />
                  </div>

                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                      Your Name <span className="text-[var(--text-muted)]">(optional)</span>
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2.5 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] placeholder-[var(--text-muted)]"
                      placeholder="John Doe"
                      suppressHydrationWarning
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                      minLength={8}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full px-4 py-2.5 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] placeholder-[var(--text-muted)]"
                      placeholder="••••••••"
                      suppressHydrationWarning
                    />
                    <p className="mt-1 text-xs text-[var(--text-muted)]">Min 8 characters, with uppercase, lowercase, and a number</p>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 px-4 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-primary-500/25 mt-2"
                    suppressHydrationWarning
                  >
                    {loading ? 'Creating account...' : 'Create account'}
                  </button>
                </form>

                <p className="text-center text-sm text-[var(--text-secondary)] mt-6">
                  Already have an account?{' '}
                  <Link href="/login" className="text-primary-500 hover:text-primary-600 font-medium">
                    Sign in
                  </Link>
                </p>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
