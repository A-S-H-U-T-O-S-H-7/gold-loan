"use client";
import React, { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import StatusBadge from '@/components/crm/ui/StatusBadge';

const StatusUpdateModal = ({
  isOpen,
  onClose,
  application,
  statusOptions = [],
  onStatusUpdate,
  isDark,
  accent = 'emerald',
  initialStatus,
  requiredRemarkStatuses = [],
  showCurrentStatus = false,
  showSuccessToast = true,
  preventSameStatus = false,
  submitLabel = 'Update Status',
  readOnlyMessage = '',
}) => {
  const [selectedStatus, setSelectedStatus] = useState("");
  const [remark, setRemark] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const modalRef = useRef(null);

  useEffect(() => {
    if (isOpen && application) {
      setSelectedStatus(initialStatus ?? application.status ?? "");
      setRemark("");
      setError('');
    }
  }, [isOpen, application, initialStatus]);

  // Outside click, escape key, and scroll lock functionality
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target) && !loading) {
        handleClose();
      }
    };

    const handleEscapeKey = (event) => {
      if (event.key === 'Escape' && !loading) {
        handleClose();
      }
    };

    const previousOverflow = document.body.style.overflow;
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, loading]);

const handleSubmit = async (e) => {
  e.preventDefault();
  if (!selectedStatus || loading) return;
  if (statusOptions.find((option) => option.value === selectedStatus)?.disabled) {
    setError(statusOptions.find((option) => option.value === selectedStatus)?.disabledReason || 'This status is not available yet.');
    return;
  }
  if (requiredRemarkStatuses.includes(selectedStatus) && !remark.trim()) {
    setError('A reason is required.');
    return;
  }

  try {
    setLoading(true);
    
    setError('');
    await onStatusUpdate(application.id, selectedStatus, remark.trim());
    
    if (showSuccessToast) toast.success('Application status has been updated successfully.', {
      style: {
        background: isDark ? "#1f2937" : "#ffffff",
        color: isDark ? "#f9fafb" : "#111827",
        border: isDark ? "1px solid #374151" : "1px solid #e5e7eb"
      },
      iconTheme: {
        primary: '#10b981',
        secondary: '#f9fafb',
      }
    });

    onClose();
    
  } catch (error) {
    console.error("Status update error:", error);
    
    // Extract error message from server response
    let errorMessage = 'Failed to update status. Please try again.';
    
    if (error.response) {
      const errorData = error.response.data || error.response;
      
      if (errorData.message) {
        errorMessage = errorData.message;
      } else if (errorData.error) {
        errorMessage = errorData.error;
      } else if (errorData.errors && Object.keys(errorData.errors).length > 0) {
        const firstError = Object.values(errorData.errors)[0];
        if (Array.isArray(firstError) && firstError.length > 0) {
          errorMessage = firstError[0];
        } else if (typeof firstError === 'string') {
          errorMessage = firstError;
        }
      }
    } else if (error.request) {
      errorMessage = 'No response from server. Please check your connection.';
    } else {
      errorMessage = error.message || errorMessage;
    }
    
    setError(errorMessage);
    toast.error(errorMessage, {
      style: {
        background: isDark ? "#1f2937" : "#ffffff",
        color: isDark ? "#f9fafb" : "#111827",
        border: isDark ? "1px solid #374151" : "1px solid #e5e7eb"
      },
      iconTheme: {
        primary: '#ef4444',
        secondary: '#f9fafb',
      },
      duration: 4000 
    });
  } finally {
    setLoading(false);
  }
};


  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  if (!isOpen || !application) return null;

  const isGold = accent === 'gold';
  const accentText = isGold ? (isDark ? 'text-gold-400' : 'text-gold-700') : (isDark ? 'text-emerald-400' : 'text-emerald-600');
  const focusRing = isGold ? 'focus:ring-gold-500' : 'focus:ring-emerald-500';
  const submitColor = isGold ? 'bg-gold-600 hover:bg-gold-700' : 'bg-emerald-600 hover:bg-emerald-700';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="status-update-title"
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[80] p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget && !loading) {
          handleClose();
        }
      }}
    >
      <div 
        ref={modalRef}
        className={`rounded-2xl shadow-2xl w-full max-w-md transform transition-all ${
          isDark ? "bg-gray-800" : "bg-white"
        }`}
      >
        <div className={`p-6 border-b ${
          isDark ? "border-gray-700" : "border-gray-200"
        }`}>
          <h2 id="status-update-title" className={`text-xl font-bold ${accentText}`}>
            Status Update
          </h2>
          <p className={`mt-1 text-sm ${
            isDark ? "text-gray-300" : "text-gray-600"
          }`}>
            {application.name || 'Customer'} ({application.applicationNo || application.crnNo || application.loanNo || application.id})
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {showCurrentStatus && (
            <div className="mb-5 flex items-center gap-2 text-sm font-medium">
              <span>Current status:</span>
              <StatusBadge status={application.status || 'PENDING'} />
            </div>
          )}
          {readOnlyMessage ? <>
            <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{readOnlyMessage}</p>
            <button type="button" onClick={handleClose} className={`mt-6 w-full px-4 py-2 rounded-lg border cursor-pointer ${isDark ? 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'}`}>Close</button>
          </> : <><div className="space-y-4">
            {/* Status Selection */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}>
                Status *
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => { setSelectedStatus(e.target.value); setError(''); }}
                disabled={loading}
                className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 ${focusRing} ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                } ${
                  isDark 
                    ? "bg-gray-700 border-gray-600 text-white" 
                    : "bg-white border-gray-300 text-gray-900"
                }`}
                required
              >
                <option value="">Select Status</option>
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value} disabled={option.disabled}>
                    {option.label}
                  </option>
                ))}
              </select>
              {/* Several options can share a reason; show each reason once. */}
              {[...new Set(statusOptions.filter((option) => option.disabled && option.disabledReason).map((option) => option.disabledReason))].map((reason) => (
                <p key={reason} className="mt-2 text-sm text-amber-600">{reason}</p>
              ))}
            </div>

            {/* Remark */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}>
                Remark {requiredRemarkStatuses.includes(selectedStatus) && '*'}
              </label>
              <textarea
                value={remark}
                onChange={(e) => { setRemark(e.target.value); setError(''); }}
                disabled={loading}
                required={requiredRemarkStatuses.includes(selectedStatus)}
                rows={3}
                placeholder="Add any remarks or notes..."
                className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 ${focusRing} ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                } ${
                  isDark 
                    ? "bg-gray-700 border-gray-600 text-white" 
                    : "bg-white border-gray-300 text-gray-900"
                }`}
              />
            </div>
          </div>
          {error && <p role="alert" className="mt-3 text-sm text-red-500">{error}</p>}

          {/* Actions */}
          <div className="flex space-x-3 mt-6">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className={`flex-1 cursor-pointer px-4 py-2 rounded-lg border transition-colors ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              } ${
                isDark
                  ? "bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600"
                  : "bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !selectedStatus || (preventSameStatus && selectedStatus === application.status) || statusOptions.find((option) => option.value === selectedStatus)?.disabled}
              className={`flex-1 cursor-pointer px-4 py-2 rounded-lg text-white transition-colors disabled:cursor-not-allowed ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : submitColor
              }`}
            >
              {loading ? 'Updating...' : submitLabel}
            </button>
          </div></>}
        </form>
      </div>
    </div>
  );
};

export default StatusUpdateModal;
