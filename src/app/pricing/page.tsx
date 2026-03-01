'use client';

import Link from 'next/link';
import { useAuthStore } from '@/lib/store';
import { ThemeToggle } from '@/components/ThemeProvider';
import { GolumIcon } from '@/components/Logo';

export default function PricingPage() {
  const { isAuthenticated } = useAuthStore();

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 glass">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-xl font-semibold text-[var(--text-primary)]">
              <GolumIcon size={26} />
              Golum
            </Link>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              {isAuthenticated ? (
                <Link
                  href="/dashboard"
                  className="px-4 py-2 bg-[var(--accent)] text-white text-sm font-medium rounded-lg hover:bg-[var(--accent-hover)] transition-colors"
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link href="/login" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
                    Sign in
                  </Link>
                  <Link
                    href="/register"
                    className="px-4 py-2 bg-[var(--accent)] text-white text-sm font-medium rounded-lg hover:bg-[var(--accent-hover)] transition-colors"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Contact Section */}
      <section className="pt-20 pb-16 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Get Full Access
          </h1>
          <p className="text-lg text-[var(--text-secondary)] mb-12">
            Contact us to unlock the full potential of Golum for your business. We&apos;ll help you get set up with a plan that works for you.
          </p>

          <div className="card p-8 max-w-md mx-auto">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary-500/10 flex items-center justify-center">
              <svg className="w-8 h-8 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>

            <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-6">Contact Us</h2>

            <div className="space-y-4">
              <a
                href="tel:7987401227"
                className="flex items-center gap-3 p-4 rounded-xl bg-[var(--bg-tertiary)] hover:bg-[var(--border-color)] transition-colors group"
              >
                <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">7987401227</p>
                  <p className="text-xs text-[var(--text-muted)]">Phone</p>
                </div>
              </a>

              <a
                href="tel:9303135537"
                className="flex items-center gap-3 p-4 rounded-xl bg-[var(--bg-tertiary)] hover:bg-[var(--border-color)] transition-colors group"
              >
                <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">9303135537</p>
                  <p className="text-xs text-[var(--text-muted)]">Phone</p>
                </div>
              </a>

              <a
                href="mailto:chetankushwah929@gmail.com"
                className="flex items-center gap-3 p-4 rounded-xl bg-[var(--bg-tertiary)] hover:bg-[var(--border-color)] transition-colors group"
              >
                <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">chetankushwah929@gmail.com</p>
                  <p className="text-xs text-[var(--text-muted)]">Email</p>
                </div>
              </a>
            </div>
          </div>

          <p className="mt-8 text-sm text-[var(--text-muted)]">
            We typically respond within 24 hours.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--border-color)] py-6 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[var(--text-muted)]">
            &copy; {new Date().getFullYear()} Golum. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-xs text-[var(--text-secondary)]">
            <Link href="/" className="hover:text-[var(--text-primary)]">Home</Link>
            <Link href="/privacy" className="hover:text-[var(--text-primary)]">Privacy</Link>
            <Link href="/terms" className="hover:text-[var(--text-primary)]">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
