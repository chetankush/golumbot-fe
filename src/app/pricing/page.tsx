'use client';

import { Suspense, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { creditsApi } from '@/lib/api';
import { ThemeToggle } from '@/components/ThemeProvider';
import { GolumIcon } from '@/components/Logo';

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
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div></div>}>
      <PricingContent />
    </Suspense>
  );
}

function PricingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, token } = useAuthStore();
  const [loading, setLoading] = useState<string | null>(null);
  const [packages, setPackages] = useState<Package[]>([]);
  const [balance, setBalance] = useState<number | null>(null);
  const [showToast, setShowToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Auto-dismiss toasts
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  useEffect(() => {
    // Check for purchase status in URL
    const purchaseStatus = searchParams.get('purchase');
    const creditsAdded = searchParams.get('credits');

    if (purchaseStatus === 'success' && creditsAdded) {
      setShowToast({ type: 'success', message: `Payment successful! ${Number(creditsAdded).toLocaleString()} credits have been added to your account.` });
      router.replace('/pricing');
    } else if (purchaseStatus === 'canceled') {
      setShowToast({ type: 'error', message: 'Purchase canceled. No charges were made.' });
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
    } catch (error: any) {
      setShowToast({ type: 'error', message: 'Unable to load pricing. Please refresh the page.' });
    }
  };

  const fetchBalance = async () => {
    try {
      const response = await creditsApi.getBalance(token!);
      setBalance(response.data.balance);
    } catch (error: any) {
      // Silently fail for balance - non-critical
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
        <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-3 rounded-lg shadow-lg animate-fade-in flex items-center gap-3 text-sm ${
          showToast.type === 'success'
            ? 'bg-[#202124] dark:bg-[#e8eaed] text-white dark:text-[#202124]'
            : 'bg-red-600 dark:bg-red-500 text-white'
        }`}>
          <span>{showToast.message}</span>
          <button onClick={() => setShowToast(null)} className="ml-1 hover:opacity-70 flex-shrink-0">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

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

      {/* Header */}
      <section className="pt-16 pb-10 px-6 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-3">
          Pay as you go
        </h1>
        <p className="text-lg text-[var(--text-secondary)] max-w-xl mx-auto mb-6">
          Buy credits, use them anytime. No subscriptions, no hidden fees.
        </p>

        {/* Current Balance */}
        {isAuthenticated && balance !== null && (
          <div className="inline-flex items-center gap-3 px-5 py-3 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)]">
            <div className="text-left">
              <p className="text-xs text-[var(--text-muted)]">Your balance</p>
              <p className="text-xl font-semibold">{balance.toLocaleString()} credits</p>
            </div>
          </div>
        )}

        <p className="mt-6 text-sm text-[var(--text-secondary)]">
          New users get <strong className="text-[var(--text-primary)]">100 free credits</strong> to start
        </p>
      </section>

      {/* Credit Costs */}
      <section className="pb-10 px-6">
        <div className="max-w-2xl mx-auto">
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 rounded-lg bg-[var(--bg-tertiary)]">
              <p className="text-sm font-medium">1 credit</p>
              <p className="text-xs text-[var(--text-muted)]">per message</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-[var(--bg-tertiary)]">
              <p className="text-sm font-medium">5 credits</p>
              <p className="text-xs text-[var(--text-muted)]">per document</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-[var(--bg-tertiary)]">
              <p className="text-sm font-medium">3 credits</p>
              <p className="text-xs text-[var(--text-muted)]">per web scrape</p>
            </div>
          </div>
        </div>
      </section>

      {/* Credit Packages */}
      <section className="pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-semibold text-center mb-6">Choose your package</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className={`pricing-card ${pkg.popular ? 'popular' : ''}`}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-[var(--accent)] text-white text-xs font-medium rounded-full">
                    Best value
                  </div>
                )}

                {pkg.savings && (
                  <div className="absolute top-3 right-3 px-2 py-0.5 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-xs font-medium rounded">
                    Save {pkg.savings}
                  </div>
                )}

                <h3 className="text-base font-semibold mb-1">{pkg.name}</h3>

                <div className="mb-3">
                  <span className="text-3xl font-bold">${pkg.price}</span>
                </div>

                <div className="text-center py-3 mb-3 rounded-lg bg-[var(--bg-tertiary)]">
                  <p className="text-xl font-bold text-[var(--accent)]">{pkg.credits.toLocaleString()}</p>
                  <p className="text-xs text-[var(--text-muted)]">credits</p>
                </div>

                <p className="text-xs text-[var(--text-muted)] text-center mb-4">
                  ${pkg.pricePerCredit}¢ per credit
                </p>

                <button
                  onClick={() => handlePurchase(pkg)}
                  disabled={loading === pkg.id}
                  className={`block w-full py-2.5 rounded-lg text-sm font-medium text-center transition-colors disabled:opacity-50 ${
                    pkg.popular
                      ? 'bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)]'
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
                    'Buy now'
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="pb-16 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl font-semibold text-center mb-6">Why credits?</h2>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center p-4">
              <div className="w-10 h-10 mx-auto mb-3 rounded-lg bg-[var(--bg-tertiary)] flex items-center justify-center">
                <svg className="w-5 h-5 text-[var(--text-secondary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-sm font-medium mb-1">Never expire</h3>
              <p className="text-xs text-[var(--text-secondary)]">Your credits are yours forever. Use them whenever you need.</p>
            </div>

            <div className="text-center p-4">
              <div className="w-10 h-10 mx-auto mb-3 rounded-lg bg-[var(--bg-tertiary)] flex items-center justify-center">
                <svg className="w-5 h-5 text-[var(--text-secondary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-sm font-medium mb-1">No commitments</h3>
              <p className="text-xs text-[var(--text-secondary)]">No subscriptions or recurring charges. Buy only what you need.</p>
            </div>

            <div className="text-center p-4">
              <div className="w-10 h-10 mx-auto mb-3 rounded-lg bg-[var(--bg-tertiary)] flex items-center justify-center">
                <svg className="w-5 h-5 text-[var(--text-secondary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-sm font-medium mb-1">Volume discounts</h3>
              <p className="text-xs text-[var(--text-secondary)]">Buy more credits, pay less per credit. Save up to 60%.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="pb-16 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl font-semibold text-center mb-6">
            Frequently asked questions
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
      <section className="pb-16 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] p-10 text-center">
            <h2 className="text-2xl font-bold mb-3">
              Start with 100 free credits
            </h2>
            <p className="text-[var(--text-secondary)] mb-6">
              Create your account and get 100 credits instantly. No credit card required.
            </p>
            <Link
              href={isAuthenticated ? '/dashboard' : '/register'}
              className="inline-block px-6 py-3 bg-[var(--accent)] text-white font-medium rounded-lg hover:bg-[var(--accent-hover)] transition-colors"
            >
              {isAuthenticated ? 'Go to Dashboard' : 'Get free credits'}
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--border-color)] py-6 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[var(--text-muted)]">
            © {new Date().getFullYear()} Golum. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-xs text-[var(--text-secondary)]">
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
