// app/dashboard/report/page.tsx
'use client';

import { useEffect, useState, useRef } from 'react';
import { 
  AlertTriangle, DollarSign, Ghost, ShieldAlert, Activity, 
  Database, ServerCrash, X, ChevronRight, MapPin, MailWarning,
  ListOrdered, Layers, Globe, Image as ImageIcon, Accessibility, 
  CheckCircle, AlertCircle, Cpu, Lock, Unlock, Search, Info, ArrowUp
} from 'lucide-react';
import { useRouter } from 'next/navigation';

// --- UPGRADE MAPPING DICTIONARY ---
const TECH_UPGRADES: Record<string, { upgrade: string; reason: string }> = {
  "WordPress": { upgrade: "Next.js / React Architecture", reason: "Eliminates plugin bloat and achieves sub-200ms load times." },
  "Wix": { upgrade: "ClientScale Core Framework", reason: "Removes proprietary lock-in and dramatically reduces DOM fragility." },
  "Squarespace": { upgrade: "Custom Next.js Frontend", reason: "Unlocks advanced local SEO capabilities previously blocked by platform limits." },
  "Shopify": { upgrade: "Headless Commerce API", reason: "Separates the frontend presentation from backend inventory for instant page loads." },
  "Google Analytics": { upgrade: "Server-Side Tracking", reason: "Bypasses iOS ad-blockers to capture 'Ghost Leads' normally lost to privacy settings." },
  "Meta Pixel": { upgrade: "Conversion API (CAPI)", reason: "Direct server-to-server tracking for 100% accurate client acquisition costs." },
  "TikTok Pixel": { upgrade: "Server-Side Events", reason: "Prevents client-side script execution from blocking the main thread." },
  "Intercom": { upgrade: "Automated AI Lead Nurture", reason: "Replaces expensive human latency with instant AI triage for mid-sized operations." },
  "Mindbody": { upgrade: "Headless Booking API", reason: "Removes third-party iframe lag to keep users inside your optimized conversion funnel." },
  "Calendly": { upgrade: "Native API Scheduling", reason: "Prevents external CSS/JS injection and keeps the user on your domain." },
  "Apache": { upgrade: "Vercel Edge Network", reason: "Shifts compute to the edge for instant Time-to-First-Byte globally." },
  "Nginx": { upgrade: "Vercel Edge Network", reason: "Shifts compute to the edge for instant Time-to-First-Byte globally." },
  "Apple MapKit JS": { upgrade: "Lazy-Loaded Native Maps", reason: "Defers map rendering until the user scrolls, saving bandwidth and initial load time." },
  "Google Maps": { upgrade: "Static Edge Maps API", reason: "Replaces heavy interactive iframes with static placeholders to eliminate JS execution lag." },
  "HSTS": { upgrade: "Edge Node Routing", reason: "Maintains strict transport security while distributing server load across global edge nodes." },
};

// --- DYNAMIC 3D TELEMETRY TOWER ---
const DataNode = ({ x, y, w, d, h, color = 'cyan', label, value }: any) => {
  const colors: Record<string, any> = {
    cyan: { top: 'bg-cyan-400/80 border-cyan-200', south: 'bg-cyan-600/90', east: 'bg-cyan-800/90', glow: 'shadow-[0_0_40px_rgba(34,211,238,0.8)]' },
    red: { top: 'bg-red-400/80 border-red-200', south: 'bg-red-600/90', east: 'bg-red-800/90', glow: 'shadow-[0_0_40px_rgba(239,68,68,0.8)]' },
    purple: { top: 'bg-purple-400/80 border-purple-200', south: 'bg-purple-600/90', east: 'bg-purple-800/90', glow: 'shadow-[0_0_40px_rgba(168,85,247,0.8)]' },
    orange: { top: 'bg-orange-400/80 border-orange-200', south: 'bg-orange-600/90', east: 'bg-orange-800/90', glow: 'shadow-[0_0_40px_rgba(249,115,22,0.8)]' }
  };
  const c = colors[color];

  return (
    <div className="absolute [transform-style:preserve-3d] transition-all duration-1000 ease-in-out hover:[transform:translateZ(10px)]" style={{ left: x, top: y, width: w, height: d }}>
      {/* South Wall (Folded up from bottom edge) */}
      <div className={`absolute bottom-0 left-0 w-full origin-bottom ${c.south} border-l border-r border-t border-white/20`} style={{ height: h, transform: 'rotateX(-90deg)' }} />
      {/* East Wall (Folded up from right edge) */}
      <div className={`absolute top-0 right-0 h-full origin-right ${c.east} border-t border-b border-l border-white/20`} style={{ width: h, transform: 'rotateY(-90deg)' }} />
      {/* Top Face (Pushed up Z axis) */}
      <div className={`absolute inset-0 ${c.top} flex items-center justify-center overflow-hidden ${c.glow}`} style={{ transform: `translateZ(${h}px)` }}>
         <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff44_1px,transparent_1px),linear-gradient(to_bottom,#ffffff44_1px,transparent_1px)] bg-[size:4px_4px]" />
      </div>
      
      {/* Floating 3D Label (Counter-rotated to face the camera) */}
      <div className="absolute top-1/2 left-1/2 flex flex-col items-center justify-center pointer-events-none" style={{ transform: `translateZ(${h + 40}px) translateX(-50%) translateY(-50%) rotateZ(-45deg) rotateX(-60deg)` }}>
         <span className="text-[9px] font-mono font-bold text-white uppercase tracking-widest whitespace-nowrap bg-black/60 px-2 py-0.5 rounded border border-white/20 backdrop-blur-md mb-1">{label}</span>
         <span className={`text-sm font-mono font-black text-white bg-black/80 px-2 py-1 rounded border border-white/20 shadow-[0_0_15px_rgba(0,0,0,0.5)]`}>{value}</span>
         <div className="w-px h-6 bg-white/50 mt-1" />
      </div>
    </div>
  );
};

// --- STATIC BACKGROUND CITY BLOCKS ---
const DecorNode = ({ x, y, w, d, h }: any) => (
  <div className="absolute [transform-style:preserve-3d]" style={{ left: x, top: y, width: w, height: d }}>
    <div className="absolute bottom-0 left-0 w-full origin-bottom bg-cyan-900/60 border border-cyan-700/50" style={{ height: h, transform: 'rotateX(-90deg)' }} />
    <div className="absolute top-0 right-0 h-full origin-right bg-cyan-950/60 border border-cyan-700/50" style={{ width: h, transform: 'rotateY(-90deg)' }} />
    <div className="absolute inset-0 bg-cyan-800/40 border border-cyan-600/50" style={{ transform: `translateZ(${h}px)` }} />
  </div>
);

export default function AuditReportPage() {
  const router = useRouter();
  const [auditData, setAuditData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [scanTimestamp, setScanTimestamp] = useState<string>('');
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Generate static scan timestamp on client hydration
    const now = new Date();
    setScanTimestamp(now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ' ' + now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }));

    const storedData = sessionStorage.getItem('clientScale_auditData');
    if (storedData) {
      try {
        const parsed = JSON.parse(storedData);
        if (parsed && parsed.target) {
          setAuditData(parsed);
        }
      } catch (e) {
        setAuditData(null);
      }
    }
    setIsLoading(false);
  }, []);

  const handleDeployPixel = async () => {
    router.push('/dashboard/boardroom');
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-[#020205] text-white">
        <div className="text-cyan-400 animate-pulse text-sm tracking-widest uppercase font-mono">
          Hydrating Executive Visuals...
        </div>
      </div>
    );
  }

  if (!auditData || !auditData.target) {
    return (
      <div className="min-h-screen w-full bg-[#020205] text-white flex flex-col items-center justify-center pb-12 px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4 shadow-[0_0_20px_rgba(8,145,178,0.3)]">
          <Search size={28} />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">No Target Domain Audited</h1>
        <p className="text-zinc-300 text-sm max-w-md leading-relaxed mt-2">
          Please scan a prospect URL to initialize the synthetic baseline projection.
        </p>
        <button 
          onClick={() => window.location.href = '/'}
          className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-3 rounded-xl font-medium text-sm transition-colors mt-6"
        >
          Return to Scanner
        </button>
      </div>
    );
  }

  const safeExtractNumber = (val: any, fallback: number): number => {
    if (val === null || val === undefined || val === 'N/A') return fallback;
    const parsed = parseInt(String(val).replace(/[^0-9-]/g, ''), 10);
    return isNaN(parsed) ? fallback : Math.max(0, parsed);
  };

  // --- DYNAMICALLY CALCULATED REVENUE LEAKAGE (UNSQUEEZED PER URL) ---
  const perfScore = safeExtractNumber(auditData?.diagnostics?.performanceScore, 65);
  const rawTbt = safeExtractNumber(auditData?.diagnostics?.latency?.tbt, 800);
  const rawInp = safeExtractNumber(auditData?.diagnostics?.latency?.inp, 340);
  const thirdPartyCount = safeExtractNumber(auditData?.diagnostics?.thirdPartyScriptCount, 5);
  
  // Friction multiplier scales dynamically based on actual site latency & performance penalties
  const latencyPenaltyFactor = Math.max(1.0, (rawTbt / 500) + (rawInp / 300) + (thirdPartyCount * 0.15));
  const performanceFrictionMultiplier = Math.min(0.35, Math.max(0.08, (100 - perfScore) / 200 * latencyPenaltyFactor));
  
  const syntheticDailySessions = 250;
  const estimatedAOV = 65;
  const syntheticDailyLeakage = syntheticDailySessions * performanceFrictionMultiplier * estimatedAOV;
  const syntheticQuarterlyLeakage = Math.round(syntheticDailyLeakage * 90 / 1000) * 1000; // Clean rounded figures

  const isMapPenalized = rawInp > 200;
  const hasDmarc = auditData?.security?.dmarcConfigured === true; 
  const hasSpf = auditData?.security?.spfConfigured === true;
  const isEmailVulnerable = !hasDmarc || !hasSpf;

  const ghostTapWindow = (rawTbt / 1000).toFixed(1); 
  const isGhostOptimal = parseFloat(ghostTapWindow) === 0;
  const parasiteImpact = Math.min(95, (thirdPartyCount * 12)).toFixed(0);
  
  const rawDomNodes = safeExtractNumber(auditData?.diagnostics?.domElements, 1200 + (thirdPartyCount * 15));
  const domSize = rawDomNodes.toLocaleString();
  const isFragile = rawDomNodes > 800;

  // --- DYNAMICALLY SCALED TOWER HEIGHTS ---
  const hDom = Math.max(50, Math.min(220, (rawDomNodes / 1500) * 150));
  const hTbt = Math.max(40, Math.min(220, (rawTbt / 1000) * 150));
  const hInp = Math.max(40, Math.min(220, (rawInp / 500) * 150));
  const hParasite = Math.max(40, Math.min(220, (parseFloat(parasiteImpact) / 50) * 150));

  const rawInfrastructure = Array.isArray(auditData?.infrastructure) ? auditData.infrastructure : [];
  const infrastructure = Array.from(
    new Map(rawInfrastructure.filter((tech: any) => tech && tech.name).map((tech: any) => [String(tech.name).toLowerCase().trim(), tech])).values()
  );

  const brandName = (() => {
    try {
      const name = new URL(auditData.target).hostname.replace(/^www\./, '').split('.')[0];
      return name ? name.charAt(0).toUpperCase() + name.slice(1) : 'This business';
    } catch { return 'This business'; }
  })();

  const industryTerms = auditData?.industryContext || { shortAction: `convert`, penalty: 'search engine visibility', buttons: 'forms and contact buttons' };
  const dynamicSynthesis = auditData?.industryContext?.executiveSynthesis || "Analyzing structural pipeline friction against conversion health...";

  const frictionCards = [
    {
      id: 'revenue',
      isGreen: false,
      title: 'Projected Quarterly Leakage',
      icon: AlertTriangle,
      value: `£${syntheticQuarterlyLeakage.toLocaleString()}`,
      description: `Synthetic projection based on standard traffic volume, real-time performance score (${perfScore}/100), and a ${(performanceFrictionMultiplier * 100).toFixed(1)}% friction drop-off rate.`,
      drawerKey: 'revenue' as const,
      isZero: false,
      iconComp: DollarSign,
      highlight: true
    },
    {
      id: 'ghost',
      isGreen: isGhostOptimal,
      title: 'Ghost Tap Window',
      icon: Ghost,
      value: isGhostOptimal ? '0.0s' : `${ghostTapWindow}s`,
      description: isGhostOptimal ? 'Main thread is unblocked.' : `Screen appears loaded, but taps on ${industryTerms.buttons} are ignored for ${ghostTapWindow}s.`,
      drawerKey: 'ghost' as const,
      isZero: isGhostOptimal,
      iconComp: Ghost
    },
    {
      id: 'inp',
      isGreen: !isMapPenalized,
      title: 'Local SEO Penalty',
      icon: MapPin,
      value: `${rawInp}ms`,
      description: isMapPenalized ? `INP exceeds 200ms threshold. Google is actively suppressing ${industryTerms.penalty}.` : `INP is within passing limits.`,
      drawerKey: 'inp' as const,
      isZero: !isMapPenalized,
      iconComp: MapPin
    },
    {
      id: 'parasite',
      isGreen: parseFloat(parasiteImpact) === 0,
      title: 'Parasite Load',
      icon: ServerCrash,
      value: `${parasiteImpact}%`,
      description: parseFloat(parasiteImpact) === 0 ? 'Zero external tracking scripts detected.' : `${thirdPartyCount} external marketing scripts cause ${parasiteImpact}% of mobile lag.`,
      drawerKey: 'parasite' as const,
      isZero: parseFloat(parasiteImpact) === 0,
      iconComp: ShieldAlert
    },
    {
      id: 'dns',
      isGreen: !isEmailVulnerable,
      title: 'Nurture Trust Risk',
      icon: MailWarning,
      value: isEmailVulnerable ? 'VULNERABLE' : 'SECURE',
      description: isEmailVulnerable ? `Missing DMARC/SPF. Outreach is highly likely routing to spam folders.` : `Domain authentication is intact.`,
      drawerKey: 'dns' as const,
      isZero: !isEmailVulnerable,
      iconComp: MailWarning
    },
    {
      id: 'dom',
      isGreen: !isFragile,
      title: 'DOM Fragility',
      icon: Database,
      value: domSize,
      description: !isFragile ? `HTML structure is optimized.` : 'Massive HTML node count is draining batteries and risking browser crashes.',
      drawerKey: 'dom' as const,
      isZero: !isFragile,
      iconComp: Database
    }
  ];

  return (
    <div className="min-h-screen bg-[#020205] text-white flex flex-col antialiased w-full">
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes hologramScan {
          0% { transform: translateY(0px); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(480px); opacity: 0; }
        }
      `}} />

      {/* TOP PANE: 3D Holographic Table Header */}
      <div className="relative w-full h-[65vh] min-h-[520px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-950/40 via-[#020205] to-black overflow-hidden flex items-center justify-center border-b border-zinc-800 z-20 shrink-0">
        
        {/* The 3D Isometric Projection Engine */}
        <div className="absolute inset-0 flex items-center justify-center [perspective:1400px] z-10 pointer-events-none mt-12 sm:mt-8">
          
          {/* Base Table Orientation */}
          <div className="relative w-[400px] h-[400px] sm:w-[480px] sm:h-[480px] [transform:scale(0.75)_rotateX(60deg)_rotateZ(45deg)] sm:[transform:scale(1.0)_rotateX(60deg)_rotateZ(45deg)] [transform-style:preserve-3d]">
              
              {/* Glowing Base Plate & Grid Floor */}
              <div className="absolute inset-0 bg-cyan-950/80 border-2 border-cyan-500 shadow-[0_0_80px_rgba(6,182,212,0.4)] backdrop-blur-md" />
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#0891b266_2px,transparent_2px),linear-gradient(to_bottom,#0891b266_2px,transparent_2px)] bg-[size:24px_24px] opacity-80" />
              <div className="absolute top-0 left-0 w-full h-[4px] bg-white shadow-[0_0_40px_#22d3ee,0_0_20px_#22d3ee] animate-[hologramScan_4s_linear_infinite]" />
              
              {/* Background Decorative Blocks */}
              <DecorNode x={40} y={40} w={60} d={40} h={30} />
              <DecorNode x={320} y={60} w={40} d={80} h={50} />
              <DecorNode x={80} y={340} w={50} d={50} h={20} />
              <DecorNode x={360} y={360} w={60} d={60} h={40} />
              <DecorNode x={200} y={180} w={40} d={40} h={30} />
              
              {/* Live Telemetry Data Towers (Widened grid spread for absolute zero label collisions) */}
              <DataNode x={160} y={60} w={60} d={60} h={hDom} color="cyan" label="DOM Nodes" value={domSize} />
              <DataNode x={360} y={180} w={55} d={55} h={hParasite} color="purple" label="Parasite Load" value={`${parasiteImpact}%`} />
              <DataNode x={50} y={240} w={60} d={60} h={hTbt} color="red" label="Thread Lock" value={`${rawTbt}ms`} />
              <DataNode x={240} y={350} w={50} d={60} h={hInp} color="orange" label="Latency (INP)" value={`${rawInp}ms`} />
          </div>
        </div>

        {/* Ambient Target Badge & Volatility Warning Overlay */}
        <div className="absolute bottom-4 left-4 right-4 sm:right-auto flex flex-col sm:flex-row sm:items-end gap-3 z-30 pointer-events-none max-w-lg">
            <div className="bg-black/80 border border-cyan-900/80 px-4 py-3 rounded-xl backdrop-blur-md shadow-xl pointer-events-auto">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,1)]"></span>
                </span>
                <span className="text-[10px] font-mono text-cyan-300 uppercase tracking-widest">
                  Scanning {brandName} Infrastructure &bull; {scanTimestamp || 'Initializing...'}
                </span>
              </div>
              <p className="text-xs sm:text-[13px] text-zinc-300 leading-[1.6] font-light text-justify tracking-[0.015em]">
                Live telemetry data is inherently volatile and subject to real-time network fluctuations. Metrics fluctuate continuously based on active user traffic loads, necessitating continuous baseline logging.
              </p>
            </div>
        </div>
      </div>

      {/* BOTTOM PANE: The Cold Data & Call to Action */}
      <div ref={scrollContainerRef} className="w-full relative z-10 bg-[radial-gradient(circle_at_top,rgba(6,182,212,0.05),transparent_60%)] flex-grow">
        <div className="max-w-3xl mx-auto w-full p-6 sm:p-12 xl:p-16 space-y-10 lg:space-y-12 pb-24">
          
          <header className="border-b border-zinc-800 pb-6">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Synthetic Baseline Scan</h1>
            <p className="text-zinc-400 mt-2 font-mono text-sm flex items-center gap-2">
                <Globe size={14} className="text-cyan-500" /> Target: {auditData.target.replace(/^https?:\/\//, '')}
            </p>
          </header>

          <section className="bg-gradient-to-br from-[#0a0a0f] to-[#12121c] border border-zinc-700/60 rounded-2xl p-6 sm:p-10 shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-purple-600/5 pointer-events-none"></div>
            <div className="flex flex-col sm:flex-row gap-6 items-start relative z-10">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-400/30 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
                  <Cpu size={22} className="text-cyan-400" /> 
                </div>
                <div className="flex-1 w-full">
                    <h2 className="text-[11px] font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                        Initial AI Assessment
                        <span className="h-px flex-1 bg-gradient-to-r from-cyan-900/50 to-transparent"></span>
                    </h2>
                    <p className="text-sm sm:text-base text-zinc-300 leading-[1.8] font-light text-justify tracking-[0.015em] antialiased">
                        {dynamicSynthesis}
                    </p>
                </div>
            </div>
          </section>

          <section className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {frictionCards.map((card) => {
                const IconComponent = card.icon;
                return (
                  <div key={card.id} className={`bg-[#12121c] border ${card.highlight ? 'border-red-900/60 shadow-[0_0_30px_rgba(220,38,38,0.15)] bg-gradient-to-br from-[#1a0f14] to-[#12121c] sm:col-span-2' : card.isGreen ? 'border-green-900/30' : 'border-zinc-700/50'} rounded-2xl p-6 sm:p-8 relative overflow-hidden transition-all flex flex-col justify-between`}>
                    {card.highlight && <div className="absolute top-0 left-0 w-1.5 h-full bg-red-600 shadow-[0_0_15px_rgba(220,38,38,1)]"></div>}
                    <div className="relative z-10">
                      <div className={`flex items-center justify-between mb-4 ${card.highlight ? 'text-red-400' : card.isGreen ? 'text-green-400' : 'text-blue-400'}`}>
                        <div className="flex items-center gap-2 font-mono font-bold">
                            <IconComponent size={18} />
                            <h3 className="text-[11px] uppercase tracking-widest">{card.title}</h3>
                        </div>
                        {card.highlight && <span className="text-[9px] px-2 py-1 bg-red-500/10 border border-red-500/20 rounded font-mono uppercase tracking-widest">Synthetic</span>}
                      </div>
                      <div className={`${card.highlight ? 'text-5xl sm:text-6xl text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]' : 'text-3xl sm:text-4xl text-white'} font-black tracking-tight mb-3`}>
                        {card.value}
                      </div>
                      <p className={`text-sm ${card.highlight ? 'text-zinc-300 font-mono' : 'text-zinc-400 font-light'} leading-relaxed`}>{card.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="bg-[#12121c] border border-zinc-700/50 rounded-2xl p-6 sm:p-8">
             <div className="flex items-center gap-2 mb-6 border-b border-zinc-800 pb-4">
                <Layers className="text-purple-400 shrink-0" size={18} />
                <h2 className="text-xs font-mono font-bold text-zinc-100 uppercase tracking-widest">Tech Stack Migration</h2>
             </div>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {infrastructure.length > 0 ? infrastructure.slice(0, 4).map((tech: any, idx: number) => {
                const rec = TECH_UPGRADES[tech.name] || { upgrade: "Edge Compute Offloading", reason: "Shifts processing to edge servers." };
                return (
                  <div key={idx} className="p-4 bg-black/40 border border-zinc-800 rounded-xl flex flex-col">
                      <div className="text-sm font-bold text-zinc-200 mb-1">{tech.name}</div>
                      <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest mb-2">Upgrade &rarr; {rec.upgrade}</div>
                      <p className="text-xs text-zinc-500 font-light mt-auto">{rec.reason}</p>
                  </div>
                );
              }) : (
                <div className="text-zinc-500 text-sm font-mono col-span-full">No infrastructure data available.</div>
              )}
             </div>
          </section>

          <section className="mt-8 pt-8 border-t border-zinc-800">
            <div className="bg-gradient-to-b from-zinc-900 to-black border border-zinc-700/80 rounded-2xl p-8 text-center relative overflow-hidden shadow-2xl group hover:border-cyan-500/50 transition-colors">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.08),transparent_70%)] pointer-events-none"></div>
                <Lock size={24} className="text-zinc-400 mx-auto mb-4 group-hover:text-cyan-400 transition-colors" />
                <h3 className="text-lg font-bold text-white mb-2">Verify The Damage</h3>
                <p className="text-sm text-zinc-400 mb-8 max-w-sm mx-auto">
                    The £{syntheticQuarterlyLeakage.toLocaleString()} leakage above is a synthetic projection. Deploy the ClientScale tracker to capture actual user rage-taps and API failures.
                </p>
                <button onClick={handleDeployPixel} className="w-full bg-white hover:bg-gray-200 text-black py-4 rounded-xl font-bold text-xs sm:text-sm uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] flex items-center justify-center gap-2 cursor-pointer">
                  Deploy Live Telemetry Pixel (48 Hrs)
                </button>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}