'use client';
import React, { useState, useEffect, useRef } from 'react';
import { MapPin, AlertTriangle } from 'lucide-react';
import { getStates, getCitiesByState } from '@/lib/services/locationService';

// Fields copied by "Same as current address". Remark is a note about one address, so it is not copied.
const COPIED_FIELDS = ['HouseNo', 'Address', 'State', 'City', 'PinCode', 'AddressType'];

function addressesMatch(values) {
  const hasCurrentAddress = COPIED_FIELDS.some((field) => values[`current${field}`]);
  return hasCurrentAddress && COPIED_FIELDS.every((field) => (values[`current${field}`] || '') === (values[`permanent${field}`] || ''));
}

export default function AddressDetails({ formik, isDark, errors = {}, touched = {} }) {
  const [states, setStates] = useState([]);
  const [statesLoading, setStatesLoading] = useState(true);
  const [locationError, setLocationError] = useState('');
  // Cities cached per state id, so both address sections share one request per state.
  const [citiesByState, setCitiesByState] = useState({});
  const requestedCities = useRef(new Set());
  // Starts ticked when a saved KYC already has identical addresses.
  const [sameAsCurrent, setSameAsCurrent] = useState(() => addressesMatch(formik.values));

  const toggleSameAsCurrent = (checked) => {
    setSameAsCurrent(checked);
    if (!checked) return;
    const copied = Object.fromEntries(COPIED_FIELDS.map((field) => [`permanent${field}`, formik.values[`current${field}`] || '']));
    formik.setValues({ ...formik.values, ...copied }, true);
  };

  // Any edit to the current address breaks the copy, so the tick is cleared.
  const handleCurrentChange = (event) => {
    formik.handleChange(event);
    if (sameAsCurrent) setSameAsCurrent(false);
  };

  // Changing the state invalidates the chosen city, so it is cleared.
  const handleStateChange = (prefix, event) => {
    formik.setValues({ ...formik.values, [`${prefix}State`]: event.target.value, [`${prefix}City`]: '' }, true);
    if (prefix === 'current' && sameAsCurrent) setSameAsCurrent(false);
  };

  useEffect(() => {
    let cancelled = false;
    setStatesLoading(true);
    getStates()
      .then((data) => { if (!cancelled) { setStates(data || []); setLocationError(''); } })
      .catch((error) => { if (!cancelled) setLocationError(error.message || 'Could not load states'); })
      .finally(() => { if (!cancelled) setStatesLoading(false); });
    return () => { cancelled = true; };
  }, []);

  // The form stores state and city names, so the state id is looked up by name to fetch its cities.
  const stateIdFor = (stateName) => {
    if (!stateName) return null;
    const target = stateName.trim().toLowerCase();
    return states.find((state) => state.stateName.trim().toLowerCase() === target)?.id ?? null;
  };

  const currentStateId = stateIdFor(formik.values.currentState);
  const permanentStateId = stateIdFor(formik.values.permanentState);

  useEffect(() => {
    [currentStateId, permanentStateId].forEach((stateId) => {
      if (!stateId || requestedCities.current.has(stateId)) return;
      requestedCities.current.add(stateId);
      getCitiesByState(stateId)
        .then((data) => setCitiesByState((prev) => ({ ...prev, [stateId]: data || [] })))
        .catch((error) => {
          requestedCities.current.delete(stateId);
          setLocationError(error.message || 'Could not load cities');
        });
    });
  }, [currentStateId, permanentStateId]);

  const currentCities = (currentStateId && citiesByState[currentStateId]) || [];
  const permanentCities = (permanentStateId && citiesByState[permanentStateId]) || [];

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

  // Render the section directly so Formik updates keep the same input elements mounted.
  const renderAddressSection = (prefix, title) => {
    const houseNoField = `${prefix}HouseNo`;
    const pinCodeField = `${prefix}PinCode`;
    const addressField = `${prefix}Address`;
    const stateField = `${prefix}State`;
    const cityField = `${prefix}City`;
    const typeField = `${prefix}AddressType`;
    const remarkField = `${prefix}Remark`;
    const isPermanent = prefix === 'permanent';
    // While "Same as current address" is ticked, the copied permanent fields cannot be edited.
    const locked = isPermanent && sameAsCurrent;
    const handleChange = isPermanent ? formik.handleChange : handleCurrentChange;
    const lockedClass = locked ? ' cursor-not-allowed opacity-70' : '';
    const stateId = isPermanent ? permanentStateId : currentStateId;
    const cities = isPermanent ? permanentCities : currentCities;
    const citiesLoading = Boolean(stateId) && !citiesByState[stateId];

    return (
      <div className="mb-6 last:mb-0">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h4 className={`text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
            {title}
          </h4>
          {isPermanent && (
            <label className={`flex cursor-pointer items-center gap-2 text-sm font-medium ${isDark ? 'text-gold-300' : 'text-gold-700'}`}>
              <input
                type="checkbox"
                checked={sameAsCurrent}
                onChange={(event) => toggleSameAsCurrent(event.target.checked)}
                className="h-4 w-4 cursor-pointer accent-gold-600"
              />
              Same as current address
            </label>
          )}
        </div>

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
              onChange={handleChange}
              onBlur={formik.handleBlur}
              readOnly={locked}
              className={`${hasError(houseNoField) ? errorInputClassName : inputClassName}${lockedClass}`}
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
              onChange={handleChange}
              onBlur={formik.handleBlur}
              readOnly={locked}
              className={`${hasError(pinCodeField) ? errorInputClassName : inputClassName}${lockedClass}`}
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
              onChange={handleChange}
              onBlur={formik.handleBlur}
              readOnly={locked}
              className={`${hasError(addressField) ? errorTextareaClassName : textareaClassName}${lockedClass}`}
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
              onChange={(event) => handleStateChange(prefix, event)}
              onBlur={formik.handleBlur}
              disabled={locked}
              className={`${hasError(stateField) ? errorSelectClassName : selectClassName}${lockedClass}`}
            >
              <option value="">{statesLoading ? 'Loading states...' : 'Select State'}</option>
              {/* Keeps a saved state visible even if it is not in the master list. */}
              {formik.values[stateField] && !statesLoading && !stateId && (
                <option value={formik.values[stateField]}>{formik.values[stateField]}</option>
              )}
              {states.map((state) => (
                <option key={state.id} value={state.stateName}>
                  {state.stateName}
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
              onChange={handleChange}
              onBlur={formik.handleBlur}
              className={`${hasError(cityField) ? errorSelectClassName : selectClassName}${lockedClass}`}
              disabled={locked || !formik.values[stateField]}
            >
              <option value="">{citiesLoading ? 'Loading cities...' : 'Select City'}</option>
              {/* Keeps a saved city visible even if it is not in the master list. */}
              {formik.values[cityField] && !citiesLoading && !cities.some((city) => city.cityName === formik.values[cityField]) && (
                <option value={formik.values[cityField]}>{formik.values[cityField]}</option>
              )}
              {cities.map((city) => (
                <option key={city.id} value={city.cityName}>
                  {city.cityName}
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
              onChange={handleChange}
              onBlur={formik.handleBlur}
              disabled={locked}
              className={`${hasError(typeField) ? errorSelectClassName : selectClassName}${lockedClass}`}
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

        {locationError && (
          <div className={`${errorTextClassName} mb-3`}>
            <AlertTriangle className="w-3 h-3" />
            <span>{locationError}</span>
          </div>
        )}

        {/* Current Address */}
        {renderAddressSection('current', 'Current Address')}

        {/* Divider */}
        <div className={`border-t ${isDark ? 'border-gold-700/30' : 'border-gold-200'} my-4`} />

        {/* Permanent Address */}
        {renderAddressSection('permanent', 'Permanent Address')}
      </div>
    </div>
  );
}
