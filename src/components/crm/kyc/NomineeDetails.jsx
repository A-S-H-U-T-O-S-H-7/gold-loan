'use client';
import React from 'react';
import { Users, AlertTriangle } from 'lucide-react';

export default function NomineeDetails({ formik, isDark, errors = {}, touched = {} }) {
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
    'Son', 'Daughter', 'Friend', 'Colleague', 'Other'
  ];

  return (
    <div className={`rounded-xl shadow-lg border-2 overflow-hidden ${
      isDark
        ? 'bg-gray-800 border-gold-700/50 shadow-gold-900/20'
        : 'bg-white border-gold-200 shadow-gold-500/10'
    }`}>
      <div className="p-5">
        <div className="flex items-center space-x-2 mb-4">
          <Users className={`w-5 h-5 ${isDark ? 'text-gold-400' : 'text-gold-600'}`} />
          <h3 className={`text-lg font-semibold ${isDark ? 'text-gold-400' : 'text-gold-600'}`}>
            Nominee Details
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Nominee Name */}
          <div>
            <label className={hasError('nomineeName') ? errorLabelClassName : labelClassName}>
              Name
            </label>
            <input
              type="text"
              name="nomineeName"
              value={formik.values.nomineeName || ''}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={hasError('nomineeName') ? errorInputClassName : inputClassName}
              placeholder="Enter nominee name"
            />
            {hasError('nomineeName') && (
              <div className={errorTextClassName}>
                <AlertTriangle className="w-3 h-3" />
                <span>{getFieldError('nomineeName')}</span>
              </div>
            )}
          </div>

          {/* Nominee Relation */}
          <div>
            <label className={hasError('nomineeRelation') ? errorLabelClassName : labelClassName}>
              Relation
            </label>
            <select
              name="nomineeRelation"
              value={formik.values.nomineeRelation || ''}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={hasError('nomineeRelation') ? errorSelectClassName : selectClassName}
            >
              <option value="">Select Relation</option>
              {relationOptions.map((relation) => (
                <option key={relation} value={relation}>
                  {relation}
                </option>
              ))}
            </select>
            {hasError('nomineeRelation') && (
              <div className={errorTextClassName}>
                <AlertTriangle className="w-3 h-3" />
                <span>{getFieldError('nomineeRelation')}</span>
              </div>
            )}
          </div>

          {/* Nominee Mobile */}
          <div>
            <label className={hasError('nomineeMobile') ? errorLabelClassName : labelClassName}>
              Mobile
            </label>
            <input
              type="tel"
              name="nomineeMobile"
              maxLength={10}
              value={formik.values.nomineeMobile || ''}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={hasError('nomineeMobile') ? errorInputClassName : inputClassName}
              placeholder="Enter 10-digit mobile number"
            />
            {hasError('nomineeMobile') && (
              <div className={errorTextClassName}>
                <AlertTriangle className="w-3 h-3" />
                <span>{getFieldError('nomineeMobile')}</span>
              </div>
            )}
          </div>

          {/* Nominee Email */}
          <div>
            <label className={hasError('nomineeEmail') ? errorLabelClassName : labelClassName}>
              Email
            </label>
            <input
              type="email"
              name="nomineeEmail"
              value={formik.values.nomineeEmail || ''}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={hasError('nomineeEmail') ? errorInputClassName : inputClassName}
              placeholder="Enter email address"
            />
            {hasError('nomineeEmail') && (
              <div className={errorTextClassName}>
                <AlertTriangle className="w-3 h-3" />
                <span>{getFieldError('nomineeEmail')}</span>
              </div>
            )}
          </div>

          {/* Nominee Address */}
          <div className="md:col-span-2">
            <label className={hasError('nomineeAddress') ? errorLabelClassName : labelClassName}>
              Address
            </label>
            <textarea
              rows="2"
              name="nomineeAddress"
              value={formik.values.nomineeAddress || ''}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={hasError('nomineeAddress') ? errorTextareaClassName : textareaClassName}
              placeholder="Enter nominee address"
            />
            {hasError('nomineeAddress') && (
              <div className={errorTextClassName}>
                <AlertTriangle className="w-3 h-3" />
                <span>{getFieldError('nomineeAddress')}</span>
              </div>
            )}
          </div>

          {/* Nominee Remark */}
          <div className="md:col-span-2">
            <label className={labelClassName}>
              Remark
            </label>
            <input
              type="text"
              name="nomineeRemark"
              value={formik.values.nomineeRemark || ''}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={hasError('nomineeRemark') ? errorInputClassName : inputClassName}
              placeholder="Any remarks..."
            />
            {hasError('nomineeRemark') && (
              <div className={errorTextClassName}>
                <AlertTriangle className="w-3 h-3" />
                <span>{getFieldError('nomineeRemark')}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}