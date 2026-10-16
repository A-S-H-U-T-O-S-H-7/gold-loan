'use client';
import Link from 'next/link';
import { Gem } from 'lucide-react';

export default function GoldEvaluateButton({ applicationId, isDark = false, evaluated = false }) {
  if (!applicationId) return null;

  return (
    <Link
      href={`/crm/gold-evaluation/${applicationId}`}
      className={`inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap px-3 py-1.5 rounded text-xs font-semibold transition-all duration-200 hover:scale-105 cursor-pointer ${
        evaluated
          ? isDark
            ? 'border-purple-700 bg-purple-900/40 text-purple-300 hover:bg-purple-800/60'
            : 'border-purple-300 bg-purple-50 text-purple-700 hover:bg-purple-100'
          : isDark
            ? 'border-gold-700 bg-gold-900/40 text-gold-300 hover:bg-gold-800'
            : 'border-gold-300 bg-gold-100 text-gold-700 hover:bg-gold-200'
      } border`}
    >
      <Gem className="w-3.5 h-3.5" />
      {evaluated ? 'View Evaluation' : 'Evaluate'}
    </Link>
  );
}
