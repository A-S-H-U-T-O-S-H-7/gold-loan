import React from 'react';
import { User, Calendar, Phone, Mail, CreditCard, FileText } from 'lucide-react';
import FormField from './FormField';

const relationOptions = [
  { value: 'Spouse', label: 'Spouse' },
  { value: 'Father', label: 'Father' },
  { value: 'Mother', label: 'Mother' },
  { value: 'Brother', label: 'Brother' },
  { value: 'Sister', label: 'Sister' },
  { value: 'Son', label: 'Son' },
  { value: 'Daughter', label: 'Daughter' },
  { value: 'Grandfather', label: 'Grandfather' },
  { value: 'Grandmother', label: 'Grandmother' },
  { value: 'Uncle', label: 'Uncle' },
  { value: 'Aunt', label: 'Aunt' },
  { value: 'Other', label: 'Other' }
];

const NomineeDetails = ({ formData, handleInputChange, errors, isDark }) => {
  return (
    <div className={`rounded-xl shadow-lg border-2 overflow-hidden ${
      isDark
        ? 'bg-gray-800 border-crm-border shadow-crm-soft'
        : 'bg-white border-crm-border shadow-crm-soft'
    }`}>
      <div className="p-5">
        <div className="flex items-center space-x-2 mb-4">
          <User className={`w-5 h-5 ${isDark ? 'text-crm-primary-strong' : 'text-crm-primary'}`} />
          <h3 className={`text-lg font-semibold ${isDark ? 'text-crm-primary-strong' : 'text-crm-primary'}`}>
            Nominee Details
          </h3>
        </div>
      
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            name="nominee.name"
            label="Full Name"
            placeholder="Nominee name"
            value={formData.nominee?.name || ''}
            onChange={handleInputChange}
            icon={User}
            error={errors?.['nominee.name']}
            isDark={isDark}
          />
          
          <FormField
            name="nominee.relation"
            label="Relation"
            as="select"
            placeholder="Select relation"
            value={formData.nominee?.relation || ''}
            onChange={handleInputChange}
            options={relationOptions}
            error={errors?.['nominee.relation']}
            isDark={isDark}
          />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            name="nominee.dob"
            label="Date of Birth"
            type="date"
            value={formData.nominee?.dob || ''}
            onChange={handleInputChange}
            icon={Calendar}
            error={errors?.['nominee.dob']}
            isDark={isDark}
          />
          
          <FormField
            name="nominee.gender"
            label="Gender"
            as="select"
            placeholder="Select"
            value={formData.nominee?.gender || ''}
            onChange={handleInputChange}
            options={[
              { value: "Male", label: "Male" },
              { value: "Female", label: "Female" },
              { value: "Other", label: "Other" }
            ]}
            isDark={isDark}
          />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            name="nominee.mobile"
            label="Mobile"
            type="tel"
            placeholder="10-digit"
            value={formData.nominee?.mobile || ''}
            onChange={handleInputChange}
            maxLength="10"
            icon={Phone}
            error={errors?.['nominee.mobile']}
            isDark={isDark}
          />
          
          <FormField
            name="nominee.email"
            label="Email"
            type="email"
            placeholder="Optional"
            value={formData.nominee?.email || ''}
            onChange={handleInputChange}
            icon={Mail}
            isDark={isDark}
          />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            name="nominee.aadharNumber"
            label="Aadhaar"
            placeholder="12-digit"
            value={formData.nominee?.aadharNumber || ''}
            onChange={handleInputChange}
            maxLength="12"
            icon={CreditCard}
            error={errors?.['nominee.aadharNumber']}
            isDark={isDark}
          />
          
          <FormField
            name="nominee.panNumber"
            label="PAN"
            placeholder="10-digit"
            value={formData.nominee?.panNumber || ''}
            onChange={(e) => {
              const value = e.target.value.toUpperCase();
              handleInputChange({
                target: { name: 'nominee.panNumber', value }
              });
            }}
            maxLength="10"
            icon={FileText}
            isDark={isDark}
          />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NomineeDetails;
