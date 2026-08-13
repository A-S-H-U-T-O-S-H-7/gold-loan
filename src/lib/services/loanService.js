import { useLoanStore } from '@/lib/store/loanStore';
import { BOOK_STATUSES, CREDIT_QUEUE, OFFER_QUEUE } from '@/lib/constants/crm';
import { calculatePayable } from '@/lib/utils/format';
import { eligibleOf } from '@/lib/utils/loanMath';

export const loanService = {
  getOfferQueue: () =>
    useLoanStore.getState().applications.filter((a) => OFFER_QUEUE.includes(a.status)),

  getCreditQueue: () =>
    useLoanStore.getState().applications.filter((a) => CREDIT_QUEUE.includes(a.status)),

  getManageQueue: (tab = 'All') => {
    const items = useLoanStore
      .getState()
      .applications.filter((a) => BOOK_STATUSES.includes(a.status));
    if (tab === 'Active') return items.filter((a) => a.status === 'ACTIVE');
    if (tab === 'Overdue') return items.filter((a) => a.status === 'OVERDUE' || a.status === 'NPA');
    if (tab === 'Closed') return items.filter((a) => a.status === 'CLOSED');
    return items;
  },

  suggestedAmount: (app) => eligibleOf(app),

  generateOffer: (id, offer) => {
    const computed = calculatePayable({
      amount: offer.offeredAmount ?? offer.amount,
      rate: offer.rate,
      tenure: offer.tenure,
      repaymentType: offer.repaymentType,
    });
    const offeredAmount = Number(offer.offeredAmount ?? offer.amount);
    return useLoanStore.getState().setStatus(id, 'OFFER_PENDING', {
      loan: {
        ...offer,
        ...computed,
        offeredAmount,
        amount: offeredAmount,
        eligibleAmount: offer.eligibleAmount,
      },
    });
  },

  acceptOffer: (id, note = '') =>
    useLoanStore.getState().patchApplication(id, (item) => ({
      ...item,
      status: 'OFFER_ACCEPTED',
      loan: { ...item.loan, acceptanceNote: note },
      timeline: { ...item.timeline, offerAcceptedAt: new Date().toISOString() },
    })),

  rejectOffer: (id, reason) =>
    useLoanStore.getState().setStatus(id, 'REJECTED', {
      rejectedStage: 'LOAN_OFFER',
      rejectedReason: reason || 'Offer declined',
    }),

  creditApproval: (id, checklist, approvedAmount) =>
    useLoanStore.getState().patchApplication(id, (item) => {
      const approved = Number(approvedAmount);
      const computed = calculatePayable({
        amount: approved,
        rate: item.loan?.rate,
        tenure: item.loan?.tenure,
        repaymentType: item.loan?.repaymentType,
      });
      return {
        ...item,
        creditChecklist: checklist,
        status: 'APPROVED',
        loan: {
          ...item.loan,
          ...computed,
          approvedAmount: approved,
          amount: approved,
        },
        timeline: { ...item.timeline, approvedAt: new Date().toISOString() },
      };
    }),

  sendBackToEvaluation: (id) => useLoanStore.getState().setStatus(id, 'NEEDS_REVIEW'),

  rejectCredit: (id, reason) =>
    useLoanStore.getState().setStatus(id, 'REJECTED', {
      rejectedStage: 'CREDIT_APPROVAL',
      rejectedReason: reason,
    }),

  calculateEmi: (amount, rate, tenure, repaymentType) =>
    calculatePayable({ amount, rate, tenure, repaymentType }),
};
