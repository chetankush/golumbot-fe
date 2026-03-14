'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store';
import { analyticsApi, exportApi, assistantsApi } from '@/lib/api';
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

interface MissedQuestion {
  question: string;
  count: number;
}

interface TrainingSuggestion {
  question: string;
  frequency: number;
}

interface VisitorData {
  uniqueVisitors: number;
  returningVisitors: number;
  avgConversationsPerVisitor: number;
}

export default function AnalyticsPage() {
  const router = useRouter();
  const { isAuthenticated, tenant, token, logout } = useAuthStore();
  const [overview, setOverview] = useState<Overview | null>(null);
  const [convosOverTime, setConvosOverTime] = useState<DataPoint[]>([]);
  const [busiestHours, setBusiestHours] = useState<HourData[]>([]);
  const [topQuestions, setTopQuestions] = useState<QuestionData[]>([]);
  const [missedQuestions, setMissedQuestions] = useState<MissedQuestion[]>([]);
  const [trainingSuggestions, setTrainingSuggestions] = useState<TrainingSuggestion[]>([]);
  const [visitorData, setVisitorData] = useState<VisitorData | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('30d');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'missed' | 'training'>('overview');

  // Training suggestion state
  const [answerInput, setAnswerInput] = useState<Record<string, string>>({});
  const [assistants, setAssistants] = useState<Array<{ id: string; name: string }>>([]);
  const [selectedAssistant, setSelectedAssistant] = useState('');
  const [addingAnswer, setAddingAnswer] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    loadAnalytics();
    loadAssistants();
  }, [isAuthenticated, router, period]);

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const loadAssistants = async () => {
    if (!token) return;
    try {
      const res = await assistantsApi.list(token);
      const list = res.data.assistants || [];
      setAssistants(list.map((a: any) => ({ id: a.id, name: a.name })));
      if (list.length > 0 && !selectedAssistant) {
        setSelectedAssistant(list[0].id);
      }
    } catch {}
  };

  const loadAnalytics = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [overviewRes, convosRes, hoursRes, questionsRes, missedRes, trainRes, visitorRes] = await Promise.all([
        analyticsApi.overview(token, period),
        analyticsApi.conversationsOverTime(token, period),
        analyticsApi.busiestHours(token),
        analyticsApi.topQuestions(token),
        analyticsApi.missedQuestions(token, period).catch(() => ({ data: { missedQuestions: [] } })),
        analyticsApi.trainingSuggestions(token).catch(() => ({ data: { suggestions: [] } })),
        analyticsApi.visitors(token, period).catch(() => ({ data: { uniqueVisitors: 0, returningVisitors: 0, avgConversationsPerVisitor: 0 } })),
      ]);
      setOverview(overviewRes.data);
      setConvosOverTime(convosRes.data.dataPoints);
      setBusiestHours(hoursRes.data.hours);
      setTopQuestions(questionsRes.data.questions);
      setMissedQuestions(missedRes.data.missedQuestions || []);
      setTrainingSuggestions(trainRes.data.suggestions || []);
      setVisitorData(visitorRes.data);
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

  const handleAddAnswer = async (question: string) => {
    if (!token || !selectedAssistant) return;
    const answer = answerInput[question];
    if (!answer?.trim()) return;

    setAddingAnswer(question);
    try {
      await analyticsApi.addTrainingAnswer(token, {
        question,
        answer: answer.trim(),
        assistantId: selectedAssistant,
      });
      setToast({ type: 'success', message: 'Answer added to knowledge base' });
      setAnswerInput(prev => ({ ...prev, [question]: '' }));
      // Refresh suggestions
      const trainRes = await analyticsApi.trainingSuggestions(token);
      setTrainingSuggestions(trainRes.data.suggestions || []);
    } catch (error: any) {
      setToast({ type: 'error', message: error.message || 'Failed to add answer' });
    } finally {
      setAddingAnswer(null);
    }
  };

  const handleExport = async (type: 'conversations' | 'leads') => {
    if (!token) return;
    try {
      const url = type === 'conversations'
        ? exportApi.downloadConversations()
        : exportApi.downloadLeads();
      const headers = exportApi.getExportHeaders(token);

      const response = await fetch(url, { headers });
      if (!response.ok) throw new Error('Export failed');

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `${type}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(downloadUrl);
      setToast({ type: 'success', message: `${type} exported successfully` });
    } catch {
      setToast({ type: 'error', message: 'Export failed. Please try again.' });
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
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-2.5 rounded-lg text-sm font-medium shadow-lg transition-all ${
          toast.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
        }`}>
          {toast.message}
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
            {/* Export Buttons */}
            <button
              onClick={() => handleExport('conversations')}
              className="px-3 py-1.5 text-xs font-medium rounded-full bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              Export Chats
            </button>
            <button
              onClick={() => handleExport('leads')}
              className="px-3 py-1.5 text-xs font-medium rounded-full bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              Export Leads
            </button>
            <div className="w-px h-5 bg-[var(--border-color)]" />
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

        {/* Tabs */}
        <div className="flex items-center gap-1 mb-6 border-b border-[var(--border-color)]">
          {([
            { key: 'overview', label: 'Overview' },
            { key: 'missed', label: `Missed Questions${missedQuestions.length > 0 ? ` (${missedQuestions.length})` : ''}` },
            { key: 'training', label: `AI Training${trainingSuggestions.length > 0 ? ` (${trainingSuggestions.length})` : ''}` },
          ] as const).map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
                activeTab === tab.key
                  ? 'border-[var(--text-primary)] text-[var(--text-primary)]'
                  : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-6 h-6 border-2 border-[var(--text-muted)] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* ===== OVERVIEW TAB ===== */}
            {activeTab === 'overview' && (
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

                {/* Visitor Tracking Cards */}
                {visitorData && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
                    <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-4">
                      <p className="text-2xl font-bold text-purple-600">{visitorData.uniqueVisitors}</p>
                      <p className="text-xs text-[var(--text-muted)] mt-1">Unique Visitors</p>
                    </div>
                    <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-4">
                      <p className="text-2xl font-bold text-amber-600">{visitorData.returningVisitors}</p>
                      <p className="text-xs text-[var(--text-muted)] mt-1">Returning Visitors</p>
                    </div>
                    <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-4">
                      <p className="text-2xl font-bold text-[var(--text-primary)]">{visitorData.avgConversationsPerVisitor}</p>
                      <p className="text-xs text-[var(--text-muted)] mt-1">Avg Chats / Visitor</p>
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

            {/* ===== MISSED QUESTIONS TAB ===== */}
            {activeTab === 'missed' && (
              <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-sm font-semibold text-[var(--text-primary)]">Missed Questions</h2>
                    <p className="text-xs text-[var(--text-muted)] mt-1">Questions your AI could not answer from the knowledge base</p>
                  </div>
                </div>
                {missedQuestions.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-3">
                      <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-sm font-medium text-[var(--text-primary)]">No missed questions</p>
                    <p className="text-xs text-[var(--text-muted)] mt-1">Your AI is answering all questions from the knowledge base</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {missedQuestions.map((q, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 bg-[var(--bg-primary)] rounded-lg border border-[var(--border-color)]">
                        <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-bold text-red-600">{q.count}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-[var(--text-primary)] leading-snug">{q.question}</p>
                          <p className="text-xs text-[var(--text-muted)] mt-1">Asked {q.count} time{q.count !== 1 ? 's' : ''} without a good answer</p>
                        </div>
                        <button
                          onClick={() => {
                            setActiveTab('training');
                            setAnswerInput(prev => ({ ...prev, [q.question]: '' }));
                          }}
                          className="text-xs font-medium text-blue-600 hover:text-blue-700 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors flex-shrink-0"
                        >
                          Add Answer
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ===== AI TRAINING TAB ===== */}
            {activeTab === 'training' && (
              <div className="space-y-6">
                {/* Assistant Selector */}
                {assistants.length > 1 && (
                  <div className="flex items-center gap-3">
                    <label className="text-sm text-[var(--text-secondary)]">Add answers to:</label>
                    <select
                      value={selectedAssistant}
                      onChange={e => setSelectedAssistant(e.target.value)}
                      className="px-3 py-1.5 text-sm rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] text-[var(--text-primary)]"
                    >
                      {assistants.map(a => (
                        <option key={a.id} value={a.id}>{a.name}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-5">
                  <div className="mb-4">
                    <h2 className="text-sm font-semibold text-[var(--text-primary)]">AI Training Suggestions</h2>
                    <p className="text-xs text-[var(--text-muted)] mt-1">
                      Questions visitors asked repeatedly that your AI couldn&apos;t answer. Add answers to improve your chatbot.
                    </p>
                  </div>

                  {trainingSuggestions.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3">
                        <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                      </div>
                      <p className="text-sm font-medium text-[var(--text-primary)]">No training suggestions yet</p>
                      <p className="text-xs text-[var(--text-muted)] mt-1">Suggestions appear when visitors repeatedly ask questions your AI can&apos;t answer</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {trainingSuggestions.map((s, i) => (
                        <div key={i} className="p-4 bg-[var(--bg-primary)] rounded-lg border border-[var(--border-color)]">
                          <div className="flex items-start justify-between gap-3 mb-3">
                            <div>
                              <p className="text-sm font-medium text-[var(--text-primary)]">{s.question}</p>
                              <p className="text-xs text-amber-600 mt-1">Asked {s.frequency} times without a good answer</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder="Type an answer for this question..."
                              value={answerInput[s.question] || ''}
                              onChange={e => setAnswerInput(prev => ({ ...prev, [s.question]: e.target.value }))}
                              className="flex-1 px-3 py-2 text-sm rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-1 focus:ring-blue-500"
                              onKeyDown={e => {
                                if (e.key === 'Enter') handleAddAnswer(s.question);
                              }}
                            />
                            <button
                              onClick={() => handleAddAnswer(s.question)}
                              disabled={!answerInput[s.question]?.trim() || addingAnswer === s.question || !selectedAssistant}
                              className="px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                              {addingAnswer === s.question ? (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              ) : (
                                'Add'
                              )}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
