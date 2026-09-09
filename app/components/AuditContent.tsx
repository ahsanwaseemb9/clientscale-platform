'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

// Types for our digital traffic
interface DataVehicle {
  id: number;
  x: number;
  y: number;
  speed: number;
  lane: number;
  type: 'organic' | 'paid' | 'direct';
  intent: 'high' | 'low' | 'unknown';
  scanned: boolean;
}

export default function AuditContent() {
  const searchParams = useSearchParams();
  const router = useRouter(); 
  
  const targetUrl = searchParams.get('url') || 'your domain';
  
  // Core State
  const [auditData, setAuditData] = useState<any>(null); 
  const [progress, setProgress] = useState(0);
  const [loadingPhase, setLoadingPhase] = useState('INITIALIZING DIAGNOSTIC ENGINE...');
  const [logs, setLogs] = useState<string[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 1. Fetch the actual audit data in the background
  useEffect(() => {
    if (targetUrl === 'your domain') return;
    
    fetch(`/api/audit?url=${encodeURIComponent(targetUrl)}`)
      .then((res) => res.json())
      .then((data) => setAuditData(data))
      .catch((err) => console.error("Failed to fetch audit data:", err));
  }, [targetUrl]);

  // 2. Text rotation and progress logic
  useEffect(() => {
    const phases = [
      `MAPPING TOPOGRAPHY FOR: ${targetUrl}`,
      'DEPLOYING COMPUTER VISION SCANNERS...',
      'ANALYZING FUNNEL VELOCITY...',
      'DETECTING GROWTH BOTTLENECKS...',
      'CALCULATING REVENUE LEAKAGE...',
      'COMPILING PIPELINE BLUEPRINT...'
    ];

    let currentPhase = 0;
    
    const interval = setInterval(() => {
      setProgress((prev) => {
        // Random progress jump to feel "organic"
        const next = prev + (Math.random() * 1.5 + 0.5);
        if (next >= 100) {
          clearInterval(interval);
          setIsComplete(true);
          return 100;
        }
        
        // Update phases based on progress percentage
        const expectedPhase = Math.floor((next / 100) * phases.length);
        if (expectedPhase > currentPhase && expectedPhase < phases.length) {
          currentPhase = expectedPhase;
          setLoadingPhase(phases[currentPhase]);
          
          setLogs(prevLogs => {
            const newLogs = [`> SYS_UPDATE: ${phases[currentPhase]}`, ...prevLogs];
            return newLogs.slice(0, 4); // Keep last 4 logs for the UI
          });
        }
        
        return next;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [targetUrl]);

  // 3. Traffic Scanning Canvas Animation (Mobile Optimized)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle Resize & Device Pixel Ratio for sharp rendering on mobile
    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      
      const dpr = window.devicePixelRatio || 1;
      const rect = parent.getBoundingClientRect();
      
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      
      ctx.scale(dpr, dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
    };
    
    resize();
    window.addEventListener('resize', resize);

    let animationFrameId: number;
    let vehicles: DataVehicle[] = [];
    let frameCount = 0;

    const render = () => {
      frameCount++;
      const rect = canvas.getBoundingClientRect();
      const logicalWidth = rect.width;
      const logicalHeight = rect.height;

      ctx.clearRect(0, 0, logicalWidth, logicalHeight);

      // Dynamic Lane Positioning based on height
      const lanes = [
        logicalHeight * 0.25, 
        logicalHeight * 0.5, 
        logicalHeight * 0.75
      ];

      // Draw Grid / Roadway
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.15)';
      ctx.lineWidth = 1;
      
      ctx.beginPath();
      ctx.moveTo(0, logicalHeight * 0.375); ctx.lineTo(logicalWidth, logicalHeight * 0.375);
      ctx.moveTo(0, logicalHeight * 0.625); ctx.lineTo(logicalWidth, logicalHeight * 0.625);
      ctx.stroke();

      // Scanner Zone (Center) - Scales down on mobile
      const scannerX = logicalWidth / 2;
      const scannerWidth = Math.min(150, logicalWidth * 0.4); 
      
      ctx.fillStyle = 'rgba(6, 182, 212, 0.05)';
      ctx.fillRect(scannerX - scannerWidth/2, 0, scannerWidth, logicalHeight);
      
      ctx.strokeStyle = 'rgba(34, 211, 238, 0.8)';
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(scannerX - scannerWidth/2, 0); ctx.lineTo(scannerX - scannerWidth/2, logicalHeight);
      ctx.moveTo(scannerX + scannerWidth/2, 0); ctx.lineTo(scannerX + scannerWidth/2, logicalHeight);
      ctx.stroke();
      ctx.setLineDash([]);

      // Spawn new vehicles (traffic) - Spawn slightly less often on smaller screens
      const spawnRate = logicalWidth < 500 ? 25 : 15;
      if (frameCount % spawnRate === 0 && Math.random() > 0.3) {
        const typeRand = Math.random();
        vehicles.push({
          id: Math.random(),
          x: -30,
          y: lanes[Math.floor(Math.random() * lanes.length)] + (Math.random() * 6 - 3),
          speed: (logicalWidth < 500 ? 1.5 : 2) + Math.random() * 2.5,
          lane: Math.floor(Math.random() * 3),
          type: typeRand > 0.6 ? 'organic' : typeRand > 0.3 ? 'paid' : 'direct',
          intent: Math.random() > 0.7 ? 'high' : Math.random() > 0.4 ? 'low' : 'unknown',
          scanned: false
        });
      }

      // Update and Draw Vehicles
      vehicles.forEach((v) => {
        v.x += v.speed;
        const inScanner = v.x > scannerX - scannerWidth/2 && v.x < scannerX + scannerWidth/2;
        if (inScanner) v.scanned = true;

        // Draw basic vehicle node
        ctx.fillStyle = v.type === 'organic' ? '#22d3ee' : v.type === 'paid' ? '#a855f7' : '#94a3b8';
        
        // Scale vehicles slightly smaller on mobile
        const vSizeX = logicalWidth < 500 ? 12 : 16;
        const vSizeY = logicalWidth < 500 ? 6 : 8;
        ctx.fillRect(v.x, v.y - (vSizeY/2), vSizeX, vSizeY);

        // Draw AI Bounding Box if scanned
        if (inScanner) {
          ctx.strokeStyle = v.intent === 'high' ? '#4ade80' : v.intent === 'low' ? '#ef4444' : '#facc15';
          ctx.lineWidth = 1.5;
          const boxPadding = logicalWidth < 500 ? 16 : 24;
          const yOffset = logicalWidth < 500 ? 8 : 12;
          
          ctx.strokeRect(v.x - 4, v.y - yOffset, boxPadding, boxPadding);

          // Object Detection Corners
          const cornerLength = 4;
          ctx.beginPath();
          ctx.moveTo(v.x - 4, v.y - yOffset + cornerLength); ctx.lineTo(v.x - 4, v.y - yOffset); ctx.lineTo(v.x - 4 + cornerLength, v.y - yOffset);
          ctx.moveTo(v.x + (boxPadding-4), v.y + yOffset - cornerLength); ctx.lineTo(v.x + (boxPadding-4), v.y + yOffset); ctx.lineTo(v.x + (boxPadding-4) - cornerLength, v.y + yOffset);
          ctx.stroke();

          // Label
          ctx.fillStyle = ctx.strokeStyle;
          ctx.font = logicalWidth < 500 ? '6px monospace' : '8px monospace';
          ctx.fillText(`INTENT:${v.intent.toUpperCase()}`, v.x - 4, v.y - (yOffset + 4));
          
          // Random scan line
          if (Math.random() > 0.5) {
            ctx.fillStyle = 'rgba(255,255,255,0.8)';
            ctx.fillRect(v.x - 4, v.y - yOffset + (Math.random() * boxPadding), boxPadding, 1);
          }
        }
      });

      // Cleanup
      vehicles = vehicles.filter(v => v.x < logicalWidth + 50);
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // 4. The Transition Handler
  const handleViewResults = () => {
    if (auditData) {
      sessionStorage.setItem('clientScale_auditData', JSON.stringify(auditData));
    } else {
      sessionStorage.setItem('clientScale_auditData', JSON.stringify({ targetUrl, status: 'processing_delayed' }));
    }
    router.push('/dashboard/report');
  };

  return (
    <main className="flex min-h-[100dvh] w-full flex-col items-center justify-center bg-[#020205] text-white antialiased selection:bg-cyan-500/30 selection:text-cyan-200 overflow-hidden relative p-4 sm:p-6">

      {/* --- BACKGROUND LAYERS --- */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[length:100%_4px,3px_100%] pointer-events-none mix-blend-overlay z-0" />
      <div className="absolute top-[30%] left-[10%] right-[10%] h-[500px] bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.05),transparent_50%)] pointer-events-none z-0 mix-blend-screen" />

      {/* --- MAIN DASHBOARD CONTAINER --- */}
      <div className="relative w-full max-w-4xl mx-auto my-auto flex flex-col gap-6 sm:gap-8 z-10 animate-fade-in">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-cyan-900/50 pb-4 gap-4">
          <div className="w-full md:w-auto">
            <h1 className="text-xl sm:text-2xl md:text-4xl font-bold tracking-[0.1em] sm:tracking-[0.2em] text-cyan-300 drop-shadow-[0_0_8px_rgba(34,211,238,0.4)] whitespace-normal break-words leading-tight">
              GROWTH TRAFFIC<br className="block sm:hidden"/> INTELLIGENCE
            </h1>
            <div className="flex items-center gap-3 mt-2 sm:mt-3">
              <span className="relative flex h-2 w-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isComplete ? 'bg-cyan-400' : 'bg-yellow-400'}`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${isComplete ? 'bg-cyan-500' : 'bg-yellow-500'}`}></span>
              </span>
              <h2 className="text-[10px] sm:text-xs md:text-sm text-cyan-600 tracking-widest uppercase">
                DIAGNOSTIC ENGINE : {isComplete ? 'COMPLETE' : 'ACTIVE'}
              </h2>
            </div>
          </div>
          <div className="text-left md:text-right text-cyan-800 text-[9px] sm:text-[10px] w-full md:w-auto leading-relaxed">
            TARGET DOMAIN: <span className="text-cyan-600">{targetUrl}</span><br />
            STATUS: SECURE // {new Date().toISOString().split('T')[0]}
          </div>
        </div>

        {/* AI TRAFFIC SCANNER VISUALIZATION */}
        <div className="w-full h-[180px] sm:h-[220px] md:h-[250px] border border-cyan-900/40 bg-[#07070f]/80 relative rounded-xl overflow-hidden shadow-[inset_0_0_30px_rgba(6,182,212,0.08)] backdrop-blur-sm">
          <canvas ref={canvasRef} className="w-full h-full block" />
          <div className="absolute bottom-2 sm:bottom-3 right-2 sm:right-4 text-[8px] sm:text-[9px] text-cyan-700 tracking-widest flex items-center gap-2 bg-black/80 px-2 py-1 rounded">
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-red-500 animate-pulse"></span>
            LIVE ML OBJECT DETECTION
          </div>
        </div>

        {/* PROGRESS & LOGS SECTION */}
        {!isComplete ? (
          <div className="flex flex-col md:flex-row gap-4 sm:gap-6 animate-fade-in">
            {/* Progress Bar Area */}
            <div className="flex-1 flex flex-col justify-center bg-[#07070f]/60 p-4 rounded-xl border border-cyan-900/30">
              <div className="flex justify-between text-[10px] sm:text-xs mb-3 text-cyan-400 font-bold uppercase tracking-wider">
                <span className="truncate pr-4">{loadingPhase}</span>
                <span>{progress.toFixed(1)}%</span>
              </div>
              
              <div className="h-2.5 sm:h-3 w-full bg-cyan-950/50 border border-cyan-900/50 rounded-full relative overflow-hidden">
                <div 
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-600 to-cyan-400 shadow-[0_0_10px_#22d3ee] transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute top-0 right-0 w-8 h-full bg-white/40 blur-[2px] -skew-x-12 translate-x-4"></div>
                </div>
              </div>
            </div>

            {/* Terminal Logs Area */}
            <div className="w-full md:w-[35%] border border-cyan-900/30 bg-[#05050a]/80 p-3 sm:p-4 h-24 sm:h-28 overflow-hidden rounded-xl relative shadow-[inset_0_0_15px_rgba(0,0,0,0.8)]">
              <div className="absolute top-0 left-0 w-full h-4 bg-gradient-to-b from-[#05050a] to-transparent z-10"></div>
              <div className="text-[8px] sm:text-[9px] text-cyan-700/80 space-y-1.5 flex flex-col justify-end h-full relative z-0">
                {logs.map((log, i) => (
                  <div key={i} className={`opacity-${100 - (i * 20)} transform translate-y-0 break-words leading-tight`}>
                    {log}
                  </div>
                ))}
                {logs.length === 0 && <div>&gt; AWAITING TELEMETRY...</div>}
              </div>
            </div>
          </div>
        ) : (
          /* ACTION BLOCK - Renders when scanning is complete */
          <div className="mt-2 flex justify-center w-full animate-fade-in">
            {auditData ? (
              <button 
                onClick={handleViewResults}
                className="w-full bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-500/50 text-cyan-300 hover:text-cyan-100 font-bold px-6 py-4 sm:py-5 rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(6,182,212,0.15)] hover:shadow-[0_0_30px_rgba(6,182,212,0.3)] text-[11px] sm:text-sm tracking-[0.2em] uppercase active:scale-[0.98] flex flex-col items-center justify-center gap-1 group"
              >
                <span>[ ACCESS PIPELINE FORENSICS ]</span>
                <span className="text-[9px] text-cyan-600 group-hover:text-cyan-400 font-normal tracking-widest transition-colors">
                  SCAN COMPLETE // READY FOR REVIEW
                </span>
              </button>
            ) : (
              <div className="w-full bg-zinc-900/40 border border-zinc-800/50 text-zinc-500 font-semibold px-6 py-4 rounded-xl text-[11px] sm:text-sm tracking-widest uppercase flex items-center justify-center space-x-3">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-cyan-500/50" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Finalizing Payload...</span>
              </div>
            )}
          </div>
        )}

      </div>
    </main>
  );
}