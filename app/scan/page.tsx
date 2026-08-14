import { Suspense } from 'react';
import AuditContent from '../components/AuditContent'; // Make sure this path matches your folder structure!

export default function ScanPage() {
  return (
    // The Suspense boundary is required by Next.js when using useSearchParams()
    <Suspense 
      fallback={
        <div className="min-h-screen bg-[#050505] text-[#00FF41] flex items-center justify-center font-mono text-sm tracking-widest animate-pulse">
          ESTABLISHING SECURE CONNECTION...
        </div>
      }
    >
      <AuditContent />
    </Suspense>
  );
}