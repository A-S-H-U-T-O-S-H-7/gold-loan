'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Formik } from 'formik';
import { ArrowLeft, Check } from 'lucide-react';
import { useThemeStore } from '@/lib/store/useThemeStore';
import { useLoanStore } from '@/lib/store/loanStore';
import { applicationValidationSchema } from '@/lib/schema/applicationValidationSchema';
import PersonalDetails from '@/components/crm/kyc/PersonalDetails';
import AddressDetails from '@/components/crm/kyc/AddressDetails';
import BankDetails from '@/components/crm/kyc/BankDetails';
import DocumentUpload from '@/components/crm/kyc/DocumentUpload';
import NomineeDetails from '@/components/crm/kyc/NomineeDetails';
import GuarantorDetails from '@/components/crm/kyc/GuarantorDetails';
import StatusBadge from '@/components/crm/ui/StatusBadge';
import toast from 'react-hot-toast';

// Status options for dropdown
const statusOptions = [
  { value: 'KYC_VERIFIED', label: 'KYC Verified', color: 'bg-emerald-100 text-emerald-700' },
  { value: 'UNDER_REVIEW', label: 'Under Review', color: 'bg-blue-100 text-blue-700' },
  { value: 'PENDING', label: 'Pending', color: 'bg-yellow-100 text-yellow-700' },
  { value: 'REJECTED', label: 'Rejected', color: 'bg-red-100 text-red-700' },
  { value: 'FOLLOW_UP', label: 'Follow Up', color: 'bg-pink-100 text-pink-700' },
];

export default function KYCPage() {
  const { id } = useParams();
  const router = useRouter();
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';
  const { applications, updateApplication, setStatus } = useLoanStore();
  
  const [loading, setLoading] = useState(false);
  const [application, setApplication] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('');

  useEffect(() => {
    if (id) {
      const app = applications.find(a => a.id === id);
      if (app) {
        setApplication(app);
        setSelectedStatus(app.status || 'PENDING');
      } else {
        toast.error('Application not found');
        router.push('/crm/create-customer');
      }
    }
  }, [id, applications, router]);

  // Map application data to form initial values
  const getInitialValues = () => {
    const customer = application?.customer || {};
    
    return {
      // Personal Details
      name: customer.name || '',
      email: customer.email || '',
      phoneNo: customer.mobile || '',
      alternativePhone: customer.alternativePhone || '',
      gender: customer.gender || '',
      dob: customer.dob || { day: '', month: '', year: '' },
      personalRemark: customer.remark || '',

      // Address - Current
      currentHouseNo: customer.currentAddress?.houseNo || '',
      currentAddress: customer.currentAddress?.address || '',
      currentState: customer.currentAddress?.state || '',
      currentCity: customer.currentAddress?.city || '',
      currentPinCode: customer.currentAddress?.pinCode || '',
      currentAddressType: customer.currentAddress?.type || '',
      currentRemark: customer.currentAddress?.remark || '',

      // Address - Permanent
      permanentHouseNo: customer.permanentAddress?.houseNo || '',
      permanentAddress: customer.permanentAddress?.address || '',
      permanentState: customer.permanentAddress?.state || '',
      permanentCity: customer.permanentAddress?.city || '',
      permanentPinCode: customer.permanentAddress?.pinCode || '',
      permanentAddressType: customer.permanentAddress?.type || '',
      permanentRemark: customer.permanentAddress?.remark || '',

      // Bank Details
      bankName: customer.bankDetails?.bankName || '',
      branchName: customer.bankDetails?.branchName || '',
      accountType: customer.bankDetails?.accountType || '',
      accountNo: customer.bankDetails?.accountNumber || '',
      ifscCode: customer.bankDetails?.ifscCode || '',
      bankRemark: customer.bankDetails?.remark || '',

      // Documents
      aadhaarFront: customer.documents?.aadhaarFront || null,
      aadhaarBack: customer.documents?.aadhaarBack || null,
      panCard: customer.documents?.panCard || null,
      photo: customer.documents?.photo || null,
      addressProof: customer.documents?.addressProof || null,

      // Nominee
      nomineeName: customer.nominee?.name || '',
      nomineeRelation: customer.nominee?.relation || '',
      nomineeMobile: customer.nominee?.mobile || '',
      nomineeEmail: customer.nominee?.email || '',
      nomineeAddress: customer.nominee?.address || '',
      nomineeRemark: customer.nominee?.remark || '',

      // Guarantor
      guarantorName: customer.guarantor?.name || '',
      guarantorRelation: customer.guarantor?.relation || '',
      guarantorMobile: customer.guarantor?.mobile || '',
      guarantorEmail: customer.guarantor?.email || '',
      guarantorAddress: customer.guarantor?.address || '',
      guarantorRemark: customer.guarantor?.remark || '',
    };
  };

  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setLoading(true);
      
      // Build customer object from form values
      const customerData = {
        name: values.name,
        email: values.email,
        mobile: values.phoneNo,
        alternativePhone: values.alternativePhone,
        gender: values.gender,
        dob: values.dob,
        remark: values.personalRemark,
        
        currentAddress: {
          houseNo: values.currentHouseNo,
          address: values.currentAddress,
          state: values.currentState,
          city: values.currentCity,
          pinCode: values.currentPinCode,
          type: values.currentAddressType,
          remark: values.currentRemark,
        },
        
        permanentAddress: {
          houseNo: values.permanentHouseNo,
          address: values.permanentAddress,
          state: values.permanentState,
          city: values.permanentCity,
          pinCode: values.permanentPinCode,
          type: values.permanentAddressType,
          remark: values.permanentRemark,
        },
        
        bankDetails: {
          bankName: values.bankName,
          branchName: values.branchName,
          accountType: values.accountType,
          accountNumber: values.accountNo,
          ifscCode: values.ifscCode,
          remark: values.bankRemark,
        },
        
        documents: {
          aadhaarFront: values.aadhaarFront,
          aadhaarBack: values.aadhaarBack,
          panCard: values.panCard,
          photo: values.photo,
          addressProof: values.addressProof,
        },
        
        nominee: {
          name: values.nomineeName,
          relation: values.nomineeRelation,
          mobile: values.nomineeMobile,
          email: values.nomineeEmail,
          address: values.nomineeAddress,
          remark: values.nomineeRemark,
        },
        
        guarantor: {
          name: values.guarantorName,
          relation: values.guarantorRelation,
          mobile: values.guarantorMobile,
          email: values.guarantorEmail,
          address: values.guarantorAddress,
          remark: values.guarantorRemark,
        },
      };

      // Update application with customer data
      await updateApplication(id, { customer: customerData });
      
      // Set status based on dropdown selection
      await setStatus(id, selectedStatus);
      
      // Show success message with next step
      const statusMessages = {
        'KYC_VERIFIED': 'KYC verified successfully! Moving to Gold Evaluation.',
        'UNDER_REVIEW': 'KYC submitted for review.',
        'PENDING': 'KYC data saved as pending.',
        'REJECTED': 'KYC rejected.',
        'FOLLOW_UP': 'Application moved to Follow-Up.',
      };

      toast.success(statusMessages[selectedStatus] || 'KYC updated successfully!');

      // Redirect based on status
      if (selectedStatus === 'KYC_VERIFIED') {
        router.push('/crm/gold-evaluation');
      } else if (selectedStatus === 'REJECTED') {
        router.push('/crm/rejected-applications');
      } else if (selectedStatus === 'FOLLOW_UP') {
        router.push('/crm/follow-up');
      } else {
        router.push('/crm/create-customer');
      }
    } catch (error) {
      toast.error('Failed to submit KYC. Please try again.');
      console.error('KYC Submit Error:', error);
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  // Get status display info
  const getStatusInfo = (status) => {
    return statusOptions.find(opt => opt.value === status);
  };

  if (!application) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        isDark ? 'bg-gray-900' : 'bg-gold-50/30'
      }`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-500 mx-auto"></div>
          <p className={`mt-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Loading KYC form...
          </p>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusInfo(selectedStatus);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark ? 'bg-gray-900' : 'bg-gold-50/30'
    }`}>
      <div className="p-4 md:p-6">
        <Formik
          initialValues={getInitialValues()}
          validationSchema={applicationValidationSchema}
          onSubmit={handleSubmit}
          enableReinitialize={true}
          validateOnBlur={true}
          validateOnChange={false}
        >
          {(formik) => (
            <form onSubmit={formik.handleSubmit}>

{/* Header */}
<div className="mb-6">
  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
    {/* Left side - Back button + Title */}
    <div className="flex items-center space-x-4">
      <button
        type="button"
        onClick={() => router.back()}
        className={`p-2 rounded-xl transition-all duration-200 hover:scale-105 ${
          isDark
            ? 'hover:bg-gray-800 bg-gray-800/50 border border-gold-600/30'
            : 'hover:bg-gold-50 bg-gold-50/50 border border-gold-200'
        }`}
      >
        <ArrowLeft className={`w-4 h-4 ${
          isDark ? 'text-gold-400' : 'text-gold-600'
        }`} />
      </button>
      <h1 className={`text-xl md:text-2xl font-bold ${
        isDark ? 'text-gray-100' : 'text-gray-900'
      }`}>
        KYC Verification - {application.customer?.name || application.id}
      </h1>
    </div>

    {/* Right side - Status Box */}
    <div className={`flex items-center gap-3 px-4 py-2 rounded-xl border ${
      isDark 
        ? 'bg-gray-800/50 border-gold-700/30' 
        : 'bg-white border-gold-200'
    }`}>
      <div className="flex items-center gap-2">
        <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
          Status:
        </span>
        {application.status && (
          <StatusBadge status={application.status} />
        )}
      </div>

      <div className="w-px h-6 bg-gold-300/50 dark:bg-gold-700/50"></div>

      <div className="flex items-center gap-2">
        <select
          value={selectedStatus}
          onChange={handleStatusChange}
          className={`px-3 py-1.5 rounded border-2 transition-all duration-200 text-sm font-medium ${
            isDark
              ? 'bg-gray-700 border-gold-600/50 text-white focus:border-gold-400'
              : 'bg-white border-gold-300 text-gray-900 focus:border-gold-500'
          } focus:ring-2 focus:ring-gold-500/20 focus:outline-none cursor-pointer`}
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {selectedStatus && (
          <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            {selectedStatus === 'KYC_VERIFIED' && '→ Gold Evaluation'}
            {selectedStatus === 'UNDER_REVIEW' && '→ Review'}
            {selectedStatus === 'PENDING' && '→ Pending'}
            {selectedStatus === 'REJECTED' && '→ Rejected'}
            {selectedStatus === 'FOLLOW_UP' && '→ Follow-Up'}
          </span>
        )}
      </div>
    </div>
  </div>
</div>

              {/* Form Sections */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <PersonalDetails
                    formik={formik}
                    isDark={isDark}
                    errors={formik.errors}
                    touched={formik.touched}
                  />
                  <AddressDetails
                    formik={formik}
                    isDark={isDark}
                    errors={formik.errors}
                    touched={formik.touched}
                  />
                  <BankDetails
                    formik={formik}
                    isDark={isDark}
                    errors={formik.errors}
                    touched={formik.touched}
                  />
                </div>

                <div className="space-y-6">
                  <DocumentUpload
                    formik={formik}
                    isDark={isDark}
                    errors={formik.errors}
                    touched={formik.touched}
                  />
                  <NomineeDetails
                    formik={formik}
                    isDark={isDark}
                    errors={formik.errors}
                    touched={formik.touched}
                  />
                  <GuarantorDetails
                    formik={formik}
                    isDark={isDark}
                    errors={formik.errors}
                    touched={formik.touched}
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="mt-8 flex gap-4 justify-end">
                <button
                  type="button"
                  onClick={() => router.push('/crm/create-customer')}
                  className={`px-6 py-2.5 rounded font-medium transition-all duration-200 cursor-pointer ${
                    isDark
                      ? 'bg-gray-700 hover:bg-gray-600 text-white border border-gray-600'
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-800 border border-gray-300'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || formik.isSubmitting}
                  className={`px-8 py-2.5 rounded font-semibold transition-all duration-200 hover:scale-105 cursor-pointer text-white shadow-lg hover:shadow-xl flex items-center gap-2 ${
                    loading || formik.isSubmitting
                      ? 'opacity-50 cursor-not-allowed'
                      : isDark
                        ? 'bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500'
                        : 'bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700'
                  }`}
                >
                  {loading || formik.isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Submit KYC</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </Formik>
      </div>
    </div>
  );
}