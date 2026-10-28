'use client';

import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';
import Pagination from '@/components/crm/ui/Pagination';

// Closed and overdue loans get a tinted row so they stand out while scanning.
function rowClass(status, index, isDark) {
  const base = 'border-b transition-all duration-200 hover:shadow-md';

  if (status === 'CLOSED') {
    return `${base} ${isDark
      ? 'border-orange-700/30 bg-gradient-to-r from-orange-900/40 via-orange-800/30 to-orange-900/40'
      : 'border-orange-300 bg-gradient-to-r from-orange-100 via-orange-50 to-orange-100'}`;
  }
  if (status === 'OVERDUE') {
    return `${base} ${isDark
      ? 'border-red-700/30 bg-gradient-to-r from-red-900/40 via-red-800/30 to-red-900/40'
      : 'border-red-300 bg-gradient-to-r from-red-100 via-red-50 to-red-100'}`;
  }

  const stripe = index % 2 === 0
    ? isDark ? 'bg-gray-800/50' : 'bg-white'
    : isDark ? 'bg-gray-800/30' : 'bg-gold-50/40';
  return `${base} ${stripe} ${isDark ? 'border-gold-700/30 hover:bg-gray-700/50' : 'border-gold-100 hover:bg-gold-50/70'}`;
}

export default function ManageLoansTable({ columns, list, isDark, emptyMessage, animationKey }) {
  const headerStyle = `border-r px-3 py-3 text-center text-sm font-bold last:border-r-0 ${
    isDark ? 'border-gold-600/40 text-gray-100' : 'border-gold-300/40 text-gray-700'
  }`;
  const cellStyle = `border-r px-3 py-3 text-center text-sm last:border-r-0 ${
    isDark ? 'border-gold-600/60 text-gray-300' : 'border-gold-300/70 text-gray-700'
  }`;
  const firstSrNo = (list.page - 1) * list.perPage + 1;

  return (
    <>
      <motion.div
        key={animationKey}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        className={`min-w-0 max-w-full overflow-hidden rounded-lg border shadow-lg md:rounded-2xl md:border-2 md:shadow-2xl ${
          isDark
            ? 'border-gold-700/50 bg-gray-800 shadow-gold-900/20'
            : 'border-gold-300 bg-white shadow-gold-500/10'
        }`}
      >
        <div className="max-w-full overflow-x-auto overscroll-x-contain" role="region" aria-label="Issued loans table, scroll horizontally to view all columns" tabIndex={0}>
          <table className="w-full min-w-max">
            <thead className={`border-b-2 ${
              isDark
                ? 'border-gold-600/50 bg-gradient-to-r from-gray-900 to-gray-800'
                : 'border-gold-300 bg-gradient-to-r from-gold-50 to-amber-50'
            }`}>
              <tr>
                {columns.map((column) => (
                  <th key={column.key} className={headerStyle} style={{ minWidth: column.width }}>
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {list.applications.map((row, index) => (
                <tr key={row.id} className={rowClass(row.status, index, isDark)}>
                  {columns.map((column) => (
                    <td key={column.key} className={cellStyle}>
                      {column.render(row, firstSrNo + index)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {list.applications.length === 0 && (
          <div className={`flex flex-col items-center gap-3 py-8 text-center md:gap-4 md:py-12 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            <FileText className="h-12 w-12 opacity-50 md:h-16 md:w-16" />
            <p className="text-base font-medium md:text-lg">{emptyMessage}</p>
            {!list.loading && <p className="text-xs md:text-sm">Try adjusting your search or filters</p>}
          </div>
        )}

        {list.pagination.total_pages > 0 && (
          <Pagination
            currentPage={list.page}
            totalPages={list.pagination.total_pages}
            onPageChange={list.setPage}
            totalItems={list.pagination.total}
            itemsPerPage={list.perPage}
            onPageSizeChange={list.setPerPage}
            pageSizeOptions={[10, 20, 50, 100]}
            isDark={isDark}
          />
        )}
      </motion.div>

      <p className={`mt-4 px-4 text-center text-xs md:hidden ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
        Scroll horizontally to view all columns
      </p>
    </>
  );
}
