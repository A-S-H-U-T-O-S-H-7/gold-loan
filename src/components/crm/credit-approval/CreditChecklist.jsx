'use client';
import { CheckCircle, XCircle } from 'lucide-react';

const CHECKS = [
  { key: 'documentsVerified', label: 'Documents Verified' },
  { key: 'goldCorrect', label: 'Gold Valuation Correct' },
  { key: 'ltvWithinLimit', label: 'LTV Within Limit' },
  { key: 'customerEligible', label: 'Customer Eligible' },
];

export default function CreditChecklist({ checks, setChecks, isDark = false }) {
  const allChecked = CHECKS.every((c) => checks[c.key]);

  return (
    <div className={`rounded-xl border-2 p-5 ${
      isDark ? 'bg-gray-800/50 border-gold-700/30' : 'bg-white/50 border-gold-200'
    }`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-sm font-semibold ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
          Verification Checklist
        </h3>
        {allChecked && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
            <CheckCircle className="w-3.5 h-3.5" />
            All Verified
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {CHECKS.map((item) => {
          const isChecked = !!checks[item.key];
          return (
            <label
              key={item.key}
              className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                isChecked
                  ? isDark
                    ? 'border-emerald-600/50 bg-emerald-900/20'
                    : 'border-emerald-300 bg-emerald-50'
                  : isDark
                    ? 'border-gray-600 hover:border-gold-600/30'
                    : 'border-gray-200 hover:border-gold-300'
              }`}
            >
              <input
                type="checkbox"
                checked={isChecked}
                onChange={(e) => setChecks({ ...checks, [item.key]: e.target.checked })}
                className="w-4 h-4 accent-emerald-500 cursor-pointer"
              />
              <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                {item.label}
              </span>
              {isChecked && (
                <CheckCircle className="w-4 h-4 text-emerald-500 ml-auto flex-shrink-0" />
              )}
              {!isChecked && checks[item.key] !== undefined && (
                <XCircle className="w-4 h-4 text-red-500 ml-auto flex-shrink-0" />
              )}
            </label>
          );
        })}
      </div>

      <div className="mt-4 p-3 rounded-lg bg-gold-50/50 dark:bg-gold-900/20 border border-gold-200 dark:border-gold-700/30">
        <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
          Status: {' '}
          {allChecked ? (
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">✅ Ready for Approval</span>
          ) : (
            <span className="font-semibold text-amber-600 dark:text-amber-400">⏳ Pending Verification</span>
          )}
        </p>
      </div>
    </div>
  );
}