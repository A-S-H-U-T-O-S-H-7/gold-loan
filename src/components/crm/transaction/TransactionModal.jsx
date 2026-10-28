'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { History, Landmark, Send, X } from 'lucide-react';
import DetailField from '@/components/crm/ui/DetailField';
import { DetailSection, InfoRow } from '@/components/crm/ui/DetailSection';
import { dividerClass, mutedClass } from '@/components/crm/ui/detailStyles';
import TransactionStatusBadge from '@/components/crm/transaction/TransactionStatusBadge';

const money = (value) => `₹${Number(value || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const formatDateTime = (value) => (value ? new Date(value).toLocaleString('en-IN') : '—');

// Value for a datetime-local input, in the user's local time.
function localNow() {
  const now = new Date();
  return new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
}

// requestKey lets the server ignore a double-submitted attempt.
function emptyForm() {
  return {
    requestKey: crypto.randomUUID(),
    transactionReference: '',
    attemptedAt: localNow(),
    sendingAccountReference: '',
    receipt: null,
    failureReason: '',
    remark: '',
  };
}

function blockedMessage(status) {
  if (status === 'SUCCESS') return 'Transfer confirmed. No further payment can be recorded.';
  return 'Payment status must be resolved before another transfer. Bank status checking is not available yet.';
}

export default function TransactionModal({ data, onClose, onRecord, busy = false, isDark = false }) {
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === 'Escape' && !busy) onClose();
    };
    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [busy, onClose]);

  if (!data) return null;

  const { application, bank, disbursement } = data;
  const attempts = disbursement?.attempts || [];
  // Only one transfer can be in flight, and a successful one is final.
  const blocked = ['PENDING', 'UNKNOWN', 'SUCCESS'].includes(disbursement?.status);

  const input = `w-full rounded border-2 px-3 py-2 text-sm outline-none transition-colors focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 ${
    isDark ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'
  }`;
  const label = `mb-1 block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`;
  const required = <span className="text-red-500"> *</span>;
  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const submit = (result) => {
    if (result === 'SUCCESS' && (!form.attemptedAt || !form.transactionReference.trim() || !form.sendingAccountReference.trim())) {
      toast.error('Enter the UTR, sending account and actual transfer time.');
      return;
    }
    if (result === 'FAILED' && (!form.attemptedAt || !form.failureReason.trim())) {
      toast.error('Enter a failure reason and actual attempt time.');
      return;
    }
    onRecord(result, form);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Transfer for ${application.applicationNo}`}
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 p-3 backdrop-blur-sm sm:p-4"
      onClick={() => { if (!busy) onClose(); }}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className={`flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border-2 shadow-2xl ${
          isDark ? 'border-gold-700/50 bg-gray-800 text-gray-100' : 'border-gold-200 bg-white text-gray-900'
        }`}
      >
        <header className={`flex items-start justify-between gap-3 border-b px-5 py-4 ${dividerClass(isDark)}`}>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-bold">{disbursement?.status === 'SUCCESS' ? 'Transfer History' : 'Complete Transfer'}</h2>
              <TransactionStatusBadge status={disbursement?.status} isDark={isDark} />
            </div>
            <p className={`mt-0.5 text-sm ${mutedClass(isDark)}`}>
              <span className="font-mono font-semibold text-gold-600">#{application.applicationNo}</span>
              {' · '}{application.name} · {application.mobile}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            aria-label="Close"
            className="cursor-pointer rounded-lg p-2 transition-colors hover:bg-gray-500/20 disabled:cursor-not-allowed"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="flex-1 space-y-4 overflow-y-auto p-5">
          <div className="grid gap-3 sm:grid-cols-3">
            <DetailField label="Approved Principal" value={money(disbursement?.approvedAmount)} isDark={isDark} />
            <DetailField label="Deductions" value={money(disbursement?.deductionAmount)} isDark={isDark} />
            <DetailField label="Net Payout to Customer" value={money(disbursement?.netPayoutAmount)} isDark={isDark} highlight />
          </div>

          <DetailSection title="Customer Bank Account" icon={Landmark} isDark={isDark}>
            <div className="grid gap-x-6 sm:grid-cols-2">
              <InfoRow label="Account holder" value={bank?.accountHolderName} isDark={isDark} />
              <InfoRow label="Bank" value={bank?.bankName} isDark={isDark} />
              <InfoRow label="Account number" value={bank?.accountNumber} isDark={isDark} />
              <InfoRow label="IFSC" value={bank?.ifscCode} isDark={isDark} />
            </div>
            <p className={`mt-2 text-xs ${mutedClass(isDark)}`}>Mode: Manual bank transfer</p>
          </DetailSection>

          {attempts.length > 0 && (
            <DetailSection title={`Previous Attempts (${attempts.length})`} icon={History} isDark={isDark}>
              <div className={`overflow-x-auto rounded-lg border ${isDark ? 'border-gray-700' : 'border-gold-200'}`}>
                <table className="w-full min-w-[640px] text-sm">
                  <thead className={isDark ? 'bg-gray-900/60 text-gray-300' : 'bg-gold-50 text-gray-700'}>
                    <tr>
                      {['Status', 'Attempted At', 'UTR / Failure Reason', 'Sending Account'].map((column) => (
                        <th key={column} className="px-3 py-2 text-left text-xs font-bold uppercase tracking-wide">{column}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {attempts.map((attempt) => (
                      <tr key={attempt.id} className={`border-t ${dividerClass(isDark)}`}>
                        <td className="px-3 py-2"><TransactionStatusBadge status={attempt.status} isDark={isDark} /></td>
                        <td className="px-3 py-2">{formatDateTime(attempt.attemptedAt)}</td>
                        <td className="px-3 py-2 wrap-anywhere">{attempt.transactionReference || attempt.failureReason || '—'}</td>
                        <td className="px-3 py-2 wrap-anywhere">{attempt.sendingAccountReference || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </DetailSection>
          )}

          {blocked ? (
            <p role="alert" className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-600">
              {blockedMessage(disbursement?.status)}
            </p>
          ) : (
            <DetailSection title="Record Transfer Result" icon={Send} isDark={isDark}>
              <p className={`mb-4 text-sm ${mutedClass(isDark)}`}>
                Complete the bank transfer separately, then record its actual result here.
              </p>
              <div className="grid gap-4 md:grid-cols-2">
                <label>
                  <span className={label}>Transaction reference / UTR{required}</span>
                  <input value={form.transactionReference} onChange={(event) => update('transactionReference', event.target.value)} placeholder="Enter UTR or bank reference" className={input} />
                </label>
                <label>
                  <span className={label}>Actual transfer date and time{required}</span>
                  <input type="datetime-local" value={form.attemptedAt} onChange={(event) => update('attemptedAt', event.target.value)} className={input} />
                </label>
                <label>
                  <span className={label}>Sending bank / account reference{required}</span>
                  <input value={form.sendingAccountReference} onChange={(event) => update('sendingAccountReference', event.target.value)} placeholder="Company bank or account reference" className={input} />
                </label>
                <label>
                  <span className={label}>Payment confirmation / receipt</span>
                  <input type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={(event) => update('receipt', event.target.files?.[0] || null)} className={input} />
                </label>
                <label>
                  <span className={label}>Failure reason (only when marking failed)</span>
                  <input value={form.failureReason} onChange={(event) => update('failureReason', event.target.value)} placeholder="Enter failure reason" className={input} />
                </label>
                <label>
                  <span className={label}>Remark</span>
                  <input value={form.remark} onChange={(event) => update('remark', event.target.value)} placeholder="Optional note" className={input} />
                </label>
              </div>
            </DetailSection>
          )}
        </div>

        <footer className={`flex flex-col-reverse gap-3 border-t px-5 py-4 sm:flex-row sm:justify-end ${dividerClass(isDark)}`}>
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            className={`cursor-pointer rounded-lg px-5 py-2.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
              isDark ? 'border border-gray-600 bg-gray-700 text-white hover:bg-gray-600' : 'border border-gray-300 bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            Close
          </button>
          {!blocked && (
            <>
              <button
                type="button"
                onClick={() => submit('FAILED')}
                disabled={busy}
                className="cursor-pointer rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Mark Failed
              </button>
              <button
                type="button"
                onClick={() => submit('SUCCESS')}
                disabled={busy}
                className="cursor-pointer rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {busy ? 'Recording...' : 'Record Successful Transfer'}
              </button>
            </>
          )}
        </footer>
      </div>
    </div>
  );
}
