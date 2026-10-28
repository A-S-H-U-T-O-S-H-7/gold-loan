'use client';

import { useCallback, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { useThemeStore } from '@/lib/store/useThemeStore';
import {
  getDisbursementDetail,
  getTransactions,
  recordManualTransfer,
  uploadReceipt,
} from '@/lib/services/crmDisbursementService';
import useApplicationList from '@/components/crm/application-list/useApplicationList';
import useStaffBranch from '@/components/crm/application-list/useStaffBranch';
import ApplicationListFilters from '@/components/crm/application-list/ApplicationListFilters';
import TransactionTable from '@/components/crm/transaction/TransactionTable';
import TransactionModal from '@/components/crm/transaction/TransactionModal';
import PageHeader from '@/components/crm/ui/PageHeader';

const tabs = [
  { label: 'Awaiting Transfer', status: 'NOT_STARTED' },
  { label: 'Pending or Unknown', status: 'PENDING,UNKNOWN' },
  { label: 'Failed', status: 'FAILED' },
  { label: 'Successful', status: 'SUCCESS' },
];

const searchOptions = [
  { value: 'application_no', label: 'Application No.' },
  { value: 'name', label: 'Name' },
  { value: 'mobile', label: 'Mobile' },
  { value: 'transaction_reference', label: 'Transaction Reference' },
  { value: 'all', label: 'All fields' },
];

export default function TransactionPage() {
  const isDark = useThemeStore((state) => state.theme) === 'dark';
  const [activeTab, setActiveTab] = useState(0);
  const loadTransactions = useCallback(
    (params) => getTransactions({ ...params, status: tabs[activeTab].status }),
    [activeTab],
  );
  const list = useApplicationList(loadTransactions);
  const branch = useStaffBranch();
  const [selected, setSelected] = useState(null);
  const [opening, setOpening] = useState(false);
  const [busy, setBusy] = useState(false);
  const [refreshIconKey, setRefreshIconKey] = useState(0);

  const refresh = () => {
    setRefreshIconKey((key) => key + 1);
    list.refresh();
  };

  const changeTab = (index) => {
    setActiveTab(index);
    list.setPage(1);
  };

  const openTransfer = async (transaction) => {
    setOpening(true);
    try {
      setSelected(await getDisbursementDetail(transaction.id));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not load transfer details.');
      list.refresh();
    } finally {
      setOpening(false);
    }
  };

  const handleAction = async (transaction) => {
    await openTransfer(transaction);
    if (['PENDING', 'UNKNOWN'].includes(transaction.transferStatus)) {
      toast('Bank status checking is unavailable until bank integration is connected. Another transfer is blocked.');
    }
  };

  const recordTransfer = async (result, form) => {
    if (!selected?.disbursement?.id) return;
    setBusy(true);
    try {
      const receiptFileKey = form.receipt ? await uploadReceipt(selected.disbursement.id, form.receipt) : null;
      await recordManualTransfer(selected.disbursement.id, {
        requestKey: form.requestKey,
        result,
        attemptedAt: new Date(form.attemptedAt).toISOString(),
        transactionReference: form.transactionReference.trim(),
        sendingAccountReference: form.sendingAccountReference.trim(),
        failureReason: form.failureReason.trim(),
        remark: form.remark.trim(),
        receiptFileKey,
      });
      toast.success(result === 'SUCCESS' ? 'Transfer confirmed. Application moved to Manage Application.' : 'Failed transfer recorded.');
      setSelected(null);
      list.refresh();
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Could not record transfer.');
    } finally {
      setBusy(false);
    }
  };

  const tabClass = (isActive) => `cursor-pointer rounded-lg border px-4 py-2 text-sm font-semibold transition-colors ${
    isActive
      ? 'border-gold-600 bg-gold-600 text-white'
      : isDark
        ? 'border-gold-700/50 bg-gray-800 text-gray-300 hover:bg-gray-700'
        : 'border-gold-200 bg-white text-gray-700 hover:bg-gold-50'
  }`;

  return (
    <div className={`min-h-screen w-full min-w-0 max-w-full overflow-x-hidden transition-colors duration-300 ${isDark ? 'bg-gray-900 text-white' : 'bg-gold-50/30 text-gray-900'}`}>
      <div className="w-full min-w-0 max-w-full p-3 sm:p-4 md:p-6">
        <PageHeader
          title="Transaction"
          count={list.pagination.total}
          isDark={isDark}
          description="Payout instructions and payment history"
          actions={
            <button
              type="button"
              onClick={refresh}
              disabled={list.loading}
              aria-label="Refresh transactions"
              className={`inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded border px-4 py-2 font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto ${isDark ? 'border-gold-600 text-gold-300 hover:bg-gold-500/10' : 'border-gold-300 bg-white text-gold-700 hover:bg-gold-50'}`}
            >
              <RefreshCw key={refreshIconKey} className={`h-4 w-4 shrink-0 ${refreshIconKey > 0 ? 'animate-[spin_600ms_ease-in-out_1]' : ''}`} />
              Refresh
            </button>
          }
        />

        <div role="tablist" aria-label="Transfer status" className="mb-5 flex gap-2 overflow-x-auto pb-1">
          {tabs.map((tab, index) => (
            <button
              key={tab.status}
              type="button"
              role="tab"
              aria-selected={activeTab === index}
              onClick={() => changeTab(index)}
              className={`shrink-0 ${tabClass(activeTab === index)}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <ApplicationListFilters list={list} isDark={isDark} branchName={branch} matchPendingStyle searchOptions={searchOptions} />

        {list.error && <p role="alert" className="mb-4 text-red-600">{list.error}</p>}
        {opening && (
          <p role="status" className={`mb-3 text-sm ${isDark ? 'text-gold-300' : 'text-gold-700'}`}>
            Loading transfer details...
          </p>
        )}

        <TransactionTable list={list} isDark={isDark} onAction={handleAction} />

        {selected && (
          <TransactionModal
            key={selected.disbursement.id}
            data={selected}
            onClose={() => setSelected(null)}
            onRecord={recordTransfer}
            busy={busy}
            isDark={isDark}
          />
        )}
      </div>
    </div>
  );
}
