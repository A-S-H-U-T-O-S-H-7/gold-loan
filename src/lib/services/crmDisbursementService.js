import api from '@/utils/axiosInsatnce';

export const getDisburseApplications = (params = {}) => api.get('/crm/applications', { params: { ...params, status: 'DISBURSE' } });
export const getReadyForTransferApplications = (params = {}) => api.get('/crm/applications', { params: { ...params, status: 'READY_FOR_TRANSFER' } });
export const getDisbursedApplications = (params = {}) => api.get('/crm/applications', { params: { ...params, status: 'DISBURSED' } });
export async function getDisbursement(id) { return (await api.get(`/crm/applications/disbursement/${id}`)).data; }
export async function uploadAgreement(id, file) {
  const response = await api.post(`/crm/applications/disbursement/agreement-file/${id}`, file, { headers: { 'Content-Type': 'application/octet-stream' }, timeout: 30000 });
  return response.data.fileKey;
}
export async function saveReadiness(id, payload) { return (await api.post(`/crm/applications/disbursement/readiness/${id}`, payload)).data; }
export async function prepareTransfer(id) { return (await api.post(`/crm/applications/prepare-transfer/${id}`)).data; }
export const getTransactions = (params = {}) => api.get('/crm/transactions', { params });
export async function getDisbursementDetail(id) { return (await api.get(`/crm/disbursements/detail/${id}`)).data; }
export async function uploadReceipt(disbursementId, file) {
  const response = await api.post(`/crm/disbursements/receipt/${disbursementId}`, file, { headers: { 'Content-Type': 'application/octet-stream' }, timeout: 30000 });
  return response.data.fileKey;
}
export async function recordManualTransfer(disbursementId, payload) { return (await api.post(`/crm/disbursements/manual-transfer/${disbursementId}`, payload)).data; }
export async function getPaymentDocument(path) { return api.get(path, { responseType: 'blob' }); }
