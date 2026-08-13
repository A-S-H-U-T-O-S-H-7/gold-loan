import { useLoanStore } from '@/lib/store/loanStore';
import { useAdminAuthStore } from '@/lib/store/authAdminStore';
import { LEAD_QUEUE } from '@/lib/constants/crm';

export const customerService = {
  getLeadQueue: () =>
    useLoanStore.getState().applications.filter((a) => LEAD_QUEUE.includes(a.status)),

  getById: (id) => useLoanStore.getState().getApplication(id),

  createLead: ({ name, mobile, email = '', purpose = '' }) => {
    const branchId = useAdminAuthStore.getState().branch_id || 1;
    return useLoanStore.getState().addApplication({
      status: 'PENDING',
      branchId,
      customer: {
        name,
        mobile,
        email,
        purpose,
        dob: '',
        gender: '',
        address: '',
        aadhaar: '',
        pan: '',
        photo: null,
        kycVerified: false,
        bankDetails: {
          accountNumber: '',
          ifsc: '',
          bankName: '',
          branch: '',
          accountType: 'Savings',
          holderName: name,
        },
      },
    });
  },

  saveKyc: (id, customer, status, rejectReason = '') => {
    const store = useLoanStore.getState();
    const kycVerified = status === 'KYC_VERIFIED';

    if (status === 'REJECTED') {
      return store.patchApplication(id, (item) => ({
        ...item,
        customer: { ...item.customer, ...customer, kycVerified: false },
        status: 'REJECTED',
        previousStatus: item.status,
        rejectedStage: 'KYC',
        rejectedReason: rejectReason || 'KYC rejected',
      }));
    }

    return store.patchApplication(id, (item) => ({
      ...item,
      customer: { ...item.customer, ...customer, kycVerified },
      previousStatus: item.status,
      status,
      timeline: {
        ...item.timeline,
        ...(kycVerified ? { kycVerifiedAt: new Date().toISOString() } : {}),
      },
    }));
  },
};
