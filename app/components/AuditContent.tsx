'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import DecryptedLogo from './DecryptedLogo';

export default function AuditContent() {
  const searchParams = useSearchParams();
  const router = useRouter(); 
  
  const targetUrl = searchParams.get('url') || 'your domain';
  
  const [logs, setLogs] = useState<string[]>(['INITIALIZING_CORE_DIAGNOSTICS...']);
  const [isComplete, setIsComplete] = useState(false);
  const [auditData, setAuditData] = useState<any>(null); 

  const hasRun = useRef(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // 1. Fetch the actual audit data in the background
  useEffect(() => {
    if (targetUrl === 'your domain') return;
    
    fetch(`/api/audit?url=${encodeURIComponent(targetUrl)}`)
      .then((res) => res.json())
      .then((data) => setAuditData(data))
      .catch((err) => console.error("Failed to fetch audit data:", err));
  }, [targetUrl]);

  // 2. Telemetry Animation Logic
  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const steps = [
      { msg: `TARGETING_FACILITY_DOMAIN: ${targetUrl}`, delay: 500 },
      { msg: 'ESTABLISHING_LOCAL_TRAFFIC_PIPELINE...', delay: 1200 },
      { msg: 'NURTURE_SEQUENCE: VERIFYING_DMARC_SPF_RECORDS..', delay: 1800},
      { msg: 'PARSING_FRONTEND_BOOKING_ARCHITECTURE...', delay: 2500 },
      { msg: 'META_GRAPH: EXTRACTING_SOCIAL_PREVIEW_DATA...', delay: 3100 },
      { msg: 'LOCAL_SEO_LATENCY: EVALUATING_TBT_INP...', delay: 3800 },
      { msg: 'CRM_FINGERPRINTING: STACK_TECHNOLOGY_IDENTIFIED...', delay: 4600 },
      { msg: 'GHOST_LEAD_ANALYSIS: LEAKAGE_POINTS_DETECTED...', delay: 5400 },
      { msg: 'COMPILING_FACILITY_SCALING_BLUEPRINT...', delay: 6100 },
      { msg: '>>> PIPELINE_DIAGNOSTIC_COMPLETE', delay: 6800 }
    ];

    steps.forEach((step) => {
      setTimeout(() => {
        setLogs((prev) => [...prev, step.msg]);
        if (step.msg.includes('>>>')) setIsComplete(true);
      }, step.delay);
    });
  }, [targetUrl]);

  // Auto-scroll the log container
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [logs]);

  // 3. The Transition Handler
  const handleViewResults = () => {
    if (auditData) {
      sessionStorage.setItem('clientScale_auditData', JSON.stringify(auditData));
    } else {
      sessionStorage.setItem('clientScale_auditData', JSON.stringify({ targetUrl, status: 'processing_delayed' }));
    }
    
    router.push('/dashboard/report');
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#020205] text-white antialiased selection:bg-cyan-500/30 selection:text-cyan-200 overflow-hidden relative p-4 sm:p-8">

      {/* --- SPACE AGENCY TELEMETRY LAYERS (Matching Front Page) --- */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(16,24,48,0.85),rgba(2,2,5,1)_65%)] pointer-events-none z-0" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(6,182,212,0.12),transparent_45%)] pointer-events-none z-0 mix-blend-screen" />
      <div className="absolute top-[30%] left-[10%] right-[10%] h-[500px] bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.04),transparent_50%)] pointer-events-none z-0 mix-blend-screen" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#262d3d_1px,transparent_1px),linear-gradient(to_bottom,#262d3d_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] opacity-100 blur-[1px] pointer-events-none z-0" />
      <div className="absolute inset-0 bg-[radial-gradient(1px_1px_at_20px_30px,#fff,transparent_100%),radial-gradient(1px_1px_at_75px_140px,rgba(255,255,255,0.7),transparent_100%),radial-gradient(1.5px_1.5px_at_120px_50px,#fff,transparent_100%),radial-gradient(1px_1px_at_240px_320px,rgba(255,255,255,0.5),transparent_100%)] bg-[size:300px_300px] opacity-40 pointer-events-none z-0 animate-pulse [animation-duration:8s]" />
      <div className="absolute inset-0 bg-[radial-gradient(1.5px_1.5px_at_45px_210px,#fff,transparent_100%),radial-gradient(1px_1px_at_180px_80px,rgba(255,255,255,0.8),transparent_100%),radial-gradient(1px_1px_at_290px_190px,#fff,transparent_100%)] bg-[size:400px_400px] opacity-25 pointer-events-none z-0 animate-pulse [animation-duration:12s]" />

      {/* --- TELEMETRY DASHBOARD CONTAINER --- */}
      <div className="relative w-full max-w-4xl mx-auto bg-[#07070f]/80 border border-zinc-800/80 p-6 sm:p-10 shadow-[0_0_40px_rgba(6,182,212,0.1)] backdrop-blur-2xl rounded-2xl flex flex-col z-10 animate-fade-in">
        
        {/* Header Module */}
        <div className="flex flex-col items-center mb-6 sm:mb-8 border-b border-zinc-800/50 pb-6">
          <div className="transform scale-[0.85] sm:scale-100 origin-center mb-2">
            <DecryptedLogo text="DIAGNOSTIC ENGINE ACTIVE" />
          </div>

          <div className="w-full flex justify-between items-center mt-4">
            <span className="text-[10px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.3em] font-bold text-zinc-500">
              {isComplete ? 'PIPELINE SECURED' : 'INTERCEPTING DOMAIN DATA'}
            </span>
            <div className="flex items-center gap-2 bg-[#0d111c]/90 border border-zinc-800/80 rounded-lg px-3 py-1.5 font-mono text-[10px] tracking-widest uppercase transition-all duration-300">
              <span className="relative flex h-1.5 w-1.5">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isComplete ? 'bg-cyan-400' : 'bg-yellow-400'}`}></span>
                <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${isComplete ? 'bg-cyan-500' : 'bg-yellow-500'}`}></span>
              </span>
              <span className={isComplete ? 'text-cyan-400' : 'text-yellow-500'}>
                {isComplete ? 'READY' : 'SCANNING'}
              </span>
            </div>
          </div>
        </div>

        {/* Log Output Stream */}
        <div ref={scrollRef} className="h-[45vh] overflow-y-auto pr-2 sm:pr-4 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent flex flex-col font-mono text-xs sm:text-sm leading-relaxed">
          {logs.map((log, i) => {
            const isHighlight = log.includes('>>>');
            return (
              <div key={i} className="py-1.5 sm:py-2 flex flex-col sm:flex-row gap-1 sm:gap-4 border-b border-zinc-900/50 last:border-0">
                <span className="text-zinc-600 select-none text-[10px] sm:text-xs whitespace-nowrap pt-0.5">
                  [{new Date().toLocaleTimeString()}]
                </span>
                <span className={`animate-fade-in break-words ${isHighlight ? 'text-cyan-400 font-bold drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]' : 'text-zinc-300'}`}>
                  {log}
                </span>
              </div>
            );
          })}
          {!isComplete && (
            <div className="py-2 flex items-center gap-4">
               <span className="text-zinc-600 text-[10px] sm:text-xs">[{new Date().toLocaleTimeString()}]</span>
               <span className="animate-pulse text-cyan-500 font-bold">_</span>
            </div>
          )}
        </div>

        {/* Action / Awaiting Block */}
        <div className="mt-6 pt-6 border-t border-zinc-800/50 flex justify-center w-full min-h-[60px]">
          {auditData ? (
            <button 
              onClick={handleViewResults}
              className="w-full sm:w-auto bg-gradient-to-b from-zinc-900 to-zinc-950 border border-zinc-800 hover:border-cyan-500/50 active:border-cyan-500/50 text-zinc-300 hover:text-cyan-400 active:text-cyan-400 font-semibold px-6 sm:px-10 py-3.5 sm:py-4 rounded-xl transition-all duration-300 shadow-xl hover:shadow-[0_0_25px_rgba(6,182,212,0.22)] text-[11px] sm:text-sm tracking-widest uppercase active:scale-[0.98] animate-fade-in"
            >
              Access Pipeline Forensics
            </button>
          ) : (
            <div className="w-full sm:w-auto bg-zinc-900/40 border border-zinc-800/50 text-zinc-500 font-semibold px-6 sm:px-10 py-3.5 sm:py-4 rounded-xl text-[11px] sm:text-sm tracking-widest uppercase flex items-center justify-center space-x-3 animate-fade-in cursor-not-allowed">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-cyan-500/50" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Compiling Payload...</span>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}