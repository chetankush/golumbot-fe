'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store';
import { assistantsApi, creditsApi, plansApi } from '@/lib/api';
import { GolumIcon } from '@/components/Logo';

interface WidgetConfig {
  primaryColor: string;
  position: 'bottom-right' | 'bottom-left';
  greeting: string;
  borderRadius: 'sharp' | 'rounded' | 'pill';
  launcherIcon: 'chat' | 'message' | 'support' | 'bot' | 'wave' | 'sparkle';
  suggestions: string[];
  customIconUrl?: string;
  customIconPath?: string;
  chatbotName?: string;
  launcherStyle?: 'circle' | 'pill';
  launcherColorScheme?: 'filled' | 'light';
}

interface Assistant {
  id: string;
  name: string;
  description?: string;
  systemPrompt: string;
  model: string;
  isActive: boolean;
  bookingUrl?: string;
  supportPhone?: string;
  supportWhatsApp?: string;
  widgetConfig?: WidgetConfig;
  createdAt: string;
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div></div>}>
      <DashboardContent />
    </Suspense>
  );
}

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, tenant, token, apiKey, logout } = useAuthStore();
  const [assistants, setAssistants] = useState<Assistant[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showCustomizeModal, setShowCustomizeModal] = useState<Assistant | null>(null);
  const [copied, setCopied] = useState(false);
  const [credits, setCredits] = useState<{ balance: number; lowBalance: boolean; devMode?: boolean } | null>(null);
  const [currentPlan, setCurrentPlan] = useState<{ name: string; slug: string } | null>(null);
  const [assistantUsage, setAssistantUsage] = useState<{ current: number; limit: number } | null>(null);
  const [selectedEmbedAssistant, setSelectedEmbedAssistant] = useState<string>('');
  const [showToast, setShowToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [modelMap, setModelMap] = useState<Record<string, { name: string; costPerMessage: number; category: string }>>({});

  // Auto-dismiss toasts
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  useEffect(() => {
    // Check for purchase success
    const purchaseStatus = searchParams.get('purchase');
    const creditsAdded = searchParams.get('credits');

    if (purchaseStatus === 'success' && creditsAdded) {
      setShowToast({ type: 'success', message: `Payment successful! ${Number(creditsAdded).toLocaleString()} credits added to your account.` });
      router.replace('/dashboard');
    }

    // Check for subscription success — verify with Dodo and sync DB
    const subscriptionStatus = searchParams.get('subscription');
    const planName = searchParams.get('plan');

    if (subscriptionStatus === 'success' && planName && token) {
      // Verify and sync subscription with Dodo API
      creditsApi.verifySubscription(token).then((res) => {
        if (res.data?.synced && res.data?.creditsAdded) {
          setShowToast({ type: 'success', message: `${planName.charAt(0).toUpperCase() + planName.slice(1)} plan activated! ${res.data.creditsAdded} credits added.` });
        } else {
          setShowToast({ type: 'success', message: `You're now on the ${planName.charAt(0).toUpperCase() + planName.slice(1)} plan.` });
        }
        // Reload credits and plan after sync
        loadCredits();
        loadPlan();
      }).catch(() => {
        setShowToast({ type: 'success', message: `Subscription activated! You're now on the ${planName.charAt(0).toUpperCase() + planName.slice(1)} plan.` });
      });
      router.replace('/dashboard');
    }

    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    Promise.all([loadAssistants(), loadCredits(), loadPlan(), loadModels()]);
  }, [isAuthenticated, router, searchParams]);

  const loadCredits = async () => {
    if (!token) return;
    try {
      const response = await creditsApi.getBalance(token);
      setCredits({
        balance: response.data.balance,
        lowBalance: response.data.lowBalance,
        devMode: (response.data as any).devMode,
      });
    } catch (error: any) {
      // If session expired, logout and redirect
      if (error.message?.includes('session has expired')) {
        logout();
        router.push('/login');
        return;
      }
      // Show error state instead of fake credits
      console.error('Failed to load credits:', error.message);
      setCredits({ balance: 0, lowBalance: true, devMode: false });
    }
  };

  const loadPlan = async () => {
    if (!token) return;
    try {
      const response = await plansApi.current(token);
      setCurrentPlan(response.data.plan);
      if (response.data.assistantUsage) {
        setAssistantUsage(response.data.assistantUsage);
      }
    } catch {
      setCurrentPlan({ name: 'Free', slug: 'free' });
    }
  };

  const loadModels = async () => {
    if (!token) return;
    try {
      const response = await assistantsApi.models(token);
      const map: Record<string, { name: string; costPerMessage: number; category: string }> = {};
      for (const m of response.data.models) {
        map[m.id] = { name: m.name, costPerMessage: m.costPerMessage, category: m.category };
      }
      setModelMap(map);
    } catch {
      // non-critical
    }
  };

  const loadAssistants = async () => {
    if (!token) return;
    try {
      const response = await assistantsApi.list(token);
      setAssistants(response.data.assistants);
    } catch (error: any) {
      console.error('Failed to load assistants:', error);
      // If token is invalid, logout and redirect
      if (error.message === 'Invalid token' || error.message === 'Unauthorized') {
        logout();
        router.push('/login');
        return;
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const copyApiKey = () => {
    navigator.clipboard.writeText(apiKey || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen">
      {/* Toast Notification */}
      {showToast && (
        <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-3 rounded-lg shadow-lg animate-fade-in flex items-center gap-3 text-sm ${
          showToast.type === 'success'
            ? 'bg-[#e8eaed] text-[#202124]'
            : 'bg-red-500 text-white'
        }`}>
          <span>{showToast.message}</span>
          <button onClick={() => setShowToast(null)} className="ml-1 hover:opacity-70 flex-shrink-0">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-20 bg-[var(--bg-secondary)]/95 backdrop-blur-sm border-b border-[var(--border-color)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 text-lg font-semibold text-[var(--text-primary)]">
              <GolumIcon size={24} />
              Golum
            </Link>
            <nav className="hidden md:flex items-center gap-1">
              <Link
                href="/dashboard"
                className="px-3 py-1.5 text-sm font-medium text-[var(--text-primary)] bg-[var(--bg-tertiary)] rounded-lg"
              >
                Assistants
              </Link>
              <Link
                href="/admin"
                className="px-3 py-1.5 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors"
              >
                Knowledge Base
              </Link>
              <Link
                href="/conversations"
                className="px-3 py-1.5 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors"
              >
                Conversations
              </Link>
              <Link
                href="/leads"
                className="px-3 py-1.5 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors"
              >
                Leads
              </Link>
              <Link
                href="/analytics"
                className="px-3 py-1.5 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors"
              >
                Analytics
              </Link>
              <Link
                href="/models"
                className="px-3 py-1.5 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors"
              >
                Models
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:block text-sm text-[var(--text-muted)]">{tenant?.name}</span>
            <button
              onClick={handleLogout}
              className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              Logout
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 py-2">
            <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-sm font-medium text-[var(--text-primary)] bg-[var(--bg-tertiary)] rounded-lg mb-1">Assistants</Link>
            <Link href="/admin" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors mb-1">Knowledge Base</Link>
            <Link href="/conversations" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors mb-1">Conversations</Link>
            <Link href="/leads" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors mb-1">Leads</Link>
            <Link href="/analytics" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors mb-1">Analytics</Link>
            <Link href="/models" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors">Models</Link>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 animate-fade-in">
        {/* Credits & Plan Overview */}
        {credits && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {/* Credit Balance */}
            <div className="card p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-emerald-500/10">
                  <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-sm text-[var(--text-secondary)]">Credits</span>
              </div>
              <p className={`text-2xl font-bold ${credits.lowBalance ? 'text-red-400' : 'text-[var(--text-primary)]'}`}>
                {credits.balance.toLocaleString()}
              </p>
              <div className="mt-2 space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-[var(--text-muted)]">Used</span>
                  <span className="text-[var(--text-secondary)]">{credits.totalUsed?.toLocaleString() || 0}</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-[var(--text-muted)]">Purchased</span>
                  <span className="text-[var(--text-secondary)]">{credits.totalPurchased?.toLocaleString() || 0}</span>
                </div>
              </div>
              {credits.lowBalance && (
                <p className="text-xs text-red-400 mt-2">Low balance — <Link href="/pricing" className="underline">buy more</Link></p>
              )}
            </div>

            {/* Current Plan */}
            <div className="card p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-blue-500/10">
                  <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <span className="text-sm text-[var(--text-secondary)]">Plan</span>
              </div>
              <p className="text-2xl font-bold text-[var(--text-primary)]">{currentPlan?.name || 'Free'}</p>
              <p className="text-[11px] text-[var(--text-muted)] mt-1">
                {currentPlan?.slug === 'free' || !currentPlan
                  ? '75 free credits included'
                  : `${credits.subscription?.status === 'active' ? 'Active' : 'Inactive'} subscription`}
              </p>
              <Link
                href="/pricing"
                className="mt-2 inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium rounded-md text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-color)] hover:border-[var(--text-muted)] transition-colors"
              >
                {(!currentPlan || currentPlan.slug === 'free') ? 'Buy Plan' : 'Upgrade'}
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {/* Assistants Used */}
            <div className="card p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-purple-500/10">
                  <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <span className="text-sm text-[var(--text-secondary)]">Assistants</span>
              </div>
              <p className="text-2xl font-bold text-[var(--text-primary)]">
                {assistantUsage ? `${assistantUsage.current}/${assistantUsage.limit === -1 ? '\u221e' : assistantUsage.limit}` : `${assistants.length}`}
              </p>
              <p className="text-[11px] text-[var(--text-muted)] mt-1">
                {assistantUsage?.limit === -1 ? 'Unlimited chatbots' : `${Math.max(0, (assistantUsage?.limit || 1) - (assistantUsage?.current || assistants.length))} slots remaining`}
              </p>
            </div>

            {/* Credit Cost Guide */}
            <div className="card p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-amber-500/10">
                  <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="text-sm text-[var(--text-secondary)]">Credit Usage</span>
              </div>
              <div className="space-y-1.5 mt-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-[var(--text-muted)]">Chat message</span>
                  <span className="text-emerald-400 font-medium">1 credit</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-[var(--text-muted)]">Web scrape</span>
                  <span className="text-blue-400 font-medium">3 credits</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-[var(--text-muted)]">Doc upload</span>
                  <span className="text-purple-400 font-medium">5 credits</span>
                </div>
              </div>
              <Link href="/models" className="text-[11px] text-[var(--text-muted)] hover:text-[var(--text-secondary)] mt-2 inline-block transition-colors">
                View AI models →
              </Link>
            </div>
          </div>
        )}

        {/* Subscription CTA for free users */}
        {credits && (!currentPlan || currentPlan.slug === 'free') && (
          <div className="card p-5 mb-8 border-purple-500/30 bg-gradient-to-r from-purple-500/5 via-blue-500/5 to-transparent">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-medium text-[var(--text-primary)] mb-1">Upgrade your plan</h3>
                <p className="text-sm text-[var(--text-secondary)]">
                  Get more credits, assistants, and features. Plans start at just $9/month.
                </p>
              </div>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-all hover:shadow-lg hover:shadow-primary-500/25 flex-shrink-0"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                View Plans
              </Link>
            </div>
          </div>
        )}

        {/* Low credits warning — only for free plan users (paid plans use the smart banner below) */}
        {credits && credits.lowBalance && (!currentPlan || currentPlan.slug === 'free') && credits.balance > 0 && (
          <div className="card p-5 mb-8 border-amber-500/30 bg-gradient-to-r from-amber-500/5 to-transparent">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-medium text-amber-400 mb-1">Running low on credits</h3>
                <p className="text-sm text-[var(--text-secondary)]">
                  You have {credits.balance} credits remaining. Subscribe to a plan or buy a credit pack.
                </p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Link
                  href="/pricing#credit-packs"
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 border border-amber-500/50 text-amber-400 hover:bg-amber-500/10 text-sm font-medium rounded-lg transition-all"
                >
                  Buy Credits
                </Link>
                <Link
                  href="/pricing"
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium rounded-lg transition-all"
                >
                  View Plans
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Smart Credit Top-up Banner */}
        {credits && !credits.devMode && (() => {
          const planCredits: Record<string, number> = { starter: 200, pro: 1000, business: 5000 };
          const monthlyCredits = planCredits[currentPlan?.slug || ''] || 75;
          const usedPercent = Math.round(((monthlyCredits - credits.balance) / monthlyCredits) * 100);
          const showBanner = credits.balance <= 0 || usedPercent >= 80;

          if (!showBanner) return null;

          const isEmpty = credits.balance <= 0;

          return (
            <div className={`card p-5 mb-8 ${isEmpty ? 'border-red-500/30 bg-gradient-to-r from-red-500/5 via-red-500/3 to-transparent' : 'border-amber-500/30 bg-gradient-to-r from-amber-500/5 to-transparent'}`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${isEmpty ? 'bg-red-500/10' : 'bg-amber-500/10'}`}>
                    <svg className={`w-5 h-5 ${isEmpty ? 'text-red-400' : 'text-amber-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className={`font-medium ${isEmpty ? 'text-red-400' : 'text-amber-400'}`}>
                      {isEmpty ? 'Credits exhausted' : 'Running low on credits'}
                    </h3>
                    <p className="text-sm text-[var(--text-secondary)]">
                      {isEmpty
                        ? 'Your chatbots have stopped responding. Buy credits to get back online.'
                        : `You have ${credits.balance} credits left (${100 - usedPercent}% remaining). Top up before they run out.`}
                    </p>
                  </div>
                </div>
                <Link
                  href="/pricing#credit-packs"
                  className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 font-medium rounded-lg transition-all flex-shrink-0 ${
                    isEmpty
                      ? 'bg-red-500 hover:bg-red-600 text-white'
                      : 'border border-amber-500/50 text-amber-400 hover:bg-amber-500/10'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Buy Credits
                </Link>
              </div>
            </div>
          );
        })()}

        {/* Contact Banner & API Key Section */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          {/* Contact Us Banner */}
          <div className="card p-5 border-primary-500/30 bg-gradient-to-br from-primary-500/5 to-transparent">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-primary-500/10 flex-shrink-0">
                <svg className="w-5 h-5 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-[var(--text-primary)] mb-1">Want full access?</h3>
                <p className="text-sm text-[var(--text-secondary)] mb-3">Contact us to unlock the full potential of Golum for your business.</p>
                <div className="space-y-1.5">
                  <a href="tel:7987401227" className="flex items-center gap-2 text-sm text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors">
                    <svg className="w-4 h-4 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    7987401227
                  </a>
                  <a href="tel:9303135537" className="flex items-center gap-2 text-sm text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors">
                    <svg className="w-4 h-4 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    9303135537
                  </a>
                  <a href="mailto:chetankush729@gmail.com" className="flex items-center gap-2 text-sm text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors">
                    <svg className="w-4 h-4 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    chetankush729@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* API Key Card */}
          <div className="card p-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="font-medium text-[var(--text-primary)] mb-1">API Key</h3>
                <p className="text-sm text-[var(--text-secondary)]">
                  Use this key to authenticate your widget
                </p>
              </div>
              <div className="flex items-center gap-2">
                <code className="px-3 py-2 bg-[var(--bg-tertiary)] rounded-lg text-sm font-mono text-[var(--text-primary)]">
                  {apiKey?.slice(0, 20)}...
                </code>
                <button
                  onClick={copyApiKey}
                  className="p-2 hover:bg-[var(--bg-tertiary)] rounded-lg transition-colors"
                >
                  {copied ? (
                    <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Assistants Section */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold text-[var(--text-primary)]">Assistants</h2>
            {assistantUsage && (
              <span className="px-2.5 py-1 text-xs font-medium bg-[var(--bg-tertiary)] text-[var(--text-secondary)] rounded-full">
                {assistantUsage.current}/{assistantUsage.limit === -1 ? '\u221e' : assistantUsage.limit}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            {assistantUsage && assistantUsage.limit !== -1 && assistantUsage.current >= assistantUsage.limit && (
              <span className="hidden sm:block text-sm text-[var(--text-secondary)]">
                Contact us to create more
              </span>
            )}
            <button
              onClick={() => setShowCreateModal(true)}
              disabled={assistantUsage !== null && assistantUsage.limit !== -1 && assistantUsage.current >= assistantUsage.limit}
              className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-all hover:shadow-lg hover:shadow-primary-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
            >
              {assistantUsage && assistantUsage.limit !== -1 && assistantUsage.current >= assistantUsage.limit
                ? `Limit Reached (${assistantUsage.current}/${assistantUsage.limit})`
                : 'Create Assistant'}
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : assistants.length === 0 ? (
          <div className="card p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-[var(--bg-tertiary)] rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-[var(--text-primary)] mb-2">No assistants yet</h3>
            <p className="text-[var(--text-secondary)] mb-6">Create your first AI assistant to get started</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-all"
            >
              Create Assistant
            </button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {assistants.map((assistant) => (
              <AssistantCard
                key={assistant.id}
                assistant={assistant}
                onUpdate={() => { loadAssistants(); loadPlan(); }}
                onCustomize={() => setShowCustomizeModal(assistant)}
                token={token!}
                modelMap={modelMap}
              />
            ))}
          </div>
        )}

        {/* Widget Code Section */}
        {assistants.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">Embed Widget</h2>
            <div className="card p-4 sm:p-6">
              {assistants.length > 1 && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                    Select Assistant for Embed Code
                  </label>
                  <select
                    value={selectedEmbedAssistant}
                    onChange={(e) => setSelectedEmbedAssistant(e.target.value)}
                    className="w-full max-w-xs px-4 py-2.5 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] text-sm"
                  >
                    <option value="">Default (first active)</option>
                    {assistants.map((a) => (
                      <option key={a.id} value={a.id}>{a.name}</option>
                    ))}
                  </select>
                </div>
              )}
              <p className="text-[var(--text-secondary)] mb-4">
                Add this code before the closing <code className="px-1.5 py-0.5 bg-[var(--bg-tertiary)] rounded text-sm">&lt;/body&gt;</code> tag:
              </p>
              <pre className="p-3 sm:p-4 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-xs sm:text-sm overflow-x-auto font-mono text-[var(--text-primary)]">
{(() => {
  const embedAssistant = selectedEmbedAssistant
    ? assistants.find(a => a.id === selectedEmbedAssistant)
    : assistants[0];
  const wc = embedAssistant?.widgetConfig;
  const configLines = [
    `    apiKey: '${apiKey}'`,
    `    apiUrl: '${process.env.NEXT_PUBLIC_API_URL || 'YOUR_API_URL_HERE'}'`,
  ];
  if (selectedEmbedAssistant) configLines.push(`    assistantId: '${selectedEmbedAssistant}'`);
  if (wc?.primaryColor) configLines.push(`    primaryColor: '${wc.primaryColor}'`);
  if (wc?.position) configLines.push(`    position: '${wc.position}'`);
  if (wc?.borderRadius) configLines.push(`    borderRadius: '${wc.borderRadius}'`);
  if (wc?.launcherIcon) configLines.push(`    launcherIcon: '${wc.launcherIcon}'`);
  if (wc?.launcherStyle) configLines.push(`    launcherStyle: '${wc.launcherStyle}'`);
  if (wc?.launcherColorScheme) configLines.push(`    launcherColorScheme: '${wc.launcherColorScheme}'`);
  return `<script>
  window.GOLUM_CONFIG = {
${configLines.join(',\n')}
  };
</script>
<script src="${process.env.NEXT_PUBLIC_WIDGET_URL || 'YOUR_WIDGET_URL_HERE'}/widget.js" async></script>`;
})()}
              </pre>
            </div>
          </div>
        )}
      </main>

      {/* Create Modal */}
      {showCreateModal && (
        <CreateAssistantModal
          token={token!}
          onClose={() => setShowCreateModal(false)}
          onCreated={() => {
            setShowCreateModal(false);
            loadAssistants();
            loadPlan();
          }}
        />
      )}

      {/* Customize Widget Modal */}
      {showCustomizeModal && (
        <CustomizeWidgetModal
          token={token!}
          assistant={showCustomizeModal}
          onClose={() => setShowCustomizeModal(null)}
          onSaved={() => {
            setShowCustomizeModal(null);
            loadAssistants();
          }}
        />
      )}
    </div>
  );
}

const MODEL_CREDIT_BADGE: Record<string, string> = {
  budget: 'bg-emerald-900/30 text-emerald-300',
  standard: 'bg-blue-900/30 text-blue-300',
  premium: 'bg-purple-900/30 text-purple-300',
  enterprise: 'bg-amber-900/30 text-amber-300',
};

function AssistantCard({
  assistant,
  onUpdate,
  onCustomize,
  token,
  modelMap,
}: {
  assistant: Assistant;
  onUpdate: () => void;
  onCustomize: () => void;
  token: string;
  modelMap: Record<string, { name: string; costPerMessage: number; category: string }>;
}) {
  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this assistant?')) return;
    try {
      await assistantsApi.delete(token, assistant.id);
      onUpdate();
    } catch (error) {
      console.error('Failed to delete assistant:', error);
    }
  };

  return (
    <div className="card p-5 hover:border-primary-500/50">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-500/10 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
          <div>
            <h3 className="font-medium text-[var(--text-primary)]">{assistant.name}</h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <p className="text-xs text-[var(--text-muted)]">{modelMap[assistant.model]?.name || assistant.model}</p>
              {modelMap[assistant.model] && (
                <span className={`px-1.5 py-0.5 text-[10px] font-medium rounded-full ${MODEL_CREDIT_BADGE[modelMap[assistant.model].category] || 'bg-zinc-800 text-zinc-400'}`}>
                  {modelMap[assistant.model].costPerMessage}cr/msg
                </span>
              )}
            </div>
          </div>
        </div>
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${
            assistant.isActive
              ? 'bg-green-900/30 text-green-400'
              : 'bg-zinc-800 text-zinc-400'
          }`}
        >
          {assistant.isActive ? 'Active' : 'Inactive'}
        </span>
      </div>
      {assistant.description && (
        <p className="text-sm text-[var(--text-secondary)] mb-3 line-clamp-2">{assistant.description}</p>
      )}
      {(assistant.bookingUrl || assistant.supportPhone || assistant.supportWhatsApp) && (
        <div className="flex flex-wrap items-center gap-3 mb-3 text-xs text-[var(--text-muted)]">
          {assistant.bookingUrl && (
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Booking</span>
            </div>
          )}
          {assistant.supportPhone && (
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span>Phone</span>
            </div>
          )}
          {assistant.supportWhatsApp && (
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              <span>WhatsApp</span>
            </div>
          )}
        </div>
      )}
      <div className="flex items-center justify-between pt-3 border-t border-[var(--border-color)]">
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="text-sm text-primary-500 hover:text-primary-600 font-medium"
          >
            Knowledge
          </Link>
          <button
            onClick={onCustomize}
            className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          >
            Customize
          </button>
        </div>
        <button
          onClick={handleDelete}
          className="text-sm text-red-500 hover:text-red-600"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

function CreateAssistantModal({
  token,
  onClose,
  onCreated,
}: {
  token: string;
  onClose: () => void;
  onCreated: () => void;
}) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    systemPrompt: 'You are a helpful assistant. Answer questions concisely and accurately.',
    bookingUrl: '',
    supportPhone: '',
    supportWhatsApp: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await assistantsApi.create(token, formData);
      onCreated();
    } catch (err: any) {
      setError(err.message || 'Failed to create assistant');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="card max-w-lg w-full p-4 sm:p-6 animate-fade-in max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-6">Create Assistant</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-900/20 border border-red-800 text-red-400 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2.5 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] placeholder-[var(--text-muted)]"
              placeholder="Customer Support"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Description</label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2.5 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] placeholder-[var(--text-muted)]"
              placeholder="Handles customer inquiries"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">System Prompt</label>
            <textarea
              required
              rows={4}
              value={formData.systemPrompt}
              onChange={(e) => setFormData({ ...formData, systemPrompt: e.target.value })}
              className="w-full px-4 py-2.5 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] placeholder-[var(--text-muted)] resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
              Booking Link <span className="text-[var(--text-muted)] font-normal">(optional)</span>
            </label>
            <input
              type="url"
              value={formData.bookingUrl}
              onChange={(e) => setFormData({ ...formData, bookingUrl: e.target.value })}
              className="w-full px-4 py-2.5 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] placeholder-[var(--text-muted)]"
              placeholder="https://calendly.com/your-link"
            />
            <p className="mt-1.5 text-xs text-[var(--text-muted)]">
              Calendly or other booking link. The assistant will share this when users show interest.
            </p>
          </div>

          {/* Contact Support Section */}
          <div className="pt-4 border-t border-[var(--border-color)]">
            <h4 className="text-sm font-medium text-[var(--text-primary)] mb-3">Direct Contact Options</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.supportPhone}
                  onChange={(e) => setFormData({ ...formData, supportPhone: e.target.value })}
                  className="w-full px-4 py-2.5 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] placeholder-[var(--text-muted)]"
                  placeholder="+1 234 567 8900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                  WhatsApp Number
                </label>
                <input
                  type="tel"
                  value={formData.supportWhatsApp}
                  onChange={(e) => setFormData({ ...formData, supportWhatsApp: e.target.value })}
                  className="w-full px-4 py-2.5 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] placeholder-[var(--text-muted)]"
                  placeholder="+1234567890"
                />
              </div>
            </div>
            <p className="mt-2 text-xs text-[var(--text-muted)]">
              Contact buttons will appear in the widget header. Include country code for WhatsApp.
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-all disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Launcher Icon SVGs
const LAUNCHER_ICONS: Record<string, React.ReactNode> = {
  chat: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  ),
  message: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  ),
  support: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="4" />
      <line x1="4.93" y1="4.93" x2="9.17" y2="9.17" />
      <line x1="14.83" y1="14.83" x2="19.07" y2="19.07" />
      <line x1="14.83" y1="9.17" x2="19.07" y2="4.93" />
      <line x1="4.93" y1="19.07" x2="9.17" y2="14.83" />
    </svg>
  ),
  bot: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="11" width="18" height="10" rx="2" />
      <circle cx="12" cy="5" r="2" />
      <path d="M12 7v4" />
      <circle cx="8" cy="16" r="1" fill="currentColor" />
      <circle cx="16" cy="16" r="1" fill="currentColor" />
    </svg>
  ),
  wave: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 8V6a2 2 0 1 0-4 0v2" />
      <path d="M14 8V4a2 2 0 1 0-4 0v4" />
      <path d="M10 8V6a2 2 0 1 0-4 0v2" />
      <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
    </svg>
  ),
  sparkle: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 3l1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5L12 3z" />
      <path d="M5 3l.5 2L3 5.5l2 .5.5 2 .5-2 2-.5-2-.5L5 3z" />
      <path d="M19 17l.5 2-2 .5 2 .5.5 2 .5-2 2-.5-2-.5-.5-2z" />
    </svg>
  ),
};

const COLOR_PRESETS = [
  '#0066FF', // Blue
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#EF4444', // Red
  '#F97316', // Orange
  '#EAB308', // Yellow
  '#22C55E', // Green
  '#06B6D4', // Cyan
  '#6366F1', // Indigo
  '#1F2937', // Dark
];

function CustomizeWidgetModal({
  token,
  assistant,
  onClose,
  onSaved,
}: {
  token: string;
  assistant: Assistant;
  onClose: () => void;
  onSaved: () => void;
}) {
  const defaultConfig: WidgetConfig = {
    primaryColor: '#0066FF',
    position: 'bottom-right',
    greeting: 'Hi! How can I help you today?',
    borderRadius: 'rounded',
    launcherIcon: 'chat',
    suggestions: [],
    launcherStyle: 'circle',
    launcherColorScheme: 'filled',
  };

  const [newSuggestion, setNewSuggestion] = useState('');
  const [contactInfo, setContactInfo] = useState({
    bookingUrl: assistant.bookingUrl || '',
    supportPhone: assistant.supportPhone || '',
    supportWhatsApp: assistant.supportWhatsApp || '',
  });

  const [config, setConfig] = useState<WidgetConfig>({
    ...defaultConfig,
    ...assistant.widgetConfig,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await assistantsApi.update(token, assistant.id, { widgetConfig: config, ...contactInfo });
      onSaved();
    } catch (err: any) {
      setError(err.message || 'Failed to save customization');
    } finally {
      setLoading(false);
    }
  };

  const getBorderRadiusPreview = (type: string) => {
    switch (type) {
      case 'sharp': return 'rounded-none';
      case 'rounded': return 'rounded-xl';
      case 'pill': return 'rounded-3xl';
      default: return 'rounded-xl';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="card max-w-2xl w-full p-4 sm:p-6 animate-fade-in max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-6">
          Customize Widget - {assistant.name}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 bg-red-900/20 border border-red-800 text-red-400 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Color Selection */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-3">
              Primary Color
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {COLOR_PRESETS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setConfig({ ...config, primaryColor: color })}
                  className={`w-10 h-10 rounded-lg border-2 transition-all ${
                    config.primaryColor === color
                      ? 'border-[var(--text-primary)] scale-110'
                      : 'border-transparent hover:scale-105'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={config.primaryColor}
                onChange={(e) => setConfig({ ...config, primaryColor: e.target.value })}
                className="w-10 h-10 rounded cursor-pointer"
              />
              <input
                type="text"
                value={config.primaryColor}
                onChange={(e) => setConfig({ ...config, primaryColor: e.target.value })}
                className="px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] font-mono text-sm w-28"
              />
            </div>
          </div>

          {/* Border Radius */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-3">
              Border Radius
            </label>
            <div className="flex gap-3">
              {(['sharp', 'rounded', 'pill'] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setConfig({ ...config, borderRadius: type })}
                  className={`flex-1 p-4 border-2 transition-all ${getBorderRadiusPreview(type)} ${
                    config.borderRadius === type
                      ? 'border-primary-500 bg-primary-500/10'
                      : 'border-[var(--border-color)] hover:border-[var(--text-muted)]'
                  }`}
                >
                  <div
                    className={`w-full h-8 bg-[var(--text-muted)] mb-2 ${
                      type === 'sharp' ? 'rounded-none' : type === 'rounded' ? 'rounded-lg' : 'rounded-full'
                    }`}
                  />
                  <span className="text-sm font-medium text-[var(--text-primary)] capitalize">{type}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Launcher Icon */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-3">
              Launcher Icon
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {(Object.keys(LAUNCHER_ICONS) as Array<keyof typeof LAUNCHER_ICONS>).map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setConfig({ ...config, launcherIcon: icon as WidgetConfig['launcherIcon'] })}
                  className={`p-4 border-2 rounded-xl flex flex-col items-center gap-2 transition-all ${
                    config.launcherIcon === icon
                      ? 'border-primary-500 bg-primary-500/10'
                      : 'border-[var(--border-color)] hover:border-[var(--text-muted)]'
                  }`}
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                    style={{ backgroundColor: config.primaryColor }}
                  >
                    {LAUNCHER_ICONS[icon]}
                  </div>
                  <span className="text-xs text-[var(--text-muted)] capitalize">{icon}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Launcher Shape */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-3">
              Launcher Shape
            </label>
            <div className="flex gap-3">
              {(['circle', 'pill'] as const).map((style) => (
                <button
                  key={style}
                  type="button"
                  onClick={() => setConfig({ ...config, launcherStyle: style })}
                  className={`flex-1 p-4 border-2 rounded-xl transition-all ${
                    (config.launcherStyle || 'circle') === style
                      ? 'border-primary-500 bg-primary-500/10'
                      : 'border-[var(--border-color)] hover:border-[var(--text-muted)]'
                  }`}
                >
                  <div className="flex items-center justify-center mb-2">
                    {style === 'circle' ? (
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: config.primaryColor }}>
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 px-4 py-2 rounded-full text-white text-xs font-medium" style={{ backgroundColor: config.primaryColor }}>
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                        {config.chatbotName || 'Chat'}
                      </div>
                    )}
                  </div>
                  <span className="text-sm font-medium text-[var(--text-primary)] capitalize">{style}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Launcher Color Scheme */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-3">
              Launcher Color Scheme
            </label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setConfig({ ...config, launcherColorScheme: 'filled' })}
                className={`flex-1 p-4 border-2 rounded-xl transition-all ${
                  (config.launcherColorScheme || 'filled') === 'filled'
                    ? 'border-primary-500 bg-primary-500/10'
                    : 'border-[var(--border-color)] hover:border-[var(--text-muted)]'
                }`}
              >
                <div className="flex items-center justify-center mb-2">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: config.primaryColor }}>
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                  </div>
                </div>
                <span className="text-sm font-medium text-[var(--text-primary)]">Filled</span>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">Colored bg, white icon</p>
              </button>
              <button
                type="button"
                onClick={() => setConfig({ ...config, launcherColorScheme: 'light' })}
                className={`flex-1 p-4 border-2 rounded-xl transition-all ${
                  (config.launcherColorScheme || 'filled') === 'light'
                    ? 'border-primary-500 bg-primary-500/10'
                    : 'border-[var(--border-color)] hover:border-[var(--text-muted)]'
                }`}
              >
                <div className="flex items-center justify-center mb-2">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-[#1a1a1a] bg-white border border-gray-200 shadow-sm">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                  </div>
                </div>
                <span className="text-sm font-medium text-[var(--text-primary)]">Light</span>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">White bg, dark icon</p>
              </button>
            </div>
          </div>

          {/* Position */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-3">
              Widget Position
            </label>
            <div className="flex gap-3">
              {(['bottom-right', 'bottom-left'] as const).map((pos) => (
                <button
                  key={pos}
                  type="button"
                  onClick={() => setConfig({ ...config, position: pos })}
                  className={`flex-1 p-4 border-2 rounded-xl transition-all ${
                    config.position === pos
                      ? 'border-primary-500 bg-primary-500/10'
                      : 'border-[var(--border-color)] hover:border-[var(--text-muted)]'
                  }`}
                >
                  <div className="relative w-full h-16 bg-[var(--bg-tertiary)] rounded-lg mb-2">
                    <div
                      className={`absolute bottom-2 w-4 h-4 rounded-full ${
                        pos === 'bottom-right' ? 'right-2' : 'left-2'
                      }`}
                      style={{ backgroundColor: config.primaryColor }}
                    />
                  </div>
                  <span className="text-sm font-medium text-[var(--text-primary)]">
                    {pos === 'bottom-right' ? 'Bottom Right' : 'Bottom Left'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Greeting Message */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
              Greeting Message
            </label>
            <input
              type="text"
              value={config.greeting}
              onChange={(e) => setConfig({ ...config, greeting: e.target.value })}
              className="w-full px-4 py-2.5 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] placeholder-[var(--text-muted)]"
              placeholder="Hi! How can I help you today?"
            />
          </div>

          {/* Chatbot Display Name */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
              Chatbot Display Name
            </label>
            <input
              type="text"
              value={config.chatbotName || ''}
              onChange={(e) => setConfig({ ...config, chatbotName: e.target.value })}
              className="w-full px-4 py-2.5 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] placeholder-[var(--text-muted)]"
              placeholder="Golum"
              maxLength={50}
            />
            <p className="mt-1.5 text-xs text-[var(--text-muted)]">
              Name shown in the widget header (max 50 chars). Defaults to &quot;Golum&quot;.
            </p>
          </div>

          {/* Custom Icon */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
              Custom Icon
            </label>
            <div className="space-y-3">
              <div>
                <input
                  type="url"
                  value={config.customIconUrl || ''}
                  onChange={(e) => setConfig({ ...config, customIconUrl: e.target.value })}
                  className="w-full px-4 py-2.5 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] placeholder-[var(--text-muted)]"
                  placeholder="https://example.com/icon.png"
                />
                <p className="mt-1.5 text-xs text-[var(--text-muted)]">
                  URL to a custom icon/logo for the launcher button.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <label className="px-4 py-2 bg-[var(--bg-tertiary)] hover:bg-[var(--border-color)] text-[var(--text-primary)] text-sm font-medium rounded-lg transition-colors cursor-pointer">
                  Upload Icon
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      if (file.size > 1024 * 1024) {
                        setError('Icon must be under 1MB');
                        return;
                      }
                      try {
                        const result = await assistantsApi.uploadIcon(token, assistant.id, file);
                        setConfig({ ...config, customIconUrl: result.data.iconUrl });
                      } catch (err: any) {
                        setError(err.message || 'Upload failed');
                      }
                    }}
                  />
                </label>
                {config.customIconUrl && (
                  <div className="flex items-center gap-2">
                    <img src={config.customIconUrl} alt="Icon preview" className="w-8 h-8 rounded-full object-cover border border-[var(--border-color)]" />
                    <button
                      type="button"
                      onClick={() => setConfig({ ...config, customIconUrl: '', customIconPath: '' })}
                      className="text-xs text-red-500 hover:text-red-600"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Reply Suggestions */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
              Quick Reply Suggestions
            </label>
            <p className="text-xs text-[var(--text-muted)] mb-3">
              Add up to 5 suggestion buttons that appear before the user sends their first message.
            </p>
            <div className="space-y-2 mb-3">
              {(config.suggestions || []).map((s, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="flex-1 px-3 py-2 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-lg text-sm text-[var(--text-primary)]">
                    {s}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const updated = [...(config.suggestions || [])];
                      updated.splice(i, 1);
                      setConfig({ ...config, suggestions: updated });
                    }}
                    className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
            {(config.suggestions || []).length < 5 && (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSuggestion}
                  onChange={(e) => setNewSuggestion(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      if (newSuggestion.trim()) {
                        setConfig({ ...config, suggestions: [...(config.suggestions || []), newSuggestion.trim()] });
                        setNewSuggestion('');
                      }
                    }
                  }}
                  placeholder="e.g. I need help with my setup"
                  className="flex-1 px-4 py-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] placeholder-[var(--text-muted)] text-sm"
                  maxLength={100}
                />
                <button
                  type="button"
                  onClick={() => {
                    if (newSuggestion.trim()) {
                      setConfig({ ...config, suggestions: [...(config.suggestions || []), newSuggestion.trim()] });
                      setNewSuggestion('');
                    }
                  }}
                  className="px-3 py-2 bg-[var(--bg-tertiary)] hover:bg-[var(--border-color)] text-[var(--text-primary)] text-sm font-medium rounded-lg transition-colors"
                >
                  Add
                </button>
              </div>
            )}
          </div>

          {/* Contact & Booking */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
              Contact &amp; Booking
            </label>
            <p className="text-xs text-[var(--text-muted)] mb-3">
              Add your contact details so the chatbot can offer booking, calls, and WhatsApp support.
            </p>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-[var(--text-muted)] mb-1">
                  Calendly / Booking URL
                </label>
                <input
                  type="url"
                  value={contactInfo.bookingUrl}
                  onChange={(e) => setContactInfo({ ...contactInfo, bookingUrl: e.target.value })}
                  className="w-full px-4 py-2.5 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] placeholder-[var(--text-muted)]"
                  placeholder="https://calendly.com/your-link"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--text-muted)] mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={contactInfo.supportPhone}
                  onChange={(e) => setContactInfo({ ...contactInfo, supportPhone: e.target.value })}
                  className="w-full px-4 py-2.5 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] placeholder-[var(--text-muted)]"
                  placeholder="+1 234 567 8900"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--text-muted)] mb-1">
                  WhatsApp Number
                </label>
                <input
                  type="tel"
                  value={contactInfo.supportWhatsApp}
                  onChange={(e) => setContactInfo({ ...contactInfo, supportWhatsApp: e.target.value })}
                  className="w-full px-4 py-2.5 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] placeholder-[var(--text-muted)]"
                  placeholder="+1 234 567 8900"
                />
              </div>
            </div>
          </div>

          {/* Live Preview */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-3">
              Preview
            </label>
            <div className="relative bg-[var(--bg-tertiary)] rounded-xl p-4 h-56 overflow-hidden">
              {/* Mini chat panel preview */}
              <div
                className={`absolute bottom-14 w-52 bg-zinc-800 shadow-lg overflow-hidden ${
                  config.position === 'bottom-right' ? 'right-4' : 'left-4'
                } ${
                  config.borderRadius === 'sharp' ? 'rounded-sm' : config.borderRadius === 'rounded' ? 'rounded-xl' : 'rounded-2xl'
                }`}
              >
                {/* Header */}
                <div className="px-3 py-2.5 border-b border-zinc-700 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-white block">Golum</span>
                    <span className="text-[10px] font-medium" style={{ color: config.primaryColor }}>The team can also help</span>
                  </div>
                  <div className="w-4 h-4 text-gray-400">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </div>
                </div>
                {/* Message bubble */}
                <div className="p-2.5">
                  <div
                    className={`inline-block px-2.5 py-1.5 text-[10px] bg-zinc-700 text-zinc-200 ${
                      config.borderRadius === 'sharp' ? 'rounded-sm' : config.borderRadius === 'rounded' ? 'rounded-lg' : 'rounded-2xl'
                    }`}
                  >
                    {config.greeting.slice(0, 28)}...
                  </div>
                </div>
                {/* Input preview */}
                <div className="px-2.5 pb-2.5">
                  <div className={`flex items-center justify-between border border-zinc-600 px-2 py-1.5 ${
                    config.borderRadius === 'sharp' ? 'rounded-sm' : config.borderRadius === 'rounded' ? 'rounded-lg' : 'rounded-xl'
                  }`}>
                    <span className="text-[10px] text-gray-400">Type a message...</span>
                    <div
                      className={`w-5 h-5 flex items-center justify-center text-white ${
                        config.borderRadius === 'sharp' ? 'rounded-sm' : 'rounded-full'
                      }`}
                      style={{ backgroundColor: config.primaryColor }}
                    >
                      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Launcher button preview */}
              {(config.launcherStyle || 'circle') === 'pill' ? (
                <div
                  className={`absolute bottom-3 flex items-center gap-1.5 px-3 py-2 shadow-lg ${
                    config.position === 'bottom-right' ? 'right-4' : 'left-4'
                  } ${
                    config.borderRadius === 'sharp' ? 'rounded-lg' : 'rounded-full'
                  } ${
                    (config.launcherColorScheme || 'filled') === 'light'
                      ? 'bg-white text-[#1a1a1a] border border-gray-200'
                      : 'text-white'
                  }`}
                  style={(config.launcherColorScheme || 'filled') === 'filled' ? { backgroundColor: config.primaryColor } : undefined}
                >
                  <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                    {LAUNCHER_ICONS[config.launcherIcon]}
                  </div>
                  <span className="text-[10px] font-semibold whitespace-nowrap">{config.chatbotName || 'Chat'}</span>
                </div>
              ) : (
                <div
                  className={`absolute bottom-3 w-10 h-10 flex items-center justify-center shadow-lg ${
                    config.position === 'bottom-right' ? 'right-4' : 'left-4'
                  } ${
                    config.borderRadius === 'sharp' ? 'rounded-lg' : 'rounded-full'
                  } ${
                    (config.launcherColorScheme || 'filled') === 'light'
                      ? 'bg-white text-[#1a1a1a] border border-gray-200'
                      : 'text-white'
                  }`}
                  style={(config.launcherColorScheme || 'filled') === 'filled' ? { backgroundColor: config.primaryColor } : undefined}
                >
                  {LAUNCHER_ICONS[config.launcherIcon]}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-[var(--border-color)]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-all disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

