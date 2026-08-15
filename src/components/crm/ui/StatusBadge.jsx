'use client';

export default function StatusBadge({ status }) {
  const statusMap = {
    'DRAFT': { 
      label: 'Draft', 
      bg: 'bg-gray-100', 
      text: 'text-gray-700',
      border: 'border-gray-300'
    },
    'PENDING': { 
      label: 'Pending', 
      bg: 'bg-amber-50', 
      text: 'text-amber-700',
      border: 'border-amber-300'
    },
    'UNDER_REVIEW': { 
      label: 'Under Review', 
      bg: 'bg-blue-50', 
      text: 'text-blue-700',
      border: 'border-blue-300'
    },
    'KYC_VERIFIED': { 
      label: 'KYC Verified', 
      bg: 'bg-emerald-50', 
      text: 'text-emerald-700',
      border: 'border-emerald-300'
    },
    'GOLD_EVALUATED': { 
      label: 'Gold Evaluated', 
      bg: 'bg-purple-50', 
      text: 'text-purple-700',
      border: 'border-purple-300'
    },
    'OFFER_ACCEPTED': { 
      label: 'Offer Accepted', 
      bg: 'bg-indigo-50', 
      text: 'text-indigo-700',
      border: 'border-indigo-300'
    },
    'APPROVED': { 
      label: 'Approved', 
      bg: 'bg-emerald-50', 
      text: 'text-emerald-700',
      border: 'border-emerald-300'
    },
    'READY_FOR_TRANSFER': { 
      label: 'Ready for Transfer', 
      bg: 'bg-teal-50', 
      text: 'text-teal-700',
      border: 'border-teal-300'
    },
    'TRANSFERRED': { 
      label: 'Transferred', 
      bg: 'bg-emerald-50', 
      text: 'text-emerald-700',
      border: 'border-emerald-300'
    },
    'ACTIVE': { 
      label: 'Active', 
      bg: 'bg-green-50', 
      text: 'text-green-700',
      border: 'border-green-300'
    },
    'OVERDUE': { 
      label: 'Overdue', 
      bg: 'bg-orange-50', 
      text: 'text-orange-700',
      border: 'border-orange-300'
    },
    'NPA': { 
      label: 'NPA', 
      bg: 'bg-red-50', 
      text: 'text-red-700',
      border: 'border-red-300'
    },
    'CLOSED': { 
      label: 'Closed', 
      bg: 'bg-gray-100', 
      text: 'text-gray-700',
      border: 'border-gray-300'
    },
    'REJECTED': { 
      label: 'Rejected', 
      bg: 'bg-red-50', 
      text: 'text-red-700',
      border: 'border-red-300'
    },
    // Follow-up statuses
    'FOLLOW_UP': { 
      label: 'Follow Up', 
      bg: 'bg-pink-50', 
      text: 'text-pink-700',
      border: 'border-pink-300'
    },
    'OFFER_PENDING': { 
      label: 'Offer Pending', 
      bg: 'bg-yellow-50', 
      text: 'text-yellow-700',
      border: 'border-yellow-300'
    },
    'PENDING_EVALUATION': { 
      label: 'Pending Evaluation', 
      bg: 'bg-purple-50', 
      text: 'text-purple-700',
      border: 'border-purple-300'
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