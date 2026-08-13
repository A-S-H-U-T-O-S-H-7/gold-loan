'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import PageHeader from '@/components/crm/ui/PageHeader';
import FilterBar from '@/components/crm/ui/FilterBar';
import DataTable from '@/components/crm/ui/DataTable';
import Modal from '@/components/crm/ui/Modal';
import { DangerButton, Field, GhostButton, PrimaryButton, inputClass } from '@/components/crm/ui/FormControls';
import { followupService } from '@/lib/services/followupService';
import { useLoanStore } from '@/lib/store/loanStore';
import { useCrmList } from '@/lib/hooks/useCrmList';
import { formatDateTime } from '@/lib/utils/format';

export default function FollowUpPage() {
  const applications = useLoanStore((s) => s.applications);
  const rows = useMemo(() => followupService.getList(), [applications]);
  const list = useCrmList(rows, { searchKeys: ['id', 'customer.name', 'customer.mobile'] });
  const [callApp, setCallApp] = useState(null);
  const [form, setForm] = useState({ status: 'Connected', response: '', notes: '', nextFollowUp: '' });
  const [rejectApp, setRejectApp] = useState(null);
  const [reason, setReason] = useState('');

  const priorityClass = {
    Urgent: 'bg-danger-light text-danger',
    Normal: 'bg-warning-light text-warning',
    New: 'bg-info-light text-info',
  };

  return (
    <div className="animate-fade-in">
      <PageHeader title="Follow-up" description="Contact incomplete leads. Same KYC form — mark verified to send to gold evaluation." />
      <FilterBar
        search={list.search}
        onSearch={list.setSearch}
        filters={[
          {
            key: 'priority',
            value: list.filters.priority || 'all',
            onChange: (v) => list.setFilter('priority', v),
            options: [
              { value: 'all', label: 'All priorities' },
              { value: 'Urgent', label: 'Urgent' },
              { value: 'Normal', label: 'Normal' },
              { value: 'New', label: 'New' },
            ],
          },
        ]}
      />
      <DataTable
        columns={[
          { key: 'id', label: 'App ID', render: (r) => <span className="font-mono text-primary">{r.id}</span> },
          { key: 'name', label: 'Name', render: (r) => r.customer?.name },
          { key: 'mobile', label: 'Mobile', render: (r) => <span className="font-mono">{r.customer?.mobile}</span> },
          { key: 'days', label: 'Days pending', render: (r) => <span className="font-mono">{r.daysPending}</span> },
          { key: 'count', label: 'Follow-up count', render: (r) => r.followUp?.count || 0 },
          {
            key: 'priority',
            label: 'Priority',
            render: (r) => (
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${priorityClass[r.priority]}`}>
                {r.priority}
              </span>
            ),
          },
          {
            key: 'actions',
            label: 'Actions',
            render: (r) => (
              <div className="flex flex-wrap gap-2">
                <GhostButton className="h-8 px-3 text-xs" onClick={() => setCallApp(r)}>Call</GhostButton>
                <Link href={`/crm/kyc/${r.id}`}>
                  <PrimaryButton className="h-8 px-3 text-xs">KYC verification</PrimaryButton>
                </Link>
                <DangerButton className="h-8 px-3 text-xs" onClick={() => setRejectApp(r)}>Reject</DangerButton>
              </div>
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
        open={!!callApp}
        title={`Call log — ${callApp?.customer?.name || ''}`}
        onClose={() => setCallApp(null)}
        footer={
          <>
            <GhostButton onClick={() => setCallApp(null)}>Cancel</GhostButton>
            <PrimaryButton
              onClick={() => {
                followupService.addCallLog(callApp.id, form);
                toast.success('Call logged');
                setCallApp(null);
                setForm({ status: 'Connected', response: '', notes: '', nextFollowUp: '' });
              }}
            >
              Save log
            </PrimaryButton>
          </>
        }
      >
        {callApp && (
          <div className="space-y-4">
            <p className="text-sm text-foreground-muted">
              {callApp.customer?.mobile} · {callApp.followUp?.count || 0} previous calls
            </p>
            <Field label="Status">
              <select className={inputClass} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option>Connected</option>
                <option>No Answer</option>
                <option>Busy</option>
                <option>Switched Off</option>
              </select>
            </Field>
            <Field label="Response">
              <input className={inputClass} value={form.response} onChange={(e) => setForm({ ...form, response: e.target.value })} />
            </Field>
            <Field label="Notes">
              <textarea className={`${inputClass} h-24 py-2`} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            </Field>
            <Field label="Next follow-up">
              <input type="date" className={inputClass} value={form.nextFollowUp} onChange={(e) => setForm({ ...form, nextFollowUp: e.target.value })} />
            </Field>
            {callApp.followUp?.history?.length > 0 && (
              <div className="border-t border-border pt-3 space-y-2">
                {callApp.followUp.history.map((h) => (
                  <div key={h.id} className="text-sm p-3 rounded-xl bg-background-secondary">
                    <p className="font-medium">{h.status} · {h.response}</p>
                    <p className="text-foreground-muted">{h.notes}</p>
                    <p className="text-xs font-mono mt-1">{formatDateTime(h.at)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </Modal>

      <Modal
        open={!!rejectApp}
        title="Reject application"
        onClose={() => setRejectApp(null)}
        footer={
          <>
            <GhostButton onClick={() => setRejectApp(null)}>Cancel</GhostButton>
            <DangerButton
              onClick={() => {
                followupService.reject(rejectApp.id, reason);
                toast.success('Application rejected');
                setRejectApp(null);
                setReason('');
              }}
            >
              Reject
            </DangerButton>
          </>
        }
      >
        <Field label="Reason">
          <textarea className={`${inputClass} h-24 py-2`} value={reason} onChange={(e) => setReason(e.target.value)} />
        </Field>
      </Modal>
    </div>
  );
}
