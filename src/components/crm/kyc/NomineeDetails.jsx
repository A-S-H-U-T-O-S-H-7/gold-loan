import React from 'react';
import { User, Calendar, Phone, Mail, CreditCard, FileText, AlertTriangle } from 'lucide-react';

const relationOptions = [
  { value: 'Spouse', label: 'Spouse' },
  { value: 'Father', label: 'Father' },
  { value: 'Mother', label: 'Mother' },
  { value: 'Brother', label: 'Brother' },
  { value: 'Sister', label: 'Sister' },
  { value: 'Son', label: 'Son' },
  { value: 'Daughter', label: 'Daughter' },
  { value: 'Other', label: 'Other' }
];

const NomineeDetails = ({ formik, isDark }) => {
  // Helper to check field error - shows error if touched OR form is submitting
  const hasError = (fieldPath) => {
    const isTouched = formik.touched[fieldPath];
    const isSubmitting = formik.isSubmitting;
    const hasErrorValue = formik.errors[fieldPath];
    // Show error if field is touched OR form is being submitted
    return hasErrorValue && (isTouched || isSubmitting);
  };

  const getFieldError = (fieldPath) => {
    return formik.errors[fieldPath];
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

  // Helper to handle blur and set touched
  const handleBlur = (fieldPath, e) => {
    formik.handleBlur(e);
    formik.setFieldTouched(fieldPath, true);
  };

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
            Nominee Details <span className="text-red-500 text-sm">*</span>
          </h3>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={hasError('nominee.name') ? errorLabelClassName : labelClassName}>
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="nominee.name"
                value={formik.values.nominee?.name || ''}
                onChange={formik.handleChange}
                onBlur={(e) => handleBlur('nominee.name', e)}
                className={hasError('nominee.name') ? errorInputClassName : inputClassName}
                placeholder="Enter nominee full name"
              />
              {hasError('nominee.name') && (
                <div className={errorTextClassName}>
                  <AlertTriangle className="w-3 h-3" />
                  <span>{getFieldError('nominee.name')}</span>
                </div>
              )}
            </div>

            <div>
              <label className={hasError('nominee.relation') ? errorLabelClassName : labelClassName}>
                Relation <span className="text-red-500">*</span>
              </label>
              <select
                name="nominee.relation"
                value={formik.values.nominee?.relation || ''}
                onChange={formik.handleChange}
                onBlur={(e) => handleBlur('nominee.relation', e)}
                className={hasError('nominee.relation') ? errorSelectClassName : selectClassName}
              >
                <option value="">Select Relation</option>
                {relationOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              {hasError('nominee.relation') && (
                <div className={errorTextClassName}>
                  <AlertTriangle className="w-3 h-3" />
                  <span>{getFieldError('nominee.relation')}</span>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={hasError('nominee.dob') ? errorLabelClassName : labelClassName}>
                Date of Birth <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="nominee.dob"
                value={formik.values.nominee?.dob || ''}
                onChange={formik.handleChange}
                onBlur={(e) => handleBlur('nominee.dob', e)}
                className={hasError('nominee.dob') ? errorInputClassName : inputClassName}
              />
              {hasError('nominee.dob') && (
                <div className={errorTextClassName}>
                  <AlertTriangle className="w-3 h-3" />
                  <span>{getFieldError('nominee.dob')}</span>
                </div>
              )}
            </div>

            <div>
              <label className={hasError('nominee.gender') ? errorLabelClassName : labelClassName}>
                Gender <span className="text-red-500">*</span>
              </label>
              <select
                name="nominee.gender"
                value={formik.values.nominee?.gender || ''}
                onChange={formik.handleChange}
                onBlur={(e) => handleBlur('nominee.gender', e)}
                className={hasError('nominee.gender') ? errorSelectClassName : selectClassName}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              {hasError('nominee.gender') && (
                <div className={errorTextClassName}>
                  <AlertTriangle className="w-3 h-3" />
                  <span>{getFieldError('nominee.gender')}</span>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={hasError('nominee.mobile') ? errorLabelClassName : labelClassName}>
                Mobile Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="nominee.mobile"
                value={formik.values.nominee?.mobile || ''}
                onChange={formik.handleChange}
                onBlur={(e) => handleBlur('nominee.mobile', e)}
                maxLength="10"
                className={hasError('nominee.mobile') ? errorInputClassName : inputClassName}
                placeholder="10-digit mobile number"
              />
              {hasError('nominee.mobile') && (
                <div className={errorTextClassName}>
                  <AlertTriangle className="w-3 h-3" />
                  <span>{getFieldError('nominee.mobile')}</span>
                </div>
              )}
            </div>

            <div>
              <label className={hasError('nominee.email') ? errorLabelClassName : labelClassName}>
                Email Address
              </label>
              <input
                type="email"
                name="nominee.email"
                value={formik.values.nominee?.email || ''}
                onChange={formik.handleChange}
                onBlur={(e) => handleBlur('nominee.email', e)}
                className={hasError('nominee.email') ? errorInputClassName : inputClassName}
                placeholder="email@example.com"
              />
              {hasError('nominee.email') && (
                <div className={errorTextClassName}>
                  <AlertTriangle className="w-3 h-3" />
                  <span>{getFieldError('nominee.email')}</span>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={hasError('nominee.aadharNumber') ? errorLabelClassName : labelClassName}>
                Aadhaar Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="nominee.aadharNumber"
                value={formik.values.nominee?.aadharNumber || ''}
                onChange={formik.handleChange}
                onBlur={(e) => handleBlur('nominee.aadharNumber', e)}
                maxLength="12"
                className={hasError('nominee.aadharNumber') ? errorInputClassName : inputClassName}
                placeholder="12-digit Aadhaar number"
              />
              {hasError('nominee.aadharNumber') && (
                <div className={errorTextClassName}>
                  <AlertTriangle className="w-3 h-3" />
                  <span>{getFieldError('nominee.aadharNumber')}</span>
                </div>
              )}
            </div>

            <div>
              <label className={labelClassName}>
                PAN Number <span className="text-gray-400 text-xs">(Optional)</span>
              </label>
              <input
                type="text"
                name="nominee.panNumber"
                value={formik.values.nominee?.panNumber || ''}
                onChange={(e) => {
                  const value = e.target.value.toUpperCase();
                  formik.setFieldValue('nominee.panNumber', value);
                }}
                onBlur={formik.handleBlur}
                maxLength="10"
                className={inputClassName}
                placeholder="10-digit PAN number"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NomineeDetails;