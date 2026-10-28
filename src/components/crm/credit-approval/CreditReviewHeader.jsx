'use client';

import { ArrowLeft } from 'lucide-react';
import StatusBadge from '@/components/crm/ui/StatusBadge';

export default function CreditReviewHeader({ application, onBack, isDark = false }) {
  return (
    <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="flex min-w-0 items-center gap-4">
        <button
          type="button"
          onClick={onBack}
          aria-label="Back to previous page"
          className={`shrink-0 cursor-pointer rounded-xl border p-2 transition-all duration-200 hover:scale-105 ${
            isDark ? 'border-gold-600/30 bg-gray-800/50 hover:bg-gray-800' : 'border-gold-200 bg-gold-50/50 hover:bg-gold-50'
          }`}
        >
          <ArrowLeft className={`h-4 w-4 ${isDark ? 'text-gold-400' : 'text-gold-600'}`} />
        </button>
        <h1 className={`min-w-0 text-xl font-bold md:text-2xl ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
          Credit Review - {application?.name || application?.applicationNo}
        </h1>
      </div>

      <div className={`flex flex-wrap items-center gap-3 rounded-xl border px-4 py-2 ${isDark ? 'border-gold-700/30 bg-gray-800/50' : 'border-gold-200 bg-white'}`}>
        <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
          Application #{application?.applicationNo}
        </span>
        <StatusBadge status={application?.status} />
      </div>
    </header>
  );
}
