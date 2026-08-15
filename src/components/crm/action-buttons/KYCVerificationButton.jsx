'use client';
import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';

export default function KYCVerificationButton({ applicationId, isDark = false }) {
  if (!applicationId) return null;

  return (
    <Link
      href={`/crm/kyc/${applicationId}`}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold transition-all duration-200 hover:scale-105 cursor-pointer ${
        isDark
          ? 'border-pink-700 bg-pink-900/40 text-pink-200 hover:bg-pink-800'
          : 'border-pink-300 bg-pink-100 text-pink-700 hover:bg-pink-200'
      } border`}
    >
      <ShieldCheck className="w-3.5 h-3.5" />
      KYC Verification
    </Link>
  );
}