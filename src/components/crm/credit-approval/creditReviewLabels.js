export const reviewLabels = {
  AWAITING_REVIEW: 'Awaiting Review',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  NEEDS_REVIEW: 'Needs Review',
};

export const offerDecisionLabels = {
  AWAITING_DECISION: 'Awaiting Decision',
  ACCEPTED: 'Accepted',
  DECLINED: 'Declined',
};

export function formatMoney(value) {
  if (value == null) return '—';
  return `₹${Number(value).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
}

export function formatDateTime(value) {
  return value ? new Date(value).toLocaleString('en-IN') : '—';
}

// Turns API enums such as "BULLET_REPAYMENT" into "Bullet Repayment".
export function humanize(value) {
  if (!value) return '—';
  return value
    .toLowerCase()
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// A review only counts while the KYC, evaluation and offer it was based on are unchanged.
export function reviewStatusLabel(decision, isValid) {
  if (decision && !isValid) return 'Review Expired';
  return reviewLabels[decision] || 'Awaiting Review';
}
