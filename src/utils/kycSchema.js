import * as Yup from 'yup';

const mobileRegex = /^[6-9]\d{9}$/;
const aadhaarRegex = /^[2-9]\d{11}$/;
const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
const pincodeRegex = /^\d{6}$/;

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
      .nullable()
      .test('email', 'Enter valid email address', (value) => {
        if (!value) return true;
        return Yup.string().email().isValidSync(value);
      }),
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
      houseNo: sameAsCurrent ? Yup.string().nullable() : Yup.string().required('House/Flat no. is required'),
      addressLine1: sameAsCurrent ? Yup.string().nullable() : Yup.string().required('Address line 1 is required'),
      addressLine2: Yup.string().nullable(),
      state: sameAsCurrent ? Yup.string().nullable() : Yup.string().required('State is required'),
      city: sameAsCurrent ? Yup.string().nullable() : Yup.string().required('City is required'),
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
    aadharDocument: isNewUser
      ? Yup.mixed().required('Aadhaar document is required')
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
    nominee: Yup.object({
      name: Yup.string().nullable(),
      relation: Yup.string().test('nominee-relation', 'Relation is required', function (value) {
        if (!this.parent?.name?.trim()) return true;
        return Boolean(value);
      }),
      dob: Yup.string().test('nominee-dob', 'Nominee date of birth is required', function (value) {
        if (!this.parent?.name?.trim()) return true;
        return Boolean(value);
      }),
      gender: Yup.string().nullable(),
      mobile: Yup.string().test('nominee-mobile', 'Enter valid 10-digit mobile starting with 6-9', (value) => {
        if (!value) return true;
        return mobileRegex.test(value);
      }),
      email: Yup.string()
        .nullable()
        .test('nominee-email', 'Enter valid email address', (value) => {
          if (!value) return true;
          return Yup.string().email().isValidSync(value);
        }),
      aadharNumber: Yup.string().test('nominee-aadhaar', 'Enter valid 12-digit Aadhaar starting with 2-9', function (value) {
        if (!this.parent?.name?.trim()) return true;
        return aadhaarRegex.test(value || '');
      }),
      panNumber: Yup.string().nullable(),
    }),
    accountNumber: Yup.string().nullable(),
    accountType: Yup.string().nullable(),
    ifsc: Yup.string().nullable(),
    bankName: Yup.string().nullable(),
    bankBranch: Yup.string().nullable(),
    accountHolderName: Yup.string().nullable(),
    kycStatus: Yup.string().nullable(),
    remarks: Yup.string().nullable(),
  });

