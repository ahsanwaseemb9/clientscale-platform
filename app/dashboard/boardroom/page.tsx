'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import LiveBleedTicker from '../../components/LiveBleedTicker';
import IncidentTimeline from '../../components/IncidentTimeline';
import RemediationTerminal from '../../components/RemediationTerminal';

// WebGL 3D Scatter Plot & Constellation Mesh
const DataConstellation = ({ rageClicks, latency }: { rageClicks: number; latency: number }) => {
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);

  const particleCount = 350;
  
  const { positions, colors, indices } = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const indices: number[] = [];

    const colorHealthy = new THREE.Color('#22d3ee'); 
    const colorFriction = new THREE.Color('#ff2a2a'); 

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
          <bufferAttribute attach="index" array={indices} itemSize={1} count={indices.length} />
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
  const router = useRouter();
  const [showDetailedExplanation, setShowDetailedExplanation] = useState(false);
  const [briefing, setBriefing] = useState('Synthesizing operational risk and capital concentration nodes...');
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  
  const [financialData, setFinancialData] = useState<{
    tenantId: string;
    businessName: string;
    projectedQuarterlyLeakage: number;
    dailyLeakage: number;
  } | null>(null);

  const [frictionData, setFrictionData] = useState<{
    elementId: string;
    rageClicks: number;
    apiEndpoint: string;
    latencyMs: number;
    recentEvents: any[];
  } | null>(null);

  const [liveBleedAmount, setLiveBleedAmount] = useState<number>(0);
  const [sysTime, setSysTime] = useState<string>('');

  useEffect(() => {
    let isSubscribed = true;
    setMounted(true);
    setSysTime(new Date().toISOString());

    async function loadLiveDashboard() {
      try {
        const dbResponse = await fetch('/api/financials');
        const dbResult = await dbResponse.json();

        if (!isSubscribed) return;

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
        if (!isSubscribed) return;

        if (aiData?.success && aiData?.briefing) {
          setBriefing(aiData.briefing);
        } else {
          setBriefing("Error calculating operational risk.");
        }
      } catch (error) {
        console.error("Dashboard Load Error:", error);
        if (isSubscribed) {
          setBriefing("Failed to connect to the capital intelligence stream.");
        }
      } finally {
        if (isSubscribed) {
          setIsLoading(false);
        }
      }
    }

    loadLiveDashboard();

    return () => {
      isSubscribed = false;
    };
  }, []);

  useEffect(() => {
    if (!financialData) return;
    const perSecondRate = financialData.dailyLeakage / 86400;
    const interval = setInterval(() => {
      setLiveBleedAmount((prev) => prev + (perSecondRate / 10));
    }, 100);
    return () => clearInterval(interval);
  }, [financialData]);

  return (
    <div className="min-h-screen bg-[#020612] text-cyan-500 font-mono uppercase overflow-x-hidden relative flex flex-col p-3 md:p-6 selection:bg-cyan-900 selection:text-white text-[10px] md:text-xs tracking-widest w-full">
      
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(6,182,212,0.05),transparent_70%)] pointer-events-none z-0"></div>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] pointer-events-none z-0 mix-blend-overlay"></div>
      
      <header className="border-b border-cyan-800/40 pb-3 mb-6 shrink-0 flex flex-col md:flex-row justify-between items-start md:items-end w-full relative z-10 gap-4">
        <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-6 w-full md:w-auto">
          <h1 className="text-base sm:text-lg md:text-2xl font-bold tracking-[0.1em] md:tracking-[0.2em] text-cyan-300 drop-shadow-[0_0_5px_rgba(103,232,249,0.5)] whitespace-normal break-words pr-12 md:pr-0 leading-tight">
            CAPITAL EXPOSURE // <br className="md:hidden" />OPERATIONAL RISK
          </h1>
          <div className="flex items-center gap-2 absolute md:relative top-0 right-0 md:top-auto md:right-auto">
            <div className="w-6 h-6 md:w-8 md:h-8 rounded-full border border-cyan-600 flex items-center justify-center text-[8px] md:text-[9px] text-cyan-300 shadow-[0_0_8px_rgba(34,211,238,0.4)] shrink-0">95%</div>
            <div className="w-6 h-6 md:w-8 md:h-8 rounded-full border border-red-800 flex items-center justify-center text-[8px] md:text-[9px] text-red-500 animate-pulse shrink-0">5%</div>
          </div>
        </div>
        
        <div className="flex-1 w-full mx-4 lg:mx-8 hidden md:block">
          <div className="flex justify-between text-cyan-800 text-[9px] border-b border-cyan-900/50 pb-1 relative w-full">
             {[100, 110, 120, 125, 130, 135, 140, 145, 150, 155, 160, 165, 170, 175, 180, 185, 190, 200].map((num) => (
                <div key={num} className="relative flex flex-col items-center flex-1">
                  <span>{num}</span>
                  <div className="w-px h-2 bg-cyan-800 absolute -bottom-1"></div>
                </div>
             ))}
          </div>
        </div>
        
        <div className="text-left md:text-right flex flex-col items-start md:items-end w-full md:w-auto mt-2 md:mt-0">
          <p className="text-cyan-700 text-[8px] md:text-[9px] leading-tight md:text-right w-full">
             PORTFOLIO REVENUE BURN<br/>
             SYSTEM AUDIT: VERIFIED ACTIVE
          </p>
        </div>
      </header>

      <div className="flex-1 flex flex-col gap-6 md:gap-8 relative z-10 w-full">
        
        {/* MAIN EXECUTIVE DASHBOARD CARD */}
        <div className="w-full border border-cyan-900/40 bg-black/40 p-4 md:p-8 relative shadow-[0_0_15px_rgba(6,182,212,0.05)] rounded-xl">
          <div className="flex justify-between items-start border-b border-cyan-900/50 pb-3 mb-4 md:border-b-0 md:pb-0 md:mb-0 md:absolute md:top-4 md:right-4 z-10">
            <div className="block md:hidden">
              <span className="text-[9px] text-cyan-500 block leading-tight">CAPITAL CONCENTRATION // PROFIT DRAG</span>
              <span className="text-[8px] text-cyan-700 block mt-0.5">90-DAY PROJECTION</span>
            </div>
            <div className="w-14 h-14 md:w-20 md:h-20 rounded-full border border-red-500/50 flex flex-col items-center justify-center bg-black/80 md:bg-black/50 shrink-0">
               <span className="text-xl md:text-3xl text-red-500 font-bold leading-none tracking-tighter">CS</span>
               <span className="text-[4px] md:text-[6px] text-red-400 tracking-[0.4em] mt-1">CAPITAL</span>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-6 md:gap-8 lg:gap-12 w-full">
            <div className="flex-1 relative z-10 w-full">
              <h3 className="hidden md:flex text-cyan-700 text-[9px] md:text-xs mb-2 border-b border-cyan-900/50 pb-2 justify-between">
                <span className="whitespace-normal break-words leading-snug">CAPITAL CONCENTRATION // PROFIT DRAG</span>
                <span className="text-cyan-500">90-DAY PROJECTION</span>
              </h3>
              <div className="text-3xl sm:text-5xl md:text-7xl font-normal text-white tracking-[0.05em] md:tracking-[0.1em] drop-shadow-[0_0_8px_rgba(255,255,255,0.4)] mt-1 md:mt-2">
                 {financialData ? `£${(financialData.projectedQuarterlyLeakage || 0).toLocaleString()}` : '£0'}
              </div>

              <div className="h-48 sm:h-64 md:h-80 lg:h-[350px] w-full mt-4 md:mt-6 relative bg-black/40 border border-cyan-900/40 rounded-xl overflow-hidden shadow-[inset_0_0_20px_rgba(6,182,212,0.1)]">
                {mounted && (
                  <Canvas camera={{ position: [0, 1.5, 5.5], fov: 50 }}>
                    {frictionData ? (
                      <DataConstellation 
                        rageClicks={frictionData.rageClicks} 
                        latency={frictionData.latencyMs} 
                      />
                    ) : null}
                  </Canvas>
                )}
                <div className="absolute bottom-2 md:bottom-3 left-2 md:left-4 text-cyan-600 text-[7px] md:text-[8px] pointer-events-none tracking-widest flex items-center gap-1.5 md:gap-2 bg-black/50 px-2 py-1 rounded">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#22d3ee]"></span>
                  LIVE NODE TOPOGRAPHY // SYNCED
                </div>
              </div>
            </div>

            <div className="flex-1 border-t-2 md:border-t-0 md:border-l-2 border-red-600/80 pt-4 md:pt-0 pl-0 md:pl-8 lg:pl-12 py-2 flex flex-col justify-center relative bg-gradient-to-b md:bg-gradient-to-r from-red-950/10 to-transparent w-full">
              <div className="absolute left-1/2 -top-[3px] md:left-[-6px] md:top-8 w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,1)] animate-ping -translate-x-1/2 md:translate-x-0"></div>
              
              <h3 className="text-red-500 text-[9px] md:text-xs mb-2 font-bold tracking-widest text-center md:text-left mt-2 md:mt-0">
                URGENT OPERATIONAL HEARTBEAT
              </h3>
              <div className="text-3xl sm:text-5xl md:text-7xl font-black text-red-500 tabular-nums drop-shadow-[0_0_15px_rgba(239,68,68,0.6)] text-center md:text-left">
                 £{(liveBleedAmount || 0).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <p className="text-red-400/60 text-[8px] md:text-[9px] mt-1 md:mt-2 text-center md:text-left whitespace-normal break-words">LIVE REVENUE BLEED // COST OF DELAY IN REAL-TIME</p>
              
              <div className="space-y-4 pt-6 md:pt-8 w-full">
                 <div className="flex items-center gap-2 md:gap-4">
                   <span className="text-cyan-700 w-16 md:w-24 text-[8px] md:text-[10px]">PIPELINE</span>
                   <div className="h-[3px] flex-1 bg-cyan-950 relative overflow-hidden rounded-full">
                      <div className="absolute left-0 top-0 h-full bg-cyan-600 w-3/4"></div>
                   </div>
                 </div>
                 <div className="flex items-center gap-2 md:gap-4">
                   <span className="text-cyan-700 w-16 md:w-24 text-[8px] md:text-[10px]">CHECKOUT</span>
                   <div className="h-[3px] flex-1 bg-cyan-950 relative overflow-hidden rounded-full">
                      <div className="absolute left-0 top-0 h-full w-1/2 bg-red-600"></div>
                   </div>
                 </div>
                 <div className="flex items-center gap-2 md:gap-4">
                   <span className="text-cyan-700 w-16 md:w-24 text-[8px] md:text-[10px]">RETENTION</span>
                   <div className="h-[3px] flex-1 bg-cyan-950 relative overflow-hidden rounded-full">
                      <div className="absolute left-0 top-0 h-full bg-cyan-800 w-11/12"></div>
                   </div>
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* RISK & FRICTION SUMMARY ROW */}
        <div className="w-full border border-cyan-900/40 bg-black/40 p-4 md:p-8 relative flex flex-col lg:flex-row gap-6 md:gap-8 shadow-[0_0_15px_rgba(6,182,212,0.05)] rounded-xl">
          
          <div className="flex-1 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-cyan-900/30 pb-6 lg:pb-0 lg:pr-8 w-full">
            <div>
              <h2 className="text-lg md:text-2xl text-cyan-200 tracking-[0.1em] md:tracking-[0.2em] mb-4 whitespace-normal break-words">EXECUTIVE RISK SUMMARY</h2>
              <div className="text-[8px] md:text-[10px] text-cyan-700 mb-4 md:mb-6 leading-relaxed w-full">
                <p className="whitespace-normal break-words">■ TENANT ID: {financialData?.tenantId || 'LOADING...'}</p>
                <p className="whitespace-normal break-words">■ ENTERPRISE CLIENT: {financialData?.businessName || 'UNKNOWN'}</p>
                <p className="whitespace-normal break-words">■ REPORT TIMESTAMP: {mounted ? sysTime : 'SYNCING...'}</p>
                <p className="mt-2 text-cyan-800 font-bold whitespace-normal break-words">AUDIT PROTOCOL: DEFENSIVE REVENUE PRESERVATION</p>
              </div>

              <div className="border border-cyan-900/40 bg-cyan-950/10 p-4 md:p-6 relative">
                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-cyan-500"></div>
                <h3 className="text-[9px] md:text-xs text-cyan-500 mb-2 md:mb-3 border-b border-cyan-900/50 pb-2 whitespace-normal break-words">PROFITABILITY & OPERATIONAL HEALTH</h3>
                <div className={`text-[9px] md:text-xs text-cyan-400/80 leading-loose text-justify whitespace-normal break-words ${isLoading ? 'animate-pulse' : ''}`}>
                  {briefing}
                </div>
                
                {!isLoading && (
                  <div className="mt-4 md:mt-6 pt-4 border-t border-cyan-900/30">
                    <button 
                      onClick={() => setShowDetailedExplanation(!showDetailedExplanation)}
                      className="text-cyan-600 hover:text-cyan-300 transition-colors cursor-pointer text-[8px] md:text-[10px] whitespace-normal break-words text-left"
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

            <div className="mt-6 md:mt-8 flex gap-3 md:gap-4 items-end justify-between md:justify-start">
              <div className="text-4xl md:text-6xl text-cyan-400 font-black tracking-tighter leading-none">ROI</div>
              <div className="border border-yellow-500/50 bg-yellow-500/10 text-yellow-500 px-2 py-1 md:px-3 md:py-1 font-bold tracking-widest text-[8px] md:text-xs text-center">
                EXECUTIVE PRIORITY: HIGH
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-start pt-2 md:pt-4 lg:pt-0 w-full overflow-hidden">
             <h3 className="text-cyan-700 text-[9px] md:text-xs mb-3 md:mb-4 whitespace-normal break-words">STRUCTURAL RESISTANCE // MARKET FRICTION</h3>
             
             {frictionData && (
              <div className="space-y-2 md:space-y-3 text-[8px] md:text-xs mb-4 md:mb-6 bg-cyan-950/5 p-3 md:p-4 border border-cyan-900/30 w-full">
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 items-start sm:items-center">
                   <div className="bg-cyan-800 text-black px-1.5 py-0.5 md:px-2 whitespace-nowrap">ACQUISITION NODE</div>
                   <div className="border border-cyan-900/50 px-2 py-0.5 text-cyan-500 w-full overflow-hidden whitespace-nowrap text-ellipsis">
                     {frictionData.elementId}
                   </div>
                   <div className="text-red-400 font-bold whitespace-nowrap">{frictionData.rageClicks} ABANDONED</div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 items-start sm:items-center">
                   <div className="bg-cyan-800 text-black px-1.5 py-0.5 md:px-2 whitespace-nowrap">STRUCTURAL BLOCK</div>
                   <div className="border border-cyan-900/50 px-2 py-0.5 text-cyan-500 w-full overflow-hidden whitespace-nowrap text-ellipsis">
                     {frictionData.apiEndpoint}
                   </div>
                   <div className="text-purple-400 font-bold whitespace-nowrap">{frictionData.latencyMs}ms DELAY</div>
                </div>
              </div>
            )}

             <div className="opacity-80 hover:opacity-100 transition-opacity w-full overflow-hidden">
               <LiveBleedTicker events={frictionData?.recentEvents || []} />
             </div>
          </div>
        </div>

        {/* DESKTOP VIEW: FULL WIDE INLINE TERMINAL */}
        <div className="hidden md:flex w-full border border-cyan-900/40 bg-black/40 p-8 relative min-h-[500px] flex-col items-center shadow-[0_0_15px_rgba(6,182,212,0.05)] overflow-hidden rounded-xl">
          <div className="absolute inset-0 flex items-end justify-center opacity-40 pointer-events-none">
             <svg viewBox="0 0 1000 400" className="w-full h-full drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]" preserveAspectRatio="xMidYMax slice">
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
               <circle cx="280" cy="140" r="4" fill="#ef4444" className="animate-ping" />
               <circle cx="280" cy="140" r="2" fill="#fff" />
               <circle cx="560" cy="270" r="6" fill="#22d3ee" className="animate-pulse" />
               <circle cx="560" cy="270" r="2" fill="#fff" />
               <circle cx="850" cy="360" r="5" fill="#a855f7" className="animate-pulse" />
             </svg>
          </div>

          <div className="z-10 bg-black/70 px-6 py-2 border border-cyan-900/50 backdrop-blur-sm text-center mb-8 inline-block shadow-[0_0_10px_rgba(34,211,238,0.2)]">
            <p className="text-cyan-500 text-[10px] tracking-[0.3em] font-bold whitespace-nowrap">
               MACRO VIEW // MARKET FRICTION TOPOGRAPHY
            </p>
          </div>
          
          <div className="relative z-20 w-full flex-1 flex flex-col">
            <RemediationTerminal tenantId={financialData?.tenantId || 'test-tenant-123'} />
          </div>
        </div>

        {/* MOBILE VIEW: BOTTOM NAVIGATION TRIGGER CARD */}
        <div className="block md:hidden w-full border border-cyan-900/40 bg-black/40 p-4 relative shadow-[0_0_15px_rgba(6,182,212,0.05)] rounded-xl overflow-hidden">
          <div className="flex items-center justify-between mb-3 border-b border-cyan-900/40 pb-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
              <span className="text-[9px] text-cyan-400 font-bold tracking-widest">MACRO VIEW // HEALING PROTOCOL</span>
            </div>
            <span className="text-[7px] bg-red-950/80 border border-red-600/60 text-red-400 px-2 py-0.5 rounded tracking-widest animate-pulse font-bold">
              ACTION REQUIRED
            </span>
          </div>
          
          <p className="text-[8px] text-cyan-600/90 mb-4 leading-relaxed">
            AUTONOMOUS CODE HEALING IS READY TO DEPLOY FOR DETECTED CHECKOUT FRICTION.
          </p>

          <button
            onClick={() => router.push('/dashboard/healing')}
            className="w-full py-3 px-4 bg-cyan-950/80 hover:bg-cyan-900/80 border border-cyan-500/60 text-cyan-300 font-bold text-[9px] tracking-[0.2em] rounded-lg flex items-center justify-center gap-2 shadow-[0_0_12px_rgba(6,182,212,0.25)] transition-all active:scale-[0.98]"
          >
            <span>[ OPEN AUTONOMOUS HEALING TERMINAL ]</span>
            <span className="text-cyan-400 text-xs">▲</span>
          </button>
        </div>

      </div>

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