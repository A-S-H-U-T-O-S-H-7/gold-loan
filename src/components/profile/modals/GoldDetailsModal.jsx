'use client';

import React from 'react';
import { X, Scale, Shield, TrendingUp, Download, Image } from 'lucide-react';

export default function GoldDetailsModal({ onClose }) {
  const goldItems = [
    {
      id: 1,
      type: 'Necklace',
      weight: 45.2,
      purity: '22K',
      value: 248600,
      photo: 'https://via.placeholder.com/100x100/fbbf24/ffffff?text=N',
      status: 'Pledged'
    },
    {
      id: 2,
      type: 'Bracelet',
      weight: 25.5,
      purity: '22K',
      value: 140250,
      photo: 'https://via.placeholder.com/100x100/f59e0b/ffffff?text=B',
      status: 'Pledged'
    },
    {
      id: 3,
      type: 'Gold Coin',
      weight: 10,
      purity: '24K',
      value: 60000,
      photo: 'https://via.placeholder.com/100x100/fbbf24/ffffff?text=C',
      status: 'Pledged'
    },
    {
      id: 4,
      type: 'Earrings',
      weight: 8.3,
      purity: '22K',
      value: 45650,
      photo: 'https://via.placeholder.com/100x100/f59e0b/ffffff?text=E',
      status: 'Pledged'
    }
  ];

  const totalWeight = goldItems.reduce((sum, item) => sum + item.weight, 0);
  const totalValue = goldItems.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="bg-linear-to-r from-amber-500 to-yellow-500 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mr-4">
                <Scale className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Gold Details & Valuation</h2>
                <p className="opacity-90">Your pledged gold items and valuation</p>
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

        {/* Stats Summary */}
        <div className="p-6 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-linear-to-br from-amber-50 to-yellow-50 rounded-xl p-5 border border-amber-200">
              <div className="flex items-center mb-3">
                <Scale className="h-5 w-5 text-amber-600 mr-2" />
                <div className="font-bold text-gray-900">Total Gold Weight</div>
              </div>
              <div className="text-3xl font-bold text-amber-600">{totalWeight.toFixed(1)}g</div>
            </div>

            <div className="bg-linear-to-br from-primary-50 to-blue-50 rounded-xl p-5 border border-primary-200">
              <div className="flex items-center mb-3">
                <TrendingUp className="h-5 w-5 text-primary-600 mr-2" />
                <div className="font-bold text-gray-900">Current Value</div>
              </div>
              <div className="text-3xl font-bold text-primary-600">₹{totalValue.toLocaleString()}</div>
            </div>

            <div className="bg-linear-to-br from-green-50 to-emerald-50 rounded-xl p-5 border border-green-200">
              <div className="flex items-center mb-3">
                <Shield className="h-5 w-5 text-green-600 mr-2" />
                <div className="font-bold text-gray-900">Insurance Coverage</div>
              </div>
              <div className="text-3xl font-bold text-green-600">₹{totalValue.toLocaleString()}</div>
              <div className="text-sm text-green-700 mt-1">Valid until 15 Apr 2024</div>
            </div>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-300px)]">
          {/* Gold Items List */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Gold Items</h3>
            <div className="space-y-4">
              {goldItems.map((item) => (
                <div key={item.id} className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
                  {/* Photo */}
                  <div className="w-20 h-20 rounded-xl bg-linear-to-br from-amber-200 to-yellow-200 flex items-center justify-center mr-4">
                    <div className="text-2xl font-bold text-amber-700">{item.type.charAt(0)}</div>
                  </div>

                  {/* Details */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-gray-900 text-lg">{item.type}</h4>
                      <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-medium">
                        {item.status}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="text-gray-600">Weight</div>
                        <div className="font-bold text-gray-900">{item.weight}g</div>
                      </div>
                      <div>
                        <div className="text-gray-600">Purity</div>
                        <div className="font-bold text-gray-900">{item.purity}</div>
                      </div>
                      <div>
                        <div className="text-gray-600">Value</div>
                        <div className="font-bold text-primary-600">₹{item.value.toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Storage Details */}
          <div className="bg-linear-to-br from-gray-50 to-gray-100 rounded-xl p-6 mb-6">
            <h4 className="font-bold text-gray-900 text-lg mb-4 flex items-center">
              <Shield className="h-5 w-5 mr-2 text-gray-600" />
              Storage & Security Details
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-600 mb-1">Vault Location</div>
                <div className="font-bold text-gray-900">Bangalore Main Branch</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Locker Number</div>
                <div className="font-bold text-gray-900">BLR-VLT-0456</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Pledge Date</div>
                <div className="font-bold text-gray-900">16 Jan 2024</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Next Audit</div>
                <div className="font-bold text-gray-900">15 Mar 2024</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button className="flex items-center justify-center flex-1 py-3 bg-primary-500 text-white rounded-xl font-bold hover:bg-primary-600 transition">
              <Download className="h-5 w-5 mr-2" />
              Download Valuation Certificate
            </button>
            <button className="flex items-center justify-center flex-1 py-3 border border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition">
              <Image className="h-5 w-5 mr-2" />
              View Gold Photos
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}