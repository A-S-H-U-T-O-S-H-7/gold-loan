'use client';

import { mutedClass, tileClass } from '@/components/crm/ui/detailStyles';

export default function DetailField({ label, value, isDark, highlight = false }) {
  const boxClass = highlight ? 'rounded-lg border border-gold-500 bg-gold-600 text-white' : tileClass(isDark);
  const labelClass = highlight ? 'text-gold-50' : mutedClass(isDark);

  return (
    <div className={`min-w-0 p-3 ${boxClass}`}>
      <p className={`text-xs ${labelClass}`}>{label}</p>
      <p className="mt-1 break-words text-sm font-semibold">{value ?? '—'}</p>
    </div>
  );
}
