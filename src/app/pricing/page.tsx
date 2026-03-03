'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { creditsApi } from '@/lib/api';
import { GolumIcon } from '@/components/Logo';

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    monthlyCredits: 0,
    maxAssistants: 1,
    summaryLimit: 10,
    features: ['1 AI assistant', '100 welcome credits', '10 conversation summaries', 'Basic widget customization'],
    popular: false,
    cta: 'Get Started',
  },
  {
    id: 'starter',
    name: 'Starter',
    price: 9,
    monthlyCredits: 200,
    maxAssistants: 3,
    summaryLimit: 50,
    features: ['3 AI assistants', '200 credits/month', '50 conversation summaries', 'Full widget customization', 'Lead capture'],
    popular: false,
    cta: 'Subscribe',
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 29,
    monthlyCredits: 1000,
    maxAssistants: 10,
    summaryLimit: 100,
    features: ['10 AI assistants', '1,000 credits/month', '100 conversation summaries', 'Full widget customization', 'Lead capture', 'Priority support'],
    popular: true,
    cta: 'Subscribe',
  },
  {
    id: 'business_plan',
    name: 'Business',
    price: 99,
    monthlyCredits: 5000,
    maxAssistants: -1,
    summaryLimit: 200,
    features: ['Unlimited assistants', '5,000 credits/month', '200 conversation summaries', 'Full widget customization', 'Lead capture', 'Priority support', 'Custom branding'],
    popular: false,
    cta: 'Subscribe',
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 299,
    monthlyCredits: 20000,
    maxAssistants: -1,
    summaryLimit: 500,
    features: ['Unlimited assistants', '20,000 credits/month', '500 conversation summaries', 'Full widget customization', 'Lead capture', 'Dedicated support', 'Custom branding', 'SLA guarantee'],
    popular: false,
    cta: 'Subscribe',
  },
];

const CREDIT_PACKAGES = [
  { id: 'basic', name: 'Basic', credits: 500, price: 10, savings: null },
  { id: 'popular', name: 'Popular', credits: 2000, price: 15, savings: '25%' },
  { id: 'pro', name: 'Pro', credits: 10000, price: 50, savings: '50%' },
  { id: 'business', name: 'Business', credits: 50000, price: 200, savings: '60%' },
];

export default function PricingPage() {
  const { isAuthenticated, token } = useAuthStore();
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [showToast, setShowToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSubscribe = async (planId: string) => {
    if (!isAuthenticated || !token) {
      router.push('/login');
      return;
    }
    if (planId === 'free') {
      router.push('/dashboard');
      return;
    }
    setLoading(planId);
    try {
      const response = await creditsApi.subscribe(token, planId);
      if (response.data?.paymentLink) {
        window.location.href = response.data.paymentLink;
      }
    } catch (error: any) {
      setShowToast({ type: 'error', message: error.message || 'Failed to start subscription. Please try again.' });
      setTimeout(() => setShowToast(null), 5000);
    } finally {
      setLoading(null);
    }
  };

  const handlePurchase = async (packageId: string) => {
    if (!isAuthenticated || !token) {
      router.push('/login');
      return;
    }
    setLoading(packageId);
    try {
      const response = await creditsApi.purchase(token, packageId);
      if (response.data?.paymentLink) {
        window.location.href = response.data.paymentLink;
      }
    } catch (error: any) {
      setShowToast({ type: 'error', message: error.message || 'Failed to start purchase. Please try again.' });
      setTimeout(() => setShowToast(null), 5000);
    } finally {
      setLoading(null);
    }
  };

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
              {isAuthenticated ? (
                <Link
                  href="/dashboard"
                  className="px-5 py-2 border border-purple-500 text-purple-400 text-sm font-medium rounded-full hover:bg-purple-500/10 transition-colors"
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link href="/login" className="px-5 py-2 border border-[var(--border-color)] text-[var(--text-secondary)] text-sm font-medium rounded-full hover:border-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
                    Sign in
                  </Link>
                  <Link
                    href="/register"
                    className="px-5 py-2 border border-purple-500 text-purple-400 text-sm font-medium rounded-full hover:bg-purple-500/10 transition-colors"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Subscription Plans Section */}
      <section className="pt-20 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-[var(--text-primary)]">
              Choose Your Plan
            </h1>
            <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
              Start free and scale as you grow. Every plan includes AI-powered chat assistants, lead capture, and analytics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {PLANS.map((plan) => (
              <div
                key={plan.id}
                className={`card p-6 flex flex-col relative ${
                  plan.popular ? 'border-purple-500/50 ring-1 ring-purple-500/20' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-purple-500 text-white text-xs font-medium rounded-full">
                    Most Popular
                  </div>
                )}

                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-[var(--text-primary)]">{plan.name}</h3>
                  <div className="mt-2">
                    <span className="text-3xl font-bold text-[var(--text-primary)]">${plan.price}</span>
                    {plan.price > 0 && <span className="text-sm text-[var(--text-muted)]">/month</span>}
                  </div>
                  {plan.monthlyCredits > 0 && (
                    <p className="text-xs text-purple-400 mt-1">
                      {plan.monthlyCredits.toLocaleString()} credits/month
                    </p>
                  )}
                </div>

                <ul className="space-y-2 mb-6 flex-1">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
                      <svg className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={loading === plan.id}
                  className={`w-full py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                    plan.popular
                      ? 'bg-purple-500 hover:bg-purple-600 text-white'
                      : plan.price === 0
                        ? 'bg-[var(--bg-tertiary)] hover:bg-[var(--border-color)] text-[var(--text-primary)]'
                        : 'border border-purple-500/50 text-purple-400 hover:bg-purple-500/10'
                  }`}
                >
                  {loading === plan.id ? 'Redirecting...' : plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Credit Top-ups Section */}
      <section className="pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-3 text-[var(--text-primary)]">
              Need More Credits?
            </h2>
            <p className="text-[var(--text-secondary)]">
              Top up your balance anytime with one-time credit packages. Credits never expire.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {CREDIT_PACKAGES.map((pkg) => (
              <div key={pkg.id} className="card p-5 flex flex-col">
                <div className="mb-4">
                  <h3 className="text-base font-semibold text-[var(--text-primary)]">{pkg.name}</h3>
                  <div className="mt-1">
                    <span className="text-2xl font-bold text-[var(--text-primary)]">${pkg.price}</span>
                    <span className="text-xs text-[var(--text-muted)] ml-1">one-time</span>
                  </div>
                  <p className="text-sm text-purple-400 mt-1">
                    {pkg.credits.toLocaleString()} credits
                  </p>
                  {pkg.savings && (
                    <span className="inline-block mt-1 px-2 py-0.5 bg-green-900/30 text-green-400 text-xs rounded-full">
                      Save {pkg.savings}
                    </span>
                  )}
                </div>

                <button
                  onClick={() => handlePurchase(pkg.id)}
                  disabled={loading === pkg.id}
                  className="w-full mt-auto py-2 rounded-lg text-sm font-medium border border-[var(--border-color)] text-[var(--text-secondary)] hover:border-purple-500/50 hover:text-purple-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading === pkg.id ? 'Redirecting...' : 'Buy Credits'}
                </button>
              </div>
            ))}
          </div>

          <div className="mt-8 card p-5">
            <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">How credits work</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                  <span className="text-purple-400 text-xs font-bold">1</span>
                </div>
                <span className="text-[var(--text-secondary)]">1 credit per AI message</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                  <span className="text-purple-400 text-xs font-bold">5</span>
                </div>
                <span className="text-[var(--text-secondary)]">5 credits per document upload</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                  <span className="text-purple-400 text-xs font-bold">3</span>
                </div>
                <span className="text-[var(--text-secondary)]">3 credits per web scrape</span>
              </div>
            </div>
          </div>
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

      {/* Toast */}
      {showToast && (
        <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-3 rounded-lg shadow-lg animate-fade-in flex items-center gap-3 text-sm ${
          showToast.type === 'success'
            ? 'bg-[#e8eaed] text-[#202124]'
            : 'bg-red-500 text-white'
        }`}>
          {showToast.message}
        </div>
      )}
    </div>
  );
}
