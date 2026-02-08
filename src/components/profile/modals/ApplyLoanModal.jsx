'use client';

import React, { useState } from 'react';
import { X, PlusCircle, Scale, Calendar, Percent } from 'lucide-react';

export default function ApplyLoanModal({ onClose }) {
  const [step, setStep] = useState(1);
  const [goldWeight, setGoldWeight] = useState(100);
  const [goldPurity, setGoldPurity] = useState('22K');
  const [loanAmount, setLoanAmount] = useState(250000);

  const calculateLoanAmount = () => {
    const rate = goldPurity === '24K' ? 6000 : goldPurity === '22K' ? 5500 : 5000;
    const value = goldWeight * rate;
    return Math.round(value * 0.75); // 75% LTV
  };

  const steps = [
    { number: 1, title: 'Gold Details', icon: Scale },
    { number: 2, title: 'Loan Amount', icon: Percent },
    { number: 3, title: 'Review', icon: Calendar }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="bg-linear-to-r from-primary-500 to-primary-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mr-4">
                <PlusCircle className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Apply for New Gold Loan</h2>
                <p className="opacity-90">Get additional loan against your gold</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="px-6 pt-6">
          <div className="flex items-center justify-between mb-8">
            {steps.map((s, index) => (
              <div key={s.number} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step >= s.number 
                    ? 'bg-primary-500 text-white' 
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {step > s.number ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <s.icon className="h-5 w-5" />
                  )}
                </div>
                <div className={`ml-3 ${step >= s.number ? 'text-gray-900' : 'text-gray-500'}`}>
                  <div className="text-sm font-medium">Step {s.number}</div>
                  <div className="font-bold">{s.title}</div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`h-0.5 w-16 mx-4 ${step > s.number ? 'bg-primary-500' : 'bg-gray-300'}`}></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {step === 1 && (
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-6">Gold Details</h3>
              
              <div className="space-y-6">
                {/* Gold Weight */}
                <div>
                  <label className="block text-lg font-semibold text-gray-900 mb-4">
                    Gold Weight (grams)
                  </label>
                  <div className="relative">
                    <input
                      type="range"
                      min="10"
                      max="1000"
                      value={goldWeight}
                      onChange={(e) => setGoldWeight(parseInt(e.target.value))}
                      className="w-full h-3 bg-linear-to-r from-primary-400 to-primary-600 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-sm text-gray-500 mt-2">
                      <span>10g</span>
                      <span>500g</span>
                      <span>1000g</span>
                    </div>
                  </div>
                  <div className="text-center mt-4">
                    <div className="inline-flex items-center px-6 py-3 bg-linear-to-r from-amber-50 to-yellow-50 rounded-xl">
                      <Scale className="h-5 w-5 text-amber-600 mr-2" />
                      <span className="text-3xl font-bold text-amber-600">{goldWeight}</span>
                      <span className="text-gray-600 ml-2">grams</span>
                    </div>
                  </div>
                </div>

                {/* Gold Purity */}
                <div>
                  <label className="block text-lg font-semibold text-gray-900 mb-4">
                    Gold Purity
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {['22K', '24K', 'Mixed'].map((purity) => (
                      <button
                        key={purity}
                        onClick={() => setGoldPurity(purity)}
                        className={`py-4 rounded-xl font-bold text-lg transition-all ${
                          goldPurity === purity
                            ? 'bg-linear-to-r from-amber-500 to-yellow-500 text-white shadow-lg'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {purity}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-6">Loan Amount</h3>
              
              <div className="bg-linear-to-br from-primary-50 to-blue-50 rounded-2xl p-6 border border-primary-200 mb-6">
                <div className="text-center">
                  <div className="text-sm text-gray-600 mb-2">Eligible Loan Amount</div>
                  <div className="text-5xl font-bold text-primary-600 mb-4">
                    ₹{calculateLoanAmount().toLocaleString()}
                  </div>
                  <div className="text-gray-600">
                    Based on {goldWeight}g {goldPurity} gold at 75% LTV
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-lg font-semibold text-gray-900 mb-4">
                  Requested Loan Amount
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-2xl">₹</div>
                  <input
                    type="number"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(parseInt(e.target.value) || 0)}
                    className="w-full pl-12 pr-4 py-4 text-2xl font-bold border-2 border-primary-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div className="flex justify-between mt-2">
                  <button 
                    onClick={() => setLoanAmount(100000)}
                    className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    ₹1,00,000
                  </button>
                  <button 
                    onClick={() => setLoanAmount(250000)}
                    className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    ₹2,50,000
                  </button>
                  <button 
                    onClick={() => setLoanAmount(500000)}
                    className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    ₹5,00,000
                  </button>
                  <button 
                    onClick={() => setLoanAmount(calculateLoanAmount())}
                    className="px-4 py-2 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200"
                  >
                    Max
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-6">Review Application</h3>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                  <span className="text-gray-600">Gold Weight</span>
                  <span className="font-bold text-gray-900">{goldWeight} grams</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                  <span className="text-gray-600">Gold Purity</span>
                  <span className="font-bold text-gray-900">{goldPurity}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                  <span className="text-gray-600">Loan Amount</span>
                  <span className="text-2xl font-bold text-primary-600">₹{loanAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                  <span className="text-gray-600">Estimated Interest</span>
                  <span className="font-bold text-gray-900">0.79% - 1.25% per month</span>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
                <div className="flex items-start">
                  <svg className="h-5 w-5 text-yellow-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <div className="text-sm text-yellow-700">
                    You need to visit branch with original gold items and documents 
                    for final processing. This is only a pre-approval request.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex justify-between">
            {step > 1 ? (
              <button
                onClick={() => setStep(step - 1)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition"
              >
                ← Back
              </button>
            ) : (
              <div></div>
            )}
            
            {step < 3 ? (
              <button
                onClick={() => setStep(step + 1)}
                className="px-8 py-3 bg-primary-500 text-white rounded-xl font-bold hover:bg-primary-600 transition"
              >
                Continue →
              </button>
            ) : (
              <button
                onClick={() => {
                  alert('Application submitted! Our executive will contact you soon.');
                  onClose();
                }}
                className="px-8 py-3 bg-linear-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold hover:shadow-lg transition"
              >
                Submit Application
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}