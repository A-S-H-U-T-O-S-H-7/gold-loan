import React, { useState } from 'react';
import { Calculator, Edit2, Check, X } from 'lucide-react';

const GoldValuationCard = ({ totals, goldRate, ltvPercentage, onGoldRateChange, onLtvChange, isDark }) => {
  const [editingRate, setEditingRate] = useState(false);
  const [editingLTV, setEditingLTV] = useState(false);
  const [tempRate, setTempRate] = useState(goldRate);
  const [tempLTV, setTempLTV] = useState(ltvPercentage);

  const handleRateSave = () => {
    onGoldRateChange(parseFloat(tempRate));
    setEditingRate(false);
  };

  const handleLTYSave = () => {
    onLtvChange(parseFloat(tempLTV));
    setEditingLTV(false);
  };

  const infoRowClassName = `flex justify-between items-center py-2 ${
    isDark ? 'border-b border-gray-700' : 'border-b border-gray-100'
  }`;

  const labelClassName = `text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`;
  const valueClassName = `text-sm font-semibold ${isDark ? 'text-gray-200' : 'text-gray-800'}`;
  const highlightClassName = `text-lg font-bold ${isDark ? 'text-crm-primary-strong' : 'text-crm-primary'}`;

  return (
    <div className={`rounded-xl shadow-lg border-2 overflow-hidden sticky top-6 ${
      isDark ? "bg-gray-800 border-crm-border shadow-crm-soft" : "bg-white border-crm-border shadow-crm-soft"
    }`}>
      <div className="p-5">
        <div className="flex items-center space-x-2 mb-4">
          <Calculator className={`w-5 h-5 ${isDark ? "text-crm-primary-strong" : "text-crm-primary"}`} />
          <h3 className={`text-lg font-semibold ${isDark ? "text-crm-primary-strong" : "text-crm-primary"}`}>
            Gold Valuation
          </h3>
        </div>

        <div className="space-y-3">
          {/* Gold Rate */}
          <div className={infoRowClassName}>
            <span className={labelClassName}>Gold Rate (per gram)</span>
            <div className="flex items-center gap-2">
              {editingRate ? (
                <>
                  <input
                    type="number"
                    value={tempRate}
                    onChange={(e) => setTempRate(e.target.value)}
                    className={`w-24 px-2 py-1 text-right rounded border ${
                      isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                    }`}
                  />
                  <button onClick={handleRateSave} className="p-1 text-green-500 hover:bg-green-50 rounded">
                    <Check className="w-4 h-4" />
                  </button>
                  <button onClick={() => setEditingRate(false)} className="p-1 text-red-500 hover:bg-red-50 rounded">
                    <X className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <>
                  <span className={valueClassName}>₹{goldRate.toFixed(2)}</span>
                  <button onClick={() => setEditingRate(true)} className="p-1 hover:bg-gray-100 rounded">
                    <Edit2 className="w-3 h-3 text-gray-400" />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* LTV Percentage */}
          <div className={infoRowClassName}>
            <span className={labelClassName}>LTV Percentage</span>
            <div className="flex items-center gap-2">
              {editingLTV ? (
                <>
                  <input
                    type="number"
                    value={tempLTV}
                    onChange={(e) => setTempLTV(e.target.value)}
                    className={`w-20 px-2 py-1 text-right rounded border ${
                      isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                    }`}
                  />
                  <span className="text-sm">%</span>
                  <button onClick={handleLTYSave} className="p-1 text-green-500 hover:bg-green-50 rounded">
                    <Check className="w-4 h-4" />
                  </button>
                  <button onClick={() => setEditingLTV(false)} className="p-1 text-red-500 hover:bg-red-50 rounded">
                    <X className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <>
                  <span className={valueClassName}>{ltvPercentage}%</span>
                  <button onClick={() => setEditingLTV(true)} className="p-1 hover:bg-gray-100 rounded">
                    <Edit2 className="w-3 h-3 text-gray-400" />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Summary */}
          <div className={`mt-4 pt-3 ${isDark ? 'border-t border-gray-700' : 'border-t border-gray-200'}`}>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className={labelClassName}>Total Items</span>
                <span className={valueClassName}>{totals.itemCount}</span>
              </div>
              <div className="flex justify-between">
                <span className={labelClassName}>Total Gross Weight</span>
                <span className={valueClassName}>{totals.totalGrossWeight} g</span>
              </div>
              <div className="flex justify-between">
                <span className={labelClassName}>Total Net Weight</span>
                <span className={valueClassName}>{totals.totalNetWeight} g</span>
              </div>
              <div className="flex justify-between">
                <span className={labelClassName}>Total Stone Weight</span>
                <span className={valueClassName}>{totals.totalStoneWeight} g</span>
              </div>
              <div className={`flex justify-between pt-2 mt-2 ${isDark ? 'border-t border-gray-700' : 'border-t border-gray-200'}`}>
                <span className="font-semibold">Eligible Loan Amount</span>
                <span className={highlightClassName}>₹{parseFloat(totals.eligibleAmount).toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoldValuationCard;