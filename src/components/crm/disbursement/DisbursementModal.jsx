'use client';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { GhostButton, PrimaryButton, Field, inputClass } from '@/components/crm/ui/FormControls';
import DisbursementDocumentList from './DisbursementDocumentList';
import DisbursementForm from './DisbursementForm';
import { prepareTransfer, saveReadiness, uploadAgreement } from '@/lib/services/crmDisbursementService';

const money = (value) => `₹${Number(value || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const localNow = () => { const now = new Date(); return new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16); };

export default function DisbursementModal({ data, onClose, onSuccess, isDark = false }) {
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState(() => ({
    signatureType: data?.readiness?.agreement?.signatureType === 'PHYSICAL' ? 'Physical' : 'E-Sign',
    mode: 'Bank Transfer',
    accountNumber: data?.bank?.accountNumber || '',
    ifsc: data?.bank?.ifscCode || '',
    locked: !!data?.readiness?.agreementCompleted,
  }));
  const [signedAt, setSignedAt] = useState(localNow);
  const [agreementReference, setAgreementReference] = useState('');
  const [agreementFile, setAgreementFile] = useState(null);
  const [receiptNumber, setReceiptNumber] = useState('');
  const [storageLocation, setStorageLocation] = useState('');

  if (!data) return null;
  const { application, offer, bank, readiness, disbursement } = data;
  const needsReadiness = !readiness.agreementCompleted || !readiness.goldCustodyRecorded;
  const canPrepare = readiness.approvalValid && readiness.bankVerified;

  async function markReady() {
    if (!canPrepare) { toast.error('Current credit approval and verified bank details are required.'); return; }
    if (needsReadiness && (!agreementFile || !signedAt || !agreementReference.trim() || !receiptNumber.trim() || !storageLocation.trim())) {
      toast.error('Complete the signed agreement and gold custody details.');
      return;
    }
    setBusy(true);
    try {
      if (needsReadiness) {
        const documentFileKey = await uploadAgreement(application.id, agreementFile);
        await saveReadiness(application.id, {
          signedAt: new Date(signedAt).toISOString(),
          signatureType: form.signatureType === 'Physical' ? 'PHYSICAL' : 'E_SIGN',
          agreementReference: agreementReference.trim(), documentFileKey,
          receiptNumber: receiptNumber.trim(), storageLocation: storageLocation.trim(),
        });
      }
      await prepareTransfer(application.id);
      toast.success('Application sent to Transaction.');
      onSuccess();
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Could not send to Transaction.');
    } finally { setBusy(false); }
  }

  return <div role="dialog" aria-modal="true" aria-label={`Disbursement for ${application.applicationNo}`} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => { if (!busy) onClose(); }}>
    <div className={`relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl border-2 p-6 ${isDark ? 'bg-gray-800 border-gold-700/50' : 'bg-white border-gold-200'}`} onClick={(event) => event.stopPropagation()}>
      <div className="flex items-center justify-between mb-6">
        <h2 className={`text-xl font-bold ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>Disbursement — {application.applicationNo}</h2>
        <button type="button" onClick={onClose} disabled={busy} aria-label="Close" className={`p-1.5 rounded-lg transition-colors cursor-pointer ${isDark ? 'hover:bg-gray-700 text-gray-400 hover:text-gray-200' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'}`}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>

      <div className="mb-4 p-3 rounded-lg bg-teal-50/50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-700/30">
        <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Customer: <span className="font-semibold">{application.name}</span> | Mobile: <span className="font-semibold">{application.mobile}</span></p>
        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Amount: <span className="font-semibold text-teal-600 dark:text-teal-400">{money(offer?.netPayoutAmount)}</span></p>
        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Bank: <span className="font-semibold">{bank?.bankName || '—'}</span> | Account: <span className="font-semibold">{bank?.accountNumber || '—'}</span></p>
      </div>

      <DisbursementDocumentList data={data} isDark={isDark} />

      <div className="mt-4">
        <h4 className={`text-sm font-semibold mb-3 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>Disbursement Details</h4>
        <DisbursementForm form={form} setForm={setForm} />
      </div>

      {needsReadiness && <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label={<>Agreement signed at <span className="text-red-500">*</span></>}><input type="datetime-local" value={signedAt} onChange={(event) => setSignedAt(event.target.value)} className={inputClass} /></Field>
        <Field label={<>Agreement reference <span className="text-red-500">*</span></>}><input value={agreementReference} onChange={(event) => setAgreementReference(event.target.value)} className={inputClass} /></Field>
        <Field label={<>Signed agreement file <span className="text-red-500">*</span></>}><input type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={(event) => setAgreementFile(event.target.files?.[0] || null)} className={inputClass} /></Field>
        <Field label={<>Gold receipt number <span className="text-red-500">*</span></>}><input value={receiptNumber} onChange={(event) => setReceiptNumber(event.target.value)} className={inputClass} /></Field>
        <Field label={<>Storage location <span className="text-red-500">*</span></>}><input value={storageLocation} onChange={(event) => setStorageLocation(event.target.value)} className={inputClass} /></Field>
      </div>}
      {!canPrepare && <p role="alert" className="mt-4 text-sm text-red-600">Current credit approval and verified bank details are required before marking ready.</p>}
      {disbursement && <p className="mt-4 text-sm text-emerald-700">Payout instruction #{disbursement.id} has been prepared. Send it to Transaction when ready.</p>}

      <div className="flex flex-wrap gap-3 mt-6 pt-4 border-t border-gold-200/50 dark:border-gold-700/30 justify-end">
        <GhostButton onClick={onClose} disabled={busy} className="cursor-pointer">Cancel</GhostButton>
        <PrimaryButton onClick={markReady} disabled={busy || !canPrepare} className="cursor-pointer">{busy ? 'Saving...' : 'Send to Transaction'}</PrimaryButton>
      </div>
    </div>
  </div>;
}
