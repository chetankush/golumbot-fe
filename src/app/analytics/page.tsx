'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store';
import { analyticsApi } from '@/lib/api';
import { GolumIcon } from '@/components/Logo';

interface Overview {
  totalConversations: number;
  totalMessages: number;
  totalLeads: number;
  creditsUsed: number;
  period: string;
}

interface DataPoint {
  date: string;
  count: number;
}

interface HourData {
  hour: number;
  count: number;
}

interface QuestionData {
  text: string;
  count: number;
}

export default function AnalyticsPage() {
  const router = useRouter();
  const { isAuthenticated, tenant, token, logout } = useAuthStore();
  const [overview, setOverview] = useState<Overview | null>(null);
  const [convosOverTime, setConvosOverTime] = useState<DataPoint[]>([]);
  const [busiestHours, setBusiestHours] = useState<HourData[]>([]);
  const [topQuestions, setTopQuestions] = useState<QuestionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('30d');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    loadAnalytics();
  }, [isAuthenticated, router, period]);

  const loadAnalytics = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [overviewRes, convosRes, hoursRes, questionsRes] = await Promise.all([
        analyticsApi.overview(token, period),
        analyticsApi.conversationsOverTime(token, period),
        analyticsApi.busiestHours(token),
        analyticsApi.topQuestions(token),
      ]);
      setOverview(overviewRes.data);
      setConvosOverTime(convosRes.data.dataPoints);
      setBusiestHours(hoursRes.data.hours);
      setTopQuestions(questionsRes.data.questions);
    } catch (error: any) {
      if (error.message?.includes('session has expired')) {
        logout();
        router.push('/login');
        return;
      }
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const maxConvoCount = Math.max(...convosOverTime.map(d => d.count), 1);
  const maxHourCount = Math.max(...busiestHours.map(d => d.count), 1);

  // Fill in all 24 hours
  const allHours = Array.from({ length: 24 }, (_, i) => {
    const found = busiestHours.find(h => h.hour === i);
    return { hour: i, count: found?.count || 0 };
  });

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-[var(--bg-secondary)]/95 backdrop-blur-sm border-b border-[var(--border-color)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 text-lg font-semibold text-[var(--text-primary)]">
              <GolumIcon size={24} />
              Golum
            </Link>
            <nav className="hidden md:flex items-center gap-1">
              <Link href="/dashboard" className="px-3 py-1.5 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors">
                Assistants
              </Link>
              <Link href="/admin" className="px-3 py-1.5 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors">
                Knowledge Base
              </Link>
              <Link href="/conversations" className="px-3 py-1.5 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors">
                Conversations
              </Link>
              <Link href="/leads" className="px-3 py-1.5 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors">
                Leads
              </Link>
              <Link href="/analytics" className="px-3 py-1.5 text-sm font-medium text-[var(--text-primary)] bg-[var(--bg-tertiary)] rounded-lg">
                Analytics
              </Link>
              <Link href="/models" className="px-3 py-1.5 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors">
                Models
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:block text-sm text-[var(--text-muted)]">{tenant?.name}</span>
            <button onClick={() => { logout(); router.push('/login'); }} className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
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
            <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors mb-1">Assistants</Link>
            <Link href="/admin" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors mb-1">Knowledge Base</Link>
            <Link href="/conversations" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors mb-1">Conversations</Link>
            <Link href="/leads" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors mb-1">Leads</Link>
            <Link href="/analytics" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-sm font-medium text-[var(--text-primary)] bg-[var(--bg-tertiary)] rounded-lg mb-1">Analytics</Link>
            <Link href="/models" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors">Models</Link>
          </div>
        )}
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 animate-fade-in">
        {/* Page Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div>
            <h1 className="text-xl font-semibold text-[var(--text-primary)]">Analytics</h1>
            <p className="text-[var(--text-secondary)] mt-1">See how your chatbot is performing</p>
          </div>
          <div className="flex items-center gap-2">
            {['7d', '30d', '90d'].map(p => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
                  period === p ? 'bg-[var(--text-primary)] text-[var(--bg-primary)]' : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                {p === '7d' ? '7 days' : p === '30d' ? '30 days' : '90 days'}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-6 h-6 border-2 border-[var(--text-muted)] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* Overview Cards */}
            {overview && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-4">
                  <p className="text-2xl font-bold text-[var(--text-primary)]">{overview.totalConversations}</p>
                  <p className="text-xs text-[var(--text-muted)] mt-1">Conversations</p>
                </div>
                <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-4">
                  <p className="text-2xl font-bold text-[var(--text-primary)]">{overview.totalMessages}</p>
                  <p className="text-xs text-[var(--text-muted)] mt-1">Messages</p>
                </div>
                <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-4">
                  <p className="text-2xl font-bold text-blue-600">{overview.totalLeads}</p>
                  <p className="text-xs text-[var(--text-muted)] mt-1">Leads Captured</p>
                </div>
                <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-4">
                  <p className="text-2xl font-bold text-[var(--text-primary)]">{overview.creditsUsed}</p>
                  <p className="text-xs text-[var(--text-muted)] mt-1">Credits Used</p>
                </div>
              </div>
            )}

            {/* Conversations Over Time */}
            <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-5 mb-6">
              <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-4">Conversations Over Time</h2>
              {convosOverTime.length === 0 ? (
                <p className="text-sm text-[var(--text-muted)] text-center py-8">No conversation data yet</p>
              ) : (
                <div className="flex items-end gap-[2px] h-40">
                  {convosOverTime.map((d, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center justify-end group relative">
                      <div
                        className="w-full bg-blue-500 rounded-t-sm min-h-[2px] transition-all hover:bg-blue-600"
                        style={{ height: `${Math.max((d.count / maxConvoCount) * 100, 2)}%` }}
                      />
                      {/* Tooltip */}
                      <div className="absolute bottom-full mb-2 hidden group-hover:block bg-[var(--text-primary)] text-[var(--bg-primary)] text-xs px-2 py-1 rounded whitespace-nowrap z-10">
                        {d.date}: {d.count}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Busiest Hours */}
              <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-5">
                <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-4">Busiest Hours</h2>
                <div className="flex items-end gap-[2px] h-32">
                  {allHours.map((d) => (
                    <div key={d.hour} className="flex-1 flex flex-col items-center justify-end group relative">
                      <div
                        className="w-full bg-emerald-500 rounded-t-sm min-h-[2px] transition-all hover:bg-emerald-600"
                        style={{ height: `${Math.max((d.count / maxHourCount) * 100, 2)}%` }}
                      />
                      <div className="absolute bottom-full mb-2 hidden group-hover:block bg-[var(--text-primary)] text-[var(--bg-primary)] text-xs px-2 py-1 rounded whitespace-nowrap z-10">
                        {d.hour}:00 — {d.count} msgs
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-[10px] text-[var(--text-muted)]">12am</span>
                  <span className="text-[10px] text-[var(--text-muted)]">6am</span>
                  <span className="text-[10px] text-[var(--text-muted)]">12pm</span>
                  <span className="text-[10px] text-[var(--text-muted)]">6pm</span>
                  <span className="text-[10px] text-[var(--text-muted)]">11pm</span>
                </div>
              </div>

              {/* Top Questions */}
              <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-5">
                <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-4">Most Asked Questions</h2>
                {topQuestions.length === 0 ? (
                  <p className="text-sm text-[var(--text-muted)] text-center py-8">No questions yet</p>
                ) : (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {topQuestions.slice(0, 10).map((q, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <span className="text-xs font-bold text-[var(--text-muted)] w-5 flex-shrink-0 mt-0.5">{i + 1}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-[var(--text-primary)] leading-snug">{q.text}</p>
                        </div>
                        <span className="text-xs text-[var(--text-muted)] bg-[var(--bg-tertiary)] px-2 py-0.5 rounded-full flex-shrink-0">{q.count}x</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
