'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import PageHeader from '@/components/crm/ui/PageHeader';
import { Field, PrimaryButton, inputClass } from '@/components/crm/ui/FormControls';
import { goldService } from '@/lib/services/goldService';
import { useLoanStore } from '@/lib/store/loanStore';
import { PURITIES } from '@/lib/constants/crm';
import { formatCurrency } from '@/lib/utils/format';

export default function GoldRateSettingsPage() {
  const config = useLoanStore((s) => s.config);
  const updateConfig = useLoanStore((s) => s.updateConfig);
  const [rates, setRates] = useState(config.goldRates);
  const [ltv, setLtv] = useState(config.ltv);

  return (
    <div className="animate-fade-in max-w-xl">
      <PageHeader title="Gold rate settings" description="Branch-wide purity rates and LTV used for valuation" />
      <div className="card p-5 space-y-4">
        {PURITIES.map((purity) => (
          <Field key={purity} label={`${purity} rate (₹ / gram)`}>
            <input
              type="number"
              className={inputClass}
              value={rates[purity]}
              onChange={(e) => setRates({ ...rates, [purity]: Number(e.target.value) })}
            />
          </Field>
        ))}
        <Field label="LTV %">
          <input type="number" className={inputClass} value={ltv} onChange={(e) => setLtv(Number(e.target.value))} />
        </Field>
        <p className="text-sm text-foreground-muted">
          Example: 10g 22K → {formatCurrency(10 * (rates['22K'] || 0) * (ltv / 100))}
        </p>
        <PrimaryButton
          onClick={() => {
            goldService.updateRates(rates);
            updateConfig({ ltv });
            toast.success('Rates updated');
          }}
        >
          Save rates
        </PrimaryButton>
      </div>
    </div>
  );
}
