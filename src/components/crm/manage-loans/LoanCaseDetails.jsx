'use client';

import { CircleDollarSign, FileSignature, Scale, User } from 'lucide-react';
import DetailField from '@/components/crm/ui/DetailField';
import { DetailSection, MiniTable } from '@/components/crm/ui/DetailSection';
import { formatDateTime, formatMoney, humanize, joinAddress, orDash } from '@/components/crm/manage-loans/manageLoanFormat';

const grams = (value) => (value != null ? `${value} g` : '—');

function FieldGrid({ children }) {
  return <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{children}</div>;
}

function DocumentButtons({ children }) {
  return <div className="mt-3 flex flex-wrap gap-2">{children}</div>;
}

// documentButton(label, path) is passed in by the modal so every file opens in the same preview.
export default function LoanCaseDetails({ loan, isDark, documentButton }) {
  const kycDetails = loan.kyc?.details || {};
  const dob = kycDetails.dob?.day ? `${kycDetails.dob.day}/${kycDetails.dob.month}/${kycDetails.dob.year}` : null;
  const { evaluation, offer, creditReview, agreement, custody, bank } = loan;

  const goldItemColumns = [
    { label: '#', render: (_, index) => index + 1 },
    { label: 'Item', render: (item) => orDash(item.itemType) },
    { label: 'Qty', render: (item) => orDash(item.quantity) },
    { label: 'Purity', render: (item) => orDash(item.purity) },
    { label: 'Gross', render: (item) => grams(item.grossWeight) },
    { label: 'Deduction', render: (item) => grams(item.deductionWeight) },
    { label: 'Net', render: (item) => <strong>{grams(item.netWeight)}</strong> },
    { label: 'Rate / g', render: (item) => formatMoney(item.rateUsed) },
    { label: 'Value', render: (item) => <strong>{formatMoney(item.valuation)}</strong> },
    { label: 'Photos', render: (item) => (item.images.length
      ? <div className="flex flex-wrap gap-1">{item.images.map((image, index) => documentButton(`Photo ${index + 1}`, `/crm/applications/evaluation/image/${image.id}`))}</div>
      : '—') },
  ];

  const transferColumns = [
    { label: 'Status', render: (attempt) => humanize(attempt.status) },
    { label: 'Method', render: (attempt) => humanize(attempt.method) },
    { label: 'Amount', render: (attempt) => formatMoney(attempt.amount) },
    { label: 'Attempted At', render: (attempt) => formatDateTime(attempt.attemptedAt) },
    { label: 'UTR / Failure Reason', render: (attempt) => orDash(attempt.transactionReference || attempt.failureReason) },
    { label: 'Receipt', render: (attempt) => (attempt.receiptAvailable ? documentButton('Receipt', `/crm/disbursement-attempts/receipt/${attempt.id}`) : '—') },
  ];

  return (
    <div className="space-y-4">
      <DetailSection title="Customer and KYC" icon={User} isDark={isDark}>
        <FieldGrid>
          <DetailField label="Application No." value={loan.applicationNo} isDark={isDark} />
          <DetailField label="Customer" value={loan.customerName} isDark={isDark} />
          <DetailField label="Mobile" value={loan.mobile} isDark={isDark} />
          <DetailField label="Email" value={orDash(loan.email)} isDark={isDark} />
          <DetailField label="Branch" value={loan.branchName || 'Unassigned'} isDark={isDark} />
          <DetailField label="KYC" value={loan.kycVerified ? 'Verified' : 'Not verified'} isDark={isDark} />
          <DetailField label="KYC Verified At" value={formatDateTime(loan.kyc?.verifiedAt)} isDark={isDark} />
          <DetailField label="Gender" value={orDash(kycDetails.gender)} isDark={isDark} />
          <DetailField label="Date of Birth" value={orDash(dob)} isDark={isDark} />
          <DetailField label="PAN" value={orDash(kycDetails.pan)} isDark={isDark} />
          <DetailField label="Aadhaar" value={orDash(kycDetails.aadhaar)} isDark={isDark} />
          <DetailField label="Account Holder / IFSC" value={`${orDash(bank.accountHolderName)} · ${orDash(bank.ifscCode)}`} isDark={isDark} />
        </FieldGrid>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <DetailField label="Current Address" value={orDash(loan.currentAddress)} isDark={isDark} />
          <DetailField label="Permanent Address" value={joinAddress(kycDetails.permanentAddress)} isDark={isDark} />
        </div>
        {loan.kyc?.documents?.length > 0 && (
          <DocumentButtons>
            {loan.kyc.documents.map((doc) => documentButton(
              humanize(doc.documentType),
              `/crm/applications/kyc/document/${encodeURIComponent(doc.documentType)}/${loan.applicationId}`,
            ))}
          </DocumentButtons>
        )}
      </DetailSection>

      <DetailSection title="Gold Evaluation" icon={Scale} isDark={isDark}>
        <FieldGrid>
          <DetailField label="Finalised On" value={formatDateTime(evaluation.finalizedAt)} isDark={isDark} />
          <DetailField label="Items" value={orDash(loan.itemCount)} isDark={isDark} />
          <DetailField label="Net Weight" value={grams(loan.totalNetWeight)} isDark={isDark} />
          <DetailField label="Loan to Value" value={evaluation.ltvPercentage == null ? '—' : `${evaluation.ltvPercentage}%`} isDark={isDark} />
          <DetailField label="Valuation" value={formatMoney(loan.valuation)} isDark={isDark} />
          <DetailField label="Eligible Amount" value={formatMoney(loan.eligibleAmount)} isDark={isDark} highlight />
        </FieldGrid>
        <div className="mt-4">
          <MiniTable columns={goldItemColumns} rows={evaluation.items} isDark={isDark} minWidth={900} emptyText="No gold items recorded." />
        </div>
      </DetailSection>

      <DetailSection title="Accepted Offer and Credit Approval" icon={CircleDollarSign} isDark={isDark}>
        <FieldGrid>
          <DetailField label="Offer Version" value={orDash(offer.version)} isDark={isDark} />
          <DetailField label="Accepted At" value={formatDateTime(offer.decisionAt)} isDark={isDark} />
          <DetailField label="Acceptance Method" value={humanize(offer.acceptanceMethod)} isDark={isDark} />
          <DetailField label="Loan Principal" value={formatMoney(loan.principalAmount)} isDark={isDark} highlight />
          <DetailField label="Interest" value={loan.interestRate == null ? '—' : `${loan.interestRate}% ${loan.interestRatePeriod?.toLowerCase() || ''}`} isDark={isDark} />
          <DetailField label="Tenure" value={loan.tenureValue == null ? '—' : `${loan.tenureValue} ${loan.tenureUnit?.toLowerCase() || ''}`} isDark={isDark} />
          <DetailField label="Repayment Mode" value={humanize(loan.repaymentMode)} isDark={isDark} />
          <DetailField label="Processing Fee" value={formatMoney(loan.processingFeeAmount)} isDark={isDark} />
          <DetailField label="Upfront Deductions" value={formatMoney(loan.totalUpfrontDeductions)} isDark={isDark} />
          <DetailField label="Net Payout" value={formatMoney(loan.netAmountTransferred)} isDark={isDark} />
          <DetailField label="Credit Decision" value={humanize(creditReview.decision)} isDark={isDark} />
          <DetailField label="Approved At" value={formatDateTime(creditReview.decidedAt)} isDark={isDark} />
        </FieldGrid>
        {offer.charges.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {offer.charges.map((charge, index) => (
              <span key={charge.id ?? index} className={`rounded-full border px-3 py-1 text-xs font-medium ${isDark ? 'border-gold-700/40 text-gray-300' : 'border-gold-200 text-gray-700'}`}>
                {charge.name}: {formatMoney(charge.amount)}{charge.deductedUpfront ? ' (deducted upfront)' : ''}
              </span>
            ))}
          </div>
        )}
      </DetailSection>

      <DetailSection title="Agreement, Custody and Disbursement" icon={FileSignature} isDark={isDark}>
        <FieldGrid>
          <DetailField label="Agreement Reference" value={orDash(agreement?.agreementReference)} isDark={isDark} />
          <DetailField label="Signed At" value={formatDateTime(agreement?.signedAt)} isDark={isDark} />
          <DetailField label="Signature Type" value={humanize(agreement?.signatureType)} isDark={isDark} />
          <DetailField label="Packet / Receipt" value={orDash(custody?.receiptNumber)} isDark={isDark} />
          <DetailField label="Storage Location" value={orDash(custody?.storageLocation)} isDark={isDark} />
          <DetailField label="Disbursed At" value={formatDateTime(loan.disbursementDate)} isDark={isDark} />
          <DetailField label="Bank / Account" value={`${orDash(bank.bankName)} · ${orDash(loan.maskedAccountNumber)}`} isDark={isDark} />
          <DetailField label="Transaction Reference" value={orDash(loan.transactionReference)} isDark={isDark} />
        </FieldGrid>
        <DocumentButtons>
          {loan.generatedDocuments.map((doc) => documentButton(
            humanize(doc.documentType),
            `/crm/applications/disbursement/generated-document/${loan.applicationId}?type=${doc.documentType}`,
          ))}
          {agreement?.available && documentButton('Signed Agreement', `/crm/applications/disbursement/agreement-file/${loan.applicationId}`)}
        </DocumentButtons>
        <h4 className="mb-2 mt-4 text-sm font-semibold">Transfer History</h4>
        <MiniTable columns={transferColumns} rows={loan.transferHistory} isDark={isDark} minWidth={760} emptyText="No transfer attempts recorded." />
      </DetailSection>
    </div>
  );
}
