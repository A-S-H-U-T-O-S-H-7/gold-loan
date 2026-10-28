'use client';

import CallButton from '@/components/crm/ui/CallButton';
import ApplicationStatusButton from '@/components/crm/application-status/ApplicationStatusButton';
import DisbursementProcessButton from '@/components/crm/action-buttons/DisbursementProcessButton';

const money = (value) => value == null ? '—' : `₹${Number(value).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function DisbursementTableRow({ application, index, isDark, onOpen }) {
  const cell = `border-r px-3 py-3 text-center text-sm last:border-r-0 ${isDark ? 'border-gold-600/80' : 'border-gold-300/90'}`;
  const secondaryText = isDark ? 'text-gray-400' : 'text-gray-600';
  const stripe = index % 2 === 0
    ? isDark ? 'bg-gray-800/50' : 'bg-white'
    : isDark ? 'bg-gray-800/30' : 'bg-gold-50/30';
  // A payout instruction exists once the application has been reviewed here.
  const reviewed = Boolean(application.disbursementId);

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
        <span className={secondaryText}>{money(application.approvedLoanAmount)}</span>
      </td>
      <td className={cell}>
        <span className={secondaryText}>{money(application.deductionAmount)}</span>
      </td>
      <td className={cell}>
        <span className="font-semibold">{money(application.netPayoutAmount)}</span>
      </td>
      <td className={cell}>
        <div className={secondaryText}>{application.bankName || '—'}</div>
        <div className={`font-mono text-xs ${secondaryText}`}>{application.maskedBankAccount || '—'}</div>
      </td>
      <td className={cell}>
        <span className={`whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-semibold ${reviewed
          ? isDark ? 'border-emerald-700 bg-emerald-900/30 text-emerald-300' : 'border-emerald-300 bg-emerald-50 text-emerald-700'
          : isDark ? 'border-amber-700 bg-amber-900/30 text-amber-300' : 'border-amber-300 bg-amber-50 text-amber-700'}`}>
          {reviewed ? 'Reviewed' : 'Awaiting Review'}
        </span>
      </td>
      <td className={cell}>
        <ApplicationStatusButton application={application} onClick={onOpen} />
      </td>
      <td className={cell}>
        <DisbursementProcessButton onClick={() => onOpen(application)} isDark={isDark} reviewed={reviewed} />
      </td>
    </tr>
  );
}
