'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store';
import { authApi } from '@/lib/api';
import { createBrowserSupabaseClient } from '@/lib/supabase';
import { GolumIcon } from '@/components/Logo';

export default function VerifyPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const [status, setStatus] = useState<'verifying' | 'success' | 'error' | 'recovery'>('verifying');
  const [error, setError] = useState('');
  const [recoveryToken, setRecoveryToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const didRun = useRef(false);

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPassword)) {
      setError('Password must contain at least one uppercase letter, one lowercase letter, and one number');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setPasswordLoading(true);
    try {
      await authApi.updatePassword(recoveryToken, newPassword);
      setStatus('success');
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to update password');
    } finally {
      setPasswordLoading(false);
    }
  };

  useEffect(() => {
    // Prevent double-run in React Strict Mode
    if (didRun.current) return;
    didRun.current = true;

    const verify = async () => {
      try {
        let accessToken: string | null = null;
        let isRecovery = false;

        // 1. Check hash fragment first (magic links / email verify / recovery)
        const hash = window.location.hash.substring(1);
        if (hash) {
          const params = new URLSearchParams(hash);
          accessToken = params.get('access_token');
          const type = params.get('type');
          if (type === 'recovery') {
            isRecovery = true;
          }
        }

        // Check query param for recovery type as well
        const searchParams = new URLSearchParams(window.location.search);
        if (searchParams.get('type') === 'recovery') {
          isRecovery = true;
        }

        // 2. If no hash token, use Supabase client to handle OAuth code exchange (Google PKCE flow)
        if (!accessToken) {
          const supabase = createBrowserSupabaseClient();
          // This handles ?code=... exchange automatically
          const { data: { session }, error: sessionError } = await supabase.auth.getSession();

          if (sessionError) throw new Error(sessionError.message);
          if (session?.access_token) {
            accessToken = session.access_token;
          }
        }

        if (!accessToken) {
          setStatus('error');
          setError('No authentication token found. Please try signing in again.');
          return;
        }

        // If this is a password recovery flow, show the password update form
        if (isRecovery) {
          setRecoveryToken(accessToken);
          setStatus('recovery');
          return;
        }

        // 3. Send token to our backend to create/find user and get app data
        const response: any = await authApi.verifyMagicLink(accessToken);
        login({
          user: response.data.user,
          tenant: response.data.tenant,
          token: response.data.token,
          apiKey: response.data.apiKey,
        });
        setStatus('success');
        setTimeout(() => {
          router.push('/dashboard');
        }, 1500);
      } catch (err: any) {
        setStatus('error');
        setError(err.message || 'Verification failed. Please try again.');
      }
    };

    verify();
  }, [login, router]);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex items-center justify-center px-6 py-4">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold text-[var(--text-primary)]">
          <GolumIcon size={24} />
          Golum
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md animate-fade-in">
          <div className="card p-8 text-center">
            {status === 'verifying' && (
              <>
                <div className="mx-auto w-12 h-12 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mb-4" />
                <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
                  Signing you in...
                </h2>
                <p className="text-[var(--text-secondary)]">Please wait while we verify your account.</p>
              </>
            )}

            {status === 'recovery' && (
              <>
                <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
                  Set a new password
                </h2>
                {error && (
                  <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm">
                    {error}
                  </div>
                )}
                <form onSubmit={handlePasswordUpdate} className="space-y-4 text-left">
                  <div>
                    <label htmlFor="new-password" className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                      New Password
                    </label>
                    <input
                      id="new-password"
                      type="password"
                      required
                      minLength={8}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white/[0.04] border border-white/[0.1] rounded-xl text-white placeholder-white/20 transition-all focus:border-purple-500/50 focus:bg-white/[0.06] focus:shadow-[0_0_0_2px_rgba(124,58,237,0.15)]"
                      placeholder="Min 8 chars, uppercase, lowercase, number"
                    />
                  </div>
                  <div>
                    <label htmlFor="confirm-password" className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                      Confirm Password
                    </label>
                    <input
                      id="confirm-password"
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white/[0.04] border border-white/[0.1] rounded-xl text-white placeholder-white/20 transition-all focus:border-purple-500/50 focus:bg-white/[0.06] focus:shadow-[0_0_0_2px_rgba(124,58,237,0.15)]"
                      placeholder="Repeat password"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={passwordLoading}
                    className="w-full py-2.5 px-4 bg-purple-600 hover:bg-purple-500 text-white font-medium rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_30px_rgba(124,58,237,0.3)]"
                  >
                    {passwordLoading ? 'Updating...' : 'Update Password'}
                  </button>
                </form>
              </>
            )}

            {status === 'success' && (
              <>
                <div className="mx-auto w-12 h-12 bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
                  Successfully signed in!
                </h2>
                <p className="text-[var(--text-secondary)]">Redirecting you to your dashboard...</p>
              </>
            )}

            {status === 'error' && (
              <>
                <div className="mx-auto w-12 h-12 bg-red-900/30 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
                  Verification failed
                </h2>
                <p className="text-red-400 mb-4">{error}</p>
                <Link
                  href="/login"
                  className="inline-block px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-all"
                >
                  Back to Login
                </Link>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
