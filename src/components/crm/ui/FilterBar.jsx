'use client';

import { Download, Search } from 'lucide-react';

export default function FilterBar({
  search,
  onSearch,
  searchPlaceholder = 'Search by name, mobile or App ID',
  filters = [],
  onExport,
}) {
  return (
    <div className="flex flex-col lg:flex-row gap-3 mb-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted" />
        <input
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder={searchPlaceholder}
          className="w-full h-11 pl-10 pr-4 rounded-xl border border-border bg-surface text-foreground placeholder:text-foreground-muted outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
        />
      </div>
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <select
            key={filter.key}
            value={filter.value}
            onChange={(e) => filter.onChange(e.target.value)}
            className="h-11 min-w-[140px] px-3 rounded-xl border border-border bg-surface text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/40"
          >
            {filter.options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        ))}
        {onExport && (
          <button
            type="button"
            onClick={onExport}
            className="h-11 px-4 rounded-xl border border-border bg-surface text-sm font-medium text-foreground hover:bg-surface-hover inline-flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        )}
      </div>
    </div>
  );
}
