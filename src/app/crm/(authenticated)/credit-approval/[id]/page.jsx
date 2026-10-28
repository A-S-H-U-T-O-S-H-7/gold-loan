'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useThemeStore } from '@/lib/store/useThemeStore';
import { getCreditReview, recordCreditDecision, saveCreditReview } from '@/lib/services/creditApprovalService';
import CustomerInfoCard from '@/components/crm/gold-evaluation/CustomerInfoCard';
import CreditReviewHeader from '@/components/crm/credit-approval/CreditReviewHeader';
import CreditEvaluationSection from '@/components/crm/credit-approval/CreditEvaluationSection';
import CreditOfferSection from '@/components/crm/credit-approval/CreditOfferSection';
import CreditChecklist, { CHECKLIST_ITEMS } from '@/components/crm/credit-approval/CreditChecklist';
import CreditSummary from '@/components/crm/credit-approval/CreditSummary';
import CreditDecisionPanel from '@/components/crm/credit-approval/CreditDecisionPanel';
import CreditReviewHistory from '@/components/crm/credit-approval/CreditReviewHistory';
import { formatDateTime, reviewLabels } from '@/components/crm/credit-approval/creditReviewLabels';
import { cardClass } from '@/components/crm/ui/detailStyles';

const checkKeys = CHECKLIST_ITEMS.map((item) => item.key);
const blankChecks = Object.fromEntries(checkKeys.map((key) => [key, false]));

const errorText = (error, fallback) => error.response?.data?.message || fallback;

// An expired review starts again from an empty checklist and remark.
function checksFromReview(review, reviewValid) {
  if (!review || !reviewValid) return { ...blankChecks };
  return Object.fromEntries(checkKeys.map((key) => [key, Boolean(review[key])]));
}

function buildCustomerDetails(data) {
  const { application, kyc } = data;
  const customer = kyc?.details || {};
  const current = customer.currentAddress;
  const address = current
    ? [current.houseNo, current.address, current.city, current.state, current.pinCode].filter(Boolean).join(', ')
    : undefined;

  return {
    ...customer,
    address,
    id: application.applicationNo,
    name: application.name,
    mobile: application.mobile,
    email: application.email,
    kycVerified: kyc?.isVerified,
    kycDate: formatDateTime(kyc?.verifiedAt),
    documents: Object.fromEntries((kyc?.documents || []).map((document) => [document.documentType, true])),
  };
}

export default function CreditReviewPage() {
  const { id } = useParams();
  const router = useRouter();
  const isDark = useThemeStore((state) => state.theme) === 'dark';

  const [data, setData] = useState(null);
  const [checks, setChecks] = useState(blankChecks);
  const [remark, setRemark] = useState('');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const navigateBack = () => {
    if (window.history.length > 1) router.back();
    else router.push('/crm/credit-approval');
  };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getCreditReview(id);
      const isExpired = result.currentReview && !result.reviewValid;
      setData(result);
      setChecks(checksFromReview(result.currentReview, result.reviewValid));
      setRemark(isExpired ? '' : result.currentReview?.remark || '');
    } catch (error) {
      toast.error(errorText(error, 'Could not load credit review.'));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) load();
  }, [id, load]);

  const review = data?.currentReview;
  const decided = Boolean(review && data.reviewValid && review.decision !== 'AWAITING_REVIEW');
  const canReview = Boolean(data?.kyc?.isVerified && data?.evaluation?.status === 'FINALIZED' && data?.offer?.decision === 'ACCEPTED');
  const allChecked = checkKeys.every((key) => checks[key]);

  const reviewPayload = () => ({ ...checks, remark, expectedReviewId: review?.id ?? null });

  const saveDraft = async () => {
    setBusy(true);
    try {
      const saved = await saveCreditReview(id, reviewPayload());
      setData((previous) => {
        // Saving over an expired review creates a new one; keep the old one in history.
        const replacedOldReview = previous.currentReview && previous.currentReview.id !== saved.id;
        return {
          ...previous,
          currentReview: saved,
          reviewValid: true,
          previousReviews: replacedOldReview ? [previous.currentReview, ...previous.previousReviews] : previous.previousReviews,
        };
      });
      toast.success('Review draft saved');
    } catch (error) {
      toast.error(errorText(error, 'Could not save review.'));
    } finally {
      setBusy(false);
    }
  };

  const decide = async (decision) => {
    if (decision === 'APPROVED' && !allChecked) {
      toast.error('Complete all checklist items first.');
      return;
    }
    if (decision !== 'APPROVED' && !remark.trim()) {
      toast.error('Enter a reason or correction note.');
      return;
    }

    setBusy(true);
    try {
      // The decision is recorded against a saved review, so save any unsaved checklist or remark first.
      let current = review;
      const hasUnsavedChanges = !current
        || checkKeys.some((key) => current[key] !== checks[key])
        || current.remark !== remark.trim();
      if (hasUnsavedChanges) current = await saveCreditReview(id, reviewPayload());

      await recordCreditDecision(current.id, { decision, remark });
      toast.success(`Credit review ${reviewLabels[decision].toLowerCase()}.`);
      navigateBack();
    } catch (error) {
      toast.error(errorText(error, 'Could not save decision.'));
      load();
    } finally {
      setBusy(false);
    }
  };

  const pageClass = `min-h-screen w-full min-w-0 max-w-full overflow-x-hidden transition-colors duration-300 ${
    isDark ? 'bg-gray-900 text-gray-100' : 'bg-gold-50/30 text-gray-900'
  }`;

  if (loading) {
    return (
      <div role="status" className={`${pageClass} flex items-center justify-center`}>
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-gold-500" />
          <p className="mt-4">Loading credit review...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className={`${pageClass} p-4 md:p-6`}>
        <div className={cardClass(isDark)}>
          <p>Credit review could not be loaded.</p>
          <button type="button" onClick={navigateBack} className="mt-3 inline-flex cursor-pointer rounded-lg bg-gold-600 px-4 py-2 text-sm font-semibold text-white">
            Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={pageClass}>
      <div className="mx-auto space-y-6 p-3 sm:p-4 md:p-6">
        <CreditReviewHeader application={data.application} onBack={navigateBack} isDark={isDark} />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="min-w-0 space-y-6 lg:col-span-2">
            <CustomerInfoCard
              customerDetails={buildCustomerDetails(data)}
              isDark={isDark}
              defaultShowKyc
              applicationId={id}
              kycHref={`/crm/kyc/${id}`}
            />
            <CreditEvaluationSection applicationId={id} evaluation={data.evaluation} isDark={isDark} />
            <CreditOfferSection applicationId={id} offer={data.offer} isDark={isDark} />
          </div>

          <aside className="min-w-0 space-y-6">
            <CreditSummary evaluation={data.evaluation} offer={data.offer} isDark={isDark} />
            <CreditChecklist checks={checks} setChecks={setChecks} isDark={isDark} disabled={decided || busy || !canReview} />
            <CreditDecisionPanel
              review={review}
              reviewValid={data.reviewValid}
              remark={remark}
              onRemarkChange={setRemark}
              canReview={canReview}
              decided={decided}
              allChecked={allChecked}
              busy={busy}
              onSaveDraft={saveDraft}
              onDecide={decide}
              isDark={isDark}
            />
            <CreditReviewHistory reviews={data.previousReviews} isDark={isDark} />
          </aside>
        </div>
      </div>
    </div>
  );
}
