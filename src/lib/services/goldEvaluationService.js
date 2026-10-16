import api from '@/utils/axiosInsatnce';

export async function getGoldEvaluationApplications(params = {}) {
  return api.get('/crm/applications', { params: { status: 'GOLD_EVALUATION', ...params } });
}

export async function getEvaluation(id) {
  const response = await api.get(`/crm/applications/evaluation/${id}`);
  return response.data;
}

export async function saveEvaluationDraft(id, payload) {
  const response = await api.put(`/crm/applications/evaluation/${id}`, payload);
  return response.data;
}

export async function finalizeEvaluation(id) {
  const response = await api.post(`/crm/applications/evaluation/finalize/${id}`);
  return response.data;
}

export async function refreshEvaluationRates(id) {
  const response = await api.post(`/crm/applications/evaluation/refresh-rates/${id}`);
  return response.data;
}

export async function changeEvaluationApplicationStatus(id, status, remark) {
  const response = await api.patch(`/crm/applications/status/${id}`, { status, remark });
  return response.data;
}

export async function uploadGoldItemImage(id, file) {
  const response = await api.post(`/crm/applications/evaluation/images/${id}`, file, {
    headers: { 'Content-Type': 'application/octet-stream' },
    timeout: 30000,
  });
  return response.data.file_key;
}

export function getGoldItemImage(imageId) {
  return api.get(`/crm/applications/evaluation/image/${imageId}`, { responseType: 'blob' });
}
