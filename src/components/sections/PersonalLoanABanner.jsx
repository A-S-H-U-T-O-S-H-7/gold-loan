"use client"
import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { ArrowRight, Zap, Shield, Clock, TrendingUp, Sparkles } from 'lucide-react';

export default function PersonalLoanBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
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

  return (
    <section ref={sectionRef} className="relative w-full min-h-[400px] md:h-[300px] overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-500">
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-700/20 via-transparent to-purple-700/20 animate-pulse"></div>
        
        {/* Floating particles */}
        <div className="absolute inset-0">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="absolute w-3 h-3 md:w-4 md:h-4 bg-white/20 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>

        {/* Pattern overlay */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)"/>
          </svg>
        </div>
      </div>

      <div className="container mx-auto h-full px-4 md:px-6 relative z-10 py-4 md:py-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 h-full items-center gap-4 md:gap-0">
          {/* Left Content */}
          <div className={`${isVisible ? 'animate-slideInFromLeft' : 'opacity-0'}`}>
            {/* Badge */}
            <div className="inline-flex items-center bg-white/20 backdrop-blur-sm px-3 py-1 md:px-4 md:py-1.5 rounded-full mb-2 md:mb-3">
              <Sparkles className="h-3 w-3 md:h-4 md:w-4 text-white mr-1.5 md:mr-2" />
              <span className="text-white text-xs md:text-sm font-semibold">Exclusive Offer</span>
            </div>
            
            {/* Main Heading */}
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-1 md:mb-2 leading-tight">
              Empower your goals with{' '}
              <span className="block md:inline bg-gradient-to-r from-yellow-300 to-amber-300 bg-clip-text text-transparent">
                Personal Loan
              </span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-white/90 text-sm md:text-base lg:text-lg mb-3 md:mb-4">
              Loans in minutes — only with <span className="font-bold text-yellow-300">ATD Money</span>
            </p>

            {/* Loan Amount Range */}
            <div className="mb-3 md:mb-4">
              <div className="flex flex-wrap items-center gap-1 md:gap-2 mb-1">
                <span className="text-white text-xs md:text-sm font-medium">Loan Amount Range</span>
                <div className="text-yellow-300 font-bold text-base md:text-lg">
                  ₹3,000 - ₹50,000
                </div>
              </div>
              
              {/* Features */}
              <div className="flex flex-wrap gap-1.5 md:gap-2">
                <div className="flex items-center text-white/90">
                  <Zap className="h-3 w-3 md:h-4 md:w-4 text-yellow-300 mr-1" />
                  <span className="text-xs md:text-sm">Instant Approval</span>
                </div>
                <div className="flex items-center text-white/90">
                  <Shield className="h-3 w-3 md:h-4 md:w-4 text-yellow-300 mr-1" />
                  <span className="text-xs md:text-sm">No Collateral</span>
                </div>
                <div className="flex items-center text-white/90">
                  <Clock className="h-3 w-3 md:h-4 md:w-4 text-yellow-300 mr-1" />
                  <span className="text-xs md:text-sm">Flexible Tenure</span>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="flex gap-2 md:gap-3">
              <button className={`bg-gradient-to-r from-yellow-400 to-amber-500 text-gray-900 px-4 py-2 md:px-5 md:py-2.5 rounded-lg font-bold text-sm md:text-base flex items-center hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 ${isVisible ? 'animate-fadeIn' : 'opacity-0'}`}>
                Apply Now
                <ArrowRight className="h-3 w-3 md:h-4 md:w-4 ml-1.5" />
              </button>
              <button className={`bg-white/20 backdrop-blur-sm text-white px-3 py-2 md:px-4 md:py-2.5 rounded-lg font-bold text-sm md:text-base flex items-center hover:bg-white/30 transition-all duration-300 ${isVisible ? 'animate-fadeIn' : 'opacity-0'}`}>
                Learn More
              </button>
            </div>
          </div>

          {/* Right Side - Model Image with Animation - MOBILE FIX */}
          <div className={`relative flex justify-center items-center h-full md:h-full ${isVisible ? 'animate-slideInFromRight' : 'opacity-0'}`}>
            <div className="relative w-full h-[200px] md:h-full max-w-md">
              <div className="absolute inset-0 bg-gradient-to-l from-blue-600/20 to-purple-600/20 rounded-xl md:rounded-l-2xl"></div>
              <div className="relative h-full w-full">
                <Image
                  src="/adsmodel.png"
                  alt="Personal Loan - ATD Money"
                  fill
                  className="object-contain scale-130 md:scale-110 mt-0 md:mt-5 object-center md:object-right"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add CSS animations */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }
        
        .animate-float {
          animation: float linear infinite;
        }
        
        @keyframes slideInFromLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slideInFromRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        .animate-slideInFromLeft {
          animation: slideInFromLeft 0.8s ease-out forwards;
        }
        
        .animate-slideInFromRight {
          animation: slideInFromRight 0.8s ease-out forwards;
        }
        
        .animate-fadeIn {
          animation: fadeIn 1s ease-out 0.5s forwards;
        }
      `}</style>
    </section>
  );
}