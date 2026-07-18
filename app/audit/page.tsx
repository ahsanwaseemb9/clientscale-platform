import { Suspense } from 'react';
import AuditContent from '../components/AuditContent';

export default function AuditPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#050505] text-[#00FF41] font-mono p-12">INITIALIZING...</div>}>
      <AuditContent />
    </Suspense>
  );
}