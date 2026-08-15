'use client';
import { formatCurrency } from '@/lib/utils/format';

export default function CreditSummary({ application, isDark = false }) {
  const gold = application?.gold || {};
  const loan = application?.loan || {};
  const totals = gold.totals || {};

  const items = [
    { label: 'Gold Value', value: formatCurrency(totals.goldValue || 0) },
    { label: 'Eligible Amount', value: formatCurrency(totals.eligibleAmount || 0) },
    { label: 'Offered Amount', value: formatCurrency(loan.offeredAmount || loan.amount || 0) },
    { label: 'Interest Rate', value: `${loan.rate || 0}%` },
    { label: 'Tenure', value: `${loan.tenure || 0} months` },
    { label: 'Repayment Type', value: loan.repaymentType || '—' },
  ];

  return (
    <div className={`rounded-xl border-2 p-5 ${
      isDark ? 'bg-gray-800/50 border-gold-700/30' : 'bg-white/50 border-gold-200'
    }`}>
      <h3 className={`text-sm font-semibold mb-4 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
        Loan Summary
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {items.map((item, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg ${
              isDark ? 'bg-gray-700/50' : 'bg-gold-50/50'
            }`}
          >
            <p className={`text-[10px] uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              {item.label}
            </p>
            <p className={`text-sm font-semibold mt-1 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
              {item.value}
            </p>
          </div>
        ))}
      </div>

      {/* Gold Items Preview */}
      {gold.items && gold.items.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gold-200/50 dark:border-gold-700/30">
          <p className={`text-xs font-medium mb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Gold Items ({gold.items.length})
          </p>
          <div className="flex flex-wrap gap-2">
            {gold.items.map((item, idx) => (
              <span
                key={idx}
                className={`px-2.5 py-1 rounded-full text-xs ${
                  isDark
                    ? 'bg-gold-900/30 text-gold-300 border border-gold-700/30'
                    : 'bg-gold-100 text-gold-700 border border-gold-200'
                }`}
              >
                {item.itemType} - {item.netWeight}g ({item.purity})
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}