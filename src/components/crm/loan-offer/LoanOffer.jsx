'use client';

import { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { useThemeStore } from '@/lib/store/useThemeStore';
import { getLoanOfferApplications, getApplicationOffer, changeLoanOfferStatus } from '@/lib/services/loanOfferApplicationService';
import useApplicationList from '@/components/crm/application-list/useApplicationList';
import useStaffBranch from '@/components/crm/application-list/useStaffBranch';
import ApplicationListFilters from '@/components/crm/application-list/ApplicationListFilters';
import LoanOfferTable from '@/components/crm/loan-offer/LoanOfferTable';
import PageHeader from '@/components/crm/ui/PageHeader';
import StatusUpdateModal from '@/components/crm/application-modals/StatusUpdateModal';

export default function LoanOfferPage() {
  const isDark = useThemeStore((state) => state.theme) === 'dark';
  const list = useApplicationList(getLoanOfferApplications);
  const branch = useStaffBranch();
  const [statusApplication, setStatusApplication] = useState(null);
  const [checking, setChecking] = useState(false);

  async function openStatus(app) {
    setChecking(true);
    try {
      const result = (await getApplicationOffer(app.id)).data;
      if (result.application.status !== 'LOAN_OFFER') {
        list.refresh();
        toast.error('Application has left the Loan Offer queue.');
        return;
      }
      setStatusApplication({ ...app, ...result.application, offerDecision: result.currentOffer?.decision, evaluationStatus: result.evaluation?.status });
    } catch (error) { toast.error(error.response?.data?.message || 'Could not load the current offer.'); }
    finally { setChecking(false); }
  }

  async function updateStatus(id, status, remark) {
    await changeLoanOfferStatus(id, status, remark);
    toast.success('Application status updated');
    list.refresh();
  }

  return <div className={`min-h-screen w-full min-w-0 max-w-full overflow-x-hidden transition-colors duration-300 ${isDark ? 'bg-gray-900 text-white' : 'bg-gold-50/30 text-gray-900'}`}>
    <div className="w-full min-w-0 max-w-full p-3 sm:p-4 md:p-6">
    <PageHeader title="Loan Offer" count={list.pagination.total} isDark={isDark} actions={
      <button type="button" onClick={list.refresh} disabled={list.loading} aria-label="Refresh loan offer applications" className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded border px-4 py-2 font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${isDark ? 'border-gold-600 text-gold-300 hover:bg-gold-500/10' : 'border-gold-300 bg-white text-gold-700 hover:bg-gold-50'}`}>
        <RefreshCw className={`h-4 w-4 ${list.loading ? 'animate-spin' : ''}`} />Refresh
      </button>
    } />
    <ApplicationListFilters list={list} isDark={isDark} branchName={branch} searchOptions={[
      { value: 'application_no', label: 'Application No.' }, { value: 'name', label: 'Name' },
      { value: 'mobile', label: 'Mobile' }, { value: 'email', label: 'Email' }, { value: 'all', label: 'All fields' },
    ]} />
    {list.error && <p role="alert" className="mb-4 text-red-600">{list.error}</p>}
    {checking && <p role="status" className="mb-3 text-sm text-gold-700">Checking offer...</p>}
    <LoanOfferTable list={list} isDark={isDark} onStatusClick={openStatus} />
    <StatusUpdateModal isOpen={Boolean(statusApplication)} application={statusApplication}
      onClose={() => setStatusApplication(null)} onStatusUpdate={updateStatus}
      statusOptions={[{ value: 'CREDIT_APPROVAL', label: 'Credit Approval', disabled: statusApplication?.offerDecision !== 'ACCEPTED' || !statusApplication?.kycVerified || statusApplication?.evaluationStatus !== 'FINALIZED', disabledReason: 'Accept the current offer and verify KYC and evaluation first.' }, { value: 'REJECTED', label: 'Reject' }]}
      isDark={isDark} accent="gold" initialStatus="" requiredRemarkStatuses={['REJECTED']}
      showCurrentStatus showSuccessToast={false} preventSameStatus submitLabel="Confirm Status Change" />
    </div>
  </div>;
}
