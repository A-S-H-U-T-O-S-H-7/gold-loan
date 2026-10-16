'use client';
import { useState } from 'react';

export default function DateFilter({
  onFilterChange,
  isDark = false,
  dateFormat = 'native',
  buttonLabels = { apply: "Apply", clear: "Clear" }
}) {
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [dateError, setDateError] = useState('');
  const today = new Date();
  const currentDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const parseDisplayDate = (value) => {
    if (!value) return '';
    const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value);
    if (!match) return null;
    const [, day, month, year] = match;
    const date = new Date(0);
    date.setFullYear(Number(year), Number(month) - 1, Number(day));
    if (date.getFullYear() !== Number(year) || date.getMonth() !== Number(month) - 1 || date.getDate() !== Number(day)) return null;
    return `${year}-${month}-${day}`;
  };

  const handleApply = () => {
    if (dateFormat === 'native') {
      onFilterChange({ dateRange });
      return;
    }
    const start = parseDisplayDate(dateRange.start);
    const end = parseDisplayDate(dateRange.end);
    if (start === null || end === null) {
      setDateError('Enter dates as dd/mm/yyyy.');
      return;
    }
    if ((start && start > currentDate) || (end && end > currentDate) || (start && end && start > end)) {
      setDateError('Choose a valid date range up to today.');
      return;
    }
    setDateError('');
    onFilterChange({ dateRange: { start, end } });
  };

  const handleClear = () => {
    setDateRange({ start: "", end: "" });
    setDateError('');
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
            type={dateFormat === 'native' ? 'date' : 'text'}
            inputMode={dateFormat === 'native' ? undefined : 'numeric'}
            placeholder={dateFormat === 'native' ? undefined : 'dd/mm/yyyy'}
            maxLength={dateFormat === 'native' ? undefined : 10}
            aria-label="From date"
            value={dateRange.start}
            max={dateFormat === 'native' ? currentDate : undefined}
            onChange={(e) => { setDateError(''); setDateRange(prev => ({ ...prev, start: e.target.value })); }}
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
            type={dateFormat === 'native' ? 'date' : 'text'}
            inputMode={dateFormat === 'native' ? undefined : 'numeric'}
            placeholder={dateFormat === 'native' ? undefined : 'dd/mm/yyyy'}
            maxLength={dateFormat === 'native' ? undefined : 10}
            aria-label="To date"
            value={dateRange.end}
            min={dateFormat === 'native' ? dateRange.start || undefined : undefined}
            max={dateFormat === 'native' ? currentDate : undefined}
            onChange={(e) => { setDateError(''); setDateRange(prev => ({ ...prev, end: e.target.value })); }}
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
      {dateError && <p role="alert" className="mt-2 text-sm text-red-500">{dateError}</p>}
    </div>
  );
}
