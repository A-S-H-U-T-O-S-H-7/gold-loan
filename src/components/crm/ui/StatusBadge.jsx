'use client';

import { STATUS_META } from '@/lib/constants/crm';

const TONE_CLASS = {
  success: 'bg-success-light text-success',
  warning: 'bg-warning-light text-warning',
  danger: 'bg-danger-light text-danger',
  info: 'bg-info-light text-info',
  muted: 'bg-background-secondary text-foreground-muted',
};

export default function StatusBadge({ status, className = '' }) {
  const meta = STATUS_META[status] || { label: status || 'Unknown', tone: 'muted' };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap ${TONE_CLASS[meta.tone]} ${className}`}
    >
      {meta.label}
    </span>
  );
}
