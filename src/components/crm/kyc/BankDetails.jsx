import React from 'react';
import { Building, CreditCard, FileText, User, AlertTriangle } from 'lucide-react';

const BankDetails = ({ formik, isDark }) => {
  const hasError = (fieldName) => {
    return formik.errors[fieldName] && formik.touched[fieldName];
  };

  const getFieldError = (fieldName) => {
    return formik.errors[fieldName];
  };

  const inputClassName = `w-full px-3 py-2 rounded-lg border-2 transition-all duration-200 text-sm outline-none ${
    isDark
      ? "bg-gray-700 border-gray-600 text-white hover:border-crm-primary focus:border-crm-primary-strong focus:ring-2 focus:ring-crm-ring"
      : "bg-gray-50 border-gray-300 text-gray-900 hover:border-crm-primary focus:border-crm-primary focus:ring-2 focus:ring-crm-ring"
  }`;

  const errorInputClassName = `w-full px-3 py-2 rounded-lg border-2 transition-all duration-200 text-sm outline-none ${
    isDark
      ? "bg-gray-700 border-red-500 text-white hover:border-red-400 focus:border-red-400"
      : "bg-red-50 border-red-400 text-gray-900 hover:border-red-400 focus:border-red-500"
  } focus:ring-2 focus:ring-red-500/20`;

  const selectClassName = `w-full px-3 py-2 rounded-lg border-2 transition-all duration-200 text-sm outline-none ${
    isDark
      ? "bg-gray-700 border-gray-600 text-white hover:border-crm-primary focus:border-crm-primary-strong focus:ring-2 focus:ring-crm-ring"
      : "bg-gray-50 border-gray-300 text-gray-900 hover:border-crm-primary focus:border-crm-primary focus:ring-2 focus:ring-crm-ring"
  }`;

  const errorSelectClassName = `w-full px-3 py-2 rounded-lg border-2 transition-all duration-200 text-sm outline-none ${
    isDark
      ? "bg-gray-700 border-red-500 text-white hover:border-red-400 focus:border-red-400"
      : "bg-red-50 border-red-400 text-gray-900 hover:border-red-400 focus:border-red-500"
  } focus:ring-2 focus:ring-red-500/20`;

  const labelClassName = `block text-xs font-medium mb-1 ${
    isDark ? "text-gray-200" : "text-gray-700"
  }`;

  const errorLabelClassName = `block text-xs font-medium mb-1 ${
    isDark ? "text-red-400" : "text-red-600"
  }`;

  const errorTextClassName = `text-xs mt-1 flex items-center gap-1 ${
    isDark ? "text-red-400" : "text-red-600"
  }`;

  return (
    <div className={`rounded-xl shadow-lg border-2 overflow-hidden ${
      isDark
        ? "bg-gray-800 border-crm-border shadow-crm-soft"
        : "bg-white border-crm-border shadow-crm-soft"
    }`}>
      <div className="p-5">
        <div className="flex items-center space-x-2 mb-4">
          <Building className={`w-5 h-5 ${isDark ? "text-crm-primary-strong" : "text-crm-primary"}`} />
          <h3 className={`text-lg font-semibold ${isDark ? "text-crm-primary-strong" : "text-crm-primary"}`}>
            Bank Details
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={hasError('accountNumber') ? errorLabelClassName : labelClassName}>
              Account Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="accountNumber"
              value={formik.values.accountNumber}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={hasError('accountNumber') ? errorInputClassName : inputClassName}
              placeholder="Enter account number"
            />
            {hasError('accountNumber') && (
              <div className={errorTextClassName}>
                <AlertTriangle className="w-3 h-3" />
                <span>{getFieldError('accountNumber')}</span>
              </div>
            )}
          </div>

          <div>
            <label className={hasError('accountType') ? errorLabelClassName : labelClassName}>
              Account Type <span className="text-red-500">*</span>
            </label>
            <select
              name="accountType"
              value={formik.values.accountType}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={hasError('accountType') ? errorSelectClassName : selectClassName}
            >
              <option value="Saving">Saving Account</option>
              <option value="Current">Current Account</option>
            </select>
            {hasError('accountType') && (
              <div className={errorTextClassName}>
                <AlertTriangle className="w-3 h-3" />
                <span>{getFieldError('accountType')}</span>
              </div>
            )}
          </div>

          <div>
            <label className={hasError('ifsc') ? errorLabelClassName : labelClassName}>
              IFSC Code <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="ifsc"
              value={formik.values.ifsc}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={hasError('ifsc') ? errorInputClassName : inputClassName}
              placeholder="Enter IFSC code"
            />
            {hasError('ifsc') && (
              <div className={errorTextClassName}>
                <AlertTriangle className="w-3 h-3" />
                <span>{getFieldError('ifsc')}</span>
              </div>
            )}
          </div>

          <div>
            <label className={hasError('bankName') ? errorLabelClassName : labelClassName}>
              Bank Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="bankName"
              value={formik.values.bankName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={hasError('bankName') ? errorInputClassName : inputClassName}
              placeholder="Bank name"
            />
            {hasError('bankName') && (
              <div className={errorTextClassName}>
                <AlertTriangle className="w-3 h-3" />
                <span>{getFieldError('bankName')}</span>
              </div>
            )}
          </div>

          <div>
            <label className={hasError('bankBranch') ? errorLabelClassName : labelClassName}>
              Bank Branch <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="bankBranch"
              value={formik.values.bankBranch}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={hasError('bankBranch') ? errorInputClassName : inputClassName}
              placeholder="Branch name"
            />
            {hasError('bankBranch') && (
              <div className={errorTextClassName}>
                <AlertTriangle className="w-3 h-3" />
                <span>{getFieldError('bankBranch')}</span>
              </div>
            )}
          </div>

          <div>
            <label className={hasError('accountHolderName') ? errorLabelClassName : labelClassName}>
              Account Holder Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="accountHolderName"
              value={formik.values.accountHolderName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={hasError('accountHolderName') ? errorInputClassName : inputClassName}
              placeholder="As per bank records"
            />
            {hasError('accountHolderName') && (
              <div className={errorTextClassName}>
                <AlertTriangle className="w-3 h-3" />
                <span>{getFieldError('accountHolderName')}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BankDetails;