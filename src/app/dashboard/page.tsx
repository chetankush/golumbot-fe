'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store';
import { assistantsApi, creditsApi } from '@/lib/api';
import { ThemeToggle } from '@/components/ThemeProvider';

interface Assistant {
  id: string;
  name: string;
  description?: string;
  systemPrompt: string;
  model: string;
  isActive: boolean;
  createdAt: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, tenant, token, apiKey, logout } = useAuthStore();
  const [assistants, setAssistants] = useState<Assistant[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [credits, setCredits] = useState<{ balance: number; lowBalance: boolean; devMode?: boolean } | null>(null);
  const [showToast, setShowToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    // Check for purchase success
    const purchaseStatus = searchParams.get('purchase');
    const creditsAdded = searchParams.get('credits');

    if (purchaseStatus === 'success' && creditsAdded) {
      setShowToast({ type: 'success', message: `Payment successful! ${creditsAdded} credits added to your account.` });
      router.replace('/dashboard');
    }

    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    loadAssistants();
    loadCredits();
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
    } catch (error) {
      console.error('Failed to load credits:', error);
      // Set dev mode credits if API fails
      setCredits({ balance: 999999, lowBalance: false, devMode: true });
    }
  };

  const loadAssistants = async () => {
    if (!token) return;
    try {
      const response = await assistantsApi.list(token);
      setAssistants(response.data.assistants);
    } catch (error) {
      console.error('Failed to load assistants:', error);
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
        <div className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-xl shadow-lg animate-fade-in ${
          showToast.type === 'success'
            ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800'
            : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800'
        }`}>
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>{showToast.message}</span>
            <button onClick={() => setShowToast(null)} className="ml-2 hover:opacity-70">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-20 bg-[var(--bg-secondary)]/80 backdrop-blur-md border-b border-[var(--border-color)]">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="font-display text-xl font-semibold text-[var(--text-primary)]">
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
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:block text-sm text-[var(--text-muted)]">{tenant?.name}</span>
            <ThemeToggle />
            <button
              onClick={handleLogout}
              className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-8 animate-fade-in">
        {/* Credits & API Key Section */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          {/* Credits Card */}
          <div className={`card p-5 ${credits?.lowBalance ? 'border-orange-400 dark:border-orange-600' : ''}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  credits?.devMode
                    ? 'bg-blue-100 dark:bg-blue-900/30'
                    : credits?.lowBalance
                    ? 'bg-orange-100 dark:bg-orange-900/30'
                    : 'bg-gradient-to-br from-purple-500 to-pink-500'
                }`}>
                  <svg className={`w-5 h-5 ${credits?.devMode ? 'text-blue-600 dark:text-blue-400' : credits?.lowBalance ? 'text-orange-600 dark:text-orange-400' : 'text-white'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-[var(--text-primary)]">Credits</h3>
                    {credits?.devMode && (
                      <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full">
                        Dev Mode
                      </span>
                    )}
                  </div>
                  <p className="text-2xl font-bold gradient-text">
                    {credits?.devMode ? '∞' : credits?.balance?.toLocaleString() ?? '...'}
                  </p>
                </div>
              </div>
              {!credits?.devMode && (
                <Link
                  href="/pricing"
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    credits?.lowBalance
                      ? 'bg-orange-500 hover:bg-orange-600 text-white'
                      : 'bg-[var(--bg-tertiary)] hover:bg-[var(--border-color)] text-[var(--text-primary)]'
                  }`}
                >
                  {credits?.lowBalance ? 'Buy Now' : 'Buy More'}
                </Link>
              )}
            </div>
            {credits?.devMode && (
              <p className="mt-3 text-sm text-blue-600 dark:text-blue-400">
                💻 Development mode - Stripe not configured. Credits are unlimited.
              </p>
            )}
            {credits?.lowBalance && !credits?.devMode && (
              <p className="mt-3 text-sm text-orange-600 dark:text-orange-400">
                ⚠️ Low balance! Buy more credits to keep your chatbot running.
              </p>
            )}
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
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl font-semibold text-[var(--text-primary)]">Assistants</h2>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-all hover:shadow-lg hover:shadow-primary-500/25"
          >
            Create Assistant
          </button>
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
                onUpdate={loadAssistants}
                token={token!}
              />
            ))}
          </div>
        )}

        {/* Widget Code Section */}
        {assistants.length > 0 && (
          <div className="mt-12">
            <h2 className="font-display text-2xl font-semibold text-[var(--text-primary)] mb-4">Embed Widget</h2>
            <div className="card p-6">
              <p className="text-[var(--text-secondary)] mb-4">
                Add this code before the closing <code className="px-1.5 py-0.5 bg-[var(--bg-tertiary)] rounded text-sm">&lt;/body&gt;</code> tag:
              </p>
              <pre className="p-4 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-sm overflow-x-auto font-mono text-[var(--text-primary)]">
{`<script>
  window.GOLUM_CONFIG = {
    apiKey: '${apiKey}',
    apiUrl: '${typeof window !== 'undefined' ? window.location.origin.replace(':3000', ':3001') : 'http://localhost:3001'}'
  };
</script>
<script src="http://localhost:3002/widget.js"></script>`}
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
          }}
        />
      )}
    </div>
  );
}

function AssistantCard({
  assistant,
  onUpdate,
  token,
}: {
  assistant: Assistant;
  onUpdate: () => void;
  token: string;
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
            <p className="text-xs text-[var(--text-muted)]">{assistant.model}</p>
          </div>
        </div>
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${
            assistant.isActive
              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
              : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
          }`}
        >
          {assistant.isActive ? 'Active' : 'Inactive'}
        </span>
      </div>
      {assistant.description && (
        <p className="text-sm text-[var(--text-secondary)] mb-4 line-clamp-2">{assistant.description}</p>
      )}
      <div className="flex items-center justify-between pt-3 border-t border-[var(--border-color)]">
        <Link
          href="/admin"
          className="text-sm text-primary-500 hover:text-primary-600 font-medium"
        >
          Manage Knowledge
        </Link>
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
      <div className="card max-w-lg w-full p-6 animate-fade-in">
        <h2 className="font-display text-xl font-semibold text-[var(--text-primary)] mb-6">Create Assistant</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-lg text-sm">
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
