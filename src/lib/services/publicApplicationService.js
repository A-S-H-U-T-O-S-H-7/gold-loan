const baseUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api').trim().replace(/\/$/, '');

async function publicRequest(path, options) {
  const response = await fetch(`${baseUrl}${path}`, options);
  const result = await response.json().catch(() => null);
  if (!response.ok) throw new Error(result?.message || 'The request failed. Please try again.');
  return result.data;
}

export function createPublicApplication(payload) {
  return publicRequest('/public/applications', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export function getPublicBranches() {
  return publicRequest('/public/branches');
}
