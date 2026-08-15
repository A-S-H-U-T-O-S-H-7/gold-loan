'use client';
import Link from 'next/link';
import { Gem } from 'lucide-react';

export default function GoldEvaluateButton({ applicationId, isDark = false }) {
  if (!applicationId) return null;

  return (
    <Link
      href={`/crm/gold-evaluation/${applicationId}`}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold transition-all duration-200 hover:scale-105 cursor-pointer ${
        isDark
          ? 'border-rose-700 bg-rose-900/40 text-rose-300 hover:bg-rose-800'
          : 'border-rose-300 bg-rose-100 text-rose-700 hover:bg-rose-200'
      } border`}
    >
      <Gem className="w-3.5 h-3.5" />
      Evaluate
    </Link>
  );
}