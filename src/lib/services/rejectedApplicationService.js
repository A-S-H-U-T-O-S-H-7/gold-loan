import api from '@/utils/axiosInsatnce';

export function getRejectedApplications(params = {}) {
  return api.get('/crm/applications', { params: { status: 'REJECTED', ...params } });
}

// Moves a rejected application back to Create Customer (PENDING); a reason is required.
export async function restoreRejectedApplication(id, remark) {
  const response = await api.patch(`/crm/applications/status/${id}`, { status: 'PENDING', remark });
  return response.data;
}
