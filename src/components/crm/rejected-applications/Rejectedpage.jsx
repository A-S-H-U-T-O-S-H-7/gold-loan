'use client';

import { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { useThemeStore } from '@/lib/store/useThemeStore';
import { getRejectedApplications, restoreRejectedApplication } from '@/lib/services/rejectedApplicationService';
import useApplicationList from '@/components/crm/application-list/useApplicationList';
import useStaffBranch from '@/components/crm/application-list/useStaffBranch';
import ApplicationListFilters from '@/components/crm/application-list/ApplicationListFilters';
import RejectedTable from '@/components/crm/rejected-applications/RejectedTable';
import RestoreApplicationModal from '@/components/crm/rejected-applications/RestoreApplicationModal';
import PageHeader from '@/components/crm/ui/PageHeader';

const searchOptions = [
  { value: 'application_no', label: 'Application No.' },
  { value: 'name', label: 'Name' },
  { value: 'mobile', label: 'Mobile' },
  { value: 'email', label: 'Email' },
  { value: 'all', label: 'All fields' },
];

export default function RejectedApplicationsPage() {
  const isDark = useThemeStore((state) => state.theme) === 'dark';
  const list = useApplicationList(getRejectedApplications);
  const branch = useStaffBranch();
  const [restoring, setRestoring] = useState(null);
  const [refreshIconKey, setRefreshIconKey] = useState(0);

  const refresh = () => {
    setRefreshIconKey((key) => key + 1);
    list.refresh();
  };

  // Errors are left for the modal to show, so it stays open for another try.
  const restore = async (application, reason) => {
    await restoreRejectedApplication(application.id, reason);
    toast.success(`Application ${application.applicationNo} moved to Create Customer.`);
    setRestoring(null);
    list.refresh();
  };

  return (
    <div className={`min-h-screen w-full min-w-0 max-w-full overflow-x-hidden transition-colors duration-300 ${isDark ? 'bg-gray-900 text-white' : 'bg-gold-50/30 text-gray-900'}`}>
      <div className="w-full min-w-0 max-w-full p-3 sm:p-4 md:p-6">
        <PageHeader
          title="Rejected Applications"
          count={list.pagination.total}
          isDark={isDark}
          actions={
            <button
              type="button"
              onClick={refresh}
              disabled={list.loading}
              aria-label="Refresh rejected applications"
              className={`inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded border px-4 py-2 font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto ${isDark ? 'border-gold-600 text-gold-300 hover:bg-gold-500/10' : 'border-gold-300 bg-white text-gold-700 hover:bg-gold-50'}`}
            >
              <RefreshCw key={refreshIconKey} className={`h-4 w-4 shrink-0 ${refreshIconKey > 0 ? 'animate-[spin_600ms_ease-in-out_1]' : ''}`} />
              Refresh
            </button>
          }
        />

        <ApplicationListFilters list={list} isDark={isDark} branchName={branch} matchPendingStyle searchOptions={searchOptions} />

        {list.error && <p role="alert" className="mb-4 text-red-600">{list.error}</p>}

        <RejectedTable list={list} isDark={isDark} onRestore={setRestoring} />

        {restoring && (
          <RestoreApplicationModal
            key={restoring.id}
            application={restoring}
            onClose={() => setRestoring(null)}
            onConfirm={restore}
            isDark={isDark}
          />
        )}
      </div>
    </div>
  );
}
