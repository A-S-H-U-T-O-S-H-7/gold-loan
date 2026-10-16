import api from '@/utils/axiosInsatnce';

export function getLoanOfferApplications(params = {}) {
  return api.get('/crm/applications', { params: { status: 'LOAN_OFFER', ...params } });
}

export function getApplicationOffer(id) { return api.get(`/crm/applications/offer/${id}`); }
export function saveApplicationOffer(id, payload) { return api.put(`/crm/applications/offer/${id}`, payload); }
export function recordOfferDecision(offerId, payload) { return api.post(`/crm/loan-offers/decision/${offerId}`, payload); }
export function changeLoanOfferStatus(id, status, remark) { return api.patch(`/crm/applications/status/${id}`, { status, remark }); }
