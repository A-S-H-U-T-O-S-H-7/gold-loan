'use client';

import Link from 'next/link';
import { Banknote, CircleDollarSign } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/format';
import DetailField from '@/components/crm/ui/DetailField';
import { formatDateTime, humanize } from '@/components/crm/credit-approval/creditReviewLabels';
import {
  cardClass,
  dividerClass,
  headingClass,
  linkButtonClass,
  mutedClass,
  tileClass,
} from '@/components/crm/ui/detailStyles';

export default function CreditOfferSection({ applicationId, offer, isDark }) {
  const interest = offer?.interestRate != null
    ? `${offer.interestRate}% ${offer.interestRatePeriod?.toLowerCase() || ''}`
    : '—';
  const tenure = offer?.tenureValue != null
    ? `${offer.tenureValue} ${offer.tenureUnit?.toLowerCase() || ''}`
    : '—';

  return (
    <section className={cardClass(isDark)}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className={headingClass(isDark)}><CircleDollarSign className="h-5 w-5" />Loan Offer and Acceptance</h2>
        <Link href={`/crm/loan-offer/${applicationId}`} className={linkButtonClass(isDark)}>View Offer</Link>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <DetailField label="Offer Version" value={offer?.version ?? '—'} isDark={isDark} />
        <DetailField label="Decision" value={humanize(offer?.decision)} isDark={isDark} />
        <DetailField label="Principal" value={formatCurrency(offer?.offeredAmount || 0)} isDark={isDark} />
        <DetailField label="Net Payout" value={formatCurrency(offer?.netDisbursementAmount || 0)} isDark={isDark} highlight />
        <DetailField label="Interest Rate" value={interest} isDark={isDark} />
        <DetailField label="Tenure" value={tenure} isDark={isDark} />
        <DetailField label="Repayment Mode" value={humanize(offer?.repaymentMode)} isDark={isDark} />
        <DetailField label="Processing Fee" value={formatCurrency(offer?.processingFeeAmount || 0)} isDark={isDark} />
        <DetailField label="Accepted On" value={formatDateTime(offer?.decisionAt)} isDark={isDark} />
        <DetailField label="Acceptance Method" value={humanize(offer?.acceptanceMethod)} isDark={isDark} />
      </div>

      {offer?.charges?.length > 0 && (
        <div className={`mt-5 border-t pt-4 ${dividerClass(isDark)}`}>
          <h3 className={`mb-3 flex items-center gap-2 text-sm font-semibold ${mutedClass(isDark)}`}>
            <Banknote className="h-4 w-4" />Other Charges
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {offer.charges.map((charge, index) => (
              <div key={charge.id ?? index} className={`flex flex-wrap items-center justify-between gap-2 p-3 text-sm ${tileClass(isDark)}`}>
                <span className="font-medium">{charge.name}</span>
                <span className="font-semibold">{formatCurrency(charge.amount)}</span>
                {charge.deductedUpfront && <span className="w-full text-xs text-amber-500">Deducted upfront</span>}
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
