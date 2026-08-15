import * as Yup from 'yup';

export const applicationValidationSchema = Yup.object({
  // ============================================
  // PERSONAL DETAILS
  // ============================================
  name: Yup.string().required('Full Name is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  phoneNo: Yup.string()
    .required('Phone No is required')
    .matches(/^[0-9]{10}$/, 'Phone No must be 10 digits'),
  alternativePhone: Yup.string()
    .matches(/^[0-9]{10}$/, 'Alternative Phone must be 10 digits')
    .nullable(),
  gender: Yup.string().required('Gender is required'),
  dob: Yup.object({
    day: Yup.string().required('Day is required'),
    month: Yup.string().required('Month is required'),
    year: Yup.string().required('Year is required'),
  }),
  personalRemark: Yup.string().nullable(),

  // ============================================
  // ADDRESS - CURRENT
  // ============================================
  currentHouseNo: Yup.string().required('House/Building No is required'),
  currentAddress: Yup.string().required('Address is required'),
  currentState: Yup.string().required('State is required'),
  currentCity: Yup.string().required('City is required'),
  currentPinCode: Yup.string()
    .required('Pin Code is required')
    .matches(/^[0-9]{6}$/, 'Pin Code must be 6 digits'),
  currentAddressType: Yup.string().required('Address Type is required'),
  currentRemark: Yup.string().nullable(),

  // ============================================
  // ADDRESS - PERMANENT
  // ============================================
  permanentHouseNo: Yup.string().required('House/Building No is required'),
  permanentAddress: Yup.string().required('Address is required'),
  permanentState: Yup.string().required('State is required'),
  permanentCity: Yup.string().required('City is required'),
  permanentPinCode: Yup.string()
    .required('Pin Code is required')
    .matches(/^[0-9]{6}$/, 'Pin Code must be 6 digits'),
  permanentAddressType: Yup.string().required('Address Type is required'),
  permanentRemark: Yup.string().nullable(),

  // ============================================
  // BANK DETAILS
  // ============================================
  bankName: Yup.string().required('Bank Name is required'),
  branchName: Yup.string().required('Branch Name is required'),
  accountType: Yup.string().required('Account Type is required'),
  accountNo: Yup.string().required('Account Number is required'),
  ifscCode: Yup.string()
    .required('IFSC Code is required')
    .matches(/^[A-Z]{4}0[A-Z0-9]{6}$/, 'Invalid IFSC Code'),
  bankRemark: Yup.string().nullable(),

  // ============================================
  // DOCUMENT UPLOAD
  // ============================================
  aadhaarFront: Yup.mixed().required('Aadhaar Front is required'),
  aadhaarBack: Yup.mixed().required('Aadhaar Back is required'),
  panCard: Yup.mixed().required('PAN Card is required'),
  photo: Yup.mixed().required('Photo is required'),
  addressProof: Yup.mixed().required('Current Address Proof is required'),

  // ============================================
  // NOMINEE DETAILS
  // ============================================
  nomineeName: Yup.string().nullable(),
  nomineeRelation: Yup.string().nullable(),
  nomineeMobile: Yup.string()
    .matches(/^[0-9]{10}$/, 'Mobile must be 10 digits')
    .nullable(),
  nomineeEmail: Yup.string()
    .email('Invalid email address')
    .nullable(),
  nomineeAddress: Yup.string().nullable(),
  nomineeRemark: Yup.string().nullable(),

  // ============================================
  // GUARANTOR DETAILS
  // ============================================
  guarantorName: Yup.string().nullable(),
  guarantorRelation: Yup.string().nullable(),
  guarantorMobile: Yup.string()
    .matches(/^[0-9]{10}$/, 'Mobile must be 10 digits')
    .nullable(),
  guarantorEmail: Yup.string()
    .email('Invalid email address')
    .nullable(),
  guarantorAddress: Yup.string().nullable(),
  guarantorRemark: Yup.string().nullable(),
});