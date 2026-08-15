'use client';
import TransactionStatusBadge from './TransactionStatusBadge';
import TransactionTransferButton from '@/components/crm/action-buttons/TransactionTransferButton';
import { formatCurrency } from '@/lib/utils/format';

export default function TransactionTableRow({
  application,
  index,
  isDark = false,
  startIndex = 0,
  onTransfer,
  isFinance = false
}) {
  const srNo = startIndex + index + 1;
  const name = application.customer?.name || '—';
  const amount = application.loan?.approvedAmount || application.loan?.amount || 0;
  const mode = application.disbursement?.mode || application.transaction?.mode || '—';
  const referenceId = application.transaction?.referenceId || '—';
  
  // Determine status
  let status = 'READY_FOR_TRANSFER';
  if (application.transaction?.status === 'SUCCESS') status = 'TRANSFERRED';
  if (application.transaction?.status === 'FAILED' || application.status === 'FAILED') status = 'FAILED';

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
        <span className={`font-mono text-sm font-medium text-blue-600 dark:text-blue-400`}>
          {application.id || '—'}
        </span>
      </td>
      <td className={cellStyle}>
        <span className={`font-medium text-sm ${textPrimary}`}>
          {isFinance ? '••••••' : name}
        </span>
      </td>
      <td className={cellStyle}>
        <span className={`text-sm font-semibold ${textPrimary}`}>
          {formatCurrency(amount)}
        </span>
      </td>
      <td className={cellStyle}>
        <span className={`text-sm ${textSecondary}`}>{mode}</span>
      </td>
      <td className={cellStyle}>
        <span className={`font-mono text-sm ${textSecondary}`}>{referenceId}</span>
      </td>
      <td className={cellStyle}>
        <TransactionStatusBadge status={status} />
      </td>
      <td className={`px-3 py-3 text-center border-r last:border-r-0 ${cellBorder}`}>
        <TransactionTransferButton
          onClick={() => onTransfer(application)}
          isDark={isDark}
          status={status}
        />
      </td>
    </tr>
  );
}