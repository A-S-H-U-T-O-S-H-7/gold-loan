'use client';
import React, { useState } from 'react';
import { 
  Save, 
  X, 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  User,
  Hash,
  ChevronDown,
  ChevronUp,
  Briefcase,
  Map,
  Globe,
  Home,
  Smartphone
} from 'lucide-react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-hot-toast';

// Validation Schema
const branchSchema = Yup.object().shape({
  branch_code: Yup.string()
    .required('Branch code is required')
    .max(10, 'Branch code cannot exceed 10 characters')
    .trim()
    .uppercase(),
  branch_name: Yup.string()
    .required('Branch name is required')
    .max(100, 'Branch name cannot exceed 100 characters')
    .trim(),
  company_name: Yup.string()
    .required('Company name is required')
    .max(100, 'Company name cannot exceed 100 characters')
    .trim(),
  manager_name: Yup.string()
    .required('Manager name is required')
    .max(100, 'Manager name cannot exceed 100 characters')
    .trim(),
  email: Yup.string()
    .required('Email is required')
    .email('Please enter a valid email address')
    .max(100, 'Email cannot exceed 100 characters')
    .trim(),
  phone: Yup.string()
    .required('Phone number is required')
    .matches(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit mobile number')
    .max(10, 'Phone number cannot exceed 10 digits')
    .trim(),
  alternate_phone: Yup.string()
    .nullable()
    .matches(/^$|^[6-9]\d{9}$/, 'Please enter a valid 10-digit mobile number')
    .max(10, 'Alternate phone cannot exceed 10 digits')
    .trim(),
  address: Yup.string()
    .required('Address is required')
    .max(200, 'Address cannot exceed 200 characters')
    .trim(),
  city: Yup.string()
    .required('City is required')
    .max(50, 'City cannot exceed 50 characters')
    .trim(),
  state: Yup.string()
    .required('State is required')
    .max(50, 'State cannot exceed 50 characters')
    .trim(),
  pincode: Yup.string()
    .required('Pincode is required')
    .matches(/^[1-9][0-9]{5}$/, 'Please enter a valid 6-digit pincode')
    .max(6, 'Pincode must be 6 digits')
    .trim(),
  status: Yup.number()
    .required('Status is required')
    .oneOf([0, 1], 'Invalid status')
});

// Reusable Input Styles
const getInputStyles = (isDark, hasError = false) => {
  const baseStyles = "w-full px-4 py-3 text-sm rounded-lg border transition-all duration-200 font-medium focus:ring-2 focus:ring-crm-ring focus:outline-none";
  
  if (hasError) {
    return `${baseStyles} ${
      isDark
        ? 'bg-gray-800 border-red-500 text-white placeholder-gray-400'
        : 'bg-white border-red-500 text-gray-900 placeholder-gray-500'
    }`;
  }
  
  return `${baseStyles} ${
    isDark
      ? 'bg-gray-800 border-crm-border text-white placeholder-gray-400 hover:border-crm-primary focus:border-crm-primary-strong'
      : 'bg-white border-crm-border text-gray-900 placeholder-gray-500 hover:border-crm-primary focus:border-crm-primary'
  }`;
};

// Reusable Label Component
const FormLabel = ({ icon: Icon, label, isDark, optional = false }) => (
  <label className={`flex items-center space-x-2 text-sm font-bold mb-2 ${
    isDark ? 'text-gray-100' : 'text-gray-700'
  }`}>
    <div className={`p-1.5 rounded-md bg-crm-primary-soft`}>
      <Icon className="w-4 h-4 text-crm-primary-strong" />
    </div>
    <span>{label}</span>
    {optional && <span className="text-xs font-normal text-gray-500">(Optional)</span>}
  </label>
);

// Phone input handler
const PhoneInput = ({ field, form, ...props }) => {
  const handleChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
    form.setFieldValue(field.name, value);
  };

  return (
    <input
      {...field}
      {...props}
      type="text"
      onChange={handleChange}
      maxLength={10}
    />
  );
};

// Pincode input handler
const PincodeInput = ({ field, form, ...props }) => {
  const handleChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    form.setFieldValue(field.name, value);
  };

  return (
    <input
      {...field}
      {...props}
      type="text"
      onChange={handleChange}
      maxLength={6}
    />
  );
};

// Branch Code input - uppercase only
const BranchCodeInput = ({ field, form, ...props }) => {
  const handleChange = (e) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    form.setFieldValue(field.name, value);
  };

  return (
    <input
      {...field}
      {...props}
      type="text"
      onChange={handleChange}
    />
  );
};

const BranchForm = ({ 
  isDark, 
  onSubmit, 
  initialData = null, 
  isEditMode = false,
  isExpanded = true,
  onToggleExpand 
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  const initialValues = initialData || {
    branch_code: '',
    branch_name: '',
    company_name: 'ATD FINANCIAL SERVICES P. LTD', 
    manager_name: '',
    email: '',
    phone: '',
    alternate_phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    status: 1
  };

  const handleSubmit = async (values, { resetForm }) => {
    setIsSubmitting(true);
    setServerError('');
    
    try {
      await onSubmit(values);
      if (!isEditMode) {
        resetForm();
      }
      toast.success(isEditMode ? 'Branch updated successfully!' : 'Branch added successfully!');
    } catch (error) {
      let errorMessage = 'Failed to save branch';
      
      if (error.response) {
        const errorData = error.response.data || {};
        
        if (error.response.status === 422 && errorData.errors) {
          const errors = errorData.errors;
          const firstError = Object.values(errors)[0];
          errorMessage = Array.isArray(firstError) ? firstError[0] : firstError;
        } 
        else if (errorData.message) {
          errorMessage = errorData.message;
        }
        else if (typeof errorData === 'string') {
          errorMessage = errorData;
        }
        else if (error.response.statusText) {
          errorMessage = error.response.statusText;
        }
      } 
      else if (error.data) {
        const errorData = error.data;
        
        if (errorData.errors) {
          const errors = errorData.errors;
          const firstError = Object.values(errors)[0];
          errorMessage = Array.isArray(firstError) ? firstError[0] : firstError;
        } 
        else if (errorData.message) {
          errorMessage = errorData.message;
        }
      }
      else if (error.message) {
        errorMessage = error.message;
      }
      
      setServerError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`rounded-xl shadow-lg border-2 overflow-hidden transition-all duration-300 ${
      isDark
        ? 'bg-gray-800 border-crm-border shadow-crm-soft'
        : 'bg-white border-crm-border shadow-crm-soft'
    }`}>
      {/* Form Header - Toggle Button */}
      <button
        type="button"
        onClick={onToggleExpand}
        className={`w-full px-6 py-4 flex items-center justify-between border-b transition-colors ${
          isDark
            ? 'bg-gradient-to-r from-gray-900 to-gray-800 border-crm-border hover:bg-gray-700/50'
            : 'bg-gradient-to-r from-crm-accent-soft to-crm-primary-soft border-crm-border hover:bg-crm-primary-soft'
        }`}
      >
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-crm-primary-soft">
            <Building2 className="w-5 h-5 text-crm-primary-strong" />
          </div>
          <div className="text-left">
            <h2 className={`font-bold text-lg ${isDark ? 'text-gray-100' : 'text-gray-700'}`}>
              {isEditMode ? 'Edit Branch' : 'Add New Branch'}
            </h2>
            <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              {isEditMode ? 'Update branch details' : 'Fill in the branch details'}
            </p>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className={`w-5 h-5 ${isDark ? 'text-gray-300' : 'text-gray-600'}`} />
        ) : (
          <ChevronDown className={`w-5 h-5 ${isDark ? 'text-gray-300' : 'text-gray-600'}`} />
        )}
      </button>

      {/* Form Body */}
      {isExpanded && (
        <div className="p-6">
          {/* Server Error Display */}
          {serverError && (
            <div className={`mb-6 p-4 rounded-lg border ${
              isDark 
                ? 'bg-red-900/20 border-red-600/50 text-red-200' 
                : 'bg-red-50 border-red-300 text-red-700'
            }`}>
              <p className="font-medium">{serverError}</p>
            </div>
          )}

          <Formik
            initialValues={initialValues}
            validationSchema={branchSchema}
            onSubmit={handleSubmit}
            enableReinitialize={isEditMode}
          >
            {({ isSubmitting: formikSubmitting, errors, touched }) => (
              <Form className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  {/* Branch Code Field */}
                  <div>
                    <FormLabel icon={Hash} label="Branch Code *" isDark={isDark} />
                    <Field
                      name="branch_code"
                      component={BranchCodeInput}
                      placeholder="e.g., DEL, MUM, BLR"
                      className={getInputStyles(isDark, errors.branch_code && touched.branch_code)}
                    />
                    <ErrorMessage name="branch_code">
                      {msg => <p className="mt-1 text-xs text-red-500">{msg}</p>}
                    </ErrorMessage>
                  </div>

                  {/* Branch Name Field */}
                  <div>
                    <FormLabel icon={Building2} label="Branch Name *" isDark={isDark} />
                    <Field
                      type="text"
                      name="branch_name"
                      placeholder="e.g., Connaught Place, Andheri East"
                      className={getInputStyles(isDark, errors.branch_name && touched.branch_name)}
                    />
                    <ErrorMessage name="branch_name">
                      {msg => <p className="mt-1 text-xs text-red-500">{msg}</p>}
                    </ErrorMessage>
                  </div>

                  {/* Company Name Field */}
                  <div>
                    <FormLabel icon={Briefcase} label="Company Name *" isDark={isDark} />
                    <Field
                      type="text"
                      name="company_name"
                      placeholder="e.g., ATD FINANCIAL SERVICES P. LTD"
                      className={getInputStyles(isDark, errors.company_name && touched.company_name)}
                    />
                    <ErrorMessage name="company_name">
                      {msg => <p className="mt-1 text-xs text-red-500">{msg}</p>}
                    </ErrorMessage>
                  </div>

                  {/* Manager Name Field */}
                  <div>
                    <FormLabel icon={User} label="Manager Name *" isDark={isDark} />
                    <Field
                      type="text"
                      name="manager_name"
                      placeholder="e.g., Rajesh Kumar"
                      className={getInputStyles(isDark, errors.manager_name && touched.manager_name)}
                    />
                    <ErrorMessage name="manager_name">
                      {msg => <p className="mt-1 text-xs text-red-500">{msg}</p>}
                    </ErrorMessage>
                  </div>

                  {/* Email Field */}
                  <div>
                    <FormLabel icon={Mail} label="Email *" isDark={isDark} />
                    <Field
                      type="email"
                      name="email"
                      placeholder="branch@company.com"
                      className={getInputStyles(isDark, errors.email && touched.email)}
                    />
                    <ErrorMessage name="email">
                      {msg => <p className="mt-1 text-xs text-red-500">{msg}</p>}
                    </ErrorMessage>
                  </div>

                  {/* Phone Field */}
                  <div>
                    <FormLabel icon={Phone} label="Phone Number *" isDark={isDark} />
                    <Field
                      name="phone"
                      component={PhoneInput}
                      placeholder="10-digit mobile number"
                      className={getInputStyles(isDark, errors.phone && touched.phone)}
                    />
                    <ErrorMessage name="phone">
                      {msg => <p className="mt-1 text-xs text-red-500">{msg}</p>}
                    </ErrorMessage>
                  </div>

                  {/* Alternate Phone Field */}
                  <div>
                    <FormLabel icon={Smartphone} label="Alternate Phone" isDark={isDark} optional />
                    <Field
                      name="alternate_phone"
                      component={PhoneInput}
                      placeholder="Alternate contact number"
                      className={getInputStyles(isDark, errors.alternate_phone && touched.alternate_phone)}
                    />
                    <ErrorMessage name="alternate_phone">
                      {msg => <p className="mt-1 text-xs text-red-500">{msg}</p>}
                    </ErrorMessage>
                  </div>

                  {/* Address Field */}
                  <div>
                    <FormLabel icon={Home} label="Address *" isDark={isDark} />
                    <Field
                      as="textarea"
                      name="address"
                      rows="1"
                      placeholder="Street address, landmark, etc."
                      className={getInputStyles(isDark, errors.address && touched.address)}
                    />
                    <ErrorMessage name="address">
                      {msg => <p className="mt-1 text-xs text-red-500">{msg}</p>}
                    </ErrorMessage>
                  </div>

                  {/* City Field */}
                  <div>
                    <FormLabel icon={MapPin} label="City *" isDark={isDark} />
                    <Field
                      type="text"
                      name="city"
                      placeholder="e.g., Mumbai, Delhi"
                      className={getInputStyles(isDark, errors.city && touched.city)}
                    />
                    <ErrorMessage name="city">
                      {msg => <p className="mt-1 text-xs text-red-500">{msg}</p>}
                    </ErrorMessage>
                  </div>

                  {/* State Field */}
                  <div>
                    <FormLabel icon={Map} label="State *" isDark={isDark} />
                    <Field
                      type="text"
                      name="state"
                      placeholder="e.g., Maharashtra, Delhi"
                      className={getInputStyles(isDark, errors.state && touched.state)}
                    />
                    <ErrorMessage name="state">
                      {msg => <p className="mt-1 text-xs text-red-500">{msg}</p>}
                    </ErrorMessage>
                  </div>

                  {/* Pincode Field */}
                  <div>
                    <FormLabel icon={Globe} label="Pincode *" isDark={isDark} />
                    <Field
                      name="pincode"
                      component={PincodeInput}
                      placeholder="6-digit pincode"
                      className={getInputStyles(isDark, errors.pincode && touched.pincode)}
                    />
                    <ErrorMessage name="pincode">
                      {msg => <p className="mt-1 text-xs text-red-500">{msg}</p>}
                    </ErrorMessage>
                  </div>

                  {/* Status Field */}
                  <div>
                    <FormLabel icon={Briefcase} label="Status *" isDark={isDark} />
                    <Field
                      as="select"
                      name="status"
                      className={getInputStyles(isDark, errors.status && touched.status)}
                    >
                      <option value={1}>Active</option>
                      <option value={0}>Inactive</option>
                    </Field>
                    <ErrorMessage name="status">
                      {msg => <p className="mt-1 text-xs text-red-500">{msg}</p>}
                    </ErrorMessage>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-700/50">
                  <button
                    type="button"
                    onClick={onToggleExpand}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isDark
                        ? 'bg-gray-700 hover:bg-gray-600 text-gray-300 border border-gray-600'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200'
                    }`}
                  >
                    <X className="w-4 h-4 inline mr-2" />
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || formikSubmitting}
                    className={`px-6 py-2 rounded-lg text-white text-sm font-bold transition-all duration-200 transform hover:scale-105 focus:ring-2 focus:outline-none flex items-center space-x-2 ${
                      isSubmitting || formikSubmitting
                        ? 'bg-gray-400 cursor-not-allowed'
                        : isDark
                        ? 'bg-gradient-to-r from-crm-gradient-from to-crm-gradient-to hover:brightness-110 focus:ring-crm-ring shadow-lg shadow-crm-soft'
                        : 'bg-gradient-to-r from-crm-gradient-from to-crm-gradient-to hover:brightness-110 focus:ring-crm-ring shadow-lg shadow-crm-soft'
                    }`}
                  >
                    {isSubmitting || formikSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>{isEditMode ? 'Update Branch' : 'Add Branch'}</span>
                      </>
                    )}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      )}
    </div>
  );
};

export default BranchForm;


