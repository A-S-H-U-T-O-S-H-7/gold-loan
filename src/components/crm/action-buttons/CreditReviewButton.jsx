'use client';
import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';

export default function CreditReviewButton({ applicationId, isDark = false }) {
  if (!applicationId) return null;

  return (
    <Link
      href={`/crm/credit-approval/${applicationId}`}
      className={`inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded border px-3 py-1.5 text-xs font-semibold transition-all duration-200 hover:scale-105 cursor-pointer ${
        isDark
          ? 'border-emerald-700 bg-emerald-900/40 text-emerald-300 hover:bg-emerald-800'
          : 'border-emerald-300 bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
      }`}
    >
      <ShieldCheck className="h-3.5 w-3.5" />
      Review
    </Link>
  );
}
