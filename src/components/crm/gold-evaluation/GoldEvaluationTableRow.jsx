'use client';

import CallButton from '@/components/crm/ui/CallButton';
import KycVerificationBadge from '@/components/crm/ui/KycVerificationBadge';
import KYCVerificationButton from '@/components/crm/action-buttons/KYCVerificationButton';
import ApplicationStatusButton from '@/components/crm/application-status/ApplicationStatusButton';
import GoldEvaluateButton from '@/components/crm/action-buttons/GoldEvalutionButton';

const money = (amount) => amount == null ? '—' : `₹${Number(amount).toLocaleString('en-IN')}`;

export default function GoldEvaluationTableRow({ application, index, isDark, onStatusClick }) {
  const evaluated = application.evaluationStatus === 'FINALIZED';
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
        <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${evaluated
          ? isDark ? 'border-emerald-700 bg-emerald-900/30 text-emerald-300' : 'border-emerald-300 bg-emerald-50 text-emerald-700'
          : isDark ? 'border-amber-700 bg-amber-900/30 text-amber-300' : 'border-amber-300 bg-amber-50 text-amber-700'}`}>
          {evaluated ? 'Evaluated' : 'Draft'}
        </span>
      </td>
      <td className={cell}>
        <span className={secondaryText}>{money(application.eligibleAmount)}</span>
      </td>
      <td className={cell}>
        <ApplicationStatusButton application={application} onClick={onStatusClick} />
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
        <GoldEvaluateButton applicationId={application.id} isDark={isDark} evaluated={evaluated} />
      </td>
    </tr>
  );
}
