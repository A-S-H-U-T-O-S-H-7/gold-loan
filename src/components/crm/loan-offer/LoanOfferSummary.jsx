'use client';
import { formatCurrency } from '@/lib/utils/format';

export default function LoanOfferSummary({ computed, isDark = false }) {
  const items = [
    { label: 'EMI / monthly', value: computed.emi ? formatCurrency(computed.emi) : '—' },
    { label: 'Total Interest', value: formatCurrency(computed.interest) },
    { label: 'Total Payable', value: formatCurrency(computed.totalPayable) },
  ];

  return (
    <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
      {items.map((item, index) => (
        <div
          key={index}
          className={`p-3 rounded-xl border ${
            isDark
              ? 'bg-indigo-900/20 border-indigo-700/30'
              : 'bg-indigo-50 border-indigo-200'
          }`}
        >
          <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            {item.label}
          </p>
          <p className={`font-mono font-semibold mt-1 ${
            isDark ? 'text-indigo-300' : 'text-indigo-700'
          }`}>
            {item.value}
          </p>
        </div>
      ))}
    </div>
  );
}