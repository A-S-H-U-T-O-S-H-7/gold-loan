'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import PageHeader from '@/components/crm/ui/PageHeader';
import FilterBar from '@/components/crm/ui/FilterBar';
import DataTable from '@/components/crm/ui/DataTable';
import StatusBadge from '@/components/crm/ui/StatusBadge';
import { GhostButton } from '@/components/crm/ui/FormControls';
import { paymentService } from '@/lib/services/paymentService';
import { useLoanStore } from '@/lib/store/loanStore';
import { useCrmList } from '@/lib/hooks/useCrmList';
import { formatCurrency, formatDate } from '@/lib/utils/format';

export default function LoanStatusListPage({ title, description, statuses, extraColumns = [] }) {
  const applications = useLoanStore((s) => s.applications);
  const rows = useMemo(
    () => applications.filter((a) => statuses.includes(a.status)),
    [applications, statuses]
  );
  const list = useCrmList(rows, { searchKeys: ['id', 'customer.name', 'customer.mobile'] });

  return (
    <div className="animate-fade-in">
      <PageHeader title={title} description={description} />
      <FilterBar search={list.search} onSearch={list.setSearch} />
      <DataTable
        columns={[
          { key: 'id', label: 'App ID', render: (r) => <span className="font-mono text-primary">{r.id}</span> },
          { key: 'name', label: 'Customer', render: (r) => r.customer?.name },
          { key: 'amount', label: 'Amount', render: (r) => formatCurrency(r.loan?.amount) },
          { key: 'due', label: 'Next due', render: (r) => formatDate(paymentService.nextDueOf(r)) },
          { key: 'out', label: 'Outstanding', render: (r) => formatCurrency(paymentService.outstandingOf(r)) },
          ...extraColumns,
          { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status} /> },
          {
            key: 'actions',
            label: 'Actions',
            render: (r) =>
              r.status === 'CLOSED' ? (
                <Link href="/crm/gold-release" className="text-sm text-primary font-medium">Gold release</Link>
              ) : (
                <Link href={`/crm/collect-payment?id=${r.id}`} className="text-sm text-primary font-medium">
                  Collect
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
      />
    </div>
  );
}

export function OverdueLoansPage() {
  const addAudit = useLoanStore((s) => s.addAudit);
  return (
    <LoanStatusListPage
      title="Overdue loans"
      description="Days overdue, penalty tracking and legal notice"
      statuses={['OVERDUE', 'NPA']}
      extraColumns={[
        {
          key: 'days',
          label: 'Days overdue',
          render: (r) => <span className="font-mono text-danger">{paymentService.daysOverdueOf(r)}</span>,
        },
        {
          key: 'penalty',
          label: 'Penalty',
          render: (r) => formatCurrency(Math.round(paymentService.outstandingOf(r) * 0.02)),
        },
        {
          key: 'notice',
          label: 'Notice',
          render: (r) => (
            <GhostButton
              className="h-8 px-3 text-xs"
              onClick={() => {
                addAudit('Legal notice sent', r.id);
                toast.success(`Legal notice queued for ${r.id}`);
              }}
            >
              Send notice
            </GhostButton>
          ),
        },
      ]}
    />
  );
}

export function ClosedLoansPage() {
  return (
    <LoanStatusListPage
      title="Closed loans"
      description="Closed date, total paid and gold release status"
      statuses={['CLOSED']}
      extraColumns={[
        { key: 'closed', label: 'Closed', render: (r) => formatDate(r.timeline?.closedAt) },
        {
          key: 'paid',
          label: 'Total paid',
          render: (r) => formatCurrency((r.payments || []).reduce((s, p) => s + Number(p.amount || 0), 0)),
        },
        { key: 'release', label: 'Gold', render: (r) => (r.goldReleased ? 'Released' : 'In vault') },
      ]}
    />
  );
}
