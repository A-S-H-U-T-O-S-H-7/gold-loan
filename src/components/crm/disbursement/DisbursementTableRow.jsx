'use client';
import StatusBadge from '@/components/crm/ui/StatusBadge';
import DisbursementProcessButton from '@/components/crm/action-buttons/DisbursementProcessButton';
import { formatCurrency } from '@/lib/utils/format';

export default function DisbursementTableRow({
  application,
  index,
  isDark = false,
  startIndex = 0,
  onProcess
}) {
  const srNo = startIndex + index + 1;
  const name = application.customer?.name || '—';
  const mobile = application.customer?.mobile || '—';
  const status = application.status || 'APPROVED';
  const amount = application.loan?.approvedAmount || application.loan?.amount || 0;

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
      <td className={cellStyle}>
        <span className={`font-medium ${textPrimary}`}>{srNo}</span>
      </td>
      <td className={cellStyle}>
        <span className={`font-mono text-sm font-medium text-teal-600 dark:text-teal-400`}>
          {application.id || '—'}
        </span>
      </td>
      <td className={cellStyle}>
        <span className={`font-medium text-sm ${textPrimary}`}>{name}</span>
      </td>
      <td className={cellStyle}>
        <span className={`font-mono text-sm ${textSecondary}`}>{mobile}</span>
      </td>
      <td className={cellStyle}>
        <span className={`text-sm font-semibold ${textPrimary}`}>
          {formatCurrency(amount)}
        </span>
      </td>
      <td className={cellStyle}>
        <StatusBadge status={status} />
      </td>
      <td className={`px-3 py-3 text-center border-r last:border-r-0 ${cellBorder}`}>
        <DisbursementProcessButton onClick={() => onProcess(application)} isDark={isDark} />
      </td>
    </tr>
  );
}