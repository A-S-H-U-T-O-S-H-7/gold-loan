'use client';

import React from 'react';
import { User, Mail, Phone, MapPin, Calendar, CheckCircle, Hash, Clock } from 'lucide-react';

export default function PersonalInfo() {
  const userData = {
    name: 'Amit Kumar',
    email: 'amit.kumar@email.com',
    phone: '+91 98765 43210',
    age: 32,
    gender: 'Male',
    address: '123, MG Road, Bangalore - 560001',
    city: 'Bangalore',
    customerId: 'GS123456',
    joinedDate: '15 Jan 2023',
    status: 'Verified'
  };

  return (
    <div className="relative bg-white rounded-xl shadow-lg border border-amber-200 overflow-hidden mb-6">
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 px-3 md:px-5 py-4 border-b-2 border-amber-400">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-lg flex items-center justify-center shadow-lg">
              <User className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-lg font-bold text-white">Personal Information</h3>
          </div>
          <div className=" px-1 md:px-3 py-1.5 bg-emerald-500 text-white text-xs font-semibold rounded-full flex items-center gap-1.5">
            <CheckCircle className="h-3.5 w-3.5" />
            <span>KYC Verified</span>
          </div>
        </div>
      </div>

      <div className="p-3 md:p-6">
        {/* Profile Section */}
        <div className="flex items-start gap-6 pb-4 md:pb-6 border-b border-amber-100">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className="w-14 h-14 md:w-24 md:h-24 bg-gradient-to-br from-amber-500 via-yellow-500 to-orange-600 rounded-xl flex items-center justify-center text-white text-2xl font-bold shadow-lg ring-4 ring-amber-50">
              AK
            </div>
            <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-emerald-500 rounded-full flex items-center justify-center border-3 border-white shadow-md">
              <CheckCircle className="h-4 w-4 text-white" />
            </div>
          </div>

          {/* Name and Primary Info */}
          <div className="flex-1 min-w-0">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">{userData.name}</h2>
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
              <span className="font-medium">{userData.age} years</span>
              <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
              <span className="font-medium">{userData.gender}</span>
            </div>
            
            {/* Customer ID and Join Date */}
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-yellow-600 rounded-lg shadow-sm">
                <Hash className="h-3.5 w-3.5 text-white" />
                <span className="text-xs font-semibold text-white">{userData.customerId}</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-orange-500 to-amber-600 rounded-lg shadow-sm">
                <Clock className="h-3.5 w-3.5 text-white" />
                <span className="text-xs font-semibold text-white">Since {userData.joinedDate}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {/* Email */}
          <div className="group">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                <Mail className="h-4 w-4 text-amber-600" />
              </div>
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Email Address</span>
            </div>
            <div className="flex items-center justify-between bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg px-4 py-3 border border-amber-200">
              <span className="text-sm font-semibold text-gray-900 truncate">{userData.email}</span>
              <div className="flex-shrink-0 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center ml-2">
                <CheckCircle className="h-3.5 w-3.5 text-white" />
              </div>
            </div>
          </div>

          {/* Phone */}
          <div className="group">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                <Phone className="h-4 w-4 text-amber-600" />
              </div>
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Mobile Number</span>
            </div>
            <div className="flex items-center justify-between bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg px-4 py-3 border border-amber-200">
              <span className="text-sm font-semibold text-gray-900">{userData.phone}</span>
              <div className="flex-shrink-0 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center ml-2">
                <CheckCircle className="h-3.5 w-3.5 text-white" />
              </div>
            </div>
          </div>

          {/* Address - Full Width */}
          <div className="md:col-span-2 group">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                <MapPin className="h-4 w-4 text-amber-600" />
              </div>
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Address</span>
            </div>
            <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg px-4 py-3 border border-amber-200">
              <p className="text-sm font-semibold text-gray-900">{userData.address}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500"></div>
    </div>
  );
}