'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  name?: string;
  tenantId: string;
}

interface Tenant {
  id: string;
  name: string;
}

interface AuthState {
  user: User | null;
  tenant: Tenant | null;
  token: string | null;
  apiKey: string | null;
  isAuthenticated: boolean;
  login: (data: { user: User; tenant: Tenant; token: string; apiKey: string }) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      tenant: null,
      token: null,
      apiKey: null,
      isAuthenticated: false,
      login: (data) =>
        set({
          user: data.user,
          tenant: data.tenant,
          token: data.token,
          apiKey: data.apiKey,
          isAuthenticated: true,
        }),
      logout: () =>
        set({
          user: null,
          tenant: null,
          token: null,
          apiKey: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: 'golum-auth',
      storage: {
        getItem: (name: string) => {
          const value = sessionStorage.getItem(name);
          return value ? JSON.parse(value) : null;
        },
        setItem: (name: string, value: unknown) => {
          sessionStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name: string) => {
          sessionStorage.removeItem(name);
        },
      },
    }
  )
);
