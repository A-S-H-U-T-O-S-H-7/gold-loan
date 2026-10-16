'use client';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { GhostButton, PrimaryButton, DangerButton, Field, inputClass } from '@/components/crm/ui/FormControls';
import { formatCurrency } from '@/lib/utils/format';

const localNow = () => { const now = new Date(); return new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16); };

export default function TransactionModal({ data, onClose, onRecord, busy = false, isDark = false }) {
  const [form, setForm] = useState(() => ({ requestKey: crypto.randomUUID(), transactionReference: '', attemptedAt: localNow(), sendingAccountReference: '', receipt: null, failureReason: '', remark: '' }));
  if (!data) return null;
  const { application, offer, bank, disbursement } = data;
  const blocked = ['PENDING', 'UNKNOWN', 'SUCCESS'].includes(disbursement?.status);

  function submit(result) {
    if (!form.attemptedAt || (result === 'SUCCESS' && (!form.transactionReference.trim() || !form.sendingAccountReference.trim())) || (result === 'FAILED' && !form.failureReason.trim())) {
      toast.error(result === 'SUCCESS' ? 'Enter the UTR, sending account and actual transfer time.' : 'Enter a failure reason and actual attempt time.');
      return;
    }
    onRecord(result, form);
  }

  return <div role="dialog" aria-modal="true" aria-label={`Transfer for ${application.applicationNo}`} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => { if (!busy) onClose(); }}>
    <div className={`relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl border-2 p-6 ${isDark ? 'bg-gray-800 border-gold-700/50' : 'bg-white border-gold-200'}`} onClick={(event) => event.stopPropagation()}>
      <div className="flex items-center justify-between mb-6">
        <h2 className={`text-xl font-bold ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>{disbursement?.status === 'SUCCESS' ? 'Transfer History' : 'Complete Transfer'}</h2>
        <button type="button" onClick={onClose} disabled={busy} aria-label="Close" className={`p-1.5 rounded-lg transition-colors cursor-pointer ${isDark ? 'hover:bg-gray-700 text-gray-400 hover:text-gray-200' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'}`}><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
      </div>
      <div className={`p-4 rounded-xl text-center mb-4 ${isDark ? 'bg-blue-900/20 border border-blue-700/30' : 'bg-blue-50 border border-blue-200'}`}>
        <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Net payout to customer</p>
        <p className={`text-3xl font-mono font-semibold mt-1 ${isDark ? 'text-blue-400' : 'text-blue-700'}`}>{formatCurrency(disbursement?.netPayoutAmount || 0)}</p>
        <p className={`text-xs mt-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Approved principal: {formatCurrency(disbursement?.approvedAmount || 0)} · Deductions: {formatCurrency(disbursement?.deductionAmount || 0)}</p>
        <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Mode: Manual bank transfer · Application {application.applicationNo}</p>
      </div>
      <div className={`p-3 rounded-lg mb-4 ${isDark ? 'bg-gray-700/50' : 'bg-gold-50/50'}`}>
        <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}><span className="font-medium">Customer:</span> {application.name}</p>
        <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}><span className="font-medium">Account holder:</span> {bank?.accountHolderName || '—'}</p>
        <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}><span className="font-medium">Bank / account:</span> {bank?.bankName || '—'} / {bank?.accountNumber || '—'}</p>
        <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}><span className="font-medium">IFSC:</span> {bank?.ifscCode || '—'}</p>
      </div>
      {disbursement?.attempts?.length > 0 && <div className={`mb-4 p-3 rounded-lg text-sm ${isDark ? 'bg-gray-700/50 text-gray-300' : 'bg-gold-50/50 text-gray-700'}`}><p className="font-medium mb-2">Previous attempts</p>{disbursement.attempts.map((attempt) => <p key={attempt.id}>{attempt.status} · {attempt.transactionReference || attempt.failureReason || 'No reference'} · {new Date(attempt.attemptedAt).toLocaleString('en-IN')}{attempt.sendingAccountReference ? ` · ${attempt.sendingAccountReference}` : ''}</p>)}</div>}
      {blocked ? <p role="alert" className="text-sm text-amber-600">{disbursement?.status === 'SUCCESS' ? 'Transfer confirmed. No further payment can be recorded.' : 'Payment status must be resolved before another transfer. Bank status checking is not available yet.'}</p> : <div className="space-y-3">
        <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Complete the bank transfer separately, then record its actual result here.</p>
        <Field label="Transaction reference / UTR *"><input className={inputClass} value={form.transactionReference} onChange={(event) => setForm({ ...form, transactionReference: event.target.value })} placeholder="Enter UTR or bank reference" /></Field>
        <Field label="Actual transfer date and time *"><input type="datetime-local" className={inputClass} value={form.attemptedAt} onChange={(event) => setForm({ ...form, attemptedAt: event.target.value })} /></Field>
        <Field label="Sending bank/account reference *"><input className={inputClass} value={form.sendingAccountReference} onChange={(event) => setForm({ ...form, sendingAccountReference: event.target.value })} placeholder="Company bank/account reference" /></Field>
        <Field label="Payment confirmation / receipt"><input type="file" accept=".pdf,.png,.jpg,.jpeg" className={inputClass} onChange={(event) => setForm({ ...form, receipt: event.target.files?.[0] || null })} /></Field>
        <Field label="Failure reason (if failing)"><input className={inputClass} value={form.failureReason} onChange={(event) => setForm({ ...form, failureReason: event.target.value })} placeholder="Enter failure reason" /></Field>
        <Field label="Remark"><input className={inputClass} value={form.remark} onChange={(event) => setForm({ ...form, remark: event.target.value })} placeholder="Optional note" /></Field>
      </div>}
      <div className="flex flex-wrap gap-3 mt-6 pt-4 border-t border-gold-200/50 dark:border-gold-700/30 justify-end">
        <GhostButton onClick={onClose} disabled={busy} className="cursor-pointer">Close</GhostButton>
        {!blocked && <><DangerButton onClick={() => submit('FAILED')} disabled={busy} className="cursor-pointer">Mark Failed</DangerButton><PrimaryButton onClick={() => submit('SUCCESS')} disabled={busy} className="cursor-pointer">{busy ? 'Recording...' : 'Record Successful Transfer'}</PrimaryButton></>}
      </div>
    </div>
  </div>;
}
