import React, { useState, useEffect } from 'react';
import { MapPin, Home, AlertTriangle } from 'lucide-react';
import { userKycService } from '@/lib/services/UserKYCServices';

const AddressSection = ({
  title,
  addressPrefix,
  showSameAddressOption = false,
  sameAddress = false,
  onSameAddressChange,
  isCurrentAddressComplete,
  formik,
  isDark
}) => {
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);

  // Fetch states on mount
  useEffect(() => {
    fetchStates();
  }, []);

  // Fetch cities when state changes
  useEffect(() => {
    const stateValue = formik.values[`${addressPrefix}Address`]?.state;
    if (stateValue) {
      fetchCities(stateValue);
    } else {
      setCities([]);
    }
  }, [formik.values[`${addressPrefix}Address`]?.state]);

  const fetchStates = async () => {
    try {
      setLoadingStates(true);
      const response = await userKycService.getStates();
      if (response?.success) {
        setStates(response.states);
      }
    } catch (error) {
      console.error('Error fetching states:', error);
    } finally {
      setLoadingStates(false);
    }
  };

  const fetchCities = async (stateName) => {
    try {
      setLoadingCities(true);
      const response = await userKycService.getCities(stateName);
      if (response?.success) {
        setCities(response.cities);
      }
    } catch (error) {
      console.error('Error fetching cities:', error);
      setCities([]);
    } finally {
      setLoadingCities(false);
    }
  };

  const handleStateChange = (e, prefix) => {
    const stateName = e.target.value;
    formik.setFieldValue(`${prefix}Address.state`, stateName);
    formik.setFieldValue(`${prefix}Address.city`, '');
    formik.setFieldTouched(`${prefix}Address.state`, true);
  };

  // Helper to check field error - shows error if touched OR form is submitting
  const hasError = (fieldPath) => {
    const isTouched = formik.touched[fieldPath];
    const isSubmitting = formik.isSubmitting;
    const hasErrorValue = formik.errors[fieldPath];
    // Show error if field is touched OR form is being submitted
    return hasErrorValue && (isTouched || isSubmitting);
  };

  const getFieldError = (fieldPath) => {
    return formik.errors[fieldPath];
  };

  // CSS Classes
  const inputClassName = `w-full px-3 py-2 rounded-lg border-2 transition-all duration-200 text-sm outline-none ${
    isDark
      ? "bg-gray-700 border-gray-600 text-white hover:border-crm-primary focus:border-crm-primary-strong focus:ring-2 focus:ring-crm-ring"
      : "bg-gray-50 border-gray-300 text-gray-900 hover:border-crm-primary focus:border-crm-primary focus:ring-2 focus:ring-crm-ring"
  }`;

  const errorInputClassName = `w-full px-3 py-2 rounded-lg border-2 transition-all duration-200 text-sm outline-none ${
    isDark
      ? "bg-gray-700 border-red-500 text-white hover:border-red-400 focus:border-red-400"
      : "bg-red-50 border-red-400 text-gray-900 hover:border-red-400 focus:border-red-500"
  } focus:ring-2 focus:ring-red-500/20`;

  const selectClassName = `w-full px-3 py-2 rounded-lg border-2 transition-all duration-200 text-sm outline-none ${
    isDark
      ? "bg-gray-700 border-gray-600 text-white hover:border-crm-primary focus:border-crm-primary-strong focus:ring-2 focus:ring-crm-ring"
      : "bg-gray-50 border-gray-300 text-gray-900 hover:border-crm-primary focus:border-crm-primary focus:ring-2 focus:ring-crm-ring"
  }`;

  const errorSelectClassName = `w-full px-3 py-2 rounded-lg border-2 transition-all duration-200 text-sm outline-none ${
    isDark
      ? "bg-gray-700 border-red-500 text-white hover:border-red-400 focus:border-red-400"
      : "bg-red-50 border-red-400 text-gray-900 hover:border-red-400 focus:border-red-500"
  } focus:ring-2 focus:ring-red-500/20`;

  const labelClassName = `block text-xs font-medium mb-1 ${
    isDark ? "text-gray-200" : "text-gray-700"
  }`;

  const errorLabelClassName = `block text-xs font-medium mb-1 ${
    isDark ? "text-red-400" : "text-red-600"
  }`;

  const errorTextClassName = `text-xs mt-1 flex items-center gap-1 ${
    isDark ? "text-red-400" : "text-red-600"
  }`;

  const isRequired = !showSameAddressOption || !sameAddress;

  // Helper to handle blur and set touched
  const handleBlur = (fieldPath, e) => {
    formik.handleBlur(e);
    formik.setFieldTouched(fieldPath, true);
  };

  return (
    <div className={`rounded-xl shadow-lg border-2 overflow-hidden ${
      isDark
        ? "bg-gray-800 border-crm-border shadow-crm-soft"
        : "bg-white border-crm-border shadow-crm-soft"
    }`}>
      <div className="p-5">
        <div className="flex items-center space-x-2 mb-4">
          <MapPin className={`w-5 h-5 ${isDark ? "text-crm-primary-strong" : "text-crm-primary"}`} />
          <h3 className={`text-lg font-semibold ${isDark ? "text-crm-primary-strong" : "text-crm-primary"}`}>
            {title}
          </h3>
        </div>

        <div className="space-y-4">
          {showSameAddressOption ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
              <div className={`rounded-lg border px-4 py-3 ${
                isDark ? 'border-gray-700 bg-gray-700/40' : 'border-crm-border bg-crm-accent-soft/60'
              }`}>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sameAddress}
                    disabled={!isCurrentAddressComplete}
                    onChange={onSameAddressChange}
                    className="rounded border-gray-300 text-crm-primary focus:ring-crm-primary"
                  />
                  <span className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                    Same as current address
                  </span>
                </label>
                
              </div>

              <div>
                <label className={hasError(`${addressPrefix}Address.houseNo`) ? errorLabelClassName : labelClassName}>
                  House/Flat No. {isRequired && <span className="text-red-500">*</span>}
                </label>
                <input
                  type="text"
                  name={`${addressPrefix}Address.houseNo`}
                  value={formik.values[`${addressPrefix}Address`]?.houseNo || ''}
                  onChange={formik.handleChange}
                  onBlur={(e) => handleBlur(`${addressPrefix}Address.houseNo`, e)}
                  disabled={sameAddress}
                  className={hasError(`${addressPrefix}Address.houseNo`) ? errorInputClassName : inputClassName}
                  placeholder="Enter house/flat number"
                />
                {hasError(`${addressPrefix}Address.houseNo`) && (
                  <div className={errorTextClassName}>
                    <AlertTriangle className="w-3 h-3" />
                    <span>{getFieldError(`${addressPrefix}Address.houseNo`)}</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div>
              <label className={hasError(`${addressPrefix}Address.houseNo`) ? errorLabelClassName : labelClassName}>
                House/Flat No. <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name={`${addressPrefix}Address.houseNo`}
                value={formik.values[`${addressPrefix}Address`]?.houseNo || ''}
                onChange={formik.handleChange}
                onBlur={(e) => handleBlur(`${addressPrefix}Address.houseNo`, e)}
                className={hasError(`${addressPrefix}Address.houseNo`) ? errorInputClassName : inputClassName}
                placeholder="Enter house/flat number"
              />
              {hasError(`${addressPrefix}Address.houseNo`) && (
                <div className={errorTextClassName}>
                  <AlertTriangle className="w-3 h-3" />
                  <span>{getFieldError(`${addressPrefix}Address.houseNo`)}</span>
                </div>
              )}
            </div>
          )}

          {/* Address Line 1 */}
          <div>
            <label className={hasError(`${addressPrefix}Address.addressLine1`) ? errorLabelClassName : labelClassName}>
              Address Line 1 {isRequired && <span className="text-red-500">*</span>}
            </label>
            <input
              type="text"
              name={`${addressPrefix}Address.addressLine1`}
              value={formik.values[`${addressPrefix}Address`]?.addressLine1 || ''}
              onChange={formik.handleChange}
              onBlur={(e) => handleBlur(`${addressPrefix}Address.addressLine1`, e)}
              disabled={sameAddress}
              className={hasError(`${addressPrefix}Address.addressLine1`) ? errorInputClassName : inputClassName}
              placeholder="Street, building, area"
            />
            {hasError(`${addressPrefix}Address.addressLine1`) && (
              <div className={errorTextClassName}>
                <AlertTriangle className="w-3 h-3" />
                <span>{getFieldError(`${addressPrefix}Address.addressLine1`)}</span>
              </div>
            )}
          </div>

          {/* Address Line 2 */}
          <div>
            <label className={labelClassName}>
              Address Line 2 <span className="text-gray-400 text-xs">(Optional)</span>
            </label>
            <input
              type="text"
              name={`${addressPrefix}Address.addressLine2`}
              value={formik.values[`${addressPrefix}Address`]?.addressLine2 || ''}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={sameAddress}
              className={inputClassName}
              placeholder="Landmark (optional)"
            />
          </div>

          {/* State, City, Pincode Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* State */}
            <div>
              <label className={hasError(`${addressPrefix}Address.state`) ? errorLabelClassName : labelClassName}>
                State {isRequired && <span className="text-red-500">*</span>}
              </label>
              <select
                name={`${addressPrefix}Address.state`}
                value={formik.values[`${addressPrefix}Address`]?.state || ''}
                onChange={(e) => handleStateChange(e, addressPrefix)}
                onBlur={(e) => handleBlur(`${addressPrefix}Address.state`, e)}
                disabled={loadingStates || sameAddress}
                className={hasError(`${addressPrefix}Address.state`) ? errorSelectClassName : selectClassName}
              >
                <option value="">{loadingStates ? "Loading states..." : "Select State"}</option>
                {states.map(state => (
                  <option key={state.id} value={state.state_name}>
                    {state.state_name}
                  </option>
                ))}
              </select>
              {hasError(`${addressPrefix}Address.state`) && (
                <div className={errorTextClassName}>
                  <AlertTriangle className="w-3 h-3" />
                  <span>{getFieldError(`${addressPrefix}Address.state`)}</span>
                </div>
              )}
            </div>

            {/* City */}
            <div>
              <label className={hasError(`${addressPrefix}Address.city`) ? errorLabelClassName : labelClassName}>
                City {isRequired && <span className="text-red-500">*</span>}
              </label>
              <select
                name={`${addressPrefix}Address.city`}
                value={formik.values[`${addressPrefix}Address`]?.city || ''}
                onChange={(e) => {
                  formik.handleChange(e);
                  formik.setFieldTouched(`${addressPrefix}Address.city`, true);
                }}
                onBlur={(e) => handleBlur(`${addressPrefix}Address.city`, e)}
                disabled={!formik.values[`${addressPrefix}Address`]?.state || loadingCities || sameAddress}
                className={hasError(`${addressPrefix}Address.city`) ? errorSelectClassName : selectClassName}
              >
                <option value="">
                  {loadingCities ? "Loading cities..." : "Select City"}
                </option>
                {cities.map(city => (
                  <option key={city.id} value={city.city_name}>
                    {city.city_name}
                  </option>
                ))}
              </select>
              {hasError(`${addressPrefix}Address.city`) && (
                <div className={errorTextClassName}>
                  <AlertTriangle className="w-3 h-3" />
                  <span>{getFieldError(`${addressPrefix}Address.city`)}</span>
                </div>
              )}
            </div>

            {/* Pincode */}
            <div>
              <label className={hasError(`${addressPrefix}Address.pincode`) ? errorLabelClassName : labelClassName}>
                Pincode {isRequired && <span className="text-red-500">*</span>}
              </label>
              <input
                type="text"
                name={`${addressPrefix}Address.pincode`}
                value={formik.values[`${addressPrefix}Address`]?.pincode || ''}
                onChange={formik.handleChange}
                onBlur={(e) => handleBlur(`${addressPrefix}Address.pincode`, e)}
                disabled={sameAddress}
                maxLength="6"
                className={hasError(`${addressPrefix}Address.pincode`) ? errorInputClassName : inputClassName}
                placeholder="6-digit pincode"
              />
              {hasError(`${addressPrefix}Address.pincode`) && (
                <div className={errorTextClassName}>
                  <AlertTriangle className="w-3 h-3" />
                  <span>{getFieldError(`${addressPrefix}Address.pincode`)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressSection;