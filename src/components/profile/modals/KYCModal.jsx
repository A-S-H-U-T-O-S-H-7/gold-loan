'use client';

import React from 'react';
import { X, CheckCircle, FileText, User, MapPin, Calendar } from 'lucide-react';

export default function KYCModal({ onClose }) {
  const kycData = {
    aadhaar: {
      number: 'XXXX XXXX 7890',
      status: 'Verified',
      verifiedOn: '20 Jan 2023'
    },
    pan: {
      number: 'ABCDE1234F',
      status: 'Verified',
      verifiedOn: '20 Jan 2023'
    },
    address: {
      type: 'Current Address',
      verifiedOn: '20 Jan 2023',
      status: 'Verified'
    },
    documents: [
      { name: 'Aadhaar Card', status: 'Verified', icon: User },
      { name: 'PAN Card', status: 'Verified', icon: FileText },
      { name: 'Address Proof', status: 'Verified', icon: MapPin },
      { name: 'Photographs', status: 'Uploaded', icon: Calendar }
    ]
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="bg-linear-to-r from-blue-500 to-blue-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mr-4">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">KYC Details</h2>
                <p className="opacity-90">Your verified identity information</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* KYC Status Badge */}
          <div className="bg-linear-to-r from-green-50 to-emerald-50 rounded-xl p-6 mb-6 border border-green-200">
            <div className="flex items-center">
              <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mr-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">KYC Verified</h3>
                <p className="text-gray-600">Your identity is fully verified. All documents are valid.</p>
                <div className="mt-2 text-sm text-gray-500">
                  Last updated: {kycData.aadhaar.verifiedOn}
                </div>
              </div>
            </div>
          </div>

          {/* Document Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 rounded-xl p-5">
              <div className="flex items-center text-gray-600 mb-3">
                <User className="h-5 w-5 mr-2" />
                <span className="font-medium">Aadhaar Number</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-2">{kycData.aadhaar.number}</div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span className="text-green-700 font-medium">{kycData.aadhaar.status}</span>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-5">
              <div className="flex items-center text-gray-600 mb-3">
                <FileText className="h-5 w-5 mr-2" />
                <span className="font-medium">PAN Number</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-2">{kycData.pan.number}</div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span className="text-green-700 font-medium">{kycData.pan.status}</span>
              </div>
            </div>
          </div>

          {/* Document List */}
          <div className="mb-6">
            <h4 className="font-bold text-gray-900 mb-4">Uploaded Documents</h4>
            <div className="space-y-3">
              {kycData.documents.map((doc, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                      <doc.icon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{doc.name}</div>
                      <div className="text-sm text-gray-600">Verified at branch</div>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    doc.status === 'Verified' 
                      ? 'bg-green-100 text-green-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}>
                    {doc.status}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button className="flex-1 py-3 bg-primary-500 text-white rounded-xl font-bold hover:bg-primary-600 transition">
              Download KYC Summary
            </button>
            <button className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition">
              Update Documents
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}