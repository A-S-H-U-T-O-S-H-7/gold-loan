'use client';

import { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { useThemeStore } from '@/lib/store/useThemeStore';
import {
  changeCreditApprovalStatus,
  getCreditApprovalApplications,
  getCreditReview,
} from '@/lib/services/creditApprovalService';
import useApplicationList from '@/components/crm/application-list/useApplicationList';
import useStaffBranch from '@/components/crm/application-list/useStaffBranch';
import ApplicationListFilters from '@/components/crm/application-list/ApplicationListFilters';
import CreditApprovalTable from '@/components/crm/credit-approval/CreditApprovalTable';
import StatusUpdateModal from '@/components/crm/application-modals/StatusUpdateModal';
import PageHeader from '@/components/crm/ui/PageHeader';

const searchOptions = [
  { value: 'application_no', label: 'Application No.' },
  { value: 'name', label: 'Name' },
  { value: 'mobile', label: 'Mobile' },
  { value: 'email', label: 'Email' },
  { value: 'all', label: 'All fields' },
];

// Each next queue is only available once the matching, still-valid review decision exists.
function statusOptionsFor(application) {
  const decision = application?.creditReviewValid ? application.creditReviewDecision : null;
  const reviewRequired = 'Record a matching credit review decision first.';

  return [
    { value: 'DISBURSE', label: 'Disburse', disabled: decision !== 'APPROVED', disabledReason: reviewRequired },
    { value: 'REJECTED', label: 'Reject', disabled: decision !== 'REJECTED', disabledReason: reviewRequired },
    { value: 'LOAN_OFFER', label: 'Loan Offer', disabled: decision !== 'NEEDS_REVIEW', disabledReason: reviewRequired },
  ];
}

export default function CreditApprovalListPage() {
  const isDark = useThemeStore((state) => state.theme) === 'dark';
  const list = useApplicationList(getCreditApprovalApplications);
  const branch = useStaffBranch();
  const [statusApplication, setStatusApplication] = useState(null);
  const [checkingStatus, setCheckingStatus] = useState(false);
  const [refreshIconKey, setRefreshIconKey] = useState(0);

  const refresh = () => {
    setRefreshIconKey((key) => key + 1);
    list.refresh();
  };

  const openStatus = async (application) => {
    setCheckingStatus(true);
    try {
      const result = await getCreditReview(application.id);
      if (result.application.status !== 'CREDIT_APPROVAL') {
        list.refresh();
        toast.error('Application has left Credit Approval.');
        return;
      }
      setStatusApplication({
        ...application,
        creditReviewDecision: result.currentReview?.decision,
        creditReviewValid: result.reviewValid,
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not load credit review.');
    } finally {
      setCheckingStatus(false);
    }
  };

  const changeStatus = async (id, status, remark) => {
    await changeCreditApprovalStatus(id, status, remark);
    toast.success('Application status updated');
    list.refresh();
  };

  return (
    <div className={`min-h-screen w-full min-w-0 max-w-full overflow-x-hidden transition-colors duration-300 ${isDark ? 'bg-gray-900 text-white' : 'bg-gold-50/30 text-gray-900'}`}>
      <div className="w-full min-w-0 max-w-full p-3 sm:p-4 md:p-6">
        <PageHeader
          title="Credit Approval"
          count={list.pagination.total}
          isDark={isDark}
          actions={
            <button
              type="button"
              onClick={refresh}
              disabled={list.loading}
              aria-label="Refresh credit approval applications"
              className={`inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded border px-4 py-2 font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto ${isDark ? 'border-gold-600 text-gold-300 hover:bg-gold-500/10' : 'border-gold-300 bg-white text-gold-700 hover:bg-gold-50'}`}
            >
              <RefreshCw key={refreshIconKey} className={`h-4 w-4 shrink-0 ${refreshIconKey > 0 ? 'animate-[spin_600ms_ease-in-out_1]' : ''}`} />
              Refresh
            </button>
          }
        />

        <ApplicationListFilters list={list} isDark={isDark} branchName={branch} matchPendingStyle searchOptions={searchOptions} />

        {list.error && <p role="alert" className="mb-4 text-red-600">{list.error}</p>}
        {checkingStatus && (
          <p role="status" className={`mb-3 text-sm ${isDark ? 'text-gold-300' : 'text-gold-700'}`}>
            Checking credit review...
          </p>
        )}

        <CreditApprovalTable list={list} isDark={isDark} onStatusClick={openStatus} />

        <StatusUpdateModal
          isOpen={Boolean(statusApplication)}
          application={statusApplication}
          onClose={() => setStatusApplication(null)}
          onStatusUpdate={changeStatus}
          statusOptions={statusOptionsFor(statusApplication)}
          isDark={isDark}
          accent="gold"
          initialStatus=""
          requiredRemarkStatuses={['REJECTED']}
          showCurrentStatus
          showSuccessToast={false}
          preventSameStatus
          submitLabel="Confirm Status Change"
        />
      </div>
    </div>
  );
}
