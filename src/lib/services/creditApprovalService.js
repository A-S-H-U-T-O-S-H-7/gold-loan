import api from '@/utils/axiosInsatnce';

export async function getCreditApprovalApplications(params = {}) {
  return api.get('/crm/applications', { params: { ...params, status: 'CREDIT_APPROVAL' } });
}

export async function getCreditReview(applicationId) {
  const response = await api.get(`/crm/applications/credit-review/${applicationId}`);
  return response.data;
}

export async function saveCreditReview(applicationId, payload) {
  const response = await api.put(`/crm/applications/credit-review/${applicationId}`, payload);
  return response.data;
}

export async function recordCreditDecision(reviewId, payload) {
  const response = await api.post(`/crm/credit-reviews/decision/${reviewId}`, payload);
  return response.data;
}

export async function changeCreditApprovalStatus(applicationId, status, remark) {
  const response = await api.patch(`/crm/applications/status/${applicationId}`, { status, remark });
  return response.data;
}
