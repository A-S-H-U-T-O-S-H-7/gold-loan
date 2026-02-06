'use client';

import ApplyFormComponent from './ApplyForm';
import { Shield, Clock, CheckCircle, Phone, MapPin, FileText, UserCheck, Zap, Mail } from 'lucide-react';
import Link from 'next/link';

export default function ApplyPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-amber-100 via-white to-amber-50 py-8 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23f59e0b' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E")`,
          backgroundSize: '500px 500px'
        }}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Page Header */}
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-flex  items-center px-4 md:px-6 py-3 bg-linear-to-r from-gray-400 to-gray-600 text-white rounded-full font-semibold mb-6 shadow-lg">
            <Zap className="h-5 w-5 mr-2" />
            <span>Get Pre-approved in 30 Seconds</span>
          </div>
          <h1 className="text-4xl md:text-5xl  font-bold text-gray-900 mb-4 md:mb-6">
            Apply online for{' '}
            <span className="bg-linear-to-r from-amber-500 via-yellow-500 to-amber-600 bg-clip-text text-transparent">
              Gold Loan
            </span>
          </h1>
          <p className="text-gray-600 text-md md:text-lg max-w-3xl mx-auto mb-8">
            Start your application online, visit branch with gold, and get cash in 60 minutes.
            No commitment until you accept the final offer.
          </p>
          
          
          
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Form */}
          <div className="lg:col-span-2">
            <ApplyFormComponent />
          </div>

          {/* Right Column - Info Cards */}
          <div className="space-y-6">
            {/* Why Apply Online Card */}
            <div className="bg-linear-to-br from-white to-gray-50 rounded-2xl shadow-xl p-4 border border-gray-200 hover:shadow-2xl transition-shadow duration-300">
              <div className="flex items-center mb-6">
                <div className=" w-10 h-10 md:w-12 md:h-12 bg-linear-to-br from-blue-500 to-blue-600 rounded-lg md:rounded-xl flex items-center justify-center mr-4">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <h3 className= "text-xl md:text-2xl font-bold text-gray-900">Why Apply Online?</h3>
              </div>
              
              <div className=" space-y-2 md:space-y-5">
                <div className="flex items-start group hover:bg-blue-50 p-3 rounded-lg transition">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0 group-hover:scale-110 transition">
                    <CheckCircle className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-md md:text-lg mb-1">Pre-approval</h4>
                    <p className="text-gray-600 text-sm">Know your eligibility instantly</p>
                  </div>
                </div>

                <div className="flex items-start group hover:bg-amber-50 p-3 rounded-lg transition">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0 group-hover:scale-110 transition">
                    <Clock className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-md md:text-lg mb-1">Skip Queues</h4>
                    <p className="text-gray-600 text-sm">Fast-track processing at branch</p>
                  </div>
                </div>

                <div className="flex items-start group hover:bg-purple-50 p-3 rounded-lg transition">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0 group-hover:scale-110 transition">
                    <UserCheck className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-md md:text-lg mb-1">Dedicated Executive</h4>
                    <p className="text-gray-600 text-sm">Personal assistance throughout</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Branch Visit Info */}
            <div className="bg-linear-to-br from-amber-50 to-orange-50 rounded-2xl shadow-xl p-2 md:p-4 border border-amber-200 hover:shadow-2xl transition-shadow duration-300">
              <div className="flex items-center mb-4">
                <div className=" w-8 h-8 md:w-12 md:h-12 bg-linear-to-br from-amber-500 to-amber-600 rounded-lg md:rounded-xl flex items-center justify-center mr-4">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <h3 className=" text-xl md:text-2xl font-bold text-gray-900">Branch Visit Checklist</h3>
              </div>
              
              <div className="space-y-2">
                {[
                  { icon: '💎', title: 'Original gold items', desc: '22K or 24K hallmarked gold' },
                  { icon: '🆔', title: 'Aadhaar Card', desc: 'Original + photocopy' },
                  { icon: '📄', title: 'PAN Card', desc: 'For loans above ₹5 lakh' },
                  { icon: '📷', title: 'Passport photos', desc: 'Two recent photographs' },
                ].map((item, index) => (
                  <div key={index} className="flex items-center bg-white/50 px-4 py-2 shadow-md rounded-xl hover:bg-white transition">
                    <div className="text-2xl mr-4">{item.icon}</div>
                    <div>
                      <div className="font-bold text-gray-900">{item.title}</div>
                      <div className="text-sm text-gray-600">{item.desc}</div>
                    </div>
                    <div className="ml-auto w-8 h-8 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                  </div>
                ))}
              </div>
              
              
            </div>
            

            
          </div>
        </div>

        

     {/* Bottom CTA - Professional Emerald Theme */}
<div className="mt-8 md:mt-12 bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl p-6 md:p-8 text-center shadow-2xl border border-emerald-500/20 relative overflow-hidden">
  {/* Emerald accent */}
  <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-emerald-400 via-green-400 to-emerald-400"></div>
  
  <div className="relative z-10">
    <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4 text-white">
      Ready to Get Started?
    </h3>
    <p className="text-gray-300 mb-6 md:mb-8 max-w-2xl mx-auto text-base md:text-lg">
      Apply now and our branch executive will contact you within 30 minutes 
      to guide you through the next steps.
    </p>
    
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <Link
        href="/calculator"
        className="bg-linear-to-r from-emerald-600 to-green-500 text-white px-8 py-4 rounded-xl font-bold hover:from-emerald-700 hover:to-green-600 transition-all duration-300 shadow-lg hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] text-lg"
      >
        Calculate Loan Amount
      </Link>
      
      <Link
        href="/branches"
        className="bg-linear-to-r from-gray-800 to-gray-700 text-emerald-100 border border-emerald-500/30 px-8 py-4 rounded-xl font-bold hover:border-emerald-400 hover:bg-gray-700 transition-all duration-300 shadow-lg hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] text-lg"
      >
        Visit Nearest Branch
      </Link>
    </div>
    
    {/* Features */}
    <div className="mt-8 pt-6 border-t border-gray-700">
      <div className="inline-flex flex-wrap justify-center items-center gap-6 text-gray-400">
        <span className="flex items-center">
          <CheckCircle className="w-5 h-5 text-emerald-400 mr-2" />
          Bank Certified
        </span>
        <span className="flex items-center">
          <Zap className="w-5 h-5 text-emerald-400 mr-2" />
          60-Minute Disbursal
        </span>
        <span className="flex items-center">
          <Shield className="w-5 h-5 text-emerald-400 mr-2" />
          Insured Gold
        </span>
      </div>
    </div>
  </div>
</div>
      </div>
    </div>
  );
}