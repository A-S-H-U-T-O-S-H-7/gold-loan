'use client';

import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { FileText } from 'lucide-react';
import PageHeader from '@/components/crm/ui/PageHeader';
import FilterBar from '@/components/crm/ui/FilterBar';
import DataTable from '@/components/crm/ui/DataTable';
import Modal from '@/components/crm/ui/Modal';
import StatusBadge from '@/components/crm/ui/StatusBadge';
import { Field, GhostButton, PrimaryButton, inputClass } from '@/components/crm/ui/FormControls';
import { disbursementService } from '@/lib/services/disbursementService';
import { useLoanStore } from '@/lib/store/loanStore';
import { DISBURSE_MODES } from '@/lib/constants/crm';
import { useCrmList } from '@/lib/hooks/useCrmList';
import { formatCurrency } from '@/lib/utils/format';

export default function DisbursementPage() {
  const applications = useLoanStore((s) => s.applications);
  const rows = useMemo(() => disbursementService.getQueue(), [applications]);
  const list = useCrmList(rows, { searchKeys: ['id', 'customer.name', 'customer.mobile'] });
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ signatureType: 'E-Sign', mode: 'Bank Transfer' });

  return (
    <div className="animate-fade-in">
      <PageHeader title="Disbursement" description="Generate documents, collect signature and mark ready for transfer" />
      <FilterBar search={list.search} onSearch={list.setSearch} />
      <DataTable
        columns={[
          { key: 'id', label: 'App ID', render: (r) => <span className="font-mono text-primary">{r.id}</span> },
          { key: 'name', label: 'Customer', render: (r) => r.customer?.name },
          { key: 'amount', label: 'Amount', render: (r) => <span className="font-mono">{formatCurrency(r.loan?.amount)}</span> },
          { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status} /> },
          {
            key: 'actions',
            label: 'Actions',
            render: (r) => (
              <PrimaryButton className="h-8 px-3 text-xs" onClick={() => setSelected(r)}>
                Process
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
        title={`Disbursement — ${selected?.id || ''}`}
        onClose={() => setSelected(null)}
        footer={
          selected && (
            <>
              <GhostButton onClick={() => setSelected(null)}>Cancel</GhostButton>
              <PrimaryButton
                onClick={() => {
                  disbursementService.collectSignature(selected.id, form);
                  toast.success('Ready for transfer — locker assigned');
                  setSelected(null);
                }}
              >
                Mark ready for transfer
              </PrimaryButton>
            </>
          )
        }
      >
        {selected && (
          <div className="space-y-4">
            <p className="text-sm text-foreground-muted">
              {selected.customer?.name} · {formatCurrency(selected.loan?.amount)} · {selected.customer?.bankDetails?.bankName} {selected.customer?.bankDetails?.accountNumber}
            </p>
            <div className="space-y-2">
              {disbursementService.generateDocuments(selected.id).map((doc) => (
                <div key={doc} className="flex items-center gap-3 p-3 rounded-xl border border-border">
                  <FileText className="w-4 h-4 text-primary" />
                  <span className="text-sm">{doc}.pdf</span>
                </div>
              ))}
            </div>
            <Field label="Signature">
              <select className={inputClass} value={form.signatureType} onChange={(e) => setForm({ ...form, signatureType: e.target.value })}>
                <option>E-Sign</option>
                <option>Physical</option>
              </select>
            </Field>
            <Field label="Disbursement mode">
              <select className={inputClass} value={form.mode} onChange={(e) => setForm({ ...form, mode: e.target.value })}>
                {DISBURSE_MODES.map((m) => <option key={m}>{m}</option>)}
              </select>
            </Field>
          </div>
        )}
      </Modal>
    </div>
  );
}
