import { useLoanStore } from '@/lib/store/loanStore';

export const disbursementService = {
  getQueue: () =>
    useLoanStore
      .getState()
      .applications.filter((a) => ['APPROVED', 'FAILED'].includes(a.status)),

  generateDocuments: (id) => ['Loan Agreement', 'Pledge Receipt', 'KYC Acknowledgement'],

  collectSignature: (id, { signatureType, mode }) => {
    const store = useLoanStore.getState();
    const app = store.getApplication(id);
    if (!app?.lockerId) {
      const locker = store.lockers.find((l) => l.status === 'Available');
      if (locker) store.assignLocker(id, locker.id);
    }

    return store.patchApplication(id, (item) => ({
      ...item,
      status: 'READY_FOR_TRANSFER',
      disbursement: {
        mode,
        signatureType,
        signedAt: new Date().toISOString(),
        documents: ['Loan Agreement', 'Pledge Receipt', 'KYC Acknowledgement'],
      },
      transaction: {
        status: 'PENDING',
        amount: item.loan?.approvedAmount || item.loan?.amount,
        mode,
      },
      timeline: { ...item.timeline, disbursedAt: new Date().toISOString() },
    }));
  },
};
