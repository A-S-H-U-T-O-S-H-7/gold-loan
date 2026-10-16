'use client';
import { Field, inputClass } from '@/components/crm/ui/FormControls';

const SIGNATURE_TYPES = ['E-Sign', 'Physical'];

export default function DisbursementForm({ form, setForm }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Field label="Signature Type">
        <select
          className={inputClass}
          value={form.signatureType}
          onChange={(e) => setForm({ ...form, signatureType: e.target.value })}
          disabled={form.locked}
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
          disabled
        >
          <option value="Bank Transfer">Bank Transfer</option>
        </select>
      </Field>

          <Field label="Account Number">
            <input
              type="text"
              className={inputClass}
              placeholder="Enter account number"
              value={form.accountNumber || ''}
              readOnly
            />
          </Field>
          <Field label="IFSC Code">
            <input
              type="text"
              className={inputClass}
              placeholder="Enter IFSC code"
              value={form.ifsc || ''}
              readOnly
            />
          </Field>
    </div>
  );
}
