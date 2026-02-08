"use client"
import React, { useState } from 'react';
import { Copy, Check, Gift, Users, Share2, MessageCircle, Mail, MoreVertical, X, ExternalLink } from 'lucide-react';
import ReferralHistoryModal from '../modals/ReferralHistoryModal';

function ReferBlock() {
  const [copied, setCopied] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const referralUrl = `https://atdmoney.com/ref/ATD${Math.floor(Math.random() * 10000)}`;

  // Mock data - replace with real data
  const referralStats = {
    referrals: 12,
    success: '83%',
    earnings: '₹6,000'
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleShare = (platform) => {
    const message = `Join ATD Money using my referral link and get exclusive rewards! ${referralUrl}`;
    
    switch(platform) {
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
        break;
      case 'email':
        window.open(`mailto:?subject=ATD Money Referral&body=${encodeURIComponent(message)}`, '_blank');
        break;
      case 'sms':
        window.open(`sms:?body=${encodeURIComponent(message)}`, '_blank');
        break;
      default:
        // Web share API
        if (navigator.share) {
          navigator.share({
            title: 'ATD Money Referral',
            text: message,
            url: referralUrl
          });
        } else {
          navigator.clipboard.writeText(message);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }
    }
  };

  return (
    <>
      <div className="relative">
        {/* Main Card */}
        <div className="relative overflow-hidden border-2 border-violet-400 rounded-3xl bg-gradient-to-br from-purple-400 via-purple-400 to-indigo-500 p-4 shadow-2xl">
          
          {/* Logo - Absolute positioned in top right */}
          <div className="absolute top-4 right-4 z-20">
            <img 
              src="/atdlogo.png" 
              alt="ATD Finance Logo" 
              className="w-12 h-12 bg-white rounded-full object-contain drop-shadow-lg"
            />
          </div>

          {/* Abstract Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Floating circles */}
            <div className="absolute bottom-6 right-16 h-16 w-16 rounded-full bg-cyan-300/15 blur-md"></div>
            
            {/* Abstract lines */}
            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 400 200" fill="none">
              <path 
                d="M0,60 Q200,30 400,80 L400,0 L0,0 Z" 
                fill="url(#gradient1)" 
                opacity="0.3"
              />
              <path 
                d="M0,120 Q100,90 200,110 Q300,130 400,100 L400,200 L0,200 Z" 
                fill="url(#gradient2)" 
                opacity="0.2"
              />
              <defs>
                <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.4"/>
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.1"/>
                </linearGradient>
                <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.3"/>
                  <stop offset="100%" stopColor="#0891b2" stopOpacity="0.1"/>
                </linearGradient>
              </defs>
            </svg>
            
            {/* Animated dots */}
            <div className="absolute top-12 right-12 h-2 w-2 rounded-full bg-yellow-300 animate-pulse"></div>
            <div className="absolute bottom-16 left-12 h-1.5 w-1.5 rounded-full bg-pink-300 animate-bounce"></div>
          </div>

          {/* Centered Content Container */}
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12 max-w-4xl w-full">
              
              {/* Left Section */}
              <div className="flex-1 space-y-3">
                
                {/* Header with small gift icon */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="h-10 w-10 md:h-14 md:w-14 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center">
                      <Gift className="h-6 w-6 text-purple-900" />
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
                      Refer & Earn Rewards
                    </h2>
                  </div>
                  
                  {/* Stats Boxes */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className=" bg-linear-to-br from-blue-300 to-blue-500 border border-blue-200 rounded-lg p-1 text-center">
                      <span className="text-base text-white font-medium mt-1">Referrals : </span>
                      <span className="text-lg font-bold text-white">{referralStats.referrals}</span>

                    </div>
                    <div className=" bg-linear-to-br from-emerald-300 to-emerald-500 border border-emerald-200 rounded-lg p-1 text-center">
                      <span className="text-base text-white font-medium mt-1">Success : </span>
                      <span className="text-lg font-bold text-white">{referralStats.success}</span>
                      
                    </div>
                    <div className=" bg-linear-to-br from-amber-300 to-amber-500 border border-amber-200 rounded-lg p-1 text-center">
                    <span className="text-base text-white font-medium mt-1">Earnings : </span>
                    <span className="text-lg font-bold text-white">{referralStats.earnings}</span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-base sm:text-lg font-semibold text-gray-50 leading-relaxed">
                  Help your friends discover & unlock exclusive Rewards for yourself!
                </p>

                {/* Input Section */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-purple-200">
                    Share Your Referral Link
                  </label>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={referralUrl}
                        readOnly
                        className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-300"
                      />
                      <div className="absolute inset-y-0 right-3 flex items-center">
                        <div className="h-6 w-px bg-white/30"></div>
                      </div>
                    </div>
                    <button
                      onClick={handleCopy}
                      className="flex items-center cursor-pointer justify-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-purple-900 font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl whitespace-nowrap"
                    >
                      {copied ? (
                        <>
                          <Check className="h-4 w-4" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4" />
                          Copy Link
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Share Options */}
                <div className="grid grid-cols-2 gap-4">
  <div className="flex">
    <button
      onClick={() => handleShare('more')}
      className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-indigo-700 hover:from-indigo-600 hover:to-indigo-800 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95"
    >
      <Share2 className="h-5 w-5" />
      <span>Share via Link</span>
    </button>
  </div>
{/* View Referrals Button */}
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
                >
                  <Users className="h-5 w-5" />
                  View Your Referrals
                </button>

</div>

                
              </div>

              {/* Right Section - Image with floating dots */}
              <div className="flex-shrink-0">
                <div className="relative">
                  <img 
                    src="/referblock.jpg" 
                    alt="Referral Illustration" 
                    className="h-32 w-32 sm:h-40 sm:w-40 lg:h-54 lg:w-68 object-contain drop-shadow-2xl"
                  />
                  
                  {/* Floating elements around image */}
                  <div className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-pink-400 animate-bounce shadow-lg"></div>
                  <div className="absolute -bottom-2 -left-2 h-4 w-4 rounded-full bg-cyan-400 animate-pulse shadow-lg"></div>
                  <div className="absolute top-1/2 -left-4 h-3 w-3 rounded-full bg-yellow-300 animate-ping"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom gradient line */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600"></div>
        </div>
      </div>

      {/* Referral History Modal */}
      <ReferralHistoryModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        referralStats={referralStats}
      />
    </>
  );
}

export default ReferBlock;