'use client';
import React from 'react';
import { Shield, AlertTriangle } from 'lucide-react';

export default function GuarantorDetails({ formik, isDark, errors = {}, touched = {} }) {
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

  const relationOptions = [
    'Spouse', 'Father', 'Mother', 'Brother', 'Sister', 
    'Son', 'Daughter', 'Friend', 'Colleague', 'Relative', 'Other'
  ];

  return (
    <div className={`rounded-xl shadow-lg border-2 overflow-hidden ${
      isDark
        ? 'bg-gray-800 border-gold-700/50 shadow-gold-900/20'
        : 'bg-white border-gold-200 shadow-gold-500/10'
    }`}>
      <div className="p-5">
        <div className="flex items-center space-x-2 mb-4">
          <Shield className={`w-5 h-5 ${isDark ? 'text-gold-400' : 'text-gold-600'}`} />
          <h3 className={`text-lg font-semibold ${isDark ? 'text-gold-400' : 'text-gold-600'}`}>
            Guarantor Details
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Guarantor Name */}
          <div>
            <label className={hasError('guarantorName') ? errorLabelClassName : labelClassName}>
              Name
            </label>
            <input
              type="text"
              name="guarantorName"
              value={formik.values.guarantorName || ''}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={hasError('guarantorName') ? errorInputClassName : inputClassName}
              placeholder="Enter guarantor name"
            />
            {hasError('guarantorName') && (
              <div className={errorTextClassName}>
                <AlertTriangle className="w-3 h-3" />
                <span>{getFieldError('guarantorName')}</span>
              </div>
            )}
          </div>

          {/* Guarantor Relation */}
          <div>
            <label className={hasError('guarantorRelation') ? errorLabelClassName : labelClassName}>
              Relation
            </label>
            <select
              name="guarantorRelation"
              value={formik.values.guarantorRelation || ''}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={hasError('guarantorRelation') ? errorSelectClassName : selectClassName}
            >
              <option value="">Select Relation</option>
              {relationOptions.map((relation) => (
                <option key={relation} value={relation}>
                  {relation}
                </option>
              ))}
            </select>
            {hasError('guarantorRelation') && (
              <div className={errorTextClassName}>
                <AlertTriangle className="w-3 h-3" />
                <span>{getFieldError('guarantorRelation')}</span>
              </div>
            )}
          </div>

          {/* Guarantor Mobile */}
          <div>
            <label className={hasError('guarantorMobile') ? errorLabelClassName : labelClassName}>
              Mobile
            </label>
            <input
              type="tel"
              name="guarantorMobile"
              maxLength={10}
              value={formik.values.guarantorMobile || ''}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={hasError('guarantorMobile') ? errorInputClassName : inputClassName}
              placeholder="Enter 10-digit mobile number"
            />
            {hasError('guarantorMobile') && (
              <div className={errorTextClassName}>
                <AlertTriangle className="w-3 h-3" />
                <span>{getFieldError('guarantorMobile')}</span>
              </div>
            )}
          </div>

          {/* Guarantor Email */}
          <div>
            <label className={hasError('guarantorEmail') ? errorLabelClassName : labelClassName}>
              Email
            </label>
            <input
              type="email"
              name="guarantorEmail"
              value={formik.values.guarantorEmail || ''}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={hasError('guarantorEmail') ? errorInputClassName : inputClassName}
              placeholder="Enter email address"
            />
            {hasError('guarantorEmail') && (
              <div className={errorTextClassName}>
                <AlertTriangle className="w-3 h-3" />
                <span>{getFieldError('guarantorEmail')}</span>
              </div>
            )}
          </div>

          {/* Guarantor Address */}
          <div className="md:col-span-2">
            <label className={hasError('guarantorAddress') ? errorLabelClassName : labelClassName}>
              Address
            </label>
            <textarea
              rows="2"
              name="guarantorAddress"
              value={formik.values.guarantorAddress || ''}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={hasError('guarantorAddress') ? errorTextareaClassName : textareaClassName}
              placeholder="Enter guarantor address"
            />
            {hasError('guarantorAddress') && (
              <div className={errorTextClassName}>
                <AlertTriangle className="w-3 h-3" />
                <span>{getFieldError('guarantorAddress')}</span>
              </div>
            )}
          </div>

          {/* Guarantor Remark */}
          <div className="md:col-span-2">
            <label className={labelClassName}>
              Remark
            </label>
            <input
              type="text"
              name="guarantorRemark"
              value={formik.values.guarantorRemark || ''}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={hasError('guarantorRemark') ? errorInputClassName : inputClassName}
              placeholder="Any remarks..."
            />
            {hasError('guarantorRemark') && (
              <div className={errorTextClassName}>
                <AlertTriangle className="w-3 h-3" />
                <span>{getFieldError('guarantorRemark')}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}