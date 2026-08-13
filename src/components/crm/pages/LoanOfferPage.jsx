'use client';

import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import PageHeader from '@/components/crm/ui/PageHeader';
import FilterBar from '@/components/crm/ui/FilterBar';
import DataTable from '@/components/crm/ui/DataTable';
import Modal from '@/components/crm/ui/Modal';
import StatusBadge from '@/components/crm/ui/StatusBadge';
import { DangerButton, Field, GhostButton, PrimaryButton, inputClass } from '@/components/crm/ui/FormControls';
import { loanService } from '@/lib/services/loanService';
import { useLoanStore } from '@/lib/store/loanStore';
import { REPAYMENT_TYPES, TENURES } from '@/lib/constants/crm';
import { useCrmList } from '@/lib/hooks/useCrmList';
import { formatCurrency } from '@/lib/utils/format';

export default function LoanOfferPage() {
  const applications = useLoanStore((s) => s.applications);
  const config = useLoanStore((s) => s.config);
  const rows = useMemo(() => loanService.getOfferQueue(), [applications]);
  const list = useCrmList(rows, { searchKeys: ['id', 'customer.name', 'customer.mobile'] });
  const [selected, setSelected] = useState(null);
  const [offer, setOffer] = useState({ amount: '', rate: 12, tenure: 6, processingFee: 1.5, repaymentType: 'EMI', note: '' });

  const computed = loanService.calculateEmi(offer.amount, offer.rate, offer.tenure, offer.repaymentType);

  const open = (row) => {
    const suggested = loanService.suggestedAmount(row);
    setSelected(row);
    setOffer({
      amount: row.loan?.offeredAmount || row.loan?.amount || suggested,
      rate: row.loan?.rate || config.interestRate,
      tenure: row.loan?.tenure || 6,
      processingFee: row.loan?.processingFee || config.processingFee,
      repaymentType: row.loan?.repaymentType || 'Monthly Interest',
      note: row.loan?.acceptanceNote || '',
    });
  };

  return (
    <div className="animate-fade-in">
      <PageHeader title="Loan offer" description="Offered amount cannot exceed frozen eligible. Accept with a note to send to credit." />
      <FilterBar search={list.search} onSearch={list.setSearch} />
      <DataTable
        columns={[
          { key: 'id', label: 'App ID', render: (r) => <span className="font-mono text-primary">{r.id}</span> },
          { key: 'name', label: 'Customer', render: (r) => r.customer?.name },
          { key: 'gold', label: 'Gold', render: (r) => r.gold ? `${r.gold.netWeight}g ${r.gold.purity}` : '—' },
          { key: 'eligible', label: 'Eligible', render: (r) => formatCurrency(loanService.suggestedAmount(r)) },
          { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status} /> },
          {
            key: 'actions',
            label: 'Actions',
            render: (r) => <PrimaryButton className="h-8 px-3 text-xs" onClick={() => open(r)}>Offer</PrimaryButton>,
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
        title={`Loan offer — ${selected?.id || ''}`}
        onClose={() => setSelected(null)}
        wide
        footer={
          selected && (
            <>
              <GhostButton
                onClick={() => {
                  if (saveOffer(selected, offer, false)) setSelected(null);
                }}
              >
                Save pending
              </GhostButton>
              <DangerButton
                onClick={() => {
                  loanService.rejectOffer(selected.id, offer.note || 'Customer declined offer');
                  toast.success('Offer rejected');
                  setSelected(null);
                }}
              >
                Reject
              </DangerButton>
              <PrimaryButton
                onClick={() => {
                  if (saveOffer(selected, offer, true)) setSelected(null);
                }}
              >
                Customer accepted
              </PrimaryButton>
            </>
          )
        }
      >
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Loan amount (≤ eligible)">
            <input type="number" className={inputClass} value={offer.amount} onChange={(e) => setOffer({ ...offer, amount: e.target.value })} />
          </Field>
          <Field label="Interest rate (% p.a.)">
            <input type="number" className={inputClass} value={offer.rate} onChange={(e) => setOffer({ ...offer, rate: e.target.value })} />
          </Field>
          <Field label="Tenure">
            <select className={inputClass} value={offer.tenure} onChange={(e) => setOffer({ ...offer, tenure: Number(e.target.value) })}>
              {TENURES.map((t) => <option key={t} value={t}>{t} months</option>)}
            </select>
          </Field>
          <Field label="Processing fee (%)">
            <input type="number" className={inputClass} value={offer.processingFee} onChange={(e) => setOffer({ ...offer, processingFee: e.target.value })} />
          </Field>
          <Field label="Repayment type">
            <select className={inputClass} value={offer.repaymentType} onChange={(e) => setOffer({ ...offer, repaymentType: e.target.value })}>
              {REPAYMENT_TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </Field>
          <Field label="Acceptance / decline note">
            <textarea className={`${inputClass} h-20 py-2`} value={offer.note} onChange={(e) => setOffer({ ...offer, note: e.target.value })} />
          </Field>
        </div>
        {selected && (
          <p className="mt-3 text-sm text-foreground-muted">Eligible (frozen): {formatCurrency(loanService.suggestedAmount(selected))}</p>
        )}
        <div className="mt-4 grid sm:grid-cols-3 gap-3">
          <div className="p-3 rounded-xl bg-primary-surface">
            <p className="text-xs text-foreground-muted">EMI / monthly</p>
            <p className="font-mono font-semibold mt-1">{computed.emi ? formatCurrency(computed.emi) : '—'}</p>
          </div>
          <div className="p-3 rounded-xl bg-primary-surface">
            <p className="text-xs text-foreground-muted">Interest</p>
            <p className="font-mono font-semibold mt-1">{formatCurrency(computed.interest)}</p>
          </div>
          <div className="p-3 rounded-xl bg-primary-surface">
            <p className="text-xs text-foreground-muted">Total payable</p>
            <p className="font-mono font-semibold mt-1">{formatCurrency(computed.totalPayable)}</p>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function saveOffer(selected, offer, accept) {
  const eligible = loanService.suggestedAmount(selected);
  const amount = Number(offer.amount);
  if (!amount) {
    toast.error('Enter loan amount');
    return false;
  }
  if (amount > eligible) {
    toast.error(`Amount cannot exceed eligible ${eligible}`);
    return false;
  }
  if (accept && !offer.note) {
    toast.error('Add an acceptance note');
    return false;
  }
  loanService.generateOffer(selected.id, {
    offeredAmount: amount,
    amount,
    eligibleAmount: eligible,
    rate: Number(offer.rate),
    tenure: Number(offer.tenure),
    processingFee: Number(offer.processingFee),
    repaymentType: offer.repaymentType,
  });
  if (accept) {
    loanService.acceptOffer(selected.id, offer.note);
    toast.success('Accepted — sent to credit approval');
  } else {
    toast.success('Offer saved as pending');
  }
  return true;
}
