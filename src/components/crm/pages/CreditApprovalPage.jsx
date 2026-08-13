'use client';

import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import PageHeader from '@/components/crm/ui/PageHeader';
import FilterBar from '@/components/crm/ui/FilterBar';
import DataTable from '@/components/crm/ui/DataTable';
import Modal from '@/components/crm/ui/Modal';
import ApplicationDetail from '@/components/crm/ui/ApplicationDetail';
import { DangerButton, Field, GhostButton, PrimaryButton, inputClass } from '@/components/crm/ui/FormControls';
import { loanService } from '@/lib/services/loanService';
import { useLoanStore } from '@/lib/store/loanStore';
import { useCrmList } from '@/lib/hooks/useCrmList';
import { formatCurrency } from '@/lib/utils/format';
import { eligibleOf, offeredOf } from '@/lib/utils/loanMath';

const CHECKS = [
  { key: 'documentsVerified', label: 'Documents verified' },
  { key: 'goldCorrect', label: 'Gold correct' },
  { key: 'ltvWithinLimit', label: 'LTV within limit' },
  { key: 'customerEligible', label: 'Customer eligible' },
];

export default function CreditApprovalPage() {
  const applications = useLoanStore((s) => s.applications);
  const rows = useMemo(() => loanService.getCreditQueue(), [applications]);
  const list = useCrmList(rows, { searchKeys: ['id', 'customer.name', 'customer.mobile'] });
  const [selected, setSelected] = useState(null);
  const [approvedAmount, setApprovedAmount] = useState('');
  const [checks, setChecks] = useState({
    documentsVerified: false,
    goldCorrect: false,
    ltvWithinLimit: false,
    customerEligible: false,
  });

  const open = (row) => {
    setSelected(row);
    setApprovedAmount(row.loan?.approvedAmount || row.loan?.offeredAmount || eligibleOf(row));
    setChecks(row.creditChecklist || {
      documentsVerified: false,
      goldCorrect: false,
      ltvWithinLimit: false,
      customerEligible: false,
    });
  };

  const allChecked = CHECKS.every((c) => checks[c.key]);
  const eligible = selected ? eligibleOf(selected) : 0;
  const overEligible = selected && Number(approvedAmount) > eligible;

  return (
    <div className="animate-fade-in">
      <PageHeader title="Credit approval" description="Review KYC, gold and offer. Approve, reject or send back for evaluation." />
      <FilterBar search={list.search} onSearch={list.setSearch} />
      <DataTable
        columns={[
          { key: 'id', label: 'App ID', render: (r) => <span className="font-mono text-primary">{r.id}</span> },
          { key: 'name', label: 'Customer', render: (r) => r.customer?.name },
          { key: 'amount', label: 'Offered', render: (r) => formatCurrency(offeredOf(r)) },
          { key: 'ltv', label: 'Eligible', render: (r) => formatCurrency(eligibleOf(r)) },
          {
            key: 'actions',
            label: 'Actions',
            render: (r) => <PrimaryButton className="h-8 px-3 text-xs" onClick={() => open(r)}>Review</PrimaryButton>,
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
        title={`Credit review — ${selected?.id || ''}`}
        onClose={() => setSelected(null)}
        wide
        footer={
          selected && (
            <>
              <GhostButton
                onClick={() => {
                  loanService.sendBackToEvaluation(selected.id);
                  toast.success('Sent back for gold review');
                  setSelected(null);
                }}
              >
                Needs review
              </GhostButton>
              <DangerButton
                onClick={() => {
                  loanService.rejectCredit(selected.id, 'Credit policy');
                  toast.success('Application rejected');
                  setSelected(null);
                }}
              >
                Reject
              </DangerButton>
              <PrimaryButton
                disabled={!allChecked || overEligible}
                onClick={() => {
                  loanService.creditApproval(selected.id, checks, approvedAmount);
                  toast.success('Approved — moved to disbursement');
                  setSelected(null);
                }}
              >
                Approve
              </PrimaryButton>
            </>
          )
        }
      >
        <ApplicationDetail app={selected} />
        {selected && (
          <div className="mt-5 space-y-2">
            <p className="text-sm font-medium">Final approved amount</p>
            {overEligible && (
              <p className="text-xs text-warning">Cannot exceed frozen eligible {formatCurrency(eligible)}.</p>
            )}
            <Field label="Approved / disbursable amount">
              <input type="number" className={inputClass} value={approvedAmount} onChange={(e) => setApprovedAmount(e.target.value)} />
            </Field>
            <p className="text-sm font-medium mt-4">Checklist</p>
            {CHECKS.map((item) => (
              <label key={item.key} className="flex items-center gap-3 p-3 rounded-xl border border-border">
                <input
                  type="checkbox"
                  checked={!!checks[item.key]}
                  onChange={(e) => setChecks({ ...checks, [item.key]: e.target.checked })}
                />
                <span className="text-sm">{item.label}</span>
              </label>
            ))}
          </div>
        )}
      </Modal>
    </div>
  );
}
