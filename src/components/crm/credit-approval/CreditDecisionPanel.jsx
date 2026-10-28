'use client';

import { BadgeCheck } from 'lucide-react';
import { formatDateTime, reviewStatusLabel } from '@/components/crm/credit-approval/creditReviewLabels';
import { cardClass, dividerClass, headingClass, mutedClass } from '@/components/crm/ui/detailStyles';

const buttonBase = 'inline-flex min-w-0 cursor-pointer items-center justify-center rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50';

export default function CreditDecisionPanel({
  review,
  reviewValid,
  remark,
  onRemarkChange,
  canReview,
  decided,
  allChecked,
  busy,
  onSaveDraft,
  onDecide,
  isDark,
}) {
  const inputDisabled = decided || busy || !canReview;
  const actionsDisabled = busy || !canReview;

  return (
    <section className={cardClass(isDark)}>
      <h2 className={`${headingClass(isDark)} mb-4`}><BadgeCheck className="h-5 w-5" />Decision</h2>

      <div className={`flex items-center justify-between gap-3 rounded-lg border p-3 ${isDark ? 'border-gold-700/40 bg-gray-900/30' : 'border-gold-200 bg-gold-50/40'}`}>
        <span className={`text-sm ${mutedClass(isDark)}`}>Current review</span>
        <strong className="text-sm">{reviewStatusLabel(review?.decision, reviewValid)}</strong>
      </div>
      {review && !reviewValid && (
        <p className="mt-2 text-xs text-amber-500">The KYC, evaluation or offer changed after this review. Start a fresh review.</p>
      )}

      {!canReview && (
        <p className="mt-3 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-500">
          Verify KYC, finalise the gold evaluation and accept the current offer before reviewing.
        </p>
      )}

      <label htmlFor="credit-review-remark" className={`mt-4 block text-sm font-medium ${mutedClass(isDark)}`}>
        Remark / correction note
      </label>
      <textarea
        id="credit-review-remark"
        rows={4}
        value={remark}
        onChange={(event) => onRemarkChange(event.target.value)}
        disabled={inputDisabled}
        placeholder="Required for Rejected or Needs Review"
        className={`mt-2 w-full rounded border-2 p-3 text-sm outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 disabled:cursor-not-allowed disabled:opacity-60 ${
          isDark ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-gray-50 text-gray-900'
        }`}
      />

      {decided ? (
        <p className={`mt-3 text-sm ${mutedClass(isDark)}`}>
          Decided on {formatDateTime(review.decidedAt)}. Move the application using the status in the Credit Approval table.
        </p>
      ) : (
        <div className={`mt-4 space-y-3 border-t pt-4 ${dividerClass(isDark)}`}>
          <button
            type="button"
            onClick={onSaveDraft}
            disabled={actionsDisabled}
            className={`${buttonBase} w-full border ${isDark ? 'border-gold-600 text-gold-300 hover:bg-gold-500/10' : 'border-gold-300 bg-white text-gold-700 hover:bg-gold-50'}`}
          >
            Save Review Draft
          </button>

          <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-1 2xl:grid-cols-3">
            <button type="button" onClick={() => onDecide('NEEDS_REVIEW')} disabled={actionsDisabled} className={`${buttonBase} bg-orange-500 text-white hover:bg-orange-600`}>
              Needs Review
            </button>
            <button type="button" onClick={() => onDecide('REJECTED')} disabled={actionsDisabled} className={`${buttonBase} bg-red-600 text-white hover:bg-red-700`}>
              Reject
            </button>
            <button type="button" onClick={() => onDecide('APPROVED')} disabled={actionsDisabled || !allChecked} className={`${buttonBase} bg-emerald-600 text-white hover:bg-emerald-700`}>
              Approve
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
