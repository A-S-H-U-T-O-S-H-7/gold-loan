'use client';

import StatusBadge from '@/components/crm/ui/StatusBadge';

export default function ApplicationStatusButton({ application, onClick }) {
  return (
    <button
      type="button"
      onClick={() => onClick(application)}
      aria-label={`View status for ${application.name || application.applicationNo}`}
      className="cursor-pointer rounded-full focus:outline-none focus:ring-2 focus:ring-gold-500"
    >
      <StatusBadge status={application.status || 'PENDING'} />
    </button>
  );
}
