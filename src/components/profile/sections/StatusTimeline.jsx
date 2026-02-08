import React from 'react';
import { 
  FileText, 
  UserCheck, 
  Scale, 
  CreditCard, 
  Shield, 
  CheckCircle,
  Banknote
} from 'lucide-react';

export default function StatusTimeline() {
  const steps = [
    {
      id: 1,
      icon: FileText,
      title: 'Application',
      date: '15 Jan 2024',
      status: 'completed'
    },
    {
      id: 2,
      icon: UserCheck,
      title: 'KYC Verified',
      date: '16 Jan 2024',
      status: 'completed'
    },
    {
      id: 3,
      icon: Scale,
      title: 'Gold Evaluated',
      date: '16 Jan 2024',
      status: 'completed'
    },
    {
      id: 4,
      icon: CreditCard,
      title: 'Approved',
      date: '16 Jan 2024',
      status: 'completed'
    },
    {
      id: 5,
      icon: Shield,
      title: 'Active',
      date: '16 Jan 2024',
      status: 'current'
    },
    {
      id: 6,
      icon: Banknote,
      title: 'Closure',
      date: '15 Apr 2024',
      status: 'pending'
    }
  ];

  const getStatusIcon = (status, Icon) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-white" />;
      case 'current':
        return <Icon className="w-4 h-4 text-white" />;
      default:
        return <Icon className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStepStyle = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-500 border-emerald-400 shadow-md';
      case 'current':
        return 'bg-gradient-to-br from-amber-500 to-yellow-600 border-amber-400 shadow-lg ring-4 ring-amber-100';
      default:
        return 'bg-gray-200 border-gray-300';
    }
  };

  const getConnectorStyle = (index) => {
    const currentIndex = steps.findIndex(step => step.status === 'current');
    if (index < currentIndex) return 'border-emerald-500';
    if (index === currentIndex) return 'border-amber-500';
    return 'border-gray-300';
  };

  const getTextStyle = (status) => {
    switch (status) {
      case 'completed':
        return 'text-emerald-700 font-semibold';
      case 'current':
        return 'text-amber-700 font-bold';
      default:
        return 'text-gray-400 font-medium';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-amber-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 px-5 py-4 border-b-2 border-amber-400">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h3 className="text-lg font-bold text-white">Loan Status Timeline</h3>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/20 rounded-lg border border-amber-400/30">
            <span className="text-xs text-amber-200">Loan ID:</span>
            <span className="text-sm font-bold text-white">GL20240115678</span>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Timeline */}
        <div className="mb-6">
          {/* Steps Container */}
          <div className="flex items-start justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isFirst = index === 0;
              const isLast = index === steps.length - 1;
              
              return (
                <React.Fragment key={step.id}>
                  {/* Step Item */}
                  <div className={`flex flex-col ${isFirst ? 'items-start' : isLast ? 'items-end' : 'items-center'} ${!isFirst && !isLast ? 'flex-1' : ''}`}>
                    {/* Icon Circle */}
                    <div className={`relative w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${getStepStyle(step.status)}`}>
                      {getStatusIcon(step.status, Icon)}
                      
                      {/* Step Number Badge */}
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-white border-2 border-amber-200 rounded-full flex items-center justify-center shadow-sm">
                        <span className="text-[10px] font-bold text-gray-700">{index + 1}</span>
                      </div>
                    </div>
                    
                    {/* Step Info */}
                    <div className={`mt-2 ${isFirst ? 'text-left' : isLast ? 'text-right' : 'text-center'} max-w-[85px]`}>
                      <p className={`text-xs ${getTextStyle(step.status)} leading-tight`}>
                        {step.title}
                      </p>
                      <p className="text-[10px] text-gray-500 mt-0.5 whitespace-nowrap">
                        {step.date}
                      </p>
                    </div>
                  </div>
                  
                  {/* Dashed Connector Line */}
                  {index < steps.length - 1 && (
                    <div className={`flex-1 border-t-2 border-dashed mt-5 mx-2 transition-all duration-500 ${getConnectorStyle(index)}`}>
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Current Status Card */}
        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-200 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h4 className="font-bold text-gray-900 text-sm">Current Status</h4>
              <p className="text-xs text-gray-600">Last updated: Today, 2:30 PM</p>
            </div>
            <div className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-yellow-600 rounded-full">
              <span className="text-xs font-bold text-white">Active Loan</span>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mb-3">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-xs font-semibold text-gray-700">Loan Progress</span>
              <span className="text-xs font-bold text-amber-700">85%</span>
            </div>
            <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden shadow-inner">
              <div 
                className="h-full bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 rounded-full transition-all duration-500"
                style={{ width: '85%' }}
              ></div>
            </div>
          </div>
          
          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-lg p-3 border border-amber-200">
              <p className="text-xs text-gray-600 mb-1">Disbursed Amount</p>
              <p className="text-sm font-bold text-amber-700">₹2,50,000</p>
            </div>
            <div className="bg-white rounded-lg p-3 border border-amber-200">
              <p className="text-xs text-gray-600 mb-1">Next Due Date</p>
              <p className="text-sm font-bold text-amber-700">15 Feb 2024</p>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative top border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500"></div>
    </div>
  );
}