'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Save, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';
import { useFormik } from 'formik';
import { useThemeStore } from '@/lib/store/useThemeStore';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import api from '@/utils/axiosInsatnce';

import PersonalDetails from './PersonalDetails';
import KYCDetails from './KYCDetails';
import AddressSection from './AddressSection';
import NomineeDetails from './NomineeDetails';
import BankDetails from './BankDetails';
import { validateAadhar, validatePAN } from '@/utils/kycValidation';
import { createKYCValidationSchema } from '@/utils/kycSchema';

const initialFormValues = {
  fullName: '',
  dob: '',
  gender: '',
  mobile: '',
  alternatePhone: '',
  email: '',
  currentAddress: {
    houseNo: '',
    addressLine1: '',
    addressLine2: '',
    state: '',
    city: '',
    pincode: ''
  },
  permanentAddress: {
    houseNo: '',
    addressLine1: '',
    addressLine2: '',
    state: '',
    city: '',
    pincode: ''
  },
  aadharNumber: '',
  panNumber: '',
  aadharDocument: null,
  panDocument: null,
  aadharDocumentPreview: '',
  panDocumentPreview: '',
  livePhoto: null,
  livePhotoPreview: '',
  nominee: {
    name: '',
    relation: '',
    dob: '',
    gender: '',
    mobile: '',
    email: '',
    aadharNumber: '',
    panNumber: ''
  },
  accountNumber: '',
  ifsc: '',
  bankName: '',
  bankBranch: '',
  accountHolderName: '',
  kycStatus: 'pending',
  remarks: ''
};

const flattenObject = (source, prefix = '') => {
  if (!source || typeof source !== 'object') {
    return {};
  }

  return Object.entries(source).reduce((acc, [key, value]) => {
    const nextKey = prefix ? `${prefix}.${key}` : key;

    if (value && typeof value === 'object' && !Array.isArray(value)) {
      return { ...acc, ...flattenObject(value, nextKey) };
    }

    acc[nextKey] = value;
    return acc;
  }, {});
};

const getVisibleErrors = (errors, touched) => {
  const flatErrors = flattenObject(errors);
  const flatTouched = flattenObject(touched);

  return Object.entries(flatErrors).reduce((acc, [key, value]) => {
    if (flatTouched[key]) {
      acc[key] = value;
    }
    return acc;
  }, {});
};

const buildTouchedState = (source) => {
  if (!source || typeof source !== 'object' || Array.isArray(source) || source instanceof File) {
    return true;
  }

  return Object.entries(source).reduce((acc, [key, value]) => {
    acc[key] = buildTouchedState(value);
    return acc;
  }, {});
};

const UserKYC = ({ mode = 'edit', userId: userIdProp = null }) => {
  const router = useRouter();
  const params = useParams();
  const { theme } = useThemeStore();
  const isDark = theme === "dark";
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);
  const [sameAsCurrent, setSameAsCurrent] = useState(false);
  const [aadharVerified, setAadharVerified] = useState(false);
  const [panVerified, setPANVerified] = useState(false);
  const [ifscLoading, setIfscLoading] = useState(false);
  const [ifscError, setIfscError] = useState('');
  
  // Cities state
  const [currentCities, setCurrentCities] = useState([]);
  const [permanentCities, setPermanentCities] = useState([]);
  
  // Refs
  const aadharFileRef = useRef(null);
  const panFileRef = useRef(null);
  const livePhotoRef = useRef(null);

  const formik = useFormik({
    initialValues: initialFormValues,
    enableReinitialize: true,
    validationSchema: createKYCValidationSchema({ isNewUser, sameAsCurrent }),
    onSubmit: async () => {
      try {
        setSaving(true);
        await Swal.fire({
          title: 'Success!',
          text: isNewUser ? 'User created successfully' : 'KYC details updated',
          icon: 'success',
          confirmButtonColor: '#d97706',
        });
        router.push('/crm/all-enquiries');
      } catch (error) {
        toast.error('Failed to save');
      } finally {
        setSaving(false);
      }
    }
  });

  const formData = formik.values;
  const errors = getVisibleErrors(formik.errors, formik.touched);

  useEffect(() => {
    const id = userIdProp ?? params?.id;
    const isCreateMode = mode === 'new' || id === 'new' || !id;

    if (isCreateMode) {
      setIsNewUser(true);
    } else {
      setIsNewUser(false);
      fetchUserKYCData(id);
    }
  }, [mode, params, userIdProp]);

  const fetchUserKYCData = async (id) => {
    try {
      setLoading(true);
      // API call here
      formik.setValues(initialFormValues);
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  const setFieldValue = (path, value) => {
    formik.setFieldValue(path, value);
    formik.setFieldTouched(path, true, false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let nextValue = value;

    if (['mobile', 'alternatePhone', 'nominee.mobile'].includes(name)) {
      nextValue = value.replace(/\D/g, '').slice(0, 10);
    }

    if (['aadharNumber', 'nominee.aadharNumber'].includes(name)) {
      nextValue = value.replace(/\D/g, '').slice(0, 12);
    }

    if (name === 'accountNumber') {
      nextValue = value.replace(/\D/g, '').slice(0, 18);
    }

    if (name === 'panNumber') {
      nextValue = value.toUpperCase();
      setPANVerified(false);
    }

    if (name === 'aadharNumber') {
      setAadharVerified(false);
    }

    if (name === 'nominee.panNumber') {
      nextValue = value.toUpperCase();
    }

    formik.setFieldValue(name, nextValue);
    formik.setFieldTouched(name, true, false);
  };

  const handleIFSCChange = async (e) => {
    const upperIFSC = e.target.value.toUpperCase().slice(0, 11);
    setFieldValue('ifsc', upperIFSC);
    setIfscError('');

    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(upperIFSC)) {
      setFieldValue('bankName', '');
      setFieldValue('bankBranch', '');
      return;
    }

    try {
      setIfscLoading(true);
      const response = await fetch(`https://ifsc.razorpay.com/${upperIFSC}`, {
        method: 'GET',
      });

      if (!response.ok) {
        setFieldValue('bankName', '');
        setFieldValue('bankBranch', '');
        setIfscError('Invalid IFSC code. Please check and try again.');
        return;
      }

      const data = await response.json();
      setFieldValue('bankName', data.BANK || '');
      setFieldValue('bankBranch', data.BRANCH || '');
      setIfscError('');
    } catch (error) {
      setFieldValue('bankName', '');
      setFieldValue('bankBranch', '');
      setIfscError('Unable to verify IFSC. Please enter bank details manually.');
    } finally {
      setIfscLoading(false);
    }
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
      formik.setFieldValue(type, file);
      formik.setFieldValue(`${type}Preview`, reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleClearFile = (type) => {
    formik.setFieldValue(type, null);
    formik.setFieldValue(`${type}Preview`, '');
  };

  const handleSameAddressChange = (e) => {
    const checked = e.target.checked;
    setSameAsCurrent(checked);
    
    if (checked) {
      formik.setFieldValue('permanentAddress', { ...formik.values.currentAddress });
    }
  };

  const isCurrentAddressComplete = () => {
    const addr = formData.currentAddress;
    return addr.houseNo && addr.addressLine1 && addr.state && addr.city && addr.pincode;
  };

  const handleVerifyAadhar = async (number) => {
    const applicationId = userIdProp ?? params?.id;
    const parsedApplicationId = parseInt(applicationId, 10);

    if (!applicationId || applicationId === 'new' || Number.isNaN(parsedApplicationId)) {
      toast.error('Save or open an existing KYC record before Aadhaar verification');
      return;
    }

    if (!validateAadhar(number)) {
      toast.error('Invalid Aadhaar number');
      return;
    }

    try {
      const response = await api.post('/crm/appraisal/aadhar/verification', {
        application_id: parsedApplicationId,
        crnno: formik.values.crnNo || '',
        aadhar_no: number.replace(/\D/g, '')
      });

      if (response?.success === false) {
        let details = response.details;
        if (typeof response.details === 'string') {
          try {
            details = JSON.parse(response.details);
          } catch {
            details = null;
          }
        }
        const message = details?.remarks || details?.message || response.message || 'Aadhaar number is not valid';
        setAadharVerified(false);
        toast.error(message);
        return;
      }

      setAadharVerified(true);
      toast.success(response?.message || 'Aadhaar verified successfully');
    } catch (error) {
      const responseData = error.response?.data;
      let message = responseData?.message || 'Aadhaar number is not valid';

      if (responseData?.details) {
        try {
          const details = typeof responseData.details === 'string'
            ? JSON.parse(responseData.details)
            : responseData.details;
          message = details?.remarks || details?.message || message;
        } catch {
          // Keep fallback message
        }
      }

      setAadharVerified(false);
      toast.error(message);
    }
  };

  const handleVerifyPAN = async (number) => {
    const applicationId = userIdProp ?? params?.id;
    const parsedApplicationId = parseInt(applicationId, 10);

    if (!applicationId || applicationId === 'new' || Number.isNaN(parsedApplicationId)) {
      toast.error('Save or open an existing KYC record before PAN verification');
      return;
    }

    if (!validatePAN(number)) {
      toast.error('Invalid PAN number');
      return;
    }

    try {
      const response = await api.post('/crm/appraisal/pan/verification', {
        application_id: parsedApplicationId,
        crnno: formik.values.crnNo || '',
        pan_no: number.toUpperCase().trim()
      });

      if (response?.success === false) {
        let message = response.message || 'PAN number is not valid';

        if (response?.details) {
          try {
            const details = typeof response.details === 'string'
              ? JSON.parse(response.details)
              : response.details;
            message = details?.message || message;
          } catch {
            // Keep fallback message
          }
        }

        setPANVerified(false);
        toast.error(message);
        return;
      }

      setPANVerified(true);
      toast.success(response?.message || 'PAN verified successfully');
    } catch (error) {
      const responseData = error.response?.data;
      let message = responseData?.message || 'PAN number is not valid';

      if (responseData?.details) {
        try {
          const details = typeof responseData.details === 'string'
            ? JSON.parse(responseData.details)
            : responseData.details;
          message = details?.message || message;
        } catch {
          // Keep fallback message
        }
      }

      setPANVerified(false);
      toast.error(message);
    }
  };

  const handleSubmit = async () => {
    const validationErrors = await formik.validateForm();
    formik.setTouched(buildTouchedState(formik.values), true);

    if (Object.keys(flattenObject(validationErrors)).length > 0) {
      toast.error('Please fill all required fields correctly');
      return;
    }

    await formik.submitForm();
  };

  const handleVerification = async (status) => {
    const result = await Swal.fire({
      title: `Confirm ${status}`,
      text: `Are you sure you want to ${status} this KYC?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: status === 'verify' ? '#d97706' : '#ef4444',
    });

    if (!result.isConfirmed) return;

    try {
      setSaving(true);
      // API call here
      formik.setFieldValue('kycStatus', status);
      toast.success(`KYC ${status}ed successfully`);
    } catch (error) {
      toast.error('Failed to update status');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-gray-900' : 'bg-crm-accent-soft/60'}`}>
      <div className="p-4 md:p-6">
      <div className="max-w-8xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <Link
              href="/crm/all-enquiries"
              className={`p-2.5 rounded-xl transition-all duration-200 hover:scale-105 ${
                isDark
                  ? 'hover:bg-gray-800 bg-gray-800/50 border border-crm-border'
                  : 'hover:bg-crm-accent-soft bg-crm-accent-soft border border-crm-border'
              }`}
            >
              <ArrowLeft className={`w-4 h-4 ${isDark ? 'text-crm-primary-strong' : 'text-crm-primary-strong'}`} />
            </Link>
            <div>
              <h1 className={`text-xl md:text-2xl font-bold bg-gradient-to-r ${
                isDark ? 'from-crm-gradient-from to-crm-gradient-to' : 'from-crm-gradient-from to-crm-gradient-to'
              } bg-clip-text text-transparent`}>
                {isNewUser ? 'Create New User' : 'KYC & Customer Profile'}
              </h1>
              
            </div>
            {!isNewUser && (
              <span className={`px-2 py-1 text-xs rounded-full ${
                formData.kycStatus === 'verified' 
                  ? 'bg-green-100 text-green-700'
                  : formData.kycStatus === 'rejected'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-yellow-100 text-yellow-700'
              }`}>
                {formData.kycStatus}
              </span>
            )}
          </div>
          </div>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Column 1 */}
          <div className="space-y-4">
            <PersonalDetails 
              formData={formData}
              handleInputChange={handleInputChange}
              errors={errors}
              isDark={isDark}
            />

            <AddressSection
              title="Current Address"
              addressPrefix="currentAddress"
              values={formData}
              setFieldValue={setFieldValue}
              cities={currentCities}
              setCities={setCurrentCities}
              errors={errors}
              isDark={isDark}
            />
            
            
            
            <BankDetails 
              formData={formData}
              handleInputChange={handleInputChange}
              handleIFSCChange={handleIFSCChange}
              ifscLoading={ifscLoading}
              ifscError={ifscError}
              errors={errors}
              isDark={isDark}
            />
          </div>

          {/* Column 2 */}
          <div className="space-y-4">
            
            <KYCDetails 
              formData={formData}
              handleInputChange={handleInputChange}
              handleFileUpload={handleFileUpload}
              handleClearFile={handleClearFile}
              errors={errors}
              isDark={isDark}
              isNewUser={isNewUser}
              aadharFileRef={aadharFileRef}
              panFileRef={panFileRef}
              livePhotoRef={livePhotoRef}
              onVerifyAadhar={handleVerifyAadhar}
              onVerifyPAN={handleVerifyPAN}
              aadharVerified={aadharVerified}
              panVerified={panVerified}
            />
            
            <AddressSection
              title="Permanent Address"
              addressPrefix="permanentAddress"
              showSameAddressOption={true}
              sameAddress={sameAsCurrent}
              onSameAddressChange={handleSameAddressChange}
              isCurrentAddressComplete={isCurrentAddressComplete()}
              values={formData}
              setFieldValue={setFieldValue}
              cities={permanentCities}
              setCities={setPermanentCities}
              errors={errors}
              isDark={isDark}
            />
            
            <NomineeDetails 
              formData={formData}
              handleInputChange={handleInputChange}
              errors={errors}
              isDark={isDark}
            />
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <div className={`flex flex-wrap justify-end gap-3 rounded-2xl border px-4 py-3 ${
            isDark
              ? 'border-crm-border bg-gray-900'
              : 'border-crm-border bg-white'
          }`}>
            {!isNewUser && formData.kycStatus === 'pending' && (
              <>
                <button
                  onClick={() => handleVerification('reject')}
                  className="px-5 py-2.5 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all duration-200 flex items-center gap-2 shadow-lg"
                >
                  <XCircle className="w-4 h-4" />
                  Reject
                </button>
                <button
                  onClick={() => handleVerification('verify')}
                  className="px-5 py-2.5 bg-crm-primary text-white rounded-xl hover:bg-crm-primary-strong transition-all duration-200 flex items-center gap-2 shadow-lg"
                >
                  <CheckCircle className="w-4 h-4" />
                  Verify
                </button>
              </>
            )}
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="px-5 py-2.5 bg-crm-primary text-white rounded-xl hover:bg-crm-primary-strong transition-all duration-200 flex items-center gap-2 shadow-lg disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default UserKYC;
