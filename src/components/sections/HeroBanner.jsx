import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CheckCircle, Shield, Zap, Clock, TrendingUp } from 'lucide-react';

export default function HeroBanner() {
  return (
    <section className="relative overflow-hidden bg-linear-to-br from-amber-50 via-white to-amber-50/50">
      <div className="absolute inset-0 bg-grid-amber-100 [mask-image:linear-linear(0deg,white,rgba(255,255,255,0.8))]" />
      
      <div className="container mx-auto px-4 py-4 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left Content */}
          <div className="order-2 lg:order-1">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-amber-100 text-amber-800 mb-6 animate-slideInFromLeft">
              <Shield className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">India's Most Trusted Gold Loan Provider</span>
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 md:mb-6 leading-tight animate-slideInFromLeft">
              Get Instant Cash Against Your{' '}
              <span className="bg-linear-to-r from-amber-700 to-amber-500 bg-clip-text text-transparent">
                Gold
              </span>
            </h1>
            
            <p className="text-md md:text-xl text-gray-600 mb-6 md:mb-8 animate-slideInFromLeft">
              Up to <span className="font-bold text-amber-600">75%</span> of gold value at 
              interest rates starting from <span className="font-bold text-amber-600">0.79% p.m.</span>
              Same day disbursal with 100% safety guarantee.
            </p>
            
            {/* Features Grid with different colors */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6 md:mb-8">

              <div className="animate-slideInFromLeft bg-white p-1 md:p-2 rounded-lg  md:rounded-xl shadow-lg border border-blue-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="relative w-6 h-6 md:w-10 md:h-10 mx-auto mb-2">
                  <div className="absolute inset-0 bg-blue-100 rounded-full"></div>
                  <Zap className="h-6 w-6 md:h-8 md:w-8 pt-1 text-blue-600 relative mx-auto " />
                </div>
                <p className="font-semibold text-gray-800 text-sm md:text-base text-center">30 Min Approval</p>
              </div>
              
              <div className="animate-slideInFromLeft delay-100 bg-white p-1 md:p-2 rounded-lg md:rounded-xl shadow-lg border border-green-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="relative w-6 h-6 md:w-10 md:h-10 mx-auto mb-2">
                  <div className="absolute inset-0 bg-green-100 rounded-full"></div>
                  <TrendingUp className="h-6 w-6 md:h-8 md:w-8 pt-1 text-green-600 relative mx-auto" />
                </div>
                <p className="font-semibold text-gray-800 text-sm md:text-base text-center">Best Rates</p>
              </div>
              
              <div className="animate-slideInFromLeft delay-200 bg-white p-1 md:p-2 rounded-lg md:rounded-xl shadow-lg border border-amber-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="relative w-6 h-6 md:w-10 md:h-10 mx-auto mb-2">
                  <div className="absolute inset-0 bg-amber-100 rounded-full"></div>
                  <Shield className="h-6 w-6 md:h-8 md:w-8 pt-1 text-amber-600 relative mx-auto" />
                </div>
                <p className="font-semibold text-gray-800 text-sm md:text-base text-center">Safe Vault</p>
              </div>
              
              <div className="animate-slideInFromLeft delay-300 bg-white p-1 md:p-2 rounded-lg md:rounded-xl shadow-lg border border-purple-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="relative w-6 h-6 md:w-10 md:h-10 mx-auto mb-2">
                  <div className="absolute inset-0 bg-purple-100 rounded-full"></div>
                  <Clock className="h-6 w-6 md:h-8 md:w-8 pt-1 text-purple-600 relative mx-auto" />
                </div>
                <p className="font-semibold text-gray-800 text-sm md:text-base text-center">Flexible Tenure</p>
              </div>
            </div>
            
            {/* Single CTA Button */}
            <div className="mb-6 md:mb-8 animate-slideInFromLeft delay-400">
              <Link
                href="/apply"
                className="inline-block bg-linear-to-r from-amber-500 to-amber-600 text-white px-8 py-2 md:py-4 rounded-lg md:rounded-xl font-bold text-lg hover:shadow-2xl transition-all hover:scale-105 text-center shadow-xl w-full md:w-auto hover:from-amber-600 hover:to-amber-700 active:scale-95"
              >
                Apply Now - Get Instant Quote
              </Link>
            </div>
            
            {/* Trust Indicators with better visibility */}
            <div className="mt-6 flex flex-wrap items-center gap-4 md:gap-6 text-sm text-gray-600 animate-slideInFromRight">
              <div className="flex items-center bg-white px-3 md:px-4 py-2 md:py-3 rounded-lg md:rounded-xl shadow-md border border-green-200 hover:shadow-lg transition-shadow hover:border-green-300">
                <CheckCircle className="h-5 w-5 text-green-600 mr-3 flex-shrink-0" />
                <span className="font-semibold">No Prepayment Charges</span>
              </div>
              <div className="flex items-center bg-white px-3 md:px-4 py-2 md:py-3 rounded-lg md:rounded-xl shadow-md border border-blue-200 hover:shadow-lg transition-shadow hover:border-blue-300">
                <CheckCircle className="h-5 w-5 text-blue-600 mr-3 flex-shrink-0" />
                <span className="font-semibold">No Hidden Fees</span>
              </div>
              <div className="flex items-center bg-white px-3 md:px-4 py-2 md:py-3 rounded-lg md:rounded-xl shadow-md border border-amber-200 hover:shadow-lg transition-shadow hover:border-amber-300">
                <CheckCircle className="h-5 w-5 text-amber-600 mr-3 flex-shrink-0" />
                <span className="font-semibold">Gold Insurance Included</span>
              </div>
            </div>
          </div>
          
          {/* Right Side - Model Image */}
          <div className="order-1 lg:order-2 relative animate-fadeIn">
            <div className="relative w-full max-w-lg mx-auto lg:max-w-none">
              <div className="relative aspect-square overflow-hidden rounded-2xl transform lg:translate-x-4 ">
                <Image
                  src="/heromodel4.png"
                  alt="Gold Loan Services"
                  fill
                  className='object-contain'
                  priority
                />
                <div className="absolute inset-0 " />
              </div>
              
              
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}