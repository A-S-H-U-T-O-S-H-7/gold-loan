'use client';

import { useEffect, useState } from 'react';
import { Info, RotateCcw, X } from 'lucide-react';
import StatusBadge from '@/components/crm/ui/StatusBadge';
import { InfoRow } from '@/components/crm/ui/DetailSection';
import { dividerClass, mutedClass, tileClass } from '@/components/crm/ui/detailStyles';

const formatDateTime = (value) => (value ? new Date(value).toLocaleString('en-IN') : '—');

export default function RestoreApplicationModal({ application, onClose, onConfirm, isDark = false }) {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === 'Escape' && !busy) onClose();
    };
    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [busy, onClose]);

  const submit = async (event) => {
    event.preventDefault();
    if (!reason.trim()) {
      setError('Enter why this application is being restored.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      await onConfirm(application, reason.trim());
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Could not restore the application.');
      setBusy(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Re-store application ${application.applicationNo}`}
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 p-3 backdrop-blur-sm sm:p-4"
      onClick={() => { if (!busy) onClose(); }}
    >
      <form
        onSubmit={submit}
        onClick={(event) => event.stopPropagation()}
        className={`flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border-2 shadow-2xl ${
          isDark ? 'border-gold-700/50 bg-gray-800 text-gray-100' : 'border-gold-200 bg-white text-gray-900'
        }`}
      >
        <header className={`flex items-start justify-between gap-3 border-b px-5 py-4 ${dividerClass(isDark)}`}>
          <div className="min-w-0">
            <h2 className="flex items-center gap-2 text-xl font-bold"><RotateCcw className="h-5 w-5 text-emerald-600" />Re-store Application</h2>
            <p className={`mt-0.5 text-sm ${mutedClass(isDark)}`}>
              <span className="font-mono font-semibold text-gold-600">#{application.applicationNo}</span>
              {' · '}{application.name} · {application.mobile}
            </p>
          </div>
          <button type="button" onClick={onClose} disabled={busy} aria-label="Close" className="cursor-pointer rounded-lg p-2 transition-colors hover:bg-gray-500/20 disabled:cursor-not-allowed">
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="flex-1 space-y-4 overflow-y-auto p-5">
          <div className={`px-4 py-2 ${tileClass(isDark)}`}>
            <InfoRow label="Rejected at stage" value={application.rejectedFrom ? <StatusBadge status={application.rejectedFrom} /> : '—'} isDark={isDark} />
            <InfoRow label="Rejected on" value={formatDateTime(application.rejectedAt)} isDark={isDark} />
            <InfoRow label="Rejection reason" value={application.rejectionReason} isDark={isDark} />
          </div>

          <p className="flex gap-2 rounded-lg border border-blue-500/30 bg-blue-500/10 p-3 text-sm text-blue-600 dark:text-blue-300">
            <Info className="mt-0.5 h-4 w-4 shrink-0" />
            The application moves back to Create Customer as Pending and starts the process again. Saved KYC, evaluation and offer details are kept.
          </p>

          <label className="block">
            <span className={`mb-1 block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Reason for re-store <span className="text-red-500">*</span>
            </span>
            <textarea
              rows={3}
              maxLength={1000}
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              disabled={busy}
              placeholder="e.g. Customer submitted the missing documents"
              className={`w-full rounded border-2 px-3 py-2 text-sm outline-none transition-colors focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 ${
                isDark ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'
              }`}
            />
          </label>
          {error && <p role="alert" className="text-sm text-red-500">{error}</p>}
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
            type="submit"
            disabled={busy}
            className="cursor-pointer rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busy ? 'Restoring...' : 'Re-store to Pending'}
          </button>
        </footer>
      </form>
    </div>
  );
}
