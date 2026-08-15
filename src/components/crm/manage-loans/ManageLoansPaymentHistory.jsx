'use client';
import { formatCurrency, formatDateTime } from '@/lib/utils/format';

export default function ManageLoansPaymentHistory({ payments, isDark = false }) {
  if (!payments || payments.length === 0) {
    return (
      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
        No payments recorded
      </p>
    );
  }

  return (
    <div className={`rounded-xl border-2 overflow-hidden ${
      isDark ? 'border-gold-700/30 bg-gray-800/50' : 'border-gold-200 bg-gold-50/30'
    }`}>
      <div className="p-4">
        <h4 className={`text-sm font-semibold mb-3 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
          Payment History
        </h4>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className={isDark ? 'bg-gray-700/50' : 'bg-gold-100/50'}>
            <tr>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Transaction ID</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Type</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Amount</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Mode</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Date</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr
                key={payment.id}
                className={`border-b ${
                  isDark ? 'border-gold-700/30' : 'border-gold-100'
                } hover:bg-gold-50/30 dark:hover:bg-gray-700/30 transition-colors`}
              >
                <td className="px-4 py-2 text-sm font-mono text-gold-600 dark:text-gold-400">{payment.id}</td>
                <td className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">{payment.type || '—'}</td>
                <td className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">{formatCurrency(payment.amount)}</td>
                <td className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">{payment.mode || '—'}</td>
                <td className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">{formatDateTime(payment.date)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}