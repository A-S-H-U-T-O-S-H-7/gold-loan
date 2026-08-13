'use client';

import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import PageHeader from '@/components/crm/ui/PageHeader';
import DataTable from '@/components/crm/ui/DataTable';
import Modal from '@/components/crm/ui/Modal';
import StatusBadge from '@/components/crm/ui/StatusBadge';
import { Field, GhostButton, PrimaryButton, inputClass } from '@/components/crm/ui/FormControls';
import { vaultService } from '@/lib/services/vaultService';
import { useLoanStore } from '@/lib/store/loanStore';
import { formatNumber } from '@/lib/utils/format';

export default function VaultManagementPage() {
  const lockers = useLoanStore((s) => s.lockers);
  const applications = useLoanStore((s) => s.applications);
  const available = useMemo(() => vaultService.getAvailableLockers(), [lockers]);
  const [assignId, setAssignId] = useState(null);
  const [applicationId, setApplicationId] = useState('');

  const pledged = applications.filter((a) => a.lockerId && ['ACTIVE', 'OVERDUE', 'NPA', 'CLOSED', 'READY_FOR_TRANSFER', 'FAILED'].includes(a.status) && !a.goldReleased);

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Vault management"
        description={`${available.length} lockers available · ${lockers.filter((l) => l.status === 'Occupied').length} occupied`}
      />
      <DataTable
        columns={[
          { key: 'id', label: 'Locker' },
          { key: 'goldType', label: 'Gold type', render: (r) => r.goldType || '—' },
          { key: 'weight', label: 'Weight', render: (r) => r.weight ? `${formatNumber(r.weight)} g` : '—' },
          { key: 'applicationId', label: 'App ID', render: (r) => r.applicationId || '—' },
          {
            key: 'status',
            label: 'Status',
            render: (r) => (
              <StatusBadge status={r.status === 'Occupied' ? 'ACTIVE' : r.status === 'Maintenance' ? 'PENDING' : 'CLOSED'} />
            ),
          },
          {
            key: 'actions',
            label: 'Actions',
            render: (r) =>
              r.status === 'Available' ? (
                <PrimaryButton className="h-8 px-3 text-xs" onClick={() => setAssignId(r.id)}>
                  Assign
                </PrimaryButton>
              ) : null,
          },
        ]}
        data={lockers}
      />

      <Modal
        open={!!assignId}
        title={`Assign ${assignId}`}
        onClose={() => setAssignId(null)}
        footer={
          <>
            <GhostButton onClick={() => setAssignId(null)}>Cancel</GhostButton>
            <PrimaryButton
              onClick={() => {
                if (!applicationId) return toast.error('Select application');
                vaultService.assignLocker(applicationId, assignId);
                toast.success('Locker assigned');
                setAssignId(null);
              }}
            >
              Assign
            </PrimaryButton>
          </>
        }
      >
        <Field label="Application">
          <select className={inputClass} value={applicationId} onChange={(e) => setApplicationId(e.target.value)}>
            <option value="">Select</option>
            {pledged.concat(applications.filter((a) => !a.lockerId && a.gold)).map((a) => (
              <option key={a.id} value={a.id}>
                {a.id} — {a.customer?.name}
              </option>
            ))}
          </select>
        </Field>
      </Modal>
    </div>
  );
}
