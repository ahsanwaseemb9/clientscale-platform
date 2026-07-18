'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import DecryptedLogo from './DecryptedLogo';

export default function AuditContent() {
  const searchParams = useSearchParams();
  const targetUrl = searchParams.get('url') || 'your domain';
  
  const [logs, setLogs] = useState<string[]>(['INITIALIZING_CORE_DIAGNOSTICS...']);
  const [isComplete, setIsComplete] = useState(false);
  const hasRun = useRef(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const steps = [
      { msg: `TARGETING: ${targetUrl}`, delay: 500 },
      { msg: 'ESTABLISHING SECURE CONNECTION TO CDN...', delay: 1200 },
      { msg: 'PARSING DOM_STRUCTURE_ANALYSIS...', delay: 1800 },
      { msg: 'LATENCY_METRICS: EVALUATING_TBT_INP...', delay: 2500 },
      { msg: 'FINGERPRINTING: STACK_TECHNOLOGY_IDENTIFIED...', delay: 3200 },
      { msg: 'CONVERSION_FUNNEL: LEAKAGE_POINTS_DETECTED...', delay: 4000 },
      { msg: 'COMPILING_FULL_ENGINEER_REPORT...', delay: 4800 },
      { msg: '>>> DIAGNOSTIC_SEQUENCE_COMPLETE', delay: 5500 }
    ];

    steps.forEach((step) => {
      setTimeout(() => {
        setLogs((prev) => [...prev, step.msg]);
        if (step.msg.includes('>>>')) setIsComplete(true);
      }, step.delay);
    });
  }, [targetUrl]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [logs]);

  return (
    <main className="min-h-screen bg-[#050505] text-[#00FF41] font-mono p-3 sm:p-12 overflow-hidden flex flex-col">
      <div className="w-full max-w-5xl mx-auto border border-[#1a1a1a] bg-[#0a0a0a] p-4 sm:p-6 shadow-2xl rounded-sm">
        <div className="flex flex-col items-center mb-6">
          <div className="mb-4 w-full overflow-hidden text-center flex justify-center">
             {/* Note: Ensure DecryptedLogo handles mobile text sizes natively too */}
            <DecryptedLogo text="ANALYZING TECHNICAL DATA" />
          </div>
          <div className="w-full flex justify-between items-center border-b border-[#1a1a1a] pb-4">
            <span className="text-[10px] sm:text-xs uppercase tracking-[0.1em] sm:tracking-[0.2em] text-[#333]">
              {isComplete ? 'AUDIT COMPLETE' : 'SYSTEM SCANNING...'}
            </span>
            <div className="flex gap-1.5 sm:gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <div className="w-2 h-2 rounded-full bg-yellow-500" />
              <div className="w-2 h-2 rounded-full bg-green-500" />
            </div>
          </div>
        </div>

        <div ref={scrollRef} className="h-[50vh] overflow-y-auto pr-2 sm:pr-4 scrollbar-thin scrollbar-thumb-[#1a1a1a] scrollbar-track-transparent">
          {logs.map((log, i) => (
            <div key={i} className="py-2 sm:py-1 flex flex-col sm:flex-row gap-1 sm:gap-4 text-xs sm:text-sm">
              <span className="text-[#333] select-none text-[10px] sm:text-xs whitespace-nowrap">
                [{new Date().toLocaleTimeString()}]
              </span>
              {/* Added break-all for mobile so extremely long text wraps safely instead of pushing off-screen */}
              <span className="animate-in fade-in slide-in-from-left-2 break-all sm:break-words">
                {log}
              </span>
            </div>
          ))}
          {!isComplete && <div className="animate-pulse text-xs sm:text-sm">_</div>}
        </div>

        {isComplete && (
          <div className="mt-8 pt-6 border-t border-[#1a1a1a] animate-in zoom-in-95 duration-500">
            <button className="w-full sm:w-auto bg-[#00FF41] text-black font-bold px-4 sm:px-8 py-3.5 sm:py-3 text-[11px] sm:text-sm uppercase tracking-wider sm:tracking-widest hover:bg-white transition-colors">
              Access Full Audit Results
            </button>
          </div>
        )}
      </div>
    </main>
  );
}