'use client';
import { Phone } from 'lucide-react';

export default function CallButton({ mobile, isDark = false }) {
  if (!mobile) return null;

  return (
    <a
      href={`tel:${mobile}`}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-all duration-200 hover:scale-105 cursor-pointer text-white shadow-md hover:shadow-lg ${
        isDark
          ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500'
          : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
      }`}
    >
      <Phone className="w-3.5 h-3.5" />
      Call
    </a>
  );
}