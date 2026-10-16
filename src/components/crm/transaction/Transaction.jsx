'use client';
import { useCallback, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { useThemeStore } from '@/lib/store/useThemeStore';
import useApplicationList from '@/components/crm/application-list/useApplicationList';
import useStaffBranch from '@/components/crm/application-list/useStaffBranch';
import ApplicationListFilters from '@/components/crm/application-list/ApplicationListFilters';
import PageHeader from '@/components/crm/ui/PageHeader';
import DataTable from '@/components/crm/ui/DataTable';
import Pagination from '@/components/crm/ui/Pagination';
import TransactionStatusBadge from './TransactionStatusBadge';
import TransactionTransferButton from '@/components/crm/action-buttons/TransactionTransferButton';
import TransactionModal from './TransactionModal';
import { getTransactions, getDisbursementDetail, recordManualTransfer, uploadReceipt } from '@/lib/services/crmDisbursementService';

const tabs = [
  { label: 'Awaiting Transfer', status: 'NOT_STARTED' },
  { label: 'Pending or Unknown', status: 'PENDING,UNKNOWN' },
  { label: 'Failed', status: 'FAILED' },
  { label: 'Successful', status: 'SUCCESS' },
];
const money = (value) => value == null ? '—' : `₹${Number(value).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const when = (value) => value ? new Date(value).toLocaleString('en-IN') : '—';

export default function TransactionPage() {
  const isDark = useThemeStore((state) => state.theme) === 'dark';
  const [tab, setTab] = useState(0);
  const load = useCallback((params) => getTransactions({ ...params, status: tabs[tab].status }), [tab]);
  const list = useApplicationList(load);
  const branch = useStaffBranch();
  const [selected, setSelected] = useState(null);
  const [opening, setOpening] = useState(false);
  const [busy, setBusy] = useState(false);

  async function open(row) {
    setOpening(true);
    try { setSelected(await getDisbursementDetail(row.id)); }
    catch (error) { toast.error(error.response?.data?.message || 'Could not load transfer details.'); list.refresh(); }
    finally { setOpening(false); }
  }
  async function checkStatus(row) {
    await open(row);
    toast('Bank status checking is unavailable until bank integration is connected. Another transfer is blocked.');
  }
  async function record(result, form) {
    if (!selected?.disbursement?.id) return;
    setBusy(true);
    try {
      const receiptFileKey = form.receipt ? await uploadReceipt(selected.disbursement.id, form.receipt) : null;
      await recordManualTransfer(selected.disbursement.id, {
        requestKey: form.requestKey, result, attemptedAt: new Date(form.attemptedAt).toISOString(),
        transactionReference: form.transactionReference.trim(), sendingAccountReference: form.sendingAccountReference.trim(),
        failureReason: form.failureReason.trim(), remark: form.remark.trim(), receiptFileKey,
      });
      toast.success(result === 'SUCCESS' ? 'Transfer confirmed. Application moved to Manage Application.' : 'Failed transfer recorded.');
      setSelected(null);
      list.refresh();
    } catch (error) { toast.error(error.response?.data?.message || error.message || 'Could not record transfer.'); }
    finally { setBusy(false); }
  }
  const action = (row) => <TransactionTransferButton onClick={() => ['PENDING', 'UNKNOWN'].includes(row.transferStatus) ? checkStatus(row) : open(row)} isDark={isDark} status={row.transferStatus} />;
  const columns = [
    { key: 'applicationNo', label: 'Application No.', width: '130px' },
    { key: 'customer', label: 'Customer / Mobile', width: '160px', render: (row) => <div><div>{row.name}</div><div className="text-xs opacity-70">{row.mobile}</div></div> },
    { key: 'branchName', label: 'Branch', width: '120px', render: (row) => row.branchName || 'Unassigned' },
    { key: 'loanAmount', label: 'Loan Amount', width: '125px', render: (row) => money(row.loanAmount) },
    { key: 'deductionAmount', label: 'Deductions', width: '120px', render: (row) => money(row.deductionAmount) },
    { key: 'transferAmount', label: 'Transfer Amount', width: '130px', render: (row) => money(row.transferAmount) },
    { key: 'bank', label: 'Customer Bank', width: '150px', render: (row) => <div>{row.bankName}<div className="text-xs opacity-70">{row.maskedBankAccount}</div></div> },
    { key: 'transferMethod', label: 'Transfer Method', width: '125px' },
    { key: 'transactionReference', label: 'Transaction Reference', width: '150px', render: (row) => row.transactionReference || '—' },
    { key: 'transferStatus', label: 'Transfer Status', width: '130px', render: (row) => <TransactionStatusBadge status={row.transferStatus} /> },
    { key: 'transferDate', label: 'Transfer Date', width: '150px', render: (row) => when(row.transferDate) },
    { key: 'actions', label: 'Actions', width: '125px', render: action },
  ];
  return <div className={`min-h-screen p-4 md:p-6 ${isDark ? 'bg-gray-900 text-white' : 'bg-gold-50/30 text-gray-900'}`}>
    <PageHeader title="Transaction" count={list.pagination.total} isDark={isDark} description="Payout instructions and payment history" actions={<button type="button" onClick={list.refresh} disabled={list.loading} className={`px-4 py-2 rounded font-medium transition-all duration-200 flex items-center gap-2 cursor-pointer ${isDark ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}`}><RefreshCw className={`w-4 h-4 ${list.loading ? 'animate-spin' : ''}`} />Refresh</button>} />
    <div role="tablist" aria-label="Transfer status" className="mb-5 flex flex-wrap gap-2">{tabs.map((item, index) => <button key={item.status} type="button" role="tab" aria-selected={tab === index} onClick={() => { setTab(index); list.setPage(1); }} className={`cursor-pointer rounded-lg border px-4 py-2 text-sm font-semibold transition-colors ${tab === index ? 'border-blue-600 bg-blue-100 text-blue-700' : isDark ? 'border-gray-600 bg-gray-800 text-gray-300 hover:bg-gray-700' : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-100'}`}>{item.label}</button>)}</div>
    <ApplicationListFilters list={list} isDark={isDark} branchName={branch} searchOptions={[{ value: 'application_no', label: 'App ID' }, { value: 'name', label: 'Customer' }, { value: 'mobile', label: 'Mobile' }, { value: 'transaction_reference', label: 'Transaction Reference' }, { value: 'all', label: 'All fields' }]} />
    {list.error && <p role="alert" className="mb-4 text-red-600">{list.error}</p>}{opening && <p className="mb-3 text-sm text-gold-600">Loading transfer details...</p>}
    <div className="hidden lg:block"><DataTable columns={columns} data={list.applications} currentPage={list.page} totalPages={list.pagination.total_pages} totalItems={list.pagination.total} itemsPerPage={list.perPage} pageSizeOptions={[10,20,50,100]} onPageChange={list.setPage} onPageSizeChange={list.setPerPage} isDark={isDark} emptyMessage={list.loading ? 'Loading transfers...' : 'No transfers in this tab.'} /></div>
    <div className="lg:hidden">{list.applications.length === 0 ? <p className="rounded-xl border p-8 text-center">No transfers in this tab.</p> : <div className="grid gap-3 sm:grid-cols-2">{list.applications.map((row) => <article key={row.id} className={`space-y-2 rounded-xl border p-4 ${isDark ? 'border-gold-700 bg-gray-800' : 'border-gold-200 bg-white'}`}><h2 className="font-semibold">#{row.applicationNo} · {row.name}</h2><p>{row.mobile} · {row.branchName || 'Unassigned'}</p><p>Principal: {money(row.loanAmount)} · Deductions: {money(row.deductionAmount)}</p><p>Transfer: {money(row.transferAmount)} · {row.transferMethod}</p><p>{row.bankName || '—'} {row.maskedBankAccount || ''}</p><p>Reference: {row.transactionReference || '—'}</p><p>Date: {when(row.transferDate)}</p><TransactionStatusBadge status={row.transferStatus} />{action(row)}</article>)}</div>}{list.pagination.total_pages > 0 && <Pagination currentPage={list.page} totalPages={list.pagination.total_pages} totalItems={list.pagination.total} itemsPerPage={list.perPage} pageSizeOptions={[10,20,50,100]} onPageChange={list.setPage} onPageSizeChange={list.setPerPage} isDark={isDark} />}</div>
    {selected && <TransactionModal key={selected.disbursement.id} data={selected} onClose={() => setSelected(null)} onRecord={record} busy={busy} isDark={isDark} />}
  </div>;
}
