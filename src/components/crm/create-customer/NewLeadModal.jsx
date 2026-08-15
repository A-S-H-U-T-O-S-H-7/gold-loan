'use client';
import { useState } from 'react';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function NewLeadModal({ isOpen, onClose, onSave, isDark = false }) {
  const [lead, setLead] = useState({
    name: '',
    mobile: '',
    email: '',
    purpose: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!lead.name || !lead.mobile) {
      toast.error('Name and Mobile are required');
      return;
    }
    
    if (!/^[6-9]\d{9}$/.test(lead.mobile)) {
      toast.error('Enter a valid 10-digit mobile number');
      return;
    }
    
    onSave(lead);
    setLead({ name: '', mobile: '', email: '', purpose: '' });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-navy-900/50 backdrop-blur-sm cursor-pointer"
        onClick={onClose}
      />
      <div className={`relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl border ${
        isDark
          ? 'bg-gray-800 border-gold-700/50'
          : 'bg-white border-gold-200'
      }`}>
        <div className={`flex items-center justify-between px-5 py-4 border-b sticky top-0 z-10 ${
          isDark ? 'border-gold-700/30 bg-gray-800' : 'border-gold-200 bg-white'
        }`}>
          <h3 className={`text-lg font-semibold ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
            New Lead
          </h3>
          <button
            type="button"
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors cursor-pointer ${
              isDark
                ? 'hover:bg-gray-700 text-gray-400 hover:text-gray-200'
                : 'hover:bg-gold-50 text-gray-500 hover:text-gray-700'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={lead.name}
              onChange={(e) => setLead({ ...lead, name: e.target.value })}
              className={`w-full px-4 py-2.5 rounded-lg border-2 transition-all duration-200 ${
                isDark
                  ? 'bg-gray-700 border-gold-600/50 text-white placeholder-gray-400 focus:border-gold-400'
                  : 'bg-white border-gold-300 text-gray-900 placeholder-gray-500 focus:border-gold-500'
              } focus:ring-2 focus:ring-gold-500/20 focus:outline-none`}
              placeholder="Enter customer name"
              required
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Mobile <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              maxLength={10}
              value={lead.mobile}
              onChange={(e) => setLead({ ...lead, mobile: e.target.value.replace(/\D/g, '') })}
              className={`w-full px-4 py-2.5 rounded-lg border-2 transition-all duration-200 ${
                isDark
                  ? 'bg-gray-700 border-gold-600/50 text-white placeholder-gray-400 focus:border-gold-400'
                  : 'bg-white border-gold-300 text-gray-900 placeholder-gray-500 focus:border-gold-500'
              } focus:ring-2 focus:ring-gold-500/20 focus:outline-none`}
              placeholder="Enter 10-digit mobile number"
              required
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Email
            </label>
            <input
              type="email"
              value={lead.email}
              onChange={(e) => setLead({ ...lead, email: e.target.value })}
              className={`w-full px-4 py-2.5 rounded-lg border-2 transition-all duration-200 ${
                isDark
                  ? 'bg-gray-700 border-gold-600/50 text-white placeholder-gray-400 focus:border-gold-400'
                  : 'bg-white border-gold-300 text-gray-900 placeholder-gray-500 focus:border-gold-500'
              } focus:ring-2 focus:ring-gold-500/20 focus:outline-none`}
              placeholder="Enter email address"
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Purpose
            </label>
            <input
              type="text"
              value={lead.purpose}
              onChange={(e) => setLead({ ...lead, purpose: e.target.value })}
              className={`w-full px-4 py-2.5 rounded-lg border-2 transition-all duration-200 ${
                isDark
                  ? 'bg-gray-700 border-gold-600/50 text-white placeholder-gray-400 focus:border-gold-400'
                  : 'bg-white border-gold-300 text-gray-900 placeholder-gray-500 focus:border-gold-500'
              } focus:ring-2 focus:ring-gold-500/20 focus:outline-none`}
              placeholder="Personal / Business / Medical"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className={`flex-1 px-4 py-2.5 rounded-lg font-medium transition-all duration-200 cursor-pointer ${
                isDark
                  ? 'bg-gray-700 hover:bg-gray-600 text-white border border-gray-600'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-800 border border-gray-300'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`flex-1 px-4 py-2.5 rounded-lg font-semibold transition-all duration-200 hover:scale-105 cursor-pointer text-white shadow-lg hover:shadow-xl ${
                isDark
                  ? 'bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500'
                  : 'bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700'
              }`}
            >
              Save Lead
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}