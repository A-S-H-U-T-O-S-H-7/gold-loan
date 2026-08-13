'use client';

import { Suspense } from 'react';
import CollectPaymentPage from '@/components/crm/pages/CollectPaymentPage';

export default function Page() {
  return (
    <Suspense fallback={<div className="p-6 text-foreground-muted">Loading…</div>}>
      <CollectPaymentPage />
    </Suspense>
  );
}
