'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store';
import { assistantsApi, documentsApi } from '@/lib/api';
import { ThemeToggle } from '@/components/ThemeProvider';

type Tab = 'documents' | 'scraper';

interface Document {
  id: string;
  name: string;
  type: 'file' | 'url';
  sourceUrl?: string;
  metadata?: {
    fileSize?: number;
    wordCount?: number;
  };
  createdAt: string;
}

interface Assistant {
  id: string;
  name: string;
}

export default function AdminPage() {
  const router = useRouter();
  const { token, tenant, isAuthenticated, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState<Tab>('documents');
  const [assistants, setAssistants] = useState<Assistant[]>([]);
  const [selectedAssistant, setSelectedAssistant] = useState<string>('');
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [scraping, setScraping] = useState(false);
  const [scrapeUrl, setScrapeUrl] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    loadAssistants();
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (selectedAssistant) {
      loadDocuments();
    }
  }, [selectedAssistant]);

  const loadAssistants = async () => {
    try {
      const response: any = await assistantsApi.list(token!);
      setAssistants(response.data.assistants);
      if (response.data.assistants.length > 0) {
        setSelectedAssistant(response.data.assistants[0].id);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadDocuments = async () => {
    if (!selectedAssistant) return;
    try {
      const response: any = await documentsApi.list(token!, selectedAssistant);
      setDocuments(response.data.documents);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0 || !selectedAssistant) return;

    setUploading(true);
    setError('');
    setSuccess('');

    try {
      await documentsApi.upload(token!, selectedAssistant, Array.from(files));
      setSuccess(`Successfully uploaded ${files.length} file(s)`);
      loadDocuments();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleScrape = async () => {
    if (!scrapeUrl || !selectedAssistant) return;

    setScraping(true);
    setError('');
    setSuccess('');

    try {
      await documentsApi.scrape(token!, selectedAssistant, scrapeUrl);
      setSuccess('Successfully scraped URL');
      setScrapeUrl('');
      loadDocuments();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setScraping(false);
    }
  };

  const handleDelete = async (docId: string) => {
    if (!confirm('Are you sure you want to delete this document?')) return;

    try {
      await documentsApi.delete(token!, docId);
      setSuccess('Document deleted');
      loadDocuments();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'N/A';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
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
                className="px-3 py-1.5 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors"
              >
                Assistants
              </Link>
              <Link
                href="/admin"
                className="px-3 py-1.5 text-sm font-medium text-[var(--text-primary)] bg-[var(--bg-tertiary)] rounded-lg"
              >
                Knowledge Base
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:block text-sm text-[var(--text-muted)]">{tenant?.name}</span>
            <ThemeToggle />
            <button
              onClick={() => { logout(); router.push('/login'); }}
              className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8 animate-fade-in">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="font-display text-2xl font-semibold text-[var(--text-primary)] mb-2">Knowledge Base</h1>
          <p className="text-[var(--text-secondary)]">Upload documents and scrape URLs to train your AI assistant</p>
        </div>

        {/* Assistant Selector */}
        <div className="card p-5 mb-6">
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
            Select Assistant
          </label>
          <select
            value={selectedAssistant}
            onChange={(e) => setSelectedAssistant(e.target.value)}
            className="w-full max-w-xs px-4 py-2.5 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)]"
          >
            {assistants.map((assistant) => (
              <option key={assistant.id} value={assistant.id}>
                {assistant.name}
              </option>
            ))}
          </select>
          {assistants.length === 0 && (
            <p className="mt-2 text-sm text-red-500">
              No assistants found. <Link href="/dashboard" className="text-primary-500 hover:text-primary-600">Create one first</Link>.
            </p>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-[var(--bg-tertiary)] rounded-lg mb-6 w-fit">
          <button
            onClick={() => setActiveTab('documents')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
              activeTab === 'documents'
                ? 'bg-[var(--bg-secondary)] text-[var(--text-primary)] shadow-sm'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            Upload Documents
          </button>
          <button
            onClick={() => setActiveTab('scraper')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
              activeTab === 'scraper'
                ? 'bg-[var(--bg-secondary)] text-[var(--text-primary)] shadow-sm'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            Web Scraper
          </button>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-lg text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 rounded-lg text-sm">
            {success}
          </div>
        )}

        {/* Documents Tab */}
        {activeTab === 'documents' && (
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            className={`card p-8 text-center transition-all ${
              dragOver ? 'border-primary-500 bg-primary-500/5' : ''
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => handleFileUpload(e.target.files)}
              multiple
              accept=".pdf,.txt,.md,.csv,.json,.docx,.doc"
              className="hidden"
            />
            <div className="w-16 h-16 mx-auto mb-4 bg-[var(--bg-tertiary)] rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <p className="text-[var(--text-primary)] font-medium mb-1">
              {uploading ? 'Uploading...' : 'Drop files here'}
            </p>
            <p className="text-sm text-[var(--text-muted)] mb-4">or</p>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading || !selectedAssistant}
              className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-all disabled:opacity-50"
            >
              Browse Files
            </button>
            <p className="mt-4 text-xs text-[var(--text-muted)]">
              Supported: PDF, TXT, DOCX, CSV, JSON, MD (max 10MB)
            </p>
          </div>
        )}

        {/* Scraper Tab */}
        {activeTab === 'scraper' && (
          <div className="card p-6">
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
              URL to Scrape
            </label>
            <div className="flex gap-3">
              <input
                type="url"
                value={scrapeUrl}
                onChange={(e) => setScrapeUrl(e.target.value)}
                placeholder="https://example.com/page"
                className="flex-1 px-4 py-2.5 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] placeholder-[var(--text-muted)]"
              />
              <button
                onClick={handleScrape}
                disabled={scraping || !scrapeUrl || !selectedAssistant}
                className="px-5 py-2.5 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-all disabled:opacity-50"
              >
                {scraping ? 'Scraping...' : 'Scrape'}
              </button>
            </div>
            <p className="mt-3 text-sm text-[var(--text-muted)]">
              Extract text content from any public webpage to add to your knowledge base.
            </p>
          </div>
        )}

        {/* Documents List */}
        <div className="mt-8">
          <h3 className="font-display text-lg font-medium text-[var(--text-primary)] mb-4">
            Documents <span className="text-[var(--text-muted)]">({documents.length})</span>
          </h3>
          {documents.length === 0 ? (
            <div className="card p-8 text-center">
              <div className="w-12 h-12 mx-auto mb-3 bg-[var(--bg-tertiary)] rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-[var(--text-secondary)]">No documents yet</p>
              <p className="text-sm text-[var(--text-muted)]">Upload files or scrape URLs to add knowledge</p>
            </div>
          ) : (
            <div className="card divide-y divide-[var(--border-color)]">
              {documents.map((doc) => (
                <div key={doc.id} className="p-4 flex items-center justify-between hover:bg-[var(--bg-tertiary)]/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      doc.type === 'url'
                        ? 'bg-purple-100 dark:bg-purple-900/30'
                        : 'bg-blue-100 dark:bg-blue-900/30'
                    }`}>
                      {doc.type === 'url' ? (
                        <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[var(--text-primary)]">{doc.name}</p>
                      <p className="text-xs text-[var(--text-muted)]">
                        {doc.type === 'url' ? doc.sourceUrl : formatFileSize(doc.metadata?.fileSize)}
                        {doc.metadata?.wordCount && ` • ${doc.metadata.wordCount.toLocaleString()} words`}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(doc.id)}
                    className="p-2 text-[var(--text-muted)] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
