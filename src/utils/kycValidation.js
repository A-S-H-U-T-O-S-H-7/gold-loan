const MOBILE_REGEX = /^[6-9]\d{9}$/;
const AADHAAR_REGEX = /^[2-9]\d{11}$/;
const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

export const validateKYCForm = (formData, isNewUser, sameAsCurrent) => {
  const errors = {};

  // Personal Details Validation
  if (!formData.fullName?.trim()) {
    errors.fullName = 'Full name is required';
  }

  if (!formData.dob) {
    errors.dob = 'Date of birth is required';
  }

  if (!formData.gender) {
    errors.gender = 'Gender is required';
  }

  if (!formData.mobile?.trim()) {
    errors.mobile = 'Mobile number is required';
  } else if (!MOBILE_REGEX.test(formData.mobile)) {
    errors.mobile = 'Enter valid 10-digit mobile number starting with 6-9';
  }

  if (formData.alternatePhone && !MOBILE_REGEX.test(formData.alternatePhone)) {
    errors.alternatePhone = 'Enter valid 10-digit number starting with 6-9';
  }

  if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = 'Enter valid email address';
  }

  // Address Validation
  if (!formData.currentAddress?.houseNo) {
    errors['currentAddress.houseNo'] = 'House/Flat no. is required';
  }
  if (!formData.currentAddress?.addressLine1) {
    errors['currentAddress.addressLine1'] = 'Address line 1 is required';
  }
  if (!formData.currentAddress?.state) {
    errors['currentAddress.state'] = 'State is required';
  }
  if (!formData.currentAddress?.city) {
    errors['currentAddress.city'] = 'City is required';
  }
  if (!formData.currentAddress?.pincode) {
    errors['currentAddress.pincode'] = 'Pincode is required';
  } else if (!/^\d{6}$/.test(formData.currentAddress.pincode)) {
    errors['currentAddress.pincode'] = 'Enter valid 6-digit pincode';
  }
  if (!sameAsCurrent) {
    if (!formData.permanentAddress?.houseNo) {
      errors['permanentAddress.houseNo'] = 'House/Flat no. is required';
    }
    if (!formData.permanentAddress?.addressLine1) {
      errors['permanentAddress.addressLine1'] = 'Address line 1 is required';
    }
    if (!formData.permanentAddress?.state) {
      errors['permanentAddress.state'] = 'State is required';
    }
    if (!formData.permanentAddress?.city) {
      errors['permanentAddress.city'] = 'City is required';
    }
    if (!formData.permanentAddress?.pincode) {
      errors['permanentAddress.pincode'] = 'Pincode is required';
    } else if (!/^\d{6}$/.test(formData.permanentAddress.pincode)) {
      errors['permanentAddress.pincode'] = 'Enter valid 6-digit pincode';
    }
  }

  // KYC Validation
  if (!formData.aadharNumber?.trim()) {
    errors.aadharNumber = 'Aadhaar number is required';
  } else if (!AADHAAR_REGEX.test(formData.aadharNumber)) {
    errors.aadharNumber = 'Enter valid 12-digit Aadhaar number starting with 2-9';
  }

  if (!formData.panNumber?.trim()) {
    errors.panNumber = 'PAN number is required';
  } else if (!PAN_REGEX.test(formData.panNumber)) {
    errors.panNumber = 'Enter valid PAN number (e.g., ABCDE1234F)';
  }

  // Documents Validation for new user
  if (isNewUser) {
    if (!formData.aadharDocument) {
      errors.aadharDocument = 'Aadhaar document is required';
    }
    if (!formData.aadharBackDocument) {
      errors.aadharBackDocument = 'Aadhaar back document is required';
    }
    if (!formData.panDocument) {
      errors.panDocument = 'PAN document is required';
    }
    if (!formData.livePhoto) {
      errors.livePhoto = 'Live photo is required';
    }
  }

  // Nominee Validation
  if (formData.nominee?.name?.trim()) {
    if (!formData.nominee.dob) {
      errors['nominee.dob'] = 'Nominee date of birth is required';
    }
    if (!formData.nominee.relation) {
      errors['nominee.relation'] = 'Relation is required';
    }
    if (!formData.nominee.aadharNumber) {
      errors['nominee.aadharNumber'] = 'Nominee Aadhaar is required';
    } else if (!AADHAAR_REGEX.test(formData.nominee.aadharNumber)) {
      errors['nominee.aadharNumber'] = 'Enter valid 12-digit Aadhaar starting with 2-9';
    }
    if (formData.nominee.mobile && !MOBILE_REGEX.test(formData.nominee.mobile)) {
      errors['nominee.mobile'] = 'Enter valid 10-digit mobile starting with 6-9';
    }
  }

  return errors;
};

export const validateAadhar = (aadharNumber) => {
  return AADHAAR_REGEX.test(aadharNumber);
};

export const validatePAN = (panNumber) => {
  return PAN_REGEX.test(panNumber);
};

export const validateMobile = (mobile) => {
  return MOBILE_REGEX.test(mobile);
};

export const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const validatePincode = (pincode) => {
  return /^\d{6}$/.test(pincode);
};
