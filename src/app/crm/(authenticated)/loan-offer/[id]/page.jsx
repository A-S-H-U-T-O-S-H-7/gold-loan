'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { ArrowLeft, ClipboardList, Coins, Download, FileText, History, MessageSquareText, Plus, Printer, Trash2, User } from 'lucide-react';
import toast from 'react-hot-toast';
import StatusBadge from '@/components/crm/ui/StatusBadge';
import { useThemeStore } from '@/lib/store/useThemeStore';
import { getApplicationOffer, saveApplicationOffer, recordOfferDecision } from '@/lib/services/loanOfferApplicationService';

const empty = { offeredAmount: '', interestRate: '', interestRatePeriod: 'ANNUAL', tenureValue: '', tenureUnit: 'MONTHS', repaymentMode: 'BULLET', processingFeeType: 'PERCENT', processingFeeValue: '0', charges: [], remark: '' };
const money = (value) => `₹${Number(value || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const label = (value) => ({ AWAITING_DECISION: 'Awaiting Decision', ACCEPTED: 'Accepted', DECLINED: 'Declined' })[value] || value;
const termsFrom = (offer) => offer ? {
  offeredAmount: String(offer.offeredAmount), interestRate: String(offer.interestRate), interestRatePeriod: offer.interestRatePeriod,
  tenureValue: String(offer.tenureValue), tenureUnit: offer.tenureUnit, repaymentMode: offer.repaymentMode,
  processingFeeType: offer.processingFeeType, processingFeeValue: String(offer.processingFeeValue),
  charges: offer.charges.map((item) => ({ name: item.name, amount: String(item.amount), deductedUpfront: item.deductedUpfront })), remark: offer.remark || '',
} : empty;

export default function LoanOfferDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const navigateBack = () => {
    if (window.history.length > 1) router.back();
    else router.push('/crm/loan-offer');
  };
  const isDark = useThemeStore((state) => state.theme) === 'dark';
  const [data, setData] = useState(null);
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [pdfBusy, setPdfBusy] = useState(false);
  const [error, setError] = useState('');
  const [decisionRemark, setDecisionRemark] = useState('');
  const [acceptanceMethod, setAcceptanceMethod] = useState('IN_PERSON');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const result = (await getApplicationOffer(id)).data;
      setData(result); setForm(termsFrom(result.currentOffer)); setError('');
    } catch (requestError) { setError(requestError.response?.data?.message || 'Could not load the offer.'); }
    finally { setLoading(false); }
  }, [id]);
  useEffect(() => { if (id) load(); }, [id, load]);

  const current = data?.currentOffer;
  const eligible = Number(data?.evaluation?.eligibleAmount || 0);
  const dirty = current && JSON.stringify(form) !== JSON.stringify(termsFrom(current));
  const principal = Number(form.offeredAmount || 0);
  const fee = form.processingFeeType === 'PERCENT' ? principal * Number(form.processingFeeValue || 0) / 100 : Number(form.processingFeeValue || 0);
  const upfrontCharges = form.charges.reduce((sum, charge) => sum + (charge.deductedUpfront ? Number(charge.amount || 0) : 0), 0);
  const deductions = fee + upfrontCharges;
  const canEdit = data?.application?.status === 'LOAN_OFFER';
  const canDecide = canEdit && current?.decision === 'AWAITING_DECISION' && !dirty;
  const card = `min-w-0 overflow-hidden rounded-xl border-2 p-5 shadow-lg ${isDark ? 'border-gold-700/50 bg-gray-800 shadow-gold-900/20' : 'border-gold-200 bg-white shadow-gold-500/10'}`;
  const input = `w-full rounded border-2 px-3 py-2 text-sm outline-none transition-colors focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 disabled:cursor-not-allowed disabled:opacity-60 ${isDark ? 'border-gray-600 bg-gray-700 text-white hover:border-gold-500' : 'border-gray-300 bg-gray-50 text-gray-900 hover:border-gold-400'}`;
  const heading = `flex items-center gap-2 text-lg font-semibold ${isDark ? 'text-gold-400' : 'text-gold-600'}`;
  const muted = isDark ? 'text-gray-300' : 'text-gray-600';
  const subCard = `rounded-lg border p-3 ${isDark ? 'border-gold-700/40 bg-gray-900/30' : 'border-gold-200 bg-gold-50/40'}`;
  const title = (name, required = false) => <span className={`mb-1 block text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>{name} {required && <span className="text-red-500">*</span>}</span>;
  const set = (key, value) => setForm((previous) => ({ ...previous, [key]: value }));
  const updateCharge = (index, key, value) => setForm((previous) => ({ ...previous, charges: previous.charges.map((charge, position) => position === index ? { ...charge, [key]: value } : charge) }));

  async function save(event) {
    event.preventDefault();
    if (principal > eligible) { setError('Offered amount cannot exceed eligibility.'); return; }
    setBusy(true); setError('');
    try {
      await saveApplicationOffer(id, { ...form, expectedOfferId: current?.id ?? null });
      await load();
      toast.success(current?.decision === 'ACCEPTED' || current?.decision === 'DECLINED' ? 'Revised offer saved. Record a fresh decision.' : 'Offer saved');
    } catch (requestError) { setError(requestError.response?.data?.message || 'Could not save offer.'); }
    finally { setBusy(false); }
  }

  async function decide(decision) {
    if (!canDecide) return;
    if (decision === 'DECLINED' && !decisionRemark.trim()) { setError('A decline reason is required.'); return; }
    setBusy(true); setError('');
    try {
      await recordOfferDecision(current.id, { decision, acceptanceMethod: decision === 'ACCEPTED' ? acceptanceMethod : undefined, decisionRemark });
      await load(); setDecisionRemark(''); toast.success(`Offer ${decision.toLowerCase()}`);
    } catch (requestError) { setError(requestError.response?.data?.message || 'Could not record the decision.'); }
    finally { setBusy(false); }
  }

  async function generatePdf(mode) {
    if (!current || dirty || busy || pdfBusy) return;
    const printWindow = mode === 'print' ? window.open('', '_blank') : null;
    if (printWindow) {
      printWindow.document.title = 'Preparing loan offer PDF';
      printWindow.document.body.textContent = 'Preparing the printable loan offer...';
    }
    setPdfBusy(true);
    try {
      const latest = (await getApplicationOffer(id)).data;
      if (!latest.currentOffer || latest.currentOffer.id !== current.id || latest.currentOffer.updatedAt !== current.updatedAt) {
        await load();
        throw new Error('Offer changed. Review the latest saved version before printing.');
      }
      const [{ pdf }, { default: LoanOfferPdf }] = await Promise.all([
        import('@react-pdf/renderer'),
        import('@/components/crm/loan-offer/LoanOfferPdf'),
      ]);
      const blob = await pdf(<LoanOfferPdf application={latest.application} offer={latest.currentOffer} />).toBlob();
      const url = URL.createObjectURL(blob);
      if (printWindow) {
        printWindow.location.replace(url);
        window.setTimeout(() => URL.revokeObjectURL(url), 15 * 60 * 1000);
      } else {
        const link = document.createElement('a');
        link.href = url;
        link.download = `Gold-Loan-Offer-${latest.application.applicationNo}-v${latest.currentOffer.version}.pdf`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.setTimeout(() => URL.revokeObjectURL(url), 60 * 1000);
        if (mode === 'print') toast('Pop-up blocked. The PDF was downloaded so you can print it.');
      }
    } catch (pdfError) {
      if (printWindow && !printWindow.closed) printWindow.close();
      toast.error(pdfError.response?.data?.message || pdfError.message || 'Could not create the offer PDF.');
    } finally {
      setPdfBusy(false);
    }
  }

  if (loading && !data) return <div role="status" className={`flex min-h-screen items-center justify-center ${isDark ? 'bg-gray-900 text-gray-300' : 'bg-gold-50/30 text-gray-600'}`}><div className="text-center"><div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-gold-500" /><p className="mt-4">Loading loan offer...</p></div></div>;
  if (!data) return <div className={`min-h-screen p-4 md:p-6 ${isDark ? 'bg-gray-900 text-white' : 'bg-gold-50/30 text-gray-900'}`}><div className={card}><h1 className={heading}>Loan Offer</h1><p role="alert" className="mt-2 text-sm text-red-500">{error || 'Loan offer could not be loaded.'}</p><button type="button" onClick={navigateBack} className="mt-4 cursor-pointer rounded-lg bg-gold-600 px-4 py-2 text-sm font-semibold text-white">Back</button></div></div>;

  return <div className={`min-h-screen w-full min-w-0 max-w-full overflow-x-hidden transition-colors duration-300 ${isDark ? 'bg-gray-900 text-gray-100' : 'bg-gold-50/30 text-gray-900'}`}>
    <div className="space-y-6 p-4 md:p-6">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex min-w-0 items-center gap-4">
          <button type="button" onClick={navigateBack} aria-label="Back to previous page" className={`shrink-0 cursor-pointer rounded-xl border p-2 transition-all duration-200 hover:scale-105 ${isDark ? 'border-gold-600/30 bg-gray-800/50 hover:bg-gray-800' : 'border-gold-200 bg-gold-50/50 hover:bg-gold-50'}`}>
            <ArrowLeft className={`h-4 w-4 ${isDark ? 'text-gold-400' : 'text-gold-600'}`} />
          </button>
          <h1 className="min-w-0 text-xl font-bold md:text-2xl">Loan Offer - {data.application.name || data.application.applicationNo}</h1>
        </div>
        <div className={`flex flex-wrap items-center gap-3 rounded-xl border px-4 py-2 ${isDark ? 'border-gold-700/30 bg-gray-800/50' : 'border-gold-200 bg-white'}`}>
          <span className={`text-sm font-medium ${muted}`}>Status:</span>
          <StatusBadge status={data.application.status} />
          {current && <span className={`text-sm font-semibold ${current.decision === 'ACCEPTED' ? 'text-emerald-500' : current.decision === 'DECLINED' ? 'text-red-500' : 'text-amber-500'}`}>{label(current.decision)}</span>}
        </div>
      </header>

      {error && <p role="alert" className={`rounded-lg border p-3 text-sm ${isDark ? 'border-red-800 bg-red-950/40 text-red-300' : 'border-red-300 bg-red-50 text-red-700'}`}>{error}</p>}
      {data.correctionNote && <p className={`rounded-lg border p-3 text-sm ${isDark ? 'border-amber-700 bg-amber-950/30 text-amber-200' : 'border-amber-300 bg-amber-50 text-amber-900'}`}><strong>Manager correction note:</strong> {data.correctionNote}</p>}

      <section className={card}>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className={heading}><User className="h-5 w-5" />Customer Information</h2>
          <div className="flex flex-wrap gap-2">
            <Link href={`/crm/gold-evaluation/${id}`} className={`inline-flex cursor-pointer items-center rounded-lg border px-3 py-2 text-sm font-semibold transition-colors ${isDark ? 'border-purple-500/40 bg-purple-500/10 text-purple-300 hover:bg-purple-500/20' : 'border-purple-200 bg-purple-50 text-purple-700 hover:bg-purple-100'}`}>View Evaluation</Link>
            <Link href={`/crm/kyc/${id}`} className={`inline-flex cursor-pointer items-center rounded-lg border px-3 py-2 text-sm font-semibold transition-colors ${isDark ? 'border-gold-600/40 bg-gold-600/10 text-gold-300 hover:bg-gold-600/20' : 'border-gold-200 bg-gold-50 text-gold-700 hover:bg-gold-100'}`}>View KYC</Link>
          </div>
        </div>
        <div className="grid gap-x-6 gap-y-4 text-sm sm:grid-cols-2 lg:grid-cols-4">
          <p><span className={`block text-xs ${muted}`}>Application No.</span><strong>{data.application.applicationNo || '—'}</strong></p>
          <p><span className={`block text-xs ${muted}`}>Customer</span><strong>{data.application.name || '—'}</strong></p>
          <p><span className={`block text-xs ${muted}`}>Mobile</span><strong>{data.application.mobile || '—'}</strong></p>
          <p><span className={`block text-xs ${muted}`}>Branch</span><strong>{data.application.branchName || 'Unassigned'}</strong></p>
        </div>
      </section>

      <section className={card}>
        <h2 className={`${heading} mb-4`}><Coins className="h-5 w-5" />Gold Evaluation</h2>
        <div className="grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
          <p className={subCard}><span className={`block text-xs ${muted}`}>Status</span><strong>{data.evaluation?.status || 'Missing'}</strong></p>
          <p className={subCard}><span className={`block text-xs ${muted}`}>Net Weight</span><strong>{data.evaluation?.totalNetWeight ?? '—'} g</strong></p>
          <p className={subCard}><span className={`block text-xs ${muted}`}>Gold Valuation</span><strong>{money(data.evaluation?.totalValuation)}</strong></p>
          <p className="rounded-lg bg-gold-600 p-3 text-white"><span className="block text-xs text-gold-50">Eligible Loan Amount</span><strong className="text-lg">{money(eligible)}</strong></p>
        </div>
        {data.evaluation?.items?.length > 0 && <p className={`mt-4 text-sm ${muted}`}>{data.evaluation.items.map((item) => `${item.itemType || 'Gold'} · ${item.purity || '-'} · ${item.netWeight ?? '-'}g`).join(' | ')}</p>}
      </section>

      <form onSubmit={save} className={`${card} space-y-5`}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className={heading}><FileText className="h-5 w-5" />Offer Terms</h2>
          <div className="flex flex-wrap items-center gap-2">
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${isDark ? 'bg-gold-700/30 text-gold-300' : 'bg-gold-100 text-gold-700'}`}>{current ? `Version ${current.version} · ${label(current.decision)}` : 'New offer'}</span>
            <button type="button" disabled={!current || dirty || busy || pdfBusy} onClick={() => generatePdf('download')} className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-gold-500 px-3 py-2 text-xs font-semibold text-gold-700 hover:bg-gold-50 disabled:cursor-not-allowed disabled:opacity-50"><Download className="h-4 w-4" />Download PDF</button>
            <button type="button" disabled={!current || dirty || busy || pdfBusy} onClick={() => generatePdf('print')} className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-gold-600 px-3 py-2 text-xs font-semibold text-white hover:bg-gold-700 disabled:cursor-not-allowed disabled:opacity-50"><Printer className="h-4 w-4" />{pdfBusy ? 'Preparing PDF...' : 'Print PDF'}</button>
          </div>
        </div>
        <p className={`text-xs ${muted}`}>Save the offer first, then open the PDF and use the browser Print control for the customer to sign. Printing does not record acceptance or decline.</p>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <label>{title('Eligible Amount')}<input className={input} value={money(eligible)} readOnly /></label>
          <label>{title('Offered Loan Amount', true)}<input className={input} type="number" min="0.01" step="0.01" max={eligible} required disabled={!canEdit || busy} value={form.offeredAmount} onChange={(event) => set('offeredAmount', event.target.value)} /></label>
          <label>{title('Interest Rate (%)', true)}<input className={input} type="number" min="0" max="100" step="0.01" required disabled={!canEdit || busy} value={form.interestRate} onChange={(event) => set('interestRate', event.target.value)} /></label>
          <label>{title('Interest Rate Period', true)}<select className={input} disabled={!canEdit || busy} value={form.interestRatePeriod} onChange={(event) => set('interestRatePeriod', event.target.value)}><option value="ANNUAL">Annual</option><option value="MONTHLY">Monthly</option></select></label>
          <label>{title('Tenure', true)}<input className={input} type="number" min="1" max="600" step="1" required disabled={!canEdit || busy} value={form.tenureValue} onChange={(event) => set('tenureValue', event.target.value)} /></label>
          <label>{title('Tenure Unit', true)}<select className={input} disabled={!canEdit || busy} value={form.tenureUnit} onChange={(event) => set('tenureUnit', event.target.value)}><option value="MONTHS">Months</option><option value="YEARS">Years</option></select></label>
          <label>{title('Repayment Mode', true)}<select className={input} disabled={!canEdit || busy} value={form.repaymentMode} onChange={(event) => set('repaymentMode', event.target.value)}><option value="BULLET">Bullet</option><option value="MONTHLY_INTEREST">Monthly Interest</option><option value="EMI">EMI</option></select></label>
          <label>{title('Processing Fee Type', true)}<select className={input} disabled={!canEdit || busy} value={form.processingFeeType} onChange={(event) => set('processingFeeType', event.target.value)}><option value="PERCENT">Percentage</option><option value="FIXED">Fixed amount</option></select></label>
          <label>{title(`Processing Fee ${form.processingFeeType === 'PERCENT' ? '(%)' : '(₹)'}`, true)}<input className={input} type="number" min="0" max={form.processingFeeType === 'PERCENT' ? 100 : undefined} step="0.01" required disabled={!canEdit || busy} value={form.processingFeeValue} onChange={(event) => set('processingFeeValue', event.target.value)} /></label>
        </div>

        <div>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h3 className={`flex items-center gap-2 font-semibold ${isDark ? 'text-gold-400' : 'text-gold-600'}`}><ClipboardList className="h-4 w-4" />Other Charges</h3>
            <button type="button" disabled={!canEdit || busy || form.charges.length >= 20} onClick={() => set('charges', [...form.charges, { name: '', amount: '', deductedUpfront: true }])} className="inline-flex cursor-pointer items-center gap-1 rounded-lg bg-gold-600 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-gold-700 disabled:cursor-not-allowed disabled:opacity-50"><Plus className="h-4 w-4" />Add Charge</button>
          </div>
          {form.charges.length === 0 && <p className={`rounded-lg border border-dashed p-4 text-sm ${isDark ? 'border-gray-600 text-gray-400' : 'border-gold-200 text-gray-500'}`}>No additional charges added.</p>}
          <div className="space-y-3">
            {form.charges.map((charge, index) => <div key={index} className={`${subCard} grid gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_160px_180px_auto] lg:items-end`}>
              <label>{title('Charge Name', true)}<input placeholder="Charge name" required disabled={!canEdit || busy} maxLength={100} className={input} value={charge.name} onChange={(event) => updateCharge(index, 'name', event.target.value)} /></label>
              <label>{title('Amount (₹)', true)}<input placeholder="Amount ₹" required type="number" min="0.01" step="0.01" disabled={!canEdit || busy} className={input} value={charge.amount} onChange={(event) => updateCharge(index, 'amount', event.target.value)} /></label>
              <label className="flex min-h-10 items-center gap-2 text-sm"><input type="checkbox" disabled={!canEdit || busy} checked={charge.deductedUpfront} onChange={(event) => updateCharge(index, 'deductedUpfront', event.target.checked)} className="accent-gold-600" />Deduct upfront</label>
              <button type="button" aria-label={`Remove charge ${index + 1}`} disabled={!canEdit || busy} onClick={() => set('charges', form.charges.filter((_, position) => position !== index))} className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-red-400/40 text-red-500 hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"><Trash2 className="h-4 w-4" /></button>
            </div>)}
          </div>
        </div>

        <label className="block">{title('Remark')}<textarea className={input} rows={3} maxLength={1000} disabled={!canEdit || busy} value={form.remark} onChange={(event) => set('remark', event.target.value)} /></label>
        <div className="grid gap-3 sm:grid-cols-3">
          <p className={subCard}><span className={`block text-xs ${muted}`}>Loan Principal</span><strong className="text-lg">{money(principal)}</strong></p>
          <p className={subCard}><span className={`block text-xs ${muted}`}>Upfront Deductions</span><strong className="text-lg">{money(deductions)}</strong></p>
          <p className="rounded-lg bg-gold-600 p-3 text-white"><span className="block text-xs text-gold-50">Net Payout</span><strong className="text-lg">{money(principal - deductions)}</strong></p>
        </div>
        <p className={`text-sm ${muted}`}>Processing fee: {money(fee)}. Charges not marked “Deduct upfront” are not subtracted from the payout.</p>
        <div className={`flex justify-end border-t pt-4 ${isDark ? 'border-gray-700' : 'border-gold-200'}`}>
          <button type="submit" disabled={!canEdit || busy || (current && !dirty)} className="cursor-pointer rounded-lg bg-gold-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-gold-700 disabled:cursor-not-allowed disabled:opacity-50">{busy ? 'Saving...' : current && current.decision !== 'AWAITING_DECISION' ? 'Save Revised Offer' : 'Save Offer'}</button>
        </div>
      </form>

      <section className={`${card} space-y-4`}>
        <h2 className={heading}><MessageSquareText className="h-5 w-5" />Customer Decision</h2>
        <p className={`text-sm ${muted}`}>Decision applies to offer version {current?.version ?? '—'}. Saving revised terms requires a fresh decision.</p>
        {dirty && <p className="text-sm text-amber-500">Save the changed terms before recording a decision.</p>}
        <div className="grid gap-4 md:grid-cols-2">
          <label>{title('Acceptance Method', true)}<select className={input} disabled={!canDecide || busy} value={acceptanceMethod} onChange={(event) => setAcceptanceMethod(event.target.value)}><option value="IN_PERSON">In person</option><option value="DIGITAL">Digital</option><option value="OTHER">Other</option></select></label>
          <label>{title('Decision Note / Decline Reason')}<textarea className={input} rows={2} maxLength={1000} disabled={!canDecide || busy} value={decisionRemark} onChange={(event) => setDecisionRemark(event.target.value)} /><span className={`text-xs ${muted}`}>Decline reason <span className="text-red-500">*</span> when selecting Declined.</span></label>
        </div>
        <div className={`flex flex-wrap gap-3 border-t pt-4 ${isDark ? 'border-gray-700' : 'border-gold-200'}`}>
          <button type="button" disabled={!canDecide || busy} onClick={() => decide('ACCEPTED')} className="cursor-pointer rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50">Accepted</button>
          <button type="button" disabled={!canDecide || busy} onClick={() => decide('DECLINED')} className="cursor-pointer rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50">Declined</button>
        </div>
        {current?.decision !== 'AWAITING_DECISION' && current && <p className={`${subCard} text-sm`}>Recorded: <strong>{label(current.decision)}</strong> · {current.decisionRemark || 'No note'} · {new Date(current.decisionAt).toLocaleString('en-IN')}</p>}
      </section>

      {data.previousOffers.length > 0 && <section className={card}>
        <h2 className={`${heading} mb-4`}><History className="h-5 w-5" />Previous Offers</h2>
        <div className="space-y-2">
          {data.previousOffers.map((offer) => <div key={offer.id} className={`${subCard} flex flex-wrap items-center justify-between gap-2 text-sm`}>
            <span><strong>Version {offer.version}</strong> · {money(offer.offeredAmount)} · {label(offer.decision)}</span>
            <span className={muted}>{new Date(offer.createdAt).toLocaleString('en-IN')}</span>
            {offer.decisionRemark && <span className="w-full">{offer.decisionRemark}</span>}
          </div>)}
        </div>
      </section>}
    </div>
  </div>;
}
