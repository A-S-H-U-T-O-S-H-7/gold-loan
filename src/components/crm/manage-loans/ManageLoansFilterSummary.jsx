'use client';

const displayDate = (value) => new Date(value).toLocaleDateString('en-GB');

// Shows which filters are applied and lets the user clear them in one click.
export default function ManageLoansFilterSummary({ search, dates, branchActive, shownCount, totalCount, onClear, isDark }) {
  const chips = [
    search && `Search: ${search}`,
    dates.start && `From: ${displayDate(dates.start)}`,
    dates.end && `To: ${displayDate(dates.end)}`,
    branchActive && 'Branch filter',
  ].filter(Boolean);

  if (chips.length === 0) return null;

  return (
    <div className={`mb-4 rounded-lg border p-4 ${isDark ? 'border-gold-600/30 bg-gray-800/50' : 'border-gold-200 bg-gold-50/60'}`}>
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div className="flex flex-wrap items-center gap-2">
          <span className={`text-sm font-medium ${isDark ? 'text-gold-400' : 'text-gold-700'}`}>Active Filters:</span>
          {chips.map((chip) => (
            <span key={chip} className={`rounded-full px-3 py-1 text-sm ${isDark ? 'bg-gold-900/30 text-gold-300' : 'bg-gold-100 text-gold-800'}`}>
              {chip}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Showing {shownCount} of {totalCount}
          </span>
          <button
            type="button"
            onClick={onClear}
            className={`cursor-pointer rounded-lg px-4 py-2 text-sm transition-colors ${
              isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'border border-gold-200 bg-white text-gray-700 hover:bg-gold-50'
            }`}
          >
            Clear All
          </button>
        </div>
      </div>
    </div>
  );
}
