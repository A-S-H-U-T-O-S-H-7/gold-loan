'use client';
import { useState } from 'react';

export default function DateFilter({
  onFilterChange,
  isDark = false,
  buttonLabels = { apply: "Apply", clear: "Clear" }
}) {
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const currentDate = new Date().toISOString().split('T')[0];

  const handleApply = () => {
    onFilterChange({ dateRange });
  };

  const handleClear = () => {
    setDateRange({ start: "", end: "" });
    onFilterChange({ dateRange: { start: "", end: "" } });
  };

  const isApplyEnabled = dateRange.start || dateRange.end;

  return (
    <div className={`rounded-xl p-4 mb-6 transition-colors duration-300 ${
      isDark 
        ? 'bg-gray-800/80 border border-gold-700/30' 
        : 'bg-white/80 border border-gold-200 shadow-sm'
    }`}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        <div>
          <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            From Date
          </label>
          <input
            type="date"
            value={dateRange.start}
            max={currentDate}
            onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
            className={`w-full px-4 py-2.5 rounded-lg border-2 font-medium cursor-pointer ${
              isDark
                ? 'bg-gray-700 border-gold-600/50 text-white hover:border-gold-500 focus:border-gold-400'
                : 'bg-white border-gold-300 text-gray-900 hover:border-gold-400 focus:border-gold-500'
            } focus:ring-2 focus:ring-gold-500/20 focus:outline-none`}
          />
        </div>

        <div>
          <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            To Date
          </label>
          <input
            type="date"
            value={dateRange.end}
            min={dateRange.start || undefined}
            max={currentDate}
            onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
            className={`w-full px-4 py-2.5 rounded-lg border-2 font-medium cursor-pointer ${
              isDark
                ? 'bg-gray-700 border-gold-600/50 text-white hover:border-gold-500 focus:border-gold-400'
                : 'bg-white border-gold-300 text-gray-900 hover:border-gold-400 focus:border-gold-500'
            } focus:ring-2 focus:ring-gold-500/20 focus:outline-none`}
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleApply}
            disabled={!isApplyEnabled}
            className={`flex-1 px-6 py-2.5 rounded-lg font-semibold transition-all duration-200 hover:scale-105 disabled:scale-100 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-white shadow-lg hover:shadow-xl disabled:shadow-none ${
              isDark
                ? 'bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500'
                : 'bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700'
            }`}
          >
            {buttonLabels.apply}
          </button>
          <button
            onClick={handleClear}
            disabled={!isApplyEnabled}
            className={`flex-1 px-6 py-2.5 rounded-lg font-medium transition-all duration-200 hover:scale-105 disabled:scale-100 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${
              isDark
                ? 'bg-gray-700 hover:bg-gray-600 text-white border border-gray-600'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-800 border border-gray-300'
            }`}
          >
            {buttonLabels.clear}
          </button>
        </div>
      </div>
    </div>
  );
}