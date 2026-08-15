'use client';
import { GhostButton, PrimaryButton, DangerButton, Field, inputClass } from '@/components/crm/ui/FormControls';
import { formatCurrency } from '@/lib/utils/format';

export default function TransactionModal({
  isOpen,
  selected,
  referenceId,
  setReferenceId,
  failReason,
  setFailReason,
  onClose,
  onConfirm,
  onFail,
  isDark = false,
  isFinance = false
}) {
  if (!isOpen || !selected) return null;

  const amount = selected.loan?.approvedAmount || selected.loan?.amount || 0;
  const mode = selected.disbursement?.mode || selected.transaction?.mode || '—';
  const name = selected.customer?.name || '—';
  const accountNumber = selected.customer?.bankDetails?.accountNumber || '—';
  const ifsc = selected.customer?.bankDetails?.ifscCode || '—';
  const completedAt = selected.transaction?.completedAt;

  // Determine if transfer is already done
  const isTransferred = selected.transaction?.status === 'SUCCESS';

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className={`relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl border-2 p-6 ${
          isDark
            ? 'bg-gray-800 border-gold-700/50'
            : 'bg-white border-gold-200'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-xl font-bold ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
            {isTransferred ? 'Transfer Record' : 'Complete Transfer'}
          </h2>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors ${
              isDark
                ? 'hover:bg-gray-700 text-gray-400 hover:text-gray-200'
                : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Amount Card */}
        <div className={`p-4 rounded-xl text-center mb-4 ${
          isDark
            ? 'bg-blue-900/20 border border-blue-700/30'
            : 'bg-blue-50 border border-blue-200'
        }`}>
          <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Amount</p>
          <p className={`text-3xl font-mono font-semibold mt-1 ${
            isDark ? 'text-blue-400' : 'text-blue-700'
          }`}>
            {formatCurrency(amount)}
          </p>
          <p className={`text-xs mt-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Mode: {mode}
          </p>
        </div>

        {/* Customer Details */}
        {!isFinance && !isTransferred && (
          <div className={`p-3 rounded-lg mb-4 ${
            isDark ? 'bg-gray-700/50' : 'bg-gold-50/50'
          }`}>
            <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              <span className="font-medium">Customer:</span> {name}
            </p>
            <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              <span className="font-medium">Account:</span> {accountNumber}
            </p>
            <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              <span className="font-medium">IFSC:</span> {ifsc}
            </p>
          </div>
        )}

        {completedAt && (
          <p className={`text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Completed: {new Date(completedAt).toLocaleString()}
          </p>
        )}

        {/* Transfer Form */}
        {!isTransferred && (
          <>
            <Field label="Reference ID (UTR / UPI ref)">
              <input
                className={inputClass}
                value={referenceId}
                onChange={(e) => setReferenceId(e.target.value)}
                placeholder="Enter reference ID"
              />
            </Field>

            <Field label="Failure reason (if failing)">
              <input
                className={inputClass}
                value={failReason}
                onChange={(e) => setFailReason(e.target.value)}
                placeholder="Enter failure reason"
              />
            </Field>
          </>
        )}

        {/* Footer */}
        <div className="flex flex-wrap gap-3 mt-6 pt-4 border-t border-gold-200/50 dark:border-gold-700/30 justify-end">
          <GhostButton onClick={onClose}>
            Close
          </GhostButton>
          {!isTransferred && (
            <>
              <DangerButton onClick={onFail}>
                Mark Failed
              </DangerButton>
              <PrimaryButton onClick={onConfirm}>
                Confirm Transfer
              </PrimaryButton>
            </>
          )}
        </div>
      </div>
    </div>
  );
}