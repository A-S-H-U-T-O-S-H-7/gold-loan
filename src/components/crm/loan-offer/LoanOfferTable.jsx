'use client';

import Link from 'next/link';
import { FileText } from 'lucide-react';
import DataTable from '@/components/crm/ui/DataTable';
import Pagination from '@/components/crm/ui/Pagination';
import CallButton from '@/components/crm/ui/CallButton';
import KycVerificationBadge from '@/components/crm/ui/KycVerificationBadge';
import KYCVerificationButton from '@/components/crm/action-buttons/KYCVerificationButton';
import GoldEvaluateButton from '@/components/crm/action-buttons/GoldEvalutionButton';
import ApplicationStatusButton from '@/components/crm/application-status/ApplicationStatusButton';

const money = (value) => value == null ? '—' : `₹${Number(value).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
const decisionLabel = (value) => ({ AWAITING_DECISION: 'Awaiting Decision', ACCEPTED: 'Accepted', DECLINED: 'Declined' })[value] || 'Awaiting Decision';

function OfferLink({ applicationId, isDark }) {
  return <Link href={`/crm/loan-offer/${applicationId}`}
    className={`inline-flex cursor-pointer items-center gap-1.5 whitespace-nowrap rounded border px-3 py-1.5 text-xs font-semibold transition-all duration-200 hover:scale-105 ${isDark
      ? 'border-indigo-700 bg-indigo-900/40 text-indigo-300 hover:bg-indigo-800'
      : 'border-indigo-300 bg-indigo-100 text-indigo-700 hover:bg-indigo-200'}`}>
    <FileText className="h-3.5 w-3.5" />Loan Offer
  </Link>;
}

export default function LoanOfferTable({ list, isDark, onStatusClick }) {
  const columns = [
    { key: 'applicationNo', label: 'Application No.', width: '150px', render: (app) => <span className="font-mono font-semibold text-gold-600 dark:text-gold-400">{app.applicationNo || '—'}</span> },
    { key: 'source', label: 'Source', width: '100px', render: (app) => app.source || '—' },
    { key: 'call', label: 'Call', width: '90px', render: (app) => <CallButton mobile={app.mobile} isDark={isDark} /> },
    { key: 'branchName', label: 'Branch', width: '140px', render: (app) => app.branchName || 'Unassigned' },
    { key: 'name', label: 'Customer Name', width: '160px', render: (app) => app.name || '—' },
    { key: 'mobile', label: 'Mobile', width: '130px', render: (app) => app.mobile || '—' },
    { key: 'email', label: 'Email', width: '200px', render: (app) => app.email || '—' },
    { key: 'eligibleAmount', label: 'Eligible Amount', width: '150px', render: (app) => money(app.eligibleAmount) },
    { key: 'offeredAmount', label: 'Offered Amount', width: '150px', render: (app) => money(app.offeredAmount) },
    { key: 'offerDecision', label: 'Offer Decision', width: '160px', render: (app) => decisionLabel(app.offerDecision) },
    { key: 'status', label: 'Status', width: '130px', render: (app) => <ApplicationStatusButton application={app} onClick={onStatusClick} /> },
    { key: 'kycVerified', label: 'KYC', width: '175px', render: (app) => <div className="flex flex-col items-center gap-2"><KycVerificationBadge verified={app.kycVerified} /><KYCVerificationButton applicationId={app.id} isDark={isDark} label={app.kycVerified ? 'View KYC' : 'KYC Verification'} /></div> },
    { key: 'evaluation', label: 'Evaluation', width: '170px', render: (app) => <GoldEvaluateButton applicationId={app.id} isDark={isDark} evaluated /> },
    { key: 'actions', label: 'Actions', width: '150px', render: (app) => <OfferLink applicationId={app.id} isDark={isDark} /> },
  ];

  return <>
    <div className="hidden min-w-0 max-w-full lg:block">
      <DataTable columns={columns} data={list.applications} currentPage={list.page}
        totalPages={list.pagination.total_pages} totalItems={list.pagination.total}
        itemsPerPage={list.perPage} pageSizeOptions={[10, 20, 50, 100]}
        onPageChange={list.setPage} onPageSizeChange={list.setPerPage} isDark={isDark}
        emptyMessage={list.loading ? 'Loading applications...' : 'No Loan Offer applications found.'} />
    </div>
    <div className="min-w-0 max-w-full lg:hidden">
      {list.applications.length === 0 ? <div className={`rounded-xl border px-4 py-12 text-center text-sm ${isDark ? 'border-gold-700 bg-gray-800 text-gray-400' : 'border-gold-200 bg-white text-gray-500'}`}>
        {list.loading ? 'Loading applications...' : 'No Loan Offer applications found.'}
      </div> : <div className="grid gap-3 sm:grid-cols-2">{list.applications.map((app) => <article key={app.id}
        className={`min-w-0 rounded-xl border p-4 shadow-sm ${isDark ? 'border-gold-700/50 bg-gray-800' : 'border-gold-200 bg-white'}`}>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0"><p className="break-all font-mono text-sm font-semibold text-gold-600 dark:text-gold-400">{app.applicationNo || '—'}</p><h3 className="font-semibold">{app.name || '—'}</h3></div>
          <ApplicationStatusButton application={app} onClick={onStatusClick} />
        </div>
        <dl className="mt-4 grid grid-cols-2 gap-x-3 gap-y-4">
          {[
            ['Source', app.source], ['Branch', app.branchName || 'Unassigned'],
            ['Mobile', app.mobile], ['Email', app.email],
            ['Eligible Amount', money(app.eligibleAmount)], ['Offered Amount', money(app.offeredAmount)],
            ['Offer Decision', decisionLabel(app.offerDecision)],
          ].map(([label, value]) => <div key={label} className="min-w-0"><dt className={`text-xs font-medium uppercase tracking-wide ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{label}</dt><dd className="break-words text-sm">{value || '—'}</dd></div>)}
          <div className="col-span-2"><dt className={`mb-1 text-xs font-medium uppercase tracking-wide ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>KYC</dt><dd className="flex flex-wrap items-center gap-2"><KycVerificationBadge verified={app.kycVerified} /><KYCVerificationButton applicationId={app.id} isDark={isDark} label={app.kycVerified ? 'View KYC' : 'KYC Verification'} /></dd></div>
          <div className="col-span-2"><dt className={`mb-1 text-xs font-medium uppercase tracking-wide ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Evaluation</dt><dd><GoldEvaluateButton applicationId={app.id} isDark={isDark} evaluated /></dd></div>
        </dl>
        <div className={`mt-4 flex flex-wrap items-center gap-2 border-t pt-4 ${isDark ? 'border-gold-700/40' : 'border-gold-200'}`}>
          <CallButton mobile={app.mobile} isDark={isDark} />
          <OfferLink applicationId={app.id} isDark={isDark} />
        </div>
      </article>)}</div>}
      {list.pagination.total_pages > 0 && <div className={`mt-3 overflow-hidden rounded-xl border ${isDark ? 'border-gold-700/50 bg-gray-800' : 'border-gold-200 bg-white'}`}>
        <Pagination currentPage={list.page} totalPages={list.pagination.total_pages} totalItems={list.pagination.total}
          itemsPerPage={list.perPage} pageSizeOptions={[10, 20, 50, 100]}
          onPageChange={list.setPage} onPageSizeChange={list.setPerPage} isDark={isDark} />
      </div>}
    </div>
  </>;
}
