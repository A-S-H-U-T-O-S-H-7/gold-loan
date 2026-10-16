'use client';

import DataTable from '@/components/crm/ui/DataTable';
import StatusBadge from '@/components/crm/ui/StatusBadge';
import KycVerificationBadge from '@/components/crm/ui/KycVerificationBadge';

const columns = [
  { key: 'applicationNo', label: 'Application No.', width: '160px' },
  { key: 'source', label: 'Source', width: '90px' },
  { key: 'branchName', label: 'Branch', width: '130px', render: (app) => app.branchName || 'Unassigned' },
  { key: 'name', label: 'Customer Name', width: '160px' },
  { key: 'mobile', label: 'Mobile', width: '130px' },
  { key: 'email', label: 'Email', width: '180px', render: (app) => app.email || '—' },
  { key: 'requestedAmount', label: 'Requested Amount', width: '150px', render: (app) => app.requestedAmount == null ? '—' : `₹${Number(app.requestedAmount).toLocaleString('en-IN')}` },
  { key: 'createdAt', label: 'Created', width: '130px', render: (app) => app.createdAt ? new Date(app.createdAt).toLocaleDateString('en-IN') : '—' },
  { key: 'kycVerified', label: 'KYC', width: '120px', render: (app) => <KycVerificationBadge verified={app.kycVerified} /> },
  { key: 'status', label: 'Status', width: '140px', render: (app) => <StatusBadge status={app.status} /> },
  { key: 'latestRemark', label: 'Last Remark', width: '200px', render: (app) => app.latestRemark || '—' },
];

export default function ApplicationListTable({ list, title, isDark }) {
  return <DataTable
    columns={columns}
    data={list.applications}
    currentPage={list.page}
    totalPages={list.pagination.total_pages}
    totalItems={list.pagination.total}
    itemsPerPage={list.perPage}
    pageSizeOptions={[10, 20, 50, 100]}
    onPageChange={list.setPage}
    onPageSizeChange={list.setPerPage}
    isDark={isDark}
    emptyMessage={list.loading ? 'Loading applications...' : `No ${title.toLowerCase()} applications found.`}
  />;
}
