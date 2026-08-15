'use client';
import { ArrowLeft, User, Phone, Mail, FileText } from 'lucide-react';
import StatusBadge from '@/components/crm/ui/StatusBadge';
import { formatCurrency } from '@/lib/utils/format';

export default function CreditReviewHeader({ application, onBack, isDark = false }) {
  const customer = application?.customer || {};
  const loan = application?.loan || {};

  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={onBack}
          className={`p-2.5 rounded-lg transition-all duration-200 hover:scale-105 flex-shrink-0 ${
            isDark
              ? "hover:bg-gray-800 bg-gray-800/50 border border-gold-600/30"
              : "hover:bg-gold-50 bg-gold-50/50 border border-gold-200"
          }`}
        >
          <ArrowLeft className={`w-4 h-4 ${isDark ? "text-gold-400" : "text-gold-600"}`} />
        </button>
        <h1 className={`text-xl md:text-2xl font-bold ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
          Credit Review - {application?.id}
        </h1>
        <StatusBadge status={application?.status} />
      </div>

      {/* Customer Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={`p-4 rounded-xl border ${
          isDark ? 'bg-gray-800/50 border-gold-700/30' : 'bg-white/50 border-gold-200'
        }`}>
          <div className="flex items-center gap-2">
            <User className={`w-4 h-4 ${isDark ? 'text-gold-400' : 'text-gold-600'}`} />
            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Customer</p>
          </div>
          <p className={`text-sm font-semibold mt-1 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
            {customer.name || '—'}
          </p>
        </div>

        <div className={`p-4 rounded-xl border ${
          isDark ? 'bg-gray-800/50 border-gold-700/30' : 'bg-white/50 border-gold-200'
        }`}>
          <div className="flex items-center gap-2">
            <Phone className={`w-4 h-4 ${isDark ? 'text-gold-400' : 'text-gold-600'}`} />
            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Mobile</p>
          </div>
          <p className={`text-sm font-semibold mt-1 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
            {customer.mobile || '—'}
          </p>
        </div>

        <div className={`p-4 rounded-xl border ${
          isDark ? 'bg-gray-800/50 border-gold-700/30' : 'bg-white/50 border-gold-200'
        }`}>
          <div className="flex items-center gap-2">
            <Mail className={`w-4 h-4 ${isDark ? 'text-gold-400' : 'text-gold-600'}`} />
            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Email</p>
          </div>
          <p className={`text-sm font-semibold mt-1 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
            {customer.email || '—'}
          </p>
        </div>

        <div className={`p-4 rounded-xl border ${
          isDark ? 'bg-gray-800/50 border-gold-700/30' : 'bg-white/50 border-gold-200'
        }`}>
          <div className="flex items-center gap-2">
            <FileText className={`w-4 h-4 ${isDark ? 'text-gold-400' : 'text-gold-600'}`} />
            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Offered Amount</p>
          </div>
          <p className={`text-sm font-semibold mt-1 text-gold-600 dark:text-gold-400`}>
            {formatCurrency(loan.offeredAmount || loan.amount || 0)}
          </p>
        </div>
      </div>
    </div>
  );
}