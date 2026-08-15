'use client';
import React from 'react';
import { User, AlertTriangle } from 'lucide-react';

export default function PersonalDetails({ formik, isDark, errors = {}, touched = {} }) {
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

  // ✅ FIXED: Properly handle nested field changes
  const handleNestedChange = (parent, field, value) => {
    // Get current dob object
    const currentDob = formik.values.dob || {};
    // Update only the specific field
    formik.setFieldValue('dob', {
      ...currentDob,
      [field]: value
    });
  };

  return (
    <div className={`rounded-xl shadow-lg border-2 overflow-hidden ${
      isDark
        ? 'bg-gray-800 border-gold-700/50 shadow-gold-900/20'
        : 'bg-white border-gold-200 shadow-gold-500/10'
    }`}>
      <div className="p-5">
        <div className="flex items-center space-x-2 mb-4">
          <User className={`w-5 h-5 ${isDark ? 'text-gold-400' : 'text-gold-600'}`} />
          <h3 className={`text-lg font-semibold ${isDark ? 'text-gold-400' : 'text-gold-600'}`}>
            Personal Details
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Full Name */}
          <div className="md:col-span-2">
            <label className={hasError('name') ? errorLabelClassName : labelClassName}>
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formik.values.name || ''}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={hasError('name') ? errorInputClassName : inputClassName}
              placeholder="Enter full name"
            />
            {hasError('name') && (
              <div className={errorTextClassName}>
                <AlertTriangle className="w-3 h-3" />
                <span>{getFieldError('name')}</span>
              </div>
            )}
          </div>

          {/* Email */}
          <div>
            <label className={hasError('email') ? errorLabelClassName : labelClassName}>
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formik.values.email || ''}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={hasError('email') ? errorInputClassName : inputClassName}
              placeholder="Enter email address"
            />
            {hasError('email') && (
              <div className={errorTextClassName}>
                <AlertTriangle className="w-3 h-3" />
                <span>{getFieldError('email')}</span>
              </div>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className={hasError('phoneNo') ? errorLabelClassName : labelClassName}>
              Phone No <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="phoneNo"
              maxLength={10}
              value={formik.values.phoneNo || ''}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={hasError('phoneNo') ? errorInputClassName : inputClassName}
              placeholder="Enter 10-digit phone number"
            />
            {hasError('phoneNo') && (
              <div className={errorTextClassName}>
                <AlertTriangle className="w-3 h-3" />
                <span>{getFieldError('phoneNo')}</span>
              </div>
            )}
          </div>

          {/* Alternative Phone */}
          <div>
            <label className={labelClassName}>
              Alternative Phone
            </label>
            <input
              type="tel"
              name="alternativePhone"
              maxLength={10}
              value={formik.values.alternativePhone || ''}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={hasError('alternativePhone') ? errorInputClassName : inputClassName}
              placeholder="Enter alternative phone number"
            />
            {hasError('alternativePhone') && (
              <div className={errorTextClassName}>
                <AlertTriangle className="w-3 h-3" />
                <span>{getFieldError('alternativePhone')}</span>
              </div>
            )}
          </div>

          {/* Gender */}
          <div>
            <label className={hasError('gender') ? errorLabelClassName : labelClassName}>
              Gender <span className="text-red-500">*</span>
            </label>
            <select
              name="gender"
              value={formik.values.gender || ''}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={hasError('gender') ? errorSelectClassName : selectClassName}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            {hasError('gender') && (
              <div className={errorTextClassName}>
                <AlertTriangle className="w-3 h-3" />
                <span>{getFieldError('gender')}</span>
              </div>
            )}
          </div>

          {/* DOB */}
          <div>
            <label className={hasError('dob') ? errorLabelClassName : labelClassName}>
              Date of Birth <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              <select
                value={formik.values.dob?.day || ''}
                onChange={(e) => handleNestedChange('dob', 'day', e.target.value)}
                onBlur={formik.handleBlur}
                className={hasError('dob') ? errorSelectClassName : selectClassName}
              >
                <option value="">Day</option>
                {Array.from({ length: 31 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>{i + 1}</option>
                ))}
              </select>
              <select
                value={formik.values.dob?.month || ''}
                onChange={(e) => handleNestedChange('dob', 'month', e.target.value)}
                onBlur={formik.handleBlur}
                className={hasError('dob') ? errorSelectClassName : selectClassName}
              >
                <option value="">Month</option>
                {[
                  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
                ].map((month, index) => (
                  <option key={index + 1} value={index + 1}>{month}</option>
                ))}
              </select>
              <select
                value={formik.values.dob?.year || ''}
                onChange={(e) => handleNestedChange('dob', 'year', e.target.value)}
                onBlur={formik.handleBlur}
                className={hasError('dob') ? errorSelectClassName : selectClassName}
              >
                <option value="">Year</option>
                {Array.from({ length: 70 }, (_, i) => {
                  const year = new Date().getFullYear() - 18 - i;
                  return <option key={year} value={year}>{year}</option>;
                })}
              </select>
            </div>
            {hasError('dob') && (
              <div className={errorTextClassName}>
                <AlertTriangle className="w-3 h-3" />
                <span>{getFieldError('dob')}</span>
              </div>
            )}
          </div>

          {/* Remark */}
          <div className="md:col-span-2">
            <label className={labelClassName}>
              Remark
            </label>
            <textarea
              rows="2"
              name="personalRemark"
              value={formik.values.personalRemark || ''}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={hasError('personalRemark') ? errorTextareaClassName : textareaClassName}
              placeholder="Any additional remarks..."
            />
            {hasError('personalRemark') && (
              <div className={errorTextClassName}>
                <AlertTriangle className="w-3 h-3" />
                <span>{getFieldError('personalRemark')}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}