import React from 'react';
import { CreditCard, Calendar, TrendingUp, AlertCircle, ChevronRight } from 'lucide-react';

export default function LoanCard({ 
  loanId, 
  amount, 
  interest, 
  tenure, 
  dueDate, 
  status = 'active' 
}) {
  const getStatusColor = (status) => {
    switch(status.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'overdue': return 'bg-red-100 text-red-700';
      case 'pending': return 'bg-amber-100 text-amber-700';
      case 'closed': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status) => {
    switch(status.toLowerCase()) {
      case 'active': return TrendingUp;
      case 'overdue': return AlertCircle;
      default: return CreditCard;
    }
  };

  const StatusIcon = getStatusIcon(status);

  return (
    <div className="bg-white/90 rounded-3xl shadow-xl border border-slate-200/70 p-6 hover:shadow-2xl transition-all duration-300 group">
      {/* Card Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-linear-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center mr-4">
            <CreditCard className="h-6 w-6 text-white" />
          </div>
          <div>
            <div className="text-sm text-gray-600">Loan Account</div>
            <div className="font-bold text-gray-900 text-lg">{loanId}</div>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(status)} flex items-center`}>
          <StatusIcon className="h-4 w-4 mr-1" />
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </div>
      </div>

      {/* Loan Details */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
          <div className="text-sm text-gray-600 mb-2">Loan Amount</div>
          <div className="text-2xl font-bold text-primary-600">{amount}</div>
        </div>
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
          <div className="text-sm text-gray-600 mb-2">Interest Rate</div>
          <div className="text-2xl font-bold text-amber-600">{interest}</div>
        </div>
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
          <div className="text-sm text-gray-600 mb-2">Tenure</div>
          <div className="text-xl font-bold text-gray-900">{tenure}</div>
        </div>
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
          <div className="text-sm text-gray-600 mb-2">Next Due</div>
          <div className="text-xl font-bold text-gray-900">{dueDate}</div>
        </div>
      </div>

      {/* Progress Bar */}
      {status === 'active' && (
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Repayment Progress</span>
            <span>65%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-linear-to-r from-green-500 to-emerald-600 rounded-full"
              style={{ width: '65%' }}
            ></div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button className="flex-1 py-3 bg-primary-500 text-white rounded-xl font-bold hover:bg-primary-600 transition group-hover:shadow-lg">
          Pay Now
        </button>
        <button className="px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition">
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Quick Info */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="h-4 w-4 mr-2" />
          Disbursed on 16 Jan 2024
        </div>
      </div>
    </div>
  );
}
