'use client';

import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { CheckCircle, Phone, MapPin, User, Mail, Calendar, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import Swal from 'sweetalert2';

const cities = [
  'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 
  'Kolkata', 'Ahmedabad', 'Pune', 'Jaipur', 'Lucknow',
  'Chandigarh', 'Indore', 'Bhopal', 'Patna', 'Guwahati'
];

const validationSchema = Yup.object({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name cannot exceed 50 characters')
    .required('Full name is required'),
  mobile: Yup.string()
    .matches(/^[6-9]\d{9}$/, 'Enter valid 10-digit Indian mobile number')
    .required('Mobile number is required'),
  city: Yup.string().required('Please select your city'),
  age: Yup.number()
    .min(18, 'Must be at least 18 years old')
    .max(75, 'Maximum age is 75 years')
    .required('Age is required'),
  email: Yup.string()
    .email('Enter a valid email address')
    .required('Email is required'), 
});

export default function ApplyFormComponent() {
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isMobileValid, setIsMobileValid] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: '',
      mobile: '',
      city: '',
      age: '',
      email: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      setShowOTP(true);
      // await axios.post('/api/send-otp', { mobile: values.mobile });
    },
  });

  // Check mobile validation on change
  useEffect(() => {
    const isValid = /^[6-9]\d{9}$/.test(formik.values.mobile);
    setIsMobileValid(isValid);
  }, [formik.values.mobile]);

  const handleOTPChange = (index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const verifyOTP = async (enteredOtp) => {
    if (enteredOtp === '123456') { // Demo OTP
      // Show SweetAlert2 confirmation
      Swal.fire({
        title: 'Success!',
        text: 'Application submitted successfully!',
        icon: 'success',
        iconColor: '#10b981',
        confirmButtonColor: '#10b981',
        confirmButtonText: 'OK',
        customClass: {
          popup: 'rounded-2xl',
          title: 'text-2xl font-bold text-gray-900',
          confirmButton: 'px-6 py-3 rounded-xl font-bold'
        }
      });
      
      setShowOTP(false);
      formik.resetForm();
      setOtp(['', '', '', '', '', '']);
    } else {
      Swal.fire({
        title: 'Error!',
        text: 'Invalid OTP. Try 123456 for demo',
        icon: 'error',
        confirmButtonColor: '#ef4444',
        confirmButtonText: 'Try Again',
        customClass: {
          popup: 'rounded-2xl',
          title: 'text-2xl font-bold text-gray-900'
        }
      });
    }
  };

  if (showOTP) {
    return (
      <div className="bg-white rounded-2xl p-4 md:p-8 shadow-2xl">
        <div className="text-center mb-6 md:mb-8">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-primary-500 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Phone className="h-8 w-8 md:h-10 md:w-10 text-white" />
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
            Verify Mobile Number
          </h3>
          <p className="text-gray-600 text-sm md:text-base">
            Enter OTP sent to <span className="font-bold text-primary-600">{formik.values.mobile}</span>
          </p>
          <p className="text-xs md:text-sm text-gray-500 mt-2 bg-amber-50 p-2 rounded-lg inline-block">
            Demo OTP: <span className="font-bold text-amber-600">123456</span>
          </p>
        </div>

        <div className="mb-6 md:mb-8">
          <div className="flex justify-center space-x-2 md:space-x-3 mb-6">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleOTPChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-12 md:w-14 md:h-14 text-center text-xl md:text-2xl font-bold border-2 border-gray-300 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none transition-all text-gray-900"
              />
            ))}
          </div>

          <button
            onClick={() => verifyOTP(otp.join(''))}
            disabled={otp.some(digit => digit === '')}
            className={`w-full py-3 md:py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-[1.02] ${
              otp.every(digit => digit !== '') 
                ? 'bg-gradient-to-r from-amber-300 to-amber-500 text-white hover:shadow-lg' 
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            Verify & Submit Application
          </button>
        </div>

        <div className="text-center space-y-4">
          <button
            onClick={() => setShowOTP(false)}
            className="text-gray-600 cursor-pointer hover:text-gray-700 font-medium flex items-center justify-center mx-auto"
          >
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Edit mobile number
          </button>
          <p className="text-sm text-gray-500">
            Didn't receive OTP?{' '}
            <button className="text-primary-600 hover:text-primary-700 font-medium">
              Resend OTP
            </button>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
      {/* Header with Gradient */}
      <div className="relative bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white p-4 md:p-8 text-center overflow-hidden">
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '30px 30px'
          }}></div>
        </div>
        
        <div className="relative z-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-2 md:mb-3">
            Apply online for{' '}
            <span className="bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent">
              Gold Loan
            </span>
          </h2>
          <p className="opacity-90 text-base md:text-lg">Complete in 30 seconds. No documents needed now.</p>
        </div>
      </div>

      <form onSubmit={formik.handleSubmit} className="p-4 md:p-8">
        {/* Grid for Name and Phone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-6">
          {/* Full Name */}
          <div>
            <label className="flex items-center text-gray-700 font-medium mb-2 text-sm md:text-base">
              <User className="h-4 w-4 md:h-5 md:w-5 mr-2 text-primary-500" />
              Full Name (as per Aadhaar)
            </label>
            <div className="relative">
              <input
                type="text"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter your full name"
                className={`w-full px-4 py-3 pl-10 md:pl-12 rounded-lg border bg-white text-gray-900 placeholder-gray-500 ${
                  formik.errors.name && formik.touched.name 
                    ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200' 
                    : 'border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200'
                } focus:outline-none transition-all`}
              />
              <div className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                <User className="h-4 w-4 md:h-5 md:w-5" />
              </div>
            </div>
            {formik.errors.name && formik.touched.name && (
  <div className="text-red-500 text-xs md:text-sm mt-1 flex items-center">
    <AlertCircle className="w-3 h-3 md:w-4 md:h-4 mr-1" />
    {formik.errors.name}
  </div>
)}
          </div>

          {/* Mobile Number */}
          <div>
            <label className="flex items-center text-gray-700 font-medium mb-2 text-sm md:text-base">
              <Phone className="h-4 w-4 md:h-5 md:w-5 mr-2 text-primary-500" />
              Mobile Number
            </label>
            <div className="relative">
              <div className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm md:text-base">
                +91
              </div>
              <input
                type="tel"
                name="mobile"
                value={formik.values.mobile}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="98765 43210"
                className={`w-full px-4 py-3 pl-14 md:pl-16 rounded-lg border bg-white text-gray-900 placeholder-gray-500 ${
                  formik.errors.mobile && formik.touched.mobile 
                    ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200' 
                    : 'border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200'
                } focus:outline-none transition-all`}
              />
              {/* Show tick only when mobile is valid */}
              {isMobileValid && formik.values.mobile && (
                <div className="absolute right-3 md:right-4 top-1/2 transform -translate-y-1/2">
                  <div className="w-5 h-5 md:w-6 md:h-6 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 md:w-4 md:h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              )}
            </div>
            {formik.errors.mobile && formik.touched.mobile && (
  <div className="text-red-500 text-xs md:text-sm mt-1 flex items-center">
    <AlertCircle className="w-3 h-3 md:w-4 md:h-4 mr-1" />
    {formik.errors.mobile}
  </div>
)}
            <p className="text-xs text-gray-500 mt-1 md:mt-2">
              We'll send OTP for verification
            </p>
          </div>
        </div>

        {/* Grid for Age and City */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-6">
          {/* Age */}
          <div>
            <label className="flex items-center text-gray-700 font-medium mb-2 text-sm md:text-base">
              <Calendar className="h-4 w-4 md:h-5 md:w-5 mr-2 text-primary-500" />
              Age
            </label>
            <div className="relative">
              <input
                type="number"
                name="age"
                min="18"
                max="75"
                value={formik.values.age}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter your age"
                className={`w-full px-4 py-3 pl-10 md:pl-12 rounded-lg border bg-white text-gray-900 placeholder-gray-500 ${
                  formik.errors.age && formik.touched.age 
                    ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200' 
                    : 'border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200'
                } focus:outline-none transition-all`}
              />
              <div className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                <Calendar className="h-4 w-4 md:h-5 md:w-5" />
              </div>
            </div>
            {formik.errors.age && formik.touched.age && (
  <div className="text-red-500 text-xs md:text-sm mt-1 flex items-center">
    <AlertCircle className="w-3 h-3 md:w-4 md:h-4 mr-1" />
    {formik.errors.age}
  </div>
)}
            <p className="text-xs text-gray-500 mt-1 md:mt-2">
              Must be between 18-75 years
            </p>
          </div>

          {/* City */}
          <div>
            <label className="flex items-center text-gray-700 font-medium mb-2 text-sm md:text-base">
              <MapPin className="h-4 w-4 md:h-5 md:w-5 mr-2 text-primary-500" />
              City / Location
            </label>
            <div className="relative">
              <select
                name="city"
                value={formik.values.city}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full px-4 py-3 pl-10 md:pl-12 rounded-lg border bg-white text-gray-900 appearance-none ${
                  formik.errors.city && formik.touched.city 
                    ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200' 
                    : 'border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200'
                } focus:outline-none transition-all`}
              >
                <option value="" className="text-gray-500">Select your city</option>
                {cities.map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
              <div className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                <MapPin className="h-4 w-4 md:h-5 md:w-5" />
              </div>
              <div className="absolute right-3 md:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            {formik.errors.city && formik.touched.city && (
  <div className="text-red-500 text-xs md:text-sm mt-1 flex items-center">
    <AlertCircle className="w-3 h-3 md:w-4 md:h-4 mr-1" />
    {formik.errors.city}
  </div>
)}
          </div>
        </div>

        {/* Email (Full Width) */}
        <div className="mb-6 md:mb-8">
          <label className="flex items-center text-gray-700 font-medium mb-2 text-sm md:text-base">
            <Mail className="h-4 w-4 md:h-5 md:w-5 mr-2 text-primary-500" />
            Email Address
          </label>
          <div className="relative">
            <input
              type="email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="name@example.com"
              className={`w-full px-4 py-3 pl-10 md:pl-12 rounded-lg border bg-white text-gray-900 placeholder-gray-500 ${
                formik.errors.email && formik.touched.email 
                  ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200' 
                  : 'border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200'
              } focus:outline-none transition-all`}
            />
            <div className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
              <Mail className="h-4 w-4 md:h-5 md:w-5" />
            </div>
          </div>
          {formik.errors.email && formik.touched.email && (
  <div className="text-red-500 text-xs md:text-sm mt-1 flex items-center">
    <AlertCircle className="w-3 h-3 md:w-4 md:h-4 mr-1" />
    {formik.errors.email}
  </div>
)}
          <p className="text-xs text-gray-500 mt-1 md:mt-2">
            For loan documents and updates
          </p>
        </div>

        {/* Submit Button - Improved Design */}
        <button
          type="submit"
          disabled={!formik.isValid || formik.isSubmitting}
          className={`w-full cursor-pointer py-3 md:py-4 rounded-xl font-bold text-base md:text-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl ${
            !formik.isValid 
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none' 
              : 'bg-gradient-to-r from-amber-300 via-primary-600 to-amber-500 text-white'
          }`}
        >
          {formik.isSubmitting ? (
            <div className="flex items-center justify-center">
              <div className="w-4 h-4 md:w-5 md:h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Submitting...
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <Phone className="h-4 w-4 md:h-5 md:w-5 mr-2" />
              Submit & Get OTP
            </div>
          )}
        </button>

        {/* Privacy Note */}
        <div className="mt-4 md:mt-6 p-3 md:p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
          <div className="flex items-start">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
              <CheckCircle className="h-4 w-4 md:h-5 md:w-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs md:text-sm text-gray-700 font-medium mb-1">100% Safe & Secure</p>
              <p className="text-xs text-gray-600">
                Your information is encrypted and secure. We'll never share your details without permission.
                By submitting, you agree to receive communication from our executives.
              </p>
            </div>
          </div>
        </div>

       
      </form>
    </div>
  );
}