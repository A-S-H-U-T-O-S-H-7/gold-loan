'use client';
import React, { useRef } from 'react';
import { Upload, File, X, AlertTriangle, Image } from 'lucide-react';

export default function DocumentUpload({ formik, isDark, errors = {}, touched = {} }) {
  const fileInputRefs = {
    aadhaarFront: useRef(null),
    aadhaarBack: useRef(null),
    panCard: useRef(null),
    photo: useRef(null),
    addressProof: useRef(null),
  };

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

  const handleFileChange = (fieldName, file) => {
    if (file) {
      formik.setFieldValue(fieldName, file);
    }
  };

  const handleRemoveFile = (fieldName) => {
    formik.setFieldValue(fieldName, null);
    if (fileInputRefs[fieldName]?.current) {
      fileInputRefs[fieldName].current.value = '';
    }
  };

  // ✅ FIXED: Check if it's a File using constructor name
  const getFilePreview = (file) => {
    if (!file) return null;
    
    // If it's a string (URL or filename)
    if (typeof file === 'string') {
      return file;
    }
    
    // If it's a File object (check constructor name)
    if (file && typeof file === 'object' && file.constructor && file.constructor.name === 'File') {
      return URL.createObjectURL(file);
    }
    
    return null;
  };

  // ✅ Get file name safely
  const getFileName = (file) => {
    if (!file) return 'File uploaded';
    if (typeof file === 'string') return file;
    if (file && typeof file === 'object' && file.name) return file.name;
    return 'File uploaded';
  };

  const DocumentField = ({ 
    fieldName, 
    label, 
    required = true, 
    accept = 'image/*,.pdf',
    icon: Icon = Image
  }) => {
    const file = formik.values[fieldName];
    const preview = file ? getFilePreview(file) : null;
    const error = hasError(fieldName);
    const fileName = getFileName(file);

    return (
      <div>
        <label className={error ? errorLabelClassName : labelClassName}>
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        
        {file ? (
          <div className={`flex items-center gap-3 p-3 rounded border-2 ${
            isDark
              ? 'border-gold-600/50 bg-gray-700'
              : 'border-gold-200 bg-gray-50'
          }`}>
            <div className={`w-10 h-10 rounded flex items-center justify-center flex-shrink-0 ${
              isDark ? 'bg-gray-600' : 'bg-gold-100'
            }`}>
              {preview && typeof preview === 'string' && preview.startsWith('blob:') ? (
                <img src={preview} alt={label} className="w-8 h-8 object-cover rounded" />
              ) : (
                <Icon className={`w-5 h-5 ${isDark ? 'text-gold-400' : 'text-gold-600'}`} />
              )}
            </div>
            <span className={`flex-1 text-sm truncate ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
              {fileName}
            </span>
            <button
              type="button"
              onClick={() => handleRemoveFile(fieldName)}
              className={`p-1 rounded transition-colors ${
                isDark
                  ? 'hover:bg-gray-600 text-gray-400 hover:text-red-400'
                  : 'hover:bg-gray-200 text-gray-500 hover:text-red-500'
              }`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRefs[fieldName]?.current?.click()}
            className={`w-full p-6 rounded border-2 border-dashed transition-all duration-200 flex flex-col items-center gap-2 ${
              error
                ? isDark
                  ? 'border-red-500 bg-red-900/10'
                  : 'border-red-400 bg-red-50'
                : isDark
                  ? 'border-gold-600/30 hover:border-gold-500 bg-gray-700/50'
                  : 'border-gold-300 hover:border-gold-500 bg-gray-50'
            }`}
          >
            <Upload className={`w-8 h-8 ${error ? 'text-red-400' : isDark ? 'text-gold-400' : 'text-gold-600'}`} />
            <span className={`text-sm ${error ? 'text-red-400' : isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Click to upload {label}
            </span>
            <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              JPG, PNG, PDF (Max 5MB)
            </span>
          </button>
        )}
        
        <input
          ref={fileInputRefs[fieldName]}
          type="file"
          accept={accept}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              handleFileChange(fieldName, file);
            }
          }}
          className="hidden"
        />
        
        {error && (
          <div className={errorTextClassName}>
            <AlertTriangle className="w-3 h-3" />
            <span>{getFieldError(fieldName)}</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`rounded-xl shadow-lg border-2 overflow-hidden ${
      isDark
        ? 'bg-gray-800 border-gold-700/50 shadow-gold-900/20'
        : 'bg-white border-gold-200 shadow-gold-500/10'
    }`}>
      <div className="p-5">
        <div className="flex items-center space-x-2 mb-4">
          <File className={`w-5 h-5 ${isDark ? 'text-gold-400' : 'text-gold-600'}`} />
          <h3 className={`text-lg font-semibold ${isDark ? 'text-gold-400' : 'text-gold-600'}`}>
            Document Upload
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DocumentField
            fieldName="aadhaarFront"
            label="Aadhaar Front"
            required={true}
            icon={Image}
          />
          <DocumentField
            fieldName="aadhaarBack"
            label="Aadhaar Back"
            required={true}
            icon={Image}
          />
          <DocumentField
            fieldName="panCard"
            label="PAN Card"
            required={true}
            icon={File}
          />
          <DocumentField
            fieldName="photo"
            label="Photo"
            required={true}
            icon={Image}
            accept="image/*"
          />
          <div className="md:col-span-2">
            <DocumentField
              fieldName="addressProof"
              label="Current Address Proof"
              required={true}
              icon={File}
            />
          </div>
        </div>
      </div>
    </div>
  );
}