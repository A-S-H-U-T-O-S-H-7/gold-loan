import React from 'react';
import { Upload, FileText, X } from 'lucide-react';

const FileUploadField = ({ 
  label, 
  name, 
  required = false, 
  preview, 
  onUpload, 
  onClear, 
  error, 
  isDark,
  fileRef,
  accept = "image/*,.pdf",
  icon: Icon = Upload
}) => {
  return (
    <div className="space-y-1">
      <label className={`block text-xs font-medium ${isDark ? "text-gray-200" : "text-gray-700"}`}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      {preview ? (
        <div className="relative inline-block">
          {preview.startsWith('data:image') ? (
            <img 
              src={preview} 
              alt="Preview" 
              className="w-28 h-28 object-cover rounded-lg border-2 border-crm-border"
            />
          ) : (
            <div className={`w-28 h-28 flex items-center justify-center rounded-lg border-2 ${
              isDark ? "border-gray-600 bg-gray-700" : "border-crm-border bg-crm-accent-soft"
            }`}>
              <FileText className={`w-8 h-8 ${isDark ? "text-gray-400" : "text-gray-500"}`} />
            </div>
          )}
          <button
            type="button"
            onClick={onClear}
            className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ) : (
        <div
          onClick={() => fileRef.current?.click()}
          className={`border-2 border-dashed rounded-lg p-5 cursor-pointer transition-all duration-200 ${
            isDark
              ? "border-gray-600 hover:border-crm-primary bg-gray-700/40"
              : "border-crm-border hover:border-crm-primary bg-crm-accent-soft/60"
          }`}
        >
          <div className="flex flex-col items-center gap-2">
            <Icon className={`w-5 h-5 ${isDark ? "text-gray-400" : "text-crm-primary"}`} />
            <p className={`text-xs font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>
              Click to upload
            </p>
            <p className={`text-[11px] ${isDark ? "text-gray-500" : "text-gray-500"}`}>
              Image or PDF, max 5MB
            </p>
          </div>
        </div>
      )}
      
      <input
        ref={fileRef}
        type="file"
        accept={accept}
        onChange={onUpload}
        className="hidden"
      />
      
      {error && <p className={`text-xs mt-1 ${isDark ? 'text-red-400' : 'text-red-600'}`}>{error}</p>}
    </div>
  );
};

export default FileUploadField;
