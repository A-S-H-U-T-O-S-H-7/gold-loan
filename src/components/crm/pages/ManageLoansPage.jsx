'use client';

import { useMemo, useState } from 'react';
import PageHeader from '@/components/crm/ui/PageHeader';
import FilterBar from '@/components/crm/ui/FilterBar';
import DataTable from '@/components/crm/ui/DataTable';
import Modal from '@/components/crm/ui/Modal';
import StatusBadge from '@/components/crm/ui/StatusBadge';
import ApplicationDetail from '@/components/crm/ui/ApplicationDetail';
import { GhostButton } from '@/components/crm/ui/FormControls';
import { loanService } from '@/lib/services/loanService';
import { paymentService } from '@/lib/services/paymentService';
import { useLoanStore } from '@/lib/store/loanStore';
import { useCrmList } from '@/lib/hooks/useCrmList';
import { formatCurrency, formatDate } from '@/lib/utils/format';

const TABS = ['All', 'Active', 'Overdue', 'Closed'];

export default function ManageLoansPage() {
  const applications = useLoanStore((s) => s.applications);
  const [tab, setTab] = useState('All');
  const rows = useMemo(() => loanService.getManageQueue(tab), [applications, tab]);
  const list = useCrmList(rows, { searchKeys: ['id', 'customer.name', 'customer.mobile'] });
  const [selected, setSelected] = useState(null);

  return (
    <div className="animate-fade-in">
      <PageHeader title="Manage loans" description="Full dossier after disbursement — KYC, gold, eligible / offered / approved, payments." />
      <div className="flex gap-2 mb-4">
        {TABS.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setTab(item)}
            className={`h-9 px-4 rounded-full text-sm font-medium ${
              tab === item ? 'bg-primary text-white' : 'bg-surface border border-border text-foreground-secondary'
            }`}
          >
            {item}
          </button>
        ))}
      </div>
      <FilterBar search={list.search} onSearch={list.setSearch} />
      <DataTable
        columns={[
          { key: 'id', label: 'App ID', render: (r) => <span className="font-mono text-primary">{r.id}</span> },
          { key: 'name', label: 'Customer', render: (r) => r.customer?.name },
          { key: 'eligible', label: 'Eligible', render: (r) => formatCurrency(r.gold?.eligibleAmount || r.loan?.eligibleAmount) },
          { key: 'amount', label: 'Approved', render: (r) => formatCurrency(r.loan?.approvedAmount || r.loan?.amount) },
          { key: 'weight', label: 'Gold weight', render: (r) => r.gold ? `${r.gold.netWeight} g` : '—' },
          { key: 'rate', label: 'Rate', render: (r) => r.loan ? `${r.loan.rate}%` : '—' },
          { key: 'due', label: 'Next due', render: (r) => formatDate(paymentService.nextDueOf(r)) },
          { key: 'out', label: 'Outstanding', render: (r) => <span className="font-mono">{formatCurrency(paymentService.outstandingOf(r))}</span> },
          { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status} /> },
          {
            key: 'actions',
            label: 'Actions',
            render: (r) => (
              <GhostButton className="h-8 px-3 text-xs" onClick={() => setSelected(r)}>
                View
              </GhostButton>
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

      <Modal open={!!selected} title="Loan detail" onClose={() => setSelected(null)} wide>
        <ApplicationDetail app={selected} />
        {selected?.repaymentSchedule?.length > 0 && (
          <div className="mt-5">
            <h4 className="text-sm mb-2">Repayment schedule</h4>
            <div className="space-y-2">
              {selected.repaymentSchedule.map((row, i) => (
                <div key={i} className="flex justify-between text-sm p-3 rounded-xl bg-background-secondary">
                  <span>{formatDate(row.dueDate)}</span>
                  <span className="font-mono">{formatCurrency(row.amount)}</span>
                  <StatusBadge status={row.status === 'Paid' ? 'CLOSED' : row.status === 'Overdue' ? 'OVERDUE' : 'PENDING'} />
                </div>
              ))}
            </div>
          </div>
        )}
        {selected?.payments?.length > 0 && (
          <div className="mt-5">
            <h4 className="text-sm mb-2">Payment history</h4>
            {selected.payments.map((p) => (
              <div key={p.id} className="flex justify-between text-sm p-3 rounded-xl border border-border mb-2">
                <span>{p.id} · {p.type} · {p.mode}</span>
                <span className="font-mono">{formatCurrency(p.amount)}</span>
              </div>
            ))}
          </div>
        )}
      </Modal>
    </div>
  );
}
