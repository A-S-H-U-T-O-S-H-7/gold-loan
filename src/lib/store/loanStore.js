'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  seedApplications,
  seedLockers,
  seedUsers,
  seedRoles,
  seedConfig,
  seedBranches,
} from '@/lib/data/mockLoans';
import { nextId } from '@/lib/utils/format';

const now = () => new Date().toISOString();

export const useLoanStore = create(
  persist(
    (set, get) => ({
      applications: seedApplications,
      lockers: seedLockers,
      users: seedUsers,
      roles: seedRoles,
      branches: seedBranches,
      config: seedConfig,
      auditLogs: [
        { id: 'AUD-001', action: 'Seeded CRM workspace', actor: 'System', at: now(), meta: 'Initial mock data' },
      ],

      getApplication: (id) => get().applications.find((a) => a.id === id),

      addAudit: (action, meta = '', actor = 'Admin') =>
        set((state) => ({
          auditLogs: [
            { id: nextId('AUD', state.auditLogs), action, actor, at: now(), meta },
            ...state.auditLogs,
          ],
        })),

      addApplication: (payload) => {
        const id = nextId('APP', get().applications);
        const application = {
          id,
          status: payload.status || 'DRAFT',
          rejectedStage: null,
          rejectedReason: null,
          previousStatus: null,
          customer: payload.customer,
          gold: payload.gold || null,
          loan: payload.loan || null,
          payments: [],
          repaymentSchedule: [],
          timeline: { createdAt: now(), ...(payload.timeline || {}) },
          followUp: { count: 0, lastCall: null, nextFollowUp: null, history: [] },
          branchId: payload.branchId || 1,
          createdBy: payload.createdBy || 'USER-001',
          lockerId: null,
          goldReleased: false,
          disbursement: null,
          transaction: null,
          creditChecklist: null,
        };
        set((state) => ({ applications: [application, ...state.applications] }));
        get().addAudit('Created customer', id);
        return application;
      },

      updateApplication: (id, patch) => {
        set((state) => ({
          applications: state.applications.map((item) =>
            item.id === id ? { ...item, ...patch, customer: { ...item.customer, ...(patch.customer || {}) } } : item
          ),
        }));
        return get().getApplication(id);
      },

      patchApplication: (id, updater) => {
        set((state) => ({
          applications: state.applications.map((item) =>
            item.id === id ? updater(item) : item
          ),
        }));
        return get().getApplication(id);
      },

      setStatus: (id, status, extra = {}) => {
        const current = get().getApplication(id);
        set((state) => ({
          applications: state.applications.map((item) =>
            item.id === id
              ? {
                  ...item,
                  previousStatus: item.status,
                  status,
                  ...extra,
                }
              : item
          ),
        }));
        get().addAudit(`Status ${current?.status} → ${status}`, id);
        return get().getApplication(id);
      },

      addCallLog: (id, log) => {
        const entry = { id: nextId('CALL', get().getApplication(id)?.followUp?.history || []), at: now(), ...log };
        set((state) => ({
          applications: state.applications.map((item) => {
            if (item.id !== id) return item;
            const history = [entry, ...(item.followUp?.history || [])];
            return {
              ...item,
              followUp: {
                count: history.length,
                lastCall: entry.at,
                nextFollowUp: log.nextFollowUp || null,
                history,
              },
            };
          }),
        }));
        get().addAudit('Call logged', id);
        return get().getApplication(id);
      },

      addPayment: (id, payment) => {
        const entry = {
          id: nextId('PAY', get().applications.flatMap((a) => a.payments || [])),
          date: now(),
          receipt: nextId('RCT', get().applications.flatMap((a) => a.payments || [])),
          ...payment,
        };
        set((state) => ({
          applications: state.applications.map((item) =>
            item.id === id ? { ...item, payments: [entry, ...(item.payments || [])] } : item
          ),
        }));
        get().addAudit(`Payment ${entry.amount}`, `${id} / ${entry.receipt}`);
        return entry;
      },

      assignLocker: (applicationId, lockerId) => {
        const app = get().getApplication(applicationId);
        set((state) => ({
          lockers: state.lockers.map((locker) => {
            if (locker.id === lockerId) {
              return {
                ...locker,
                status: 'Occupied',
                goldType: app?.gold?.items?.[0]?.name || app?.gold?.type || null,
                weight: app?.gold?.netWeight || 0,
                applicationId,
              };
            }
            if (locker.applicationId === applicationId) {
              return { ...locker, status: 'Available', goldType: null, weight: 0, applicationId: null };
            }
            return locker;
          }),
          applications: state.applications.map((item) =>
            item.id === applicationId ? { ...item, lockerId } : item
          ),
        }));
        get().addAudit('Locker assigned', `${applicationId} → ${lockerId}`);
      },

      releaseLocker: (applicationId) => {
        set((state) => ({
          lockers: state.lockers.map((locker) =>
            locker.applicationId === applicationId
              ? { ...locker, status: 'Available', goldType: null, weight: 0, applicationId: null }
              : locker
          ),
          applications: state.applications.map((item) =>
            item.id === applicationId ? { ...item, goldReleased: true, lockerId: null } : item
          ),
        }));
        get().addAudit('Gold released', applicationId);
      },

      updateConfig: (patch) => {
        set((state) => ({ config: { ...state.config, ...patch } }));
        get().addAudit('System config updated');
      },

      updateGoldRates: (goldRates) => {
        set((state) => ({ config: { ...state.config, goldRates: { ...state.config.goldRates, ...goldRates } } }));
        get().addAudit('Gold rates updated');
      },

      addBranch: (branch) => {
        const id = Math.max(0, ...get().branches.map((b) => b.id)) + 1;
        const next = { id, status: 'Active', ...branch };
        set((state) => ({ branches: [...state.branches, next] }));
        get().addAudit('Branch created', next.name);
        return next;
      },

      updateBranch: (id, patch) =>
        set((state) => ({
          branches: state.branches.map((b) => (b.id === id ? { ...b, ...patch } : b)),
        })),

      addUser: (user) => {
        const next = { id: nextId('USER', get().users), status: 'Active', ...user };
        set((state) => ({ users: [...state.users, next] }));
        get().addAudit('User created', next.email);
        return next;
      },

      updateUser: (id, patch) =>
        set((state) => ({
          users: state.users.map((u) => (u.id === id ? { ...u, ...patch } : u)),
        })),

      addRole: (role) => {
        const next = { id: nextId('ROLE', get().roles), users: 0, permissions: [], ...role };
        set((state) => ({ roles: [...state.roles, next] }));
        get().addAudit('Role created', next.name);
        return next;
      },

      updateRole: (id, patch) =>
        set((state) => ({
          roles: state.roles.map((r) => (r.id === id ? { ...r, ...patch } : r)),
        })),

      resetDemoData: () =>
        set({
          applications: seedApplications,
          lockers: seedLockers,
          users: seedUsers,
          roles: seedRoles,
          branches: seedBranches,
          config: seedConfig,
        }),
    }),
    { name: 'gold-loan-crm-data-v2' }
  )
);
