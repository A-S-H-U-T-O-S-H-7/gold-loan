// Razorpay's public IFSC directory. It needs no key and allows browser requests.
// Plain fetch, not the CRM axios instance, so the admin token never leaves our API.
const cache = new Map();

export async function lookupIfsc(code) {
  if (cache.has(code)) return cache.get(code);
  const response = await fetch(`https://ifsc.razorpay.com/${encodeURIComponent(code)}`);
  if (response.status === 404) return null;
  if (!response.ok) throw new Error('IFSC lookup failed');
  const data = await response.json();
  const branch = {
    bankName: data.BANK || '',
    branchName: data.BRANCH || '',
    address: data.ADDRESS || '',
  };
  cache.set(code, branch);
  return branch;
}
