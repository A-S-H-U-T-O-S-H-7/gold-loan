'use client';
import { Eye } from 'lucide-react';

export default function ManageLoansViewButton({ onClick, isDark = false }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold transition-all duration-200 hover:scale-105 cursor-pointer ${
        isDark
          ? 'border-gray-600 bg-gray-700 text-gray-300 hover:bg-gray-600'
          : 'border-gray-300 bg-gray-100 text-gray-700 hover:bg-gray-200'
      } border`}
    >
      <Eye className="w-3.5 h-3.5" />
      View
    </button>
  );
}