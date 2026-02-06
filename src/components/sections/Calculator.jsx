'use client';

import React, { useState } from 'react';
import { Calculator, Scale, Percent, DollarSign, Sparkles, TrendingUp, Shield, Clock, ChevronRight, Gem, IndianRupee, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function GoldCalculator() {
  const [weight, setWeight] = useState('');
  const [purity, setPurity] = useState('22K');
  const [goldRate, setGoldRate] = useState(6000);

  const purityMultiplier = {
    '24K': 1,
    '22K': 0.916,
    '18K': 0.75
  };

  const calculateLoanAmount = () => {
    if (!weight || isNaN(parseFloat(weight))) return 0;
    const netWeight = parseFloat(weight);
    const multiplier = purityMultiplier[purity] || 0.916; // Default to 22K if not found
    const goldValue = netWeight * goldRate * multiplier;
    const ltv = 75; // Fixed LTV at 75%
    const loanAmount = (goldValue * ltv) / 100;
    return Math.round(loanAmount);
  };

  const calculateGoldValue = () => {
    if (!weight || isNaN(parseFloat(weight))) return 0;
    const netWeight = parseFloat(weight);
    const multiplier = purityMultiplier[purity] || 0.916;
    return Math.round(netWeight * goldRate * multiplier);
  };

  const calculateMonthlyInterest = () => {
    const loanAmount = calculateLoanAmount();
    const interestRate = 0.79;
    return Math.round((loanAmount * interestRate) / 100);
  };

  return (
    <section className="py-6 md:py-8 bg-linear-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 w-full ">
        {/* Header */}
        <div className="text-center mb-8 md:mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 md:py-2.5 rounded-full bg-linear-to-r from-amber-50 to-orange-50 border border-amber-200 text-amber-700 mb-4">
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-semibold">Gold Loan Calculator</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Calculate Your Gold Loan <span className="text-amber-600">Instantly</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Find out how much you can borrow against your gold in seconds
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Calculator Form */}
          <div className="lg:col-span-2 space-y-4">
            {/* Gold Weight Input */}
            <div className="bg-white rounded-2xl shadow-lg px-4 py-2 md:py-4 md:px-6 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-amber-50 rounded-lg">
                    <Scale className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className=" text-lg md:text-xl font-bold text-gray-900">Gold Weight</h3>
                    <p className=" text-sm text-gray-500">Enter weight in grams</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-amber-600">{weight || '0'}g</div>
                  <div className="text-sm text-gray-500">Total weight</div>
                </div>
              </div>
              
              <div className="relative  text-gray-800">
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="Enter gold weight"
                  className="w-full px-4 md:px-6 py-1 md:py-2 text-lg md:text-xl font-semibold bg-gray-50 border-2 border-gray-200 text-gray-800 rounded-lg md:rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition-all outline-none"
                  min="1"
                  max="1000"
                  step="0.1"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2  font-medium">grams</div>
              </div>
              
              <div className="grid grid-cols-4 gap-2 md:gap-3 mt-4 md:mt-6">
                {[10, 20, 50, 100].map((value) => (
                  <button
                    key={value}
                    onClick={() => setWeight(value.toString())}
                    className={`py-1 md:py-2 rounded-lg md:rounded-xl font-semibold transition-all ${weight === value.toString()
                        ? 'bg-amber-500 text-white shadow-lg shadow-amber-200'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                  >
                    {value}g
                  </button>
                ))}
              </div>
            </div>

            {/* Gold Purity Selection */}
            <div className="bg-white rounded-2xl shadow-lg p-3 md:p-6 border border-gray-100">
  <div className="flex items-center gap-3 mb-4">
    <div className="p-2 bg-blue-50 rounded-lg">
      <Gem className="h-5 w-5 md:h-6 md:w-6 text-blue-600" />
    </div>
    <div>
      <h3 className="text-lg md:text-xl font-bold text-gray-900">Gold Purity</h3>
      <p className="text-xs md:text-sm text-gray-500">Select your gold purity level</p>
    </div>
  </div>
  
  {/* Changed to grid-cols-3 for mobile too */}
  <div className="grid grid-cols-3 gap-2 md:gap-4">
    {[
      { value: '24K', label: '24K', purity: '99.9%', color: 'bg-amber-500' },
      { value: '22K', label: '22K', purity: '91.6%', color: 'bg-amber-400' },
      { value: '18K', label: '18K', purity: '75%', color: 'bg-amber-300' },
    ].map((item) => (
      <button
        key={item.value}
        onClick={() => setPurity(item.value)}
        className={`p-2 md:p-3 rounded-lg border transition-all relative overflow-hidden group ${purity === item.value
            ? 'border-amber-500 bg-amber-50 shadow-md shadow-amber-100'
            : 'border-gray-200 hover:border-amber-300 hover:bg-amber-50/50'
          }`}
      >
        <div className="flex flex-col items-center justify-center text-center">
          {/* Karat badge - smaller on mobile */}
          <div className={`inline-flex items-center px-2 py-1 rounded-full mb-2 ${purity === item.value ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'}`}>
            <div className={`w-1.5 h-1.5 rounded-full ${item.color} mr-1.5`}></div>
            <span className="font-bold text-xs">{item.value}</span>
          </div>
          
          {/* Label */}
          <div className="font-bold text-sm md:text-base text-gray-900">{item.label}</div>
          
          {/* Purity - smaller text */}
          <div className="text-xs md:text-sm text-gray-500 mt-0.5">{item.purity}</div>
          
          {/* Checkmark indicator - smaller */}
          {purity === item.value && (
            <div className="absolute right-1 top-1 md:right-2 md:top-2">
              <div className="w-5 h-5 md:w-6 md:h-6 bg-amber-500 rounded-full flex items-center justify-center">
                <svg className="w-2.5 h-2.5 md:w-3 md:h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          )}
        </div>
      </button>
    ))}
  </div>
</div>

            {/* Gold Rate Selection */}
            <div className="bg-white rounded-2xl shadow-lg px-4 py-2 md:px-6 md:py-4 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-green-50 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Gold Rate Today</h3>
                    <p className="text-sm text-gray-500">Current market price per gram</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">₹{goldRate.toLocaleString()}</div>
                  <div className="text-sm text-gray-500">per gram</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[5800, 6000, 6200, 6500].map((rate) => (
                  <button
                    key={rate}
                    onClick={() => setGoldRate(rate)}
                    className={`py-2 rounded-xl font-semibold transition-all ${goldRate === rate
                        ? 'bg-green-500 text-white shadow-lg shadow-green-200'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                  >
                    ₹{rate.toLocaleString()}
                  </button>
                ))}
              </div>
              
              <div className="mt-6 p-2 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center justify-between">
                  <span className="text-green-700 font-medium">Live Gold Rate</span>
                  <span className="text-green-700 font-bold flex items-center">
                    ₹{goldRate.toLocaleString()}/g
                    <TrendingUp className="h-4 w-4 ml-2" />
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Results Panel */}
          <div className="space-y-3">
            {/* Loan Amount Card */}
            <div className="bg-linear-to-br from-amber-500 via-amber-600 to-orange-600 text-white rounded-2xl px-4 py-2 md:px-6 md:py-3 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full translate-y-20 -translate-x-20"></div>
              
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-2">Your Loan Estimate</h3>
                <p className="text-amber-100 mb-2">Based on your inputs</p>
                
                <div className="space-y-2">
                  <div className="text-center">
                    <div className="text-lg opacity-90 mb-1">Maximum Loan Amount</div>
                    <div className="text-4xl font-bold mb-2">
                      ₹{calculateLoanAmount().toLocaleString()}
                    </div>
                    <div className="text-amber-100 bg-white/10 py-2 px-4 rounded-full inline-flex items-center text-sm">
                      <Shield className="h-4 w-4 mr-2" />
                      At 75% Loan-to-Value
                    </div>
                  </div>

                  <div className="bg-white/10 backdrop-blur-sm rounded-xl px-2 py-1 border border-white/20">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center pb-3 border-b border-white/20">
                        <div className="flex items-center">
                          <Scale className="h-5 w-5 mr-3 opacity-80" />
                          <span>Gold Value</span>
                        </div>
                        <span className="font-bold text-xl">
                          ₹{calculateGoldValue().toLocaleString()}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center pb-3 border-b border-white/20">
                        <div className="flex items-center">
                          <Percent className="h-5 w-5 mr-3 opacity-80" />
                          <span>Monthly Interest</span>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-xl">₹{calculateMonthlyInterest().toLocaleString()}</div>
                          <div className="text-sm opacity-80">@ 0.79% p.m.</div>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <Clock className="h-5 w-5 mr-3 opacity-80" />
                          <span>Processing Time</span>
                        </div>
                        <span className="font-bold">30 Minutes</span>
                      </div>
                    </div>
                  </div>

                  <Link  href="/apply">
                  <button className="w-full mt-3 cursor-pointer bg-white text-amber-600 py-1 md:py-2 rounded-lg md:rounded-xl font-bold text-lg hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center group">
                    Apply Now
                    <ChevronRight className="h-5 w-5 ml-2  group-hover:translate-x-1 transition-transform" />
                  </button>
                  </Link>

                  <div className="text-xs mt-3 opacity-80 text-center">
                    *Interest rates start from 0.79% per month. Terms and conditions apply.
                  </div>
                </div>
              </div>
            </div>

            {/* Features Card */}
<div className="bg-white rounded-2xl shadow-lg p-3 border border-gray-100">
  {/* Header with colored icon */}
  <div className="flex items-center gap-3 mb-4">
      <Sparkles className="h-5 w-5 text-purple-500" />
    <h4 className="font-bold text-gray-900 text-lg md:text-xl">Why Choose Us</h4>
  </div>
  
  {/* Features Grid - 1 column on mobile, 2 on desktop */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 ">
    {[
      { icon: Shield, text: 'Gold Insurance Included', color: 'text-green-600' },
      { icon: Clock, text: 'Same Day Disbursal', color: 'text-blue-600' },
      { icon: IndianRupee, text: 'No Hidden Charges', color: 'text-amber-600' },
      { icon: Percent, text: 'Lowest Interest Rates', color: 'text-purple-600' },
    ].map((item, index) => (
      <div key={index} className="flex items-center gap-1 px-1 py-1 bg-linear-to-r from-gray-50 to-white border border-gray-200 shadow-sm hover:shadow-md hover:border-amber-200 rounded-xl transition-all duration-300">
        <div className={`p-2 rounded-lg ${item.color.replace('text-', 'bg-')}/20`}>
          <item.icon className={`h-5 w-5 ${item.color}`} />
        </div>
        <span className="text-gray-800 font-semibold text-sm">{item.text}</span>
      </div>
    ))}
  </div>
  
  {/* Stats Section - 2 columns grid */}
  <div className="mt-3 md:mt-1 pt-2 border-t border-gray-200">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
      <div className="flex text-sm items-center justify-between px-1 py-1 bg-linear-to-r from-green-50 to-white border border-green-100 rounded-lg md:rounded-xl shadow-sm">
        <div className="flex items-center gap-1">
          <IndianRupee className="h-5 w-5 text-green-600" />
          <span className="text-gray-600 font-medium">Processing Fee</span>
        </div>
        <span className="font-bold text-green-700 text-sm">0% - 1%</span>
      </div>
      
      <div className="flex text-sm items-center justify-between px-1 py-1 bg-linear-to-r from-blue-50 to-white border border-blue-100 rounded-xl shadow-sm">
        <div className="flex items-center gap-1">
          <Calendar className="h-5 w-5 text-blue-600" />
          <span className="text-gray-600 font-medium">Tenure</span>
        </div>
        <span className="font-bold text-blue-700 text-sm">3 to 36 Months</span>
      </div>
    </div>
  </div>
</div>
          </div>
        </div>
      </div>
    </section>
  );
}