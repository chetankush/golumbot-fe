'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store';
import { authApi } from '@/lib/api';

export default function VerifyMagicLinkPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const login = useAuthStore((state) => state.login);
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [error, setError] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      setStatus('error');
      setError('Invalid magic link - no token provided');
      return;
    }

    const verifyToken = async () => {
      try {
        const response: any = await authApi.verifyMagicLink(token);
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
        setError(err.message || 'Failed to verify magic link');
      }
    };

    verifyToken();
  }, [searchParams, login, router]);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex items-center justify-center px-6 py-4">
        <Link href="/" className="font-display text-xl font-semibold text-[var(--text-primary)]">
          Golum
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md animate-fade-in">
          <div className="card p-8 text-center">
            {status === 'verifying' && (
              <>
                <div className="mx-auto w-12 h-12 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mb-4" />
                <h2 className="font-display text-xl font-semibold text-[var(--text-primary)] mb-2">
                  Verifying your magic link...
                </h2>
                <p className="text-[var(--text-secondary)]">Please wait while we sign you in.</p>
              </>
            )}

            {status === 'success' && (
              <>
                <div className="mx-auto w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="font-display text-xl font-semibold text-[var(--text-primary)] mb-2">
                  Successfully signed in!
                </h2>
                <p className="text-[var(--text-secondary)]">Redirecting you to your dashboard...</p>
              </>
            )}

            {status === 'error' && (
              <>
                <div className="mx-auto w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <h2 className="font-display text-xl font-semibold text-[var(--text-primary)] mb-2">
                  Verification failed
                </h2>
                <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
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
