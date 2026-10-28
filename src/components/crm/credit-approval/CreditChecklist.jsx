'use client';

import { CheckCircle, ClipboardCheck } from 'lucide-react';
import { cardClass, headingClass, mutedClass } from '@/components/crm/ui/detailStyles';

export const CHECKLIST_ITEMS = [
  { key: 'kycChecked', label: 'KYC Checked' },
  { key: 'goldEvaluationChecked', label: 'Gold Assessment Checked' },
  { key: 'eligibilityChecked', label: 'Eligibility Checked' },
  { key: 'offerChecked', label: 'Offer Checked' },
  { key: 'bankDetailsChecked', label: 'Payout Details Checked' },
];

export default function CreditChecklist({ checks, setChecks, isDark = false, disabled = false }) {
  const doneCount = CHECKLIST_ITEMS.filter((item) => checks[item.key]).length;
  const allChecked = doneCount === CHECKLIST_ITEMS.length;

  const toggle = (key, value) => setChecks({ ...checks, [key]: value });

  return (
    <section className={cardClass(isDark)}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className={headingClass(isDark)}><ClipboardCheck className="h-5 w-5" />Verification Checklist</h2>
        <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${
          allChecked
            ? isDark ? 'border-emerald-700 bg-emerald-900/30 text-emerald-300' : 'border-emerald-300 bg-emerald-50 text-emerald-700'
            : isDark ? 'border-amber-700 bg-amber-900/30 text-amber-300' : 'border-amber-300 bg-amber-50 text-amber-700'
        }`}>
          {allChecked ? 'Ready for approval' : `${doneCount} of ${CHECKLIST_ITEMS.length} checked`}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {CHECKLIST_ITEMS.map((item) => {
          const isChecked = Boolean(checks[item.key]);
          const stateClass = isChecked
            ? isDark ? 'border-emerald-600/50 bg-emerald-900/20' : 'border-emerald-300 bg-emerald-50'
            : isDark ? 'border-gray-600 hover:border-gold-600/50' : 'border-gray-200 hover:border-gold-300';

          return (
            <label
              key={item.key}
              className={`flex items-center gap-3 rounded-xl border-2 p-3 transition-colors ${stateClass} ${disabled ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}`}
            >
              <input
                type="checkbox"
                checked={isChecked}
                disabled={disabled}
                onChange={(event) => toggle(item.key, event.target.checked)}
                className="h-4 w-4 cursor-pointer accent-emerald-500 disabled:cursor-not-allowed"
              />
              <span className="text-sm font-medium">{item.label}</span>
              {isChecked && <CheckCircle className="ml-auto h-4 w-4 shrink-0 text-emerald-500" />}
            </label>
          );
        })}
      </div>

      <p className={`mt-4 text-xs ${mutedClass(isDark)}`}>All items must be checked before the review can be approved.</p>
    </section>
  );
}
