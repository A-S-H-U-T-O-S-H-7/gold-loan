'use client';

import CallButton from '@/components/crm/ui/CallButton';
import KycVerificationBadge from '@/components/crm/ui/KycVerificationBadge';
import KYCVerificationButton from '@/components/crm/action-buttons/KYCVerificationButton';
import ApplicationStatusButton from '@/components/crm/application-status/ApplicationStatusButton';
import GoldEvaluateButton from '@/components/crm/action-buttons/GoldEvalutionButton';

const money = (value) => value == null ? '—' : `₹${Number(value).toLocaleString('en-IN')}`;

export default function GoldEvaluationMobileCard({ application, isDark, onStatusClick }) {
  const evaluated = application.evaluationStatus === 'FINALIZED';

  return <article className={`min-w-0 space-y-3 rounded-xl border p-4 ${isDark ? 'border-gold-700/50 bg-gray-800' : 'border-gold-200 bg-white'}`}>
    <div className="flex items-start justify-between gap-2">
      <div className="min-w-0"><p className="font-mono text-sm font-semibold text-gold-600">{application.applicationNo || '—'}</p><h3 className="font-semibold">{application.name || '—'}</h3><p className="text-sm text-gray-500">{application.mobile || '—'}</p></div>
      <ApplicationStatusButton application={application} onClick={onStatusClick} />
    </div>
    <p className="text-sm"><strong>Branch:</strong> {application.branchName || 'Unassigned'}</p>
    <p className="text-sm"><strong>Evaluation:</strong> {evaluated ? 'Evaluated' : 'Draft'}</p>
    <p className="text-sm"><strong>Eligible amount:</strong> {money(application.eligibleAmount)}</p>
    <div className="flex flex-col items-start gap-2"><KycVerificationBadge verified={application.kycVerified} /><KYCVerificationButton applicationId={application.id} isDark={isDark} label={application.kycVerified ? 'View KYC' : 'KYC Verification'} /></div>
    <div className="flex flex-wrap items-center gap-2"><CallButton mobile={application.mobile} isDark={isDark} /><GoldEvaluateButton applicationId={application.id} isDark={isDark} evaluated={evaluated} /></div>
  </article>;
}
