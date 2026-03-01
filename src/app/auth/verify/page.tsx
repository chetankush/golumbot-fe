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
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [error, setError] = useState('');
  const didRun = useRef(false);

  useEffect(() => {
    // Prevent double-run in React Strict Mode
    if (didRun.current) return;
    didRun.current = true;

    const verify = async () => {
      try {
        let accessToken: string | null = null;

        // 1. Check hash fragment first (magic links / email verify)
        const hash = window.location.hash.substring(1);
        if (hash) {
          const params = new URLSearchParams(hash);
          accessToken = params.get('access_token');
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
