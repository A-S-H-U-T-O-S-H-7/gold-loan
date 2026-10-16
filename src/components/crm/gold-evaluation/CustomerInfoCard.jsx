'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { User, Phone, Mail, MapPin, Calendar, FileText, Building2, CreditCard, ChevronDown, ChevronRight, Image, File, X } from 'lucide-react';
import { getKycDocument } from '@/lib/services/applicationKycService';

const documentFields = [['aadhaarFront', 'Aadhaar Front'], ['aadhaarBack', 'Aadhaar Back'], ['panCard', 'PAN Card'], ['photo', 'Photo'], ['addressProof', 'Address Proof']];

export default function CustomerInfoCard({ customerDetails, isDark, defaultShowKyc = false, applicationId, kycHref }) {
  const [showKyc, setShowKyc] = useState(defaultShowKyc);
  const [previews, setPreviews] = useState({});
  const [selectedDocument, setSelectedDocument] = useState(null);
  const availableDocuments = documentFields.filter(([type]) => customerDetails?.documents?.[type]);
  const documentSignature = availableDocuments.map(([type]) => type).join(',');

  useEffect(() => {
    if (!applicationId || !documentSignature) return undefined;
    let active = true;
    const urls = [];
    setPreviews({});
    for (const type of documentSignature.split(',')) {
      getKycDocument(applicationId, type).then((blob) => {
        const url = URL.createObjectURL(blob);
        urls.push(url);
        if (active) setPreviews((previous) => ({ ...previous, [type]: { url, isImage: blob.type.startsWith('image/') } }));
        else URL.revokeObjectURL(url);
      }).catch(() => {});
    }
    return () => { active = false; urls.forEach((url) => URL.revokeObjectURL(url)); };
  }, [applicationId, documentSignature]);

  useEffect(() => {
    if (!selectedDocument) return undefined;
    const closeOnEscape = (event) => { if (event.key === 'Escape') setSelectedDocument(null); };
    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [selectedDocument]);
  
  if (!customerDetails) return null;

  const infoCardClassName = `p-4 rounded-xl border ${
    isDark ? 'bg-gray-800/50 border-gold-700/30' : 'bg-white/50 border-gold-200'
  }`;

  const labelClassName = `text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`;
  const valueClassName = `text-sm font-semibold mt-1 ${isDark ? 'text-gray-200' : 'text-gray-800'}`;

  const InfoRow = ({ label, value }) => (
    <div className={`flex justify-between py-2 ${isDark ? 'border-b border-gray-700' : 'border-b border-gray-100'}`}>
      <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{label}</span>
      <span className={`text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>{value || '—'}</span>
    </div>
  );

  const customer = customerDetails;

  return (<>
    <div className={`rounded-xl shadow-lg border-2 overflow-hidden ${
      isDark ? "bg-gray-800 border-gold-700/50" : "bg-white border-gold-200"
    }`}>
      <div className="p-5">
        <div className="mb-4 flex items-center justify-between gap-3"><div className="flex items-center space-x-2">
          <FileText className={`w-5 h-5 ${isDark ? "text-gold-400" : "text-gold-600"}`} />
          <h3 className={`text-lg font-semibold ${isDark ? "text-gold-400" : "text-gold-600"}`}>
            Customer Information
          </h3>
        </div>{kycHref && <div className="flex items-center gap-3"><span className={`text-xs font-semibold ${customerDetails.kycVerified ? 'text-emerald-600' : 'text-amber-600'}`}>{customerDetails.kycVerified ? 'KYC Verified' : 'KYC Not Verified'}</span><Link href={kycHref} className="cursor-pointer text-sm font-medium text-gold-600 underline">View KYC</Link></div>}</div>

        {/* Basic Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className={infoCardClassName}>
            <div className="flex items-center gap-2">
              <User className={`w-4 h-4 ${isDark ? 'text-gold-400' : 'text-gold-600'}`} />
              <p className={labelClassName}>Full Name</p>
            </div>
            <p className={valueClassName}>{customer.name || 'N/A'}</p>
          </div>

          <div className={infoCardClassName}>
            <div className="flex items-center gap-2">
              <FileText className={`w-4 h-4 ${isDark ? 'text-gold-400' : 'text-gold-600'}`} />
              <p className={labelClassName}>App ID</p>
            </div>
            <p className={valueClassName}>{customer.id || 'N/A'}</p>
          </div>

          <div className={infoCardClassName}>
            <div className="flex items-center gap-2">
              <Phone className={`w-4 h-4 ${isDark ? 'text-gold-400' : 'text-gold-600'}`} />
              <p className={labelClassName}>Mobile Number</p>
            </div>
            <p className={valueClassName}>{customer.mobile || 'N/A'}</p>
          </div>

          <div className={infoCardClassName}>
            <div className="flex items-center gap-2">
              <Mail className={`w-4 h-4 ${isDark ? 'text-gold-400' : 'text-gold-600'}`} />
              <p className={labelClassName}>Email Address</p>
            </div>
            <p className={valueClassName}>{customer.email || 'N/A'}</p>
          </div>

          <div className={infoCardClassName}>
            <div className="flex items-center gap-2">
              <Calendar className={`w-4 h-4 ${isDark ? 'text-gold-400' : 'text-gold-600'}`} />
              <p className={labelClassName}>KYC Date</p>
            </div>
            <p className={valueClassName}>{customer.kycDate || 'N/A'}</p>
          </div>

          <div className={infoCardClassName}>
            <div className="flex items-center gap-2">
              <MapPin className={`w-4 h-4 ${isDark ? 'text-gold-400' : 'text-gold-600'}`} />
              <p className={labelClassName}>Address</p>
            </div>
            <p className={valueClassName}>{customer.address || 'N/A'}</p>
          </div>
        </div>

        {/* KYC Details - Collapsible */}
        <div className="mt-4 pt-4 border-t border-gold-200/50 dark:border-gold-700/30">
          <button
            onClick={() => setShowKyc(!showKyc)}
            className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gold-50/50 dark:hover:bg-gray-700/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <FileText className={`w-4 h-4 ${isDark ? 'text-gold-400' : 'text-gold-600'}`} />
              <span className={`text-sm font-semibold ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                KYC Details
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                {showKyc ? 'Hide' : 'Show'} full KYC
              </span>
              {showKyc ? (
                <ChevronDown className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
              ) : (
                <ChevronRight className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
              )}
            </div>
          </button>

          {showKyc && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Personal Details */}
              <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700/50' : 'bg-gold-50/50'}`}>
                <h4 className={`text-xs font-semibold uppercase tracking-wider mb-3 ${isDark ? 'text-gold-400' : 'text-gold-600'}`}>
                  <User className="w-3.5 h-3.5 inline mr-1" />
                  Personal Details
                </h4>
                <div className="space-y-1">
                  <InfoRow label="Full Name" value={customer.name} />
                  <InfoRow label="Email" value={customer.email} />
                  <InfoRow label="Mobile" value={customer.mobile} />
                  <InfoRow label="Alternative Phone" value={customer.alternativePhone} />
                  <InfoRow label="Gender" value={customer.gender} />
                  <InfoRow label="DOB" value={customer.dob ? `${customer.dob.day}/${customer.dob.month}/${customer.dob.year}` : '—'} />
                  <InfoRow label="PAN Number" value={customer.pan} />
                  <InfoRow label="Aadhaar Number" value={customer.aadhaar} />
                </div>
              </div>

              {/* Bank Details */}
              <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700/50' : 'bg-gold-50/50'}`}>
                <h4 className={`text-xs font-semibold uppercase tracking-wider mb-3 ${isDark ? 'text-gold-400' : 'text-gold-600'}`}>
                  <Building2 className="w-3.5 h-3.5 inline mr-1" />
                  Bank Details
                </h4>
                <div className="space-y-1">
                  <InfoRow label="Bank Name" value={customer.bankDetails?.bankName} />
                  <InfoRow label="Branch Name" value={customer.bankDetails?.branchName} />
                  <InfoRow label="Account Holder" value={customer.bankDetails?.accountHolderName} />
                  <InfoRow label="Account Type" value={customer.bankDetails?.accountType} />
                  <InfoRow label="Account Number" value={customer.bankDetails?.accountNumber} />
                  <InfoRow label="IFSC Code" value={customer.bankDetails?.ifscCode} />
                </div>
              </div>

              {/* Current Address */}
              <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700/50' : 'bg-gold-50/50'}`}>
                <h4 className={`text-xs font-semibold uppercase tracking-wider mb-3 ${isDark ? 'text-gold-400' : 'text-gold-600'}`}>
                  <MapPin className="w-3.5 h-3.5 inline mr-1" />
                  Current Address
                </h4>
                <div className="space-y-1">
                  <InfoRow label="House No" value={customer.currentAddress?.houseNo} />
                  <InfoRow label="Address" value={customer.currentAddress?.address} />
                  <InfoRow label="City" value={customer.currentAddress?.city} />
                  <InfoRow label="State" value={customer.currentAddress?.state} />
                  <InfoRow label="Pin Code" value={customer.currentAddress?.pinCode} />
                  <InfoRow label="Type" value={customer.currentAddress?.type} />
                </div>
              </div>

              {/* Permanent Address */}
              <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700/50' : 'bg-gold-50/50'}`}>
                <h4 className={`text-xs font-semibold uppercase tracking-wider mb-3 ${isDark ? 'text-gold-400' : 'text-gold-600'}`}>
                  <MapPin className="w-3.5 h-3.5 inline mr-1" />
                  Permanent Address
                </h4>
                <div className="space-y-1">
                  <InfoRow label="House No" value={customer.permanentAddress?.houseNo} />
                  <InfoRow label="Address" value={customer.permanentAddress?.address} />
                  <InfoRow label="City" value={customer.permanentAddress?.city} />
                  <InfoRow label="State" value={customer.permanentAddress?.state} />
                  <InfoRow label="Pin Code" value={customer.permanentAddress?.pinCode} />
                  <InfoRow label="Type" value={customer.permanentAddress?.type} />
                </div>
              </div>

              {/* Documents */}
              <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700/50' : 'bg-gold-50/50'}`}>
                <h4 className={`text-xs font-semibold uppercase tracking-wider mb-3 ${isDark ? 'text-gold-400' : 'text-gold-600'}`}>
                  <Image className="w-3.5 h-3.5 inline mr-1" />
                  Documents
                </h4>
                {applicationId && <div className="mb-3 grid grid-cols-2 gap-2">
                  {availableDocuments.map(([type, label]) => <button key={type} type="button"
                    onClick={() => setSelectedDocument(type)} disabled={!previews[type]}
                    className={`cursor-pointer overflow-hidden rounded-lg border p-2 text-left text-xs disabled:cursor-wait ${isDark ? 'border-gold-700/40 bg-gray-800' : 'border-gold-200 bg-white'}`}>
                    {previews[type]?.isImage ? <img src={previews[type].url} alt={label} className="mb-2 h-24 w-full rounded object-cover" /> : <div className="mb-2 flex h-24 items-center justify-center rounded bg-gold-100 text-gold-700"><FileText className="h-8 w-8" /></div>}
                    <span className="font-medium">{label}</span>
                  </button>)}
                </div>}
                <div className="space-y-1">
                  <InfoRow label="Aadhaar Front" value={customer.documents?.aadhaarFront ? '✅ Uploaded' : '❌ Not Uploaded'} />
                  <InfoRow label="Aadhaar Back" value={customer.documents?.aadhaarBack ? '✅ Uploaded' : '❌ Not Uploaded'} />
                  <InfoRow label="PAN Card" value={customer.documents?.panCard ? '✅ Uploaded' : '❌ Not Uploaded'} />
                  <InfoRow label="Photo" value={customer.documents?.photo ? '✅ Uploaded' : '❌ Not Uploaded'} />
                  <InfoRow label="Address Proof" value={customer.documents?.addressProof ? '✅ Uploaded' : '❌ Not Uploaded'} />
                </div>
              </div>

              {/* Nominee & Guarantor */}
              <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700/50' : 'bg-gold-50/50'}`}>
                <h4 className={`text-xs font-semibold uppercase tracking-wider mb-3 ${isDark ? 'text-gold-400' : 'text-gold-600'}`}>
                  <User className="w-3.5 h-3.5 inline mr-1" />
                  Nominee Details
                </h4>
                <div className="space-y-1">
                  <InfoRow label="Name" value={customer.nominee?.name} />
                  <InfoRow label="Relation" value={customer.nominee?.relation} />
                  <InfoRow label="Mobile" value={customer.nominee?.mobile} />
                  <InfoRow label="Email" value={customer.nominee?.email} />
                </div>
              </div>

              <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700/50' : 'bg-gold-50/50'}`}>
                <h4 className={`text-xs font-semibold uppercase tracking-wider mb-3 ${isDark ? 'text-gold-400' : 'text-gold-600'}`}>
                  <User className="w-3.5 h-3.5 inline mr-1" />
                  Guarantor Details
                </h4>
                <div className="space-y-1">
                  <InfoRow label="Name" value={customer.guarantor?.name} />
                  <InfoRow label="Relation" value={customer.guarantor?.relation} />
                  <InfoRow label="Mobile" value={customer.guarantor?.mobile} />
                  <InfoRow label="Email" value={customer.guarantor?.email} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
    {selectedDocument && previews[selectedDocument] && <div role="dialog" aria-modal="true" aria-label={`${documentFields.find(([type]) => type === selectedDocument)?.[1]} preview`}
      onClick={() => setSelectedDocument(null)} className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-4">
      <div onClick={(event) => event.stopPropagation()} className={`relative max-h-[90vh] w-full max-w-4xl overflow-auto rounded-xl p-4 shadow-2xl ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
        <div className="mb-3 flex items-center justify-between gap-3"><h3 className="font-semibold">{documentFields.find(([type]) => type === selectedDocument)?.[1]}</h3>
          <button type="button" onClick={() => setSelectedDocument(null)} aria-label="Close preview" className="cursor-pointer rounded-lg p-2 hover:bg-gray-500/20"><X className="h-5 w-5" /></button></div>
        {previews[selectedDocument].isImage ? <img src={previews[selectedDocument].url} alt={documentFields.find(([type]) => type === selectedDocument)?.[1]} className="mx-auto max-h-[75vh] max-w-full object-contain" />
          : <iframe src={previews[selectedDocument].url} title="KYC document preview" className="h-[75vh] w-full rounded-lg" />}
      </div>
    </div>}
    </>
  );
}
