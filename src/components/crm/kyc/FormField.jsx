import React from 'react';
import { AlertTriangle } from 'lucide-react';

const FormField = ({
  name,
  label,
  type = "text",
  as = "input",
  placeholder,
  required = false,
  options = [],
  value,
  onChange,
  disabled = false,
  maxLength,
  icon: Icon,
  rows = 2,
  error,
  isDark
}) => {
  const baseClasses = `w-full px-3 py-2.5 rounded-lg border-2 transition-all duration-200 text-sm outline-none ${
    disabled
      ? isDark
        ? 'bg-gray-800 border-gray-700 text-gray-500 cursor-not-allowed'
        : 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
      : isDark
        ? 'bg-gray-700 border-gray-600 text-white hover:border-crm-primary focus:border-crm-primary-strong focus:ring-2 focus:ring-crm-ring'
        : 'bg-gray-50 border-gray-300 text-gray-900 hover:border-crm-primary focus:border-crm-primary focus:ring-2 focus:ring-crm-ring'
  } ${error ? (isDark ? 'border-red-500 focus:ring-red-500/20' : 'border-red-400 bg-red-50 focus:ring-red-500/20') : ''}`;

  const inputStyles = Icon ? 'pl-10' : '';
  const labelClassName = `block text-xs font-medium mb-1 ${error ? (isDark ? 'text-red-400' : 'text-red-600') : (isDark ? 'text-gray-200' : 'text-gray-700')}`;
  const iconColor = error
    ? isDark ? 'text-red-400' : 'text-red-500'
    : isDark ? 'text-gray-400' : 'text-gray-400';

  return (
    <div className="space-y-1">
      <label className={labelClassName}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className={`w-4 h-4 ${iconColor}`} />
          </div>
        )}
        
        {as === "select" ? (
          <select
            name={name}
            value={value || ''}
            onChange={onChange}
            disabled={disabled}
            className={`${baseClasses} ${inputStyles}`}
          >
            <option value="">{placeholder}</option>
            {options.map(opt => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        ) : as === "textarea" ? (
          <textarea
            name={name}
            value={value || ''}
            onChange={onChange}
            placeholder={placeholder}
            rows={rows}
            disabled={disabled}
            maxLength={maxLength}
            className={`${baseClasses} ${inputStyles} resize-none`}
          />
        ) : (
          <input
            type={type}
            name={name}
            value={value || ''}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            maxLength={maxLength}
            className={`${baseClasses} ${inputStyles}`}
          />
        )}
      </div>
      {error && (
        <p className={`text-xs mt-1 flex items-center gap-1 ${isDark ? 'text-red-400' : 'text-red-600'}`}>
          <AlertTriangle className="w-3 h-3" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
};

export default FormField;
