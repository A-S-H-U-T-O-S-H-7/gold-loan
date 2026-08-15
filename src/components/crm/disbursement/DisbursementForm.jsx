'use client';
import { Field, inputClass } from '@/components/crm/ui/FormControls';

const SIGNATURE_TYPES = ['E-Sign', 'Physical'];
const DISBURSE_MODES = ['Bank Transfer', 'UPI', 'Cash'];

export default function DisbursementForm({ form, setForm, isDark = false }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Field label="Signature Type">
        <select
          className={inputClass}
          value={form.signatureType}
          onChange={(e) => setForm({ ...form, signatureType: e.target.value })}
        >
          {SIGNATURE_TYPES.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </Field>

      <Field label="Disbursement Mode">
        <select
          className={inputClass}
          value={form.mode}
          onChange={(e) => setForm({ ...form, mode: e.target.value })}
        >
          {DISBURSE_MODES.map((mode) => (
            <option key={mode} value={mode}>{mode}</option>
          ))}
        </select>
      </Field>

      {/* Conditional fields based on mode */}
      {form.mode === 'Bank Transfer' && (
        <>
          <Field label="Account Number">
            <input
              type="text"
              className={inputClass}
              placeholder="Enter account number"
              value={form.accountNumber || ''}
              onChange={(e) => setForm({ ...form, accountNumber: e.target.value })}
            />
          </Field>
          <Field label="IFSC Code">
            <input
              type="text"
              className={inputClass}
              placeholder="Enter IFSC code"
              value={form.ifsc || ''}
              onChange={(e) => setForm({ ...form, ifsc: e.target.value })}
            />
          </Field>
        </>
      )}

      {form.mode === 'UPI' && (
        <Field label="UPI ID">
          <input
            type="text"
            className={inputClass}
            placeholder="Enter UPI ID (e.g., name@upi)"
            value={form.upiId || ''}
            onChange={(e) => setForm({ ...form, upiId: e.target.value })}
          />
        </Field>
      )}
    </div>
  );
}