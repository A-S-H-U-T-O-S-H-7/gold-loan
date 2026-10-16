import api from '@/utils/axiosInsatnce';

export function getRejectedApplications(params = {}) {
  return api.get('/crm/applications', { params: { status: 'REJECTED', ...params } });
}
