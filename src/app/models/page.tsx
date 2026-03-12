'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store';
import { assistantsApi } from '@/lib/api';
import { GolumIcon } from '@/components/Logo';

interface ModelInfo {
  id: string;
  name: string;
  provider: string;
  costPerMessage: number;
  qualityRating: number;
  speedRating: number;
  description: string;
  isFree: boolean;
  category: 'budget' | 'standard' | 'premium' | 'enterprise';
}

interface Assistant {
  id: string;
  name: string;
  model: string;
}

export default function ModelsPage() {
  const router = useRouter();
  const { isAuthenticated, tenant, token, logout } = useAuthStore();
  const [models, setModels] = useState<ModelInfo[]>([]);
  const [assistantsList, setAssistantsList] = useState<Assistant[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAssistant, setSelectedAssistant] = useState<string>('');
  const [updatingModel, setUpdatingModel] = useState<string | null>(null);
  const [showToast, setShowToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    loadData();
  }, [isAuthenticated, router]);

  const loadData = async () => {
    if (!token) return;
    try {
      const [modelsRes, assistantsRes] = await Promise.all([
        assistantsApi.models(token),
        assistantsApi.list(token),
      ]);
      setModels(modelsRes.data.models);
      setAssistantsList(assistantsRes.data.assistants);
      if (assistantsRes.data.assistants.length > 0) {
        setSelectedAssistant(assistantsRes.data.assistants[0].id);
      }
    } catch (error: any) {
      if (error.message === 'Invalid token' || error.message === 'Unauthorized') {
        logout();
        router.push('/login');
        return;
      }
      console.error('Failed to load models:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectModel = async (modelId: string) => {
    if (!selectedAssistant) {
      setShowToast({ type: 'error', message: 'Please select an assistant first' });
      setTimeout(() => setShowToast(null), 3000);
      return;
    }

    setUpdatingModel(modelId);
    try {
      await assistantsApi.update(token!, selectedAssistant, { model: modelId });
      setAssistantsList(prev => prev.map(a =>
        a.id === selectedAssistant ? { ...a, model: modelId } : a
      ));
      setShowToast({ type: 'success', message: 'Model updated successfully' });
      setTimeout(() => setShowToast(null), 3000);
    } catch (error: any) {
      setShowToast({ type: 'error', message: error.message || 'Failed to update model' });
      setTimeout(() => setShowToast(null), 3000);
    } finally {
      setUpdatingModel(null);
    }
  };

  const currentAssistant = assistantsList.find(a => a.id === selectedAssistant);

  const tiers = [
    {
      key: 'budget',
      title: 'Starter',
      badge: '1 credit / message',
      badgeClass: 'bg-emerald-900/30 text-emerald-300',
      subtitle: 'Great for most chatbots. Fast, reliable, and cost-effective.',
      models: models.filter(m => m.category === 'budget'),
    },
    {
      key: 'standard',
      title: 'Pro',
      badge: '2 credits / message',
      badgeClass: 'bg-blue-900/30 text-blue-300',
      subtitle: 'Smarter responses for complex questions and technical topics.',
      models: models.filter(m => m.category === 'standard'),
    },
    {
      key: 'premium',
      title: 'Premium',
      badge: '5 credits / message',
      badgeClass: 'bg-purple-900/30 text-purple-300',
      subtitle: 'Top-tier models for the best conversation quality.',
      models: models.filter(m => m.category === 'premium'),
    },
    {
      key: 'enterprise',
      title: 'Enterprise',
      badge: '10 credits / message',
      badgeClass: 'bg-amber-900/30 text-amber-300',
      subtitle: 'Frontier AI for high-stakes, mission-critical use cases.',
      models: models.filter(m => m.category === 'enterprise'),
    },
  ];

  const RatingBar = ({ value, max = 5 }: { value: number; max?: number }) => (
    <div className="flex gap-1">
      {Array.from({ length: max }, (_, i) => (
        <div key={i} className={`w-3 h-1.5 rounded-full ${i < value ? 'bg-primary-500' : 'bg-[var(--border-color)]'}`} />
      ))}
    </div>
  );

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen">
      {/* Toast */}
      {showToast && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-xl shadow-lg animate-fade-in ${
          showToast.type === 'success'
            ? 'bg-green-900/30 text-green-200 border border-green-800'
            : 'bg-red-900/30 text-red-200 border border-red-800'
        }`}>
          <div className="flex items-center gap-3">
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
      <header className="sticky top-0 z-20 bg-[var(--bg-secondary)]/95 backdrop-blur-sm border-b border-[var(--border-color)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
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
              <Link href="/analytics" className="px-3 py-1.5 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors">
                Analytics
              </Link>
              <Link href="/models" className="px-3 py-1.5 text-sm font-medium text-[var(--text-primary)] bg-[var(--bg-tertiary)] rounded-lg">
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
            <Link href="/analytics" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors mb-1">Analytics</Link>
            <Link href="/models" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-sm font-medium text-[var(--text-primary)] bg-[var(--bg-tertiary)] rounded-lg">Models</Link>
          </div>
        )}
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 animate-fade-in">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-[var(--text-primary)]">AI Models</h1>
          <p className="text-[var(--text-secondary)] mt-1">Pick a model for your chatbot. Smarter models use more credits per message.</p>
        </div>

        {/* Assistant Selector */}
        {assistantsList.length > 0 && (
          <div className="card p-5 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
              <label className="text-sm font-medium text-[var(--text-secondary)]">Select Assistant:</label>
              <select
                value={selectedAssistant}
                onChange={(e) => setSelectedAssistant(e.target.value)}
                className="px-4 py-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] text-sm"
              >
                {assistantsList.map(a => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </select>
              {currentAssistant && (
                <span className="text-sm text-[var(--text-muted)]">
                  Current: <span className="font-medium text-[var(--text-primary)]">{models.find(m => m.id === currentAssistant.model)?.name || currentAssistant.model}</span>
                </span>
              )}
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="space-y-10">
            {tiers.map(tier => tier.models.length > 0 && (
              <div key={tier.key}>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-base font-semibold text-[var(--text-primary)]">{tier.title}</h2>
                  <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${tier.badgeClass}`}>{tier.badge}</span>
                </div>
                <p className="text-sm text-[var(--text-muted)] mb-4">{tier.subtitle}</p>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {tier.models.map(model => (
                    <ModelCard
                      key={model.id}
                      model={model}
                      isActive={currentAssistant?.model === model.id}
                      isUpdating={updatingModel === model.id}
                      onSelect={() => selectModel(model.id)}
                      RatingBar={RatingBar}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function ModelCard({
  model,
  isActive,
  isUpdating,
  onSelect,
  RatingBar,
}: {
  model: ModelInfo;
  isActive: boolean;
  isUpdating: boolean;
  onSelect: () => void;
  RatingBar: ({ value, max }: { value: number; max?: number }) => React.ReactNode;
}) {
  return (
    <div className={`card p-5 transition-all ${isActive ? 'border-primary-500 ring-1 ring-primary-500/20' : 'hover:border-[var(--text-muted)]'}`}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-medium text-[var(--text-primary)]">{model.name}</h3>
          <span className="text-xs text-[var(--text-muted)] mt-0.5 block">{model.costPerMessage} {model.costPerMessage === 1 ? 'credit' : 'credits'} per message</span>
        </div>
        {isActive && (
          <span className="flex items-center gap-1 px-2 py-1 text-xs font-medium bg-primary-500/10 text-primary-500 rounded-full">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
            Active
          </span>
        )}
      </div>

      <p className="text-sm text-[var(--text-secondary)] mb-4">{model.description}</p>

      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between">
          <span className="text-xs text-[var(--text-muted)]">Quality</span>
          <RatingBar value={model.qualityRating} />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-[var(--text-muted)]">Speed</span>
          <RatingBar value={model.speedRating} />
        </div>
      </div>

      <button
        onClick={onSelect}
        disabled={isActive || isUpdating}
        className={`w-full py-2 text-sm font-medium rounded-lg transition-all ${
          isActive
            ? 'bg-primary-500/10 text-primary-500 cursor-default'
            : 'bg-[var(--bg-tertiary)] hover:bg-[var(--border-color)] text-[var(--text-primary)] disabled:opacity-50'
        }`}
      >
        {isUpdating ? 'Updating...' : isActive ? 'Currently Active' : 'Select Model'}
      </button>
    </div>
  );
}
