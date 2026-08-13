"use client";
import api from "@/utils/axiosInsatnce";
import { ALL_PERMISSIONS } from "@/lib/constants/crm";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const encodeToken = (token) => (token ? btoa(token) : null);
const decodeToken = (encoded) => (encoded ? atob(encoded) : null);
const getLoggedOutState = () => ({
  token: null,
  user: null,
  permissions: null,
  branch_id: null, // Add branch_id to store
  isAuthenticated: false,
  loading: false,
  error: null,
});

export const useAdminAuthStore = create(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      permissions: null,
      branch_id: null,
      isAuthenticated: false,
      loading: true,
      error: null,

      login: async (credentials) => {
        try {
          set({ loading: true, error: null });

          const loginData = {
            ...credentials,
            branch_id: parseInt(credentials.branch_id, 10) || 1,
          };

          const isDemo =
            String(credentials.username || '').trim().toLowerCase() === 'admin' &&
            String(credentials.password || '') === 'admin';

          if (isDemo) {
            set({
              token: encodeToken('demo-token'),
              user: {
                name: 'Branch Admin',
                email: 'admin@goldloan.in',
                username: 'admin',
                selfie: null,
              },
              permissions: ALL_PERMISSIONS,
              branch_id: loginData.branch_id,
              isAuthenticated: true,
              loading: false,
              error: null,
            });
            return;
          }

          const response = await api.post("/crm/login", loginData);
          const { admin, token } = response;
          const permissions = admin.permissions || {};
          const { permissions: _, ...userWithoutPermissions } = admin;

          set({
            token: encodeToken(token),
            user: userWithoutPermissions,
            permissions,
            branch_id: admin.branch_id || loginData.branch_id,
            isAuthenticated: true,
            loading: false,
          });
        } catch (err) {
          set({
            error: err.response?.data?.message || "Login failed",
            loading: false,
          });
        }
      },
      
      logout: async () => {
        const token = get().getToken();

        try {
          if (token && token !== 'demo-token') {
            await api.get("/crm/logout");
          }
        } catch (err) {
          console.error("Logout API failed:", err.response?.data?.message || err.message);
        } finally {
          set(getLoggedOutState());
        }
      },
      
      setUser: (user) => set({ user }),
      
      setPermissions: (permissions) => set({ permissions }),
      
      hasPermission: (permissionKey) => {
        const { permissions, token } = get();
        if (decodeToken(token) === 'demo-token') return true;
        if (!permissions) return true;

        const permissionValue = permissions[permissionKey];
        if (permissionValue === undefined) return true;

        return permissionValue === true ||
               permissionValue === 1 ||
               permissionValue === '1' ||
               permissionValue === 'true';
      },
      
      resetError: () => set({ error: null }),
      
      getToken: () => {
        const encoded = get().token;
        return decodeToken(encoded);
      },

      getBranchId: () => {
        return get().branch_id;
      },

      refreshUser: async () => {
        try {
          const token = get().getToken();
          if (!token) return;
          
          set({ loading: true, error: null });
          const response = await api.get("/crm/me");
          
          const admin = response.admin || response;
          const permissions = admin.permissions || {};
          const { permissions: _, ...userWithoutPermissions } = admin;
          
          set({
            user: userWithoutPermissions,
            permissions: permissions,
            branch_id: admin.branch_id || get().branch_id,
            isAuthenticated: true,
            loading: false,
          });
        } catch (err) {
          set({
            error: "Failed to refresh user data",
            loading: false,
            isAuthenticated: false,
          });
        }
      },
    }),
    {
      name: "admin-auth",
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        permissions: state.permissions,
        branch_id: state.branch_id,
        isAuthenticated: state.isAuthenticated,
      }),
      
      onRehydrateStorage: () => (state) => {
        if (state) state.loading = false;
      },
    }
  )
);