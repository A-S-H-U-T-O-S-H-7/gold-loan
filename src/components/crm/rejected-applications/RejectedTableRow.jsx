'use client';

import CallButton from '@/components/crm/ui/CallButton';
import StatusBadge from '@/components/crm/ui/StatusBadge';
import KycVerificationBadge from '@/components/crm/ui/KycVerificationBadge';
import KYCVerificationButton from '@/components/crm/action-buttons/KYCVerificationButton';
import RestoreApplicationButton from '@/components/crm/action-buttons/RestoreApplicationButton';

const money = (value) => value == null ? '—' : `₹${Number(value).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
const formatDateTime = (value) => (value ? new Date(value).toLocaleString('en-IN') : '—');

export default function RejectedTableRow({ application, index, isDark, onRestore }) {
  const cell = `border-r px-3 py-3 text-center text-sm last:border-r-0 ${isDark ? 'border-gold-600/80' : 'border-gold-300/90'}`;
  const secondaryText = isDark ? 'text-gray-400' : 'text-gray-600';
  const stripe = index % 2 === 0
    ? isDark ? 'bg-gray-800/50' : 'bg-white'
    : isDark ? 'bg-gray-800/30' : 'bg-gold-50/30';

  return (
    <tr className={`border-b transition-colors ${stripe} ${
      isDark ? 'border-gold-700/30 hover:bg-gray-700/50' : 'border-gold-100 hover:bg-gold-50/50'
    }`}>
      <td className={cell}>
        <span className="font-mono font-semibold text-gold-600 dark:text-gold-400">
          {application.applicationNo || '—'}
        </span>
      </td>
      <td className={cell}>
        <span className={secondaryText}>{application.source || '—'}</span>
      </td>
      <td className={cell}>
        <CallButton mobile={application.mobile} isDark={isDark} />
      </td>
      <td className={cell}>
        <span className={secondaryText}>{application.branchName || 'Unassigned'}</span>
      </td>
      <td className={cell}>
        <span className="font-medium">{application.name || '—'}</span>
      </td>
      <td className={cell}>
        <span className={`font-mono ${secondaryText}`}>{application.mobile || '—'}</span>
      </td>
      <td className={cell}>
        <span className={secondaryText}>{application.email || '—'}</span>
      </td>
      <td className={cell}>
        <span className={secondaryText}>{money(application.requestedAmount)}</span>
      </td>
      <td className={cell}>
        {application.rejectedFrom ? <StatusBadge status={application.rejectedFrom} /> : '—'}
      </td>
      <td className={cell}>
        <span className={secondaryText}>{formatDateTime(application.rejectedAt)}</span>
      </td>
      <td className={cell}>
        <p className={`mx-auto line-clamp-2 max-w-60 text-left wrap-anywhere ${secondaryText}`} title={application.rejectionReason || ''}>
          {application.rejectionReason || '—'}
        </p>
      </td>
      <td className={cell}>
        <div className="flex flex-col items-center gap-2">
          <KycVerificationBadge verified={application.kycVerified} />
          <KYCVerificationButton
            applicationId={application.id}
            isDark={isDark}
            label={application.kycVerified ? 'View KYC' : 'KYC Verification'}
          />
        </div>
      </td>
      <td className={cell}>
        <RestoreApplicationButton onClick={() => onRestore(application)} isDark={isDark} />
      </td>
    </tr>
  );
}
