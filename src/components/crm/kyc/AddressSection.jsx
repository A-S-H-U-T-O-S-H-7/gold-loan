import React, { useState, useEffect } from 'react';
import { MapPin, Home } from 'lucide-react';
import FormField from './FormField';

const AddressSection = ({
  title,
  addressPrefix,
  showSameAddressOption = false,
  sameAddress = false,
  onSameAddressChange,
  isCurrentAddressComplete,
  values,
  setFieldValue,
  cities,
  setCities,
  errors,
  isDark
}) => {
  const [states, setStates] = useState([]);

  useEffect(() => {
    fetchStates();
  }, []);

  useEffect(() => {
    const selectedState = values?.[addressPrefix]?.state;
    if (selectedState) {
      fetchCities(selectedState);
    } else {
      setCities([]);
    }
  }, [values?.[addressPrefix]?.state]);

  const fetchStates = async () => {
    try {
      const response = await fetch('https://api.atdmoney.in/api/states');
      const data = await response.json();
      if (data.success) {
        setStates(data.states.map(s => ({ value: s.state_name, label: s.state_name })));
      }
    } catch (err) {
      console.error('State fetch failed:', err);
    }
  };

  const fetchCities = async (stateName) => {
    try {
      const response = await fetch(`https://api.atdmoney.in/api/cities?state=${stateName}`);
      const data = await response.json();
      if (data.success) {
        setCities(data.cities.map(c => ({ value: c.city_name, label: c.city_name })));
      }
    } catch (err) {
      console.error('City fetch failed:', err);
    }
  };

  const handleStateChange = (e) => {
    setFieldValue(`${addressPrefix}.state`, e.target.value);
    setFieldValue(`${addressPrefix}.city`, '');
  };

  return (
    <div className={`rounded-xl shadow-lg border-2 overflow-hidden ${
      isDark
        ? 'bg-gray-800 border-crm-border shadow-crm-soft'
        : 'bg-white border-crm-border shadow-crm-soft'
    }`}>
      <div className="p-5">
        <div className="flex items-center space-x-2 mb-4">
          <MapPin className={`w-5 h-5 ${isDark ? 'text-crm-primary-strong' : 'text-crm-primary'}`} />
          <h3 className={`text-lg font-semibold ${isDark ? 'text-crm-primary-strong' : 'text-crm-primary'}`}>{title}</h3>
        </div>

        <div className="space-y-4">
        {showSameAddressOption ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <div className={`rounded-lg border px-4 py-3 ${
              isDark ? 'border-gray-700 bg-gray-700/40' : 'border-crm-border bg-crm-accent-soft/60'
            }`}>
              <label className="flex items-center gap-2 cursor-pointer ">
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

            <FormField
              name={`${addressPrefix}.houseNo`}
              label="House/Flat No."
              placeholder="Enter house/flat"
              required
              value={values?.[addressPrefix]?.houseNo || ''}
              onChange={(e) => setFieldValue(`${addressPrefix}.houseNo`, e.target.value)}
              icon={Home}
              error={errors?.[`${addressPrefix}.houseNo`]}
              isDark={isDark}
            />
          </div>
        ) : (
          <FormField
            name={`${addressPrefix}.houseNo`}
            label="House/Flat No."
            placeholder="Enter house/flat"
            required
            value={values?.[addressPrefix]?.houseNo || ''}
            onChange={(e) => setFieldValue(`${addressPrefix}.houseNo`, e.target.value)}
            icon={Home}
            error={errors?.[`${addressPrefix}.houseNo`]}
            isDark={isDark}
          />
        )}

        <FormField
          name={`${addressPrefix}.addressLine1`}
          label="Address Line 1"
          placeholder="Street, building"
          required
          value={values?.[addressPrefix]?.addressLine1 || ''}
          onChange={(e) => setFieldValue(`${addressPrefix}.addressLine1`, e.target.value)}
          error={errors?.[`${addressPrefix}.addressLine1`]}
          isDark={isDark}
        />

        <FormField
          name={`${addressPrefix}.addressLine2`}
          label="Address Line 2"
          placeholder="Area, landmark (optional)"
          value={values?.[addressPrefix]?.addressLine2 || ''}
          onChange={(e) => setFieldValue(`${addressPrefix}.addressLine2`, e.target.value)}
          isDark={isDark}
        />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            name={`${addressPrefix}.state`}
            label="State"
            as="select"
            placeholder="Select"
            required
            options={states}
            value={values?.[addressPrefix]?.state || ''}
            onChange={handleStateChange}
            error={errors?.[`${addressPrefix}.state`]}
            isDark={isDark}
          />

          <FormField
            name={`${addressPrefix}.city`}
            label="City"
            as="select"
            placeholder="Select"
            required
            options={cities}
            value={values?.[addressPrefix]?.city || ''}
            onChange={(e) => setFieldValue(`${addressPrefix}.city`, e.target.value)}
            disabled={!values?.[addressPrefix]?.state}
            error={errors?.[`${addressPrefix}.city`]}
            isDark={isDark}
          />

          <FormField
            name={`${addressPrefix}.pincode`}
            label="Pincode"
            placeholder="6-digit"
            required
            maxLength="6"
            value={values?.[addressPrefix]?.pincode || ''}
            onChange={(e) => setFieldValue(`${addressPrefix}.pincode`, e.target.value)}
            error={errors?.[`${addressPrefix}.pincode`]}
            isDark={isDark}
          />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressSection;
