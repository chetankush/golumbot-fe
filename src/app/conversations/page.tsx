'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store';
import { conversationsApi } from '@/lib/api';
import { ThemeToggle } from '@/components/ThemeProvider';
import { GolumIcon } from '@/components/Logo';

interface ConversationItem {
  id: string;
  visitorId: string;
  assistantName: string;
  messageCount: number;
  lastMessage: { content: string; role: string; createdAt: string } | null;
  hasSummary: boolean;
  summaryPreview: string | null;
  createdAt: string;
  updatedAt: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface ConversationDetail {
  id: string;
  visitorId: string;
  assistant: { name: string };
  messages: Array<{ id: string; role: string; content: string; createdAt: string }>;
  summary?: { summary: string; messageCount: number; generatedAt: string } | null;
}

export default function ConversationsPage() {
  const router = useRouter();
  const { isAuthenticated, tenant, token, logout } = useAuthStore();
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 20, total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [expandedConvo, setExpandedConvo] = useState<ConversationDetail | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [summaryUsage, setSummaryUsage] = useState<{ used: number; limit: number; planName: string } | null>(null);
  const [summarizing, setSummarizing] = useState<string | null>(null);
  const [bulkSummarizing, setBulkSummarizing] = useState(false);
  const [showToast, setShowToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Auto-dismiss toasts
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    loadConversations(1);
    loadSummaryUsage();
  }, [isAuthenticated, router]);

  const loadConversations = async (page: number) => {
    if (!token) return;
    setLoading(true);
    try {
      const response = await conversationsApi.list(token, page);
      setConversations(response.data.conversations);
      setPagination(response.data.pagination);
    } catch (error: any) {
      if (error.message?.includes('session has expired')) {
        logout();
        router.push('/login');
        return;
      }
      console.error('Failed to load conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSummaryUsage = async () => {
    if (!token) return;
    try {
      const response = await conversationsApi.getSummaryUsage(token);
      setSummaryUsage(response.data);
    } catch {}
  };

  const expandConversation = async (id: string) => {
    if (expandedId === id) {
      setExpandedId(null);
      setExpandedConvo(null);
      return;
    }
    setExpandedId(id);
    setLoadingDetail(true);
    try {
      const response = await conversationsApi.get(token!, id);
      setExpandedConvo(response.data.conversation);
    } catch (error) {
      console.error('Failed to load conversation:', error);
    } finally {
      setLoadingDetail(false);
    }
  };

  const deleteConversation = async (id: string) => {
    if (!confirm('Delete this conversation? This cannot be undone.')) return;
    try {
      await conversationsApi.delete(token!, id);
      setConversations(prev => prev.filter(c => c.id !== id));
      if (expandedId === id) {
        setExpandedId(null);
        setExpandedConvo(null);
      }
      setShowToast({ type: 'success', message: 'Conversation deleted' });
    } catch (error: any) {
      setShowToast({ type: 'error', message: error.message || 'Failed to delete conversation' });
    }
  };

  const summarizeConversation = async (id: string) => {
    setSummarizing(id);
    try {
      const response = await conversationsApi.generateSummary(token!, id);
      // Update the conversation in list
      setConversations(prev => prev.map(c =>
        c.id === id ? { ...c, hasSummary: true, summaryPreview: response.data.summary.summary.slice(0, 100) } : c
      ));
      // Update expanded view if open
      if (expandedConvo && expandedConvo.id === id) {
        setExpandedConvo({ ...expandedConvo, summary: response.data.summary });
      }
      loadSummaryUsage();
      setShowToast({ type: 'success', message: response.data.cached ? 'Summary loaded' : 'Summary generated successfully' });
    } catch (error: any) {
      setShowToast({ type: 'error', message: error.message || 'Failed to generate summary' });
    } finally {
      setSummarizing(null);
    }
  };

  const bulkSummarize = async () => {
    setBulkSummarizing(true);
    try {
      const response = await conversationsApi.bulkSummarize(token!);
      loadConversations(pagination.page);
      loadSummaryUsage();
      setShowToast({ type: 'success', message: `${response.data.generated} summaries generated successfully` });
    } catch (error: any) {
      setShowToast({ type: 'error', message: error.message || 'Failed to generate summaries' });
    } finally {
      setBulkSummarizing(false);
    }
  };

  const timeAgo = (dateStr: string) => {
    const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen">
      {/* Toast */}
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
              <Link href="/conversations" className="px-3 py-1.5 text-sm font-medium text-[var(--text-primary)] bg-[var(--bg-tertiary)] rounded-lg">
                Conversations
              </Link>
              <Link href="/models" className="px-3 py-1.5 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors">
                Models
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:block text-sm text-[var(--text-muted)]">{tenant?.name}</span>
            <ThemeToggle />
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
            <Link href="/conversations" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-sm font-medium text-[var(--text-primary)] bg-[var(--bg-tertiary)] rounded-lg mb-1">Conversations</Link>
            <Link href="/models" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors">Models</Link>
          </div>
        )}
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 animate-fade-in">
        {/* Page Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div>
            <h1 className="text-xl font-semibold text-[var(--text-primary)]">Conversations</h1>
            <p className="text-[var(--text-secondary)] mt-1">View and manage all chat conversations</p>
          </div>
          <div className="flex items-center gap-3">
            {summaryUsage && (
              <span className="px-3 py-1.5 text-xs font-medium bg-[var(--bg-tertiary)] rounded-full text-[var(--text-secondary)]">
                Summaries: {summaryUsage.used}/{summaryUsage.limit}
              </span>
            )}
            <button
              onClick={bulkSummarize}
              disabled={bulkSummarizing}
              className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-all disabled:opacity-50 text-sm"
            >
              {bulkSummarizing ? 'Summarizing...' : 'Summarize All'}
            </button>
          </div>
        </div>

        {/* Conversations List */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : conversations.length === 0 ? (
          <div className="card p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-[var(--bg-tertiary)] rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-[var(--text-primary)] mb-2">No conversations yet</h3>
            <p className="text-[var(--text-secondary)]">Conversations will appear here when visitors chat with your widget</p>
          </div>
        ) : (
          <div className="space-y-3">
            {conversations.map((convo) => (
              <div key={convo.id} className="card overflow-hidden">
                {/* Row */}
                <div
                  onClick={() => expandConversation(convo.id)}
                  className="p-4 flex items-center gap-4 cursor-pointer hover:bg-[var(--bg-tertiary)]/50 transition-colors"
                >
                  <div className="w-10 h-10 bg-primary-500/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-[var(--text-primary)]">
                        {convo.visitorId.slice(0, 12)}...
                      </span>
                      <span className="px-2 py-0.5 text-xs bg-[var(--bg-tertiary)] rounded-full text-[var(--text-muted)]">
                        {convo.assistantName}
                      </span>
                      {convo.hasSummary && (
                        <span className="px-2 py-0.5 text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full">
                          Summarized
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-[var(--text-secondary)] truncate">
                      {convo.lastMessage?.content || 'No messages'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
                    <span className="hidden sm:inline text-xs text-[var(--text-muted)]">{convo.messageCount} msgs</span>
                    <span className="text-xs text-[var(--text-muted)]">{timeAgo(convo.updatedAt)}</span>
                    <button
                      onClick={(e) => { e.stopPropagation(); summarizeConversation(convo.id); }}
                      disabled={summarizing === convo.id}
                      className="px-3 py-1 text-xs font-medium text-primary-500 hover:bg-primary-500/10 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {summarizing === convo.id ? '...' : 'Summarize'}
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteConversation(convo.id); }}
                      className="p-1.5 text-[var(--text-muted)] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                    <svg className={`w-4 h-4 text-[var(--text-muted)] transition-transform ${expandedId === convo.id ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                {/* Expanded Detail */}
                {expandedId === convo.id && (
                  <div className="border-t border-[var(--border-color)] bg-[var(--bg-tertiary)]/30">
                    {/* Summary card */}
                    {expandedConvo?.summary && (
                      <div className="mx-4 mt-4 p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl">
                        <div className="flex items-center gap-2 mb-2">
                          <svg className="w-4 h-4 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <span className="text-sm font-medium text-purple-700 dark:text-purple-300">AI Summary</span>
                        </div>
                        <p className="text-sm text-purple-900 dark:text-purple-100">{expandedConvo.summary.summary}</p>
                      </div>
                    )}

                    {loadingDetail ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    ) : expandedConvo ? (
                      <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
                        {expandedConvo.messages.map((msg) => (
                          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${
                              msg.role === 'user'
                                ? 'bg-primary-500 text-white'
                                : 'bg-[var(--bg-secondary)] text-[var(--text-primary)] border border-[var(--border-color)]'
                            }`}>
                              <p className="whitespace-pre-wrap">{msg.content}</p>
                              <p className={`text-[10px] mt-1 ${msg.role === 'user' ? 'text-white/60' : 'text-[var(--text-muted)]'}`}>
                                {new Date(msg.createdAt).toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <button
              onClick={() => loadConversations(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="px-3 py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-sm text-[var(--text-muted)]">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <button
              onClick={() => loadConversations(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
              className="px-3 py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
