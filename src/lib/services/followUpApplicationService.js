import api from '@/utils/axiosInsatnce';

export function getFollowUpApplications(params = {}) {
  return api.get('/crm/applications', { params: { status: 'FOLLOW_UP', ...params } });
}

export function changeFollowUpApplicationStatus(id, status, remark) {
  return api.patch(`/crm/applications/status/${id}`, { status, remark });
}

export function formatFollowUpApplicationForUI(application) {
  return {
    id: application.id,
    applicationNo: application.applicationNo || String(application.id),
    source: application.source || '',
    branchName: application.branchName || 'Unassigned',
    name: application.name || '',
    mobile: application.mobile || '',
    currentAddress: application.currentAddress || '',
    requestedAmount: application.requestedAmount,
    followUpRemark: application.followUpRemark || '',
    kycVerified: application.kycVerified === true,
    status: application.status || 'FOLLOW_UP',
  };
}
