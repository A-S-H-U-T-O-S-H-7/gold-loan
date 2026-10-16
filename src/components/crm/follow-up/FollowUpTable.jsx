'use client';

import { FileText } from 'lucide-react';
import Pagination from '@/components/crm/ui/Pagination';
import FollowUpTableRow from './FollowUpTableRow';

const tableHeaders = [
  { key: 'applicationNo', label: 'Application No.', width: '120px' },
  { key: 'source', label: 'Source', width: '90px' },
  { key: 'call', label: 'Call', width: '80px' },
  { key: 'branchName', label: 'Branch', width: '130px' },
  { key: 'name', label: 'Customer Name', width: '160px' },
  { key: 'mobile', label: 'Mobile', width: '130px' },
  { key: 'currentAddress', label: 'Address', width: '100px' },
  { key: 'requestedAmount', label: 'Requested Amount', width: '100px' },
  { key: 'followUpRemark', label: 'Entry Remark', width: '100px' },
  { key: 'kycVerified', label: 'KYC', width: '130px' },
  { key: 'status', label: 'Status', width: '130px' },
  { key: 'actions', label: 'Actions', width: '170px' },
];

export default function FollowUpTable({
  applications,
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  loading,
  isDark,
  onPageChange,
  onPageSizeChange,
  onStatusClick,
}) {
  const headerStyle = `px-3 py-3 text-center text-sm font-bold border-r last:border-r-0 ${
    isDark ? 'text-gray-100 border-gold-600/40' : 'text-gray-700 border-gold-300/40'
  }`;

  return (
    <div className={`min-w-0 max-w-full overflow-hidden rounded-2xl border-2 shadow-2xl ${
      isDark
        ? 'border-gold-700/50 bg-gray-800 shadow-gold-900/20'
        : 'border-gold-300 bg-white shadow-gold-500/10'
    }`}>
      <div className="max-w-full overflow-x-auto overscroll-x-contain" role="region" aria-label="Follow-up applications table, scroll horizontally to view all columns" tabIndex={0}>
        <table className="w-full min-w-max" style={{ minWidth: '1600px' }}>
          <thead className={`border-b-2 ${
            isDark
              ? 'border-gold-600/50 bg-gradient-to-r from-gray-900 to-gray-800'
              : 'border-gold-300 bg-gradient-to-r from-gold-50 to-amber-50'
          }`}>
            <tr>
              {tableHeaders.map((header) => (
                <th key={header.key} className={headerStyle} style={{ minWidth: header.width }}>
                  {header.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {applications.map((application, index) => (
              <FollowUpTableRow
                key={application.id}
                application={application}
                index={index}
                isDark={isDark}
                onStatusClick={onStatusClick}
              />
            ))}
          </tbody>
        </table>
      </div>

      {applications.length === 0 && (
        <div className={`flex flex-col items-center gap-4 py-12 text-center ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          <FileText className="h-16 w-16 opacity-50" />
          <p className="text-lg font-medium">{loading ? 'Loading applications...' : 'No follow-up applications found.'}</p>
        </div>
      )}

      {totalPages > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageSizeChange={onPageSizeChange}
          pageSizeOptions={[10, 20, 50, 100]}
          isDark={isDark}
        />
      )}
    </div>
  );
}
