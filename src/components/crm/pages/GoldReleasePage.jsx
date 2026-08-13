'use client';

import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import PageHeader from '@/components/crm/ui/PageHeader';
import DataTable from '@/components/crm/ui/DataTable';
import Modal from '@/components/crm/ui/Modal';
import { Field, GhostButton, PrimaryButton, inputClass } from '@/components/crm/ui/FormControls';
import { vaultService } from '@/lib/services/vaultService';
import { useLoanStore } from '@/lib/store/loanStore';
import { formatDate } from '@/lib/utils/format';

export default function GoldReleasePage() {
  const applications = useLoanStore((s) => s.applications);
  const rows = useMemo(() => vaultService.getReleaseQueue(), [applications]);
  const [selected, setSelected] = useState(null);
  const [otp, setOtp] = useState('');
  const [ack, setAck] = useState(false);

  return (
    <div className="animate-fade-in">
      <PageHeader title="Loan closure & gold release" description="OTP verification and handover after full payment. Closed → gold released." />
      <DataTable
        columns={[
          { key: 'id', label: 'App ID', render: (r) => <span className="font-mono text-primary">{r.id}</span> },
          { key: 'name', label: 'Customer', render: (r) => r.customer?.name },
          { key: 'mobile', label: 'Mobile', render: (r) => r.customer?.mobile },
          { key: 'locker', label: 'Locker', render: (r) => r.lockerId || '—' },
          { key: 'closed', label: 'Closed', render: (r) => formatDate(r.timeline?.closedAt) },
          {
            key: 'actions',
            label: 'Actions',
            render: (r) => (
              <PrimaryButton className="h-8 px-3 text-xs" onClick={() => { setSelected(r); setOtp(''); setAck(false); }}>
                Release
              </PrimaryButton>
            ),
          },
        ]}
        data={rows}
        empty="No closed loans awaiting gold release"
      />

      <Modal
        open={!!selected}
        title={`Release gold — ${selected?.id || ''}`}
        onClose={() => setSelected(null)}
        footer={
          selected && (
            <>
              <GhostButton onClick={() => setSelected(null)}>Cancel</GhostButton>
              <PrimaryButton
                onClick={() => {
                  if (otp !== '123456') return toast.error('Invalid OTP — use 123456 for demo');
                  if (!ack) return toast.error('Confirm handover acknowledgement');
                  vaultService.releaseGold(selected.id);
                  toast.success('Gold released from vault');
                  setSelected(null);
                }}
              >
                Confirm handover
              </PrimaryButton>
            </>
          )
        }
      >
        <div className="space-y-4">
          <p className="text-sm text-foreground-muted">
            OTP sent to {selected?.customer?.mobile}. Demo OTP: <span className="font-mono">123456</span>
          </p>
          <Field label="OTP">
            <input className={inputClass} maxLength={6} value={otp} onChange={(e) => setOtp(e.target.value)} />
          </Field>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={ack} onChange={(e) => setAck(e.target.checked)} />
            Customer acknowledged physical handover
          </label>
        </div>
      </Modal>
    </div>
  );
}
