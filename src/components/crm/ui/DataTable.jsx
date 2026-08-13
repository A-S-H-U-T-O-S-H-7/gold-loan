'use client';

import Pagination from '@/components/crm/Pagination';

export default function DataTable({
  columns,
  data,
  empty = 'No records found',
  page,
  totalPages,
  onPageChange,
  pageSize,
  onPageSizeChange,
  totalItems,
}) {
  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-background-secondary text-left text-foreground-muted">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-4 py-3 font-semibold text-xs uppercase tracking-wide whitespace-nowrap ${col.className || ''}`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-16 text-center text-foreground-muted">
                  {empty}
                </td>
              </tr>
            ) : (
              data.map((row, index) => (
                <tr
                  key={row.id || index}
                  className="border-t border-border hover:bg-surface-hover/70 transition-colors"
                >
                  {columns.map((col) => (
                    <td key={col.key} className={`px-4 py-3 align-middle ${col.className || ''}`}>
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {onPageChange && (
        <Pagination
          currentPage={page}
          totalPages={totalPages || 1}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
          totalItems={totalItems ?? data.length}
          itemsPerPage={pageSize}
        />
      )}
    </div>
  );
}
