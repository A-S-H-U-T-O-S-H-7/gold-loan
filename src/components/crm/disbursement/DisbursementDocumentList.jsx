'use client';
import { FileText, Download } from 'lucide-react';
import toast from 'react-hot-toast';
import { getPaymentDocument } from '@/lib/services/crmDisbursementService';

export default function DisbursementDocumentList({ data, isDark = false }) {
  const { application, readiness } = data;
  const documents = [
    { key: 'loan_agreement', label: 'Loan Agreement', available: data.documents?.loanAgreement },
    { key: 'pledge_receipt', label: 'Pledge Receipt', available: data.documents?.pledgeReceipt },
    { key: 'kyc_acknowledgement', label: 'KYC Acknowledgement', available: readiness.bankVerified },
  ];

  async function download(doc) {
    try {
      let blob;
      let extension = 'pdf';
      if (doc.key === 'loan_agreement' || doc.key === 'pledge_receipt') {
        const type = doc.key === 'loan_agreement' ? 'LOAN_AGREEMENT' : 'PLEDGE_RECEIPT';
        blob = await getPaymentDocument(`/crm/applications/disbursement/generated-document/${application.id}?type=${type}`);
      } else {
        const [{ pdf }, { default: DisbursementDocumentPdf }] = await Promise.all([
          import('@react-pdf/renderer'), import('./DisbursementDocumentPdf'),
        ]);
        blob = await pdf(<DisbursementDocumentPdf type={doc.key} data={data} />).toBlob();
      }
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${application.applicationNo}-${doc.key}.${extension}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 60000);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not download document.');
    }
  }

  return (
    <div className={`rounded-xl border-2 p-4 ${isDark ? 'border-gold-700/30 bg-gray-800/50' : 'border-gold-200 bg-gold-50/30'}`}>
      <h4 className={`text-sm font-semibold mb-3 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>Documents Generated</h4>
      <div className="space-y-2">
        {documents.map((doc) => (
          <div key={doc.key} className={`flex items-center justify-between p-3 rounded-lg border ${isDark ? 'border-gold-700/30 bg-gray-700/50' : 'border-gold-200 bg-white'}`}>
            <div className="flex items-center gap-3">
              <FileText className={`w-4 h-4 ${isDark ? 'text-teal-400' : 'text-teal-600'}`} />
              <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{doc.label}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${doc.available ? (isDark ? 'bg-emerald-900/40 text-emerald-300' : 'bg-emerald-100 text-emerald-700') : (isDark ? 'bg-gray-600 text-gray-300' : 'bg-gray-100 text-gray-500')}`}>
                {doc.available ? '✓ Generated' : 'Pending'}
              </span>
            </div>
            <button type="button" onClick={() => download(doc)} disabled={!doc.available} aria-label={`Download ${doc.label}`} className={`p-1.5 rounded-lg transition-colors ${isDark ? 'hover:bg-gray-600 text-gray-400 hover:text-gray-200' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'} disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer`}>
              <Download className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
