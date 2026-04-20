import * as Yup from 'yup';

const mobileRegex = /^[6-9]\d{9}$/;
const aadhaarRegex = /^[2-9]\d{11}$/;
const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
const pincodeRegex = /^\d{6}$/;
const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;

export const createKYCValidationSchema = ({ isNewUser, sameAsCurrent }) =>
  Yup.object({
    fullName: Yup.string().trim().required('Full name is required'),
    dob: Yup.string().required('Date of birth is required'),
    gender: Yup.string().required('Gender is required'),
    mobile: Yup.string()
      .required('Mobile number is required')
      .matches(mobileRegex, 'Enter valid 10-digit mobile number starting with 6-9'),
    alternatePhone: Yup.string()
      .nullable()
      .test('alt-phone', 'Enter valid 10-digit number starting with 6-9', (value) => {
        if (!value) return true;
        return mobileRegex.test(value);
      }),
    email: Yup.string()
      .required('Email address is required')
      .email('Enter valid email address'),
    
    currentAddress: Yup.object({
      houseNo: Yup.string().required('House/Flat no. is required'),
      addressLine1: Yup.string().required('Address line 1 is required'),
      addressLine2: Yup.string().nullable(),
      state: Yup.string().required('State is required'),
      city: Yup.string().required('City is required'),
      pincode: Yup.string()
        .required('Pincode is required')
        .matches(pincodeRegex, 'Enter valid 6-digit pincode'),
    }),
    
    permanentAddress: Yup.object({
      houseNo: sameAsCurrent 
        ? Yup.string().nullable() 
        : Yup.string().required('House/Flat no. is required'),
      addressLine1: sameAsCurrent 
        ? Yup.string().nullable() 
        : Yup.string().required('Address line 1 is required'),
      addressLine2: Yup.string().nullable(),
      state: sameAsCurrent 
        ? Yup.string().nullable() 
        : Yup.string().required('State is required'),
      city: sameAsCurrent 
        ? Yup.string().nullable() 
        : Yup.string().required('City is required'),
      pincode: sameAsCurrent
        ? Yup.string().nullable()
        : Yup.string().required('Pincode is required').matches(pincodeRegex, 'Enter valid 6-digit pincode'),
    }),
    
    aadharNumber: Yup.string()
      .required('Aadhaar number is required')
      .matches(aadhaarRegex, 'Enter valid 12-digit Aadhaar number starting with 2-9'),
    panNumber: Yup.string()
      .required('PAN number is required')
      .matches(panRegex, 'Enter valid PAN number (e.g., ABCDE1234F)'),
    
    // File validations
    aadharDocument: isNewUser
      ? Yup.mixed().required('Aadhaar front document is required')
      : Yup.mixed().nullable(),
    aadharBackDocument: isNewUser
      ? Yup.mixed().required('Aadhaar back document is required')
      : Yup.mixed().nullable(),
    panDocument: isNewUser
      ? Yup.mixed().required('PAN document is required')
      : Yup.mixed().nullable(),
    livePhoto: isNewUser
      ? Yup.mixed().required('Live photo is required')
      : Yup.mixed().nullable(),
    
    // Nominee - NOW REQUIRED (not optional)
    nominee: Yup.object({
      name: Yup.string().required('Nominee name is required'),
      relation: Yup.string().required('Relation is required'),
      dob: Yup.string().required('Nominee date of birth is required'),
      gender: Yup.string().required('Nominee gender is required'),
      mobile: Yup.string()
        .required('Nominee mobile number is required')
        .matches(mobileRegex, 'Enter valid 10-digit mobile number starting with 6-9'),
      email: Yup.string()
        .nullable()
        .email('Enter valid email address'),
      aadharNumber: Yup.string()
        .required('Nominee Aadhaar number is required')
        .matches(aadhaarRegex, 'Enter valid 12-digit Aadhaar starting with 2-9'),
      panNumber: Yup.string()
        .nullable()
        .test('nominee-pan', 'Enter valid PAN number', (value) => {
          if (!value) return true;
          return panRegex.test(value);
        }),
    }),
    
    accountNumber: Yup.string()
      .required('Account number is required')
      .matches(/^\d{6,18}$/, 'Enter valid account number (6-18 digits)'),
    accountType: Yup.string().required('Account type is required'),
    ifsc: Yup.string()
      .required('IFSC code is required')
      .matches(ifscRegex, 'Enter valid IFSC code'),
    bankName: Yup.string().trim().required('Bank name is required'),
    bankBranch: Yup.string().trim().required('Bank branch is required'),
    accountHolderName: Yup.string().trim().required('Account holder name is required'),
    kycStatus: Yup.string().nullable(),
    remarks: Yup.string().nullable(),
  });