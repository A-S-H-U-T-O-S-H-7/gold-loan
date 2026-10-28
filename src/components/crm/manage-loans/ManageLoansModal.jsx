'use client';

import { useEffect, useState } from 'react';
import { FileText, X } from 'lucide-react';
import toast from 'react-hot-toast';
import StatusBadge from '@/components/crm/ui/StatusBadge';
import { dividerClass, mutedClass } from '@/components/crm/ui/detailStyles';
import { getLoanDocument } from '@/lib/services/loanAccountService';
import LoanCaseDetails from '@/components/crm/manage-loans/LoanCaseDetails';
import LoanRepaymentDetails from '@/components/crm/manage-loans/LoanRepaymentDetails';

const SECTIONS = [
  { key: 'details', label: 'Complete Case' },
  { key: 'payments', label: 'Repayment & Payments' },
];

function DocumentPreview({ preview, onClose }) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={preview.name}
      className="fixed inset-0 z-110 flex items-center justify-center bg-black/70 p-4"
      onClick={(event) => { event.stopPropagation(); onClose(); }}
    >
      <div className="flex max-h-[90vh] w-full max-w-5xl flex-col rounded-xl bg-white p-3" onClick={(event) => event.stopPropagation()}>
        <div className="mb-2 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">{preview.name}</h3>
          <button type="button" onClick={onClose} aria-label="Close preview" className="cursor-pointer rounded p-1 text-gray-600 hover:bg-gray-100">
            <X className="h-5 w-5" />
          </button>
        </div>
        {preview.type.startsWith('image/')
          ? <img src={preview.url} alt={preview.name} className="mx-auto max-h-[75vh] object-contain" />
          : <iframe src={preview.url} title={preview.name} className="h-[75vh] w-full" />}
      </div>
    </div>
  );
}

export default function ManageLoansModal({ isOpen, loan, onClose, isDark = false }) {
  const [section, setSection] = useState('details');
  const [preview, setPreview] = useState(null);
  const [opening, setOpening] = useState(false);

  useEffect(() => {
    setSection(loan?.section || 'details');
  }, [loan]);

  // Free the previous file's object URL whenever the preview changes or closes.
  useEffect(() => () => {
    if (preview?.url) URL.revokeObjectURL(preview.url);
  }, [preview]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const closeOnEscape = (event) => {
      if (event.key !== 'Escape') return;
      if (preview) setPreview(null);
      else onClose();
    };
    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [isOpen, preview, onClose]);

  if (!isOpen || !loan) return null;

  const { detail, schedule, payments } = loan;

  const showDocument = async (path, name) => {
    setOpening(true);
    try {
      const blob = await getLoanDocument(path);
      setPreview({ url: URL.createObjectURL(blob), name, type: blob.type });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not open document.');
    } finally {
      setOpening(false);
    }
  };

  const documentButton = (name, path) => (
    <button
      key={`${name}-${path}`}
      type="button"
      onClick={() => showDocument(path, name)}
      disabled={opening}
      className={`inline-flex cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors disabled:opacity-50 ${
        isDark ? 'border-gold-700 bg-gray-700 text-gold-300 hover:bg-gray-600' : 'border-gold-300 bg-white text-gold-700 hover:bg-gold-50'
      }`}
    >
      <FileText className="h-3.5 w-3.5" />{name}
    </button>
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Loan details for ${detail.loanNo}`}
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 p-3 backdrop-blur-sm sm:p-4"
      onClick={onClose}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className={`flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl border-2 shadow-2xl ${
          isDark ? 'border-gold-700/50 bg-gray-800 text-gray-100' : 'border-gold-200 bg-white text-gray-900'
        }`}
      >
        <header className={`border-b px-5 pt-4 ${dividerClass(isDark)}`}>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-bold">Loan {detail.loanNo}</h2>
                <StatusBadge status={detail.status} />
              </div>
              <p className={`mt-0.5 text-sm ${mutedClass(isDark)}`}>
                <span className="font-mono font-semibold text-gold-600">#{detail.applicationNo}</span>
                {' · '}{detail.customerName} · {detail.mobile}
              </p>
            </div>
            <button type="button" onClick={onClose} aria-label="Close" className="cursor-pointer rounded-lg p-2 transition-colors hover:bg-gray-500/20">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div role="tablist" aria-label="Loan detail sections" className="mt-3 flex gap-1 overflow-x-auto">
            {SECTIONS.map((item) => {
              const isActive = section === item.key;
              return (
                <button
                  key={item.key}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setSection(item.key)}
                  className={`shrink-0 cursor-pointer border-b-2 px-4 py-2 text-sm font-semibold transition-colors ${
                    isActive
                      ? 'border-gold-600 text-gold-600'
                      : `border-transparent ${isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-800'}`
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-5">
          {section === 'details'
            ? <LoanCaseDetails loan={detail} isDark={isDark} documentButton={documentButton} />
            : <LoanRepaymentDetails schedule={schedule} payments={payments} isDark={isDark} />}
        </div>

        <footer className={`flex justify-end border-t px-5 py-3 ${dividerClass(isDark)}`}>
          <button
            type="button"
            onClick={onClose}
            className={`cursor-pointer rounded-lg px-5 py-2.5 text-sm font-medium transition-colors ${
              isDark ? 'border border-gray-600 bg-gray-700 text-white hover:bg-gray-600' : 'border border-gray-300 bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            Close
          </button>
        </footer>
      </div>

      {preview && <DocumentPreview preview={preview} onClose={() => setPreview(null)} />}
    </div>
  );
}
