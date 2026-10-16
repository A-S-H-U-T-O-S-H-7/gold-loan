import api from '@/utils/axiosInsatnce';

export const getManageApplications = (params = {}) => api.get('/crm/manage-applications', { params });
export const getLoanAccountDetail = async (id) => (await api.get(`/crm/loan-accounts/detail/${id}`)).data;
export const getLoanSchedule = async (id) => (await api.get(`/crm/loan-accounts/schedule/${id}`)).data;
export const getLoanPayments = async (id) => (await api.get(`/crm/loan-accounts/payments/${id}`)).data;
export const getLoanDocument = (path) => api.get(path, { responseType: 'blob' });
