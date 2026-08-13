import { useLoanStore } from '@/lib/store/loanStore';
import { nextId } from '@/lib/utils/format';
import { allocatePayment, getServicing } from '@/lib/utils/loanMath';

export const paymentService = {
  getHistory: () =>
    useLoanStore
      .getState()
      .applications.flatMap((a) =>
        (a.payments || []).map((p) => ({
          ...p,
          applicationId: a.id,
          customer: a.customer?.name,
          mobile: a.customer?.mobile,
        }))
      )
      .sort((a, b) => new Date(b.date) - new Date(a.date)),

  getCollectable: () =>
    useLoanStore
      .getState()
      .applications.filter((a) => ['ACTIVE', 'OVERDUE', 'NPA'].includes(a.status)),

  getBook: () =>
    useLoanStore
      .getState()
      .applications.filter((a) => ['ACTIVE', 'OVERDUE', 'NPA'].includes(a.status)),

  snapshot: (app) => getServicing(app, useLoanStore.getState().config),

  collectPayment: (id, payload) => {
    const store = useLoanStore.getState();
    const app = store.getApplication(id);
    const split = allocatePayment(app, payload.amount, store.config);
    const entry = store.addPayment(id, {
      ...payload,
      ...split,
    });

    const updated = store.getApplication(id);
    const snap = getServicing(updated, store.config);

    if (payload.type === 'Full' || payload.type === 'Foreclosure' || snap.outstanding <= 0) {
      store.patchApplication(id, (item) => ({
        ...item,
        status: 'CLOSED',
        timeline: { ...item.timeline, closedAt: new Date().toISOString() },
      }));
    } else {
      store.patchApplication(id, (item) => ({
        ...item,
        status: snap.servicingStatus,
      }));
    }

    return entry;
  },

  generateReceipt: (payment) => payment?.receipt || nextId('RCT', []),

  outstandingOf: (app) => getServicing(app, useLoanStore.getState().config).outstanding,
  nextDueOf: (app) => getServicing(app, useLoanStore.getState().config).nextDue,
  daysOverdueOf: (app) => getServicing(app, useLoanStore.getState().config).daysPastDue,
};
