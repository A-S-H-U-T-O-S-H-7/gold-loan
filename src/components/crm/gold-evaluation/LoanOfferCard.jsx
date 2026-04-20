import React, { useState } from 'react';
import { FileText, CheckCircle, AlertCircle } from 'lucide-react';

const LoanOfferCard = ({ eligibleAmount, onSubmit, saving, isDark }) => {
  const [selectedTenure, setSelectedTenure] = useState(6);
  const [interestRate, setInterestRate] = useState(12);

  const tenureOptions = [3, 6, 12];
  
  const calculateEMI = () => {
    const principal = parseFloat(eligibleAmount);
    const monthlyRate = interestRate / 12 / 100;
    const months = selectedTenure;
    const emi = principal * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1);
    return isNaN(emi) ? 0 : emi;
  };

  const calculateTotalInterest = () => {
    const totalPayment = calculateEMI() * selectedTenure;
    const principal = parseFloat(eligibleAmount);
    return totalPayment - principal;
  };

  const emi = calculateEMI();
  const totalInterest = calculateTotalInterest();
  const processingFee = parseFloat(eligibleAmount) * 0.02; // 2% processing fee
  const totalPayable = parseFloat(eligibleAmount) + totalInterest + processingFee;

  const cardClassName = `rounded-xl border-2 p-4 ${
    isDark ? 'border-crm-border bg-gray-700/30' : 'border-crm-border bg-crm-accent-soft/30'
  }`;

  return (
    <div className={`rounded-xl shadow-lg border-2 overflow-hidden sticky top-6 ${
      isDark ? "bg-gray-800 border-crm-border shadow-crm-soft" : "bg-white border-crm-border shadow-crm-soft"
    }`}>
      <div className="p-5">
        <div className="flex items-center space-x-2 mb-4">
          <FileText className={`w-5 h-5 ${isDark ? "text-crm-primary-strong" : "text-crm-primary"}`} />
          <h3 className={`text-lg font-semibold ${isDark ? "text-crm-primary-strong" : "text-crm-primary"}`}>
            Loan Offer
          </h3>
        </div>

        <div className="space-y-4">
          {/* Eligible Amount Display */}
          <div className={cardClassName}>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Eligible Loan Amount</p>
            <p className={`text-2xl font-bold mt-1 ${isDark ? 'text-crm-primary-strong' : 'text-crm-primary'}`}>
              ₹{parseFloat(eligibleAmount).toLocaleString('en-IN')}
            </p>
          </div>

          {/* Loan Configuration */}
          <div className="space-y-3">
            <div>
              <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Select Tenure (Months)
              </label>
              <div className="grid grid-cols-3 gap-2">
                {tenureOptions.map(tenure => (
                  <button
                    key={tenure}
                    type="button"
                    onClick={() => setSelectedTenure(tenure)}
                    className={`py-2 rounded-lg border-2 transition-all duration-200 text-sm font-medium ${
                      selectedTenure === tenure
                        ? 'bg-crm-primary text-white border-crm-primary'
                        : isDark
                          ? 'bg-gray-700 border-gray-600 text-gray-300 hover:border-crm-primary'
                          : 'bg-white border-gray-300 text-gray-700 hover:border-crm-primary'
                    }`}
                  >
                    {tenure} Months
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Interest Rate (% per annum)
              </label>
              <input
                type="number"
                value={interestRate}
                onChange={(e) => setInterestRate(parseFloat(e.target.value))}
                className={`w-full px-3 py-2 rounded-lg border-2 transition-all duration-200 text-sm outline-none ${
                  isDark
                    ? "bg-gray-700 border-gray-600 text-white focus:border-crm-primary"
                    : "bg-gray-50 border-gray-300 text-gray-900 focus:border-crm-primary"
                }`}
                step="0.5"
              />
            </div>
          </div>

          {/* Loan Summary */}
          <div className={`space-y-2 pt-2 ${isDark ? 'border-t border-gray-700' : 'border-t border-gray-200'}`}>
            <div className="flex justify-between text-sm">
              <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Monthly EMI</span>
              <span className={`font-semibold ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                ₹{emi.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Total Interest Payable</span>
              <span className={`font-semibold ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                ₹{totalInterest.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Processing Fee (2%)</span>
              <span className={`font-semibold ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                ₹{processingFee.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <div className={`flex justify-between pt-2 mt-2 ${isDark ? 'border-t border-gray-700' : 'border-t border-gray-200'}`}>
              <span className="font-semibold">Total Payable Amount</span>
              <span className={`text-lg font-bold ${isDark ? 'text-crm-primary-strong' : 'text-crm-primary'}`}>
                ₹{totalPayable.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-2">
            <button
              onClick={onSubmit}
              disabled={saving || parseFloat(eligibleAmount) === 0}
              className="w-full py-2.5 bg-crm-primary text-white rounded-lg hover:bg-crm-primary-strong transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {saving ? (
                <>Processing...</>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Generate Loan Offer
                </>
              )}
            </button>
            <p className={`text-xs text-center ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              By proceeding, you agree to the loan terms and conditions
            </p>
          </div>

          {parseFloat(eligibleAmount) === 0 && (
            <div className={`flex items-center gap-2 p-3 rounded-lg ${isDark ? 'bg-yellow-900/20 text-yellow-400' : 'bg-yellow-50 text-yellow-700'}`}>
              <AlertCircle className="w-4 h-4" />
              <p className="text-xs">Please add gold items to see loan offer</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoanOfferCard;