'use client';
import React, { useRef, useState } from 'react';
import { Building2, AlertTriangle, Check, Eye, EyeOff, Loader2 } from 'lucide-react';
import { lookupIfsc } from '@/lib/services/ifscService';

const blockClipboard = (event) => event.preventDefault();
const ifscPattern = /^[A-Z]{4}0[A-Z0-9]{6}$/;

export default function BankDetails({ formik, isDark, errors = {}, touched = {} }) {
  const [showAccountNo, setShowAccountNo] = useState(false);
  const [ifscLookup, setIfscLookup] = useState({ status: 'idle' });
  const latestIfsc = useRef('');

  // Looks up the branch once a full IFSC is typed and fills bank and branch.
  // Saved KYC is not looked up on load, so edited names are never overwritten.
  const handleIfscChange = async (event) => {
    const code = event.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 11);
    formik.setFieldValue('ifscCode', code);
    latestIfsc.current = code;
    if (!ifscPattern.test(code)) {
      setIfscLookup({ status: 'idle' });
      return;
    }
    setIfscLookup({ status: 'loading' });
    try {
      const branch = await lookupIfsc(code);
      if (latestIfsc.current !== code) return;
      if (!branch) {
        setIfscLookup({ status: 'notFound' });
        return;
      }
      formik.setFieldValue('bankName', branch.bankName);
      formik.setFieldValue('branchName', branch.branchName);
      setIfscLookup({ status: 'found', branch });
    } catch {
      if (latestIfsc.current === code) setIfscLookup({ status: 'error' });
    }
  };
  const accountNo = (formik.values.accountNo || '').trim();
  const accountNumbersMatch = accountNo !== '' && accountNo === (formik.values.confirmAccountNo || '').trim();

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
          {/* IFSC Code comes first: looking it up fills in the bank and branch below. */}
          <div>
            <label className={hasError('ifscCode') ? errorLabelClassName : labelClassName}>
              IFSC Code <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="ifscCode"
              value={formik.values.ifscCode || ''}
              onChange={handleIfscChange}
              onBlur={formik.handleBlur}
              maxLength={11}
              autoComplete="off"
              className={hasError('ifscCode') ? errorInputClassName : inputClassName}
              placeholder="e.g. SBIN0001234"
            />
            {hasError('ifscCode') ? (
              <div className={errorTextClassName}>
                <AlertTriangle className="w-3 h-3" />
                <span>{getFieldError('ifscCode')}</span>
              </div>
            ) : ifscLookup.status === 'loading' ? (
              <div className={`text-xs mt-1 flex items-center space-x-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                <Loader2 className="w-3 h-3 animate-spin" />
                <span>Finding bank branch...</span>
              </div>
            ) : ifscLookup.status === 'found' ? (
              <div className={`text-xs mt-1 ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>
                <div className="flex items-center space-x-1">
                  <Check className="w-3 h-3" />
                  <span>{ifscLookup.branch.bankName}, {ifscLookup.branch.branchName}</span>
                </div>
                {ifscLookup.branch.address && (
                  <p className={`mt-0.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{ifscLookup.branch.address}</p>
                )}
              </div>
            ) : ifscLookup.status === 'notFound' ? (
              <div className={errorTextClassName}>
                <AlertTriangle className="w-3 h-3" />
                <span>No bank branch found for this IFSC</span>
              </div>
            ) : ifscLookup.status === 'error' ? (
              <div className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Could not look up this IFSC. Enter the bank and branch names manually.
              </div>
            ) : null}
          </div>

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
            <label className={hasError('accountHolderName') ? errorLabelClassName : labelClassName}>
              Account Holder Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="accountHolderName"
              value={formik.values.accountHolderName || ''}
              // Names only: drop digits and symbols as they are typed or pasted.
              onChange={(event) => formik.setFieldValue('accountHolderName', event.target.value.replace(/[^A-Za-z .'-]/g, ''))}
              onBlur={formik.handleBlur}
              className={hasError('accountHolderName') ? errorInputClassName : inputClassName}
              placeholder="Name as shown on bank account"
            />
            {hasError('accountHolderName') && <div className={errorTextClassName}><AlertTriangle className="w-3 h-3" /><span>{getFieldError('accountHolderName')}</span></div>}
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
            <div className="relative">
              <input
                // Masked and copy-proof so the confirm box below has to be typed, not pasted.
                type={showAccountNo ? 'text' : 'password'}
                name="accountNo"
                value={formik.values.accountNo || ''}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                onCopy={blockClipboard}
                onCut={blockClipboard}
                onDragStart={blockClipboard}
                autoComplete="new-password"
                className={`${hasError('accountNo') ? errorInputClassName : inputClassName} pr-10`}
                placeholder="Enter account number"
              />
              <button
                type="button"
                onClick={() => setShowAccountNo((shown) => !shown)}
                aria-label={showAccountNo ? 'Hide account number' : 'Show account number'}
                title={showAccountNo ? 'Hide account number' : 'Show account number'}
                className={`absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer rounded p-1 transition-colors ${isDark ? 'text-gray-400 hover:text-gold-300' : 'text-gray-500 hover:text-gold-700'}`}
              >
                {showAccountNo ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {hasError('accountNo') && (
              <div className={errorTextClassName}>
                <AlertTriangle className="w-3 h-3" />
                <span>{getFieldError('accountNo')}</span>
              </div>
            )}
          </div>

          {/* Confirm Account Number */}
          <div>
            <label className={hasError('confirmAccountNo') ? errorLabelClassName : labelClassName}>
              Confirm Account Number <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                name="confirmAccountNo"
                value={formik.values.confirmAccountNo || ''}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                // Re-typing (not pasting) is what catches a mistake in the first entry.
                onPaste={blockClipboard}
                onDrop={blockClipboard}
                autoComplete="off"
                className={`${hasError('confirmAccountNo') ? errorInputClassName : inputClassName} ${accountNumbersMatch ? 'pr-10' : ''}`}
                placeholder="Re-enter account number"
              />
              {accountNumbersMatch && (
                <span
                  role="img"
                  aria-label="Account numbers match"
                  title="Account numbers match"
                  className="absolute right-2 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full bg-emerald-500 text-white shadow-sm"
                >
                  <Check className="h-4 w-4" strokeWidth={3} />
                </span>
              )}
            </div>
            {hasError('confirmAccountNo') && (
              <div className={errorTextClassName}>
                <AlertTriangle className="w-3 h-3" />
                <span>{getFieldError('confirmAccountNo')}</span>
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
