'use client';
import React, { useState, useEffect } from 'react';
import { MapPin, AlertTriangle } from 'lucide-react';

export default function AddressDetails({ formik, isDark, errors = {}, touched = {} }) {
  const [states, setStates] = useState([]);
  const [currentCities, setCurrentCities] = useState([]);
  const [permanentCities, setPermanentCities] = useState([]);

  // Mock states - Replace with API call later
  useEffect(() => {
    const mockStates = [
      { id: 1, state_name: 'Maharashtra' },
      { id: 2, state_name: 'Karnataka' },
      { id: 3, state_name: 'Tamil Nadu' },
      { id: 4, state_name: 'Uttar Pradesh' },
      { id: 5, state_name: 'Delhi' },
      { id: 6, state_name: 'Rajasthan' },
      { id: 7, state_name: 'Gujarat' },
      { id: 8, state_name: 'West Bengal' },
    ];
    setStates(mockStates);
  }, []);

  useEffect(() => {
    if (formik.values.currentState) {
      const mockCities = [
        { id: 1, city_name: 'Mumbai' },
        { id: 2, city_name: 'Pune' },
        { id: 3, city_name: 'Nagpur' },
        { id: 4, city_name: 'Thane' },
        { id: 5, city_name: 'Nashik' },
      ];
      setCurrentCities(mockCities);
    } else {
      setCurrentCities([]);
    }
  }, [formik.values.currentState]);

  useEffect(() => {
    if (formik.values.permanentState) {
      const mockCities = [
        { id: 1, city_name: 'Mumbai' },
        { id: 2, city_name: 'Pune' },
        { id: 3, city_name: 'Nagpur' },
        { id: 4, city_name: 'Thane' },
        { id: 5, city_name: 'Nashik' },
      ];
      setPermanentCities(mockCities);
    } else {
      setPermanentCities([]);
    }
  }, [formik.values.permanentState]);

  const inputClassName = `w-full px-3 py-2 rounded border-2 transition-all duration-200 text-sm ${
    isDark
      ? 'bg-gray-700 border-gray-600 text-white hover:border-gold-500 focus:border-gold-400'
      : 'bg-gray-50 border-gray-300 text-gray-900 hover:border-gold-400 focus:border-gold-500'
  } focus:ring-2 focus:ring-gold-500/20 focus:outline-none`;

  const errorInputClassName = `w-full px-3 py-2 rounded border-2 transition-all duration-200 text-sm ${
    isDark
      ? 'bg-gray-700 border-red-500 text-white hover:border-red-400 focus:border-red-400'
      : 'bg-red-50 border-red-400 text-gray-900 hover:border-red-400 focus:border-red-500'
  } focus:ring-2 focus:ring-red-500/20 focus:outline-none`;

  const selectClassName = `w-full px-3 py-2 rounded border-2 transition-all duration-200 text-sm ${
    isDark
      ? 'bg-gray-700 border-gray-600 text-white hover:border-gold-500 focus:border-gold-400'
      : 'bg-gray-50 border-gray-300 text-gray-900 hover:border-gold-400 focus:border-gold-500'
  } focus:ring-2 focus:ring-gold-500/20 focus:outline-none`;

  const errorSelectClassName = `w-full px-3 py-2 rounded border-2 transition-all duration-200 text-sm ${
    isDark
      ? 'bg-gray-700 border-red-500 text-white hover:border-red-400 focus:border-red-400'
      : 'bg-red-50 border-red-400 text-gray-900 hover:border-red-400 focus:border-red-500'
  } focus:ring-2 focus:ring-red-500/20 focus:outline-none`;

  const textareaClassName = `w-full px-3 py-2 rounded border-2 transition-all duration-200 text-sm resize-none ${
    isDark
      ? 'bg-gray-700 border-gray-600 text-white hover:border-gold-500 focus:border-gold-400'
      : 'bg-gray-50 border-gray-300 text-gray-900 hover:border-gold-400 focus:border-gold-500'
  } focus:ring-2 focus:ring-gold-500/20 focus:outline-none`;

  const errorTextareaClassName = `w-full px-3 py-2 rounded border-2 transition-all duration-200 text-sm resize-none ${
    isDark
      ? 'bg-gray-700 border-red-500 text-white hover:border-red-400 focus:border-red-400'
      : 'bg-red-50 border-red-400 text-gray-900 hover:border-red-400 focus:border-red-500'
  } focus:ring-2 focus:ring-red-500/20 focus:outline-none`;

  const labelClassName = `block text-xs font-medium mb-1 ${
    isDark ? 'text-gray-300' : 'text-gray-700'
  }`;

  const errorLabelClassName = `block text-xs font-medium mb-1 ${
    isDark ? 'text-red-400' : 'text-red-600'
  }`;

  const errorTextClassName = `text-xs mt-1 flex items-center space-x-1 ${
    isDark ? 'text-red-400' : 'text-red-600'
  }`;

  const hasError = (fieldName) => {
    return errors[fieldName] && touched[fieldName];
  };

  const getFieldError = (fieldName) => {
    return errors[fieldName];
  };

  const AddressSection = ({ prefix, title }) => {
    const houseNoField = `${prefix}HouseNo`;
    const pinCodeField = `${prefix}PinCode`;
    const addressField = `${prefix}Address`;
    const stateField = `${prefix}State`;
    const cityField = `${prefix}City`;
    const typeField = `${prefix}AddressType`;
    const remarkField = `${prefix}Remark`;

    return (
      <div className="mb-6 last:mb-0">
        <h4 className={`text-sm font-medium mb-3 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
          {title}
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* House/Building No */}
          <div>
            <label className={hasError(houseNoField) ? errorLabelClassName : labelClassName}>
              House/Building No. <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name={houseNoField}
              value={formik.values[houseNoField] || ''}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={hasError(houseNoField) ? errorInputClassName : inputClassName}
              placeholder="Enter house/building number"
            />
            {hasError(houseNoField) && (
              <div className={errorTextClassName}>
                <AlertTriangle className="w-3 h-3" />
                <span>{getFieldError(houseNoField)}</span>
              </div>
            )}
          </div>

          {/* Pin Code */}
          <div>
            <label className={hasError(pinCodeField) ? errorLabelClassName : labelClassName}>
              Pin Code <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name={pinCodeField}
              maxLength={6}
              value={formik.values[pinCodeField] || ''}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={hasError(pinCodeField) ? errorInputClassName : inputClassName}
              placeholder="Enter 6-digit pin code"
            />
            {hasError(pinCodeField) && (
              <div className={errorTextClassName}>
                <AlertTriangle className="w-3 h-3" />
                <span>{getFieldError(pinCodeField)}</span>
              </div>
            )}
          </div>

          {/* Address */}
          <div className="md:col-span-2">
            <label className={hasError(addressField) ? errorLabelClassName : labelClassName}>
              Address <span className="text-red-500">*</span>
            </label>
            <textarea
              rows="2"
              name={addressField}
              value={formik.values[addressField] || ''}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={hasError(addressField) ? errorTextareaClassName : textareaClassName}
              placeholder="Enter complete address"
            />
            {hasError(addressField) && (
              <div className={errorTextClassName}>
                <AlertTriangle className="w-3 h-3" />
                <span>{getFieldError(addressField)}</span>
              </div>
            )}
          </div>

          {/* State */}
          <div>
            <label className={hasError(stateField) ? errorLabelClassName : labelClassName}>
              State <span className="text-red-500">*</span>
            </label>
            <select
              name={stateField}
              value={formik.values[stateField] || ''}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={hasError(stateField) ? errorSelectClassName : selectClassName}
            >
              <option value="">Select State</option>
              {states.map((state) => (
                <option key={state.id} value={state.state_name}>
                  {state.state_name}
                </option>
              ))}
            </select>
            {hasError(stateField) && (
              <div className={errorTextClassName}>
                <AlertTriangle className="w-3 h-3" />
                <span>{getFieldError(stateField)}</span>
              </div>
            )}
          </div>

          {/* City */}
          <div>
            <label className={hasError(cityField) ? errorLabelClassName : labelClassName}>
              City <span className="text-red-500">*</span>
            </label>
            <select
              name={cityField}
              value={formik.values[cityField] || ''}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={hasError(cityField) ? errorSelectClassName : selectClassName}
              disabled={!formik.values[stateField]}
            >
              <option value="">Select City</option>
              {(prefix === 'current' ? currentCities : permanentCities).map((city) => (
                <option key={city.id} value={city.city_name}>
                  {city.city_name}
                </option>
              ))}
            </select>
            {hasError(cityField) && (
              <div className={errorTextClassName}>
                <AlertTriangle className="w-3 h-3" />
                <span>{getFieldError(cityField)}</span>
              </div>
            )}
          </div>

          {/* Address Type */}
          <div>
            <label className={hasError(typeField) ? errorLabelClassName : labelClassName}>
              Address Type <span className="text-red-500">*</span>
            </label>
            <select
              name={typeField}
              value={formik.values[typeField] || ''}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={hasError(typeField) ? errorSelectClassName : selectClassName}
            >
              <option value="">Select Type</option>
              <option value="OWNED">Owned</option>
              <option value="RENTED">Rented</option>
            </select>
            {hasError(typeField) && (
              <div className={errorTextClassName}>
                <AlertTriangle className="w-3 h-3" />
                <span>{getFieldError(typeField)}</span>
              </div>
            )}
          </div>

          {/* Remark */}
          <div>
            <label className={labelClassName}>
              Remark
            </label>
            <input
              type="text"
              name={remarkField}
              value={formik.values[remarkField] || ''}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={hasError(remarkField) ? errorInputClassName : inputClassName}
              placeholder="Any remarks..."
            />
            {hasError(remarkField) && (
              <div className={errorTextClassName}>
                <AlertTriangle className="w-3 h-3" />
                <span>{getFieldError(remarkField)}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`rounded-xl shadow-lg border-2 overflow-hidden ${
      isDark
        ? 'bg-gray-800 border-gold-700/50 shadow-gold-900/20'
        : 'bg-white border-gold-200 shadow-gold-500/10'
    }`}>
      <div className="p-5">
        <div className="flex items-center space-x-2 mb-4">
          <MapPin className={`w-5 h-5 ${isDark ? 'text-gold-400' : 'text-gold-600'}`} />
          <h3 className={`text-lg font-semibold ${isDark ? 'text-gold-400' : 'text-gold-600'}`}>
            Address Details
          </h3>
        </div>

        {/* Current Address */}
        <AddressSection prefix="current" title="Current Address" />

        {/* Divider */}
        <div className={`border-t ${isDark ? 'border-gold-700/30' : 'border-gold-200'} my-4`} />

        {/* Permanent Address */}
        <AddressSection prefix="permanent" title="Permanent Address" />
      </div>
    </div>
  );
}