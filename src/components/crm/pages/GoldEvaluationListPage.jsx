'use client';

import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import PageHeader from '@/components/crm/ui/PageHeader';
import FilterBar from '@/components/crm/ui/FilterBar';
import DataTable from '@/components/crm/ui/DataTable';
import Modal from '@/components/crm/ui/Modal';
import StatusBadge from '@/components/crm/ui/StatusBadge';
import { DangerButton, Field, GhostButton, PrimaryButton, inputClass } from '@/components/crm/ui/FormControls';
import { goldService } from '@/lib/services/goldService';
import { useLoanStore } from '@/lib/store/loanStore';
import { GOLD_ITEM_NAMES, PURITIES } from '@/lib/constants/crm';
import { useCrmList } from '@/lib/hooks/useCrmList';
import { formatCurrency, formatDate, formatNumber } from '@/lib/utils/format';
import { emptyGoldItem } from '@/lib/utils/loanMath';

export default function GoldEvaluationListPage() {
  const applications = useLoanStore((s) => s.applications);
  const config = useLoanStore((s) => s.config);
  const rows = useMemo(() => goldService.getEvaluationQueue(), [applications]);
  const list = useCrmList(rows, { searchKeys: ['id', 'customer.name', 'customer.mobile'] });
  const [selected, setSelected] = useState(null);
  const [items, setItems] = useState([emptyGoldItem()]);
  const [notes, setNotes] = useState('');
  const [rejectReason, setRejectReason] = useState('');

  const frozen = goldService.calculateFromItems(items);

  const open = (row) => {
    setSelected(row);
    setItems(row.gold?.items?.length ? row.gold.items.map((i) => ({ ...i })) : [emptyGoldItem()]);
    setNotes(row.gold?.remarks || '');
    setRejectReason('');
  };

  const updateItem = (index, patch) => {
    setItems((prev) =>
      prev.map((item, i) => {
        if (i !== index) return item;
        const next = { ...item, ...patch };
        const gross = Number(next.grossWeight) || 0;
        const stone = Number(next.stoneWeight) || 0;
        if (patch.grossWeight !== undefined || patch.stoneWeight !== undefined) {
          next.netWeight = Math.max(0, +(gross - stone).toFixed(3));
        }
        return next;
      })
    );
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Gold evaluation"
        description={`Add each ornament. Eligible = net weight × frozen gold rate × LTV ${config.ltv}%. Locker assigned on evaluate.`}
      />
      <FilterBar search={list.search} onSearch={list.setSearch} />
      <DataTable
        columns={[
          { key: 'id', label: 'App ID', render: (r) => <span className="font-mono text-primary">{r.id}</span> },
          { key: 'name', label: 'Name', render: (r) => r.customer?.name },
          { key: 'mobile', label: 'Mobile', render: (r) => <span className="font-mono">{r.customer?.mobile}</span> },
          { key: 'kyc', label: 'KYC date', render: (r) => formatDate(r.timeline?.kycVerifiedAt) },
          { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status} /> },
          {
            key: 'actions',
            label: 'Actions',
            render: (r) => (
              <PrimaryButton className="h-8 px-3 text-xs" onClick={() => open(r)}>Evaluate</PrimaryButton>
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
        title={`Evaluate gold — ${selected?.id || ''}`}
        onClose={() => setSelected(null)}
        wide
        footer={
          selected && (
            <>
              <GhostButton
                onClick={() => {
                  goldService.saveDraft(selected.id, frozen, notes);
                  toast.success('Pending evaluation');
                  setSelected(null);
                }}
              >
                Pending evaluation
              </GhostButton>
              <DangerButton
                onClick={() => {
                  if (!rejectReason) return toast.error('Enter a reject reason');
                  goldService.reject(selected.id, rejectReason);
                  toast.success('Rejected');
                  setSelected(null);
                }}
              >
                Reject
              </DangerButton>
              <PrimaryButton
                onClick={() => {
                  goldService.submitEvaluation(selected.id, frozen, notes);
                  toast.success('Gold evaluated — eligible amount frozen');
                  setSelected(null);
                }}
              >
                Gold evaluated
              </PrimaryButton>
            </>
          )
        }
      >
        <div className="space-y-4">
          {items.map((item, index) => (
            <div key={item.id || index} className="p-3 rounded-xl border border-border grid md:grid-cols-6 gap-3">
              <Field label="Item">
                <select className={inputClass} value={item.name} onChange={(e) => updateItem(index, { name: e.target.value })}>
                  {GOLD_ITEM_NAMES.map((n) => <option key={n}>{n}</option>)}
                </select>
              </Field>
              <Field label="Carat">
                <select className={inputClass} value={item.carat} onChange={(e) => updateItem(index, { carat: e.target.value })}>
                  {PURITIES.map((n) => <option key={n}>{n}</option>)}
                </select>
              </Field>
              <Field label="Gross g">
                <input type="number" className={inputClass} value={item.grossWeight} onChange={(e) => updateItem(index, { grossWeight: e.target.value })} />
              </Field>
              <Field label="Stone g">
                <input type="number" className={inputClass} value={item.stoneWeight} onChange={(e) => updateItem(index, { stoneWeight: e.target.value })} />
              </Field>
              <Field label="Net g">
                <input type="number" className={inputClass} value={item.netWeight} onChange={(e) => updateItem(index, { netWeight: e.target.value })} />
              </Field>
              <div className="flex items-end">
                <GhostButton className="h-11" onClick={() => setItems((prev) => {
                  const next = prev.filter((_, i) => i !== index);
                  return next.length ? next : [emptyGoldItem()];
                })}>Remove</GhostButton>
              </div>
              <div className="md:col-span-6">
                <Field label="Photo / remark">
                  <input className={inputClass} value={item.remarks} onChange={(e) => updateItem(index, { remarks: e.target.value })} placeholder="Photo filename or note" />
                </Field>
              </div>
            </div>
          ))}
          <GhostButton onClick={() => setItems((prev) => [...prev, emptyGoldItem()])}>Add item</GhostButton>
          <Field label="Admin notes">
            <textarea className={`${inputClass} h-20 py-2`} value={notes} onChange={(e) => setNotes(e.target.value)} />
          </Field>
          <Field label="Reject reason (if rejecting)">
            <input className={inputClass} value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} />
          </Field>
          <div className="grid sm:grid-cols-4 gap-3">
            <Calc label="Net weight" value={`${formatNumber(frozen.netWeight)} g`} />
            <Calc label="Gold value" value={formatCurrency(frozen.goldValue)} />
            <Calc label={`LTV ${frozen.ltvSnapshot}%`} value={`${frozen.ltvSnapshot}%`} />
            <Calc label="Eligible (frozen)" value={formatCurrency(frozen.eligibleAmount)} />
          </div>
        </div>
      </Modal>
    </div>
  );
}

function Calc({ label, value }) {
  return (
    <div className="p-3 rounded-xl bg-primary-surface border border-primary/20">
      <p className="text-xs text-foreground-muted">{label}</p>
      <p className="font-mono font-semibold mt-1">{value}</p>
    </div>
  );
}
