'use client';

import { CalendarClock, CreditCard, Gem, History, IndianRupee, Landmark, User } from 'lucide-react';
import CallButton from '@/components/crm/ui/CallButton';
import StatusBadge from '@/components/crm/ui/StatusBadge';
import ManageLoansViewButton from '@/components/crm/action-buttons/ManageLoansViewButton';
import { formatDate, formatMoney, humanize, orDash } from '@/components/crm/manage-loans/manageLoanFormat';

// Groups the user can expand or collapse. Each has its own colour so open groups are easy to spot.
export const COLUMN_GROUPS = [
  { key: 'customer', label: 'Customer', icon: User, tone: 'emerald' },
  { key: 'gold', label: 'Gold', icon: Gem, tone: 'amber' },
  { key: 'loan', label: 'Loan Terms', icon: IndianRupee, tone: 'purple' },
  { key: 'disbursement', label: 'Disbursement', icon: Landmark, tone: 'blue' },
  { key: 'repayment', label: 'Repayment', icon: CalendarClock, tone: 'rose' },
];

const repaymentAmounts = [
  ['totalReceived', 'Total Received'],
  ['outstandingPrincipal', 'Outstanding Principal'],
  ['outstandingInterestCharges', 'Outstanding Interest / Charges'],
  ['overdueAmount', 'Overdue Amount'],
];

/*
 * group: 'fixed' columns always show first, 'actions' always show last,
 * anything else belongs to one of COLUMN_GROUPS and shows only when that group is expanded.
 * render(row, srNo) draws the cell; exportValue(row, srNo) (default: the raw field) goes into the CSV.
 */
export function buildColumns({ isDark, onView, onPayments }) {
  return [
    { key: 'srNo', group: 'fixed', label: 'SR. No', width: '80px',
      render: (_, srNo) => <span className="font-medium">{srNo}</span>, exportValue: (_, srNo) => srNo },
    { key: 'call', group: 'fixed', label: 'Call', width: '90px', exportable: false,
      render: (row) => <CallButton mobile={row.mobile} isDark={isDark} /> },
    { key: 'applicationNo', group: 'fixed', label: 'Application No.', width: '150px',
      render: (row) => <span className="font-mono font-semibold text-gold-600 dark:text-gold-400">{orDash(row.applicationNo)}</span> },
    { key: 'loanNo', group: 'fixed', label: 'Loan No.', width: '140px',
      render: (row) => <span className="font-mono font-semibold">{orDash(row.loanNo)}</span> },
    { key: 'customerName', group: 'fixed', label: 'Customer Name', width: '170px',
      render: (row) => <span className="font-medium">{orDash(row.customerName)}</span> },
    { key: 'mobile', group: 'fixed', label: 'Mobile', width: '125px',
      render: (row) => <span className="font-mono">{orDash(row.mobile)}</span> },
    { key: 'branchName', group: 'fixed', label: 'Branch', width: '140px', render: (row) => row.branchName || 'Unassigned' },
    { key: 'principalAmount', group: 'fixed', label: 'Loan Principal', width: '145px',
      render: (row) => <span className="font-semibold">{formatMoney(row.principalAmount)}</span> },
    { key: 'disbursementDate', group: 'fixed', label: 'Disbursed On', width: '130px', render: (row) => formatDate(row.disbursementDate) },
    { key: 'nextDueDate', group: 'fixed', label: 'Next Due Date', width: '130px', render: (row) => formatDate(row.nextDueDate) },
    { key: 'totalOutstanding', group: 'fixed', label: 'Total Outstanding', width: '160px',
      render: (row) => <span className="font-semibold">{formatMoney(row.totalOutstanding)}</span> },
    { key: 'status', group: 'fixed', label: 'Loan Status', width: '130px', render: (row) => <StatusBadge status={row.status} /> },

    { key: 'email', group: 'customer', label: 'E-mail', width: '200px', render: (row) => orDash(row.email) },
    { key: 'kycVerified', group: 'customer', label: 'KYC Verified', width: '135px',
      render: (row) => (row.kycVerified ? <StatusBadge status="KYC_VERIFIED" /> : '—'),
      exportValue: (row) => (row.kycVerified ? 'Yes' : 'No') },
    { key: 'currentAddress', group: 'customer', label: 'Current Address', width: '260px', render: (row) => orDash(row.currentAddress) },

    { key: 'itemCount', group: 'gold', label: 'Item Count', width: '100px', render: (row) => orDash(row.itemCount) },
    { key: 'totalNetWeight', group: 'gold', label: 'Total Net Weight', width: '140px',
      render: (row) => (row.totalNetWeight == null ? '—' : `${row.totalNetWeight} g`) },
    { key: 'valuation', group: 'gold', label: 'Valuation', width: '135px', render: (row) => formatMoney(row.valuation) },
    { key: 'eligibleAmount', group: 'gold', label: 'Eligible Amount', width: '145px', render: (row) => formatMoney(row.eligibleAmount) },
    { key: 'storageReference', group: 'gold', label: 'Packet / Storage', width: '200px',
      render: (row) => [row.packetReference, row.storageReference].filter(Boolean).join(' / ') || '—',
      exportValue: (row) => [row.packetReference, row.storageReference].filter(Boolean).join(' / ') },

    { key: 'interestRate', group: 'loan', label: 'Interest Rate', width: '145px',
      render: (row) => (row.interestRate == null ? '—' : `${row.interestRate}% ${row.interestRatePeriod === 'MONTHLY' ? 'monthly' : 'annual'}`) },
    { key: 'tenureValue', group: 'loan', label: 'Tenure', width: '120px',
      render: (row) => (row.tenureValue == null ? '—' : `${row.tenureValue} ${row.tenureUnit?.toLowerCase() || ''}`) },
    { key: 'repaymentMode', group: 'loan', label: 'Repayment Mode', width: '160px', render: (row) => humanize(row.repaymentMode) },
    { key: 'processingFeeAmount', group: 'loan', label: 'Processing Fee', width: '140px', render: (row) => formatMoney(row.processingFeeAmount) },
    { key: 'totalUpfrontDeductions', group: 'loan', label: 'Upfront Deductions', width: '160px', render: (row) => formatMoney(row.totalUpfrontDeductions) },

    { key: 'netAmountTransferred', group: 'disbursement', label: 'Net Amount Transferred', width: '180px', render: (row) => formatMoney(row.netAmountTransferred) },
    { key: 'bankName', group: 'disbursement', label: 'Bank Name', width: '160px', render: (row) => orDash(row.bankName) },
    { key: 'maskedAccountNumber', group: 'disbursement', label: 'Account No.', width: '140px',
      render: (row) => <span className="font-mono">{orDash(row.maskedAccountNumber)}</span> },
    { key: 'transactionReference', group: 'disbursement', label: 'Transaction Reference', width: '180px',
      render: (row) => <span className="font-mono">{orDash(row.transactionReference)}</span> },

    { key: 'maturityDate', group: 'repayment', label: 'Maturity Date', width: '130px', render: (row) => formatDate(row.maturityDate) },
    ...repaymentAmounts.map(([key, label]) => ({
      key, group: 'repayment', label, width: '160px', render: (row) => formatMoney(row[key]),
    })),
    { key: 'overdueDays', group: 'repayment', label: 'Overdue Days', width: '120px', render: (row) => orDash(row.overdueDays) },

    { key: 'actions', group: 'actions', label: 'Actions', width: '330px', exportable: false,
      render: (row) => (
        <div className="flex items-center justify-center gap-2">
          <ManageLoansViewButton onClick={() => onView(row)} isDark={isDark} />
          <button
            type="button"
            disabled
            title="Collection is not available yet"
            className={`inline-flex cursor-not-allowed items-center gap-1.5 rounded border px-3 py-1.5 text-xs font-semibold opacity-50 ${isDark ? 'border-gray-600 text-gray-400' : 'border-gray-400 text-gray-600'}`}
          >
            <CreditCard className="h-3.5 w-3.5" />Collection
          </button>
          <button
            type="button"
            onClick={() => onPayments(row)}
            className={`inline-flex cursor-pointer items-center gap-1.5 whitespace-nowrap rounded border px-3 py-1.5 text-xs font-semibold transition-all duration-200 hover:scale-105 ${
              isDark ? 'border-gold-700 bg-gold-900/40 text-gold-300 hover:bg-gold-800' : 'border-gold-300 bg-gold-100 text-gold-700 hover:bg-gold-200'
            }`}
          >
            <History className="h-3.5 w-3.5" />Payment History
          </button>
        </div>
      ) },
  ];
}

// Fixed columns, then the expanded groups in their usual order, then actions.
export function visibleColumnsFor(columns, expandedGroups) {
  return columns.filter((column) => column.group === 'fixed' || column.group === 'actions' || expandedGroups.includes(column.group));
}
