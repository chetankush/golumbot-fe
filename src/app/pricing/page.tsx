'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { creditsApi } from '@/lib/api';
import { ThemeToggle } from '@/components/ThemeProvider';

interface Package {
  id: string;
  name: string;
  credits: number;
  price: number;
  priceId: string;
  popular: boolean;
  savings: string | null;
  pricePerCredit: string;
}

export default function PricingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, token } = useAuthStore();
  const [loading, setLoading] = useState<string | null>(null);
  const [packages, setPackages] = useState<Package[]>([]);
  const [balance, setBalance] = useState<number | null>(null);
  const [showToast, setShowToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    // Check for purchase status in URL
    const purchaseStatus = searchParams.get('purchase');
    const creditsAdded = searchParams.get('credits');

    if (purchaseStatus === 'success' && creditsAdded) {
      setShowToast({ type: 'success', message: `Payment successful! ${creditsAdded} credits added to your account.` });
      router.replace('/pricing');
    } else if (purchaseStatus === 'canceled') {
      setShowToast({ type: 'error', message: 'Purchase was canceled. No charges were made.' });
      router.replace('/pricing');
    }

    // Fetch packages
    fetchPackages();

    // Fetch balance if authenticated
    if (isAuthenticated && token) {
      fetchBalance();
    }
  }, [isAuthenticated, token, searchParams, router]);

  const fetchPackages = async () => {
    try {
      const response = await creditsApi.getPackages();
      setPackages(response.data.packages);
    } catch (error) {
      console.error('Failed to fetch packages:', error);
    }
  };

  const fetchBalance = async () => {
    try {
      const response = await creditsApi.getBalance(token!);
      setBalance(response.data.balance);
    } catch (error) {
      console.error('Failed to fetch balance:', error);
    }
  };

  const handlePurchase = async (pkg: Package) => {
    if (!isAuthenticated) {
      router.push('/register');
      return;
    }

    if (!pkg.priceId) {
      setShowToast({ type: 'error', message: 'This package is not available yet. Please contact support.' });
      return;
    }

    setLoading(pkg.id);

    try {
      const response = await creditsApi.purchase(token!, pkg.id);
      window.location.href = response.data.url;
    } catch (error: any) {
      console.error('Purchase error:', error);
      setShowToast({ type: 'error', message: error.message || 'Failed to start checkout' });
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Toast Notification */}
      {showToast && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-xl shadow-lg animate-fade-in ${
          showToast.type === 'success'
            ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800'
            : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800'
        }`}>
          <div className="flex items-center gap-3">
            {showToast.type === 'success' ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            <span>{showToast.message}</span>
            <button onClick={() => setShowToast(null)} className="ml-2 hover:opacity-70">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="sticky top-0 z-40 glass">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="font-display text-2xl font-bold gradient-text">
              Golum
            </Link>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              {isAuthenticated ? (
                <Link
                  href="/dashboard"
                  className="px-5 py-2.5 gradient-bg text-white font-medium rounded-full hover:opacity-90 transition-all"
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link href="/login" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
                    Sign in
                  </Link>
                  <Link
                    href="/register"
                    className="px-5 py-2.5 gradient-bg text-white font-medium rounded-full hover:opacity-90 transition-all"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="pt-20 pb-12 px-6 text-center">
        <h1 className="font-display text-4xl md:text-6xl font-bold mb-4">
          Pay As You <span className="gradient-text">Go</span>
        </h1>
        <p className="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto mb-6">
          Buy credits, use them anytime. No subscriptions, no hidden fees. Credits never expire.
        </p>

        {/* Current Balance */}
        {isAuthenticated && balance !== null && (
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 border border-purple-200 dark:border-purple-800">
            <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-left">
              <p className="text-sm text-[var(--text-secondary)]">Your Balance</p>
              <p className="text-2xl font-bold gradient-text">{balance.toLocaleString()} credits</p>
            </div>
          </div>
        )}

        {/* Free credits info */}
        <div className="mt-8 flex items-center justify-center gap-2 text-[var(--text-secondary)]">
          <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
          </svg>
          <span>New users get <strong className="text-[var(--text-primary)]">100 free credits</strong> to start!</span>
        </div>
      </section>

      {/* Credit Costs */}
      <section className="pb-12 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
              <div className="text-3xl mb-2">💬</div>
              <p className="font-semibold">1 credit</p>
              <p className="text-sm text-[var(--text-secondary)]">per message</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
              <div className="text-3xl mb-2">📄</div>
              <p className="font-semibold">5 credits</p>
              <p className="text-sm text-[var(--text-secondary)]">per document</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
              <div className="text-3xl mb-2">🌐</div>
              <p className="font-semibold">3 credits</p>
              <p className="text-sm text-[var(--text-secondary)]">per web scrape</p>
            </div>
          </div>
        </div>
      </section>

      {/* Credit Packages */}
      <section className="pb-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display text-2xl font-bold text-center mb-8">Choose Your Package</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className={`pricing-card ${pkg.popular ? 'popular' : ''}`}
              >
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 gradient-bg text-white text-sm font-medium rounded-full">
                    Best Value
                  </div>
                )}

                {pkg.savings && (
                  <div className="absolute top-4 right-4 px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium rounded-full">
                    Save {pkg.savings}
                  </div>
                )}

                <h3 className="font-display text-lg font-semibold mb-1">{pkg.name}</h3>

                <div className="mb-4">
                  <span className="font-display text-4xl font-bold">${pkg.price}</span>
                </div>

                <div className="text-center py-4 mb-4 rounded-xl bg-[var(--bg-tertiary)]">
                  <p className="text-3xl font-bold gradient-text">{pkg.credits.toLocaleString()}</p>
                  <p className="text-sm text-[var(--text-secondary)]">credits</p>
                </div>

                <p className="text-sm text-[var(--text-muted)] text-center mb-6">
                  ${pkg.pricePerCredit}¢ per credit
                </p>

                <button
                  onClick={() => handlePurchase(pkg)}
                  disabled={loading === pkg.id}
                  className={`block w-full py-3 rounded-xl font-medium text-center transition-all disabled:opacity-50 ${
                    pkg.popular
                      ? 'gradient-bg text-white hover:opacity-90 hover:shadow-lg hover:shadow-purple-500/25'
                      : 'bg-[var(--bg-tertiary)] text-[var(--text-primary)] hover:bg-[var(--border-color)]'
                  }`}
                >
                  {loading === pkg.id ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    'Buy Now'
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-2xl font-bold text-center mb-8">Why Credits?</h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Never Expire</h3>
              <p className="text-sm text-[var(--text-secondary)]">Your credits are yours forever. Use them whenever you need.</p>
            </div>

            <div className="text-center p-6">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">No Commitments</h3>
              <p className="text-sm text-[var(--text-secondary)]">No subscriptions or recurring charges. Buy only what you need.</p>
            </div>

            <div className="text-center p-6">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Volume Discounts</h3>
              <p className="text-sm text-[var(--text-secondary)]">Buy more credits, pay less per credit. Save up to 60%!</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display text-2xl font-bold text-center mb-8">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            <FAQItem
              question="How do credits work?"
              answer="Each action in Golum costs a certain number of credits. Sending a message costs 1 credit, uploading a document costs 5 credits, and scraping a website costs 3 credits. Your credits are deducted automatically as you use the service."
            />
            <FAQItem
              question="Do credits expire?"
              answer="No! Your credits never expire. Once you purchase credits, they're yours to use whenever you want, with no time limit."
            />
            <FAQItem
              question="What happens when I run out of credits?"
              answer="When your credits run low (below 20), you'll see a warning. When you run out, you won't be able to send messages until you purchase more credits. Your assistant and data remain safe."
            />
            <FAQItem
              question="Can I get a refund?"
              answer="Yes! If you're not satisfied with your purchase, contact us within 14 days for a full refund of unused credits."
            />
            <FAQItem
              question="Do I get free credits?"
              answer="Yes! Every new account gets 100 free credits to try out Golum. That's enough for 100 AI conversations!"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl gradient-bg p-12 text-center text-white">
            <div className="relative z-10">
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                Start with 100 Free Credits
              </h2>
              <p className="text-lg opacity-90 mb-8">
                Create your account and get 100 credits instantly. No credit card required.
              </p>
              <Link
                href={isAuthenticated ? '/dashboard' : '/register'}
                className="inline-block px-8 py-4 bg-white text-purple-700 font-semibold rounded-full text-lg hover:bg-opacity-90 transition-all hover:shadow-xl"
              >
                {isAuthenticated ? 'Go to Dashboard' : 'Get Free Credits'}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--border-color)] py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[var(--text-muted)]">
            © 2024 Golum. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-[var(--text-secondary)]">
            <Link href="/" className="hover:text-[var(--text-primary)]">Home</Link>
            <Link href="/pricing" className="hover:text-[var(--text-primary)]">Pricing</Link>
            <a href="#" className="hover:text-[var(--text-primary)]">Privacy</a>
            <a href="#" className="hover:text-[var(--text-primary)]">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

// FAQ Item Component
function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-[var(--border-color)] rounded-xl overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-[var(--bg-tertiary)] transition-colors"
      >
        <span className="font-medium">{question}</span>
        <svg
          className={`w-5 h-5 text-[var(--text-muted)] transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="px-6 pb-4 text-[var(--text-secondary)] animate-fade-in">
          {answer}
        </div>
      )}
    </div>
  );
}
