'use client';

import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import PageHeader from '@/components/crm/ui/PageHeader';
import FilterBar from '@/components/crm/ui/FilterBar';
import DataTable from '@/components/crm/ui/DataTable';
import Modal from '@/components/crm/ui/Modal';
import StatusBadge from '@/components/crm/ui/StatusBadge';
import { DangerButton, Field, GhostButton, PrimaryButton, inputClass } from '@/components/crm/ui/FormControls';
import { transactionService } from '@/lib/services/transactionService';
import { useLoanStore } from '@/lib/store/loanStore';
import { useAdminAuthStore } from '@/lib/store/authAdminStore';
import { useCrmList } from '@/lib/hooks/useCrmList';
import { formatCurrency, formatDateTime } from '@/lib/utils/format';
import { approvedOf } from '@/lib/utils/loanMath';

function txnStatus(row) {
  if (row.transaction?.status === 'SUCCESS') return 'TRANSFERRED';
  if (row.transaction?.status === 'FAILED' || row.status === 'FAILED') return 'FAILED';
  return 'READY_FOR_TRANSFER';
}

export default function TransactionPage() {
  const applications = useLoanStore((s) => s.applications);
  const user = useAdminAuthStore((s) => s.user);
  const isFinance = /finance/i.test(user?.role || user?.name || '');
  const rows = useMemo(() => transactionService.getLedger(), [applications]);
  const list = useCrmList(rows, { searchKeys: ['id', 'customer.name', 'transaction.referenceId'] });
  const [selected, setSelected] = useState(null);
  const [referenceId, setReferenceId] = useState('');
  const [failReason, setFailReason] = useState('');

  const canTransfer = selected && txnStatus(selected) !== 'TRANSFERRED';

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Transaction"
        description="Finance ledger — pending, success and failed transfers stay here. Successful loans also appear in Manage Loans."
      />
      <FilterBar
        search={list.search}
        onSearch={list.setSearch}
        filters={[
          {
            key: 'transaction.status',
            value: list.filters['transaction.status'] || 'all',
            onChange: (v) => list.setFilter('transaction.status', v),
            options: [
              { value: 'all', label: 'All transfers' },
              { value: 'PENDING', label: 'Pending' },
              { value: 'SUCCESS', label: 'Success' },
              { value: 'FAILED', label: 'Failed' },
            ],
          },
        ]}
      />
      <DataTable
        columns={[
          { key: 'id', label: 'App ID', render: (r) => <span className="font-mono text-primary">{r.id}</span> },
          { key: 'customer', label: 'Customer', render: (r) => (isFinance ? '••••••' : r.customer?.name) },
          { key: 'amount', label: 'Amount', render: (r) => <span className="font-mono font-semibold">{formatCurrency(approvedOf(r))}</span> },
          { key: 'mode', label: 'Mode', render: (r) => r.disbursement?.mode || r.transaction?.mode || '—' },
          { key: 'ref', label: 'Reference', render: (r) => <span className="font-mono">{r.transaction?.referenceId || '—'}</span> },
          { key: 'status', label: 'Transfer', render: (r) => <StatusBadge status={txnStatus(r)} /> },
          {
            key: 'actions',
            label: 'Actions',
            render: (r) => (
              <PrimaryButton className="h-8 px-3 text-xs" onClick={() => { setSelected(r); setReferenceId(r.transaction?.referenceId || ''); setFailReason(''); }}>
                {txnStatus(r) === 'TRANSFERRED' ? 'View' : 'Transfer'}
              </PrimaryButton>
            ),
          },
        ]}
        data={list.paged}
        page={list.page}
        totalPages={list.totalPages}
        onPageChange={list.setPage}
        pageSize={list.pageSize}
        onPageSizeChange={list.setPageSize}
        totalItems={list.totalItems}
      />

      <Modal
        open={!!selected}
        title={canTransfer ? 'Complete transfer' : 'Transfer record'}
        onClose={() => setSelected(null)}
        footer={
          selected && (
            <>
              {canTransfer && (
                <DangerButton
                  onClick={() => {
                    transactionService.failTransaction(selected.id, failReason || 'Transfer failed');
                    toast.error('Failed — still on this ledger, retry from disbursement');
                    setSelected(null);
                  }}
                >
                  Mark failed
                </DangerButton>
              )}
              <GhostButton onClick={() => setSelected(null)}>Close</GhostButton>
              {canTransfer && (
                <PrimaryButton
                  onClick={() => {
                    if (!referenceId) return toast.error('Enter reference ID');
                    transactionService.completeTransaction(selected.id, referenceId);
                    toast.success('Transferred — stays here and in Manage Loans');
                    setSelected(null);
                  }}
                >
                  Confirm transfer
                </PrimaryButton>
              )}
            </>
          )
        }
      >
        {selected && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-primary-surface text-center">
              <p className="text-xs text-foreground-muted">Amount</p>
              <p className="text-3xl font-mono font-semibold mt-1">{formatCurrency(approvedOf(selected))}</p>
              <p className="text-xs mt-2">{selected.disbursement?.mode}</p>
            </div>
            {!isFinance && (
              <p className="text-sm text-foreground-muted">
                {selected.customer?.name} · {selected.customer?.bankDetails?.accountNumber} · {selected.customer?.bankDetails?.ifsc}
              </p>
            )}
            {selected.transaction?.completedAt && (
              <p className="text-sm">Completed {formatDateTime(selected.transaction.completedAt)}</p>
            )}
            {canTransfer && (
              <>
                <Field label="Reference ID">
                  <input className={inputClass} value={referenceId} onChange={(e) => setReferenceId(e.target.value)} placeholder="UTR / UPI ref" />
                </Field>
                <Field label="Failure reason (if failing)">
                  <input className={inputClass} value={failReason} onChange={(e) => setFailReason(e.target.value)} />
                </Field>
              </>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
