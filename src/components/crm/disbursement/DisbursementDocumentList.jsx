'use client';

import { Download, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import { getPaymentDocument } from '@/lib/services/crmDisbursementService';
import { headingClass, tileClass } from '@/components/crm/ui/detailStyles';

const GENERATED_TYPES = { loan_agreement: 'LOAN_AGREEMENT', pledge_receipt: 'PLEDGE_RECEIPT' };

function saveBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 60000);
}

export default function DisbursementDocumentList({ data, isDark = false }) {
  const { application, readiness } = data;
  const documents = [
    { key: 'loan_agreement', label: 'Loan Agreement', available: data.documents?.loanAgreement },
    { key: 'pledge_receipt', label: 'Pledge Receipt', available: data.documents?.pledgeReceipt },
    { key: 'kyc_acknowledgement', label: 'KYC Acknowledgement', available: readiness.bankVerified },
  ];

  // Agreement and pledge receipt come from the server; the KYC acknowledgement is rendered here.
  const download = async (doc) => {
    try {
      let blob;
      if (GENERATED_TYPES[doc.key]) {
        blob = await getPaymentDocument(`/crm/applications/disbursement/generated-document/${application.id}?type=${GENERATED_TYPES[doc.key]}`);
      } else {
        const [{ pdf }, { default: DisbursementDocumentPdf }] = await Promise.all([
          import('@react-pdf/renderer'),
          import('./DisbursementDocumentPdf'),
        ]);
        blob = await pdf(<DisbursementDocumentPdf type={doc.key} data={data} />).toBlob();
      }
      saveBlob(blob, `${application.applicationNo}-${doc.key}.pdf`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not download document.');
    }
  };

  return (
    <section className={`p-4 ${tileClass(isDark)}`}>
      <h3 className={`${headingClass(isDark)} mb-3 text-base`}><FileText className="h-4 w-4" />Documents</h3>
      <div className="grid gap-2 sm:grid-cols-3">
        {documents.map((doc) => (
          <div
            key={doc.key}
            className={`flex items-center justify-between gap-2 rounded-lg border p-3 ${isDark ? 'border-gold-700/30 bg-gray-800' : 'border-gold-200 bg-white'}`}
          >
            <div className="min-w-0">
              <p className="text-sm font-medium">{doc.label}</p>
              <span className={`text-xs font-semibold ${doc.available ? 'text-emerald-600' : isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                {doc.available ? 'Generated' : 'Pending'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => download(doc)}
              disabled={!doc.available}
              aria-label={`Download ${doc.label}`}
              className={`shrink-0 cursor-pointer rounded-lg p-2 transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                isDark ? 'text-gold-300 hover:bg-gray-700' : 'text-gold-700 hover:bg-gold-50'
              }`}
            >
              <Download className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
