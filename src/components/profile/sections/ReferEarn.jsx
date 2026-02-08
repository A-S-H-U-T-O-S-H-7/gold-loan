'use client';

import React, { useState } from 'react';
import { Gift, Share2, Copy, Users, TrendingUp, Star } from 'lucide-react';

export default function ReferEarn() {
  const [copied, setCopied] = useState(false);
  const referralCode = 'GOLDSECURE123';
  const referralLink = `https://goldsecure.com/apply?ref=${referralCode}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const stats = [
    { label: 'Total Referrals', value: '12', icon: Users, color: 'from-blue-500 to-cyan-600' },
    { label: 'Success Rate', value: '83%', icon: TrendingUp, color: 'from-green-500 to-emerald-600' },
    { label: 'Earnings', value: 'INR 6,000', icon: Gift, color: 'from-amber-500 to-orange-600' }
  ];

  const referrals = [
    { name: 'Rahul Sharma', date: '15 Jan 2024', status: 'Completed', reward: 'INR 500' },
    { name: 'Priya Patel', date: '10 Jan 2024', status: 'Active', reward: 'Pending' },
    { name: 'Ankit Verma', date: '05 Jan 2024', status: 'Completed', reward: 'INR 500' },
    { name: 'Neha Gupta', date: '28 Dec 2023', status: 'Pending', reward: 'Pending' }
  ];

  return (
    <div className="bg-linear-to-br from-amber-50 to-yellow-50 rounded-3xl shadow-xl border border-amber-200/70 overflow-hidden">
      <div className="bg-linear-to-r from-amber-500 to-orange-600 text-white p-6">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mr-4">
            <Gift className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold">Refer and Earn</h3>
            <p className="opacity-90">Earn INR 500 for every successful referral</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-3 gap-4 mb-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white/60 rounded-xl p-4 text-center backdrop-blur-sm border border-white/60">
              <div className="w-10 h-10 bg-linear-to-br from-white to-white/80 rounded-lg flex items-center justify-center mx-auto mb-2 shadow-sm">
                <stat.icon className={`h-5 w-5 bg-linear-to-r ${stat.color} bg-clip-text text-transparent`} />
              </div>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-xs text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="mb-6">
          <div className="text-sm text-gray-600 mb-2">Your Referral Code</div>
          <div className="flex items-center">
            <div className="flex-1 bg-white rounded-xl p-4 border border-amber-200/70 shadow-sm">
              <div className="font-mono font-bold text-2xl text-gray-900 tracking-wider">
                {referralCode}
              </div>
            </div>
            <button
              onClick={copyToClipboard}
              className="ml-3 p-3 bg-linear-to-r from-amber-500 to-orange-600 text-white rounded-xl hover:shadow-lg transition"
            >
              {copied ? <CheckCircleIcon className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
            </button>
          </div>
          <div className="text-xs text-gray-500 mt-2 text-center">
            {copied ? 'Copied to clipboard!' : 'Click to copy code'}
          </div>
        </div>

        <div className="mb-6">
          <div className="text-sm text-gray-600 mb-3">Share via</div>
          <div className="grid grid-cols-4 gap-3">
            {['WhatsApp', 'Email', 'SMS', 'More'].map((platform) => (
              <button
                key={platform}
                className="p-3 bg-white rounded-xl border border-amber-200/70 hover:bg-white/80 transition"
              >
                <Share2 className="h-5 w-5 text-gray-600 mx-auto mb-1" />
                <div className="text-xs font-medium text-gray-700">{platform}</div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Users className="h-5 w-5 text-gray-600 mr-2" />
              <h4 className="font-bold text-gray-900">Recent Referrals</h4>
            </div>
            <Star className="h-5 w-5 text-amber-500" />
          </div>

          <div className="space-y-3">
            {referrals.map((ref, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-white/80 rounded-xl backdrop-blur-sm border border-white/70">
                <div>
                  <div className="font-medium text-gray-900">{ref.name}</div>
                  <div className="text-xs text-gray-600">{ref.date}</div>
                </div>
                <div className="text-right">
                  <div
                    className={`text-sm font-medium ${
                      ref.status === 'Completed'
                        ? 'text-green-600'
                        : ref.status === 'Active'
                        ? 'text-blue-600'
                        : 'text-amber-600'
                    }`}
                  >
                    {ref.status}
                  </div>
                  <div className="text-xs font-bold text-amber-700">{ref.reward}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="px-6 py-4 border-t border-amber-200/70 bg-white/60">
        <button className="w-full py-3 bg-linear-to-r from-amber-500 to-orange-600 text-white rounded-xl font-bold hover:shadow-lg transition">
          View All Referrals
        </button>
      </div>
    </div>
  );
}

function CheckCircleIcon(props) {
  return (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  );
}
