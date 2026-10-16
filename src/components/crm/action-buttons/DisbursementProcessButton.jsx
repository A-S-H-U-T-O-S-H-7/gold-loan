'use client';
import { FileCheck } from 'lucide-react';

export default function DisbursementProcessButton({ onClick, isDark = false, reviewed = false }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold transition-all duration-200 hover:scale-105 cursor-pointer ${
        reviewed
          ? isDark ? 'border-emerald-700 bg-emerald-900/40 text-emerald-300 hover:bg-emerald-800' : 'border-emerald-300 bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
          : isDark ? 'border-teal-700 bg-teal-900/40 text-teal-300 hover:bg-teal-800' : 'border-teal-300 bg-teal-100 text-teal-700 hover:bg-teal-200'
      } border`}
    >
      <FileCheck className="w-3.5 h-3.5" />
      {reviewed ? 'Reviewed' : 'Review'}
    </button>
  );
}
