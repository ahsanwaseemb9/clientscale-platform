// app/dashboard/boardroom/page.tsx
'use client';

import { useState, useEffect } from 'react';
import LiveBleedTicker from '../../components/LiveBleedTicker';
import IncidentTimeline from '../../components/IncidentTimeline';
import RemediationTerminal from '../../components/RemediationTerminal';

export default function BoardroomDashboard() {
  const [showDetailedExplanation, setShowDetailedExplanation] = useState(false);
  const [briefing, setBriefing] = useState('Fetching live database metrics and generating briefing...');
  const [isLoading, setIsLoading] = useState(true);
  
  // Financial State
  const [financialData, setFinancialData] = useState<{
    tenantId: string;
    businessName: string;
    projectedQuarterlyLeakage: number;
    dailyLeakage: number;
  } | null>(null);

  // Dynamic Telemetry State
  const [frictionData, setFrictionData] = useState<{
    elementId: string;
    rageClicks: number;
    apiEndpoint: string;
    latencyMs: number;
    recentEvents: any[];
  } | null>(null);

  // Live Bleeding Revenue Counter State
  const [liveBleedAmount, setLiveBleedAmount] = useState<number>(0);

  useEffect(() => {
    async function loadLiveDashboard() {
      try {
        const dbResponse = await fetch('/api/financials');
        const dbResult = await dbResponse.json();

        if (!dbResult?.success || !dbResult?.data) {
          setBriefing("Awaiting telemetry data. Install the tracking pixel to begin.");
          setIsLoading(false);
          return;
        }

        const liveData = dbResult.data;
        const activeTenantId = liveData?.tenant_id || 'test-tenant-123';
        const displayName = liveData?.business_name || `Tenant: ${activeTenantId.substring(0, 8)}...`;
        const daily = Number(liveData?.defensible_daily_leakage) || 1500;

        setFinancialData({
          tenantId: activeTenantId,
          businessName: displayName,
          projectedQuarterlyLeakage: Number(liveData?.projected_quarterly_leakage) || 0,
          dailyLeakage: daily,
        });

        // Initialize live ticker counter based on current time of day
        const secondsIntoDay = (Date.now() % 86400000) / 1000;
        const perSecondRate = daily / 86400;
        setLiveBleedAmount(Math.floor(secondsIntoDay * perSecondRate));

        const elementId = liveData?.friction_element_id || 'button#checkout-mobile';
        const rageClicks = Number(liveData?.rage_clicks) || 42;
        const apiEndpoint = liveData?.api_endpoint || '/api/cart/sync';
        const latencyMs = Number(liveData?.latency_ms) || 1205;
        const recentEvents = Array.isArray(liveData?.recent_events) ? liveData.recent_events : [];

        setFrictionData({
          elementId,
          rageClicks,
          apiEndpoint,
          latencyMs,
          recentEvents
        });

        const aiResponse = await fetch('/api/ai/executive-briefing', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            businessName: displayName,
            projectedQuarterlyLeakage: liveData?.projected_quarterly_leakage || 0,
            dailyLeakage: daily,
            primaryFriction: `${rageClicks} rage-taps on the '${elementId}' element, and ${latencyMs}ms latency bottlenecks on the ${apiEndpoint} endpoint`
          })
        });
        
        const aiData = await aiResponse.json();
        if (aiData?.success && aiData?.briefing) {
          setBriefing(aiData.briefing);
        } else {
          setBriefing("Error generating AI briefing.");
        }
      } catch (error) {
        console.error("Dashboard Load Error:", error);
        setBriefing("Failed to connect to the telemetry pipeline.");
      } finally {
        setIsLoading(false);
      }
    }

    loadLiveDashboard();
  }, []);

  // Tick revenue upward smoothly every 100ms based on daily leakage rate
  useEffect(() => {
    if (!financialData) return;
    const perSecondRate = financialData.dailyLeakage / 86400;
    const interval = setInterval(() => {
      setLiveBleedAmount((prev) => prev + (perSecondRate / 10));
    }, 100);
    return () => clearInterval(interval);
  }, [financialData]);

  // Generate a random number matrix for the aesthetics
  const numberMatrix = Array.from({ length: 128 }, () => Math.floor(Math.random() * 9));

  return (
    <div className="min-h-screen bg-[#020612] text-cyan-500 font-mono uppercase overflow-hidden relative flex flex-col p-3 md:p-6 selection:bg-cyan-900 selection:text-white text-[10px] md:text-xs tracking-widest w-full">
      
      {/* Background CRT/Scanline Effect */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] pointer-events-none z-0 mix-blend-overlay"></div>
      
      {/* TOP TRACKING RULER */}
      <header className="border-b border-cyan-800/40 pb-3 mb-6 shrink-0 flex flex-col md:flex-row justify-between items-start md:items-end w-full relative z-10 gap-4">
        <div className="flex items-center gap-4 md:gap-6">
          <h1 className="text-lg md:text-2xl font-bold tracking-[0.2em] text-cyan-300 drop-shadow-[0_0_5px_rgba(103,232,249,0.5)]">
            DATA NETWORK
          </h1>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 md:w-8 md:h-8 rounded-full border border-cyan-600 flex items-center justify-center text-[8px] md:text-[9px] text-cyan-300">95%</div>
            <div className="w-6 h-6 md:w-8 md:h-8 rounded-full border border-cyan-800 flex items-center justify-center text-[8px] md:text-[9px] text-cyan-700">15%</div>
          </div>
        </div>
        
        <div className="flex-1 w-full mx-4 lg:mx-8 hidden md:block">
          <div className="flex justify-between text-cyan-800 text-[9px] border-b border-cyan-900/50 pb-1 relative">
             {[100, 125, 130, 135, 140, 145, 150, 155, 160, 165, 170, 175, 180].map((num) => (
                <div key={num} className="relative flex flex-col items-center">
                  <span>{num}</span>
                  <div className="w-px h-2 bg-cyan-800 absolute -bottom-1"></div>
                </div>
             ))}
          </div>
        </div>
        
        <div className="text-left md:text-right flex flex-col items-start md:items-end w-full md:w-auto">
          <p className="text-cyan-700 text-[8px] md:text-[9px] leading-tight md:text-right">
             **** 56485788456594994<br/>
             *** 43698744669097645
          </p>
        </div>
      </header>

      {/* MAIN STACKED LAYOUT (Fully Expanded Vertically) */}
      <div className="flex-1 flex flex-col gap-6 md:gap-8 relative z-10 w-full">
        
        {/* MODULE 1: FINANCIALS & LIVE BLEED */}
        <div className="w-full border border-cyan-900/40 bg-black/40 p-4 md:p-8 relative shadow-[0_0_15px_rgba(6,182,212,0.05)]">
          <div className="absolute top-4 right-4 flex items-center justify-center opacity-50 md:opacity-100">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border border-red-500/50 flex flex-col items-center justify-center bg-black/50">
               <span className="text-2xl md:text-3xl text-red-500 font-bold leading-none tracking-tighter">CS</span>
               <span className="text-[5px] md:text-[6px] text-red-400 tracking-[0.4em] mt-1">TELEMETRY</span>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
            <div className="flex-1">
              <h3 className="text-cyan-700 text-[10px] md:text-xs mb-2 border-b border-cyan-900/50 pb-1">Q_LEAKAGE // PROJECTED</h3>
              <div className="text-4xl md:text-6xl font-normal text-white tracking-[0.1em] drop-shadow-[0_0_8px_rgba(255,255,255,0.4)] mt-2">
                 {financialData ? `£${(financialData.projectedQuarterlyLeakage || 0).toLocaleString()}` : '£0'}
              </div>

              <div className="grid grid-cols-8 sm:grid-cols-16 gap-1 mt-6 text-[8px] text-cyan-800 leading-none opacity-80 max-w-2xl">
                 {numberMatrix.map((num, i) => (
                    <span key={i} className={i % 7 === 0 ? 'text-cyan-500' : ''}>{num}</span>
                 ))}
              </div>
            </div>

            <div className="flex-1 border-l-2 border-red-600/80 pl-4 md:pl-6 py-2 flex flex-col justify-center">
              <h3 className="text-red-700 text-[10px] md:text-xs mb-2">LIVE_BLEED_DETECTION</h3>
              <div className="text-3xl md:text-5xl font-bold text-red-500 tabular-nums drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]">
                 £{(liveBleedAmount || 0).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              
              <div className="space-y-3 pt-6 w-full max-w-md">
                 <div className="flex items-center gap-3">
                   <span className="text-cyan-700 w-4 text-[9px]">S1</span>
                   <div className="h-[2px] flex-1 bg-cyan-950 relative overflow-hidden">
                      <div className="absolute left-0 top-0 h-full bg-cyan-600 w-3/4"></div>
                   </div>
                 </div>
                 <div className="flex items-center gap-3">
                   <span className="text-cyan-700 w-4 text-[9px]">S2</span>
                   <div className="h-[2px] flex-1 bg-cyan-950 relative overflow-hidden">
                      <div className="absolute left-0 top-0 h-full bg-red-600 w-1/2"></div>
                   </div>
                 </div>
                 <div className="flex items-center gap-3">
                   <span className="text-cyan-700 w-4 text-[9px]">S3</span>
                   <div className="h-[2px] flex-1 bg-cyan-950 relative overflow-hidden">
                      <div className="absolute left-0 top-0 h-full bg-cyan-800 w-11/12"></div>
                   </div>
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* MODULE 2: DIAGNOSTICS & FRICTION */}
        <div className="w-full border border-cyan-900/40 bg-black/40 p-4 md:p-8 relative flex flex-col lg:flex-row gap-8 shadow-[0_0_15px_rgba(6,182,212,0.05)]">
          
          <div className="flex-1 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-cyan-900/30 pb-6 lg:pb-0 lg:pr-8">
            <div>
              <h2 className="text-xl md:text-2xl text-cyan-200 tracking-[0.2em] mb-4">R02/01</h2>
              <div className="text-[9px] md:text-[10px] text-cyan-700 mb-6 leading-relaxed">
                <p>■ T_ID: {financialData?.tenantId || 'LOADING...'}</p>
                <p>■ CLIENT: {financialData?.businessName || 'UNKNOWN'}</p>
                <p>■ SYS.TIME: {new Date().toISOString()}</p>
                <p className="mt-2 text-cyan-800">TUVWXYZ ABC DEFG</p>
              </div>

              <div className="border border-cyan-900/40 bg-cyan-950/10 p-4 relative">
                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-cyan-500"></div>
                <h3 className="text-[10px] md:text-xs text-cyan-500 mb-3 border-b border-cyan-900/50 pb-2">STRUCTURAL_HEALTH</h3>
                <div className={`text-[10px] md:text-xs text-cyan-400/80 leading-loose text-justify ${isLoading ? 'animate-pulse' : ''}`}>
                  {briefing}
                </div>
                
                {!isLoading && (
                  <div className="mt-6 pt-4 border-t border-cyan-900/30">
                    <button 
                      onClick={() => setShowDetailedExplanation(!showDetailedExplanation)}
                      className="text-cyan-600 hover:text-cyan-300 transition-colors cursor-pointer"
                    >
                      {showDetailedExplanation ? "[ TERMINATE_TRACE ]" : "[ INITIATE_NEURAL_PATHWAY_TRACE ]"}
                    </button>
                    {showDetailedExplanation && (
                      <div className="mt-4 w-full">
                        <IncidentTimeline />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-8 flex gap-4 items-end">
              <div className="text-5xl md:text-6xl text-cyan-400 font-black tracking-tighter leading-none">T1</div>
              <div className="border border-yellow-500/50 bg-yellow-500/10 text-yellow-500 px-3 py-1 font-bold tracking-widest text-[10px] md:text-xs">
                LIVE TELEMETRY
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-start pt-4 lg:pt-0">
             <h3 className="text-cyan-700 text-[10px] md:text-xs mb-4">RAW_STREAM_DATA</h3>
             
             {frictionData && (
              <div className="space-y-3 text-[10px] md:text-xs mb-6 bg-cyan-950/5 p-4 border border-cyan-900/30">
                <div className="flex gap-3 items-center">
                   <div className="bg-cyan-800 text-black px-2 py-0.5">R1</div>
                   <div className="border border-cyan-900/50 px-2 py-0.5 text-cyan-500 flex-1 overflow-hidden whitespace-nowrap overflow-ellipsis">
                     {frictionData.elementId}
                   </div>
                   <div className="text-red-400 font-bold">{frictionData.rageClicks} ERR</div>
                </div>
                <div className="flex gap-3 items-center">
                   <div className="bg-cyan-800 text-black px-2 py-0.5">R2</div>
                   <div className="border border-cyan-900/50 px-2 py-0.5 text-cyan-500 flex-1 overflow-hidden whitespace-nowrap overflow-ellipsis">
                     {frictionData.apiEndpoint}
                   </div>
                   <div className="text-purple-400 font-bold">{frictionData.latencyMs}ms</div>
                </div>
              </div>
            )}

             <div className="opacity-80 hover:opacity-100 transition-opacity w-full">
               <LiveBleedTicker events={frictionData?.recentEvents || []} />
             </div>
          </div>
        </div>

        {/* MODULE 3: MAP & REMEDIATION TERMINAL */}
        <div className="w-full border border-cyan-900/40 bg-black/40 p-4 md:p-8 relative min-h-[500px] flex flex-col items-center shadow-[0_0_15px_rgba(6,182,212,0.05)]">
          <div className="absolute inset-0 flex items-start justify-center opacity-30 pt-8 pointer-events-none overflow-hidden">
             <svg viewBox="0 0 800 400" className="w-full max-w-4xl drop-shadow-[0_0_5px_rgba(6,182,212,0.8)]">
               <g stroke="currentColor" strokeWidth="0.5" fill="none" className="text-cyan-600">
                 <path d="M100,200 L300,100 L450,250 L600,150 L750,220" />
                 <path d="M150,300 L350,200 L500,100 L650,280" />
                 <path d="M250,50 L400,200 L550,300 L700,50" />
               </g>
               <circle cx="300" cy="100" r="3" fill="#67e8f9" className="animate-pulse" />
               <circle cx="450" cy="250" r="2" fill="#67e8f9" />
               <circle cx="600" cy="150" r="4" fill="#67e8f9" className="animate-pulse" />
               <circle cx="350" cy="200" r="4" fill="#ef4444" className="animate-ping" /> 
               <circle cx="550" cy="300" r="2" fill="#67e8f9" />
             </svg>
          </div>

          <div className="z-10 bg-black/70 px-6 py-2 border border-cyan-900/50 backdrop-blur-sm text-center mb-8 inline-block">
            <p className="text-cyan-500 text-[9px] md:text-[10px] tracking-[0.3em]">
               GLOBAL TELEMETRY NETWORK // ACTIVE MONITORING
            </p>
          </div>
          
          <div className="relative z-20 w-full max-w-5xl mx-auto flex-1 flex flex-col">
            {financialData?.tenantId && (
              <RemediationTerminal tenantId={financialData.tenantId} />
            )}
          </div>
        </div>

      </div>

      {/* BOTTOM WAVEFORMS & RULER */}
      <footer className="mt-8 pt-4 border-t border-cyan-900/40 flex justify-between items-end shrink-0 relative z-10 hidden md:flex w-full">
        <div className="flex items-end gap-1 h-6">
           {[...Array(30)].map((_, i) => (
             <div 
                key={i} 
                className="w-1 bg-cyan-700/60"
                style={{
                  height: `${Math.max(20, Math.random() * 100)}%`,
                  animation: `pulse ${1 + Math.random()}s infinite alternate`
                }}
             ></div>
           ))}
        </div>
        
        <div className="flex items-end h-4 w-1/3 border-b border-cyan-900/50 px-2 justify-between opacity-50">
           {[...Array(30)].map((_, i) => (
             <div key={i} className={`w-px bg-cyan-600 ${i % 5 === 0 ? 'h-full' : 'h-1/2'}`}></div>
           ))}
        </div>

        <div className="flex gap-2 text-[10px]">
           <div className="border border-cyan-800 px-3 py-1 text-cyan-500">60</div>
           <div className="border border-cyan-800 px-3 py-1 text-cyan-500">72</div>
        </div>
      </footer>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes pulse {
          0% { opacity: 0.4; transform: scaleY(0.5); transform-origin: bottom; }
          100% { opacity: 1; transform: scaleY(1); transform-origin: bottom; }
        }
      `}} />
    </div>
  );
}