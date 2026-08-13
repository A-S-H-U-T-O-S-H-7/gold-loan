import { useLoanStore } from '@/lib/store/loanStore';
import { approvedOf } from '@/lib/utils/loanMath';

export const transactionService = {
  getLedger: () =>
    useLoanStore
      .getState()
      .applications.filter((a) => a.status === 'READY_FOR_TRANSFER' || a.status === 'FAILED' || a.transaction),

  completeTransaction: (id, referenceId) => {
    const app = useLoanStore.getState().getApplication(id);
    return useLoanStore.getState().patchApplication(id, (item) => ({
      ...item,
      status: 'ACTIVE',
      transaction: {
        ...(item.transaction || {}),
        status: 'SUCCESS',
        referenceId,
        amount: approvedOf(app),
        mode: item.disbursement?.mode,
        completedAt: new Date().toISOString(),
        failedReason: null,
      },
      timeline: { ...item.timeline, transferredAt: new Date().toISOString() },
      repaymentSchedule: item.repaymentSchedule?.length ? item.repaymentSchedule : buildSchedule(item),
    }));
  },

  failTransaction: (id, reason) =>
    useLoanStore.getState().patchApplication(id, (item) => ({
      ...item,
      status: 'FAILED',
      transaction: {
        ...(item.transaction || {}),
        status: 'FAILED',
        referenceId: null,
        failedReason: reason,
        attemptedAt: new Date().toISOString(),
      },
    })),
};

function buildSchedule(item) {
  if (!item.loan) return [];
  const due = new Date();
  due.setDate(due.getDate() + 30);
  return [
    {
      dueDate: due.toISOString(),
      amount: item.loan.emi || item.loan.amount,
      status: 'Upcoming',
      paidAt: null,
    },
  ];
}
