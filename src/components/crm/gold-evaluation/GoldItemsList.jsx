'use client';
import React, { useState } from 'react';
import { Trash2, Camera, X } from 'lucide-react';

const GoldItemsList = ({ items, onRemove, onUpdate, isDark }) => {
  const [uploadingForItem, setUploadingForItem] = useState(null);

  const handleImageUpload = (itemId, e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('File size should be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const updatedItem = items.find(item => item.id === itemId);
      if (updatedItem) {
        onUpdate({ ...updatedItem, image: file, imagePreview: reader.result });
      }
    };
    reader.readAsDataURL(file);
    setUploadingForItem(null);
  };

  if (items.length === 0) {
    return (
      <div className={`text-center py-8 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
        <p>No gold items added yet</p>
        <p className="text-sm mt-1">Click "Add Item" to start</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div
          key={item.id}
          className={`p-4 rounded-xl border-2 transition-all duration-200 ${
            isDark 
              ? 'border-yellow-700/30 bg-gradient-to-r from-yellow-900/40 via-yellow-800/30 to-yellow-700/20' 
              : 'border-yellow-200 bg-gradient-to-r from-yellow-100 via-yellow-200/60 to-yellow-300/30'
          }`}
        >
          <div className="flex items-center gap-4">
            {/* Column 1: Image - Full height */}
            <div className="flex-shrink-0">
              {item.imagePreview ? (
                <div className="relative w-20 h-20 rounded-lg overflow-hidden border-2 border-yellow-300 dark:border-yellow-600">
                  <img 
                    src={item.imagePreview} 
                    alt={item.itemType} 
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => {
                      const updatedItem = { ...item, imagePreview: '', image: null };
                      onUpdate(updatedItem);
                    }}
                    className="absolute -top-1.5 -right-1.5 p-0.5 bg-white dark:bg-gray-800 rounded-full shadow-md hover:bg-red-50 transition-colors border border-gray-200 dark:border-gray-600"
                  >
                    <X className="w-3.5 h-3.5 text-red-500 hover:text-red-600" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setUploadingForItem(item.id)}
                  className="w-20 h-20 rounded-lg border-2 border-dashed border-yellow-300 dark:border-yellow-600 hover:border-yellow-500 transition-all duration-200 flex flex-col items-center justify-center bg-yellow-50/50 dark:bg-gray-700/50"
                >
                  <Camera className={`w-6 h-6 ${isDark ? 'text-gray-400' : 'text-yellow-500'}`} />
                  <span className="text-[10px] text-gray-400 mt-1">Upload</span>
                </button>
              )}
              {uploadingForItem === item.id && (
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(item.id, e)}
                  className="hidden"
                  ref={(input) => input && input.click()}
                />
              )}
            </div>

            {/* Column 2: Name + Carat */}
            <div className="flex-shrink-0 min-w-[100px]">
              <h4 className={`font-semibold text-base ${isDark ? 'text-yellow-400' : 'text-yellow-700'}`}>
                {item.itemType}
              </h4>
              <span className={`inline-block px-2 py-0.5 text-xs rounded-full mt-1 ${
                item.purity === '24K' 
                  ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300' 
                  : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
              }`}>
                {item.purity}
              </span>
              {item.description && (
                <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'} truncate max-w-[120px]`}>
                  {item.description}
                </p>
              )}
            </div>

            {/* Column 3: Weights - Full labels */}
            <div className="flex-1 grid grid-cols-3 gap-2 text-center">
              <div>
                <p className={`text-[10px] uppercase tracking-wider font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Gross Weight</p>
                <p className={`font-semibold text-sm ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>{item.grossWeight}g</p>
              </div>
              <div>
                <p className={`text-[10px] uppercase tracking-wider font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Net Weight</p>
                <p className={`font-semibold text-sm ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>{item.netWeight}g</p>
              </div>
              <div>
                <p className={`text-[10px] uppercase tracking-wider font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Stone Weight</p>
                <p className={`font-semibold text-sm ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>{item.stoneWeight || 0}g</p>
              </div>
            </div>

            {/* Column 4: Value - Center aligned vertically */}
            <div className="flex-shrink-0 text-center min-w-[100px]">
              <p className={`text-[10px] uppercase tracking-wider font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Value</p>
              <p className={`font-bold text-base ${isDark ? 'text-yellow-400' : 'text-yellow-700'}`}>
                ₹{(item.netWeight * 8200).toFixed(0)}
              </p>
            </div>

            {/* Column 5: Remove Button - Red Gradient */}
            <div className="flex-shrink-0">
              <button
                onClick={() => onRemove(item.id)}
                className="p-2.5 rounded-lg bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white transition-all duration-200 hover:scale-105 shadow-md hover:shadow-lg"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GoldItemsList;