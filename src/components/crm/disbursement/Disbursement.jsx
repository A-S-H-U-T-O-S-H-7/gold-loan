'use client';
import { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { useThemeStore } from '@/lib/store/useThemeStore';
import useApplicationList from '@/components/crm/application-list/useApplicationList';
import useStaffBranch from '@/components/crm/application-list/useStaffBranch';
import ApplicationListFilters from '@/components/crm/application-list/ApplicationListFilters';
import PageHeader from '@/components/crm/ui/PageHeader';
import DataTable from '@/components/crm/ui/DataTable';
import Pagination from '@/components/crm/ui/Pagination';
import ApplicationStatusButton from '@/components/crm/application-status/ApplicationStatusButton';
import DisbursementModal from './DisbursementModal';
import DisbursementProcessButton from '@/components/crm/action-buttons/DisbursementProcessButton';
import { getDisburseApplications, getDisbursement } from '@/lib/services/crmDisbursementService';

const money = (value) => value == null ? '—' : `₹${Number(value).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function DisbursementPage() {
  const isDark = useThemeStore((state) => state.theme) === 'dark';
  const list = useApplicationList(getDisburseApplications);
  const branch = useStaffBranch();
  const [selected, setSelected] = useState(null);
  const [opening, setOpening] = useState(false);
  async function open(app) {
    setOpening(true);
    try { setSelected(await getDisbursement(app.id)); }
    catch (error) { toast.error(error.response?.data?.message || 'Could not load payout details.'); list.refresh(); }
    finally { setOpening(false); }
  }
  const actions = (app) => <DisbursementProcessButton onClick={() => open(app)} isDark={isDark} reviewed={Boolean(app.disbursementId)} />;
  const status = (app) => <ApplicationStatusButton application={app} onClick={open} />;
  const columns = [
    { key: 'applicationNo', label: 'Application No.', width: '130px' },
    { key: 'name', label: 'Name / Mobile', width: '170px', render: (app) => <div><div className="font-medium">{app.name}</div><div className="text-xs opacity-70">{app.mobile}</div></div> },
    { key: 'branchName', label: 'Branch', width: '130px', render: (app) => app.branchName || 'Unassigned' },
    { key: 'approvedLoanAmount', label: 'Approved Loan', width: '130px', render: (app) => money(app.approvedLoanAmount) },
    { key: 'deductionAmount', label: 'Deductions', width: '120px', render: (app) => money(app.deductionAmount) },
    { key: 'netPayoutAmount', label: 'Net Payout', width: '130px', render: (app) => money(app.netPayoutAmount) },
    { key: 'bankName', label: 'Bank Details', width: '150px', render: (app) => <div><div>{app.bankName || '—'}</div><div className="text-xs opacity-70">{app.maskedBankAccount || '—'}</div></div> },
    { key: 'readiness', label: 'Preparation', width: '125px', render: (app) => app.disbursementId ? 'Reviewed' : 'Awaiting Review' },
    { key: 'status', label: 'Application Status', width: '125px', render: status },
    { key: 'actions', label: 'Actions', width: '100px', render: actions },
  ];
  return <div className={`min-h-screen p-4 md:p-6 ${isDark ? 'bg-gray-900 text-white' : 'bg-gold-50/30 text-gray-900'}`}>
    <PageHeader title="Disbursement" count={list.pagination.total} isDark={isDark} actions={<button type="button" onClick={list.refresh} disabled={list.loading} className="flex cursor-pointer items-center gap-2 rounded-lg bg-gold-600 px-4 py-2 font-semibold text-white disabled:opacity-50"><RefreshCw className={`h-4 w-4 ${list.loading ? 'animate-spin' : ''}`} />Refresh</button>} />
    <ApplicationListFilters list={list} isDark={isDark} branchName={branch} searchOptions={[{ value: 'application_no', label: 'Application No.' }, { value: 'name', label: 'Name' }, { value: 'mobile', label: 'Mobile' }, { value: 'all', label: 'All fields' }]} />
    {list.error && <p role="alert" className="mb-4 text-red-600">{list.error}</p>}{opening && <p className="mb-3 text-sm text-gold-600">Loading payout details...</p>}
    <div className="hidden lg:block"><DataTable columns={columns} data={list.applications} currentPage={list.page} totalPages={list.pagination.total_pages} totalItems={list.pagination.total} itemsPerPage={list.perPage} pageSizeOptions={[10, 20, 50, 100]} onPageChange={list.setPage} onPageSizeChange={list.setPerPage} isDark={isDark} emptyMessage={list.loading ? 'Loading applications...' : 'No applications ready for disbursement.'} /></div>
    <div className="lg:hidden">{list.applications.length === 0 ? <p className="rounded-xl border p-8 text-center">No applications ready for disbursement.</p> : <div className="grid gap-3 sm:grid-cols-2">{list.applications.map((app) => <article key={app.id} className={`space-y-2 rounded-xl border p-4 ${isDark ? 'border-gold-700 bg-gray-800' : 'border-gold-200 bg-white'}`}><h2 className="font-semibold">#{app.applicationNo} · {app.name}</h2><p>{app.mobile} · {app.branchName || 'Unassigned'}</p><p>Principal: {money(app.approvedLoanAmount)} · Deductions: {money(app.deductionAmount)}</p><p>Net payout: {money(app.netPayoutAmount)}</p><p>{app.bankName || '—'} {app.maskedBankAccount || ''}</p><p>Preparation: {app.disbursementId ? 'Reviewed' : 'Awaiting Review'}</p><div className="flex items-center gap-3">{status(app)}{actions(app)}</div></article>)}</div>}{list.pagination.total_pages > 0 && <Pagination currentPage={list.page} totalPages={list.pagination.total_pages} totalItems={list.pagination.total} itemsPerPage={list.perPage} pageSizeOptions={[10, 20, 50, 100]} onPageChange={list.setPage} onPageSizeChange={list.setPerPage} isDark={isDark} />}</div>
    {selected && <DisbursementModal key={selected.application.id} data={selected} onClose={() => setSelected(null)} onSuccess={() => { setSelected(null); list.refresh(); }} isDark={isDark} />}
  </div>;
}
