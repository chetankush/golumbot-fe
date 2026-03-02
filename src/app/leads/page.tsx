'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store';
import { leadsApi } from '@/lib/api';
import { GolumIcon } from '@/components/Logo';

interface LeadItem {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  source: string;
  status: string;
  assistantName: string;
  metadata: any;
  createdAt: string;
  updatedAt: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface LeadStats {
  total: number;
  newThisWeek: number;
  newToday: number;
  pendingReview: number;
}

const STATUS_COLORS: Record<string, string> = {
  new: 'bg-blue-100 text-blue-700',
  contacted: 'bg-yellow-100 text-yellow-700',
  converted: 'bg-green-100 text-green-700',
  archived: 'bg-gray-100 text-gray-500',
};

const STATUS_OPTIONS = ['new', 'contacted', 'converted', 'archived'];

export default function LeadsPage() {
  const router = useRouter();
  const { isAuthenticated, tenant, token, logout } = useAuthStore();
  const [leads, setLeads] = useState<LeadItem[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 20, total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<LeadStats | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [expandedLead, setExpandedLead] = useState<any>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [showToast, setShowToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    loadLeads(1);
    loadStats();
  }, [isAuthenticated, router]);

  const loadLeads = async (page: number) => {
    if (!token) return;
    setLoading(true);
    try {
      const response = await leadsApi.list(token, page, 20, filterStatus || undefined);
      setLeads(response.data.leads);
      setPagination(response.data.pagination);
    } catch (error: any) {
      if (error.message?.includes('session has expired')) {
        logout();
        router.push('/login');
        return;
      }
      console.error('Failed to load leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    if (!token) return;
    try {
      const response = await leadsApi.stats(token);
      setStats(response.data);
    } catch {}
  };

  useEffect(() => {
    if (isAuthenticated) loadLeads(1);
  }, [filterStatus]);

  const expandLead = async (id: string) => {
    if (expandedId === id) {
      setExpandedId(null);
      setExpandedLead(null);
      return;
    }
    setExpandedId(id);
    setLoadingDetail(true);
    try {
      const response = await leadsApi.get(token!, id);
      setExpandedLead(response.data.lead);
    } catch {
      setShowToast({ type: 'error', message: 'Failed to load lead details' });
    } finally {
      setLoadingDetail(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    if (!token) return;
    try {
      await leadsApi.updateStatus(token, id, status);
      setLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l));
      loadStats();
      setShowToast({ type: 'success', message: `Lead marked as ${status}` });
    } catch {
      setShowToast({ type: 'error', message: 'Failed to update lead status' });
    }
  };

  const deleteLead = async (id: string) => {
    if (!token) return;
    try {
      await leadsApi.delete(token, id);
      setLeads(prev => prev.filter(l => l.id !== id));
      setPagination(prev => ({ ...prev, total: prev.total - 1 }));
      setExpandedId(null);
      setExpandedLead(null);
      loadStats();
      setShowToast({ type: 'success', message: 'Lead deleted' });
    } catch {
      setShowToast({ type: 'error', message: 'Failed to delete lead' });
    }
  };

  const formatDate = (d: string) => {
    const date = new Date(d);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    if (diff < 604800000) return `${Math.floor(diff / 86400000)}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Toast */}
      {showToast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 text-sm font-medium animate-fade-in ${
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
              <Link href="/dashboard" className="px-3 py-1.5 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors">
                Assistants
              </Link>
              <Link href="/admin" className="px-3 py-1.5 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors">
                Knowledge Base
              </Link>
              <Link href="/conversations" className="px-3 py-1.5 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors">
                Conversations
              </Link>
              <Link href="/leads" className="px-3 py-1.5 text-sm font-medium text-[var(--text-primary)] bg-[var(--bg-tertiary)] rounded-lg">
                Leads
              </Link>
              <Link href="/analytics" className="px-3 py-1.5 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors">
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
            <Link href="/leads" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-sm font-medium text-[var(--text-primary)] bg-[var(--bg-tertiary)] rounded-lg mb-1">Leads</Link>
            <Link href="/analytics" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors mb-1">Analytics</Link>
            <Link href="/models" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors">Models</Link>
          </div>
        )}
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 animate-fade-in">
        {/* Page Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div>
            <h1 className="text-xl font-semibold text-[var(--text-primary)]">Leads</h1>
            <p className="text-[var(--text-secondary)] mt-1">People who left their contact info via your chatbot</p>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-4">
              <p className="text-2xl font-bold text-[var(--text-primary)]">{stats.total}</p>
              <p className="text-xs text-[var(--text-muted)] mt-1">Total Leads</p>
            </div>
            <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-4">
              <p className="text-2xl font-bold text-blue-600">{stats.pendingReview}</p>
              <p className="text-xs text-[var(--text-muted)] mt-1">Pending Review</p>
            </div>
            <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-4">
              <p className="text-2xl font-bold text-[var(--text-primary)]">{stats.newThisWeek}</p>
              <p className="text-xs text-[var(--text-muted)] mt-1">This Week</p>
            </div>
            <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-4">
              <p className="text-2xl font-bold text-[var(--text-primary)]">{stats.newToday}</p>
              <p className="text-xs text-[var(--text-muted)] mt-1">Today</p>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex items-center gap-2 mb-4 overflow-x-auto">
          <button
            onClick={() => setFilterStatus('')}
            className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors whitespace-nowrap ${
              !filterStatus ? 'bg-[var(--text-primary)] text-[var(--bg-primary)]' : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            All
          </button>
          {STATUS_OPTIONS.map(s => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors whitespace-nowrap capitalize ${
                filterStatus === s ? 'bg-[var(--text-primary)] text-[var(--bg-primary)]' : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Leads List */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-6 h-6 border-2 border-[var(--text-muted)] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : leads.length === 0 ? (
          <div className="text-center py-16 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl">
            <svg className="w-12 h-12 mx-auto text-[var(--text-muted)] mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p className="text-[var(--text-secondary)]">No leads captured yet</p>
            <p className="text-sm text-[var(--text-muted)] mt-1">Leads will appear here when visitors submit their contact info via your chatbot</p>
          </div>
        ) : (
          <div className="space-y-2">
            {leads.map(lead => (
              <div key={lead.id} className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl overflow-hidden">
                {/* Lead Row */}
                <div
                  className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-[var(--bg-tertiary)] transition-colors"
                  onClick={() => expandLead(lead.id)}
                >
                  {/* Avatar */}
                  <div className="w-9 h-9 rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-semibold text-[var(--text-secondary)]">
                      {lead.name.charAt(0).toUpperCase()}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-[var(--text-primary)] truncate">{lead.name}</span>
                      <span className={`px-2 py-0.5 text-[10px] font-medium rounded-full capitalize ${STATUS_COLORS[lead.status] || STATUS_COLORS.new}`}>
                        {lead.status}
                      </span>
                    </div>
                    <p className="text-xs text-[var(--text-muted)] truncate">{lead.email}{lead.phone ? ` · ${lead.phone}` : ''}</p>
                  </div>

                  {/* Meta */}
                  <div className="hidden sm:flex flex-col items-end flex-shrink-0">
                    <span className="text-xs text-[var(--text-muted)]">{lead.assistantName}</span>
                    <span className="text-xs text-[var(--text-muted)]">{formatDate(lead.createdAt)}</span>
                  </div>

                  {/* Expand Arrow */}
                  <svg className={`w-4 h-4 text-[var(--text-muted)] transition-transform flex-shrink-0 ${expandedId === lead.id ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>

                {/* Expanded Detail */}
                {expandedId === lead.id && (
                  <div className="border-t border-[var(--border-color)] px-4 sm:px-6 py-4 bg-[var(--bg-primary)]">
                    {loadingDetail ? (
                      <div className="flex items-center justify-center py-6">
                        <div className="w-5 h-5 border-2 border-[var(--text-muted)] border-t-transparent rounded-full animate-spin" />
                      </div>
                    ) : expandedLead ? (
                      <div className="space-y-4">
                        {/* Contact Info */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <p className="text-xs text-[var(--text-muted)] mb-1">Name</p>
                            <p className="text-sm font-medium text-[var(--text-primary)]">{expandedLead.name}</p>
                          </div>
                          <div>
                            <p className="text-xs text-[var(--text-muted)] mb-1">Email</p>
                            <a href={`mailto:${expandedLead.email}`} className="text-sm text-blue-600 hover:underline">{expandedLead.email}</a>
                          </div>
                          {expandedLead.phone && (
                            <div>
                              <p className="text-xs text-[var(--text-muted)] mb-1">Phone</p>
                              <a href={`tel:${expandedLead.phone}`} className="text-sm text-blue-600 hover:underline">{expandedLead.phone}</a>
                            </div>
                          )}
                        </div>

                        {/* Metadata */}
                        {expandedLead.metadata && (
                          <div className="flex flex-wrap gap-2">
                            {expandedLead.metadata.pageUrl && (
                              <span className="px-2 py-1 text-xs bg-[var(--bg-tertiary)] rounded-lg text-[var(--text-muted)] truncate max-w-xs">
                                From: {expandedLead.metadata.pageUrl}
                              </span>
                            )}
                            {expandedLead.metadata.triggerReason && (
                              <span className="px-2 py-1 text-xs bg-[var(--bg-tertiary)] rounded-lg text-[var(--text-muted)] capitalize">
                                Trigger: {expandedLead.metadata.triggerReason.replace('_', ' ')}
                              </span>
                            )}
                          </div>
                        )}

                        {/* Conversation Messages */}
                        {expandedLead.conversation?.messages?.length > 0 && (
                          <div>
                            <p className="text-xs text-[var(--text-muted)] mb-2">Conversation</p>
                            <div className="space-y-2 max-h-48 overflow-y-auto">
                              {expandedLead.conversation.messages.map((msg: any) => (
                                <div key={msg.id} className={`text-sm px-3 py-2 rounded-lg max-w-[85%] ${
                                  msg.role === 'user'
                                    ? 'bg-blue-50 text-blue-900 ml-auto'
                                    : 'bg-[var(--bg-tertiary)] text-[var(--text-primary)]'
                                }`}>
                                  {msg.content.slice(0, 200)}{msg.content.length > 200 ? '...' : ''}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[var(--border-color)]">
                          <span className="text-xs text-[var(--text-muted)] mr-2">Update status:</span>
                          {STATUS_OPTIONS.filter(s => s !== lead.status).map(s => (
                            <button
                              key={s}
                              onClick={() => updateStatus(lead.id, s)}
                              className={`px-3 py-1 text-xs font-medium rounded-full capitalize transition-colors ${STATUS_COLORS[s]} hover:opacity-80`}
                            >
                              {s}
                            </button>
                          ))}
                          <button
                            onClick={() => deleteLead(lead.id)}
                            className="ml-auto px-3 py-1 text-xs font-medium text-red-500 hover:bg-red-50 rounded-full transition-colors"
                          >
                            Delete
                          </button>
                        </div>
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
          <div className="flex items-center justify-between mt-6">
            <span className="text-sm text-[var(--text-muted)]">
              {pagination.total} lead{pagination.total !== 1 ? 's' : ''}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => loadLeads(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="px-3 py-1.5 text-sm font-medium rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] disabled:opacity-40 hover:bg-[var(--bg-tertiary)] transition-colors"
              >
                Previous
              </button>
              <span className="text-sm text-[var(--text-secondary)]">
                {pagination.page} / {pagination.totalPages}
              </span>
              <button
                onClick={() => loadLeads(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
                className="px-3 py-1.5 text-sm font-medium rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] disabled:opacity-40 hover:bg-[var(--bg-tertiary)] transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
