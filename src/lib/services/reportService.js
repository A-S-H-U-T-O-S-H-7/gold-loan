import { useLoanStore } from '@/lib/store/loanStore';
import { paymentService } from '@/lib/services/paymentService';
import { BRANCHES } from '@/lib/constants/crm';

export const reportService = {
  branchPerformance: () => {
    const apps = useLoanStore.getState().applications;
    const branches = useLoanStore.getState().branches.length
      ? useLoanStore.getState().branches
      : BRANCHES;

    return branches.map((branch) => {
      const list = apps.filter((a) => a.branchId === branch.id);
      const disbursed = list.filter((a) =>
        ['ACTIVE', 'OVERDUE', 'NPA', 'CLOSED', 'TRANSFERRED'].includes(a.status)
      );
      const amount = disbursed.reduce((sum, a) => sum + (a.loan?.amount || 0), 0);
      return {
        ...branch,
        applications: list.length,
        disbursed: disbursed.length,
        amount,
        npa: list.filter((a) => a.status === 'NPA').length,
        overdue: list.filter((a) => a.status === 'OVERDUE').length,
      };
    });
  },

  disbursementReport: () =>
    useLoanStore
      .getState()
      .applications.filter((a) => a.timeline?.transferredAt || a.timeline?.disbursedAt)
      .map((a) => ({
        id: a.id,
        customer: a.customer?.name,
        amount: a.loan?.amount || 0,
        mode: a.disbursement?.mode || '—',
        date: a.timeline?.transferredAt || a.timeline?.disbursedAt,
        status: a.status,
        branchId: a.branchId,
      })),

  npaReport: () =>
    useLoanStore
      .getState()
      .applications.filter((a) => a.status === 'NPA' || a.status === 'OVERDUE')
      .map((a) => ({
        ...a,
        outstanding: paymentService.outstandingOf(a),
        daysOverdue: paymentService.daysOverdueOf(a),
      })),

  goldSummary: () => {
    const lockers = useLoanStore.getState().lockers.filter((l) => l.status === 'Occupied');
    const byType = lockers.reduce((acc, locker) => {
      const type = locker.goldType || 'Unknown';
      acc[type] = (acc[type] || 0) + Number(locker.weight || 0);
      return acc;
    }, {});
    return {
      lockersOccupied: lockers.length,
      totalWeight: lockers.reduce((sum, l) => sum + Number(l.weight || 0), 0),
      byType,
    };
  },

  auditLogs: () => useLoanStore.getState().auditLogs,
};
