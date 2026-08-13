'use client';

import { Suspense } from 'react';
import CollectionsWorkbenchPage from '@/components/crm/pages/CollectionsWorkbenchPage';

export default function Page() {
  return (
    <Suspense fallback={<div className="p-6 text-foreground-muted">Loading…</div>}>
      <CollectionsWorkbenchPage />
    </Suspense>
  );
}
