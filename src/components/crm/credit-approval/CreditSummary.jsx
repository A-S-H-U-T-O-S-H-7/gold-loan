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
    { label: 'Interest Rate', value: `${loan.rate || 0}% ${loan.ratePeriod?.toLowerCase() || ''}` },
    { label: 'Tenure', value: `${loan.tenure || 0} ${loan.tenureUnit?.toLowerCase() || 'months'}` },
    { label: 'Repayment Type', value: loan.repaymentType || '—' },
  ];

  return (
    <div className={`min-w-0 rounded-xl border-2 p-5 shadow-lg ${
      isDark ? 'border-gold-700/50 bg-gray-800 shadow-gold-900/20' : 'border-gold-200 bg-white shadow-gold-500/10'
    }`}>
      <h3 className={`mb-4 text-lg font-semibold ${isDark ? 'text-gold-400' : 'text-gold-600'}`}>
        Loan Summary
      </h3>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 2xl:grid-cols-2">
        {items.map((item, index) => (
          <div
            key={index}
            className={`min-w-0 rounded-lg border p-3 ${
              isDark ? 'border-gold-700/40 bg-gray-900/30' : 'border-gold-200 bg-gold-50/40'
            }`}
          >
            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {item.label}
            </p>
            <p className={`mt-1 break-words text-sm font-semibold ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
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
