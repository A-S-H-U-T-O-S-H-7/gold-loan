'use client';

import StatusBadge from '@/components/crm/ui/StatusBadge';
import { formatCurrency, formatDate, formatDateTime, maskAadhaar } from '@/lib/utils/format';

export default function ApplicationDetail({ app }) {
  if (!app) return null;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="font-mono text-sm text-primary">{app.id}</p>
          <h3 className="text-xl text-foreground">{app.customer?.name}</h3>
        </div>
        <StatusBadge status={app.status} />
      </div>

      <section className="grid sm:grid-cols-2 gap-3">
        <Info label="Mobile" value={app.customer?.mobile} />
        <Info label="Email" value={app.customer?.email} />
        <Info label="DOB" value={formatDate(app.customer?.dob)} />
        <Info label="Gender" value={app.customer?.gender} />
        <Info label="Aadhaar" value={maskAadhaar(app.customer?.aadhaar)} />
        <Info label="PAN" value={app.customer?.pan} />
        <div className="sm:col-span-2">
          <Info label="Address" value={app.customer?.address} />
        </div>
      </section>

      {app.customer?.bankDetails && (
        <section>
          <h4 className="text-sm mb-2">Bank details</h4>
          <div className="grid sm:grid-cols-2 gap-3">
            <Info label="Account" value={app.customer.bankDetails.accountNumber} />
            <Info label="IFSC" value={app.customer.bankDetails.ifsc} />
            <Info label="Bank" value={app.customer.bankDetails.bankName} />
            <Info label="Holder" value={app.customer.bankDetails.holderName} />
          </div>
        </section>
      )}

      {app.gold && (
        <section>
          <h4 className="text-sm mb-2">Gold</h4>
          <div className="grid sm:grid-cols-2 gap-3">
            <Info label="Items" value={(app.gold.items || []).map((i) => `${i.name} ${i.carat}`).join(', ') || app.gold.type} />
            <Info label="Gross / Net" value={`${app.gold.grossWeight} / ${app.gold.netWeight} g`} />
            <Info label="Gold value" value={formatCurrency(app.gold.goldValue)} />
            <Info label="Eligible (frozen)" value={formatCurrency(app.gold.eligibleAmount)} />
            {app.gold.remarks && <div className="sm:col-span-2"><Info label="Notes" value={app.gold.remarks} /></div>}
          </div>
        </section>
      )}

      {app.loan && (
        <section>
          <h4 className="text-sm mb-2">Amounts</h4>
          <div className="grid sm:grid-cols-2 gap-3">
            <Info label="Eligible" value={formatCurrency(app.loan.eligibleAmount || app.gold?.eligibleAmount)} />
            <Info label="Offered" value={formatCurrency(app.loan.offeredAmount || app.loan.amount)} />
            <Info label="Approved" value={formatCurrency(app.loan.approvedAmount || app.loan.offeredAmount)} />
            <Info label="Rate" value={`${app.loan.rate}%`} />
            <Info label="Tenure" value={`${app.loan.tenure} months`} />
            <Info label="Repayment" value={app.loan.repaymentType} />
            <Info label="EMI / monthly" value={app.loan.emi ? formatCurrency(app.loan.emi) : '—'} />
            <Info label="Total payable" value={formatCurrency(app.loan.totalPayable)} />
            {app.loan.acceptanceNote && <div className="sm:col-span-2"><Info label="Acceptance note" value={app.loan.acceptanceNote} /></div>}
          </div>
        </section>
      )}

      {app.rejectedReason && (
        <div className="p-3 rounded-xl bg-danger-light text-danger text-sm">
          Rejected at {app.rejectedStage}: {app.rejectedReason}
        </div>
      )}

      <section>
        <h4 className="text-sm mb-2">Timeline</h4>
        <div className="space-y-1 text-sm text-foreground-secondary">
          {Object.entries(app.timeline || {}).map(([key, value]) => (
            <div key={key} className="flex justify-between gap-4">
              <span className="capitalize">{key.replace(/At$/, '').replace(/([A-Z])/g, ' $1')}</span>
              <span className="font-mono">{formatDateTime(value)}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="p-3 rounded-xl bg-background-secondary/60 border border-border">
      <p className="text-xs text-foreground-muted">{label}</p>
      <p className="mt-1 text-sm font-medium text-foreground break-words">{value || '—'}</p>
    </div>
  );
}
