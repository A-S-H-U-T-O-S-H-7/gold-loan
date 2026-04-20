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
import { userKycService, mapUserKycToFormValues } from '@/lib/services/UserKYCServices';
import { createKYCValidationSchema } from '@/utils/kycSchema';

import PersonalDetails from './PersonalDetails';
import KYCDetails from './KYCDetails';
import AddressSection from './AddressSection';
import NomineeDetails from './NomineeDetails';
import BankDetails from './BankDetails';

const initialFormValues = {
  crnNo: '',
  applicationId: '',
  userId: '',
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
  aadharBackDocument: null,
  panDocument: null,
  livePhoto: null,
  aadharDocumentPreview: '',
  aadharBackDocumentPreview: '',
  panDocumentPreview: '',
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
  accountType: 'Saving',
  accountHolderName: '',
  kycStatus: 'pending',
  remarks: ''
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
  const [submitError, setSubmitError] = useState('');
  
  // Refs for file inputs
  const aadharFileRef = useRef(null);
  const aadharBackFileRef = useRef(null);
  const panFileRef = useRef(null);
  const livePhotoRef = useRef(null);

  const formik = useFormik({
    initialValues: initialFormValues,
    enableReinitialize: true,
    validationSchema: createKYCValidationSchema({ isNewUser, sameAsCurrent }),
    validateOnBlur: true,
    validateOnChange: false,
    onSubmit: async (values) => {
      try {
        setSaving(true);
        setSubmitError('');
        const id = userIdProp ?? params?.id;
        const payload = { ...values, sameAsCurrent };
        const response = isNewUser
          ? await userKycService.createUserKyc(payload)
          : await userKycService.updateUserKyc(id, payload);

        await Swal.fire({
          title: 'Success!',
          text: response?.message || (isNewUser ? 'User created successfully' : 'KYC details updated'),
          icon: 'success',
          confirmButtonColor: '#d97706',
        });
        
        const createdApplicationId = response?.data?.application_id || response?.application_id;
        if (isNewUser && createdApplicationId) {
          router.push(`/crm/user-kyc/${createdApplicationId}`);
          return;
        }
        router.push('/crm/all-enquiries');
      } catch (error) {
        const errorMessage = error?.response?.data?.message || error?.message || 'Failed to save';
        setSubmitError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setSaving(false);
      }
    }
  });

  // Fetch user data if editing
  useEffect(() => {
    const id = userIdProp ?? params?.id;
    const isCreateMode = mode === 'new' || id === 'new' || !id;

    if (isCreateMode) {
      setIsNewUser(true);
      formik.resetForm({ values: initialFormValues });
      setSameAsCurrent(false);
    } else {
      setIsNewUser(false);
      fetchUserKYCData(id);
    }
  }, [mode, params, userIdProp]);

  const fetchUserKYCData = async (id) => {
    try {
      setLoading(true);
      const response = await userKycService.getUserKyc(id);
      const nextValues = mapUserKycToFormValues(response, initialFormValues);
      formik.setValues(nextValues);
      const isSame = JSON.stringify(nextValues.currentAddress) === JSON.stringify(nextValues.permanentAddress);
      setSameAsCurrent(isSame);
    } catch (error) {
      console.error('Error:', error);
      toast.error(error?.response?.data?.message || 'Failed to load KYC details');
    } finally {
      setLoading(false);
    }
  };

  const handleSameAddressChange = (e) => {
    const checked = e.target.checked;
    setSameAsCurrent(checked);
    if (checked) {
      formik.setFieldValue('permanentAddress', { ...formik.values.currentAddress });
    }
  };

  const isCurrentAddressComplete = () => {
    const addr = formik.values.currentAddress;
    return addr.houseNo && addr.addressLine1 && addr.state && addr.city && addr.pincode;
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
      const nextStatus = status === 'verify' ? 'verified' : 'rejected';
      const id = userIdProp ?? params?.id;
      await userKycService.updateUserKyc(id, {
        ...formik.values,
        sameAsCurrent,
        kycStatus: nextStatus
      });
      formik.setFieldValue('kycStatus', nextStatus);
      toast.success(`KYC ${nextStatus} successfully`);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to update status');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-gray-900' : 'bg-crm-accent-soft/60'}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-crm-primary mx-auto mb-4"></div>
          <p className={isDark ? "text-white" : "text-gray-700"}>Loading KYC data...</p>
        </div>
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
                    formik.values.kycStatus === 'verified' 
                      ? 'bg-green-100 text-green-700'
                      : formik.values.kycStatus === 'rejected'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {formik.values.kycStatus}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Error Alert */}
          {submitError && (
            <div className={`mb-6 p-4 rounded-xl border ${
              isDark 
                ? 'bg-red-900/20 border-red-600/30 text-red-400' 
                : 'bg-red-50 border-red-200 text-red-700'
            }`}>
              <div className="flex items-center gap-2">
                <span>⚠️</span>
                <p className="text-sm">{submitError}</p>
              </div>
            </div>
          )}

          {/* 2-Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Column 1 */}
            <div className="space-y-6">
              <PersonalDetails 
                formik={formik}
                isDark={isDark}
              />
              <AddressSection
                title="Current Address"
                addressPrefix="current"
                formik={formik}
                isDark={isDark}
              />
              <BankDetails 
                formik={formik}
                isDark={isDark}
              />
            </div>

            {/* Column 2 */}
            <div className="space-y-6">
              <KYCDetails 
                formik={formik}
                isDark={isDark}
                isNewUser={isNewUser}
                fileRefs={{ aadharFileRef, aadharBackFileRef, panFileRef, livePhotoRef }}
              />
              <AddressSection
                title="Permanent Address"
                addressPrefix="permanent"
                showSameAddressOption={true}
                sameAddress={sameAsCurrent}
                onSameAddressChange={handleSameAddressChange}
                isCurrentAddressComplete={isCurrentAddressComplete()}
                formik={formik}
                isDark={isDark}
              />
              <NomineeDetails 
                formik={formik}
                isDark={isDark}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex justify-end">
            <div className={`flex flex-wrap justify-end gap-3 rounded-2xl border px-4 py-3 ${
              isDark
                ? 'border-crm-border bg-gray-900'
                : 'border-crm-border bg-white'
            }`}>
              {!isNewUser && formik.values.kycStatus === 'pending' && (
                <>
                  <button
                    type="button"
                    onClick={() => handleVerification('reject')}
                    className="px-5 py-2.5 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all duration-200 flex items-center gap-2 shadow-lg"
                  >
                    <XCircle className="w-4 h-4" />
                    Reject
                  </button>
                  <button
                    type="button"
                    onClick={() => handleVerification('verify')}
                    className="px-5 py-2.5 bg-crm-primary text-white rounded-xl hover:bg-crm-primary-strong transition-all duration-200 flex items-center gap-2 shadow-lg"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Verify
                  </button>
                </>
              )}
              <button
                type="button"
                onClick={formik.handleSubmit}
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