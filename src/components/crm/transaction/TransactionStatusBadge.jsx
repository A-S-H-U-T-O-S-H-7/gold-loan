'use client';

export default function TransactionStatusBadge({ status }) {
  const statusMap = {
    'READY_FOR_TRANSFER': { 
      label: 'Pending', 
      bg: 'bg-amber-50', 
      text: 'text-amber-700',
      border: 'border-amber-300'
    },
    'TRANSFERRED': { 
      label: 'Transferred', 
      bg: 'bg-emerald-50', 
      text: 'text-emerald-700',
      border: 'border-emerald-300'
    },
    'FAILED': { 
      label: 'Failed', 
      bg: 'bg-red-50', 
      text: 'text-red-700',
      border: 'border-red-300'
    },
  };

  const { label, bg, text, border } = statusMap[status] || { 
    label: status || 'Unknown', 
    bg: 'bg-gray-100', 
    text: 'text-gray-700',
    border: 'border-gray-300'
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${bg} ${text} ${border}`}>
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current opacity-60"></span>
      {label}
    </span>
  );
}