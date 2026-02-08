import React from 'react';
import { TrendingUp, DollarSign, Shield, Clock } from 'lucide-react';

export default function ProfileHeader() {
  const stats = [
    {
      icon: DollarSign,
      label: 'Total Loans',
      value: 'INR 4,75,000',
      change: '+2 Loans',
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-100',
      textColor: 'text-green-700'
    },
    {
      icon: TrendingUp,
      label: 'Active Loan',
      value: 'INR 2,50,000',
      change: 'Due in 15 days',
      color: 'from-blue-500 to-cyan-600',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-700'
    },
    {
      icon: Shield,
      label: 'Gold Value',
      value: 'INR 3,33,000',
      change: '+INR 12,000',
      color: 'from-amber-500 to-yellow-600',
      bgColor: 'bg-amber-100',
      textColor: 'text-amber-700'
    },
    {
      icon: Clock,
      label: 'Next Payment',
      value: 'INR 8,750',
      change: 'Due on 15 Feb 2024',
      color: 'from-slate-500 to-slate-700',
      bgColor: 'bg-slate-100',
      textColor: 'text-slate-700'
    }
  ];

  return (
    <div className="mb-8">
      <div className="bg-linear-to-r from-slate-900 via-slate-800 to-amber-900 rounded-3xl p-6 md:p-8 text-white mb-6 shadow-2xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              Welcome back, <span className="bg-linear-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent">Amit!</span>
            </h1>
            <p className="text-gray-300">
              Your gold loan dashboard is ready. Everything you need in one place.
            </p>
          </div>
          <div>
            <div className="inline-flex items-center px-4 py-2 bg-white/10 rounded-full border border-white/10">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
              <span className="text-sm">Account Active</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white/90 rounded-2xl p-5 shadow-lg border border-slate-200/70 hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.textColor}`} />
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-500">{stat.label}</div>
                <div className="text-xl font-bold text-gray-900">{stat.value}</div>
              </div>
            </div>
            <div className="flex items-center text-sm">
              <span className={`px-2 py-1 rounded-full ${stat.bgColor} ${stat.textColor} font-medium`}>
                {stat.change}
              </span>
              <div className={`ml-auto h-2 flex-1 bg-linear-to-r ${stat.color} rounded-full`}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
