'use client';
import { useCallback, useMemo, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { useThemeStore } from '@/lib/store/useThemeStore';
import useApplicationList from '@/components/crm/application-list/useApplicationList';
import useStaffBranch from '@/components/crm/application-list/useStaffBranch';
import ApplicationListFilters from '@/components/crm/application-list/ApplicationListFilters';
import PageHeader from '@/components/crm/ui/PageHeader';
import DataTable from '@/components/crm/ui/DataTable';
import ExportButton from '@/components/crm/ui/ExportButton';
import StatusBadge from '@/components/crm/ui/StatusBadge';
import ManageLoansTabs from './ManageLoansTabs';
import ManageLoansModal from './ManageLoansModal';
import ManageLoansViewButton from '@/components/crm/action-buttons/ManageLoansViewButton';
import { getManageApplications, getLoanAccountDetail, getLoanSchedule, getLoanPayments } from '@/lib/services/loanAccountService';

const money = (value) => value == null ? '—' : `₹${Number(value).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const date = (value) => value ? new Date(value).toLocaleDateString('en-IN') : '—';
const value = (item) => item == null || item === '' ? '—' : item;
const groups = ['Application / Customer', 'KYC', 'Gold', 'Loan Terms', 'Disbursement', 'Repayment', 'Status / Actions'];

export default function ManageLoansPage() {
  const isDark = useThemeStore((state) => state.theme) === 'dark';
  const [activeTab, setActiveTab] = useState('All');
  const [shownGroups, setShownGroups] = useState(groups);
  const [showSelector, setShowSelector] = useState(false);
  const [selected, setSelected] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const load = useCallback((params) => getManageApplications({ ...params, status: activeTab.toUpperCase() }), [activeTab]);
  const list = useApplicationList(load);
  const branch = useStaffBranch();

  async function open(row, section = 'details') {
    setDetailLoading(true);
    try {
      const [detail, schedule, payments] = await Promise.all([getLoanAccountDetail(row.id), getLoanSchedule(row.id), getLoanPayments(row.id)]);
      setSelected({ detail, schedule, payments, section });
    } catch (error) { toast.error(error.response?.data?.message || 'Could not load loan details.'); }
    finally { setDetailLoading(false); }
  }
  const columns = useMemo(() => [
    { key: 'applicationNo', group: groups[0], label: 'Application No.', width: '150px', sticky: true },
    { key: 'loanNo', group: groups[0], label: 'Loan No.', width: '140px' },
    { key: 'customerName', group: groups[0], label: 'Customer Name', width: '170px' },
    { key: 'mobile', group: groups[0], label: 'Mobile', width: '125px' },
    { key: 'email', group: groups[0], label: 'Email', width: '200px', render: (row) => value(row.email) },
    { key: 'branchName', group: groups[0], label: 'Branch', width: '150px', render: (row) => value(row.branchName) },
    { key: 'kycVerified', group: groups[1], label: 'KYC Verified', width: '135px', render: (row) => row.kycVerified ? <StatusBadge status="KYC_VERIFIED" /> : '—', exportValue: (row) => row.kycVerified ? 'Yes' : 'No' },
    { key: 'currentAddress', group: groups[1], label: 'Current Address', width: '260px', render: (row) => value(row.currentAddress) },
    { key: 'itemCount', group: groups[2], label: 'Item Count', width: '100px' },
    { key: 'totalNetWeight', group: groups[2], label: 'Total Net Weight', width: '140px', render: (row) => row.totalNetWeight == null ? '—' : `${row.totalNetWeight} g` },
    { key: 'valuation', group: groups[2], label: 'Valuation', width: '135px', render: (row) => money(row.valuation) },
    { key: 'eligibleAmount', group: groups[2], label: 'Eligible Amount', width: '145px', render: (row) => money(row.eligibleAmount) },
    { key: 'storageReference', group: groups[2], label: 'Packet / Storage Reference', width: '200px', render: (row) => [row.packetReference, row.storageReference].filter(Boolean).join(' / ') || '—' },
    { key: 'principalAmount', group: groups[3], label: 'Loan Principal', width: '145px', render: (row) => money(row.principalAmount) },
    { key: 'interestRate', group: groups[3], label: 'Interest Rate', width: '145px', render: (row) => row.interestRate == null ? '—' : `${row.interestRate}% ${row.interestRatePeriod === 'MONTHLY' ? 'monthly' : 'annual'}` },
    { key: 'tenureValue', group: groups[3], label: 'Tenure', width: '130px', render: (row) => `${row.tenureValue} ${row.tenureUnit?.toLowerCase()}` },
    { key: 'repaymentMode', group: groups[3], label: 'Repayment Mode', width: '165px', render: (row) => value(row.repaymentMode?.replaceAll('_', ' ')) },
    { key: 'processingFeeAmount', group: groups[3], label: 'Processing Fee', width: '145px', render: (row) => money(row.processingFeeAmount) },
    { key: 'totalUpfrontDeductions', group: groups[3], label: 'Total Upfront Deductions', width: '180px', render: (row) => money(row.totalUpfrontDeductions) },
    { key: 'netAmountTransferred', group: groups[4], label: 'Net Amount Transferred', width: '190px', render: (row) => money(row.netAmountTransferred) },
    { key: 'disbursementDate', group: groups[4], label: 'Disbursement Date', width: '160px', render: (row) => date(row.disbursementDate) },
    { key: 'bankName', group: groups[4], label: 'Bank Name', width: '160px', render: (row) => value(row.bankName) },
    { key: 'maskedAccountNumber', group: groups[4], label: 'Masked Account Number', width: '185px', render: (row) => value(row.maskedAccountNumber) },
    { key: 'transactionReference', group: groups[4], label: 'Transaction Reference', width: '185px', render: (row) => value(row.transactionReference) },
    { key: 'nextDueDate', group: groups[5], label: 'Next Due Date', width: '145px', render: (row) => date(row.nextDueDate) },
    { key: 'maturityDate', group: groups[5], label: 'Maturity Date', width: '145px', render: (row) => date(row.maturityDate) },
    ...[['totalReceived', 'Total Received'], ['outstandingPrincipal', 'Outstanding Principal'], ['outstandingInterestCharges', 'Outstanding Interest / Charges'], ['totalOutstanding', 'Total Outstanding'], ['overdueAmount', 'Overdue Amount']].map(([key, label]) => ({ key, group: groups[5], label, width: '165px', render: (row) => money(row[key]) })),
    { key: 'overdueDays', group: groups[5], label: 'Overdue Days', width: '125px', render: (row) => value(row.overdueDays) },
    { key: 'status', group: groups[6], label: 'Loan Status', width: '130px', render: (row) => <StatusBadge status={row.status} /> },
    { key: 'actions', group: groups[6], label: 'Actions', width: '280px', render: (row) => <div className="flex items-center justify-center gap-2"><ManageLoansViewButton onClick={() => open(row)} isDark={isDark} /><button type="button" disabled title="Collection is not available yet" className="rounded border border-gray-300 px-3 py-1.5 text-xs font-semibold opacity-50 cursor-not-allowed">Collection</button><button type="button" onClick={() => open(row, 'payments')} className={`cursor-pointer rounded border px-3 py-1.5 text-xs font-semibold ${isDark ? 'border-gray-600 bg-gray-700 text-gray-300' : 'border-gray-300 bg-gray-100 text-gray-700'}`}>Payment History</button></div> },
  ], [isDark]);
  const visibleColumns = columns.filter((column) => shownGroups.includes(column.group));
  function exportPage() {
    const exportColumns = visibleColumns.filter((column) => column.key !== 'actions');
    const csvCell = (cell) => {
      const safe = String(cell == null || cell === '' ? '—' : cell).replace(/^[=+\-@]/, "'$&");
      return `"${safe.replaceAll('"', '""')}"`;
    };
    const lines = [exportColumns.map((column) => csvCell(column.label)), ...list.applications.map((row) => exportColumns.map((column) => csvCell(column.exportValue ? column.exportValue(row) : row[column.key])))];
    const blob = new Blob([`\uFEFF${lines.map((line) => line.join(',')).join('\r\n')}`], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob), anchor = document.createElement('a');
    anchor.href = url; anchor.download = `manage-loans-page-${list.page}.csv`; anchor.click(); URL.revokeObjectURL(url);
  }
  return <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-gray-900' : 'bg-gold-50/30'}`}><div className="p-4 md:p-6">
    <PageHeader title="Manage Loans" count={list.pagination.total} isDark={isDark} actions={<div className="flex gap-2"><button type="button" onClick={list.refresh} disabled={list.loading} className={`px-4 py-2 rounded font-medium transition-all duration-200 flex items-center gap-2 cursor-pointer ${isDark ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}`}><RefreshCw className={`h-4 w-4 ${list.loading ? 'animate-spin' : ''}`} />Refresh</button><ExportButton data={list.applications} filename="manage-loans" isDark={isDark} disabled={list.loading || !list.applications.length} onExport={exportPage} label="Export page" /></div>} />
    <ManageLoansTabs activeTab={activeTab} onTabChange={(tab) => { setActiveTab(tab); list.setPage(1); }} isDark={isDark} />
    <ApplicationListFilters list={list} isDark={isDark} branchName={branch} searchOptions={[{ value: 'all', label: 'All fields' }, { value: 'application_no', label: 'Application No.' }, { value: 'loan_no', label: 'Loan No.' }, { value: 'name', label: 'Name' }, { value: 'mobile', label: 'Mobile' }]} searchPlaceholder="Search application no., loan no., name or mobile..." />
    <div className={`mb-4 rounded-xl border p-3 ${isDark ? 'border-gold-700/30 bg-gray-800' : 'border-gold-200 bg-white'}`}><button type="button" onClick={() => setShowSelector(!showSelector)} aria-expanded={showSelector} className="cursor-pointer text-sm font-semibold text-gold-600">Columns ▾</button>{showSelector && <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">{groups.map((group) => <label key={group} className="flex cursor-pointer items-center gap-2 text-sm"><input type="checkbox" checked={shownGroups.includes(group)} onChange={() => setShownGroups((current) => current.includes(group) ? (current.length === 1 ? current : current.filter((item) => item !== group)) : [...current, group])} />{group}</label>)}</div>}</div>
    {list.error && <p role="alert" className="mb-4 text-red-600">{list.error}</p>}{detailLoading && <p className="mb-3 text-sm text-gold-600">Loading loan details...</p>}
    <DataTable columns={visibleColumns} data={list.applications} currentPage={list.page} totalPages={list.pagination.total_pages} onPageChange={list.setPage} onPageSizeChange={list.setPerPage} itemsPerPage={list.perPage} pageSizeOptions={[10,20,50,100]} totalItems={list.pagination.total} isDark={isDark} emptyMessage={list.loading ? 'Loading issued loans...' : `No ${activeTab.toLowerCase()} loans found.`} />
    <ManageLoansModal isOpen={!!selected} loan={selected} onClose={() => setSelected(null)} isDark={isDark} />
  </div></div>;
}
