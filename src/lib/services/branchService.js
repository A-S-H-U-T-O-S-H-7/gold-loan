import api from '@/utils/axiosInsatnce';

export async function getCrmBranches() {
  const response = await api.get('/crm/branches');
  return response.data || [];
}
