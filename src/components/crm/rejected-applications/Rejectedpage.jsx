'use client';

import { RefreshCw } from 'lucide-react';
import { useThemeStore } from '@/lib/store/useThemeStore';
import { getRejectedApplications } from '@/lib/services/rejectedApplicationService';
import useApplicationList from '@/components/crm/application-list/useApplicationList';
import useStaffBranch from '@/components/crm/application-list/useStaffBranch';
import ApplicationListFilters from '@/components/crm/application-list/ApplicationListFilters';
import ApplicationListTable from '@/components/crm/application-list/ApplicationListTable';
import PageHeader from '@/components/crm/ui/PageHeader';

export default function RejectedApplicationsPage() {
  const isDark = useThemeStore((state) => state.theme) === 'dark';
  const list = useApplicationList(getRejectedApplications);
  const branch = useStaffBranch();

  return <div className={`min-h-screen p-4 md:p-6 ${isDark ? 'bg-gray-900 text-white' : 'bg-gold-50/30 text-gray-900'}`}>
    <PageHeader title="Rejected" count={list.pagination.total} isDark={isDark} actions={
      <button type="button" onClick={list.refresh} disabled={list.loading} className="flex items-center gap-2 rounded-lg bg-gold-600 px-4 py-2 font-semibold text-white disabled:opacity-50">
        <RefreshCw className={`h-4 w-4 ${list.loading ? 'animate-spin' : ''}`} />Refresh
      </button>
    } />
    <ApplicationListFilters list={list} isDark={isDark} branchName={branch} />
    {list.error && <p role="alert" className="mb-4 text-red-600">{list.error}</p>}
    <ApplicationListTable list={list} title="Rejected" isDark={isDark} />
  </div>;
}
