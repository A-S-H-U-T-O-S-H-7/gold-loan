'use client';
import { useState } from 'react';
import Link from 'next/link';
import { RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { useThemeStore } from '@/lib/store/useThemeStore';
import api from '@/utils/axiosInsatnce';
import useApplicationList from '@/components/crm/application-list/useApplicationList';
import useStaffBranch from '@/components/crm/application-list/useStaffBranch';
import ApplicationListFilters from '@/components/crm/application-list/ApplicationListFilters';
import DataTable from '@/components/crm/ui/DataTable';
import Pagination from '@/components/crm/ui/Pagination';
import PageHeader from '@/components/crm/ui/PageHeader';
import ApplicationStatusButton from '@/components/crm/application-status/ApplicationStatusButton';
import StatusUpdateModal from '@/components/crm/application-modals/StatusUpdateModal';

const getCreditApplications = (params = {}) => api.get('/crm/applications', { params: { ...params, status: 'CREDIT_APPROVAL' } });
const money = (value) => value == null ? '-' : `₹${Number(value).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
const reviewLabel = { AWAITING_REVIEW: 'Awaiting Review', APPROVED: 'Approved', REJECTED: 'Rejected', NEEDS_REVIEW: 'Needs Review' };

export default function CreditApprovalListPage() {
  const isDark = useThemeStore((state) => state.theme) === 'dark';
  const list = useApplicationList(getCreditApplications);
  const branch = useStaffBranch();
  const [statusApplication, setStatusApplication] = useState(null);
  async function openStatus(app) {
    try {
      const result = (await api.get(`/crm/applications/credit-review/${app.id}`)).data;
      if (result.application.status !== 'CREDIT_APPROVAL') { list.refresh(); toast.error('Application has left Credit Approval.'); return; }
      setStatusApplication({ ...app, creditReviewDecision: result.currentReview?.decision, creditReviewValid: result.reviewValid });
    } catch (error) { toast.error(error.response?.data?.message || 'Could not load credit review.'); }
  }
  async function updateStatus(id, status, remark) {
    await api.patch(`/crm/applications/status/${id}`, { status, remark });
    toast.success('Application status updated'); list.refresh();
  }
  const status = (app) => <ApplicationStatusButton application={app} onClick={openStatus} />;
  const action = (app) => <Link href={`/crm/credit-approval/${app.id}`} className="cursor-pointer font-semibold text-gold-600 underline">Review</Link>;
  const columns = [
    { key: 'applicationNo', label: 'Application No.', width: '145px' },
    { key: 'name', label: 'Name / Mobile', width: '180px', render: (app) => <div><div className="font-medium">{app.name}</div><div className="text-xs opacity-70">{app.mobile}</div></div> },
    { key: 'branchName', label: 'Branch', width: '130px', render: (app) => app.branchName || 'Unassigned' },
    { key: 'eligibleAmount', label: 'Eligible Amount', width: '130px', render: (app) => money(app.eligibleAmount) },
    { key: 'offeredAmount', label: 'Offered Amount', width: '130px', render: (app) => money(app.offeredAmount) },
    { key: 'offerDecision', label: 'Offer Decision', width: '120px', render: (app) => app.offerDecision === 'ACCEPTED' ? 'Accepted' : app.offerDecision || '-' },
    { key: 'creditReviewDecision', label: 'Credit Review', width: '140px', render: (app) => app.creditReviewDecision && !app.creditReviewValid ? 'Review expired' : reviewLabel[app.creditReviewDecision] || 'Awaiting Review' },
    { key: 'status', label: 'Application Status', width: '160px', render: status },
    { key: 'actions', label: 'Actions', width: '100px', render: action },
  ];
  return <div className={`min-h-screen p-4 md:p-6 ${isDark ? 'bg-gray-900 text-white' : 'bg-gold-50/30 text-gray-900'}`}>
    <PageHeader title="Credit Approval" count={list.pagination.total} isDark={isDark} actions={<button type="button" onClick={list.refresh} disabled={list.loading} className="cursor-pointer flex items-center gap-2 rounded-lg bg-gold-600 px-4 py-2 font-semibold text-white disabled:opacity-50"><RefreshCw className={`h-4 w-4 ${list.loading ? 'animate-spin' : ''}`} />Refresh</button>} />
    <ApplicationListFilters list={list} isDark={isDark} branchName={branch} searchOptions={[{ value: 'application_no', label: 'Application No.' }, { value: 'name', label: 'Name' }, { value: 'mobile', label: 'Mobile' }, { value: 'all', label: 'All fields' }]} />
    {list.error && <p role="alert" className="mb-4 text-red-600">{list.error}</p>}
    <div className="hidden lg:block"><DataTable columns={columns} data={list.applications} currentPage={list.page} totalPages={list.pagination.total_pages} totalItems={list.pagination.total} itemsPerPage={list.perPage} pageSizeOptions={[10, 20, 50, 100]} onPageChange={list.setPage} onPageSizeChange={list.setPerPage} isDark={isDark} emptyMessage={list.loading ? 'Loading applications...' : 'No Credit Approval applications found.'} /></div>
    <div className="lg:hidden">{list.applications.length === 0 ? <p className="rounded-xl border p-8 text-center">No Credit Approval applications found.</p> : <div className="grid gap-3 sm:grid-cols-2">{list.applications.map((app) => <article key={app.id} className={`space-y-2 rounded-xl border p-4 ${isDark ? 'border-gold-700 bg-gray-800' : 'border-gold-200 bg-white'}`}><h2 className="font-semibold">#{app.applicationNo} · {app.name}</h2><p>{app.mobile} · {app.branchName || 'Unassigned'}</p><p>Eligible: {money(app.eligibleAmount)}</p><p>Offered: {money(app.offeredAmount)}</p><p>Offer: {app.offerDecision === 'ACCEPTED' ? 'Accepted' : '-'}</p><p>Review: {reviewLabel[app.creditReviewDecision] || 'Awaiting Review'}</p><div className="flex items-center gap-3">{status(app)}{action(app)}</div></article>)}</div>}{list.pagination.total_pages > 0 && <Pagination currentPage={list.page} totalPages={list.pagination.total_pages} totalItems={list.pagination.total} itemsPerPage={list.perPage} pageSizeOptions={[10, 20, 50, 100]} onPageChange={list.setPage} onPageSizeChange={list.setPerPage} isDark={isDark} />}</div>
    <StatusUpdateModal isOpen={Boolean(statusApplication)} application={statusApplication} onClose={() => setStatusApplication(null)} onStatusUpdate={updateStatus}
      statusOptions={[{ value: 'DISBURSE', label: 'Disburse', disabled: !statusApplication?.creditReviewValid || statusApplication?.creditReviewDecision !== 'APPROVED' }, { value: 'REJECTED', label: 'Reject', disabled: !statusApplication?.creditReviewValid || statusApplication?.creditReviewDecision !== 'REJECTED' }, { value: 'LOAN_OFFER', label: 'Loan Offer', disabled: !statusApplication?.creditReviewValid || statusApplication?.creditReviewDecision !== 'NEEDS_REVIEW' }]}
      isDark={isDark} accent="gold" initialStatus="" requiredRemarkStatuses={['REJECTED']} showCurrentStatus showSuccessToast={false} preventSameStatus submitLabel="Confirm" />
  </div>;
}
