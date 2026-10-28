// Shared card, heading and tile styles for CRM detail pages and modals.

export function cardClass(isDark) {
  return `min-w-0 rounded-xl border-2 p-5 shadow-lg ${
    isDark
      ? 'border-gold-700/50 bg-gray-800 text-gray-100 shadow-gold-900/20'
      : 'border-gold-200 bg-white text-gray-900 shadow-gold-500/10'
  }`;
}

export function headingClass(isDark) {
  return `flex items-center gap-2 text-lg font-semibold ${isDark ? 'text-gold-400' : 'text-gold-600'}`;
}

export function mutedClass(isDark) {
  return isDark ? 'text-gray-400' : 'text-gray-600';
}

export function tileClass(isDark) {
  return `rounded-lg border ${isDark ? 'border-gold-700/40 bg-gray-900/30' : 'border-gold-200 bg-gold-50/40'}`;
}

export function dividerClass(isDark) {
  return isDark ? 'border-gray-700' : 'border-gold-200';
}

export function linkButtonClass(isDark) {
  return `inline-flex cursor-pointer items-center rounded-lg border px-3 py-2 text-sm font-semibold transition-colors ${
    isDark
      ? 'border-gold-600/40 bg-gold-600/10 text-gold-300 hover:bg-gold-600/20'
      : 'border-gold-200 bg-gold-50 text-gold-700 hover:bg-gold-100'
  }`;
}
