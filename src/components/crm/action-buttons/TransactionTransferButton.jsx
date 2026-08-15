'use client';
import { CreditCard } from 'lucide-react';

export default function TransactionTransferButton({ onClick, isDark = false, status }) {
  const isTransferred = status === 'TRANSFERRED';

  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold transition-all duration-200 hover:scale-105 cursor-pointer ${
        isTransferred
          ? isDark
            ? 'border-gray-600 bg-gray-700 text-gray-300 hover:bg-gray-600'
            : 'border-gray-300 bg-gray-100 text-gray-600 hover:bg-gray-200'
          : isDark
            ? 'border-blue-700 bg-blue-900/40 text-blue-300 hover:bg-blue-800'
            : 'border-blue-300 bg-blue-100 text-blue-700 hover:bg-blue-200'
      } border`}
    >
      <CreditCard className="w-3.5 h-3.5" />
      {isTransferred ? 'View' : 'Transfer'}
    </button>
  );
}