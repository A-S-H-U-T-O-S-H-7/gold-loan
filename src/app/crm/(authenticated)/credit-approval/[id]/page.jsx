'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useThemeStore } from '@/lib/store/useThemeStore';
import { useLoanStore } from '@/lib/store/loanStore';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import CreditReviewHeader from '@/components/crm/credit-approval/CreditReviewHeader';
import CreditChecklist from '@/components/crm/credit-approval/CreditChecklist';
import CreditSummary from '@/components/crm/credit-approval/CreditSummary';
import CustomerInfoCard from '@/components/crm/gold-evaluation/CustomerInfoCard';
import { DangerButton, GhostButton, PrimaryButton } from '@/components/crm/ui/FormControls';
import { formatCurrency } from '@/lib/utils/format';

export default function CreditReviewPage() {
  const params = useParams();
  const router = useRouter();
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';
  const applicationId = params.id;

  const { applications, getApplication, updateApplication, setStatus } = useLoanStore();

  const [loading, setLoading] = useState(true);
  const [application, setApplication] = useState(null);
  const [approvedAmount, setApprovedAmount] = useState('');
  const [checks, setChecks] = useState({
    documentsVerified: false,
    goldCorrect: false,
    ltvWithinLimit: false,
    customerEligible: false,
  });

  useEffect(() => {
    if (applicationId) {
      const app = getApplication(applicationId);
      if (app) {
        setApplication(app);
        setApprovedAmount(app.loan?.approvedAmount || app.loan?.offeredAmount || 0);
        setChecks(app.creditChecklist || {
          documentsVerified: false,
          goldCorrect: false,
          ltvWithinLimit: false,
          customerEligible: false,
        });
      } else {
        toast.error('Application not found');
        router.push('/crm/credit-approval');
      }
    }
    setLoading(false);
  }, [applicationId, getApplication, router]);

  const allChecked = Object.values(checks).every(v => v === true);
  const eligible = application?.gold?.totals?.eligibleAmount || 0;
  const overEligible = Number(approvedAmount) > eligible;

  const handleNeedsReview = () => {
    Swal.fire({
      title: 'Send Back for Review?',
      text: 'This will send the application back to gold evaluation.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#F59E0B',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, Send Back',
      cancelButtonText: 'Cancel',
      background: isDark ? '#1a1a2e' : '#ffffff',
      color: isDark ? '#f3f4f6' : '#111827',
    }).then((result) => {
      if (result.isConfirmed) {
        setStatus(applicationId, 'GOLD_EVALUATED');
        toast.success('Sent back for gold review');
        router.push('/crm/credit-approval');
      }
    });
  };

  const handleReject = () => {
    Swal.fire({
      title: 'Reject Application?',
      text: 'Are you sure you want to reject this application?',
      icon: 'warning',
      input: 'textarea',
      inputLabel: 'Rejection Reason',
      inputPlaceholder: 'Enter reason for rejection...',
      showCancelButton: true,
      confirmButtonColor: '#C62828',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, Reject!',
      cancelButtonText: 'Cancel',
      inputValidator: (value) => {
        if (!value || value.trim() === '') {
          return 'Please enter a rejection reason!';
        }
        return null;
      },
      background: isDark ? '#1a1a2e' : '#ffffff',
      color: isDark ? '#f3f4f6' : '#111827',
    }).then((result) => {
      if (result.isConfirmed) {
        setStatus(applicationId, 'REJECTED', {
          rejectedReason: result.value,
          rejectedStage: 'CREDIT_APPROVAL'
        });
        toast.success('Application rejected');
        router.push('/crm/rejected-applications');
      }
    });
  };

  const handleApprove = () => {
    if (!allChecked) {
      toast.error('Please complete all checklist items');
      return;
    }

    if (overEligible) {
      toast.error(`Amount cannot exceed eligible ${formatCurrency(eligible)}`);
      return;
    }

    Swal.fire({
      title: 'Approve Application?',
      html: `
        <div style="text-align: left;">
          <p><strong>Application:</strong> ${application?.id}</p>
          <p><strong>Customer:</strong> ${application?.customer?.name}</p>
          <p><strong>Approved Amount:</strong> ${formatCurrency(approvedAmount)}</p>
        </div>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, Approve!',
      cancelButtonText: 'Cancel',
      background: isDark ? '#1a1a2e' : '#ffffff',
      color: isDark ? '#f3f4f6' : '#111827',
    }).then((result) => {
      if (result.isConfirmed) {
        updateApplication(applicationId, {
          loan: {
            ...application.loan,
            approvedAmount: Number(approvedAmount)
          },
          creditChecklist: checks
        });
        setStatus(applicationId, 'APPROVED');
        toast.success('Application approved — moving to disbursement');
        router.push('/crm/disbursement');
      }
    });
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-gray-900' : 'bg-gold-50/30'}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-500 mx-auto"></div>
          <p className={`mt-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Loading...</p>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-gray-900' : 'bg-gold-50/30'}`}>
        <div className="text-center">
          <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Application not found</p>
          <button
            onClick={() => router.push('/crm/credit-approval')}
            className="mt-4 px-4 py-2 bg-gold-500 text-white rounded hover:bg-gold-600"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-gray-900' : 'bg-gold-50/30'}`}>
      <div className="p-4 md:p-6 max-w-8xl mx-auto">
        {/* Header */}
        <CreditReviewHeader
          application={application}
          onBack={() => router.push('/crm/credit-approval')}
          isDark={isDark}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left & Middle Columns */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Info with KYC */}
            <CustomerInfoCard
              customerDetails={{
                ...application.customer,
                id: application.id,
                kycDate: application.timeline?.kycVerifiedAt,
                documents: application.customer?.documents || {},
                nominee: application.customer?.nominee || {},
                guarantor: application.customer?.guarantor || {},
              }}
              isDark={isDark}
            />

            {/* Credit Checklist */}
            <CreditChecklist
              checks={checks}
              setChecks={setChecks}
              isDark={isDark}
            />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Summary */}
            <CreditSummary application={application} isDark={isDark} />

            {/* Action Buttons */}
            <div className={`rounded-xl border-2 p-5 ${
              isDark ? 'bg-gray-800/50 border-gold-700/30' : 'bg-white/50 border-gold-200'
            }`}>
              <h3 className={`text-sm font-semibold mb-4 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                Decision
              </h3>

              <div className="space-y-3">
                <div>
                  <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Final Approved Amount
                  </label>
                  <input
                    type="number"
                    value={approvedAmount}
                    onChange={(e) => setApprovedAmount(e.target.value)}
                    className={`w-full px-3 py-2 rounded border-2 transition-all duration-200 text-sm ${
                      isDark
                        ? 'bg-gray-700 border-gray-600 text-white focus:border-gold-400'
                        : 'bg-gray-50 border-gray-300 text-gray-900 focus:border-gold-500'
                    } focus:ring-2 focus:ring-gold-500/20 focus:outline-none`}
                    placeholder="Enter approved amount"
                  />
                  {overEligible && (
                    <p className="text-xs text-red-500 mt-1">
                      Cannot exceed eligible amount {formatCurrency(eligible)}
                    </p>
                  )}
                  <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    Eligible: {formatCurrency(eligible)}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  <GhostButton onClick={handleNeedsReview} className="flex-1">
                    Needs Review
                  </GhostButton>
                  <DangerButton onClick={handleReject} className="flex-1">
                    Reject
                  </DangerButton>
                  <PrimaryButton
                    onClick={handleApprove}
                    disabled={!allChecked || overEligible}
                    className="flex-1"
                  >
                    Approve
                  </PrimaryButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}