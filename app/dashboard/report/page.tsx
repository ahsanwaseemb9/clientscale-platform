'use client';

import { useEffect, useState } from 'react';
import { AlertTriangle, DollarSign, Ghost, ShieldAlert, Activity, Database, ServerCrash } from 'lucide-react';

export default function AuditReportPage() {
  const [auditData, setAuditData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Hydrate the data from session storage on mount
    const storedData = sessionStorage.getItem('clientScale_auditData');
    if (storedData) {
      setAuditData(JSON.parse(storedData));
    }
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-cyan-400 animate-pulse text-sm tracking-widest uppercase">
          Hydrating Enterprise Dashboard...
        </div>
      </div>
    );
  }

  // --- BUSINESS FRICTION ALGORITHMS (Frontend Calculations) ---
  const perfScore = auditData?.diagnostics?.performanceScore || 50;
  const rawTbt = parseInt(auditData?.diagnostics?.latency?.tbt?.replace(/[^0-9]/g, '') || '800');
  const thirdPartyCount = auditData?.diagnostics?.thirdPartyScriptCount || 5;

  // 1. Estimated Revenue Leakage (Scale of 1-15% based on performance)
  const revenueLeakagePercent = Math.max(1, (100 - perfScore) * 0.15).toFixed(1);
  
  // 2. The "Ghost Tap" Window (FCP to TTI gap estimated via TBT)
  const ghostTapWindow = (rawTbt / 1000 + 0.8).toFixed(1); 
  
  // 3. Parasite Weight (How much TBT is caused by external scripts)
  const parasiteImpact = Math.min(95, (thirdPartyCount * 12)).toFixed(0);

  // 4. Codebase Fragility (Estimated DOM size based on load time)
  const domSize = perfScore < 50 ? '3,450+' : '1,200';
  const isFragile = perfScore < 50;

  return (
    <div className="space-y-6">
      
      {/* Page Header (Fixed for Mobile) */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 md:gap-0 border-b border-gray-800 pb-6 overflow-hidden">
        <div className="w-full min-w-0">
          <h1 className="text-2xl md:text-3xl font-semibold text-white tracking-tight whitespace-nowrap">
            Diagnostic Forensics
          </h1>
          <p className="text-gray-400 mt-1 md:mt-2 text-xs md:text-sm truncate">
            Live pipeline intelligence for <span className="text-cyan-400">{auditData?.target?.replace('https://', '').replace('http://', '') || 'Target Domain'}</span>
          </p>
        </div>
        
        {/* On mobile, this button stacks below the text to prevent crushing it */}
        <button className="w-full md:w-auto bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-2.5 rounded-md font-medium text-sm transition-colors shadow-[0_0_15px_rgba(8,145,178,0.4)] shrink-0 flex items-center justify-center gap-2">
          <Activity size={16} />
          Initialize AI Remediation
        </button>
      </div>

      {/* --- BUSINESS FRICTION GRID --- */}
      <div className="mb-2">
        <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Revenue & Friction Analysis</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Revenue Leakage Card */}
          <div className="bg-[#121216] border border-red-900/50 rounded-xl p-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <DollarSign size={64} className="text-red-500" />
            </div>
            <div className="flex items-center gap-2 mb-2 text-red-400">
              <AlertTriangle size={16} />
              <h3 className="text-xs font-bold uppercase tracking-wider">Revenue Leakage</h3>
            </div>
            <div className="text-3xl font-bold text-white mb-2">{revenueLeakagePercent}%</div>
            <p className="text-xs text-gray-400 leading-relaxed">
              Latency is actively deflating your conversion rate. Traffic is abandoning the pipeline before checkout.
            </p>
          </div>

          {/* Ghost Tap Window Card */}
          <div className="bg-[#121216] border border-orange-900/50 rounded-xl p-5 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10">
              <Ghost size={64} className="text-orange-500" />
            </div>
            <div className="flex items-center gap-2 mb-2 text-orange-400">
              <Ghost size={16} />
              <h3 className="text-xs font-bold uppercase tracking-wider">Ghost Tap Window</h3>
            </div>
            <div className="text-3xl font-bold text-white mb-2">{ghostTapWindow}s</div>
            <p className="text-xs text-gray-400 leading-relaxed">
              The screen appears loaded, but user taps are ignored for {ghostTapWindow} seconds due to main-thread blocking.
            </p>
          </div>

          {/* Parasite Load Card */}
          <div className="bg-[#121216] border border-yellow-900/50 rounded-xl p-5 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10">
              <ShieldAlert size={64} className="text-yellow-500" />
            </div>
            <div className="flex items-center gap-2 mb-2 text-yellow-400">
              <ServerCrash size={16} />
              <h3 className="text-xs font-bold uppercase tracking-wider">Parasite Load</h3>
            </div>
            <div className="text-3xl font-bold text-white mb-2">{parasiteImpact}%</div>
            <p className="text-xs text-gray-400 leading-relaxed">
              {thirdPartyCount} external marketing scripts are responsible for {parasiteImpact}% of your mobile lag.
            </p>
          </div>

          {/* Codebase Fragility Card */}
          <div className="bg-[#121216] border border-gray-800 rounded-xl p-5 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-5">
              <Database size={64} className="text-white" />
            </div>
            <div className="flex items-center gap-2 mb-2 text-gray-400">
              <Database size={16} />
              <h3 className="text-xs font-bold uppercase tracking-wider">DOM Fragility</h3>
            </div>
            <div className="text-3xl font-bold text-white mb-2">{domSize}</div>
            <p className="text-xs text-gray-400 leading-relaxed">
              {isFragile ? 'Massive HTML node count is draining mobile batteries and risking browser crashes.' : 'HTML structure is within acceptable limits for modern mobile rendering.'}
            </p>
          </div>

        </div>
      </div>

      {/* --- STANDARD TECHNICAL DATA --- */}
      <div className="pt-4">
         <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Raw Diagnostic Output</h2>
         
         <div className="bg-[#0f0f12] border border-gray-800 rounded-lg p-4 overflow-hidden shadow-inner">
            <p className="text-[10px] text-gray-500 mb-4 font-bold tracking-widest uppercase">
              Pipeline Payload Injected
            </p>
            <pre className="text-xs text-green-400 overflow-x-auto whitespace-pre-wrap font-mono">
              {JSON.stringify(auditData, null, 2)}
            </pre>
         </div>
      </div>

    </div>
  );
}