import React from 'react';
import { Building, CreditCard, FileText, Loader2, User } from 'lucide-react';
import FormField from './FormField';

const BankDetails = ({ formData, handleInputChange, handleIFSCChange, ifscLoading, ifscError, errors, isDark }) => {
  return (
    <div className={`rounded-xl shadow-lg border-2 overflow-hidden ${
      isDark
        ? 'bg-gray-800 border-crm-border shadow-crm-soft'
        : 'bg-white border-crm-border shadow-crm-soft'
    }`}>
      <div className="p-5">
        <div className="flex items-center space-x-2 mb-4">
          <Building className={`w-5 h-5 ${isDark ? 'text-crm-primary-strong' : 'text-crm-primary'}`} />
          <h3 className={`text-lg font-semibold ${isDark ? 'text-crm-primary-strong' : 'text-crm-primary'}`}>
            Bank Details
          </h3>
        </div>
      
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              name="accountNumber"
              label="Account Number"
              placeholder="Enter account number"
              required
              value={formData.accountNumber}
              onChange={handleInputChange}
              maxLength="18"
              icon={CreditCard}
              error={errors.accountNumber}
              isDark={isDark}
            />

            <FormField
              name="accountType"
              label="Account Type"
              as="select"
              placeholder="Select type"
              required
              value={formData.accountType}
              onChange={handleInputChange}
              options={[
                { value: 'Saving', label: 'Saving' },
                { value: 'Current', label: 'Current' }
              ]}
              error={errors.accountType}
              isDark={isDark}
            />
          </div>
        
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="relative">
                <FormField
                  name="ifsc"
                  label="IFSC Code"
                  placeholder="e.g., SBIN0123456"
                  required
                  value={formData.ifsc}
                  onChange={handleIFSCChange}
                  maxLength="11"
                  icon={FileText}
                  error={errors.ifsc}
                  isDark={isDark}
                />
                {ifscLoading && (
                  <div className="absolute right-3 top-[38px]">
                    <Loader2 className={`w-4 h-4 animate-spin ${isDark ? 'text-crm-primary-strong' : 'text-crm-primary'}`} />
                  </div>
                )}
              </div>
              {ifscError && (
                <p className={`text-xs ${isDark ? 'text-orange-300' : 'text-orange-600'}`}>
                  {ifscError}
                </p>
              )}
            </div>

            <FormField
              name="bankName"
              label="Bank Name"
              placeholder="Bank name will auto-populate"
              required
              value={formData.bankName}
              onChange={handleInputChange}
              disabled={Boolean(formData.ifsc && formData.bankName && !ifscError)}
              icon={Building}
              isDark={isDark}
            />
          </div>

          <FormField
            name="bankBranch"
            label="Bank Branch"
            placeholder="Branch will auto-populate"
            required
            value={formData.bankBranch}
            onChange={handleInputChange}
            disabled={Boolean(formData.ifsc && formData.bankBranch && !ifscError)}
            icon={Building}
            isDark={isDark}
          />
        
          <FormField
            name="accountHolderName"
            label="Account Holder Name"
            placeholder="As per bank records"
            required
            value={formData.accountHolderName}
            onChange={handleInputChange}
            icon={User}
            isDark={isDark}
          />
        </div>
      </div>
    </div>
  );
};

export default BankDetails;
