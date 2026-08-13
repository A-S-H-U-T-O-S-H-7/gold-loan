'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import PageHeader from '@/components/crm/ui/PageHeader';
import FilterBar from '@/components/crm/ui/FilterBar';
import DataTable from '@/components/crm/ui/DataTable';
import Modal from '@/components/crm/ui/Modal';
import StatusBadge from '@/components/crm/ui/StatusBadge';
import { Field, GhostButton, PrimaryButton, inputClass } from '@/components/crm/ui/FormControls';
import { customerService } from '@/lib/services/customerService';
import { useLoanStore } from '@/lib/store/loanStore';
import { useCrmList } from '@/lib/hooks/useCrmList';
import { formatDate } from '@/lib/utils/format';

export default function CreateCustomerPage() {
  const applications = useLoanStore((s) => s.applications);
  const rows = useMemo(() => customerService.getLeadQueue(), [applications]);
  const list = useCrmList(rows, { searchKeys: ['id', 'customer.name', 'customer.mobile'] });
  const [open, setOpen] = useState(false);
  const [lead, setLead] = useState({ name: '', mobile: '', email: '', purpose: '' });

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Create customer"
        description="Lead queue. Open KYC verification to fill documents. Status routes the file."
        action={<PrimaryButton onClick={() => setOpen(true)}>New lead</PrimaryButton>}
      />
      <FilterBar
        search={list.search}
        onSearch={list.setSearch}
        filters={[
          {
            key: 'status',
            value: list.filters.status || 'all',
            onChange: (v) => list.setFilter('status', v),
            options: [
              { value: 'all', label: 'All' },
              { value: 'PENDING', label: 'Pending' },
              { value: 'UNDER_REVIEW', label: 'Under review' },
              { value: 'DRAFT', label: 'Draft' },
            ],
          },
        ]}
      />
      <DataTable
        columns={[
          { key: 'id', label: 'App ID', render: (r) => <span className="font-mono text-primary">{r.id}</span> },
          { key: 'name', label: 'Name', render: (r) => r.customer?.name || '—' },
          { key: 'mobile', label: 'Mobile', render: (r) => <span className="font-mono">{r.customer?.mobile}</span> },
          { key: 'purpose', label: 'Purpose', render: (r) => r.customer?.purpose || '—' },
          { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status} /> },
          { key: 'date', label: 'Created', render: (r) => formatDate(r.timeline?.createdAt) },
          {
            key: 'actions',
            label: 'Actions',
            render: (r) => (
              <Link href={`/crm/kyc/${r.id}`}>
                <PrimaryButton className="h-8 px-3 text-xs">KYC verification</PrimaryButton>
              </Link>
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
        empty="No pending leads"
      />

      <Modal
        open={open}
        title="New lead"
        onClose={() => setOpen(false)}
        footer={
          <>
            <GhostButton onClick={() => setOpen(false)}>Cancel</GhostButton>
            <PrimaryButton
              onClick={() => {
                if (!lead.name || !/^[6-9]\d{9}$/.test(lead.mobile)) {
                  return toast.error('Name and valid 10-digit mobile required');
                }
                const created = customerService.createLead(lead);
                toast.success(`${created.id} created as Pending`);
                setLead({ name: '', mobile: '', email: '', purpose: '' });
                setOpen(false);
              }}
            >
              Save lead
            </PrimaryButton>
          </>
        }
      >
        <div className="space-y-3">
          <Field label="Name"><input className={inputClass} value={lead.name} onChange={(e) => setLead({ ...lead, name: e.target.value })} /></Field>
          <Field label="Mobile"><input className={inputClass} maxLength={10} value={lead.mobile} onChange={(e) => setLead({ ...lead, mobile: e.target.value })} /></Field>
          <Field label="Email"><input className={inputClass} value={lead.email} onChange={(e) => setLead({ ...lead, email: e.target.value })} /></Field>
          <Field label="Purpose"><input className={inputClass} value={lead.purpose} onChange={(e) => setLead({ ...lead, purpose: e.target.value })} placeholder="Personal / Business / Medical" /></Field>
        </div>
      </Modal>
    </div>
  );
}
