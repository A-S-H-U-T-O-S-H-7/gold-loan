import React, { useState } from 'react';
import { CreditCard, FileText, Check, Camera, IdCard } from 'lucide-react';
import FormField from './FormField';
import FileUploadField from './FileUploadField';

const KYCDetails = ({ 
  formData, 
  handleInputChange, 
  handleFileUpload, 
  handleClearFile,
  errors, 
  isDark,
  isNewUser,
  aadharFileRef,
  aadharBackFileRef,
  panFileRef,
  livePhotoRef,
  onVerifyAadhar,
  onVerifyPAN,
  aadharVerified,
  panVerified
}) => {
  const [verifyingAadhar, setVerifyingAadhar] = useState(false);
  const [verifyingPAN, setVerifyingPAN] = useState(false);

  const handleVerifyAadhar = async () => {
    setVerifyingAadhar(true);
    await onVerifyAadhar(formData.aadharNumber);
    setVerifyingAadhar(false);
  };

  const handleVerifyPAN = async () => {
    setVerifyingPAN(true);
    await onVerifyPAN(formData.panNumber);
    setVerifyingPAN(false);
  };

  return (
    <div className={`rounded-xl shadow-lg border-2 overflow-hidden ${
      isDark
        ? 'bg-gray-800 border-crm-border shadow-crm-soft'
        : 'bg-white border-crm-border shadow-crm-soft'
    }`}>
      <div className="p-5">
        <div className="flex items-center space-x-2 mb-4">
          <CreditCard className={`w-5 h-5 ${isDark ? 'text-crm-primary-strong' : 'text-crm-primary'}`} />
          <h3 className={`text-lg font-semibold ${isDark ? 'text-crm-primary-strong' : 'text-crm-primary'}`}>
            KYC Details
          </h3>
        </div>
      
        <div className="space-y-4">
        {/* Aadhaar */}
          <div>
            <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1">
              <FormField
                name="aadharNumber"
                label="Aadhaar Number"
                placeholder="12-digit"
                required
                value={formData.aadharNumber}
                onChange={handleInputChange}
                maxLength="12"
                icon={CreditCard}
                error={errors.aadharNumber}
                isDark={isDark}
              />
            </div>
              <div className="flex items-end pb-1">
              <button
                type="button"
                onClick={handleVerifyAadhar}
                disabled={verifyingAadhar || aadharVerified}
                className={`px-4 py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-1 transition-all duration-200 ${
                  aadharVerified
                    ? 'bg-green-500 text-white'
                    : isDark
                      ? 'bg-crm-primary hover:bg-crm-primary-strong text-white disabled:opacity-50'
                      : 'bg-crm-primary hover:bg-crm-primary-strong text-white disabled:opacity-50'
                }`}
              >
                {aadharVerified ? (
                  <><Check className="w-3 h-3" /> Verified</>
                ) : verifyingAadhar ? (
                  '...'
                ) : (
                  'Verify'
                )}
              </button>
              </div>
            </div>
          </div>

        {/* PAN */}
          <div>
            <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1">
              <FormField
                name="panNumber"
                label="PAN Number"
                placeholder="10-digit"
                required
                value={formData.panNumber}
                onChange={(e) => {
                  const value = e.target.value.toUpperCase();
                  handleInputChange({
                    target: { name: 'panNumber', value }
                  });
                }}
                maxLength="10"
                icon={FileText}
                error={errors.panNumber}
                isDark={isDark}
              />
            </div>
              <div className="flex items-end pb-1">
              <button
                type="button"
                onClick={handleVerifyPAN}
                disabled={verifyingPAN || panVerified}
                className={`px-4 py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-1 transition-all duration-200 ${
                  panVerified
                    ? 'bg-green-500 text-white'
                    : isDark
                      ? 'bg-crm-primary hover:bg-crm-primary-strong text-white disabled:opacity-50'
                      : 'bg-crm-primary hover:bg-crm-primary-strong text-white disabled:opacity-50'
                }`}
              >
                {panVerified ? (
                  <><Check className="w-3 h-3" /> Verified</>
                ) : verifyingPAN ? (
                  '...'
                ) : (
                  'Verify'
                )}
              </button>
              </div>
            </div>
          </div>

        {/* Documents */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <FileUploadField
            label="Aadhaar Front"
            name="aadharDocument"
            required={isNewUser}
            preview={formData.aadharDocumentPreview}
            onUpload={(e) => handleFileUpload(e, 'aadharDocument')}
            onClear={() => handleClearFile('aadharDocument')}
            error={errors.aadharDocument}
            isDark={isDark}
            fileRef={aadharFileRef}
          />

          <FileUploadField
            label="Aadhaar Back"
            name="aadharBackDocument"
            required={isNewUser}
            preview={formData.aadharBackDocumentPreview}
            onUpload={(e) => handleFileUpload(e, 'aadharBackDocument')}
            onClear={() => handleClearFile('aadharBackDocument')}
            error={errors.aadharBackDocument}
            isDark={isDark}
            fileRef={aadharBackFileRef}
            icon={IdCard}
          />
          
          <FileUploadField
            label="PAN"
            name="panDocument"
            required={isNewUser}
            preview={formData.panDocumentPreview}
            onUpload={(e) => handleFileUpload(e, 'panDocument')}
            onClear={() => handleClearFile('panDocument')}
            error={errors.panDocument}
            isDark={isDark}
            fileRef={panFileRef}
          />
          
          <FileUploadField
            label="Live Photo"
            name="livePhoto"
            required={isNewUser}
            preview={formData.livePhotoPreview}
            onUpload={(e) => handleFileUpload(e, 'livePhoto')}
            onClear={() => handleClearFile('livePhoto')}
            error={errors.livePhoto}
            isDark={isDark}
            fileRef={livePhotoRef}
            accept="image/*"
            icon={Camera}
          />
          </div>
        </div>
      </div>
    </div>
  );
};

export default KYCDetails;
