'use client';

import { dividerClass, headingClass, mutedClass, tileClass } from '@/components/crm/ui/detailStyles';

// A titled box used to group related details inside CRM pop-ups.
export function DetailSection({ title, icon: Icon, isDark, actions, children }) {
  return (
    <section className={`min-w-0 p-4 ${tileClass(isDark)}`}>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h3 className={`${headingClass(isDark)} text-base`}>
          {Icon && <Icon className="h-4 w-4" />}
          {title}
        </h3>
        {actions}
      </div>
      {children}
    </section>
  );
}

// One "label ........ value" line; long values wrap instead of overflowing.
export function InfoRow({ label, value, isDark }) {
  return (
    <div className={`flex justify-between gap-3 border-b py-2 text-sm last:border-b-0 ${dividerClass(isDark)}`}>
      <span className={`shrink-0 ${mutedClass(isDark)}`}>{label}</span>
      <span className="min-w-0 text-right font-medium wrap-anywhere">{value == null || value === '' ? '—' : value}</span>
    </div>
  );
}

// A compact, horizontally scrollable table for lists inside a section.
export function MiniTable({ columns, rows, rowKey = (row) => row.id, isDark, minWidth = 640, emptyText = 'Nothing recorded yet.' }) {
  if (!rows?.length) return <p className={`text-sm ${mutedClass(isDark)}`}>{emptyText}</p>;

  return (
    <div className={`overflow-x-auto rounded-lg border ${isDark ? 'border-gray-700' : 'border-gold-200'}`}>
      <table className="w-full text-sm" style={{ minWidth }}>
        <thead className={isDark ? 'bg-gray-900/60 text-gray-300' : 'bg-gold-50 text-gray-700'}>
          <tr>
            {columns.map((column) => (
              <th key={column.label} className="px-3 py-2 text-left text-xs font-bold uppercase tracking-wide">{column.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={rowKey(row, index)} className={`border-t ${dividerClass(isDark)}`}>
              {columns.map((column) => (
                <td key={column.label} className="px-3 py-2 align-top wrap-anywhere">{column.render(row, index)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
