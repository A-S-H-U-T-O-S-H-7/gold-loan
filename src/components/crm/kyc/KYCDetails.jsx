import React, { useState } from 'react';
import { CreditCard, FileText, Check, Camera, IdCard, AlertTriangle, X } from 'lucide-react';

const KYCDetails = ({ formik, isDark, isNewUser, fileRefs }) => {
  const [verifyingAadhar, setVerifyingAadhar] = useState(false);
  const [verifyingPAN, setVerifyingPAN] = useState(false);

  const hasError = (fieldName) => {
    return formik.errors[fieldName] && formik.touched[fieldName];
  };

  const getFieldError = (fieldName) => {
    return formik.errors[fieldName];
  };

  const handleFileUpload = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size should be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      // Set the file value first
      formik.setFieldValue(type, file);
      formik.setFieldValue(`${type}Preview`, reader.result);
      // Mark as touched to trigger validation
      formik.setFieldTouched(type, true);
      // Force validation to clear error immediately
      setTimeout(() => {
        formik.validateField(type);
      }, 100);
    };
    reader.readAsDataURL(file);
  };

  const handleClearFile = (type) => {
    formik.setFieldValue(type, null);
    formik.setFieldValue(`${type}Preview`, '');
    formik.setFieldTouched(type, true);
    formik.validateField(type);
    if (fileRefs[type]?.current) {
      fileRefs[type].current.value = '';
    }
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
          <CreditCard className={`w-5 h-5 ${isDark ? "text-crm-primary-strong" : "text-crm-primary"}`} />
          <h3 className={`text-lg font-semibold ${isDark ? "text-crm-primary-strong" : "text-crm-primary"}`}>
            KYC Details
          </h3>
        </div>

        <div className="space-y-4">
          {/* Aadhaar Number */}
          <div>
            <label className={hasError('aadharNumber') ? errorLabelClassName : labelClassName}>
              Aadhaar Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="aadharNumber"
              value={formik.values.aadharNumber}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              maxLength="12"
              className={hasError('aadharNumber') ? errorInputClassName : inputClassName}
              placeholder="12-digit Aadhaar number"
            />
            {hasError('aadharNumber') && (
              <div className={errorTextClassName}>
                <AlertTriangle className="w-3 h-3" />
                <span>{getFieldError('aadharNumber')}</span>
              </div>
            )}
          </div>

          {/* PAN Number */}
          <div>
            <label className={hasError('panNumber') ? errorLabelClassName : labelClassName}>
              PAN Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="panNumber"
              value={formik.values.panNumber}
              onChange={(e) => {
                const value = e.target.value.toUpperCase();
                formik.setFieldValue('panNumber', value);
              }}
              onBlur={formik.handleBlur}
              maxLength="10"
              className={hasError('panNumber') ? errorInputClassName : inputClassName}
              placeholder="10-digit PAN number"
            />
            {hasError('panNumber') && (
              <div className={errorTextClassName}>
                <AlertTriangle className="w-3 h-3" />
                <span>{getFieldError('panNumber')}</span>
              </div>
            )}
          </div>

          {/* Documents Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {/* Aadhaar Front */}
            <div>
              <label className={hasError('aadharDocument') ? errorLabelClassName : labelClassName}>
                Aadhaar Front {isNewUser && <span className="text-red-500">*</span>}
              </label>
              {formik.values.aadharDocumentPreview ? (
                <div className="relative inline-block">
                  <img src={formik.values.aadharDocumentPreview} alt="Aadhaar Front" className="w-28 h-28 object-cover rounded-lg border-2 border-crm-border" />
                  <button
                    type="button"
                    onClick={() => handleClearFile('aadharDocument')}
                    className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all duration-200"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileRefs.aadharFileRef?.current?.click()}
                  className={`border-2 border-dashed rounded-lg p-5 cursor-pointer transition-all duration-200 ${
                    hasError('aadharDocument')
                      ? isDark ? "border-red-500 bg-gray-700/40" : "border-red-400 bg-red-50"
                      : isDark ? "border-crm-border hover:border-crm-primary bg-gray-700/40" : "border-crm-border hover:border-crm-primary bg-crm-accent-soft/60"
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <IdCard className={`w-5 h-5 ${hasError('aadharDocument') ? (isDark ? "text-red-400" : "text-red-500") : (isDark ? "text-gray-400" : "text-crm-primary")}`} />
                    <p className="text-xs text-center">Click to upload</p>
                    <p className="text-[10px] text-gray-500">JPG, PNG, PDF (Max 5MB)</p>
                  </div>
                </div>
              )}
              <input ref={fileRefs.aadharFileRef} type="file" accept="image/*,.pdf" onChange={(e) => handleFileUpload(e, 'aadharDocument')} className="hidden" />
              {hasError('aadharDocument') && (
                <div className={errorTextClassName}>
                  <AlertTriangle className="w-3 h-3" />
                  <span>{getFieldError('aadharDocument')}</span>
                </div>
              )}
            </div>

            {/* Aadhaar Back */}
            <div>
              <label className={hasError('aadharBackDocument') ? errorLabelClassName : labelClassName}>
                Aadhaar Back {isNewUser && <span className="text-red-500">*</span>}
              </label>
              {formik.values.aadharBackDocumentPreview ? (
                <div className="relative inline-block">
                  <img src={formik.values.aadharBackDocumentPreview} alt="Aadhaar Back" className="w-28 h-28 object-cover rounded-lg border-2 border-crm-border" />
                  <button
                    type="button"
                    onClick={() => handleClearFile('aadharBackDocument')}
                    className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all duration-200"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileRefs.aadharBackFileRef?.current?.click()}
                  className={`border-2 border-dashed rounded-lg p-5 cursor-pointer transition-all duration-200 ${
                    hasError('aadharBackDocument')
                      ? isDark ? "border-red-500 bg-gray-700/40" : "border-red-400 bg-red-50"
                      : isDark ? "border-crm-border hover:border-crm-primary bg-gray-700/40" : "border-crm-border hover:border-crm-primary bg-crm-accent-soft/60"
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <IdCard className={`w-5 h-5 ${hasError('aadharBackDocument') ? (isDark ? "text-red-400" : "text-red-500") : (isDark ? "text-gray-400" : "text-crm-primary")}`} />
                    <p className="text-xs text-center">Click to upload</p>
                    <p className="text-[10px] text-gray-500">JPG, PNG, PDF (Max 5MB)</p>
                  </div>
                </div>
              )}
              <input ref={fileRefs.aadharBackFileRef} type="file" accept="image/*,.pdf" onChange={(e) => handleFileUpload(e, 'aadharBackDocument')} className="hidden" />
              {hasError('aadharBackDocument') && (
                <div className={errorTextClassName}>
                  <AlertTriangle className="w-3 h-3" />
                  <span>{getFieldError('aadharBackDocument')}</span>
                </div>
              )}
            </div>

            {/* PAN Card */}
            <div>
              <label className={hasError('panDocument') ? errorLabelClassName : labelClassName}>
                PAN Card {isNewUser && <span className="text-red-500">*</span>}
              </label>
              {formik.values.panDocumentPreview ? (
                <div className="relative inline-block">
                  <img src={formik.values.panDocumentPreview} alt="PAN Card" className="w-28 h-28 object-cover rounded-lg border-2 border-crm-border" />
                  <button
                    type="button"
                    onClick={() => handleClearFile('panDocument')}
                    className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all duration-200"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileRefs.panFileRef?.current?.click()}
                  className={`border-2 border-dashed rounded-lg p-5 cursor-pointer transition-all duration-200 ${
                    hasError('panDocument')
                      ? isDark ? "border-red-500 bg-gray-700/40" : "border-red-400 bg-red-50"
                      : isDark ? "border-crm-border hover:border-crm-primary bg-gray-700/40" : "border-crm-border hover:border-crm-primary bg-crm-accent-soft/60"
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <FileText className={`w-5 h-5 ${hasError('panDocument') ? (isDark ? "text-red-400" : "text-red-500") : (isDark ? "text-gray-400" : "text-crm-primary")}`} />
                    <p className="text-xs text-center">Click to upload</p>
                    <p className="text-[10px] text-gray-500">JPG, PNG, PDF (Max 5MB)</p>
                  </div>
                </div>
              )}
              <input ref={fileRefs.panFileRef} type="file" accept="image/*,.pdf" onChange={(e) => handleFileUpload(e, 'panDocument')} className="hidden" />
              {hasError('panDocument') && (
                <div className={errorTextClassName}>
                  <AlertTriangle className="w-3 h-3" />
                  <span>{getFieldError('panDocument')}</span>
                </div>
              )}
            </div>

            {/* Live Photo */}
            <div>
              <label className={hasError('livePhoto') ? errorLabelClassName : labelClassName}>
                Live Photo {isNewUser && <span className="text-red-500">*</span>}
              </label>
              {formik.values.livePhotoPreview ? (
                <div className="relative inline-block">
                  <img src={formik.values.livePhotoPreview} alt="Live Photo" className="w-28 h-28 object-cover rounded-lg border-2 border-crm-border" />
                  <button
                    type="button"
                    onClick={() => handleClearFile('livePhoto')}
                    className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all duration-200"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileRefs.livePhotoRef?.current?.click()}
                  className={`border-2 border-dashed rounded-lg p-5 cursor-pointer transition-all duration-200 ${
                    hasError('livePhoto')
                      ? isDark ? "border-red-500 bg-gray-700/40" : "border-red-400 bg-red-50"
                      : isDark ? "border-crm-border hover:border-crm-primary bg-gray-700/40" : "border-crm-border hover:border-crm-primary bg-crm-accent-soft/60"
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <Camera className={`w-5 h-5 ${hasError('livePhoto') ? (isDark ? "text-red-400" : "text-red-500") : (isDark ? "text-gray-400" : "text-crm-primary")}`} />
                    <p className="text-xs text-center">Click to upload</p>
                    <p className="text-[10px] text-gray-500">JPG, PNG (Max 5MB)</p>
                  </div>
                </div>
              )}
              <input ref={fileRefs.livePhotoRef} type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'livePhoto')} className="hidden" />
              {hasError('livePhoto') && (
                <div className={errorTextClassName}>
                  <AlertTriangle className="w-3 h-3" />
                  <span>{getFieldError('livePhoto')}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KYCDetails;