'use client';

import { useCallback, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Download, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { useThemeStore } from '@/lib/store/useThemeStore';
import { getLoanAccountDetail, getLoanPayments, getLoanSchedule, getManageApplications } from '@/lib/services/loanAccountService';
import useApplicationList from '@/components/crm/application-list/useApplicationList';
import useStaffBranch from '@/components/crm/application-list/useStaffBranch';
import ApplicationListFilters from '@/components/crm/application-list/ApplicationListFilters';
import ManageLoansTabs from '@/components/crm/manage-loans/ManageLoansTabs';
import ManageLoansFilterSummary from '@/components/crm/manage-loans/ManageLoansFilterSummary';
import ManageLoansColumnControls from '@/components/crm/manage-loans/ManageLoansColumnControls';
import ManageLoansTable from '@/components/crm/manage-loans/ManageLoansTable';
import ManageLoansModal from '@/components/crm/manage-loans/ManageLoansModal';
import { COLUMN_GROUPS, buildColumns, visibleColumnsFor } from '@/components/crm/manage-loans/manageLoanColumns';

const searchOptions = [
  { value: 'all', label: 'All fields' },
  { value: 'application_no', label: 'Application No.' },
  { value: 'loan_no', label: 'Loan No.' },
  { value: 'name', label: 'Name' },
  { value: 'mobile', label: 'Mobile' },
];

const ALL_GROUP_KEYS = COLUMN_GROUPS.map((group) => group.key);

function csvCell(cell) {
  // A leading = + - @ would run as a formula in Excel, so prefix it with a quote.
  const safe = String(cell == null || cell === '' ? '—' : cell).replace(/^[=+\-@]/, "'$&");
  return `"${safe.replaceAll('"', '""')}"`;
}

function downloadCsv(columns, rows, firstSrNo, filename) {
  const lines = [
    columns.map((column) => csvCell(column.label)),
    ...rows.map((row, index) => columns.map((column) => csvCell(
      column.exportValue ? column.exportValue(row, firstSrNo + index) : row[column.key],
    ))),
  ];
  const blob = new Blob([`﻿${lines.map((line) => line.join(',')).join('\r\n')}`], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

function StatusLegend({ isDark }) {
  const items = [
    { label: 'Overdue', swatch: isDark ? 'border-red-700/50 bg-red-900/60' : 'border-red-300 bg-red-100', text: isDark ? 'text-red-200' : 'text-red-700' },
    { label: 'Closed', swatch: isDark ? 'border-orange-700/50 bg-orange-900/60' : 'border-orange-300 bg-orange-100', text: isDark ? 'text-orange-200' : 'text-orange-700' },
  ];

  return (
    <div className={`mb-4 flex items-center justify-start gap-4 rounded-lg px-3 py-2 md:justify-end md:gap-6 ${isDark ? 'bg-gray-800/60' : 'bg-gold-100/50'}`}>
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-2">
          <span className={`h-4 w-4 rounded-sm border md:h-5 md:w-5 ${item.swatch}`} />
          <span className={`text-xs font-medium tracking-wide md:text-sm ${item.text}`}>{item.label}</span>
        </div>
      ))}
    </div>
  );
}

export default function ManageLoansPage() {
  const router = useRouter();
  const isDark = useThemeStore((state) => state.theme) === 'dark';
  const [activeTab, setActiveTab] = useState('All');
  const [expandedGroups, setExpandedGroups] = useState([]);
  const [filterKey, setFilterKey] = useState(0);
  const [selected, setSelected] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const loadLoans = useCallback(
    (params) => getManageApplications({ ...params, status: activeTab.toUpperCase() }),
    [activeTab],
  );
  const list = useApplicationList(loadLoans);
  const branch = useStaffBranch();

  const changeTab = (tab) => {
    setActiveTab(tab);
    list.setPage(1);
  };

  const toggleGroup = (key) => {
    setExpandedGroups((current) => (current.includes(key) ? current.filter((item) => item !== key) : [...current, key]));
  };

  // Remounting the filters (new key) also empties their search box and date inputs.
  const clearFilters = () => {
    list.setSearch('');
    list.setDates({ start: '', end: '' });
    list.setBranchId('');
    setFilterKey((key) => key + 1);
  };

  // section decides which pop-up tab opens first: the full case or repayments.
  const openLoan = useCallback(async (row, section = 'details') => {
    setDetailLoading(true);
    try {
      const [detail, schedule, payments] = await Promise.all([
        getLoanAccountDetail(row.id),
        getLoanSchedule(row.id),
        getLoanPayments(row.id),
      ]);
      setSelected({ detail, schedule, payments, section });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not load loan details.');
    } finally {
      setDetailLoading(false);
    }
  }, []);

  const columns = useMemo(
    () => buildColumns({ isDark, onView: (row) => openLoan(row), onPayments: (row) => openLoan(row, 'payments') }),
    [isDark, openLoan],
  );
  const visibleColumns = visibleColumnsFor(columns, expandedGroups);

  const exportPage = () => {
    const exportColumns = visibleColumns.filter((column) => column.exportable !== false);
    const firstSrNo = (list.page - 1) * list.perPage + 1;
    downloadCsv(exportColumns, list.applications, firstSrNo, `manage-loans-page-${list.page}.csv`);
  };

  const exportDisabled = list.loading || list.applications.length === 0;

  return (
    <div className={`min-h-screen w-full min-w-0 max-w-full overflow-x-hidden transition-colors duration-300 ${isDark ? 'bg-gray-900 text-white' : 'bg-gold-50/30 text-gray-900'}`}>
      <div className="w-full min-w-0 max-w-full p-3 sm:p-4 md:p-6">
        <header className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex w-full min-w-0 items-center gap-3 sm:w-auto sm:gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              aria-label="Back to previous page"
              className={`shrink-0 cursor-pointer rounded-lg border p-2.5 transition-all duration-200 hover:scale-105 sm:rounded-xl sm:p-3 ${
                isDark ? 'border-gold-600/30 bg-gray-800/50 hover:bg-gray-800' : 'border-gold-200 bg-gold-50/50 hover:bg-gold-50'
              }`}
            >
              <ArrowLeft className={`h-4 w-4 sm:h-5 sm:w-5 ${isDark ? 'text-gold-400' : 'text-gold-600'}`} />
            </button>
            <h1 className={`truncate bg-gradient-to-r bg-clip-text text-xl font-bold text-transparent sm:text-2xl md:text-3xl ${
              isDark ? 'from-gold-400 to-amber-300' : 'from-gold-600 to-amber-600'
            }`}>
              Manage Loans ({list.pagination.total})
            </h1>
          </div>

          <div className="flex w-full gap-2 sm:w-auto">
            <button
              type="button"
              onClick={list.refresh}
              disabled={list.loading}
              className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg px-3 py-2 font-medium transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-initial sm:rounded-xl sm:px-4 ${
                isDark ? 'bg-gray-700 text-white hover:bg-gray-600' : 'border border-gold-200 bg-white text-gray-800 hover:bg-gold-50'
              }`}
            >
              <RefreshCw className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${list.loading ? 'animate-spin' : ''}`} />
              <span className="text-xs sm:text-sm">Refresh</span>
            </button>
            <button
              type="button"
              onClick={exportPage}
              disabled={exportDisabled}
              className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg bg-gold-600 px-3 py-2 font-medium text-white transition-all duration-200 hover:bg-gold-700 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-initial sm:rounded-xl sm:px-4"
            >
              <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="text-xs sm:text-sm">Export</span>
            </button>
          </div>
        </header>

        <ManageLoansTabs activeTab={activeTab} onTabChange={changeTab} isDark={isDark} />

        <ApplicationListFilters
          key={filterKey}
          list={list}
          isDark={isDark}
          branchName={branch}
          matchPendingStyle
          searchOptions={searchOptions}
          searchPlaceholder="Search application no., loan no., name or mobile..."
        />

        <ManageLoansFilterSummary
          search={list.search}
          dates={list.dates}
          branchActive={Boolean(list.branchId)}
          shownCount={list.applications.length}
          totalCount={list.pagination.total}
          onClear={clearFilters}
          isDark={isDark}
        />

        {list.error && <p role="alert" className="mb-4 text-red-600">{list.error}</p>}
        {detailLoading && (
          <p role="status" className={`mb-3 text-sm ${isDark ? 'text-gold-300' : 'text-gold-700'}`}>
            Loading loan details...
          </p>
        )}

        <StatusLegend isDark={isDark} />

        <ManageLoansColumnControls
          expandedGroups={expandedGroups}
          onToggle={toggleGroup}
          onExpandAll={() => setExpandedGroups(ALL_GROUP_KEYS)}
          onCollapseAll={() => setExpandedGroups([])}
          isDark={isDark}
        />

        <ManageLoansTable
          columns={visibleColumns}
          list={list}
          isDark={isDark}
          animationKey={expandedGroups.join(',')}
          emptyMessage={list.loading ? 'Loading issued loans...' : `No ${activeTab.toLowerCase()} loans found`}
        />

        <ManageLoansModal isOpen={Boolean(selected)} loan={selected} onClose={() => setSelected(null)} isDark={isDark} />
      </div>
    </div>
  );
}
