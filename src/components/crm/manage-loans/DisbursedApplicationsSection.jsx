'use client';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { getDisbursedApplications, getDisbursement } from '@/lib/services/crmDisbursementService';
import useApplicationList from '@/components/crm/application-list/useApplicationList';
import useStaffBranch from '@/components/crm/application-list/useStaffBranch';
import ApplicationListFilters from '@/components/crm/application-list/ApplicationListFilters';
import DataTable from '@/components/crm/ui/DataTable';
import Pagination from '@/components/crm/ui/Pagination';
import StatusBadge from '@/components/crm/ui/StatusBadge';
import DisbursementModal from '@/components/crm/disbursement/DisbursementTransferHistoryModal';

const money = (value) => value == null ? '—' : `₹${Number(value).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
export default function DisbursedApplicationsSection({ isDark }) {
  const list = useApplicationList(getDisbursedApplications);
  const branch = useStaffBranch();
  const [selected, setSelected] = useState(null);
  async function view(app) {
    try { setSelected(await getDisbursement(app.id)); }
    catch (error) { toast.error(error.response?.data?.message || 'Could not load disbursed application.'); }
  }
  const columns = [
    { key: 'applicationNo', label: 'Application No.', width: '135px' },
    { key: 'name', label: 'Name / Mobile', width: '170px', render: (app) => <div><div>{app.name}</div><div className="text-xs opacity-70">{app.mobile}</div></div> },
    { key: 'branchName', label: 'Branch', width: '130px', render: (app) => app.branchName || 'Unassigned' },
    { key: 'approvedLoanAmount', label: 'Loan Principal', width: '130px', render: (app) => money(app.approvedLoanAmount) },
    { key: 'netPayoutAmount', label: 'Net Payout', width: '130px', render: (app) => money(app.netPayoutAmount) },
    { key: 'status', label: 'Status', width: '120px', render: (app) => <StatusBadge status={app.status} /> },
    { key: 'actions', label: 'Actions', width: '145px', render: (app) => <button type="button" onClick={() => view(app)} className="cursor-pointer text-gold-600 underline">View Transfer History</button> },
  ];
  return <section className="mb-8"><div className="mb-3 flex items-center justify-between"><h2 className={`text-lg font-semibold ${isDark ? 'text-gold-400' : 'text-gold-700'}`}>Disbursed Applications ({list.pagination.total})</h2><button type="button" onClick={list.refresh} className="cursor-pointer text-sm text-gold-600 underline">Refresh</button></div>
    <ApplicationListFilters list={list} isDark={isDark} branchName={branch} searchOptions={[{ value: 'application_no', label: 'Application No.' }, { value: 'name', label: 'Name' }, { value: 'mobile', label: 'Mobile' }, { value: 'all', label: 'All fields' }]} />
    {list.error && <p role="alert" className="mb-3 text-sm text-red-500">{list.error}</p>}
    <div className="hidden lg:block"><DataTable columns={columns} data={list.applications} currentPage={list.page} totalPages={list.pagination.total_pages} totalItems={list.pagination.total} itemsPerPage={list.perPage} pageSizeOptions={[10,20,50,100]} onPageChange={list.setPage} onPageSizeChange={list.setPerPage} isDark={isDark} emptyMessage={list.loading ? 'Loading disbursed applications...' : 'No disbursed applications yet.'} /></div>
    <div className="lg:hidden">{list.applications.length === 0 ? <p className="rounded-xl border p-5 text-center">No disbursed applications yet.</p> : <div className="grid gap-3">{list.applications.map((app) => <div key={app.id} className={`rounded-xl border p-4 ${isDark ? 'border-gold-700 bg-gray-800' : 'border-gold-200 bg-white'}`}><p className="font-semibold">#{app.applicationNo} · {app.name}</p><p>{app.mobile} · {money(app.netPayoutAmount)}</p><StatusBadge status={app.status} /><button type="button" onClick={() => view(app)} className="mt-2 block cursor-pointer text-gold-600 underline">View Transfer History</button></div>)}</div>}{list.pagination.total_pages > 0 && <Pagination currentPage={list.page} totalPages={list.pagination.total_pages} totalItems={list.pagination.total} itemsPerPage={list.perPage} pageSizeOptions={[10,20,50,100]} onPageChange={list.setPage} onPageSizeChange={list.setPerPage} isDark={isDark} />}</div>
    <DisbursementModal data={selected} onClose={() => setSelected(null)} onRefresh={async () => { if (selected) setSelected(await getDisbursement(selected.application.id)); list.refresh(); }} onSuccess={() => { setSelected(null); list.refresh(); }} isDark={isDark} />
  </section>;
}
