'use client';

import { Wallet } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/format';
import { humanize } from '@/components/crm/credit-approval/creditReviewLabels';
import { cardClass, dividerClass, headingClass, mutedClass } from '@/components/crm/ui/detailStyles';

export default function CreditSummary({ evaluation, offer, isDark = false }) {
  const rows = [
    { label: 'Gold Value', value: formatCurrency(evaluation?.totalValuation || 0) },
    { label: 'Eligible Amount', value: formatCurrency(evaluation?.eligibleAmount || 0) },
    { label: 'Offered Amount', value: formatCurrency(offer?.offeredAmount || 0) },
    { label: 'Interest Rate', value: offer?.interestRate != null ? `${offer.interestRate}% ${offer.interestRatePeriod?.toLowerCase() || ''}` : '—' },
    { label: 'Tenure', value: offer?.tenureValue != null ? `${offer.tenureValue} ${offer.tenureUnit?.toLowerCase() || ''}` : '—' },
    { label: 'Repayment', value: humanize(offer?.repaymentMode) },
  ];

  return (
    <section className={cardClass(isDark)}>
      <h2 className={`${headingClass(isDark)} mb-3`}><Wallet className="h-5 w-5" />Loan Summary</h2>

      <dl>
        {rows.map((row) => (
          <div key={row.label} className={`flex items-center justify-between gap-3 border-b py-2.5 last:border-b-0 ${dividerClass(isDark)}`}>
            <dt className={`text-sm ${mutedClass(isDark)}`}>{row.label}</dt>
            <dd className="text-right text-sm font-semibold">{row.value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-3 rounded-lg bg-gold-600 p-3 text-white">
        <p className="text-xs text-gold-50">Net Payout</p>
        <p className="mt-1 text-lg font-bold">{formatCurrency(offer?.netDisbursementAmount || 0)}</p>
      </div>
    </section>
  );
}
