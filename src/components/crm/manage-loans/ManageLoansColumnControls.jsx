'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight, Grid, Menu, X } from 'lucide-react';
import { COLUMN_GROUPS } from '@/components/crm/manage-loans/manageLoanColumns';

// Full class strings so Tailwind keeps them in the build.
const expandedTones = {
  emerald: { light: 'border border-emerald-300 bg-emerald-100 text-emerald-700 hover:bg-emerald-200', dark: 'border border-emerald-500/30 bg-emerald-700/30 text-emerald-300 hover:bg-emerald-700/40' },
  amber: { light: 'border border-amber-300 bg-amber-100 text-amber-700 hover:bg-amber-200', dark: 'border border-amber-500/30 bg-amber-700/30 text-amber-300 hover:bg-amber-700/40' },
  purple: { light: 'border border-purple-300 bg-purple-100 text-purple-700 hover:bg-purple-200', dark: 'border border-purple-500/30 bg-purple-700/30 text-purple-300 hover:bg-purple-700/40' },
  blue: { light: 'border border-blue-300 bg-blue-100 text-blue-700 hover:bg-blue-200', dark: 'border border-blue-500/30 bg-blue-700/30 text-blue-300 hover:bg-blue-700/40' },
  rose: { light: 'border border-rose-300 bg-rose-100 text-rose-700 hover:bg-rose-200', dark: 'border border-rose-500/30 bg-rose-700/30 text-rose-300 hover:bg-rose-700/40' },
};

export default function ManageLoansColumnControls({ expandedGroups, onToggle, onExpandAll, onCollapseAll, isDark }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const groupButtonClass = (group) => {
    if (expandedGroups.includes(group.key)) return expandedTones[group.tone][isDark ? 'dark' : 'light'];
    return isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-white text-gray-700 hover:bg-gold-50 border border-gold-200';
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-expanded={mobileOpen}
        className={`mb-4 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg px-4 py-2.5 font-medium md:hidden ${
          isDark ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'border border-gold-200 bg-white text-gray-700 hover:bg-gold-50'
        }`}
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        Column Controls
      </button>

      <div className={`${mobileOpen ? 'flex' : 'hidden'} mb-4 flex-col gap-3 md:flex md:flex-row md:items-center md:justify-between`}>
        <div className="flex flex-wrap items-center gap-2">
          <div className={`flex items-center gap-2 rounded-lg px-3 py-2 ${isDark ? 'bg-gray-800/50' : 'bg-gold-100/60'}`}>
            <Grid className={`h-4 w-4 ${isDark ? 'text-gold-400' : 'text-gold-700'}`} />
            <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Column Groups:</span>
          </div>

          {COLUMN_GROUPS.map((group) => {
            const Icon = group.icon;
            const isExpanded = expandedGroups.includes(group.key);
            return (
              <button
                key={group.key}
                type="button"
                onClick={() => onToggle(group.key)}
                aria-pressed={isExpanded}
                className={`flex cursor-pointer items-center gap-2 rounded-md px-3 py-1.5 text-sm transition-all duration-200 ${groupButtonClass(group)}`}
              >
                <Icon className="h-3.5 w-3.5" />
                {group.label}
                {isExpanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
              </button>
            );
          })}
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={onExpandAll}
            className="flex-1 cursor-pointer rounded-md bg-gold-600 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-gold-700 md:flex-none md:py-1.5"
          >
            Expand All
          </button>
          <button
            type="button"
            onClick={onCollapseAll}
            className={`flex-1 cursor-pointer rounded-md px-3 py-2 text-xs font-medium transition-colors md:flex-none md:py-1.5 ${
              isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'border border-gold-200 bg-white text-gray-700 hover:bg-gold-50'
            }`}
          >
            Collapse All
          </button>
        </div>
      </div>
    </>
  );
}
