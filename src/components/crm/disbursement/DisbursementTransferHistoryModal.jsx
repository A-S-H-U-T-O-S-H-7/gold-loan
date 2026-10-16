'use client';
import { useState } from 'react';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';
import { getPaymentDocument, prepareTransfer, recordManualTransfer, saveReadiness, uploadAgreement, uploadReceipt } from '@/lib/services/crmDisbursementService';

const money = (value) => `₹${Number(value || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const nowLocal = () => { const date = new Date(); return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16); };
const when = (value) => value ? new Date(value).toLocaleString('en-IN') : '—';
const freshTransfer = () => ({ requestKey: crypto.randomUUID(), transactionReference: '', attemptedAt: nowLocal(), sendingAccountReference: '', receipt: null, remark: '', failureReason: '' });

export default function DisbursementModal({ data, onClose, onRefresh, onSuccess, isDark = false }) {
  const [busy, setBusy] = useState(false);
  const [signedAt, setSignedAt] = useState(nowLocal);
  const [agreementReference, setAgreementReference] = useState('');
  const [agreementFile, setAgreementFile] = useState(null);
  const [receiptNumber, setReceiptNumber] = useState('');
  const [storageLocation, setStorageLocation] = useState('');
  const [transfer, setTransfer] = useState(freshTransfer);
  const [method, setMethod] = useState('MANUAL');
  if (!data) return null;
  const { application, offer, bank, readiness, disbursement } = data;
  const ready = readiness.approvalValid && readiness.bankVerified && readiness.agreementCompleted && readiness.goldCustodyRecorded;
  const blocked = ['PENDING', 'UNKNOWN', 'SUCCESS'].includes(disbursement?.status);
  const card = `rounded-xl border p-4 ${isDark ? 'border-gold-700/40 bg-gray-700/40' : 'border-gold-200 bg-gold-50/40'}`;
  const input = `w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-gold-500 ${isDark ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'}`;
  const label = 'mb-1 block text-sm font-medium';
  const button = 'cursor-pointer rounded-lg bg-gold-600 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50';
  async function run(action, success) {
    setBusy(true);
    try { await action(); if (success) toast.success(success); await onRefresh(); }
    catch (error) { toast.error(error.response?.data?.message || error.message || 'Action failed.'); }
    finally { setBusy(false); }
  }
  async function viewFile(path) {
    await run(async () => { const blob = await getPaymentDocument(path); const url = URL.createObjectURL(blob); window.open(url, '_blank', 'noopener,noreferrer'); setTimeout(() => URL.revokeObjectURL(url), 60000); });
  }
  async function recordReadiness() {
    if (!agreementFile || !signedAt || !agreementReference.trim() || !receiptNumber.trim() || !storageLocation.trim()) { toast.error('Complete agreement and gold custody details, including the signed agreement file.'); return; }
    await run(async () => {
      const documentFileKey = await uploadAgreement(application.id, agreementFile);
      await saveReadiness(application.id, { signedAt: new Date(signedAt).toISOString(), agreementReference, documentFileKey, receiptNumber, storageLocation });
    }, 'Agreement and gold custody recorded');
  }
  async function record(result) {
    if (!transfer.attemptedAt || (result === 'SUCCESS' && (!transfer.transactionReference.trim() || !transfer.sendingAccountReference.trim())) || (result === 'FAILED' && !transfer.failureReason.trim())) { toast.error('Complete the transfer result fields.'); return; }
    setBusy(true);
    try {
      const receiptFileKey = transfer.receipt ? await uploadReceipt(disbursement.id, transfer.receipt) : null;
      await recordManualTransfer(disbursement.id, { requestKey: transfer.requestKey, result, transactionReference: transfer.transactionReference, attemptedAt: new Date(transfer.attemptedAt).toISOString(), sendingAccountReference: transfer.sendingAccountReference, receiptFileKey, failureReason: transfer.failureReason, remark: transfer.remark });
      toast.success(result === 'SUCCESS' ? 'Successful bank transfer recorded. Application is Disbursed.' : 'Failed attempt recorded. Application remains in Disburse.');
      if (result === 'SUCCESS') onSuccess();
      else { setTransfer(freshTransfer()); await onRefresh(); }
    } catch (error) { toast.error(error.response?.data?.message || error.message || 'Could not record transfer.'); }
    finally { setBusy(false); }
  }
  return <div role="dialog" aria-modal="true" aria-label={`Disbursement for application ${application.applicationNo}`} className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm" onClick={() => { if (!busy) onClose(); }}>
    <div onClick={(event) => event.stopPropagation()} className={`max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl border-2 p-5 shadow-2xl md:p-6 ${isDark ? 'border-gold-700/50 bg-gray-800 text-gray-100' : 'border-gold-200 bg-white text-gray-900'}`}>
      <header className="mb-5 flex items-center justify-between gap-3"><h2 className="text-xl font-bold">Disbursement — {application.applicationNo}</h2><button type="button" onClick={onClose} className="cursor-pointer rounded-lg p-2 hover:bg-gray-500/20" aria-label="Close"><X className="h-5 w-5" /></button></header>
      <section className={card}><p className="font-semibold">{application.name} · {application.mobile}</p><p className="mt-1 text-sm">{application.branchName || 'Unassigned'}</p><div className="mt-3 grid gap-2 sm:grid-cols-3"><div>Principal <strong>{money(offer?.approvedAmount)}</strong></div><div>Deductions <strong>{money(offer?.deductionAmount)}</strong></div><div>Net payout <strong>{money(offer?.netPayoutAmount)}</strong></div></div></section>
      <section className={`${card} mt-4`}><h3 className="mb-3 font-semibold">Payout Account</h3><div className="grid gap-2 text-sm sm:grid-cols-2"><p>Account holder: <strong>{bank?.accountHolderName || '—'}</strong></p><p>Bank: <strong>{bank?.bankName || '—'}</strong></p><p>Account: <strong>{bank?.accountNumber || '—'}</strong></p><p>IFSC: <strong>{bank?.ifscCode || '—'}</strong></p></div><p className={`mt-2 text-xs ${readiness.bankVerified ? 'text-emerald-600' : 'text-red-500'}`}>{readiness.bankVerified ? 'Verified with current KYC' : 'Bank details need verification'}</p></section>
      <section className={`${card} mt-4`}><h3 className="mb-3 font-semibold">Readiness</h3><div className="grid gap-2 text-sm sm:grid-cols-2"><p>Credit approval: {readiness.approvalValid ? 'Valid' : 'Needs review'}</p><p>Bank: {readiness.bankVerified ? 'Verified' : 'Not verified'}</p><p>Agreement: {readiness.agreementCompleted ? 'Completed' : 'Missing'}</p><p>Gold receipt/storage: {readiness.goldCustodyRecorded ? 'Recorded' : 'Missing'}</p></div>{readiness.agreementCompleted && <p className="mt-2 text-xs">Agreement {readiness.agreement.reference} · Signed {when(readiness.agreement.signedAt)} <button type="button" onClick={() => viewFile(`/crm/applications/disbursement/agreement-file/${application.id}`)} className="cursor-pointer text-gold-600 underline">View signed agreement</button></p>}{readiness.goldCustodyRecorded && <p className="text-xs">Gold receipt {readiness.custody.receiptNumber} · Stored at {readiness.custody.storageLocation}</p>}</section>
      {(!readiness.agreementCompleted || !readiness.goldCustodyRecorded) && <section className={`${card} mt-4`}><h3 className="mb-3 font-semibold">Record Agreement and Gold Custody</h3><div className="grid gap-3 sm:grid-cols-2"><div><label className={label}>Agreement signed at <span className="text-red-500">*</span></label><input type="datetime-local" value={signedAt} onChange={(e) => setSignedAt(e.target.value)} className={input} /></div><div><label className={label}>Agreement reference <span className="text-red-500">*</span></label><input value={agreementReference} onChange={(e) => setAgreementReference(e.target.value)} className={input} /></div><div><label className={label}>Signed agreement file <span className="text-red-500">*</span></label><input type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={(e) => setAgreementFile(e.target.files?.[0] || null)} className={input} /></div><div><label className={label}>Gold receipt number <span className="text-red-500">*</span></label><input value={receiptNumber} onChange={(e) => setReceiptNumber(e.target.value)} className={input} /></div><div><label className={label}>Storage location <span className="text-red-500">*</span></label><input value={storageLocation} onChange={(e) => setStorageLocation(e.target.value)} className={input} /></div></div><button type="button" onClick={recordReadiness} disabled={busy || !readiness.approvalValid} className={`${button} mt-4`}>Save Readiness</button></section>}
      {!disbursement && <div className="mt-4"><button type="button" onClick={() => run(() => prepareTransfer(application.id), 'Application sent to Transaction')} disabled={busy || !ready} className={button}>Send to Transaction</button></div>}
      {disbursement && <section className={`${card} mt-4`}><h3 className="mb-3 font-semibold">Transfer History · {disbursement.status.replaceAll('_', ' ')}</h3>{disbursement.attempts.length === 0 ? <p className="text-sm">No payment attempts recorded.</p> : <div className="space-y-2">{disbursement.attempts.map((attempt) => <div key={attempt.id} className="rounded-lg border border-gold-200 p-3 text-sm"><p><strong>{attempt.status}</strong> · {money(attempt.amount)} · {when(attempt.attemptedAt)}</p><p>UTR: {attempt.transactionReference || '—'} · Sending account: {attempt.sendingAccountReference || '—'}</p>{attempt.failureReason && <p>Failure: {attempt.failureReason}</p>}{attempt.remark && <p>Remark: {attempt.remark}</p>}{attempt.receiptAvailable && <button type="button" onClick={() => viewFile(`/crm/disbursement-attempts/receipt/${attempt.id}`)} className="cursor-pointer text-gold-600 underline">View receipt</button>}</div>)}</div>}</section>}
      {disbursement && !blocked && <section className={`${card} mt-4`}><h3 className="mb-3 font-semibold">Record Manual Bank Transfer</h3><p className="mb-3 text-sm">Complete the transfer in your bank first. This form records its result.</p><div className="grid gap-3 sm:grid-cols-2"><div><label className={label}>Transfer method</label><select value={method} onChange={(e) => setMethod(e.target.value)} className={input}><option value="MANUAL">Manual Bank Transfer</option><option value="BANK_INTEGRATION" disabled>Bank Integration (coming later)</option></select></div><div><label className={label}>Actual transfer date and time <span className="text-red-500">*</span></label><input type="datetime-local" value={transfer.attemptedAt} onChange={(e) => setTransfer({ ...transfer, attemptedAt: e.target.value })} className={input} /></div><div><label className={label}>Transaction reference / UTR <span className="text-red-500">*</span></label><input value={transfer.transactionReference} onChange={(e) => setTransfer({ ...transfer, transactionReference: e.target.value })} className={input} /></div><div><label className={label}>Sending bank/account reference <span className="text-red-500">*</span></label><input value={transfer.sendingAccountReference} onChange={(e) => setTransfer({ ...transfer, sendingAccountReference: e.target.value })} className={input} /></div><div><label className={label}>Payment confirmation / receipt</label><input type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={(e) => setTransfer({ ...transfer, receipt: e.target.files?.[0] || null })} className={input} /></div><div><label className={label}>Remark</label><input value={transfer.remark} onChange={(e) => setTransfer({ ...transfer, remark: e.target.value })} className={input} /></div><div className="sm:col-span-2"><label className={label}>Failure reason (for failed attempt)</label><input value={transfer.failureReason} onChange={(e) => setTransfer({ ...transfer, failureReason: e.target.value })} className={input} /></div></div><div className="mt-4 flex flex-wrap gap-2"><button type="button" onClick={() => record('SUCCESS')} disabled={busy || !ready} className={button}>Record Successful Transfer</button><button type="button" onClick={() => record('FAILED')} disabled={busy || !ready} className="cursor-pointer rounded-lg border border-red-500 px-4 py-2 text-sm font-semibold text-red-600 disabled:opacity-50">Record Failed Attempt</button></div></section>}
      {disbursement && ['PENDING', 'UNKNOWN'].includes(disbursement.status) && <p className="mt-4 rounded-lg border border-amber-400 bg-amber-50 p-3 text-sm text-amber-800">Payment result is pending or unknown. Check the bank result before another attempt.</p>}
    </div>
  </div>;
}
