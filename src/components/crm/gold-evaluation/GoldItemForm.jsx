import React, { useState } from 'react';
import { Camera, X, AlertTriangle } from 'lucide-react';

const GoldItemForm = ({ onSubmit, onCancel, isDark, initialData = null }) => {
  const [formData, setFormData] = useState(initialData || {
    itemType: '',
    purity: '',
    grossWeight: '',
    netWeight: '',
    stoneWeight: '',
    description: '',
    imagePreview: ''
  });

  const [errors, setErrors] = useState({});

  const itemTypeOptions = ['Ring', 'Chain', 'Bangle', 'Earring', 'Coin', 'Biscuit', 'Other'];
  const purityOptions = ['22K', '24K', '18K', 'Mixed'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setErrors({ ...errors, image: 'File size should be less than 5MB' });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData({ ...formData, image: file, imagePreview: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.itemType) newErrors.itemType = 'Item type is required';
    if (!formData.purity) newErrors.purity = 'Purity is required';
    if (!formData.grossWeight) newErrors.grossWeight = 'Gross weight is required';
    if (!formData.netWeight) newErrors.netWeight = 'Net weight is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

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

  const labelClassName = `block text-xs font-medium mb-1 ${isDark ? "text-gray-200" : "text-gray-700"}`;
  const errorTextClassName = `text-xs mt-1 flex items-center gap-1 ${isDark ? "text-red-400" : "text-red-600"}`;

  return (
    <div className={`rounded-xl shadow-lg border-2 overflow-hidden ${
      isDark ? "bg-gray-800 border-crm-border shadow-crm-soft" : "bg-white border-crm-border shadow-crm-soft"
    }`}>
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-lg font-semibold ${isDark ? "text-crm-primary-strong" : "text-crm-primary"}`}>
            Add Gold Item
          </h3>
          <button onClick={onCancel} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
            <X className={`w-5 h-5 ${isDark ? "text-gray-400" : "text-gray-500"}`} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClassName}>Item Type <span className="text-red-500">*</span></label>
              <select
                name="itemType"
                value={formData.itemType}
                onChange={handleChange}
                className={errors.itemType ? errorInputClassName : selectClassName}
              >
                <option value="">Select Item Type</option>
                {itemTypeOptions.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
              {errors.itemType && <div className={errorTextClassName}><AlertTriangle className="w-3 h-3" />{errors.itemType}</div>}
            </div>

            <div>
              <label className={labelClassName}>Purity <span className="text-red-500">*</span></label>
              <select
                name="purity"
                value={formData.purity}
                onChange={handleChange}
                className={errors.purity ? errorInputClassName : selectClassName}
              >
                <option value="">Select Purity</option>
                {purityOptions.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
              {errors.purity && <div className={errorTextClassName}><AlertTriangle className="w-3 h-3" />{errors.purity}</div>}
            </div>

            <div>
              <label className={labelClassName}>Gross Weight (g) <span className="text-red-500">*</span></label>
              <input
                type="number"
                name="grossWeight"
                value={formData.grossWeight}
                onChange={handleChange}
                step="0.01"
                className={errors.grossWeight ? errorInputClassName : inputClassName}
                placeholder="Enter gross weight"
              />
              {errors.grossWeight && <div className={errorTextClassName}><AlertTriangle className="w-3 h-3" />{errors.grossWeight}</div>}
            </div>

            <div>
              <label className={labelClassName}>Net Weight (g) <span className="text-red-500">*</span></label>
              <input
                type="number"
                name="netWeight"
                value={formData.netWeight}
                onChange={handleChange}
                step="0.01"
                className={errors.netWeight ? errorInputClassName : inputClassName}
                placeholder="Enter net weight"
              />
              {errors.netWeight && <div className={errorTextClassName}><AlertTriangle className="w-3 h-3" />{errors.netWeight}</div>}
            </div>

            <div>
              <label className={labelClassName}>Stone Weight (g)</label>
              <input
                type="number"
                name="stoneWeight"
                value={formData.stoneWeight}
                onChange={handleChange}
                step="0.01"
                className={inputClassName}
                placeholder="Enter stone weight (if any)"
              />
            </div>

            <div className="md:col-span-2">
              <label className={labelClassName}>Description / Remarks</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="2"
                className={`${inputClassName} resize-none`}
                placeholder="Any additional notes about the item"
              />
            </div>

            <div className="md:col-span-2">
              <label className={labelClassName}>Item Image</label>
              <div className="mt-1">
                {formData.imagePreview ? (
                  <div className="relative inline-block">
                    <img src={formData.imagePreview} alt="Preview" className="w-24 h-24 object-cover rounded-lg border-2 border-crm-border" />
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, imagePreview: '', image: null })}
                      className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => document.getElementById('itemImageInput').click()}
                    className={`border-2 border-dashed rounded-lg p-4 cursor-pointer transition-all duration-200 text-center ${
                      isDark ? "border-gray-600 hover:border-crm-primary bg-gray-700/40" : "border-crm-border hover:border-crm-primary bg-crm-accent-soft/60"
                    }`}
                  >
                    <Camera className={`w-6 h-6 mx-auto mb-2 ${isDark ? "text-gray-400" : "text-crm-primary"}`} />
                    <p className="text-xs">Click to upload image</p>
                    <p className="text-[10px] text-gray-500">JPG, PNG (Max 5MB)</p>
                  </div>
                )}
                <input id="itemImageInput" type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </div>
              {errors.image && <div className={errorTextClassName}><AlertTriangle className="w-3 h-3" />{errors.image}</div>}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 rounded-lg border-2 border-crm-border text-crm-primary hover:bg-crm-accent-soft transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-crm-primary text-white rounded-lg hover:bg-crm-primary-strong transition-all duration-200"
            >
              Add Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GoldItemForm;