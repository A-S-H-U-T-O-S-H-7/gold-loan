'use client';
import { GhostButton, PrimaryButton } from '@/components/crm/ui/FormControls';
import DisbursementDocumentList from './DisbursementDocumentList';
import DisbursementForm from './DisbursementForm';
import { formatCurrency } from '@/lib/utils/format';

export default function DisbursementModal({
  isOpen,
  selected,
  form,
  setForm,
  onClose,
  onSubmit,
  isDark = false
}) {
  if (!isOpen || !selected) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className={`relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl border-2 p-6 ${
          isDark
            ? 'bg-gray-800 border-gold-700/50'
            : 'bg-white border-gold-200'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-xl font-bold ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
            Disbursement — {selected?.id || ''}
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

        {/* Customer Info */}
        <div className="mb-4 p-3 rounded-lg bg-teal-50/50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-700/30">
          <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Customer: <span className="font-semibold">{selected?.customer?.name}</span> | 
            Mobile: <span className="font-semibold">{selected?.customer?.mobile}</span>
          </p>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Amount: <span className="font-semibold text-teal-600 dark:text-teal-400">
              {formatCurrency(selected?.loan?.approvedAmount || selected?.loan?.amount || 0)}
            </span>
          </p>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Bank: <span className="font-semibold">{selected?.customer?.bankDetails?.bankName || '—'}</span> | 
            Account: <span className="font-semibold">{selected?.customer?.bankDetails?.accountNumber || '—'}</span>
          </p>
        </div>

        {/* Documents */}
        <DisbursementDocumentList applicationId={selected?.id} isDark={isDark} />

        {/* Form */}
        <div className="mt-4">
          <h4 className={`text-sm font-semibold mb-3 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
            Disbursement Details
          </h4>
          <DisbursementForm form={form} setForm={setForm} isDark={isDark} />
        </div>

        {/* Footer */}
        <div className="flex flex-wrap gap-3 mt-6 pt-4 border-t border-gold-200/50 dark:border-gold-700/30 justify-end">
          <GhostButton onClick={onClose}>
            Cancel
          </GhostButton>
          <PrimaryButton onClick={onSubmit}>
            Mark Ready for Transfer
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}