'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  Coins,
  FileText,
  Landmark,
  TrendingUp,
  Wallet,
} from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import PageHeader from '@/components/crm/ui/PageHeader';
import StatCard from '@/components/crm/ui/StatCard';
import StatusBadge from '@/components/crm/ui/StatusBadge';
import DataTable from '@/components/crm/ui/DataTable';
import { useLoanStore } from '@/lib/store/loanStore';
import { paymentService } from '@/lib/services/paymentService';
import { reportService } from '@/lib/services/reportService';
import { formatCurrency, formatDate } from '@/lib/utils/format';

const PIPELINE = [
  { status: 'FOLLOW_UP', href: '/crm/follow-up' },
  { status: 'KYC_VERIFIED', href: '/crm/gold-evaluation' },
  { status: 'GOLD_EVALUATED', href: '/crm/loan-offer' },
  { status: 'OFFER_ACCEPTED', href: '/crm/credit-approval' },
  { status: 'APPROVED', href: '/crm/disbursement' },
  { status: 'READY_FOR_TRANSFER', href: '/crm/transaction' },
  { status: 'ACTIVE', href: '/crm/active-loans' },
  { status: 'OVERDUE', href: '/crm/overdue-loans' },
];

const PIE_COLORS = ['#C9A84C', '#2E7D32', '#C62828', '#1565C0', '#F57C00', '#1A2A3A'];

export default function Dashboard() {
  const applications = useLoanStore((s) => s.applications);
  const gold = reportService.goldSummary();

  const stats = useMemo(() => {
    const active = applications.filter((a) => a.status === 'ACTIVE');
    const overdue = applications.filter((a) => a.status === 'OVERDUE' || a.status === 'NPA');
    const disbursed = applications.filter((a) =>
      ['ACTIVE', 'OVERDUE', 'NPA', 'CLOSED', 'TRANSFERRED'].includes(a.status)
    );
    return {
      total: applications.length,
      active: active.length,
      overdue: overdue.length,
      book: disbursed.reduce((sum, a) => sum + (a.loan?.amount || 0), 0),
      collection: paymentService.getHistory().reduce((sum, p) => sum + Number(p.amount || 0), 0),
    };
  }, [applications]);

  const statusData = useMemo(() => {
    const counts = applications.reduce((acc, a) => {
      acc[a.status] = (acc[a.status] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [applications]);

  const branchData = reportService.branchPerformance().map((b) => ({
    name: b.name,
    amount: b.amount,
  }));

  const recent = [...applications]
    .sort((a, b) => new Date(b.timeline?.createdAt || 0) - new Date(a.timeline?.createdAt || 0))
    .slice(0, 8);

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Dashboard"
        description="Gold loan pipeline, collections and vault at a glance"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
        <StatCard label="Applications" value={stats.total} hint="All pipeline stages" icon={FileText} />
        <StatCard label="Active loans" value={stats.active} hint="Live book" icon={Wallet} tone="success" />
        <StatCard label="Overdue / NPA" value={stats.overdue} hint="Needs collection" icon={AlertTriangle} tone="danger" />
        <StatCard label="Loan book" value={formatCurrency(stats.book)} hint="Disbursed principal" icon={Landmark} />
        <StatCard label="Collections" value={formatCurrency(stats.collection)} hint="All receipts" icon={TrendingUp} tone="info" />
        <StatCard label="Gold in vault" value={`${gold.totalWeight.toFixed(1)} g`} hint={`${gold.lockersOccupied} lockers occupied`} icon={Coins} tone="warning" />
      </div>

      <div className="grid lg:grid-cols-4 gap-3 mb-6">
        {PIPELINE.map((item) => {
          const count = applications.filter((a) => a.status === item.status).length;
          return (
            <Link
              key={item.status}
              href={item.href}
              className="card p-4 hover:border-primary/40 transition-colors"
            >
              <p className="text-xs text-foreground-muted mb-2">{item.status.replaceAll('_', ' ')}</p>
              <p className="text-2xl font-mono font-semibold">{count}</p>
            </Link>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-4 mb-6">
        <div className="card p-4">
          <h3 className="mb-4">Status mix</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80}>
                  {statusData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="card p-4">
          <h3 className="mb-4">Disbursement by branch</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={branchData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(v) => formatCurrency(v)} />
                <Bar dataKey="amount" fill="#C9A84C" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <h3 className="mb-3">Recent applications</h3>
      <DataTable
        columns={[
          { key: 'id', label: 'App ID', render: (r) => <span className="font-mono text-primary">{r.id}</span> },
          { key: 'name', label: 'Customer', render: (r) => r.customer?.name },
          { key: 'mobile', label: 'Mobile', render: (r) => <span className="font-mono">{r.customer?.mobile}</span> },
          { key: 'amount', label: 'Amount', render: (r) => r.loan ? formatCurrency(r.loan.amount) : '—' },
          { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status} /> },
          { key: 'date', label: 'Created', render: (r) => formatDate(r.timeline?.createdAt) },
        ]}
        data={recent}
        empty="No applications yet"
      />
    </div>
  );
}
