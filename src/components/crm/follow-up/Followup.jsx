'use client';

import { useMemo, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { useThemeStore } from '@/lib/store/useThemeStore';
import { changeFollowUpApplicationStatus, formatFollowUpApplicationForUI, getFollowUpApplications } from '@/lib/services/followUpApplicationService';
import useApplicationList from '@/components/crm/application-list/useApplicationList';
import useStaffBranch from '@/components/crm/application-list/useStaffBranch';
import ApplicationListFilters from '@/components/crm/application-list/ApplicationListFilters';
import FollowUpTable from '@/components/crm/follow-up/FollowUpTable';
import StatusUpdateModal from '@/components/crm/application-modals/StatusUpdateModal';
import PageHeader from '@/components/crm/ui/PageHeader';
import toast from 'react-hot-toast';

export default function FollowUpPage() {
  const isDark = useThemeStore((state) => state.theme) === 'dark';
  const list = useApplicationList(getFollowUpApplications);
  const branch = useStaffBranch();
  const [statusApplication, setStatusApplication] = useState(null);
  const [refreshIconKey, setRefreshIconKey] = useState(0);
  const tableApplications = useMemo(
    () => list.applications.map(formatFollowUpApplicationForUI),
    [list.applications]
  );
  const changeStatus = async (id, status, remark) => {
    await changeFollowUpApplicationStatus(id, status, remark);
    toast.success('Application status changed');
    list.refresh();
  };

  return <div className={`min-h-screen w-full min-w-0 max-w-full overflow-x-hidden p-3 sm:p-4 md:p-6 ${isDark ? 'bg-gray-900 text-white' : 'bg-gold-50/30 text-gray-900'}`}>
    <PageHeader title="Follow-up" count={list.pagination.total} isDark={isDark} actions={
      <button type="button" onClick={() => { setRefreshIconKey((key) => key + 1); list.refresh(); }} disabled={list.loading} aria-label="Refresh follow-up applications" className={`inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded border px-4 py-2 font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto ${isDark ? 'border-gold-600 text-gold-300 hover:bg-gold-500/10' : 'border-gold-300 bg-white text-gold-700 hover:bg-gold-50'}`}>
        <RefreshCw key={refreshIconKey} className={`h-4 w-4 ${refreshIconKey > 0 ? 'animate-[spin_600ms_ease-in-out_1]' : ''}`} />Refresh
      </button>
    } />
    <ApplicationListFilters list={list} isDark={isDark} branchName={branch} matchPendingStyle searchOptions={[
      { value: 'application_no', label: 'Application No.' },
      { value: 'name', label: 'Name' },
      { value: 'mobile', label: 'Mobile' },
      { value: 'email', label: 'Email' },
      { value: 'all', label: 'All fields' },
    ]} />
    {list.error && <p role="alert" className="mb-4 text-red-600">{list.error}</p>}
    <FollowUpTable
      applications={tableApplications}
      currentPage={list.page}
      totalPages={list.pagination.total_pages}
      totalItems={list.pagination.total}
      itemsPerPage={list.perPage}
      loading={list.loading}
      isDark={isDark}
      onPageChange={list.setPage}
      onPageSizeChange={list.setPerPage}
      onStatusClick={setStatusApplication}
    />
    <StatusUpdateModal
      isOpen={Boolean(statusApplication)}
      application={statusApplication}
      onClose={() => setStatusApplication(null)}
      onStatusUpdate={changeStatus}
      statusOptions={[
        { value: 'REJECTED', label: 'Reject' },
        { value: 'EVALUATING', label: 'Gold Evaluation', disabled: !statusApplication?.kycVerified },
      ]}
      isDark={isDark}
      accent="gold"
      initialStatus=""
      requiredRemarkStatuses={['REJECTED']}
      showCurrentStatus
      showSuccessToast={false}
      preventSameStatus
    />
  </div>;
}
