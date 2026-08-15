'use client';
import { FileText, Download } from 'lucide-react';

const DOCUMENTS = [
  { key: 'loan_agreement', label: 'Loan Agreement' },
  { key: 'pledge_receipt', label: 'Pledge Receipt' },
  { key: 'kyc_acknowledgement', label: 'KYC Acknowledgement' },
];

export default function DisbursementDocumentList({ applicationId, isDark = false }) {
  return (
    <div className={`rounded-xl border-2 p-4 ${
      isDark ? 'border-gold-700/30 bg-gray-800/50' : 'border-gold-200 bg-gold-50/30'
    }`}>
      <h4 className={`text-sm font-semibold mb-3 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
        Documents Generated
      </h4>
      <div className="space-y-2">
        {DOCUMENTS.map((doc) => (
          <div
            key={doc.key}
            className={`flex items-center justify-between p-3 rounded-lg border ${
              isDark
                ? 'border-gold-700/30 bg-gray-700/50'
                : 'border-gold-200 bg-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <FileText className={`w-4 h-4 ${isDark ? 'text-teal-400' : 'text-teal-600'}`} />
              <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                {doc.label}
              </span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                isDark
                  ? 'bg-emerald-900/40 text-emerald-300'
                  : 'bg-emerald-100 text-emerald-700'
              }`}>
                ✓ Generated
              </span>
            </div>
            <button
              className={`p-1.5 rounded-lg transition-colors ${
                isDark
                  ? 'hover:bg-gray-600 text-gray-400 hover:text-gray-200'
                  : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
              }`}
            >
              <Download className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}