'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { CheckCircle, Phone, MapPin, User, Mail, Calendar, AlertCircle, Building2, Map } from 'lucide-react';
import Swal from 'sweetalert2';

const branches = ['Noida', 'Bhadrak', 'Bhubaneswar', 'Cuttack'];

const stateCityMap = {
  Odisha: ['Bhadrak', 'Bhubaneswar', 'Cuttack', 'Balasore'],
  'Uttar Pradesh': ['Noida', 'Ghaziabad', 'Lucknow', 'Kanpur'],
  Delhi: ['New Delhi', 'North Delhi', 'South Delhi'],
};

const validationSchema = Yup.object({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name cannot exceed 50 characters')
    .required('Full name is required'),
  mobile: Yup.string()
    .matches(/^[6-9]\d{9}$/, 'Enter valid 10-digit mobile number')
    .required('Mobile number is required'),
  dob: Yup.string().required('Date of birth is required'),
  branch: Yup.string().required('Please select nearest branch'),
  state: Yup.string().required('Please select your state'),
  city: Yup.string().required('Please select your city'),
  pin: Yup.string()
    .matches(/^\d{6}$/, 'Enter valid 6-digit PIN code')
    .required('PIN code is required'),
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
      dob: '',
      branch: '',
      state: '',
      city: '',
      pin: '',
      email: '',
    },
    validationSchema,
    onSubmit: async () => {
      setShowOTP(true);
    },
  });

  const availableCities = useMemo(() => {
    return stateCityMap[formik.values.state] || [];
  }, [formik.values.state]);

  useEffect(() => {
    const isValid = /^[6-9]\d{9}$/.test(formik.values.mobile);
    setIsMobileValid(isValid);
  }, [formik.values.mobile]);

  useEffect(() => {
    if (formik.values.city && !availableCities.includes(formik.values.city)) {
      formik.setFieldValue('city', '');
    }
  }, [availableCities, formik.values.city]);

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

  const handleMobileChange = (e) => {
    const sanitized = e.target.value.replace(/\D/g, '').slice(0, 10);
    formik.setFieldValue('mobile', sanitized);
  };

  const handlePinChange = (e) => {
    const sanitized = e.target.value.replace(/\D/g, '').slice(0, 6);
    formik.setFieldValue('pin', sanitized);
  };

  const verifyOTP = async (enteredOtp) => {
    if (enteredOtp === '123456') {
      Swal.fire({
        title: 'Success!',
        text: 'Application submitted successfully!',
        icon: 'success',
        iconColor: '#d97706',
        confirmButtonColor: '#d97706',
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

  const getInputClass = (fieldName) =>
    `w-full rounded-xl border bg-white text-gray-900 placeholder-gray-500 transition-all focus:outline-none ${
      formik.errors[fieldName] && formik.touched[fieldName]
        ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200'
        : 'border-gray-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200'
    }`;

  const renderError = (fieldName) =>
    formik.errors[fieldName] && formik.touched[fieldName] ? (
      <div className="mt-1 flex items-center text-xs text-red-500 md:text-sm">
        <AlertCircle className="mr-1 h-3 w-3 md:h-4 md:w-4" />
        {formik.errors[fieldName]}
      </div>
    ) : null;

  if (showOTP) {
    return (
      <div className="rounded-2xl bg-white p-4 shadow-2xl md:p-8">
        <div className="mb-6 text-center md:mb-8">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-yellow-500 shadow-lg md:h-20 md:w-20">
            <Phone className="h-8 w-8 text-white md:h-10 md:w-10" />
          </div>
          <h3 className="mb-2 text-xl font-bold text-gray-900 md:text-2xl">
            Verify Mobile Number
          </h3>
          <p className="text-sm text-gray-600 md:text-base">
            Enter OTP sent to <span className="font-bold text-amber-600">{formik.values.mobile}</span>
          </p>
          <p className="mt-2 inline-block rounded-lg bg-amber-50 p-2 text-xs text-gray-500 md:text-sm">
            Demo OTP: <span className="font-bold text-amber-600">123456</span>
          </p>
        </div>

        <div className="mb-6 md:mb-8">
          <div className="mb-6 flex justify-center space-x-2 md:space-x-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleOTPChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="h-12 w-12 rounded-xl border-2 border-gray-300 text-center text-xl font-bold text-gray-900 transition-all focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200 md:h-14 md:w-14 md:text-2xl"
              />
            ))}
          </div>

          <button
            onClick={() => verifyOTP(otp.join(''))}
            disabled={otp.some((digit) => digit === '')}
            className={`w-full rounded-xl py-3 text-lg font-bold transition-all md:py-4 ${
              otp.every((digit) => digit !== '')
                ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-white hover:shadow-lg'
                : 'cursor-not-allowed bg-gray-200 text-gray-500'
            }`}
          >
            Verify & Submit Application
          </button>
        </div>

        <div className="space-y-4 text-center">
          <button
            onClick={() => setShowOTP(false)}
            className="mx-auto flex cursor-pointer items-center justify-center font-medium text-gray-600 hover:text-gray-700"
          >
            <svg className="mr-1 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Edit mobile number
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 shadow-2xl">
      <div className="relative overflow-hidden bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 p-5 text-center text-white md:p-8">
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
              backgroundSize: '30px 30px',
            }}
          />
        </div>

        <div className="relative z-10">
          <h2 className="mb-2 text-2xl font-bold md:mb-3 md:text-3xl">
            Apply online for{' '}
            <span className="bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent">
              Gold Loan
            </span>
          </h2>
          <p className="text-base opacity-90 md:text-lg">Share your details and our team will connect with you quickly.</p>
        </div>
      </div>

      <form onSubmit={formik.handleSubmit} className="p-4 md:p-8">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
          <div>
            <label className="mb-2 flex items-center text-sm font-medium text-gray-700 md:text-base">
              <User className="mr-2 h-4 w-4 text-amber-500 md:h-5 md:w-5" />
              Full Name (as per Aadhaar)
            </label>
            <input
              type="text"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter your full name"
              className={`${getInputClass('name')} px-4 py-3`}
            />
            {renderError('name')}
          </div>

          <div>
            <label className="mb-2 flex items-center text-sm font-medium text-gray-700 md:text-base">
              <Phone className="mr-2 h-4 w-4 text-amber-500 md:h-5 md:w-5" />
              Mobile Number
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">+91</span>
              <input
                type="tel"
                name="mobile"
                inputMode="numeric"
                maxLength={10}
                value={formik.values.mobile}
                onChange={handleMobileChange}
                onBlur={formik.handleBlur}
                placeholder="Enter 10-digit mobile number"
                className={`${getInputClass('mobile')} px-4 py-3 pl-14`}
              />
              {isMobileValid && formik.values.mobile && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-green-100 p-1">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
              )}
            </div>
            {renderError('mobile')}
          </div>

          <div>
            <label className="mb-2 flex items-center text-sm font-medium text-gray-700 md:text-base">
              <Calendar className="mr-2 h-4 w-4 text-amber-500 md:h-5 md:w-5" />
              DOB
            </label>
            <input
              type="date"
              name="dob"
              value={formik.values.dob}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`${getInputClass('dob')} px-4 py-3`}
            />
            {renderError('dob')}
          </div>

          <div>
            <label className="mb-2 flex items-center text-sm font-medium text-gray-700 md:text-base">
              <Building2 className="mr-2 h-4 w-4 text-amber-500 md:h-5 md:w-5" />
              Nearest Branch
            </label>
            <select
              name="branch"
              value={formik.values.branch}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`${getInputClass('branch')} px-4 py-3`}
            >
              <option value="">Select nearest branch</option>
              {branches.map((branch) => (
                <option key={branch} value={branch}>
                  {branch}
                </option>
              ))}
            </select>
            {renderError('branch')}
          </div>

          <div>
            <label className="mb-2 flex items-center text-sm font-medium text-gray-700 md:text-base">
              <Map className="mr-2 h-4 w-4 text-amber-500 md:h-5 md:w-5" />
              State
            </label>
            <select
              name="state"
              value={formik.values.state}
              onChange={(e) => {
                formik.handleChange(e);
                formik.setFieldValue('city', '');
              }}
              onBlur={formik.handleBlur}
              className={`${getInputClass('state')} px-4 py-3`}
            >
              <option value="">Select state</option>
              {Object.keys(stateCityMap).map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
            {renderError('state')}
          </div>

          <div>
            <label className="mb-2 flex items-center text-sm font-medium text-gray-700 md:text-base">
              <MapPin className="mr-2 h-4 w-4 text-amber-500 md:h-5 md:w-5" />
              City
            </label>
            <select
              name="city"
              value={formik.values.city}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={!formik.values.state}
              className={`${getInputClass('city')} px-4 py-3 disabled:cursor-not-allowed disabled:bg-gray-100`}
            >
              <option value="">{formik.values.state ? 'Select city' : 'Select state first'}</option>
              {availableCities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
            {renderError('city')}
          </div>

          <div>
            <label className="mb-2 flex items-center text-sm font-medium text-gray-700 md:text-base">
              <MapPin className="mr-2 h-4 w-4 text-amber-500 md:h-5 md:w-5" />
              PIN Code
            </label>
            <input
              type="text"
              name="pin"
              inputMode="numeric"
              maxLength={6}
              value={formik.values.pin}
              onChange={handlePinChange}
              onBlur={formik.handleBlur}
              placeholder="Enter 6-digit PIN"
              className={`${getInputClass('pin')} px-4 py-3`}
            />
            {renderError('pin')}
          </div>

          <div>
            <label className="mb-2 flex items-center text-sm font-medium text-gray-700 md:text-base">
              <Mail className="mr-2 h-4 w-4 text-amber-500 md:h-5 md:w-5" />
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="name@example.com"
              className={`${getInputClass('email')} px-4 py-3`}
            />
            {renderError('email')}
          </div>
        </div>

        <button
          type="submit"
          disabled={!formik.isValid || formik.isSubmitting}
          className={`mt-6 w-full rounded-xl py-3 text-base font-bold shadow-lg transition-all md:mt-8 md:py-4 md:text-lg ${
            !formik.isValid
              ? 'cursor-not-allowed bg-gray-300 text-gray-500 shadow-none'
              : 'bg-gradient-to-r from-amber-400 via-yellow-500 to-orange-500 text-white hover:scale-[1.01] hover:shadow-xl'
          }`}
        >
          {formik.isSubmitting ? (
            <div className="flex items-center justify-center">
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent md:h-5 md:w-5" />
              Submitting...
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <Phone className="mr-2 h-4 w-4 md:h-5 md:w-5" />
              Submit & Get OTP
            </div>
          )}
        </button>

        <div className="mt-4 rounded-xl border border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 p-3 md:mt-6 md:p-4">
          <div className="flex items-start">
            <div className="mr-3 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-green-100 md:h-10 md:w-10">
              <CheckCircle className="h-4 w-4 text-green-600 md:h-5 md:w-5" />
            </div>
            <div>
              <p className="mb-1 text-xs font-medium text-gray-700 md:text-sm">100% Safe & Secure</p>
              <p className="text-xs text-gray-600">
                Your information is encrypted and secure. By submitting, you agree to receive communication from our executives.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
