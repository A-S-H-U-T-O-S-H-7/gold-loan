"use client";

import { create } from 'zustand';
import api from '@/utils/axiosInsatnce';

const emptySession = {
  token: null,
  user: null,
  permissions: null,
  branch_id: null,
  isAuthenticated: false,
};

let renewalPromise = null;
let restorePromise = null;

function authData(response) {
  const data = response?.data || response || {};
  if (!data.admin || !data.accessToken) throw new Error('Login response is incomplete');
  return data;
}

export const useAdminAuthStore = create((set, get) => ({
  ...emptySession,
  loading: true,
  sessionChecked: false,
  error: null,

  acceptSession: (response) => {
    const { admin, accessToken } = authData(response);
    const { permissions = {}, ...user } = admin;
    set({
      token: accessToken,
      user,
      permissions,
      branch_id: admin.branchId ?? admin.branch_id,
      isAuthenticated: true,
      loading: false,
      sessionChecked: true,
      error: null,
    });
    return accessToken;
  },

  login: async (credentials) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post('/crm/login', {
        ...credentials,
        branch_id: Number(credentials.branch_id),
      });
      get().acceptSession(response);
    } catch (error) {
      set({
        ...emptySession,
        loading: false,
        sessionChecked: true,
        error: error.response?.data?.message || error.message || 'Login failed',
      });
    }
  },

  renewSession: async () => {
    if (!renewalPromise) {
      renewalPromise = api.post('/crm/refresh')
        .then((response) => get().acceptSession(response))
        .finally(() => { renewalPromise = null; });
    }
    return renewalPromise;
  },

  restoreSession: async () => {
    if (get().sessionChecked) return get().isAuthenticated;
    if (!restorePromise) {
      // Discard access tokens persisted by the previous implementation.
      if (typeof window !== 'undefined') window.localStorage.removeItem('admin-auth');
      restorePromise = get().renewSession()
        .then(() => true)
        .catch(() => {
          set({ ...emptySession, loading: false, sessionChecked: true });
          return false;
        })
        .finally(() => { restorePromise = null; });
    }
    return restorePromise;
  },

  clearSession: () => {
    set({ ...emptySession, loading: false, sessionChecked: true, error: null });
  },

  logout: async () => {
    try {
      await api.post('/crm/logout');
    } catch {
      // The local session is cleared even if the server is unavailable.
    } finally {
      get().clearSession();
    }
  },

  setUser: (user) => set({ user }),
  setPermissions: (permissions) => set({ permissions }),
  hasPermission: (key) => {
    const permissions = get().permissions;
    if (!permissions || permissions[key] === undefined) return true;
    return [true, 1, '1', 'true'].includes(permissions[key]);
  },
  resetError: () => set({ error: null }),
  getToken: () => get().token,
  getBranchId: () => get().branch_id,
  refreshUser: () => get().renewSession(),
}));
