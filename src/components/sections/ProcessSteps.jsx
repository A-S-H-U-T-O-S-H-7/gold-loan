"use client"
import React, { useEffect, useRef, useState } from 'react';
import { 
  FileText, 
  Search, 
  Scale, 
  FileCheck, 
  CreditCard, 
  ShieldCheck,
  CheckCircle,
  Clock,
  MapPin
} from 'lucide-react';
import Link from 'next/link';

export default function ProcessSteps() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);
  const [animatedSteps, setAnimatedSteps] = useState([]);

  const steps = [
    {
      number: '01',
      icon: FileText,
      title: 'Visit Branch',
      description: 'walk into any of our branches',
      color: 'bg-blue-500',
      iconColor: 'text-blue-500',
    },
    {
      number: '02',
      icon: Search,
      title: 'KYC Verification',
      description: 'Quick verification with Aadhaar & PAN (No CIBIL check required)',
      color: 'bg-purple-500',
      iconColor: 'text-purple-500',
    },
    {
      number: '03',
      icon: Scale,
      title: 'Gold Evaluation',
      description: 'Expert appraisal of your gold purity & weight with certificate',
      color: 'bg-amber-500',
      iconColor: 'text-amber-500',
    },
    {
      number: '04',
      icon: FileCheck,
      title: 'Loan Approval',
      description: 'Instant loan offer with amount, interest rate & tenure',
      color: 'bg-green-500',
      iconColor: 'text-green-500',
    },
    {
      number: '05',
      icon: CreditCard,
      title: 'Cash Disbursement',
      description: 'Receive cash instantly via account transfer, UPI or cash',
      color: 'bg-pink-500',
      iconColor: 'text-pink-500',
    },
    {
      number: '06',
      icon: ShieldCheck,
      title: 'Safe Gold Storage',
      description: 'Your gold stored in certified vaults with insurance coverage',
      color: 'bg-gray-700',
      iconColor: 'text-gray-700',
    },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            // Animate steps one by one
            steps.forEach((_, index) => {
              setTimeout(() => {
                setAnimatedSteps(prev => [...prev, index]);
              }, index * 200);
            });
          }
        });
      },
      { 
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  // Helper function to check if step should be animated
  const shouldAnimate = (index) => {
    return animatedSteps.includes(index);
  };

  return (
    <section ref={sectionRef} className="py-6 md:py-8 bg-linear-to-b from-cyan-50 to-cyan-200">
      <div className="container mx-auto px-3 md:px-4">
        {/* Compact Header */}
        <div className="text-center mb-6 md:mb-8">
          <div className="inline-block mb-2">
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
              6 SIMPLE STEPS
            </span>
          </div>
          
          
            <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mb-3">
            Get Your Gold Loan in <span className="text-amber-600">6 Steps</span>
          </h2>
          
          
          <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base">
            Complete process in <span className="font-bold text-amber-600">under 60 minutes</span>
          </p>
        </div>

        {/* Compact Process Container */}
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-3 md:p-5 border border-gray-200">
            
            {/* Desktop View - Compact */}
            <div className="hidden lg:block relative">
              {/* Timeline Line - Thinner */}
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5">
                <div className={`h-full bg-linear-to-b from-blue-500 via-amber-500 to-gray-700 ${isVisible ? 'animate-timelineGrow' : ''}`}></div>
              </div>

              {/* Compact Steps */}
              <div className="space-y-6">
                {steps.map((step, index) => (
                  <div
                    key={step.number}
                    className={`relative flex items-center ${index % 2 === 0 ? 'flex-row-reverse' : ''} ${shouldAnimate(index) ? 'animate-stepFadeIn' : 'opacity-0'}`}
                    style={{ animationDelay: `${index * 200}ms` }}
                  >
                    {/* Step Content - Compact */}
                    <div className={`w-5/12 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8'}`}>
                      <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-lg hover:shadow-sm transition-all duration-300 group">
                        {/* Compact Header */}
                        <div className={`flex items-start ${index % 2 === 0 ? 'flex-row-reverse' : ''} gap-2`}>
                          <div className={`w-10 h-10 ${step.color} rounded-lg flex items-center justify-center shadow-sm`}>
                            <step.icon className="h-4 w-4 text-white" />
                          </div>
                          <div className={`flex-1 ${index % 2 === 0 ? 'pr-2' : 'pl-2'}`}>
                            <div className="flex items-center gap-1 mb-0.5">
                              <span className="font-bold text-gray-400 text-sm">{step.number}</span>
                              <h3 className="text-lg font-bold text-gray-900 leading-tight">{step.title}</h3>
                            </div>
                            <p className="text-gray-600 text-sm leading-snug">{step.description}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Timeline Node - Smaller */}
                    <div className="absolute left-1/2 transform -translate-x-1/2">
                      <div className={`w-10 h-10 ${step.color} rounded-full flex items-center justify-center shadow-sm border-3 border-white ${shouldAnimate(index) ? 'animate-stepPop' : ''}`}
                           style={{ animationDelay: `${index * 200}ms` }}>
                        <step.icon className="h-4 w-4 text-white" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile View - Compact */}
            <div className="lg:hidden">
              <div className="relative">
                {/* Timeline Line for Mobile */}
                <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-linear-to-b from-blue-500 via-amber-500 to-gray-700">
                  <div className={`h-full ${isVisible ? 'animate-timelineGrow' : ''}`}></div>
                </div>

                {/* Mobile Steps - Compact */}
                <div className="space-y-3 pl-10">
                  {steps.map((step, index) => (
                    <div
                      key={step.number}
                      className={`bg-white rounded-lg p-3 border border-gray-100 shadow-lg hover:shadow-sm transition-all duration-300 ${shouldAnimate(index) ? 'animate-stepFadeIn' : 'opacity-0'}`}
                      style={{ animationDelay: `${index * 200}ms` }}
                    >
                      {/* Step Number & Icon */}
                      <div className="absolute -left-6 top-1/2 transform -translate-y-1/2">
                        <div className={`w-8 h-8 ${step.color} rounded-full flex items-center justify-center shadow-sm border-2 border-white ${shouldAnimate(index) ? 'animate-stepPop' : ''}`}
                             style={{ animationDelay: `${index * 200}ms` }}>
                          <span className="text-white font-bold text-xs">{step.number}</span>
                        </div>
                      </div>

                      {/* Step Content */}
                      <div className="flex items-start gap-2">
                        <div className={`w-8 h-8 ${step.color} rounded flex items-center justify-center shadow-xs flex-shrink-0`}>
                          <step.icon className="h-3.5 w-3.5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-bold text-gray-900 mb-0.5">{step.title}</h3>
                          <p className="text-gray-600 text-xs leading-snug">{step.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Compact CTA Section */}
          <div className={`mt-6 text-center ${isVisible ? 'animate-fadeIn' : 'opacity-0'}`}
               style={{ animationDelay: '1400ms' }}>
            {/* Compact Time Indicator */}
            <div className="mb-4">
              <div className="inline-flex items-center px-4 py-2 bg-linear-to-r from-teal-400 to-emerald-500 text-white rounded-full font-semibold text-sm shadow-md">
                <Clock className="h-3.5 w-3.5 mr-1.5" />
                <span>Complete in Under 60 Minutes</span>
              </div>
            </div>
            
            {/* Compact Buttons */}
            <div className="flex flex-col  sm:flex-row gap-2 justify-center items-center mb-4">
              <Link href="/apply">
              <button className="px-5 py-2.5 cursor-pointer bg-linear-to-r from-amber-500 to-amber-600 text-white rounded-lg font-semibold text-sm shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-1.5">
                <FileText className="h-4 w-4" />
                Apply Online Now
              </button>
              </Link>
              <button className="px-5 py-2.5 bg-linear-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold text-sm shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-1.5">
                <MapPin className="h-4 w-4" />
                Find Nearest Branch
              </button>
            </div>
            
            {/* Compact Additional Info */}
            <div className="mt-4 pt-3 border-t border-gray-200">
              <div className="flex flex-wrap justify-center gap-2 text-xs text-gray-600">
                <span className="flex items-center gap-1 px-2 py-1 bg-green-50 rounded">
                  <CheckCircle className="h-3 w-3 text-green-600" />
                  No CIBIL check
                </span>
                <span className="flex items-center gap-1 px-2 py-1 bg-blue-50 rounded">
                  <CheckCircle className="h-3 w-3 text-blue-600" />
                  Lowest rates
                </span>
                <span className="flex items-center gap-1 px-2 py-1 bg-purple-50 rounded">
                  <CheckCircle className="h-3 w-3 text-purple-600" />
                  100% Transparent
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}