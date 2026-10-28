'use client';

import { CalendarClock, ReceiptText } from 'lucide-react';
import { DetailSection, MiniTable } from '@/components/crm/ui/DetailSection';
import { formatDate, formatDateTime, formatMoney, humanize, orDash } from '@/components/crm/manage-loans/manageLoanFormat';

const scheduleColumns = [
  { label: 'Installment', render: (item) => `#${item.installmentNo}` },
  { label: 'Due Date', render: (item) => formatDate(item.dueDate) },
  { label: 'Principal', render: (item) => formatMoney(item.principalDue) },
  { label: 'Interest', render: (item) => formatMoney(item.interestDue) },
  { label: 'Charges', render: (item) => formatMoney(item.chargesDue) },
  { label: 'Total Due', render: (item) => <strong>{formatMoney((item.principalDue || 0) + (item.interestDue || 0) + (item.chargesDue || 0))}</strong> },
];

const paymentColumns = [
  { label: 'Received At', render: (payment) => formatDateTime(payment.receivedAt) },
  { label: 'Amount', render: (payment) => <strong>{formatMoney(payment.amount)}</strong> },
  { label: 'Method', render: (payment) => humanize(payment.method) },
  { label: 'Reference', render: (payment) => orDash(payment.reference) },
];

export default function LoanRepaymentDetails({ schedule, payments, isDark }) {
  return (
    <div className="space-y-4">
      <DetailSection title="Repayment Schedule" icon={CalendarClock} isDark={isDark}>
        <MiniTable
          columns={scheduleColumns}
          rows={schedule?.available ? schedule.data : []}
          isDark={isDark}
          emptyText="No repayment schedule has been generated."
        />
      </DetailSection>

      <DetailSection title="Payment History" icon={ReceiptText} isDark={isDark}>
        <MiniTable
          columns={paymentColumns}
          rows={payments?.available ? payments.data : []}
          isDark={isDark}
          minWidth={520}
          emptyText="No payments recorded yet."
        />
      </DetailSection>
    </div>
  );
}
