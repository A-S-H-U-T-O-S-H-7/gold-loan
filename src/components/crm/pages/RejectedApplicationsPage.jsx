'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import PageHeader from '@/components/crm/ui/PageHeader';
import FilterBar from '@/components/crm/ui/FilterBar';
import DataTable from '@/components/crm/ui/DataTable';
import Modal from '@/components/crm/ui/Modal';
import StatusBadge from '@/components/crm/ui/StatusBadge';
import ApplicationDetail from '@/components/crm/ui/ApplicationDetail';
import { GhostButton, PrimaryButton } from '@/components/crm/ui/FormControls';
import { useLoanStore } from '@/lib/store/loanStore';
import { csvExport, useCrmList } from '@/lib/hooks/useCrmList';
import { formatDate } from '@/lib/utils/format';

const RESTORE_MAP = {
  KYC: 'PENDING',
  GOLD_EVALUATION: 'KYC_VERIFIED',
  LOAN_OFFER: 'GOLD_EVALUATED',
  CREDIT_APPROVAL: 'OFFER_ACCEPTED',
};

export default function RejectedApplicationsPage() {
  const applications = useLoanStore((s) => s.applications.filter((a) => a.status === 'REJECTED'));
  const setStatus = useLoanStore((s) => s.setStatus);
  const list = useCrmList(applications, {
    searchKeys: ['id', 'customer.name', 'customer.mobile', 'rejectedReason'],
  });
  const [selected, setSelected] = useState(null);

  const restore = (row) => {
    const next = row.previousStatus || RESTORE_MAP[row.rejectedStage] || 'PENDING';
    setStatus(row.id, next, { rejectedReason: null, rejectedStage: null });
    toast.success(`${row.id} restored to ${next.replaceAll('_', ' ')}`);
    setSelected(null);
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Rejected applications"
        description="Review declined cases and restore them into the pipeline"
      />
      <FilterBar
        search={list.search}
        onSearch={list.setSearch}
        filters={[
          {
            key: 'stage',
            value: list.filters.rejectedStage || 'all',
            onChange: (v) => list.setFilter('rejectedStage', v),
            options: [
              { value: 'all', label: 'All stages' },
              { value: 'KYC', label: 'KYC' },
              { value: 'GOLD_EVALUATION', label: 'Gold evaluation' },
              { value: 'LOAN_OFFER', label: 'Loan offer' },
              { value: 'CREDIT_APPROVAL', label: 'Credit approval' },
            ],
          },
          {
            key: 'branchId',
            value: list.filters.branchId || 'all',
            onChange: (v) => list.setFilter('branchId', v),
            options: [
              { value: 'all', label: 'All branches' },
              { value: '1', label: 'MG Road' },
              { value: '2', label: 'Andheri West' },
              { value: '3', label: 'Koramangala' },
            ],
          },
        ]}
        onExport={() =>
          csvExport('rejected-applications.csv', list.filtered, [
            { key: 'id', label: 'App ID' },
            { label: 'Customer', export: (r) => r.customer?.name },
            { label: 'Stage', export: (r) => r.rejectedStage },
            { label: 'Reason', export: (r) => r.rejectedReason },
          ])
        }
      />
      <DataTable
        columns={[
          { key: 'id', label: 'App ID', render: (r) => <span className="font-mono text-primary">{r.id}</span> },
          { key: 'customer', label: 'Customer', render: (r) => r.customer?.name },
          { key: 'mobile', label: 'Mobile', render: (r) => <span className="font-mono">{r.customer?.mobile}</span> },
          { key: 'stage', label: 'Rejected stage', render: (r) => r.rejectedStage || '—' },
          { key: 'reason', label: 'Reason', render: (r) => r.rejectedReason || '—' },
          { key: 'date', label: 'Date', render: (r) => formatDate(r.timeline?.createdAt) },
          {
            key: 'actions',
            label: 'Actions',
            render: (r) => (
              <div className="flex gap-2">
                <GhostButton className="h-8 px-3 text-xs" onClick={() => setSelected(r)}>View</GhostButton>
                <PrimaryButton className="h-8 px-3 text-xs" onClick={() => restore(r)}>Restore</PrimaryButton>
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
        open={!!selected}
        title="Rejected application"
        onClose={() => setSelected(null)}
        wide
        footer={
          selected && (
            <>
              <GhostButton onClick={() => setSelected(null)}>Close</GhostButton>
              <PrimaryButton onClick={() => restore(selected)}>Restore</PrimaryButton>
            </>
          )
        }
      >
        <ApplicationDetail app={selected} />
      </Modal>
    </div>
  );
}
