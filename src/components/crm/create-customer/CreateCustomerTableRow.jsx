'use client';
import CallButton from '../ui/CallButton';
import KYCVerificationButton from '../action-buttons/KYCVerificationButton';
import StatusBadge from '@/components/crm/ui/StatusBadge';

export default function CreateCustomerTableRow({ 
  application, 
  index, 
  isDark = false,
  startIndex = 0
}) {
  const srNo = startIndex + index + 1;
  const name = application.customer?.name || application.name || '—';
  const mobile = application.customer?.mobile || application.mobile || '—';
  const purpose = application.customer?.purpose || application.purpose || '—';
  const status = application.status || 'DRAFT';

  // EXACT SAME STYLES as RejectedTableRow
  const cellBase = "px-3 py-3 text-center border-r last:border-r-0";
  const cellBorder = isDark ? "border-gold-600/80" : "border-gold-300/90";
  const cellStyle = `${cellBase} ${cellBorder}`;

  const textPrimary = isDark ? "text-gray-100" : "text-gray-900";
  const textSecondary = isDark ? "text-gray-400" : "text-gray-600";

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

      {/* NAME */}
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

      {/* Purpose */}
      <td className={cellStyle}>
        <span className={`text-sm ${textSecondary}`}>
          {purpose}
        </span>
      </td>

      {/* Status - Fixed readability */}
      <td className={cellStyle}>
        <StatusBadge status={status} />
      </td>

      {/* Actions */}
      <td className={`px-3 py-3 text-center border-r last:border-r-0 ${cellBorder}`}>
        <KYCVerificationButton applicationId={application.id} isDark={isDark} />
      </td>
    </tr>
  );
}