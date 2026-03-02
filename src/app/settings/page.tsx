'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store';
import { settingsApi } from '@/lib/api';
import { GolumIcon } from '@/components/Logo';

export default function SettingsPage() {
  const router = useRouter();
  const { isAuthenticated, tenant, token, logout } = useAuthStore();
  const [emailNewLead, setEmailNewLead] = useState(true);
  const [emailUnanswered, setEmailUnanswered] = useState(false);
  const [notifyEmail, setNotifyEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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
    loadSettings();
  }, [isAuthenticated, router]);

  const loadSettings = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const response = await settingsApi.getNotifications(token);
      setEmailNewLead(response.data.emailNewLead);
      setEmailUnanswered(response.data.emailUnanswered);
      setNotifyEmail(response.data.notifyEmail || '');
    } catch (error: any) {
      if (error.message?.includes('session has expired')) {
        logout();
        router.push('/login');
        return;
      }
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    if (!token) return;
    setSaving(true);
    try {
      await settingsApi.updateNotifications(token, {
        emailNewLead,
        emailUnanswered,
        notifyEmail: notifyEmail.trim() || null,
      });
      setShowToast({ type: 'success', message: 'Settings saved' });
    } catch {
      setShowToast({ type: 'error', message: 'Failed to save settings' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Toast */}
      {showToast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 text-sm font-medium animate-fade-in ${
          showToast.type === 'success' ? 'bg-[#e8eaed] text-[#202124]' : 'bg-red-500 text-white'
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
              <Link href="/dashboard" className="px-3 py-1.5 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors">Assistants</Link>
              <Link href="/admin" className="px-3 py-1.5 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors">Knowledge Base</Link>
              <Link href="/conversations" className="px-3 py-1.5 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors">Conversations</Link>
              <Link href="/leads" className="px-3 py-1.5 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors">Leads</Link>
              <Link href="/analytics" className="px-3 py-1.5 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors">Analytics</Link>
              <Link href="/models" className="px-3 py-1.5 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors">Models</Link>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:block text-sm text-[var(--text-muted)]">{tenant?.name}</span>
            <button onClick={() => { logout(); router.push('/login'); }} className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">Logout</button>
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
            <Link href="/analytics" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors mb-1">Analytics</Link>
            <Link href="/models" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors">Models</Link>
          </div>
        )}
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-8 animate-fade-in">
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-[var(--text-primary)]">Settings</h1>
          <p className="text-[var(--text-secondary)] mt-1">Manage notifications and preferences</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-6 h-6 border-2 border-[var(--text-muted)] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Email Notifications */}
            <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-5">
              <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-4">Email Notifications</h2>

              <div className="space-y-4">
                {/* New Lead */}
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <p className="text-sm font-medium text-[var(--text-primary)]">New lead captured</p>
                    <p className="text-xs text-[var(--text-muted)]">Get an email when someone leaves their contact info</p>
                  </div>
                  <button
                    onClick={() => setEmailNewLead(!emailNewLead)}
                    className={`relative w-10 h-6 rounded-full transition-colors ${emailNewLead ? 'bg-blue-600' : 'bg-[var(--bg-tertiary)]'}`}
                  >
                    <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${emailNewLead ? 'translate-x-4' : ''}`} />
                  </button>
                </label>

                {/* Unanswered */}
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <p className="text-sm font-medium text-[var(--text-primary)]">Unanswered questions</p>
                    <p className="text-xs text-[var(--text-muted)]">Get notified when your chatbot can't answer a question</p>
                  </div>
                  <button
                    onClick={() => setEmailUnanswered(!emailUnanswered)}
                    className={`relative w-10 h-6 rounded-full transition-colors ${emailUnanswered ? 'bg-blue-600' : 'bg-[var(--bg-tertiary)]'}`}
                  >
                    <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${emailUnanswered ? 'translate-x-4' : ''}`} />
                  </button>
                </label>

                {/* Notify Email */}
                <div className="pt-2">
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
                    Send notifications to
                  </label>
                  <input
                    type="email"
                    value={notifyEmail}
                    onChange={(e) => setNotifyEmail(e.target.value)}
                    placeholder="Leave empty to use your account email"
                    className="w-full px-4 py-2.5 text-sm bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Save */}
            <button
              onClick={saveSettings}
              disabled={saving}
              className="w-full py-3 bg-[var(--text-primary)] text-[var(--bg-primary)] rounded-xl text-sm font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
