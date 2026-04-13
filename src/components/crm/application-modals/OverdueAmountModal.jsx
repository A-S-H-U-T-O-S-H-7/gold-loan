import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";

const OverdueAmountModal = ({ isOpen, onClose, applicant, isDark }) => {
  const modalRef = useRef(null);

  // Outside click, escape key, and scroll lock functionality
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose(); 
      }
    };

    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !applicant) return null;

  const overdueDetails = applicant.overdue_details?.overdue;
  const renewalDetails = applicant.overdue_details?.renewal;
  const customerName = applicant.name || applicant.fullname || "N/A";

  // Calculate combined values
  const calculateTotalInterest = () => {
    if (!overdueDetails) return 0;
    const normalInterestBefore = parseFloat(overdueDetails.normal_interest_before) || 0;
    const normalInterestAfter = parseFloat(overdueDetails.normal_interest_after) || 0;
    return normalInterestBefore + normalInterestAfter;
  };

  const calculateTotalPenalInterest = () => {
    if (!overdueDetails) return 0;
    const penalInterestBefore = parseFloat(overdueDetails.penal_interest_before) || 0;
    const penalInterestAfter = parseFloat(overdueDetails.penal_interest_after) || 0;
    return penalInterestBefore + penalInterestAfter;
  };

  const calculateTotalPenalty = () => {
    if (!overdueDetails) return 0;
    const penaltyBefore = parseFloat(overdueDetails.penalty_before) || 0;
    const penaltyAfter = parseFloat(overdueDetails.penalty_after) || 0;
    return penaltyBefore + penaltyAfter;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount || 0);
  };

  // Get overdue days for styling
  const getOverdueDays = () => {
    if (applicant.ovedays) return parseInt(applicant.ovedays) || 0;
    return 0;
  };

  const overdueDays = getOverdueDays();

  return (
    <div 
      className="fixed inset-0 bg-black/40 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        ref={modalRef}
        className={`relative w-full max-w-lg mx-4 rounded-lg shadow-xl ${
          isDark ? "bg-gray-800 text-white" : "bg-white text-gray-900"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">
            Overdue Amount of <span className="text-blue-600">{customerName}</span>
          </h2>
          <button
            onClick={onClose}
            className={`p-1 rounded-lg hover:bg-gray-100 transition-colors ${
              isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"
            }`}
          >
            <X size={20} className={isDark ? "text-gray-400" : "text-gray-600"} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Days Badge */}
          <div className="flex justify-center">
            <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
              overdueDays > 30 
                ? "bg-red-100 text-red-700 border border-red-300"
                : overdueDays > 15 
                ? "bg-orange-100 text-orange-700 border border-orange-300"
                : "bg-green-100 text-green-700 border border-green-300"
            }`}>
              {applicant.overdue_display}
            </div>
          </div>

          {/* Overdue Details - Table Layout */}
          {overdueDetails && (
            <div className="space-y-2">
              <table className="w-full">
                <tbody className="space-y-2">
                  <tr>
                    <td className="text-sm font-medium py-1">Sanction Amount :</td>
                    <td className="text-sm font-semibold text-right py-1">{formatCurrency(overdueDetails.sanction_amount)}</td>
                  </tr>
                  
                  <tr>
                    <td className="text-sm font-medium py-1">Interest :</td>
                    <td className="text-sm font-semibold text-right py-1">{formatCurrency(calculateTotalInterest())}</td>
                  </tr>
                  
                  <tr>
                    <td className="text-sm font-medium py-1">Penal Interest :</td>
                    <td className="text-sm font-semibold text-right py-1">{formatCurrency(calculateTotalPenalInterest())}</td>
                  </tr>
                  
                  <tr>
                    <td className="text-sm font-medium py-1">Penalty :</td>
                    <td className="text-sm font-semibold text-right py-1">{formatCurrency(calculateTotalPenalty())}</td>
                  </tr>
                  
                  <tr>
                    <td className="text-sm font-medium py-1">Collection :</td>
                    <td className="text-sm font-semibold text-right text-green-600 py-1">{formatCurrency(applicant?.total_collection)}</td>
                  </tr>
                </tbody>
              </table>
              
              <hr className={`my-2 ${isDark ? "border-gray-600" : "border-gray-300"}`} />
              
              {/* Total Due Highlight - Table Layout */}
              <table className="w-full">
                <tbody>
                  <tr className={`font-bold ${isDark ? "bg-red-900/30" : "bg-red-50"} rounded`}>
                    <td className={`text-sm p-2 rounded-l border ${isDark ? "border-red-700" : "border-red-200"}`}>
                      Total Due Amount :
                    </td>
                    <td className={`text-sm p-2 text-right rounded-r border ${isDark ? "border-red-700 text-red-300" : "border-red-200 text-red-600"}`}>
                      {formatCurrency(overdueDetails?.total_due || 0)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* Renewal Case Section - Table Layout */}
          {renewalDetails && (
            <div className="mt-4">
              <h3 className="text-base font-semibold mb-2">Renewal of {customerName}</h3>
              
              <div className="space-y-2">
                <table className="w-full">
                  <tbody>
                    <tr>
                      <td className="text-sm font-medium py-1">Processing Fee :</td>
                      <td className="text-sm font-semibold text-right py-1">{formatCurrency(renewalDetails.process_fee)}</td>
                    </tr>
                    
                    <tr>
                      <td className="text-sm font-medium py-1">Interest :</td>
                      <td className="text-sm font-semibold text-right py-1">{formatCurrency(renewalDetails.interest)}</td>
                    </tr>
                    
                    <tr>
                      <td className="text-sm font-medium py-1">Penalty :</td>
                      <td className="text-sm font-semibold text-right py-1">{formatCurrency(renewalDetails.penality)}</td>
                    </tr>
                    
                    <tr>
                      <td className="text-sm font-medium py-1">Penal Interest :</td>
                      <td className="text-sm font-semibold text-right py-1">{formatCurrency(renewalDetails.penal_interest)}</td>
                    </tr>
                    
                    <tr>
                      <td className="text-sm font-medium py-1">Renewal Fee :</td>
                      <td className="text-sm font-semibold text-right py-1">{formatCurrency(renewalDetails.renewal_fee)}</td>
                    </tr>
                  </tbody>
                </table>
                
                <hr className={`my-2 ${isDark ? "border-gray-600" : "border-gray-300"}`} />
                
                {/* Total Payable Highlight - Table Layout */}
                <table className="w-full">
                  <tbody>
                    <tr className={`font-bold ${isDark ? "bg-green-900/30" : "bg-green-50"} rounded`}>
                      <td className={`text-sm p-2 rounded-l border ${isDark ? "border-green-700" : "border-green-200"}`}>
                        Total Payable Amount :
                      </td>
                      <td className={`text-sm p-2 text-right rounded-r border ${isDark ? "border-green-700 text-green-300" : "border-green-200 text-green-600"}`}>
                        {formatCurrency(renewalDetails.total_renewal_charges)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OverdueAmountModal;