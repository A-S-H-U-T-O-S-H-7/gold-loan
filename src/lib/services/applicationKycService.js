import api from '@/utils/axiosInsatnce';

export async function getApplicationKyc(id) {
  const response = await api.get(`/crm/applications/kyc/${id}`);
  return response.data;
}

export async function saveApplicationKyc(id, details, documents) {
  const response = await api.put(`/crm/applications/kyc/${id}`, { details, documents });
  return response.data;
}

export async function verifyApplicationKyc(id) {
  const response = await api.post(`/crm/applications/kyc/verify/${id}`);
  return response.data;
}

export async function uploadKycDocument(id, documentType, file) {
  const response = await api.post(`/crm/applications/kyc/documents/${id}`, file, {
    params: { document_type: documentType },
    headers: { 'Content-Type': 'application/octet-stream' },
    timeout: 30000,
  });
  return response.data.file_key;
}

export async function getKycDocument(id, documentType) {
  return api.get(`/crm/applications/kyc/document/${encodeURIComponent(documentType)}/${id}`, {
    responseType: 'blob',
  });
}
