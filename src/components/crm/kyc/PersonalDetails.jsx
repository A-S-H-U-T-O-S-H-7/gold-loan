import React from 'react';
import { User, Calendar, Phone, Mail } from 'lucide-react';
import FormField from './FormField';

const PersonalDetails = ({ formData, handleInputChange, errors, isDark }) => {
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
            Personal Details
          </h3>
        </div>
      
        <div className="space-y-4">
          <FormField
            name="fullName"
            label="Full Name"
            placeholder="Enter full name"
            required
            value={formData.fullName}
            onChange={handleInputChange}
            icon={User}
            error={errors.fullName}
            isDark={isDark}
          />
        
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              name="dob"
              label="DOB"
              type="date"
              required
              value={formData.dob}
              onChange={handleInputChange}
              icon={Calendar}
              error={errors.dob}
              isDark={isDark}
            />
          
            <FormField
              name="gender"
              label="Gender"
              as="select"
              placeholder="Select"
              required
              value={formData.gender}
              onChange={handleInputChange}
              options={[
                { value: "Male", label: "Male" },
                { value: "Female", label: "Female" },
                { value: "Other", label: "Other" }
              ]}
              error={errors.gender}
              isDark={isDark}
            />
          </div>
        
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              name="mobile"
              label="Mobile"
              type="tel"
              placeholder="10-digit"
              required
              value={formData.mobile}
              onChange={handleInputChange}
              maxLength="10"
              icon={Phone}
              error={errors.mobile}
              isDark={isDark}
            />
          
            <FormField
              name="alternatePhone"
              label="Alt Phone"
              type="tel"
              placeholder="Optional"
              value={formData.alternatePhone}
              onChange={handleInputChange}
              maxLength="10"
              icon={Phone}
              error={errors.alternatePhone}
              isDark={isDark}
            />
          </div>
        
          <FormField
            name="email"
            label="Email"
            type="email"
            placeholder="email@example.com"
            value={formData.email}
            onChange={handleInputChange}
            icon={Mail}
            error={errors.email}
            isDark={isDark}
          />
        </div>
      </div>
    </div>
  );
};

export default PersonalDetails;
