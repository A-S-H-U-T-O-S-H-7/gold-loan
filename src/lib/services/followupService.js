import { useLoanStore } from '@/lib/store/loanStore';
import { daysBetween } from '@/lib/utils/format';

export const followupService = {
  getList: () =>
    useLoanStore
      .getState()
      .applications.filter((a) => a.status === 'FOLLOW_UP')
      .map((a) => ({
        ...a,
        daysPending: daysBetween(a.timeline?.createdAt),
        priority: getPriority(a),
      })),

  addCallLog: (id, log) => useLoanStore.getState().addCallLog(id, log),

  markKycVerified: (id) =>
    useLoanStore.getState().patchApplication(id, (item) => ({
      ...item,
      status: 'KYC_VERIFIED',
      customer: { ...item.customer, kycVerified: true },
      timeline: { ...item.timeline, kycVerifiedAt: new Date().toISOString() },
    })),

  reject: (id, reason) =>
    useLoanStore.getState().setStatus(id, 'REJECTED', {
      rejectedStage: 'KYC',
      rejectedReason: reason || 'Rejected during follow-up',
    }),
};

function getPriority(app) {
  const days = daysBetween(app.timeline?.createdAt);
  if (days >= 7 || (app.followUp?.count || 0) >= 3) return 'Urgent';
  if ((app.followUp?.count || 0) === 0 && days <= 2) return 'New';
  return 'Normal';
}
