'use client';

import { useMemo } from 'react';
import PageHeader from '@/components/crm/ui/PageHeader';
import FilterBar from '@/components/crm/ui/FilterBar';
import DataTable from '@/components/crm/ui/DataTable';
import { paymentService } from '@/lib/services/paymentService';
import { useLoanStore } from '@/lib/store/loanStore';
import { csvExport, useCrmList } from '@/lib/hooks/useCrmList';
import { formatCurrency, formatDate } from '@/lib/utils/format';
import toast from 'react-hot-toast';

export default function PaymentHistoryPage() {
  const applications = useLoanStore((s) => s.applications);
  const rows = useMemo(() => paymentService.getHistory(), [applications]);
  const list = useCrmList(rows, { searchKeys: ['id', 'applicationId', 'customer', 'mobile', 'receipt'] });

  return (
    <div className="animate-fade-in">
      <PageHeader title="Payment history" description="All receipts across active and closed loans" />
      <FilterBar
        search={list.search}
        onSearch={list.setSearch}
        onExport={() =>
          csvExport('payment-history.csv', list.filtered, [
            { key: 'id', label: 'Txn ID' },
            { key: 'applicationId', label: 'App ID' },
            { key: 'customer', label: 'Customer' },
            { label: 'Amount', export: (r) => r.amount },
            { key: 'type', label: 'Type' },
            { key: 'mode', label: 'Mode' },
          ])
        }
      />
      <DataTable
        columns={[
          { key: 'id', label: 'Txn ID', render: (r) => <span className="font-mono">{r.id}</span> },
          { key: 'applicationId', label: 'App ID', render: (r) => <span className="font-mono text-primary">{r.applicationId}</span> },
          { key: 'customer', label: 'Customer' },
          { key: 'amount', label: 'Amount', render: (r) => formatCurrency(r.amount) },
          { key: 'type', label: 'Type' },
          { key: 'mode', label: 'Mode' },
          { key: 'date', label: 'Date', render: (r) => formatDate(r.date) },
          { key: 'receipt', label: 'Receipt' },
          {
            key: 'download',
            label: 'Download',
            render: (r) => (
              <button
                type="button"
                className="text-sm text-primary font-medium"
                onClick={() => toast.success(`Receipt ${r.receipt} downloaded`)}
              >
                PDF
              </button>
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
