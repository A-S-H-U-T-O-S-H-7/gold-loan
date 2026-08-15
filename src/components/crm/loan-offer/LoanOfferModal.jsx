'use client';
import Swal from 'sweetalert2';
import { GhostButton, PrimaryButton, DangerButton } from '@/components/crm/ui/FormControls';
import LoanOfferForm from './LoanOfferForm';
import LoanOfferSummary from './LoanOfferSummary';

export default function LoanOfferModal({
  isOpen,
  selected,
  offer,
  setOffer,
  computed,
  suggestedAmount,
  onClose,
  onSavePending,
  onReject,
  onAccept,
  isDark = false
}) {
  if (!isOpen || !selected) return null;

  const eligible = suggestedAmount(selected);

  // ✅ Reject with Swal confirmation
  const handleRejectClick = () => {
    Swal.fire({
      title: 'Reject Offer?',
      text: 'Are you sure you want to reject this loan offer?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#C62828',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, Reject!',
      cancelButtonText: 'Cancel',
      background: isDark ? '#1a1a2e' : '#ffffff',
      color: isDark ? '#f3f4f6' : '#111827',
    }).then((result) => {
      if (result.isConfirmed) {
        onReject();
      }
    });
  };

  // ✅ Accept with Swal confirmation
  const handleAcceptClick = () => {
    const amount = Number(offer.amount);
    const eligibleAmount = eligible;

    if (!amount || amount <= 0) {
      Swal.fire({
        title: 'Invalid Amount',
        text: 'Please enter a valid loan amount.',
        icon: 'error',
        confirmButtonColor: '#C9A84C',
        background: isDark ? '#1a1a2e' : '#ffffff',
        color: isDark ? '#f3f4f6' : '#111827',
      });
      return;
    }

    if (amount > eligibleAmount) {
      Swal.fire({
        title: 'Amount Exceeds Limit',
        text: `Loan amount cannot exceed eligible amount ₹${eligibleAmount.toLocaleString('en-IN')}`,
        icon: 'error',
        confirmButtonColor: '#C9A84C',
        background: isDark ? '#1a1a2e' : '#ffffff',
        color: isDark ? '#f3f4f6' : '#111827',
      });
      return;
    }

    if (!offer.note.trim()) {
      Swal.fire({
        title: 'Note Required',
        text: 'Please add an acceptance note before accepting.',
        icon: 'warning',
        confirmButtonColor: '#C9A84C',
        background: isDark ? '#1a1a2e' : '#ffffff',
        color: isDark ? '#f3f4f6' : '#111827',
      });
      return;
    }

    Swal.fire({
      title: 'Accept Offer?',
      html: `
        <div style="text-align: left;">
          <p><strong>Customer:</strong> ${selected?.customer?.name}</p>
          <p><strong>Amount:</strong> ₹${amount.toLocaleString('en-IN')}</p>
          <p><strong>Rate:</strong> ${offer.rate}%</p>
          <p><strong>Tenure:</strong> ${offer.tenure} months</p>
          <p><strong>Note:</strong> ${offer.note}</p>
        </div>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, Accept!',
      cancelButtonText: 'Cancel',
      background: isDark ? '#1a1a2e' : '#ffffff',
      color: isDark ? '#f3f4f6' : '#111827',
    }).then((result) => {
      if (result.isConfirmed) {
        onAccept();
      }
    });
  };

  // ✅ Save Pending with Swal confirmation
  const handleSavePendingClick = () => {
    const amount = Number(offer.amount);
    const eligibleAmount = eligible;

    if (!amount || amount <= 0) {
      Swal.fire({
        title: 'Invalid Amount',
        text: 'Please enter a valid loan amount.',
        icon: 'error',
        confirmButtonColor: '#C9A84C',
        background: isDark ? '#1a1a2e' : '#ffffff',
        color: isDark ? '#f3f4f6' : '#111827',
      });
      return;
    }

    if (amount > eligibleAmount) {
      Swal.fire({
        title: 'Amount Exceeds Limit',
        text: `Loan amount cannot exceed eligible amount ₹${eligibleAmount.toLocaleString('en-IN')}`,
        icon: 'error',
        confirmButtonColor: '#C9A84C',
        background: isDark ? '#1a1a2e' : '#ffffff',
        color: isDark ? '#f3f4f6' : '#111827',
      });
      return;
    }

    Swal.fire({
      title: 'Save as Pending?',
      text: 'This offer will be saved as pending for later.',
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#C9A84C',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, Save',
      cancelButtonText: 'Cancel',
      background: isDark ? '#1a1a2e' : '#ffffff',
      color: isDark ? '#f3f4f6' : '#111827',
    }).then((result) => {
      if (result.isConfirmed) {
        onSavePending();
      }
    });
  };

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}  // ✅ Click on backdrop closes modal
    >
      <div 
        className={`relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl border-2 p-6 ${
          isDark
            ? 'bg-gray-800 border-gold-700/50'
            : 'bg-white border-gold-200'
        }`}
        onClick={(e) => e.stopPropagation()}  // ✅ Prevents closing when clicking inside modal
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-xl font-bold ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
            Loan Offer — {selected?.id || ''}
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
        <div className="mb-4 p-3 rounded-lg bg-gold-50/50 dark:bg-gold-900/20 border border-gold-200 dark:border-gold-700/30">
          <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Customer: <span className="font-semibold">{selected?.customer?.name}</span> | 
            Mobile: <span className="font-semibold">{selected?.customer?.mobile}</span>
          </p>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Eligible Amount: <span className="font-semibold text-gold-600 dark:text-gold-400">
              {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(eligible)}
            </span>
          </p>
        </div>

        {/* Form */}
        <LoanOfferForm
          offer={offer}
          setOffer={setOffer}
          isDark={isDark}
          eligibleAmount={eligible}
          computed={computed}
        />

        {/* Summary */}
        <LoanOfferSummary computed={computed} isDark={isDark} />

        {/* Footer */}
        <div className="flex flex-wrap gap-3 mt-6 pt-4 border-t border-gold-200/50 dark:border-gold-700/30 justify-end">
          <GhostButton onClick={onClose}>
            Close
          </GhostButton>
          <GhostButton onClick={handleSavePendingClick}>
            Save Pending
          </GhostButton>
          <DangerButton onClick={handleRejectClick}>
            Reject
          </DangerButton>
          <PrimaryButton onClick={handleAcceptClick}>
            Customer Accepted
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}