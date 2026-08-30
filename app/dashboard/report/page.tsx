// app/dashboard/report/page.tsx
'use client';

import { useEffect, useState, useRef } from 'react';
import { 
  AlertTriangle, DollarSign, Ghost, ShieldAlert, Activity, 
  Database, ServerCrash, X, ChevronRight, MapPin, MailWarning,
  ListOrdered, Layers, Globe, Image as ImageIcon, Accessibility, 
  CheckCircle, AlertCircle, Cpu, Lock, Unlock, Search, Info, ArrowUp, Zap
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
    cyan: { top: 'bg-cyan-400/80 border-cyan-200', south: 'bg-cyan-600/90', east: 'bg-cyan-800/90', glow: 'shadow-[0_0_30px_rgba(34,211,238,0.7)]' },
    red: { top: 'bg-red-400/80 border-red-200', south: 'bg-red-600/90', east: 'bg-red-800/90', glow: 'shadow-[0_0_30px_rgba(239,68,68,0.7)]' },
    purple: { top: 'bg-purple-400/80 border-purple-200', south: 'bg-purple-600/90', east: 'bg-purple-800/90', glow: 'shadow-[0_0_30px_rgba(168,85,247,0.7)]' },
    orange: { top: 'bg-orange-400/80 border-orange-200', south: 'bg-orange-600/90', east: 'bg-orange-800/90', glow: 'shadow-[0_0_30px_rgba(249,115,22,0.7)]' }
  };
  const c = colors[color];
  
  // Conditionally target ONLY the DOM Nodes title for a larger font size
  const titleSize = label === 'DOM Nodes' ? 'text-[13px] sm:text-[12px]' : 'text-[11px] sm:text-[9px]';

  return (
    <div className="absolute [transform-style:preserve-3d] transition-all duration-1000 ease-in-out" style={{ left: x, top: y, width: w, height: d }}>
      {/* South Wall */}
      <div className={`absolute bottom-0 left-0 w-full origin-bottom ${c.south} border-l border-r border-t border-white/20`} style={{ height: h, transform: 'rotateX(-90deg)' }} />
      {/* East Wall */}
      <div className={`absolute top-0 right-0 h-full origin-right ${c.east} border-t border-b border-l border-white/20`} style={{ width: h, transform: 'rotateY(-90deg)' }} />
      {/* Top Face */}
      <div className={`absolute inset-0 ${c.top} flex items-center justify-center overflow-hidden ${c.glow}`} style={{ transform: `translateZ(${h}px)` }}>
         <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff44_1px,transparent_1px),linear-gradient(to_bottom,#ffffff44_1px,transparent_1px)] bg-[size:4px_4px]" />
      </div>
      
      {/* Floating 3D Label (Enlarged DOM Nodes title on both viewports) */}
      <div className="absolute top-1/2 left-1/2 flex flex-col items-center justify-center pointer-events-none" style={{ transform: `translateZ(${h + 35}px) translateX(-50%) translateY(-50%) rotateZ(-45deg) rotateX(-60deg)` }}>
         <span className={`${titleSize} font-mono font-bold text-white uppercase tracking-widest whitespace-nowrap bg-black/70 px-2 sm:px-1.5 py-0.5 rounded border border-white/20 backdrop-blur-md mb-1 sm:mb-0.5`}>{label}</span>
         <span className={`text-base sm:text-sm font-mono font-black text-white bg-black/90 px-2.5 sm:px-2 py-0.5 rounded border border-white/20 shadow-md`}>{value}</span>
         <div className="w-px h-5 sm:h-6 bg-white/50 mt-1 sm:mt-0.5" />
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

  // --- INTELLIGENT PERFORMANCE-BASED REVENUE LEAKAGE ---
  const perfScore = safeExtractNumber(auditData?.diagnostics?.performanceScore, 65);
  const rawTbt = safeExtractNumber(auditData?.diagnostics?.latency?.tbt, 800);
  const rawInp = safeExtractNumber(auditData?.diagnostics?.latency?.inp, 340);
  const thirdPartyCount = safeExtractNumber(auditData?.diagnostics?.thirdPartyScriptCount, 5);
  
  // If performance is 95 or higher, friction is zero (fully optimized domain)
  const isFullyOptimized = perfScore >= 95;
  const latencyPenaltyFactor = Math.max(1.0, (rawTbt / 500) + (rawInp / 300) + (thirdPartyCount * 0.15));
  const performanceFrictionMultiplier = isFullyOptimized ? 0 : Math.min(0.35, Math.max(0.04, (100 - perfScore) / 200 * latencyPenaltyFactor));
  
  const syntheticDailySessions = 250;
  const estimatedAOV = 65;
  const syntheticDailyLeakage = syntheticDailySessions * performanceFrictionMultiplier * estimatedAOV;
  const syntheticQuarterlyLeakage = isFullyOptimized ? 0 : Math.round(syntheticDailyLeakage * 90 / 1000) * 1000;

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
  const hDom = Math.max(40, Math.min(160, (rawDomNodes / 1500) * 120));
  const hTbt = Math.max(30, Math.min(160, (rawTbt / 1000) * 120));
  const hInp = Math.max(30, Math.min(160, (rawInp / 500) * 120));
  const hParasite = Math.max(30, Math.min(160, (parseFloat(parasiteImpact) / 50) * 120));

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
      isGreen: isFullyOptimized,
      title: isFullyOptimized ? 'Pipeline Status: Optimized' : 'Projected Quarterly Leakage',
      icon: isFullyOptimized ? CheckCircle : AlertTriangle,
      value: isFullyOptimized ? '£0 (Optimized)' : `£${syntheticQuarterlyLeakage.toLocaleString()}`,
      description: isFullyOptimized 
        ? `Target achieves a pristine ${perfScore}/100 performance score. Zero structural leakage detected across traffic conduits.`
        : `Synthetic projection based on standard traffic volume, real-time performance score (${perfScore}/100), and a ${(performanceFrictionMultiplier * 100).toFixed(1)}% friction drop-off rate.`,
      highlight: !isFullyOptimized
    },
    {
      id: 'ghost',
      isGreen: isGhostOptimal,
      title: 'Ghost Tap Window',
      icon: Ghost,
      value: isGhostOptimal ? '0.0s' : `${ghostTapWindow}s`,
      description: isGhostOptimal ? 'Main thread is unblocked.' : `Screen appears loaded, but taps on ${industryTerms.buttons} are ignored for ${ghostTapWindow}s.`,
    },
    {
      id: 'inp',
      isGreen: !isMapPenalized,
      title: 'Local SEO Penalty',
      icon: MapPin,
      value: `${rawInp}ms`,
      description: isMapPenalized ? `INP exceeds 200ms threshold. Google is actively suppressing ${industryTerms.penalty}.` : `INP is within passing limits.`,
    },
    {
      id: 'parasite',
      isGreen: parseFloat(parasiteImpact) === 0,
      title: 'Parasite Load',
      icon: ServerCrash,
      value: `${parasiteImpact}%`,
      description: parseFloat(parasiteImpact) === 0 ? 'Zero external tracking scripts detected.' : `${thirdPartyCount} external marketing scripts cause ${parasiteImpact}% of mobile lag.`,
    },
    {
      id: 'dns',
      isGreen: !isEmailVulnerable,
      title: 'Nurture Trust Risk',
      icon: MailWarning,
      value: isEmailVulnerable ? 'VULNERABLE' : 'SECURE',
      description: isEmailVulnerable ? `Missing DMARC/SPF. Outreach is highly likely routing to spam folders.` : `Domain authentication is intact.`,
    },
    {
      id: 'dom',
      isGreen: !isFragile,
      title: 'DOM Fragility',
      icon: Database,
      value: domSize,
      description: !isFragile ? `HTML structure is optimized.` : 'Massive HTML node count is draining batteries and risking browser crashes.',
    }
  ];

  return (
    <div className="min-h-screen bg-[#020205] text-white flex flex-col antialiased w-full overflow-x-hidden">
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes hologramScan {
          0% { transform: translateY(0px); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(340px); opacity: 0; }
        }
      `}} />

      {/* TOP PANE: Responsive Mobile-Optimized 3D Holographic Stage */}
      <div className="relative w-full h-[55vh] sm:h-[65vh] min-h-[420px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-950/40 via-[#020205] to-black overflow-hidden flex items-center justify-center border-b border-zinc-800 z-20 shrink-0">
        
        {/* The 3D Isometric Projection Engine with Responsive Scaling */}
        <div className="absolute inset-0 flex items-center justify-center [perspective:1200px] z-10 pointer-events-none px-2 mt-8 sm:mt-0">
          
          {/* Scaled up on both viewports using scale-[0.75] sm:scale-[1.15] */}
          <div className="relative w-[340px] h-[340px] sm:w-[460px] sm:h-[460px] [transform:scale(0.75)_rotateX(60deg)_rotateZ(45deg)] sm:[transform:scale(1.15)_rotateX(60deg)_rotateZ(45deg)] [transform-style:preserve-3d] transition-transform">
              
              {/* Glowing Base Plate & Grid Floor */}
              <div className="absolute inset-0 bg-cyan-950/80 border-2 border-cyan-500 shadow-[0_0_60px_rgba(6,182,212,0.3)] backdrop-blur-md" />
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#0891b266_2px,transparent_2px),linear-gradient(to_bottom,#0891b266_2px,transparent_2px)] bg-[size:24px_24px] opacity-80" />
              <div className="absolute top-0 left-0 w-full h-[4px] bg-white shadow-[0_0_30px_#22d3ee] animate-[hologramScan_4s_linear_infinite]" />
              
              {/* Background Decorative Blocks */}
              <DecorNode x={30} y={30} w={50} d={30} h={25} />
              <DecorNode x={280} y={50} w={40} d={60} h={40} />
              <DecorNode x={60} y={280} w={40} d={40} h={20} />
              <DecorNode x={280} y={280} w={50} d={50} h={30} />
              
              {/* Isolated Mobile-Optimized Telemetry Towers */}
              <DataNode x={50} y={50} w={50} d={50} h={hDom} color="cyan" label="DOM Nodes" value={domSize} />
              <DataNode x={270} y={60} w={45} d={45} h={hParasite} color="purple" label="Parasite Load" value={`${parasiteImpact}%`} />
              <DataNode x={50} y={270} w={50} d={50} h={hTbt} color="red" label="Thread Lock" value={`${rawTbt}ms`} />
              <DataNode x={220} y={270} w={45} d={50} h={hInp} color="orange" label="Latency (INP)" value={`${rawInp}ms`} />
          </div>
        </div>

        {/* Ambient Target Badge & Volatility Warning Overlay */}
        <div className="absolute bottom-3 left-3 right-3 sm:left-6 sm:bottom-4 flex flex-col gap-2 z-30 pointer-events-none max-w-sm sm:max-w-md">
            <div className="bg-black/85 border border-cyan-900/80 px-3.5 py-2.5 rounded-xl backdrop-blur-md shadow-xl pointer-events-auto">
              <div className="flex items-center gap-2 mb-1">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,1)]"></span>
                </span>
                <span className="text-[9px] sm:text-[10px] font-mono text-cyan-300 uppercase tracking-widest truncate">
                  Scanning {brandName} &bull; {scanTimestamp || 'Live'}
                </span>
              </div>
              <p className="text-[12px] sm:text-xs text-zinc-300 leading-relaxed font-light">
                Live telemetry data is inherently volatile and subject to real-time network fluctuations. Metrics fluctuate continuously based on active user traffic loads, necessitating continuous baseline logging.
              </p>
            </div>
        </div>
      </div>

      {/* BOTTOM PANE: Cold Data & Actions */}
      <div ref={scrollContainerRef} className="w-full relative z-10 bg-[radial-gradient(circle_at_top,rgba(6,182,212,0.05),transparent_60%)] flex-grow px-4 sm:px-8 py-8">
        <div className="max-w-3xl mx-auto w-full space-y-8 pb-16">
          
          <header className="border-b border-zinc-800 pb-5">
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">Synthetic Baseline Scan</h1>
            <p className="text-zinc-400 mt-1.5 font-mono text-xs sm:text-sm flex items-center gap-2 truncate">
                <Globe size={13} className="text-cyan-500 shrink-0" /> Target: {auditData.target.replace(/^https?:\/\//, '')}
            </p>
          </header>

          <section className="bg-gradient-to-br from-[#0a0a0f] to-[#12121c] border border-zinc-700/65 rounded-2xl p-5 sm:p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-purple-600/5 pointer-events-none"></div>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start relative z-10">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-400/30 flex items-center justify-center shrink-0 shadow-md">
                  <Cpu size={20} className="text-cyan-400" /> 
                </div>
                <div className="flex-1 w-full">
                    <h2 className="text-[10px] sm:text-[11px] font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 uppercase tracking-[0.2em] mb-2 sm:mb-3">
                        Initial AI Assessment
                    </h2>
                    <p className="text-xs sm:text-base text-zinc-300 leading-[1.7] font-light text-justify">
                        {dynamicSynthesis}
                    </p>
                </div>
            </div>
          </section>

          <section className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {frictionCards.map((card) => {
                const IconComponent = card.icon;
                return (
                  <div key={card.id} className={`bg-[#12121c] border ${card.highlight ? 'border-red-900/60 shadow-[0_0_25px_rgba(220,38,38,0.15)] bg-gradient-to-br from-[#1a0f14] to-[#12121c] sm:col-span-2' : card.isGreen ? 'border-green-900/30' : 'border-zinc-700/50'} rounded-2xl p-5 sm:p-7 relative overflow-hidden flex flex-col justify-between`}>
                    {card.highlight && <div className="absolute top-0 left-0 w-1.5 h-full bg-red-600 shadow-[0_0_10px_rgba(220,38,38,1)]"></div>}
                    <div className="relative z-10">
                      <div className={`flex items-center justify-between mb-3 ${card.highlight ? 'text-red-400' : card.isGreen ? 'text-green-400' : 'text-blue-400'}`}>
                        <div className="flex items-center gap-2 font-mono font-bold">
                            <IconComponent size={16} />
                            <h3 className="text-[10px] sm:text-[11px] uppercase tracking-widest">{card.title}</h3>
                        </div>
                        {card.highlight && <span className="text-[8px] sm:text-[9px] px-2 py-0.5 bg-red-500/10 border border-red-500/20 rounded font-mono uppercase">Synthetic</span>}
                      </div>
                      <div className={`${card.highlight ? 'text-4xl sm:text-5xl text-white' : 'text-2xl sm:text-3xl text-white'} font-black tracking-tight mb-2`}>
                        {card.value}
                      </div>
                      <p className={`text-xs sm:text-sm ${card.highlight ? 'text-zinc-300 font-mono' : 'text-zinc-400 font-light'} leading-relaxed`}>{card.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Tech Stack Migration */}
          <section className="bg-[#12121c] border border-zinc-700/50 rounded-2xl p-5 sm:p-8">
             <div className="flex items-center justify-between mb-5 border-b border-zinc-800 pb-3">
                <div className="flex items-center gap-2">
                  <Layers className="text-purple-400 shrink-0" size={16} />
                  <h2 className="text-[10px] sm:text-xs font-mono font-bold text-zinc-100 uppercase tracking-widest">Tech Stack Migration</h2>
                </div>
                <div className="flex items-center gap-1 bg-purple-500/10 border border-purple-500/30 px-2 py-0.5 rounded text-[9px] sm:text-[10px] font-mono text-purple-300">
                  <Lock size={10} /> Locked
                </div>
             </div>
             
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
              {infrastructure.length > 0 ? infrastructure.slice(0, 4).map((tech: any, idx: number) => {
                const rec = TECH_UPGRADES[tech.name] || { upgrade: "Edge Compute Offloading", reason: "Shifts processing to edge servers." };
                return (
                  <div key={idx} className="p-3.5 bg-black/40 border border-zinc-800 rounded-xl flex flex-col">
                      <div className="text-xs sm:text-sm font-bold text-zinc-200 mb-1">{tech.name}</div>
                      <div className="text-[9px] sm:text-[10px] font-mono text-cyan-400 uppercase tracking-widest mb-1.5">Upgrade &rarr; {rec.upgrade}</div>
                      <p className="text-[11px] sm:text-xs text-zinc-500 font-light mt-auto">{rec.reason}</p>
                  </div>
                );
              }) : (
                <div className="text-zinc-500 text-xs font-mono col-span-full">No infrastructure data available.</div>
              )}
             </div>

             {/* Locked Edge Computing Paywall CTA */}
             <div className="p-4 sm:p-5 bg-gradient-to-r from-purple-950/30 via-black/60 to-cyan-950/30 border border-purple-500/30 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                   <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center shrink-0 text-purple-400">
                      <Zap size={16} />
                   </div>
                   <div>
                      <div className="text-xs sm:text-sm font-bold text-white flex items-center gap-2 flex-wrap">
                        Edge Node Offloading 
                        <span className="text-[9px] font-mono bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded border border-purple-500/30 uppercase">Locked</span>
                      </div>
                      <p className="text-[11px] sm:text-xs text-zinc-400 font-light mt-0.5">Route requests through global edge workers to eliminate bottlenecks.</p>
                   </div>
                </div>
                <button 
                  onClick={handleDeployPixel}
                  className="w-full sm:w-auto bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-4 py-3 rounded-xl font-bold text-[11px] sm:text-xs uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-2 shrink-0 cursor-pointer"
                >
                  <Lock size={13} /> Unlock Edge Computing
                </button>
             </div>
          </section>

          <section className="pt-6 border-t border-zinc-800">
            <div className="bg-gradient-to-b from-zinc-900 to-black border border-zinc-700/80 rounded-2xl p-6 sm:p-8 text-center relative overflow-hidden shadow-2xl">
                <Lock size={20} className="text-cyan-400 mx-auto mb-3" />
                <h3 className="text-base sm:text-lg font-bold text-white mb-2">Verify The Damage</h3>
                <p className="text-xs sm:text-sm text-zinc-400 mb-6 max-w-sm mx-auto leading-relaxed">
                    Deploy the ClientScale tracker to capture actual user rage-taps and API failures from your live traffic.
                </p>
                <button onClick={handleDeployPixel} className="w-full bg-white hover:bg-gray-200 text-black py-3.5 sm:py-4 rounded-xl font-bold text-xs uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer">
                  Deploy Telemetry Pixel (48 Hrs)
                </button>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}