const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {},
  token?: string | null
): Promise<T> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.message || 'Request failed');
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

  verifyMagicLink: (token: string) =>
    apiClient('/api/auth/verify-magic-link', {
      method: 'POST',
      body: JSON.stringify({ token }),
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
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Documents API
export const documentsApi = {
  upload: async (token: string, assistantId: string, files: File[]) => {
    const formData = new FormData();
    formData.append('assistantId', assistantId);
    files.forEach(file => {
      formData.append('files', file);
    });

    const response = await fetch(`${API_BASE}/api/documents/upload`, {
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
      };
    }>('/api/stripe/credits', {}, token),

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
    }>('/api/stripe/credits/history', {}, token),

  // Get available packages
  getPackages: () =>
    apiClient<{
      success: boolean;
      data: {
        packages: Array<{
          id: string;
          name: string;
          credits: number;
          price: number;
          priceId: string;
          popular: boolean;
          savings: string | null;
          pricePerCredit: string;
        }>;
        freeCredits: number;
        costs: {
          message: number;
          documentUpload: number;
          webScrape: number;
        };
      };
    }>('/api/stripe/packages', {}),

  // Purchase credits
  purchase: (token: string, packageId: string) =>
    apiClient<{
      success: boolean;
      data: {
        sessionId: string;
        url: string;
      };
    }>('/api/stripe/purchase', {
      method: 'POST',
      body: JSON.stringify({ packageId }),
    }, token),
};
