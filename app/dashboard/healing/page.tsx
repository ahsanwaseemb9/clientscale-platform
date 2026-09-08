'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import RemediationTerminal from '@/components/RemediationTerminal';

export default function AutonomousHealingPage() {
  const router = useRouter();
  const [tenantId, setTenantId] = useState<string>('test-tenant-123');

  useEffect(() => {
    async function fetchTenant() {
      try {
        const response = await fetch('/api/financials');
        const result = await response.json();
        if (result?.success && result?.data?.tenant_id) {
          setTenantId(result.data.tenant_id);
        }
      } catch (error) {
        console.error("Failed to fetch tenant ID:", error);
      }
    }
    fetchTenant();
  }, []);

  return (
    <div className="min-h-screen bg-[#020612] text-cyan-500 font-mono uppercase p-3 md:p-6 relative flex flex-col selection:bg-cyan-900 selection:text-white text-[10px] md:text-xs tracking-widest w-full">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(6,182,212,0.05),transparent_70%)] pointer-events-none z-0"></div>
      
      <header className="border-b border-cyan-800/40 pb-4 mb-6 flex justify-between items-center relative z-10 w-full">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_#22d3ee]"></span>
          <h1 className="text-sm md:text-xl font-bold tracking-[0.2em] text-cyan-300">
            AUTONOMOUS HEALING // TERMINAL MATRIX
          </h1>
        </div>
        <button
          onClick={() => router.push('/dashboard/boardroom')}
          className="bg-cyan-950/80 border border-cyan-700/60 text-cyan-300 hover:text-white px-3 py-1.5 rounded text-[10px] tracking-widest font-bold cursor-pointer transition-all active:scale-[0.98]"
        >
          [ ← BACK TO BOARDROOM ]
        </button>
      </header>

      <div className="flex-1 flex flex-col relative z-10 w-full">
        <RemediationTerminal tenantId={tenantId} />
      </div>
    </div>
  );
}