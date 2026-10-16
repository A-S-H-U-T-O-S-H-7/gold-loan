'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Formik, setIn } from 'formik';
import { ArrowLeft, Check } from 'lucide-react';
import { useThemeStore } from '@/lib/store/useThemeStore';
import { getApplicationKyc, saveApplicationKyc, uploadKycDocument, verifyApplicationKyc } from '@/lib/services/applicationKycService';
import { applicationValidationSchema, draftKycValidationSchema } from '@/lib/schema/applicationValidationSchema';
import PersonalDetails from '@/components/crm/kyc/PersonalDetails';
import AddressDetails from '@/components/crm/kyc/AddressDetails';
import BankDetails from '@/components/crm/kyc/BankDetails';
import DocumentUpload from '@/components/crm/kyc/DocumentUpload';
import NomineeDetails from '@/components/crm/kyc/NomineeDetails';
import GuarantorDetails from '@/components/crm/kyc/GuarantorDetails';
import StatusBadge from '@/components/crm/ui/StatusBadge';
import toast from 'react-hot-toast';

export default function KYCPage() {
  const { id } = useParams();
  const router = useRouter();
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';
  
  const [loading, setLoading] = useState(false);
  const [application, setApplication] = useState(null);

  useEffect(() => {
    if (!id) return undefined;

    let active = true;
    getApplicationKyc(id)
      .then((record) => {
        if (!active) return;
        const documents = Object.fromEntries((record.kyc?.documents || []).map((document) => [document.documentType, document.fileKey]));
        setApplication({
          id: String(record.id),
          status: record.status,
          kycVerified: Number(record.kyc?.isVerified) === 1,
          customer: {
            name: record.name,
            mobile: record.mobile,
            email: record.email || '',
            dob: record.dob ? (() => { const [year, month, day] = record.dob.split('-'); return { day: String(Number(day)), month: String(Number(month)), year }; })() : undefined,
            currentAddress: { state: record.state || '', city: record.city || '', pinCode: record.pin || '' },
            ...(record.kyc?.details || {}),
            documents,
          },
        });
      })
      .catch((error) => {
        if (!active) return;
        toast.error(error.response?.data?.message || error.message || 'Could not load application');
        router.back();
      });

    return () => { active = false; };
  }, [id, router]);

  // Map application data to form initial values
  const getInitialValues = () => {
    const customer = application?.customer || {};
    
    return {
      // Personal Details
      name: customer.name || '',
      email: customer.email || '',
      phoneNo: customer.mobile || '',
      alternativePhone: customer.alternativePhone || '',
      pan: customer.pan || '',
      aadhaar: customer.aadhaar || '',
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
      accountHolderName: customer.bankDetails?.accountHolderName || '',
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

  const fallbackPath = { PENDING: '/crm/create-customer', FOLLOW_UP: '/crm/follow-up', REJECTED: '/crm/rejected-applications', GOLD_EVALUATION: '/crm/gold-evaluation', LOAN_OFFER: '/crm/loan-offer', CREDIT_APPROVAL: '/crm/credit-approval' }[application?.status] || '/crm/create-customer';
  const navigateBack = () => {
    if (window.history.length > 1) router.back();
    else router.replace(fallbackPath);
  };

  const saveDetails = async (values, setFieldValue) => {
      // Build customer object from form values
      const customerData = {
        name: values.name,
        email: values.email,
        mobile: values.phoneNo,
        alternativePhone: values.alternativePhone,
        pan: values.pan.trim().toUpperCase(),
        aadhaar: values.aadhaar.trim(),
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
          accountHolderName: values.accountHolderName,
          accountType: values.accountType,
          accountNumber: values.accountNo,
          ifscCode: values.ifscCode,
          remark: values.bankRemark,
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

      const documentFields = ['aadhaarFront', 'aadhaarBack', 'panCard', 'photo', 'addressProof'];
      const documents = [];
      for (const field of documentFields) {
        const file = values[field];
        if (!file) continue;
        const fileKey = typeof file === 'string' ? file : await uploadKycDocument(id, field, file);
        documents.push({ document_type: field, file_key: fileKey });
        if (typeof file !== 'string') setFieldValue(field, fileKey, false);
      }
      await saveApplicationKyc(id, customerData, documents);
  };

  const handleSubmit = async (values, { setSubmitting, setFieldValue }) => {
    let saved = false;
    try {
      setLoading(true);
      await saveDetails(values, setFieldValue);
      saved = true;
      await verifyApplicationKyc(id);
      toast.success('KYC verified. Application status has not changed.');
      navigateBack();
    } catch (error) {
      const reason = error.response?.data?.message || error.message || 'Please try again.';
      toast.error(saved ? `Details saved, but KYC verification failed: ${reason}` : `Could not save KYC: ${reason}`);
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  const saveDraft = async (formik) => {
    try {
      await draftKycValidationSchema.validate(formik.values, { abortEarly: false });
      setLoading(true);
      await saveDetails(formik.values, formik.setFieldValue);
      toast.success('KYC draft saved. Application status has not changed.');
      navigateBack();
    } catch (error) {
      if (error.inner) {
        let fieldErrors = {};
        let touchedFields = {};
        error.inner.forEach((item) => {
          if (item.path) {
            fieldErrors = setIn(fieldErrors, item.path, item.message);
            touchedFields = setIn(touchedFields, item.path, true);
          }
        });
        formik.setErrors(fieldErrors);
        formik.setTouched(touchedFields);
        toast.error('Correct the highlighted fields before saving.');
      } else {
        toast.error(error.response?.data?.message || error.message || 'Could not save draft.');
      }
    } finally { setLoading(false); }
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

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark ? 'bg-gray-900 text-gray-100' : 'bg-gold-50/30 text-gray-900'
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
        onClick={navigateBack}
        className={`cursor-pointer p-2 rounded-xl transition-all duration-200 hover:scale-105 ${
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

      <span className={`text-sm font-semibold ${application.kycVerified ? 'text-emerald-600' : 'text-amber-600'}`}>
        {application.kycVerified ? 'KYC Verified' : 'KYC Not Verified'}
      </span>
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
                    applicationId={id}
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
                  onClick={navigateBack}
                  className={`px-6 py-2.5 rounded font-medium transition-all duration-200 cursor-pointer ${
                    isDark
                      ? 'bg-gray-700 hover:bg-gray-600 text-white border border-gray-600'
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-800 border border-gray-300'
                  }`}
                >
                  Cancel
                </button>
                <button type="button" disabled={loading || formik.isSubmitting} onClick={() => saveDraft(formik)} className={`inline-flex cursor-pointer items-center gap-2 rounded border border-gold-500 px-6 py-2.5 font-semibold disabled:cursor-not-allowed disabled:opacity-50 ${isDark ? 'text-gold-300 hover:bg-gold-500/10' : 'text-gold-700 hover:bg-gold-50'}`}>
                  {loading && <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden="true" />}
                  {loading ? 'Saving Draft...' : 'Save Draft'}
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
                      <span>Save and Verify KYC</span>
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
