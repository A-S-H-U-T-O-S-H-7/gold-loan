export function safeCrmReturnPath(value, fallback) {
  if (typeof value !== 'string' || !value.startsWith('/crm/') || value.includes('\\')) return fallback;
  try {
    const parsed = new URL(value, 'http://crm.local');
    if (parsed.origin !== 'http://crm.local' || !parsed.pathname.startsWith('/crm/')) return fallback;
    return `${parsed.pathname}${parsed.search}`;
  } catch {
    return fallback;
  }
}

export function crmDetailLink(path, returnTo) {
  const source = safeCrmReturnPath(returnTo, '');
  return source ? `${path}?returnTo=${encodeURIComponent(source)}` : path;
}
