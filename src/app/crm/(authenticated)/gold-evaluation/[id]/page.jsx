'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Check, ClipboardList, Coins, MessageSquareText, Plus, RefreshCw, User } from 'lucide-react';
import toast from 'react-hot-toast';
import { useThemeStore } from '@/lib/store/useThemeStore';
import { finalizeEvaluation, getEvaluation, refreshEvaluationRates, saveEvaluationDraft, uploadGoldItemImage } from '@/lib/services/goldEvaluationService';
import EvaluationItemCard from '@/components/crm/gold-evaluation/EvaluationItemCard';
import KYCVerificationButton from '@/components/crm/action-buttons/KYCVerificationButton';
import KycVerificationBadge from '@/components/crm/ui/KycVerificationBadge';
import StatusBadge from '@/components/crm/ui/StatusBadge';

const money = (value) => `₹${Number(value || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const blankItem = () => ({ clientKey: crypto.randomUUID(), itemType: '', quantity: '1', purity: '', grossWeight: '', deductionWeight: '0', rateUsed: '', description: '', images: [] });
const errorText = (error) => error.response?.data?.message || error.message || 'Request failed';
const rateEntries = (value) => {
  const source = value?.pricing?.rates || value?.rateCard?.rates || value?.rates || {};
  if (Array.isArray(source)) return source.map((entry) => [entry.purity, entry.ratePerGram ?? entry.rate]);
  return Object.entries(source);
};

export default function GoldEvaluationDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const navigateBack = () => {
    if (window.history.length > 1) router.back();
    else router.push('/crm/gold-evaluation');
  };
  const isDark = useThemeStore((state) => state.theme) === 'dark';
  const [record, setRecord] = useState(null);
  const [items, setItems] = useState([]);
  const [goldRate, setGoldRate] = useState('');
  const [ltvPercentage, setLtvPercentage] = useState('');
  const [remarks, setRemarks] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [busy, setBusy] = useState(false);
  const [dirty, setDirty] = useState(false);

  const applyRecord = (value) => {
    setRecord((current) => ({ ...value, todayRatesAvailable: value.todayRatesAvailable ?? current?.todayRatesAvailable, currentRateSettingId: value.currentRateSettingId !== undefined ? value.currentRateSettingId : current?.currentRateSettingId }));
    setItems((value.evaluation?.items || []).map((item) => ({ ...item, clientKey: String(item.id) })));
    const rates = Object.fromEntries(rateEntries(value));
    setGoldRate(value.evaluation?.goldRate ?? rates['24K'] ?? '');
    setLtvPercentage(value.evaluation?.ltvPercentage ?? value.pricing?.ltvPercentage ?? '');
    setRemarks(value.evaluation?.remarks ?? '');
    setDirty(false);
  };

  useEffect(() => {
    if (!id) return undefined;
    let active = true;
    setLoading(true);
    setLoadError('');
    getEvaluation(id).then((result) => { if (active) applyRecord(result); })
      .catch((error) => { if (active) setLoadError(errorText(error)); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [id]);

  const updateItem = (clientKey, value) => {
    const rates = Object.fromEntries(rateEntries(record));
    setItems((current) => current.map((item) => {
      if (item.clientKey !== clientKey) return item;
      const rateUsed = rates[value.purity] ?? (item.purity === value.purity ? value.rateUsed : '');
      return { ...value, rateUsed, clientKey };
    }));
    setDirty(true);
  };
  const uploadImage = async (item, file) => {
    if (!['image/png', 'image/jpeg'].includes(file.type) || file.size === 0 || file.size > 5 * 1024 * 1024) {
      toast.error('Choose a PNG or JPEG photo up to 5 MB');
      return;
    }
    setBusy(true);
    try {
      const fileKey = await uploadGoldItemImage(id, file);
      setItems((current) => current.map((candidate) => candidate.clientKey === item.clientKey
        ? { ...candidate, images: [...candidate.images, { fileKey }] } : candidate));
      setDirty(true);
      toast.success('Photo uploaded; save the draft to attach it to the item');
    } catch (error) {
      toast.error(errorText(error));
    } finally {
      setBusy(false);
    }
  };

  const saveDraft = async () => {
    const payload = {
      goldRate, ltvPercentage, remarks,
      items: items.map((item) => ({
        ...(Number.isSafeInteger(Number(item.id)) && Number(item.id) > 0 ? { id: item.id } : {}),
        itemType: item.itemType, quantity: item.quantity, purity: item.purity,
        grossWeight: item.grossWeight, deductionWeight: item.deductionWeight,
        rateUsed: item.rateUsed, description: item.description,
        images: item.images.map((image) => image.fileKey),
      })),
    };
    const result = await saveEvaluationDraft(id, payload);
    applyRecord(result);
    return result;
  };

  const run = async (action, success) => {
    setBusy(true);
    try {
      await action();
      toast.success(success);
    } catch (error) {
      toast.error(errorText(error));
    } finally {
      setBusy(false);
    }
  };

  const finalize = async () => {
    await run(async () => {
      if (!goldRate || !ltvPercentage || items.some((item) => !item.rateUsed)) {
        throw new Error('Backend gold rates and LTV are needed for every item.');
      }
      if (dirty || !record?.evaluation) await saveDraft();
      const result = await finalizeEvaluation(id);
      applyRecord(result);
    }, 'Gold evaluated. Application remains Evaluating.');
  };

  const refreshRates = async () => {
    await run(async () => {
      if (dirty) throw new Error('Save draft changes before refreshing rates.');
      const result = await refreshEvaluationRates(id);
      applyRecord({ ...result, todayRatesAvailable: true, currentRateSettingId: result.evaluation?.goldRateSettingId });
    }, 'Draft rates and valuation refreshed');
  };

  if (loading) return <div role="status" className={`flex min-h-screen items-center justify-center ${isDark ? 'bg-gray-900 text-gray-300' : 'bg-gold-50/30 text-gray-600'}`}><div className="text-center"><div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-gold-500" /><p className="mt-4">Loading evaluation...</p></div></div>;
  if (!record) return <div className={`min-h-screen p-4 md:p-6 ${isDark ? 'bg-gray-900 text-white' : 'bg-gold-50/30 text-gray-900'}`}>
    <div className={`max-w-xl rounded-xl border p-6 ${isDark ? 'border-gold-700 bg-gray-800' : 'border-gold-200 bg-white'}`}>
      <h1 className="text-xl font-semibold">Gold Evaluation</h1>
      <p role="alert" className="mt-2 text-sm text-red-600">{loadError || 'Evaluation could not be loaded.'}</p>
      <button type="button" onClick={navigateBack} className="mt-4 inline-flex cursor-pointer rounded-lg bg-gold-600 px-4 py-2 text-sm font-semibold text-white">Back</button>
    </div>
  </div>;
  const { application, evaluation } = record;
  const card = `min-w-0 overflow-hidden rounded-xl border-2 p-5 shadow-lg ${isDark ? 'border-gold-700/50 bg-gray-800 shadow-gold-900/20' : 'border-gold-200 bg-white shadow-gold-500/10'}`;
  const heading = `flex items-center gap-2 text-lg font-semibold ${isDark ? 'text-gold-400' : 'text-gold-600'}`;
  const muted = isDark ? 'text-gray-300' : 'text-gray-600';
  const field = `w-full rounded border-2 px-3 py-2 text-sm outline-none transition-colors focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 ${isDark ? 'border-gray-600 bg-gray-700 text-white hover:border-gold-500' : 'border-gray-300 bg-gray-50 text-gray-900 hover:border-gold-400'}`;
  const totalGross = dirty ? items.reduce((sum, item) => sum + Number(item.grossWeight || 0), 0) : Number(evaluation?.totalGrossWeight || 0);
  const totalDeduction = dirty ? items.reduce((sum, item) => sum + Number(item.deductionWeight || 0), 0) : Number(evaluation?.totalDeductionWeight || 0);
  const totalNet = dirty ? items.reduce((sum, item) => sum + Math.max(0, Number(item.grossWeight || 0) - Number(item.deductionWeight || 0)), 0) : Number(evaluation?.totalNetWeight || 0);
  const valuation = dirty ? items.reduce((sum, item) => sum + Math.max(0, Number(item.grossWeight || 0) - Number(item.deductionWeight || 0)) * Number(item.rateUsed || 0), 0) : Number(evaluation?.totalValuation || 0);
  const eligible = dirty ? valuation * Number(ltvPercentage || 0) / 100 : Number(evaluation?.eligibleAmount || 0);

  return <div className={`min-h-screen w-full min-w-0 max-w-full overflow-x-hidden transition-colors duration-300 ${isDark ? 'bg-gray-900 text-gray-100' : 'bg-gold-50/30 text-gray-900'}`}>
    <div className="space-y-6 p-4 md:p-6">
    <header className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="flex min-w-0 items-center space-x-4">
        <button type="button" onClick={navigateBack} aria-label="Back to previous page"
          className={`shrink-0 cursor-pointer rounded-xl border p-2 transition-all duration-200 hover:scale-105 ${isDark
            ? 'border-gold-600/30 bg-gray-800/50 hover:bg-gray-800'
            : 'border-gold-200 bg-gold-50/50 hover:bg-gold-50'}`}>
          <ArrowLeft className={`h-4 w-4 ${isDark ? 'text-gold-400' : 'text-gold-600'}`} />
        </button>
        <h1 className={`min-w-0 text-xl font-bold md:text-2xl ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>Gold Evaluation - {application.name || application.applicationNo}</h1>
      </div>
      <div className={`flex flex-wrap items-center gap-3 rounded-xl border px-4 py-2 ${isDark ? 'border-gold-700/30 bg-gray-800/50' : 'border-gold-200 bg-white'}`}>
        <span className={`text-sm font-medium ${muted}`}>Status:</span>
        <StatusBadge status={application.status} />
        <span className={`text-sm font-semibold ${evaluation?.status === 'FINALIZED' ? 'text-emerald-600' : 'text-amber-600'}`}>{evaluation?.status === 'FINALIZED' ? 'Gold Evaluated' : 'Evaluation Draft'}</span>
      </div>
    </header>

    <section className={card}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3"><h2 className={heading}><User className="h-5 w-5" />Customer Information</h2><div className="flex flex-wrap items-center gap-2"><KycVerificationBadge verified={application.kycVerified} /><KYCVerificationButton applicationId={application.id} isDark={isDark} label={application.kycVerified ? 'View KYC' : 'KYC Verification'} /></div></div>
      <div className="grid gap-x-6 gap-y-4 text-sm sm:grid-cols-2 lg:grid-cols-4">
        <p><span className="block text-xs text-gray-500">Customer</span><strong>{application.name || '—'}</strong></p>
        <p><span className="block text-xs text-gray-500">Mobile</span><strong>{application.mobile || '—'}</strong></p>
        <p><span className="block text-xs text-gray-500">Email</span><strong>{application.email || '—'}</strong></p>
        <p><span className="block text-xs text-gray-500">Branch</span><strong>{application.branchName || 'Unassigned'}</strong></p>
        <p><span className="block text-xs text-gray-500">Requested Amount</span><strong>{application.requestedAmount ? money(application.requestedAmount) : '—'}</strong></p>
        <p><span className="block text-xs text-gray-500">Purpose</span><strong>{application.purpose || '—'}</strong></p>
        <p><span className="block text-xs text-gray-500">Source</span><strong>{application.source || '—'}</strong></p>
      </div>
    </section>

    <section className={card}>
      <div className="flex flex-wrap items-center justify-between gap-3"><h2 className={heading}><ClipboardList className="h-5 w-5" />Gold Items ({items.length})</h2>
        <button type="button" disabled={busy} onClick={() => { setItems((current) => [...current, blankItem()]); setDirty(true); }}
          className="flex cursor-pointer items-center gap-1 rounded bg-gold-600 px-3 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"><Plus className="h-4 w-4" />Add item</button></div>
      {items.length === 0 && <p className="mt-4 rounded-lg border border-dashed border-gold-300 p-6 text-center text-sm text-gray-500">No gold items yet. Add an item, then upload its photos.</p>}
      {items.map((item, index) => <EvaluationItemCard key={item.clientKey} item={item} index={index}
        isDark={isDark} busy={busy}
        onChange={(value) => updateItem(item.clientKey, value)}
        onRemove={() => { setItems((current) => current.filter((candidate) => candidate.clientKey !== item.clientKey)); setDirty(true); }}
        onUpload={uploadImage} />)}
    </section>
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
    <section className={card}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className={heading}><Coins className="h-5 w-5" />Valuation Summary</h2>
        {evaluation?.status === 'DRAFT' && <button type="button" disabled={busy || dirty} onClick={refreshRates} className="rounded border border-gold-500 px-3 py-1 text-sm text-gold-700 disabled:opacity-50">Refresh rates</button>}
      </div>
      <p className="mt-1 text-xs text-gray-500">Valuation uses each item’s saved purity rate and net weight.</p>
      <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
        <p className="rounded-lg border border-gold-200 p-3"><span className="block text-xs text-gray-500">Reference Gold Rate / g</span><strong>{goldRate ? money(goldRate) : 'Awaiting backend rate'}</strong></p>
        <p className="rounded-lg border border-gold-200 p-3"><span className="block text-xs text-gray-500">Loan to Value</span><strong>{ltvPercentage ? `${ltvPercentage}%` : 'Awaiting backend LTV'}</strong></p>
        <p className="rounded-lg border border-gold-200 p-3"><span className="block text-xs text-gray-500">Gross Weight</span><strong>{totalGross.toFixed(3)} g</strong></p>
        <p className="rounded-lg border border-gold-200 p-3"><span className="block text-xs text-gray-500">Stone / Non-gold Deduction</span><strong>{totalDeduction.toFixed(3)} g</strong></p>
        <p className="rounded-lg border border-gold-200 p-3"><span className="block text-xs text-gray-500">Net Gold Weight</span><strong>{totalNet.toFixed(3)} g</strong></p>
        <p className="rounded-lg border border-gold-200 p-3"><span className="block text-xs text-gray-500">Gold Valuation</span><strong>{money(valuation)}</strong></p>
      </div>
      <div className="mt-4 rounded-xl bg-gold-600 p-4 text-white"><p className="text-sm">Eligible Loan Amount</p><p className="mt-1 text-2xl font-bold">{money(eligible)}</p></div>
      {dirty && <p className="mt-3 text-xs text-amber-600">Preview has unsaved changes. Save to confirm the backend calculation.</p>}
      {!record.todayRatesAvailable && evaluation?.status !== 'FINALIZED' && <p className="mt-3 text-sm text-amber-600">Today’s gold rates have not been set.</p>}
      {evaluation?.status === 'DRAFT' && record.currentRateSettingId && evaluation.goldRateSettingId !== record.currentRateSettingId && <p className="mt-3 text-sm text-amber-600">New rates are available. Refresh this draft before finalisation.</p>}
    </section>
    <section className={card}>
      <h2 className={`${heading} mb-4`}><MessageSquareText className="h-5 w-5" />Evaluation Remarks</h2>
      <label className={`mb-1 block text-xs font-medium ${muted}`} htmlFor="evaluation-remarks">Appraiser remarks</label>
      <textarea id="evaluation-remarks" rows={3} value={remarks} onChange={(event) => { setRemarks(event.target.value); setDirty(true); }}
          className={field} />
    </section>
    </div>
    <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
      <button type="button" onClick={navigateBack} className={`cursor-pointer rounded px-6 py-2.5 text-center font-medium transition-colors ${isDark ? 'border border-gray-600 bg-gray-700 text-white hover:bg-gray-600' : 'border border-gray-300 bg-gray-200 text-gray-800 hover:bg-gray-300'}`}>Cancel</button>
      <button type="button" disabled={busy} onClick={() => run(saveDraft, 'Evaluation draft saved')}
        className={`cursor-pointer rounded border px-6 py-2.5 font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${isDark ? 'border-gold-500 text-gold-300 hover:bg-gold-500/10' : 'border-gold-500 text-gold-700 hover:bg-gold-50'}`}>Save Draft</button>
      <button type="button" disabled={busy || !application.kycVerified || application.status !== 'GOLD_EVALUATION' || !record.todayRatesAvailable || (evaluation?.status === 'DRAFT' && evaluation.goldRateSettingId !== record.currentRateSettingId) || !goldRate || !ltvPercentage || items.some((item) => !item.rateUsed)} onClick={finalize}
        className="inline-flex cursor-pointer items-center justify-center gap-2 rounded bg-gradient-to-r from-gold-500 to-gold-600 px-8 py-2.5 font-semibold text-white shadow-lg transition-all hover:from-gold-600 hover:to-gold-700 disabled:cursor-not-allowed disabled:opacity-50"><Check className="h-4 w-4" />Gold Evaluated</button>
    </div>
    {!application.kycVerified && <p className="text-right text-xs text-amber-600">Verify KYC before completing the evaluation.</p>}
    {(!goldRate || !ltvPercentage || items.some((item) => !item.rateUsed)) && <p className="text-right text-xs text-amber-600">Backend gold rates by purity and LTV are needed to complete the evaluation.</p>}
    {busy && <RefreshCw role="status" aria-label="Saving evaluation" className="ml-auto h-5 w-5 animate-spin text-gold-600" />}
    </div>
  </div>;
}
