'use client';
import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useThemeStore } from '@/lib/store/useThemeStore';
import api from '@/utils/axiosInsatnce';
import CreditReviewHeader from '@/components/crm/credit-approval/CreditReviewHeader';
import CreditChecklist from '@/components/crm/credit-approval/CreditChecklist';
import CreditSummary from '@/components/crm/credit-approval/CreditSummary';
import CustomerInfoCard from '@/components/crm/gold-evaluation/CustomerInfoCard';
import { DangerButton, GhostButton, PrimaryButton } from '@/components/crm/ui/FormControls';
import { formatCurrency } from '@/lib/utils/format';
import { BadgeCheck, Banknote, CircleDollarSign, Scale } from 'lucide-react';

const keys = ['kycChecked', 'goldEvaluationChecked', 'eligibilityChecked', 'offerChecked', 'bankDetailsChecked'];
const blankChecks = Object.fromEntries(keys.map((key) => [key, false]));
const labels = { AWAITING_REVIEW: 'Awaiting Review', APPROVED: 'Approved', REJECTED: 'Rejected', NEEDS_REVIEW: 'Needs Review' };
const when = (value) => value ? new Date(value).toLocaleString('en-IN') : '—';

function ProtectedImage({ path, alt }) {
  const [src, setSrc] = useState(null);
  const [isImage, setIsImage] = useState(true);
  useEffect(() => {
    let url;
    let active = true;
    api.get(path, { responseType: 'blob' }).then((data) => { if (active) { url = URL.createObjectURL(data); setIsImage(data.type.startsWith('image/')); setSrc(url); } }).catch(() => {});
    return () => { active = false; if (url) URL.revokeObjectURL(url); };
  }, [path]);
  return src ? <a href={src} target="_blank" rel="noreferrer" className="cursor-pointer text-xs text-gold-600 underline">{isImage ? <img src={src} alt={alt} className="h-20 w-20 rounded-lg border border-gold-200 object-cover" /> : `View ${alt}`}</a> : <span className="text-xs text-gray-500">Loading document...</span>;
}

function DetailField({ label, value, isDark, highlight = false }) {
  return <div className={`min-w-0 rounded-lg border p-3 ${highlight ? 'border-gold-500 bg-gold-600 text-white' : isDark ? 'border-gold-700/40 bg-gray-900/30 text-gray-100' : 'border-gold-200 bg-gold-50/40 text-gray-900'}`}>
    <p className={`text-xs ${highlight ? 'text-gold-50' : isDark ? 'text-gray-400' : 'text-gray-600'}`}>{label}</p>
    <p className="mt-1 break-words text-sm font-semibold">{value ?? '—'}</p>
  </div>;
}

function ReviewDetails({ evaluation, offer, isDark, card, heading, muted, edit }) {
  const items = evaluation?.items || [];
  return <>

    <section className={card}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className={heading}><Scale className="h-5 w-5" />Gold Evaluation</h2>
        {edit('gold-evaluation', 'View Evaluation')}
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <DetailField label="Evaluation Status" value={evaluation?.status || '—'} isDark={isDark} />
        <DetailField label="Finalised On" value={when(evaluation?.finalizedAt)} isDark={isDark} />
        <DetailField label="Loan to Value" value={evaluation?.ltvPercentage != null ? `${evaluation.ltvPercentage}%` : '—'} isDark={isDark} />
        <DetailField label="Gold Valuation" value={formatCurrency(evaluation?.totalValuation || 0)} isDark={isDark} />
        <DetailField label="Eligible Loan Amount" value={formatCurrency(evaluation?.eligibleAmount || 0)} isDark={isDark} highlight />
      </div>
      <div className={`mt-5 border-t pt-4 ${isDark ? 'border-gray-700' : 'border-gold-200'}`}>
        <h3 className={`mb-3 flex items-center gap-2 text-sm font-semibold ${muted}`}>Gold Items ({items.length})</h3>
        {items.length === 0 ? <p className={`text-sm ${muted}`}>No gold items available.</p> :
          <div className="space-y-3">
            {items.map((item, index) => <article key={item.id ?? index} className={`rounded-lg border p-4 ${isDark ? 'border-gold-700/40 bg-gray-900/30' : 'border-gold-200 bg-gold-50/40'}`}>
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <h4 className="text-sm font-semibold">{item.itemType || 'Gold Item'} #{index + 1}</h4>
                <span className={`text-xs ${muted}`}>{item.quantity ?? '—'} item(s) · {item.purity || '—'}</span>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
                <DetailField label="Gross Weight" value={item.grossWeight != null ? `${item.grossWeight} g` : '—'} isDark={isDark} />
                <DetailField label="Deduction" value={item.deductionWeight != null ? `${item.deductionWeight} g` : '—'} isDark={isDark} />
                <DetailField label="Net Weight" value={item.netWeight != null ? `${item.netWeight} g` : '—'} isDark={isDark} />
                <DetailField label="Rate / g" value={formatCurrency(item.rateUsed || 0)} isDark={isDark} />
                <DetailField label="Item Value" value={formatCurrency(item.valuation || 0)} isDark={isDark} />
              </div>
              {item.images?.length > 0 && <div className="mt-3 flex flex-wrap gap-2">{item.images.map((img) => <ProtectedImage key={img.id} path={`/crm/applications/evaluation/image/${img.id}`} alt={`${item.itemType || 'Gold item'} photo`} />)}</div>}
            </article>)}
          </div>}
      </div>
    </section>

    <section className={card}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className={heading}><CircleDollarSign className="h-5 w-5" />Loan Offer and Acceptance</h2>
        {edit('loan-offer', 'View Offer')}
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <DetailField label="Offer Version" value={offer?.version ?? '—'} isDark={isDark} />
        <DetailField label="Decision" value={offer?.decision ? offer.decision.replaceAll('_', ' ') : '—'} isDark={isDark} />
        <DetailField label="Principal" value={formatCurrency(offer?.offeredAmount || 0)} isDark={isDark} />
        <DetailField label="Net Payout" value={formatCurrency(offer?.netDisbursementAmount || 0)} isDark={isDark} highlight />
        <DetailField label="Interest Rate" value={offer?.interestRate != null ? `${offer.interestRate}% ${offer.interestRatePeriod?.toLowerCase() || ''}` : '—'} isDark={isDark} />
        <DetailField label="Tenure" value={offer?.tenureValue != null ? `${offer.tenureValue} ${offer.tenureUnit?.toLowerCase() || ''}` : '—'} isDark={isDark} />
        <DetailField label="Repayment Mode" value={offer?.repaymentMode?.replaceAll('_', ' ') || '—'} isDark={isDark} />
        <DetailField label="Processing Fee" value={formatCurrency(offer?.processingFeeAmount || 0)} isDark={isDark} />
        <DetailField label="Accepted On" value={when(offer?.decisionAt)} isDark={isDark} />
        <DetailField label="Acceptance Method" value={offer?.acceptanceMethod?.replaceAll('_', ' ') || '—'} isDark={isDark} />
      </div>
      {offer?.charges?.length > 0 && <div className={`mt-5 border-t pt-4 ${isDark ? 'border-gray-700' : 'border-gold-200'}`}>
        <h3 className={`mb-3 flex items-center gap-2 text-sm font-semibold ${muted}`}><Banknote className="h-4 w-4" />Other Charges</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          {offer.charges.map((charge, index) => <div key={charge.id ?? index} className={`flex flex-wrap items-center justify-between gap-2 rounded-lg border p-3 text-sm ${isDark ? 'border-gold-700/40 bg-gray-900/30' : 'border-gold-200 bg-gold-50/40'}`}>
            <span className="font-medium">{charge.name}</span>
            <span className="font-semibold">{formatCurrency(charge.amount)}</span>
            {charge.deductedUpfront && <span className="w-full text-xs text-amber-500">Deducted upfront</span>}
          </div>)}
        </div>
      </div>}
    </section>
  </>;
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
  const load = useCallback(async () => {
    setLoading(true);
    try {
      const result = (await api.get(`/crm/applications/credit-review/${id}`)).data;
      setData(result);
      setChecks(result.currentReview && !result.reviewValid ? { ...blankChecks } : Object.fromEntries(keys.map((key) => [key, !!result.currentReview?.[key]])));
      setRemark(result.currentReview && !result.reviewValid ? '' : result.currentReview?.remark || '');
    } catch (error) { toast.error(error.response?.data?.message || 'Could not load credit review.'); }
    finally { setLoading(false); }
  }, [id]);
  useEffect(() => { if (id) load(); }, [id, load]);
  const review = data?.currentReview;
  const decided = review && data.reviewValid && review.decision !== 'AWAITING_REVIEW';
  const canReview = data?.kyc?.isVerified && data?.evaluation?.status === 'FINALIZED' && data?.offer?.decision === 'ACCEPTED';
  const allChecked = keys.every((key) => checks[key]);
  const customer = data?.kyc?.details || {};
  const currentAddress = customer.currentAddress;
  const address = currentAddress && [currentAddress.houseNo, currentAddress.address, currentAddress.city, currentAddress.state, currentAddress.pinCode].filter(Boolean).join(', ');
  const app = data?.application;
  const evaluation = data?.evaluation;
  const offer = data?.offer;
  const display = data && { id: app.applicationNo, status: app.status, customer: { name: app.name, mobile: app.mobile, email: app.email }, gold: { totals: { goldValue: evaluation?.totalValuation, eligibleAmount: evaluation?.eligibleAmount }, items: evaluation?.items }, loan: { offeredAmount: offer?.offeredAmount, rate: offer?.interestRate, ratePeriod: offer?.interestRatePeriod, tenure: offer?.tenureValue, tenureUnit: offer?.tenureUnit, repaymentType: offer?.repaymentMode } };
  const card = `min-w-0 rounded-xl border-2 p-5 shadow-lg ${isDark ? 'border-gold-700/50 bg-gray-800 text-gray-100 shadow-gold-900/20' : 'border-gold-200 bg-white text-gray-900 shadow-gold-500/10'}`;
  const heading = `flex items-center gap-2 text-lg font-semibold ${isDark ? 'text-gold-400' : 'text-gold-600'}`;
  const muted = isDark ? 'text-gray-300' : 'text-gray-600';
  const edit = (path, label) => <Link href={`/crm/${path}/${id}`} className={`inline-flex cursor-pointer items-center rounded-lg border px-3 py-2 text-sm font-semibold transition-colors ${isDark ? 'border-gold-600/40 bg-gold-600/10 text-gold-300 hover:bg-gold-600/20' : 'border-gold-200 bg-gold-50 text-gold-700 hover:bg-gold-100'}`}>{label}</Link>;
  async function saveDraft() {
    setBusy(true);
    try {
      const result = (await api.put(`/crm/applications/credit-review/${id}`, { ...checks, remark, expectedReviewId: review?.id ?? null })).data;
      setData((old) => ({ ...old, currentReview: result, reviewValid: true, previousReviews: old.currentReview && old.currentReview.id !== result.id ? [old.currentReview, ...old.previousReviews] : old.previousReviews }));
      toast.success('Review draft saved');
      return result;
    } catch (error) { toast.error(error.response?.data?.message || 'Could not save review.'); return null; }
    finally { setBusy(false); }
  }
  async function decide(decision) {
    if (decision === 'APPROVED' && !allChecked) { toast.error('Complete all checklist items first.'); return; }
    if (decision !== 'APPROVED' && !remark.trim()) { toast.error('Enter a reason or correction note.'); return; }
    setBusy(true);
    try {
      let current = review;
      if (!current || keys.some((key) => current[key] !== checks[key]) || current.remark !== remark.trim()) {
        current = (await api.put(`/crm/applications/credit-review/${id}`, { ...checks, remark, expectedReviewId: review?.id ?? null })).data;
      }
      await api.post(`/crm/credit-reviews/decision/${current.id}`, { decision, remark });
      toast.success(`Credit review ${labels[decision].toLowerCase()}. Application remains in Credit Approval.`);
      router.push('/crm/credit-approval');
    } catch (error) { toast.error(error.response?.data?.message || 'Could not save decision.'); load(); }
    finally { setBusy(false); }
  }
  if (loading) return <div role="status" className={`flex min-h-screen items-center justify-center ${isDark ? 'bg-gray-900 text-gray-300' : 'bg-gold-50/30 text-gray-600'}`}><div className="text-center"><div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-gold-500" /><p className="mt-4">Loading credit review...</p></div></div>;
  if (!data) return <div className={`min-h-screen p-4 md:p-6 ${isDark ? 'bg-gray-900 text-gray-100' : 'bg-gold-50/30 text-gray-900'}`}><div className={card}><p>Application not found.</p><Link href="/crm/credit-approval" className="mt-3 inline-flex cursor-pointer rounded-lg bg-gold-600 px-4 py-2 text-sm font-semibold text-white">Go back</Link></div></div>;
  return <div className={`min-h-screen w-full min-w-0 max-w-full overflow-x-hidden transition-colors duration-300 ${isDark ? 'bg-gray-900 text-gray-100' : 'bg-gold-50/30 text-gray-900'}`}><div className="mx-auto space-y-6 p-4 md:p-6">
    <CreditReviewHeader application={display} onBack={() => router.push('/crm/credit-approval')} isDark={isDark} />
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <CustomerInfoCard customerDetails={{ ...customer, address, id: app.applicationNo, name: app.name, mobile: app.mobile, email: app.email, kycVerified: data.kyc?.isVerified, kycDate: when(data.kyc?.verifiedAt), documents: Object.fromEntries((data.kyc?.documents || []).map((doc) => [doc.documentType, true])) }} isDark={isDark} defaultShowKyc applicationId={id} kycHref={`/crm/kyc/${id}`} />
        <ReviewDetails evaluation={evaluation} offer={offer} isDark={isDark} card={card} heading={heading} muted={muted} edit={edit} />
        <CreditChecklist checks={checks} setChecks={setChecks} isDark={isDark} disabled={decided || busy || !canReview} />
      </div>
      <aside className="min-w-0 space-y-6">
        <CreditSummary application={display} isDark={isDark} />
        <section className={card}>
          <h2 className={`${heading} mb-4`}><BadgeCheck className="h-5 w-5" />Decision</h2>
          <DetailField label="Current Review" value={review && !data.reviewValid ? 'Review expired; start a fresh review' : labels[review?.decision] || 'Awaiting Review'} isDark={isDark} />
          {!canReview && <p className="mt-3 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-500">Verify KYC, finalise the assessment and accept the current offer before reviewing.</p>}
          <label className={`mt-4 block text-sm font-medium ${muted}`} htmlFor="credit-review-remark">Remark / correction note</label>
          <textarea id="credit-review-remark" value={remark} onChange={(event) => setRemark(event.target.value)} disabled={decided || busy || !canReview} rows={4} className={`mt-2 w-full rounded border-2 p-3 text-sm outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 disabled:cursor-not-allowed disabled:opacity-60 ${isDark ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-gray-50 text-gray-900'}`} placeholder="Required for Rejected or Needs Review" />
          {decided ? <p className={`mt-3 text-sm ${muted}`}>Decided {when(review.decidedAt)}. Move the application from the table status.</p> :
            <div className={`mt-4 space-y-3 border-t pt-4 ${isDark ? 'border-gray-700' : 'border-gold-200'}`}>
              <PrimaryButton onClick={saveDraft} disabled={busy || !canReview} className="w-full cursor-pointer">Save Review Draft</PrimaryButton>
              <div className="grid gap-2 sm:grid-cols-3 xl:grid-cols-1 2xl:grid-cols-3">
                <GhostButton onClick={() => decide('NEEDS_REVIEW')} disabled={busy || !canReview} className="min-w-0 cursor-pointer">Needs Review</GhostButton>
                <DangerButton onClick={() => decide('REJECTED')} disabled={busy || !canReview} className="min-w-0 cursor-pointer">Reject</DangerButton>
                <PrimaryButton onClick={() => decide('APPROVED')} disabled={busy || !canReview || !allChecked} className="min-w-0 cursor-pointer">Approve</PrimaryButton>
              </div>
            </div>}
        </section>
        {data.previousReviews.length > 0 && <section className={card}>
          <h2 className={`${heading} mb-4`}>Earlier Reviews</h2>
          <div className="space-y-2">
            {data.previousReviews.map((item) => <div key={item.id} className={`rounded-lg border p-3 text-sm ${isDark ? 'border-gold-700/40 bg-gray-900/30' : 'border-gold-200 bg-gold-50/40'}`}>
              <p className="font-semibold">{labels[item.decision] || item.decision}</p>
              <p className={`mt-1 text-xs ${muted}`}>{when(item.decidedAt)}</p>
              {item.remark && <p className="mt-2 break-words">{item.remark}</p>}
            </div>)}
          </div>
        </section>}
      </aside>
    </div>
  </div></div>;
}
