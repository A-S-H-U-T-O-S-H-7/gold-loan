'use client';
import React from 'react';
import { Building2, AlertTriangle } from 'lucide-react';

export default function BankDetails({ formik, isDark, errors = {}, touched = {} }) {
  const inputClassName = `w-full px-3 py-2 rounded border-2 transition-all duration-200 text-sm ${
    isDark
      ? 'bg-gray-700 border-gray-600 text-white hover:border-gold-500 focus:border-gold-400'
      : 'bg-gray-50 border-gray-300 text-gray-900 hover:border-gold-400 focus:border-gold-500'
  } focus:ring-2 focus:ring-gold-500/20 focus:outline-none`;

  const errorInputClassName = `w-full px-3 py-2 rounded border-2 transition-all duration-200 text-sm ${
    isDark
      ? 'bg-gray-700 border-red-500 text-white hover:border-red-400 focus:border-red-400'
      : 'bg-red-50 border-red-400 text-gray-900 hover:border-red-400 focus:border-red-500'
  } focus:ring-2 focus:ring-red-500/20 focus:outline-none`;

  const selectClassName = `w-full px-3 py-2 rounded border-2 transition-all duration-200 text-sm ${
    isDark
      ? 'bg-gray-700 border-gray-600 text-white hover:border-gold-500 focus:border-gold-400'
      : 'bg-gray-50 border-gray-300 text-gray-900 hover:border-gold-400 focus:border-gold-500'
  } focus:ring-2 focus:ring-gold-500/20 focus:outline-none`;

  const errorSelectClassName = `w-full px-3 py-2 rounded border-2 transition-all duration-200 text-sm ${
    isDark
      ? 'bg-gray-700 border-red-500 text-white hover:border-red-400 focus:border-red-400'
      : 'bg-red-50 border-red-400 text-gray-900 hover:border-red-400 focus:border-red-500'
  } focus:ring-2 focus:ring-red-500/20 focus:outline-none`;

  const textareaClassName = `w-full px-3 py-2 rounded border-2 transition-all duration-200 text-sm resize-none ${
    isDark
      ? 'bg-gray-700 border-gray-600 text-white hover:border-gold-500 focus:border-gold-400'
      : 'bg-gray-50 border-gray-300 text-gray-900 hover:border-gold-400 focus:border-gold-500'
  } focus:ring-2 focus:ring-gold-500/20 focus:outline-none`;

  const errorTextareaClassName = `w-full px-3 py-2 rounded border-2 transition-all duration-200 text-sm resize-none ${
    isDark
      ? 'bg-gray-700 border-red-500 text-white hover:border-red-400 focus:border-red-400'
      : 'bg-red-50 border-red-400 text-gray-900 hover:border-red-400 focus:border-red-500'
  } focus:ring-2 focus:ring-red-500/20 focus:outline-none`;

  const labelClassName = `block text-xs font-medium mb-1 ${
    isDark ? 'text-gray-300' : 'text-gray-700'
  }`;

  const errorLabelClassName = `block text-xs font-medium mb-1 ${
    isDark ? 'text-red-400' : 'text-red-600'
  }`;

  const errorTextClassName = `text-xs mt-1 flex items-center space-x-1 ${
    isDark ? 'text-red-400' : 'text-red-600'
  }`;

  const hasError = (fieldName) => {
    return errors[fieldName] && touched[fieldName];
  };

  const getFieldError = (fieldName) => {
    return errors[fieldName];
  };

  return (
    <div className={`rounded-xl shadow-lg border-2 overflow-hidden ${
      isDark
        ? 'bg-gray-800 border-gold-700/50 shadow-gold-900/20'
        : 'bg-white border-gold-200 shadow-gold-500/10'
    }`}>
      <div className="p-5">
        <div className="flex items-center space-x-2 mb-4">
          <Building2 className={`w-5 h-5 ${isDark ? 'text-gold-400' : 'text-gold-600'}`} />
          <h3 className={`text-lg font-semibold ${isDark ? 'text-gold-400' : 'text-gold-600'}`}>
            Bank Details
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Bank Name */}
          <div>
            <label className={hasError('bankName') ? errorLabelClassName : labelClassName}>
              Bank Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="bankName"
              value={formik.values.bankName || ''}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={hasError('bankName') ? errorInputClassName : inputClassName}
              placeholder="Enter bank name"
            />
            {hasError('bankName') && (
              <div className={errorTextClassName}>
                <AlertTriangle className="w-3 h-3" />
                <span>{getFieldError('bankName')}</span>
              </div>
            )}
          </div>

          {/* Branch Name */}
          <div>
            <label className={hasError('branchName') ? errorLabelClassName : labelClassName}>
              Branch Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="branchName"
              value={formik.values.branchName || ''}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={hasError('branchName') ? errorInputClassName : inputClassName}
              placeholder="Enter branch name"
            />
            {hasError('branchName') && (
              <div className={errorTextClassName}>
                <AlertTriangle className="w-3 h-3" />
                <span>{getFieldError('branchName')}</span>
              </div>
            )}
          </div>

          {/* Account Type */}
          <div>
            <label className={hasError('accountType') ? errorLabelClassName : labelClassName}>
              Account Type <span className="text-red-500">*</span>
            </label>
            <select
              name="accountType"
              value={formik.values.accountType || ''}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={hasError('accountType') ? errorSelectClassName : selectClassName}
            >
              <option value="">Select Account Type</option>
              <option value="SAVING">Savings Account</option>
              <option value="CURRENT">Current Account</option>
            </select>
            {hasError('accountType') && (
              <div className={errorTextClassName}>
                <AlertTriangle className="w-3 h-3" />
                <span>{getFieldError('accountType')}</span>
              </div>
            )}
          </div>

          {/* Account Number */}
          <div>
            <label className={hasError('accountNo') ? errorLabelClassName : labelClassName}>
              Account Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="accountNo"
              value={formik.values.accountNo || ''}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={hasError('accountNo') ? errorInputClassName : inputClassName}
              placeholder="Enter account number"
            />
            {hasError('accountNo') && (
              <div className={errorTextClassName}>
                <AlertTriangle className="w-3 h-3" />
                <span>{getFieldError('accountNo')}</span>
              </div>
            )}
          </div>

          {/* IFSC Code */}
          <div>
            <label className={hasError('ifscCode') ? errorLabelClassName : labelClassName}>
              IFSC Code <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="ifscCode"
              value={formik.values.ifscCode || ''}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={hasError('ifscCode') ? errorInputClassName : inputClassName}
              placeholder="Enter IFSC code"
            />
            {hasError('ifscCode') && (
              <div className={errorTextClassName}>
                <AlertTriangle className="w-3 h-3" />
                <span>{getFieldError('ifscCode')}</span>
              </div>
            )}
          </div>

          {/* Remark */}
          <div>
            <label className={labelClassName}>
              Remark
            </label>
            <input
              type="text"
              name="bankRemark"
              value={formik.values.bankRemark || ''}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={hasError('bankRemark') ? errorInputClassName : inputClassName}
              placeholder="Any remarks..."
            />
            {hasError('bankRemark') && (
              <div className={errorTextClassName}>
                <AlertTriangle className="w-3 h-3" />
                <span>{getFieldError('bankRemark')}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}