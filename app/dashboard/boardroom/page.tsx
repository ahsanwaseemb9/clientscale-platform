// app/dashboard/boardroom/page.tsx
'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import LiveBleedTicker from '../../components/LiveBleedTicker';
import IncidentTimeline from '../../components/IncidentTimeline';
import RemediationTerminal from '../../components/RemediationTerminal';

// WebGL 3D Scatter Plot & Constellation Mesh
const DataConstellation = ({ rageClicks, latency }: { rageClicks: number, latency: number }) => {
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);

  const particleCount = 350;
  
  // Re-calculate the geometry only when live telemetry data changes
  const { positions, colors, indices } = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const indices = [];

    const colorHealthy = new THREE.Color('#22d3ee'); // Bright Cyan
    const colorFriction = new THREE.Color('#ff2a2a'); // Neon Red

    // Visually amplify rage clicks slightly so they command attention in a 350-node matrix
    const targetFrictionNodes = Math.min(rageClicks * 1.5, particleCount * 0.8);
    let assignedFrictionNodes = 0;

    for (let i = 0; i < particleCount; i++) {
      const t = (i / particleCount) * Math.PI * 4;
      const radius = 3 + Math.random() * 2;
      const x = Math.cos(t) * radius + (Math.random() - 0.5) * 2.5;
      const y = (Math.random() - 0.5) * 3;
      const z = Math.sin(t) * radius + (Math.random() - 0.5) * 2.5;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      // Assign red nodes strictly based on the live rage click data
      let isFriction = false;
      if (assignedFrictionNodes < targetFrictionNodes && Math.random() > 0.4) {
        isFriction = true;
        assignedFrictionNodes++;
      }
      
      const mixedColor = isFriction ? colorFriction : colorHealthy;
      
      colors[i * 3] = mixedColor.r;
      colors[i * 3 + 1] = mixedColor.g;
      colors[i * 3 + 2] = mixedColor.b;
    }

    for (let i = 0; i < particleCount; i++) {
      for (let j = i + 1; j < particleCount; j++) {
        const dx = positions[i * 3] - positions[j * 3];
        const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
        const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (dist < 1.6) {
          indices.push(i, j);
        }
      }
    }

    return { 
      positions, 
      colors, 
      indices: new Uint16Array(indices) 
    };
  }, [rageClicks]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (pointsRef.current && linesRef.current) {
      // Base rotation speed amplified by structural latency bottlenecks
      const speedMultiplier = 0.04 + (latency * 0.00004); 
      
      pointsRef.current.rotation.y = time * speedMultiplier;
      linesRef.current.rotation.y = time * speedMultiplier;
      pointsRef.current.rotation.x = Math.sin(time * 0.1) * 0.15;
      linesRef.current.rotation.x = Math.sin(time * 0.1) * 0.15;
    }
  });

  return (
    <group>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
          <bufferAttribute attach="attributes-color" count={colors.length / 3} array={colors} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial 
          size={0.18} 
          vertexColors 
          transparent 
          opacity={1} 
          sizeAttenuation={true} 
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
          <bufferAttribute attach="attributes-color" count={colors.length / 3} array={colors} itemSize={3} />
          <bufferAttribute attach="index" array={indices} itemSize={1} />
        </bufferGeometry>
        <lineBasicMaterial 
          vertexColors 
          transparent 
          opacity={0.6} 
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>
    </group>
  );
};

export default function BoardroomDashboard() {
  const [showDetailedExplanation, setShowDetailedExplanation] = useState(false);
  const [briefing, setBriefing] = useState('Synthesizing operational risk and capital concentration nodes...');
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  
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
  const [sysTime, setSysTime] = useState<string>('');

  useEffect(() => {
    setMounted(true);
    setSysTime(new Date().toISOString());

    async function loadLiveDashboard() {
      try {
        const dbResponse = await fetch('/api/financials');
        const dbResult = await dbResponse.json();

        if (!dbResult?.success || !dbResult?.data) {
          setBriefing("Awaiting baseline data. Deploy the telemetry pixel to visualize market friction.");
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

        const elementId = liveData?.friction_element_id || 'checkout-submit';
        const rageClicks = Number(liveData?.rage_clicks) || 42;
        const apiEndpoint = liveData?.api_endpoint || '/api/process-payment';
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
            primaryFriction: `${rageClicks} user abandonments on '${elementId}' creating a structural profit drag, exacerbated by ${latencyMs}ms delay on ${apiEndpoint}`
          })
        });
        
        const aiData = await aiResponse.json();
        if (aiData?.success && aiData?.briefing) {
          setBriefing(aiData.briefing);
        } else {
          setBriefing("Error calculating operational risk.");
        }
      } catch (error) {
        console.error("Dashboard Load Error:", error);
        setBriefing("Failed to connect to the capital intelligence stream.");
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

  return (
    <div className="min-h-screen bg-[#020612] text-cyan-500 font-mono uppercase overflow-hidden relative flex flex-col p-3 md:p-6 selection:bg-cyan-900 selection:text-white text-[10px] md:text-xs tracking-widest w-full">
      
      {/* Background Volumetric Glow & CRT Effect */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(6,182,212,0.05),transparent_70%)] pointer-events-none z-0"></div>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] pointer-events-none z-0 mix-blend-overlay"></div>
      
      {/* TOP EXECUTIVE RULER */}
      <header className="border-b border-cyan-800/40 pb-3 mb-6 shrink-0 flex flex-col md:flex-row justify-between items-start md:items-end w-full relative z-10 gap-4">
        <div className="flex items-center gap-4 md:gap-6">
          <h1 className="text-lg md:text-2xl font-bold tracking-[0.2em] text-cyan-300 drop-shadow-[0_0_5px_rgba(103,232,249,0.5)]">
            CAPITAL EXPOSURE // OPERATIONAL RISK
          </h1>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 md:w-8 md:h-8 rounded-full border border-cyan-600 flex items-center justify-center text-[8px] md:text-[9px] text-cyan-300 shadow-[0_0_8px_rgba(34,211,238,0.4)]">95%</div>
            <div className="w-6 h-6 md:w-8 md:h-8 rounded-full border border-red-800 flex items-center justify-center text-[8px] md:text-[9px] text-red-500 animate-pulse">5%</div>
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
             PORTFOLIO REVENUE BURN<br/>
             SYSTEM AUDIT: VERIFIED ACTIVE
          </p>
        </div>
      </header>

      {/* MAIN STACKED LAYOUT (Fully Expanded Vertically) */}
      <div className="flex-1 flex flex-col gap-6 md:gap-8 relative z-10 w-full">
        
        {/* MODULE 1: VOLUMETRIC SCATTER PLOT & PULSING HEARTBEAT */}
        <div className="w-full border border-cyan-900/40 bg-black/40 p-4 md:p-8 relative shadow-[0_0_15px_rgba(6,182,212,0.05)] rounded-xl">
          <div className="absolute top-4 right-4 flex items-center justify-center opacity-50 md:opacity-100 z-10">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border border-red-500/50 flex flex-col items-center justify-center bg-black/50">
               <span className="text-2xl md:text-3xl text-red-500 font-bold leading-none tracking-tighter">CS</span>
               <span className="text-[5px] md:text-[6px] text-red-400 tracking-[0.4em] mt-1">CAPITAL</span>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
            <div className="flex-1 relative z-10">
              <h3 className="text-cyan-700 text-[10px] md:text-xs mb-2 border-b border-cyan-900/50 pb-1 flex justify-between">
                <span>CAPITAL CONCENTRATION // PROFIT DRAG</span>
                <span className="text-cyan-500">90-DAY PROJECTION</span>
              </h3>
              <div className="text-4xl md:text-6xl font-normal text-white tracking-[0.1em] drop-shadow-[0_0_8px_rgba(255,255,255,0.4)] mt-2">
                 {financialData ? `£${(financialData.projectedQuarterlyLeakage || 0).toLocaleString()}` : '£0'}
              </div>

              {/* Data Constellation WebGL Canvas Wired to Telemetry */}
              <div className="h-48 md:h-64 w-full mt-6 relative max-w-2xl bg-black/40 border border-cyan-900/40 rounded-xl overflow-hidden shadow-[inset_0_0_20px_rgba(6,182,212,0.1)]">
                <Canvas camera={{ position: [0, 1.5, 5.5], fov: 50 }}>
                  {frictionData ? (
                    <DataConstellation 
                      rageClicks={frictionData.rageClicks} 
                      latency={frictionData.latencyMs} 
                    />
                  ) : null}
                </Canvas>
                <div className="absolute bottom-3 left-4 text-cyan-600 text-[8px] pointer-events-none tracking-widest flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#22d3ee]"></span>
                  LIVE NODE TOPOGRAPHY // TELEMETRY SYNCED
                </div>
              </div>
            </div>

            <div className="flex-1 border-l-2 border-red-600/80 pl-4 md:pl-8 py-2 flex flex-col justify-center relative bg-gradient-to-r from-red-950/10 to-transparent">
              <div className="absolute left-[-6px] top-8 w-2 h-2 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,1)] animate-ping"></div>
              
              <h3 className="text-red-500 text-[10px] md:text-xs mb-2 font-bold tracking-widest">
                URGENT OPERATIONAL HEARTBEAT
              </h3>
              <div className="text-4xl md:text-6xl font-black text-red-500 tabular-nums drop-shadow-[0_0_15px_rgba(239,68,68,0.6)]">
                 £{(liveBleedAmount || 0).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <p className="text-red-400/60 text-[9px] mt-2">LIVE REVENUE BLEED // COST OF DELAY IN REAL-TIME</p>
              
              <div className="space-y-3 pt-8 w-full max-w-md">
                 <div className="flex items-center gap-3">
                   <span className="text-cyan-700 w-16 text-[9px]">PIPELINE 1</span>
                   <div className="h-[2px] flex-1 bg-cyan-950 relative overflow-hidden">
                      <div className="absolute left-0 top-0 h-full bg-cyan-600 w-3/4"></div>
                   </div>
                 </div>
                 <div className="flex items-center gap-3">
                   <span className="text-cyan-700 w-16 text-[9px]">CHECKOUT</span>
                   <div className="h-[2px] flex-1 bg-cyan-950 relative overflow-hidden">
                      <div className="absolute left-0 top-0 h-full bg-red-600 w-1/2"></div>
                   </div>
                 </div>
                 <div className="flex items-center gap-3">
                   <span className="text-cyan-700 w-16 text-[9px]">RETENTION</span>
                   <div className="h-[2px] flex-1 bg-cyan-950 relative overflow-hidden">
                      <div className="absolute left-0 top-0 h-full bg-cyan-800 w-11/12"></div>
                   </div>
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* MODULE 2: FRICTION MESH & EXECUTIVE RISK */}
        <div className="w-full border border-cyan-900/40 bg-black/40 p-4 md:p-8 relative flex flex-col lg:flex-row gap-8 shadow-[0_0_15px_rgba(6,182,212,0.05)] rounded-xl">
          
          <div className="flex-1 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-cyan-900/30 pb-6 lg:pb-0 lg:pr-8">
            <div>
              <h2 className="text-xl md:text-2xl text-cyan-200 tracking-[0.2em] mb-4">EXECUTIVE RISK SUMMARY</h2>
              <div className="text-[9px] md:text-[10px] text-cyan-700 mb-6 leading-relaxed">
                <p>■ TENANT ID: {financialData?.tenantId || 'LOADING...'}</p>
                <p>■ ENTERPRISE CLIENT: {financialData?.businessName || 'UNKNOWN'}</p>
                <p>■ REPORT TIMESTAMP: {mounted ? sysTime : 'SYNCING...'}</p>
                <p className="mt-2 text-cyan-800 font-bold">AUDIT PROTOCOL: DEFENSIVE REVENUE PRESERVATION</p>
              </div>

              <div className="border border-cyan-900/40 bg-cyan-950/10 p-4 relative">
                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-cyan-500"></div>
                <h3 className="text-[10px] md:text-xs text-cyan-500 mb-3 border-b border-cyan-900/50 pb-2">PROFITABILITY & OPERATIONAL HEALTH</h3>
                <div className={`text-[10px] md:text-xs text-cyan-400/80 leading-loose text-justify ${isLoading ? 'animate-pulse' : ''}`}>
                  {briefing}
                </div>
                
                {!isLoading && (
                  <div className="mt-6 pt-4 border-t border-cyan-900/30">
                    <button 
                      onClick={() => setShowDetailedExplanation(!showDetailedExplanation)}
                      className="text-cyan-600 hover:text-cyan-300 transition-colors cursor-pointer"
                    >
                      {showDetailedExplanation ? "[ HIDE STRUCTURAL INCIDENT TIMELINE ]" : "[ VIEW STRUCTURAL INCIDENT TIMELINE ]"}
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
              <div className="text-5xl md:text-6xl text-cyan-400 font-black tracking-tighter leading-none">ROI</div>
              <div className="border border-yellow-500/50 bg-yellow-500/10 text-yellow-500 px-3 py-1 font-bold tracking-widest text-[10px] md:text-xs">
                EXECUTIVE PRIORITY: HIGH
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-start pt-4 lg:pt-0">
             <h3 className="text-cyan-700 text-[10px] md:text-xs mb-4">STRUCTURAL RESISTANCE // MARKET FRICTION</h3>
             
             {frictionData && (
              <div className="space-y-3 text-[10px] md:text-xs mb-6 bg-cyan-950/5 p-4 border border-cyan-900/30">
                <div className="flex gap-3 items-center">
                   <div className="bg-cyan-800 text-black px-2 py-0.5">ACQUISITION NODE</div>
                   <div className="border border-cyan-900/50 px-2 py-0.5 text-cyan-500 flex-1 overflow-hidden whitespace-nowrap overflow-ellipsis">
                     {frictionData.elementId}
                   </div>
                   <div className="text-red-400 font-bold">{frictionData.rageClicks} ABANDONED</div>
                </div>
                <div className="flex gap-3 items-center">
                   <div className="bg-cyan-800 text-black px-2 py-0.5">STRUCTURAL BLOCK</div>
                   <div className="border border-cyan-900/50 px-2 py-0.5 text-cyan-500 flex-1 overflow-hidden whitespace-nowrap overflow-ellipsis">
                     {frictionData.apiEndpoint}
                   </div>
                   <div className="text-purple-400 font-bold">{frictionData.latencyMs}ms DELAY</div>
                </div>
              </div>
            )}

             <div className="opacity-80 hover:opacity-100 transition-opacity w-full">
               <LiveBleedTicker events={frictionData?.recentEvents || []} />
             </div>
          </div>
        </div>

        {/* MODULE 3: TOPOGRAPHIC MESH GRID & REMEDIATION TERMINAL */}
        <div className="w-full border border-cyan-900/40 bg-black/40 p-4 md:p-8 relative min-h-[500px] flex flex-col items-center shadow-[0_0_15px_rgba(6,182,212,0.05)] overflow-hidden rounded-xl">
          
          {/* Topographic Mesh Grid Overlay */}
          <div className="absolute inset-0 flex items-end justify-center opacity-40 pointer-events-none">
             <svg viewBox="0 0 1000 400" className="w-full h-full drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]">
               <defs>
                 <linearGradient id="grid-fade" x1="0%" y1="0%" x2="0%" y2="100%">
                   <stop offset="0%" stopColor="#0891b2" stopOpacity="0.8" />
                   <stop offset="100%" stopColor="#0891b2" stopOpacity="0" />
                 </linearGradient>
               </defs>
               <g stroke="url(#grid-fade)" strokeWidth="1" fill="none">
                 <path d="M-100,200 Q250,50 500,250 T1100,100" className="animate-[pulse_5s_ease-in-out_infinite]" />
                 <path d="M-50,280 Q300,150 600,320 T1100,200" className="animate-[pulse_7s_ease-in-out_infinite]" />
                 <path d="M0,350 Q400,200 800,380 T1100,300" strokeWidth="0.5" />
               </g>
               
               {/* Glowing Market Friction Nodes */}
               <circle cx="280" cy="140" r="4" fill="#ef4444" className="animate-ping" />
               <circle cx="280" cy="140" r="2" fill="#fff" />
               
               <circle cx="560" cy="270" r="6" fill="#22d3ee" className="animate-pulse" />
               <circle cx="560" cy="270" r="2" fill="#fff" />
               
               <circle cx="850" cy="360" r="5" fill="#a855f7" className="animate-pulse" />
             </svg>
          </div>

          <div className="z-10 bg-black/70 px-6 py-2 border border-cyan-900/50 backdrop-blur-sm text-center mb-8 inline-block shadow-[0_0_10px_rgba(34,211,238,0.2)]">
            <p className="text-cyan-500 text-[9px] md:text-[10px] tracking-[0.3em] font-bold">
               MACRO VIEW // MARKET FRICTION TOPOGRAPHY
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
                  height: `${Math.max(20, ((i * 37) % 80))}%`,
                  animation: `pulse ${1 + (i % 2)}s infinite alternate`
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
           <div className="border border-cyan-800 px-3 py-1 text-cyan-500">UPTIME 99.9%</div>
           <div className="border border-cyan-800 px-3 py-1 text-cyan-500">SECURE</div>
        </div>
      </footer>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes pulse {
          0% { opacity: 0.5; transform: scaleY(0.8); transform-origin: bottom; }
          100% { opacity: 1; transform: scaleY(1); transform-origin: bottom; }
        }
      `}} />
    </div>
  );
}