'use client';

import CallButton from '@/components/crm/ui/CallButton';
import KYCVerificationButton from '@/components/crm/action-buttons/KYCVerificationButton';
import ApplicationStatusButton from '@/components/crm/application-status/ApplicationStatusButton';
import KycVerificationBadge from '@/components/crm/ui/KycVerificationBadge';

export default function CreateCustomerMobileCard({ application, isDark, onStatusClick }) {
  const labelStyle = `text-xs font-medium uppercase tracking-wide ${isDark ? 'text-gray-400' : 'text-gray-500'}`;
  const valueStyle = `min-w-0 break-words text-sm ${isDark ? 'text-gray-100' : 'text-gray-900'}`;

  return (
    <article className={`min-w-0 rounded-xl border p-4 shadow-sm ${
      isDark ? 'border-gold-700/50 bg-gray-800' : 'border-gold-200 bg-white'
    }`}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <p className={labelStyle}>Application No.</p>
          <p className="break-all font-mono text-sm font-semibold text-gold-600 dark:text-gold-400">
            {application.applicationNo || '—'}
          </p>
        </div>
        <ApplicationStatusButton application={application} onClick={onStatusClick} />
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-x-3 gap-y-4">
        <div className="min-w-0">
          <dt className={labelStyle}>Source</dt>
          <dd className={valueStyle}>{application.source || '—'}</dd>
        </div>
        <div className="min-w-0">
          <dt className={labelStyle}>Branch</dt>
          <dd className={valueStyle}>{application.branchName || '—'}</dd>
        </div>
        <div className="col-span-2 min-w-0">
          <dt className={labelStyle}>Customer Name</dt>
          <dd className={valueStyle}>{application.name || '—'}</dd>
        </div>
        <div className="min-w-0">
          <dt className={labelStyle}>Mobile</dt>
          <dd className={valueStyle}>{application.mobile || '—'}</dd>
        </div>
        <div className="min-w-0">
          <dt className={labelStyle}>Created On</dt>
          <dd className={valueStyle}>{application.createdOn || '—'}</dd>
        </div>
        <div className="col-span-2 min-w-0">
          <dt className={labelStyle}>Email</dt>
          <dd className={valueStyle}>{application.email || '—'}</dd>
        </div>
        <div className="col-span-2">
          <dt className={`${labelStyle} mb-1`}>KYC</dt>
          <dd><KycVerificationBadge verified={application.kycVerified} /></dd>
        </div>
      </dl>

      <div className={`mt-4 flex flex-wrap items-center gap-2 border-t pt-4 ${isDark ? 'border-gold-700/40' : 'border-gold-200'}`}>
        <CallButton mobile={application.mobile} isDark={isDark} />
        <KYCVerificationButton applicationId={application.id} isDark={isDark} />
      </div>
    </article>
  );
}
