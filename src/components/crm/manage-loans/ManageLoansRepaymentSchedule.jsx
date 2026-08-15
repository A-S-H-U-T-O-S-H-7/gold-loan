'use client';
import StatusBadge from '@/components/crm/ui/StatusBadge';
import { formatCurrency, formatDate } from '@/lib/utils/format';

export default function ManageLoansRepaymentSchedule({ schedule, isDark = false }) {
  if (!schedule || schedule.length === 0) {
    return (
      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
        No repayment schedule available
      </p>
    );
  }

  return (
    <div className={`rounded-xl border-2 overflow-hidden ${
      isDark ? 'border-gold-700/30 bg-gray-800/50' : 'border-gold-200 bg-gold-50/30'
    }`}>
      <div className="p-4">
        <h4 className={`text-sm font-semibold mb-3 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
          Repayment Schedule
        </h4>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className={isDark ? 'bg-gray-700/50' : 'bg-gold-100/50'}>
            <tr>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">#</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Due Date</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Amount</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Status</th>
            </tr>
          </thead>
          <tbody>
            {schedule.map((row, index) => {
              let status = 'PENDING';
              if (row.status === 'Paid' || row.status === 'PAID') status = 'CLOSED';
              else if (row.status === 'Overdue' || row.status === 'OVERDUE') status = 'OVERDUE';
              
              return (
                <tr
                  key={index}
                  className={`border-b ${
                    isDark ? 'border-gold-700/30' : 'border-gold-100'
                  } ${index % 2 === 0 ? (isDark ? 'bg-gray-800/30' : 'bg-white') : (isDark ? 'bg-gray-800/20' : 'bg-gold-50/30')}`}
                >
                  <td className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">{index + 1}</td>
                  <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">{formatDate(row.dueDate)}</td>
                  <td className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">{formatCurrency(row.amount)}</td>
                  <td className="px-4 py-2">
                    <StatusBadge status={status} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}