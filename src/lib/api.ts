const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Map technical error messages to user-friendly ones
function getUserFriendlyError(status: number, message: string): string {
  // Auth errors
  if (status === 401) return 'Your session has expired. Please sign in again.';
  if (status === 403) return 'You don\'t have permission to do that.';
  if (status === 429) return 'Too many requests. Please wait a moment and try again.';
  if (status === 402) return 'Insufficient credits. Please purchase more credits to continue.';
  if (status === 503) return 'This feature is currently unavailable. Please try again later.';

  // If the server sent a clear message, use it
  if (message && !message.includes('ECONNREFUSED') && !message.includes('fetch failed')) {
    return message;
  }

  // Generic fallbacks
  if (status >= 500) return 'Something went wrong on our end. Please try again later.';
  if (status >= 400) return 'There was a problem with your request. Please try again.';
  return 'Something went wrong. Please try again.';
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {},
  token?: string | null
): Promise<T> {
  const headers: HeadersInit = {
    ...(options.body ? { 'Content-Type': 'application/json' } : {}),
    ...options.headers,
  };

  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  let response: Response;
  try {
    response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });
  } catch (err) {
    throw new Error('Unable to connect to the server. Please check your internet connection.');
  }

  let data: any;
  try {
    data = await response.json();
  } catch {
    if (!response.ok) {
      throw new Error(getUserFriendlyError(response.status, ''));
    }
    return {} as T;
  }

  if (!response.ok) {
    const rawMessage = data?.error?.message || '';
    throw new Error(getUserFriendlyError(response.status, rawMessage));
  }

  return data;
}

// Auth API
export const authApi = {
  register: (data: { email: string; password: string; name?: string; companyName: string }) =>
    apiClient('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  login: (data: { email: string; password: string }) =>
    apiClient('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  me: (token: string) =>
    apiClient('/api/auth/me', {}, token),

  sendMagicLink: (email: string) =>
    apiClient('/api/auth/magic-link', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  verifyMagicLink: (accessToken: string) =>
    apiClient('/api/auth/verify-magic-link', {
      method: 'POST',
      body: JSON.stringify({ access_token: accessToken }),
    }),

  resetPassword: (email: string) =>
    apiClient('/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  updatePassword: (accessToken: string, password: string) =>
    apiClient('/api/auth/update-password', {
      method: 'POST',
      body: JSON.stringify({ access_token: accessToken, password }),
    }),
};

// Assistants API
export const assistantsApi = {
  list: (token: string) =>
    apiClient<{ success: boolean; data: { assistants: any[] } }>('/api/assistants', {}, token),

  create: (token: string, data: { name: string; systemPrompt: string; description?: string }) =>
    apiClient('/api/assistants', {
      method: 'POST',
      body: JSON.stringify(data),
    }, token),

  get: (token: string, id: string) =>
    apiClient(`/api/assistants/${id}`, {}, token),

  update: (token: string, id: string, data: any) =>
    apiClient(`/api/assistants/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }, token),

  delete: (token: string, id: string) =>
    apiClient(`/api/assistants/${id}`, {
      method: 'DELETE',
    }, token),

  models: (token: string) =>
    apiClient<{ success: boolean; data: { models: any[] } }>('/api/assistants/models', {}, token),

  uploadIcon: async (token: string, assistantId: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_URL}/api/assistants/${assistantId}/icon`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || 'Upload failed');
    return data;
  },
};

// Documents API
export const documentsApi = {
  upload: async (token: string, assistantId: string, files: File[]) => {
    const formData = new FormData();
    formData.append('assistantId', assistantId);
    files.forEach(file => {
      formData.append('files', file);
    });

    const response = await fetch(`${API_URL}/api/documents/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error?.message || 'Upload failed');
    }
    return data;
  },

  scrape: (token: string, assistantId: string, url: string) =>
    apiClient('/api/documents/scrape', {
      method: 'POST',
      body: JSON.stringify({ assistantId, url }),
    }, token),

  pasteText: (token: string, assistantId: string, name: string, content: string) =>
    apiClient('/api/documents/paste', {
      method: 'POST',
      body: JSON.stringify({ assistantId, name, content }),
    }, token),

  list: (token: string, assistantId: string) =>
    apiClient<{ success: boolean; data: { documents: any[] } }>(
      `/api/documents?assistantId=${assistantId}`,
      {},
      token
    ),

  get: (token: string, id: string) =>
    apiClient(`/api/documents/${id}`, {}, token),

  delete: (token: string, id: string) =>
    apiClient(`/api/documents/${id}`, {
      method: 'DELETE',
    }, token),
};

// Credits API
export const creditsApi = {
  // Get current credit balance
  getBalance: (token: string) =>
    apiClient<{
      success: boolean;
      data: {
        balance: number;
        totalPurchased: number;
        totalUsed: number;
        lowBalance: boolean;
        costs: {
          message: number;
          documentUpload: number;
          webScrape: number;
        };
        subscription?: {
          planId: string;
          status: string;
          currentPeriodEnd: string | null;
        };
      };
    }>('/api/dodo/credits', {}, token),

  // Get transaction history
  getHistory: (token: string) =>
    apiClient<{
      success: boolean;
      data: {
        transactions: Array<{
          id: string;
          type: string;
          amount: number;
          balance: number;
          description: string;
          createdAt: string;
        }>;
      };
    }>('/api/dodo/credits/history', {}, token),

  // Get available subscription plans
  getPlans: () =>
    apiClient<{
      success: boolean;
      data: {
        plans: Array<{
          id: string;
          name: string;
          price: number;
          productId: string;
          monthlyCredits: number;
          maxAssistants: number;
          summaryLimit: number;
          popular: boolean;
        }>;
      };
    }>('/api/dodo/plans', {}),

  // Subscribe to a plan
  subscribe: (token: string, planId: string) =>
    apiClient<{
      success: boolean;
      data: {
        paymentLink: string;
      };
    }>('/api/dodo/subscribe', {
      method: 'POST',
      body: JSON.stringify({ planId }),
    }, token),

  // Get available credit packs
  getCreditPacks: () =>
    apiClient<{
      success: boolean;
      data: {
        packs: Array<{
          id: string;
          name: string;
          credits: number;
          price: number;
          perCredit: number;
        }>;
      };
    }>('/api/dodo/credits/packs', {}),

  // Buy a credit pack
  buyCredits: (token: string, packId: string) =>
    apiClient<{
      success: boolean;
      data: {
        paymentLink: string;
        paymentId: string;
      };
    }>('/api/dodo/credits/buy', {
      method: 'POST',
      body: JSON.stringify({ packId }),
    }, token),

  // Verify & sync subscription after payment return
  verifySubscription: (token: string) =>
    apiClient<{
      success: boolean;
      data: {
        plan: string;
        planName: string;
        status: string;
        creditsAdded?: number;
        newBalance?: number;
        synced: boolean;
      };
    }>('/api/dodo/subscription/verify', {
      method: 'POST',
    }, token),

  // Get current subscription
  getSubscription: (token: string) =>
    apiClient<{
      success: boolean;
      data: {
        plan: string;
        planName: string;
        status: string;
        subscriptionId?: string;
        currentPeriodEnd?: string;
        monthlyCredits: number;
        maxAssistants: number;
        summaryLimit: number;
      };
    }>('/api/dodo/subscription/current', {}, token),
};

// Leads API
export const leadsApi = {
  list: (token: string, page = 1, limit = 20, status?: string) =>
    apiClient<{
      success: boolean;
      data: {
        leads: Array<{
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
        }>;
        pagination: { page: number; limit: number; total: number; totalPages: number };
      };
    }>(`/api/leads?page=${page}&limit=${limit}${status ? `&status=${status}` : ''}`, {}, token),

  get: (token: string, id: string) =>
    apiClient<{ success: boolean; data: { lead: any } }>(`/api/leads/${id}`, {}, token),

  updateStatus: (token: string, id: string, status: string) =>
    apiClient(`/api/leads/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }, token),

  delete: (token: string, id: string) =>
    apiClient(`/api/leads/${id}`, { method: 'DELETE' }, token),

  stats: (token: string) =>
    apiClient<{
      success: boolean;
      data: { total: number; newThisWeek: number; newToday: number; pendingReview: number };
    }>('/api/leads/stats', {}, token),
};

// Analytics API
export const analyticsApi = {
  overview: (token: string, period = '30d') =>
    apiClient<{ success: boolean; data: any }>(`/api/analytics/overview?period=${period}`, {}, token),

  conversationsOverTime: (token: string, period = '30d') =>
    apiClient<{
      success: boolean;
      data: { dataPoints: Array<{ date: string; count: number }> };
    }>(`/api/analytics/conversations-over-time?period=${period}`, {}, token),

  busiestHours: (token: string) =>
    apiClient<{
      success: boolean;
      data: { hours: Array<{ hour: number; count: number }> };
    }>('/api/analytics/busiest-hours', {}, token),

  topQuestions: (token: string) =>
    apiClient<{
      success: boolean;
      data: { questions: Array<{ text: string; count: number }> };
    }>('/api/analytics/top-questions', {}, token),

  missedQuestions: (token: string, period = '30d') =>
    apiClient<{
      success: boolean;
      data: { missedQuestions: Array<{ question: string; count: number }> };
    }>(`/api/analytics/missed-questions?period=${period}`, {}, token),

  trainingSuggestions: (token: string) =>
    apiClient<{
      success: boolean;
      data: { suggestions: Array<{ question: string; frequency: number }> };
    }>('/api/analytics/training-suggestions', {}, token),

  addTrainingAnswer: (token: string, data: { question: string; answer: string; assistantId: string }) =>
    apiClient<{ success: boolean; data: { document: any } }>('/api/analytics/training-suggestions/add', {
      method: 'POST',
      body: JSON.stringify(data),
    }, token),

  visitors: (token: string, period = '30d') =>
    apiClient<{
      success: boolean;
      data: {
        uniqueVisitors: number;
        returningVisitors: number;
        avgConversationsPerVisitor: number;
        period: string;
      };
    }>(`/api/analytics/visitors?period=${period}`, {}, token),
};

// Export API
export const exportApi = {
  downloadConversations: () =>
    `${API_URL}/api/export/conversations`,

  downloadLeads: () =>
    `${API_URL}/api/export/leads`,

  getExportHeaders: (token: string) => ({
    'Authorization': `Bearer ${token}`,
  }),
};

// Settings API
export const settingsApi = {
  getNotifications: (token: string) =>
    apiClient<{
      success: boolean;
      data: { emailNewLead: boolean; emailUnanswered: boolean; notifyEmail: string | null };
    }>('/api/settings/notifications', {}, token),

  updateNotifications: (token: string, data: { emailNewLead?: boolean; emailUnanswered?: boolean; notifyEmail?: string | null }) =>
    apiClient('/api/settings/notifications', {
      method: 'PATCH',
      body: JSON.stringify(data),
    }, token),
};

// Plans API
export const plansApi = {
  list: () =>
    apiClient<{ success: boolean; data: { plans: any[] } }>('/api/plans', {}),

  current: (token: string) =>
    apiClient<{ success: boolean; data: { plan: any; assistantUsage: { current: number; limit: number; devMode?: boolean } } }>('/api/plans/current', {}, token),
};

// Conversations API
export const conversationsApi = {
  list: (token: string, page = 1, limit = 20) =>
    apiClient<{
      success: boolean;
      data: {
        conversations: any[];
        pagination: { page: number; limit: number; total: number; totalPages: number };
      };
    }>(`/api/conversations?page=${page}&limit=${limit}`, {}, token),

  get: (token: string, id: string) =>
    apiClient<{ success: boolean; data: { conversation: any } }>(`/api/conversations/${id}`, {}, token),

  delete: (token: string, id: string) =>
    apiClient(`/api/conversations/${id}`, { method: 'DELETE' }, token),

  generateSummary: (token: string, id: string) =>
    apiClient<{ success: boolean; data: { summary: any; cached: boolean } }>(
      `/api/conversations/${id}/summary`,
      { method: 'POST' },
      token
    ),

  getSummary: (token: string, id: string) =>
    apiClient<{ success: boolean; data: { summary: any } }>(`/api/conversations/${id}/summary`, {}, token),

  bulkSummarize: (token: string) =>
    apiClient<{ success: boolean; data: { generated: number; total: number } }>(
      '/api/conversations/summaries/bulk',
      { method: 'POST' },
      token
    ),

  getSummaryUsage: (token: string) =>
    apiClient<{ success: boolean; data: { used: number; limit: number; planName: string } }>(
      '/api/conversations/summaries/usage',
      {},
      token
    ),
};
