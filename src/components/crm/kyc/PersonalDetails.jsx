import React from 'react';
import { User, Calendar, Phone, Mail, AlertTriangle } from 'lucide-react';

const PersonalDetails = ({ formik, isDark }) => {
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
          <User className={`w-5 h-5 ${isDark ? "text-crm-primary-strong" : "text-crm-primary"}`} />
          <h3 className={`text-lg font-semibold ${isDark ? "text-crm-primary-strong" : "text-crm-primary"}`}>
            Personal Details
          </h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className={hasError('fullName') ? errorLabelClassName : labelClassName}>
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="fullName"
              value={formik.values.fullName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={hasError('fullName') ? errorInputClassName : inputClassName}
              placeholder="Enter full name"
            />
            {hasError('fullName') && (
              <div className={errorTextClassName}>
                <AlertTriangle className="w-3 h-3" />
                <span>{getFieldError('fullName')}</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={hasError('dob') ? errorLabelClassName : labelClassName}>
                Date of Birth <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="dob"
                value={formik.values.dob}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={hasError('dob') ? errorInputClassName : inputClassName}
              />
              {hasError('dob') && (
                <div className={errorTextClassName}>
                  <AlertTriangle className="w-3 h-3" />
                  <span>{getFieldError('dob')}</span>
                </div>
              )}
            </div>

            <div>
              <label className={hasError('gender') ? errorLabelClassName : labelClassName}>
                Gender <span className="text-red-500">*</span>
              </label>
              <select
                name="gender"
                value={formik.values.gender}
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={hasError('mobile') ? errorLabelClassName : labelClassName}>
                Mobile Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="mobile"
                value={formik.values.mobile}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                maxLength="10"
                className={hasError('mobile') ? errorInputClassName : inputClassName}
                placeholder="10-digit mobile number"
              />
              {hasError('mobile') && (
                <div className={errorTextClassName}>
                  <AlertTriangle className="w-3 h-3" />
                  <span>{getFieldError('mobile')}</span>
                </div>
              )}
            </div>

            <div>
              <label className={labelClassName}>
                Alternate Phone <span className="text-gray-400 text-xs">(Optional)</span>
              </label>
              <input
                type="tel"
                name="alternatePhone"
                value={formik.values.alternatePhone}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                maxLength="10"
                className={inputClassName}
                placeholder="Alternate number"
              />
            </div>
          </div>

          {/* Email - NOW MANDATORY */}
          <div>
            <label className={hasError('email') ? errorLabelClassName : labelClassName}>
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={hasError('email') ? errorInputClassName : inputClassName}
              placeholder="email@example.com"
            />
            {hasError('email') && (
              <div className={errorTextClassName}>
                <AlertTriangle className="w-3 h-3" />
                <span>{getFieldError('email')}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalDetails;