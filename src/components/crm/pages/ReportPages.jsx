'use client';

import PageHeader from '@/components/crm/ui/PageHeader';
import DataTable from '@/components/crm/ui/DataTable';
import { reportService } from '@/lib/services/reportService';
import { useLoanStore } from '@/lib/store/loanStore';
import { formatCurrency, formatDate, formatDateTime, formatNumber } from '@/lib/utils/format';
import StatusBadge from '@/components/crm/ui/StatusBadge';

export function BranchReportsPage() {
  useLoanStore((s) => s.applications);
  const rows = reportService.branchPerformance();
  return (
    <div className="animate-fade-in">
      <PageHeader title="Branch reports" description="Applications, disbursement and NPA by branch" />
      <DataTable
        columns={[
          { key: 'name', label: 'Branch' },
          { key: 'city', label: 'City' },
          { key: 'applications', label: 'Applications' },
          { key: 'disbursed', label: 'Disbursed' },
          { key: 'amount', label: 'Amount', render: (r) => formatCurrency(r.amount) },
          { key: 'overdue', label: 'Overdue' },
          { key: 'npa', label: 'NPA' },
        ]}
        data={rows}
      />
    </div>
  );
}

export function DisbursementReportsPage() {
  useLoanStore((s) => s.applications);
  const rows = reportService.disbursementReport();
  return (
    <div className="animate-fade-in">
      <PageHeader title="Disbursement reports" description="Every transfer and ready-to-disburse case" />
      <DataTable
        columns={[
          { key: 'id', label: 'App ID', render: (r) => <span className="font-mono text-primary">{r.id}</span> },
          { key: 'customer', label: 'Customer' },
          { key: 'amount', label: 'Amount', render: (r) => formatCurrency(r.amount) },
          { key: 'mode', label: 'Mode' },
          { key: 'date', label: 'Date', render: (r) => formatDate(r.date) },
          { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status} /> },
        ]}
        data={rows}
      />
    </div>
  );
}

export function NpaReportsPage() {
  useLoanStore((s) => s.applications);
  const rows = reportService.npaReport();
  return (
    <div className="animate-fade-in">
      <PageHeader title="NPA reports" description="Overdue and 90+ day NPA book" />
      <DataTable
        columns={[
          { key: 'id', label: 'App ID', render: (r) => <span className="font-mono text-primary">{r.id}</span> },
          { key: 'name', label: 'Customer', render: (r) => r.customer?.name },
          { key: 'amount', label: 'Amount', render: (r) => formatCurrency(r.loan?.amount) },
          { key: 'outstanding', label: 'Outstanding', render: (r) => formatCurrency(r.outstanding) },
          { key: 'daysOverdue', label: 'Days overdue', render: (r) => <span className="font-mono text-danger">{r.daysOverdue}</span> },
          { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status} /> },
        ]}
        data={rows}
      />
    </div>
  );
}

export function AuditLogsPage() {
  const logs = useLoanStore((s) => s.auditLogs);
  return (
    <div className="animate-fade-in">
      <PageHeader title="Audit logs" description="Status changes, payments, locker and config events" />
      <DataTable
        columns={[
          { key: 'id', label: 'ID', render: (r) => <span className="font-mono">{r.id}</span> },
          { key: 'action', label: 'Action' },
          { key: 'meta', label: 'Detail' },
          { key: 'actor', label: 'Actor' },
          { key: 'at', label: 'When', render: (r) => formatDateTime(r.at) },
        ]}
        data={logs}
      />
    </div>
  );
}

export function GoldSummaryStrip() {
  useLoanStore((s) => s.lockers);
  const summary = reportService.goldSummary();
  return (
    <p className="text-sm text-foreground-muted mb-4">
      Vault: {formatNumber(summary.totalWeight)} g across {summary.lockersOccupied} lockers
    </p>
  );
}
