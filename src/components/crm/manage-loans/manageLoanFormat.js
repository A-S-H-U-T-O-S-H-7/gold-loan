export function formatMoney(value) {
  if (value == null) return '—';
  return `₹${Number(value).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatDate(value) {
  return value ? new Date(value).toLocaleDateString('en-IN') : '—';
}

export function formatDateTime(value) {
  return value ? new Date(value).toLocaleString('en-IN') : '—';
}

export function orDash(value) {
  return value == null || value === '' ? '—' : value;
}

// Turns API enums such as "MONTHLY_INTEREST" into "Monthly Interest".
export function humanize(value) {
  if (!value) return '—';
  return String(value)
    .toLowerCase()
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function joinAddress(address) {
  if (!address) return '—';
  return [address.houseNo, address.address, address.city, address.state, address.pinCode].filter(Boolean).join(', ') || '—';
}
