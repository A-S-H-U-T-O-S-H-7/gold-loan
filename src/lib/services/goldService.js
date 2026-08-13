import { useLoanStore } from '@/lib/store/loanStore';
import { GOLD_QUEUE } from '@/lib/constants/crm';
import { freezeValuation } from '@/lib/utils/loanMath';

export const goldService = {
  getEvaluationQueue: () =>
    useLoanStore.getState().applications.filter((a) => GOLD_QUEUE.includes(a.status)),

  calculateFromItems: (items) => {
    const { goldRates, ltv } = useLoanStore.getState().config;
    return freezeValuation(items, goldRates, ltv);
  },

  saveDraft: (id, gold, notes = '') =>
    useLoanStore.getState().setStatus(id, 'PENDING_EVALUATION', {
      gold: { ...gold, remarks: notes || gold.remarks },
    }),

  submitEvaluation: (id, gold, notes = '') => {
    const store = useLoanStore.getState();
    const frozen = gold.eligibleAmount
      ? gold
      : freezeValuation(gold.items || [], store.config.goldRates, store.config.ltv);

    if (!store.getApplication(id)?.lockerId) {
      const locker = store.lockers.find((l) => l.status === 'Available');
      if (locker) store.assignLocker(id, locker.id);
    }

    return store.patchApplication(id, (item) => ({
      ...item,
      gold: { ...frozen, remarks: notes || frozen.remarks },
      loan: {
        ...(item.loan || {}),
        eligibleAmount: frozen.eligibleAmount,
      },
      status: 'GOLD_EVALUATED',
      timeline: { ...item.timeline, goldEvaluatedAt: new Date().toISOString() },
    }));
  },

  reject: (id, reason) =>
    useLoanStore.getState().setStatus(id, 'REJECTED', {
      rejectedStage: 'GOLD_EVALUATION',
      rejectedReason: reason,
    }),

  getRates: () => useLoanStore.getState().config.goldRates,
  getLtv: () => useLoanStore.getState().config.ltv,
  updateRates: (rates) => useLoanStore.getState().updateGoldRates(rates),
  updateLtv: (ltv) => useLoanStore.getState().updateConfig({ ltv: Number(ltv) }),
};
