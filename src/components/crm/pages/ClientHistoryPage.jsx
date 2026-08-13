'use client';

import { useMemo, useState } from 'react';
import PageHeader from '@/components/crm/ui/PageHeader';
import FilterBar from '@/components/crm/ui/FilterBar';
import DataTable from '@/components/crm/ui/DataTable';
import ApplicationDetail from '@/components/crm/ui/ApplicationDetail';
import Modal from '@/components/crm/ui/Modal';
import StatusBadge from '@/components/crm/ui/StatusBadge';
import { GhostButton } from '@/components/crm/ui/FormControls';
import { useLoanStore } from '@/lib/store/loanStore';
import { useCrmList } from '@/lib/hooks/useCrmList';
import { formatCurrency, formatDate } from '@/lib/utils/format';

export default function ClientHistoryPage() {
  const applications = useLoanStore((s) => s.applications);
  const list = useCrmList(applications, { searchKeys: ['id', 'customer.name', 'customer.mobile', 'customer.pan'] });
  const [selected, setSelected] = useState(null);

  const grouped = useMemo(() => {
    const map = new Map();
    list.filtered.forEach((app) => {
      const key = app.customer?.mobile || app.customer?.name;
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(app);
    });
    return Array.from(map.entries()).map(([key, loans]) => ({
      id: key,
      name: loans[0].customer?.name,
      mobile: loans[0].customer?.mobile,
      count: loans.length,
      active: loans.filter((l) => l.status === 'ACTIVE').length,
      loans,
    }));
  }, [list.filtered]);

  return (
    <div className="animate-fade-in">
      <PageHeader title="Client history" description="Search by name or mobile to see every loan for a customer" />
      <FilterBar search={list.search} onSearch={list.setSearch} searchPlaceholder="Search name or mobile" />
      <DataTable
        columns={[
          { key: 'name', label: 'Customer' },
          { key: 'mobile', label: 'Mobile', render: (r) => <span className="font-mono">{r.mobile}</span> },
          { key: 'count', label: 'Loans' },
          { key: 'active', label: 'Active' },
          {
            key: 'actions',
            label: 'Actions',
            render: (r) => (
              <GhostButton className="h-8 px-3 text-xs" onClick={() => setSelected(r)}>
                View loans
              </GhostButton>
            ),
          },
        ]}
        data={grouped}
      />
      <Modal open={!!selected} title={selected?.name} onClose={() => setSelected(null)} wide>
        {selected?.loans.map((loan) => (
          <div key={loan.id} className="mb-4 p-4 rounded-xl border border-border">
            <div className="flex justify-between mb-3">
              <span className="font-mono text-primary">{loan.id}</span>
              <StatusBadge status={loan.status} />
            </div>
            <p className="text-sm text-foreground-muted mb-2">
              {formatCurrency(loan.loan?.amount)} · Created {formatDate(loan.timeline?.createdAt)}
            </p>
            <ApplicationDetail app={loan} />
          </div>
        ))}
      </Modal>
    </div>
  );
}
