'use client';

import { History } from 'lucide-react';
import { formatDateTime, reviewLabels } from '@/components/crm/credit-approval/creditReviewLabels';
import { cardClass, headingClass, mutedClass, tileClass } from '@/components/crm/ui/detailStyles';

export default function CreditReviewHistory({ reviews, isDark }) {
  if (!reviews?.length) return null;

  return (
    <section className={cardClass(isDark)}>
      <h2 className={`${headingClass(isDark)} mb-4`}><History className="h-5 w-5" />Earlier Reviews</h2>
      <ol className="space-y-2">
        {reviews.map((review) => (
          <li key={review.id} className={`p-3 text-sm ${tileClass(isDark)}`}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-semibold">{reviewLabels[review.decision] || review.decision}</span>
              <span className={`text-xs ${mutedClass(isDark)}`}>{formatDateTime(review.decidedAt)}</span>
            </div>
            {review.remark && <p className="mt-2 break-words">{review.remark}</p>}
          </li>
        ))}
      </ol>
    </section>
  );
}
