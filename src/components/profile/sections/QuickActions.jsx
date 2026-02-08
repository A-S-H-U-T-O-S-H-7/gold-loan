'use client';

import React, { useState } from 'react';
import { FileText, Scale, PlusCircle, Download, Eye, ChevronRight } from 'lucide-react';
import KYCModal from '../modals/KYCModal';
import GoldDetailsModal from '../modals/GoldDetailsModal';
import ApplyLoanModal from '../modals/ApplyLoanModal';

export default function QuickActions() {
  const [showKYCModal, setShowKYCModal] = useState(false);
  const [showGoldModal, setShowGoldModal] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);

  const actions = [
    {
      icon: FileText,
      title: 'KYC Details',
      gradient: 'from-blue-500 to-cyan-600',
      iconBg: 'bg-blue-500',
      action: () => setShowKYCModal(true)
    },
    {
      icon: Scale,
      title: 'Gold Details',
      gradient: 'from-amber-500 to-yellow-600',
      iconBg: 'bg-amber-500',
      action: () => setShowGoldModal(true)
    },
    {
      icon: PlusCircle,
      title: 'Apply New Loan',
      gradient: 'from-emerald-500 to-green-600',
      iconBg: 'bg-emerald-500',
      action: () => setShowApplyModal(true)
    },
    {
      icon: Download,
      title: 'Documents',
      gradient: 'from-gray-600 to-gray-800',
      iconBg: 'bg-gray-700',
      action: () => alert('Opening documents...')
    },
  ];

  return (
    <>
      <div className="bg-gradient-to-br from-white via-amber-50/30 to-white rounded-xl shadow-md border border-amber-200 overflow-hidden mt-6">
        {/* Compact Golden Header */}
        <div className="bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 px-4 py-2.5">
          <h3 className="text-base font-bold text-white">Quick Actions</h3>
        </div>

        <div className="p-4">
          {/* Action Buttons Grid - Fixed spacing */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            {actions.map((action, index) => {
              const Icon = action.icon;
              return (
                <button
                  key={index}
                  onClick={action.action}
                  className="group w-full flex items-center gap-3 bg-white hover:bg-gradient-to-r hover:from-amber-50 hover:to-yellow-50 border border-gray-200 hover:border-amber-300 rounded-lg px-4 py-3 transition-all duration-200 hover:shadow-md active:scale-[0.98]"
                >
                  {/* Icon Circle */}
                  <div className={`w-10 h-10 ${action.iconBg} rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  
                  {/* Title and Arrow Container */}
                  <div className="flex flex-1 items-center justify-between min-w-0">
                    <span className="text-sm font-semibold text-gray-800 group-hover:text-amber-700 transition-colors truncate">
                      {action.title}
                    </span>
                    
                    {/* Arrow */}
                    <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-amber-600 group-hover:translate-x-1 transition-all flex-shrink-0 ml-2" />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Last Login Card */}
          <div className="flex items-center gap-3 bg-gradient-to-r from-emerald-500 to-green-600 rounded-lg px-4 py-3 shadow-sm">
            <div className="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
              <Eye className="h-4.5 w-4.5 text-white" />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-white">Last Login</div>
              <div className="text-xs text-white/90 truncate mt-0.5">Today, 9:42 AM • Bangalore</div>
            </div>
            
            <button className="px-3 py-1.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-lg text-xs font-semibold transition-colors flex-shrink-0 border border-white/30 active:scale-95">
              View Log
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showKYCModal && <KYCModal onClose={() => setShowKYCModal(false)} />}
      {showGoldModal && <GoldDetailsModal onClose={() => setShowGoldModal(false)} />}
      {showApplyModal && <ApplyLoanModal onClose={() => setShowApplyModal(false)} />}
    </>
  );
}