'use client';
import { FileText } from 'lucide-react';

export default function LoanOfferButton({ onClick, isDark = false }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold transition-all duration-200 hover:scale-105 cursor-pointer ${
        isDark
          ? 'border-indigo-700 bg-indigo-900/40 text-indigo-300 hover:bg-indigo-800'
          : 'border-indigo-300 bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
      } border`}
    >
      <FileText className="w-3.5 h-3.5" />
      Offer
    </button>
  );
}