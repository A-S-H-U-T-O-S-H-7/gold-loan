'use client';
import { formatCurrency } from '@/lib/utils/format';

export default function ManageLoansSummary({ application, isDark = false }) {
  const customer = application?.customer || {};
  const loan = application?.loan || {};
  const gold = application?.gold || {};
  const timeline = application?.timeline || {};

  const items = [
    { label: 'Customer Name', value: customer.name || '—' },
    { label: 'Mobile', value: customer.mobile || '—' },
    { label: 'Email', value: customer.email || '—' },
    { label: 'App ID', value: application?.id || '—' },
    { label: 'Loan Amount', value: formatCurrency(loan.approvedAmount || loan.amount || 0) },
    { label: 'Interest Rate', value: loan.rate ? `${loan.rate}%` : '—' },
    { label: 'Tenure', value: loan.tenure ? `${loan.tenure} months` : '—' },
    { label: 'Repayment Type', value: loan.repaymentType || '—' },
    { label: 'Gold Weight', value: gold.netWeight ? `${gold.netWeight}g` : '—' },
    { label: 'Gold Purity', value: gold.purity || '—' },
    { label: 'Locker ID', value: application?.lockerId || '—' },
  ];

  return (
    <div className={`rounded-xl border-2 p-4 ${
      isDark ? 'border-gold-700/30 bg-gray-800/50' : 'border-gold-200 bg-gold-50/30'
    }`}>
      <h4 className={`text-sm font-semibold mb-3 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
        Loan Summary
      </h4>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {items.map((item, index) => (
          <div
            key={index}
            className={`p-2 rounded-lg ${
              isDark ? 'bg-gray-700/50' : 'bg-white/50'
            }`}
          >
            <p className={`text-[10px] uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              {item.label}
            </p>
            <p className={`text-sm font-medium mt-0.5 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}