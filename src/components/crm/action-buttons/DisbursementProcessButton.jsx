'use client';
import { FileCheck } from 'lucide-react';

export default function DisbursementProcessButton({ onClick, isDark = false }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold transition-all duration-200 hover:scale-105 cursor-pointer ${
        isDark
          ? 'border-teal-700 bg-teal-900/40 text-teal-300 hover:bg-teal-800'
          : 'border-teal-300 bg-teal-100 text-teal-700 hover:bg-teal-200'
      } border`}
    >
      <FileCheck className="w-3.5 h-3.5" />
      Process
    </button>
  );
}