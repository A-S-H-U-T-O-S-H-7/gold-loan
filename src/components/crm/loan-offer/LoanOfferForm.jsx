'use client';
import { Field, inputClass } from '@/components/crm/ui/FormControls';
import { REPAYMENT_TYPES, TENURES } from '@/lib/constants/crm';

export default function LoanOfferForm({
  offer,
  setOffer,
  isDark = false,
  eligibleAmount,
  computed
}) {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      {/* Loan Amount */}
      <Field label="Loan amount (≤ eligible)">
        <input
          type="number"
          className={inputClass}
          value={offer.amount}
          onChange={(e) => setOffer({ ...offer, amount: e.target.value })}
          placeholder="Enter loan amount"
        />
        <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          Max eligible: {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(eligibleAmount)}
        </p>
      </Field>

      {/* Interest Rate */}
      <Field label="Interest rate (% p.a.)">
        <input
          type="number"
          step="0.5"
          className={inputClass}
          value={offer.rate}
          onChange={(e) => setOffer({ ...offer, rate: e.target.value })}
          placeholder="Enter interest rate"
        />
      </Field>

      {/* Tenure */}
      <Field label="Tenure">
        <select
          className={inputClass}
          value={offer.tenure}
          onChange={(e) => setOffer({ ...offer, tenure: Number(e.target.value) })}
        >
          {TENURES.map((t) => (
            <option key={t} value={t}>{t} months</option>
          ))}
        </select>
      </Field>

      {/* Processing Fee */}
      <Field label="Processing fee (%)">
        <input
          type="number"
          step="0.1"
          className={inputClass}
          value={offer.processingFee}
          onChange={(e) => setOffer({ ...offer, processingFee: e.target.value })}
          placeholder="Enter processing fee"
        />
      </Field>

      {/* Repayment Type */}
      <Field label="Repayment type">
        <select
          className={inputClass}
          value={offer.repaymentType}
          onChange={(e) => setOffer({ ...offer, repaymentType: e.target.value })}
        >
          {REPAYMENT_TYPES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </Field>

      {/* Note */}
      <Field label="Acceptance / decline note">
        <textarea
          className={`${inputClass} h-20 py-2 resize-none`}
          value={offer.note}
          onChange={(e) => setOffer({ ...offer, note: e.target.value })}
          placeholder="Add a note..."
        />
      </Field>
    </div>
  );
}