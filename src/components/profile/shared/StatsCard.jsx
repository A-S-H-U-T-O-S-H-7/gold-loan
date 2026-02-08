import React from 'react';

export default function StatsCard({ 
  icon: Icon, 
  label, 
  value, 
  change, 
  color = 'from-blue-500 to-blue-600',
  bgColor = 'bg-blue-100',
  textColor = 'text-blue-700',
  trend = 'up' 
}) {
  return (
    <div className="bg-white/90 rounded-3xl shadow-xl border border-slate-200/70 p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-0.5">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${bgColor} shadow-sm`}>
          <Icon className={`h-6 w-6 ${textColor}`} />
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-500 uppercase tracking-wider">{label}</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">{value}</div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
          trend === 'up' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {trend === 'up' ? (
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )}
          {change}
        </div>
        <div className="w-24">
          <div className={`h-2 rounded-full bg-linear-to-r ${color}`}></div>
        </div>
      </div>
    </div>
  );
}
