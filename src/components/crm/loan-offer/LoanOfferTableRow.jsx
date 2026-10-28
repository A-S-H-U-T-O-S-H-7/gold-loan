'use client';

import Link from 'next/link';
import { FileText } from 'lucide-react';
import CallButton from '@/components/crm/ui/CallButton';
import KycVerificationBadge from '@/components/crm/ui/KycVerificationBadge';
import KYCVerificationButton from '@/components/crm/action-buttons/KYCVerificationButton';
import ApplicationStatusButton from '@/components/crm/application-status/ApplicationStatusButton';
import GoldEvaluateButton from '@/components/crm/action-buttons/GoldEvalutionButton';

const money = (value) => value == null ? '—' : `₹${Number(value).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
const decisionLabel = (value) => ({ AWAITING_DECISION: 'Awaiting Decision', ACCEPTED: 'Accepted', DECLINED: 'Declined' })[value] || 'Awaiting Decision';

export default function LoanOfferTableRow({ application, index, isDark, onStatusClick }) {
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
        <span className={secondaryText}>{money(application.eligibleAmount)}</span>
      </td>
      <td className={cell}>
        <span className={secondaryText}>{money(application.offeredAmount)}</span>
      </td>
      <td className={cell}>
        <span className={secondaryText}>{decisionLabel(application.offerDecision)}</span>
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
        <GoldEvaluateButton applicationId={application.id} isDark={isDark} evaluated />
      </td>
      <td className={cell}>
        <Link href={`/crm/loan-offer/${application.id}`}
          className={`inline-flex cursor-pointer items-center gap-1.5 whitespace-nowrap rounded border px-3 py-1.5 text-xs font-semibold transition-all duration-200 hover:scale-105 ${isDark
            ? 'border-indigo-700 bg-indigo-900/40 text-indigo-300 hover:bg-indigo-800'
            : 'border-indigo-300 bg-indigo-100 text-indigo-700 hover:bg-indigo-200'}`}>
          <FileText className="h-3.5 w-3.5" />Loan Offer
        </Link>
      </td>
    </tr>
  );
}
