'use client';

const TABS = ['All', 'Active', 'Overdue', 'Closed'];

export default function ManageLoansTabs({ activeTab, onTabChange, isDark = false }) {
  return (
    <div role="tablist" aria-label="Loan status" className="mb-5 flex gap-2 overflow-x-auto pb-1">
      {TABS.map((tab) => {
        const isActive = activeTab === tab;
        return (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onTabChange(tab)}
            className={`shrink-0 cursor-pointer rounded-lg border px-4 py-2 text-sm font-semibold transition-colors ${
              isActive
                ? 'border-gold-600 bg-gold-600 text-white'
                : isDark
                  ? 'border-gold-700/50 bg-gray-800 text-gray-300 hover:bg-gray-700'
                  : 'border-gold-200 bg-white text-gray-700 hover:bg-gold-50'
            }`}
          >
            {tab}
          </button>
        );
      })}
    </div>
  );
}
