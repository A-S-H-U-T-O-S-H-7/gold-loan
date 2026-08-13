'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import PageHeader from '@/components/crm/ui/PageHeader';
import FilterBar from '@/components/crm/ui/FilterBar';
import DataTable from '@/components/crm/ui/DataTable';
import StatusBadge from '@/components/crm/ui/StatusBadge';
import { paymentService } from '@/lib/services/paymentService';
import { useLoanStore } from '@/lib/store/loanStore';
import { useCrmList } from '@/lib/hooks/useCrmList';
import { formatCurrency, formatDate } from '@/lib/utils/format';

const TABS = ['Active', 'Overdue', 'NPA'];

export default function CollectionsWorkbenchPage() {
  const searchParams = useSearchParams();
  const applications = useLoanStore((s) => s.applications);
  const config = useLoanStore((s) => s.config);
  const initial = searchParams.get('tab') || 'Active';
  const [tab, setTab] = useState(TABS.includes(initial) ? initial : 'Active');

  const rows = useMemo(() => {
    return applications
      .filter((a) => ['ACTIVE', 'OVERDUE', 'NPA'].includes(a.status))
      .map((a) => {
        const snap = paymentService.snapshot(a);
        return { ...a, snap, displayStatus: snap.servicingStatus };
      })
      .filter((a) => {
        if (tab === 'Active') return a.displayStatus === 'ACTIVE';
        if (tab === 'Overdue') return a.displayStatus === 'OVERDUE';
        return a.displayStatus === 'NPA';
      });
  }, [applications, tab]);

  const list = useCrmList(rows, { searchKeys: ['id', 'customer.name', 'customer.mobile'] });

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Active / Overdue"
        description={`Collections workbench. Grace ${config.graceDays || 7} days, then penalty ${config.penaltyRate || 2}% / 30 days. NPA after ${config.npaDays || 90} days.`}
      />
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
          { key: 'principal', label: 'Principal', render: (r) => formatCurrency(r.snap.principal) },
          { key: 'due', label: 'Next due', render: (r) => formatDate(r.snap.nextDue) },
          { key: 'interest', label: 'Interest due', render: (r) => formatCurrency(r.snap.interestDue) },
          { key: 'penalty', label: 'Penalty', render: (r) => formatCurrency(r.snap.penaltyDue) },
          { key: 'out', label: 'Outstanding', render: (r) => <span className="font-mono">{formatCurrency(r.snap.outstanding)}</span> },
          { key: 'days', label: 'Days past due', render: (r) => <span className="font-mono">{r.snap.daysPastDue}</span> },
          { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.displayStatus} /> },
          {
            key: 'actions',
            label: 'Actions',
            render: (r) => (
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
