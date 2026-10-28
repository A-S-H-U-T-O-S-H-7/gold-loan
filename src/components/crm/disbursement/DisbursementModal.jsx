'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Banknote, CheckCircle2, ClipboardList, Landmark, X, XCircle } from 'lucide-react';
import { prepareTransfer, saveReadiness, uploadAgreement } from '@/lib/services/crmDisbursementService';
import DetailField from '@/components/crm/ui/DetailField';
import { DetailSection, InfoRow } from '@/components/crm/ui/DetailSection';
import { dividerClass, mutedClass } from '@/components/crm/ui/detailStyles';
import DisbursementDocumentList from '@/components/crm/disbursement/DisbursementDocumentList';

const money = (value) => `₹${Number(value || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const formatDateTime = (value) => (value ? new Date(value).toLocaleString('en-IN') : '—');

// Value for a datetime-local input, in the user's local time.
function localNow() {
  const now = new Date();
  return new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
}

function ReadinessItem({ label, done, doneText, pendingText }) {
  return (
    <li className="flex items-center justify-between gap-3 py-2 text-sm">
      <span>{label}</span>
      <span className={`inline-flex items-center gap-1.5 font-semibold ${done ? 'text-emerald-600' : 'text-red-500'}`}>
        {done ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
        {done ? doneText : pendingText}
      </span>
    </li>
  );
}

export default function DisbursementModal({ data, onClose, onSuccess, isDark = false }) {
  const [busy, setBusy] = useState(false);
  const [signatureType, setSignatureType] = useState(
    data?.readiness?.agreement?.signatureType === 'PHYSICAL' ? 'PHYSICAL' : 'E_SIGN',
  );
  const [signedAt, setSignedAt] = useState(localNow);
  const [agreementReference, setAgreementReference] = useState('');
  const [agreementFile, setAgreementFile] = useState(null);
  const [receiptNumber, setReceiptNumber] = useState('');
  const [storageLocation, setStorageLocation] = useState('');

  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === 'Escape' && !busy) onClose();
    };
    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [busy, onClose]);

  if (!data) return null;

  const { application, offer, bank, readiness, disbursement } = data;
  const needsReadiness = !readiness.agreementCompleted || !readiness.goldCustodyRecorded;
  const canPrepare = readiness.approvalValid && readiness.bankVerified;

  const input = `w-full rounded border-2 px-3 py-2 text-sm outline-none transition-colors focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 ${
    isDark ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'
  }`;
  const label = `mb-1 block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`;
  const required = <span className="text-red-500"> *</span>;

  const sendToTransaction = async () => {
    if (!canPrepare) {
      toast.error('Current credit approval and verified bank details are required.');
      return;
    }
    const readinessIncomplete = !agreementFile || !signedAt || !agreementReference.trim()
      || !receiptNumber.trim() || !storageLocation.trim();
    if (needsReadiness && readinessIncomplete) {
      toast.error('Complete the signed agreement and gold custody details.');
      return;
    }

    setBusy(true);
    try {
      if (needsReadiness) {
        const documentFileKey = await uploadAgreement(application.id, agreementFile);
        await saveReadiness(application.id, {
          signedAt: new Date(signedAt).toISOString(),
          signatureType,
          agreementReference: agreementReference.trim(),
          documentFileKey,
          receiptNumber: receiptNumber.trim(),
          storageLocation: storageLocation.trim(),
        });
      }
      await prepareTransfer(application.id);
      toast.success('Application sent to Transaction.');
      onSuccess();
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Could not send to Transaction.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Disbursement for ${application.applicationNo}`}
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 p-3 backdrop-blur-sm sm:p-4"
      onClick={() => { if (!busy) onClose(); }}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className={`flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border-2 shadow-2xl ${
          isDark ? 'border-gold-700/50 bg-gray-800 text-gray-100' : 'border-gold-200 bg-white text-gray-900'
        }`}
      >
        <header className={`flex items-start justify-between gap-3 border-b px-5 py-4 ${dividerClass(isDark)}`}>
          <div className="min-w-0">
            <h2 className="text-xl font-bold">Disbursement Review</h2>
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
            <DetailField label="Approved Loan" value={money(offer?.approvedAmount)} isDark={isDark} />
            <DetailField label="Deductions" value={money(offer?.deductionAmount)} isDark={isDark} />
            <DetailField label="Net Payout" value={money(offer?.netPayoutAmount)} isDark={isDark} highlight />
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <DetailSection title="Payout Account" icon={Landmark} isDark={isDark}>
              <InfoRow label="Account holder" value={bank?.accountHolderName} isDark={isDark} />
              <InfoRow label="Bank" value={bank?.bankName} isDark={isDark} />
              <InfoRow label="Account number" value={bank?.accountNumber} isDark={isDark} />
              <InfoRow label="IFSC" value={bank?.ifscCode} isDark={isDark} />
              <InfoRow label="Mode" value="Bank Transfer" isDark={isDark} />
            </DetailSection>

            <DetailSection title="Readiness" icon={ClipboardList} isDark={isDark}>
              <ul className={`divide-y ${isDark ? 'divide-gray-700' : 'divide-gold-200'}`}>
                <ReadinessItem label="Credit approval" done={readiness.approvalValid} doneText="Valid" pendingText="Needs review" />
                <ReadinessItem label="Bank details" done={readiness.bankVerified} doneText="Verified" pendingText="Not verified" />
                <ReadinessItem label="Signed agreement" done={readiness.agreementCompleted} doneText="Recorded" pendingText="Missing" />
                <ReadinessItem label="Gold receipt and storage" done={readiness.goldCustodyRecorded} doneText="Recorded" pendingText="Missing" />
              </ul>
              {readiness.agreementCompleted && (
                <p className={`mt-2 text-xs ${mutedClass(isDark)}`}>
                  Agreement {readiness.agreement.reference} · signed {formatDateTime(readiness.agreement.signedAt)}
                </p>
              )}
              {readiness.goldCustodyRecorded && (
                <p className={`mt-1 text-xs ${mutedClass(isDark)}`}>
                  Gold receipt {readiness.custody.receiptNumber} · stored at {readiness.custody.storageLocation}
                </p>
              )}
            </DetailSection>
          </div>

          <DisbursementDocumentList data={data} isDark={isDark} />

          {needsReadiness && (
            <DetailSection title="Agreement and Gold Custody" icon={Banknote} isDark={isDark}>
              <div className="grid gap-4 md:grid-cols-2">
                <label>
                  <span className={label}>Signature type</span>
                  <select value={signatureType} onChange={(event) => setSignatureType(event.target.value)} className={input}>
                    <option value="E_SIGN">E-Sign</option>
                    <option value="PHYSICAL">Physical</option>
                  </select>
                </label>
                <label>
                  <span className={label}>Agreement signed at{required}</span>
                  <input type="datetime-local" value={signedAt} onChange={(event) => setSignedAt(event.target.value)} className={input} />
                </label>
                <label>
                  <span className={label}>Agreement reference{required}</span>
                  <input value={agreementReference} onChange={(event) => setAgreementReference(event.target.value)} className={input} />
                </label>
                <label>
                  <span className={label}>Signed agreement file{required}</span>
                  <input type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={(event) => setAgreementFile(event.target.files?.[0] || null)} className={input} />
                </label>
                <label>
                  <span className={label}>Gold receipt number{required}</span>
                  <input value={receiptNumber} onChange={(event) => setReceiptNumber(event.target.value)} className={input} />
                </label>
                <label>
                  <span className={label}>Storage location{required}</span>
                  <input value={storageLocation} onChange={(event) => setStorageLocation(event.target.value)} className={input} />
                </label>
              </div>
            </DetailSection>
          )}

          {!canPrepare && (
            <p role="alert" className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-500">
              Current credit approval and verified bank details are required before sending to Transaction.
            </p>
          )}
          {disbursement && (
            <p className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-600">
              Payout instruction #{disbursement.id} has been prepared. Send it to Transaction when ready.
            </p>
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
            Cancel
          </button>
          <button
            type="button"
            onClick={sendToTransaction}
            disabled={busy || !canPrepare}
            className="cursor-pointer rounded-lg bg-gold-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-gold-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busy ? 'Sending...' : 'Send to Transaction'}
          </button>
        </footer>
      </div>
    </div>
  );
}
