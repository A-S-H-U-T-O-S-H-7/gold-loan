'use client';
import CallButton from '../ui/CallButton';
import KYCVerificationButton from '../action-buttons/KYCVerificationButton';
import StatusBadge from '@/components/crm/ui/StatusBadge';

export default function FollowUpTableRow({
  application,
  index,
  isDark = false,
  startIndex = 0
}) {
  const srNo = startIndex + index + 1;
  const name = application.customer?.name || application.name || '—';
  const mobile = application.customer?.mobile || application.mobile || '—';
  const purpose = application.customer?.purpose || application.purpose || '—';
  const status = application.status || 'FOLLOW_UP';
  const daysPending = application.daysPending || 0;

  // Cell styles
  const cellBase = "px-3 py-3 text-center border-r last:border-r-0";
  const cellBorder = isDark ? "border-gold-600/80" : "border-gold-300/90";
  const cellStyle = `${cellBase} ${cellBorder}`;

  const textPrimary = isDark ? "text-gray-100" : "text-gray-900";
  const textSecondary = isDark ? "text-gray-400" : "text-gray-600";

  // Priority badge based on days pending
  const getPriorityBadge = () => {
    if (daysPending > 5) {
      return {
        label: 'Urgent',
        className: isDark 
          ? 'bg-red-900/40 text-red-300 border border-red-700'
          : 'bg-red-100 text-red-700 border border-red-300'
      };
    } else if (daysPending > 2) {
      return {
        label: 'Normal',
        className: isDark 
          ? 'bg-yellow-900/40 text-yellow-300 border border-yellow-700'
          : 'bg-yellow-100 text-yellow-700 border border-yellow-300'
      };
    } else {
      return {
        label: 'New',
        className: isDark 
          ? 'bg-green-900/40 text-green-300 border border-green-700'
          : 'bg-green-100 text-green-700 border border-green-300'
      };
    }
  };

  const priority = getPriorityBadge();

  return (
    <tr
      className={`border-b transition-all duration-200 hover:shadow-md ${
        isDark
          ? "border-gold-700/30 hover:bg-gray-700/50"
          : "border-gold-100 hover:bg-gold-50/50"
      } ${
        index % 2 === 0
          ? isDark
            ? "bg-gray-800/50"
            : "bg-white"
          : isDark
            ? "bg-gray-800/30"
            : "bg-gold-50/30"
      }`}
    >
      {/* SR No */}
      <td className={cellStyle}>
        <span className={`font-medium ${textPrimary}`}>
          {srNo}
        </span>
      </td>

      {/* Call */}
      <td className={cellStyle}>
        <CallButton mobile={mobile} isDark={isDark} />
      </td>

      {/* App ID */}
      <td className={cellStyle}>
        <span className={`font-mono text-sm font-medium text-gold-600 dark:text-gold-400`}>
          {application.id || '—'}
        </span>
      </td>

      {/* CRN No */}
      <td className={cellStyle}>
        <span className={`font-mono text-sm ${textSecondary}`}>
          {application.crnNo || '—'}
        </span>
      </td>

      {/* Name */}
      <td className={cellStyle}>
        <span className={`font-medium text-sm ${textPrimary}`}>
          {name}
        </span>
      </td>

      {/* Mobile */}
      <td className={cellStyle}>
        <span className={`font-mono text-sm ${textSecondary}`}>
          {mobile}
        </span>
      </td>

      {/* Days Pending */}
      <td className={cellStyle}>
        <span className={`text-sm ${textSecondary}`}>
          {daysPending} days
        </span>
      </td>


      {/* Purpose */}
      <td className={cellStyle}>
        <span className={`text-sm ${textSecondary}`}>
          {purpose}
        </span>
      </td>

      {/* Status */}
      <td className={cellStyle}>
        <StatusBadge status={status} />
      </td>

      {/* Actions - Only KYC Verification Button (No Reject) */}
      <td className={`px-3 py-3 text-center border-r last:border-r-0 ${cellBorder}`}>
        <KYCVerificationButton applicationId={application.id} isDark={isDark} />
      </td>
    </tr>
  );
}