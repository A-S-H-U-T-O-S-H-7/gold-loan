import React, { useState } from 'react';
import { Trash2, Edit2, Camera, X } from 'lucide-react';
import Image from 'next/image';

const GoldItemsList = ({ items, onRemove, onUpdate, isDark }) => {
  const [editingItem, setEditingItem] = useState(null);
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
          className={`p-4 rounded-lg border-2 transition-all duration-200 ${
            isDark ? 'border-gray-700 bg-gray-700/30' : 'border-crm-border bg-crm-accent-soft/30'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h4 className={`font-semibold ${isDark ? 'text-crm-primary-strong' : 'text-crm-primary'}`}>
                  {item.itemType}
                </h4>
                <span className={`px-2 py-0.5 text-xs rounded-full ${
                  item.purity === '24K' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'
                }`}>
                  {item.purity}
                </span>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                <div>
                  <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Gross Weight</p>
                  <p className={`font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>{item.grossWeight}g</p>
                </div>
                <div>
                  <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Net Weight</p>
                  <p className={`font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>{item.netWeight}g</p>
                </div>
                <div>
                  <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Stone Weight</p>
                  <p className={`font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>{item.stoneWeight || 0}g</p>
                </div>
                <div>
                  <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Value</p>
                  <p className={`font-medium ${isDark ? 'text-crm-primary-strong' : 'text-crm-primary'}`}>
                    ₹{(item.netWeight * 5200 * 0.75).toFixed(2)}
                  </p>
                </div>
              </div>
              
              {item.description && (
                <p className={`text-xs mt-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  {item.description}
                </p>
              )}
            </div>
            
            <div className="flex flex-col items-end gap-2">
              {item.imagePreview ? (
                <div className="relative">
                  <img src={item.imagePreview} alt={item.itemType} className="w-16 h-16 object-cover rounded-lg border-2 border-crm-border" />
                  <button
                    onClick={() => {
                      const updatedItem = { ...item, imagePreview: '', image: null };
                      onUpdate(updatedItem);
                    }}
                    className="absolute -top-2 -right-2 p-0.5 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setUploadingForItem(item.id)}
                  className="p-2 rounded-lg border-2 border-dashed border-crm-border hover:border-crm-primary transition-all duration-200"
                >
                  <Camera className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-crm-primary'}`} />
                </button>
              )}
              
              <div className="flex gap-1">
                <button
                  onClick={() => onRemove(item.id)}
                  className="p-1.5 rounded-lg hover:bg-red-100 transition-all duration-200"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>
            </div>
          </div>
          
          {uploadingForItem === item.id && (
            <div className="mt-3">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(item.id, e)}
                className="hidden"
                ref={(input) => input && input.click()}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default GoldItemsList;