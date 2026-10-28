'use client';

const tones = {
  amber: { light: 'border-amber-300 bg-amber-50 text-amber-700', dark: 'border-amber-700 bg-amber-900/30 text-amber-300' },
  emerald: { light: 'border-emerald-300 bg-emerald-50 text-emerald-700', dark: 'border-emerald-700 bg-emerald-900/30 text-emerald-300' },
  red: { light: 'border-red-300 bg-red-50 text-red-700', dark: 'border-red-700 bg-red-900/30 text-red-300' },
  gray: { light: 'border-gray-300 bg-gray-50 text-gray-700', dark: 'border-gray-600 bg-gray-700/50 text-gray-300' },
};

const statusMap = {
  NOT_STARTED: { label: 'Not Started', tone: 'amber' },
  PENDING: { label: 'Pending', tone: 'amber' },
  UNKNOWN: { label: 'Unknown', tone: 'amber' },
  SUCCESS: { label: 'Success', tone: 'emerald' },
  FAILED: { label: 'Failed', tone: 'red' },
};

export default function TransactionStatusBadge({ status, isDark = false }) {
  const { label, tone } = statusMap[status] || { label: status || 'Unknown', tone: 'gray' };

  return (
    <span className={`inline-flex items-center whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-semibold ${tones[tone][isDark ? 'dark' : 'light']}`}>
      <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current opacity-60" />
      {label}
    </span>
  );
}
