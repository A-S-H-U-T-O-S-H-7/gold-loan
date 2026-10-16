import api from '@/utils/axiosInsatnce';

export async function getPendingApplications(params = {}) {
  return api.get('/crm/applications', { params: { status: 'PENDING', ...params } });
}

export async function createCrmApplication(payload) {
  const response = await api.post('/crm/applications', payload);
  return response.data;
}

export async function changePendingApplicationStatus(id, status, remark) {
  const response = await api.patch(`/crm/applications/status/${id}`, { status, remark });
  return response.data;
}

export function formatPendingApplicationForUI(application) {
  const createdAt = application.createdAt ? new Date(application.createdAt) : null;
  return {
    id: application.id,
    applicationNo: application.applicationNo || String(application.id),
    name: application.name || '',
    mobile: application.mobile || '',
    email: application.email || '',
    source: application.source || '',
    branchName: application.branchName || 'Unassigned',
    createdOn: createdAt && !Number.isNaN(createdAt.getTime())
      ? createdAt.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
      : '',
    kycVerified: application.kycVerified === true,
    status: application.status || 'PENDING',
  };
}
