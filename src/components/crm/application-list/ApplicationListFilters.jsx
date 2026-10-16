'use client';

import SearchBar from '@/components/crm/ui/SearchBar';
import DateFilter from '@/components/crm/ui/DateFilter';

export default function ApplicationListFilters({
  list,
  isDark,
  branchName,
  searchOptions = [{ value: 'all', label: 'All fields' }],
  searchPlaceholder = 'Search application no., name, mobile or email...',
  matchPendingStyle = false,
}) {
  return <>
    <DateFilter onFilterChange={(value) => list.setDates({ start: value.dateRange?.start || '', end: value.dateRange?.end || '' })} isDark={isDark} dateFormat={matchPendingStyle ? 'dd/mm/yyyy' : 'native'} />
    <div className="grid min-w-0 grid-cols-1 gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(16rem,1fr)]">
      <div className="min-w-0">
        <SearchBar searchOptions={searchOptions}
          onSearch={(value) => list.setSearch(value.term || '', value.field || '')}
          placeholder={searchPlaceholder} buttonText="Search" isDark={isDark} />
      </div>
      <div className={`min-w-0 rounded-xl p-3 mb-6 border ${isDark ? 'bg-gray-800 border-gold-700/30' : 'bg-white border-gold-200 shadow-sm'}`}>
        {!matchPendingStyle && <label htmlFor="application-list-branch" className="block text-sm font-medium mb-1.5">Branch</label>}
        <select id="application-list-branch" value={list.branchId} onChange={(event) => list.setBranchId(event.target.value)}
          aria-label="Filter by branch"
          className={`w-full min-w-0 cursor-pointer px-3 py-2.5 rounded-lg border-2 ${isDark ? 'bg-gray-700 border-gold-600/50 text-white' : 'bg-white border-gold-300 text-gray-900'}`}>
          <option value="">{matchPendingStyle ? 'All branch' : 'All accessible applications'}</option>
          {branchName && <option value={branchName.id}>{branchName.name}</option>}
          <option value="unassigned">Unassigned website applications</option>
        </select>
      </div>
    </div>
  </>;
}
