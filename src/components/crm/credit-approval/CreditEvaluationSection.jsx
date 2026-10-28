'use client';

import Link from 'next/link';
import { Scale } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/format';
import DetailField from '@/components/crm/ui/DetailField';
import ProtectedImage from '@/components/crm/credit-approval/ProtectedImage';
import { formatDateTime, humanize } from '@/components/crm/credit-approval/creditReviewLabels';
import {
  cardClass,
  dividerClass,
  headingClass,
  linkButtonClass,
  mutedClass,
} from '@/components/crm/ui/detailStyles';

const grams = (value) => (value != null ? `${value} g` : '—');

const itemColumns = ['#', 'Item', 'Qty', 'Purity', 'Gross', 'Deduction', 'Net', 'Rate / g', 'Value', 'Photos'];

export default function CreditEvaluationSection({ applicationId, evaluation, isDark }) {
  const items = evaluation?.items || [];
  const cell = `border-b px-3 py-2.5 text-center text-sm ${isDark ? 'border-gray-700' : 'border-gold-100'}`;

  return (
    <section className={cardClass(isDark)}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className={headingClass(isDark)}><Scale className="h-5 w-5" />Gold Evaluation</h2>
        <Link href={`/crm/gold-evaluation/${applicationId}`} className={linkButtonClass(isDark)}>View Evaluation</Link>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <DetailField label="Evaluation Status" value={humanize(evaluation?.status)} isDark={isDark} />
        <DetailField label="Finalised On" value={formatDateTime(evaluation?.finalizedAt)} isDark={isDark} />
        <DetailField label="Loan to Value" value={evaluation?.ltvPercentage != null ? `${evaluation.ltvPercentage}%` : '—'} isDark={isDark} />
        <DetailField label="Gold Valuation" value={formatCurrency(evaluation?.totalValuation || 0)} isDark={isDark} />
        <DetailField label="Eligible Loan Amount" value={formatCurrency(evaluation?.eligibleAmount || 0)} isDark={isDark} highlight />
      </div>

      <div className={`mt-5 border-t pt-4 ${dividerClass(isDark)}`}>
        <h3 className={`mb-3 text-sm font-semibold ${mutedClass(isDark)}`}>Gold Items ({items.length})</h3>

        {items.length === 0 ? (
          <p className={`text-sm ${mutedClass(isDark)}`}>No gold items available.</p>
        ) : (
          <div className={`overflow-x-auto rounded-lg border ${isDark ? 'border-gray-700' : 'border-gold-200'}`}>
            <table className="w-full min-w-[860px]">
              <thead className={isDark ? 'bg-gray-900/60 text-gray-300' : 'bg-gold-50 text-gray-700'}>
                <tr>
                  {itemColumns.map((column) => (
                    <th key={column} className="px-3 py-2.5 text-center text-xs font-bold uppercase tracking-wide">{column}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={item.id ?? index}>
                    <td className={cell}>{index + 1}</td>
                    <td className={`${cell} font-medium`}>{item.itemType || 'Gold Item'}</td>
                    <td className={cell}>{item.quantity ?? '—'}</td>
                    <td className={cell}>{item.purity || '—'}</td>
                    <td className={cell}>{grams(item.grossWeight)}</td>
                    <td className={cell}>{grams(item.deductionWeight)}</td>
                    <td className={`${cell} font-semibold`}>{grams(item.netWeight)}</td>
                    <td className={cell}>{formatCurrency(item.rateUsed || 0)}</td>
                    <td className={`${cell} font-semibold`}>{formatCurrency(item.valuation || 0)}</td>
                    <td className={cell}>
                      {item.images?.length > 0 ? (
                        <div className="flex flex-wrap justify-center gap-1.5">
                          {item.images.map((image) => (
                            <ProtectedImage
                              key={image.id}
                              path={`/crm/applications/evaluation/image/${image.id}`}
                              alt={`${item.itemType || 'Gold item'} photo`}
                            />
                          ))}
                        </div>
                      ) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
