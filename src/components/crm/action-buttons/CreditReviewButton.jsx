'use client';
import { ShieldCheck } from 'lucide-react';

export default function CreditReviewButton({ onClick, isDark = false }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold transition-all duration-200 hover:scale-105 cursor-pointer ${
        isDark
          ? 'border-emerald-700 bg-emerald-900/40 text-emerald-300 hover:bg-emerald-800'
          : 'border-emerald-300 bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
      } border`}
    >
      <ShieldCheck className="w-3.5 h-3.5" />
      Review
    </button>
  );
}