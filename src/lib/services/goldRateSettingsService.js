import api from '@/utils/axiosInsatnce';

export async function getCurrentGoldRateSetting() {
  const response = await api.get('/crm/gold-rate-settings/current');
  return response.data;
}

export async function getGoldRateSettings(params = {}) {
  return api.get('/crm/gold-rate-settings', { params });
}

export async function createGoldRateSetting(payload) {
  const response = await api.post('/crm/gold-rate-settings', payload);
  return response.data;
}
