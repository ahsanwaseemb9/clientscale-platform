'use client';

import { useEffect, useState } from 'react';

export default function LiveBleedTicker({ dailyLeakage }: { dailyLeakage: number }) {
  const [sessionBleed, setSessionBleed] = useState(0);

  useEffect(() => {
    if (!dailyLeakage) return;
    
    // 86,400 seconds in a day. Ticking every 100ms (10 ticks/sec).
    // Divide daily leakage by 864,000 for the exact 100ms increment.
    const tickRate = dailyLeakage / 864000;

    const interval = setInterval(() => {
      setSessionBleed(prev => prev + tickRate);
    }, 100);

    return () => clearInterval(interval);
  }, [dailyLeakage]);

  return (
    <div className="flex items-center gap-3 bg-red-950/30 border border-red-500/20 p-4 rounded-lg font-mono w-fit mt-4">
      <div className="relative flex h-3 w-3">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
      </div>
      <span className="text-red-400/80 text-xs tracking-[0.2em] uppercase font-semibold">
        Active Session Bleed
      </span>
      <span className="text-red-400 text-xl font-bold tabular-nums">
        £{sessionBleed.toFixed(4)}
      </span>
    </div>
  );
}