'use client';

import CallButton from '@/components/crm/ui/CallButton';
import KYCVerificationButton from '@/components/crm/action-buttons/KYCVerificationButton';
import ApplicationStatusButton from '@/components/crm/application-status/ApplicationStatusButton';
import KycVerificationBadge from '@/components/crm/ui/KycVerificationBadge';

export default function CreateCustomerTableRow({ application, index, isDark, onStatusClick }) {
  const cellStyle = `px-3 py-3 text-center border-r last:border-r-0 ${
    isDark ? 'border-gold-600/80' : 'border-gold-300/90'
  }`;
  const primaryText = isDark ? 'text-gray-100' : 'text-gray-900';
  const secondaryText = isDark ? 'text-gray-400' : 'text-gray-600';
  const rowStyle = index % 2 === 0
    ? isDark ? 'bg-gray-800/50' : 'bg-white'
    : isDark ? 'bg-gray-800/30' : 'bg-gold-50/30';

  return (
    <tr className={`border-b transition-colors ${rowStyle} ${
      isDark ? 'border-gold-700/30 hover:bg-gray-700/50' : 'border-gold-100 hover:bg-gold-50/50'
    }`}>
      <td className={cellStyle}>
        <span className="font-mono text-sm font-semibold text-gold-600 dark:text-gold-400">
          {application.applicationNo || '—'}
        </span>
      </td>

      <td className={cellStyle}>
        <span className={`text-sm ${secondaryText}`}>{application.source || '—'}</span>
      </td>

      <td className={cellStyle}>
        <CallButton mobile={application.mobile} isDark={isDark} />
      </td>

      <td className={cellStyle}>
        <span className={`text-sm ${secondaryText}`}>{application.branchName || '—'}</span>
      </td>

      <td className={cellStyle}>
        <span className={`text-sm font-medium ${primaryText}`}>{application.name || '—'}</span>
      </td>

      <td className={cellStyle}>
        <span className={`font-mono text-sm ${secondaryText}`}>{application.mobile || '—'}</span>
      </td>

      <td className={cellStyle}>
        <span className={`text-sm ${secondaryText}`}>{application.email || '—'}</span>
      </td>

      <td className={cellStyle}>
        <span className={`whitespace-nowrap text-sm ${secondaryText}`}>{application.createdOn || '—'}</span>
      </td>

      <td className={cellStyle}>
        <KycVerificationBadge verified={application.kycVerified} />
      </td>

      <td className={cellStyle}>
        <ApplicationStatusButton application={application} onClick={onStatusClick} />
      </td>

      <td className={cellStyle}>
        <KYCVerificationButton
          applicationId={application.id}
          isDark={isDark}
        />
      </td>
    </tr>
  );
}
