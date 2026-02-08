import { ArrowRight, ShieldCheck, Smartphone } from 'lucide-react';
import Image from 'next/image';

export default function LoginPage() {
  return (
    <div className='bg-white flex justify-center'>
    <div className="min-h-screen max-w-[375px] bg-gradient-to-b from-emerald-50 to-teal-50 flex flex-col p-4">
      {/* Header Section - Top 20% */}
      <header className="flex-1 flex flex-col items-center justify-center pt-6">
        <div className="relative w-16 h-16 mb-4">
          {/* Logo Container - Replace with actual logo */}
          <div >
            <Image 
  src="/atdlogo.png" 
  alt="ATD MONEY Logo"
  width={64}
  height={64}
  className="mb-2"
/>
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          ATD <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">MONEY</span>
        </h1>
        
        <p className="text-gray-600 mb-2 text-sm">
          Fast & Secure Payday Loans
        </p>
      </header>

      {/* Login Card Area - Middle 50% */}
      <main className="flex-2 flex flex-col justify-center">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          {/* Login Title */}
          <div className="mb-6">
            <h2 className="text-xl flex justify-center font-semibold text-gray-900">
              Login to your account
            </h2>
            <p className="text-gray-500 flex justify-center text-sm mt-1">
              Enter your mobile number to continue
            </p>
          </div>

          {/* Mobile Number Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mobile Number
            </label>
            <div className="flex items-center h-13">
              <div className="flex items-center justify-center h-full px-4 bg-gray-50 border border-r-0 border-gray-300 rounded-l-xl">
                <span className="text-gray-700 font-medium">+91</span>
              </div>
              <input
                type="tel"
                placeholder="Enter mobile number"
                className="flex-1 text-gray-900 h-full px-4 border border-gray-300 rounded-r-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                maxLength="10"
                inputMode="numeric"
              />
            </div>
          </div>

          {/* Get OTP Button */}
          <button className="w-full h-10 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-lg flex items-center justify-center gap-2 mb-3 hover:opacity-95 transition-opacity active:scale-[0.98]">
            <Smartphone size={20} />
            Get OTP
            <ArrowRight size={18} />
          </button>

          {/* Divider */}
          <div className="flex items-center justify-center mb-3">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="px-4 text-sm text-gray-500">or</span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>

          <p className="text-center text-sm text-gray-600 mb-3 font-medium">
            New to our family? Join us today! 🎉
          </p>


          {/* Create New Account Button */}
          <button className="w-full h-10 border-2 border-emerald-500 text-emerald-600 font-semibold rounded-lg flex items-center justify-center gap-2 hover:bg-emerald-50 transition-colors active:scale-[0.98]">
            <ShieldCheck size={20} />
            Create New Account
          </button>
        </div>
      </main>

      {/* Footer - Bottom 30% */}
      <footer className="flex-1 flex flex-col justify-end pb-8">
        <div className="text-center text-xs text-gray-600">
          <p className="mb-4">
            By continuing, you agree to our{' '}
            <a href="#" className="text-emerald-600 font-medium hover:underline">
              Terms & Conditions
            </a>{' '}
            and{' '}
            <a href="#" className="text-emerald-600 font-medium hover:underline">
              Privacy Policy
            </a>
          </p>
          
          {/* Security Badge */}
          <div className="flex items-center justify-center gap-2 text-emerald-700">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <ShieldCheck size={16} />
            </div>
            <span className="text-xs font-medium">Bank-level Security</span>
          </div>
        </div>
      </footer>
    </div>
    </div>
  );
}