import { Suspense } from 'react';
import DocumentViewPage from './DocumentViewPage';

export default function Page() {
  return (
    <Suspense fallback={<div className="p-6">Loading document...</div>}>
      <DocumentViewPage />
    </Suspense>
  );
}