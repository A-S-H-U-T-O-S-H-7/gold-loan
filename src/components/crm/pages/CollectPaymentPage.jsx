'use client';

import { useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import PageHeader from '@/components/crm/ui/PageHeader';
import { Field, GhostButton, PrimaryButton, inputClass } from '@/components/crm/ui/FormControls';
import { paymentService } from '@/lib/services/paymentService';
import { useLoanStore } from '@/lib/store/loanStore';
import { PAYMENT_MODES, PAYMENT_TYPES } from '@/lib/constants/crm';
import { formatCurrency } from '@/lib/utils/format';

export default function CollectPaymentPage() {
  const searchParams = useSearchParams();
  const applications = useLoanStore((s) => s.applications);
  const loans = useMemo(() => paymentService.getCollectable(), [applications]);
  const preset = searchParams.get('id');
  const [id, setId] = useState(preset || loans[0]?.id || '');
  const [form, setForm] = useState({ amount: '', type: 'EMI', mode: 'UPI', reference: '' });
  const selected = applications.find((l) => l.id === id);
  const snap = selected ? paymentService.snapshot(selected) : null;
  const outstanding = snap?.outstanding || 0;

  const collect = () => {
    if (!selected) return toast.error('Select a loan');
    if (!form.amount) return toast.error('Enter amount');
    const entry = paymentService.collectPayment(selected.id, {
      amount: Number(form.amount),
      type: form.type,
      mode: form.mode,
      reference: form.reference,
    });
    toast.success(`Receipt ${entry.receipt} · Interest ${formatCurrency(entry.interest)} · Penalty ${formatCurrency(entry.penalty)} · Principal ${formatCurrency(entry.principal)}`);
    setForm({ amount: '', type: 'EMI', mode: 'UPI', reference: '' });
  };

  return (
    <div className="animate-fade-in max-w-2xl">
      <PageHeader title="Collect payment" description="Allocation: interest first, then penalty, then principal. Full payment closes the loan." />
      <div className="card p-5 space-y-4">
        <Field label="Loan">
          <select className={inputClass} value={id} onChange={(e) => setId(e.target.value)}>
            <option value="">Select</option>
            {loans.map((l) => (
              <option key={l.id} value={l.id}>
                {l.id} — {l.customer?.name} ({formatCurrency(paymentService.outstandingOf(l))})
              </option>
            ))}
          </select>
        </Field>
        {selected && snap && (
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-background-secondary">
              <p className="text-xs text-foreground-muted">Outstanding</p>
              <p className="font-mono font-semibold">{formatCurrency(outstanding)}</p>
            </div>
            <div className="p-3 rounded-xl bg-background-secondary">
              <p className="text-xs text-foreground-muted">Customer</p>
              <p className="font-medium">{selected.customer?.name}</p>
            </div>
            <div className="p-3 rounded-xl bg-background-secondary">
              <p className="text-xs text-foreground-muted">Interest due</p>
              <p className="font-mono">{formatCurrency(snap.interestDue)}</p>
            </div>
            <div className="p-3 rounded-xl bg-background-secondary">
              <p className="text-xs text-foreground-muted">Penalty</p>
              <p className="font-mono">{formatCurrency(snap.penaltyDue)}</p>
            </div>
          </div>
        )}
        <Field label="Payment type">
          <select className={inputClass} value={form.type} onChange={(e) => {
            const type = e.target.value;
            setForm({
              ...form,
              type,
              amount: type === 'Full' || type === 'Foreclosure' ? outstanding : form.amount,
            });
          }}>
            {PAYMENT_TYPES.map((t) => <option key={t}>{t}</option>)}
          </select>
        </Field>
        <Field label="Amount">
          <input type="number" className={inputClass} value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
        </Field>
        <Field label="Mode">
          <select className={inputClass} value={form.mode} onChange={(e) => setForm({ ...form, mode: e.target.value })}>
            {PAYMENT_MODES.map((m) => <option key={m}>{m}</option>)}
          </select>
        </Field>
        <Field label="Reference">
          <input className={inputClass} value={form.reference} onChange={(e) => setForm({ ...form, reference: e.target.value })} />
        </Field>
        <div className="flex justify-end gap-2">
          <GhostButton onClick={() => selected && setForm({ ...form, amount: outstanding, type: 'Full' })}>
            Full settlement
          </GhostButton>
          <PrimaryButton onClick={collect}>Collect & generate receipt</PrimaryButton>
        </div>
      </div>
    </div>
  );
}
