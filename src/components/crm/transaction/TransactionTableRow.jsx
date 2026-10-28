'use client';

import CallButton from '@/components/crm/ui/CallButton';
import TransactionTransferButton from '@/components/crm/action-buttons/TransactionTransferButton';
import TransactionStatusBadge from '@/components/crm/transaction/TransactionStatusBadge';

const money = (value) => value == null ? '—' : `₹${Number(value).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const formatDateTime = (value) => (value ? new Date(value).toLocaleString('en-IN') : '—');

export default function TransactionTableRow({ transaction, index, isDark, onAction }) {
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
          {transaction.applicationNo || '—'}
        </span>
      </td>
      <td className={cell}>
        <CallButton mobile={transaction.mobile} isDark={isDark} />
      </td>
      <td className={cell}>
        <span className={secondaryText}>{transaction.branchName || 'Unassigned'}</span>
      </td>
      <td className={cell}>
        <span className="font-medium">{transaction.name || '—'}</span>
      </td>
      <td className={cell}>
        <span className={`font-mono ${secondaryText}`}>{transaction.mobile || '—'}</span>
      </td>
      <td className={cell}>
        <span className={secondaryText}>{money(transaction.loanAmount)}</span>
      </td>
      <td className={cell}>
        <span className={secondaryText}>{money(transaction.deductionAmount)}</span>
      </td>
      <td className={cell}>
        <span className="font-semibold">{money(transaction.transferAmount)}</span>
      </td>
      <td className={cell}>
        <div className={secondaryText}>{transaction.bankName || '—'}</div>
        <div className={`font-mono text-xs ${secondaryText}`}>{transaction.maskedBankAccount || '—'}</div>
      </td>
      <td className={cell}>
        <span className={secondaryText}>{transaction.transferMethod || '—'}</span>
      </td>
      <td className={cell}>
        <span className={`font-mono ${secondaryText}`}>{transaction.transactionReference || '—'}</span>
      </td>
      <td className={cell}>
        <TransactionStatusBadge status={transaction.transferStatus} isDark={isDark} />
      </td>
      <td className={cell}>
        <span className={secondaryText}>{formatDateTime(transaction.transferDate)}</span>
      </td>
      <td className={cell}>
        <TransactionTransferButton onClick={() => onAction(transaction)} isDark={isDark} status={transaction.transferStatus} />
      </td>
    </tr>
  );
}
