import { useLoanStore } from '@/lib/store/loanStore';

export const vaultService = {
  getInventory: () => useLoanStore.getState().lockers,

  getAvailableLockers: () =>
    useLoanStore.getState().lockers.filter((l) => l.status === 'Available'),

  assignLocker: (applicationId, lockerId) =>
    useLoanStore.getState().assignLocker(applicationId, lockerId),

  getReleaseQueue: () =>
    useLoanStore
      .getState()
      .applications.filter((a) => a.status === 'CLOSED' && !a.goldReleased),

  releaseGold: (applicationId) => useLoanStore.getState().releaseLocker(applicationId),
};
