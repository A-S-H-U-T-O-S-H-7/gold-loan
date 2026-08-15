'use client';

const TABS = ['All', 'Active', 'Overdue', 'Closed'];

export default function ManageLoansTabs({ activeTab, onTabChange, counts, isDark = false }) {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {TABS.map((tab) => (
        <button
          key={tab}
          type="button"
          onClick={() => onTabChange(tab)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
            activeTab === tab
              ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-white shadow-md'
              : isDark
                ? 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-200'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800'
          }`}
        >
          {tab}
          {counts && counts[tab] !== undefined && (
            <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-xs ${
              activeTab === tab
                ? 'bg-white/20 text-white'
                : isDark
                  ? 'bg-gray-600 text-gray-300'
                  : 'bg-gray-200 text-gray-600'
            }`}>
              {counts[tab]}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}