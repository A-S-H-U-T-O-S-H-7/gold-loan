'use client';
import { RotateCcw } from 'lucide-react';

export default function RestoreApplicationButton({ onClick, isDark = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex shrink-0 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded border px-3 py-1.5 text-xs font-semibold transition-all duration-200 hover:scale-105 ${
        isDark
          ? 'border-emerald-700 bg-emerald-900/40 text-emerald-300 hover:bg-emerald-800'
          : 'border-emerald-300 bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
      }`}
    >
      <RotateCcw className="h-3.5 w-3.5" />
      Re-store
    </button>
  );
}
