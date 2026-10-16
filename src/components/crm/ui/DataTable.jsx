'use client';
import React from 'react';
import Pagination from './Pagination';

export default function DataTable({
  columns,
  data,
  currentPage,
  totalPages,
  onPageChange,
  onPageSizeChange,
  itemsPerPage,
  pageSizeOptions,
  totalItems,
  isDark = false,
  horizontalScroll = false,
  emptyMessage = "No records found",
  renderRow
}) {
  const headerStyle = `px-4 py-3.5 text-center text-xs font-semibold uppercase tracking-wider border-r last:border-r-0 ${
    isDark 
      ? 'text-gray-200 border-gold-600/40 bg-gray-900'
      : 'text-gray-600 border-gold-300/40 bg-gold-50'
  }`;

  return (
    <div className={`min-w-0 max-w-full rounded-xl shadow-xl border-2 overflow-hidden ${
      isDark
        ? 'bg-gray-800 border-gold-700/50 shadow-gold-900/20'
        : 'bg-white border-gold-200 shadow-gold-500/10'
    }`}>
      <div className="max-w-full overflow-x-auto overscroll-x-contain" role={horizontalScroll ? 'region' : undefined} aria-label={horizontalScroll ? 'Applications table, scroll horizontally to view all columns' : undefined} tabIndex={horizontalScroll ? 0 : undefined}>
        <table className={horizontalScroll ? 'w-max min-w-full' : 'w-full min-w-full'}>
          <thead>
            <tr className={isDark ? 'bg-gray-900' : 'bg-gold-50'}>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`${headerStyle} ${col.sticky ? `sticky left-0 z-20 ${isDark ? 'bg-gray-900' : 'bg-gold-50'}` : ''}`}
                  style={{ minWidth: col.width || 'auto' }}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className={`px-4 py-16 text-center ${
                  isDark ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              renderRow ? (
                data.map((row, index) => renderRow(row, index))
              ) : (
                data.map((row, index) => (
                  <tr
                    key={row.id || index}
                    className={`border-b transition-all duration-200 hover:shadow-md ${
                      isDark
                        ? 'border-gold-700/30 hover:bg-gray-700/50'
                        : 'border-gold-100 hover:bg-gold-50/50'
                    } ${index % 2 === 0 ? (isDark ? 'bg-gray-800/50' : 'bg-white') : (isDark ? 'bg-gray-800/30' : 'bg-gold-50/30')}`}
                  >
                    {columns.map((col) => (
                      <td key={col.key} className={`px-4 py-3 align-middle text-center text-sm border-r last:border-r-0 ${col.sticky ? `sticky left-0 z-10 ${isDark ? 'bg-gray-800' : 'bg-white'}` : ''} ${
                        isDark ? 'border-gold-600/40' : 'border-gold-300/40'
                      }`}>
                        {col.render ? col.render(row) : row[col.key]}
                      </td>
                    ))}
                  </tr>
                ))
              )
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          pageSizeOptions={pageSizeOptions}
          isDark={isDark}
        />
      )}
    </div>
  );
}
