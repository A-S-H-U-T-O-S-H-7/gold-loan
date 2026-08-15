'use client';
import { X } from 'lucide-react';
import StatusBadge from '@/components/crm/ui/StatusBadge';
import ManageLoansSummary from './ManageLoansSummary';
import ManageLoansRepaymentSchedule from './ManageLoansRepaymentSchedule';
import ManageLoansPaymentHistory from './ManageLoansPaymentHistory';
import CustomerInfoCard from '@/components/crm/gold-evaluation/CustomerInfoCard';
import { formatCurrency } from '@/lib/utils/format';  // ✅ ADD THIS IMPORT

export default function ManageLoansModal({
  isOpen,
  application,
  onClose,
  isDark = false
}) {
  if (!isOpen || !application) return null;

  const customer = application.customer || {};

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className={`relative w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl border-2 p-6 ${
          isDark
            ? 'bg-gray-800 border-gold-700/50'
            : 'bg-white border-gold-200'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6 sticky top-0 bg-inherit z-10 pb-4 border-b border-gold-200/50 dark:border-gold-700/30">
          <div className="flex items-center gap-3">
            <h2 className={`text-xl font-bold ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
              Loan Details — {application.id}
            </h2>
            <StatusBadge status={application.status} />
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors ${
              isDark
                ? 'hover:bg-gray-700 text-gray-400 hover:text-gray-200'
                : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Customer Info with KYC */}
        <div className="mb-6">
          <CustomerInfoCard
            customerDetails={{
              ...customer,
              id: application.id,
              kycDate: application.timeline?.kycVerifiedAt,
              documents: customer.documents || {},
              nominee: customer.nominee || {},
              guarantor: customer.guarantor || {},
            }}
            isDark={isDark}
          />
        </div>

        {/* Gold Details */}
        {application.gold && (
          <div className={`rounded-xl border-2 p-4 mb-6 ${
            isDark ? 'border-gold-700/30 bg-gray-800/50' : 'border-gold-200 bg-gold-50/30'
          }`}>
            <h4 className={`text-sm font-semibold mb-3 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
              Gold Details
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className={`p-2 rounded-lg ${isDark ? 'bg-gray-700/50' : 'bg-white/50'}`}>
                <p className={`text-[10px] uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Gold Weight</p>
                <p className={`text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>{application.gold.netWeight || 0}g</p>
              </div>
              <div className={`p-2 rounded-lg ${isDark ? 'bg-gray-700/50' : 'bg-white/50'}`}>
                <p className={`text-[10px] uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Purity</p>
                <p className={`text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>{application.gold.purity || '—'}</p>
              </div>
              <div className={`p-2 rounded-lg ${isDark ? 'bg-gray-700/50' : 'bg-white/50'}`}>
                <p className={`text-[10px] uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Gold Value</p>
                <p className={`text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>{formatCurrency(application.gold.goldValue || 0)}</p>
              </div>
              <div className={`p-2 rounded-lg ${isDark ? 'bg-gray-700/50' : 'bg-white/50'}`}>
                <p className={`text-[10px] uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Locker ID</p>
                <p className={`text-sm font-medium ${isDark ? 'text-gold-400' : 'text-gold-600'}`}>{application.lockerId || 'Not Assigned'}</p>
              </div>
            </div>
            {application.gold.items && application.gold.items.length > 0 && (
              <div className="mt-3">
                <p className={`text-xs font-medium mb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Gold Items</p>
                <div className="flex flex-wrap gap-2">
                  {application.gold.items.map((item, idx) => (
                    <span
                      key={idx}
                      className={`px-2.5 py-1 rounded-full text-xs ${
                        isDark
                          ? 'bg-gold-900/30 text-gold-300 border border-gold-700/30'
                          : 'bg-gold-100 text-gold-700 border border-gold-200'
                      }`}
                    >
                      {item.itemType} - {item.netWeight}g ({item.purity})
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Timeline */}
        {application.timeline && (
          <div className={`rounded-xl border-2 p-4 mb-6 ${
            isDark ? 'border-gold-700/30 bg-gray-800/50' : 'border-gold-200 bg-gold-50/30'
          }`}>
            <h4 className={`text-sm font-semibold mb-3 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
              Timeline
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Object.entries(application.timeline).map(([key, value]) => {
                if (!value) return null;
                const label = key.replace(/At$/, '').replace(/([A-Z])/g, ' $1').trim();
                return (
                  <div key={key} className={`p-2 rounded-lg ${isDark ? 'bg-gray-700/50' : 'bg-white/50'}`}>
                    <p className={`text-[10px] uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{label}</p>
                    <p className={`text-xs font-medium ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                      {new Date(value).toLocaleString()}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Loan Summary */}
        <ManageLoansSummary application={application} isDark={isDark} />

        {/* Repayment Schedule */}
        <div className="mt-6">
          <ManageLoansRepaymentSchedule schedule={application.repaymentSchedule} isDark={isDark} />
        </div>

        {/* Payment History */}
        <div className="mt-6">
          <ManageLoansPaymentHistory payments={application.payments} isDark={isDark} />
        </div>

        {/* Footer */}
        <div className="flex justify-end mt-6 pt-4 border-t border-gold-200/50 dark:border-gold-700/30">
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded font-medium transition-all duration-200 ${
              isDark
                ? 'bg-gray-700 hover:bg-gray-600 text-white'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
            }`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}