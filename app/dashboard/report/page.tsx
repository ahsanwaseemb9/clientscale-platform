'use client';

import { useEffect, useState } from 'react';

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

  return (
    <div className="space-y-6">
      
      {/* Page Header (Fixed for Mobile) */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 md:gap-0 border-b border-gray-800 pb-6 overflow-hidden">
        <div className="w-full min-w-0">
          <h1 className="text-2xl md:text-3xl font-semibold text-white tracking-tight whitespace-nowrap">
            Diagnostic Forensics
          </h1>
          <p className="text-gray-400 mt-1 md:mt-2 text-xs md:text-sm truncate">
            Live pipeline intelligence for <span className="text-cyan-400">{auditData?.targetUrl || 'Target Domain'}</span>
          </p>
        </div>
        
        {/* On mobile, this button stacks below the text to prevent crushing it */}
        <button className="w-full md:w-auto bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-2.5 rounded-md font-medium text-sm transition-colors shadow-[0_0_15px_rgba(8,145,178,0.4)] shrink-0">
          Initialize AI Remediation
        </button>
      </div>

      {/* The Grid for the Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
         
         {/* Temporary Raw Data Output to verify connection */}
         {auditData && (
           <div className="col-span-1 md:col-span-3 p-4 bg-[#0f0f12] border border-gray-800 rounded-lg shadow-inner overflow-hidden">
              <p className="text-[10px] text-gray-500 mb-4 font-bold tracking-widest uppercase">
                Raw JSON Payload Injected
              </p>
              <pre className="text-xs text-green-400 overflow-x-auto whitespace-pre-wrap">
                {JSON.stringify(auditData, null, 2)}
              </pre>
           </div>
         )}

      </div>
    </div>
  );
}