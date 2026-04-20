import React from 'react';
import { User, Phone, Mail, MapPin, Calendar, FileText } from 'lucide-react';

const GoldEvaluationForm = ({ customerDetails, isDark }) => {
  if (!customerDetails) return null;

  const infoCardClassName = `p-4 rounded-xl border ${
    isDark ? 'bg-gray-800/50 border-crm-border' : 'bg-white/50 border-crm-border'
  }`;

  const labelClassName = `text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`;
  const valueClassName = `text-sm font-semibold mt-1 ${isDark ? 'text-gray-200' : 'text-gray-800'}`;

  return (
    <div className={`rounded-xl shadow-lg border-2 overflow-hidden ${
      isDark ? "bg-gray-800 border-crm-border shadow-crm-soft" : "bg-white border-crm-border shadow-crm-soft"
    }`}>
      <div className="p-5">
        <div className="flex items-center space-x-2 mb-4">
          <FileText className={`w-5 h-5 ${isDark ? "text-crm-primary-strong" : "text-crm-primary"}`} />
          <h3 className={`text-lg font-semibold ${isDark ? "text-crm-primary-strong" : "text-crm-primary"}`}>
            Customer Information
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className={infoCardClassName}>
            <div className="flex items-center gap-2">
              <User className={`w-4 h-4 ${isDark ? 'text-crm-primary-strong' : 'text-crm-primary'}`} />
              <p className={labelClassName}>Full Name</p>
            </div>
            <p className={valueClassName}>{customerDetails.fullname || 'N/A'}</p>
          </div>

          <div className={infoCardClassName}>
            <div className="flex items-center gap-2">
              <FileText className={`w-4 h-4 ${isDark ? 'text-crm-primary-strong' : 'text-crm-primary'}`} />
              <p className={labelClassName}>CRN Number</p>
            </div>
            <p className={valueClassName}>{customerDetails.crnno || 'N/A'}</p>
          </div>

          <div className={infoCardClassName}>
            <div className="flex items-center gap-2">
              <Phone className={`w-4 h-4 ${isDark ? 'text-crm-primary-strong' : 'text-crm-primary'}`} />
              <p className={labelClassName}>Mobile Number</p>
            </div>
            <p className={valueClassName}>{customerDetails.mobile || 'N/A'}</p>
          </div>

          <div className={infoCardClassName}>
            <div className="flex items-center gap-2">
              <Mail className={`w-4 h-4 ${isDark ? 'text-crm-primary-strong' : 'text-crm-primary'}`} />
              <p className={labelClassName}>Email Address</p>
            </div>
            <p className={valueClassName}>{customerDetails.email || 'N/A'}</p>
          </div>

          <div className={infoCardClassName}>
            <div className="flex items-center gap-2">
              <Calendar className={`w-4 h-4 ${isDark ? 'text-crm-primary-strong' : 'text-crm-primary'}`} />
              <p className={labelClassName}>Date of Birth</p>
            </div>
            <p className={valueClassName}>{customerDetails.dob || 'N/A'}</p>
          </div>

          <div className={infoCardClassName}>
            <div className="flex items-center gap-2">
              <MapPin className={`w-4 h-4 ${isDark ? 'text-crm-primary-strong' : 'text-crm-primary'}`} />
              <p className={labelClassName}>Address</p>
            </div>
            <p className={valueClassName}>{customerDetails.address || 'N/A'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoldEvaluationForm;