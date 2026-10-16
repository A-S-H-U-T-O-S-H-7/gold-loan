'use client';
import React, { useEffect, useRef, useState } from 'react';
import { AlertTriangle, FileText, Image, Upload, X } from 'lucide-react';
import { getKycDocument } from '@/lib/services/applicationKycService';
import toast from 'react-hot-toast';

const fields = [['aadhaarFront', 'Aadhaar Front'], ['aadhaarBack', 'Aadhaar Back'], ['panCard', 'PAN Card'], ['photo', 'Photo'], ['addressProof', 'Current Address Proof']];
const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
const maxSize = 5 * 1024 * 1024;

function DocumentField({ fieldName, label, formik, isDark, error, applicationId }) {
  const inputRef = useRef(null);
  const file = formik.values[fieldName];
  const [previewUrl, setPreviewUrl] = useState(null);
  const isLocalFile = typeof File !== 'undefined' && file instanceof File;
  const isPdf = isLocalFile ? file.type === 'application/pdf' : typeof file === 'string' && /\.pdf$/i.test(file);

  useEffect(() => {
    let active = true;
    let url;
    setPreviewUrl(null);

    if (isLocalFile) {
      if (file.type.startsWith('image/')) {
        url = URL.createObjectURL(file);
        setPreviewUrl(url);
      }
    } else if (typeof file === 'string' && !isPdf) {
      getKycDocument(applicationId, fieldName).then((blob) => {
        if (!active || !blob.type.startsWith('image/')) return;
        url = URL.createObjectURL(blob);
        setPreviewUrl(url);
      }).catch(() => {
        // Keep the document available through View Document if a thumbnail cannot load.
      });
    }

    return () => {
      active = false;
      if (url) URL.revokeObjectURL(url);
    };
  }, [applicationId, fieldName, file, isLocalFile, isPdf]);

  const viewDocument = async () => {
    let tab;
    try {
      if (isLocalFile && previewUrl) {
        window.open(previewUrl, '_blank', 'noopener,noreferrer');
      } else if (typeof file === 'string') {
        tab = window.open('', '_blank');
        const blob = await getKycDocument(applicationId, fieldName);
        const url = URL.createObjectURL(blob);
        if (tab) { tab.opener = null; tab.location.href = url; } else window.open(url, '_blank', 'noopener,noreferrer');
        window.setTimeout(() => URL.revokeObjectURL(url), 60000);
      }
    } catch (caught) { tab?.close(); toast.error(caught.response?.data?.message || 'Could not open document'); }
  };

  const chooseFile = (nextFile) => {
    if (!nextFile) return;
    if (!allowedTypes.includes(nextFile.type) || nextFile.size === 0 || nextFile.size > maxSize) {
      formik.setFieldError(fieldName, 'Use a JPG, PNG or PDF up to 5 MB');
      formik.setFieldTouched(fieldName, true, false);
      if (inputRef.current) inputRef.current.value = '';
      return;
    }
    formik.setFieldValue(fieldName, nextFile);
  };

  return <div>
    <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{label} <span className="text-red-500">*</span></label>
    {file ? <div className={`flex items-center gap-3 p-3 rounded border-2 ${isDark ? 'border-gold-600/50 bg-gray-700 text-gray-100' : 'border-gold-200 bg-gray-50 text-gray-900'}`}>
      <div className={`h-14 w-14 shrink-0 rounded flex items-center justify-center ${isDark ? 'bg-gray-600 text-gold-300' : 'bg-gold-100 text-gold-700'}`}>
        {previewUrl && !isPdf ? <img src={previewUrl} alt={`${label} preview`} className="h-12 w-12 rounded object-cover" /> : isPdf ? <FileText className="w-5 h-5" /> : <Image className="w-5 h-5" />}
      </div>
      <span className="flex-1 min-w-0 text-sm truncate">{isLocalFile ? file.name : file.split('/').pop()}</span>
      <button type="button" onClick={viewDocument} className={`cursor-pointer text-xs font-semibold hover:underline ${isDark ? 'text-gold-300' : 'text-gold-700'}`}>View Document</button>
      <button type="button" aria-label={`Remove ${label}`} onClick={() => { formik.setFieldValue(fieldName, null); if (inputRef.current) inputRef.current.value = ''; }} className="cursor-pointer p-1 text-red-500"><X className="w-4 h-4" /></button>
    </div> : <button type="button" onClick={() => inputRef.current?.click()} className={`w-full cursor-pointer p-6 rounded border-2 border-dashed flex flex-col items-center gap-2 ${isDark ? 'border-gold-600/30 bg-gray-700/50 text-gray-200 hover:bg-gray-700' : 'border-gold-300 bg-gray-50 text-gray-700 hover:bg-gold-50'}`}>
      <Upload className={`w-8 h-8 ${isDark ? 'text-gold-300' : 'text-gold-600'}`} /><span className="text-sm">Click to upload {label}</span><span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>JPG, PNG, PDF (Max 5 MB)</span>
    </button>}
    <input ref={inputRef} type="file" accept="image/jpeg,image/png,application/pdf" onChange={(event) => chooseFile(event.target.files?.[0])} className="hidden" />
    {error && <div className="text-xs mt-1 text-red-500 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /><span>{error}</span></div>}
  </div>;
}

export default function DocumentUpload({ formik, isDark, errors = {}, touched = {}, applicationId }) {
  return <div className={`rounded-xl shadow-lg border-2 overflow-hidden ${isDark ? 'bg-gray-800 border-gold-700/50' : 'bg-white border-gold-200'}`}>
    <div className="p-5"><h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-gold-400' : 'text-gold-600'}`}>KYC Documents</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{fields.map(([fieldName, label]) => <DocumentField key={fieldName} fieldName={fieldName} label={label} formik={formik} isDark={isDark} applicationId={applicationId} error={touched[fieldName] ? errors[fieldName] : null} />)}</div>
    </div>
  </div>;
}
