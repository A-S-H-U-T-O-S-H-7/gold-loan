const baseUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api').trim().replace(/\/$/, '');

async function request(path) {
  const response = await fetch(`${baseUrl}${path}`);
  const result = await response.json().catch(() => null);
  if (!response.ok) throw new Error(result?.message || 'The request failed. Please try again.');
  return result.data;
}

// Returns [{ id, stateName, stateCode }] sorted by name.
export function getStates() {
  return request('/public/states');
}

// Returns [{ id, stateId, cityName }] sorted by name.
export function getCitiesByState(stateId) {
  return request(`/public/cities/${stateId}`);
}
