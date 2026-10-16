'use client';

import { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { useThemeStore } from '@/lib/store/useThemeStore';
import { changeEvaluationApplicationStatus, getEvaluation, getGoldEvaluationApplications } from '@/lib/services/goldEvaluationService';
import useApplicationList from '@/components/crm/application-list/useApplicationList';
import useStaffBranch from '@/components/crm/application-list/useStaffBranch';
import ApplicationListFilters from '@/components/crm/application-list/ApplicationListFilters';
import GoldEvaluationTable from '@/components/crm/gold-evaluation/GoldEvaluationTable';
import StatusUpdateModal from '@/components/crm/application-modals/StatusUpdateModal';
import PageHeader from '@/components/crm/ui/PageHeader';

export default function GoldEvaluationPage() {
  const isDark = useThemeStore((state) => state.theme) === 'dark';
  const list = useApplicationList(getGoldEvaluationApplications);
  const branch = useStaffBranch();
  const [statusApplication, setStatusApplication] = useState(null);
  const [checkingStatus, setCheckingStatus] = useState(false);
  const [refreshIconKey, setRefreshIconKey] = useState(0);

  const openStatus = async (application) => {
    setCheckingStatus(true);
    try {
      const result = await getEvaluation(application.id);
      const current = result.application;
      if (current.status !== 'GOLD_EVALUATION') {
        list.refresh();
        toast.error('Application has left the evaluation queue.');
        return;
      }
      setStatusApplication({ ...application, ...current, evaluationStatus: result.evaluation?.status || null });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not check the current evaluation status.');
    } finally {
      setCheckingStatus(false);
    }
  };

  const changeStatus = async (id, status, remark) => {
    await changeEvaluationApplicationStatus(id, status, remark);
    toast.success('Application moved to the selected queue');
    list.refresh();
  };

  return <div className={`min-h-screen w-full min-w-0 max-w-full overflow-x-hidden transition-colors duration-300 ${isDark ? 'bg-gray-900 text-white' : 'bg-gold-50/30 text-gray-900'}`}>
    <div className="w-full min-w-0 max-w-full p-3 sm:p-4 md:p-6">
    <PageHeader title="Gold Evaluation" count={list.pagination.total} isDark={isDark} actions={
      <button type="button" onClick={() => { setRefreshIconKey((key) => key + 1); list.refresh(); }} disabled={list.loading} aria-label="Refresh gold evaluation applications"
        className={`inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded border px-4 py-2 font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto ${isDark ? 'border-gold-600 text-gold-300 hover:bg-gold-500/10' : 'border-gold-300 bg-white text-gold-700 hover:bg-gold-50'}`}>
        <RefreshCw key={refreshIconKey} className={`h-4 w-4 shrink-0 ${refreshIconKey > 0 ? 'animate-[spin_600ms_ease-in-out_1]' : ''}`} />Refresh
      </button>
    } />
    <ApplicationListFilters list={list} isDark={isDark} branchName={branch} matchPendingStyle
      searchOptions={[
        { value: 'application_no', label: 'Application No.' },
        { value: 'name', label: 'Name' },
        { value: 'mobile', label: 'Mobile' },
        { value: 'email', label: 'Email' },
        { value: 'all', label: 'All fields' },
      ]} />
    {list.error && <p role="alert" className="mb-4 text-red-600">{list.error}</p>}
    {checkingStatus && <p role="status" className={`mb-3 text-sm ${isDark ? 'text-gold-300' : 'text-gold-700'}`}>Checking evaluation status...</p>}
    <GoldEvaluationTable list={list} isDark={isDark} onStatusClick={openStatus} />
    <StatusUpdateModal isOpen={Boolean(statusApplication)} application={statusApplication}
      onClose={() => setStatusApplication(null)} onStatusUpdate={changeStatus}
      statusOptions={[
        { value: 'REJECTED', label: 'Reject' },
        { value: 'LOAN_OFFER', label: 'Loan Offer', disabled: statusApplication?.evaluationStatus !== 'FINALIZED' || !statusApplication?.kycVerified, disabledReason: statusApplication?.evaluationStatus !== 'FINALIZED' ? 'Finalize gold evaluation first.' : 'Verify KYC before moving to Loan Offer.' },
      ]}
      isDark={isDark} accent="gold" initialStatus="" requiredRemarkStatuses={['REJECTED', 'LOAN_OFFER']}
      showCurrentStatus showSuccessToast={false} preventSameStatus submitLabel="Confirm Status Change" />
    </div>
  </div>;
}
