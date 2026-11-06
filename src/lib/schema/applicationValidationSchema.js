import * as Yup from 'yup';

const fileField = () => Yup.mixed()
  .required('Document is required')
  .test('type', 'Use a JPG, PNG or PDF', (value) => !value || typeof value === 'string' || ['image/jpeg', 'image/png', 'application/pdf'].includes(value.type))
  .test('size', 'File must be 5 MB or less', (value) => !value || typeof value === 'string' || (value.size > 0 && value.size <= 5 * 1024 * 1024));

const optionalPattern = (pattern, message) => Yup.string().test('optional-format', message, (value) => !value || pattern.test(value));

// Letters with spaces, dots, apostrophes and hyphens, e.g. "R. K. D'Souza-Rao"; must contain a letter.
const ACCOUNT_HOLDER_PATTERN = /^(?=.*[A-Za-z])[A-Za-z .'-]+$/;
const ACCOUNT_HOLDER_MESSAGE = 'Account holder name can contain only letters, spaces, dots, apostrophes and hyphens';

const ACCOUNT_MISMATCH_MESSAGE = 'Account numbers do not match';

const normalise = (value) => (typeof value === 'string' ? value.trim().toLowerCase() : '');

// Nominee and guarantor contacts must not repeat the customer's; matching each other is allowed.
function notCustomerPhone(schema, label) {
  return schema.test('not-customer-phone', `${label} mobile must be different from the customer's number`, function check(value) {
    const phone = normalise(value);
    return !phone || ![this.parent.phoneNo, this.parent.alternativePhone].map(normalise).includes(phone);
  });
}

function notCustomerEmail(schema, label) {
  return schema.test('not-customer-email', `${label} email must be different from the customer's email`, function check(value) {
    const email = normalise(value);
    return !email || email !== normalise(this.parent.email);
  });
}

export const draftKycValidationSchema = Yup.object({
  email: optionalPattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email address'),
  phoneNo: optionalPattern(/^[6-9]\d{9}$/, 'Enter a valid mobile number'),
  alternativePhone: optionalPattern(/^[6-9]\d{9}$/, 'Enter a valid alternative number'),
  pan: optionalPattern(/^[A-Z]{5}[0-9]{4}[A-Z]$/, 'Enter a valid PAN number'),
  aadhaar: optionalPattern(/^[0-9]{12}$/, 'Aadhaar number must have 12 digits'),
  currentPinCode: optionalPattern(/^\d{6}$/, 'Pin Code must be 6 digits'),
  permanentPinCode: optionalPattern(/^\d{6}$/, 'Pin Code must be 6 digits'),
  ifscCode: optionalPattern(/^[A-Z]{4}0[A-Z0-9]{6}$/, 'Invalid IFSC Code'),
  accountHolderName: optionalPattern(ACCOUNT_HOLDER_PATTERN, ACCOUNT_HOLDER_MESSAGE),
  // Saved numbers count as confirmed when the KYC reopens, so a draft must confirm any number it saves.
  confirmAccountNo: Yup.string().test('matches-account-no', ACCOUNT_MISMATCH_MESSAGE, function check(value) {
    const accountNo = (this.parent.accountNo || '').trim();
    return !accountNo || (value || '').trim() === accountNo;
  }),
  nomineeMobile: notCustomerPhone(optionalPattern(/^[6-9]\d{9}$/, 'Invalid nominee mobile'), 'Nominee'),
  nomineeEmail: notCustomerEmail(optionalPattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid nominee email'), 'Nominee'),
  guarantorMobile: notCustomerPhone(optionalPattern(/^[6-9]\d{9}$/, 'Invalid guarantor mobile'), 'Guarantor'),
  guarantorEmail: notCustomerEmail(optionalPattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid guarantor email'), 'Guarantor'),
  dob: Yup.object({
    day: optionalPattern(/^(?:[1-9]|[12]\d|3[01])$/, 'Invalid day'),
    month: optionalPattern(/^(?:[1-9]|1[0-2])$/, 'Invalid month'),
    year: optionalPattern(/^\d{4}$/, 'Invalid year'),
  }),
  ...Object.fromEntries(['aadhaarFront', 'aadhaarBack', 'panCard', 'photo', 'addressProof'].map((name) => [name, fileField().nullable().notRequired()])),
});

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
  pan: optionalPattern(/^[A-Z]{5}[0-9]{4}[A-Z]$/, 'Enter a valid PAN number'),
  aadhaar: optionalPattern(/^[0-9]{12}$/, 'Aadhaar number must have 12 digits'),
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
  accountHolderName: Yup.string()
    .required('Account holder name is required')
    .matches(ACCOUNT_HOLDER_PATTERN, ACCOUNT_HOLDER_MESSAGE),
  accountType: Yup.string().required('Account Type is required'),
  accountNo: Yup.string().required('Account Number is required'),
  confirmAccountNo: Yup.string()
    .required('Confirm the account number')
    .test('matches-account-no', ACCOUNT_MISMATCH_MESSAGE, function check(value) {
      return (value || '').trim() === (this.parent.accountNo || '').trim();
    }),
  ifscCode: Yup.string()
    .required('IFSC Code is required')
    .matches(/^[A-Z]{4}0[A-Z0-9]{6}$/, 'Invalid IFSC Code'),
  bankRemark: Yup.string().nullable(),

  // ============================================
  // DOCUMENT UPLOAD
  // ============================================
  aadhaarFront: fileField(),
  aadhaarBack: fileField(),
  panCard: fileField(),
  photo: fileField(),
  addressProof: fileField(),

  // ============================================
  // NOMINEE DETAILS
  // ============================================
  nomineeName: Yup.string().nullable(),
  nomineeRelation: Yup.string().nullable(),
  nomineeMobile: notCustomerPhone(Yup.string()
    .matches(/^[0-9]{10}$/, 'Mobile must be 10 digits')
    .nullable(), 'Nominee'),
  nomineeEmail: notCustomerEmail(Yup.string()
    .email('Invalid email address')
    .nullable(), 'Nominee'),
  nomineeAddress: Yup.string().nullable(),
  nomineeRemark: Yup.string().nullable(),

  // ============================================
  // GUARANTOR DETAILS
  // ============================================
  guarantorName: Yup.string().nullable(),
  guarantorRelation: Yup.string().nullable(),
  guarantorMobile: notCustomerPhone(Yup.string()
    .matches(/^[0-9]{10}$/, 'Mobile must be 10 digits')
    .nullable(), 'Guarantor'),
  guarantorEmail: notCustomerEmail(Yup.string()
    .email('Invalid email address')
    .nullable(), 'Guarantor'),
  guarantorAddress: Yup.string().nullable(),
  guarantorRemark: Yup.string().nullable(),
});
